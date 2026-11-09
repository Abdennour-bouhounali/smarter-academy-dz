/**
 * « ورقة زميل » du module 2 (rollout 2026-11-09) — contenu PROPRE à la plateforme : le camarade est inventé (KidFigure).
 * L'idée fausse visée : « deux nombres qui ne sont pas premiers ne peuvent pas être premiers ENTRE EUX » — confondre la propriété du
 * COUPLE avec celle de chaque nombre. Tous les nombres sont CALCULÉS.
 */
const A = 8;
const B = 15;
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const DA = divisors(A);
const DB = divisors(B);

export const PEER_KID = { name: 'أنس', figure: { outfit: 'orange' } };

export const PEER_SHEET = {
  id: 'm2-anas',
  task: `أراد أنس أن يعرف هل العددان ${A} و ${B} أوليان فيما بينهما.`,
  lines: [
    `قواسم ${A}: ${DA.join(' ، ')} وقواسم ${B}: ${DB.join(' ، ')}`,
    `${A} ليس عددًا أوليًّا لأنّ $${A} = 2 \\times ${A / 2}$، و ${B} ليس عددًا أوليًّا لأنّ $${B} = 3 \\times ${B / 3}$`,
    `إذن ${A} و ${B} ليسا أوليين فيما بينهما.`,
  ],
  errorLine: 2,
  fixes: [
    { text: `ننظر إلى القواسم المشتركة لا إلى كل عدد وحده: لا يوجد في القائمتين معًا إلا 1، إذن $\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${gcd(A, B)}$ و ${A} و ${B} أوليان فيما بينهما.`, ok: true },
    { text: 'الاستنتاج صحيح: عددان غير أوليين لا يكونان أوليين فيما بينهما.', why: `${A} و ${B} غير أوليين، ومع ذلك لا قاسم مشترك لهما غير 1.` },
    { text: `نصحّح: ${A} و ${B} أوليان فيما بينهما لأنّ ${B} فردي.`, why: 'الزوجية لا تكفي: 9 و 15 فرديان و 3 يقسمهما معًا.' },
  ],
  why: '«أوليان فيما بينهما» صفة للعددين معًا: نبحث عن قاسم مشترك لهما، لا عن قواسم كل عدد وحده.',
};
