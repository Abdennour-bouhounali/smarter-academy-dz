import { useTranslation } from 'react-i18next';
import { PencilRuler } from 'lucide-react';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { MATH_LAB_TOOLS, PLANNED_MATH_LAB_TOOLS } from '../toolRegistry';
import ToolCard from './ToolCard';
import DocumentList from './DocumentList';
import '../mathlab.css';
// La confirmation de suppression est celle du cahier (ConfirmDialog) ; ses
// styles vivent dans la feuille de « Mon cahier ».
import '../../practice/notebook/space/notebookSpace.css';

/**
 * L'accueil du مختبر الرياضيات (/espace/atelier) : les instruments
 * disponibles, ceux qui viennent, et « أعمالي ». Même cadre que les autres
 * pages de l'espace (`.sa-page`), même en-tête (sur-titre, titre, sous-titre).
 *
 * Les instruments annoncés sont des PASTILLES désactivées, pas des cartes :
 * une carte ressemble à quelque chose qu'on ouvre.
 */
export default function MathLabHome() {
  const { t } = useTranslation('mathlab');
  useDocumentMeta(t('metaTitle'), t('metaDescription'));

  return (
    <div className="sa-page py-8 sm:py-10" data-ml-home>
      <div className="mb-8">
        <p className="font-mono-jetbrains text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2 flex items-center gap-1.5">
          <PencilRuler size={13} aria-hidden="true" /> {t('eyebrow')}
        </p>
        <h1 className="font-space font-bold text-2xl sm:text-3xl text-slate-900">{t('title')}</h1>
        <p className="font-inter text-slate-500 text-sm mt-1">{t('subtitle')}</p>
        <p className="font-mono-jetbrains text-slate-400 text-xs mt-2" dir="rtl">{t('cycle')}</p>
      </div>

      <section className="mb-8" aria-labelledby="ml-tools-heading">
        <h2 id="ml-tools-heading" className="font-space font-bold text-slate-400 text-xs uppercase tracking-widest mb-3">{t('toolsHeading')}</h2>
        <div className="sa-ml-cards">
          {MATH_LAB_TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      {PLANNED_MATH_LAB_TOOLS.length > 0 && (
        <section className="mb-8" aria-labelledby="ml-planned-heading">
          <h2 id="ml-planned-heading" className="font-space font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">{t('plannedHeading')}</h2>
          <p className="font-inter text-slate-500 text-xs mb-3">{t('plannedHint')}</p>
          <ul className="sa-ml-planned" data-ml-planned>
            {PLANNED_MATH_LAB_TOOLS.map((tool) => {
              const Icon = tool.icon;

              return (
                <li key={tool.id} className="sa-ml-planned__item" aria-disabled="true">
                  <Icon size={15} aria-hidden="true" />
                  <span>{t(tool.labelKey)}</span>
                  <span className="sa-ml-planned__badge">{t('comingSoon')}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="ml-work-heading">
        <h2 id="ml-work-heading" className="font-space font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">{t('myWork')}</h2>
        <p className="font-inter text-slate-500 text-xs mb-3">{t('myWorkHint')}</p>
        <DocumentList />
      </section>
    </div>
  );
}
