import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY_LINES, KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 4 « التفسير البياني لحل جملة معادلتين من الدرجة الأولى بمجهولين » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet. Le manuel fourni n'a pas de
 * معارف pour cette leçon : les items du module 2 sont la formalisation DÉCLARÉE de la plateforme
 * (content/textbook.js › KNOWLEDGE, `knowledge_formalization`).
 *
 *   module 1 (نشاط 5)  tafsir-nashat — « نقول إنّ … » : (36 ; 7), point commun des deux droites, est le حل ;
 *   module 2 (معارف)   muadala-mustaqim (l'équation et sa droite), hall-taqatu (le حل = l'intersection),
 *                      hall-bayani (la méthode, vérification comprise), qiraa-taqribiya (la lecture approchée),
 *                      halat-thalath (sécantes / parallèles / confondues).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tafsir-nashat', type: 'concepts', title: 'نقطة التقاطع وحلّ الجملة',
        predictPrompt: 'على لوحة صندوق القسم أضاء المصباحان معًا عند النقطة $(36 ; 7)$ وحدها، أمّا $(40 ; 3)$ من المستقيم $(d_1)$ فأضاءت مصباحًا واحدًا. ماذا تمثّل إحداثيتا النقطة المشتركة بين المستقيمين بالنسبة إلى جملة صندوق القسم؟ اكتب بكلماتك.',
        summary: 'نقطة تقاطع المستقيمين تحقّق المعادلتين معًا: إحداثيتاها، 36 قطعة من 100DA و 7 قطع من 200DA، هما حلّ جملة صندوق القسم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY_LINES.closing}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY_LINES.point}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'muadala-mustaqim', type: 'concepts', title: KNOWLEDGE.equationLine.title,
        predictPrompt: 'في النشاط نقلت وقسمت حتى كتبت $100x + 200y = 5000$ كتابةً أخرى قبلتها اللوحة فرسمتها. لو أعطيناك معادلة أخرى بمجهولين $x$ و $y$ ، كيف تكتبها؟ وما شكل مجموعة النقط التي تحقّق إحداثياتها هذه المعادلة؟ ومتى لا تستطيع كتابتها هكذا؟',
        summary: 'معادلة من الدرجة الأولى بمجهولين معامل y فيها غير معدوم تُكتب، بعزل y، على شكل دالة تآلفية؛ والنقط التي تحقّقها هي نقط مستقيم، تمثيلها البياني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.equationLine.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.equationLine.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hall-taqatu', type: 'concepts', title: KNOWLEDGE.solutionPoint.title,
        predictPrompt: 'في صندوق القسم كان الجواب النقطة المشتركة بين مستقيمين. لو أعطيناك جملة أخرى مرسومًا مستقيماها في معلم واحد، كيف تعرف على الشكل الثنائية التي تحقّق المعادلتين معًا، وبأيّ ترتيب تكتب عدديها؟ وهل تصلح نقطة تقع على مستقيم واحد فقط؟',
        summary: 'ثنائية حلّ للجملة عندما تقع النقطة التي إحداثيتاها هذه الثنائية على المستقيمين معًا: حلّ الجملة هو إحداثيتا نقطة تقاطعهما، الفاصلة أولًا ثم الترتيب.',
        body: <p><MathText>{KNOWLEDGE.solutionPoint.text}</MathText></p>,
      },
      {
        id: 'hall-bayani', type: 'methodes', title: KNOWLEDGE.method.title,
        predictPrompt: 'في صندوق القسم ثم في الجملة $\\begin{cases} x - y = 1 \\\\ x + y = 5 \\end{cases}$ وجدت الجواب على معلم. لو أعطيناك جملة جديدة لم يُرسم لها شيء، بأيّ خطوات تجد حلّها بيانيًا؟ وكيف تتأكّد في الأخير أنّ ما وجدته صحيح؟ اكتب الطريقة خطوةً خطوة.',
        summary: 'نكتب كل معادلة على شكل دالة تآلفية، نرسم المستقيمين في معلم واحد، نقرأ إحداثيتي نقطة التقاطع، ثم نتحقّق بالتعويض في المعادلتين.',
        body: (
          <div className="space-y-1">
            {KNOWLEDGE.method.steps.map((s) => <p key={s}><MathText>{s}</MathText></p>)}
          </div>
        ),
      },
      {
        id: 'qiraa-taqribiya', type: 'memoriser', title: KNOWLEDGE.approx.title,
        predictPrompt: 'قرأ أمين $(3 ; 2)$ على الشكل، ثم تحقّق منها بالحساب. هل تثق دائمًا بما تقرؤه على الشكل؟ متى تكون القراءة دقيقة تمامًا، ومتى لا تكون؟ وماذا تفعل عندئذ لتجد الثنائية بدقة؟',
        summary: 'القراءة البيانية لا تعطي الحل المضبوط إلا إذا وقعت نقطة التقاطع على عقدة من الشبكة؛ وإلا فهي تقريبية، والحل المضبوط يعطيه الحساب.',
        body: <p><MathText>{KNOWLEDGE.approx.text}</MathText></p>,
      },
      {
        id: 'halat-thalath', type: 'regles', title: KNOWLEDGE.cases.title,
        summary: 'مستقيمان متقاطعان: حلّ وحيد؛ متوازيان (معامل التوجيه نفسه وترتيبان مختلفان): لا حلّ؛ منطبقان (معامل التوجيه نفسه والترتيب نفسه): عدد لا نهائي من الحلول.',
        body: (
          <div className="space-y-1">
            {KNOWLEDGE.cases.items.map((s) => <p key={s}><MathText>{s}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.cases.link}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
