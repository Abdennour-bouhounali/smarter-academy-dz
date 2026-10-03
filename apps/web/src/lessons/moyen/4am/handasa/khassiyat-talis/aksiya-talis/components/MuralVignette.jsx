import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : le mur du quartier que les graffeurs peignent, une
 * échelle double aux montants inégaux et une planche posée entre eux, avec son niveau à bulle — le même monde que
 * le laboratoire `parallel-level` (thème `mural`). Décor DESSINÉ, `aria-hidden`, sans texte et sans réponse.
 */
export default function MuralVignette() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="100" fill="#FFF7ED" />
      {[18, 36, 54, 72, 90].map((y) => <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="#FED7AA" />)}
      <path d="M118 30 q 18 -16 36 0 t 34 8" fill="none" stroke="#EC4899" strokeWidth="9" strokeLinecap="round" opacity="0.45" />
      <circle cx="26" cy="26" r="14" fill="#06B6D4" opacity="0.3" />
      <path d="M14 70 l 12 -18 l 12 16" fill="none" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      <rect x="0" y="100" width="200" height="20" fill="#E7E5E4" />
      <line x1="0" x2="200" y1="100" y2="100" stroke="#57534E" strokeWidth="2" />
      {/* l'échelle double : A en haut, B et C au sol */}
      <line x1="84" y1="14" x2="64" y2="100" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
      <line x1="84" y1="14" x2="150" y2="100" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={t}>
          <line x1={84 - 20 * t - 4} y1={14 + 86 * t} x2={84 - 20 * t + 4} y2={14 + 86 * t} stroke="#475569" strokeWidth="2" />
          <line x1={84 + 66 * t - 3} y1={14 + 86 * t - 2} x2={84 + 66 * t + 3} y2={14 + 86 * t + 2} stroke="#475569" strokeWidth="2" />
        </g>
      ))}
      {/* la planche et son niveau */}
      <line x1="72" y1="64" x2="124" y2="64" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
      <rect x="88" y="52" width="24" height="8" rx="3" fill="#1E293B" />
      <rect x="90" y="54" width="20" height="4" rx="2" fill="#BBF7D0" />
      <ellipse cx="100" cy="56" rx="3" ry="1.6" fill="#FFFFFF" />
      {/* la bombe de peinture */}
      <rect x="168" y="82" width="9" height="17" rx="2" fill="#7C3AED" />
      <rect x="170" y="78" width="5" height="4" fill="#334155" />
    </svg>
  );
}
