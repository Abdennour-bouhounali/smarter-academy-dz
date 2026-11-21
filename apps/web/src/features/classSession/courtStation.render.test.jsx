import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import LessonBoard from './LessonBoard';
import MemoFigure from './MemoFigures';
import { openingFacts } from './lessonMemos';
import { courtCards, courtShown, courtWords } from './lessonScripts';
import { tiles } from '../../lessons/common/gameworld/rootCourts/strings';

// the board's layers (pen, pointer) are portals into `document.body`: no DOM here, they draw nothing
vi.mock('react-dom', async (orig) => ({ ...(await orig()), createPortal: () => null }));
globalThis.document ??= { body: null };

/**
 * The station `court` (a square court of « قصر الساحات » on the board) and the memo figure `court`: pure logic computed,
 * and what each draws — the world's own court, its cards, its words (never a plank's).
 */
const rods = {
  id: 'r',
  kind: 'court',
  chapter: 'نكتشف',
  title: 'ساحة',
  text: 'ساحة مساحتها 20 بلاطة.',
  question: 'أيّ مقياس يركب؟',
  area: '20',
  rods: ['4', '5', { q: '4,47', label: 'الحاسبة' }, { root: '20', label: 'ضلع الساحة' }],
  answer: ['√20'],
  after: '$4{,}47 < \\sqrt{20}$',
  cue: 'س',
};
const areas = {
  ...rods,
  id: 'a',
  area: undefined,
  rods: undefined,
  rod: { root: '7' },
  areas: ['3,5', '7', '14'],
  answer: ['7'],
};
const noop = () => {};
const board = (step) =>
  renderToString(
    <LessonBoard
      script={{ title: 'درس', steps: [step] }}
      rules={{}}
      students={[]}
      seating={{}}
      memo={{ step: 0, log: [], readers: [], sealed: false }}
      setMemo={noop}
      onEndTest={noop}
      onExit={noop}
    />,
  );

describe('حصّة القسم — a court of « قصر الساحات » on the board', () => {
  it('computes each card with the world’s exact law: a rod over a court, or a court under a rod', () => {
    const cards = courtCards(rods);
    expect(cards.map((c) => c.key)).toEqual(['4', '5', '4,47', '√20']);
    expect(cards.map((c) => c.out.kind)).toEqual(['band', 'jam', 'band', 'ride']);
    expect(cards.map((c) => c.label)).toEqual(['المقياس', 'المقياس', 'الحاسبة', 'ضلع الساحة']);
    expect(cards[3].tex).toBe('\\sqrt{20}');
    expect(cards[2].tex).toBe('4{,}47');
    expect(cards.filter((c) => c.out.kind === 'ride').map((c) => c.key)).toEqual(['√20']);
    const under = courtCards(areas);
    expect(under.map((c) => [c.key, c.out.kind, c.label])).toEqual([
      ['3,5', 'jam', 'الساحة'],
      ['7', 'ride', 'الساحة'],
      ['14', 'band', 'الساحة'],
    ]);
    // the proof waits for the riding card — or for every card when none rides
    expect(courtShown(rods, ['4', '5'])).toBe(false);
    expect(courtShown(rods, ['√20'])).toBe(true);
    const none = { ...rods, rods: ['4', '5'], answer: [] };
    expect(courtShown(none, ['4'])).toBe(false);
    expect(courtShown(none, ['5', '4'])).toBe(true);
    expect(courtWords(rods)).toMatchObject({ card: 'المقياس', ride: 'تركب', band: 'شريط', jam: 'تعلق' });
    expect(courtWords({ words: { card: 'العصا' } }).card).toBe('العصا');
  });

  it('draws the court itself, a card per rod with its own hook, and the button that lowers the platform', () => {
    const html = board(rods);
    expect(html).toContain('data-cs-court="r"');
    expect(html).toContain('data-court="20"'); // the world's own drawing, the court alone before any card
    for (const k of ['4', '5', '4,47', '√20']) expect(html).toContain(`data-cs-court-card="${k}"`);
    expect(html).toContain('data-cs-court-lower');
    expect(html).toContain('<small>الحاسبة</small>');
    expect(html).toContain('data-cs-court-shown="false"');
    expect(html).not.toMatch(/لوح|يثبت|ينهار/);
    // a given rod: the rod alone, large, until a court is chosen
    const h2 = board(areas);
    expect(h2).toContain('data-cs-court-rod');
    expect(h2).toContain('<small>الساحة</small>');
    expect(h2).not.toContain('data-court=');
  });

  it('the memo figure « court »: two rods on one court, each fact computed and said in the world’s words', () => {
    const o = { id: 'x', kind: 'court', a: '38', b: '6', alt: '7', title: 'صندوق' };
    expect(openingFacts(o).first).toMatchObject({ b: '6', kind: 'band', diff: '2', r: '2', exact: false });
    expect(openingFacts(o).second).toMatchObject({ b: '7', kind: 'jam', diff: '11', exact: false });
    const html = renderToString(<MemoFigure opening={o} />);
    expect(html).toContain('data-memo-figure="court"');
    expect(html).toContain('data-memo-court="band"');
    expect(html).toContain('data-memo-court="jam"');
    expect(html).toContain('شريط مساحته بلاطتان'); // agreed: never « 2 بلاطة »
    expect(html).toContain(`تعلق: تزيد ${tiles('11')}`); // the counter's no-break space
    const ride = renderToString(<MemoFigure opening={{ ...o, a: '14,44', b: '3,8', alt: undefined }} />);
    expect(ride).toContain('data-memo-court="ride"');
  });
});
