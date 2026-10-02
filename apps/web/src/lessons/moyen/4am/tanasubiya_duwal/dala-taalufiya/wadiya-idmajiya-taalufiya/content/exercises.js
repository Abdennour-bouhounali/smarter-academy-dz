/**
 * « أتعمّق » (module 3) — trois problèmes de la PLATEFORME (le manuel fourni n'en a pas pour cette
 * unité : `addition('synthesis_generation')`), chacun sur un CAS que la situation du module 1 ne
 * montre pas, écrits dans la forme des « أتعمّق » du manuel (énoncé, puis étapes) :
 *
 *   internet   deux forfaits 400 + 50x et 250 + 50x : droites PARALLÈLES (même a) — la جملة n'a pas de
 *              solution, « نت برو » est toujours moins cher de 150 DA (درس 4 + درس 5)
 *   batterie   deux relevés (2 ; 70) et (5 ; 25) → f(x) = −15x + 100, fonction DÉCROISSANTE ; vide quand
 *              f(x) = 0 : x = 20/3 h = 6 h 40 min (درس 3 + درس 1 + درس 2)
 *   salle      carte 1500 + 100x contre 250x : égalité à 10 séances ; « moins chère » est une
 *              INÉGALITÉ x > 10 → à partir de 11 séances (درس 5, interprétation entière)
 *
 * Un exercice est découpé en une entrée par étape (la première porte l'énoncé).
 */
import { addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-taalufiya_P1',
  P2: '4am_wadiya-idmajiya-taalufiya_P2',
};

const S = addition('synthesis_generation');
const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain) => ({ prompt, expected, display: String(expected), explain });

export const EXERCISES = [
  /* ── باقتا الإنترنت — مستقيمان متوازيان ── */
  {
    id: 'internet-1', source: S, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'يقترح متعامل للهاتف النقال باقتين للإنترنت في الشهر، حيث $x$ عدد الجيغابايت المستهلكة: الباقة «نت+» تكلّف $400 + 50x$ دينارا، والباقة «نت برو» تكلّف $250 + 50x$ دينارا.',
    interaction: 'choice',
    question: C('المستقيمان الممثلان للتكلفتين:', [
      'متوازيان: لهما معامل التوجيه نفسه 50 وترتيبان مختلفان عند المبدأ',
      'متقاطعان في نقطة واحدة',
      'منطبقان',
    ], 0, 'الدالتان $x \\longmapsto 50x + 400$ و $x \\longmapsto 50x + 250$ لهما المعامل نفسه $a = 50$ و $400 \\neq 250$ : مستقيمان متوازيان، والجملة $\\begin{cases} y = 50x + 400 \\\\ y = 50x + 250 \\end{cases}$ لا تقبل حلا.'),
    method: 'نقارن معاملي التوجيه أولا، ثم الترتيبين عند المبدأ.',
    commonError: 'الخلط بين متوازيين (نفس $a$ و $b$ مختلف) ومنطبقين (نفس $a$ ونفس $b$).',
  },
  {
    id: 'internet-2', source: S, learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('إذن:', [
      '«نت برو» أرخص دائما بـ 150 DA مهما كان عدد الجيغابايت',
      'تتساوى التكلفتان عند 3 جيغابايت',
      '«نت+» تصبح أرخص عندما نستهلك كثيرا',
    ], 0, 'من أجل كل $x$ : $(400 + 50x) - (250 + 50x) = 150$. الفرق ثابت، فلا تتساوى التكلفتان أبدا، و «نت برو» أرخص دائما.'),
    commonError: 'البحث عن نقطة تقاطع لمستقيمين متوازيين.',
  },

  /* ── بطارية الهاتف — دالة تآلفية متناقصة ── */
  {
    id: 'batterie-1', source: S, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'شحن سامي هاتفه كاملا ثم بدأ لعبة. بعد ساعتين من اللعب بقي في البطارية 70% من الشحن، وبعد 5 ساعات بقي 25%. نفرض أنّ نسبة الشحن $f(x)$ بعد $x$ ساعة دالة تآلفية لـ $x$.',
    interaction: 'choice',
    question: C('دستور الدالة $f$ هو:', [
      '$f(x) = -15x + 100$',
      '$f(x) = 15x + 40$',
      '$f(x) = -45x + 160$',
      '$f(x) = 35x$',
    ], 0, '$a = \\dfrac{f(5) - f(2)}{5 - 2} = \\dfrac{25 - 70}{3} = -15$ ، ثم $b = 70 - (-15) \\times 2 = 70 + 30 = 100$ : $f(x) = -15x + 100$ (البطارية كانت مشحونة كاملا: $f(0) = 100$).'),
    method: 'تناسب التغيّرات بالترتيب نفسه في البسط والمقام، ثم $b = f(2) - 2a$.',
    commonError: 'طرح الصورتين بترتيب والعددين بالترتيب المعاكس، فتتغيّر إشارة $a$.',
  },
  {
    id: 'batterie-2', source: S, learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'choice',
    question: C('تفرغ البطارية تماما بعد:', [
      '6 ساعات و 40 دقيقة',
      '6 ساعات و 67 دقيقة',
      '6 ساعات و 4 دقائق',
      '7 ساعات بالضبط',
    ], 0, 'نحلّ $-15x + 100 = 0$ : $x = \\dfrac{100}{15} = \\dfrac{20}{3} = 6 + \\dfrac{2}{3}$ ساعة، و $\\dfrac{2}{3}$ ساعة $= 40$ دقيقة. أمّا $f(7) = -5$ فلا معنى له: البطارية فرغت قبل ذلك.'),
    commonError: 'قراءة $6{,}67$ ساعة على أنها 6 ساعات و 67 دقيقة: الساعة 60 دقيقة.',
  },

  /* ── قاعة الرياضة — متراجحة وعدد طبيعي ── */
  {
    id: 'salle-1', source: S, learningPointId: LP.P1, difficulty: 'facile',
    statement: 'تقترح قاعة رياضة صيغتين في الشهر، حيث $x$ عدد الحصص: بطاقة اشتراك 1500 DA ثم 100 DA للحصة، أو 250 DA للحصة دون بطاقة.',
    interaction: 'numeric',
    question: N('من أجل كم حصة تتساوى التكلفتان؟', 10,
      '$1500 + 100x = 250x$ تعطي $1500 = 150x$ ومنه $x = 10$ : الصيغتان تكلّفان 2500 DA لـ 10 حصص.'),
    method: 'نساوي بين التكلفتين ونحلّ المعادلة، أو نقرأ فاصلة نقطة تقاطع المستقيمين.',
    commonError: 'قسمة 1500 على 250 : هذا ينسى أنّ صاحب البطاقة يدفع أيضا 100 DA للحصة.',
  },
  {
    id: 'salle-2', source: S, learningPointId: LP.P2, difficulty: 'difficile',
    interaction: 'numeric',
    question: N('ابتداء من كم حصة في الشهر تصبح البطاقة أرخص؟', 11,
      '$1500 + 100x < 250x$ تعطي $x > 10$. عند 10 حصص تتساوى التكلفتان، فالبطاقة أرخص ابتداء من 11 حصة: $1500 + 100 \\times 11 = 2600 < 250 \\times 11 = 2750$.'),
    commonError: 'الإجابة بـ 10 : عند 10 حصص التكلفتان متساويتان، والمطلوب «أرخص» (متباينة تامة).',
  },
];

/** Les étapes d'un problème (préfixe → entrées), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
export const part = (id) => EXERCISES.find((ex) => ex.id === id);
