<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer l'utilisateur admin s'il n'existe pas
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]
        );
    }
}
