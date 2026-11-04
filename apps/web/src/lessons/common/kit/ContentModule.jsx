import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KitContext, useKit } from './kitContext';

// Ré-export : les modules qui importaient useKit depuis ici continuent de marcher.
export { useKit };
import ModuleLayout from '../components/ModuleLayout';
import { useProgress } from '../hooks/useProgress';
import { useModuleEffects } from '../hooks/useModuleEffects';
import {
  MissionBrief, StepCard, StepProgressBar, StreakChip, EffectsToggle,
} from '../components/LessonUI';
import { isStepLocked, canAdvance } from '../utils/stepUnlock';
import { useLearningViewer } from '../../../features/learning/learningViewer';
import { useClassroomMode, useClassroomStage, ClassroomFrame, ClassroomPaged } from '../classroom';
import { clampPage } from '../classroom/classroomPages';
import ModuleOverview from './ModuleOverview';
import { useStudentFocusFor, MoreToggle } from '../components/StudentFocus';
import { isMissionView } from '../mission/missionModel';
import { useDeclareUnitNav } from '../mission/missionPlayerContext';
import { getLoadedLessonConfig } from '../../registry';
import { moduleUnits, clampUnit, resolveModuleNavigation } from '../classroom/classroomUnits';

/**
 * Lesson kit — shell d'un module de contenu (formatif).
 *
 * Concentre en un seul endroit tout ce que chaque module recopiait à la
 * main : progression des étapes (StepProgressBar), série + effets sonores
 * (StreakChip/EffectsToggle via useModuleEffects), verrouillage séquentiel
 * des StepCard avec libre navigation après complétion (isStepLocked), et
 * incompleteSteps pour le bouton « Module suivant ».
 *
 * LE LECTEUR décide du verrou, jamais un rôle écrit ici : `isStepLocked` et
 * `canAdvance` (utils/stepUnlock) reçoivent `freeNavigation`, de sorte qu'un
 * enseignant ouvre n'importe quelle PARTIE dans n'importe quel ordre et
 * avance vers le module suivant sans rien « terminer ». Voir
 * features/learning/learningViewer.js et utils/moduleGate.js (même règle un
 * cran plus haut).
 *
 * Le module appelant ne garde que : son état propre (les flags done de ses
 * étapes + l'état de ses manipulations), et le CONTENU de chaque étape.
 *
 * `steps[].content`, `intro` et `footer` acceptent un ReactNode OU une
 * fonction `(kit) => ReactNode` recevant `{ react, alreadyCompleted,
 * effectsEnabled }` — utile quand une manipulation maison doit déclencher
 * le son/la série (`react(true)` à l'atteinte de l'objectif). Les
 * composants question du kit (TapQuestion…) récupèrent le même objet via
 * le contexte (`useKit()`), sans fil à tirer.
 *
 * MODE CLASSE (وضع القسم — lessons/common/classroom). Présenté, le module
 * devient une suite d'UNITÉS pédagogiques montrées une à la fois, dans
 * l'ordre qu'il a déjà : المهمة (brief) → المختبر (intro) → les étapes → la
 * khulasa (footer, quand il est terminé). Les unités sont TOUJOURS toutes
 * rendues, au même endroit de l'arbre (les autres portent `hidden`) : entrer
 * ou sortir de la présentation ne remonte rien — réponses données, livres
 * posés, étape atteinte, tout survit. Les étapes gardent leur verrou
 * pédagogique (une étape se débloque en répondant à la précédente) et rien
 * n'est révélé plus tôt qu'en page. Le module déclare à la coquille son
 * titre, sa position et ses gestes السابق/التالي (useClassroomStage) ; en
 * session LEÇON, les bouts de la suite mènent au module voisin.
 */
export default function ContentModule({
  ctx,            // MODULE_CTX de la leçon (spread dans ModuleLayout)
  navLinks,       // getNavLinks(moduleNumber)
  moduleNumber,
  moduleTitle,
  moduleSubtitle,
  estimatedTime,
  // La CARTE D'ACTIVITÉ du module (MissionBrief, components/LessonUI.jsx) :
  //   { tag, title, body, tone?, headline?, emoji?, visual?, footer? }
  // `headline`, `emoji`, `visual` et `footer` sont OPTIONNELS — un module qui
  // ne les fournit pas obtient la même carte, en plus sobre.
  brief,
  intro,          // contenu entre le brief et les étapes (ex. cartes de mission)
  objectives,     // [string] « ماذا سنتعلّم » de la page d'entrée présentée ; défaut : les titres des étapes
  steps,          // [{ num, title, subtitle?, done, content }]
  footer,         // contenu de fin, rendu quand allDone
}) {
  const { xp, isModuleCompleted } = useProgress(ctx.lessonId);
  // QUI lit ce module : l'enseignant navigue librement entre les parties.
  const viewer = useLearningViewer();
  const alreadyCompleted = isModuleCompleted(String(moduleNumber));
  const { effectsEnabled, toggleEffects, streak, react } = useModuleEffects();

  // `allDone` reste la VÉRITÉ PÉDAGOGIQUE du module (barre de progression,
  // khulasa, complétion écrite par ModuleLayout). Avancer, lui, est
  // structurel pour un lecteur libre — les deux ne se confondent pas.
  const allDone = alreadyCompleted || steps.every((s) => s.done);
  const mayAdvance = canAdvance(allDone, viewer);
  const doneCount = steps.filter((s) => s.done).length;
  const incompleteSteps = steps.filter((s) => !s.done).map(({ num, title }) => ({ num, title }));

  // REGARD « FOCUS » DE L'ÉLÈVE (StudentFocus.jsx) : UNE étape à l'écran. L'étape répondue reste ouverte (son retour se
  // lit) avec « التالي » ; celles qu'on a dépassées se replient en une ligne ✓ ; les suivantes n'apparaissent pas encore.
  const focusView = useStudentFocusFor(ctx.studentView);
  const firstOpen = steps.findIndex((s) => !s.done);
  const [focusIndex, setFocusIndex] = useState(() => (alreadyCompleted || firstOpen === -1 ? steps.length : firstOpen));
  const [reopened, setReopened] = useState({});
  const advanceFocus = () => {
    const next = focusIndex + 1;
    setFocusIndex(next);
    if (next < steps.length) requestAnimationFrame(() => document.getElementById(`step-${steps[next].num}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const kit = { react, alreadyCompleted, effectsEnabled };
  const renderSlot = (slot) => (typeof slot === 'function' ? slot(kit) : slot);

  // ── Mode classe : les unités et leur navigation ──────────────────────────
  const { t } = useTranslation('lesson');
  const classroom = useClassroomMode();
  const presenting = classroom.isClassroomMode;
  // MODE MISSION (élève) : le module se JOUE unité par unité dans le lecteur (MissionPlayer), sans défilement — la même
  // mécanique d'unités et de pages que le mode classe, mais avec les verrous, l'écriture et les tests de l'ÉLÈVE.
  const play = Boolean(getLoadedLessonConfig(ctx.lessonId)?.mission) && isMissionView(ctx.studentView, viewer, classroom);
  const paged = presenting || play;
  // Le pas-à-pas du regard focus cède la place au lecteur, qui montre déjà une unité à la fois.
  const focus = focusView && !play;
  const stepKey = steps.map((s) => s.num).join('|');
  // La khulasa est une UNITÉ en mode classe : sa présence doit être celle
  // que le rendu montre réellement (sinon le compteur « n / N » dérive).
  const showFooter = allDone || viewer.freeNavigation;
  const hasFooter = showFooter && Boolean(footer);
  const units = useMemo(
    () => moduleUnits({ overview: !play, brief: Boolean(brief), intro: Boolean(intro), steps, footer: hasFooter }),
    // `steps` est recréé à chaque rendu par le module : on suit ses numéros.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Boolean(brief), Boolean(intro), stepKey, hasFooter, play],
  );
  const [unitIndex, setUnitIndex] = useState(0);
  const current = clampUnit(unitIndex, units.length);

  // Les PAGES d'une unité (ClassroomPaged) : une étape trop haute est découpée
  // au lieu d'être réduite. `pageCounts` : le nombre de pages de chaque unité
  // (une seule tant qu'elle n'a pas été mesurée) ; `page` : la page courante.
  const [page, setPage] = useState(0);
  const [pageCounts, setPageCounts] = useState({});
  const pendingLast = useRef(null); // l'unité qu'on rejoint par sa DERNIÈRE page
  const currentKey = units[current]?.key;
  const pageCount = pageCounts[currentKey] ?? 1;
  const goTo = useCallback((i) => { setPage(0); setUnitIndex(i); }, []);
  const onPages = useCallback((key, count) => {
    setPageCounts((prev) => (prev[key] === count ? prev : { ...prev, [key]: count }));
    if (pendingLast.current === key) {
      pendingLast.current = null;
      setPage(count - 1);
    }
  }, []);
  const isPaged = (key) => key.startsWith('step-') || key === 'footer';

  // Par quel bout entrer quand une session leçon arrive ici (« السابق »
  // depuis le module suivant → la dernière unité).
  useEffect(() => {
    if (!presenting) return;
    const arrival = classroom.takeArrival();
    if (arrival === 'last') {
      const lastKey = units[units.length - 1]?.key;
      pendingLast.current = lastKey && isPaged(lastKey) ? lastKey : null;
      setPage(0);
      setUnitIndex(units.length - 1);
    } else if (arrival === 'first') { setPage(0); setUnitIndex(0); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting]);

  // Changer d'unité change la nature du contenu : le moteur d'ajustement
  // repart de l'échelle demandée.
  useEffect(() => {
    if (presenting) classroom.refit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, presenting]);

  const lessonNav = classroom.lessonNavigation;
  const nav = useMemo(() => {
    const unitNav = resolveModuleNavigation({
      index: current, count: units.length, goTo, lessonPrevious: lessonNav?.previous, lessonNext: lessonNav?.next,
    });
    // À l'intérieur d'une unité en plusieurs pages, السابق / التالي tournent
    // d'abord les pages ; l'unité voisine (ou le محور voisin) ne vient qu'après.
    const onNext = page < pageCount - 1 ? () => setPage(page + 1) : unitNav.onNext;
    let onPrevious = unitNav.onPrevious;
    if (page > 0) onPrevious = () => setPage(page - 1);
    else if (current > 0) {
      const previousKey = units[current - 1]?.key;
      onPrevious = () => { pendingLast.current = previousKey && isPaged(previousKey) ? previousKey : null; goTo(current - 1); };
    }
    return { onPrevious, onNext };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, units, goTo, lessonNav, page, pageCount]);
  const slot = useMemo(() => (
    <>
      {pageCount > 1 && (
        <span className="sa-classroom-position sa-classroom-position--page" data-classroom-page-position data-classroom-page-index={page}>
          {t('classroom.pageOf', { current: page + 1, total: pageCount })}
        </span>
      )}
      <span className="sa-classroom-position" data-classroom-position data-classroom-unit-index={current} dir="ltr">
        {current + 1} / {units.length}
      </span>
    </>
  ), [current, units.length, page, pageCount, t]);
  useClassroomStage({ title: moduleTitle, onPrevious: nav.onPrevious, onNext: nav.onNext, slot, priority: 2 }, presenting);

  // Ce que le LECTEUR de mission montre et permet : les mêmes gestes que la présentation (pages, puis unités), mais on
  // ne quitte une étape qu'une fois FAITE (le verrou de l'élève) ; au bout, le lecteur passe la main au module suivant.
  const doneKey = steps.map((s) => (s.done ? 1 : 0)).join('');
  const playNav = useMemo(() => {
    if (!play) return null;
    const unit = units[current];
    const step = unit?.kind === 'step' ? steps.find((s) => `step-${s.num}` === unit.key) : null;
    const morePages = page < pageCount - 1;
    return {
      index: current, count: units.length, page, pageCount, kind: unit?.kind,
      onPrevious: nav.onPrevious, onNext: nav.onNext,
      canNext: morePages || !step || step.done || alreadyCompleted,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, current, units, page, pageCount, nav, doneKey, alreadyCompleted]);

  // Une unité : toujours rendue, cachée quand elle n'est pas la courante.
  const unitProps = (key) => {
    const i = units.findIndex((u) => u.key === key);
    const hidden = paged && i !== current;
    return { hidden, className: `sa-classroom-module__unit sa-classroom-module__unit--${key.startsWith('step-') ? 'step' : key}`, 'data-classroom-unit': i >= 0 ? i : undefined };
  };

  return (
    <KitContext.Provider value={kit}>
      <ModuleLayout
        {...ctx}
        moduleTitle={moduleTitle}
        moduleSubtitle={moduleSubtitle}
        moduleNumber={moduleNumber}
        previousStage={ctx.stageByNumber?.[Number(moduleNumber) - 1]}
        estimatedTime={estimatedTime}
        xp={xp}
        prevLink={navLinks.prevLink}
        nextLink={mayAdvance ? navLinks.nextLink : undefined}
        isCompleted={mayAdvance}
        incompleteSteps={incompleteSteps}
        presentationFrame={false}
      >
        <div
          className={presenting ? 'sa-classroom-module' : play ? 'space-y-4' : 'sa-page py-8 flex-1 space-y-8'}
          data-classroom-units={presenting ? units.length : undefined}
          data-classroom-current={presenting ? current : undefined}
        >
          {!presenting && !play && !allDone && <StepProgressBar doneCount={doneCount} total={steps.length} />}
          {play && <DeclareUnitNav nav={playNav} />}

          {/* Lecteur : la série se pose PAR-DESSUS l'écran (coin haut) — insérée au-dessus du contenu, elle le poussait vers le
              bas à chaque bonne réponse (propriétaire, 2026-11-04 : rien ne bouge sur un écran posé). */}
          {play && <div className="pointer-events-none absolute end-6 top-1 z-10" data-streak-overlay><StreakChip count={streak} /></div>}
          {!presenting && !play && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <StreakChip count={streak} />
              {/* Dans le lecteur de mission, « الصوت » est dans sa barre du haut (même préférence partagée) : pas de doublon. */}
              {!play && <EffectsToggle enabled={effectsEnabled} onToggle={toggleEffects} />}
            </div>
          )}

          <div {...unitProps('overview')}>
            {presenting && (
            <ClassroomFrame>
              <ModuleOverview
                number={moduleNumber}
                title={moduleTitle}
                subtitle={moduleSubtitle}
                estimatedTime={estimatedTime}
                points={objectives?.length ? objectives : steps.map((st) => st.title)}
              />
            </ClassroomFrame>
            )}
          </div>

          <div {...unitProps('brief')}>
            {brief && (
              <ClassroomFrame>
                <MissionBrief
                  tag={brief.tag}
                  title={brief.title}
                  headline={brief.headline}
                  emoji={brief.emoji}
                  visual={brief.visual}
                  footer={brief.footer}
                  tone={brief.tone}
                >
                  {brief.body && (brief.keepBody ? brief.body : <MoreToggle>{brief.body}</MoreToggle>)}
                </MissionBrief>
              </ClassroomFrame>
            )}
          </div>

          {/* Le laboratoire (manipulation) n'est PAS cadré : il calcule sa
              propre mise en page de classe pour la zone offerte. */}
          <div {...unitProps('intro')}>
            {renderSlot(intro)}
          </div>

          {steps.map((s, i) => (focus && i > focusIndex ? null : (
            <div key={s.num} {...unitProps(`step-${s.num}`)}>
              <ClassroomFrame>
                <StepCard
                  num={s.num}
                  title={s.title}
                  subtitle={s.subtitle}
                  done={s.done}
                  locked={!focus && isStepLocked(alreadyCompleted, i === 0 ? false : !steps[i - 1].done, { freeNavigation: viewer.freeNavigation, presenting })}
                  collapsible={focus}
                  collapsed={focus && i < focusIndex && !reopened[s.num]}
                  onToggle={() => setReopened((r) => ({ ...r, [s.num]: true }))}
                >
                  <ClassroomPaged
                    active={paged && current === units.findIndex((u) => u.key === `step-${s.num}`)}
                    page={currentKey === `step-${s.num}` ? page : 0}
                    onPages={(n) => onPages(`step-${s.num}`, n)}
                  >
                    {renderSlot(s.content)}
                  </ClassroomPaged>
                </StepCard>
                {focus && i === focusIndex && (
                  <div className="mt-3 flex flex-wrap items-center gap-4" data-focus-step-nav>
                    <span className="text-sm font-semibold text-slate-500">{t('focus.questionOf', { n: i + 1, total: steps.length })}</span>
                    {s.done && i < steps.length - 1 && (
                      <button type="button" onClick={advanceFocus} data-focus-next
                        className="min-h-[44px] rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm hover:bg-indigo-700">
                        {t('focus.next')} <span aria-hidden="true">←</span>
                      </button>
                    )}
                  </div>
                )}
              </ClassroomFrame>
            </div>
          )))}

          {/* Les étapes à venir ne sont pas supprimées : leurs titres s'ouvrent ici (verrouillées jusqu'à ce qu'on y arrive). */}
          {focus && focusIndex < steps.length - 1 && (
            <MoreToggle label={t('focus.upcoming', { count: steps.length - focusIndex - 1 })}>
              <div className="space-y-3" data-focus-upcoming>
                {steps.slice(focusIndex + 1).map((s) => (
                  <StepCard key={s.num} num={s.num} title={s.title} done={s.done} locked />
                ))}
              </div>
            </MoreToggle>
          )}

          <div {...unitProps('footer')}>
            {showFooter && (
              <ClassroomFrame>
                <ClassroomPaged
                  active={paged && currentKey === 'footer'}
                  page={currentKey === 'footer' ? page : 0}
                  onPages={(n) => onPages('footer', n)}
                >
                  {renderSlot(footer)}
                </ClassroomPaged>
              </ClassroomFrame>
            )}
          </div>
        </div>
      </ModuleLayout>
    </KitContext.Provider>
  );
}

/** Déclare au lecteur de mission la navigation par unités (rendu SOUS ModuleLayout, là où le lecteur fournit son contexte). */
function DeclareUnitNav({ nav }) {
  useDeclareUnitNav(nav);
  return null;
}
