import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Les cinq niveaux, et pourquoi les fermés le sont.
 *
 * Un verrou muet est une impasse : chaque niveau fermé DIT ce qu'il attend.
 * Et un niveau déjà ouvert le reste — on peut toujours redescendre
 * s'entraîner plus bas.
 *
 * TOUT LE TEXTE VIENT DE L'ARABE (`student.practice.*`). Ce composant était
 * écrit en français en dur (« Niveau 1 », « Reprendre les bases »,
 * « conseillé », « exercices ») : sur une plateforme arabophone, l'élève
 * lisait donc une langue qu'il n'a pas choisie, au milieu d'une page arabe.
 * Le motif du verrou (`level.reason`) reste ce que le serveur renvoie ; il
 * est doublé d'une phrase arabe quand le serveur n'en fournit pas.
 */
const TONES = {
  1: 'emerald', 2: 'sky', 3: 'indigo', 4: 'violet', 5: 'amber',
};

const RING = {
  emerald: 'border-emerald-300 hover:border-emerald-500',
  sky: 'border-sky-300 hover:border-sky-500',
  indigo: 'border-indigo-300 hover:border-indigo-500',
  violet: 'border-violet-300 hover:border-violet-500',
  amber: 'border-amber-300 hover:border-amber-500',
};

export default function LevelSelector({ levels, recommendedLevel, onSelect, busyLevel }) {
  const { t } = useTranslation('student');

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {levels.map((level) => {
        const tone = TONES[level.level] ?? 'indigo';
        const name = t(`practice.levelNames.${level.level}`, { defaultValue: '' });
        const label = t('practice.levelLabel', { level: level.level });
        const done = level.exerciseCount > 0 && level.completedCount >= level.exerciseCount;
        const recommended = level.level === recommendedLevel && level.unlocked;

        if (!level.unlocked) {
          return (
            <div key={level.level} className="space-y-2 rounded-2xl border-2 border-slate-200 bg-slate-50 p-5" data-practice-level={level.level} data-locked="true">
              <div className="flex items-center justify-between gap-2">
                <span className="font-space font-bold text-slate-400">{label}</span>
                <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              {name && <p className="text-sm text-slate-500">{name}</p>}
              <p className="text-xs text-slate-500">{level.reason || t('practice.levelLockedHint')}</p>
            </div>
          );
        }

        return (
          <button
            key={level.level}
            type="button"
            onClick={() => onSelect(level.level)}
            disabled={busyLevel != null}
            data-practice-level={level.level}
            className={`min-h-[128px] space-y-2 rounded-2xl border-2 bg-white p-5 text-start transition-colors disabled:opacity-70 ${RING[tone]}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-space font-bold text-slate-900">{label}</span>
              {recommended && (
                <span className="rounded-full bg-indigo-600 px-2 py-1 font-mono text-[11px] font-bold text-white">{t('practice.levelRecommended')}</span>
              )}
              {done && !recommended && (
                <span className="rounded-full bg-emerald-100 px-2 py-1 font-mono text-[11px] font-bold text-emerald-800">{t('practice.levelDone')}</span>
              )}
            </div>
            {name && <p className="text-sm text-slate-600">{name}</p>}
            <p className="font-mono text-xs text-slate-500" dir="auto">
              <span dir="ltr">{t('practice.levelProgress', { done: level.completedCount, total: level.exerciseCount })}</span>
              {busyLevel === level.level ? ` · ${t('practice.levelOpening')}` : ''}
            </p>
          </button>
        );
      })}
    </div>
  );
}
