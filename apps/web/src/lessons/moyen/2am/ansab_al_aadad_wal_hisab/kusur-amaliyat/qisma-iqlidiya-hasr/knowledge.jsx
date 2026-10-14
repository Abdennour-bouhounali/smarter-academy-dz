import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « القسمة الإقليدية وحصر حاصل القسمة » (2AM) — SOURCE UNIQUE, construite à partir du contenu
 * (content/textbook.js : نشاط 1 p. 24, معارف 1 p. 26, la طريقة de la plateforme). La division euclidienne de 1AM n'est
 * PAS un item ici : c'est un prérequis (`priorKnowledge: qisma-iqlidiya`), rappelé par la « تذكّر » du module 1.
 */
const { definition, divisibility, divides, hasr } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'hasr-hasil', type: 'regles', title: 'أين يقع حاصل القسمة؟',
        predictPrompt: 'في المختبر وضعت إطارك على مسطرة الصفائح، ثم عبّأت البيض. بين أيّ عددين وقع حاصل القسمة 2145 ÷ 30؟ وماذا يمثّل كل منهما؟ ومتى وقع الحاصل على عدد طبيعي بالضبط؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كان a = b × q + r مع 0 < r < b فإنّ حاصل القسمة a ÷ b محصور بين العددين الطبيعيين المتتاليين q و q + 1 ؛ وإذا كان الباقي معدومًا فالحاصل هو العدد الطبيعي q بالضبط.',
        body: (
          <div className="space-y-2">
            <p className="text-center"><MathText>{'$a = b \\times q + r$ مع $0 < r < b$ ⟸ $q < \\frac{a}{b} < q + 1$'}</MathText></p>
            <p><MathText>{GUIDE.ends}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.exact}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qisma-taarif', type: 'vocabulaire', title: 'القسمة الإقليدية: التعريف', predict: false,
        summary: 'إجراء القسمة الإقليدية لعدد طبيعي a على عدد طبيعي غير معدوم b معناه إيجاد عددين طبيعيين q و r حيث a = b × q + r و 0 ≤ r < b.',
        body: <p><MathText>{definition}</MathText></p>,
      },
      {
        id: 'qiyam-muqarraba', type: 'vocabulaire', title: 'القيمتان المقرّبتان إلى الوحدة', predict: false,
        summary: 'في القسمة 180 على 8: 22 قيمة تقريبية إلى الوحدة بالنقصان لحاصل القسمة و 23 قيمة تقريبية له بالزيادة، و 22 < 180 ÷ 8 < 23.',
        body: (
          <div className="space-y-2">
            <p><MathText>{hasr.text}</MathText></p>
            <p><MathText>{hasr.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qabiliya', type: 'vocabulaire', title: 'عندما يكون الباقي معدومًا', predict: false,
        summary: 'إذا كان الباقي 0 نقول إنّ a يقبل القسمة على b ، وإنّ a مضاعف للعدد b ، وإنّ b يقسم a ؛ وحاصل القسمة a ÷ b عندئذ عدد طبيعي.',
        body: (
          <div className="space-y-2">
            <p><MathText>{divisibility}</MathText></p>
            <p><MathText>{divides}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'hasr-tariqa', type: 'methodes', title: 'أحصر حاصل قسمة كبيرة',
        predictPrompt: 'كيف تحصر $\\frac{4750}{37}$ دون آلة حاسبة ودون أن تجرّب كل الأعداد من 1؟ بأيّ مضاعفات للعدد 37 تبدأ؟ اكتب طريقتك.',
        summary: 'نقترب من الحاصل بمضاعفات المقسوم عليه في 100 ثم في 10 ثم في 1 ، ونتوقّف عندما يصبح الفرق أصغر من المقسوم عليه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.solution[3]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
