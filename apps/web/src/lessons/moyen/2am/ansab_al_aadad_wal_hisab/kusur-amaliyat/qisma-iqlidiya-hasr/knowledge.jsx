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

/** La partie de la règle qui CHANGE, en couleur, dans la fiche de mémoire (`memo`, KNOWLEDGE_MAP « The memo card »). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'hasr-hasil', type: 'regles', title: 'أين يقع حاصل القسمة؟',
        memo: {
          rule: `q<${R('\\dfrac{a}{b}')}<q+1`,
          hook: 'بين الملأى واللازمة',
          example: `4<${R('\\dfrac{50}{12}')}<5`,
          trap: 'لا تجعل الباقي أو القاسم حدًّا للحصر',
          exam: 'اكتب المساواة أوّلًا، ثم الحصر بين عددين متتاليين',
          chip: `q<${R('\\tfrac{a}{b}')}<q+1`,
          quiz: [
            { q: 'الحصر الصحيح لـ $\\frac{50}{12}$ :', options: ['$4<\\frac{50}{12}<5$', '$2<\\frac{50}{12}<12$', '$3<\\frac{50}{12}<4$'], correct: 0 },
            { q: 'العدد $\\frac{60}{12}$ :', options: ['يساوي $5$', 'بين $5$ و $6$', 'بين $4$ و $5$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `a=b\\times q+${R('r')},\\ ${R('r')}<b`,
          hook: 'الباقي أصغر من القاسم',
          example: `2145=30\\times 71+${R('15')}`,
          trap: 'باقٍ يساوي 45 مع قاسم 30 ليس قسمة إقليدية، ولو صحّت المساواة',
          exam: 'تحقّق من شرطين: المساواة، والباقي أصغر من القاسم',
          chip: `${R('r')}<b`,
          quiz: [
            { q: 'القسمة الإقليدية لـ $180$ على $8$ :', options: ['$180=8\\times 22+4$', '$180=8\\times 21+12$', '$180=8\\times 23-4$'], correct: 0 },
            { q: 'باقي قسمة $100$ على $7$ :', options: ['$2$', '$14$', '$9$'], correct: 0 },
          ],
        },
        summary: 'إجراء القسمة الإقليدية لعدد طبيعي a على عدد طبيعي غير معدوم b معناه إيجاد عددين طبيعيين q و r حيث a = b × q + r و 0 ≤ r < b.',
        body: <p><MathText>{definition}</MathText></p>,
      },
      {
        id: 'qiyam-muqarraba', type: 'vocabulaire', title: 'القيمتان المقرّبتان إلى الوحدة', predict: false,
        memo: {
          rule: `${R('q')}<\\dfrac{a}{b}<${R('q+1')}`,
          hook: 'الحدّان: بالنقصان وبالزيادة',
          example: `${R('22')}<\\dfrac{180}{8}<${R('23')}`,
          trap: 'القيمة بالزيادة هي العدد الموالي للحاصل، وليست الباقي',
          exam: 'سمِّ الحدّين: القيمة بالنقصان ثم القيمة بالزيادة',
          chip: `${R('q')},\\ ${R('q+1')}`,
          quiz: [
            { q: 'القيمة المقرّبة بالنقصان إلى الوحدة لـ $\\frac{180}{8}$ :', options: ['$22$', '$23$', '$4$'], correct: 0 },
            { q: 'القيمة المقرّبة بالزيادة إلى الوحدة لـ $\\frac{50}{12}$ :', options: ['$5$', '$4$', '$2$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `a=b\\times q+${R('0')}`,
          hook: 'باقٍ معدوم: القاسم يقسم العدد',
          example: `60=12\\times 5+${R('0')}`,
          trap: 'لا تقل « يقسم » إذا بقي شيء، ولو 1',
          exam: 'اكتب الجملتين: مضاعف لـ… ، و يقسم…',
          chip: `r=${R('0')}`,
          quiz: [
            { q: 'العدد $12$ يقسم:', options: ['$60$', '$50$', '$62$'], correct: 0 },
            { q: 'العدد $75$ مضاعف للعدد:', options: ['$15$', '$10$', '$7$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `b\\times ${R('100')},\\ b\\times ${R('10')},\\ b\\times ${R('1')}`,
          hook: 'مئات، ثم عشرات، ثم آحاد',
          example: `37\\times ${R('100')}=3700<4750`,
          trap: 'لا تجرّب الأعداد من 1 واحدًا واحدًا',
          exam: 'توقّف حين يصير الفرق أصغر من القاسم',
          chip: `b\\times ${R('100')}`,
          quiz: [
            { q: 'لقسمة $4750$ على $37$ نبدأ بـ:', options: ['$37\\times 100=3700$', '$37\\times 1000=37000$', '$37\\times 1=37$'], correct: 0 },
            { q: 'حاصل قسمة $9000$ على $125$ :', options: ['$72$', '$70$', '$80$'], correct: 0 },
          ],
        },
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
