<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('market_id')->nullable()->constrained('markets')->nullOnDelete();
            $table->string('farm_name');
            $table->string('stall_number')->nullable();
            $table->string('farm_address')->nullable();
            $table->decimal('farm_latitude', 10, 8)->nullable();
            $table->decimal('farm_longitude', 11, 8)->nullable();
            $table->decimal('stall_latitude', 10, 8)->nullable();
            $table->decimal('stall_longitude', 11, 8)->nullable();
            $table->json('pickup_slots')->nullable();
            $table->unsignedInteger('cutoff_hours')->default(4);
            $table->enum('approval_status', ['pending', 'approved', 'suspended'])->default('pending');
            $table->json('stock_template')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_profiles');
    }
};
