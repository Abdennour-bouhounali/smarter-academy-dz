import React from 'react';
import MathText from '../../../../../common/components/MathText';
import WordFraction from '../../../../../common/components/WordFraction';
import { SourceTag } from '../../../../../common/textbook';
import { ACT6, ACT6_LINES, ACT5, KNOW, METHOD_K, METHOD_ROOTS, METHOD_IMAGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « التكبير والتصغير وأثره على المقادير الفضائية » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 6)    takbir-tajribi — ce que les blocs et le نشاط 6 ont montré : arêtes × 3/5, aire × (3/5)², volume × (3/5)³ ;
 *   module 2 (معارف)      takbir-tarif (تعريف : k, تكبير / تصغير, la forme gardée), takbir-khassiya (k, k², k³),
 *                         maqta-tasghir (la section d'une pyramide / d'un cône parallèle à la base, نشاط 5) — معارف من المنصّة ;
 *   module 3 (طرائق)      tariqat-k (k depuis deux longueurs), tariqat-judhur (√ du rapport des aires, ∛ de celui des volumes),
 *                         tariqat-maqadir (les mesures de l'image sans recalcul) — طرائق من المنصّة.
 */
const Body = ({ lines, source, children }) => (
  <div className="space-y-1.5">
    {lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
    {children}
    <SourceTag source={source} />
  </div>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'takbir-tajribi', type: 'concepts', title: 'تصغير متوازي المستطيلات بالنسبة ثلاثة أخماس',
        summary: 'في النشاط 6 ضُربت أحرف متوازي المستطيلات في ثلاثة أخماس، فضُربت مساحته الكلية في مربع ثلاثة أخماس وحجمه في مكعب ثلاثة أخماس: 33,84 و 12,96.',
        body: <Body lines={[ACT6_LINES.dims, ACT6_LINES.checkA, ACT6_LINES.checkV]} source={ACT6.source} />,
      },
    ],
    2: [
      {
        id: 'takbir-tarif', type: 'concepts', title: 'التكبير والتصغير بالنسبة k',
        summary: 'مجسّم تكبير أو تصغير لآخر بالنسبة k إذا ضُرب كل طول منه في نفس العدد k؛ إذا كان k أكبر من 1 فهو تكبير، وإذا كان بين 0 و 1 فهو تصغير، والشكل لا يتغيّر.',
        body: (
          <Body lines={[KNOW.definition]} source={KNOW.source}>
            <p><WordFraction lhs="$k$" num={KNOW.ratioNum} den={KNOW.ratioDen} /></p>
            <p><MathText>{KNOW.shape}</MathText></p>
          </Body>
        ),
      },
      {
        id: 'takbir-khassiya', type: 'regles', title: 'الأطوال والمساحات والحجوم',
        summary: 'في تكبير أو تصغير بالنسبة k تُضرب الأطوال في k، والمساحات في مربع k، والحجوم في مكعب k.',
        body: <Body lines={[KNOW.property, KNOW.formulas]} source={KNOW.source} />,
      },
      {
        id: 'maqta-tasghir', type: 'regles', title: 'مقطع الهرم والمخروط تصغير',
        summary: 'مقطع هرم أو مخروط دوران بمستو يوازي قاعدته تصغير لقاعدته، والهرم الصغير الذي له نفس الرأس تصغير للهرم الأصلي.',
        body: <Body lines={[KNOW.section, ACT5.reduction]} source={KNOW.source} />,
      },
    ],
    3: [
      {
        id: 'tariqat-k', type: 'methodes', title: 'إيجاد نسبة التكبير أو التصغير',
        summary: 'نقسم طولا من المجسّم الناتج على الطول الموافق له في المجسّم الأصلي، بنفس الوحدة.',
        body: <Body lines={[METHOD_K.rule]} source={METHOD_K.source} />,
      },
      {
        id: 'tariqat-judhur', type: 'methodes', title: 'من نسبة المساحات أو الحجوم إلى k',
        summary: 'نسبة مساحتين تساوي مربع k فنأخذ جذرها التربيعي، ونسبة حجمين تساوي مكعب k فنبحث عن العدد الذي مكعبه هذه النسبة.',
        body: <Body lines={[METHOD_ROOTS.rule]} source={METHOD_ROOTS.source} />,
      },
      {
        id: 'tariqat-maqadir', type: 'methodes', title: 'حساب مقادير المجسّم الناتج',
        summary: 'نضرب الأطوال في k والمساحات في مربع k والحجوم في مكعب k، دون إعادة حساب الأبعاد.',
        body: <Body lines={[METHOD_IMAGE.rule]} source={METHOD_IMAGE.source} />,
      },
    ],
  },
};
