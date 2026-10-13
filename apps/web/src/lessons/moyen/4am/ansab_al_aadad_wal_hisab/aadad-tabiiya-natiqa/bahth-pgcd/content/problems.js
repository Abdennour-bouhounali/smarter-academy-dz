/**
 * Les trois « مسائل » du درس 6 (modules 5, 6, 7) — des exercices COMPLETS de
 * type امتحان, résolus pas à pas (common/problems/GuidedProblem.jsx).
 *
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (`addition('exam_style_problem')`) :
 * le manuel ne les contient pas. Ils restent dans le périmètre de la leçon :
 * الفروق المتتابعة, خوارزمية إقليدس, les deux خاصيتان, le choix de la méthode —
 * plus l'acquis antérieur (PGCD = plus grand nombre de lots / plus grande
 * longueur commune, درس 4). Jamais les nombres أوليان فيما بينهما (درس 7) ni
 * la simplification de fractions (درس 8), jamais la décomposition en facteurs.
 *
 * La مسألة 1 est « مسألة الدرس » : son énoncé vit dans `LESSON_CONFIG.lessonProblem`
 * (montré dès le sommaire et rappelé au module 1, prolongement de l'atelier de
 * couture du niveau متقدم : deux rubans, les différences successives).
 *
 * 6 min chacune (la leçon est déjà à 71 min, plafond 90) : chemins courts.
 * Chaque nombre est vérifié par calcul dans ./problems.test.js.
 */
import { addition } from '../../_unit/unitMeta.js';
import { LESSON_CONFIG } from '../lesson.config.js';

const SOURCE = addition('exam_style_problem');

export const PROBLEMS = [
  {
    id: 'masala-1',
    title: 'مسألة 1 — ورشة الخياطة',
    context: LESSON_CONFIG.lessonProblem.title,
    headline: 'مسألة الدرس',
    emoji: '✂️',
    source: SOURCE,
    illustration: LESSON_CONFIG.lessonProblem.illustration,
    statement: LESSON_CONFIG.lessonProblem.statement,
    data: [
      { id: 'first', text: 'طول الشريط الأوّل 210 سم', useful: true },
      { id: 'second', text: 'طول الشريط الثاني 150 سم', useful: true },
      { id: 'pieces', text: 'قطع لها الطول نفسه، أطول ما يمكن، دون ضياع', useful: true },
      { id: 'price', text: '450 دج عن تزيين القندورة الواحدة بقطعة واحدة', useful: true },
      { id: 'days', text: 'الورشة مفتوحة 6 أيام في الأسبوع', useful: false },
      { id: 'gold', text: 'الشريطان مطرّزان بخيط ذهبي', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'أطول قطعة',
        question: 'باستعمال خوارزمية الفروق المتتابعة، احسب أطول طول ممكن للقطعة.',
        asks: ['أطول طول ممكن للقطعة'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'translate', requires: ['pgcd-taarif'],
            prompt: 'أطول طول ممكن لقطعة تقيس الشريطين معًا دون ضياع هو:',
            options: ['PGCD$(210 ; 150)$', 'الفرق $210 - 150$', 'أيّ قاسم مشترك للعددين 210 و 150', 'المجموع $210 + 150$'],
            correct: 0,
            explain: 'لا ضياع ⇔ طول القطعة يقسم 210 ويقسم 150: هو قاسم مشترك لهما، والأطول هو القاسم المشترك الأكبر.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-farq'],
            prompt: 'الفرق الأوّل:', expected: 60,
            explain: '$210 - 150 = 60$، إذن PGCD$(210 ; 150) = $ PGCD$(150 ; 60)$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-farq'],
            prompt: 'الفرق الثاني (نطرح دائمًا الأصغر من الأكبر):', expected: 90,
            explain: '$150 - 60 = 90$، إذن PGCD$(150 ; 60) = $ PGCD$(90 ; 60)$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-farq'],
            prompt: 'الفرق الثالث:', expected: 30,
            explain: '$90 - 60 = 30$، إذن PGCD$(90 ; 60) = $ PGCD$(60 ; 30)$.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['khwarizmiyat-al-furuq'],
            prompt: 'أطول طول ممكن للقطعة:', expected: 30, suffix: 'سم',
            explain: 'نواصل: $60 - 30 = 30$ ثم $30 - 30 = 0$. آخر فرق غير معدوم هو 30، إذن PGCD$(210 ; 150) = 30$.' },
          { kind: 'solution', ask: 0, lines: [
            'الفروق المتتابعة: $210 - 150 = 60$ ، $150 - 60 = 90$ ، $90 - 60 = 30$ ، $60 - 30 = 30$ ، $30 - 30 = 0$.',
            'آخر فرق غير معدوم هو 30، إذن PGCD$(210 ; 150) = 30$.',
            'أطول طول ممكن للقطعة هو 30 سم.',
          ] },
        ],
      },
      {
        label: '2)', title: 'اقتراحان آخران',
        question: 'اقترح صاحب الورشة قطعًا طولها 60 سم، واقترح ابنه قطعًا طولها 15 سم. أيّ الاقتراحين يسمح بقصّ الشريطين دون ضياع؟ علّل.',
        asks: ['أيّ الاقتراحين يسمح بالقصّ دون ضياع؟'],
        steps: [
          { kind: 'numeric', role: 'compute',
            prompt: 'باقي القسمة الإقليدية للعدد 210 على 60:', expected: 30,
            explain: '$210 = 60 \\times 3 + 30$ مع $30 < 60$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-taarif'],
            prompt: 'أكمل: $30 = 15 \\times \\ldots$', expected: 2,
            explain: '$15 \\times 2 = 30$: العدد 15 يقسم PGCD$(210 ; 150) = 30$.' },
          { kind: 'choice', role: 'conclude', ask: 0,
            prompt: 'أيّ الاقتراحين مناسب؟',
            options: [
              'اقتراح الابن فقط: 15 يقسم 30 فيقسم 210 و 150، أمّا 60 فلا يقسم 210',
              'اقتراح صاحب الورشة فقط: العدد 60 ظهر في سلسلة الفروق',
              'الاقتراحان معًا',
              'لا هذا ولا ذاك: الطول الوحيد الممكن هو 30 سم',
            ],
            correct: 0,
            explain: 'العدد 60 ظهر في سلسلة الفروق لكنّه ليس آخر فرق غير معدوم: يبقى 30 سم من الشريط الأوّل. أمّا 15 فقاسم للقاسم المشترك الأكبر 30، فهو قاسم مشترك للعددين 210 و 150 (قطع ممكنة، لكنّها ليست الأطول).' },
          { kind: 'solution', ask: 0, lines: [
            '$210 = 60 \\times 3 + 30$: الباقي ليس معدومًا، إذن 60 لا يقسم 210 ويضيع 30 سم من الشريط الأوّل.',
            '$30 = 15 \\times 2$: العدد 15 قاسم للعدد PGCD$(210 ; 150) = 30$، فهو قاسم مشترك للعددين 210 و 150.',
            'اقتراح الابن (15 سم) يسمح بالقصّ دون ضياع، واقتراح صاحب الورشة (60 سم) لا يسمح به.',
          ] },
        ],
      },
      {
        label: '3)', title: 'القطع والمبلغ',
        question: 'قصّت الخيّاطة الشريطين إلى أطول قطع ممكنة. كم قطعة تحصل عليها؟ وكم تتقاضى عن تزيين القنادير بكل القطع؟',
        asks: ['كم قطعة تحصل عليها؟', 'كم تتقاضى؟'],
        steps: [
          { kind: 'numeric', role: 'compute',
            prompt: 'عدد القطع من الشريط الأوّل:', expected: 7,
            explain: '$210 = 30 \\times 7$.' },
          { kind: 'numeric', role: 'compute',
            prompt: 'عدد القطع من الشريط الثاني:', expected: 5,
            explain: '$150 = 30 \\times 5$.' },
          { kind: 'numeric', role: 'answer', ask: 0,
            prompt: 'عدد القطع كلّها:', expected: 12,
            explain: '$7 + 5 = 12$.' },
          { kind: 'numeric', role: 'answer', ask: 1,
            prompt: 'المبلغ الذي تتقاضاه الخيّاطة:', expected: 5400, suffix: 'دج',
            explain: 'كل قطعة تزيّن قندورة واحدة: $12 \\times 450 = 5400$.' },
          { kind: 'solution', lines: [
            '$210 = 30 \\times 7$ و $150 = 30 \\times 5$، إذن عدد القطع $7 + 5 = 12$.',
            'المبلغ: $12 \\times 450 = 5400$.',
            'تحصل الخيّاطة على 12 قطعة طول كل منها 30 سم، وتتقاضى 5400 دج.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-2',
    title: 'مسألة 2 — صناديق التعاونية الحليبية',
    context: 'كم صندوقًا متماثلًا؟ وماذا في كل صندوق؟',
    emoji: '🧀',
    source: SOURCE,
    illustration: { kind: 'stacks', rows: [{ icon: 'crate', count: 1170, label: 'قطعة جبن' }, { icon: 'bottle', count: 702, label: 'قارورة لبن' }], ariaLabel: '1170 قطعة جبن و 702 قارورة لبن تُوضَّب في صناديق متماثلة' },
    statement: 'طلبت مديرية التربية من تعاونية حليبية بولاية ميلة تموين المطاعم المدرسية، حتى يتغذّى التلاميذ تغذية سليمة تعينهم على طلب العلم، فتعاون عمّال التعاونية على أداء هذه المهمّة. حضّرت التعاونية 1170 قطعة جبن و 702 قارورة لبن، ويعمل فيها 25 عاملًا. تريد التعاونية توضيب كل القطع وكل القارورات في أكبر عدد ممكن من الصناديق المتماثلة (في كل صندوق العدد نفسه من قطع الجبن والعدد نفسه من قارورات اللبن) دون أن يبقى شيء. ثمن قطعة الجبن 380 دج وثمن قارورة اللبن 110 دج، واشترطت المديرية ألّا تتجاوز قيمة الصندوق الواحد 2500 دج.',
    data: [
      { id: 'goods', text: '1170 قطعة جبن و 702 قارورة لبن', useful: true },
      { id: 'same', text: 'أكبر عدد ممكن من الصناديق المتماثلة دون أن يبقى شيء', useful: true },
      { id: 'prices', text: 'قطعة الجبن بـ 380 دج وقارورة اللبن بـ 110 دج', useful: true },
      { id: 'cap', text: 'قيمة الصندوق لا تتجاوز 2500 دج', useful: true },
      { id: 'workers', text: 'يعمل في التعاونية 25 عاملًا', useful: false },
      { id: 'place', text: 'التعاونية بولاية ميلة', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'خوارزمية إقليدس',
        question: 'باستعمال خوارزمية إقليدس، احسب PGCD$(1170 ; 702)$.',
        asks: ['PGCD$(1170 ; 702)$'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-baqi'],
            prompt: 'باقي القسمة الإقليدية للعدد 1170 على 702:', expected: 468,
            explain: '$1170 = 702 \\times 1 + 468$، إذن PGCD$(1170 ; 702) = $ PGCD$(702 ; 468)$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-baqi'],
            prompt: 'الباقي الثاني (قسمة 702 على الباقي الأوّل):', expected: 234,
            explain: '$702 = 468 \\times 1 + 234$، إذن PGCD$(702 ; 468) = $ PGCD$(468 ; 234)$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-baqi'],
            prompt: 'الباقي الثالث:', expected: 0,
            explain: '$468 = 234 \\times 2 + 0$: الباقي معدوم، انتهت الخوارزمية.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['khwarizmiyat-iqlidus'],
            prompt: 'PGCD$(1170 ; 702)$ يساوي:', expected: 234,
            explain: 'آخر باقٍ غير معدوم هو 234.' },
          { kind: 'solution', ask: 0, lines: [
            '$1170 = 702 \\times 1 + 468$ ، $702 = 468 \\times 1 + 234$ ، $468 = 234 \\times 2 + 0$.',
            'آخر باقٍ غير معدوم هو 234، إذن PGCD$(1170 ; 702) = 234$.',
          ] },
        ],
      },
      {
        label: '2)', title: 'الصناديق',
        question: 'استنتج أكبر عدد ممكن من الصناديق المتماثلة. كم قطعة جبن وكم قارورة لبن في كل صندوق؟',
        asks: ['أكبر عدد ممكن من الصناديق', 'عدد قطع الجبن في كل صندوق', 'عدد قارورات اللبن في كل صندوق'],
        steps: [
          { kind: 'choice', role: 'translate', requires: ['pgcd-taarif'],
            prompt: 'عدد الصناديق المتماثلة يجب أن يكون:',
            options: [
              'قاسمًا مشتركًا للعددين 1170 و 702، وأكبره PGCD$(1170 ; 702)$',
              'الباقي الأوّل 468',
              'مجموع القطع والقارورات $1170 + 702 = 1872$',
            ],
            correct: 0,
            explain: 'لا يبقى شيء ⇔ عدد الصناديق يقسم 1170 ويقسم 702: هو قاسم مشترك لهما، والأكبر هو القاسم المشترك الأكبر.' },
          { kind: 'numeric', role: 'answer', ask: 0,
            prompt: 'أكبر عدد ممكن من الصناديق:', expected: 234,
            explain: 'PGCD$(1170 ; 702) = 234$.' },
          { kind: 'numeric', role: 'answer', ask: 1,
            prompt: 'عدد قطع الجبن في كل صندوق:', expected: 5,
            explain: '$1170 = 234 \\times 5$.' },
          { kind: 'numeric', role: 'answer', ask: 2,
            prompt: 'عدد قارورات اللبن في كل صندوق:', expected: 3,
            explain: '$702 = 234 \\times 3$.' },
          { kind: 'solution', ask: 0, lines: [
            'عدد الصناديق قاسم مشترك للعددين 1170 و 702، وأكبره PGCD$(1170 ; 702) = 234$.',
            '$1170 = 234 \\times 5$ و $702 = 234 \\times 3$.',
            'توضّب التعاونية 234 صندوقًا، في كل صندوق 5 قطع جبن و 3 قارورات لبن.',
          ] },
        ],
      },
      {
        label: '3)', title: 'قيمة الصندوق',
        question: 'احسب قيمة محتوى الصندوق الواحد. هل احترمت التعاونية شرط المديرية؟',
        asks: ['قيمة محتوى الصندوق الواحد', 'هل احترمت التعاونية الشرط؟'],
        steps: [
          { kind: 'numeric', role: 'compute',
            prompt: 'ثمن قطع الجبن في الصندوق الواحد:', expected: 1900, suffix: 'دج',
            explain: '5 قطع: $5 \\times 380 = 1900$.' },
          { kind: 'numeric', role: 'compute',
            prompt: 'ثمن قارورات اللبن في الصندوق الواحد:', expected: 330, suffix: 'دج',
            explain: '3 قارورات: $3 \\times 110 = 330$.' },
          { kind: 'numeric', role: 'answer', ask: 0,
            prompt: 'قيمة محتوى الصندوق الواحد:', expected: 2230, suffix: 'دج',
            explain: '$1900 + 330 = 2230$.' },
          { kind: 'choice', role: 'conclude', ask: 1,
            prompt: 'هل احترمت التعاونية شرط المديرية؟',
            options: [
              'نعم: 2230 دج أقلّ من 2500 دج، بفارق 270 دج',
              'لا: قيمة كل الجبن وكل اللبن تتجاوز 2500 دج',
              'نعم: لأنّ $380 + 110 = 490$ أقلّ من 2500 دج',
            ],
            correct: 0,
            explain: 'الشرط يخصّ الصندوق الواحد بمحتواه كلّه (5 قطع و 3 قارورات، لا قطعة وقارورة فقط): $2500 - 2230 = 270$.' },
          { kind: 'solution', lines: [
            'في الصندوق 5 قطع جبن و 3 قارورات لبن: $5 \\times 380 + 3 \\times 110 = 1900 + 330 = 2230$.',
            'قيمة الصندوق الواحد 2230 دج، وهي أقلّ من 2500 دج: احترمت التعاونية شرط المديرية.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-3',
    title: 'مسألة 3 — تبليط قاعة',
    context: 'أكبر بلاطة مربّعة، وأنسب خوارزمية',
    emoji: '🧱',
    source: SOURCE,
    illustration: { kind: 'plan', shape: 'rect', fill: 'tile', w: 585, h: 405, unit: 'سم', grid: true, ariaLabel: 'أرضية قاعة مستطيلة طولها 585 سم وعرضها 405 سم تُبلَّط ببلاطات مربّعة متماثلة' },
    statement: 'في ورشة بناء دار الشباب، يريد البنّاء الأمين، الحريص على إتقان عمله واحترام موعد التسليم، تبليط أرضية قاعة مستطيلة الشكل طولها 585 سم وعرضها 405 سم، ببلاطات مربّعة متماثلة أكبر ما يمكن، دون قصّ أيّ بلاطة. ارتفاع جدران القاعة 290 سم. ثمن البلاطة الواحدة 280 دج، ويشتري البنّاء 10 بلاطات زيادة احتياطًا للكسر.',
    data: [
      { id: 'length', text: 'طول القاعة 585 سم', useful: true },
      { id: 'width', text: 'عرض القاعة 405 سم', useful: true },
      { id: 'tiles', text: 'بلاطات مربّعة متماثلة أكبر ما يمكن، دون قصّ', useful: true },
      { id: 'price', text: 'ثمن البلاطة 280 دج، و 10 بلاطات احتياطًا', useful: true },
      { id: 'height', text: 'ارتفاع الجدران 290 سم', useful: false },
      { id: 'site', text: 'الورشة في دار الشباب', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'أيّ خوارزمية؟',
        question: 'احسب PGCD$(585 ; 405)$. أيّ الخوارزميتين أنسب لهذين العددين؟',
        asks: ['PGCD$(585 ; 405)$', 'أيّ الخوارزميتين أنسب؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-baqi'],
            prompt: 'باقي القسمة الإقليدية للعدد 585 على 405:', expected: 180,
            explain: '$585 = 405 \\times 1 + 180$، إذن PGCD$(585 ; 405) = $ PGCD$(405 ; 180)$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-baqi'],
            prompt: 'الباقي الثاني (قسمة 405 على الباقي الأوّل):', expected: 45,
            explain: '$405 = 180 \\times 2 + 45$، إذن PGCD$(405 ; 180) = $ PGCD$(180 ; 45)$.' },
          { kind: 'numeric', role: 'compute', requires: ['pgcd-baqi'],
            prompt: 'الباقي الثالث:', expected: 0,
            explain: '$180 = 45 \\times 4 + 0$: الباقي معدوم، انتهت الخوارزمية.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['khwarizmiyat-iqlidus'],
            prompt: 'PGCD$(585 ; 405)$ يساوي:', expected: 45,
            explain: 'آخر باقٍ غير معدوم هو 45.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['ikhtiyar-al-tariqa'],
            prompt: 'أيّ الخوارزميتين أنسب هنا؟',
            options: [
              'خوارزمية إقليدس: 3 قسمات، بينما تلزم الفروق المتتابعة 7 طرحات',
              'الفروق المتتابعة: طرحتان فقط',
              'الخوارزميتان لا تعطيان النتيجة نفسها، فنختار الأصغر',
            ],
            correct: 0,
            explain: 'الفروق: $585 - 405 = 180$ ، $405 - 180 = 225$ ، $225 - 180 = 45$ ، $180 - 45 = 135$ ، $135 - 45 = 90$ ، $90 - 45 = 45$ ، $45 - 45 = 0$: سبع طرحات للنتيجة نفسها 45. القسمة $180 = 45 \\times 4$ تختصر وحدها أربع طرحات.' },
          { kind: 'solution', ask: 0, lines: [
            '$585 = 405 \\times 1 + 180$ ، $405 = 180 \\times 2 + 45$ ، $180 = 45 \\times 4 + 0$.',
            'آخر باقٍ غير معدوم هو 45، إذن PGCD$(585 ; 405) = 45$.',
            'خوارزمية إقليدس أنسب: 3 قسمات، بينما تلزم الفروق المتتابعة 7 طرحات للنتيجة نفسها.',
          ] },
        ],
      },
      {
        label: '2)', title: 'البلاطات',
        question: 'استنتج طول ضلع البلاطة، ثم احسب عدد البلاطات اللازمة لتبليط القاعة.',
        asks: ['طول ضلع البلاطة', 'عدد البلاطات اللازمة'],
        steps: [
          { kind: 'choice', role: 'translate', requires: ['pgcd-taarif'],
            prompt: 'طول ضلع البلاطة يجب أن يكون:',
            options: [
              'قاسمًا مشتركًا للعددين 585 و 405، وأكبره PGCD$(585 ; 405)$',
              'قاسمًا للطول 585 فقط',
              'الفرق $585 - 405 = 180$',
            ],
            correct: 0,
            explain: 'دون قصّ ⇔ عدد صحيح من البلاطات على الطول وعلى العرض: الضلع يقسم 585 ويقسم 405، والأكبر هو القاسم المشترك الأكبر.' },
          { kind: 'numeric', role: 'answer', ask: 0,
            prompt: 'طول ضلع البلاطة:', expected: 45, suffix: 'سم',
            explain: 'PGCD$(585 ; 405) = 45$.' },
          { kind: 'numeric', role: 'compute',
            prompt: 'عدد البلاطات على طول القاعة:', expected: 13,
            explain: '$585 = 45 \\times 13$.' },
          { kind: 'numeric', role: 'compute',
            prompt: 'عدد البلاطات على عرض القاعة:', expected: 9,
            explain: '$405 = 45 \\times 9$.' },
          { kind: 'numeric', role: 'answer', ask: 1,
            prompt: 'عدد البلاطات اللازمة:', expected: 117,
            explain: '13 صفًّا من 9 بلاطات: $13 \\times 9 = 117$.' },
          { kind: 'solution', ask: 0, lines: [
            'ضلع البلاطة قاسم مشترك للعددين 585 و 405، وأكبره PGCD$(585 ; 405) = 45$: ضلع البلاطة 45 سم.',
            '$585 = 45 \\times 13$ و $405 = 45 \\times 9$.',
            'عدد البلاطات اللازمة: $13 \\times 9 = 117$ بلاطة.',
          ] },
        ],
      },
      {
        label: '3)', title: 'ثمن البلاط',
        question: 'ما المبلغ الذي يدفعه البنّاء لشراء البلاط؟',
        asks: ['المبلغ الذي يدفعه البنّاء'],
        steps: [
          { kind: 'numeric', role: 'compute',
            prompt: 'عدد البلاطات التي يشتريها البنّاء:', expected: 127,
            explain: 'البلاطات اللازمة والاحتياط: $117 + 10 = 127$.' },
          { kind: 'numeric', role: 'answer', ask: 0,
            prompt: 'المبلغ الذي يدفعه البنّاء:', expected: 35560, suffix: 'دج',
            explain: '$127 \\times 280 = 35560$.' },
          { kind: 'solution', lines: [
            'يشتري البنّاء $117 + 10 = 127$ بلاطة.',
            'المبلغ: $127 \\times 280 = 35560$، أي 35560 دج.',
          ] },
        ],
      },
    ],
  },
];

export const PROBLEM = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
