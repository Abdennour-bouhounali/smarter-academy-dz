// Oracle du banc « mutarajiha-ula » (unité 4 « معادلات ومتراجحات ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Une petite arithmétique d'expressions est écrite ICI (analyseur récursif + rationnels exacts de
// helpers.mjs), indépendante de packages/core/arithmetic/linear.js : chaque inéquation L REL R est
// ramenée à D(x) = L(x) − R(x) (linéaire, vérifié sur trois points), puis résolue — le sens est
// INVERSÉ quand le coefficient de x est négatif. Les entrées ci-dessous portent l'énoncé (L, REL, R)
// et les options DANS L'ORDRE DU CONTENU ; l'oracle rend la lettre de l'unique option juste (zéro ou
// deux options justes → erreur, le test échoue). Entrées générées avec le banc par le script de
// l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

/* ── analyseur : nombres, x, + − × ÷, puissances entières (**), parenthèses ── */
function evaluate(src, xv) {
  const s = src.replace(/\s+/g, '');
  let i = 0;
  const X = q(xv);
  const peek = () => s[i];
  function atom() {
    if (peek() === '(') { i += 1; const v = sum(); if (s[i] !== ')') throw new Error(`) attendue dans ${src}`); i += 1; return v; }
    if (peek() === 'x') { i += 1; return X; }
    const m = s.slice(i).match(/^\d+(\.\d+)?/);
    if (!m) throw new Error(`terme illisible dans ${src} @${i}`);
    i += m[0].length;
    return q(m[0]);
  }
  function power() {
    let b = atom();
    if (s.startsWith('**', i)) { i += 2; const e = Number(s.slice(i).match(/^\d+/)[0]); i += String(e).length; let r = q(1); for (let k = 0; k < e; k += 1) r = r.mul(b); b = r; }
    return b;
  }
  function unary() { if (peek() === '-') { i += 1; return unary().neg(); } if (peek() === '+') { i += 1; return unary(); } return power(); }
  function product() {
    let v = unary();
    while (peek() === '*' || peek() === '/') { const op = s[i]; i += 1; const w = unary(); v = op === '*' ? v.mul(w) : v.div(w); }
    return v;
  }
  function sum() {
    let v = product();
    while (peek() === '+' || peek() === '-') { const op = s[i]; i += 1; const w = product(); v = op === '+' ? v.add(w) : v.sub(w); }
    return v;
  }
  const v = sum();
  if (i !== s.length) throw new Error(`reste illisible dans ${src}`);
  return v;
}

const sign = (v) => (v.n > 0n ? 1 : v.n < 0n ? -1 : 0);
const cmpQ = (a, b) => sign(q(a).sub(q(b)));
const truth = (a, rel, b) => { const c = cmpQ(a, b); return { '<': c < 0, '<=': c <= 0, '>': c > 0, '>=': c >= 0 }[rel]; };
const FLIP = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };

/** L REL R → { rel, bound } (x rel bound), en exigeant D linéaire et non constant. */
function rayOf(L, rel, Rr) {
  const D = (v) => evaluate(L, v).sub(evaluate(Rr, v));
  const d0 = D(0); const d1 = D(1); const d2 = D(2);
  if (!d2.sub(d1.mul(2)).add(d0).isZero()) throw new Error(`non linéaire : ${L} ${rel} ${Rr}`);
  const a = d1.sub(d0);
  if (a.isZero()) throw new Error(`sans x : ${L} ${rel} ${Rr}`);
  return { rel: sign(a) > 0 ? rel : FLIP[rel], bound: d0.neg().div(a) };
}
const satisfies = (L, rel, Rr, v) => truth(evaluate(L, v), rel, evaluate(Rr, v));
const only = (flags, where) => {
  const hits = flags.map((f, k) => (f ? 'ABCD'[k] : null)).filter(Boolean);
  if (hits.length !== 1) throw new Error(`mutarajiha-ula oracle ${where}: ${hits.length} options justes`);
  return C(hits[0]);
};
const same = (r, [rel, b]) => r.rel === rel && cmpQ(r.bound, b) === 0;

const solve = (L, rel, Rr, opts) => { const r = rayOf(L, rel, Rr); return only(opts.map((o) => same(r, o)), `${L}${rel}${Rr}`); };
const test = (L, rel, Rr, v) => C(satisfies(L, rel, Rr, v) ? 'A' : 'B'); // A « نعم، هو حلّ » · B « لا، ليس حلًّا »
const pick = (L, rel, Rr, values, want) => only(values.map((v) => satisfies(L, rel, Rr, v) === want), 'pick');
const graph = (L, rel, Rr, opts) => {
  const r = rayOf(L, rel, Rr);
  const side = r.rel === '<' || r.rel === '<=' ? 'left' : 'right';
  const closed = r.rel === '<=' || r.rel === '>=';
  return only(opts.map(([s, c, b]) => s === side && c === closed && cmpQ(b, r.bound) === 0), 'graph');
};
const fromGraph = (side, closed, b, opts) => {
  const rel = side === 'left' ? (closed ? '<=' : '<') : (closed ? '>=' : '>');
  return only(opts.map((o) => same({ rel, bound: q(b) }, o)), 'fromGraph');
};
/** x grel a ⇒ E(x) ? : l'image exacte de la demi-droite par x ↦ kx + c. */
const deduce = (grel, a, Eexpr, opts) => {
  const c0 = evaluate(Eexpr, 0); const k = evaluate(Eexpr, 1).sub(c0);
  const img = k.mul(q(a)).add(c0);
  const rel = sign(k) > 0 ? grel : FLIP[grel];
  return only(opts.map((o) => same({ rel, bound: img }, o)), 'deduce');
};
const equiv = (L, rel, Rr, opts) => { const r = rayOf(L, rel, Rr); return only(opts.map(([l2, r2, rr2]) => { const s = rayOf(l2, r2, rr2); return s.rel === r.rel && cmpQ(s.bound, r.bound) === 0; }), 'equiv'); };
/** Entiers solutions, cherchés par balayage (jamais déduits de la borne). */
const integer = (kind, L, rel, Rr) => {
  const sols = [];
  for (let n = -2000; n <= 2000; n += 1) if (satisfies(L, rel, Rr, n)) sols.push(n);
  if (kind === 'max') return R(Math.max(...sols));
  if (kind === 'min') return R(Math.min(...sols));
  if (kind === 'maxNat') return R(Math.max(...sols.filter((n) => n >= 0)));
  return R(sols.filter((n) => n >= 0).length);
};
/** Égalité de polynômes de degré ≤ 2 : trois valeurs de x suffisent ; on en prend cinq. */
const polyEq = (expr, opts) => only(opts.map((o) => [0, 1, 2, 3, -1].every((v) => evaluate(o, v).sub(evaluate(expr, v)).isZero())), 'polyEq');
/** Une متراجحة : un x ET un symbole d'ordre, sans « = ». */
const kind = (opts) => only(opts.map((o) => o.includes('x') && /<|>|\\leq|\\geq/.test(o) && !o.includes('=')), 'kind');
const numericTruth = (a, rel, b, order) => only(order.map((o) => o === (truth(a, rel, b) ? 'متباينة صحيحة' : 'متباينة خاطئة')), 'numericTruth');

export const ORACLE = {
  "ex-4am-mutarajiha-ula-l1-001:q2": test("5/2*x+100", "<=", "150", "18"),
  "ex-4am-mutarajiha-ula-l1-001:q3": integer("maxNat", "5/2*x+100", "<=", "150"),
  "ex-4am-mutarajiha-ula-l1-002:q1": test("4*x", ">", "-3", "-2"),
  "ex-4am-mutarajiha-ula-l1-002:q2": test("4*x", ">", "-3", "0"),
  "ex-4am-mutarajiha-ula-l1-002:q3": pick("4*x", ">", "-3", ["-1/2", "-1", "1"], false),
  "ex-4am-mutarajiha-ula-l1-003:q1": test("3*x-2", "<", "6", "0"),
  "ex-4am-mutarajiha-ula-l1-003:q2": test("3*x-2", "<", "6", "8/3"),
  "ex-4am-mutarajiha-ula-l1-003:q3": test("3*x-2", "<", "6", "3"),
  "ex-4am-mutarajiha-ula-l1-004:q1": kind(["3x + 1 \\geq 2", "3x + 1 = 2", "5 - 2 > 1"]),
  "ex-4am-mutarajiha-ula-l1-004:q2": numericTruth("7", "<", "4", ["متباينة صحيحة", "متباينة خاطئة", "متراجحة ذات مجهول"]),
  "ex-4am-mutarajiha-ula-l1-005:q1": test("-x+5", ">=", "2", "3"),
  "ex-4am-mutarajiha-ula-l1-005:q2": test("-x+5", ">=", "2", "4"),
  "ex-4am-mutarajiha-ula-l1-005:q3": pick("-x+5", ">=", "2", ["-1", "7", "4"], true),
  "ex-4am-mutarajiha-ula-l1-006:q1": test("2*x+1", ">", "x+3", "2"),
  "ex-4am-mutarajiha-ula-l1-006:q2": test("2*x+1", ">", "x+3", "5"),
  "ex-4am-mutarajiha-ula-l1-006:q3": pick("2*x+1", ">", "x+3", ["3", "2", "0"], true),
  "ex-4am-mutarajiha-ula-l1-007:q1": fromGraph("left", false, "4", [["<", "4"], [">", "4"], ["<=", "4"]]),
  "ex-4am-mutarajiha-ula-l1-007:q2": fromGraph("right", true, "-1", [["<=", "-1"], [">=", "-1"], [">", "-1"]]),
  "ex-4am-mutarajiha-ula-l1-008:q2": test("300+60*x", "<=", "900", "12"),
  "ex-4am-mutarajiha-ula-l1-008:q3": integer("maxNat", "300+60*x", "<=", "900"),
  "ex-4am-mutarajiha-ula-l1-009:q1": test("x/2-1", "<=", "3", "8"),
  "ex-4am-mutarajiha-ula-l1-009:q2": test("x/2-1", "<=", "3", "10"),
  "ex-4am-mutarajiha-ula-l1-009:q3": test("x/2-1", "<=", "3", "-4"),
  "ex-4am-mutarajiha-ula-l1-010:q1": test("5*x", "<=", "3", "3/5"),
  "ex-4am-mutarajiha-ula-l1-010:q2": test("5*x", "<=", "3", "1"),
  "ex-4am-mutarajiha-ula-l1-010:q3": graph("5*x", "<=", "3", [["left", false, "3/5"], ["right", true, "3/5"], ["left", true, "3/5"]]),
  "ex-4am-mutarajiha-ula-l2-001:q1": deduce(">", "3/2", "2*x", [[">", "4"], [">", "3"], ["<", "3"]]),
  "ex-4am-mutarajiha-ula-l2-001:q2": deduce(">", "3/2", "-4*x", [[">", "-6"], ["<", "-6"], ["<", "-8"]]),
  "ex-4am-mutarajiha-ula-l2-001:q3": deduce(">", "3/2", "2*x+5", [["<", "8"], [">", "10"], [">", "8"]]),
  "ex-4am-mutarajiha-ula-l2-002:q1": deduce("<", "-2", "5*x", [["<", "-10"], ["<", "-12"], [">", "-10"]]),
  "ex-4am-mutarajiha-ula-l2-002:q2": deduce("<", "-2", "-2*x", [[">", "6"], [">", "4"], ["<", "4"]]),
  "ex-4am-mutarajiha-ula-l2-002:q3": deduce("<", "-2", "3*x-1", [["<", "-7"], [">", "-7"], ["<", "-9"]]),
  "ex-4am-mutarajiha-ula-l2-003:q1": solve("3*x", ">=", "-2", [[">=", "-3/2"], ["<=", "-2/3"], [">=", "-2/3"]]),
  "ex-4am-mutarajiha-ula-l2-003:q2": solve("-2*x", "<", "4", [[">", "2"], [">", "-2"], ["<", "-2"]]),
  "ex-4am-mutarajiha-ula-l2-003:q3": solve("5/3*x", ">", "10", [[">", "6"], ["<", "6"], [">", "50/3"]]),
  "ex-4am-mutarajiha-ula-l2-004:q1": deduce("<=", "4", "-x", [[">=", "4"], ["<=", "-4"], [">=", "-4"]]),
  "ex-4am-mutarajiha-ula-l2-004:q2": deduce("<=", "4", "x-3", [["<=", "-1"], ["<=", "1"], [">=", "1"]]),
  "ex-4am-mutarajiha-ula-l2-004:q3": deduce("<=", "4", "x/2", [["<=", "1"], ["<=", "2"], [">=", "2"]]),
  "ex-4am-mutarajiha-ula-l2-005:q1": solve("5*x", ">", "-15", [["<", "-3"], [">", "-3"], [">", "-10"]]),
  "ex-4am-mutarajiha-ula-l2-005:q2": solve("-6*x", "<=", "18", [[">=", "-3"], ["<=", "-3"], [">=", "3"]]),
  "ex-4am-mutarajiha-ula-l2-005:q3": solve("x+7", "<", "2", [["<", "-5"], ["<", "9"], [">", "-5"]]),
  "ex-4am-mutarajiha-ula-l2-006:q1": solve("-x", ">", "4", [[">", "4"], [">", "-4"], ["<", "-4"]]),
  "ex-4am-mutarajiha-ula-l2-006:q2": solve("x/3", ">=", "-2", [[">=", "-2/3"], [">=", "-6"], ["<=", "-6"]]),
  "ex-4am-mutarajiha-ula-l2-006:q3": solve("-x/2", "<", "3", [[">", "-6"], [">", "-3/2"], ["<", "-6"]]),
  "ex-4am-mutarajiha-ula-l2-007:q1": graph("x", ">=", "-1", [["right", true, "-1"], ["left", true, "-1"], ["right", false, "-1"]]),
  "ex-4am-mutarajiha-ula-l2-007:q2": graph("x", "<", "2", [["left", false, "2"], ["left", true, "2"], ["right", false, "2"]]),
  "ex-4am-mutarajiha-ula-l2-008:q1": fromGraph("right", false, "-3", [[">=", "-3"], [">", "-3"], ["<", "-3"]]),
  "ex-4am-mutarajiha-ula-l2-008:q2": fromGraph("left", true, "1/2", [["<", "1/2"], ["<=", "1/2"], [">=", "1/2"]]),
  "ex-4am-mutarajiha-ula-l2-009:q1": solve("-4*x", "<=", "12", [[">=", "-3"], ["<=", "-3"], [">=", "3"]]),
  "ex-4am-mutarajiha-ula-l2-009:q2": solve("4*x", "<=", "-12", [["<=", "-3"], [">=", "-3"], ["<=", "3"]]),
  "ex-4am-mutarajiha-ula-l2-010:q1": solve("-1/2*x+2", "<", "-1", [[">", "6"], ["<", "6"], [">", "2"]]),
  "ex-4am-mutarajiha-ula-l2-010:q2": graph("-1/2*x+2", "<", "-1", [["right", false, "6"], ["right", true, "6"], ["left", false, "6"]]),
  "ex-4am-mutarajiha-ula-l3-001:q1": equiv("-3*x+5", "<=", "20", [["-3*x", ">=", "15"], ["-3*x", "<=", "15"], ["-3*x", "<=", "25"]]),
  "ex-4am-mutarajiha-ula-l3-001:q2": solve("-3*x+5", "<=", "20", [["<=", "-5"], [">=", "-5"], [">=", "5"]]),
  "ex-4am-mutarajiha-ula-l3-001:q3": graph("-3*x+5", "<=", "20", [["right", false, "-5"], ["left", true, "-5"], ["right", true, "-5"]]),
  "ex-4am-mutarajiha-ula-l3-002:q1": solve("3*x-2", "<", "6", [["<", "8/3"], ["<", "4/3"], [">", "8/3"]]),
  "ex-4am-mutarajiha-ula-l3-002:q2": integer("max", "3*x-2", "<", "6"),
  "ex-4am-mutarajiha-ula-l3-003:q1": solve("4*x-1", "<=", "17-2*x", [["<=", "3"], ["<=", "9"], [">=", "3"]]),
  "ex-4am-mutarajiha-ula-l3-003:q2": integer("max", "4*x-1", "<=", "17-2*x"),
  "ex-4am-mutarajiha-ula-l3-003:q3": graph("4*x-1", "<=", "17-2*x", [["left", false, "3"], ["right", true, "3"], ["left", true, "3"]]),
  "ex-4am-mutarajiha-ula-l3-004:q1": solve("2*x-1", "<=", "6", [[">=", "7/2"], ["<=", "5/2"], ["<=", "7/2"]]),
  "ex-4am-mutarajiha-ula-l3-004:q2": graph("2*x-1", "<=", "6", [["left", false, "7/2"], ["left", true, "7/2"], ["right", true, "7/2"]]),
  "ex-4am-mutarajiha-ula-l3-005:q1": solve("7-2*x", ">", "1", [["<", "3"], [">", "3"], ["<", "-3"]]),
  "ex-4am-mutarajiha-ula-l3-005:q2": graph("7-2*x", ">", "1", [["left", false, "3"], ["right", false, "3"], ["left", true, "3"]]),
  "ex-4am-mutarajiha-ula-l3-005:q3": integer("countNat", "7-2*x", ">", "1"),
  "ex-4am-mutarajiha-ula-l3-006:q1": solve("5*x+4", ">=", "2*x-8", [["<=", "-4"], [">=", "-4"], [">=", "-12/7"]]),
  "ex-4am-mutarajiha-ula-l3-006:q2": integer("min", "5*x+4", ">=", "2*x-8"),
  "ex-4am-mutarajiha-ula-l3-007:q1": solve("-4*x+9", "<", "1", [[">", "2"], [">", "-5/2"], ["<", "2"]]),
  "ex-4am-mutarajiha-ula-l3-007:q2": graph("-4*x+9", "<", "1", [["right", true, "2"], ["right", false, "2"], ["left", false, "2"]]),
  "ex-4am-mutarajiha-ula-l3-008:q1": solve("3*(x-2)", "<=", "x+4", [["<=", "5"], [">=", "5"], ["<=", "3"]]),
  "ex-4am-mutarajiha-ula-l3-008:q2": integer("countNat", "3*(x-2)", "<=", "x+4"),
  "ex-4am-mutarajiha-ula-l3-009:q1": solve("800+150*x", "<=", "2000", [["<=", "56/3"], ["<=", "8"], [">=", "8"]]),
  "ex-4am-mutarajiha-ula-l3-009:q2": integer("maxNat", "800+150*x", "<=", "2000"),
  "ex-4am-mutarajiha-ula-l3-010:q1": test("2*x-3", ">=", "4*x+1", "-2"),
  "ex-4am-mutarajiha-ula-l3-010:q2": solve("2*x-3", ">=", "4*x+1", [["<=", "-2"], [">=", "-2"], ["<=", "2"]]),
  "ex-4am-mutarajiha-ula-l4-001:q1": solve("5/2*x-1/3", ">", "0", [[">", "5/6"], [">", "2/15"], ["<", "2/15"]]),
  "ex-4am-mutarajiha-ula-l4-001:q2": solve("6/5*x-3/5", "<=", "3", [["<=", "2"], ["<=", "3"], [">=", "3"]]),
  "ex-4am-mutarajiha-ula-l4-002:q1": solve("x/2-3/4", ">=", "1", [[">=", "7/2"], [">=", "1/2"], [">=", "7/4"]]),
  "ex-4am-mutarajiha-ula-l4-002:q2": solve("(x+1)/2", "<", "3*x-1", [[">", "3/5"], [">", "1"], ["<", "3/5"]]),
  "ex-4am-mutarajiha-ula-l4-003:q1": solve("5*(2*x-1)", ">=", "4*x-1", [[">=", "0"], ["<=", "2/3"], [">=", "2/3"]]),
  "ex-4am-mutarajiha-ula-l4-003:q2": graph("5*(2*x-1)", ">=", "4*x-1", [["left", true, "2/3"], ["right", false, "2/3"], ["right", true, "2/3"]]),
  "ex-4am-mutarajiha-ula-l4-004:q1": solve("-5*(2*x-1)", "<=", "2-4*x", [[">=", "-1/2"], ["<=", "1/2"], [">=", "1/2"]]),
  "ex-4am-mutarajiha-ula-l4-004:q2": solve("(5*x-1)/2+3", ">", "1+2*x", [[">", "-3"], [">", "-1"], ["<", "-3"]]),
  "ex-4am-mutarajiha-ula-l4-004:q3": graph("-5*(2*x-1)", "<=", "2-4*x", [["right", true, "1/2"], ["right", false, "1/2"], ["left", true, "1/2"]]),
  "ex-4am-mutarajiha-ula-l4-005:q1": solve("-7*x+1", "<", "x-3", [[">", "1/2"], ["<", "1/2"], [">", "-1/2"]]),
  "ex-4am-mutarajiha-ula-l4-005:q2": solve("(3*x+2)/6", ">=", "(2*x-3)/5", [[">=", "-28/3"], [">=", "-8/3"], ["<=", "-28/3"]]),
  "ex-4am-mutarajiha-ula-l4-006:q1": solve("4*x-1", "<=", "x+3", [["<=", "4/3"], [">=", "4/3"], ["<=", "2/3"]]),
  "ex-4am-mutarajiha-ula-l4-006:q2": solve("-3*x+2", ">", "20", [["<", "-22/3"], ["<", "-6"], [">", "-6"]]),
  "ex-4am-mutarajiha-ula-l4-007:q1": solve("(2*x-1)/3", ">=", "x-2", [["<=", "5"], [">=", "5"], ["<=", "1"]]),
  "ex-4am-mutarajiha-ula-l4-007:q2": graph("(2*x-1)/3", ">=", "x-2", [["left", false, "5"], ["right", true, "5"], ["left", true, "5"]]),
  "ex-4am-mutarajiha-ula-l4-008:q1": solve("1/2*x-3/2", ">", "2*x+3", [[">", "-3"], ["<", "-3"], ["<", "-1"]]),
  "ex-4am-mutarajiha-ula-l4-008:q2": integer("max", "1/2*x-3/2", ">", "2*x+3"),
  "ex-4am-mutarajiha-ula-l4-009:q1": solve("x/4+1", "<", "x/2", [[">", "4"], [">", "2"], ["<", "4"]]),
  "ex-4am-mutarajiha-ula-l4-009:q2": integer("min", "x/4+1", "<", "x/2"),
  "ex-4am-mutarajiha-ula-l4-010:q1": solve("2*(3-x)", ">=", "5-(x+1)", [["<=", "0"], ["<=", "2"], [">=", "2"]]),
  "ex-4am-mutarajiha-ula-l4-010:q2": graph("2*(3-x)", ">=", "5-(x+1)", [["right", true, "2"], ["left", true, "2"], ["left", false, "2"]]),
  "ex-4am-mutarajiha-ula-l5-001:q1": polyEq("(-3*x-1)**2-3*x*(3*x+7)", ["-27*x+1", "-15*x+1", "18*x**2-15*x+1"]),
  "ex-4am-mutarajiha-ula-l5-001:q2": polyEq("(4*x**2-1)-(2*x+1)*(2*x+3)", ["-4*(2*x+1)", "(2*x+1)*(4*x+2)", "4*(2*x+1)"]),
  "ex-4am-mutarajiha-ula-l5-001:q3": solve("(-3*x-1)**2-3*x*(3*x+7)", "<=", "(4*x**2-1)-(2*x+1)*(2*x+3)", [[">=", "5/7"], [">=", "-5/7"], ["<=", "5/7"]]),
  "ex-4am-mutarajiha-ula-l5-002:q1": solve("3*(2*x-6)+4*(2*x-3)", ">=", "2*x-5*(2*x-3)", [[">=", "15/22"], ["<=", "45/22"], [">=", "45/22"]]),
  "ex-4am-mutarajiha-ula-l5-002:q2": graph("3*(2*x-6)+4*(2*x-3)", ">=", "2*x-5*(2*x-3)", [["left", true, "45/22"], ["right", true, "45/22"], ["right", false, "45/22"]]),
  "ex-4am-mutarajiha-ula-l5-003:q1": solve("6*(1-2*x)-4*(-2*x-5)", ">", "3*(x-7)-2*(8-9*x)", [[">", "63/25"], ["<", "63/25"], [">", "-63/11"]]),
  "ex-4am-mutarajiha-ula-l5-003:q2": graph("6*(1-2*x)-4*(-2*x-5)", ">", "3*(x-7)-2*(8-9*x)", [["left", false, "63/25"], ["left", true, "63/25"], ["right", false, "63/25"]]),
  "ex-4am-mutarajiha-ula-l5-004:q1": solve("(x-3)**2", "<=", "(x+1)*(x-5)", [[">=", "7"], [">=", "2"], ["<=", "7"]]),
  "ex-4am-mutarajiha-ula-l5-004:q2": integer("min", "(x-3)**2", "<=", "(x+1)*(x-5)"),
  "ex-4am-mutarajiha-ula-l5-005:q1": solve("(2*x+1)**2-4*x**2", ">", "3*x-7", [[">", "-8"], [">", "-6"], ["<", "-8"]]),
  "ex-4am-mutarajiha-ula-l5-005:q2": graph("(2*x+1)**2-4*x**2", ">", "3*x-7", [["left", false, "-8"], ["right", true, "-8"], ["right", false, "-8"]]),
  "ex-4am-mutarajiha-ula-l5-006:q1": solve("10*x", "<", "500+4*x", [[">", "250/3"], ["<", "250/7"], ["<", "250/3"]]),
  "ex-4am-mutarajiha-ula-l5-006:q2": integer("maxNat", "10*x", "<", "500+4*x"),
  "ex-4am-mutarajiha-ula-l5-007:q1": solve("150+40*x", "<=", "1000", [[">=", "85/4"], ["<=", "85/4"], ["<=", "115/4"]]),
  "ex-4am-mutarajiha-ula-l5-007:q2": integer("maxNat", "150+40*x", "<=", "1000"),
  "ex-4am-mutarajiha-ula-l5-008:q1": solve("(3*x-1)/2-(x+2)/3", "<", "1", [["<", "5/7"], ["<", "13/7"], [">", "13/7"]]),
  "ex-4am-mutarajiha-ula-l5-008:q2": integer("countNat", "(3*x-1)/2-(x+2)/3", "<", "1"),
  "ex-4am-mutarajiha-ula-l5-009:q1": graph("-5*(x+2)", "<", "3*x+14", [["right", false, "-3"], ["right", true, "-3"], ["left", false, "-3"]]),
  "ex-4am-mutarajiha-ula-l5-009:q2": test("-5*(x+2)", "<", "3*x+14", "-3"),
  "ex-4am-mutarajiha-ula-l5-010:q2": integer("maxNat", "2*(x+x+4)", "<=", "40"),
};
