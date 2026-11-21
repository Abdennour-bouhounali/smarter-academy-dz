/**
 * « قصر الساحات » on screen — what this world gives the kit's shell (`kit/LessonWorld.jsx` lists every field): its HUD
 * (the instruction that stays, the rod in his hand, what the platform did), the card that asks a prediction before a
 * platform is lowered, and the rule forge with this world's mirror and experiments. It names no lesson.
 */
import GateRunHud from '../kit/GateRunHud';
import { useMemo, useState } from 'react';
import LessonWorld from '../kit/LessonWorld';
import RuleForge, { UseLines } from '../kit/RuleForge';
import MathText from '../../components/MathText';
import { Card, M, Num } from '../kit/parts';
import { Instruction, Recall } from '../kit/Instruction';
import { RootCourtsGame } from './Game';
import { Mirror, Line, beats } from './forgeParts';
import Inquiry from './Inquiry';
import { WORLD_TEXT, withStory, tiles } from './strings';
import './rootCourts.css';

const FORGE_PARTS = { Mirror, Line, beats, Inquiry };

/** The rod in his hand: its length, the court it is for, and the marks of its dial when the terrace offers several. */
function RodChip({ rod, game }) {
  const T = game.T;
  const yard = rod.left != null;
  return (
    <div className="rc-rod" data-rc-rod={rod.s} data-rc-step={rod.step} data-di-clear>
      <span className="rc-rod__cell">
        <small>{yard ? T.hud.side : T.hud.rod}</small>
        <b dir="ltr">{rod.s}</b>
      </span>
      <span className="rc-rod__cell">
        <small>{yard ? T.hud.crate : T.hud.court}</small>
        <b>{tiles(rod.a)}</b>
      </span>
      {rod.covers != null && (
        <span className="rc-rod__cell rc-rod__cell--math" data-rc-covers={rod.covers}>
          <M>{`${rod.tex} \\times ${rod.tex} = ${rod.covers.replace(',', '{,}')}`}</M>
        </span>
      )}
      {yard && (
        <span
          className={`rc-rod__cell rc-rod__left ${rod.left === 0 ? 'is-even' : rod.left < 0 ? 'is-short' : ''}`}
          data-rc-left={rod.left}
        >
          {rod.left === 0 ? T.hud.empty : rod.left > 0 ? T.hud.left(rod.left) : T.hud.missing(-rod.left)}
        </span>
      )}
      <button type="button" className="rc-rod__drop" onClick={() => game.putDown()} data-rc-drop>
        <kbd>X</kbd>
        {T.prompt.drop}
      </button>
      {rod.steps.length > 1 && (
        <span className="rc-rod__steps" role="group" aria-label={T.hud.step}>
          <small>{T.hud.step}</small>
          {rod.steps.map((step) => (
            <button
              key={step}
              type="button"
              className={step === rod.step ? 'is-on' : ''}
              onClick={() => game.setStep(step)}
              data-rc-set-step={step}
            >
              <span dir="ltr">{step}</span>
            </button>
          ))}
        </span>
      )}
    </div>
  );
}

/** What the platform holds, beside the court — then what the world did with it: a fact, in the colour of that fact. */
function Lowered({ eq, verdict, game }) {
  const T = game.T.verdict;
  const tone = eq.kind === 'ride' ? 'is-ok' : eq.kind ? 'is-open' : '';
  return (
    <>
      <div className={`di-eq rc-eq ${tone}`} data-rc-eq={eq.kind ?? 'live'}>
        {eq.wall ? (
          <span className="rc-eq__wall">{game.T.hud.wall}</span>
        ) : (
          <M>{`${eq.s} \\times ${eq.s} = ${eq.covers}`}</M>
        )}
        <div className="di-eq__legend">
          <span>
            {eq.yard ? game.T.hud.crate : game.T.hud.court}: {tiles(eq.a)}
          </span>
        </div>
      </div>
      {verdict && (
        <div className="di-verdict rc-verdict" data-di-verdict={verdict.kind} data-rc-predicted={String(verdict.right)}>
          {verdict.right === true && (
            <p className="di-verdict__pred is-right">
              <b>✓</b> {T.right(verdict.covers)}
              {verdict.first && <span className="di-verdict__star">★ {T.star}</span>}
            </p>
          )}
          {verdict.right === false && (
            <p className="di-verdict__pred is-wrong">{T.wrong(verdict.predicted, verdict.covers)}</p>
          )}
          <p className={`di-verdict__bridge rc-verdict--${verdict.kind} ${verdict.kind === 'ride' ? 'is-holds' : ''}`}>
            {verdict.yard
              ? verdict.kind === 'ride'
                ? T.yardRide(eq.a, verdict.side)
                : verdict.kind === 'band'
                  ? T.yardBand(verdict.diff)
                  : T.yardJam(verdict.diff)
              : verdict.kind === 'ride'
                ? T.ride
                : verdict.kind === 'band'
                  ? T.band(verdict.diff)
                  : T.jam(verdict.diff)}
          </p>
          {verdict.wall && <p className="rc-verdict__wall">{T.wall}</p>}
        </div>
      )}
    </>
  );
}

/** Back in his hands after a band or a jam: the last platform's product and what the world did with it, in one line. */
function LastFact({ last, game }) {
  const T = game.T.verdict;
  return (
    <div className={`rc-last rc-last--${last.kind}`} data-rc-last={last.kind} data-di-clear>
      <M>{`${last.s} \\times ${last.s} = ${last.covers}`}</M>
      <span>{last.kind === 'band' ? T.band(last.diff) : T.jam(last.diff)}</span>
    </div>
  );
}

function Hud({ s, game }) {
  return (
    <>
      {s.objective && <Instruction key={s.objective} text={s.objective} compact={Boolean(s.equation || s.rod)} />}
      {s.rod && !s.equation && <RodChip rod={s.rod} game={game} />}
      {s.rod && !s.equation && s.last && <LastFact last={s.last} game={game} />}
      {s.equation && <Lowered eq={s.equation} verdict={s.verdict} game={game} />}
    </>
  );
}

/** Before a platform of whole tiles comes down: how many tiles will it cover? He types it. */
function Predict({ o, game }) {
  const T = game.T.predict;
  const [value, setValue] = useState('');
  const go = () => value.trim() !== '' && game.answerPredict(value);
  return (
    <Card>
      <p className="di-card__eyebrow">{T.title(o.s)}</p>
      <h2>{T.ask}</h2>
      <form
        className="rc-predict"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <span className="rc-predict__box" dir="ltr">
          <Num value={value} onChange={setValue} w={4} autoFocus data-rc-predict />
        </span>
        <span className="rc-predict__unit">{T.unit}</span>
      </form>
      <button
        type="button"
        className="di-btn di-btn--primary"
        onClick={go}
        disabled={value.trim() === ''}
        data-rc-predict-go
      >
        {T.go}
      </button>
      <button type="button" className="di-link" onClick={() => game.closeOverlay()}>
        {T.cancel}
      </button>
    </Card>
  );
}

/**
 * THE FINAL MISSION of a lesson (`story.mission`): one written problem on the last terrace. Each box is named by the
 * words beside it; « تحقّق » answers with a FACT of the world about the first line that does not hold yet.
 */
function Mission({ game }) {
  const m = game.story.mission;
  const lines = useMemo(() => m.lines(), [m]);
  const [vals, setVals] = useState({});
  const [fact, setFact] = useState(null);
  const names = lines.flatMap((l) => l.tokens.filter((t) => typeof t === 'object').map((t) => t.slot));
  const filled = names.every((n) => (vals[n] ?? '') !== '');
  const check = () => {
    const out = m.check(vals);
    if (out === 'ok') game.passMission();
    else setFact(out);
  };
  return (
    <Card wide>
      <p className="di-card__eyebrow">{m.title}</p>
      {m.lead.map((l) => (
        <p key={l} className="rc-mission__lead">
          <MathText>{l}</MathText>
        </p>
      ))}
      <div className="rc-mission__lines" data-rc-mission>
        <UseLines
          lines={lines}
          vals={vals}
          onType={(name, value) => {
            setVals({ ...vals, [name]: value });
            setFact(null);
          }}
        />
      </div>
      {fact && (
        <p className="rc-mission__fact" data-rc-mission-fact>
          <MathText>{fact}</MathText>
        </p>
      )}
      <div className="rc-mission__go">
        <button
          type="button"
          className="di-btn di-btn--primary"
          disabled={!filled}
          onClick={check}
          data-rc-mission-check
        >
          {game.T.mission.check}
        </button>
        <button type="button" className="di-btn" onClick={() => game.closeMission()} data-rc-mission-later>
          {game.T.mission.later}
        </button>
      </div>
    </Card>
  );
}

const WORLD = {
  id: 'root-courts',
  Game: RootCourtsGame,
  playing: (s) => s.phase === 'play' || s.phase === 'forge' || s.phase === 'dialog' || s.phase === 'lift',
  busy: (s) => s.phase === 'lift' || s.phase === 'forge',
  held: (s) => s.held,
  Hud,
  Under: ({ s }) =>
    !s.overlay && (s.phase === 'play' || s.phase === 'forge' || s.phase === 'lift') ? (
      <Recall lines={s.recall} title={WORLD_TEXT.recall.title} />
    ) : null,
  /** The course of gates draws over everything while it is run (`kit/GateRunHud.jsx`). */
  Over: ({ s, game }) =>
    s.run ? <GateRunHud run={s.run} game={game} content={game.runContent ?? game.lesson.run} /> : null,
  overlay(o, s, game) {
    if (o.type === 'predict') return <Predict key={o.s} o={o} game={game} />;
    if (o.type === 'mission') return <Mission game={game} />;
    if (o.type === 'guess')
      return (
        <Card>
          <p className="di-card__eyebrow">
            {game.T.hud.court}: {tiles(o.a)}
          </p>
          <h2>{game.T.guess.ask}</h2>
          <div className="rc-mission__go">
            <button
              type="button"
              className="di-btn di-btn--primary"
              onClick={() => game.answerGuess(true)}
              data-rc-guess="yes"
            >
              {game.T.guess.yes}
            </button>
            <button
              type="button"
              className="di-btn di-btn--primary"
              onClick={() => game.answerGuess(false)}
              data-rc-guess="no"
            >
              {game.T.guess.no}
            </button>
          </div>
        </Card>
      );
    if (o.type === 'forge')
      return (
        <RuleForge
          key={o.key}
          forge={game.lesson.forges[o.key]}
          parts={FORGE_PARTS}
          game={game}
          log={o.log}
          onSeal={(record) => game.sealRule(o.key, record)}
        />
      );
    return null;
  },
};

/** What the shell needs to know of the STORY being played: how many terraces, how many stars, its title and its end. */
function worldOf(lesson) {
  const { terraces, text = {} } = lesson.story;
  const T = withStory(WORLD_TEXT, text);
  return {
    ...WORLD,
    stages: terraces.length,
    maxStars: terraces.reduce((n, t) => n + (t.courts?.length ?? 0), 0) * 3,
    text: {
      title: T.title,
      subtitle: T.subtitle,
      turn: T.turn.body,
      end: T.end,
    },
  };
}

export default function RootCourts({ lesson, ...props }) {
  const world = useMemo(() => worldOf(lesson), [lesson]);
  return <LessonWorld world={world} lesson={lesson} {...props} />;
}
