/**
 * « ورقة زميل » du module 2 (rollout 2026-11-08) — contenu PROPRE à la plateforme : la camarade est inventée (KidFigure, en tenue islamique).
 * L'idée fausse visée : PERDRE LE COUPLE dans les différences successives — après 84 − 60 = 24, Maryam garde le grand nombre et calcule
 * 84 − 24 au lieu de continuer avec le PETIT et la DIFFÉRENCE (60 et 24) ; la chaîne tourne en rond. Tous les nombres sont CALCULÉS.
 */
const A = 84;
const B = 60;
const D = A - B;

/** La chaîne juste, à partir de (B, D). */
export function chainFrom(big, small) {
  const out = [];
  let [x, y] = [Math.max(big, small), Math.min(big, small)];
  while (y > 0) { out.push([x, y, x - y]); [x, y] = [Math.max(y, x - y), Math.min(y, x - y)]; }
  return out;
}
const RIGHT = chainFrom(B, D);
const G = RIGHT[RIGHT.length - 1][0];

export const PEER_KID = { name: 'مريم', figure: { hairStyle: 'hijab', scarf: 'lavender', outfit: 'teal' } };

export const PEER_SHEET = {
  id: 'm2-maryam',
  task: `أرادت مريم أن تعيّن $\\mathrm{PGCD}(${A}\\ ;\\ ${B})$ بالفروق المتتابعة.`,
  lines: [
    `$${A} - ${B} = ${D}$`,
    `$${A} - ${D} = ${A - D}$`,
    `رجعتُ إلى ${B}: الفروق تعيد نفسها، فليس للعددين قاسم مشترك أكبر.`,
  ],
  errorLine: 1,
  fixes: [
    { text: `بعد السطر الأول نُكمل بالأصغر ${B} والفرق ${D}: $${B} - ${D} = ${B - D}$.`, ok: true },
    { text: `نُكمل بـ ${A} و ${B} من جديد.`, why: 'هذا يعيدنا إلى السطر الأوّل: لا نتقدّم خطوة.' },
    { text: `نتوقّف هنا: $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${D}$ لأنه أوّل فرق.`, why: `${D} لا يقسم ${B}: $${B} = ${D} \\times ${Math.floor(B / D)} + ${B % D}$.` },
  ],
  fixedLines: {
    2: `${RIGHT.slice(1).map(([x, y, z]) => `$${x} - ${y} = ${z}$`).join(' ، ')} ، إذن $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${G}$.`,
  },
  why: `في كل خطوة نترك العدد الأكبر ونُكمل بالعددين الأصغرين: الأصغر والفرق. هكذا تصغر الأعداد حتى يصير الفرق 0، وآخر فرق غير معدوم هو ${G}.`,
};
