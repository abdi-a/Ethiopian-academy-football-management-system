<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'birth_date' => '1990-01-01',
        ]);

        // Coach
        User::create([
            'name' => 'Coach User',
            'email' => 'coach@example.com',
            'password' => Hash::make('password123'),
            'role' => 'coach',
            'birth_date' => '1985-05-15',
        ]);

        // Club Manager
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
            'birth_date' => '1980-08-20',
        ]);
        
        // Player (for testing)
        User::create([
            'name' => 'Test Player',
            'email' => 'player@example.com',
            'password' => Hash::make('password123'),
            'role' => 'player',
            'birth_date' => '2005-03-10',
        ]);
    }
}
