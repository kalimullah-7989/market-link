<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('farmer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('market_id')->nullable()->constrained('markets')->nullOnDelete();
            $table->date('pickup_date');
            $table->string('pickup_time_slot');
            $table->dateTime('cutoff_datetime');
            $table->decimal('total_amount', 10, 2);
            $table->enum('order_status', ['placed', 'accepted', 'ready_for_pickup', 'completed', 'cancelled'])->default('placed');
            $table->enum('payment_status', ['unpaid_cash', 'paid_cash'])->default('unpaid_cash');
            $table->string('pickup_token')->nullable();
            $table->text('farmer_notes')->nullable();
            $table->string('cancelled_reason')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
