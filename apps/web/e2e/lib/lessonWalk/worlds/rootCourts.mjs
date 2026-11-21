// « قصر الساحات » (`gameworld/rootCourts/`, GAME_WORLD.md §2ter-3) in the lesson walk: its gestures, its STORY played
// from the lesson's own `story.terraces`, its course of gates and its practice levels on the kit's rail (`kit/GateRun.js`,
// `data-gr-*`), the board's `court` station. The islands' code (../story.mjs, ../world.mjs) never reaches this file.
//
// What is done BY HAND (keys and buttons of the screen, as a student does): « ابدأ », E at a post / a feature / the
// pavilion, ← → held along the wall until the rod's dial shows the mark (and released THERE: a hand stops on a mark),
// the dial's buttons, X and « ضع المقياس », the prediction typed, the forges and experiments through their buttons, the
// lanes of the rail with ← →, the mission's boxes. What is done BY THE WORLD'S DEV HANDLE (`window.__world`), as the
// islands' walks do: the robot PLACED at a post, a pad, a feature, the pavilion (`hero.pos`); the clock fast-forwarded
// (`step`); the state READ for the question (where he stands, the rod's mark, the run's stage) — never for an answer:
// every verdict is computed by ./exact.mjs from what the screen shows.
import { createWalk } from '../../walk.mjs';
import { namesOf, WORLD_LESSONS } from '../../lessonWords.mjs';
import { worldShot, wordsRe } from '../checks.mjs';
import { playForge } from '../forge.mjs';
import { worldOf } from '../world.mjs';
import { cmp, eq, isqrt, platform, q, sub, write } from './exact.mjs';

const WRONG_WORDS = /خطأ|خاطئ|غلط/;
/** The nouns of the islands (a plank « لوح », never the plaque « لوحة »), and the tool's refused name (defects.md D25). */
const ISLAND_NOUNS = /(?<![؀-ۿ])[وفبل]?(?:ال)?(?:لوح(?![ةت])|ألواح|أخشاب|جسر|جسور|هوّة|هوة|جزير|قضيب)/;

/** Every string inside a value (functions left out). */
function stringsOf(v, out = [], seen = new Set()) {
  if (typeof v === 'string') out.push(v);
  else if (v && typeof v === 'object' && !seen.has(v)) {
    seen.add(v);
    for (const x of Object.values(v)) stringsOf(x, out, seen);
  }
  return out;
}

export const ROOT_COURTS = {
  id: 'root-courts',
  /** The story's player (../story.mjs hands it a lesson of this world). */
  story: (L, D, opts) => rcStoryWalk(L, D, opts),
  /** The hub's « واصل التدريب » (../hub.mjs, part 4): a practice level on the kit's rail. */
  practice: (args) => rcPractice(args),
  /** The names of every lesson of the islands that this lesson's own text never writes (lib/lessonWords.mjs › namesOf). */
  foreignWords(L, extra = []) {
    const own = stringsOf([L.lesson, L.script, L.memo, L.config]).join('\n');
    const out = new Set();
    for (const id of WORLD_LESSONS) for (const n of namesOf(id)) if (!own.includes(n)) out.add(n);
    for (const x of extra) if (!own.includes(x)) out.add(x);
    return [...out];
  },
  /** What no screen of this world's lessons shows (every part's `shot`, lib/walk.mjs › textRules). */
  textRules: [{ re: ISLAND_NOUNS, what: 'no noun of the islands and never « قضيب » (the tool is « المقياس »)' }],
};

// ───────────────────────────── the gestures ─────────────────────────────
export function rcWorld(w, page, L) {
  const base = worldOf(w, page, L); // the world-generic ones: tp, act, start, leaveAndReturn, reload
  const { tp, act } = base;
  /**
   * The world's clock forward — after the kit's flight of a closed tablet to « قواعدي » (`kit/Tablet.jsx › flyToRules`,
   * 0.75 s of REAL time before the tablet is closed and the key earned): the walk lets the flight end first.
   */
  const ff = async (sec) => {
    const flying = await page.evaluate(() =>
      [...document.querySelectorAll('.di-card')].some((c) => c.style.transform.includes('scale(0.05)')),
    );
    if (flying)
      await page
        .waitForFunction(
          () => ![...document.querySelectorAll('.di-card')].some((c) => c.style.transform.includes('scale(0.05)')),
          null,
          { timeout: 3000 },
        )
        .catch(() => {});
    await base.ff(sec);
  };
  const { expect, check } = w;
  const s = () =>
    page.evaluate(() => {
      const g = window.__world;
      const x = g.getState();
      return {
        phase: x.phase,
        at: g.ter[x.at].id,
        overlay: x.overlay?.type ?? null,
        o: x.overlay,
        objective: x.objective ?? '',
        keys: x.keys,
        rod: x.rod ? { s: x.rod.s, a: x.rod.a, step: x.rod.step, steps: x.rod.steps, left: x.rod.left } : null,
        last: x.last,
        verdict: x.verdict,
        run: x.run,
        say: x.say?.text ?? '',
        holding: Boolean(g.hold),
      };
    });
  const blur = () => page.evaluate(() => document.activeElement?.blur?.());
  /** The « E » bubble as the screen shows it (null when none). */
  const prompt = () =>
    page.evaluate(() => {
      const el = document.querySelector('[data-di-wprompt]');
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return b.width > 0 && getComputedStyle(el).visibility !== 'hidden' ? el.textContent.trim() : null;
    });
  /** Places the robot (dev handle) where a thing of the world stands, then lets the world see him there. */
  const placeAt = async (where, label) => {
    const p = await page.evaluate((wh) => {
      const g = window.__world;
      if (wh.court) {
        const c = g.courts.find((x) => x.id === wh.court);
        return wh.pad ? [c.pad.x, c.pad.z] : [c.post.x, c.rail];
      }
      if (wh.yard) return [g.yards[0].post.x, g.yards[0].rail];
      const t = g.ter[g.getState().at];
      if (wh.feature) return [t.featureAt.x, t.featureAt.z + 2.4];
      const e = g.ter[g.endAt];
      return [e.x, e.z + 0.6];
    }, where);
    await tp(p[0], p[1]);
    await ff(0.4);
    await page.waitForTimeout(150);
    return label ? prompt() : null;
  };
  const until = async (test, sec = 20, step = 0.25) => {
    for (let t = 0; t < sec / step; t += 1) {
      if (test(await s())) return true;
      await ff(step);
    }
    return test(await s());
  };
  /** The rod in his hand, walked mark by mark along the wall (← → held) until its dial SHOWS `target`, released there. */
  const walkTo = async (target) => {
    await blur();
    for (let k = 0; k < 900; k += 1) {
      const r = (await s()).rod;
      expect(r, `he holds the rod while he walks to ${target}`);
      if (eq(r.s, target)) {
        await ff(0.08);
        const now = (await s()).rod.s;
        expect(eq(now, target), `released on the mark ${target}, the dial still shows ${now}`);
        return;
      }
      const dir = cmp(target, r.s) > 0 ? 'ArrowRight' : 'ArrowLeft';
      const marks =
        Math.abs(Number(write(q(target)).replace(',', '.')) - Number(r.s.replace(',', '.'))) /
        Number(r.step.replace(',', '.'));
      const hold = marks > 8 ? (r.step === '1' ? (marks - 1.5) / 3.1 : 0.2) : 0.04;
      await page.keyboard.down(dir);
      await ff(Math.max(0.04, Math.min(hold, 1.2)));
      await page.keyboard.up(dir);
      await ff(0.04);
    }
    expect(false, `the rod's dial reaches ${target}`);
  };
  /** Takes the rod at a post (E), once the bubble says so. */
  const grab = async (where, label) => {
    const said = await placeAt(where, true);
    expect(
      said?.includes('أمسك المقياس'),
      `${label}: at its corner post the screen offers « أمسك المقياس » (« ${said} »)`,
    );
    await act();
    await ff(0.2);
    expect((await s()).rod != null, `${label}: E — the rod is in his hand`);
  };
  /** E with the rod at a mark: the prediction typed when the world asks it; then the world's answer, checked HERE. */
  const lower = async (label, { predict, shotName, forbid, OUT }) => {
    const before = await s();
    const said = await prompt();
    expect(
      said?.includes(before.rod.s),
      `${label}: the bubble offers to lower the platform of ${before.rod.s} (« ${said} »)`,
    );
    await act();
    await ff(0.15);
    const want = platform({ q: before.rod.s }, before.rod.a);
    const asked = (await s()).overlay === 'predict';
    if (predict !== undefined) {
      expect(
        asked && (await page.locator('[data-rc-predict]').count()) === 1,
        `${label}: a rod of whole tiles asks a prediction first`,
      );
      const typed = predict === 'right' ? want.covers : String(Number(want.covers) + 3);
      await page.fill('[data-rc-predict]', typed);
      if (shotName) await w.shot(page, `${shotName}-predict`, OUT);
      await page.click('[data-rc-predict-go]');
      await ff(0.1);
    } else check(!asked, `${label}: a rod of fine marks asks no prediction`);
    expect(await until((x) => x.verdict != null, 10, 0.1), `${label}: the platform comes down and the world answers`);
    const v = await page.evaluate(() => {
      const el = document.querySelector('[data-di-verdict]');
      return {
        kind: el?.dataset.diVerdict ?? null,
        pred: el?.dataset.rcPredicted ?? null,
        text: el?.textContent ?? '',
      };
    });
    check(
      v.kind === want.kind && (want.kind === 'ride' || v.text.includes(want.diff)) && !WRONG_WORDS.test(v.text),
      `${label}: ${before.rod.s} × ${before.rod.s} = ${want.covers} on ${before.rod.a} — ${want.kind}${want.kind === 'ride' ? '' : ` of ${want.diff}`}, computed here; said as a fact (« ${v.text.trim().slice(0, 110)} »)`,
    );
    if (predict !== undefined)
      check(v.pred === String(predict === 'right'), `${label}: his prediction is judged (${v.pred})`);
    if (shotName) await worldShot(w, page, shotName, forbid, OUT);
    return want;
  };
  /** After a band or a jam: the platform back over the court, the world his again. After a ride: he lands on `to`. */
  const settle = async (to = null) => {
    expect(
      await until((x) => x.phase === 'play' && (!to || x.at === to), 30, 0.25),
      `the world is his again${to ? ` — he has landed on « ${to} »` : ''} (${JSON.stringify((await s()).at)})`,
    );
    await ff(0.3);
  };
  return { ...base, ff, s, prompt, placeAt, until, walkTo, grab, lower, settle, blur };
}

// ───────────────────────────── the rail of light (a course, or a practice level) ─────────────────────────────
/**
 * Plays the run open on the kit's rail: each gate's right lane is computed by `judge(ask, tex, gateText)` from what the
 * rail SHOWS (the order, its formula's source, the three numbers); gate `miss` (1-based) is taken wrong on purpose: its
 * fact is read, a heart is lost. Returns { score, hearts, won, total, misses }.
 */
export async function playRail(w, page, ff, judge, { miss = 2, label, OUT, shots = {} }) {
  const { expect, check } = w;
  const run = () =>
    page.evaluate(() => {
      const r = window.__world.getState().run;
      return r
        ? {
            stage: r.stage,
            n: r.n,
            lane: r.lane,
            hearts: r.hearts,
            score: r.score,
            won: r.won,
            total: r.total,
            why: r.why,
          }
        : null;
    });
  const seen = {};
  let missed = 0;
  let last = 0;
  for (let k = 0; k < 2000; k += 1) {
    const r = await run();
    if (!r || r.stage === 'over') break;
    if (r.stage === 'go' && r.n !== last) {
      last = r.n;
      await page.waitForTimeout(60);
      const g = await page.evaluate(() => ({
        // the order in words (its formula read apart, from its source)
        ask: (() => {
          const el = document.querySelector('[data-gr-ask] strong')?.cloneNode(true);
          el?.querySelectorAll('.gr-tex, .katex').forEach((k) => k.remove());
          return el?.textContent.trim() ?? '';
        })(),
        tex: document.querySelector('[data-gr-ask] annotation')?.textContent ?? null,
        gates: [...document.querySelectorAll('[data-gr-gate]')].map(
          (b) => b.querySelector('annotation')?.textContent ?? b.textContent.trim(),
        ),
      }));
      const right = g.gates.map((x) => judge(g.ask, g.tex, x));
      expect(
        right.filter(Boolean).length === 1,
        `${label}, gate ${r.n}: « ${g.ask.replace(/\s+/g, ' ').slice(0, 50)} » ${g.tex ?? ''} — exactly ONE of ${g.gates.join(' / ')} is right, computed here`,
      );
      let want = right.indexOf(true);
      if (r.n === miss) {
        want = (want + 1) % 3;
        missed += 1;
      }
      for (let d = r.lane; d !== want; d += Math.sign(want - d)) {
        await page.keyboard.press(want > d ? 'ArrowRight' : 'ArrowLeft');
        await ff(0.08);
      }
      const now = await run();
      check(now.lane === want, `${label}, gate ${r.n}: ← → bring him to lane ${want} (${now.lane})`);
      if (shots[r.n]) await w.shot(page, shots[r.n], OUT);
      seen[r.n] = { want, right: right.indexOf(true) };
    }
    if (r.stage === 'hit' && !seen[`hit${r.n}`]) {
      seen[`hit${r.n}`] = true;
      await page.waitForTimeout(150);
      const why = ((await page.textContent('[data-gr-why]').catch(() => '')) ?? '').trim();
      check(
        r.n === miss && why.length > 4 && !WRONG_WORDS.test(why),
        `${label}, gate ${r.n} (taken wrong on purpose): the run stops on its FACT, never « wrong » (« ${why.slice(0, 90)} »); ${r.hearts} hearts left`,
      );
      if (shots.fact) await w.shot(page, shots.fact, OUT);
    }
    await ff(0.2);
  }
  const end = await run();
  return { ...(end ?? {}), misses: missed };
}

// ───────────────────────────── the story ─────────────────────────────
const KEY_OF = (L, kind) => L.lesson.story.terraces.find((t) => t.feature?.kind === kind)?.feature.forge;

export async function rcStoryWalk(L, D, opts) {
  const w = createWalk(`lesson-${L.id}-story`, opts);
  const { expect, check } = w;
  const OUT = { exit: ['[data-di-exit]', '.di-top a.di-icon'], numbers: true };
  const ST = L.lesson.story;
  const keys = L.lesson.keys;
  const [K1, K2, K3] = [KEY_OF(L, 'mirror'), KEY_OF(L, 'calculator'), KEY_OF(L, 'stations')];
  const court = (id) =>
    ST.terraces.flatMap((t) => t.courts.map((c) => ({ ...c, terrace: t.id }))).find((c) => c.id === id);
  const T0 = Date.now();
  const lap = (what) => console.log(`TIME  ${what}: ${Math.round((Date.now() - T0) / 1000)} s`);

  await w.run(async () => {
    const { page } = await w.student({ uid: D.uid ?? 9900, lessonId: L.id, url: L.url, grade: L.grade });
    const W = rcWorld(w, page, L);
    const { s, ff, act } = W;
    const wordsOf = (key) => [...(D.forbidden?.[key] ?? []), L.lesson.rules[key].title];
    let earned = [];
    const forbid = () =>
      wordsRe([
        ...keys.filter((k) => !earned.includes(k)).flatMap(wordsOf),
        ...(earned.length < keys.length ? (D.benchForbidden ?? []) : []),
      ]);
    const placesForbid = () => wordsRe(keys.filter((k) => !earned.includes(k)).flatMap(wordsOf));
    // every screen of the story: never « wrong »; before key 🔑's tablet, never the sign √ nor « جذر » (D.beforeFirst)
    const shot0 = w.shot;
    w.shot = async (pg, label, o) => {
      // the lesson's own name on its title screen (the platform's, « الجذر التربيعي لعدد موجب ») is not the world telling
      const t = await pg.evaluate(() => {
        const c = document.body.cloneNode(true);
        c.querySelectorAll('.di-title__eyebrow').forEach((e) => e.remove());
        return c.innerText ?? c.textContent;
      });
      const m = t.match(WRONG_WORDS);
      check(!m, `${label}: no screen says « wrong »${m ? ` — « ${m[0]} »` : ''}`);
      // the tablet of 🔑 is where the word and the sign are said first
      if (!earned.includes(K1) && D.beforeFirst && label !== 'tablet-1') {
        const b = t.match(D.beforeFirst);
        check(!b, `${label}: before the first tablet, no « √ » and no « جذر »${b ? ` — « ${b[0]} »` : ''}`);
      }
      return shot0(pg, label, o);
    };
    const shotWorld = (label) => worldShot(w, page, label, placesForbid(), OUT);
    const ctx = { w, page, W, L, D, OUT, forbid, forbidOf: (k) => wordsRe(wordsOf(k)), startLabel: null, first: true };
    ctx.hook = async (name) => {
      const step = D.steps?.[name];
      if (step) {
        console.log(`NOTE  the lesson's own step « ${name} »`);
        await step(ctx);
      }
    };
    const forge = async (key, how) => {
      const o = await s();
      expect(o.overlay === 'forge', `${how}: the forge « ${key} » opens (${o.overlay})`);
      await playForge(ctx, key);
      ctx.first = false;
      earned = (await s()).keys;
      await ff(0.6);
      await page.waitForTimeout(300);
      lap(`forge ${key}`);
    };
    const objIs = async (what, re) => {
      const o = (await s()).objective;
      check(re.test(o), `${what}: the instruction says so (« ${o} »)`);
    };
    /** Rides a court: rod to its side mark, the prediction (right), E — he lands on its terrace. */
    const ride = async (id, side, label) => {
      const c = court(id);
      await W.grab({ court: id }, label);
      await W.walkTo(side);
      await worldShot(w, page, `${label}-rod`, placesForbid(), OUT);
      const out = await W.lower(label, { predict: 'right', shotName: label, forbid: placesForbid(), OUT });
      expect(out.kind === 'ride', `${label}: ${side} × ${side} = ${c.a}: the platform rides — computed here`);
      await W.settle(c.to);
      await shotWorld(`landed-${c.to}`);
    };

    // ══ the title ══
    await page.waitForSelector('[data-di-start]', { timeout: 30000 });
    await page.waitForTimeout(1200);
    if (L.config?.title)
      check(
        ((await page.textContent('.di-title__eyebrow').catch(() => '')) ?? '').includes(L.config.title),
        `the title names the lesson « ${L.config.title} »`,
      );
    await w.shot(page, 'title', OUT);
    ctx.startLabel = await W.start();
    expect((await s()).phase === 'play', 'the game starts in play phase');
    await ff(0.6);
    lap('title');

    // ══ the yard: crates laid as squares — from the number of tiles to the side ══
    const crates = ST.terraces[0].yard?.crates ?? [];
    expect(crates.length >= 1, `the first terrace has a building yard (${crates.join(', ')})`);
    await objIs('the opening', new RegExp(crates[0]));
    {
      const first = ST.terraces[0].courts[0];
      const said = await W.placeAt({ court: first.id }, true);
      check(!said, `the court of ${first.a} offers nothing before the yard is built (« ${said} »)`);
    }
    for (const [ci, crate] of crates.entries()) {
      const side = Number(isqrt(Number(crate)));
      await W.grab({ yard: true }, `crate ${crate}`);
      // the first crate: a side that leaves tiles, one that lacks tiles, then the exact one
      const tries = ci === 0 ? [side - 1, side + 1, side] : [side];
      for (const t of tries) {
        await W.walkTo(String(t));
        const r = (await s()).rod;
        check(
          Number(r.left) === Number(crate) - t * t,
          `crate ${crate}, a side of ${t}: the crate counts ${crate} − ${t * t} = ${Number(crate) - t * t} (${r.left})`,
        );
        if (ci === 0) await worldShot(w, page, `yard-${crate}-side-${t}`, placesForbid(), OUT);
        const said = await W.prompt();
        check(
          said?.includes(String(t)),
          `crate ${crate}: the bubble offers to fix the square of side ${t} (« ${said} »)`,
        );
        await act();
        expect(await W.until((x) => x.verdict != null, 8, 0.1), `crate ${crate}, ${t}: the world answers`);
        const want = platform({ q: String(t) }, crate);
        const v = await page.evaluate(() => ({
          kind: document.querySelector('[data-di-verdict]')?.dataset.diVerdict,
          text: document.querySelector('[data-di-verdict]')?.textContent ?? '',
        }));
        check(
          v.kind === want.kind && (want.kind === 'ride' || v.text.includes(want.diff)) && !WRONG_WORDS.test(v.text),
          `crate ${crate}, side ${t}: ${t} × ${t} = ${t * t} — ${want.kind === 'band' ? `${want.diff} tiles left` : want.kind === 'jam' ? `${want.diff} cells open` : 'the crate is empty and no cell open'} (« ${v.text.trim().slice(0, 80)} »)`,
        );
        if (ci === 0 || want.kind === 'ride')
          await worldShot(w, page, `yard-${crate}-${want.kind}`, placesForbid(), OUT);
        await W.settle();
      }
      expect(!(await s()).holding, `crate ${crate} built: the rod has left his hand`);
    }
    lap('the yard');

    // ══ the court of 30: rods 5 (a band) and 6 (a jam), the rod put down at any length ══
    const first = ST.terraces[0].courts[0];
    const small = ST.terraces[0].courts[1];
    const below = Number(isqrt(Number(first.a)));
    await objIs('the yard done', new RegExp(first.a));
    await W.grab({ court: first.id }, `the court of ${first.a}`);
    // D26: whatever he takes he can put down at any moment — the key X, then the button « ضع المقياس »
    await W.walkTo('3');
    await page.keyboard.press('KeyX');
    await ff(0.2);
    check(!(await s()).holding && (await s()).rod == null, 'X: the rod is put down half-way (at 3)');
    await W.grab({ court: first.id }, `the court of ${first.a} again`);
    await W.walkTo('2');
    await worldShot(w, page, 'rod-in-hand-drop-button', placesForbid(), OUT);
    await page.click('[data-rc-drop]');
    await ff(0.2);
    check(!(await s()).holding, '« ضع المقياس »: the button puts the rod down too (at 2)');
    await W.grab({ court: first.id }, `the court of ${first.a}, a third time`);
    await W.walkTo(String(below));
    await W.lower(`${first.a} with ${below}`, {
      predict: 'right',
      shotName: `court-${first.a}-band`,
      forbid: placesForbid(),
      OUT,
    });
    await W.settle();
    {
      const x = await s();
      check(
        x.holding && x.last?.kind === 'band',
        `after the band the rod stays in his hand, its last fact beside it (${x.last?.kind})`,
      );
      await worldShot(w, page, `court-${first.a}-band-back`, placesForbid(), OUT);
    }
    await W.walkTo(String(below + 1));
    await W.lower(`${first.a} with ${below + 1}`, {
      predict: 'wrong',
      shotName: `court-${first.a}-jam`,
      forbid: placesForbid(),
      OUT,
    });
    await W.settle();
    {
      const x = await s();
      check(!x.holding && x.rod == null, `a band AND a jam seen: the rod returns to its post BY ITSELF (D24)`);
      check(
        new RegExp(small.a).test(x.objective),
        `…and the instruction names the court of ${small.a} (« ${x.objective} »)`,
      );
      await worldShot(w, page, `court-${first.a}-released`, placesForbid(), OUT);
    }
    lap('the court of 30');

    // ══ courts 16 and 36: each asks a prediction first ══
    await ride(small.id, String(isqrt(Number(small.a))), `court-${small.a}`);
    {
      // D30: the platform already ridden offers NO flight while this terrace is unfinished
      const said = await W.placeAt({ court: small.id, pad: true }, true);
      check(!said, `on « ${small.to} », unfinished, the platform of ${small.a} offers no flight back (« ${said} »)`);
    }
    const palm = ST.terraces.find((t) => t.id === small.to).courts[0];
    await ride(palm.id, String(isqrt(Number(palm.a))), `court-${palm.a}`);
    lap('courts 16 and 36');

    // ══ the third terrace: the gate of light, the course of 14 gates ══
    const runT = ST.terraces.find((t) => t.feature?.kind === 'run');
    expect((await s()).at === runT.id, `he stands on « ${runT.name} »`);
    {
      const c = runT.courts[0];
      const said = await W.placeAt({ court: c.id }, true);
      check(!said, `the court of ${c.a} offers nothing before the course (« ${said} »)`);
    }
    {
      const said = await W.placeAt({ feature: true }, true);
      expect(said?.includes(runT.feature.prompt), `the gate of light offers « ${runT.feature.prompt} » (« ${said} »)`);
      await shotWorld('run-gate');
      await act();
      await page.waitForSelector('[data-gr-run="ready"]');
      await w.shot(page, 'run-ready', { ...OUT, exit: ['[data-gr-leave]'] });
      await page.click('[data-gr-start]');
      await ff(0.3);
      const total = (await s()).run.total;
      const res = await playRail(w, page, ff, D.run, {
        miss: 3,
        label: 'the course',
        OUT: { exit: ['[data-gr-leave]'], numbers: false },
        shots: { 2: 'run-gate-2', fact: 'run-fact', 12: 'run-cube' },
      });
      check(
        res.stage === 'over' && res.won && res.score === total - 1 && res.hearts === 2,
        `the course: ${res.score} of ${total} gates, one missed on purpose, ${res.hearts} hearts left — passed whole (${JSON.stringify(res)})`,
      );
      await w.shot(page, 'run-over', { exit: ['[data-gr-leave]'] });
      await page.click('[data-gr-leave]');
      await ff(0.6);
      expect((await s()).phase === 'play' && (await s()).run == null, 'leaving the rail: back on the terrace');
    }
    lap('the course');
    const wind = runT.courts[0];
    await ride(wind.id, String(isqrt(Number(wind.a))), `court-${wind.a}`);

    // ══ the hall of mirrors: forge 1 ══
    const hall = ST.terraces.find((t) => t.feature?.kind === 'mirror');
    {
      const said = await W.placeAt({ feature: true }, true);
      expect(said?.includes(hall.feature.prompt), `the mirror offers « ${hall.feature.prompt} » (« ${said} »)`);
      await shotWorld('mirror');
      await act();
      await ff(0.3);
      await forge(K1, 'the mirror');
    }
    // the tablet closed: it flew to « قواعدي » in the top bar, which opens the rules sheet (D33)
    {
      expect(
        (await page.locator('[data-di-rules]').count()) === 1,
        'the tablet closed: « قواعدي » stands in the top bar',
      );
      await page.click('[data-di-rules]');
      await page.waitForTimeout(400);
      const o = await s();
      check(
        o.overlay === 'rules' &&
          ((await page.textContent('.di-veil').catch(() => '')) ?? '').includes(L.lesson.rules[K1].title),
        `« قواعدي » opens the rules sheet on « ${L.lesson.rules[K1].title} » (${o.overlay})`,
      );
      await w.shot(page, 'rules-sheet', { exit: ['[data-di-rules-close]'] });
      await page.click('[data-di-rules-close]');
      await ff(0.3);
      expect((await s()).overlay == null, 'closing the sheet: back in the hall');
    }
    // a page RELOADED in the middle of the journey: it resumes where he was, with what he owns
    {
      await W.reload();
      const x = await s();
      check(
        x.at === hall.id && x.keys.includes(K1) && x.phase === 'play',
        `reloaded after forge 1: the journey resumes in « ${hall.name} », the key kept (${x.at}, ${x.keys.join(',')})`,
      );
      await shotWorld('after-reload');
    }
    const back = hall.courts[0];
    await objIs('back to the first terrace', new RegExp(back.a));
    await ride(back.id, String(isqrt(Number(back.a))), `court-${back.a}`);

    // ══ back on the court of 30: the fine marks ══
    {
      const said = await W.placeAt({ feature: true }, true);
      check(!said, `the calculator offers nothing before the nearest mark is found (« ${said} »)`);
    }
    await W.grab({ court: first.id }, `the court of ${first.a}, the fine marks`);
    {
      const r = (await s()).rod;
      check(r.steps.length === 3, `the rod's dial has its finer marks (${r.steps.join(' · ')})`);
    }
    const near = D.nearest(first.a); // the walk's own: the longest rod of two decimals that still leaves a band
    const tenth = near.slice(0, -1);
    await page.click(`[data-rc-set-step="0,1"]`);
    await W.walkTo(tenth);
    await W.lower(`${first.a} with ${tenth}`, { shotName: `fine-${tenth}`, forbid: placesForbid(), OUT });
    await W.settle();
    await page.click(`[data-rc-set-step="0,01"]`);
    const above = write(sub(near, '-0,01'));
    await W.walkTo(above);
    await W.lower(`${first.a} with ${above}`, { shotName: `fine-${above}-jam`, forbid: placesForbid(), OUT });
    await W.settle();
    await W.walkTo(near);
    await worldShot(w, page, `fine-${near}-rod`, placesForbid(), OUT);
    await W.lower(`${first.a} with ${near}`, { shotName: `fine-${near}`, forbid: placesForbid(), OUT });
    await W.settle();
    {
      const x = await s();
      check(x.say.includes(near) && /أحسنت/.test(x.say), `${near}: the success is SAID (« ${x.say.slice(0, 80)} »)`);
      check(!x.holding && x.rod == null, `${near}: the rod has left his hand by itself`);
      const beam = await page.evaluate(() => {
        const g = window.__world;
        return Boolean(g.ter[g.getState().at].beam?.beam.visible);
      });
      check(beam, `${near}: the column of light stands on the calculator now`);
      await shotWorld('beam-on-calculator');
    }
    lap('the fine marks');

    // ══ forge 2 at the calculator ══
    {
      const said = await W.placeAt({ feature: true }, true);
      expect(said?.length > 0, `the calculator calls him (« ${said} »)`);
      await act();
      await ff(0.3);
      await forge(K2, 'the calculator');
    }
    // ══ the rod clamped corner to corner, on a WHOLE mark ══
    await W.grab({ court: first.id }, `the court of ${first.a}, the wall`);
    await objIs('the wall', /الركن/);
    await W.walkTo(String(below - 1));
    {
      const said = await W.prompt();
      check(!/ثبّت/.test(said ?? ''), `at ${below - 1}, far from the corner: no clamp offered (« ${said} »)`);
    }
    await W.walkTo(String(below));
    {
      const said = await W.prompt();
      check(
        /ثبّت/.test(said ?? ''),
        `stopped ON the whole mark ${below}, at the far corner: « ثبّت المقياس على الركن » (« ${said} ») — D29`,
      );
      await worldShot(w, page, 'clamp-prompt', placesForbid(), OUT);
    }
    await act();
    expect(await W.until((x) => x.verdict != null, 8, 0.1), 'the clamped rod: the world answers');
    {
      const v = await page.getAttribute('[data-di-verdict]', 'data-di-verdict');
      check(
        v === platform({ root: first.a }, first.a).kind,
        `the rod taken from the wall of ${first.a} rides — computed here (${v})`,
      );
      await shotWorld('wall-rides');
    }
    await W.settle(first.to);
    await shotWorld(`landed-${first.to}`);

    // ══ the two stations: forge 3 ══
    {
      if ((await s()).overlay !== 'forge') {
        const said = await W.placeAt({ feature: true }, true);
        expect(said?.length > 0, `the stations call him (« ${said} »)`);
        await shotWorld('stations');
        await act();
        await ff(0.3);
      }
      await forge(K3, 'the stations');
    }
    const last = ST.terraces.find((t) => t.id === first.to).courts[0];
    await ride(last.id, String(isqrt(Number(last.a))), `court-${last.a}`);

    // ══ the pavilion: the final mission ══
    {
      const said = await W.placeAt({ pavilion: true }, true);
      expect(said?.includes(ST.mission.prompt), `the pavilion offers « ${ST.mission.prompt} » (« ${said} »)`);
      await shotWorld('pavilion');
      await act();
      await page.waitForSelector('[data-rc-mission]');
      const lead = await page.locator('.rc-mission__lead').allTextContents();
      const sol = D.mission(lead.join(' '));
      const near1 = { ...sol, side: sol.side - 1 };
      for (const [k, v] of Object.entries(near1)) await page.fill(`[data-rc-mission] [data-rf-use="${k}"]`, String(v));
      await page.click('[data-rc-mission-check]');
      await page.waitForTimeout(250);
      const f = ((await page.textContent('[data-rc-mission-fact]').catch(() => '')) ?? '').trim();
      check(
        f.length > 5 && !WRONG_WORDS.test(f) && f.includes(String(sol.side - 1)),
        `a near miss (${sol.side - 1}): the mission answers with a FACT (« ${f.slice(0, 90)} »)`,
      );
      await w.shot(page, 'mission-fact', OUT);
      await page.fill('[data-rc-mission] [data-rf-use="side"]', String(sol.side));
      await page.click('[data-rc-mission-check]');
      await ff(0.4);
      check((await s()).overlay !== 'mission', `the mission solved (${JSON.stringify(sol)} — computed here)`);
    }
    expect(await W.until((x) => x.overlay === 'end', 20, 0.25), 'the end screen shows');
    await w.shot(page, 'end', OUT);
    lap('the end');
  });
  return w;
}

// ───────────────────────────── the hub: a practice level on the rail ─────────────────────────────
/**
 * « واصل التدريب » on the practice hub: the level it proposes is run on the kit's rail (`Game.startPractice`): every gate
 * judged by `descriptor.run`, the second taken wrong on purpose (its fact, a heart), then the kit's result card — its
 * stars are the hearts left — and back to the hub, then to the title screen.
 */
async function rcPractice({ w, page, D, TEXT }) {
  const { expect, check, shot, ff } = w;
  const st = () =>
    page.evaluate(() => ({
      phase: window.__world.getState().phase,
      overlay: window.__world.getState().overlay,
      run: window.__world.getState().run,
    }));
  const nextName = ((await page.textContent('[data-di-next]')) ?? '').trim();
  expect(
    Object.values(TEXT.levels)
      .flat()
      .some((x) => nextName.includes(x)),
    `« واصل التدريب » proposes one of the lesson's levels (« ${nextName} »)`,
  );
  await page.click('[data-di-next]');
  await ff(page, 0.4);
  let x = await st();
  expect(
    x.phase === 'run' && x.run?.stage === 'go' && x.run.hearts === 3,
    `the level runs on the rail of light: 3 hearts (${x.run?.stage}, ${x.run?.total} gates)`,
  );
  const total = x.run.total;
  const res = await playRail(w, page, (sec) => ff(page, sec), D.run, {
    miss: 2,
    label: 'practice',
    OUT: { exit: ['[data-gr-leave]'], numbers: false },
    shots: { 1: 'practice-gate', fact: 'practice-fact' },
  });
  expect(
    await page
      .waitForSelector('[data-di-result]', { timeout: 15000 })
      .then(() => true)
      .catch(() => false),
    'the level is over: the result card of the kit',
  );
  x = await st();
  const o = x.overlay;
  check(
    o?.type === 'result' && o.win && o.stars === 2 && o.mistakes === 1 && res.misses === 1,
    `the result: won, ${o?.stars} stars = the hearts left after ONE gate missed on purpose (${total} gates; ${JSON.stringify({ win: o?.win, stars: o?.stars, mistakes: o?.mistakes })})`,
  );
  await shot(page, 'practice-result', { exit: ['[data-di-result-map]', '[data-di-exit]'], numbers: false });
  await page.click('[data-di-result-map]');
  await page.waitForSelector('[data-di-mapcard]');
  check((await st()).overlay?.type === 'map', '« الخريطة » on the result card comes back to the hub');
  await page.click('[data-di-map-close]');
  await page.waitForSelector('[data-di-start]');
  expect((await st()).phase === 'title', 'the hub closed: back on the title screen');
}

// ───────────────────────────── the board: a `court` station ─────────────────────────────
/**
 * A `court` station of « حصّة القسم » (`features/classSession/LessonBoard.jsx › CourtStation`): every card that does NOT
 * ride is lowered first — the world answers each with its fact —, then every card that rides; each card's
 * verdict is computed HERE (./exact.mjs) and read on its card; the proof (`after`) waits until the riding cards were
 * lowered (every card, when none rides).
 */
export async function boardCourt({ page, check, expect, shot, clean, step }) {
  const area = step.area != null ? String(step.area) : null;
  const rodOf = (x) => (typeof x === 'object' ? (x.root != null ? { root: x.root } : { q: x.q }) : { q: String(x) });
  const keyOf = (r) => (r.root != null ? `√${r.root}` : r.q);
  const cards = step.areas
    ? step.areas.map((a) => ({ key: String(a), out: platform(rodOf(step.rod), String(a)) }))
    : step.rods.map((x) => ({ key: keyOf(rodOf(x)), out: platform(rodOf(x), area) }));
  const rides = cards.filter((c) => c.out.kind === 'ride');
  const others = cards.filter((c) => c.out.kind !== 'ride');
  const shown = await page.$$eval('[data-cs-court-card]', (els) => els.map((e) => e.dataset.csCourtCard));
  expect(
    shown.join('|') === cards.map((c) => c.key).join('|'),
    `${step.id}: the cards on the board are ${cards.map((c) => c.key).join(', ')}`,
  );
  await clean(`${step.id}-open`);
  await shot(`court-${step.id}-open`);
  const lowerCard = async (c) => {
    await page.click(`[data-cs-court-card="${c.key}"]`);
    await page.click('[data-cs-court-lower]');
    await page.waitForFunction(
      (k) => document.querySelector(`[data-cs-court-card="${k}"]`)?.dataset.csCourtKind,
      c.key,
      { timeout: 8000 },
    );
    const kind = await page.getAttribute(`[data-cs-court-card="${c.key}"]`, 'data-cs-court-kind');
    check(
      kind === c.out.kind,
      `${step.id}: the card ${c.key} ${step.areas ? `under the rod ${keyOf(rodOf(step.rod))}` : `over ${area}`} — ${c.out.kind}${c.out.kind === 'ride' ? '' : ` (${c.out.diff})`}, computed here (${kind})`,
    );
  };
  // every card: those that do not ride first (each answered by its fact), the riding ones last — the proof comes then
  const order = [...others, ...rides];
  for (const [i, c] of order.entries()) {
    await lowerCard(c);
    const after = (await page.locator('[data-cs-court-after]').count()) > 0;
    const shouldShow = i === order.length - 1;
    check(
      after === shouldShow,
      `${step.id}: the proof ${shouldShow ? 'shows once every riding card was lowered' : 'waits'} (${after})`,
    );
    if (i === 0 && others.length && rides.length) await shot(`court-${step.id}-fact`);
    // the calculator's card: its band is too thin for the eye — the world writes it
    if (/^\d+,\d{6,}$/.test(c.key)) await shot(`court-${step.id}-calculator`);
  }
  check(
    JSON.stringify(rides.map((c) => c.key)) === JSON.stringify(step.answer),
    `${step.id}: the cards that ride are ${rides.map((c) => c.key).join(', ') || 'none'} — the script's answer (${step.answer.join(', ') || 'none'})`,
  );
  await clean(step.id);
  const said = await page.evaluate(() => document.querySelector('.cs-root').innerText);
  for (const rule of ROOT_COURTS.textRules) {
    const m = said.match(rule.re);
    check(!m, `${step.id}: ${rule.what}${m ? ` — « ${m[0].trim()} »` : ''}`);
  }
  await shot(`court-${step.id}`);
}
