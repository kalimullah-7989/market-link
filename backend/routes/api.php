<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CaptchaController;
use App\Http\Controllers\Api\CookieConsentController;
use App\Http\Controllers\Api\Customer\CartController;
use App\Http\Controllers\Api\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\Farmer\OrderController as FarmerOrderController;
use App\Http\Controllers\Api\Farmer\ProductController as FarmerProductController;
use App\Http\Controllers\Api\Farmer\InsightsController as FarmerInsightsController;
use App\Http\Controllers\Api\Farmer\ProfileController as FarmerProfileController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\LocalizationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\TwoFactorController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'success' => true,
        'message' => 'MarketLink API is running successfully',
    ]);
});

Route::get('/captcha', [CaptchaController::class, 'generate']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/two-factor', [AuthController::class, 'verifyTwoFactor']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::get('/markets', [MarketController::class, 'index']);
Route::get('/markets/{id}', [MarketController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/farmers', [FarmerController::class, 'index']);
Route::get('/farmers/{id}', [FarmerController::class, 'show']);
Route::get('/farmers/{id}/pickup-slots', [FarmerController::class, 'pickupSlots']);

Route::get('/search', SearchController::class);

Route::get('/localization/countries', [LocalizationController::class, 'countries']);
Route::get('/localization/translations/{locale}', [LocalizationController::class, 'translations']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/cookie-consent', [CookieConsentController::class, 'show']);
    Route::post('/cookie-consent', [CookieConsentController::class, 'store']);

    Route::get('/two-factor/status', [TwoFactorController::class, 'status']);
    Route::post('/two-factor/toggle', [TwoFactorController::class, 'toggle']);

    Route::get('/localization/preference', [LocalizationController::class, 'getPreference']);
    Route::post('/localization/preference', [LocalizationController::class, 'setPreference']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);

    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::middleware('role:farmer')->prefix('farmer')->group(function () {
        Route::get('/profile', [FarmerProfileController::class, 'show']);
        Route::put('/profile', [FarmerProfileController::class, 'update']);
        Route::post('/stall/apply', [FarmerProfileController::class, 'submitStall']);

        Route::get('/products', [FarmerProductController::class, 'index']);
        Route::post('/products', [FarmerProductController::class, 'store']);
        Route::get('/products/{id}', [FarmerProductController::class, 'show']);
        Route::put('/products/{id}', [FarmerProductController::class, 'update']);
        Route::delete('/products/{id}', [FarmerProductController::class, 'destroy']);
        Route::patch('/products/{id}/toggle-status', [FarmerProductController::class, 'toggleStatus']);

        Route::post('/stock-template/save', [FarmerProductController::class, 'saveStockTemplate']);
        Route::post('/stock-template/apply', [FarmerProductController::class, 'applyStockTemplate']);

        Route::get('/orders', [FarmerOrderController::class, 'index']);
        Route::post('/orders/{id}/status', [FarmerOrderController::class, 'updateStatus']);
        Route::post('/verify-order', [FarmerOrderController::class, 'verifyOrder']);

        Route::post('/reviews/{id}/reply', [ReviewController::class, 'farmerReply']);

        Route::get('/insights', [FarmerInsightsController::class, 'index']);
    });

    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'add']);
        Route::patch('/cart/{id}', [CartController::class, 'update']);
        Route::delete('/cart/{id}', [CartController::class, 'remove']);
        Route::delete('/cart', [CartController::class, 'clear']);
        Route::post('/cart/checkout', [CartController::class, 'checkout']);

        Route::get('/orders', [CustomerOrderController::class, 'index']);
        Route::post('/orders', [CustomerOrderController::class, 'store']);
        Route::get('/orders/{id}', [CustomerOrderController::class, 'show']);
        Route::put('/orders/{id}', [CustomerOrderController::class, 'update']);
        Route::post('/orders/{id}/cancel', [CustomerOrderController::class, 'cancel']);
        Route::get('/orders/{id}/receipt', [CustomerOrderController::class, 'receipt']);
        Route::post('/orders/{id}/reorder', [CustomerOrderController::class, 'reorder']);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        Route::get('/farmers', [AdminController::class, 'farmers']);
        Route::post('/farmers/{id}/status', [AdminController::class, 'updateFarmerStatus']);

        Route::get('/customers', [AdminController::class, 'customers']);
        Route::post('/customers/{id}/toggle-status', [AdminController::class, 'toggleCustomerStatus']);

        Route::post('/markets', [AdminController::class, 'storeMarket']);
        Route::put('/markets/{id}', [AdminController::class, 'updateMarket']);
        Route::delete('/markets/{id}', [AdminController::class, 'destroyMarket']);

        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [AdminController::class, 'destroyCategory']);

        Route::delete('/moderation/products/{id}', [AdminController::class, 'moderateProduct']);
        Route::delete('/moderation/reviews/{id}', [AdminController::class, 'moderateReview']);
    });
});
