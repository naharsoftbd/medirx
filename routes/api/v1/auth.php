<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\UserPasswordResetController;
use App\Http\Controllers\Api\Auth\AuthController;

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Password Reset Endpoints (no authentication required)
Route::post('password/email', [UserPasswordResetController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [UserPasswordResetController::class, 'reset']);
Route::post('password/send-otp', [UserPasswordResetController::class, 'sendOtp']);
Route::post('password/verify-otp', [UserPasswordResetController::class, 'verifyOtp']);
Route::post('password/change', [UserPasswordResetController::class, 'changePassword']);
