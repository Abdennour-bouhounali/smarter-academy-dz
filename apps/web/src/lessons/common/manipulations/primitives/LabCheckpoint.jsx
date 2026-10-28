import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircleQuestion, Lightbulb, CheckCircle2, Eye, RotateCcw, ChevronLeft, Send } from 'lucide-react';
import * as C from './labCheckpoint';
import { playSfx } from '../../utils/playEffect';

/**
 * LabCheckpoint — les QUESTIONS PENDANT LE LABO (2026-10-28, PROTOTYPE sur `gear-crank` ; à étendre à tous les labos, propriétaire).
 *
 * Quand l'élève termine une étape du labo (une tâche), une carte de questions se pose PAR-DESSUS le labo (et non sous lui, où
 * il ne la voyait pas) : une suite de questions sur CE qu'il vient de faire, qui mène à l'idée de l'étape, puis à la règle.
 *  - BLOQUANTE : `blocking` vaut true tant que la suite n'est pas finie ; le labo cache son « التالي » tant qu'elle bloque.
 *  - REFAIRE : « انظر إلى المختبر » plie la carte (le labo reste figé, on lit les compteurs) ; « أعِد التجربة » plie la carte ET
 *    appelle `onRetry` (le labo remet la même tâche au départ). La carte revient seule quand l'étape est de nouveau atteinte, ou
 *    par « عُد إلى السؤال » sur la bande qui la remplace.
 *  - GUIDÉE : jamais la réponse au premier essai — indice 1 (ou le `why` de l'option), puis indice 2, puis la réponse et son
 *    explication au 3e essai (`labCheckpoint.js › MAX_TRIES`). Une option fausse déjà choisie reste barrée.
 *
 * Usage (dans le labo) :
 *   const cp = useLabCheckpoint({ id: task.id, questions, reached: taskDone, resetKey, onRetry, onEvent, onDone });
 *   … `canNext && !cp.blocking` … et `{cp.node}` en tête du conteneur `relative` qui enveloppe la consigne, la scène et les commandes.
 * Une question : `{ id, prompt, kind: 'choice' | 'number', options?: [{ text, correct?, why? }], cols?, expected?, answer?, hints: [h1, h2],
 * explain }` (nœuds React ; `answer` : la réponse montrée au 3e essai d'une question `number`).
 * `onEvent` reçoit `{ tk: 'checkpoint', id, q, ok, tries, revealed }` à chaque réponse, puis `{ tk: 'checkpoint-done', id, log }`.
 *
 * Contrat DOM : [data-lab-checkpoint][data-checkpoint=<id>][data-q=<qid>][data-status], [data-lab-checkpoint-option=<i>][data-state],
 * [data-lab-checkpoint-input], [data-lab-checkpoint-check], [data-lab-checkpoint-feedback=hint|reveal|right], [data-lab-checkpoint-next],
 * [data-lab-checkpoint-look], [data-lab-checkpoint-retry], [data-lab-checkpoint-pill], [data-lab-checkpoint-back].
 */
export function useLabCheckpoint({ id, questions, reached, resetKey, onRetry, onEvent, onDone }) {
  const [book, setBook] = useState({});
  const [folded, setFolded] = useState({});
  const [key, setKey] = useState(resetKey);
  if (key !== resetKey) { setKey(resetKey); setBook({}); setFolded({}); }
  const has = !!id && Array.isArray(questions) && questions.length > 0;
  const p = has ? book[id] : null;

  // l'étape est atteinte : la carte s'ouvre (et se rouvre après « أعِد التجربة »)
  useEffect(() => {
    if (!has || !reached) return;
    setBook((b) => (b[id] ? b : { ...b, [id]: C.fresh() }));
    setFolded((f) => (f[id] ? { ...f, [id]: false } : f));
  }, [has, reached, id]);

  const blocking = has && !p?.done;
  const open = has && !!p && !p.done && !folded[id];
  const fold = useCallback(() => setFolded((f) => ({ ...f, [id]: true })), [id]);
  const unfold = useCallback(() => setFolded((f) => ({ ...f, [id]: false })), [id]);

  const answer = (value) => {
    const q = questions[p.qi];
    const next = C.submit(p, q, value);
    if (next === p) return;
    setBook((b) => ({ ...b, [id]: next }));
    playSfx(next.status === 'right' ? 'correct' : 'wrong');
    onEvent?.({ tk: 'checkpoint', id, q: q.id, ok: next.status === 'right', tries: next.tries, revealed: next.status === 'revealed' });
  };
  const go = () => {
    const next = C.advance(p, questions.length);
    if (next === p) return;
    setBook((b) => ({ ...b, [id]: next }));
    if (next.done) { onEvent?.({ tk: 'checkpoint-done', id, log: next.log }); onDone?.(id, next.log); }
  };
  const retry = () => { fold(); onRetry?.(); };

  const node = has && p && !p.done ? (
    open
      ? <CheckpointCard key={`${id}:${p.qi}`} id={id} questions={questions} p={p} onAnswer={answer} onNext={go} onLook={fold} onRetry={retry} />
      : <CheckpointPill onBack={unfold} />
  ) : null;
  return { blocking, open, done: has && !!p?.done, node };
}

const ring = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-300';
const pill = `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border-2 px-4 text-sm font-black transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none ${ring}`;

function CheckpointCard({ id, questions, p, onAnswer, onNext, onLook, onRetry }) {
  const { t } = useTranslation('lesson');
  const k = (s, o) => t(`manipulation.checkpoint.${s}`, o);
  const reduce = useReducedMotion();
  const q = questions[p.qi];
  const fb = C.feedbackOf(p, q);
  const settled = p.status === 'right' || p.status === 'revealed';
  const last = p.qi === questions.length - 1;
  const [draft, setDraft] = useState('');
  const [bad, setBad] = useState(false);
  const cardRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (p.qi === 0 && p.tries === 0) playSfx('pop');
    el?.scrollIntoView?.({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    (inputRef.current ?? el)?.focus?.({ preventScroll: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const check = () => {
    if (C.readNumber(draft) == null) { setBad(true); return; }
    setBad(false);
    onAnswer(draft);
  };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); onLook(); return; }
    // 1 2 3 choisissent une option (hors du champ de saisie), comme dans le défi « اختبر ذاكرتك »
    const n = '123456'.indexOf(e.key);
    if (q.kind === 'choice' && !settled && n >= 0 && n < q.options.length && e.target.tagName !== 'INPUT' && !p.wrong.includes(n)) { e.preventDefault(); onAnswer(n); }
  };

  const optionState = (i) => {
    if (p.wrong.includes(i)) return 'wrong';
    if (settled && q.options[i]?.correct) return 'right';
    return 'idle';
  };
  const optionClass = {
    idle: 'border-indigo-200 bg-white text-indigo-950 hover:border-indigo-500 hover:bg-indigo-50 shadow-[0_3px_0_0_#C7D2FE]',
    wrong: 'border-rose-200 bg-rose-50 text-rose-800 line-through decoration-rose-400 opacity-80',
    right: 'border-emerald-600 bg-emerald-600 text-white shadow-[0_3px_0_0_#047857]',
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-slate-900/55 p-3 backdrop-blur-[3px] md:p-5"
      initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: p.qi === 0 && p.tries === 0 ? 0.6 : 0 }}
      data-lab-checkpoint data-checkpoint={id} data-q={q.id} data-status={p.status} onKeyDown={onKey}
    >
      <div ref={cardRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`lab-cp-${id}-${q.id}`}
        className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl outline-none">
        <div className="flex items-center justify-between gap-4 bg-gradient-to-l from-indigo-700 via-violet-700 to-fuchsia-700 px-5 py-3 text-white">
          <p className="flex items-center gap-2 text-base font-black">
            <MessageCircleQuestion className="h-6 w-6" aria-hidden="true" /> {k('title', { i: p.qi + 1, n: questions.length })}
          </p>
          <ol className="flex items-center gap-1.5" aria-hidden="true">
            {questions.map((qq, i) => (
              <li key={qq.id} className={`h-2.5 rounded-full transition-all ${i < p.qi ? 'w-8 bg-emerald-400' : i === p.qi ? 'w-12 animate-pulse bg-white' : 'w-8 bg-white/25'}`} />
            ))}
          </ol>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 md:px-8">
          <h4 id={`lab-cp-${id}-${q.id}`} className="text-center text-xl font-black leading-relaxed text-slate-900 md:text-2xl">{q.prompt}</h4>

          {q.kind === 'choice' ? (
            <div className={`grid gap-3 ${q.cols === 3 ? 'md:grid-cols-3' : q.cols === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {q.options.map((o, i) => {
                const st = optionState(i);
                const big = q.cols === 3;
                return (
                  <button key={i} type="button" onClick={() => onAnswer(i)} disabled={settled || st === 'wrong'}
                    data-lab-checkpoint-option={i} data-state={st} aria-pressed={st !== 'idle'}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 font-black transition-all duration-150 active:translate-y-0.5 disabled:cursor-default motion-reduce:transition-none ${
                      big ? 'min-h-[7.5rem] justify-center px-4 pb-3 pt-8 text-2xl md:text-3xl' : 'min-h-[4rem] px-4 py-3 text-start text-lg'} ${optionClass[st]} ${ring}`}>
                    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${st === 'right' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'} ${big ? 'absolute start-3 top-3' : ''}`}>{i + 1}</span>
                    <span className={big ? 'text-center' : 'min-w-0 flex-1'}>{o.text}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3" dir="ltr">
              <input ref={inputRef} type="text" inputMode="text" autoComplete="off" dir="ltr" value={settled ? (p.status === 'right' ? draft : '') : draft}
                disabled={settled} maxLength={9} placeholder={k('placeholder')}
                onChange={(e) => { setDraft(e.target.value); setBad(false); }} onKeyDown={(e) => { if (e.key === 'Enter' && !settled) check(); }}
                aria-label={k('inputAria')} aria-invalid={bad} data-lab-checkpoint-input
                className={`h-16 w-52 rounded-2xl border-2 ${bad ? 'border-rose-300' : 'border-indigo-300'} bg-white px-4 text-center text-4xl font-black tabular-nums text-indigo-950 placeholder:text-base placeholder:font-bold placeholder:text-slate-400 disabled:bg-slate-50 ${ring}`} />
              {!settled && (
                <button type="button" onClick={check} disabled={!draft.trim()} data-lab-checkpoint-check
                  className={`inline-flex min-h-[64px] items-center gap-2 rounded-2xl border-2 border-sky-600 bg-sky-500 px-8 text-xl font-black text-white shadow-[0_4px_0_0_#0369A1] transition-all active:translate-y-0.5 disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none ${ring}`}>
                  <Send className="h-5 w-5 -scale-x-100" aria-hidden="true" /> <span dir="rtl">{k('check')}</span>
                </button>
              )}
              {bad && <p role="alert" dir="rtl" className="w-full text-center text-base font-bold text-rose-700">{k('badInput')}</p>}
            </div>
          )}

          <div aria-live="polite">
            {fb?.kind === 'hint' && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-base font-bold text-amber-950" data-lab-checkpoint-feedback="hint">
                <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" aria-hidden="true" />
                <div className="space-y-1">
                  <p>{k('notYet')} {fb.node}</p>
                  <p className="text-sm font-extrabold text-amber-700">{k(C.MAX_TRIES - p.tries === 1 ? 'triesOne' : 'triesTwo')}</p>
                </div>
              </div>
            )}
            {fb?.kind === 'reveal' && (
              <div className="space-y-1 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-base font-bold text-indigo-950" data-lab-checkpoint-feedback="reveal">
                <p>{k('reveal')} {q.kind === 'number' ? <strong className="text-xl">{q.answer ?? <bdi dir="ltr">{q.expected}</bdi>}</strong> : null}</p>
                {q.explain && <div>{q.explain}</div>}
              </div>
            )}
            {p.status === 'right' && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-bold text-emerald-950" data-lab-checkpoint-feedback="right">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
                <div>{k('right')} {q.explain}</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onLook} data-lab-checkpoint-look className={`${pill} border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50`}>
              <Eye className="h-4 w-4" aria-hidden="true" /> {k('look')}
            </button>
            <button type="button" onClick={onRetry} data-lab-checkpoint-retry className={`${pill} border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50`}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {k('retry')}
            </button>
          </div>
          {settled && (
            <button type="button" onClick={onNext} data-lab-checkpoint-next autoFocus
              className={`inline-flex min-h-[52px] items-center gap-2 rounded-full border-2 border-emerald-600 bg-emerald-600 px-8 text-lg font-black text-white shadow-[0_4px_0_0_#047857] active:translate-y-0.5 ${ring}`}>
              {last ? k('finish') : k('next')} <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CheckpointPill({ onBack }) {
  const { t } = useTranslation('lesson');
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-amber-300 bg-amber-50 px-3 py-1.5" data-lab-checkpoint-pill role="status">
      <p className="flex items-center gap-2 text-sm font-black text-amber-950">
        <MessageCircleQuestion className="h-5 w-5 text-amber-600" aria-hidden="true" /> {t('manipulation.checkpoint.waiting')}
      </p>
      <button type="button" onClick={onBack} data-lab-checkpoint-back
        className={`${pill} border-amber-500 bg-amber-500 text-white shadow-[0_3px_0_0_#B45309]`}>
        {t('manipulation.checkpoint.back')} <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
