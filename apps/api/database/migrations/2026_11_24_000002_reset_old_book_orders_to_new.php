<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Les commandes reçues AVANT les deux états (owner, 2026-11-24) repartent du premier état :
 * `call_status = new`, `delivery_status = NULL`. Le report de l'ancien `status`
 * (2026_11_24_000001) leur donnait « confirmée / livrée / retour… » qu'aucun appel n'avait
 * posé sous le nouveau système.
 *
 * Une commande déjà TRAITÉE sous le nouveau système (au moins un événement `call_status` ou
 * `delivery_status` dans son historique) n'est PAS touchée : seul un changement fait à la main
 * laisse cet événement, la migration précédente n'en écrit pas.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('book_orders')
            ->whereNotIn('id', DB::table('book_order_events')
                ->whereIn('type', ['call_status', 'delivery_status'])
                ->select('book_order_id'))
            ->update(['call_status' => 'new', 'delivery_status' => null]);
    }

    public function down(): void
    {
        // Irréversible : l'ancien état de ces commandes n'est plus connu.
    }
};
