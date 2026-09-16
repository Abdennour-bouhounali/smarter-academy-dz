import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, '../..');
const read = (p) => readFileSync(resolve(srcRoot, p), 'utf8');

/**
 * « L'élève peut noter quand il veut, pas seulement s'il s'est trompé. »
 *
 * Le carnet était rendu à l'intérieur du bloc `{answered && …}` : tant que la
 * question n'était pas validée, aucun moyen d'écrire quoi que ce soit. Une
 * remarque vient pourtant souvent PENDANT la recherche, et l'élève qui a juste
 * a autant à noter que celui qui s'est trompé.
 */
describe('le carnet est atteignable à tout moment', () => {
  const session = read('pages/student/practice/PracticeSession.jsx');

  it('un NotebookButton est rendu hors du bloc « répondu »', () => {
    // On isole le bloc de correction (`{answered && (` … ) pour vérifier qu'il
    // reste AU MOINS un bouton en dehors de lui.
    const start = session.indexOf('{answered && (');
    expect(start).toBeGreaterThan(-1);
    const before = session.slice(0, start);
    expect(before).toMatch(/<NotebookButton/);
  });

  it('le déclencheur cohabite avec la validation, pas avec le verdict', () => {
    expect(session).toMatch(/\{!answered && <NotebookButton/);
  });

  it('le libellé de saisie ne présume pas d’une erreur', () => {
    const button = read('features/practice/NotebookButton.jsx');
    const notebookAr = JSON.parse(read('i18n/locales/ar/student.json')).notebook;
    // « Ce que je DOIS retenir » cadrait la note comme un constat d'échec ;
    // « ce que je VEUX retenir » en fait un choix de l'élève. La nuance doit
    // survivre à la traduction : l'arabe dit « ما أريد أن أتذكّره » — أريد
    // (je veux), et surtout PAS يجب (je dois).
    expect(button).toMatch(/notebook\.notePlaceholder/);
    expect(notebookAr.notePlaceholder).toContain('أريد');
    expect(notebookAr.notePlaceholder).not.toContain('يجب');
  });

  it('le type d’erreur reste facultatif', () => {
    const button = read('features/practice/NotebookButton.jsx');
    // `mistakeType` part à null et n'est jamais exigé avant l'envoi : seul le
    // contenu conditionne l'enregistrement.
    expect(button).toMatch(/defaultType = null/);
    expect(button).toMatch(/disabled=\{!content\.trim\(\) \|\| busy\}/);
  });
});

describe('le carnet se parcourt par leçon dans Ma progression', () => {
  it('Ma progression monte le carnet', () => {
    expect(read('pages/student/Progression.jsx')).toMatch(/<NotebookBrowser\s*\/>/);
  });

  const browser = read('features/practice/NotebookBrowser.jsx');
  // L'interface est ARABE : les libellés ne sont plus dans le JSX mais dans le
  // catalogue de traduction. Les contrats ci-dessous vérifient donc les DEUX
  // bouts — la clé est bien posée dans le composant, et elle correspond bien
  // à un texte non vide côté arabe.
  const studentAr = JSON.parse(read('i18n/locales/ar/student.json'));
  const commonAr = JSON.parse(read('i18n/locales/ar/common.json'));

  it('les notes sont groupées par leçon et titrées depuis le catalogue', () => {
    expect(browser).toMatch(/getLessonById/);
    expect(browser).toMatch(/note\.lessonCode \|\| '__sans_lecon__'/);
  });

  it('elles se présentent UNE PAR UNE, avec navigation', () => {
    expect(browser).toMatch(/notebook\.noteOf', \{ current: index \+ 1, total: group\.notes\.length \}/);
    expect(studentAr.notebook.noteOf).toContain('{{current}}');
    expect(studentAr.notebook.noteOf).toContain('{{total}}');
    expect(browser).toMatch(/notebook\.previousNote/);
    expect(browser).toMatch(/notebook\.nextNote/);
    expect(studentAr.notebook.previousNote.trim()).not.toBe('');
    expect(studentAr.notebook.nextNote.trim()).not.toBe('');
  });

  it('chacune se modifie et se marque traitée — dans les deux sens', () => {
    expect(browser).toMatch(/notebook\.markHandled/);
    expect(browser).toMatch(/notebook\.markToReview/);
    expect(studentAr.notebook.markHandled.trim()).not.toBe('');
    expect(studentAr.notebook.markToReview.trim()).not.toBe('');
    // La BASCULE elle-même — c'est elle qui fait les « deux sens ».
    expect(browser).toMatch(/completed: !note\.isCompleted/);
    expect(browser).toMatch(/tc\('edit'\)/);
    expect(commonAr.edit.trim()).not.toBe('');
  });

  it('une note sans leçon n’est pas perdue', () => {
    // Elle est rangée dans un groupe explicite plutôt que filtrée.
    expect(browser).toMatch(/notebook\.notesOutsideLesson/);
    expect(studentAr.notebook.notesOutsideLesson.trim()).not.toBe('');
  });
});
