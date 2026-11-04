import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LessonProblemCard from '../problems/LessonProblemCard';
import { StudentFocusProvider } from '../components/StudentFocus';
import { useMission } from './useMission';
import { pendingCheckpoint, shouldWelcome, stationLabel } from './missionModel';
import MissionBar from './MissionBar';
import MissionMap from './MissionMap';
import MissionDialog from './MissionDialog';
import MissionCheckpoint from './MissionCheckpoint';

const WELCOME_MS = 2000;

/**
 * La mission DANS un module (ModuleLayout la pose sous le fil d'Ariane) : la barre, la carte et l'énoncé à la
 * demande, et — en arrivant — le point d'étape du module précédent s'il attend. Rien hors du regard élève.
 */
export default function MissionLayer({ config, moduleNumber, basePath }) {
  const { t } = useTranslation('lesson');
  const { on, mission, state, update, tools, stations, completedModules, stars } = useMission(config);
  const [open, setOpen] = useState(null); // 'map' | 'text' | null
  // Le point d'étape est décidé à l'ARRIVÉE : terminer ce module-ci n'en fait pas surgir un autre sous les yeux.
  const [checkpoint] = useState(() => (on ? pendingCheckpoint(mission, completedModules, state.answered, moduleNumber) : null));
  const [checkpointOpen, setCheckpointOpen] = useState(Boolean(checkpoint));
  // L'ACCUEIL de la station (première arrivée, sans point d'étape) : la carte « أنت هنا », 2 s, un geste la ferme.
  const [welcome, setWelcome] = useState(() => on && shouldWelcome(state.seen, moduleNumber, checkpoint));
  useEffect(() => {
    if (!welcome) return undefined;
    update({ seen: { [String(moduleNumber)]: true } });
    const timer = setTimeout(() => setWelcome(false), WELCOME_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welcome]);
  if (!on) return null;
  const here = stations.find((s) => s.number === Number(moduleNumber));
  const fill = tools.length ? tools.filter((x) => x.earned).length / tools.length : 0;
  return (
    <>
      <MissionBar mission={mission} tools={tools} stations={stations} stars={stars} onOpenMap={() => setOpen('map')} onOpenMission={() => setOpen('text')} />
      {open === 'map' && (
        <MissionDialog label={t('mission.mapTitle')} onClose={() => setOpen(null)}>
          <h2 className="mb-5 text-xl font-black text-slate-900">{t('mission.mapTitle')}</h2>
          <MissionMap stations={stations} basePath={basePath} here={moduleNumber} onNavigate={() => setOpen(null)} />
        </MissionDialog>
      )}
      {open === 'text' && (
        <MissionDialog label={t('mission.readMission')} onClose={() => setOpen(null)}>
          {/* L'élève a DEMANDÉ l'énoncé : il le lit en entier ici, sans second pli. */}
          <StudentFocusProvider>
            <div className="pt-8"><LessonProblemCard problem={config.lessonProblem} /></div>
          </StudentFocusProvider>
        </MissionDialog>
      )}
      {welcome && here && (
        <MissionDialog label={t('mission.mapTitle')} onClose={() => setWelcome(false)}>
          <button type="button" className="block w-full text-start" onClick={() => setWelcome(false)} data-mission-welcome={moduleNumber}>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-500">{t('mission.here')}</p>
            <p className="mb-5 mt-1 text-2xl font-black text-slate-900">{stationLabel(here.title)}</p>
            <MissionMap stations={stations} basePath={basePath} here={moduleNumber} />
          </button>
        </MissionDialog>
      )}
      {checkpoint && checkpointOpen && (
        <MissionDialog label={t('mission.checkpointTag')} closable={false}>
          <MissionCheckpoint checkpoint={checkpoint} fill={fill} onDone={(answer) => {
            // la station est accueillie par son point d'étape : pas de carte « أنت هنا » en plus au retour
            update({ answered: { [checkpoint.id]: answer }, seen: { [String(moduleNumber)]: true } });
            setCheckpointOpen(false);
          }} />
        </MissionDialog>
      )}
    </>
  );
}
