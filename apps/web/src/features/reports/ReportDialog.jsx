import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Check, TriangleAlert, Camera, ImagePlus } from 'lucide-react';
import { REPORT_CATEGORIES } from '../../services/reportService';
import ScreenshotAnnotator from './ScreenshotAnnotator';
import { captureRegion, capturePage, loadImageFile, exportAnnotated, IGNORE_ATTRIBUTE } from './screenshot';
import ScreenSnipper from './ScreenSnipper';

/**
 * Le formulaire de signalement.
 *
 * Boîte de dialogue et non panneau en ligne : le signalement peut partir du
 * sommaire d'une leçon comme du bas d'un module, et une fenêtre centrée se
 * comporte pareil dans les deux cas — un panneau, lui, dépend de la place
 * qu'il reste autour de lui.
 *
 * Accessibilité tenue ici plutôt que laissée à l'appelant : role="dialog" +
 * aria-modal, focus déplacé dedans à l'ouverture et rendu au déclencheur à la
 * fermeture, Échap ferme, Tab reste piégé, et les catégories sont de VRAIS
 * boutons radio (radiogroup) — pas des <div> cliquables, qui ne se
 * parcourent pas aux flèches.
 *
 * CAPTURE D'ÉCRAN (facultative, 2026-10-05) : « التقاط الصفحة » photographie
 * la partie visible de la page SANS cette fenêtre (attribut
 * data-report-ignore), « رفع صورة » prend une image du relecteur ; dans les
 * deux cas il encadre la zone fautive (ScreenshotAnnotator) et les cadres
 * sont brûlés dans l'image à l'envoi.
 */
export default function ReportDialog({ open, onClose, onSubmit, busy, error, submitted }) {
  const { t } = useTranslation('common');
  const [category, setCategory] = useState(null);
  const [note, setNote] = useState('');
  const [shot, setShot] = useState(null);
  const [marks, setMarks] = useState([]);
  const [capturing, setCapturing] = useState(false);
  // L'outil de capture est ouvert : la fenêtre se RETIRE (ni fond, ni piège à
  // focus, ni défilement bloqué) le temps que le relecteur choisisse sa région.
  const [snipping, setSnipping] = useState(false);
  const active = open && !snipping;
  const [shotError, setShotError] = useState(null);
  const fileRef = useRef(null);
  const panelRef = useRef(null);
  const firstRadioRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    previouslyFocused.current = document.activeElement;
    // Le focus va sur la première option, pas sur le panneau : l'élève arrive
    // directement sur ce qu'il doit choisir.
    const timer = setTimeout(() => (firstRadioRef.current ?? panelRef.current)?.focus(), 0);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      // Piège à focus : sans lui, Tab sort de la fenêtre et l'élève tabule
      // dans la leçon derrière, invisible.
      const focusables = panelRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [active, onClose]);

  // Repart d'une page blanche à chaque ouverture : un choix laissé d'une fois
  // sur l'autre serait pris pour le signalement en cours.
  useEffect(() => {
    if (open) {
      setCategory(null);
      setNote('');
      setShot(null);
      setMarks([]);
      setShotError(null);
      setSnipping(false);
    }
  }, [open]);

  if (!open) return null;

  const adoptCanvas = (canvas) => {
    setShot(canvas);
    setMarks([]);
    setShotError(null);
  };

  // « التقاط منطقة » : la fenêtre se retire, l'outil de capture prend la
  // main ; la région choisie revient dans la fenêtre, qui réapparaît.
  const capture = () => {
    setShotError(null);
    setSnipping(true);
  };

  const finishCapture = async (take) => {
    setCapturing(true);
    try {
      adoptCanvas(await take());
    } catch {
      setShotError(t('report.screenshot.captureFailed'));
    } finally {
      setCapturing(false);
      setSnipping(false);
    }
  };

  const pickFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      adoptCanvas(await loadImageFile(file));
    } catch {
      setShotError(t('report.screenshot.unsupported'));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!category || busy) return;
    const screenshot = shot ? await exportAnnotated(shot, marks) : null;
    onSubmit({ category, note: note.trim(), screenshot });
  };

  // Rendu dans <body> (portail) : le bouton vit dans la rangée de repères
  // du module, qui forme son propre contexte d'empilement — sans portail, la
  // barre de navigation du site passait PAR-DESSUS la fenêtre et l'outil.
  const portal = (node) => (typeof document === 'undefined' ? node : createPortal(node, document.body));

  if (snipping) {
    return portal(
      <ScreenSnipper
        busy={capturing}
        onSelect={(rect) => finishCapture(() => captureRegion(rect))}
        onFullScreen={() => finishCapture(() => capturePage())}
        onCancel={() => setSnipping(false)}
      />,
    );
  }

  return portal(
    <div
      {...{ [IGNORE_ATTRIBUTE]: '' }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        // onMouseDown et non onClick : un glissement commencé DANS la fenêtre
        // et relâché sur le fond la fermerait.
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
        tabIndex={-1}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-xl outline-none sm:rounded-2xl"
      >
        {submitted ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check size={22} aria-hidden="true" />
            </div>
            <h2 id="report-dialog-title" className="font-space text-lg font-bold text-slate-900">
              {t('report.successTitle')}
            </h2>
            <p className="mt-1 font-inter text-sm text-slate-500">
              {t('report.successBody')}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 font-inter text-sm font-semibold text-white"
            >
              {t('continue')}
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 id="report-dialog-title" className="font-space text-lg font-bold text-slate-900">
                  {t('report.title')}
                </h2>
                <p className="font-inter text-xs text-slate-500">
                  {t('report.subtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('close')}
                className="-me-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <fieldset>
                <legend className="mb-2 font-inter text-sm font-semibold text-slate-700">
                  {t('report.legend')}
                </legend>

                <div role="radiogroup" aria-labelledby="report-dialog-title" className="space-y-1.5">
                  {REPORT_CATEGORIES.map((option, index) => {
                    const selected = category === option.id;

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 transition-colors ${
                          selected
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          ref={index === 0 ? firstRadioRef : undefined}
                          type="radio"
                          name="report-category"
                          value={option.id}
                          checked={selected}
                          onChange={() => setCategory(option.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                        />
                        <span className="min-w-0">
                          <span className={`block font-inter text-sm ${selected ? 'font-semibold text-blue-900' : 'text-slate-800'}`}>
                            {t(`report.categories.${option.id}.label`, option.label)}
                          </span>
                          <span className="block font-inter text-xs text-slate-500">
                            {t(`report.categories.${option.id}.hint`, option.hint)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="report-note" className="font-inter text-sm font-semibold text-slate-700">
                  {category === 'other' ? t('report.noteLabelOther') : t('report.noteLabel')}{' '}
                  <span className="font-normal text-slate-400">{t('report.noteOptional')}</span>
                </label>
                <textarea
                  id="report-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder={t('report.notePlaceholder')}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-inter text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <section aria-labelledby="report-screenshot-title" className="space-y-2">
                <h3 id="report-screenshot-title" className="font-inter text-sm font-semibold text-slate-700">
                  {t('report.screenshot.title')}{' '}
                  <span className="font-normal text-slate-400">{t('report.noteOptional')}</span>
                </h3>
                {shot ? (
                  <ScreenshotAnnotator
                    source={shot}
                    rects={marks}
                    onChange={setMarks}
                    onRemove={() => { setShot(null); setMarks([]); }}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={capture}
                      disabled={capturing}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 font-inter text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Camera size={16} aria-hidden="true" />
                      {capturing ? t('report.screenshot.capturing') : t('report.screenshot.capture')}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 font-inter text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ImagePlus size={16} aria-hidden="true" /> {t('report.screenshot.upload')}
                    </button>
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={pickFile} />
                  </div>
                )}
                {shotError && <p role="alert" className="font-inter text-xs text-rose-700">{shotError}</p>}
              </section>

              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 p-2.5 font-inter text-xs text-rose-800">
                  <TriangleAlert size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 font-inter text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={!category || busy}
                className="rounded-lg bg-slate-900 px-5 py-2.5 font-inter text-sm font-semibold text-white disabled:opacity-40"
              >
                {busy ? t('report.sending') : t('report.send')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
  );
}
