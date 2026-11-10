/**
 * LES MÈTRES RUBANS de la leçon : le labo `square-root-side` (mode GRADUATION) joué en MANCHES avec étoiles dans le lecteur de mission
 * (rollout 2026-11-09, unité 2 leçon 2 ; conseil du 2026-11-09). Chaque manche pose DEUX cartes ou plus : une aire dont le côté tombe sur une
 * graduation (le carré d'un rationnel) et une aire dont le côté n'y tombe jamais. L'élève choisit la graduation 1/g et tire le côté.
 *
 *   r1  16 et 2, graduations jusqu'à 1/4, à la main avec ses questions (lire l'échelle d'un toucher → BÂTIR « 16 = 4 × 4 » → la carte qui
 *       résiste → la règle).
 *   r2  7 et 0,25 (l'activité), jusqu'à 1/6, avec deux prédictions — une « لا » (7, la carte ouverte au départ) et une « نعم » (0,25) : toujours
 *       répondre « لا » ne gagne pas l'étoile.
 *   r3  16/9 et 13, jusqu'à 1/6 (REQUISE, conseil) : 16/9 n'est pas « un entier sur un entier carré évident » — il faut TROUVER la graduation 1/3 ;
 *       encadré sur 1/1, 1/2 et 1/4 il ne « résiste » pas (lecteur : `truthful`, logic/squareRootSide › cardStatus). Prédictions « نعم » puis « لا ».
 *   ⭐  25/13 et 49/36, jusqu'à 1/8, en peu d'essais : 49/36 tombe sur 1/6 (le dénominateur 36 = 6² dit la graduation).
 *   libre : les six aires de l'activité, graduations jusqu'à 1/12 (les cartes SONT le choix).
 *
 * Buts : { checkpoint: 'rule' } (r1, la suite de questions), puis { anyExact } + { resists } — une carte tombée juste ET une carte qui a résisté,
 * VUES. Une carte rationnelle n'est jamais posée avec une graduation trop courte pour elle (test) : « لن يسقط على أي تدريجة » resterait vrai.
 * Aucun nombre de la مسألة (2,89 ; 4 et ses 9 pièces de 4/9 ; 3 ; 1,7 ; 12 jours ; 500 دج). Les vérités sont recalculées par content/rulers.test.js.
 */
const area = (num, den = 1) => ({ num, den });
const props = (areas, maxScale, extra) => ({ type: 'square-root-side', mode: 'graduation', areas, scale: maxScale, ...extra });
const quiet = { chains: [], predict: false };

export const R1 = [area(16), area(2)];
export const ACT = [area(7), area(25, 100)];
export const FLIP = [area(16, 9), area(13)];
export const CHALLENGE = [area(25, 13), area(49, 36)];
/** Les six aires de l'activité (classement en deux صنفين). */
export const FREE = [area(100), area(16, 9), area(25, 100), area(6), area(13), area(25, 13)];
export const PRACTICE = { r1: [area(1), area(2)], r2: [area(25, 100), area(2)], r3: [area(1, 9), area(5)] };

const practice = (areas, maxScale, lead) => ({
  goal: [{ anyExact: true }, { resists: true }], helpLine: 'جرّب أوّلًا مسطرة أقصر، ثم عُد.',
  props: props(areas, maxScale, { ...quiet, handDone: true, lead }),
});

export const M1_ROUNDS = [
  { id: 'r1', title: 'المساحتان 16 و 2', goal: [{ checkpoint: 'rule' }], stars: { maxTrials: 14, predict: false },
    easier: practice(PRACTICE.r1, 3, 'جولة تدريب: مربّعان مساحتاهما 1 و 2، ومسطرة حتى الأثلاث.'),
    props: props(R1, 4, { chains: ['grad'], predict: false,
      lead: 'مربّعان: مساحة الأوّل 16 ومساحة الثاني 2. اختر مسطرة، ثم اسحب طرف الضلع: هل يقع ضلع كل مربّع بالضبط على تدريجة؟' }) },
  { id: 'r2', title: 'المساحتان 7 و 0,25', goal: [{ anyExact: true }, { resists: true }], stars: { maxTrials: 16 },
    easier: practice(PRACTICE.r2, 3, 'جولة تدريب: المساحتان 0,25 و 2، ومسطرة حتى الأثلاث.'),
    props: props(ACT, 6, { chains: [], predict: true, handDone: true,
      lead: 'مربّعان مساحتاهما 7 و 0,25. توقّع لكل مربّع، ثم جرّب مسطرة بعد أخرى: أيّ الضلعين يقع على تدريجة؟' }) },
  { id: 'r3', title: 'المساحتان 16/9 و 13', goal: [{ anyExact: true }, { resists: true }], stars: { maxTrials: 18 },
    easier: practice(PRACTICE.r3, 3, 'جولة تدريب: المساحتان 1/9 و 5، ومسطرة حتى الأثلاث.'),
    props: props(FLIP, 6, { chains: [], predict: true, handDone: true,
      lead: 'مربّعان مساحتاهما 16/9 و 13. توقّع، ثم ابحث: على أيّ مسطرة قد يقع كل ضلع؟' }) },
  { id: 'challenge', optional: true, title: 'تحدٍّ: 25/13 و 49/36', goal: [{ anyExact: true }, { resists: true }], stars: { maxTrials: 12 },
    props: props(CHALLENGE, 8, { chains: [], predict: true, handDone: true,
      lead: 'تحدٍّ: مربّعان مساحتاهما 25/13 و 49/36. اختر المسطرة المناسبة من أوّل مرّة: المقام يدلّك.' }) },
  { id: 'free', free: true, title: 'الورشة الحرّة',
    props: props(FREE, 12, { ...quiet, checkpoints: false, handDone: true,
      lead: 'الورشة الحرّة: ست مساحات ومساطر حتى الجزء من 12. صنّف بنفسك: أيّ الأضلاع يقع على تدريجة؟' }) },
];
