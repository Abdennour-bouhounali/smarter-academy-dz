import { rotation as ROT } from '@smarter-academy/core';

/**
 * Les FIGURES que cette leçon dessine (GeoFigure — common/components/geoFigure.js) : la donnée seulement, en unités libres,
 * y vers le haut. Les sommets d'un polygone régulier sont calculés par `rotation.regularVertices` (chaque sommet image du
 * précédent par le دوران de 360°/n), arrondis au millième pour le dessin. Chaque figure suit l'extraction
 * (docs/sources/4am/unit13/extraction.json) ; une figure ne porte jamais la réponse de la question qui la montre.
 *
 * Analyse des figures du manuel (guide §5) : celles du QCM (p. 160) sont lisibles (un rectangle et ses diagonales, deux cercles,
 * un pentagone codé) — REPRODUITES avec les coordonnées de l'extraction. La وضعية et les exercices 15 et 20 n'ont pas de figure
 * (« يُطلب إنجاز الشكل » pour le 20) : les figures sont celles de la plateforme, déclarées par leur légende.
 */
const r3 = (v) => Math.round(v * 1000) / 1000;
// Les `names.length` premiers sommets seulement (le إختبار ne dessine que deux lampadaires sur huit).
const vertices = (O, r, n, start, names, dir = 'direct') => Object.fromEntries(ROT.regularVertices(O, r, n, start, dir).slice(0, names.length).map((p, k) => [names[k], [r3(p.x), r3(p.y)]]));

/** La وضعية (p. 160) — le PLAN, montré APRÈS l'étape d'exécution : le massif de 3 m (1 cm ↔ 1 m), six poteaux P₁ … P₆. */
const HEX = vertices({ x: 0, y: 0 }, 3, 6, 90, ['P₁', 'P₂', 'P₃', 'P₄', 'P₅', 'P₆']);
export const PLAN = {
  points: { O: [0, 0], ...HEX },
  circles: [{ center: 'O', radius: 3, tone: 'emerald' }],
  polygons: [{ points: ['P₁', 'P₂', 'P₃', 'P₄', 'P₅', 'P₆'], tone: 'amber' }],
  segments: [{ from: 'O', to: 'P₁', dashed: true, label: '3' }, { from: 'O', to: 'P₂', dashed: true }, { from: 'P₁', to: 'P₂', label: '3', bold: true }],
  angles: [{ at: 'O', from: 'P₁', to: 'P₂', label: '60°', arrow: true }],
  labels: { O: 's' },
  caption: 'مخطط من المنصّة (الكتاب لا يرسم الوضعية): السنتيمتر على المخطط يمثّل مترا في الحديقة',
  ariaLabel: 'مخطط الحوض: دائرة مركزها O ونصف قطرها 3، وعلى محيطها ستة أعمدة P₁ إلى P₆ رؤوس سداسي منتظم؛ الزاوية P₁OP₂ قيسها 60 درجة والمسافة P₁P₂ تساوي 3',
  maxWidth: 420,
};

/** QCM 1 (p. 160) : rectangle ABCD (B en haut à gauche, A en haut à droite), diagonales en O, \widehat{BOC} = 60°. */
export const QCM1 = {
  points: { O: [0, 0], A: [1.732, 1], B: [-1.732, 1], C: [-1.732, -1], D: [1.732, -1] },
  segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C'], ['B', 'D']],
  angles: [{ at: 'O', from: 'B', to: 'C', label: '60°' }],
  labels: { A: 'ne', B: 'nw', C: 'sw', D: 'se', O: 'n' },
  ariaLabel: 'مستطيل ABCD: B أعلى اليسار و A أعلى اليمين و C أسفل اليسار و D أسفل اليمين، قطراه [AC] و [BD] يتقاطعان في O، والزاوية BOC قيسها 60 درجة',
  maxWidth: 360,
};

/** QCM 2 (p. 160) : cercle de centre O ; A, B, C sur le cercle ; D dehors, E dedans (entre O et D). */
export const QCM2 = {
  points: { O: [0, 0], A: [-2, 0], C: [0.684, 1.879], B: [0.684, -1.879], E: [0.8, 0], D: [2.9, 0] },
  circles: [{ center: 'O', radius: 2 }],
  segments: [['A', 'C'], ['A', 'B'], ['O', 'C'], ['O', 'B'], ['E', 'C'], ['E', 'B'], ['D', 'C'], ['D', 'B']],
  labels: { O: 'w', E: 'e', A: 'w', C: 'n', B: 's', D: 'e' },
  ariaLabel: 'دائرة مركزها O؛ النقط A و C و B على الدائرة، والنقطة D خارجها على اليمين، والنقطة E داخلها بين O و D؛ القطع AC و AB و OC و OB و EC و EB و DC و DB',
  maxWidth: 380,
};

/** QCM 3 (p. 160) : cercle de centre O, [BC] diamètre, A sur le cercle à gauche. */
export const QCM3 = {
  points: { O: [0, 0], B: [-0.618, 1.902], C: [0.618, -1.902], A: [-1.975, 0.313] },
  circles: [{ center: 'O', radius: 2 }],
  segments: [['A', 'B'], ['A', 'C'], ['B', 'C']],
  labels: { O: 'e', B: 'n', C: 's', A: 'w' },
  ariaLabel: 'دائرة مركزها O و [BC] قطر لها، والنقطة A على الدائرة على اليسار؛ القطع AB و AC و BC',
  maxWidth: 340,
};

/** QCM 4 (p. 160) : le pentagone ABCDE aux cinq côtés codés égaux, angles droits en A et en E. */
export const QCM4 = {
  points: { A: [0, 1], B: [1, 1], C: [1.866, 0.5], D: [1, 0], E: [0, 0] },
  segments: [{ from: 'A', to: 'B', ticks: 1 }, { from: 'B', to: 'C', ticks: 1 }, { from: 'C', to: 'D', ticks: 1 }, { from: 'D', to: 'E', ticks: 1 }, { from: 'E', to: 'A', ticks: 1 }],
  rightAngles: [['B', 'A', 'E'], ['A', 'E', 'D']],
  labels: { A: 'nw', B: 'n', C: 'e', D: 's', E: 'sw' },
  ariaLabel: 'مضلع ABCDE له خمسة أضلاع متقايسة (علامة على كل ضلع)، وزاويتاه عند A و E قائمتان، والرأس C على اليمين',
  maxWidth: 340,
};

/**
 * Ex. 15 (p. 161, après correction : le pentagone régulier BCDEF de centre A) — figure de la plateforme : le cercle de centre A
 * et de rayon AB = 4, B puis ses images successives C, D, E, F par le دوران (A, 72°) dans le sens direct.
 */
const PENTA = vertices({ x: 0, y: 0 }, 4, 5, 0, ['B', 'C', 'D', 'E', 'F']);
export const EX15 = {
  points: { A: [0, 0], ...PENTA },
  circles: [{ center: 'A', radius: 4, tone: 'sky' }],
  polygons: [{ points: ['B', 'C', 'D', 'E', 'F'], tone: 'indigo' }],
  segments: [{ from: 'A', to: 'B', label: '4 cm', dashed: true }, { from: 'A', to: 'C', dashed: true }],
  angles: [{ at: 'A', from: 'B', to: 'C', label: '72°', arrow: true }],
  labels: { A: 'sw' },
  caption: 'شكل من المنصّة: B ثم صورها المتتالية C و D و E و F بالدوران الذي مركزه A وزاويته 72 درجة',
  ariaLabel: 'دائرة مركزها A ونصف قطرها AB = 4 cm؛ النقط B و C و D و E و F على الدائرة، كل نقطة صورة السابقة بالدوران الذي مركزه A وزاويته 72 درجة في الاتجاه المباشر',
  maxWidth: 420,
};

/**
 * Ex. 20 (p. 161, BEM) — « يُطلب إنجاز الشكل » : la figure de la plateforme (extraction › ex-20 › platformFigure) : (T) de centre
 * O, [AB] diamètre de 8 cm, C sur (T) avec BC = 3 cm, F image de B par la translation de vecteur OB, D sur (AC) avec (DF) // (BC).
 */
export const EX20 = {
  points: { O: [0, 0], A: [-4, 0], B: [4, 0], C: [2.875, 2.781], F: [8, 0], D: [6.313, 4.172] },
  circles: [{ center: 'O', radius: 4 }],
  segments: [['A', 'F'], ['A', 'D'], { from: 'B', to: 'C', label: '3', arrows: 1 }, { from: 'F', to: 'D', arrows: 1 }],
  rightAngles: [['A', 'C', 'B']],
  labels: { O: 's', A: 'w', B: 's', F: 'se', C: 'nw', D: 'n' },
  caption: 'شكل من المنصّة (التمرين يطلب إنجازه)',
  ariaLabel: 'دائرة (T) مركزها O وقطرها [AB]، والنقطة C على الدائرة حيث BC = 3 cm؛ F على امتداد [AB] بعد B حيث BF = OB؛ المستقيم الذي يشمل F ويوازي (BC) يقطع (AC) في D',
  maxWidth: 480,
};

/**
 * « إختبار أولي » — la وضعية TRANSPOSÉE : le rond-point d'Oran (rayon 5 m), deux lampadaires voisins P₁ et P₂ (sur huit), le
 * milieu H de [P₁P₂] et la hauteur [OH]. Les six autres lampadaires ne sont pas dessinés et aucun angle n'est écrit.
 */
const RP = vertices({ x: 0, y: 0 }, 5, 8, 112.5, ['P₁', 'P₂'], 'indirect');
export const TEST_FIGURE = {
  points: { O: [0, 0], ...RP, H: [0, r3(5 * Math.cos(Math.PI / 8))] },
  circles: [{ center: 'O', radius: 5, tone: 'slate' }],
  segments: [['O', 'P₁'], ['O', 'P₂'], { from: 'P₁', to: 'P₂', bold: true }, { from: 'O', to: 'H', dashed: true }],
  rightAngles: [['O', 'H', 'P₂']],
  labels: { O: 's', H: 's', 'P₁': 'nw', 'P₂': 'ne' },
  ariaLabel: 'دائرة الدوّار مركزها O ونصف قطرها 5 m، وعلى حافتها عمودان متتاليان P₁ و P₂، و H منتصف [P₁P₂] حيث [OH] عمودي على [P₁P₂]',
  maxWidth: 380,
};
