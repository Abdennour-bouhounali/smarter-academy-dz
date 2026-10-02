import React from 'react';
import MathText from '../../../../../../common/components/MathText';
import { bidi } from '../../../../../../../utils/bidi';
import { ACTIVITY } from '../content/textbook';

/**
 * Le TABLEAU du manuel (نشاط 3, p. 57) : « مراحل (خطوات) الحل · المهمات · حل ». La troisième colonne
 * n'est jamais pré-remplie : elle reçoit ce que l'élève a fait LUI-MÊME dans le laboratoire (niveau
 * متقدم) — ses inconnues, sa jumla vérifiée, sa ثنائية, son histoire rejouée, sa réponse
 * (`[data-activity-evidence]`, MANIPULATION_DNA §9 : les preuves de l'élève, pas une réponse donnée).
 *
 * Sur un téléphone, chaque ligne devient une carte (étape, mission, travail) : pas de tableau à
 * trois colonnes à 320 px.
 *
 *   evidence = { unknowns?: [{ letter, noun }], equations?: [tex, tex], system?: tex, pair?: tex,
 *                checked?: [tex, tex], answer?: string }
 */
export default function StepsTable({ evidence, emptyText }) {
  const e = evidence ?? {};
  const cells = [
    e.unknowns ? e.unknowns.map((u) => `$${u.letter}$ : ${u.noun}`).join(' ، ') : null,
    e.equations ? `$${e.equations[0]}$` : null,
    e.equations ? `$${e.equations[1]}$` : null,
    e.system ? `$${e.system}$` : null,
    e.pair ? `$${e.pair}$` : null,
    e.checked ? e.checked.map((tx) => `$${tx}$`).join(' ؛ ') : null,
    e.answer ?? null,
  ];
  const [c0, c1, c2] = ACTIVITY.tableColumns;
  return (
    <div className="space-y-1.5" data-activity-evidence data-steps-table>
      <div className="hidden grid-cols-[10rem_1fr_1fr] gap-2 px-2 text-xs font-extrabold text-rose-900 sm:grid" aria-hidden="true">
        <span>{c0}</span><span>{c1}</span><span>{c2}</span>
      </div>
      <ol className="space-y-1.5">
        {ACTIVITY.table.map((row, i) => (
          <li key={row.task} className="grid gap-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm sm:grid-cols-[10rem_1fr_1fr] sm:gap-2"
            data-evidence={`row-${i + 1}`} data-tried={cells[i] ? 'true' : 'false'}>
            <span className="font-bold text-rose-900">{row.stage}</span>
            <span className="text-slate-700">{bidi(row.task)}</span>
            <span className={cells[i] ? 'font-bold text-slate-900' : 'text-xs text-slate-400'}>
              <span className="sm:hidden text-xs font-bold text-rose-900">{c2} : </span>
              {cells[i] ? <MathText>{cells[i]}</MathText> : emptyText}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
