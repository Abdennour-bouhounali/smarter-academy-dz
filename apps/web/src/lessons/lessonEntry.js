/**
 * WHERE A STUDENT LANDS IN A V2 LESSON (LESSON_V2.md §2bis): the lesson's address is HIS HOME of the lesson
 * (`features/lessonHome/LessonHome.jsx`); its game world is at the same address with `?world=1`. One place says it,
 * read by the home (`LessonIndex`), by the loading screen (`LessonWaiting`), by the route boundary and by the links
 * that go straight into the world (the walks too: `e2e/lib/lessonWalk/load.mjs`).
 *
 * The query words are ASCII on purpose (the French platform says `?monde=1`, `?outil=…`, `&jouer=…`; here
 * `?world=1`, `?tool=…`, `&play=…`).
 */
const WORLD_PARAM = 'world';

export const worldPath = (basePath) => `${basePath}?${WORLD_PARAM}=1`;

/** Is this address the world itself? `params` is a URLSearchParams (the router's, or the window's). */
export const opensWorldNow = (params) => params.get(WORLD_PARAM) === '1';

/**
 * THE LESSON'S TOOLS, OPENED WITH NO WORLD (owner, 2026-11-26 on the French platform, ported 2026-11-28):
 * « فضاء التدريب », « خريطة المعارف » and « مختبري » are at the lesson's address with `?tool=<tool>` — the 3D world is
 * NOT loaded (`LessonIndex`, `gameworld/LessonToolsLoader`). Closing one comes back to the home.
 */
const TOOLS = ['practice', 'knowledge', 'lab'];
export const toolPath = (basePath, tool) => `${basePath}?tool=${tool}`;
export const toolAsked = (params) => (TOOLS.includes(params.get('tool')) ? params.get('tool') : null);

/** A game level is played IN the world: the tools send the student there, straight on that run (kit/LessonWorld.jsx). */
export const levelPath = (basePath, node, level) => `${worldPath(basePath)}&play=${node}:${level}`;
export const levelAsked = (params) => {
  const m = opensWorldNow(params) && /^(\d+):(\d+)$/.exec(params.get('play') ?? '');
  return m ? { node: Number(m[1]), level: Number(m[2]) } : null;
};
