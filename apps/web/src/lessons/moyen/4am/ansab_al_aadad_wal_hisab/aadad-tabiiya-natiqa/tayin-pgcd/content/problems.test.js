import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

// Toute l'arithmétique est RECALCULÉE ici à partir des nombres de l'énoncé :
// une coquille dans une مسألة modèle fait échouer ce fichier.
const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const common = (a, b) => divisors(a).filter((d) => b % d === 0);
const pgcd = (a, b) => (b === 0 ? a : Math.max(...common(a, b)));
/** « 1 ، 2 ، 3 » → [1, 2, 3] */
const list = (s) => s.split('،').map((x) => Number(x.trim()));
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);
const choices = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'choice');
const right = (step) => step.options[step.correct];

describe('les مسائل du درس 5 (تعيين PGCD)', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (4, 5, 6 — track problem, practice_lab, before the test 7)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.id, m.number, m.slug, m.stage])).toEqual([
      ['04', 4, 'masala-1', 'practice_lab'], ['05', 5, 'masala-2', 'practice_lab'], ['06', 6, 'masala-3', 'practice_lab'],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '07', number: 7, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(PROBLEMS.map((p) => p.id)).toEqual(problemModules.map((m) => m.slug));
    const situations = LESSON_CONFIG.resources.filter((r) => r.kind === 'situation');
    expect(situations.map((r) => [r.code, r.module])).toEqual([['masala-1', 4], ['masala-2', 5], ['masala-3', 6]]);
    // Durée : 46 min de leçon + 3 × 8 min de مسائل, sous le plafond de 90.
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBe(70);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('each statement carries a numeric decoy among its useless data', () => {
    for (const p of PROBLEMS) {
      const useless = p.data.filter((d) => !d.useful);
      expect(useless.some((d) => /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) expect(d.text.includes('$'), `${p.id} ${d.id}`).toBe(false);
    }
  });

  it('مسألة 1 — 90 أقلام و 126 كرّاسًا : lists, PGCD and money are computed, not typed', () => {
    const g = pgcd(90, 126);
    const [, l90, l126, lCommon] = choices('masala-1', 0);
    expect(list(right(l90))).toEqual(divisors(90));
    expect(list(right(l126))).toEqual(divisors(126));
    expect(list(right(lCommon))).toEqual(common(90, 126));
    // Les distracteurs sont FAUX (pas une autre écriture de la bonne liste).
    for (const s of [l90, l126, lCommon]) s.options.forEach((o, i) => { if (i !== s.correct) expect(list(o)).not.toEqual(list(right(s))); });
    expect(expectedOf('masala-1', 0)).toEqual([g]);
    expect(g).toBe(18);

    // 2) 12 sacs : ni 90 ni 126 ne se partagent.
    expect(div(90, 12).r).not.toBe(0);
    expect(div(126, 12).r).not.toBe(0);
    expect(common(90, 126)).not.toContain(12);
    expect(12).toBeLessThan(g); // le piège : plus petit que le PGCD, et pourtant impossible
    expect(expectedOf('masala-1', 1)).toEqual([div(90, 12).r, g, 90 / g, 126 / g]);
    expect(90 % g + 126 % g).toBe(0);

    // 3) l'argent
    const cost = g * 450;
    expect(expectedOf('masala-1', 2)).toEqual([cost, 10000 - cost]);
    expect(cost).toBeLessThanOrEqual(10000);
    expect(right(choices('masala-1', 2)[0])).toBe(`$${g} \\times 450$`);
    expect(90 + 126).toBe(216); // le distracteur « un sac par objet »
  });

  it('مسألة 2 — قفة رمضان : PGCD(60 ; 84), then 60 divides 84 + 96', () => {
    const g = pgcd(60, 84);
    const [, l60] = choices('masala-2', 0);
    expect(list(right(l60))).toEqual(divisors(60));
    l60.options.forEach((o, i) => { if (i !== l60.correct) expect(list(o)).not.toEqual(divisors(60)); });
    const batch = PROBLEM['masala-2'].parts[0].steps.find((s) => s.kind === 'batch');
    for (const row of batch.rows) {
      const n = Number(row.label.replace('العدد', '').trim());
      expect(divisors(60), row.label).toContain(n);
      expect(row.options[row.correct], row.label).toBe(84 % n === 0 ? 'يقسم 84' : 'لا يقسم 84');
      const { q, r } = div(84, n);
      expect(row.correction).toBe(r === 0 ? `$84 = ${n} \\times ${q}$` : `$84 = ${n} \\times ${q} + ${r}$`);
    }
    // Les lignes du tableau couvrent tous les diviseurs de 60 au-dessus de 4 sauf 60 lui-même.
    expect(batch.rows.map((r) => Number(r.label.replace('العدد', '').trim()))).toEqual(divisors(60).filter((d) => d > 4 && d < 60));
    expect(g).toBe(12);
    expect(expectedOf('masala-2', 0)).toEqual([g, g, 60 / g, 84 / g]);

    // 2) le don : 60 divise le nouveau nombre de boîtes → PGCD = 60 sans lister.
    const cans = 84 + 96;
    expect(cans % 60).toBe(0);
    const g2 = pgcd(60, cans);
    expect(g2).toBe(60);
    expect(pgcd(cans, 60)).toBe(g2);
    const pg = choices('masala-2', 1)[1];
    expect(Number(right(pg))).toBe(g2);
    expect(pg.options).toContain(String(g)); // le distracteur « PGCD inchangé »
    expect(expectedOf('masala-2', 1)).toEqual([cans, cans / 60, g2, cans / g2]);
    expect(60 / g2).toBe(1); // une bouteille par قفة

    // 3) sucre et familles
    expect(expectedOf('masala-2', 2)).toEqual([g2 * 190, g2 - g]);
    expect(right(choices('masala-2', 2)[0])).toBe(`$${g2} \\times 190$`);
    expect(60 + cans).toBe(240);
  });

  it('مسألة 3 — التربّص : PGCD(48 ; 80), the 10-coach limit, the share per player', () => {
    const g = pgcd(48, 80);
    const [, l48, l80, lCommon, lSmall] = [...choices('masala-3', 0), choices('masala-3', 1)[1]];
    expect(list(right(l48))).toEqual(divisors(48));
    expect(list(right(l80))).toEqual(divisors(80));
    expect(list(right(lCommon))).toEqual(common(48, 80));
    for (const s of [l48, l80, lCommon]) s.options.forEach((o, i) => { if (i !== s.correct) expect(list(o)).not.toEqual(list(right(s))); });
    expect(g).toBe(16);
    expect(expectedOf('masala-3', 0)).toEqual([g]);

    // 2) au plus 10 groupes
    expect(48 % 10).not.toBe(0);
    expect(80 % 10).toBe(0); // le piège : 10 divise 80
    const small = common(48, 80).filter((d) => d <= 10);
    expect(list(right(lSmall))).toEqual(small);
    const n = Math.max(...small);
    expect(n).toBe(8);
    expect(expectedOf('masala-3', 1)).toEqual([div(48, 10).r, n, 48 / n, 80 / n, 48 / n + 80 / n]);

    // 3) les ballons
    const balls = n * 2, cost = balls * 2400, players = 48 + 80;
    expect(cost % players).toBe(0);
    expect(expectedOf('masala-3', 2)).toEqual([balls, cost, cost / players]);
    expect(right(choices('masala-3', 2)[0])).toBe(`$${cost} \\div ${players}$`);
  });

  it('every equality written in explain / lines / corrections is true', () => {
    // Chaque « a = b \times c (+ r) », « a + b = c », « a - b = c » d'un texte est vérifié.
    const texts = [];
    for (const p of PROBLEMS) for (const part of p.parts) for (const s of part.steps) {
      if (s.explain) texts.push(s.explain);
      if (s.lines) texts.push(...s.lines);
      if (s.options) texts.push(...s.options);
      if (s.rows) texts.push(...s.rows.map((r) => r.correction));
    }
    const islands = texts.flatMap((t) => [...t.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]))
      .filter((m) => /=/.test(m) && !/[a-zA-Z{]/.test(m.replace(/\\times|\\div|\\ldots/g, '')));
    let checked = 0;
    for (const m of islands) {
      if (m.includes('\\ldots') || /=\s*$/.test(m)) continue;
      const parts = m.split('=').map((x) => x.trim());
      const val = (e) => Function(`return (${e.replace(/\\times/g, '*').replace(/\\div/g, '/')})`)();
      const v0 = val(parts[0]);
      for (const e of parts.slice(1)) expect(val(e), m).toBe(v0);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(40);
  });
});
