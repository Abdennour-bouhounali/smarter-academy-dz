import { useTranslation } from 'react-i18next';
import { PencilRuler } from 'lucide-react';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { MATH_LAB_TOOLS, PLANNED_MATH_LAB_TOOLS } from '../toolRegistry';
import { mathLabBasePath } from '../mathLabDocument';
import { useWorkspaceBase } from '../../learning/learningViewer';
import ToolCard from './ToolCard';
import MyWorkSpace from '../work/MyWorkSpace';
import NewWorkMenu from '../work/NewWorkMenu';
import QuotaMeter from '../../../components/access/QuotaMeter';
import { useFeatureAccess } from '../../../hooks/useFeatureAccess';
import { DOCUMENTS_FEATURE, featureState, isToolVisible, toolFeatureKey } from '../../access/featureAccess';
import '../mathlab.css';
import '../work/mathlabWork.css';
// La confirmation de suppression et la feuille de filtres sont celles du
// cahier (ConfirmDialog, `.sa-ns-sheet`) ; leurs styles vivent dans la
// feuille de « Mon cahier ».
import '../../practice/notebook/space/notebookSpace.css';

/**
 * L'accueil du مختبر الرياضيات (/espace/atelier) : les instruments
 * disponibles, ceux qui viennent, et « أعمالي ». Même cadre que les autres
 * pages de l'espace (`.sa-page`), même en-tête (sur-titre, titre, sous-titre).
 *
 * Les instruments annoncés sont des PASTILLES désactivées, pas des cartes :
 * une carte ressemble à quelque chose qu'on ouvre.
 *
 * « أعمالي » n'est plus une liste au bas de la page mais un ATELIER
 * (features/mathlab/work/) : on y cherche, on y filtre, on y trie, on y
 * sélectionne et on y range. Il garde sa place — sous les instruments —
 * parce que l'ordre du geste est le bon : on ouvre un instrument, puis on
 * revient à ce qu'on y a fait.
 */
export default function MathLabHome() {
  const { t } = useTranslation('mathlab');
  useDocumentMeta(t('metaTitle'), t('metaDescription'));
  const labRoot = mathLabBasePath(useWorkspaceBase());
  // « الوصول والحدود » : lu, jamais décidé ici. Un instrument coupé par
  // l'administration disparaît ; un instrument fermé au palier reste montré,
  // avec son cadenas — sa page explique pourquoi.
  const { summary } = useFeatureAccess();
  const tools = MATH_LAB_TOOLS.filter((tool) => isToolVisible(summary, tool.id));
  const documents = featureState(summary, DOCUMENTS_FEATURE);

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
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} locked={!featureState(summary, toolFeatureKey(tool.id)).allowed} />
          ))}
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
        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <h2 id="ml-work-heading" className="font-space font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">{t('myWork')}</h2>
            <p className="font-inter text-slate-500 text-xs">{t('myWorkHint')}</p>
            {documents.quota && <QuotaMeter quota={documents.quota} className="mt-2" />}
          </div>
          <NewWorkMenu labRoot={labRoot} tools={tools} />
        </div>
        <MyWorkSpace labRoot={labRoot} />
      </section>
    </div>
  );
}
