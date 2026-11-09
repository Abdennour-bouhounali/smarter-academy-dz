import * as squareRoots from '@smarter-academy/core/arithmetic/squareRoots.js';

const { exactDecimal } = squareRoots;

/**
 * « ورقة زميل » du module 2 (rollout 2026-11-09) — contenu PROPRE à la plateforme : le camarade est inventé (KidFigure).
 * L'idée fausse visée : le carré d'un DÉCIMAL — « 0,06 × 0,06 = 0,36 » (on multiplie les chiffres et on garde UNE seule place après la virgule
 * de chaque côté) — d'où un faux « √0,36 = 0,06 ». Tous les nombres sont CALCULÉS en entiers (centièmes / dix-millièmes), jamais retapés.
 */
const AREA = 36; // en centièmes : 0,36
const WRONG = 6; // en centièmes : 0,06
const RIGHT = 6; // en dixièmes : 0,6
const dec = (n, d) => exactDecimal(n, d).replace(',', '{,}');

export const PEER_KID = { name: 'إلياس', figure: { outfit: 'teal' } };

export const PEER_SHEET = {
  id: 'm2-ilyas',
  task: `أراد إلياس أن يجد طول ضلع بلاطة مربّعة مساحتها $${dec(AREA, 2)}\\,m^2$.`,
  lines: [
    `طول الضلع هو العدد الموجب الذي مربّعه $${dec(AREA, 2)}$، أي $\\sqrt{${dec(AREA, 2)}}$.`,
    `$${dec(WRONG, 2)} \\times ${dec(WRONG, 2)} = ${dec(AREA, 2)}$`,
    `إذن $\\sqrt{${dec(AREA, 2)}} = ${dec(WRONG, 2)}$ وطول الضلع $${dec(WRONG, 2)}\\,m$.`,
  ],
  errorLine: 1,
  fixes: [
    { text: `$${dec(WRONG, 2)} \\times ${dec(WRONG, 2)} = ${dec(WRONG * WRONG, 4)}$؛ أمّا $${dec(RIGHT, 1)} \\times ${dec(RIGHT, 1)} = ${dec(RIGHT * RIGHT, 2)}$، إذن $\\sqrt{${dec(AREA, 2)}} = ${dec(RIGHT, 1)}$.`, ok: true },
    { text: `نأخذ نصف المساحة: $\\sqrt{${dec(AREA, 2)}} = ${dec(AREA / 2, 2)}$.`, why: `$${dec(AREA / 2, 2)} \\times ${dec(AREA / 2, 2)} = ${dec((AREA / 2) * (AREA / 2), 4)}$ وليس $${dec(AREA, 2)}$: الجذر ليس النصف.` },
    { text: `الضلع $-${dec(RIGHT, 1)}$ لأنّ $(-${dec(RIGHT, 1)})^2 = ${dec(AREA, 2)}$.`, why: 'الطول عدد موجب، والجذر التربيعي هو العدد الموجب الذي مربّعه المساحة.' },
  ],
  why: 'مربّع عدد له رقمان بعد الفاصلة له أربعة أرقام بعد الفاصلة: تحقّق دائمًا بضرب العدد في نفسه.',
};
