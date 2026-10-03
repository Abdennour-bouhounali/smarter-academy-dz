import {
  layoutGeoFigure, tickMarks, parallelArrows, rightAngleSquare, angleArc,
} from './geoFigure';

/**
 * Une figure de géométrie DÉCLARATIVE (points nommés, segments, droites, demi-droites, polygones,
 * angles droits, angles, traits d'égalité, chevrons de parallélisme) — la donnée est décrite dans
 * geoFigure.js. Dessinée en SVG, jamais une image ; les noms de points et les longueurs sont du
 * texte LTR (`direction="ltr"`), l'élément porte un `aria-label` arabe.
 *
 * Utilisée par les leçons de l'unité 9 « خاصية طالس » et par la pratique (`statement.figure`,
 * features/practice/ExerciseStatement.jsx) : un exercice qui dit « في الشكل المقابل » montre le shape.
 */
const STROKE = {
  slate: '#334155', indigo: '#4f46e5', rose: '#e11d48', emerald: '#059669', amber: '#d97706', sky: '#0284c7', violet: '#7c3aed',
};
const FILL = {
  slate: 'rgba(100,116,139,0.10)', indigo: 'rgba(79,70,229,0.12)', rose: 'rgba(225,29,72,0.10)', emerald: 'rgba(5,150,105,0.12)',
  amber: 'rgba(217,119,6,0.12)', sky: 'rgba(2,132,199,0.12)', violet: 'rgba(124,58,237,0.12)',
};
const asSegment = (s) => (Array.isArray(s) ? { from: s[0], to: s[1] } : s);
const pts = (list) => list.map((p) => p.join(',')).join(' ');

export default function GeoFigure(fig) {
  const { ariaLabel, maxWidth = 360, caption, inline = false } = fig;
  // `inline` : la figure posée DANS un paragraphe (l'énoncé d'une épreuve du BossFinal est un <p>) —
  // des <span> blocs au lieu de <figure>/<figcaption>, que le HTML refuse dans un <p>.
  const Fig = inline ? 'span' : 'figure';
  const Cap = inline ? 'span' : 'figcaption';
  const L = layoutGeoFigure(fig);
  const hidden = new Set(fig.hidden ?? []);
  const textProps = { direction: 'ltr', unicodeBidi: 'isolate' };

  return (
    <Fig className="mx-auto my-2 block w-full" style={{ maxWidth }} data-geo-figure>
      <svg
        viewBox={`0 0 ${L.width.toFixed(1)} ${L.height.toFixed(1)}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        {(fig.polygons ?? []).map((p, i) => (
          <polygon key={`pg${i}`} points={pts(p.points.map((n) => L.P[n]))} fill={FILL[p.tone ?? 'indigo']} stroke="none" />
        ))}
        {(fig.lines ?? []).map((l, i) => {
          const [a, b] = L.lineEnds(l);
          const c = STROKE[l.tone ?? 'slate'];
          return (
            <g key={`ln${i}`}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={1.6} strokeDasharray={l.dashed ? '5 4' : undefined} />
              {l.arrows ? parallelArrows(L.P[l.through[0]], L.P[l.through[1]], l.arrows).map((ch, j) => (
                <polyline key={j} points={pts(ch)} fill="none" stroke={c} strokeWidth={1.6} />
              )) : null}
              {l.name && <text x={b[0]} y={b[1] - 6} fontSize={13} fill={c} textAnchor="middle" style={textProps}>{l.name}</text>}
            </g>
          );
        })}
        {(fig.rays ?? []).map((r, i) => {
          const a = L.P[r.from]; const b = L.rayEnd(r);
          const c = STROKE[r.tone ?? 'slate'];
          return (
            <g key={`ry${i}`}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={1.6} strokeDasharray={r.dashed ? '5 4' : undefined} />
              {r.name && <text x={b[0]} y={b[1] - 6} fontSize={13} fill={c} textAnchor="middle" style={textProps}>{r.name}</text>}
            </g>
          );
        })}
        {(fig.segments ?? []).map((s0, i) => {
          const s = asSegment(s0);
          const a = L.P[s.from]; const b = L.P[s.to];
          const c = STROKE[s.tone ?? 'slate'];
          const lab = s.label != null ? L.segmentLabel(s.from, s.to, s.labelSide) : null;
          return (
            <g key={`sg${i}`}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={s.bold ? 2.6 : 1.8} strokeDasharray={s.dashed ? '5 4' : undefined} />
              {s.ticks ? tickMarks(a, b, s.ticks).map((t, j) => (
                <line key={`t${j}`} x1={t[0][0]} y1={t[0][1]} x2={t[1][0]} y2={t[1][1]} stroke={c} strokeWidth={1.4} />
              )) : null}
              {s.arrows ? parallelArrows(a, b, s.arrows).map((ch, j) => (
                <polyline key={`a${j}`} points={pts(ch)} fill="none" stroke={c} strokeWidth={1.6} />
              )) : null}
              {lab && (
                <text x={lab[0]} y={lab[1]} fontSize={13} fontWeight={600} fill={s.tone ? c : '#0f172a'} textAnchor="middle" style={textProps}>{s.label}</text>
              )}
            </g>
          );
        })}
        {(fig.rightAngles ?? []).map(([a, v, b], i) => (
          <polyline key={`ra${i}`} points={pts(rightAngleSquare(L.P[a], L.P[v], L.P[b]))} fill="none" stroke="#e11d48" strokeWidth={1.4} />
        ))}
        {(fig.angles ?? []).map((g, i) => {
          const arc = angleArc(L.P[g.from], L.P[g.at], L.P[g.to], g.radius ?? 20);
          const c = STROKE[g.tone ?? 'emerald'];
          return (
            <g key={`an${i}`}>
              <path d={arc.path} fill="none" stroke={c} strokeWidth={1.6} />
              {g.label && <text x={arc.label[0]} y={arc.label[1]} fontSize={12} fill={c} textAnchor="middle" style={textProps}>{g.label}</text>}
            </g>
          );
        })}
        {Object.keys(L.P).filter((n) => !hidden.has(n)).map((n) => (
          <g key={`pt${n}`}>
            <circle cx={L.P[n][0]} cy={L.P[n][1]} r={2.6} fill="#0f172a" />
            <text x={L.pointLabels[n][0]} y={L.pointLabels[n][1]} fontSize={14} fontWeight={700} fill="#0f172a" textAnchor="middle" style={textProps}>{n}</text>
          </g>
        ))}
      </svg>
      {caption && <Cap className="mt-1 block text-center text-xs text-slate-500">{caption}</Cap>}
    </Fig>
  );
}
