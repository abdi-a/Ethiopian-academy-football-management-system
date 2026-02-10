<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_id',
        'player_id',
        'status',
        'remarks'
    ];

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function training()
    {
        return $this->belongsTo(Training::class);
    }
}
