import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Map as MapIcon } from 'lucide-react';

/**
 * La BARRE DE MISSION, en tête de chaque module : la mission (un geste ouvre son énoncé), les outils — gagnés ou
 * encore fermés —, l'avancement, et la carte. Une seule ligne : elle rappelle le but sans le relire.
 */
export default function MissionBar({ mission, tools, stations, stars = 0, onOpenMap, onOpenMission }) {
  const { t } = useTranslation('lesson');
  const reduced = useReducedMotion();
  // UN OUTIL GAGNÉ SOUS LES YEUX de l'élève vole jusqu'à sa place (les outils déjà là au montage ne volent pas).
  const known = useRef(null);
  const [flight, setFlight] = useState(null); // { id, icon, from, to }
  const [glow, setGlow] = useState(null);
  useEffect(() => {
    const earned = tools.filter((x) => x.earned).map((x) => x.id);
    if (known.current === null) { known.current = new Set(earned); return; }
    const fresh = tools.find((x) => x.earned && !known.current.has(x.id));
    earned.forEach((id) => known.current.add(id));
    if (!fresh) return;
    setGlow(fresh.id);
    const slot = document.querySelector(`[data-mission-bar] [data-mission-tool="${fresh.id}"]`)?.getBoundingClientRect();
    if (!reduced && slot) {
      setFlight({ id: fresh.id, icon: fresh.icon, from: { x: window.innerWidth / 2 - 24, y: window.innerHeight / 2 - 24 }, to: { x: slot.left + slot.width / 2 - 24, y: slot.top + slot.height / 2 - 24 } });
    }
  }, [tools, reduced]);
  const done = stations.filter((s) => s.status === 'mastered').length;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-l from-indigo-950 to-violet-900 px-4 py-2.5 text-white shadow-sm" data-mission-bar>
      <button type="button" onClick={onOpenMission}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 font-extrabold hover:bg-white/10" data-mission-open-text>
        <span aria-hidden="true">📚</span>
        <span className="text-xs font-bold text-indigo-200">{t('mission.tag')}</span>
        <span>{mission.title}</span>
      </button>
      <div className="flex items-center gap-1.5" role="list" aria-label={t('mission.tools')} data-mission-tools>
        {tools.map((tool) => (
          <span key={tool.id} role="listitem" data-mission-tool={tool.id} data-earned={tool.earned ? 'true' : 'false'}
            title={`${tool.label} — ${t(tool.earned ? 'mission.toolEarned' : 'mission.toolLocked')}`}
            aria-label={`${tool.label} — ${t(tool.earned ? 'mission.toolEarned' : 'mission.toolLocked')}`}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg ring-2 transition-colors motion-reduce:transition-none ${tool.earned ? 'bg-amber-300 ring-amber-200' : 'bg-white/10 ring-white/20 grayscale opacity-60'} ${glow === tool.id ? 'sa-mission-earned' : ''}`}>
            {tool.icon}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {/* les étoiles gagnées dans les manches des labos (LabRounds) */}
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/20 px-3 py-1 text-sm font-black text-amber-200" data-mission-stars={stars} aria-label={t('mission.stars', { count: stars })}>
          <span aria-hidden="true">⭐</span><span dir="ltr">{stars}</span>
        </span>
        <span className="text-sm font-bold text-indigo-200" dir="rtl">{t('mission.progress', { done, total: stations.length })}</span>
        <button type="button" onClick={onOpenMap} data-mission-open-map
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-3 text-sm font-black text-indigo-950 hover:bg-indigo-50">
          <MapIcon className="h-4 w-4" aria-hidden="true" /> {t('mission.map')}
        </button>
      </div>
      {flight && createPortal(
        <motion.span aria-hidden="true" data-mission-flight={flight.id}
          className="pointer-events-none fixed left-0 top-0 z-[320] flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-2xl shadow-xl ring-4 ring-amber-200"
          initial={{ x: flight.from.x, y: flight.from.y, scale: 2.2, opacity: 0 }}
          animate={{ x: [flight.from.x, flight.from.x, flight.to.x], y: [flight.from.y, flight.from.y - 30, flight.to.y], scale: [2.2, 2.4, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 1.1, times: [0, 0.35, 1], ease: 'easeInOut' }}
          onAnimationComplete={() => setFlight(null)}>
          {flight.icon}
        </motion.span>,
        document.body,
      )}
    </div>
  );
}
