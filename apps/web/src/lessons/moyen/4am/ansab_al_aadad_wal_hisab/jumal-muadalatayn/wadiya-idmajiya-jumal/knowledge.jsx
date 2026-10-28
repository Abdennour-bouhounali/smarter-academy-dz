import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, WARMUP } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `R(x)` : ce qui CHANGE dans la règle d'une fiche `memo`, en rouge. */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont
 * la DÉMARCHE du manuel (قراءة → ترييض → حل → تحقق).
 *   tahdid-majahil     module 7 — choisir les inconnues : les quantités DEMANDÉES (les deux prix)
 *   tarjamat-maalumat  module 7 — une information (une somme d'argent) → une équation
 *   ikhtiyar-tariqa    module 7 — simplifier, puis la méthode la plus efficace (التعويض / الجمع)
 *   tahaqquq-tafsir    module 7 — vérifier dans le TEXTE et rédiger la réponse avec son unité
 *   tariqat-wadiya     module 7 — la démarche complète en trois étapes (les mots du manuel)
 * Les exemples chiffrés sont ceux de la رحلة القسم (niveau مبتدئ) ; la SOLUTION du حفل
 * (25 DA et 50 DA) n'est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'tahdid-majahil', type: 'methodes', title: 'اختيار المجهولين', summary: 'نسمّي x و y الكميتين المطلوبتين في السؤال، هنا السعرين، لا الأعداد المعلومة في النص.',
        memo: {
          rule: `x\\,,\\ y\\ =\\ ${R('?')}`,
          hook: 'المجهول ما يسأل عنه السؤال',
          example: `x=${R('?')}\\ ,\\ y=${R('?')}`,
          trap: 'جعل عددين معلومين في النص مجهولين',
          exam: 'اكتب بالكلمات ما يمثّله كل حرف',
          chip: `x\\,,\\,y\\ :\\ ${R('?')}`,
          quiz: [
            { q: 'في الوضعية: «ما سعر علبة العصير وسعر قطعة الحلوى؟» المجهولان هما:', options: ['السعران', 'عدد العلب وعدد القطع', 'المبلغان 11250 و 2100'], correct: 0 },
            { q: 'لا نجعل مجهولًا:', options: ['عددًا معلومًا في النص مثل $150$', 'ما يسأل عنه السؤال', 'سعرًا مجهولًا'], correct: 0 },
          ],
        },
        body: (
          <div className="space-y-1">
            <p>نقرأ السؤال أولا: ما الذي نجهله ونبحث عنه؟ تلك هي المجاهيل.</p>
            <p><MathText>{REMARKS.majahil}</MathText></p>
          </div>
        ) },
      { id: 'tarjamat-maalumat', type: 'methodes', title: 'من معلومة إلى معادلة', summary: 'كل معلومة عن مبلغ تعطي معادلة: عدد كل شيء في سعره، والمجموع يساوي المبلغ المذكور.',
        memo: {
          rule: `${R('n_1')}x+${R('n_2')}y=${R('S')}`,
          hook: 'عدد في سعره ثم نجمع',
          example: `150x+150y=11250`,
          trap: 'جمع الأعداد دون ضربها في الأسعار',
          exam: 'اكتب معادلة لكل معلومة عن مبلغ',
          chip: `${R('n')}\\times${R('p')}`,
          quiz: [
            { q: 'اشترت البلدية 150 علبة عصير سعر الواحدة $x$ و 150 قطعة حلوى سعر الواحدة $y$ بمبلغ 11250 DA . المعادلة:', options: ['$150x + 150y = 11250$', '$x + y = 11250$', '$150 + 150 = 11250$'], correct: 0 },
            { q: 'بقيت 24 علبة و 30 قطعة وثمنها معًا 2100 DA :', options: ['$24x + 30y = 2100$', '$24y + 30x = 2100$', '$54x = 2100$'], correct: 0 },
          ],
        },
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li>نأخذ كل معلومة من النص على حدة: هنا معلومتان، كلتاهما عن مبلغ مدفوع.</li>
            <li>كل عدد يُضرب في سعر الشيء الذي يعدّه، ثم نجمع ونساوي بالمبلغ.</li>
            <li><MathText>{REMARKS.tarjamaRight}</MathText></li>
            <li>المعلومتان معا تعطيان جملة معادلتين: <MathText>{WARMUP.system}</MathText></li>
          </ol>
        ) },
      { id: 'ikhtiyar-tariqa', type: 'methodes', title: 'اختيار طريقة الحل الأنجع', summary: 'نبسّط المعادلة إن أمكن، ثم نعوّض إذا كان معامل أحد المجهولين 1، ونجمع إذا كان المعاملان متعاكسين أو يصيران كذلك.',
        memo: {
          rule: `\\begin{aligned}a=1&\\Rightarrow ${R('x=c-by')}\\\\a'=-a&\\Rightarrow ${R('E_1+E_2')}\\end{aligned}`,
          hook: 'بسّط ثم عوّض أو اجمع',
          example: `x+y=75\\Rightarrow ${R('x=75-y')}`,
          trap: 'التعويض دون تبسيط المعادلة أولًا',
          exam: 'اذكر الطريقة المختارة وسبب اختيارها',
          chip: `E_1${R('+')}E_2`,
          quiz: [
            { q: 'في الجملة $x + y = 75$ ، $24x + 30y = 2100$ الطريقة الأنسب:', options: ['التعويض: $x = 75 - y$', 'الجمع مباشرة دون أيّ تحضير', 'التخمين'], correct: 0 },
            { q: 'لنحذف مجهولًا بجمع $E_1$ و $E_2$ يجب أن يكون معاملا هذا المجهول:', options: ['متعاكسين', 'متساويين دائمًا', 'مساويين لـ 1 فقط'], correct: 0 },
          ],
        },
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.tabsit}</MathText></li>
            <li><MathText>{REMARKS.tariqa}</MathText></li>
          </ul>
        ) },
      { id: 'tahaqquq-tafsir', type: 'methodes', title: 'التحقق وتحرير الجواب', summary: 'نجد المجهولين معا، نتحقق من الثنائية في نص الوضعية نفسه، ثم نكتب الجواب بجملة وبوحدته.',
        memo: {
          rule: `(${R('x_0')}\\,;\\,${R('y_0')})\\ \\to\\ E_1,E_2`,
          hook: 'تحقّق ثم اكتب جملة بالوحدة',
          example: `24\\times25+30\\times50=${R('2100')}`,
          trap: 'نسيان وحدة النقود في الجواب',
          exam: 'اكتب الجواب بجملة تذكر السعرين ووحدتهما',
          chip: `(x_0\\,;\\,y_0)\\to${R('\\checkmark')}`,
          quiz: [
            { q: 'نتحقق من $(25 ; 50)$ في المعلومة الثانية: $24 \\times 25 + 30 \\times 50 =$', options: ['$2100$', '$1500$', '$600$'], correct: 0 },
            { q: 'الجواب المكتوب جيدًا:', options: ['سعر علبة العصير 25 دينارًا وسعر قطعة الحلوى 50 دينارًا', '(25 ; 50)', '25 و 50'], correct: 0 },
          ],
        },
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.nisfRight}</MathText></li>
            <li><MathText>{REMARKS.tahaqquq}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدد المعطيات والمطلوب، نختار المجهولين ونكتب الجملة، نحلها بطريقة مناسبة ثم نتحقق ونجيب.',
        memo: {
          rule: `${R('x,y')}\\to E_1,E_2\\to(x_0\\,;\\,y_0)`,
          hook: 'اقرأ · سمِّ · اكتب · حلّ · تحقّق',
          example: `(25\\,;\\,50)`,
          trap: 'الانطلاق في الحساب قبل قراءة المطلوب',
          exam: 'اذكر المعطيات والمطلوب قبل أي حساب',
          chip: `${R('x,y')}\\to${R('(x_0\\,;\\,y_0)')}`,
          quiz: [
            { q: 'نبدأ حل وضعية بـ:', options: ['قراءة النص وتحديد المعطيات والمطلوب', 'حل الجملة مباشرة', 'كتابة الجواب'], correct: 0 },
            { q: 'آخر ما نكتبه:', options: ['جملة جواب بوحدتها بعد التحقق', 'الجملة', 'المجهولين'], correct: 0 },
          ],
        },
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: {a.text}</li>)}
          </ol>
        ) },
    ],
  },
};
