import { describe, it, expect } from 'vitest';
import {
  describeKnowledge,
  describeLimits,
  plain,
  stringsIn,
} from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { KNOWLEDGE } from './knowledge';
import { KEYS } from './journey';
import { lesson } from './index';
import { PRACTICE_MAP } from './practice';
import { FIGURES, chainHolds, equal, over, read, times, write } from './math';

describeKnowledge({ knowledge: KNOWLEDGE, keys: KEYS, cards: lesson.cards });
// the map and the practice hub against the limits the walks proved (the tablets and the forges: wave 2)
describeLimits({ forges: {}, keys: [], tablets: {}, knowledge: KNOWLEDGE, practiceMap: PRACTICE_MAP });

const card = (id) => KNOWLEDGE.graph.nodes.find((n) => n.id === id);
/** The value of a quiz option « $91$ », « $\\dfrac{468}{7}$ », or null for one that is not a number. */
const valueOf = (s) => {
  const t = s
    .replace(/\$/g, '')
    .replace('{,}', ',')
    .replace(/\\dfrac\{(\d+)\}\{(\d+)\}/, '$1/$2');
  try {
    return write(read(t));
  } catch {
    return null;
  }
};
const rightOf = (quiz, test) =>
  quiz.options
    .map((o, i) => [i, test(o)])
    .filter(([, t]) => t)
    .map(([i]) => i);

describe('« خريطة المعارف » of « خاصية طالس وحساب الأطوال » — the lesson’s own', () => {
  it('four memo sheets, one per key, each on its notebook card', () => {
    expect(
      Object.values(KNOWLEDGE.modules)
        .flat()
        .map((x) => x.id),
    ).toEqual(KEYS);
    for (const key of KEYS) expect(card(lesson.cards.ofKey[key])).toMatchObject({ notebook: true, requires: key });
  });

  it('the figures of the map are Thalès figures: their three ratios are equal', () => {
    for (const f of [...FIGURES.nested, ...FIGURES.butterfly])
      expect(chainHolds([f.VM, f.VB], [f.VN, f.VC], [f.MN, f.BC]), JSON.stringify(f)).toBe(true);
    for (const f of FIGURES.scale) expect(chainHolds([f.VM, f.VB], [f.MN, f.BC]), JSON.stringify(f)).toBe(true);
  });

  it('every quiz has ONE right option, computed here', () => {
    const [m1, m2, m3, m4] = Object.values(KNOWLEDGE.modules)
      .flat()
      .map((x) => x.memo.quiz);
    // 🔑 the partner of AM / AB; AM = 18, MB = 3: AM / AB = 18 / 21
    expect(m1[0].options[m1[0].correct]).toBe('$\\dfrac{AN}{AC}$');
    expect(rightOf(m1[1], (o) => valueOf(o) != null && equal(valueOf(o), over('18', '21')))).toEqual([m1[1].correct]);
    // 📐 16/36 = 40/BC; AM = 16, MB = 20, AN = 28: AC = 28 × 36 / 16
    expect(rightOf(m2[0], (o) => valueOf(o) != null && equal(times('16', valueOf(o)), times('36', '40')))).toEqual([
      m2[0].correct,
    ]);
    expect(rightOf(m2[1], (o) => valueOf(o) != null && equal(valueOf(o), over(times('28', '36'), '16')))).toEqual([
      m2[1].correct,
    ]);
    // 🦋 the partner of OA / OC; OD = OC × OB / OA
    expect(m3[0].options[m3[0].correct]).toBe('$\\dfrac{OB}{OD}$');
    expect(rightOf(m3[1], (o) => valueOf(o) != null && equal(valueOf(o), over(times('49', '78'), '42')))).toEqual([
      m3[1].correct,
    ]);
    // 🔍 7/6 > 1 enlarges; MN = 77 × 6/7
    expect(m4[0].options[m4[0].correct]).toMatch(/^تكبير/);
    expect(rightOf(m4[1], (o) => valueOf(o) != null && equal(valueOf(o), times('77', '6/7')))).toEqual([m4[1].correct]);
  });

  it('the numbers the cards state are computed from their figures', () => {
    expect(card('maqluba').context.parts[1].text).toContain('= 93{,}6$');
    expect(card('farasha-hisab').subtitle).toBe('$OD = 56$');
    expect(card('takbir').note ?? card('takbir').context.note).toContain('= 27{,}5$');
    expect(card('qitaa').context.parts[1].text).toContain('$35 + 7 = 42$');
  });

  it('a card title is plain text; the memo’s hook, trap and exam are plain; no sentence says « wrong »', () => {
    for (const n of KNOWLEDGE.graph.nodes) plain(n.title);
    for (const x of Object.values(KNOWLEDGE.modules).flat()) for (const f of ['hook', 'trap', 'exam']) plain(x.memo[f]);
    for (const s of stringsIn(KNOWLEDGE.graph.nodes.map((n) => ({ ...n, edges: null }))))
      expect(s).not.toMatch(/خاطئ|غلط/);
  });
});
