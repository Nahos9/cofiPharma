<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Caissier',
            'email' => 'caissier@example.com',
            'password' => Hash::make('password'),
            'role' => 'cassiere',
        ]);

        User::create([
            'name' => 'Responsable Retail',
            'email' => 'responsable@example.com',
            'password' => Hash::make('password'),
            'role' => 'responsable_ritel',
        ]);
    }
}
