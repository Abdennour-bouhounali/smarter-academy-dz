<?php

namespace App\Domain\School;

use DomainException;

/**
 * Un refus du domaine « établissement », AVEC son motif — même principe que
 * ClassroomException : vocabulaire clos, le contrôleur rend `reason` tel quel,
 * le client en fait un message (arabe pour le directeur, français pour
 * l'administration).
 */
class SchoolException extends DomainException
{
    /** Le compte n'a pas (ou plus) de nomination active dans un établissement actif. */
    public const NO_SCHOOL = 'no_school';

    /** Une adresse qui a déjà un compte : on ne transforme jamais un compte en directeur. */
    public const EMAIL_TAKEN = 'email_taken';

    /** L'établissement a déjà un directeur en fonction. */
    public const DIRECTOR_EXISTS = 'director_exists';

    public const NO_DIRECTOR = 'no_director';

    /** On ne nomme pas de directeur dans un établissement qui n'est pas actif. */
    public const SCHOOL_INACTIVE = 'school_inactive';

    public const INVALID_STATUS = 'invalid_status';

    public function __construct(public readonly string $reason, string $message)
    {
        parent::__construct($message);
    }
}
