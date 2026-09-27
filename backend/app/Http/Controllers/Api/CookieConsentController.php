<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CookieConsentController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return $this->success([
            'essential_cookie_consent'    => (bool) $user->essential_cookie_consent,
            'essential_cookie_consent_at' => $user->essential_cookie_consent_at?->toIso8601String(),
        ], 'Cookie consent status retrieved');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'accepted' => 'required|boolean',
        ]);

        $user = $request->user();

        $user->update([
            'essential_cookie_consent'    => $validated['accepted'],
            'essential_cookie_consent_at' => $validated['accepted'] ? now() : null,
        ]);

        return $this->success([
            'essential_cookie_consent'    => $user->essential_cookie_consent,
            'essential_cookie_consent_at' => $user->essential_cookie_consent_at?->toIso8601String(),
        ], 'Essential cookie consent recorded successfully');
    }
}
