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

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
 * L2 (silsila-bi-aqwas, 2026-10-29) — LES PARENTHÈSES, LES CROCHETS, LA BARRE DE FRACTION ET LA CALCULATRICE.
 *   tokenizeB · parseB · evaluateB · bracketPairs · bracketDepths · uselessBrackets · bracketForm · barToLine · lineToBar · calculatorRead · calcDisplay ·
 *   leftToRight · calculatorKeys
 * Les fonctions de L1 ci-dessus refusent toujours les parenthèses (`tokenize`) : celles-ci sont un autre étage, qui réutilise `numText` et le même évaluateur exact.
 * La LECTURE de la calculatrice (`calculatorRead`) est celle d'une calculatrice scientifique : priorités, parenthèses, « Syntax ERROR » si elles ne s'équilibrent pas,
 * « Math ERROR » pour une division par 0 ; un résultat négatif est AFFICHÉ tel quel (jamais enseigné : 2AM n'a pas encore les relatifs).
 * ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

const OPEN = new Set(['(', '[']);
const CLOSE = new Set([')', ']']);

/** « (45 + 15) ÷ 4 » → jetons `{ t:'num'|'op'|'open'|'close' }` ; `[ ]` valent `( )` ; erreurs : symbole inconnu, deux nombres de suite. Les contrôles de syntaxe sont dans `parseB`. */
export function tokenizeB(text) {
  const s = latin(text).replace(/\s+/g, '');
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    const m = /^\d+(?:[,.]\d+)?/.exec(s.slice(i));
    if (m) {
      tokens.push({ t: 'num', v: parseRel(m[0]), text: m[0].replace('.', ',') });
      i += m[0].length;
    } else if (OPEN.has(ch)) { tokens.push({ t: 'open', ch }); i += 1; }
    else if (CLOSE.has(ch)) { tokens.push({ t: 'close', ch }); i += 1; }
    else {
      const o = ALIAS[ch] ?? ch;
      if (!OPS[o]) throw new Error(`symbole inconnu : ${ch}`);
      tokens.push({ t: 'op', o });
      i += 1;
    }
  }
  return tokens;
}

/** Les paires de parenthèses d'une liste de jetons : `[{ open, close, depth }]` (indices de jetons ; depth 1 = la plus extérieure). Lève `syntax` si elles ne s'équilibrent pas. */
export function bracketPairs(tokens) {
  const stack = [];
  const pairs = [];
  tokens.forEach((tk, i) => {
    if (tk.t === 'open') stack.push(i);
    else if (tk.t === 'close') {
      if (!stack.length) throw new Error('syntax');
      const open = stack.pop();
      pairs.push({ open, close: i, depth: stack.length + 1 });
    }
  });
  if (stack.length) throw new Error('syntax');
  return pairs.sort((a, b) => a.open - b.open);
}

/** La profondeur de parenthèses sous chaque jeton (0 = hors parenthèses ; un jeton `open` compte déjà dans sa propre paire). Tolère un mot non équilibré. */
export function bracketDepths(tokens) {
  let d = 0;
  return tokens.map((tk) => {
    if (tk.t === 'open') { d += 1; return d; }
    if (tk.t === 'close') { const x = d; d = Math.max(0, d - 1); return x; }
    return d;
  });
}

/** L'arbre avec priorités ET parenthèses : `{ t:'num' }` | `{ t:'op', o, l, r }` | `{ t:'group', e }`. `throw new Error('syntax')` si le mot n'est pas une expression. */
export function parseB(input) {
  const tokens = typeof input === 'string' ? tokenizeB(input) : input;
  let pos = 0;
  const factor = () => {
    const tk = tokens[pos];
    if (!tk) throw new Error('syntax');
    if (tk.t === 'num') { pos += 1; return { t: 'num', v: tk.v, text: tk.text }; }
    if (tk.t === 'open') {
      pos += 1;
      const e = expr();
      if (!tokens[pos] || tokens[pos].t !== 'close') throw new Error('syntax');
      pos += 1;
      return { t: 'group', e };
    }
    throw new Error('syntax');
  };
  const term = () => {
    let left = factor();
    while (tokens[pos]?.t === 'op' && PRIORITY[tokens[pos].o] === 2) { const o = tokens[pos].o; pos += 1; left = { t: 'op', o, l: left, r: factor() }; }
    return left;
  };
  const expr = () => {
    let left = term();
    while (tokens[pos]?.t === 'op' && PRIORITY[tokens[pos].o] === 1) { const o = tokens[pos].o; pos += 1; left = { t: 'op', o, l: left, r: term() }; }
    return left;
  };
  if (!tokens.length) throw new Error('syntax');
  const tree = expr();
  if (pos !== tokens.length) throw new Error('syntax');
  return tree;
}

/** La valeur exacte (rationnel de `powers.js`) d'un mot avec parenthèses. */
export function evaluateB(treeOrText) {
  const tree = typeof treeOrText === 'string' ? parseB(treeOrText) : treeOrText;
  if (tree.t === 'num') return tree.v;
  if (tree.t === 'group') return evaluateB(tree.e);
  return apply(tree.o, evaluateB(tree.l), evaluateB(tree.r));
}

/** La forme d'un arbre SANS ses parenthèses (une chaîne canonique) : deux mots ont la même forme si les parenthèses n'y changent rien à l'ordre du calcul. */
const shapeOf = (tree) => {
  if (tree.t === 'num') return tree.text;
  if (tree.t === 'group') return shapeOf(tree.e);
  return `(${shapeOf(tree.l)}${tree.o}${shapeOf(tree.r)})`;
};

/**
 * Les paires INUTILES d'un mot : celles dont la suppression laisse le MÊME arbre de calcul (les parenthèses répètent ce que la priorité fait déjà, ex. 9 + (2 × 5),
 * ou entourent un nombre seul, ou toute l'expression). `[{ open, close, depth }]` ; `[]` si le mot n'est pas une expression.
 */
export function uselessBrackets(input) {
  const tokens = typeof input === 'string' ? tokenizeB(input) : input;
  let base;
  let pairs;
  try { base = shapeOf(parseB(tokens)); pairs = bracketPairs(tokens); } catch { return []; }
  return pairs.filter((p) => {
    const rest = tokens.filter((_, i) => i !== p.open && i !== p.close);
    try { return shapeOf(parseB(rest)) === base; } catch { return false; }
  });
}

const tokenText = (tk) => (tk.t === 'num' ? tk.text : tk.t === 'op' ? tk.o : tk.ch);

/** Le mot écrit avec ses parenthèses EXTÉRIEURES en crochets : une paire qui en contient une autre s'écrit [ ] (« 2 × [50 − (12 + 8)] »). */
export function bracketForm(input) {
  const tokens = typeof input === 'string' ? tokenizeB(input) : input;
  let pairs;
  try { pairs = bracketPairs(tokens); } catch { return tokens.map(tokenText).join(' '); }
  const outer = new Set();
  pairs.forEach((p) => { if (pairs.some((q) => q.open > p.open && q.close < p.close)) { outer.add(p.open); outer.add(p.close); } });
  return tokens.map((tk, i) => (outer.has(i) ? (tk.t === 'open' ? '[' : ']') : tokenText(tk))).join(' ');
}

/** La barre de fraction écrite sans barre : `(num) ÷ (den)`. Les parenthèses sont ajoutées autour de chaque côté qui n'est pas un nombre seul. */
export function barToLine(num, den) {
  const wrap = (x) => (/^\s*\d+(?:[,.]\d+)?\s*$/.test(x) ? String(x).trim() : `(${String(x).trim()})`);
  return `${wrap(num)} ÷ ${wrap(den)}`;
}

/** Le chemin inverse : `(A) ÷ (B)` (ou `n ÷ (B)`, `(A) ÷ n`) → `{ num, den }`, sinon `null` (l'opération du sommet n'est pas une division de deux blocs). */
export function lineToBar(input) {
  const tokens = typeof input === 'string' ? tokenizeB(input) : input;
  let tree;
  try { tree = parseB(tokens); } catch { return null; }
  if (tree.t !== 'op' || tree.o !== '÷') return null;
  const inner = (t) => (t.t === 'group' ? t.e : t);
  const show = (t) => bracketFormTree(inner(t));
  return { num: show(tree.l), den: show(tree.r) };
}
function bracketFormTree(tree) {
  if (tree.t === 'num') return tree.text;
  if (tree.t === 'group') return `(${bracketFormTree(tree.e)})`;
  return `${bracketFormTree(tree.l)} ${tree.o} ${bracketFormTree(tree.r)}`;
}

/** L'affichage d'une calculatrice : jusqu'à 8 décimales (arrondi), zéros inutiles retirés, virgule décimale, signe « − » pour un négatif. */
export function calcDisplay(v) {
  const neg = P.sign(v) < 0;
  const a = neg ? P.neg(v) : v;
  const n = BigInt(a.n); const d = BigInt(a.d);
  const scale = 10n ** 8n;
  const q = (n * scale * 2n + d) / (d * 2n);   // arrondi
  const int = q / scale; const frac = String(q % scale).padStart(8, '0').replace(/0+$/, '');
  return `${neg && (int > 0n || frac) ? '−' : ''}${int}${frac ? `,${frac}` : ''}`;
}

/**
 * Ce que lit une calculatrice scientifique : `{ status:'ok', value, display }` | `{ status:'syntax' }` (« Syntax ERROR » : parenthèses non équilibrées, opérateur sans nombre,
 * mot vide) | `{ status:'math' }` (« Math ERROR » : division par 0).
 */
export function calculatorRead(input) {
  let tree;
  try { tree = parseB(input); } catch { return { status: 'syntax' }; }
  try { const value = evaluateB(tree); return { status: 'ok', value, display: calcDisplay(value) }; } catch { return { status: 'math' }; }
}

/** Le mot lu de gauche à droite SANS priorité (une calculatrice simple), les parenthèses respectées : « 45 + 15 ÷ 4 » → 15. `null` si le mot n'est pas une expression. */
export function leftToRight(input) {
  const tokens = typeof input === 'string' ? tokenizeB(input) : input;
  let pos = 0;
  const seq = () => {
    let acc = factor();
    while (tokens[pos]?.t === 'op') { const o = tokens[pos].o; pos += 1; acc = apply(o, acc, factor()); }
    return acc;
  };
  const factor = () => {
    const tk = tokens[pos];
    if (!tk) throw new Error('syntax');
    pos += 1;
    if (tk.t === 'num') return tk.v;
    if (tk.t === 'open') { const v = seq(); if (tokens[pos]?.t !== 'close') throw new Error('syntax'); pos += 1; return v; }
    throw new Error('syntax');
  };
  try { if (!tokens.length) return null; const v = seq(); return pos === tokens.length ? v : null; } catch { return null; }
}

/** Les TOUCHES à presser pour un mot : un chiffre par touche, « , » pour la virgule, puis opérateurs et parenthèses, et « = » à la fin. */
export function calculatorKeys(input) {
  const tokens = typeof input === 'string' ? tokenizeB(input) : input;
  const keys = [];
  tokens.forEach((tk) => { if (tk.t === 'num') keys.push(...tk.text.split('')); else keys.push(tokenText(tk) === '[' ? '(' : tokenText(tk) === ']' ? ')' : tokenText(tk)); });
  return [...keys, '='];
}
