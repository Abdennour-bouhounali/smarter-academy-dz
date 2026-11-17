/**
 * The DRAWINGS of the opening situations of a lesson memo (`lessonMemos.js › openings`). Drawn in code, never generated:
 * each figure is computed from the numbers of its situation (`openingFacts`) — the planks laid, the players left, the
 * books that do not fit, the gap no tile fills — so the drawing IS the argument and can never show a wrong count.
 * No person is drawn (people are the platform's one shared character, kept for the lessons). Calm palette; amber marks
 * what is LEFT, green what fits exactly.
 */
import { openingFacts } from './lessonMemos';

const INK = '#0f172a';
const LINE = '#94a3b8';
const FILL = '#e2e8f0';
const OK = '#34d399';
const LEFT = '#fbbf24';
const W = 420;
const H = 190;
const Cap = ({ x, y, children, tone = INK, size = 17 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fontSize={size}
    fontWeight="800"
    fill={tone}
    direction="rtl"
    style={{ fontFamily: 'Cairo, sans-serif' }}
  >
    {children}
  </text>
);
const Svg = ({ children, label, id }) => (
  <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="mf" data-memo-figure={id}>
    {children}
  </svg>
);

/** A gap of `a` cells, planks of `b` laid from the right; the cells nothing covers stay open. */
function Bridge({ o }) {
  const { a, first: f } = openingFacts(o);
  const cell = 300 / a;
  const x0 = 60;
  const xR = x0 + 300;
  return (
    <Svg id="bridge" label={o.title}>
      <rect x="0" y="150" width={W} height="40" fill="#bae6fd" />
      <rect x="0" y="92" width={x0} height="98" fill="#cbd5e1" />
      <rect x={xR} y="92" width={W - xR} height="98" fill="#cbd5e1" />
      {Array.from({ length: a }, (_, i) => (
        <rect
          key={i}
          x={x0 + i * cell + 0.7}
          y="92"
          width={cell - 1.4}
          height="20"
          rx="3"
          fill={i < f.r ? LEFT : '#fff'}
          stroke={i < f.r ? '#d97706' : LINE}
          strokeDasharray={i < f.r ? '0' : '3 2'}
        />
      ))}
      {Array.from({ length: f.q }, (_, k) => (
        <rect
          key={k}
          x={xR - (k + 1) * f.b * cell + 1.5}
          y="89"
          width={f.b * cell - 3}
          height="26"
          rx="5"
          fill="#f59e0b"
          stroke="#78350f"
          strokeWidth="1.5"
        />
      ))}
      <Cap x={W / 2} y="34">
        {a} خانة · ألواح طولها {f.b}
      </Cap>
      <Cap x={W / 2} y="64" tone={f.exact ? '#047857' : '#b45309'}>
        {f.q} ألواح{f.exact ? ' — يثبت' : ` — تبقى ${f.r} خانات`}
      </Cap>
    </Svg>
  );
}

/** `a` players as dots; `b` equal teams; those no team can take stay outside. */
function Teams({ o }) {
  const { first: f } = openingFacts(o);
  const gap = W / (f.b + 1);
  return (
    <Svg id="teams" label={o.title}>
      <rect x="6" y="52" width={W - 12} height="92" rx="14" fill="#ecfdf5" stroke="#6ee7b7" />
      {Array.from({ length: f.b }, (_, t) => {
        const cx = gap * (t + 1);
        return (
          <g key={t}>
            <circle cx={cx} cy="98" r="34" fill="#fff" stroke={LINE} strokeWidth="1.5" />
            {Array.from({ length: f.q }, (_, k) => {
              const ang = (2 * Math.PI * k) / f.q - Math.PI / 2;
              const r = f.q === 1 ? 0 : 17;
              return <circle key={k} cx={cx + r * Math.cos(ang)} cy={98 + r * Math.sin(ang)} r="7" fill={INK} />;
            })}
          </g>
        );
      })}
      {Array.from({ length: f.r }, (_, k) => (
        <circle key={k} cx={W / 2 + (k - (f.r - 1) / 2) * 22} cy="166" r="7" fill={LEFT} stroke="#d97706" />
      ))}
      <Cap x={W / 2} y="20">
        {o.a} لاعبًا · {f.b} فِرق
      </Cap>
      <Cap x={W / 2} y="44" tone={f.exact ? '#047857' : '#b45309'}>
        {f.q} في كلّ فريق{f.exact ? '' : ` — يبقى ${f.r} خارج الفرق`}
      </Cap>
    </Svg>
  );
}

/** Two kinds of shelves for the same books: one kind is filled exactly, the other leaves books on the floor. */
function Shelves({ o }) {
  const { a, first: f, second: s } = openingFacts(o);
  const Row = ({ y, fit }) => {
    const n = 12;
    const filled = fit.exact ? n : Math.max(1, Math.round((fit.r / fit.b) * n));
    return (
      <g>
        <rect x="150" y={y} width="250" height="46" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
        <rect x="150" y={y + 42} width="250" height="5" fill={LINE} />
        {Array.from(
          { length: n },
          (_, k) =>
            (fit.exact || k < filled) && (
              <rect
                key={k}
                x={156 + k * 20}
                y={y + 8}
                width="15"
                height="34"
                rx="2"
                fill={fit.exact ? OK : LEFT}
                stroke={fit.exact ? '#047857' : '#d97706'}
              />
            ),
        )}
        <Cap x="76" y={y + 20} size={14}>
          رفوف تسع {fit.b}
        </Cap>
        <Cap x="76" y={y + 40} size={13} tone={fit.exact ? '#047857' : '#b45309'}>
          {fit.exact ? `${fit.q} رفًّا مملوءًا` : `${fit.q} رفًّا، ويبقى ${fit.r}`}
        </Cap>
      </g>
    );
  };
  return (
    <Svg id="shelves" label={o.title}>
      <Cap x={W / 2} y="22">
        {a} كتابًا
      </Cap>
      <Row y={38} fit={s} />
      <Row y={112} fit={f} />
    </Svg>
  );
}

/** A strip of `a` cm covered by square tiles: one size leaves a gap smaller than a tile, the other fits exactly. */
function Tiles({ o }) {
  const { a, first: f, second: s } = openingFacts(o);
  const k = 320 / a;
  const x0 = 80;
  const Row = ({ y, fit }) => (
    <g>
      <rect x={x0} y={y} width="320" height="40" fill="#fff" stroke={LINE} strokeDasharray="4 3" />
      {Array.from({ length: fit.q }, (_, i) => (
        <rect
          key={i}
          x={x0 + i * fit.b * k + 1}
          y={y + 1}
          width={fit.b * k - 2}
          height="38"
          rx="3"
          fill={fit.exact ? OK : FILL}
          stroke={fit.exact ? '#047857' : '#64748b'}
        />
      ))}
      {!fit.exact && (
        <rect x={x0 + fit.q * fit.b * k + 1} y={y + 1} width={fit.r * k - 2} height="38" fill={LEFT} stroke="#d97706" />
      )}
      <Cap x="40" y={y + 18} size={15}>
        {fit.b} cm
      </Cap>
      <Cap x="40" y={y + 36} size={13} tone={fit.exact ? '#047857' : '#b45309'}>
        {fit.exact ? `${fit.q} بلاطات` : `فراغ ${fit.r} cm`}
      </Cap>
    </g>
  );
  return (
    <Svg id="tiles" label={o.title}>
      <Cap x={W / 2} y="24">
        شريط طوله {a} cm
      </Cap>
      <Row y={44} fit={f} />
      <Row y={112} fit={s} />
    </Svg>
  );
}

const KINDS = { bridge: Bridge, teams: Teams, shelves: Shelves, tiles: Tiles };
export default function MemoFigure({ opening }) {
  const Figure = KINDS[opening.kind];
  return Figure ? <Figure o={opening} /> : null;
}
