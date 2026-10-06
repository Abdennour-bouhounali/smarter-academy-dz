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
        predictPrompt: 'في المختبر صغّرت متوازي المستطيلات $5 \\times 4 \\times 3$ بالنسبة $\\dfrac{3}{5}$ : صارت أحرفه $3$ و $2{,}4$ و $1{,}8$ ، وصار كل مكعّب من المكعبات الستين مكعّبا صغيرا حرفه $0{,}6$ . بأيّ عدد تتوقّع أن تُضرب المساحة الكلية؟ وبأيّ عدد يُضرب الحجم؟ اكتبهما بدلالة $\\dfrac{3}{5}$ وعلّل بالمكعبات.',
        summary: 'في النشاط 6 ضُربت أحرف متوازي المستطيلات في ثلاثة أخماس، فضُربت مساحته الكلية في مربع ثلاثة أخماس وحجمه في مكعب ثلاثة أخماس: 33,84 و 12,96.',
        body: <Body lines={[ACT6_LINES.dims, ACT6_LINES.checkA, ACT6_LINES.checkV]} source={ACT6.source} />,
      },
    ],
    2: [
      {
        id: 'takbir-tarif', type: 'concepts', title: 'التكبير والتصغير بالنسبة k',
        predictPrompt: 'في لعبة البناء صغّرت متوازي المستطيلات بالنسبة $\\dfrac{3}{5}$ ثم كبّرته بالنسبة $2$ ، ورأيت أنّ «إضافة $1\\,\\mathrm{cm}$ لكل حرف» تغيّر شكله. متى نقول إنّ مجسّما تكبير أو تصغير لمجسّم آخر بالنسبة $k$؟ وكيف نعرف من $k$ وحده هل هو تكبير أم تصغير؟ اكتب التعريف بكلماتك.',
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
        predictPrompt: 'مع $k = \\dfrac{3}{5}$ ضُرب حجم متوازي المستطيلات في $\\dfrac{27}{125}$ ، ومع $k = 2$ صارت المكعبات الستون $480$ مكعّبا وصارت المساحة $94$ تساوي $376$ . عمّم لنسبة $k$ كيفما كانت: بأيّ عدد تُضرب الأطوال؟ والمساحات؟ والحجوم؟ اكتب القاعدة بدلالة $k$.',
        summary: 'في تكبير أو تصغير بالنسبة k تُضرب الأطوال في k، والمساحات في مربع k، والحجوم في مكعب k.',
        body: <Body lines={[KNOW.property, KNOW.formulas]} source={KNOW.source} />,
      },
      {
        id: 'maqta-tasghir', type: 'regles', title: 'مقطع الهرم والمخروط تصغير',
        predictPrompt: 'في الهرم $SABCD$ وجدت $EF = 3$ لمّا كان $SE = \\dfrac{3}{4}SA$ ، ومساحة $EFGH$ تساوي $9$ بينما مساحة القاعدة $16$ . لو قطعنا أيّ هرم أو مخروط دوران بمستو يوازي قاعدته: ماذا يكون المقطع بالنسبة إلى القاعدة؟ وماذا يكون الهرم الصغير الذي رأسه $S$ بالنسبة إلى الهرم الأصلي، وبأيّ نسبة؟ اكتب القاعدة.',
        summary: 'مقطع هرم أو مخروط دوران بمستو يوازي قاعدته تصغير لقاعدته، والهرم الصغير الذي له نفس الرأس تصغير للهرم الأصلي.',
        body: <Body lines={[KNOW.section, ACT5.reduction]} source={KNOW.source} />,
      },
    ],
    3: [
      {
        id: 'tariqat-k', type: 'methodes', title: 'إيجاد نسبة التكبير أو التصغير',
        predictPrompt: 'في النشاط 6 أعطيناك $k = \\dfrac{3}{5}$ فوجدت أنّ الحرف $5\\,\\mathrm{cm}$ صار $3\\,\\mathrm{cm}$ . افترض العكس: تعرف الطولين $5$ و $3$ ولا تعرف $k$. كيف تجده؟ وماذا تفعل إذا كان أحد الطولين بالمتر والآخر بالسنتيمتر؟ اكتب الطريقة.',
        summary: 'نقسم طولا من المجسّم الناتج على الطول الموافق له في المجسّم الأصلي، بنفس الوحدة.',
        body: <Body lines={[METHOD_K.rule]} source={METHOD_K.source} />,
      },
      {
        id: 'tariqat-judhur', type: 'methodes', title: 'من نسبة المساحات أو الحجوم إلى k',
        predictPrompt: 'في النشاط 6 كانت النسبة $\\dfrac{3}{5}$ ، فضُربت المساحة الكلية في $\\dfrac{9}{25}$ والحجم في $\\dfrac{27}{125}$ . لو أعطيناك نسبة مساحتين فقط، أو نسبة حجمين فقط، كيف تجد $k$ في كل حالة؟ اكتب الطريقة.',
        summary: 'نسبة مساحتين تساوي مربع k فنأخذ جذرها التربيعي، ونسبة حجمين تساوي مكعب k فنبحث عن العدد الذي مكعبه هذه النسبة.',
        body: <Body lines={[METHOD_ROOTS.rule]} source={METHOD_ROOTS.source} />,
      },
      {
        id: 'tariqat-maqadir', type: 'methodes', title: 'حساب مقادير المجسّم الناتج',
        predictPrompt: 'في آخر خطوة من النشاط وجدت حجم متوازي المستطيلات المكبَّر بالنسبة $2$ ومساحته الكلية دون أن تعيد حساب أبعاده. لمجسّم تعرف أحد أطواله ومساحته وحجمه، ونسبة $k$ : بأيّ خطوات تحسب مقادير المجسّم الناتج مباشرة؟ اكتب الطريقة.',
        summary: 'نضرب الأطوال في k والمساحات في مربع k والحجوم في مكعب k، دون إعادة حساب الأبعاد.',
        body: <Body lines={[METHOD_IMAGE.rule]} source={METHOD_IMAGE.source} />,
      },
    ],
  },
};
