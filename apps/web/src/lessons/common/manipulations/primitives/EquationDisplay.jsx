import React from 'react';
import MathText from '../../components/MathText';

const TONES = {
  neutral: 'border-slate-200 bg-white text-slate-800',
  active: 'border-blue-400 bg-blue-50 text-blue-900 ring-2 ring-blue-200',
  ok: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  ko: 'border-rose-300 bg-rose-50 text-rose-900',
  muted: 'border-slate-200 bg-slate-50 text-slate-400',
  result: 'border-amber-300 bg-amber-50 text-amber-900',
};

/**
 * Une égalité mathématique, isolée en LTR (master spec §14) et rendue par
 * KaTeX via MathText. `tex` est une chaîne LaTeX SANS `$` — la brique les pose.
 * `note` (arabe) s'affiche à côté, dans le flux RTL de la page.
 */
export default function EquationDisplay({ tex, tone = 'neutral', note, size = 'md', className = '' }) {
  const text = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 ${TONES[tone] ?? TONES.neutral} ${className}`}>
      <div dir="ltr" className={`font-mono ${text}`}>
        <MathText>{`$${tex}$`}</MathText>
      </div>
      {note && <span className="text-xs sm:text-sm">{note}</span>}
    </div>
  );
}
