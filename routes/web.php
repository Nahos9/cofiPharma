<?php

use App\Http\Controllers\DemandeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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

require __DIR__.'/auth.php';
