<?php

use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return response()->json([
        'message' => 'Users API v1',
    ]);
});

Route::get('/medicines', function () {
    return response()->json([
        'message' => 'Medicines API v1',
    ]);
});

require __DIR__.'/v1/auth.php';
