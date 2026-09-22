import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize2, GraduationCap } from 'lucide-react';
import { useClassroomMode } from './ClassroomContext';

/**
 * Le POINT D'ENTRÉE du mode classe, par portée :
 *
 *   🎓 وضع القسم         scope = lesson        (sommaire de la leçon)
 *   ⛶ عرض               scope = module        (bouton FLOTTANT, tone="floating")
 *   ⛶ عرض التمرين       scope = exercise      (en-tête de l'exercice)
 *   ⛶ عرض المناولة      scope = manipulation  (en-tête de la manipulation)
 *
 * PLACEMENT. `tone="floating"` sort le bouton du flux et le pose dans la
 * COLONNE FLOTTANTE en bas à gauche — même bord, même z-index, même langage
 * visuel que « بطاقتي » et « كرّاسي ». Il se pose JUSTE SOUS la carte des
 * connaissances, au RAS DU COIN : son écart au bas (1.5rem) égale son écart
 * à gauche, et la carte (5.5rem) puis le cahier (9.5rem) s'empilent
 * au-dessus. Le bord gauche est une valeur PHYSIQUE et non logique :
 * sous RTL la barre latérale de l'espace élève occupe la droite et
 * intercepterait les clics (voir la note de KnowledgeMap.jsx, apprise en QA).
 *
 * Il ne rend RIEN pour qui n'a pas le rôle présentateur (canPresentClassroom)
 * et rien non plus pendant une présentation (la barre de navigation du bas
 * porte « خروج » ; une coquille imbriquée n'ouvre jamais de seconde
 * session).
 * Placé où le contenu le souhaite — dans son propre en-tête — il agit par le
 * contexte : `scope` dit à la coquille ce qu'on présente.
 */
const ClassroomEntryButton = forwardRef(function ClassroomEntryButton({ scope: scopeProp, title, className = '', compact = false, tone = 'primary' }, ref) {
  const { t } = useTranslation('lesson');
  const ctx = useClassroomMode();
  if (!ctx.canPresent || ctx.isClassroomMode) return null;

  const scope = scopeProp ?? ctx.scope ?? 'manipulation';
  // Le bouton flottant dit « عرض » tout court : dans la colonne des repères,
  // hors de l'en-tête de ce qu'il présente, nommer la portée n'ajoute rien.
  // Les boutons posés DANS un en-tête gardent leur libellé explicite, qui y
  // distingue ce qu'on présente (l'exercice, la manipulation…).
  const label = tone === 'floating' ? t('classroom.enter.floating') : t(`classroom.enter.${scope}`);
  const Icon = scope === 'lesson' ? GraduationCap : Maximize2;
  const floating = tone === 'floating';
  const look = tone === 'quiet' || floating
    ? 'border-indigo-200 bg-white text-indigo-800 hover:border-indigo-400 hover:bg-indigo-50'
    : 'border-indigo-700 bg-indigo-600 text-white hover:bg-indigo-700';
  // La colonne flottante : au ras du coin, SOUS « بطاقتي » et « كرّاسي ».
  const place = floating ? 'sa-classroom-fab' : '';

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ctx.enterClassroomMode({ scope, title })}
      aria-label={t('classroom.enterAria')}
      aria-expanded={false}
      title={t('classroom.enterHint')}
      data-classroom-enter={scope}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-extrabold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${look} ${place} ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {!compact && <span>{label}</span>}
    </button>
  );
});

export default ClassroomEntryButton;
