import React from 'react';
import MathText from '../../../../../common/components/MathText';
import SpaceFigure from '../../../../../common/components/SpaceFigure';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW3, KNOW_APEX, METHOD_RADIUS, METHOD_CYLINDER } from './content/textbook';
import { FIG_KNOW3_IN, FIG_KNOW_CONE } from './content/figures';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المقاطع المستوية للمجسمات المألوفة » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 2)          maqta-tajribi — les couches de la sphère imprimées par l'élève : un cercle qui rétrécit quand
 *                              le plan s'éloigne de O, un point au pôle (la conclusion du نشاط 2) ;
 *   module 2 (معارف 3 + ajout) maqta-kura (أ : la propriété et ses quatre cas), maqta-balata (ب : face, arête — titre rétabli),
 *                              maqta-ustuwana (جـ : base, axe), maqta-haram (د : pyramide et cône — معارف من المنصّة) ;
 *   module 3 (طرائق ص 169)     tariqat-nisf-qutr (Pythagore dans OO′M), tariqat-ustuwana (la largeur 2√(r² − d²) — نشاط 4 et
 *                              دوري الآن, écrite par la plateforme).
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
        id: 'maqta-tajribi', type: 'concepts', title: 'طبقات الكرة',
        predictPrompt: 'طبعتَ طبقات الكرة التي نصف قطرها 3 عند $x = 0$ ثم $1{,}25$ ثم $2$ ثم $2{,}8$ ثم $x = 3$ . ماذا تستنتج: ما شكل كل طبقة، وكيف تتغيّر كلما ابتعد المستوي عن المركز O، وماذا تطبع الطابعة عند القطب N؟',
        summary: 'كل طبقة تطبعها الطابعة مقطع للكرة بمستو: دائرة تصغر كلما ابتعد المستوي عن المركز، ونقطة واحدة عندما يمسّ المستوي الكرة.',
        body: <Body lines={[ACTIVITY.closing]} source={ACTIVITY.source} />,
      },
    ],
    2: [
      {
        id: 'maqta-kura', type: 'regles', title: 'مقطع كرة بمستو',
        predictPrompt: 'في نشاط 2 كتبت $IM^2 = 9 - x^2$ لكرة نصف قطرها 3، وطبعت طبقات عند $x = 0$ و $x = 3$ وبينهما. لكرة مركزها O ونصف قطرها R ومستو يبعد عن O بالمسافة h: ما مقطع الكرة بهذا المستوي، وكيف تحسب نصف قطره؟ ميّز الحالات بمقارنة h بـ R.',
        summary: 'مقطع كرة مركزها O ونصف قطرها R بمستو عمودي على قطرها [NS] في A ويبعد عن O بالمسافة h: دائرة مركزها A ونصف قطرها جذر الفرق بين مربعي R و h إذا كان h أصغر من R، دائرة كبرى إذا كان h معدوما، نقطة تماس إذا كان h يساوي R، ولا شيء إذا كان h أكبر من R.',
        body: (
          <Body lines={[KNOW3.property, KNOW3.setup, KNOW3.inside, KNOW3.zero, KNOW3.tangent, KNOW3.outside]} source={KNOW3.source}>
            <SpaceFigure {...FIG_KNOW3_IN} />
          </Body>
        ),
      },
      {
        id: 'maqta-balata', type: 'regles', title: 'مقطع بلاطة قائمة بمستو',
        predictPrompt: 'في نشاط 3 قطعت البلاطة التي أبعادها $25$ و $20$ و $6$ بمستو يوازي الوجه CBFG، ثم بمستو يوازي الحرف $[CG]$ الذي طوله $6$ . اكتب القاعدة: ما طبيعة المقطع في كل حالة، وبماذا ترتبط أبعاده؟',
        summary: 'مقطع بلاطة قائمة بمستو موازٍ لأحد أوجهها مستطيل له نفس بعدي ذلك الوجه، وبمستو موازٍ لأحد أحرفها مستطيل طوله أو عرضه يساوي طول ذلك الحرف.',
        body: <Body lines={[KNOW3.cuboidFace, KNOW3.cuboidEdge]} source={KNOW3.source} />,
      },
      {
        id: 'maqta-ustuwana', type: 'regles', title: 'مقطعا أسطوانة الدوران',
        predictPrompt: 'في نشاط 4 قطعت الأسطوانة التي نصف قطرها $1{,}7$ وارتفاعها $6$ بمستو يوازي قاعدتها، ثم بمستو يوازي محورها. اكتب القاعدة: ما طبيعة المقطع في كل حالة، وأيّ بعد من أبعاده تعرفه دون حساب؟',
        summary: 'مقطع أسطوانة دوران بمستو موازٍ لقاعدتها دائرة لها نفس نصف قطر القاعدة ومركزها على المحور، وبمستو موازٍ لمحورها مستطيل طوله أو عرضه ارتفاع الأسطوانة.',
        body: <Body lines={[KNOW3.cylinderBase, KNOW3.cylinderAxis]} source={KNOW3.source} />,
      },
      {
        id: 'maqta-haram', type: 'regles', title: 'مقطع الهرم والمخروط',
        predictPrompt: 'في نشاط 5 قطعت الهرم SABCD الذي ضلع قاعدته $4$ بمستو يوازي القاعدة حيث $\\dfrac{SE}{SA} = \\dfrac{3}{4}$ ، فوجدت الرباعي EFGH. لهرم أو مخروط يقطعه مستو يوازي قاعدته: ما علاقة المقطع بالقاعدة، وكيف تحسب أبعاده؟ اكتب القاعدة.',
        summary: 'مقطع هرم أو مخروط دوران بمستو موازٍ لقاعدته تصغير لهذه القاعدة: إذا قطع المستوي الحرف [SA] في E فنسبة التصغير k تساوي SE على SA، والأضلاع أو نصف القطر تُضرب في k.',
        body: (
          <Body lines={[KNOW_APEX.pyramid, KNOW_APEX.cone]} source={KNOW_APEX.source}>
            <p className="font-semibold"><MathText>{'E نقطة تقاطع المستوي مع الحرف $[SA]$ : نسبة التصغير $k = \\dfrac{SE}{SA}$ تبدأ من الرأس S.'}</MathText></p>
            <SpaceFigure {...FIG_KNOW_CONE} />
          </Body>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-nisf-qutr', type: 'methodes', title: 'نصف قطر مقطع كرة',
        predictPrompt: 'كرة مركزها O ونصف قطرها $2{,}5\\,\\mathrm{cm}$ يقطعها مستو (P) وفق دائرة مركزها O′ حيث $OO\' = 1{,}5\\,\\mathrm{cm}$ (الشكل). كما حسبت $IM^2$ في نشاط 2: بأيّ خطوات تحسب نصف قطر هذه الدائرة؟ اكتب الطريقة: أيّ نقطة تختار، وفي أيّ مثلث تعمل، وبأيّ خاصية؟',
        summary: 'لحساب نصف قطر مقطع كرة بمستو لا يمر بمركزها نطبّق خاصية فيثاغورس في المثلث القائم الذي رؤوسه مركز الكرة ومركز المقطع ونقطة من المقطع.',
        body: <Body lines={[METHOD_RADIUS.rule, METHOD_RADIUS.solution[2], METHOD_RADIUS.solution[3]]} source={METHOD_RADIUS.source} />,
      },
      {
        id: 'tariqat-ustuwana', type: 'methodes', title: 'عرض مقطع أسطوانة',
        predictPrompt: 'في نشاط 4 (نصف القطر $1{,}7$ والمستوي على بعد $0{,}8$ من المحور) وجدت عرض المقطع $3$ ، وفي دوري الآن (نصف القطر $2$ والبعد $1$) وجدت $2\\sqrt{3}$ . لأسطوانة نصف قطرها r يقطعها مستو يوازي محورها على بعد d منه: بأيّ خطوات تحسب بعدي المقطع؟ اكتب الطريقة.',
        summary: 'مقطع أسطوانة دوران بمستو موازٍ لمحورها يبعد عنه بـ d مستطيل: أحد بعديه الارتفاع، والآخر وتر في القاعدة نحسب نصفه بخاصية فيثاغورس.',
        body: <Body lines={[METHOD_CYLINDER.rule]} source={METHOD_CYLINDER.source} />,
      },
    ],
  },
};
