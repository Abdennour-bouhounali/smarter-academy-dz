import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, BALANCE_LINES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 1 « حل معادلة من الدرجة الأولى بمجهول واحد » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  muadala-tarafayn — la même opération sur les deux membres donne une
 *                      équation de même solution (ce que la balance vient de faire) ;
 *   module 2 (معارف 1) hal-ax-b — la propriété du livre : ax = b, a ≠ 0, solution b/a ;
 *   module 3 (طرائق)   tariqat-hal — la méthode des deux solutions de la p. 47.
 */
/** `memo` — la FICHE DE MÉMOIRE (MemoCard) : ce qui CHANGE est en rouge (`R`). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'muadala-tarafayn', type: 'concepts', title: 'العملية نفسها على الطرفين',
        memo: {
          rule: `\\begin{aligned}A&=B\\\\A${R('+c')}&=B${R('+c')}\\\\\\dfrac{A}{${R('k')}}&=\\dfrac{B}{${R('k')}}\\end{aligned}`,
          hook: 'العملية نفسها على الطرفين',
          example: `9x+1-1=-26-1`,
          trap: 'تغيير أحد الطرفين فقط',
          exam: 'أكتب العملية نفسها على الطرفين معًا',
          chip: `A=B\\Leftrightarrow A+c=B+c`,
          quiz: [
            { q: 'عند طرح $3$ من الطرف الأول نطرح من الطرف الثاني:', options: ['لا شيء', '$3$', '$-3$ بالإضافة'], correct: 1 },
            { q: 'نقسم طرفي المعادلة على $k$ بشرط:', options: ['$k = 0$', '$k \\neq 0$', '$k < 0$ فقط'], correct: 1 },
          ],
        },
        predictPrompt: 'على ميزان فاطمة انتقلت من $9x + 1 = -26$ إلى $9x = -27$ ثم إلى $x = -3$ ، وبقي الميزان متوازنًا في كل خطوة. ماذا يُسمح لك أن تفعل بطرفي معادلة دون أن يتغيّر العدد الذي في الكيس؟ اكتب القاعدة بكلماتك.',
        summary: 'نحصل على معادلة لها الحل نفسه إذا أجرينا العملية نفسها على طرفيها: نضيف العدد نفسه أو نطرحه، أو نقسم على العدد نفسه غير المعدوم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{BALANCE_LINES.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{BALANCE_LINES.fatima}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'hal-ax-b', type: 'regles', title: 'المعادلة ax = b',
        memo: {
          rule: `\\begin{aligned}ax&=b\\ (a\\neq0)\\\\x&=${R('\\dfrac{b}{a}')}\\end{aligned}`,
          hook: 'اقسم الطرف الثاني على المعامل',
          example: `x=\\tfrac{-27}{9}=-3`,
          trap: 'قسمة المعامل على الطرف الثاني بدل العكس',
          exam: 'أكتب الحل حاصل قسمة ثم أبسّطه',
          chip: `x=\\tfrac{b}{a}`,
          quiz: [
            { q: 'حلّ المعادلة $4x = 10$ هو:', options: ['$\\dfrac{4}{10}$', '$\\dfrac{5}{2}$', '$14$'], correct: 1 },
            { q: 'حلّ المعادلة $7x = -1$ هو:', options: ['$-7$', '$\\dfrac{1}{7}$', '$-\\dfrac{1}{7}$'], correct: 2 },
          ],
        },
        predictPrompt: 'في آخر خطوة وصلت إلى $9x = -27$ في ميزان فاطمة، وإلى $7x = -1$ في معادلة مصطفى. ما الشكل الذي تؤول إليه المعادلة دائمًا قبل الخطوة الأخيرة؟ وكيف تكتب حلّها بدلالة العددين اللذين فيها؟ وهل يوجد عدد لا يجوز أن يكون أمام $x$؟',
        summary: 'تؤول كل معادلة من الدرجة الأولى بمجهول واحد إلى معادلة من الشكل ax يساوي b حيث a غير معدوم، وحلّها الوحيد هو حاصل قسمة b على a.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.property}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.exampleLines.solution[2]}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-hal', type: 'methodes', title: 'طريقة: حل معادلة',
        memo: {
          rule: `\\begin{aligned}ax+b&=cx+d\\\\(a-c)x&=${R('d-b')}\\\\x&=\\dfrac{d-b}{a-c}\\end{aligned}`,
          hook: 'اجمع المجاهيل ثم اقسم',
          example: `2x=9\\to x=\\tfrac{9}{2}`,
          trap: 'نقل حدّ دون العملية على الطرفين',
          exam: 'أكتب كل عملية على الطرفين ثم أتحقّق بالتعويض',
          chip: `x=\\tfrac{d-b}{a-c}`,
          quiz: [
            { q: 'لحلّ $2x - 5 = 8$ نضيف إلى الطرفين:', options: ['$-5$', '$5$', '$8$'], correct: 1 },
            { q: 'حلّ $3x + 2 = 11$ هو:', options: ['$\\dfrac{13}{3}$', '$3$', '$\\dfrac{9}{2}$'], correct: 1 },
          ],
        },
        predictPrompt: 'قارن حلّي $2x - 5 = 8$ و $2{,}5x + 4{,}6 = 1{,}3x - 0{,}2$ سطرًا سطرًا. لو أعطيناك معادلة أخرى فيها $x$ في الطرفين، بأيّ خطوات تبدأ، وبأيّ خطوة تنتهي؟ اكتب الطريقة بكلماتك.',
        summary: 'ننقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر بإجراء العملية نفسها على الطرفين، نجمع الحدود المتشابهة، ثم نقسم على معامل المجهول.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.b.solution[2]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
