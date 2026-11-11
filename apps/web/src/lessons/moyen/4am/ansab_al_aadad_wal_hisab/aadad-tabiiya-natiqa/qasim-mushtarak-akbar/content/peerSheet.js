/**
 * « ورقة زميل » du module 2 (rollout 2026-11-08) — contenu PROPRE à la plateforme : la camarade est inventée (KidFigure, en tenue
 * islamique). L'idée fausse visée : une liste de diviseurs INCOMPLÈTE donne un faux PGCD — Salma oublie les partenaires 10 et 15 de
 * 30 (= 3 × 10 = 2 × 15), les communs perdent 15 et le « plus grand » devient 5. Tous les nombres sont CALCULÉS.
 */
const A = 30;
const B = 45;
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const common = (x, y) => divisors(x).filter((d) => y % d === 0);
const join = (xs) => xs.join(' ، ');

/** La liste de Salma : celle de 30 sans les partenaires des petits diviseurs (10 et 15). */
export const SALMA_A = divisors(A).filter((d) => d !== 10 && d !== 15);
const SALMA_COMMON = SALMA_A.filter((d) => B % d === 0);
const G = Math.max(...common(A, B));

export const PEER_KID = { name: 'سلمى', figure: { hairStyle: 'hijab', scarf: 'rose', outfit: 'violet' } };

export const PEER_SHEET = {
  id: 'm2-salma',
  task: `أرادت سلمى أن تجد القاسم المشترك الأكبر للعددين ${A} و ${B}.`,
  lines: [
    `قواسم ${A}: ${join(SALMA_A)}.`,
    `قواسم ${B}: ${join(divisors(B))}.`,
    `القواسم المشتركة: ${join(SALMA_COMMON)}.`,
    `إذن $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${Math.max(...SALMA_COMMON)}$.`,
  ],
  errorLine: 0,
  fixes: [
    { text: `نسيت سلمى شريكَي 3 و 2: $${A} = 3 \\times 10 = 2 \\times 15$. قواسم ${A} هي ${join(divisors(A))}.`, ok: true },
    { text: `قواسم ${B} ناقصة: نسيت العدد 2.`, why: `$${B} = 2 \\times 22 + 1$: العدد 2 لا يقسم ${B}، فقائمة ${B} صحيحة.` },
    { text: `PGCD هو أكبر عدد في القائمتين، أي ${B}.`, why: `${B} لا يقسم ${A}: $${A} = ${B} \\times 0 + ${A}$. نبحث عن الأكبر بين القواسم المشتركة فقط.` },
  ],
  fixedLines: {
    2: `القواسم المشتركة: ${join(common(A, B))}.`,
    3: `إذن $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${G}$.`,
  },
  why: `قائمة ناقصة تُخفي قواسم مشتركة: كل قاسم يأتي مع شريكه (${A} = 2 × 15 = 3 × 10). عندما نسيت سلمى 15، صار أكبر ما بقي في الوسط 5 بدل ${G}.`,
};
