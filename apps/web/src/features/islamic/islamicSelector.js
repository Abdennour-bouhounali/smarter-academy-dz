import { AUDIENCES, CONTEXTS, CONTEXT_THEMES } from './islamicThemes.js';

/** La longueur LUE d'un élément : ses versets bout à bout, ou son texte. */
export function contentText(item) {
  if (Array.isArray(item?.verses)) return item.verses.map((v) => v.text).join(' ');
  return item?.text ?? '';
}

/**
 * LE choix d'un rappel — une fonction PURE : mêmes entrées, même sortie.
 * Aucune lecture d'horloge, de stockage ni de React ; la page fournit
 * l'audience, le moment, les ids récents et une graine (`seed`) qui fait
 * tourner les ex æquo.
 *
 * Ordre de priorité (doc ISLAMIC_VALUES.md § Sélection) :
 *   1. le moment exact (`contexts` contient `context`) ;
 *   2. l'audience — un élève ne reçoit que `student` / `both`, un enseignant
 *      que `teacher` / `both` ; l'audience exacte passe devant `both` ;
 *   3. les thèmes (ceux de la page + ceux préférés du moment) ;
 *   4. pas un élément montré récemment ;
 *   5. la priorité déclarée ;
 *   6. à défaut, un élément du moment `general`.
 *
 * Un élément récent n'est RE-servi que si tout le vivier l'est : alors le
 * moins récent (le plus loin dans `recentContentIds`, rangé du plus récent
 * au plus ancien) est choisi.
 */
export function isEligible(item, audience) {
  if (!item || item.active === false) return false;
  if (item.status && item.status !== 'published') return false;
  if (!audience) return false;
  return item.audience === audience || item.audience === AUDIENCES.BOTH;
}

function score(item, audience, themes) {
  const audienceExact = item.audience === audience ? 1 : 0;
  const overlap = themes.size ? (item.themes ?? []).filter((t) => themes.has(t)).length : 0;
  // Le thème pèse plus que l'audience exacte, la priorité départage.
  return overlap * 10 + audienceExact * 5 + (item.priority ?? 1);
}

function pickBest(pool, { audience, themes, seed }) {
  if (pool.length === 0) return null;
  const scored = pool.map((item) => ({ item, s: score(item, audience, themes) }));
  const top = Math.max(...scored.map((x) => x.s));
  // Les ex æquo en tête, dans l'ordre du registre (stable), tournent avec la graine.
  const best = scored.filter((x) => x.s === top).map((x) => x.item);
  const index = ((Math.trunc(seed) % best.length) + best.length) % best.length;
  return best[index];
}

function leastRecent(pool, recentContentIds) {
  // `recentContentIds` : du plus récent au plus ancien. Le plus ancien gagne.
  return [...pool].sort((a, b) => recentContentIds.indexOf(b.id) - recentContentIds.indexOf(a.id))[0] ?? null;
}

export function selectIslamicContent({
  items,
  audience,
  context = CONTEXTS.GENERAL,
  themes = [],
  recentContentIds = [],
  seed = 0,
  // Les emplacements COMPACTS (en-tête de l'accueil, après une erreur) ne
  // prennent qu'un texte court : un long ḥadīth n'y pousserait pas les
  // commandes de l'exercice hors de l'écran.
  maxTextLength = Infinity,
} = {}) {
  const eligible = (items ?? []).filter((item) => isEligible(item, audience) && contentText(item).length <= maxTextLength);
  if (eligible.length === 0) return null;

  const wanted = new Set([...(themes ?? []), ...(CONTEXT_THEMES[context] ?? [])]);
  const recent = new Set(recentContentIds);
  const fresh = (pool) => pool.filter((item) => !recent.has(item.id));

  const exact = eligible.filter((item) => item.contexts?.includes(context));
  const general = context === CONTEXTS.GENERAL
    ? []
    : eligible.filter((item) => item.contexts?.includes(CONTEXTS.GENERAL) && !item.contexts.includes(context));

  const opts = { audience, themes: wanted, seed };
  return pickBest(fresh(exact), opts)
    ?? pickBest(fresh(general), opts)
    ?? leastRecent(exact, recentContentIds)
    ?? leastRecent(general, recentContentIds);
}

/**
 * L'audience d'un compte : `student` / `teacher`, rien d'autre. L'admin et
 * le visiteur anonyme n'ont pas de rappel (la couche accompagne l'élève et
 * l'enseignant ; les pages d'administration restent sobres).
 */
export function audienceForUser(user) {
  if (user?.role === 'student') return AUDIENCES.STUDENT;
  if (user?.role === 'teacher') return AUDIENCES.TEACHER;
  return null;
}
