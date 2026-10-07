#!/usr/bin/env node
/**
 * Régénère les INSTANTANÉS DE SOURCE de la couche « القيم الإسلامية » —
 * le texte exact de chaque verset et de chaque ḥadīth cité par le registre
 * (apps/web/src/features/islamic/content/). Les tests unitaires vérifient
 * ensuite, hors ligne, que chaque citation est une sous-chaîne exacte de sa
 * source (features/islamic/islamic.test.js).
 *
 *   Coran  : Tanzil, texte « simple » (api.alquran.cloud, édition quran-simple),
 *            et « uthmani » pour le verset de l'accueil (content/mushaf.js).
 *            La basmala que l'API préfixe au verset 1 (sauf al-Fātiḥa) est retirée.
 *   Ḥadīth : éditions arabes de fawazahmed0/hadith-api (jsDelivr). Muslim est
 *            indexé par la numérotation de ʿAbd al-Bāqī (`arabicnumber`), toutes
 *            ses sous-narrations (2699.01, 2699.02…) gardées.
 *
 * À lancer après tout ajout au registre :  node scripts/islamic-fetch-sources.mjs
 * Voir docs/architecture/ISLAMIC_VALUES.md § Intégrité des sources.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ISLAMIC_CONTENT } from '../apps/web/src/features/islamic/content/index.js';
import { BASMALA_UTHMANI, HOME_VERSE } from '../apps/web/src/features/islamic/content/mushaf.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'apps/web/src/features/islamic/content/__fixtures__');
// Comparée sans diacritiques : l'ordre des marques combinées (شدّة + فتحة)
// varie d'une saisie à l'autre.
const bare = (s) => s.replace(/[\u064B-\u0652\u0670]/g, '');
const BASMALA_WORDS = 'بسم الله الرحمن الرحيم';

async function json(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const quranRefs = new Set();
const hadithRefs = new Map(); // collection → Set(number)
for (const item of ISLAMIC_CONTENT) {
  if (Array.isArray(item.verses)) for (const v of item.verses) quranRefs.add(`${item.surah}:${v.ayah}`);
  if (item.collection) {
    if (!hadithRefs.has(item.collection)) hadithRefs.set(item.collection, new Set());
    hadithRefs.get(item.collection).add(String(item.number));
  }
}

const quran = {};
for (const ref of [...quranRefs].sort()) {
  const { data } = await json(`https://api.alquran.cloud/v1/ayah/${ref}/quran-simple`);
  let text = data.text;
  const words = text.split(' ');
  if (data.numberInSurah === 1 && data.surah.number !== 1 && bare(words.slice(0, 4).join(' ')) === BASMALA_WORDS) {
    text = words.slice(4).join(' ');
  }
  quran[ref] = text;
  process.stdout.write('.');
}

// Le rasm ʿuthmānī de l'accueil (content/mushaf.js) : même nettoyage (BOM de
// 1:1, basmala préfixée au verset 1).
const uthmani = {};
for (const ref of [`${BASMALA_UTHMANI.surah}:${BASMALA_UTHMANI.ayah}`, ...HOME_VERSE.verses.map((v) => `${HOME_VERSE.surah}:${v.ayah}`)]) {
  const { data } = await json(`https://api.alquran.cloud/v1/ayah/${ref}/quran-uthmani`);
  let text = data.text.replace(/\uFEFF/g, '');
  const words = text.split(' ');
  if (data.numberInSurah === 1 && data.surah.number !== 1 && bare(words.slice(0, 4).join(' ')).replace(/ٱ/g, 'ا') === BASMALA_WORDS) {
    text = words.slice(4).join(' ');
  }
  uthmani[ref] = text;
  process.stdout.write('*');
}

const hadith = {};
for (const [collection, numbers] of hadithRefs) {
  const { hadiths } = await json(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collection}.min.json`);
  for (const number of numbers) {
    const key = (h) => String(collection === 'muslim' ? h.arabicnumber : h.hadithnumber);
    const texts = hadiths.filter((h) => key(h) === number || key(h).startsWith(`${number}.`)).map((h) => h.text);
    if (texts.length === 0) throw new Error(`introuvable : ${collection} ${number}`);
    hadith[`${collection}:${number}`] = texts;
  }
  process.stdout.write('+');
}

await mkdir(OUT, { recursive: true });
await writeFile(resolve(OUT, 'tanzilSimple.json'), `${JSON.stringify(quran, null, 2)}\n`);
await writeFile(resolve(OUT, 'tanzilUthmani.json'), `${JSON.stringify(uthmani, null, 2)}\n`);
await writeFile(resolve(OUT, 'hadithSources.json'), `${JSON.stringify(hadith, null, 2)}\n`);
console.log(`\n${Object.keys(quran).length} versets, ${Object.keys(hadith).length} ḥadīth → ${OUT}`);
