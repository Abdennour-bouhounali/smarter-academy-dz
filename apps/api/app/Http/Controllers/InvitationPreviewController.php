<?php

namespace App\Http\Controllers;

use App\Domain\Classroom\ClassroomException;
use App\Domain\Classroom\ClassroomInvitationService;
use DomainException;

/**
 * Ce qu'un lien d'invitation révèle AVANT tout compte : le nom de la classe,
 * la classe scolaire, l'enseignant. Publique et limitée en débit — le jeton
 * a 40 symboles, un tâtonnement n'a aucune chance, mais il ne doit pas
 * coûter une requête par essai non plus.
 */
class InvitationPreviewController extends Controller
{
    public function __construct(private ClassroomInvitationService $invitations) {}

    public function show(string $token)
    {
        try {
            $preview = $this->invitations->preview($token);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'reason' => $e instanceof ClassroomException ? $e->reason : null,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json(['success' => true, 'invitation' => $preview]);
    }
}
