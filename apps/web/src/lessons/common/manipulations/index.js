export { default as Manipulation } from './Manipulation';
export { default as ManipulationShell } from './ManipulationShell';
// LE WORKSPACE À DEUX NIVEAUX — un atelier, un sélecteur مبتدئ/متقدم, jamais
// deux pages. Voir docs/architecture/MANIPULATION_CONTRACT.md §7bis-levels.
export { default as ManipulationWorkspace } from './ManipulationWorkspace';
export { default as ManipulationLevelSelector } from './ManipulationLevelSelector';
export { default as ManipulationStage } from './ManipulationStage';
export { default as ManipulationDiscovery } from './ManipulationDiscovery';
export { useManipulation, plausibleChoices } from './useManipulation';
export { useStepSequence } from './useStepSequence';
export { default as useDragInteraction } from './useDragInteraction';
export { LEVELS, levelsFor, levelMatching } from './levels';
export { MANIPULATION_COMPONENTS } from './manipulationRegistry';
