import React from 'react';

/**
 * Le panneau de PRÉDICTION d'un labo joué dans le lecteur de mission (pilote 2026-11-07, étendu 2026-11-08) : même place que les
 * questions du labo (la colonne, sans voile), deux réponses d'un toucher. La prédiction est GRATUITE (le terrain répond) et compte
 * pour l'étoile « توقّعاتك كانت صحيحة ». `attr` : préfixe des attributs de test (`data-<attr>-predict`, `data-<attr>-predict-say`) —
 * « tb » pour team-builder, « fp » pour factor-pairs.
 */
export default function PredictTray({ title, prompt, options, onSay, attr = 'tb' }) {
  const root = { [`data-${attr}-predict`]: '' };
  return (
    <div {...root}>
      <div role="dialog" aria-label={title} className="w-full space-y-4 rounded-[1.75rem] bg-white p-6 shadow-2xl ring-4 ring-amber-200">
        <p className="text-sm font-black uppercase tracking-wide text-amber-700">🔮 {title}</p>
        <p className="text-xl font-black leading-relaxed text-slate-900">{prompt}</p>
        <div className="grid gap-3">
          {options.map((o) => {
            const say = { [`data-${attr}-predict-say`]: o.says };
            return (
              <button key={o.says} type="button" onClick={() => onSay(o.says)} {...say}
                className="min-h-[56px] rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 text-start text-lg font-black text-amber-950 shadow-[0_3px_0_0_#FCD34D] hover:border-amber-500 active:translate-y-0.5">
                {o.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
