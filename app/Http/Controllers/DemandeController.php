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
        if(Auth::user()->role == "responsable_ritel"){
            return Inertia::render('responsable_ritel/demandes/EditDemande', [
                'demande' => $demande->load(['user', 'pieceJointes'])
            ]);
        }else{
            return Inertia::render('operation/demandes/EditDemande', [
                'demande' => $demande->load(['user', 'pieceJointes'])
            ]);
        }
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
            'user_validateur_level' => "responsable_ritel",
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
        // dd($status);
        if($status == "accepte" && $user->role == "responsable_ritel"){
            $demande["status"] = $status;
            $demande["user_validateur_level"] = "operation";
            $demande->save();
           try {
            Mail::to($demande->email)->send(new ValidationMail($demande));
           } catch (\Throwable $th) {

           }
            return redirect()->route('responsable_ritel.demandes.all')->with('success','La demande a été validée avec success');
        }elseif($status == "rejete" && $user->role == "responsable_ritel"){
            // dd($status);
            $demande["status"] = $status;
            $demande["user_validateur_level"] = $user->role;
            $demande->save();
            try {
                Mail::to($demande->email)->send(new ValidationMail($demande));
               } catch (\Throwable $th) {

               }
            return redirect()->route('responsable_ritel.demandes.all')->with('success','La demande a été rejetée avec success');
        }elseif($status == "debloque" && $user->role == "operation"){
            $demande["status"] = $status;
            $demande["user_validateur_level"] = $user->role;
            $demande->save();
            try {
                Mail::to($demande->email)->send(new ValidationMail($demande));
               } catch (\Throwable $th) {

               }
            return redirect()->route('operation.demandes.all')->with('success','La demande a été debloquée avec success');
        }elseif($status == "rejete" && $user->role == "operation"){
            $demande["status"] = $status;
            $demande["user_validateur_level"] = $user->role;
            $demande->save();
            try {
                Mail::to($demande->email)->send(new ValidationMail($demande));
               } catch (\Throwable $th) {

               }
            return redirect()->route('operation.demandes.all')->with('success','La demande a été rejetée avec success');
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

        if(Auth::user()->role == "operation"){
                return Inertia::render('operation/demandes/AllDemandes', [
                    'demandes' => $demandes,
                    'filters' => $request->only(['search', 'status'])
                ]);
        }
        return Inertia::render('demandes/AllDemandes', [
            'demandes' => $demandes,
            'filters' => $request->only(['search', 'status'])
         ]);

    }

    public function allDemandesResponsable(Request $request)
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

        return Inertia::render('responsable_ritel/demandes/AllDemandes', [
            'demandes' => $demandes,
            'filters' => $request->only(['search', 'status'])
    ]);
    }

    public function statistics(Request $request)
    {
        $dateDebut = $request->input('date_debut', now()->subDays(7)->format('Y-m-d'));
        $dateFin = $request->input('date_fin', now()->format('Y-m-d'));

        // Statistiques des demandes par jour
        $demandesParJour = Demande::whereBetween('created_at', [$dateDebut, $dateFin])
            ->where('is_deleted', 0)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total, SUM(montant) as montant_total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Statistiques par statut
        $statistiquesParStatut = Demande::whereBetween('created_at', [$dateDebut, $dateFin])
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

        // Calcul des totaux
        $totalDemandes = array_sum(array_column($statistiquesParStatut, 'total'));
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

        return Inertia::render('Statistics', [
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
    }

    public function exportStatistics(Request $request)
    {
        $dateDebut = $request->input('date_debut', now()->subDays(7)->format('Y-m-d'));
        $dateFin = $request->input('date_fin', now()->format('Y-m-d'));

        $demandes = Demande::whereBetween('created_at', [$dateDebut, $dateFin])
            ->where('is_deleted', 0)
            ->with('user')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="statistiques_demandes.csv"',
        ];

        $callback = function() use ($demandes) {
            $file = fopen('php://output', 'w');

            // En-têtes
            fputcsv($file, [
                'Date',
                'Nom',
                'Prénom',
                'Email',
                'Numéro de compte',
                'Montant',
                'Statut',
                'Téléphone'
            ]);

            // Données
            foreach ($demandes as $demande) {
                fputcsv($file, [
                    $demande->created_at->format('Y-m-d H:i:s'),
                    $demande->last_name,
                    $demande->first_name,
                    $demande->email,
                    $demande->numero_compte,
                    $demande->montant,
                    $demande->status,
                    $demande->phone
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
