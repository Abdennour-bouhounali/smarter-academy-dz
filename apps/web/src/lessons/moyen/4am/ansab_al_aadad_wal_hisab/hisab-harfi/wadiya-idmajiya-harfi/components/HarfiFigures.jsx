import React from 'react';
import MathText from '../../../../../../common/components/MathText';

/**
 * Les figures du manuel nécessaires à la synthèse, DESSINÉES (jamais une image) :
 * la géométrie est `dir="ltr"`, les noms de points et les longueurs sont écrits
 * comme dans le livre (lettres latines), la légende arabe est du texte DOM.
 *
 *   PoolScene      vignette DÉCORATIVE de la carte d'activité (aria-hidden) : le
 *                  bassin bleu et le ruban des piétons autour ; aucune mesure.
 *   RightTriangle  le تحدّ (p. 31, rectangle en A cherché), ex. 34 et 38 (rectangle
 *                  en B) : un triangle rectangle et ses côtés en fonction de x.
 *   SquareABCD     ex. 37 (p. 41) : le carré de côté 10, le carré x, le rectangle
 *                  (1) 4 × 10 et le rectangle (2) x × 4 coloriés.
 */

export function PoolScene() {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="160" height="90" fill="#DCFCE7" />
      {/* le ruban des piétons */}
      <rect x="45" y="10" width="70" height="70" fill="#E7E5E4" stroke="#78716C" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={45 + i * 10} y1="10" x2={45 + i * 10} y2="80" stroke="#D6D3D1" strokeWidth=".6" />
      ))}
      {/* le bassin */}
      <rect x="55" y="20" width="50" height="50" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.2" />
      <path d="M60 35 q5 -3 10 0 t10 0 t10 0 t10 0 M60 50 q5 -3 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#E0F2FE" strokeWidth="1.2" />
      {/* deux piétons */}
      <circle cx="50" cy="30" r="2.4" fill="#B45309" />
      <circle cx="110" cy="62" r="2.4" fill="#7C3AED" />
    </svg>
  );
}

const pt = ([x, y]) => `${x},${y}`;

/**
 * Triangle rectangle : `right` est le sommet de l'angle droit (en bas à gauche),
 * `top` au-dessus, `side` à droite. `legTop` = longueur right–top,
 * `legSide` = right–side, `hyp` = top–side ; une longueur absente n'est pas écrite.
 */
export function RightTriangle({ right = 'B', top = 'A', side = 'C', legTop, legSide, hyp, caption, label }) {
  const R = [46, 150]; const T = [46, 26]; const S = [226, 150];
  const s = 12;
  return (
    <figure className="mx-auto w-fit max-w-full rounded-xl border-2 border-slate-200 bg-white p-2" data-figure="right-triangle">
      <div dir="ltr" className="flex justify-center">
        <svg width="270" height="182" viewBox="0 0 270 182" className="max-w-full" role="img" aria-label={label ?? `مثلث ${top}${right}${side} قائم في ${right}`}>
          <polygon points={[R, T, S].map(pt).join(' ')} fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
          <polyline points={[[R[0] + s, R[1]], [R[0] + s, R[1] - s], [R[0], R[1] - s]].map(pt).join(' ')} fill="none" stroke="#475569" strokeWidth="1.5" />
          <text x={R[0] - 18} y={R[1] + 16} fontSize="14" fill="#0F172A">{right}</text>
          <text x={T[0] - 18} y={T[1] + 4} fontSize="14" fill="#0F172A">{top}</text>
          <text x={S[0] + 6} y={S[1] + 16} fontSize="14" fill="#0F172A">{side}</text>
          {legTop && <text x={R[0] - 8} y={(R[1] + T[1]) / 2 + 4} fontSize="13" fill="#334155" textAnchor="end">{legTop}</text>}
          {legSide && <text x={(R[0] + S[0]) / 2} y={R[1] + 20} fontSize="13" fill="#334155" textAnchor="middle">{legSide}</text>}
          {hyp && <text x={(T[0] + S[0]) / 2 + 10} y={(T[1] + S[1]) / 2 - 6} fontSize="13" fill="#334155">{hyp}</text>}
        </svg>
      </div>
      {caption && <figcaption className="text-center text-xs text-slate-600"><MathText>{caption}</MathText></figcaption>}
    </figure>
  );
}

/** Ex. 37 : ABCD de côté 10 (A en haut à gauche). x dessiné à 3,5 pour la lisibilité — la figure n'est pas à l'échelle, comme celle du livre. */
export function SquareABCD({ caption }) {
  const u = 20; const o = 30; const x = 3.5;
  const X = (v) => o + v * u; const Y = (v) => o + v * u;
  return (
    <figure className="mx-auto w-fit max-w-full rounded-xl border-2 border-slate-200 bg-white p-2" data-figure="square-abcd">
      <div dir="ltr" className="flex justify-center">
        <svg width="270" height="262" viewBox="0 0 270 262" className="max-w-full" role="img" aria-label="المربع ABCD ضلعه 10، وفيه مربع ضلعه x ومستطيلان ملوّنان">
          <rect x={X(0)} y={Y(0)} width={10 * u} height={10 * u} fill="#fff" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* le carré x, en A */}
          <rect x={X(0)} y={Y(0)} width={x * u} height={x * u} fill="#FBCFE8" stroke="#9D174D" />
          {/* rectangle (1) : 4 × 10, le long de BC */}
          <rect x={X(6)} y={Y(0)} width={4 * u} height={10 * u} fill="#FBCFE8" stroke="#9D174D" />
          {/* rectangle (2) : x × 4, en D */}
          <rect x={X(0)} y={Y(6)} width={x * u} height={4 * u} fill="#FCE7F3" stroke="#9D174D" />
          <text x={X(x / 2)} y={Y(x / 2) + 4} fontSize="12" textAnchor="middle" fill="#831843">x²</text>
          <text x={X(8)} y={Y(5) + 4} fontSize="13" textAnchor="middle" fill="#831843">(1)</text>
          <text x={X(x / 2)} y={Y(8) + 4} fontSize="13" textAnchor="middle" fill="#831843">(2)</text>
          {[['A', 0, 0, -14, -6], ['B', 10, 0, 4, -6], ['C', 10, 10, 4, 14], ['D', 0, 10, -14, 14], ['E', x, 0, -4, -6], ['F', 6, 0, -4, -6], ['G', 0, x, -14, 4], ['H', 0, 6, -14, 4]].map(([n, a, b, dx, dy]) => (
            <text key={n} x={X(a) + dx} y={Y(b) + dy} fontSize="13" fill="#0F172A">{n}</text>
          ))}
          <text x={X(x / 2)} y={Y(0) - 14} fontSize="12" textAnchor="middle" fill="#334155">x</text>
          <text x={X(8)} y={Y(0) - 14} fontSize="12" textAnchor="middle" fill="#334155">4</text>
          <text x={X(0) - 18} y={Y(8) + 4} fontSize="12" fill="#334155">4</text>
          <text x={X(5)} y={Y(10) + 20} fontSize="12" textAnchor="middle" fill="#334155">10</text>
        </svg>
      </div>
      {caption && <figcaption className="text-center text-xs text-slate-600"><MathText>{caption}</MathText></figcaption>}
    </figure>
  );
}
