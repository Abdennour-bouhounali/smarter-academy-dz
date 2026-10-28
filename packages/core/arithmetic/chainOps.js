/**
 * chainOps — les SÉRIES D'OPÉRATIONS de 2AM, unité 1 « العمليات على الأعداد الطبيعية والأعداد العشرية » (2026-10-28). Importé PAR CHEMIN
 * (`@smarter-academy/core/arithmetic/chainOps.js`), jamais par le barrel du cœur (BUNDLE_BOUNDARIES §4). Construit sur `powers.js` (rationnels exacts, aucun
 * flottant) et `relativeOps.js` (`parseRel`, `relText`) ; ne réécrit ni l'un ni l'autre. `relativeOps.evaluate` (3AM) sert de contre-épreuve dans le test.
 *
 * Grandit leçon par leçon (docs/sources/2am/unit1/plan/README.md « Shared maths module ») :
 *   L1 (silsila-bidun-aqwas, ICI)  tokenize · parseChain · evaluateChain · traceChain · operatorsOf · valueInOrder · conventionalOrder · chainText · isNonNegativeChain
 *   L2–L4                           parenthèses et barre de fraction, nom d'une chaîne, distributivité — ajoutés par leurs leçons.
 *
 * LA CONVENTION (un accord, pas un théorème) : sans parenthèses, × et ÷ avant + et −, et à priorité égale de GAUCHE à DROITE.
 * Aucune parenthèse, aucun crochet, aucune barre de fraction, aucun littéral négatif (les relatifs sont l'unité 3 de 2AM) : `tokenize` les refuse.
 */
import * as P from './powers.js';
import { relText, parseRel } from './relativeOps.js';

const OPS = Object.freeze({ '+': '+', '−': '−', '×': '×', '÷': '÷' });
const PRIORITY = Object.freeze({ '+': 1, '−': 1, '×': 2, '÷': 2 });
const ALIAS = Object.freeze({ '-': '−', '–': '−', '—': '−', '*': '×', x: '×', X: '×', '·': '×', '/': '÷', ':': '÷' });
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const latin = (s) => String(s).replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d))).replace(/٫/g, ',').replace(/‎|‏|⁦|⁧|⁩/g, '');

/**
 * « 26 − 9 + 4 » → [{ t:'num', v, text }, { t:'op', o }, …]. Chiffres arabes ou latins, virgule décimale, alias ASCII (- * x / :). Refuse : un littéral négatif
 * (un signe là où un nombre est attendu), toute parenthèse / crochet / barre, un nombre ou un opérateur manquant.
 */
export function tokenize(text) {
  const s = latin(text).replace(/\s+/g, '');
  if (!s) throw new Error('chaîne vide');
  if (/[()[\]{}]/.test(s)) throw new Error('parenthèse : hors du périmètre de cette leçon');
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    const m = /^\d+(?:[,.]\d+)?/.exec(s.slice(i));
    if (m) {
      if (tokens.length && tokens.at(-1).t === 'num') throw new Error('deux nombres de suite');
      tokens.push({ t: 'num', v: parseRel(m[0]), text: m[0].replace('.', ',') });
      i += m[0].length;
    } else {
      const o = ALIAS[ch] ?? ch;
      if (!OPS[o]) throw new Error(`symbole inconnu : ${ch}`);
      if (!tokens.length || tokens.at(-1).t === 'op') throw new Error('opérateur sans nombre à gauche (les nombres négatifs ne sont pas de cette unité)');
      tokens.push({ t: 'op', o });
      i += 1;
    }
  }
  if (tokens.at(-1).t === 'op') throw new Error('opérateur sans nombre à droite');
  return tokens;
}

/** L'arbre de la chaîne avec les priorités (× ÷ avant + −, gauche à droite à priorité égale) : `{ t:'num', v, text }` | `{ t:'op', o, l, r }`. */
export function parseChain(text) {
  const tokens = typeof text === 'string' ? tokenize(text) : text;
  let pos = 0;
  const level = (prio) => {
    let left = prio === 2 ? { t: 'num', v: tokens[pos].v, text: tokens[pos++].text } : level(2);
    while (pos < tokens.length && tokens[pos].t === 'op' && PRIORITY[tokens[pos].o] === prio) {
      const o = tokens[pos++].o;
      const right = prio === 2 ? { t: 'num', v: tokens[pos].v, text: tokens[pos++].text } : level(2);
      left = { t: 'op', o, l: left, r: right };
    }
    return left;
  };
  return level(1);
}

const apply = (o, a, b) => {
  if (o === '+') return P.add(a, b);
  if (o === '−') return P.sub(a, b);
  if (o === '×') return P.mul(a, b);
  if (P.isZero(b)) throw new Error('division par 0');
  return P.div(a, b);
};

/** La valeur exacte (rationnel de `powers.js`) d'un arbre ou d'un texte. */
export function evaluateChain(treeOrText) {
  const tree = typeof treeOrText === 'string' ? parseChain(treeOrText) : treeOrText;
  if (tree.t === 'num') return tree.v;
  return apply(tree.o, evaluateChain(tree.l), evaluateChain(tree.r));
}

/** Un rationnel écrit pour l'élève : virgule décimale, fraction « n/d » si non décimal. */
export const numText = (v) => relText(v);

/** Le texte d'un arbre (sans parenthèses : seulement des chaînes lues dans l'ordre de l'arbre CONVENTIONNEL). */
export function chainText(tree) {
  if (tree.t === 'num') return tree.text ?? numText(tree.v);
  return `${chainText(tree.l)} ${tree.o} ${chainText(tree.r)}`;
}

/** Les puces d'opérateur d'une chaîne : `[{ index, o, left, right }]` (left / right = les nombres voisins, par position). */
export function operatorsOf(text) {
  const tokens = typeof text === 'string' ? tokenize(text) : text;
  const out = [];
  tokens.forEach((tk, k) => { if (tk.t === 'op') out.push({ index: out.length, o: tk.o, left: (k - 1) / 2, right: (k + 1) / 2 }); });
  return out;
}

export const numbersOf = (text) => (typeof text === 'string' ? tokenize(text) : text).filter((tk) => tk.t === 'num');

/** L'ordre conventionnel : les × ÷ de gauche à droite, puis les + − de gauche à droite — une permutation des indices d'opérateurs. */
export function conventionalOrder(text) {
  const ops = operatorsOf(text);
  return [...ops.filter((p) => PRIORITY[p.o] === 2), ...ops.filter((p) => PRIORITY[p.o] === 1)].map((p) => p.index);
}

const isPermutation = (order, n) => Array.isArray(order) && order.length === n && new Set(order).size === n && order.every((k) => Number.isInteger(k) && k >= 0 && k < n);

/**
 * La chaîne calculée dans un ORDRE CHOISI (le plan de l'élève, lab `tram-route`) : `order[k]` = l'indice de l'opérateur qu'on fait à la k-ième étape.
 * Chaque opération prend le bloc de gauche et le bloc de droite de SON opérateur au moment où on la fait (un bloc déjà calculé compte comme un nombre).
 * → `{ value, steps: [{ k, index, o, left, right, value, negative }], lines, conventional, matches }` ; `lines` : la chaîne après chaque étape, blocs réduits à
 * leur valeur (« 26 − 13 ») ; `negative` : un résultat < 0 (hors périmètre de la leçon) ; `matches` : même valeur que l'ordre conventionnel.
 */
export function valueInOrder(text, order) {
  const tokens = typeof text === 'string' ? tokenize(text) : text;
  const ops = operatorsOf(tokens);
  if (!isPermutation(order, ops.length)) throw new Error('ordre invalide');
  const nums = numbersOf(tokens).map((tk) => tk.v);
  const parent = nums.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const block = nums.map((v) => v);
  const span = nums.map((_, i) => [i, i]);   // les nombres (positions) que couvre chaque bloc : [premier, dernier]
  const done = new Set();
  const render = () => {
    const parts = [];
    nums.forEach((_, i) => {
      if (find(i) === i) {
        if (parts.length) { const gap = ops.find((p) => p.right === i && !done.has(p.index)); parts.push(gap ? gap.o : '·'); }
        parts.push(numText(block[i]));
      }
    });
    return parts.join(' ');
  };
  const steps = [];
  const lines = [render()];
  order.forEach((idx, k) => {
    const p = ops[idx];
    const a = find(p.left); const b = find(p.right);
    const v = apply(p.o, block[a], block[b]);
    const step = { k, index: idx, o: p.o, leftValue: block[a], rightValue: block[b], leftSpan: span[a], rightSpan: span[b], value: v, negative: P.sign(v) < 0 };
    parent[b] = a; block[a] = v; span[a] = [span[a][0], span[b][1]]; done.add(idx);
    steps.push(step);
    lines.push(render());
  });
  const value = block[find(0)];
  const conv = conventionalOrder(tokens);
  return { value, steps, lines, conventional: order.every((x, k) => x === conv[k]), matches: P.eq(value, evaluateChain(parseChain(tokens))) };
}

/**
 * Les lignes d'un calcul écrit dans l'ordre conventionnel (une opération par ligne, ou — `grouped` — tous les × ÷ d'un niveau sur une ligne, la manière du
 * cahier) : « 15 + 3 × 4 » → ['15 + 3 × 4', '15 + 12', '27'].
 */
export function traceChain(text, { grouped = false } = {}) {
  const tokens = typeof text === 'string' ? tokenize(text) : text;
  const ops = operatorsOf(tokens);
  const conv = conventionalOrder(tokens);
  const first = tokens.map((tk) => (tk.t === 'num' ? tk.text ?? numText(tk.v) : tk.o)).join(' ');
  const { lines } = valueInOrder(tokens, conv);
  const all = [first, ...lines.slice(1)];
  if (!grouped) return all;
  // regrouper : toutes les opérations de même priorité consécutives dans l'ordre conventionnel tombent sur une ligne
  const out = [first];
  let k = 0;
  while (k < conv.length) {
    const prio = PRIORITY[ops[conv[k]].o];
    let j = k;
    while (j + 1 < conv.length && PRIORITY[ops[conv[j + 1]].o] === prio) j += 1;
    out.push(lines[j + 1]);
    k = j + 1;
  }
  return out.filter((l, i) => i === 0 || l !== out[i - 1]);
}

/** Tous les résultats intermédiaires de l'ordre conventionnel sont-ils ≥ 0 ? (la garde de 2AM tant que les relatifs ne sont pas enseignés) */
export function isNonNegativeChain(text) {
  const tokens = typeof text === 'string' ? tokenize(text) : text;
  const { steps } = valueInOrder(tokens, conventionalOrder(tokens));
  return steps.every((s) => !s.negative);
}

/**
 * La première étape d'un plan qui QUITTE l'arbre conventionnel : l'opération est faite sur d'autres blocs que ceux que la convention lui donne
 * (ex. 9 + 4 avant de retrancher 9 dans « 26 − 9 + 4 »). `null` si toutes les étapes sont sur l'arbre (le plan donne alors la valeur conventionnelle).
 */
export function offTreeStep(text, order) {
  const tokens = typeof text === 'string' ? tokenize(text) : text;
  const conv = valueInOrder(tokens, conventionalOrder(tokens)).steps;
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  return valueInOrder(tokens, order).steps.find((s) => {
    const c = conv.find((x) => x.index === s.index);
    return !same(c.leftSpan, s.leftSpan) || !same(c.rightSpan, s.rightSpan);
  }) ?? null;
}
