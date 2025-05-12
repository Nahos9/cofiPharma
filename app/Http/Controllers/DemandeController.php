<?php

namespace App\Http\Controllers;

use App\Http\Requests\DemandePostRequest;
use App\Mail\DemandeCreatedMail;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
        try {
            $demande = Demande::create($validate);

            try {
                Log::info('Tentative d\'envoi d\'email à : ' . $demande->email);
                Mail::to($demande->email)
                    ->send(new DemandeCreatedMail($demande));
                Log::info('Email envoyé avec succès à : ' . $demande->email);
            } catch (\Exception $mailException) {
                Log::error('Erreur d\'envoi d\'email: ' . $mailException->getMessage());
                // On continue l'exécution même si l'email échoue
            }

            return redirect()->route('welcome')->with('success', 'Demande enregistrée avec succès.');
        } catch (\Exception $e) {
            Log::error('Erreur de création de demande: ' . $e->getMessage());
            return redirect()->route('demande.index')->withErrors(['error' => 'Une erreur est survenue lors de l\'enregistrement de la demande.']);
        }
    }

    public function destroy(Demande $demande)
    {
        $demande["is_deleted"] = 1;
        $demande->save();
        return redirect()->route('demande.all')
        ->with('success', 'La demande a été supprimé avec succès.');
    }
    public function validateOrReject (Request $request,Demande $demande)
    {
        $user = Auth::user();
        // dd($user->name);
        $status = $request->input('status');
        if($status == "accepte"){
            $demande["status"] = $status;
            $demande["user_validateur"] = $user->name;
            $demande->save();
            return redirect()->route('demande.all')->with('success','La demande a été validée avec success');
        }elseif($status == "rejete"){
            // dd($status);
            $demande["status"] = $status;
            $demande["user_validateur"] = $user->name;
            $demande->save();
            return redirect()->route('demande.all')->with('success','La demande a été rejetée avec success');
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
        ->where('is_deleted',0)
        ->latest();

    $demandes = $query->paginate(10)
        ->withQueryString();

    return Inertia::render('demandes/AllDemandes', [
        'demandes' => $demandes,
        'filters' => $request->only(['search', 'status'])
    ]);
    }
}
