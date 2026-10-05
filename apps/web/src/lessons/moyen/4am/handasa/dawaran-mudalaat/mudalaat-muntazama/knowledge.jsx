import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, ACTIVITY_LINES, CHALLENGE, FORGE_LINE, KNOW5, METHOD_ANGLE, METHOD_CONSTRUCT, METHOD_SIDE, FORMAL_SOURCE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المضلعات المنتظمة وتطبيقاتها » — SOURCE UNIQUE.
 *
 *   module 1 (التحدّي ونشاط 5)  ruus-bidawaran — les sommets, images successives d'un sommet par (O, α) ; la figure se ferme
 *                               ⇔ n × α = 360° (le geste du lab, la réponse du تحدّ) ; muthallath-120 — le نشاط 5 ;
 *   module 2 (معارف 5)          tarif-muntazam, daira-muhita, markaziya-360, surat-mudalla ;
 *   module 3 (طرائق)            zawiyat-mudalla (108°, (n − 2)·180°/n), insha-mudalla (la construction par rotation),
 *                               dil-mudalla (le côté à partir du rayon).
 */
const Body = ({ lines, source }) => (
  <div className="space-y-1.5">
    {lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
    {source && <SourceTag source={source} />}
  </div>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'ruus-bidawaran', type: 'concepts', title: 'الرؤوس صور بالدوران',
        summary: 'رؤوس المضلع المنتظم ذي n ضلعا صور متتالية لرأس واحد بالدوران الذي مركزه مركز المضلع وزاويته α؛ والحلقة لا تنغلق على الرأس الأول إلا إذا كان جداء n في α دورة كاملة، أي 360 درجة.',
        body: (
          <div className="space-y-1.5">
            <Body lines={[FORGE_LINE.text, FORGE_LINE.open]} source={FORGE_LINE.source} />
            <Body lines={[CHALLENGE.idea]} source={CHALLENGE.source} />
          </div>
        ),
      },
      {
        id: 'muthallath-120', type: 'regles', title: 'المثلث المتقايس الأضلاع في دائرته',
        summary: 'في المثلث المتقايس الأضلاع المحاط بدائرة مركزها O، الزوايا المركزية الثلاث متقايسة وقيس كل منها 120 درجة، والدوران الذي مركزه O وزاويته 120 درجة يحوّل المثلث إلى نفسه.',
        body: (
          <div className="space-y-1.5">
            <Body lines={[ACTIVITY_LINES.a, ACTIVITY.closing]} source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tarif-muntazam', type: 'concepts', title: 'المضلع المنتظم',
        summary: 'المضلع المنتظم مضلع أضلاعه كلها لها نفس الطول وزواياه كلها متقايسة؛ الشرطان معا.',
        body: <Body lines={[KNOW5.definition]} source={KNOW5.source} />,
      },
      {
        id: 'daira-muhita', type: 'regles', title: 'الدائرة المحيطة ومركز المضلع',
        summary: 'توجد دائرة تشمل كل رؤوس المضلع المنتظم: الدائرة المحيطة به، ومركزها هو مركز المضلع المنتظم.',
        body: <Body lines={[KNOW5.p1]} source={KNOW5.source} />,
      },
      {
        id: 'markaziya-360', type: 'regles', title: 'الزاوية المركزية لمضلع منتظم',
        summary: 'الزوايا المركزية التي تحصر كل منها ضلعا في مضلع منتظم ذي n ضلعا متقايسة، وقيس كل منها 360 درجة مقسومة على n: 120 للمثلث، 90 للمربع، 60 للسداسي.',
        body: <Body lines={[KNOW5.p2, ...KNOW5.examples.map((e) => `${e.name}: ${e.formula}`)]} source={KNOW5.source} />,
      },
      {
        id: 'surat-mudalla', type: 'regles', title: 'المضلع صورة نفسه بالدوران',
        summary: 'إذا كان [AB] ضلعا في مضلع منتظم مركزه O، فإن صورة هذا المضلع بالدوران الذي مركزه O وزاويته AOB هي المضلع نفسه.',
        body: <Body lines={[KNOW5.p3]} source={KNOW5.source} />,
      },
    ],
    3: [
      {
        id: 'zawiyat-mudalla', type: 'methodes', title: 'زاوية المضلع المنتظم',
        summary: 'لحساب زاوية مضلع منتظم: الزاوية المركزية، ثم زاويتا قاعدة المثلث المتساوي الساقين الذي رأسه المركز، ثم نضاعف؛ للخماسي المنتظم 108 درجات، وفي الحالة العامة 180 درجة ناقص الزاوية المركزية.',
        body: (
          <div className="space-y-1.5">
            <Body lines={METHOD_ANGLE.solution} source={METHOD_ANGLE.source} />
            <Body lines={[METHOD_ANGLE.general]} source={FORMAL_SOURCE} />
          </div>
        ),
      },
      {
        id: 'insha-mudalla', type: 'methodes', title: 'إنشاء مضلع منتظم',
        summary: 'لإنشاء خماسي منتظم علم ضلعه: نبني رأسا جديدا صورة رأس بالدوران الذي مركزه رأس آخر وزاويته زاوية المضلع، ثم نجد المركز بتقاطع محوري ضلعين، ونكمل بالمدور. وإذا علمنا المركز فكل رأس صورة الذي قبله بالدوران الذي زاويته الزاوية المركزية.',
        body: (
          <div className="space-y-1.5">
            <Body lines={METHOD_CONSTRUCT.solution} source={METHOD_CONSTRUCT.source} />
            <Body lines={[FORGE_LINE.text]} source={FORGE_LINE.source} />
          </div>
        ),
      },
      {
        id: 'dil-mudalla', type: 'methodes', title: 'طول الضلع ونصف القطر',
        summary: 'طول ضلع مضلع منتظم من نصف قطر دائرته: في المثلث القائم الذي رأسه المركز ونصف الضلع، نستعمل النسب المثلثية؛ للمثلث المتقايس الأضلاع r جذر 3، للمربع r جذر 2، وللسداسي الضلع يساوي نصف القطر.',
        body: (
          <div className="space-y-1.5">
            <Body lines={METHOD_SIDE.solution} source={METHOD_SIDE.source} />
            <Body lines={[METHOD_SIDE.general]} source={FORMAL_SOURCE} />
          </div>
        ),
      },
    ],
  },
};
