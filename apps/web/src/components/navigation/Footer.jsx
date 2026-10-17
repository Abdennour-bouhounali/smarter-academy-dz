import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { ArrowForward } from '../common/DirectionalIcons';
import { useTranslation } from 'react-i18next';
import { navLinks } from '../../data/navigation';

export default function Footer() {
  const { t } = useTranslation('nav');
  const { t: tm } = useTranslation('marketing');
  return (
    <footer className="relative z-10 bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src="/smarter-academy-logo-sm.webp" width="216" height="144" decoding="async" alt="Smarter Academy" className="h-12 w-auto rounded-lg object-contain bg-white/10" />
              <div>
                <p className="font-space font-bold text-white text-lg">Smarter Academy</p>
              </div>
            </div>
            <p className="font-inter text-slate-400 text-sm leading-relaxed mb-4">
              {tm('footer.tagline')}
            </p>

            <p className="flex items-start gap-2 text-xs font-inter text-slate-400">
              <Mail size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <a href="mailto:abdennour.bouhounali@gmail.com" className="hover:text-white transition-colors break-words">abdennour.bouhounali@gmail.com</a>
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-space font-bold text-slate-300 text-sm mb-4 uppercase tracking-widest">{tm('footer.navigation')}</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-inter text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xs"
          >
            <h4 className="font-space font-bold text-slate-300 text-sm mb-4 uppercase tracking-widest">{tm('footer.joinUs')}</h4>
            <p className="font-inter text-slate-400 text-sm leading-relaxed mb-4">
              {tm('footer.joinBody')}
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
            >
              {tm('footer.startFree')}
              <ArrowForward size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6">
          {/* Les pages légales, dans le pied de page PARTAGÉ — donc présentes
              sur toutes les pages visiteur d'un coup, plutôt que recopiées
              page par page. C'est aussi là qu'on va les chercher. */}
          <nav aria-label={tm('footer.legalAria')} className="mb-5">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
              {[
                { to: '/confidentialite', label: tm('footer.privacy') },
                { to: '/cgu', label: tm('footer.terms') },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-inter text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="font-inter text-slate-500 text-sm text-center">
              {tm('footer.rights', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-inter text-slate-500 text-xs">{tm('footer.motto')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
