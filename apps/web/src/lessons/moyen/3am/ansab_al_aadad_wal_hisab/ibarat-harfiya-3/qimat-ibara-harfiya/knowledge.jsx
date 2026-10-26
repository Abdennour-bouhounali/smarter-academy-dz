import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_VALUES } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « حساب قيمة عبارة حرفية » (3AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme, tirés de
 * معارف 4 et de طريقة 4 du manuel ; rien n'est copié au mot). Les opérations sur les rationnels (`amaliyat-natiqa-3am`), la règle littérale
 * de 1AM (`tatbiq-qaida-harfiya-1am`), la puissance d'un relatif (`quwat-adad-nisbi-3am`) et la priorité des opérations sont des
 * prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'ithar-darb', type: 'regles', title: 'علامة الضرب تُظهَر',
        predictPrompt: 'كتبتَ $4\\times3+7$ فقبله المسار، أمّا $43+7$ فرفضه. ماذا نفعل بعلامة الضرب عند تعويض حرف بعدد؟ اكتب ما لاحظته.',
        summary: 'عند التعويض نُظهر علامة الضرب المضمَرة: $4x$ من أجل $x=3$ تُكتب $4\\times3$.',
        body: <p><MathText>{KNOWLEDGE.times.text}</MathText></p>,
      },
      {
        id: 'aqwas-salib', type: 'regles', title: 'العدد السالب بين قوسين',
        predictPrompt: 'سطرك دون قوسين حول $-2$ أعطى $2$ أمّا المسار فأعطى $10$. كيف نكتب العدد السالب عند التعويض ولماذا؟ اكتب ما لاحظته.',
        summary: 'نضع القيمة السالبة بين قوسين: $(-2)^2=4$ أمّا $-2^2=-4$.',
        body: <p><MathText>{KNOWLEDGE.brackets.text}</MathText></p>,
      },
      {
        id: 'nafs-al-adad', type: 'concepts', title: 'العدد نفسه في كل مكان',
        predictPrompt: 'خرجت من الخزّان كرية لكل مكان للحرف في العبارة. ماذا تحمل هذه الكريات، ولماذا؟ اكتب ما لاحظته.',
        summary: 'الحرف يأخذ العدد نفسه في كل مكان يظهر فيه، ويبقى دوره كما هو.',
        body: <p><MathText>{KNOWLEDGE.same.text}</MathText></p>,
      },
      {
        id: 'harfan', type: 'concepts', title: 'حرفان وعددان',
        predictPrompt: 'في العبارة حرفان وخزّانان. هل يجب أن تحمل الكريتان العدد نفسه؟ اكتب ما لاحظته.',
        summary: 'لحرفين مختلفين قد نعوّض عددين مختلفين.',
        body: <p><MathText>{KNOWLEDGE.letters.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'tawid-qimat', type: 'methodes', title: 'عوّض ثم احسب',
        predictPrompt: 'حسبتَ قيمتي عبارة من أجل $x=3$ ثم $x=-1$. كيف تحسب قيمة عبارة حرفية من أجل قيمة للحرف؟ اكتب الطريقة بكلماتك.',
        summary: 'نعوّض الحرف بالقيمة في كل مكان منه، ونُظهر علامة الضرب، ونضع السالب بين قوسين، ثم نحسب باحترام أولوية العمليات.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.example.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'mithal-mudad', type: 'regles', title: 'مثال مضاد',
        predictPrompt: 'في الزوج الأول تساوت السلّتان عند الكرية 0 ثم اختلفتا عند الكرية 1. ماذا تقول عن العبارتين؟ اكتب ما لاحظته.',
        summary: 'قيمة واحدة تختلف عندها عبارتان تثبت أنهما غير متساويتين؛ وتساوي القيم لا يثبت التساوي.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.counter.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.noProof.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'nashr-yuthbit', type: 'methodes', title: 'القيم تبطل والنشر يثبت',
        predictPrompt: 'في الزوج الثالث تساوت السلّتان عند كل الكريات، ولم نجد مثالًا مضادًا. كيف نتأكد أنّ العبارتين متساويتان؟ اكتب طريقتك.',
        summary: 'لإبطال المساواة نبحث عن قيمة تفرّق بين العبارتين؛ ولإثباتها ننشر العبارتين ونقارن صورتيهما.',
        body: (
          <div className="space-y-2">
            {METHOD_VALUES.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{METHOD_VALUES.rule}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
