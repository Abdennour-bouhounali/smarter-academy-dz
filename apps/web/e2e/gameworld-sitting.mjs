// « فضاء الامتحان » — walk of the exam LADDER and of one SITTING of lesson `qasim-adad-tabii` as a STUDENT (simulated session, no API).
// The ladder (five levels, the next one lit), a sitting of level 4, the moment between two levels (a failed sheet → a similar
// adapted one → a full paper → the promotion with stars), then « تقدّمي ».
// Reading time (nothing to answer, a word underlined), the silent sitting (no verdict of any kind), the hand-in, then the
// copy handed back: the mark by the scheme, the two helps, the notebook. Nothing may scroll at any moment.
// Run (dev server up): [E2E_SIZE=1366x768] node apps/web/e2e/gameworld-sitting.mjs [outDir]
import { chromium } from 'playwright';
import { GL_ARGS } from './lib/gpu.mjs';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const LESSON = `${process.env.E2E_BASE || 'http://localhost:5173'}/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-adad-tabii`;
const OUT = process.argv[2] || `${tmpdir()}/gameworld-sitting`;
const SIZE = (process.env.E2E_SIZE || '1366x768').split('x').map(Number);
mkdirSync(OUT, { recursive: true });
const KEYS = ['qasim-baqi', 'qasim-jidaa', 'siyagh-mutakafia', 'wahid-wa-nafsuh'];
const expect = (cond, msg) => { if (!cond) { console.log('FAIL', msg); process.exitCode = 1; throw new Error(msg); } console.log('ok  ', msg); };
const browser = await chromium.launch({ args: GL_ARGS });
const ctx = await browser.newContext({ viewport: { width: SIZE[0], height: SIZE[1] }, ...(process.env.E2E_TOUCH === '1' ? { hasTouch: true, isMobile: true } : {}) });
await ctx.addInitScript((keys) => {
  window.__paperFast = true; localStorage.setItem('token', 'qa-fake-token');
  const practice = Object.fromEntries(keys.map((k) => [`${k}:1`, { stars: 2, best: 900 }])); const one = (mark, total) => ({ stars: 3, mark, total });
  if (!localStorage.getItem('u_9401_smarter_world_qasim-adad-tabii')) localStorage.setItem('u_9401_smarter_world_qasim-adad-tabii', JSON.stringify({ v: 1, stage: 8, stars: {}, gems: [], keys, keysEver: keys, falls: 0, flags: {}, finished: true, practice, exam: { best: { 1: one(3, 3), 2: one(6, 6), 3: one(7, 7) }, fails: {}, weak: {}, sittings: 3 } }));
  const real = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.includes('/game-evidence')) (window.__posts ??= []).push(JSON.parse(init.body));
    if (url.includes('/api/')) return new Response(JSON.stringify(url.includes('/auth/me') ? { success: true, user: { id: 9401, name: 'تلميذ', role: 'student', roles: ['student'], email_verified_at: '2026-09-01T00:00:00Z', emailVerified: true, nameComplete: true, level: '4am', grade: '4am' } } : { success: true, data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return real(input, init);
  };
}, KEYS);
const page = await ctx.newPage(); const errors = [];
page.on('pageerror', (e) => { errors.push(e.message); console.log('pageerror', e.message); });
let n = 0;
/** Nothing scrolls, nothing is cut, nothing leaves the screen — checked at every screenshot. */
const shot = async (name) => {
  await page.waitForTimeout(350);
  const bad = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('.di-root *')) { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && !el.hasAttribute('data-di-fit-scroll')) out.push(`scrolls: ${el.className}`); } // on a phone held sideways a Fit box slides INSIDE itself and marks itself (GAME_WORLD.md « On a phone », rule 3)
    for (const box of document.querySelectorAll('.xs-root [data-di-fitbox]')) { const o = box.getBoundingClientRect(); const i = box.firstElementChild.getBoundingClientRect(); if (o.height > 0 && i.height > o.height + 3 && !box.hasAttribute('data-di-fit-scroll')) out.push(`cut: ${box.className}`); if (Number(box.dataset.diFitz) < 0.8) out.push(`shrunk ×${box.dataset.diFitz}: ${box.className}`); }
    for (const el of document.querySelectorAll('.xs-head, .xs-paper, .xs-sheet, .xs-foot')) { const r = el.getBoundingClientRect(); if (r.height > 0 && (r.top < -2 || r.bottom > window.innerHeight + 2 || r.left < -2 || r.right > window.innerWidth + 2)) out.push(`leaves the screen: ${el.className}`); }
    if (document.documentElement.scrollHeight > window.innerHeight + 1) out.push('the page scrolls');
    return out;
  });
  if (bad.length) { console.log('FAIL at «', name, '»:', bad.join(' | ')); process.exitCode = 1; throw new Error(`layout at ${name}`); }
  n += 1; await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${name}.png` });
};
const px = (sel) => page.evaluate((s) => { const el = document.querySelector(s); const z = Number(document.querySelector('.xs-fit').style.zoom || 1); return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * z) : 0; }, sel);

await page.goto(LESSON, { waitUntil: 'networkidle' });
// ── 0. the two spaces: the game first, the exam behind its switch; a ladder of five levels ──
await page.waitForSelector('[data-di-map]'); await page.click('[data-di-map]'); await page.waitForSelector('[data-di-space="exam"]');
expect(await page.locator('[data-di-node]').count() >= 5 && await page.locator('[data-di-ladder]').count() === 0, 'the practice hub opens on « فضاء اللعب »');
await page.click('[data-di-space="exam"]'); await page.waitForSelector('[data-di-ladder="open"]');
expect(await page.locator('[data-di-exam-level]').count() === 5 && await page.locator('.di-rungs li.is-passed').count() === 3 && await page.locator('.di-rungs li.is-next [data-di-exam-level="4"]').count() === 1 && await page.locator('[data-di-exam-level="5"]').isDisabled(), '« فضاء الامتحان »: five levels, three passed, level 4 lit, level 5 locked');
await shot('ladder');
await page.click('[data-di-exam-level="4"]'); await page.waitForSelector('[data-xs="read"]');
// ── 1. reading time ──
expect(await page.locator('.xs-ex').count() === 3 && await page.locator('.xs-root input, .xs-root select').count() === 0, 'reading time: the three exercises are on the sheet, and no answer box exists yet');
expect(await page.evaluate(() => window.__world.getState().paper === true && window.__world.audio.musicWanted === false), 'the sitting is silent: the music is off');
await page.locator('.xs-word').nth(3).click();
expect(await page.locator('.xs-word.is-marked').count() === 1, 'a tap underlines a word of the subject in pencil');
console.log('    text on screen (px): statement', await px('.xs-statement'), '· question', await px('.xs-ex ol'), '· title', await px('.xs-head h2'));
// a phone held sideways has ONE scale, its root font at 13 px (GAME_WORLD.md « On a phone », rule 1): the sheet's 1.15rem is 15 px there
const PHONE = process.env.E2E_TOUCH === '1' && SIZE[1] <= 500;
expect(await px('.xs-statement') >= (PHONE ? 14 : 17), 'the subject is comfortable to read');
await shot('read');
await page.click('[data-xs-start]'); await page.waitForSelector('[data-xs="sit"]');

// ── 2. the sitting: a planned paper — one half-right division, one wrong answer, one question left blank ──
const subject = await page.evaluate(() => window.__sitting.subject);
const qs = subject.exercises.flatMap((e) => e.questions);
const right = (q) => (q.type === 'division' ? { q: Math.floor(q.a / q.b), r: q.a % q.b } : q.type === 'verdict' ? (q.a % q.b === 0 ? 'yes' : 'no') : q.type === 'phrase' ? (q.smallFirst ? 'qasim' : 'mudaaf') : q.type === 'money' ? { x: q.q * q.price } : q.type === 'ceil' ? { x: Math.ceil(q.a / q.b) } : q.type === 'value' ? { x: q.expected } : { x: q.a / q.b });
const plan = Object.fromEntries(qs.map((q) => [q.id, right(q)]));
plan.e1q1 = { q: plan.e1q1.q, r: plan.e1q1.r + 1 }; plan.e2q2 = { x: qs.find((q) => q.id === 'e2q2').b }; delete plan.e3q3;
for (const [i, e] of subject.exercises.entries()) {
  await page.click(`[data-xs-page="${i}"]`);
  expect(await page.locator('.xs-paper .xs-ex').count() === 1 && await page.locator('.xs-sheet li').count() === e.questions.length, `${e.title}: its statement and its answer boxes are side by side`);
  for (const q of e.questions) { const v = plan[q.id]; if (v == null) continue; if (typeof v === 'string') await page.selectOption(`[data-xs-select="${q.id}"]`, v); else for (const [k, x] of Object.entries(v)) await page.fill(`[data-xs-slot="${q.id}:${k}"]`, String(x)); }
  if (i === 0) {
    await page.locator('.xs-flag').first().click(); await shot('sit');
    // a forgotten exercise: he hands in after the first exercise only — the sheet turns to the empty one, once
    await page.click('[data-xs-hand]');
    expect(await page.getAttribute('[data-xs-forgot]', 'data-xs-forgot') === '1,2' && await page.locator('[data-xs-hand-yes]').count() === 0, 'handing in with two untouched exercises is not accepted at once: they are named');
    expect(await page.locator('[data-xs-page="1"].is-on').count() === 1 && (await page.textContent('.xs-sheet h3')).includes(subject.exercises[1].title), 'the answer sheet has turned to the first forgotten exercise');
    expect(await page.locator('.xs-pen, .xs-total, .xs-red, [data-xs-mark]').count() === 0, 'the reminder is not a verdict');
    await shot('forgot');
    await page.click('[data-xs-forgot-go]');
    expect(await page.locator('[data-xs-forgot]').count() === 0 && await page.locator('[data-xs-hand]').count() === 1, '« أواصل » gives the sheet back');
    await page.click('[data-xs-hand]');
    expect(await page.locator('[data-xs-hand-yes]').count() === 1 && await page.locator('[data-xs-forgot]').count() === 0, 'the second hand-in is accepted, even with exercises still empty: it is now his choice');
    await page.click('[data-xs-hand-no]');
  }
}
expect(await page.locator('.xs-pen, .xs-total, .xs-red, [data-xs-mark]').count() === 0 && !(await page.textContent('.xs-root')).includes('✓'), 'during the sitting there is NO verdict of any kind: no tick, no mark, no red');
expect(await page.locator('[data-xs-pace]').count() === 1 && await page.locator('.xs-word.is-marked').count() <= 1, 'a quiet pace line shows where the student should be');
expect((await page.evaluate(() => window.__posts ?? [])).length === 0, 'nothing is sent before the paper is handed in');
await page.click('[data-xs-hand]'); await shot('confirm');
await page.click('[data-xs-hand-yes]'); await page.waitForSelector('[data-xs="back"]');

// ── 3. the copy handed back ──
const total = Number(await page.getAttribute('[data-xs-total]', 'data-xs-total'));
expect(total === 6.75, `the mark follows the scheme: 10 − 0,75 (half a division) − 1 (a wrong divisor) − 1,5 (a blank) = 6,75 (got ${total})`);
expect(await page.getAttribute('[data-xs-row="e1q1"]', 'data-xs-mark') === 'half' && await page.getAttribute('[data-xs-row="e2q2"]', 'data-xs-mark') === 'ko' && (await page.textContent('[data-xs-row="e3q3"]')).includes('لم تُجب'), 'each question carries its red mark: a half, a cross, and « لم تُجب » for the blank');
{
  const posts = await page.evaluate(() => window.__posts ?? []);
  expect(posts.length === 5 && posts.every((p) => p.context === 'case') && posts.filter((p) => p.claim.kind === 'division').length === 2, 'الكفاءات: the five answers the server can re-compute are sent at the hand-in — never the blank, never the money');
  expect(posts.find((p) => p.claim.kind === 'division' && p.claim.a === qs[0].a).claim.r === plan.e1q1.r, 'the wrong remainder is sent as the student wrote it');
}
await shot('back');
await page.click('[data-xs-row="e2q2"]'); await page.waitForSelector('[data-xs-detail="e2q2"]');
expect(await page.locator('.xs-scheme input').count() >= 2 && await page.locator('[data-xs-help]').count() === 0, 'a lost point opens the scheme to tick against the paper — and no answer yet');
await page.click('[data-xs-guide]');
{ const g = await page.textContent('[data-xs-help="guide"]'); const q = qs.find((x) => x.id === 'e2q2'); expect(g.includes('أعد حلّ') && !g.includes(String(q.a / q.b)), '« أرشدني » reminds the rule and sends back to the paper, without the answer'); }
await shot('guide');
await page.click('[data-xs-explain]');
{ const m = await page.textContent('[data-xs-help="explain"]'); const q = qs.find((x) => x.id === 'e2q2'); expect(m.includes(String(q.a / q.b)) && m.includes('أيضًا'), '« اشرح لي » shows the model copy'); }
await page.locator('.xs-scheme input').first().check(); await shot('explain');
await page.click('[data-xs-row="e1q2"]');
expect(await page.locator('[data-xs-help="explain"]').count() === 1 && await page.locator('[data-xs-guide]').count() === 0, 'a full-mark question shows its model copy directly');
await page.locator('[data-xs-notebook-open]').first().click(); await page.waitForSelector('[data-xs-notebook]');
expect(await page.locator('[data-xs-notebook] li').count() === 2, 'the notebook lists what to write by hand: one line per rule that lost points');
await shot('notebook');
await page.click('[data-xs-finish]');
expect(await page.locator('.xs-root').count() === 0 && await page.evaluate(() => window.__world.getState().paper === false), 'the sitting closes; the music may come back');

// ── 4. between two levels: the GAME comes back. 6,75 / 10 is under 80 %: an encouragement and a similar, adapted sheet ──
await page.waitForSelector('[data-di-promotion="retry"]');
{
  const st = await page.evaluate(() => window.__world.getState().exam);
  expect(st.fails[4] === 1 && st.weak[4].length === 3 && !st.best[4], 'a failed sheet: the level stays, and the three kinds where points were lost are remembered');
  expect(await page.locator('[data-di-promo-similar]').count() === 1 && await page.locator('[data-di-promo-next]').count() === 0 && await page.locator('.di-confetti').count() === 0, 'no celebration, no next level: « ورقة مشابهة »');
}
await shot('retry');
await page.click('[data-di-promo-similar]'); await page.waitForSelector('[data-xs="read"]');
const second = await page.evaluate(() => window.__sitting.subject);
expect(second.level === 4 && second.exercises.every((e) => e.focus) && JSON.stringify(second.exercises.map((e) => e.statement)) !== JSON.stringify(subject.exercises.map((e) => e.statement)), 'the new sheet is of the same level, marked as adapted, with other numbers');
await page.click('[data-xs-start]'); await page.waitForSelector('[data-xs="sit"]');
for (const [i, e] of second.exercises.entries()) {
  await page.click(`[data-xs-page="${i}"]`);
  for (const q of e.questions) { const v = right(q); if (typeof v === 'string') await page.selectOption(`[data-xs-select="${q.id}"]`, v); else for (const [k, x] of Object.entries(v)) await page.fill(`[data-xs-slot="${q.id}:${k}"]`, String(x)); }
}
await page.click('[data-xs-hand]'); await page.click('[data-xs-hand-yes]'); await page.waitForSelector('[data-xs="back"]');
expect(Number(await page.getAttribute('[data-xs-total]', 'data-xs-total')) === 10, 'a full paper: 10 / 10');
await page.click('[data-xs-close]'); await page.waitForSelector('[data-di-promotion="promoted"]');
{
  const st = await page.evaluate(() => window.__world.getState().exam);
  expect(st.best[4].stars === 3 && st.fails[4] === 0 && st.weak[4].length === 0, 'the level is passed with three stars; its weak list is cleared');
  expect(await page.locator('.di-confetti i').count() > 10 && await page.locator('[data-di-promotion] .di-stars3 .is-on').count() === 3 && await page.locator('[data-di-promo-next]').count() === 1, 'the promotion is a moment of GAME: confetti, three stars, the next level offered');
}
await shot('promotion');
await page.click('[data-di-promo-ladder]'); await page.waitForSelector('[data-di-ladder="open"]');
expect(await page.locator('.di-rungs li.is-next [data-di-exam-level="5"]').count() === 1 && !(await page.locator('[data-di-exam-level="5"]').isDisabled()), 'back on the ladder: level 5 is open and lit');
await shot('ladder-after');
await page.click('[data-di-exam-level="5"]'); await page.waitForSelector('[data-xs="read"]');
{ const five = await page.evaluate(() => window.__sitting.subject); expect(five.level === 5 && five.total === 12 && five.exercises.at(-1).kind === 'trip', 'level 5 is the full exam: 12 points, ending on the situation where the remainder means one more lorry'); }
await shot('level5-read');

// ── 4bis. « خروج »: one confirmation, then back to the ladder — nothing marked, nothing sent, nothing counted ──
{
  const before = await page.evaluate(() => ({ exam: JSON.stringify(window.__world.getState().exam), posts: (window.__posts ?? []).length }));
  await page.click('[data-xs-quit]'); await page.waitForSelector('[data-xs-quit-box]');
  expect((await page.textContent('[data-xs-quit-box]')).includes('تخرج من الامتحان؟') && await page.locator('[data-xs="read"]').count() === 1, '« خروج » asks first: the sitting is still there behind the question');
  await shot('quit');
  await page.click('[data-xs-quit-no]');
  expect(await page.locator('[data-xs-quit-box]').count() === 0 && await page.locator('[data-xs="read"]').count() === 1, '« أواصل » closes the question and keeps the sitting');
  await page.click('[data-xs-start]'); await page.waitForSelector('[data-xs="sit"]');
  await page.locator('[data-xs-slot]').first().fill('7');
  await page.click('[data-xs-quit]'); await page.click('[data-xs-quit-yes]'); await page.waitForSelector('[data-di-ladder="open"]');
  const after = await page.evaluate(() => ({ exam: JSON.stringify(window.__world.getState().exam), posts: (window.__posts ?? []).length, paper: window.__world.getState().paper, type: window.__world.getState().overlay?.type }));
  expect(await page.locator('[data-xs]').count() === 0 && after.type === 'map', '« نعم، أخرج » during the sitting leads back to the ladder');
  expect(after.exam === before.exam && after.posts === before.posts && after.paper !== true, 'leaving counts for nothing: the ladder has not moved, no evidence was sent, the paper mode is off');
  expect(!(await page.locator('[data-di-exam-level="5"]').isDisabled()), 'the same level is still open, for a new sheet');
}

// ── 5. « تقدّمي »: the road of the lesson, an honest readiness, the ONE next thing ──
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('[data-di-progress-open]'); await page.click('[data-di-progress-open]'); await page.waitForSelector('[data-di-progress]');
{
  expect(await page.locator('[data-di-road-step]').count() === 5 && await page.locator('[data-di-prow]').count() === 4, '« تقدّمي »: the five stations of the road and the four الكفاءات');
  const ready = Number(await page.getAttribute('[data-di-ready]', 'data-di-ready'));
  const tally = await page.evaluate(() => window.__world.getState().tally);
  expect(ready >= 70 && ready <= 100 && tally['qasim-baqi'].n >= 4, `the readiness (${ready}%) counts the ladder (4 of 5) and the answers given as in an exam — saved across a reload`);
  expect(await page.getAttribute('[data-di-next-step]', 'data-di-next-step') === 'exam', 'the next thing: sit level 5');
  await shot('progress');
  await page.click('[data-di-next-step]'); await page.waitForSelector('[data-xs="read"]');
  expect((await page.evaluate(() => window.__sitting.subject.level)) === 5, 'one tap on it opens that sitting');
}
expect(errors.length === 0, 'no page error');
await browser.close();
