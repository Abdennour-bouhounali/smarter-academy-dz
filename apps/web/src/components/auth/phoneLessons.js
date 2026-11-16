/**
 * THE PAGES A PHONE MAY OPEN (owner, 2026-11-16: « allow only the pages that are designed for mobile; for the others
 * display the message: open it on the large screen »). A lesson enters `PHONE_LESSONS` when its home has been designed
 * and walked on a phone: for the student the game world (played sideways), for the teacher his card. Today: the pilot.
 * What opens: the HOME of the lesson and, for the teacher, the memo and the lesson file. Its other pages — a module, the
 * classic player (`?view=classic`), the class session, the bank, the tracking, the knowledge card — keep the message.
 * No catalogue import here: this module is in the entry bundle (BUNDLE_BOUNDARIES.md).
 */
export const PHONE_LESSONS = ['qasim-adad-tabii'];

/** The teacher's tools of a lesson that a phone may open (owner, 2026-11-16): the memo and the lesson file — to read and to note. */
const TEACHER_PHONE_TOOLS = [/^\/enseignant\/cours\/([^/]+)\/memoire\/?$/, /^\/enseignant\/milaff\/([^/]+)\/?$/];

/** Is this address a page of a phone-ready lesson that was designed for a phone? */
export function isPhoneLessonPath(pathname, search = '') {
  const path = String(pathname ?? '');
  if (TEACHER_PHONE_TOOLS.some((tool) => PHONE_LESSONS.includes(decodeURIComponent(path.match(tool)?.[1] ?? ''))))
    return true;
  const parts = path.split('/').filter(Boolean);
  const home = parts[0] === 'courses' && PHONE_LESSONS.includes(parts[parts.length - 1]);
  const classic = new URLSearchParams(search).get('view') === 'classic';
  return home && !classic;
}

/** The ids of the lesson tools (`LessonToolsBar › lessonTools`) a phone opens; the others are shown as « على الحاسوب ». */
export const PHONE_TOOL_IDS = ['lesson', 'memo', 'file'];
