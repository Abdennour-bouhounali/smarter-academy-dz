/**
 * « ملخّص الوحدة » (REVISION_PAGE.md §6): the rules of a unit's lessons in one table per lesson, READ from the knowledge
 * sheets each lesson's pack already has — nothing is written for this page. The unit's last lesson (« أدمج تعلّماتي »,
 * `unit.synthesis`) teaches no rule and is left out (owner, 2026-11-26). A unit has its summary only once EVERY other
 * lesson of it is complete — its game world and its sheets (owner, the same day).
 */
import { hasPackPart, loadPackPart } from '../../lessons/lessonPack';
import { lessonPackFlags } from '../../lessons/registry';

export const summaryLessons = (unit) => {
  const lessons = unit?.lessons ?? [];
  const complete = (l) => Boolean(lessonPackFlags(l.id).world) && hasPackPart(l.id, 'knowledge');
  return lessons.length && lessons.every(complete) ? lessons : [];
};

export const unitSummaryPath = (unitId, space = 'espace') => `/${space}/muraja/wahda/${encodeURIComponent(unitId)}`;

/**
 * A sheet's formula, ONE statement per line (owner, 2026-11-26: « math statement will be in one line »): it is cut only
 * where a long formula holds two separate statements, set apart by a « \quad » gap.
 */
const formulaLines = (tex) => {
  const whole = String(tex ?? '').trim();
  const lines = whole.length > 60 ? whole.split(/(?:\\quad)+/) : [whole];
  return lines.filter(Boolean).map((line) => `$${line.trim()}$`);
};

/** A calculation typed in plain characters: « 42 = 22 + 20 », « a = b × q ». */
const PLAIN_CALCULATION = /[A-Za-z0-9](?:[A-Za-z0-9٫]*\s*[×=+−]\s*)+[A-Za-z0-9٫]+/g;

/** One unbreakable left-to-right island per calculation; a « · » between two sentences becomes an Arabic « ؛ », which cannot reorder them. */
export const keepTogether = (text) =>
  text.replace(PLAIN_CALCULATION, (run) => `⁦${run.replace(/\s/g, ' ')}⁩`).replace(/ · /g, '؛ ');

/** « PGCD(a ; b) » typed inside an Arabic sentence is set as one formula, or it turns around where the line breaks. */
const asMath = (text) => String(text ?? '').replace(/PGCD\(([^()\u0600-\u06ff]*)\)/g, '$$\\mathrm{PGCD}($1)$$');

/** The rows of one lesson's sheets, in the order of its modules. A sheet without a short form (`memo.rule`) has no row. */
const summaryRows = (knowledge) =>
  Object.values(knowledge?.modules ?? {})
    .flat()
    .filter((item) => item.memo?.rule)
    .map((item) => ({
      id: item.id,
      title: item.title,
      text: keepTogether(asMath(item.summary)),
      rule: formulaLines(item.memo.rule),
      example: formulaLines(item.memo.example),
      trap: keepTogether(asMath(item.memo.trap)),
    }));

/** @returns {Promise<{id:string,title:string,rows:object[]}[]>} one entry per lesson that has rules. */
export async function loadUnitSummary(lessons) {
  const loaded = await Promise.all(
    lessons.map(async (l) => ({
      id: l.id,
      title: l.title,
      rows: summaryRows(await loadPackPart(l.id, 'knowledge')),
    })),
  );
  return loaded.filter((l) => l.rows.length);
}
