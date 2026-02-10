<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'coach_id',
        'title',
        'date',
        'description',
    ];

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }
}
