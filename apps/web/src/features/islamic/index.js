// « القيم الإسلامية » — la couche de valeurs, en une seule entrée.
// Doc : docs/architecture/ISLAMIC_VALUES.md. Le registre de contenus n'est
// PAS exporté ici : il se charge à la demande (loadIslamicContent).
export { CONTENT_TYPES, AUDIENCES, THEMES, CONTEXTS, CONTEXT_THEMES } from './islamicThemes.js';
export { selectIslamicContent, audienceForUser, isEligible } from './islamicSelector.js';
export { MOMENT_POLICY, planMoment, recordShown } from './islamicFrequency.js';
export { useIslamicMoment, loadIslamicContent } from './useIslamicMoment.js';
export { default as IslamicGreeting, useIslamicGreeting } from './IslamicGreeting.jsx';
export { default as IslamicContentRenderer } from './IslamicContentRenderer.jsx';
export { default as IslamicContentCard } from './IslamicContentCard.jsx';
export { default as IslamicBreak } from './IslamicBreak.jsx';
export { default as IslamicMoment } from './IslamicMoment.jsx';
export { default as MushafVerse, AyahMarker } from './MushafVerse.jsx';
