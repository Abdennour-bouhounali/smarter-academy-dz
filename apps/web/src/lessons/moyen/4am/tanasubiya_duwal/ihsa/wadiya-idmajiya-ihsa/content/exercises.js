/**
 * Les exercices du module 3 « أتعمّق » :
 *   ex-20 (MANUEL, p. 101 — extraction › destinations : module 3), CORRIGÉ : la médiane imprimée « 6 » est
 *         impossible (avec a + b = 3, les rangs 5 et 6 donnent 5, 6,5 ou 8) → 6,5, d'où a = 2 et b = 1
 *         (une ligne discrète ; le texte du livre reste dans l'extraction) ;
 *   deux situations de la PLATEFORME (`synthesis_generation`) qui croisent les دروس (TRANSFERT) :
 *     زمن الشاشة   25 élèves, heures de téléphone 1…6, effectifs 2, 5, a, 6, 4, 2 → a = 6 ; N impair,
 *                  rang 13 → Med = 3 ; « 4 ساعات على الأكثر » = 19 → 76 %
 *     مسابقة القسم  deux groupes de même moyenne 15 : أ 12, 14, 15, 15, 19 (étendue 7, Med 15) ;
 *                  ب 6, 15, 16, 18, 20 (étendue 14, Med 16)
 * Un exercice est découpé en une entrée par étape (la première porte l'énoncé).
 */
import { src, addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-ihsa_P1',
  P2: '4am_wadiya-idmajiya-ihsa_P2',
  P3: '4am_wadiya-idmajiya-ihsa_P3',
};

const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain) => ({ prompt, expected, display: String(expected), explain });

export const EX20 = {
  source: src('ex-20', 101, 'أتعمّق', 20),
  table: { values: ['4', '5', '8', '12'], counts: ['3', 'a', 'b', '4'] },
  correction: 'صحّحت المنصّة خطأً مطبعيًا في نص الكتاب: الوسيط $6{,}5$ لا 6 ؛ مع $a + b = 3$ لا يمكن أن يساوي الوسيط 6 (يساوي 5 أو $6{,}5$ أو 8).',
};
const SYNTH = addition('synthesis_generation');

export const SCREEN = {
  source: SYNTH,
  table: { values: ['1', '2', '3', '4', '5', '6'], counts: ['2', '5', 'a', '6', '4', '2'] },
};
export const QUIZ = { source: SYNTH };

export const EXERCISES = [
  /* ── تمرين 20 — تكراران مجهولان (مصحّح) ── */
  {
    id: 'ex-20-1', source: EX20.source, learningPointId: LP.P1, difficulty: 'facile',
    statement: 'وسيط السلسلة الإحصائية المعطاة أدناه يساوي $6{,}5$ وتكرارها الكلي هو 10. احسب كلا من التكرارين $a$ و $b$ ؟',
    interaction: 'numeric',
    question: N('من التكرار الكلي: ما قيمة المجموع $a + b$ ؟', 3, '$3 + a + b + 4 = 10$ ، إذن $a + b = 10 - 7 = 3$.'),
    method: 'التكرار الكلي مجموع كل التكرارات، بما فيها المجهولة.',
    commonError: 'نسيان تكرار إحدى القيم المعلومة: $10 - 3 = 7$ ليس $a + b$.',
  },
  {
    id: 'ex-20-2', source: EX20.source, learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('التكرار الكلي 10 زوجي. الوسيط هو نصف مجموع القيمتين اللتين رتبتاهما:', ['5 و 6', '5 فقط', '10 و 11', '$5{,}5$ و $6{,}5$'], 0,
      '$\\dfrac{N}{2} = 5$ و $\\dfrac{N}{2} + 1 = 6$ ؛ والعدد $5{,}5 = \\dfrac{N + 1}{2}$ ليس رتبة.'),
    commonError: 'استعمال الرتبة $\\dfrac{N + 1}{2}$ ، وهي لعدد فردي من القيم.',
  },
  {
    id: 'ex-20-3', source: EX20.source, learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('الوسيط $6{,}5$ يعني أنّ القيمة ذات الرتبة 5 هي 5 والقيمة ذات الرتبة 6 هي 8. إذن:', [
      '$a = 2$ و $b = 1$',
      '$a = 1$ و $b = 2$',
      '$a = 3$ و $b = 0$',
      '$a = 0$ و $b = 3$',
    ], 0, 'التكرار المجمع الصاعد لـ 5 هو $3 + a$ ، ويجب أن يساوي 5 بالضبط (الرتبة 5 عند 5 والرتبة 6 بعدها): $a = 2$ ، ثم $b = 3 - 2 = 1$. مع $a = 1$ الرتبتان 5 و 6 عند 8 (الوسيط 8)، ومع $a = 3$ عند 5 (الوسيط 5)، ومع $a = 0$ الوسيط 8.'),
    method: 'نكتب التكرارات المجمعة بدلالة $a$ ونبحث أين تقع الرتبتان 5 و 6.',
    commonError: 'الحكم دون التحقق: $(1 ; 2)$ يعطي المجموع 3 لكن الوسيط 8.',
  },

  /* ── زمن الشاشة — وضعية من المنصّة ── */
  {
    id: 'shasha-1', source: SCREEN.source, learningPointId: LP.P1, difficulty: 'facile',
    statement: 'سأل أستاذ تلاميذ قسمه (25 تلميذا) عن عدد ساعات استعمال الهاتف في اليوم، فلخّص الإجابات في الجدول أدناه، حيث $a$ تكرار مجهول.',
    interaction: 'numeric',
    question: N('ما قيمة $a$ ؟', 6, '$2 + 5 + a + 6 + 4 + 2 = 25$ ، أي $19 + a = 25$ ، إذن $a = 6$.'),
    commonError: 'جمع القيم بدل التكرارات.',
  },
  {
    id: 'shasha-2', source: SCREEN.source, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('ما وسيط هذه السلسلة (بالساعات)؟', 3, '$N = 25$ فردي: الوسيط القيمة ذات الرتبة $\\dfrac{25 + 1}{2} = 13$. التكرارات المجمعة الصاعدة 2 ، 7 ، 13 : الرتبة 13 عند القيمة 3.'),
    commonError: 'أخذ القيمة الوسطى في سطر الجدول بدل القيمة ذات الرتبة 13.',
  },
  {
    id: 'shasha-3', source: SCREEN.source, learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('ما النسبة المئوية للتلاميذ الذين يستعملون الهاتف 4 ساعات على الأكثر؟ (اكتب العدد دون الرمز %)', 76, 'التكرار المجمع الصاعد للقيمة 4 : $2 + 5 + 6 + 6 = 19$ ، و $\\dfrac{19}{25} = 0{,}76$ ، أي 76%.'),
    commonError: 'نسيان أنّ «على الأكثر» تشمل القيمة 4 نفسها.',
  },

  /* ── مسابقة القسم — وضعية من المنصّة ── */
  {
    id: 'musabaqa-1', source: QUIZ.source, learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'في مسابقة القسم، تحصّلت المجموعة أ على العلامات 12 ، 14 ، 15 ، 15 ، 19 ، والمجموعة ب على 6 ، 15 ، 16 ، 18 ، 20.',
    interaction: 'choice',
    question: C('للمجموعتين المتوسط نفسه 15. أيّ المجموعتين علاماتها أكثر تقاربا؟', [
      'المجموعة أ: مداها $19 - 12 = 7$ ، ومدى ب $20 - 6 = 14$',
      'المجموعة ب: أعلى علامة فيها 20',
      'المجموعتان متقاربتان بالقدر نفسه لأنّ لهما المتوسط نفسه',
      'المجموعة ب: مداها $20 - 15 = 5$',
    ], 0, 'التشتت يُقرأ بالمدى: $7 < 14$. المتوسط نفسه لا يعني التشتت نفسه، ومدى ب يُحسب بأصغر علامة فيها (6) لا بـ 15.'),
    commonError: 'المقارنة بالمتوسط وحده.',
  },
  {
    id: 'musabaqa-2', source: QUIZ.source, learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('أيّ عبارة صحيحة؟', [
      'وسيط ب هو 16: ثلاثة من تلاميذ ب الخمسة تحصّلوا على 16 أو أكثر',
      'وسيط ب هو 15 لأنّه متوسطها',
      'وسيط أ أكبر من وسيط ب',
      'وسيط ب هو $\\dfrac{6 + 20}{2} = 13$',
    ], 0, 'العلامات مرتبة و $N = 5$ : الوسيط القيمة ذات الرتبة 3 ، أي 16 في ب و 15 في أ. ونصف مجموع الطرفين $\\dfrac{6 + 20}{2} = 13$ مركز المدى، لا الوسيط.'),
    commonError: 'الخلط بين الوسيط والمتوسط.',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
