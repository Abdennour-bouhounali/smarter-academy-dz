/**
 * Les FIGURES que cette leçon redessine (GeoFigure — common/components/geoFigure.js) : la donnée seulement, en unités
 * libres (un carreau de la ورقة مرصوفة = 1), y vers le haut. Chaque figure suit la description de l'extraction
 * (docs/sources/4am/unit11/extraction.json › figure) et ne porte QUE ce que le manuel dessine — jamais une réponse :
 * la figure de la وضعية place le passage n'importe où (pas à la place optimale), celle de l'ex. 19 ne montre que le
 * triangle EFG donné (D, C et le carré sont à construire). Le banc d'exercices dessine ses `statement.figure` sur le
 * même modèle (une seule façon de dessiner la route et le passage).
 */

/** Une route horizontale entre y = 0 et y = w, de x0 à x1 : quatre coins cachés et la bande teintée. */
const road = (x0, x1, w) => ({
  points: { R1: [x0, w], R2: [x1, w], R3: [x1, 0], R4: [x0, 0] },
  polygon: { points: ['R1', 'R2', 'R3', 'R4'], tone: 'slate' },
  edges: [{ from: 'R1', to: 'R2', bold: true }, { from: 'R4', to: 'R3', bold: true }],
});

/**
 * La وضعية « ممر الراجلين » (p. 136) avec les nombres de la plateforme (extraction › situation › answer ›
 * illustration) : la route entre les deux bords (largeur 2 carreaux), A (الحي) 3 carreaux au-dessus du bord haut,
 * B (المدرسة) 3 carreaux au-dessous du bord bas, 7 carreaux d'écart. Le passage [MN] est posé AILLEURS qu'à la bonne
 * place : la figure modélise, elle ne répond pas.
 */
const R = road(-4.5, 5.5, 2);
export const MODEL = {
  points: { ...R.points, A: [-3, 5], M: [-1, 2], N: [-1, 0], B: [4, -3] },
  polygons: [R.polygon],
  segments: [...R.edges, { from: 'A', to: 'M', tone: 'amber' }, { from: 'M', to: 'N', bold: true, tone: 'indigo' }, { from: 'N', to: 'B', tone: 'amber' }],
  rightAngles: [['R1', 'M', 'N']],
  hidden: ['R1', 'R2', 'R3', 'R4'],
  labels: { A: 'n', B: 's', M: 'ne', N: 'se' },
  grid: true,
  // Le dessin du manuel est une BANDE étroite (route très large, A et B collés aux bords, pas de quadrillage) : redessiné
  // sur un quadrillage presque carré avec l'exemple chiffré de la plateforme (guide §5 « Textbook figures »).
  caption: 'أعادت المنصّة رسم شكل الكتاب بوضوح أكبر، بنفس المعطيات',
  ariaLabel: 'خريطة الوضعية على ورقة مرصوفة: طريق عرضه مربعان بين حافتين متوازيتين، الحي A فوق الحافة العليا بثلاثة مربعات، والمدرسة B تحت الحافة السفلى بثلاثة مربعات وعلى بعد سبعة مربعات أفقيا من A، وممر الراجلين [MN] عمودي على الحافتين، والمسلك من A إلى M ثم N ثم B',
};

/** QCM 1 (p. 136) : ورقة مرصوفة — MN vers la gauche, AC vers la droite, AD vers le bas, GH et EF vers la droite. */
export const QCM1 = {
  points: { M: [4, 5], N: [0, 5], A: [2, 4], C: [6, 4], D: [6, 0], G: [-1, 1], H: [3, 1], E: [0, 0], F: [4, 0] },
  vectors: [{ from: 'M', to: 'N' }, { from: 'A', to: 'C' }, { from: 'A', to: 'D' }, { from: 'G', to: 'H' }, { from: 'E', to: 'F' }],
  labels: { M: 'ne', N: 'nw', A: 'nw', C: 'ne', D: 'se', G: 'w', H: 'e', E: 'sw', F: 'se' },
  grid: true,
  ariaLabel: 'ورقة مرصوفة: الشعاع MN أفقي نحو اليسار، تحته الشعاع AC أفقي نحو اليمين والشعاع AD مائل نحو الأسفل، والشعاعان GH و EF أفقيان نحو اليمين؛ الأشعة الأفقية الأربعة لها نفس الطول',
};

/** QCM 3 (p. 136) : AB vers la gauche, CD vers la droite (même longueur), EH vers le bas, GH vers la droite plus court. */
export const QCM3 = {
  points: { A: [7, 4], B: [1, 4], C: [0, 2], D: [6, 2], E: [9, 4], H: [9, 0], G: [5, 0] },
  vectors: [{ from: 'A', to: 'B' }, { from: 'C', to: 'D' }, { from: 'E', to: 'H' }, { from: 'G', to: 'H' }],
  labels: { A: 'n', B: 'n', C: 'w', D: 'e', E: 'ne', H: 'se', G: 'sw' },
  grid: true,
  ariaLabel: 'ورقة مرصوفة: الشعاع AB أفقي نحو اليسار، والشعاع CD أفقي نحو اليمين بنفس الطول تحته، والشعاع EH شاقولي نحو الأسفل، والشعاع GH أفقي نحو اليمين أقصر',
};

/** QCM 4 (p. 136) : les trois représentants proposés — CB, BC, AE (ABEC متوازي أضلاع). */
const Q4 = { A: [0, 3], C: [4, 3], B: [1, 0] };
export const QCM4_OPTIONS = [
  { points: Q4, vectors: [{ from: 'C', to: 'B' }], labels: { A: 'nw', C: 'ne', B: 'sw' }, ariaLabel: 'النقط A و B و C والشعاع من C إلى B', maxWidth: 300 },
  { points: Q4, vectors: [{ from: 'B', to: 'C' }], labels: { A: 'nw', C: 'ne', B: 'sw' }, ariaLabel: 'النقط A و B و C والشعاع من B إلى C', maxWidth: 300 },
  { points: { ...Q4, E: [5, 0] }, vectors: [{ from: 'A', to: 'E' }], segments: [{ from: 'A', to: 'B', dashed: true }, { from: 'A', to: 'C', dashed: true }, { from: 'B', to: 'E', dashed: true }, { from: 'C', to: 'E', dashed: true }], labels: { A: 'nw', C: 'ne', B: 'sw', E: 'se' }, ariaLabel: 'النقط A و B و C و E حيث ABEC متوازي أضلاع، والشعاع من A إلى E', maxWidth: 300 },
];

/** Ex. 19 (p. 137, شهادة التعليم المتوسط) : SEUL le triangle donné EFG rectangle isocèle en F (EF = FG = 4 cm). */
export const EX19 = {
  points: { E: [-4, 0], F: [0, 0], G: [0, 4] },
  segments: [{ from: 'E', to: 'F', label: '4 cm' }, { from: 'F', to: 'G', label: '4 cm' }, ['E', 'G']],
  rightAngles: [['E', 'F', 'G']],
  labels: { E: 'w', F: 's', G: 'n' },
  ariaLabel: 'مثلث EFG قائم في F حيث EF = FG = 4 cm',
};

/** Ex. 22 (p. 137) : un quadrilatère quelconque ABCD et les milieux M, N, P, Q de [DA], [AB], [BC], [CD]. */
export const EX22 = {
  points: { A: [0, 3], B: [2, 0], C: [8, 0], D: [4, 5], M: [2, 4], N: [1, 1.5], P: [5, 0], Q: [6, 2.5] },
  polygons: [{ points: ['A', 'B', 'C', 'D'], tone: 'indigo' }],
  segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']],
  labels: { A: 'w', B: 's', C: 'e', D: 'n', M: 'nw', N: 'sw', P: 's', Q: 'ne' },
  ariaLabel: 'رباعي كيفي ABCD: A على اليسار و D في الأعلى و C على اليمين و B في الأسفل؛ M و N و P و Q منتصفات [DA] و [AB] و [BC] و [CD]',
  maxWidth: 480,
};

/**
 * « إختبار أولي » — la وضعية TRANSPOSÉE : une passerelle au-dessus de l'autoroute de l'Est à Oran, la station du
 * tramway A et le stade B ; un carreau = 10 m. Autoroute de 3 carreaux, A 2 carreaux au-dessus, B 4 au-dessous, 9
 * d'écart. La passerelle est posée AILLEURS qu'à la bonne place (x = 6 ; l'optimum est x = 3).
 */
const RT = road(-1, 10, 3);
export const TEST_FIGURE = {
  points: { ...RT.points, A: [0, 5], M: [6, 3], N: [6, 0], B: [9, -4] },
  polygons: [RT.polygon],
  segments: [...RT.edges, { from: 'A', to: 'M', tone: 'amber' }, { from: 'M', to: 'N', bold: true, tone: 'indigo' }, { from: 'N', to: 'B', tone: 'amber' }],
  rightAngles: [['R1', 'M', 'N']],
  hidden: ['R1', 'R2', 'R3', 'R4'],
  labels: { A: 'n', B: 's', M: 'ne', N: 'se' },
  grid: true,
  ariaLabel: 'خريطة على ورقة مرصوفة ضلع مربعها يمثّل 10 أمتار: طريق سيار عرضه ثلاثة مربعات، محطة الترامواي A فوق حافته العليا بمربعين، والملعب B تحت حافته السفلى بأربعة مربعات وعلى بعد تسعة مربعات أفقيا من A، والجسر [MN] عمودي على الحافتين',
};
