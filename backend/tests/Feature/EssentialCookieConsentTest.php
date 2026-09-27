<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EssentialCookieConsentTest extends TestCase
{
    use RefreshDatabase;

    private $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::create([
            'name'     => 'Hamza Ali',
            'email'    => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role'     => 'customer',
        ]);
    }

    public function test_new_user_defaults_to_unaccepted_cookie_consent(): void
    {
        $this->assertFalse((bool) $this->customer->essential_cookie_consent);
        $this->assertNull($this->customer->essential_cookie_consent_at);

        $response = $this->actingAs($this->customer, 'sanctum')->getJson('/api/cookie-consent');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'essential_cookie_consent'    => false,
                    'essential_cookie_consent_at' => null,
                ],
            ]);
    }

    public function test_authenticated_user_can_record_essential_cookie_consent(): void
    {
        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/cookie-consent', [
            'accepted' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Essential cookie consent recorded successfully',
                'data'    => [
                    'essential_cookie_consent' => true,
                ],
            ]);

        $this->assertNotNull($response->json('data.essential_cookie_consent_at'));

        $this->customer->refresh();
        $this->assertTrue((bool) $this->customer->essential_cookie_consent);
        $this->assertNotNull($this->customer->essential_cookie_consent_at);
    }

    public function test_user_can_update_consent_status(): void
    {
        $this->actingAs($this->customer, 'sanctum')->postJson('/api/cookie-consent', [
            'accepted' => true,
        ])->assertStatus(200);

        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/cookie-consent', [
            'accepted' => false,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'essential_cookie_consent'    => false,
                    'essential_cookie_consent_at' => null,
                ],
            ]);

        $this->customer->refresh();
        $this->assertFalse((bool) $this->customer->essential_cookie_consent);
        $this->assertNull($this->customer->essential_cookie_consent_at);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/cookie-consent')->assertStatus(401);
        $this->postJson('/api/cookie-consent', ['accepted' => true])->assertStatus(401);
    }

    public function test_validation_fails_when_accepted_field_is_missing(): void
    {
        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/cookie-consent', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['accepted']);
    }
}
