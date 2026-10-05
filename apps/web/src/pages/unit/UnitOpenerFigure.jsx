import React, { Suspense, lazy } from 'react';

/**
 * Les figures de l'OUVERTURE d'unité (تحدّ, encadré historique). Leur texte dit « الشكل المقابل »,
 * « البيان المقابل », « نظم العمل في جدول » : sans dessin, la phrase renvoie au vide. On réutilise
 * le dessin que la leçon a déjà fait de la même figure du manuel (jamais une seconde copie), chargé
 * à la demande pour que la page d'unité n'embarque pas les leçons des autres unités.
 *
 * Clé : `${unit.id}:${slot}` (= le code de l’unité), slot ∈ challenge | aside. Une unité sans entrée n'affiche rien.
 */
const FIGURES = {
  // p. 31 — ABC, AB = x + 1, AC = x + 2, BC = x + 3 ; l'angle en A n'est PAS marqué droit (c'est la question).
  'hisab-harfi:challenge': () => Promise.resolve({ default: TriangleABC }),
  // p. 31 — le tableau 3 × 3 de Descartes pour (2x + 1)².
  'hisab-harfi:aside': () => Promise.all([
    import('../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-harfi/mutatabiqat-shahira/components/DescartesTable.jsx'),
    import('../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-harfi/mutatabiqat-shahira/content/textbook.js'),
  ]).then(([{ default: DescartesTable }, { DESCARTES }]) => ({
    default: () => <DescartesTable head={DESCARTES.head} cells={DESCARTES.cells} />,
  })),
  // p. 43 — ABCD découpé en AEGF (x), deux rectangles x × 6, GHCK (6) ; sans les aires (ce serait la piste).
  'muadalat-mutarajihat:challenge': () => import('../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-mutarajihat/jidaa-maadum/components/ChallengeSquare.jsx')
    .then(({ default: ChallengeSquare }) => ({
      default: () => <ChallengeSquare showAreas={false} label="مربّع ABCD مقسّم إلى مربّع AEGF ضلعه x، ومستطيلين، ومربّع ضلعه 6" />,
    })),
  // p. 65 — les distances des véhicules A (ligne brisée) et B (droite par l'origine), toutes les 30 min.
  'tanasubiya-dala-khattiya:challenge': () => import('../../lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/tarrid-khatti/components/Graphs.jsx')
    .then((m) => ({ default: m.ChallengeGraph })),
  // p. 77 — la droite °C → °F, f(x) = 1,8x + 32.
  // Sans les points (10 ; 50) et (30 ; 86) en orange : ce serait la réponse de la question 1.
  'dala-taalufiya:challenge': () => import('../../lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/tanasub-taghayyurat/components/ChallengeGraph.jsx')
    .then(({ default: ChallengeGraph }) => ({ default: () => <ChallengeGraph plain /> })),
  // p. 91 — « يقدّم الجدول نتائج تلاميذ قسمين » : le tableau des deux classes (effectifs et moyennes par sexe), dessiné par la
  // leçon 4 qui porte le تحدّ — sans la moyenne de chaque classe (384/33, la réponse).
  'ihsa:challenge': () => Promise.all([
    import('../../lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/components/DataTable.jsx'),
    import('../../lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/content/textbook.js'),
  ]).then(([{ default: DataTable }, { CHALLENGE }]) => ({
    default: () => <DataTable head={CHALLENGE.head} rows={CHALLENGE.rows} />,
  })),
  // p. 103 — « رسم الشكل المقابل » : la minaret, le rayon de soleil, le bâton de 1 m, 10 m et 11,6 m au sol — dessinée par
  // la synthèse qui reprend le تحدّ (doublon déclaré) ; la hauteur n'y est ni écrite ni graduée (c'est la question).
  'khassiyat-talis:challenge': () => import('../../lessons/moyen/4am/handasa/khassiyat-talis/wadiya-idmajiya-talis/components/MinaretFigure.jsx'),
  // p. 115 — « اعتمادا على الشكل » : le mur, l'échelle posée contre lui, 1,60 m et 59° — dessinée par la leçon 4
  // (tarrid-muthallathiya) qui reprend le تحدّ (doublon déclaré) ; la longueur de l'échelle n'y est pas écrite (c'est la question).
  'hisab-muthallathat:challenge': () => import('../../lessons/moyen/4am/handasa/hisab-muthallathat/tarrid-muthallathiya/components/LadderFigure.jsx'),
  // p. 127 — « (الشكل) » : le fleuve, A et B face à face, [AB] perpendiculaire aux rives, le courant 2 km/h — dessiné par la
  // leçon 3 (majmu-shuaayn) qui reprend le تحدّ (doublon déclaré) ; ni la direction de nage ni 30° (c'est la question).
  'ashia-insihab:challenge': () => import('../../lessons/moyen/4am/handasa/ashia-insihab/majmu-shuaayn/components/RiverFigure.jsx'),
  // p. 151 — « نجمة العلم الجزائري » : le manuel montre la PHOTO du drapeau ; dessinée par la leçon 4 (mudalaat-muntazama)
  // qui porte le تحدّ — le drapeau seul (moitié verte, moitié blanche, croissant et étoile rouges), ni cercle, ni 72°, ni
  // rayon (c'est la question).
  // p. 163 — « يُمثّل الشكل المقابل دلوًا فيه ماء » : le seau en tronc de cône, son eau et les cotes du manuel (40 / 30 / 7 / 28)
  // — dessiné par la synthèse (wadiya-idmajiya-fada) qui porte le تحدّ ; ni le rayon de la surface, ni le sommet, ni le volume
  // (c'est la question).
  'handasa-fada:challenge': () => import('../../lessons/moyen/4am/handasa/handasa-fada/wadiya-idmajiya-fada/components/BucketFigure.jsx'),
  'dawaran-mudalaat:challenge': () => import('../../lessons/moyen/4am/handasa/dawaran-mudalaat/mudalaat-muntazama/components/FlagStarFigure.jsx'),
};

const lazyCache = {};
function figureFor(key) {
  if (!FIGURES[key]) return null;
  lazyCache[key] ??= lazy(FIGURES[key]);
  return lazyCache[key];
}

export function hasUnitOpenerFigure(code, slot) {
  return Boolean(FIGURES[`${code}:${slot}`]);
}

export default function UnitOpenerFigure({ code, slot }) {
  const Figure = figureFor(`${code}:${slot}`);
  if (!Figure) return null;
  return (
    <div className="mt-3" data-unit-figure={`${code}:${slot}`}>
      <Suspense fallback={<div className="mx-auto h-40 w-full max-w-sm animate-pulse rounded-xl bg-white/70" />}>
        <Figure />
      </Suspense>
    </div>
  );
}

/** Le triangle du تحدّ de l'unité 3 : quelconque à l'œil, côtés écrits en notation latine (LTR). */
function TriangleABC() {
  const A = [60, 40]; const B = [60, 170]; const C = [250, 170];
  const p = ([x, y]) => `${x},${y}`;
  const t = (x, y, s, o = {}) => <text x={x} y={y} fontSize="14" fill="#0F172A" fontFamily="ui-monospace, monospace" {...o}>{s}</text>;
  return (
    <figure className="mx-auto w-full max-w-xs rounded-xl border-2 border-slate-200 bg-white p-2" data-figure="triangle-abc">
      <svg viewBox="0 0 300 200" className="h-auto w-full" dir="ltr" style={{ direction: 'ltr' }} role="img" aria-label="مثلث ABC حيث AB = x + 1 و AC = x + 2 و BC = x + 3">
        <polygon points={[A, B, C].map(p).join(' ')} fill="#FEF3C7" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
        {t(A[0] - 8, A[1] - 8, 'A', { fontWeight: 'bold', textAnchor: 'middle' })}
        {t(B[0] - 12, B[1] + 16, 'B', { fontWeight: 'bold', textAnchor: 'middle' })}
        {t(C[0] + 12, C[1] + 16, 'C', { fontWeight: 'bold', textAnchor: 'middle' })}
        {t(A[0] - 8, (A[1] + B[1]) / 2 + 4, 'x + 1', { textAnchor: 'end' })}
        {t((A[0] + C[0]) / 2 + 14, (A[1] + C[1]) / 2 - 14, 'x + 2')}
        {t((B[0] + C[0]) / 2, B[1] + 20, 'x + 3', { textAnchor: 'middle' })}
      </svg>
    </figure>
  );
}
