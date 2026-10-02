import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOW, EX7, EX7_OUTLIER, EX15, CALC } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « استعمال المجدولات (Excel) » — SOURCE UNIQUE. Le manuel n'a pas de معارف sur
 * le tableur : chaque texte vient de `content/textbook.js › KNOW` (écrit par la plateforme,
 * `knowledge_formalization`, dans les mots des exercices) ou des exercices eux-mêmes (le منوال défini par
 * le تمرين 7 ب).
 *
 *   module 1 (تمرين 7)   hajz-hifz (P1), khaliya-majal (P1), dustur (P2), dasatir-arbaa (P2), manwal (P2),
 *                        iadat-hisab (P2) ;
 *   module 2 (التمثيلات) tamthil-munasib (P3) ;
 *   module 3 (معارف)     asmaa-dawal (P2) ;
 *   module 4 (أدوات)     dhakira-hasiba (P2).
 * Les `summary` sont du texte simple, sans دستور (carte, مذكرة) : les دساتير restent dans `body`.
 */
const M = ({ children }) => <MathText>{children}</MathText>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'hajz-hifz', type: 'methodes', title: 'حجز سلسلة في مجدول وحفظها',
        summary: 'نكتب كل قيمة من السلسلة في خلية من سطر واحد ونضغط ENTER بعد كل قيمة، ثم نحفظ الملف لنعود إليه.',
        body: <p><M>{KNOW.entry}</M></p>,
      },
      {
        id: 'khaliya-majal', type: 'concepts', title: 'الخلية والمجال',
        summary: 'كل خلية تُسمّى بحرف عمودها ورقم سطرها مثل A1 ، والمجال من A1 إلى G1 هو الخلايا السبع من A1 إلى G1.',
        body: (
          <div className="space-y-1">
            <p><M>{KNOW.cells}</M></p>
            <p className="text-sm text-slate-600"><M>{KNOW.range}</M></p>
          </div>
        ),
      },
      {
        id: 'dustur', type: 'concepts', title: 'الدستور',
        summary: 'الدستور يبدأ بالإشارة يساوي ويحسب على مجال من الخلايا؛ يكتب المجدول نتيجته ويعيد حسابها إذا تغيّرت خلية من المجال.',
        body: <p><M>{KNOW.formula}</M></p>,
      },
      {
        id: 'dasatir-arbaa', type: 'regles', title: 'دساتير المؤشّرات الأربعة',
        summary: 'المدى بالفرق بين MAX و MIN ، الوسيط بـ MEDIANE ، المتوسط بـ MOYENNE ، والمنوال بـ MODE ، كلها على مجال السلسلة كاملة.',
        body: (
          <ul className="list-disc space-y-0.5 ps-5">
            {KNOW.four.map((l) => <li key={l}><M>{l}</M></li>)}
          </ul>
        ),
      },
      {
        id: 'manwal', type: 'concepts', title: 'المنوال',
        summary: 'منوال سلسلة هو القيمة ذات أكبر تكرار.',
        body: (
          <div className="space-y-1">
            <p><M>{EX7.questions[1]}</M></p>
            <p className="text-sm text-slate-600"><M>{EX7.answers.mode}</M></p>
          </div>
        ),
      },
      {
        id: 'iadat-hisab', type: 'concepts', title: 'المجدول يعيد الحساب',
        summary: 'إذا غيّرنا قيمة خلية أعاد المجدول حساب كل دستور وحده، أمّا العدد المكتوب باليد فلا يتغيّر. القيمة الكبيرة جدًّا تحرّك المتوسط ولا تحرّك الوسيط.',
        body: (
          <div className="space-y-1">
            <p><M>{EX7_OUTLIER.text}</M></p>
            <p className="text-sm"><M>{EX7_OUTLIER.mean}</M></p>
            <p className="text-sm"><M>{EX7_OUTLIER.median}</M></p>
            <p className="text-sm text-slate-600"><M>{EX7_OUTLIER.hand}</M></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tamthil-munasib', type: 'regles', title: 'التمثيل البياني المناسب',
        summary: 'المخطط بالأعمدة لقيم منفصلة، المخطط الدائري لتوزيع كلّ على أجزائه (زاوية القطاع تتناسب مع التكرار)، والمدرّج التكراري لفئات متلاصقة.',
        body: (
          <div className="space-y-1">
            <ul className="list-disc space-y-0.5 ps-5">
              {KNOW.charts.map((l) => <li key={l}><M>{l}</M></li>)}
            </ul>
            <p className="text-sm text-slate-600"><M>{EX15.answers.angles}</M></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'asmaa-dawal', type: 'memoriser', title: 'أسماء الدوال: الفرنسية والإنجليزية',
        summary: 'الكتاب يكتب MEDIANE و MOYENNE (مجدول بالفرنسية)؛ في مجدول بالإنجليزية تُكتب MEDIAN و AVERAGE وتحسب الشيء نفسه.',
        body: <p><M>{KNOW.names}</M></p>,
      },
    ],
    4: [
      {
        id: 'dhakira-hasiba', type: 'methodes', title: 'ذاكرة الحاسبة لحساب متوسط',
        summary: 'نضيف كل جداء القيمة في تكرارها إلى الذاكرة بـ M+ ، ثم نقسم ما يُظهره MR على التكرار الكلي.',
        body: <p><M>{CALC.rule}</M></p>,
      },
    ],
  },
};
