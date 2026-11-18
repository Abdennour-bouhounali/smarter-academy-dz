// « عُدّة الانطلاق » of lessons 2 and 3 (« قواسم عدد طبيعي », « خواص قواسم عدد طبيعي ») — ONE walk of the launch as a STUDENT
// (simulated session, no API), played by launch-kit-qawasim.mjs and launch-kit-khawass.mjs. Since 2026-11-18 the learning net
// gives both lessons the SAME two core tools: A = 4am.m1.r01 (« قاسم عدد طبيعي », the lesson before) then B = 2am.m1.r04
// (« القسمة الإقليدية على أيّ عدد », 2AM). Four students:
//   1. knows everything: four answers (A: write, sentences; B: write, then its level-2 SORT of three equalities — since
//      2026-11-18 a family's level-2 sort is asked first, `families.js › pickForm`), 4 / 4, take-off;
//   2. slips on A's sentences and on B's first equality: B's flag on the line, B's sort, B « تحتاج تثبيتًا » in three answers, the
//      workshop repairs A — and the tool NOT repaired is the one to revise first;
//   3. misses everything: 0 / 4, ONE capsule (the first core tool, A), the door opens — B stays « نبدأ منها », no second lock;
//   4. knows A, misses B: B's workshop (its worked example, the flag again), the capsule of B (its card, its example, the
//      instrument `paper`, two easy questions answered right) — B rises to « تحتاج تثبيتًا », 3 / 4, take-off.
// Answers are COMPUTED from the numbers on screen (the equation, the prompt, the equality of a card), never typed in here.
// At every screenshot: nothing scrolls or leaves its panel (the rules of launch-kit.mjs, plus a sentence on two lines at most,
// a placed card in its box, the boxes above the buttons), and the SOFT checks (printed FAIL, the walk goes on): no raw
// formula, no word of another lesson, no text under 12 px, the launch's ✕ reachable.
import { chromium } from 'playwright';
import { GL_ARGS } from './gpu.mjs';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

export const A = '4am.m1.r01';
export const B = '2am.m1.r04';

/** `ids`: four student ids; `alien`: words of another lesson that must never show (soft); `alienLabel`: that lesson, for the log. */
export async function walkLaunch({ id, outName, ids, alien = [], alienLabel = 'another lesson' }) {
  const LESSON = `${process.env.E2E_BASE || 'http://localhost:5173'}/courses/moyen/4am/ansab_al_aadad_wal_hisab/${id}`;
  const OUT = process.argv[2] || `${tmpdir()}/${outName}`;
  const SIZE = (process.env.E2E_SIZE || '1366x768').split('x').map(Number);
  const PHONE = process.env.E2E_TOUCH === '1' && SIZE[1] <= 500;
  mkdirSync(OUT, { recursive: true });
  const expect = (cond, msg) => {
    if (!cond) {
      console.log('FAIL', msg);
      process.exitCode = 1;
      if (process.env.E2E_SOFT !== '1') throw new Error(msg);
      return;
    }
    console.log('ok  ', msg);
  };
  const browser = await chromium.launch({ args: GL_ARGS });
  const errors = [];
  const seenB = new Set(); // the forms of B the walk met: the 2AM level-2 sort must come up
  let zeroSeen = false; // a card « s = b × 0 + s » (to ACCEPT) was on screen and sorted by its computed box
  let n = 0;
  let page;

  async function student(uid) {
    const ctx = await browser.newContext({
      viewport: { width: SIZE[0], height: SIZE[1] },
      ...(process.env.E2E_TOUCH === '1' ? { hasTouch: true, isMobile: true } : {}),
    });
    await ctx.addInitScript((u) => {
      window.__paperFast = true;
      window.__launchFast = true;
      localStorage.setItem('token', 'qa-fake-token');
      const real = window.fetch.bind(window);
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        if (url.includes('/api/'))
          return new Response(
            JSON.stringify(
              url.includes('/auth/me')
                ? {
                    success: true,
                    user: {
                      id: u,
                      name: 'تلميذ',
                      role: 'student',
                      roles: ['student'],
                      email_verified_at: '2026-09-01T00:00:00Z',
                      emailVerified: true,
                      nameComplete: true,
                      level: '4am',
                      grade: '4am',
                    },
                  }
                : { success: true, data: [] },
            ),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        return real(input, init);
      };
    }, uid);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => {
      errors.push(e.message);
      console.log('pageerror', e.message);
    });
    return p;
  }

  /** Nothing scrolls, nothing leaves the screen or its panel — checked at every screenshot (the rules of launch-kit.mjs). */
  const shot = async (name) => {
    await page.waitForTimeout(350);
    const bad = await page.evaluate((phone) => {
      const out = [];
      const root = document.querySelector('.lk-root');
      if (!root) return ['no launch on screen'];
      for (const el of root.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (
          /(auto|scroll)/.test(cs.overflowY) &&
          el.scrollHeight > el.clientHeight + 2 &&
          !(phone && (el.classList.contains('lk-stage') || el.classList.contains('lk-capbody')))
        )
          out.push(`scrolls: ${el.className}`);
      }
      const stage = root.querySelector('.lk-stage').getBoundingClientRect();
      const bag = root.querySelector('.lk-bag').getBoundingClientRect();
      for (const el of root.querySelectorAll('.lk-head, .lk-bag, .lk-stage, .lk-memo')) {
        const r = el.getBoundingClientRect();
        if (r.top < -1 || r.bottom > window.innerHeight + 1 || r.left < -1 || r.right > window.innerWidth + 1)
          out.push(`leaves the screen: ${el.className}`);
      }
      if (!phone)
        for (const el of root.querySelectorAll(
          '.lk-stage button, .lk-prompt, .lk-equation, .lk-card, .lk-box, .lk-example li, .lk-kcard, .lk-revise, .lk-score, .lk-result h3, .lk-intro > *',
        )) {
          const r = el.getBoundingClientRect();
          if (
            r.height > 0 &&
            (r.top < stage.top - 1 ||
              r.bottom > stage.bottom + 1 ||
              r.left < stage.left - 1 ||
              r.right > stage.right + 1)
          )
            out.push(`out of the stage: ${el.className} « ${el.textContent.slice(0, 24)} »`);
        }
      for (const el of root.querySelectorAll('.lk-tool, .lk-robot')) {
        const r = el.getBoundingClientRect();
        if (r.top < bag.top - 1 || r.bottom > bag.bottom + 1)
          out.push(`out of the bag: ${el.className?.baseVal ?? el.className}`);
      }
      for (const el of root.querySelectorAll('.lk-prompt, .lk-example ol, .lk-revise > div, .lk-kit'))
        if (el.scrollWidth > el.clientWidth + 3 || (!phone && el.scrollHeight > el.clientHeight + 3))
          out.push(`overflows: ${el.className}`);
      // a sentence card: inside its card, on two lines at most
      for (const el of root.querySelectorAll('.lk-card .lk-say')) {
        const r = el.getBoundingClientRect();
        const c = el.closest('.lk-card').getBoundingClientRect();
        const lines = Math.round(
          r.height /
            (parseFloat(getComputedStyle(el).lineHeight) * Number(root.querySelector('.lk-fit').style.zoom || 1)),
        );
        if (r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1)
          out.push('a sentence leaves its card');
        if (lines > 2) out.push(`a sentence takes ${lines} lines`);
      }
      {
        const foot = root.querySelector('.lk-question .lk-qfoot')?.getBoundingClientRect();
        const sort = root.querySelector('.lk-sort')?.getBoundingClientRect();
        if (foot && sort && sort.bottom > foot.top + 1) out.push('the boxes lie under the buttons of the question');
      }
      for (const el of root.querySelectorAll('.lk-chip')) {
        const r = el.getBoundingClientRect();
        const b = el.closest('.lk-box').getBoundingClientRect();
        if (r.left < b.left - 1 || r.right > b.right + 1 || r.bottom > b.bottom + 1)
          out.push('a placed card leaves its box');
      }
      return out;
    }, PHONE);
    if (bad.length) {
      console.log('FAIL at «', name, '»:', [...new Set(bad)].join(' | '));
      process.exitCode = 1;
      if (process.env.E2E_SOFT !== '1') throw new Error(`layout at ${name}`);
    }
    await soft(name);
    n += 1;
    await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${name}.png` });
  };
  /** SOFT checks of every screen (printed FAIL, the walk goes on): no raw formula, no word of another lesson, no text under 12 px, the ✕. */
  async function soft(name) {
    const t = await page.evaluate((words) => {
      const root = document.querySelector('.lk-root');
      const raw = [];
      const tiny = [];
      let all = '';
      const zoomOf = (el) => {
        let z = 1;
        for (let x = el; x && x.nodeType === 1; x = x.parentElement) z *= parseFloat(getComputedStyle(x).zoom) || 1;
        return z;
      };
      const wk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let x = wk.nextNode(); x; x = wk.nextNode()) {
        const p = x.parentElement;
        if (!p || !x.nodeValue.trim() || p.closest('script, style, .katex-mathml')) continue;
        const r = p.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1 || r.bottom < 0 || r.top > innerHeight) continue;
        const cs = getComputedStyle(p);
        if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
        all += ` ${x.nodeValue}`;
        if (!p.closest('.katex') && /\$|\\[a-zA-Z]{2,}/.test(x.nodeValue)) raw.push(x.nodeValue.trim().slice(0, 40));
        if (!p.closest('.katex') && !p.closest('svg')) {
          const px = parseFloat(cs.fontSize) * zoomOf(p);
          if (px < 11.5)
            tiny.push(
              `${p.tagName.toLowerCase()}.${String(p.className).split(' ')[0]} ${px.toFixed(1)}px « ${x.nodeValue.trim().slice(0, 20)} »`,
            );
        }
      }
      const xb = document.querySelector('[data-lk-close]');
      let exit = false;
      if (xb) {
        const r = xb.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        exit =
          r.width > 0 && r.right <= innerWidth + 1 && r.top >= -1 && Boolean(top && (top === xb || xb.contains(top)));
      }
      return { raw: [...new Set(raw)], tiny: [...new Set(tiny)], words: words.filter((w) => all.includes(w)), exit };
    }, alien);
    const say = (ok, msg) => {
      if (ok) console.log('ok  ', msg);
      else {
        console.log('FAIL', msg);
        process.exitCode = 1;
      }
    };
    say(t.raw.length === 0, `${name}: no raw formula on screen${t.raw.length ? ' — ' + t.raw.join(' | ') : ''}`);
    if (alien.length)
      say(
        t.words.length === 0,
        `${name}: nothing of ${alienLabel} on screen${t.words.length ? ' — ' + t.words.join(', ') : ''}`,
      );
    say(
      t.tiny.length === 0,
      `${name}: no text under 12 px${t.tiny.length ? ' — ' + t.tiny.slice(0, 6).join(' | ') : ''}`,
    );
    say(t.exit, `${name}: the launch’s ✕ is on screen and a click reaches it`);
  }
  const px = (sel) =>
    page.evaluate((s) => {
      const el = document.querySelector(s);
      const z = Number(document.querySelector('.lk-fit').style.zoom || 1);
      return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * z) : 0;
    }, sel);
  const cur = () => page.evaluate(() => window.__launch.cur);
  const tool = async (item) => ({
    band: await page.getAttribute(`[data-lk-tool="${item}"]`, 'data-lk-band'),
    seg: await page.getAttribute(`[data-lk-tool="${item}"]`, 'data-lk-segments'),
  });
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const bands = () => page.locator('[data-lk-kcard]').evaluateAll((els) => els.map((e) => e.dataset.lkBand).join());
  const kcard = (item) => page.textContent(`[data-lk-kcard="${item}"]`);
  const kit = (uid) =>
    page.evaluate((u) => JSON.parse(localStorage.getItem(`u_${u}_smarter_launch_kit`) ?? 'null'), uid);
  /** What the question shows: the numbers of the equation to complete, the sentence of the prompt. */
  const onScreen = () =>
    page.evaluate(() => ({
      eq: [...document.querySelectorAll('.lk-question .lk-equation > b')].map((b) => b.textContent.trim()),
      prompt: document.querySelector('.lk-question .lk-prompt')?.textContent ?? '',
    }));
  /** The box an equality card « $a = b \times q ± r$ » belongs in, computed apart: THE Euclidean division of a by b? */
  const euclid = (text) => {
    const m = /^\$(\d+) = (\d+) \\times (\d+) ([+-]) (\d+)\$$/.exec(text);
    if (!m) return null;
    const [a, b, k, r] = [m[1], m[2], m[3], m[5]].map(Number);
    return m[4] === '+' && a === b * k + r && r < b ? 'yes' : 'no';
  };
  const type = async (v) => {
    for (const d of String(v)) await page.click(`[data-lk-key="${d}"]`);
  };

  /** Fills the answer of the question on screen — right or wrong — with real taps and drags, WITHOUT handing it in. */
  async function fill(right) {
    const { q } = await cur();
    if (q.item === B) seenB.add(`${q.level}:${q.form}`);
    if (q.gesture === 'write') {
      const { eq } = await onScreen();
      const a = Number(eq[0]);
      const b = Number(eq[2]);
      if (a !== q.a || b !== q.b) expect(false, `the equation on screen is the question asked (${eq.join(' ')})`);
      const tq = Math.floor(a / b);
      const tr = a % b;
      if (!(await page.locator('[data-lk-slot="r"]').count())) await type(right ? tq : tq + 1);
      else {
        // wrong: a TRUE equality whose remainder is too big (« rest-too-big »)
        await type(right ? tq : tq - 1);
        await page.click('[data-lk-slot="r"]');
        await type(right ? tr : tr + b);
      }
    } else if (q.gesture === 'sort') {
      for (const c of q.cards) {
        const bin = euclid(c.text) ?? c.bin; // an equality is judged here; a number or a sentence keeps its box
        if (bin !== c.bin) expect(false, `the box of « ${c.text} », computed apart, is the game's (${bin} / ${c.bin})`);
        if (/\\times 0 \+/.test(c.text)) {
          zeroSeen = true;
          if (bin !== 'yes')
            expect(false, `a quotient 0 is THE Euclidean division of a smaller number (« ${c.text} »)`);
        }
        await page.click(`[data-lk-send="${right ? bin : bin === 'yes' ? 'no' : 'yes'}"]`);
      }
    } else {
      const [a, b] = (await onScreen()).prompt.match(/\d+/g).map(Number); // « العدد a … مضاعف للعدد b لا يتجاوز a »
      const target = Math.floor(a / b) * b;
      const goal = right ? target : target + b <= q.max ? target + b : a + 1; // wrong: one jump too far, still on the line
      const box = await page.locator('[data-lk-line]').boundingBox();
      const k = Math.min(box.width / 940, box.height / 250);
      const ox = box.x + (box.width - 940 * k) / 2;
      const oy = box.y + (box.height - 250 * k) / 2;
      const at = (v) => ({ x: ox + (46 + (v / q.max) * 848) * k, y: oy + 168 * k });
      const to = at(goal);
      const from = at(0);
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      await page.mouse.move((from.x + to.x) / 2, to.y, { steps: 5 });
      await page.mouse.move(to.x, to.y, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(150); // let the last move be drawn before the value is read
      const got = Number(await page.getAttribute('[data-lk-line]', 'data-lk-x'));
      if (got !== goal || q.a !== a || q.b !== b)
        expect(false, `the flag follows the hand (asked ${goal}, got ${got})`);
    }
    return q;
  }
  const hand = async () => {
    await page.click('[data-lk-done]');
  };
  const settle = async () => {
    await page.waitForFunction(() => !document.querySelector('[data-lk-signal]'), null, { timeout: 5000 });
    await page.waitForTimeout(150);
  };
  const answer = async (right) => {
    const q = await fill(right);
    await hand();
    await settle();
    return q;
  };
  const open = async (uid) => {
    page = await student(uid);
    await page.goto(LESSON, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-di-start]');
    await page.click('[data-di-start]');
    await page.waitForSelector(`[data-launch-kit="${id}"]`);
  };
  const begin = async () => {
    await page.click('[data-lk-start]');
    await page.waitForSelector('[data-lk-question]');
  };
  const takeOff = async () => {
    await page.click('[data-lk-go]');
    await page.waitForFunction(
      () => !document.querySelector('[data-launch-kit]') && window.__world.getState().phase !== 'title',
      null,
      { timeout: 15000 },
    );
  };
  /** B's level-1 equality: a two-digit divisor (11–19), a quotient of 2 to 5. */
  const easyB = (q) => q.b >= 11 && q.b <= 19 && Math.floor(q.a / q.b) >= 2 && Math.floor(q.a / q.b) <= 5;
  /** B's level-2 sort: three EQUALITIES with a divisor of 12–25, each one's box computable from its own numbers. */
  const sortB = (q) =>
    q.form === 'sort' &&
    q.cards.length === 3 &&
    q.cards.every((c) => {
      const m = /^\$\d+ = (\d+) \\times \d+ [+-] \d+\$$/.exec(c.text);
      return m && Number(m[1]) >= 12 && Number(m[1]) <= 25;
    });

  // ══ 1. a student who knows: the bag holds TWO core tools; four answers charge both; take-off ══
  await open(ids[0]);
  expect(
    (await page.evaluate(() => window.__world.getState().phase)) === 'title',
    'the first « ابدأ » opens the launch: the world has not started',
  );
  expect(
    (
      await page
        .locator('[data-lk-tool]')
        .evaluateAll((els) => els.map((e) => `${e.dataset.lkTool}:${e.dataset.lkBand}:${e.dataset.lkSegments}`))
    ).join() === `${A}:waiting:0,${B}:waiting:0`,
    'the bag holds the TWO tools the learning net gives: the الكفاءة of the lesson before, then the 2AM division, both empty',
  );
  {
    const t = await page.textContent('[data-lk-bag]');
    expect(
      t.includes('قاسم عدد طبيعي') &&
        t.includes('القسمة الإقليدية على أيّ عدد') &&
        t.includes('من السنة الثانية متوسط'),
      'each tool is named in the student’s words, the 2AM one with the year it comes from',
    );
  }
  await shot('bag');
  await begin();
  let q = (await cur()).q;
  expect(
    q.item === A && q.level === 1 && q.gesture === 'write' && q.a <= 25 && q.a % q.b === 0,
    `the first question is a very easy one: the equality that shows a divisor (${q.a} = ${q.b} × ▢)`,
  );
  expect(
    (await page.locator('[data-lk-slot]').count()) === 1 && (await page.locator('[data-lk-done]').isDisabled()),
    'ONE box to write — no box for a remainder; « تمّ » waits for it',
  );
  console.log('    text on screen (px): prompt', await px('.lk-prompt'), '· equation', await px('.lk-equation'));
  expect((await px('.lk-prompt')) >= (PHONE ? 15 : 19), 'the question is comfortable to read');
  await fill(true);
  await shot('write');
  await hand();
  await page.waitForSelector('[data-lk-signal="good"]');
  expect((await tool(A)).seg === '1', 'a right answer lights one segment of the tool at once');
  await settle();
  q = (await cur()).q;
  expect(
    q.item === A && q.level === 2 && q.form === 'sentences' && q.cards.every((c) => c.say),
    'then a harder one, by another gesture: three SENTENCES to sort into « صحيحة » / « خاطئة »',
  );
  expect(
    (await page.textContent('[data-lk-card]')).trim() === q.cards[0].text &&
      (await page.getAttribute('[data-lk-card] .lk-say', 'dir')) === 'rtl',
    `the card is the sentence itself, written right-to-left (« ${q.cards[0].text} »)`,
  );
  console.log(
    '    text on screen (px): sentence',
    await px('.lk-card .lk-say'),
    '· box',
    await px('.lk-box__door strong'),
  );
  expect((await px('.lk-card .lk-say')) >= (PHONE ? 13 : 17), 'a sentence card is comfortable to read');
  await shot('sentences');
  await page.click(`[data-lk-send="${q.cards[0].bin}"]`);
  await page.click(`[data-lk-send="${q.cards[1].bin}"]`);
  await shot('sentences-placed');
  await page.click(`[data-lk-send="${q.cards[2].bin}"]`);
  await hand();
  await settle();
  expect(same(await tool(A), { band: 'solid', seg: '2' }), 'two right answers: the first tool is « ثابتة »');
  q = (await cur()).q;
  expect(
    q.item === B && q.level === 1 && q.gesture === 'write' && easyB(q),
    `then the second tool, the 2AM division, from an easy one: « ${q.a} = ${q.b} × ▢ + ▢ » — a two-digit divisor`,
  );
  expect(
    (await page.locator('[data-lk-slot]').count()) === 2 && (await page.locator('[data-lk-done]').isDisabled()),
    'TWO boxes to write: the quotient and the remainder; « تمّ » waits for both',
  );
  await fill(true);
  await shot('b-write');
  await hand();
  await page.waitForSelector('[data-lk-signal="good"]');
  expect((await tool(B)).seg === '1', 'a right division lights one segment of the second tool');
  await settle();
  q = (await cur()).q;
  expect(
    q.item === B && q.level === 2 && q.gesture === 'sort' && sortB(q),
    `then a harder one, by another gesture: three equalities to sort — is each THE Euclidean division? (${q.cards.map((c) => c.text).join(' · ')})`,
  );
  await shot('b-sort');
  await fill(true);
  await shot('b-sort-placed');
  await hand();
  await settle();
  await page.waitForSelector('[data-lk-result]');
  expect(
    (await page.getAttribute('[data-lk-score]', 'data-lk-score')) === '4/4' &&
      same(await tool(A), { band: 'solid', seg: '2' }) &&
      same(await tool(B), { band: 'solid', seg: '2' }),
    'four right answers: 4 / 4, both tools « ثابتة » — the game asked nothing more',
  );
  expect(
    (await page.locator('[data-lk-go]').count()) === 1 && (await page.locator('[data-lk-gate]').count()) === 0,
    'the take-off is open',
  );
  await shot('result-solid');
  {
    const k = await kit(ids[0]);
    expect(
      k.items[A].band === 'solid' &&
        k.items[B].band === 'solid' &&
        k.lessons[id].tries === 1 &&
        k.lessons[id].last.percent === 100,
      'the result is written in the student’s toolbox: both tools, 100, one try',
    );
  }
  await takeOff();
  expect(true, 'take-off: the launch closes and the world of the lesson starts');

  // ══ 2. a student who slips: A's sentences, B's first equality — the flag, two « تحتاج تثبيتًا », the workshop on A ══
  await open(ids[1]);
  await begin();
  await answer(true);
  await fill(false);
  // the signal lasts a moment: an observer set BEFORE the answer is handed in keeps what it said
  await page.evaluate(() => {
    window.__said = null;
    new MutationObserver(() => {
      const el = document.querySelector('[data-lk-signal="later"]');
      if (el && !window.__said)
        window.__said = { signal: el.textContent, stage: document.querySelector('.lk-stage').textContent };
    }).observe(document.body, { childList: true, subtree: true, attributes: true });
  });
  await hand();
  {
    const said = await (await page.waitForFunction(() => window.__said)).jsonValue();
    expect(
      said.signal.includes('سنعود إليه') && !said.stage.includes('خطأ'),
      'a miss says « سنعود إليه » — never « wrong », never the right answer',
    );
  }
  await settle();
  expect(
    same(await tool(A), { band: 'consolidate', seg: '1' }),
    'one right, one missed: the first tool is « تحتاج تثبيتًا »',
  );
  q = (await cur()).q;
  expect(
    q.item === B && q.level === 1 && q.gesture === 'write',
    'the workshop waits: the second tool is measured first (stations before the workshop)',
  );
  await answer(false);
  q = (await cur()).q;
  expect(
    q.item === B && q.level === 1 && q.gesture === 'place' && q.b >= 11 && q.b <= 15 && q.max === 60,
    `a tool is never judged on one answer: a second easy one, by another gesture — the flag on the greatest multiple of ${q.b} not beyond ${q.a}`,
  );
  await fill(true);
  await shot('b-place');
  await hand();
  await page.waitForSelector('[data-lk-signal="good"]');
  await settle();
  q = (await cur()).q;
  expect(
    q.item === B && q.level === 2 && q.gesture === 'sort' && sortB(q),
    'missed then right: a third question, the harder one — the sort of three equalities',
  );
  await answer(true);
  expect(
    same(await tool(B), { band: 'consolidate', seg: '1' }),
    'missed, then right twice: the 2AM division is « تحتاج تثبيتًا » — three answers, never one',
  );
  await page.waitForSelector(`[data-lk-example="${A}"]`);
  expect(
    (await page.textContent('.lk-stage')).includes('انتبه'),
    'the workshop opens on the FIRST tool (both are « تحتاج تثبيتًا »), on the mistake its answer showed',
  );
  await shot('workshop-mistake');
  while (await page.locator('[data-lk-step-next]').count()) await page.click('[data-lk-step-next]');
  await shot('workshop-example');
  await page.click('[data-lk-try]');
  await page.waitForSelector('[data-lk-qphase="workshop"]');
  q = (await cur()).q;
  expect(
    q.item === A && q.level === 2 && q.form === 'sentences',
    'after the worked example, two questions LIKE the one he missed: sentences again, on other numbers',
  );
  await shot('workshop-question');
  await answer(true);
  await answer(true);
  await page.waitForSelector('[data-lk-result]');
  expect(
    (await page.getAttribute('[data-lk-score]', 'data-lk-score')) === '2/4' &&
      (await bands()) === 'consolidate,consolidate' &&
      (await kcard(A)).includes('أُصلحت الآن') &&
      !(await kcard(B)).includes('أُصلحت الآن') &&
      (await page.locator('[data-lk-go]').count()) === 1,
    'repaired, the first tool keeps « تحتاج تثبيتًا »: 2 / 4 — and the door is open',
  );
  expect(
    (await page.getAttribute('[data-lk-revise]', 'data-lk-revise')) === B &&
      (await page.textContent('[data-lk-revise]')).includes('حصر حاصل القسمة'),
    'what to revise first is the tool NOT repaired: the 2AM lesson of the division',
  );
  await shot('result-repaired');

  // ══ 3. a student who misses everything: ONE capsule — the first core tool — then the door opens whatever he answers ══
  await open(ids[2]);
  await begin();
  await answer(false);
  q = (await cur()).q;
  expect(
    q.item === A && q.level === 1 && q.form === 'pick',
    'a tool is never judged on one answer: a second easy question, by another gesture — numbers to sort',
  );
  await shot('pick-easy');
  await answer(false);
  expect(same(await tool(A), { band: 'start', seg: '0' }), 'two easy misses: the first tool is « نبدأ منها »');
  q = (await cur()).q;
  expect(q.item === B && q.level === 1 && q.gesture === 'write', 'then the second tool is measured too');
  await answer(false);
  q = (await cur()).q;
  expect(q.item === B && q.gesture === 'place', 'its second easy question: the flag');
  await fill(false);
  await shot('b-place-missed');
  await hand();
  await settle();
  expect(same(await tool(B), { band: 'start', seg: '0' }), 'two easy misses: the 2AM division is « نبدأ منها » too');
  await page.waitForSelector(`[data-lk-example="${A}"]`);
  expect(true, 'ONE workshop: the first tool at « نبدأ منها »');
  while (await page.locator('[data-lk-step-next]').count()) await page.click('[data-lk-step-next]');
  await page.click('[data-lk-try]');
  await page.waitForSelector('[data-lk-qphase="workshop"]');
  await answer(false);
  await answer(false);
  await page.waitForSelector('[data-lk-result]');
  expect(
    (await page.getAttribute('[data-lk-score]', 'data-lk-score')) === '0/4' &&
      (await bands()) === 'start,start' &&
      (await page.locator('[data-lk-go]').count()) === 0 &&
      (await page.getAttribute('[data-lk-gate]', 'data-lk-gate')) === A,
    'everything missed: 0 / 4 — the take-off is replaced by ONE capsule, the one of the first core tool',
  );
  await shot('gate');
  await page.click('[data-lk-capsule-start]');
  await page.waitForSelector('[data-lk-capsule-step="card"]');
  expect(
    (await page.locator('[data-lk-capsule-card] li').count()) === 4,
    'the capsule opens on the card of the tool (four lines)',
  );
  await shot('capsule-card');
  await page.click('[data-lk-capsule-next]');
  await page.waitForSelector('[data-lk-capsule-step="example"]');
  for (let i = 0; i < 2; i += 1) await page.click('[data-lk-capsule-next]');
  expect(
    (await page.locator('[data-lk-step]').count()) === 3,
    'then a worked example in three steps: the division, its remainder, the conclusion',
  );
  await shot('capsule-example');
  await page.click('[data-lk-capsule-next]');
  await page.waitForSelector('[data-lk-capsule-step="lab"]');
  await shot('capsule-lab');
  await page.click('[data-lk-capsule-lab]');
  await page.waitForSelector('[data-lesson-lab]');
  expect(
    (await page.getAttribute('[data-lesson-lab]', 'data-ll-tool-on')) === 'rows',
    'then the instrument of the tool in the lab: the rows of the division, with his own numbers',
  );
  n += 1;
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-capsule-instrument.png` });
  await page.click('[data-ll-close]');
  await page.waitForFunction(() => !document.querySelector('[data-lesson-lab]'));
  await page.click('[data-lk-capsule-next]');
  await page.waitForSelector('[data-lk-qphase="capsule"]');
  await answer(false);
  await answer(false);
  await page.waitForSelector('[data-lk-capsule-end="done"]');
  expect(
    (await page.locator('[data-lk-go]').count()) === 1 && (await page.locator('[data-lk-gate]').count()) === 0,
    'both capsule answers missed — and the door is OPEN: the second tool at « نبدأ منها » never locks it again',
  );
  expect(
    (await page.getAttribute(`[data-lk-kcard="${A}"]`, 'data-lk-band')) === 'start' &&
      (await kcard(A)).includes('كبسولة منجزة') &&
      (await page.getAttribute(`[data-lk-kcard="${B}"]`, 'data-lk-band')) === 'start' &&
      !(await kcard(B)).includes('كبسولة منجزة'),
    'the first tool stays « نبدأ منها », flagged « كبسولة منجزة »; the second stays « نبدأ منها », no capsule: nothing is pretended',
  );
  expect(
    (await page.textContent('[data-lk-revise]')).includes('التعرّف على قاسم لعدد طبيعي'),
    'what to revise is ONE lesson: the lesson of the first tool (« التعرّف على قاسم لعدد طبيعي »)',
  );
  {
    const k = await kit(ids[2]);
    expect(
      k.items[A].capsule === true && !k.items[B].capsule && k.lessons[id].tries === 1,
      'the toolbox remembers ONE capsule; it is not a new try',
    );
  }
  await shot('capsule-end');

  // ══ 4. a student who knows the first tool and misses the 2AM division: ITS workshop, ITS capsule, answered right ══
  await open(ids[3]);
  await begin();
  await answer(true);
  await answer(true);
  q = (await cur()).q;
  expect(q.item === B && q.gesture === 'write', 'the first tool charged, the second is asked');
  await answer(false);
  await answer(false);
  expect(
    same(await tool(A), { band: 'solid', seg: '2' }) && same(await tool(B), { band: 'start', seg: '0' }),
    'the first tool « ثابتة », the 2AM division « نبدأ منها »',
  );
  await page.waitForSelector(`[data-lk-example="${B}"]`);
  expect(
    (await page.textContent('.lk-example__lead')).includes('لا يتجاوز العدد'),
    'the workshop of the 2AM division opens on the mistake of the flag: the multiple does not go beyond the number',
  );
  await shot('b-workshop-mistake');
  while (await page.locator('[data-lk-step-next]').count()) await page.click('[data-lk-step-next]');
  expect(
    (await page.locator('[data-lk-step]').count()) === 3 && (await page.locator('[data-lk-try]').count()) === 1,
    'its worked example, revealed step by step: the greatest multiple, the remainder, the equality',
  );
  await shot('b-workshop-example');
  await page.click('[data-lk-try]');
  await page.waitForSelector('[data-lk-qphase="workshop"]');
  q = (await cur()).q;
  expect(
    q.item === B && q.level === 1 && q.gesture === 'place',
    'then two questions LIKE the one he missed: the flag again',
  );
  await fill(false);
  await shot('b-workshop-place');
  await hand();
  await settle();
  await answer(false);
  await page.waitForSelector('[data-lk-result]');
  expect(
    (await page.getAttribute('[data-lk-score]', 'data-lk-score')) === '2/4' &&
      (await page.locator('[data-lk-go]').count()) === 0 &&
      (await page.getAttribute('[data-lk-gate]', 'data-lk-gate')) === B,
    '2 / 4 — and the door asks the capsule of the 2AM division: a core tool left at « نبدأ منها »',
  );
  await shot('b-gate');
  await page.click('[data-lk-capsule-start]');
  await page.waitForSelector('[data-lk-capsule-step="card"]');
  expect(
    (await page.locator('[data-lk-capsule-card] li').count()) === 4 &&
      (await page.textContent('[data-lk-capsule-card]')).includes('الحاصل 0'),
    'its card: four lines — the quotient 0 of a smaller number among them',
  );
  await shot('b-capsule-card');
  await page.click('[data-lk-capsule-next]');
  await page.waitForSelector('[data-lk-capsule-step="example"]');
  {
    const len = await page.evaluate(() => window.__launch.cap.ex.steps.length);
    for (let i = 1; i < len; i += 1) await page.click('[data-lk-capsule-next]');
    expect(
      len === 3 && (await page.locator('[data-lk-step]').count()) === len,
      `then its worked example, revealed step by step (${len} steps)`,
    );
  }
  await shot('b-capsule-example');
  await page.click('[data-lk-capsule-next]');
  await page.waitForSelector('[data-lk-capsule-step="lab"]');
  await shot('b-capsule-lab');
  await page.click('[data-lk-capsule-lab]');
  await page.waitForSelector('[data-lesson-lab]');
  expect(
    (await page.getAttribute('[data-lesson-lab]', 'data-ll-tool-on')) === 'paper',
    'then its instrument in the lab: the division on paper, with his own numbers',
  );
  n += 1;
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-b-capsule-instrument.png` });
  await page.click('[data-ll-close]');
  await page.waitForFunction(() => !document.querySelector('[data-lesson-lab]'));
  await page.click('[data-lk-capsule-next]');
  await page.waitForSelector('[data-lk-qphase="capsule"]');
  for (let i = 0; i < 2; i += 1) {
    q = (await cur()).q;
    expect(
      q.item === B && q.level === 1 && ['write', 'place'].includes(q.gesture),
      `capsule question ${i + 1}: an easy one of the 2AM division (${q.gesture})`,
    );
    await fill(true);
    await shot(`b-capsule-${q.gesture}`);
    await hand();
    await settle();
  }
  await page.waitForSelector('[data-lk-capsule-end="repaired"]');
  expect(
    (await page.locator('[data-lk-go]').count()) === 1 &&
      (await page.locator('[data-lk-gate]').count()) === 0 &&
      (await page.getAttribute('[data-lk-score]', 'data-lk-score')) === '3/4' &&
      (await page.getAttribute(`[data-lk-kcard="${B}"]`, 'data-lk-band')) === 'consolidate' &&
      (await kcard(B)).includes('أُصلحت الآن'),
    'both capsule answers right: the 2AM division rises to « تحتاج تثبيتًا » (« أُصلحت الآن »), 3 / 4, the door open',
  );
  expect(
    (await page.getAttribute('[data-lk-revise]', 'data-lk-revise')) === B &&
      (await page.textContent('[data-lk-revise]')).includes('حصر حاصل القسمة'),
    'what to revise: the 2AM lesson of the division',
  );
  {
    const k = await kit(ids[3]);
    expect(
      k.items[B].band === 'consolidate' &&
        k.items[B].repaired === true &&
        k.items[B].capsule === true &&
        k.items[A].band === 'solid' &&
        k.lessons[id].tries === 1,
      'the toolbox: the division repaired by its capsule, the first tool « ثابتة », one try',
    );
  }
  await shot('b-capsule-end');
  await takeOff();
  expect(true, 'take-off after the capsule: the world of the lesson starts');

  expect(seenB.has('2:sort'), 'the 2AM level-2 sort was asked in a launch (it opens level 2 since 2026-11-18)');
  if (!zeroSeen)
    console.log(
      'note  no card « s = b × 0 + s » came up in the two sorts of this run (one shape in five has none): re-run to see it',
    );
  expect(errors.length === 0, `no page error (${errors.length})`);
  await browser.close();
  console.log(process.exitCode ? 'FAILED' : `PASSED — screenshots in ${OUT}`);
}
