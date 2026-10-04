/**
 * Les FIGURES du manuel que cette leçon redessine (GeoFigure — common/components/geoFigure.js) : la donnée
 * seulement, en unités libres, y vers le haut. Chaque figure suit la description de l'extraction
 * (docs/sources/4am/unit10/extraction.json › figure) et ne porte QUE les longueurs et les angles que le manuel
 * écrit — jamais une réponse. Les dessins respectent les rapports de l'énoncé (35°, 50° se voient). Le banc
 * d'exercices génère ses `statement.figure` depuis ces mêmes données.
 */

/** La MODÉLISATION de la وضعية (module 1) : A أريس, P–Q le poteau, M–S le مقام ; les deux triangles de sommet A. */
export const MODEL = {
  points: { M: [0, 0], S: [0, 5.2], P: [7.2, 0], Q: [7.2, 1.5], A: [10, 0] },
  segments: [
    { from: 'M', to: 'P', label: '95,65' }, { from: 'P', to: 'A', label: '2,45' },
    { from: 'P', to: 'Q', label: '2,30', bold: true, arrows: 1 }, { from: 'M', to: 'S', label: 'h', bold: true, arrows: 1 },
    { from: 'A', to: 'S', dashed: true, tone: 'amber' },
  ],
  polygons: [{ points: ['A', 'P', 'Q'], tone: 'sky' }, { points: ['A', 'M', 'S'], tone: 'amber' }],
  rightAngles: [['S', 'M', 'P'], ['Q', 'P', 'A']],
  angles: [{ at: 'A', from: 'P', to: 'Q', label: 'x' }],
  labels: { M: 's', S: 'n', P: 's', Q: 'n', A: 's' },
  ariaLabel: 'نموذج الوضعية: المقام [MS] ارتفاعه h والعمود [PQ] طوله 2,30 عموديان على الأرض؛ MP = 95,65 و PA = 2,45؛ خط النظر من A يمر بالقمة Q ويصل القمة S؛ x الزاوية بين الأرض وخط النظر في A',
  maxWidth: 360,
};

/** QCM 1 (p. 124) : MOB rectangle en O ; M à gauche, O à droite, B au-dessus de O. */
export const QCM1 = {
  points: { M: [0, 0], O: [6, 0], B: [6, 3] },
  segments: [['M', 'O'], ['O', 'B'], ['M', 'B']],
  rightAngles: [['M', 'O', 'B']],
  labels: { M: 'w', O: 'se', B: 'ne' },
  ariaLabel: 'مثلث MOB قائم في O: النقطة M على اليسار و O على اليمين و B فوق O',
  maxWidth: 300,
};

/** QCM 2 (p. 124) : LMN rectangle en M ; L en haut, M sous L, N loin à droite. */
export const QCM2 = {
  points: { L: [0, 3], M: [0, 0], N: [7, 0] },
  segments: [['L', 'M'], ['M', 'N'], ['L', 'N']],
  rightAngles: [['L', 'M', 'N']],
  labels: { L: 'nw', M: 'sw', N: 'e' },
  ariaLabel: 'مثلث LMN قائم في M: النقطة L في الأعلى و M تحتها و N بعيدة على اليمين',
  maxWidth: 320,
};

/** QCM 3 (p. 124) : ABC rectangle en B ; A au-dessus de B, C à droite ; AB = 7, Ĉ = 35° (tan 35° ≈ 0,70). */
export const QCM3 = {
  points: { A: [0, 3.5], B: [0, 0], C: [5, 0] },
  segments: [{ from: 'A', to: 'B', label: '7' }, ['B', 'C'], ['A', 'C']],
  rightAngles: [['A', 'B', 'C']],
  angles: [{ at: 'C', from: 'B', to: 'A', label: '35°' }],
  labels: { A: 'nw', B: 'sw', C: 'se' },
  ariaLabel: 'مثلث ABC قائم في B: A فوق B و C على اليمين؛ AB = 7 وقيس الزاوية C يساوي 35 درجة',
  maxWidth: 300,
};

/** QCM 5 (p. 124) : LIE rectangle en I ; L au-dessus de I, E loin à droite ; IL = 6 cm, L̂ = 50° (tan 50° ≈ 1,19). */
export const QCM5 = {
  points: { L: [0, 3], I: [0, 0], E: [3.575, 0] },
  segments: [{ from: 'L', to: 'I', label: '6 cm' }, ['I', 'E'], ['L', 'E']],
  rightAngles: [['L', 'I', 'E']],
  angles: [{ at: 'L', from: 'I', to: 'E', label: '50°' }],
  labels: { L: 'nw', I: 'sw', E: 'se' },
  ariaLabel: 'مثلث LIE قائم في I: L فوق I و E على اليمين؛ IL = 6 cm وقيس الزاوية L يساوي 50 درجة',
  maxWidth: 300,
};

/**
 * Un pavé droit ABCDEFGH en perspective cavalière, comme ex. 31 (p. 125) : face avant ABEF (A en bas à gauche,
 * B en bas à droite, E en haut à droite, F en haut à gauche), C derrière B, D au-dessus de C, H derrière A, G
 * au-dessus de H ; [AC] (diagonale du sol) et [AD] (diagonale du pavé), le triangle ACD rectangle en C.
 * `dims` = longueurs réelles (longueur AB, profondeur BC, hauteur CD) ; `labels` = ce que l'énoncé écrit.
 */
export function boxFigure({ AB, BC, CD, lab, ariaLabel, maxWidth = 340 }) {
  const k = 6 / AB; const w = AB * k; const h = Math.max(CD * k, 1.6); const dx = Math.max(BC * k * 0.75, 1.8); const dy = dx * 0.6;
  const r = (v) => Math.round(v * 1000) / 1000;
  return {
    points: {
      A: [0, 0], B: [r(w), 0], E: [r(w), r(h)], F: [0, r(h)],
      H: [r(dx), r(dy)], C: [r(w + dx), r(dy)], D: [r(w + dx), r(h + dy)], G: [r(dx), r(h + dy)],
    },
    segments: [
      { from: 'A', to: 'B', label: lab.AB }, { from: 'B', to: 'E' }, { from: 'E', to: 'F' }, { from: 'F', to: 'A', ...(lab.AF ? { label: lab.AF } : {}) },
      { from: 'B', to: 'C', ...(lab.BC ? { label: lab.BC } : {}) }, { from: 'C', to: 'D', ...(lab.CD ? { label: lab.CD } : {}) }, { from: 'E', to: 'D' }, { from: 'F', to: 'G', ...(lab.FG ? { label: lab.FG } : {}) }, { from: 'G', to: 'D' },
      { from: 'A', to: 'H', dashed: true }, { from: 'H', to: 'C', dashed: true }, { from: 'H', to: 'G', dashed: true },
      { from: 'A', to: 'C', dashed: true, tone: 'sky' }, { from: 'A', to: 'D', tone: 'rose', bold: true },
    ],
    rightAngles: [['A', 'C', 'D']],
    labels: { A: 'sw', B: 's', E: 'n', F: 'w', H: 'n', C: 'e', D: 'ne', G: 'nw' },
    ariaLabel,
    maxWidth,
  };
}

/** ex. 31 (p. 125) : AB = 3,15 cm, AF = 1,55 cm, FG = 2,35 cm. */
export const EX31 = boxFigure({
  AB: 3.15, BC: 2.35, CD: 1.55, lab: { AB: '3,15 cm', AF: '1,55 cm', FG: '2,35 cm' },
  ariaLabel: 'متوازي مستطيلات ABCDEFGH: الوجه الأمامي ABEF و AB = 3,15 cm و AF = 1,55 cm و FG = 2,35 cm؛ القطعتان [AC] قطر القاعدة و [AD] قطر المجسّم مرسومتان، والمثلث ACD قائم في C',
});

/**
 * Une pyramide régulière à base carrée ABCD (perspective), sommet S au-dessus du centre O : la hauteur [SO], le
 * demi-diagonale [OA], le triangle SOA rectangle en O — ex. 32 (p. 125) : côté 231 m, arêtes latérales 220 m.
 */
export function pyramidFigure({ side, edge, ariaLabel, maxWidth = 320 }) {
  return {
    points: { A: [0, 0], B: [5, 0], C: [6.6, 1.4], D: [1.6, 1.4], O: [3.3, 0.7], S: [3.3, 5.6] },
    segments: [
      { from: 'A', to: 'B', label: side }, ['B', 'C'], { from: 'C', to: 'D', dashed: true }, { from: 'D', to: 'A', dashed: true },
      { from: 'S', to: 'A', label: edge, tone: 'rose', bold: true }, ['S', 'B'], ['S', 'C'], { from: 'S', to: 'D', dashed: true },
      { from: 'S', to: 'O', dashed: true }, { from: 'O', to: 'A', dashed: true, tone: 'sky' }, { from: 'A', to: 'C', dashed: true },
    ],
    rightAngles: [['S', 'O', 'A']],
    labels: { A: 'sw', B: 'se', C: 'e', D: 'w', O: 'se', S: 'n' },
    hidden: [],
    ariaLabel,
    maxWidth,
  };
}

export const EX32 = pyramidFigure({
  side: '231 m', edge: '220 m',
  ariaLabel: 'هرم منتظم رأسه S وقاعدته المربع ABCD الذي طول ضلعه 231 m ومركزه O؛ الحرف الجانبي SA طوله 220 m؛ الارتفاع [SO] عمودي على القاعدة والمثلث SOA قائم في O',
});

/** La transposition du test (module 4) : le conteneur 12 m × 2,4 m × 2,4 m — sans aucune diagonale chiffrée. */
export const CONTAINER = boxFigure({
  AB: 12, BC: 2.4, CD: 2.4, lab: { AB: '12 m', BC: '2,4 m', CD: '2,4 m' }, maxWidth: 340,
  ariaLabel: 'حاوية على شكل متوازي مستطيلات ABCDEFGH: AB = 12 m و BC = 2,4 m والحرف الشاقولي CD = 2,4 m؛ القطعتان [AC] و [AD] مرسومتان والمثلث ACD قائم في C',
});
