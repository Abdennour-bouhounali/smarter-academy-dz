import { createContext, useContext, useEffect } from 'react';

/**
 * Le LECTEUR de mission (MissionPlayer) parle à ce qu'il contient par ces deux contextes, dans leur propre fichier
 * (comme kitContext.js : un fichier sans composant garde l'identité de ses contextes au rechargement à chaud).
 *
 *   InMissionPlayer  : vrai sous le lecteur. Un labo n'y ouvre pas son propre plein écran (le lecteur EST la fenêtre).
 *   MissionUnitNav   : ContentModule déclare ses unités (où en est-on, peut-on avancer) ; le lecteur les montre dans sa
 *                      barre du bas, et ne passe au module suivant qu'à la dernière unité.
 */
export const InMissionPlayerContext = createContext(false);
export const MissionUnitNavContext = createContext(null);
/** La zone de contenu du lecteur, en px CSS ({ width, height }) : un labo y règle sa scène (TeamBuilder : le terrain). */
export const MissionAreaContext = createContext(null);

export function useInMissionPlayer() {
  return useContext(InMissionPlayerContext);
}

export function useMissionArea() {
  return useContext(MissionAreaContext);
}

/**
 * Déclare la navigation par unités d'un module au lecteur (sans effet hors lecteur).
 * nav : { index, count, page, pageCount, kind ('brief' | 'intro' = le labo | 'step' | 'footer'), onPrevious?, onNext?, canNext }
 */
export function useDeclareUnitNav(nav) {
  const set = useContext(MissionUnitNavContext);
  useEffect(() => {
    if (!set) return undefined;
    set(nav);
    return () => set(null);
  }, [set, nav]);
}
