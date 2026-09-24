import { useTranslation } from 'react-i18next';
import { PencilRuler } from 'lucide-react';
import { ArrowForward } from '../../../components/common/DirectionalIcons';
import '../mathlab.css';

/**
 * LE SÉLECTEUR : choisir l'instrument, sans quitter la leçon.
 *
 * C'est l'ACCUEIL DU مختبر (`home/MathLabHome.jsx`), rendu dans le calque :
 * même sur-titre (PencilRuler + « eyebrow »), même titre, même sous-titre,
 * même grille `.sa-ml-cards` (1 colonne, 2 dès 640 px, 3 dès 1280 px) et des
 * cartes copiées sur `home/ToolCard.jsx` — pastille d'icône bleue, nom,
 * description, et l'appel à l'action « … جديد » avec sa flèche.
 *
 * Une seule différence, et elle est nécessaire : ce sont des BOUTONS, pas
 * des `<Link>`. Choisir ici ne navigue pas — cela change ce que le calque
 * affiche. Un lien quitterait la leçon, ce que tout ce dispositif existe
 * pour éviter. Le reste doit être indiscernable de la vraie page : l'élève
 * qui connaît le مختبر doit le reconnaître.
 *
 * La COQUILLE est celle de la vraie page, elle aussi : `.sa-page`
 * (20 / 40 / 60 px de marge latérale selon l'écran — index.css) et
 * `py-8 sm:py-10`, comme `home/MathLabHome.jsx`. Le calque n'ajoute AUCUN
 * rembourrage par-dessus : deux systèmes de marges superposés donnaient des
 * cartes plus étroites ici que dans le مختبر, pour le même contenu.
 *
 * Les instruments viennent du REGISTRE (`MATH_LAB_TOOLS`), la seule liste :
 * un instrument de plus apparaît ici sans que ce fichier change. Les
 * instruments seulement ANNONCÉS n'y sont pas — on ne propose pas dans une
 * leçon une porte qui n'ouvre sur rien.
 */
export default function MathLabToolPicker({ tools, onPick }) {
  const { t } = useTranslation('mathlab');

  return (
    <div className="sa-page py-8 sm:py-10" data-ml-overlay-picker>
      <div className="mb-6">
        <p className="font-mono-jetbrains text-blue-500 text-xs font-semibold tracking-widest uppercase mb-2 flex items-center gap-1.5">
          <PencilRuler size={13} aria-hidden="true" /> {t('eyebrow')}
        </p>
        <h3 className="font-space font-bold text-2xl text-slate-900">{t('title')}</h3>
        <p className="font-inter text-slate-500 text-sm mt-1">{t('overlay.pickHint')}</p>
      </div>

      <div className="sa-ml-cards">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onPick(tool.id)}
              data-ml-overlay-tool={tool.id}
              className="group flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-5 text-start transition-colors hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={24} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-space font-bold text-lg text-slate-900">{t(tool.labelKey)}</span>
                <span className="block font-inter text-sm text-slate-500 mt-1">{t(tool.descriptionKey)}</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-1.5 font-mono-jetbrains text-xs font-bold text-blue-600 group-hover:text-blue-700">
                {t(tool.newLabelKey)}
                <ArrowForward size={14} aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
