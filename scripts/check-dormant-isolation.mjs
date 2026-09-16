// Garde de PÉRIMÈTRE du catalogue algérien — spécifique à l'Algérie (absente
// du dépôt français amont). Elle fait échouer la construction si du contenu
// français réapparaît dans une surface produit, par le catalogue ou par un
// import.
//
// ── Ce qui a changé en phase 6F ─────────────────────────────────────────
// Ce contrôle gardait un ISOLEMENT : les 8 classes françaises vivaient dans
// le catalogue, et `filterActiveCourseLevels` les cachait. Le périmètre
// voulu n'est plus celui-là. Le catalogue algérien (`dzCourseLevels`) ne
// contient QUE les deux classes DZ, et la base non plus ne contient qu'elles.
//
// L'arbre français survit sous `referenceCourseLevels`, hors produit, pour une
// seule raison : les 132 dossiers de leçons sont restés sur le disque
// (master spec §3) et l'outillage d'intégrité doit continuer à les valider.
// D'où le contrôle 2 ci-dessous, qui est le vrai garde-fou de la nouvelle
// architecture : rien de ce qui est servi à un élève ne doit lire cet arbre.
//
// Complète, et reste délibérément distinct de, check-routes.mjs (surface de
// montage App.jsx) et du filtre de registry.js (couvert par
// apps/web/src/lessons/registry.test.js, `import.meta.glob` étant une API
// Vite que ce script Node ne peut pas exercer). Distinct aussi de
// check-level-leak.mjs, qui malgré son nom est un contrôle PÉDAGOGIQUE de
// vocabulaire, sans rapport avec l'activation.
//
//   node scripts/check-dormant-isolation.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { courseLevels, dzCourseLevels, referenceCourseLevels } from '../packages/core/curriculum/coursesData.js';
import { ACTIVE_GRADE_IDS } from '../packages/core/curriculum/activeGrades.js';
import { FREE_LESSON_IDS } from '../packages/core/curriculum/freeLessons.js';

const ROOT = new URL('../', import.meta.url).pathname;
const WEB_SRC = join(ROOT, 'apps/web/src');

const problems = [];

// ── Contrôle 1 : le catalogue actif ne porte que des classes actives ──────
for (const level of courseLevels) {
  for (const grade of level.grades) {
    if (!ACTIVE_GRADE_IDS.includes(grade.id)) {
      problems.push(`Le catalogue actif (courseLevels) contient la classe non active « ${grade.id} » (niveau « ${level.id} ») — filterActiveCourseLevels() ne l'a pas filtrée.`);
    }
  }
}

// Dans l'autre sens : un identifiant actif qui n'existe dans aucun catalogue
// est une faute de frappe qui n'active silencieusement rien.
const dzGradeIds = new Set(dzCourseLevels.flatMap((l) => l.grades.map((g) => g.id)));
for (const id of ACTIVE_GRADE_IDS) {
  if (!dzGradeIds.has(id)) {
    problems.push(`ACTIVE_GRADE_IDS contient « ${id} », absent du catalogue algérien (dzCourseLevels) — probablement une faute de frappe (cela n'active rien).`);
  }
}

// ── Contrôle 2 : AUCUNE classe française dans le catalogue algérien ───────
//
// Le cœur de la phase 6F. Le catalogue DZ est construit depuis le programme
// algérien ; qu'une classe française y entre signifierait que quelqu'un a
// rebranché l'arbre de référence sur le produit.
const frenchGradeIds = new Set(referenceCourseLevels.flatMap((l) => l.grades.map((g) => g.id)));
const frenchLessonIds = new Set(
  referenceCourseLevels.flatMap((level) =>
    level.grades.flatMap((grade) => grade.chapters.flatMap((chapter) => chapter.lessons.map((l) => l.id))),
  ),
);

for (const level of dzCourseLevels) {
  for (const grade of level.grades) {
    if (frenchGradeIds.has(grade.id)) {
      problems.push(`Le catalogue algérien (dzCourseLevels) contient la classe FRANÇAISE « ${grade.id} » — l'arbre de référence a fui dans le produit.`);
    }
    for (const chapter of grade.chapters ?? []) {
      for (const lesson of chapter.lessons ?? []) {
        if (frenchLessonIds.has(lesson.id)) {
          problems.push(`Le catalogue algérien contient la leçon FRANÇAISE « ${lesson.id} » (classe « ${grade.id} »).`);
        }
      }
    }
  }
}

// ── Contrôle 3 : la FRONTIÈRE de l'arbre de référence ─────────────────────
//
// `referenceCourseLevels` est réexporté par le baril @smarter-academy/core,
// donc RIEN dans le système de modules n'empêche une page élève de l'importer
// et de réafficher les 133 leçons françaises. C'est la seule barrière.
//
// Volontairement un grep sur les sources plutôt qu'une analyse statique : la
// faute qu'on cherche s'écrit en une ligne et se lit en une ligne.
const walkSources = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSources(full, out);
    else if (/\.(jsx?|mjs)$/.test(entry)) out.push(full);
  }
  return out;
};

for (const file of walkSources(WEB_SRC)) {
  // Les tests ont le droit de valider l'arbre français : c'est leur objet.
  if (/\.test\.[jm]sx?$/.test(file)) continue;
  if (readFileSync(file, 'utf8').includes('referenceCourseLevels')) {
    problems.push(`${relative(ROOT, file)} importe « referenceCourseLevels » — l'arbre français hérité n'a aucune place dans une surface produit (il ne sert qu'à l'outillage d'intégrité des fichiers).`);
  }
}

// ── Contrôle 4 : les leçons gratuites existent et sont atteignables ───────
//
// Deux fautes distinctes, toutes deux silencieuses sans ce contrôle :
//   — un identifiant mal orthographié n'ouvre rien : la leçon annoncée
//     gratuite reste vendue, et personne ne le voit avant une réclamation ;
//   — une leçon gratuite sous une classe non active est une contradiction :
//     elle serait « offerte » et pourtant inatteignable.
const activeLessonIds = new Set(
  dzCourseLevels.flatMap((level) =>
    level.grades
      .filter((grade) => ACTIVE_GRADE_IDS.includes(grade.id))
      .flatMap((grade) => (grade.chapters ?? []).flatMap((chapter) => (chapter.lessons ?? []).map((l) => l.id))),
  ),
);
const dzLessonIds = new Set(
  dzCourseLevels.flatMap((level) =>
    level.grades.flatMap((grade) => (grade.chapters ?? []).flatMap((chapter) => (chapter.lessons ?? []).map((l) => l.id))),
  ),
);

for (const id of FREE_LESSON_IDS) {
  if (!dzLessonIds.has(id)) {
    problems.push(`FREE_LESSON_IDS contient « ${id} », qui n'existe dans aucune leçon du catalogue algérien — probablement une faute de frappe (cette leçon resterait payante).`);
  } else if (!activeLessonIds.has(id)) {
    problems.push(`FREE_LESSON_IDS contient « ${id} », qui appartient à une classe non active — une leçon « gratuite » que personne ne peut atteindre.`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} problème(s) de périmètre du catalogue :\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error('\nLe produit algérien ne doit exposer que du curriculum algérien.\n');
  process.exit(1);
}

const dzGrades = [...dzGradeIds];
console.log(`✅ Périmètre du catalogue : ${dzGrades.length} classe(s) algérienne(s) (${dzGrades.join(', ')}), dont ${ACTIVE_GRADE_IDS.length} active(s) (${ACTIVE_GRADE_IDS.join(', ') || 'aucune'}).`);
console.log(`✅ Aucune classe ni leçon française dans le catalogue algérien ; aucune surface produit n'importe l'arbre de référence.`);
console.log(`✅ Leçons gratuites : ${FREE_LESSON_IDS.length} (${FREE_LESSON_IDS.join(', ') || 'aucune'}), toutes rattachées à une classe active.`);
