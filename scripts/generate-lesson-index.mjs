#!/usr/bin/env node
/**
 * generate-lesson-index — l'INDEX LÉGER des leçons construites (BUNDLE_BOUNDARIES.md §3, « Lesson index »).
 *
 *   node scripts/generate-lesson-index.mjs           # (ré)écrit apps/web/src/lessons/lessonIndex.generated.json
 *   node scripts/generate-lesson-index.mjs --check   # échoue si le fichier n'est plus à jour (npm run check:lessons)
 *
 * Pourquoi : `lessons/registry.js` répond À LA VOLÉE (synchrone) à des questions posées par du code du lot
 * d'entrée — « cette leçon est-elle construite ? combien de modules ? quel est le premier ? quel est le chemin du
 * module n ? ». Il lisait pour cela TOUS les lesson.config.js par un glob EAGER : 775 Ko de configuration dans
 * le premier téléchargement de chaque visiteur. Ce fichier ne garde que ce que ces questions exigent — rien
 * d'arabe, rien de pédagogique — et la configuration complète se charge avec la leçon (registry.loadLessonConfig).
 *
 * Source : chaque `lesson.config.js` sous apps/web/src/lessons/<niveau>/<classe>/… (modules de données sans
 * import, lisibles par Node). Seules les classes ACTIVES (activeGrades.js) sont indexées.
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { ACTIVE_GRADE_IDS } from '../packages/core/curriculum/activeGrades.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LESSONS = join(ROOT, 'apps/web/src/lessons');
const OUT = join(LESSONS, 'lessonIndex.generated.json');
const check = process.argv.includes('--check');

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir).sort()) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e === 'lesson.config.js') out.push(p);
  }
  return out;
};

const problems = [];
const lessons = [];
for (const file of walk(LESSONS)) {
  const rel = relative(LESSONS, file); // <niveau>/<classe>/…/<leçon>/lesson.config.js
  const [level, grade] = rel.split('/');
  if (!ACTIVE_GRADE_IDS.includes(grade)) continue;
  const { LESSON_CONFIG: c, LESSON_BASE_PATH: base } = await import(pathToFileURL(file).href);
  const dir = basename(dirname(file));
  if (!c?.id) { problems.push(`${rel} : pas de LESSON_CONFIG.id`); continue; }
  // Le chargeur paresseux (lessonLoaders.js) retrouve une leçon par son DOSSIER : il doit porter son id.
  if (dir !== c.id) problems.push(`${rel} : le dossier « ${dir} » ne porte pas l'id « ${c.id} »`);
  if (!existsSync(join(dirname(file), 'routes.jsx'))) problems.push(`${rel} : pas de routes.jsx à côté`);
  if (c.level !== level || c.grade !== grade) problems.push(`${rel} : level/grade (${c.level}/${c.grade}) ≠ dossier (${level}/${grade})`);
  const path = `/courses/${c.level}/${c.grade}/${c.chapter}/${c.id}`;
  // Le chemin est RECONSTRUIT ici, jamais stocké deux fois : il doit être celui que la leçon déclare.
  if (base !== path) problems.push(`${rel} : LESSON_BASE_PATH « ${base} » ≠ « ${path} »`);
  const modules = (c.modules ?? []).map((m) => {
    if (m.path !== `${path}/${m.slug}`) problems.push(`${rel} : module ${m.number} — path « ${m.path} » ≠ « ${path}/${m.slug} »`);
    return [Number(m.number), m.slug];
  });
  lessons.push({ id: c.id, level: c.level, grade: c.grade, chapter: c.chapter, modules });
}

if (problems.length) {
  console.error(`✗ Index des leçons — ${problems.length} problème(s) :\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}
const ids = new Set();
for (const l of lessons) { if (ids.has(l.id)) { console.error(`✗ id en double : ${l.id}`); process.exit(1); } ids.add(l.id); }

// Une leçon par ligne : un diff lisible quand une leçon est publiée.
const body = lessons.map((l) => `    ${JSON.stringify(l)}`).join(',\n');
const text = `{\n  "$generated": "scripts/generate-lesson-index.mjs — do not edit; npm run check:lessons checks it",\n  "modulesFormat": "[number, slug]",\n  "lessons": [\n${body}\n  ]\n}\n`;

if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== text) {
    console.error('✗ apps/web/src/lessons/lessonIndex.generated.json n\'est plus à jour : node scripts/generate-lesson-index.mjs');
    process.exit(1);
  }
  console.log(`✅ Index des leçons à jour (${lessons.length} leçons).`);
} else {
  writeFileSync(OUT, text);
  console.log(`✅ ${relative(ROOT, OUT)} — ${lessons.length} leçons.`);
}
