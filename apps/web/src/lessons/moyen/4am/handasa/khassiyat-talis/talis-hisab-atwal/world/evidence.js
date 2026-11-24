/**
 * The EVIDENCE of lesson `talis-hisab-atwal` — PURE. Which answers count (written format, first try, no help) and what
 * is sent is the kit's rule (`gameworld/kit/evidence.js`); the verdict of a claim is the kit's too (`kit/claims.js`, the
 * same rule as the server's). Here: the الكفاءة each key proves, and the CLAIM each kind of trainer answer makes.
 *
 * FOUR KEYS, THREE الكفاءات (the catalogue's P1, P2, P3; plan §3.9):
 *   🔑 → P1  recognising the configuration and its three equal ratios (its exam answer: a ratio computed);
 *   📐 → P2  computing an unknown length;
 *   🦋 → P2  its exam answers are COMPUTATIONS of lengths in a butterfly (the plan's « P1 and P2 »: `createEvidence`
 *            maps a key to ONE point, and what a 🦋 answer proves is a length computed — its written ratios make no
 *            claim);
 *   🔍 → P3  k, its direction, the image of a side, the number back.
 *
 * The claims, all of kinds that exist (`fraction`, and `scale` added for this world, K-c):
 *   `fraction`          his ratio p/q equals AM/AB (unreduced: any equal writing is right);
 *   `fraction` op '*'   his length equals P × Q × 1/D — the cross product the server computes from the three known
 *                       lengths (a decimal length is a fraction: 32,5 = 65/2);
 *   `fraction` op '+'   his whole side equals the sum of its two pieces;
 *   `scale`             (`claims.js › scaleClaim`) every length of the first triangle × his k gives its partner — his
 *                       image of a side among them — and his word « تكبير / تصغير » is the one k gives; then his k'
 *                       brings the second triangle back.
 * THE RULE OF A CLAIM (defects.md A6): the claim is TRUE exactly when the lesson's `check` (world/trainer.js) accepts the
 * WHOLE answer. An answer in several parts sends the claim of its FIRST part that is not right, else of its last.
 * Never evidence: a tap, a true / false, the three ratios written with segment names (no claim kind states a pairing
 * of names), a second try, an answer after help.
 */
import { counts, createEvidence } from '../../../../../../common/gameworld/kit/evidence';
import { scaleClaim } from '../../../../../../common/gameworld/kit/claims';
import { equal, K1, K2, K3, K4, over, read, times, typedNumber, typedWhole } from './math';

/** The الكفاءة each key proves (the codes of the lesson's `learningPoints`) — see the header. */
export const POINTS = { [K1]: 'P1', [K2]: 'P2', [K3]: 'P2', [K4]: 'P3' };
/** The evidence of this lesson. It has no real-world case: nothing is claimed from one. */
export const evidence = { ...createEvidence({ grade: '4am', points: POINTS }), caseEvidence: () => null };

const nat = (x) => Number(x);
/** A typed length as a fraction n/d of naturals, or [null, null]. */
function typedParts(x) {
  const t = typedNumber(x);
  if (t == null) return [null, null];
  const v = read(t);
  return [nat(v.n), nat(v.d)];
}
/** « his length = P × Q ÷ D » — the server computes P × Q × (1/D) itself. */
function crossClaim(f, s, typed) {
  const [a, b] = typedParts(typed);
  const pq = times(f[s.P], f[s.Q]);
  const inv = over('1', f[s.D]);
  return {
    kind: 'fraction',
    a,
    b,
    p: a,
    q: b,
    op: '*',
    x: nat(pq.n),
    y: nat(pq.d),
    z: nat(inv.n),
    w: nat(inv.d),
    reduced: false,
  };
}
/** « his whole side = part + piece ». */
function sumClaim(part, piece, typed) {
  const [a, b] = typedParts(typed);
  const [x, z] = [read(part), read(piece)];
  return {
    kind: 'fraction',
    a,
    b,
    p: a,
    q: b,
    op: '+',
    x: nat(x.n),
    y: nat(x.d),
    z: nat(z.n),
    w: nat(z.d),
    reduced: false,
  };
}
/** A length he typed, or a word that makes `scaleClaim` refuse (an empty box is never a length). */
const lengthOr = (x) => typedNumber(x) ?? 'x';

/**
 * Evidence of a TRAINER answer, or null when it does not count.
 * ctx = { firstTry, helped } — helped: a model sheet or the rule was opened before this answer.
 */
export function trainerEvidence(q, value, ctx) {
  if (q.format !== 'exam' || !counts(ctx)) return null;
  const v = value ?? {};
  switch (q.kind) {
    case 'nisba': {
      const k = read(q.k);
      return {
        key: q.key,
        claim: { kind: 'fraction', a: nat(k.n), b: nat(k.d), p: typedWhole(v.n), q: typedWhole(v.d), reduced: false },
      };
    }
    case 'tul':
      return { key: q.key, claim: crossClaim(q.f, q.sol, v.x) };
    case 'tulJuz': {
      const w = typedNumber(v.w);
      if (w == null || !equal(w, q.f[q.side])) return { key: q.key, claim: sumClaim(q.f[q.part], q.f[q.piece], v.w) };
      return { key: q.key, claim: crossClaim(q.f, q.sol, v.x) };
    }
    case 'farasha': {
      const x = typedNumber(v.x);
      if (x == null || !equal(x, q.f[q.sols[0].U])) return { key: q.key, claim: crossClaim(q.f, q.sols[0], v.x) };
      return { key: q.key, claim: crossClaim(q.f, q.sols[1], v.y) };
    }
    case 'muamil': {
      const { f, one, two } = q;
      const [p, d] = [typedWhole(v.kn), typedWhole(v.kd)];
      const says = v.kind === 'enlargement' || v.kind === 'reduction' ? v.kind : null;
      const first = scaleClaim({
        from: [f[one[0]], f[one[1]]],
        to: [f[two[0]], lengthOr(v.mn)],
        p,
        q: d,
        says,
      });
      const mn = typedNumber(v.mn);
      const kRight = p != null && d ? equal(`${p}/${d}`, q.k) : false;
      const wordRight = says === (read(q.k).n > read(q.k).d ? 'enlargement' : 'reduction');
      if (!kRight || !wordRight || mn == null || !equal(mn, f[two[1]])) return { key: q.key, claim: first };
      return {
        key: q.key,
        claim: scaleClaim({ from: [f[two[0]]], to: [f[one[0]]], p: typedWhole(v.bn), q: typedWhole(v.bd) }),
      };
    }
    default:
      return null;
  }
}
