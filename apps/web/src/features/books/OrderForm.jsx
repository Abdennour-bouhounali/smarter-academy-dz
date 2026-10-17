import { useEffect, useState } from 'react';
import { Minus, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchWilayas, submitBookOrder } from './bookService';
import { S, formatDa } from './strings';

const field = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 font-inter text-base text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
const lbl = 'mb-1.5 block font-inter text-sm font-semibold text-slate-700';

const EMPTY = { customerName: '', phone: '', email: '', wilaya: '', commune: '', address: '', customerNote: '', quantity: 1, website: '' };

/**
 * Le formulaire de commande d'un livre. AUCUN paiement en ligne et AUCUN frais
 * de livraison calculé ici : le serveur fige le prix du livre, et le frais est
 * fixé plus tard, par l'administrateur, après l'appel au client.
 * `website` est le pot de miel (champ caché) : un humain ne le remplit pas.
 */
export default function OrderForm({ book }) {
  const [form, setForm] = useState(EMPTY);
  const [wilayas, setWilayas] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  useEffect(() => {
    fetchWilayas().then((d) => setWilayas(d.wilayas ?? [])).catch(() => setWilayas([]));
  }, []);

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));
  const setQty = (delta) => setForm((f) => ({ ...f, quantity: Math.min(10, Math.max(1, f.quantity + delta)) }));

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await submitBookOrder(book.slug, { ...form, email: form.email || null, customerNote: form.customerNote || null });
      setDone(result.reference);
      setForm(EMPTY);
    } catch (caught) {
      setError(caught.message || S.order.failed);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={44} />
        <h3 className="font-space text-2xl font-bold text-slate-900">{S.order.successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md font-inter text-slate-600">{S.order.successBody}</p>
        <p dir="ltr" className="mt-3 inline-block rounded-xl bg-white px-4 py-2 font-mono-jetbrains text-lg font-bold text-slate-900">{done}</p>
        <div className="mt-5">
          <button type="button" onClick={() => setDone(null)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-inter text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {S.order.another}
          </button>
        </div>
      </div>
    );
  }

  const subtotal = book.price * form.quantity;

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" noValidate>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <div>
          <label className={lbl} htmlFor="bo-name">{S.order.name}</label>
          <input id="bo-name" required minLength={3} autoComplete="name" enterKeyHint="next" className={field} value={form.customerName} onChange={set('customerName')} />
        </div>
        <div>
          <label className={lbl} htmlFor="bo-phone">{S.order.phone}</label>
          <input id="bo-phone" required type="tel" inputMode="tel" dir="ltr" autoComplete="tel" placeholder="05 55 12 34 56" className={`${field} text-end`} value={form.phone} onChange={set('phone')} />
          <p className="mt-1 font-inter text-xs text-slate-500">{S.order.phoneHint}</p>
        </div>
        <div>
          <label className={lbl} htmlFor="bo-wilaya">{S.order.wilaya}</label>
          <select id="bo-wilaya" required className={field} value={form.wilaya} onChange={set('wilaya')}>
            <option value="">{S.order.wilayaPlaceholder}</option>
            {wilayas.map((w) => <option key={w.id} value={w.label}>{w.ar} — {w.fr}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl} htmlFor="bo-commune">{S.order.commune}</label>
          <input id="bo-commune" required autoComplete="address-level2" enterKeyHint="next" className={field} value={form.commune} onChange={set('commune')} />
        </div>
        <div className="md:col-span-2">
          <label className={lbl} htmlFor="bo-address">{S.order.address}</label>
          <textarea id="bo-address" required minLength={5} rows={2} autoComplete="street-address" className={field} value={form.address} onChange={set('address')} />
        </div>
        <div className="md:col-span-2">
          <span className={lbl}>{S.order.quantity}</span>
          <div className="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white p-1">
            <button type="button" onClick={() => setQty(-1)} disabled={form.quantity <= 1} aria-label="-" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 enabled:hover:bg-slate-100 disabled:opacity-40"><Minus size={16} /></button>
            <span dir="ltr" className="w-8 text-center font-space text-lg font-bold">{form.quantity}</span>
            <button type="button" onClick={() => setQty(1)} disabled={form.quantity >= 10} aria-label="+" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 enabled:hover:bg-slate-100 disabled:opacity-40"><Plus size={16} /></button>
          </div>
        </div>
        {/* Les champs FACULTATIFS sont repliés : chaque champ visible de plus coûte des
            commandes, surtout sur téléphone. Ouverts d'office s'ils sont déjà remplis. */}
        <details className="group md:col-span-2" open={Boolean(form.email || form.customerNote)}>
          <summary className="cursor-pointer list-none font-inter text-sm font-semibold text-blue-700 hover:underline">
            {S.order.optionalMore}
          </summary>
          <div className="mt-4 grid gap-4 sm:gap-5 md:grid-cols-2">
            <div>
              <label className={lbl} htmlFor="bo-email">{S.order.email}</label>
              <input id="bo-email" type="email" dir="ltr" autoComplete="email" className={`${field} text-end`} value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className={lbl} htmlFor="bo-note">{S.order.note}</label>
              <input id="bo-note" className={field} value={form.customerNote} onChange={set('customerNote')} />
            </div>
          </div>
        </details>
      </div>

      {/* Pot de miel : hors écran, hors tabulation, hors lecteur d'écran. */}
      <div aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '-9999px', height: 0, overflow: 'hidden' }}>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} name="website" />
      </div>

      <dl className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4 font-inter text-sm">
        <div className="flex justify-between"><dt className="text-slate-600">{S.order.price}</dt><dd dir="ltr" className="font-semibold">{formatDa(book.price)}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-600">{S.order.subtotal}</dt><dd dir="ltr" className="font-bold text-slate-900">{formatDa(subtotal)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-slate-600">{S.order.delivery}</dt><dd className="text-slate-500">{S.order.deliveryLater}</dd></div>
      </dl>

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-inter text-sm text-rose-700">{error}</p>}

      <button type="submit" disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-space text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60">
        {busy && <Loader2 size={18} className="animate-spin" />}
        {busy ? S.order.sending : S.order.submit}
      </button>
      <p className="mt-3 text-center font-inter text-xs text-slate-500">{S.order.noPayment}</p>
    </form>
  );
}
