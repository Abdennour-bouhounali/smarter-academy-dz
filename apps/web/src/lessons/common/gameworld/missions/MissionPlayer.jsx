/**
 * AN INTEGRATION MISSION, played in the 3D depot (`docs/reports/INTEGRATION_LESSON_PLAN.md` §8 and §9; PROTOTYPE of
 * mission 1, the scene « lots »).
 *
 * §8 — ONE SENTENCE OF THE EXAM TEXT ↔ ONE LINE OF NUMBERS: the exam paper with its numbers, the depot, ONE question,
 * ONE thing to touch; the depot carries out whatever he types and a line is written. Nothing is ever « wrong ».
 * §9 — THE PAPER FIRST, THE DEPOT CHECKS: the BEM is written with a pen. He works on his REAL sheet; « ورقتي » on
 * screen is its typed twin, laid out as an exam copy (« المعطيات », « المطلوب », « الحلّ »). Every step says what to
 * write on the sheet (✍️), opens its boxes only after « كتبتُ على ورقتي », then the depot plays the line. The start
 * cannot be missed: a mission card, a message that the clock is about to start (5 seconds, no way to close it), and
 * the robot doing the first gesture itself. A clock runs in every mission. No text under 18 px.
 *
 * The situation is DATA (`situation`); this file names no lesson. Not built: the save, hearts, missions 2 and 3.
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Clock, Coins, PenLine, Play, Star, Trophy, X } from 'lucide-react';
import { M } from '../kit/parts';
import { PaperModel } from '../kit/Paper';
import { deal, euclid, fill, gcd, line, slip, advice } from './lots';
import Ink from './Ink';
import './mission.css';

const NB = '\u00a0';
/** Arabic agreement of a counted noun: forms = [one, two, plural (3–10), singular accusative (11+)]. */
const counted = (n, forms) => {
  const last = n % 100;
  if (n === 1) return forms[0];
  if (n === 2) return forms[1];
  return last >= 3 && last <= 10 ? `${n}${NB}${forms[2]}` : `${n}${NB}${forms[3]}`;
};
const CRATES = ['صندوق واحد', 'صندوقان', 'صناديق', 'صندوقًا'];
/** « 3 صناديق من البطاطا و6 صناديق من الجزر » — only the stocks of which something is left. */
const leftOf = (left, kinds) =>
  ['a', 'b']
    .filter((k) => left[k] > 0)
    .map((k) => `${counted(left[k], CRATES)} من ${kinds[k].name}`)
    .join(' و');
/** An equality or an operation inside an Arabic sentence reads left to right, whatever stands around it. */
const ltr = (s) => `\u2066${s.replace(/ /g, '\u00a0')}\u2069`; // …and never breaks across two lines
const num = (v) => (/^\d+$/.test(String(v ?? '').trim()) ? Number(v) : null);
const tex = (l) => `${l.a} = ${l.b} \\times ${l.q} + ${l.r}`;
const clock = (s) =>
  `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, '0')}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;
const STEPS = 10;
const BRAVO = ['أحسنت!', 'ممتاز!', 'رائع!', 'صحيح!', 'هكذا!'];
const WARN = 5; // seconds the « the clock is about to start » message stays — it cannot be closed

function Box({ value, onChange, label, name, w = 4, onEnter }) {
  return (
    <input
      className="ms-in ms-target"
      inputMode="numeric"
      dir="ltr"
      style={{ width: `${w + 1.6}ch` }}
      value={value ?? ''}
      aria-label={label}
      data-ms-in={name}
      onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
    />
  );
}

/** ✍️ what to write on the REAL sheet; its boxes open only after « كتبتُ على ورقتي » (a few seconds must pass). */
function Sheet({ id, text, written, onWritten, children }) {
  const [wait, setWait] = useState(3);
  useEffect(() => {
    setWait(3);
    const t = setInterval(() => setWait((w) => Math.max(0, w - 1)), 1000);
    return () => clearInterval(t);
  }, [id]);
  if (written) return children;
  return (
    <div className="ms-sheet" data-ms-sheet={id}>
      <p>
        <PenLine size={22} aria-hidden="true" />
        <b>على ورقتك:</b> {text}
      </p>
      <button type="button" className="ms-btn ms-target" data-ms-written disabled={wait > 0} onClick={onWritten}>
        <Check size={18} aria-hidden="true" />
        {wait > 0 ? `كتبتُ على ورقتي (${wait})` : 'كتبتُ على ورقتي'}
      </button>
    </div>
  );
}

/** The exam paper: its text whole, the phrases that light, and what he taps in it (its numbers, then its questions). */
function Paper({ sit, lit, known, goals, step, onTap, onGoal }) {
  return (
    <aside className="ms-paper" data-ms-paper>
      <h3>{sit.session}</h3>
      <p>
        {sit.paper.map((p, i) => {
          let el;
          if (p.stock)
            el = (
              <button
                key={i}
                type="button"
                className={`ms-num ${known[p.stock] ? 'is-known' : step === 1 ? 'is-ask ms-target' : ''}`}
                data-ms-tap={p.stock}
                disabled={step !== 1 || known[p.stock]}
                onClick={() => onTap(p.stock)}
              >
                {p.t}
              </button>
            );
          else if (p.id && sit.goals.some((g) => g.id === p.id) && step === 2 && !goals.includes(p.id))
            el = (
              <button
                key={i}
                type="button"
                className="ms-num is-goal ms-target"
                data-ms-goal={p.id}
                onClick={() => onGoal(p.id)}
              >
                {p.t}
              </button>
            );
          else if (p.id)
            el = (
              <mark
                key={i}
                className={`ms-phrase ${lit[p.id] ? `is-${lit[p.id]}` : ''}`}
                data-ms-lit={`${p.id}:${lit[p.id] ?? 'off'}`}
              >
                {p.t}
              </mark>
            );
          else el = <span key={i}>{p.t}</span>;
          return p.br ? [el, <br key={`b${i}`} />] : el;
        })}
      </p>
    </aside>
  );
}

/** « ورقتي »: the typed twin of his sheet, laid out as an exam copy. The solution shows its last lines; the rest folds. */
function Copy({ sit, data, goals, lines, ans, keep = 2 }) {
  const [all, setAll] = useState(false);
  // the lines of the METHOD (the divisions, the PGCD, the answers) always show; the tries fold, the last two stay
  const tries = lines.filter((l) => l.tone !== 'key');
  const shown = all ? lines : lines.filter((l) => l.tone === 'key' || (keep > 0 && tries.slice(-keep).includes(l)));
  return (
    <aside className="ms-book" data-ms-book={lines.length}>
      <h3>
        <PenLine size={18} aria-hidden="true" /> ورقتي
      </h3>
      {!all && (
        <>
          <h4>المعطيات</h4>
          <ul data-ms-data={data.join(',')}>
            {sit.data
              .filter((d) => data.includes(d.id))
              .map((d) => (
                <li key={d.id}>{d.text}</li>
              ))}
            {ans != null && <li className="is-key">جواب (ا): {counted(ans, sit.lot.forms)}</li>}
          </ul>
          <h4>المطلوب</h4>
          <ul data-ms-goals={goals.join(',')}>
            {sit.goals
              .filter((g) => goals.includes(g.id))
              .map((g) => (
                <li key={g.id}>
                  {g.label} {g.text}
                </li>
              ))}
          </ul>
        </>
      )}
      <h4>
        الحلّ
        {shown.length < lines.length || all ? (
          <button type="button" className="ms-fold" data-ms-fold onClick={() => setAll((x) => !x)}>
            {all ? 'أقلّ' : `كلّ الأسطر (${lines.length})`}
          </button>
        ) : null}
      </h4>
      <ol dir="ltr">
        {shown.map((l) => (
          <li key={l.id} className={`is-${l.tone ?? 'plain'}`} data-ms-line={l.id}>
            <M>{l.tex}</M>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/** « أربط »: the question and the lines of his copy; a line he taps is tied to the question. */
function Connect({ goal, items, picked, onPick }) {
  const n = items.length;
  return (
    <div className="ms-connect" data-ms-connect={goal.id}>
      <p className="ms-connect__goal">
        {goal.label} {goal.text}
      </p>
      <svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
        {items.map((it, i) =>
          picked.includes(it.id) ? <line key={it.id} x1={100 - ((i + 0.5) * 100) / n} y1="26" x2="50" y2="0" /> : null,
        )}
      </svg>
      <div className="ms-connect__items">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`ms-chip ms-target ${picked.includes(it.id) ? 'is-on' : ''}`}
            data-ms-need={it.id}
            aria-pressed={picked.includes(it.id)}
            onClick={() => onPick(it.id)}
          >
            {it.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MissionPlayer({ situation: sit, world: depot, onClose }) {
  const { a, b } = sit.stock;
  const g = gcd(a, b);
  const [first, second] = euclid(a, b);
  const [step, setStep] = useState(0);
  const [warn, setWarn] = useState(null); // seconds left of the message before the clock starts
  const [left, setLeft] = useState(sit.minutes * 60);
  const [known, setKnown] = useState({ a: false, b: false });
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [lines, setLines] = useState([]);
  const [lit, setLit] = useState({});
  const [worked, setWorked] = useState([]);
  const [fails, setFails] = useState([]);
  const [tested, setTested] = useState([]);
  const [picked, setPicked] = useState([]);
  const [written, setWritten] = useState({});
  const [owed, setOwed] = useState(null); // a condition the depot has just shown: to add to « المعطيات »
  const [v, setV] = useState({});
  const [fact, setFact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [coins, setCoins] = useState(0);
  const [model, setModel] = useState(null);
  const [ticks, setTicks] = useState([]);
  const [idle, setIdle] = useState(false);
  const [read, setRead] = useState(false); // he read the whole exercise before anything else
  const [reading, setReading] = useState(8); // seconds before « قرأتُ » can be pressed
  const [pen, setPen] = useState(false);
  const [win, setWin] = useState(null); // the small success of a right answer: { id, pay, word }
  const [finale, setFinale] = useState(false); // the big one, at the end of the mission
  const [slips, setSlips] = useState(0);
  const [miss, setMiss] = useState(null); // his last number of lots, when it left crates: the question guides him from it // operations typed that were not the right ones (his free tries are not slips)
  const acts = useRef(0);
  const set = (patch) => setV((s) => ({ ...s, ...patch }));
  const act = () => {
    acts.current += 1;
    setIdle(false);
  };

  // the quay shows a stock's count only once he said what the number counts
  useEffect(() => {
    depot.stock?.(known.a ? a : null, known.b ? b : null);
  }, [depot, known.a, known.b, a, b]);

  // the small success leaves by itself
  useEffect(() => {
    if (!win) return undefined;
    const t = setTimeout(() => setWin(null), 1500);
    return () => clearTimeout(t);
  }, [win]);

  // the message « the clock is about to start »: 5 seconds, then the mission — nothing closes it
  useEffect(() => {
    if (warn == null) return undefined;
    if (warn <= 0) {
      setWarn(null);
      setStep(1);
      return undefined;
    }
    const t = setTimeout(() => setWarn((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [warn]);

  // the clock of the mission (it shows the end of the time; in mission 1 it stops nothing)
  useEffect(() => {
    if (step < 1 || step >= STEPS) return undefined;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // eight seconds without a gesture: what to touch shows itself again
  useEffect(() => {
    if (step < 1 || step >= STEPS) return undefined;
    const seen = acts.current;
    const t = setTimeout(() => acts.current === seen && setIdle(true), 8000);
    return () => clearTimeout(t);
  }, [step, lines.length, data.length, goals.length, picked.length, written, fact]);

  // the robot does the FIRST gesture itself, once: it underlines the first number and writes it in « المعطيات »
  useEffect(() => {
    if (step !== 1 || !read || known.a) return undefined;
    const t = setTimeout(() => tap('a', true), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, read]);

  // THE FIRST THING HE DOES IS READ THE WHOLE EXERCISE: « قرأتُ » opens only after the time a reading takes
  useEffect(() => {
    if (step !== 1 || read || reading <= 0) return undefined;
    const t = setTimeout(() => setReading((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, read, reading]);

  const write = (fresh, drop = () => false) =>
    setLines((ls) => [...ls.filter((l) => !drop(l) && !fresh.some((f) => f.id === l.id)), ...fresh]);
  const run = async (spec, opts) => {
    setBusy(true);
    await depot.run(spec, opts);
    setBusy(false);
  };
  // A RIGHT ANSWER IS CELEBRATED (owner, 2026-11-20): coins fly, a word, the robot cheers; the end of the mission more
  const bravo = (pay) => {
    setCoins((c) => c + pay);
    setWin({ id: Date.now(), pay, word: BRAVO[Math.floor(Math.random() * BRAVO.length)] });
    depot.cheer?.(false);
  };
  const next = (n, pay = 10) => {
    act();
    setStep(n);
    setV({});
    setPicked([]);
    if (n >= STEPS) {
      setCoins((c) => c + pay);
      setFinale(true);
      depot.cheer?.(true);
    } else bravo(pay);
  };
  const wrote = (id) => {
    act();
    setWritten((w) => ({ ...w, [id]: true }));
  };

  // ── step 1: the data — what does each number of the text count? ──
  const tap = (k, demo = false) => {
    act();
    setKnown((s) => ({ ...s, [k]: true }));
    setData((d) => (d.includes(k) ? d : [...d, k]));
    setFact(
      demo
        ? `الروبوت سطّر ${sit.stock[k]} في النصّ وكتبه في المعطيات. دورك: سطّر العدد الآخر.`
        : `${sit.stock[k]}: عدد صناديق ${sit.kinds[k].name}.`,
    );
  };
  // ── step 2: the goals — the two questions of the text ──
  const goal = (id) => {
    act();
    setGoals((gs) => [...gs, id]);
    setLit((s) => ({ ...s, [id]: 'goal' }));
    setFact(null);
  };

  // ── step 3: a number of lots — any; the depot deals, two lines are written ──
  const tryLots = async (n, where) => {
    act();
    const d = deal(n, sit.stock);
    setFact(null);
    await run({ lots: Array(n).fill(d.per), left: d.left, stock: sit.stock }, { cheer: d.outcome === 'most' });
    const tone = d.outcome === 'left' ? 'left' : 'ok';
    const id = d.outcome === 'left' ? 'try' : `ok-${n}`;
    write(
      d.lines.map((l, i) => ({ id: `${id}-${i}`, tex: tex(l), tone })),
      (l) => l.id.startsWith('try-'),
    );
    if (d.outcome === 'left') {
      setFails((f) => [...f.filter((x) => x.n !== n), { n, left: d.left }]);
      setLit((s) => ({ ...s, all: 'red' }));
      if (where === 'free' && !data.includes('all')) setOwed('all');
      // A WRONG TRY IS ANSWERED BY A GUIDANCE (owner, 2026-11-20): why this number left crates, then where to look —
      // a little more at each failure, and never the answer of the question
      const tip = advice(n, sit.stock, fails.filter((x) => x.n !== n).length + 1);
      const why =
        tip.which === 'both'
          ? `${n} لا يقسم ${a} ولا ${b}`
          : `${n} يقسم ${tip.which === 'a' ? b : a}، لكنّه لا يقسم ${tip.which === 'a' ? a : b}`;
      const near = tip.near && [tip.near.below, tip.near.above].filter(Boolean);
      const look = tip.small
        ? `ابدأ بعدد صغير: هل ${tip.small} يقسم ${a} و ${b}؟ جرّبه.`
        : near?.length
          ? `يوجد عدد يصلح قريب من ${n}: جرّب ${near.join(' أو ')}.`
          : `ابحث عن عدد يقسم ${a} و ${b} معًا.`;
      setMiss(n);
      setFact(`${counted(n, sit.lot.forms)}: بقي على الرصيف ${leftOf(d.left, sit.kinds)}. السبب: ${why}. ${look}`);
    } else {
      setMiss(null);
      if (where === 'free') {
        setWorked((w) => (w.includes(n) ? w : [...w, n].slice(-2)));
        if (!data.includes('same')) setOwed('same');
      }
      setLit((s) => ({ ...s, all: s.all === 'red' && !data.includes('all') ? 'red' : 'on', same: 'on' }));
      setFact(
        `${counted(n, sit.lot.forms)} متماثلة، ولا صندوق باقٍ على الرصيف: في كلّ واحدة ${d.per.a} من ${sit.kinds.a.name} و ${d.per.b} من ${sit.kinds.b.name}.`,
      );
    }
    return d;
  };
  const addData = (id) => {
    act();
    setData((d) => [...d, id]);
    setLit((s) => ({ ...s, [id]: 'on' }));
    setOwed(null);
  };

  // ── steps 4 and 7: « أربط » — what the question needs ──
  const tie = (goalId, to) => {
    const need = sit.needs[goalId];
    const miss = need.must.find((id) => !picked.includes(id));
    if (miss) {
      act();
      setSlips((x) => x + 1);
      setFact(need.without[miss]);
      return;
    }
    setFact(null);
    next(to);
  };

  // ── steps 5: one stock laid along the other — a division he POSED on his sheet ──
  const pair = async (row, id, rank = 0) => {
    act();
    const q = num(v.q);
    const r = num(v.r);
    const s = slip(row.a, row.b, q, r);
    if (s) {
      setSlips((x) => x + 1);
      setFact(
        s.kind === 'sum'
          ? `${ltr(`${row.b} × ${q} + ${r} = ${s.value}`)}، وليس ${row.a}. راجع قسمتك على ورقتك.`
          : `الباقي ${s.value} ليس أصغر من ${row.b}: يمكن وضع ${row.b} مرّة أخرى.`,
      );
      return false;
    }
    setFact(null);
    await run({
      pairing: { big: row.a, small: row.b, q: row.q, r: row.r },
      colors:
        rank % 2 === 0
          ? { big: sit.kinds.a.color, small: sit.kinds.b.color }
          : { big: sit.kinds.b.color, small: sit.kinds.a.color },
    });
    write([{ id, tex: tex(row), tone: 'key' }]);
    bravo(5);
    return true;
  };
  const test = async (n) => {
    act();
    const l = line(first.r, n);
    setFact(null);
    await run({ lots: Array(n).fill({ a: l.q, b: 0 }), left: { a: l.r, b: 0 } });
    write([{ id: `rest-${n}`, tex: tex(l), tone: l.r ? 'left' : 'ok' }]);
    setTested((t) => [...t, n]);
    setFact(
      `${counted(n, sit.lot.forms)} تقسم الصناديق الـ${NB}${first.r} التي بقيت وحدها: ${ltr(`${first.r} = ${n} × ${l.q}`)}.`,
    );
  };

  const big = num(v.n);
  const per = { a: num(v.pa), b: num(v.pb) };
  const stuck = fails.length >= 3 && !worked.length;
  const ans = step >= 7 ? g : null;
  const goalOf = (id) => sit.goals.find((x) => x.id === id);
  const items = (goalId) => [
    ...(goalId === 'content' ? [{ id: 'ans', text: `جواب (ا): ${counted(g, sit.lot.forms)}` }] : []),
    ...sit.data.filter((d) => data.includes(d.id)).map((d) => ({ id: d.id, text: d.text })),
  ];
  const rows = euclid(a, b);
  const ei = lines.filter((l) => /^e\d+$/.test(l.id)).length; // the divisions of the PGCD written so far

  const ASK = [
    '',
    !read
      ? 'اقرأ التمرين كلّه أوّلًا، حتّى آخر سؤال.'
      : known.a
        ? 'دورك: سطّر العدد الآخر في النصّ. ماذا يعدّ؟'
        : 'ما المعطيات؟ انظر: الروبوت يسطّر الأوّل.',
    'ما المطلوب؟ اضغط على كلّ سؤال في النصّ.',
    miss
      ? `العدد ${miss} ترك صناديق على الرصيف. جرّب عددًا يقسم ${a} و ${b} معًا.`
      : worked.length
        ? 'هل تستفيد دور أكثر؟ جرّب عددًا آخر، أو ابحث عن الأكبر.'
        : 'كم تشكيلة تكوّن؟ جرّب عددًا: المستودع سيوزّع الصناديق.',
    'أربط: ما الذي يحتاجه السؤال (ا) من ورقتك؟',
    ei >= rows.length
      ? 'الباقي 0: توقّفت القسمات. ما هو القاسم المشترك الأكبر؟'
      : ei === 0
        ? `القسمة الأولى: ${rows[0].a} على ${rows[0].b}.`
        : `الباقي ${rows[ei - 1].r} ليس 0: القسمة التالية، ${rows[ei].a} على ${rows[ei].b}.`,
    tested.length
      ? `هل يوجد عدد تشكيلات أكبر من ${g}؟ اكتب واحدًا.`
      : `في القسمة الأولى بقي ${first.r} صندوقًا وحدها. جرّب عليها عددًا من أعدادك التي نجحت.`,
    'أربط: وما الذي يحتاجه السؤال (ب)؟',
    `ما في كلّ تشكيلة من ${counted(g, sit.lot.forms)}؟`,
    'حرّر جوابك: جملة لكلّ سؤال.',
    'قارن ورقتك بهذا الحلّ، وصحّحها بقلمك.',
  ][step];

  // ── the mission card, then the message that the clock is about to start ──
  if (step === 0)
    return (
      <div className="ms-root ms-root--card" dir="rtl" data-ms-step={0} data-ms-warn={warn ?? 'off'}>
        {warn == null ? (
          <div className="ms-card" data-ms-card>
            <h2>{sit.title}</h2>
            <p className="ms-card__session">{sit.session}</p>
            <p>وضعية إدماجية، كما تأتي في الامتحان. ستحلّها كما في الامتحان: بورقة وقلم. المستودع يريك ما تكتبه.</p>
            <p className="ms-card__need">
              <PenLine size={24} aria-hidden="true" /> ورقة · قلم
              <Clock size={24} aria-hidden="true" /> {sit.minutes} دقيقة
            </p>
            <button type="button" className="ms-btn ms-btn--go ms-target" data-ms-start onClick={() => setWarn(WARN)}>
              ورقتي وقلمي أمامي — أبدأ
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" className="ms-btn ms-btn--ghost" data-ms-close onClick={onClose}>
              ليس الآن
            </button>
          </div>
        ) : (
          <div className="ms-card ms-card--warn" data-ms-clock-warn={warn} role="status">
            <Clock size={54} aria-hidden="true" />
            <h2>الساعة ستبدأ الآن</h2>
            <p>أمامك {sit.minutes} دقيقة. جهّز ورقتك وقلمك.</p>
            <b className="ms-card__count">{warn}</b>
          </div>
        )}
      </div>
    );

  return (
    <div
      className={`ms-root ${idle ? 'is-idle' : ''} ${step === 1 && !read ? 'is-reading' : ''}`}
      dir="rtl"
      data-ms-step={step}
      data-ms-busy={busy}
      data-ms-read={read}
    >
      <header className="ms-head">
        <b className="ms-count" data-ms-progress={`${Math.min(step, STEPS)}/${STEPS}`}>
          الخطوة {Math.min(step, STEPS)} من {STEPS}
        </b>
        <h2 data-ms-ask>{ASK}</h2>
        <span className={`ms-clock ${left === 0 ? 'is-over' : ''}`} dir="ltr" data-ms-clock={left}>
          <Clock size={20} aria-hidden="true" />
          {clock(left)}
        </span>
        <button
          type="button"
          className={`ms-tool ${pen ? 'is-on' : ''}`}
          data-ms-pen-open
          aria-pressed={pen}
          onClick={() => setPen((x) => !x)}
        >
          <PenLine size={20} aria-hidden="true" />
          قلم
        </button>
        <span className="ms-coins" data-ms-coins={coins}>
          <Coins size={20} aria-hidden="true" />
          {coins}
        </span>
        <button type="button" className="ms-x" aria-label="خروج" data-ms-close onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="ms-body">
        <Paper
          sit={sit}
          lit={lit}
          known={known}
          goals={goals}
          step={step === 1 && !read ? 0 : step}
          onTap={(k) => tap(k)}
          onGoal={goal}
        />
        <div className="ms-stage">
          {(step === 4 || step === 7) && (
            <Connect
              goal={goalOf(step === 4 ? 'most' : 'content')}
              items={items(step === 4 ? 'most' : 'content')}
              picked={picked}
              onPick={(id) => {
                act();
                setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
              }}
            />
          )}
          {step === 10 && (
            <div className="ms-model" data-ms-copy>
              <h3>{sit.session} — الحلّ</h3>
              <p>
                (ا) عدد التشكيلات يقسم {a} و {b}، وهو أكبر ما يمكن: هو قاسمهما المشترك الأكبر.
              </p>
              <p dir="ltr">
                <M>{`${tex(first)} \\qquad ${tex(second)}`}</M>
              </p>
              <p dir="ltr">
                <M>{`\\mathrm{PGCD}(${a} ; ${b}) = ${g}`}</M>
              </p>
              <p>أكبر عدد من التشكيلات هو {counted(g, sit.lot.forms)}.</p>
              <p dir="ltr">
                <M>{`${a} \\div ${g} = ${a / g} \\qquad ${b} \\div ${g} = ${b / g}`}</M>
              </p>
              <p>
                (ب) في كلّ تشكيلة {counted(a / g, CRATES)} من {sit.kinds.a.name} و{counted(b / g, CRATES)} من{' '}
                {sit.kinds.b.name}.
              </p>
            </div>
          )}
          {fact && (
            <p className="ms-fact" data-ms-fact>
              {fact}
            </p>
          )}
          {stuck && step === 3 && (
            <p className="ms-fact ms-fact--calm" data-ms-tries>
              محاولاتك: {fails.map((f) => `${f.n} ← بقي ${f.left.a} و${f.left.b}`).join(' ؛ ')}.
            </p>
          )}

          <div className="ms-act" data-ms-act>
            {step === 1 && read && known.a && known.b && (
              <Sheet
                id="data"
                written={written.data}
                onWritten={() => {
                  wrote('data');
                  setFact(null);
                  next(2);
                }}
                text={`المعطيات: ${sit.data
                  .filter((d) => data.includes(d.id))
                  .map((d) => d.text)
                  .join('، ')}.`}
              />
            )}
            {step === 1 && !read && (
              <>
                {reading > 0 && <span className="ms-hint">خذ وقتك في القراءة…</span>}
                {reading <= 0 && (
                  <button
                    type="button"
                    className="ms-btn ms-btn--go ms-target"
                    data-ms-read-done
                    onClick={() => {
                      act();
                      setRead(true);
                    }}
                  >
                    <Check size={18} aria-hidden="true" />
                    قرأتُ التمرين كلّه
                  </button>
                )}
              </>
            )}
            {step === 1 && read && !(known.a && known.b) && (
              <span className="ms-hint">الأعداد في نصّ الامتحان، على اليمين.</span>
            )}
            {step === 2 && goals.length < sit.goals.length && (
              <span className="ms-hint">السؤالان في آخر النصّ، على اليمين.</span>
            )}
            {step === 2 && goals.length === sit.goals.length && (
              <Sheet
                id="goals"
                written={written.goals}
                onWritten={() => {
                  wrote('goals');
                  next(3);
                }}
                text={`المطلوب: ${sit.goals.map((x) => `${x.label} ${x.text}`).join(' ؛ ')}.`}
              />
            )}
            {step === 3 && owed && (
              <Sheet
                id={`owed-${owed}`}
                written={false}
                onWritten={() => addData(owed)}
                text={`أضف إلى معطياتك: « ${sit.data.find((d) => d.id === owed).text} ».`}
              />
            )}
            {step === 3 && !owed && (
              <>
                <span>عدد التشكيلات:</span>
                <Box
                  value={v.n}
                  onChange={(x) => set({ n: x })}
                  label="عدد التشكيلات"
                  name="n"
                  onEnter={() => big && !busy && tryLots(big, 'free')}
                />
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-try
                  disabled={!big || big > a || busy}
                  onClick={() => tryLots(big, 'free')}
                >
                  <Play size={18} aria-hidden="true" />
                  وزّع
                </button>
                {worked.some((n) => n > 1) && data.includes('all') && data.includes('same') && (
                  <button
                    type="button"
                    className="ms-btn ms-btn--go ms-target"
                    data-ms-more
                    disabled={busy}
                    onClick={() => next(4)}
                  >
                    أبحث عن الأكبر
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                )}
              </>
            )}
            {(step === 4 || step === 7) && (
              <Sheet
                id={`tie-${step}`}
                written={written[`tie-${step}`]}
                onWritten={() => wrote(`tie-${step}`)}
                text="ارسم سهمًا من كلّ معطى يحتاجه السؤال إلى السؤال."
              >
                <span className="ms-hint">اضغط على ما يحتاجه السؤال.</span>
                <button
                  type="button"
                  className="ms-btn ms-btn--go"
                  data-ms-tie
                  disabled={!picked.length}
                  onClick={() => tie(step === 4 ? 'most' : 'content', step === 4 ? 5 : 8)}
                >
                  ربطتُ
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
              </Sheet>
            )}
            {step === 5 && ei < rows.length && (
              <Sheet
                key={`e${ei}`}
                id={`e${ei}`}
                written={written[`e${ei}`]}
                onWritten={() => wrote(`e${ei}`)}
                text={`ضع القسمة الإقليدية للعدد ${rows[ei].a} على ${rows[ei].b}، واكتب: ${ltr(`${rows[ei].a} = ${rows[ei].b} × … + …`)}`}
              >
                <span className="ms-shape" dir="ltr">
                  <M>{`${rows[ei].a} = ${rows[ei].b} \\times`}</M>
                  <Box value={v.q} onChange={(x) => set({ q: x })} label="حاصل القسمة" name="q" w={2} />
                  <M>+</M>
                  <Box value={v.r} onChange={(x) => set({ r: x })} label="الباقي" name="r" w={3} />
                </span>
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-pair
                  disabled={num(v.q) == null || num(v.r) == null || busy}
                  onClick={async () => {
                    const row = rows[ei];
                    if (!(await pair(row, `e${ei}`, ei))) return;
                    setV({});
                    setFact(
                      row.r
                        ? `الباقي ${row.r} ليس 0: نواصل. القسمة التالية: ${row.b} على ${row.r}.`
                        : `الباقي 0: نتوقّف. انظر إلى الباقي الذي قبله.`,
                    );
                  }}
                >
                  <Play size={18} aria-hidden="true" />
                  تحقّق في المستودع
                </button>
              </Sheet>
            )}
            {step === 5 && ei >= rows.length && (
              <Sheet
                id="pgcd"
                written={written.pgcd}
                onWritten={() => wrote('pgcd')}
                text={`اكتب نتيجة القسمات: ${ltr(`PGCD(${a} ; ${b}) = …`)}`}
              >
                <span className="ms-shape" dir="ltr">
                  <M>{`\\mathrm{PGCD}(${a} ; ${b}) =`}</M>
                  <Box value={v.g} onChange={(x) => set({ g: x })} label="القاسم المشترك الأكبر" name="g" w={3} />
                </span>
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-pgcd
                  disabled={num(v.g) == null}
                  onClick={() => {
                    act();
                    const x = num(v.g);
                    if (x === g) {
                      write([{ id: 'name', tex: `\\mathrm{PGCD}(${a} ; ${b}) = ${g}`, tone: 'key' }]);
                      setFact(`آخر باقٍ غير معدوم في قسماتك هو ${g}.`);
                      next(6);
                    } else if (x === 0) setFact('0 هو الباقي الأخير. أيّ باقٍ جاء قبله؟');
                    else if (a % x || b % x)
                      setFact(`${ltr(tex(line(a % x ? a : b, x)))}: العدد ${x} لا يقسم العددين معًا.`);
                    else setFact(`${x} يقسم العددين، نعم. انظر إلى آخر باقٍ غير معدوم في قسماتك.`);
                  }}
                >
                  <Check size={18} aria-hidden="true" />
                  أكتبه في ورقتي
                </button>
                <button type="button" className="ms-btn ms-btn--ghost" data-ms-model onClick={() => setModel(rows[0])}>
                  <PenLine size={18} aria-hidden="true" />
                  قارن قسمتك
                </button>
              </Sheet>
            )}
            {step === 6 && !tested.length && (
              <>
                {worked
                  .filter((n) => n > 1)
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="ms-btn ms-btn--ghost ms-target"
                      data-ms-test={n}
                      disabled={busy}
                      onClick={() => test(n)}
                    >
                      جرّب {n}
                    </button>
                  ))}
              </>
            )}
            {step === 6 && tested.length > 0 && (
              <Sheet
                id="attack"
                written={written.attack}
                onWritten={() => wrote('attack')}
                text={`اكتب لماذا لا يصلح عدد أكبر من ${g}.`}
              >
                <span>عدد أكبر من {g}:</span>
                <Box value={v.n} onChange={(x) => set({ n: x })} label="عدد أكبر" name="n" />
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-attack
                  disabled={!big || big <= g || big > a || busy}
                  onClick={async () => {
                    const d = await tryLots(big, 'attack');
                    write([{ id: 'attack', tex: `${first.r} = ${big} \\times 0 + ${first.r}`, tone: 'left' }]);
                    setLit((s) => ({ ...s, all: 'on', most: 'on' }));
                    setFact(
                      `${counted(big, sit.lot.forms)}: بقي ${leftOf(d.left, sit.kinds)}. والعدد ${big} لا يقسم الـ${NB}${first.r}: أكبر عدد ينجح هو ${first.r}.`,
                    );
                    next(7);
                  }}
                >
                  <Play size={18} aria-hidden="true" />
                  وزّع
                </button>
              </Sheet>
            )}
            {step === 8 && (
              <Sheet
                id="content"
                written={written.content}
                onWritten={() => wrote('content')}
                text={`احسب: ${ltr(`${a} ÷ ${g}`)} ثمّ ${ltr(`${b} ÷ ${g}`)}.`}
              >
                <span>
                  <Box
                    value={v.pa}
                    onChange={(x) => set({ pa: x })}
                    label={`صناديق ${sit.kinds.a.name}`}
                    name="pa"
                    w={3}
                  />
                  صندوقًا من {sit.kinds.a.name}
                </span>
                <span>
                  <Box
                    value={v.pb}
                    onChange={(x) => set({ pb: x })}
                    label={`صناديق ${sit.kinds.b.name}`}
                    name="pb"
                    w={3}
                  />
                  صندوقًا من {sit.kinds.b.name}
                </span>
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-fill
                  disabled={!per.a || !per.b || busy}
                  onClick={async () => {
                    act();
                    const f = fill(g, per, sit.stock);
                    setFact(null);
                    await run(
                      f.outcome === 'short'
                        ? { lots: Array(f.full).fill(per), left: { a: 0, b: 0 }, empty: f.empty, stock: sit.stock }
                        : { lots: Array(g).fill(per), left: f.left, stock: sit.stock },
                      { ship: f.outcome === 'exact', cheer: f.outcome === 'exact' },
                    );
                    if (f.outcome === 'short')
                      setFact(
                        `امتلأت ${counted(f.full, sit.lot.forms)} ثمّ انتهى المحصول: ${ltr(`${a} = ${per.a} × ${Math.floor(a / per.a)} + ${a % per.a}`)}.`,
                      );
                    else if (f.outcome === 'left')
                      setFact(
                        `${ltr(`${g} × ${per.a} = ${g * per.a}`)} و ${ltr(`${g} × ${per.b} = ${g * per.b}`)}: بقي على الرصيف ${leftOf(f.left, sit.kinds)}.`,
                      );
                    else {
                      write([
                        { id: 'pa', tex: `${a} \\div ${g} = ${per.a}`, tone: 'key' },
                        { id: 'pb', tex: `${b} \\div ${g} = ${per.b}`, tone: 'key' },
                      ]);
                      setLit((s) => ({ ...s, content: 'on' }));
                      setFact(
                        `${counted(g, sit.home.forms)} تستلم كلّ واحدة ${counted(per.a, CRATES)} من ${sit.kinds.a.name} و${counted(per.b, CRATES)} من ${sit.kinds.b.name}.`,
                      );
                      next(9);
                    }
                  }}
                >
                  <Play size={18} aria-hidden="true" />
                  املأ التشكيلات
                </button>
              </Sheet>
            )}
            {step === 9 && (
              <Sheet
                id="answers"
                written={written.answers}
                onWritten={() => wrote('answers')}
                text="اكتب جملة جواب لكلّ سؤال، بعددها ووحدتها. ثمّ اكتب لماذا هذا العدد."
              >
                <span className="ms-sentence">
                  العدد
                  <Box value={v.sn} onChange={(x) => set({ sn: x })} label="العدد" name="sn" w={3} />
                  يقسم
                  <Box value={v.sa} onChange={(x) => set({ sa: x })} label="العدد الأوّل" name="sa" />
                  و
                  <Box value={v.sb} onChange={(x) => set({ sb: x })} label="العدد الثاني" name="sb" w={3} />
                  وهو الأكبر: إذن هو
                  {sit.names.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="ms-btn ms-btn--ghost"
                      data-ms-name={n.id}
                      onClick={() => {
                        act();
                        const whole =
                          num(v.sn) === g && [num(v.sa), num(v.sb)].sort((x, y) => y - x).join() === `${a},${b}`;
                        if (!whole) setFact('أكمل الأعداد أوّلًا: أيّ عدد وجدتَ، ولأيّ عددين؟');
                        else if (!n.right) setFact(n.said);
                        else {
                          setFact(null);
                          next(10, 20);
                        }
                      }}
                    >
                      {n.text}
                    </button>
                  ))}
                  للعددين.
                </span>
              </Sheet>
            )}
            {step === 10 && (
              <div className="ms-marker" data-ms-marker={ticks.length}>
                <b>ماذا في ورقتك؟</b>
                {sit.marker.map((m, i) => (
                  <label key={m}>
                    <input
                      type="checkbox"
                      checked={ticks.includes(i)}
                      data-ms-tick={i}
                      onChange={() => setTicks((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))}
                    />
                    {m}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <Copy sit={sit} data={data} goals={goals} lines={lines} ans={ans} keep={step < 7 ? 2 : 0} />
      </div>
      {win && !finale && (
        <div key={win.id} className="ms-win" data-ms-win={win.pay} aria-live="polite">
          <b>{win.word}</b>
          <span dir="ltr">
            +{win.pay}
            <Coins size={26} aria-hidden="true" />
          </span>
        </div>
      )}
      {finale && (
        <div className="ms-finale" data-ms-finale role="status">
          <div className="ms-confetti" aria-hidden="true">
            {Array.from({ length: 36 }, (_, i) => (
              <i
                key={i}
                style={{
                  '--x': `${(i * 37) % 100}%`,
                  '--d': `${(i % 9) * 0.12}s`,
                  '--c': ['#fbbf24', '#34d399', '#a5f3fc', '#f472b6'][i % 4],
                }}
              />
            ))}
          </div>
          <div className="ms-finale__card">
            <Trophy size={76} aria-hidden="true" />
            <h2>أنهيتَ المهمّة!</h2>
            <p className="ms-finale__stars" data-ms-stars={slips <= 1 ? 3 : slips <= 3 ? 2 : 1}>
              {[0, 1, 2].map((i) => (
                <Star
                  key={i}
                  size={46}
                  className={i < (slips <= 1 ? 3 : slips <= 3 ? 2 : 1) ? 'is-on' : ''}
                  aria-hidden="true"
                />
              ))}
            </p>
            <p>حللتَ وضعية إدماجية من {sit.session}، بورقتك وقلمك.</p>
            <p className="ms-finale__coins">
              <Coins size={30} aria-hidden="true" /> {coins} قطعة
              <Clock size={30} aria-hidden="true" /> بقي {clock(left)}
            </p>
            <button
              type="button"
              className="ms-btn ms-btn--go ms-target"
              data-ms-finale-next
              onClick={() => setFinale(false)}
            >
              أقارن ورقتي بالحلّ
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      <Ink open={pen} onClose={() => setPen(false)} />
      {model && <PaperModel a={model.a} b={model.b} own onClose={() => setModel(null)} />}
    </div>
  );
}
