/**
 * « ورقة زميل » du module 2 (rollout 2026-11-09) — contenu PROPRE à la plateforme : la camarade est inventée (KidFigure, en tenue islamique).
 * L'idée fausse visée : diviser le numérateur et le dénominateur par des nombres DIFFÉRENTS (36 ÷ 6, 48 ÷ 4) — la valeur change. Tous les
 * nombres sont CALCULÉS.
 */
const N = 36;
const D = 48;
const KN = 6;
const KD = 4;
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const G = gcd(N, D);

export const PEER_KID = { name: 'رانية', figure: { hairStyle: 'hijab', scarf: 'mint', outfit: 'pink' } };

export const PEER_SHEET = {
  id: 'm2-rania',
  task: `أرادت رانية أن تكتب $\\dfrac{${N}}{${D}}$ على الشكل غير القابل للاختزال.`,
  lines: [
    `$${N} = ${KN} \\times ${N / KN}$ و $${D} = ${KD} \\times ${D / KD}$`,
    `إذن $\\dfrac{${N}}{${D}} = \\dfrac{${N / KN}}{${D / KD}}$`,
    `$\\dfrac{${N / KN}}{${D / KD}} = \\dfrac{1}{2}$`,
  ],
  errorLine: 1,
  fixes: [
    { text: `نقسم البسط والمقام على العدد نفسه. $\\mathrm{PGCD}(${N}\\ ;\\ ${D}) = ${G}$، إذن $\\dfrac{${N}}{${D}} = \\dfrac{${N / G}}{${D / G}}$.`, ok: true },
    { text: `$\\dfrac{${N / KN}}{${D / KD}}$ صحيح لأنّ ${KN} و ${KD} يقسمان العددين.`, why: `$\\dfrac{${N}}{${D}} = 0{,}75$ أمّا $\\dfrac{${N / KN}}{${D / KD}} = 0{,}5$: الكسران مختلفان.` },
    { text: `نطرح ${KN} من البسط و ${KD} من المقام.`, why: `الطرح لا يحفظ قيمة الكسر: $\\dfrac{${N - KN}}{${D - KD}}$ لا يساوي $\\dfrac{${N}}{${D}}$.` },
  ],
  fixedLines: { 2: `$\\dfrac{${N / G}}{${D / G}}$ غير قابل للاختزال لأنّ $\\mathrm{PGCD}(${N / G}\\ ;\\ ${D / G}) = 1$.` },
  why: 'قيمة الكسر لا تتغيّر إلا إذا قسمنا البسط والمقام على العدد نفسه — كما نقسم الوصفة كلّها إلى حصص متماثلة.',
};
