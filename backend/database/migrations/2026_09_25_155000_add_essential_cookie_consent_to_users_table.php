<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('essential_cookie_consent')->default(false)->after('is_active');
            $table->timestamp('essential_cookie_consent_at')->nullable()->after('essential_cookie_consent');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['essential_cookie_consent', 'essential_cookie_consent_at']);
        });
    }
};
