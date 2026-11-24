/**
 * « الأهرامات » — A THALÈS FIGURE (PURE; PYRAMIDS_WORLD_PLAN §2.3): the one shape every case, mirror, experiment and
 * card of this world is about, and its ONE drawing — a spec for the shared `components/GeoFigure.jsx` (never a second
 * renderer). It names no lesson.
 *
 *   fig = {
 *     kind: 'nested' | 'butterfly',
 *     names: { V, M, B, N, C },            the letters: the vertex V, M on line (VB), N on line (VC)
 *     len: { VM, VB, VN, VC, MN, BC },     exact lengths as TEXT (« 42,5 », « 5/6 »); MN and BC may be null (unknown)
 *   }
 * nested: M on [VB], N on [VC]; butterfly: M and N on the OTHER side of V. (MN) ∥ (BC) exactly when the three ratios
 * VM/VB, VN/VC, MN/BC are equal (`chain`). Floats are for DRAWING only.
 */
import { write, over, minus, compare, approx, tex } from '../kit/exact';

export { tex };

const sq = (x) => approx(x) ** 2;

/** The three ratios of the chain, exact (null where a length is unknown). */
export function ratios(fig) {
  const { VM, VB, VN, VC, MN, BC } = fig.len;
  const r = (a, b) => (a != null && b != null ? write(over(a, b)) : null);
  return { VB: r(VM, VB), VC: r(VN, VC), BC: r(MN, BC) };
}

/** Do the three ratios hold one value? (exact — the parallel's condition, seen) */
export function chain(fig) {
  const { VB, VC, BC } = ratios(fig);
  return VB != null && VC != null && BC != null && compare(VB, VC) === 0 && compare(VB, BC) === 0;
}

/** The ratio gauge (§2.3): each side stretched to ONE common length, its piece marked at its ratio; aligned = equal. */
export function gauge(fig) {
  const r = ratios(fig);
  const marks = ['VB', 'VC', 'BC'].map((k) => ({ k, at: r[k] == null ? null : Math.min(1.25, approx(r[k])) }));
  const known = marks.filter((m) => m.at != null);
  const aligned = known.length === 3 && chain(fig);
  return { marks, aligned };
}

/**
 * The points for DRAWING, y up: V at the origin, B along +x, C at the angle given by VB, VC and BC (al-Kashi). M and N
 * stand at VM and VN on the same rays (nested) or on the opposite rays (butterfly).
 */
export function points(fig) {
  const { VM, VB, VN, VC, BC, MN } = fig.len;
  const vb = approx(VB);
  const vc = approx(VC);
  let cos;
  if (BC != null) cos = (vb * vb + vc * vc - sq(BC)) / (2 * vb * vc);
  else {
    // BC unknown: the angle from the small triangle (MN known), or a fair default
    const vm = approx(VM);
    const vn = approx(VN);
    cos = MN != null ? (vm * vm + vn * vn - sq(MN)) / (2 * vm * vn) : 0.35;
    if (fig.kind === 'butterfly') cos = MN != null ? cos : 0.35;
  }
  cos = Math.max(-0.97, Math.min(0.97, cos));
  const sin = Math.sqrt(1 - cos * cos);
  const side = fig.kind === 'butterfly' ? -1 : 1;
  const { V, M, B, N, C } = fig.names;
  const vm = approx(VM) * side;
  const vn = approx(VN) * side;
  return {
    [V]: [0, 0],
    [B]: [vb, 0],
    [C]: [vc * cos, vc * sin],
    [M]: [vm, 0],
    [N]: [vn * cos, vn * sin],
  };
}

const lab = (x) => (x == null ? '?' : write(x));

/**
 * The GeoFigure spec of a figure. `show`: which lengths are written ('all' | a list of segment keys of `len`);
 * `ask`: segments written « ? » (an unknown); `parallel`: draw the chevrons of (MN) ∥ (BC) (when the case says so); `small`: a thumbnail (no length written).
 */
export function figureSpec(fig, { show = 'all', ask = [], parallel = null, small = false, extra = {} } = {}) {
  const { V, M, B, N, C } = fig.names;
  const P = points(fig);
  const wants = (k) => !small && (show === 'all' || show.includes(k)) && fig.len[k] !== undefined;
  const seg = (a, b, k, more = {}) => ({
    from: a,
    to: b,
    ...(wants(k) ? { label: ask.includes(k) ? '?' : lab(fig.len[k]) } : {}),
    ...more,
  });
  const arrows = parallel ?? fig.parallel ?? chainSafe(fig);
  const butterfly = fig.kind === 'butterfly';
  return {
    points: P,
    segments: [
      seg(V, M, 'VM', { tone: 'indigo' }),
      butterfly ? seg(V, B, 'VB') : seg(M, B, 'MB'),
      seg(V, N, 'VN', { tone: 'indigo' }),
      butterfly ? seg(V, C, 'VC') : seg(N, C, 'NC'),
      seg(M, N, 'MN', { tone: 'rose', bold: true, ...(arrows ? { arrows: 1 } : {}) }),
      seg(B, C, 'BC', { tone: 'rose', bold: true, ...(arrows ? { arrows: 1 } : {}) }),
    ],
    polygons: [{ points: [V, M, N], tone: 'indigo' }],
    ariaLabel: butterfly ? `فراشة رأسها ${V}` : `مثلث ${V}${B}${C} والقطعة [${M}${N}]`,
    maxWidth: small ? 120 : 360,
    ...extra,
  };
}
const chainSafe = (fig) => {
  try {
    return chain(fig);
  } catch {
    return false;
  }
};

/** The lengths of a figure with its pieces added (MB = VB − VM, NC = VC − VN) for a nested one. */
export function withPieces(fig) {
  if (fig.kind !== 'nested') return fig;
  const { VM, VB, VN, VC } = fig.len;
  const piece = (a, b) => (a != null && b != null ? write(minus(b, a)) : null);
  return { ...fig, len: { ...fig.len, MB: fig.len.MB ?? piece(VM, VB), NC: fig.len.NC ?? piece(VN, VC) } };
}

/** The value of a length written as text, or null. */
export const lengthText = (x) => (x == null ? null : write(x));
