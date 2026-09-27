<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Doctors\DoctorController;
use App\Http\Controllers\Api\Doctors\MedicalSpecialtyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/medical-specialties', [MedicalSpecialtyController::class, 'index']);
});
