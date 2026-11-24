<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * L'état d'une commande devient DEUX états indépendants (owner, 2026-11-24) :
 *  - `call_status` : l'appel de confirmation — new | contacted | no_answer | confirmed | cancelled ;
 *  - `delivery_status` : le colis — NULL (pas encore expédié) | shipped | in_transit | delivered | returned.
 * Chacun se corrige librement (une erreur de clic se reprend). L'ancien `status` est
 * reporté sur les deux puis supprimé.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('book_orders', function (Blueprint $table) {
            $table->string('call_status', 16)->default('new')->after('delivery_mode');
            $table->string('delivery_status', 16)->nullable()->after('call_status');
        });

        $map = [
            'pending' => ['new', null],
            'confirmed' => ['confirmed', null],
            'in_way' => ['confirmed', 'in_transit'],
            'delivered' => ['confirmed', 'delivered'],
            'returned' => ['confirmed', 'returned'],
            'cancelled' => ['cancelled', null],
        ];
        foreach ($map as $old => [$call, $delivery]) {
            DB::table('book_orders')->where('status', $old)->update(['call_status' => $call, 'delivery_status' => $delivery]);
        }

        Schema::table('book_orders', function (Blueprint $table) {
            $table->dropIndex(['status', 'created_at']);
        });
        Schema::table('book_orders', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->index(['call_status', 'created_at']);
            $table->index(['delivery_status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('book_orders', function (Blueprint $table) {
            $table->string('status', 16)->default('pending')->after('delivery_mode');
        });

        DB::table('book_orders')->update(['status' => DB::raw("CASE
            WHEN delivery_status IN ('delivered', 'returned') THEN delivery_status
            WHEN delivery_status IN ('shipped', 'in_transit') THEN 'in_way'
            WHEN call_status = 'cancelled' THEN 'cancelled'
            WHEN call_status = 'confirmed' THEN 'confirmed'
            ELSE 'pending' END")]);

        Schema::table('book_orders', function (Blueprint $table) {
            $table->dropIndex(['call_status', 'created_at']);
            $table->dropIndex(['delivery_status', 'created_at']);
        });
        Schema::table('book_orders', function (Blueprint $table) {
            $table->dropColumn(['call_status', 'delivery_status']);
            $table->index(['status', 'created_at']);
        });
    }
};
