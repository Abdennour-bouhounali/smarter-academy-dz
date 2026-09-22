import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchStudyContext } from '../services/studyContextService';

/**
 * « Comment cet élève étudie-t-il ? » — indépendant, ou dans la classe d'un
 * enseignant. Un seul appel au montage, une lecture partout (accueil,
 * page « قسمي »), et un `refresh()` pour les deux gestes qui le changent :
 * rejoindre et quitter.
 *
 * POLITIQUE D'OUVERTURE, comme ContentAvailabilityContext : tant que la
 * réponse n'est pas là, l'élève est traité comme indépendant. Ce contexte
 * n'autorise rien — la visibilité réglée par l'enseignant vient de
 * GET /content/availability (`hiddenByClass`), et le serveur refuse de
 * toute façon.
 */
const EMPTY = { mode: 'independent', classrooms: [], primary: null, hiddenLessonCodes: [] };

export const StudyContextContext = createContext({
  studyContext: EMPTY,
  loaded: false,
  refresh: async () => EMPTY,
});

export function StudyContextProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [studyContext, setStudyContext] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);

  const isStudent = user?.role === 'student';

  const refresh = useCallback(async () => {
    if (!token || !isStudent) return EMPTY;
    const next = await fetchStudyContext(token);
    setStudyContext(next ?? EMPTY);
    setLoaded(true);
    return next;
  }, [token, isStudent]);

  useEffect(() => {
    let cancelled = false;
    if (!token || !isStudent) {
      setStudyContext(EMPTY);
      setLoaded(false);
      return () => { cancelled = true; };
    }
    fetchStudyContext(token)
      .then((next) => { if (!cancelled) { setStudyContext(next ?? EMPTY); setLoaded(true); } })
      .catch(() => { if (!cancelled) setLoaded(false); });
    return () => { cancelled = true; };
  }, [token, isStudent]);

  const value = useMemo(() => ({ studyContext, loaded, refresh }), [studyContext, loaded, refresh]);

  return <StudyContextContext.Provider value={value}>{children}</StudyContextContext.Provider>;
}

export function useStudyContext() {
  return useContext(StudyContextContext);
}
