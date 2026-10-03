/**
 * La géométrie d'une FIGURE DÉCLARATIVE — points nommés, segments, droites, demi-droites, angles —
 * dessinée par GeoFigure.jsx dans une leçon ET dans un énoncé de pratique (`statement.figure`).
 * Née avec l'unité 9 « خاصية طالس » (2026-10-02) : un exercice de géométrie qui dit « في الشكل
 * المقابل » doit MONTRER le shape, et la pratique n'avait que CoordPlane (un repère, des axes).
 *
 * La donnée est en unités libres, y vers le HAUT ; ce module calcule l'échelle, la viewBox, la place
 * des étiquettes (hors du polygone, loin du centre de gravité) — sans DOM, donc testable et réutilisé
 * par le validateur des exercices (`validateGeoFigure`).
 *
 *   {
 *     points: { A: [0, 4], B: [-2, 0], C: [3, 0], M: [-1, 2], N: [1.5, 2] },
 *     segments: [['A', 'B'], { from: 'B', to: 'C', label: '10' }, { from: 'M', to: 'N', label: 'x', arrows: 1 }],
 *     lines: [{ through: ['A', 'B'], name: '(d)' }],      rays: [{ from: 'A', through: 'x' }],
 *     polygons: [{ points: ['A', 'M', 'N'], tone: 'indigo' }],
 *     rightAngles: [['B', 'H', 'A']],                    angles: [{ at: 'P', from: 'N', to: 'O', label: '40°' }],
 *     labels: { A: 'n' },  hidden: ['x'],  ariaLabel: 'مثلث ABC و (MN) يوازي (BC)'
 *   }
 */
export const GEO_FIGURE_KEYS = Object.freeze([
  'points', 'segments', 'lines', 'rays', 'polygons', 'rightAngles', 'angles', 'labels', 'hidden',
  'ariaLabel', 'maxWidth', 'caption',
]);
export const GEO_TONES = Object.freeze(['slate', 'indigo', 'rose', 'emerald', 'amber', 'sky', 'violet']);
const DIRS = { n: [0, 1], s: [0, -1], e: [1, 0], w: [-1, 0], ne: [0.71, 0.71], nw: [-0.71, 0.71], se: [0.71, -0.71], sw: [-0.71, -0.71] };

const asSegment = (s) => (Array.isArray(s) ? { from: s[0], to: s[1] } : s);
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const len = (v) => Math.hypot(v[0], v[1]);
const unit = (v) => { const l = len(v) || 1; return [v[0] / l, v[1] / l]; };

/** Toutes les erreurs d'une figure (clés inconnues, point inconnu, ton inconnu, ariaLabel manquant). */
export function validateGeoFigure(fig) {
  const errors = [];
  if (!fig || typeof fig !== 'object') return ['figure absente'];
  for (const k of Object.keys(fig)) if (!GEO_FIGURE_KEYS.includes(k)) errors.push(`clé inconnue « ${k} »`);
  const pts = fig.points ?? {};
  const names = Object.keys(pts);
  if (names.length < 2) errors.push('au moins deux points');
  for (const [n, p] of Object.entries(pts)) {
    if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite)) errors.push(`point ${n} : [x, y] numériques`);
  }
  const need = (n, where) => { if (!names.includes(n)) errors.push(`${where} : point inconnu « ${n} »`); };
  const tone = (t, where) => { if (t != null && !GEO_TONES.includes(t)) errors.push(`${where} : ton inconnu « ${t} »`); };
  (fig.segments ?? []).forEach((s, i) => { const g = asSegment(s); need(g.from, `segments[${i}]`); need(g.to, `segments[${i}]`); tone(g.tone, `segments[${i}]`); });
  (fig.lines ?? []).forEach((l, i) => { (l.through ?? []).forEach((n) => need(n, `lines[${i}]`)); if ((l.through ?? []).length !== 2) errors.push(`lines[${i}] : through = deux points`); tone(l.tone, `lines[${i}]`); });
  (fig.rays ?? []).forEach((r, i) => { need(r.from, `rays[${i}]`); need(r.through, `rays[${i}]`); tone(r.tone, `rays[${i}]`); });
  (fig.polygons ?? []).forEach((p, i) => { (p.points ?? []).forEach((n) => need(n, `polygons[${i}]`)); tone(p.tone, `polygons[${i}]`); });
  (fig.rightAngles ?? []).forEach((a, i) => { if (!Array.isArray(a) || a.length !== 3) errors.push(`rightAngles[${i}] : trois points`); else a.forEach((n) => need(n, `rightAngles[${i}]`)); });
  (fig.angles ?? []).forEach((a, i) => ['at', 'from', 'to'].forEach((k) => need(a[k], `angles[${i}].${k}`)));
  for (const n of Object.keys(fig.labels ?? {})) { need(n, 'labels'); if (!DIRS[fig.labels[n]]) errors.push(`labels.${n} : direction inconnue`); }
  (fig.hidden ?? []).forEach((n) => need(n, 'hidden'));
  if (typeof fig.ariaLabel !== 'string' || !/[؀-ۿ]/.test(fig.ariaLabel)) errors.push('ariaLabel arabe obligatoire');
  return errors;
}

/**
 * La mise en page : échelle (la plus grande dimension ≈ `size` px), viewBox, coordonnées SVG
 * (y vers le bas) de chaque point, position de chaque étiquette de point et de longueur.
 */
export function layoutGeoFigure(fig, { size = 300, pad = 34 } = {}) {
  const pts = fig.points ?? {};
  const names = Object.keys(pts);
  const xs = names.map((n) => pts[n][0]);
  const ys = names.map((n) => pts[n][1]);
  // Les droites et demi-droites dépassent leurs points : on les inclut dans le cadre.
  const extra = [];
  for (const l of fig.lines ?? []) {
    const [p, q] = l.through.map((n) => pts[n]);
    const [a, b] = Array.isArray(l.extend) ? l.extend : [l.extend ?? 0.3, l.extend ?? 0.3];
    const d = sub(q, p);
    extra.push([p[0] - a * d[0], p[1] - a * d[1]], [q[0] + b * d[0], q[1] + b * d[1]]);
  }
  for (const r of fig.rays ?? []) {
    const p = pts[r.from]; const q = pts[r.through]; const d = sub(q, p); const e = r.extend ?? 0.25;
    extra.push([q[0] + e * d[0], q[1] + e * d[1]]);
  }
  const allX = [...xs, ...extra.map((p) => p[0])];
  const allY = [...ys, ...extra.map((p) => p[1])];
  const minX = Math.min(...allX); const maxX = Math.max(...allX);
  const minY = Math.min(...allY); const maxY = Math.max(...allY);
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const s = size / span;
  const to = ([x, y]) => [pad + (x - minX) * s, pad + (maxY - y) * s];
  const P = Object.fromEntries(names.map((n) => [n, to(pts[n])]));
  const width = (maxX - minX) * s + 2 * pad;
  const height = (maxY - minY) * s + 2 * pad;

  // Étiquettes de points : à l'opposé du centre de gravité (ou direction imposée).
  const cx = names.reduce((t, n) => t + P[n][0], 0) / names.length;
  const cy = names.reduce((t, n) => t + P[n][1], 0) / names.length;
  const pointLabels = Object.fromEntries(names.map((n) => {
    const forced = fig.labels?.[n];
    let dir;
    if (forced) dir = [DIRS[forced][0], -DIRS[forced][1]];
    else { const v = sub(P[n], [cx, cy]); dir = len(v) < 1e-6 ? [0, -1] : unit(v); }
    return [n, [P[n][0] + dir[0] * 15, P[n][1] + dir[1] * 15 + 5]];
  }));

  // Étiquettes de longueur : au milieu, décalées du côté opposé au centre de gravité.
  const segmentLabel = (from, to2, side) => {
    const a = P[from]; const b = P[to2];
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let nrm = unit([-(b[1] - a[1]), b[0] - a[0]]);
    if (side == null) { const toC = sub([cx, cy], m); if (nrm[0] * toC[0] + nrm[1] * toC[1] > 0) nrm = [-nrm[0], -nrm[1]]; } else if (side < 0) nrm = [-nrm[0], -nrm[1]];
    return [m[0] + nrm[0] * 13, m[1] + nrm[1] * 13 + 4];
  };
  const lineEnds = (l) => {
    const [p, q] = l.through.map((n) => P[n]);
    const [a, b] = Array.isArray(l.extend) ? l.extend : [l.extend ?? 0.3, l.extend ?? 0.3];
    const d = sub(q, p);
    return [[p[0] - a * d[0], p[1] - a * d[1]], [q[0] + b * d[0], q[1] + b * d[1]]];
  };
  const rayEnd = (r) => { const p = P[r.from]; const q = P[r.through]; const d = sub(q, p); const e = r.extend ?? 0.25; return [q[0] + e * d[0], q[1] + e * d[1]]; };
  return { P, width, height, scale: s, pointLabels, segmentLabel, lineEnds, rayEnd, center: [cx, cy] };
}

/** Les petits traits d'égalité (1 à 3) au milieu d'un segment, en coordonnées SVG. */
export function tickMarks(a, b, count = 1) {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const t = unit(sub(b, a)); const n = [-t[1], t[0]];
  return Array.from({ length: count }, (_, i) => {
    const off = (i - (count - 1) / 2) * 5;
    const c = [m[0] + t[0] * off, m[1] + t[1] * off];
    return [[c[0] - n[0] * 6, c[1] - n[1] * 6], [c[0] + n[0] * 6, c[1] + n[1] * 6]];
  });
}

/** Les chevrons de parallélisme (1 ou 2) au milieu d'un segment ou d'une droite. */
export function parallelArrows(a, b, count = 1) {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const t = unit(sub(b, a)); const n = [-t[1], t[0]];
  return Array.from({ length: count }, (_, i) => {
    const off = (i - (count - 1) / 2) * 7;
    const tip = [m[0] + t[0] * (off + 4), m[1] + t[1] * (off + 4)];
    return [[tip[0] - t[0] * 7 + n[0] * 5, tip[1] - t[1] * 7 + n[1] * 5], tip, [tip[0] - t[0] * 7 - n[0] * 5, tip[1] - t[1] * 7 - n[1] * 5]];
  });
}

/** Le carré d'angle droit au sommet `v` entre les directions vers `a` et `b`. */
export function rightAngleSquare(a, v, b, size = 10) {
  const u1 = unit(sub(a, v)); const u2 = unit(sub(b, v));
  const p1 = [v[0] + u1[0] * size, v[1] + u1[1] * size];
  const p3 = [v[0] + u2[0] * size, v[1] + u2[1] * size];
  const p2 = [p1[0] + u2[0] * size, p1[1] + u2[1] * size];
  return [p1, p2, p3];
}

/** L'arc d'un angle (rayon r) au sommet `v` de `a` vers `b` (le petit arc), et la place de son étiquette. */
export function angleArc(a, v, b, r = 20) {
  const a1 = Math.atan2(a[1] - v[1], a[0] - v[0]);
  const a2 = Math.atan2(b[1] - v[1], b[0] - v[0]);
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const start = [v[0] + r * Math.cos(a1), v[1] + r * Math.sin(a1)];
  const end = [v[0] + r * Math.cos(a1 + d), v[1] + r * Math.sin(a1 + d)];
  const mid = a1 + d / 2;
  return {
    path: `M ${start[0]} ${start[1]} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${end[0]} ${end[1]}`,
    label: [v[0] + (r + 14) * Math.cos(mid), v[1] + (r + 14) * Math.sin(mid) + 4],
  };
}
