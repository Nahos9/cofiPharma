<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrateur',
                'slug' => 'admin',
                'description' => 'Accès complet à toutes les fonctionnalités'
            ],
            [
                'name' => 'Caissier',
                'slug' => 'caissier',
                'description' => 'Gestion des transactions et des paiements'
            ],
            [
                'name' => 'Responsable Retail',
                'slug' => 'responsable-retail',
                'description' => 'Gestion des points de vente et des stocks'
            ],
            [
                'name' => 'Opération',
                'slug' => 'operation',
                'description' => 'Gestion des opérations quotidiennes'
            ]
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
