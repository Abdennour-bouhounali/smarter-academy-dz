import { describe, expect, it } from 'vitest';
import {
  FIELD,
  FACE,
  RIVER,
  PLATEAU,
  canalReading,
  canalPieces,
  fieldPoints,
  courseAt,
  markOfRow,
  pyramidHeight,
  riverWidth,
  shadowLength,
  shadowTip,
  sunVector,
  typedLength,
  exactRoot,
  thirdSideSquared,
  knotsAfter,
  topRate,
  frameDistance,
  labelScale,
  labelPx,
  ROPE,
  write,
} from './logic';
import { fourth, over, times, chainHolds } from '../kit/exact';

describe('stage 1 « حقل النيل » — the field and its two canals (plan §3.3)', () => {
  const [fresh, old] = FIELD.canals;

  it('every rope reads a whole knot: MN² = 324, PQ² = 1681 (cos A = 2/7)', () => {
    expect(write(thirdSideSquared(fresh.AM, fresh.AN, FIELD.cosA))).toBe('324');
    expect(write(thirdSideSquared(old.AM, old.AN, FIELD.cosA))).toBe('1681');
    expect(canalReading(FIELD, fresh)).toBe('18');
    expect(canalReading(FIELD, old)).toBe('41');
    // the field itself is consistent with cos A = 2/7: BC² = 63² + 72² − 2·63·72·2/7
    expect(write(thirdSideSquared(FIELD.AB, FIELD.AC, FIELD.cosA))).toBe('6561');
  });

  it('the 3AM tool holds on the new canal and fails on the old one (18 against 50,1… or 31,5; the rope reads 41)', () => {
    expect(write(fourth(FIELD.AB, FIELD.BC, fresh.AM))).toBe('18');
    expect(write(fourth(FIELD.AB, FIELD.BC, old.AM))).toBe('351/7');
    expect(write(fourth(FIELD.AC, FIELD.BC, old.AN))).toBe('31,5');
    expect(chainHolds([fresh.AM, FIELD.AB], [fresh.AN, FIELD.AC], [canalReading(FIELD, fresh), FIELD.BC])).toBe(true);
    expect(chainHolds([old.AM, FIELD.AB], [old.AN, FIELD.AC], [canalReading(FIELD, old), FIELD.BC])).toBe(false);
  });

  it('the pieces: MB = 49, NC = 56; PB = 24, QC = 44', () => {
    expect(canalPieces(FIELD, fresh)).toEqual({ MB: '49', NC: '56' });
    expect(canalPieces(FIELD, old)).toEqual({ MB: '24', NC: '44' });
  });

  it('the drawing puts every point where its lengths say', () => {
    const p = fieldPoints(FIELD);
    const d = (a, b) => Math.hypot(p[a].u - p[b].u, p[a].v - p[b].v);
    expect(d('A', 'B')).toBeCloseTo(63, 9);
    expect(d('A', 'C')).toBeCloseTo(72, 9);
    expect(d('B', 'C')).toBeCloseTo(81, 9);
    expect(d('M', 'N')).toBeCloseTo(18, 9);
    expect(d('P', 'Q')).toBeCloseTo(41, 9);
  });
});

describe('stage 2 « ورشة البنّائين » — the courses of the face SBC (plan §3.4)', () => {
  it('course 1 at BM = 10 is 88; course 2 at BM = 20 is 77', () => {
    expect(courseAt(FACE, '10')).toEqual({ SM: '80', MN: '88' });
    expect(courseAt(FACE, '20')).toEqual({ SM: '70', MN: '77' });
  });
  it('the row of 55 already cut belongs at BM = 40', () => {
    expect(markOfRow(FACE, FACE.row)).toBe('40');
    expect(courseAt(FACE, '40').MN).toBe('55');
  });
  it('the errors give other numbers: the piece 11, the difference 89, the inverted ratio 111,375', () => {
    expect(write(over(times(FACE.base, '10'), FACE.edge))).toBe('11');
    expect(write(over(times(FACE.base, FACE.edge), '80'))).toBe('111,375');
  });
  it('the courses’ k are 8/9, 7/9, 5/9', () => {
    expect(write(over('80', FACE.edge))).toBe('8/9');
    expect(write(over('70', FACE.edge))).toBe('7/9');
    expect(write(over('50', FACE.edge))).toBe('5/9');
  });
  it('the height is about 56,6 m (for drawing)', () => {
    expect(pyramidHeight(FACE.base, FACE.edge)).toBeCloseTo(56.56, 2);
  });
});

describe('stage 3 « عرض النيل » — the river’s width without crossing it (plan §3.5)', () => {
  it('AF = 72 × 52 / 9 = 416; the inverted ratio gives 6,5 and the sum 133 (gate B4)', () => {
    expect(riverWidth(RIVER)).toBe('416');
    expect(write(fourth(RIVER.AS, RIVER.SE, RIVER.ER))).toBe('6,5');
  });
});

describe('stage 5 « ظلّ الهرم الأكبر » — shadows computed, drawn as meshes (B2, B5)', () => {
  it('tan = 2/3: the stick’s shadow is 3, the pyramid’s 219 from its centre (104 beyond the base edge)', () => {
    expect(shadowLength(PLATEAU.stick, PLATEAU.tan)).toBe('3');
    expect(shadowLength(PLATEAU.h, PLATEAU.tan)).toBe('219');
    expect(write(fourth('3', '219', '2'))).toBe('146');
  });
  it('the tip lies away from the sun, at the exact length', () => {
    const tip = shadowTip({ tan: PLATEAU.tan, azimuth: Math.PI / 2, height: PLATEAU.h, foot: { x: 300, z: -800 } });
    expect(tip.length).toBe('219');
    expect(tip.x).toBeCloseTo(81, 9);
    expect(tip.z).toBeCloseTo(-800, 9);
  });
  it('the sun’s vector has the elevation of its tangent', () => {
    const v = sunVector(PLATEAU.tan, Math.PI / 2);
    expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1, 12);
    expect(v.y / Math.hypot(v.x, v.z)).toBeCloseTo(2 / 3, 12);
    expect(v.x).toBeGreaterThan(0);
  });
});

describe('what he types', () => {
  it('digits and one comma, a positive length', () => {
    expect(typedLength('51')).toBe('51');
    expect(typedLength('77,5')).toBe('77,5');
    expect(typedLength(' 33,60 ')).toBe('33,6');
    for (const bad of ['', '0', '7.5', '-3', '1,2,3', 'abc', ',5', '5,']) expect(typedLength(bad), bad).toBe(null);
  });
  it('an exact root, or none', () => {
    expect(exactRoot('441')).toBe('21');
    expect(exactRoot('49/64')).toBe('0,875');
    expect(exactRoot('1/9')).toBe('1/3');
    expect(exactRoot('2')).toBe(null);
  });
});

describe('the scale rule (§1.5, gate B6)', () => {
  const timeFor = (L, top) => {
    let t = 0;
    while (knotsAfter(t, top) < L) t += 0.01;
    return t;
  };
  it('the longest rope of each stage goes by in 8 s at most, from 3 to 30 knots a second', () => {
    for (const L of [72, 90, 230]) {
      const top = topRate(L);
      expect(top).toBeGreaterThanOrEqual(ROPE.MIN);
      expect(top).toBeLessThanOrEqual(ROPE.MAX);
      expect(timeFor(L, top), `rope of ${L}`).toBeLessThanOrEqual(ROPE.LIMIT + 0.01);
    }
  });
  it('a short rope keeps a slow, readable speed', () => {
    expect(topRate(8)).toBe(ROPE.MIN);
  });
  it('the camera fits a box: the 416 m river is seen whole; a 50 m field from 30 to 75 m', () => {
    expect(frameDistance(50, 25)).toBeGreaterThan(30);
    expect(frameDistance(50, 25)).toBeLessThan(75);
    expect(frameDistance(416, 120)).toBeGreaterThan(416 / 2 / Math.tan((25 * Math.PI) / 180) / (1366 / 768));
  });
  it('a label of 20 px at the widest view (60°) is at least 18 px at every narrower view of the world', () => {
    const s = labelScale(20, 60);
    expect(labelPx(s, 60)).toBeCloseTo(20, 9);
    for (const fov of [50, 55, 60]) expect(labelPx(s, fov)).toBeGreaterThanOrEqual(18);
  });
});
