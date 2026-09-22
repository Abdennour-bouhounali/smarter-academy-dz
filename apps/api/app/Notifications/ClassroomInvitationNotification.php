<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

/**
 * « Votre enseignant vous invite à rejoindre sa classe. »
 *
 * Envoyé à une ADRESSE, pas à un compte : la personne n'en a peut-être pas
 * encore. Le lien porte le jeton, seul secret ; aucun mot de passe, aucun
 * code de classe n'y figure.
 */
class ClassroomInvitationNotification extends Notification
{
    use Queueable;

    public function __construct(
        private string $classroomName,
        private string $teacherName,
        private string $url,
        private ?Carbon $expiresAt,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $teacher = $this->teacherName !== '' ? $this->teacherName : 'votre enseignant';
        $message = (new MailMessage)
            ->subject('دعوة للانضمام إلى القسم « '.$this->classroomName.' » — Smarter Academy')
            ->greeting('مرحبًا!')
            ->line("الأستاذ {$teacher} يدعوك للانضمام إلى القسم « {$this->classroomName} » على Smarter Academy.")
            ->line('إذا لم يكن لديك حساب بعد، ستتمكن من إنشائه ثم قبول الدعوة.')
            ->action('الانضمام إلى القسم', $this->url);

        if ($this->expiresAt !== null) {
            $message->line('هذه الدعوة صالحة إلى غاية '.$this->expiresAt->toDateString().'.');
        }

        return $message->salutation('فريق Smarter Academy');
    }
}
