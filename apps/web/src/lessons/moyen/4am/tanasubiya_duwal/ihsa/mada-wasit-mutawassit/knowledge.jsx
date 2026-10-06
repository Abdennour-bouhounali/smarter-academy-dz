import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACT3, ACT3_LINES, MEAN_REMINDER, ACT4_LINES, KNOW3, KNOW4, METHOD_1B, METHOD_2 } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مدى ووسيط ومتوسط سلسلة إحصائية » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 3)  mada-nashat (« يسمى هذا الفرق مدى »), mutawassit-mutawazin (rappel déclaré : le المتوسط
 *                      المتوازن, et sa lecture « point d'équilibre » du lab)
 *   module 2 (نشاط 4 + معارف)  mada (معارف 3), wasit (معارف 4), markaz-fia (le poids moyen par مراكز الفئات),
 *                      fia-wasitiya (la ملاحظة 3 de معارف 4)
 *   module 3 (طرائق)   wasit-rutba (la méthode des rangs), qiyam-mutatarrifa (3 et 43 : la moyenne bouge, pas la médiane)
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'mada-nashat', type: 'concepts', title: 'مدى سلسلة الرواتب',
        // Un NOM : la question du manuel le donne elle-même (« يسمى هذا الفرق مدى سلسلة الرواتب ») — rien à prédire.
        predict: false,
        summary: 'الفرق بين أكبر قيمة وأصغر قيمة في سلسلة يسمّى مداها: في نشاط 3 مدى الرواتب خمسة وأربعون ألف دينار.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACT3.q1}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACT3_LINES.salary}</MathText></p>
          </div>
        ),
      },
      {
        id: 'mutawassit-mutawazin', type: 'regles', title: 'المتوسط المتوازن',
        summary: 'المتوسط هو مجموع القيم مقسومًا على عددها؛ في جدول نضرب كل قيمة في تكرارها ثم نقسم على التكرار الكلّي. عنده تتوازن القيم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{MEAN_REMINDER.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{MEAN_REMINDER.balance}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'mada', type: 'concepts', title: 'مدى سلسلة إحصائية',
        summary: 'مدى سلسلة إحصائية هو الفرق بين أكبر قيمة وأصغر قيمة لها، ويعطي فكرة عن تشتّت قيمها.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOW3.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOW3.note}</MathText></p>
          </div>
        ),
      },
      {
        id: 'wasit', type: 'concepts', title: 'وسيط سلسلة إحصائية',
        summary: 'الوسيط قيمة تجزئ السلسلة المرتّبة إلى سلسلتين لهما نفس التكرار، وليس بالضرورة قيمة من قيم السلسلة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOW4.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOW4.notes[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'markaz-fia', type: 'methodes', title: 'المتوسط بمراكز الفئات',
        predictPrompt: 'الأوزان مجمّعة في فئات: نعرف فئة كل تلميذ، لا وزنه الدقيق. بأيّ عدد تعوّض كل فئة (مثلًا $34 \\le P < 38$) لتقدّر الوزن المتوسط للتلاميذ الـ 41؟ اكتب طريقتك خطوة بخطوة.',
        summary: 'في سلسلة مجمّعة في فئات نعوّض كل فئة بمركزها، نصف مجموع حدّيها، ثم نحسب المتوسط المتوازن: نحصل على تقدير للمتوسط.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACT4_LINES.centers}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACT4_LINES.weightsMean}</MathText></p>
          </div>
        ),
      },
      {
        id: 'fia-wasitiya', type: 'concepts', title: 'الفئة الوسيطية',
        // Un NOM déjà donné deux fois avant la brique (ملاحظات de معارف 4 à l'étape 3, مثال 2 juste avant) et
        // l'élève vient de choisir « الفئة الوسيطية » par son nom dans la question des 41 poids — rien à prédire.
        predict: false,
        summary: 'في سلسلة مجمّعة في فئات نبحث عن الفئة التي تشمل الوسيط وتسمّى الفئة الوسيطية؛ التكرارات المجمّعة الصاعدة تدلّ عليها.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOW4.notes[2]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACT4_LINES.medianClass}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'wasit-rutba', type: 'methodes', title: 'الوسيط بالرتب',
        predictPrompt: 'في رواتب العمال الـ 11 أخذت القيمة السادسة، وفي حرارة الوادي (10 قيم) منتصف القيمتين الخامسة والسادسة. لسلسلة مرتّبة من $57$ قيمة، ثم من $60$ قيمة: كيف تعيّن رتبة الوسيط دون كتابة كل القيم؟ اكتب الطريقة بدلالة عدد القيم $N$.',
        summary: 'نرتّب السلسلة: إذا كان التكرار الكلّي فرديًا فالوسيط القيمة ذات الرتبة الوسطى، وإذا كان زوجيًا فهو منتصف القيمتين اللتين في الوسط.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_2.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_2.solution[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qiyam-mutatarrifa', type: 'regles', title: 'قيمة بعيدة: المتوسط والوسيط',
        predictPrompt: 'أضفت إلى السلسلة القيمتين $3$ و $43$ وحسبت المؤشّرات الثلاثة من جديد. قارن المتوسط والوسيط والمدى قبل الإضافة وبعدها: ماذا تستنتج عن أثر قيمة بعيدة جدًّا في كل مؤشّر؟ ولماذا؟',
        summary: 'إضافة قيمة بعيدة جدًّا تغيّر المتوسط والمدى كثيرًا ولا تغيّر الوسيط إلّا قليلًا أو لا تغيّره: الوسيط يتعلّق بالرتب.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_1B.solution[0]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_1B.solution[1]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
