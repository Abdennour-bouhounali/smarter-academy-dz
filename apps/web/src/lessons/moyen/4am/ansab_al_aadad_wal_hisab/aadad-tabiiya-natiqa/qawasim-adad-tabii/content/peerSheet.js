/**
 * « ورقة زميل » du module 2 (rollout 2026-11-08) — contenu PROPRE à la plateforme : la camarade est inventée (KidFigure, en tenue
 * islamique). L'idée fausse visée : s'en tenir aux nombres TESTÉS (1 … √a) et oublier que chaque جداء livre AUSSI son partenaire —
 * « قواسم 84 » devient 1، 2، 3، 4، 6، 7 et non les douze. Tous les nombres sont CALCULÉS (content/books.js), jamais recopiés.
 */
import { divisorsOf, pairsOf, boundOf } from './books.js';

const N = 84;
const bound = boundOf(N);
const pairs = pairsOf(N);
const all = divisorsOf(N);
const tested = pairs.map((p) => p.small);
const list = (xs) => xs.join(' ، ');

export const PEER_KID = { name: 'ريما', figure: { hairStyle: 'hijab', scarf: 'sky', outfit: 'purple' } };

export const PEER_SHEET = {
  id: 'm2-rima',
  task: `عيّنت ريما كل قواسم العدد ${N}. أين الخطأ في ورقتها؟`,
  lines: [
    `$${bound}^2 = ${bound * bound} \\leq ${N} < ${bound + 1}^2 = ${(bound + 1) * (bound + 1)}$ ، فأختبر الأعداد من 1 إلى ${bound}.`,
    `نجد: ${pairs.map((p) => `$${N} = ${p.small} \\times ${p.big}$`).join(' ، ')}.`,
    `إذن قواسم ${N} هي ${list(tested)}.`,
    `عدد قواسم ${N} هو ${tested.length}.`,
  ],
  errorLine: 2,
  fixes: [
    { text: `قواسم ${N} هي الأعداد التي في كل الجداءات: ${list(all)}.`, ok: true },
    { text: `قواسم ${N} هي ${list(tested)} و ${N}.`, why: `لا يكفي أن نضيف ${N} وحده: كل جداء يعطي قاسمين. من $${N} = ${pairs[pairs.length - 1].small} \\times ${pairs[pairs.length - 1].big}$ نجد أنّ ${pairs[pairs.length - 1].big} قاسم أيضًا.` },
    { text: `يجب أن نختبر الأعداد حتى ${N} لنجد بقية القواسم.`, why: `لا حاجة لذلك: الشريك في كل جداء قاسم أيضًا دون اختبار. نتوقّف عند ${bound}.` },
  ],
  fixedLines: { 3: `عدد قواسم ${N} هو ${all.length}.` },
  why: `الاختبار يتوقّف عند ${bound}، لكن كل جداء $${N} = d \\times e$ يعطي قاسمين معًا: العدد الذي اختبرناه d والشريك e. الأعداد التي اختبرناها هي القواسم الصغرى فقط.`,
};
