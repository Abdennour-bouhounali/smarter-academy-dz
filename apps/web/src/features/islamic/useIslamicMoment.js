import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { audienceForUser, isEligible, selectIslamicContent } from './islamicSelector.js';
import { daySeed, planMoment, readFrequencyState, recordShown, writeFrequencyState } from './islamicFrequency.js';

/**
 * Le registre arrive À LA DEMANDE : un `import()` partagé, jamais dans le
 * lot d'entrée ni dans le runtime de leçon. Un échec de chargement (réseau)
 * n'affiche rien et laisse le prochain moment réessayer.
 */
let contentPromise = null;
export function loadIslamicContent() {
  contentPromise ??= import('./content/index.js')
    .then((module) => module.ISLAMIC_CONTENT)
    .catch((error) => { contentPromise = null; throw error; });
  return contentPromise;
}

/**
 * UNE seule carte à la fois sur l'écran : le premier moment monté prend la
 * place, les suivants se taisent tant qu'il est là.
 */
const slot = { owner: null };
function useSingleSlot(wanted) {
  const id = useRef(Symbol('islamic-moment'));
  const [owns, setOwns] = useState(false);
  useEffect(() => {
    if (!wanted) return undefined;
    const me = id.current;
    if (slot.owner === null) {
      slot.owner = me;
      setOwns(true);
    }
    return () => {
      if (slot.owner === me) slot.owner = null;
      setOwns(false);
    };
  }, [wanted]);
  return owns;
}

/**
 * Le rappel de CE moment pour CE compte, ou `null` (pas d'audience, moment
 * au repos, autre carte déjà affichée, registre indisponible).
 *
 *   context        — un des CONTEXTS (islamicThemes.js), ou un moment PAR
 *                    rôle : `{ student: 'lesson_start', teacher: 'teacher_start' }`
 *                    (un rôle absent de l'objet n'a pas de rappel) ;
 *   themes         — thèmes supplémentaires préférés ;
 *   only           — `student` / `teacher` : se taire pour l'autre rôle ;
 *   maxTextLength  — emplacement compact ;
 *   enabled        — la page dit quand le moment est venu.
 *
 * Le choix est fait UNE fois par montage (puis mémorisé par la fréquence) :
 * le texte ne change pas sous les yeux pendant que la page se re-rend.
 */
export function useIslamicMoment({ context: requested, themes = [], only = null, maxTextLength = Infinity, enabled = true }) {
  const { user } = useContext(AuthContext);
  const audience = audienceForUser(user);
  const context = requested && typeof requested === 'object' ? requested[audience] : requested;
  const active = Boolean(enabled && audience && context && (!only || only === audience));
  const owns = useSingleSlot(active);
  const [item, setItem] = useState(null);
  const themesKey = themes.join('|');

  useEffect(() => {
    if (!active || !owns) return undefined;
    let cancelled = false;
    loadIslamicContent().then((items) => {
      if (cancelled) return;
      const now = Date.now();
      const state = readFrequencyState();
      const plan = planMoment({ context, state, now });
      if (plan.action === 'skip') return;
      if (plan.action === 'reuse') {
        const kept = items.find((i) => i.id === plan.id);
        if (kept && isEligible(kept, audience)) { setItem(kept); return; }
      }
      const chosen = selectIslamicContent({
        items, audience, context, themes: themesKey ? themesKey.split('|') : [],
        recentContentIds: state.recent, seed: daySeed(now), maxTextLength,
      });
      if (!chosen) return;
      writeFrequencyState(recordShown(state, { context, id: chosen.id, now }));
      setItem(chosen);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [active, owns, context, audience, themesKey, maxTextLength]);

  return active && owns ? item : null;
}
