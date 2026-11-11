import { describe, it, expect, afterEach } from 'vitest';
import { isDecor, isAtomic } from './ClassroomPaged';

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

describe('isAtomic — un dessin ne se découpe jamais en écrans (lecteur de mission, 2026-11-11)', () => {
  const XHTML = 'http://www.w3.org/1999/xhtml';
  const node = (tagName, namespaceURI = XHTML, attrs = {}) => ({ tagName, namespaceURI, hasAttribute: (n) => n in attrs });
  it('une figure, un svg et chacun de ses traits sont insécables', () => {
    expect(isAtomic(node('FIGURE'))).toBe(true);
    expect(isAtomic(node('svg', 'http://www.w3.org/2000/svg'))).toBe(true);
    expect(isAtomic(node('g', 'http://www.w3.org/2000/svg'))).toBe(true);
  });
  it('un écran gardé entier l’est aussi ; une liste de questions ne l’est pas', () => {
    expect(isAtomic(node('DIV', XHTML, { 'data-paging-keep': '' }))).toBe(true);
    expect(isAtomic(node('DIV'))).toBe(false);
    expect(isAtomic(node('UL'))).toBe(false);
  });
});
