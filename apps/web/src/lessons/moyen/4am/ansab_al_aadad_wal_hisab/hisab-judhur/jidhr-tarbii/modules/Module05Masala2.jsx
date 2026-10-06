import React from 'react';
import { GuidedProblem } from '../../../../../../common/problems';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PROBLEM } from '../content/problems';

/**
 * Module 5 — مسألة 2 (معرض الصور : le côté d'un carré depuis son aire,
 * l'erreur 0,3 / 0,9, le cadre en aluminium des bords).
 * Exercice complet de type امتحان, résolu pas à pas (GuidedProblem) ; formatif,
 * aucune preuve de maîtrise. Donnée : content/problems.js. Pas de
 * KnowledgeSnapshot ici (décision du propriétaire, 2026-10-05).
 */
export default function Module05Masala2() {
  return (
    <GuidedProblem
      ctx={MODULE_CTX}
      navLinks={getNavLinks(5)}
      moduleNumber={5}
      problem={PROBLEM['masala-2']}
      estimatedTime="8 دقائق"
    />
  );
}
