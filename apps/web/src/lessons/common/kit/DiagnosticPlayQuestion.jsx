import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChoiceGrid } from '../components/LessonUI';
import { playSfx } from '../utils/playEffect';
import '../mission/mission.css';

/** Le temps pour se raviser après un toucher (« غيّر إجابتي »), puis le signal reste le temps d'être vu. */
export const UNDO_MS = 1000;
export const SIGNAL_MS = 900;

/**
 * UNE QUESTION DE « أستعدّ » DANS LE LECTEUR (pilote, propriétaire 2026-11-07, après le conseil) :
 *  1. « 🤔 غير متأكّد » se coche AVANT de répondre (facultatif : « متأكّد » par défaut) — une réponse juste mais incertaine
 *     signale aussi une كفاءة fragile ;
 *  2. un toucher choisit ; pendant 1 s une barre se vide et « غيّر إجابتي » permet de se raviser (un faux toucher ne compte pas) ;
 *  3. la réponse est alors ENGAGÉE (la première seulement compte : la question est verrouillée) et un SIGNAL s'affiche —
 *     juste : « ✓ أحسنت! » vert ; sinon : « ↻ سنعود إليه في النهاية » ambre, jamais « خطأ », jamais la bonne réponse (le conseil :
 *     montrer la réponse fausserait le diagnostic des questions suivantes de la même كفاءة). Son « correct » / « pop » (si « الصوت »).
 *  4. le lecteur passe seul à la suivante (useAutoAdvance) ; la correction complète est dans la revue finale.
 */
export default function DiagnosticPlayQuestion({ q, index, total, skill, pick, unsure, isCorrect, onCommit }) {
  const { t } = useTranslation('lesson');
  const [doubt, setDoubt] = useState(Boolean(unsure));
  const doubtRef = useRef(doubt);
  doubtRef.current = doubt;
  const [tentative, setTentative] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const locked = pick != null;
  const ok = locked && isCorrect(q, pick);

  const choose = (v) => {
    if (locked) return;
    setTentative(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      playSfx(isCorrect(q, v) ? 'correct' : 'pop');
      onCommit(v, doubtRef.current);
    }, UNDO_MS);
  };
  const undo = () => { clearTimeout(timer.current); setTentative(null); };
  const shown = locked ? pick : tentative;

  return (
    <div className="space-y-4 rounded-2xl border-2 border-slate-200 bg-white p-5" data-play-question={index + 1}
      data-play-state={locked ? (ok ? 'ok' : 'later') : tentative != null ? 'undo' : 'ask'}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-teal-600 px-2.5 py-1 font-mono text-xs font-bold text-white">
          {skill?.emoji} <span dir="ltr">{index + 1} / {total}</span>
        </span>
        {!locked && (
          <button type="button" onClick={() => setDoubt((d) => !d)} aria-pressed={doubt} data-play-doubt
            className={`min-h-[40px] rounded-full border-2 px-3 text-sm font-bold transition-colors ${doubt ? 'border-amber-400 bg-amber-100 text-amber-900' : 'border-slate-200 bg-white text-slate-500 hover:border-amber-300'}`}>
            🤔 {t('diagnostic.notSure')}
          </button>
        )}
      </div>
      <div className="text-lg leading-relaxed text-slate-800">{q.prompt}</div>
      {q.type === 'custom'
        ? q.render({ pick: shown ?? null, onPick: choose, revealed: false })
        : <ChoiceGrid options={q.options} order={q.order} selected={shown ?? null} onSelect={choose} disabled={locked} cols={q.cols || 2} renderOption={q.renderOption} />}

      {!locked && tentative != null && (
        <div className="flex items-center gap-3" data-play-undo>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div key={tentative} className="sa-timed-notice-bar h-full origin-right bg-teal-500" style={{ animationDuration: `${UNDO_MS}ms` }} />
          </div>
          <button type="button" onClick={undo} className="min-h-[40px] rounded-xl px-3 text-sm font-bold text-slate-600 hover:bg-slate-100" data-play-undo-btn>
            ↶ {t('diagnostic.changeAnswer')}
          </button>
        </div>
      )}

      {locked && (
        <p role="status" data-play-signal={ok ? 'ok' : 'later'}
          className={`rounded-2xl px-4 py-3 text-center text-xl font-black ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
          {ok ? `✓ ${t('diagnostic.signalOk')}` : `↻ ${t('diagnostic.signalLater')}`}
          {ok && unsure && <span className="ms-2 text-sm font-bold text-amber-700">🤔 {t('diagnostic.signalUnsure')}</span>}
        </p>
      )}
    </div>
  );
}
