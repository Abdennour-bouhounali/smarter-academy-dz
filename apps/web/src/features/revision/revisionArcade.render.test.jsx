// « صفحة المراجعة » in the 2D game look (REVISION_PAGE.md §4): the student's page draws the lesson's OWN revision.js in
// the two presentations, in Arabic and right to left; the plain sheet stays the teacher's page and the paper.
// Server render (the tests have no DOM): the portal is drawn in place, the first screen only.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import RevisionArcade from './RevisionArcade';

vi.mock('react-dom', async (importOriginal) => ({ ...(await importOriginal()), createPortal: (node) => node }));

const LESSON = 'qasim-adad-tabii';
// found on disk, like revision.test.js: a test names no lesson's path
const [{ REVISION }] = Object.values(
  import.meta.glob('../../lessons/moyen/**/qasim-adad-tabii/revision.js', { eager: true }),
);
const draw = () =>
  renderToString(
    <MemoryRouter>
      <RevisionArcade lessonId={LESSON} data={REVISION} />
    </MemoryRouter>,
  );
const src = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

beforeEach(() => {
  globalThis.window = { location: { search: '' } };
  globalThis.document = globalThis.document ?? { body: null }; // the portal's target: the mock draws in place
});

describe('« صفحة المراجعة » in the 2D game look', () => {
  it('« شاشة بشاشة »: one step at a time, the robot says where he is, right to left', () => {
    const html = draw();
    expect(html).toContain(`data-revision-arcade="${LESSON}"`);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('data-revision-step="recall"');
    expect(html).not.toContain('data-revision-step="lesson"');
    expect(html).toContain('الخطوة 1 من 7.');
    for (const word of ['شاشة بشاشة', 'صفحة واحدة', 'داكن', 'فاتح', 'الصوت: مفعّل', 'طباعة', 'التالي', 'السابق']) {
      expect(html).toContain(word);
    }
    // one segment of the path per step, named by its short title
    for (const step of REVISION.steps) expect(html).toContain(`aria-label="${step.short}"`);
    // nothing of the French interface came across
    expect(html).not.toMatch(/Étape|Suivant|Précédent|Imprimer|Par écrans|En une page|Sombre|Clair/);
  });

  it('« صفحة واحدة » (?mode=page): the seven steps one under the other, each with its tick', () => {
    globalThis.window = { location: { search: '?mode=page' } };
    const html = draw();
    expect(html).toContain('data-mode="page"');
    for (const step of REVISION.steps) expect(html).toContain(`data-revision-step="${step.id}"`);
    expect(html.match(/أنهيت هذه الخطوة/g)).toHaveLength(REVISION.steps.length);
    expect(html).toContain('أعلى الصفحة');
    expect(html).toContain('data-revision-quiz');
  });

  it('the student sees the game look with the plain sheet kept for the paper; the teacher sees the plain sheet', () => {
    const page = src('./RevisionPage.jsx');
    expect(page).toMatch(/<RevisionArcade key=\{lessonId\} lessonId=\{lessonId\} data=\{data\} \/>\s*\{sheet\}/);
    expect(page).toContain('paper={!teacher}');
    const css = src('./revisionArcade.css');
    expect(css).toMatch(/@media print \{\s*\.vb\[data-revision-arcade\] \{\s*display: none !important;/);
    expect(css).toMatch(/@media screen \{\s*\.rv--paper \{\s*display: none;/);
  });
});
