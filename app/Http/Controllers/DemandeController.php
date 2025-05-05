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
        // dd("Ok");
        return Inertia::render('Demandes');
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
}
