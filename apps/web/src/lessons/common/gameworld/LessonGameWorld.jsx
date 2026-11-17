/**
 * THE GAME WORLD OF A LESSON — a WORLD (a mechanic written once, for a unit) played with a lesson's CONTENT.
 *
 * The lesson names its world in its pack (`lesson.pack.js › world: { id, content }`, LESSON_V2.md); the worlds that exist
 * are the list below — code, one entry per world, never one per lesson. Both halves are loaded together and lazily:
 * three.js and the lesson's content stay out of the entry bundle (BUNDLE_BOUNDARIES.md).
 */
import { useEffect, useState } from 'react';
import { loadPackPart } from '../../lessonPack';

const WORLDS = {
  'divisor-isles': () => import('./divisorIsles/DivisorIsles'),
};

/** `worldId` = the flag of the lesson's pack (`registry › lessonPackFlags(id).world`); the other props go to the world. */
export default function LessonGameWorld({ worldId, config, ...props }) {
  const [ready, setReady] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([WORLDS[worldId](), loadPackPart(config.id, 'world')]).then(([world, lesson]) => {
      if (alive) setReady({ World: world.default, lesson, lessonId: config.id });
    });
    return () => {
      alive = false;
    };
  }, [worldId, config.id]);
  if (!ready || ready.lessonId !== config.id) return null;
  const { World, lesson } = ready;
  return <World lesson={lesson} config={config} {...props} />;
}
