import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « حصر عدد عشري موجب » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 3 p. 76 et طرائق p. 77,
 * réécrits). Le tadwir à l'unité, l'encadrement entre deux naturels, la division lue sur la calculatrice et la leçon sœur des inégalités sont des prérequis
 * (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici. 4AM l'emploie sans lien du réseau (racines, trigonométrie, statistique).
 */
const { chain, round, fromRound, quotient } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tadwir', type: 'regles', title: 'المدوّر',
        predictPrompt: 'اكتب بكلماتك كيف تختار الشاشة العدد الذي تكتبه.',
        summary: 'مدوّر عدد هو أقرب علامتين تحيطان به، وإذا كان في المنتصف تمامًا فالعليا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{round.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{round.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hasr-min-mudawwar', type: 'regles', title: 'الحصر من المدوّر',
        predictPrompt: 'قرأت الشاشة عددًا بعد التدوير. ما كلّ الكتل التي تعطي هذه القراءة؟ اكتب أين تبدأ وأين تنتهي، وهل يدخل الطرفان.',
        summary: 'مدوّر x هو r إذا وفقط إذا r − نصف الرتبة ≤ x < r + نصف الرتبة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{fromRound.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{fromRound.example}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.halfOpen}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qimatan-muqarraban', type: 'regles', title: 'القيمتان المقرّبتان',
        predictPrompt: 'كيس الفلفل لم يبلغه ميزان. ما اسم العلامة التي تسبقه والعلامة التي تليه؟ اكتب ما تلاحظه.',
        summary: 'العلامة التي تسبق العدد قيمته المقرّبة بالنقصان، والتي تليه قيمته المقرّبة بالزيادة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{chain.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'مثلًا: $0{,}285<\\frac{2}{7}<0{,}286$ ، بالنقصان $0{,}285$ وبالزيادة $0{,}286$ .'}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'hasr-rutba', type: 'regles', title: 'الحصر إلى رتبة',
        predictPrompt: 'كيف تجد العلامتين اللتين يقع بينهما عدد عشري عند رتبة معيّنة؟ وماذا يحدث للحصر حين تنتقل إلى رتبة أدقّ؟',
        summary: 'نقطع العدد عند الرتبة للعلامة السفلى ونضيف وحدة من الرتبة للعليا؛ وكلّ رتبة أدقّ تضيّق الحصر عشر مرّات.',
        body: (
          <div className="space-y-2">
            <p><MathText>{chain.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{chain.example}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqa-hasr-rutba', type: 'methodes', title: 'أحصر عددًا إلى رتبة وأدوّره',
        predictPrompt: 'كيف تحصر $7{,}4826$ إلى $0{,}01$ ثم تعيّن مدوّره؟ اكتب طريقتك.',
        summary: 'القطع للعلامة السفلى، وحدة من الرتبة للعليا، والرقم التالي للمدوّر.',
        body: <p><MathText>{METHOD.rank.rule}</MathText></p>,
      },
      {
        id: 'tariqa-hasr-mudawwar', type: 'methodes', title: 'أحصر عددًا علمت مدوّره',
        predictPrompt: 'مدوّر عدد إلى $0{,}01$ هو $3{,}72$ . كيف تحصره؟ وهل يدخل الطرف الأيمن؟ اكتب طريقتك.',
        summary: 'أطرح نصف الرتبة وأضيفه إلى المدوّر؛ الطرف الأيسر مشمول والأيمن غير مشمول.',
        body: <p><MathText>{METHOD.fromRound.rule}</MathText></p>,
      },
      {
        id: 'tariqa-hasil', type: 'methodes', title: 'أحصر حاصل قسمة وأدوّره',
        predictPrompt: 'قرأت على الآلة الحاسبة حاصل قسمة. كيف تحصره إلى رتبة وتعيّن مدوّره؟ اكتب طريقتك.',
        summary: 'أقرأ الشاشة حتى الرتبة للعلامة السفلى، وأضيف وحدة من الرتبة للعليا، ثم أنظر إلى الرقم التالي.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.quotient.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{quotient.text}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
