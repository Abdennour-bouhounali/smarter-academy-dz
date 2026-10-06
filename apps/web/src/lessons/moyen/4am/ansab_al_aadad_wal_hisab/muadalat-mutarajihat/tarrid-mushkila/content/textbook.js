/**
 * Le contenu du MANUEL pour le درس 4 « ترييض مشكلة » — données pures (aucun JSX), au
 * mot près ; chaque bloc cite son élément de docs/sources/4am/unit4/extraction.json.
 *
 * Le manuel n'a PAS d'activité (نشاط) pour ce sujet : sa seule matière est la طريقة
 * p. 49 (le père de 36 ans et ses trois enfants), دوري الآن 2 et les exercices. Son
 * « ACTIVITY » (lu par la مذكرة du professeur) est donc cette طريقة, que le module 1
 * ouvre par le laboratoire et que le module 2 lit ligne à ligne.
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** طرائق p. 49 — « ترييض مشكلة » : l'exercice et sa solution (أ ب جـ التحقق). */
export const METHOD_MODELLING = {
  source: src('method-modelling', 49, 'طرائق'),
  title: 'ترييض مشكلة',
  exercise: 'تمرين: شخص عمره 36 سنة و أعمار أبنائه الثلاثة بالسنوات هي 4 ، 6 ، 8 على التوالي. بعد كم سنة يكون عمر الأب يساوي مجموع أعمار أبنائه الثلاثة؟',
  solution: [
    'أ) نسمي $x$ عدد السنوات التي يكون بعدها عمر الأب هو مجموع أعمار أبنائه الثلاثة.',
    'ب) نُعبّر عن هذه الوضعية بالمعادلة $36 + x = (4 + x) + (6 + x) + (8 + x)$ .',
    'جـ) نحل المعادلة التي وجدناها والتي تكتب على الشكل $36 + x = 3x + 18$ ومنه يكون $2x = 18$ أي $x = 9$ . بالتالي يكون عمر الأب مساويا مجموعَ أعمار أبنائه الثلاثة بعد 9 سنوات.',
    'التحقق: بعد 9 سنوات يكون عمر الأب هو 45 سنة وأعمار الأبناء هي 13 ، 15 و 17 ولدينا $13 + 15 + 17 = 45$ .',
  ],
};

/** Ce que la مذكرة lit comme « وضعية الانطلاق » : la طريقة elle-même. */
export const ACTIVITY = {
  source: METHOD_MODELLING.source,
  title: 'ترييض مشكلة',
  text: METHOD_MODELLING.exercise,
  questions: [
    'بعد كم سنة يكون عمر الأب يساوي مجموع أعمار أبنائه الثلاثة؟',
  ],
  closing: METHOD_MODELLING.solution[3],
  numbers: { father: 36, children: [4, 6, 8], years: 9 },
};

/**
 * LA COURSE DES ÂGES — l'expérience de la PLATEFORME (le manuel n'a pas d'activité).
 * Sa mathématique est la طريقة p. 49 ; le niveau متقدم est l'exercice du manuel, le
 * niveau مبتدئ deux personnes seulement (« ضعف عمر الابن »). Déclarée, jamais cachée.
 */
export const RACE = {
  source: addition('interaction_generation'),
  beginner: { left: '30+x', right: '2(6+x)', solution: 18 },
  advanced: { left: '36+x', right: '4+x+6+x+8+x', solution: 9 },
  // Module 2 : « ثلاثة أضعاف » — la solution est négative (x = −3).
  past: { left: '36+x', right: '3(14+x)', solution: -3 },
};

/**
 * Les ÉTAPES de la طريقة, nommées par les lettres du manuel (أ ب جـ التحقق) : ce que
 * la brique « tarrid-tariqa » pose et ce que la carte relie.
 */
export const STEPS = {
  source: src('method-modelling', 49, 'طرائق'),
  name: 'أ) نسمي $x$ المجهول المناسب (هنا: عدد السنوات).',
  express: 'ب) نُعبّر عن الوضعية بمعادلة (أو متراجحة) بدلالة $x$ : كل كمية تتغيّر مع $x$ تُكتب بدلالة $x$.',
  solve: 'جـ) نحل المعادلة (أو المتراجحة) التي وجدناها.',
  check: 'التحقق: نعوّض الحل في نص المشكلة، ونتأكّد أنه يلائم الواقع.',
};

/**
 * La règle que le laboratoire a rendue physique : chaque personne vieillit de x —
 * le contenu de « ب) » (36 + x = (4 + x) + (6 + x) + (8 + x)).
 */
export const MODEL_RULE = {
  source: src('method-modelling', 49, 'طرائق'),
  text: 'بعد $x$ سنة يكبر كل شخص بـ $x$ سنة: عمر الأب $36 + x$ ، وعمر كل ابن يزيد بـ $x$ ، فمجموع أعمار الأبناء الثلاثة $(4 + x) + (6 + x) + (8 + x) = 3x + 18$ .',
};

/**
 * دوري الآن 2 (p. 49) : 4x ≥ 84 − 3x, puis le carré et le triangle équilatéral qui
 * se partagent une base de 28 cm (figure redessinée : components/Figures.jsx).
 */
export const NOW_49_2 = {
  source: src('now-49-2', 49, 'دوري الآن', 2),
  text: '1) حل المتراجحة $4x \\geq 84 - 3x$ . 2) ما هو أقصر ضلع المربع بحيث يكون محيطه أكبر من أو يساوي محيط المثلث؟',
  figure: 'مربع ضلعه $x$ ومثلث متقايس الأضلاع ملتصقان، طول قاعدتيهما معا 28cm.',
};

/**
 * Ce que l'exercice d'inéquation ajoute à la طريقة : quand la question dit « أقصر »,
 * « أكبر من أو يساوي », on traduit par une MÉTRAJIHA et on choisit, parmi ses
 * solutions, celle qui répond (دوري الآن 2 : x ≥ 12 → le plus court côté est 12 cm).
 */
export const INEQUALITY_RULE = {
  source: src('now-49-2', 49, 'دوري الآن', 2),
  text: 'عندما يطلب النص «أكبر من أو يساوي» أو «أقصر» نعبّر عن الوضعية بمتراجحة: محيط المربع $4x$ ومحيط المثلث $3(28 - x)$ ، فالمتراجحة $4x \\geq 3(28 - x)$ أي $x \\geq 12$ ، وأقصر ضلع هو 12cm.',
};

/**
 * « التأكد من ملاءمتها للواقع » (الكفاءة 2) : ce que les exercices du manuel
 * imposent — une longueur est positive (تمرين 30 : $0 < x < 12$), une solution négative
 * est refusée (تمرين 40 : $x = -7$ مرفوض), un nombre d'années « après » est positif.
 */
export const REALITY_RULE = {
  source: src('ex-40', 53, 'أتعمّق', 40),
  text: 'نتحقّق من أنّ الحل يلائم الواقع: طول ضلع أو عدد سنوات أو عدد حصص لا يكون سالبًا، وعدد أشياء يكون عددًا طبيعيًا. في التمرين 40 مثلًا للمعادلة حلّان 12 و $-7$ ، و $-7$ مرفوض لأنه طول.',
};

/** Exercice 13 : l'énoncé du manuel est elliptique — la lecture retenue, en une ligne. */
export const EX13_NOTE = {
  source: addition('interaction_generation'),
  text: 'نقرأ النص هكذا: انقضى 75% من المدة المقررة $D$ ، ثم 4 سنوات، وبقيت 11 سنة: $0{,}75D + 4 + 11 = D$ .',
};

/** Exercice 40 : la figure du manuel porte « m » ; la version corrigée (extraction → ex-40.correction). */
export const EX40_NOTE = {
  source: addition('interaction_generation'),
  text: 'صحّحت المنصّة خطأً مطبعيًا في شكل الكتاب: $BE = 3cm$ و $GD = 8cm$ .',
};

/**
 * « أستعدّ » — le manuel n'a AUCUN item pour ce sujet (ses items 1–11 p. 43 vont aux
 * leçons 1–3) : neuf affirmations de la PLATEFORME, dans la forme du manuel (« أصحيح أم
 * خاطئ؟ برّر إجابتك »), une ou deux par prérequis du propriétaire, les deux réponses
 * présentes. Aucune n'utilise les nombres du laboratoire (36, 4, 6, 8, 30, 14).
 */
export const PREP_ITEMS = [
  { skill: 'muadala', text: 'حل المعادلة $5x - 7 = 3x + 9$ هو $x = 8$ .', answer: true, why: '$5x - 3x = 9 + 7$ أي $2x = 16$ ومنه $x = 8$ . تحقّق: $5 \\times 8 - 7 = 33$ و $3 \\times 8 + 9 = 33$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'muadala', text: 'حل المعادلة $4x + 6 = 2$ هو $x = 2$ .', answer: false, why: '$4x = 2 - 6 = -4$ ومنه $x = -1$ . (العدد 2 يعطي $4 \\times 2 + 6 = 14$ .)', source: addition('prerequisite_diagnostic') },
  { skill: 'muadala', text: 'للمعادلة $(x - 4)(2x + 6) = 0$ حلّان هما 4 و $-3$ .', answer: true, why: 'جداء معدوم: $x - 4 = 0$ أو $2x + 6 = 0$ ، أي $x = 4$ أو $x = -3$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'mutarajiha', text: 'حلول المتراجحة $-2x \\geq 10$ هي الأعداد $x \\geq -5$ .', answer: false, why: 'نقسم على $-2$ وهو سالب فنغيّر الاتجاه: $x \\leq -5$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'mutarajiha', text: 'العدد 3 حلّ للمتراجحة $2x + 1 < 7$ .', answer: false, why: 'من أجل $x = 3$ : $2 \\times 3 + 1 = 7$ و $7 < 7$ خاطئة. حلولها $x < 3$ ، و 3 ليس منها.', source: addition('prerequisite_diagnostic') },
  { skill: 'hisab', text: 'محيط مستطيل طوله $x$ وعرضه 5 هو $2x + 10$ .', answer: true, why: 'محيط المستطيل هو ضعف مجموع طوله وعرضه: $2(x + 5) = 2x + 10$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'hisab', text: 'مساحة مثلث قائم طولا ضلعي قائمته 6cm و 4cm هي $24cm^2$ .', answer: false, why: 'مساحة المثلث القائم نصف جداء ضلعي القائمة: $\\dfrac{6 \\times 4}{2} = 12$ ، أي $12cm^2$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'taklifa', text: 'ثمن 7 دفاتر سعر الواحد منها 40 دينارًا ومحفظة ثمنها 150 دينارًا هو 430 دينارًا.', answer: true, why: '$7 \\times 40 + 150 = 280 + 150 = 430$ : ثمن الدفاتر يتضاعف مع عددها، وثمن المحفظة يُدفع مرة واحدة.', source: addition('prerequisite_diagnostic') },
  { skill: 'taklifa', text: '75% من 80 هو 60.', answer: true, why: '$0{,}75 \\times 80 = 60$ .', source: addition('prerequisite_diagnostic') },
];

/**
 * L'erreur que le laboratoire a rendue physique (MISC-TARRID-MAJHUL-WAHID) : « + x » posé
 * une seule fois pour trois enfants. Le module 1 la corrige ; la carte la reprend.
 */
export const MISTAKE_ONE_X = {
  source: src('method-modelling', 49, 'طرائق'),
  wrong: 'كتابة $36 + x = 4 + 6 + 8 + x$ : إضافة $x$ مرة واحدة لمجموع أعمار الأبناء.',
  why: 'بعد $x$ سنة لا يكبر «المجموع» بل يكبر كل ابن بـ $x$ سنة: ثلاثة أبناء، ثلاث مرات $x$ .',
  right: 'مجموع أعمار الأبناء بعد $x$ سنة هو $(4 + x) + (6 + x) + (8 + x) = 3x + 18$ .',
};
