<?php

namespace App\Domain\Access\ActivationCodes;

use App\Domain\Admin\ActivityLogger;
use App\Models\ActivationCode;
use App\Models\ActivationCodeBatch;
use App\Models\User;
use DomainException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * La PRODUCTION d'un lot de codes — le geste qui précède l'impression des
 * cartes.
 *
 * Les codes en clair ne sont rendus QU'ICI, et une seule fois : la base n'en
 * garde que l'empreinte (voir la migration). L'administrateur qui perd la
 * liste au moment de la création ne peut plus la retrouver — il révoque le lot
 * et en produit un autre. C'est le prix, assumé, de ne pas stocker de secret
 * réutilisable.
 */
class ActivationCodeGenerator
{
    public function __construct(private ActivityLogger $log) {}

    /**
     * Combien de codes au maximum en un seul lot.
     *
     * Ni une limite technique ni un arbitraire : c'est ce qui tient dans une
     * réponse HTTP lisible et dans un fichier que l'administrateur va
     * réellement relire avant impression. Au-delà, on produit plusieurs lots
     * — ce qui est de toute façon la bonne granularité pour les distribuer.
     */
    public const MAX_QUANTITY = 500;

    /**
     * Produit un lot et ses codes.
     *
     * @param  array{label: string, quantity: int, accessDays?: ?int, accessEndsAt?: ?Carbon, redeemBy?: ?Carbon, notes?: ?string}  $attrs
     * @return array{batch: ActivationCodeBatch, codes: array<int, array{id: int, code: string, hint: string}>}
     *
     * @throws DomainException si les conditions du lot sont contradictoires
     */
    public function generateBatch(User $admin, array $attrs): array
    {
        $quantity = (int) $attrs['quantity'];
        $accessDays = $attrs['accessDays'] ?? null;
        $accessEndsAt = $attrs['accessEndsAt'] ?? null;
        $redeemBy = $attrs['redeemBy'] ?? null;
        $now = Carbon::now();

        if ($quantity < 1 || $quantity > self::MAX_QUANTITY) {
            throw new DomainException('La quantité doit être comprise entre 1 et '.self::MAX_QUANTITY.'.');
        }

        // Exclusives, parce qu'elles répondent à la même question de deux
        // façons incompatibles : « un an à partir de la saisie » et « jusqu'au
        // 30 juin » ne peuvent pas être vrais ensemble. Refuser ici plutôt que
        // d'en choisir une en silence — le lot imprimé porterait une promesse
        // que personne n'a décidée.
        if ($accessDays !== null && $accessEndsAt !== null) {
            throw new DomainException(
                'Choisissez soit une durée en jours, soit une date de fin d\'accès, pas les deux.'
            );
        }

        if ($accessDays !== null && $accessDays < 1) {
            throw new DomainException('La durée d\'accès doit être d\'au moins un jour.');
        }

        if ($accessEndsAt !== null && $accessEndsAt->lessThanOrEqualTo($now)) {
            throw new DomainException('La date de fin d\'accès doit être dans le futur.');
        }

        if ($redeemBy !== null && $redeemBy->lessThanOrEqualTo($now)) {
            throw new DomainException('La date limite d\'utilisation doit être dans le futur.');
        }

        return DB::transaction(function () use ($admin, $attrs, $quantity, $accessDays, $accessEndsAt, $redeemBy) {
            $batch = ActivationCodeBatch::create([
                'label' => $attrs['label'],
                'quantity' => $quantity,
                'access_days' => $accessDays,
                'access_ends_at' => $accessEndsAt,
                'redeem_by' => $redeemBy,
                'notes' => $attrs['notes'] ?? null,
                'created_by' => $admin->id,
            ]);

            $codes = [];
            $seen = [];

            for ($i = 0; $i < $quantity; $i++) {
                [$plain, $normalized, $hash] = $this->drawUnique($seen);
                $seen[$hash] = true;

                $code = ActivationCode::create([
                    'batch_id' => $batch->id,
                    'code_hash' => $hash,
                    'code_hint' => ActivationCodeFormat::hint($normalized),
                    'status' => ActivationCode::STATUS_AVAILABLE,
                    // La date limite de SAISIE est recopiée sur chaque code :
                    // la question « ce code est-il encore utilisable ? » reste
                    // ainsi une condition indexée sur une seule table.
                    'expires_at' => $redeemBy,
                    'created_by' => $admin->id,
                ]);

                $codes[] = [
                    'id' => $code->id,
                    'code' => $plain,
                    'hint' => $code->code_hint,
                ];
            }

            // Dans la MÊME transaction que l'écriture : un lot sans trace, ou
            // une trace sans lot, rendraient le journal inutilisable pour
            // répondre à « qui a produit ces cartes ? ».
            //
            // Ce qui est journalisé : les CONDITIONS du lot. Jamais un code,
            // jamais même une empreinte — le journal est lu par des gens qui
            // n'ont pas à connaître les codes vendus.
            $this->log->log(
                $admin,
                ActivityLogger::ACTIVATION_CODES_GENERATED,
                'activation_code_batch',
                $batch->id,
                null,
                [
                    'label' => $batch->label,
                    'quantity' => $quantity,
                    'access_days' => $accessDays,
                    'access_ends_at' => optional($accessEndsAt)->toIso8601String(),
                    'redeem_by' => optional($redeemBy)->toIso8601String(),
                ],
            );

            return ['batch' => $batch, 'codes' => $codes];
        });
    }

    /**
     * Tire un code dont l'empreinte n'est ni déjà en base, ni déjà dans ce lot.
     *
     * La collision est astronomiquement improbable (2^60 pour quelques
     * centaines de tirages), mais l'index unique de la table la refuserait
     * par une erreur SQL brute au milieu d'un lot de cent — on préfère
     * retirer. Au bout de cinq échecs il ne s'agit plus de malchance mais
     * d'un générateur en panne, et poursuivre masquerait la panne.
     *
     * @param  array<string, true>  $seen
     * @return array{0: string, 1: string, 2: string} [en clair, normalisé, empreinte]
     */
    private function drawUnique(array $seen): array
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $plain = ActivationCodeFormat::generate();
            $normalized = ActivationCodeFormat::normalize($plain);
            $hash = ActivationCodeFormat::hash($normalized);

            if (! isset($seen[$hash]) && ! ActivationCode::where('code_hash', $hash)->exists()) {
                return [$plain, $normalized, $hash];
            }
        }

        throw new DomainException(
            'Impossible de tirer un code unique : vérifiez le générateur aléatoire du serveur.'
        );
    }
}
