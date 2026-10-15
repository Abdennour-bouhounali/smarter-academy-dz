import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MANIPULATION_TYPES } from '@smarter-academy/core/curriculum/manipulationTypes.js';
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
 * CONTRAT DOM (e2e) :
 *   [data-manipulation=<type>] [data-level=beginner|advanced] [data-manipulation-mode=<mode>] [data-phase]
 *   [data-manipulation-stage] [data-manipulation-discovery] [data-manipulation-formal]
 */
export default function ManipulationShell({
  type, title, mission, lead, state, controller, hints = [], numberFields = [], validate, controlsOverride,
  onCheck, checkDisabled, allowModeSwitch = false, representation, explanation, discovery, children, footer, allowFreeLab = true, freeLabAlwaysOpen = false, freeLabLead,
  headerAction, titleHidden = false, coach = null,
}) {
  const { t } = useTranslation('lesson');
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

  return (
    <section
      data-manipulation={type}
      data-manipulation-mode={state.mode}
      data-phase={state.phase}
      data-level={state.level}
      className="relative space-y-3 rounded-3xl border border-indigo-200 bg-indigo-50/40 p-1.5 sm:border-2 sm:p-5"
      aria-label={shownTitle}
    >
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          {/* `titleHidden` (MANIPULATION_DNA §17.9) : un labo s'ouvre sur son contexte et sa question, sans titre visible — le titre reste pour les lecteurs d'écran */}
          <h3 className={titleHidden ? 'sr-only' : 'text-base font-bold text-slate-900 sm:text-lg'}>{shownTitle}</h3>
          <div className="flex items-center gap-2">
            {headerAction}
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
          <p className="rounded-2xl bg-white/80 px-4 py-3 text-base font-extrabold leading-relaxed text-indigo-950 sm:text-lg" data-manipulation-mission>
            <span className="text-indigo-500">{t('manipulation.mission')}</span> {mission}
          </p>
        )}
        {shownLead && <p className="text-sm text-slate-700">{shownLead}</p>}
        {/* L'ONBOARDING (LabCoach, MANIPULATION_CONTRACT §8quater) : l'interrupteur sous la consigne, avant la scène */}
        {coach && <div className="flex" data-lab-coach-slot>{coach.toggle}</div>}
        {spec?.shows && state.showExplanation && (
          <p className="text-xs text-indigo-700"><strong>{t('manipulation.shows')}:</strong> {spec.shows}</p>
        )}
      </header>

      <ManipulationProgress state={state} />

      <ManipulationTeacherMode
        state={state} controller={controller} controls={controls} numberFields={numberFields} constraints={constraints} validate={validate} allowModeSwitch={allowModeSwitch}
      />
      <ManipulationControls state={state} controls={controls} hints={hints} onCheck={onCheck} checkDisabled={checkDisabled} autoComplete={controller?.autoComplete} />
      <ManipulationHint hints={hints} open={state.hintsOpen} />

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
  );
}
