<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        return Player::with('user')->get();
    }

    public function update(Request $request, Player $player)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string',
            'position' => 'sometimes|string',
            'team_id' => 'nullable|exists:teams,id'
        ]);
        
        $player->update($validated);
        
        return response()->json($player);
    }
}
