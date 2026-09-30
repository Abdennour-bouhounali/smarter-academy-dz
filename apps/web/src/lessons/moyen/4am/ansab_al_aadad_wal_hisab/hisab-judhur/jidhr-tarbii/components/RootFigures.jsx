import React from 'react';

/**
 * Les deux figures du manuel, DESSINÉES (jamais une image) : la géométrie est
 * `dir="ltr"`, les noms de points sont des lettres latines comme dans le livre,
 * et la légende arabe est du texte DOM (figcaption).
 *
 *   TriangleABC  نشاط 1 (p. 20) : ABC قائم في A, AB = 1, AC = 2 — l'hypoténuse
 *                BC n'est PAS étiquetée : c'est la question.
 *   RootSpiral   أوظّف تكنولوجيات الإعلام والاتصال (p. 30) : la spirale où chaque
 *                côté ajouté vaut 1 et est perpendiculaire au segment précédent
 *                issu de B ; C, D, E, F, G, H. Aucune longueur BC…BH n'est écrite.
 */

const pt = ([x, y]) => `${x},${y}`;

/** Le petit carré de l'angle droit en `p`, le long des directions unitaires u et v (en pixels). */
function RightAngle({ p, u, v, s = 10 }) {
  const a = [p[0] + u[0] * s, p[1] + u[1] * s];
  const b = [a[0] + v[0] * s, a[1] + v[1] * s];
  const c = [p[0] + v[0] * s, p[1] + v[1] * s];
  return <polyline points={[a, b, c].map(pt).join(' ')} fill="none" stroke="#475569" strokeWidth={1.5} />;
}

export function TriangleABC({ ab = 1, ac = 2, caption }) {
  const u = 60;
  const pad = 24;
  const A = [pad, pad + ac * u];
  const B = [pad + ab * u, pad + ac * u];
  const C = [pad, pad];
  const w = ab * u + 2 * pad + 20;
  const h = ac * u + 2 * pad;
  return (
    <figure className="mx-auto w-fit rounded-xl border-2 border-slate-200 bg-white p-2" data-figure="triangle-abc">
      <div dir="ltr" className="flex justify-center">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="مثلث ABC قائم في A">
          <polygon points={[A, B, C].map(pt).join(' ')} fill="#E0F2FE" stroke="#0369A1" strokeWidth={2} />
          <RightAngle p={A} u={[1, 0]} v={[0, -1]} />
          <text x={A[0] - 14} y={A[1] + 14} fontSize={13} fill="#0F172A">A</text>
          <text x={B[0] + 4} y={B[1] + 14} fontSize={13} fill="#0F172A">B</text>
          <text x={C[0] - 14} y={C[1] + 4} fontSize={13} fill="#0F172A">C</text>
          <text x={(A[0] + B[0]) / 2 - 4} y={A[1] + 16} fontSize={12} fill="#334155">{ab}</text>
          <text x={A[0] - 14} y={(A[1] + C[1]) / 2 + 4} fontSize={12} fill="#334155">{ac}</text>
        </svg>
      </div>
      {caption && <figcaption className="text-center text-xs text-slate-600">{caption}</figcaption>}
    </figure>
  );
}

/**
 * Les sommets de la spirale en unités : B à l'origine, A = (−1, 0), C = (−1, 1) ;
 * chaque sommet suivant = le précédent + le vecteur UNITAIRE perpendiculaire au
 * rayon issu de B (sens horaire, comme dans le livre). Le rayon n°k mesure √(k+1).
 */
export function spiralPoints(count) {
  const pts = [[-1, 1]];
  for (let i = 1; i < count; i += 1) {
    const [x, y] = pts[i - 1];
    const r = Math.hypot(x, y);
    pts.push([x + y / r, y - x / r]);
  }
  return pts;
}

export function RootSpiral({ names = ['C', 'D', 'E', 'F', 'G', 'H'], caption }) {
  const pts = spiralPoints(names.length);
  const all = [[0, 0], [-1, 0], ...pts];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const u = 48;
  const pad = 22;
  const minX = Math.min(...xs); const maxX = Math.max(...xs);
  const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const P = ([x, y]) => [pad + (x - minX) * u, pad + (maxY - y) * u];
  const w = (maxX - minX) * u + 2 * pad;
  const h = (maxY - minY) * u + 2 * pad;
  const B = P([0, 0]);
  const A = P([-1, 0]);
  const chain = [A, ...pts.map(P)];
  return (
    <figure className="mx-auto w-full max-w-sm rounded-xl border-2 border-slate-200 bg-white p-2" data-figure="root-spiral">
      <div dir="ltr" className="flex justify-center">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full max-w-[22rem]" role="img" aria-label="الشكل: النقط A و B و C و D و E و F و G و H">
          {pts.map((p, i) => <line key={`r${i}`} x1={B[0]} y1={B[1]} x2={P(p)[0]} y2={P(p)[1]} stroke={i === 0 || i === pts.length - 1 ? '#E11D48' : '#94A3B8'} strokeWidth={i === 0 || i === pts.length - 1 ? 2.5 : 1.5} />)}
          <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#0369A1" strokeWidth={2} />
          <polyline points={chain.map(pt).join(' ')} fill="none" stroke="#0369A1" strokeWidth={2} />
          {chain.slice(0, -1).map((p, i) => {
            // L'angle droit au sommet qui précède chaque côté de longueur 1 (A, puis C, D, …).
            const q = chain[i + 1];
            const along = [(q[0] - p[0]) / u, (q[1] - p[1]) / u];
            const toB = [(B[0] - p[0]), (B[1] - p[1])];
            const n = Math.hypot(...toB);
            return <RightAngle key={`a${i}`} p={p} u={along} v={[toB[0] / n, toB[1] / n]} s={8} />;
          })}
          <text x={B[0] - 4} y={B[1] + 16} fontSize={12} fill="#0F172A">B</text>
          <text x={A[0] - 12} y={A[1] + 14} fontSize={12} fill="#0F172A">A</text>
          {pts.map((p, i) => {
            const [x, y] = P(p);
            const dx = x - B[0]; const dy = y - B[1]; const n = Math.hypot(dx, dy);
            return <text key={names[i]} x={x + (dx / n) * 12 - 4} y={y + (dy / n) * 12 + 4} fontSize={12} fill="#0F172A">{names[i]}</text>;
          })}
          <text x={(A[0] + B[0]) / 2 - 3} y={A[1] + 14} fontSize={11} fill="#334155">1</text>
          {chain.slice(0, -1).map((p, i) => {
            const q = chain[i + 1];
            const mx = (p[0] + q[0]) / 2; const my = (p[1] + q[1]) / 2;
            const dx = mx - B[0]; const dy = my - B[1]; const n = Math.hypot(dx, dy);
            return <text key={`one${i}`} x={mx + (dx / n) * 10 - 3} y={my + (dy / n) * 10 + 4} fontSize={11} fill="#334155">1</text>;
          })}
        </svg>
      </div>
      {caption && <figcaption className="text-center text-xs text-slate-600">{caption}</figcaption>}
    </figure>
  );
}
