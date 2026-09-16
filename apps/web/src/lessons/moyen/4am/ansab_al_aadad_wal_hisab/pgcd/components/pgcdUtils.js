/**
 * Le noyau mathématique de la leçon « قواسم عدد طبيعي والقاسم المشترك الأكبر ».
 *
 * CONTRAT (repris de la convention de la plateforme) : tout ce qui est
 * AFFICHÉ dérive de ces fonctions pures. Aucun module ne recalcule un PGCD
 * à la main, et aucune étape d'algorithme n'est écrite en dur dans une
 * chaîne de caractères — sinon un exemple finirait par mentir.
 *
 * Les DEUX méthodes que le programme nomme explicitement
 * (docs/ALGERIA_4AM_CURRICULUM.md §2.1) produisent chacune leur LISTE
 * D'ÉTAPES, et non seulement leur résultat : c'est la liste qui est
 * manipulée, animée et corrigée à l'écran.
 *
 *   خوارزمية أقليدس   → euclidSteps(a, b)
 *   الفروق المتتالية   → differenceSteps(a, b)
 *
 * Aucune fonction ici ne contient de texte arabe : l'affichage appartient
 * aux modules, le calcul appartient à ce fichier.
 */

/** Les diviseurs d'un entier naturel non nul, par ordre croissant. */
export function divisors(n) {
  if (!Number.isInteger(n) || n <= 0) return [];
  const out = [];
  for (let d = 1; d * d <= n; d += 1) {
    if (n % d === 0) {
      out.push(d);
      if (d !== n / d) out.push(n / d);
    }
  }
  return out.sort((x, y) => x - y);
}

/** Les diviseurs COMMUNS de deux entiers, par ordre croissant. */
export function commonDivisors(a, b) {
  const db = new Set(divisors(b));
  return divisors(a).filter((d) => db.has(d));
}

/**
 * Le PGCD, par la définition même : le plus grand des diviseurs communs.
 *
 * Volontairement SÉPARÉ des deux algorithmes ci-dessous. C'est la valeur de
 * référence contre laquelle l'élève — et les tests — vérifient qu'une
 * méthode a donné le bon résultat (LP « التحقق من صحة حساب القاسم المشترك
 * الأكبر »). La faire calculer PAR Euclide rendrait cette vérification
 * circulaire.
 */
export function gcdByDefinition(a, b) {
  const common = commonDivisors(a, b);
  return common.length ? common[common.length - 1] : 0;
}

/**
 * خوارزمية أقليدس — les divisions euclidiennes successives.
 *
 * Chaque étape porte le dividende, le diviseur, le quotient et le reste :
 * `a = b × q + r`. L'algorithme s'arrête quand le reste est nul ; le PGCD
 * est alors le DERNIER reste non nul, c'est-à-dire le diviseur de la
 * dernière étape.
 *
 * @returns {{steps: Array<{a:number,b:number,q:number,r:number}>, gcd:number}}
 */
export function euclidSteps(a, b) {
  let x = Math.max(a, b);
  let y = Math.min(a, b);
  const steps = [];
  if (!Number.isInteger(x) || !Number.isInteger(y) || y <= 0) return { steps, gcd: x || 0 };

  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x - q * y;
    steps.push({ a: x, b: y, q, r });
    x = y;
    y = r;
  }
  return { steps, gcd: x };
}

/**
 * الفروق المتتالية — on remplace le plus grand par la différence.
 *
 * Chaque étape porte les deux nombres et leur différence. L'algorithme
 * s'arrête quand les deux nombres sont ÉGAUX : cette valeur commune est le
 * PGCD.
 *
 * @returns {{steps: Array<{big:number,small:number,diff:number}>, gcd:number}}
 */
export function differenceSteps(a, b) {
  let x = Math.max(a, b);
  let y = Math.min(a, b);
  const steps = [];
  if (!Number.isInteger(x) || !Number.isInteger(y) || y <= 0) return { steps, gcd: x || 0 };

  // Garde-fou : une paire raisonnable de 4AM converge en quelques dizaines
  // d'étapes. La borne empêche une boucle infinie si une entrée aberrante
  // passait (elle ne change aucun résultat correct).
  let guard = 0;
  while (x !== y && guard < 10000) {
    const diff = x - y;
    steps.push({ big: x, small: y, diff });
    x = Math.max(y, diff);
    y = Math.min(y, diff);
    guard += 1;
  }
  return { steps, gcd: x };
}

/**
 * La division euclidienne d'un coup, pour les étapes où l'élève la pose
 * lui-même : a = b × q + r avec 0 ≤ r < b.
 */
export function divmod(a, b) {
  const q = Math.floor(a / b);
  return { q, r: a - q * b };
}

/** `a` divise-t-il `n` ? (Le vocabulaire de la leçon : « قاسم ».) */
export function isDivisor(d, n) {
  return Number.isInteger(d) && d > 0 && n % d === 0;
}

/**
 * Deux entiers sont-ils premiers entre eux ? (PGCD = 1.)
 * Utile au dernier module : c'est le cas où la réponse surprend.
 */
export function areCoprime(a, b) {
  return gcdByDefinition(a, b) === 1;
}

/**
 * La mise en forme LaTeX d'une étape d'Euclide : `264 = 60 \times 4 + 24`.
 * Les modules n'assemblent jamais cette chaîne eux-mêmes.
 */
export function euclidStepTex({ a, b, q, r }) {
  return `${a} = ${b} \\times ${q} + ${r}`;
}

/** La mise en forme LaTeX d'une étape de différences : `264 - 60 = 204`. */
export function differenceStepTex({ big, small, diff }) {
  return `${big} - ${small} = ${diff}`;
}
