import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MathLabel from '../components/MathLabel';
import { mathToPlain } from '../../../utils/mathPlain';
import { useMission } from './useMission';
import { stationLabel } from './missionModel';
import MissionScene from './MissionScene';
import MissionMap from './MissionMap';
import MissionDialog from './MissionDialog';
import ReviseFirst from './ReviseFirst';
import PrerequisiteLessonChips from '../components/PrerequisiteLessonChips';
import { isPracticeActive } from '../../../features/practice/practiceCapability';
import PracticeEntryCard from '../../../features/practice/PracticeEntryCard';

/**
 * L'ACCUEIL de la leçon en mode mission (LessonIndex le rend pour l'élève). La première fois : la scène d'ouverture —
 * la bibliothèque, UNE phrase, et l'aveu honnête « لا أعرف بعد » (on ne sait pas encore la résoudre). Ensuite : la
 * bibliothèque qui se remplit avec les outils, la carte, et UN bouton « واصل ». L'élève n'a JAMAIS accès à l'ancienne page du
 * درس (propriétaire, 2026-11-04) : ses détails s'ouvrent ici (« تفاصيل الدرس »), ses تمارين sont ici aussi.
 */
export default function MissionHome({ config, basePath }) {
  const { t } = useTranslation('lesson');
  const navigate = useNavigate();
  const { mission, state, update, tools, stations, resume, stars } = useMission(config);
  const [replay, setReplay] = useState(false);
  const [details, setDetails] = useState(false);
  const earned = tools.filter((x) => x.earned).length;
  const fill = tools.length ? earned / tools.length : 0;
  const target = resume ?? stations[0];
  const go = () => target && navigate(`${basePath}/${target.slug}`);

  if (!state.opened || replay) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 text-center" data-mission-opening>
        <MissionScene scene={mission.scene} fill={0} className="w-full max-w-xl drop-shadow-sm" label={mathToPlain(mission.opening.text)} />
        <p className="text-2xl font-extrabold leading-relaxed text-slate-900"><MathLabel>{mission.opening.text}</MathLabel></p>
        <button type="button" data-mission-start
          onClick={() => { update({ opened: true }); setReplay(false); go(); }}
          className="min-h-[56px] rounded-2xl bg-indigo-600 px-8 text-lg font-black text-white shadow-[0_4px_0_0_#3730A3] hover:bg-indigo-700 active:translate-y-0.5">
          {mission.opening.cta} <span aria-hidden="true">←</span>
        </button>
        {/* La PREMIÈRE vue dit aussi quoi réviser avant de partir (propriétaire, 2026-11-07) */}
        <ReviseFirst lessonId={config.id} title={config.title} basePath={basePath} className="w-full" />
      </section>
    );
  }

  return (
    <section className="space-y-6" data-mission-home>
      <div className="flex flex-wrap items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <MissionScene scene={mission.scene} fill={fill} className="w-64 shrink-0" label={mission.title} />
        <div className="min-w-0 flex-1 space-y-3">
          <p className="flex items-center gap-3 text-xs font-black uppercase tracking-wide text-indigo-500">📚 {t('mission.tag')}
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm text-amber-800" data-mission-stars={stars}>⭐ <span dir="ltr">{stars}</span></span>
          </p>
          <h1 className="font-space text-3xl font-extrabold text-slate-900">{mission.title}</h1>
          <div className="flex flex-wrap items-center gap-2" data-mission-tools>
            <span className="text-sm font-bold text-slate-500">{t('mission.tools')}:</span>
            {tools.map((tool) => (
              <span key={tool.id} data-mission-tool={tool.id} data-earned={tool.earned ? 'true' : 'false'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${tool.earned ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-400'}`}>
                <span aria-hidden="true">{tool.earned ? tool.icon : '🔒'}</span>{tool.label}
              </span>
            ))}
          </div>
          {resume ? (
            <button type="button" onClick={go} data-mission-continue
              className="min-h-[52px] rounded-2xl bg-indigo-600 px-6 text-lg font-black text-white shadow-[0_4px_0_0_#3730A3] hover:bg-indigo-700">
              {t(stations.some((s) => s.status === 'mastered') ? 'mission.continue' : 'mission.start', { title: mathToPlain(stationLabel(resume.title)) })} <span aria-hidden="true">←</span>
            </button>
          ) : (
            <p className="text-lg font-black text-emerald-700">🏆 {t('mission.allDone')}</p>
          )}
        </div>
      </div>
      <ReviseFirst lessonId={config.id} title={config.title} basePath={basePath} />
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-black text-slate-900">{t('mission.mapTitle')}</h2>
        <MissionMap lessonId={config.id} stations={stations} basePath={basePath} here={resume?.number} />
      </div>
      {/* Les تمارين de la leçon : dans la mission, l'élève n'ayant plus accès à l'ancienne page du درس. */}
      {isPracticeActive(config.id) && <PracticeEntryCard lessonId={config.id} />}
      <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
        <button type="button" onClick={() => setReplay(true)} className="min-h-[44px] rounded-lg px-2 text-indigo-600 hover:bg-indigo-50" data-mission-replay>
          {t('mission.replay')}
        </button>
        <button type="button" onClick={() => setDetails(true)} className="min-h-[44px] rounded-lg px-2 text-indigo-600 hover:bg-indigo-50" data-mission-details>
          {t('mission.details')}
        </button>
      </div>
      {details && (
        // Ce que l'ancienne page du درس montrait (fold, never delete) : la description, les كفاءات, les prérequis.
        <MissionDialog label={t('mission.details')} onClose={() => setDetails(false)}>
          <div className="space-y-4 pt-6" data-mission-details-dialog>
            <h2 className="text-xl font-black text-slate-900"><MathLabel>{config.title}</MathLabel></h2>
            {config.description && <p className="leading-relaxed text-slate-700"><MathLabel>{config.description}</MathLabel></p>}
            {config.skills?.length > 0 && (
              <ul className="space-y-1.5">
                {config.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-slate-700"><span className="mt-0.5 text-indigo-400" aria-hidden="true">▸</span><MathLabel>{skill}</MathLabel></li>
                ))}
              </ul>
            )}
            <ul className="flex flex-wrap gap-1.5"><PrerequisiteLessonChips lessonId={config.id} /></ul>
          </div>
        </MissionDialog>
      )}
    </section>
  );
}
