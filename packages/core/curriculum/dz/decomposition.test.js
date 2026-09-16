import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import programme from './programme_4am_2026_2027.json';
import decomposition from './lessons_4am_2026_2027.json';
import { dzCourseLevels, referenceCourseLevels } from '../coursesData.js';

/**
 * La TRAÇABILITÉ du découpage 4AM (phase 7).
 *
 * Ce que ces tests protègent : le programme officiel est la seule autorité sur
 * ce qui doit être enseigné, et le découpage en leçons en dérive. Deux dérives
 * sont possibles, toutes deux silencieuses sans contrôle —
 *
 *   un sujet officiel qui perd sa leçon  → on cesse d'enseigner une partie du
 *                                          programme sans que personne ne le
 *                                          décide ;
 *   une leçon sans sujet officiel        → on enseigne quelque chose que le
 *                                          programme ne demande pas, présenté
 *                                          à l'élève comme s'il le demandait.
 *
 * Les intitulés arabes ne sont JAMAIS recopiés ici : chaque test lit le JSON
 * source et compare. Un test qui retaperait le libellé passerait au vert
 * pendant que le catalogue s'éloignerait du programme.
 */

const officialTopics = programme.domains.flatMap((d) =>
  d.topics.map((t) => ({ ...t, chapterId: d.id }))
);
const dzGrade4am = dzCourseLevels
  .flatMap((l) => l.grades)
  .find((g) => g.id === '4am');
const catalogueLessons = dzGrade4am.chapters.flatMap((c) =>
  c.lessons.map((lesson) => ({ ...lesson, chapterId: c.id }))
);

describe('découpage 4AM — traçabilité sujet ↔ leçon', () => {
  it('chaque sujet officiel donne au moins une leçon', () => {
    // Le sens qui compte le plus : un sujet sans leçon est une partie du
    // programme qu'on a cessé d'enseigner sans le décider.
    const covered = new Set(catalogueLessons.map((l) => l.sourceTopicId));
    const missing = officialTopics.filter((t) => !covered.has(t.id));
    expect(missing.map((t) => t.id)).toEqual([]);
  });

  it('chaque leçon vient d’exactement un sujet officiel', () => {
    const officialIds = new Set(officialTopics.map((t) => t.id));
    for (const lesson of catalogueLessons) {
      expect(lesson.sourceTopicId, lesson.id).toBeTruthy();
      expect(officialIds.has(lesson.sourceTopicId), `${lesson.id} → ${lesson.sourceTopicId}`).toBe(true);
    }
  });

  it('chaque leçon est rattachée au chapitre de son sujet', () => {
    const chapterOf = new Map(officialTopics.map((t) => [t.id, t.chapterId]));
    for (const lesson of catalogueLessons) {
      expect(lesson.chapterId, lesson.id).toBe(chapterOf.get(lesson.sourceTopicId));
    }
  });

  it('applique la règle arrêtée : un sujet = une leçon', () => {
    expect(decomposition.decompositionRule).toBe('one_lesson_per_official_topic');
    expect(catalogueLessons).toHaveLength(officialTopics.length);
    const perTopic = new Map();
    for (const lesson of catalogueLessons) {
      perTopic.set(lesson.sourceTopicId, (perTopic.get(lesson.sourceTopicId) ?? 0) + 1);
    }
    for (const [topicId, count] of perTopic) {
      expect(count, topicId).toBe(1);
    }
  });

  it('porte le titre officiel du sujet, au mot près', () => {
    const titleOf = new Map(officialTopics.map((t) => [t.id, t.titleAr]));
    for (const lesson of catalogueLessons) {
      expect(lesson.title, lesson.id).toBe(titleOf.get(lesson.sourceTopicId));
    }
  });

  it('déclare la provenance de chaque leçon de façon lisible par machine', () => {
    for (const lesson of catalogueLessons) {
      expect(lesson.decompositionType, lesson.id).toBe('single_topic');
      expect(lesson.decisionStatus, lesson.id).toBe('owner_supplied');
    }
  });
});

describe('découpage 4AM — intégrité des leçons', () => {
  it('donne à chaque leçon un code unique', () => {
    const codes = catalogueLessons.map((l) => l.id);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('donne à chaque leçon les champs dont le catalogue a besoin pour s’afficher', () => {
    for (const lesson of catalogueLessons) {
      // `Courses.jsx` et `LessonCard` déréférencent ces champs sans garde :
      // un null ici est un écran blanc, pas un affichage dégradé.
      expect(typeof lesson.title, lesson.id).toBe('string');
      expect(typeof lesson.description, lesson.id).toBe('string');
      expect(typeof lesson.path, lesson.id).toBe('string');
      expect(lesson.description.length, lesson.id).toBeGreaterThan(0);
      expect(Array.isArray(lesson.prerequisites), lesson.id).toBe(true);
    }
  });

  it('construit le chemin sous le niveau et la classe qui la portent', () => {
    for (const lesson of catalogueLessons) {
      expect(lesson.path, lesson.id).toBe(
        `/courses/moyen/4am/${lesson.chapterId}/${lesson.id}`
      );
    }
  });

  it("n'ouvre à l'élève que les leçons réellement écrites sur le disque", () => {
    // La règle que la phase 7 exprimait par « tout est coming_soon » : une
    // leçon ne passe à `available` QUE si son implémentation existe. Elle
    // est ici vérifiée sur le disque plutôt que figée à « aucune », pour
    // qu'écrire une leçon reste possible sans affaiblir la garde — et pour
    // qu'un `available` posé par erreur sur une leçon non écrite échoue.
    const lessonsDir = new URL(
      '../../../../apps/web/src/lessons/moyen/4am/',
      import.meta.url
    );

    for (const lesson of catalogueLessons) {
      const configPath = new URL(
        `${lesson.chapterId}/${lesson.id}/lesson.config.js`,
        lessonsDir
      );
      const built = existsSync(configPath);

      expect(
        lesson.status,
        `${lesson.id} : statut « ${lesson.status} » alors que lesson.config.js ${built ? 'existe' : "n'existe pas"}`
      ).toBe(built ? 'available' : 'coming_soon');
    }
  });
});

describe('découpage 4AM — points d’apprentissage', () => {
  const allLps = catalogueLessons.flatMap((l) =>
    l.learningPoints.map((lp) => ({ ...lp, lessonId: l.id }))
  );

  it('rattache chaque point à exactement une leçon, avec un identifiant stable', () => {
    for (const lesson of catalogueLessons) {
      lesson.learningPoints.forEach((lp, i) => {
        expect(lp.id, `${lesson.id}/${i}`).toBe(`4am_${lesson.id}_P${i + 1}`);
        expect(lp.order).toBe(i + 1);
      });
    }
  });

  it('ne donne jamais le même identifiant à deux points', () => {
    const ids = allLps.map((lp) => lp.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('donne à chaque leçon au moins un point d’apprentissage', () => {
    // Une leçon sans point n'est évaluable par rien : ni progression, ni
    // carte des connaissances, ni évaluation finale ne peuvent s'y accrocher.
    for (const lesson of catalogueLessons) {
      expect(lesson.learningPoints.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('reprend les intitulés fournis, sans en réécrire aucun', () => {
    const supplied = new Map(decomposition.lessons.map((l) => [l.code, l.pointsToLearn]));
    for (const lesson of catalogueLessons) {
      expect(lesson.learningPoints.map((lp) => lp.title), lesson.id).toEqual(supplied.get(lesson.id));
    }
  });

  it('ne duplique aucun intitulé à l’intérieur d’une même leçon', () => {
    for (const lesson of catalogueLessons) {
      const titles = lesson.learningPoints.map((lp) => lp.title);
      expect(new Set(titles).size, lesson.id).toBe(titles.length);
    }
  });
});

describe('découpage 4AM — périmètre', () => {
  it('ne fait entrer aucune leçon française dans le catalogue algérien', () => {
    const frenchLessonIds = new Set(
      referenceCourseLevels.flatMap((level) =>
        level.grades.flatMap((g) => g.chapters.flatMap((c) => c.lessons.map((l) => l.id)))
      )
    );
    for (const lesson of catalogueLessons) {
      expect(frenchLessonIds.has(lesson.id), lesson.id).toBe(false);
    }
  });

  it('laisse la terminale sans contenu inventé', () => {
    // Aucun programme n'a été fourni pour cette classe. Elle garde son
    // identité et son état explicite, et rien d'autre.
    const terminale = dzCourseLevels
      .flatMap((l) => l.grades)
      .find((g) => g.id === 'terminale_dz');
    expect(terminale.chapters).toEqual([]);
    expect(terminale.curriculumStatus).toBe('not_supplied');
  });

  it('dit que la 4AM a un découpage, pas encore des cours', () => {
    expect(dzGrade4am.curriculumStatus).toBe('lessons_planned');
  });
});
