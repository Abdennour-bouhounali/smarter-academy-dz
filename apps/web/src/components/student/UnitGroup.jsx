import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';
import { ArrowForward } from '../common/DirectionalIcons';
import { getLessonProgress } from '../../lessons/common/utils/progress/getLessonProgress';
import { getTotalModules } from '../../lessons/registry';
import MathLabel from '../../lessons/common/components/MathLabel';

/**
 * La CARTE d'une UNITÉ du manuel (الوحدة) dans la grille des cours : le
 * niveau que l'élève choisit après le ميدان et avant le درس. Elle mène à la
 * page d'unité, qui liste les leçons dans l'ordre du manuel ; la carte
 * elle-même ne montre que le titre, le nombre de leçons, un aperçu
 * (sous-titre ou objectifs) et la progression — dans la forme d'une carte
 * de leçon (2026-10-07, demande du propriétaire).
 *
 * `layout="rows"` (disposition « قائمة » du catalogue, catalogueView.js) :
 * la même unité en une ligne — numéro, titre, nombre de leçons, progression.
 *
 * forwardRef : rendue dans <AnimatePresence mode="popLayout">, qui lui
 * passe une ref pour mesurer la sortie (comme LessonCard).
 */
const UnitGroup = forwardRef(function UnitGroup({ unit, layout = 'grid' }, ref) {
  const { t } = useTranslation('student');
  const { t: tc } = useTranslation('common');
  const done = unit.lessons.filter((l) => l.status === 'available' && getLessonProgress(l.id, getTotalModules(l.id)).progressPercent >= 100).length;
  const pct = unit.lessons.length ? Math.round((done / unit.lessons.length) * 100) : 0;
  const tally = (
    <span dir="ltr" className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-jetbrains text-[10px] font-bold ${pct >= 100 ? 'bg-emerald-50 text-emerald-700' : pct > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}>{pct >= 100 ? '✓ ' : ''}{done}/{unit.lessons.length}</span>
  );
  const count = `${tc('lessonsCount', { count: unit.lessons.length })}${unit.synthesis ? ` + ${t('unit.synthesisTitle')}` : ''}`;
  // L'aperçu : le sous-titre de l'unité, sinon ses objectifs — sur trois
  // lignes au plus, comme la description d'une carte de leçon.
  const preview = unit.subtitle || unit.objectives.slice(0, 3).join(' · ');
  const progressBar = pct > 0 && (
    <span className="absolute bottom-0 inset-x-0 h-1 bg-slate-100" aria-hidden="true">
      <span className={`block h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
    </span>
  );

  if (layout === 'rows') {
    return (
      <motion.div ref={ref} layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
        <Link to={unit.path} data-unit-group={unit.id}
          className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:px-4 transition-all hover:border-blue-300 hover:shadow-sm">
          {unit.icon
            ? <span className="text-2xl shrink-0" aria-hidden="true">{unit.icon}</span>
            : <Layers size={24} className="shrink-0 text-blue-600" aria-hidden="true" />}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-indigo-600">{t('unit.unitNumber', { n: unit.number })}</div>
            <h4 className="truncate font-space font-bold text-[15px] text-slate-900 group-hover:text-blue-600 transition-colors">{unit.title}</h4>
          </div>
          {tally}
          <span className="hidden sm:inline shrink-0 text-xs font-mono-jetbrains text-slate-400">{count}</span>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-blue-600 transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1">
            <span className="hidden md:inline">{t('unit.unitCard.open')}</span> <ArrowForward size={14} />
          </span>
          {progressBar}
        </Link>
      </motion.div>
    );
  }

  // La carte d'unité a la FORME d'une carte de leçon (LessonCard, état
  // ouvert) : même fond, même bordure, même case de grille, même pied —
  // seuls l'icône, la pastille « الوحدة n » et le compte disent l'unité.
  return (
    <motion.div ref={ref} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="h-full">
      <Link to={unit.path} data-unit-group={unit.id}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            {unit.icon
              ? <span className="text-3xl transition-transform origin-bottom-left group-hover:scale-110" aria-hidden="true">{unit.icon}</span>
              : <Layers size={30} className="text-blue-600 transition-transform origin-bottom-left group-hover:scale-110" aria-hidden="true" />}
            {tally}
          </div>
          <div className="mb-1 text-[11px] font-semibold text-indigo-600">{t('unit.unitNumber', { n: unit.number })}</div>
          <h4 className="mb-2 font-space text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">{unit.title}</h4>
          {preview && <p className="mb-4 line-clamp-3 font-inter text-sm leading-relaxed text-slate-500"><MathLabel>{preview}</MathLabel></p>}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-mono-jetbrains text-slate-500">{count}</span>
          <span className="flex items-center gap-1 text-sm font-bold text-blue-600 transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1">
            {t('unit.unitCard.open')} <ArrowForward size={14} />
          </span>
        </div>
        {progressBar}
      </Link>
    </motion.div>
  );
});

export default UnitGroup;
