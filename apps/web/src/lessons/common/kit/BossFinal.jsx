import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Target, BookMarked, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import { useProgress } from '../hooks/useProgress';
import { useEvidenceSubmission } from '../hooks/useEvidenceSubmission';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { useFinalTestAttempt } from '../hooks/useFinalTestAttempt';
import { useLearningViewer } from '../../../features/learning/learningViewer';
import {
  Feedback, ChoiceGrid, ValidateButton, MissionBrief, TimerToggle, TimerDisplay,
} from '../components/LessonUI';
import TestPresentation, { useTestPresentation } from './TestPresentation';
import { revealAll, revealOne } from './testPresentation';

/**
 * Lesson kit — moteur du module final « Boss Final » (évaluatif).
 *
 * La forme obligatoire du test final (LESSON_INTEGRATION_GUIDE.md §7),
 * appliquée par construction : QCM uniquement, silencieux jusqu'au submit
 * global unique, puis Boss (correction) → Mon profil → Synthèse ; chaque
 * épreuve rattachée à ses learning points (evidence) ; persistance de la
 * tentative via useFinalTestAttempt ; timer facultatif ; badges par
 * compétence.
 *
 * Un module final devient un fichier de DONNÉES : épreuves, compétences,
 * badges, synthèse — zéro logique recopiée.
 *
 * MODE CLASSE (وضع القسم). Présenté, le test final devient une ÉPREUVE À LA
 * FOIS (TestPresentation) : السابق / التالي, « تحقّق من الإجابة » sur l'épreuve
 * courante, « كشف النتائج » à la fin, puis la revue une à une. Le barème,
 * l'evidence et la tentative ne changent pas d'un iota : « كشف النتائج »
 * appelle submitBoss(), le même envoi unique que le bouton de la page. Sur la
 * page de l'élève, rien ne change — le test reste silencieux jusqu'à son
 * envoi. Voir docs/architecture/CLASSROOM_MODE.md §5 « Test ».
 */

function Epreuve({ epreuve, index, total, pick, onPick }) {
  const { t } = useTranslation('lesson');
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-slate-200 bg-white rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-space font-bold text-slate-800">
          {epreuve.title ?? `${t('boss.trial')} ${index + 1}`}
        </h3>
        <span dir="ltr" className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-white">
          {index + 1} / {total}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">{epreuve.prompt}</p>

      {epreuve.extra && <div className="bg-white border border-slate-200 rounded-xl p-2">{epreuve.extra}</div>}

      <ChoiceGrid
        options={epreuve.options}
        selected={pick}
        onSelect={onPick}
        cols={epreuve.cols || 2}
        renderOption={epreuve.renderOption}
      />
    </motion.div>
  );
}

/**
 * Indice de la bonne réponse d'une épreuve.
 *
 * Convention du projet : la bonne réponse est déclarée par `correct`. Seize
 * leçons construites avant le 2026-09-06 l'ont OMISE en plaçant
 * systématiquement la bonne réponse en première position ; `ep.correct` y
 * valait `undefined`, qu'aucun choix ne peut égaler — leur test final
 * affichait donc 0/N même pour un élève ayant tout juste (constaté au
 * navigateur sur fonction-affine-2nde). La valeur par défaut 0 répare ces
 * leçons sans toucher à leurs fichiers, et ne change rien à celles qui
 * déclarent `correct` explicitement.
 */
const correctIndexOf = (ep) => (typeof ep.correct === 'number' ? ep.correct : 0);

/** Le libellé d'une option, `optionLabel` quand l'épreuve en fournit un. */
const optionLabelOf = (ep, i) => (ep.optionLabel ? ep.optionLabel(i) : ep.options[i]);

/**
 * LA CORRECTION D'UNE ÉPREUVE — le même bloc pour la page et pour la
 * présentation de classe : « إجابتك », la bonne réponse quand elle diffère,
 * puis la règle. BossReview (la page) et TestPresentation (le tableau) en
 * sont tous deux les clients : la correction du test final s'écrit ici, et
 * nulle part ailleurs.
 */
function EpreuveReview({ ep, pick, isCorrect }) {
  const { t } = useTranslation('lesson');
  return (
    <>
      <div className="text-sm space-y-1">
        <div className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
          <strong>{t('question.yourAnswer')}</strong>{' '}
          {pick == null ? t('boss.noAnswer') : optionLabelOf(ep, pick)}
        </div>
        {!isCorrect && (
          <div className="text-emerald-700">
            <strong>{t('question.correctAnswer')}</strong> {optionLabelOf(ep, correctIndexOf(ep))}
          </div>
        )}
      </div>
      <Feedback tone={isCorrect ? 'ok' : 'ko'}>{ep.explain}</Feedback>
    </>
  );
}

function BossReview({ epreuves, answers, onContinue, onRedo }) {
  const { t } = useTranslation('lesson');
  const correctCount = epreuves.filter((ep) => answers[ep.id] === correctIndexOf(ep)).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 text-center space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{t('boss.challengeResult')}</div>
        {/* `dir="ltr"` : un score est une écriture NUMÉRIQUE. Sans lui, le
            bidi arabe inverse les deux nombres et « 10 / 11 » se lit
            « 11 / 10 » — le score et son maximum échangés. */}
        <div dir="ltr" className="text-3xl font-space font-extrabold">
          {correctCount} / {epreuves.length}
        </div>
      </div>

      <div className="space-y-4">
        {epreuves.map((ep, i) => {
          const pick = answers[ep.id];
          const isCorrect = pick === correctIndexOf(ep);
          return (
            <div
              key={ep.id}
              className={`border-2 rounded-2xl p-5 space-y-3 ${isCorrect ? 'border-emerald-300 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30'
                }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-space font-bold text-slate-800 flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                  )}
                  {ep.title ?? `${t('boss.trial')} ${i + 1}`}
                </h3>
                <span dir="ltr" className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-white">
                  {i + 1} / {epreuves.length}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{ep.prompt}</p>

              <EpreuveReview ep={ep} pick={pick} isCorrect={isCorrect} />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl min-h-[48px]"
        >
          {t('boss.seeMasteryProfile')} <ArrowRight className="inline w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="py-3 px-5 bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-500 font-bold rounded-xl min-h-[48px]"
        >
          {t('boss.retakeTest')}
        </button>
      </div>
    </div>
  );
}

function ProfilMaitrise({ skills, scores, lessonConfig }) {
  const { t } = useTranslation('lesson');
  const levelOf = (misses) => (misses === 0 ? 'ok' : misses === 1 ? 'mid' : 'low');

  const META = {
    ok: { dot: '🟢', label: t('boss.masteredWell'), tone: 'border-emerald-200 bg-emerald-50' },
    mid: { dot: '🟡', label: t('boss.someErrors'), tone: 'border-amber-200 bg-amber-50' },
    low: { dot: '🔴', label: t('boss.needsWork'), tone: 'border-rose-200 bg-rose-50' },
  };

  return (
    <div className="space-y-3">
      {Object.entries(skills).map(([key, skill]) => {
        const misses = scores[key] ?? 0;
        const lvl = levelOf(misses);
        const meta = META[lvl];
        const target = lessonConfig.modules.find((m) => m.number === skill.module);

        return (
          <div key={key} className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 flex-wrap ${meta.tone}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">{meta.dot}</span>
              <div>
                <div className="font-space font-bold text-slate-800 text-sm">{skill.label}</div>
                <div className="text-xs text-slate-600">{meta.label}</div>
              </div>
            </div>
            {lvl !== 'ok' && target && (
              <Link
                to={target.path}
                className="text-xs font-mono font-bold px-3 py-2 rounded-lg bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-500 transition-colors"
              >
                {t('boss.reviewModule', { number: skill.module })} <ArrowRight className="inline w-3 h-3" aria-hidden="true" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

const PHASES = [
  { key: 'boss', labelKey: 'boss.phaseBoss', Icon: Trophy },
  { key: 'profil', labelKey: 'boss.phaseProfile', Icon: Target },
  { key: 'synthese', labelKey: 'boss.phaseSynthesis', Icon: BookMarked },
];

export default function BossFinal({
  ctx,
  navLinks,
  moduleNumber,
  moduleTitle,
  moduleSubtitle,
  estimatedTime = '15 min',
  lessonConfig,
  timerSeconds = 10 * 60,
  timerLabel = '10 min',
  brief,          // { tag, title, tone?, body }
  registre,       // [{ id, emoji, label, value: ReactNode }] — cartes de contexte (optionnel)
  skills,         // { key: { label, module } }
  epreuves,       // [{ id, skill, title?, prompt, extra?, options, correct, cols?, renderOption?, optionLabel?, explain, assessment }]
  badges,         // [{ id, emoji, label, test: (misses) => bool }]
  synthese,       // ReactNode — synthèse visuelle propre à la leçon
  completion,     // { masterTitle, title, message, verbs: [..4], masterBadgeLabel }
  xpPerCorrect = 20,
}) {
  const { t } = useTranslation('lesson');
  const { xp, awardXP } = useProgress(ctx.lessonId);
  // QUI lit ce test : l'enseignant le PRÉPARE (toutes les phases ouvertes).
  const viewer = useLearningViewer();
  const { submitEvidence } = useEvidenceSubmission(ctx.lessonId);
  const { attempt: savedAttempt, save: saveAttempt, redo: redoAttempt } = useFinalTestAttempt(ctx.lessonId);
  const timer = useCountdownTimer(timerSeconds, {
    onExpire: () => submitBoss(),
  });

  const [phase, setPhase] = useState('boss');
  const [bossAnswers, setBossAnswers] = useState({});
  const [bossSubmitted, setBossSubmitted] = useState(false);
  const [misses, setMisses] = useState({});
  // CE QUI EST RÉVÉLÉ, épreuve par épreuve — UNIQUEMENT en « وضع القسم ».
  //
  // Sur la page de l'élève, le test final reste ce qu'il est : silencieux
  // jusqu'à l'envoi unique. Révéler une épreuve à la fois est un geste
  // d'ENSEIGNANT au tableau, et l'entrée en présentation est déjà réservée
  // aux présentateurs. C'est aussi une garantie de barème : un élève ne peut
  // pas se faire corriger une épreuve notée avant de répondre aux suivantes.
  //
  // Une révélation N'ÉCRIT RIEN : ni evidence, ni XP, ni tentative. Le test
  // n'est noté, soumis et persisté qu'une seule fois, par submitBoss() — le
  // même chemin qu'avant, appelé par « كشف النتائج ». Sans cela, chaque
  // `submitEvidence` tirant un nouvel `attemptId`, valider une épreuve deux
  // fois en dupliquerait l'evidence de maîtrise.
  const [revealed, setRevealed] = useState({});
  const { presenting } = useTestPresentation();

  // Une tentative sauvegardée (cet appareil, ou un autre une fois synchro)
  // gagne dès son chargement : correction affichée, jamais un quiz vierge.
  // Le ref évite de re-déclencher après un « Refaire » volontaire.
  const hydratedFromSaved = useRef(false);

  // Garde anti double-soumission (clic + expiration du timer). Un ref, pas
  // un updater setState : un updater doit rester pur, et StrictMode
  // l'exécute deux fois en dev — les effets (evidence, XP, sauvegarde)
  // partiraient en double.
  const submittedRef = useRef(false);

  useEffect(() => {
    if (hydratedFromSaved.current || !savedAttempt || bossSubmitted) return;
    hydratedFromSaved.current = true;
    submittedRef.current = true;

    const restoredAnswers = {};
    const restoredMisses = {};
    savedAttempt.answers.forEach((a) => {
      restoredAnswers[a.questionCode] = a.picked;
      if (!a.isCorrect) {
        const ep = epreuves.find((e) => e.id === a.questionCode);
        if (ep) restoredMisses[ep.skill] = (restoredMisses[ep.skill] || 0) + 1;
      }
    });
    setBossAnswers(restoredAnswers);
    setMisses(restoredMisses);
    setBossSubmitted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAttempt]);

  const bossDone = bossSubmitted;
  const allAnswered = epreuves.every((ep) => bossAnswers[ep.id] != null);

  function submitBoss() {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const nextMisses = {};
    const attemptAnswers = [];
    epreuves.forEach((ep) => {
      const isCorrect = bossAnswers[ep.id] === correctIndexOf(ep);
      submitEvidence(ep, isCorrect, { picked: bossAnswers[ep.id] ?? null });
      attemptAnswers.push({
        questionCode: ep.id,
        picked: bossAnswers[ep.id] ?? null,
        isCorrect,
        correctAnswer: correctIndexOf(ep),
      });
      if (isCorrect) {
        awardXP({ moduleId: String(moduleNumber), exerciseId: ep.id, amount: xpPerCorrect });
      } else {
        nextMisses[ep.skill] = (nextMisses[ep.skill] || 0) + 1;
      }
    });
    setMisses(nextMisses);
    timer.stop();

    const score = attemptAnswers.filter((a) => a.isCorrect).length;
    saveAttempt({ score, totalQuestions: epreuves.length, answers: attemptAnswers });

    setBossSubmitted(true);
  }

  function redoBoss() {
    redoAttempt();
    hydratedFromSaved.current = true;
    submittedRef.current = false;
    setPhase('boss');
    setBossAnswers({});
    setBossSubmitted(false);
    setMisses({});
    setRevealed({});
    timer.setEnabled(false);
  }

  const isEpreuveCorrect = useCallback((ep, pick) => pick === correctIndexOf(ep), []);

  const badgesGagnes = badges.filter((b) => b.test(misses));
  const masterBadge = bossDone && badgesGagnes.length === badges.length;

  // Les phases مراجعة / النتائج s'ouvrent à l'élève une fois le test soumis :
  // on ne lit pas la correction avant d'avoir répondu. En NAVIGATION LIBRE
  // (enseignant, administration — learningViewer) elles sont ouvertes dès
  // l'arrivée : préparer un test, c'est en lire la correction sans le passer.
  const phaseUnlocked = (key) => key === 'boss' || bossDone || viewer.freeNavigation;

  return (
    <ModuleLayout
      {...ctx}
      moduleTitle={moduleTitle}
      moduleSubtitle={moduleSubtitle}
      moduleNumber={moduleNumber}
      stage="evaluation"
      estimatedTime={estimatedTime}
      xp={xp}
      prevLink={navLinks.prevLink}
      nextLink={navLinks.nextLink}
      isCompleted={bossDone}
      // La présentation cadre CHAQUE épreuve elle-même.
      presentationFrame={!presenting}
    >
      {presenting ? (
        <TestPresentation
          title={moduleTitle}
          questions={epreuves}
          answers={bossAnswers}
          // Le test soumis (ici ou sur un autre appareil) est entièrement
          // révélé : on projette la correction, pas un questionnaire vierge.
          revealed={bossSubmitted ? true : revealed}
          isCorrect={isEpreuveCorrect}
          onRevealOne={(id) => setRevealed((r) => revealOne(r, id))}
          // « كشف النتائج » EST le submit du moteur : mêmes notes, même
          // evidence, même tentative persistée, une seule fois.
          onRevealAll={() => { setRevealed(revealAll(epreuves)); submitBoss(); }}
          renderQuestion={({ question: ep, index: i, revealed: isRevealed }) => (
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-slate-700">{ep.prompt}</p>
              {ep.extra && <div className="rounded-xl border border-slate-200 bg-white p-3">{ep.extra}</div>}
              <ChoiceGrid
                options={ep.options}
                selected={bossAnswers[ep.id] ?? null}
                onSelect={(idx) => setBossAnswers((a) => ({ ...a, [ep.id]: idx }))}
                revealed={isRevealed}
                correctIndex={correctIndexOf(ep)}
                cols={ep.cols || 2}
                renderOption={ep.renderOption}
              />
            </div>
          )}
          renderReview={({ question: ep, correct }) => (
            <EpreuveReview ep={ep} pick={bossAnswers[ep.id]} isCorrect={correct} />
          )}
          // Après la révélation : le profil de maîtrise, la synthèse du
          // moteur — sans remplacer la revue épreuve par épreuve.
          summary={(
            <div className="space-y-5">
              <ProfilMaitrise skills={skills} scores={misses} lessonConfig={lessonConfig} />
              {synthese}
            </div>
          )}
        />
      ) : (
      <div className="sa-page py-8 flex-1 space-y-8">
        <div className="grid grid-cols-3 gap-2">
          {PHASES.map(({ key, labelKey, Icon }) => {
            const unlocked = phaseUnlocked(key);
            return (
              <button
                key={key}
                type="button"
                disabled={!unlocked}
                onClick={() => setPhase(key)}
                className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all min-h-[48px] flex items-center justify-center gap-1.5 ${
                  phase === key
                    ? 'bg-slate-900 text-white'
                    : unlocked
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {phase === 'boss' && !bossSubmitted && (
            <motion.div key="boss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {brief && (
                <MissionBrief tag={brief.tag} title={brief.title} tone={brief.tone ?? 'amber'}>
                  {brief.body}
                </MissionBrief>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <TimerToggle
                  enabled={timer.enabled}
                  onChange={(next) => {
                    timer.setEnabled(next);
                    if (next) timer.start();
                  }}
                  durationLabel={timerLabel}
                  disabled={Object.keys(bossAnswers).length > 0}
                />
                {timer.enabled && <TimerDisplay label={timer.label} urgent={timer.remaining <= 60} />}
              </div>

              {registre && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {registre.map((r) => (
                    <div key={r.id} className="rounded-xl border-2 border-slate-200 bg-white p-2.5 text-center">
                      <div className="text-lg" aria-hidden="true">{r.emoji}</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase leading-tight">{r.label}</div>
                      <div className="font-mono font-extrabold text-sm text-slate-800 tabular-nums">{r.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {epreuves.map((e, i) => (
                  <span
                    key={e.id}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                      bossAnswers[e.id] != null ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {bossAnswers[e.id] != null ? '✓' : i + 1}
                  </span>
                ))}
              </div>

              {epreuves.map((ep, i) => (
                <Epreuve
                  key={ep.id}
                  epreuve={ep}
                  index={i}
                  total={epreuves.length}
                  pick={bossAnswers[ep.id] ?? null}
                  onPick={(idx) => setBossAnswers((a) => ({ ...a, [ep.id]: idx }))}
                />
              ))}

              <ValidateButton onClick={submitBoss} disabled={!allAnswered} tone="amber">
                {t('boss.submitAnswers', { count: epreuves.length })}
              </ValidateButton>
            </motion.div>
          )}

          {phase === 'boss' && bossSubmitted && (
            <motion.div key="boss-review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BossReview epreuves={epreuves} answers={bossAnswers} onContinue={() => setPhase('profil')} onRedo={redoBoss} />
            </motion.div>
          )}

          {phase === 'profil' && (
            <motion.div key="profil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-space font-extrabold text-slate-900">{t('boss.yourMasteryProfile')}</h2>
                <p className="text-sm text-slate-500">
                  {t('boss.profileSubtitle')}
                </p>
              </div>

              <ProfilMaitrise skills={skills} scores={misses} lessonConfig={lessonConfig} />

              {badgesGagnes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-space font-bold text-slate-800 text-sm">{t('boss.badgesUnlocked')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {badgesGagnes.map((b) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3"
                      >
                        <span className="text-xl" aria-hidden="true">{b.emoji}</span>
                        <span className="text-sm font-bold text-amber-900">{b.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Les badges récompensent la compréhension et la justesse du raisonnement — jamais la vitesse.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPhase('synthese')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl min-h-[48px]"
              >
                {t('boss.goToSynthesis')}
              </button>
            </motion.div>
          )}

          {phase === 'synthese' && (
            <motion.div key="synthese" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {synthese}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl p-8 text-center space-y-3"
              >
                <div className="text-5xl" aria-hidden="true">{masterBadge ? '🏆' : '🎓'}</div>
                <div className="text-2xl font-space font-extrabold">
                  {masterBadge ? completion.masterTitle : completion.title}
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed max-w-lg mx-auto">{completion.message}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {completion.verbs.map((v) => (
                    <div key={v} className="bg-white/15 rounded-xl py-2 text-sm font-bold">
                      ✓ {v}
                    </div>
                  ))}
                </div>
                {masterBadge && (
                  <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 font-bold text-sm px-4 py-2 rounded-full mt-2">
                    🏆 {completion.masterBadgeLabel}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div >
      )}
    </ModuleLayout >
  );
}
