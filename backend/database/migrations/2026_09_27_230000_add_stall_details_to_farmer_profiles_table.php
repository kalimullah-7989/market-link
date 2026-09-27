<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('farmer_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('farmer_profiles', 'stall_category')) {
                $table->string('stall_category')->nullable()->after('stall_number');
            }
            if (!Schema::hasColumn('farmer_profiles', 'stall_items')) {
                $table->text('stall_items')->nullable()->after('stall_category');
            }
            if (!Schema::hasColumn('farmer_profiles', 'operating_days')) {
                $table->json('operating_days')->nullable()->after('stall_items');
            }
        });
    }

    public function down(): void
    {
        Schema::table('farmer_profiles', function (Blueprint $table) {
            $table->dropColumn(['stall_category', 'stall_items', 'operating_days']);
        });
    }
};
