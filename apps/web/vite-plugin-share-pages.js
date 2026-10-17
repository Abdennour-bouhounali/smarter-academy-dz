import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SITE = 'https://smarter-academy.com';

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Remplace le `content` d'une balise <meta name|property="key"> — même quand la balise tient sur deux lignes. */
function setMeta(html, key, value) {
  const re = new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`);
  return html.replace(re, (_m, open, close) => `${open}${escapeAttr(value)}${close}`);
}

/**
 * Une page de PARTAGE : l'index.html du build dont les balises <title>, description,
 * Open Graph et Twitter parlent de CETTE page. Les robots de partage (WhatsApp,
 * Facebook, Telegram) lisent le HTML sans exécuter React : sans cela, tout lien
 * `/books/<slug>` s'afficherait avec la carte de l'accueil. L'application, elle,
 * démarre à l'identique (même script, même routeur).
 */
export function renderSharePage(html, card) {
  const url = `${SITE}${card.path}`;
  const image = `${SITE}${card.image}`;
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(card.title)}</title>`);
  out = setMeta(out, 'description', card.description);
  out = setMeta(out, 'og:url', url);
  out = setMeta(out, 'og:title', card.title);
  out = setMeta(out, 'og:description', card.description);
  out = setMeta(out, 'og:image', image);
  out = setMeta(out, 'og:image:alt', card.title);
  out = setMeta(out, 'twitter:title', card.title);
  out = setMeta(out, 'twitter:description', card.description);
  out = setMeta(out, 'twitter:image', image);
  return out.replace('</head>', `  <link rel="canonical" href="${url}" />\n</head>`);
}

/**
 * Écrit dist/<path>/index.html pour chaque carte de partage. Apache sert un
 * dossier existant avant la règle de repli SPA (.htaccess : `!-d`). Un nouveau
 * livre = une entrée dans src/features/books/shareCards.json (+ sa carte dans
 * public/og/, voir scripts/og-card.py) — docs/architecture/BOOKS_STORE.md §6.
 */
export default function sharePages({ cards }) {
  let outDir = 'dist';
  let projectRoot = process.cwd();
  return {
    name: 'sa-share-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
      projectRoot = config.root;
    },
    closeBundle() {
      // resolve, pas join : l'outDir peut être absolu (scripts/analyze-entry-bundle.mjs construit dans /tmp).
      const root = resolve(projectRoot, outDir);
      const base = readFileSync(join(root, 'index.html'), 'utf8');
      for (const card of cards) {
        const dir = join(root, card.path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), renderSharePage(base, card));
      }
    },
  };
}
