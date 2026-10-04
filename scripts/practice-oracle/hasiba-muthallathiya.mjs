// Oracle du banc « hasiba-muthallathiya » (unité 10 « حساب المثلثات في المثلث القائم ») — chaque réponse construite
// RECALCULÉE ici à partir des nombres de l'énoncé : Math.sin / cos / tan / asin / acos / atan en DEGRÉS et l'arrondi
// de cet oracle (`round`, écrit ici), sans lire le contenu ni packages/core/arithmetic/trigonometry.js ni la logique
// du lab. Les arrondis portent sur la valeur de la calculatrice (10 chiffres significatifs, comme l'écran).
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Les QCM sont vérifiés par l'aller-retour du validateur.
import { R, q } from './helpers.mjs';

const D = Math.PI / 180;
const sin = (d) => Math.sin(d * D); const cos = (d) => Math.cos(d * D); const tan = (d) => Math.tan(d * D);
const asin = (v) => Math.asin(v) / D; const acos = (v) => Math.acos(v) / D; const atan = (v) => Math.atan(v) / D;
/** L'écran (10 chiffres significatifs), puis l'arrondi « المدوّر » à `digits` décimales, en chaîne exacte. */
function round(x, digits) {
  const screen = Number(x.toPrecision(10));
  const k = 10 ** digits;
  const n = Math.round(screen * k + 1e-7);
  return q(n).div(k).toString();
}
const ID = (l, n, qq = 1) => `ex-4am-hasiba-muthallathiya-l${l}-${String(n).padStart(3, '0')}:q${qq}`;

export const ORACLE = {
  // niveau 1
  [ID(1, 1)]: R(round(1.267103, 0)),
  [ID(1, 2)]: R(round(1.267103, 1)),
  [ID(1, 3)]: R(round(0.8090169944, 2)),                // l'écran de معارف 3 pour sin 54°
  [ID(1, 6)]: R(round(sin(30), 10)),
  [ID(1, 7)]: R(round(tan(45), 9)),
  [ID(1, 9)]: R(round(asin(0.5), 6)),
  [ID(1, 10)]: R(round(23.57817848, 0)),               // l'écran de معارف 3 مثال 2
  // niveau 2
  [ID(2, 1)]: R(round(cos(40), 2)),
  [ID(2, 2)]: R(round(tan(75), 2)),
  [ID(2, 3)]: R(round(sin(20), 2)),
  [ID(2, 4)]: R(round(tan(54), 2)),
  [ID(2, 5)]: R(round(cos(18), 2)),
  [ID(2, 6)]: R(round(asin(0.52), 0)),
  [ID(2, 7)]: R(round(acos(0.25), 1)),
  [ID(2, 8)]: R(round(atan(1.33), 2)),
  [ID(2, 9)]: R(round(atan(0.3), 0)),
  [ID(2, 10)]: R(round(0.5877852523, 1)),
  // niveau 3
  [ID(3, 1, 1)]: R(round(sin(40), 2)),
  [ID(3, 1, 2)]: R(round(cos(40), 2)),
  [ID(3, 1, 3)]: R(round(tan(40), 2)),
  [ID(3, 2, 2)]: R(round(acos(4 / 4.4), 0)),           // ex-7 : CB / CA
  [ID(3, 3, 2)]: R(round(asin(4.2 / 7), 0)),           // ex-8 : DF / EF
  [ID(3, 4, 2)]: R(round(atan(2 / 5), 1)),             // ex-11 : IT / IR
  [ID(3, 5, 2)]: R(round(acos(5 / 9), 0)),             // ex-23 : MK / ML
  [ID(3, 6)]: R(round(atan(8 / 6), 0)),
  [ID(3, 7)]: R(round(0.79863551, 2)),
  [ID(3, 10)]: R(round(acos(0.9), 1)),
  // niveau 4
  [ID(4, 1)]: R(round(asin(60 / 100), 0)),
  [ID(4, 2)]: R(round(atan(40 / 150), 1)),
  [ID(4, 3)]: R(round(asin(0.5 / 6), 1)),
  [ID(4, 4)]: R(round(acos(3.5 / 12), 0)),
  [ID(4, 5)]: R(round(asin(15 / 50), 0)),
  [ID(4, 6)]: R(round(atan(265 / 400), 1)),
  [ID(4, 7)]: R(round(sin(50), 2)),
  [ID(4, 10)]: R(round(tan(25), 2)),
  // niveau 5
  [ID(5, 1, 2)]: R(round(acos(7 / 10), 0)),
  [ID(5, 2, 1)]: R(round(atan(3 / 7), 1)),
  [ID(5, 2, 2)]: R(round(atan(7 / 3), 1)),
  [ID(5, 4)]: R(q(round(acos(0.5), 6)).sub(round(asin(0.5), 6)).toString()),
  [ID(5, 5)]: R(round(44.99736, 2)),
  [ID(5, 6)]: R(round(asin(260 / 1050), 1)),
  [ID(5, 7, 2)]: R(round(acos(4.5 / 7.2), 0)),
  [ID(5, 8)]: R(round(cos(62), 2)),
  [ID(5, 10)]: R(round(acos(0.6 / 2), 2)),
};
