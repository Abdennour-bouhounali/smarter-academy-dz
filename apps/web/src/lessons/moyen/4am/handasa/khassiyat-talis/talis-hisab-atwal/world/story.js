/**
 * THE STORY of lesson `talis-hisab-atwal` in the world « الأهرامات » (`gameworld/nilePyramids/Game.js` plays it; design:
 * docs/reports/PYRAMIDS_WORLD_PLAN.md §3.2 and §3.7). The stages are the WORLD's data (its numbers: `nilePyramids/
 * logic.js`); the lesson gives what the world asks of it (GAME_WORLD.md §2ter-4): the forge of each stage's table, the
 * felucca's four legs, the card of the final mission, Ibn al-Haytham's box at noon, and its own sentences.
 *
 *   حقل النيل          two canals: his typed length, then the rope reads it            → forge 🔑 at the field's table
 *   ورشة البنّائين     two courses ordered, the row already cut placed by HIS mark   → forge 📐 (the experiment `plan`)
 *   عرض النيل          AS, SE, ER until S hides F; the ferry rope cut before crossing → forge 🦋 (the experiment `halfturn`)
 *   حجر القمّة         « كلّ طول × [k] » to the stone-cutter                           → forge 🔍 (the experiment `scale`)
 *   ظلّ الهرم الأكبر   the stick in the sun, the shadows, the mission card, the flight to his h; at noon the box
 *
 * No rule is told: nothing here names a key or states a rule before its forge (`story.test.js` reads every sentence a
 * stage plays before each seal). The final mission needs the four keys (plan §3.7): the shadow starts UNDER the apex
 * (📐's piece: the shadow outside + the half base), the stick and the height are both vertical (🔑's condition), 3/219 = 2/h (📐), k = 73 (🔍);
 * the box is a pair round the hole (🦋). Its distractors: the outside shadow alone (h = 69,3…), the ratio upside down (h = 328,5).
 */
import { slot } from '../../../../../../common/gameworld/kit/forge';
import {
  choiceBox,
  decimalBox,
  fractionBox,
  givenFraction,
  line,
} from '../../../../../../common/gameworld/kit/authoring/forgeBlocks';
import { LEGS } from './run';
import {
  CAMERA_BOX,
  FIELD,
  K1,
  K2,
  K3,
  K4,
  NUMBERS,
  PLATEAU,
  RIVER,
  equal,
  ltr,
  over,
  plus,
  tex,
  times,
  typedFrac,
  typedNumber,
  typedWhole,
  write,
} from './math';

/** The final mission's numbers (plan §3.7): the stick 2 casts 3; the shadow `PLATEAU` gives, from the middle of the base edge. */
const MI = NUMBERS.mission;
/** Half the base: the shadow starts under the APEX, at the centre of the base. */
export const HALF = write(over(PLATEAU.base, '2'));
/** AB = AH + HB, from the tip of the shadows to the point under the apex. */
export const MISSION_AB = write(plus(MI.shadow, HALF));
/** h from AM / AB = MN / BC: the height of the Great Pyramid. */
export const MISSION_H = write(over(times(MISSION_AB, MI.stick), MI.stickShadow));
/** k = AB / AM: the big triangle is the small one × k. */
export const MISSION_K = write(over(MISSION_AB, MI.stickShadow));
/** The box at noon: OB = 177 + 115 from the hole to the point under the apex; BC = 0,25 × OB / 0,5. */
export const BOX_OB = write(plus(CAMERA_BOX.fromEdge, HALF));
export const BOX_H = write(over(times(CAMERA_BOX.image, BOX_OB), CAMERA_BOX.depth));

/** The robot's sentences of the story — facts and directions, never a rule (`story.test.js`). */
export const SAY = {
  field: 'بعد الفيضان بقيت أوتاد الأركان الثلاثة وحدها. البنّاؤون يحتاجون طول القناتين قبل أن يعود الماء.',
  workshop: 'هرم الورشة لم يكتمل: مداميكه العليا تُقطع في المقلع قبل أن تُبنى.',
  river: 'العبّارة تحتاج حبلًا يُقطع قبل أن يعبر أحد النهر.',
  summit: 'الهرم ينتظر حجر قمّته: هرم صغير بالشكل نفسه.',
  plateau: 'الهرم الأكبر: لا أحد يتسلّقه، وظلّه على الأرض.',
  key1: 'يُروى أنّ طالس قاس ارتفاع هرم بظلّ عصا. عند آخر مرسى ستفعل مثله.',
  key2: 'ما لا يبلغه الحبل صار يُحسب. الفلوكة تنتظرك عند المرسى.',
  key3: 'عرض النهر قِسته دون أن تعبره. الفلوكة تنتظرك.',
  key4: 'عدد واحد لكلّ الأطوال. بقي الهرم الأكبر.',
};
const ARRIVE = { field: SAY.field, workshop: SAY.workshop, river: SAY.river, summit: SAY.summit, plateau: SAY.plateau };

/** A number in a MathText line of the card « من المرسى السابق ». */
const n = (x) => tex(x);
const COURSE_NAME = { course: 'المدماك الأوّل', course2: 'المدماك الثاني' };
/** The newest entry of the log for a step. */
const lastOf = (game, step) => [...(game.log ?? [])].reverse().find((l) => l.step === step) ?? null;

/** The card « من المرسى السابق »: what the stage before gave — facts he saw, at most three lines. */
function recall(game, id) {
  const T = game.T;
  const S = T.stage;
  const out = [];
  if (id === 'workshop')
    for (const canal of FIELD.canals) {
      const seg = canal.ends.join('');
      const typed = game.done?.[`${seg}?`];
      const read = game.done?.[seg];
      if (typed != null && read != null) out.push(`القناة $${seg}$: كتبتَ $${n(typed)}$ م، وقرأ الحبل $${n(read)}$ م.`);
    }
  if (id === 'river') {
    for (const step of ['course', 'course2']) {
      const l = lastOf(game, step);
      if (l) out.push(`${COURSE_NAME[step]} $MN = ${n(l.typed)}$ م: ${T.fact[l.fact]}`);
    }
    const mark = lastOf(game, 'mark');
    if (mark) out.push(`الصفّ عند العلامة $BM = ${n(mark.typed)}$ م.`);
  }
  if (id === 'summit') {
    out.push(`$AS = ${RIVER.AS}$ م، $SE = ${RIVER.SE}$ م، $ER = ${RIVER.ER}$ م.`);
    const ferry = lastOf(game, 'ferry');
    if (ferry) out.push(`حبل العبّارة $AF = ${n(ferry.typed)}$ م: ${T.fact[ferry.fact]}`);
  }
  if (id === 'plateau') {
    const cap = lastOf(game, 'capstone');
    if (cap) out.push(`حجر القمّة: كلّ طول × $${n(cap.typed)}$ — ${S.fact[cap.fact]}`);
  }
  return out.slice(-3);
}

/** The schematic figure of the mission card (not to scale — the card says so): the stick's triangle in the big one. */
const MISSION_FIGURE = {
  points: { A: [0, 0], M: [2.4, 0], N: [2.4, 1.6], H: [6.4, 0], B: [9.4, 0], C: [9.4, 6.2] },
  segments: [
    { from: 'A', to: 'M', label: MI.stickShadow },
    { from: 'M', to: 'H' },
    { from: 'H', to: 'B' },
    { from: 'A', to: 'C', tone: 'amber' },
    { from: 'M', to: 'N', label: MI.stick, tone: 'rose', bold: true },
    { from: 'B', to: 'C', label: 'h', tone: 'rose', bold: true },
  ],
  ariaLabel: 'العصا وظلّها داخل مثلّث الهرم وظلّه',
};
/** The box at noon (not to scale): the apex C and the point B under it, their images C′ and B′ through the hole O. */
const BOX_FIGURE = {
  points: { C: [-8, 4], B: [-8, 0], O: [0, 0], 'B′': [1.6, 0], 'C′': [1.6, -0.8] },
  segments: [
    { from: 'B', to: 'C', label: 'h', tone: 'rose', bold: true },
    { from: 'C', to: 'C′', tone: 'amber' },
    { from: 'B', to: 'B′' },
    { from: 'B′', to: 'C′', label: CAMERA_BOX.image, tone: 'rose', bold: true },
  ],
  ariaLabel: 'الهرم وصورته المقلوبة عبر ثقب الصندوق',
};

/** The two parts of a sum he typed, as a sorted key — or null. */
const partsOf = (a, b) => {
  const [x, y] = [typedWhole(a), typedWhole(b)];
  return x == null || y == null ? null : [x, y].sort((p, q) => p - q).join(';');
};
const sortedKey = (...xs) =>
  xs
    .map(Number)
    .sort((p, q) => p - q)
    .join(';');

/** THE FINAL MISSION — « ظلّ الهرم الأكبر » (plan §3.7): four lines, one per key. */
const MISSION = {
  title: 'بطاقة المهمّة — ظلّ الهرم الأكبر',
  lead: [
    `العصا $[MN]$ طولها $${MI.stick}$ م وظلّها $AM = ${MI.stickShadow}$ م. ظلّ الهرم من منتصف حافّة القاعدة $AH = ${MI.shadow}$ م، وضلع القاعدة $${PLATEAU.base}$ م. النقطة $B$ تحت القمّة $C$، في مركز القاعدة.`,
  ],
  figure: MISSION_FIGURE,
  lines: () => [
    line(['AB = AH + HB =', slot('ah', 'AH', 3), '+', slot('hb', 'HB', 3), '=', slot('ab', 'AB', 3)]),
    line(
      [
        `${ltr('(MN)')} و ${ltr('(BC)')} متوازيان لأنّ`,
        choiceBox('why', 'السبب', [
          { id: 'vertical', text: 'كلاهما شاقولي' },
          { id: 'length', text: 'لهما الطول نفسه' },
          { id: 'shadow', text: 'لكلّ منهما ظلّ' },
        ]),
      ],
      'rtl',
    ),
    line([
      fractionBox('rn', 'rd', { w: 3 }),
      '=',
      { frac: { n: slot('mn', 'MN', 1), d: 'h' } },
      '⟹ h =',
      decimalBox('h', 'h', 5),
    ]),
    line([`${ltr('ABC')} تكبير للمثلّث ${ltr('AMN')} بمعامل`, 'k =', slot('k', 'k', 3)], 'rtl'),
  ],
  /** 'ok', or a FACT about the first line that does not hold yet. */
  check(v) {
    const parts = partsOf(v.ah, v.hb);
    if (parts !== sortedKey(MI.shadow, HALF)) {
      if (parts === sortedKey(MI.shadow, PLATEAU.base))
        return `السطر الأوّل: $HB$ من منتصف الحافّة إلى مركز القاعدة، لا الضلع كلّه $${PLATEAU.base}$.`;
      return `السطر الأوّل: $AH = ${MI.shadow}$، و $HB$ من منتصف حافّة القاعدة إلى $B$ تحت القمّة.`;
    }
    const ab = typedWhole(v.ab);
    if (ab == null || !equal(String(ab), MISSION_AB))
      return `السطر الأوّل: $${MI.shadow} + ${HALF}$ ليس $${ab ?? '?'}$.`;
    if (v.why !== 'vertical')
      return 'السطر الثاني: هذا لا يجعل مستقيمين متوازيين. كيف تقف العصا ويقف الارتفاع على الأرض؟';
    const r = typedFrac(v.rn, v.rd);
    const am = over(MI.stickShadow, MISSION_AB);
    if (r == null || !equal(r, am)) {
      if (r != null && equal(r, over(MISSION_AB, MI.stickShadow)))
        return 'السطر الثالث: النسبة طول من الرأس $A$ فوق الضلع كلّه، كما $\\dfrac{MN}{BC}$.';
      if (r != null && equal(r, over(MI.stickShadow, MI.shadow)))
        return `السطر الثالث: $AB = ${MISSION_AB}$ كما في السطر الأوّل.`;
      return 'السطر الثالث: النسبة $\\dfrac{AM}{AB}$ بالأطوال.';
    }
    if (typedWhole(v.mn) == null || !equal(String(typedWhole(v.mn)), MI.stick)) return `السطر الثالث: $MN$ طول العصا.`;
    const h = typedNumber(v.h);
    if (h == null || !equal(h, MISSION_H)) {
      const [p, q] = [MI.stickShadow, MISSION_AB];
      const shown = h ?? '0';
      return `السطر الثالث: $${p} \\times ${n(shown)} = ${n(times(p, shown))}$ و $${q} \\times ${MI.stick} = ${n(times(q, MI.stick))}$.`;
    }
    const k = typedWhole(v.k);
    if (k == null || !equal(String(k), MISSION_K))
      return `السطر الرابع: $AM \\times ${k ?? 0} = ${n(times(MI.stickShadow, String(k ?? 0)))}$، و $AB = ${MISSION_AB}$.`;
    return 'ok';
  },
  /** The h he wrote: Zero rises to it, whatever it is (the world carries out a misreading). */
  height: (v) => v.h,
};

/** IBN AL-HAYTHAM'S BOX at noon (plan §3.7): the same height another way — a pair round the hole. */
const BOX = {
  title: 'صندوق ابن الهيثم',
  lead: [
    `عند الظهر لا يخرج الظلّ من القاعدة. ثقب الصندوق $O$ على بعد $${CAMERA_BOX.fromEdge}$ م من حافّة القاعدة، وعلى جداره الخلفيّ، $${n(CAMERA_BOX.depth)}$ م وراء الثقب، صورة الهرم مقلوبة طولها $${n(CAMERA_BOX.image)}$ م.`,
  ],
  figure: BOX_FIGURE,
  lines: () => [
    line(['OB =', slot('o1', 'الطول الأوّل', 3), '+', slot('o2', 'الطول الثاني', 3), '=', slot('ob', 'OB', 3)]),
    line(['BC =', givenFraction(`${CAMERA_BOX.image} × OB`, CAMERA_BOX.depth), '=', slot('bc', 'BC', 3)]),
  ],
  check(v) {
    const parts = partsOf(v.o1, v.o2);
    if (parts !== sortedKey(CAMERA_BOX.fromEdge, HALF))
      return `السطر الأوّل: من الثقب إلى حافّة القاعدة $${CAMERA_BOX.fromEdge}$ م، ثمّ من الحافّة إلى $B$ تحت القمّة.`;
    const ob = typedWhole(v.ob);
    if (ob == null || !equal(String(ob), BOX_OB))
      return `السطر الأوّل: $${CAMERA_BOX.fromEdge} + ${HALF}$ ليس $${ob ?? '?'}$.`;
    const bc = typedWhole(v.bc);
    if (bc == null || !equal(String(bc), BOX_H)) {
      const shown = String(bc ?? 0);
      return `السطر الثاني: $${n(CAMERA_BOX.depth)} \\times ${shown} = ${n(times(CAMERA_BOX.depth, shown))}$ و $${n(CAMERA_BOX.image)} \\times ${BOX_OB} = ${n(times(CAMERA_BOX.image, BOX_OB))}$.`;
    }
    return 'ok';
  },
};

export const STORY = {
  /** The felucca's four legs (`run.js`): leg i sails from dock i to dock i + 1. */
  legs: LEGS,
  /** The forge played at each stage's table (`forges.js`). */
  forges: { field: K1, workshop: K2, river: K3, summit: K4 },
  mission: MISSION,
  box: BOX,
  recall,
  /** On arriving at a stage: one sentence of the robot (a fact of the place). Run twice, it says it twice — nothing more. */
  onArrive(game, id) {
    if (ARRIVE[id]) game.say(ARRIVE[id], 6);
  },
  afterKey: {
    [K1]: (game) => game.say(SAY.key1, 7),
    [K2]: (game) => game.say(SAY.key2, 6),
    [K3]: (game) => game.say(SAY.key3, 6),
    [K4]: (game) => game.say(SAY.key4, 6),
  },
};
