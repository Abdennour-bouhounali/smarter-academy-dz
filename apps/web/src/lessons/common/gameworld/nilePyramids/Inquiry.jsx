/**
 * THE INVESTIGATIONS of « الأهرامات » — the first phase « استكشف » of `kit/RuleForge.jsx` when a forge declares
 * `inquiry` (contract: GAME_WORLD.md « استكشف »). The student ACTS on Thalès figures; no rule is written here and none is
 * told: what answers him is what the world builds.
 *
 *   <Inquiry spec={forge.inquiry} game={game} onDone={(result) => …} />
 *   spec = { kind: 'plan', rounds, text? }        (`InquiryPlan.jsx`, `plan.js` — key 📐; may `writes` the rule)
 *        | { kind: 'halfturn', rounds, text? }    (`InquiryHalfturn.jsx`, `halfturn.js` — key 🦋)
 *        | { kind: 'scale', tri, rounds, text? }  (`InquiryScale.jsx`, `scale.js` — key 🔍)
 * `text` is the LESSON's wording over the world's (`strings.js › KIND_TEXT`).
 */
import { Plan } from './InquiryPlan';
import { Halfturn } from './InquiryHalfturn';
import { Scale } from './InquiryScale';
import './inquiry.css';

const KINDS = { plan: Plan, halfturn: Halfturn, scale: Scale };

export default function Inquiry({ spec, game, onDone }) {
  const Kind = KINDS[spec.kind];
  if (!Kind) throw new Error(`nilePyramids: no investigation of kind « ${spec.kind} »`);
  const play = (name, p) => game?.audio?.play(name, p);
  return (
    <div className="np-iq-frame" dir="rtl">
      <Kind spec={spec} play={play} onDone={onDone} />
    </div>
  );
}
