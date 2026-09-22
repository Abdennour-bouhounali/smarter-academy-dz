/**
 * L'AFFICHAGE des أشعة : la frontière entre le calcul exact et ce que
 * l'élève lit. Tout arrondi du laboratoire passe ici, et nulle part ailleurs
 * (§37 : « Use exact values internally. Round only for display »).
 *
 * Le format des nombres est celui de tout le مختبر — `grapherFormat.formatValue` :
 * virgule décimale, vrai signe moins (−, U+2212), chiffres LATINS, comme les
 * manuels algériens de mathématiques (ARABIC_RTL_CONTRACT).
 *
 * ── Le sens de lecture ───────────────────────────────────────────────────
 * Une écriture mathématique se lit de GAUCHE à DROITE même dans une page
 * arabe : `u = (3, −2)` doit rester `u = (3, −2)`, jamais `(2− ,3) = u`.
 * Le bidi ferait le second si on laissait faire : une parenthèse est un
 * caractère « miroir » et une virgule est neutre. Les fonctions de ce module
 * rendent donc des chaînes que l'interface pose TOUJOURS dans un conteneur
 * `dir="ltr"` — la règle est vérifiée par vectorFormat.test.js et rappelée
 * dans docs/architecture/MATH_LAB.md.
 */

import { formatValue } from '../functionGrapher/grapherFormat.js';

export { formatValue };

/** Le couple `(x, y)` — l'écriture du manuel pour des composantes comme pour un point. */
export function formatPair(v, decimals = 2) {
  if (!v || !Number.isFinite(v.x) || !Number.isFinite(v.y)) return '—';

  return `(${formatValue(v.x, decimals)} ; ${formatValue(v.y, decimals)})`;
}

/**
 * La norme sous sa plus belle forme (§9) : `5` si elle est entière, `2√5` si
 * elle se simplifie, `3,61` sinon. Rend AUSSI la valeur décimale, que
 * l'interface montre à côté quand la forme est un radical — « √5 ≈ 2,24 »
 * apprend plus que l'un des deux seul.
 *
 * @returns {{text: string, approx: string|null, isExact: boolean}}
 */
export function formatNorm(exact, decimals = 2) {
  if (!exact || !Number.isFinite(exact.value)) return { text: '—', approx: null, isExact: false };

  if (exact.exact && exact.integer !== null) {
    return { text: formatValue(exact.integer, 0), approx: null, isExact: true };
  }
  if (exact.exact && exact.radicand !== null) {
    const root = `√${exact.radicand}`;
    const text = exact.coefficient === 1 ? root : `${formatValue(exact.coefficient, 0)}${root}`;

    return { text, approx: formatValue(exact.value, decimals), isExact: true };
  }

  return { text: formatValue(exact.value, decimals), approx: null, isExact: false };
}

/** Une direction en degrés : `53,13°`, ou « — » pour le شعاع nul (§10). */
export function formatAngle(degrees, decimals = 2) {
  if (!Number.isFinite(degrees)) return '—';

  return `${formatValue(degrees, decimals)}°`;
}

/**
 * Le facteur k d'une colinéarité, en FRACTION quand elle est simple :
 * « v = ½ u » est ce que §21 demande de montrer, pas « v = 0,5 u ».
 */
export function formatFactor(k, decimals = 2) {
  if (!Number.isFinite(k)) return '—';
  const sign = k < 0 ? '−' : '';
  const absolute = Math.abs(k);
  if (Number.isInteger(absolute)) return `${sign}${absolute}`;

  for (const denominator of [2, 3, 4, 5, 6, 8, 10]) {
    const numerator = absolute * denominator;
    if (Math.abs(numerator - Math.round(numerator)) < 1e-9) {
      const rounded = Math.round(numerator);
      // On n'écrit une fraction que si elle est plus courte que le décimal.
      if (rounded !== 0 && rounded / denominator === absolute) return `${sign}${rounded}/${denominator}`;
    }
  }

  return formatValue(k, decimals);
}

/**
 * Le nom d'un شعاع tel qu'on le NOMME à l'oral et à l'écrit :
 * ⃗AB pour un شعاع tenu par deux points, `u` pour un شعاع libre. La flèche
 * est posée par le composant (un SVG, pas un caractère combinant — les
 * polices arabes rendent mal U+20D7).
 */
export function vectorLabel(resolved) {
  if (!resolved) return '';
  if (resolved.kind === 'points' && resolved.source?.from && resolved.source?.to) return resolved.name;

  return resolved.name;
}

/** La pente (§20) : un nombre, ou le mot que l'interface traduira. */
export function formatSlope(slope, decimals = 2) {
  if (!slope || slope.undefined) return { kind: 'undefined', text: null };
  if (slope.vertical) return { kind: 'vertical', text: null };

  return { kind: 'value', text: formatValue(slope.value, decimals) };
}
