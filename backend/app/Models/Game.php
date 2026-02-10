<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_home_id', 
        'team_away_id', 
        'opponent_name', 
        'match_date', 
        'location', 
        'score_home', 
        'score_away', 
        'status'
    ];

    protected $casts = [
        'match_date' => 'datetime',
    ];

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'team_home_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'team_away_id');
    }
}
