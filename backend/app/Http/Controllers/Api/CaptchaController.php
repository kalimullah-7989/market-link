<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CaptchaController extends Controller
{
    public function generate()
    {
        $num1 = rand(1, 9);
        $num2 = rand(1, 9);
        $answer = $num1 + $num2;

        $key = (string) Str::uuid();

        Cache::put('captcha_' . $key, (string) $answer, now()->addMinutes(5));

        return $this->success([
            'captcha_key'        => $key,
            'question'           => "What is {$num1} + {$num2}?",
            'expires_in_seconds' => 300,
        ], 'Captcha generated');
    }
}
