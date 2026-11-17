/**
 * « مصهر القاعدة » — the rule forge of island « المرايا » (2026-11-18; logic: ruleForge.js; contract GAME_WORLD.md §2sexies).
 * The student does not receive the rule on a tablet: he predicts, writes HIS rule with two tiles, and the MIRROR of the
 * island tests it — first on the bridges of his own crossing, then on a new gap chosen to break it. A rule that survives
 * becomes his key. The verdict is always a bridge that holds or crumbles in front of him, never « wrong ».
 * One screen, nothing scrolls (designed 1280 × 720, zoomed to the window).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Hammer, Sparkles, Bot } from 'lucide-react';
import MathText from '../../components/MathText';
import {
  QUANTITIES,
  CONDITIONS,
  evidence,
  runOnEvidence,
  attacks,
  predictCases,
  streak,
  PREDICT_NEED,
  nudge,
  discoveryLevel,
  keyCase,
  keyRight,
  ruleSays,
  ruleText,
  explain,
  isTheRule,
  complete,
  sameCase,
  EVIDENCE_MAX,
} from './ruleForge';
import './ruleForge.css';

const L = {
  title: 'مرآة جزيرة المرايا',
  sub: 'اصنع مفتاحك: قاعدة تصمد أمام المرآة.',
  steps: { predict: 'تنبّأ', build: 'اكتب قاعدتك', test: 'المرآة تختبرها', seal: 'اختم مفتاحك' },
  log: 'سجلّ عبورك',
  cells: (a) => `${a} خانة`,
  plank: (b) => `لوح ${b}`,
  held: 'ثبت',
  fell: (r) => (r === 1 ? 'انهار: بقيت خانة' : r === 2 ? 'انهار: بقيت خانتان' : `انهار: بقيت ${r} خانات`),
  ask: (a, b) => `هوّة من ${a} خانة، ولوح طوله ${b}. هل يثبت الجسر؟`,
  holds: 'يثبت',
  falls: 'ينهار',
  right: 'توقّعك صحيح!',
  miss: 'توقّعك لم يصب هذه المرّة.',
  factHeld: 'لم تبقَ أيّ خانة: الجسر ثبت.',
  factFell: (r) =>
    r === 1 ? 'بقيت خانة واحدة: الجسر انهار.' : r === 2 ? 'بقيت خانتان: الجسر انهار.' : `بقيت ${r} خانات: الجسر انهار.`,
  next: 'جسر آخر',
  toBuild: 'أكتب قاعدتي',
  inHead: 'ثلاثة توقّعات صحيحة متتالية: القاعدة في رأسك. اكتبها الآن.',
  timeToWrite: 'حان وقت كتابة قاعدتك: المرآة ستختبرها.',
  frame: 'يثبت الجسر عندما:',
  look: 'ماذا أقرأ؟',
  must: 'كيف يجب أن يكون؟',
  test: 'اختبر قاعدتي',
  buildLead: 'اختر بطاقتين. المرآة لا تصدّق أحدًا: ستجرّب قاعدتك على جسورك.',
  testing: 'المرآة تمرّ على جسورك واحدًا واحدًا…',
  says: (yes) => `قاعدتك: ${yes ? 'يثبت' : 'ينهار'}`,
  refuted: (m) =>
    `قاعدتك تقول إنّ جسر ${m.a} باللوح ${m.b} ${m.says ? 'يثبت' : 'ينهار'} — لكنّك رأيته ${m.held ? 'يثبت' : 'ينهار'}.`,
  fix: 'أصلح قاعدتي',
  agreed: 'قاعدتك توافق كلّ الجسور التي رأيتَها. الآن المرآة تتحدّاها بجسر جديد.',
  dare: 'ليكن!',
  attack: (a, b) => `المرآة تتحدّى قاعدتك: هوّة من ${a} خانة، ولوح طوله ${b}. ماذا تقول قاعدتك؟`,
  notThat: 'قاعدتك تقول غير ذلك.',
  build: 'ابنِ الجسر',
  survived: 'صمدت قاعدتك: الجسر فعل ما قالته.',
  broken: (yes) => `قاعدتك انكسرت هنا: قالت « ${yes ? 'يثبت' : 'ينهار'} »، والجسر ${yes ? 'انهار' : 'ثبت'}.`,
  another: 'تحدٍّ آخر',
  toSeal: 'قاعدتي صمدت!',
  sealed: 'قاعدتك صمدت أمام المرآة: صارت مفتاحك.',
  words: 'قلها بكلماتك (اختياري)',
  wordsHint: 'مثال: الجسر يثبت إذا…',
  sealIt: 'أختم مفتاحي',
  tryKey: (a, b) => `جرّب مفتاحك حيث لا تستطيع العدّ: هوّة من ${a} خانة، ولوح طوله ${b}. المرآة لا تبني هذه المرّة.`,
  quotient: 'حاصل القسمة',
  rest: 'الباقي',
  check: 'تحقّق',
  useSum: 'المساواة غير صحيحة: احسب الجداء ثمّ أضف الباقي.',
  useBig: 'الباقي يجب أن يكون أصغر من طول اللوح.',
  useVerdict: 'القسمة صحيحة. انظر إلى الباقي: ماذا تقول قاعدتك؟',
  useOk: 'مفتاحك يعمل حتّى حيث لا تعدّ!',
  help: 'ساعدني يا زيرو',
  compare: (a) => `قارن هذين الجسرين: الهوّة نفسها (${a}). ماذا بقي في كلّ مرّة؟`,
  experiment: 'انظر جيّدًا: اللوح نفسه، هوّة ثمّ التي بعدها. ماذا بقي في كلّ مرّة؟',
  choice: 'إحدى هاتين القاعدتين تصمد أمام المرآة. اختبرهما:',
  ruleA: 'القاعدة الأولى',
  ruleB: 'القاعدة الثانية',
};
const FAST = () => import.meta.env.DEV && typeof window !== 'undefined' && window.__forgeFast;
const PHASES = ['predict', 'build', 'test', 'seal'];
const stepOf = (phase) => (phase === 'attack' ? 'test' : phase === 'use' ? 'seal' : phase);

/** A bridge in the mirror: `a` cells, planks of `b`, what is left in amber. `stage`: ask (the gap and one plank) | build | done. */
function MirrorBridge({ c, stage }) {
  const W = 720;
  const cell = Math.min(34, W / c.a);
  const x0 = (W - cell * c.a) / 2;
  const built = stage !== 'ask';
  const done = stage === 'done';
  return (
    <svg
      viewBox={`0 0 ${W} 150`}
      className={`rf-bridge is-${stage} ${done ? (c.held ? 'is-held' : 'is-fell') : ''}`}
      data-rf-bridge={`${c.a}:${c.b}`}
      data-rf-stage={stage}
    >
      <rect x={x0 - 26} y="74" width="26" height="46" rx="6" className="rf-bank" />
      <rect x={x0 + cell * c.a} y="74" width="26" height="46" rx="6" className="rf-bank" />
      {Array.from({ length: c.a }, (_, i) => (
        <rect
          key={i}
          x={x0 + i * cell + 1}
          y="80"
          width={Math.max(1, cell - 2)}
          height="22"
          rx="3"
          className={`rf-cell ${built && i >= c.q * c.b ? 'is-left' : ''}`}
        />
      ))}
      {!built && (
        <g>
          <rect x={x0} y="30" width={cell * c.b - 2} height="24" rx="6" className="rf-plank rf-plank--sample" />
          <text x={x0 + (cell * c.b) / 2} y="22" textAnchor="middle" className="rf-cap">
            لوح {c.b}
          </text>
        </g>
      )}
      {built &&
        Array.from({ length: c.q }, (_, k) => (
          <rect
            key={k}
            x={x0 + k * c.b * cell + 1.5}
            y="78"
            width={cell * c.b - 3}
            height="26"
            rx="6"
            className={`rf-plank ${k % 2 ? 'is-alt' : ''}`}
            style={{ animationDelay: `${k * (FAST() ? 8 : 110)}ms` }}
          />
        ))}
      <text x={W / 2} y="142" textAnchor="middle" className="rf-cap rf-cap--a">
        {c.a} خانة
      </text>
    </svg>
  );
}

const Mini = ({ c }) => {
  const W = 150;
  const cell = W / c.a;
  return (
    <svg viewBox={`0 0 ${W} 14`} className="rf-mini" aria-hidden="true">
      {Array.from({ length: c.q }, (_, k) => (
        <rect
          key={k}
          x={k * c.b * cell + 0.5}
          y="1"
          width={Math.max(1, cell * c.b - 1)}
          height="12"
          rx="2.5"
          className={c.held ? 'is-held' : ''}
        />
      ))}
      {c.r > 0 && (
        <rect
          x={c.q * c.b * cell + 0.5}
          y="1"
          width={Math.max(1, cell * c.r - 1)}
          height="12"
          rx="2.5"
          className="is-left"
        />
      )}
    </svg>
  );
};

export default function RuleForge({ game, log, onSeal }) {
  const [rows, setRows] = useState(() => evidence(log));
  const cases = useMemo(() => predictCases(evidence(log)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [phase, setPhase] = useState('predict');
  const [pi, setPi] = useState(0);
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(() => ({ c: cases[0], stage: 'ask', guess: null }));
  const [rule, setRule] = useState({ q: null, c: null });
  const [tries, setTries] = useState(0);
  const [run, setRun] = useState(null); // test: { marks, bad, upto }
  const [atk, setAtk] = useState(null); // attack: { list, i, said }
  const [nudges, setNudges] = useState(0);
  const [help, setHelp] = useState(null);
  const [words, setWords] = useState('');
  const [use, setUse] = useState(null);
  const [z, setZ] = useState(1);
  const timers = useRef([]);
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, FAST() ? Math.min(ms, 30) : ms));
  };
  const play = (name, p) => game.audio.play(name, p);

  useEffect(() => {
    const fit = () => setZ(Math.max(0.62, Math.min(1.9, Math.min(window.innerWidth / 1280, window.innerHeight / 720))));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (import.meta.env.DEV) window.__forge = { phase, show, rule, rows, atk, run, use, cases, nudges, help };
  });

  const remember = (c) => {
    game.logMirror?.(c.a, c.b);
    setRows((old) => evidence([...old, { ...c, mirror: true }]));
  };
  /** The mirror builds the bridge plank by plank, then it holds or crumbles; `then` runs when it is over. */
  const buildIt = (c, extra, then) => {
    setShow({ c, stage: 'build', ...extra });
    for (let k = 0; k < c.q; k += 1) later(() => play('plank', k), k * 110);
    later(
      () => {
        setShow({ c, stage: 'done', ...extra });
        play(c.held ? 'success' : 'crumble');
        remember(c);
        then?.();
      },
      c.q * 110 + 520,
    );
  };

  // ── 1. predict ──
  const predict = (guess) => {
    const c = show.c;
    buildIt(c, { guess }, () => setResults((r) => [...r, guess === c.held]));
  };
  const inHead = streak(results) >= PREDICT_NEED;
  const lastCase = pi >= cases.length - 1;
  const nextPredict = () => {
    play('ui');
    if (inHead || lastCase) {
      setPhase('build');
      return;
    }
    setPi(pi + 1);
    setShow({ c: cases[pi + 1], stage: 'ask', guess: null });
  };

  // ── 2. build, 3. test ──
  const pickTile = (k, id) => {
    play('pick');
    setHelp((h) => (h?.kind === 'choice' ? h : null));
    setRule((r) => ({ ...r, [k]: id }));
  };
  const startTest = () => {
    const res = runOnEvidence(rule, rows);
    setTries((n) => n + 1);
    setHelp(null);
    setRun({ ...res, upto: 0 });
    setPhase('test');
    const last = res.bad >= 0 ? res.bad : res.marks.length - 1;
    for (let i = 0; i <= last; i += 1)
      later(
        () => {
          setRun({ ...res, upto: i + 1 });
          play(res.marks[i].agrees ? 'plank' : 'crumble', i);
        },
        420 * (i + 1),
      );
  };
  const backToBuild = () => {
    play('ui');
    setRun(null);
    setAtk(null);
    setPhase('build');
  };

  // ── 4. attack ──
  const startAttack = () => {
    const list = attacks(rule, rows);
    if (!list.length) {
      if (isTheRule(rule)) setPhase('seal');
      else backToBuild();
      return;
    }
    play('wind');
    setAtk({ list, i: 0, said: null });
    setShow({ c: list[0], stage: 'ask' });
    setPhase('attack');
  };
  const sayRule = (v) => {
    play('ui');
    setAtk((s) => ({ ...s, said: v }));
  };
  const fireAttack = () => buildIt(atk.list[atk.i], {});
  const nextAttack = () => {
    play('ui');
    if (atk.i + 1 < atk.list.length) {
      setAtk({ ...atk, i: atk.i + 1, said: null });
      setShow({ c: atk.list[atk.i + 1], stage: 'ask' });
    } else {
      play('key');
      setPhase('seal');
    }
  };

  // ── 5. seal, 6. use ──
  const toUse = () => {
    play('ui');
    setUse({ c: keyCase(), q: '', r: '', verdict: null, fb: null });
    setPhase('use');
  };
  const checkUse = () => {
    const { c, q, r, verdict } = use;
    if (keyRight(c, q, r, verdict)) {
      play('success');
      setUse({ ...use, fb: 'ok' });
      later(
        () =>
          onSeal({
            rule,
            text: ruleText(rule),
            words: words.trim(),
            tries,
            nudges,
            level: discoveryLevel(nudges),
            predictions: { asked: results.length, right: results.filter(Boolean).length },
            at: Date.now(),
          }),
        1100,
      );
      return;
    }
    play('ui');
    setUse({ ...use, fb: c.b * Number(q) + Number(r) !== c.a ? 'sum' : Number(r) >= c.b ? 'big' : 'verdict' });
  };

  // ── the robot: never the rule ──
  const askHelp = () => {
    const n = Math.min(3, nudges + 1);
    const h = nudge(n, rows);
    setNudges(n);
    play('crystal');
    if (h.kind !== 'experiment') {
      setHelp(h);
      return;
    }
    setHelp({ ...h, running: true });
    buildIt(h.cases[0], {}, () => later(() => buildIt(h.cases[1], {}, () => setHelp({ ...h, running: false })), 900));
  };

  const c = show?.c;
  const building = show?.stage === 'build';
  const done = show?.stage === 'done';
  const bad = run && run.bad >= 0 && run.upto > run.bad ? run.marks[run.bad] : null;
  const allAgree = run && run.bad < 0 && run.upto >= run.marks.length;
  const a = atk ? atk.list[atk.i] : null;
  const says = a ? ruleSays(rule, a.a, a.b) : null;
  const brokeIt = a && done && says !== a.held;
  const markOf = (row) => (phase === 'test' && run ? run.marks.slice(0, run.upto).find((m) => sameCase(m, row)) : null);
  const inMirror = phase === 'predict' || phase === 'attack' || (phase === 'build' && help?.kind === 'experiment');

  return (
    <div className="rf-root" dir="rtl" data-rf={phase} data-rf-tries={tries} data-rf-nudges={nudges}>
      <div className="rf-fit" style={{ zoom: z }}>
        <header className="rf-head">
          <div className="rf-brand">
            <i>🪞</i>
            <div>
              <h2>{L.title}</h2>
              <p>{L.sub}</p>
            </div>
          </div>
          <ol className="rf-steps">
            {PHASES.map((p, i) => {
              const at = PHASES.indexOf(stepOf(phase));
              return (
                <li key={p} className={i === at ? 'is-now' : i < at ? 'is-done' : ''}>
                  <b>{i < at ? '✓' : i + 1}</b>
                  {L.steps[p]}
                </li>
              );
            })}
          </ol>
          {phase === 'build' ? (
            <button
              type="button"
              className="rf-btn rf-btn--bot"
              onClick={askHelp}
              disabled={nudges >= 3 || help?.running}
              data-rf-help
            >
              <Bot size={19} /> {L.help}
            </button>
          ) : (
            <span className="rf-head__pad" />
          )}
        </header>

        <aside className="rf-log" data-rf-log>
          <h3>📖 {L.log}</h3>
          <ul>
            {rows.slice(-EVIDENCE_MAX).map((row) => {
              const m = markOf(row);
              const cmp = help?.kind === 'compare' && help.cases.some((x) => sameCase(x, row));
              return (
                <li
                  key={`${row.a}-${row.b}`}
                  className={`${row.held ? 'is-held' : 'is-fell'} ${m ? (m.agrees ? 'is-agree' : 'is-refute') : ''} ${cmp ? 'is-compare' : ''}`}
                  data-rf-row={`${row.a}:${row.b}`}
                  data-rf-own={row.mirror ? '0' : '1'}
                  data-rf-mark={m ? (m.agrees ? 'agree' : 'refute') : ''}
                >
                  <div>
                    {row.mirror && (
                      <i className="rf-inmirror" title={L.title}>
                        🪞
                      </i>
                    )}
                    <strong dir="ltr">{row.a}</strong> <span>{L.plank(row.b)}</span>
                    <em>{row.held ? L.held : L.fell(row.r)}</em>
                  </div>
                  <div className="rf-line2">
                    <Mini c={row} />
                    {m && (
                      <small className="rf-says">
                        {m.agrees ? '✓' : '✗'} {L.says(m.says)}
                      </small>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="rf-main">
          <section className={`rf-mirror ${inMirror ? '' : 'is-rule'}`} data-rf-mirror>
            {inMirror && c && (
              <>
                <MirrorBridge c={c} stage={show.stage} />
                {done && (
                  <p className="rf-eq" dir="ltr" data-rf-eq>
                    <MathText>{`$${c.a} = ${c.b} \\times ${c.q} + \\textcolor{${c.held ? '#34d399' : '#fbbf24'}}{${c.r}}$`}</MathText>
                  </p>
                )}
              </>
            )}
            {!inMirror && (
              <div className="rf-rule" data-rf-rule={`${rule.q ?? ''}:${rule.c ?? ''}`}>
                <span>{L.frame}</span>
                <b className={rule.q ? '' : 'is-empty'}>
                  {rule.q ? QUANTITIES.find((x) => x.id === rule.q).label : '……'}
                </b>
                <b className={rule.c ? '' : 'is-empty'}>
                  {rule.c ? CONDITIONS.find((x) => x.id === rule.c).label : '……'}
                </b>
                {(phase === 'seal' || phase === 'use') && <i className="rf-keymark">🔑</i>}
              </div>
            )}
          </section>

          <section className="rf-panel" data-rf-panel={phase}>
            {phase === 'predict' && c && (
              <>
                <p className="rf-q">{L.ask(c.a, c.b)}</p>
                {show.stage === 'ask' && (
                  <div className="rf-row">
                    <button
                      type="button"
                      className="rf-btn rf-btn--hold"
                      onClick={() => predict(true)}
                      data-rf-guess="holds"
                    >
                      {L.holds}
                    </button>
                    <button
                      type="button"
                      className="rf-btn rf-btn--fall"
                      onClick={() => predict(false)}
                      data-rf-guess="falls"
                    >
                      {L.falls}
                    </button>
                  </div>
                )}
                {done && (
                  <>
                    <p
                      className={`rf-fb ${show.guess === c.held ? 'is-right' : ''}`}
                      data-rf-predicted={show.guess === c.held ? 'right' : 'miss'}
                    >
                      {show.guess === c.held ? `✓ ${L.right}` : L.miss}{' '}
                      <span>{c.held ? L.factHeld : L.factFell(c.r)}</span>
                    </p>
                    {(inHead || lastCase) && <p className="rf-note">{inHead ? L.inHead : L.timeToWrite}</p>}
                    <button type="button" className="rf-btn rf-btn--main" onClick={nextPredict} autoFocus data-rf-next>
                      {inHead || lastCase ? (
                        <>
                          <Hammer size={18} /> {L.toBuild}
                        </>
                      ) : (
                        L.next
                      )}
                    </button>
                  </>
                )}
                <div className="rf-streak" aria-hidden="true" data-rf-streak={streak(results)}>
                  {Array.from({ length: PREDICT_NEED }, (_, i) => (
                    <i key={i} className={i < streak(results) ? 'is-on' : ''} />
                  ))}
                </div>
              </>
            )}

            {phase === 'build' && (
              <>
                {help ? (
                  <p className="rf-bubble" data-rf-nudge={help.kind}>
                    <Bot size={18} />{' '}
                    {help.kind === 'compare'
                      ? L.compare(help.cases[0].a)
                      : help.kind === 'experiment'
                        ? L.experiment
                        : L.choice}
                    {help.kind === 'choice' && (
                      <span className="rf-row">
                        {help.rules.map((r, i) => (
                          <button
                            key={r.c}
                            type="button"
                            className="rf-btn"
                            onClick={() => {
                              play('pick');
                              setRule(r);
                            }}
                            data-rf-choice={`${r.q}:${r.c}`}
                          >
                            {i === 0 ? L.ruleA : L.ruleB}
                          </button>
                        ))}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="rf-note">{L.buildLead}</p>
                )}
                <div className="rf-tiles">
                  <div>
                    <h4>{L.look}</h4>
                    {QUANTITIES.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        className={`rf-tile ${rule.q === x.id ? 'is-on' : ''}`}
                        onClick={() => pickTile('q', x.id)}
                        aria-pressed={rule.q === x.id}
                        data-rf-q={x.id}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <h4>{L.must}</h4>
                    {CONDITIONS.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        className={`rf-tile ${rule.c === x.id ? 'is-on' : ''}`}
                        onClick={() => pickTile('c', x.id)}
                        aria-pressed={rule.c === x.id}
                        data-rf-c={x.id}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="rf-btn rf-btn--main"
                  onClick={startTest}
                  disabled={!complete(rule) || help?.running}
                  data-rf-test
                >
                  <Sparkles size={18} /> {L.test}
                </button>
              </>
            )}

            {phase === 'test' && (
              <>
                {!bad && !allAgree && <p className="rf-note">{L.testing}</p>}
                {bad && (
                  <>
                    <p className="rf-fb is-broken" data-rf-refuted={`${bad.a}:${bad.b}`}>
                      {L.refuted(bad)}
                    </p>
                    <p className="rf-note">{explain(rule, bad.a, bad.b)}</p>
                    <button type="button" className="rf-btn rf-btn--main" onClick={backToBuild} autoFocus data-rf-fix>
                      <Hammer size={18} /> {L.fix}
                    </button>
                  </>
                )}
                {allAgree && (
                  <>
                    <p className="rf-fb is-right" data-rf-agreed>
                      {L.agreed}
                    </p>
                    <button type="button" className="rf-btn rf-btn--main" onClick={startAttack} autoFocus data-rf-dare>
                      {L.dare}
                    </button>
                  </>
                )}
              </>
            )}

            {phase === 'attack' && a && (
              <>
                <p className="rf-q">{L.attack(a.a, a.b)}</p>
                {show.stage === 'ask' && atk.said === null && (
                  <div className="rf-row">
                    <button
                      type="button"
                      className="rf-btn rf-btn--hold"
                      onClick={() => sayRule(true)}
                      data-rf-say="holds"
                    >
                      {L.holds}
                    </button>
                    <button
                      type="button"
                      className="rf-btn rf-btn--fall"
                      onClick={() => sayRule(false)}
                      data-rf-say="falls"
                    >
                      {L.falls}
                    </button>
                  </div>
                )}
                {show.stage === 'ask' && atk.said !== null && (
                  <>
                    <p className="rf-note" data-rf-rule-says={says ? 'holds' : 'falls'}>
                      {atk.said !== says && <b>{L.notThat} </b>}
                      {explain(rule, a.a, a.b)}
                    </p>
                    <button type="button" className="rf-btn rf-btn--main" onClick={fireAttack} autoFocus data-rf-fire>
                      <Hammer size={18} /> {L.build}
                    </button>
                  </>
                )}
                {building && <p className="rf-note">{L.says(says)}</p>}
                {done && !brokeIt && (
                  <>
                    <p className="rf-fb is-right" data-rf-survived>
                      {L.survived}
                    </p>
                    <button
                      type="button"
                      className="rf-btn rf-btn--main"
                      onClick={nextAttack}
                      autoFocus
                      data-rf-attack-next
                    >
                      {atk.i + 1 < atk.list.length ? L.another : <>🔑 {L.toSeal}</>}
                    </button>
                  </>
                )}
                {done && brokeIt && (
                  <>
                    <p className="rf-fb is-broken" data-rf-broken={`${a.a}:${a.b}`}>
                      {L.broken(says)}
                    </p>
                    <button type="button" className="rf-btn rf-btn--main" onClick={backToBuild} autoFocus data-rf-fix>
                      <Hammer size={18} /> {L.fix}
                    </button>
                  </>
                )}
              </>
            )}

            {phase === 'seal' && (
              <>
                <p className="rf-fb is-right" data-rf-sealed>
                  🔑 {L.sealed}
                </p>
                <label className="rf-words">
                  <span>{L.words}</span>
                  <input
                    value={words}
                    onChange={(e) => setWords(e.target.value.slice(0, 140))}
                    placeholder={L.wordsHint}
                    data-rf-words
                  />
                </label>
                <button type="button" className="rf-btn rf-btn--main" onClick={toUse} data-rf-seal>
                  <Check size={18} strokeWidth={3} /> {L.sealIt}
                </button>
              </>
            )}

            {phase === 'use' && use && (
              <>
                <p className="rf-q">{L.tryKey(use.c.a, use.c.b)}</p>
                <div className="rf-use" dir="ltr">
                  <b>{use.c.a}</b>
                  <b>=</b>
                  <b>{use.c.b}</b>
                  <b>×</b>
                  <label>
                    <input
                      inputMode="numeric"
                      value={use.q}
                      onChange={(e) =>
                        setUse({ ...use, q: e.target.value.replace(/[^0-9]/g, '').slice(0, 3), fb: null })
                      }
                      aria-label={L.quotient}
                      data-rf-use-q
                    />
                    <small>{L.quotient}</small>
                  </label>
                  <b>+</b>
                  <label>
                    <input
                      inputMode="numeric"
                      value={use.r}
                      onChange={(e) =>
                        setUse({ ...use, r: e.target.value.replace(/[^0-9]/g, '').slice(0, 2), fb: null })
                      }
                      aria-label={L.rest}
                      data-rf-use-r
                    />
                    <small>{L.rest}</small>
                  </label>
                </div>
                <div className="rf-row">
                  <button
                    type="button"
                    className={`rf-btn rf-btn--hold ${use.verdict === true ? 'is-on' : ''}`}
                    onClick={() => setUse({ ...use, verdict: true, fb: null })}
                    aria-pressed={use.verdict === true}
                    data-rf-use-verdict="holds"
                  >
                    {L.holds}
                  </button>
                  <button
                    type="button"
                    className={`rf-btn rf-btn--fall ${use.verdict === false ? 'is-on' : ''}`}
                    onClick={() => setUse({ ...use, verdict: false, fb: null })}
                    aria-pressed={use.verdict === false}
                    data-rf-use-verdict="falls"
                  >
                    {L.falls}
                  </button>
                  <button
                    type="button"
                    className="rf-btn rf-btn--main"
                    onClick={checkUse}
                    disabled={use.q === '' || use.r === '' || use.verdict === null || use.fb === 'ok'}
                    data-rf-use-check
                  >
                    {L.check}
                  </button>
                </div>
                {use.fb && (
                  <p className={`rf-fb ${use.fb === 'ok' ? 'is-right' : ''}`} data-rf-use-fb={use.fb}>
                    {use.fb === 'ok'
                      ? `✓ ${L.useOk}`
                      : use.fb === 'sum'
                        ? L.useSum
                        : use.fb === 'big'
                          ? L.useBig
                          : L.useVerdict}
                  </p>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
