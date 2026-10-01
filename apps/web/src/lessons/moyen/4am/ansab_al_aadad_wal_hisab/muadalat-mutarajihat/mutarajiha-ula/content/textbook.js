/**
 * Le contenu du MANUEL pour le درس 3 « المتراجحات من الدرجة الأولى بمجهول واحد وتمثيل
 * حلولها بيانيًا » — données pures (aucun JSX), au mot près ; chaque bloc cite son élément
 * de docs/sources/4am/unit4/extraction.json. Les modules rendent ces données ; ils n'en
 * réécrivent aucune.
 *
 * Deux éléments portent une `correction` (politique du propriétaire, 2026-10-01) :
 *   know-3 (exemple 2) « قد يتغير » → « قد تغيّر » — même tournure dans know-4 (exemple 2,
 *   discrepancy de know-3) : corrigée de même ;
 *   method-inequality (solution ب) « (3x − 2)/6 » → « (3x + 2)/6 » dans les deux conclusions.
 * La leçon affiche la version CORRIGÉE et une seule ligne discrète.
 *
 * Les crochets du manuel « [ » / « ] » sont écrits en îlots mathématiques ($[$, $]$) :
 * dans une phrase arabe, un crochet nu est MIROIRÉ par l'algorithme bidi et se lirait à
 * l'envers — exactement l'information que la leçon enseigne.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 3 (p. 45), première partie — « المتراجحة وحلولها » : les messages d'يونس. */
export const ACTIVITY = {
  source: src('act-3a', 45, 'أنشطة', 3),
  title: 'المتراجحات من الدرجة الأولى بمجهول واحد',
  text: 'بمناسبة عيد الفطر، وتسهيلا لعملية التواصل عبر الرسائل النصية، اقترح متعامل للهاتف النقال العرض الآتي على زبائنه: 2,5DA للرسالة الواحدة و 100DA اقتطاع جزافي من الرصيد. يرغب يونس في عدم تجاوز المبلغ 150DA الموجود في رصيده.',
  questions: [
    '1) هل يمكن ليونس القيام بإرسال: أ) 21 رسالة؟ ب) 20 رسالة؟ جـ) 16 رسالة؟',
    '2) نرمز إلى عدد الرسائل القصيرة بالرمز $x$ . أ) من بين المتباينات الآتية، حدّد تلك التي توافق رغبة يونس : $150x + 100 \\leq 2{,}5$ ، $150x - 100 \\leq 2{,}5$ ، $2{,}5x + 100 \\leq 150$ .',
    'ب) اقترح قيمة لـ $x$ توافق رغبة يونس، وقيمة أخرى لـ $x$ لا توافقها.',
    'جـ) هل العدد 2 حل للمتراجحة $2{,}5x + 100 \\leq 150$ ؟ السؤال نفسه من أجل العدد 21.',
  ],
  box: [
    'كل متباينة من المتباينات الثلاثة السّابقة تُسمّى متراجحة ذات المجهول $x$ .',
    'كل قيمة لـ $x$ تجعل المتراجحة متباينة صحيحة، تُسمّى حلاً لهذه المتراجحة.',
  ],
  closing: 'كل قيمة لـ $x$ تجعل المتراجحة متباينة صحيحة، تُسمّى حلاً لهذه المتراجحة.',
  // Les nombres du livre (les calculs sont faits par le laboratoire et les modules).
  numbers: { perMessage: '2,5', fixed: 100, credit: 150, asked: [21, 20, 16], candidates: ['150x+100<=2,5', '150x-100<=2,5', '2,5x+100<=150'], tests: [2, 21] },
  ineq: '2,5x+100<=150',
};

/** نشاط 3 (p. 45), seconde partie — « حل متراجحة » : −3x + 5 ≤ 20 et le tableau. */
export const ACTIVITY_B = {
  source: src('act-3b', 45, 'أنشطة', 3),
  title: 'حل متراجحة وتمثيل حلولها على مستقيم مدرّج',
  text: 'حل متراجحة : نريد فيما يأتي حل المتراجحة $-3x + 5 \\leq 20$ وتمثيل حلولها على مستقيم مدرّج.',
  questions: [
    '1) انقل ثمّ أتمم مبرّرا كل خطوة تقوم بها: $-3x + 5 \\leq 20$ ← الخطوة 1 $(-\\ldots)$ ← $-3x \\ldots 15$ ← الخطوة 2 $(\\div \\ldots)$ ← $x \\ldots -5$',
    '2) نقبل أنّ حلول المتراجحة $-3x + 5 \\leq 20$ هي نفسها حلول المتراجحة $x \\geq -5$ . اعتمادا على محتوى السطرين الأول والثاني من الجدول الآتي، أتمم السطر الأخير.',
  ],
  table: [
    { inequality: '$x < 3$', words: 'كل قيم $x$ الأصغر من 3', graph: 'الجزء الملوّن على يسار 3، والرمز $[$ عند 3', figure: { from: -1, to: 7, at: 3, side: 'left', closed: false } },
    { inequality: '$x \\geq 2$', words: 'كل قيم $x$ الأكبر من أو تساوي 2', graph: 'الجزء الملوّن على يمين 2، والرمز $[$ عند 2', figure: { from: -2, to: 8, at: 2, side: 'right', closed: true } },
  ],
  lastRow: '$-3x + 5 \\leq 20$',
  ineq: '-3x+5<=20',
  words: 'كل قيم $x$ الأكبر من أو تساوي $-5$',
  steps: ['نطرح 5 من الطرفين: $-3x \\leq 15$', 'نقسم الطرفين على $-3$ (عدد سالب، نغيّر الاتجاه): $x \\geq -5$'],
};

/** معارف 3 (p. 48) — « المتراجحات من الدرجة الأولى بمجهول واحد ». Exemple 2 CORRIGÉ. */
export const KNOWLEDGE_3 = {
  source: src('know-3', 48, 'معارف', 3),
  title: 'المتراجحات من الدرجة الأولى بمجهول واحد',
  definition: [
    'المتراجحة بمجهول $x$ هي متباينة قد تكون صحيحة وقد تكون خاطئة وهذا حسب قيم $x$ .',
    'قيم $x$ التي من أجلها تكون المتباينة صحيحة هي حلول المتراجحة.',
    'حل متراجحة هو إيجاد كل حلولها.',
  ],
  firstDegree: 'يُقال عن متراجحة أنّها من الدرجة الأولى لمجهول $x$ ، إذا أمكن كتابتها على أحد الأشكال الآتية : $ax + b < cx + d$ أو $ax + b > cx + d$ ، $ax + b \\leq cx + d$ أو $ax + b \\geq cx + d$ .',
  rulesIntro: 'لحل متراجحة من الدرجة الأولى بمجهول واحد، نستعمل القواعد الآتية:',
  rules: [
    'نُحافظ على اتجاه المتراجحة عندما نُضيف إلى (أو نطرح من) طرفيها نفس العدد.',
    'نُحافظ على نفس اتجاه المتراجحة عندما نضرب طرفيها في (أو نقسم طرفيها على) نفس العدد الموجب تماما.',
    'نُغيّر اتجاه المتراجحة عندما نضرب طرفيها في (أو نقسم طرفيها على) العدد السالب تماما نفسه.',
  ],
  example1: 'مثال 1: المتباينة $4x > -3$ هي متراجحة ذات المجهول $x$ . من أجل $x = -2$ نكتب $4 \\times (-2) > -3$ فنحصل على متباينة خاطئة $-8 > -3$ إذن العدد $(-2)$ ليس حلا للمتراجحة $4x > -3$ .',
  example2a: 'مثال 2: 1) حل المتراجحة $4x - 1 \\leq x + 3$ . نطرح $x$ من الطرفين فنحصل على $3x - 1 \\leq 3$ . نضيف 1 للطرفين، نحصل على $3x \\leq 4$ . نقسم على 3 إذن $x \\leq \\dfrac{4}{3}$ (لاحظ اتجاه المتراجحة لم يتغير). حلول المتراجحة $4x - 1 \\leq x + 3$ هي كل الأعداد $x$ الأصغر من أو يساوي $\\dfrac{4}{3}$ .',
  example2b: '2) حل المتراجحة $-3x + 2 > 20$ . نطرح 2 من الطرفين، فنحصل على $-3x > 18$ . نقسم الطرفين على العدد السالب $-3$ ، نحصل على $x < -6$ (لاحظ أنّ اتجاه المتراجحة قد تغيّر). حلول المتراجحة $-3x + 2 > 20$ هي كل الأعداد $x$ الأصغر من $-6$ .',
  correctionNote: 'صحّحت المنصّة خطأً مطبعيًا في نص الكتاب: بعد القسمة على عدد سالب «اتجاه المتراجحة قد تغيّر» (وليس «قد يتغير»): يتغيّر دائمًا.',
};

/** معارف 4 (p. 48) — « التمثيل البياني لحلول متراجحة ». Exemple 2 CORRIGÉ comme know-3. */
export const KNOWLEDGE_4 = {
  source: src('know-4', 48, 'معارف', 4),
  title: 'التمثيل البياني لحلول متراجحة',
  definition: 'تُمثل حلول متراجحة على مستقيم عددي مُدرّج.',
  example1: 'مثال 1: حل المتراجحة $5x \\leq 3$ . نضرب الطرفين في العدد $\\dfrac{1}{5}$ ، نجد $x \\leq \\dfrac{3}{5}$ . حلول المتراجحة هي كل الأعداد $x$ الأصغر من أو تساوي $\\dfrac{3}{5}$ . تُمثل حلول المتراجحة على المستقيم المُدرّج بالجزء المُلوّن بالأحمر.',
  note1: 'ملاحظة: الرمز $]$ موجه نحو الجزء الملوّن بالأحمر للتعبير عن أن العدد $\\dfrac{3}{5}$ هو أيضا حل للمتراجحة المعطاة.',
  figure1: { from: -2, to: 1, at: 0.6, boundTex: '\\dfrac{3}{5}', side: 'left', closed: true },
  example2: 'مثال 2: حل المتراجحة $-\\dfrac{1}{2}x + 2 < -1$ . نطرح العدد 2 من الطرفين، نجد $-\\dfrac{1}{2}x < -3$ . نضرب الطرفين في العدد $(-2)$ ، نجد $x > 6$ (لاحظ أنّ اتجاه المتراجحة قد تغيّر). حلول المتراجحة هي كل الأعداد $x$ الأكبر من 6. تمثل حلول المتراجحة على المستقيم المُدرّج بالجزء الملون بالأحمر.',
  note2: 'ملاحظة: الرمز $]$ غير موجه في إتجاه الجزء الملون وذلك للتعبير على أن العدد 6 ليس حل للمتراجحة المعطاة.',
  figure2: { from: 4, to: 7, at: 6, side: 'right', closed: false },
};

/** طرائق p. 49 — « حل متراجحة من الدرجة الأولى بمجهول واحد ». Solution ب) CORRIGÉE. */
export const METHOD = {
  source: src('method-inequality', 49, 'طرائق'),
  title: 'حل متراجحة من الدرجة الأولى بمجهول واحد',
  exercise: 'حل كل متراجحة مما يلي ثم مثّل بيانيا حلولها. أ) $-7x + 1 < x - 3$ ؛ ب) $\\dfrac{3x + 2}{6} \\geq \\dfrac{2x - 3}{5}$ .',
  solutionA: [
    'أ) نطرح العدد 1 من طرفي المتراجحة $-7x + 1 < x - 3$ فنحصل على $-7x < x - 3 - 1$ أي $-7x < x - 4$ .',
    'نطرح العدد $x$ من طرفي المتراجحة الأخيرة، فنحصل على $-7x - x < -4$ أي $-8x < -4$ .',
    'نقسم طرفي المتراجحة $-8x < -4$ على العدد $-8$ ، فنحصل على $x > \\dfrac{-4}{-8}$ أي $x > \\dfrac{1}{2}$ .',
    'ينتج أن حلول المتراجحة $-7x + 1 < x - 3$ هي كل الأعداد $x$ الأكبر من $\\dfrac{1}{2}$ . الجزء الملوّن بالأحمر هو التمثيل البياني لحلول المتراجحة $-7x + 1 < x - 3$ .',
  ],
  figureA: { from: -2, to: 3, at: 0.5, boundTex: '\\dfrac{1}{2}', side: 'right', closed: false },
  solutionB: [
    'ب) نضرب طرفي المتراجحة في العدد 30 (30 هو المقام المشترك للنسبتين $\\dfrac{3x + 2}{6}$ و $\\dfrac{2x - 3}{5}$ ). فنحصل على المتراجحة $15x + 10 \\geq 12x - 18$ .',
    'بعد التبسيط، نحصل على المتراجحة $3x \\geq -28$ وبقسمة الطرفين على العدد 3، نحصل على $x \\geq \\dfrac{-28}{3}$ .',
    'ينتج أن حلول المتراجحة $\\dfrac{3x + 2}{6} \\geq \\dfrac{2x - 3}{5}$ هي كل الأعداد $x$ الأكبر من أو تساوي $\\dfrac{-28}{3}$ . الجزء الملوّن بالأحمر هو التمثيل البياني لحلول المتراجحة $\\dfrac{3x + 2}{6} \\geq \\dfrac{2x - 3}{5}$ .',
  ],
  figureB: { from: -12, to: -6, at: -28 / 3, boundTex: '-\\dfrac{28}{3}', side: 'right', closed: true },
  correctionNote: 'صحّحت المنصّة خطأً مطبعيًا في حلّ الكتاب: الخلاصة تخصّ المتراجحة $\\dfrac{3x + 2}{6} \\geq \\dfrac{2x - 3}{5}$ ، كما في النص والحساب.',
  // La règle que les deux solutions appliquent — reformulée d'après معارف 3 (« طريقة »).
  rule: 'لحل متراجحة من الدرجة الأولى: ننقل حدود $x$ إلى طرف والأعداد إلى الطرف الآخر بإضافة أو طرح نفس العدد (الاتجاه لا يتغيّر)، ثم نقسم على معامل $x$ (نغيّر الاتجاه إذا كان سالبًا)، ونلوّن الحلول بالأحمر على المستقيم المدرّج.',
  ruleSource: addition('interaction_generation'),
};

/**
 * « أؤكّد تعلّماتي » (p. 52) — items 5 à 9 (extraction.json → destinations › qcm ›
 * duplicatedIn › mutarajiha-ula). Les items 5 et 7 ont DEUX options justes : ils sont
 * posés en lignes « يحقّق / لا يحقّق » au module 5. Les items 6, 8, 9 sont l'إختبار أولي ;
 * 6 et 9 sont des droites graduées, DESSINÉES (RayFigure) selon la convention du manuel.
 */
const QCM_SRC = (n) => src('qcm', 52, 'أؤكّد تعلّماتي', n);
export const QCM = {
  5: { n: 5, source: QCM_SRC(5), text: 'إذا كان $x \\geq -1$ فإن ...', options: ['$2x + 2 \\geq 0$', '$2x - 2 < 0$', '$2x \\geq -2$'], correctSet: [0, 2],
    rowCorrections: [
      'نضرب الطرفين في 2 (موجب): $2x \\geq -2$ ، ثم نضيف 2: $2x + 2 \\geq 0$ — صحيحة.',
      'من أجل $x = 5$ : $5 \\geq -1$ لكنّ $2 \\times 5 - 2 = 8$ و $8 < 0$ خاطئة — لا تنتج دائمًا.',
      'نضرب طرفي $x \\geq -1$ في 2 (عدد موجب): الاتجاه لا يتغيّر، $2x \\geq -2$ — صحيحة.',
    ] },
  6: { n: 6, source: QCM_SRC(6), text: 'التمثيل على مستقيم مدرّج للأعداد $x$ حيث $x > -3$ هو ...',
    options: ['الجزء الملوّن على يسار $-3$ والرمز $]$ عند $-3$', 'الجزء الملوّن على يمين $-3$ والرمز $]$ عند $-3$', 'الجزء الملوّن على يسار 0 والرمز $[$ عند 0'],
    figures: [
      { from: -6, to: 1, at: -3, side: 'left', closed: true },
      { from: -6, to: 1, at: -3, side: 'right', closed: false },
      { from: -4, to: 3, at: 0, side: 'left', closed: false },
    ],
    correct: 1,
    explain: '$x > -3$ : الحلول هي الأعداد الأكبر من $-3$ ، أي على يمينه، و $-3$ ليس حلًّا ($-3 > -3$ خاطئة) فالرمز $]$ غير موجّه نحو الجزء الملوّن.' },
  7: { n: 7, source: QCM_SRC(7), text: '$-1$ هو حل للمتراجحة ...', options: ['$2x < -3$', '$2x + 1 < 0$', '$-x + 1 > 0$'], correctSet: [1, 2],
    rowCorrections: [
      '$2 \\times (-1) = -2$ و $-2 < -3$ خاطئة: $-1$ لا يحقّقها.',
      '$2 \\times (-1) + 1 = -1$ و $-1 < 0$ صحيحة: $-1$ حلّ لها.',
      '$-(-1) + 1 = 2$ و $2 > 0$ صحيحة: $-1$ حلّ لها.',
    ] },
  8: { n: 8, source: QCM_SRC(8), text: 'حلول المتراجحة $-\\dfrac{1}{3}x > 1$ هي الأعداد $x$ حيث ...', options: ['$x > 3$', '$x < -3$', '$x > -3$'], correct: 1,
    explain: 'نضرب الطرفين في $-3$ (عدد سالب) فنغيّر الاتجاه: $x < -3$.' },
  9: { n: 9, source: QCM_SRC(9), text: 'التمثيل البياني لحلول المتراجحة $x + 1 > -1$ هو ...',
    options: ['الجزء الملوّن على يمين $-2$ والرمز $]$ عند $-2$', 'الجزء الملوّن على يسار $-2$ والرمز $[$ عند $-2$', 'الجزء الملوّن على يسار 0 والرمز $[$ عند 0'],
    figures: [
      { from: -5, to: 2, at: -2, side: 'right', closed: false },
      { from: -5, to: 2, at: -2, side: 'left', closed: false },
      { from: -3, to: 4, at: 0, side: 'left', closed: false },
    ],
    correct: 0,
    explain: 'نطرح 1 من الطرفين: $x > -2$ ؛ الحلول على يمين $-2$ ، و $-2$ ليس حلًّا فالرمز $]$ غير موجّه نحو الجزء الملوّن.' },
};

/**
 * « أستعدّ » — items 6 à 11 du manuel (p. 43 ; le même « أستعدّ » sert les trois leçons),
 * puis des affirmations de la PLATEFORME, dans la même forme, pour les acquis que le
 * manuel n'y diagnostique pas : le repérage sur un مستقيم مدرّج (années précédentes) et
 * la résolution d'une معادلة (leçon 1). Aucune n'utilise les nombres des activités
 * (2,5x + 100 ≤ 150, −3x + 5 ≤ 20).
 */
export const PREP_ITEMS = [
  { n: 6, skill: 'ikhtibar', text: 'إذا كان $x$ عددا حيث $25x < 0$ فإنّ $x$ يُمكن أن يُساوي 0.', answer: false, why: '$25 \\times 0 = 0$ و $0 < 0$ خاطئة', source: src('prep', 43, 'أستعدّ', 6) },
  { n: 7, skill: 'ikhtibar', text: 'إذا كان $x$ عددا حيث $2x - 1 \\leq 6$ فإنّ $x$ يُمكن أن يُساوي $\\dfrac{7}{2}$ .', answer: true, why: '$2 \\times \\dfrac{7}{2} - 1 = 6$ و $6 \\leq 6$ صحيحة', source: src('prep', 43, 'أستعدّ', 7) },
  { n: 8, skill: 'amaliyat', text: 'نطرح العدد 2 من طرفي المتباينة $4x + 2 < -1$ فنحصل على : $4x > -3$ .', answer: false, why: 'طرح عدد يحافظ على اتجاه المتباينة: $4x < -3$', source: src('prep', 43, 'أستعدّ', 8) },
  { n: 9, skill: 'amaliyat', text: 'نقسم طرفي المتباينة $5x < -1$ على العدد 5 فنحصل على: $x < \\dfrac{1}{5}$ .', answer: false, why: '$x < -\\dfrac{1}{5}$', source: src('prep', 43, 'أستعدّ', 9) },
  { n: 10, skill: 'amaliyat', text: 'نقسم طرفي المتباينة $-2x \\geq -1$ على العدد (-2) فنحصل على: $x \\geq \\dfrac{1}{2}$ .', answer: false, why: 'القسمة على عدد سالب تغيّر الاتجاه: $x \\leq \\dfrac{1}{2}$', source: src('prep', 43, 'أستعدّ', 10) },
  { n: 11, skill: 'amaliyat', text: 'إذا كان $x \\leq 3$ فإن $-3x \\geq -6$ .', answer: false, why: 'من أجل $x = 3$ : $-3x = -9$ و $-9 \\geq -6$ خاطئة ؛ الصحيح $-3x \\geq -9$', source: src('prep', 43, 'أستعدّ', 11) },
  { skill: 'mustaqim', text: 'على مستقيم مدرّج، يقع العدد $-4$ على يمين العدد $-1$ .', answer: false, why: '$-4 < -1$ : الأصغر يقع على اليسار، فالعدد $-4$ على يسار $-1$.', source: addition('prerequisite_diagnostic') },
  { skill: 'mustaqim', text: 'العدد $\\dfrac{5}{2}$ محصور بين العددين 2 و 3.', answer: true, why: '$\\dfrac{5}{2} = 2{,}5$ و $2 < 2{,}5 < 3$', source: addition('prerequisite_diagnostic') },
  { skill: 'muadala', text: 'حل المعادلة $3x - 4 = 11$ هو 5.', answer: true, why: '$3 \\times 5 - 4 = 15 - 4 = 11$', source: addition('prerequisite_diagnostic') },
  { skill: 'muadala', text: 'حل المعادلة $-2x = 8$ هو 4.', answer: false, why: '$-2 \\times 4 = -8 \\neq 8$ ؛ الحل هو $x = -4$', source: addition('prerequisite_diagnostic') },
];
