import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { S } from '../../../features/books/strings';

const A = S.admin;

/**
 * Les petites pièces partagées par la liste des commandes (`BookOrders`) et la fiche
 * d'une commande (`OrderDetailPanel`) : couleurs des états, sélecteurs d'état en pastille,
 * bouton « copier le numéro ». Les états sont en FRANÇAIS (owner, 2026-11-24).
 */

const CALL_TONES = {
  new: 'bg-amber-50 text-amber-700 border-amber-200',
  contacted: 'bg-sky-50 text-sky-700 border-sky-200',
  no_answer: 'bg-orange-50 text-orange-700 border-orange-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};

const DELIVERY_TONES = {
  none: 'bg-white text-slate-500 border-slate-200',
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  in_transit: 'bg-violet-50 text-violet-700 border-violet-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  returned: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const PAYMENT_TONES = {
  unpaid: 'bg-slate-100 text-slate-600 border-slate-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overpaid: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function Pill({ tone, children }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-inter text-xs font-semibold ${tone}`}>{children}</span>;
}

/** Le colis côté API (`null`) ↔ la clé d'affichage (`none`). */
export const deliveryKey = (status) => status ?? 'none';

/**
 * Une pastille qui EST le sélecteur : l'état se lit et se change au même endroit, à tout
 * moment (une erreur de clic se reprend). Le clic ne remonte pas à la ligne du tableau.
 */
function StatusSelect({ value, labels, tones, onChange, disabled, ariaLabel }) {
  return (
    <select
      dir="ltr"
      lang="fr"
      aria-label={ariaLabel}
      value={value}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value)}
      className={`cursor-pointer rounded-full border py-1 pe-7 ps-2.5 font-inter text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-60 ${tones[value]}`}
    >
      {Object.entries(labels).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
    </select>
  );
}

export function CallStatusSelect({ status, onChange, disabled }) {
  return <StatusSelect ariaLabel={A.columns.call} value={status} labels={A.callStatus} tones={CALL_TONES} disabled={disabled} onChange={onChange} />;
}

/** `onChange` reçoit `null` pour « Non expédiée ». */
export function DeliveryStatusSelect({ status, onChange, disabled }) {
  return (
    <StatusSelect
      ariaLabel={A.columns.delivery}
      value={deliveryKey(status)}
      labels={A.deliveryStatus}
      tones={DELIVERY_TONES}
      disabled={disabled}
      onChange={(key) => onChange(key === 'none' ? null : key)}
    />
  );
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Navigateur sans API presse-papiers (http, ancien WebView) : la vieille méthode.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

/** Le numéro, et à côté un bouton qui le copie en un toucher. */
export function CopyPhone({ phone, className = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = async (event) => {
    event.stopPropagation();
    if (await copyText(phone)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span dir="ltr" className="font-mono-jetbrains">{phone}</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? A.phoneCopied : A.copyPhone}
        title={copied ? A.phoneCopied : A.copyPhone}
        className={`rounded-md p-1.5 ${copied ? 'text-emerald-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </span>
  );
}
