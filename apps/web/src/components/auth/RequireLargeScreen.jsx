import { useSyncExternalStore } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Monitor } from 'lucide-react';

/**
 * LA PORTE DES ÉCRANS : les leçons (sommaire, modules) et les exercices ne
 * s'ouvrent que sur tablette ou ordinateur (décision du propriétaire,
 * 2026-10-27). Sur un téléphone, la route rend un message à la place du
 * contenu — rien de la leçon n'est chargé derrière.
 *
 * Téléphone = largeur < 768 px, OU un écran tactile de moins de 500 px de
 * haut (un téléphone tenu à l'horizontale dépasse 768 px de large). Une
 * tablette (≥ 768 px sur son petit côté) et un portable passent.
 */
export const PHONE_QUERY = '(max-width: 767px), (pointer: coarse) and (max-height: 500px)';

function subscribe(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const list = window.matchMedia(PHONE_QUERY);
  list.addEventListener?.('change', onChange);
  return () => list.removeEventListener?.('change', onChange);
}
const isPhone = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(PHONE_QUERY).matches);
const serverSnapshot = () => false;

export function useIsPhoneScreen() {
  return useSyncExternalStore(subscribe, isPhone, serverSnapshot);
}

export function LargeScreenOnlyNotice() {
  const { t } = useTranslation('common');
  return (
    <div dir="rtl" className="min-h-[70vh] flex items-center justify-center px-5 py-10 bg-slate-50">
      <div role="alert" className="max-w-sm w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Monitor aria-hidden="true" className="h-7 w-7" />
        </div>
        <h1 className="text-lg font-bold text-slate-900 leading-relaxed">{t('largeScreenOnlyTitle')}</h1>
        <p className="mt-2 text-slate-600 leading-relaxed">{t('largeScreenOnlyBody')}</p>
        <Link to="/espace" className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
          {t('largeScreenOnlyBack')}
        </Link>
      </div>
    </div>
  );
}

export default function RequireLargeScreen() {
  return useIsPhoneScreen() ? <LargeScreenOnlyNotice /> : <Outlet />;
}
