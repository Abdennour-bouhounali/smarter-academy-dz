/**
 * AN INTEGRATION MISSION, played (`docs/reports/INTEGRATION_LESSON_PLAN.md` §3) — PROTOTYPE of mission 1 (2026-11-20).
 *
 * The student is the engineer: whatever he reads, the world builds — his misreadings too. Five stations, one screen each,
 * nothing scrolls:
 *   1. the story without its numbers — he sends the robot to count what he needs;
 *   2. he builds the situation — the sentences of the text placed on his model; the world rehearses HIS model;
 *   3. the goal flags — each answer sentence built before any computation, and their order;
 *   4. a bridge for each step — the key of the unit, the computation, and the world carries the result out;
 *   5. the seal — the numbers enter their sentences; the four habits get their names; the exam text is revealed.
 * The situation is DATA (`situation`); this file names no lesson. The verdict is what the world does, never « wrong ».
 * Not built yet (prototype): the save, the sound, the replay with other numbers, missions 2 and 3.
 */
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Check, Flag, Play, RotateCcw, X } from 'lucide-react';
import { M } from '../kit/parts';
import { euclid, fill, MISREADINGS, NEEDED, pack, rehearse } from './lots';
import './mission.css';

const NB = '\u00a0';
/** Arabic agreement of a counted noun: forms = [one, two, plural (3–10), singular accusative (11+)]. */
const counted = (n, forms) => {
  const last = n % 100;
  if (n === 1) return forms[0];
  if (n === 2) return forms[1];
  return last >= 3 && last <= 10 ? `${n}${NB}${forms[2]}` : `${n}${NB}${forms[3]}`;
};
const CRATES = ['صندوق واحد', 'صندوقان', 'صناديق', 'صندوقًا'];
const HOUSES = ['دار واحدة', 'داران', 'دور', 'دارًا'];

const STEPS = ['القصّة', 'الوضعية', 'الأعلام', 'الجسور', 'الختم'];

/** One lot of the scene: its crates drawn one by one while they are few, two bars with their counts beyond. */
function Lot({ lot, kinds, x, y, w, h }) {
  const n = lot.a + lot.b;
  const drawn = n <= 24;
  const cols = Math.max(4, Math.ceil(Math.sqrt(n * 1.6)));
  const cell = Math.min((w - 10) / cols, (h - 30) / Math.max(1, Math.ceil(n / cols)));
  const crates = [...Array(lot.a).fill('a'), ...Array(lot.b).fill('b')];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" className="ms-lot" />
      {drawn ? (
        crates.map((k, i) => (
          <rect
            key={i}
            x={x + 5 + (i % cols) * cell}
            y={y + 5 + Math.floor(i / cols) * cell}
            width={cell - 2}
            height={cell - 2}
            rx="2"
            fill={kinds[k].color}
          />
        ))
      ) : (
        <>
          <rect
            x={x + 6}
            y={y + 8}
            width={(w - 12) * (lot.a / Math.max(1, n))}
            height={(h - 38) / 2}
            rx="3"
            fill={kinds.a.color}
          />
          <rect
            x={x + 6}
            y={y + 12 + (h - 38) / 2}
            width={(w - 12) * (lot.b / Math.max(1, n))}
            height={(h - 38) / 2}
            rx="3"
            fill={kinds.b.color}
          />
        </>
      )}
      <text x={x + w / 2} y={y + h - 8} className="ms-lot__count" textAnchor="middle" direction="ltr">
        {`${lot.a} + ${lot.b}`}
      </text>
    </g>
  );
}

/**
 * The scene « lots »: the lots the world made, and the quay with what was left. Up to 12 lots are drawn whole; beyond
 * (the 132 lots of the real stock) every lot is a small tile and ONE lot is drawn large beside them.
 */
function LotsScene({ lots, left, kinds, caption, empty = 0, zoomed = true }) {
  const W = 760;
  const H = 380;
  const many = lots.length + empty > 12;
  const quay = left.a + left.b > 0;
  const area = { x: 12, y: 12, w: W - 24 - (quay ? 170 : 0), h: H - 24 };
  const body = [];
  if (!many) {
    const n = Math.max(1, lots.length);
    const cols = n <= 4 ? n : Math.ceil(n / 2);
    const rows = Math.ceil(n / cols);
    const w = Math.min(170, area.w / cols - 10);
    const h = Math.min(170, area.h / rows - 10);
    lots.forEach((lot, i) =>
      body.push(
        <Lot
          key={i}
          lot={lot}
          kinds={kinds}
          x={area.x + (i % cols) * (w + 10)}
          y={area.y + Math.floor(i / cols) * (h + 10)}
          w={w}
          h={h}
        />,
      ),
    );
  } else {
    const n = lots.length + empty;
    // `zoomed: false` — the lots are counted, their content is not shown (it is the next question)
    const zoom = zoomed ? lots[0] : null;
    const grid = { x: area.x, y: area.y, w: area.w - (zoom ? 190 : 0), h: area.h };
    const cols = Math.ceil(Math.sqrt((n * grid.w) / grid.h));
    const rows = Math.ceil(n / cols);
    const cw = grid.w / cols;
    const ch = Math.min(cw, grid.h / rows);
    for (let i = 0; i < n; i += 1)
      body.push(
        <rect
          key={`t${i}`}
          x={grid.x + (i % cols) * cw + 1.5}
          y={grid.y + Math.floor(i / cols) * ch + 1.5}
          width={cw - 3}
          height={ch - 3}
          rx="3"
          className={i < lots.length ? 'ms-tile' : 'ms-tile ms-tile--empty'}
        />,
      );
    if (zoom)
      body.push(<Lot key="zoom" lot={zoom} kinds={kinds} x={grid.x + grid.w + 14} y={area.y + 60} w={170} h={190} />);
  }
  return (
    <svg className="ms-scene" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption} data-ms-scene={lots.length}>
      {body}
      {quay && (
        <g data-ms-quay={`${left.a}+${left.b}`}>
          <rect x={W - 170} y={12} width={158} height={H - 24} rx="10" className="ms-quay" />
          <text x={W - 91} y={42} className="ms-quay__title" textAnchor="middle">
            على الرصيف
          </text>
          <rect
            x={W - 150}
            y={60}
            width={118}
            height={Math.max(8, Math.min(100, left.a))}
            rx="4"
            fill={kinds.a.color}
          />
          <text x={W - 91} y={190} className="ms-quay__n" textAnchor="middle">
            {left.a}
          </text>
          <rect
            x={W - 150}
            y={215}
            width={118}
            height={Math.max(8, Math.min(90, left.b))}
            rx="4"
            fill={kinds.b.color}
          />
          <text x={W - 91} y={335} className="ms-quay__n" textAnchor="middle">
            {left.b}
          </text>
        </g>
      )}
    </svg>
  );
}

function Legend({ kinds }) {
  return (
    <p className="ms-legend">
      {['a', 'b'].map((k) => (
        <span key={k}>
          <i style={{ background: kinds[k].color }} />
          {kinds[k].crates}
        </span>
      ))}
    </p>
  );
}

/** Station 1 — the story without its numbers: he decides what he needs and sends the robot to count it. */
function Story({ sit, asked, onAsk }) {
  const need = sit.asks.filter((a) => a.needed);
  return (
    <>
      <div className="ms-main">
        <p className="ms-story" data-ms-story>
          {sit.story.map((part, i) =>
            typeof part === 'string' ? (
              <span key={i}>{part}</span>
            ) : (
              <b key={i} className={`ms-hole ${asked.includes(part.ask) ? 'is-known' : ''}`} data-ms-hole={part.ask}>
                {asked.includes(part.ask) ? sit.asks.find((a) => a.id === part.ask).said : '؟ صندوقًا'}
              </b>
            ),
          )}
        </p>
      </div>
      <aside className="ms-side">
        <h3>أرسل الروبوت ليعدّ ما تحتاجه</h3>
        <div className="ms-asks">
          {sit.asks.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`ms-ask ${asked.includes(a.id) ? 'is-asked' : ''}`}
              data-ms-ask={a.id}
              onClick={() => onAsk(a.id)}
            >
              <span>{a.label}</span>
              {asked.includes(a.id) && <b>{a.said}</b>}
            </button>
          ))}
        </div>
        <p className="ms-note" data-ms-asked={asked.length}>
          {need.every((a) => asked.includes(a.id))
            ? asked.length > need.length
              ? 'عدّ الروبوت كلّ ما طلبتَه. هل تحتاج القصّة إليه كلّه؟ سنرى.'
              : 'للقصّة الآن أعدادها.'
            : 'في القصّة عددان مخفيّان.'}
        </p>
      </aside>
    </>
  );
}

/** What the world says after rehearsing his model — facts about what it built, never a judgement. */
const REHEARSED = {
  apart: (r, sit) =>
    `الروبوت كوّن ${counted(r.lots.length, sit.lot.forms)}: كلّ تشكيلة من نوع واحد. دار تستلم البطاطا وحدها، ودار الجزر وحده.`,
  equalAB: (r, sit) =>
    `في كلّ تشكيلة صندوق بطاطا وصندوق جزر: ${counted(r.lots.length, sit.lot.forms)}، وبقي على الرصيف ${counted(r.left.a, CRATES)} من البطاطا.`,
  unequal: (r, sit) =>
    `${counted(r.lots.length, sit.lot.forms)}، ولا صندوق باقٍ — لكنّ التشكيلات ليست متماثلة: انظر ما في كلّ واحدة.`,
  left: (r, sit) =>
    `${counted(r.lots.length, sit.lot.forms)} متماثلة — وبقي على الرصيف ${counted(r.left.a, CRATES)} من البطاطا و${counted(r.left.b, CRATES)} من الجزر.`,
  few: (r, sit) =>
    `${counted(r.lots.length, sit.lot.forms)} متماثلة ولا صندوق باقٍ: ${counted(r.lots.length, HOUSES)} فقط تستفيد.`,
  fair: (r, sit) =>
    `${counted(r.lots.length, sit.lot.forms)} متماثلة، لا صندوق باقٍ، ولا يمكن تكوين أكثر: هذا ما يريده الفلّاح.`,
};

/** Station 2 — he builds the situation: the sentences of the text on his model; the world rehearses HIS model. */
function Model({ sit, placed, onToggle, run, onRun }) {
  return (
    <>
      <div className="ms-main">
        {run ? (
          <>
            <LotsScene lots={run.lots} left={run.left} kinds={sit.kinds} caption="تجربة الروبوت" />
            <Legend kinds={sit.kinds} />
            <p className="ms-fact" data-ms-rehearsed={run.outcome}>
              {REHEARSED[run.outcome](run, sit)}
            </p>
          </>
        ) : (
          <p className="ms-story">
            قبل الأعداد الكبيرة، تجربة صغيرة: {sit.small.a} صندوق بطاطا و{sit.small.b} صناديق جزر. الروبوت سيجمّعها كما
            تقول له وضعيتك — بالشروط التي تضعها، وبها فقط.
          </p>
        )}
      </div>
      <aside className="ms-side">
        <h3>ضع على وضعيتك ما يقوله النصّ</h3>
        <div className="ms-phrases">
          {sit.phrases.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`ms-phrase ${placed.includes(p.id) ? 'is-on' : ''}`}
              data-ms-phrase={p.id}
              aria-pressed={placed.includes(p.id)}
              onClick={() => onToggle(p.id)}
            >
              {placed.includes(p.id) && <Check size={16} aria-hidden="true" />}
              {p.text}
            </button>
          ))}
        </div>
        <button type="button" className="ms-btn" data-ms-run onClick={onRun} disabled={!placed.length}>
          <Play size={18} aria-hidden="true" />
          جرّب وضعيتي
        </button>
      </aside>
    </>
  );
}

/** Station 3 — the goal flags: each answer sentence built before any computation, then their order. */
function Flags({ sit, picks, onPick, first, onFirst }) {
  const [f1, f2] = sit.flags;
  const s1 = f1.starts.find((s) => s.id === picks.start1);
  const u1 = f1.units.find((u) => u.id === picks.unit1);
  const s2 = f2.starts.find((s) => s.id === picks.start2);
  const said =
    [s1, u1, s2].find((x) => x && !x.right)?.built ?? (first && first !== sit.chain.first ? sit.chain.built : null);
  const tiles = (list, key, row = false) => (
    <div className={`ms-tiles ${row ? 'ms-tiles--row' : ''}`}>
      {list.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`ms-tilebtn ${picks[key] === s.id ? 'is-on' : ''}`}
          data-ms-pick={`${key}:${s.id}`}
          onClick={() => onPick(key, s.id)}
        >
          {s.text}
        </button>
      ))}
    </div>
  );
  return (
    <>
      <div className="ms-main ms-main--flags">
        <div className={`ms-flag ${s1?.right && u1?.right ? 'is-up' : ''}`} data-ms-flag="1">
          <Flag size={22} aria-hidden="true" />
          <span>{s1 ? s1.text : '…'}</span>
          <b className="ms-box">▢</b>
          <span>{u1 ? u1.text : '…'}</span>
        </div>
        <div className={`ms-flag ${s2?.right ? 'is-up' : ''}`} data-ms-flag="2">
          <Flag size={22} aria-hidden="true" />
          <span>{s2 ? s2.text : '…'}</span>
        </div>
        {said && (
          <p className="ms-fact" data-ms-flag-built>
            {said}
          </p>
        )}
      </div>
      <aside className="ms-side">
        <h3>{f1.ask}</h3>
        {tiles(f1.starts, 'start1')}
        {tiles(f1.units, 'unit1', true)}
        <h3>{f2.ask}</h3>
        {tiles(f2.starts, 'start2')}
        <h3>{sit.chain.ask}</h3>
        <div className="ms-tiles ms-tiles--row">
          {[
            ['lots', 'عدد التشكيلات'],
            ['content', 'ما في التشكيلة'],
          ].map(([id, text]) => (
            <button
              key={id}
              type="button"
              className={`ms-tilebtn ${first === id ? 'is-on' : ''}`}
              data-ms-first={id}
              onClick={() => onFirst(id)}
            >
              {text}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

const num = (v) => (/^\d+$/.test(String(v ?? '').trim()) ? Number(v) : null);

function Box({ value, onChange, label, name, w = 4 }) {
  return (
    <input
      className="ms-in"
      inputMode="numeric"
      dir="ltr"
      style={{ width: `${w + 1.4}ch` }}
      value={value ?? ''}
      aria-label={label}
      data-ms-in={name}
      onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
    />
  );
}

/** What the world says after packing the real stock in the lots he computed. */
const PACKED = {
  left: (p, sit) =>
    `${counted(p.n, sit.lot.forms)} متماثلة — لكن بقي على الرصيف ${counted(p.left.a, CRATES)} من البطاطا و${counted(p.left.b, CRATES)} من الجزر.`,
  more: (p, sit) =>
    `${counted(p.n, sit.lot.forms)} متماثلة ولا صندوق باقٍ. لكنّ الروبوت قسم كلّ تشكيلة إلى ${counted(p.split, sit.lot.forms)} متماثلة: يمكن أن تستفيد دور أكثر.`,
  most: (p, sit) => `${counted(p.n, sit.lot.forms)} متماثلة، لا صندوق باقٍ، ولا تشكيلة تنقسم: لا يمكن تكوين أكثر.`,
};
const FILLED = {
  short: (f, sit) =>
    `امتلأت ${counted(f.full, sit.lot.forms)} ثمّ انتهى المحصول: ${counted(f.empty, sit.lot.forms)} بقيت فارغة.`,
  left: (f) =>
    `امتلأت التشكيلات كلّها، وبقي على الرصيف ${counted(f.left.a, CRATES)} من البطاطا و${counted(f.left.b, CRATES)} من الجزر.`,
  exact: () => 'امتلأت التشكيلات كلّها ولم يبقَ صندوق.',
};

/** Station 4 — a bridge for each step: the key of the unit, the computation, and the world carries the result out. */
function Bridges({ sit, st, set }) {
  const { a, b } = sit.stock;
  const rows = useMemo(() => euclid(a, b), [a, b]);
  const tool = sit.tools.find((t) => t.id === st.tool);
  const n = num(st.n);
  const per = { a: num(st.pa), b: num(st.pb) };
  const second = st.packed?.outcome === 'most';
  let scene = null;
  if (second && st.filled)
    scene =
      st.filled.outcome === 'short'
        ? { lots: Array(st.filled.full).fill(st.per), left: { a: 0, b: 0 }, empty: st.filled.empty }
        : { lots: Array(st.packed.n).fill(st.per), left: st.filled.left };
  else if (st.packed) scene = { lots: Array(st.packed.n).fill(st.packed.per), left: st.packed.left, zoomed: false };
  return (
    <>
      <div className="ms-main">
        {scene ? (
          <>
            <LotsScene {...scene} kinds={sit.kinds} caption="ما بناه العالم" />
            <Legend kinds={sit.kinds} />
            <p className="ms-fact" data-ms-built={second && st.filled ? st.filled.outcome : st.packed.outcome}>
              {second && st.filled
                ? FILLED[st.filled.outcome](st.filled, sit)
                : PACKED[st.packed.outcome](st.packed, sit)}
            </p>
          </>
        ) : (
          <p className="ms-story">
            الجسر الأوّل: عدد التشكيلات. اختر المفتاح الذي يفتحه، احسب، ثمّ اكتب العدد: العالم سيكوّن التشكيلات كما
            حسبتَ، بـ{NB}
            {a} صندوق بطاطا و{b} صندوق جزر.
          </p>
        )}
      </div>
      <aside className="ms-side">
        {!second ? (
          <>
            <h3>الجسر 1 — أيّ مفتاح يفتحه؟</h3>
            <div className="ms-tools">
              {sit.tools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`ms-tool ${st.tool === t.id ? 'is-on' : ''}`}
                  data-ms-tool={t.id}
                  onClick={() => set({ tool: t.id, packed: null })}
                >
                  <span aria-hidden="true">{t.icon}</span>
                  {t.text}
                </button>
              ))}
            </div>
            {tool?.right && (
              <div className="ms-work" dir="ltr" data-ms-work>
                {rows.map((r, i) => (
                  <p key={r.a}>
                    <M>{`${r.a} = ${r.b} \\times`}</M>
                    <Box
                      value={st[`q${i}`]}
                      onChange={(v) => set({ [`q${i}`]: v })}
                      label={`حاصل القسمة ${i + 1}`}
                      name={`q${i}`}
                      w={2}
                    />
                    <M>+</M>
                    <Box
                      value={st[`r${i}`]}
                      onChange={(v) => set({ [`r${i}`]: v })}
                      label={`باقي القسمة ${i + 1}`}
                      name={`r${i}`}
                      w={3}
                    />
                  </p>
                ))}
              </div>
            )}
            {tool && (
              <p className="ms-answer">
                <span>عدد التشكيلات:</span>
                <Box value={st.n} onChange={(v) => set({ n: v })} label="عدد التشكيلات" name="n" />
                <span>{sit.lot.one}</span>
                <button
                  type="button"
                  className="ms-btn"
                  data-ms-pack
                  disabled={!n}
                  onClick={() => set({ packed: pack(n, sit.stock) })}
                >
                  <Play size={18} aria-hidden="true" />
                  كوّنها
                </button>
              </p>
            )}
          </>
        ) : (
          <>
            <h3>الجسر 2 — ما في كلّ تشكيلة من {counted(st.packed.n, sit.lot.forms)}؟</h3>
            <p className="ms-answer ms-answer--stack">
              <span>
                <Box
                  value={st.pa}
                  onChange={(v) => set({ pa: v, filled: null })}
                  label="صناديق البطاطا في التشكيلة"
                  name="pa"
                  w={3}
                />
                صندوقًا من {sit.kinds.a.name}
              </span>
              <span>
                <Box
                  value={st.pb}
                  onChange={(v) => set({ pb: v, filled: null })}
                  label="صناديق الجزر في التشكيلة"
                  name="pb"
                  w={3}
                />
                صندوقًا من {sit.kinds.b.name}
              </span>
              <button
                type="button"
                className="ms-btn"
                data-ms-fill
                disabled={!per.a || !per.b}
                onClick={() => set({ per, filled: fill(st.packed.n, per, sit.stock) })}
              >
                <Play size={18} aria-hidden="true" />
                املأ التشكيلات
              </button>
            </p>
          </>
        )}
      </aside>
    </>
  );
}

/** Station 5 — the seal: the numbers in their sentences, the four habits named, the exam text revealed. */
function Seal({ sit, st, page, onPage }) {
  const [f1, f2] = sit.flags;
  const s1 = f1.starts.find((s) => s.right);
  const u1 = f1.units.find((u) => u.right);
  const [head, mid, tail] = f2.starts.find((s) => s.right).text.split('▢');
  return (
    <>
      <div className="ms-main ms-main--flags">
        {page === 0 && (
          <>
            <div className="ms-flag is-up is-sealed" data-ms-sealed="1">
              <Flag size={22} aria-hidden="true" />
              <span>{s1.text}</span>
              <b className="ms-box">{st.packed.n}</b>
              <span>{u1.text}</span>
            </div>
            <div className="ms-flag is-up is-sealed" data-ms-sealed="2">
              <Flag size={22} aria-hidden="true" />
              <span>{head}</span>
              <b className="ms-box">{st.per.a}</b>
              <span>{mid}</span>
              <b className="ms-box">{st.per.b}</b>
              <span>{tail}</span>
            </div>
            <p className="ms-fact">
              {counted(st.packed.n, HOUSES)} تستلم كلّ واحدة تشكيلتها: {counted(st.per.a, CRATES)} من البطاطا و
              {counted(st.per.b, CRATES)} من الجزر — المحصول كلّه وُزّع.
            </p>
          </>
        )}
        {page === 1 && (
          <div className="ms-habits" data-ms-habits>
            {sit.habits.map((h) => (
              <div key={h.title} className="ms-habit">
                <span aria-hidden="true">{h.icon}</span>
                <b>{h.title}</b>
                <p>{h.text}</p>
              </div>
            ))}
          </div>
        )}
        {page === 2 && (
          <div className="ms-paper" data-ms-exam>
            <h3>{sit.session}</h3>
            {sit.exam.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )}
      </div>
      <aside className="ms-side">
        <h3>{['جملتا الجواب', 'ما فعلتَه له اسم', 'هذا ما حللتَه'][page]}</h3>
        <p className="ms-note">
          {
            [
              'كتبتَ الجملتين قبل أن تحسب؛ الأعداد دخلت الآن مكانها.',
              'أربع عادات عشتَها في هذه المهمّة — ستجدها في كلّ وضعية.',
              'هذا نصّ الوضعية كما جاء في الامتحان: قرأتَه، بنيتَه، وحللتَه.',
            ][page]
          }
        </p>
        {page < 2 && (
          <button type="button" className="ms-btn" data-ms-seal-next onClick={() => onPage(page + 1)}>
            {page === 0 ? 'العادات الأربع' : 'نصّ الامتحان'}
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        )}
      </aside>
    </>
  );
}

const SAY = [
  'أنا زيرو. هذه قصّة فلّاح… لكنّ أعدادها مخفيّة. اقرأها أوّلًا، ثمّ قل لي ماذا أعدّ.',
  'سأجمّع الصناديق كما تقول وضعيتك، لا أكثر. ضع عليها كلّ ما يشترطه النصّ.',
  'قبل أيّ حساب: ماذا نبحث عنه؟ ابنِ جملة كلّ جواب، وقل أيّهما أوّلًا.',
  'لكلّ خطوة مفتاح من مفاتيح المقطع. اختر، احسب، وسأبني ما وجدتَ.',
  'ختمتَ المهمّة الأولى!',
];

export default function MissionPlayer({ situation: sit, onClose }) {
  const [step, setStep] = useState(0);
  const [asked, setAsked] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [run, setRun] = useState(null);
  const [picks, setPicks] = useState({});
  const [first, setFirst] = useState(null);
  const [st, setSt] = useState({});
  const [page, setPage] = useState(0);
  const set = (patch) => setSt((s) => ({ ...s, ...patch }));

  const [f1, f2] = sit.flags;
  const ready = [
    sit.asks.filter((a) => a.needed).every((a) => asked.includes(a.id)),
    run?.outcome === 'fair' &&
      NEEDED.every((id) => placed.includes(id)) &&
      !MISREADINGS.some((id) => placed.includes(id)),
    Boolean(
      f1.starts.find((s) => s.id === picks.start1)?.right &&
        f1.units.find((u) => u.id === picks.unit1)?.right &&
        f2.starts.find((s) => s.id === picks.start2)?.right &&
        first === sit.chain.first,
    ),
    st.packed?.outcome === 'most' && st.filled?.outcome === 'exact',
    false,
  ][step];
  const unused = sit.asks.filter((a) => !a.needed && asked.includes(a.id));

  // on the page's body: the mission covers whatever layout mounts it (a footer of the shell stood over it otherwise)
  return createPortal(
    <div className="ms-root" dir="rtl" data-ms-step={step} data-ms-ready={ready}>
      <header className="ms-head">
        <h2>{sit.title}</h2>
        <ol className="ms-steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'is-on' : i < step ? 'is-done' : ''}>
              <b>{i < step ? <Check size={14} aria-hidden="true" /> : i + 1}</b>
              {s}
            </li>
          ))}
        </ol>
        <button type="button" className="ms-x" aria-label="خروج" data-ms-close onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="ms-body">
        {step === 0 && (
          <Story sit={sit} asked={asked} onAsk={(id) => setAsked((a) => (a.includes(id) ? a : [...a, id]))} />
        )}
        {step === 1 && (
          <Model
            sit={sit}
            placed={placed}
            run={run}
            onToggle={(id) => {
              setPlaced((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
              setRun(null);
            }}
            onRun={() => setRun(rehearse(placed, sit.small))}
          />
        )}
        {step === 2 && (
          <Flags
            sit={sit}
            picks={picks}
            onPick={(k, v) => setPicks((p) => ({ ...p, [k]: v }))}
            first={first}
            onFirst={setFirst}
          />
        )}
        {step === 3 && <Bridges sit={sit} st={st} set={set} />}
        {step === 4 && <Seal sit={sit} st={st} page={page} onPage={setPage} />}
      </div>
      <footer className="ms-foot">
        <p className="ms-say" data-ms-say>
          <span className="ms-bot" aria-hidden="true" />
          {step === 3 && unused.length
            ? `طلبتَ منّي ${unused.map((a) => a.label).join(' و')}: هل دخل في حسابك؟ ليس كلّ عدد في القصّة يُستعمل.`
            : SAY[step]}
        </p>
        {step === 3 && st.packed && st.packed.outcome !== 'most' && (
          <button type="button" className="ms-btn ms-btn--ghost" data-ms-again onClick={() => set({ packed: null })}>
            <RotateCcw size={18} aria-hidden="true" />
            أعيد الحساب
          </button>
        )}
        {step < 4 && (
          <button
            type="button"
            className="ms-btn ms-btn--go"
            data-ms-next
            disabled={!ready}
            onClick={() => setStep(step + 1)}
          >
            {['إلى الوضعية', 'إلى الأعلام', 'إلى الجسور', 'إلى الختم'][step]}
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        )}
      </footer>
    </div>,
    document.body,
  );
}
