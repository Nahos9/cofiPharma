<?php

namespace App\Http\Controllers;

use App\Models\AvSalaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AvSalaireController extends Controller
{
    public function index()
    {
        return Inertia::render('AvSalaire', [
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'numero_compte' => 'required|string|max:50',
            'montant' => 'required|numeric|min:1',
            'fichiers' => 'nullable|array',
            'fichiers.*' => 'file|max:5120', // 5 Mo max par fichier
        ], [
            'nom.required' => 'Le nom est obligatoire.',
            'nom.string' => 'Le nom doit être une chaîne de caractères.',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères.',

            'prenom.required' => 'Le prénom est obligatoire.',
            'prenom.string' => 'Le prénom doit être une chaîne de caractères.',
            'prenom.max' => 'Le prénom ne peut pas dépasser 255 caractères.',

            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'Veuillez saisir une adresse email valide.',
            'email.max' => 'L\'adresse email ne peut pas dépasser 255 caractères.',

            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',
            'phone.max' => 'Le numéro de téléphone ne peut pas dépasser 20 caractères.',

            'numero_compte.required' => 'Le numéro de compte est obligatoire.',
            'numero_compte.string' => 'Le numéro de compte doit être une chaîne de caractères.',
            'numero_compte.max' => 'Le numéro de compte ne peut pas dépasser 50 caractères.',

            'montant.required' => 'Le montant est obligatoire.',
            'montant.numeric' => 'Le montant doit être un nombre.',
            'montant.min' => 'Le montant doit être supérieur à 0.',

            'fichiers.array' => 'Les fichiers doivent être sélectionnés correctement.',
            'fichiers.*.file' => 'Chaque fichier doit être un fichier valide.',
            'fichiers.*.max' => 'Chaque fichier ne peut pas dépasser 5 Mo.',
        ]);

        try {
            // Création de l'avance sur salaire
            $avSalaire = new \App\Models\AvSalaire();
            $avSalaire->nom = $validated['nom'];
            $avSalaire->prenom = $validated['prenom'];
            $avSalaire->email = $validated['email'];
            $avSalaire->phone = $validated['phone'];
            $avSalaire->numero_compte = $validated['numero_compte'];
            $avSalaire->montant = $validated['montant'];
            $avSalaire->status = 'en attente';
            $avSalaire->save();

            // Gestion des fichiers joints
            if ($request->hasFile('fichiers')) {
                foreach ($request->file('fichiers') as $file) {
                    $path = $file->store('avances_salaires', 'public');
                    \App\Models\PieceJointAv::create([
                        'av_salaire_id' => $avSalaire->id,
                        'chemin_fichier' => $path,
                        'nom_fichier' => $file->getClientOriginalName(),
                        'type_mime' => $file->getClientOriginalExtension(),
                        'taille_fichier' => $file->getSize(),
                    ]);
                }
            }

            return back()->with('success', '🎉 Félicitations ! Votre demande a été envoyée avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la soumission de la demande: ' . $e->getMessage());
        }
    }

    public function all(Request $request)
    {
        $query = AvSalaire::with('pieceJointsAv')
        ->where('is_deleted', 0);

        // Filtres optionnels
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('numero_compte', 'like', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $avSalaires = $query->paginate($perPage);

       if(Auth::user()->role == "responsable_ritel"){
        return Inertia::render('responsable_ritel/avSalaire/AllAvSalaire', [
            'avSalaires' => $avSalaires,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order', 'per_page']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
       }elseif(Auth::user()->role == "charge client"){
        return Inertia::render('caissiere/avSalaire/AllAvSalaire', [
            'avSalaires' => $avSalaires,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order', 'per_page']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
       }
    }
    public function edit($id)
    {
        if(Auth::user()->role == "responsable_ritel"){
            $avSalaire = AvSalaire::with('pieceJointsAv')->findOrFail($id);
            return Inertia::render('responsable_ritel/avSalaire/EditAvSalaire', [
                'avSalaire' => $avSalaire,
            ]);
        }
        elseif(Auth::user()->role == "charge client"){
            $avSalaire = AvSalaire::with('pieceJointsAv')->findOrFail($id);
            return Inertia::render('caissiere/avSalaire/EditAvSalaire', [
                'avSalaire' => $avSalaire,
            ]);
        }
        // else{
        //     return redirect()->route('avSalaire.index')->with('error', 'Vous n\'avez pas les permissions pour accéder à cette page.');
        // }
    }

    public function destroy($id)
    {
        $avSalaire = AvSalaire::with('pieceJointsAv')->findOrFail($id);
        $avSalaire->is_deleted = 1;
        // Suppression des fichiers physiques si besoin
        // foreach ($avSalaire->pieceJointsAv as $piece) {
        //     if (Storage::disk('public')->exists($piece->chemin_fichier)) {
        //         Storage::disk('public')->delete($piece->chemin_fichier);
        //     }
        //     $piece->delete();
        // }
        $avSalaire->save();
        return redirect()->back()->with('success', 'Avance sur salaire supprimée avec succès.');
    }

    public function validateAvSalaire(Request $request, $id)
    {
        // dd("ok");
        $avSalaire = AvSalaire::with('pieceJointsAv')->findOrFail($id);
        $user = Auth::user();

        $status = $request->input('status');
        // dd($status);
        if($status == "accepte" && $user->role == "charge client"){
            $avSalaire->status = 'accepte';
            $avSalaire->user_validateur_level = "responsable_ritel";
            $avSalaire->save();
            return redirect()->back()->with('success', 'Avance sur salaire validée avec succès.');
        }elseif($status == "rejete" && $user->role == "charge client"){
            $avSalaire->status = 'rejete';
            $avSalaire->user_validateur_level = $user->role;
            $avSalaire->save();
            return redirect()->back()->with('success', 'Avance sur salaire rejetée avec succès.');
        }elseif($status == "accepte" && $user->role == "responsable_ritel"){
            $avSalaire->status = 'accepte';
            $avSalaire->user_validateur_level = "operation";
            $avSalaire->save();
            return redirect()->back()->with('success', 'Avance sur salaire validée avec succès.');
        }elseif($status == "rejete" && $user->role == "responsable_ritel"){
            $avSalaire->status = 'rejete';
            $avSalaire->user_validateur_level = $user->role;
            $avSalaire->save();
            return redirect()->back()->with('success', 'Avance sur salaire rejetée avec succès.');
        }
    }
}
