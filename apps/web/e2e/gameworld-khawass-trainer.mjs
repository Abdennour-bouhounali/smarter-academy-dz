// « تدرّب » of lesson `khawass-qawasim` (lesson 3), as a STUDENT — copied from lesson 2's gameworld-qawasim-trainer.mjs.
// On the full « خريطة المعارف », four cards are trained — المجموع والفرق, المضاعفات, باقي القسمة, البرهان — six questions
// each, so EVERY kind of question of the lesson's `world/trainer.js` is played through its screen: tap (the gates), true /
// false (game, and exam with its reason), sumDiff (« a ± b = d × [ ] »), multiple (« a × n = d × [ ] »), rest (the division
// then « الباقي = d × [ ] »), proof (three words chosen in their sentence). In each session: a wrong then a right answer
// (the hint), a right one at the first try, two wrong (the written correction, the model sheet when the question has one).
// The right answers are computed HERE from the numbers of the question (a proof's right product: by putting numbers in
// the letters), never taken from the lesson. What is posted as evidence (exam format, first try) is captured and asserted.
// Run (dev server up): [E2E_SIZE=1366x768] node apps/web/e2e/gameworld-khawass-trainer.mjs [outDir]
import { createWalk, lessonUrl, QAWASIM_WORDS, QAWASIM_NUMBERS, TOUCH } from './lib/walk.mjs';

const ID = 'khawass-qawasim';
const URL = lessonUrl('ansab_al_aadad_wal_hisab', ID);
const KEYS = ['jam-wal-farq', 'madaaf', 'baqi-qisma', 'burhan'];
const POINT = { 'jam-wal-farq': 'P1', madaaf: 'P2', 'baqi-qisma': 'P3', burhan: 'P4' };
const CARDS = [
  'khawass',
  'majmu',
  'rappel',
  'khata-aks',
  'mudaaf',
  'mithal-1800',
  'baqi',
  'mithal-735',
  'bila-qisma',
  'burhan',
  'khata-mithal',
  'khulasa',
];
/** The kinds each trained card must show (the plans of world/trainer.js: jam, madaaf, baqi, burhan). */
const TRAIN = {
  majmu: ['tap', 'tf', 'sumDiff'],
  mudaaf: ['tap', 'tf', 'multiple'],
  baqi: ['tap', 'tf', 'rest'],
  burhan: ['tap', 'tf', 'proof'],
};
const w = createWalk('gameworld-khawass-trainer', {
  foreign: QAWASIM_WORDS,
  foreignNumbers: QAWASIM_NUMBERS,
  fontFloor: true,
});
const { expect, check, shot } = w;

/** Is gate value n right for this wave? Computed HERE. */
const gateRight = (x, n) =>
  ({
    missing: () => n * x.b === x.a,
    divides: () => n >= 1 && x.a % n === 0,
    multipleOf: () => n >= 1 && n % x.b === 0,
    divisibleBy: () => n >= 1 && n % x.b === 0,
    remainder: () => n === x.a % x.b,
  })[x.type]();
/** A word of a proof written with × and −, evaluated with numbers in the letters. */
const evalLetters = (text, v) =>
  Function(...Object.keys(v), `return ${text.replace(/×/g, '*').replace(/−/g, '-')};`)(...Object.values(v));
/** The option of a choice slot of a form whose text passes `test`. */
const choiceOf = (q, slot, test) => {
  const t = q.form.lines.flatMap((l) => l.tokens).find((x) => x && x.choice === slot);
  const hit = t.options.filter((o) => test(o.text));
  expect(
    hit.length === 1,
    `proof « ${q.target} », slot ${slot}: exactly one option fits (${t.options.map((o) => o.text).join(' | ')})`,
  );
  return hit[0].id ?? String(hit[0].value);
};
const otherChoice = (q, slot, right) => {
  const t = q.form.lines.flatMap((l) => l.tokens).find((x) => x && x.choice === slot);
  const o = t.options.find((x) => (x.id ?? String(x.value)) !== right);
  return o.id ?? String(o.value);
};
/** The right answer of a question, from its numbers. (A true / false is judged by the statement the lesson wrote: its `truth`.) */
function solve(q) {
  switch (q.kind) {
    case 'tap': {
      const ok = q.options.filter((n) => gateRight(q.wave, n));
      expect(ok.length === 1, `tap « ${q.wave.type} » (${q.options.join(', ')}): exactly one gate is right`);
      return ok[0];
    }
    case 'tf':
      return { truth: q.truth, reason: q.reasons ? q.reasons.findIndex((r) => r.ok) : null };
    case 'sumDiff':
      return { s: (q.a + q.b) / q.d, f: (q.a - q.b) / q.d };
    case 'multiple':
      return { k: (q.a * q.n) / q.d };
    case 'rest': {
      const r = q.a % q.b;
      return { q: Math.floor(q.a / q.b), r, k: r / q.d };
    }
    case 'proof': {
      // the goal, as written on the sheet, and its right product: equal for every number put in the letters
      const goal = q.form.lines[2].tokens[0];
      const tries = [
        { d: 3, p: 7, q: 2, n: 5 },
        { d: 11, p: 4, q: 3, n: 9 },
      ];
      const same = (text) =>
        tries.every((v) => evalLetters(text, v) === evalLetters(goal.replace('a', '(d*p)').replace('b', '(d*q)'), v));
      return {
        start: choiceOf(q, 'start', (t) => t.startsWith('d يقسم') && !/[+−×]/.test(t)),
        k: choiceOf(q, 'k', same),
        nat: choiceOf(q, 'nat', (t) => t.endsWith('عدد طبيعي')),
      };
    }
    default:
      throw new Error(`unknown kind ${q.kind}`);
  }
}
/** A wrong answer of the same shape — one whose claim (when it is evidence) is FALSE. */
function wrongOf(q) {
  const r = solve(q);
  switch (q.kind) {
    case 'tap':
      return q.options.find((n) => n !== r);
    case 'tf':
      return { truth: !r.truth, reason: r.reason };
    case 'sumDiff':
      return { s: r.s + 1, f: r.f };
    case 'multiple':
      return { k: r.k + 1 };
    case 'rest':
      return { q: r.q, r: r.r + 1, k: r.k };
    case 'proof':
      return { ...r, start: otherChoice(q, 'start', r.start) };
    default:
      return null;
  }
}

await w.run(async () => {
  const know = { found: CARDS, read: [], sealed: [], trained: {} };
  const practice = Object.fromEntries(KEYS.map((k) => [`${k}:1`, { stars: 2, best: 800 }]));
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
    know,
  };
  const { page } = await w.student({
    uid: 9811,
    lessonId: ID,
    url: URL,
    seed: { [`u_9811_smarter_world_${ID}`]: save },
  });
  await page.waitForSelector('[data-di-start]', { timeout: 30000 });
  await page.click('[data-di-know-open]');
  await page.waitForSelector('[data-di-kmap="full"]');
  await page.waitForTimeout(700);
  expect(
    (await page.locator('[data-di-knode]').count()) === CARDS.length &&
      (await page.locator('[data-di-knode][data-open="true"]').count()) === CARDS.length,
    `« خريطة المعارف »: the ${CARDS.length} cards of the lesson, all open with the four keys`,
  );
  await shot(page, 'know-full', { exit: ['[data-di-know-close]'], sound: true, numbers: true });

  const tr = () =>
    page.evaluate(() => ({
      q: window.__trainer?.q,
      index: window.__trainer?.index,
      dom: document.querySelector('[data-di-trainer]')?.dataset.diTrainer,
      fb: document.querySelector('[data-di-tr-fb]')?.dataset.diTrFb ?? null,
      fbText: document.querySelector('[data-di-tr-fb]')?.textContent ?? '',
    }));
  const trainerText = () => page.textContent('[data-di-trainer]');
  /** Answers the question on screen with `v`, through its own controls. */
  const reply = async (q, v) => {
    if (await page.locator('[data-di-pgate-go]').count()) await page.click('[data-di-pgate-go]'); // « كتبتُ على ورقتي »
    if (q.kind === 'tap') {
      await page.click(`[data-di-tr-opt="${v}"]`);
      return;
    }
    if (q.kind === 'tf') {
      await page.click(`[data-di-tr-tf="${v.truth}"]`);
      if (q.format === 'exam') {
        await page.click(`[data-di-tr-reason="${v.reason}"]`);
        await page.click('[data-di-tr-check]');
      }
      return;
    }
    for (const [k, x] of Object.entries(v)) {
      if (q.kind === 'proof') await page.selectOption(`[data-di-tr="${k}"]`, x);
      else await page.fill(`[data-di-tr="${k}"]`, String(x));
    }
    await page.click('[data-di-tr-check]');
  };
  const knode = async (id) => {
    const n = page.locator(`[data-di-knode="${id}"]`);
    if (!(await n.isVisible())) await page.click('[data-di-tab="card"]');
    await n.click();
  };

  const allPosts = [];
  for (const card of Object.keys(TRAIN)) {
    await knode(card);
    await page.waitForTimeout(200);
    await page.click('[data-di-know-train]');
    await page.waitForSelector('[data-di-trainer]');
    const seen = new Set();
    const formats = [];
    const sent0 = (await page.evaluate(() => window.__posts ?? [])).length;
    const firstTries = [];
    for (let i = 0; i < 6; i += 1) {
      const t = await tr();
      const { q } = t;
      formats.push(t.dom);
      expect(
        t.index === i && q.format === t.dom,
        `${card} · question ${i + 1}: « ${q.kind} » in the ${q.format} format`,
      );
      const text = await trainerText();
      const nums = q.kind === 'tap' ? [q.wave.a ?? q.wave.b] : q.kind === 'tf' || q.kind === 'proof' ? [] : [q.a];
      check(
        nums.every((x) => text.includes(String(x))),
        `${card} · question ${i + 1}: the screen says the question’s own number${nums.length ? ` (${nums.join(', ')})` : ''}`,
      );
      if (q.format === 'exam') {
        check(
          await page.evaluate(() => window.__world.getState().paper === true),
          `${card} · question ${i + 1}: the exam format is answered in PAPER MODE`,
        );
        if (q.kind !== 'tf') {
          if (await page.locator('[data-di-pgate-go]').count()) {
            await page.click('[data-di-pgate-go]');
            await page.waitForTimeout(1200);
          }
          const shape = await page.evaluate(() =>
            [...document.querySelectorAll('.di-sheet input, .di-sheet select')].map((el) => ({
              inLine: Boolean(el.closest('.di-sheet__line')),
            })),
          );
          expect(
            shape.length > 0 && shape.every((x) => x.inLine),
            `${card} · question ${i + 1}: the answer boxes sit inside the template of the answer (${shape.length} boxes)`,
          );
          const look = () =>
            page.evaluate(() => {
              const b = document.querySelector('[data-di-tr-check]');
              if (!b) return null;
              const r = b.getBoundingClientRect();
              const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
              let op = 1;
              for (let x = b; x; x = x.parentElement) op *= Number(getComputedStyle(x).opacity);
              const m = getComputedStyle(b)
                .backgroundColor.match(/[\d.]+/g)
                .map(Number);
              const alpha = m.length > 3 ? m[3] : 1;
              const lum = (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
              return {
                onTop: Boolean(top && (top === b || b.contains(top))),
                op: Number(op.toFixed(2)),
                bg: getComputedStyle(b).backgroundColor,
                dark: alpha >= 0.6 && lum < 0.5,
                h: Math.round(r.height),
              };
            });
          await page.mouse.move(2, 2);
          const rest = await look();
          await page.hover('[data-di-tr-check]', { force: true });
          const hovered = await look();
          await page.mouse.move(2, 2);
          check(
            rest && rest.onTop && rest.op >= 0.35 && rest.dark && rest.h >= 28,
            `${card} · question ${i + 1} (${q.kind}): the « تحقّق » button is seen on the sheet (${JSON.stringify(rest)})`,
          );
          if (!TOUCH)
            check(
              hovered && hovered.dark,
              `${card} · question ${i + 1} (${q.kind}): under the mouse, « تحقّق » keeps its dark background (hovered: ${hovered?.bg})`,
            );
          const lines = await page.locator('.di-sheet__line').allTextContents();
          if (q.kind === 'sumDiff')
            check(
              lines.length === 2 &&
                lines[0].includes('+') &&
                lines[1].includes('−') &&
                (await page.locator('.di-sheet__line input').count()) === 2,
              `${card}: « a + b = d × [ ] » then « a − b = d × [ ] », one box each`,
            );
          if (q.kind === 'multiple')
            check(
              lines.length === 1 &&
                lines[0].includes('×') &&
                (await page.locator('.di-sheet__line input').count()) === 1,
              `${card}: « a × n = d × [ ] », one box`,
            );
          if (q.kind === 'rest')
            check(
              lines.length === 2 &&
                (await page.locator('.di-sheet__line').first().locator('input').count()) === 2 &&
                lines[1].includes('الباقي'),
              `${card}: « a = b × [ ] + [ ] », then « الباقي = d × [ ] »`,
            );
          if (q.kind === 'proof')
            check(
              (await page.locator('.di-sheet__line select').count()) === 3 && lines[0].includes('نبدأ من'),
              `${card}: the proof is three words chosen INSIDE its sentences (« نبدأ من … »)`,
            );
        }
      }
      if (!seen.has(`${q.kind}:${q.format}`)) {
        seen.add(`${q.kind}:${q.format}`);
        await shot(page, `tr-${card}-${i + 1}-${q.kind}-${q.format}`, { exit: ['[data-di-know-close]'] });
      }
      const plan = i === 0 || i === 2 ? 'wrong-right' : i === 4 ? 'wrong-wrong' : 'right';
      firstTries.push({
        q,
        first: plan === 'right' ? 'right' : 'wrong',
        value: plan === 'right' ? solve(q) : wrongOf(q),
      });
      if (plan === 'right') {
        await reply(q, solve(q));
        await page.waitForTimeout(150);
        expect(
          (await tr()).fb === 'ok',
          `${card} · question ${i + 1} (${q.kind}): the right answer is accepted at once`,
        );
      } else {
        await reply(q, wrongOf(q));
        await page.waitForTimeout(150);
        let f = await tr();
        expect(
          f.fb === 'hint',
          `${card} · question ${i + 1} (${q.kind}): a wrong answer gets a HINT first (« ${f.fbText.trim().slice(0, 70)} »)`,
        );
        if (i === 0 || i === 2) await shot(page, `tr-${card}-hint-${q.kind}`, { exit: ['[data-di-know-close]'] });
        if (plan === 'wrong-right') {
          await reply(q, solve(q));
          await page.waitForTimeout(150);
          f = await tr();
          expect(f.fb === 'ok', `${card} · question ${i + 1} (${q.kind}): …then the right answer is accepted`);
        } else {
          await reply(q, wrongOf(q));
          await page.waitForTimeout(150);
          f = await tr();
          expect(
            f.fb === 'fix' && f.fbText.includes('التصحيح'),
            `${card} · question ${i + 1} (${q.kind}): a second wrong answer gets the written correction`,
          );
          await shot(page, `tr-${card}-fix-${q.kind}`, { exit: ['[data-di-know-close]'] });
          if (await page.locator('[data-di-tr-model]').count()) {
            await page.click('[data-di-tr-model]');
            await page.waitForSelector('[data-di-model]');
            for (let k = 0; k < 12 && (await page.locator('[data-di-model-next]').count()); k += 1)
              await page.click('[data-di-model-next]');
            await shot(page, `tr-${card}-model`, { exit: ['[data-di-model-close]'] });
            await page.click('[data-di-model-close]');
          }
        }
      }
      if (i === 5)
        expect(
          (await page.locator('[data-di-tr-next]').count()) === 1,
          `${card}: after the last answer, « أنهِ التدريب »`,
        );
      await page.click('[data-di-tr-next]');
      await page.waitForTimeout(150);
    }
    expect(
      formats.join(',') === 'game,game,exam,game,exam,exam',
      `${card}: the formats alternate and end on the exam: ${formats.join(', ')}`,
    );
    const kinds = new Set(firstTries.map((x) => x.q.kind));
    expect(
      TRAIN[card].every((k) => kinds.has(k)),
      `${card}: the session asked ${[...kinds].join(', ')}`,
    );
    expect(
      (await page.locator('[data-di-trainer="done"][data-di-tr-stars="1"]').count()) === 1,
      `${card}: three right at the first try of six — 1 star`,
    );
    await shot(page, `tr-${card}-done`, { exit: ['[data-di-know-close]'] });
    expect(
      (await page.evaluate(() => window.__world.getState().know.trained))[card] === 1,
      `${card}: the star is saved on the card`,
    );
    // الكفاءات: the FIRST try of every exam question whose numbers the server can re-compute — right or wrong — is sent;
    // never a true / false, never a proof written with letters, never a second try
    const posts = (await page.evaluate(() => window.__posts ?? [])).slice(sent0).map((p) => p.body);
    const owed = firstTries.filter((x) => x.q.format === 'exam' && ['sumDiff', 'multiple', 'rest'].includes(x.q.kind));
    expect(posts.length === owed.length, `${card}: ${owed.length} answers are sent as evidence (sent ${posts.length})`);
    if (owed.length)
      expect(
        posts.every(
          (p) =>
            p.context === 'trainer' &&
            typeof p.attemptId === 'string' &&
            p.attemptId.length > 6 &&
            p.learningPoint === `4am_${ID}_${POINT[owed[0].q.key]}`,
        ),
        `${card}: each is { attemptId, learningPoint 4am_${ID}_${POINT[owed[0].q.key]}, context « trainer », claim }`,
      );
    for (const [k, p] of posts.entries()) {
      const x = owed[k];
      const c = p.claim;
      const v = x.value;
      const shapeOk = {
        sumDiff: () => c.kind === 'pair' && c.a === x.q.a + x.q.b && c.b === x.q.d && c.e === Number(v.s),
        multiple: () => c.kind === 'pair' && c.a === x.q.a * x.q.n && c.b === x.q.d && c.e === Number(v.k),
        rest: () =>
          c.kind === 'division' && c.a === x.q.a && c.b === x.q.b && c.q === Number(v.q) && c.r === Number(v.r),
      }[x.q.kind]();
      // the verdict the server will compute, computed here: a wrong first try makes a FALSE claim, a right one a TRUE claim
      const truth = { pair: () => c.b * c.e === c.a, division: () => c.b * c.q + c.r === c.a && c.r >= 0 && c.r < c.b }[
        c.kind
      ]();
      expect(
        shapeOk && truth === (x.first === 'right'),
        `${card}: evidence ${k + 1} (${x.q.kind}) carries what he WROTE at the first try — claim ${JSON.stringify(c).slice(0, 90)} — ${truth ? 'true' : 'false'} as his answer was ${x.first}`,
      );
    }
    allPosts.push(...posts);
  }
  expect(
    new Set(allPosts.map((p) => p.attemptId)).size === allPosts.length && allPosts.length === 6,
    `every evidence has its own attempt id (${allPosts.length}: two per card, none for the proof)`,
  );
  await page.click('[data-di-know-close]');
  await page.waitForSelector('[data-di-start]');
  expect(
    (await page.evaluate(() => window.__world.getState().phase)) === 'title',
    '« خريطة المعارف » closes back to the title screen',
  );
});
