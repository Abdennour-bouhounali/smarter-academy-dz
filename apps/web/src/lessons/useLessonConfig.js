import { useEffect, useMemo, useState } from 'react';
import { getLoadedLessonConfig, isLessonBuilt, loadLessonConfig } from './registry';

/**
 * Le LESSON_CONFIG complet d'une leçon, chargé AVEC elle (registry.js, deux couches).
 *
 * Synchrone quand il est déjà chargé — toujours le cas sur une page de la leçon,
 * dont le routes.jsx l'a importé : pas un rendu de retard. Ailleurs (page d'unité,
 * مذكرة الدرس), `null` le temps du chargement, puis la config.
 *
 * @param {string|null|undefined} lessonId
 * @returns {object|null}
 */
export function useLessonConfig(lessonId) {
  const [, setVersion] = useState(0);
  const config = lessonId ? getLoadedLessonConfig(lessonId) : null;
  const pending = Boolean(lessonId) && !config && isLessonBuilt(lessonId);
  useEffect(() => {
    if (!pending) return undefined;
    let alive = true;
    loadLessonConfig(lessonId).then(() => { if (alive) setVersion((v) => v + 1); }, () => {});
    return () => { alive = false; };
  }, [lessonId, pending]);
  return config;
}

/**
 * Les configs de plusieurs leçons (une page d'unité) : une Map id → config, qui
 * se remplit à mesure que les configs arrivent. Les leçons non construites n'y
 * figurent jamais.
 *
 * @param {string[]} lessonIds
 * @returns {Map<string, object>}
 */
export function useLessonConfigs(lessonIds) {
  const key = lessonIds.join('|');
  const [, setVersion] = useState(0);
  const ids = useMemo(() => (key ? key.split('|') : []), [key]);
  const missing = ids.filter((id) => isLessonBuilt(id) && !getLoadedLessonConfig(id));
  const missingKey = missing.join('|');
  useEffect(() => {
    if (!missingKey) return undefined;
    let alive = true;
    Promise.all(missingKey.split('|').map((id) => loadLessonConfig(id)))
      .then(() => { if (alive) setVersion((v) => v + 1); }, () => {});
    return () => { alive = false; };
  }, [missingKey]);
  return new Map(ids.map((id) => [id, getLoadedLessonConfig(id)]).filter(([, c]) => c));
}
