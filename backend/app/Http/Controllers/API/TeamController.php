<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return Team::with(['coach', 'players.user'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'coach_id' => 'nullable|exists:users,id',
        ]);

        $team = Team::create($request->all());
        return response()->json($team, 201);
    }

    public function show(Team $team)
    {
        return $team->load(['coach', 'players.user']);
    }

    public function update(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|string',
        ]);

        $team->update($request->all());
        return response()->json($team);
    }

    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(null, 204);
    }
}
