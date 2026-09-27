<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class CaptchaAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_generate_captcha_challenge(): void
    {
        $response = $this->getJson('/api/captcha');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Captcha generated',
            ])
            ->assertJsonStructure([
                'data' => [
                    'captcha_key',
                    'question',
                    'expires_in_seconds',
                ],
            ]);

        $key = $response->json('data.captcha_key');
        $this->assertNotEmpty($key);
        $this->assertTrue(Cache::has('captcha_' . $key));
    }

    public function test_cannot_login_with_invalid_captcha_answer(): void
    {
        User::create([
            'name'     => 'Hamza Ali',
            'email'    => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role'     => 'customer',
        ]);

        $captchaRes = $this->getJson('/api/captcha');
        $key = $captchaRes->json('data.captcha_key');

        $response = $this->postJson('/api/login', [
            'email'          => 'hamza@customer.com',
            'password'       => 'password123',
            'captcha_key'    => $key,
            'captcha_answer' => '99999',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid or expired captcha answer',
            ]);
    }

    public function test_can_login_with_valid_captcha_answer(): void
    {
        User::create([
            'name'     => 'Hamza Ali',
            'email'    => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role'     => 'customer',
        ]);

        $captchaRes = $this->getJson('/api/captcha');
        $key = $captchaRes->json('data.captcha_key');
        $correctAnswer = Cache::get('captcha_' . $key);

        $response = $this->postJson('/api/login', [
            'email'          => 'hamza@customer.com',
            'password'       => 'password123',
            'captcha_key'    => $key,
            'captcha_answer' => $correctAnswer,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login successful',
            ]);
    }

    public function test_captcha_is_single_use_and_cannot_be_reused(): void
    {
        User::create([
            'name'     => 'Hamza Ali',
            'email'    => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role'     => 'customer',
        ]);

        $captchaRes = $this->getJson('/api/captcha');
        $key = $captchaRes->json('data.captcha_key');
        $correctAnswer = Cache::get('captcha_' . $key);

        $this->postJson('/api/login', [
            'email'          => 'hamza@customer.com',
            'password'       => 'password123',
            'captcha_key'    => $key,
            'captcha_answer' => $correctAnswer,
        ])->assertStatus(200);

        $secondAttempt = $this->postJson('/api/login', [
            'email'          => 'hamza@customer.com',
            'password'       => 'password123',
            'captcha_key'    => $key,
            'captcha_answer' => $correctAnswer,
        ]);

        $secondAttempt->assertStatus(422);
    }

    public function test_can_register_customer_with_valid_captcha(): void
    {
        $captchaRes = $this->getJson('/api/captcha');
        $key = $captchaRes->json('data.captcha_key');
        $correctAnswer = Cache::get('captcha_' . $key);

        $response = $this->postJson('/api/register', [
            'name'                  => 'Zainab Bibi',
            'email'                 => 'zainab.new@customer.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'role'                  => 'customer',
            'phone'                 => '03001234567',
            'address'               => 'Model Town, Lahore',
            'captcha_key'           => $key,
            'captcha_answer'        => $correctAnswer,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Registration successful',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'zainab.new@customer.com',
            'role'  => 'customer',
        ]);
    }

    public function test_cannot_register_with_wrong_captcha(): void
    {
        $captchaRes = $this->getJson('/api/captcha');
        $key = $captchaRes->json('data.captcha_key');

        $response = $this->postJson('/api/register', [
            'name'                  => 'Zainab Bibi',
            'email'                 => 'zainab.fake@customer.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'role'                  => 'customer',
            'phone'                 => '03001234567',
            'captcha_key'           => $key,
            'captcha_answer'        => '0',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('users', [
            'email' => 'zainab.fake@customer.com',
        ]);
    }
}
