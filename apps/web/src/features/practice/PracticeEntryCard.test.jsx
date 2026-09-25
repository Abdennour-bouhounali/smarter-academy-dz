import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../i18n';
import PracticeEntryCard from './PracticeEntryCard';

// La pratique est un espace ÉLÈVE : la carte d'entrée ne doit jamais envoyer
// un enseignant ou un administrateur vers /espace/pratique (route élève →
// /login → accueil : le « renvoi vers l'accueil » constaté le 2026-09-25).
const render = (user, token = user ? 't' : null) => renderToStaticMarkup(
  <AuthContext.Provider value={{ user, token, loading: false }}>
    <MemoryRouter><PracticeEntryCard lessonId="qasim-adad-tabii" /></MemoryRouter>
  </AuthContext.Provider>,
);

describe('PracticeEntryCard — qui voit l’entrée de la pratique', () => {
  it('un élève voit le lien vers la pratique', () => {
    expect(render({ role: 'student' })).toContain('href="/espace/pratique/qasim-adad-tabii"');
  });

  it('un visiteur est invité à se connecter', () => {
    const html = render(null);
    expect(html).toContain('href="/login"');
    expect(html).not.toContain('/espace/pratique');
  });

  it('un enseignant et un administrateur ne voient AUCUNE entrée', () => {
    expect(render({ role: 'teacher' })).toBe('');
    expect(render({ role: 'admin' })).toBe('');
  });
});
