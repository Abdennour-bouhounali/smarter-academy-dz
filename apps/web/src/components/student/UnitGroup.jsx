import React from 'react';
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
 * elle-même ne montre que le titre, le nombre de leçons, les objectifs
 * (aperçu) et la progression.
 */
export default function UnitGroup({ unit }) {
  const { t } = useTranslation('student');
  const { t: tc } = useTranslation('common');
  const done = unit.lessons.filter((l) => l.status === 'available' && getLessonProgress(l.id, getTotalModules(l.id)).progressPercent >= 100).length;
  const pct = unit.lessons.length ? Math.round((done / unit.lessons.length) * 100) : 0;
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="h-full sm:col-span-2">
      <Link to={unit.path} data-unit-group={unit.id}
        className="group flex h-full flex-col justify-between gap-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-5 shadow-xs transition-all hover:border-indigo-400 hover:shadow-md">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white" aria-hidden="true"><Layers className="h-5 w-5" /></span>
            <span dir="ltr" className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${pct >= 100 ? 'bg-emerald-50 text-emerald-700' : pct > 0 ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-500'}`}>{done}/{unit.lessons.length}</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-600">{t('unit.unitNumber', { n: unit.number })}</div>
          <h4 className="text-lg font-bold text-slate-900">{unit.title}</h4>
          {unit.subtitle && <p className="line-clamp-2 text-sm text-slate-600">{unit.subtitle}</p>}
          <ul className="space-y-0.5 text-xs text-slate-600">
            {unit.objectives.slice(0, 3).map((o) => <li key={o}>• <MathLabel>{o}</MathLabel></li>)}
          </ul>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-indigo-100 pt-3">
          <span className="text-xs text-slate-500">{tc('lessonsCount', { count: unit.lessons.length })}{unit.synthesis ? ` + ${t('unit.synthesisTitle')}` : ''}</span>
          <span className="flex items-center gap-1 text-sm font-bold text-indigo-700 transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1">
            {t('unit.unitCard.open')} <ArrowForward size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
