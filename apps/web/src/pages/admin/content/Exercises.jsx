import { getAllGrades } from '@smarter-academy/core';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { AdminPage, useAdminLabels, Num } from '../adminUi';
import DataTable from '../../../components/admin/ui/DataTable';
import { FilterBar, SearchInput, SelectFilter, Pagination } from '../../../components/admin/ui/FilterBar';
import { EmptyState } from '../../../components/admin/ui/states';
import PublicationControl from '../../../components/admin/PublicationControl';
import TierControl from '../../../components/admin/TierControl';
import BulkActionBar from '../../../components/admin/BulkActionBar';
import { buildContentBulkActions } from '../../../components/admin/bulkContentActions';
import { CONTENT_NOUNS } from '../../../components/admin/contentNouns';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import { AuthContext } from '../../../context/AuthContext';
import { fetchExercises } from '../../../services/admin/contentService';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { useDebounced } from '../../../hooks/useDebounced';

// Le filtre ne propose que les classes du catalogue ACTIF (activeGrades.js) :
// les classes françaises dormantes ne sont ni listées ni filtrables ici, et
// l'API les exclut de toute façon (ContentService, grades.is_active).
const GRADES = getAllGrades().map((g) => g.id);

export default function AdminExercises() {
  const { t } = useTranslation('admin');
  const L = useAdminLabels();
  useDocumentMeta(t('exercises.metaTitle'));

  const { token } = useContext(AuthContext);

  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState();
  const [level, setLevel] = useState();
  const [status, setStatus] = useState();
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounced(search, 300);

  const loader = useCallback(
    (token) => fetchExercises(token, { search: debouncedSearch, grade, level, status, page }),
    [debouncedSearch, grade, level, status, page],
  );
  const { data, loading, error, reload, setData } = useAdminResource(loader, [loader]);

  const rows = data?.data ?? [];
  const selection = useBulkSelection(rows);

  /**
   * Un exercice a un palier PROPRE, et en plus « hérite de sa leçon » —
   * exactement les trois choix du menu unitaire (voir TierControl), ni un de
   * plus.
   */
  const bulkActions = useMemo(
    () => buildContentBulkActions({
      type: 'exercise',
      token,
      titleOf: (row) => row.title ?? row.exerciseCode,
      withTier: true,
      withTierInherit: true,
    }),
    [token],
  );

  const applyBulkOutcome = (outcome) => {
    const touched = new Set(outcome.applied);
    setData((current) => current && ({
      ...current,
      data: current.data.map((row) => (touched.has(row.id) ? { ...row, ...outcome.patch } : row)),
    }));
  };

  const patchRow = (id, changes) => {
    setData((current) => current && ({
      ...current,
      data: current.data.map((row) => (row.id === id ? { ...row, ...changes } : row)),
    }));
  };

  const resetPage = (setter) => (value) => { setter(value); setPage(1); };

  return (
    <AdminPage
      eyebrow={t('exercises.eyebrow')}
      title={t('exercises.title')}
      subtitle={t('exercises.subtitleLong')}
    >
      <div className="space-y-3">
        <FilterBar>
          <SearchInput
            value={search}
            onChange={resetPage(setSearch)}
            placeholder={t('exercises.searchPlaceholder')}
            label={L.filters.searchLabel}
          />
          <SelectFilter
            label={t('common.grade')} allLabel={t('exercises.allGrades')} value={grade}
            onChange={resetPage(setGrade)}
            options={GRADES.map((g) => ({ value: g, label: g }))}
          />
          <SelectFilter
            label={t('exercises.columnLevel')} allLabel={t('exercises.allLevels')} value={level}
            onChange={resetPage(setLevel)}
            options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: t('exercises.levelN', { level: n }) }))}
          />
          <SelectFilter
            label={t('exercises.columnPublication')} allLabel={t('exercises.allStates')} value={status}
            onChange={resetPage(setStatus)}
            options={[
              { value: 'published', label: t('status.published') },
              { value: 'hidden', label: t('status.hidden') },
              { value: 'draft', label: t('status.draft') },
              { value: 'archived', label: t('status.archived') },
            ]}
          />
        </FilterBar>

        <BulkActionBar
          count={selection.count}
          noun={CONTENT_NOUNS.exercise}
          actions={bulkActions}
          selectedRows={selection.selectedRows}
          onClear={selection.clear}
          onSelectAllVisible={selection.toggleAll}
          allSelected={selection.allSelected}
          visibleCount={selection.visibleCount}
          onDone={applyBulkOutcome}
        />

        <DataTable
          selection={selection}
          selectionLabel={(row) => L.selectRow(row.title ?? row.exerciseCode)}
          labels={L.table}
          columns={[
            {
              key: 'exerciseCode',
              label: t('exercises.columnExercise'),
              cellClassName: 'min-w-[240px]',
              render: (row) => (
                <div>
                  <span className="font-semibold text-slate-900">{row.title ?? row.exerciseCode}</span>
                  {/* L'identifiant d'exercice est technique : latin, et LTR. */}
                  <span dir="ltr" className="block font-mono-jetbrains text-xs text-slate-400 text-start">{row.exerciseCode}</span>
                </div>
              ),
            },
            {
              key: 'lesson',
              label: t('exercises.columnLesson'),
              cellClassName: 'min-w-[180px]',
              render: (row) => (
                <Link
                  to={`/admin/contenu/lecons/${encodeURIComponent(row.lessonCode)}`}
                  className="hover:underline"
                >
                  {row.lessonTitle ?? row.lessonCode}
                </Link>
              ),
            },
            { key: 'grade', label: t('common.grade'), render: (row) => row.grade ?? t('common.dash') },
            { key: 'level', label: t('exercises.columnLevel'), render: (row) => <Num>{row.level}</Num> },
            {
              key: 'questionCount',
              label: t('exercises.columnQuestions'),
              render: (row) => (row.questionCount != null
                ? <Num>{row.questionCount}</Num>
                : t('common.dash')),
            },
            {
              key: 'tier',
              label: t('exercises.columnTier'),
              cellClassName: 'min-w-[210px]',
              render: (row) => (
                <TierControl
                  type="exercise"
                  id={row.id}
                  tier={row.tier}
                  lessonTier={row.lessonTier}
                  onChanged={(next) => patchRow(row.id, { tier: next })}
                  compact
                />
              ),
            },
            {
              key: 'publicationStatus',
              label: t('exercises.columnPublication'),
              render: (row) => (
                <PublicationControl
                  type="exercise"
                  id={row.id}
                  status={row.publicationStatus}
                  onChanged={(next) => patchRow(row.id, { publicationStatus: next })}
                  compact
                />
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          error={error}
          onRetry={reload}
          empty={(
            <EmptyState
              icon={Dumbbell}
              title={t('exercises.emptyTitle')}
              hint={t('exercises.emptyEngineHint')}
            />
          )}
        />

        <Pagination meta={data} onPage={setPage} labels={L.pagination} />
      </div>
    </AdminPage>
  );
}
