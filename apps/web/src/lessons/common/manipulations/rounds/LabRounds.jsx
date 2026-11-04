import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Manipulation from '../Manipulation';
import { scopedStorage } from '../../../../utils/storage';
import {
  emptyLog, logEvent, roundWon, starsFor, roundUnlocked, resumeRound, readStars, recordStars, STARS_EVENT,
} from './roundsModel';

/**
 * UN LABO EN MANCHES (« الجولات » + étoiles, propriétaire 2026-11-04) — au lieu du sélecteur مبتدئ / متقدم.
 *
 *   <LabRounds lessonId labId rounds={[…]} onRoundWon={(id) => …} onVerdict onTrial />
 *
 * En haut, le CHEMIN des manches (numéro, titre, meilleures étoiles ★★☆, serrure) ; au milieu, la manche courante — un labo
 * NEUF par manche (`key`), donc sa propre « مهمتك » en grand (ManipulationShell) ; à la victoire, une carte : les étoiles
 * gagnées une à une, pourquoi (gagnée · questions justes du premier coup · peu d'essais), et « الجولة التالية ». Rejouer une
 * manche ne fait jamais perdre d'étoiles. Le terrain libre (`free`) est toujours ouvert (règle « جرّب أعدادك »).
 * La logique est dans roundsModel.js ; les étoiles vivent par élève dans scopedStorage (la barre de mission en fait le total).
 */
// la célébration du labo (LabSteps.useStepCelebration) dure 2,2 s : la carte de la manche vient APRÈS elle
const WIN_DELAY_MS = 2400;

export default function LabRounds({ lessonId, labId, rounds, onRoundWon, onVerdict, onTrial }) {
  const { t } = useTranslation('lesson');
  const reduceMotion = useReducedMotion();
  const [best, setBest] = useState(() => readStars(scopedStorage, lessonId)[labId] ?? {});
  const [index, setIndex] = useState(() => resumeRound(rounds, readStars(scopedStorage, lessonId)[labId] ?? {}));
  const [log, setLog] = useState(emptyLog);
  const [win, setWin] = useState(null); // { roundId, stars, why: [bool, bool, bool] }
  const announced = useRef(new Set());
  // gagnée UNE fois par passage ; le minuteur de la carte vit hors de l'effet (un nouvel événement ne doit pas l'annuler)
  const wonRef = useRef(false);
  const winTimer = useRef(null);
  useEffect(() => () => clearTimeout(winTimer.current), []);
  const round = rounds[index];

  // Les manches DÉJÀ gagnées (une visite précédente) comptent pour le module dès l'arrivée.
  useEffect(() => {
    Object.keys(best).forEach((id) => { if (!announced.current.has(id)) { announced.current.add(id); onRoundWon?.(id); } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // La victoire : une seule fois par passage dans la manche.
  useEffect(() => {
    if (wonRef.current || !round || !roundWon(round, log)) return;
    wonRef.current = true;
    const stars = starsFor(round, log);
    const clean = log.answers.every((a) => a.ok && a.tries <= 1 && !a.revealed);
    const few = round.stars?.maxTrials == null || log.verdicts.length <= round.stars.maxTrials;
    const all = recordStars(scopedStorage, lessonId, labId, round.id, stars);
    setBest(all[labId] ?? {});
    window.dispatchEvent(new Event(STARS_EVENT));
    announced.current.add(round.id);
    onRoundWon?.(round.id);
    // La carte de la manche ATTEND la célébration du labo (LabSteps : « المهمة 1 مكتملة ») : l'une après l'autre, jamais l'une
    // sur l'autre. L'attente suit la réussite de l'élève — ce n'est pas un minuteur de lecture.
    winTimer.current = setTimeout(() => setWin({ roundId: round.id, stars, why: [true, clean, few] }), WIN_DELAY_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log]);

  const go = (i) => { clearTimeout(winTimer.current); wonRef.current = false; setIndex(i); setLog(emptyLog()); setWin(null); };
  const nextIndex = rounds.findIndex((r, i) => i > index && roundUnlocked(rounds, i, best));

  const chipLabel = (r, i) => (r.free ? t('manipulation.rounds.free') : r.optional ? t('manipulation.rounds.challenge') : t('manipulation.rounds.round', { n: i + 1 }));
  const Stars = ({ n, size = 'text-sm' }) => (
    <span className={`${size} tracking-tight`} aria-label={t('manipulation.rounds.starsLabel', { n })} dir="ltr">
      {[0, 1, 2].map((k) => <span key={k} className={k < n ? 'text-amber-400' : 'text-slate-300'}>★</span>)}
    </span>
  );

  return (
    <div className="space-y-3" data-lab-rounds={labId}>
      <ol className="flex flex-wrap items-stretch gap-2" aria-label={t('manipulation.rounds.track')} data-rounds-track>
        {rounds.map((r, i) => {
          const open = roundUnlocked(rounds, i, best);
          const current = i === index;
          const got = best[r.id] ?? 0;
          return (
            <li key={r.id}>
              <button type="button" disabled={!open} onClick={() => go(i)} aria-current={current ? 'step' : undefined}
                title={open ? r.title : t('manipulation.rounds.locked')} data-round={r.id} data-round-stars={got}
                className={`flex min-h-[52px] items-center gap-2 rounded-2xl border-2 px-3 text-start transition-colors ${current ? 'border-indigo-600 bg-indigo-600 text-white shadow' : open ? 'border-indigo-200 bg-white text-indigo-950 hover:bg-indigo-50' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                <span className="text-lg" aria-hidden="true">{!open ? '🔒' : r.free ? '🏟️' : r.optional ? '⭐' : got ? '✓' : '⚽'}</span>
                <span className="leading-tight">
                  <span className="block text-sm font-black">{chipLabel(r, i)}</span>
                  {!r.free && <Stars n={got} size="text-xs" />}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative">
        {round && (
          <Manipulation
            key={`${labId}:${round.id}`}
            {...round.props}
            levels={false}
            onVerdict={(v) => { setLog((l) => logEvent(l, 'verdict', v)); onVerdict?.(v); }}
            onTrial={(e) => { setLog((l) => logEvent(l, 'trial', e)); onTrial?.(e); }}
          />
        )}
        <AnimatePresence>
          {win && (
            <motion.div key="round-win" data-round-win={win.roundId}
              className="absolute inset-0 z-40 flex items-center justify-center rounded-3xl bg-indigo-950/70 p-6 backdrop-blur-sm"
              initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-full max-w-2xl space-y-6 rounded-3xl bg-white p-10 text-center shadow-2xl"
                initial={reduceMotion ? false : { scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                <p className="text-3xl font-black text-indigo-950">🎉 {round?.optional ? t('manipulation.rounds.challengeWon') : t('manipulation.rounds.won')}</p>
                <p className="flex justify-center gap-3 text-6xl" dir="ltr" aria-label={t('manipulation.rounds.starsLabel', { n: win.stars })}>
                  {[0, 1, 2].map((k) => (
                    <motion.span key={k} className={k < win.stars ? 'text-amber-400 drop-shadow' : 'text-slate-200'}
                      initial={reduceMotion ? false : { scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.25 + k * 0.25, type: 'spring', stiffness: 320, damping: 14 }}>★</motion.span>
                  ))}
                </p>
                <ul className="mx-auto max-w-md space-y-1 text-start text-lg">
                  {win.why.map((ok, k) => (
                    <li key={k} className={ok ? 'font-bold text-emerald-700' : 'text-slate-400'}>{ok ? '★' : '☆'} {t(`manipulation.rounds.why${k + 1}`)}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap justify-center gap-3">
                  {nextIndex >= 0 && (
                    <button type="button" onClick={() => go(nextIndex)} data-round-next autoFocus
                      className="min-h-[56px] rounded-2xl bg-indigo-600 px-8 text-xl font-black text-white shadow-[0_4px_0_0_#3730A3] hover:bg-indigo-700">
                      {t('manipulation.rounds.next')} <span aria-hidden="true">←</span>
                    </button>
                  )}
                  <button type="button" onClick={() => setWin(null)} data-round-stay
                    className="min-h-[56px] rounded-2xl px-6 text-lg font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                    {t('manipulation.rounds.stay')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
