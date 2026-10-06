import { useCallback, useState } from 'react';

const KEY = 'sa.practice.sideColumnHidden';

function read() {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * La colonne latérale du lecteur d'exercices (point d'apprentissage chez
 * l'élève, « إجابات تلاميذي » chez l'enseignant) se REPLIE d'un geste : l'exercice
 * prend alors toute la largeur. Le choix est retenu dans CE navigateur
 * (confort personnel, jamais une donnée — d'où le try/catch : stockage
 * bloqué = colonne visible, la page marche quand même).
 *
 * @returns {[boolean, () => void]} [masquée, basculer]
 */
export function useSideColumn() {
  const [hidden, setHidden] = useState(read);
  const toggle = useCallback(() => {
    setHidden((current) => {
      const next = !current;
      try { window.localStorage.setItem(KEY, next ? '1' : '0'); } catch { /* stockage indisponible */ }
      return next;
    });
  }, []);
  return [hidden, toggle];
}

/** La grille du lecteur : deux colonnes, ou l'exercice seul sur toute la largeur. */
export const practiceGridClass = (hidden) => (hidden
  ? 'grid grid-cols-1 gap-3 [[data-sa-classroom]_&]:block'
  : 'grid grid-cols-1 gap-3 xl:grid-cols-[28rem_minmax(0,1fr)] xl:items-start xl:gap-5 2xl:grid-cols-[30.6rem_minmax(0,1fr)] [[data-sa-classroom]_&]:block');
