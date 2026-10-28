import React from 'react';
import MathText from '../../../../../common/components/MathText';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** Ce qui CHANGE dans une règle de la fiche `memo` (rouge). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/** Rappels seulement : une synthèse n'introduit rien (LESSON_CONTRACT : le test final ne doit rien introduire de neuf). */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'pgcd-taarif', type: 'regles', title: 'تذكير: القاسم المشترك الأكبر', summary: 'PGCD(a ; b) هو أكبر عدد يقسم a ويقسم b.',
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
        body: <p>القاسم المشترك الأكبر للعددين الطبيعيين <MathText>{'$a$'}</MathText> و <MathText>{'$b$'}</MathText> هو أكبر قاسم مشترك لهما، ونرمز إليه PGCD<MathText>{'$(a ; b)$'}</MathText>. وكل قاسم مشترك للعددين يقسم PGCD<MathText>{'$(a ; b)$'}</MathText>.</p> },
      { id: 'khwarizmiyat-iqlidus', type: 'methodes', title: 'تذكير: خوارزمية إقليدس', summary: 'قسمات متتابعة؛ PGCD هو آخر باقٍ غير معدوم.',
        memo: {
          rule: `\\mathrm{PGCD}(a\\ ;\\ b)=\\mathrm{PGCD}(b\\ ;\\ ${R('r')})`,
          hook: 'قسمات متتابعة حتى باقٍ معدوم',
          example: `\\mathrm{PGCD}(84\\ ;\\ 36)=\\mathrm{PGCD}(36\\ ;\\ ${R('12')})=12`,
          trap: 'أخذ الباقي المعدوم بدل آخر باقٍ غير معدوم',
          exam: 'أكتب كل قسمة إقليدية ثم أحدّد آخر باقٍ غير معدوم',
          chip: `\\mathrm{PGCD}(a\\ ;\\ b)=\\mathrm{PGCD}(b\\ ;\\ ${R('r')})`,
          quiz: [
            { q: '$84 = 36 \\times 2 + 12$. إذن $\\mathrm{PGCD}(84\\ ;\\ 36)$ يساوي:', options: ['$\\mathrm{PGCD}(2\\ ;\\ 12)$', '$\\mathrm{PGCD}(36\\ ;\\ 12)$', '$\\mathrm{PGCD}(84\\ ;\\ 2)$'], correct: 1 },
            { q: 'في خوارزمية إقليدس للعددين $84$ و $36$ كانت الباقيات $12$ ثم $0$. فإنّ $\\mathrm{PGCD}(84\\ ;\\ 36)$ هو:', options: ['$0$', '$36$', '$12$'], correct: 2 },
          ],
        },
        body: <p>نقسم الأكبر على الأصغر، ثم الأصغر على الباقي، وهكذا إلى أن نحصل على باقٍ معدوم: لأنّ PGCD<MathText>{'$(a ; b) = $'}</MathText> PGCD<MathText>{'$(b ; r)$'}</MathText>، فالقاسم المشترك الأكبر هو <strong>آخر باقٍ غير معدوم</strong>.</p> },
    ],
  },
};
