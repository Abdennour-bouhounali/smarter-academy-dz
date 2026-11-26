import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, CheckCircle2, Loader2, MapPin, Home, Store } from 'lucide-react';
import { fetchWilayas, submitBookOrder } from './bookService';
import { S, formatDa } from './strings';
import SearchSelect from './SearchSelect';
import { filterOptions } from './dzSearch';
import { normalizePhone, validateOrder } from './orderValidation';
import { trackPixel, trackPurchase } from './metaPixel';
import { DELIVERY_MODES, deliveryFeeFor, orderTotal } from './delivery';

// Le libellé est DANS le champ (petit, en haut) au lieu d'une ligne au-dessus : le formulaire
// entier tient sur l'écran d'un téléphone de 360 × 600 sans défiler (2026-11-26).
const field = 'h-[50px] w-full rounded-xl border bg-white px-3 pb-1 pt-[18px] font-inter text-base text-slate-800 placeholder:text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
const lbl = 'pointer-events-none absolute start-3 top-1.5 font-inter text-xs font-semibold leading-none text-slate-500';
const errCls = 'mt-1 font-inter text-xs font-medium text-rose-600';

const EMPTY = { customerName: '', phone: '', email: '', wilaya: '', commune: '', customerNote: '', quantity: 1, deliveryMode: 'home', website: '' };
// Un champ refusé par le serveur (422) → la clé de SON message arabe.
const SERVER_FIELD = { customerName: 'name', phone: 'phone', wilaya: 'wilaya', commune: 'commune', quantity: 'quantity' };
const FIELD_ORDER = ['customerName', 'phone', 'wilaya', 'commune'];

/** Le brouillon survit à un rechargement ou à un aller-retour dans le navigateur de WhatsApp. */
const draftKey = (slug) => `sa-book-order:${slug}`;
function readDraft(slug) {
  try {
    const raw = window.sessionStorage.getItem(draftKey(slug));
    return raw ? { ...EMPTY, ...JSON.parse(raw), website: '' } : EMPTY;
  } catch { return EMPTY; }
}
function writeDraft(slug, form) {
  try {
    const { website, ...rest } = form; // eslint-disable-line no-unused-vars
    window.sessionStorage.setItem(draftKey(slug), JSON.stringify(rest));
  } catch { /* stockage indisponible : le formulaire marche sans */ }
}
function clearDraft(slug) {
  try { window.sessionStorage.removeItem(draftKey(slug)); } catch { /* idem */ }
}

/**
 * Le formulaire de commande d'un livre — téléphone d'abord (BOOKS_STORE.md §4).
 * AUCUN paiement en ligne. Le client choisit le mode de livraison (à domicile ou
 * stop-desk) ; le frais de SA wilaya (tarif du transporteur, `GET /books/wilayas`)
 * s'affiche dès la wilaya choisie, avec le total à payer à la réception. Ce frais
 * n'est qu'affiché : le serveur fige le prix et recalcule le frais lui-même, on ne
 * l'envoie jamais. Une wilaya sans tarif (`delivery: null`) : le frais se fixe à
 * l'appel de confirmation, et le total affiché dit qu'il est « دون التوصيل ».
 * Plus d'adresse (2026-11-13) : wilaya + commune, l'adresse exacte se demande au téléphone.
 *
 * - Wilaya : numérotée, cherchée par numéro OU par nom (arabe affiché seul) ; un nom
 *   de COMMUNE la trouve aussi et remplit les deux champs.
 * - Commune : inactive tant qu'aucune wilaya n'est choisie, puis la liste arabe de
 *   CETTE wilaya (`data/dzCommunes.json`, chargé à part).
 * - Chaque champ dit son erreur en arabe (au départ du champ, puis à l'envoi) ;
 *   un refus du serveur (422) revient sous le champ concerné.
 * - Le bouton BAT 3 fois quand le formulaire devient complet — jamais sur un
 *   formulaire vide, jamais sous `prefers-reduced-motion` (conseil 2026-11-13).
 * `website` est le pot de miel (champ caché) : un humain ne le remplit pas.
 */
export default function OrderForm({ book }) {
  const [form, setForm] = useState(() => readDraft(book.slug));
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState(null);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const startedRef = useRef(false);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const wilayaRef = useRef(null);
  const communeRef = useRef(null);
  const refs = { customerName: nameRef, phone: phoneRef, wilaya: wilayaRef, commune: communeRef };

  useEffect(() => {
    fetchWilayas().then((d) => setWilayas(d.wilayas ?? [])).catch(() => setWilayas([]));
    import('./data/dzCommunes.json').then((m) => setCommunes(m.default)).catch(() => setCommunes({}));
  }, []);

  useEffect(() => { if (!done) writeDraft(book.slug, form); }, [book.slug, form, done]);

  // Le formulaire (long) est remplacé par le court message de succès : sans ce défilement, le
  // client se retrouve plus bas, sur la FAQ, et ne voit pas la confirmation (2026-11-25).
  // Centré (sous l'en-tête fixe), focus pour les lecteurs d'écran, sans animation si demandé.
  const successRef = useRef(null);
  useEffect(() => {
    const el = successRef.current;
    if (!done || !el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView?.({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    el.focus?.({ preventScroll: true });
  }, [done]);

  const localErrors = useMemo(() => validateOrder(form), [form]);
  const errors = { ...localErrors, ...serverErrors };
  const ready = Object.keys(localErrors).length === 0;

  // Le battement se rejoue chaque fois que le formulaire DEVIENT complet.
  const wasReady = useRef(ready);
  useEffect(() => {
    if (ready && !wasReady.current) setPulseKey((k) => k + 1);
    wasReady.current = ready;
  }, [ready]);

  const clearServer = (...keys) => setServerErrors((e) => {
    const next = { ...e };
    keys.forEach((k) => delete next[k]);
    return next;
  });
  const set = (key) => (event) => {
    const { value } = event.target;
    setForm((f) => ({ ...f, [key]: value }));
    clearServer(key);
  };
  const touch = (key) => () => setTouched((t) => ({ ...t, [key]: true }));
  const setQty = (delta) => {
    setForm((f) => ({ ...f, quantity: Math.min(10, Math.max(1, (Number(f.quantity) || 1) + delta)) }));
    clearServer('quantity');
  };
  const shownError = (key) => ((touched[key] || serverErrors[key]) && errors[key] ? S.order.errors[errors[key]] : null);

  const selectedWilaya = wilayas.find((w) => w.label === form.wilaya) ?? null;

  const wilayaOptions = useMemo(
    () => wilayas.map((w) => ({ value: w.label, label: w.ar, code: w.id, terms: [w.ar, w.fr] })),
    [wilayas],
  );
  const communeOptions = useMemo(
    () => (selectedWilaya && communes?.[selectedWilaya.id]
      ? communes[selectedWilaya.id].map(([ar, latin]) => ({ value: ar, label: ar, terms: [ar, latin] }))
      : []),
    [selectedWilaya, communes],
  );

  // Toutes les communes, pour retrouver une wilaya par le nom d'une de ses communes
  // (« بوسعادة » → 28 المسيلة) : un client d'une wilaya créée en 2025 trouve la sienne.
  const allCommunes = useMemo(() => {
    if (!communes || !wilayas.length) return [];
    return wilayas.flatMap((w) => (communes[w.id] ?? []).map(([ar, latin]) => ({ key: `${w.id}:${ar}`, ar, wilaya: w, terms: [ar, latin] })));
  }, [communes, wilayas]);

  const pickWilaya = useCallback((label) => {
    setForm((f) => (f.wilaya === label ? f : { ...f, wilaya: label, commune: '' }));
    clearServer('wilaya', 'commune');
    setTouched((t) => ({ ...t, wilaya: true }));
    // Le champ suivant prend la main (sans s'ouvrir : deux listes plein écran d'affilée désorientent).
    requestAnimationFrame(() => communeRef.current?.focus());
  }, []);
  const pickCommune = useCallback((commune) => {
    setForm((f) => ({ ...f, commune }));
    clearServer('commune');
    setTouched((t) => ({ ...t, commune: true }));
  }, []);

  const wilayaExtras = useCallback((query) => {
    const q = query.trim();
    if (q.length < 2 || /^[\d٠-٩]+$/.test(q)) return [];
    return filterOptions(allCommunes, q).slice(0, 8).map((c) => ({
      key: c.key,
      code: c.wilaya.id,
      label: c.ar,
      hint: S.order.communeIn(c.wilaya.ar),
      pick: () => {
        setForm((f) => ({ ...f, wilaya: c.wilaya.label, commune: c.ar }));
        clearServer('wilaya', 'commune');
        setTouched((t) => ({ ...t, wilaya: true, commune: true }));
      },
    }));
  }, [allCommunes]);

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!ready) {
      setTouched({ customerName: true, phone: true, wilaya: true, commune: true });
      refs[FIELD_ORDER.find((k) => localErrors[k])]?.current?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await submitBookOrder(book.slug, {
        ...form,
        phone: normalizePhone(form.phone),
        quantity: Math.min(10, Math.max(1, Number(form.quantity) || 1)),
        deliveryMode: DELIVERY_MODES.includes(form.deliveryMode) ? form.deliveryMode : 'home',
        email: form.email || null,
        customerNote: form.customerNote || null,
      });
      trackPixel('Lead', { content_name: book.title, content_ids: [book.slug], content_type: 'product', value: book.price * (Number(form.quantity) || 1), currency: 'DZD', num_items: Number(form.quantity) || 1 });
      trackPurchase(book, form.quantity, result);
      clearDraft(book.slug);
      setDone({ reference: result.reference, total: result.total ?? null, deliveryFee: result.deliveryFee ?? null });
      setForm(EMPTY);
      setTouched({});
    } catch (caught) {
      const mapped = {};
      (caught.fields ?? []).forEach((f) => { if (SERVER_FIELD[f]) mapped[f] = SERVER_FIELD[f]; });
      setServerErrors(mapped);
      // Un champ connu : son message est sous le champ. Sinon, le message général.
      setError(Object.keys(mapped).length ? null : S.order.failed);
      const first = FIELD_ORDER.find((k) => mapped[k]);
      if (first) refs[first].current?.focus();
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    const feeKnown = done.deliveryFee !== null && done.total !== null;
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="scroll-mt-24 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center outline-none sm:p-8">
        <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={44} />
        <h3 className="font-space text-2xl font-bold text-slate-900">{S.order.successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md font-inter text-slate-600">{feeKnown ? S.order.successBody : S.order.successBodyLater}</p>
        <p dir="ltr" className="mt-3 inline-block rounded-xl bg-white px-4 py-2 font-mono-jetbrains text-lg font-bold text-slate-900">{done.reference}</p>
        {feeKnown && (
          <p className="mt-3 font-inter text-slate-700">
            {S.order.successAmount} <span dir="ltr" className="font-space text-lg font-bold text-slate-900">{formatDa(done.total)}</span>
          </p>
        )}
        <div className="mt-5">
          <button type="button" onClick={() => setDone(null)} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 font-inter text-sm font-semibold text-slate-700 hover:bg-slate-50">
            {S.order.another}
          </button>
        </div>
      </div>
    );
  }

  const fee = deliveryFeeFor(selectedWilaya, form.deliveryMode);
  const total = orderTotal(book.price, form.quantity, fee);
  const homeFee = deliveryFeeFor(selectedWilaya, 'home');
  const deskFee = deliveryFeeFor(selectedWilaya, 'desk');
  const qty = Number(form.quantity) || 1;
  // Sous le total, en petit : son détail, ou pourquoi le frais n'y est pas encore.
  const breakdown = fee !== null
    ? <span dir="ltr">{`${qty} × ${book.price} + ${fee}`}</span>
    : (selectedWilaya ? S.order.deliveryLater : S.order.deliveryChooseWilaya);
  const border = (key) => (shownError(key) ? 'border-rose-400' : 'border-slate-300');
  const showMore = moreOpen || Boolean(form.email || form.customerNote);

  return (
    <form
      onSubmit={submit}
      // Premier champ touché = le visiteur COMMENCE sa commande (Meta : InitiateCheckout, une seule fois).
      onFocusCapture={() => {
        if (startedRef.current) return;
        startedRef.current = true;
        trackPixel('InitiateCheckout', { content_name: book.title, content_ids: [book.slug], content_type: 'product', value: book.price, currency: 'DZD' });
      }}
      className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-8"
      noValidate
    >
      {/* Téléphone : le titre, le paiement à la réception et les trois étapes tiennent en deux
          lignes (la page cache ses propres titre et étapes sous sm). */}
      <div className="mb-2.5 sm:hidden">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-space text-lg font-bold text-slate-900">{S.detail.orderTitle}</h2>
          <span className="flex-none rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-inter text-xs font-bold text-emerald-700">{S.order.submitCod}</span>
        </div>
        <ol className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-inter text-xs text-slate-500">
          {S.detail.stepsShort.map((step, i) => (
            <li key={step} className="flex items-center gap-1">
              <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-blue-50 font-space text-[10px] font-bold text-blue-700">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-2 sm:gap-4">
        <div className="grid gap-2 sm:gap-4 md:grid-cols-2">
          <div>
            <div className="relative">
              <label className={lbl} htmlFor="bo-name">{S.order.name}</label>
              <input
                ref={nameRef} id="bo-name" autoComplete="name" enterKeyHint="next"
                aria-invalid={Boolean(shownError('customerName'))} aria-describedby="bo-name-err"
                className={`${field} ${border('customerName')}`} value={form.customerName}
                onChange={set('customerName')} onBlur={touch('customerName')}
              />
            </div>
            {shownError('customerName') && <p id="bo-name-err" className={errCls}>{shownError('customerName')}</p>}
          </div>
          <div>
            <div className="relative">
              <label className={lbl} htmlFor="bo-phone">{S.order.phone}</label>
              <input
                ref={phoneRef} id="bo-phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" enterKeyHint="next"
                placeholder={S.order.phonePlaceholder}
                aria-invalid={Boolean(shownError('phone'))} aria-describedby="bo-phone-err"
                className={`${field} ${border('phone')} text-end tracking-wide`} value={form.phone}
                onChange={set('phone')} onBlur={touch('phone')}
              />
            </div>
            {shownError('phone') && <p id="bo-phone-err" className={errCls}>{shownError('phone')}</p>}
          </div>
        </div>

        {/* La wilaya et la commune côte à côte, même sur 360 px : leur libellé est dans le champ. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="min-w-0">
            <SearchSelect
              ref={wilayaRef} id="bo-wilaya" label={S.order.wilaya} value={form.wilaya} options={wilayaOptions}
              onChange={pickWilaya} extras={wilayaExtras} extrasTitle={S.order.wilayaByCommune}
              placeholder={S.order.wilayaPlaceholder} searchPlaceholder={S.order.wilayaSearch} emptyText={S.order.wilayaEmpty}
              loading={!wilayas.length} invalid={Boolean(shownError('wilaya'))} describedBy="bo-wilaya-err"
            />
            {shownError('wilaya') && <p id="bo-wilaya-err" className={errCls}>{shownError('wilaya')}</p>}
          </div>
          <div className="min-w-0">
            <SearchSelect
              ref={communeRef} id="bo-commune" label={S.order.commune} value={form.commune} options={communeOptions}
              onChange={pickCommune} placeholder={S.order.communePlaceholder} searchPlaceholder={S.order.communeSearch}
              emptyText={S.order.communeEmpty} disabled={!selectedWilaya} disabledHint={S.order.communeDisabled}
              loading={Boolean(selectedWilaya) && !communes} invalid={Boolean(shownError('commune'))} describedBy="bo-commune-err"
            />
            {shownError('commune') && <p id="bo-commune-err" className={errCls}>{shownError('commune')}</p>}
          </div>
        </div>

        {/* Le mode de livraison : deux segments sur UNE ligne, chacun dit SON frais. */}
        <fieldset className="min-w-0">
          <legend className="sr-only">{S.order.deliveryMode}</legend>
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-300 bg-slate-50 p-1">
            {DELIVERY_MODES.map((mode) => {
              const checked = form.deliveryMode === mode;
              const modeFee = mode === 'home' ? homeFee : deskFee;
              const Icon = mode === 'home' ? Home : Store;
              return (
                <label
                  key={mode}
                  className={`flex min-h-11 min-w-0 cursor-pointer flex-col items-center justify-center rounded-lg px-1 py-1 text-center transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-300 ${checked ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-500' : 'text-slate-700 hover:bg-white/70'}`}
                >
                  <input
                    type="radio" name="bo-delivery" value={mode} checked={checked}
                    onChange={() => setForm((f) => ({ ...f, deliveryMode: mode }))}
                    className="sr-only"
                  />
                  <span className="flex min-w-0 items-center gap-1 font-inter text-sm font-bold leading-tight">
                    <Icon size={15} aria-hidden="true" className="shrink-0" />
                    <span className="truncate">{S.order.deliveryModes[mode]}</span>
                  </span>
                  {modeFee !== null && (
                    <span dir="ltr" className={`font-space text-xs font-bold leading-tight ${checked ? 'text-slate-900' : 'text-slate-500'}`}>{formatDa(modeFee)}</span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Pot de miel : hors écran, hors tabulation, hors lecteur d'écran. */}
      <div aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '-9999px', height: 0, overflow: 'hidden' }}>
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} name="website" />
      </div>

      {/* La quantité et le total sur UNE ligne juste au-dessus du bouton : le client voit ce
          qu'il paiera. Jamais un total qui tait un frais CONNU : le libellé dit si le frais y est. */}
      <div className="mt-2.5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-1.5 sm:mt-6 sm:p-3">
        <div className="inline-flex flex-none items-center rounded-xl border border-slate-300 bg-white">
          <button type="button" onClick={() => setQty(-1)} disabled={qty <= 1} aria-label="-" className="flex h-11 w-10 items-center justify-center rounded-s-xl text-slate-700 enabled:hover:bg-slate-100 disabled:opacity-30"><Minus size={16} /></button>
          {/* Le nombre se TAPE aussi (chiffres arabes ou latins), borné à 1–10 ; vide le temps de la frappe. */}
          <input
            id="bo-qty" dir="ltr" type="text" inputMode="numeric" autoComplete="off" enterKeyHint="done"
            aria-label={S.order.quantity} value={form.quantity}
            onChange={(event) => {
              const digits = event.target.value.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/\D/g, '');
              setForm((f) => ({ ...f, quantity: digits === '' ? '' : Math.min(10, Number(digits)) }));
              clearServer('quantity');
            }}
            onBlur={() => setForm((f) => ({ ...f, quantity: Math.max(1, Number(f.quantity) || 1) }))}
            onFocus={(event) => event.target.select()}
            className="h-11 w-9 border-0 bg-transparent text-center font-space text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button type="button" onClick={() => setQty(1)} disabled={Number(form.quantity) >= 10} aria-label="+" className="flex h-11 w-10 items-center justify-center rounded-e-xl text-slate-700 enabled:hover:bg-slate-100 disabled:opacity-30"><Plus size={16} /></button>
        </div>
        <div className="min-w-0 text-end leading-tight" aria-live="polite">
          <p className="font-inter text-xs font-semibold text-slate-500">{fee !== null ? S.order.totalOnDelivery : S.order.total}</p>
          <p dir="ltr" className="font-space text-xl font-bold text-slate-900">{formatDa(total)}</p>
          <p className="whitespace-nowrap font-inter text-xs text-slate-500">{breakdown}</p>
        </div>
      </div>
      {serverErrors.quantity && <p className={errCls}>{S.order.errors.quantity}</p>}

      {error && <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-inter text-sm text-rose-700">{error}</p>}

      {/* `key` change quand le formulaire devient complet : l'animation repart de zéro. */}
      <button
        key={pulseKey}
        type="submit"
        disabled={busy}
        data-ready={ready || undefined}
        className={`mt-2 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 font-space text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 sm:mt-5 sm:min-h-[60px] ${pulseKey > 0 ? 'motion-safe:animate-cta-ready' : ''}`}
      >
        {busy && <Loader2 size={18} className="animate-spin" />}
        {busy ? S.order.sending : S.order.submit}
      </button>

      {/* Les champs FACULTATIFS sont repliés derrière un lien : chaque champ visible de plus
          coûte des commandes, surtout sur téléphone. Ouverts d'office s'ils sont déjà remplis. */}
      <div className="-mb-2 flex items-center justify-between gap-3 font-inter text-xs">
        <p className="flex min-w-0 items-center gap-1 text-slate-500"><MapPin size={12} aria-hidden="true" className="shrink-0" />{S.order.callNote}</p>
        {!showMore && (
          <button type="button" onClick={() => setMoreOpen(true)} aria-expanded={false} aria-controls="bo-more" className="flex min-h-11 flex-none items-center font-semibold text-blue-700 hover:underline">
            {S.order.optionalMore}
          </button>
        )}
      </div>
      {showMore && (
        <div id="bo-more" className="mt-2 grid gap-2.5 sm:gap-4 md:grid-cols-2">
          <div className="relative">
            <label className={lbl} htmlFor="bo-email">{S.order.email}</label>
            <input id="bo-email" type="email" dir="ltr" autoComplete="email" className={`${field} border-slate-300 text-end`} value={form.email} onChange={set('email')} />
          </div>
          <div className="relative">
            <label className={lbl} htmlFor="bo-note">{S.order.note}</label>
            <input id="bo-note" className={`${field} border-slate-300`} value={form.customerNote} onChange={set('customerNote')} />
          </div>
        </div>
      )}
    </form>
  );
}
