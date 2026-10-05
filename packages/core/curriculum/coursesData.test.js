import { describe, it, expect } from 'vitest';
import { getAllGrades, courseLevels, dzCourseLevels } from './coursesData';
import programme4am from './dz/programme_4am_2026_2027.json';
import units4am from './dz/units_4am_2026_2027.json';
import decomposition4am from './dz/lessons_4am_2026_2027.json';

// Les invariants de FORME portent sur les leçons du catalogue algérien (le
// catalogue français hérité a été supprimé le 2026-09-25, avec ses leçons).
const allLessons = dzCourseLevels.flatMap((level) =>
  level.grades.flatMap((grade) =>
    grade.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => ({ levelId: level.id, gradeId: grade.id, chapterId: chapter.id, lesson }))
    )
  )
);

describe('getAllGrades', () => {
  const grades = getAllGrades();

  // `getAllGrades()` reads the active-filtered `courseLevels` — its actual
  // contract for the Algerian product (see activeGrades.js: no Algerian
  // grade exists yet, so this is genuinely empty until Phase 7 lands one).
  it('returns one entry per active grade', () => {
    const expectedCount = courseLevels.reduce((sum, level) => sum + level.grades.length, 0);
    expect(grades).toHaveLength(expectedCount);
  });

  it('expose exactement les deux classes algériennes', () => {
    expect(grades.map((g) => g.id).sort()).toEqual(['4am', 'terminale_dz']);
  });

  it('has no duplicate grade ids', () => {
    const ids = grades.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('lesson catalogue invariants', () => {
  it('has lessons to check', () => {
    expect(allLessons.length).toBeGreaterThan(0);
  });

  it('derives the display duration string from durationMinutes', () => {
    for (const { lesson } of allLessons) {
      expect(lesson.duration).toBe(lesson.durationMinutes != null ? `${lesson.durationMinutes} min` : '--');
    }
  });

  it('has globally unique lesson codes (bare-code API lookups depend on this)', () => {
    // POST /lessons/{code}/evidence and the lesson-progress endpoints resolve
    // lessons by bare code; the DB only enforces per-chapter uniqueness, so
    // this test is the real guard against cross-grade collisions.
    const ids = allLessons.map(({ lesson }) => lesson.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it('builds paths under the owning level, not hardcoded college', () => {
    for (const { levelId, gradeId, lesson } of allLessons) {
      expect(lesson.path.startsWith(`/courses/${levelId}/${gradeId}/`), lesson.path).toBe(true);
    }
  });

});

// ── Le catalogue ALGÉRIEN ────────────────────────────────────────────────
//
// Ces tests LISENT le programme officiel et comparent. Ils ne recopient
// aucun intitulé arabe : un test qui retaperait le libellé passerait au vert
// pendant que le catalogue s'éloignerait du programme, ce qui est exactement
// la dérive qu'il est censé attraper (invariant I1 de la phase 6F).
describe('catalogue algérien (dzCourseLevels)', () => {
  const dzGrades = dzCourseLevels.flatMap((level) =>
    level.grades.map((grade) => ({ levelId: level.id, grade }))
  );
  const grade4am = dzGrades.find(({ grade }) => grade.id === '4am')?.grade;

  const sourceTopics = programme4am.domains.flatMap((d) => d.topics);

  it('ne contient QUE les deux classes algériennes', () => {
    expect(dzGrades.map(({ grade }) => grade.id).sort()).toEqual(['4am', 'terminale_dz']);
  });

  it('place chaque classe sous son niveau algérien', () => {
    expect(dzGrades.find(({ grade }) => grade.id === '4am').levelId).toBe('moyen');
    expect(dzGrades.find(({ grade }) => grade.id === 'terminale_dz').levelId).toBe('thanawi');
  });

  it("ne contient AUCUNE classe française, même dormante", () => {
    // Les identifiants des 8 classes du clone français, écrits en dur : le
    // catalogue qui les portait a été supprimé (2026-09-25).
    const frenchIds = new Set(['6e', '5e', '4e', '3e', 'seconde', 'premiere_specialite', 'terminale_specialite', 'terminale_complementaires']);
    for (const { grade } of dzGrades) {
      expect(frenchIds.has(grade.id), grade.id).toBe(false);
    }
  });

  // Le catalogue ne montre que les ميادين qui portent des leçons (décision du
  // 2026-09-25) ; le programme source, lui, reste entier. Les deux tests
  // ci-dessous protègent les DEUX moitiés de cette règle.
  // Les domaines du programme qui portent des leçons, puis les ميادين d'AFFICHAGE du propriétaire
  // (units_4am › ownerChapters — unité 6, 2026-10-02), rangés après le programme et sans sujet.
  const ownerDomains = (units4am.ownerChapters ?? []).map((c) => ({ ...c, topics: [] }));
  const allDomains = [...programme4am.domains, ...ownerDomains];
  const domainsWithLessons = allDomains.filter((d) =>
    decomposition4am.lessons.some((l) => l.chapterId === d.id));

  it('ne montre que les domaines (programme, puis ميادين du propriétaire) qui portent des leçons, dans leur ordre', () => {
    expect(programme4am.domains).toHaveLength(4);
    expect(grade4am.chapters.length).toBeGreaterThan(0);
    expect(grade4am.chapters.map((c) => c.id)).toEqual(domainsWithLessons.map((d) => d.id));
    expect(grade4am.chapters.map((c) => c.title)).toEqual(domainsWithLessons.map((d) => d.titleAr));
    for (const chapter of grade4am.chapters) expect(chapter.lessons.length, chapter.id).toBeGreaterThan(0);
    // `order` reste la position dans le PROGRAMME ; un ميدان du propriétaire vient après lui.
    for (const chapter of grade4am.chapters) {
      expect(chapter.order).toBe(allDomains.findIndex((d) => d.id === chapter.id));
    }
    for (const c of ownerDomains) expect(programme4am.domains.some((d) => d.id === c.id), c.id).toBe(false);
  });

  it('porte, au mot près, les sujets du programme des domaines montrés — et le programme garde ses 29', () => {
    // 28 transcrits le 2026-09-16 + « الهندسة في الفضاء » (unité 14), ajouté à la demande du propriétaire le 2026-10-05 et
    // DÉCLARÉ dans le fichier (`addedBy`, `addedOn`, `note`) — jamais un ajout silencieux.
    expect(sourceTopics).toHaveLength(29);
    expect(sourceTopics.filter((t) => t.addedBy).map((t) => t.id)).toEqual(['handasa_fada']);
    const catalogueTopics = grade4am.chapters.flatMap((c) => c.topics);
    expect(catalogueTopics).toHaveLength(domainsWithLessons.flatMap((d) => d.topics).length);

    const source = new Map(sourceTopics.map((t) => [t.id, t.titleAr]));
    for (const topic of catalogueTopics) {
      expect(source.has(topic.id), topic.id).toBe(true);
      expect(topic.title, topic.id).toBe(source.get(topic.id));
    }
  });

  it("ne fabrique pas de méthodes nommées là où le programme se tait", () => {
    // Six sujets seulement nomment leurs méthodes ou leurs parties. Inventer
    // un tableau vide pour les 22 autres affirmerait que le programme ne
    // nomme rien, alors qu'il ne dit simplement rien.
    for (const topic of grade4am.chapters.flatMap((c) => c.topics)) {
      const source = sourceTopics.find((t) => t.id === topic.id);
      expect('namedMethods' in topic, topic.id).toBe('namedMethodsAr' in source);
      expect('namedParts' in topic, topic.id).toBe('namedPartsAr' in source);
    }
  });

  it("porte autant de leçons que le découpage en déclare — un compte DÉRIVÉ, jamais retapé", () => {
    // Phase 7 : un sujet = une leçon (28). Phase 8 : les sujets couverts par
    // une unité du manuel sont remplacés par les leçons de cette unité (plus
    // sa synthèse). Le nombre attendu se CALCULE depuis les deux sources ;
    // un littéral ici mentirait dès la prochaine unité.
    // Depuis le 2026-09-21, le catalogue ne liste QUE les leçons construites
    // (`publishedScope`) : un sujet non construit n'a plus d'entrée, donc plus
    // de carte « قريبًا ». Le compte reste DÉRIVÉ du découpage — c'est ce que
    // ce test protège — mais il ne suppose plus une leçon par sujet officiel.
    const singleTopicLessons = decomposition4am.lessons.filter((l) => !l.unitId);
    for (const lesson of singleTopicLessons) {
      expect(sourceTopics.some((t) => t.id === lesson.sourceTopicId), lesson.code).toBe(true);
    }
    const unitLessons = decomposition4am.lessons.filter((l) => l.unitId).length;
    const lessons4am = grade4am.chapters.flatMap((c) => c.lessons);
    expect(lessons4am).toHaveLength(singleTopicLessons.length + unitLessons);
    expect(lessons4am).toHaveLength(decomposition4am.lessons.length);

    const terminale = dzGrades.find(({ grade }) => grade.id === 'terminale_dz').grade;
    expect(terminale.chapters).toEqual([]);
  });

  it("greffe les unités du manuel sur leur chapitre sans déplacer les leçons", () => {
    const chapter = grade4am.chapters.find((c) => c.id === units4am.units[0].chapterId);
    expect(chapter.units.map((u) => u.id)).toEqual(units4am.units.filter((u) => u.chapterId === chapter.id).map((u) => u.code));
    for (const unit of chapter.units) {
      // Mêmes objets : l'unité RÉFÉRENCE les leçons du chapitre.
      for (const lesson of unit.lessons) expect(chapter.lessons).toContain(lesson);
      expect(unit.lessons.every((l) => l.kind === 'lesson')).toBe(true);
      if (unit.synthesis) expect(unit.synthesis.kind).toBe('synthesis');
      expect(unit.path).toBe(`/courses/moyen/4am/${chapter.id}/units/${unit.id}`);
      // Le segment `units` est réservé au chemin des unités.
      for (const lesson of chapter.lessons) expect(lesson.id).not.toBe('units');
    }
  });

  it("dit où en est le curriculum de chaque classe, sans le laisser deviner", () => {
    // « Active » ne veut pas dire « du contenu existe » — invariant I2.
    expect(grade4am.curriculumStatus).toBe('lessons_planned');
    const terminale = dzGrades.find(({ grade }) => grade.id === 'terminale_dz').grade;
    expect(terminale.curriculumStatus).toBe('not_supplied');
    expect(terminale.chapters).toEqual([]);
  });
});
