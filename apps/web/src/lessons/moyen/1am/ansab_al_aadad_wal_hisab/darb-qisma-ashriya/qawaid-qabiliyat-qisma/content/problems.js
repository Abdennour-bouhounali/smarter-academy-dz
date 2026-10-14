/**
 * Les trois « مسائل » du درس « قواعد قابلية القسمة » (modules 6, 7, 8) — exercices COMPLETS de type اختبار الفصل,
 * résolus pas à pas (GuidedProblem). AJOUTS DE LA PLATEFORME (`addition('exam_style_problem')`). Périmètre : les règles de
 * 2, 3, 4, 5, 9, « يقبل القسمة » = reste nul, l'année bissextile. La مسألة 1 (`LESSON_CONFIG.lessonProblem`) prolonge les
 * cartes de chiffres du niveau متقدم. Chaque nombre est vérifié dans ./problems.test.js.
 */
import { addition } from '../../_unit/unitMeta.js';
import { LESSON_CONFIG } from '../lesson.config.js';

const SOURCE = addition('exam_style_problem');
const YES_NO = ['يقبل القسمة', 'لا يقبل القسمة'];

export const PROBLEMS = [
  {
    id: 'masala-1',
    title: 'مسألة 1 — الرمز السرّي',
    context: LESSON_CONFIG.lessonProblem.title,
    headline: 'مسألة الدرس',
    emoji: '🔐',
    tone: 'indigo',
    source: SOURCE,
    illustration: LESSON_CONFIG.lessonProblem.illustration,
    statement: LESSON_CONFIG.lessonProblem.statement,
    data: [
      { id: 'cards', text: 'البطاقات 2 ، 7 ، 5 ، 1', useful: true },
      { id: 'all', text: 'تُستعمل البطاقات كلّها دون تكرار', useful: true },
      { id: 'members', text: 'في النادي 14 عضوًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'القسمة على 5',
        question: LESSON_CONFIG.lessonProblem.questions[0].text,
        asks: ['ما أكبر رمز يقبل القسمة على 5؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'translate', requires: ['qabiliya-2-5'],
            prompt: 'لكي يقبل الرمز القسمة على 5، يجب أن يكون رقم آحاده:',
            options: ['5 ، لأنّه لا توجد بطاقة 0', '1 أو 7', 'أيّ رقم من البطاقات'],
            correct: 0,
            explain: 'يقبل العدد القسمة على 5 إذا كان رقم آحاده 0 أو 5.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'أكبر رمز يقبل القسمة على 5:', expected: 7215,
            explain: 'رقم الآحاد 5، ثم نرتّب 7 ، 2 ، 1 من الأكبر إلى الأصغر.' },
          { kind: 'solution', ask: 0, lines: [
            'يقبل الرمز القسمة على 5 إذا كان رقم آحاده 0 أو 5، ولا توجد بطاقة 0: رقم الآحاد 5.',
            'نضع البطاقات الباقية 7 ، 2 ، 1 من الأكبر إلى الأصغر: أكبر رمز هو 7215.',
          ] },
        ],
      },
      {
        label: '2)', title: 'القسمة على 3 وعلى 9',
        question: LESSON_CONFIG.lessonProblem.questions[1].text,
        asks: ['كل رمز يقبل القسمة على 3', 'هل يقبل أحدها القسمة على 9؟'],
        steps: [
          { kind: 'numeric', role: 'compute', requires: ['qabiliya-3'], prompt: 'مجموع أرقام أيّ رمز:', expected: 15,
            explain: '$2 + 7 + 5 + 1 = 15$ ، مهما كان ترتيب البطاقات.' },
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['qabiliya-3'],
            prompt: 'ماذا تستنتج للقسمة على 3؟',
            options: ['كل رمز يقبل القسمة على 3، لأنّ مجموع أرقامه 15 دائمًا', 'بعض الرموز فقط تقبل القسمة على 3', 'لا رمز يقبل القسمة على 3'],
            correct: 0,
            explain: '15 يقبل القسمة على 3، وتغيير الترتيب لا يغيّر المجموع.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['qabiliya-9'],
            prompt: 'هل يقبل أحد الرموز القسمة على 9؟',
            options: ['لا: 15 لا يقبل القسمة على 9، والمجموع لا يتغيّر بالترتيب', 'نعم: الرمز 7521', 'نعم: الرمز 1257'],
            correct: 0,
            explain: '$15 = 9 \\times 1 + 6$ : لا رمز يقبل القسمة على 9.' },
          { kind: 'solution', ask: 0, lines: [
            'مجموع أرقام كل رمز $2 + 7 + 5 + 1 = 15$ ، و 15 يقبل القسمة على 3: كل رمز يقبل القسمة على 3.',
            '15 لا يقبل القسمة على 9: لا رمز يقبل القسمة على 9.',
          ] },
        ],
      },
      {
        label: '3)', title: 'القسمة على 4',
        question: LESSON_CONFIG.lessonProblem.questions[2].text,
        asks: ['ما أكبر رمز يقبل القسمة على 4؟'],
        steps: [
          { kind: 'choice', role: 'translate', requires: ['qabiliya-4'],
            prompt: 'لكي يقبل الرمز القسمة على 4، ننظر إلى:',
            options: ['العدد المشكّل من رقميه الأخيرين', 'رقم آحاده فقط', 'مجموع أرقامه'],
            correct: 0,
            explain: 'قاعدة القسمة على 4: العدد المشكّل من رقمي الآحاد والعشرات.' },
          { kind: 'choice', role: 'translate', requires: ['qabiliya-4'],
            prompt: 'من بين النهايات الممكنة بالبطاقات، أيّها تقبل القسمة على 4؟',
            options: ['12 ، 52 ، 72', '12 و 72 فقط', '72 فقط'],
            correct: 0,
            explain: '$12 = 4 \\times 3$ ، $52 = 4 \\times 13$ ، $72 = 4 \\times 18$ ؛ أمّا 15 ، 17 ، 21 ، 25 ، 27 ، 51 ، 57 ، 71 ، 75 فلا.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'أكبر رمز يقبل القسمة على 4:', expected: 7512,
            explain: 'مع 12 نضع 7 ثم 5: 7512 ؛ مع 52: 7152 ؛ مع 72: 5172. الأكبر 7512.' },
          { kind: 'solution', ask: 0, lines: [
            'النهايات التي تقبل القسمة على 4 هي 12 ، 52 ، 72، وأكبر رمز لكل منها: 7512 ، 7152 ، 5172.',
            'أكبر رمز يقبل القسمة على 4 هو 7512 ($7512 = 4 \\times 1878$).',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-2',
    title: 'مسألة 2 — قفّة رمضان',
    context: 'توزيع بالتساوي',
    emoji: '🌙',
    tone: 'amber',
    source: SOURCE,
    illustration: { kind: 'scene', icon: 'crate', bg: 'amber', chips: [{ label: 'علب التمر', value: 2340, tone: 'amber' }, { label: 'إضافة عائلة محسنة', value: 15, tone: 'green' }, { label: 'كتلة العلبة', value: 500, unit: 'g', tone: 'slate' }], ariaLabel: 'علب تمر عددها 2340، تضيف إليها عائلة محسنة 15 علبة، وكتلة العلبة 500 غرام' },
    statement: 'جمعت تعاونية المتوسطة 2340 علبة تمر لقفّة رمضان، تضامنًا مع العائلات المحتاجة، وكتلة العلبة الواحدة 500 g. تريد توزيعها بالتساوي على جمعيات خيرية، دون أن تبقى أيّ علبة.',
    data: [
      { id: 'boxes', text: 'جمعت التعاونية 2340 علبة تمر', useful: true },
      { id: 'equal', text: 'توزيع بالتساوي دون أن تبقى أيّ علبة', useful: true },
      { id: 'mass', text: 'كتلة العلبة الواحدة 500 غرام', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'على 4 أو على 9 جمعيات؟',
        question: 'هل يمكن توزيع العلب بالتساوي على 4 جمعيات؟ على 9 جمعيات؟ علّل دون إجراء القسمة.',
        asks: ['على 4 جمعيات؟', 'على 9 جمعيات؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['qabiliya-4'],
            prompt: 'على 4 جمعيات:',
            options: ['ممكن: 40 يقبل القسمة على 4', 'غير ممكن: 2340 لا ينتهي بالرقم 4', 'غير ممكن: مجموع أرقامه 9'],
            correct: 0,
            explain: 'العدد المشكّل من الرقمين الأخيرين 40 ، و $40 = 4 \\times 10$.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['qabiliya-9'],
            prompt: 'على 9 جمعيات:',
            options: ['ممكن: $2 + 3 + 4 + 0 = 9$', 'غير ممكن: رقم آحاده 0', 'غير ممكن: 2340 عدد زوجي'],
            correct: 0,
            explain: 'مجموع الأرقام 9 يقبل القسمة على 9.' },
          { kind: 'solution', ask: 0, lines: [
            'العدد المشكّل من رقمي الآحاد والعشرات 40 يقبل القسمة على 4: التوزيع على 4 جمعيات ممكن.',
            'مجموع الأرقام $2 + 3 + 4 + 0 = 9$ يقبل القسمة على 9: التوزيع على 9 جمعيات ممكن.',
          ] },
        ],
      },
      {
        label: '2)', title: 'بعد الإضافة',
        question: 'أضافت عائلة محسنة 15 علبة. على أيّ الأعداد 2 ، 3 ، 4 ، 5 ، 9 يقبل العدد الجديد للعلب القسمة؟',
        asks: ['على أيّ الأعداد يقبل العدد الجديد القسمة؟'],
        steps: [
          { kind: 'numeric', role: 'compute', prompt: 'العدد الجديد للعلب:', expected: 2355,
            explain: '$2340 + 15 = 2355$.' },
          { kind: 'batch', role: 'answer', ask: 0, requires: ['qabiliya-2-5', 'qabiliya-3', 'qabiliya-4'],
            prompt: 'العدد الجديد للعلب:',
            rows: [
              { label: 'على 2', options: YES_NO, correct: 1, correction: 'رقم آحاده 5: عدد فردي.' },
              { label: 'على 3', options: YES_NO, correct: 0, correction: 'مجموع أرقامه $2 + 3 + 5 + 5 = 15$.' },
              { label: 'على 4', options: YES_NO, correct: 1, correction: '55 لا يقبل القسمة على 4.' },
              { label: 'على 5', options: YES_NO, correct: 0, correction: 'رقم آحاده 5.' },
              { label: 'على 9', options: YES_NO, correct: 1, correction: '15 لا يقبل القسمة على 9.' },
            ] },
          { kind: 'solution', ask: 0, lines: [
            '$2340 + 15 = 2355$ : رقم آحاده 5 ومجموع أرقامه 15 والعدد المشكّل من رقميه الأخيرين 55.',
            'يقبل القسمة على 3 وعلى 5 فقط من بين 2 ، 3 ، 4 ، 5 ، 9.',
          ] },
        ],
      },
      {
        label: '3)', title: 'على 5 جمعيات',
        question: 'وُزّعت العلب الجديدة بالتساوي على 5 جمعيات. كم علبة تأخذ كل جمعية؟ عبّر عن ذلك بمساواة قسمة إقليدية.',
        asks: ['كم علبة لكل جمعية؟', 'المساواة'],
        steps: [
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['qabiliya-baqi'], prompt: 'عدد العلب لكل جمعية:', expected: 471,
            explain: '$5 \\times 471 = 2355$.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['qabiliya-baqi'],
            prompt: 'أيّ مساواة تعبّر عن هذه القسمة الإقليدية؟',
            options: ['$2355 = 5 \\times 471 + 0$', '$2355 = 5 \\times 470 + 5$', '$2355 = 5 \\times 471 + 5$'],
            correct: 0, cols: 1,
            explain: 'الباقي معدوم لأنّ 2355 يقبل القسمة على 5 ؛ في الثانية الباقي 5 ليس أصغر من 5 ، والثالثة خاطئة حسابيًا.' },
          { kind: 'solution', ask: 0, lines: [
            '$2355 = 5 \\times 471 + 0$ : الباقي معدوم.',
            'تأخذ كل جمعية 471 علبة، ولا تبقى أيّ علبة.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-3',
    title: 'مسألة 3 — رزنامة نادي الفلك',
    context: 'السنوات الكبيسة',
    emoji: '🔭',
    tone: 'violet',
    source: SOURCE,
    illustration: { kind: 'timeline', icon: 'book', title: 'رزنامات نادي الفلك', marks: [{ label: 'أوّل سنة', value: 2024 }, { label: 'آخر سنة', value: 2027 }, { label: 'أيام سنة عادية', value: 365 }], ariaLabel: 'رزنامات للسنوات من 2024 إلى 2027، والسنة العادية 365 يومًا' },
    statement: 'يحضّر أعضاء نادي الفلك رزنامات للسنوات من 2024 إلى 2027، يهدونها لمكتبة المتوسطة نشرًا للعلم. السنة العادية 365 يومًا والسنة الكبيسة 366 يومًا. في النادي 23 عضوًا.',
    data: [
      { id: 'years', text: 'السنوات من 2024 إلى 2027', useful: true },
      { id: 'days', text: 'السنة العادية 365 يومًا والكبيسة 366 يومًا', useful: true },
      { id: 'members', text: 'في النادي 23 عضوًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'أيّ السنوات كبيسة؟',
        question: 'من بين السنوات 2024 ، 2025 ، 2026 ، 2027 ، ما السنة الكبيسة؟ علّل.',
        asks: ['ما السنة الكبيسة؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['qabiliya-4'],
            prompt: 'السنة الكبيسة هي:',
            options: ['2024 وحدها', '2024 و 2026', 'لا سنة منها'],
            correct: 0,
            explain: '24 يقبل القسمة على 4 ؛ 25 و 27 فرديان، و $26 = 4 \\times 6 + 2$.' },
          { kind: 'solution', ask: 0, lines: [
            'العدد المشكّل من الرقمين الأخيرين: 24 يقبل القسمة على 4، و 25 ، 26 ، 27 لا تقبلها.',
            'السنة الكبيسة الوحيدة هي 2024.',
          ] },
        ],
      },
      {
        label: '2)', title: 'عدد الأيام',
        question: 'كم يومًا في السنوات الأربع معًا؟ أجرِ القسمة الإقليدية لهذا العدد على 7: كم أسبوعًا كاملًا؟',
        asks: ['كم يومًا في السنوات الأربع؟', 'كم أسبوعًا كاملًا؟'],
        steps: [
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد الأيام:', expected: 1461,
            explain: '$366 + 365 + 365 + 365 = 1461$.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qabiliya-baqi'], prompt: 'عدد الأسابيع الكاملة:', expected: 208,
            explain: '$7 \\times 208 = 1456$ و $1461 - 1456 = 5$.' },
          { kind: 'solution', ask: 0, lines: [
            'السنوات الأربع: $366 + 3 \\times 365 = 1461$ يومًا.',
            '$1461 = 7 \\times 208 + 5$ : 208 أسابيع كاملة و 5 أيام.',
          ] },
        ],
      },
      {
        label: '3)', title: 'سنوات القرون',
        question: 'هل ستكون السنة 2100 كبيسة؟ والسنة 2400؟ علّل.',
        asks: ['السنة 2100؟', 'السنة 2400؟'],
        steps: [
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['qabiliya-4'],
            prompt: 'السنة 2100:',
            options: ['ليست كبيسة: 2100 يقبل القسمة على 100 ولا يقبلها على 400', 'كبيسة: 00 يقبل القسمة على 4', 'كبيسة: 21 فردي'],
            correct: 0,
            explain: '$2100 = 400 \\times 5 + 100$ : الباقي ليس معدومًا.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['qabiliya-4'],
            prompt: 'السنة 2400:',
            options: ['كبيسة: 2400 يقبل القسمة على 400', 'ليست كبيسة: 2400 يقبل القسمة على 100', 'ليست كبيسة: 24 زوجي'],
            correct: 0,
            explain: '$2400 = 400 \\times 6$.' },
          { kind: 'solution', ask: 0, lines: [
            '2100 يقبل القسمة على 100 ولا يقبلها على 400: ليست كبيسة.',
            '2400 يقبل القسمة على 400: سنة كبيسة.',
          ] },
        ],
      },
    ],
  },
];

export const PROBLEM = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
