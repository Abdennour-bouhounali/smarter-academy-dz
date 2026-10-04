/**
 * Les FIGURES que cette leçon redessine (GeoFigure — common/components/geoFigure.js) : la donnée seulement, en unités du
 * معلم (un carreau = 1), y vers le haut. Chaque figure suit l'extraction (docs/sources/4am/unit12/extraction.json › figure)
 * et ne porte QUE ce que le manuel dessine — jamais une réponse. Les demi-cercles sont des `arcs` (diamètre [from, to],
 * sens vu sur la figure), les cercles en pointillé du manuel des `circles` dont le centre est un point CACHÉ.
 *
 * ANALYSE (règle du propriétaire, guide §5 « Textbook figures ») :
 *   — la وضعية p. 148 : quadrillage presque carré (8 × 7), mais les deux parcours sont du MÊME rouge, les deux sommets
 *     intermédiaires de (2) et le point (2 ; 0) ne sont pas nommés, l'étiquette « (2) » est posée sur un sommet :
 *     REDESSINÉE avec le même concept et les mêmes coordonnées — un ton par parcours (rose, bleu ciel), les noms E, P, Q
 *     de la plateforme, les cercles en pointillé gardés (ce sont eux qui disent « نصف دائرة ») ;
 *   — QCM 1 et QCM 4 (p. 148) : petites figures lisibles (A, B sur nœuds) — REPRODUITES, avec axes et quadrillage ;
 *   — ex. 22, 23, 25 (p. 149) n'ont pas de figure : la plateforme montre les points DONNÉS (la question « علّم النقط »),
 *     rien de ce qu'il faut démontrer ;
 *   — le إختبار أولي : figure de la plateforme sur le même modèle que la وضعية.
 */

/** La وضعية (p. 148) : les deux parcours des coureurs. */
export const SITUATION_FIGURE = {
  points: {
    A: [-2, 0], O: [0, 0], E: [2, 0], B: [4, 0],
    M: [-2, 3], P: [1, 1], Q: [3, 2], N: [4, -2],
    I: [-1, 0], J: [1, 0], K: [3, 0],
  },
  hidden: ['I', 'J', 'K'],
  circles: [{ center: 'I', through: 'A', dashed: true }, { center: 'J', through: 'O', dashed: true }, { center: 'K', through: 'E', dashed: true }],
  arcs: [{ from: 'A', to: 'O', sweep: 'cw', tone: 'rose', bold: true }, { from: 'O', to: 'E', sweep: 'ccw', tone: 'rose', bold: true }, { from: 'E', to: 'B', sweep: 'cw', tone: 'rose', bold: true }],
  segments: [{ from: 'M', to: 'P', tone: 'sky', bold: true }, { from: 'P', to: 'Q', tone: 'sky', bold: true }, { from: 'Q', to: 'N', tone: 'sky', bold: true }],
  labels: { A: 'nw', O: 'nw', E: 'se', B: 'ne', M: 'n', P: 'sw', Q: 'ne', N: 'e' },
  grid: true,
  axes: true,
  caption: 'أعادت المنصّة رسم شكل الكتاب بوضوح أكبر، بنفس المعطيات — المسار (1) بالوردي والمسار (2) بالأزرق',
  ariaLabel: 'معلم متعامد ومتجانس على ورقة مرصوفة: المسار (1) من A(−2 ; 0) إلى B(4 ; 0) ثلاثة أنصاف دوائر متتابعة أطرافها O(0 ; 0) و E(2 ; 0) على محور الفواصل (الأول والثالث فوق المحور والثاني تحته، والدوائر الكاملة بخط متقطع)، والمسار (2) خط منكسر من M(−2 ; 3) إلى P(1 ; 1) ثم Q(3 ; 2) ثم N(4 ; −2)',
};

/** QCM 1 (p. 148) : A(3 ; 2), B(−2 ; −2), la flèche de A vers B et les projections en pointillé. */
export const QCM1 = {
  points: { A: [3, 2], B: [-2, -2], a1: [3, 0], a2: [0, 2], b1: [-2, 0], b2: [0, -2] },
  hidden: ['a1', 'a2', 'b1', 'b2'],
  vectors: [{ from: 'A', to: 'B', tone: 'rose' }],
  segments: [{ from: 'A', to: 'a1', dashed: true }, { from: 'A', to: 'a2', dashed: true }, { from: 'B', to: 'b1', dashed: true }, { from: 'B', to: 'b2', dashed: true }],
  labels: { A: 'ne', B: 'sw' },
  grid: true,
  axes: true,
  ariaLabel: 'معلم متعامد ومتجانس على ورقة مرصوفة: النقطة A أعلى اليمين والنقطة B أسفل اليسار، مع إسقاطيهما المتقطعين على المحورين، وشعاع من A إلى B',
};

/** QCM 4 (p. 148) : deux points sans projection, A en haut à droite, B en bas à gauche. */
export const QCM4 = {
  points: { A: [3, 3], B: [-3, -3] },
  labels: { A: 'ne', B: 'sw' },
  grid: true,
  axes: true,
  ariaLabel: 'معلم متعامد ومتجانس على ورقة مرصوفة: النقطة A أعلى اليمين والنقطة B أسفل اليسار',
};

/** Ex. 22 (p. 149) : les quatre points DONNÉS (rien de ce qu'il faut démontrer). */
export const EX22 = {
  points: { A: [1, 3], B: [2, 4], C: [5, 1], D: [2, 0] },
  labels: { A: 'w', B: 'n', C: 'e', D: 's' },
  grid: true,
  axes: true,
  caption: 'النقط الأربع معلَّمة: تحقّق من تعليمك',
  ariaLabel: 'معلم متعامد ومتجانس: النقط A(1 ; 3) و B(2 ; 4) و C(5 ; 1) و D(2 ; 0)',
};

/** Ex. 23 (p. 149) : les trois points DONNÉS. */
export const EX23 = {
  points: { A: [-3, 1], B: [3, 5], C: [5, 2] },
  labels: { A: 'w', B: 'n', C: 'e' },
  grid: true,
  axes: true,
  caption: 'النقط الثلاث معلَّمة: تحقّق من تعليمك',
  ariaLabel: 'معلم متعامد ومتجانس: النقط A(−3 ; 1) و B(3 ; 5) و C(5 ; 2)',
};

/** Ex. 25 (p. 149, شهادة التعليم المتوسط) : les trois points DONNÉS. */
export const EX25 = {
  points: { A: [-2, -3], B: [4, 1], C: [2, 4] },
  labels: { A: 'w', B: 'e', C: 'n' },
  grid: true,
  axes: true,
  caption: 'النقط الثلاث معلَّمة: تحقّق من تعليمك',
  ariaLabel: 'معلم متعامد ومتجانس: النقط A(−2 ; −3) و B(4 ; 1) و C(2 ; 4)',
};

/**
 * « إختبار أولي » — la وضعية TRANSPOSÉE : deux pistes de VTT à جبل الوحش (Constantine). Piste (1) : deux demi-cercles de
 * diamètres [CK] et [KD] (le premier au-dessus de l'axe, le second au-dessous) ; piste (2) : la ligne brisée E → F → G → H, au-dessus (aucun croisement avec les arcs).
 * Les centres ne sont PAS dessinés (c'est la question E1), aucune longueur n'est écrite.
 */
export const TEST_FIGURE = {
  points: {
    C: [-3, 0], K: [1, 0], D: [5, 0],
    E: [-3, 7], F: [0, 3], G: [3, 6], H: [5, 4],
  },
  arcs: [{ from: 'C', to: 'K', sweep: 'cw', tone: 'rose', bold: true }, { from: 'K', to: 'D', sweep: 'ccw', tone: 'rose', bold: true }],
  segments: [{ from: 'E', to: 'F', tone: 'sky', bold: true }, { from: 'F', to: 'G', tone: 'sky', bold: true }, { from: 'G', to: 'H', tone: 'sky', bold: true }],
  labels: { C: 'sw', K: 'se', D: 'se', E: 'w', F: 's', G: 'n', H: 'e' },
  grid: true,
  axes: true,
  caption: 'المسلك (1) بالوردي والمسلك (2) بالأزرق',
  ariaLabel: 'معلم متعامد ومتجانس على ورقة مرصوفة: المسلك (1) من C(−3 ; 0) إلى D(5 ; 0) نصفا دائرتين يلتقيان في K(1 ; 0)، الأول فوق محور الفواصل والثاني تحته، والمسلك (2) فوقه خط منكسر من E(−3 ; 7) إلى F(0 ; 3) ثم G(3 ; 6) ثم H(5 ; 4)',
};
