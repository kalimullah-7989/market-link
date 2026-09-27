<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $farmer = $request->user();

        $products = Product::where('farmer_id', $farmer->id)
            ->with('category')
            ->latest()
            ->get();

        return $this->success($products, 'Farmer products retrieved');
    }

    public function store(Request $request)
    {
        $farmer = $request->user();
        $profile = $farmer->farmerProfile()->first();

        if (!$profile || $profile->approval_status !== 'approved') {
            return $this->error('Your farmer account is not approved by admin yet', 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'is_recurring' => 'nullable|boolean',
            'harvested_at' => 'nullable|date',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'farmer_id' => $farmer->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'unit' => $validated['unit'],
            'price' => $validated['price'],
            'stock_quantity' => $validated['stock_quantity'],
            'image' => $imagePath,
            'is_sold_out' => $validated['stock_quantity'] == 0,
            'is_recurring' => $validated['is_recurring'] ?? true,
            'harvested_at' => $validated['harvested_at'] ?? null,
        ]);

        return $this->success($product->load('category'), 'Product created successfully', 201);
    }

    public function show(Request $request, $id)
    {
        $product = Product::where('farmer_id', $request->user()->id)
            ->with('category')
            ->find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        return $this->success($product, 'Product retrieved');
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('farmer_id', $request->user()->id)->find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'sometimes|string|max:50',
            'price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'is_sold_out' => 'sometimes|boolean',
            'is_temporarily_unavailable' => 'sometimes|boolean',
            'is_recurring' => 'sometimes|boolean',
            'harvested_at' => 'nullable|date',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        if (isset($validated['stock_quantity'])) {
            $validated['is_sold_out'] = $validated['stock_quantity'] == 0;
        }

        $product->update($validated);

        return $this->success($product->load('category'), 'Product updated successfully');
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::where('farmer_id', $request->user()->id)->find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return $this->success(null, 'Product deleted successfully');
    }

    public function toggleStatus(Request $request, $id)
    {
        $product = Product::where('farmer_id', $request->user()->id)->find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        $field = $request->input('field', 'is_sold_out');

        if (!in_array($field, ['is_sold_out', 'is_temporarily_unavailable'])) {
            return $this->error('Invalid toggle field', 422);
        }

        $product->$field = !$product->$field;
        $product->save();

        return $this->success($product, "Product {$field} updated successfully");
    }

    public function saveStockTemplate(Request $request)
    {
        $farmer = $request->user();
        $profile = $farmer->farmerProfile()->first();

        if (!$profile) {
            return $this->error('Farmer profile not found', 404);
        }

        $products = Product::where('farmer_id', $farmer->id)
            ->where('is_recurring', true)
            ->get(['id', 'name', 'unit', 'price', 'stock_quantity', 'category_id'])
            ->toArray();

        $profile->stock_template = $products;
        $profile->save();

        return $this->success($products, 'Weekly stock template saved successfully');
    }

    public function applyStockTemplate(Request $request)
    {
        $farmer = $request->user();
        $profile = $farmer->farmerProfile()->first();

        if (!$profile || empty($profile->stock_template)) {
            return $this->error('No saved stock template found. Please save a template first.', 404);
        }

        foreach ($profile->stock_template as $item) {
            Product::where('id', $item['id'])
                ->where('farmer_id', $farmer->id)
                ->update([
                    'stock_quantity' => $item['stock_quantity'],
                    'price' => $item['price'],
                    'is_sold_out' => $item['stock_quantity'] == 0,
                    'is_temporarily_unavailable' => false,
                ]);
        }

        $updatedProducts = Product::where('farmer_id', $farmer->id)->get();

        return $this->success($updatedProducts, 'Weekly stock template applied successfully');
    }
}
