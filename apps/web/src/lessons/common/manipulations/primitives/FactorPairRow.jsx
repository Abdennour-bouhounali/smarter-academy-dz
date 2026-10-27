import React from 'react';
import { useTranslation } from 'react-i18next';
import EquationDisplay from './EquationDisplay';
import HighlightedNumber from './HighlightedNumber';

/**
 * Une ligne du tableau de l'activité 2 (« كتابة العدد 60 على شكل جداء عاملين »
 * → « قواسم العدد 60 ») : soit `n = d × e` et les deux diviseurs qu'elle
 * livre, soit « d ne divise pas n ».
 */
export default function FactorPairRow({ n, d, e, divides, revealed = true, active = false }) {
  const { t } = useTranslation('lesson');
  if (!revealed) {
    return (
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 px-3 py-2 text-slate-300">
        <span dir="ltr" className="font-mono">{n} = {d} × …</span>
        <span>…</span>
      </div>
    );
  }
  if (!divides) {
    return (
      <div className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border-2 px-3 py-2 ${active ? 'border-slate-400 bg-slate-50' : 'border-slate-200 bg-white'}`}>
        <span dir="ltr" className="font-mono text-slate-500">{n} ÷ {d} → {t('manipulation.remainderNotZero')}</span>
        <span className="text-sm text-slate-500">{t('manipulation.notADivisor', { d })}</span>
      </div>
    );
  }
  return (
    <div className="grid items-center gap-3 grid-cols-[1fr_auto]">
      <EquationDisplay tex={`${n} = ${d} \\times ${e}`} tone={active ? 'active' : 'ok'} size="sm" />
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <HighlightedNumber value={d} tone="common" size="sm" />
        <span>{t('manipulation.and')}</span>
        <HighlightedNumber value={e} tone="common" size="sm" />
      </div>
    </div>
  );
}
