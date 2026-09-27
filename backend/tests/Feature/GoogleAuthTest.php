<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_google_redirect_returns_redirect_response(): void
    {
        $response = $this->get('/api/auth/google');

        $response->assertStatus(302);
        $this->assertStringContainsString('accounts.google.com', $response->headers->get('Location'));
    }

    public function test_callback_creates_new_customer_and_redirects_to_frontend_with_token(): void
    {
        $abstractUser = Mockery::mock(SocialiteUser::class);
        $abstractUser->shouldReceive('getId')->andReturn('google-12345');
        $abstractUser->shouldReceive('getName')->andReturn('Ayesha Khan');
        $abstractUser->shouldReceive('getEmail')->andReturn('ayesha@gmail.com');
        $abstractUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/avatar.jpg');

        $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($abstractUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/api/auth/google/callback');

        $response->assertStatus(302);
        $targetUrl = $response->headers->get('Location');

        $this->assertStringContainsString('http://localhost:5173/auth/callback', $targetUrl);
        $this->assertStringContainsString('token=', $targetUrl);
        $this->assertStringContainsString('ayesha%40gmail.com', $targetUrl);
        $this->assertStringContainsString('role=customer', $targetUrl);

        $this->assertDatabaseHas('users', [
            'email' => 'ayesha@gmail.com',
            'name' => 'Ayesha Khan',
            'role' => 'customer',
        ]);
    }

    public function test_callback_logs_in_existing_user_without_creating_duplicate(): void
    {
        User::create([
            'name' => 'Existing Customer',
            'email' => 'existing@gmail.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'is_active' => true,
        ]);

        $abstractUser = Mockery::mock(SocialiteUser::class);
        $abstractUser->shouldReceive('getId')->andReturn('google-99999');
        $abstractUser->shouldReceive('getName')->andReturn('Existing Customer Updated');
        $abstractUser->shouldReceive('getEmail')->andReturn('existing@gmail.com');
        $abstractUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/updated.jpg');

        $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($abstractUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/api/auth/google/callback');

        $response->assertStatus(302);
        $this->assertEquals(1, User::where('email', 'existing@gmail.com')->count());
    }

    public function test_callback_blocks_suspended_user(): void
    {
        User::create([
            'name' => 'Suspended Customer',
            'email' => 'suspended@gmail.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'is_active' => false,
        ]);

        $abstractUser = Mockery::mock(SocialiteUser::class);
        $abstractUser->shouldReceive('getId')->andReturn('google-88888');
        $abstractUser->shouldReceive('getName')->andReturn('Suspended Customer');
        $abstractUser->shouldReceive('getEmail')->andReturn('suspended@gmail.com');
        $abstractUser->shouldReceive('getAvatar')->andReturn(null);

        $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($abstractUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/api/auth/google/callback');

        $response->assertStatus(302);
        $targetUrl = $response->headers->get('Location');
        $this->assertStringContainsString('error=account_suspended', $targetUrl);
    }
}
