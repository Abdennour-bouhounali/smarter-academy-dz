import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * useDragInteraction — le GESTE « prendre un objet, le porter, le poser »,
 * pour toutes les manipulations. Héritier de manip6e/useDragDrop (même
 * contrat d'accessibilité), avec ce que des laboratoires tactiles exigent :
 *
 *   SEUIL       un appui sans mouvement (< 6 px) est un TAP, pas un glisser :
 *               il prend/repose l'objet (chemin clavier, lecteur d'écran,
 *               souris hésitante). Au-delà, l'objet suit le pointeur.
 *   AIMANT      pendant le geste, la zone valide la plus proche dans un rayon
 *               (`magnetRadius`) est « attirée » : elle s'allume (`data-drop-
 *               active`) et le relâchement y pose l'objet même s'il est à côté.
 *   REFUS       `accepts(sourceId, zoneId)` peut refuser ; l'objet revient
 *               doucement (`rejected` porte l'id une courte durée, la vue
 *               joue une secousse discrète) et `onReject` reçoit la raison,
 *               que la manipulation EXPLIQUE en arabe — jamais un rouge muet.
 *   DÉFILEMENT  `touch-action: none` sur la source + capture du pointeur :
 *               le doigt qui porte un objet ne fait pas défiler la page.
 *   ALTERNATIVE sélectionner (tap / Entrée) puis activer une zone (tap /
 *               Entrée) fait la même chose que glisser. Toujours disponible.
 *
 * Le hook ne dessine rien : `DraggableObject` et `DropZone` (primitives)
 * posent `sourceProps` / `zoneProps` ; un type peut aussi les poser lui-même.
 *
 * @param {(sourceId:string, zoneId:string) => void} onDrop
 * @param {(sourceId:string, zoneId:string) => (true|string)} [accepts]
 *        true = accepté ; une chaîne = refusé, avec la raison (clé/texte)
 * @param {(sourceId:string, zoneId:string, reason:string) => void} [onReject]
 * @param {number} [magnetRadius=56] rayon d'attraction (px) autour du pointeur
 */
export default function useDragInteraction({ onDrop, accepts, onReject, magnetRadius = 56 } = {}) {
  const [held, setHeld] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [hoverZone, setHoverZone] = useState(null);
  const [ghost, setGhost] = useState(null);
  const [rejected, setRejected] = useState(null);
  const start = useRef(null);
  const moved = useRef(false);
  const justPointered = useRef(false);
  // L'objet dont le geste de pointeur vient de se terminer. Voir `bubbledFrom`.
  const lastGestureNode = useRef(null);
  const rejectTimer = useRef(null);

  useEffect(() => () => { if (rejectTimer.current) clearTimeout(rejectTimer.current); }, []);

  /**
   * Ce `click` de zone n'est-il que la PROPAGATION du geste qu'on vient de
   * terminer sur un objet situé à l'intérieur d'elle ?
   *
   * Un tap sur un objet posé DANS une zone produit : pointerup (l'objet est
   * pris) → click sur l'objet → click sur la zone, par propagation. Sans ce
   * garde-fou, la zone reposerait aussitôt l'objet qu'on vient de prendre.
   *
   * On ne peut pas trancher par un DÉLAI : deux taps rapides (prendre ici,
   * poser là) sont parfaitement légitimes. On regarde donc si la zone
   * CONTIENT l'objet dont le geste vient de finir — auquel cas c'est le même
   * geste, et il ne se repose pas sur place.
   */
  const bubbledFrom = (zoneEl) => {
    const node = lastGestureNode.current;
    lastGestureNode.current = null;
    return !!node && !!zoneEl && zoneEl.contains(node);
  };

  /** La zone sous le pointeur, sinon la plus proche dans le rayon de l'aimant. */
  const zoneAt = useCallback((x, y) => {
    if (typeof document === 'undefined') return null;
    const under = document.elementFromPoint(x, y)?.closest?.('[data-drop-zone]');
    if (under) return under.getAttribute('data-drop-zone');
    let best = null; let bestD = magnetRadius;
    for (const el of document.querySelectorAll('[data-drop-zone]')) {
      const r = el.getBoundingClientRect();
      const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
      const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
      const d = Math.hypot(dx, dy);
      if (d < bestD) { bestD = d; best = el.getAttribute('data-drop-zone'); }
    }
    return best;
  }, [magnetRadius]);

  const tryDrop = useCallback((sourceId, zoneId) => {
    if (!sourceId || !zoneId) return false;
    const verdict = accepts ? accepts(sourceId, zoneId) : true;
    if (verdict !== true) {
      setRejected(sourceId);
      if (rejectTimer.current) clearTimeout(rejectTimer.current);
      rejectTimer.current = setTimeout(() => setRejected(null), 500);
      onReject?.(sourceId, zoneId, typeof verdict === 'string' ? verdict : '');
      return false;
    }
    onDrop?.(sourceId, zoneId);
    return true;
  }, [accepts, onDrop, onReject]);

  const endGesture = useCallback(() => {
    start.current = null;
    setDragging(false);
    setGhost(null);
    setHoverZone(null);
  }, []);

  /** À poser sur l'objet SAISISSABLE. */
  const sourceProps = useCallback((id, { disabled = false } = {}) => ({
    'data-drag-source': id,
    'data-drag-held': held === id ? 'true' : undefined,
    'data-drag-rejected': rejected === id ? 'true' : undefined,
    'aria-pressed': held === id,
    'aria-disabled': disabled || undefined,
    onPointerDown: (e) => {
      if (disabled || e.button > 0) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      start.current = { x: e.clientX, y: e.clientY, id };
      moved.current = false;
    },
    onPointerMove: (e) => {
      if (!start.current || start.current.id !== id) return;
      const dx = e.clientX - start.current.x; const dy = e.clientY - start.current.y;
      if (!moved.current && Math.hypot(dx, dy) < 6) return;
      if (!moved.current) { moved.current = true; setHeld(id); setDragging(true); }
      setGhost({ x: e.clientX, y: e.clientY });
      setHoverZone(zoneAt(e.clientX, e.clientY));
    },
    onPointerUp: (e) => {
      if (!start.current || start.current.id !== id) return;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      justPointered.current = true;
      lastGestureNode.current = e.currentTarget;
      if (moved.current) {
        const zone = zoneAt(e.clientX, e.clientY);
        endGesture();
        // Un glisser qui finit hors zone laisse l'objet EN MAIN : le chemin
        // « puis toucher la zone » prend le relais sans recommencer.
        if (zone && tryDrop(id, zone)) setHeld(null);
        return;
      }
      endGesture();
      // Tap : prendre / reposer.
      setHeld((cur) => (cur === id ? null : id));
    },
    onPointerCancel: () => { endGesture(); justPointered.current = true; },
    onKeyDown: (e) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHeld((cur) => (cur === id ? null : id)); }
      if (e.key === 'Escape') setHeld(null);
    },
    onClick: (e) => {
      // Le `click` synthétique qui suit un pointerup ne doit rien rebasculer.
      if (justPointered.current) { justPointered.current = false; e.preventDefault(); return; }
    },
    style: { touchAction: 'none', cursor: disabled ? 'default' : held === id ? 'grabbing' : 'grab', userSelect: 'none', WebkitUserSelect: 'none' },
  }), [held, rejected, zoneAt, tryDrop, endGesture]);

  /** À poser sur la ZONE d'accueil. */
  const zoneProps = useCallback((id, { disabled = false } = {}) => ({
    'data-drop-zone': id,
    'data-drop-active': hoverZone === id ? 'true' : undefined,
    'data-drop-ready': held && !dragging && !disabled ? 'true' : undefined,
    onClick: (e) => {
      // Le click qui remonte du geste terminé sur un objet DE CETTE ZONE est
      // le même geste : il ne repose pas ce qu'on vient de prendre.
      if (bubbledFrom(e.currentTarget)) return;
      if (!disabled && held) { if (tryDrop(held, id)) setHeld(null); }
    },
    onKeyDown: (e) => {
      if (disabled || !held) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (tryDrop(held, id)) setHeld(null); }
    },
  }), [hoverZone, held, dragging, tryDrop]);

  const release = useCallback(() => setHeld(null), []);
  const dropHere = useCallback((zoneId) => { if (held && tryDrop(held, zoneId)) setHeld(null); }, [held, tryDrop]);

  return useMemo(() => ({ held, dragging, hoverZone, ghost, rejected, sourceProps, zoneProps, release, dropHere }),
    [held, dragging, hoverZone, ghost, rejected, sourceProps, zoneProps, release, dropHere]);
}
