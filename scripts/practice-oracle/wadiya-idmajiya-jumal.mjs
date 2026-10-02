// Oracle du banc « wadiya-idmajiya-jumal » (unité 5 « جمل معادلتين من الدرجة الأولى بمجهولين ») — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
// Une ثنائية se recalcule par Cramer en rationnels exacts (`solve2` de helpers.mjs) ou en rejouant
// l'histoire par force brute ; la réponse attendue d'un `point` s'écrit P(x, y).
//
// Méthode : chaque histoire est RE-TRADUITE ici en sa jumla (a1, b1, c1 | a2, b2, c2) — les nombres de
// l'énoncé, jamais la clé du JSON ; les montants dérivés (« كم يدفع… ») sont recalculés sur la ثنائية
// obtenue. Pour les QCM de MISE EN ÉQUATION, chaque option est MODÉLISÉE (ses coefficients) et
// `only(options, pred)` vérifie que l'option retenue est la SEULE qui traduit l'histoire (équations
// proportionnelles) — un QCM dont deux options seraient justes, ou aucune, fait planter l'oracle.
// « ابتداءً من » = le PREMIER entier naturel qui vérifie l'inégalité, cherché pas à pas.
import { R, C, P, q, solve2 } from './helpers.mjs';

/* ── Arithmétique exacte ─────────────────────────────────────────────── */
const sign = (v) => { const n = q(v).n; return n > 0n ? 1 : n < 0n ? -1 : 0; };
const isZ = (v) => sign(v) === 0;
const val = (v) => q(v).toString();
const pair = (...sys) => { const [x, y] = solve2(...sys); return { x, y }; };
const PP = ({ x, y }) => P(x, y);
/** a·x + b·y = c proportionnelle à a'·x + b'·y = c' (même droite). */
const prop = ([a, b, c], [a2, b2, c2]) => isZ(q(a).mul(b2).sub(q(a2).mul(b)))
  && isZ(q(a).mul(c2).sub(q(a2).mul(c))) && isZ(q(b).mul(c2).sub(q(b2).mul(c)));
/** Une jumla d'option traduit la jumla cible : chaque équation en est une, et les deux sont couvertes. */
const sameSys = ([t1, t2]) => ([o1, o2]) => (prop(o1, t1) && prop(o2, t2)) || (prop(o1, t2) && prop(o2, t1));
const holds = ([a, b, c], x, y) => isZ(q(a).mul(x).add(q(b).mul(y)).sub(c));
/** Le premier entier naturel n tel que pred(n). */
const firstNat = (pred) => { for (let n = 0; n <= 100000; n += 1) if (pred(n)) return n; throw new Error('oracle: aucun naturel'); };
const lt = (u, v) => sign(q(u).sub(v)) < 0;

/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function only(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}

/* ── Les histoires, retraduites ──────────────────────────────────────── */
// Rihla (رحلة القسم) : 10 علب + 10 قطع = 800 DA ; بقيت 2 علب + 3 قطع = 210 DA
const RIHLA = [[10, 10, 800], [2, 3, 210]];
// Le حفل du manuel : 150 + 150 = 11 250 DA ; بقيت 24 علبة + 30 قطعة = 2 100 DA
const HAFL = [[150, 150, 11250], [24, 30, 2100]];
// ex-29 : 18 علبة ; 7kg = 7000 g en bocaux de 500 g et 250 g
const ASAL = [[1, 1, 18], [500, 250, 7 * 1000]];
// ex-30 : 356 ورقة ; 454 000 DA en 1000 et 2000
const ATM1 = [[1, 1, 356], [1000, 2000, 454000]];
const ATM2 = [[1, 1, 400], [1000, 2000, 520000]];
// ex-31 : 6 علب حليب + قارورة = 720 ; réduction 20 % sur 5 علب + 5 قارورات = 1080 (corrigé)
const HALIB = [[6, 1, 720], [q('0.8').mul(5), q('0.8').mul(5), 1080]];
const flat = (s) => s.flat();

const K = (s) => `ex-4am-wadiya-idmajiya-jumal-${s}`;

const sR = pair(...flat(RIHLA));
const sH = pair(...flat(HAFL));
const sHalib = pair(...flat(HALIB));
const sPacks = pair(2, 1, 700, 1, 2, 1100);
const sVisit = pair(1, 1, 90, 400, 250, 27600);
const sCalls = pair(200, 3, 1300, 100, 4, 1100);
const sShirts = pair(2, 3, 5100, 1, 5, 3250);
const sOp = pair(4, 1, 1400, 7, 1, 1850);           // 4 Go → 1400 ; 7 Go → 1850 (x par Go, y fixe)
const sBus = pair(30, 1, 13500, 45, 1, 18000);
const sShop = pair(2, 1, 1300, 1, 2, 1700);
const sClub = pair(1, 10, 12500, 1, q('0.8').mul(10), 10500); // x inscription, y mensuel
const sNet = pair(3, 1, 950, 8, 1, 1700);
const sPitch = pair(1, 1, 84 / 2, 1, -2, -6);        // x + y = 42 ; x − 2y = −6
const sVtc = pair(5, 1, 350, 12, 1, 700);

/* ── Les prix du ex-31 servent l4-002 (énoncé : 90 DA et 180 DA) — vérifiés ici ── */
if (sHalib.x !== '90' || sHalib.y !== '180') throw new Error('oracle: ex-31');

export const ORACLE = {
  /* ── Niveau 1 ── */
  [K('l1-002:q1')]: only({ A: [3, 1, 0], B: [1, -3, 0], C: ['1/3', -1, 3] }, (e) => !holds(e, 0, 0)),
  [K('l1-003:q1')]: only({ A: [1, 1, 0], B: [2, '-1/2', 0], C: ['1/2', 1, '1/4'] }, (e) => holds(e, '1/2', '-1/2')),
  [K('l1-005:q1')]: only({ A: [1, 4], B: [4, 1], C: ['2/3', 3] }, ([x, y]) => holds([3, -1, -1], x, y) && holds([3, 1, 5], x, y)),
  // « لا تنتج » : la seule écriture qui n'est PAS la même droite que 3x − y = 1
  [K('l1-006:q1')]: only({ A: [-3, 1, -1], B: [1, '-1/3', '1/3'], C: [3, -1, 1], D: [-3, 1, 1] }, (e) => !prop(e, [3, -1, 1])),
  // متكاملتان : x + y = 180 ; « يزيد x عن y بـ 15 » : x − y = 15
  [K('l1-007:q1')]: only({ A: [[1, 1, 180], [1, -1, 15]], B: [[1, 1, 90], [1, -1, 15]], C: [[1, 1, 180], [1, 1, 15]] }, sameSys([[1, 1, 180], [1, -1, 15]])),
  [K('l1-007:q2')]: PP(pair(1, 1, 180, 1, -1, 15)),                                  // (195/2 ; 165/2)
  [K('l1-008:q1')]: only({ A: [3, 2, 210], B: [2, 3, 210], C: [1, 1, 210], D: [2, 3, 800] }, (e) => prop(e, RIHLA[1])),
  [K('l1-008:q2')]: only({ A: [50, 30], B: [40, 40], C: [45, 40], D: [30, 50] }, ([x, y]) => RIHLA.every((e) => holds(e, x, y))),
  // أمين : 3 صغيرة + 1 كبيرة = 700 ; لينة : 1 صغيرة + 2 كبيرة = 900
  [K('l1-009:q2')]: only({ A: [[1, 3, 700], [2, 1, 900]], B: [[3, 1, 700], [1, 2, 900]], C: [[3, 1, 900], [1, 2, 700]], D: [[3, 1, 700], [1, 1, 900]] },
    sameSys([[3, 1, 700], [1, 2, 900]])),
  [K('l1-010:q1')]: only({ A: [1, 1, 80], B: [1, 1, 1600], C: [20, 1, 80], D: [1, 1, 1580] }, (e) => prop(e, [20, 20, 1600])),

  /* ── Niveau 2 ── */
  [K('l2-001:q1')]: only({ A: [[1, 1, 18], [500, 250, 7]], B: [[1, 1, 7000], [500, 250, 18]], C: [[1, 1, 18], [500, 250, 7000]], D: [[1, 1, 18], [250, 500, 7000]] }, sameSys(ASAL)),
  [K('l2-001:q2')]: PP(pair(...flat(ASAL))),                                          // (10 ; 8)
  [K('l2-002:q1')]: only({ A: [[1, 1, 356], [1000, 2000, 454000]], B: [[1, 1, 454000], [1000, 2000, 356]], C: [[1, 1, 356], [2000, 1000, 454000]], D: [[1, 1, 356], [1000, 2000, 356000]] }, sameSys(ATM1)),
  [K('l2-002:q2')]: PP(pair(...flat(ATM1))),                                          // (258 ; 98)
  [K('l2-003:q2')]: PP(sR),                                                           // (30 ; 50)
  // 12 تذكرة ; 300 DA المدرجات (x) و 500 DA المنصة (y) ; 4 400 DA
  [K('l2-004:q1')]: only({ A: [[1, 1, 4400], [300, 500, 12]], B: [[1, 1, 12], [500, 300, 4400]], C: [[1, 1, 12], [300, 500, 4400]], D: [[300, 500, 12], [1, 1, 4400]] },
    sameSys([[1, 1, 12], [300, 500, 4400]])),
  [K('l2-004:q2')]: PP(pair(1, 1, 12, 300, 500, 4400)),                              // (8 ; 4)
  [K('l2-005:q1')]: PP(sPacks),                                                       // (100 ; 500)
  [K('l2-005:q2')]: R(val(q(3).mul(sPacks.x).add(sPacks.y))),                         // 800
  [K('l2-006:q1')]: only({ A: [[1, 1, 25], [10, 20, 380]], B: [[1, 1, 380], [10, 20, 25]], C: [[1, 1, 25], [20, 10, 380]], D: [[10, 20, 25], [1, 1, 380]] },
    sameSys([[1, 1, 25], [10, 20, 380]])),
  [K('l2-006:q2')]: PP(pair(1, 1, 25, 10, 20, 380)),                                 // (12 ; 13)
  [K('l2-007:q2')]: PP(pair(5, 3, 7600, 2, 4, 6400)),                                // (800 ; 1200)
  [K('l2-008:q2')]: PP(pair(2, 1, 160, 3, 1, 210)),                                  // (50 ; 60)
  [K('l2-009:q1')]: PP(pair(1, 1, 30, 1, -1, 4)),                                    // (17 ; 13)
  // محيط 46 : 2(x + y) = 46 ; x − y = 7
  [K('l2-010:q1')]: only({ A: [[1, 1, 46], [1, -1, 7]], B: [[1, 1, 23], [1, -1, 7]], C: [[1, 1, 23], [-1, 1, 7]], D: [[1, 1, 23], [1, 1, 7]] },
    sameSys([[2, 2, 46], [1, -1, 7]])),
  [K('l2-010:q2')]: PP(pair(2, 2, 46, 1, -1, 7)),                                    // (15 ; 8)

  /* ── Niveau 3 ── */
  // 0,8(5x + 5y) = 1080 : chaque option comme a·x + b·y = c
  [K('l3-001:q3')]: only({ A: [5, 5, 1080], B: [1, 1, 1080], C: [4, 4, 1080], D: [4, 5, 1080] }, (e) => prop(e, HALIB[1])),
  [K('l3-002:q1')]: PP(sHalib),                                                       // (90 ; 180)
  [K('l3-002:q2')]: R(val(q(5).mul(sHalib.x).add(q(5).mul(sHalib.y)))),             // 1350 (sans la carte)
  [K('l3-003:q1')]: only({ A: [[150, 150, 11250], [30, 24, 2100]], B: [[1, 1, 11250], [24, 30, 2100]], C: [[150, 150, 2100], [24, 30, 11250]], D: [[150, 150, 11250], [24, 30, 2100]] }, sameSys(HAFL)),
  [K('l3-003:q2')]: PP(sH),                                                           // (25 ; 50)
  // 1kg 100g = 1100 g : 3 تفاحات + 2 برتقالتان
  [K('l3-004:q1')]: only({ A: [3, 2, '1.1'], B: [2, 3, 1100], C: [3, 2, 1000 + 100], D: [1, 1, 1100] }, (e) => prop(e, [3, 2, 1100])),
  [K('l3-004:q2')]: PP(pair(3, 2, 1100, 1, 4, 1200)),                                // (200 ; 250)
  // غلاف −20 % (on paie 0,8), شاحن −10 % (on paie 0,9) ; « x + y − 30 » = x + y = 2130
  [K('l3-005:q1')]: only({ A: ['0.2', '0.1', 2100], B: ['0.8', '0.8', 2100], C: [1, 1, 2130], D: ['0.8', '0.9', 2100] },
    (e) => prop(e, [q(1).sub('0.2'), q(1).sub('0.1'), 2100])),
  [K('l3-005:q2')]: PP(pair(1, 1, 2500, '0.8', '0.9', 2100)),                        // (1500 ; 1000)
  [K('l3-006:q2')]: PP(pair(3, 2, 340, 2, 5, 520)),                                  // (60 ; 80)
  [K('l3-007:q1')]: PP(sVisit),                                                       // (34 ; 56)
  [K('l3-007:q2')]: R(val(q(250).mul(sVisit.y))),                                     // 14000
  [K('l3-008:q1')]: PP(sCalls),                                                       // (19/5 ; 180)
  [K('l3-008:q2')]: R(val(q(50).mul(sCalls.x).add(q(2).mul(sCalls.y)))),             // 550
  // x mensuel, y inscription (une fois) : 3x + y = 4100 ; 5x + y = 6300
  [K('l3-009:q1')]: only({ A: [[3, 3, 4100], [5, 5, 6300]], B: [[3, 1, 4100], [5, 1, 6300]], C: [[1, 3, 4100], [1, 5, 6300]], D: [[3, 1, 6300], [5, 1, 4100]] },
    sameSys([[3, 1, 4100], [5, 1, 6300]])),
  [K('l3-009:q2')]: PP(pair(3, 1, 4100, 5, 1, 6300)),                                // (1100 ; 800)
  [K('l3-010:q2')]: PP(pair(1, 1, 64, 300, 500, 25000)),                             // (35 ; 29)

  /* ── Niveau 4 ── */
  [K('l4-001:q1')]: only({ A: [[1, 1, 75], [4, 5, 2100]], B: [[1, 1, 11250], [4, 5, 350]], C: [[1, 1, 75], [4, 5, 350]], D: [[1, 1, 75], [4, 5, 300]] }, sameSys(HAFL)),
  [K('l4-001:q2')]: R(sH.y),                                                          // 50
  [K('l4-001:q3')]: R(val(q(150 - 24).mul(sH.x))),                                    // 3150
  [K('l4-002:q1')]: R(val(q('0.8').mul(q(4).mul(90).add(q(3).mul(180))))),          // 720
  [K('l4-002:q2')]: R(val(q(4).mul(90).add(q(3).mul(180)).sub(q('0.8').mul(q(4).mul(90).add(q(3).mul(180)))))), // 180
  [K('l4-003:q1')]: PP(sShirts),                                                      // (2250 ; 200)
  // قميص + زوجا جوارب ici, contre la حزمة à 2 500 : l'option juste dit l'écart et le sens
  [K('l4-003:q2')]: only({ A: ['here', 150], B: ['same', 0], C: ['other', 50], D: ['other', 150] }, ([who, d]) => {
    const here = q(sShirts.x).add(q(2).mul(sShirts.y)); const diff = here.sub(2500);
    const truth = sign(diff) > 0 ? 'other' : sign(diff) < 0 ? 'here' : 'same';
    return who === truth && isZ(q(d).sub(sign(diff) < 0 ? diff.neg() : diff));
  }),
  [K('l4-004:q1')]: PP(pair(1, 1, 1000, 600, 200, 383000)),                          // (915/2 ; 1085/2)
  [K('l4-005:q1')]: PP(sOp),                                                          // (150 ; 800)
  [K('l4-005:q2')]: R(val(q(sOp.y).add(q(10).mul(sOp.x)))),                          // 2300
  [K('l4-006:q1')]: PP(sBus),                                                         // (300 ; 4500)
  [K('l4-006:q2')]: R(val(q(sBus.y).add(q(50).mul(sBus.x)).div(50))),                // 390
  [K('l4-007:q1')]: only({ A: [[1, 1, 2960], [120, 200, 20]], B: [[1, 1, 20], [200, 120, 2960]], C: [[1, 1, 20], [120, 200, 2960]], D: [[1, 1, 20], [120, 200, 320]] },
    sameSys([[1, 1, 20], [120, 200, 2960]])),
  [K('l4-007:q2')]: PP(pair(1, 1, 20, 120, 200, 2960)),                              // (13 ; 7)
  // dans 6 ans : x + 6 = 3(y + 6) ⇔ x − 3y = 12 ; options réécrites a·x + b·y = c
  [K('l4-008:q1')]: only({ A: [1, -3, -6], B: [1, -3, 18], C: [1, -3, 0], D: [1, -3, 12] }, (e) => prop(e, [1, -3, 3 * 6 - 6])),
  [K('l4-008:q2')]: PP(pair(1, 1, 52, 1, -3, 12)),                                   // (42 ; 10)
  [K('l4-009:q1')]: only({ A: [[1, 1, 32], [1, -1, 4]], B: [[2, 1, 32], [-1, 1, 4]], C: [[2, 1, 32], [1, -1, 4]], D: [[1, 2, 32], [1, -1, 4]] },
    sameSys([[2, 1, 32], [1, -1, 4]])),
  [K('l4-009:q2')]: PP(pair(2, 1, 32, 1, -1, 4)),                                    // (12 ; 8)
  [K('l4-010:q2')]: PP(pair(5, -3, 19, 2, 3, 23)),                                   // (6 ; 11/3)

  /* ── Niveau 5 ── */
  [K('l5-001:q1')]: PP(sH),
  [K('l5-001:q2')]: R(11250 - 2100),                                                  // 9150
  [K('l5-001:q3')]: R(val(q(200).mul(sH.x).add(q(120).mul(sH.y)))),                  // 11000
  [K('l5-002:q1')]: PP(pair(...flat(ATM1))),
  [K('l5-002:q2')]: PP(pair(...flat(ATM2))),                                          // (280 ; 120)
  [K('l5-003:q1')]: PP(sShop),                                                        // (300 ; 700)
  [K('l5-003:q2')]: only({ A: 'A', B: 'B', C: 'same', D: 'unknown' }, (w) => w === (lt(900, q(sShop.x).add(sShop.y)) ? 'B' : 'A')),
  [K('l5-003:q3')]: R(val(q(sShop.x).add(sShop.y).sub(900))),                        // 100
  [K('l5-004:q1')]: only({ A: ['0.8', 8, 10500], B: [1, 2, 10500], C: [1, 8, 10500], D: [1, 10, 10500] }, (e) => prop(e, [1, q('0.8').mul(10), 10500])),
  [K('l5-004:q2')]: PP(sClub),                                                        // (2500 ; 1000)
  [K('l5-004:q3')]: R(val(q('0.8').mul(sClub.y))),                                    // 800
  [K('l5-005:q1')]: only({ A: [[1, 1, 23000], [800, 300, 50]], B: [[1, 1, 50], [300, 800, 23000]], C: [[1, 1, 50], [800, 300, 23000]], D: [[800, 300, 50], [1, 1, 23000]] },
    sameSys([[1, 1, 50], [800, 300, 23000]])),
  [K('l5-005:q2')]: PP(pair(1, 1, 50, 800, 300, 23000)),                             // (16 ; 34)
  [K('l5-006:q1')]: PP(sNet),                                                         // (150 ; 500)
  [K('l5-006:q2')]: R(firstNat((n) => lt(1500, q(sNet.y).add(q(n).mul(sNet.x))))),   // 7
  [K('l5-007:q1')]: only({ A: [[1, 1, 84], [1, -2, -6]], B: [[1, 1, 42], [-2, 1, -6]], C: [[1, 1, 42], [1, -2, -12]], D: [[1, 1, 42], [1, -2, -6]] },
    sameSys([[2, 2, 84], [1, -2, -6]])),
  [K('l5-007:q2')]: PP(sPitch),                                                       // (26 ; 16)
  [K('l5-007:q3')]: R(val(q(sPitch.x).mul(sPitch.y))),                                // 416
  // +10 % sur دقلة نور seulement : 3 × 1,1x + y = 3040
  [K('l5-008:q1')]: only({ A: [q(3).mul('0.1'), 1, 3040], B: [3, 1, 3040], C: [q('1.1').mul(3), '1.1', 3040], D: [q(3).mul('1.1'), 1, 3040] },
    (e) => prop(e, [q(3).mul(q(1).add('0.1')), 1, 3040])),
  [K('l5-008:q2')]: PP(pair(2, 3, 2800, q(3).mul('1.1'), 1, 3040)),                 // (800 ; 400)
  [K('l5-009:q1')]: PP(sVtc),                                                         // (50 ; 100)
  [K('l5-009:q3')]: R(firstNat((n) => n > 0 && lt(q(sVtc.y).add(q(n).mul(sVtc.x)), q(60).mul(n)))), // 11
  // 2x + 4y = 300 et x + 2y = 160 : parallèles distinctes → aucune ثنائية
  [K('l5-010:q1')]: only({ A: ['pair', 60, 45], B: ['infinite'], C: ['pair', 20, 70], D: ['none'] }, ([kind, x, y]) => {
    const S = [[2, 4, 300], [1, 2, 160]];
    const parallel = isZ(q(2).mul(2).sub(q(1).mul(4)));
    const truth = parallel ? (prop(S[0], S[1]) ? 'infinite' : 'none') : 'unique';
    if (kind === 'pair') return truth === 'unique' && S.every((e) => holds(e, x, y));
    return kind === truth;
  }),
  // avec 150 : 2x + 4y = 300 est le double de x + 2y = 150 → une infinité ; « حل وحيد » est faux
  [K('l5-010:q2')]: only({ A: ['unique'], B: ['infinite'], C: ['none'], D: ['unique'] }, ([kind]) => {
    const S = [[2, 4, 300], [1, 2, 150]];
    const parallel = isZ(q(2).mul(2).sub(q(1).mul(4)));
    const truth = parallel ? (prop(S[0], S[1]) ? 'infinite' : 'none') : 'unique';
    return kind === truth;
  }),
};
