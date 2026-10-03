/**
 * Les exercices du module 3 « أتعمّق » :
 *   ex-20 (MANUEL, p. 113) — EBCF شبه منحرف, EF = BC ÷ 2 : Thalès deux fois (GEF / GCB, puis AEF / ABC), puis les
 *         médianes de ABC ; la figure est redessinée (content/figures.js › EX20) ;
 *   ex-22 (MANUEL, p. 113) — la largeur de l'oued : OB ÷ (OB + 6) = 2 ÷ 5 ⇒ OB = 4 m (figure › EX22) ;
 *   هرم خوفو — une situation de la PLATEFORME (`synthesis_generation`) qui prolonge l'encadré « طالس » de la page
 *         d'ouverture (« قياس ارتفاع أهرامات مصر بطريقة الظل ») : bâton de 1 m, ombre 1,5 m ; ombre du sommet de la
 *         pyramide à 104 m du bord de sa base carrée de côté 230 m ⇒ 115 + 104 = 219 m du pied de la hauteur ⇒
 *         h = 219 ÷ 1,5 = 146 m (la hauteur historique de la grande pyramide, ≈ 146 m).
 * Un exercice est découpé en une entrée par question (la première porte l'énoncé).
 */
import { src, addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-talis_P1',
  P2: '4am_wadiya-idmajiya-talis_P2',
  P3: '4am_wadiya-idmajiya-talis_P3',
};

const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain) => ({ prompt, expected, display: String(expected).replace('.', ','), explain });

export const EX20_SOURCE = src('ex-20', 113, 'أتعمّق', 20);
export const EX22_SOURCE = src('ex-22', 113, 'أتعمّق', 22);
export const PYRAMID = { source: addition('synthesis_generation') };

export const EXERCISES = [
  /* ── تمرين 20 — شبه منحرف وثلاث وضعيات ── */
  {
    id: 'ex-20-1', source: EX20_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'EBCF شبه منحرف قاعدته الصغرى [EF] نصف قاعدته الكبرى [BC] أي $EF = \\dfrac{1}{2}BC$ . يتقاطع قطراه [BF] و [EC] في النقطة G. بيّن أنّ $\\dfrac{GE}{GC} = \\dfrac{GF}{GB} = \\dfrac{1}{2}$ .',
    interaction: 'choice',
    question: C('أيّ تبرير صحيح؟', [
      '(EF)//(BC) ، و E ، G ، C على استقامة و F ، G ، B على استقامة: المثلثان GEF و GCB في وضعية طالس، و $\\dfrac{GE}{GC} = \\dfrac{GF}{GB} = \\dfrac{EF}{CB} = \\dfrac{1}{2}$',
      'G منتصف القطر [EC] لأنّ القطرين يتقاطعان في منتصفهما',
      'المثلثان GEF و GCB في وضعية طالس، و $\\dfrac{GE}{GC} = \\dfrac{GF}{GB} = \\dfrac{CB}{EF} = 2$',
    ], 0, 'القاعدتان متوازيتان والقطران يتقاطعان في G (وضعية «الفراشة»): $\\dfrac{GE}{GC} = \\dfrac{EF}{CB} = \\dfrac{1}{2}$ . قطرا شبه المنحرف لا يتناصفان (ذلك في متوازي الأضلاع)، والنسبة تُكتب طولا من المثلث الصغير على الطول الموافق في الكبير.'),
    commonError: 'قلب النسبة: $\\dfrac{CB}{EF} = 2$ ليست $\\dfrac{GE}{GC}$ .',
  },
  {
    id: 'ex-20-2', source: EX20_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'يتقاطع (CF) و (BE) في النقطة A. بيّن أنّ F هي منتصف [CA]، وأنّ E هي منتصف [BA].',
    interaction: 'choice',
    question: C('أيّ استدلال صحيح؟', [
      'المثلثان AEF و ABC في وضعية طالس: $\\dfrac{AF}{AC} = \\dfrac{AE}{AB} = \\dfrac{EF}{BC} = \\dfrac{1}{2}$ ، إذن $AF = \\dfrac{1}{2}AC$ و $AE = \\dfrac{1}{2}AB$',
      '$\\dfrac{AF}{FC} = \\dfrac{EF}{BC} = \\dfrac{1}{2}$ إذن F منتصف [CA]',
      'F منتصف [CA] لأنّ $EF = BC$',
    ], 0, 'في المثلثين AEF و ABC نقارن الضلعين اللذين رأسهما A: $\\dfrac{AF}{AC} = \\dfrac{1}{2}$ أي F منتصف [AC]. النسبة $\\dfrac{AF}{FC}$ تقارن قطعة بقطعة، ولو كانت $\\dfrac{1}{2}$ لكان $AF = \\dfrac{1}{3}AC$ .'),
    commonError: 'استعمال القطعة [FC] بدل الضلع [AC] في النسبة.',
  },
  {
    id: 'ex-20-3', source: EX20_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'المستقيم (AG) يقطع [BC] في النقطة L. بيّن أنّ L هي منتصف [BC]. (يمكن استعمال خاصية المتوسطات في مثلث).',
    interaction: 'choice',
    question: C('أيّ استراتيجية تكفي؟', [
      'F منتصف [AC] و E منتصف [AB]: [BF] و [CE] متوسطان في المثلث ABC، فنقطة تقاطعهما G مركز ثقله، والمستقيم (AG) يحمل المتوسط الثالث: L منتصف [BC]',
      '(AG) يوازي (EF)، إذن L منتصف [BC]',
      '$\\dfrac{GE}{GC} = \\dfrac{1}{2}$ يعطي مباشرة $BL = LC$ دون شيء آخر',
    ], 0, 'نجمع النتيجتين السابقتين مع خاصية المتوسطات (السنة الثالثة). (AG) لا يوازي (EF) لأنّه يقطعه، والنسبة وحدها لا تتكلّم عن L.'),
  },

  /* ── تمرين 22 — عرض نهر ── */
  {
    id: 'ex-22-1', source: EX22_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'أراد عبد القادر تقدير عرض نهر، لهذا رسم مستقيمين متوازيين (AB) و (CD). عن طريق البصر جعل على استقامية النقط O، B، D من ناحية والنقط O، A، C من الجانب الآخر. قاس عبد القادر الأطوال AB، CD، BD فوجد $AB = 2\\,\\mathrm{m}$ ، $CD = 5\\,\\mathrm{m}$ ، $BD = 6\\,\\mathrm{m}$ . احسب OB.',
    interaction: 'choice',
    question: C('المساواة التي تعطي OB هي:', [
      '$\\dfrac{OB}{OB + 6} = \\dfrac{2}{5}$',
      '$\\dfrac{OB}{6} = \\dfrac{2}{5}$',
      '$\\dfrac{OB + 6}{OB} = \\dfrac{2}{5}$',
    ], 0, 'المثلثان OAB و OCD في وضعية طالس: $\\dfrac{OB}{OD} = \\dfrac{AB}{CD}$ و $OD = OB + BD = OB + 6$ . BD قطعة وليست ضلعا للمثلث الكبير، وقلب النسبة الأولى وحدها يجعل الطرفين غير متوافقين.'),
    commonError: 'وضع BD بدل OD: القطعة بدل الضلع.',
  },
  {
    id: 'ex-22-2', source: EX22_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('ما الطول OB (بالمتر)؟', 4, '$5 \\times OB = 2(OB + 6)$ أي $5OB = 2OB + 12$ ومنه $3OB = 12$ و $OB = 4\\,\\mathrm{m}$ . تحقّق: $\\dfrac{4}{10} = \\dfrac{2}{5}$ .'),
    commonError: 'حلّ $\\dfrac{OB}{6} = \\dfrac{2}{5}$ فيعطي $2{,}4$ .',
  },

  /* ── هرم خوفو بطريقة الظل — وضعية من المنصّة ── */
  {
    id: 'haram-1', source: PYRAMID.source, learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'يُروى أنّ طالس قاس ارتفاع الهرم الأكبر بالظل: في اللحظة نفسها، عصا شاقولية طولها $1\\,\\mathrm{m}$ ظلّها $1{,}5\\,\\mathrm{m}$ ، وظلّ رأس الهرم يصل إلى $104\\,\\mathrm{m}$ من حافة قاعدته المربعة التي طول ضلعها $230\\,\\mathrm{m}$ (الظلّ عمودي على الحافة).',
    interaction: 'choice',
    question: C('ظلّ الهرم يُقاس من أيّ نقطة لنطبّق خاصية طالس؟', [
      'من مركز القاعدة، قدم ارتفاع الهرم: $115 + 104 = 219\\,\\mathrm{m}$',
      'من حافة القاعدة: $104\\,\\mathrm{m}$',
      'من الركن البعيد للقاعدة: $230 + 104 = 334\\,\\mathrm{m}$',
    ], 0, 'في وضعية طالس الضلع الشاقولي هو ارتفاع الهرم، وقدمه في مركز القاعدة: نضيف نصف الضلع $\\dfrac{230}{2} = 115$ إلى الظلّ الظاهر.'),
    commonError: 'أخذ الظلّ الظاهر وحده (104 m): قدم الارتفاع ليست على حافة القاعدة.',
  },
  {
    id: 'haram-2', source: PYRAMID.source, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('ما ارتفاع الهرم (بالمتر)؟', 146, '$\\dfrac{h}{1} = \\dfrac{219}{1{,}5}$ ومنه $h = 146\\,\\mathrm{m}$ — وهو فعلا الارتفاع الأصلي للهرم الأكبر (حوالي $146\\,\\mathrm{m}$ ): نتيجة ملائمة للواقع.'),
    commonError: 'قسمة 104 على $1{,}5$ (حوالي $69{,}3\\,\\mathrm{m}$ ): الظلّ لم يُقس من قدم الارتفاع.',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
