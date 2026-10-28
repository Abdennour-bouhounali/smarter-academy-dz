import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { STEPS, TRANSLATION_RULE, CHECK_RULE, ACTIVITY_SOLUTION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `R(x)` : ce qui CHANGE dans la règle d'une fiche `memo`, en rouge. */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/**
 * Les connaissances du درس 3 « حل مشكلات بتوظيف جمل معادلتين » — SOURCE UNIQUE, construite à partir
 * de نشاط 3 (le musée, p. 57) et de son tableau (content/textbook.js). Une <KnowledgeBrick id="…">
 * dans un module et la carte rendent le même objet.
 *
 *   module 1  jumla-tarjama   ce que le laboratoire a fait : une information → une équation, une
 *                             seule unité par équation (des personnes, des dinars)
 *             khutuwat-hall   les cinq étapes du tableau du manuel
 *   module 2  tahaqquq-nas    on vérifie dans l'HISTOIRE (pas seulement dans la jumla), la réponse a
 *                             un sens (un nombre de personnes est naturel), et on répond par une phrase
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jumla-tarjama', type: 'concepts', title: 'ترجمة مشكلة بجملة معادلتين',
        memo: {
          rule: `\\begin{cases}${R('1')}x+${R('1')}y=N\\\\${R('p')}x+${R('q')}y=S\\end{cases}`,
          hook: 'وحدة واحدة في المعادلة',
          example: `\\begin{cases}x+y=140\\\\300x+150y=30300\\end{cases}`,
          trap: 'مساواة مبلغ بعدد أشخاص',
          exam: 'اكتب المجهولين ثم معادلة لكل معلومة',
          chip: `x+y=N\\ ,\\ ${R('p')}x+${R('q')}y=S`,
          quiz: [
            { q: 'في المعادلة التي تعدّ الزوار نكتب:', options: ['$x + y = 140$', '$300x + 150y = 140$', '$x + y = 30300$'], correct: 0 },
            { q: 'المعادلة $300x + 150y = 30300$ تجمع:', options: ['مبالغ بالدينار', 'أشخاصًا', 'أشخاصًا ومبالغ معًا'], correct: 0 },
          ],
        },
        predictPrompt: 'في المختبر رفض المتحف أن تضع 300 أو 150 في معادلة «140 زائرا»، وقبلهما في معادلة المداخيل 30300. كيف تترجم قصة فيها مجهولان إلى جملة معادلتين؟ اكتب القاعدة بكلماتك: من أين تأتي كل معادلة، وأيّ الأعداد تجتمع في المعادلة الواحدة؟',
        summary: 'نسمّي المجهولين x و y، ونترجم كل معلومة من النص بمعادلة بدلالتهما، بوحدة واحدة في المعادلة الواحدة: عدد مع عدد، ودنانير مع دنانير.',
        body: (
          <div className="space-y-2">
            <p><MathText>{TRANSLATION_RULE.text}</MathText></p>
            <p className="text-sm text-slate-600" dir="ltr"><MathText>{ACTIVITY_SOLUTION.system}</MathText></p>
          </div>
        ),
      },
      {
        id: 'khutuwat-hall', type: 'methodes', title: 'مراحل حل مشكلة بجملة معادلتين',
        memo: {
          rule: `x,y\\to E_1,E_2\\to(x_0\\,;\\,y_0)`,
          hook: 'اختر · ترجم · حلّ · تحقّق · أجب',
          example: `x+y=140\\to(62\\,;\\,78)`,
          trap: 'نسيان التحقق أو ترك العددين دون جملة',
          exam: 'رتّب المراحل الخمس بعناوينها على الورقة',
          chip: `${R('1')}\\to${R('2')}\\to${R('3')}\\to${R('4')}\\to${R('5')}`,
          quiz: [
            { q: 'أولى مراحل حل مشكلة بجملة معادلتين:', options: ['اختيار المجهولين', 'حل الجملة', 'التحقق'], correct: 0 },
            { q: 'المرحلة التي تأتي بعد حل الجملة:', options: ['التحقق من النتيجة في النص', 'اختيار المجهولين', 'ترجمة المعلومات'], correct: 0 },
          ],
        },
        // Les cinq étapes SONT le tableau du manuel (StepsTable, colonne « مراحل الحل »), à l'écran dès
        // l'étape 1 du module, et les titres des étapes 1 → 4 les nomment : une prédiction ne ferait
        // que recopier le tableau. La règle prédictible du module 1 est jumla-tarjama.
        predict: false,
        summary: 'خمس مراحل: نختار المجهولين، نترجم المشكلة بجملة معادلتين، نحل الجملة بطريقة مناسبة، نتحقق من النتيجة، ثم نجيب عن السؤال.',
        body: (
          <ol className="space-y-1">
            {[STEPS.choose, STEPS.translate, STEPS.solve, STEPS.check, STEPS.answer].map((s) => <li key={s}><MathText>{s}</MathText></li>)}
          </ol>
        ),
      },
    ],
    2: [
      {
        id: 'tahaqquq-nas', type: 'regles', title: 'نتحقق في نص المشكلة ونجيب بجملة',
        memo: {
          rule: `x,y\\in${R('\\mathbb{N}')}\\ ,\\ x+y=N`,
          hook: 'تحقّق في النص ثم أجب بجملة',
          example: `24+13=37\\ ,\\ 20\\times24+10\\times13=610`,
          trap: 'الاكتفاء بالثنائية دون جملة جواب',
          exam: 'اكتب جملة تذكر كل عدد مع ما يمثّله',
          chip: `x\\in${R('\\mathbb{N}')}`,
          quiz: [
            { q: 'وجدنا $x = 2{,}5$ شخصًا في مسألة عن أشخاص. نحكم:', options: ['الجواب مرفوض: عدد الأشخاص طبيعي', 'الجواب مقبول لأنه يحقّق الجملة', 'نقرّبه إلى 3'], correct: 0 },
            { q: 'الثنائية $(24 ; 13)$ في مسألة 37 قطعة و 610 DA : نتحقق من:', options: ['$24 + 13 = 37$ و $20 \\times 24 + 10 \\times 13 = 610$', '$24 + 13 = 610$', '$24 \\times 13 = 37$'], correct: 0 },
          ],
        },
        predictPrompt: 'في التحدّي وجدت 24 قطعة من فئة 20 و 13 قطعة من فئة 10، لكنّ العددين مقلوبين يعطيان هما أيضًا 37 قطعة. أين تعوّض العددين لتتحقّق من النتيجة؟ وما الذي يجب أن يتحقّق فيهما ليكونا جوابًا عن القصة، وكيف تكتب هذا الجواب؟ اكتب القاعدة بكلماتك.',
        summary: 'نعوّض العددين في معطيات النص نفسه، ونتأكد أن الجواب يلائم القصة (عدد أشخاص أو قطع يكون عددا طبيعيا)، ثم نجيب عن السؤال بجملة تذكر العددين.',
        body: <p><MathText>{CHECK_RULE.text}</MathText></p>,
      },
    ],
  },
};
