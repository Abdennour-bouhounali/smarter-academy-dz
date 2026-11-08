/**
 * « ورقة زميل » du module 2 (rollout 2026-11-08) — contenu PROPRE à la plateforme : le camarade est inventé (KidFigure). L'idée fausse visée :
 * « le PGCD est le plus grand des deux nombres » — Yacine voit que 9 divise 36 et conclut PGCD(36 ; 9) = 36. La nتيجة مباشرة dit l'inverse : si b
 * divise a, PGCD(a ; b) = b, le PETIT. Tous les nombres sont CALCULÉS.
 */
const A = 36;
const B = 9;
const Q = A / B;

export const PEER_KID = { name: 'ياسين', figure: { outfit: 'teal' } };

export const PEER_SHEET = {
  id: 'm2-yacine',
  task: `أراد ياسين أن يعيّن $\\mathrm{PGCD}(${A}\\ ;\\ ${B})$ دون أن يحصر القواسم.`,
  lines: [
    `$${A} = ${B} \\times ${Q}$ ، إذن ${B} قاسم للعدد ${A}.`,
    `القاسم المشترك الأكبر هو أكبر العددين، إذن $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${A}$.`,
    `تحقّق: ${A} يقسم ${A}.`,
  ],
  errorLine: 1,
  fixes: [
    { text: `${A} لا يقسم ${B}، فليس قاسمًا مشتركًا. بما أنّ ${B} قاسم للعدد ${A} فإنّ $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${B}$.`, ok: true },
    { text: `$\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${Q}$ لأنّ $${A} = ${B} \\times ${Q}$.`, why: `${Q} لا يقسم ${B}: $${B} = ${Q} \\times ${Math.floor(B / Q)} + ${B % Q}$. ${Q} حاصل القسمة، لا قاسم مشترك.` },
    { text: `$\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = 1$ لأنّ العددين مختلفان.`, why: `3 و ${B} يقسمان العددين معًا، فالأكبر ليس 1.` },
  ],
  fixedLines: { 2: `تحقّق: ${B} يقسم ${A} و ${B} يقسم ${B}، ولا يوجد قاسم للعدد ${B} أكبر من ${B}.` },
  why: `القاسم المشترك يقسم العددين معًا، فلا يتجاوز أصغرهما. عندما يكون ${B} قاسمًا للعدد ${A}، يكون ${B} نفسه أكبر قاسم مشترك.`,
};
