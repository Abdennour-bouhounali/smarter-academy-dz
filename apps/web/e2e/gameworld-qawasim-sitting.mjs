// « فضاء الامتحان » and « تقدّمي » of lesson `qawasim-adad-tabii` (lesson 2), as a STUDENT — the equivalent of the pilot's
// gameworld-sitting.mjs. « تقدّمي » is read first (four levels passed); then, from the hub's exam space, ONE sitting of level 5
// « على منوال الامتحان » is ANSWERED from its first question to its copy handed back: the reading time, every answer typed in
// the shape the sheet gives (the boxes of « [ ]² ≤ a < [ ]² », one box per divisor, a verdict chosen in its sentence, a count
// with its printed unit) — the answers computed HERE from the numbers on the sheet. What the hand-in posts is captured and its
// shape asserted; the copy (10 / 10), a question's model copy, the notebook, the promotion, the ladder; then « تقدّمي » shows
// what the sitting earned, and its ✕ leaves.
// Run (dev server up): [E2E_SIZE=1366x768] [E2E_TOUCH=1] node apps/web/e2e/gameworld-qawasim-sitting.mjs [outDir]
import { createWalk, lessonUrl, divisorsOf, isqrt, PHONE } from './lib/walk.mjs';

const ID = 'qawasim-adad-tabii';
const URL = lessonUrl('ansab_al_aadad_wal_hisab', ID);
const KEYS = ['jidaa-aamilayn', 'qasim-rappel', 'tariqa-qawasim', 'qawaid-qisma'];
const NB = ' / ';
const w = createWalk('gameworld-qawasim-sitting');
const { expect, check, shot } = w;
const SHEET_OUT = { exit: ['[data-xs-quit]', '[data-xs-close]'] };

await w.run(async () => {
  const practice = Object.fromEntries(KEYS.map((k) => [`${k}:1`, { stars: 2, best: 800 }]));
  const one = (mark, total) => ({ stars: 3, mark, total });
  const exam = { best: { 1: one(3, 3), 2: one(6, 6), 3: one(6, 6), 4: one(10, 10) }, fails: {}, weak: {}, sittings: 4 };
  const save = { v: 1, stage: 8, stars: {}, gems: [], keys: KEYS, keysEver: KEYS, falls: 0, flags: {}, finished: true, practice, exam };
  const { page } = await w.student({ uid: 9701, lessonId: ID, url: URL, seed: { [`u_9701_smarter_world_${ID}`]: save } });
  await page.waitForSelector('[data-di-start]', { timeout: 30000 });

  // ── 0. « تقدّمي » BEFORE the sitting ──
  const progress = async () => page.evaluate(() => ({
    exam: document.querySelector('[data-di-road-step="exam"] b')?.textContent ?? '',
    ready: Number(document.querySelector('[data-di-ready]')?.dataset.diReady),
    next: document.querySelector('[data-di-next-step]')?.dataset.diNextStep,
    rows: Object.fromEntries([...document.querySelectorAll('[data-di-prow]')].map((r) => [r.dataset.diProw, r.textContent])),
  }));
  await page.click('[data-di-progress-open]'); await page.waitForSelector('[data-di-progress]'); await page.waitForTimeout(400);
  const before = await progress();
  expect(before.exam === `4${NB}5` && before.next === 'exam' && (await page.textContent('[data-di-next-step]')).includes('5'), `« تقدّمي » before: four exam levels of five passed, the next thing « اجتز الدرجة 5 » (readiness ${before.ready}%)`);
  expect(Object.keys(before.rows).join() === KEYS.join() && KEYS.every((k) => before.rows[k].includes('لا محاولة بعد')), 'no answer given as in an exam yet: each الكفاءة says « لا محاولة بعد »');
  await shot(page, 'progress-before', { exit: ['[data-di-progress-close]'], sound: true, numbers: true });
  await page.click('[data-di-progress-close]'); await page.waitForSelector('[data-di-start]');

  // ── 1. the hub → « فضاء الامتحان »: level 5 lit ──
  await page.click('[data-di-map]'); await page.waitForSelector('[data-di-space="exam"]');
  await page.click('[data-di-space="exam"]'); await page.waitForSelector('[data-di-ladder="open"]');
  expect(await page.locator('.di-rungs li.is-passed').count() === 4 && await page.locator('.di-rungs li.is-next [data-di-exam-level="5"]').count() === 1, '« فضاء الامتحان »: four levels passed, level 5 lit');
  await shot(page, 'ladder', { exit: ['[data-di-map-close]'], numbers: true });
  await page.click('[data-di-exam-level="5"]'); await page.waitForSelector('[data-xs="read"]'); await page.waitForTimeout(500);

  // ── 2. reading time ──
  const subject = await page.evaluate(() => window.__sitting.subject);
  expect(subject.level === 5 && subject.exercises.length === 3 && subject.exercises.map((e) => e.kind).join() === 'method,rules,wall', `level 5 « ${subject.lesson} »: the method, the divisibility rules, a situation (${subject.total} points, ${subject.minutes} minutes)`);
  expect(await page.locator('.xs-ex').count() === 3 && await page.locator('.xs-root input, .xs-root select').count() === 0, 'reading time: the three exercises are on the sheet, and no answer box exists yet');
  {
    const shown = await page.textContent('.xs-paper');
    const missing = subject.exercises.flatMap((e) => [e.statement, ...e.questions.map((q) => q.text)]).filter((t) => !shown.replace(/\s+/g, ' ').includes(t.replace(/\s+/g, ' ').trim()));
    expect(missing.length === 0, `every statement and every question of the sheet is on screen, word for word${missing.length ? ' — missing: ' + missing.join(' | ') : ''}`);
  }
  expect(await page.evaluate(() => window.__world.getState().paper === true), 'the sitting is silent: paper mode, no music');
  await shot(page, 'read', SHEET_OUT); // the sitting is silent by design (« صامت » on its header): no sound button is asked of it
  await page.click('[data-xs-start]'); await page.waitForSelector('[data-xs="sit"]');

  // ── 3. the sitting: every answer computed from the numbers on the sheet, typed in its own shape ──
  const qs = subject.exercises.flatMap((e) => e.questions);
  const wall = subject.exercises[2];
  const [, n, lo, hi] = wall.statement.match(/ترتيب (\d+) .* ما بين (\d+) و (\d+)/).map(Number);
  const fits = divisorsOf(n).filter((d) => d >= lo && d <= hi);
  const answer = (q) => {
    switch (q.type) {
      case 'stop': return { d: isqrt(q.a), e: isqrt(q.a) + 1 };
      case 'list': return Object.fromEntries(divisorsOf(q.a).map((d, i) => [`d${i}`, d]));
      case 'verdict': {
        // read with the rule: the last digits for 4 and 5, the sum of the digits for 9 — then checked by the division itself
        const byRule = q.b === 4 ? (q.a % 100) % 4 === 0 : q.b === 5 ? [0, 5].includes(q.a % 10) : String(q.a).split('').reduce((s, x) => s + Number(x), 0) % 9 === 0;
        expect(byRule === (q.a % q.b === 0), `the rule of ${q.b} read on ${q.a} agrees with the division`);
        return byRule ? 'yes' : 'no';
      }
      case 'value': return { x: q.text.includes('عدد الإمكانيات') || q.text.includes('ما عدد الإمكانيات') ? fits.length : n / fits.at(-1) };
      default: throw new Error(`unknown question type ${q.type}`);
    }
  };
  for (const [i, e] of subject.exercises.entries()) {
    await page.click(`[data-xs-page="${i}"]`); await page.waitForTimeout(200);
    expect(await page.locator('.xs-paper .xs-ex').count() === 1 && await page.locator('.xs-sheet li').count() === e.questions.length && (await page.textContent('.xs-sheet h3')).includes(e.title), `${e.title} (${e.topic}): its statement beside its answer sheet, ${e.questions.length} answers`);
    for (const q of e.questions) {
      const v = answer(q);
      if (typeof v === 'string') {
        const line = await page.evaluate((id) => document.querySelector(`[data-xs-select="${id}"]`).closest('.xs-line').textContent, q.id);
        expect(line.includes(String(q.a)) && line.includes('القسمة على') && line.includes(String(q.b)), `${q.id}: the verdict is chosen INSIDE its sentence « ${q.a} [يقبل / لا يقبل] القسمة على ${q.b} »`);
        await page.selectOption(`[data-xs-select="${q.id}"]`, v);
      } else {
        const shape = await page.evaluate((id) => [...document.querySelectorAll(`[data-xs-slot^="${id}:"]`)].map((el) => ({ box: Boolean(el.closest('.xs-box')), line: el.closest('.xs-line')?.textContent ?? '', label: el.getAttribute('aria-label') })), q.id);
        expect(shape.length === Object.keys(v).length && shape.every((x) => x.box && x.line), `${q.id} (${q.type}): ${shape.length} box(es), each in the template of the answer`);
        if (q.type === 'stop') check(shape[0].line.includes('²') && shape[0].line.includes('≤') && shape[0].line.includes(String(q.a)), `${q.id}: « [ ]² ≤ ${q.a} < [ ]² » is written as on the exam sheet`);
        if (q.type === 'value') check(/إمكانيات|صفًّا/.test(shape[0].line), `${q.id}: the count has its printed unit (« ${shape[0].line.replace(/\s+/g, ' ').trim().slice(0, 40)} »)`);
        for (const [k, x] of Object.entries(v)) await page.fill(`[data-xs-slot="${q.id}:${k}"]`, String(x));
      }
    }
    await shot(page, `sit-${i + 1}-${e.kind}`, SHEET_OUT);
  }
  expect(await page.locator('.xs-pen, .xs-total, .xs-red, [data-xs-mark]').count() === 0, 'during the sitting there is NO verdict of any kind');
  expect((await page.evaluate(() => window.__posts ?? [])).length === 0, 'nothing is sent before the paper is handed in');
  await page.click('[data-xs-hand]'); await page.waitForSelector('[data-xs-hand-yes]');
  await shot(page, 'confirm', SHEET_OUT);
  await page.click('[data-xs-hand-yes]'); await page.waitForSelector('[data-xs="back"]'); await page.waitForTimeout(400);

  // ── 4. the copy handed back, and what the hand-in sent ──
  const total = Number(await page.getAttribute('[data-xs-total]', 'data-xs-total'));
  expect(total === subject.total, `a full paper: ${total} / ${subject.total}`);
  expect((await page.locator('[data-xs-row]').evaluateAll((els) => els.map((e) => e.dataset.xsMark))).every((m) => m === 'ok'), 'every question carries its red tick');
  {
    const posts = (await page.evaluate(() => window.__posts ?? [])).map((p) => p.body);
    const owed = qs.filter((q) => q.key);
    expect(posts.length === owed.length && owed.length === 5, `the hand-in sends ${posts.length} answers — the five the server can re-compute (the method and the rules), never the situation’s counts`);
    const want = { stop: 'P3', list: 'P3', verdict: 'P4' };
    for (const [k, q] of owed.entries()) {
      const p = posts[k];
      const c = p.claim;
      const v = answer(q);
      const ok = p.context === 'case' && typeof p.attemptId === 'string' && p.learningPoint === `4am_${ID}_${want[q.type]}` && (q.type === 'stop' ? c.kind === 'stop' && c.a === q.a && c.b === v.d : q.type === 'list' ? c.kind === 'divisors' && c.a === q.a && c.b === divisorsOf(q.a).length && [...c.list].sort((x, y) => x - y).join() === divisorsOf(q.a).join() : c.kind === 'divisible' && c.a === q.a && c.b === q.b && c.fits === (v === 'yes'));
      expect(ok, `evidence ${k + 1} (${q.id}, ${q.type}): ${JSON.stringify(p).slice(0, 150)}`);
    }
    expect(new Set(posts.map((p) => p.attemptId)).size === posts.length, 'each evidence has its own attempt id');
    const api = await page.evaluate(() => (window.__api ?? []).filter((x) => x.url.includes('/game-evidence')).map((x) => [x.method, x.url]));
    expect(api.every(([m, u]) => m === 'POST' && u.includes(`/lessons/${ID}/game-evidence`)), `posted to POST /lessons/${ID}/game-evidence`);
  }
  await shot(page, 'back', { exit: ['[data-xs-close]'] });
  await page.click(`[data-xs-row="${qs[0].id}"]`); await page.waitForSelector(`[data-xs-detail="${qs[0].id}"]`);
  expect(await page.locator('[data-xs-help="explain"]').count() === 1 && await page.locator('[data-xs-help="explain"] .katex').count() >= 1, 'a full-mark question shows its model copy, its formula DRAWN');
  await shot(page, 'back-model', { exit: ['[data-xs-close]'] });
  await page.locator('[data-xs-notebook-open]').first().click(); await page.waitForSelector('[data-xs-notebook]');
  expect(await page.locator('[data-xs-notebook] li').count() === 0 && (await page.textContent('[data-xs-notebook]')).includes('ورقة كاملة'), 'the notebook: a full paper, nothing to write in it');
  await shot(page, 'notebook', { exit: ['[data-xs-close]', '[data-xs-finish]'] });
  await page.click('[data-xs-finish]'); await page.waitForSelector('[data-di-promotion]'); await page.waitForTimeout(600);
  {
    const kind = await page.getAttribute('[data-di-promotion]', 'data-di-promotion');
    const ex = await page.evaluate(() => window.__world.getState().exam);
    expect(kind === 'champion' && ex.best[5]?.stars === 3 && ex.best[5].mark === subject.total, `the last level passed with a full paper: the champion’s promotion (${kind}), three stars saved`);
    expect(await page.locator('.di-confetti i').count() > 10 && await page.locator('[data-di-promotion] .di-stars3 .is-on').count() === 3, 'the promotion is a moment of GAME: confetti, three stars');
  }
  await shot(page, 'promotion', { exit: ['[data-di-promo-ladder]', '[data-di-exit]'] });
  await page.click('[data-di-promo-ladder]'); await page.waitForSelector('[data-di-ladder="open"]');
  expect(await page.locator('.di-rungs li.is-passed').count() === 5, 'back on the ladder: the five levels are passed');
  await shot(page, 'ladder-after', { exit: ['[data-di-map-close]'], numbers: true });
  await page.click('[data-di-map-close]'); await page.waitForSelector('[data-di-start]');

  // ── 5. « تقدّمي » AFTER: what the sitting earned ──
  await page.click('[data-di-progress-open]'); await page.waitForSelector('[data-di-progress]'); await page.waitForTimeout(400);
  const after = await progress();
  expect(after.exam === `5${NB}5`, `the road: the exam station reads ${after.exam.replace(/ /g, ' ')} (was ${before.exam.replace(/ /g, ' ')})`);
  expect(after.rows['tariqa-qawasim'].includes('2 صحيحة من 2') && after.rows['qawaid-qisma'].includes('3 صحيحة من 3') && after.rows['jidaa-aamilayn'].includes('لا محاولة بعد'), 'per الكفاءة, the answers given as in an exam: « أين نتوقّف » 2 of 2, « قواعد قابلية القسمة » 3 of 3 — the others untouched');
  expect(after.ready === 100 && after.ready > before.ready, `the readiness counts the ladder and these first tries: ${before.ready}% → ${after.ready}%`);
  expect(after.next !== 'exam', `the next thing is no longer an exam level (« ${after.next} »)`);
  await shot(page, 'progress-after', { exit: ['[data-di-progress-close]'], numbers: true });
  await page.click('[data-di-progress-close]'); await page.waitForSelector('[data-di-start]');
  expect((await page.evaluate(() => window.__world.getState().phase)) === 'title', '« تقدّمي » closes back to the title screen');
  // a reload keeps it
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('[data-di-start]');
  expect((await page.evaluate(() => window.__world.getState().exam.best[5]?.stars)) === 3 && (await page.evaluate(() => window.__world.getState().tally['qawaid-qisma']?.n)) === 3, 'after a reload the ladder and the tally are still there');
  if (PHONE) console.log('    (phone held sideways: the answer sheet may slide inside its box — GAME_WORLD.md « On a phone »)');
});
