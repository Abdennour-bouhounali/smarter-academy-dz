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
