<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Demande;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'growth' => 20, // À remplacer par une vraie logique de calcul
            ],
            'demandes' => [
                'total' => Demande::count(),
                'growth' => 12, // À remplacer par une vraie logique de calcul
            ],
            'transactions' => [
                'total' => 1234, // À remplacer par une vraie logique de calcul
                'growth' => 8,
            ],
            'revenue' => [
                'total' => 12345, // À remplacer par une vraie logique de calcul
                'growth' => 15,
            ],
        ];

        $recentUsers = User::latest()->take(5)->get();
        $recentDemandes = Demande::with('user')->latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentDemandes' => $recentDemandes,
        ]);
    }
}
