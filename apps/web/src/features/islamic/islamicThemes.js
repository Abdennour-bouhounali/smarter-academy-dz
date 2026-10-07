/**
 * « القيم الإسلامية » — LE vocabulaire de la couche de valeurs : types de
 * contenu, publics, thèmes et moments. Aucune chaîne de thème ou de moment
 * ne s'écrit ailleurs : le contenu, le sélecteur et les pages importent ces
 * constantes, et `islamic.test.js` refuse un contenu qui en sort.
 *
 * Voir docs/architecture/ISLAMIC_VALUES.md.
 */

/** Ce qu'un élément EST — décide de son rendu (verset, حديث, دعاء…). */
export const CONTENT_TYPES = Object.freeze({
  QURAN: 'quran',
  HADITH: 'hadith',
  DUA: 'dua',
  VALUE: 'value',
  WISDOM: 'wisdom',
  REFLECTION: 'reflection',
});

/** À QUI il s'adresse. `both` : la communauté éducative entière. */
export const AUDIENCES = Object.freeze({
  STUDENT: 'student',
  TEACHER: 'teacher',
  BOTH: 'both',
});

/** Les thèmes — un registre unique (les libellés arabes sont dans `common:islamic.themes`). */
export const THEMES = Object.freeze({
  KNOWLEDGE: 'knowledge',
  EFFORT: 'effort',
  PATIENCE: 'patience',
  PERSEVERANCE: 'perseverance',
  SINCERITY: 'sincerity',
  GRATITUDE: 'gratitude',
  HONESTY: 'honesty',
  TRUST: 'trust',
  EXCELLENCE: 'excellence',
  MERCY: 'mercy',
  HUMILITY: 'humility',
  RESPECT: 'respect',
  RESPONSIBILITY: 'responsibility',
  TIME: 'time',
  HELPING_OTHERS: 'helping_others',
  GOOD_CHARACTER: 'good_character',
  DIFFICULTY: 'difficulty',
  SUCCESS: 'success',
  FAILURE: 'failure',
  LEARNING: 'learning',
  TEACHING: 'teaching',
  PARENTS: 'parents',
  JUSTICE: 'justice',
  INTENTION: 'intention',
});

/**
 * Les MOMENTS du parcours où un rappel peut apparaître. Chacun vit AUTOUR
 * du raisonnement mathématique, jamais dedans (§ « Où, et où jamais » de la
 * doc). `general` est le repli de tous les autres.
 */
export const CONTEXTS = Object.freeze({
  HOME: 'home',
  STUDY_START: 'study_start',
  LESSON_START: 'lesson_start',
  MODULE_START: 'module_start',
  STUDY_PROGRESS: 'study_progress',
  DIFFICULTY: 'difficulty',
  MISTAKE: 'mistake',
  EXERCISE_SUCCESS: 'exercise_success',
  LESSON_COMPLETION: 'lesson_completion',
  STUDY_BREAK: 'study_break',
  TEACHER_HOME: 'teacher_home',
  TEACHER_START: 'teacher_start',
  GENERAL: 'general',
});

const T = THEMES;

/**
 * Les thèmes PRÉFÉRÉS de chaque moment — ajoutés à ceux que la page passe.
 * Ils départagent, ils ne filtrent pas : un élément sans thème commun reste
 * éligible s'il déclare le moment.
 */
export const CONTEXT_THEMES = Object.freeze({
  home: [T.KNOWLEDGE, T.EFFORT, T.SINCERITY, T.TIME],
  study_start: [T.KNOWLEDGE, T.INTENTION, T.EFFORT],
  lesson_start: [T.KNOWLEDGE, T.INTENTION, T.EFFORT, T.LEARNING],
  module_start: [T.KNOWLEDGE, T.EFFORT, T.LEARNING],
  study_progress: [T.PERSEVERANCE, T.EFFORT, T.TIME],
  difficulty: [T.PATIENCE, T.PERSEVERANCE, T.DIFFICULTY],
  mistake: [T.PATIENCE, T.PERSEVERANCE, T.FAILURE],
  exercise_success: [T.GRATITUDE, T.HUMILITY, T.EFFORT, T.SUCCESS],
  lesson_completion: [T.GRATITUDE, T.EFFORT, T.KNOWLEDGE, T.SUCCESS],
  study_break: [T.TIME, T.GRATITUDE, T.GOOD_CHARACTER, T.PATIENCE],
  teacher_home: [T.TEACHING, T.RESPONSIBILITY, T.EXCELLENCE, T.MERCY],
  teacher_start: [T.TEACHING, T.SINCERITY, T.EXCELLENCE],
  general: [],
});

export const THEME_VALUES = Object.freeze(Object.values(THEMES));
export const CONTEXT_VALUES = Object.freeze(Object.values(CONTEXTS));
export const AUDIENCE_VALUES = Object.freeze(Object.values(AUDIENCES));
export const TYPE_VALUES = Object.freeze(Object.values(CONTENT_TYPES));
