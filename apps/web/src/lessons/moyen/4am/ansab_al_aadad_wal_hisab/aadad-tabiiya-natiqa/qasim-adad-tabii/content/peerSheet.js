/**
 * « ورقة زميل » du module 2 (conseil + propriétaire, 2026-11-08, PILOTE) — contenu PROPRE à la plateforme : la camarade est
 * inventée (KidFigure, en tenue islamique), les nombres sont ceux du terrain de football. L'idée fausse visée : lire la division
 * sur le QUOTIENT (« 21 est un entier, donc c'est exact ») au lieu du RESTE. 150 = 7 × 21 + 3 se calcule (euclid), il n'est pas
 * recopié à la main.
 */
import { euclid } from './teams.js';

const N = 150;
const D = 7;
const { q, r } = euclid(N, D);

export const PEER_KID = { name: 'سلمى', figure: { hairStyle: 'hijab', scarf: 'rose', outfit: 'green' } };

export const PEER_SHEET = {
  id: 'm2-salma',
  task: `${N} لاعبًا في ${D} فرق متساوية: هل ${D} قاسم للعدد ${N}؟`,
  lines: [
    `نُجري القسمة الإقليدية للعدد ${N} على ${D}.`,
    `$${N} = ${D} \\times ${q} + ${r}$`,
    `حاصل القسمة ${q} عدد طبيعي، إذن القسمة تامّة.`,
    `إذن ${D} قاسم للعدد ${N}.`,
  ],
  errorLine: 2,
  fixes: [
    { text: `حاصل القسمة ${q} عدد فردي، إذن القسمة ليست تامّة.`, why: 'الحاصل لا يقرّر شيئًا، فرديًّا كان أو زوجيًّا: انظر إلى الباقي.' },
    { text: `الباقي ${r} ليس معدومًا، إذن القسمة ليست تامّة.`, ok: true },
    { text: `${r} قاسم للعدد ${N}، إذن القسمة تامّة.`, why: `الباقي ${r} ليس معدومًا: هذا وحده يكفي لنعرف أنّ القسمة ليست تامّة.` },
  ],
  fixedLines: { 3: `إذن ${D} ليس قاسمًا للعدد ${N}: يبقى ${r} لاعبين خارج الفرق.` },
  why: 'في القسمة الإقليدية يكون الحاصل عددًا طبيعيًّا دائمًا، فهو لا يقرّر شيئًا. الذي يقرّر هو الباقي: لا يكون العدد قاسمًا إلّا إذا كان الباقي معدومًا.',
};
