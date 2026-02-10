<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return Game::with(['homeTeam', 'awayTeam'])->orderBy('match_date', 'asc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'match_date' => 'required|date',
            'team_home_id' => 'nullable|exists:teams,id',
            'opponent_name' => 'nullable|required_without:team_away_id|string',
            'location' => 'nullable|string',
        ]);

        $game = Game::create($request->all());
        return response()->json($game, 201);
    }

    public function update(Request $request, Game $game)
    {
        $request->validate([
            'status' => 'sometimes|in:Scheduled,Completed,Cancelled',
            'score_home' => 'nullable|integer',
            'score_away' => 'nullable|integer',
        ]);

        $game->update($request->all());
        return response()->json($game);
    }

    public function destroy(Game $game)
    {
        $game->delete();
        return response()->json(null, 204);
    }
}
