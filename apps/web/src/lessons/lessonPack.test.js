import { describe, it, expect } from 'vitest';
import { lessonPackFlags, lessonsWithPack, loadLessonPack, getBuiltLessons } from './registry';
import { hasPackPart, loadPackPart } from './lessonPack';

const FLAGS = ['phone', 'world', 'knowledge', 'coach', 'board'];
const WITH_PACK = getBuiltLessons()
  .map((l) => l.id)
  .filter((id) => Object.keys(lessonPackFlags(id)).length > 0);

describe('the pack of a lesson — the ONE place where it says what it gives the platform', () => {
  it('a lesson without a pack has no flag and no part: nothing is loaded for it', async () => {
    expect(lessonPackFlags('bahth-pgcd')).toEqual({});
    expect(lessonPackFlags('no-such-lesson')).toEqual({});
    expect(await loadLessonPack('bahth-pgcd')).toBe(null);
    expect(hasPackPart('bahth-pgcd', 'script')).toBe(false);
    expect(await loadPackPart('bahth-pgcd', 'world')).toBe(null);
  });

  it('the generated flags say exactly what each pack holds, and every part named really loads', async () => {
    expect(WITH_PACK).toContain('qasim-adad-tabii');
    for (const id of WITH_PACK) {
      const flags = lessonPackFlags(id);
      const pack = await loadLessonPack(id);
      expect(pack.id, id).toBe(id);
      expect(Object.keys(flags).sort(), id).toEqual(FLAGS.filter((f) => pack[f]).sort());
      for (const f of FLAGS) expect(lessonsWithPack(f).includes(id), `${id} ${f}`).toBe(Boolean(pack[f]));
      if (flags.world) {
        expect(flags.world, id).toBe(pack.world.id);
        const lesson = await loadPackPart(id, 'world');
        for (const key of ['keys', 'ladder', 'trainer', 'sittings', 'journey', 'evidence', 'knowledge', 'text'])
          expect(lesson[key], `${id} world.${key}`).toBeTruthy();
      }
      if (flags.knowledge)
        expect(Object.keys((await loadPackPart(id, 'knowledge')).modules).length, id).toBeGreaterThan(0);
      if (flags.board) {
        expect((await loadPackPart(id, 'script')).steps.length, id).toBeGreaterThan(0);
        expect((await loadPackPart(id, 'memo')).glance, id).toBeTruthy();
      }
    }
  });

  it('the exam coach finds a knowledge sheet behind every الكفاءة the pack names', async () => {
    for (const id of lessonsWithPack('coach')) {
      const coach = await loadPackPart(id, 'coach');
      const items = Object.values((await loadPackPart(id, 'knowledge')).modules)
        .flat()
        .map((it) => it.id);
      for (const [point, item] of Object.entries(coach)) expect(items, `${id} ${point}`).toContain(item);
    }
  });
});
