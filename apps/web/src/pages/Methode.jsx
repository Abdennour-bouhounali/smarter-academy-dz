import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Compass, MapPin, Hand, Eye, HelpCircle, Lightbulb, FunctionSquare, Repeat2, Shuffle, Trophy, Sparkles,
} from 'lucide-react';
import CtaBanner from '../components/common/CtaBanner';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

// Each step already carries its "why" — no separate pillar grid repeating
// the same nine ideas from a second angle. One structure, not two.
// Les libellés vivent dans le namespace `marketing` (method.steps.<id>) :
// on ne stocke ici que les identifiants, résolus via t() au rendu.
const STEPS = [
  { id: 'situation', icon: MapPin },
  { id: 'manipulate', icon: Hand },
  { id: 'observe', icon: Eye },
  { id: 'question', icon: HelpCircle },
  { id: 'discover', icon: Lightbulb },
  { id: 'understand', icon: FunctionSquare },
  { id: 'practice', icon: Repeat2 },
  { id: 'apply', icon: Shuffle },
  { id: 'master', icon: Trophy },
];

export default function Methode() {
  const { t } = useTranslation('marketing');

  useDocumentMeta(t('method.metaTitle'), t('method.metaDescription'));

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-16 sm:py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono-jetbrains font-semibold uppercase tracking-wider mb-5">
              <Compass size={14} />
              {t('method.eyebrow')}
            </div>
            <h1 className="font-space font-bold text-4xl sm:text-5xl text-slate-900 mb-5 text-balance">
              {t('method.title')}
            </h1>
            <p className="font-inter text-slate-600 text-lg leading-relaxed">
              {t('method.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* The loop — unified grid, one structure not two */}
      <section className="section-wrapper pt-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              <span className="absolute top-4 end-5 font-mono-jetbrains text-2xl font-black text-slate-100 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4 relative"
                style={{ background: i === STEPS.length - 1 ? 'linear-gradient(135deg, #F59E0B, #F97316)' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
              >
                <step.icon size={20} />
              </div>
              <h3 className="font-space font-bold text-slate-900 text-base mb-2 relative">{t(`method.steps.${step.id}.title`)}</h3>
              <p className="font-inter text-slate-500 text-sm leading-relaxed relative">{t(`method.steps.${step.id}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core conviction */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass-card p-9 sm:p-12"
        >
          <Sparkles className="mx-auto mb-5 text-blue-400" size={26} />
          <p className="font-space font-bold text-xl sm:text-2xl text-slate-900 leading-snug text-balance mb-2">
            {t('method.closingLead')}
          </p>
          <p className="font-space font-bold text-xl sm:text-2xl gradient-text-blue-purple leading-snug text-balance">
            {t('method.closingPunch')}
          </p>
        </motion.div>
      </section>

      <CtaBanner
        eyebrow={t('method.ctaEyebrow')}
        title={t('method.ctaTitle')}
        subtitle={t('method.ctaBody')}
        primaryLabel={t('method.ctaSecondary')}
        primaryTo="/courses"
        secondaryLabel={t('method.ctaPrimary')}
        secondaryTo="/register"
      />
    </div>
  );
}
