import React, { useLayoutEffect, useRef, useState } from 'react';

/** Jamais plus petit : sous ce facteur la formule devient illisible. */
export const MIN_FIT = 0.55;

/** Le facteur qui fait tenir une ligne de largeur naturelle `natural` dans `room` (≤ 1, ≥ MIN_FIT, arrondi au centième inférieur). */
export function fitScale(natural, room, min = MIN_FIT) {
  if (!(natural > 0) || !(room > 0) || natural <= room) return 1;
  return Math.max(min, Math.floor((room / natural) * 100) / 100);
}

/**
 * FitLine — UNE ligne qui ne se coupe jamais : si elle est plus large que son cadre, sa taille de police baisse juste assez pour
 * qu'elle y tienne (KaTeX suit la taille de police, la formule reste nette). Né d'un défaut vu par le propriétaire (2026-11-09) : la
 * règle « d∣a ∧ d∣b ⟺ d∣PGCD(a ; b) » d'une carte mémo était centrée dans un cadre trop étroit, coupée des DEUX côtés, avec une barre
 * de défilement. Mesures en pixels de mise en page (clientWidth / scrollWidth) : juste aussi sous le `zoom` du lecteur de mission.
 * (Le pendant vertical, pour un écran entier, est `mission/FitToArea.jsx`.)
 *
 * Usage : `<FitLine className="text-2xl" dir="ltr"><MathText>{…}</MathText></FitLine>` dans un cadre de largeur donnée.
 */
export default function FitLine({ children, className = '', dir, ...rest }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(1);
  const measure = () => {
    const o = outer.current; const i = inner.current;
    if (!o || !i) return;
    // largeur naturelle = largeur actuelle ramenée à l'échelle 1
    const natural = i.scrollWidth / scale;
    const next = fitScale(natural, o.clientWidth);
    setScale((s) => (Math.abs(s - next) < 0.01 ? s : next));
  };
  useLayoutEffect(measure);
  useLayoutEffect(() => {
    const o = outer.current;
    if (!o || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(o);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span ref={outer} className={`block min-w-0 max-w-full overflow-hidden ${className}`} dir={dir} data-fit-line={scale < 1 ? String(scale) : undefined} {...rest}>
      <span ref={inner} className="inline-block whitespace-nowrap" style={scale < 1 ? { fontSize: `${scale}em` } : undefined}>{children}</span>
    </span>
  );
}
