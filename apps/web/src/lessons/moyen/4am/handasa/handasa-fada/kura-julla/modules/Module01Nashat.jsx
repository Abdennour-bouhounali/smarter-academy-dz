import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, LAB } from '../content/textbook';
import BallsCutaway from '../components/BallsCutaway';

/**
 * Module 1 — نشاط 1 (p. 164) « الكُرة و الجُلّة », ouvert sur LA SONDE (sphere-probe), une vraie sphère 3D.
 *
 * REAL / MANIPULATE  le lab à deux niveaux, même objectif :
 *   متقدم (ouvert par défaut : le نشاط 1, r = 4, et l'exemple de معارف 1) : l'élève POSE M sur la كرة, P dans la جلّة sans être
 *          sur la كرة, Q dehors — OM n'est jamais écrite pendant le geste —, puis ouvre le قطر [MM′] et les دوائر كبرى / صغرى ;
 *   مبتدئ : la lampe-globe de verre (R = 3) et trois sondes A, B, C (OM = 3, √3, 2√3) que l'élève atteint et classe, OM² lu.
 * DISCOVER / UNDERSTAND  les quatre questions du نشاط 1 : cercle et disque (r = 4) ; le ballon creux et la boule pleine, dessinés
 *           coupés en deux (la photo du manuel, redessinée pour que l'intérieur se voie) ; les objets du quotidien ; les deux
 *           phrases à compléter → la brique « kura-julla-nashat » ; enfin une question posée SOUS les essais de l'élève
 *           (`onTrial`, `[data-activity-evidence]`).
 * AUCUNE étape n'attend `onFinished`. LP : P1 (كرة / جلّة), P2 (le قطر, les دوائر — au niveau متقدم), P4 (situer un point).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const WHERE = { surface: 'على الكرة', inside: 'داخل الجلة', outside: 'خارج الجلة' };
const pt = (n, p) => `$${n}(${p[0]}\\,;\\,${p[1]}\\,;\\,${p[2]})$`;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  const onTrial = (ev) => { if (ev && ev.ok && ev.where) setTrials((s) => [...s, ev].slice(-9)); };

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={trials.length ? 'true' : 'false'}>
      {trials.length === 0 ? (
        <p className="text-slate-500">لم تضع بعد أي نقطة في المسبار (المستوى «متقدم»).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">نقطك المقبولة:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="points">
            {trials.map((t) => (
              <li key={t.n} className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-900" data-evidence-point={t.name}>
                <MathText>{`${pt(t.name, t.at)} : ${WHERE[t.where]}`}</MathText>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — الكرة والجلة"
      moduleSubtitle="كرة أجوف وكرة مملوءة: ما الفرق رياضيا؟"
      estimatedTime="18 دقيقة"
      brief={{
        tag: 'نشاط 1 — الكتاب ص 164',
        headline: 'من ملعب كرة اليد إلى مصباح الكرة الزجاجية!',
        emoji: '🔮',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <BallsCutaway decorative labels={false} />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation} <SourceTag source={ACTIVITY_LINES.source} /></p>
            <p className="text-sm text-slate-600">في المستوى «متقدم» (نشاط 1، نصف القطر 4): تضع بنفسك نقطة على الكرة ونقطة في الجلة ونقطة خارجها، ثم الأقطار والدوائر. في المستوى «مبتدئ»: مصباح كرة زجاجية نصف قطرها 3 وثلاث نقط مضيئة تحكم على موقعها. أدِر المشهد بإصبعك لترى من كل الجهات.</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="المسبار في الفضاء"
          defaultLevel="advanced"
          lead={<MathText>{'في المستويين: النقطة على الكرة إذا كان بعدها عن المركز $O$ يساوي نصف القطر تماما، وفي الجلة إذا كان أصغر منه أو يساويه.'}</MathText>}
          levels={{
            beginner: () => (
              <Manipulation
                type="sphere-probe"
                level="beginner"
                numbers={LAB.beginner.numbers}
                theme="glass-globe"
                title="الكرة الزجاجية المضيئة: أين تقع النقط A و B و C؟"
                lead={<MathText>{'مصباح كرة زجاجية مركزها $O$ ونصف قطرها $3$ في غرفة لاعب. حرّك المسبار $M$ إلى كل نقطة مضيئة واحكم على موقعها.'}</MathText>}
              />
            ),
            advanced: () => (
              <Manipulation
                type="sphere-probe"
                level="advanced"
                numbers={LAB.advanced.numbers}
                theme="shot-put"
                title="نشاط 1: الكرة والجلة (نصف القطر 4)"
                lead={<MathText>{'كرة مركزها $O$ ونصف قطرها $4$ — كرة اليد الجوفاء أم جلة رمي الجلة المملوءة؟ ضع $M$ و $P$ و $Q$ كما في معارف 1، ثم ابنِ قطرا ودائرتين.'}</MathText>}
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'نشاط 1: الدائرة والقرص', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.part1} source={ACTIVITY.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'الدائرة والقرص لهما نفس المركز O ونفس نصف القطر $4\\,\\mathrm{cm}$ . النقطة:'}</MathText></p>}
                rows={[
                  // la حافة : sur le cercle ET dans le disque
                  { id: 'a', label: <MathText>{'E حيث $OE = 4\\,\\mathrm{cm}$'}</MathText>, options: ['من الدائرة ومن القرص', 'من القرص فقط', 'لا من الدائرة ولا من القرص'], correct: 0, correction: <MathText>{ACTIVITY_LINES.q1}</MathText> },
                  // l'intérieur : dans le disque seulement (MISC-KURA-JULLA, sa version plane)
                  { id: 'b', label: <MathText>{'F حيث $OF = 2{,}5\\,\\mathrm{cm}$'}</MathText>, options: ['من الدائرة ومن القرص', 'من القرص فقط', 'لا من الدائرة ولا من القرص'], correct: 1, correction: 'F داخل الدائرة: بعدها عن O أصغر من 4 cm، فهي من القرص وليست من الدائرة.' },
                  { id: 'c', label: <MathText>{'G حيث $OG = 5\\,\\mathrm{cm}$'}</MathText>, options: ['من الدائرة ومن القرص', 'من القرص فقط', 'لا من الدائرة ولا من القرص'], correct: 2, correction: 'G خارج الدائرة: بعدها عن O أكبر من 4 cm.' },
                ]}
                requires={['daira-qurs']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: الدائرة هي الحافة وحدها، والقرص هو الحافة وما بداخلها.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'نشاط 1: أجوف أم مملوء؟', subtitle: 'السؤالان 2 و 3', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={`${ACTIVITY.part2} ${ACTIVITY.part3}`} source={ACTIVITY.source} compact />
              <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-2">
                <BallsCutaway />
                <p className="text-center text-xs text-slate-500">رسمت المنصّة صورتي الكتاب مقطوعتين نصفين ليظهر الداخل.</p>
              </div>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">3) هذه مجسمات من محيطك: نموذج لكرة أم لجلة؟</p>}
                rows={[
                  // le ballon de football est gonflé d'air : une coque (MISC-KURA-JULLA)
                  { id: 'foot', label: 'كرة القدم المنفوخة', options: ['نموذج لكرة (أجوف)', 'نموذج لجلة (مملوء)'], correct: 0, correction: 'غلاف رقيق مملوء هواء: مجسّم أجوف، نموذج للكرة.' },
                  { id: 'orange', label: 'حبّة برتقال من بوفاريك', options: ['نموذج لكرة (أجوف)', 'نموذج لجلة (مملوء)'], correct: 1, correction: 'مملوءة حتى المركز: نموذج للجلة.' },
                  { id: 'bubble', label: 'فقاعة صابون', options: ['نموذج لكرة (أجوف)', 'نموذج لجلة (مملوء)'], correct: 0, correction: 'غشاء رقيق جدا وهواء في الداخل: نموذج للكرة.' },
                  { id: 'marble', label: 'بلية زجاجية', options: ['نموذج لكرة (أجوف)', 'نموذج لجلة (مملوء)'], correct: 1, correction: 'زجاج مملوء: نموذج للجلة.' },
                ]}
                requires={['daira-qurs']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? <MathText>{ACTIVITY_LINES.q3}</MathText> : 'راجع التصحيح تحت كل سطر: هل الداخل فارغ أم مملوء؟'}</Feedback>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'نشاط 1: أتمم', subtitle: 'السؤال 4', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.part4} source={ACTIVITY.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">اختر الكلمة التي تتمّ كل جملة:</p>}
                rows={[
                  // la دائرة : un objet du PLAN, pas de l'espace
                  { id: 'r', label: 'النقط من الفضاء التي تبعد بمسافة ثابتة r عن O هي …', options: ['الكُرة', 'الجُلّة', 'الدائرة'], correct: 0, correction: 'النقط على البعد r تماما تشكّل سطحا أجوف: الكرة (والدائرة هي الحالة نفسها في المستوي).' },
                  // le قرص : son analogue plan
                  { id: 'le', label: 'النقط من الفضاء التي تبعد بمسافة أصغر من أو تساوي r عن O هي …', options: ['الجُلّة', 'الكُرة', 'القرص'], correct: 0, correction: 'السطح وكل ما بداخله: مجسّم مملوء، الجلة (والقرص هو نظيرها في المستوي).' },
                ]}
                requires={['daira-qurs']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: كما الدائرة والقرص في المستوي، الكرة والجلة في الفضاء.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="kura-julla-nashat" lead="الجملتان كاملتين، بكلمات الكتاب:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'من المسبار: النقطة P', subtitle: 'كرة أم جلة؟', done: q4,
          content: (
            <div className="space-y-3">
              {evidence}
              <TapQuestion
                prompt={<MathText>{'في المسبار (المستوى «متقدم») وضعت النقطة $P$ في الجلة التي مركزها $O$ ونصف قطرها $4$ ، دون أن تكون على الكرة. ماذا تحقّق $P$ ؟'}</MathText>}
                options={[
                  '$OP < 4$ : P من الجلة، وليست من الكرة',
                  // « dans la boule » pris pour « sur la كرة » (MISC-KURA-JULLA)
                  '$OP = 4$ : P من الكرة لأنها داخلها',
                  // l'inégalité renversée : dehors
                  '$OP > 4$ : P من الجلة لأنها بعيدة عن المركز',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['kura-julla-nashat']}
                explain={<MathText>{'نقط الكرة تحقّق $OM = 4$ فقط (سطح أجوف)، ونقط الجلة تحقّق $OM \\le 4$ . النقطة P داخل الجلة وليست على سطحها: $OP < 4$ . ' + ACTIVITY_LINES.lab}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
