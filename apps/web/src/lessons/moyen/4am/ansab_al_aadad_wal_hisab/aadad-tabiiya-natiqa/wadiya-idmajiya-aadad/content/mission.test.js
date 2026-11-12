import { describe, it, expect } from 'vitest';
import * as divisibility from '@smarter-academy/core/arithmetic/divisibility.js';
import { PROBLEMS } from './problems.js';
import { textViolations, violations, visibleLines } from './forbidden.js';
import { LESSON_KNOWLEDGE } from '../knowledge.jsx';
import { KNOWLEDGE_GRAPH } from '../knowledgeGraph.js';
import { LESSON_CONFIG } from '../lesson.config.js';
import { M7_ROUNDS, SUPPLY, SUPPLY_EASY, STORE, STORE_EASY, FREE_PAIRS, gcd } from './rounds.js';
import { PEER_SHEET, PEER_KID } from './peerSheet.js';
import { PREP_LADDER, PREP_PAIRS } from './prep.js';
import { chipsAround } from '../../../../../../common/manipulations/divisibility/divisionChecks.js';
import { QUESTIONS as EUCLID_Q, CHAINS_SHARE } from '../../../../../../common/manipulations/divisibility/EuclidAlgorithm.jsx';
import { emptyLog, logEvent, roundWon, starsFor, easierProps } from '../../../../../../common/manipulations/rounds/roundsModel.js';
import module7Src from '../modules/Module07TahlilWadiya.jsx?raw';

const knowledgeOf = import.meta.glob('../../*/knowledge.jsx', { eager: true });
const lessonContent = import.meta.glob(['../../*/content/*.js', '!../../*/content/*.test.js', '!../../wadiya-idmajiya-aadad/**'], { eager: true });
const peerSheets = import.meta.glob('../../../../../../**/content/peerSheet.js', { eager: true });

/**
 * La synthèse de l'unité 1 dans le lecteur de mission (2026-11-12, recette PROVISOIRE de la synthèse) — LE BALAYAGE PAR RÔLE, écrit AVANT la
 * conversion : tout ce qu'un écran avant le module 7 ou le défi 🏆 peut montrer, contre la signature du défi (module 8, jamais retouché) et la
 * situation de l'unité (module 7) : content/forbidden.js. Il a d'abord ÉCHOUÉ sur la carte des معارف ouverte (le nœud racine montrait la وضعية).
 */
const json = (x) => JSON.stringify(x).replace(/\\\\/g, '\\');
const cardText = (item) => json({ title: item.title, summary: item.summary, memo: item.memo, body: item.body });
/** Ce qu'une étape tapée d'un entraînement TROUVE (le rôle du nombre d'écoles et des parts du défi). */
const found = (p) => p.parts.flatMap((part) => part.steps).filter((s) => s.kind === 'numeric').map((s) => s.expected);

describe('the synthesis — role scan of every screen before its time', () => {
  it('the six trainings never show the challenge (module 8) nor the unit situation (module 7)', () => {
    PROBLEMS.forEach((p) => expect(textViolations(json(p), p.id)).toEqual([]));
  });
  it('no training FINDS a number of the challenge (13 schools, 72 or 65 each, a remainder 91 or 26)', () => {
    PROBLEMS.forEach((p) => found(p).forEach((v) => expect([13, 72, 65, 91, 26], `${p.id}: ${v}`).not.toContain(v)));
  });
  it('the memo cards (open from the first screen) never hold the situation nor the challenge\'s answer', () => {
    const items = Object.values(LESSON_KNOWLEDGE.modules).flat();
    items.forEach((item) => expect(textViolations(cardText(item), item.id)).toEqual([]));
  });
  it('the knowledge map (open from the first screen) never shows them either', () => {
    KNOWLEDGE_GRAPH.nodes.forEach((node) => expect(textViolations(json(node), node.id)).toEqual([]));
  });
  it('the role scan catches what it must (negative controls)', () => {
    ['936 مئزرًا', '$936 = 845 \\times 1 + 91$', 'PGCD$(936 ; 845) = 13$', '13 مدرسة', '72 مئزرًا ورديًا', 'الباقي 26', '$936 - 845 = 91$', 'المآزر']
      .forEach((s) => expect(textViolations(s).length, s).toBeGreaterThan(0));
    ['133 زهرة', '1.30 م', '2026', '$x = 1{,}3$', '$PGCD(84 ; 36) = 12$', 'الكراريس', '613', '7 باقات']
      .forEach((s) => expect(textViolations(s), s).toEqual([]));
    // module 7 may show the situation, never its solution
    expect(textViolations('PGCD$(936 ; 845)$', 'm7', { before7: false })).toEqual([]);
    expect(textViolations('936 مئزرًا ورديًا', 'm7', { before7: false })).toEqual([]);
    expect(textViolations('PGCD$(936 ; 845) = 13$', 'm7', { before7: false }).length).toBeGreaterThan(0);
    expect(violations([{ role: 'pgcd', v: '13' }, { role: 'share', v: '72' }, { role: 'remainder', v: '26' }, { role: 'pair', v: '936' }])).toHaveLength(4);
    expect(violations([{ role: 'pgcd', v: '17' }, { role: 'share', v: '48' }, { role: 'remainder', v: '119' }, { role: 'groups', v: '8' }])).toEqual([]);
  });
});

/* ── les manches du module 7 : chaque écran balayé (recalculé par core), chaque manche jouée jusqu'à son but ── */
/** Ce qu'un écran du labo des GROUPES peut montrer : les écoles essayées de 1 au-delà du PGCD, les restes, la part, les jetons. */
function shownGroups({ a, b }) {
  const g = gcd(a, b);
  const out = [{ role: 'pair', v: a }, { role: 'pair', v: b }, { role: 'pgcd', v: g }, { role: 'share', v: a / g }, { role: 'share', v: b / g }];
  for (let k = 1; k <= g + 1; k += 1) out.push({ role: 'groups', v: k }, { role: 'remainder', v: a % k }, { role: 'remainder', v: b % k });
  [g, a / g, b / g].forEach((x) => chipsAround(x, { min: 1 }).forEach((v) => out.push({ role: 'chip', v })));
  return out;
}
/** Ce qu'un écran d'EUCLIDE peut montrer : chaque division, ses prédictions, le PGCD, la part (chaîne `share`). */
function shownEuclid({ a, b }) {
  const { steps, gcd: g } = divisibility.euclidSteps(a, b);
  const out = [{ role: 'pair', v: a }, { role: 'pair', v: b }, { role: 'pgcd', v: g }, { role: 'share', v: a / g }, { role: 'share', v: b / g }];
  steps.forEach((s) => {
    out.push({ role: 'quotient', v: s.q }, { role: 'remainder', v: s.r }, { role: 'pair', v: s.a }, { role: 'pair', v: s.b });
    chipsAround(s.q, { min: 1 }).forEach((v) => out.push({ role: 'chip', v }));
  });
  return out;
}
const shownOf = (p) => (p.type === 'euclidean-algorithm' ? shownEuclid(p) : shownGroups(p));
const ALL = M7_ROUNDS.flatMap((r) => [{ id: r.id, round: r, props: r.props }, ...(r.easier ? [{ id: `${r.id}-easy`, round: r.easier, props: easierProps(r) }] : [])]);

describe('module 7 « وضعية الوحدة » — the rounds', () => {
  it('two required rounds (r1 groups by hand, r2 Euclid with predictions), their practice rounds RELEASE them, then the free lab; no ⭐', () => {
    expect(M7_ROUNDS.map((r) => r.id)).toEqual(['r1', 'r2', 'free']);
    expect(M7_ROUNDS.filter((r) => r.easier).every((r) => r.easier.releases)).toBe(true);
    expect(M7_ROUNDS.filter((r) => !r.free).every((r) => !r.optional)).toBe(true);
    expect(M7_ROUNDS[0].props).toMatchObject({ type: 'common-divisors', chains: ['groups'], predict: false });
    expect(M7_ROUNDS[1].props).toMatchObject({ type: 'euclidean-algorithm', chains: ['pgcd'], predict: true });
    expect(M7_ROUNDS[1].props.share).toBeTruthy();
  });
  it('the numbers, recomputed: r1 → 7 schools (6 + 5), r2 → 17 (119, 102, 17, 0; 48 + 41); practice 3 and 19', () => {
    expect([gcd(SUPPLY.a, SUPPLY.b), SUPPLY.a / 7, SUPPLY.b / 7]).toEqual([7, 6, 5]);
    expect(divisibility.euclidSteps(STORE.a, STORE.b).steps.map((s) => s.r)).toEqual([119, 102, 17, 0]);
    expect([STORE.a / 17, STORE.b / 17]).toEqual([48, 41]);
    expect(gcd(SUPPLY_EASY.a, SUPPLY_EASY.b)).toBe(3);
    expect(gcd(STORE_EASY.a, STORE_EASY.b)).toBe(19);
  });
  it('every Euclid pair is valid for its lab (neither divides the other, ≤ 12 divisions); every practice round is smaller', () => {
    [STORE, STORE_EASY, ...FREE_PAIRS].forEach(({ a, b }) => {
      expect(Math.max(a, b) % Math.min(a, b), `${a},${b}`).not.toBe(0);
      expect(divisibility.euclidSteps(a, b).steps.length).toBeLessThanOrEqual(12);
    });
    expect(SUPPLY_EASY.a).toBeLessThan(SUPPLY.a);
    expect(STORE_EASY.a).toBeLessThan(STORE.a);
    expect(FREE_PAIRS.some((c) => c.a === M7_ROUNDS[2].props.a && c.b === M7_ROUNDS[2].props.b)).toBe(true);
  });
  it('the dry-run: every value any round, practice round or free pair can show is clean (role-paired)', () => {
    ALL.forEach(({ id, props }) => expect(violations(shownOf(props), id), id).toEqual([]));
    FREE_PAIRS.forEach((p) => expect(violations(shownEuclid(p), `free ${p.a}/${p.b}`)).toEqual([]));
    M7_ROUNDS.forEach((r) => [r.props, r.easier && easierProps(r)].filter(Boolean).forEach((p) => {
      expect(textViolations(`${r.title} ${p.lead} ${r.easier?.helpLine ?? ''}`, r.id)).toEqual([]);
      expect(p.lead).not.toMatch(/\bDA\b|الكتاب/);
    }));
  });
  it('r2 ends on the NUMERICAL build 816 = 17 × 48 (the share chain): its tiles hold a decoy, the other share', () => {
    expect(CHAINS_SHARE.pgcd[CHAINS_SHARE.pgcd.length - 1]).toBe('share');
    const lab = { ...divisibility.euclidSteps(STORE.a, STORE.b), a: STORE.a, b: STORE.b };
    const q = EUCLID_Q.share({ a: STORE.a, b: STORE.b, lab, share: M7_ROUNDS[1].props.share }, (key, o) => `${key}${o ? JSON.stringify(o) : ''}`);
    expect(q.kind).toBe('build');
    expect(q.expected).toEqual([816, 17, 48]);
    expect(q.tiles).toEqual(expect.arrayContaining([816, 17, 48, 41]));
    expect(q.ops).toEqual(['=', '×']);
  });
  it('each required round is won by its chain; the first try earns ★★★ and a wrong PGCD box costs the third star in r2', () => {
    const [r1, r2] = M7_ROUNDS;
    let log = emptyLog();
    for (let k = 1; k <= 8; k += 1) log = logEvent(log, 'verdict', { groups: k, exact: SUPPLY.a % k === 0 && SUPPLY.b % k === 0 });
    expect(roundWon(r1, log)).toBe(false);
    log = logEvent(log, 'trial', { tk: 'checkpoint-done', id: 'groups' });
    expect(starsFor(r1, log)).toBe(3);
    let l2 = logEvent(emptyLog(), 'trial', { tk: 'predict', ok: true });
    l2 = logEvent(l2, 'verdict', { groups: 17, exact: true });
    l2 = logEvent(l2, 'trial', { tk: 'checkpoint-done', id: 'pgcd' });
    expect(starsFor(r2, l2)).toBe(3);
    const wrong = logEvent(logEvent(emptyLog(), 'trial', { tk: 'predict', ok: true }), 'verdict', { groups: 119, exact: false });
    expect(starsFor(r2, logEvent(logEvent(wrong, 'verdict', { groups: 17, exact: true }), 'trial', { tk: 'checkpoint-done', id: 'pgcd' }))).toBe(2);
    // the practice rounds are won by the greatest SEEN / the PGCD placed
    const e1 = [3, 4].reduce((lg, k) => logEvent(lg, 'verdict', { groups: k, exact: k === 3 }), emptyLog());
    expect(roundWon(r1.easier, e1)).toBe(true);
    expect(roundWon(r2.easier, logEvent(emptyLog(), 'verdict', { groups: 19, exact: true }))).toBe(true);
  });
});

/** Toutes les paires { a, b } que les contenus des huit leçons exportent (manches, entraînements de labo, défis). */
const lessonPairs = new Set();
const walk = (x, depth = 0) => {
  if (!x || typeof x !== 'object' || depth > 6) return;
  if (typeof x.a === 'number' && typeof x.b === 'number') lessonPairs.add([x.a, x.b].sort((m, n) => m - n).join('/'));
  Object.values(x).forEach((v) => walk(v, depth + 1));
};
Object.values(lessonContent).forEach((m) => walk(m));
const key = ({ a, b }) => [a, b].sort((m, n) => m - n).join('/');

describe('module 7 — the collision rule against the unit\'s lessons', () => {
  it('the lessons\' pairs are read', () => {
    expect(lessonPairs.size).toBeGreaterThan(20);
    expect(lessonPairs.has('140/252')).toBe(true);
  });
  it('no round, free or ladder pair is a pair of a lesson, and the rounds are all distinct', () => {
    const ours = [...ALL.map(({ id, props }) => ({ id, ...props })), ...FREE_PAIRS.map((p) => ({ id: 'free', ...p })), ...PREP_PAIRS.map((p) => ({ id: `prep-${p.n}`, ...p }))];
    ours.forEach((p) => expect(lessonPairs.has(key(p)), `${p.id} ${key(p)}`).toBe(false));
    const rounds = ALL.map(({ props }) => key(props));
    expect(new Set(rounds).size).toBe(rounds.length);
  });
});

describe('module 7 — its own screens never show the challenge SOLVED', () => {
  it('no visible line of Module07TahlilWadiya.jsx holds the challenge\'s answer (the situation itself is allowed: module 7 analyses it)', () => {
    visibleLines(module7Src).forEach((line, i) => expect(textViolations(line, `m7:${i + 1}`, { before7: false }), line.trim().slice(0, 100)).toEqual([]));
  });
  it('module 7 sends nowhere to the textbook', () => {
    visibleLines(module7Src).forEach((line) => expect(/الكتاب(?!ة)|ص\s*\d/.test(line), line.trim().slice(0, 100)).toBe(false));
  });
});

describe('the synthesis — config, peer sheet, ladder', () => {
  const { mission } = LESSON_CONFIG;
  it('mission: owned keys from the unit\'s lessons (each id exists there), every training uses a key, no checkpoint, two labels, two sittings', () => {
    expect(LESSON_CONFIG.studentView).toBe('mission');
    expect(LESSON_CONFIG.knowledgeMapOpen).toBe(true);
    expect(mission.toolsOwned).toBe(true);
    expect(mission.checkpoints).toEqual([]);
    expect(mission.climaxModule).toBe(8);
    expect(mission.stationLabels).toEqual({ 7: 'وضعية الوحدة', 8: 'التحدّي 🏆' });
    expect(mission.trainings).toEqual([1, 2, 3, 4, 5, 6]);
    expect(mission.hideStars).toBe(true);
    expect(mission.sittings).toBe(2);
    expect(mission.resumeInside).toBe(true);
    expect(mission.opening.cta).toBe('أجرّب');
    expect(mission.durationMin).toBe(LESSON_CONFIG.modules.reduce((a, m) => a + m.estimatedMin, 0));
    const ids = Object.entries(knowledgeOf).filter(([p]) => !p.includes('wadiya-idmajiya')).flatMap(([, m]) => Object.values(m.LESSON_KNOWLEDGE?.modules ?? {}).flat().map((x) => x.id));
    mission.tools.forEach((tl) => { expect(ids, tl.id).toContain(tl.id); expect(tl.label).not.toMatch(/^[A-Za-z]/); });
    mission.trainings.forEach((m) => expect(mission.tools.some((tl) => tl.usedIn.includes(m)), `training ${m}`).toBe(true));
    expect(mission.tools.some((tl) => tl.usedIn.includes(7))).toBe(true);
  });
  it('the opening holds no digit and no signature; no student-visible config line sends to the textbook or says « DA »', () => {
    expect(mission.opening.text).not.toMatch(/\d/);
    expect(textViolations(`${mission.title} ${mission.opening.text}`)).toEqual([]);
    const visible = [LESSON_CONFIG.description, mission.title, mission.opening.text, ...mission.tools.map((t) => t.label),
      ...LESSON_CONFIG.modules.map((m) => `${m.title} ${m.desc}`), ...LESSON_CONFIG.resources.map((r) => `${r.title} ${r.objective ?? ''}`)];
    visible.forEach((s) => { expect(/الكتاب(?!ة)/.test(s), s).toBe(false); expect(/نشاط\s*\d|تمرين\s*\d|ص\s*\d/.test(s), s).toBe(false); expect(/\bDA\b/.test(s), s).toBe(false); });
  });
  it('« ورقة نسيبة »: a wrong PLAN (the TOTAL instead of each colour), no number, one right fix, every wrong fix says why', () => {
    expect(PEER_SHEET.lines[PEER_SHEET.errorLine]).toMatch(/مجموع/);
    expect(PEER_SHEET.fixes.filter((x) => x.ok)).toHaveLength(1);
    expect(PEER_SHEET.fixes.find((x) => x.ok).text).toMatch(/كل لون/);
    PEER_SHEET.fixes.filter((x) => !x.ok).forEach((x) => expect(x.why).toBeTruthy());
    const words = [PEER_SHEET.task, ...PEER_SHEET.lines, ...PEER_SHEET.fixes.flatMap((x) => [x.text, x.why ?? '']), PEER_SHEET.why].join(' ');
    expect(words).not.toMatch(/\d/);
    expect(textViolations(json(PEER_SHEET), 'peer', { before7: false })).toEqual([]);
  });
  it('the classmate نسيبة is in hijab and her first name is on no other peer sheet of the platform', () => {
    expect(PEER_KID.figure.hairStyle).toBe('hijab');
    const names = Object.values(peerSheets).map((m) => m.PEER_KID?.name).filter(Boolean);
    expect(names.length).toBeGreaterThan(20);
    expect(names.filter((n) => n === PEER_KID.name)).toHaveLength(1);
  });
  it('« أستعدّ » never shows the signatures', () => {
    expect(textViolations(PREP_LADDER.map((x) => `${x.text} ${x.why}`).join(' '), 'prep')).toEqual([]);
  });
  it('the memo cards use fresh numbers: no pair of a lesson of the unit', () => {
    const memo = json(Object.values(LESSON_KNOWLEDGE.modules).flat().map((x) => x.memo));
    const pairs = [...memo.matchAll(/PGCD\}\((\d+)\\ ;\\ (\d+)\)/g)].map((m) => key({ a: Number(m[1]), b: Number(m[2]) }));
    expect(pairs.length).toBeGreaterThan(0);
    pairs.forEach((p) => expect(lessonPairs.has(p), p).toBe(false));
  });
});
