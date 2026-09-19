import { src } from '../../_unit/unitMeta.js';
import { TRY_NOW_1 } from './textbook.js';
export const LP = { P1: '4am_qasim-mushtarak-akbar_P1', P2: '4am_qasim-mushtarak-akbar_P2', P3: '4am_qasim-mushtarak-akbar_P3', P4: '4am_qasim-mushtarak-akbar_P4' };

export const EXERCISES = [
  { id: 'now-11-1', source: TRY_NOW_1.source, learningPointId: LP.P1, difficulty: 'facile', statement: TRY_NOW_1.text, interaction: 'integerSet',
    question: { prompt: 'القواسم المشتركة للعددين 65 و 78:', expected: [1, 13], explain: 'قواسم 65: 1 ، 5 ، 13 ، 65. قواسم 78: 1 ، 2 ، 3 ، 6 ، 13 ، 26 ، 39 ، 78. المشتركة: 1 و 13.' } },
  { id: 'ex-10', source: src('ex-10', 14, 'أوظّف تعلّماتي', 10), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'عيّن قائمة قواسم كل من العددين 155 و 141. ما هو أكبر قاسم مشترك لهما؟ ما هو أصغر قاسم لهما؟', interaction: 'choice',
    question: { prompt: 'قواسم 155: 1 ، 5 ، 31 ، 155 — قواسم 141: 1 ، 3 ، 47 ، 141. إذن:', options: ['أكبر قاسم مشترك لهما هو 1، وأصغر قاسم لهما هو 1', 'أكبر قاسم مشترك لهما هو 31', 'أكبر قاسم مشترك لهما هو 47', 'لا قاسم مشترك لهما'], correct: 0, cols: 1,
      explain: 'القاسم المشترك الوحيد هو 1: فهو أكبر القواسم المشتركة (PGCD(155 ; 141) = 1) وأصغر قاسم لكل منهما.' },
    commonError: 'الاعتقاد أن عددين لا يملكان قاسمًا مشتركًا: 1 قاسم مشترك دائمًا.' },
];
export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
