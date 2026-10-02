import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { GROUPS_RULE, WHOLE_RULE, READ_RULE, TABLE_RULE, COMPARE_RULE, OUTLIER_RULE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 4 « ترييض وقراءة وضعيات إحصائية وتفسير المؤشرات » — SOURCE UNIQUE.
 * Le manuel n'a ni معارف ni طرائق pour ce درس : chaque texte est une formulation de la PLATEFORME
 * (`addition('knowledge_formalization')`, content/textbook.js), dans le vocabulaire du manuel.
 *
 *   module 1  mutawassit-majmuat     moyenne de groupes réunis = Σ n·m ÷ N (le تحدّ)
 *             silsila-kamila         on compare la série entière, pas groupe par groupe
 *   module 2  qiraat-mukhattat       lire un مخطط بالأعمدة : axe, pas de graduation, hauteurs
 *             tarjama-jadwal         traduire en tableau : تكرار، تواتر، تواتر مجمع ; barre combinée (ex-19)
 *   module 3  mawqi-tashattut        comparer avec un indicateur de position ET de dispersion (ex-14)
 *             hadhf-qiyam            retirer des valeurs : Σ et N changent ; médiane et extrêmes (ex-22)
 *             tariqat-qarar          أقرأ · أحسب المؤشرات · أقارن · أقرّر
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'mutawassit-majmuat', type: 'regles', title: 'متوسط مجموعات مجتمعة',
        summary: 'متوسط سلسلة مكوّنة من مجموعات هو المتوسط المتوازن: نضرب متوسط كل مجموعة في تكرارها، نجمع، ثم نقسم على التكرار الكلي؛ ولا يساوي متوسط المتوسطات إلا إذا تساوت التكرارات.',
        body: <p><MathText>{GROUPS_RULE.text}</MathText></p>,
      },
      {
        id: 'silsila-kamila', type: 'concepts', title: 'نقارن السلسلة كاملة',
        summary: 'لمقارنة قسمين نقارن مؤشرات كل قسم كاملًا: مقارنة الذكور بالذكور والإناث بالإناث لا تحسم، ففي التحدّي للقسمين المعدّل نفسه.',
        body: <p><MathText>{WHOLE_RULE.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'qiraat-mukhattat', type: 'methodes', title: 'قراءة مخطط بالأعمدة',
        summary: 'نقرأ عنوان المحور العمودي، ثم خطوة التدريج، ثم ارتفاع كل عمود، وننقل القيم إلى جدول ونتحقّق من التكرار الكلي.',
        body: <p><MathText>{READ_RULE.text}</MathText></p>,
      },
      {
        id: 'tarjama-jadwal', type: 'methodes', title: 'ترجمة المخطط إلى جدول',
        summary: 'التكرار من ارتفاع العمود، التواتر هو التكرار مقسوما على التكرار الكلي، والتواتر المجمع الصاعد آخره 1؛ وعمود يجمع فئتين نستخرج منه كل فئة بالطرح.',
        body: <p><MathText>{TABLE_RULE.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'mawqi-tashattut', type: 'regles', title: 'مؤشر موقع ومؤشر تشتت',
        summary: 'لمقارنة سلسلتين نستعمل مؤشر موقع (المتوسط أو الوسيط) ومؤشر تشتت (المدى): سلسلتان لهما المتوسط نفسه قد تختلفان في التشتت.',
        body: <p><MathText>{COMPARE_RULE.text}</MathText></p>,
      },
      {
        id: 'hadhf-qiyam', type: 'concepts', title: 'حذف قيم وقيمة متطرفة',
        summary: 'حذف قيمة يغيّر مجموع القيم والتكرار الكلي معًا؛ قيمة متطرفة تجذب المتوسط ولا تحرّك الوسيط، وحذف أصغر قيمة وأكبر قيمة لا يغيّر الوسيط.',
        body: <p><MathText>{OUTLIER_RULE.text}</MathText></p>,
      },
      {
        id: 'tariqat-qarar', type: 'methodes', title: 'أقرأ، أحسب، أقارن، أقرّر',
        summary: 'لقراءة وضعية إحصائية واتخاذ قرار: أقرأ المعطيات وأترجمها، أحسب مؤشر موقع ومؤشر تشتت، أقارن، ثم أقرّر وأبرّر بالمؤشرات.',
        body: <p className="font-bold"><MathText>{METHOD.rule[0]}</MathText></p>,
      },
    ],
  },
};
