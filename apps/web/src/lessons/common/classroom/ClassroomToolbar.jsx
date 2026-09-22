import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Presentation, Minimize2, Minus, Plus } from 'lucide-react';
import { ChevronBack, ChevronForward, ChevronsBack, ChevronsForward } from '../../../components/common/DirectionalIcons';
import { SCALE_STEPS, scalePercent } from './classroomFit';

/**
 * Un bouton de la barre de présentation : ≥ 44 px, bordure épaisse, focus
 * visible — le langage des boutons de manipulation (ManipulationTeacherMode),
 * en un peu plus grand parce qu'on le vise depuis le tableau.
 */
function ToolbarButton({ onClick, disabled, children, tone = 'slate', ariaLabel, title, pressed, className = '', ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      title={title}
      // Les `data-*` du contrat DOM (e2e) passent par ici : sans ce
      // rest, un bouton nommé `data-classroom-nav-unit` sortait anonyme.
      {...rest}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 ${
        tone === 'primary'
          ? 'border-indigo-700 bg-indigo-600 text-white hover:bg-indigo-700'
          : 'border-slate-300 bg-white text-slate-800 hover:border-indigo-400 hover:text-indigo-800'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * La BARRE D'OUTILS du mode classe (brief §8) — une barre de bord, pas un
 * bandeau flottant : elle réserve sa hauteur, le contenu ne passe jamais
 * dessous.
 *
 *   [🎓 وضع القسم · titre]                        [−  حجم العرض 110٪  +]
 *
 * LA SORTIE N'EST PAS ICI. « خروج » vit au BAS de l'écran, sous « التالي »,
 * dans la barre de navigation (ClassroomNav) : la main de l'enseignant y est
 * déjà pour avancer, et rien ne l'oblige à remonter en haut de l'écran
 * devant une classe. Échap reste le raccourci clavier.
 *
 * Elle ne connaît ni le plein écran ni le contenu : ClassroomPresentation
 * lui passe l'état et les gestes. `slot` accueille les commandes futures
 * d'un contenu (étapes de révélation, §15) sans qu'on touche à la barre.
 */
const ClassroomToolbar = forwardRef(function ClassroomToolbar({ title, scope, scale, onScaleStep, slot }, ref) {
  const { t } = useTranslation('lesson');
  const atMin = scale <= SCALE_STEPS[0];
  const atMax = scale >= SCALE_STEPS[SCALE_STEPS.length - 1];
  // Le badge dit CE QU'ON PRÉSENTE (« المحور », « التمرين », « المناولة »),
  // pas le geste pour y entrer : depuis que le déclencheur du module dit
  // « عرض » tout court, réutiliser son libellé aurait donné un badge muet.
  const badge = scope && scope !== 'lesson' ? t(`classroom.scopeLabel.${scope}`) : t('classroom.title');

  return (
    <div ref={ref} className="sa-classroom-toolbar" data-classroom-toolbar role="toolbar" aria-label={t('classroom.title')}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-indigo-200 bg-white px-3 py-1.5 text-sm font-extrabold text-indigo-800">
          <Presentation className="h-4 w-4" aria-hidden="true" />
          {badge}
        </span>
        {title && (
          <span className="truncate text-base font-bold text-slate-800 sm:text-lg" data-classroom-title data-classroom-scope-label={scope}>
            {title}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {slot}

        <div className="inline-flex items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white/80 p-1" role="group" aria-label={t('classroom.scale')}>
          <ToolbarButton onClick={() => onScaleStep(-1)} disabled={atMin} ariaLabel={t('classroom.scaleDown')} title={t('classroom.scaleDown')} className="border-transparent">
            <Minus className="h-5 w-5" aria-hidden="true" />
          </ToolbarButton>
          <span className="hidden min-w-[6.5rem] select-none text-center text-xs font-bold text-slate-600 sm:inline" aria-live="polite">
            {t('classroom.scale')} <span dir="ltr" className="font-mono text-slate-900">{scalePercent(scale)}%</span>
          </span>
          <span className="min-w-[3rem] select-none text-center font-mono text-xs font-bold text-slate-900 sm:hidden" dir="ltr" aria-live="polite">
            {scalePercent(scale)}%
          </span>
          <ToolbarButton onClick={() => onScaleStep(+1)} disabled={atMax} ariaLabel={t('classroom.scaleUp')} title={t('classroom.scaleUp')} className="border-transparent">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </ToolbarButton>
        </div>

      </div>
    </div>
  );
});

export default ClassroomToolbar;

/**
 * La navigation du bas de présentation (brief §16). Deux ÉCHELLES de pas,
 * côte à côte, parce qu'un enseignant a les deux besoins :
 *
 *   [◀◀ المحور السابق] [◀ السابق]          [التالي ▶] [المحور التالي ▶▶]
 *          saut de محور   pas d'unité        pas d'unité    saut de محور
 *                                                        [⛶ خروج]
 *                                                     la sortie de séance
 *
 * `onPrevious`/`onNext` avancent d'une UNITÉ (la mission, le laboratoire,
 * une étape…) et franchissent le bord du module quand il n'y a plus d'unité.
 * `onPreviousModule`/`onNextModule` sautent AU MODULE voisin sans traverser
 * ses unités — « on a assez travaillé le نشاط, passons aux معارف ».
 *
 * Chaque geste absent ne rend AUCUN bouton (jamais de bouton mort) ; les
 * doubles chevrons distinguent d'un coup d'œil le saut du pas. Les sauts de
 * module portent en plus le numéro du محور visé (« المحور 3 ») : on sait où
 * l'on va avant de cliquer.
 *
 * `onExit` pose « خروج » SOUS « التالي », sur sa propre ligne et du même
 * côté : la sortie est au bas de l'écran, là où la main navigue, et non
 * dans un coin flottant. Sa ligne propre évite qu'on la frôle en avançant.
 * ClassroomPresentation rend donc TOUJOURS la barre pendant une séance,
 * même sans voisin à proposer — sinon la sortie disparaîtrait avec elle.
 */
export const ClassroomNav = forwardRef(function ClassroomNav({
  onPrevious, onNext, previousLabel, nextLabel,
  onPreviousModule, onNextModule, previousModuleLabel, nextModuleLabel,
  onExit,
}, ref) {
  const { t } = useTranslation('lesson');
  return (
    <div ref={ref} className="sa-classroom-nav" data-classroom-nav>
      <div className="sa-classroom-nav__side">
        {onPreviousModule && (
          <ToolbarButton
            onClick={onPreviousModule}
            ariaLabel={t('classroom.previousModuleAria')}
            title={t('classroom.previousModuleAria')}
            className="sa-classroom-nav__module"
            data-classroom-nav-module="previous"
          >
            <ChevronsBack className="h-5 w-5" aria-hidden="true" />
            <span className="sa-classroom-nav__label">{previousModuleLabel || t('classroom.previousModule')}</span>
          </ToolbarButton>
        )}
        {onPrevious && (
          <ToolbarButton onClick={onPrevious} ariaLabel={previousLabel || t('classroom.previous')} data-classroom-nav-unit="previous">
            <ChevronBack className="h-5 w-5" aria-hidden="true" />
            <span className="sa-classroom-nav__label">{previousLabel || t('classroom.previous')}</span>
          </ToolbarButton>
        )}
      </div>
      <div className="sa-classroom-nav__side sa-classroom-nav__side--end">
        {onNext && (
          <ToolbarButton onClick={onNext} tone="primary" ariaLabel={nextLabel || t('classroom.next')} data-classroom-nav-unit="next">
            <span className="sa-classroom-nav__label">{nextLabel || t('classroom.next')}</span>
            <ChevronForward className="h-5 w-5" aria-hidden="true" />
          </ToolbarButton>
        )}
        {onNextModule && (
          <ToolbarButton
            onClick={onNextModule}
            ariaLabel={t('classroom.nextModuleAria')}
            title={t('classroom.nextModuleAria')}
            className="sa-classroom-nav__module"
            data-classroom-nav-module="next"
          >
            <span className="sa-classroom-nav__label">{nextModuleLabel || t('classroom.nextModule')}</span>
            <ChevronsForward className="h-5 w-5" aria-hidden="true" />
          </ToolbarButton>
        )}
      </div>

      {/* « خروج » — SOUS « التالي », sur sa propre ligne au bas de la barre
          de navigation. Il ferme la séance, ce n'est pas un pas de plus : il
          garde donc sa ligne, à l'écart des chevrons, pour qu'on ne le frôle
          pas en avançant. Échap reste le raccourci clavier. */}
      {onExit && (
        <div className="sa-classroom-nav__exit">
          <ToolbarButton
            onClick={onExit}
            tone="primary"
            ariaLabel={t('classroom.exitAria')}
            title={t('classroom.exitHint')}
            className="sa-classroom-nav__exit-button"
            data-classroom-exit
          >
            <Minimize2 className="h-5 w-5" aria-hidden="true" />
            <span>{t('classroom.exit')}</span>
          </ToolbarButton>
        </div>
      )}
    </div>
  );
});
