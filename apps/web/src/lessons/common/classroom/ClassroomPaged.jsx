import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useClassroomMode } from './ClassroomContext';
import { pageBudget, planPages, clampPage } from './classroomPages';

/**
 * Le DÉCOUPAGE EN PAGES d'une unité présentée (étape, khulasa).
 *
 *   <ClassroomPaged active={estLUniteCourante} page={n} onPages={(count) => …}>
 *     {contenu de leçon inchangé}
 *   </ClassroomPaged>
 *
 * Quand le contenu d'une unité réclame plus de hauteur que la zone offerte
 * (il faudrait le réduire de plus de 10 %), ses BLOCS — les enfants directs
 * du contenu (une carte de connaissance, une question…) — sont répartis en
 * pages (classroomPages.js). La page courante est montrée, les autres portent
 * `data-classroom-page-hidden` (display: none). L'en-tête de l'étape reste :
 * il est hors de ce wrapper.
 *
 * RIEN N'EST RETIRÉ DE L'ARBRE : les blocs cachés restent montés, avec leur
 * état (réponse donnée, rayon posé). Ce composant ne touche qu'à un attribut
 * du DOM, jamais au rendu React du contenu. Hors présentation il rend un
 * simple <div> et n'observe rien.
 *
 * Le plan est recalculé quand la zone ou l'échelle choisie changent, ou quand
 * l'unité devient courante — jamais quand l'ajustement automatique bouge
 * (les hauteurs sont ramenées à l'échelle 1, voir classroomPages.js). Un bloc
 * qui apparaît ensuite (un résultat) rejoint la page courante : il ne se
 * cache pas derrière un « التالي ».
 */
const HIDDEN = 'data-classroom-page-hidden';
const REPLAN_AFTER_MS = 250;

/** Les blocs : les enfants du contenu, en descendant dans un unique <div> d'emballage. */
function resolveBlocks(root) {
  let host = root;
  for (let depth = 0; depth < 2; depth += 1) {
    const kids = host.children;
    if (kids.length === 1 && kids[0].tagName === 'DIV' && kids[0].children.length > 1) host = kids[0];
    else break;
  }
  return { host, blocks: Array.from(host.children) };
}

export default function ClassroomPaged({ active = true, page = 0, onPages, className = '', children }) {
  const { isClassroomMode, scale, userScale, area } = useClassroomMode();
  const running = isClassroomMode && active;
  const ref = useRef(null);
  const state = useRef({ host: null, blocks: [], pages: [[]], page: 0 });
  const onPagesRef = useRef(onPages);
  onPagesRef.current = onPages;
  const pageRef = useRef(page);
  pageRef.current = page;
  const geometry = useRef({ scale, userScale, areaHeight: area.height });
  geometry.current = { scale, userScale, areaHeight: area.height };

  const apply = useCallback((pageIndex) => {
    const s = state.current;
    const shown = new Set(s.pages[clampPage(pageIndex, s.pages.length)] ?? []);
    s.blocks.forEach((el, i) => {
      if (shown.has(i)) el.removeAttribute(HIDDEN);
      else el.setAttribute(HIDDEN, '');
      el.setAttribute('data-classroom-page-of', String(s.pages.findIndex((p) => p.includes(i)) + 1));
    });
  }, []);

  const clear = useCallback(() => {
    state.current.blocks.forEach((el) => { el.removeAttribute(HIDDEN); el.removeAttribute('data-classroom-page-of'); });
  }, []);

  const plan = useCallback(() => {
    const root = ref.current;
    if (!root) return;
    const { host, blocks } = resolveBlocks(root);
    const s = state.current;
    // Les blocs d'un plan précédent (structure changée) ne doivent rien garder caché.
    clear();
    s.host = host;
    s.blocks = blocks;
    const { scale: sc, userScale: us, areaHeight } = geometry.current;
    const frame = root.closest('[data-classroom-frame]') || root;
    const hostBox = host.getBoundingClientRect();
    if (!hostBox.height || sc <= 0) {
      s.pages = [blocks.map((_, i) => i)];
    } else {
      // Tout visible (clear), mesuré, puis on masque : même tâche, aucune image peinte entre.
      const heights = blocks.map((el) => el.getBoundingClientRect().height / sc);
      const sum = heights.reduce((a, h) => a + h, 0);
      const gap = blocks.length > 1 ? Math.max(0, (hostBox.height / sc - sum) / (blocks.length - 1)) : 0;
      const overhead = Math.max(0, (frame.getBoundingClientRect().height - hostBox.height) / sc);
      s.pages = planPages({ heights, budget: pageBudget({ areaHeight, userScale: us }), overhead, gap });
    }
    apply(pageRef.current);
    onPagesRef.current?.(s.pages.length);
  }, [apply, clear]);

  // Planifier : l'unité devient courante, ou la zone / l'échelle choisie changent.
  useLayoutEffect(() => {
    if (!running) return undefined;
    plan();
    // Une seconde fois, la mise en page posée (polices, KaTeX, ajustement).
    const t = setTimeout(plan, REPLAN_AFTER_MS);
    return () => clearTimeout(t);
  }, [running, area.width, area.height, userScale, plan]);

  // Changer de page : un attribut, rien d'autre.
  useLayoutEffect(() => {
    if (!running) return;
    const s = state.current;
    const clamped = clampPage(page, s.pages.length);
    apply(clamped);
    if (clamped !== page) onPagesRef.current?.(s.pages.length);
  }, [running, page, apply]);

  // Un bloc nouveau (résultat, indice) rejoint la page courante.
  useEffect(() => {
    if (!running || !ref.current || typeof MutationObserver === 'undefined') return undefined;
    const mo = new MutationObserver((records) => {
      const s = state.current;
      const known = new Set(s.blocks);
      const added = [];
      for (const r of records) {
        if (r.target !== s.host) continue;
        r.addedNodes.forEach((n) => { if (n.nodeType === 1 && !known.has(n)) added.push(n); });
      }
      if (!added.length) return;
      const current = clampPage(pageRef.current, s.pages.length);
      for (const el of added) {
        s.blocks.push(el);
        const idx = s.blocks.length - 1;
        (s.pages[current] ??= []).push(idx);
        el.removeAttribute(HIDDEN);
        el.setAttribute('data-classroom-page-of', String(current + 1));
      }
    });
    mo.observe(ref.current, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [running]);

  // Sortie de présentation (ou unité qui n'est plus courante) : tout redevient visible.
  useEffect(() => {
    if (running) return undefined;
    clear();
    state.current = { host: null, blocks: [], pages: [[]], page: 0 };
    return undefined;
  }, [running, clear]);

  return (
    <div ref={ref} className={className} data-classroom-paged={running ? '' : undefined}>
      {children}
    </div>
  );
}
