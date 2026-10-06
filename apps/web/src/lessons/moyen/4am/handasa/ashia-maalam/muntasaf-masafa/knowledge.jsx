import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, ACTIVITY_LINES, KNOW_MID, KNOW_DIST, KNOW_LINES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « إحداثيتا منتصف قطعة مستقيم والمسافة بين نقطتين في معلم » — SOURCE UNIQUE.
 *
 *   module 1 (تحدّ ونشاط 3 و 4)  muntasaf-murakkibat — J milieu de [KL] ⇔ KJ = JL : les deux vecteurs ont les mêmes
 *                                composantes (le نشاط 3 1) répondu sous le rendez-vous de l'élève) ;
 *   module 3 (معارف د و هـ)      ihdathiyata-muntasaf (la propriété du milieu et son exemple), masafa (la distance et son
 *                                exemple).
 * Le module 2 (الحالة العامة) DÉRIVE les deux formules par des questions ; il n'établit rien que le module 3 ne dise au mot près.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'muntasaf-murakkibat', type: 'concepts', title: 'المنتصف وتساوي شعاعين',
        summary: 'J منتصف القطعة [KL] يعني أن الشعاع KJ يساوي الشعاع JL، فلهما نفس المركبتين: نفس الحركة الأفقية ونفس الحركة العمودية من K إلى J ومن J إلى L.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY_LINES.kj}</MathText></p>
            <p><MathText>{ACTIVITY_LINES.conclusion}</MathText></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'ihdathiyata-muntasaf', type: 'regles', title: 'إحداثيتا منتصف قطعة',
        predictPrompt: 'في النشاط 3 كان دبّوس اللقاء بين $K(5\\,;\\,3)$ و $L(-3\\,;\\,1)$ هو $J(1\\,;\\,2)$ . لو أعطيناك طرفي أيّ قطعة $[AB]$ ، كيف تحسب فاصلة منتصفها وترتيبه من إحداثيتي $A$ و $B$ ؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كانت I منتصف القطعة [AB] فإن فاصلة I نصف مجموع فاصلتي A و B، وترتيب I نصف مجموع ترتيبي A و B.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW_MID.property}</MathText></p>
            <p className="text-slate-700"><MathText>{KNOW_MID.example}</MathText></p>
            <SourceTag source={KNOW_MID.source} />
          </div>
        ),
      },
      {
        id: 'masafa', type: 'regles', title: 'المسافة بين نقطتين',
        predictPrompt: 'في النشاط 4 بنيت درج الشوارع من $L(1\\,;\\,-2)$ إلى $K(5\\,;\\,1)$ : ضلعاه 4 و 3، والمسافة في خط مستقيم $KL = 5$ . كيف تحسب المسافة $AB$ بين أيّ نقطتين في معلم متعامد ومتجانس انطلاقًا من إحداثياتهما؟ اكتب القاعدة.',
        summary: 'في معلم متعامد ومتجانس، المسافة AB هي الجذر التربيعي لمجموع مربعي فرقي الإحداثيات: فرق الفاصلتين وفرق الترتيبين، وهي وتر مثلث قائم.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW_DIST.intro}</MathText> <MathText>{KNOW_DIST.property}</MathText></p>
            <p className="text-slate-700"><MathText>{KNOW_DIST.example}</MathText></p>
            <p className="text-slate-700"><MathText>{KNOW_LINES.exact}</MathText></p>
            <SourceTag source={KNOW_DIST.source} />
          </div>
        ),
      },
    ],
  },
};
