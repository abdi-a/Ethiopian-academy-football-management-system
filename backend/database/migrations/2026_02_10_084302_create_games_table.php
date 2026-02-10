<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_home_id')->nullable()->constrained('teams')->onDelete('cascade');
            $table->foreignId('team_away_id')->nullable()->constrained('teams')->onDelete('cascade');
            $table->string('opponent_name')->nullable();
            $table->dateTime('match_date');
            $table->string('location')->nullable();
            $table->integer('score_home')->nullable();
            $table->integer('score_away')->nullable();
            $table->enum('status', ['Scheduled', 'Completed', 'Cancelled'])->default('Scheduled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
