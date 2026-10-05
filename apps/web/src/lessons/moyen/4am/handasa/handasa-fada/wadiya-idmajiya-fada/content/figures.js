/**
 * Les FIGURES que cette leçon dessine — la donnée seulement : SpaceFigure (`kind: 'space'`, repère 3D z en haut, cm) pour les
 * solides, GeoFigure (plan, y en haut) pour les coupes axiales. Une figure ne porte jamais la réponse de la question qui la montre.
 *
 * Analyse de la figure du manuel (guide §5) — le تحدّ p. 163 : un seau en perspective, Ø 40 en haut, Ø 30 en bas, deux cotes
 * verticales empilées 7 / 28 et le niveau d'eau en pointillés rouges. Le dessin est LISIBLE : il est REPRODUIT (CHALLENGE_FIGURE)
 * avec les cotes du manuel, le seau vu de face (les diamètres horizontaux), l'eau en bleu — sans aucun point nommé (le manuel n'en
 * nomme aucun) et sans le rayon de la surface (c'est la question).
 *
 * Les COUPES AXIALES (AXIAL, ICE_FIGURE) sont des figures planes de la plateforme : à l'échelle, le cône complété du seau serait
 * une bande 40 × 140 (rapport 3,5 : 1, refusée par figureQuality). On les dessine donc avec une échelle verticale réduite —
 * une affinité verticale garde le parallélisme et les rapports sur chaque droite, donc la configuration de Thalès et les angles
 * droits sur l'axe — et la légende le dit (« رسم غير مطابق للأبعاد »).
 */

/** Le تحدّ (p. 163) — le seau et son eau, les cotes du manuel ; pour la page d'unité (components/BucketFigure.jsx) et le module 1. */
export const CHALLENGE_FIGURE = {
  kind: 'space',
  view: { azimuth: -90, elevation: 14 },
  points: {
    O: [0, 0, 0], O1: [0, 0, 35], W: [0, 0, 28],
    T1: [-20, 0, 41], T2: [20, 0, 41], D1: [-15, 0, -6], D2: [15, 0, -6],
    V0: [-28, 0, 35], V1: [-28, 0, 28], V2: [-28, 0, 0],
    X0: [-37, 0, 17], // point caché : garde la place des cotes verticales dans le cadre
  },
  solids: [{ type: 'frustum', base: 'O', top: 'O1', radius: 15, topRadius: 20, tone: 'amber' }],
  circles: [{ center: 'W', radius: 19, tone: 'sky', bold: true }],
  segments: [
    { from: 'T1', to: 'T2', label: '40 cm' },
    { from: 'D1', to: 'D2', label: '30 cm' },
    { from: 'V0', to: 'V1', label: '7 cm', tone: 'rose', labelOffset: 24 },
    { from: 'V1', to: 'V2', label: '28 cm', labelOffset: 27 },
  ],
  hidden: ['O', 'O1', 'W', 'T1', 'T2', 'D1', 'D2', 'V0', 'V1', 'V2', 'X0'],
  ariaLabel: 'دلو على شكل مخروط مبتور فيه ماء: قطر الحافة العلوية 40 cm وقطر القاع 30 cm، ومن الحافة إلى سطح الماء 7 cm، ومن سطح الماء إلى القاع 28 cm',
  caption: 'شكل الكتاب (ص 163): الدلو والماء',
  maxWidth: 480,
};

/**
 * La COUPE AXIALE du seau complété (module 1, montrée APRÈS la question sur SO) : le cône de sommet S, le seau ABB′A′, l'eau
 * M′M ; y = z (cm) × 0,5 (échelle verticale réduite). Thalès dans SO₁B : (OA) ∥ (WM) ∥ (O₁B). Sans la cote WM = 19 : c'est la
 * question suivante.
 */
const Y = 0.5;
export const AXIAL = {
  points: {
    S: [0, 0], O: [0, 105 * Y], W: [0, 133 * Y], 'O₁': [0, 140 * Y],
    A: [15, 105 * Y], 'A′': [-15, 105 * Y], M: [19, 133 * Y], 'M′': [-19, 133 * Y], B: [20, 140 * Y], 'B′': [-20, 140 * Y],
  },
  segments: [
    { from: 'A′', to: 'A', bold: true }, { from: 'A', to: 'B', bold: true }, { from: 'B', to: 'B′', bold: true }, { from: 'B′', to: 'A′', bold: true },
    { from: 'M′', to: 'M', tone: 'sky', bold: true },
    { from: 'S', to: 'A', dashed: true }, { from: 'S', to: 'A′', dashed: true },
    { from: 'S', to: 'O', dashed: true, label: '105' },
    { from: 'O', to: 'A', label: '15' }, { from: 'O₁', to: 'B', label: '20' },
  ],
  rightAngles: [['S', 'O', 'A']],
  labels: { S: 's', O: 'w', W: 'sw', 'O₁': 'n', A: 'e', 'A′': 'w', M: 'e', 'M′': 'w', B: 'e', 'B′': 'w' },
  caption: 'المقطع المحوري للدلو بعد إكمال المخروط (رسم غير مطابق للأبعاد: السلّم الشاقولي مصغّر)',
  ariaLabel: 'المقطع المحوري: المثلث الذي رأسه S، والقطع [OA] و [WM] و [O₁B] متوازية؛ SO = 105 و OA = 15 و O₁B = 20',
  maxWidth: 420,
};

/**
 * « أتعمّق » — la coupe axiale du cornet (pointe S en bas, ouverture [AB] de rayon 4 à 16 cm de S) et de la boule de glace
 * (centre C, rayon 2) posée au-dessus de l'ouverture ; y × 0,6 pour le cône (la boule garde son rayon). Sans le niveau du liquide.
 */
const YI = 0.6;
export const ICE_FIGURE = {
  points: { S: [0, 0], I: [0, 16 * YI], A: [-4, 16 * YI], B: [4, 16 * YI], C: [0, 16 * YI + 2.7], E: [2, 16 * YI + 2.7] },
  segments: [
    { from: 'S', to: 'A', bold: true }, { from: 'S', to: 'B', bold: true }, { from: 'A', to: 'B' },
    { from: 'S', to: 'I', dashed: true }, { from: 'I', to: 'B', label: '4 cm' },
    { from: 'C', to: 'E', label: '2 cm', tone: 'rose' },
  ],
  circles: [{ center: 'C', radius: 2, tone: 'rose' }],
  labels: { S: 's', I: 'sw', A: 'w', B: 'e', C: 'nw', E: 'ne' },
  caption: 'مقطع محوري: ارتفاع المخروط SI = 16 cm (رسم غير مطابق للأبعاد)',
  ariaLabel: 'مقطع محوري: مخروط رأسه S إلى الأسفل، ارتفاعه SI = 16 cm ونصف قطر فتحته IB = 4 cm، وفوق الفتحة دائرة مركزها C ونصف قطرها 2 cm',
  maxWidth: 340,
};

/** « إختبار أولي » — le verre de frappé (Ø 8 au fond, Ø 12 en haut, 12 cm de haut, boisson sur 9 cm), sans aucune réponse. */
export const TEST_FIGURE = {
  kind: 'space',
  view: { azimuth: -90, elevation: 14 },
  points: {
    O: [0, 0, 0], O1: [0, 0, 12], W: [0, 0, 9],
    T1: [-6, 0, 14], T2: [6, 0, 14], D1: [-4, 0, -2], D2: [4, 0, -2],
    L0: [-8.5, 0, 12], L1: [-8.5, 0, 0], R0: [8, 0, 9], R1: [8, 0, 0],
    X0: [-11.5, 0, 6], X1: [11, 0, 4.5], // points cachés : la place des cotes verticales
  },
  solids: [{ type: 'frustum', base: 'O', top: 'O1', radius: 4, topRadius: 6, tone: 'violet' }],
  circles: [{ center: 'W', radius: 5.5, tone: 'amber', bold: true }],
  segments: [
    { from: 'T1', to: 'T2', label: '12 cm' },
    { from: 'D1', to: 'D2', label: '8 cm' },
    { from: 'L0', to: 'L1', label: '12 cm', labelOffset: 27 },
    { from: 'R0', to: 'R1', label: '9 cm', tone: 'amber', labelOffset: 23 },
  ],
  hidden: ['O', 'O1', 'W', 'T1', 'T2', 'D1', 'D2', 'L0', 'L1', 'R0', 'R1', 'X0', 'X1'],
  ariaLabel: 'كأس على شكل مخروط مبتور: قطر الفتحة 12 cm وقطر القاع 8 cm وارتفاعه 12 cm، والمشروب حتى عمق 9 cm',
  maxWidth: 420,
};
