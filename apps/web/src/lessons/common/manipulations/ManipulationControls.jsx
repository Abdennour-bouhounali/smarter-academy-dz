import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Lightbulb, BookOpen, CheckCircle2 } from 'lucide-react';
import { Btn } from './ManipulationTeacherMode';
import ManipulationAutoComplete from './ManipulationAutoComplete';

/**
 * Les contrôles de l'ÉLÈVE : « إعادة », « تلميح » (progressif, compte
 * affiché), « تحقّق » quand le type propose une vérification explicite, et
 * « الشرح » — qui n'apparaît qu'APRÈS la découverte (ou en mode classe) :
 * il redit la règle, il ne doit jamais la donner avant le geste (audit du
 * 2026-09-29 : il l'imprimait dès l'ouverture). L'élève AVANCE en manipulant, jamais avec un bouton « suivant » :
 * celui-là n'existe qu'en mode classe (ManipulationTeacherMode).
 *
 * « Compléter automatiquement » (`ManipulationAutoComplete`) s'ajoute à la
 * rangée seulement si le registre l'accorde au type (`controls.autoComplete`)
 * et que le type en fournit la mécanique (`controller.autoComplete`). Ce n'est
 * pas un « suivant » : il finit un geste RÉPÉTITIF, l'élève garde la main.
 */
export default function ManipulationControls({ state, controls = {}, hints = [], onCheck, checkDisabled = false, autoComplete }) {
  const { t } = useTranslation('lesson');
  return (
    <div className="flex flex-wrap items-center gap-2" data-manipulation-controls>
      {controls.reset !== false && (
        <Btn onClick={state.reset} ariaLabel={t('manipulation.reset')}><RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('manipulation.reset')}</Btn>
      )}
      {hints.length > 0 && (
        <Btn onClick={state.requestHint} disabled={state.hintLevel >= hints.length} ariaLabel={t('manipulation.hint.button')}>
          <Lightbulb className="h-4 w-4" aria-hidden="true" /> {t('manipulation.hint.button')} <span dir="ltr" className="font-mono text-xs opacity-80">{Math.min(state.hintLevel, hints.length)}/{hints.length}</span>
        </Btn>
      )}
      <ManipulationAutoComplete capability={controls.autoComplete} auto={autoComplete} resetKey={state.epoch} />
      {onCheck && (
        <Btn tone="blue" onClick={onCheck} disabled={checkDisabled}><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {t('manipulation.check')}</Btn>
      )}
      {controls.toggleExplanation !== false && (state.isDiscovered || state.isClass) && (
        <Btn onClick={state.toggleExplanation} pressed={state.showExplanation}>
          <BookOpen className="h-4 w-4" aria-hidden="true" /> {state.showExplanation ? t('manipulation.hideExplanation') : t('manipulation.showExplanation')}
        </Btn>
      )}
    </div>
  );
}
