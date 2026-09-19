import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical } from 'lucide-react';
import NumberInput from './primitives/NumberInput';
import { levelMatching } from './levels';

const toNumber = (s) => Number(String(s).replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 0x0660)));

/**
 * Les PALIERS (§18) et le « مختبر حر » (§17).
 *
 * Les paliers : quatre puces, celle des nombres courants marquée ; un palier
 * ajouté par la plateforme porte « مثال تفاعلي إضافي ». Le laboratoire libre
 * ne s'ouvre qu'après la découverte (l'élève a d'abord vu l'idée sur les
 * nombres du manuel) ; les nombres saisis passent par les bornes du registre
 * (`changeNumbers`) ET par `validate` (contrainte croisée du type), donc
 * aucun cas pathologique n'est généré.
 */
export default function ManipulationLevels({ state, numberFields = [], constraints, validate, allowFreeLab = true }) {
  const { t } = useTranslation('lesson');
  const [draft, setDraft] = useState(() => Object.fromEntries(numberFields.map((f) => [f.key, String(state.numbers?.[f.key] ?? '')])));
  const [error, setError] = useState('');
  const current = levelMatching(state.type, state.numbers);
  const canFree = allowFreeLab && constraints && numberFields.length > 0 && (state.isDiscovered || state.isClass);

  const apply = () => {
    const next = {};
    for (const f of numberFields) {
      const v = toNumber(draft[f.key]);
      const [min, max] = constraints?.[f.key] ?? [f.min ?? 0, f.max ?? Number.MAX_SAFE_INTEGER];
      if (!Number.isInteger(v) || v < min || v > max) { setError(t('manipulation.invalidNumber', { label: f.label, min, max })); return; }
      next[f.key] = v;
    }
    const problem = validate?.(next);
    if (problem) { setError(problem); return; }
    setError('');
    state.setNumbers({ ...state.numbers, ...next });
  };

  if (!state.levels.length && !canFree) return null;
  return (
    <div className="space-y-2" data-manipulation-levels>
      {state.levels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500">{t('manipulation.levels.title')}</span>
          {state.levels.map((lvl) => {
            const active = current?.id === lvl.id && !state.freeLab;
            return (
              <button key={lvl.id} type="button" onClick={() => state.setLevel(lvl)} aria-pressed={active}
                title={lvl.source === 'platform' ? t('textbook.platformAddition') : undefined}
                className={`min-h-[36px] rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400'}`}>
                <span dir="ltr" className="font-mono">{lvl.id}</span> · {t(`manipulation.levels.${lvl.key}`)}
                {lvl.source === 'platform' && <span className="ms-1 text-[10px] font-normal opacity-80">({t('textbook.platformAddition')})</span>}
              </button>
            );
          })}
        </div>
      )}
      {canFree && (
        <div>
          <button type="button" onClick={() => state.setFreeLab(!state.freeLab)} aria-pressed={state.freeLab}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${state.freeLab ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> {t('manipulation.freeLab.title')}
          </button>
          {state.freeLab && (
            <div className="mt-2 flex flex-wrap items-end gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3">
              <p className="w-full text-xs text-slate-600">{t('manipulation.freeLab.lead')}</p>
              {numberFields.map((f) => (
                <NumberInput key={f.key} id={`manip-free-${state.type}-${f.key}`} label={f.label} value={draft[f.key]} min={constraints?.[f.key]?.[0]} max={constraints?.[f.key]?.[1]} invalid={!!error} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
              ))}
              <button type="button" onClick={apply} className="min-h-[40px] rounded-xl border-2 border-blue-600 bg-blue-600 px-4 py-2 text-sm font-bold text-white">{t('manipulation.apply')}</button>
              {error && <p role="alert" className="w-full text-sm text-rose-700">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
