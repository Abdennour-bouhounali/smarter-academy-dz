import { useCallback, useMemo, useState } from 'react';
import { NotebookPen, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLessonById } from '@smarter-academy/core';
import { useNotebook } from './notebook/NotebookProvider';

/**
 * « Noter dans mon carnet » — le déclencheur du cahier dans un exercice.
 *
 * Disponible À TOUT MOMENT, et pas seulement après une réponse fausse : une
 * remarque vient souvent PENDANT la recherche (« ici je dois penser à… »),
 * et l'élève qui a juste peut avoir autant à noter que celui qui s'est
 * trompé. Le type d'erreur reste donc facultatif, et le libellé ne présume
 * pas d'une faute.
 *
 * Le cahier lui-même est LE cahier de l'application (NotebookProvider) : la
 * même fenêtre qu'en leçon, ouverte ici sur le CONTEXTE RÉEL de la question
 * — leçon, point d'apprentissage, exercice, question, et, s'il y a eu une
 * réponse fausse, la réponse donnée et le verdict. Rien n'est inventé : sans
 * réponse, pas de bloc « خطئي ».
 *
 * Après un enregistrement, la note reste accessible d'ici (« افتح الملاحظة »
 * la rouvre pour la compléter — c'est la MÊME note, pas une seconde) ; et
 * « أضف ملاحظة أخرى » en commence une nouvelle, car une question peut
 * mériter deux remarques.
 *
 * @param {object} context  { lessonCode, exercise, question, answer, evaluation, feedbackMessage }
 * @param {(data) => Promise<{note}>} onSave     crée la note (POST, avec les codes de la séance)
 * @param {(id, patch) => Promise<{note}>} onUpdate  la modifie (PATCH)
 * @param {boolean} [compact]  icône seule, pour la barre d'outils d'une question en cours
 */
export default function NotebookButton({ context, onSave, onUpdate, defaultType = null, compact = false }) {
  const { t } = useTranslation('student');
  const { openNotebook } = useNotebook();
  const [savedNote, setSavedNote] = useState(null);

  // Le contexte d'exercice, complété des TITRES que le repère du cahier
  // affiche (« 📚 leçon › 📍 point ») : la leçon depuis le catalogue, le
  // point d'apprentissage principal de la question. Les codes, eux, partent
  // au serveur par `onSave` (PracticeSession les ajoute déjà).
  const fullContext = useMemo(() => {
    const lesson = getLessonById(context?.lessonCode);
    const lpCode = context?.question?.learningPoints?.find((lp) => lp.role === 'primary')?.code ?? null;

    return {
      ...context,
      lessonTitle: lesson?.title ?? context?.lessonCode ?? null,
      learningPointCode: lpCode,
      learningPointTitle: lesson?.learningPoints?.find((lp) => lp.id === lpCode)?.title ?? null,
      exerciseId: context?.exercise?.id ?? null,
      questionId: context?.question?.id ?? null,
    };
  }, [context]);

  const openNew = useCallback(() => openNotebook({
    context: fullContext,
    // Une note prise après une réponse fausse EST une erreur pour le cahier
    // (« أخطائي ») ; sans verdict ou avec une bonne réponse, une note.
    onCreate: (data) => onSave({
      ...data,
      mistakeType: data.mistakeType ?? defaultType,
      noteType: context?.evaluation && !context.evaluation.isCorrect ? 'erreur' : 'note',
    }),
    onUpdate,
    onSaved: setSavedNote,
  }), [openNotebook, fullContext, onSave, onUpdate, defaultType]);

  const openSaved = useCallback(() => openNotebook({
    note: savedNote,
    onUpdate,
    onSaved: setSavedNote,
  }), [openNotebook, savedNote, onUpdate]);

  const label = t('notebook.noteInMyNotebook');

  if (savedNote) {
    return (
      <div className="inline-flex items-center gap-3 flex-wrap">
        <p className="inline-flex items-center gap-2 text-sm text-emerald-700 font-bold">
          <Check className="w-4 h-4" aria-hidden="true" /> {t('notebook.savedToNotebook')}
        </p>
        <button
          type="button"
          onClick={openSaved}
          aria-haspopup="dialog"
          className="text-sm font-bold text-violet-700 hover:text-violet-900 underline underline-offset-2 min-h-[44px]"
        >
          {t('notebook.window.openSavedNote')}
        </button>
        <button
          type="button"
          onClick={openNew}
          aria-haspopup="dialog"
          className="text-sm font-bold text-slate-500 hover:text-slate-800 underline underline-offset-2 min-h-[44px]"
        >
          {t('notebook.addAnotherNote')}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={openNew}
      title={compact ? label : undefined}
      aria-haspopup="dialog"
      className={
        compact
          ? 'inline-flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl border-2 border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-800 text-sm font-bold'
          : 'inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-400 text-sm font-bold'
      }
    >
      <NotebookPen className="w-4 h-4" aria-hidden="true" />
      {compact ? <span className="sr-only sm:not-sr-only">{t('notebook.noteShort')}</span> : label}
    </button>
  );
}
