<?php

namespace App\Domain\Registration;

use App\Domain\Classroom\ClassroomException;
use App\Domain\Classroom\ClassroomMembershipService;

/**
 * Peut-on créer un compte maintenant ? (config/registration.php)
 *
 * Fermé : seul l'élève porteur du lien VALIDE d'une classe qui accepte encore des membres passe (si `class_links`).
 */
class RegistrationGate
{
    public const CLOSED_CODE = 'registration_closed';

    public const CLOSED_MESSAGE = 'المنصّة في مرحلة التجربة: التسجيل مغلق مؤقّتًا.';

    public function __construct(private ClassroomMembershipService $memberships) {}

    public function isOpen(): bool
    {
        return (bool) config('registration.open');
    }

    /** Une inscription d'élève venue du lien d'une classe : admise pendant le test, si le lien tient encore. */
    public function allows(?string $role, ?string $classJoinLink, bool $consented): bool
    {
        if ($this->isOpen()) {
            return true;
        }
        if (! config('registration.class_links') || ! $consented || ! $classJoinLink || ($role !== null && $role !== 'student')) {
            return false;
        }
        try {
            return $this->memberships->classroomForLink($classJoinLink)->acceptsNewMembers();
        } catch (ClassroomException) {
            return false;
        }
    }
}
