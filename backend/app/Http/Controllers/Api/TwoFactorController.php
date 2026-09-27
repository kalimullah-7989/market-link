<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    public function status(Request $request)
    {
        $user = $request->user();

        return $this->success([
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
        ], 'Two-factor authentication status retrieved');
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'enable' => 'required|boolean',
        ]);

        $user = $request->user();
        $user->update([
            'two_factor_enabled' => $validated['enable'],
        ]);

        return $this->success([
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
        ], $validated['enable'] ? 'Two-step verification enabled successfully' : 'Two-step verification disabled successfully');
    }
}
