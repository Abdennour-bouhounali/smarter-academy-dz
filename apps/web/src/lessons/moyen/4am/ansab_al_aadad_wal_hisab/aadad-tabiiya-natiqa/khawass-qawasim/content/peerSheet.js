/**
 * « ورقة زميل » du module 2 (rollout 2026-11-08) — contenu PROPRE à la plateforme : la camarade est inventée (KidFigure, en tenue
 * islamique). L'idée fausse visée : INVERSER la خاصية — « 6 divise la somme 40 + 8 = 48, donc 6 divise 40 et 8 ». La خاصية dit :
 * si n divise a ET b, alors n divise a + b ; pas l'inverse. Tous les nombres sont CALCULÉS, jamais recopiés à la main.
 */
const N = 6;
const A = 40;
const B = 8;
const SUM = A + B;
const q = (x, d) => Math.floor(x / d);
const r = (x, d) => x % d;

export const PEER_KID = { name: 'هند', figure: { hairStyle: 'hijab', scarf: 'sky', outfit: 'teal' } };

export const PEER_SHEET = {
  id: 'm2-hind',
  task: `${N} يقسم ${SUM} حيث $${SUM} = ${A} + ${B}$. أرادت هند أن تعرف: هل ${N} يقسم ${A} وهل يقسم ${B}؟`,
  lines: [
    `$${SUM} = ${N} \\times ${SUM / N}$ ، إذن ${N} يقسم ${SUM}.`,
    'الخاصية: إذا كان n يقسم مجموعًا فإنه يقسم كل حدّ من حدّيه.',
    `إذن ${N} يقسم ${A} و ${N} يقسم ${B}.`,
    `${N} قاسم مشترك للعددين ${A} و ${B}.`,
  ],
  errorLine: 1,
  fixes: [
    { text: `الخاصية تقول: إذا كان n يقسم كلا من a و b فإنه يقسم a + b. العكس غير صحيح: ${N} يقسم ${SUM} لكنّ $${A} = ${N} \\times ${q(A, N)} + ${r(A, N)}$.`, ok: true },
    { text: `${N} يقسم ${A} فقط، لأنّ ${A} هو الأكبر.`, why: `الكبر لا يصنع القسمة: $${A} = ${N} \\times ${q(A, N)} + ${r(A, N)}$ والباقي ${r(A, N)} غير معدوم.` },
    { text: `${N} يقسم ${B} فقط، لأنّ ${B} هو الأصغر.`, why: `$${B} = ${N} \\times ${q(B, N)} + ${r(B, N)}$: الباقي ${r(B, N)} غير معدوم، فـ ${N} لا يقسم ${B}.` },
  ],
  fixedLines: { 2: `لا نعرف شيئًا عن ${A} و ${B}: نجرّب القسمة، فنجد أنّ ${N} لا يقسم ${A} ولا ${B}.`, 3: `${N} ليس قاسمًا مشتركًا للعددين ${A} و ${B}.` },
  why: `الخاصية تنطلق من «n يقسم a و b» لتصل إلى «n يقسم a + b». هند انطلقت من النتيجة لتصل إلى الشرط، وهذا اتجاه آخر لا تضمنه الخاصية: ${N} يقسم ${SUM} دون أن يقسم أيًّا من حدّيه.`,
};
