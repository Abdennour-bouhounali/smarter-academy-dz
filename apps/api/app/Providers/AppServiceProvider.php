<?php

namespace App\Providers;

use App\Domain\Access\EntitlementService;
use App\Domain\Billing\PaymentProviderRegistry;
use App\Domain\Billing\SandboxPaymentProvider;
use App\Domain\Billing\Stripe\StripeEventTranslator;
use App\Domain\Billing\Stripe\StripePaymentProvider;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Http\Events\RequestHandled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        /**
         * SINGLETON, et c'est la condition de sa mémorisation par requête.
         *
         * EntitlementService retient les droits déjà chargés le temps d'un
         * appel HTTP (voir sa méthode validEntitlements). Résolu à neuf à
         * chaque `app()`, ce cache serait toujours vide : une sauvegarde de
         * progression, qui vérifie la leçon puis le module, paierait deux
         * requêtes pour la même question.
         *
         * L'instance ne survit pas à la requête — un droit révoqué à l'instant
         * ferme donc l'accès au prochain appel, pas à l'expiration d'un cache.
         */
        $this->app->singleton(EntitlementService::class);

        /**
         * … mais RECOMMENCÉ à chaque requête.
         *
         * En production, chaque requête HTTP construit un conteneur neuf, donc
         * le cache naît vide : un droit révoqué ferme l'accès dès l'appel
         * suivant. Sous un noyau qui réutilise le processus — la suite de
         * tests, et tout serveur à état persistant du type Octane — le
         * singleton survivrait d'une requête à l'autre et continuerait de
         * servir un droit révoqué.
         *
         * Reposer sur « en général le processus meurt » serait faire dépendre
         * une décision de sécurité du mode d'exécution. On vide donc
         * explicitement à la frontière de requête : le comportement devient le
         * même partout, et il est vrai par construction plutôt que par chance.
         */
        $this->app->booted(function () {
            $this->app['events']->listen(
                RequestHandled::class,
                fn () => $this->app->make(EntitlementService::class)->forget(),
            );
        });

        /**
         * Les fournisseurs de paiement reconnus — une LISTE BLANCHE.
         *
         * Le nom vient de l'URL du webhook, donc d'une source publique.
         * Résoudre une classe depuis cette valeur offrirait un point
         * d'instanciation arbitraire ; seul ce qui est enregistré ici existe.
         *
         * Le registre est un singleton pour qu'un test puisse y substituer un
         * faux fournisseur et exercer toute la chaîne d'idempotence sans SDK
         * ni réseau.
         */
        $this->app->singleton(PaymentProviderRegistry::class, function ($app) {
            $registry = new PaymentProviderRegistry;

            $registry->register(new StripePaymentProvider(
                $app->make(StripeEventTranslator::class),
                config('services.stripe.webhook_secret'),
                config('services.stripe.secret'),
                (int) config('services.stripe.webhook_tolerance', 300),
            ));

            // Le bac à sable : pour éprouver le parcours au navigateur sans
            // clé d'API ni réseau. JAMAIS hors d'un environnement local — un
            // déploiement qui hériterait de la variable ne l'obtiendrait pas.
            if ($app->environment('local', 'testing')) {
                $registry->register(new SandboxPaymentProvider);
            }

            return $registry;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin', fn (User $user) => $user->role === 'admin');

        /**
         * La saisie d'un code d'activation — DEUX compteurs, et c'est la
         * raison d'être de cette limite nommée.
         *
         * Partout ailleurs dans routes/api.php, un `throttle:6,1` en ligne
         * suffit. Ici il en faut deux, et deux `throttle:` successifs sur la
         * même route partageraient la même clé de cache : le second
         * n'ajouterait rien. Un limiteur nommé qui rend un TABLEAU applique
         * bien les deux, chacun avec sa propre clé.
         *
         *   par compte, 5/min  → un élève qui se trompe retape aussitôt ;
         *                        un script qui tâtonne s'arrête au sixième.
         *   par IP, 30/heure   → ferme le contournement évident du premier :
         *                        créer des comptes pour multiplier les essais.
         *
         * L'ordre de grandeur à battre : 2^60 codes possibles. Ces limites ne
         * sont pas ce qui rend l'attaque impossible — l'entropie s'en charge —
         * elles rendent inutile de même l'essayer, et gardent la table de
         * codes à l'abri d'un flot de requêtes.
         */
        RateLimiter::for('activation-redeem', fn (Request $request) => [
            Limit::perMinute(5)->by('activation-user:'.($request->user()?->id ?? $request->ip())),
            Limit::perHour(30)->by('activation-ip:'.$request->ip()),
        ]);
    }
}
