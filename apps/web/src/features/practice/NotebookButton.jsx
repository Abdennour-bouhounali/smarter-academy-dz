import { useState } from 'react';
import { NotebookPen, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Des CLÉS : constant de module, résolu au rendu (i18next n'est pas encore
// initialisé à l'évaluation du module).
const MISTAKE_TYPES = [
  { id: 'calcul', labelKey: 'notebook.mistakeCalcul' },
  { id: 'methode', labelKey: 'notebook.mistakeMethode' },
  { id: 'lecture', labelKey: 'notebook.mistakeLecture' },
  { id: 'signe', labelKey: 'notebook.mistakeSigne' },
  { id: 'etourderie', labelKey: 'notebook.mistakeEtourderie' },
];

/**
 * « Noter dans mon carnet » — une note durable, rattachée à l'exercice, à la
 * question et au point d'apprentissage travaillé.
 *
 * Disponible À TOUT MOMENT, et pas seulement après une réponse fausse : une
 * remarque vient souvent PENDANT la recherche (« ici je dois penser à… »),
 * et l'élève qui a juste peut avoir autant à noter que celui qui s'est
 * trompé. Le type d'erreur reste donc facultatif, et le libellé ne présume
 * pas d'une faute.
 *
 * Volontairement minimal : un champ, un type d'erreur optionnel. Le modèle
 * de données porte déjà de quoi construire « Mes erreurs par chapitre » ou
 * « par Learning Point ».
 *
 * @param {boolean} [compact] Rend le déclencheur sous forme d'icône seule,
 *   pour la barre d'outils d'une question en cours.
 */
export default function NotebookButton({ onSave, defaultType = null, compact = false }) {
  const { t } = useTranslation('student');
  const { t: tc } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mistakeType, setMistakeType] = useState(defaultType);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (saved) {
    // On ne fige pas l'état : une question peut mériter deux remarques, et
    // l'élève doit pouvoir en rouvrir une sans changer d'écran.
    return (
      <div className="inline-flex items-center gap-3 flex-wrap">
        <p className="inline-flex items-center gap-2 text-sm text-emerald-700 font-bold">
          <Check className="w-4 h-4" aria-hidden="true" /> {t('notebook.savedToNotebook')}
        </p>
        <button
          type="button"
          onClick={() => { setSaved(false); setContent(''); setMistakeType(defaultType); setOpen(true); }}
          className="text-sm font-bold text-slate-500 hover:text-slate-800 underline underline-offset-2 min-h-[44px]"
        >
          Ajouter une autre note
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={compact ? t('notebook.noteInMyNotebook') : undefined}
        className={
          compact
            ? 'inline-flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 text-sm font-bold'
            : 'inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 min-h-[44px]'
        }
      >
        <NotebookPen className="w-4 h-4" aria-hidden="true" />
        {compact ? <span className="sr-only sm:not-sr-only">{t('notebook.noteShort')}</span> : t('notebook.noteInMyNotebook')}
      </button>
    );
  }

  const save = async () => {
    if (!content.trim() || busy) return;
    setBusy(true);
    try {
      await onSave({ content: content.trim(), mistakeType });
      setSaved(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 space-y-3">
      <label className="block space-y-1">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">{t('notebook.yourNote')}</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder={t('notebook.notePlaceholder')}
          className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {/* Facultatif : une note n'est pas forcément une erreur. */}
        {/* `type` et non `t` : `t` est la fonction de traduction ici. */}
        {MISTAKE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setMistakeType(mistakeType === type.id ? null : type.id)}
            aria-pressed={mistakeType === type.id}
            className={`px-3 py-2 rounded-lg text-xs font-bold border-2 min-h-[40px] ${
              mistakeType === type.id ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            {t(type.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button" onClick={save} disabled={!content.trim() || busy}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm min-h-[44px] disabled:opacity-50"
        >
          {tc('save')}
        </button>
        <button
          type="button" onClick={() => setOpen(false)}
          className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-bold text-sm min-h-[44px]"
        >
          {tc('cancel')}
        </button>
      </div>
    </div>
  );
}
