import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { CHALLENGE, INTRO_THALES, SITUATION, REMARKS, LAB, LESSON_TITLES, analysisText } from '../content/textbook';
import { BASE } from '../../_unit/unitMeta';
import { SECTION } from '../content/figures';
import MinaretFigure from '../components/MinaretFigure';
import ConeFigure from '../components/ConeFigure';

/**
 * Module 7 — le تحدّ de la page d'unité (p. 103, DOUBLON DÉCLARÉ) puis la وضعية (p. 112) lue dans les TROIS étapes
 * du « تحليل الوضعية » du manuel (قراءة الوضعية وفهمها · تحليل الوضعية واختيار استراتيجية حل مناسبة · تنفيذ
 * استراتيجية الحل المختارة), comme les synthèses des unités 2 à 8.
 *
 * LE WORKSPACE (deux types, un objectif — MANIPULATION_CONTRACT §2undecies ; props dans content/textbook.js › LAB) :
 *   مبتدئ  shadow-world, le تحدّ dans « ساحة الحيّ » (2026-10-13) : le soleil tenu, les ombres mesurées, un pari, la loi
 *          ÉCRITE par l'élève puis réparée à une autre heure, la minaret trouvée ; le bâton planté à la lisière de
 *          l'ombre de la minaret donne la méthode du manuel (les deux ombres finissent en O) ;
 *   متقدم  cone-cylinder, la وضعية : h et r tenus par la main, le cône refuse le cylindre qui le perce ; deux
 *          cylindres inscrits ouvrent la relation, puis h = r (la demi-coupe carrée).
 * Ouvert sur مبتدئ (`defaultLevel` par défaut) : les deux premières étapes portent sur le تحدّ ; la وضعية est un
 * onglet plus loin, nommé par son titre. Les essais de l'élève (`onTrial`) sont listés au-dessus des questions
 * d'exécution (`[data-activity-evidence]`). Aucune étape n'attend un laboratoire (`onFinished`).
 * LP : P1 (le تحدّ, Thalès mobilisé), P2 (coupe axiale, équation, volume), P3 (stratégie, vérification).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const TRUE_FALSE = ['صحيح', 'خاطئ'];
const close = (target) => (n) => Number.isFinite(n) && Math.abs(n - target) < 1e-9;

/** Un geste jugé dans « ساحة الحيّ » (`onTrial` de shadow-world), en une ligne LTR. */
const OBJ = { minaret: 'المئذنة', stick: 'العصا', palm: 'النخلة', flag: 'السارية', lamp: 'العمود', farid: 'فريد' };
function stickLine(e) {
  if (!e) return null;
  if (e.stage === 'measure') return `${e.hour} · ${OBJ[e.obj]}: ${e.shadow} m`;
  if (e.stage === 'predict') return `${e.hour} · ${OBJ[e.obj]}: 🚩 ${e.p} m → ${e.truth} m ${e.kind === 'right' ? '✓' : '✗'}`;
  if (e.stage === 'rule') return `${e.hour} · s = h ${e.op} ${e.num} ${e.allFit ? '✓' : '✗'}`;
  if (e.stage === 'meet') return `${e.hour} · AB = ${e.d} m → O = ${e.O} m ✓`;
  if (e.stage === 'answer') return `AM = ${e.h} m ${e.kind === 'right' ? '✓' : '✗'}`;
  return null;
}
/** Un essai du cylindre (`onTrial` de cone-cylinder). */
function coneLine(e) {
  if (!e) return null;
  if (e.pierce) return `h = ${e.h} ، r = ${e.r} ✗`;
  return `h = ${e.h} ، r = ${e.r} ${e.inscribed ? '✓' : '…'} V = ${e.vop}π`;
}

function Evidence({ trials, line, title, empty, id }) {
  const shown = trials.map(line).filter(Boolean).slice(-6);
  return (
    <div className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence={id}>
      {shown.length === 0 && <p className="text-slate-500" data-tried="false">{empty}</p>}
      {shown.length > 0 && (
        <div data-tried="true">
          <p>{title}</p>
          <ul className="ms-4 list-disc">{shown.map((s, i) => <li key={i}><bdi dir="ltr" className="font-mono">{s}</bdi></li>)}</ul>
        </div>
      )}
    </div>
  );
}

/** Le renvoi d'une partie de la وضعية vers le درس qui l'enseigne. */
const BackLink = ({ lesson, what }) => (
  <p className="text-xs text-slate-500" data-back-link={lesson}>{what} — <Link to={`${BASE}/${lesson}`} className="text-blue-700 underline">{LESSON_TITLES[lesson]}</Link></p>
);

/** Une étape du « تحليل الوضعية » du manuel, au mot près. */
const Phase = ({ i }) => (
  <TextbookBox kind="remark" title={SITUATION.analysis[i].label} text={analysisText(SITUATION.analysis[i])} source={SITUATION.source} compact />
);

export default function Module07AlWadiya() {
  const [stickTrials, setStickTrials] = useState([]);
  const [coneTrials, setConeTrials] = useState([]);
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const keepStick = (e) => setStickTrials((list) => [...list, e]);
  const keepCone = (e) => setConeTrials((list) => [...list, e]);

  return (
    <ContentModule objectives={["كيف نعرف ارتفاع مئذنة دون أن نصعدها؟", "أيّ شكل مستوٍ يختصر أسطوانة داخل مخروط؟", "كيف نجد r ثم الحجم ونتحقّق من ملاءمة النتيجة؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} moduleTitle="تحليل الوضعية النهائية للاختبار" moduleSubtitle="ارتفاع المئذنة بالظل، ثم أسطوانة داخل مخروط" estimatedTime="18 دقيقة"
      brief={{
        tag: 'أدمج تعلّماتي — الكتاب ص 112 (وتحدّ الوحدة ص 103)', headline: 'أطوال لا نصل إليها: مئذنة الحيّ وعلبة داخل مخروط', emoji: '🕌',
        title: 'وضعيتان، فكرة واحدة: ما الذي يجمع بين المئذنة والمخروط؟', tone: 'amber',
        body: (
          <div className="space-y-2" data-situation="ustuwana-makhrut">
            <p className="font-bold">{SITUATION.title}</p>
            <p><MathText>{SITUATION.text}</MathText></p>
            <ConeFigure H="18" R="6" />
          </div>
        ),
        footer: <SourceTag source={SITUATION.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="المستوى المبتدئ هو تحدّ الوحدة في ساحة الحيّ: حرّك الشمس، قِس الظلال، توقّع واكتب قاعدتك حتى تعرف ارتفاع المئذنة دون أن تصعدها. المستوى المتقدّم هو وضعية الكتاب: غيّر طول الأسطوانة ونصف قطرها حتى تلمس المخروط."
          levels={{
            beginner: () => (
              <Manipulation type="shadow-world" level="beginner" {...LAB.beginner} title="تحدّ الوحدة: ارتفاع مئذنة الحيّ بالظلال" onTrial={keepStick} />
            ),
            advanced: () => (
              <Manipulation type="cone-cylinder" level="advanced" {...LAB.advanced} title="وضعية الكتاب: مخروط ارتفاعه 18 ونصف قطر قاعدته 6" onTrial={keepCone} />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'تحدّ الوحدة: اشرح الطريقة', subtitle: 'كيف قاس فريد ومقران ارتفاع المئذنة؟', done: !!q[1],
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" title="تحدّ" text={CHALLENGE.text} source={CHALLENGE.source} compact>
                <MinaretFigure {...CHALLENGE.numbers} />
              </TextbookBox>
              <Evidence id="beginner" trials={stickTrials} line={stickLine} title="ما فعلته في ساحة الحيّ:"
                empty="لم تبدأ بعد: في المستوى المبتدئ حرّك الشمس وقِس الظلال، ثم اغرس العصا وراقب أين ينتهي ظلّها." />
              <TapQuestion
                prompt="لماذا غرس مقران العصا في هذا المكان بالذات؟"
                options={[
                  'لينتهي ظلّ العصا حيث ينتهي ظلّ المئذنة: العصا والمئذنة متوازيتان، فالمثلثان اللذان رأسهما O في وضعية طالس.',
                  'لأنّ ظلّ العصا يساوي طولها في ذلك المكان.',
                  'لأنّ العصا هناك في منتصف المسافة بين المئذنة ونهاية ظلّها.',
                  'لا يهمّ المكان: كل الأماكن تعطي النتيجة نفسها.',
                ].map(M)}
                correct={0} cols={1} requires={['talis-mubashira']}
                explain={<MathText>{`${REMARKS.zillMethod} ${REMARKS.zillWhy} ظلّ العصا $1{,}6\\,\\mathrm{m}$ لا يساوي طولها، والعصا على $10\\,\\mathrm{m}$ وليست في منتصف $11{,}6\\,\\mathrm{m}$ .`}</MathText>}
                onAnswered={mark(1)} />
              {q[1] && (
                <>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la méthode de l’ombre est `hisab-atwal` (درس talis-hisab-atwal) appliquée à deux verticales ;
                      la bonne option et l’explication de la question ci-dessus (REMARKS.zillMethod / zillWhy) viennent de l’énoncer. */}
                  <KnowledgeBrick id="tariqat-zill" variant="rappel" />
                  <p className="text-xs text-slate-600" data-misconception-note="zill"><MathText>{`خطأ شائع: ${REMARKS.zillWrong} ${REMARKS.zillWrongWhy}`}</MathText></p>
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'تحدّ الوحدة: ارتفاع المئذنة', subtitle: 'بالقياسات الثلاث على الأرض', done: !!q[2],
          content: (
            <div className="space-y-3">
              <Evidence id="beginner-pole" trials={stickTrials} line={stickLine} title="ما فعلته في ساحة الحيّ:"
                empty="جرّب على المستوى المبتدئ: قِس ظلّ المئذنة وظلّ العصا في الساعة نفسها." />
              <NumericQuestion
                prompt="ما ارتفاع المئذنة (بالمتر)؟"
                expected={close(7.25)} display="7,25" parse={parseDec}
                requires={['tariqat-zill', 'rabi-mutanasib']}
                explain={<MathText>{`${REMARKS.zillOB} ${REMARKS.zillEq}`}</MathText>}
                explainFor={(n) => <MathText>{close(11.6)(n) ? `ارتفاع المئذنة ليس طول ظلّها. ${REMARKS.zillEq}` : close(10)(n) ? `10 هي المسافة بين المئذنة والعصا (AB) لا الارتفاع. ${REMARKS.zillOB} ${REMARKS.zillEq}` : `${REMARKS.zillOB} ${REMARKS.zillEq}`}</MathText>}
                onAnswered={mark(2)} />
              <BackLink lesson="talis-hisab-atwal" what="خاصية طالس وحساب طول مجهول" />
              {q[2] && <TextbookBox kind="remark" title={INTRO_THALES.title} text={INTRO_THALES.text} source={INTRO_THALES.source} compact />}
            </div>
          ) },
        { num: 3, title: 'قراءة الوضعية وفهمها', subtitle: 'المرحلة 1 من الكتاب: ما المطلوب؟', done: !!q[3],
          content: (
            <div className="space-y-3">
              <Phase i={0} />
              <TapQuestion
                prompt="ما المطلوب في نص الوضعية؟"
                options={[
                  'حجم الأسطوانة عندما يتساوى ارتفاعها ونصف قطر قاعدتها',
                  'حجم المخروط',
                  'ارتفاع المخروط',
                  'نصف قطر قاعدة المخروط',
                ].map(M)}
                correct={0} cols={1} requires={['hajm-ustuwana']}
                explain={<MathText>{'المطلوب: «احسب حجم هذه الأسطوانة في الحالة $h = r$ ». ارتفاع المخروط ونصف قطر قاعدته معطيان ( $18\\,\\mathrm{cm}$ و $6\\,\\mathrm{cm}$ )، وحجم المخروط غير مطلوب.'}</MathText>}
                onAnswered={mark(3)} />
            </div>
          ) },
        { num: 4, title: 'أيّ شكل مستوٍ؟', subtitle: 'من المجسّم إلى المقطع', done: !!q[4],
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="أيّ شكل هندسي مستوٍ نربطه بالصورة لحساب r؟"
                options={[
                  'المقطع المحوري: مثلث قائم ضلعاه القائمان ارتفاع المخروط ونصف قطر قاعدته، وفيه مستطيل الأسطوانة (h و r)',
                  'دائرة قاعدة المخروط وحدها',
                  'مستطيل وحده بُعداه 18 و 6',
                  'مثلث متقايس الأضلاع',
                ].map(M)}
                correct={0} cols={1} requires={['maqta-mihwari']}
                explain={<MathText>{`${REMARKS.maqta} الدائرة لا تُظهر h، والمستطيل وحده لا يُظهر المخروط، والمقطع ليس متقايس الأضلاع ( $6 \\neq 18$ ).`}</MathText>}
                onAnswered={mark(4)} />
              {q[4] && (
                <>
                  <GeoFigure {...SECTION} />
                  <p className="text-sm"><MathText>{REMARKS.maqta}</MathText></p>
                </>
              )}
            </div>
          ) },
        { num: 5, title: 'تحليل الوضعية واختيار استراتيجية', subtitle: 'المرحلة 2 من الكتاب: أيّ خاصية؟', done: !!q[5],
          content: (
            <div className="space-y-3">
              <Phase i={1} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في نصف المقطع المحوري (الشكل أعلاه)، احكم على كل عبارة.</p>}
                rows={[
                  { id: 's1', label: '(TC) و (SK) متوازيان لأنّهما عموديان كلاهما على المحور (SO).', options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.tawazi}</MathText> },
                  { id: 's2', label: 'النقط O و T و S على استقامة، والنقط O و C و K على استقامة.', options: TRUE_FALSE, correct: 0, correction: 'T و S على المحور، و C على المولّد [OK].' },
                  { id: 's3', label: <MathText>{'$OT = h$'}</MathText>, options: TRUE_FALSE, correct: 1, correction: <MathText>{`${REMARKS.otWhy} إذن $OT = 18 - h$ .`}</MathText> },
                  { id: 's4', label: 'نحسب r بخاصية فيثاغورس في المثلث OSK وحده.', options: TRUE_FALSE, correct: 1, correction: 'خاصية فيثاغورس في OSK تعطي طول المولّد OK ولا تذكر r: نحتاج المثلثين OTC و OSK معًا، أي خاصية طالس.' },
                ]}
                requires={['talis-mubashira', 'maqta-mihwari']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: مستقيمان متوازيان يقطعان مستقيمين متقاطعين في O — وضعية طالس.' : 'المستقيمان (TC) و (SK) متوازيان، والضلع الذي رأسه O في المثلث الصغير هو $18 - h$ .'}</MathText>}
                onAnswered={mark(5)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la coupe axiale est un prérequis (`maqta-mihwari`, étape 4 : REMARKS.maqta) et la situation de Thalès
                  (`talis-mubashira`) ; les corrections et le retour de la question ci-dessus viennent de la dire. */}
              {q[5] && <KnowledgeBrick id="maqta-mihwari-talis" variant="rappel" />}
            </div>
          ) },
        { num: 6, title: 'تنفيذ: مساواة طالس', subtitle: 'المرحلة 3 — على المخروط، ثم بالقلم', done: !!q[6],
          content: (
            <div className="space-y-3">
              <Phase i={2} />
              <Evidence id="advanced" trials={coneTrials} line={coneLine} title="أسطواناتك على المخروط (المستوى المتقدّم):"
                empty="لم تجرّب أسطوانة بعد: في المستوى المتقدّم كبّر r (↕) حتى تلمس الأسطوانة المخروط، ثم غيّر h." />
              <TapQuestion
                prompt="المساواة التي تعطيها خاصية طالس في المثلثين OTC و OSK:"
                options={[
                  REMARKS.otRight,
                  '$\\dfrac{r}{6} = \\dfrac{h}{18}$',
                  '$\\dfrac{6}{r} = \\dfrac{18 - h}{18}$',
                  '$r + h = 18$',
                ].map(M)}
                correct={0} cols={2} requires={['maqta-mihwari-talis']}
                explain={<MathText>{`${REMARKS.talisSection} ${REMARKS.otWhy} وقلب نسبة واحدة يعطي مساواة خاطئة، و $r + h$ ليس ثابتا.`}</MathText>}
                onAnswered={mark(6)} />
              <BackLink lesson="talis-hisab-atwal" what="كتابة النسب المتساوية في وضعية طالس" />
              {q[6] && <p className="text-xs text-slate-600" data-misconception-note="ot"><MathText>{`خطأ شائع: ${REMARKS.otWrong} ${REMARKS.otWhy}`}</MathText></p>}
            </div>
          ) },
        { num: 7, title: 'تنفيذ: الحالة h = r', subtitle: 'معادلة من الدرجة الأولى في r', done: !!q[7],
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'في الحالة $h = r$ ، ما قيمة r (بالسنتيمتر)؟'}</MathText>}
                expected={close(4.5)} display="4,5" parse={parseDec}
                requires={['maqta-mihwari-talis', 'muadala-ula']}
                explain={<MathText>{`${REMARKS.muadala} ${REMARKS.halR}`}</MathText>}
                explainFor={(n) => <MathText>{close(6)(n) ? `نصف قطر 6 هو نصف قطر قاعدة المخروط: أسطوانة به تخرق المخروط. ${REMARKS.muadala} ${REMARKS.halR}` : close(13.5)(n) ? `$13{,}5 = 18 - 4{,}5$ هو OT لا r. ${REMARKS.halR}` : `${REMARKS.muadala} ${REMARKS.halR}`}</MathText>}
                onAnswered={mark(7)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : remplacer h par r puis résoudre est l’équation du premier degré (`muadala-ula`, unité 4) dans l’égalité
                  de l’étape 6 ; l’explication de la question ci-dessus (REMARKS.muadala / halR) vient de la faire. */}
              {q[7] && <KnowledgeBrick id="muadala-bud" variant="rappel" />}
            </div>
          ) },
        { num: 8, title: 'تنفيذ: حجم الأسطوانة', subtitle: 'القيمة المضبوطة ثم المقرّبة', done: !!q[8],
          content: (
            <TapQuestion
              prompt={<MathText>{'حجم الأسطوانة في الحالة $h = r$ :'}</MathText>}
              options={[
                '$V = 91{,}125\\pi \\approx 286{,}28\\,\\mathrm{cm}^3$',
                '$V = 4{,}5^2 \\times 4{,}5 = 91{,}125\\,\\mathrm{cm}^3$',
                '$V = \\pi \\times 9^2 \\times 4{,}5 \\approx 1145{,}11\\,\\mathrm{cm}^3$',
                '$V = \\pi \\times 4{,}5 \\times 4{,}5 \\approx 63{,}62\\,\\mathrm{cm}^3$',
              ].map(M)}
              correct={0} cols={1} requires={['hajm-ustuwana', 'muadala-bud']}
              explain={<MathText>{`${REMARKS.hajm} بدون π نحسب حجم شيء آخر، والقطر 9 يضاعف الحجم أربع مرات، و $\\pi \\times r \\times h$ ينسى تربيع r.`}</MathText>}
              onAnswered={mark(8)} />
          ) },
        { num: 9, title: 'التحقّق وتحرير الحل', subtitle: 'المرحلة 3 من الكتاب، آخرها: هل النتيجة ملائمة للواقع؟', done: !!q[9],
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">قبل أن نكتب الجواب، احكم على كل عبارة.</p>}
                rows={[
                  { id: 'v1', label: <MathText>{'$r = 4{,}5 < 6$ : الأسطوانة لا تخرج من المخروط.'}</MathText>, options: TRUE_FALSE, correct: 0, correction: 'نصف قطر الأسطوانة أصغر من نصف قطر قاعدة المخروط.' },
                  { id: 'v2', label: <MathText>{'$\\dfrac{4{,}5}{6} = \\dfrac{18 - 4{,}5}{18}$'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{'النسبتان تساويان $0{,}75$ : الحافة فعلا على المولّد.'}</MathText> },
                  { id: 'v3', label: <MathText>{'لو وجدنا $r = 7{,}2$ لقبلنا النتيجة.'}</MathText>, options: TRUE_FALSE, correct: 1, correction: <MathText>{'$7{,}2 > 6$ : أسطوانة كهذه تخرق المخروط؛ النتيجة غير ملائمة ونبحث عن الخطأ.'}</MathText> },
                ]}
                requires={['muadala-bud', 'hajm-ustuwana']}
                feedback={({ allRight }) => <MathText>{allRight ? REMARKS.jumla : REMARKS.mulaama}</MathText>}
                onAnswered={mark(9)} />
              {q[9] && (
                <>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : le volume est `hajm-ustuwana` (prérequis, étape 8) ; la vérification vient d’être faite ligne par ligne
                      dans la question ci-dessus (corrections v1–v3, REMARKS.mulaama). */}
                  <KnowledgeBrick id="mulaamat-natija" variant="rappel" />
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900"><MathText>{REMARKS.jumla}</MathText></p>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche remet en ordre les trois étapes du « تحليل الوضعية » que l’élève vient de lire
                      (encadrés des étapes 3, 5 et 6). */}
                  <KnowledgeBrick id="tariqat-wadiya" variant="rappel" />
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={7} />} />
  );
}
