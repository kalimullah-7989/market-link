<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_customer(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ali Khan',
            'email' => 'ali@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'role' => 'customer',
            'phone' => '03001234567',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => 'customer',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'ali@example.com',
            'role' => 'customer',
        ]);
    }

    public function test_can_register_farmer(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Tariq Farmer',
            'email' => 'tariq@farm.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'role' => 'farmer',
            'farm_name' => 'Green Valley Farm',
            'stall_number' => 'Stall #12',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => 'farmer',
                ],
            ]);

        $this->assertDatabaseHas('farmer_profiles', [
            'farm_name' => 'Green Valley Farm',
            'approval_status' => 'pending',
        ]);
    }

    public function test_can_login_with_valid_credentials(): void
    {
        $user = User::create([
            'name' => 'Sara Ahmed',
            'email' => 'sara@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'sara@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => 'customer',
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_cannot_login_with_invalid_credentials(): void
    {
        User::create([
            'name' => 'Sara Ahmed',
            'email' => 'sara@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'sara@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_can_get_user_profile(): void
    {
        $user = User::create([
            'name' => 'Hamza Ali',
            'email' => 'hamza@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'hamza@example.com',
                ],
            ]);
    }
}
