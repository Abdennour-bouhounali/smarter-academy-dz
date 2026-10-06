import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_LINES, KNOWLEDGE, METHOD_DRAW, METHOD_AB, METHOD_READ } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 2 « التمثيل البياني لدالة تآلفية وقراءته بيانيًا » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 3)   irtifa-b (س 1 ب : (d′) est (d) montée de b), tartib-mabda (س 2 ب et « نسمّي … »)
 *   module 2 (معارف)    tamthil-taalufi (la propriété), muamil-tawjih (a, la marche et le sens),
 *                       rasm-taalufi (deux points suffisent) — écrits par la plateforme
 *   module 3 (القراءة)  qiraa-ab (lire b puis a, écrire f(x)), qiraa-sura-taalufi (image / antécédent)
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'irtifa-b', type: 'concepts', title: 'المستقيم المرفوع بـ b',
        predictPrompt: 'بالمسبار قرأت عند الفاصلة 2 ترتيبين: 3 على $(d)$ و 4 على $(d\')$. جرّب فواصل أخرى، ثم اكتب القاعدة بكلماتك: كيف تنتقل من ترتيب نقطة من $(d)$ إلى ترتيب النقطة من $(d\')$ التي لها نفس الفاصلة، أيًّا كانت هذه الفاصلة؟',
        summary: 'ترتيب نقطة من تمثيل الدالة التآلفية يساوي ترتيب النقطة التي لها نفس الفاصلة من تمثيل الدالة الخطية ذات المعامل نفسه، مضافًا إليه b: المستقيم كلّه مرفوع بـ b.',
        body: <p><MathText>{ACTIVITY_LINES.rule}</MathText></p>,
      },
      {
        id: 'tartib-mabda', type: 'vocabulaire', title: 'الترتيب عند المبدأ',
        summary: 'صورة العدد 0 بالدالة التآلفية هي العدد b، فالنقطة التي فاصلتها 0 وترتيبها b تنتمي إلى تمثيلها؛ نسمّي b الترتيب عند المبدأ.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY_LINES.general}</MathText></p>
            <p className="font-semibold"><MathText>{ACTIVITY.naming}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tamthil-taalufi', type: 'concepts', title: 'التمثيل البياني لدالة تآلفية',
        predictPrompt: 'في النشاط 3 رفعت تمثيل $x \\longmapsto \\dfrac{3}{2}x$ بـ 1 فصار $(d\')$ ، ورأيته يقطع محور التراتيب في $(0 ; 1)$. لدالة تآلفية أيًّا كانت $x \\longmapsto ax + b$ : ما شكل تمثيلها؟ ما علاقته بتمثيل $x \\longmapsto ax$ ؟ ومتى يشمل المبدأ O؟ اكتب ما تستنتجه.',
        summary: 'التمثيل البياني لدالة تآلفية مستقيم يقطع محور التراتيب في النقطة التي ترتيبها b، ويوازي تمثيل الدالة الخطية ذات المعامل a؛ ولا يشمل المبدأ إلا إذا كان b معدومًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.property}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.special}</MathText></p>
          </div>
        ),
      },
      {
        id: 'muamil-tawjih', type: 'regles', title: 'معامل التوجيه',
        summary: 'العدد a معامل توجيه المستقيم: ما يصعده المستقيم عندما نتقدّم وحدة واحدة إلى اليمين؛ يصعد إذا كان a موجبًا وينزل إذا كان سالبًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.names}</MathText></p>
            <p><MathText>{KNOWLEDGE.slope}</MathText></p>
          </div>
        ),
      },
      {
        id: 'rasm-taalufi', type: 'methodes', title: 'نرسم التمثيل بنقطتين',
        predictPrompt: 'على المختبر وضعت نقاطًا من تمثيل $f(x) = 2x - 3$ ، ورفض المعلم المبدأ O. لو أعطيناك دالة تآلفية أخرى، بأيّ خطوات ترسم تمثيلها؟ كم نقطة تحتاج، وأيّ عدد تختاره لتجد إحداها دون عناء؟ اكتب الطريقة.',
        summary: 'لرسم تمثيل دالة تآلفية تكفي نقطتان: نحسب صورتي عددين نختارهما، والعدد 0 يعطي مباشرة نقطة محور التراتيب.',
        body: <p><MathText>{METHOD_DRAW.rule}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'qiraa-ab', type: 'methodes', title: 'نقرأ a و b على التمثيل',
        predictPrompt: 'في النشاط 3 جعلت مستقيمك ينطبق على منحدر عبارته مخفية. أمامك المستقيم $(D)$ الذي يشمل $(0 ; 2)$ و $(2 ; -1)$ : بأيّ خطوات تقرأ عليه $b$ ثم $a$ لتكتب $f(x)$ ؟ وماذا تفعل إذا لم يمرّ المستقيم بعقدة من الشبكة بعد وحدة واحدة؟',
        summary: 'نقرأ b ترتيبًا لنقطة تقاطع المستقيم مع محور التراتيب، ونقرأ a بالتقدّم وحدة إلى اليمين ثم قياس ما يصعده أو ينزله المستقيم.',
        body: <div className="space-y-2">{METHOD_AB.rule.map((r) => <p key={r}><MathText>{r}</MathText></p>)}</div>,
      },
      {
        id: 'qiraa-sura-taalufi', type: 'methodes', title: 'نقرأ صورة عدد وعددًا صورته معلومة',
        predictPrompt: 'على المنحدر حرّكت مسبارًا تحت محور الفواصل إلى 4 ، ثم مسبارًا على يسار محور التراتيب إلى 4 ، وتبعت الخط المتقطع. اكتب الطريقتين بكلماتك: كيف تقرأ على المستقيم صورة عدد؟ وكيف تقرأ العدد الذي صورته معلومة؟',
        summary: 'صورة عدد هي ترتيب النقطة من التمثيل التي فاصلتها هذا العدد، والعدد الذي صورته معلومة هو فاصلة النقطة التي ترتيبها هذه الصورة.',
        body: <div className="space-y-2">{METHOD_READ.rule.map((r) => <p key={r}><MathText>{r}</MathText></p>)}</div>,
      },
    ],
  },
};
