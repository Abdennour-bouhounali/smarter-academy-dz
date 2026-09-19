import { useTranslation } from 'react-i18next';
import AnswerField from './AnswerField';

/** Un couple de coordonnées. */
export default function PointInput({ value, onChange, disabled }) {
  const { t } = useTranslation('student');
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-lg text-slate-500">(</span>
      <AnswerField value={value?.x ?? ''} onChange={(x) => onChange({ ...value, x })} ariaLabel={t('practice.field.abscissa')} width="min-w-[5.5rem]" disabled={disabled} />
      <span className="font-mono text-lg text-slate-500">;</span>
      <AnswerField value={value?.y ?? ''} onChange={(y) => onChange({ ...value, y })} ariaLabel={t('practice.field.ordinate')} width="min-w-[5.5rem]" disabled={disabled} />
      <span className="font-mono text-lg text-slate-500">)</span>
    </div>
  );
}
