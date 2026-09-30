import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';

/**
 * La TRAÇABILITÉ vers le manuel, visible par l'élève et l'enseignant :
 * « الكتاب المدرسي — ص 14 — تمرين 17 ». Toute donnée de leçon porte une
 * `source` (docs/sources/4am/unit1/extraction.json) ; cette étiquette la
 * rend lisible. `platform_addition` est affiché comme tel : le contenu
 * ajouté par la plateforme ne se fait jamais passer pour le manuel. Une
 * `reason` peut avoir son propre libellé (`textbook.additionReason.<reason>`,
 * p. ex. une affirmation de « أستعدّ » n'est pas un « مثال تفاعلي ») ; sinon
 * le libellé générique.
 */
export default function SourceTag({ source, className = '' }) {
  const { t } = useTranslation('lesson');
  if (!source) return null;
  if (source.type === 'platform_addition') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ${className}`}>
        {t(`textbook.additionReason.${source.reason}`, { defaultValue: t('textbook.platformAddition') })}
      </span>
    );
  }
  const parts = [t('textbook.book')];
  if (source.page) parts.push(t('textbook.page', { page: source.page }));
  if (source.section) parts.push(source.section);
  if (source.number != null) parts.push(t('textbook.number', { n: source.number }) + (source.part ? ` ${source.part}` : ''));
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ${className}`}>
      <BookOpen className="w-3 h-3" aria-hidden="true" />
      {parts.join(' — ')}
    </span>
  );
}
