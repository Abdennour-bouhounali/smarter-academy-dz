import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLessonProgress } from '../../lessons/common/utils/progress/getLessonProgress';
import { getTotalModules } from '../../lessons/registry';
import { useLessonConfig } from '../../lessons/useLessonConfig';
import { useContentAvailability } from '../../context/ContentAvailabilityContext';
import { scopedStorage } from '../../utils/storage';
import { readStars, totalStars } from '../../lessons/common/manipulations/rounds/roundsModel';
import MathLabel from '../../lessons/common/components/MathLabel';
import MissionDialog from '../../lessons/common/mission/MissionDialog';
import PrerequisiteLessonChips from '../../lessons/common/components/PrerequisiteLessonChips';
import ReviseFirst from '../../lessons/common/mission/ReviseFirst';
import { unitState, unmetPrerequisites } from './unitMissions';
import { summaryLessons, unitSummaryPath } from '../../features/revision/unitSummary';

/**
 * THE UNIT PAGE, STUDENT VIEW — the PLAIN version (owner, 2026-11-26: « update it to the new version », the plain style of
 * the revision page; REVISION_PAGE.md §5). White cards, the one blue, no gradient, one column up to 1240 px; the page may
 * scroll (it replaces the one-screen, zoom-to-fit page of 2026-11-09):
 *   1. « درسك الآن » — the lesson to do, its progress, « واصل الدرس », « ما في الدرس؟ »;
 *   2. the unit's challenge, rewritten by the platform (unitMissions.js), and the keys won lesson after lesson;
 *   3. the lessons of the unit as a LIST: one row per lesson (its state, its stars or minutes, « الدرس »), the title opens
 *      the lesson's window; then the challenge's row;
 * « صفحة المراجعة » is NOT on this page any more (owner, 2026-11-26 on the French platform: « remove these buttons from
 * here », ported 2026-11-28): it is a door of the student's home of the lesson (features/lessonHome, LESSON_V2.md §2bis).
 *   4. the chips: goals, the full challenge, history, « راجع قبل الوحدة » — each opens a window.
 * The window (MissionDialog `card`): one line of facts, 3 goals, « المزيد » for the rest, an unmet prerequisite shown up
 * front, one button. It is built not to scroll (e2e/unit-mission-view.mjs). No textbook reference is shown to the student.
 */
const nb = (a, b) => `${a} / ${b}`;

/**
 * Un objectif du catalogue écrit ses formules en clair (« PGCD (a ; b) = b », « a = b × q ») au milieu d'une phrase arabe : sans
 * isolement, l'algorithme bidi retourne les parenthèses. Chaque passage latin devient un îlot LTR insécable ; un texte avec `$…$` garde MathLabel.
 */
const LATIN_RUN = /([A-Za-z(][A-Za-z0-9 ;()=×−+.]*[A-Za-z0-9)])/g;
function Bidi({ text }) {
  const s = String(text ?? '');
  if (s.includes('$')) return <MathLabel>{s}</MathLabel>;
  return s.split(LATIN_RUN).map((part, i) =>
    i % 2 === 1 ? (
      <bdi key={i} dir="ltr" className="whitespace-nowrap">
        {part}
      </bdi>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

/** Le nombre de la phrase en pastille ambre ; le reste reste du texte (MathLabel lit les formules). */
function Highlighted({ text, numbers }) {
  if (!numbers?.length) return <MathLabel>{text}</MathLabel>;
  const re = new RegExp(`(${numbers.map(String).join('|')})`, 'g');
  return text.split(re).map((part, i) =>
    numbers.map(String).includes(part) ? (
      <bdi key={i} dir="ltr" className="mx-0.5 font-black text-nav-accent">
        {part}
      </bdi>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

const CARD = 'rounded-2xl border border-nav-line bg-white p-5';
const PRIMARY =
  'inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl bg-nav-accent px-6 font-black text-white hover:bg-[#3350c4]';
const SECONDARY =
  'inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl border border-nav-accent bg-white px-4 font-bold text-nav-accent hover:bg-nav-accent-soft';

/** La carte « درسك الآن » : elle lit la config de la leçon (nom de mission) quand elle est chargée. */
function NowCard({ lesson, n, total, progress, first, t, onDetails }) {
  const config = useLessonConfig(lesson.id);
  return (
    <article className={CARD} data-unit-now={lesson.id}>
      <p className="text-sm font-black text-nav-accent">
        {first ? t('unit.mission.startTag') : t('unit.mission.nowTag')}
        <span className="ms-2 font-bold text-nav-muted">
          {t('unit.mission.lessonOf', { n, total })} · {t('unit.mission.minutes', { n: lesson.durationMinutes })}
        </span>
      </p>
      <h2 className="mt-1 text-2xl font-black leading-snug text-nav-ink">
        <MathLabel>{lesson.title}</MathLabel>
      </h2>
      {config?.mission?.title && (
        <p className="font-bold text-nav-muted">{t('unit.mission.missionName', { title: config.mission.title })}</p>
      )}
      {progress > 0 && (
        <div
          className="mt-3 flex items-center gap-2 text-sm font-bold text-nav-muted"
          data-unit-now-progress={progress}
        >
          <span className="h-2 w-48 overflow-hidden rounded-full bg-slate-100">
            <span className="block h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
          </span>
          {t('unit.mission.progress', { p: progress })}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link to={lesson.path} data-unit-continue className={PRIMARY}>
          {first
            ? t('unit.mission.startUnit')
            : progress > 0
              ? t('unit.mission.continue')
              : t('unit.mission.startLesson')}
          <span aria-hidden="true" className="ms-2">
            ←
          </span>
        </Link>
        <button type="button" onClick={onDetails} data-unit-whats-in className={SECONDARY}>
          {t('unit.mission.whatsIn')}
        </button>
      </div>
    </article>
  );
}

/** Une ligne de la liste : l'état de la leçon, son nom (il ouvre sa fenêtre), puis « الدرس ». */
function LessonLine({ row, n, total, status, t, onDetails }) {
  const { lesson, id, available, done, stars } = row;
  const circle =
    status === 'done'
      ? 'border-emerald-600 bg-emerald-600 text-white'
      : status === 'now'
        ? 'border-nav-accent bg-nav-accent text-white'
        : 'border-nav-line bg-white text-nav-muted';
  return (
    <li
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-nav-line py-3 ${status === 'now' ? 'bg-nav-accent-soft' : ''} px-3`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${circle}`}
        aria-hidden="true"
      >
        {status === 'done' ? '✓' : n}
      </span>
      <button
        type="button"
        onClick={onDetails}
        data-unit-station={id}
        data-status={status}
        aria-label={`${t('unit.mission.lessonOf', { n, total })}: ${lesson.title}`}
        className="min-w-0 flex-1 text-start"
      >
        <b className="block font-extrabold text-nav-ink hover:underline">
          <MathLabel>{lesson.title}</MathLabel>
        </b>
        <span className="text-xs font-bold text-nav-muted">
          {t('unit.mission.minutes', { n: lesson.durationMinutes })}
          {done && stars > 0 && ` · ⭐ ${stars}`}
        </span>
      </button>
      {status === 'now' && (
        <span className="whitespace-nowrap rounded-full bg-nav-accent px-2.5 py-0.5 text-xs font-black text-white">
          {t('unit.mission.here')}
        </span>
      )}
      {available ? (
        <Link to={lesson.path} data-unit-line-open={id} className={status === 'now' ? PRIMARY : SECONDARY}>
          {t('unit.mission.lesson')}
        </Link>
      ) : (
        <span aria-disabled="true" className="px-3 text-sm font-bold text-nav-muted">
          {t('unit.comingSoon')}
        </span>
      )}
    </li>
  );
}

/** La fenêtre d'une leçon : une ligne d'infos, 3 objectifs, « المزيد » pour le reste, un prérequis non fait d'emblée, un seul bouton. */
function LessonWindow({ lesson, n, total, icon, status, unmet, onOpenLesson, available, t }) {
  const config = useLessonConfig(lesson.id);
  const [more, setMore] = useState(false);
  const goals = lesson.learningPoints ?? [];
  const shown = more ? goals : goals.slice(0, 3);
  // une synthèse (`toolsOwned`) n'apporte aucun outil nouveau : ses clés sont celles de l'unité, déjà sur la page (et la fenêtre défilait)
  const tools = config?.mission?.toolsOwned ? [] : (config?.mission?.tools ?? []);
  const statusText =
    status === 'done'
      ? t('unit.mission.statusDone')
      : status === 'now'
        ? t('unit.mission.statusNow')
        : t('unit.mission.statusLater');
  const button =
    status === 'done' ? t('unit.mission.redo') : status === 'now' ? t('unit.mission.continue') : t('unit.mission.open');
  return (
    <div className="space-y-3" data-unit-window={lesson.id} data-more={more ? 'true' : 'false'}>
      {/* le titre tient sur une ligne ; s'il en faut deux, elles sont CENTRÉES (propriétaire, 2026-11-09) */}
      <div className="flex items-center justify-center gap-3.5 px-12 text-center" data-unit-window-head>
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-nav-accent-soft text-3xl"
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-balance text-[22px] font-black leading-snug text-slate-900">
            <Bidi text={lesson.title} />
          </h3>
          <p className="text-sm font-bold text-slate-500">
            {t('unit.mission.lessonOf', { n, total })} · {t('unit.mission.minutes', { n: lesson.durationMinutes })} ·{' '}
            {statusText}
          </p>
        </div>
      </div>
      <h4 className="text-sm font-black text-slate-700">{t('unit.mission.learn')}</h4>
      <ul className="space-y-1.5">
        {shown.map((lp) => (
          <li
            key={lp.id}
            className={`flex items-start gap-2.5 font-bold text-slate-800 ${more ? 'text-sm leading-snug' : 'text-[15px] leading-relaxed'}`}
          >
            <span
              className={`mt-1 inline-block h-5 w-5 shrink-0 rounded-md border-[2.5px] ${status === 'done' ? 'border-emerald-500 bg-emerald-500' : 'border-nav-accent'}`}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <Bidi text={lp.title} />
            </span>
          </li>
        ))}
      </ul>
      {more && (
        <div className={`grid gap-3 ${tools.length ? 'grid-cols-2' : ''}`} data-unit-more-body>
          {tools.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-slate-700">{t('unit.mission.tools')}</h4>
              <div className="flex flex-wrap gap-1">
                {tools.map((tool) => (
                  <span
                    key={tool.id}
                    className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[13px] font-bold text-amber-900"
                  >
                    {tool.icon} {tool.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-slate-700" title={t('unit.mission.needsNote')}>
              {t('unit.mission.needs')}
            </h4>
            <ul className="flex flex-wrap gap-1">
              <PrerequisiteLessonChips lessonId={lesson.id} />
              {/* the catalogue's free-text prerequisites only when the lesson names no prerequisite LESSON: the chips say the same skills as links
                  (LEARNING_NET.md « Sixth » removed such text for unit 3), and both together made the window scroll at 1366 / 1024 (units 4, 5) */}
              {((lesson.prerequisiteLessonCodes ?? []).length ? [] : (lesson.prerequisites ?? [])).map((txt) => (
                <li
                  key={txt}
                  className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[13px] font-bold text-teal-900"
                >
                  <Bidi text={txt} />
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-slate-500">{t('unit.mission.needsNote')}</p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setMore((m) => !m)}
        data-unit-more
        className="min-h-[36px] text-sm font-black text-nav-accent"
      >
        {more ? t('unit.mission.less') : t('unit.mission.more')}
      </button>
      {!more && unmet.length > 0 && (
        <div
          className="flex items-center gap-2 rounded-2xl border-[1.5px] border-orange-300 bg-orange-50 px-3 py-2 text-sm font-black text-orange-900"
          data-unit-revise-first={unmet[0].id}
        >
          {t('unit.mission.reviseFirst', { title: unmet[0].short })}
          <button
            type="button"
            onClick={() => onOpenLesson(unmet[0].id)}
            className="ms-auto rounded-xl bg-orange-400 px-3 py-1.5 text-white"
          >
            {t('unit.mission.openIt')}
          </button>
        </div>
      )}
      {available ? (
        <Link
          to={lesson.path}
          data-unit-open
          className="flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-nav-accent text-xl font-black text-white hover:bg-[#3350c4]"
        >
          {button}{' '}
          <span aria-hidden="true" className="ms-2">
            ←
          </span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-slate-200 text-lg font-black text-slate-500"
        >
          {t('unit.comingSoon')}
        </span>
      )}
    </div>
  );
}

export default function UnitMissionView({ unit, mission }) {
  const { t } = useTranslation('student');
  const { isLessonClosed, isLessonHiddenByClass } = useContentAvailability();
  const all = useMemo(() => [...unit.lessons, ...(unit.synthesis ? [unit.synthesis] : [])], [unit]);
  const rows = all.map((l) => {
    const available = l.status === 'available' && !isLessonClosed(l.id) && !isLessonHiddenByClass(l.id);
    const { progressPercent } = available ? getLessonProgress(l.id, getTotalModules(l.id)) : { progressPercent: 0 };
    const stars = totalStars(readStars(scopedStorage, l.id));
    return {
      lesson: l,
      id: l.id,
      available,
      progress: progressPercent,
      done: progressPercent >= 100,
      stars,
      short: mission.short[l.id] ?? l.title,
    };
  });
  const state = unitState(rows, mission);
  const doneIds = new Set(rows.filter((r) => r.done).map((r) => r.id));
  const unitIds = new Set(all.map((l) => l.id));
  const starsTotal = rows.reduce((s, r) => s + r.stars, 0);
  const current = rows.find((r) => r.id === state.current) ?? null;
  const total = rows.length;
  const [win, setWin] = useState(null); // { kind: 'lesson', id } | { kind: 'goals' | 'challenge' | 'history' | 'review' }
  const solvedAfter = all.find((l) => l.id === mission.challenge.solvedAfter);
  const statusOf = (r) => (r.done ? 'done' : r.id === state.current ? 'now' : 'later');
  const openLesson = (id) => setWin({ kind: 'lesson', id });
  const winRow = win?.kind === 'lesson' ? rows.find((r) => r.id === win.id) : null;

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-4" data-unit-mission-view={unit.id}>
      {/* l'en-tête : l'unité, et ce que l'élève a déjà fait */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black leading-snug text-nav-ink">
          <small className="block text-sm font-black text-nav-accent">{t('unit.unitNumber', { n: unit.number })}</small>
          <MathLabel>{unit.title}</MathLabel>
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <p className="flex flex-wrap gap-4 text-sm font-bold text-nav-muted">
            <span data-unit-done={state.done}>
              <b className="text-lg font-black text-nav-ink" dir="ltr">
                {nb(state.done, total)}
              </b>{' '}
              {t('unit.mission.lessonsDone')}
            </span>
            <span data-unit-stars={starsTotal}>
              <b className="text-lg font-black text-nav-ink">⭐ {starsTotal}</b> {t('unit.mission.starsLabel')}
            </span>
          </p>
          {summaryLessons(unit).length > 0 && (
            <Link to={unitSummaryPath(unit.id)} data-unit-summary-link className={SECONDARY}>
              {t('unit.mission.summary')}
            </Link>
          )}
        </div>
      </header>

      {current ? (
        <NowCard
          lesson={current.lesson}
          n={rows.indexOf(current) + 1}
          total={total}
          progress={current.progress}
          first={state.done === 0 && current.progress === 0}
          t={t}
          onDetails={() => openLesson(current.id)}
        />
      ) : (
        <article className={CARD} data-unit-finished>
          <p className="text-sm font-black text-nav-accent">{t('unit.mission.finishedTag')}</p>
          <h2 className="mt-1 text-2xl font-black text-nav-ink">{t('unit.mission.finishedTitle')}</h2>
          <p className="font-bold text-nav-muted">{t('unit.mission.finishedLine')}</p>
          <button
            type="button"
            onClick={() => setWin({ kind: 'challenge' })}
            data-unit-solve
            className={`mt-4 ${PRIMARY}`}
          >
            {t('unit.mission.solve')} ←
          </button>
        </article>
      )}

      {/* le défi de l'unité : POURQUOI l'unité existe */}
      <article className={CARD} data-unit-challenge-card>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-black text-nav-ink">{t('unit.mission.challengeTitle')}</h3>
          <button
            type="button"
            onClick={() => setWin({ kind: 'challenge' })}
            className="whitespace-nowrap text-sm font-black text-nav-accent"
          >
            {t('unit.mission.readChallenge')} ←
          </button>
        </div>
        <p className="mt-2 font-bold leading-loose text-nav-ink">
          <Highlighted text={mission.challenge.lead} numbers={mission.challenge.numbers} />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2" data-unit-keys={state.keysEarned}>
          <small className="text-sm font-bold text-nav-muted">
            {t('unit.mission.keys', { got: state.keysEarned, total: mission.keys.length })}
          </small>
          {mission.keys.map((k) => (
            <span
              key={k.label}
              className={`rounded-full border px-3 py-0.5 text-sm font-bold ${doneIds.has(k.after) ? 'border-emerald-600 text-emerald-700' : 'border-nav-line text-nav-muted'}`}
            >
              {doneIds.has(k.after) && '✓ '}
              <Bidi text={k.label} />
            </span>
          ))}
        </div>
      </article>

      {/* les leçons de l'unité, l'une sous l'autre */}
      <section
        className="overflow-hidden rounded-2xl border border-nav-line bg-white"
        aria-label={t('unit.mission.path')}
        data-unit-path
      >
        <div className="flex items-center justify-between gap-2 px-5 py-3">
          <h3 className="text-lg font-black text-nav-ink">{t('unit.mission.path')}</h3>
          <span className="text-sm font-black text-emerald-700">
            {t('unit.mission.doneOf', { done: state.done, total })}
          </span>
        </div>
        <ol>
          {rows.map((r, i) => (
            <LessonLine
              key={r.id}
              row={r}
              n={i + 1}
              total={total}
              status={statusOf(r)}
              t={t}
              onDetails={() => openLesson(r.id)}
            />
          ))}
          <li className="border-t border-nav-line">
            <button
              type="button"
              onClick={() => setWin({ kind: 'challenge' })}
              data-unit-station="challenge"
              className="flex min-h-[56px] w-full items-center gap-3 px-3 text-start font-extrabold text-nav-ink hover:bg-nav-page"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden="true">
                🏁
              </span>
              {t('unit.mission.flag')}
            </button>
          </li>
        </ol>
      </section>

      {/* ce que l'ancienne page montrait d'un coup : replié, à un toucher (jamais supprimé) */}
      <nav className="flex flex-wrap gap-2" aria-label="المزيد" data-unit-chips>
        {[
          ['goals', 'chipGoals'],
          ['challenge', 'chipChallenge'],
          ['history', 'chipHistory'],
          ['review', 'chipReview'],
        ].map(([kind, key]) => (
          <button
            key={kind}
            type="button"
            onClick={() => setWin({ kind })}
            data-unit-chip={kind}
            className="min-h-[40px] rounded-full border border-nav-line bg-white px-3.5 text-sm font-extrabold text-nav-ink hover:border-nav-accent hover:text-nav-accent"
          >
            {t(`unit.mission.${key}`)}
          </button>
        ))}
      </nav>

      {win && (
        <MissionDialog card label={t('unit.mission.windowLabel')} onClose={() => setWin(null)}>
          {winRow && (
            <LessonWindow
              key={winRow.id}
              lesson={winRow.lesson}
              n={rows.indexOf(winRow) + 1}
              total={total}
              icon={mission.icons[winRow.id] ?? '📘'}
              status={statusOf(winRow)}
              available={winRow.available}
              t={t}
              onOpenLesson={openLesson}
              unmet={unmetPrerequisites(winRow.lesson, doneIds, unitIds)
                .map((id) => rows.find((r) => r.id === id))
                .filter(Boolean)}
            />
          )}
          {win.kind === 'goals' && (
            <div className="space-y-3 pe-12" data-unit-window="goals">
              <h3 className="text-center text-xl font-black text-slate-900">{t('unit.mission.chipGoals')}</h3>
              <ul className="space-y-1.5 text-[15px] font-bold text-slate-800">
                {unit.objectives.map((o) => (
                  <li key={o}>
                    • <Bidi text={o} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {win.kind === 'challenge' && (
            <div className="space-y-3" data-unit-window="challenge">
              <h3 className="px-12 text-center text-xl font-black text-slate-900">
                {t('unit.mission.challengeTitle')}
              </h3>
              <p className="text-[17px] font-bold leading-loose text-slate-900">
                <Highlighted text={mission.challenge.full} numbers={mission.challenge.numbers} />
              </p>
              <p className="font-black text-slate-800">{mission.challenge.question}</p>
              {solvedAfter && (
                <p className="text-sm font-bold text-slate-500">
                  {t('unit.mission.challengeHint', { title: mission.short[solvedAfter.id] ?? solvedAfter.title })}
                </p>
              )}
            </div>
          )}
          {win.kind === 'history' && (
            <div className="space-y-3 pe-12" data-unit-window="history">
              <h3 className="text-center text-xl font-black text-slate-900">📜 {mission.history.title}</h3>
              <p className="text-base font-semibold leading-loose text-slate-800">{mission.history.text}</p>
            </div>
          )}
          {win.kind === 'review' && (
            <div className="space-y-3 pe-12" data-unit-window="review">
              <h3 className="text-center text-xl font-black text-slate-900">{t('unit.mission.chipReview')}</h3>
              <p className="text-sm font-bold text-slate-600">{t('unit.mission.reviewLead')}</p>
              <ReviseFirst lessonId={all[0].id} title={unit.title} basePath={unit.path} variant="slim" />
            </div>
          )}
        </MissionDialog>
      )}
    </div>
  );
}
