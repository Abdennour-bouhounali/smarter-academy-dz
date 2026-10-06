import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, METHOD, SOLVE_ALL, EX26, CHECKS, ANGLE_FROM_SIDES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Ce que le درس 4 établit. Le manuel n'a pas de معارف pour cette leçon : tout est une formalisation DÉCLARÉE de la
 * plateforme (`knowledge_formalization`, content/textbook.js), posée au moment où les modules la font vivre.
 *   tarid-muthallath   module 1 — traduire une situation en triangle rectangle, nommer les côtés relativement à l'angle
 *   ikhtiyar-nisba     module 1 — choisir le rapport qui contient le côté connu ET le côté cherché
 *   majhul-maqam       module 1 — l'inconnue au numérateur : on multiplie ; au dénominateur : on divise
 *   zawiyat-nazar      module 1 — une hauteur inaccessible : h = d × tan α, la même de partout (angle lu au degré)
 *   khatawat-tarid     module 2 — les six étapes de la modélisation
 *   tadwir-akhir       module 2 — arrondir à la fin seulement (ex-26)
 *   hall-muthallath    module 2 — résoudre le triangle rectangle entier (ex-27)
 *   zawiya-min-dilain  module 2 — un angle à partir de deux côtés : le rapport, puis la touche inverse
 *   burhan-qaim        module 3 — avant d'utiliser un rapport : prouver que le triangle est rectangle (ex-13, ex-24)
 * Les réponses du « إختبار أولي » (منارة جامع الجزائر, téléphérique, dune, sarah) ne sont dans aucun item.
 */
const Lines = ({ lines }) => (
  <ul className="list-disc ms-5 space-y-1">{lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'tarid-muthallath', type: 'methodes', title: 'من الوضعية إلى المثلث القائم',
        predictPrompt: 'السلّم على الجدار: الجدار شاقولي والأرض أفقية، وعرفت أيّ ضلع هو الارتفاع $1{,}60\\,\\mathrm{m}$ وأيّ ضلع هو السلّم. أمام وضعية جديدة (عمود، كشّاف، منارة)، بماذا تبدأ قبل أيّ حساب؟ اكتب بكلماتك: أيّ شكل ترسم، وبالنسبة إلى ماذا تسمّي أضلاعه؟',
        summary: 'الشاقولي عمودي على الأفقي: نرسم مثلثا قائما يترجم الوضعية، ونسمّي أضلاعه بالنسبة إلى الزاوية المعلومة (المقابل، المجاور، الوتر).',
        body: <Lines lines={[METHOD.lines[0], REMARKS.muqabilWatar]} /> },
      { id: 'ikhtiyar-nisba', type: 'regles', title: 'أيّ نسبة؟', summary: 'نختار النسبة التي تجمع الضلع المعلوم والضلع المطلوب: المقابل والوتر بالجيب، المجاور والوتر بجيب التمام، المقابل والمجاور بالظل.',
        body: <Lines lines={[METHOD.lines[2], REMARKS.sinChoice]} /> },
      { id: 'majhul-maqam', type: 'regles', title: 'نضرب أم نقسم؟', summary: 'نكتب المساواة ونستخرج المجهول: في البسط نضرب، وفي المقام نقسم؛ الوتر أطول الأضلاع فلا يكون أقصر من المعلوم.',
        body: <Lines lines={[METHOD.lines[3], REMARKS.ladderCalc]} /> },
      { id: 'zawiyat-nazar', type: 'methodes', title: 'ارتفاع لا نصل إليه',
        predictPrompt: 'كشّاف الملعب لا نتسلّقه: نعرف فقط بعد الهاتف عن قاعدة عموده على الأرض، وزاوية النظر التي يقرؤها الهاتف. كيف تحسب ارتفاع الكشّاف من هذين العددين؟ اكتب الطريقة، وقل: هل يتغيّر الارتفاع المحسوب إذا قِسنا من مسافة أخرى؟',
        summary: 'من المسافة على الأرض وزاوية النظر نحسب الارتفاع بضرب المسافة في ظل الزاوية؛ يبقى الارتفاع نفسه من كل مكان، والفروق الصغيرة من تدوير الزاوية.',
        body: <Lines lines={[REMARKS.nisbaRight, REMARKS.wobble]} /> },
    ],
    2: [
      { id: 'khatawat-tarid', type: 'methodes', title: METHOD.title,
        predictPrompt: 'مع السلّم ( $1{,}60\\,\\mathrm{m}$ و $59^{\\circ}$ ) ثم مع كشّاف الملعب، حللت وضعيتين بالطريقة نفسها. لو أعطيناك وضعية أخرى، ما الخطوات التي تتّبعها بالترتيب، من قراءة النص إلى الجواب؟ اكتبها مرقّمة.',
        summary: 'نرسم المثلث القائم، نسمّي المعلوم والمطلوب بالنسبة إلى الزاوية، نختار النسبة، نستخرج المجهول، نحسب وندوّر في النهاية، ثم نتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">{METHOD.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ol>
        ) },
      { id: 'tadwir-akhir', type: 'regles', title: 'ندوّر في النهاية فقط', summary: 'القيمة المدوّرة إذا استُعملت في حساب موالٍ تغيّر النتيجة؛ نحتفظ بالقيمة المضبوطة أو بكل أرقام الحاسبة ولا ندوّر إلا النتيجة الأخيرة.',
        body: <Lines lines={[EX26.earlyNote, CHECKS.earlyRight]} /> },
      { id: 'hall-muthallath', type: 'methodes', title: SOLVE_ALL.title,
        predictPrompt: 'في التمرين 27 كنت تعرف زاوية وضلعا فقط، ثم وجدت $MS$ و $SF$ وقيس $\\widehat{F}$ ، وحسبت $SF$ بأربع طرق. كيف نجد كل العناصر المجهولة لمثلث قائم؟ اكتب الطريقة، وقل: متى تعطي كل الطرق النتيجة نفسها؟',
        summary: 'الزاوية الثانية بالتتام، وضلع بنسبة مثلثية، والثالث بنسبة أخرى أو بخاصية فيثاغورس؛ كل الطرق تعطي النتيجة نفسها بالقيم المضبوطة.',
        body: <Lines lines={[...SOLVE_ALL.lines, CHECKS.verify]} /> },
      { id: 'zawiya-min-dilain', type: 'methodes', title: 'زاوية من ضلعين',
        predictPrompt: 'الكشّاف ارتفاعه $24\\,\\mathrm{m}$ والهاتف على بعد $30\\,\\mathrm{m}$ من قاعدته، ووجدت زاوية النظر بالحساب دون أن تقيسها. إذا عرفت طولي ضلعين في مثلث قائم، كيف تعيّن قيس إحدى زاويتيه الحادتين؟ اكتب الخطوات.',
        summary: 'إذا عرفنا ضلعين نختار النسبة التي تجمعهما، نحسب قيمتها، ثم نعيّن الزاوية باللمسة العكسية على الحاسبة.',
        body: <Lines lines={[ANGLE_FROM_SIDES.explain]} /> },
    ],
    3: [
      { id: 'burhan-qaim', type: 'regles', title: 'هل المثلث قائم؟', summary: 'لا نستعمل النسب المثلثية إلا في مثلث قائم: نثبت الزاوية القائمة (عكس فيثاغورس، مثلث في نصف دائرة، موازٍ لعمودي) قبل الحساب.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{'التمرين 13: $3{,}4^2 + 2{,}55^2 = 4{,}25^2$ فالمثلث ACD قائم في D، ثم (BE) // (CD).'}</MathText></li>
            <li>التمرين 24: المثلث المرسوم في نصف دائرة قطرها [AB] قائم في الرأس الثالث.</li>
          </ul>
        ) },
    ],
  },
};
