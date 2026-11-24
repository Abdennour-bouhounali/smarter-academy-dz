/**
 * « الأهرامات » on screen — what this world gives the kit's shell (`kit/LessonWorld.jsx` lists every field): its HUD (the
 * instruction that stays, the rope's knots, the fact of what the world built), the register « سجلّ الحقل », the card of
 * the ONE order (one typed box with its printed unit « م »), and the kit's rail between two docks. It names no lesson.
 *
 * Hooks for the walks: `data-np-stage`, `data-np-rope=<knots>`, `data-np-drop`, `data-np-register` (rows:
 * `data-np-row=<id>`), `data-np-order=<kind>` (+ `data-np-predict` on the canal's card), `data-np-order-in`,
 * `data-np-order-send`, `data-np-order-later`, `data-np-refused=<why>`, `data-np-fact=<fact>`, `data-np-look`,
 * `data-np-look-back`; the rail's are the kit's (`data-gr-*`).
 */
import { useMemo, useState } from 'react';
import GateRunHud from '../kit/GateRunHud';
import LessonWorld from '../kit/LessonWorld';
import MathText from '../../components/MathText';
import { Card, M } from '../kit/parts';
import { Instruction, Recall } from '../kit/Instruction';
import { NilePyramidsGame, devHandles } from './Game';
import { WORLD_TEXT, withStory } from './strings';
import './nilePyramids.css';

const texOf = (n) => String(n).replace(',', '{,}');

/** The rope in his hand: its knots, written beside it, and the way to let it go whenever he wants (defects D26). */
export function RopeChip({ rope, game }) {
  const T = game.T.hud;
  return (
    <div className="np-rope" data-np-rope={rope.knots} data-di-clear>
      <span className="np-rope__cell">
        <small>{T.rope}</small>
        <b dir="ltr">{rope.knots}</b>
        <small>{game.T.unit}</small>
      </span>
      <button type="button" className="np-rope__drop" onClick={() => game.drop()} data-np-drop>
        <kbd>E</kbd>
        {T.drop}
      </button>
    </div>
  );
}

/** What the world built from his number: a FACT, in the colour of that fact (amber a gap, violet an overhang). */
export function Fact({ verdict, game }) {
  const T = game.T;
  const tone = { as: 'ok', fits: 'ok', longer: 'gap', gap: 'gap', shorter: 'over', overhang: 'over' }[verdict.fact];
  return (
    <div className={`di-verdict np-fact np-fact--${tone}`} data-np-fact={verdict.fact} data-di-clear>
      <p className="np-fact__line">
        {verdict.kind === 'canal' ? (
          <>
            <span>
              {T.hud.typed} <M>{`${verdict.seg} = ${texOf(verdict.typed)}`}</M>
            </span>
            <span>
              {T.hud.reads} <M>{`${verdict.seg} = ${texOf(verdict.reading)}`}</M>
            </span>
          </>
        ) : (
          <span>
            {T.hud.typed} <M>{`${verdict.seg} = ${texOf(verdict.typed)}`}</M>
          </span>
        )}
      </p>
      <p className="np-fact__what">{T.fact[verdict.fact]}</p>
    </div>
  );
}

function Hud({ s, game }) {
  return (
    <div className="np-hud" data-np-stage={s.at} data-np-look={s.look ?? undefined}>
      {s.objective && !s.look && (
        <Instruction key={s.objective} text={s.objective} compact={Boolean(s.rope || s.verdict)} />
      )}
      {s.rope && <RopeChip rope={s.rope} game={game} />}
      {!s.rope && s.verdict && <Fact verdict={s.verdict} game={game} />}
      {s.look && (
        <button
          type="button"
          className="di-btn di-btn--primary np-back"
          onClick={() => game.endLook()}
          data-np-look-back
        >
          {game.T.hud.back}
        </button>
      )}
    </div>
  );
}

/** « سجلّ الحقل »: the record he was given, then what HE measured and typed. */
export function Register({ reg }) {
  return (
    <aside className="np-register" data-np-register={reg.rows.length}>
      <h3>{reg.title}</h3>
      <ul>
        {reg.rows.map((r) => (
          <li key={r.id} className={`is-${r.kind}`} data-np-row={r.id}>
            <M>{r.tex}</M>
            <small>{WORLD_TEXT.unit}</small>
            {r.by && <small className="np-register__by">{r.by}</small>}
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** THE ONE ORDER's card: one box, digits and one comma (« 77,5 »), its unit printed after it. */
export function OrderCard({ o, game }) {
  const T = game.T.order;
  const C = T[o.kind];
  const [text, setText] = useState('');
  const send = () => game.sendOrder(text);
  return (
    <Card>
      <div data-np-order={o.kind} {...(o.kind === 'canal' ? { 'data-np-predict': '' } : {})}>
        <p className="di-card__eyebrow">{C.title}</p>
        <h2 className="np-order__ask">
          <MathText>{C.ask(o.seg)}</MathText>
        </h2>
        <div className="np-order__line" dir="ltr">
          <M>{`${o.seg} =`}</M>
          <input
            className="di-num np-order__in"
            dir="ltr"
            inputMode="decimal"
            autoFocus
            value={text}
            style={{ width: '7ch' }}
            onChange={(e) => {
              // digits and ONE comma (a point typed is read as the comma)
              const v = e.target.value.replace('.', ',').replace(/[^0-9,]/g, '');
              const [a, ...rest] = v.split(',');
              setText(rest.length ? `${a},${rest.join('')}` : a);
            }}
            onKeyDown={(e) => e.key === 'Enter' && text && send()}
            data-np-order-in
          />
          <span className="np-order__unit">{game.T.unit}</span>
        </div>
        {o.refused && (
          <p className="np-order__refused" data-np-refused={o.refused}>
            {T.refused[o.refused]}
          </p>
        )}
        <div className="np-order__go">
          <button type="button" className="di-btn di-btn--primary" disabled={!text} onClick={send} data-np-order-send>
            {C.send}
          </button>
          <button type="button" className="di-btn" onClick={() => game.closeOrder()} data-np-order-later>
            {T.later}
          </button>
        </div>
      </div>
    </Card>
  );
}

const WORLD = {
  id: 'nile-pyramids',
  Game: NilePyramidsGame,
  devHandles,
  playing: (s) => s.phase === 'play' || s.phase === 'dialog' || s.phase === 'build' || s.phase === 'look',
  busy: (s) => s.phase === 'build' || s.phase === 'sail',
  held: (s) => (s.rope ? WORLD_TEXT.held(s.rope.knots) : null),
  Hud,
  Under: ({ s }) =>
    !s.overlay && (s.phase === 'play' || s.phase === 'build') ? (
      <>
        {s.register && <Register reg={s.register} />}
        <Recall lines={s.recall} title={WORLD_TEXT.recall.title} />
      </>
    ) : null,
  /** The course of gates draws over everything while it is run (`kit/GateRunHud.jsx`). */
  Over: ({ s, game }) =>
    s.run && game.runContent ? <GateRunHud run={s.run} game={game} content={game.runContent} /> : null,
  overlay(o, s, game) {
    if (o.type === 'order') return <OrderCard key={o.id} o={o} game={game} />;
    return null;
  },
};

/** What the shell needs to know of the STORY being played: five docks, three stars each, its title and its end. */
function worldOf(lesson) {
  const T = withStory(WORLD_TEXT, lesson.story?.text ?? {});
  return {
    ...WORLD,
    stages: T.docks.length,
    maxStars: T.docks.length * 3,
    text: { title: T.title, subtitle: T.subtitle, turn: T.turn.body, end: T.end },
  };
}

export default function NilePyramids({ lesson, ...props }) {
  const world = useMemo(() => worldOf(lesson), [lesson]);
  return <LessonWorld world={world} lesson={lesson} {...props} />;
}
