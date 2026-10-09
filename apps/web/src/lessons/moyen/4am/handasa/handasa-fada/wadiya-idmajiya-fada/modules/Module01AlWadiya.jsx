import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { space as SP } from '@smarter-academy/core';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION, REMARKS, LAB, LESSON_TITLES, analysisText } from '../content/textbook';
import { AXIAL } from '../content/figures';
import BucketFigure from '../components/BucketFigure';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 1 — la وضعية du seau (le تحدّ p. 163 ; le scan n'a pas de « أدمج تعلّماتي ») lue dans les TROIS phases des synthèses
 * du manuel (قراءة الوضعية وفهمها · تحليل الوضعية واختيار استراتيجية حل مناسبة · تنفيذ استراتيجية الحل المختارة — questions
 * de la plateforme, déclarées), chaque partie renvoyée au درس qui l'enseigne (la section d'un cône = درس 3 ; la réduction et k³ =
 * درس 4 ; Thalès = unité 9 ; le volume du cône, le litre = années précédentes).
 *
 * LE WORKSPACE (un type, deux niveaux — `bucket-fill`, écrit pour cette leçon, vraie scène 3D ; props dans content/textbook.js › LAB) :
 *   متقدم  le تحدّ : l'eau montée à 7 cm du bord (28 cm de profondeur), le sommet S cherché sous le fond jusqu'à SO = 105, la
 *          méthode de calcul choisie (V₁(1 − k³)) — 24388π/3 ≈ 25,54 L ;
 *   مبتدئ  un petit seau de plage plein (r = 3, R = 4, H = 6 : SO = 18, k = 3/4, 74π).
 * Ouvert sur متقدم (ouvert sur مبتدئ par défaut depuis 2026-10-09) : c'est la وضعية du module. Les gestes jugés de l'élève (`onTrial`) sont listés
 * au-dessus de la question sur SO (`[data-activity-evidence]`). Aucune étape n'attend le lab (`onFinished`).
 * Déclarés : la lecture des cotes empilées (extraction › discrepancies › challenge), les noms S, O, O₁, W, A, B, M (plateforme),
 * l'échelle verticale réduite de la coupe axiale.
 * LP : P2 (lire, modéliser), P3 (Thalès, volumes, k³, arrondi), P1 (tout mobiliser).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const TRUE_FALSE = ['صحيح', 'خاطئ'];
const dec = (x, d) => SP.roundTo(x, d);

/** Un geste jugé du lab (`onTrial`, logic/bucketFill.js › evidenceOf), en une ligne : arabe et îlots LTR. */
function trialLine(e) {
  if (!e || typeof e !== 'object') return null;
  const N = ({ children }) => <bdi dir="ltr" className="font-mono">{children}</bdi>;
  switch (e.kind) {
    case 'levelKo': return <>مستوى الماء: على بعد <N>{e.gap} cm</N> من الحافة — ليس مستوى الشكل ✗</>;
    case 'levelOk': return <>مستوى الماء: عمق <N>{e.d} cm</N> ✓</>;
    case 'apexKo': return <>الرأس على بعد <N>SO = {e.a} cm</N>: الخطّ يبلغ مستوى الحافة على بعد <N>≈ {dec(e.reach, 2)} cm</N> من المحور ✗</>;
    case 'apexOk': return <>الرأس على بعد <N>SO = {e.a} cm</N>: الخطّان يمرّان بالحافة ✓</>;
    case 'cardKo': return <>طريقة لحساب الحجم تعطي <N>≈ {dec(e.value, 1)} cm³</N> ✗</>;
    case 'cardOk': return <>حجم الماء <N>≈ {dec(e.value, 1)} cm³</N> ✓</>;
    default: return null;
  }
}

function Evidence({ trials, title, empty, id }) {
  const shown = trials.map(trialLine).filter(Boolean).slice(-6);
  return (
    <div className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence={id}>
      {shown.length === 0 && <p className="text-slate-500" data-tried="false">{empty}</p>}
      {shown.length > 0 && (
        <div data-tried="true">
          <p>{title}</p>
          <ul className="ms-4 list-disc">{shown.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

/** Le renvoi d'une partie de la وضعية vers le درس qui l'enseigne. */
const BackLink = ({ lesson, what }) => (
  <p className="text-xs text-slate-500" data-back-link={lesson}>{what} — <Link to={`${BASE}/${lesson}`} className="text-blue-700 underline">{LESSON_TITLES[lesson]}</Link></p>
);

/** Une phase de l'analyse (questions de la plateforme, déclarées). */
const Phase = ({ i }) => (
  <TextbookBox kind="remark" title={SITUATION.analysis[i].label} text={analysisText(SITUATION.analysis[i])} source={SITUATION.analysisSource} compact />
);

export default function Module01AlWadiya() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const keep = (e) => setTrials((list) => [...list, e]);

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="الوضعية وتحليلها" moduleSubtitle="دلو على شكل مخروط مبتور فيه ماء: كم لترا من الماء فيه؟" estimatedTime="22 دقيقة"
      brief={{
        tag: 'تحدّي الوحدة — الكتاب ص 163', headline: 'دلو ماء على شاطئ تيبازة', emoji: '🪣',
        title: 'وضعية واحدة وأدوات الوحدة كلها: مقطع المخروط، خاصية طالس، حجم المخروط، والتصغير وأثره على الحجوم', tone: 'amber',
        body: (
          <div className="space-y-2" data-situation="dalw">
            <p className="font-bold">{SITUATION.title}</p>
            <p><MathText>{SITUATION.text}</MathText></p>
            <BucketFigure />
            <p className="text-xs text-slate-600" data-reading-note="challenge"><MathText>{SITUATION.reading}</MathText></p>
            <p className="text-xs text-slate-500" data-names-note>الكتاب لا يسمّي النقط: سمّت المنصّة O مركز القاع و <bdi dir="ltr">O₁</bdi> مركز الحافة و W مركز سطح الماء، و S رأس المخروط المكتمل.</p>
          </div>
        ),
        footer: <SourceTag source={SITUATION.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="المستوى المتقدّم هو تحدّي الكتاب: ضع الماء في مستوى الشكل، ثم أكمل المخروط بإنزال رأسه S، ثم اختر طريقة حساب الحجم. في المستوى المبتدئ دلو رمل صغير ممتلئ."
          levels={{
            beginner: () => (
              <Manipulation type="bucket-fill" level="beginner" {...LAB.beginner} title="دلو رمل صغير ممتلئ: نصفا قطريه 3 و 4 سنتيمترات وارتفاعه 6 سنتيمترات (مثال من المنصّة)" onTrial={keep} />
            ),
            advanced: () => (
              <Manipulation type="bucket-fill" level="advanced" {...LAB.advanced} title="تحدّي الكتاب: دلو قطراه 40 و 30 سنتيمترا، والماء على بعد 7 سنتيمترات من الحافة" onTrial={keep} />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'قراءة الوضعية وفهمها', subtitle: 'المرحلة 1: ما أبعاد الدلو؟ أين سطح الماء؟', done: !!q[1],
          content: (
            <div className="space-y-3">
              <Phase i={0} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">اقرأ الشكل: احكم على كل عبارة.</p>}
                rows={[
                  { id: 'r1', label: <MathText>{'نصف قطر الحافة العلوية $20\\,\\mathrm{cm}$ ، ونصف قطر القاع $15\\,\\mathrm{cm}$ .'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.qiraa}</MathText> },
                  { id: 'r2', label: <MathText>{'ارتفاع الدلو $28\\,\\mathrm{cm}$ .'}</MathText>, options: TRUE_FALSE, correct: 1, correction: <MathText>{REMARKS.qiraa}</MathText> },
                  { id: 'r3', label: <MathText>{'عمق الماء في الدلو $28\\,\\mathrm{cm}$ .'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.qiraa}</MathText> },
                  { id: 'r4', label: 'المطلوب حجم الدلو كاملا.', options: TRUE_FALSE, correct: 1, correction: <MathText>{REMARKS.mutlub}</MathText> },
                ]}
                requires={['maqta-mukhrut']}
                feedback={({ allRight }) => <MathText>{allRight ? `أحسنت. ${REMARKS.mutlub}` : REMARKS.qiraa}</MathText>}
                onAnswered={mark(1)} />
            </div>
          ) },
        { num: 2, title: 'تحليل الوضعية: ما شكل الماء؟', subtitle: 'المرحلة 2: الماء يأخذ شكل الدلو حتى سطحه', done: !!q[2],
          content: (
            <div className="space-y-3">
              <Phase i={1} />
              <TapQuestion
                prompt="الماء في الدلو يشغل:"
                options={['مخروطا رأسه مركز القاع وقاعدته سطح الماء', 'أسطوانة نصف قطرها $15\\,\\mathrm{cm}$ وارتفاعها $28\\,\\mathrm{cm}$', 'مخروطا مبتورا قاعدتاه قاع الدلو وسطح الماء، وارتفاعه $28\\,\\mathrm{cm}$'].map(M)}
                correct={2} cols={1} requires={['maqta-mukhrut']}
                explain={<MathText>{`${REMARKS.shakl} الجدار مائل فالماء ليس أسطوانة، ولا مخروطا: قاعه قرص نصف قطره $15\\,\\mathrm{cm}$ لا نقطة.`}</MathText>}
                onAnswered={mark(2)} />
              <BackLink lesson="maqati-mustawiya" what="مقطع مخروط بمستو مواز لقاعدته" />
            </div>
          ) },
        { num: 3, title: 'نكمل المخروط: أين رأسه؟', subtitle: 'خاصية طالس في المقطع المحوري', done: !!q[3],
          content: (
            <div className="space-y-3">
              <Evidence id="dalw" trials={trials} title="محاولاتك في المختبر:"
                empty="لم تجرّب بعد: في المختبر ضع الماء في مستوى الشكل واضغط «ثبّت»، ثم افتح «أكمل المخروط» وأنزل الرأس S." />
              <NumericQuestion
                prompt={<MathText>{'جدارا الدلو الممدّدان يلتقيان على المحور في الرأس S. المسافة $SO$ بين الرأس ومركز القاع (بالسنتيمتر):'}</MathText>}
                expected={105} display="105" requires={['talis']}
                explain={<MathText>{REMARKS.takmil}</MathText>}
                onAnswered={mark(3)} />
              {q[3] && <GeoFigure {...AXIAL} />}
              <BackLink lesson="talis-hisab-atwal" what="خاصية طالس" />
            </div>
          ) },
        { num: 4, title: 'نصف قطر سطح الماء', subtitle: 'في المقطع المحوري، ثلاث قطع متوازية', done: !!q[4],
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'نصف قطر سطح الماء $WM$ (بالسنتيمتر):'}</MathText>}
                expected={19} display="19" requires={['talis']}
                explain={<MathText>{REMARKS.talisRho}</MathText>}
                onAnswered={mark(4)} />
              {q[4] && (
                <>
                  <p className="text-xs text-slate-600" data-misconception-note="avg"><MathText>{`خطأ شائع: ${REMARKS.avgWrong} ${REMARKS.avgWhy}`}</MathText></p>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la phase « أكمل المخروط » du lab (bucket-fill, hint2) fait compléter le cône, Thalès est l’unité 9, et les explications des étapes 3–4 (REMARKS.takmil, talisRho) viennent de le dire. */}
                  <KnowledgeBrick id="mukhrut-mukammal" variant="rappel" />
                </>
              )}
            </div>
          ) },
        { num: 5, title: 'المخروط الصغير تصغير للكبير', subtitle: 'نفس الرأس ونفس المحور', done: !!q[5],
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'المخروط الصغير (من S إلى القاع) تصغير للمخروط الكبير (من S إلى سطح الماء). نسبة التصغير $k$ هي:'}</MathText>}
                options={['$\\dfrac{19}{15}$', '$\\dfrac{15}{19}$', '$\\dfrac{28}{35}$', '$\\dfrac{15}{20}$'].map(M)}
                correct={1} cols={4} requires={['takbir-k3', 'mukhrut-mukammal']}
                explain={<MathText>{`${REMARKS.k} $\\dfrac{19}{15} > 1$ تكبير لا تصغير، و $\\dfrac{28}{35}$ نسبة عمق الماء إلى ارتفاع الدلو، و $\\dfrac{15}{20}$ نسبة المخروط الصغير إلى المخروط الذي قاعدته الحافة لا سطح الماء.`}</MathText>}
                onAnswered={mark(5)} />
              <BackLink lesson="takbir-tasghir" what="التكبير والتصغير" />
            </div>
          ) },
        { num: 6, title: 'حجم الماء', subtitle: 'الفرق بين حجمي المخروطين', done: !!q[6],
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'$V_1$ حجم المخروط الكبير و $V_2$ حجم المخروط الصغير (بالسنتيمتر المكعب). اختر الجواب في كل سطر.'}</MathText></p>}
                rows={[
                  { id: 'v1', label: <MathText>{'$V_1 = \\dfrac{1}{3}\\pi \\times 19^2 \\times 133$'}</MathText>, options: ['$\\dfrac{48013}{3}\\pi$', '$48013\\pi$', '$\\dfrac{48013}{3}$'].map(M), correct: 0, correction: <MathText>{'$19^2 \\times 133 = 48013$ ، ولا ننسى $\\dfrac{1}{3}$ ولا $\\pi$ .'}</MathText> },
                  { id: 'v2', label: <MathText>{'$V_2$'}</MathText>, options: ['$\\dfrac{15}{19}V_1$', '$7875\\pi$', '$23625\\pi$'].map(M), correct: 1, correction: <MathText>{`${REMARKS.kRight} أمّا $\\dfrac{15}{19}V_1$ فهي $k V_1$ لا $k^3 V_1$ ، و $23625\\pi$ بنسيان $\\dfrac{1}{3}$ .`}</MathText> },
                  { id: 'v3', label: <MathText>{'$V$ حجم الماء'}</MathText>, options: ['$8092\\pi$', '$\\dfrac{32375}{3}\\pi$', '$\\dfrac{24388}{3}\\pi$'].map(M), correct: 2, correction: <MathText>{`${REMARKS.hajm} أمّا $8092\\pi$ فهو حجم أسطوانة نصف قطرها المتوسط $17$ ، و $\\dfrac{32375}{3}\\pi$ حجم الدلو كاملا.`}</MathText> },
                ]}
                requires={['hajm-makhrut', 'takbir-k3', 'mukhrut-mukammal']}
                feedback={({ allRight }) => <MathText>{allRight ? `أحسنت. ${REMARKS.k3}` : REMARKS.k3}</MathText>}
                onAnswered={mark(6)} />
              {q[6] && (
                <>
                  <p className="text-xs text-slate-600" data-misconception-note="k"><MathText>{`خطأ شائع: ${REMARKS.kWrong} ${REMARKS.kWhy}`}</MathText></p>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : nouveau pour l’unité, mais la phase « حجم الماء » du lab (bucket-fill › vCardOk, fRule) l’énonce déjà, et le retour de la question ci-dessus (REMARKS.k3) vient de le redire. */}
                  <KnowledgeBrick id="hajm-mabtur" variant="rappel" />
                </>
              )}
              <BackLink lesson="takbir-tasghir" what="أثر التصغير على الحجوم" />
            </div>
          ) },
        { num: 7, title: 'تنفيذ: الحجم باللتر', subtitle: 'المرحلة 3: ندوّر في آخر الحساب', done: !!q[7],
          content: (
            <div className="space-y-3">
              <Phase i={2} />
              <NumericQuestion
                prompt={<MathText>{'حجم الماء باللتر، مدوّرا إلى $0{,}01$ :'}</MathText>}
                expected={25.54} display="25,54" requires={['litr', 'hajm-mabtur']}
                explain={<MathText>{REMARKS.tadwir}</MathText>}
                onAnswered={mark(7)} />
            </div>
          ) },
        { num: 8, title: 'التحقّق وتفسير النتيجة', subtitle: 'آخر المرحلة 3: هل النتيجة ملائمة؟', done: !!q[8],
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">قبل أن نكتب الجواب، احكم على كل عبارة.</p>}
                rows={[
                  { id: 'c1', label: <MathText>{'حجم الماء أقل من حجم الدلو كاملا ( $\\dfrac{32375}{3}\\pi \\approx 33{,}90\\,\\mathrm{L}$ ).'}</MathText>, options: TRUE_FALSE, correct: 0, correction: 'الماء لا يملأ الدلو: يبقى فارغا جزؤه العلوي.' },
                  { id: 'c2', label: <MathText>{'الماء يملأ $\\dfrac{4}{5}$ ارتفاع الدلو، فحجمه $\\dfrac{4}{5}$ حجم الدلو.'}</MathText>, options: TRUE_FALSE, correct: 1, correction: <MathText>{REMARKS.tahaqquq}</MathText> },
                  { id: 'c3', label: <MathText>{'الصيغة $\\dfrac{\\pi h}{3}\\left(R^2 + Rr + r^2\\right)$ بالأعداد $h = 28$ و $R = 19$ و $r = 15$ تعطي نفس الحجم.'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.formulaOut}</MathText> },
                ]}
                requires={['hajm-mabtur', 'litr']}
                feedback={({ allRight }) => <MathText>{allRight ? `أحسنت. ${REMARKS.tahaqquq}` : REMARKS.tahaqquq}</MathText>}
                onAnswered={mark(8)} />
              {q[8] && (
                <>
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900"><MathText>{SITUATION.closing}</MathText></p>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche remet en ordre les trois étapes du « تحليل الوضعية » lues aux étapes 1, 2 et 7, et l’arrondi final (REMARKS.tadwir) de misaha-hajm-kura. */}
                  <KnowledgeBrick id="tariqat-wadiya-fada" variant="rappel" />
                </>
              )}
              <BackLink lesson="misaha-hajm-kura" what="القيمة المضبوطة والقيمة المدوّرة" />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
