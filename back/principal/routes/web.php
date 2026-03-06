<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

# Google OAuth callback (Si o si es te que fer a web)
Route::get('/auth/google/callback', function (\Illuminate\Http\Request $request) {
    $code = $request->get('code');
    $error = $request->get('error');

    $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');

    if ($error) {
        return redirect()->away($frontendUrl . '/?error=' . $error);
    }

    if ($code) {
        return redirect()->away($frontendUrl . '/auth/callback?code=' . $code);
    }

    return redirect()->away($frontendUrl . '/?error=missing_code');
});
