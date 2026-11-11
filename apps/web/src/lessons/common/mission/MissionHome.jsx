import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MathLabel from '../components/MathLabel';
import { mathToPlain } from '../../../utils/mathPlain';
import { useMission } from './useMission';
import { useFitRefit } from './missionPlayerContext';
import { stationLabel, toolLit, toolProgress, sceneFill, trainingsDone, showStars, openingMinutes } from './missionModel';
import MissionScene from './MissionScene';
import MissionMap from './MissionMap';
import MissionDialog from './MissionDialog';
import ReviseFirst from './ReviseFirst';
import PrerequisiteLessonChips from '../components/PrerequisiteLessonChips';
import { isPracticeActive, practiceHubPath } from '../../../features/practice/practiceCapability';

/**
 * L'ACCUEIL de la leçon en mode mission (LessonIndex le rend pour l'élève). La première fois : la scène d'ouverture —
 * la bibliothèque, UNE phrase, et l'aveu honnête « لا أعرف بعد » (on ne sait pas encore la résoudre). Ensuite : la
 * bibliothèque qui se remplit avec les outils, la carte, et UN bouton « واصل ». L'élève n'a JAMAIS accès à l'ancienne page du
 * درس (propriétaire, 2026-11-04) : ses détails s'ouvrent ici (« تفاصيل الدرس »), ses تمارين sont ici aussi.
 */
export default function MissionHome({ config, basePath }) {
  const { t } = useTranslation('lesson');
  const navigate = useNavigate();
  const { mission, state, update, tools, stations, resume, stars, completedModules } = useMission(config);
  const [replay, setReplay] = useState(false);
  const [details, setDetails] = useState(false);
  // « شاهد البداية » : l'accroche est plus HAUTE que l'accueil compact dont elle prend la place ; sans ré-ajustement elle héritait de sa taille
  // posée et rétrécissait (957 px au lieu de la largeur des pages de la leçon — propriétaire, 2026-11-11). L'écran se re-pose à sa juste taille.
  const refit = useFitRefit();
  useEffect(() => { if (replay) refit?.(); }, [replay]); // eslint-disable-line react-hooks/exhaustive-deps
  // SYNTHÈSE (`mission.toolsOwned`) : les clés de l'unité sont possédées d'emblée — la scène est pleine, l'anneau compte les clés UTILISÉES
  const owned = mission.toolsOwned === true;
  const { lit } = toolProgress(tools);
  const fill = sceneFill(mission, tools);
  const trainings = trainingsDone(mission, completedModules);
  const target = resume ?? stations[0];
  const go = () => target && navigate(`${basePath}/${target.slug}`);

  // ── LA PREMIÈRE VUE : l'accroche (propriétaire, 2026-11-09 : plus claire, plus attirante, plus motivante) ──
  if (!state.opened || replay) {
    const minutes = openingMinutes(config);
    return (
      <section className="space-y-4" data-mission-opening>
        <div className="grid items-center gap-6 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/60 to-amber-50/70 p-6 shadow-sm md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="min-w-0 space-y-4 text-start">
            <p className="text-sm font-black uppercase tracking-wide text-indigo-500">🎯 {t('mission.tag')}</p>
            <h1 className="font-space text-3xl font-extrabold text-slate-900">{mission.title}</h1>
            {/* la QUESTION est une bulle de la scène : le personnage la pose, l'élève la lit comme un défi */}
            <div className="relative rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-sm" data-mission-bubble>
              <p className="text-xl font-extrabold leading-relaxed text-slate-900"><Highlighted text={mission.opening.text} /></p>
              <span aria-hidden="true" className="absolute -left-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-amber-200 bg-white lg:block" />
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-bold" data-mission-facts>
              {minutes && <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">⏱ {t('mission.duration', { count: minutes })}</span>}
              {Number(mission.sittings) === 2 && <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200" data-mission-sittings>{t('mission.twoSittings')}</span>}
              <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">🧰 {t('mission.toolsCount', { count: tools.length })}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">🏆 {t('mission.climax')}</span>
            </div>
            {/* le bouton au MÊME endroit et de la MÊME taille que « ابدأ : … » de l'accueil (propriétaire, 2026-11-11) : dans la colonne du texte, pleine largeur */}
            <button type="button" data-mission-start
              onClick={() => { update({ opened: true }); setReplay(false); go(); }}
              className="min-h-[64px] w-full rounded-2xl bg-indigo-600 px-6 text-xl font-black text-white shadow-[0_5px_0_0_#3730A3] hover:bg-indigo-700 active:translate-y-0.5">
              {mission.opening.cta} <span aria-hidden="true">←</span>
            </button>
          </div>
          <MissionScene scene={mission.scene} fill={owned ? 1 : 0} className="w-full drop-shadow-sm" label={mathToPlain(mission.opening.text)} />
        </div>
        {/* ce que le voyage apporte : les outils à gagner, puis la mission */}
        <div className="flex flex-wrap items-center justify-center gap-2" data-mission-preview>
          <span className="text-sm font-bold text-slate-500">{t(owned ? 'mission.youHave' : 'mission.willCollect')}</span>
          {tools.map((tool) => (
            <span key={tool.id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-600">
              <span aria-hidden="true">{tool.icon}</span>{tool.label}
            </span>
          ))}
          <span aria-hidden="true" className="font-black text-slate-400">←</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">🏆 {t('mission.climax')}</span>
        </div>
        {/* La PREMIÈRE vue dit aussi quoi réviser avant de partir (propriétaire, 2026-11-07) — en UNE ligne (2026-11-09) */}
        <ReviseFirst lessonId={config.id} title={config.title} basePath={basePath} variant="slim" />
      </section>
    );
  }

  // ── LE RETOUR (propriétaire, 2026-11-09, v2) : un accueil COURT pour que le lecteur (FitToArea) l'AGRANDISSE au lieu de le réduire —
  // l'élève ne doit jamais zoomer. Une seule grande carte (la scène, le titre, les outils, UN « واصل » + l'accès aux تمارين), le parcours,
  // et « راجع » en une ligne. (La carte « التالي » séparée a été retirée : le bouton dit déjà où l'on va.)
  const doneCount = stations.filter((x) => x.status === 'mastered').length;
  const started = stations.some((x) => x.status === 'mastered');
  const practiceOn = isPracticeActive(config.id);
  return (
    <section className="space-y-4" data-mission-home>
      <div className="grid items-center gap-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]" data-mission-hero>
        {/* le texte et « واصل » à DROITE, la scène à gauche (propriétaire, 2026-11-09 : le bouton au même endroit que celui de la page de l'unité) */}
        <div className="min-w-0 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-3 text-sm font-black uppercase tracking-wide text-indigo-500">📚 {t('mission.tag')}
                {showStars(mission, stars) && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-base text-amber-800" data-mission-stars={stars}>⭐ <span dir="ltr">{stars}</span></span>}
                {trainings && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-base normal-case tracking-normal text-emerald-800" data-mission-trainings={`${trainings.done}/${trainings.total}`}>
                    {t('mission.trainings')} <span dir="ltr">{trainings.done}{'\u00A0/\u00A0'}{trainings.total}</span>
                  </span>
                )}
              </p>
              <h1 className="font-space text-4xl font-extrabold text-slate-900">{mission.title}</h1>
            </div>
            <ProgressRing value={lit} total={tools.length} label={t(owned ? 'mission.keys' : 'mission.tools')} />
          </div>
          <div className="flex flex-wrap items-center gap-2" data-mission-tools>
            {tools.map((tool) => (owned ? (
              // clé POSSÉDÉE : jamais 🔒 — utilisée = pleine + ✓ et le mot dit ; pas encore = simple anneau (l'état ne tient pas à la couleur)
              <span key={tool.id} data-mission-tool={tool.id} data-earned="true" data-used={tool.used ? 'true' : 'false'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-bold ${toolLit(tool) ? 'bg-amber-100 text-amber-900' : 'bg-white text-slate-700 ring-2 ring-inset ring-slate-300'}`}>
                <span aria-hidden="true">{tool.icon}</span>{tool.label}
                {tool.used && <span aria-hidden="true" className="font-black text-emerald-700">✓</span>}
                <span className="sr-only"> — {t(tool.used ? 'mission.toolUsed' : 'mission.toolOwned')}</span>
              </span>
            ) : (
              <span key={tool.id} data-mission-tool={tool.id} data-earned={tool.earned ? 'true' : 'false'}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-bold ${tool.earned ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-400'}`}>
                <span aria-hidden="true">{tool.earned ? tool.icon : '🔒'}</span>{tool.label}
              </span>
            )))}
          </div>
          {resume ? (
            <button type="button" onClick={go} data-mission-continue
              className="min-h-[64px] w-full rounded-2xl bg-indigo-600 px-6 text-xl font-black text-white shadow-[0_5px_0_0_#3730A3] hover:bg-indigo-700 active:translate-y-0.5">
              {t(started ? 'mission.continue' : 'mission.start', { title: mathToPlain(resume.label ?? stationLabel(resume.title)) })} <span aria-hidden="true">←</span>
            </button>
          ) : (
            <p className="text-2xl font-black text-emerald-700">🏆 {t('mission.allDone')}</p>
          )}
          {/* les تمارين de la leçon, toujours ouvertes (l'élève n'a plus l'ancienne page du درس) */}
          {practiceOn && (
            <button type="button" onClick={() => navigate(practiceHubPath(config.id))} data-mission-practice
              className="min-h-[52px] w-full rounded-2xl border-2 border-violet-200 bg-violet-50 px-6 text-lg font-black text-violet-800 hover:border-violet-400">
              📝 {t('mission.practiceStation')} <span aria-hidden="true">←</span>
            </button>
          )}
        </div>
        <MissionScene scene={mission.scene} fill={fill} className="w-full" label={mission.title} />
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" data-mission-path-card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-black text-slate-900">{t('mission.mapTitle')}</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-base font-black text-emerald-700" data-mission-done-count>✓ {t('mission.progress', { done: doneCount, total: stations.length })}</span>
        </div>
        <MissionMap lessonId={config.id} stations={stations} basePath={basePath} here={resume?.number} />
      </div>
      {/* « راجع » et les deux liens discrets sur UNE ligne : l'accueil reste court, le lecteur l'agrandit */}
      <div className="flex flex-wrap items-center gap-4 text-sm font-bold" data-mission-home-foot>
        <ReviseFirst lessonId={config.id} title={config.title} basePath={basePath} variant="slim" className="min-w-0 flex-1" />
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

/** Les nombres de la question SAUTENT aux yeux (pastilles ambre) ; un texte avec des formules garde MathLabel. */
function Highlighted({ text }) {
  const s = String(text ?? '');
  if (s.includes('$')) return <MathLabel>{s}</MathLabel>;
  return s.split(/(\d+(?:[.,]\d+)?)/).map((part, i) => (/^\d/.test(part)
    ? <span key={i} dir="ltr" className="mx-0.5 rounded-lg bg-amber-100 px-1.5 text-amber-900" data-mission-number>{part}</span>
    : <React.Fragment key={i}>{part}</React.Fragment>));
}

/** L'anneau des outils gagnés (`value` sur `total`). */
function ProgressRing({ value, total, label }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const f = total ? Math.min(1, value / total) : 0;
  return (
    <div className="relative h-16 w-16 shrink-0" data-mission-ring={`${value}/${total}`}>
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E0E7FF" strokeWidth="7" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - f)} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-base font-black text-slate-900" dir="ltr">{value}/{total}</span>
        <span className="mt-0.5 text-[10px] font-bold text-slate-500">{label}</span>
      </span>
    </div>
  );
}
