<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocalizationTest extends TestCase
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

    public function test_can_fetch_supported_countries_and_locales(): void
    {
        $response = $this->getJson('/api/localization/countries');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'country_code',
                        'country_name',
                        'default_locale',
                        'language_name',
                        'direction',
                        'currency_code',
                        'currency_symbol',
                    ],
                ],
            ]);

        $countries = collect($response->json('data'));
        $this->assertTrue($countries->contains('country_code', 'PK'));
        $this->assertTrue($countries->contains('country_code', 'GB'));
        $this->assertTrue($countries->contains('country_code', 'SA'));
    }

    public function test_can_fetch_english_translations(): void
    {
        $response = $this->getJson('/api/localization/translations/en');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'locale'    => 'en',
                    'direction' => 'ltr',
                ],
            ]);

        $this->assertNotEmpty($response->json('data.translations.app_title'));
        $this->assertEquals('MarketLink', $response->json('data.translations.app_title'));
    }

    public function test_can_fetch_urdu_translations_with_rtl_direction(): void
    {
        $response = $this->getJson('/api/localization/translations/ur');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'locale'    => 'ur',
                    'direction' => 'rtl',
                ],
            ]);

        $this->assertNotEmpty($response->json('data.translations.app_title'));
        $this->assertStringContainsString('مارکیٹ', $response->json('data.translations.app_title'));
    }

    public function test_can_fetch_arabic_translations_with_rtl_direction(): void
    {
        $response = $this->getJson('/api/localization/translations/ar');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'locale'    => 'ar',
                    'direction' => 'rtl',
                ],
            ]);

        $this->assertNotEmpty($response->json('data.translations.app_title'));
        $this->assertStringContainsString('ماركت', $response->json('data.translations.app_title'));
    }

    public function test_unsupported_locale_falls_back_to_english(): void
    {
        $response = $this->getJson('/api/localization/translations/xyz');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'locale'    => 'en',
                    'direction' => 'ltr',
                ],
            ]);
    }

    public function test_authenticated_user_can_set_and_get_localization_preference(): void
    {
        $getRes = $this->actingAs($this->customer, 'sanctum')->getJson('/api/localization/preference');
        $getRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'preferred_country' => 'PK',
                    'preferred_locale'  => 'en',
                ],
            ]);

        $setRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/localization/preference', [
            'country_code' => 'SA',
            'locale'       => 'ar',
        ]);

        $setRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'preferred_country' => 'SA',
                    'preferred_locale'  => 'ar',
                ],
            ]);

        $this->customer->refresh();
        $this->assertEquals('SA', $this->customer->preferred_country);
        $this->assertEquals('ar', $this->customer->preferred_locale);
    }

    public function test_set_preference_fails_with_invalid_locale(): void
    {
        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/localization/preference', [
            'country_code' => 'FR',
            'locale'       => 'french',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['locale']);
    }
}
