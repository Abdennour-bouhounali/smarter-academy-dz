import { describe, it, expect } from 'vitest';
import * as C from './chainOps.js';
import * as P from './powers.js';
import { evaluate as relEvaluate, relText } from './relativeOps.js';

const txt = (t) => relText(C.evaluateChain(t));

describe('chainOps — lecture', () => {
  it('tokenize : chiffres arabes, virgule, alias ASCII ; refuse parenthèses, négatif, trou', () => {
    expect(C.tokenize('٢٦ - 9 + 4').map((t) => t.t === 'op' ? t.o : relText(t.v))).toEqual(['26', '−', '9', '+', '4']);
    expect(C.tokenize('1,5 + 4 x 0,8').map((t) => t.t === 'op' ? t.o : relText(t.v))).toEqual(['1,5', '+', '4', '×', '0,8']);
    expect(() => C.tokenize('(2 + 3) × 4')).toThrow();
    expect(() => C.tokenize('[2 + 3] × 4')).toThrow();
    expect(() => C.tokenize('−3 + 4')).toThrow();
    expect(() => C.tokenize('3 +')).toThrow();
    expect(() => C.tokenize('3 + + 4')).toThrow();
    expect(() => C.tokenize('')).toThrow();
  });
});

describe('chainOps — valeur et priorités', () => {
  it('+ − de gauche à droite ; × ÷ de gauche à droite ; × ÷ avant + −', () => {
    expect(txt('26 − 9 + 4')).toBe('21');
    expect(txt('40 − 12 − 6 + 9')).toBe('31');
    expect(txt('150 ÷ 6 × 4')).toBe('100');
    expect(txt('15 + 3 × 4')).toBe('27');
    expect(txt('32 − 4 × 5 + 6')).toBe('18');
    expect(txt('1,5 + 4 × 0,8')).toBe('4,7');
    expect(txt('60 ÷ 4 + 3 × 6')).toBe('33');
    expect(txt('3,5 + 2 × 1,5 − 6 ÷ 3')).toBe('4,5');
    expect(txt('50 − 4 × 6 + 30 ÷ 5')).toBe('32');
    expect(txt('18 + 6 × 5 − 40 ÷ 8')).toBe('43');
  });
  it('contre-épreuve : relativeOps.evaluate (3AM) donne la même valeur', () => {
    for (const c of ['26 − 9 + 4', '150 ÷ 6 × 4', '15 + 3 × 4', '2,5 + 3 × 7 − 35 ÷ 5', '12 × 5 ÷ 6 ÷ 2', '100 − 36 ÷ 4 × 3']) {
      expect(C.evaluateChain(c)).toEqual(relEvaluate(c).value);
    }
  });
  it('division par 0 : exception', () => { expect(() => C.evaluateChain('5 ÷ 0')).toThrow(); });
  it('un quotient non décimal reste exact', () => { expect(P.eq(C.evaluateChain('1 ÷ 3 × 3'), 1)).toBe(true); });
});

describe('chainOps — opérateurs et ordre', () => {
  it('operatorsOf et conventionalOrder', () => {
    expect(C.operatorsOf('15 + 3 × 4').map((o) => o.o)).toEqual(['+', '×']);
    expect(C.conventionalOrder('15 + 3 × 4')).toEqual([1, 0]);
    expect(C.conventionalOrder('26 − 9 + 4')).toEqual([0, 1]);
    expect(C.conventionalOrder('18 + 6 × 5 − 40 ÷ 8')).toEqual([1, 3, 0, 2]);
  });
  it('valueInOrder : le plan de l\'élève', () => {
    const wrong = C.valueInOrder('26 − 9 + 4', [1, 0]);   // 9 + 4 d'abord
    expect(relText(wrong.value)).toBe('13');
    expect(wrong.lines).toEqual(['26 − 9 + 4', '26 − 13', '13']);
    expect(wrong.conventional).toBe(false);
    expect(wrong.matches).toBe(false);
    const ok = C.valueInOrder('26 − 9 + 4', [0, 1]);
    expect(relText(ok.value)).toBe('21'); expect(ok.conventional).toBe(true); expect(ok.matches).toBe(true);
    const price = C.valueInOrder('150 ÷ 6 × 4', [1, 0]);
    expect(relText(price.value)).toBe('6,25'); expect(price.matches).toBe(false);
    const groups = C.valueInOrder('15 + 3 × 4', [0, 1]);
    expect(relText(groups.value)).toBe('72'); expect(groups.lines).toEqual(['15 + 3 × 4', '18 × 4', '72']);
  });
  it('un plan différent peut donner la même valeur (+ seulement) : accepté, non conventionnel', () => {
    const r = C.valueInOrder('26 + 4 + 9', [1, 0]);
    expect(r.matches).toBe(true); expect(r.conventional).toBe(false);
  });
  it('balayage : toute permutation est calculable, et seul l\'ordre conventionnel (ou un équivalent) coïncide avec la valeur', () => {
    const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
    const chain = '40 − 12 − 6 + 9';
    const good = perms([0, 1, 2]).filter((o) => C.valueInOrder(chain, o).matches);
    expect(good.length).toBeGreaterThan(0);
    expect(good.some((o) => o.join() === C.conventionalOrder(chain).join())).toBe(true);
    expect(C.valueInOrder(chain, [0, 2, 1]).matches).toBe(false);   // 6 + 9 d'abord : 40 − 12 − 15 = 13
    expect(relText(C.valueInOrder(chain, [0, 2, 1]).value)).toBe('13');
    expect(relText(C.valueInOrder(chain, [1, 0, 2]).value)).toBe('43');   // 12 − 6 d'abord : 40 − 6 + 9 = 43
  });
  it('un ordre invalide est refusé', () => { expect(() => C.valueInOrder('1 + 2 + 3', [0, 0])).toThrow(); });
});

describe('chainOps — trace et garde', () => {
  it('traceChain : une opération par ligne, ou groupée', () => {
    expect(C.traceChain('15 + 3 × 4')).toEqual(['15 + 3 × 4', '15 + 12', '27']);
    expect(C.traceChain('4,5 + 2 × 8 − 27 ÷ 9')).toEqual(['4,5 + 2 × 8 − 27 ÷ 9', '4,5 + 16 − 27 ÷ 9', '4,5 + 16 − 3', '20,5 − 3', '17,5']);
    expect(C.traceChain('4,5 + 2 × 8 − 27 ÷ 9', { grouped: true })).toEqual(['4,5 + 2 × 8 − 27 ÷ 9', '4,5 + 16 − 3', '17,5']);
  });
  it('isNonNegativeChain : la garde de 2AM', () => {
    expect(C.isNonNegativeChain('26 − 9 + 4')).toBe(true);
    expect(C.isNonNegativeChain('4 − 9 + 20')).toBe(false);
  });
  it('chainText relit l\'arbre', () => { expect(C.chainText(C.parseChain('15 + 3 × 4'))).toBe('15 + 3 × 4'); });
});

describe('chainOps — offTreeStep', () => {
  it('9 + 4 avant de retrancher 9 quitte l\'arbre ; l\'ordre conventionnel jamais', () => {
    const step = C.offTreeStep('26 − 9 + 4', [1, 0]);
    expect(step).toMatchObject({ index: 1, o: '+', leftSpan: [1, 1], rightSpan: [2, 2] });
    expect(relText(step.value)).toBe('13');
    expect(C.offTreeStep('26 − 9 + 4', [0, 1])).toBeNull();
    expect(C.offTreeStep('15 + 3 × 4', [1, 0])).toBeNull();
    expect(C.offTreeStep('15 + 3 × 4', [0, 1])).toMatchObject({ index: 0, o: '+' });
    expect(C.offTreeStep('150 ÷ 6 × 4', [1, 0])).toMatchObject({ o: '×' });
  });
});

describe('chainOps L2 — parenthèses, barre de fraction, calculatrice (silsila-bi-aqwas)', () => {
  it('calculatorRead : priorités, parenthèses, Syntax ERROR, Math ERROR, négatif affiché', () => {
    expect(C.calculatorRead('45 + 15 ÷ 4')).toMatchObject({ status: 'ok', display: '48,75' });
    expect(C.calculatorRead('(45 + 15) ÷ 4')).toMatchObject({ status: 'ok', display: '15' });
    expect(C.calculatorRead('(45 + 15 ÷ 4').status).toBe('syntax');
    expect(C.calculatorRead('45 + ÷ 4').status).toBe('syntax');
    expect(C.calculatorRead('4 ÷ (3 − 3)').status).toBe('math');
    expect(C.calculatorRead('(40 + 8) ÷ 15 − 9').display).toBe('−5,8');
    expect(C.calculatorRead('40 + 8 ÷ 15 − 9').display).toBe('31,53333333');
    expect(C.calculatorRead('2 × [50 − (12 + 8)]').display).toBe('60');
  });
  it('evaluateB est d\'accord avec evaluateChain sans parenthèses et avec la valeur à la main avec', () => {
    for (const t of ['26 − 9 + 4', '15 + 3 × 4', '150 ÷ 6 × 4', '3,5 + 2 × 1,5 − 6 ÷ 3']) expect(C.numText(C.evaluateB(t)), t).toBe(C.numText(C.evaluateChain(t)));
    expect(C.numText(C.evaluateB('3 × [20 − (4 + 6)]'))).toBe('30');
    expect(C.numText(C.evaluateB('(7 + 5) × (20 − 4)'))).toBe('192');
  });
  it('uselessBrackets : 9 + (2 × 5) a une paire inutile, (9 + 2) × 5 aucune, ((3)) + 4 deux', () => {
    expect(C.uselessBrackets('9 + (2 × 5)')).toHaveLength(1);
    expect(C.uselessBrackets('(9 + 2) × 5')).toHaveLength(0);
    expect(C.uselessBrackets('((3)) + 4')).toHaveLength(2);
    expect(C.uselessBrackets('(8 × 12) − 7')).toHaveLength(1);
    expect(C.uselessBrackets('50 − (12 + 8)')).toHaveLength(0);
    expect(C.uselessBrackets('50 − (12 − 8)')).toHaveLength(0);
  });
  it('bracketForm : la paire extérieure s\'écrit [ ]', () => {
    expect(C.bracketForm('2 × (50 − (12 + 8))')).toBe('2 × [ 50 − ( 12 + 8 ) ]');
    expect(C.bracketForm('(1 + 2) × 3')).toBe('( 1 + 2 ) × 3');
  });
  it('barToLine / lineToBar : les deux sens', () => {
    expect(C.barToLine('36 + 12', '20 − 8')).toBe('(36 + 12) ÷ (20 − 8)');
    expect(C.barToLine('28', '11 − 4')).toBe('28 ÷ (11 − 4)');
    expect(C.lineToBar('(36 + 12) ÷ (20 − 8)')).toEqual({ num: '36 + 12', den: '20 − 8' });
    expect(C.lineToBar('8 ÷ (5 + 3)')).toEqual({ num: '8', den: '5 + 3' });
    expect(C.lineToBar('1 + 2')).toBeNull();
    expect(C.numText(C.evaluateB(C.barToLine('36 + 12', '20 − 8')))).toBe('4');
  });
  it('leftToRight et calculatorKeys', () => {
    expect(C.calcDisplay(C.leftToRight('45 + 15 ÷ 4'))).toBe('15');
    expect(C.calcDisplay(C.leftToRight('(1 + 2) × 3'))).toBe('9');
    expect(C.calculatorKeys('54 ÷ (4 × 3 − 3) + 2').join(' ')).toBe('5 4 ÷ ( 4 × 3 − 3 ) + 2 =');
  });
  it('L1 refuse toujours les parenthèses', () => {
    expect(() => C.tokenize('(1 + 2) × 3')).toThrow();
  });
});
