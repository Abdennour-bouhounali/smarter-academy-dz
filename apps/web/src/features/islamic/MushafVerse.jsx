import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ensureQuranFont } from './quranFont';
import { BASMALA_UTHMANI } from './content/mushaf.js';
import { hasQuranSource } from './IslamicContentRenderer';

/**
 * Un verset composé COMME DANS LE مصحف — en code, jamais en image : la
 * basmala en vert au-dessus, le verset en rasm ʿuthmānī (Amiri Quran), et à
 * sa fin le médaillon « ۝ » dessiné en SVG avec le numéro du verset en
 * chiffres arabes-indiens (la convention du مصحف ; la référence lisible sous
 * le verset garde les chiffres de la plateforme, isolés en LTR).
 *
 * Le texte n'est jamais modifié (pas de تطويل ajouté) : il vient de Tanzil
 * `quran-uthmani` (content/mushaf.js), vérifié par islamic.test.js.
 *
 *   basmala — la montrer au-dessus (par défaut : quand le passage ouvre une
 *             sourate autre qu'al-Fātiḥa et at-Tawba).
 */
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
export const toArabicIndic = (n) => String(n).replace(/\d/g, (d) => ARABIC_INDIC[d]);

/** Le médaillon de fin de verset : une rosace à douze lobes, deux cercles, le numéro. */
export function AyahMarker({ number, className = '' }) {
  const lobes = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return { cx: 20 + 15 * Math.cos(a), cy: 20 + 15 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 40 40" className={`sa-ayah-marker ${className}`} aria-hidden="true" focusable="false" data-ayah-marker={number}>
      <g fill="#fff" stroke="currentColor" strokeWidth="1.3">
        {lobes.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r="3.6" />)}
        <circle cx="20" cy="20" r="15" />
      </g>
      <circle cx="20" cy="20" r="11.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <text
        x="20" y="21" textAnchor="middle" dominantBaseline="central"
        fontSize={String(number).length > 2 ? 11 : 16} fill="#334155"
        style={{ fontFamily: "'Amiri Quran', 'Amiri', 'Noto Naskh Arabic', serif" }}
      >
        {toArabicIndic(number)}
      </text>
    </svg>
  );
}

export default function MushafVerse({ item, basmala, showReference = true, className = '' }) {
  const { t } = useTranslation('common');
  useEffect(() => { ensureQuranFont(); }, []);
  if (!hasQuranSource(item)) return null;
  const withBasmala = basmala ?? (item.ayah === 1 && item.surah !== 1 && item.surah !== 9);
  const last = item.verses.at(-1).ayah;
  return (
    <figure dir="rtl" lang="ar" className={`m-0 text-center ${className}`} data-mushaf-verse={item.id}>
      {withBasmala && (
        // ﷽ (U+FDFD) : la basmala en un seul signe calligraphié, que Amiri dessine
        // allongée comme dans le مصحف. Le texte exact reste pour le lecteur d'écran.
        <p className="sa-mushaf sa-mushaf-basmala m-0" data-mushaf-basmala>
          <span aria-hidden="true">{'\uFDFD'}</span>
          <span className="sr-only">{BASMALA_UTHMANI.text}</span>
        </p>
      )}
      <blockquote className="sa-mushaf sa-mushaf-verse m-0 text-slate-800">
        {item.verses.map((v) => (
          <span key={v.ayah}>
            {v.text}
            {' '}
            <AyahMarker number={v.ayah} />
            {v.ayah !== last && ' '}
          </span>
        ))}
      </blockquote>
      {showReference && (
        <figcaption className="mt-2 text-xs text-emerald-900/70" data-islamic-reference>
          {t('islamic.quranSurah', { name: item.surahName })}
          {'، '}
          {item.verses.length > 1 ? t('islamic.quranAyahs') : t('islamic.quranAyah')}
          {' '}
          <bdi dir="ltr">{item.verses.length > 1 ? `${item.ayah}–${last}` : item.ayah}</bdi>
        </figcaption>
      )}
    </figure>
  );
}
