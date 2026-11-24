import { useCallback, useContext, useEffect, useState } from 'react';
import { Phone, Trash2, MapPin, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { AdminCard, formatDate, Num, btnPrimary, btnDanger, input, label } from '../adminUi';
import { ConfirmDialog } from '../../../components/admin/ui/Modal';
import { LoadingState, ErrorState } from '../../../components/admin/ui/states';
import { useAdminResource } from '../../../hooks/useAdminResource';
import {
  fetchBookOrder, updateBookOrder, updateBookOrderStatus,
  addBookOrderPayment, removeBookOrderPayment, deleteBookOrder,
} from '../../../features/books/bookService';
import { S, formatDa } from '../../../features/books/strings';
import { DELIVERY_MODES } from '../../../features/books/delivery';
import { Pill, PAYMENT_TONES, CallStatusSelect, DeliveryStatusSelect, CopyPhone, deliveryKey } from './orderUi';

const A = S.admin;
const isDeletable = (o) => o.callStatus === 'cancelled' || o.deliveryStatus === 'returned';

/** Le libellé d'une valeur d'événement de l'historique, selon son type. */
function eventValue(type, value) {
  if (type === 'call_status') return A.callStatus[value] ?? value;
  if (type === 'delivery_status') return A.deliveryStatus[deliveryKey(value)] ?? value;
  // `status` et `created` d'avant le 2026-11-24 : l'ancien état unique.
  return A.callStatus[value] ?? A.legacyStatus[value] ?? value;
}

/**
 * La fiche d'une commande, rangée de haut en bas dans l'ordre du travail : qui appeler,
 * où en est la commande, combien, puis la livraison, les paiements et l'historique.
 * Montée dans la fenêtre ouverte depuis la liste (`BookOrders`) et dans la page
 * `/admin/livres/commandes/:id` (lien d'une notification).
 */
export default function OrderDetailPanel({ orderId, onLoaded, onChange, onDeleted }) {
  const { token } = useContext(AuthContext);
  const loader = useCallback((t) => fetchBookOrder(t, orderId), [orderId]);
  const { data, loading, error, reload, setData } = useAdminResource(loader, [loader]);

  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState(null);
  const [fee, setFee] = useState(null);
  const [note, setNote] = useState(null);
  const [mode, setMode] = useState(null);
  const [pay, setPay] = useState({ kind: 'payment', amount: '', method: 'cash_on_delivery', note: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const loaded = data?.order;
  // Le titre de la fenêtre ou de la page (la référence) vient de la fiche chargée.
  useEffect(() => { if (loaded) onLoaded?.(loaded); }, [loaded?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingState rows={6} />;
  if (error || !data) return <ErrorState message={error} onRetry={reload} />;
  const o = data.order;

  const run = async (action) => {
    setBusy(true);
    setProblem(null);
    try {
      const result = await action();
      if (result?.order) {
        setData({ order: result.order });
        onChange?.(result.order);
      }
      return true;
    } catch (caught) {
      setProblem(caught.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const feeValue = fee ?? (o.deliveryFee ?? '');
  const noteValue = note ?? (o.adminNote ?? '');
  // `deliveryMode` est null sur les commandes d'avant le tarif par wilaya ; envoyé seulement s'il a changé.
  // Le serveur ne recalcule PAS le frais quand le mode change : l'administrateur le corrige à côté.
  const modeValue = mode ?? (o.deliveryMode ?? '');
  const saveDetails = () => run(() => updateBookOrder(token, o.id, {
    deliveryFee: feeValue === '' ? null : Number(feeValue),
    adminNote: noteValue,
    ...(mode !== null ? { deliveryMode: mode === '' ? null : mode } : {}),
  })).then((ok) => { if (ok) { setFee(null); setNote(null); setMode(null); } });

  const submitPayment = async (event) => {
    event.preventDefault();
    const ok = await run(() => addBookOrderPayment(token, o.id, { ...pay, amount: Number(pay.amount), note: pay.note || null }));
    if (ok) setPay({ kind: 'payment', amount: '', method: 'cash_on_delivery', note: '' });
  };

  const remaining = Math.max(0, o.total - o.paidAmount);

  return (
    <div className="space-y-5">
      <p className="font-inter text-xs text-slate-500">
        {o.book?.title ?? ''} · {formatDate(o.createdAt, { withTime: true })}
      </p>
      {problem && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-inter text-sm text-rose-700">{problem}</p>}

      {/* 1. Le client et les deux états : tout ce qu'il faut pour l'appel. */}
      <div className="grid gap-4 md:grid-cols-2">
        <AdminCard title={A.customer}>
          <p className="font-space text-lg font-bold text-slate-900">{o.customerName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 font-inter text-sm font-semibold text-slate-800">
            <CopyPhone phone={o.phone} />
            <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"><Phone size={13} />{A.call}</a>
          </div>
          {o.email && <a href={`mailto:${o.email}`} dir="ltr" className="block font-inter text-sm text-blue-700 hover:underline">{o.email}</a>}
          <dl className="mt-3 space-y-2 font-inter text-sm">
            <div className="flex items-start gap-1.5"><MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" /><dd>{o.wilaya} — {o.commune}{o.deliveryMode && <span className="text-slate-500"> · {A.deliveryModes[o.deliveryMode]}</span>}</dd></div>
            {/* Plus demandée depuis le 2026-11-13 : seules les commandes plus anciennes en ont une. */}
            {o.address && <div><dt className="text-xs text-slate-500">{A.address}</dt><dd>{o.address}</dd></div>}
            {o.customerNote && <div><dt className="text-xs text-slate-500">{A.customerNote}</dt><dd>{o.customerNote}</dd></div>}
          </dl>
        </AdminCard>

        <AdminCard title={A.columns.status}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-inter text-xs font-semibold text-slate-500">{A.columns.call}</span>
              <CallStatusSelect status={o.callStatus} disabled={busy} onChange={(callStatus) => run(() => updateBookOrderStatus(token, o.id, { callStatus }))} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-inter text-xs font-semibold text-slate-500">{A.columns.delivery}</span>
              <DeliveryStatusSelect status={o.deliveryStatus} disabled={busy} onChange={(deliveryStatus) => run(() => updateBookOrderStatus(token, o.id, { deliveryStatus }))} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-inter text-xs font-semibold text-slate-500">{A.columns.payment}</span>
              <Pill tone={PAYMENT_TONES[o.paymentStatus]}>{A.payment[o.paymentStatus]}</Pill>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* 2. Les montants. */}
      <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-3"><p className="font-inter text-xs text-slate-500">{formatDa(o.unitPrice)} × <Num>{o.quantity}</Num></p><Num className="font-space text-lg font-bold">{formatDa(o.subtotal)}</Num></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="font-inter text-xs text-slate-500">{S.order.delivery}</p>{o.deliveryFee === null ? <p className="font-inter text-sm text-slate-500">{A.deliveryUnset}</p> : <Num className="font-space text-lg font-bold">{formatDa(o.deliveryFee)}</Num>}</div>
        <div className="rounded-xl bg-emerald-50 p-3"><p className="font-inter text-xs text-emerald-700">{A.paid}</p><Num className="font-space text-lg font-bold text-emerald-700">{formatDa(o.paidAmount)}</Num></div>
        <div className="rounded-xl bg-amber-50 p-3"><p className="font-inter text-xs text-amber-700">{A.remaining} / {formatDa(o.total)}</p><Num className="font-space text-lg font-bold text-amber-700">{formatDa(remaining)}</Num></div>
      </div>

      {/* 3. Livraison et note interne. */}
      <AdminCard title={A.deliveryFee}>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={label} htmlFor="dmode">{A.deliveryMode}</label>
            <select id="dmode" className={input} value={modeValue} onChange={(e) => setMode(e.target.value)}>
              <option value="">—</option>
              {DELIVERY_MODES.map((m) => <option key={m} value={m}>{A.deliveryModes[m]}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="fee">{A.deliveryFee}</label>
            <input id="fee" type="number" min="0" dir="ltr" placeholder={A.deliveryUnset} className={input} value={feeValue} onChange={(e) => setFee(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="anote">{A.adminNote}</label>
            <input id="anote" className={input} value={noteValue} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <div className="mt-4"><button type="button" disabled={busy || (fee === null && note === null && mode === null)} onClick={saveDetails} className={btnPrimary}>{A.save}</button></div>
      </AdminCard>

      {/* 4. Paiements. */}
      <AdminCard title={A.payments}>
        {o.payments.length === 0 ? <p className="mb-4 font-inter text-sm text-slate-500">{A.noPayments}</p> : (
          <ul className="mb-4 divide-y divide-slate-100">
            {o.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 font-inter text-sm">
                <span>
                  <span className={p.kind === 'refund' ? 'font-bold text-rose-600' : 'font-bold text-emerald-700'}>{A.kind[p.kind]} <Num>{formatDa(p.amount)}</Num></span>
                  <span className="text-slate-500"> · {A.method[p.method]} · {formatDate(p.receivedAt, { withTime: true })}{p.note ? ` · ${p.note}` : ''}</span>
                </span>
                <button type="button" disabled={busy} aria-label={A.remove} onClick={() => window.confirm(A.confirmRemovePayment) && run(() => removeBookOrderPayment(token, p.id))} className="text-slate-400 hover:text-rose-600"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submitPayment} className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 xl:grid-cols-4">
          <select aria-label={A.addPayment} className={input} value={pay.kind} onChange={(e) => setPay({ ...pay, kind: e.target.value })}>
            {Object.entries(A.kind).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input required type="number" min="1" dir="ltr" placeholder={A.amount} aria-label={A.amount} className={input} value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
          <select aria-label={A.method_} className={input} value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>
            {Object.entries(A.method).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input placeholder={A.paymentNote} aria-label={A.paymentNote} className={input} value={pay.note} onChange={(e) => setPay({ ...pay, note: e.target.value })} />
          <div className="col-span-2 flex justify-end xl:col-span-4"><button type="submit" disabled={busy} className={btnPrimary}>{A.addPayment}</button></div>
        </form>
      </AdminCard>

      {/* 5. Historique, replié : on le consulte, on ne le lit pas à chaque appel. */}
      <details className="group rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between font-space text-sm font-bold text-slate-900">
          {A.history} <ChevronDown size={16} className="text-slate-400 transition group-open:rotate-180" />
        </summary>
        <ol className="mt-3 space-y-2 font-inter text-sm">
          {o.events.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-x-2 text-slate-700">
              <span className="font-semibold">{A.event[e.type] ?? e.type}</span>
              {(e.from || e.to) && (
                <span className="text-slate-500">
                  {['status', 'call_status', 'delivery_status'].includes(e.type) && <span dir="ltr" lang="fr">{eventValue(e.type, e.from)} → {eventValue(e.type, e.to)}</span>}
                  {e.type === 'created' && <span dir="ltr" lang="fr">{eventValue(e.type, e.to)}</span>}
                  {e.type === 'delivery_mode' && (A.deliveryModes[e.to] ?? '—')}
                  {['payment', 'refund', 'delivery_fee'].includes(e.type) && (e.to ? formatDa(e.to) : A.deliveryUnset)}
                </span>
              )}
              <span className="text-slate-400">· {formatDate(e.createdAt, { withTime: true })}{e.by ? ` · ${e.by}` : ''}</span>
            </li>
          ))}
        </ol>
      </details>

      {isDeletable(o) && (
        <button type="button" onClick={() => setConfirmDelete(true)} className={btnDanger}><Trash2 size={14} />{A.deleteOrder}</button>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={A.deleteOrder}
        message={A.confirmDelete}
        confirmLabel={A.deleteOrder}
        tone="danger"
        busy={busy}
        onConfirm={async () => { if (await run(() => deleteBookOrder(token, o.id))) { setConfirmDelete(false); onDeleted?.(); } }}
      />
    </div>
  );
}
