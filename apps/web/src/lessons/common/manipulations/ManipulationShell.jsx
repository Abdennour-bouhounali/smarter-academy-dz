import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize2, Minimize2 } from 'lucide-react';
import { MANIPULATION_TYPES } from '@smarter-academy/core/curriculum/manipulationTypes.js';
import { useFullscreen } from '../classroom/useFullscreen';
import { useScrollLock } from '../classroom/useScrollLock';
import { useClassroomMode } from '../classroom/ClassroomContext';
import { ManipulationImmersiveContext } from './immersive';
import ManipulationProgress from './ManipulationProgress';
import ManipulationControls from './ManipulationControls';
import ManipulationTeacherMode from './ManipulationTeacherMode';
import ManipulationHint from './ManipulationHint';
import ManipulationExplanation from './ManipulationExplanation';
import ManipulationFreeLab from './ManipulationFreeLab';
import ManipulationLevelSelector from './ManipulationLevelSelector';
import { MANIPULATION_LEVEL_IDS } from './levels';

/**
 * L'ENVELOPPE commune de toute manipulation (§7 du brief). De haut en bas :
 *
 *   ┌ en-tête : titre, badge « مناولة », sélecteur مبتدئ / متقدم (seule)
 *   ├ MISSION  — une consigne arabe courte et grande (« مهمتك : … »)
 *   ├ progression (جرّب › اكتشف › صِغ · الخطوة n من N)
 *   ├ contrôles élève (إعادة · تلميح · تحقّق · الشرح)
 *   ├ indices demandés
 *   ├ AIRE DE MANIPULATION (`children`, le centre visuel)
 *   ├ REPRÉSENTATION VIVANTE (`representation`) — la notation qui SUIT le geste
 *   ├ découverte / règle (rendue par le type via ManipulationDiscovery)
 *   ├ explication (à la demande)
 *   └ مختبر حر
 *
 * L'enveloppe ne connaît aucune mathématique : le type lui donne un `state`
 * (useManipulation), un `controller` (le geste canonique pour le mode
 * classe, et `controller.autoComplete` pour le bouton élève « compléter
 * automatiquement » quand le registre l'accorde — §6bis du contrat) et ses
 * textes. RTL comme la page ; les blocs numériques se
 * déclarent LTR eux-mêmes.
 *
 * MODE. Dans les modules, la manipulation est TOUJOURS en « وضع التلميذ » :
 * `allowModeSwitch` vaut false par défaut, et la bascule « وضع القسم » n'est
 * donc jamais affichée à l'élève (décision du propriétaire, réaffirmée le
 * 2026-09-19). Le mode classe RESTE implémenté (ManipulationTeacherMode :
 * pas à pas, rejouer, masquer la conclusion, montrer la solution, changer
 * les nombres) pour une future surface enseignant, qui passera
 * explicitement `allowModeSwitch`. On ne supprime pas le code du mode
 * classe : il est testé, et la leçon n'y perd rien tant qu'il n'est pas
 * montré.
 *
 * NIVEAUX. Seule dans un module, la manipulation pose le sélecteur
 * مبتدئ / متقدم dans son en-tête (levels.js). Dans un ManipulationWorkspace,
 * elle n'en pose aucun : le workspace porte le seul sélecteur. Le titre et
 * le lead écrits par la leçon décrivent SES nombres ; sur l'autre niveau, ils
 * cèdent la place à un titre neutre (« تدرّب: المستوى المتقدم ») — sinon
 * « مثال الكتاب: 28 و 42 » coifferait 65 et 78.
 *
 * ONBOARDING (2026-10-14, §8quater du contrat) : la prop `coach` reçoit `{ toggle, overlay }` de `useLabCoach` (appelé PAR le type,
 * qui connaît son prochain geste). L'enveloppe est `relative` : la couche du guide couvre tout le cadre, donc un
 * `target` peut être un contrôle de l'en-tête, de la scène ou du bas. L'interrupteur se pose sous la consigne.
 *
 * ÉCRAN DE JEU (`immersive`, 2026-10-27, propriétaire : « le labo couvre exactement tout l'écran du laptop, l'élève se sent dans un
 * jeu ») : le type qui l'active reçoit un bouton « العب بملء الشاشة » dans l'en-tête. Le labo passe alors en VRAI plein écran du
 * navigateur (`useFullscreen` du mode classe — jamais un second plein écran), le défilement de la page est verrouillé
 * (`useScrollLock`), l'en-tête se réduit à UNE barre (sortie · guide · جرّب › اكتشف › صِغ · إعادة / تلميح) et le type lit
 * `useManipulationImmersive()` pour poser sa scène à la hauteur de l'écran. Échap (le navigateur) ou « خروج » rendent la page.
 * Sans API plein écran (ou refus), une couche fixe couvre la fenêtre avec la même barre. Jamais en mode classe (déjà plein écran).
 *
 * CONTRAT DOM (e2e) :
 *   [data-manipulation=<type>] [data-level=beginner|advanced] [data-manipulation-mode=<mode>] [data-phase]
 *   [data-manipulation-stage] [data-manipulation-discovery] [data-manipulation-formal]
 *   [data-immersive=on|off] [data-manipulation-immersive-enter] [data-manipulation-immersive-exit] [data-manipulation-immersive-bar]
 */
export default function ManipulationShell({
  type, title, mission, lead, state, controller, hints = [], numberFields = [], validate, controlsOverride,
  onCheck, checkDisabled, allowModeSwitch = false, representation, explanation, discovery, children, footer, allowFreeLab = true, freeLabAlwaysOpen = false, freeLabLead,
  headerAction, titleHidden = false, coach = null, immersive = false,
}) {
  const { t } = useTranslation('lesson');
  const rootRef = useRef(null);
  const classroom = useClassroomMode();
  const canImmerse = immersive && !classroom.isClassroomMode;
  const fullscreen = useFullscreen(rootRef);
  const [pinned, setPinned] = useState(false); // la couche fixe, quand le navigateur refuse le plein écran
  const immersed = canImmerse && (fullscreen.isFullscreen || pinned);
  useScrollLock(immersed);
  const enter = async () => { if (!(await fullscreen.request())) setPinned(true); };
  const leave = () => { setPinned(false); fullscreen.exit(); };
  // la découverte s'ouvre sous la scène : à l'écran de jeu, on la fait venir
  useEffect(() => {
    if (!immersed || state.phase === 'act') return;
    rootRef.current?.querySelector('[data-manipulation-discovery]')?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  }, [immersed, state.phase]);
  const spec = MANIPULATION_TYPES[type];
  const controls = { ...(spec?.controls ?? {}), ...(controlsOverride ?? {}) };
  const constraints = controls.changeNumbers || null;
  const shownTitle = state.isAuthoredLevel ? title : t('manipulation.level.practiceTitle', { level: t(`manipulation.level.${state.level}`) });
  const shownLead = state.isAuthoredLevel ? lead : null;

  // LE RÉSULTAT VIT EN HAUT, ET NE CLIGNOTE PAS (2026-10-09, toutes les
  // manipulations). Il est posé entre les contrôles et l'aire de manipulation,
  // et c'est UN seul emplacement : tant qu'aucun essai n'a eu lieu il montre
  // une ligne d'attente de même hauteur, ensuite il est MIS À JOUR sur place.
  // Quand un type retire sa ligne le temps d'un geste (`settled && …`), on
  // garde la dernière jusqu'à la suivante — sauf si la conclusion est cachée
  // (mode classe), ou si la scène repart (إعادة, autre niveau, autres nombres).
  const hasRepresentation = representation !== undefined;
  const held = useRef({ key: null, node: null });
  const heldKey = `${state.epoch}:${state.resetCount}:${state.level}`;
  if (held.current.key !== heldKey) held.current = { key: heldKey, node: null };
  if (representation) held.current.node = representation;
  const shownRepresentation = representation || (state.answerHidden ? null : held.current.node);
  const stale = !representation && !!shownRepresentation;

  const progress = <ManipulationProgress state={state} />;
  const studentControls = <ManipulationControls state={state} controls={controls} hints={hints} onCheck={onCheck} checkDisabled={checkDisabled} autoComplete={controller?.autoComplete} />;
  const pill = 'inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-black outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none';

  return (
    <ManipulationImmersiveContext.Provider value={immersed}>
    <section
      ref={rootRef}
      data-manipulation={type}
      data-manipulation-mode={state.mode}
      data-phase={state.phase}
      data-level={state.level}
      data-immersive={canImmerse ? (immersed ? 'on' : 'off') : undefined}
      className={immersed
        ? 'fixed inset-0 z-[80] h-[100dvh] w-screen space-y-2 overflow-y-auto overscroll-contain bg-gradient-to-b from-indigo-50 via-white to-sky-50 p-3 lg:px-6'
        : 'relative space-y-3 rounded-3xl border-indigo-200 bg-indigo-50/40 border-2 p-5'}
      aria-label={shownTitle}
    >
      {/* la couche fixe (sans plein écran) vit sous le contexte d'empilement de la page : la barre latérale de l'espace s'efface le temps du jeu */}
      {immersed && <style>{'.sa-workspace-sidebar{display:none!important}'}</style>}
      {immersed && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2" data-manipulation-immersive-bar>
          <button type="button" onClick={leave} data-manipulation-immersive-exit
            className={`${pill} border-2 border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50`}>
            <Minimize2 className="h-4 w-4" aria-hidden="true" /> {t('manipulation.immersive.exit')}
          </button>
          {coach && coach.toggle}
          <div className="min-w-0 flex-1">{progress}</div>
          {studentControls}
        </div>
      )}
      {immersed && <ManipulationHint hints={hints} open={state.hintsOpen} />}
      <header className={immersed ? 'sr-only' : 'space-y-2'}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          {/* `titleHidden` (MANIPULATION_DNA §17.9) : un labo s'ouvre sur son contexte et sa question, sans titre visible — le titre reste pour les lecteurs d'écran */}
          <h3 className={titleHidden ? 'sr-only' : 'font-bold text-slate-900 text-lg'}>{shownTitle}</h3>
          <div className="flex items-center gap-2">
            {headerAction}
            {canImmerse && !immersed && (
              <button type="button" onClick={enter} data-manipulation-immersive-enter
                className={`${pill} border-2 border-indigo-600 bg-indigo-600 text-white shadow-[0_3px_0_0_#3730A3] hover:bg-indigo-700`}>
                <Maximize2 className="h-4 w-4" aria-hidden="true" /> {t('manipulation.immersive.enter')}
              </button>
            )}
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-indigo-500">{t('manipulation.badge')}</span>
          </div>
        </div>
        {freeLabAlwaysOpen && (
          <ManipulationFreeLab state={state} numberFields={numberFields} constraints={constraints} validate={validate} allowFreeLab={allowFreeLab} alwaysOpen lead={freeLabLead} />
        )}
        {state.levels && (
          <ManipulationLevelSelector levels={MANIPULATION_LEVEL_IDS} value={state.level} onChange={state.setLevel} />
        )}
        {!state.isAuthoredLevel && state.levelPreset?.source === 'platform' && (
          <p className="text-[11px] font-bold text-slate-500">{t('textbook.platformAddition')}</p>
        )}
        {mission && (
          <p className="rounded-2xl bg-white/80 px-4 py-3 font-extrabold leading-relaxed text-indigo-950 text-lg" data-manipulation-mission>
            <span className="text-indigo-500">{t('manipulation.mission')}</span> {mission}
          </p>
        )}
        {shownLead && <p className="text-sm text-slate-700">{shownLead}</p>}
        {/* L'ONBOARDING (LabCoach, MANIPULATION_CONTRACT §8quater) : l'interrupteur sous la consigne, avant la scène */}
        {coach && !immersed && <div className="flex" data-lab-coach-slot>{coach.toggle}</div>}
        {spec?.shows && state.showExplanation && (
          <p className="text-xs text-indigo-700"><strong>{t('manipulation.shows')}:</strong> {spec.shows}</p>
        )}
      </header>

      {!immersed && progress}

      <ManipulationTeacherMode
        state={state} controller={controller} controls={controls} numberFields={numberFields} constraints={constraints} validate={validate} allowModeSwitch={allowModeSwitch}
      />
      {!immersed && studentControls}
      {!immersed && <ManipulationHint hints={hints} open={state.hintsOpen} />}

      {hasRepresentation && (
        shownRepresentation ? (
          <div className="space-y-2" data-manipulation-representation data-representation-top data-representation-stale={stale ? 'true' : undefined} aria-live="polite">
            {shownRepresentation}
          </div>
        ) : (
          <p className="flex min-h-[3.75rem] items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-4 py-2 text-sm font-bold text-slate-500" data-representation-slot="idle">
            {t('manipulation.resultIdle')}
          </p>
        )
      )}

      {children}

      {discovery}

      <ManipulationExplanation show={state.showExplanation}>{explanation}</ManipulationExplanation>

      {!freeLabAlwaysOpen && <ManipulationFreeLab state={state} numberFields={numberFields} constraints={constraints} validate={validate} allowFreeLab={allowFreeLab} lead={freeLabLead} />}
      {footer}
      {coach && coach.overlay}
    </section>
    </ManipulationImmersiveContext.Provider>
  );
}
