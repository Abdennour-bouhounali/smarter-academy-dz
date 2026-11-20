/**
 * AN INTEGRATION MISSION, played in the 3D depot (`docs/reports/INTEGRATION_LESSON_PLAN.md` §8 — the design of the
 * council of 2026-11-20; PROTOTYPE of mission 1, the scene « lots »).
 *
 * THE RULE: ONE SENTENCE OF THE EXAM TEXT ↔ ONE LINE OF NUMBERS. The screen never changes: the exam paper with its
 * numbers (a phrase lights when his act has produced its line), the depot, ONE instruction — the question of the
 * moment —, ONE thing to touch, and a notebook that keeps every line: at the end it is his copy. ONE gesture all along:
 * he types a number or fills an operation in its shape; the depot carries it out (`world.run`), a line is written.
 * Nothing is ever « wrong »: the depot deals what he typed and the line says what is left.
 *
 * The situation is DATA (`situation`); this file names no lesson. Not built yet: the save, hearts, missions 2 and 3.
 */
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Coins, Play, X } from 'lucide-react';
import { M } from '../kit/parts';
import { deal, euclid, fill, gcd, line, slip } from './lots';
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
const num = (v) => (/^\d+$/.test(String(v ?? '').trim()) ? Number(v) : null);
const tex = (l) => `${l.a} = ${l.b} \\times ${l.q} + ${l.r}`;
const STEPS = 7;

function Box({ value, onChange, label, name, w = 4, onEnter }) {
  return (
    <input
      className="ms-in"
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

/** The exam paper: its text whole, the phrases that light, and (step 1) its numbers to tap. */
function Paper({ sit, lit, known, step, onTap }) {
  return (
    <aside className="ms-paper" data-ms-paper>
      <h3>{sit.session}</h3>
      <p>
        {sit.paper.map((p, i) => {
          const el = p.stock ? (
            <button
              key={i}
              type="button"
              className={`ms-num ${known[p.stock] ? 'is-known' : step === 0 ? 'is-ask' : ''}`}
              data-ms-tap={p.stock}
              disabled={step !== 0 || known[p.stock]}
              onClick={() => onTap(p.stock)}
            >
              {p.t}
            </button>
          ) : p.id ? (
            <mark
              key={i}
              className={`ms-phrase ${lit[p.id] ? `is-${lit[p.id]}` : ''}`}
              data-ms-lit={`${p.id}:${lit[p.id] ?? 'off'}`}
            >
              {p.t}
            </mark>
          ) : (
            <span key={i}>{p.t}</span>
          );
          return p.br ? [el, <br key={`b${i}`} />] : el;
        })}
      </p>
    </aside>
  );
}

/** The notebook: every line the depot has written for him, the newest last — at the end, his copy. */
function Notebook({ lines }) {
  return (
    <aside className="ms-book" data-ms-book={lines.length}>
      <h3>كرّاسي</h3>
      <ol dir="ltr">
        {lines.map((l) => (
          <li key={l.id} className={`is-${l.tone ?? 'plain'}`} data-ms-line={l.id}>
            {l.text ? <span dir="rtl">{l.text}</span> : <M>{l.tex}</M>}
          </li>
        ))}
      </ol>
    </aside>
  );
}

export default function MissionPlayer({ situation: sit, world: depot, onClose }) {
  const { a, b } = sit.stock;
  const g = gcd(a, b);
  const [first, second] = euclid(a, b);
  const [step, setStep] = useState(0);
  const [known, setKnown] = useState({ a: false, b: false });
  const [lines, setLines] = useState([]);
  const [lit, setLit] = useState({});
  const [worked, setWorked] = useState([]);
  const [fails, setFails] = useState([]);
  const [tested, setTested] = useState([]);
  const [paired, setPaired] = useState(false);
  const [v, setV] = useState({});
  const [fact, setFact] = useState(null);
  const [busy, setBusy] = useState(false);
  const [coins, setCoins] = useState(0);
  const [name, setName] = useState(null);
  const set = (patch) => setV((s) => ({ ...s, ...patch }));

  // the quay shows a stock's count only once he said what the number counts
  useEffect(() => {
    depot.stock?.(known.a ? a : null, known.b ? b : null);
  }, [depot, known.a, known.b, a, b]);

  const write = (fresh, drop = () => false) =>
    setLines((ls) => [...ls.filter((l) => !drop(l) && !fresh.some((f) => f.id === l.id)), ...fresh]);
  const run = async (spec, opts) => {
    setBusy(true);
    await depot.run(spec, opts);
    setBusy(false);
  };
  const next = (n, pay = 10) => {
    setStep(n);
    setCoins((c) => c + pay);
    setV({});
  };

  // ── step 1: what does each number of the text count? ──
  const tap = (k) => {
    const now = { ...known, [k]: true };
    setKnown(now);
    write([{ id: `stock-${k}`, text: `${sit.stock[k]} ${sit.kinds[k].crates}`, tone: 'plain' }]);
    setFact(`${sit.stock[k]}: عدد صناديق ${sit.kinds[k].name}.`);
    if (now.a && now.b) next(1);
  };

  // ── steps 2–3: a number of lots — any; the depot deals, two lines are written ──
  const tryLots = async (n, where) => {
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
      setFact(`${counted(n, sit.lot.forms)}: بقي على الرصيف ${leftOf(d.left, sit.kinds)}.`);
    } else {
      if (where === 'free') setWorked((w) => (w.includes(n) ? w : [...w, n].slice(-2)));
      setLit((s) => ({ ...s, all: 'on', same: 'on' }));
      setFact(
        `${counted(n, sit.lot.forms)} متماثلة، ولا صندوق باقٍ على الرصيف: في كلّ واحدة ${d.per.a} من ${sit.kinds.a.name} و ${d.per.b} من ${sit.kinds.b.name}.`,
      );
    }
    return d;
  };

  // ── step 4: the second stock laid against the first — Euclid's first line, in the depot ──
  const pair = async (row, id) => {
    const q = num(v.q);
    const r = num(v.r);
    const s = slip(row.a, row.b, q, r);
    if (s) {
      setFact(
        s.kind === 'sum'
          ? `${row.b} × ${q} + ${r} = ${s.value}، وليس ${row.a}.`
          : `الباقي ${s.value} ليس أصغر من ${row.b}: يمكن وضع ${row.b} مرّة أخرى.`,
      );
      return false;
    }
    setFact(null);
    await run({
      pairing: { big: row.a, small: row.b, q: row.q, r: row.r },
      colors:
        id === 'e0'
          ? { big: sit.kinds.a.color, small: sit.kinds.b.color }
          : { big: sit.kinds.b.color, small: sit.kinds.a.color },
    });
    write([{ id, tex: tex(row), tone: 'key' }]);
    return true;
  };

  // ── step 5: his numbers that worked, tried on the crates left alone ──
  const test = async (n) => {
    const l = line(first.r, n);
    setFact(null);
    await run({ lots: Array(n).fill({ a: l.q, b: 0 }), left: { a: l.r, b: 0 } });
    write([{ id: `rest-${n}`, tex: tex(l), tone: l.r ? 'left' : 'ok' }]);
    setTested((t) => [...t, n]);
    setFact(
      `${counted(n, sit.lot.forms)} تقسم الصناديق الـ${NB}${first.r} التي بقيت وحدها: ${first.r} = ${n} × ${l.q}.`,
    );
  };

  const big = num(v.n);
  const per = { a: num(v.pa), b: num(v.pb) };
  const stuck = fails.length >= 3 && !worked.length;

  const ASK = [
    'اضغط على كلّ عدد في النصّ: ماذا يعدّ؟',
    worked.length
      ? 'هل تستفيد دور أكثر؟ جرّب عددًا آخر، أو ابحث عن الأكبر.'
      : 'كم تشكيلة تكوّن؟ اكتب عددًا: المستودع سيوزّع الصناديق.',
    `ضع صناديق ${sit.kinds.b.name} بجانب صناديق ${sit.kinds.a.name}: كم مرّة؟ وكم صندوقًا يبقى وحده؟`,
    paired
      ? `هل يوجد عدد تشكيلات أكبر من ${first.r}؟ اكتب واحدًا.`
      : tested.length
        ? `والعدد ${first.r} نفسه: هل يقسم ${sit.kinds.b.name}؟`
        : `${first.r} صندوقًا بقيت وحدها. جرّب عليها عددًا من أعدادك التي نجحت.`,
    `ما في كلّ تشكيلة من ${counted(g, sit.lot.forms)}؟`,
    'أكمل جملة ورقتك.',
    'هذه ورقتك: كلّ سطر فيها كتبتَه أنت.',
  ][Math.min(step, 6)];

  return (
    <div className="ms-root" dir="rtl" data-ms-step={step} data-ms-busy={busy}>
      <header className="ms-head">
        <b className="ms-count" dir="ltr" data-ms-progress>
          {Math.min(step + 1, STEPS)}
          {'\u00a0/\u00a0'}
          {STEPS}
        </b>
        <h2 data-ms-ask>{ASK}</h2>
        <span className="ms-coins" data-ms-coins={coins}>
          <Coins size={18} aria-hidden="true" />
          {coins}
        </span>
        <button type="button" className="ms-x" aria-label="خروج" data-ms-close onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="ms-body">
        <Paper sit={sit} lit={lit} known={known} step={step} onTap={tap} />
        <div className="ms-stage">
          {step === 6 && (
            <div className="ms-copy" data-ms-copy>
              <h3>{sit.session} — الحلّ</h3>
              <p>
                (ا) نبحث عن أكبر عدد يقسم {a} و {b}:
              </p>
              <p dir="ltr">
                <M>{tex(first)}</M>
              </p>
              <p dir="ltr">
                <M>{tex(second)}</M>
              </p>
              <p dir="ltr">
                <M>{`\\mathrm{PGCD}(${a} ; ${b}) = ${g}`}</M>
              </p>
              <p>أكبر عدد من التشكيلات هو {counted(g, sit.lot.forms)}.</p>
              <p dir="ltr">
                <M>{`${a} = ${g} \\times ${a / g} \\qquad ${b} = ${g} \\times ${b / g}`}</M>
              </p>
              <p>
                (ب) في كلّ تشكيلة {counted(a / g, CRATES)} من {sit.kinds.a.name} و{counted(b / g, CRATES)} من{' '}
                {sit.kinds.b.name}.
              </p>
            </div>
          )}
          {fact && step < 6 && (
            <p className="ms-fact" data-ms-fact>
              {fact}
            </p>
          )}
          {stuck && step === 1 && (
            <p className="ms-fact ms-fact--calm" data-ms-tries>
              محاولاتك: {fails.map((f) => `${f.n} ← بقي ${f.left.a} و${f.left.b}`).join(' ؛ ')}.
            </p>
          )}
          <div className="ms-act" data-ms-act>
            {step === 0 && <span className="ms-hint">الأعداد في النصّ، على اليمين.</span>}
            {step === 1 && (
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
                {worked.some((n) => n > 1) && (
                  <button
                    type="button"
                    className="ms-btn ms-btn--go"
                    data-ms-more
                    disabled={busy}
                    onClick={() => next(2)}
                  >
                    أبحث عن الأكبر
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <span className="ms-shape" dir="ltr">
                  <M>{`${first.a} = ${first.b} \\times`}</M>
                  <Box value={v.q} onChange={(x) => set({ q: x })} label="عدد المرّات" name="q" w={2} />
                  <M>+</M>
                  <Box value={v.r} onChange={(x) => set({ r: x })} label="ما يبقى وحده" name="r" w={3} />
                </span>
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-pair
                  disabled={num(v.q) == null || num(v.r) == null || busy}
                  onClick={async () => {
                    if (!(await pair(first, 'e0'))) return;
                    setFact(
                      `${sit.kinds.b.name} وُضع ${first.q === 2 ? 'مرّتين' : `${first.q} مرّات`} بجانب ${sit.kinds.a.name}: ${first.r} صندوقًا من ${sit.kinds.a.name} بقيت وحدها.`,
                    );
                    next(3);
                  }}
                >
                  <Play size={18} aria-hidden="true" />
                  ضعها
                </button>
              </>
            )}
            {step === 3 && !paired && (
              <>
                {worked
                  .filter((n) => n > 1 && !tested.includes(n))
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="ms-btn ms-btn--ghost"
                      data-ms-test={n}
                      disabled={busy}
                      onClick={() => test(n)}
                    >
                      جرّب {n}
                    </button>
                  ))}
                {tested.length > 0 && (
                  <>
                    <span className="ms-shape" dir="ltr">
                      <M>{`${second.a} = ${second.b} \\times`}</M>
                      <Box value={v.q} onChange={(x) => set({ q: x })} label="عدد المرّات" name="q" w={2} />
                      <M>+</M>
                      <Box value={v.r} onChange={(x) => set({ r: x })} label="ما يبقى وحده" name="r" w={3} />
                    </span>
                    <button
                      type="button"
                      className="ms-btn"
                      data-ms-pair
                      disabled={num(v.q) == null || num(v.r) == null || busy}
                      onClick={async () => {
                        if (!(await pair(second, 'e1'))) return;
                        setPaired(true);
                        setLit((s) => ({ ...s, most: 'on' }));
                        setV({});
                        setFact(
                          `${second.b} يقسم ${second.a} ولا يبقى شيء. كلّ عدد تشكيلات ينجح يقسم الـ${NB}${first.r}: فلا عدد ينجح أكبر من ${first.r}.`,
                        );
                      }}
                    >
                      <Play size={18} aria-hidden="true" />
                      ضعها
                    </button>
                  </>
                )}
              </>
            )}
            {step === 3 && paired && (
              <>
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
                    next(4);
                  }}
                >
                  <Play size={18} aria-hidden="true" />
                  وزّع
                </button>
              </>
            )}
            {step === 4 && (
              <>
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
                        `امتلأت ${counted(f.full, sit.lot.forms)} ثمّ انتهى المحصول: ${a} = ${per.a} × ${Math.floor(a / per.a)} + ${a % per.a}.`,
                      );
                    else if (f.outcome === 'left')
                      setFact(
                        `${g} × ${per.a} = ${g * per.a} و ${g} × ${per.b} = ${g * per.b}: بقي على الرصيف ${f.left.a} و${f.left.b}.`,
                      );
                    else {
                      write([
                        { id: 'pa', tex: `${a} = ${g} \\times ${per.a}`, tone: 'key' },
                        { id: 'pb', tex: `${b} = ${g} \\times ${per.b}`, tone: 'key' },
                      ]);
                      setLit((s) => ({ ...s, content: 'on' }));
                      setFact(
                        `${counted(g, sit.home.forms)} تستلم كلّ واحدة ${counted(per.a, CRATES)} من ${sit.kinds.a.name} و${counted(per.b, CRATES)} من ${sit.kinds.b.name}.`,
                      );
                      next(5);
                    }
                  }}
                >
                  <Play size={18} aria-hidden="true" />
                  املأ التشكيلات
                </button>
              </>
            )}
            {step === 5 && (
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
                    className={`ms-btn ms-btn--ghost ${name === n.id ? 'is-on' : ''}`}
                    data-ms-name={n.id}
                    onClick={() => {
                      setName(n.id);
                      const whole =
                        num(v.sn) === g && [num(v.sa), num(v.sb)].sort((x, y) => y - x).join() === `${a},${b}`;
                      if (!whole) setFact(`أكمل الأعداد أوّلًا: أيّ عدد وجدتَ، ولأيّ عددين؟`);
                      else if (!n.right) setFact(n.said);
                      else {
                        write([{ id: 'name', tex: `${n.tex}(${a} ; ${b}) = ${g}`, tone: 'key' }]);
                        setFact(null);
                        next(6, 20);
                      }
                    }}
                  >
                    {n.text}
                  </button>
                ))}
                للعددين.
              </span>
            )}
            {step === 6 && (
              <span className="ms-hint">
                <Check size={18} aria-hidden="true" /> أنهيتَ المهمّة: {coins} قطعة.
              </span>
            )}
          </div>
        </div>
        <Notebook lines={lines} />
      </div>
    </div>
  );
}
