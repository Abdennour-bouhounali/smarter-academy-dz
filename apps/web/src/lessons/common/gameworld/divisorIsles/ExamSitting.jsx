/**
 * « الامتحان الأبيض » — the exam SITTING (prototype, 2026-11-16; logic: sitting.js). The opposite of the game on purpose:
 * one sheet of paper, three colours (black for the subject, blue for what the student writes, red for the corrector — never
 * before the copy comes back), silence, no stars. Three screens:
 *   read  the whole subject; numbers and words are underlined by a tap; no answer box exists yet;
 *   sit   the subject on one side, the answer sheet on the other; NO verdict; a quiet pace line; one notice at the last minute;
 *         an exercise left completely EMPTY is shown once before the hand-in is accepted (a forgotten page is not a choice);
 *   « خروج » (read and sit): leaves after ONE confirmation — nothing is marked, nothing is sent, the ladder does not move;
 *   back  the copy handed back: red marks, the total, then — question by question — the scheme to tick against the paper and
 *         the two helps: « أرشدني » (never the answer) or « اشرح لي » (the model copy).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flag, Clock, PenLine, VolumeX, X, Compass, BookOpenCheck, NotebookPen, LogOut } from 'lucide-react';
import MathText from '../../components/MathText';
import Fit from './Fit';
import {
  makeSubject,
  mark,
  totalMark,
  model,
  scheme,
  evidenceOf,
} from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/sitting';
import { allQuestions, answered, forgotten, pace, appreciation } from '../kit/sitting';
import { PHRASES } from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/trainer';
import { T } from './strings';

const L = {
  seat: 'المقعد',
  read: 'وقت القراءة',
  readTip: 'اقرأ الموضوع كلّه أوّلًا. اضغط على عدد أو كلمة لتسطّرها بقلم الرصاص.',
  ready: 'أنهيتُ القراءة: أبدأ',
  paper: 'اكتب الحلّ كاملًا على ورقتك. هنا تنقل الأجوبة فقط.',
  sheet: 'ورقة الإجابة',
  silent: 'بلا موسيقى',
  here: 'يُفترض أن تكون هنا',
  flag: 'أعود إليه',
  lastMinute: 'بقيت دقيقة واحدة: راجع إجابتين.',
  hand: 'أسلّم ورقتي',
  sure: 'متأكّد؟ لن تستطيع التعديل بعد التسليم.',
  yes: 'نعم، أسلّم',
  no: 'أواصل',
  sealed: 'سُلّمت الورقة…',
  back: 'ورقتك المصحَّحة',
  pick: 'اضغط على سؤال لترى تصحيحه',
  mine: 'جوابك',
  none: 'لم تُجب',
  scheme: 'قارن مع ورقتك: ماذا كتبتَ؟',
  guide: 'أرشدني',
  explain: 'اشرح لي',
  modelCopy: 'التحرير النموذجي',
  think: 'فكّر معي',
  redo: 'أعد حلّ هذا السؤال على ورقتك، ثمّ قارن.',
  notebook: 'دفتر أخطائي',
  notebookTip: 'اكتب في كرّاسك، بخطّ يدك:',
  finish: 'أنهيتُ',
  perfect: 'ورقة كاملة: لا شيء تكتبه في دفتر الأخطاء!',
  yesDiv: 'قاسم',
  noDiv: 'ليس قاسمًا',
  choose: '— اختر —',
  quit: 'خروج',
  quitTitle: 'تخرج من الامتحان؟',
  quitText: 'ورقتك لن تُصحَّح، وهذه المحاولة لا تُحسب: تجد الدرجة نفسها في السلّم بورقة جديدة.',
  quitYes: 'نعم، أخرج',
  forgotOne: (name) => `انتبه: لم تكتب شيئًا في ${name}. ها هو أمامك.`,
  forgotMany: (names) => `انتبه: لم تكتب شيئًا في ${names.join(' ولا في ')}.`,
};
const FAST = () => import.meta.env.DEV && typeof window !== 'undefined' && window.__paperFast;
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const fmt = (n) => String(n).replace('.', ',');

/** A text of the subject: maths stays maths; in the plain parts every number and word can be underlined by a tap. */
function Markable({ text, id, marks, toggle }) {
  return text.split(/(\$[^$]+\$)/).map((part, i) =>
    part.startsWith('$') ? (
      <MathText key={i}>{part}</MathText>
    ) : (
      part.split(/(\s+)/).map((w, k) =>
        w.trim() === '' ? (
          w
        ) : (
          <span
            key={`${i}-${k}`}
            role="button"
            tabIndex={-1}
            className={`xs-word ${marks.has(`${id}:${i}:${k}`) ? 'is-marked' : ''}`}
            onClick={() => toggle(`${id}:${i}:${k}`)}
          >
            {w}
          </span>
        ),
      )
    ),
  );
}

function Field({ q, value, onChange, disabled }) {
  const set = (k, x) => onChange({ ...(value ?? {}), [k]: x });
  const num = (t) => (
    <label key={t.slot} className="xs-box">
      <input
        dir="ltr"
        inputMode="numeric"
        value={value?.[t.slot] ?? ''}
        disabled={disabled}
        style={{ width: `${t.w + 1.6}ch` }}
        aria-label={t.label}
        onChange={(e) => set(t.slot, e.target.value.replace(/[^0-9]/g, '').slice(0, t.w + 1))}
        data-xs-slot={`${q.id}:${t.slot}`}
      />
      <small>{t.label}</small>
    </label>
  );
  if (q.sentence) {
    return (
      <span className="xs-line">
        {q.sentence.map((p, i) =>
          typeof p === 'string' ? (
            <b key={i} dir={/^\d+$/.test(p) ? 'ltr' : 'rtl'}>
              {p}
            </b>
          ) : (
            <select
              key={i}
              value={value ?? ''}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              data-xs-select={q.id}
            >
              <option value="">{L.choose}</option>
              {p.choose ? (
                <>
                  <option value="yes">{L.yesDiv}</option>
                  <option value="no">{L.noDiv}</option>
                </>
              ) : (
                PHRASES.map((ph) => (
                  <option key={ph.id} value={ph.id}>
                    {ph.text}
                  </option>
                ))
              )}
            </select>
          ),
        )}
      </span>
    );
  }
  return (
    <span className="xs-line" dir="ltr">
      {q.tokens.map((t, i) =>
        typeof t === 'string' ? (
          <b key={i} dir={t === 'دج' ? 'rtl' : 'ltr'}>
            {t}
          </b>
        ) : (
          num(t)
        ),
      )}
    </span>
  );
}

/** What the student wrote, in blue ink, in the shape he wrote it. */
function Written({ q, value }) {
  if (!answered(q, value)) return <span className="xs-none">{L.none}</span>;
  if (q.sentence)
    return (
      <span className="xs-ink">
        {q.sentence.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i}> {p} </span>
          ) : (
            <u key={i}>
              {' '}
              {p.choose ? (value === 'yes' ? L.yesDiv : L.noDiv) : PHRASES.find((ph) => ph.id === value)?.text}{' '}
            </u>
          ),
        )}
      </span>
    );
  return (
    <span className="xs-ink" dir="ltr">
      {q.tokens.map((t, i) =>
        typeof t === 'string' ? (
          <span key={i} dir={t === 'دج' ? 'rtl' : 'ltr'}>
            {' '}
            {t}{' '}
          </span>
        ) : (
          <u key={i}>{value[t.slot]}</u>
        ),
      )}
    </span>
  );
}

export default function ExamSitting({ game, level = 4, weak = [], onFinish, onQuit }) {
  const subject = useMemo(() => makeSubject(Math.random, level, weak), []); // eslint-disable-line react-hooks/exhaustive-deps
  const qs = useMemo(() => allQuestions(subject), [subject]);
  const total = subject.minutes * 60;
  const [phase, setPhase] = useState('read');
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [marks, setMarks] = useState(() => new Set());
  const [page, setPage] = useState(0);
  const [left, setLeft] = useState(total);
  const [readLeft, setReadLeft] = useState(() => (FAST() ? 0 : 45));
  const [confirm, setConfirm] = useState(false);
  const [forgot, setForgot] = useState(null);
  const [quit, setQuit] = useState(false);
  const reminded = useRef(false);
  const [open, setOpen] = useState(null);
  const [help, setHelp] = useState({});
  const [ticks, setTicks] = useState({});
  const [nb, setNb] = useState(false);
  const [z, setZ] = useState(1);
  const seat = useRef(1 + Math.floor(Math.random() * 28));
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const onClose = () => onFinish?.(subject, answersRef.current);
  useEffect(() => {
    if (import.meta.env.DEV) window.__sitting = { subject };
  }, [subject]);

  useEffect(() => {
    const fit = () => setZ(Math.max(1, Math.min(1.8, Math.min(window.innerWidth / 1280, window.innerHeight / 720))));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  // an exam is silent: the music stops for the whole sitting
  useEffect(() => {
    game.paperMode('sitting', true);
    return () => game.paperMode('sitting', false);
  }, [game]);
  useEffect(() => {
    if (phase !== 'read' || readLeft <= 0) return undefined;
    const t = setTimeout(() => setReadLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, readLeft]);
  const handIn = () => {
    // الكفاءات: every answered question is a first and only try, unassisted — sent to the server, which re-computes its verdict
    for (const q of qs) game.evidence('case', evidenceOf(q, answersRef.current[q.id]));
    setPhase('envelope');
    setTimeout(() => setPhase('back'), FAST() ? 60 : 2200);
  };
  useEffect(() => {
    if (phase !== 'sit') return undefined;
    const t = setInterval(
      () =>
        setLeft((n) => {
          if (n <= 1) {
            clearInterval(t);
            handIn();
            return 0;
          }
          return n - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /** « أسلّم ورقتي »: an exercise left completely empty is put on the answer sheet first — ONCE; the next hand-in is accepted. */
  const askHand = () => {
    const miss = reminded.current ? [] : forgotten(subject, answersRef.current, page);
    if (miss.length === 0) {
      setConfirm(true);
      return;
    }
    reminded.current = true;
    setPage(miss[0]);
    setForgot(miss);
  };
  const goPage = (i) => {
    setPage(i);
    setForgot(null);
    setConfirm(false);
  };
  const short = (e) => e.title.split(' (')[0];
  const toggleMark = (k) =>
    setMarks((m) => {
      const n = new Set(m);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  const ex = subject.exercises[page];
  const got = totalMark(subject, answers);
  const done = (e) => e.questions.filter((q) => answered(q, answers[q.id])).length;

  const head = (
    <header className="xs-head">
      <span className="xs-seat">
        {L.seat} <b dir="ltr">{seat.current}</b>
      </span>
      <div>
        <h2>{subject.title}</h2>
        <p>
          {subject.lesson} · <span dir="ltr">{subject.total}</span> نقاط · <span dir="ltr">{subject.minutes}</span>{' '}
          دقيقة
        </p>
      </div>
      {phase === 'read' && (
        <span className="xs-clock" data-xs-read-clock>
          <Clock size={18} /> {L.read} <b dir="ltr">{clock(readLeft)}</b>
        </span>
      )}
      {phase === 'sit' && (
        <span className="xs-clock" data-xs-clock>
          <Clock size={18} /> <b dir="ltr">{clock(left)}</b>
        </span>
      )}
      {phase === 'back' && (
        <span className="xs-total" data-xs-total={got}>
          <b dir="ltr">{fmt(got)}</b>
          <i dir="ltr">/ {subject.total}</i>
        </span>
      )}
      {phase !== 'back' && (
        <span className="xs-quiet">
          <VolumeX size={15} /> {L.silent}
        </span>
      )}
      {(phase === 'read' || phase === 'sit') && (
        <button type="button" className="xs-btn xs-btn--quit" onClick={() => setQuit(true)} data-xs-quit>
          <LogOut size={16} /> {L.quit}
        </button>
      )}
      {phase === 'back' && (
        <button type="button" className="xs-btn" onClick={onClose} data-xs-close>
          <X size={16} />
        </button>
      )}
    </header>
  );

  return (
    <div className="xs-root" dir="rtl" data-xs={phase}>
      <div className="xs-fit" style={{ zoom: z }}>
        {head}

        {phase === 'read' && (
          <>
            <p className="xs-tip">
              <PenLine size={17} /> {L.readTip}
            </p>
            <Fit className="xs-paper xs-paper--read" innerClass={`xs-cols xs-cols--${subject.exercises.length}`}>
              {subject.exercises.map((e) => (
                <section key={e.id} className="xs-ex">
                  <h3>
                    {e.title} <i dir="ltr">({fmt(e.points)} ن)</i>
                  </h3>
                  <p className="xs-statement">
                    <Markable text={e.statement} id={e.id} marks={marks} toggle={toggleMark} />
                  </p>
                  <ol>
                    {e.questions.map((q) => (
                      <li key={q.id}>
                        <Markable text={q.text} id={q.id} marks={marks} toggle={toggleMark} />{' '}
                        <i dir="ltr">({fmt(q.points)})</i>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </Fit>
            <footer className="xs-foot">
              <button
                type="button"
                className="xs-btn xs-btn--main"
                disabled={readLeft > 35}
                onClick={() => setPhase('sit')}
                data-xs-start
              >
                {L.ready}
              </button>
            </footer>
          </>
        )}

        {phase === 'sit' && (
          <>
            <div className="xs-body">
              <Fit className="xs-paper">
                <section className="xs-ex">
                  <h3>
                    {ex.title} <i dir="ltr">({fmt(ex.points)} ن)</i>
                  </h3>
                  <p className="xs-statement">
                    <Markable text={ex.statement} id={ex.id} marks={marks} toggle={toggleMark} />
                  </p>
                  <ol>
                    {ex.questions.map((q) => (
                      <li key={q.id}>
                        <Markable text={q.text} id={q.id} marks={marks} toggle={toggleMark} />{' '}
                        <i dir="ltr">({fmt(q.points)})</i>
                      </li>
                    ))}
                  </ol>
                </section>
              </Fit>
              <Fit className={`xs-sheet ${forgot ? 'is-forgot' : ''}`}>
                <h3>
                  {L.sheet} — {ex.title}
                </h3>
                <p className="xs-tip xs-tip--in">
                  <PenLine size={15} /> {L.paper}
                </p>
                <ol>
                  {ex.questions.map((q, k) => (
                    <li key={q.id} className={flags[q.id] ? 'is-flagged' : ''}>
                      <b className="xs-n" dir="ltr">
                        {k + 1})
                      </b>
                      <Field
                        q={q}
                        value={answers[q.id]}
                        onChange={(v) => {
                          setForgot(null);
                          setAnswers((a) => ({ ...a, [q.id]: v }));
                        }}
                      />
                      <button
                        type="button"
                        className={`xs-flag ${flags[q.id] ? 'is-on' : ''}`}
                        title={L.flag}
                        aria-label={L.flag}
                        onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
                      >
                        <Flag size={16} />
                      </button>
                    </li>
                  ))}
                </ol>
              </Fit>
            </div>
            {left <= 60 && left > 0 && (
              <p className="xs-last" data-xs-last>
                {L.lastMinute}
              </p>
            )}
            <footer className="xs-foot xs-foot--sit">
              <nav className="xs-pages">
                {subject.exercises.map((e, i) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`${i === page ? 'is-on' : ''} ${forgot?.includes(i) ? 'is-forgot' : ''}`}
                    onClick={() => goPage(i)}
                    data-xs-page={i}
                  >
                    {short(e)}{' '}
                    <i dir="ltr">
                      {done(e)}/{e.questions.length}
                    </i>
                  </button>
                ))}
              </nav>
              {!forgot && (
                <div className="xs-pace" title={L.here} dir="ltr" data-xs-pace>
                  <i style={{ left: `${pace(total - left, total) * 100}%` }} />
                  {subject.exercises.map((e) => (
                    <span key={e.id} style={{ flex: e.points }} />
                  ))}
                </div>
              )}
              {forgot ? (
                <span className="xs-confirm xs-confirm--forgot" role="status" data-xs-forgot={forgot.join(',')}>
                  {forgot.length === 1
                    ? L.forgotOne(short(subject.exercises[forgot[0]]))
                    : L.forgotMany(forgot.map((i) => short(subject.exercises[i])))}{' '}
                  <button
                    type="button"
                    className="xs-btn xs-btn--main"
                    onClick={() => setForgot(null)}
                    data-xs-forgot-go
                  >
                    {L.no}
                  </button>
                </span>
              ) : confirm ? (
                <span className="xs-confirm">
                  {L.sure}{' '}
                  <button type="button" className="xs-btn xs-btn--main" onClick={handIn} data-xs-hand-yes>
                    {L.yes}
                  </button>{' '}
                  <button type="button" className="xs-btn" onClick={() => setConfirm(false)} data-xs-hand-no>
                    {L.no}
                  </button>
                </span>
              ) : (
                <button type="button" className="xs-btn xs-btn--main" onClick={askHand} data-xs-hand>
                  {L.hand}
                </button>
              )}
            </footer>
          </>
        )}

        {quit && (phase === 'read' || phase === 'sit') && (
          <div
            className="xs-quitbox"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="xs-quit-title"
            data-xs-quit-box
          >
            <div>
              <h3 id="xs-quit-title">{L.quitTitle}</h3>
              <p>{L.quitText}</p>
              <span>
                <button
                  type="button"
                  className="xs-btn xs-btn--main"
                  onClick={() => setQuit(false)}
                  autoFocus
                  data-xs-quit-no
                >
                  {L.no}
                </button>{' '}
                <button type="button" className="xs-btn" onClick={() => onQuit?.()} data-xs-quit-yes>
                  {L.quitYes}
                </button>
              </span>
            </div>
          </div>
        )}

        {phase === 'envelope' && (
          <div className="xs-envelope" data-xs-envelope>
            <div className="xs-envelope__sheet" />
            <div className="xs-envelope__flap" />
            <p>{L.sealed}</p>
          </div>
        )}

        {phase === 'back' && (
          <>
            <p className="xs-appreciation" data-xs-appreciation>
              {appreciation(got, subject.total)}
            </p>
            <div className="xs-body">
              <Fit className="xs-paper xs-paper--back">
                {subject.exercises.map((e) => (
                  <section key={e.id} className="xs-ex">
                    <h3>
                      {e.title}{' '}
                      <i dir="ltr" className="xs-red">
                        {fmt(e.questions.reduce((t, q) => t + mark(q, answers[q.id]), 0))}
                        {'\u00a0/\u00a0'}
                        {fmt(e.points)}
                      </i>
                    </h3>
                    <ol>
                      {e.questions.map((q) => {
                        const m = mark(q, answers[q.id]);
                        const tone = m === q.points ? 'ok' : m > 0 ? 'half' : 'ko';
                        return (
                          <li key={q.id}>
                            <button
                              type="button"
                              className={`xs-row ${open === q.id ? 'is-open' : ''}`}
                              onClick={() => setOpen(q.id)}
                              data-xs-row={q.id}
                              data-xs-mark={tone}
                            >
                              <span className="xs-row__q">
                                <MathText>{q.text}</MathText>
                              </span>
                              <Written q={q} value={answers[q.id]} />
                              <span className={`xs-pen is-${tone}`}>
                                {tone === 'ok' ? '✓' : tone === 'half' ? '½' : '✗'}{' '}
                                <i dir="ltr">
                                  {fmt(m)}/{fmt(q.points)}
                                </i>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                ))}
              </Fit>
              <Fit className="xs-sheet xs-sheet--back">
                {(() => {
                  if (nb) {
                    const lost = qs.filter((q) => mark(q, answers[q.id]) < q.points && q.key);
                    const keys = [...new Set(lost.map((q) => q.key))];
                    return (
                      <div className="xs-notebook" data-xs-notebook>
                        <h3>
                          <NotebookPen size={20} /> {L.notebook}
                        </h3>
                        {keys.length === 0 ? (
                          <p>{L.perfect}</p>
                        ) : (
                          <>
                            <p>{L.notebookTip}</p>
                            <ol>
                              {keys.map((k) => (
                                <li key={k}>
                                  <b>{T.tablets[k].title}:</b> {T.tablets[k].notes.at(-1)}
                                </li>
                              ))}
                            </ol>
                          </>
                        )}
                        <button type="button" className="xs-btn xs-btn--main" onClick={onClose} data-xs-finish>
                          {L.finish}
                        </button>
                      </div>
                    );
                  }
                  const q = qs.find((x) => x.id === open);
                  if (!q)
                    return (
                      <div className="xs-pick">
                        <p>{L.pick}</p>
                        <button
                          type="button"
                          className="xs-btn xs-btn--main"
                          onClick={() => setNb(true)}
                          data-xs-notebook-open
                        >
                          <NotebookPen size={17} /> {L.notebook}
                        </button>
                      </div>
                    );
                  const m = mark(q, answers[q.id]);
                  const full = m === q.points;
                  const h = help[q.id] ?? (full ? 'explain' : null);
                  const rule = q.key ? T.tablets[q.key] : null;
                  return (
                    <div className="xs-detail" data-xs-detail={q.id}>
                      <h3>
                        <MathText>{q.text}</MathText>
                      </h3>
                      <p className="xs-detail__mine">
                        <small>{L.mine}</small> <Written q={q} value={answers[q.id]} />{' '}
                        <span className={`xs-pen is-${full ? 'ok' : m > 0 ? 'half' : 'ko'}`} dir="ltr">
                          {fmt(m)}/{fmt(q.points)}
                        </span>
                      </p>
                      <div className="xs-scheme">
                        <small>{L.scheme}</small>
                        {scheme(q).map((s, i) => (
                          <label key={s}>
                            <input
                              type="checkbox"
                              checked={Boolean(ticks[`${q.id}:${i}`])}
                              onChange={(e) => setTicks((t) => ({ ...t, [`${q.id}:${i}`]: e.target.checked }))}
                            />{' '}
                            <MathText>{s}</MathText>
                          </label>
                        ))}
                      </div>
                      {!full && (
                        <div className="xs-helps">
                          <button
                            type="button"
                            className={`xs-btn ${h === 'guide' ? 'is-on' : ''}`}
                            onClick={() => setHelp((x) => ({ ...x, [q.id]: 'guide' }))}
                            data-xs-guide
                          >
                            <Compass size={16} /> {L.guide}
                          </button>
                          <button
                            type="button"
                            className={`xs-btn ${h === 'explain' ? 'is-on' : ''}`}
                            onClick={() => setHelp((x) => ({ ...x, [q.id]: 'explain' }))}
                            data-xs-explain
                          >
                            <BookOpenCheck size={16} /> {L.explain}
                          </button>
                        </div>
                      )}
                      {h === 'guide' && (
                        <div className="xs-help" data-xs-help="guide">
                          <small>{L.think}</small>
                          {rule ? (
                            <>
                              <p>
                                <MathText>{rule.lines[0]}</MathText>
                              </p>
                              <p>
                                <b>{rule.notes.at(-1)}</b>
                              </p>
                            </>
                          ) : (
                            <p>{scheme(q)[0]}</p>
                          )}
                          <p className="xs-redo">{L.redo}</p>
                        </div>
                      )}
                      {h === 'explain' && (
                        <div className="xs-help xs-help--model" data-xs-help="explain">
                          <small>{L.modelCopy}</small>
                          {model(q).map((line) => (
                            <p key={line}>
                              <MathText>{line}</MathText>
                            </p>
                          ))}
                        </div>
                      )}
                      <button type="button" className="xs-btn" onClick={() => setNb(true)} data-xs-notebook-open>
                        <NotebookPen size={16} /> {L.notebook}
                      </button>
                    </div>
                  );
                })()}
              </Fit>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
