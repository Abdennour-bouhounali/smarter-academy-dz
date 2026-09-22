import { getAllGrades } from '@smarter-academy/core';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { AdminPage, useAdminLabels, Num } from '../adminUi';
import DataTable from '../../../components/admin/ui/DataTable';
import { FilterBar, SearchInput, SelectFilter, Pagination } from '../../../components/admin/ui/FilterBar';
import { EmptyState } from '../../../components/admin/ui/states';
import PublicationControl from '../../../components/admin/PublicationControl';
import BulkActionBar from '../../../components/admin/BulkActionBar';
import { buildContentBulkActions } from '../../../components/admin/bulkContentActions';
import { CONTENT_NOUNS } from '../../../components/admin/contentNouns';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import { AuthContext } from '../../../context/AuthContext';
import { fetchModules } from '../../../services/admin/contentService';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { useDebounced } from '../../../hooks/useDebounced';

// Le filtre ne propose que les classes du catalogue ACTIF (activeGrades.js) :
// les classes françaises dormantes ne sont ni listées ni filtrables ici, et
// l'API les exclut de toute façon (ContentService, grades.is_active).
const GRADES = getAllGrades().map((g) => g.id);

/**
 * Les étapes du parcours, dans leur ordre pédagogique — pas alphabétique :
 * c'est la séquence d'une leçon, et la lire dans le désordre n'aiderait
 * personne.
 *
 * La liste ne porte plus que les CLÉS : le libellé arabe vit dans le
 * catalogue (`admin.modules.stage.*`), comme toute autre chaîne visible.
 */
export const STAGE_KEYS = [
  'prerequisite_check',
  'trigger',
  'discovery',
  'manipulation',
  'formalization',
  'practice_lab',
  'evaluation',
];

export default function AdminModules() {
  const { t } = useTranslation('admin');
  const L = useAdminLabels();
  useDocumentMeta(t('modules.metaTitle'));

  const { token } = useContext(AuthContext);

  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState();
  const [stage, setStage] = useState();
  const [status, setStatus] = useState();
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounced(search, 300);

  /** Le libellé arabe d'une étape, ou la clé brute si l'API en invente une. */
  const stageLabel = (key) => {
    if (!key) return t('common.dash');
    const translated = t(`modules.stage.${key}`);
    return translated === `modules.stage.${key}` ? key : translated;
  };

  const loader = useCallback(
    (token) => fetchModules(token, { search: debouncedSearch, grade, stage, status, page }),
    [debouncedSearch, grade, stage, status, page],
  );
  const { data, loading, error, reload, setData } = useAdminResource(loader, [loader]);

  const rows = data?.data ?? [];
  const selection = useBulkSelection(rows);

  /**
   * Pas de palier ici : un module suit celui de sa leçon. `withTier: false`
   * est la MÊME frontière qu'à l'unité, où la colonne « Accès » n'existe pas
   * dans ce tableau et où la route serveur refuse le type `module`.
   */
  const bulkActions = useMemo(
    () => buildContentBulkActions({
      type: 'module',
      token,
      titleOf: (row) => `${row.title} — ${row.lessonTitle ?? row.lessonCode}`,
      withTier: false,
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

  const patchRow = (id, publicationStatus) => {
    setData((current) => current && ({
      ...current,
      data: current.data.map((row) => (row.id === id ? { ...row, publicationStatus } : row)),
    }));
  };

  const resetPage = (setter) => (value) => { setter(value); setPage(1); };

  return (
    <AdminPage
      eyebrow={t('modules.eyebrow')}
      title={t('modules.title')}
      subtitle={t('modules.subtitleLong')}
    >
      <div className="space-y-3">
        <FilterBar>
          <SearchInput
            value={search}
            onChange={resetPage(setSearch)}
            placeholder={t('modules.searchPlaceholder')}
            label={L.filters.searchLabel}
          />
          <SelectFilter
            label={t('common.grade')} allLabel={t('modules.allGrades')} value={grade}
            onChange={resetPage(setGrade)}
            options={GRADES.map((g) => ({ value: g, label: g }))}
          />
          <SelectFilter
            label={t('modules.columnStage')} allLabel={t('modules.allStages')} value={stage}
            onChange={resetPage(setStage)}
            options={STAGE_KEYS.map((value) => ({ value, label: stageLabel(value) }))}
          />
          <SelectFilter
            label={t('modules.columnPublication')} allLabel={t('modules.allStates')} value={status}
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
          noun={CONTENT_NOUNS.module}
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
          selectionLabel={(row) => L.selectRow(`${row.title} — ${row.lessonTitle ?? row.lessonCode}`)}
          labels={L.table}
          columns={[
            {
              key: 'title',
              label: t('modules.columnModule'),
              cellClassName: 'min-w-[220px]',
              render: (row) => (
                <div>
                  <span className="font-semibold text-slate-900">{row.title}</span>
                  <span className="block font-inter text-xs text-slate-400">
                    {t('modules.moduleNumber')}{' '}
                    <Num className="font-mono-jetbrains">{String(row.number).padStart(2, '0')}</Num>
                  </span>
                </div>
              ),
            },
            {
              key: 'lesson',
              label: t('modules.columnLesson'),
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
            { key: 'stage', label: t('modules.columnStage'), render: (row) => stageLabel(row.stage) },
            {
              key: 'estimatedMin',
              label: t('modules.columnDuration'),
              render: (row) => (row.estimatedMin
                ? <Num>{t('modules.minutes', { count: row.estimatedMin })}</Num>
                : t('common.dash')),
            },
            {
              key: 'learningPointCount',
              label: t('modules.columnPoints'),
              render: (row) => (row.learningPointCount > 0
                ? <Num>{row.learningPointCount}</Num>
                // Une étape qui n'enseigne pas n'a pas à en déclarer : le dire
                // évite de lire un tiret comme une donnée manquante.
                : <span className="text-slate-400" title={t('modules.noPointHint')}>{t('common.dash')}</span>),
            },
            {
              key: 'publicationStatus',
              label: t('modules.columnPublication'),
              render: (row) => (
                <PublicationControl
                  type="module"
                  id={row.id}
                  status={row.publicationStatus}
                  onChanged={(next) => patchRow(row.id, next)}
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
              icon={Layers}
              title={t('modules.emptyTitle')}
              hint={t('modules.emptyHint')}
            />
          )}
        />

        <Pagination meta={data} onPage={setPage} labels={L.pagination} />
      </div>
    </AdminPage>
  );
}
