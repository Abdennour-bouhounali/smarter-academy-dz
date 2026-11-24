/**
 * PREVIEW page (development builds only, `/__qa/nile-pyramids`): the pyramids world in its PHASE 1 grey box
 * (`docs/reports/PYRAMIDS_WORLD_PLAN.md` §6 row 1), mounted with NO lesson — its lesson `talis-hisab-atwal` is not built
 * yet. The host below is the least the kit's shell needs: no key, no rule, no practice, no sitting, every door of the
 * title screen closed (`notYet`), its own save (`qa-nile-pyramids`), and a preview: nothing is sent.
 *
 * `story.legs` is a PLACEHOLDER course of gates for the felucca (the kit's rail as it is, gate F3): four buoys of the
 * nested chain with mental numbers. The lesson's real legs (`world/run.js`, plan §1.3) replace it at wave 1.
 * `story.mission` and `story.box` are PLACEHOLDER cards with bare boxes (the lesson's cards, plan §3.7, replace them).
 *
 * `/__qa/nile-pyramids?kind=plan|halfturn|scale|mirror` shows ONE experiment of the world (or a case in the forge's
 * mirror) alone in a forge-sized frame, on the example specs of its tests — to look at a kind without a lesson.
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import NilePyramids from '../../lessons/common/gameworld/nilePyramids/NilePyramids';
import Inquiry from '../../lessons/common/gameworld/nilePyramids/Inquiry';
import { Mirror } from '../../lessons/common/gameworld/nilePyramids/forgeParts';
import { thalesCase } from '../../lessons/common/gameworld/nilePyramids/ruleForge';
import { slot } from '../../lessons/common/gameworld/kit/forge';
import { WORLD_TEXT } from '../../lessons/common/gameworld/nilePyramids/strings';
import { PLAN_SPEC, HALFTURN_SPEC, SCALE_SPEC } from '../../lessons/common/gameworld/nilePyramids/test/specs';
import { loadKit, saveKit } from '../../lessons/common/launchkit/store';
import '../../lessons/common/gameworld/kit/ruleForge.css';

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
  story: {
    legs: [LEG, LEG, LEG, LEG],
    mission: {
      title: 'بطاقة المهمّة',
      lead: ['ارتفاع الهرم الأكبر $h$.'],
      figure: {
        points: { A: [0, 0], M: [3, 0], N: [3, 2], B: [10, 0], C: [10, 6.7] },
        segments: [
          ['A', 'B'],
          ['A', 'C'],
          ['M', 'N'],
          ['B', 'C'],
        ],
        ariaLabel: 'مثلّثان متداخلان',
      },
      lines: () => [{ dir: 'ltr', tokens: ['h =', slot('h', 'h', 5, { decimal: true }), WORLD_TEXT.unit] }],
      check: (v) => (v.h === '146' ? 'ok' : 'زيرو لم يصل إلى القمّة.'),
      height: (v) => v.h,
    },
    box: {
      title: 'صندوق ابن الهيثم',
      lead: ['الصورة مقلوبة على الجدار الخلفيّ.'],
      lines: () => [{ dir: 'ltr', tokens: ['SH =', slot('sh', 'SH', 5, { decimal: true }), WORLD_TEXT.unit] }],
      check: (v) => (v.sh === '146' ? 'ok' : 'الصورة لا توافق هذا الارتفاع.'),
    },
  },
};
const CONFIG = { id: ID, title: 'معاينة العالم — المرحلة الأولى', modules: [] };

const KIND_SPECS = { plan: PLAN_SPEC, halfturn: HALFTURN_SPEC, scale: SCALE_SPEC };
const MIRROR_CASE = thalesCase({
  names: { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
  len: { VM: '14', VB: '63', VN: '16', VC: '72', MN: '18', BC: '81' },
});

/** One experiment (or the mirror) alone, in the forge's experiment panel at 1366 × 768 (1205 × 587 px, `CALC_LAYOUT`). */
function KindAlone({ kind }) {
  const [done, setDone] = useState(null);
  const game = { audio: { play: () => {} } };
  return createPortal(
    <div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#1f2937', padding: 60 }}>
      <div
        style={{ position: 'relative', width: 1205, height: 587, margin: '0 auto', fontSize: 17 }}
        data-qa-kind={kind}
      >
        <div className="rf-fit">
          {kind === 'mirror' ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <Mirror c={MIRROR_CASE} stage="done" />
            </div>
          ) : done ? (
            <pre dir="ltr">{JSON.stringify(done, null, 1)}</pre>
          ) : (
            <Inquiry spec={KIND_SPECS[kind]} game={game} onDone={setDone} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function NilePyramidsPreview() {
  const kind = new URLSearchParams(window.location.search).get('kind');
  if (kind) return <KindAlone kind={kind} />;
  // the start button enters the world at once: this preview has no launch kit (the title screen asks it only once per lesson)
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
