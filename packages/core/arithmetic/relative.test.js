import { describe, it, expect } from 'vitest';
import * as R from './relative.js';

describe('relative — écriture et lecture exactes', () => {
  it('parse accepte le moins ASCII ou typographique, la virgule ou le point, les chiffres arabes-indiens', () => {
    expect(R.parse('-4,5')).toBe(-450n);
    expect(R.parse('−4.5')).toBe(-450n);
    expect(R.parse('٣,٥')).toBe(350n);
    expect(R.parse('-0,05')).toBe(-5n);
    expect(R.parse('10')).toBe(1000n);
    expect(R.parse(2.3)).toBe(230n);
    expect(R.parse(450n)).toBe(450n);
    for (const bad of ['', 'a', '1,234', '--1', '1,', ',5']) expect(() => R.parse(bad), bad).toThrow();
  });
  it('text / tex : virgule, zéros inutiles retirés, moins ASCII ; aller-retour', () => {
    expect(R.text(-450n)).toBe('-4,5');
    expect(R.text(R.parse('2,50'))).toBe('2,5');
    expect(R.text(0n)).toBe('0');
    expect(R.text(-5n)).toBe('-0,05');
    expect(R.tex(-450n)).toBe('-4{,}5');
    for (let h = -1000n; h <= 1000n; h += 1n) expect(R.parse(R.text(h))).toBe(h);
  });
  it('fromSideDistance : le côté est une conséquence ; 0 est le même point des deux côtés', () => {
    expect(R.fromSideDistance('below', '5')).toBe(-500n);
    expect(R.fromSideDistance('above', '0,3')).toBe(30n);
    expect(R.fromSideDistance('below', 0)).toBe(0n);
    expect(() => R.fromSideDistance('left', 1)).toThrow();
    expect(() => R.fromSideDistance('above', '-1')).toThrow();
  });
  it('parseFree : |A| ≤ 9,9, tout format de moins', () => {
    expect(R.parseFree('−2,5')).toBe('-2,5');
    expect(R.parseFree('٩,٩')).toBe('9,9');
    expect(R.parseFree('-9,9')).toBe('-9,9');
    expect(R.parseFree('10')).toBeNull();
    expect(R.parseFree('abc')).toBeNull();
  });
});

describe('relative — comparer', () => {
  it('cmp : négatifs (le plus éloigné est le plus petit), le zéro, les positifs', () => {
    expect(R.cmp('-5', '-3')).toBe(-1);
    expect(R.cmp('-1,9', '-1,91')).toBe(1);
    expect(R.cmp('-0,4', '-0,2')).toBe(-1);
    expect(R.cmp('-3', '0')).toBe(-1);
    expect(R.cmp('0', '0,01')).toBe(-1);
    expect(R.cmp('-9', '1')).toBe(-1);
    expect(R.cmp('2,50', '2,5')).toBe(0);
    expect(R.distance('-5')).toBe(500n);
    expect(R.sideOf('-0,01')).toBe('below');
    expect(R.sideOf(0)).toBe('zero');
  });
  it('balayage exhaustif : pour tout d, côté, la comparaison de deux capteurs suit celle des entiers relatifs', () => {
    for (let a = -1000; a <= 1000; a += 10) {
      for (let d = 0; d <= 1000; d += 10) {
        for (const side of R.SIDES) {
          const B = R.fromSideDistance(side, BigInt(d));
          const expected = (side === 'below' ? -d : d) < a ? -1 : (side === 'below' ? -d : d) > a ? 1 : 0;
          expect(R.cmp(B, BigInt(a))).toBe(expected);
          // la règle vue : deux négatifs → le plus éloigné du zéro est le plus petit
          if (a < 0 && side === 'below' && d !== -a) expect(R.cmp(B, BigInt(a)) === -1).toBe(d > -a);
        }
      }
    }
  });
});

describe('relative — juger les tâches du labo', () => {
  const beat = (a, want, side = null, extra = {}) => ({ kind: 'beat', a, want, side, ...extra });
  it('beat A=-3 below lower : il faut PLUS de câble (d > 3)', () => {
    const t = beat('-3', 'lower', 'below');
    expect(R.judge(t, 'below', '5')).toMatchObject({ ok: true, value: -500n, order: -1 });
    expect(R.judge(t, 'below', '3').ok).toBe(false);
    expect(R.judge(t, 'below', '1').ok).toBe(false);
    expect(R.judge(t, 'above', '5').ok).toBe(false);
    expect(R.solutions(t, R.STEP_UNIT).map((s) => R.text(s.d))).toEqual(['4', '5', '6', '7', '8', '9', '10']);
  });
  it('beat A=-3 below higher : MOINS de câble, mais pas zéro (d ∈ ]0 ; 3[)', () => {
    const t = beat('-3', 'higher', 'below');
    expect(R.solutions(t, R.STEP_UNIT).map((s) => R.text(s.d))).toEqual(['1', '2']);
    expect(R.judge(t, 'below', '0').ok).toBe(false);
  });
  it('beat A=4 above lower : d ∈ ]0 ; 4[ — plus de câble rend plus HAUT', () => {
    const t = beat('4', 'lower', 'above');
    expect(R.solutions(t, R.STEP_UNIT).map((s) => R.text(s.d))).toEqual(['1', '2', '3']);
  });
  it('beat A=2 below higher : aucune longueur ne convient (impossible)', () => {
    const t = beat('2', 'higher', 'below');
    expect(R.isImpossible(t, R.STEP_UNIT)).toBe(true);
    expect(R.isImpossible(t)).toBe(true);
    expect(R.sample(t)).toBeNull();
    for (let d = 0; d <= 100; d += 1) expect(R.judge(t, 'below', BigInt(d * 10)).ok).toBe(false);
  });
  it('between : strict, une seule dixième atteint la zone étroite', () => {
    const t = { kind: 'between', lo: '-4,5', hi: '-4,3', side: null };
    const s = R.solutions(t, R.STEP_TENTH);
    expect(s.map((x) => [x.side, R.text(x.d)])).toEqual([['below', '4,4']]);
    expect(R.judge(t, 'below', '4,5').ok).toBe(false);
    expect(R.judge(t, 'below', '4,3').ok).toBe(false);
    expect(R.judge(t, 'below', '4,4')).toMatchObject({ ok: true, order: 0 });
    expect(R.judge(t, 'below', '4,6').order).toBe(-1);
    expect(R.judge(t, 'below', '4,2').order).toBe(1);
    expect(R.solutions(t, R.STEP_UNIT)).toEqual([]);
    const u = { kind: 'between', lo: '-0,4', hi: '-0,2', side: null };
    expect(R.solutions(u).map((x) => R.text(x.d))).toEqual(['0,3']);
    expect(R.solutionsBetween(u).length).toBe(1);
  });
  it('beat both : A=1,2 lower — des deux côtés, le zéro ne crédite aucun côté', () => {
    const t = beat('1,2', 'lower', null, { both: true });
    expect(R.judge(t, 'above', '0,9')).toMatchObject({ ok: true, credit: 'above' });
    expect(R.judge(t, 'below', '7')).toMatchObject({ ok: true, credit: 'below' });
    expect(R.judge(t, 'above', '1,2').ok).toBe(false);
    expect(R.judge(t, 'above', '0').ok).toBe(false);
    expect(R.judge(t, 'above', '0').credit).toBeNull();
    expect(R.sample(t)).toMatchObject({ side: 'above', d: 10n });
  });
  it('balayage : tous les d de 0 à 10 par 0,1 des deux côtés pour chaque tâche des presets — solutions = jugement', () => {
    const tasks = [
      beat('-3', 'lower', 'below'), beat('-3', 'higher', 'below'), beat('4', 'lower', 'above'), beat('2', 'higher', 'below'),
      { kind: 'between', lo: '-4,5', hi: '-4,3', side: null }, beat('1,2', 'lower', null, { both: true }), { kind: 'between', lo: '-0,4', hi: '-0,2', side: null },
    ];
    for (const t of tasks) {
      let n = 0;
      for (let d = 0n; d <= 1000n; d += 10n) {
        for (const side of R.SIDES) {
          const j = R.judge(t, side, d);
          const listed = R.solutions(t).some((s) => s.d === d && (s.side === side || (d === 0n)));
          if (d === 0n && side === 'below') continue;
          expect(j.ok, `${JSON.stringify(t)} ${side} ${d}`).toBe(listed);
          if (j.ok) n += 1;
        }
      }
      expect(n).toBe(R.solutions(t).length);
    }
  });
  it('tâches mal formées refusées', () => {
    expect(() => R.judge({ kind: 'x' }, 'below', 1)).toThrow();
    expect(() => R.judge({ kind: 'between', lo: '1', hi: '0' }, 'below', 1)).toThrow();
    expect(() => R.judge({ kind: 'beat', a: '1', want: 'equal' }, 'below', 1)).toThrow();
  });
});

describe('corniche-ruler : opposé, abscisse, planche', () => {
  it('opposite / abscissaOf / positionOf', () => {
    expect(R.opposite('-2,5')).toBe(250n);
    expect(R.opposite(0)).toBe(0n);
    expect(R.abscissaOf('30', '0')).toBe(3000n);
    expect(R.abscissaOf('30', '-20')).toBe(5000n);
    expect(R.positionOf('-30', '-10')).toBe(-4000n);
  });
  it('boardFit / smallestStep : les trois tâches متقدم', () => {
    const S = ['0,1', '0,5', '1', '2', '5', '10', '20', '25', '50', '100'];
    expect(R.smallestStep(['-50', '75', '150'], S)).toBe(2500n);
    expect(R.smallestStep(['0,3', '-0,5', '-0,1', '0,6'], S)).toBe(10n);
    expect(R.smallestStep(['-300', '400', '600'], S)).toBe(10000n);
    expect(R.boardFit(['-50', '75', '150'], '20').off).toEqual([15000n]);
    expect(R.boardFit(['0,5'], '0,3').between).toEqual([50n]);
    expect(R.smallestStep(['1000'], ['1'])).toBeNull();
  });
  it('balayage : le plus petit pas convient et le précédent ne convient pas', () => {
    const S = ['1', '2', '5', '10', '25', '100'];
    for (let a = -600; a <= 600; a += 5) {
      const vs = [String(a), '35'];
      const got = R.smallestStep(vs, S);
      if (got === null) continue;
      const ok = (s) => { const r = R.boardFit(vs, s); return r.fits && r.between.length === 0; };
      expect(ok(got)).toBe(true);
      for (const s of S.map(R.parse)) if (s < got) expect(ok(s)).toBe(false);
    }
  });
});

describe('balloon-ballast : somme, différence, charge', () => {
  it('add / sub / ruleCase / ballastOf', () => {
    expect(R.add('-3,2', '-5')).toBe(-820n);
    expect(R.sub('5', '-7')).toBe(1200n);
    expect(R.sub('-2', '5')).toBe(-700n);
    expect(R.ruleCase('-3', '-5')).toBe('same');
    expect(R.ruleCase('-9', '5')).toBe('different');
    expect(R.ruleCase('-6', '6')).toBe('opposites');
    expect(R.ruleCase('0', '6')).toBe('zero');
    expect(R.ballastOf('-4')).toEqual({ tokens: 0, bags: 4 });
    expect(R.ballastOf(6)).toEqual({ tokens: 6, bags: 0 });
    expect(() => R.ballastOf('1,5')).toThrow();
  });
  it('balayage : |a|,|b| ≤ 12 par 0,25 contre un calcul en entiers', () => {
    for (let a = -1200; a <= 1200; a += 25) for (let b = -1200; b <= 1200; b += 25) {
      const A = String(a / 100); const B = String(b / 100);
      expect(R.add(A, B)).toBe(BigInt(a + b));
      expect(R.sub(A, B)).toBe(BigInt(a - b));
      expect(R.sub(A, B)).toBe(R.add(A, R.opposite(B)));
    }
  });
});
