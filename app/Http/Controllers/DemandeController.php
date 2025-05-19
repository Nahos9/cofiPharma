<?php

namespace App\Http\Controllers;

use App\Http\Requests\DemandePostRequest;
use App\Mail\DemandeCreatedMail;
use App\Mail\DemandeMail;
use App\Mail\ValidationMail;
use App\Models\Demande;
use App\Models\PieceJointe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
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
            'demande' => $demande->load(['user', 'pieceJointes'])
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

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'numero_compte' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'montant' => 'required|numeric',
            'phone' => 'required|string|max:20',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240' // max 10MB par fichier
        ]);

        // Création de la demande
        $demande = Demande::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'numero_compte' => $request->numero_compte,
            'montant' => $request->montant,
            'phone' => $request->phone,
        ]);

        // Traitement des fichiers
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Stockage du fichier
                $path = $file->store('piece_jointes/' . $demande->id, 'public');

                // Création de l'enregistrement dans la table piece_jointes
                PieceJointe::create([
                    'demande_id' => $demande->id,
                    'nom_fichier' => $file->getClientOriginalName(),
                    'chemin_fichier' => $path,
                    'type_mime' => $file->getMimeType(),
                    'taille_fichier' => $file->getSize()
                ]);
            }
        }

        try {
            // Charger la relation pieceJointes avant d'envoyer l'email
            $demande->load('pieceJointes');

            // Envoyer l'email à l'administrateur
            Mail::to("nahos.igalo@cofinacorp.com")->send(new DemandeMail($demande));

            // Envoyer l'email de confirmation au demandeur
            Mail::to($demande->email)->send(new DemandeCreatedMail($demande));
        } catch (\Exception $e) {
            // Log l'erreur mais continuer l'exécution
            \Log::error('Erreur lors de l\'envoi de l\'email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Demande créée avec succès');
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
           try {
            Mail::to($demande->email)->send(new ValidationMail($demande));
           } catch (\Throwable $th) {

           }
            return redirect()->route('demande.all')->with('success','La demande a été validée avec success');
        }elseif($status == "rejete"){
            // dd($status);
            $demande["status"] = $status;
            $demande["user_validateur"] = $user->name;
            $demande->save();
            try {
                Mail::to($demande->email)->send(new ValidationMail($demande));
               } catch (\Throwable $th) {

               }
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
