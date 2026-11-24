/**
 * Builds the ONE standalone page `../thales-egypt.html` (three.js bundled in: it opens from the file system, no network)
 * from `page.html` (the text and the diagrams) and `main.js` (the three 3D views).
 * Run from the repository root:  node docs/reports/mockups/thales-egypt-3d/build.mjs
 */
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = await build({
  entryPoints: [join(here, 'main.js')],
  bundle: true,
  format: 'iife',
  minify: true,
  write: false,
  logLevel: 'warning',
});
const js = out.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
const html = readFileSync(join(here, 'page.html'), 'utf8').replace('<!-- 3D:js -->', () => `<script>${js}</script>`);
writeFileSync(join(here, '..', 'thales-egypt.html'), html);
console.log('thales-egypt.html', Math.round(html.length / 1024) + ' KB');
