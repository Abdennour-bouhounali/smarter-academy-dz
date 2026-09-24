import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
/**
 * La racine d'une séance de وضع القسم EN COURS, ou `document.body`.
 *
 * Pourquoi on la cherche dans le DOM plutôt qu'avec `useClassroomPortalTarget()` :
 * ce fournisseur est monté AU-DESSUS du routeur (pour que la leçon ne soit
 * jamais démontée), donc au-dessus de `ClassroomPresentation`. Le contexte
 * de la présentation descend, il ne remonte pas — le hook rendrait toujours
 * `document.body`, et le calque s'ouvrirait DERRIÈRE la présentation
 * (mesuré : la racine est à z-index 70 et vient après dans le document).
 *
 * `.sa-classroom-root--active` est posée par ClassroomPresentation sur la
 * racine de la séance, et il n'y en a jamais qu'une (« une seule session »,
 * CLASSROOM_MODE.md §4). On la lit au moment d'ouvrir le calque, ce qui
 * suffit : une séance ne commence ni ne finit pendant ce rendu-là.
 */
function presentationRoot() {
  if (typeof document === 'undefined') return null;

  return document.querySelector('.sa-classroom-root--active') ?? document.body;
}
import MathLabOverlay from './MathLabOverlay.jsx';
import { PICKER } from './overlayState.js';

export { PICKER };

/**
 * LE مختبر OUVERT PAR-DESSUS LA LEÇON — une seule instance, montée au-dessus
 * du routeur, exactement comme le cahier (NotebookProvider).
 *
 * ── Pourquoi au-dessus du routeur ────────────────────────────────────────
 * Le brief est « l'outil se pose SUR le cours », pas « on quitte le cours » :
 * en fermant, l'élève doit retrouver sa leçon au même module, au même
 * défilement, avec la même réponse tapée et la même étape atteinte. Un
 * `navigate()` vers /espace/atelier démonterait la leçon et perdrait tout
 * cela. Ici, la page de leçon n'est jamais démontée : elle reste dans l'arbre
 * React, derrière un calque. Rien à sauvegarder, rien à restaurer — l'état
 * n'a simplement pas bougé. C'est la même raison qui met le cahier là.
 *
 * ── Ce que ce fournisseur porte ──────────────────────────────────────────
 *  - `tool` : l'instrument ouvert (`null` = fermé, `'#picker'` = le choix) ;
 *  - l'élément qui a ouvert le مختبر, pour LUI RENDRE le focus en fermant
 *    (§9 du brief) — un `ref`, jamais de l'état : le rendre ne regarde pas.
 *
 * Le plein écran, lui, appartient au calque (MathLabOverlay) : c'est lui qui
 * possède l'élément que le navigateur met en plein écran.
 *
 * ── Le plein écran du مختبر n'est PAS « وضع القسم » ──────────────────────
 * Deux notions distinctes, et ce fichier ne connaît que la première :
 *
 *   plein écran du مختبر  → élève ET enseignant, aucune permission
 *   وضع القسم (présentation) → canPresentClassroom(), inchangé
 *
 * Rien ici n'importe `packages/core/auth.js` : donner de la place à un
 * instrument n'est pas présenter à une classe.
 */
const MathLabOverlayContext = createContext(null);

export function MathLabOverlayProvider({ children }) {
  // `null` fermé · PICKER le sélecteur · sinon l'id de l'instrument.
  const [tool, setTool] = useState(null);
  const openerRef = useRef(null);
  // Où poser le calque : dans la racine de la séance s'il y en a une, dans
  // <body> sinon. Résolu à l'OUVERTURE (voir `open`), pas à chaque rendu.
  const [portalTarget, setPortalTarget] = useState(null);

  const open = useCallback((toolId = PICKER) => {
    // L'élément qui avait le focus au moment de l'ouverture : c'est à lui
    // que le focus revient à la fermeture, quand il est encore là.
    openerRef.current = typeof document !== 'undefined' ? document.activeElement : null;
    setPortalTarget(presentationRoot());
    setTool(toolId);
  }, []);

  const close = useCallback(() => {
    setTool(null);
    const opener = openerRef.current;
    openerRef.current = null;
    // Rendre le focus APRÈS le démontage du calque, sinon le navigateur le
    // reprend. Un élément disparu (navigation, re-rendu) ne reçoit rien.
    if (opener && typeof opener.focus === 'function') {
      requestAnimationFrame(() => {
        if (opener.isConnected) opener.focus();
      });
    }
  }, []);

  /** Choisir un instrument DEPUIS le sélecteur : on reste dans le calque. */
  const pick = useCallback((toolId) => setTool(toolId), []);

  /** Revenir au sélecteur depuis un instrument ouvert. */
  const backToPicker = useCallback(() => setTool(PICKER), []);

  const value = useMemo(
    () => ({ tool, isOpen: tool !== null, isPicking: tool === PICKER, open, close, pick, backToPicker }),
    [tool, open, close, pick, backToPicker],
  );

  const overlay = tool !== null ? <MathLabOverlay /> : null;

  return (
    <MathLabOverlayContext.Provider value={value}>
      {children}
      {overlay && portalTarget ? createPortal(overlay, portalTarget) : overlay}
    </MathLabOverlayContext.Provider>
  );
}

export function useMathLabOverlay() {
  const context = useContext(MathLabOverlayContext);
  if (context === null) {
    throw new Error('[mathlab] useMathLabOverlay() hors de MathLabOverlayProvider');
  }

  return context;
}
