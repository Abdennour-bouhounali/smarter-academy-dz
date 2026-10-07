import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowForward } from '../../components/common/DirectionalIcons';
import IslamicContentRenderer, { renderKind } from './IslamicContentRenderer';

/**
 * « 🌿 وقفة إيمانية » — une pause ENTRE deux étapes d'étude (fin d'un
 * module, avant le suivant). Elle ne bloque rien : pas de modal, pas de
 * case « قرأت », pas de points. « أكمل الدراسة » continue tout de suite
 * (`onContinue`, sinon la pause se replie) ; les autres commandes de la page
 * restent utilisables pendant qu'elle est là.
 */
export default function IslamicBreak({ item, onContinue, className = '' }) {
  const { t } = useTranslation('common');
  const [closed, setClosed] = useState(false);
  if (closed || !renderKind(item)) return null;
  const handleContinue = () => {
    if (onContinue) onContinue();
    else setClosed(true);
  };
  return (
    <section
      dir="rtl"
      aria-labelledby={`islamic-break-${item.id}`}
      className={`sa-islamic-surface rounded-2xl border border-emerald-100 p-4 sm:p-5 ${className}`}
      data-islamic-break
    >
      <h2 id={`islamic-break-${item.id}`} className="mb-3 font-space text-sm font-bold text-emerald-900">
        <span aria-hidden="true">🌿 </span>{t('islamic.breakTitle')}
      </h2>
      <IslamicContentRenderer item={item} />
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          data-islamic-continue
        >
          {t('islamic.continueStudy')} <ArrowForward size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
