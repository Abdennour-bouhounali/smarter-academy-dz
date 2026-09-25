import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n';
import { AuthContext } from '../../context/AuthContext';
import { StudyContextContext } from '../../context/StudyContextContext';
import { ContentAvailabilityContext } from '../../context/ContentAvailabilityContext';
import Qism from './Qism';

const noop = async () => {};

function render(studyContext, url = '/espace/qism') {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[url]}>
      <AuthContext.Provider value={{ token: 'tk', user: { role: 'student' } }}>
        <StudyContextContext.Provider value={{ studyContext, refresh: noop }}>
          <ContentAvailabilityContext.Provider value={{ refresh: noop, hiddenByClassCount: 0 }}>
            <Qism />
          </ContentAvailabilityContext.Provider>
        </StudyContextContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

const INDEPENDENT = { mode: 'independent', classrooms: [], primary: null, hiddenLessonCodes: [] };

describe('Qism — rejoindre, c’est consentir', () => {
  it('le formulaire montre le texte de partage et « أوافق وأنضمّ »', () => {
    const html = render(INDEPENDENT);
    expect(html).toContain('data-qism-sharing');
    expect(html).toContain('أوافق وأنضمّ');
    expect(html).toContain('بريدك الإلكتروني');
  });

  it('une adhésion à confirmer reçoit sa carte, les autres non', () => {
    const html = render({
      mode: 'classroom',
      primary: null,
      hiddenLessonCodes: [],
      classrooms: [
        { id: 1, name: 'قسم أ', grade: '4am', consentRequired: true },
        { id: 2, name: 'قسم ب', grade: '4am', consentRequired: false },
      ],
    });
    expect(html).toContain('data-qism-consent-required="1"');
    expect(html).not.toContain('data-qism-consent-required="2"');
  });

  it('sans suggestion, la section « اقتراحات أستاذك » est absente', () => {
    expect(render(INDEPENDENT)).not.toContain('data-qism-recommendations');
  });

  it('un ?token= n’affiche aucune carte avant l’aperçu, et ne rejoint rien au rendu', () => {
    expect(render(INDEPENDENT, '/espace/qism?token=abc')).not.toContain('data-qism-invitation');
  });
});
