import { useContext, useEffect, useState } from 'react';
import { Bell, BellOff, BellRing, Loader2, Smartphone } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { fetchOrderPush, removeOrderPushSubscription, saveOrderPushSubscription, testOrderPush } from '../../../features/books/bookService';
import { S } from '../../../features/books/strings';

const P = S.admin.push;

/** La clé publique VAPID (base64url) → les octets attendus par `pushManager.subscribe`. */
function keyBytes(base64url) {
  const pad = '='.repeat((4 - (base64url.length % 4)) % 4);
  const raw = atob((base64url + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const supported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const isIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
const installed = () => typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true);

/**
 * « إشعارات الطلبات الجديدة » — sur la page « طلبات الكتب » : active, sur CET appareil, une
 * notification à chaque nouvelle commande de livre (BOOKS_STORE.md §6quater). Le service worker
 * `/sw.js` n'est enregistré qu'ici, au clic : jamais sur l'appareil d'un élève.
 * Propose aussi d'ajouter le site à l'écran d'accueil quand Chrome le permet.
 */
export default function OrderNotifications() {
  const { token } = useContext(AuthContext);
  const [server, setServer] = useState(null); // { enabled, publicKey, devices }
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState(() => (supported() ? Notification.permission : 'unsupported'));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchOrderPush(token).then(setServer).catch(() => setServer({ enabled: false }));
    if (supported()) {
      navigator.serviceWorker.getRegistration('/').then((reg) => reg?.pushManager.getSubscription()).then((sub) => setSubscribed(Boolean(sub))).catch(() => {});
    }
  }, [token]);

  // Chrome propose l'installation : on garde l'événement pour un vrai bouton.
  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const enable = async () => {
    setBusy(true); setNote(null);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') return;
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription())
        ?? await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(server.publicKey) });
      await saveOrderPushSubscription(token, sub.toJSON());
      setSubscribed(true);
      setServer(await fetchOrderPush(token));
    } catch (e) {
      // Le navigateur refuse (permission, pas de service de notification) : un message arabe, la cause en clair à côté.
      setNote(e?.name === 'NotAllowedError' ? P.denied : `${P.failed} (${e?.message || e})`);
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true); setNote(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration('/');
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await removeOrderPushSubscription(token, sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
      setServer(await fetchOrderPush(token));
    } catch (e) {
      setNote(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true); setNote(null);
    try { await testOrderPush(token); setNote(P.testSent); } catch (e) { setNote(e?.message || String(e)); } finally { setBusy(false); }
  };

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => null);
    setInstallPrompt(null);
  };

  let body;
  if (!supported()) body = <p className="text-slate-600">{isIos() && !installed() ? P.iosInstall : P.unsupported}</p>;
  else if (server && !server.enabled) body = <p className="text-slate-600">{P.notConfigured}</p>;
  else if (permission === 'denied') body = <p className="text-rose-700">{P.denied}</p>;
  else {
    body = (
      <>
        <p className="text-slate-600">{subscribed ? P.on : P.off}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {subscribed ? (
            <>
              <button type="button" onClick={test} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
                <BellRing size={16} />{P.test}
              </button>
              <button type="button" onClick={disable} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                <BellOff size={16} />{P.disable}
              </button>
            </>
          ) : (
            <button type="button" onClick={enable} disabled={busy || !server?.publicKey} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}{P.enable}
            </button>
          )}
        </div>
      </>
    );
  }

  return (
    <section className="mb-6 rounded-2xl border border-violet-200 bg-violet-50/50 p-4 font-inter text-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-space text-base font-bold text-slate-900"><Bell size={18} className="text-violet-600" />{P.title}</h2>
        {server?.devices > 0 && <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">{P.devices(server.devices)}</span>}
      </div>
      <div className="mt-2">{body}</div>
      {note && <p className="mt-2 text-xs font-medium text-slate-700">{note}</p>}
      {!installed() && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-violet-100 pt-3 text-xs text-slate-500">
          <Smartphone size={14} className="flex-none" />
          {installPrompt
            ? <button type="button" onClick={install} className="min-h-9 rounded-lg bg-white px-3 font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50">{P.installButton}</button>
            : <span>{isIos() ? P.iosInstall : P.install}</span>}
        </div>
      )}
    </section>
  );
}
