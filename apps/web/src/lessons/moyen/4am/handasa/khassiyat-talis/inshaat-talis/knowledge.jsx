import React from 'react';
import MathText from '../../../../../common/components/MathText';
import GeoFigure from '../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../common/textbook';
import { METHOD_RAY, METHOD_DIVIDE, METHOD_LENGTH, METHOD_RATIO, TWO_POINTS, ROOT13 } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « إنشاءات هندسية وتطبيقات خاصية طالس (تقسيم قطعة مستقيم) » — SOURCE UNIQUE.
 *
 *   module 1  taqsim-qitaa (la méthode du rayon auxiliaire — formulée par la plateforme, déclarée),
 *             tabrir-taqsim (pourquoi : Thalès, k/n — formulé, déclaré), tariqat-kitab-taqsim (طرائق ص 107) ;
 *   module 2  nuqta-nisba (طرائق ص 109), nuqtatan (les deux points — formulé, déclaré),
 *             insha-tul (طرائق ص 107 : 14/3), tul-ghayr-natiq (√13 puis ses 2/3 — exemple de la plateforme).
 */
const Lines = ({ lines }) => lines.map((l) => <p key={l}><MathText>{l}</MathText></p>);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'taqsim-qitaa', type: 'methodes', title: 'تقسيم قطعة إلى قطع متقايسة',
        predictPrompt: 'قسمتَ اللافتة $[AB]$ إلى 3 قطع متساوية دون أن تقيس $10 \\div 3$ . لو طُلب منك تقسيم قطعة $[AB]$ إلى $n$ قطع متقايسة، فما خطواتك بالترتيب، من أوّل خطّ ترسمه إلى نقط التقسيم؟ اكتب الطريقة.',
        summary: 'لتقسيم قطعة [AB] إلى n قطع متقايسة بالمسطرة غير المدرّجة والمدور: نعيّن على نصف مستقيم مبدؤه A عددا n من القطع المتقايسة، نصل العلامة رقم n بالنقطة B، ثم نرسم بالمسطرة والكوس الموازيات المارّة بالعلامات الأخرى.',
        body: (
          <div className="space-y-1.5">
            <Lines lines={METHOD_RAY.lines} />
            <SourceTag source={METHOD_RAY.source} />
          </div>
        ),
      },
      {
        id: 'tabrir-taqsim', type: 'regles', title: 'لماذا تتقايس القطع؟',
        predictPrompt: 'مع 3 علامات متقايسة وجدت $\\dfrac{AM_1}{AB}$ و $\\dfrac{AM_2}{AB}$ . لو عيّنت $n$ علامات متقايسة، فكم تساوي $\\dfrac{AM_k}{AB}$ لنقطة التقسيم رقم $k$ ؟ بأيّ خاصية تبرّر ذلك، وهل لفتحة المدور دور؟',
        summary: 'في المثلث الذي رؤوسه A وآخر علامة و B تحقّق الموازيات خاصية طالس: نقطة التقسيم رقم k تبعد عن A بـ k من n أجزاء من AB، مهما كانت فتحة المدور وميل نصف المستقيم.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_RAY.why}</MathText></p>
            <GeoFigure {...METHOD_RAY.figure} />
            <SourceTag source={METHOD_RAY.source} />
          </div>
        ),
      },
      {
        id: 'tariqat-kitab-taqsim', type: 'methodes', title: 'طريقة الكتاب: ثلاث قطع على مستقيم يشمل B',
        predictPrompt: 'في تمرين الكتاب: $ABC$ مثلث، $D$ نظيرة $B$ بالنسبة إلى $C$ ، و $E$ نظيرة $C$ بالنسبة إلى $D$ . كما فعلت باللافتة، كيف تستعمل النقط $C$ و $D$ و $E$ لتقسيم الضلع $[AB]$ إلى 3 قطع متقايسة؟ اكتب الخطوات.',
        summary: 'نعيّن على مستقيم يشمل B نقطا C و D و E متتالية تجعل القطع [BC] و [CD] و [DE] متقايسة (نظائر)، ثم نرسم الموازيين للمستقيم (AE) المارّين بـ C و D، فيقسمان [AB] إلى ثلاث قطع متقايسة.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_DIVIDE.exercise}</MathText></p>
            <p><MathText>{METHOD_DIVIDE.solution[0]}</MathText></p>
            <p><MathText>{METHOD_DIVIDE.solution[5]}</MathText></p>
            <SourceTag source={METHOD_DIVIDE.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'nuqta-nisba', type: 'methodes', title: 'نقطة تقسم قطعة بنسبة معلومة',
        predictPrompt: 'في اللافتة صنعت قطعًا متقايسة وموازيات. نريد الآن نقطة $M$ من $[AB]$ حيث $\\dfrac{MA}{MB} = \\dfrac{3}{2}$ ، بالمسطرة غير المدرّجة والمدور فقط. أيّ وضعية طالس تبنيها لتظهر فيها النسبة $\\dfrac{3}{2}$ ؟ اكتب خطوات الإنشاء.',
        summary: 'لتعيين M من [AB] حيث نسبة MA إلى MB معلومة نرسم مستقيمين متوازيين يشملان A و B مدرّجين بانتظام وبنفس الوحدة، نعيّن F على الأول و E على الثاني في جهتين مختلفتين، فيقطع (EF) القطعة [AB] في M.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_RATIO.solution[0]}</MathText></p>
            <p><MathText>{METHOD_RATIO.solution[1]}</MathText></p>
            <p><MathText>{METHOD_RATIO.solution[3]}</MathText></p>
            <SourceTag source={METHOD_RATIO.source} />
          </div>
        ),
      },
      {
        id: 'nuqtatan', type: 'regles', title: 'نقطتان من المستقيم (AB)',
        predictPrompt: 'في شكل الكتاب أعطت العلامتان $F$ و $E$ النقطة $M$ ، وأعطت العلامتان $K$ و $E$ النقطة $N$ ، وكلتاهما تحقّق $\\dfrac{3}{2}$ . متى تقع النقطة بين $A$ و $B$ ، ومتى تقع خارج $[AB]$ ؟ ولو كانت النسبة $\\dfrac{2}{5}$ ، فمن أيّ جهة تقع النقطة الخارجية؟ اكتب القاعدة.',
        summary: 'إذا كان العددان مختلفين فإن نقطتين من المستقيم (AB) تحقّقان النسبة نفسها: واحدة بين A و B (علامتان في جهتين مختلفتين) وأخرى خارج [AB] (علامتان في نفس الجهة).',
        body: (
          <div className="space-y-1.5">
            <Lines lines={TWO_POINTS.lines} />
            <p className="text-sm text-slate-700"><MathText>{TWO_POINTS.example}</MathText></p>
            <SourceTag source={TWO_POINTS.source} />
          </div>
        ),
      },
      {
        id: 'insha-tul', type: 'methodes', title: 'إنشاء قطعة طولها معلوم',
        predictPrompt: 'صنعت خاصية طالس نسبة معلومة على موازيين مدرّجين. نريد الآن قطعة $[AB]$ طولها $\\dfrac{14}{3}$ دون قياس، والمدور ينقل أطوالًا صحيحة مثل 2 و 3 و 7. كيف تجعل خاصية طالس تعطيك هذا الطول؟ اكتب خطوات الإنشاء.',
        summary: 'نكتب الطول المطلوب على شكل تناسب (مثل 3 على 7 يساوي 2 على AB)، نعيّن الأطوال الثلاثة المعلومة على نصفي مستقيمين، ونرسم موازيًا: خاصية طالس تعطي الطول الرابع.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_LENGTH.solution[0]}</MathText></p>
            <p><MathText>{METHOD_LENGTH.why}</MathText></p>
            <SourceTag source={METHOD_LENGTH.source} />
          </div>
        ),
      },
      {
        id: 'tul-ghayr-natiq', type: 'methodes', title: 'طول غير ناطق',
        predictPrompt: 'الطول $\\sqrt{13}$ لا يُقاس بالمسطرة، لكن $13 = 2^2 + 3^2$ . كيف تنشئ بالمسطرة والكوس والمدور قطعة طولها $\\sqrt{13}$ ؟ ثم كيف تأخذ ثلثيها دون قياس؟ اكتب الخطوات.',
        summary: 'طول مثل جذر 13 لا يُقاس بالمسطرة، لكنه يُنشأ وترًا لمثلث قائم ضلعاه 2 و 3؛ ثم نأخذ ثلثيه بتقسيمه إلى ثلاث قطع متقايسة.',
        body: (
          <div className="space-y-1.5">
            <Lines lines={ROOT13.lines} />
            <SourceTag source={ROOT13.source} />
          </div>
        ),
      },
    ],
  },
};
