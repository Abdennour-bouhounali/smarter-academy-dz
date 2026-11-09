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

  // ── LA PREMIÈRE VUE : l'accroche (propriétaire, 2026-11-09 : plus claire, plus attirante, plus motivante) ──
  if (!state.opened || replay) {
    const minutes = Number(config.estimatedDurationMin) || null;
    return (
      <section className="mx-auto flex max-w-5xl flex-col gap-5 py-1" data-mission-opening>
        <div className="grid items-center gap-6 rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/60 to-amber-50/70 p-6 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
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
              <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">🧰 {t('mission.toolsCount', { count: tools.length })}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">🏆 {t('mission.climax')}</span>
            </div>
          </div>
          <MissionScene scene={mission.scene} fill={0} className="w-full drop-shadow-sm" label={mathToPlain(mission.opening.text)} />
        </div>
        {/* ce que le voyage apporte : les outils à gagner, puis la mission */}
        <div className="flex flex-wrap items-center justify-center gap-2" data-mission-preview>
          <span className="text-sm font-bold text-slate-500">{t('mission.willCollect')}</span>
          {tools.map((tool) => (
            <span key={tool.id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-600">
              <span aria-hidden="true">{tool.icon}</span>{tool.label}
            </span>
          ))}
          <span aria-hidden="true" className="font-black text-slate-400">←</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">🏆 {t('mission.climax')}</span>
        </div>
        <div className="flex justify-center">
          <button type="button" data-mission-start
            onClick={() => { update({ opened: true }); setReplay(false); go(); }}
            className="min-h-[64px] rounded-2xl bg-indigo-600 px-10 text-xl font-black text-white shadow-[0_5px_0_0_#3730A3] hover:bg-indigo-700 active:translate-y-0.5">
            {mission.opening.cta} <span aria-hidden="true">←</span>
          </button>
        </div>
        {/* La PREMIÈRE vue dit aussi quoi réviser avant de partir (propriétaire, 2026-11-07) — en UNE ligne (2026-11-09) */}
        <ReviseFirst lessonId={config.id} title={config.title} basePath={basePath} variant="slim" />
      </section>
    );
  }

  // ── LE RETOUR : UNE prochaine étape claire, la progression d'un coup d'œil (propriétaire, 2026-11-09) ──
  const climaxNum = Number(mission.climaxModule);
  const climaxStation = stations.find((x) => x.kind === 'climax');
  const before = stations.filter((x) => x.number < climaxNum && x.status !== 'mastered').length;
  const climaxLine = climaxStation?.status === 'mastered' ? t('mission.climaxDone')
    : resume?.kind === 'climax' ? t('mission.climaxNow') : t('mission.climaxIn', { count: before });
  const resumeModule = resume ? config.modules.find((m) => Number(m.number) === resume.number) : null;
  // la phrase « ce que tu vas faire » : la `desc` du module — jamais une qui renvoie au manuel (« ملاحظة الكتاب », « تمارين الكتاب ») : indépendance du livre
  const resumeDesc = resumeModule?.desc && !/الكتاب|كتاب|ص\s*\d/.test(resumeModule.desc) ? resumeModule.desc : null;
  const resumeIndex = resume ? stations.findIndex((x) => x.number === resume.number) : -1;
  const doneCount = stations.filter((x) => x.status === 'mastered').length;
  const started = stations.some((x) => x.status === 'mastered');
  return (
    <section className="space-y-6" data-mission-home>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" data-mission-hero>
        {/* L'ÉTAPE SUIVANTE : la seule chose à faire maintenant, en grand */}
        <div className="flex flex-col justify-between gap-4 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white shadow-[0_12px_30px_-14px_rgba(67,56,202,0.7)]" data-mission-next-card>
          {resume ? (
            <>
              <div className="space-y-2">
                <p className="flex flex-wrap items-center gap-2 text-sm font-black text-indigo-100">
                  <span className="rounded-full bg-white/15 px-3 py-1">➜ {t('mission.nextTag')}</span>
                  <span>{t('mission.stationOf', { n: resumeIndex + 1, total: stations.length })}</span>
                </p>
                <h2 className="text-3xl font-black leading-snug"><MathLabel>{stationLabel(resume.title)}</MathLabel></h2>
                {resumeDesc && <p className="line-clamp-2 text-lg font-bold leading-relaxed text-indigo-100" data-mission-next-desc><MathLabel>{resumeDesc}</MathLabel></p>}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-black">
                {resumeModule?.estimatedMin && <span className="rounded-full bg-white/15 px-3 py-1">⏱ {t('mission.minutes', { count: resumeModule.estimatedMin })}</span>}
                <span className="rounded-full bg-amber-300 px-3 py-1 text-amber-950" data-mission-climax-in>{climaxLine}</span>
              </div>
              <button type="button" onClick={go} data-mission-continue
                className="min-h-[60px] w-full rounded-2xl bg-white px-6 text-xl font-black text-indigo-700 shadow-[0_5px_0_0_#C7D2FE] hover:bg-indigo-50 active:translate-y-0.5">
                {t(started ? 'mission.next' : 'mission.startNow')} <span aria-hidden="true">←</span>
              </button>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <span className="text-6xl" aria-hidden="true">🏆</span>
              <p className="text-2xl font-black">{t('mission.allDone')}</p>
            </div>
          )}
        </div>
        {/* LA SCÈNE ET LA PROGRESSION : les outils gagnés (anneau), les étoiles */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" data-mission-scene-card>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-3 text-xs font-black uppercase tracking-wide text-indigo-500">📚 {t('mission.tag')}
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm text-amber-800" data-mission-stars={stars}>⭐ <span dir="ltr">{stars}</span></span>
              </p>
              <h1 className="font-space text-2xl font-extrabold text-slate-900">{mission.title}</h1>
            </div>
            <ProgressRing value={earned} total={tools.length} label={t('mission.tools')} />
          </div>
          <MissionScene scene={mission.scene} fill={fill} className="mt-2 w-full" label={mission.title} />
          <div className="mt-3 flex flex-wrap items-center gap-1.5" data-mission-tools>
            {tools.map((tool) => (
              <span key={tool.id} data-mission-tool={tool.id} data-earned={tool.earned ? 'true' : 'false'}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${tool.earned ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-400'}`}>
                <span aria-hidden="true">{tool.earned ? tool.icon : '🔒'}</span>{tool.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" data-mission-path-card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black text-slate-900">{t('mission.mapTitle')}</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700" data-mission-done-count>✓ {t('mission.progress', { done: doneCount, total: stations.length })}</span>
        </div>
        <MissionMap lessonId={config.id} stations={stations} basePath={basePath} here={resume?.number} />
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 empty:hidden lg:grid-cols-2 lg:[&>*:only-child]:col-span-2 [&>*]:h-full" data-mission-home-row>
        <ReviseFirst lessonId={config.id} title={config.title} basePath={basePath} columns={1} />
        {/* Les تمارين de la leçon : dans la mission, l'élève n'ayant plus accès à l'ancienne page du درس. */}
        {isPracticeActive(config.id) && <PracticeEntryCard lessonId={config.id} />}
      </div>
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
