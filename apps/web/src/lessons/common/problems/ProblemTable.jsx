import React from 'react';
import MathText from '../components/MathText';

/**
 * Le tableau de données d'une مسألة (`problem.table`, 2026-10-06) — repris du DataTable de l'unité 8
 * (qiraat-wadiyat-ihsaiya) : en-têtes arabes, première colonne d'en-têtes de ligne, nombres dans des
 * îlots LTR (« -7 », « 12,5 » ne s'inversent pas), formules en `$…$`. Défile horizontalement DANS son
 * cadre quand il est plus large que l'écran — la page, elle, ne défile jamais de côté.
 *
 *   table: { head: ['العلامة', '8', '10', '12'], rows: [['التكرار', '3', '7', '5']], caption?: '…' }
 */
const isNum = (s) => /^-?\d+([,.]\d+)?$/.test(String(s));

export default function ProblemTable({ head, rows, caption }) {
  return (
    <figure className="space-y-1" data-problem-table>
      {/* La légende HORS du cadre qui défile : sur un téléphone, une <caption> centrée sur la largeur
          du tableau était coupée au bord de l'écran (vu au déploiement, 2026-10-06). */}
      {caption && <figcaption className="text-xs font-bold text-slate-600"><MathText>{caption}</MathText></figcaption>}
      <div className="max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-center text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50">
            {head.map((h, i) => (
              <th key={i} scope="col" className="whitespace-nowrap border border-slate-200 px-1.5 py-1 font-bold text-slate-700">
                {isNum(h) ? <bdi dir="ltr">{h}</bdi> : <MathText>{String(h)}</MathText>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, i) => (i === 0
                ? <th key={i} scope="row" className="whitespace-nowrap border border-slate-200 px-1.5 py-1 font-bold text-slate-700"><MathText>{String(c)}</MathText></th>
                : <td key={i} className="border border-slate-200 px-1.5 py-1 font-mono">{isNum(c) ? <bdi dir="ltr">{c}</bdi> : <MathText>{String(c)}</MathText>}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}
