<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class TwoFactorAuthTest extends TestCase
{
    use RefreshDatabase;

    private $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::create([
            'name'               => 'Hamza Ali',
            'email'              => 'hamza@customer.com',
            'password'           => bcrypt('password123'),
            'role'               => 'customer',
            'two_factor_enabled' => false,
        ]);
    }

    public function test_user_can_inspect_and_toggle_two_factor_setting(): void
    {
        $statusRes = $this->actingAs($this->customer, 'sanctum')->getJson('/api/two-factor/status');
        $statusRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'two_factor_enabled' => false,
                ],
            ]);

        $toggleRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/two-factor/toggle', [
            'enable' => true,
        ]);
        $toggleRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'two_factor_enabled' => true,
                ],
            ]);

        $this->customer->refresh();
        $this->assertTrue((bool) $this->customer->two_factor_enabled);

        $disableRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/two-factor/toggle', [
            'enable' => false,
        ]);
        $disableRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'two_factor_enabled' => false,
                ],
            ]);

        $this->customer->refresh();
        $this->assertFalse((bool) $this->customer->two_factor_enabled);
    }

    public function test_login_returns_two_factor_challenge_when_enabled(): void
    {
        $this->customer->update(['two_factor_enabled' => true]);

        $response = $this->postJson('/api/login', [
            'email'    => 'hamza@customer.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'two_factor_required' => true,
                ],
            ])
            ->assertJsonStructure([
                'data' => [
                    'two_factor_required',
                    'temp_token',
                    'email_masked',
                ],
            ]);

        $tempToken = $response->json('data.temp_token');
        $this->assertNotEmpty($tempToken);
        $this->assertTrue(Cache::has('2fa_temp_' . $tempToken));
    }

    public function test_user_can_complete_login_with_correct_two_factor_code(): void
    {
        $this->customer->update(['two_factor_enabled' => true]);

        $loginRes = $this->postJson('/api/login', [
            'email'    => 'hamza@customer.com',
            'password' => 'password123',
        ]);

        $tempToken = $loginRes->json('data.temp_token');
        $cachedData = Cache::get('2fa_temp_' . $tempToken);
        $validCode = $cachedData['code'];

        $verifyRes = $this->postJson('/api/login/two-factor', [
            'temp_token' => $tempToken,
            'code'       => $validCode,
        ]);

        $verifyRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Two-step verification successful',
            ])
            ->assertJsonStructure([
                'data' => [
                    'user',
                    'token',
                    'role',
                ],
            ]);

        $this->assertEquals('customer', $verifyRes->json('data.role'));
    }

    public function test_two_factor_fails_with_invalid_code(): void
    {
        $this->customer->update(['two_factor_enabled' => true]);

        $loginRes = $this->postJson('/api/login', [
            'email'    => 'hamza@customer.com',
            'password' => 'password123',
        ]);

        $tempToken = $loginRes->json('data.temp_token');

        $verifyRes = $this->postJson('/api/login/two-factor', [
            'temp_token' => $tempToken,
            'code'       => '000000',
        ]);

        $verifyRes->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid or expired verification code',
            ]);
    }

    public function test_two_factor_code_cannot_be_reused(): void
    {
        $this->customer->update(['two_factor_enabled' => true]);

        $loginRes = $this->postJson('/api/login', [
            'email'    => 'hamza@customer.com',
            'password' => 'password123',
        ]);

        $tempToken = $loginRes->json('data.temp_token');
        $cachedData = Cache::get('2fa_temp_' . $tempToken);
        $validCode = $cachedData['code'];

        $this->postJson('/api/login/two-factor', [
            'temp_token' => $tempToken,
            'code'       => $validCode,
        ])->assertStatus(200);

        $secondRes = $this->postJson('/api/login/two-factor', [
            'temp_token' => $tempToken,
            'code'       => $validCode,
        ]);

        $secondRes->assertStatus(422);
    }
}
