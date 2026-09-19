import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';

/**
 * Les INDICES progressifs (§19) : chaque demande découvre le suivant ; le
 * dernier ne contient pas la réponse — il pose la bonne QUESTION. Seul
 * l'enseignant (mode classe) dispose de « إظهار الحل », ailleurs.
 */
export default function ManipulationHint({ hints = [], level }) {
  const { t } = useTranslation('lesson');
  if (!hints.length || level <= 0) return null;
  const shown = hints.slice(0, Math.min(level, hints.length));
  return (
    <ol className="space-y-1.5" aria-live="polite" data-manipulation-hints>
      {shown.map((h, i) => (
        <li key={i} className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${i === shown.length - 1 ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span><span className="sr-only">{t('manipulation.hint.n', { n: i + 1 })} : </span>{h}</span>
        </li>
      ))}
    </ol>
  );
}
