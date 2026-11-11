import React from 'react';

/**
 * SCÈNE EN ATTENTE (unité 4, « commit 0 » du 2026-11-11) : un emplacement réservé, remplacé par le constructeur de la leçon
 * (`mission.scene = 'phone-credit'`). Aucun nombre dessiné ; le texte arabe reste dans le DOM.
 */
export default function PhoneCreditScene({ fill = 0, label, className = '', scene = 'phone-credit' }) {
  return (
    <svg viewBox="0 0 480 260" className={className} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-scene={scene} data-fill={fill}>
      <rect x="0" y="214" width="480" height="46" fill="#e2e8f0" />
    </svg>
  );
}
