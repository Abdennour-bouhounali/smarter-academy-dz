// The kit's screens that list the lesson's keys — the practice hub « فضاء التدريب » and « تقدّمي » — name every rule and
// its levels FROM THE START, with or without its key (owner, 2026-11-26 on the French platform: « fiche de connaissances and
// the training games must be open even if the student did not start yet the lesson game »; ported 2026-11-28). These tests
// used to hold the opposite (a key not held had no name, « ؟ ؟ ؟ »). Server render: the first screen only.
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import PracticeHub from './PracticeHub';
import { ProgressPage } from './Spaces';
import { LessonProvider } from './LessonContext';
import { createLadder, SUMMARY } from './ladder';
import { createJourney, emptyExam } from './journey';
import { KT, TX } from './text';

globalThis.window = globalThis.window ?? {};
// the sound switch reads the game's store (useSyncExternalStore), which a server render cannot: it is not under test here
vi.mock('./parts', async (importOriginal) => ({ ...(await importOriginal()), SoundToggle: () => null }));

const run = { speed: 6, mix: [['k', {}]] };
const nodes = [
  { id: 'first', levels: [run, run] },
  { id: 'second', levels: [run, run] },
  { id: SUMMARY, levels: [run] },
];
const ladder = createLadder({ nodes, generators: { k: () => null }, isRight: () => true });
const journey = createJourney({ keys: ['first', 'second'], ladder, levels: [{ n: 1 }], stages: 2, cards: 2 });
const lesson = {
  keys: ['first', 'second'],
  ladder,
  journey,
  rules: {
    first: { icon: '🔑', title: 'اسم القاعدة الأولى', math: ['1'], notes: ['ملاحظة أولى'] },
    second: { icon: '🗝️', title: 'اسم القاعدة الثانية', math: ['2'], notes: ['ملاحظة ثانية'] },
  },
  text: {
    summary: { icon: '🏆', title: 'تحدّي الامتحان', text: 'مراجعة' },
    levels: {
      first: ['سباق المستوى الأوّل أ', 'سباق المستوى الأوّل ب'],
      second: ['سباق سرّيّ أ', 'سباق سرّيّ ب'],
      [SUMMARY]: ['سباق المراجعة'],
    },
  },
  practiceMap: {
    root: 'جذر الخريطة',
    positions: { root: [50, 10], first: [70, 40], second: [30, 40], [SUMMARY]: [50, 80] },
    edges: [
      ['root', 'first', 'مكان'],
      ['first', 'second', null],
      ['second', SUMMARY, null, true],
    ],
  },
  cards: { ofKey: {}, ofExercise: {}, fallback: null },
  evidence: { learningPointOf: () => null },
  // the exam ladder's bank, not under test here: no level yet
  sittings: { ready: () => true, prepare: () => Promise.resolve(), levels: [], available: () => false },
};
const game = {};
// he holds the first key only: the second is not forged yet
const s = {
  openKeys: ['first'],
  keys: ['first'],
  practice: {},
  stage: 1,
  know: { read: [], sealed: [] },
  exam: emptyExam(),
  tally: {},
  phase: 'title',
};
const render = (el) => renderToString(<LessonProvider lesson={lesson}>{el}</LessonProvider>);
// renderToString escapes nothing in Arabic, but splits adjacent text nodes with comments: compare on the bare text
const textOf = (html) => html.replace(/<!--.*?-->/g, '');

describe('a rule is named and open on the kit screens from the start, with or without its key', () => {
  it('the practice hub: the node of a key not held shows its name and its levels', () => {
    const html = textOf(render(<PracticeHub s={s} game={game} space0="game" />));
    expect(html).toContain('اسم القاعدة الأولى');
    expect(html).toContain('سباق المستوى الأوّل أ');
    expect(html).toContain('اسم القاعدة الثانية');
    expect(html).not.toContain(KT.hidden);
    expect(html).toContain('تحدّي الامتحان');
  });

  it('the practice hub: the panel of a key not held names its rule and its levels, and is not locked', () => {
    const html = textOf(render(<PracticeHub s={s} game={game} sel={1} />));
    expect(html).toContain('data-di-panel="second"');
    expect(html).toContain('اسم القاعدة الثانية');
    expect(html).toContain('سباق سرّيّ أ');
    expect(html).not.toContain(KT.map.locked);
  });

  it('the practice hub opens on « فضاء الامتحان », first and open, when nothing sends him to a node', () => {
    const html = textOf(render(<PracticeHub s={s} game={game} />));
    expect(html.indexOf('data-di-space="exam"')).toBeLessThan(html.indexOf('data-di-space="game"'));
    expect(html).toMatch(/aria-selected="true"[^>]*data-di-space="exam"/);
    expect(html).toContain('data-di-ladder="open"');
  });

  it('the practice hub: with the key held, nothing changes', () => {
    const html = textOf(render(<PracticeHub s={{ ...s, openKeys: ['first', 'second'] }} game={game} sel={1} />));
    expect(html).toContain('اسم القاعدة الثانية');
    expect(html).toContain('سباق سرّيّ أ');
  });

  it('« تقدّمي »: a key not earned yet is named, and its row still says it is not won', () => {
    const html = textOf(render(<ProgressPage s={s} game={game} lessonId="toy" lessonTitle="درس" />));
    expect(html).toContain('data-di-prow="second"');
    expect(html).toContain('اسم القاعدة الأولى');
    expect(html).toContain('اسم القاعدة الثانية');
    expect(html).toContain(TX.progress.notYet);
    expect(html).not.toContain(KT.hidden);
  });
});
