import CoordPlane from '../../lessons/common/components/CoordPlane';
import GeoFigure from '../../lessons/common/components/GeoFigure';
import RichText from './RichText';
import PracticeLab from './PracticeLab';

/**
 * L'énoncé : du texte, éventuellement une figure, éventuellement un labo.
 *
 * `visual` est un sac de props DÉCLARATIF passé tel quel à CoordPlane — le
 * composant partagé par 132 fichiers de leçon, avec ses graduations à la
 * virgule française, son moins typographique et ses marges calculées sur la
 * largeur réelle des étiquettes. Le validateur vérifie chaque clé contre les
 * vraies props, pour qu'une faute de frappe échoue en CI plutôt que de rendre
 * un plan vide en silence.
 *
 * `figure` (unité 9, 2026-10-02) est une figure de géométrie DÉCLARATIVE dessinée par GeoFigure —
 * points nommés, segments, droites, angles — pour qu'un énoncé « في الشكل المقابل » montre le shape ;
 * le validateur la vérifie avec `validateGeoFigure`.
 */
export default function ExerciseStatement({ content, visual, figure, support }) {
  return (
    <div className="space-y-4">
      {content && (
        <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
          {content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-[15px] sm:text-base">
              <RichText>{paragraph}</RichText>
            </p>
          ))}
        </div>
      )}

      {figure && <GeoFigure {...figure} />}

      {visual && (
        <div className="overflow-x-auto">
          <CoordPlane {...visual} />
        </div>
      )}

      {support && <PracticeLab support={support} />}
    </div>
  );
}
