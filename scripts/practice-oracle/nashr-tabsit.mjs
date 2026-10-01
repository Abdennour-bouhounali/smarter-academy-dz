// Oracle du banc « nashr-tabsit » (unité 3 « الحساب الحرفي ») — chaque réponse RECALCULÉE ici.
// Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// E('…') lit une expression à UNE lettre (x, y, a… : toutes lues comme la même
// variable) avec + − × /, ^, parenthèses et produit implicite (« 3x », « 2(x + 1) »,
// « (x + 2)(3x − 1) »), et la CALCULE avec les polynômes exacts de helpers.mjs —
// sans rien lire du contenu ni du code testé. Une division ne se fait que par un
// nombre. only(cible, { A: …, B: … }) rend l'UNIQUE choix égal (comme polynôme) à
// la cible — et lève une erreur si aucun ou plusieurs le sont : un distracteur vrai
// ferait échouer le test.
import { R, C, poly, q } from './helpers.mjs';

function E(src) {
  const s = String(src).replace(/\s+/g, '').replace(/−/g, '-').replace(/×/g, '*');
  let i = 0;
  const peek = () => s[i];
  const fail = (m) => { throw new Error(`oracle nashr-tabsit: ${m} dans « ${src} » (position ${i})`); };
  const startsFactor = (c) => c !== undefined && (/[0-9.(]/.test(c) || /[a-z]/.test(c));
  function primary() {
    const c = peek();
    if (c === '(') { i += 1; const v = sum(); if (peek() !== ')') fail('« ) » attendue'); i += 1; return v; }
    if (/[a-z]/.test(c)) { i += 1; return poly.x; }
    const m = s.slice(i).match(/^\d+(\.\d+)?/);
    if (!m) fail('terme illisible');
    i += m[0].length;
    return poly.of(m[0]);
  }
  function power() {
    let v = primary();
    if (peek() === '^') { i += 1; const m = s.slice(i).match(/^\d+/); if (!m) fail('exposant'); i += m[0].length; v = v.pow(Number(m[0])); }
    return v;
  }
  function factor() {
    if (peek() === '-') { i += 1; return factor().mul(-1); }
    if (peek() === '+') { i += 1; return factor(); }
    return power();
  }
  function product() {
    let v = factor();
    for (;;) {
      const c = peek();
      if (c === '*') { i += 1; v = v.mul(factor()); }
      else if (c === '/') {
        i += 1; const d = factor();
        if (d.degree() > 0) fail('division par une expression littérale');
        v = v.mul(poly.Q(1).div(poly.Q(d.coef(0))));
      } else if (startsFactor(c)) v = v.mul(power());
      else return v;
    }
  }
  function sum() {
    let v = product();
    for (;;) {
      const c = peek();
      if (c === '+') { i += 1; v = v.add(product()); }
      else if (c === '-') { i += 1; v = v.sub(product()); }
      else return v;
    }
  }
  const v = sum();
  if (i !== s.length) fail('caractère inattendu');
  return v;
}

function only(target, options) {
  const ok = Object.entries(options).filter(([, p]) => p.equals(target)).map(([id]) => id);
  if (ok.length !== 1) throw new Error(`oracle nashr-tabsit: ${ok.length} choix égaux à la cible (${ok.join(', ')})`);
  return ok[0];
}

export const ORACLE = {
  'ex-4am-nashr-tabsit-l1-001:q1': C(only(E('2(5x - 1)'), { A: E('10x - 1'), B: E('10x - 2'), C: E('10x + 2') })),
  'ex-4am-nashr-tabsit-l1-001:q2': C(only(E('-3(3 - x)'), { A: E('-9 - 3x'), B: E('-9 + x'), C: E('3x - 9') })),
  'ex-4am-nashr-tabsit-l1-001:q3': C(only(E('(2/5)(-20x + (15/2))'), { A: E('-8x + 3'), B: E('-8x + (15/2)'), C: E('8x + 3') })),
  'ex-4am-nashr-tabsit-l1-001:q4': C(only(E('-4(7 - (3/2)x)'), { A: E('-28 - 6x'), B: E('6x - 28'), C: E('28 - 6x') })),
  'ex-4am-nashr-tabsit-l1-002:q1': R(E('3(9+5)').at(0)),
  'ex-4am-nashr-tabsit-l1-002:q2': R(E('(4-2.5)(3+1.2)').at(0)),
  'ex-4am-nashr-tabsit-l1-002:q3': C('A'), // آخر عملية هي ضرب $x$ في القوس: العبارة جداء.
  'ex-4am-nashr-tabsit-l1-002:q4': C('B'), // آخر عملية جمع وطرح ثلاثة حدود: العبارة مجموع، وإن كان أحد حدودها جداء.
  'ex-4am-nashr-tabsit-l1-002:q5': C('A'), // آخر عملية هي ضرب القوسين: العبارة جداء.
  'ex-4am-nashr-tabsit-l1-003:q1': C('A'), // آخر عملية هي ضرب 2 في القوس: العبارة جداء.
  'ex-4am-nashr-tabsit-l1-003:q2': C('B'), // آخر عملية هي جمع $2x$ و 7: العبارة مجموع.
  'ex-4am-nashr-tabsit-l1-003:q3': C('A'), // آخر عملية هي ضرب القوسين: العبارة جداء.
  'ex-4am-nashr-tabsit-l1-004:q1': C('B'), // définition du livre (معارف 1) : produit → somme ou différence
  'ex-4am-nashr-tabsit-l1-004:q2': C('C'), // seule (x + 3)(x − 2) a un × comme dernière opération
  'ex-4am-nashr-tabsit-l1-005:q1': C(only(E('4(x + 3)'), { A: E('4x + 3'), B: E('4x + 12'), C: E('7x') })),
  'ex-4am-nashr-tabsit-l1-005:q2': R(E('5(2x+9)').coef(0)),
  'ex-4am-nashr-tabsit-l1-006:q1': C(only(E('7(2 - y)'), { A: E('14 - 7y'), B: E('14 - y'), C: E('14 + 7y') })),
  'ex-4am-nashr-tabsit-l1-006:q2': R(E('6(3-2x)').coef(1)),
  'ex-4am-nashr-tabsit-l1-007:q1': C(only(E('x * x'), { A: E('2x'), B: E('x^2'), C: E('x') })),
  'ex-4am-nashr-tabsit-l1-007:q2': C(only(E('x + x'), { A: E('2x'), B: E('x^2'), C: E('2x^2') })),
  'ex-4am-nashr-tabsit-l1-007:q3': C(only(E('3x * 2x'), { A: E('6x'), B: E('5x^2'), C: E('6x^2') })),
  'ex-4am-nashr-tabsit-l1-008:q1': C(only(E('5x + 3x'), { A: E('8x'), B: E('8x^2'), C: E('15x') })),
  'ex-4am-nashr-tabsit-l1-008:q2': C('A'), // puissances 2 et 1 : non semblables
  'ex-4am-nashr-tabsit-l1-009:q1': R(q(2).mul(2)),
  'ex-4am-nashr-tabsit-l1-009:q2': C(only(E('(x + 2)(x + 5)'), { A: E('x^2 + 10'), B: E('x^2 + 7x + 10'), C: E('x^2 + 7x + 7') })),
  'ex-4am-nashr-tabsit-l1-010:q1': R(E('6(100+2)').at(0)),
  'ex-4am-nashr-tabsit-l1-010:q2': R(E('8(100-1)').at(0)),
  'ex-4am-nashr-tabsit-l2-001:q1': C(only(E('x(3x + 1)'), { A: E('3x^2 + x'), B: E('3x^2 + 1'), C: E('4x^2') })),
  'ex-4am-nashr-tabsit-l2-001:q2': C(only(E('5x(1 - x)'), { A: E('5x + 5x^2'), B: E('5x - 5x^2'), C: E('4x') })),
  'ex-4am-nashr-tabsit-l2-001:q3': C(only(E('(3x - 1)(3 + x)'), { A: E('3x^2 + 10x - 3'), B: E('11x^2 - 3'), C: E('3x^2 + 8x - 3') })),
  'ex-4am-nashr-tabsit-l2-002:q1': C(only(E('-3(x + 4)'), { A: E('-3x + 12'), B: E('-3x - 12'), C: E('-3x + 4') })),
  'ex-4am-nashr-tabsit-l2-002:q2': C(only(E('-2(5 - 3x)'), { A: E('-10 + 6x'), B: E('-10 - 6x'), C: E('-10 - 3x') })),
  'ex-4am-nashr-tabsit-l2-003:q1': C(only(E('x(x + 6)'), { A: E('x^2 + 6'), B: E('2x + 6x'), C: E('x^2 + 6x') })),
  'ex-4am-nashr-tabsit-l2-003:q2': R(E('x(x+6)').coef(1)),
  'ex-4am-nashr-tabsit-l2-004:q1': C(only(E('2x(3x - 5)'), { A: E('6x^2 - 10x'), B: E('6x^2 - 5'), C: E('6x - 10x') })),
  'ex-4am-nashr-tabsit-l2-004:q2': R(E('2x(3x-5)').at(2)),
  'ex-4am-nashr-tabsit-l2-005:q1': C(only(E('(1/2)(4x - 6)'), { A: E('2x - 6'), B: E('2x - 3'), C: E('8x - 12') })),
  'ex-4am-nashr-tabsit-l2-005:q2': C(only(E('(2/3)(9 + 6x)'), { A: E('6 + 6x'), B: E('6 + 4x'), C: E('(2/3) * 15x') })),
  'ex-4am-nashr-tabsit-l2-006:q1': C(only(E('(x + 3)(x + 4)'), { A: E('x^2 + 12'), B: E('x^2 + 7x + 7'), C: E('x^2 + 7x + 12') })),
  'ex-4am-nashr-tabsit-l2-006:q2': R(E('(x+3)(x+4)').coef(1)),
  'ex-4am-nashr-tabsit-l2-007:q1': C(only(E('(x + 5)(x - 2)'), { A: E('x^2 + 3x - 10'), B: E('x^2 - 10'), C: E('x^2 + 3x + 10') })),
  'ex-4am-nashr-tabsit-l2-007:q2': R(E('(x+5)(x-2)').at(1)),
  'ex-4am-nashr-tabsit-l2-008:q1': C(only(E('3x + 5 - x + 2'), { A: E('9x'), B: E('4x + 7'), C: E('2x + 7') })),
  'ex-4am-nashr-tabsit-l2-008:q2': R(E('2x^2+3x-x^2+x').coef(2)),
  'ex-4am-nashr-tabsit-l2-009:q1': C('A'), // 4(x − 3) = 4x − 12 ; 2(2x − 6) est égal mais reste un PRODUIT ; 4x − 3 ≠ A
  'ex-4am-nashr-tabsit-l2-009:q2': R(E('4(x-3)').coef(0)),
  'ex-4am-nashr-tabsit-l2-010:q1': C('B'), // 6(x + 8) = 6x + 48 ; 6(x + 8) reste un produit ; 6x + 8 ≠
  'ex-4am-nashr-tabsit-l2-010:q2': R(E('6(x+8)').at(12)),
  'ex-4am-nashr-tabsit-l3-001:q1': C(only(E('(3x - 2)(7x - 4)'), { A: E('21x^2 + 8'), B: E('21x^2 - 26x + 8'), C: E('21x^2 - 26x - 8') })),
  'ex-4am-nashr-tabsit-l3-001:q2': C('B'), // (8 − 3x)(x + √7) = 8x + 8√7 − 3x² − 3√7x ; (8 + 3x)(x − √7) = 8x − 8√7 + 3x² − 3√7x ; somme 16x − 6√7x (B) ; A oublie −6√7x, C oublie que −3x² + 3x² = 0
  'ex-4am-nashr-tabsit-l3-002:q1': R(E('(x+2)(3x-1)').at(0)),
  'ex-4am-nashr-tabsit-l3-002:q2': C(only(E('(x + 2)(3x - 1)'), { A: E('3x^2 - 2'), B: E('3x^2 + 7x - 2'), C: E('3x^2 + 5x - 2') })),
  'ex-4am-nashr-tabsit-l3-003:q1': C(only(E('(2x + 1)(x + 2)'), { A: E('2x^2 + 5x + 2'), B: E('2x^2 + 2'), C: E('2x^2 + 4x + 2') })),
  'ex-4am-nashr-tabsit-l3-003:q2': C(only(E('(3x + 2)(4x - 5)'), { A: E('12x^2 + 7x - 10'), B: E('12x^2 - 7x - 10'), C: E('12x^2 - 10') })),
  'ex-4am-nashr-tabsit-l3-003:q3': C(only(E('(x - 7)(1 - x)'), { A: E('-x^2 - 6x - 7'), B: E('x^2 + 8x - 7'), C: E('-x^2 + 8x - 7') })),
  'ex-4am-nashr-tabsit-l3-003:q4': C(only(E('(-x - 2)(5 - x)'), { A: E('x^2 - 3x - 10'), B: E('-x^2 - 3x - 10'), C: E('x^2 - 7x - 10') })),
  'ex-4am-nashr-tabsit-l3-004:q1': C(only(E('(2x + 3)(x - 4)'), { A: E('2x^2 - 5x - 12'), B: E('2x^2 - 12'), C: E('2x^2 + 11x - 12') })),
  'ex-4am-nashr-tabsit-l3-004:q2': R(E('(2x+3)(x-4)').coef(1)),
  'ex-4am-nashr-tabsit-l3-005:q1': C(only(E('(3 - x)(2x + 1)'), { A: E('-2x^2 + 7x + 3'), B: E('-2x^2 + 5x + 3'), C: E('2x^2 + 5x + 3') })),
  'ex-4am-nashr-tabsit-l3-005:q2': R(E('(3-x)(2x+1)').at(3)),
  'ex-4am-nashr-tabsit-l3-006:q1': C(only(E('(x - 6)(x - 1)'), { A: E('x^2 - 7x - 6'), B: E('x^2 + 6'), C: E('x^2 - 7x + 6') })),
  'ex-4am-nashr-tabsit-l3-006:q2': R(E('(x-6)(x-1)').at(2)),
  'ex-4am-nashr-tabsit-l3-007:q1': C(only(E('3(x + 2) + 4(x - 1)'), { A: E('7x + 2'), B: E('7x + 10'), C: E('7x + 1') })),
  'ex-4am-nashr-tabsit-l3-007:q2': C(only(E('x(x + 1) + 2(x - 3)'), { A: E('x^2 + 3x - 3'), B: E('x^2 + 3x - 6'), C: E('4x^2 - 6') })),
  'ex-4am-nashr-tabsit-l3-008:q1': C('C'), // (x + 3)(2x + 1) = 2x² + 7x + 3 ; la forme produit n'est pas une somme ; 2x² + 3 oublie deux zones
  'ex-4am-nashr-tabsit-l3-008:q2': R(E('(x+3)(2x+1)').at(10)),
  'ex-4am-nashr-tabsit-l3-009:q1': C(only(E('(4x - 1)(x + 5)'), { A: E('4x^2 + 20x - x - 5'), B: E('4x^2 - 5'), C: E('4x^2 + 20x - 5') })),
  'ex-4am-nashr-tabsit-l3-009:q2': R(E('(4x-1)(x+5)').coef(0)),
  'ex-4am-nashr-tabsit-l3-010:q1': R(E('(x+1)(x+2)-x(x+3)').coef(0)),
  'ex-4am-nashr-tabsit-l3-010:q2': R(E('(x+1)(x+2)-x(x+3)').at(10)),
  'ex-4am-nashr-tabsit-l4-001:q1': R(E('((2/3)x+5)(4-(1/3)x)').at(3)),
  'ex-4am-nashr-tabsit-l4-001:q2': C(only(E('((2/3)x + 5)(4 - (1/3)x)'), { A: E('-(2/3)x^2 + x + 20'), B: E('-(2/9)x^2 + x + 20'), C: E('-(2/9)x^2 + 20') })),
  'ex-4am-nashr-tabsit-l4-002:q1': C(only(E('(2x + (1/5))(x + (2/5))'), { A: E('2x^2 + x + (3/5)'), B: E('2x^2 + x + (2/25)'), C: E('2x^2 + (2/25)') })),
  'ex-4am-nashr-tabsit-l4-002:q2': C(only(E('((4/3)x - 2)((3/2)x - (1/4))'), { A: E('2x^2 - (10/3)x + (1/2)'), B: E('2x^2 - (8/3)x + (1/2)'), C: E('2x^2 + (1/2)') })),
  'ex-4am-nashr-tabsit-l4-003:q1': C('B'), // seul le second change les signes : −(4x² − 3x + 4x − 3) = −4x² + 3x − 4x + 3
  'ex-4am-nashr-tabsit-l4-003:q2': C(only(E('3(x - 1) - (x + 1)(4x - 3)'), { A: E('-4x^2 + 4x - 6'), B: E('-4x^2 + 4x + 6'), C: E('-4x^2 + 2x') })),
  'ex-4am-nashr-tabsit-l4-004:q1': C(only(E('5x - (2x - 7)'), { A: E('3x - 7'), B: E('3x + 7'), C: E('7x - 7') })),
  'ex-4am-nashr-tabsit-l4-004:q2': C(only(E('2(x - 3) - 3(x - 2)'), { A: E('-x'), B: E('-x - 12'), C: E('5x - 12') })),
  'ex-4am-nashr-tabsit-l4-005:q1': C(only(E('4 - (x - 3)(x + 2)'), { A: E('-x^2 - x - 2'), B: E('-x^2 + x + 10'), C: E('-x^2 + x - 2') })),
  'ex-4am-nashr-tabsit-l4-005:q2': R(E('4-(x-3)(x+2)').at(3)),
  'ex-4am-nashr-tabsit-l4-006:q1': C(only(E('((1/2)x + 1)(4x - 2)'), { A: E('2x^2 - 2'), B: E('2x^2 + 3x - 2'), C: E('2x^2 + 5x - 2') })),
  'ex-4am-nashr-tabsit-l4-006:q2': R(E('((1/2)x+1)(4x-2)').coef(1)),
  'ex-4am-nashr-tabsit-l4-007:q1': C(only(E('-(3/4)(8x - 12)'), { A: E('-6x - 9'), B: E('-6x - 12'), C: E('-6x + 9') })),
  'ex-4am-nashr-tabsit-l4-007:q2': R(E('-(3/4)(8x-12)').at(2)),
  'ex-4am-nashr-tabsit-l4-008:q1': C(only(E('(2x - 1)(x + 3) - 2x^2'), { A: E('5x - 3'), B: E('4x^2 + 5x - 3'), C: E('5x + 3') })),
  'ex-4am-nashr-tabsit-l4-008:q2': R(E('(2x-1)(x+3)-2x^2').at(4)),
  'ex-4am-nashr-tabsit-l4-009:q1': C(only(E('x(x - 4) - (x - 2)(x + 2)'), { A: E('-4x - 4'), B: E('-4x + 4'), C: E('2x^2 - 4x - 4') })),
  'ex-4am-nashr-tabsit-l4-010:q1': C('A'), // 2 − 1 + 3 + 5 = 9 : il a additionné des termes de puissances 2, 1 et 0
  'ex-4am-nashr-tabsit-l4-010:q2': C(only(E('2x^2 + 3x - x^2 + 5'), { A: E('x^2 + 3x + 5'), B: E('3x^2 + 3x + 5'), C: E('x^2 + 8x') })),
  'ex-4am-nashr-tabsit-l5-001:q1': C(only(E('a - 3 - 2(a + 3)'), { A: E('-a'), B: E('-a - 9'), C: E('-a + 3') })),
  'ex-4am-nashr-tabsit-l5-001:q2': C(only(E('-(a + 2) - (3a - 5)(2a - 4)'), { A: E('-6a^2 - 23a + 18'), B: E('6a^2 - 23a + 18'), C: E('-6a^2 + 21a - 22') })),
  'ex-4am-nashr-tabsit-l5-001:q3': C(only(E('(a + 3)(a + (1/3)) - (a + 2)(a - (1/2))'), { A: E('(29/6)a'), B: E('(11/6)a + 2'), C: E('2a^2 + (11/6)a + 2') })),
  'ex-4am-nashr-tabsit-l5-002:q1': C(only(E('(-5x - 10)(3x - 1)'), { A: E('-15x^2 - 25x + 10'), B: E('-15x^2 - 35x + 10'), C: E('-15x^2 + 10') })),
  'ex-4am-nashr-tabsit-l5-002:q2': C(only(E('-5(3x^2 + 5x - 2)'), { A: E('-15x^2 + 5x - 2'), B: E('-15x^2 - 25x - 10'), C: E('-15x^2 - 25x + 10') })),
  'ex-4am-nashr-tabsit-l5-002:q3': R(E('-5(x+2)(3x-1)').at(1)),
  'ex-4am-nashr-tabsit-l5-003:q1': C(only(E('(2x + 5)(x + 3)'), { A: E('2x^2 + 15'), B: E('2x^2 + 11x + 15'), C: E('2x^2 + 11x + 8') })),
  'ex-4am-nashr-tabsit-l5-003:q2': R(E('(2x+5)(x+3)').at(10)),
  'ex-4am-nashr-tabsit-l5-004:q1': C(only(E('(x + 4)(x + 2) - x^2'), { A: E('6x + 8'), B: E('x^2 + 6x + 8'), C: E('6') })),
  'ex-4am-nashr-tabsit-l5-004:q2': R(E('(x+4)(x+2)-x^2').at(20)),
  'ex-4am-nashr-tabsit-l5-005:q1': R(E('(x+6)(x+1)-(x+2)(x+5)').coef(0)),
  'ex-4am-nashr-tabsit-l5-005:q2': C('A'), // U se réduit à −4 (q1) : constante pour tout x ; « x = 0 فقط » et « تتغيّر » sont faux
  'ex-4am-nashr-tabsit-l5-006:q1': R(E('(100+3)(10+2)').at(0)),
  'ex-4am-nashr-tabsit-l5-006:q2': R(q(100).mul(10).add(q(3).mul(2))),
  'ex-4am-nashr-tabsit-l5-007:q1': C('B'), // 2x − (x − 4) = x + 4 ≠ x − 4 ; 2x − x = x est juste
  'ex-4am-nashr-tabsit-l5-007:q2': C(only(E('2x - (x - 4)'), { A: E('x + 4'), B: E('x - 4'), C: E('3x - 4') })),
  'ex-4am-nashr-tabsit-l5-008:q1': C(only(E('11(x + 150)'), { A: E('11x + 150'), B: E('11x + 1650'), C: E('1661x') })),
  'ex-4am-nashr-tabsit-l5-008:q2': R(E('11(x+150)').at(1200)),
  'ex-4am-nashr-tabsit-l5-009:q1': C(only(E('x(x + 10) - 2x'), { A: E('x^2 + 10x - 2'), B: E('x^2 + 8x'), C: E('x^2 + 12x') })),
  'ex-4am-nashr-tabsit-l5-009:q2': R(E('x(x+10)-2x').at(5)),
  'ex-4am-nashr-tabsit-l5-010:q1': C(only(E('2(x + 1)(x - 3)'), { A: E('2x^2 - 4x - 6'), B: E('2x^2 - 2x - 3'), C: E('2x^2 - 6') })),
  'ex-4am-nashr-tabsit-l5-010:q2': R(E('2(x+1)(x-3)').coef(1)),
  'ex-4am-nashr-tabsit-l5-010:q3': R(E('2(x+1)(x-3)').at(3)),
};
