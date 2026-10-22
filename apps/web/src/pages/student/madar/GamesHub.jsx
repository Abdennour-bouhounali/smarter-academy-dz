import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Fuel, Gamepad2, Loader2, Lock, Play, Star, Trophy } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { fetchMadar } from '../../../services/madarService';
import { ArrowBack } from '../../../components/common/DirectionalIcons';
import { createAudio } from '../../../features/madar/engine/audio';
import { formatScore } from '../../../features/madar/madarModel';
import AdjustmentNotice from '../../../features/madar/components/AdjustmentNotice';
import HeartsRow from '../../../features/madar/components/HeartsRow';
import RefuelStation from '../../../features/madar/components/RefuelStation';
import ShipIcon from '../../../features/madar/components/ShipIcon';
import TurretIcon from '../../../features/madar/components/TurretIcon';

/** Une illustration par jeu — dessinée en code (SVG), comme tout le reste. */
function Art({ game }) {
  if (game === 'orbit') {
    return (
      <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
        <circle cx="80" cy="50" r="18" fill="#a8714a" />
        <circle cx="80" cy="50" r="30" fill="none" stroke="#fde68a55" strokeDasharray="3 5" />
        <circle cx="80" cy="50" r="42" fill="none" stroke="#fde68a33" strokeDasharray="3 5" />
        <polygon points="40,40 46,36 44,46" fill="#fde047" />
        <circle cx="120" cy="66" r="6" fill="#7a6658" />
        <g transform="translate(62 80)"><ShipIcon id="sahm" size={30} /></g>
      </svg>
    );
  }
  if (game === 'defense') {
    return (
      <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
        <circle cx="80" cy="50" r="16" fill="#2f8fdc" />
        <circle cx="80" cy="50" r="22" fill="none" stroke="#34d399" strokeWidth="3" />
        <circle cx="80" cy="50" r="36" fill="none" stroke="#94a3ff33" />
        <line x1="54" y1="30" x2="30" y2="18" stroke="#f472b6" strokeWidth="2" />
        <polygon points="26,14 34,18 26,22" fill="#4ade80" />
        <polygon points="132,70 140,74 132,78" fill="#4ade80" />
        <g transform="translate(44 20)"><TurretIcon type="laser" size={22} /></g>
        <g transform="translate(96 58)"><TurretIcon type="pulse" size={22} /></g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="78" width="70" height="22" fill="#8b93a7" />
      <rect x="0" y="78" width="70" height="4" fill="#cbd5e1" />
      <rect x="92" y="78" width="68" height="22" fill="#8b93a7" />
      <rect x="92" y="78" width="68" height="4" fill="#cbd5e1" />
      <rect x="62" y="40" width="14" height="14" fill="#7c3aed" stroke="#fde68a" strokeWidth="2" />
      <polygon points="69,43 73,47 69,51 65,47" fill="#fde68a" />
      <polygon points="104,58 108,62 104,66 100,62" fill="#67e8f9" />
      <polygon points="116,58 120,62 116,66 112,62" fill="#67e8f9" />
      <circle cx="40" cy="62" r="7" fill="#f8fafc" />
      <ellipse cx="38" cy="62" rx="4" ry="3" fill="#f59e0b" />
      <rect x="35" y="68" width="10" height="10" rx="2" fill="#f8fafc" />
      <path d="M140 78 q4 -26 10 0 z" fill="#e2e8f0" />
    </svg>
  );
}

/**
 * « فضاء الألعاب » — la salle des jeux de l'élève (/espace/jeux), plein écran.
 *
 * Ce qui est COMMUN aux trois jeux vit ici : les cœurs, la « محطة التزوّد »
 * (où une réponse juste rend un cœur), les messages de l'enseignant, la limite
 * de parties du jour. Chaque jeu est une carte (ce qu'il entraîne, le record,
 * le rang de la semaine) qui ouvre sa page /espace/jeux/:game. Un jeu fermé
 * par l'enseignant reste visible, verrouillé.
 */
export default function GamesHub() {
  const { t } = useTranslation('madar');
  useDocumentMeta(t('hub.title'));
  const { token } = useContext(AuthContext);
  const reduce = useReducedMotion();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [refuel, setRefuel] = useState(false);
  const [notices, setNotices] = useState([]);
  const audio = useMemo(() => createAudio(), []);
  useEffect(() => () => audio.dispose(), [audio]);

  const load = useCallback(async () => {
    try {
      const data = await fetchMadar(token);
      setState(data);
      if (data.adjustments?.length) setNotices((cur) => [...cur, ...data.adjustments]);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [token]);
  useEffect(() => { if (token) load(); }, [token, load]);
  const onHearts = useCallback(({ hearts }) => setState((s) => (s ? { ...s, hearts } : s)), []);

  if (!state) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[#060414] text-white">
        {error ? <p role="alert" className="font-inter text-sm text-rose-200">{error}</p>
          : <p className="flex items-center gap-2 font-inter text-white/70" role="status"><Loader2 size={18} className="animate-spin" aria-hidden="true" /> {t('loading')}</p>}
      </div>
    );
  }

  const enabled = Object.fromEntries((state.games ?? []).map((g) => [g.id, g.enabled]));
  const cards = [
    { id: 'orbit', stat: formatScore(state.best), statLabel: t('lobby.best'), rank: state.competition?.me?.rank },
    { id: 'defense', stat: state.defense?.bestWave ?? 0, statLabel: t('defense.lobby.bestWave'), rank: state.defense?.competition?.me?.rank },
    { id: 'explorer', stat: `${state.explorer?.totalStars ?? 0}/${state.explorer?.maxStars ?? 36}`, statLabel: t('explorer.stars'), rank: state.explorer?.competition?.me?.rank, star: true },
  ];
  const closed = !state.available;

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0b0720_50%,_#05040f_100%)] text-white" data-games-hub>
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-[max(14px,env(safe-area-inset-top))] sm:px-8">
          <Link to="/espace" className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white/10 px-3 font-inter text-sm font-semibold ring-1 ring-white/15 hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50">
            <ArrowBack size={16} aria-hidden="true" /> <span>{t('back')}</span>
          </Link>
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
            <HeartsRow hearts={state.hearts} max={state.maxHearts} size={20} />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-8">
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-300/15 px-3 py-1 font-inter text-xs font-bold text-amber-200"><Gamepad2 size={14} aria-hidden="true" /> {t('hub.eyebrow')}</p>
            <h1 className="mt-3 bg-gradient-to-b from-white via-amber-100 to-amber-300 bg-clip-text font-space text-5xl font-black leading-tight text-transparent sm:text-6xl">{t('hub.title')}</h1>
            <p className="mx-auto mt-2 max-w-xl font-inter text-sm leading-relaxed text-white/75 sm:text-base">{t('hub.subtitle')}</p>
          </motion.div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
              <p className="font-inter text-sm text-white/80">{t('hub.heartsRule', { n: state.dailyFreeHearts })}</p>
              <p className="mt-0.5 font-inter text-xs text-white/55">{t('lobby.runsToday')}: <bdi dir="ltr">{t('lobby.runsTodayValue', { n: state.runsToday, cap: state.dailyRunCap })}</bdi></p>
            </div>
            {state.hearts < state.maxHearts && state.available && (
              <button type="button" onClick={() => { audio.unlock(); setRefuel(true); }}
                className="flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-500 px-5 font-space text-base font-black text-slate-950 shadow-[0_10px_30px_-10px_rgba(251,146,60,0.8)] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200" data-action="refuel">
                <Fuel size={20} aria-hidden="true" /> {t('lobby.refuel')}
              </button>
            )}
          </div>
          <div className="mx-auto mt-3 max-w-3xl"><AdjustmentNotice adjustments={notices} onDismiss={() => setNotices([])} /></div>
          {closed && <p className="mx-auto mt-4 max-w-3xl rounded-2xl bg-white/[0.06] p-3 text-center font-inter text-sm text-white/80" role="status">{t(`reasons.${state.reason}`, { defaultValue: t('reasons.disabled') })}</p>}

          <ul className="mt-8 grid gap-4 md:grid-cols-3" data-games>
            {cards.map((card, i) => {
              const open = !closed && enabled[card.id] !== false;
              return (
                <motion.li key={card.id} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
                  <article className={`group flex h-full flex-col overflow-hidden rounded-[28px] bg-slate-950/60 ring-1 backdrop-blur transition ${open ? 'ring-white/15 hover:-translate-y-1 hover:ring-amber-300/50' : 'opacity-70 ring-white/10'}`} data-game-card={card.id}>
                    <div className="relative h-36 bg-gradient-to-b from-indigo-500/20 to-transparent p-3"><Art game={card.id} /></div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h2 className="font-space text-2xl font-black text-white">{t(`games.${card.id}.name`)}</h2>
                      <p className="font-inter text-xs font-semibold text-amber-200/90">{t(`games.${card.id}.skill`)}</p>
                      <p className="font-inter text-sm leading-relaxed text-white/70">{t(`games.${card.id}.tagline`)}</p>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 font-inter text-xs">
                          {card.star && <Star size={12} className="fill-amber-300 text-amber-300" aria-hidden="true" />}
                          <span className="text-white/60">{card.statLabel}:</span> <b className="font-space" dir="ltr">{card.stat}</b>
                        </span>
                        {card.rank && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-2.5 py-1 font-inter text-xs text-amber-100">
                            <Trophy size={12} aria-hidden="true" /> <span dir="ltr">#{card.rank}</span>
                          </span>
                        )}
                      </div>
                      {open ? (
                        <Link to={`/espace/jeux/${card.id}`} className="mt-2 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white font-space text-lg font-black text-slate-950 transition group-hover:bg-amber-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60" data-action="open-game">
                          <Play size={18} className="-scale-x-100" aria-hidden="true" /> {t('hub.play')}
                        </Link>
                      ) : (
                        <p className="mt-2 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white/5 font-inter text-sm text-white/60"><Lock size={16} aria-hidden="true" /> {t('games.closed')}</p>
                      )}
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ul>
        </main>

        {refuel && (
          <RefuelStation
            context="base"
            hearts={state.hearts}
            maxHearts={state.maxHearts}
            audio={audio}
            canPlay={false}
            onHearts={onHearts}
            onClose={() => { setRefuel(false); load(); }}
            onContinue={() => setRefuel(false)}
            onPlay={() => setRefuel(false)}
          />
        )}
      </div>
    </MotionConfig>
  );
}
