/**
 * La police du texte coranique en rasm ʿuthmānī — Amiri Quran, dessinée pour
 * les signes du مصحف (ألف الوصل ٱ, الألف الخنجرية, السكون). Chargée À LA DEMANDE
 * (premier verset affiché en `MushafVerse`), jamais dans index.html : seules
 * les pages qui montrent un verset la paient (BUNDLE_BOUNDARIES.md). Sans
 * réseau, la pile de `.sa-mushaf` (index.css) prend le relais.
 * Même patron que features/practice/exam/examFont.js.
 */
const HREF = 'https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap';

export function ensureQuranFont() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[data-quran-font]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = HREF;
  link.dataset.quranFont = '';
  document.head.appendChild(link);
}
