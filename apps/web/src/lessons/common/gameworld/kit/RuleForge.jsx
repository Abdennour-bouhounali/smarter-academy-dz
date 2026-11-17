/**
 * « مصهر القاعدة » — the SCREEN of a rule forge (frame: forge.js; contract GAME_WORLD.md §2sexies). It names no lesson and
 * no world: the lesson gives the `forge` (its tiles, what a rule says of a case, the evidence, the attacks, the wording)
 * and the world gives the `parts` — how one of ITS cases is drawn:
 *   Mirror({ c, stage, fast })   the case in the mirror; `stage`: ask | build | done
 *   Line({ c })                  the case as one line of the evidence
 *   beats(c)                     how many strokes the mirror needs to build it (the sound and the wait follow)
 * The student does not receive the rule on a tablet: he predicts, writes HIS rule with tiles, and the MIRROR tests it —
 * first on his own evidence, then on a new case chosen to break it. A rule that survives becomes his key. The verdict is
 * always what the world does in front of him, never « wrong ».
 * One screen, nothing scrolls (designed 1280 × 720, zoomed to the window).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Hammer, Sparkles, Bot } from 'lucide-react';
import MathText from '../../components/MathText';
import { isShortScreen } from '../engine/phoneScreen';
import {
  PREDICT_NEED,
  EVIDENCE_MAX,
  complete,
  emptyRule,
  optionOf,
  ruleKey,
  runOn,
  testsOf,
  streak,
  sealRecord,
} from './forge';
import './ruleForge.css';

/** The words of the forge itself — the same in every lesson. What speaks of a case is the forge's own `text`. */
const L = {
  steps: { predict: 'تنبّأ', build: 'اكتب قاعدتك', test: 'المرآة تختبرها', seal: 'اختم مفتاحك' },
  right: 'توقّعك صحيح!',
  miss: 'توقّعك لم يصب هذه المرّة.',
  toBuild: 'أكتب قاعدتي',
  inHead: 'ثلاثة توقّعات صحيحة متتالية: القاعدة في رأسك. اكتبها الآن.',
  timeToWrite: 'حان وقت كتابة قاعدتك: المرآة ستختبرها.',
  test: 'اختبر قاعدتي',
  fix: 'أصلح قاعدتي',
  dare: 'ليكن!',
  notThat: 'قاعدتك تقول غير ذلك.',
  another: 'تحدٍّ آخر',
  toSeal: 'قاعدتي صمدت!',
  sealed: 'قاعدتك صمدت أمام المرآة: صارت مفتاحك.',
  words: 'قلها بكلماتك (اختياري)',
  sealIt: 'أختم مفتاحي',
  check: 'تحقّق',
  help: 'ساعدني يا زيرو',
  choice: 'إحدى هاتين القاعدتين تصمد أمام المرآة. اختبرهما:',
  ruleA: 'القاعدة الأولى',
  ruleB: 'القاعدة الثانية',
};
const FAST = () => import.meta.env.DEV && typeof window !== 'undefined' && window.__forgeFast;
const PHASES = ['predict', 'build', 'test', 'seal'];
const stepOf = (phase) => (phase === 'attack' ? 'test' : phase === 'use' ? 'seal' : phase);
const digits = (v, w) => v.replace(/[^0-9]/g, '').slice(0, w);

export default function RuleForge({ forge, parts, game, log, onSeal }) {
  const { Mirror, Line } = parts;
  const T = forge.text;
  const idOf = forge.caseId;
  const [rows, setRows] = useState(() => forge.evidence(log));
  const cases = useMemo(() => forge.predictCases(forge.evidence(log)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [phase, setPhase] = useState('predict');
  const [pi, setPi] = useState(0);
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(() => ({ c: cases[0], stage: 'ask', guess: null }));
  const [rule, setRule] = useState(() => emptyRule(forge));
  const [tries, setTries] = useState(0);
  const [run, setRun] = useState(null); // test: { marks, bad, upto }
  const [atk, setAtk] = useState(null); // attack: { list, i, said }
  const [nudges, setNudges] = useState(0);
  const [help, setHelp] = useState(null);
  const [words, setWords] = useState('');
  const [use, setUse] = useState(null); // the last step: { c, vals, verdict, fb }
  const [z, setZ] = useState(1);
  const timers = useRef([]);
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, FAST() ? Math.min(ms, 30) : ms));
  };
  const play = (name, p) => game.audio.play(name, p);

  useEffect(() => {
    // a phone held sideways has ONE scale, its root font (GAME_WORLD.md « On a phone »): the forge does not zoom there —
    // it has its own compact layout, and its list and its panel slide inside themselves
    const fit = () =>
      setZ(
        isShortScreen()
          ? 1
          : Math.max(0.62, Math.min(1.9, Math.min(window.innerWidth / 1280, window.innerHeight / 720))),
      );
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (import.meta.env.DEV)
      window.__forge = { key: forge.key, phase, show, rule, rows, atk, run, use, cases, nudges, help };
  });

  const remember = (c) => {
    if (forge.logs) game.logMirror?.(c);
    setRows((old) => forge.evidence([...old, { ...c, mirror: true }]));
  };
  /** The mirror builds the case stroke by stroke, then the world gives its verdict; `then` runs when it is over. */
  const buildIt = (c, extra, then) => {
    const beats = parts.beats?.(c) ?? 0;
    setShow({ c, stage: 'build', ...extra });
    for (let k = 0; k < beats; k += 1) later(() => play('plank', k), k * 110);
    later(
      () => {
        setShow({ c, stage: 'done', ...extra });
        play(c.held ? 'success' : 'crumble');
        remember(c);
        then?.();
      },
      beats * 110 + 520,
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
  const pickTile = (slotId, id) => {
    play('pick');
    setHelp((h) => (h?.kind === 'choice' ? h : null));
    setRule((r) => ({ ...r, [slotId]: id }));
  };
  const startTest = () => {
    const res = runOn(forge, rule, testsOf(forge, rule, rows));
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
    const list = forge.attacks(rule, rows);
    if (!list.length) {
      if (forge.isTheRule(rule)) setPhase('seal');
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
    setUse({ c: forge.use.make(), vals: {}, verdict: null, fb: null });
    setPhase('use');
  };
  const useLines = use ? forge.use.lines(use.c) : [];
  const useSlots = useLines.flatMap((line) => line.tokens.filter((t) => typeof t === 'object'));
  const useFilled =
    use && useSlots.every((t) => (use.vals[t.slot] ?? '') !== '') && (!forge.use.verdict || use.verdict !== null);
  const checkUse = () => {
    const fb = forge.use.check(use.c, use.vals, use.verdict);
    if (fb === 'ok') {
      play('success');
      setUse({ ...use, fb });
      later(() => onSeal(sealRecord(forge, { rule, words, tries, nudges, results })), 1100);
      return;
    }
    play('ui');
    setUse({ ...use, fb });
  };

  // ── the robot: never the rule ──
  const askHelp = () => {
    const n = Math.min(3, nudges + 1);
    const h = forge.nudge(n, rows);
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
  const says = a ? forge.says(rule, a) : null;
  const brokeIt = a && done && says !== a.held;
  const testing = phase === 'test' && run;
  // the lines on the left: his evidence — or, while a rule that builds its own cases is tested, those cases
  const lines = testing && forge.tests ? run.marks : rows.slice(-EVIDENCE_MAX);
  const markOf = (row) => (testing ? run.marks.slice(0, run.upto).find((m) => idOf(m) === idOf(row)) : null);
  const inMirror = phase === 'predict' || phase === 'attack' || (phase === 'build' && help?.kind === 'experiment');
  const eq = done && c ? T.eq?.(c) : null;

  return (
    <div
      className="rf-root"
      dir="rtl"
      data-rf={phase}
      data-rf-key={forge.key}
      data-rf-tries={tries}
      data-rf-nudges={nudges}
    >
      <div className="rf-fit" style={{ zoom: z }}>
        <header className="rf-head">
          <div className="rf-brand">
            <i>🪞</i>
            <div>
              <h2>{T.title}</h2>
              <p>{T.sub}</p>
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
          <h3>📖 {T.log}</h3>
          <ul>
            {lines.map((row) => {
              const m = markOf(row);
              const cmp = help?.kind === 'compare' && help.cases.some((x) => idOf(x) === idOf(row));
              return (
                <li
                  key={idOf(row)}
                  className={`${row.held ? 'is-held' : 'is-fell'} ${m ? (m.agrees ? 'is-agree' : 'is-refute') : ''} ${cmp ? 'is-compare' : ''}`}
                  data-rf-row={idOf(row)}
                  data-rf-own={row.mirror ? '0' : '1'}
                  data-rf-mark={m ? (m.agrees ? 'agree' : 'refute') : ''}
                >
                  <Line c={row}>
                    {m && (
                      <small className="rf-says">
                        {m.agrees ? '✓' : '✗'} {T.says(m.says)}
                      </small>
                    )}
                  </Line>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="rf-main">
          <section className={`rf-mirror ${inMirror ? '' : 'is-rule'}`} data-rf-mirror>
            {inMirror && c && (
              <>
                <Mirror c={c} stage={show.stage} fast={FAST()} />
                {eq && (
                  <p className="rf-eq" dir="ltr" data-rf-eq>
                    <MathText>{eq}</MathText>
                  </p>
                )}
              </>
            )}
            {!inMirror && (
              <div className="rf-rule" data-rf-rule={ruleKey(forge, rule)} data-rf-slots={forge.slots.length}>
                <span>{T.frame}</span>
                {forge.slots.map((s) => {
                  const o = optionOf(forge, s.id, rule[s.id]);
                  return (
                    <b key={s.id} className={o ? '' : 'is-empty'}>
                      {o ? (forge.chip?.(s, o) ?? o.label) : '……'}
                    </b>
                  );
                })}
                {(phase === 'seal' || phase === 'use') && <i className="rf-keymark">🔑</i>}
              </div>
            )}
          </section>

          <section className="rf-panel" data-rf-panel={phase}>
            {phase === 'predict' && c && (
              <>
                <p className="rf-q">
                  <MathText>{T.ask(c)}</MathText>
                </p>
                {show.stage === 'ask' && (
                  <div className="rf-row">
                    <button
                      type="button"
                      className="rf-btn rf-btn--hold"
                      onClick={() => predict(true)}
                      data-rf-guess="yes"
                    >
                      {T.yes}
                    </button>
                    <button
                      type="button"
                      className="rf-btn rf-btn--fall"
                      onClick={() => predict(false)}
                      data-rf-guess="no"
                    >
                      {T.no}
                    </button>
                  </div>
                )}
                {done && (
                  <>
                    <p
                      className={`rf-fb ${show.guess === c.held ? 'is-right' : ''}`}
                      data-rf-predicted={show.guess === c.held ? 'right' : 'miss'}
                    >
                      {show.guess === c.held ? `✓ ${L.right}` : L.miss} <span>{T.fact(c)}</span>
                    </p>
                    {(inHead || lastCase) && <p className="rf-note">{inHead ? L.inHead : L.timeToWrite}</p>}
                    <button type="button" className="rf-btn rf-btn--main" onClick={nextPredict} autoFocus data-rf-next>
                      {inHead || lastCase ? (
                        <>
                          <Hammer size={18} /> {L.toBuild}
                        </>
                      ) : (
                        T.next
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
                      ? T.compare(help.cases)
                      : help.kind === 'experiment'
                        ? T.experiment
                        : L.choice}
                    {help.kind === 'choice' && (
                      <span className="rf-row">
                        {help.rules.map((r, i) => (
                          <button
                            key={ruleKey(forge, r)}
                            type="button"
                            className="rf-btn"
                            onClick={() => {
                              play('pick');
                              setRule(r);
                            }}
                            data-rf-choice={ruleKey(forge, r)}
                          >
                            {i === 0 ? L.ruleA : L.ruleB}
                          </button>
                        ))}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="rf-note">{T.buildLead}</p>
                )}
                <div className="rf-tiles" data-rf-slots={forge.slots.length}>
                  {forge.slots.map((s) => (
                    <div key={s.id}>
                      <h4>{s.label}</h4>
                      {s.options.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className={`rf-tile ${rule[s.id] === o.id ? 'is-on' : ''}`}
                          onClick={() => pickTile(s.id, o.id)}
                          aria-pressed={rule[s.id] === o.id}
                          data-rf-tile={`${s.id}:${o.id}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="rf-btn rf-btn--main"
                  onClick={startTest}
                  disabled={!complete(forge, rule) || help?.running}
                  data-rf-test
                >
                  <Sparkles size={18} /> {L.test}
                </button>
              </>
            )}

            {phase === 'test' && (
              <>
                {!bad && !allAgree && <p className="rf-note">{T.testing}</p>}
                {bad && (
                  <>
                    <p className="rf-fb is-broken" data-rf-refuted={idOf(bad)}>
                      {T.refuted(bad)}
                    </p>
                    <p className="rf-note">
                      <MathText>{forge.explain(rule, bad)}</MathText>
                    </p>
                    <button type="button" className="rf-btn rf-btn--main" onClick={backToBuild} autoFocus data-rf-fix>
                      <Hammer size={18} /> {L.fix}
                    </button>
                  </>
                )}
                {allAgree && (
                  <>
                    <p className="rf-fb is-right" data-rf-agreed>
                      {T.agreed}
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
                <p className="rf-q">
                  <MathText>{T.attack(a)}</MathText>
                </p>
                {show.stage === 'ask' && atk.said === null && (
                  <div className="rf-row">
                    <button
                      type="button"
                      className="rf-btn rf-btn--hold"
                      onClick={() => sayRule(true)}
                      data-rf-say="yes"
                    >
                      {T.yes}
                    </button>
                    <button
                      type="button"
                      className="rf-btn rf-btn--fall"
                      onClick={() => sayRule(false)}
                      data-rf-say="no"
                    >
                      {T.no}
                    </button>
                  </div>
                )}
                {show.stage === 'ask' && atk.said !== null && (
                  <>
                    <p className="rf-note" data-rf-rule-says={says ? 'yes' : 'no'}>
                      {atk.said !== says && <b>{L.notThat} </b>}
                      <MathText>{forge.explain(rule, a)}</MathText>
                    </p>
                    <button type="button" className="rf-btn rf-btn--main" onClick={fireAttack} autoFocus data-rf-fire>
                      <Hammer size={18} /> {T.fire}
                    </button>
                  </>
                )}
                {building && <p className="rf-note">{T.says(says)}</p>}
                {done && !brokeIt && (
                  <>
                    <p className="rf-fb is-right" data-rf-survived>
                      {T.survived}
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
                    <p className="rf-fb is-broken" data-rf-broken={idOf(a)}>
                      {T.broken(says)}
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
                    placeholder={T.wordsHint}
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
                <p className="rf-q">
                  <MathText>{T.tryKey(use.c)}</MathText>
                </p>
                <div className="rf-uselines" data-rf-lines={useLines.length}>
                  {useLines.map((line, i) => (
                    <div key={i} className="rf-use" dir={line.dir ?? 'ltr'}>
                      {line.tokens.map((t, k) =>
                        typeof t === 'object' ? (
                          <label key={k}>
                            <input
                              inputMode="numeric"
                              style={{ width: `${(t.w ?? 3) * 0.7 + 0.9}em` }}
                              value={use.vals[t.slot] ?? ''}
                              onChange={(e) =>
                                setUse({
                                  ...use,
                                  vals: { ...use.vals, [t.slot]: digits(e.target.value, t.w ?? 3) },
                                  fb: null,
                                })
                              }
                              aria-label={t.label}
                              data-rf-use={t.slot}
                            />
                            {useLines.length === 1 && <small>{t.label}</small>}
                          </label>
                        ) : (
                          <b key={k}>{t}</b>
                        ),
                      )}
                    </div>
                  ))}
                </div>
                <div className="rf-row">
                  {forge.use.verdict && (
                    <>
                      <button
                        type="button"
                        className={`rf-btn rf-btn--hold ${use.verdict === true ? 'is-on' : ''}`}
                        onClick={() => setUse({ ...use, verdict: true, fb: null })}
                        aria-pressed={use.verdict === true}
                        data-rf-use-verdict="yes"
                      >
                        {T.yes}
                      </button>
                      <button
                        type="button"
                        className={`rf-btn rf-btn--fall ${use.verdict === false ? 'is-on' : ''}`}
                        onClick={() => setUse({ ...use, verdict: false, fb: null })}
                        aria-pressed={use.verdict === false}
                        data-rf-use-verdict="no"
                      >
                        {T.no}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="rf-btn rf-btn--main"
                    onClick={checkUse}
                    disabled={!useFilled || use.fb === 'ok'}
                    data-rf-use-check
                  >
                    {L.check}
                  </button>
                </div>
                {use.fb && (
                  <p className={`rf-fb ${use.fb === 'ok' ? 'is-right' : ''}`} data-rf-use-fb={use.fb}>
                    {use.fb === 'ok' ? `✓ ${T.useOk}` : T.use[use.fb]}
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
