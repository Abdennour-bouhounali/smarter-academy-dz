import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `memo` — la FICHE DE MÉMOIRE (MemoCard) : ce qui CHANGE est en rouge (`R`). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'ikhtizal', type: 'methodes', title: 'اختزال كسر',
        memo: {
          rule: `\\dfrac{a}{b}=\\dfrac{a\\div${R('d')}}{b\\div${R('d')}}`,
          hook: 'اقسم الأعلى والأسفل معًا',
          example: `\\dfrac{84}{48}=\\dfrac{84\\div${R('12')}}{48\\div${R('12')}}=\\dfrac{7}{4}`,
          trap: 'القسمة على العدد في البسط فقط',
          exam: 'اكتب القاسم المشترك المستعمل في كل خطوة',
          chip: `\\tfrac{a}{b}=\\tfrac{a\\div${R('d')}}{b\\div${R('d')}}`,
          quiz: [
            { q: 'اختزال $\\frac{84}{48}$ بالقسمة على $4$ يعطي:', options: ['$\\frac{21}{48}$', '$\\frac{80}{44}$', '$\\frac{21}{12}$'], correct: 2 },
            { q: 'أيّ كسر يساوي $\\frac{18}{30}$؟', options: ['$\\frac{15}{27}$', '$\\frac{3}{5}$', '$\\frac{3}{10}$'], correct: 1 },
          ],
        },
        // « أتوقّع القاعدة » : ce que l'élève conclut de la recette 84/48 avant de lire la méthode.
        predictPrompt: 'في الوصفة وزّعتَ 84 ملعقة سكّر و 48 كوب دقيق على حصص متماثلة حتى وصلت إلى $\\frac{7}{4}$، كما فعل سمير بالعددين 4 ثم 3. أيّ عدد يصلح للقسمة في كل خطوة، وماذا يحدث لقيمة الكسر؟ اكتب طريقة الاختزال بكلماتك.',
        summary: 'نقسم البسط والمقام على قاسم مشترك لهما؛ قيمة الكسر لا تتغيّر.',
        body: <p>طريقة سمير: <MathText>{'$\\dfrac{84}{48} = \\dfrac{84 \\div 4}{48 \\div 4} = \\dfrac{21}{12} = \\dfrac{21 \\div 3}{12 \\div 3} = \\dfrac{7}{4}$'}</MathText>. كل قسمة على قاسم مشترك اختزال.</p> },
      { id: 'kasr-ghayr-qabil', type: 'concepts', title: 'كسر غير قابل للاختزال',
        memo: {
          rule: `\\dfrac{a}{b}\\,\\Leftrightarrow\\,\\mathrm{PGCD}(a\\,;\\,b)=${R('1')}`,
          hook: 'بسطه ومقامه أوليان فيما بينهما',
          example: `\\dfrac{7}{4}\\ :\\ \\mathrm{PGCD}(7\\,;\\,4)=${R('1')}`,
          trap: 'الحكم بالاختزال لأنّ أحد الحدّين غير أوليّ',
          exam: 'قل بسطه ومقامه أوليان فيما بينهما',
          chip: `\\mathrm{PGCD}=${R('1')}`,
          quiz: [
            { q: 'أيّ كسر غير قابل للاختزال؟', options: ['$\\frac{21}{12}$', '$\\frac{10}{25}$', '$\\frac{7}{4}$'], correct: 2 },
            { q: '$\\frac{9}{15}$ قابل للاختزال لأنّ:', options: ['بسطه أصغر من مقامه', '$\\mathrm{PGCD}(9\\ ;\\ 15)=3$', '$9$ و $15$ فرديان'], correct: 1 },
          ],
        },
        predictPrompt: 'في الوصفة استطعت أن توزّع $\\frac{21}{12}$ على حصص متماثلة أصغر، أمّا $\\frac{7}{4}$ فلم تستطع. ماذا يميّز العددين 7 و 4 عن العددين 21 و 12؟ اكتب بكلماتك متى نقول إنّ كسرًا غير قابل للاختزال، بدلالة بسطه ومقامه.',
        summary: 'بسطه ومقامه أوليان فيما بينهما (PGCD = 1).',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p></div> },
    ],
    2: [
      { id: 'ikhtizal-bil-pgcd', type: 'methodes', title: 'الاختزال بـ PGCD في خطوة واحدة',
        memo: {
          rule: `\\begin{gathered}\\dfrac{a}{b}=\\dfrac{a\\div${R('g')}}{b\\div${R('g')}}\\\\ g=\\mathrm{PGCD}(a\\,;\\,b)\\end{gathered}`,
          hook: 'اقسم على القاسم الأكبر دفعة واحدة',
          example: `\\dfrac{252}{140}=\\dfrac{252\\div${R('28')}}{140\\div${R('28')}}=\\dfrac{9}{5}`,
          trap: 'القسمة على قاسم صغير ثم نسيان المواصلة',
          exam: 'اكتب القاسم المشترك الأكبر ثم الكسر النهائي',
          chip: `\\tfrac{a\\div${R('g')}}{b\\div${R('g')}}`,
          quiz: [
            { q: 'الصورة غير القابلة للاختزال للكسر $\\frac{84}{48}$ هي:', options: ['$\\frac{21}{12}$', '$\\frac{7}{4}$', '$\\frac{42}{24}$'], correct: 1 },
            { q: 'لاختزال $\\frac{36}{60}$ في خطوة واحدة نقسم على:', options: ['$6$', '$4$', '$12$'], correct: 2 },
          ],
        },
        predictPrompt: 'في المناولة وصلتَ من $\\frac{84}{48}$ إلى $\\frac{7}{4}$ بقسمة واحدة: على أيّ عدد قسمت، وما علاقته بالعددين 84 و 48؟ اكتب طريقة تكتب بها أيّ كسر على الشكل غير القابل للاختزال في خطوة واحدة.',
        summary: 'نقسم البسط والمقام على قاسمهما المشترك الأكبر.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.remark}</MathText></p><p><MathText>{METHOD.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[1]}</MathText></p></div> },
      { id: 'tahaqquq-al-ikhtizal', type: 'memoriser', title: 'كيف أتأكد أنني انتهيت؟',
        memo: {
          rule: `\\mathrm{PGCD}(a\\,;\\,b)\\overset{?}{=}${R('1')}`,
          hook: 'تحقّق أنّ الناتج لا يُختزل',
          example: `\\tfrac{14}{21}\\to\\tfrac{2}{3}\\ :\\ \\mathrm{PGCD}(2\\,;\\,3)=${R('1')}`,
          trap: 'التوقف عند كسر ما زال قابلًا للاختزال',
          exam: 'تحقّق من أنّ بسط الناتج ومقامه أوليان فيما بينهما',
          chip: `\\mathrm{PGCD}\\overset{?}{=}${R('1')}`,
          quiz: [
            { q: 'نتوقف عن الاختزال عندما:', options: ['يصبح المقام عددًا أوليًا', 'بسط الكسر ومقامه أوليان فيما بينهما', 'يصبح البسط زوجيًا'], correct: 1 },
            { q: 'الصورة النهائية للكسر $\\frac{14}{21}$ هي:', options: ['$\\frac{4}{6}$', '$\\frac{14}{21}$', '$\\frac{2}{3}$'], correct: 2 },
          ],
        },
        predictPrompt: 'في السؤال السابق كان $\\frac{2}{3}$ هو الجواب، لا $\\frac{14}{21}$ ولا $\\frac{4}{6}$. بعد كل اختزال، كيف تتأكّد أنّك انتهيت ولا تحتاج إلى خطوة أخرى؟ جرّب على هذه الكسور الثلاثة، ثم اكتب الاختبار الذي تجريه على البسط والمقام.',
        summary: 'الكسر غير قابل للاختزال عندما يكون PGCD(البسط ; المقام) = 1.',
        body: <p>بعد الاختزال، نتحقق: هل بسط الكسر ومقامه أوليان فيما بينهما؟ إن نعم فقد انتهينا؛ وإلا نواصل.</p> },
    ],
  },
};
