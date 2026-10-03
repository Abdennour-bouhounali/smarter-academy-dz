/**
 * Les FIGURES du manuel que cette leçon redessine (GeoFigure — common/components/geoFigure.js) : la donnée
 * seulement, en unités libres, y vers le haut. Chaque figure suit la description de l'extraction
 * (docs/sources/4am/unit9/extraction.json › figure) et ne porte QUE les longueurs que le manuel écrit — jamais
 * une réponse. Les longueurs dessinées respectent les rapports de l'énoncé (Thalès se voit sur le dessin).
 */

/** QCM 1 (p. 112) : I sur [AB], J sur [AC], (IJ)//(BC) ; AI = 3, IB = 2, JC = 3, BC = 10, IJ = x, AJ = y. */
export const QCM1 = {
  points: { A: [2.5, 5], B: [0, 0], C: [7, 0], I: [1, 2], J: [5.2, 2] },
  segments: [
    { from: 'A', to: 'I', label: '3' }, { from: 'I', to: 'B', label: '2' },
    { from: 'A', to: 'J', label: 'y' }, { from: 'J', to: 'C', label: '3' },
    { from: 'B', to: 'C', label: '10', arrows: 1 }, { from: 'I', to: 'J', label: 'x', arrows: 1 },
  ],
  labels: { A: 'n', B: 'sw', C: 'se', I: 'w', J: 'e' },
  ariaLabel: 'مثلث ABC، النقطة I من [AB] و J من [AC] و (IJ) يوازي (BC)؛ AI = 3 و IB = 2 و JC = 3 و BC = 10 و IJ = x و AJ = y',
  maxWidth: 300,
};

/** QCM 2 (p. 112) : B, A, L et C, A, M alignés (A entre), (LM)//(BC) ; BC = 4, AM = 3, ML = 2, AL = 2, AB = x, AC = y. */
export const QCM2 = {
  points: { B: [-4, 2], C: [-4, -2], A: [0, 0], L: [2, -1], M: [2, 1] },
  segments: [
    { from: 'B', to: 'C', label: '4', arrows: 1 }, { from: 'M', to: 'L', label: '2', arrows: 1 },
    { from: 'B', to: 'A', label: 'x' }, { from: 'A', to: 'L', label: '2' },
    { from: 'C', to: 'A', label: 'y' }, { from: 'A', to: 'M', label: '3' },
  ],
  labels: { B: 'nw', C: 'sw', A: 'n', L: 'se', M: 'ne' },
  ariaLabel: 'شكل فراشة: النقط B و A و L على استقامة والنقط C و A و M على استقامة، و (LM) يوازي (BC)؛ BC = 4 و AM = 3 و ML = 2 و AL = 2 و AB = x و AC = y',
  maxWidth: 320,
};

/** QCM 3 (p. 112) : A, B, E et A, C, F alignés ; AB = 11, BE = 22, AC = 15, CF = 45 (aucun parallélisme annoncé). */
export const QCM3 = {
  points: { A: [0, 0], B: [8 / 3, 5 / 3], E: [8, 5], C: [3, 0], F: [12, 0] },
  segments: [
    { from: 'A', to: 'B', label: '11' }, { from: 'B', to: 'E', label: '22' },
    { from: 'A', to: 'C', label: '15', labelSide: -1 }, { from: 'C', to: 'F', label: '45', labelSide: -1 },
    ['B', 'C'], ['E', 'F'],
  ],
  labels: { A: 'w', B: 'nw', E: 'n', C: 's', F: 'e' },
  ariaLabel: 'النقط A و B و E على استقامة والنقط A و C و F على استقامة؛ AB = 11 و BE = 22 و AC = 15 و CF = 45',
  maxWidth: 340,
};

/** QCM 4 (p. 112) : [AB] gradué en 5 parts égales, M la 3ᵉ graduation, des parallèles à (BC) par les graduations. */
export const QCM4 = {
  points: {
    A: [0, 0], B: [5, 0], C: [7, 4.5], M: [3, 0], N: [4.2, 2.7],
    G1: [1, 0], G2: [2, 0], G4: [4, 0], H1: [1.4, 0.9], H2: [2.8, 1.8], H4: [5.6, 3.6],
  },
  segments: [
    ['A', 'B'], ['A', 'C'],
    { from: 'B', to: 'C', arrows: 1, bold: true }, { from: 'M', to: 'N', arrows: 1, bold: true },
    { from: 'G1', to: 'H1', tone: 'sky' }, { from: 'G2', to: 'H2', tone: 'sky' }, { from: 'G4', to: 'H4', tone: 'sky' },
    { from: 'A', to: 'G1', ticks: 1 }, { from: 'G1', to: 'G2', ticks: 1 }, { from: 'G2', to: 'M', ticks: 1 },
    { from: 'M', to: 'G4', ticks: 1 }, { from: 'G4', to: 'B', ticks: 1 },
  ],
  hidden: ['G1', 'G2', 'G4', 'H1', 'H2', 'H4'],
  labels: { A: 'w', B: 's', C: 'n', M: 's', N: 'nw' },
  ariaLabel: 'القطعة [AB] مقسمة بتدريج منتظم إلى خمس قطع متقايسة، M النقطة الثالثة من A، وموازيات للمستقيم (BC) تمر بنقاط التدريج وتقطع [AC]، و N نقطة تقاطع الموازي المار بـ M مع [AC]',
  maxWidth: 320,
};

/**
 * La وضعية (p. 112) : la DEMI-coupe axiale — S centre de la base du cône, K un point du cercle de base (SK = R = 6),
 * O le sommet (SO = H = 18) ; le cylindre : T centre de sa face libre (ST = h), C sur son cercle (TC = r), D sur
 * la base. C est sur la génératrice [OK]. Les dimensions h et r sont des LETTRES (rien de la réponse n'est dessiné :
 * le coin est placé à un endroit quelconque de la génératrice).
 */
export const SECTION = {
  points: { S: [0, 0], K: [0, 6], O: [18, 0], T: [6, 0], C: [6, 4], D: [0, 4] },
  segments: [
    { from: 'S', to: 'K', label: '6', labelSide: 1 }, { from: 'K', to: 'O' }, { from: 'S', to: 'T', label: 'h', labelSide: -1 },
    { from: 'T', to: 'O', labelSide: -1 }, { from: 'T', to: 'C', label: 'r', tone: 'indigo', bold: true },
    { from: 'D', to: 'C', tone: 'indigo' }, { from: 'S', to: 'D', tone: 'indigo' },
  ],
  polygons: [{ points: ['O', 'T', 'C'], tone: 'amber' }],
  rightAngles: [['K', 'S', 'O'], ['C', 'T', 'O']],
  labels: { S: 'sw', K: 'nw', O: 'e', T: 's', C: 'n', D: 'w' },
  ariaLabel: 'نصف المقطع المحوري: المثلث القائم OSK حيث SK = 6 و SO = 18، والمستطيل SDCT للأسطوانة حيث ST = h و TC = r، والنقطة C على [OK]',
  caption: 'ارتفاع المخروط 18 ونصف قطر قاعدته 6',
  maxWidth: 420,
};

/** أتعمّق 20 (p. 113) : EBCF شبه منحرف, EF = BC ÷ 2 ; G = (BF) ∩ (EC), A = (CF) ∩ (BE), L = (AG) ∩ [BC]. */
export const EX20 = {
  points: { B: [0, 0], C: [8, 0], F: [6, 3], E: [2, 3], A: [4, 6], G: [4, 2], L: [4, 0] },
  segments: [
    { from: 'E', to: 'F', arrows: 1 }, { from: 'B', to: 'C', arrows: 1 },
    ['B', 'E'], ['E', 'A'], ['C', 'F'], ['F', 'A'], ['B', 'F'], ['E', 'C'],
    { from: 'A', to: 'L', dashed: true, tone: 'indigo' },
  ],
  labels: { B: 'sw', C: 'se', F: 'e', E: 'w', A: 'n', G: 'e', L: 's' },
  ariaLabel: 'شبه منحرف EBCF قاعدتاه [EF] و [BC] حيث EF نصف BC، قطراه يتقاطعان في G، و (CF) و (BE) يتقاطعان في A، و (AG) يقطع [BC] في L',
  maxWidth: 300,
};

/** أتعمّق 22 (p. 113) : O sur l'autre rive ; O, B, D et O, A, C alignés ; (AB)//(CD) ; AB = 2, CD = 5, BD = 6. */
export const EX22 = {
  points: { O: [0, 0], B: [3.94, -0.69], D: [9.85, -1.74], A: [3.11, -2.52], C: [7.78, -6.29] },
  segments: [
    ['O', 'B'], { from: 'B', to: 'D', label: '6 m' }, ['O', 'A'], ['A', 'C'],
    { from: 'A', to: 'B', label: '2 m', arrows: 1 }, { from: 'C', to: 'D', label: '5 m', arrows: 1 },
  ],
  labels: { O: 'w', B: 'n', D: 'ne', A: 'sw', C: 's' },
  ariaLabel: 'النقطة O على الضفة الأخرى للنهر؛ O و B و D على استقامة و O و A و C على استقامة، و (AB) يوازي (CD)؛ AB = 2 m و CD = 5 m و BD = 6 m',
  caption: 'O على الضفة الأخرى للنهر',
  maxWidth: 340,
};
