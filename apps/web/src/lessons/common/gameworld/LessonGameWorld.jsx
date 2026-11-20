/**
 * THE GAME WORLD OF A LESSON — a WORLD (a mechanic written once, for a unit) played with a lesson's CONTENT.
 *
 * The lesson names its world in its pack (`lesson.pack.js › world: { id, content }`, LESSON_V2.md); the worlds that exist
 * are the list below — code, one entry per world, never one per lesson. Three things arrive together and lazily, out of
 * the entry bundle (BUNDLE_BOUNDARIES.md): the world (with three.js, ONE chunk shared by every world), the lesson's
 * content, and the student's journey when another device played further (`kit/saveSync.js`).
 * While they arrive the student sees a calm screen that fills as each part lands — never a blank page — and, when the
 * network gives up, a sentence and a way to try again (the page is loaded again: a browser may remember a chunk that
 * failed, and nothing of the journey is lost — it is saved).
 */
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { loadPackPart } from '../../lessonPack';
import { pullSave } from './kit/saveSync';
import './lessonGameWorld.css';

const WORLDS = {
  'divisor-isles': () => import('./divisorIsles/DivisorIsles'),
  'mission-isle': () => import('./missionIsle/MissionIsle'),
};
const PARTS = 3;
const L = {
  loading: 'نجهّز عالمك…',
  failed: 'تعذّر تحميل العالم. تحقّق من الاتصال بالأنترنت ثمّ حاول من جديد.',
  retry: 'حاول من جديد',
};

/** `worldId` = the flag of the lesson's pack (`registry › lessonPackFlags(id).world`); the other props go to the world. */
export default function LessonGameWorld({ worldId, config, ...props }) {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState({ done: 0, ready: null, failed: false });
  const token = auth?.token ?? null;
  const { preview } = props;

  useEffect(() => {
    let alive = true;
    setLoad({ done: 0, ready: null, failed: false });
    const part = (promise) =>
      promise.then((value) => {
        if (alive) setLoad((s) => ({ ...s, done: s.done + 1 }));
        return value;
      });
    Promise.all([
      part(WORLDS[worldId]()),
      part(loadPackPart(config.id, 'world')),
      // a teacher's preview plays from nothing and sends nothing: his journey is not the student's
      part(preview ? Promise.resolve(false) : pullSave(token, config.id)),
    ]).then(
      ([world, lesson]) => {
        if (!alive) return;
        if (!lesson) setLoad((s) => ({ ...s, failed: true }));
        else setLoad({ done: PARTS, failed: false, ready: { World: world.default, lesson, lessonId: config.id } });
      },
      () => alive && setLoad((s) => ({ ...s, failed: true })),
    );
    return () => {
      alive = false;
    };
    // the session and the preview are read when the load starts: a token refreshed meanwhile must not reload the world
  }, [worldId, config.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (load.ready?.lessonId === config.id) {
    const { World, lesson } = load.ready;
    return <World lesson={lesson} config={config} {...props} />;
  }
  return (
    <div
      className="gw-loading"
      dir="rtl"
      role="status"
      aria-live="polite"
      data-gw-loading={load.failed ? 'failed' : load.done}
    >
      <div className="gw-loading__box">
        <p className="gw-loading__lesson">{config.title}</p>
        {load.failed ? (
          <>
            <p className="gw-loading__text">{L.failed}</p>
            <button type="button" className="gw-loading__retry" onClick={() => window.location.reload()} data-gw-retry>
              {L.retry}
            </button>
          </>
        ) : (
          <>
            <div className="gw-loading__bar" aria-hidden="true">
              <i style={{ width: `${Math.round(((load.done + 0.4) / (PARTS + 0.4)) * 100)}%` }} />
            </div>
            <p className="gw-loading__text">{L.loading}</p>
          </>
        )}
      </div>
    </div>
  );
}
