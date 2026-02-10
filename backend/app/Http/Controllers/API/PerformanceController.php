<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Performance;
use Illuminate\Http\Request;

class PerformanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'player') {
            return Performance::whereHas('player', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with(['coach'])->latest()->get();
        }

        return Performance::with(['player.user', 'coach'])->latest()->get();
    }

    public function update(Request $request, Performance $performance)
    {
        $performance->update($request->all());
        return response()->json($performance);
    }

    public function store(Request $request)
    {
        $request->validate([
            'player_id' => 'required|exists:players,id',
            'rating' => 'required|integer|min:1|max:10',
            'notes' => 'nullable|string',
        ]);

        $performance = Performance::create([
            'player_id' => $request->player_id,
            'coach_id' => $request->user()->id,
            'rating' => $request->rating,
            'notes' => $request->notes,
        ]);

        return response()->json($performance, 201);
    }

    public function destroy(Performance $performance)
    {
        $performance->delete();
        return response()->json(null, 204);
    }
}
