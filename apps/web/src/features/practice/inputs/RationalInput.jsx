import { useTranslation } from 'react-i18next';
import AnswerField from './AnswerField';
import { LazyExamMathField } from '../exam/math/lazy';

/**
 * MathLive rend l'ASCII-math (« 7/9 », « (7)/(9) », « 12{,}5 ») : on le ramène à
 * l'écriture que lit Rational.parse — sans parenthèses autour d'un nombre, la
 * virgule décimale, sans espaces.
 */
export function asciiToAnswer(ascii) {
  return String(ascii ?? '')
    .replace(/\{,\}/g, ',')
    .replace(/\s+/g, '')
    .replace(/\((-?\d+(?:[.,]\d+)?)\)/g, '$1');
}

/**
 * Un nombre : entier, décimal à la virgule, ou fraction. `Rational.parse`
 * (packages/core/practice) accepte les trois, plus le vrai moins
 * typographique et l'espace fine des milliers.
 */
export default function RationalInput({ question, value, onChange, disabled, exam = false }) {
  const { t } = useTranslation('student');
  // Feuille d'examen : un champ MathLive (formule LTR, vraie fraction, clavier
  // virtuel). La valeur envoyée reste l'écriture lue par l'évaluateur.
  if (exam) {
    return (
      <div
        className="flex cursor-text items-center gap-3"
        data-answer-box
        onMouseUp={(e) => { const f = e.currentTarget.querySelector('math-field'); if (f && document.activeElement !== f) f.focus(); }}
      >
        <LazyExamMathField
          key={question.id}
          value={value?.latex ?? value?.value ?? ''}
          onChange={(latex, ascii) => onChange(latex.trim() ? { value: asciiToAnswer(ascii), latex } : null)}
          disabled={disabled}
          ariaLabel={question.answerFormat || t('practice.field.answer')}
          placeholder={question.answerFormat ? `\\text{${question.answerFormat}}` : ''}
          className="w-full"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 flex-wrap" data-answer-box>
      <AnswerField
        value={value?.value ?? ''}
        onChange={(v) => onChange({ value: v })}
        ariaLabel={question.answerFormat || t('practice.field.answer')}
        placeholder={question.answerFormat}
        width="min-w-[10rem]"
        disabled={disabled}
      />
      {question.answerFormat && (
        <span className="text-sm text-slate-500 font-mono" data-answer-format>{question.answerFormat}</span>
      )}
    </div>
  );
}
