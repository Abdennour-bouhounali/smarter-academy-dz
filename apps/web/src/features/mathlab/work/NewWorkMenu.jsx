import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { MATH_LAB_TOOLS } from '../toolRegistry';
import { mathLabToolPath } from '../mathLabDocument';

/**
 * « + عمل جديد » : choisir l'instrument, puis commencer. Les instruments
 * offerts sont ceux du REGISTRE (§5) — jamais une liste écrite à la main,
 * jamais un instrument annoncé mais pas construit.
 *
 * Le menu s'ouvre SOUS le bouton et se replie au clic ailleurs ou à Échap ;
 * en RTL il s'aligne sur le bord de départ, donc il ne sort jamais de
 * l'écran (`inset-inline-start: 0`, voir mathlabWork.css).
 */
export default function NewWorkMenu({ labRoot, tools = null }) {
  const { t } = useTranslation('mathlab');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="sa-mlw-menu-anchor">
      <button
        type="button"
        className="sa-mlw-btn sa-mlw-btn--primary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        data-ml-work-new
      >
        <Plus size={18} aria-hidden="true" /> {t('work.newWork')}
      </button>
      {open && (
        <div className="sa-mlw-menu sa-mlw-menu--wide" role="menu" aria-label={t('work.newWork')} data-ml-work-new-menu>
          {(tools ?? MATH_LAB_TOOLS).map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.id}
                to={mathLabToolPath(tool, null, labRoot)}
                role="menuitem"
                onClick={() => setOpen(false)}
                data-ml-work-new-tool={tool.id}
              >
                <Icon size={16} aria-hidden="true" /> {t(tool.labelKey)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
