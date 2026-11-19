// « أرخبيل القواسم: سوق الزهور » — walk of the game world of lesson `qasim-mushtarak-akbar` (lesson 4) as a STUDENT: its
// own story in the unit's world, PLAYED through its screens from the title to the end screen. Its four forges open on four
// experiments of their own kind (GAME_WORLD.md « استكشف », spec shapes): `common` with `crown: false` (a pile of planks
// shelved by what each does on the twin gaps, then the count of the shelf of both), `summit` (free tries on a line of
// lengths, the « outside the shorter gap? » prediction, the descent through the planks of the shorter gap to the crown,
// then « must the shorter ones be tried? »), `deal` (the florist's roses and lilies dealt into vases, then the most vases
// and what one holds), `nest` (the longest plank GIVEN; each probe judged by looking at it alone). In each: a wrong
// prediction and right ones, what the drawing shows checked against the walk's own arithmetic, a false rule refuted by the
// mirror on HIS evidence, the attacks, the seal, the last step typed wrong then right, the tablet.
// The ✕ is CLICKED twice — in the world (island B) and inside a forge (the first experiment) — and each time he comes
// back where he was: the same island with its bridge built; the same mirror, its experiment from its first plank.
// Then the gate dash (lanes computed here from each sentence), the bridges the keys read, the stone's baskets (a wrong
// pick, then the right set), the store of the last bridge (a wrong shelf, wrong divisions, the price, its way out) and the
// market.
// At EVERY screenshot (lib/walk.mjs › shot): nothing scrolls / is cut / leaves the screen, no raw LaTeX, formulas left to
// right on one line, no word or number of lessons 1–3 (nor of the 1AM / 2AM lessons of the world), a way out reachable,
// no text under 12 px. Every investigation screen also: nothing leaves its frame, no button is covered (inquiryFits), and
// nothing in it names the rule its key is about to forge.
// The answers are computed HERE from the numbers on screen (state hooks are read for the question, never for the answer).
// Run (dev server up): [E2E_SIZE=1366x768] node apps/web/e2e/gameworld-mushtarak.mjs [outDir]
import { createWalk, FLOOR_PX, lessonUrl } from './lib/walk.mjs';
import { ID as SHARED_ID, MUSHTARAK_FOREIGN, MUSHTARAK_NUMBERS, gcd, divisors, common } from './lib/mushtarak.mjs';

// the lesson this walk plays, named here (scripts/lesson-v2-status.mjs finds a lesson's world walk by its id) — the same id
// the lesson's other walks share through lib/mushtarak.mjs
const ID = 'qasim-mushtarak-akbar';
const URL = lessonUrl('ansab_al_aadad_wal_hisab', ID);
if (ID !== SHARED_ID) throw new Error(`this walk plays ${ID}, lib/mushtarak.mjs names ${SHARED_ID}`);

// the 12 px floor is on by default (lib/walk.mjs): every screenshot checks it
const w = createWalk('gameworld-mushtarak', { foreign: MUSHTARAK_FOREIGN, foreignNumbers: MUSHTARAK_NUMBERS });
const { expect, check } = w;
/** The way out of any screen of the world: the top bar's ✕, the forge's own ✕, the ✕ drawn over a dialog. */
const OUT = { exit: ['[data-di-exit]', '.di-top a.di-icon'], numbers: true };
const fills = (n, d) => n % d === 0;
const both = (a, b, d) => fills(a, d) && fills(b, d);
const kindOf = (a, b, d) => (both(a, b, d) ? 'both' : fills(a, d) ? 'a' : fills(b, d) ? 'b' : 'none');

await w.run(async () => {
  const { page } = await w.student({ uid: 9841, lessonId: ID, url: URL });
  const shot = (label, opts = OUT) => w.shot(page, label, opts);
  const ff = (sec) => w.ff(page, sec);
  const st = () =>
    page.evaluate(() => {
      const s = window.__world.getState();
      return {
        phase: s.phase,
        stage: s.stage,
        overlay: s.overlay?.type ?? null,
        o: s.overlay,
        held: s.held,
        stars: s.stars,
        keys: s.keys,
        objective: s.objective,
      };
    });
  const tp = (x, z) =>
    page.evaluate(
      ([px, pz]) => {
        const h = window.__world.hero;
        h.pos.set(px, 0, pz);
        h.vel.set(0, 0, 0);
        h.grounded = true;
      },
      [x, z],
    );
  const act = async () => {
    await page.keyboard.press('KeyE');
    await ff(0.2);
  };
  /** Goes to the pedestal of mould b on the current island and takes it. */
  const take = async (b) => {
    const p = await page.evaluate((bb) => {
      const g = window.__world;
      const i = g.hero.island;
      const ped = g.isl[i].pedestals.find((q) => q.b === bb);
      const d = g.exitDir(i);
      return ped ? [ped.x - d.dx * 1.5, ped.z - d.dz * 1.5] : null;
    }, b);
    expect(p, `pedestal ${b} exists on island ${(await st()).stage}`);
    await tp(p[0], p[1]);
    await ff(0.15);
    await act();
    expect((await st()).held === b, `holds mould ${b}`);
  };
  const toAltar = async (i) => {
    const p = await page.evaluate((k) => {
      const g = window.__world;
      const a = g.segs[k].altarWorld;
      const isl = g.isl[k];
      return [a.x, a.z, isl.x, isl.z];
    }, i);
    const d = Math.hypot(p[2] - p[0], p[3] - p[1]);
    await tp(p[0] + ((p[2] - p[0]) / d) * 1.6, p[1] + ((p[3] - p[1]) / d) * 1.6);
    await ff(0.15);
  };
  /** Forges on bridge i with the held mould; a prediction is answered with the remainder computed HERE. */
  const forge = async (i) => {
    await toAltar(i);
    await act();
    if ((await st()).overlay === 'predict') {
      const o = (await st()).o;
      await page.click(`[data-di-predict="${o.a % o.b}"]`);
    }
    await ff(1.5);
  };
  const cross = async (i) => {
    const p = await page.evaluate((k) => {
      const s = window.__world.segs[k];
      return { sx: s.sx, sz: s.sz, dx: s.dx, dz: s.dz, len: s.len };
    }, i);
    await tp(p.sx + p.dx, p.sz + p.dz);
    await ff(0.1);
    await page.keyboard.down('ArrowUp');
    await ff(p.len / 6.2 + 1.2);
    await page.keyboard.up('ArrowUp');
    await ff(0.3);
  };
  /** A bridge built from its altar: `wrong` first (it must crumble), then `right` (it must hold). */
  const bridge = async (i, id, a, wrong, right) => {
    if (wrong != null) {
      expect(
        a % wrong !== 0,
        `sanity: ${wrong} does not fill ${a} (${a} = ${wrong} × ${Math.floor(a / wrong)} + ${a % wrong})`,
      );
      await take(wrong);
      await forge(i);
      await ff(8);
      // many short planks take longer to lay (Game.js › forge: 0.1 s each at least): game time runs until he plays again
      for (let k = 0; k < 20 && (await st()).phase !== 'play'; k += 1) await ff(1);
      await page.waitForTimeout(300);
      expect(
        !(await st()).stars[id],
        `planks of ${wrong} leave cells over ${a} (${a} = ${wrong} × ${Math.floor(a / wrong)} + ${a % wrong}): the bridge crumbles`,
      );
    }
    expect(a % right === 0, `sanity: ${right} fills ${a}`);
    await take(right);
    await forge(i);
    await ff(8);
    expect((await st()).stars[id] >= 1, `bridge ${a} holds with planks of ${right} (${a} = ${right} × ${a / right})`);
  };
  /** The moulds offered on the island of segment i. */
  const mouldsOf = (i) => page.evaluate((k) => window.__world.isl[k].pedestals.map((p) => p.b), i);

  // ── the forges: what all four share ──
  const fg = () => page.evaluate(() => window.__forge);
  const iq = () => page.evaluate(() => window.__inquiry);
  const fact = async () => (await page.textContent('[data-iq-fact]')) ?? '';
  const iqText = async () => (await page.textContent('.iq')) ?? '';
  /** Waits until the experiment's stage is one of `stages`. */
  const iqAt = (stages, timeout = 20000) =>
    page.waitForFunction((ss) => ss.includes(window.__inquiry?.stage), stages, { timeout });
  /** What the world plays during `fn` (the sounds are recorded — a walk has no ear). */
  const hear = async (fn) => {
    await page.evaluate(() => {
      const a = window.__world.audio;
      window.__heard = [];
      if (!a.__spied) {
        const real = a.play.bind(a);
        a.play = (name, p) => {
          window.__heard.push(name);
          return real(name, p);
        };
        a.__spied = true;
      }
    });
    await fn();
    return page.evaluate(() => window.__heard);
  };
  const fillUse = async (vals) => {
    for (const [name, v] of Object.entries(vals)) await page.fill(`[data-rf-use="${name}"]`, String(v));
    await page.click('[data-rf-use-check]');
    await page.waitForSelector('[data-rf-use-fb]');
    return page.getAttribute('[data-rf-use-fb]', 'data-rf-use-fb');
  };
  /**
   * From the mirror's attacks: each answered as the rule says — what the case IS, computed HERE by `truth(case)` from the
   * case's own numbers — then the seal and the last step, up to the tablet.
   */
  const attackToTablet = async (name, truth, last, onMirror) => {
    await page.waitForSelector('[data-rf="attack"]');
    if (onMirror) await onMirror(`${name}, first attack`);
    await shot(`${name}-attack`);
    for (let i = 0; i < 6; i += 1) {
      const a = (await fg()).atk;
      const c = a.list[a.i];
      const yes = truth(c);
      await page.click(`[data-rf-say="${yes ? 'yes' : 'no'}"]`);
      await page.click('[data-rf-fire]');
      await page.waitForSelector('[data-rf-survived]');
      if (onMirror) await onMirror(`${name}, attack ${i + 1} dealt`);
      const end = a.i + 1 >= a.list.length;
      await page.click('[data-rf-attack-next]');
      if (end) break;
      await page.waitForSelector('[data-rf-say]');
      await page.waitForTimeout(80);
    }
    await page.waitForSelector('[data-rf-sealed]');
    await shot(`${name}-sealed`);
    await page.click('[data-rf-seal]');
    await page.waitForSelector('[data-rf="use"]');
    await page.waitForTimeout(80);
    await last((await fg()).use.c);
    await page.waitForSelector('[data-di-my-rule]');
  };
  /**
   * The mirror: a FALSE rule first (its tiles), refuted on the case of his evidence the walk computes (`expectId`); then
   * the right rule, its attacks, the seal, the last step.
   */
  const mirror = async (name, falseTiles, expectId, why, rightTiles, truth, last, onMirror) => {
    for (const t of falseTiles) await page.click(`[data-rf-tile="${t}"]`);
    await shot(`${name}-build`);
    await page.click('[data-rf-test]');
    await page.waitForSelector('[data-rf-refuted]');
    const got = await page.getAttribute('[data-rf-refuted]', 'data-rf-refuted');
    expect(
      got === expectId,
      `${name}: the rule « ${falseTiles.join(' + ')} » is refuted by a case HE made — ${why} (${got})`,
    );
    check(
      (await page.locator(`[data-rf-row="${expectId}"][data-rf-mark="refute"]`).count()) === 1,
      `${name}: the line that refutes it is on screen, marked`,
    );
    const fb = (await page.textContent('[data-rf-refuted]')) ?? '';
    check(
      !/خطأ|خاطئ/.test(fb),
      `${name}: the refutation says what he saw, never « wrong » (« ${fb.trim().slice(0, 70)} »)`,
    );
    await forgeTools(`${name}, the mirror`);
    if (onMirror) await onMirror(`${name}, refuted`);
    await shot(`${name}-refuted`);
    await page.click('[data-rf-fix]');
    await page.waitForSelector('[data-rf="build"]');
    for (const t of rightTiles) await page.click(`[data-rf-tile="${t}"]`);
    await page.click('[data-rf-test]');
    await page.waitForSelector('[data-rf-agreed]');
    await shot(`${name}-agreed`);
    await page.click('[data-rf-dare]');
    await attackToTablet(name, truth, last, onMirror);
  };
  /** The forge covers the top bar: its OWN ✕ and sound button are on screen, uncovered, and its header keeps one row. */
  const forgeTools = async (where) => {
    const t = await page.evaluate(() => {
      const seen = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return (
          r.width > 0 &&
          r.left >= 0 &&
          r.right <= window.innerWidth + 1 &&
          r.top >= 0 &&
          (el === top || el.contains(top))
        );
      };
      const head = document.querySelector('.rf-head');
      const kids = [...head.children].map((k) => k.getBoundingClientRect());
      const apart = kids.every((a, i) =>
        kids.every((b, j) => i >= j || a.right <= b.left + 1 || b.right <= a.left + 1),
      );
      return {
        exit: seen('.rf-root [data-di-exit]'),
        sound: seen('.rf-root [data-di-sound]'),
        apart,
        inScreen: kids.every((k) => k.left >= -1 && k.right <= window.innerWidth + 1),
      };
    });
    expect(
      t.exit && t.sound && t.apart && t.inScreen,
      `${where}: the forge shows its ✕ and its sound button, uncovered, beside its steps (${JSON.stringify(t)})`,
    );
  };
  /** An investigation screen: nothing leaves its frame, no button is covered, no text under 12 px — then the screenshot. */
  const inquiryFits = async (name) => {
    await page.waitForTimeout(250);
    const bad = await page.evaluate((FLOOR) => {
      const out = [];
      const frame = document.querySelector('.iq');
      if (!frame) return ['no investigation on screen'];
      const box = frame.getBoundingClientRect();
      const zoom = parseFloat(document.querySelector('.rf-fit').style.zoom) || 1;
      for (const el of frame.querySelectorAll(
        'button, input, .iq-lead p, .iq-goal, .iq-fact, .iq-calc, .iq-scene, .iq-found li, .iq-chips, .iq-shelf, .iq-tpl, .iq-askline, .iq-gknown, .iq-lists, .iq-sum-chips, .iqd-tab',
      )) {
        const r = el.getBoundingClientRect();
        if (!r.width) continue;
        if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1)
          out.push(String(el.className?.baseVal ?? el.className).split(' ')[0] + ' leaves the frame');
        if (el.tagName === 'BUTTON' || el.tagName === 'INPUT') {
          const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          if (top && !el.contains(top) && !top.contains(el))
            out.push('covered: « ' + (el.textContent.trim() || el.tagName).slice(0, 18) + ' »');
        }
        if (
          el.textContent.trim() &&
          !el.querySelector('*:not(.katex):not(.katex *)') &&
          parseFloat(getComputedStyle(el).fontSize) * zoom < FLOOR
        )
          out.push('text under 12 px: ' + String(el.className).split(' ')[0]);
      }
      // the words drawn in the scene (SVG text) are read too — at the size they are DRAWN: their font size in the units of
      // the scene × the scale the scene is drawn at (a scene squeezed by the rows around it shrinks its numbers)
      for (const svg of frame.querySelectorAll('svg.iq-scene')) {
        const vb = svg.viewBox.baseVal;
        const sr = svg.getBoundingClientRect();
        if (!vb || !vb.width || !sr.width) continue;
        const k = Math.min(sr.width / vb.width, sr.height / vb.height);
        for (const el of svg.querySelectorAll('text')) {
          if (!el.getClientRects().length) continue;
          const t = el.textContent.trim();
          if (!t) {
            out.push('an empty label drawn in the scene');
            continue;
          }
          const px = parseFloat(getComputedStyle(el).fontSize) * k;
          if (px < FLOOR)
            out.push(`scene text under 12 px: « ${t.slice(0, 20)} » (${px.toFixed(1)} px, scene ×${k.toFixed(2)})`);
        }
      }
      // two numbers drawn in the scene must not print on each other
      const texts = [...frame.querySelectorAll('svg text')]
        .map((e) => ({ t: e.textContent.trim(), r: e.getBoundingClientRect() }))
        .filter((x) => x.t && x.r.width);
      for (let i = 0; i < texts.length; i += 1)
        for (let j = i + 1; j < texts.length; j += 1) {
          const a = texts[i].r;
          const b = texts[j].r;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 2 && oy > 2) out.push(`scene texts overlap: « ${texts[i].t} » / « ${texts[j].t} »`);
        }
      if (box.bottom > window.innerHeight + 1 || box.right > window.innerWidth + 1)
        out.push('the frame leaves the screen');
      for (const el of frame.querySelectorAll('*'))
        if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 2)
          out.push('scrolls: ' + el.className);
      return [...new Set(out)];
    }, FLOOR_PX);
    check(
      bad.length === 0,
      `${name}: the investigation fits its frame — nothing cut, covered, scrolled, overlapping or too small${bad.length ? ' — ' + bad.join(' | ') : ''}`,
    );
    await shot(name);
  };
  /** The investigation opens on its question and its goal, no tile and no prediction before he acts. */
  const opensOnQuestion = async (key, kind) => {
    const f = await fg();
    expect(
      f.key === key && f.phase === 'inquiry' && (await iq()).kind === kind,
      `the forge of « ${key} » opens on an INVESTIGATION (${kind})`,
    );
    expect(
      (await page.locator('[data-rf-tile]').count()) === 0 && (await page.locator('[data-rf-guess]').count()) === 0,
      `${kind}: no tile, no prediction before he acts`,
    );
    expect(
      (await page.textContent('[data-iq-goal]')).includes('الهدف') &&
        ((await page.textContent('.iq-lead')) ?? '').trim().length > 10,
      `${kind}: its question and its goal are on screen`,
    );
  };
  /** Nothing in the experiment names what its key is about to forge (`words`): the rule comes with the tablet. */
  const tellsNothing = async (kind, words) => {
    const t = await iqText();
    const said = words.filter((x) => t.includes(x));
    check(
      said.length === 0,
      `${kind}: the experiment names nothing of the rule it leads to${said.length ? ' — ' + said.join(', ') : ''}`,
    );
  };

  /**
   * His evidence: the forge keeps every line of what HE did (`expected`, computed by the walk); its column shows as many
   * as fit, the newest last (RuleForge.jsx: the oldest leave first) — at least one, never a line of the mirror's.
   */
  const ownRows = async (expected, msg) => {
    const rows = (await fg()).rows;
    const shown = await page.locator('[data-rf-row]').count();
    const own = await page.locator('[data-rf-row][data-rf-own="1"]').count();
    expect(
      rows.length === expected && rows.every((r) => !r.mirror) && shown >= 1 && own === shown,
      `${msg} (${rows.length} lines kept, ${expected} computed; ${shown} on screen)`,
    );
  };
  /**
   * The ✕ is CLICKED: the student really leaves the lesson (the world is gone, the address is another page). Then he
   * opens the lesson again and presses the title's button, which now offers to RESUME.
   */
  const leaveAndReturn = async (where, exits) => {
    const sel = await w.reachable(page, exits);
    expect(sel !== null, `${where}: the ✕ is on screen and nothing covers it (${exits.join(' / ')})`);
    await page.click(sel);
    await page
      .waitForFunction((id) => !location.pathname.endsWith(`/${id}`) && !document.querySelector('.di-root'), ID, {
        timeout: 15000,
      })
      .catch(() => {});
    const gone = await page.evaluate(() => ({
      path: location.pathname,
      world: Boolean(document.querySelector('.di-root')),
    }));
    expect(
      !gone.path.endsWith(`/${ID}`) && !gone.world,
      `${where}: the ✕ leaves the lesson — the world is closed, the page is ${gone.path}`,
    );
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-di-start]', { timeout: 30000 });
    await page.waitForTimeout(1200);
    const label = (await page.textContent('[data-di-start]')).trim();
    expect(
      label.length > 0 && label !== startLabel,
      `${where}: back on the lesson, the title offers to RESUME (« ${label} », not « ${startLabel} »)`,
    );
    await page.click('[data-di-start]');
    await page.waitForTimeout(1200);
  };

  // ══════════════════════════ the title ══════════════════════════
  await page.waitForSelector('[data-di-start]', { timeout: 30000 });
  await page.waitForTimeout(1200);
  const startLabel = (await page.textContent('[data-di-start]')).trim();
  expect(
    (await page.textContent('.di-title h1')).includes('سوق الزهور') &&
      (await page.textContent('.di-title__eyebrow')).includes('القاسم المشترك الأكبر لعددين طبيعيين'),
    'the title screen is this lesson’s own story (« سوق الزهور », « القاسم المشترك الأكبر لعددين طبيعيين »)',
  );
  await shot('title');
  await page.click('[data-di-start]');
  await page.waitForTimeout(1200);
  expect((await st()).phase === 'play', 'the game starts in play phase');
  await shot('start');

  // ── island A → B: the twin 198 with the plank 11 (no prediction on the first bridge) ──
  {
    const m = await mouldsOf(0);
    expect(m.join() === '11', `island A offers one mould: 11 (${m.join()})`);
  }
  await bridge(0, 'g198', 198, null, 11);
  await shot('g198');
  await cross(0);
  await page.waitForTimeout(400);
  expect(
    (await st()).stage === 1 && (await st()).held == null,
    'on the second island the mould is not kept: he must choose',
  );
  // ── the ✕ of the WORLD, clicked on island B: he leaves, comes back, and is on island B with his bridge built ──
  await leaveAndReturn('in the world, on island B', ['.di-top a.di-icon', '.di-top [data-di-exit]']);
  {
    const s = await st();
    expect(
      s.phase === 'play' && s.stage === 1 && s.overlay == null && s.stars.g198 >= 1 && s.held == null,
      `he is back WHERE HE WAS: island B, the bridge of 198 still built, no mould in hand (${JSON.stringify({ phase: s.phase, stage: s.stage, overlay: s.overlay, g198: s.stars.g198 })})`,
    );
    await ff(0.3);
    const at = await page.evaluate(() => window.__world.hero.island);
    expect(at === 1, `the hero stands on island B (island ${at})`);
    await shot('back-on-island-b');
  }
  // the twin 234: the plank 11 that filled 198 (a wrong prediction screen first), then the one that fills 234
  {
    const m = await mouldsOf(1);
    const right = m.filter((b) => 234 % b === 0);
    expect(
      m.includes(11) && right.length === 1,
      `island B offers ${m.join(', ')}: ONE fills 234 (${right.join()}), and 11 is there`,
    );
    await take(11);
    await toAltar(1);
    await act();
    expect((await st()).overlay === 'predict', 'bridge 234: the world asks his prediction before it builds');
    await shot('predict');
    const o = (await st()).o;
    await page.click(`[data-di-predict="${o.a % o.b}"]`);
    await ff(9);
    expect(!(await st()).stars.g234, `planks of 11 leave ${234 % 11} cells over 234: the bridge crumbles`);
    await bridge(1, 'g234', 234, null, right[0]);
    await shot('g234');
  }
  await cross(1);
  await page.waitForTimeout(500);

  // ══════════════════════════ forge 1 🤝 « القواسم المشتركة » — COMMON ══════════════════════════
  expect(
    (await st()).stage === 2 && (await st()).overlay === 'forge',
    'island C « جزيرة الياقوت » opens the first forge',
  );
  await opensOnQuestion('qawasim-mushtaraka', 'common');
  {
    const s0 = await iq();
    expect(
      s0.a === 198 && s0.b === 234 && s0.crown === false && s0.stage === 'take',
      'it starts from HIS twin gaps, 198 and 234 — the pile of planks, and no crown to mark (crown: false)',
    );
    const pile = await page.locator('[data-iq-plank]').evaluateAll((els) => els.map((e) => Number(e.dataset.iqPlank)));
    expect(
      pile.includes(11) && pile.includes(13) && pile.length >= 6,
      `the pile holds the two planks he used, 11 and 13, and others (${pile.join(', ')})`,
    );
    await tellsNothing('common', ['القواسم المشتركة', 'قاسم مشترك', 'PGCD', 'الأكبر', 'أطول']);
    await forgeTools('forge 1, the investigation');
    await inquiryFits('common-start');
    // ── the ✕ of the FORGE, clicked after his first plank: he leaves; back, the same mirror waits for him ──
    await page.click(`[data-iq-plank="${pile[0]}"]`);
    await page.click(`[data-iq-say-a="${fills(198, pile[0]) ? 'yes' : 'no'}"]`);
    await page.click(`[data-iq-say-b="${fills(234, pile[0]) ? 'yes' : 'no'}"]`);
    await page.click('[data-iq-lay]');
    await iqAt(['take']);
    expect((await iq()).placed === 1, 'he laid his first plank: it is on its shelf');
    await leaveAndReturn('inside forge 1', ['.rf-root [data-di-exit]']);
    await ff(1.5);
    await page.waitForSelector('[data-rf="inquiry"]', { timeout: 15000 });
    {
      const s = await st();
      expect(
        s.stage === 2 && s.overlay === 'forge' && s.keys.length === 0 && s.stars.g234 >= 1,
        'he is back WHERE HE WAS: island C, in front of its mirror — the forge opens again by itself, no key skipped',
      );
      await opensOnQuestion('qawasim-mushtaraka', 'common');
      const again = await iq();
      expect(
        again.a === 198 &&
          again.stage === 'take' &&
          again.placed === 0 &&
          (await page.locator('[data-iq-plank]').count()) === pile.length,
        'the experiment starts again from the full pile: nothing half-done is kept, nothing is given',
      );
    }
    // every plank of the pile: taken, two predictions, laid. The FIRST plank: he predicts it fills both (11 fills 198 only)
    let n = 0;
    for (const d of pile) {
      await page.click(`[data-iq-plank="${d}"]`);
      await iqAt(['guess']);
      const [ta, tb] = [fills(198, d), fills(234, d)];
      const [sa, sb] = n === 0 ? [true, true] : [ta, tb];
      await page.click(`[data-iq-say-a="${sa ? 'yes' : 'no'}"]`);
      await page.click(`[data-iq-say-b="${sb ? 'yes' : 'no'}"]`);
      if (n === 0) await inquiryFits('common-guess');
      const heard = await hear(async () => {
        await page.click('[data-iq-lay]');
        await iqAt(['take', 'say']);
      });
      const f = await fact();
      const right = sa === ta && sb === tb;
      expect(
        f.includes(String(d)) && f.includes(right ? 'كما توقّعت' : 'لم يكن هذا توقّعك'),
        `plank ${d}: ${ta ? 'fills' : 'does not fill'} 198, ${tb ? 'fills' : 'does not fill'} 234 — the fact beside his prediction (« ${f.trim().slice(0, 70)} »)`,
      );
      check(
        heard.includes('plank') && heard.at(-1) === (right ? 'success' : 'crumble'),
        `plank ${d}: heard — laid, then ${right ? 'success' : 'crumble'} (${[...new Set(heard)].join(', ')})`,
      );
      const shelf = kindOf(198, 234, d);
      expect(
        (await page.locator(`[data-iq-shelf="${shelf}"] .iq-chip`).allTextContents())
          .map((x) => x.trim())
          .includes(String(d)),
        `plank ${d} goes to the shelf « ${shelf} »`,
      );
      if (n === 0) await inquiryFits('common-wrong-pick');
      if (n === 3) await inquiryFits('common-shelves');
      n += 1;
    }
    expect((await iq()).stage === 'say', 'the pile is empty: he is asked how many planks the shelf of both holds');
    const onBoth = pile.filter((d) => both(198, 234, d));
    {
      const shelfBoth = (await page.locator('[data-iq-shelf="both"] .iq-chip').allTextContents()).map((x) =>
        Number(x.trim()),
      );
      expect(
        shelfBoth.length === onBoth.length && onBoth.every((d) => shelfBoth.includes(d)),
        `the shelf of both holds ${onBoth.join(', ')} — what 198 and 234 both give, computed here`,
      );
      expect(
        (await page.locator('[data-iq-long]').count()) === 0,
        'crown: false — no chip of the shelf is marked as the longest',
      );
    }
    await inquiryFits('common-count');
    // a wrong count, then the right one
    await page.fill('[data-iq-in="count"]', String(onBoth.length - 1));
    await page.click('[data-iq-check]');
    await page.waitForTimeout(250);
    expect(
      (await iq()).stage === 'say' && (await fact()).includes(String(onBoth.length - 1)),
      `${onBoth.length - 1} planks: the fact says what he wrote and asks him to count them one by one — never the number`,
    );
    check(!(await fact()).includes(` ${onBoth.length} `), 'the miss does not give the count away');
    await inquiryFits('common-count-miss');
    await page.fill('[data-iq-in="count"]', String(onBoth.length));
    await page.click('[data-iq-check]');
    await iqAt(['seen']);
    {
      const f = await fact();
      expect(
        onBoth.every((d) => f.includes(String(d))),
        `${onBoth.length} planks: the fact lists the shelf (« ${f.trim().slice(0, 70)} »)`,
      );
    }
    await tellsNothing('common (seen)', ['القواسم المشتركة', 'قاسم مشترك', 'PGCD', 'الأكبر']);
    await inquiryFits('common-found');
    await page.click('[data-iq-next]');
    await page.waitForSelector('[data-rf="build"]');
    await ownRows(
      pile.length,
      `only now he WRITES his rule — the mirror will test it on the ${pile.length} planks HE laid`,
    );
    // a false rule: « lay each plank on the glued gap (198 + 198) » — the first plank of HIS where it says otherwise
    const gluedSays = (d) => d <= 198 && (198 + 234) % d === 0;
    const firstBad = pile.find((d) => gluedSays(d) !== both(198, 234, d));
    await mirror(
      'forge1',
      ['pool:upto', 'on:glued', 'keep:all'],
      `198:234:${firstBad}`,
      `the glued gap ${198 + 234} = ${firstBad} × ${(198 + 234) / firstBad}, and 198 = ${firstBad} × ${Math.floor(198 / firstBad)} + ${198 % firstBad}`,
      ['pool:upto', 'on:each', 'keep:all'],
      (c) => both(c.A, c.B, c.d),
      async (u) => {
        const set = common(u.A, u.B);
        const boxes = await page.locator('[data-rf-use]').count();
        expect(
          boxes === set.length,
          `the last step: ${boxes} boxes for the planks of ${u.A} and ${u.B} (${set.length} computed here)`,
        );
        const intruder = divisors(u.A).find((d) => u.B % d !== 0);
        const wrong = Object.fromEntries(set.map((d, i) => [`d${i + 1}`, i === set.length - 1 ? intruder : d]));
        expect(
          (await fillUse(wrong)) === 'intruder',
          `the last step: ${intruder} fills ${u.A} and not ${u.B} — refused`,
        );
        await shot('forge1-use');
        expect(
          (await fillUse(Object.fromEntries(set.map((d, i) => [`d${i + 1}`, d])))) === 'ok',
          `the planks of both ${u.A} and ${u.B}: ${set.join(', ')}, without laying one`,
        );
      },
    );
  }
  await shot('tablet-1');
  expect(
    (await page.textContent('[data-di-my-rule]')).includes('على كلّ هوّة وحدها') &&
      (await page.textContent('.di-card')).includes('القواسم المشتركة'),
    'the tablet names the rule after HIS own: « القواسم المشتركة »',
  );
  await page.click('[data-di-tablet]');
  await ff(0.3);
  expect((await st()).keys.length === 1, 'one key earned');

  // ── 266 then 322: the plank 14 fills both ──
  {
    const m = await mouldsOf(2);
    const right = m.filter((b) => 266 % b === 0);
    expect(right.length === 1, `island C offers ${m.join(', ')}: ONE fills 266 (${right.join()})`);
    await bridge(
      2,
      'g266',
      266,
      m.find((b) => 266 % b !== 0),
      right[0],
    );
  }
  await cross(2);
  await page.waitForTimeout(500);
  expect((await st()).stage === 3, 'island D');
  {
    const m = await mouldsOf(3);
    const right = m.filter((b) => 322 % b === 0);
    expect(
      right.length === 1 && right[0] === 14 && 266 % 14 === 0,
      `island D offers ${m.join(', ')}: 14 fills 322 — and 266`,
    );
    await bridge(
      3,
      'g322',
      322,
      m.find((b) => 322 % b !== 0),
      right[0],
    );
  }
  await cross(3);
  await page.waitForTimeout(500);

  // ══════════════════════════ forge 2 👑 « القاسم المشترك الأكبر » — SUMMIT ══════════════════════════
  expect(
    (await st()).stage === 4 && (await st()).overlay === 'forge',
    'island E « جزيرة التاج » opens the second forge',
  );
  await opensOnQuestion('al-akbar', 'summit');
  const laid = { r1: new Set(), r2: new Set() };
  {
    const s0 = await iq();
    expect(
      s0.a === 266 && s0.b === 322 && s0.stage === 'free' && s0.best === 14,
      'it starts from the plank 14 he has just laid on 266 and 322: free tries, the best so far 14',
    );
    laid.r1.add(14);
    await tellsNothing('summit', ['PGCD', 'القاسم المشترك الأكبر', 'الأكبر']);
    await inquiryFits('summit-start');
    // two free tries: 7 (fills both, shorter than 14) and 28 (fills neither)
    for (const d of [7, 28]) {
      await page.fill('[data-iq-in="free"]', String(d));
      await page.click('[data-iq-lay]');
      await iqAt(['free', 'outside']);
      laid.r1.add(d);
      const mark = await page.getAttribute(`[data-iq-mark="${d}"]`, 'data-iq-kind');
      expect(
        mark === kindOf(266, 322, d),
        `free try ${d}: its mark on the line of lengths says « ${kindOf(266, 322, d)} » (${mark})`,
      );
      const f = await fact();
      expect(f.includes(String(d)), `free try ${d}: the fact says what the plank did (« ${f.trim().slice(0, 70)} »)`);
      expect((await iq()).best === 14, `free try ${d}: the best plank is still 14`);
      if (d === 7) await inquiryFits('summit-free');
    }
    expect(
      (await iq()).stage === 'outside' && (await page.locator('[data-iq-in="free"]').count()) === 0,
      'two free tries spent: the box is gone, the world asks its one question « outside the shorter gap? »',
    );
  }
  {
    await inquiryFits('summit-outside');
    // the truth, computed here: a plank that does not fill 266 cannot fill both — he says « yes » (a wrong prediction)
    await page.click('[data-iq-say="yes"]');
    await iqAt(['outsideSeen']);
    const f = await fact();
    expect(
      f.includes('لم يكن هذا توقّعك'),
      `he said « yes »: a plank laid answers — the fact beside his prediction (« ${f.trim().slice(0, 80)} »)`,
    );
    // the plank the world laid is one of his tries that does not fill 266 (28), computed here
    const mine = [7, 28].find((d) => 266 % d !== 0);
    expect(
      f.includes(String(mine)) && f.includes('جرّبتَه'),
      `the answer is HIS own try ${mine}: it does not fill 266`,
    );
    await inquiryFits('summit-outside-seen');
    await page.click('[data-iq-go]');
    await iqAt(['descent']);
  }
  {
    const planks = (await page.getAttribute('[data-iq-planks]', 'data-iq-planks')).split(',').map(Number);
    expect(
      planks.join() === divisors(266).reverse().join(),
      `the chips: the planks of 266, longest first (${planks.join(', ')})`,
    );
    let crowned = null;
    let k = 0;
    while ((await iq()).stage === 'descent') {
      const d = planks[k];
      const truth = 322 % d === 0;
      const heard = await hear(async () => {
        await page.click(`[data-iq-say="${truth ? 'yes' : 'no'}"]`);
        await iqAt(['descent', 'rest', 'seen']);
        await page.waitForTimeout(900); // the verdict sounds a beat after the plank is laid
      });
      laid.r1.add(d);
      check(
        heard.includes('plank') && heard.includes('success') && !heard.includes('crumble'),
        `descent ${d}: the plank laid, then « كما توقّعت » is heard (${[...new Set(heard)].join(', ')})`,
      );
      expect(
        (await fact()).includes(String(d)),
        `descent ${d}: ${truth ? 'fills 322 too' : `322 = ${d} × ${Math.floor(322 / d)} + ${322 % d}`}`,
      );
      if (k === 1) await inquiryFits('summit-descent');
      if (truth) crowned = d;
      k += 1;
    }
    expect(
      crowned === gcd(266, 322) && (await iq()).crown === crowned,
      `the first plank of 266 that fills 322 is crowned: ${crowned} (computed here: ${gcd(266, 322)})`,
    );
    expect(
      (await page.getAttribute(`[data-iq-chip="${crowned}"]`, 'data-iq-chip-state')) === 'crown' &&
        (await page.locator('.iq--summit[data-iq-crown]').getAttribute('data-iq-crown')) === String(crowned),
      'its chip and its mark on the line are gold',
    );
    expect((await iq()).stage === 'rest', 'then: must the shorter planks still be tried?');
    await inquiryFits('summit-crowned');
    const rest = divisors(266)
      .filter((d) => d < crowned)
      .reverse();
    await page.click('[data-iq-rest="yes"]');
    await iqAt(['seen']);
    rest.forEach((d) => laid.r1.add(d));
    expect(
      rest.every((d) => !both(266, 322, d) || d < crowned) && (await fact()).includes(String(rest[0])),
      `he asked for them: the world lays ${rest.join(', ')} — all shorter than ${crowned}`,
    );
    for (const d of rest)
      expect(
        (await page.locator(`[data-iq-mark="${d}"]`).count()) === 1,
        `the shorter plank ${d} has its mark on the line`,
      );
    await inquiryFits('summit-rest');
    await page.click('[data-iq-next]');
    await iqAt(['descent']);
  }
  {
    const s = await iq();
    expect(s.a === 198 && s.b === 234 && s.ri === 1, 'round 2: the twins 198 and 234, from the top — no free try');
    const planks = (await page.getAttribute('[data-iq-planks]', 'data-iq-planks')).split(',').map(Number);
    let k = 0;
    let crowned = null;
    while ((await iq()).stage === 'descent') {
      const d = planks[k];
      const truth = 234 % d === 0;
      // his second descent prediction is a wrong one (99 does not fill 234: he says it does)
      const say = k === 1 ? !truth : truth;
      await page.click(`[data-iq-say="${say ? 'yes' : 'no'}"]`);
      await iqAt(['descent', 'rest', 'seen']);
      laid.r2.add(d);
      if (k === 1) {
        expect(
          (await fact()).includes('لم يكن هذا توقّعك'),
          `descent ${d} on 234: he said « yes » — 234 = ${d} × ${Math.floor(234 / d)} + ${234 % d}`,
        );
        await inquiryFits('summit-twins-wrong-pick');
      }
      if (truth) crowned = d;
      k += 1;
    }
    expect(
      crowned === gcd(198, 234),
      `the twins: ${crowned} is crowned after ${k} planks (computed here: ${gcd(198, 234)})`,
    );
    await page.click('[data-iq-rest="no"]');
    await iqAt(['seen']);
    expect((await page.locator('[data-iq-found] li').count()) === 2, 'two pairs found, kept on screen');
    await inquiryFits('summit-found');
    await page.click('[data-iq-next]');
  }
  await page.waitForSelector('[data-rf="build"]');
  await ownRows(laid.r1.size + laid.r2.size, 'only now he WRITES his rule — on every plank laid in his search');
  // a false rule: « from the shortest up, stop at the first that fills both » picks 1 — his first plank, 14, refutes it
  await mirror(
    'forge2',
    ['list:short', 'order:up', 'stop:both'],
    '266:322:14',
    'from the shortest up, the first plank of both is 1 — and 14 fills 266 and 322',
    ['list:short', 'order:down', 'stop:both'],
    (c) => c.d === gcd(c.A, c.B),
    async (u) => {
      const g = gcd(u.A, u.B);
      const smaller = common(u.A, u.B)
        .filter((d) => d < g)
        .at(-1);
      expect(
        (await fillUse({ g: smaller, x: u.A / smaller, h: smaller, y: u.B / smaller })) === 'longer',
        `the last step: ${u.A} = ${smaller} × ${u.A / smaller}, ${u.B} = ${smaller} × ${u.B / smaller} — a longer plank fills both: refused`,
      );
      await shot('forge2-use');
      expect(
        (await fillUse({ g, x: u.A / g, h: g, y: u.B / g })) === 'ok',
        `${u.A} = ${g} × ${u.A / g} and ${u.B} = ${g} × ${u.B / g}: the longest plank, without laying one`,
      );
    },
  );
  await shot('tablet-2');
  expect(
    (await page.textContent('.di-card')).includes('القاسم المشترك الأكبر'),
    'the tablet: « القاسم المشترك الأكبر »',
  );
  await page.click('[data-di-tablet]');
  await ff(0.3);
  expect((await st()).keys.length === 2, 'two keys earned');

  // ── 342 with the longest plank of the twins, then the dash of island F ──
  {
    const m = await mouldsOf(4);
    const g = gcd(198, 234);
    expect(
      m.includes(g) && m.filter((b) => 342 % b === 0).join() === String(g),
      `island E offers ${m.join(', ')}: the longest plank of the twins (${g}) alone fills 342`,
    );
    await bridge(
      4,
      'g342',
      342,
      m.find((b) => 342 % b !== 0),
      g,
    );
  }
  await cross(4);
  await page.waitForTimeout(500);
  expect((await st()).stage === 5, 'island F: the board of light');
  {
    const p = await page.evaluate(() => [window.__world.boardHome.x, window.__world.boardHome.z]);
    await tp(p[0], p[1] + 0.2);
    await ff(0.3);
    await act();
    await ff(0.6);
    expect(Boolean(await page.evaluate(() => window.__world.getState().dash)), 'the board moves');
    await ff(1.5);
    const say = await page.textContent('.di-dash__say');
    check(
      say && say.trim().length > 5,
      `the dash says this lesson’s sentence over the rail (« ${say?.trim().slice(0, 50)} »)`,
    );
    await shot('dash');
    /** The gate a wave's sentence asks, computed HERE from its two numbers: the PGCD, or a divisor of both. */
    const laneOf = (x) => {
      const [a, b] = (x.say.match(/\d+/g) ?? []).map(Number);
      const asksMax = /PGCD|أطول/.test(x.say);
      const ok = x.gates.map((n) => (asksMax ? n === gcd(a, b) : a % n === 0 && b % n === 0));
      expect(ok.filter(Boolean).length === 1, `wave « ${x.say} »: exactly one gate is right (${x.gates.join(', ')})`);
      return ok.indexOf(true);
    };
    const waves = await page.evaluate(() => window.__world.dash.waves.map((x) => ({ say: x.say, gates: x.gates })));
    const lanes = waves.map(laneOf);
    for (let k = 0; k < 400 && (await page.evaluate(() => Boolean(window.__world.getState().dash))); k += 1) {
      await page.evaluate((ls) => {
        const d = window.__world.dash;
        if (d && d.waves[d.wave]) d.lane = ls[d.wave];
      }, lanes);
      await ff(0.25);
    }
  }
  await ff(6);
  await page.waitForTimeout(500);

  // ══════════════════════════ forge 3 💐 « الباقات المتماثلة » — DEAL ══════════════════════════
  expect(
    (await st()).stage === 6 && (await st()).overlay === 'forge',
    'island G « جزيرة الباقات » opens the third forge',
  );
  await opensOnQuestion('baqat-mutamathila', 'deal');
  const R = 40;
  const L = 56;
  const dealtRows = [];
  {
    const lead = (await page.textContent('.iq-lead')) ?? '';
    expect(
      lead.includes(String(R)) && lead.includes(String(L)),
      `the florist's ${R} roses and ${L} lilies are in the question`,
    );
    expect(
      Number(await page.getAttribute('[data-iq-pile="a"]', 'data-iq-count')) === R &&
        Number(await page.getAttribute('[data-iq-pile="b"]', 'data-iq-count')) === L &&
        (await page.locator('[data-iq-pile="a"] use').count()) === R &&
        (await page.locator('[data-iq-pile="b"] use').count()) === L,
      `the table draws ${R} roses and ${L} lilies, one by one`,
    );
    await tellsNothing('deal', ['PGCD', 'القاسم المشترك', 'قاسم مشترك', 'الباقات المتماثلة']);
    await inquiryFits('deal-start');
    // the choices he tries: 6 (leaves both), 5 (leaves lilies — he says « all shared »: a wrong prediction), 4, 8
    for (const [i, k] of [6, 5, 4, 8].entries()) {
      await page.click(`[data-iq-choice="${k}"]`);
      await iqAt(['guess']);
      const truth = both(R, L, k);
      const say = k === 5 ? !truth : truth;
      if (i === 0) await inquiryFits('deal-guess');
      await page.click(`[data-iq-say="${say ? 'yes' : 'no'}"]`);
      await iqAt(['pick']);
      dealtRows.push(k);
      const holds = await page.locator('[data-iq-lot]').evaluateAll((els) => els.map((e) => e.dataset.iqHolds));
      expect(
        holds.length === k && holds.every((h) => h === `${Math.floor(R / k)},${Math.floor(L / k)}`),
        `${k} vases drawn, each holding ${Math.floor(R / k)} roses and ${Math.floor(L / k)} lilies (${holds[0]})`,
      );
      expect(
        Number(await page.getAttribute('[data-iq-pile="a"]', 'data-iq-count')) === R % k &&
          Number(await page.getAttribute('[data-iq-pile="b"]', 'data-iq-count')) === L % k &&
          (await page.locator('[data-iq-pile="a"] use').count()) === R % k &&
          (await page.locator('[data-iq-pile="b"] use').count()) === L % k,
        `${k} vases: ${R % k} roses and ${L % k} lilies stay on the table, drawn apart`,
      );
      const f = await fact();
      expect(
        f.includes(say === truth ? 'كما توقّعت' : 'لم يكن هذا توقّعك'),
        `${k} vases: the fact beside his prediction (« ${f.trim().slice(0, 80)} »)`,
      );
      expect(
        (await page.getAttribute(`[data-iq-try="${k}"]`, 'data-iq-ok')) === (truth ? '1' : '0'),
        `${k} vases: its column in the table says ${truth ? 'everything shared' : 'flowers left'}`,
      );
      if (k === 5) await inquiryFits('deal-wrong-pick');
      if (k === 8) await inquiryFits('deal-shared');
    }
    // a number already tried shows its row again — nothing is dealt twice
    await page.click('[data-iq-choice="6"]');
    await page.waitForTimeout(200);
    expect(
      (await iq()).stage === 'pick' && (await fact()).includes('جرّبتَ هذا العدد'),
      'a number already tried: its deal shown again, not dealt twice',
    );
    await tellsNothing('deal (table)', ['PGCD', 'القاسم المشترك', 'قاسم مشترك']);
    await page.click('[data-iq-to-answer]');
    await iqAt(['answer']);
    await inquiryFits('deal-answer');
    // a wrong answer: 4 vases share everything, but 8 of HIS table did too
    await page.fill('[data-iq-in="k"]', '4');
    await page.fill('[data-iq-in="x"]', String(R / 4));
    await page.fill('[data-iq-in="y"]', String(L / 4));
    await page.click('[data-iq-check]');
    await iqAt(['pick']);
    {
      const f = await fact();
      expect(
        f.includes('8') && (await iq()).k === 8,
        `4 vases: answered by HIS row of 8 vases, which shares everything too (« ${f.trim().slice(0, 80)} »)`,
      );
      await inquiryFits('deal-answer-miss');
    }
    const g = gcd(R, L);
    await page.click('[data-iq-to-answer]');
    await iqAt(['answer']);
    await page.fill('[data-iq-in="k"]', String(g));
    await page.fill('[data-iq-in="x"]', String(R / g));
    await page.fill('[data-iq-in="y"]', String(L / g));
    await page.click('[data-iq-check]');
    await iqAt(['seen']);
    expect(
      (await fact()).includes(String(R / g)),
      `${g} vases, ${R / g} roses and ${L / g} lilies in each: no flower left`,
    );
    await inquiryFits('deal-found');
    await page.click('[data-iq-next]');
  }
  await page.waitForSelector('[data-rf="build"]');
  {
    // his rows: each vase count he dealt, the most and what one holds, and his wrong answer (most 4, 10 and 14)
    await ownRows(dealtRows.length + 2 + 2, 'only now he WRITES his rule — on what HE dealt and answered');
  }
  {
    // a false rule: « the number of vases divides ONE of the two numbers at least » — his first deal where it is wrong
    const firstBad = dealtRows.find((k) => (R % k === 0 || L % k === 0) !== both(R, L, k));
    await mirror(
      'forge3',
      ['must:one', 'most:gcd', 'holds:quot'],
      `deal:${R}:${L}:${firstBad}`,
      `${firstBad} vases: ${R} = ${firstBad} × ${Math.floor(R / firstBad)} + ${R % firstBad}, ${L} = ${firstBad} × ${Math.floor(L / firstBad)} + ${L % firstBad}`,
      ['must:both', 'most:gcd', 'holds:quot'],
      (c) =>
        c.kind === 'deal'
          ? both(c.nA, c.nB, c.k)
          : c.kind === 'most'
            ? c.k === gcd(c.nA, c.nB)
            : both(c.nA, c.nB, c.k) && c.x * c.k === c.nA && c.y * c.k === c.nB,
      async (u) => {
        const gg = gcd(u.nA, u.nB);
        const smaller = common(u.nA, u.nB)
          .filter((d) => d < gg)
          .at(-1);
        expect(
          (await fillUse({ k: smaller, x: u.nA / smaller, y: u.nB / smaller })) === 'more',
          `the last step: ${smaller} shares ${u.nA} and ${u.nB}, but a bigger number does too — refused`,
        );
        await shot('forge3-use');
        expect(
          (await fillUse({ k: gg, x: u.nA / gg, y: u.nB / gg })) === 'ok',
          `${gg} lots, ${u.nA / gg} and ${u.nB / gg} in each`,
        );
      },
      // the mirror of THIS forge shows a sharing — roses and lilies dealt into vases — never a bridge, and no word of
      // its screen (the mirror, the panel, his evidence) is a plank
      async (where) => {
        const m = await page.evaluate(() => ({
          deal: document.querySelectorAll('.rf-root [data-rf-deal]').length,
          bridge: document.querySelectorAll('.rf-root [data-rf-bridge]').length,
          lots: document.querySelectorAll('.rf-root [data-rf-deal] [data-iq-lot]').length,
          k: Number(document.querySelector('.rf-root [data-rf-deal]')?.dataset.rfDeal.split(':')[2]),
          text: document.querySelector('.rf-root')?.innerText ?? '',
        }));
        if (where.includes('attack'))
          expect(
            m.deal === 1 && m.bridge === 0 && m.lots === m.k,
            `${where}: the mirror draws a SHARING (${m.k} vases), not a bridge (${JSON.stringify({ ...m, text: undefined })})`,
          );
        else check(m.bridge === 0, `${where}: no bridge is drawn in the vases' forge`);
        expect(!m.text.includes('لوح'), `${where}: no text of the vases' forge says « لوح »`);
      },
    );
  }
  await shot('tablet-3');
  expect((await page.textContent('.di-card')).includes('الباقات المتماثلة'), 'the tablet: « الباقات المتماثلة »');
  await page.click('[data-di-tablet]');
  await ff(0.3);
  expect((await st()).keys.length === 3, 'three keys earned');

  // ── 228, the dates of the next island ──
  {
    const m = await mouldsOf(6);
    const right = m.filter((b) => 228 % b === 0);
    expect(right.length === 1, `island G offers ${m.join(', ')}: ONE fills 228 (${right.join()})`);
    await bridge(
      6,
      'g228',
      228,
      m.find((b) => 228 % b !== 0),
      right[0],
    );
    await shot('g228');
  }
  await cross(6);
  await ff(2.5);
  await page.waitForTimeout(400);
  {
    const s = await st();
    expect(
      s.stage === 7 && s.overlay === 'quiz' && s.o.id === 'baskets',
      'island H « جزيرة السلال »: the stone asks its baskets first',
    );
    const opts = await page
      .locator('[data-di-option]')
      .evaluateAll((els) => els.map((e) => Number(e.dataset.diOption)));
    const prompt = (await page.textContent('.di-card')) ?? '';
    const [dates, figs] = (prompt.match(/\d+/g) ?? []).map(Number);
    expect(dates === 228 && figs === 276, `the stone's question is about ${dates} dates and ${figs} figs`);
    const right = opts.filter((n) => both(dates, figs, n));
    expect(
      right.length >= 2 && right.length < opts.length,
      `the stone offers ${opts.join(', ')}: ${right.join(', ')} share both, computed here`,
    );
    await shot('stone');
    const odd = opts.find((v) => !right.includes(v));
    await page.click(`[data-di-option="${odd}"]`);
    await page.click('[data-di-check]');
    await page.waitForTimeout(250);
    expect(
      (await page.textContent('.di-feedback')).includes(String(odd)),
      `${odd} chosen: the stone says what ${odd} baskets leave — never the answer`,
    );
    await shot('stone-wrong');
    await page.click(`[data-di-option="${odd}"]`);
    for (const v of right) await page.click(`[data-di-option="${v}"]`);
    await page.click('[data-di-check]');
    await page.waitForTimeout(500);
  }

  // ══════════════════════════ forge 4 🧩 « قواسم القاسم المشترك الأكبر » — NEST ══════════════════════════
  expect((await st()).overlay === 'forge', 'the stone answered: its mirror opens');
  await opensOnQuestion('qawasim-al-pgcd', 'nest');
  {
    const s0 = await iq();
    const g = gcd(s0.a, s0.b);
    expect(
      s0.a === 228 && s0.b === 276 && s0.g === g,
      `the dates and the figs: 228 and 276, their longest plank GIVEN — ${g} (computed here)`,
    );
    const divs = (await page.getAttribute('[data-iq-divs]', 'data-iq-divs')).split(',').map(Number);
    expect(divs.join() === divisors(g).join(), `the planks of ${g} are drawn as chips (${divs.join(', ')})`);
    await tellsNothing('nest', ['قواسم القاسم المشترك الأكبر', 'بالضبط', 'هي نفسها']);
    await inquiryFits('nest-start');
    let n = 0;
    const probes = [];
    while ((await iq()).stage === 'guess') {
      const p = Number(await page.getAttribute('.iq--nest', 'data-iq-probe'));
      const truth = both(228, 276, p);
      // looking at g alone: p fills both exactly when it fills g — the walk computes both and checks they agree
      expect(truth === (g % p === 0), `probe ${p}: it fills 228 and 276 ⇔ it fills ${g} (computed here)`);
      const say = n === 1 ? !truth : truth;
      await page.click(`[data-iq-say="${say ? 'yes' : 'no'}"]`);
      await iqAt(['guess', 'compare']);
      probes.push(p);
      const f = await fact();
      if ((await iq()).stage === 'guess')
        expect(
          f.includes(String(p)) && f.includes(String(g)),
          `probe ${p}: the fact says what it did on 228, 276 and ${g} (« ${f.trim().slice(0, 70)} »)`,
        );
      if (n === 1) {
        expect(
          f.includes('لم يكن هذا توقّعك'),
          `probe ${p}: he said the opposite of what the gaps did — the fact beside it`,
        );
        await inquiryFits('nest-wrong-pick');
      }
      if (n === 3) await inquiryFits('nest-probe');
      n += 1;
    }
    expect((await iq()).stage === 'compare' && n >= 6, `${n} probes judged; then the two lists stand side by side`);
    const listOf = async (k) =>
      (await page.locator(`[data-iq-list="${k}"] .iq-chip`).allTextContents()).map((x) => Number(x.trim()));
    expect(
      (await listOf('common')).join() === common(228, 276).join() && (await listOf('g')).join() === divisors(g).join(),
      `the planks of both gaps (${common(228, 276).join(', ')}) beside the planks of ${g} (${divisors(g).join(', ')}) — computed here`,
    );
    await inquiryFits('nest-compare');
    await page.click('[data-iq-next]');
    await page.waitForSelector('[data-rf="build"]');
    await ownRows(probes.length, `his rule is tested on his ${probes.length} probes`);
    // a false rule: « the divisors of the smaller number » — the first probe of HIS where it says otherwise
    const firstBad = probes.find((p) => (228 % p === 0) !== both(228, 276, p));
    await mirror(
      'forge4',
      ['which:div', 'of:min'],
      `228:276:${firstBad}`,
      `${firstBad} divides 228, and 276 = ${firstBad} × ${Math.floor(276 / firstBad)} + ${276 % firstBad}`,
      ['which:div', 'of:g'],
      (c) => both(c.A, c.B, c.d),
      async (u) => {
        const set = divisors(gcd(u.A, u.B));
        const boxes = await page.locator('[data-rf-use]').count();
        expect(
          boxes === set.length,
          `the last step: ${boxes} boxes — the divisors of PGCD(${u.A} ; ${u.B}) = ${gcd(u.A, u.B)} (${set.length})`,
        );
        const twice = Object.fromEntries(set.map((d, i) => [`d${i + 1}`, i === 1 ? set[0] : d]));
        expect((await fillUse(twice)) === 'twice', 'the last step: a common divisor written twice — refused');
        await shot('forge4-use');
        expect(
          (await fillUse(Object.fromEntries(set.map((d, i) => [`d${i + 1}`, d])))) === 'ok',
          `the common divisors of ${u.A} and ${u.B}: ${set.join(', ')} — without their own lists`,
        );
      },
    );
  }
  await shot('tablet-4');
  expect(
    (await page.textContent('.di-card')).includes('قواسم القاسم المشترك الأكبر'),
    'the tablet: « قواسم القاسم المشترك الأكبر »',
  );
  await page.click('[data-di-tablet]');
  await ff(0.5);
  expect((await st()).keys.length === 4, 'four keys earned, all forged');

  // ═══════════════ the last bridge: two stretches, 364 (roses) then 286 (lilies) — planks of 28 or 26 ═══════════════
  // ONE kind of plank must fill EACH stretch, the longest there is: 28 fills the roses' stretch only, 26 fills both. The
  // store still divides the whole walkway (650 = 28 × 23 + 6: the same 6 cells the lilies' stretch leaves).
  const RS = 364;
  const LS = 286;
  const A = RS + LS;
  await toAltar(7);
  await page.waitForTimeout(600);
  await act();
  await page.waitForTimeout(400);
  expect(
    (await st()).overlay === 'boss' && (await page.textContent('[data-di-boss-mission]')).includes(String(A)),
    `the store opens on the lesson’s problem: ${A} cells, one per flower of the market`,
  );
  const moulds = await page.locator('[data-di-mould]').evaluateAll((els) => els.map((e) => Number(e.dataset.diMould)));
  const good = moulds.filter((b) => A % b === 0);
  expect(
    moulds.length === 2 && good.length === 1,
    `the store offers ${moulds.join(' and ')}: ONE fills ${A} (${good.join()})`,
  );
  const bad = moulds.find((b) => A % b !== 0);
  {
    const mission = (await page.textContent('[data-di-boss-mission]')) ?? '';
    const ask = (await page.textContent('.di-card h2')) ?? '';
    expect(
      [mission, ask].every((t) => t.includes(String(RS)) && t.includes(String(LS))) && !/بالقسمة|PGCD/.test(ask),
      `the mission and the question name the two stretches ${RS} and ${LS}: the longest plank of BOTH is asked (« ${ask.trim().slice(0, 80)} »)`,
    );
    // the walk's own arithmetic: the wrong kind is the LONGER one, and fills one stretch alone — one division never chooses
    expect(
      good[0] === gcd(RS, LS) && bad > good[0] && RS % bad === 0 && LS % bad !== 0 && A % bad === LS % bad,
      `${bad} fills the roses' stretch alone (${LS} = ${bad} × ${Math.floor(LS / bad)} + ${LS % bad}); ${good[0]} is the longest plank of both`,
    );
  }
  await shot('boss');
  await page.click(`[data-di-mould="${bad}"]`);
  await page.waitForTimeout(300);
  if (await page.locator('[data-di-pgate-go]').count()) await page.click('[data-di-pgate-go]');
  expect(
    (await page.textContent('[data-di-boss-a]')).trim() === String(A),
    `the division to write starts with THIS gap: ${A} = ${bad} × ▢ + ▢`,
  );
  const bossErr = async (q, r) => {
    if (q !== '') await page.fill('[data-di-q]', String(q));
    if (r !== '') await page.fill('[data-di-r]', String(r));
    await page.click('[data-di-check]');
    await page.waitForTimeout(250);
    return (await page.textContent('[data-di-boss-error]')) ?? '';
  };
  expect(
    (await bossErr('', '')).includes('عدد الألواح'),
    'an empty division is refused, in the words of this lesson (planks)',
  );
  {
    const q = Math.floor(A / bad) + 1;
    const e = await bossErr(q, 0);
    expect(
      e.includes(String(q * bad)) && e.includes(`(${A})`),
      `${q} planks of ${bad}: « ${q * bad} cells, longer than the gap (${A}) » (${e.trim().slice(0, 70)})`,
    );
  }
  {
    const q = Math.floor(A / bad) - 1;
    const e = await bossErr(q, A - q * bad);
    expect(e.includes(`أصغر من ${bad}`), `${q} planks and ${A - q * bad} left: « room for another plank »`);
  }
  await shot('boss-divide');
  await page.fill('[data-di-q]', String(Math.floor(A / bad)));
  await page.fill('[data-di-r]', String(A % bad));
  await page.click('[data-di-check]');
  await ff(15);
  await page.waitForTimeout(400);
  {
    const o = (await st()).o;
    expect(
      o?.type === 'boss' && o.view === 'choose' && o.tried[bad] === A % bad,
      `planks of ${bad} leave ${A % bad} cells: the store shows it tried and lets him choose again`,
    );
  }
  await shot('boss-tried');
  await page.click(`[data-di-mould="${good[0]}"]`);
  await page.waitForTimeout(300);
  if (await page.locator('[data-di-pgate-go]').count()) await page.click('[data-di-pgate-go]');
  await page.fill('[data-di-q]', String(A / good[0]));
  await page.fill('[data-di-r]', '0');
  await page.click('[data-di-check]');
  await ff(12);
  await page.waitForTimeout(300);
  const Q = A / good[0];
  {
    const o = (await st()).o;
    expect(
      o?.type === 'boss' && o.view === 'cost' && o.q === Q,
      `the bridge of ${A} holds with ${Q} planks of ${good[0]}: the store asks their price`,
    );
  }
  if (await page.locator('[data-di-pgate-go]').count()) await page.click('[data-di-pgate-go]');
  let price;
  {
    const asked = await page.textContent('.di-card h2');
    price = Number((await page.textContent('[data-di-boss-price]')).trim());
    expect(
      price > 0 && asked.includes(String(price)) && asked.includes(String(Q)),
      `the price in the sentence and in the equation are the SAME number (${price}), with the ${Q} planks`,
    );
    expect(
      (await page.textContent('.di-template')).includes('دج'),
      'the amount is typed in its own shape: its unit « دج » is printed',
    );
  }
  await shot('boss-cost');
  {
    await page.fill('[data-di-cost]', '4000');
    await page.click('[data-di-check]');
    await page.waitForTimeout(300);
    const e = await page.textContent('[data-di-boss-error]');
    expect(
      e.includes('4000') && e.includes('ثمن اللوح'),
      'a wrong price is refused with a sentence, in the words of this lesson',
    );
  }
  expect(
    (await w.reachable(page, ['.di-veil [data-di-exit]'])) !== null,
    'the ✕ that leaves the game is drawn OVER the dialog and a click reaches it',
  );
  await page.click('[data-di-boss-close]');
  await ff(0.3);
  expect(
    (await st()).overlay == null && (await st()).phase === 'play',
    'the payment step can be CLOSED: back in the world, nothing lost',
  );
  await act();
  await page.waitForTimeout(400);
  {
    const o = (await st()).o;
    expect(
      o?.type === 'boss' && o.view === 'cost' && o.q === Q,
      `the store opens again on the price of the ${Q} planks`,
    );
  }
  if (await page.locator('[data-di-pgate-go]').count()) await page.click('[data-di-pgate-go]');
  await page.fill('[data-di-cost]', String(Q * price));
  await page.click('[data-di-check]');
  await ff(0.5);
  expect(
    (await st()).overlay == null && (await st()).objective.includes('اعبر إلى سوق الزهور'),
    `paid ${Q * price} دج (${Q} × ${price}): the objective says to cross to the flower market`,
  );
  await cross(7);
  await ff(3);
  await page.waitForTimeout(500);
  await shot('finale');
  await ff(6);
  await page.waitForTimeout(600);
  await shot('end');
  expect(
    (await st()).overlay === 'end',
    'the market is reached and the end screen shows: the story is played to its end',
  );
});
