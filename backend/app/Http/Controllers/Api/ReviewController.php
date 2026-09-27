<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $order = Order::where('customer_id', $request->user()->id)->find($validated['order_id']);

        if (!$order) {
            return $this->error('Order not found or does not belong to your account', 404);
        }

        if ($order->order_status !== 'completed') {
            return $this->error('Reviews can only be submitted after the order has been completed and picked up.', 400);
        }

        if ($order->review) {
            return $this->error('You have already submitted a review for this order.', 400);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => $request->user()->id,
            'farmer_id' => $order->farmer_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        Notification::create([
            'user_id' => $order->farmer_id,
            'title' => 'New Customer Review!',
            'message' => "Customer {$request->user()->name} rated your service {$validated['rating']} stars for Order #{$order->order_number}",
            'type' => 'review_received',
            'order_id' => $order->id,
        ]);

        return $this->success($review->load('customer'), 'Review submitted successfully', 201);
    }

    public function farmerReply(Request $request, $id)
    {
        $farmer = $request->user();

        $review = Review::where('farmer_id', $farmer->id)->find($id);

        if (!$review) {
            return $this->error('Review not found or does not belong to your stall', 404);
        }

        $validated = $request->validate([
            'farmer_reply' => 'required|string',
        ]);

        $review->update([
            'farmer_reply' => $validated['farmer_reply'],
            'replied_at' => Carbon::now(),
        ]);

        Notification::create([
            'user_id' => $review->customer_id,
            'title' => 'Farmer Replied to Your Review',
            'message' => "{$farmer->name} replied to your review on Order #{$review->order->order_number}",
            'type' => 'review_reply',
            'order_id' => $review->order_id,
        ]);

        return $this->success($review, 'Reply posted successfully');
    }
}
