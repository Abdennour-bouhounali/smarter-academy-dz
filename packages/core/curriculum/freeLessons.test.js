import { describe, it, expect } from 'vitest';
import { FREE_LESSON_IDS, isLessonFree, resolveLessonTier } from './freeLessons.js';
import { ACTIVE_GRADE_IDS } from './activeGrades.js';
import { allCourseLevels } from './coursesData.js';

describe('freeLessons — les trois leçons gratuites', () => {
  it('la liste est figée : on ne l’étend pas par accident à l’exécution', () => {
    expect(Object.isFrozen(FREE_LESSON_IDS)).toBe(true);
  });

  it('une classe DORMANTE garde son palier hérité, intact', () => {
    // Le catalogue français n'est servi à personne (ContentAccess ferme sur
    // grades.is_active) ; le retoucher ferait bouger 133 lignes à chaque
    // import et noierait la vraie dérive.
    expect(resolveLessonTier('3e', 'thales-3e', 'free')).toBe('free');
    expect(resolveLessonTier('3e', 'thales-3e', 'premium')).toBe('premium');
    // Palier manquant : gratuit. Une leçon devient payante parce que
    // quelqu'un l'a décidé, jamais par omission.
    expect(resolveLessonTier('3e', 'thales-3e', undefined)).toBe('free');
  });

  it('sur une classe ACTIVE, seule la liste ouvre une leçon', () => {
    // On éprouve la RÈGLE, pas l'état courant de la liste (vide aujourd'hui) :
    // le test reste juste quand la phase 7 y inscrira trois identifiants.
    const activeGrade = ACTIVE_GRADE_IDS[0];
    if (!activeGrade) {
      // Aucune classe active : la règle n'a rien à trancher, et c'est
      // l'état attendu tant que le programme 4AM n'est pas implémenté.
      expect(ACTIVE_GRADE_IDS).toEqual([]);
      return;
    }

    for (const id of FREE_LESSON_IDS) {
      expect(resolveLessonTier(activeGrade, id, undefined)).toBe('free');
    }
    expect(resolveLessonTier(activeGrade, '__inexistante__', 'free')).toBe('premium');
  });

  it('isLessonFree ne reconnaît que ce qui est explicitement listé', () => {
    expect(isLessonFree('__jamais-listee__')).toBe(false);
    for (const id of FREE_LESSON_IDS) {
      expect(isLessonFree(id)).toBe(true);
    }
  });

  it('chaque identifiant listé existe réellement dans le catalogue', () => {
    // Un identifiant mal orthographié n'ouvrirait rien, en silence : la leçon
    // annoncée gratuite resterait vendue, et personne ne le verrait avant
    // qu'un élève ne se plaigne.
    const known = new Set(
      allCourseLevels.flatMap((level) =>
        level.grades.flatMap((grade) =>
          grade.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)),
        ),
      ),
    );

    for (const id of FREE_LESSON_IDS) {
      expect(known.has(id), `FREE_LESSON_IDS contient '${id}', absent du catalogue`).toBe(true);
    }
  });

  it('le produit algérien vend au plus trois leçons gratuites', () => {
    // La spec dit trois (§17). Plus serait un changement de modèle
    // commercial, pas un ajustement de contenu — et il doit passer par une
    // décision, pas par une ligne ajoutée sans bruit.
    expect(FREE_LESSON_IDS.length).toBeLessThanOrEqual(3);
  });
});
