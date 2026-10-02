import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) du نشاط 4 : le stade de la ville vu de la
 * tribune, le tourniquet de l'entrée et, sur le côté, un escalier de gradins — les « marches » que le
 * laboratoire slope-stairs fait construire. DÉCORATIVE (`aria-hidden`), dessinée en SVG, sans aucun nombre :
 * les montants sont dans la carte et dans le laboratoire.
 */
export default function StadiumVignette({ className = '' }) {
  return (
    <svg viewBox="0 0 200 110" className={`h-24 w-auto ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="110" rx="12" fill="#DBEAFE" />
      {/* projecteurs */}
      <path d="M18 8 L18 40 M182 8 L182 40" stroke="#475569" strokeWidth="2.5" />
      <rect x="10" y="4" width="16" height="7" rx="2" fill="#FDE68A" stroke="#475569" />
      <rect x="174" y="4" width="16" height="7" rx="2" fill="#FDE68A" stroke="#475569" />
      {/* tribune et supporters */}
      <rect x="0" y="34" width="200" height="22" fill="#94A3B8" />
      {Array.from({ length: 24 }, (_, i) => (
        <g key={i} transform={`translate(${6 + i * 8} ${i % 2 ? 40 : 46})`}>
          <circle r="2.6" fill="#F3C9A0" />
          <rect x="-2.8" y="2.4" width="5.6" height="5" rx="1.5" fill={i % 3 === 0 ? '#16A34A' : i % 3 === 1 ? '#F8FAFC' : '#DC2626'} />
        </g>
      ))}
      {/* pelouse */}
      <rect x="0" y="56" width="200" height="54" fill="#2F9E4F" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 30} y="56" width="15" height="54" fill="#36AC59" />)}
      <path d="M100 56 L100 110 M70 83 a30 12 0 1 0 60 0 a30 12 0 1 0 -60 0" stroke="#F8FAFC" strokeWidth="1.4" fill="none" opacity="0.85" />
      {/* l'escalier des gradins (les marches du laboratoire) */}
      <path d="M134 104 H150 V94 H166 V84 H182 V74 H196 V104 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
      <path d="M134 104 L196 74" stroke="#0F172A" strokeWidth="1.6" strokeDasharray="3 2" />
      {/* le tourniquet de l'entrée et la carte d'abonnement */}
      <rect x="22" y="78" width="4" height="26" fill="#334155" />
      <path d="M24 86 L38 82 M24 86 L36 94 M24 86 L12 82" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="44" y="84" width="22" height="15" rx="2.5" fill="#065F46" stroke="#F59E0B" strokeWidth="1.2" />
      <circle cx="50" cy="93" r="1.8" fill="#A7F3D0" /><circle cx="55" cy="93" r="1.8" fill="#A7F3D0" /><circle cx="60" cy="93" r="1.8" fill="#047857" />
    </svg>
  );
}
