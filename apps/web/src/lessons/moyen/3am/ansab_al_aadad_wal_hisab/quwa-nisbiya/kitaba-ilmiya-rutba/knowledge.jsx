import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الكتابة العلمية ورتبة القدر » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 4–5 p. 44, طرائق et دوري الآن p. 45,
 * réécrits). Les puissances de 10 (leçons `quwa-adad-ashara` et `qawaid-quwa-ashara`), le مدوّر et la رتبة المقدار de 1AM ne sont PAS des items ici : ce sont des prérequis
 * (`priorKnowledge`), mesurés par « أستعدّ ». Le rappel de la 1AM est un encadré « تذكّر » du module 2, pas un item.
 */
const { sci, bracket, order, compare } = KNOWLEDGE;
const Box = ({ k }) => (
  <div className="space-y-2">
    <p><MathText>{k.text}</MathText></p>
    <p className="text-sm text-slate-600"><MathText>{k.example}</MathText></p>
  </div>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'kitaba-ilmiya', type: 'regles', title: 'الكتابة العلمية',
        predictPrompt: 'بطاقة المنارة وقفت على الدرجة $10^2$ وفي الخانة 2 فكُتبت $2{,}65 \\times 10^2$ ، ولم تُكتب $26{,}5 \\times 10^1$ . متى تكون الكتابة $a \\times 10^n$ هي الكتابة العلمية للبطاقة؟',
        summary: 'الكتابة العلمية: a × 10ⁿ حيث 1 ≤ a < 10 و n عدد صحيح نسبي.',
        body: <Box k={sci} />,
      },
      {
        id: 'hasr-quwatayn', type: 'regles', title: 'الحصر بين قوتين متتاليتين',
        predictPrompt: 'بطاقة ورقة الكرّاس طولها 0,0001 م وقفت على الدرجة التي تبدأ عند $10^{-4}$ وتنتهي عند $10^{-3}$ . اكتب حصرها بين قوتين متتاليتين للعدد 10 .',
        summary: 'إذا كان A = a × 10ⁿ فإنّ 10ⁿ ≤ A < 10ⁿ⁺¹ : الدرجة هي الحصر.',
        body: <Box k={bracket} />,
      },
      {
        id: 'rutbat-qadr', type: 'regles', title: 'رتبة القدر',
        predictPrompt: 'المغناطيس جذب بطاقة المنارة $2{,}65 \\times 10^2$ إلى التدريجة $3 \\times 10^2$ ، وجذب بطاقة الحافلة $1{,}95 \\times 10^6$ إلى $2 \\times 10^6$ . كيف نعيّن رتبة قدر عدد من كتابته العلمية؟',
        summary: 'رتبة قدر a × 10ⁿ هي a′ × 10ⁿ حيث a′ مدوّر a إلى الوحدة (و a′ = 10 تُكتب 1 × 10ⁿ⁺¹).',
        body: <Box k={order} />,
      },
      {
        id: 'muqarana-ilmiya', type: 'regles', title: 'مقارنة عددين بكتابتهما العلمية',
        predictPrompt: 'بطاقتان: $9{,}8 \\times 10^{-5}$ و $1{,}2 \\times 10^{-4}$ . أيّهما على الدرجة الأعلى؟ ماذا نقارن أوّلًا: الأسّين أم العددين $a$ ؟',
        summary: 'نقارن الأسّين أوّلًا: الأكبر أسّه أكبر ؛ وإذا تساوى الأسّان قارنّا العددين a.',
        body: <Box k={compare} />,
      },
    ],
    2: [
      {
        id: 'shart-ilmiya', type: 'regles', title: 'ما الذي يجعل الكتابة علمية؟',
        predictPrompt: 'حكمتَ على ست كتابات: قبلتَ $7{,}2 \\times 10^{4}$ و $1 \\times 10^{-6}$ و $9{,}99 \\times 10^{8}$ ورفضتَ $0{,}72 \\times 10^{5}$ و $10 \\times 10^{3}$ و $45 \\times 10^{-2}$ . ما الذي يجمع الكتابات المقبولة؟',
        summary: 'هي علمية إذا كان العدد الأوّل من 1 إلى أقل من 10 ؛ والمساواة وحدها لا تكفي.',
        body: <p><MathText>{'تساوي $45 \\times 10^{-2}$ العدد $0{,}45$ ، لكنّها ليست كتابة علمية لأنّ $45$ ليس من 1 إلى أقل من 10 ؛ وكتابته العلمية $4{,}5 \\times 10^{-1}$ .'}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'tariqa-ilmiya', type: 'methodes', title: 'من عدد إلى كتابته العلمية وحصره ورتبة قدره',
        predictPrompt: 'أمامك عدد مثل $47\\,300\\,000$ أو $528 \\times 10^{-6}$ . كيف تصل إلى كتابته العلمية، ثم إلى حصره ورتبة قدره؟',
        summary: 'نزيح الفاصلة (أو نكتب k علميًا ونجمع الأسّين)، ثم نقرأ الحصر من الأسّ، ونعطي رتبة القدر بتدوير a إلى الوحدة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.decimal.rule}</MathText></p>
            <p><MathText>{METHOD.times.rule}</MathText></p>
            <p><MathText>{METHOD.bracket.rule}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-ilmiya', type: 'methodes', title: 'نحسب ثم نكتب النتيجة كتابة علمية',
        predictPrompt: 'في عبارة فيها جداءات وقسمة على قوى العدد 10 ، ماذا تحسب أوّلًا؟ وماذا تفعل إن لم يكن العدد الأوّل من 1 إلى أقل من 10 ؟',
        summary: 'نحسب بالقواعد الثلاث، ثم نعدّل العدد الأوّل والأسّ معًا حتى تصير الكتابة علمية.',
        body: <p><MathText>{METHOD.compute.rule}</MathText></p>,
      },
    ],
  },
};
