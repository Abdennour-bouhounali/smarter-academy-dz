import React from 'react';

/**
 * Un GROUPE d'objets (un rayon, un bouquet, un paquet) : un cadre qui porte
 * un titre court et son contenu. Sert aux manipulations où l'élève
 * construit des groupes identiques ; l'identité des groupes se VOIT parce
 * que tous les cadres ont le même dessin.
 */
export default function Group({ title, tone = 'indigo', children, className = '', identical = true, ...rest }) {
  const T = {
    indigo: 'border-indigo-200 bg-indigo-50/60', emerald: 'border-emerald-200 bg-emerald-50/60', amber: 'border-amber-300 bg-amber-50', rose: 'border-rose-200 bg-rose-50/60', slate: 'border-slate-200 bg-white',
  }[tone] ?? '';
  return (
    <div className={`rounded-xl border-2 p-2 ${T} ${identical ? '' : 'border-dashed'} ${className}`} {...rest}>
      {title && <div className="mb-1 text-[11px] font-bold text-slate-600">{title}</div>}
      {children}
    </div>
  );
}
