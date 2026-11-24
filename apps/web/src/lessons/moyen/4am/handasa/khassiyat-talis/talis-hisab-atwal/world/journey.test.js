import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KEYS, STAGES, journey } from './journey';
import { K1, K2, K3, K4 } from './math';
import { KNOWLEDGE } from './knowledge';
import { ladder } from './practice';
import { lesson } from './index';
import { WORLD_TEXT } from '../../../../../../common/gameworld/nilePyramids/strings';

const here = dirname(fileURLToPath(import.meta.url));

describe('the road of « خاصية طالس وحساب الأطوال »', () => {
  it('ONE list of keys, in the order of the docks: the journey’s; math.js holds the same ids', () => {
    expect(KEYS).toEqual(['wadiyat-talis', 'hisab-tul', 'wadiyat-al-farasha', 'muamil-k']);
    expect([K1, K2, K3, K4]).toEqual(KEYS);
    expect(lesson.keys).toBe(KEYS);
  });

  it('the status script finds the keys single-quoted in journey.js; forges.js (wave 2) quotes each one', () => {
    const journeyText = readFileSync(join(here, 'journey.js'), 'utf8');
    const found = [...(/KEYS\s*=\s*\[([^\]]*)\]/.exec(journeyText)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(found).toEqual(KEYS);
    const forges = join(here, 'forges.js');
    if (existsSync(forges))
      for (const k of found) expect(readFileSync(forges, 'utf8').includes(`'${k}'`), k).toBe(true);
  });

  it('the lesson holds every part wave 1 writes; the forges and the story come at wave 2', () => {
    for (const part of [
      'keys',
      'legs',
      'ladder',
      'practiceMap',
      'sittings',
      'trainer',
      'journey',
      'evidence',
      'cards',
      'knowledge',
      'text',
    ])
      expect(lesson[part], part).toBeTruthy();
    expect(lesson.legs).toHaveLength(4);
    expect(typeof lesson.trainer.evidenceOf).toBe('function');
    expect(typeof lesson.trainer.makeSession).toBe('function');
  });

  it('the cards a sitting of the BANK leaves open: each key’s notebook card, then the root card', () => {
    const { ofKey, ofExercise, fallback } = lesson.cards;
    expect(ofExercise).toEqual({});
    expect(Object.keys(ofKey)).toEqual(KEYS);
    const node = (id) => KNOWLEDGE.graph.nodes.find((n) => n.id === id);
    for (const key of KEYS) expect(node(ofKey[key])).toMatchObject({ notebook: true, requires: key });
    expect(node(fallback)).toBeTruthy();
  });

  it('the road: one stage per dock of the world; the exam opens after a first run of every key', () => {
    expect(STAGES).toBe(WORLD_TEXT.docks.length);
    expect(journey.examOpen(KEYS, {})).toBe(false);
    const firstRuns = Object.fromEntries(ladder.nodes.map((n, i) => [ladder.levelId(i, 0), { stars: 1, best: 100 }]));
    expect(journey.examOpen(KEYS, firstRuns)).toBe(true);
    expect(journey.examOpen(KEYS.slice(0, 3), firstRuns)).toBe(false);
    const p = journey.lessonProgress({ stage: 3, keys: [K1], know: { read: ['talis'] } });
    expect(p.road[0].label.replace(/\s/g, ' ')).toBe(`3 / ${STAGES}`);
    expect(p.road[4].label.replace(/\s/g, ' ')).toBe(`1 / ${KNOWLEDGE.graph.nodes.length}`);
  });
});
