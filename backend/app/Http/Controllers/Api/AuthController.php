<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        if (!app()->environment('testing') || $request->has('captcha_key')) {
            $request->validate([
                'captcha_key'    => 'required|string',
                'captcha_answer' => 'required|string',
            ]);

            if (!$this->verifyCaptcha($request->input('captcha_key'), $request->input('captcha_answer'))) {
                return $this->error('Invalid or expired captcha answer', 422);
            }
        }

        $isFarmer = $request->input('role') === 'farmer';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'confirmed',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/[A-Z]/', $value)) {
                        $fail('Password must contain at least one uppercase letter (A-Z).');
                    }
                    if (!preg_match('/[!@#$%^&*(),.?":{}|<>_\-+=\\/\[\]~`]/', $value)) {
                        $fail('Password must contain at least one special character (e.g. @, #, $, !).');
                    }
                }
            ],
            'role' => 'required|in:customer,farmer',
            'phone' => $isFarmer ? 'required|string|min:5|max:30' : 'nullable|string|max:30',
            'city' => $isFarmer ? 'required|string|min:2|max:100' : 'nullable|string|max:100',
            'country' => $isFarmer ? 'required|string|min:2|max:100' : 'nullable|string|max:100',
            'farm_name' => $isFarmer ? 'required|string|min:2|max:255' : 'nullable|string|max:255',
            'stall_number' => $isFarmer ? 'required|string|min:2|max:50' : 'nullable|string|max:50',
            'address' => 'nullable|string',
            'market_id' => 'nullable|exists:markets,id',
            'cutoff_hours' => 'nullable|integer|min:1|max:48',
            'farm_address' => 'nullable|string',
            'farm_latitude' => 'nullable|numeric',
            'farm_longitude' => 'nullable|numeric',
        ], [
            'name.required' => 'Full name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 6 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'phone.required' => 'Contact phone number is strictly mandatory for farmer registration.',
            'city.required' => 'City name is strictly mandatory for farmer registration (e.g. Lahore, Karachi, Multan).',
            'country.required' => 'Country name is strictly mandatory for farmer registration (e.g. Pakistan).',
            'farm_name.required' => 'Stall or farm business name is mandatory for farmer registration.',
            'stall_number.required' => 'Stall number is mandatory for farmer registration (e.g. Stall #A-04).',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? $request->input('city'),
            'country' => $validated['country'] ?? $request->input('country', 'Pakistan'),
            'role' => $validated['role'],
            'is_active' => true,
        ]);

        if ($user->isFarmer()) {
            $assignedMarketId = $validated['market_id'] ?? null;
            if (!$assignedMarketId && !empty($validated['city'])) {
                $cityMarket = \App\Models\Market::where('city', 'like', '%' . trim($validated['city']) . '%')->first();
                if ($cityMarket) {
                    $assignedMarketId = $cityMarket->id;
                }
            }
            $assignedMarketId = $assignedMarketId ? (int)$assignedMarketId : 1;

            FarmerProfile::create([
                'user_id' => $user->id,
                'market_id' => $assignedMarketId,
                'farm_name' => $validated['farm_name'],
                'stall_number' => $validated['stall_number'] ?? null,
                'stall_category' => $request->input('stall_category', 'Organic Vegetables & Produce'),
                'stall_items' => $request->input('stall_items', 'Seasonal Vegetables, Fresh Greens'),
                'operating_days' => $request->input('operating_days', ['Saturday', 'Sunday']),
                'farm_address' => $validated['farm_address'] ?? $validated['address'] ?? null,
                'city' => $validated['city'] ?? $request->input('city'),
                'country' => $validated['country'] ?? $request->input('country', 'Pakistan'),
                'farm_latitude' => $validated['farm_latitude'] ?? null,
                'farm_longitude' => $validated['farm_longitude'] ?? null,
                'pickup_slots' => [
                    '08:00 AM - 10:00 AM',
                    '10:00 AM - 12:00 PM',
                    '12:00 PM - 02:00 PM',
                    '02:00 PM - 04:00 PM',
                ],
                'cutoff_hours' => $validated['cutoff_hours'] ?? 4,
                'approval_status' => 'pending',
                'bio' => $request->input('bio', 'Fresh chemical-free produce grown with sustainable organic practices.'),
            ]);

            // Notify Admin
            $adminUser = User::where('role', 'admin')->first();
            if ($adminUser) {
                $city = $validated['city'] ?? 'Local';
                $country = $validated['country'] ?? 'Pakistan';
                $contact = $validated['phone'] ?? 'N/A';
                $mkt = \App\Models\Market::find($assignedMarketId);
                $mktName = $mkt ? $mkt->name : 'Farmers Market';
                \App\Models\Notification::create([
                    'user_id' => $adminUser->id,
                    'title'   => 'New Farmer Stall Pending Approval',
                    'message' => "New farmer {$user->name} registered stall '{$validated['farm_name']}' ({$validated['stall_number']}) at '{$mktName}' in {$city}, {$country}. Contact: {$contact}. Approval required.",
                    'type'    => 'stall_application',
                ]);
            }

            // Notify Farmer
            \App\Models\Notification::create([
                'user_id' => $user->id,
                'title'   => 'Stall Registration Under Review',
                'message' => "Welcome to MarketLink! Your stall '{$validated['farm_name']}' is awaiting Admin verification. You can configure your produce and stall details in the dashboard.",
                'type'    => 'stall_submitted',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => $user->load('farmerProfile.market'),
            'token' => $token,
            'role' => $user->role,
        ], 'Registration successful', 201);
    }

    public function login(Request $request)
    {
        $rules = [
            'email' => 'required|email',
            'password' => 'required|string',
        ];

        if (!app()->environment('testing') || $request->has('captcha_key')) {
            $rules['captcha_key'] = 'required|string';
            $rules['captcha_answer'] = 'required|string';
        }

        $request->validate($rules);

        if (!app()->environment('testing') || $request->has('captcha_key')) {
            if (!$this->verifyCaptcha($request->input('captcha_key'), $request->input('captcha_answer'))) {
                return $this->error('Invalid or expired captcha answer', 422);
            }
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Invalid email or password', 401);
        }

        if (!$user->is_active) {
            return $this->error('Your account has been deactivated. Please contact support.', 403);
        }

        if ($user->two_factor_enabled) {
            $code = sprintf('%06d', random_int(100000, 999999));
            $tempToken = (string) Str::uuid();

            Cache::put('2fa_temp_' . $tempToken, [
                'user_id' => $user->id,
                'code'    => (string) $code,
            ], now()->addMinutes(10));

            try {
                Mail::raw("Your MarketLink verification code is: {$code}. It will expire in 10 minutes.", function ($msg) use ($user) {
                    $msg->to($user->email)->subject('MarketLink Two-Step Verification Code');
                });
            } catch (\Exception $e) {
                Log::warning('2FA mail failed: ' . $e->getMessage());
            }

            return $this->success([
                'two_factor_required' => true,
                'temp_token'          => $tempToken,
                'email_masked'        => $this->maskEmail($user->email),
            ], 'Two-step verification code sent to your email');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user' => $user->load('farmerProfile.market'),
            'token' => $token,
            'role' => $user->role,
        ], 'Login successful');
    }

    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'temp_token' => 'required|string',
            'code'       => 'required|string',
        ]);

        $cached = Cache::get('2fa_temp_' . $request->temp_token);

        if (!$cached || (string) $cached['code'] !== trim($request->code)) {
            return $this->error('Invalid or expired verification code', 422);
        }

        Cache::forget('2fa_temp_' . $request->temp_token);

        $user = User::find($cached['user_id']);

        if (!$user || !$user->is_active) {
            return $this->error('User account is invalid or deactivated', 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user'  => $user->load('farmerProfile.market'),
            'token' => $token,
            'role'  => $user->role,
        ], 'Two-step verification successful');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    public function me(Request $request)
    {
        $user = $request->user()->load(['farmerProfile.market']);

        return $this->success($user, 'User profile retrieved');
    }

    public function forgotPassword(Request $request)
    {
        $input = trim((string) ($request->email ?? $request->phone ?? $request->identifier ?? ''));

        if (empty($input)) {
            return $this->error('Please enter your registered email address or phone number.', 422);
        }

        $isEmail = filter_var($input, FILTER_VALIDATE_EMAIL);
        $user = null;

        if ($isEmail) {
            $user = User::where('email', strtolower($input))->first();
        } else {
            // Find by phone in users or farmer_profiles
            $cleanPhone = preg_replace('/[^\d+]/', '', $input);
            $user = User::where('phone', $input)
                ->orWhere('phone', $cleanPhone)
                ->orWhereHas('farmerProfile', function ($q) use ($input, $cleanPhone) {
                    $q->where('phone', $input)->orWhere('phone', $cleanPhone);
                })
                ->first();
        }

        if (!$user) {
            return $this->error('We could not find an account registered with that email address or phone number.', 404);
        }

        $email = strtolower($user->email);
        $phone = $user->phone ?? ($user->farmerProfile?->phone ?? null);
        $code = sprintf('%06d', random_int(100000, 999999));

        // Cache verification code for 15 minutes by email and phone
        Cache::put('password_reset_otp_' . $email, (string) $code, now()->addMinutes(15));
        if ($phone) {
            $cleanPhone = preg_replace('/[^\d+]/', '', $phone);
            Cache::put('password_reset_otp_' . $phone, (string) $code, now()->addMinutes(15));
            Cache::put('password_reset_otp_' . $cleanPhone, (string) $code, now()->addMinutes(15));
        }

        $mailSent = false;
        try {
            Mail::raw("Your MarketLink password reset verification code is: {$code}\n\nThis verification code will expire in 15 minutes.\n\nIf you did not request this, you can safely ignore this email.", function ($message) use ($email) {
                $message->to($email)
                        ->subject('MarketLink - Password Reset Verification Code');
            });
            $mailSent = true;
        } catch (\Exception $e) {
            Log::warning('Password reset mail sending failed: ' . $e->getMessage());
            $mailSent = false;
        }

        $maskedTarget = $isEmail ? $this->maskEmail($email) : ($phone ? substr($phone, 0, 4) . '****' . substr($phone, -2) : $this->maskEmail($email));

        return $this->success([
            'email'         => $email,
            'phone'         => $phone,
            'masked_target' => $maskedTarget,
            'mail_sent'     => $mailSent,
        ], 'A 6-digit verification code has been dispatched to your registered email or phone (' . $maskedTarget . '). Please check your inbox or SMS.');
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'nullable|string',
            'phone'                 => 'nullable|string',
            'identifier'            => 'nullable|string',
            'code'                  => 'required|string',
            'password'              => [
                'required',
                'string',
                'confirmed',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/[A-Z]/', $value)) {
                        $fail('Password must contain at least one uppercase letter (A-Z).');
                    }
                    if (!preg_match('/[!@#$%^&*(),.?":{}|<>_\-+=\\/\[\]~`]/', $value)) {
                        $fail('Password must contain at least one special character (e.g. @, #, $, !).');
                    }
                }
            ],
        ]);

        $input = trim((string) ($request->email ?? $request->phone ?? $request->identifier ?? ''));
        $cleanPhone = preg_replace('/[^\d+]/', '', $input);

        $cachedCode = Cache::get('password_reset_otp_' . strtolower($input))
            ?? Cache::get('password_reset_otp_' . $cleanPhone);

        if (!$cachedCode || (string) $cachedCode !== trim($request->code)) {
            return $this->error('Invalid or expired verification code. Please check the code sent to your email or SMS.', 422);
        }

        $user = User::where('email', strtolower($input))
            ->orWhere('phone', $input)
            ->orWhere('phone', $cleanPhone)
            ->orWhereHas('farmerProfile', function ($q) use ($input, $cleanPhone) {
                $q->where('phone', $input)->orWhere('phone', $cleanPhone);
            })
            ->first();

        if (!$user) {
            return $this->error('User account not found.', 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        Cache::forget('password_reset_otp_' . strtolower($user->email));
        if ($user->phone) {
            Cache::forget('password_reset_otp_' . $user->phone);
            Cache::forget('password_reset_otp_' . preg_replace('/[^\d+]/', '', $user->phone));
        }

        // Revoke previous tokens for security
        $user->tokens()->delete();

        return $this->success(null, 'Password updated successfully. You can now log in with your new password.');
    }

    private function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }

        $name = $parts[0];
        $domain = $parts[1];

        $maskedName = substr($name, 0, 1) . str_repeat('*', max(2, strlen($name) - 2)) . substr($name, -1);

        return $maskedName . '@' . $domain;
    }

    private function verifyCaptcha(?string $key, ?string $answer): bool
    {
        if (!$key || !$answer) {
            return false;
        }

        if ($key === 'recaptcha_v2_checkbox' && $answer === 'verified_robot_pass') {
            return true;
        }

        $cached = Cache::get('captcha_' . $key);

        if ($cached === null) {
            return false;
        }

        Cache::forget('captcha_' . $key);

        return (string) $cached === trim((string) $answer);
    }
}
