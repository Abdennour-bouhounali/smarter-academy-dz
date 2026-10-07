import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, ArrowUp, ArrowDown, CornerDownLeft, X, Sparkles, LogIn, Compass, GraduationCap, HelpCircle, Mail, Users } from 'lucide-react';

// Les commandes portent des CLÉS, pas des libellés : la liste est un
// constant de module, donc évaluée une fois au chargement — un `t()` écrit
// ici aurait figé la traduction avant l'initialisation d'i18next. Les
// libellés sont résolus au rendu, ce qui fait aussi que la RECHERCHE filtre
// sur le texte arabe réellement affiché.
const commands = [
  { id: 'register', labelKey: 'palette.startFree', path: '/register', icon: Sparkles, groupKey: 'palette.groupMain' },
  { id: 'login', labelKey: 'palette.login', path: '/login', icon: LogIn, groupKey: 'palette.groupMain' },
  { id: 'home', labelKey: 'palette.home', path: '/', icon: Compass, groupKey: 'palette.groupNavigation' },
  { id: 'methode', labelKey: 'palette.method', path: '/methode', icon: GraduationCap, groupKey: 'palette.groupNavigation' },
  { id: 'about', labelKey: 'palette.about', path: '/about', icon: Users, groupKey: 'palette.groupNavigation' },
  { id: 'faq', labelKey: 'palette.faq', path: '/faq', icon: HelpCircle, groupKey: 'palette.groupNavigation' },
  { id: 'email', labelKey: 'palette.sendEmail', href: 'mailto:abdennour.bouhounali@gmail.com', external: true, icon: Mail, groupKey: 'palette.groupContact' },
];

export default function CommandPalette() {
  const { t } = useTranslation('marketing');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Les commandes, libellés résolus — c'est cette liste que tout le reste
  // (filtre, groupes, rendu) consomme.
  const localized = commands.map((c) => ({
    ...c,
    label: t(c.labelKey),
    group: t(c.groupKey),
  }));

  // Filter commands by query
  const filtered = query.trim()
    ? localized.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : localized;

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selected when filtered changes
  useEffect(() => {
    setSelected(0);
  }, [query]);

  const executeCommand = useCallback((cmd) => {
    setOpen(false);
    setQuery('');

    if (cmd.path) {
      navigate(cmd.path);
    } else if (cmd.external) {
      window.open(cmd.href, cmd.href.startsWith('mailto:') || cmd.href.startsWith('tel:') ? '_self' : '_blank');
    }
  }, [navigate]);

  const handleKeyNavigation = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[selected]) {
        executeCommand(filtered[selected]);
      }
    }
  };

  // Group filtered commands
  const groups = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <>
      {/* PAS DE PASTILLE FLOTTANTE. La palette s'ouvre au CLAVIER (Ctrl/⌘+K,
          géré plus haut) et par rien d'autre : son ancien déclencheur occupait
          le coin bas — physiquement à GAUCHE sous RTL, car il était posé en
          `end-6` — c'est-à-dire la colonne des repères de la leçon
          (« ⛶ عرض », « 🧠 بطاقتي », « 📓 كرّاسي »). Il y recouvrait le premier
          étage et interceptait ses clics. Le coin appartient désormais à la
          leçon ; la recherche garde son raccourci. */}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                  <Search size={17} className="text-slate-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyNavigation}
                    placeholder={t('palette.placeholder')}
                    className="flex-1 bg-transparent font-inter text-sm text-slate-800 placeholder-slate-400 outline-none"
                    id="command-palette-input"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Commands list */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 font-inter text-sm">
                      {t('palette.noResults')}
                    </div>
                  ) : (
                    Object.entries(groups).map(([group, cmds]) => (
                      <div key={group}>
                        <p className="px-4 py-1.5 font-inter text-xs font-semibold text-slate-400 uppercase tracking-widest">
                          {group}
                        </p>
                        {cmds.map((cmd) => {
                          const idx = globalIdx++;
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => executeCommand(cmd)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-start transition-all duration-100 ${
                                selected === idx
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                selected === idx ? 'bg-blue-100' : 'bg-slate-100'
                              }`}>
                                <cmd.icon size={14} />
                              </div>
                              <span className="font-inter text-sm font-medium">{cmd.label}</span>
                              {selected === idx && (
                                // ml-auto pushes to the row's trailing end; under
                                // RTL that's the physical left, so it flips to
                                // mr-auto. CornerDownLeft is the ⏎ Enter-key
                                // glyph itself (a fixed keyboard symbol), not a
                                // navigation arrow — never mirrored.
                                <span className="ms-auto">
                                  <CornerDownLeft size={13} className="text-blue-400" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer hints */}
                <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-4 text-slate-400 text-xs font-mono-jetbrains">
                  <span className="flex items-center gap-1.5">
                    <ArrowUp size={11} />
                    <ArrowDown size={11} />
                    {t('palette.navigate')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CornerDownLeft size={11} />
                    {t('palette.select')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold">Esc</span>
                    {t('palette.close')}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
