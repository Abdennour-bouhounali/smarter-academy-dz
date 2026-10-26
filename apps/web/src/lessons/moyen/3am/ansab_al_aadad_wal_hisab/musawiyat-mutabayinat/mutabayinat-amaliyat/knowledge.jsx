import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المتباينات والعمليات » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 2
 * p. 74 et طرائق p. 75, réécrits). Le test d'une inégalité par une valeur, le produit de nombres relatifs, l'ordre de deux relatifs et la leçon
 * sœur des égalités sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { add, pos, neg, weak, zero } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jam-mutabayina', type: 'regles', title: 'المتباينة والجمع والطرح',
        predictPrompt: 'على النول بقي الأحمر على يسار الأزرق مهما كان العدد الذي أزحتَ به الخيوط. إذا كان $a<b$ فماذا يمكنك أن تقول عن $a+c$ و $b+c$ ؟ وعن $a-c$ و $b-c$ ؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كان a < b فإنّ a + c < b + c و a − c < b − c : الجمع والطرح لا يغيّران اتجاه المتباينة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{add.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{add.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'darb-mujab', type: 'regles', title: 'الضرب في عدد موجب',
        predictPrompt: 'مدّدتَ الخيوط بعدد موجب فبقي الأحمر على يسار الأزرق. إذا كان $a<b$ و $c>0$ فماذا تقول عن $ac$ و $bc$ ؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كان a < b و c > 0 فإنّ ac < bc : الضرب في عدد موجب تمامًا لا يغيّر الاتجاه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{pos.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{pos.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'darb-salib', type: 'regles', title: 'الضرب في عدد سالب',
        predictPrompt: 'مدّدتَ الخيوط بعدد سالب فصار الأحمر على يمين الأزرق. إذا كان $a<b$ و $c<0$ فماذا تقول عن $ac$ و $bc$ ؟ اكتب ما يحدث لاتجاه المتباينة.',
        summary: 'إذا كان a < b و c < 0 فإنّ ac > bc : الضرب في عدد سالب تمامًا يغيّر اتجاه المتباينة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{neg.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{neg.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qisma-wa-taswiya', type: 'regles', title: '≤ و ≥ والقسمة',
        predictPrompt: 'هل تبقى الخواص صحيحة مع $\\leq$ و $\\geq$ ؟ وماذا تفعل القسمة على عدد باتجاه المتباينة؟ اكتب ما تعرفه.',
        summary: 'الخواص نفسها مع ≤ و ≥ ؛ والقسمة على c هي الضرب في 1/c الذي له إشارة c نفسها.',
        body: <p><MathText>{weak.text}</MathText></p>,
      },
      {
        id: 'sifr-mutabayina', type: 'regles', title: 'الضرب في صفر',
        predictPrompt: 'عند المسمار في $0$ التقت العقدتان. ماذا يحدث لمتباينة تامّة حين نضرب طرفيها في $0$ ؟',
        summary: 'الضرب في 0 يعطي 0 = 0 : لم تعد متباينة تامّة، ولذلك نشترط c ≠ 0.',
        body: <p><MathText>{zero.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'istintaj', type: 'methodes', title: 'أستنتج متباينة من أخرى',
        predictPrompt: 'كيف تنتقل من متباينة معطاة إلى متباينة طرفها الأول $x$ ؟ وماذا تفعل عندما تقسم على عدد سالب؟ اكتب طريقتك.',
        summary: 'نجري العملية نفسها على الطرفين خطوة خطوة، ونغيّر الاتجاه في كل ضرب أو قسمة في عدد سالب تمامًا.',
        body: <p><MathText>{METHOD.deduce.rule}</MathText></p>,
      },
      {
        id: 'muqarana-bil-khawas', type: 'methodes', title: 'أقارن عبارتين',
        predictPrompt: 'كيف تثبت أنّ $A>B$ بعد أن خمّنتَ ذلك بقيمتين؟ اكتب طريقتك.',
        summary: 'نحسب الفرق A − B ثم نستعمل الخواص لنعرف إشارته.',
        body: <p><MathText>{METHOD.compare.rule}</MathText></p>,
      },
      {
        id: 'hasr-ab', type: 'methodes', title: 'أحصر عبارة',
        predictPrompt: 'علمتَ حصرًا لـ $t$ . كيف تحصر $-2t+4$ ؟ وماذا يحدث لترتيب الطرفين؟ اكتب طريقتك.',
        summary: 'نحصر ax أولًا ثم نضيف b ؛ ومع a سالب نكتب الأصغر أولًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.bracket.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.boundOrder.right}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
