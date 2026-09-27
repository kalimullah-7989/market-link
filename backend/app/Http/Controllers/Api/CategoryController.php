<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($q) {
                $q->where('is_sold_out', false)
                    ->where('is_temporarily_unavailable', false);
            }])
            ->get();

        return $this->success($categories, 'Categories retrieved successfully');
    }
}
