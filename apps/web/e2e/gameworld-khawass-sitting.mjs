// « فضاء الامتحان » and « تقدّمي » of lesson `khawass-qawasim` (lesson 3), as a STUDENT — copied from lesson 2's
// gameworld-qawasim-sitting.mjs. « تقدّمي » is read first (four levels passed); then, from the hub's exam space, ONE sitting
// of level 5 « على منوال الامتحان » is ANSWERED from its first question to its copy handed back: the reading time, every
// answer typed in the shape the sheet gives (« a = b × [ ] + [ ] », « … = d × [ ] », a product chosen INSIDE the proof's
// sentence, a count with its printed unit) — the answers computed HERE from the numbers on the sheet. What the hand-in
// posts is captured and its shape asserted; the copy, a question's model copy, the notebook, the promotion, the ladder;
// then « تقدّمي » shows what the sitting earned, and its ✕ leaves.
// Run (dev server up): [E2E_SIZE=1366x768] node apps/web/e2e/gameworld-khawass-sitting.mjs [outDir]
import { createWalk, lessonUrl, PHONE, QAWASIM_WORDS, QAWASIM_NUMBERS } from './lib/walk.mjs';

const ID = 'khawass-qawasim';
const URL = lessonUrl('ansab_al_aadad_wal_hisab', ID);
const KEYS = ['jam-wal-farq', 'madaaf', 'baqi-qisma', 'burhan'];
const NB = '\u00a0/\u00a0';
const w = createWalk('gameworld-khawass-sitting', {
  foreign: QAWASIM_WORDS,
  foreignNumbers: QAWASIM_NUMBERS,
  fontFloor: 1300,
});
const { expect, check, shot } = w;
const SHEET_OUT = { exit: ['[data-xs-quit]', '[data-xs-close]'] };
/** The words of a sentence outside its formulas (`$…$`): what must be read on screen as it is written. */
const words = (t) =>
  t
    .split(/\$[^$]*\$/)
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter((x) => x.length > 2);
/** A proof's product, evaluated with numbers in the letters. */
const evalLetters = (text, v) =>
  Function(...Object.keys(v), `return ${text.replace(/×/g, '*').replace(/−/g, '-')};`)(...Object.values(v));

await w.run(async () => {
  const practice = Object.fromEntries(KEYS.map((k) => [`${k}:1`, { stars: 2, best: 800 }]));
  const one = (mark, total) => ({ stars: 3, mark, total });
  const exam = { best: { 1: one(3, 3), 2: one(5, 5), 3: one(5, 5), 4: one(10, 10) }, fails: {}, weak: {}, sittings: 4 };
  const save = {
    v: 1,
    stage: 8,
    stars: {},
    gems: [],
    keys: KEYS,
    keysEver: KEYS,
    falls: 0,
    flags: {},
    finished: true,
    practice,
    exam,
  };
  const { page } = await w.student({
    uid: 9821,
    lessonId: ID,
    url: URL,
    seed: { [`u_9821_smarter_world_${ID}`]: save },
  });
  await page.waitForSelector('[data-di-start]', { timeout: 30000 });

  // ── 0. « تقدّمي » BEFORE the sitting ──
  const progress = async () =>
    page.evaluate(() => ({
      exam: document.querySelector('[data-di-road-step="exam"] b')?.textContent ?? '',
      ready: Number(document.querySelector('[data-di-ready]')?.dataset.diReady),
      next: document.querySelector('[data-di-next-step]')?.dataset.diNextStep,
      rows: Object.fromEntries(
        [...document.querySelectorAll('[data-di-prow]')].map((r) => [r.dataset.diProw, r.textContent]),
      ),
    }));
  await page.click('[data-di-progress-open]');
  await page.waitForSelector('[data-di-progress]');
  await page.waitForTimeout(400);
  const before = await progress();
  expect(
    before.exam === `4${NB}5` &&
      before.next === 'exam' &&
      (await page.textContent('[data-di-next-step]')).includes('5'),
    `« تقدّمي » before: four exam levels of five passed, the next thing « اجتز الدرجة 5 » (readiness ${before.ready}%; exam=${JSON.stringify(before.exam)} next=${before.next})`,
  );
  expect(
    Object.keys(before.rows).join() === KEYS.join() && KEYS.every((k) => before.rows[k].includes('لا محاولة بعد')),
    'no answer given as in an exam yet: each الكفاءة says « لا محاولة بعد »',
  );
  await shot(page, 'progress-before', { exit: ['[data-di-progress-close]'], sound: true, numbers: true });
  await page.click('[data-di-progress-close]');
  await page.waitForSelector('[data-di-start]');

  // ── 1. the hub → « فضاء الامتحان »: level 5 lit ──
  await page.click('[data-di-map]');
  await page.waitForSelector('[data-di-space="exam"]');
  await page.click('[data-di-space="exam"]');
  await page.waitForSelector('[data-di-ladder="open"]');
  expect(
    (await page.locator('.di-rungs li.is-passed').count()) === 4 &&
      (await page.locator('.di-rungs li.is-next [data-di-exam-level="5"]').count()) === 1,
    '« فضاء الامتحان »: four levels passed, level 5 lit',
  );
  await shot(page, 'ladder', { exit: ['[data-di-map-close]'], numbers: true });
  await page.click('[data-di-exam-level="5"]');
  await page.waitForSelector('[data-xs="read"]');
  await page.waitForTimeout(500);

  // ── 2. reading time ──
  const subject = await page.evaluate(() => window.__sitting.subject);
  expect(
    subject.level === 5 &&
      subject.exercises.length === 4 &&
      subject.exercises.map((e) => e.kind).join() === 'rest,multiple,proof,wall',
    `level 5 « ${subject.lesson} »: the remainder, the multiples, the proof, a situation (${subject.total} points, ${subject.minutes} minutes)`,
  );
  expect(
    (await page.locator('.xs-ex').count()) === 4 &&
      (await page.locator('.xs-root input, .xs-root select').count()) === 0,
    'reading time: the four exercises are on the sheet, and no answer box exists yet',
  );
  {
    const shown = (await page.textContent('.xs-paper')).replace(/\s+/g, ' ');
    const missing = subject.exercises
      .flatMap((e) => [e.statement, ...e.questions.map((q) => q.text)])
      .flatMap(words)
      .filter((t) => !shown.includes(t));
    expect(
      missing.length === 0,
      `every statement and every question of the sheet is on screen, word for word (outside its formulas)${missing.length ? ' — missing: ' + missing.join(' | ') : ''}`,
    );
  }
  expect(
    await page.evaluate(() => window.__world.getState().paper === true),
    'the sitting is silent: paper mode, no music',
  );
  await shot(page, 'read', SHEET_OUT);
  await page.click('[data-xs-start]');
  await page.waitForSelector('[data-xs="sit"]');

  // ── 3. the sitting: every answer computed from the numbers on the sheet, typed in its own shape ──
  const qs = subject.exercises.flatMap((e) => e.questions);
  const wall = subject.exercises[3];
  const [, long, short, piece] = wall.statement
    .match(/طولاهما (\d+) \S+ و (\d+) \S+\..*طول كلّ منها (\d+)/)
    .map(Number);
  const answer = (q) => {
    switch (q.type) {
      case 'division':
        return { q: Math.floor(q.a / q.b), r: q.a % q.b };
      case 'k':
        return { x: q.m / q.d };
      case 'proof': {
        // the product whose value is the goal's for every number put in the letters
        const goal = { sum: 'd*p + d*q', diff: 'd*p - d*q', mult: 'n*d*p' }[q.target];
        const tries = [
          { d: 3, p: 7, q: 2, n: 5 },
          { d: 11, p: 4, q: 3, n: 9 },
        ];
        const opts = q.sentence.find((p) => typeof p !== 'string').choice;
        const hit = opts.filter((o) => tries.every((v) => evalLetters(o.text, v) === evalLetters(goal, v)));
        expect(
          hit.length === 1,
          `${q.id}: exactly one product equals the goal for every number (${opts.map((o) => o.text).join(' | ')})`,
        );
        return hit[0].value;
      }
      case 'value':
        return { x: q.text.includes('معًا') ? (long + short) / piece : (long % short) / piece };
      default:
        throw new Error(`unknown question type ${q.type}`);
    }
  };
  for (const [i, e] of subject.exercises.entries()) {
    await page.click(`[data-xs-page="${i}"]`);
    await page.waitForTimeout(200);
    expect(
      (await page.locator('.xs-paper .xs-ex').count()) === 1 &&
        (await page.locator('.xs-sheet li').count()) === e.questions.length &&
        (await page.textContent('.xs-sheet h3')).includes(e.title),
      `${e.title}: its statement beside its answer sheet, ${e.questions.length} answer(s)`,
    );
    for (const q of e.questions) {
      const v = answer(q);
      if (typeof v === 'string') {
        const line = await page.evaluate(
          (id) => document.querySelector(`[data-xs-select="${id}"]`).closest('.xs-line').textContent,
          q.id,
        );
        expect(line.includes('='), `${q.id}: the product is chosen INSIDE its sentence « … = [ ] »`);
        await page.selectOption(`[data-xs-select="${q.id}"]`, v);
      } else {
        const shape = await page.evaluate(
          (id) =>
            [...document.querySelectorAll(`[data-xs-slot^="${id}:"]`)].map((el) => ({
              box: Boolean(el.closest('.xs-box')),
              line: el.closest('.xs-line')?.textContent ?? '',
            })),
          q.id,
        );
        expect(
          shape.length === Object.keys(v).length && shape.every((x) => x.box && x.line),
          `${q.id} (${q.type}): ${shape.length} box(es), each in the template of the answer`,
        );
        if (q.type === 'division')
          check(
            shape[0].line.includes(String(q.a)) && shape[0].line.includes(String(q.b)) && shape[0].line.includes('+'),
            `${q.id}: « ${q.a} = ${q.b} × [ ] + [ ] » is written as on the exam sheet`,
          );
        if (q.type === 'value')
          check(
            shape[0].line.includes('قطعة'),
            `${q.id}: the count has its printed unit (« ${shape[0].line.replace(/\s+/g, ' ').trim().slice(0, 40)} »)`,
          );
        for (const [k, x] of Object.entries(v)) await page.fill(`[data-xs-slot="${q.id}:${k}"]`, String(x));
      }
    }
    await shot(page, `sit-${i + 1}-${e.kind}`, SHEET_OUT);
  }
  expect(
    (await page.locator('.xs-pen, .xs-total, .xs-red, [data-xs-mark]').count()) === 0,
    'during the sitting there is NO verdict of any kind',
  );
  expect(
    (await page.evaluate(() => window.__posts ?? [])).length === 0,
    'nothing is sent before the paper is handed in',
  );
  await page.click('[data-xs-hand]');
  await page.waitForSelector('[data-xs-hand-yes]');
  await shot(page, 'confirm', SHEET_OUT);
  await page.click('[data-xs-hand-yes]');
  await page.waitForSelector('[data-xs="back"]');
  await page.waitForTimeout(400);

  // ── 4. the copy handed back, and what the hand-in sent ──
  const total = Number(await page.getAttribute('[data-xs-total]', 'data-xs-total'));
  expect(total === subject.total, `a full paper: ${total} / ${subject.total}`);
  expect(
    (await page.locator('[data-xs-row]').evaluateAll((els) => els.map((e) => e.dataset.xsMark))).every(
      (m) => m === 'ok',
    ),
    'every question carries its red tick',
  );
  {
    const posts = (await page.evaluate(() => window.__posts ?? [])).map((p) => p.body);
    const owed = qs.filter((q) => q.key && (q.type === 'division' || q.type === 'k'));
    expect(
      posts.length === owed.length && owed.length === 3,
      `the hand-in sends ${posts.length} answers — the three the server can re-compute (the division, the remainder, the multiple), never the proof or the situation`,
    );
    const want = { 'baqi-qisma': 'P3', madaaf: 'P2' };
    for (const [k, q] of owed.entries()) {
      const p = posts[k];
      const c = p.claim;
      const v = answer(q);
      const ok =
        p.context === 'case' &&
        typeof p.attemptId === 'string' &&
        p.learningPoint === `4am_${ID}_${want[q.key]}` &&
        (q.type === 'division'
          ? c.kind === 'division' && c.a === q.a && c.b === q.b && c.q === v.q && c.r === v.r
          : c.kind === 'pair' && c.a === q.m && c.b === q.d && c.e === v.x);
      expect(ok, `evidence ${k + 1} (${q.id}, ${q.type}): ${JSON.stringify(p).slice(0, 150)}`);
    }
    expect(new Set(posts.map((p) => p.attemptId)).size === posts.length, 'each evidence has its own attempt id');
    const api = await page.evaluate(() =>
      (window.__api ?? []).filter((x) => x.url.includes('/game-evidence')).map((x) => [x.method, x.url]),
    );
    expect(
      api.every(([m, u]) => m === 'POST' && u.includes(`/lessons/${ID}/game-evidence`)),
      `posted to POST /lessons/${ID}/game-evidence`,
    );
  }
  await shot(page, 'back', { exit: ['[data-xs-close]'] });
  await page.click(`[data-xs-row="${qs[0].id}"]`);
  await page.waitForSelector(`[data-xs-detail="${qs[0].id}"]`);
  expect(
    (await page.locator('[data-xs-help="explain"]').count()) === 1 &&
      (await page.locator('[data-xs-help="explain"] .katex').count()) >= 1,
    'a full-mark question shows its model copy, its formula DRAWN',
  );
  await shot(page, 'back-model', { exit: ['[data-xs-close]'] });
  await page.locator('[data-xs-notebook-open]').first().click();
  await page.waitForSelector('[data-xs-notebook]');
  expect(
    (await page.locator('[data-xs-notebook] li').count()) === 0 &&
      (await page.textContent('[data-xs-notebook]')).includes('ورقة كاملة'),
    'the notebook: a full paper, nothing to write in it',
  );
  await shot(page, 'notebook', { exit: ['[data-xs-close]', '[data-xs-finish]'] });
  await page.click('[data-xs-finish]');
  await page.waitForSelector('[data-di-promotion]');
  await page.waitForTimeout(600);
  {
    const kind = await page.getAttribute('[data-di-promotion]', 'data-di-promotion');
    const ex = await page.evaluate(() => window.__world.getState().exam);
    expect(
      kind === 'champion' && ex.best[5]?.stars === 3 && ex.best[5].mark === subject.total,
      `the last level passed with a full paper: the champion’s promotion (${kind}), three stars saved`,
    );
    expect(
      (await page.locator('.di-confetti i').count()) > 10 &&
        (await page.locator('[data-di-promotion] .di-stars3 .is-on').count()) === 3,
      'the promotion is a moment of GAME: confetti, three stars',
    );
  }
  await shot(page, 'promotion', { exit: ['[data-di-promo-ladder]', '[data-di-exit]'] });
  await page.click('[data-di-promo-ladder]');
  await page.waitForSelector('[data-di-ladder="open"]');
  expect(
    (await page.locator('.di-rungs li.is-passed').count()) === 5,
    'back on the ladder: the five levels are passed',
  );
  await shot(page, 'ladder-after', { exit: ['[data-di-map-close]'], numbers: true });
  await page.click('[data-di-map-close]');
  await page.waitForSelector('[data-di-start]');

  // ── 5. « تقدّمي » AFTER: what the sitting earned ──
  await page.click('[data-di-progress-open]');
  await page.waitForSelector('[data-di-progress]');
  await page.waitForTimeout(400);
  const after = await progress();
  expect(
    after.exam === `5${NB}5`,
    `the road: the exam station reads ${after.exam.replace(/ /g, ' ')} (was ${before.exam.replace(/ /g, ' ')})`,
  );
  expect(
    after.rows['baqi-qisma'].includes('2 صحيحة من 2') &&
      /1\D*صحيحة\D*1/.test(after.rows.madaaf) &&
      after.rows['jam-wal-farq'].includes('لا محاولة بعد') &&
      after.rows.burhan.includes('لا محاولة بعد'),
    'per الكفاءة, the answers given as in an exam: « باقي القسمة » 2 of 2, « المضاعفات » 1 of 1 — the others untouched (a proof is not evidence)',
  );
  expect(
    after.ready > before.ready,
    `the readiness counts the ladder and these first tries: ${before.ready}% → ${after.ready}%`,
  );
  expect(after.next !== 'exam', `the next thing is no longer an exam level (« ${after.next} »)`);
  await shot(page, 'progress-after', { exit: ['[data-di-progress-close]'], numbers: true });
  await page.click('[data-di-progress-close]');
  await page.waitForSelector('[data-di-start]');
  expect(
    (await page.evaluate(() => window.__world.getState().phase)) === 'title',
    '« تقدّمي » closes back to the title screen',
  );
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('[data-di-start]');
  expect(
    (await page.evaluate(() => window.__world.getState().exam.best[5]?.stars)) === 3 &&
      (await page.evaluate(() => window.__world.getState().tally['baqi-qisma']?.n)) === 2,
    'after a reload the ladder and the tally are still there',
  );
  if (PHONE)
    console.log('    (phone held sideways: the answer sheet may slide inside its box — GAME_WORLD.md « On a phone »)');
});
