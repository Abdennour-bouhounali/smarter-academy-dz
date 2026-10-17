import { describe, it, expect } from 'vitest';
import { renderSharePage } from './vite-plugin-share-pages.js';
import cards from './src/features/books/shareCards.json';

const BASE = `<html><head><title>Accueil</title>
<meta name="description"
  content="Accueil" />
<meta property="og:url" content="https://smarter-academy.com/" />
<meta property="og:title" content="Smarter Academy" />
<meta property="og:description"
  content="Accueil" />
<meta property="og:image" content="https://smarter-academy.com/og-image.png" />
<meta property="og:image:alt" content="Smarter Academy" />
<meta name="twitter:title" content="Smarter Academy" />
<meta name="twitter:description"
  content="Accueil" />
<meta name="twitter:image" content="https://smarter-academy.com/og-image.png" />
</head><body></body></html>`;

describe('renderSharePage', () => {
  it('remplace titre, description, og et twitter pour la page du livre', () => {
    const card = cards.find((c) => c.path === '/books/smart-protocol');
    const out = renderSharePage(BASE, card);
    expect(out).toContain(`<title>${card.title}</title>`);
    expect(out).toContain('property="og:url" content="https://smarter-academy.com/books/smart-protocol"');
    expect(out).toContain('property="og:image" content="https://smarter-academy.com/og/smart-protocol.png"');
    expect(out).toContain('name="twitter:image" content="https://smarter-academy.com/og/smart-protocol.png"');
    expect(out).toContain(`content="${card.description}"`);
    expect(out).toContain('<link rel="canonical" href="https://smarter-academy.com/books/smart-protocol" />');
    expect(out).not.toContain('og-image.png');
  });

  it('échappe les guillemets d’un titre', () => {
    const out = renderSharePage(BASE, { path: '/books/x', title: 'Le "livre"', description: 'd', image: '/og/x.png' });
    expect(out).toContain('content="Le &quot;livre&quot;"');
  });
});
