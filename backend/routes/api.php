<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PerformanceController;
use App\Http\Controllers\API\TrainingController;
use App\Http\Controllers\API\PlayerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Trainings
    Route::get('/trainings', [TrainingController::class, 'index']);
    Route::post('/trainings', [TrainingController::class, 'store']); // Should be coach/admin only strictly speaking
    Route::put('/trainings/{training}', [TrainingController::class, 'update']);
    Route::delete('/trainings/{training}', [TrainingController::class, 'destroy']);

    // Performances
    Route::get('/performances', [PerformanceController::class, 'index']);
    Route::post('/performances', [PerformanceController::class, 'store']); // Coach/admin only

    // Players
    Route::get('/players', [PlayerController::class, 'index']);

    // Users
    Route::get('/users', function (Request $request) {
        return \App\Models\User::all();
    });
});
