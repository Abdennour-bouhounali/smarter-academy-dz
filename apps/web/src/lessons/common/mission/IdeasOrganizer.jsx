import React from 'react';
import { TapQuestion } from '../kit/questions';
import MathText from '../components/MathText';

/**
 * « رتّب أفكارك » — l'étape APRÈS le labo (propriétaire, 2026-11-04 : l'élève a déjà répondu dans le labo ; l'étape l'aide à
 * STRUCTURER ce qu'il a vu pour en tirer le concept). Ses PROPRES essais en tableau — chaque nombre avec son sens (les mots
 * de la scène) ; les essais sans reste en vert —, puis UNE question qui fait formuler l'idée à partir du tableau.
 *
 * rows : [{ n, g, q, r }] (a = b × q + r) · labels : { n, g, q, r } · question : { prompt, options, correct, explain }
 */
export default function IdeasOrganizer({ title, rows, labels, question, onAnswered }) {
  const cols = [['n', labels.n], ['g', labels.g], ['q', labels.q], ['r', labels.r]];
  const tone = { n: 'text-slate-900', g: 'text-indigo-700', q: 'text-violet-700', r: 'text-rose-600' };
  return (
    <div className="space-y-4" data-ideas-organizer>
      <div className="space-y-2">
        <p className="text-lg font-black text-indigo-950">🧩 {title}</p>
        <table className="w-full overflow-hidden rounded-2xl border-2 border-indigo-100 text-center" data-ideas-table>
          <thead className="bg-indigo-50 text-sm font-black">
            <tr>{cols.map(([key, label]) => <th key={key} className={`px-3 py-2 ${tone[key]}`}>{label}</th>)}<th className="px-3 py-2 text-slate-500">=</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const exact = Number(row.r) === 0;
              return (
                <tr key={`${row.n}:${row.g}`} className={`border-t border-indigo-50 text-2xl font-black ${exact ? 'bg-emerald-50' : 'bg-white'}`} data-ideas-row={`${row.n}:${row.g}`} data-exact={exact ? 'true' : 'false'}>
                  {cols.map(([key]) => <td key={key} className={`px-3 py-2 ${key === 'r' && exact ? 'text-emerald-600' : tone[key]}`}>{row[key]}</td>)}
                  <td className="px-3 py-2 text-base"><MathText>{`$${row.n} = ${row.g} \\times ${row.q} + ${row.r}$`}</MathText></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TapQuestion prompt={<span className="text-xl font-bold">{question.prompt}</span>} options={question.options} correct={question.correct}
        cols={1} explain={question.explain} onAnswered={onAnswered} />
    </div>
  );
}
