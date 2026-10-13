#!/usr/bin/env node
/**
 * learning-net-queue — l'ORDRE DE GÉNÉRATION des leçons 1AM–3AM, lu dans le
 * réseau des الكفاءات (décision du propriétaire, 2026-10-13).
 *
 * On ne génère pas année par année : on part des leçons 4AM publiées, dans
 * l'ordre du catalogue ; pour chacune, on remonte TOUTE la chaîne de ses
 * prérequis dans les années antérieures (liens requires / extends /
 * consolidates, fermeture transitive) et on génère ces leçons de la plus
 * ancienne à la plus récente. Quand les leçons 4AM sont épuisées, on fait
 * de même depuis les leçons 3AM restantes, puis 2AM, puis 1AM. Les leçons
 * ISOLÉES (aucun lien entrant ni sortant hors de leur propre leçon) passent
 * en dernier. Une synthèse « أدمج تعلّماتي » entre dans la file juste après
 * la dernière leçon de son unité.
 *
 *   node scripts/learning-net-queue.mjs            # écrit docs/curriculum/GENERATION_QUEUE.md + .json
 *   node scripts/learning-net-queue.mjs --check    # échoue si la file écrite n'est plus à jour
 *
 * Contrat : docs/architecture/LEARNING_NET.md § « Generation order ».
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LESSONS, LINKS, GRADES, getItem, homeLessonOf, itemRank,
} from '../packages/core/curriculum/dz/net/learningNet.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_MD = join(ROOT, 'docs/curriculum/GENERATION_QUEUE.md');
const OUT_JSON = join(ROOT, 'docs/curriculum/generation-queue.json');
const GRADE_N = { '1am': 1, '2am': 2, '3am': 3, '4am': 4 };
const gradeLabel = new Map(GRADES.map((g) => [g.id, g.labelAr]));

const into = new Map();
for (const k of LINKS) (into.get(k.to) ?? into.set(k.to, []).get(k.to)).push(k.from);
const touched = new Set(LINKS.flatMap((k) => [k.from, k.to]));

/** Toutes les leçons PRÉVUES d'années antérieures dont dépend `lesson` (fermeture). */
function upstreamPlanned(lesson) {
  const seen = new Set();
  const stack = [...lesson.programmeItems];
  while (stack.length) {
    const id = stack.pop();
    for (const from of into.get(id) ?? []) {
      if (seen.has(from)) continue;
      seen.add(from);
      stack.push(from);
    }
  }
  const lessons = new Map();
  for (const id of seen) {
    const home = homeLessonOf(id);
    if (home && home.status === 'planned' && GRADE_N[home.grade] < GRADE_N[lesson.grade]) {
      const rank = Math.min(lessons.get(home.code)?.rank ?? Infinity, ...home.programmeItems.map(itemRank));
      lessons.set(home.code, { lesson: home, rank, via: [...(lessons.get(home.code)?.via ?? []), id] });
    }
  }
  return [...lessons.values()].sort((a, b) => a.rank - b.rank);
}

const planned = LESSONS.filter((l) => l.status === 'planned');
const plannedByUnit = new Map();
for (const l of planned) (plannedByUnit.get(l.unit) ?? plannedByUnit.set(l.unit, []).get(l.unit)).push(l);

const queue = [];
const done = new Set();
function push(lesson, trigger, via = []) {
  if (done.has(lesson.code) || lesson.status !== 'planned' || lesson.kind === 'synthesis') return;
  done.add(lesson.code);
  queue.push({ code: lesson.code, grade: lesson.grade, unit: lesson.unit, titleAr: lesson.titleAr, kind: lesson.kind, trigger, via });
  // La synthèse suit la dernière leçon de son unité.
  const unit = plannedByUnit.get(lesson.unit) ?? [];
  const syn = unit.find((l) => l.kind === 'synthesis');
  if (syn && !done.has(syn.code) && unit.every((l) => l.kind === 'synthesis' || done.has(l.code))) {
    done.add(syn.code);
    queue.push({ code: syn.code, grade: syn.grade, unit: syn.unit, titleAr: syn.titleAr, kind: 'synthesis', trigger: `unité ${syn.unit} complète`, via: [] });
  }
}

const isIsolated = (l) => l.programmeItems.every((id) => !touched.has(id)); // sans item = isolée aussi
const phases = [];
for (const g of ['4am', '3am', '2am', '1am']) {
  const start = queue.length;
  for (const anchor of LESSONS.filter((l) => l.grade === g && l.kind !== 'synthesis')) {
    if (anchor.status === 'planned' && isIsolated(anchor)) continue;
    for (const up of upstreamPlanned(anchor)) push(up.lesson, anchor.code, up.via);
    if (anchor.status === 'planned') push(anchor, anchor.code);
  }
  phases.push({ grade: g, from: start, to: queue.length });
}
const isoStart = queue.length;
for (const l of planned.filter((x) => x.kind !== 'synthesis')) push(l, 'isolée');
phases.push({ grade: 'isolated', from: isoStart, to: queue.length });
// Garde-fou : toute leçon prévue est dans la file, exactement une fois.
const missing = planned.filter((l) => !done.has(l.code)).map((l) => l.code);
if (missing.length) { console.error('✗ leçons prévues hors file :', missing.join(', ')); process.exit(1); }

const lines = [
  '# File de génération des leçons 1AM–3AM',
  '',
  '> **Généré** par `scripts/learning-net-queue.mjs` depuis le réseau des الكفاءات — ne pas éditer à la main.',
  '> Règle (propriétaire, 2026-10-13) : partir des leçons 4AM, remonter toute la chaîne de leurs prérequis dans les années',
  '> antérieures et la générer de la plus ancienne à la plus récente ; puis depuis les leçons 3AM restantes, 2AM, 1AM ; les',
  '> leçons isolées en dernier ; chaque synthèse juste après la dernière leçon de son unité. Contrat : `docs/architecture/LEARNING_NET.md`.',
  '',
  `**${queue.length}** leçons à générer (${queue.filter((q) => q.kind === 'synthesis').length} synthèses).`,
  '',
];
const PHASE_TITLE = { '4am': 'Phase A — la chaîne des leçons 4AM', '3am': 'Phase B — depuis les leçons 3AM restantes', '2am': 'Phase C — depuis les leçons 2AM restantes', '1am': 'Phase D — leçons 1AM restantes', isolated: 'Phase E — leçons isolées' };
for (const p of phases) {
  if (p.to === p.from) continue;
  lines.push(`## ${PHASE_TITLE[p.grade]} (${p.to - p.from})`, '', '| # | leçon | السنة | unité | déclenchée par |', '|---:|---|---|---|---|');
  for (let i = p.from; i < p.to; i += 1) {
    const q = queue[i];
    lines.push(`| ${i + 1} | \`${q.code}\` — ${q.titleAr.replace(/\$/g, '')}${q.kind === 'synthesis' ? ' _(synthèse)_' : ''} | ${gradeLabel.get(q.grade)} | \`${q.unit}\` | ${q.trigger === 'isolée' || q.kind === 'synthesis' ? q.trigger : `\`${q.trigger}\``} |`);
  }
  lines.push('');
}
// Renvois en avant : dans une même année, un prérequis dont la leçon d'accueil vient PLUS LOIN dans le manuel.
// Admis (l'ordre du manuel fait foi), mais la leçon qui le subit doit le rappeler elle-même.
const pos = new Map(LESSONS.map((l, k) => [l.code, k]));
const forward = LINKS.map((k) => ({ k, a: homeLessonOf(k.from), b: homeLessonOf(k.to) }))
  .filter(({ a, b }) => a && b && a.grade === b.grade && a.code !== b.code && pos.get(a.code) > pos.get(b.code));
lines.push(`## Renvois en avant dans une même année (${forward.length})`, '',
  'La leçon de droite suppose un item que le manuel n’enseigne que PLUS LOIN : elle le rappelle elle-même (encadré « تذكّر »), sans le construire.', '',
  '| leçon | suppose | enseigné plus loin dans |', '|---|---|---|');
for (const { k, a, b } of forward) lines.push(`| \`${b.code}\` (${k.to}) | ${k.from} — ${getItem(k.from).textAr.replace(/\$/g, '').replace(/\|/g, '/')} | \`${a.code}\` |`);
lines.push('');
const md = `${lines.join('\n')}\n`;
const json = `${JSON.stringify({ _comment: 'Généré par scripts/learning-net-queue.mjs — ne pas éditer.', queue }, null, 2)}\n`;

if (process.argv.includes('--check')) {
  const stale = [[OUT_MD, md], [OUT_JSON, json]].filter(([f, t]) => !existsSync(f) || readFileSync(f, 'utf8') !== t);
  if (stale.length) { console.error('✗ file de génération périmée : node scripts/learning-net-queue.mjs'); process.exit(1); }
  console.log(`✓ file de génération à jour (${queue.length} leçons)`);
} else {
  writeFileSync(OUT_MD, md);
  writeFileSync(OUT_JSON, json);
  console.log(`✓ docs/curriculum/GENERATION_QUEUE.md (${queue.length} leçons, ${phases.map((p) => `${p.grade}:${p.to - p.from}`).join(' ')})`);
}
