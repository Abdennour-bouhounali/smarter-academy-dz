import React from 'react';

/**
 * Les figures du manuel (pp. 49, 51, 53), REDESSINÉES en SVG (jamais d'image) : elles
 * portent seulement des lettres latines, x et des mesures — tout texte arabe reste dans
 * l'énoncé. Chaque figure est décrite par l'énoncé qui l'accompagne : elle est donc
 * `aria-hidden`, et sa largeur suit le conteneur (lisible du fond de la classe).
 */
const Frame = ({ children, viewBox, label }) => (
  <figure className="mx-auto w-full max-w-[22rem]" dir="ltr" data-figure={label}>
    <svg viewBox={viewBox} width="100%" aria-hidden="true" focusable="false" style={{ display: 'block' }}
      fontFamily="ui-sans-serif, system-ui" fontSize="13">
      {children}
    </svg>
  </figure>
);
const tick = (x1, y1, x2, y2) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#059669" strokeWidth="2" />;

/** دوري الآن 2 (p. 49) : un carré de côté x et un triangle équilatéral, bases accolées sur 28 cm. */
export function SquareTriangleFigure() {
  return (
    <Frame viewBox="0 0 300 170" label="now-49-2">
      <rect x="20" y="20" width="120" height="120" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
      <path d="M20 132 h8 v8" fill="none" stroke="#1D4ED8" />
      {tick(80, 15, 80, 25)}{tick(80, 135, 80, 145)}{tick(15, 80, 25, 80)}{tick(135, 80, 145, 80)}
      <text x="80" y="88" textAnchor="middle" fill="#1D4ED8" fontWeight="bold">x</text>
      <path d="M140 140 L280 140 L210 19 Z" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2.5" />
      {tick(172, 76, 180, 82)}{tick(240, 82, 248, 76)}{tick(210, 135, 210, 145)}
      <line x1="20" y1="158" x2="280" y2="158" stroke="#334155" />
      <path d="M20 158 l6 -4 v8 Z M280 158 l-6 -4 v8 Z" fill="#334155" />
      <text x="150" y="154" textAnchor="middle" fill="#0F172A" fontWeight="bold">28cm</text>
    </Frame>
  );
}

/** تمرين 30 (p. 51) : un rectangle x × 6 cm surmonté d'un triangle équilatéral de côté x. */
export function RectTriangleFigure() {
  return (
    <Frame viewBox="0 -40 260 265" label="ex-30">
      <path d="M50 110 L210 110 L130 -28 Z" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2.5" />
      <rect x="50" y="110" width="160" height="80" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
      <text x="130" y="212" textAnchor="middle" fill="#1D4ED8" fontWeight="bold">x</text>
      <text x="225" y="155" fill="#1D4ED8" fontWeight="bold">6cm</text>
      {tick(86, 46, 94, 52)}{tick(166, 52, 174, 46)}{tick(130, 105, 130, 115)}
    </Frame>
  );
}

/** تمرين 33 (p. 51) : le rectangle ABCD, BC = 3 cm, DC = x. */
export function RectangleFigure() {
  return (
    <Frame viewBox="0 0 280 150" label="ex-33">
      <rect x="40" y="25" width="200" height="80" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
      <text x="30" y="22" fontWeight="bold">A</text><text x="244" y="22" fontWeight="bold">B</text>
      <text x="244" y="120" fontWeight="bold">C</text><text x="28" y="120" fontWeight="bold">D</text>
      <text x="140" y="125" textAnchor="middle" fill="#1D4ED8" fontWeight="bold">x</text>
      <text x="250" y="70" fill="#1D4ED8" fontWeight="bold">3cm</text>
    </Frame>
  );
}

/** تمرين 39 (p. 53) : ABCD carré de côté 8 cm, EFGH carré inscrit, AH = BE = CF = DG = x. */
export function TiltedSquareFigure() {
  const s = 180; const o = 30; const x = 60; // x dessiné à 3 cm sur 8
  const A = [o, o]; const B = [o + s, o]; const C = [o + s, o + s]; const D = [o, o + s];
  const E = [o + s - x, o]; const F = [o + s, o + s - x]; const G = [o + x, o + s]; const H = [o, o + x];
  const P = (p) => p.join(' ');
  return (
    <Frame viewBox="0 0 260 250" label="ex-39">
      <rect x={o} y={o} width={s} height={s} fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
      <polygon points={[E, F, G, H].map(P).join(' ')} fill="#EFF6FF" stroke="#DC2626" strokeWidth="2.5" />
      {[['A', A, -14, -6], ['B', B, 6, -6], ['C', C, 6, 16], ['D', D, -14, 16], ['E', E, -4, -8], ['F', F, 8, 4], ['G', G, -4, 18], ['H', H, -16, 4]].map(([n, p, dx, dy]) => (
        <text key={n} x={p[0] + dx} y={p[1] + dy} fontWeight="bold">{n}</text>
      ))}
      <text x={o - 18} y={o + x / 2 + 4} fill="#1D4ED8" fontWeight="bold">x</text>
      <text x={o + s + 8} y={o + s / 2 + 30} fill="#334155" fontWeight="bold">8cm</text>
    </Frame>
  );
}

/** تمرين 40 (p. 53, figure corrigée) : ABCD carré de côté x, BE = 3 cm, GD = 8 cm, AEFG coloré. */
export function ColouredRectFigure() {
  const o = 30; const s = 170; const e = 50; const g = 110; // GD = 8 dessiné sur AG = x − 8
  return (
    <Frame viewBox="0 0 280 240" label="ex-40">
      <rect x={o} y={o} width={s} height={s} fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
      <rect x={o} y={o} width={s + e} height={s - g} fill="#FECACA" fillOpacity="0.8" stroke="#DC2626" strokeWidth="2.5" />
      <text x={o - 14} y={o - 6} fontWeight="bold">A</text><text x={o + s - 4} y={o - 6} fontWeight="bold">B</text>
      <text x={o + s + e - 4} y={o - 6} fontWeight="bold">E</text><text x={o + s + e + 4} y={o + s - g + 4} fontWeight="bold">F</text>
      <text x={o - 16} y={o + s - g + 4} fontWeight="bold">G</text><text x={o - 14} y={o + s + 14} fontWeight="bold">D</text>
      <text x={o + s + 4} y={o + s + 14} fontWeight="bold">C</text>
      <text x={o + s / 2} y={o - 6} textAnchor="middle" fill="#1D4ED8" fontWeight="bold">x</text>
      <text x={o + s + e / 2} y={o + 16} textAnchor="middle" fill="#0F172A" fontWeight="bold">3cm</text>
      <text x={o + 8} y={o + s - g / 2} fill="#0F172A" fontWeight="bold">8cm</text>
      <text x={o - 18} y={o + s / 2 + 30} fill="#1D4ED8" fontWeight="bold">x</text>
    </Frame>
  );
}
