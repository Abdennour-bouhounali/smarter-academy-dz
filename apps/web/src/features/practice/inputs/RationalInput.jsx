import { useTranslation } from 'react-i18next';
import AnswerField from './AnswerField';

/**
 * Un nombre : entier, décimal à la virgule, ou fraction. `Rational.parse`
 * (packages/core/practice) accepte les trois, plus le vrai moins
 * typographique et l'espace fine des milliers.
 */
export default function RationalInput({ question, value, onChange, disabled }) {
  const { t } = useTranslation('student');
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <AnswerField
        value={value?.value ?? ''}
        onChange={(v) => onChange({ value: v })}
        ariaLabel={question.answerFormat || t('practice.field.answer')}
        placeholder={question.answerFormat}
        width="min-w-[10rem]"
        disabled={disabled}
      />
      {question.answerFormat && (
        <span className="text-sm text-slate-500 font-mono">{question.answerFormat}</span>
      )}
    </div>
  );
}
