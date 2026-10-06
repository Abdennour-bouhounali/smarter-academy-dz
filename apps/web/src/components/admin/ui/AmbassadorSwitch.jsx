import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import { setTeacherAmbassador } from '../../../services/admin/teacherService';

/**
 * L'interrupteur « سفير » d'un enseignant — désigner / retirer en un geste.
 *
 * Un ambassadeur voit tout le contenu, quel qu'en soit l'état de publication,
 * et peut signaler un problème. Le geste est réversible et ne touche ni les
 * classes ni l'offre : pas de confirmation, l'état revient au serveur.
 */
export default function AmbassadorSwitch({ teacher, onChange, withLabel = false }) {
  const { t } = useTranslation('admin');
  const { token } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const on = Boolean(teacher.isAmbassador);
  const name = [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || teacher.email;

  const toggle = async () => {
    setBusy(true);
    setError(null);
    try {
      const updated = await setTeacherAmbassador(token, teacher.id, !on);
      onChange?.(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2" data-ambassador-switch>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t('teachers.ambassador.switchLabel', { name })}
        disabled={busy}
        onClick={toggle}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${on ? 'bg-amber-500' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0.5 rtl:-translate-x-0.5'}`} />
      </button>
      {withLabel && (
        <span className="font-inter text-xs font-semibold text-slate-700">
          {on ? t('teachers.ambassador.on') : t('teachers.ambassador.off')}
        </span>
      )}
      {error && <span role="alert" className="font-inter text-[11px] text-rose-600">{error}</span>}
    </span>
  );
}
