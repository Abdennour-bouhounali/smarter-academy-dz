/** The sentences of lesson `talis-hisab-atwal` that the kit's screens show: the names of its practice levels. */
import { K1, K2, K3, K4 } from './math';

export const TEXT = {
  /**
   * One name per level of the practice ladder, by node — each says what ITS waves ask or a place of the river
   * (`practice.js › PRACTICE_NODES`; `text.test.js` reads the two together), never a key's name nor its rule.
   */
  levels: {
    [K1]: ['رحلة: من الحقل إلى الورشة', 'رحلة: الضلع والقطعة'],
    [K2]: ['رحلة: الطول المجهول', 'رحلة: ضلع من قطعتين'],
    [K3]: ['رحلة: عبر النهر', 'رحلة: الضفّتان'],
    [K4]: ['رحلة: حجر القمّة', 'رحلة: نسخ المثلثات'],
    exam: ['رحلة: مراجعة شاملة', 'رحلة: إيقاع الامتحان'],
  },
  /** The real-world worlds of the lesson's cases: none. */
  worlds: {},
  /** The summary node of the practice hub. */
  summary: {
    icon: '🏆',
    title: 'تحدّي الامتحان',
    text: 'أسئلة من المفاتيح الأربعة معًا، بإيقاع أسرع: مراجعة ما قبل الامتحان.',
  },
  busy: '',
};
