import { describe, it, expect, afterEach } from 'vitest';
import { isDecor } from './ClassroomPaged';

// Un faux élément : ses attributs et sa position calculée (pas de DOM dans cet environnement de test).
const el = (attrs = {}, position = 'static') => ({ getAttribute: (n) => attrs[n] ?? null, position });
const realWindow = globalThis.window;

describe('isDecor — un décor n’est jamais un écran à lui seul (lecteur de mission)', () => {
  afterEach(() => { globalThis.window = realWindow; });
  const withStyles = () => { globalThis.window = { getComputedStyle: (e) => ({ position: e.position }) }; };

  it('le fond dégradé aria-hidden de la carte d’ouverture est un décor', () => {
    withStyles();
    expect(isDecor(el({ 'aria-hidden': 'true' }))).toBe(true);
  });

  it('un calque posé en absolu ou en fixe est un décor', () => {
    withStyles();
    expect(isDecor(el({}, 'absolute'))).toBe(true);
    expect(isDecor(el({}, 'fixed'))).toBe(true);
  });

  it('le contenu de la carte (titre, texte, une question) reste un élément', () => {
    withStyles();
    expect(isDecor(el())).toBe(false);
    expect(isDecor(el({ 'aria-hidden': 'false' }, 'relative'))).toBe(false);
  });
});
