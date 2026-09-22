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
    // Le champ d'écriture vit désormais dans le cahier (NotebookWindow) ;
    // c'est lui qui porte le texte d'invite.
    const windowSrc = read('features/practice/notebook/NotebookWindow.jsx');
    const notebookAr = JSON.parse(read('i18n/locales/ar/student.json')).notebook;
    // « Ce que je DOIS retenir » cadrait la note comme un constat d'échec ;
    // « ce que je VEUX retenir » en fait un choix de l'élève. La nuance doit
    // survivre à la traduction : l'arabe dit « ما أريد أن أتذكّره » — أريد
    // (je veux), et surtout PAS يجب (je dois).
    expect(windowSrc).toMatch(/notebook\.notePlaceholder/);
    expect(notebookAr.notePlaceholder).toContain('أريد');
    expect(notebookAr.notePlaceholder).not.toContain('يجب');
  });

  it('le type d’erreur reste facultatif', () => {
    const button = read('features/practice/NotebookButton.jsx');
    const windowSrc = read('features/practice/notebook/NotebookWindow.jsx');
    // `mistakeType` part à null et n'est jamais exigé avant l'envoi : seul le
    // contenu conditionne l'enregistrement (une note vide est refusée AVANT
    // l'aller-retour serveur).
    expect(button).toMatch(/defaultType = null/);
    expect(windowSrc).toMatch(/useState\(note\?\.mistakeType \?\? null\)/);
    expect(windowSrc).toMatch(/if \(isEmptyContent\(clean\)\)/);
  });
});

describe('le cahier s’ouvre en fenêtre, pré-rempli du contexte réel', () => {
  const session = read('pages/student/practice/PracticeSession.jsx');
  const windowSrc = read('features/practice/notebook/NotebookWindow.jsx');
  const studentAr = JSON.parse(read('i18n/locales/ar/student.json'));

  it('la séance transmet énoncé, question, réponse et verdict au cahier', () => {
    expect(session).toMatch(/notebookContext = \{/);
    for (const field of ['exercise', 'question', 'answer', 'evaluation', 'feedbackMessage']) {
      expect(session).toContain(field);
    }
    expect(session).toMatch(/onUpdate=\{patchNote\}/);
  });

  it('« مسح الكل » efface TOUT, contexte compris, avec confirmation seulement si l’élève a écrit', () => {
    expect(windowSrc).toMatch(/setHtml\('<p><br><\/p>'\)/);
    expect(windowSrc).toMatch(/untouched \? doClear\(\) : setConfirmClear\(true\)|if \(untouched\) doClear\(\);/);
    expect(studentAr.notebook.window.clear.trim()).not.toBe('');
    expect(studentAr.notebook.window.clearConfirmTitle.trim()).not.toBe('');
  });

  it('deux tailles, et rien d’autre', () => {
    const css = read('features/practice/notebook/notebook.css');
    expect(css).toMatch(/\.sa-nb-window\[data-size="large"\]/);
    expect(windowSrc).toMatch(/size === 'small' \? 'large' : 'small'/);
    expect(css).toMatch(/prefers-reduced-motion/);
  });

  it('les anciennes notes brutes se lisent toujours', () => {
    // Le carnet ne rend jamais `content` tel quel : tout passe par
    // NotebookContent (désinfection + mise en paragraphes du texte brut).
    for (const file of ['features/practice/notebook/space/NoteCard.jsx', 'features/practice/notebook/space/PrintSheet.jsx', 'features/practice/notebook/space/ReviewSession.jsx']) {
      expect(read(file)).toMatch(/<NotebookContent content=\{(note|current)\.content\}/);
      expect(read(file)).not.toMatch(/dangerouslySetInnerHTML/);
    }
  });
});

describe('« Mon cahier » est l’espace des notes ; la progression ne parle que de progression', () => {
  const progression = read('pages/student/Progression.jsx');
  const space = read('features/practice/notebook/space/NotebookSpace.jsx');
  const studentAr = JSON.parse(read('i18n/locales/ar/student.json'));
  const navAr = JSON.parse(read('i18n/locales/ar/nav.json'));

  it('Ma progression ne contient plus rien du cahier — ni liste, ni raccourci', () => {
    // Progression = « où en suis-je ? » ; cahier = « qu'ai-je écrit ? ». Les
    // deux espaces ne se mélangent pas : l'entrée du cahier est dans la
    // navigation de l'espace, pas dans la page de progression.
    expect(progression).not.toMatch(/NotebookBrowser/);
    expect(progression).not.toMatch(/\/espace\/cahier/);
    expect(progression).not.toMatch(/notebook\./);
    expect(studentAr.notebook.space.progressionShortcut).toBeUndefined();
  });

  it('le cahier a sa route, sa page de note, sa révision, et son entrée de navigation', () => {
    const app = read('App.jsx');
    expect(app).toMatch(/path="cahier"/);
    expect(app).toMatch(/path="cahier\/:noteId"/);
    expect(app).toMatch(/path="cahier\/revision"/);
    expect(read('data/studentNavigation.js')).toMatch(/path: '\/espace\/cahier'/);
    expect(navAr.notebook.trim()).not.toBe('');
  });

  it('les vues sont des filtres sur les mêmes notes, avec compteurs', () => {
    for (const v of ['all', 'review', 'errors', 'questions', 'pinned', 'archived']) {
      expect(studentAr.notebook.space.views[v].trim()).not.toBe('');
    }
    expect(space).toMatch(/useNotesSearch\(token, \{ view, q, sort, filters \}\)/);
    // La recherche est différée, la suppression confirmée, l'impression un document.
    expect(read('features/practice/notebook/space/useNotesSearch.js')).toMatch(/DEBOUNCE_MS = 300/);
    expect(space).toMatch(/<ConfirmDialog/);
    expect(space).toMatch(/<PrintDialog/);
  });

  it('une carte lit une note riche OU brute par le même rendu, et montre son origine', () => {
    const card = read('features/practice/notebook/space/NoteCard.jsx');
    expect(card).toMatch(/<NotebookContent content=\{note\.content\}/);
    expect(card).toMatch(/contextTrail\(note, t\)/);
    expect(card).toMatch(/sourceLinkFor\(note(, base)?\)/);
  });

  it('les états vides guident au lieu de dire « aucune note »', () => {
    const empty = studentAr.notebook.space.empty;
    expect(empty.allTitle.trim()).not.toBe('');
    expect(empty.allCta.trim()).not.toBe('');
    expect(empty.reviewBody.trim()).not.toBe('');
  });
});
