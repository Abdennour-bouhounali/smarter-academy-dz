/**
 * Les exercices du MANUEL rattachés au درس 4 « ترييض مشكلة » (couverture :
 * extraction.json → destinations). Chaque énoncé est celui du livre, au mot près.
 *
 * Un exercice de ترييض se fait en ÉTAPES (choisir le modèle, résoudre, vérifier) : il est
 * posé en lignes (`batch`), une décision par ligne, chaque distracteur étant un modèle
 * FAUX qui vient d'une erreur réelle — l'inconnue ajoutée une seule fois pour plusieurs
 * personnes (MISC-TARRID-MAJHUL-WAHID), « le double de la somme » mal parenthésé
 * (MISC-TARRID-DIF-MAJMU), une solution qui ne convient pas à la situation
 * (MISC-TARRID-TAHAQQUQ). Toutes les réponses sont recalculées ci-dessous en commentaire.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_tarrid-mushkila_P1',
  P2: '4am_tarrid-mushkila_P2',
};

const E = (n, page, section, part) => ({ ...src(`ex-${n}`, page, section, n), ...(part ? { part } : {}) });

/** Module 2 — دوري الآن 2 (p. 49) : 4x ≥ 84 − 3x ⇔ 7x ≥ 84 ⇔ x ≥ 12 ; 4x ≥ 3(28 − x) ⇔ x ≥ 12. */
export const EXERCISES_1 = [
  {
    id: 'now-49-2', source: src('now-49-2', 49, 'دوري الآن', 2), learningPointId: LP.P1, difficulty: 'moyen',
    statement: '1) حل المتراجحة $4x \\geq 84 - 3x$ . 2) ما هو أقصر ضلع المربع بحيث يكون محيطه أكبر من أو يساوي محيط المثلث؟',
    interaction: 'batch',
    question: {
      prompt: 'مربع ضلعه $x$ ومثلث متقايس الأضلاع ملتصقان، طول قاعدتيهما معًا 28cm (الشكل).',
      rows: [
        { label: '1) $4x \\geq 84 - 3x$ تعني', options: ['$x \\leq 12$', '$x \\geq 12$', '$x \\geq 84$'], correct: 1, correction: '$4x + 3x \\geq 84$ أي $7x \\geq 84$ ، ونقسم على 7 (موجب): $x \\geq 12$ .' },
        { label: '2) المتراجحة التي تترجم المشكلة', options: ['$4x \\geq 3x$', '$4x \\geq 3 \\times 28$', '$4x \\geq 3(28 - x)$'], correct: 2, correction: 'ضلع المثلث هو $28 - x$ ، فمحيطه $3(28 - x) = 84 - 3x$ : هي متراجحة السؤال 1.' },
        { label: 'أقصر ضلع للمربع', options: ['12cm', '7cm', '16cm'], correct: 0, correction: 'الحلول $x \\geq 12$ ، وأصغرها 12: المربع ضلعه 12cm ومحيطه 48cm ، والمثلث ضلعه 16cm ومحيطه 48cm .' },
      ],
      explain: 'نسمّي $x$ ضلع المربع، نعبّر بمتراجحة، نحلّها، ثم نختار من الحلول ما يجيب عن السؤال: «أقصر» ضلع هو أصغر حلّ.',
    },
    method: 'نسمّي $x$ ضلع المربع؛ ضلع المثلث $28 - x$ ؛ «أكبر من أو يساوي» تعطي متراجحة.',
    commonError: 'أخذ ضلع المثلث $x$ هو أيضًا (المتراجحة $4x \\geq 3x$) بدل $28 - x$ .',
  },
];

/* ── Module 3 — أوظّف تعلّماتي (p. 50, 51) et أتعمّق (p. 53) ─────────────────── */
export const EXERCISES = [
  {
    // 6x + 7 = 31 ⇔ x = 4 ; 6(x + 7) = 31 ⇔ x = −11/6 ; 7x + 6 = 31 ⇔ x = 25/7
    id: 'ex-10', source: E(10, 50, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'ما هو العدد الذي إذا ضربته في 6 و أضفت إلى الناتج 7، تحصل على 31؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ العدد المطلوب.',
      rows: [
        { label: 'المعادلة', options: ['$6(x + 7) = 31$', '$6x + 7 = 31$', '$7x + 6 = 31$'], correct: 1, correction: 'نضرب أولًا في 6 ثم نضيف 7 إلى الناتج: $6x + 7 = 31$ .' },
        { label: 'العدد', options: ['$4$', '$-\\dfrac{11}{6}$', '$\\dfrac{25}{7}$'], correct: 0, correction: '$6x = 24$ أي $x = 4$ . تحقّق: $6 \\times 4 + 7 = 31$ .' },
      ],
    },
    method: 'نسمّي $x$ العدد، ونترجم «ضربته في 6 وأضفت 7» بالترتيب نفسه.',
    commonError: 'كتابة $6(x + 7)$ : إضافة 7 قبل الضرب.',
  },
  {
    // 3x − 21 = 2x ⇔ x = 21 ; 3(x − 21) = 2x ⇔ x = 63 ; 3x − 21 = x + 2 ⇔ x = 23/2
    id: 'ex-11', source: E(11, 50, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'ما هو العدد الذي إذا ضربته في 3 و طرحت منه 21، تحصل على ضعف العدد الذي اخترته في البداية؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ العدد الذي اخترته في البداية.',
      rows: [
        { label: 'المعادلة', options: ['$3x - 21 = 2x$', '$3(x - 21) = 2x$', '$3x - 21 = x + 2$'], correct: 0, correction: '«ضعف العدد» هو $2x$ ، و«ضربته في 3 وطرحت 21» هو $3x - 21$ .' },
        { label: 'العدد', options: ['$63$', '$\\dfrac{23}{2}$', '$21$'], correct: 2, correction: '$3x - 2x = 21$ أي $x = 21$ . تحقّق: $3 \\times 21 - 21 = 42 = 2 \\times 21$ .' },
      ],
    },
    commonError: 'ترجمة «ضعف العدد» بـ $x + 2$ بدل $2x$ .',
  },
  {
    // 43 + x = 2[(4 + x) + (7 + x)] = 4x + 22 ⇔ x = 7 ; 43 + x = 2(4 + x) + (7 + x) = 3x + 15 ⇔ x = 14 ;
    // 43 + x = 2(4 + 7 + x) = 2x + 22 ⇔ x = 21 ; vérification : 50 = 2(11 + 14)
    id: 'ex-12', source: E(12, 50, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'يبلغ عمر أب يربّي إبنيه على الصدق والأمانة 43 سنة وعمرا إبنيه 4 و 7 سنوات بعد كم سنة يكون عمر الأب ضعف مجموع عمري إبنيه؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $x$ عدد السنوات.',
      rows: [
        { label: 'المعادلة', options: ['$43 + x = 2(4 + x) + (7 + x)$', '$43 + x = 2[(4 + x) + (7 + x)]$', '$43 + x = 2(4 + 7 + x)$'], correct: 1, correction: 'كل ابن يكبر بـ $x$ ، و«الضعف» يخصّ المجموع كله: $2[(4 + x) + (7 + x)]$ .' },
        { label: 'الحل', options: ['$x = 14$', '$x = 21$', '$x = 7$'], correct: 2, correction: '$43 + x = 4x + 22$ أي $3x = 21$ ومنه $x = 7$ .' },
        { label: 'التحقق بعد 7 سنوات', options: ['$50 = 2(11 + 14)$', '$50 = 2 \\times 11 + 14$', '$43 = 2(4 + 7)$'], correct: 0, correction: 'عمر الأب 50 وعمرا الابنين 11 و 14 : $2 \\times 25 = 50$ .' },
      ],
    },
    method: 'كل شخص يكبر بـ $x$ سنة؛ نضع المجموع بين قوسين قبل أن نضاعفه.',
    commonError: 'مضاعفة عمر الابن الأول وحده: $2(4 + x) + (7 + x)$ بدل ضعف المجموع.',
  },
  {
    // 0,75D + 4 + 11 = D ⇔ 0,25D = 15 ⇔ D = 60
    id: 'ex-13', source: E(13, 50, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'difficile',
    statement: 'بلغت النسبة المئوية لإنجاز بناء سَدّ يخدم الوطن 75% من المدة المقرّرة، ثم تواصل البناء لمدة 4 سنوات. إذا علمت أنّ المُدّة المتبقية لإنجاز المشروع هي 11 سنة، فما هي المُدّة المُقرّرة لبنائه؟',
    interaction: 'batch',
    question: {
      prompt: 'نسمّي $D$ المدة المقرّرة بالسنوات.',
      rows: [
        { label: 'المعادلة', options: ['$0{,}75D + 4 = 11$', '$0{,}75D + 4 + 11 = D$', '$75D + 15 = D$'], correct: 1, correction: 'المدة كلها = ما انقضى ($0{,}75D$) + 4 سنوات + ما بقي (11 سنة).' },
        { label: 'المدة المقرّرة', options: ['60 سنة', '15 سنة', '20 سنة'], correct: 0, correction: '$D - 0{,}75D = 15$ أي $0{,}25D = 15$ ومنه $D = 60$ . تحقّق: $45 + 4 + 11 = 60$ .' },
      ],
    },
    commonError: 'نسيان أن المدة المقرّرة نفسها هي المجهول في الطرفين.',
  },
  {
    // 2x + 12 > 3x ⇔ x < 12 ; x est une longueur : 0 < x < 12
    id: 'ex-30', source: E(30, 51, 'أوظّف تعلّماتي'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'لاحظ الشكل التالي: ما هي قيم $x$ التي من أجلها يكون محيط المستطيل أكبر من محيط المثلث المتقايس الأضلاع؟',
    interaction: 'batch',
    question: {
      prompt: 'مستطيل بعداه $x$ و 6cm ، وفوقه مثلث متقايس الأضلاع قاعدته الضلع العلوي للمستطيل (الشكل).',
      rows: [
        { label: 'المتراجحة', options: ['$2x + 12 > 3x$', '$2x + 12 < 3x$', '$x + 6 > 3x$'], correct: 0, correction: 'محيط المستطيل $2(x + 6) = 2x + 12$ ، ومحيط المثلث $3x$ .' },
        { label: 'قيم $x$', options: ['$x > 12$', '$0 < x < 12$', '$x = 12$'], correct: 1, correction: '$12 > x$ ، و $x$ طول فهو موجب: $0 < x < 12$ .' },
      ],
    },
    method: 'نكتب المحيطين بدلالة $x$ ، ثم نتذكّر أنّ $x$ طول موجب.',
    commonError: 'نسيان شرط الواقع: $x$ طول، فلا يكون سالبًا ولا معدومًا.',
  },
  {
    // P = 2x + 6 ; 2x + 6 ≥ 40 ⇔ x ≥ 17
    id: 'ex-33', source: E(33, 51, 'أوظّف تعلّماتي'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'ABCD مستطيل. 1) عبّر عن محيطه P بدلالة طوله $x$ . 2) ما القيم التي يمكن أن يأخذها $x$ حتى يكون محيط المستطيل أكبر من أو يساوي 40cm.',
    interaction: 'batch',
    question: {
      prompt: 'المستطيل ABCD عرضه $BC = 3cm$ وطوله $DC = x$ (الشكل).',
      rows: [
        { label: '1) $P = $', options: ['$x + 3$', '$2x + 3$', '$2x + 6$'], correct: 2, correction: '$P = 2(x + 3) = 2x + 6$' },
        { label: '2) قيم $x$', options: ['$x \\geq 17$', '$x \\geq 20$', '$x \\leq 17$'], correct: 0, correction: '$2x + 6 \\geq 40$ أي $2x \\geq 34$ ومنه $x \\geq 17$ .' },
      ],
    },
    commonError: 'كتابة المحيط $x + 3$ (نصف المحيط فقط).',
  },
  {
    // 3x + 5 = 32 ⇔ x = 9
    id: 'ex-37-1', source: E(37, 53, 'أتعمّق', '1)'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'إليك برنامج حساب. • اختر عددا. • اضربه في 3 • أضف له 5. 1) ماهو العدد الذي ينبغي اختياره إذا أردنا الحصول في النتيجة على العدد 32؟ 2) ماهو العدد الذي ينبغي إختياره إذا أردنا الحصول في النتيجة على ضعفه؟',
    interaction: 'numeric',
    question: {
      prompt: '1) العدد الذي يعطي 32 هو:',
      expected: 9,
      explain: 'نسمّي $x$ العدد المختار: $3x + 5 = 32$ أي $3x = 27$ ومنه $x = 9$ .',
    },
    method: 'نسمّي $x$ العدد المختار ونكتب نتيجة البرنامج $3x + 5$ .',
  },
  {
    // 3x + 5 = 2x ⇔ x = −5 ; (3 × 64 + … distracteurs : 5 et −1 ne vérifient pas)
    id: 'ex-37-2', source: E(37, 53, 'أتعمّق', '2)'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'batch',
    question: {
      prompt: '2) نريد أن تكون النتيجة ضعف العدد المختار.',
      rows: [
        { label: 'المعادلة', options: ['$3x + 5 = 2 \\times 32$', '$3x + 5 = 2x$', '$2(3x + 5) = x$'], correct: 1, correction: 'النتيجة $3x + 5$ ، وضعف العدد المختار $2x$ .' },
        { label: 'العدد', options: ['$5$', '$-1$', '$-5$'], correct: 2, correction: '$3x - 2x = -5$ أي $x = -5$ . تحقّق: $3 \\times (-5) + 5 = -10 = 2 \\times (-5)$ — عدد سالب، وهو مقبول هنا لأن «عددًا» لم يُشترط موجبًا.' },
      ],
    },
    commonError: 'رفض $-5$ دون سبب: في برنامج حساب يمكن اختيار عدد سالب.',
  },
  {
    // x < 5 + 7, 7 < 5 + x, 5 < x + 7 ⇔ 2 < x < 12
    id: 'ex-38', source: E(38, 53, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'difficile',
    statement: 'ما هي قيم $x$ التي من أجلها يُمكن إنشاء مثلث أطوال أضلاعه بالسنتيمتر: 5 ، $x$ و 7.',
    interaction: 'choice',
    question: {
      prompt: 'في مثلث، طول كل ضلع أصغر من مجموع طولي الضلعين الآخرين. قيم $x$ هي:',
      options: ['$x < 12$', '$2 < x < 12$', '$2 \\leq x \\leq 12$', '$x > 2$'],
      correct: 1, cols: 2,
      explain: '$x < 5 + 7$ أي $x < 12$ ، و $7 < 5 + x$ أي $x > 2$ (و $5 < x + 7$ صحيحة دائمًا لأن $x$ موجب): $2 < x < 12$ . من أجل $x = 2$ أو $x = 12$ تكون النقاط الثلاث على استقامة واحدة.',
    },
    method: 'نكتب ثلاث متراجحات (متباينة المثلث) ونحتفظ بالقيم التي تحقّقها كلها.',
    commonError: 'الاكتفاء بالمتراجحة $x < 5 + 7$ ونسيان أن $x$ يجب أن يكون أكبر من $7 - 5$ .',
  },
  {
    // aire(EFGH) = 64 − 4 × x(8 − x)/2 = 2x² − 16x + 64 ; = 34 ⇔ 2x² − 16x + 30 = 0 ⇔ (2x − 10)(x − 3) = 0 ⇔ x ∈ {3 ; 5}
    id: 'ex-39', source: E(39, 53, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'difficile',
    statement: 'في الشكل المقابل، كل من الرباعيين ABCD و EFGH هو مربع. 1) عبّر عن مساحة المربع EFGH بدلالة $x$ . 2) تحقّق أنّ $2x^2 - 16x + 30 = (2x - 10)(x - 3)$ 3) عيّن قيم $x$ التي من أجلها تكون مساحة المربع EFGH تُساوي $34cm^2$ .',
    interaction: 'batch',
    question: {
      prompt: 'المربع ABCD ضلعه 8cm ، و $AH = BE = CF = DG = x$ (الشكل).',
      rows: [
        { label: '1) مساحة EFGH', options: ['$2x^2 - 16x + 64$', '$4x^2 - 32x + 64$', '$64 - x^2$'], correct: 0, correction: 'مساحة ABCD ناقص أربعة مثلثات قائمة ضلعا كل منها $x$ و $8 - x$ : $64 - 4 \\times \\dfrac{x(8 - x)}{2} = 2x^2 - 16x + 64$ .' },
        { label: '2) $(2x - 10)(x - 3) = $', options: ['$2x^2 - 16x - 30$', '$2x^2 - 16x + 30$', '$2x^2 + 30$'], correct: 1, correction: '$2x^2 - 6x - 10x + 30 = 2x^2 - 16x + 30$' },
        { label: '3) قيم $x$', options: ['$x = 3$ فقط', '$x = 5$ أو $x = -3$', '$x = 3$ أو $x = 5$'], correct: 2, correction: '$2x^2 - 16x + 64 = 34$ أي $2x^2 - 16x + 30 = 0$ أي $(2x - 10)(x - 3) = 0$ : $x = 5$ أو $x = 3$ ، وكلاهما بين 0 و 8 فهما مقبولان.' },
      ],
    },
    method: 'نعبّر عن المساحة بدلالة $x$ ، ثم نكتب المعادلة على شكل جداء معدوم.',
    commonError: 'نسيان القسمة على 2 في مساحة المثلث القائم.',
  },
  {
    // (x + 3)(x − 8) = x² − 5x − 24 ; = 60 ⇔ x² − 5x − 84 = 0 ⇔ (x − 12)(x + 7) = 0 ; x = 12 (−7 refusé : longueur)
    id: 'ex-40', source: E(40, 53, 'أتعمّق'), learningPointId: LP.P2, difficulty: 'difficile',
    statement: 'لاحظ الشكل الآتي حيث الرباعي ABCD مربع (الوحدة 1cm). 1) عبّر عن مساحة المستطيل الملوّن بدلالة $x$ . 2) تحقّق أنّ $(x - 12)(x + 7) = x^2 - 5x - 84$ . 3) عيّن قيمة $x$ التي من أجلها تكون مساحة المستطيل المُلوّن تساوي $60cm^2$ .',
    interaction: 'batch',
    question: {
      prompt: 'المربع ABCD ضلعه $x$ ؛ $BE = 3cm$ و $GD = 8cm$ (الشكل).',
      rows: [
        { label: '1) مساحة المستطيل الملوّن', options: ['$(x + 3)(x + 8)$', '$(x + 3)(x - 8)$', '$x(x - 8) + 3$'], correct: 1, correction: 'بعداه $AE = x + 3$ و $AG = x - 8$ ، ومساحته $(x + 3)(x - 8) = x^2 - 5x - 24$ .' },
        { label: '2) $(x - 12)(x + 7) = $', options: ['$x^2 - 5x - 84$', '$x^2 + 5x - 84$', '$x^2 - 5x + 84$'], correct: 0, correction: '$x^2 + 7x - 12x - 84 = x^2 - 5x - 84$' },
        { label: '3) قيمة $x$', options: ['$x = 12$ أو $x = -7$', '$x = -12$ أو $x = 7$', '$x = 12$ ($-7$ مرفوض)'], correct: 2, correction: '$x^2 - 5x - 24 = 60$ أي $(x - 12)(x + 7) = 0$ : $x = 12$ أو $x = -7$ ، لكن $x$ طول فهو موجب: $x = 12$ .' },
      ],
    },
    method: 'نحلّ بالجداء المعدوم، ثم نتأكّد أنّ كل حل يلائم الواقع (طول موجب، و $x - 8 > 0$).',
    commonError: 'الإبقاء على $x = -7$ : طول ضلع لا يكون سالبًا.',
  },
];

/** Les entrées d'un exercice du manuel (module 3), par numéro : « 10 », « 37 »… */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id === `ex-${n}` || ex.id.startsWith(`ex-${n}-`));

/** Accès par id. */
export const EX = Object.fromEntries([...EXERCISES_1, ...EXERCISES].map((ex) => [ex.id, ex]));
