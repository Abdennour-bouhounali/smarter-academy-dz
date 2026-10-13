import React from 'react';
import MathText from '../../../../../common/components/MathText';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** Rappels seulement : une synthèse n'introduit rien (LESSON_CONTRACT : le test final ne doit rien introduire de neuf). */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'pgcd-taarif', type: 'regles', title: 'تذكير: القاسم المشترك الأكبر', summary: 'PGCD(a ; b) هو أكبر عدد يقسم a ويقسم b.',
        body: <p>القاسم المشترك الأكبر للعددين الطبيعيين <MathText>{'$a$'}</MathText> و <MathText>{'$b$'}</MathText> هو أكبر قاسم مشترك لهما، ونرمز إليه PGCD<MathText>{'$(a ; b)$'}</MathText>. وكل قاسم مشترك للعددين يقسم PGCD<MathText>{'$(a ; b)$'}</MathText>.</p> },
      { id: 'khwarizmiyat-iqlidus', type: 'methodes', title: 'تذكير: خوارزمية إقليدس', summary: 'قسمات متتابعة؛ PGCD هو آخر باقٍ غير معدوم.',
        body: <p>نقسم الأكبر على الأصغر، ثم الأصغر على الباقي، وهكذا إلى أن نحصل على باقٍ معدوم: لأنّ PGCD<MathText>{'$(a ; b) = $'}</MathText> PGCD<MathText>{'$(b ; r)$'}</MathText>، فالقاسم المشترك الأكبر هو <strong>آخر باقٍ غير معدوم</strong>.</p> },
    ],
  },
};
