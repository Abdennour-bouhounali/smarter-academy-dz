/**
 * PREVIEW page (development builds only, `/__qa/nile-pyramids`): the world « الأهرامات » in its PHASE 1 grey box
 * (`docs/reports/PYRAMIDS_WORLD_PLAN.md` §6 row 1), mounted with NO lesson — its lesson `talis-hisab-atwal` is not built
 * yet. The host below is the least the kit's shell needs: no key, no rule, no practice, no sitting, every door of the
 * title screen closed (`notYet`), its own save (`qa-nile-pyramids`), and a preview: nothing is sent.
 *
 * `story.legs` is a PLACEHOLDER course of gates for the felucca (the kit's rail as it is, gate F3): four buoys of the
 * nested chain with mental numbers. The lesson's real legs (`world/run.js`, plan §1.3) replace it at wave 1.
 */
import NilePyramids from '../../lessons/common/gameworld/nilePyramids/NilePyramids';
import { loadKit, saveKit } from '../../lessons/common/launchkit/store';

const ID = 'qa-nile-pyramids';
const pick = (random, list) => list[Math.floor(random() * list.length)];

/** One buoy: AM / AB = AN / AC with whole numbers, AC asked; the wrong buoys hold the piece and the inverted ratio. */
function round(level, random) {
  for (;;) {
    const p = pick(random, [2, 3, 4, 5]);
    const q = p + pick(random, [2, 3, 4, 5]);
    const m = pick(random, [2, 3, 4, 6]);
    const AM = p * m;
    const AB = q * m;
    const AN = p * pick(random, [3, 5, 7]);
    const AC = (AB * AN) / AM;
    const piece = (AN * (AB - AM)) / AM;
    const inverted = (AM * AN) / AB;
    const opts = [AC, piece, inverted];
    if (new Set(opts).size < 3 || !opts.every((v) => Number.isInteger(v))) continue;
    const order = [0, 1, 2].sort(() => random() - 0.5);
    return {
      ask: '',
      tex: `AM = ${AM},\\ AB = ${AB},\\ AN = ${AN} \\Rightarrow AC = ?`,
      options: order.map((k) => ({ t: String(opts[k]) })),
      right: order.indexOf(0),
      why: order.map((k) => (k === 0 ? '' : `$\\dfrac{${AM}}{${AB}} = \\dfrac{${AN}}{AC}$`)),
    };
  }
}

const LEG = {
  levels: [{ name: 'النيل', from: '' }],
  gates: 4,
  total: 4,
  round,
  text: {
    title: 'رحلة على النيل',
    say: 'أربع عوّامات قبل المرسى التالي.',
    rule: 'خذ العوّامة التي تحمل الطول الصحيح.',
    start: 'أبحر',
    again: 'أعد الرحلة من المرسى',
    leave: 'إلى المرسى',
    order: 'المطلوب',
    gate: 'العوّامة',
    of: 'من',
    left: 'يسارًا',
    right: 'يمينًا',
    pause: 'توقّف',
    resume: 'واصل',
    quit: 'عُد إلى المرسى',
    pausedTitle: 'الفلوكة متوقّفة',
    pausedText: 'اضغط « واصل » لتكمل الرحلة.',
    won: { title: 'وصلتَ إلى المرسى', text: 'الفلوكة ترسو.' },
    lost: { title: 'نفدت القلوب', text: 'تعيد الرحلة من مرساها.' },
  },
};

const LESSON = {
  keys: [],
  rules: {},
  notYet: ['know', 'map', 'progress', 'lab', 'launch'],
  sittings: null,
  journey: { examOpen: () => false },
  evidence: { verify: () => false, payloadOf: () => null },
  story: { legs: [LEG, LEG, LEG, LEG] },
};
const CONFIG = { id: ID, title: 'معاينة العالم — المرحلة الأولى', modules: [] };

export default function NilePyramidsPreview() {
  // « ابدأ » enters the world at once: this preview has no launch kit (the title screen asks it only once per lesson)
  const kit = loadKit();
  if (!kit.lessons?.[ID]) saveKit({ ...kit, lessons: { ...(kit.lessons ?? {}), [ID]: true } });
  return (
    <NilePyramids
      lesson={LESSON}
      config={CONFIG}
      basePath="/__qa/nile-pyramids"
      exitTo="/"
      completedModules={[]}
      preview
    />
  );
}
