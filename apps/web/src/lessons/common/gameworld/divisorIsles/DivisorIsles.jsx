/**
 * « أرخبيل القواسم » — the React shell of the game world (student view of lesson `qasim-adad-tabii`).
 * A full-window portal: the three.js canvas (Game.js) and, above it, the HUD and the overlays, all read from the game's state.
 * The shell never computes maths: it shows what the game publishes and sends the student's choices back.
 *
 * props: config (LESSON_CONFIG), basePath, exitTo (catalogue), classicHref (the mission player), onModule(n) (marks a module done),
 *        completedModules (the lesson's synced progress: it opens the practice nodes on a device that never played the story).
 */
import { Suspense, lazy, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Star,
  Gem,
  Heart,
  RotateCcw,
  Lock,
  Play,
  Lightbulb,
  Flame,
  Map as MapIcon,
  Truck,
  Zap,
  BookOpen,
  Coins,
  FileText,
  Trophy,
  FlaskConical,
  Backpack,
} from 'lucide-react';
import MathText from '../../components/MathText';
import { scopedStorage as storage } from '../../../../utils/storage';
import { AuthContext } from '../../../../context/AuthContext';
import { payloadOf } from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/evidence';
import { sendGameEvidence, flushGameEvidence, newAttemptId } from '../kit/evidenceSend';
import { DivisorIslesGame } from './Game';
import { usePhoneScreen } from '../engine/phoneScreen';
import TurnPhone from '../../../../components/common/TurnPhone';
import { STATUES, MAX_STARS } from './logic';
import { T, planks, waveSay, explain } from './strings';
import {
  PRACTICE_NODES,
  EXAM,
  levelId,
  nodeOpen,
  levelOpen,
  nextLevel,
  practiceStars,
  isDepot,
  MAX_PRACTICE_STARS,
} from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/practice';
import { answerOf, simUnit } from './cases';
import { divisionTip, ruleTip } from '../kit/tips';
import KnowledgePage from '../kit/KnowledgePage';
import ExamSitting from '../kit/ExamSitting';
import RuleForge from './RuleForge';
import { ExamLadder, Promotion, ProgressPage } from '../kit/Spaces';
import { examOpen } from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/journey';
import { launchDone } from '../../launchkit/store';
import {
  totalMark,
  weakKinds,
} from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world/sitting';
import '../kit/examSitting.css';
import Fit, { cardRoom, stepRoom } from '../kit/Fit';
import { PaperGate, PaperModel, PaperChip, PT } from '../kit/Paper';
import { twin } from '../kit/longDivision';
import { TX } from '../kit/text';
import { LessonProvider } from '../kit/LessonContext';
// The ONE lesson this world plays today. It becomes a prop when the shell moves to the kit (plan §4, step 4).
import { lesson as LESSON } from '../../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world';
import './divisorIsles.css';

const saveKey = (id) => `smarter_world_${id}`;
const readSave = (id) => {
  try {
    return JSON.parse(storage.getItem(saveKey(id)) || 'null');
  } catch {
    return null;
  }
};
const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};
// « مختبري »: the lab of the lesson, the same for every lesson (lessons/common/lessonlab) — loaded when opened
const LessonLab = lazy(() => import('../../lessonlab/LessonLab'));
const LaunchKit = lazy(() => import('../../launchkit/LaunchKit'));
const M = ({ children }) => (
  <span dir="ltr" className="di-math">
    <MathText>{`$${children}$`}</MathText>
  </span>
);

/** The keys the lesson's own progress proves: module 1 is marked on tablet 1, module 2 on tablet 4 (the last one). */
function keysFromModules(done = []) {
  const has = (n) => done.some((m) => Number(m) === n);
  if (has(2)) return ['qasim-baqi', 'qasim-jidaa', 'siyagh-mutakafia', 'wahid-wa-nafsuh'];
  return has(1) ? ['qasim-baqi'] : [];
}

export default function DivisorIsles({
  config,
  basePath,
  exitTo,
  classicHref,
  onModule,
  completedModules,
  mastery = null,
  preview = false,
}) {
  const previewRef = useRef(preview);
  previewRef.current = preview; // a teacher looking at what the student sees: nothing is sent
  const canvas = useRef(null);
  const root = useRef(null);
  const [game, setGame] = useState(null);
  const [run, setRun] = useState(0);
  const [failed, setFailed] = useState(() => !hasWebGL());
  const onModuleRef = useRef(onModule);
  onModuleRef.current = onModule;
  // الكفاءات: the answers that count are sent to the server, which re-computes their verdict (GameEvidenceController)
  const auth = useContext(AuthContext);
  const tokenRef = useRef(null);
  tokenRef.current = auth?.token ?? null;
  useEffect(() => {
    const flush = () => flushGameEvidence(tokenRef.current);
    flush();
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, []);

  useEffect(() => {
    if (failed || !canvas.current) return undefined;
    let g;
    try {
      const sound = storage.getItem('smarter_world_sound') !== '0';
      g = new DivisorIslesGame(canvas.current, {
        lesson: LESSON,
        save: readSave(config.id),
        sound,
        unlockedKeys: keysFromModules(completedModules),
        onSave: (data) => {
          try {
            storage.setItem(saveKey(config.id), JSON.stringify(data));
          } catch {
            /* storage full or blocked */
          }
        },
        onModule: (n) => onModuleRef.current?.(n),
        onEvidence: (context, ev) => {
          if (previewRef.current) return;
          const payload = payloadOf(config.id, context, ev, newAttemptId());
          if (import.meta.env.DEV) (window.__evidence ??= []).push(payload);
          sendGameEvidence(tokenRef.current, config.id, payload);
        },
      });
    } catch (e) {
      console.error('[gameworld]', e);
      setFailed(true);
      return undefined;
    }
    if (import.meta.env.DEV) {
      window.__world = g;
      window.__cases = { answerOf };
    }
    setGame(g);
    return () => {
      g.dispose();
      setGame(null);
    };
  }, [config.id, run, failed]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // « من البداية » restarts the STORY only: what the practice earned (levels, keys ever owned) stays
  const restart = () => {
    try {
      const old = readSave(config.id);
      storage.setItem(
        saveKey(config.id),
        JSON.stringify({
          v: 1,
          stage: 0,
          practice: old?.practice ?? {},
          keysEver: [...new Set([...(old?.keysEver ?? []), ...(old?.keys ?? [])])],
        }),
      );
    } catch {
      /* noop */
    }
    setRun((n) => n + 1);
  };

  if (failed) {
    return (
      <div className="di-fallback" dir="rtl">
        <p>{T.noWebgl}</p>
        <Link to={classicHref} className="di-btn di-btn--primary">
          {T.hud.classic}
        </Link>
      </div>
    );
  }

  return createPortal(
    <div className="di-root" dir="rtl" ref={root} data-gameworld="divisor-isles">
      {preview && (
        <div className="di-preview" data-di-preview>
          <span>معاينة الأستاذ: ما يراه التلميذ. لا شيء يُسجَّل.</span>
          <a href={exitTo}>خروج من المعاينة</a>
        </div>
      )}
      <canvas ref={canvas} className="di-canvas" />
      {!game && <div className="di-loading">{T.loading}</div>}
      {game && (
        <LessonProvider lesson={LESSON}>
          <Shell
            game={game}
            rootRef={root}
            exitTo={exitTo}
            classicHref={classicHref}
            basePath={basePath}
            config={config}
            onRestart={restart}
            mastery={mastery}
          />
        </LessonProvider>
      )}
    </div>,
    document.body,
  );
}

function Shell({ game, rootRef, exitTo, classicHref, basePath, config, onRestart, mastery }) {
  const s = useSyncExternalStore(game.subscribe, game.getState);
  const [full, setFull] = useState(false);
  const coarse = useMemo(() => window.matchMedia?.('(pointer: coarse)').matches, []);
  const { upright } = usePhoneScreen();
  useEffect(() => {
    const on = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  };
  const toggleSound = () => {
    const on = !s.sound;
    game.setSound(on);
    try {
      storage.setItem('smarter_world_sound', on ? '1' : '0');
    } catch {
      /* noop */
    }
  };
  const stars = Object.values(s.stars).reduce((a, b) => a + b, 0);
  const o = s.overlay;
  // PAPER MODE: a calculation step of the depot or the store of the last bridge is written work — the music stops for it
  const paperOn =
    (o?.type === 'boss' && o.view !== 'choose') ||
    Boolean(s.depot && s.phase === 'depot' && !s.depot.busy && s.depot.step?.type === 'number');
  useEffect(() => {
    game.paperMode('shell', paperOn);
    return () => game.paperMode('shell', false);
  }, [game, paperOn]);
  const playing = (s.phase === 'play' || s.phase === 'forge' || s.phase === 'dialog') && !s.dash && !s.depot;

  return (
    <>
      {upright && <TurnPhone title={T.turn.title} body={T.turn.body} data-di-turn />}
      {/* top bar */}
      <header className="di-top">
        <div className="di-top__side">
          <Link to={exitTo} className="di-icon" aria-label={T.hud.exit} title={T.hud.exit}>
            <X size={20} />
          </Link>
          {s.phase !== 'title' && (
            <span className="di-pill di-pill--name">
              {s.islandName}
              <span className="di-steps" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <i key={i} className={i < s.stage ? 'is-done' : i === s.stage ? 'is-now' : ''} />
                ))}
              </span>
            </span>
          )}
        </div>
        <div className="di-top__side di-top__side--end">
          {s.phase !== 'title' && (
            <>
              <span className="di-pill" title={T.hud.stars}>
                <Star size={16} className="di-ic-star" />{' '}
                <b dir="ltr">
                  {stars}
                  <small>/{MAX_STARS}</small>
                </b>
              </span>
              <span className="di-pill" title={T.hud.gems}>
                <Gem size={16} className="di-ic-gem" /> <b dir="ltr">{s.gems}</b>
              </span>
              <button
                type="button"
                className="di-pill di-keys"
                onClick={() => game.openBag()}
                title={T.hud.bag}
                aria-label={T.hud.bag}
                data-di-open-map
              >
                {Object.entries(T.tablets)
                  .filter(([, v]) => v.icon)
                  .map(([id, v]) => (
                    <span key={id} className={s.keys.includes(id) ? 'is-on' : ''}>
                      {v.icon}
                    </span>
                  ))}
              </button>
            </>
          )}
          <button type="button" className="di-icon" onClick={toggleSound} aria-label={T.hud.sound} title={T.hud.sound}>
            {s.sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button type="button" className="di-icon" onClick={toggleFull} aria-label={T.hud.full} title={T.hud.full}>
            {full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      {/* objective + equation */}
      {playing && (
        <div className="di-center">
          {s.objective && !s.equation && (
            <div className="di-objective" key={s.objective}>
              {s.objective}
            </div>
          )}
          {s.pinned && !s.equation && (
            <div className="di-pinned">
              <span>🧠</span>
              <M>{s.pinned}</M>
            </div>
          )}
          {s.equation && <Equation eq={s.equation} />}
          {s.equation && s.verdict && <Verdict v={s.verdict} />}
          {s.toast && <Toast key={s.toast.id} toast={s.toast} />}
        </div>
      )}

      {s.dash && <DashHud dash={s.dash} game={game} paused={s.phase !== 'dash'} />}

      {s.say && s.phase !== 'title' && s.dash?.mode !== 'practice' && !s.depot && <Say key={s.say.id} say={s.say} />}

      {/* the prompt floats IN the world, above the thing to use (Game.placePrompt moves it); the bottom button stays for thumbs */}
      {s.phase === 'play' && s.prompt && (
        <button
          type="button"
          className="di-wprompt"
          ref={(el) => {
            game.promptEl = el;
          }}
          style={{ visibility: 'hidden' }}
          onPointerDown={(e) => {
            e.preventDefault();
            game.input.press('act');
          }}
          data-di-wprompt
        >
          <span className="di-wprompt__in">
            {coarse ? (
              <em>{T.prompt.tap}</em>
            ) : (
              <>
                <em>{T.prompt.press}</em>
                <kbd>E</kbd>
              </>
            )}
            <strong>{s.prompt}</strong>
          </span>
        </button>
      )}

      {/* controls */}
      {s.phase === 'play' && (
        <div className="di-controls">
          {coarse && <Stick game={game} />}
          <div className="di-actions">
            {s.held != null && <span className="di-held">{`القالب ${s.held}`}</span>}
            {s.prompt && (
              <button
                type="button"
                className="di-act"
                onPointerDown={(e) => {
                  e.preventDefault();
                  game.input.press('act');
                }}
                data-di-act
              >
                <span>{s.prompt}</span>
                {!coarse && <kbd>E</kbd>}
              </button>
            )}
            <button
              type="button"
              className="di-jump"
              aria-label={T.controls.jump}
              onPointerDown={(e) => {
                e.preventDefault();
                game.input.press('jump');
              }}
            >
              <ArrowUp size={22} />
              {!coarse && <kbd>{T.controls.space}</kbd>}
            </button>
          </div>
        </div>
      )}

      {s.phase === 'title' && !o && !s.dash && !s.depot && (
        <Title
          s={s}
          game={game}
          onBegin={() => (launchDone(config.id) ? game.start() : game.openLaunch(true))}
          onRestart={onRestart}
          classicHref={classicHref}
          coarse={coarse}
        />
      )}
      {o?.type === 'predict' && <Predict o={o} game={game} />}
      {o?.type === 'quiz' && <Quiz key={o.id} o={o} game={game} />}
      {o?.type === 'forge' && (
        <RuleForge key={o.key} game={game} log={o.log} onSeal={(record) => game.sealRule(o.key, record)} />
      )}
      {o?.type === 'tablet' && <Tablet id={o.key} mine={s.rules?.[o.key]} onClose={() => game.closeTablet()} fresh />}
      {o?.type === 'statues' && <Statues game={game} />}
      {o?.type === 'workshop' && <Workshop o={o} game={game} />}
      {o?.type === 'boss' && <Boss key={`${o.view}-${o.b ?? ''}`} o={o} game={game} />}
      {s.paper && o?.type !== 'know' && o?.type !== 'sitting' && <PaperChip className="di-pchip--float" />}
      {s.depot && <DepotHud d={s.depot} eq={s.equation} game={game} paused={s.phase !== 'depot'} />}
      {o?.type === 'map' && (
        <KnowledgeMap key={`map-${o.sel ?? ''}-${o.space ?? ''}`} s={s} game={game} sel={o.sel} space0={o.space} />
      )}
      {o?.type === 'know' && <KnowledgePage s={s} game={game} sel={o.sel} />}
      {o?.type === 'sitting' && (
        <ExamSitting
          key={`sit-${o.level}-${o.n}`}
          game={game}
          level={o.level}
          weak={o.weak}
          onFinish={(subject, answers) =>
            game.finishSitting(o.level, totalMark(subject, answers), subject.total, weakKinds(subject, answers))
          }
          onQuit={() => game.quitSitting()}
        />
      )}
      {o?.type === 'promotion' && <Promotion o={o} game={game} />}
      {o?.type === 'progress' && (
        <ProgressPage s={s} game={game} mastery={mastery} lessonId={config.id} lessonTitle={config.title} />
      )}
      {o?.type === 'lab' && (
        <Suspense fallback={null}>
          <LessonLab inline lessonCode={config.id} lessonTitle={config.title} onClose={() => game.closeMap()} />
        </Suspense>
      )}
      {o?.type === 'launch' && (
        <Suspense fallback={null}>
          <LaunchKit
            inline
            lessonCode={config.id}
            lessonTitle={config.title}
            onClose={() => game.closeMap()}
            onDone={() => game.launched(o.then)}
          />
        </Suspense>
      )}
      {o?.type === 'caseGuide' && <CaseGuide o={o} game={game} />}
      {o?.type === 'guide' && <Guide o={o} game={game} />}
      {o?.type === 'rule' && (
        <Tablet
          id={o.key}
          onClose={() => game.closeRule()}
          closeLabel={o.back === 'run' ? T.practice.back : T.map.close}
        />
      )}
      {o?.type === 'result' && <Result o={o} s={s} game={game} />}
      {o?.type === 'end' && (
        <End s={s} o={o} stars={stars} game={game} basePath={basePath} config={config} onRestart={onRestart} />
      )}
    </>
  );
}

function Equation({ eq, unit = planks }) {
  const { a, b, q, r, live } = eq;
  // a remainder that is not 0 is a FACT about the mould, not a mistake: amber, never the red of an error
  const col = live ? '#fbbf24' : r === 0 ? '#34d399' : '#fb923c';
  return (
    <div className={`di-eq ${live ? '' : r === 0 ? 'is-ok' : 'is-open'}`}>
      <M>{`${a} = ${b} \\times ${q} + \\textcolor{${col}}{${r}}`}</M>
      <div className="di-eq__legend">
        <span>{unit(q)}</span>
        <span style={{ color: col }}>{`${T.hud.remainder}: ${r}`}</span>
      </div>
    </div>
  );
}

/** The two results of a forge, kept apart: the student's prediction first, then what the mould does to the gap. */
function Verdict({ v }) {
  return (
    <div className="di-verdict" data-di-verdict={v.right === null ? 'none' : v.right ? 'right' : 'wrong'}>
      {v.right === true && (
        <p className="di-verdict__pred is-right">
          <b>✓</b> {T.verdict.right(v.r)}
          {v.first && <span className="di-verdict__star">★ {T.verdict.star}</span>}
        </p>
      )}
      {v.right === false && <p className="di-verdict__pred is-wrong">{T.verdict.wrong(v.predicted, v.r)}</p>}
      <p className={`di-verdict__bridge ${v.holds ? 'is-holds' : ''}`}>
        {v.holds ? T.verdict.holds(v.b, v.a) : T.verdict.open(v.b, v.a)}
      </p>
    </div>
  );
}

function Toast({ toast }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 3200);
    return () => clearTimeout(t);
  }, []);
  return on ? (
    <div className={`di-toast di-toast--${toast.tone}`}>
      {toast.tone === 'good' ? '★ ' : ''}
      {toast.text}
    </div>
  ) : null;
}

function Say({ say }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), say.hold * 1000);
    return () => clearTimeout(t);
  }, [say.hold]);
  if (!on) return null;
  return (
    <div className="di-say" role="status">
      <span className="di-say__face" aria-hidden="true">
        <i />
        <i />
      </span>
      <p>
        <MathText>{say.text}</MathText>
      </p>
    </div>
  );
}

function Stick({ game }) {
  const base = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const move = (e) => {
    const r = base.current.getBoundingClientRect();
    let x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const l = Math.hypot(x, y);
    if (l > 1) {
      x /= l;
      y /= l;
    }
    setKnob({ x, y });
    game.input.setStick(x, -y);
  };
  const end = () => {
    setKnob({ x: 0, y: 0 });
    game.input.setStick(0, 0);
  };
  useEffect(() => () => game.input.setStick(0, 0), [game]);
  return (
    <div
      className="di-stick"
      ref={base}
      dir="ltr"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons || e.pointerType === 'touch') move(e);
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <span style={{ transform: `translate(${knob.x * 34}px, ${knob.y * 34}px)` }} />
    </div>
  );
}

function DashHud({ dash, game, paused }) {
  const practice = dash.mode === 'practice';
  return (
    <>
      <div className="di-dash" data-di-dash={dash.mode}>
        <div className="di-dash__meta">
          <span className="di-dash__hearts">
            {[0, 1, 2].map((i) => (
              <Heart key={i} size={20} className={i < dash.hearts ? 'is-on' : ''} fill="currentColor" />
            ))}
          </span>
          <span dir="ltr">
            {dash.index}
            {'\u00a0/\u00a0'}
            {dash.total}
          </span>
          {practice && (
            <span className="di-dash__score" title={T.practice.score}>
              <Star size={15} className="di-ic-star" /> <b dir="ltr">{dash.score}</b>
            </span>
          )}
          {practice && dash.streak >= 3 && (
            <span className="di-dash__streak" key={dash.streak} title={T.practice.streak}>
              <Flame size={16} /> <b dir="ltr">{dash.streak}</b>
            </span>
          )}
        </div>
        {!dash.done && !paused && (
          <div className="di-dash__say" key={`${dash.index}-${dash.say}`}>
            <small>{dash.hint ? <M>{dash.hint.replaceAll('$', '')}</M> : T.objective.dash}</small>
            <strong>
              <MathText>{dash.say}</MathText>
            </strong>
          </div>
        )}
      </div>
      {practice && !paused && (
        <div className="di-dash__tools">
          <button type="button" className="di-pill" onClick={() => game.showRule()} data-di-rule>
            <Lightbulb size={17} /> {T.practice.rule}
          </button>
          <button type="button" className="di-pill" onClick={() => game.quitPractice()} data-di-quit>
            <X size={16} /> {T.practice.quit}
          </button>
        </div>
      )}
      {!paused && (
        <div className="di-lanes" dir="ltr">
          <button
            type="button"
            aria-label="يسار"
            onPointerDown={(e) => {
              e.preventDefault();
              game.input.press('left');
            }}
          >
            <ArrowLeft size={30} />
          </button>
          <button
            type="button"
            aria-label="يمين"
            onPointerDown={(e) => {
              e.preventDefault();
              game.input.press('right');
            }}
          >
            <ArrowRight size={30} />
          </button>
        </div>
      )}
    </>
  );
}

function Card({ children, tone = '', wide = false }) {
  return (
    <div className="di-veil">
      <div className={`di-card ${tone} ${wide ? 'di-card--wide' : ''}`} role="dialog" aria-modal="true">
        <Fit avail={cardRoom}>{children}</Fit>
      </div>
    </div>
  );
}

function Title({ s, game, onBegin, onRestart, classicHref, coarse }) {
  return (
    <div className="di-title">
      <div className="di-title__box">
        <p className="di-title__eyebrow">التعرّف على قاسم لعدد طبيعي</p>
        <h1>{T.title}</h1>
        <p className="di-title__sub">{T.subtitle}</p>
        <button type="button" className="di-btn di-btn--primary di-btn--xl" onClick={onBegin} data-di-start>
          {s.hasSave ? T.resume : T.start}
        </button>
        <div className="di-row di-row--wrap di-title__doors">
          <button type="button" className="di-btn di-btn--map" onClick={() => game.openKnow()} data-di-know-open>
            <BookOpen size={18} /> {TX.know.open}
          </button>
          <button type="button" className="di-btn di-btn--map" onClick={() => game.openMap()} data-di-map>
            <MapIcon size={18} /> {TX.hub.open}
          </button>
          <button
            type="button"
            className="di-btn di-btn--map"
            onClick={() => game.openProgress()}
            data-di-progress-open
          >
            <Trophy size={18} /> {TX.progress.open}
          </button>
          <button
            type="button"
            className="di-btn di-btn--map di-btn--lab"
            onClick={() => game.openLab()}
            data-di-lab-open
          >
            <FlaskConical size={18} /> {TX.lab.open}
          </button>
          <button
            type="button"
            className="di-btn di-btn--map di-btn--kit"
            onClick={() => game.openLaunch(false)}
            data-di-launch-open
          >
            <Backpack size={18} /> {TX.launch.open}
          </button>
        </div>
        {s.hasSave && (
          <button type="button" className="di-link" onClick={onRestart}>
            <RotateCcw size={14} /> {T.restart}
          </button>
        )}
        {!coarse && (
          <ul className="di-title__keys">
            <li>
              <kbd>←</kbd>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>→</kbd> {T.controls.move}
            </li>
            <li>
              <kbd>{T.controls.space}</kbd> {T.controls.jump}
            </li>
            <li>
              <kbd>E</kbd> {T.controls.act}
            </li>
          </ul>
        )}
        <Link to={classicHref} className="di-link di-link--dim">
          {T.hud.classic}
        </Link>
      </div>
    </div>
  );
}

function Predict({ o, game }) {
  return (
    <Card>
      <p className="di-card__eyebrow">{T.predict.title(o.a, o.b)}</p>
      <h2>{T.predict.ask}</h2>
      <div className="di-chips" dir="ltr">
        {o.options.map((v) => (
          <button key={v} type="button" className="di-chip" onClick={() => game.answerPredict(v)} data-di-predict={v}>
            {v}
          </button>
        ))}
      </div>
      <button type="button" className="di-link" onClick={() => game.closeOverlay()}>
        {T.predict.cancel}
      </button>
    </Card>
  );
}

function Quiz({ o, game }) {
  const spec = T.quiz[o.id];
  const [picked, setPicked] = useState([]);
  const [fb, setFb] = useState(null);
  const toggle = (v) => {
    setFb(null);
    setPicked((p) => (spec.multi ? (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]) : [v]));
  };
  const check = () => {
    const res = game.answerQuiz(o.id, picked);
    if (!res.ok) setFb(res);
  };
  const markOf = (v) => fb?.marks?.find((m) => m.v === v);
  return (
    <Card wide>
      <h2>{spec.prompt}</h2>
      <div className={spec.multi ? 'di-chips' : 'di-options'} dir={spec.multi ? 'ltr' : 'rtl'}>
        {spec.options.map((op) => {
          const m = markOf(op.v);
          return (
            <button
              key={op.v}
              type="button"
              className={`${spec.multi ? 'di-chip' : 'di-option'} ${picked.includes(op.v) ? 'is-on' : ''} ${m ? (m.r === 0 ? 'is-fits' : 'is-leaves') : ''}`}
              onClick={() => toggle(op.v)}
              data-di-option={op.v}
            >
              {op.label}
            </button>
          );
        })}
      </div>
      {fb?.feedback && <p className="di-feedback">{fb.feedback}</p>}
      {fb?.marks && (
        <div className="di-marks" data-di-marks>
          {fb.marks.map((m) => (
            <p key={m.v} className={m.r === 0 ? 'is-fits' : 'is-leaves'}>
              <b>{m.r === 0 ? '✓' : '✗'}</b>{' '}
              <MathText>{m.r === 0 ? T.quiz.fits(m.v, m.a, m.q) : T.quiz.leaves(m.v, m.a, m.q, m.r)}</MathText>
            </p>
          ))}
          <p className="di-marks__missing">{T.quiz.missing(fb.missing)}</p>
        </div>
      )}
      <div className="di-row">
        <button
          type="button"
          className="di-btn di-btn--primary"
          disabled={!picked.length}
          onClick={check}
          data-di-check
        >
          {T.quiz.check}
        </button>
        {o.closable && (
          <button type="button" className="di-link" onClick={() => game.quizBack()} data-di-quiz-close>
            {T.quiz.back}
          </button>
        )}
      </div>
    </Card>
  );
}

function TabletBody({ id, mine = null }) {
  const t = T.tablets[id];
  return (
    <>
      <div className="di-tablet__icon">{t.icon}</div>
      <h2>{t.title}</h2>
      {mine && (
        <div className="di-tablet__mine" data-di-my-rule>
          <small>{T.tablets.mine}</small>
          <p>{mine.text}</p>
          {mine.words && <p className="di-tablet__words">« {mine.words} »</p>}
          <small>{T.tablets.theirs}</small>
        </div>
      )}
      {t.lines.map((l) => (
        <p key={l}>
          <MathText>{l}</MathText>
        </p>
      ))}
      {t.list && (
        <ul className="di-tablet__list">
          {t.list.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
      <div className="di-tablet__math">
        {t.math.map((m) => (
          <M key={m}>{m}</M>
        ))}
      </div>
      {t.notes.map((n) => (
        <p key={n} className="di-tablet__note">
          {n}
        </p>
      ))}
    </>
  );
}

function Tablet({ id, onClose, fresh, closeLabel, mine = null }) {
  return (
    <Card tone="di-card--stone">
      {fresh && <p className="di-card__eyebrow">{mine ? T.tablets.forged : T.tablets.got}</p>}
      <TabletBody id={id} mine={mine} />
      <button type="button" className="di-btn di-btn--primary" onClick={onClose} data-di-tablet>
        {closeLabel ?? T.tablets.close}
      </button>
    </Card>
  );
}

/** Where each node of the lesson's mind map sits (percent of the map box; RTL: the « start » lane is on the right). */
const MAP_POS = {
  root: [50, 9],
  'qasim-baqi': [77, 34],
  'qasim-jidaa': [23, 34],
  'siyagh-mutakafia': [50, 57],
  'wahid-wa-nafsuh': [75, 84],
  [EXAM]: [25, 84],
};
const MAP_EDGES = [
  ['root', 'qasim-baqi', 'means'],
  ['root', 'qasim-jidaa', 'means'],
  ['qasim-baqi', 'qasim-jidaa', 'same', true],
  ['qasim-baqi', 'siyagh-mutakafia', 'also'],
  ['qasim-jidaa', 'siyagh-mutakafia', null],
  ['siyagh-mutakafia', 'wahid-wa-nafsuh', 'special'],
  ['siyagh-mutakafia', EXAM, 'sum'],
  ['wahid-wa-nafsuh', EXAM, null, true],
];
const nodeMeta = (id) => (id === EXAM ? T.map.exam : T.tablets[id]);
const Stars = ({ n, size = 16 }) => (
  <span className="di-stars3" dir="ltr">
    {[1, 2, 3].map((i) => (
      <Star key={i} size={size} className={i <= n ? 'is-on' : ''} />
    ))}
  </span>
);

/**
 * « خريطة المعرفة » — the lesson's mind map as the level select of the practice game: the idea, its two definitions, the four
 * sentences, 1 and the number itself, and the summary « تحدّي الامتحان ». A node lights up with its key; its three pips are its
 * three levels. The panel beside it reminds the rule and lists the levels, easiest first.
 */
function KnowledgeMap({ s, game, sel: selFrom, space0 }) {
  const [space, setSpace] = useState(space0 ?? 'game');
  const keys = s.openKeys;
  const progress = s.practice;
  const next = nextLevel(keys, progress);
  const [sel, setSel] = useState(
    () =>
      selFrom ??
      next?.node ??
      Math.max(
        0,
        PRACTICE_NODES.findIndex((_, i) => nodeOpen(i, keys, progress)),
      ),
  );
  const total = practiceStars(progress);
  const node = PRACTICE_NODES[sel];
  const meta = nodeMeta(node.id);
  const open = nodeOpen(sel, keys, progress);
  const openById = (id) =>
    id === 'root' ||
    nodeOpen(
      PRACTICE_NODES.findIndex((n) => n.id === id),
      keys,
      progress,
    );
  return (
    <div className="di-veil">
      <div className="di-card di-mapcard" role="dialog" aria-modal="true" data-di-mapcard>
        <Fit avail={cardRoom}>
          <header className="di-map__head">
            <div>
              <h2>{TX.hub.title}</h2>
              <div className="di-spaces" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={space === 'game'}
                  className={space === 'game' ? 'is-on' : ''}
                  onClick={() => setSpace('game')}
                  data-di-space="game"
                >
                  <Zap size={16} /> {TX.spaces.game}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={space === 'exam'}
                  className={space === 'exam' ? 'is-on' : ''}
                  onClick={() => setSpace('exam')}
                  data-di-space="exam"
                >
                  {examOpen(keys, progress) ? <FileText size={16} /> : <Lock size={15} />} {TX.spaces.exam}
                </button>
                <span className="di-dim">{space === 'game' ? TX.spaces.gameSub : TX.spaces.examSub}</span>
              </div>
            </div>
            <div className="di-map__total" title={T.map.stars}>
              <Star size={20} className="di-ic-star" />{' '}
              <b dir="ltr">
                {total}
                {'\u00a0/\u00a0'}
                {MAX_PRACTICE_STARS}
              </b>
              <span className="di-bar">
                <i style={{ width: `${(total / MAX_PRACTICE_STARS) * 100}%` }} />
              </span>
            </div>
            <button type="button" className="di-btn di-btn--map" onClick={() => game.openKnow()} data-di-hub-know>
              <BookOpen size={17} /> {TX.hub.toKnow}
            </button>
            <button
              type="button"
              className="di-icon"
              onClick={() => game.closeMap()}
              aria-label={T.map.close}
              data-di-map-close
            >
              <X size={20} />
            </button>
          </header>

          {space === 'exam' && <ExamLadder s={s} game={game} />}
          {space === 'game' && (
            <div className="di-map__body">
              <div className="di-map" dir="ltr">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {MAP_EDGES.map(([a, b, , dashed]) => (
                    <line
                      key={`${a}-${b}`}
                      x1={MAP_POS[a][0]}
                      y1={MAP_POS[a][1]}
                      x2={MAP_POS[b][0]}
                      y2={MAP_POS[b][1]}
                      className={`${openById(a) && openById(b) ? 'is-lit' : ''} ${dashed ? 'is-dashed' : ''}`}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                {MAP_EDGES.filter(([, , label]) => label).map(([a, b, label]) => (
                  <span
                    key={`${a}-${b}`}
                    className="di-map__edge"
                    dir="rtl"
                    style={{
                      left: `${(MAP_POS[a][0] + MAP_POS[b][0]) / 2}%`,
                      top: `${(MAP_POS[a][1] + MAP_POS[b][1]) / 2}%`,
                    }}
                  >
                    {T.map.edges[label]}
                  </span>
                ))}
                <span
                  className="di-map__root"
                  dir="rtl"
                  style={{ left: `${MAP_POS.root[0]}%`, top: `${MAP_POS.root[1]}%` }}
                >
                  {T.map.root}
                </span>
                {PRACTICE_NODES.map((n, i) => {
                  const m = nodeMeta(n.id);
                  const isOpen = nodeOpen(i, keys, progress);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      dir="rtl"
                      className={`di-node ${isOpen ? 'is-open' : 'is-locked'} ${i === sel ? 'is-sel' : ''} ${n.id === EXAM ? 'di-node--exam' : ''}`}
                      style={{ left: `${MAP_POS[n.id][0]}%`, top: `${MAP_POS[n.id][1]}%` }}
                      onClick={() => setSel(i)}
                      data-di-node={n.id}
                      data-open={isOpen}
                    >
                      <span className="di-node__icon">{isOpen ? m.icon : <Lock size={22} />}</span>
                      <strong>{m.title}</strong>
                      <span className="di-node__pips">
                        {n.levels.map((_, l) => {
                          const st = progress[levelId(i, l)]?.stars ?? 0;
                          return <i key={l} className={st === 3 ? 'is-gold' : st > 0 ? 'is-done' : ''} />;
                        })}
                      </span>
                    </button>
                  );
                })}
              </div>

              <aside className="di-map__panel" data-di-panel={node.id}>
                <div className="di-map__panelhead">
                  <span>{open ? meta.icon : '🔒'}</span>
                  <h3>{meta.title}</h3>
                </div>
                {!open && (
                  <p className="di-feedback di-feedback--soft">{node.id === EXAM ? T.map.examLocked : T.map.locked}</p>
                )}
                {open && node.id === EXAM && <p className="di-dim">{meta.text}</p>}
                {open && node.id !== EXAM && (
                  <div className="di-map__rule">
                    <M>{meta.math[0]}</M>
                    <p>{meta.notes[0]}</p>
                    <button type="button" className="di-link" onClick={() => game.showRule(node.id)}>
                      <Lightbulb size={15} /> {T.map.rule}
                    </button>
                  </div>
                )}
                <ol className="di-levels">
                  {node.levels.map((_, l) => {
                    const id = levelId(sel, l);
                    const can = levelOpen(sel, l, keys, progress);
                    const st = progress[id]?.stars ?? 0;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className={`di-level ${can ? '' : 'is-locked'} ${next?.id === id ? 'is-next' : ''}`}
                          disabled={!can}
                          onClick={() => game.startPractice(sel, l)}
                          data-di-level={id}
                          title={can ? T.map.play : T.map.levelLocked}
                        >
                          <span className={`di-level__go ${isDepot(sel, l) ? 'is-depot' : ''}`}>
                            {!can ? (
                              <Lock size={16} />
                            ) : isDepot(sel, l) ? (
                              <Truck size={19} />
                            ) : (
                              <Zap size={19} fill="currentColor" />
                            )}
                          </span>
                          <span className="di-level__name">
                            <b>{T.map.level(l + 1)}</b>
                            <small>{LESSON.text.levels[node.id][l]}</small>
                          </span>
                          <span className="di-level__score">
                            <Stars n={st} />
                            {progress[id]?.best > 0 && <small dir="ltr">{progress[id].best}</small>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </aside>
            </div>
          )}

          {space === 'game' && (
            <footer className="di-row">
              {next ? (
                <button
                  type="button"
                  className="di-btn di-btn--primary di-btn--wide"
                  onClick={() => game.startPractice(next.node, next.level)}
                  data-di-next
                >
                  <Play size={18} fill="currentColor" /> {T.map.next}:{' '}
                  {LESSON.text.levels[PRACTICE_NODES[next.node].id][next.level]}
                </button>
              ) : (
                <p className="di-dim">{keys.length ? T.map.allDone : T.map.locked}</p>
              )}
            </footer>
          )}
        </Fit>
      </div>
    </div>
  );
}

/** After a wrong gate the run stops: why the chosen number does not fit, why the right one does — and the rule when lost. */
function Guide({ o, game }) {
  const g = explain(o.wave, o.picked);
  const right = o.wave.gates[o.wave.good];
  return (
    <Card wide>
      <p className="di-card__eyebrow">{T.practice.guide}</p>
      <h2 className="di-guide__q">
        <MathText>{waveSay(o.wave)}</MathText>
      </h2>
      <div className="di-guide" data-di-guide>
        <div className="is-leaves">
          <b>✗</b>
          <div>
            <strong>{T.practice.picked(o.picked)}</strong>
            <p>
              <MathText>{g.wrong}</MathText>
            </p>
          </div>
        </div>
        <div className="is-fits">
          <b>✓</b>
          <div>
            <strong>{T.practice.right(right)}</strong>
            <p>
              <MathText>{g.right}</MathText>
            </p>
          </div>
        </div>
      </div>
      {o.lost && (
        <div className="di-guide__rule" data-di-guide-rule>
          <p className="di-card__eyebrow">{T.practice.lost}</p>
          <div className="di-map__rule">
            <strong>
              {T.tablets[o.wave.key].icon} {T.tablets[o.wave.key].title}
            </strong>
            <p>
              <MathText>{T.tablets[o.wave.key].lines[0]}</MathText>
            </p>
            <M>{T.tablets[o.wave.key].math[0]}</M>
          </div>
        </div>
      )}
      {(() => {
        const w = o.wave;
        const tip =
          w.type === 'remainder'
            ? divisionTip(w.a, w.b)
            : ['divisorOf', 'divides'].includes(w.type)
              ? ruleTip(w.a, right)
              : null;
        return tip ? (
          <p className="di-tip" data-di-tip>
            <b>💡 {TX.tip}</b> <MathText>{tip}</MathText>
          </p>
        ) : null;
      })()}
      {o.again && <p className="di-dim">{T.practice.again}</p>}
      <div className="di-row">
        <button
          type="button"
          className="di-btn di-btn--primary"
          onClick={() => game.resumeRun()}
          data-di-resume
          autoFocus
        >
          {T.practice.go}
        </button>
        {!o.lost && (
          <button type="button" className="di-link" onClick={() => game.showRule(o.wave.key)} data-di-remind>
            <Lightbulb size={15} /> {T.practice.remind}
          </button>
        )}
      </div>
    </Card>
  );
}

/**
 * « تعاونية الواحة » — the screen of a real-world case: the order at the top (what the client wants), the equality the depot
 * is packing, and at the bottom the ONE step to decide now (choose a crate, or write numbers in the shape of the answer).
 */
function DepotHud({ d, eq, game, paused }) {
  const step = d.step;
  const W = LESSON.text.worlds[d.world] ?? LESSON.text.worlds.depot;
  const [picked, setPicked] = useState([]);
  const [vals, setVals] = useState({});
  const [model, setModel] = useState(null);
  useEffect(() => {
    setPicked([]);
    setVals({});
  }, [d.index, d.stepIndex]);
  // the earlier steps of the day can be read again: the question, what the student answered, the explanation
  const H = (d.history ?? []).filter((x) => x.done);
  const [rev, setRev] = useState(null);
  useEffect(() => {
    setRev(null);
  }, [d.index, d.stepIndex]);
  const R = rev !== null ? H[rev] : null;
  const slots = step?.type === 'number' ? step.tokens.filter((t) => typeof t === 'object') : [];
  const ready = step?.type === 'number' ? slots.every((t) => (vals[t.slot] ?? '') !== '') : picked.length === 2;
  const choose = (v) => {
    if (d.busy || !step) return;
    if (step.pick === 2)
      setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : p.length < 2 ? [...p, v] : [p[1], v]));
    else game.answerCase(v);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!ready || d.busy || !step) return;
    game.answerCase(
      step.type === 'number' ? Object.fromEntries(slots.map((t) => [t.slot, Number(vals[t.slot])])) : picked,
    );
  };
  return (
    <>
      <div className="di-order" data-di-order={d.kind}>
        <div className="di-order__meta">
          <b>
            <Truck size={16} /> {W.name} · {W.order(d.index, d.total)}
          </b>
          <span className="di-dash__hearts">
            {[0, 1, 2].map((i) => (
              <Heart key={i} size={18} className={i < d.hearts ? 'is-on' : ''} fill="currentColor" />
            ))}
          </span>
          <span className="di-order__money" title={W.earned}>
            <Coins size={16} /> <b dir="ltr">{d.earned}</b> {W.unit}
          </span>
        </div>
        <p>
          <MathText>{R ? R.brief : d.brief}</MathText>
        </p>
        {(R ? R.facts : d.facts)?.length > 0 && (
          <ul className="di-facts" data-di-facts aria-label="ما نعرفه">
            {(R ? R.facts : d.facts).map((f) => (
              <li key={f}>
                <MathText>{f}</MathText>
              </li>
            ))}
          </ul>
        )}
      </div>
      {eq && (
        <div className="di-order__eq">
          <Equation eq={eq} unit={(q) => simUnit(q, eq.mode)} />
        </div>
      )}
      {!paused && (
        <div className="di-dash__tools">
          <button type="button" className="di-pill" onClick={() => game.showRule()} data-di-rule>
            <Lightbulb size={17} /> {T.practice.rule}
          </button>
          <button type="button" className="di-pill" onClick={() => game.quitPractice()} data-di-quit>
            <X size={16} /> {T.practice.quit}
          </button>
        </div>
      )}
      {!paused && (
        <form className={`di-step ${d.busy ? 'is-busy' : ''}`} onSubmit={submit} data-di-step={step?.id ?? 'shipping'}>
          <Fit avail={stepRoom} innerClass="di-step__in">
            {H.length > 0 && (
              <div className="di-hist" dir="rtl" data-di-hist>
                <small>{TX.depot.history}</small>
                {H.map((x, k) => (
                  <button
                    key={`${x.oi}-${x.si}`}
                    type="button"
                    className={`${k === rev ? 'is-on' : ''} ${x.attempts.length > 1 ? 'is-late' : ''}`}
                    onClick={() => setRev(k === rev ? null : k)}
                    title={x.prompt}
                    data-di-hist-dot={k}
                  >
                    {W.order(x.oi + 1, d.total).split(' ')[0]} {x.oi + 1} · {x.si + 1}
                  </button>
                ))}
                {R && (
                  <button type="button" className="is-now" onClick={() => setRev(null)} data-di-hist-back>
                    {TX.depot.backNow}
                  </button>
                )}
              </div>
            )}
            {R && (
              <div className="di-review" data-di-review>
                <p className="di-review__head">
                  <b>{TX.depot.review}</b> <span>{TX.depot.step(R.si + 1, R.steps)}</span>
                </p>
                <p className="di-review__q">{R.prompt}</p>
                {R.attempts.map((at, k) => (
                  <div key={k} className={`di-review__a ${at.ok ? 'is-ok' : 'is-ko'}`}>
                    <b>{at.ok ? '✓' : '✗'}</b> <small>{TX.depot.mine}</small>
                    <span className="di-review__ans" dir="ltr">
                      {at.parts.map((pt, j) => (
                        <span key={j} dir={pt.rtl ? 'rtl' : 'ltr'} className={pt.mine ? 'is-mine' : ''}>
                          {pt.text}
                        </span>
                      ))}
                    </span>
                    <p>
                      <MathText>{at.text}</MathText>
                    </p>
                  </div>
                ))}
                {R.tip && (
                  <p className="di-tip">
                    <b>💡 {TX.tip}</b> <MathText>{R.tip}</MathText>
                  </p>
                )}
              </div>
            )}
            <div hidden={Boolean(R)} className="di-step__live">
              {d.note && (
                <p className="di-step__note" data-di-note>
                  <b>✓</b> <MathText>{d.note}</MathText>
                </p>
              )}
              {d.note && d.tip && (
                <p className="di-tip" data-di-tip>
                  <b>💡 {TX.tip}</b> <MathText>{d.tip}</MathText>
                </p>
              )}
              <p className="di-step__prompt">
                {step && d.steps > 1 && <small>{TX.depot.step(d.stepIndex + 1, d.steps)}</small>}
                {!step ? W.done : d.busy ? LESSON.text.busy : step.prompt}
              </p>
              {!d.busy && step && (
                <div className="di-step__row">
                  {step.type === 'choose' && (
                    <div className="di-opts" dir="ltr">
                      {step.options.map((op) => (
                        <button
                          key={op.v}
                          type="button"
                          className={`di-opt ${picked.includes(op.v) ? 'is-on' : ''}`}
                          onClick={() => choose(op.v)}
                          data-di-opt={op.v}
                        >
                          <strong>{op.label}</strong>
                          <small dir="rtl">{op.sub}</small>
                        </button>
                      ))}
                    </div>
                  )}
                  {step.type === 'number' && (
                    <PaperGate
                      key={`${d.index}-${d.stepIndex}`}
                      tip={PT.tipCompute}
                      onModel={
                        step.div
                          ? () => {
                              game.markHelped();
                              setModel(twin(step.div[0], step.div[1]));
                            }
                          : undefined
                      }
                    >
                      <div className="di-template di-template--case" dir="ltr">
                        {step.tokens.map((t, i) =>
                          typeof t === 'string' ? (
                            <span key={`${t}-${i}`} dir={t === 'دج' ? 'rtl' : 'ltr'}>
                              {t}
                            </span>
                          ) : (
                            <label key={t.slot}>
                              <Num
                                value={vals[t.slot] ?? ''}
                                onChange={(v) => setVals((x) => ({ ...x, [t.slot]: v }))}
                                w={t.w}
                                aria-label={t.label}
                                autoFocus={t === slots[0]}
                                data-di-slot={t.slot}
                              />
                              <small dir="rtl">{t.label}</small>
                            </label>
                          ),
                        )}
                      </div>
                      <button type="submit" className="di-btn di-btn--primary" disabled={!ready} data-di-case-check>
                        {TX.depot.check}
                      </button>
                    </PaperGate>
                  )}
                  {step.pick === 2 && (
                    <button type="submit" className="di-btn di-btn--primary" disabled={!ready} data-di-case-check>
                      {TX.depot.pack}
                    </button>
                  )}
                </div>
              )}
            </div>
            {model && <PaperModel a={model.a} b={model.b} onClose={() => setModel(null)} />}
          </Fit>
        </form>
      )}
    </>
  );
}

/** After a wrong step of a case: what the answer PRODUCED (never the answer), the rule when lost, and « try again ». */
function CaseGuide({ o, game }) {
  const t = T.tablets[o.key];
  return (
    <Card wide>
      <p className="di-card__eyebrow">{TX.depot.guide}</p>
      <h2 className="di-guide__q">{o.prompt}</h2>
      <div className="di-guide" data-di-case-guide>
        <div className="is-leaves">
          <b>✗</b>
          <div>
            <p>
              <MathText>{o.text}</MathText>
            </p>
          </div>
        </div>
      </div>
      {o.lost && (
        <div className="di-guide__rule" data-di-guide-rule>
          <p className="di-card__eyebrow">{T.practice.lost}</p>
          <div className="di-map__rule">
            <strong>
              {t.icon} {t.title}
            </strong>
            <p>
              <MathText>{t.lines[0]}</MathText>
            </p>
            <M>{t.math[0]}</M>
          </div>
        </div>
      )}
      <div className="di-row">
        <button
          type="button"
          className="di-btn di-btn--primary"
          onClick={() => game.resumeCase()}
          data-di-case-retry
          autoFocus
        >
          {TX.depot.retry}
        </button>
        {!o.lost && (
          <button type="button" className="di-link" onClick={() => game.showRule(o.key)} data-di-remind>
            <Lightbulb size={15} /> {T.practice.remind}
          </button>
        )}
      </div>
    </Card>
  );
}

function Result({ o, s, game }) {
  const meta = nodeMeta(PRACTICE_NODES[o.node].id);
  return (
    <Card wide tone={o.win ? 'di-card--gold' : ''}>
      <p className="di-card__eyebrow">
        {meta.icon} {meta.title} · {T.map.level(o.level + 1)} — {LESSON.text.levels[PRACTICE_NODES[o.node].id][o.level]}
      </p>
      <h2 data-di-result={o.win ? 'win' : 'lose'}>{o.win ? T.practice.win[o.stars - 1] : T.practice.lose}</h2>
      {o.win ? (
        <div className="di-result__stars">
          <Stars n={o.stars} size={54} />
        </div>
      ) : (
        <p>{T.practice.loseText}</p>
      )}
      {!o.win && o.why && (
        <p className="di-feedback di-feedback--soft">
          <MathText>{o.why}</MathText>
        </p>
      )}
      <div className={`di-stats ${o.money ? 'di-stats--2' : 'di-stats--3'}`}>
        <div>
          <b>
            {o.money ? (
              <>
                <span dir="ltr">{o.score}</span> {(LESSON.text.worlds[o.world] ?? LESSON.text.worlds.depot).unit}
              </>
            ) : (
              <span dir="ltr">{o.score}</span>
            )}
          </b>
          <span>{o.money ? (LESSON.text.worlds[o.world] ?? LESSON.text.worlds.depot).earned : T.practice.score}</span>
          {o.newBest && <em>{T.practice.newBest}</em>}
        </div>
        {!o.money && (
          <div>
            <b dir="ltr">{o.streak}</b>
            <span>{T.practice.streak}</span>
          </div>
        )}
        <div>
          <b dir="ltr">{o.mistakes}</b>
          <span>{T.practice.mistakes}</span>
        </div>
      </div>
      <div className="di-row di-row--wrap">
        {o.win && o.next && (
          <button
            type="button"
            className="di-btn di-btn--primary"
            onClick={() => game.startPractice(o.next.node, o.next.level)}
            data-di-result-next
          >
            <Play size={17} fill="currentColor" /> {T.practice.nextLevel}
          </button>
        )}
        <button
          type="button"
          className={`di-btn ${o.win && o.next ? '' : 'di-btn--primary'}`}
          onClick={() => game.startPractice(o.node, o.level)}
          data-di-result-retry
        >
          <RotateCcw size={16} /> {T.practice.retry}
        </button>
        {!o.win && o.key && (
          <button type="button" className="di-btn" onClick={() => game.showRule(o.key)}>
            <Lightbulb size={16} /> {T.practice.remind}
          </button>
        )}
        <button type="button" className="di-btn" onClick={() => game.openMap()} data-di-result-map>
          <MapIcon size={16} /> {T.practice.map}
        </button>
      </div>
      <p className="di-dim">
        <Star size={14} className="di-ic-star" />{' '}
        <span dir="ltr">
          {practiceStars(s.practice)}
          {'\u00a0/\u00a0'}
          {MAX_PRACTICE_STARS}
        </span>
      </p>
    </Card>
  );
}

function Statues({ game }) {
  // every sentence starts written the wrong way round
  const [order, setOrder] = useState(() => STATUES.sentences.map((x) => !x.smallFirst));
  const [res, setRes] = useState(null);
  const flip = (i) => {
    setRes(null);
    setOrder((o) => o.map((v, k) => (k === i ? !v : v)));
  };
  const firstWrong = res ? res.findIndex((ok) => !ok) : -1;
  return (
    <Card wide>
      <p className="di-card__eyebrow">{T.statues.title}</p>
      <p className="di-fact">
        {T.statues.fact} <M>{`${STATUES.big} = ${STATUES.small} \\times ${STATUES.q}`}</M>
      </p>
      <p className="di-dim">{T.statues.ask}</p>
      <div className="di-sentences">
        {STATUES.sentences.map((st, i) => {
          const [x, y] = order[i] ? [STATUES.small, STATUES.big] : [STATUES.big, STATUES.small];
          return (
            <button
              key={st.id}
              type="button"
              className={`di-sentence ${res ? (res[i] ? 'is-ok' : 'is-ko') : ''}`}
              onClick={() => flip(i)}
              data-di-sentence={st.id}
            >
              <b dir="ltr">{x}</b>
              <span>{st.mid}</span>
              <b dir="ltr">{y}</b>
              <i aria-hidden="true">⇄</i>
            </button>
          );
        })}
      </div>
      {firstWrong >= 0 && <p className="di-feedback">{T.statues.hint[STATUES.sentences[firstWrong].id]}</p>}
      <div className="di-row">
        <button
          type="button"
          className="di-btn di-btn--primary"
          onClick={() => setRes(game.submitStatues(order))}
          data-di-check
        >
          {T.statues.go}
        </button>
        <button type="button" className="di-link" onClick={() => game.closeOverlay()}>
          {T.workshop.close}
        </button>
      </div>
    </Card>
  );
}

function Workshop({ o, game }) {
  const [b, setB] = useState(1 + Math.floor((o.max - o.min) / 2));
  return (
    <Card>
      <p className="di-card__eyebrow">{T.workshop.title}</p>
      <h2>{T.workshop.ask}</h2>
      <div className="di-stepper" dir="ltr">
        <button type="button" onClick={() => setB((v) => Math.max(o.min, v - 1))} aria-label="−" data-di-minus>
          −
        </button>
        <output>{b}</output>
        <button type="button" onClick={() => setB((v) => Math.min(o.max, v + 1))} aria-label="+" data-di-plus>
          +
        </button>
      </div>
      <div className="di-plankbar" dir="ltr" aria-hidden="true">
        {Array.from({ length: o.max }, (_, i) => (
          <span key={i} className={i < b ? 'is-on' : ''} />
        ))}
      </div>
      <div className="di-row">
        <button type="button" className="di-btn di-btn--primary" onClick={() => game.craft(b)} data-di-craft>
          {T.workshop.make}
        </button>
        <button type="button" className="di-link" onClick={() => game.closeOverlay()}>
          {T.workshop.close}
        </button>
      </div>
    </Card>
  );
}

function Num({ value, onChange, w = 3, ...rest }) {
  return (
    <input
      className="di-num"
      dir="ltr"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      style={{ width: `${w + 1.2}ch` }}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, w + 2))}
      {...rest}
    />
  );
}

/**
 * The store of the last bridge. The mission is written at the top and never leaves; three steps: choose a mould and compute,
 * watch the world build it, pay. A mould already tried shows what it left.
 */
function Boss({ o, game }) {
  const [q, setQ] = useState('');
  const [r, setR] = useState('');
  const [cost, setCost] = useState('');
  const [err, setErr] = useState(null);
  const [model, setModel] = useState(null);
  const step = o.view === 'cost' ? 2 : 0;
  const submit = (e) => {
    e.preventDefault();
    if (o.view === 'cost') {
      if (cost === '' || !game.bossCost(Number(cost))) setErr(T.boss.err.cost(cost === '' ? '…' : cost));
      return;
    }
    if (q === '' || r === '') {
      setErr(T.boss.err.nan);
      return;
    }
    const st = game.bossDivision(o.b, Number(q), Number(r));
    if (st === 'long') setErr(T.boss.err.long(o.b, Number(q)));
    else if (st === 'sum') setErr(T.boss.err.sum(o.b, Number(q), Number(r)));
    else if (st === 'big') setErr(T.boss.err.big(o.b, Number(r)));
    else if (st !== 'ok') setErr(T.boss.err.nan);
  };
  return (
    <Card wide>
      <p className="di-card__eyebrow">{T.boss.title}</p>
      <p className="di-fact" data-di-boss-mission>
        {T.boss.mission}
      </p>
      <ol className="di-bsteps">
        {T.boss.steps.map((label, i) => (
          <li key={label} className={i === step ? 'is-now' : i < step ? 'is-done' : ''}>
            <b>{i + 1}</b>
            {label}
          </li>
        ))}
      </ol>

      {o.view === 'choose' && (
        <>
          <h2>{T.boss.choose}</h2>
          <div className="di-moulds" dir="ltr">
            {[32, 36].map((b) => {
              const left = o.tried?.[b];
              return (
                <button
                  key={b}
                  type="button"
                  className={`di-mouldcard ${left != null ? 'is-tried' : ''}`}
                  onClick={() => game.bossPick(b)}
                  data-di-mould={b}
                >
                  <strong>{b}</strong>
                  <span dir="rtl">{T.boss.mould(b)}</span>
                  <em dir="rtl">{left != null ? `✗ ${T.boss.tried(left)}` : T.boss.untried}</em>
                </button>
              );
            })}
          </div>
          <p className="di-dim">{T.boss.price}</p>
          <div className="di-row">
            <button type="button" className="di-link" onClick={() => game.closeOverlay()}>
              {T.boss.close}
            </button>
          </div>
        </>
      )}

      {o.view !== 'choose' && (
        <form onSubmit={submit}>
          {o.view === 'divide' ? (
            <>
              <h2>{T.boss.divide(o.b)}</h2>
              <PaperGate tip={PT.tipDivision} onModel={() => setModel(twin(756, o.b))}>
                <div className="di-template" dir="ltr">
                  <span>756</span>
                  <span>=</span>
                  <span>{o.b}</span>
                  <span>×</span>
                  <label>
                    <Num
                      value={q}
                      onChange={(v) => {
                        setQ(v);
                        setErr(null);
                      }}
                      w={2}
                      autoFocus
                      aria-label={T.boss.qLabel}
                      data-di-q
                    />
                    <small dir="rtl">{T.boss.qLabel}</small>
                  </label>
                  <span>+</span>
                  <label>
                    <Num
                      value={r}
                      onChange={(v) => {
                        setR(v);
                        setErr(null);
                      }}
                      w={2}
                      aria-label={T.boss.rLabel}
                      data-di-r
                    />
                    <small dir="rtl">{T.boss.rLabel}</small>
                  </label>
                </div>
              </PaperGate>
            </>
          ) : (
            <>
              <h2>{T.boss.costAsk(o.b, o.q)}</h2>
              <PaperGate tip={PT.tipCompute}>
                <div className="di-template" dir="ltr">
                  <span>{o.q}</span>
                  <span>×</span>
                  <span>1850</span>
                  <span>=</span>
                  <Num
                    value={cost}
                    onChange={(v) => {
                      setCost(v);
                      setErr(null);
                    }}
                    w={5}
                    autoFocus
                    aria-label="المبلغ"
                    data-di-cost
                  />
                </div>
              </PaperGate>
            </>
          )}
          {model && <PaperModel a={model.a} b={model.b} onClose={() => setModel(null)} />}
          {err && (
            <p className="di-feedback" data-di-boss-error>
              <MathText>{err}</MathText>
            </p>
          )}
          <div className="di-row">
            <button type="submit" className="di-btn di-btn--primary" data-di-check>
              {o.view === 'cost' ? T.boss.pay : T.boss.forge}
            </button>
            {o.view === 'divide' && (
              <button type="button" className="di-link" onClick={() => game.bossBack()} data-di-boss-back>
                {T.boss.change}
              </button>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}

function End({ s, o, stars, game, basePath, config, onRestart }) {
  const min = Math.max(1, Math.round(o.elapsed / 60000));
  return (
    <Card wide tone="di-card--gold">
      <div className="di-tablet__icon">🏆</div>
      <h2>{T.end.title}</h2>
      <p>{T.end.text}</p>
      <div className="di-stats">
        <div>
          <Star size={20} className="di-ic-star" />
          <b dir="ltr">
            {stars}
            {'\u00a0/\u00a0'}
            {MAX_STARS}
          </b>
          <span>{T.end.stars}</span>
        </div>
        <div>
          <Gem size={20} className="di-ic-gem" />
          <b dir="ltr">{s.gems}</b>
          <span>{T.end.gems}</span>
        </div>
        <div>
          <b dir="ltr">{s.falls}</b>
          <span>{T.end.falls}</span>
        </div>
        <div>
          <b>{min} د</b>
          <span>{T.end.time}</span>
        </div>
      </div>
      <div className="di-keys di-keys--big">
        {Object.entries(T.tablets)
          .filter(([, v]) => v.icon)
          .map(([id, v]) => (
            <span key={id} className={s.keys.includes(id) ? 'is-on' : ''} title={v.title}>
              {v.icon}
            </span>
          ))}
      </div>
      <div className="di-row di-row--wrap">
        <button type="button" className="di-btn di-btn--primary" onClick={() => game.openMap()} data-di-end-practice>
          <MapIcon size={17} /> {T.practice.exam}
        </button>
        <Link to={`${basePath}/itqan`} className="di-btn">
          {T.end.test}
        </Link>
        <Link to={`/espace/pratique/${config.id}`} className="di-btn">
          {T.end.practice}
        </Link>
        <button type="button" className="di-btn" onClick={() => game.roam()}>
          {T.end.stay}
        </button>
        <button type="button" className="di-link" onClick={onRestart}>
          <RotateCcw size={14} /> {T.end.again}
        </button>
      </div>
    </Card>
  );
}
