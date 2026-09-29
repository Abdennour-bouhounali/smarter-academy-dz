import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * WorkspaceLayoutContext — l'ÉTAT DE MISE EN PAGE GLOBAL de l'espace de travail.
 *
 * Une seule question y est répondue : « la carte des connaissances réclame-t-elle
 * sa propre colonne ? ». Les trois régions de l'application en dérivent leur
 * géométrie, et AUCUNE ne la recalcule pour son compte :
 *
 *   barre latérale (StudentNavbar)  → w-64 ↔ w-20        (elle se comprime)
 *   contenu (MainLayout/StudentLayout) → padding-right   (il rétrécit vraiment)
 *   carte (KnowledgeMap)            → la gouttière ainsi libérée
 *
 * ┌────┬────────────────────────────┬────────────┐
 * │ S  │        CONTENU             │  MA CARTE  │
 * └────┴────────────────────────────┴────────────┘
 *
 * POURQUOI ICI, ET PAS DANS LA CARTE — la carte est portalisée dans <body> et
 * `position: fixed` ; elle ne peut donc pas pousser quoi que ce soit toute
 * seule. C'est la coquille qui doit RÉSERVER la place, ce qui suppose un état
 * situé au-dessus des deux coquilles (CourseLayout choisit l'une ou l'autre
 * selon l'authentification). D'où ce contexte monté dans App, au-dessus du
 * routeur.
 *
 * POURQUOI LE CONTENU RÉTRÉCIT PAR `padding-right` ET NON PAR UNE GRILLE — le
 * <main> des deux coquilles réserve déjà la barre latérale par `lg:pl-64`, et
 * `useLessonViewport` (carte, bandeaux collants) MESURE la boîte de padding de
 * ce <main> pour connaître le rectangle réellement offert à la leçon. Réserver
 * la colonne de droite dans le même padding fait donc que toute la machinerie
 * de mesure existante voit la nouvelle géométrie sans qu'une seule ligne n'en
 * soit modifiée : la carte se place dans la gouttière qu'elle vient de créer.
 * Une grille aurait au contraire introduit un second système de mesure.
 *
 * TROIS ÉTATS, PAS DEUX BOOLÉENS :
 *
 *   'closed'  la carte est fermée                     — coquille normale
 *   'normal'  tiroir flottant / plein écran           — coquille normale
 *   'prior'   la carte est une VRAIE TROISIÈME COLONNE — coquille comprimée
 *
 * Seul 'prior' change la coquille. 'normal' recouvre les deux présentations
 * historiques (tiroir et plein écran), dont la géométrie est verrouillée par
 * les suites e2e `*-carte.mjs` et `km-layout.mjs` : elles ne bougent pas.
 */

/** Largeur de la barre latérale élève déployée (`w-64`), en pixels. */
export const SIDEBAR_WIDTH = 256;

/** Largeur de la barre latérale comprimée (`w-20`) — icônes seules. */
export const SIDEBAR_COLLAPSED_WIDTH = 80;

/**
 * LA COLONNE « MA CARTE » A UNE LARGEUR FIXE — la meilleure pour l'écran, pas
 * une largeur que l'élève règle (décision du propriétaire, 2026-09-29 : la
 * poignée de redimensionnement a disparu du mode colonne).
 *
 *   largeur = 40 % de la place à côté de la barre latérale,
 *             au moins MA_CARTE_MIN_WIDTH (la carte reste lisible : deux
 *             couloirs de nœuds, son en-tête sans troncature),
 *             au plus MA_CARTE_MAX_WIDTH (MA_CARTE_MAX_WIDE à partir de
 *             1600 px) — au-delà la leçon perd plus que la carte ne gagne,
 *             et JAMAIS au point de laisser moins de MIN_CONTENT_WIDTH à la
 *             leçon.
 *
 *   1024 px, barre comprimée → 378 px de carte, 566 px de leçon
 *   1280 px                  → 480 / 720
 *   1440 px                  → 480 / 880
 *   1920 px                  → 560 / 1280
 */
export const MA_CARTE_MIN_WIDTH = 360;
export const MA_CARTE_MAX_WIDTH = 480;
export const MA_CARTE_MAX_WIDE = 560;
export const MA_CARTE_SHARE = 0.4;

/** Largeur en dessous de laquelle une leçon n'est plus confortable. */
export const MIN_CONTENT_WIDTH = 560;

/** La largeur de la colonne pour une fenêtre et une barre latérale données. */
export function columnWidthFor(viewportWidth, sidebarWidth = SIDEBAR_COLLAPSED_WIDTH) {
  const available = viewportWidth - sidebarWidth;
  const cap = viewportWidth >= 1600 ? MA_CARTE_MAX_WIDE : MA_CARTE_MAX_WIDTH;
  const ideal = Math.min(cap, Math.max(MA_CARTE_MIN_WIDTH, Math.round(available * MA_CARTE_SHARE)));
  return Math.max(0, Math.min(ideal, available - MIN_CONTENT_WIDTH));
}

/**
 * La barre latérale peut-elle se DÉPLOYER à côté de la colonne ? Oui tant que
 * la leçon garde MIN_CONTENT_WIDTH avec une carte à sa largeur minimale.
 */
export function sidebarCanOpenBesideColumn(viewportWidth) {
  return viewportWidth - SIDEBAR_WIDTH - MA_CARTE_MIN_WIDTH >= MIN_CONTENT_WIDTH;
}

/**
 * Le mode « colonne » suppose assez de place pour DEUX zones utiles côte à
 * côte. En dessous, la carte reste ce qu'elle a toujours été : une surface
 * flottante au-dessus de la leçon (tiroir plein écran sur mobile). 1024px est
 * le point de rupture `lg` de Tailwind, celui-là même où la barre latérale
 * élève apparaît — un seul seuil pour toute la coquille.
 */
export const PRIOR_MIN_WIDTH = 1024;

const STORAGE_KEY = 'knowledgeMapPrior';

/**
 * Repli MANUEL de la barre latérale, à la main de l'élève.
 *
 * Ce nom de clé n'est pas nouveau : `km-layout.mjs` le sème déjà pour son
 * scénario « auth desktop collapsed sidebar », en prévision d'un repli qui
 * n'existait pas encore. On l'honore plutôt que d'en inventer un second.
 */
const SIDEBAR_KEY = 'sidebarCollapsed';

/**
 * Barre déployée À CÔTÉ de la colonne : un choix distinct du repli manuel
 * hors carte (l'un n'écrase pas l'autre). Par défaut, la colonne comprime la
 * barre ; l'élève (ou l'enseignant) peut la rouvrir d'un clic.
 */
const SIDEBAR_BESIDE_COLUMN_KEY = 'sidebarOpenBesideMap';

const WorkspaceLayoutContext = createContext(null);

/**
 * Le mode colonne est-il tenable à cette largeur ?
 * Exporté pour que les tests unitaires interrogent la règle, pas le rendu.
 */
export function priorFitsViewport(viewportWidth) {
  return viewportWidth >= PRIOR_MIN_WIDTH;
}

export function WorkspaceLayoutProvider({ children }) {
  // Préférence de l'élève : il a demandé le mode colonne une fois, on le lui
  // redonne à chaque leçon. C'est une préférence d'espace de travail, pas un
  // état de leçon — d'où le stockage global, comme knowledgeMapWidth.
  // Le mode colonne est le DÉFAUT là où il tient : le tiroir flottant n'est
  // plus une présentation qu'on choisit (son bouton a disparu), seulement le
  // repli des écrans trop étroits. Un élève qui n'a jamais rien réglé ouvre
  // donc sa carte en colonne ; seul un refus explicite (bouton « Plein écran »,
  // puis fermeture) est mémorisé.
  const [priorPreferred, setPriorPreferred] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === 'true';
    } catch { return true; }
  });

  // La carte est-elle ouverte ? Publié par le provider de leçon (une carte
  // n'existe que dans une leçon), consommé par les coquilles.
  const [mapOpen, setMapOpen] = useState(false);

  // La carte est-elle en PLEIN ÉCRAN ? Elle couvre alors la zone de la leçon
  // elle-même : la coquille ne doit RIEN lui réserver de plus, sinon le
  // rectangle que le plein écran remplit est amputé de la largeur d'une
  // colonne — et la carte s'arrête avant le bord droit de l'écran.
  const [mapExpanded, setMapExpanded] = useState(false);

  // Repli manuel, indépendant de la carte : l'élève veut plus de place pour
  // sa leçon, carte ou pas.
  const [sidebarManuallyCollapsed, setSidebarManuallyCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === 'true'; }
    catch { return false; }
  });

  // Barre rouverte à côté de la colonne (voir SIDEBAR_BESIDE_COLUMN_KEY).
  const [sidebarOpenBesideMap, setSidebarOpenBesideMapState] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_BESIDE_COLUMN_KEY) === 'true'; }
    catch { return false; }
  });

  const [viewportWidth, setViewportWidth] = useState(
    () => (typeof window === 'undefined' ? 1280 : window.innerWidth)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const setPrior = useCallback((next) => {
    setPriorPreferred(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* noop */ }
  }, []);

  const setSidebarOpenBesideMap = useCallback((next) => {
    setSidebarOpenBesideMapState(next);
    try { localStorage.setItem(SIDEBAR_BESIDE_COLUMN_KEY, String(next)); } catch { /* noop */ }
  }, []);

  const setSidebarCollapsed = useCallback((next) => {
    setSidebarManuallyCollapsed(next);
    try { localStorage.setItem(SIDEBAR_KEY, String(next)); } catch { /* noop */ }
  }, []);

  const value = useMemo(() => {
    const fits = priorFitsViewport(viewportWidth);
    // Le mode colonne n'est EFFECTIF que si la carte est ouverte ET que l'écran
    // peut l'accueillir. La préférence, elle, survit au passage sur un écran
    // étroit : revenir au large la restaure sans que l'élève la redemande.
    const prior = mapOpen && priorPreferred && fits;

    // LA BARRE LATÉRALE — deux raisons d'être comprimée, un seul état dérivé :
    //   hors colonne : le repli MANUEL (un confort) ;
    //   en colonne   : comprimée PAR DÉFAUT (la carte a besoin de la place),
    //                  mais l'utilisateur peut la rouvrir d'un clic — la
    //                  colonne se recalcule alors à côté d'elle. La bascule ne
    //                  se verrouille que là où, rouverte, elle écraserait la
    //                  leçon sous MIN_CONTENT_WIDTH.
    const canOpenBeside = sidebarCanOpenBesideColumn(viewportWidth);
    const sidebarCollapsed = prior
      ? !(sidebarOpenBesideMap && canOpenBeside)
      : sidebarManuallyCollapsed;
    const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

    // Largeur FIXE de la colonne, calculée pour cet écran et cette barre.
    const maCarteWidth = columnWidthFor(viewportWidth, sidebarWidth);

    // Le plein écran suspend la colonne : pas de gouttière, donc `vpWidth`
    // redevient toute la largeur offerte à la leçon, et la carte va jusqu'au
    // bord. La PRÉFÉRENCE de colonne, elle, n'est pas touchée : quitter le
    // plein écran y revient.
    const gutter = prior && !mapExpanded ? maCarteWidth : 0;

    return {
      mode: prior ? 'prior' : mapOpen ? 'normal' : 'closed',
      isPrior: prior,
      priorPreferred,
      priorAvailable: fits,
      mapOpen,
      setMapOpen,
      setPrior,
      togglePrior: () => setPrior(!priorPreferred),
      maCarteWidth,
      // Gouttière que la coquille doit réserver à côté du contenu. Elle vaut
      // EXACTEMENT la largeur de la colonne : c'est ce qui garantit que le
      // contenu ne passe jamais derrière la carte.
      contentGutter: gutter,
      mapExpanded,
      setMapExpanded,
      sidebarCollapsed,
      // Verrouillée seulement si la rouvrir écraserait la leçon ; le bouton le
      // DIT (désactivé + libellé) au lieu de proposer une action sans effet.
      sidebarToggleLocked: prior && !canOpenBeside,
      setSidebarCollapsed,
      toggleSidebar: prior
        ? () => setSidebarOpenBesideMap(sidebarCollapsed)
        : () => setSidebarCollapsed(!sidebarManuallyCollapsed),
      sidebarWidth,
      viewportWidth,
    };
  }, [mapOpen, mapExpanded, priorPreferred, setPrior, sidebarOpenBesideMap, setSidebarOpenBesideMap,
      sidebarManuallyCollapsed, setSidebarCollapsed, viewportWidth]);

  return (
    <WorkspaceLayoutContext.Provider value={value}>
      {children}
    </WorkspaceLayoutContext.Provider>
  );
}

const FALLBACK = {
  mode: 'closed', isPrior: false, priorPreferred: false, priorAvailable: false,
  mapOpen: false, setMapOpen: () => {}, setPrior: () => {}, togglePrior: () => {},
  maCarteWidth: MA_CARTE_MAX_WIDTH, contentGutter: 0,
  mapExpanded: false, setMapExpanded: () => {},
  sidebarCollapsed: false, sidebarToggleLocked: false,
  setSidebarCollapsed: () => {}, toggleSidebar: () => {},
  sidebarWidth: SIDEBAR_WIDTH, viewportWidth: 1280,
};

/**
 * État de mise en page de l'espace de travail.
 * Hors provider (tests unitaires, rendu isolé) : coquille normale, jamais
 * d'exception — une page doit pouvoir se rendre sans l'espace de travail.
 */
export function useWorkspaceLayout() {
  return useContext(WorkspaceLayoutContext) ?? FALLBACK;
}
