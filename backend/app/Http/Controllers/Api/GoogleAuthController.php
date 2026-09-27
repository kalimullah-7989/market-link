<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmerProfile;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(\Illuminate\Http\Request $request)
    {
        $role = $request->query('role', 'customer');
        if (!in_array($role, ['customer', 'farmer'])) {
            $role = 'customer';
        }

        return Socialite::driver('google')
            ->stateless()
            ->with(['state' => $role])
            ->redirect();
    }

    public function callback(\Illuminate\Http\Request $request)
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            Log::error('Google OAuth callback failed: ' . $e->getMessage());
            return redirect($frontendUrl . '/auth/callback?error=google_auth_failed');
        }

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            if (!$user->is_active) {
                return redirect($frontendUrl . '/auth/callback?error=account_suspended');
            }

            $user->update([
                'avatar' => $user->avatar ?? $googleUser->getAvatar(),
            ]);
        } else {
            $targetRole = $request->query('state', 'customer');
            if (!in_array($targetRole, ['customer', 'farmer'])) {
                $targetRole = 'customer';
            }

            $user = User::create([
                'name'      => $googleUser->getName() ?: 'Google User',
                'email'     => $googleUser->getEmail(),
                'password'  => bcrypt(\Illuminate\Support\Str::random(24)),
                'role'      => $targetRole,
                'avatar'    => $googleUser->getAvatar(),
                'is_active' => true,
            ]);

            if ($user->role === 'farmer') {
                FarmerProfile::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'farm_name'       => $user->name . "'s Organic Farm",
                        'stall_number'    => 'Stall #A-' . str_pad($user->id, 2, '0', STR_PAD_LEFT),
                        'approval_status' => 'pending',
                        'cutoff_hours'    => 4,
                    ]
                );
            }
        }

        $token = $user->createToken('google-auth')->plainTextToken;

        $params = http_build_query([
            'token'  => $token,
            'id'     => $user->id,
            'name'   => $user->name,
            'email'  => $user->email,
            'role'   => $user->role,
            'avatar' => $user->avatar ?: '',
        ]);

        return redirect($frontendUrl . '/auth/callback?' . $params);
    }
}
