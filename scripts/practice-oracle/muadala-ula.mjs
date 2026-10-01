// Oracle du banc « muadala-ula » (unité 4 « معادلات ومتراجحات ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Un petit analyseur d'expressions du PREMIER DEGRÉ écrit ici (nombres à virgule ou point,
// x, + − × /, parenthèses, produit implicite « 3x », « 3(x − 2) ») et des rationnels exacts
// (helpers.mjs › q) : chaque équation est résolue, aucune clé n'est recopiée.
//   solveR(L, R)          la solution unique, en réponse construite
//   pickSol(L, R, opts)   l'unique option égale à la solution ('none' : aucune solution)
//   pickEquiv(L, R, eqs)  l'unique équation proposée qui a la MÊME solution (une étape licite)
//   valueR(expr, x)       la valeur d'une expression pour x
//   isSolution(L, R, x)   « نعم » (A) si x vérifie l'égalité, sinon « لا » (B)
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

const ZERO = q(0);
function tokenize(src) {
  const s = String(src).replace(/\s+/g, '').replace(/−/g, '-').replace(/,/g, '.');
  const out = [];
  for (let i = 0; i < s.length;) {
    if (/[\d.]/.test(s[i])) { let j = i; while (j < s.length && /[\d.]/.test(s[j])) j++; out.push({ t: 'n', v: q(s.slice(i, j)) }); i = j; }
    else { out.push({ t: s[i] }); i++; }
  }
  return out;
}
function parse(src) {
  const toks = tokenize(src); let i = 0;
  const peek = () => toks[i]?.t;
  const mul = ([a, b], [c, d]) => {
    if (!a.isZero() && !c.isZero()) throw new Error(`non linéaire : ${src}`);
    return [a.mul(d).add(c.mul(b)), b.mul(d)];
  };
  const factor = () => {
    const k = peek();
    if (k === '-') { i++; const [a, b] = factor(); return [a.neg(), b.neg()]; }
    if (k === '+') { i++; return factor(); }
    if (k === 'n') return [ZERO, toks[i++].v];
    if (k === 'x') { i++; return [q(1), ZERO]; }
    if (k === '(') { i++; const v = expr(); if (toks[i++]?.t !== ')') throw new Error(`parenthèse : ${src}`); return v; }
    throw new Error(`illisible : ${src}`);
  };
  const term = () => {
    let v = factor();
    for (;;) {
      const k = peek();
      if (k === '*') { i++; v = mul(v, factor()); }
      else if (k === '/') { i++; const [c, d] = factor(); if (!c.isZero() || d.isZero()) throw new Error(`division : ${src}`); v = [v[0].div(d), v[1].div(d)]; }
      else if (k === 'n' || k === 'x' || k === '(') v = mul(v, factor());
      else return v;
    }
  };
  const expr = () => {
    let [a, b] = term();
    while (peek() === '+' || peek() === '-') {
      const op = toks[i++].t; const [c, d] = term();
      [a, b] = op === '+' ? [a.add(c), b.add(d)] : [a.sub(c), b.sub(d)];
    }
    return [a, b];
  };
  const v = expr();
  if (i !== toks.length) throw new Error(`reste : ${src}`);
  return v;
}
function solution(L, Rr) {
  const [a, b] = parse(L); const [c, d] = parse(Rr);
  const A = a.sub(c); const B = d.sub(b);
  if (A.isZero()) return B.isZero() ? 'all' : 'none';
  return B.div(A).toString();
}
const same = (u, v) => (u === 'none' || v === 'none' ? u === v : q(u).sub(q(v)).isZero());
const only = (hits, what) => { if (hits.length !== 1) throw new Error(`muadala-ula oracle: ${hits.length} options pour ${what}`); return C('ABCD'[hits[0]]); };
const solveR = (L, Rr) => R(solution(L, Rr));
const pickSol = (L, Rr, opts) => { const s = solution(L, Rr); return only(opts.map((o, i) => (same(o, s) ? i : -1)).filter((i) => i >= 0), `${L}=${Rr}`); };
const pickEquiv = (L, Rr, eqs) => {
  const s = solution(L, Rr);
  return only(eqs.map((e, i) => { const [l, r] = e.split('='); return same(solution(l, r), s) ? i : -1; }).filter((i) => i >= 0), `${L}=${Rr}`);
};
const valueR = (expr, x) => { const [a, b] = parse(expr); return R(a.mul(q(x)).add(b).toString()); };
const isSolution = (L, Rr, x) => { const [a, b] = parse(L); const [c, d] = parse(Rr); return C(a.mul(q(x)).add(b).sub(c.mul(q(x)).add(d)).isZero() ? 'A' : 'B'); };

export const ORACLE = {
  'ex-4am-muadala-ula-l1-001:q1': solveR('2x', '11'),
  'ex-4am-muadala-ula-l1-001:q2': pickSol('-3x', '5', ['8', '-5/3', '-3/5']),
  'ex-4am-muadala-ula-l1-002:q1': solveR('2.8x', '5.6'),
  'ex-4am-muadala-ula-l1-002:q2': solveR('x/4', '7'),
  'ex-4am-muadala-ula-l1-003:q1': solveR('10x', '100'),
  'ex-4am-muadala-ula-l1-003:q2': solveR('100000x', '1000'),
  'ex-4am-muadala-ula-l1-004:q1': pickSol('x+11', '2', ['13', '9', '-9']),
  'ex-4am-muadala-ula-l1-004:q2': solveR('3.2+x', '5'),
  'ex-4am-muadala-ula-l1-005:q1': solveR('6x', '42'),
  'ex-4am-muadala-ula-l1-005:q2': pickSol('4x', '6', ['3/2', '2/3', '2']),
  'ex-4am-muadala-ula-l1-006:q1': pickSol('-5x', '20', ['-4', '-1/4', '25']),
  'ex-4am-muadala-ula-l1-006:q2': solveR('-7x', '-2'),
  'ex-4am-muadala-ula-l1-007:q1': solveR('x-9', '-4'),
  'ex-4am-muadala-ula-l1-007:q2': pickSol('x+7', '-3', ['10', '-10', '4']),
  'ex-4am-muadala-ula-l1-008:q1': isSolution('3x', '-12', '-4'),
  'ex-4am-muadala-ula-l1-008:q2': isSolution('x+5', '2', '7'),
  'ex-4am-muadala-ula-l1-009:q1': solveR('9x', '6'),
  'ex-4am-muadala-ula-l1-009:q2': pickSol('8x', '-3', ['-8/3', '-11', '-3/8']),
  'ex-4am-muadala-ula-l1-010:q1': pickEquiv('x+6', '15', ['1x=21', '1x=15', '1x=9']),
  'ex-4am-muadala-ula-l1-010:q2': solveR('x-2.5', '1'),
  'ex-4am-muadala-ula-l2-001:q1': pickEquiv('2x-5', '8', ['2x=8', '2x=13', '2x=3']),
  'ex-4am-muadala-ula-l2-001:q2': solveR('2x-5', '8'),
  'ex-4am-muadala-ula-l2-002:q1': valueR('9x+1', '2'),
  'ex-4am-muadala-ula-l2-002:q2': solveR('9x+1', '-26'),
  'ex-4am-muadala-ula-l2-003:q1': pickSol('5x+6', '11', ['17/5', '-1', '1']),
  'ex-4am-muadala-ula-l2-003:q2': pickEquiv('5x+6', '11', ['5x=11', '5x=5', '5x=17']),
  'ex-4am-muadala-ula-l2-004:q1': pickEquiv('7-2x', '0', ['-2x=0', '-2x=-7', '-2x=7']),
  'ex-4am-muadala-ula-l2-004:q2': solveR('7-2x', '0'),
  'ex-4am-muadala-ula-l2-005:q1': solveR('4x+3', '23'),
  'ex-4am-muadala-ula-l2-005:q2': pickSol('3x-8', '1', ['-7/3', '1/3', '3']),
  'ex-4am-muadala-ula-l2-006:q1': pickSol('6x+5', '-13', ['-4/3', '-1/3', '-3']),
  'ex-4am-muadala-ula-l2-006:q2': solveR('2x+9', '4'),
  'ex-4am-muadala-ula-l2-007:q1': pickSol('-4x+1', '13', ['-1/3', '-3', '-7/2']),
  'ex-4am-muadala-ula-l2-007:q2': solveR('10-3x', '-5'),
  'ex-4am-muadala-ula-l2-008:q1': solveR('4x-1', '6'),
  'ex-4am-muadala-ula-l2-008:q2': pickSol('6x+2', '-1', ['1/6', '-2', '-1/2']),
  'ex-4am-muadala-ula-l2-009:q1': solveR('17', '5x+2'),
  'ex-4am-muadala-ula-l2-009:q2': pickEquiv('-8', '3x+4', ['-12=3x+4', '-12=3x', '-12=3x+8']),
  'ex-4am-muadala-ula-l2-010:q1': solveR('5x-4', '-19'),
  'ex-4am-muadala-ula-l2-010:q2': isSolution('5x-4', '-19', '3'),
  'ex-4am-muadala-ula-l3-001:q1': pickEquiv('4x-3', '2x+6', ['2x-3=6', '2x-3=4x+6', '2x-3=2x+6']),
  'ex-4am-muadala-ula-l3-001:q2': solveR('4x-3', '2x+6'),
  'ex-4am-muadala-ula-l3-002:q1': pickEquiv('9x+1', '2x', ['7x+1=4x', '7x+1=2x', '7x+1=0']),
  'ex-4am-muadala-ula-l3-002:q2': solveR('9x+1', '2x'),
  'ex-4am-muadala-ula-l3-003:q1': solveR('2x-3', '3x+1'),
  'ex-4am-muadala-ula-l3-003:q2': pickSol('4x-3', '-2x+5', ['4/3', '1/3', '4']),
  'ex-4am-muadala-ula-l3-004:q1': pickEquiv('5x+11', '11x+5', ['11=6x+5', '11=16x+5', '11=11x+5']),
  'ex-4am-muadala-ula-l3-004:q2': solveR('5x+11', '11x+5'),
  'ex-4am-muadala-ula-l3-005:q1': solveR('7x+2', '3x+14'),
  'ex-4am-muadala-ula-l3-005:q2': pickSol('5x-6', '2x+9', ['15/7', '5', '1']),
  'ex-4am-muadala-ula-l3-006:q1': pickSol('3x+4', '-x+12', ['1/2', '2', '4']),
  'ex-4am-muadala-ula-l3-006:q2': solveR('-2x+7', '4x-5'),
  'ex-4am-muadala-ula-l3-007:q1': solveR('8x-1', '2x+3'),
  'ex-4am-muadala-ula-l3-007:q2': pickSol('x+5', '6x-2', ['-3/5', '-1', '7/5']),
  'ex-4am-muadala-ula-l3-008:q1': pickEquiv('6x+1', '4x-7', ['2x+1=8x-7', '2x+1=4x-7', '2x+1=-7']),
  'ex-4am-muadala-ula-l3-008:q2': pickEquiv('3x+10', 'x-2', ['3x=1x-2', '3x=1x-12', '3x=1x+8']),
  'ex-4am-muadala-ula-l3-009:q1': solveR('3x+8', '8-5x'),
  'ex-4am-muadala-ula-l3-009:q2': isSolution('7x', '2x', '0'),
  'ex-4am-muadala-ula-l3-010:q1': isSolution('4x-3', '2x+6', '9/2'),
  'ex-4am-muadala-ula-l3-010:q2': isSolution('2x+1', '5x-8', '-3'),
  'ex-4am-muadala-ula-l4-001:q1': pickEquiv('2.5x+4.6', '1.3x-0.2', ['6/5*x+(23/5)=13/5*x(-1/5)', '6/5*x+(23/5)=13/10*x(-1/5)', '6/5*x+(23/5)=(-1/5)']),
  'ex-4am-muadala-ula-l4-001:q2': solveR('2.5x+4.6', '1.3x-0.2'),
  'ex-4am-muadala-ula-l4-002:q1': valueR('2x+24-7(x-2)', '0'),
  'ex-4am-muadala-ula-l4-002:q2': solveR('2x+24-7(x-2)', '138'),
  'ex-4am-muadala-ula-l4-003:q1': pickEquiv('4x+1', '2x+15', ['2x+1=15', '2x+1=4x+15', '2x+1=2x+15']),
  'ex-4am-muadala-ula-l4-003:q2': solveR('2(2x-1)+3', '5(x+3)-3x'),
  'ex-4am-muadala-ula-l4-004:q1': pickSol('1/2*(2x-1)-3(2/3*x-1/2)', '0', ['-1', '0', '1']),
  'ex-4am-muadala-ula-l4-004:q2': solveR('-2(x+5)-3+6x', '0'),
  'ex-4am-muadala-ula-l4-005:q1': pickSol('3(x-2)', 'x+4', ['5/2', '5', '-1']),
  'ex-4am-muadala-ula-l4-005:q2': solveR('5(2x+1)', '3x-9'),
  'ex-4am-muadala-ula-l4-006:q1': solveR('8-(x-3)', '2x+5'),
  'ex-4am-muadala-ula-l4-006:q2': pickSol('4x-(2x+7)', '9', ['1', '1/8', '8']),
  'ex-4am-muadala-ula-l4-007:q1': solveR('0.5x+1.2', '3.7'),
  'ex-4am-muadala-ula-l4-007:q2': pickSol('1.4x-2', '0.4x+3', ['25/9', '5', '1']),
  'ex-4am-muadala-ula-l4-008:q1': solveR('2(x+4)', '3(x-1)'),
  'ex-4am-muadala-ula-l4-008:q2': pickSol('4(x-1)+x', '2(x+5)', ['14/3', '2', '3/14']),
  'ex-4am-muadala-ula-l4-009:q1': pickSol('3x+5x-2x', '-9', ['-3/2', '-2/3', '-15']),
  'ex-4am-muadala-ula-l4-009:q2': solveR('7x-2(x+1)', '8'),
  'ex-4am-muadala-ula-l4-010:q1': solveR('6(x-1)', '4x'),
  'ex-4am-muadala-ula-l4-010:q2': isSolution('6(x-1)', '4x', '3'),
  'ex-4am-muadala-ula-l5-001:q1': solveR('(x-1)/9', '(x+1)/3'),
  'ex-4am-muadala-ula-l5-001:q2': pickSol('x', '(x+3)/5+1', ['2', '4/3', '1/2']),
  'ex-4am-muadala-ula-l5-002:q1': pickSol('(2+x)/2', '(2x+1)/4', ['none', '0', '-3/2']),
  'ex-4am-muadala-ula-l5-002:q2': solveR('(x+4)/10', '3/10-2x/5'),
  'ex-4am-muadala-ula-l5-003:q1': pickSol('(-x+3)/2', '(2x+1)/3', ['-11/7', '-7', '1']),
  'ex-4am-muadala-ula-l5-003:q2': solveR('2x-1/3', 'x/5+2'),
  'ex-4am-muadala-ula-l5-004:q1': solveR('(x+2)/3', '(x-1)/2'),
  'ex-4am-muadala-ula-l5-004:q2': pickSol('x/2+x/3', '5', ['6', '1/6', '-6']),
  'ex-4am-muadala-ula-l5-005:q1': solveR('2/3*x', '8'),
  'ex-4am-muadala-ula-l5-005:q2': pickSol('3/4*x', '-6', ['-1/8', '-27/4', '-8']),
  'ex-4am-muadala-ula-l5-006:q1': solveR('2x+5', '-7'),
  'ex-4am-muadala-ula-l5-006:q2': solveR('2x+5', '3x'),
  'ex-4am-muadala-ula-l5-007:q1': pickSol('9x+1', 'x', ['-1/10', '-1/8', '1/8']),
  'ex-4am-muadala-ula-l5-007:q2': solveR('9x+1', '-x'),
  'ex-4am-muadala-ula-l5-008:q1': pickSol('3(x+2)', '3x+1', ['-5/3', 'none', '0']),
  'ex-4am-muadala-ula-l5-008:q2': solveR('3(x+2)', 'x+1'),
  'ex-4am-muadala-ula-l5-009:q1': solveR('(3x-1)/4', '(x+5)/2'),
  'ex-4am-muadala-ula-l5-009:q2': isSolution('(3x-1)/4', '(x+5)/2', '11'),
  'ex-4am-muadala-ula-l5-010:q1': solveR('1.2x-0.5', '0.3x+1'),
  'ex-4am-muadala-ula-l5-010:q2': pickSol('0.6x', '0.9-1.5x', ['3/7', '-1', '7/3']),
};
