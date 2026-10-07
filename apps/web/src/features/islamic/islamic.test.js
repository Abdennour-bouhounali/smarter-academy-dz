import { describe, it, expect } from 'vitest';
import { ISLAMIC_CONTENT } from './content/index.js';
import { selectIslamicContent, audienceForUser, isEligible, contentText } from './islamicSelector.js';
import { planMoment, recordShown, emptyFrequencyState, readFrequencyState, writeFrequencyState, RECENT_LIMIT, MOMENT_POLICY, STORAGE_KEY } from './islamicFrequency.js';
import { THEME_VALUES, CONTEXT_VALUES, AUDIENCE_VALUES, TYPE_VALUES, CONTEXTS } from './islamicThemes.js';
import TANZIL from './content/__fixtures__/tanzilSimple.json';
import HADITH_SOURCES from './content/__fixtures__/hadithSources.json';
import { BASMALA, HOME_VERSE } from './content/mushaf.js';

/**
 * La couche « القيم الإسلامية » : le CHOIX (pur), la FRÉQUENCE (pure) et
 * l'INTÉGRITÉ des sources. Ce dernier bloc est le garde-fou : aucun verset
 * ni ḥadīth n'entre dans le registre s'il n'est pas une sous-chaîne exacte
 * de sa source (instantanés régénérés par scripts/islamic-fetch-sources.mjs).
 */

const item = (over) => ({
  id: over.id, type: 'value', text: 'نص', audience: 'both', themes: [], contexts: ['general'],
  priority: 1, active: true, status: 'published', ...over,
});

describe('selectIslamicContent — audience', () => {
  const items = [
    item({ id: 's', audience: 'student', contexts: ['home'] }),
    item({ id: 't', audience: 'teacher', contexts: ['home'] }),
    item({ id: 'b', audience: 'both', contexts: ['home'] }),
  ];

  it('un élève ne reçoit que student / both', () => {
    for (let seed = 0; seed < 5; seed += 1) {
      const got = selectIslamicContent({ items, audience: 'student', context: 'home', seed });
      expect(['s', 'b']).toContain(got.id);
    }
    const all = ISLAMIC_CONTENT.filter((i) => isEligible(i, 'student'));
    expect(all.every((i) => i.audience === 'student' || i.audience === 'both')).toBe(true);
  });

  it('un enseignant ne reçoit que teacher / both', () => {
    for (let seed = 0; seed < 5; seed += 1) {
      const got = selectIslamicContent({ items, audience: 'teacher', context: 'home', seed });
      expect(['t', 'b']).toContain(got.id);
    }
  });

  it('l’audience exacte passe devant both à égalité', () => {
    expect(selectIslamicContent({ items, audience: 'student', context: 'home' }).id).toBe('s');
    expect(selectIslamicContent({ items, audience: 'teacher', context: 'home' }).id).toBe('t');
  });

  it('sans audience (anonyme, admin) : rien', () => {
    expect(selectIslamicContent({ items, audience: null, context: 'home' })).toBeNull();
    expect(audienceForUser(null)).toBeNull();
    expect(audienceForUser({ role: 'admin' })).toBeNull();
    expect(audienceForUser({ role: 'student' })).toBe('student');
    expect(audienceForUser({ role: 'teacher' })).toBe('teacher');
  });

  it('un élément inactif ou non publié n’est jamais servi', () => {
    const hidden = [item({ id: 'off', active: false, contexts: ['home'] }), item({ id: 'draft', status: 'draft', contexts: ['home'] })];
    expect(selectIslamicContent({ items: hidden, audience: 'student', context: 'home' })).toBeNull();
  });
});

describe('selectIslamicContent — moment, thèmes, récence, repli', () => {
  it('le moment exact passe devant tout le reste', () => {
    const items = [
      item({ id: 'gen', contexts: ['general'], themes: ['patience', 'perseverance'], priority: 3 }),
      item({ id: 'diff', contexts: ['difficulty'] }),
    ];
    expect(selectIslamicContent({ items, audience: 'student', context: 'difficulty' }).id).toBe('diff');
  });

  it('les thèmes départagent au sein du moment', () => {
    const items = [
      item({ id: 'plain', contexts: ['lesson_start'], priority: 3 }),
      item({ id: 'themed', contexts: ['lesson_start'], themes: ['knowledge'] }),
    ];
    expect(selectIslamicContent({ items, audience: 'student', context: 'lesson_start' }).id).toBe('themed');
    // un thème demandé par la page s'ajoute à ceux du moment
    const more = [...items, item({ id: 'time', contexts: ['lesson_start'], themes: ['time', 'knowledge'] })];
    expect(selectIslamicContent({ items: more, audience: 'student', context: 'lesson_start', themes: ['time'] }).id).toBe('time');
  });

  it('la priorité départage à thèmes égaux', () => {
    const items = [item({ id: 'p1', contexts: ['home'] }), item({ id: 'p3', contexts: ['home'], priority: 3 })];
    expect(selectIslamicContent({ items, audience: 'student', context: 'home' }).id).toBe('p3');
  });

  it('un élément récent est évité tant qu’il reste un autre choix', () => {
    const items = [item({ id: 'a', contexts: ['home'], priority: 3 }), item({ id: 'b', contexts: ['home'] })];
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', recentContentIds: ['a'] }).id).toBe('b');
  });

  it('tout est récent : le moins récent revient', () => {
    const items = [item({ id: 'a', contexts: ['home'] }), item({ id: 'b', contexts: ['home'] })];
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', recentContentIds: ['a', 'b'] }).id).toBe('b');
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', recentContentIds: ['b', 'a'] }).id).toBe('a');
  });

  it('repli sur `general` quand le moment n’a rien (ou plus rien de frais)', () => {
    const items = [item({ id: 'g', contexts: ['general'] }), item({ id: 'h', contexts: ['home'] })];
    expect(selectIslamicContent({ items, audience: 'student', context: 'study_break' }).id).toBe('g');
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', recentContentIds: ['h'] }).id).toBe('g');
  });

  it('déterministe : mêmes entrées, même sortie ; la graine fait tourner les ex æquo', () => {
    const items = [item({ id: 'x', contexts: ['home'] }), item({ id: 'y', contexts: ['home'] })];
    const a = selectIslamicContent({ items, audience: 'student', context: 'home', seed: 7 });
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', seed: 7 }).id).toBe(a.id);
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', seed: 8 }).id).not.toBe(a.id);
  });

  it('un emplacement compact ne reçoit qu’un texte court', () => {
    const items = [item({ id: 'long', contexts: ['home'], text: 'ا'.repeat(200), priority: 3 }), item({ id: 'short', contexts: ['home'] })];
    expect(selectIslamicContent({ items, audience: 'student', context: 'home', maxTextLength: 90 }).id).toBe('short');
  });

  it('le registre réel sert chaque moment, pour chaque rôle concerné', () => {
    const studentMoments = ['home', 'study_start', 'lesson_start', 'study_progress', 'difficulty', 'mistake', 'exercise_success', 'lesson_completion', 'study_break', 'general'];
    for (const context of studentMoments) {
      expect(selectIslamicContent({ items: ISLAMIC_CONTENT, audience: 'student', context }), context).not.toBeNull();
    }
    for (const context of ['teacher_home', 'teacher_start', 'general']) {
      expect(selectIslamicContent({ items: ISLAMIC_CONTENT, audience: 'teacher', context }), context).not.toBeNull();
    }
    // les moments compacts ont de quoi tourner (≥ 3 textes courts)
    for (const context of ['home', 'mistake']) {
      const pool = ISLAMIC_CONTENT.filter((i) => isEligible(i, 'student') && i.contexts.includes(context) && contentText(i).length <= 90);
      expect(pool.length, context).toBeGreaterThanOrEqual(3);
    }
  });

  it('l’enseignant a son propre fil, pas une copie de celui de l’élève', () => {
    const teacherOnly = ISLAMIC_CONTENT.filter((i) => i.audience === 'teacher');
    expect(teacherOnly.length).toBeGreaterThanOrEqual(10);
    expect(teacherOnly.every((i) => i.contexts.some((c) => c.startsWith('teacher_')))).toBe(true);
    expect(ISLAMIC_CONTENT.filter((i) => i.audience === 'both').length).toBeGreaterThanOrEqual(25);
  });
});

describe('fréquence', () => {
  const HOUR = 60 * 60 * 1000;
  const now = 1_800_000_000_000;

  it('premier passage : choisir', () => {
    expect(planMoment({ context: 'home', state: emptyFrequencyState(), now })).toEqual({ action: 'select' });
  });

  it('l’accueil garde le même rappel six heures, puis en change', () => {
    const state = recordShown(emptyFrequencyState(), { context: 'home', id: 'q1', now });
    expect(planMoment({ context: 'home', state, now: now + HOUR })).toEqual({ action: 'reuse', id: 'q1' });
    expect(planMoment({ context: 'home', state, now: now + 7 * HOUR })).toEqual({ action: 'select' });
  });

  it('une pause, une difficulté : silence pendant le délai, jamais en rafale', () => {
    for (const context of ['study_break', 'difficulty', 'mistake']) {
      const state = recordShown(emptyFrequencyState(), { context, id: 'x', now });
      expect(planMoment({ context, state, now: now + 60 * 1000 })).toEqual({ action: 'skip' });
      const after = (MOMENT_POLICY[context].cooldownMinutes + 1) * 60 * 1000;
      expect(planMoment({ context, state, now: now + after })).toEqual({ action: 'select' });
    }
  });

  it('les récents sont bornés, sans doublon, du plus récent au plus ancien', () => {
    let state = emptyFrequencyState();
    for (let i = 0; i < RECENT_LIMIT + 5; i += 1) state = recordShown(state, { context: 'home', id: `i${i}`, now: now + i });
    state = recordShown(state, { context: 'home', id: `i${RECENT_LIMIT}`, now });
    expect(state.recent.length).toBe(RECENT_LIMIT);
    expect(state.recent[0]).toBe(`i${RECENT_LIMIT}`);
    expect(new Set(state.recent).size).toBe(state.recent.length);
  });

  it('un stockage absent, bloqué ou corrompu donne un état vide, jamais une erreur', () => {
    const throwing = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
    expect(readFrequencyState(throwing)).toEqual(emptyFrequencyState());
    expect(() => writeFrequencyState(emptyFrequencyState(), throwing)).not.toThrow();
    expect(readFrequencyState({ getItem: () => '{oops' })).toEqual(emptyFrequencyState());
    const mem = new Map();
    const store = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
    writeFrequencyState(recordShown(emptyFrequencyState(), { context: 'home', id: 'a', now }), store);
    expect(mem.has(STORAGE_KEY)).toBe(true);
    expect(readFrequencyState(store).recent).toEqual(['a']);
  });
});

describe('registre — forme', () => {
  it('ids uniques ; types, publics, thèmes et moments tous déclarés dans islamicThemes.js', () => {
    const ids = ISLAMIC_CONTENT.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const i of ISLAMIC_CONTENT) {
      expect(TYPE_VALUES, i.id).toContain(i.type);
      expect(AUDIENCE_VALUES, i.id).toContain(i.audience);
      expect(i.themes.length, i.id).toBeGreaterThan(0);
      for (const t of i.themes) expect(THEME_VALUES, `${i.id}:${t}`).toContain(t);
      expect(i.contexts.length, i.id).toBeGreaterThan(0);
      for (const c of i.contexts) expect(CONTEXT_VALUES, `${i.id}:${c}`).toContain(c);
      expect(i.active).toBe(true);
      expect(i.status).toBe('published');
    }
  });

  it('chaque moment déclaré a au moins un élément (ou `general` pour repli)', () => {
    for (const c of Object.values(CONTEXTS)) {
      if (c === CONTEXTS.MODULE_START) continue; // repli sur general, intégration non posée (doc)
      expect(ISLAMIC_CONTENT.some((i) => i.contexts.includes(c)), c).toBe(true);
    }
  });
});

describe('intégrité des sources — rien d’inventé', () => {
  // Les marques de direction (U+200F) du recueil ne sont pas du texte.
  const clean = (s) => s.replace(/[‎‏]/g, '');
  const quranic = ISLAMIC_CONTENT.filter((i) => i.type === 'quran' || (i.type === 'dua' && i.origin === 'quran'));
  const prophetic = ISLAMIC_CONTENT.filter((i) => i.type === 'hadith' || (i.type === 'dua' && i.origin === 'hadith'));

  it('chaque verset a sourate, nom, numéro, et chaque texte est mot pour mot dans Tanzil', () => {
    expect(quranic.length).toBeGreaterThanOrEqual(30);
    for (const i of quranic) {
      expect(i.surah, i.id).toBeGreaterThan(0);
      expect(i.surahName, i.id).toBeTruthy();
      expect(i.ayah, i.id).toBe(i.verses[0].ayah);
      if (i.ayahEnd) expect(i.ayahEnd, i.id).toBe(i.verses.at(-1).ayah);
      expect(i.sourceVerified, i.id).toBe(true);
      for (const v of i.verses) {
        const source = TANZIL[`${i.surah}:${v.ayah}`];
        expect(source, `${i.id} ${i.surah}:${v.ayah} absent de l’instantané`).toBeTruthy();
        expect(source.includes(v.text), `${i.id} ${i.surah}:${v.ayah} n’est pas mot pour mot`).toBe(true);
        // un verset cité en entier n'est pas marqué « extrait », et inversement
        if (!i.excerpt) expect(v.text, `${i.id} : verset entier attendu`).toBe(source);
      }
    }
  });

  it('chaque ḥadīth a recueil, numéro, degré, et son matn est mot pour mot dans le recueil', () => {
    expect(prophetic.length).toBeGreaterThanOrEqual(25);
    for (const i of prophetic) {
      expect(['bukhari', 'muslim', 'tirmidhi'], i.id).toContain(i.collection);
      expect(i.collectionName, i.id).toBeTruthy();
      expect(i.number, i.id).toMatch(/^\d+$/);
      expect(i.authenticity?.label, i.id).toBeTruthy();
      expect(['sahih', 'hasan'], i.id).toContain(i.authenticity.grade);
      expect(i.intro, i.id).toMatch(/ﷺ/);
      const sources = HADITH_SOURCES[`${i.collection}:${i.number}`];
      expect(sources, `${i.id} absent de l’instantané`).toBeTruthy();
      expect(sources.some((s) => clean(s).includes(i.text)), `${i.id} n’est pas mot pour mot`).toBe(true);
    }
  });

  it('le verset de l’accueil et sa basmala sont mot pour mot dans Tanzil, « الَّذِي » avec sa yāʾ pointée', () => {
    expect(BASMALA.text).toBe(TANZIL['1:1']);
    expect(HOME_VERSE.surah).toBe(96);
    for (const v of HOME_VERSE.verses) expect(v.text).toBe(TANZIL[`${HOME_VERSE.surah}:${v.ayah}`]);
    expect(HOME_VERSE.verses[0].text).toMatch(/ي\s/);
    expect(HOME_VERSE.verses[0].text).not.toMatch(/ى/);
  });

  it('al-Tirmidhī : jamais sans le jugement nommé (الترمذي / الألباني)', () => {
    for (const i of prophetic.filter((x) => x.collection === 'tirmidhi')) {
      expect(i.authenticity.label, i.id).toMatch(/الألباني/);
    }
  });

  it('une phrase rédigée par la plateforme n’a pas l’habit d’une source', () => {
    for (const i of ISLAMIC_CONTENT.filter((x) => ['value', 'wisdom', 'reflection'].includes(x.type))) {
      expect(i.surah, i.id).toBeUndefined();
      expect(i.collection, i.id).toBeUndefined();
      expect(['platform', 'proverb'], i.id).toContain(i.source);
      expect(i.text, i.id).not.toMatch(/ﷺ|قال رسول|صلى الله عليه|[﴿﴾«»]/);
    }
    // tout دعاء a une origine vérifiable
    for (const i of ISLAMIC_CONTENT.filter((x) => x.type === 'dua')) expect(['quran', 'hadith'], i.id).toContain(i.origin);
  });

  it('aucune gamification : ni points, ni série, ni badge dans le modèle', () => {
    const banned = ['xp', 'points', 'streak', 'badge', 'reward', 'score'];
    for (const i of ISLAMIC_CONTENT) for (const key of Object.keys(i)) expect(banned, `${i.id}.${key}`).not.toContain(key.toLowerCase());
  });
});
