<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Http\Kernel;
use App\Http\Middleware\CheckRole;

class MiddlewareServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(Kernel $kernel): void
    {
        $this->app['router']->aliasMiddleware('role', CheckRole::class);
    }
}
