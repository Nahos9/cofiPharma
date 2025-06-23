<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $user = $request->user();
        // dd($user->role);
        if ($user->role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }elseif($user->role === 'responsable_ritel' || $user->role === 'chef_agence'){

            return redirect()->intended(route('responsable_ritel.dashboard', absolute: false));

        }elseif($user->role === 'operation'){

            return redirect()->intended(route('operation.demandes.all', absolute: false));

        }elseif($user->role == 'charge client'){
            // dd("ok");
            return redirect()->intended(route('caissiere.demandes.all', absolute: false));
        }elseif($user->role == 'visiteur'){
                // dd("ok");
            return redirect()->intended(route('visiteur.dashboard', absolute: false));
        }

        $request->session()->regenerate();

        // return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
