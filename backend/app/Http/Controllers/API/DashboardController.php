<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Player;
use App\Models\Training;
use App\Models\Performance;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function playerStats(Request $request)
    {
        $user = $request->user();
        
        // Find player record associated with user
        $player = Player::where('user_id', $user->id)->first();

        // Basic stats
        $trainingsAttempted = 0; // Placeholder until attendance table exists
        $upcomingTrainings = Training::where('date', '>=', now())
                                    ->orderBy('date', 'asc')
                                    ->take(5)
                                    ->get();

        $performanceReviews = $player ? $player->performances()->latest()->take(5)->get() : [];
        $averageRating = $player ? $player->performances()->avg('rating') : 0;

        return response()->json([
            'role' => 'player',
            'overview' => [
                'status' => $player ? $player->status : 'pending',
                'average_rating' => round($averageRating, 1),
                'trainings_count' => Training::count(), // Just total trainings for now as visibility
            ],
            'upcoming_trainings' => $upcomingTrainings,
            'recent_performance' => $performanceReviews,
        ]);
    }

    public function coachStats(Request $request)
    {
        $totalPlayers = Player::count();
        $totalTrainings = Training::count();
        $todayTrainings = Training::whereDate('date', today())->get();
        
        return response()->json([
            'role' => 'coach',
            'overview' => [
                'total_players' => $totalPlayers,
                'total_trainings' => $totalTrainings,
                'today_sessions' => $todayTrainings->count(),
            ],
            'today_trainings' => $todayTrainings,
            'recent_players' => User::where('role', 'player')->latest()->take(5)->get(),
        ]);
    }

    public function managerStats(Request $request)
    {
        $stats = [
            'players' => User::where('role', 'player')->count(),
            'coaches' => User::where('role', 'coach')->count(),
            'trainings' => Training::count(),
            'pending_approvals' => Player::where('status', 'pending')->count(),
        ];

        return response()->json([
            'role' => 'manager',
            'overview' => $stats,
            'recent_users' => User::latest()->take(5)->get(),
        ]);
    }

    public function adminStats(Request $request)
    {
        $roleDistribution = User::select('role', DB::raw('count(*) as total'))
                                ->groupBy('role')
                                ->get()
                                ->pluck('total', 'role');

        return response()->json([
            'role' => 'admin',
            'overview' => [
                'total_users' => User::count(),
                'total_players' => $roleDistribution['player'] ?? 0,
                'total_coaches' => $roleDistribution['coach'] ?? 0,
                'total_managers' => $roleDistribution['manager'] ?? 0,
            ],
            'role_distribution' => $roleDistribution,
            'system_health' => 'optimal', // Placeholder
        ]);
    }
}
