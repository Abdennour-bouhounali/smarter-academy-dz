import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion } from '../kit';
import InfoSorter from '../components/InfoSorter';
import MathText from '../components/MathText';
import { SourceTag } from '../textbook';
import WrittenAnswer from './WrittenAnswer';
import ProblemSupport from './ProblemSupport';
import { problemTone } from './problemTone';
import { initialProgress, completeSubstep, isPartDone, substepRole } from './guidedProblem';

/**
 * GuidedProblem — un module « مسألة » : un exercice COMPLET de type امتحان,
 * résolu pas à pas (décision du propriétaire, 2026-10-05 : toujours guidé).
 *
 * La carte d'activité porte l'énoncé ENTIER et ses questions numérotées, comme
 * sur la feuille d'examen ; chaque question devient une étape du module, et
 * dans chaque étape les sous-étapes s'ouvrent l'une après l'autre :
 * أستخرج المعطيات → أترجم → أحسب → أستنتج / الجواب → الحلّ المحرّر.
 * Chaque demande de la question a sa propre réponse (guidedProblem.js › asks),
 * et la partie se clôt sur une RÉDACTION écrite par l'élève (WrittenAnswer).
 *
 * Le composant est piloté par la DONNÉE (`content/problems.js` de la leçon) :
 * une leçon n'écrit aucun JSX de مسألة. Contrat et validation :
 * ./guidedProblem.js ; docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
 *
 * Non bloquant : une sous-étape est faite dès qu'on y a répondu. Formatif :
 * aucune question n'est un `assessment` — la maîtrise des الكفاءات ne vient
 * que du إختبار أولي.
 */
export default function GuidedProblem({ ctx, navLinks, moduleNumber, problem, estimatedTime, footer }) {
  const { t } = useTranslation('lesson');
  const T = problemTone(problem.tone);
  const [progress, setProgress] = useState(() => initialProgress(problem));
  const done = (p, i) => setProgress((prev) => completeSubstep(prev, p, i));
  // Ce que l'élève a répondu à chaque sous-étape (affiché dans la liste des demandes).
  const [given, setGiven] = useState({});
  const answer = (p, i, value) => {
    setGiven((g) => ({ ...g, [`${p}:${i}`]: value }));
    done(p, i);
  };

  const renderSubstep = (part, p, step, i) => {
    const onDone = () => done(p, i);
    switch (step.kind) {
      case 'sort':
        return (
          <div className="space-y-2">
            <p className="text-sm text-slate-700">{step.lead ?? t('problem.sortLead')}</p>
            {/* Textes simples : InfoSorter les joint et s'en sert d'étiquette. */}
            <InfoSorter items={problem.data} formative onSolved={onDone} />
          </div>
        );
      case 'choice':
        return (
          <TapQuestion
            prompt={<MathText>{step.prompt}</MathText>}
            options={step.options.map((o) => <MathText key={o}>{o}</MathText>)}
            correct={step.correct} cols={step.cols ?? 1}
            explain={step.explain ? <MathText>{step.explain}</MathText> : undefined}
            requires={step.requires}
            onAnswered={(_, idx) => answer(p, i, step.options[idx])}
          />
        );
      case 'numeric':
        return (
          <NumericQuestion
            prompt={<MathText>{step.prompt}</MathText>}
            expected={step.expected} display={step.display ?? String(step.expected)}
            parse={parseDec}
            prefix={step.prefix} suffix={step.suffix}
            explain={step.explain ? <MathText>{step.explain}</MathText> : undefined}
            requires={step.requires}
            onAnswered={(_, n) => answer(p, i, `${n}${step.suffix ? ` ${step.suffix}` : ''}`)}
          />
        );
      case 'batch':
        return (
          <BatchChoiceQuestion
            intro={step.prompt ? <p className="text-sm font-semibold text-slate-700"><MathText>{step.prompt}</MathText></p> : undefined}
            rows={step.rows.map((r, k) => ({
              id: `r${k}`,
              label: <MathText>{r.label}</MathText>,
              options: r.options.map((o) => <MathText key={o}>{o}</MathText>),
              correct: r.correct,
              correction: r.correction ? <MathText>{r.correction}</MathText> : undefined,
            }))}
            requires={step.requires}
            onAnswered={onDone}
          />
        );
      case 'solution':
        // La rédaction : l'élève écrit, puis la rédaction modèle ligne à ligne.
        return <WrittenAnswer prompt={step.prompt} lines={step.lines} onDone={onDone} />;
      default:
        return null;
    }
  };

  const steps = problem.parts.map((part, p) => ({
    num: p + 1,
    title: `${part.label} ${part.title}`,
    done: isPartDone(progress, problem, p),
    content: (kit) => {
      // Revisite d'un module terminé : tout le chemin est ouvert.
      const open = kit.alreadyCompleted ? part.steps.length : progress[p] + 1;
      const asks = part.asks ?? [];
      // Une demande est satisfaite quand une de SES sous-étapes de réponse
      // (hors rédaction) est faite ; on montre ce que l'élève y a mis.
      const askState = asks.map((_, k) => {
        const i = part.steps.findIndex((st, j) => st.ask === k && st.kind !== 'solution' && progress[p] > j);
        return i < 0 ? null : (given[`${p}:${i}`] ?? '✓');
      });
      return (
        <div className="space-y-4" data-problem-part={p + 1}>
          <div className={`space-y-2 rounded-xl border-2 ${T.box} px-3 py-2`} data-problem-question>
            <p className={`text-sm font-semibold ${T.title}`}><MathText>{`${part.label} ${part.question}`}</MathText></p>
            {/* LES DEMANDES, visibles d'emblée : deux questions = deux réponses
                (règle du propriétaire, 2026-10-06). */}
            {asks.length > 0 && (
              <div className={`space-y-1 border-t ${T.rule} pt-2`} data-problem-asks={asks.length}>
                <p className={`text-xs font-bold ${T.asksTitle}`}>{t('problem.asksTitle')}</p>
                <ol className="space-y-1">
                  {asks.map((ask, k) => (
                    <li key={k} className={`flex flex-wrap items-center gap-2 text-sm ${T.title}`} data-problem-ask-item={k} data-answered={askState[k] != null ? 'true' : 'false'}>
                      <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${askState[k] != null ? 'bg-emerald-600 text-white' : `border-2 ${T.todo}`}`} dir="ltr">
                        {askState[k] != null ? '✓' : k + 1}
                      </span>
                      <MathText>{ask}</MathText>
                      {askState[k] != null && askState[k] !== '✓' && (
                        <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-emerald-800" data-ask-given>
                          <MathText>{String(askState[k])}</MathText>
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <ol className="space-y-4">
            {part.steps.map((step, i) => {
              const locked = i >= open;
              // La rédaction répond à TOUTE la question : pas d'étiquette d'une seule demande.
              const askChip = step.kind !== 'solution' && step.ask != null && asks[step.ask] && (
                <p className={`inline-block rounded-full ${T.chip} px-2.5 py-0.5 text-xs font-bold`} data-problem-ask={step.ask}>
                  <MathText>{t('problem.askChip', { ask: asks[step.ask] })}</MathText>
                </p>
              );
              return (
                <li key={i} className={`space-y-2 ${locked ? 'rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-3 py-2 opacity-70' : ''}`}
                  data-problem-substep={substepRole(step)} data-substep-done={progress[p] > i ? 'true' : 'false'} data-substep-locked={locked ? 'true' : 'false'}>
                  <p className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${locked ? 'bg-slate-400' : 'bg-slate-700'}`} dir="ltr">{i + 1}</span>
                    {t(`problem.role.${substepRole(step)}`)}
                    {locked && <span aria-hidden="true">🔒</span>}
                  </p>
                  {/* À quelle demande de la question cette étape répond. */}
                  {askChip}
                  {locked
                    // Fermée : on montre CE QUI viendra (sa consigne), jamais la réponse.
                    ? (step.prompt && <p className="text-sm text-slate-500"><MathText>{step.prompt}</MathText></p>)
                    : renderSubstep(part, p, step, i)}
                </li>
              );
            })}
          </ol>
        </div>
      );
    },
  }));

  return (
    <ContentModule
      ctx={ctx}
      navLinks={navLinks}
      moduleNumber={moduleNumber}
      moduleTitle={problem.title}
      moduleSubtitle={problem.context}
      estimatedTime={estimatedTime}
      brief={{
        tag: t('problem.tag'),
        headline: problem.headline,
        emoji: problem.emoji,
        title: problem.context,
        tone: problem.tone ?? 'amber',
        body: (
          <div className="space-y-2" data-problem-statement>
            <p className="leading-relaxed"><MathText>{problem.statement}</MathText></p>
            {/* Le support de l'énoncé (2026-10-06) : une مسألة qui dit « الشكل » / « الجدول » / « التمثيل البياني »
                le MONTRE — mêmes données déclaratives que la pratique (ExerciseStatement). */}
            <ProblemSupport figure={problem.figure} visual={problem.visual} table={problem.table} scene={problem.scene} illustration={problem.illustration} />
            <ol className="list-none space-y-0.5 font-semibold">
              {problem.parts.map((part) => <li key={part.label}><MathText>{`${part.label} ${part.question}`}</MathText></li>)}
            </ol>
            <p className="text-xs text-slate-600">{t('problem.briefLead')}</p>
          </div>
        ),
        footer: <SourceTag source={problem.source} />,
      }}
      steps={steps}
      footer={footer}
    />
  );
}
