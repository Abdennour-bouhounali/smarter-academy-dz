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
          example: `\\mathrm{PGCD}(40\\ ;\\ 56)=${R('8')}`,
          trap: 'أخذ أكبر قاسم لأحد العددين فقط: أكبر قاسم للعدد 56 هو 56 نفسه',
          exam: 'أكتب قواسم كل عدد، ثم أحدّد القواسم المشتركة، ثم أختار أكبرها',
          chip: `\\mathrm{PGCD}(a\\ ;\\ b)=${R('g')}`,
          // des nombres NEUFS (recette de la synthèse : aucun couple d'une leçon de l'unité ni du défi — content/mission.test.js)
          quiz: [
            { q: 'القواسم المشتركة للعددين $40$ و $56$ هي $1 , 2 , 4 , 8$. فإنّ $\\mathrm{PGCD}(40\\ ;\\ 56)$ هو:', options: ['$4$', '$8$', '$56$'], correct: 1 },
            { q: 'القاسم المشترك الأكبر للعددين $63$ و $42$ هو:', options: ['$21$', '$7$', '$42$'], correct: 0 },
          ],
        },
        body: <p>القاسم المشترك الأكبر للعددين الطبيعيين <MathText>{'$a$'}</MathText> و <MathText>{'$b$'}</MathText> هو أكبر قاسم مشترك لهما، ونرمز إليه PGCD<MathText>{'$(a ; b)$'}</MathText>. وكل قاسم مشترك للعددين يقسم PGCD<MathText>{'$(a ; b)$'}</MathText>.</p> },
      { id: 'khwarizmiyat-iqlidus', type: 'methodes', title: 'تذكير: خوارزمية إقليدس', summary: 'قسمات متتابعة؛ PGCD هو آخر باقٍ غير معدوم.',
        memo: {
          rule: `\\mathrm{PGCD}(a\\ ;\\ b)=\\mathrm{PGCD}(b\\ ;\\ ${R('r')})`,
          hook: 'قسمات متتابعة حتى باقٍ معدوم',
          example: `\\mathrm{PGCD}(75\\ ;\\ 30)=\\mathrm{PGCD}(30\\ ;\\ ${R('15')})=15`,
          trap: 'أخذ الباقي المعدوم بدل آخر باقٍ غير معدوم',
          exam: 'أكتب كل قسمة إقليدية ثم أحدّد آخر باقٍ غير معدوم',
          chip: `\\mathrm{PGCD}(a\\ ;\\ b)=\\mathrm{PGCD}(b\\ ;\\ ${R('r')})`,
          quiz: [
            { q: '$75 = 30 \\times 2 + 15$. إذن $\\mathrm{PGCD}(75\\ ;\\ 30)$ يساوي:', options: ['$\\mathrm{PGCD}(2\\ ;\\ 15)$', '$\\mathrm{PGCD}(30\\ ;\\ 15)$', '$\\mathrm{PGCD}(75\\ ;\\ 2)$'], correct: 1 },
            { q: 'في خوارزمية إقليدس للعددين $75$ و $30$ كانت الباقيات $15$ ثم $0$. فإنّ $\\mathrm{PGCD}(75\\ ;\\ 30)$ هو:', options: ['$0$', '$30$', '$15$'], correct: 2 },
          ],
        },
        body: <p>نقسم الأكبر على الأصغر، ثم الأصغر على الباقي، وهكذا إلى أن نحصل على باقٍ معدوم: لأنّ PGCD<MathText>{'$(a ; b) = $'}</MathText> PGCD<MathText>{'$(b ; r)$'}</MathText>، فالقاسم المشترك الأكبر هو <strong>آخر باقٍ غير معدوم</strong>.</p> },
    ],
  },
};
