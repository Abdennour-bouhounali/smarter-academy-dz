import React from 'react';
import { GuidedProblem } from '../../../../../../common/problems';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PROBLEM } from '../content/problems';

/**
 * Module 6 — مسألة 2 (التعاونية الحليبية, 1170 et 702 : Euclide, nombre de caisses pour les cantines, valeur d'une caisse).
 * Exercice complet de type امتحان, résolu pas à pas (GuidedProblem) ; formatif,
 * aucune preuve de maîtrise. Donnée : content/problems.js. Pas de
 * KnowledgeSnapshot ici (décision du propriétaire, 2026-10-05) : la مسألة
 * se termine sur sa rédaction. 6 min (leçon déjà à 71 min, plafond 90).
 */
export default function Module06Masala2() {
  return (
    <GuidedProblem
      ctx={MODULE_CTX}
      navLinks={getNavLinks(6)}
      moduleNumber={6}
      problem={PROBLEM['masala-2']}
      estimatedTime="6 دقائق"
    />
  );
}
