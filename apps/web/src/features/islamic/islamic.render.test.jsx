import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../i18n';
import { ISLAMIC_CONTENT } from './content/index.js';
import IslamicContentRenderer from './IslamicContentRenderer';
import IslamicContentCard from './IslamicContentCard';
import IslamicBreak from './IslamicBreak';
import IslamicGreeting from './IslamicGreeting';
import MushafVerse, { AyahMarker, toArabicIndic } from './MushafVerse';
import { BASMALA, HOME_VERSE } from './content/mushaf.js';

/**
 * Le RENDU : arabe RTL, trois habits distincts (verset, ḥadīth, phrase de
 * la plateforme), la réflexion séparée du texte, et le refus de rendre une
 * citation sans sa source.
 */
const byId = (id) => ISLAMIC_CONTENT.find((i) => i.id === id);
const html = (el) => renderToStaticMarkup(el);

describe('IslamicGreeting', () => {
  it('« السلام عليكم » + le nom du compte, jamais « أهلًا »', () => {
    const out = html(<IslamicGreeting name="عمر" />);
    expect(out).toContain('السلام عليكم عمر 🌿');
    expect(out).not.toContain('أهل');
  });
  it('sans nom, la salutation reste entière', () => {
    expect(html(<IslamicGreeting name="" />)).toContain('السلام عليكم 🌿');
  });
});

describe('IslamicContentRenderer — verset', () => {
  it('le texte exact entre ﴿ ﴾, sourate et numéro, réflexion à part', () => {
    const out = html(<IslamicContentRenderer item={byId('q-taha-114')} />);
    expect(out).toContain('dir="rtl"');
    expect(out).toContain('data-islamic-kind="quran"');
    expect(out).toContain('﴿');
    expect(out).toContain(byId('q-taha-114').verses[0].text);
    expect(out).toContain('سورة طه');
    expect(out).toContain('من الآية');
    expect(out).toContain('<bdi dir="ltr">114</bdi>');
    // la réflexion n'est PAS dans la citation
    const quote = out.slice(out.indexOf('<blockquote'), out.indexOf('</blockquote>'));
    expect(quote).not.toContain(byId('q-taha-114').reflection);
    expect(out).toContain('data-islamic-reflection');
  });

  it('plusieurs versets : « الآيات 5–6 » isolé LTR', () => {
    const out = html(<IslamicContentRenderer item={byId('q-sharh-5-6')} />);
    expect(out).toContain('الآيات');
    expect(out).toContain('<bdi dir="ltr">5–6</bdi>');
  });

  it('un long passage (العصر 1–3) se rend entier, sans troncature', () => {
    const item = byId('q-asr-1-3');
    const out = html(<IslamicContentCard item={item} />);
    for (const v of item.verses) expect(out).toContain(v.text);
    expect(out).toContain('break-words');
  });

  it('sans sourate ou numéro : rien n’est rendu', () => {
    const broken = { ...byId('q-taha-114'), surah: undefined };
    expect(html(<IslamicContentRenderer item={broken} />)).toBe('');
  });
});

describe('IslamicContentRenderer — ḥadīth', () => {
  it('« قال رسول الله ﷺ », le matn entre « », recueil, numéro et degré', () => {
    const out = html(<IslamicContentRenderer item={byId('h-bukhari-69')} />);
    expect(out).toContain('قال رسول الله ﷺ');
    expect(out).toContain(`«${byId('h-bukhari-69').text}»`);
    expect(out).toContain('صحيح البخاري');
    expect(out).toContain('<bdi dir="ltr">69</bdi>');
    expect(out).toContain('درجة الحديث: صحيح');
  });

  it('un long ḥadīth (مسلم 2999) se rend entier', () => {
    const item = byId('h-muslim-2999');
    expect(html(<IslamicContentCard item={item} />)).toContain(item.text);
  });

  it('le rapporteur est facultatif : sans lui, le reste de la référence reste', () => {
    const item = byId('h-tirmidhi-1920');
    expect(item.narrator).toBeUndefined();
    const out = html(<IslamicContentRenderer item={item} />);
    expect(out).toContain('سنن الترمذي');
    expect(out).not.toContain('عن undefined');
  });

  it('JAMAIS un « ḥadīth » sans recueil, numéro ou degré', () => {
    const base = byId('h-bukhari-69');
    for (const missing of ['collection', 'collectionName', 'number']) {
      expect(html(<IslamicContentRenderer item={{ ...base, [missing]: undefined }} />), missing).toBe('');
    }
    expect(html(<IslamicContentRenderer item={{ ...base, authenticity: undefined }} />)).toBe('');
    expect(html(<IslamicContentRenderer item={{ id: 'x', type: 'dua', text: 'دعاء بلا أصل' }} />)).toBe('');
  });
});

describe('IslamicContentRenderer — phrase de la plateforme', () => {
  it('sans guillemets de citation ni ﷺ', () => {
    const out = html(<IslamicContentRenderer item={byId('v-try-again')} />);
    expect(out).toContain('لا بأس، حاول مرة أخرى');
    expect(out).not.toMatch(/ﷺ|«|﴿/);
  });
  it('un مثل est nommé comme tel', () => {
    expect(html(<IslamicContentRenderer item={byId('w-jadda-wajada')} />)).toContain('مثل عربي');
  });
});

describe('IslamicContentCard / IslamicBreak', () => {
  it('la carte compacte n’a ni titre ni réflexion', () => {
    const out = html(<IslamicContentCard item={byId('q-najm-39')} compact />);
    expect(out).toContain('data-islamic-card="compact"');
    expect(out).not.toContain('data-islamic-reflection');
    expect(out).not.toContain('تذكرة</p>');
  });

  it('« وقفة إيمانية » : un titre, le rappel, « أكمل الدراسة » — sans case à cocher ni points', () => {
    const out = html(<IslamicBreak item={byId('h-muslim-783')} />);
    expect(out).toContain('وقفة إيمانية');
    expect(out).toContain('أكمل الدراسة');
    expect(out).toContain('data-islamic-continue');
    expect(out).not.toMatch(/type="checkbox"|نقاط|XP/);
    expect(out).not.toContain('role="dialog"');
  });

  it('aucune carte pour un élément sans source', () => {
    expect(html(<IslamicContentCard item={{ id: 'x', type: 'hadith', text: 'نص' }} />)).toBe('');
    expect(html(<IslamicBreak item={{ id: 'x', type: 'quran', verses: [] }} />)).toBe('');
  });
});

describe('MushafVerse — le verset de l’accueil, composé comme dans le مصحف', () => {
  it('basmala calligraphiée (﷽) + texte exact pour le lecteur d’écran, verset, médaillon ١', () => {
    const out = html(<MushafVerse item={HOME_VERSE} />);
    expect(out).toContain('dir="rtl"');
    expect(out).toContain('\uFDFD');
    expect(out).toContain(`<span class="sr-only">${BASMALA.text}</span>`);
    expect(out).toContain(HOME_VERSE.verses[0].text);
    expect(out).toContain('data-ayah-marker="1"');
    expect(out).toContain('>١</text>');
    expect(out).toContain('سورة العلق');
    expect(out).toContain('<bdi dir="ltr">1</bdi>');
    expect(out).not.toMatch(/<img/);
  });

  it('pas de basmala au milieu d’une sourate ; rien sans source', () => {
    const mid = { ...HOME_VERSE, ayah: 3, verses: [{ ayah: 3, text: 'نص' }] };
    expect(html(<MushafVerse item={mid} />)).not.toContain('data-mushaf-basmala');
    expect(html(<MushafVerse item={{ ...HOME_VERSE, surah: undefined }} />)).toBe('');
  });

  it('numéros du médaillon en chiffres arabes-indiens', () => {
    expect(toArabicIndic(114)).toBe('١١٤');
    expect(html(<AyahMarker number={286} />)).toContain('٢٨٦');
  });
});
