<?php

namespace App\Http\Controllers;

use App\Http\Requests\DemandePostRequest;
use App\Models\Demande;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DemandeController extends Controller
{
    public function index()
    {
        return Inertia::render('Demandes');
    }

    public function edit(Demande $demande)
    {
        return Inertia::render('demandes/EditDemande', [
            'demande' => $demande->load('user')
        ]);
    }

    public function update(Request $request, Demande $demande)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'status' => 'required|in:pending,approved,rejected',
            'description' => 'required|string'
        ]);

        $demande->update($validated);

        return redirect()->route('demandes.index')
            ->with('success', 'La demande a été mise à jour avec succès.');
    }

    public function deleteMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:demandes,id'
        ]);

        Demande::whereIn('id', $request->ids)->delete();

        return redirect()->back()
            ->with('success', 'Les demandes ont été supprimées avec succès.');
    }

    public function store(DemandePostRequest $request)
    {
        $validate = $request->validated();
        // dd($validate);
        try {
            Demande::create($validate);
            return redirect()->route('welcome')->with('success', 'Demande enregistrée avec succès.');
        } catch (\Exception $e) {
            return redirect()->route('demande.index')->withErrors($e->getMessage());
        }
    }

    public function all(Request $request)
    {
        $query = Demande::with('user')
        ->when($request->search, function($query) use ($request) {
            $query->where(function($q) use ($request) {
                $q->whereHas('user', function($q) use ($request) {
                    $q->where('first_name', 'like', "%{$request->search}%");
                })
                ->orWhere('montant', 'like', "%{$request->search}%")
                ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        })
        ->when($request->status, function($query) use ($request) {
            $query->where('status', $request->status);
        })
        ->latest();

    $demandes = $query->paginate(10)
        ->withQueryString();

    return Inertia::render('demandes/AllDemandes', [
        'demandes' => $demandes,
        'filters' => $request->only(['search', 'status'])
    ]);
    }
}
