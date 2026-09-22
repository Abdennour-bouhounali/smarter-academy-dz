import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KitContext, useKit } from './kitContext';

// Ré-export : les modules qui importaient useKit depuis ici continuent de marcher.
export { useKit };
import ModuleLayout from '../components/ModuleLayout';
import { useProgress } from '../hooks/useProgress';
import { useModuleEffects } from '../hooks/useModuleEffects';
import {
  MissionBrief, StepCard, StepProgressBar, StreakChip, EffectsToggle,
} from '../components/LessonUI';
import { isStepLocked } from '../utils/stepUnlock';
import { useClassroomMode, useClassroomStage, ClassroomFrame } from '../classroom';
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
  steps,          // [{ num, title, subtitle?, done, content }]
  footer,         // contenu de fin, rendu quand allDone
}) {
  const { xp, isModuleCompleted } = useProgress(ctx.lessonId);
  const alreadyCompleted = isModuleCompleted(String(moduleNumber));
  const { effectsEnabled, toggleEffects, streak, react } = useModuleEffects();

  const allDone = alreadyCompleted || steps.every((s) => s.done);
  const doneCount = steps.filter((s) => s.done).length;
  const incompleteSteps = steps.filter((s) => !s.done).map(({ num, title }) => ({ num, title }));

  const kit = { react, alreadyCompleted, effectsEnabled };
  const renderSlot = (slot) => (typeof slot === 'function' ? slot(kit) : slot);

  // ── Mode classe : les unités et leur navigation ──────────────────────────
  const classroom = useClassroomMode();
  const presenting = classroom.isClassroomMode;
  const stepKey = steps.map((s) => s.num).join('|');
  const hasFooter = allDone && Boolean(footer);
  const units = useMemo(
    () => moduleUnits({ brief: Boolean(brief), intro: Boolean(intro), steps, footer: hasFooter }),
    // `steps` est recréé à chaque rendu par le module : on suit ses numéros.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Boolean(brief), Boolean(intro), stepKey, hasFooter],
  );
  const [unitIndex, setUnitIndex] = useState(0);
  const current = clampUnit(unitIndex, units.length);
  const goTo = useCallback((i) => setUnitIndex(i), []);

  // Par quel bout entrer quand une session leçon arrive ici (« السابق »
  // depuis le module suivant → la dernière unité).
  useEffect(() => {
    if (!presenting) return;
    const arrival = classroom.takeArrival();
    if (arrival === 'last') setUnitIndex(units.length - 1);
    else if (arrival === 'first') setUnitIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting]);

  // Changer d'unité change la nature du contenu : le moteur d'ajustement
  // repart de l'échelle demandée.
  useEffect(() => {
    if (presenting) classroom.refit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, presenting]);

  const lessonNav = classroom.lessonNavigation;
  const nav = useMemo(() => resolveModuleNavigation({
    index: current, count: units.length, goTo, lessonPrevious: lessonNav?.previous, lessonNext: lessonNav?.next,
  }), [current, units.length, goTo, lessonNav]);
  const slot = useMemo(() => (
    <span className="sa-classroom-position" data-classroom-position data-classroom-unit-index={current} dir="ltr">
      {current + 1} / {units.length}
    </span>
  ), [current, units.length]);
  useClassroomStage({ title: moduleTitle, onPrevious: nav.onPrevious, onNext: nav.onNext, slot, priority: 2 }, presenting);

  // Une unité : toujours rendue, cachée quand elle n'est pas la courante.
  const unitProps = (key) => {
    const i = units.findIndex((u) => u.key === key);
    const hidden = presenting && i !== current;
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
        nextLink={allDone ? navLinks.nextLink : undefined}
        isCompleted={allDone}
        incompleteSteps={incompleteSteps}
        presentationFrame={false}
      >
        <div
          className={presenting ? 'sa-classroom-module' : 'sa-page py-8 flex-1 space-y-8'}
          data-classroom-units={presenting ? units.length : undefined}
          data-classroom-current={presenting ? current : undefined}
        >
          {!presenting && !allDone && <StepProgressBar doneCount={doneCount} total={steps.length} />}

          {!presenting && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <StreakChip count={streak} />
              <EffectsToggle enabled={effectsEnabled} onToggle={toggleEffects} />
            </div>
          )}

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
                  {brief.body}
                </MissionBrief>
              </ClassroomFrame>
            )}
          </div>

          {/* Le laboratoire (manipulation) n'est PAS cadré : il calcule sa
              propre mise en page de classe pour la zone offerte. */}
          <div {...unitProps('intro')}>
            {renderSlot(intro)}
          </div>

          {steps.map((s, i) => (
            <div key={s.num} {...unitProps(`step-${s.num}`)}>
              <ClassroomFrame>
                <StepCard
                  num={s.num}
                  title={s.title}
                  subtitle={s.subtitle}
                  done={s.done}
                  locked={isStepLocked(alreadyCompleted, i === 0 ? false : !steps[i - 1].done)}
                >
                  {renderSlot(s.content)}
                </StepCard>
              </ClassroomFrame>
            </div>
          ))}

          <div {...unitProps('footer')}>
            {allDone && <ClassroomFrame>{renderSlot(footer)}</ClassroomFrame>}
          </div>
        </div>
      </ModuleLayout>
    </KitContext.Provider>
  );
}
