<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected (butuh Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/kontak', [ContactController::class, 'index']);
    Route::post('/kontak', [ContactController::class, 'store']);
    Route::get('/kontak/{id}', [ContactController::class, 'show']);
    Route::delete('/kontak/{id}', [ContactController::class, 'destroy']);
});