import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Rocket } from 'lucide-react';

const ICONS = { beginner: Sprout, advanced: Rocket };

/**
 * Le SÉLECTEUR DE NIVEAU — « الأنشطة التفاعلية : [ مبتدئ ] [ متقدم ] ».
 *
 * Deux boutons, jamais deux pages. Le niveau actif est marqué
 * (`aria-pressed`, soulignement plein), le workspace au-dessous change ;
 * rien d'autre ne bouge. Voir `ManipulationWorkspace`, qui le pose.
 *
 * ACCESSIBILITÉ. C'est un `role="tablist"` avec ses `role="tab"` : un lecteur
 * d'écran annonce « onglet 1 sur 2, sélectionné », et les flèches ← → passent
 * d'un niveau à l'autre — en RTL, la flèche GAUCHE va au suivant, parce que
 * le suivant est dessiné à gauche. Cibles ≥ 44 px (contrat mobile).
 *
 * Aucun texte en dur : les libellés viennent de `manipulation.level.*`.
 *
 * CONTRAT DOM (e2e) :
 *   [data-manipulation-levels-selector] [data-level=beginner|advanced]
 *   [aria-selected] sur l'onglet actif
 */
export default function ManipulationLevelSelector({ levels, value, onChange, labelledBy, className = '' }) {
  const { t } = useTranslation('lesson');

  const move = (dir) => {
    const i = levels.indexOf(value);
    const next = levels[(i + dir + levels.length) % levels.length];
    if (next) onChange(next);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} data-manipulation-levels-selector>
      <span id={labelledBy} className="text-sm font-bold text-slate-700">{t('manipulation.level.title')}</span>
      <div
        role="tablist"
        aria-labelledby={labelledBy}
        className="inline-flex overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white p-0.5"
        onKeyDown={(e) => {
          // RTL : la flèche gauche va vers l'onglet dessiné à gauche, donc le SUIVANT.
          if (e.key === 'ArrowLeft') { e.preventDefault(); move(1); }
          if (e.key === 'ArrowRight') { e.preventDefault(); move(-1); }
        }}
      >
        {levels.map((id) => {
          const active = id === value;
          const Icon = ICONS[id] ?? Sprout;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`manip-level-tab-${id}`}
              aria-selected={active}
              aria-pressed={active}
              aria-controls={`manip-level-panel-${id}`}
              tabIndex={active ? 0 : -1}
              data-level={id}
              onClick={() => onChange(id)}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                active ? 'bg-indigo-600 text-white shadow' : 'bg-transparent text-slate-600 hover:bg-indigo-50'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(`manipulation.level.${id}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
