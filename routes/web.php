<?php

use App\Http\Controllers\DemandeController;
use App\Http\Controllers\ProfileController;
use App\Models\Demande;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\ChangePasswordController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/demandes',[DemandeController::class,'store'])->name('demandes.store');
Route::get('/demandes',[DemandeController::class,'index'])->name('demande.index');
Route::get('/demandes-all',[DemandeController::class,'all'])->name('demande.all');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Routes pour les demandes
    // Route::get('/demandes', [DemandeController::class, 'index'])->name('demandes.index');
    Route::get('/demandes/{demande}/edit', [DemandeController::class, 'edit'])->name('demandes.edit');
    Route::put('/demandes/{demande}/destroy',[DemandeController::class,'destroy'])->name('demandes.destroy');
    Route::put('/demandes/{demande}/validate',[DemandeController::class,'validateOrReject'])->name('demandes.validateOrReject');
    Route::put('/demandes/{demande}', [DemandeController::class, 'update'])->name('demandes.update');
    Route::post('/demandes/delete-multiple', [DemandeController::class, 'deleteMultiple'])->name('demandes.delete-multiple');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/demandes/all', [DemandeController::class, 'all'])->name('demande.all');
    Route::get('/change-password', [ChangePasswordController::class, 'show'])->name('password.change');
    Route::post('/change-password', [ChangePasswordController::class, 'update'])->name('password.change');
    // Autres routes admin
});

// Routes d'administration
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);

});
Route::middleware(['auth', 'verified', 'role:responsable_ritel'])->prefix('responsable_ritel')->name('responsable_ritel.')->group(function () {
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {

        $dateDebut = Demande::min('created_at');
        $dateDebut = $dateDebut? $dateDebut : $request->input('date_debut');
        $dateFin = $request->input('date_fin', now()->format('Y-m-d'));

        //  dd($dateDebut, $dateFin);
        // Statistiques des demandes par jour
        $demandesParJour = Demande::whereBetween('created_at', [
                $dateDebut . ' 00:00:00',
                $dateFin . ' 23:59:59'
            ])
            ->where('is_deleted', 0)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total, SUM(montant) as montant_total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Ajout de logs pour déboguer
        //  dd($demandesParJour);

        // Vérification de toutes les demandes dans la période
        $toutesDemandes = Demande::whereBetween('created_at', [
                $dateDebut . ' 00:00:00',
                $dateFin . ' 23:59:59'
            ])
            ->where('is_deleted', 0)
            ->get();

        // dd($toutesDemandes);
        // Statistiques par statut
        $statistiquesParStatut = Demande::whereBetween('created_at',[
            $dateDebut . ' 00:00:00',
            $dateFin . ' 23:59:59'
        ])
            ->where('is_deleted', 0)
            ->selectRaw('status, COUNT(*) as total, SUM(montant) as montant_total')
            ->groupBy('status')
            ->get()

            ->mapWithKeys(function ($item) {
                return [$item->status => [
                    'total' => $item->total,
                    'montant_total' => $item->montant_total
                ]];
            })
            ->toArray();
        // dd($statistiquesParStatut);
        // Calcul des totaux
        $totalDemandes = array_sum(array_column($statistiquesParStatut, 'total'));
        // dd($totalDemandes);
        $montantTotal = array_sum(array_column($statistiquesParStatut, 'montant_total'));

        $demandesEnAttente = $statistiquesParStatut['en attente']['total'] ?? 0;
        $demandesValidees = $statistiquesParStatut['accepte']['total'] ?? 0;
        $demandesRejetees = $statistiquesParStatut['rejete']['total'] ?? 0;
        $demandesDebloquees = $statistiquesParStatut['debloque']['total'] ?? 0;

        // Montants par statut
        $montantEnAttente = $statistiquesParStatut['en attente']['montant_total'] ?? 0;
        $montantValide = $statistiquesParStatut['accepte']['montant_total'] ?? 0;
        $montantRejete = $statistiquesParStatut['rejete']['montant_total'] ?? 0;
        $montantDebloque = $statistiquesParStatut['debloque']['montant_total'] ?? 0;

        // Moyenne des montants
        $moyenneMontant = $totalDemandes > 0 ? $montantTotal / $totalDemandes : 0;
        return Inertia::render('responsable_ritel/DashboardRitel',
        [
            'statistiques' => [
                'demandesParJour' => $demandesParJour,
                'totalDemandes' => $totalDemandes,
                'montantTotal' => $montantTotal,
                'moyenneMontant' => $moyenneMontant,
                'demandesEnAttente' => $demandesEnAttente,
                'demandesValidees' => $demandesValidees,
                'demandesRejetees' => $demandesRejetees,
                'demandesDebloquees' => $demandesDebloquees,
                'montantEnAttente' => $montantEnAttente,
                'montantValide' => $montantValide,
                'montantRejete' => $montantRejete,
                'montantDebloque' => $montantDebloque,
                'filtres' => [
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateFin
                ]
            ]
        ]);
    })->name('dashboard');

    Route::get('/demandes/all', [DemandeController::class, 'allDemandesResponsable'])->name('demandes.all');
    Route::get('/demandes/all-debloques', [DemandeController::class, 'allDemandesDebloques'])->name('demandes.all-debloques');
    Route::get('/demandes/all-rejetees', [DemandeController::class, 'allDemandesRejetees'])->name('demandes.all-rejetees');
    Route::get('/demandes/all-acceptees', [DemandeController::class, 'allDemandesAcceptees'])->name('demandes.all-acceptees');
    Route::get('/demandes/all-en-attente', [DemandeController::class, 'allDemandesEnAttente'])->name('demandes.all-en-attente');
    Route::get('/demandes/{demande}/edit', [DemandeController::class, 'edit'])->name('demandes.edit');
});

Route::middleware(['auth', 'verified', 'role:operation'])->prefix('operation')->name('operation.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('operation/DashboardOperation');
    })->name('dashboard');

    Route::get('/demandes/all', [DemandeController::class, 'all'])->name('demandes.all');
    Route::get('/demandes/{demande}/edit', [DemandeController::class, 'edit'])->name('demandes.edit');

});

Route::middleware(['auth', 'verified', 'role:charge client'])->prefix('caissiere')->name('caissiere.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('caissiere/TableauCaissiere');
    })->name('dashboard');

    Route::get('/demandes/all', [DemandeController::class, 'all'])->name('demandes.all');
    Route::get('/demandes/{demande}/edit', [DemandeController::class, 'edit'])->name('demandes.edit');

});

Route::middleware(['auth', 'verified', 'role:visiteur'])->prefix('visiteur')->name('visiteur.')->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $dateDebut = Demande::min('created_at');
        $dateDebut = $dateDebut? $dateDebut : $request->input('date_debut');
        $dateFin = $request->input('date_fin', now()->format('Y-m-d'));

        //  dd($dateDebut, $dateFin);
        // Statistiques des demandes par jour
        $demandesParJour = Demande::whereBetween('created_at', [
                $dateDebut . ' 00:00:00',
                $dateFin . ' 23:59:59'
            ])
            ->where('is_deleted', 0)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total, SUM(montant) as montant_total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Ajout de logs pour déboguer
        //  dd($demandesParJour);

        // Vérification de toutes les demandes dans la période
        $toutesDemandes = Demande::whereBetween('created_at', [
                $dateDebut . ' 00:00:00',
                $dateFin . ' 23:59:59'
            ])
            ->where('is_deleted', 0)
            ->get();

        // dd($toutesDemandes);
        // Statistiques par statut
        $statistiquesParStatut = Demande::whereBetween('created_at',[
            $dateDebut . ' 00:00:00',
            $dateFin . ' 23:59:59'
        ])
            ->where('is_deleted', 0)
            ->selectRaw('status, COUNT(*) as total, SUM(montant) as montant_total')
            ->groupBy('status')
            ->get()

            ->mapWithKeys(function ($item) {
                return [$item->status => [
                    'total' => $item->total,
                    'montant_total' => $item->montant_total
                ]];
            })
            ->toArray();
        // dd($statistiquesParStatut);
        // Calcul des totaux
        $totalDemandes = array_sum(array_column($statistiquesParStatut, 'total'));
        // dd($totalDemandes);
        $montantTotal = array_sum(array_column($statistiquesParStatut, 'montant_total'));

        $demandesEnAttente = $statistiquesParStatut['en attente']['total'] ?? 0;
        $demandesValidees = $statistiquesParStatut['accepte']['total'] ?? 0;
        $demandesRejetees = $statistiquesParStatut['rejete']['total'] ?? 0;
        $demandesDebloquees = $statistiquesParStatut['debloque']['total'] ?? 0;

        // Montants par statut
        $montantEnAttente = $statistiquesParStatut['en attente']['montant_total'] ?? 0;
        $montantValide = $statistiquesParStatut['accepte']['montant_total'] ?? 0;
        $montantRejete = $statistiquesParStatut['rejete']['montant_total'] ?? 0;
        $montantDebloque = $statistiquesParStatut['debloque']['montant_total'] ?? 0;

        // Moyenne des montants
        $moyenneMontant = $totalDemandes > 0 ? $montantTotal / $totalDemandes : 0;
        return Inertia::render('visiteur/DashboardVisiteur',
        [
            'statistiques' => [
                'demandesParJour' => $demandesParJour,
                'totalDemandes' => $totalDemandes,
                'montantTotal' => $montantTotal,
                'moyenneMontant' => $moyenneMontant,
                'demandesEnAttente' => $demandesEnAttente,
                'demandesValidees' => $demandesValidees,
                'demandesRejetees' => $demandesRejetees,
                'demandesDebloquees' => $demandesDebloquees,
                'montantEnAttente' => $montantEnAttente,
                'montantValide' => $montantValide,
                'montantRejete' => $montantRejete,
                'montantDebloque' => $montantDebloque,
                'filtres' => [
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateFin
                ]
            ]
        ]);
    })->name('dashboard');

    Route::get('/demandes/all', [DemandeController::class, 'all'])->name('demandes.all');
    Route::get('/demandes/{demande}/edit', [DemandeController::class, 'edit'])->name('demandes.edit');
    Route::get('/demandes/all-debloques', [DemandeController::class, 'allDemandesDebloques'])->name('demandes.all-debloques');
    Route::get('/demandes/all-rejetees', [DemandeController::class, 'allDemandesRejetees'])->name('demandes.all-rejetees');
    Route::get('/demandes/all-acceptees', [DemandeController::class, 'allDemandesAcceptees'])->name('demandes.all-acceptees');
    Route::get('/demandes/all-en-attente', [DemandeController::class, 'allDemandesEnAttente'])->name('demandes.all-en-attente');

});
Route::get('/statistiques', [DemandeController::class, 'statistics'])
    ->middleware(['auth'])
    ->name('statistiques');

Route::get('/statistiques/export', [DemandeController::class, 'exportStatistics'])
    ->middleware(['auth'])
    ->name('statistiques.export');

require __DIR__.'/auth.php';
