<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PerformanceController;
use App\Http\Controllers\API\TrainingController;
use App\Http\Controllers\API\PlayerController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ProfileController;
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
    Route::put('/profile', [ProfileController::class, 'update']);


    // Trainings
    Route::get('/trainings', [TrainingController::class, 'index']);
    Route::post('/trainings', [TrainingController::class, 'store']); // Should be coach/admin only strictly speaking
    Route::put('/trainings/{training}', [TrainingController::class, 'update']);
    Route::delete('/trainings/{training}', [TrainingController::class, 'destroy']);

    // Performances
    Route::get('/performances', [PerformanceController::class, 'index']);
    Route::post('/performances', [PerformanceController::class, 'store']); // Coach/admin only
    Route::delete('/performances/{performance}', [PerformanceController::class, 'destroy']);

    // Players
    Route::get('/players', [PlayerController::class, 'index']);

    // Users
    Route::get('/users', function (Request $request) {
        return \App\Models\User::all();
    });

    // Dashboard Routes
    Route::middleware('role:player')->get('/player/dashboard', [DashboardController::class, 'playerStats']);
    Route::middleware('role:coach')->get('/coach/dashboard', [DashboardController::class, 'coachStats']);
    Route::middleware('role:manager')->get('/manager/dashboard', [DashboardController::class, 'managerStats']);
    Route::middleware('role:admin')->get('/admin/dashboard', [DashboardController::class, 'adminStats']);
});
