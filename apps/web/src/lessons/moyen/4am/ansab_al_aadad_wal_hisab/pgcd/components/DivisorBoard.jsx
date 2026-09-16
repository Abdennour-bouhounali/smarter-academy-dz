import React from 'react';
import { divisors, commonDivisors, gcdByDefinition } from './pgcdUtils';

/**
 * DivisorBoard — les trois mots du sujet, rendus visibles en même temps :
 * les قواسم de chaque nombre, leur intersection (القواسم المشتركة), et le
 * plus grand élément de cette intersection (القاسم المشترك الأكبر).
 *
 * C'est la seule surface de la leçon où l'élève voit la DÉFINITION du PGCD
 * plutôt qu'une méthode de calcul : il n'y a ici aucun algorithme, on lit
 * simplement deux listes. Les deux méthodes du programme n'arrivent
 * qu'après, comme moyens d'éviter d'écrire ces listes quand les nombres
 * grandissent.
 *
 * L'élève DÉSIGNE les diviseurs communs (`selected`), il ne les reçoit pas :
 * `revealCommon` ne passe à true que quand le module l'a décidé.
 */
export default function DivisorBoard({
  a,
  b,
  selected = [],        // number[] — les communs désignés par l'élève
  onToggle,             // (d) => void
  revealCommon = false, // surligner la vraie intersection
  revealGcd = false,    // montrer le panneau « le plus grand »
  disabled = false,
}) {
  const da = divisors(a);
  const db = divisors(b);
  const common = commonDivisors(a, b);
  const gcd = gcdByDefinition(a, b);
  const isCommon = (d) => common.includes(d);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Row
          n={a}
          list={da}
          selected={selected}
          isCommon={isCommon}
          revealCommon={revealCommon}
          gcd={gcd}
          revealGcd={revealGcd}
          onToggle={onToggle}
          disabled={disabled}
        />
        <Row
          n={b}
          list={db}
          selected={selected}
          isCommon={isCommon}
          revealCommon={revealCommon}
          gcd={gcd}
          revealGcd={revealGcd}
          onToggle={onToggle}
          disabled={disabled}
        />
      </div>

      {revealCommon && (
        <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-4 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-violet-500">
            القواسم المشتركة
          </div>
          <div className="flex flex-wrap gap-2">
            {common.map((d) => (
              <span
                key={d}
                className={`min-w-[44px] min-h-[40px] px-3 inline-flex items-center justify-center rounded-lg border-2 font-mono text-sm font-extrabold ${
                  revealGcd && d === gcd
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-violet-300 bg-white text-violet-800'
                }`}
              >
                {d}
              </span>
            ))}
          </div>
          {revealGcd && (
            <p className="text-sm text-slate-700 pt-1">
              أكبر هذه القواسم هو{' '}
              <strong className="font-mono text-emerald-700">{gcd}</strong> —
              وهو <strong>القاسم المشترك الأكبر</strong> للعددين{' '}
              <span className="font-mono">{a}</span> و{' '}
              <span className="font-mono">{b}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ n, list, selected, isCommon, revealCommon, gcd, revealGcd, onToggle, disabled }) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 space-y-2">
      <div className="text-sm font-bold text-slate-800">
        قواسم <span className="font-mono">{n}</span>
        <span className="ms-2 text-xs font-normal text-slate-400">
          ({list.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {list.map((d) => {
          const picked = selected.includes(d);
          const truly = isCommon(d);
          // Avant la révélation, seul le choix de l'élève colore la pastille.
          // Après, la vérité prend le dessus — la correction se VOIT, elle ne
          // se déduit pas.
          const tone = revealCommon
            ? truly
              ? revealGcd && d === gcd
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-violet-400 bg-violet-100 text-violet-900'
              : 'border-slate-200 bg-white text-slate-400'
            : picked
            ? 'border-blue-500 bg-blue-50 text-blue-800'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400';

          return (
            <button
              key={d}
              type="button"
              disabled={disabled || revealCommon}
              aria-pressed={picked}
              onClick={() => onToggle?.(d)}
              className={`min-w-[44px] min-h-[40px] px-2.5 rounded-lg border-2 font-mono text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${tone} ${
                disabled || revealCommon ? 'cursor-default' : ''
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
