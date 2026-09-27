<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'city')) {
                $table->string('city', 100)->nullable()->after('address');
            }
            if (!Schema::hasColumn('users', 'country')) {
                $table->string('country', 100)->nullable()->after('city');
            }
        });

        Schema::table('farmer_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('farmer_profiles', 'city')) {
                $table->string('city', 100)->nullable()->after('farm_address');
            }
            if (!Schema::hasColumn('farmer_profiles', 'country')) {
                $table->string('country', 100)->nullable()->after('city');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['city', 'country']);
        });

        Schema::table('farmer_profiles', function (Blueprint $table) {
            $table->dropColumn(['city', 'country']);
        });
    }
};
