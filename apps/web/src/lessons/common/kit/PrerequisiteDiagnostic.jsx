import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2, XCircle } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import { useProgress } from '../hooks/useProgress';
import { usePrerequisiteDiagnostic } from '../hooks/usePrerequisiteDiagnostic';
import { Feedback, ChoiceGrid, ValidateButton, MissionBrief } from '../components/LessonUI';
import TestPresentation, { useTestPresentation } from './TestPresentation';
import { revealAll, revealOne } from './testPresentation';
import { diagnosticAdviceLevel } from './diagnosticLevel';
import ReviewLinks from './ReviewLinks';

/**
 * Lesson kit — moteur du module 0 « Mission de départ » (diagnostic des
 * prérequis).
 *
 * Règles appliquées par construction (LESSON_INTEGRATION_GUIDE.md §8) :
 * jamais bloquant (nextLink inconditionnel), aucune evidence serveur
 * (questions sans `assessment`), silencieux jusqu'au submit unique, score
 * par paliers (<5 / 5-7 / >7 sur 10) avec conseil, persistance locale via
 * usePrerequisiteDiagnostic (réhydratation complète, y compris les
 * réponses).
 *
 * Types de question :
 *  - 'mcq' (défaut) : { id, skill, points, prompt, options, correct, cols?, explain }
 *  - 'custom'       : { id, skill, points, prompt, explainOk, explainKo,
 *                       render({ pick, onPick, revealed }), isCorrect(pick),
 *                       review({ pick }) }  — ex. clic sur un chiffre d'un tableau.
 *
 * MODE CLASSE (وضع القسم). Présenté, le diagnostic devient une QUESTION À LA
 * FOIS (TestPresentation) : السابق / التالي, « تحقّق من الإجابة » sur la
 * question courante, « كشف النتائج » à la fin, puis la revue une à une. Les
 * questions, les paliers, les conseils et le caractère non bloquant sont
 * inchangés ; « كشف النتائج » appelle le même handleSubmit() que la page.
 * Voir docs/architecture/CLASSROOM_MODE.md §5 « Test ».
 */

// Le REPLI, quand une leçon ne fournit pas ses propres `levels`. En clés de
// traduction : l'interface élève est arabe, et un repli français réintroduirait
// du français sur l'écran d'une leçon qui n'aurait rien fait de mal. Une leçon
// qui veut son propre ton passe `levels` (voir la leçon PGCD).
const DEFAULT_LEVELS = {
  fragile: {
    emoji: '🌱',
    titleKey: 'diagnostic.basesFragile',
    bodyKey: 'diagnostic.basesFragileAdvice',
    adviceKey: 'diagnostic.basesFragileAdvice',
    ctaKey: 'diagnostic.startAnyway',
    tone: 'from-emerald-500 to-teal-500',
  },
  progres: {
    emoji: '👍',
    titleKey: 'diagnostic.basesOnTrack',
    bodyKey: 'diagnostic.basesOnTrackAdvice',
    adviceKey: 'diagnostic.basesOnTrackAdvice',
    ctaKey: 'diagnostic.startModule1',
    tone: 'from-teal-500 to-cyan-500',
  },
  pret: {
    emoji: '⭐',
    titleKey: 'diagnostic.youAreReady',
    bodyKey: 'diagnostic.basesSolid',
    adviceKey: 'diagnostic.basesSolidAdvice',
    ctaKey: 'diagnostic.imReady',
    tone: 'from-cyan-500 to-blue-500',
  },
};

const isCorrectFor = (q, pick) =>
  pick == null ? false : q.type === 'custom' ? q.isCorrect(pick) : pick === q.correct;

/**
 * LE CORPS D'UNE QUESTION — écrit UNE fois, rendu par la page comme par la
 * présentation de classe. Les deux surfaces posent la même question : si
 * elles la dessinaient chacune de leur côté, elles divergeraient au premier
 * type de question ajouté.
 *
 * `revealed` n'est vrai qu'après une révélation (« تحقّق » sur cette
 * question, ou « كشف النتائج ») : une question répondue reste muette.
 */
function DiagnosticQuestionBody({ q, pick, onPick, revealed }) {
  if (q.type === 'custom') return q.render({ pick: pick ?? null, onPick, revealed });
  return (
    <ChoiceGrid
      options={q.options}
      selected={pick ?? null}
      onSelect={onPick}
      revealed={revealed}
      correctIndex={q.correct}
      cols={q.cols || 2}
    />
  );
}

/** La correction d'une question — elle aussi écrite une seule fois. */
function DiagnosticQuestionReview({ q, pick, ok }) {
  const { t } = useTranslation('lesson');
  return (
    <div className="space-y-3">
      {q.type === 'custom' ? (
        q.review({ pick })
      ) : (
        <div className="text-sm space-y-1">
          <div className={ok ? 'text-emerald-700' : 'text-rose-700'}>
            <strong>{t('question.yourAnswer')}</strong> {pick == null ? '—' : q.options[pick]}
          </div>
          {!ok && (
            <div className="text-emerald-700">
              <strong>{t('question.correctAnswer')}</strong> {q.options[q.correct]}
            </div>
          )}
        </div>
      )}
      <Feedback tone={ok ? 'ok' : 'ko'}>
        {q.type === 'custom' ? (ok ? q.explainOk : q.explainKo) : q.explain}
      </Feedback>
    </div>
  );
}

function DiagnosticResult({ lessonId, score, maxScore, skills, skillScores, levels, onContinue, onRedo }) {
  const { t } = useTranslation('lesson');
  // Un palier fournit SOIT un texte déjà écrit (une leçon qui passe ses
  // propres `levels`), SOIT une clé de traduction (le repli DEFAULT_LEVELS).
  // Les deux sont acceptés : c'est ce qui permet au repli d'être traduit sans
  // imposer i18n aux leçons qui écrivent leur ton elles-mêmes.
  const text = (meta, field) => meta[field] ?? (meta[`${field}Key`] ? t(meta[`${field}Key`]) : '');
  const level = diagnosticAdviceLevel(score, maxScore);
  const isPerfect = score === maxScore;
  const meta = levels[level];

  const skillEntries = Object.entries(skillScores);
  const ratios = skillEntries.map(([key, s]) => [key, s.score / s.max]);
  const [weakestKey, weakestRatio] = ratios.reduce((min, cur) => (cur[1] < min[1] ? cur : min));
  const isTied = ratios.every(([, r]) => r === weakestRatio);
  const weakestIsMeaningful = !isTied && weakestRatio < 1 && level !== 'pret';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br ${meta.tone} text-white rounded-3xl p-8 text-center space-y-3 relative overflow-hidden`}
      >
        <div className="text-5xl" aria-hidden="true">{meta.emoji}</div>
        <div dir="ltr" className="text-3xl font-space font-extrabold">{score} / {maxScore}</div>
        <div className="text-lg font-space font-bold">{text(meta, 'title')}</div>
        {isPerfect && (
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 font-bold text-sm px-4 py-2 rounded-full mt-1">
            {t('diagnostic.prerequisitesMastered')}
          </div>
        )}
      </motion.div>

      {skillEntries.length > 1 && (
        <div className="grid gap-3 grid-cols-2">
          {skillEntries.map(([key, s]) => {
            const skillPct = Math.round((s.score / s.max) * 100);
            const good = s.score === s.max;
            return (
              <div key={key} className="rounded-2xl border-2 border-slate-200 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-space font-bold text-slate-800 text-sm">
                    {skills[key].emoji} {skills[key].label}
                  </span>
                  <span dir="ltr" className="font-mono text-xs font-bold text-slate-500">{s.score} / {s.max}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${good ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    style={{ width: `${skillPct}%` }}
                  />
                </div>
                <div className={`text-xs font-medium ${good ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {good ? t('diagnostic.skillGood') : t('diagnostic.skillToReinforce')}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Feedback tone="info">
        <strong>{t('diagnostic.yourAdvice')}</strong>
        <p className="mt-1">
          {text(meta, 'body')}{' '}
          {weakestIsMeaningful && (
            <>{t('diagnostic.payAttentionTo')} <strong>{skills[weakestKey].label}</strong>.</>
          )}
        </p>
        <p className="mt-2">💡 {text(meta, 'advice')}</p>
      </Feedback>

      {/* Les الكفاءات des leçons antérieures sur lesquelles celle-ci s'appuie
          (réseau des الكفاءات, LEARNING_NET.md) — des liens, jamais un verrou. */}
      <ReviewLinks lessonId={lessonId} />

      <div className="flex gap-3 flex-row">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl min-h-[48px] text-base"
        >
          🚀 {text(meta, 'cta')}
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="py-3 px-5 bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-500 font-bold rounded-xl min-h-[48px]"
        >
          {t('diagnostic.redoDiagnostic')}
        </button>
      </div>
    </div>
  );
}

export default function PrerequisiteDiagnostic({
  ctx,
  navLinks,
  moduleTitle,
  moduleSubtitle,
  estimatedTime,
  brief,         // { tag?, title?, tone?, body }
  skills,        // { key: { label, emoji } }
  questions,     // voir doc du fichier
  levels = DEFAULT_LEVELS,
  xpAmount = 20,
}) {
  const { t } = useTranslation('lesson');
  const navigate = useNavigate();
  const { xp, awardXP } = useProgress(ctx.lessonId);
  const { result: savedResult, save: saveResult, redo: redoResult } = usePrerequisiteDiagnostic(ctx.lessonId);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  // CE QUI EST RÉVÉLÉ, question par question. Uniquement en présentation :
  // sur la page, le diagnostic garde son unique « عرض نتيجتي », et `submitted`
  // vaut alors révélation de tout.
  const [revealed, setRevealed] = useState({});
  const { presenting } = useTestPresentation();

  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  const hydratedFromSaved = useRef(false);
  useEffect(() => {
    if (hydratedFromSaved.current || !savedResult || submitted) return;
    hydratedFromSaved.current = true;
    setAnswers(savedResult.answers || {});
    setSubmitted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedResult]);

  const allAnswered = questions.every((q) => answers[q.id] != null);
  const score = questions.reduce((sum, q) => sum + (isCorrectFor(q, answers[q.id]) ? q.points : 0), 0);
  const skillScores = Object.keys(skills).reduce((acc, key) => {
    const qs = questions.filter((q) => q.skill === key);
    acc[key] = {
      score: qs.reduce((s, q) => s + (isCorrectFor(q, answers[q.id]) ? q.points : 0), 0),
      max: qs.reduce((s, q) => s + q.points, 0),
    };
    return acc;
  }, {});

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    const adviceLevel = diagnosticAdviceLevel(score, maxScore);
    saveResult({ score, maxScore, skills: skillScores, adviceLevel, answers });
    awardXP({ moduleId: 'L00', exerciseId: 'diagnostic', amount: xpAmount });
  }

  function handleRedo() {
    redoResult();
    hydratedFromSaved.current = true;
    setAnswers({});
    setSubmitted(false);
    setRevealed({});
  }

  const pickAnswer = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

  return (
    <ModuleLayout
      {...ctx}
      moduleTitle={moduleTitle}
      moduleSubtitle={moduleSubtitle}
      moduleNumber={0}
      estimatedTime={estimatedTime}
      xp={xp}
      prevLink={navLinks.prevLink}
      nextLink={navLinks.nextLink}
      isCompleted={submitted}
      stage="prerequisite_check"
      // La présentation cadre CHAQUE question elle-même ; le layout ne pose
      // pas un second cadre par-dessus (même contrat que ContentModule).
      presentationFrame={!presenting}
    >
      {presenting ? (
        <TestPresentation
          title={moduleTitle}
          overview={{
            number: 0,
            title: moduleTitle,
            subtitle: moduleSubtitle,
            points: [...Object.values(skills).map((sk) => `${sk.emoji ? `${sk.emoji} ` : ''}${sk.label}`), t('classroom.overview.questions', { count: questions.length })],
          }}
          questions={questions}
          answers={answers}
          // Une fois le diagnostic soumis, TOUT est révélé : la correction
          // rechargée d'un appareil à l'autre s'affiche comme la nôtre.
          revealed={submitted ? true : revealed}
          isCorrect={isCorrectFor}
          onRevealOne={(id) => setRevealed((r) => revealOne(r, id))}
          onRevealAll={() => { setRevealed(revealAll(questions)); handleSubmit(); }}
          renderQuestion={({ question, revealed: isRevealed }) => (
            <div className="space-y-4">
              {/* L'ÉNONCÉ d'abord — c'est la question qu'on projette. */}
              <div className="text-base leading-relaxed text-slate-700">{question.prompt}</div>
              <DiagnosticQuestionBody
                q={question}
                pick={answers[question.id]}
                onPick={(v) => pickAnswer(question.id, v)}
                revealed={isRevealed}
              />
            </div>
          )}
          renderReview={({ question, correct }) => (
            <DiagnosticQuestionReview q={question} pick={answers[question.id]} ok={correct} />
          )}
          summary={(
            <DiagnosticResult
              lessonId={ctx.lessonId}
              score={score}
              maxScore={maxScore}
              skills={skills}
              skillScores={skillScores}
              levels={levels}
              onContinue={() => navigate(navLinks.nextLink)}
              onRedo={handleRedo}
            />
          )}
        />
      ) : (
      <div className="sa-page py-8 flex-1 space-y-8">
        <AnimatePresence mode="wait">
      {!submitted && (
        <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
          <MissionBrief
            tag={brief?.tag ?? t('diagnostic.defaultBriefTag')}
            title={brief?.title ?? t('diagnostic.defaultBriefTitle')}
            tone={brief?.tone ?? 'indigo'}
          >
            {brief?.body}
          </MissionBrief>

          {Object.keys(skills).length > 1 && (
            <div className="grid gap-3 grid-cols-2">
              {Object.entries(skills).map(([key, skill]) => {
                const doneCount = questions.filter((q) => q.skill === key && answers[q.id] != null).length;
                const totalCount = questions.filter((q) => q.skill === key).length;
                return (
                  <div key={key} className="rounded-2xl border-2 border-slate-200 bg-white p-4">
                    <div className="font-space font-bold text-slate-800 text-sm">
                      {skill.emoji} {skill.label}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: totalCount }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${i < doneCount ? 'bg-teal-500' : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              {t('question.label')}{' '}
              <span dir="ltr">
                {Object.keys(answers).length < questions.length ? Object.keys(answers).length + 1 : questions.length}
                {' / '}
                {questions.length}
              </span>
            </span>
            <span>
              <span dir="ltr">{score} / {maxScore}</span> {t('diagnostic.inProgress')}
            </span>
          </div>

          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-2 border-slate-200 bg-white rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-teal-600 text-white">
                  {skills[q.skill].emoji}{' '}
                  <span dir="ltr">{i + 1} / {questions.length}</span>
                </span>
                {answers[q.id] != null && <CheckCircle2 className="w-4 h-4 text-teal-600" aria-hidden="true" />}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{q.prompt}</p>
              {q.type === 'custom' ? (
                q.render({
                  pick: answers[q.id] ?? null,
                  onPick: (v) => setAnswers((a) => ({ ...a, [q.id]: v })),
                  revealed: false,
                })
              ) : (
                <ChoiceGrid
                  options={q.options}
                  selected={answers[q.id] ?? null}
                  onSelect={(idx) => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                  cols={q.cols || 2}
                />
              )}
            </motion.div>
          ))}

          <ValidateButton onClick={handleSubmit} disabled={!allAnswered} tone="teal">
            {t('diagnostic.seeMyResult')}
          </ValidateButton>
        </motion.div>
      )}

      {submitted && (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-space font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4" aria-hidden="true" /> {t('diagnostic.yourCorrection')}
            </h2>
            {questions.map((q, i) => {
              const ok = isCorrectFor(q, answers[q.id]);
              return (
                <div
                  key={q.id}
                  className={`border-2 rounded-2xl p-5 space-y-3 ${ok ? 'border-emerald-300 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30'}`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-space font-bold text-slate-800 flex items-center gap-2 text-sm">
                      {ok ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                      )}
                      {skills[q.skill].emoji} {t('question.label')}{' '}
                      <span dir="ltr">{i + 1}</span>
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{q.prompt}</p>
                  {q.type === 'custom' ? (
                    q.review({ pick: answers[q.id] })
                  ) : (
                    <div className="text-sm space-y-1">
                      <div className={ok ? 'text-emerald-700' : 'text-rose-700'}>
                        <strong>{t('question.yourAnswer')}</strong> {q.options[answers[q.id]]}
                      </div>
                      {!ok && (
                        <div className="text-emerald-700">
                          <strong>{t('question.correctAnswer')}</strong> {q.options[q.correct]}
                        </div>
                      )}
                    </div>
                  )}
                  <Feedback tone={ok ? 'ok' : 'ko'}>
                    {q.type === 'custom' ? (ok ? q.explainOk : q.explainKo) : q.explain}
                  </Feedback>
                </div>
              );
            })}
          </div>

          <DiagnosticResult
            lessonId={ctx.lessonId}
            score={score}
            maxScore={maxScore}
            skills={skills}
            skillScores={skillScores}
            levels={levels}
            onContinue={() => navigate(navLinks.nextLink)}
            onRedo={handleRedo}
          />
        </motion.div>
      )}
    </AnimatePresence>
      </div >
      )}
    </ModuleLayout >
  );
}
