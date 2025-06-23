<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Gérer les rôles séparés par |
        $roles = collect($roles)
            ->flatMap(function ($role) {
                return explode('|', $role);
            })
            ->toArray();

        if (!$request->user() || !$request->user()->hasAnyRole($roles)) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}
