import React from 'react';
import { GuidedProblem } from '../../../../../../common/problems';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PROBLEM } from '../content/problems';

/**
 * Module 7 — مسألة 3 (تبليط قاعة, 585 et 405 : choix de l'algorithme, carreau le plus grand, prix).
 * Exercice complet de type امتحان, résolu pas à pas (GuidedProblem) ; formatif,
 * aucune preuve de maîtrise. Donnée : content/problems.js. Pas de
 * KnowledgeSnapshot ici (décision du propriétaire, 2026-10-05) : la مسألة
 * se termine sur sa rédaction. 6 min (leçon déjà à 71 min, plafond 90).
 */
export default function Module07Masala3() {
  return (
    <GuidedProblem
      ctx={MODULE_CTX}
      navLinks={getNavLinks(7)}
      moduleNumber={7}
      problem={PROBLEM['masala-3']}
      estimatedTime="6 دقائق"
    />
  );
}
