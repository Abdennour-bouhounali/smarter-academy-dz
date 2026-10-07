import { useIslamicMoment } from './useIslamicMoment';
import IslamicContentCard from './IslamicContentCard';
import IslamicBreak from './IslamicBreak';

/**
 * Le point d'intégration d'une page : « ici, à ce moment, un rappel peut
 * paraître ». La page ne choisit ni le texte ni la fréquence — seulement le
 * moment et la forme.
 *
 *   <IslamicMoment context="home" compact />
 *   <IslamicMoment context="study_break" variant="break" only="student" onContinue={next} />
 */
export default function IslamicMoment({
  context, themes, only, enabled = true, variant = 'card', compact = false, maxTextLength, onContinue, className, title,
}) {
  const item = useIslamicMoment({
    context, themes, only, enabled,
    maxTextLength: maxTextLength ?? (compact ? COMPACT_MAX_TEXT : Infinity),
  });
  if (!item) return null;
  if (variant === 'break') return <IslamicBreak item={item} onContinue={onContinue} className={className} />;
  return <IslamicContentCard item={item} compact={compact} title={title} className={className} />;
}

/** Un texte « court » : une ou deux lignes sur un téléphone. */
export const COMPACT_MAX_TEXT = 90;
