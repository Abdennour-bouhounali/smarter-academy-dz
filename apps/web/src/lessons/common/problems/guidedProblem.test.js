import { describe, it, expect } from 'vitest';
import { validateProblem, demandsOf, initialProgress, completeSubstep, isPartDone } from './guidedProblem';

const solution = { kind: 'solution', lines: ['a', 'b'] };
const ok = {
  id: 'p', title: 't', statement: 's', source: { type: 'platform_addition', reason: 'exam_style_problem' },
  data: [{ id: 'a', text: 'x', useful: true }, { id: 'b', text: 'y', useful: false }],
  parts: [
    { label: '1)', question: 'كم؟', asks: ['كم؟'], steps: [{ kind: 'sort' }, { kind: 'numeric', role: 'answer', ask: 0, expected: 3 }, solution] },
    { label: '2)', question: 'هل؟', asks: ['هل؟'], steps: [{ kind: 'choice', role: 'conclude', ask: 0, options: ['a', 'b'], correct: 1 }, solution] },
  ],
};

describe('validateProblem', () => {
  it('accepts a complete exam-style problem', () => {
    expect(validateProblem(ok)).toEqual([]);
  });

  it('rejects a single-part problem, a missing written solution, and a one-line solution', () => {
    expect(validateProblem({ ...ok, parts: [ok.parts[0]] }).join()).toMatch(/at least 2 parts/);
    const noSolution = { ...ok, parts: [ok.parts[0], { ...ok.parts[1], steps: [ok.parts[1].steps[0], { kind: 'numeric', role: 'compute', expected: 1 }] }] };
    expect(validateProblem(noSolution).join()).toMatch(/must end with a 'solution'/);
    const oneLine = { ...ok, parts: [ok.parts[0], { ...ok.parts[1], steps: [ok.parts[1].steps[0], { kind: 'solution', lines: ['a'] }] }] };
    expect(validateProblem(oneLine).join()).toMatch(/≥ 2 lines/);
  });

  it('keeps data sorting in part 1, with useful AND useless data', () => {
    const late = { ...ok, parts: [ok.parts[0], { ...ok.parts[1], steps: [{ kind: 'sort' }, solution] }] };
    expect(validateProblem(late).join()).toMatch(/belongs to part 1/);
    expect(validateProblem({ ...ok, data: [{ id: 'a', text: 'x', useful: true }] }).join()).toMatch(/useful AND useless/);
  });

  it('checks choice ranges, numeric expectations and roles', () => {
    const bad = { ...ok, parts: [ok.parts[0], { ...ok.parts[1], steps: [{ kind: 'choice', role: 'compute', options: ['a', 'b'], correct: 2 }, { kind: 'numeric', role: 'compute', expected: '3' }, solution] }] };
    const errors = validateProblem(bad).join('\n');
    expect(errors).toMatch(/role 'compute' is not allowed/);
    expect(errors).toMatch(/correct out of range/);
    expect(errors).toMatch(/expected must be a number/);
  });
});

describe('every demand has its own answer', () => {
  const two = { label: '2)', question: 'كم حافلة يلزم؟ وكم مقعدًا يبقى شاغرًا؟', asks: ['كم حافلة؟', 'كم مقعدًا؟'] };

  it('rejects two questions answered by a single input (the owner\'s 2026-10-06 case)', () => {
    const one = { ...ok, parts: [ok.parts[0], { ...two, steps: [
      { kind: 'choice', role: 'conclude', options: ['a', 'b'], correct: 0 }, // interprétation, sans ask
      { kind: 'numeric', role: 'answer', ask: 1, expected: 2 }, { kind: 'solution', ask: 0, lines: ['a', 'b'] }] }] };
    expect(validateProblem(one).join()).toMatch(/ask 1 « كم حافلة؟ » has no answer step of its own/);
  });

  it('accepts one answer per demand', () => {
    const both = { ...ok, parts: [ok.parts[0], { ...two, steps: [
      { kind: 'numeric', role: 'answer', ask: 0, expected: 5 }, { kind: 'numeric', role: 'answer', ask: 1, expected: 2 }, solution] }] };
    expect(validateProblem(both)).toEqual([]);
  });

  it('counts ؟ and imperatives as demands, and requires them declared', () => {
    expect(demandsOf('بيّن أنّ 36 قاسم للعدد 756، ثم استنتج عدد الرفوف.')).toBe(2);
    expect(demandsOf('عبّر عن العلاقة بين العددين.')).toBe(1); // « بين » n'est pas « بيّن »
    const undeclared = { ...ok, parts: [ok.parts[0], { ...two, asks: ['كم حافلة؟'], steps: [{ kind: 'numeric', role: 'answer', ask: 0, expected: 5 }, solution] }] };
    expect(validateProblem(undeclared).join()).toMatch(/makes 2 demand\(s\)/);
  });

  it('requires a numeric answer to name its ask', () => {
    const loose = { ...ok, parts: [ok.parts[0], { ...ok.parts[1], steps: [ok.parts[1].steps[0], { kind: 'numeric', role: 'answer', expected: 1 }, solution] }] };
    expect(validateProblem(loose).join()).toMatch(/must say which ask/);
  });
});

describe('guided progress (non-blocking)', () => {
  it('opens the next sub-step once one is answered, monotonically', () => {
    let p = initialProgress(ok);
    expect(p).toEqual([0, 0]);
    p = completeSubstep(p, 0, 0);
    expect(p).toEqual([1, 0]);
    // Re-answering an earlier sub-step never closes later ones.
    expect(completeSubstep(p, 0, 0)).toBe(p);
    p = completeSubstep(completeSubstep(p, 0, 1), 0, 2);
    expect(isPartDone(p, ok, 0)).toBe(true);
    expect(isPartDone(p, ok, 1)).toBe(false);
  });
});

describe('the statement support (figure / visual / table, 2026-10-06)', () => {
  const TRI = { points: { A: [0, 0], B: [4, 0], C: [0, 3] }, segments: [['A', 'B'], ['B', 'C'], ['C', 'A']], ariaLabel: 'مثلث' };
  it('accepts a valid GeoFigure, a CoordPlane prop bag and a rectangular table', () => {
    expect(validateProblem({ ...ok, figure: TRI, visual: { range: { xMin: 0, xMax: 10, yMin: 0, yMax: 5 }, unit: 30 }, table: { head: ['x', '1', '2'], rows: [['f(x)', '3', '5']] } })).toEqual([]);
  });
  it('reports the figure validator errors, a non-object visual and a ragged table', () => {
    const errs = validateProblem({ ...ok, figure: { ...TRI, colour: 'red' }, visual: [1, 2], table: { head: ['x', '1', '2'], rows: [['f(x)', '3']] } });
    expect(errs.some((e) => e.includes('figure:'))).toBe(true);
    expect(errs.some((e) => e.includes('visual'))).toBe(true);
    expect(errs.some((e) => e.includes('row 1 must have 3 cells'))).toBe(true);
  });
  it('a statement that refers to a figure / table / graph must carry one (« مربّع الشكل » is not a reference)', () => {
    expect(validateProblem({ ...ok, statement: 'اقرأ الجدول المقابل' }).some((e) => e.includes('refers to a figure'))).toBe(true);
    expect(validateProblem({ ...ok, statement: 'اقرأ الجدول المقابل', table: { head: ['x', '1'], rows: [['y', '2']] } })).toEqual([]);
    expect(validateProblem({ ...ok, statement: 'حديقة مربّعة الشكل' })).toEqual([]);
  });

  it('closes the CoordPlane prop list and caps the plot size, as practice does', () => {
    const errs = validateProblem({ ...ok, visual: { range: { xMin: 0, xMax: 100, yMin: 0, yMax: 5 }, functionz: [] } });
    expect(errs.some((e) => e.includes('visual.functionz is not a CoordPlane prop'))).toBe(true);
    expect(errs.some((e) => e.includes('max 460'))).toBe(true);
  });
});
