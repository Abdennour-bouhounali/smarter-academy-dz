import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ensureExamFont } from '../practice/exam/examFont';

/**
 * LE rendu d'un élément, selon ce qu'il EST. Trois habits qui ne se
 * mélangent jamais :
 *
 *   قرآن  — le texte exact entre ﴿ ﴾, la sourate et le numéro de verset
 *           (« من الآية » pour un extrait) ;
 *   حديث  — « قال رسول الله ﷺ: », le matn entre « », le recueil, son numéro,
 *           le rapporteur et la DEGRÉ d'authenticité ;
 *   قيمة / حكمة / تأمّل — une phrase de la plateforme, sans guillemets de
 *           citation ni attribution.
 *
 * Un élément coranique ou prophétique SANS ses métadonnées de source ne se
 * rend pas (null) : on ne montre jamais un « ḥadīth » sans recueil.
 *
 * `reflection` (la ligne d'accompagnement) est rendue SOUS un filet, avec
 * l'étiquette « تأمّل » : elle n'est pas le verset.
 *
 * Les numéros sont isolés en LTR (`<bdi dir="ltr">`) : « 5–6 » ne doit pas
 * s'inverser en RTL (ARABIC_RTL_CONTRACT).
 */
export function hasQuranSource(item) {
  return Boolean(item?.surah && item?.surahName && item?.ayah && Array.isArray(item?.verses) && item.verses.length > 0
    && item.verses.every((v) => v.ayah && v.text));
}

export function hasHadithSource(item) {
  return Boolean(item?.collection && item?.collectionName && item?.number && item?.text && item?.authenticity?.label);
}

export function renderKind(item) {
  if (!item) return null;
  if (item.type === 'quran' || (item.type === 'dua' && item.origin === 'quran')) return hasQuranSource(item) ? 'quran' : null;
  if (item.type === 'hadith' || (item.type === 'dua' && item.origin === 'hadith')) return hasHadithSource(item) ? 'hadith' : null;
  if (item.type === 'dua') return null; // un دعاء sans origine vérifiable ne se rend pas
  return item.text ? 'plain' : null;
}

function QuranBody({ item, compact }) {
  const { t } = useTranslation('common');
  // Le naskh de la feuille d'examen (Amiri, à la demande) : même police, même chargeur.
  useEffect(() => { ensureExamFont(); }, []);
  const range = item.ayahEnd && item.ayahEnd !== item.ayah;
  return (
    <figure className="m-0" data-islamic-kind="quran">
      <blockquote lang="ar" dir="rtl" className={`sa-quran m-0 text-slate-900 ${compact ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
        <span aria-hidden="true">﴿</span>
        {item.verses.map((v, i) => (
          <span key={v.ayah}>
            {i > 0 && <span className="mx-1.5 text-emerald-700/70" aria-hidden="true">۝</span>}
            {v.text}
          </span>
        ))}
        <span aria-hidden="true">﴾</span>
      </blockquote>
      <figcaption className="mt-1.5 text-xs text-emerald-900/80" data-islamic-reference>
        {t('islamic.quranSurah', { name: item.surahName })}
        {'، '}
        {item.excerpt && !range ? t('islamic.quranExcerpt') : range ? t('islamic.quranAyahs') : t('islamic.quranAyah')}
        {' '}
        <bdi dir="ltr">{range ? `${item.ayah}–${item.ayahEnd}` : item.ayah}</bdi>
      </figcaption>
    </figure>
  );
}

function HadithBody({ item, compact }) {
  const { t } = useTranslation('common');
  return (
    <figure className="m-0" data-islamic-kind="hadith">
      <p className="text-sm font-semibold text-emerald-900">{item.intro}:</p>
      <blockquote lang="ar" dir="rtl" className={`m-0 mt-1 leading-loose text-slate-900 ${compact ? 'text-base' : 'text-lg'}`}>
        «{item.text}»
      </blockquote>
      <figcaption className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-emerald-900/80" data-islamic-reference>
        <span>
          {item.collectionName} (<bdi dir="ltr">{item.number}</bdi>)
          {item.excerpt && <> · {t('islamic.hadithExcerpt')}</>}
        </span>
        {item.narrator && !compact && <span>· {t('islamic.hadithNarrator', { narrator: item.narrator })}</span>}
        <span data-islamic-grade>· {t('islamic.hadithGrade', { grade: item.authenticity.label })}</span>
      </figcaption>
    </figure>
  );
}

function PlainBody({ item, compact }) {
  const { t } = useTranslation('common');
  return (
    <div data-islamic-kind={item.type}>
      <p className={`leading-relaxed text-slate-800 ${compact ? 'text-base' : 'text-lg'}`}>{item.text}</p>
      {item.type === 'wisdom' && <p className="mt-1 text-xs text-emerald-900/70">{t('islamic.proverb')}</p>}
    </div>
  );
}

export default function IslamicContentRenderer({ item, compact = false, showReflection = !compact }) {
  const { t } = useTranslation('common');
  const kind = renderKind(item);
  if (!kind) return null;
  const Body = kind === 'quran' ? QuranBody : kind === 'hadith' ? HadithBody : PlainBody;
  return (
    <div dir="rtl" className="min-w-0 break-words" data-islamic-content={item.id}>
      <Body item={item} compact={compact} />
      {showReflection && item.reflection && (
        <p className="mt-3 border-t border-emerald-100 pt-2 text-sm text-slate-600" data-islamic-reflection>
          <span className="font-semibold text-emerald-800">{t('islamic.reflectionLabel')}: </span>
          {item.reflection}
        </p>
      )}
    </div>
  );
}
