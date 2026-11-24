import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Columns3, ExternalLink, PackageSearch } from 'lucide-react';
import { AdminPage, formatDate, Num, btnSecondary } from '../adminUi';
import DataTable from '../../../components/admin/ui/DataTable';
import Modal from '../../../components/admin/ui/Modal';
import { EmptyState } from '../../../components/admin/ui/states';
import { FilterBar, SearchInput, SelectFilter, Pagination } from '../../../components/admin/ui/FilterBar';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useDebounced } from '../../../hooks/useDebounced';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { fetchAdminBooks, fetchBookOrders, fetchBookOrderStats, updateBookOrderStatus } from '../../../features/books/bookService';
import { S, formatDa } from '../../../features/books/strings';
import { storage } from '../../../utils/storage';
import AdminNotifications from '../notifications/AdminNotifications';
import { AuthContext } from '../../../context/AuthContext';
import { CallStatusSelect, DeliveryStatusSelect, CopyPhone } from './orderUi';
import OrderDetailPanel from './OrderDetailPanel';

const A = S.admin;
const options = (map) => Object.entries(map).map(([value, label]) => ({ value, label }));
const HIDDEN_COLUMNS_KEY = 'admin_book_orders_hidden_columns';

/** Les pages dédiées (« المسلَّمة », « المرتجعة ») : la même liste, l'état du colis fixé. */
const VIEWS = {
  all: { title: A.ordersTitle, subtitle: A.ordersSubtitle },
  delivered: { title: A.deliveredTitle, subtitle: A.deliveredSubtitle, deliveryStatus: 'delivered' },
  returned: { title: A.returnedTitle, subtitle: A.returnedSubtitle, deliveryStatus: 'returned' },
};

function Stat({ label, value, tone = 'text-slate-900' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p dir="ltr" lang="fr" className="text-start font-inter text-xs font-semibold text-slate-500">{label}</p>
      <p dir="ltr" className={`mt-1 text-start font-space text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function readHidden() {
  try {
    const parsed = JSON.parse(storage.getItem(HIDDEN_COLUMNS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** « الأعمدة » : une case par colonne ; le choix est gardé sur cet appareil. */
function ColumnsMenu({ columns, hidden, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={btnSecondary}>
        <Columns3 size={15} />{A.columnsMenu}
      </button>
      {open && (
        <div className="absolute end-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {columns.map((c) => (
            <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-inter text-sm text-slate-700 hover:bg-slate-50">
              <input type="checkbox" checked={!hidden.includes(c.key)} onChange={() => onToggle(c.key)} className="accent-violet-600" />
              {c.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * « طلبات الكتب » : les chiffres et la liste. L'appel et le colis se changent DANS la liste ;
 * un clic sur une ligne ouvre la fiche dans une fenêtre. `view` = `delivered` | `returned`
 * pour les pages dédiées (BOOKS_STORE.md §4).
 */
export default function AdminBookOrders({ view = 'all' }) {
  const v = VIEWS[view] ?? VIEWS.all;
  useDocumentMeta(v.title);
  const { user, token } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [callStatus, setCallStatus] = useState();
  const [deliveryStatus, setDeliveryStatus] = useState();
  const [paymentStatus, setPaymentStatus] = useState();
  const [searchParams] = useSearchParams();
  const [bookId, setBookId] = useState(searchParams.get('bookId') ?? undefined);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [openRef, setOpenRef] = useState(null);
  const [hidden, setHidden] = useState(readHidden);
  const [rowProblem, setRowProblem] = useState(null);
  const q = useDebounced(search, 300);
  const delivery = v.deliveryStatus ?? deliveryStatus;

  const loader = useCallback((t) => fetchBookOrders(t, { search: q, callStatus, deliveryStatus: delivery, paymentStatus, bookId, page }), [q, callStatus, delivery, paymentStatus, bookId, page]);
  const { data, loading, error, reload, setData } = useAdminResource(loader, [loader]);
  const statsLoader = useCallback((t) => fetchBookOrderStats(t, { bookId }), [bookId]);
  const { data: stats, reload: reloadStats } = useAdminResource(statsLoader, [statsLoader]);
  const booksLoader = useCallback((t) => fetchAdminBooks(t), []);
  const { data: booksData } = useAdminResource(booksLoader, [booksLoader]);
  // Un seul livre au catalogue : la colonne et le filtre « الكتاب » n'apprennent rien.
  const severalBooks = (booksData?.books?.length ?? 0) > 1;

  const meta = data ? { current_page: data.page, last_page: data.lastPage, total: data.total, from: (data.page - 1) * 20 + 1, to: Math.min(data.page * 20, data.total) } : null;
  const reset = (setter) => (value) => { setter(value); setPage(1); };

  // Une ligne changée (ici ou dans la fenêtre) remplace la sienne sans recharger la liste.
  const replaceRow = useCallback((order) => {
    setData((current) => current && { ...current, orders: current.orders.map((o) => (o.id === order.id ? { ...o, ...order } : o)) });
    reloadStats();
  }, [setData, reloadStats]);

  const changeStatus = async (order, patch) => {
    setRowProblem(null);
    try {
      const result = await updateBookOrderStatus(token, order.id, patch);
      replaceRow(result.order);
    } catch (caught) {
      setRowProblem(caught.message || A.statusUpdateFailed);
    }
  };

  const toggleColumn = (key) => {
    setHidden((current) => {
      const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
      storage.setItem(HIDDEN_COLUMNS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const allColumns = useMemo(() => [
    { key: 'ref', label: A.columns.ref, render: (o) => <span className="whitespace-nowrap font-mono-jetbrains text-xs font-semibold text-violet-700"><Num>{o.reference}</Num></span> },
    { key: 'customer', label: A.columns.customer, render: (o) => (<div><span className="font-semibold text-slate-900">{o.customerName}</span><CopyPhone phone={o.phone} className="text-xs text-slate-500" /></div>) },
    ...(severalBooks ? [{ key: 'book', label: A.columns.book, render: (o) => o.book?.title ?? '—' }] : []),
    { key: 'wilaya', label: A.columns.wilaya, render: (o) => (<div>{o.wilaya}{o.deliveryMode && <span className="block text-[11px] text-slate-400">{A.deliveryModes[o.deliveryMode]}</span>}</div>) },
    { key: 'qty', label: A.columns.qty, render: (o) => <Num>{o.quantity}</Num> },
    { key: 'total', label: A.columns.total, render: (o) => (<div><Num className="whitespace-nowrap">{formatDa(o.total)}</Num>{o.deliveryFee === null && <span className="block text-[11px] text-slate-400">{A.deliveryPending}</span>}</div>) },
    { key: 'call', label: A.columns.call, render: (o) => <CallStatusSelect status={o.callStatus} onChange={(value) => changeStatus(o, { callStatus: value })} /> },
    { key: 'delivery', label: A.columns.delivery, render: (o) => <DeliveryStatusSelect status={o.deliveryStatus} onChange={(value) => changeStatus(o, { deliveryStatus: value })} /> },
    { key: 'date', label: A.columns.date, render: (o) => <span className="whitespace-nowrap text-slate-500">{formatDate(o.createdAt, { withTime: true })}</span> },
  ], [severalBooks]); // eslint-disable-line react-hooks/exhaustive-deps
  const columns = allColumns.filter((c) => !hidden.includes(c.key));

  const inTransit = stats ? (stats.byDelivery.shipped ?? 0) + (stats.byDelivery.in_transit ?? 0) : 0;
  const closeModal = () => { setOpenId(null); setOpenRef(null); };

  return (
    <AdminPage eyebrow={A.eyebrow} title={v.title} subtitle={v.subtitle}>
      {/* Le gestionnaire de la librairie atterrit ici : ses notifications y sont. L'administrateur les a sur l'accueil. */}
      {view === 'all' && user?.role === 'book_manager' && <AdminNotifications />}
      {view === 'all' && stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <Stat label={A.stats.total} value={stats.totalOrders} />
          <Stat label={A.stats.new} value={stats.byCall.new ?? 0} tone="text-amber-600" />
          <Stat label={A.stats.noAnswer} value={stats.byCall.no_answer ?? 0} tone="text-orange-600" />
          <Stat label={A.stats.confirmed} value={stats.byCall.confirmed ?? 0} tone="text-emerald-600" />
          <Stat label={A.stats.inTransit} value={inTransit} tone="text-violet-600" />
          <Stat label={A.stats.delivered} value={stats.byDelivery.delivered ?? 0} tone="text-emerald-600" />
          <Stat label={A.stats.returned} value={stats.byDelivery.returned ?? 0} tone="text-rose-600" />
          <Stat label={A.stats.copies} value={stats.copiesDelivered} />
          <Stat label={A.stats.expected} value={formatDa(stats.expectedRevenue)} />
          <Stat label={A.stats.collected} value={formatDa(stats.collected)} tone="text-emerald-600" />
          <Stat label={A.stats.toCollect} value={formatDa(stats.toCollect)} tone={stats.toCollect > 0 ? 'text-rose-600' : undefined} />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <FilterBar>
            <SearchInput value={search} onChange={reset(setSearch)} placeholder={A.searchPlaceholder} />
            {severalBooks && <SelectFilter value={bookId} onChange={reset(setBookId)} label={A.columns.book} allLabel={A.allBooks} options={booksData.books.map((b) => ({ value: String(b.id), label: b.title }))} />}
            <SelectFilter value={callStatus} onChange={reset(setCallStatus)} label={A.columns.call} allLabel={A.allCallStatuses} options={options(A.callStatus)} />
            {!v.deliveryStatus && <SelectFilter value={deliveryStatus} onChange={reset(setDeliveryStatus)} label={A.columns.delivery} allLabel={A.allDeliveryStatuses} options={options(A.deliveryStatus)} />}
            <SelectFilter value={paymentStatus} onChange={reset(setPaymentStatus)} label={A.columns.payment} allLabel={A.allPayments} options={options(A.payment)} />
          </FilterBar>
          <ColumnsMenu columns={allColumns} hidden={hidden} onToggle={toggleColumn} />
        </div>
        {rowProblem && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 font-inter text-sm text-rose-700">{rowProblem}</p>}

        <DataTable
          rows={data?.orders ?? []}
          loading={loading && !data}
          error={error}
          onRetry={reload}
          onRowClick={(o) => { setOpenId(o.id); setOpenRef(o.reference); }}
          empty={<EmptyState icon={PackageSearch} title={A.noOrders} />}
          columns={columns}
        />
        <Pagination meta={meta} onPage={setPage} />
      </div>

      <Modal
        open={openId !== null}
        onClose={closeModal}
        size="xl"
        title={openRef ?? A.ordersTitle}
        closeLabel={A.back}
        footer={openId !== null && (
          <Link to={`/admin/livres/commandes/${openId}`} className={btnSecondary}><ExternalLink size={14} />{A.openFullPage}</Link>
        )}
      >
        {openId !== null && (
          <OrderDetailPanel
            orderId={openId}
            onChange={replaceRow}
            onDeleted={() => { closeModal(); reload(); reloadStats(); }}
          />
        )}
      </Modal>
    </AdminPage>
  );
}
