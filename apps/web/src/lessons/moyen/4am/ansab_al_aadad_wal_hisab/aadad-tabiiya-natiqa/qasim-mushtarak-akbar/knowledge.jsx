import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE_3, KNOWLEDGE_4 } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** Ce qui CHANGE dans une règle de la fiche `memo` (rouge). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qawasim-mushtaraka', type: 'concepts', title: 'القواسم المشتركة لعددين',
        memo: {
          rule: `${R('d')}\\mid a\\ \\wedge\\ ${R('d')}\\mid b`,
          hook: 'يقسم العددين معًا',
          example: `${R('9')}\\mid90\\ \\wedge\\ ${R('9')}\\mid54`,
          trap: 'عدد يقسم أحد العددين فقط ليس قاسمًا مشتركًا: 5 يقسم 90 ولا يقسم 54',
          exam: 'أتحقّق من قسمة العددين كليهما قبل أن أقول إنّ القاسم مشترك',
          chip: `d\\mid a\\ \\wedge\\ d\\mid b`,
          quiz: [
            { q: 'أيّ عدد قاسم مشترك للعددين $12$ و $18$؟', options: ['$4$', '$6$', '$9$'], correct: 1 },
            { q: '$5$ يقسم $90$ ولا يقسم $54$. هل هو قاسم مشترك لهما؟', options: ['نعم، لأنّه يقسم $90$', 'نعم، لأنّه أصغر من $54$', 'لا، لأنّه لا يقسم $54$'], correct: 2 },
          ],
        },
        predictPrompt: 'في الباقات: مع 9 باقات دخلت كل الزهور، الحمراء (90) والبيضاء (54)؛ ومع 5 باقات دخلت كل الحمراء لكن بقيت 4 زهور بيضاء خارجها. متى نقول إنّ عددًا قاسم «مشترك» لعددين $a$ و $b$؟ اكتب القاعدة بكلماتك.', summary: 'الأعداد غير المعدومة التي تقسم العددين في آن واحد.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE_3.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE_3.example}</MathText></p></div> },
    ],
    2: [
      { id: 'pgcd-taarif', type: 'concepts', title: 'القاسم المشترك الأكبر',
        memo: {
          rule: `\\mathrm{PGCD}(a\\ ;\\ b)=${R('\\max\\bigl(D_a\\cap D_b\\bigr)')}`,
          hook: 'أكبر قاسم يقسم العددين معًا',
          example: `\\mathrm{PGCD}(28\\ ;\\ 42)=${R('14')}`,
          trap: 'أخذ أكبر قاسم لأحد العددين فقط: أكبر قاسم للعدد 42 هو 42 نفسه',
          exam: 'أكتب قواسم كل عدد، ثم أحدّد القواسم المشتركة، ثم أختار أكبرها',
          chip: `\\mathrm{PGCD}(a\\ ;\\ b)=${R('g')}`,
          quiz: [
            { q: 'القواسم المشتركة للعددين $28$ و $42$ هي $1 , 2 , 7 , 14$. فإنّ $\\mathrm{PGCD}(28\\ ;\\ 42)$ هو:', options: ['$7$', '$14$', '$42$'], correct: 1 },
            { q: 'القاسم المشترك الأكبر للعددين $90$ و $54$ هو:', options: ['$18$', '$9$', '$54$'], correct: 0 },
          ],
        },
        predictPrompt: 'مع 90 و 54 كان أكبر عدد ممكن من الباقات 18، ومع 28 و 42 كشفت القواسم المشتركة 1 ، 2 ، 7 ، 14. كيف تعرّف «القاسم المشترك الأكبر» لعددين $a$ و $b$؟ اكتب التعريف بكلماتك.', summary: 'أكبر قاسم مشترك لعددين؛ الرمز PGCD (a ; b).',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE_4.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE_4.example}</MathText></p></div> },
      { id: 'pgcd-ramz', type: 'vocabulaire', title: 'الرمز PGCD (a ; b)', summary: 'نكتب PGCD(28 ; 42) = 14.',
        memo: {
          rule: `\\mathrm{PGCD}(${R('a')}\\ ;\\ ${R('b')})=\\mathrm{PGCD}(${R('b')}\\ ;\\ ${R('a')})`,
          hook: 'الرمز يُقرأ: القاسم المشترك الأكبر',
          example: `\\mathrm{PGCD}(28\\ ;\\ 42)=${R('14')}`,
          trap: 'وضع الناتج بين القوسين ووضع العددين بعد المساواة',
          exam: 'أكتب الرمز مع العددين بين القوسين، ثم النتيجة بعد علامة المساواة',
          chip: `\\mathrm{PGCD}(a\\ ;\\ b)`,
          quiz: [
            { q: 'نكتب أنّ القاسم المشترك الأكبر للعددين $28$ و $42$ هو $14$ هكذا:', options: ['$\\mathrm{PGCD}(14\\ ;\\ 28)=42$', '$\\mathrm{PGCD}(28\\ ;\\ 42)=14$', '$\\mathrm{PGCD}(28\\ ;\\ 42)=\\frac{28}{42}$'], correct: 1 },
            { q: '$\\mathrm{PGCD}(42\\ ;\\ 28)$ يساوي:', options: ['$1176$', '$70$', '$14$'], correct: 2 },
          ],
        },
        body: <p>الرمز <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b)$'}</MathText> يُقرأ «القاسم المشترك الأكبر للعددين a و b». مثال: <MathText>{'$\\mathrm{PGCD}(28\\ ;\\ 42) = 14$'}</MathText>.</p> },
      { id: 'qawasim-al-pgcd', type: 'regles', title: 'القواسم المشتركة هي قواسم PGCD',
        memo: {
          rule: `d\\mid a\\ \\wedge\\ d\\mid b\\iff d\\mid ${R('\\mathrm{PGCD}(a\\ ;\\ b)')}`,
          hook: 'كل قاسم مشترك يقسم الأكبر',
          example: `\\mathrm{PGCD}(28\\ ;\\ 42)=${R('14')}\\ ,\\ 7\\mid${R('14')}`,
          trap: 'نسيان أنّ القواسم المشتركة كلّها قواسم للقاسم المشترك الأكبر: 7 يقسم 14',
          exam: 'أُعلّل: كل قاسم مشترك يقسم القاسم المشترك الأكبر',
          chip: `d\\mid ${R('g')}`,
          quiz: [
            { q: '$\\mathrm{PGCD}(28\\ ;\\ 42)=14$. أيّ عدد من الآتية قاسم مشترك للعددين؟', options: ['$4$', '$28$', '$7$'], correct: 2 },
            { q: '$\\mathrm{PGCD}(90\\ ;\\ 54)=18$. القواسم المشتركة للعددين هي:', options: ['$1 , 2 , 3 , 6 , 9 , 18 , 27 , 54$', '$1 , 2 , 3 , 5 , 6 , 9 , 10 , 15 , 18 , 30 , 45 , 90$', '$1 , 2 , 3 , 6 , 9 , 18$'], correct: 2 },
          ],
        },
        predictPrompt: 'القواسم المشتركة للعددين 28 و 42 هي 1 ، 2 ، 7 ، 14، و $\\mathrm{PGCD}(28\\ ;\\ 42) = 14$. ما العلاقة بين كل عدد من هذه القائمة والعدد 14؟ وهل تجد العلاقة نفسها مع 90 و 54 (القواسم المشتركة 1 ، 2 ، 3 ، 6 ، 9 ، 18)؟ اكتب القاعدة.', summary: 'مجموعة القواسم المشتركة لعددين = مجموعة قواسم قاسمهما المشترك الأكبر.',
        body: <p><MathText>{KNOWLEDGE_4.remark}</MathText></p> },
    ],
  },
};
