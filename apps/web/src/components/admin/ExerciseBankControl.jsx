import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { changeLessonExercisesStatus } from '../../services/admin/contentService';
import StatusBadge from './ui/StatusBadge';
import { ConfirmDialog } from './ui/Modal';

const STATUSES = ['published', 'hidden', 'draft', 'archived'];

/**
 * L'état de TOUTE la banque d'exercices d'une leçon, d'un seul geste.
 *
 * Résume la banque (combien d'exercices dans chaque état), puis applique un
 * état à tous ses exercices en registre. Chaque exercice reste ensuite
 * modifiable seul dans le tableau — publier la banque puis masquer UN
 * exercice est le geste attendu. Le serveur traite chaque exercice comme à
 * l'unité (validation, journal) : `onChanged` relit la leçon.
 *
 * @param {{ id: number, exercises?: Array<{ publicationStatus: string }> }} lesson
 */
export default function ExerciseBankControl({ lesson, onChanged }) {
  const { t } = useTranslation('admin');
  const { token } = useContext(AuthContext);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Les exercices retirés du registre ne suivent pas (le serveur les écarte).
  const exercises = (lesson.exercises ?? []).filter((e) => !e.retiredAt);
  if (exercises.length === 0) return null;

  const counts = STATUSES
    .map((status) => [status, exercises.filter((e) => e.publicationStatus === status).length])
    .filter(([, n]) => n > 0);

  const apply = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await changeLessonExercisesStatus(token, lesson.id, pending);
      if (result.failed?.length) setError(t('exerciseBank.failed', { count: result.failed.length }));
      onChanged?.(result);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-inter text-xs text-slate-500">{t('exerciseBank.label')}</span>
      {counts.map(([status, n]) => (
        <span key={status} className="inline-flex items-center gap-1">
          <StatusBadge status={status} /><span className="font-inter text-xs text-slate-600" dir="ltr">{n}</span>
        </span>
      ))}
      <select
        aria-label={t('exerciseBank.changeLabel')}
        value=""
        disabled={busy}
        onChange={(event) => { if (event.target.value) setPending(event.target.value); }}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 font-inter text-xs text-slate-700 disabled:opacity-50"
      >
        <option value="">{t('exerciseBank.changePlaceholder')}</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>{t(`exerciseBank.action.${status}`)}</option>
        ))}
      </select>
      {error && <span className="font-inter text-xs text-rose-600">{error}</span>}

      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={apply}
        busy={busy}
        tone={pending === 'published' ? 'default' : 'danger'}
        title={t('exerciseBank.confirmTitle')}
        confirmLabel={pending ? t(`exerciseBank.action.${pending}`) : ''}
        message={(
          <>
            <p>{t('exerciseBank.confirmMessage', { count: exercises.length, status: pending ? t(`status.${pending}`) : '' })}</p>
            <p className="mt-2">{t('exerciseBank.confirmHint')}</p>
          </>
        )}
      />
    </div>
  );
}
