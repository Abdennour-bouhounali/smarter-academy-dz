/**
 * Isoler les écritures mathématiques d'un texte arabe BRUT.
 *
 * Dans une phrase RTL, « معارف — 120 = 6 × 20 » s'affiche « 20 × 6 = 120 » :
 * l'algorithme bidi range les nombres de droite à gauche autour des signes.
 * `MathText` règle le cas des `$…$` ; ce helper règle le texte brut (titres
 * d'exercice, libellés, HTML du cahier) sans balise : il entoure chaque suite
 * « nombre opérateur nombre … » des marques invisibles LRI … PDI (U+2066 /
 * U+2069), qui l'affichent de gauche à droite comme un bloc.
 *
 * Seuls les signes mathématiques lient deux nombres : « : », « — » et la
 * virgule arabe « ، » restent des séparateurs de la phrase.
 *
 * Un nombre SUIVI D'UNE UNITÉ latine (« سعة الدنّ الأول 24 L ») s'isole aussi
 * (2026-09-24) : sans cela l'algorithme bidi range « 24 » (chiffres après
 * de l'arabe) et « L » (latin) en deux suites distinctes, et la phrase se
 * lisait « L 24 ».
 */
const LRI = '⁦';
const PDI = '⁩';

// Un TERME : un nombre, éventuellement suivi d'une unité ou d'un facteur
// littéral collé (« 24 L », « 7,5 cm² », « 240x »). L'unité n'est pas prise
// si un nombre la suit : dans « 2 x 3 », « x » est l'opérateur.
// Le nombre accepte les décimales à virgule ou point : « 7,5 », « 0.25 ».
const NUMBER = String.raw`\d+(?:[.,]\d+)?`;
const UNIT = String.raw`\s?[A-Za-z]{1,3}[²³]?(?![A-Za-z])(?!\s*\d)`;
const TERM = `${NUMBER}(?:${UNIT})?`;
const OPERATOR = String.raw`[=×x*+\-−÷/<>≤≥]`;
const RUN = new RegExp(`${TERM}(?:\\s*${OPERATOR}\\s*${TERM})*`, 'g');
// Une suite ne s'isole que si elle LIE quelque chose : un opérateur entre deux
// termes, ou une unité. « رف 12 » (un nombre seul) reste tel quel.
const JOINED = new RegExp(`\\d\\s*${OPERATOR}\\s*\\d|[A-Za-z]`);

export function isolateMathRuns(text) {
  if (typeof text !== 'string' || text === '') return text;
  // Idempotent : un texte déjà isolé n'est pas ré-enveloppé.
  if (text.includes(LRI)) return text;

  return text.replace(RUN, (run) => (JOINED.test(run) ? `${LRI}${run}${PDI}` : run));
}
