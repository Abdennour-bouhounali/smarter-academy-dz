/**
 * « تدرّب » — the trainer that opens ON a card of « خريطة المعارف », without leaving the page (logic: trainer.js).
 * Six questions in two looks that alternate: the GAME look (dark, gates to tap) and the EXAM look (a white sheet, the exam's
 * verbs, the answer typed in its own shape) — so the student gets used to the sheet of the real exam while still playing.
 * A wrong answer gets a hint first (what the answer gives), then the written correction.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Star, RotateCcw, Gamepad2, FileText, ArrowLeft } from 'lucide-react';
import MathText from '../../components/MathText';
import { makeSession, check, solution, sessionStars, answerLabel, PHRASES, SESSION } from './trainer';
import { PaperGate, PaperModel, PaperChip, PT } from './Paper';
import { trainerEvidence } from './evidence';
import { twin } from './paper';

/** The statement of an exam question with its data underlined — the first gesture of the method: « أقرأ وأسطّر المعطيات ». */
const Marked = ({ text }) =>
  text.split(/(\d+)/).map((part, i) =>
    /^\d+$/.test(part) ? (
      <u key={i} dir="ltr">
        {part}
      </u>
    ) : (
      part
    ),
  );

const L = {
  game: 'بصيغة اللعب',
  exam: 'بصيغة الامتحان',
  question: (i) => `السؤال ${i}`,
  check: 'تحقّق',
  next: 'التالي',
  finish: 'أنهِ التدريب',
  again: 'أعيد التدريب',
  review: 'مراجعة',
  mine: 'جوابك',
  backNow: 'أعود إلى سؤالي',
  seeOld: 'اضغط على سؤال سابق لترى جوابك',
  hint: 'ليس بعد',
  fix: 'التصحيح',
  right: 'أحسنت!',
  true: 'صحيح',
  false: 'خطأ',
  why: 'التعليل:',
  so: 'إذن',
  isDiv: 'قاسم',
  notDiv: 'ليس قاسمًا',
  forNum: 'للعدد',
  other: 'قاسم آخر',
  pick: '— اختر —',
  done: ['واصل التدريب!', 'بداية جيّدة!', 'أحسنت!', 'تدريب مثاليّ!'],
  first: 'صحيحة من المحاولة الأولى',
  best: 'أفضل نتيجة',
};
const Num = ({ value, onChange, w = 3, ...rest }) => (
  <input
    className="di-num di-num--tr"
    dir="ltr"
    inputMode="numeric"
    pattern="[0-9]*"
    value={value}
    style={{ width: `${w + 1.4}ch` }}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, w + 1))}
    {...rest}
  />
);

export default function Trainer({ nodeId, best = 0, onDone, onPaper, onEvidence }) {
  const [run, setRun] = useState(0);
  const qs = useMemo(() => makeSession(Math.random, nodeId), [nodeId, run]);
  const [i, setI] = useState(0);
  const [tries, setTries] = useState(0);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(null);
  const first = useRef(0);
  const marks = useRef([]);
  const [model, setModel] = useState(null);
  const helped = useRef(false); // a model sheet was opened on this question: its answer is no longer evidence
  const log = useRef([]);
  const [rev, setRev] = useState(null); // what was answered, and the earlier question being read again
  const q = qs[i];
  // the exam format is answered in PAPER MODE: the music stops for it and comes back with the next game question
  const paper = q.format === 'exam' && !done;
  useEffect(() => {
    onPaper?.(paper);
    return () => onPaper?.(false);
  }, [paper]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setI(0);
    setTries(0);
    setFb(null);
    setDone(null);
    setRev(null);
    first.current = 0;
    marks.current = [];
    log.current = [];
  }, [qs]);
  useEffect(() => {
    if (import.meta.env.DEV) window.__trainer = { q, solution: solution(q), index: i };
  }, [q, i]);
  const submit = (value) => {
    if (fb?.final) return;
    const res = check(q, value);
    // الكفاءات: only the FIRST try of an exam-format question, with no help opened before (evidence.js) — right or wrong
    onEvidence?.(trainerEvidence(q, value, { firstTry: tries === 0, helped: helped.current }));
    const rec = log.current[i] ?? (log.current[i] = { attempts: [], fix: res.fix, tip: null });
    rec.attempts.push({ label: answerLabel(q, value), ok: res.ok });
    rec.tip = res.tip ?? null;
    // the shortcut « حيلة » comes only with the FINAL feedback: before it, it would give the result away
    if (res.ok) {
      if (tries === 0) first.current += 1;
      marks.current[i] = tries === 0 ? 'ok' : 'late';
      setFb({ ok: true, text: res.fix, tip: res.tip, final: true });
    } else if (tries === 0) {
      setTries(1);
      setFb({ ok: false, text: res.hint, final: false });
    } else {
      marks.current[i] = 'ko';
      setFb({ ok: false, text: res.fix, tip: res.tip, final: true });
    }
  };
  const next = () => {
    if (i + 1 >= qs.length) {
      const stars = sessionStars(first.current);
      setDone({ stars, first: first.current });
      onDone?.(stars);
      return;
    }
    setI(i + 1);
    setTries(0);
    setFb(null);
    setRev(null);
    helped.current = false;
  };

  if (done) {
    return (
      <div className="di-trainer di-trainer--done" data-di-trainer="done" data-di-tr-stars={done.stars}>
        <h4>{L.done[done.stars]}</h4>
        <div className="di-stars3 di-trainer__stars" dir="ltr">
          {[1, 2, 3].map((n) => (
            <Star key={n} size={44} className={n <= done.stars ? 'is-on' : ''} />
          ))}
        </div>
        <p>
          <b dir="ltr">
            {done.first}
            {'\u00a0/\u00a0'}
            {qs.length}
          </b>{' '}
          {L.first}
        </p>
        <button type="button" className="di-btn di-btn--primary" onClick={() => setRun((n) => n + 1)} data-di-tr-again>
          <RotateCcw size={16} /> {L.again}
        </button>
      </div>
    );
  }

  return (
    <div className={`di-trainer di-trainer--${q.format}`} data-di-trainer={q.format} data-di-tr-kind={q.kind}>
      <div className="di-trainer__bar">
        <span className={`di-trainer__badge is-${q.format}`}>
          {q.format === 'game' ? <Gamepad2 size={15} /> : <FileText size={15} />} {L[q.format]}
        </span>
        <span className="di-trainer__dots" dir="ltr" title={L.seeOld}>
          {SESSION.map((f, k) => (
            <button
              key={k}
              type="button"
              disabled={k > i || (k === i && rev === null)}
              onClick={() => setRev(k === i ? null : k)}
              className={`is-${f} ${k === i ? 'is-now' : ''} ${k === rev ? 'is-rev' : ''} ${marks.current[k] ? `is-${marks.current[k]}` : ''}`}
              aria-label={`${L.question(k + 1)}`}
              data-di-tr-dot={k}
            />
          ))}
        </span>
        {best > 0 && (
          <span className="di-trainer__best" title={L.best}>
            <Star size={13} className="di-ic-star" /> <b dir="ltr">{best}</b>
          </span>
        )}
      </div>
      {rev !== null && log.current[rev] && (
        <div className={`di-review ${qs[rev].format === 'exam' ? 'di-review--exam' : ''}`} data-di-tr-review={rev}>
          <p className="di-review__head">
            <b>
              {L.review} · {L.question(rev + 1)}
            </b>{' '}
            <span>{L[qs[rev].format]}</span>
          </p>
          <p className="di-review__q">
            <MathText>{qs[rev].kind === 'tf' ? `«${qs[rev].statement}»` : qs[rev].prompt}</MathText>
            {qs[rev].kind === 'tap' && <span dir="ltr"> — {qs[rev].wave.gates.join(' · ')}</span>}
            {qs[rev].kind === 'complete' && (
              <span dir="ltr">
                {' '}
                {qs[rev].x} … {qs[rev].y}
              </span>
            )}
          </p>
          {log.current[rev].attempts.map((at, k) => (
            <p key={k} className={`di-review__a ${at.ok ? 'is-ok' : 'is-ko'}`}>
              <b>{at.ok ? '✓' : '✗'}</b> <small>{L.mine}</small> <MathText>{at.label}</MathText>
            </p>
          ))}
          <p className="di-review__fix">
            <b>{L.fix}</b> <MathText>{log.current[rev].fix}</MathText>
          </p>
          {log.current[rev].tip && (
            <p className="di-tip">
              <b>💡 حيلة</b> <MathText>{log.current[rev].tip}</MathText>
            </p>
          )}
          <button type="button" className="di-btn di-btn--primary" onClick={() => setRev(null)} data-di-tr-back>
            {L.backNow}
          </button>
        </div>
      )}
      <div hidden={rev !== null} className="di-trainer__live">
        {paper && !fb?.final && <PaperChip />}
        {/* once the answer is final, the sheet gives way to ONE line — the question and what was answered — so the correction has the room */}
        {fb?.final && q.format === 'exam' ? (
          <div className="di-sheet di-sheet--done" data-di-tr-recap>
            <p className="di-sheet__q">
              <b>{L.question(i + 1)}</b> <MathText>{q.kind === 'tf' ? `«${q.statement}»` : q.prompt}</MathText>
            </p>
            <p className="di-sheet__mine">
              <small>{L.mine}</small> <MathText>{log.current[i]?.attempts.at(-1)?.label ?? ''}</MathText>
            </p>
          </div>
        ) : (
          <Question
            key={`${run}-${i}`}
            q={q}
            index={i}
            locked={Boolean(fb?.final)}
            onSubmit={submit}
            onModel={() => {
              helped.current = true;
              setModel({ ...twin(q.a, q.b), own: false });
            }}
          />
        )}
        {fb && (
          <p
            className={`di-trainer__fb ${fb.ok ? 'is-ok' : fb.final ? 'is-fix' : 'is-hint'}`}
            data-di-tr-fb={fb.ok ? 'ok' : fb.final ? 'fix' : 'hint'}
          >
            <b>{fb.ok ? L.right : fb.final ? L.fix : L.hint}</b> <MathText>{fb.text}</MathText>
          </p>
        )}
        {fb?.final && fb.tip && (
          <p className="di-tip" data-di-tip>
            <b>💡 حيلة</b> <MathText>{fb.tip}</MathText>
          </p>
        )}
        {model && <PaperModel a={model.a} b={model.b} own={model.own} onClose={() => setModel(null)} />}
        {fb?.final && (
          <div className="di-trainer__end">
            <button
              type="button"
              className="di-btn di-btn--primary di-trainer__next"
              onClick={next}
              data-di-tr-next
              autoFocus
            >
              {i + 1 >= qs.length ? L.finish : L.next} <ArrowLeft size={16} />
            </button>
            {!fb.ok && (q.kind === 'division' || q.kind === 'show') && (
              <button
                type="button"
                className="di-link"
                onClick={() => setModel({ a: q.a, b: q.b, own: true })}
                data-di-tr-model
              >
                {PT.readFix}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** One question, drawn in the look of its format. Every exam question is a <form>: Enter checks, as on any answer sheet. */
function Question({ q, index, locked, onSubmit, onModel }) {
  const [v, setV] = useState({});
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }));
  const exam = q.format === 'exam';
  const head = exam ? (
    <p className="di-sheet__q">
      <b>{L.question(index + 1)}</b> <Marked text={q.prompt} />
    </p>
  ) : null;
  const send = (e) => {
    e.preventDefault();
    onSubmit(v);
  };
  const checkBtn = (ready) => (
    <button type="submit" className="di-btn di-sheet__check" disabled={!ready || locked} data-di-tr-check>
      {L.check}
    </button>
  );

  if (q.kind === 'tap') {
    return (
      <div className="di-tap">
        <p className="di-tap__say">
          <MathText>{q.prompt}</MathText>
        </p>
        <div className="di-tap__gates" dir="ltr">
          {q.wave.gates.map((n) => (
            <button key={n} type="button" disabled={locked} onClick={() => onSubmit(n)} data-di-tr-opt={n}>
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (q.kind === 'tf') {
    const tf = (
      <div className="di-tf" dir="rtl">
        {[true, false].map((t) => (
          <button
            key={String(t)}
            type="button"
            disabled={locked}
            className={v.truth === t ? 'is-on' : ''}
            onClick={() => (exam ? set('truth')(t) : onSubmit({ truth: t }))}
            data-di-tr-tf={String(t)}
          >
            {t ? L.true : L.false}
          </button>
        ))}
      </div>
    );
    if (!exam)
      return (
        <div className="di-tap">
          <p className="di-tap__say di-tap__say--quote">«{q.statement}»</p>
          {tf}
        </div>
      );
    return (
      <form className="di-sheet" onSubmit={send}>
        <p className="di-sheet__q">
          <b>{L.question(index + 1)}</b> صحيح أم خطأ؟ علّل.
        </p>
        <p className="di-sheet__statement">«{q.statement}»</p>
        <PaperGate tip={PT.tipWrite}>
          {tf}
          <div className="di-sheet__reasons">
            <small>{L.why}</small>
            {q.reasons.map((r, k) => (
              <button
                key={r.t}
                type="button"
                disabled={locked}
                className={v.reason === k ? 'is-on' : ''}
                onClick={() => set('reason')(k)}
                data-di-tr-reason={k}
              >
                <MathText>{r.t}</MathText>
              </button>
            ))}
          </div>
          {checkBtn(v.truth != null && v.reason != null)}
        </PaperGate>
      </form>
    );
  }
  if (q.kind === 'division') {
    return (
      <form className="di-sheet" onSubmit={send}>
        {head}
        <PaperGate tip={PT.tipDivision} onModel={onModel}>
          <div className="di-sheet__line" dir="ltr">
            <span>{q.a}</span>
            <span>=</span>
            <span>{q.b}</span>
            <span>×</span>
            <Num value={v.q ?? ''} onChange={set('q')} disabled={locked} aria-label="حاصل القسمة" data-di-tr="q" />
            <span>+</span>
            <Num value={v.r ?? ''} onChange={set('r')} disabled={locked} aria-label="الباقي" data-di-tr="r" />
          </div>
          <div className="di-sheet__line">
            {L.so} <b dir="ltr">{q.b}</b>
            <select
              value={v.fits == null ? '' : v.fits ? 'yes' : 'no'}
              onChange={(e) => set('fits')(e.target.value === '' ? null : e.target.value === 'yes')}
              disabled={locked}
              data-di-tr="fits"
            >
              <option value="">{L.pick}</option>
              <option value="yes">{L.isDiv}</option>
              <option value="no">{L.notDiv}</option>
            </select>
            {L.forNum} <b dir="ltr">{q.a}</b>
          </div>
          {checkBtn((v.q ?? '') !== '' && (v.r ?? '') !== '' && v.fits != null)}
        </PaperGate>
      </form>
    );
  }
  if (q.kind === 'show') {
    return (
      <form className="di-sheet" onSubmit={send}>
        {head}
        <PaperGate tip={PT.tipDivision} onModel={onModel}>
          <div className="di-sheet__line" dir="ltr">
            <span>{q.a}</span>
            <span>=</span>
            <span>{q.b}</span>
            <span>×</span>
            <Num value={v.q ?? ''} onChange={set('q')} disabled={locked} aria-label="العدد الناقص" data-di-tr="q" />
          </div>
          <div className="di-sheet__line">
            {L.other} {L.forNum} <b dir="ltr">{q.a}</b>:{' '}
            <Num value={v.x ?? ''} onChange={set('x')} disabled={locked} aria-label={L.other} data-di-tr="x" />
          </div>
          {checkBtn((v.q ?? '') !== '' && (v.x ?? '') !== '')}
        </PaperGate>
      </form>
    );
  }
  if (q.kind === 'complete') {
    return (
      <form
        className="di-sheet"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(v.p);
        }}
      >
        {head}
        <PaperGate tip={PT.tipWrite}>
          <div className="di-sheet__line">
            <b dir="ltr">{q.x}</b>
            <select value={v.p ?? ''} onChange={(e) => set('p')(e.target.value)} disabled={locked} data-di-tr="phrase">
              <option value="">{L.pick}</option>
              {PHRASES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.text}
                </option>
              ))}
            </select>
            <b dir="ltr">{q.y}</b>
          </div>
          {checkBtn(Boolean(v.p))}
        </PaperGate>
      </form>
    );
  }
  return (
    <form className="di-sheet" onSubmit={send}>
      {head}
      <PaperGate tip={PT.tipWrite}>
        <div className="di-sheet__line" dir="ltr">
          <Num value={v.x ?? ''} onChange={set('x')} disabled={locked} aria-label="القاسم الأوّل" data-di-tr="x" />
          <span dir="rtl">و</span>
          <Num value={v.y ?? ''} onChange={set('y')} disabled={locked} aria-label="القاسم الثاني" data-di-tr="y" />
        </div>
        {checkBtn((v.x ?? '') !== '' && (v.y ?? '') !== '')}
      </PaperGate>
    </form>
  );
}
