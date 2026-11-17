/**
 * How THIS world draws a case of a rule forge (kit/RuleForge.jsx › `parts`): a bridge — a gap of `a` cells, planks of `b`.
 * A case may carry a `text` (a sentence about the bridge): it is then written above the bridge and in its line.
 */
const WHICH = 'أيّ جسر تعنيه؟ المرآة ستبنيه بعد جوابك.';
const cells = (n) => (n <= 10 ? `${n} خانات` : `${n} خانة`);

/** The bridge in the mirror: `a` cells, planks of `b`, what is left in amber. `stage`: ask (the gap and one plank) | build | done. */
function Mirror({ c, stage, fast }) {
  const W = 720;
  const cell = Math.min(34, W / Math.max(c.a, c.b));
  const x0 = (W - cell * c.a) / 2;
  const built = stage !== 'ask';
  const done = stage === 'done';
  // the plank shown before the build stands over the gap's first cells; one that is longer than the gap is centred
  const sampleX = c.b > c.a ? (W - cell * c.b) / 2 : x0;
  // a SENTENCE is asked alone: showing its bridge before he answers would tell him how to read it
  if (c.text && stage === 'ask')
    return (
      <>
        <p className="rf-sentence rf-sentence--alone" data-rf-sentence>
          « {c.text} »
        </p>
        <p className="rf-sentence__hint">{WHICH}</p>
      </>
    );
  return (
    <>
      {c.text && (
        <p className="rf-sentence" data-rf-sentence>
          « {c.text} »
        </p>
      )}
      <svg
        viewBox={`0 0 ${W} 150`}
        className={`rf-bridge is-${stage} ${done ? (c.held ? 'is-held' : 'is-fell') : ''} ${c.text ? 'has-sentence' : ''}`}
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
        {(!built || c.b > c.a) && (
          <g>
            <rect x={sampleX} y="30" width={cell * c.b - 2} height="24" rx="6" className="rf-plank rf-plank--sample" />
            <text x={sampleX + (cell * c.b) / 2} y="22" textAnchor="middle" className="rf-cap">
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
              style={{ animationDelay: `${k * (fast ? 8 : 110)}ms` }}
            />
          ))}
        <text x={W / 2} y="142" textAnchor="middle" className="rf-cap rf-cap--a">
          {cells(c.a)}
        </text>
      </svg>
    </>
  );
}

const Mini = ({ c }) => {
  const W = 150;
  const cell = W / Math.max(c.a, 1);
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

const L = {
  mirror: 'بنته المرآة',
  plank: (b) => `لوح ${b}`,
  held: 'ثبت',
  fell: (c) =>
    c.b > c.a
      ? 'انهار: اللوح أطول'
      : c.r === 1
        ? 'انهار: بقيت خانة'
        : c.r === 2
          ? 'انهار: بقيت خانتان'
          : `انهار: بقيت ${c.r} خانات`,
  true: 'صحيحة',
  false: 'خاطئة',
};

/** A bridge as one line of the evidence; `children` = what the student's rule says of it, while it is tested. */
function Line({ c, children }) {
  return (
    <>
      <div className={c.text ? 'rf-line--sentence' : ''}>
        {c.mirror && (
          <i className="rf-inmirror" title={L.mirror}>
            🪞
          </i>
        )}
        {c.text ? (
          <span>{c.text}</span>
        ) : (
          <>
            <strong dir="ltr">{c.a}</strong> <span>{L.plank(c.b)}</span>
          </>
        )}
        <em>{c.text ? (c.held ? L.true : L.false) : c.held ? L.held : L.fell(c)}</em>
      </div>
      <div className="rf-line2">
        <Mini c={c} />
        {children}
      </div>
    </>
  );
}

export const FORGE_PARTS = { Mirror, Line, beats: (c) => c.q };
