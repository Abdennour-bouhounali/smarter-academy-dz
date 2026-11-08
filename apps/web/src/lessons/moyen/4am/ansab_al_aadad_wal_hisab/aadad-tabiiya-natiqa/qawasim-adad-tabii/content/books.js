/**
 * LE TERRAIN pour toute la leçon : le labo `factor-pairs` (les livres qui se rangent en rectangle, la réglette du nombre de livres par
 * rangée) joué en MANCHES avec étoiles dans le lecteur de mission (rollout 2026-11-08, traitement v2 : prédire → observer d'un
 * toucher → bâtir l'égalité, le journal des essais dans le labo, une seconde chance plus petite).
 *
 *   MODULE 1 : 24 livres (UN rectangle parfait donne DEUX قواسم) → 60 (tous les rectangles) → 48 → défi ⭐ 36 (le carré ne
 *              donne qu'un قاسم) → terrain libre. Seule la manche 1 se joue à la main ; ensuite « جرّب كل الإمكانيات » s'ouvre d'emblée.
 *   MODULE 2 : 105 — jusqu'où tester ? (le rectangle couché, puis la règle) → défi ⭐ 84 (s'arrêter au carré) → terrain libre.
 *
 * Les nombres sont CALCULÉS (divisors / pairs), jamais recopiés à la main.
 */

export const divisorsOf = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
/** Les couples (petit × grand) d'un nombre, du plus petit au plus grand : 60 → 1×60, 2×30, … 6×10. */
export const pairsOf = (n) => divisorsOf(n).filter((d) => d * d <= n).map((d) => ({ small: d, big: n / d }));
/** Le plus grand d avec d × d ≤ n (la borne du test). */
export const boundOf = (n) => { let d = 1; while ((d + 1) * (d + 1) <= n) d += 1; return d; };

const FREE_CHOICES_1 = [24, 30, 36, 48, 60, 72, 96];
const FREE_CHOICES_2 = [60, 72, 84, 96, 105, 120];

/**
 * LA SECONDE CHANCE (même règle que le pilote : « لا بأس — جرّب أصغر », proposée seulement quand l'élève peine) : une manche
 * d'ENTRAÎNEMENT plus petite, avec un nombre qu'on voit d'un coup d'œil, sans questions ni étoiles. But : tous ses rectangles.
 */
const practice = (n, lead) => ({
  goal: [{ allPairs: n }],
  helpLine: 'جرّب أوّلًا بعدد أقلّ من الكتب، ثم عُد.',
  props: { type: 'factor-pairs', n, handDone: true, chains: [], predict: false, checkpoints: false, lead },
});

export const M1_ROUNDS = [
  { id: 'r1', title: '24 كتابًا في صفوف', goal: [{ checkpoint: 'first' }, { anyExact: true }], stars: { maxTrials: 3 },
    props: { type: 'factor-pairs', n: 24, chains: ['first'], rule: false,
      lead: 'في المكتبة 24 كتابًا نريد ترتيبها على رفّ في صفوف متساوية، دون صفّ ناقص.' } },
  { id: 'r2', title: '60 كتابًا: كل المستطيلات', goal: [{ allPairs: 60 }], stars: { maxTrials: 8 },
    easier: practice(12, 'جولة تدريب: 12 كتابًا فقط. جد كل المستطيلات التامّة.'),
    props: { type: 'factor-pairs', n: 60, handDone: true, chains: [], rule: false,
      lead: 'هذه المرّة 60 كتابًا: كل مستطيل تامّ تجده يضيف سطرًا إلى لوح الأزواج. جد كل المستطيلات التامّة.' } },
  { id: 'r3', title: '48 كتابًا', goal: [{ allPairs: 48 }], stars: { maxTrials: 7 },
    easier: practice(18, 'جولة تدريب: 18 كتابًا فقط. جد كل المستطيلات التامّة.'),
    props: { type: 'factor-pairs', n: 48, handDone: true, chains: [], rule: false,
      lead: 'نفس الطريقة مع 48 كتابًا: جد كل المستطيلات التامّة.' } },
  { id: 'challenge', optional: true, title: '36: المستطيل المربّع', goal: [{ allPairs: 36 }], stars: { maxTrials: 8, predict: false },
    props: { type: 'factor-pairs', n: 36, handDone: true, chains: [], rule: false, checkpoints: false, predict: false,
      lead: 'تحدٍّ: 36 كتابًا. جد كل المستطيلات التامّة: أيّها لا يعطي إلا قاسمًا واحدًا؟' } },
  { id: 'free', free: true, title: 'الرفّ الحرّ',
    props: { type: 'factor-pairs', n: 72, handDone: true, chains: [], rule: false, checkpoints: false, predict: false, nChoices: FREE_CHOICES_1,
      lead: 'الرفّ الحرّ: اختر عدد الكتب وجرّب ما تشاء.' } },
];

export const M2_ROUNDS = [
  { id: 'a', title: '105 كتب: متى نتوقّف؟', goal: [{ checkpoint: 'rule' }], stars: { maxTrials: 13 },
    props: { type: 'factor-pairs', n: 105, handDone: true, chains: ['rule'],
      lead: 'هذه المرّة 105 كتب، وعدد الصفوف الممكنة كبير. اختبر الأعداد، وانظر متى يتوقّف الجديد عن الظهور.' } },
  { id: 'challenge', optional: true, title: '84: أقلّ ما يمكن', goal: [{ allPairs: 84 }], stars: { maxTrials: boundOf(84), predict: false },
    props: { type: 'factor-pairs', n: 84, handDone: true, chains: [], checkpoints: false, predict: false,
      lead: 'تحدٍّ: 84 كتابًا. جد كل المستطيلات التامّة بأقلّ عدد من الاختبارات: أين يكفي أن تتوقّف؟' } },
  { id: 'free', free: true, title: 'الرفّ الحرّ',
    props: { type: 'factor-pairs', n: 96, handDone: true, chains: [], checkpoints: false, predict: false, nChoices: FREE_CHOICES_2,
      lead: 'الرفّ الحرّ: اختر عدد الكتب وجرّب ما تشاء.' } },
];
