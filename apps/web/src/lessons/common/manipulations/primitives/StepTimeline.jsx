import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Les étapes d'un algorithme, révélées une à une. `renderStep(step, index,
 * { isCurrent, isLast })` rend une ligne ; les étapes non révélées ne sont
 * pas dessinées (pas de « fantôme » : l'élève ne doit pas compter d'avance
 * combien il en reste — c'est une observation qu'il fera lui-même).
 */
export default function StepTimeline({ steps, revealed, renderStep, footer }) {
  const reduce = useReducedMotion();
  const shown = steps.slice(0, revealed);
  return (
    <ol className="space-y-2" aria-live="polite">
      {shown.map((step, i) => (
        <motion.li
          key={i}
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep(step, i, { isCurrent: i === shown.length - 1, isLast: i === steps.length - 1 })}
        </motion.li>
      ))}
      {footer && shown.length === steps.length && steps.length > 0 && <li>{footer}</li>}
    </ol>
  );
}
