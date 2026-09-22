<?php

use App\Http\Middleware\EnsureAccountIsActive;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Middleware\EnsureLearnerRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();

        // This is a pure JSON API with no server-rendered login page, so there is
        // no "login" route to redirect guests to. Without this, Laravel's default
        // guest-redirect (route('login')) throws a RouteNotFoundException — surfaced
        // as a raw 500 instead of a clean 401 — for any unauthenticated request that
        // doesn't explicitly send Accept: application/json (which is exactly what a
        // plain frontend fetch() call does).
        $middleware->redirectGuestsTo(null);

        // Le statut de compte se fait respecter par le serveur, sur chaque
        // route authentifiée (voir le groupe auth:sanctum dans routes/api.php).
        $middleware->alias([
            'account.active' => EnsureAccountIsActive::class,
            // La vérification d'adresse, elle aussi faite respecter par le
            // serveur : un écran « vérifiez votre e-mail » se contourne en
            // tapant une URL, pas ce middleware.
            'email.verified' => EnsureEmailIsVerified::class,
            // Les écritures du trajet d'apprentissage : élève seulement.
            'learner' => EnsureLearnerRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
