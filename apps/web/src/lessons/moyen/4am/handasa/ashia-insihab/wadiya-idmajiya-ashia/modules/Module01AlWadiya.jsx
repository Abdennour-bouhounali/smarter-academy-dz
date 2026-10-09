import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION, REMARKS, LAB, LESSON_TITLES, analysisText } from '../content/textbook';
import { MODEL } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 1 — la وضعية « ممر الراجلين » (p. 136) lue dans les TROIS étapes du « تحليل الوضعية » du manuel (قراءة
 * الوضعية وفهمها · تحليل الوضعية واختيار استراتيجية حل · تنفيذ استراتيجية الحل المختارة), chaque partie renvoyée au درس
 * qui l'enseigne (la translation et l'égalité de deux vecteurs = درس 1 ; le متوازي أضلاع = درس 2 ; la démarche de
 * preuve = درس 4), comme les synthèses des unités 2 à 10.
 *
 * LE WORKSPACE (un type, deux niveaux — `bridge-path`, écrit pour cette leçon ; props dans content/textbook.js › LAB) :
 *   متقدم  la وضعية du manuel avec l'exemple chiffré de la plateforme (déclaré) : l'élève déplace le passage, lit la
 *          longueur, pose B′ par la translation de vecteur NM, puis aligne A, M, B′ (minimum √85 + 2) ;
 *   مبتدئ  une passerelle sur la gorge du Rhummel (Constantine), l'optimum hors du milieu, un fantôme de NM attaché à B.
 * Ouvert sur متقدم (ouvert sur مبتدئ par défaut depuis 2026-10-09) : c'est la وضعية du module. Les essais de l'élève (`onTrial`) sont listés
 * au-dessus des questions d'exécution (`[data-activity-evidence]`). Aucune étape n'attend le lab (`onFinished`).
 * LP : P2 (lire, fixe / variable, modéliser), P3 (B′, le متوازي أضلاع, M et N), P1 (tout mobiliser, le minimum chiffré).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const TRUE_FALSE = ['صحيح', 'خاطئ'];
const FIXED = ['ثابت', 'متغيّر'];

/** Un essai du lab (`onTrial`, logic/bridgePath.js › evidenceOf), en une ligne LTR. */
function trialLine(e) {
  if (!e || typeof e !== 'object') return null;
  if (e.stage === 'cross' || e.stage === 'straight') return `d = ${e.d} : L ≈ ${e.total}${e.stage === 'straight' && e.optimal ? ' ✓' : ''}`;
  if (e.stage === 'pin') return e.kind === 'equal' ? "BB' = NM ✓" : "BB' ≠ NM ✗";
  return null;
}

function Evidence({ trials, title, empty, id }) {
  const shown = trials.map(trialLine).filter(Boolean).slice(-6);
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

export default function Module01AlWadiya() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const keep = (e) => setTrials((list) => [...list, e]);

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="الوضعية وتحليلها" moduleSubtitle="ممر الراجلين أمام المدرسة: أين نضعه؟" estimatedTime="22 دقيقة"
      brief={{
        tag: 'أدمج تعلّماتي — الكتاب ص 136', headline: 'ممر للراجلين أمام المدرسة: أين نضعه؟', emoji: '🚸',
        title: 'وضعية واحدة وأدوات الوحدة كلها: الانسحاب، تساوي شعاعين، متوازي الأضلاع، وأقصر مسافة', tone: 'amber',
        body: (
          <div className="space-y-2" data-situation="mamar-rajilin">
            <p className="font-bold">{SITUATION.title}</p>
            <p><MathText>{SITUATION.text}</MathText></p>
            <GeoFigure {...MODEL} />
            <p className="text-xs text-slate-500" data-example-note><MathText>{REMARKS.example}</MathText> <SourceTag source={SITUATION.example} /></p>
          </div>
        ),
        footer: <SourceTag source={SITUATION.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="المستوى المتقدّم هو وضعية الكتاب: حرّك الممر وقارن أطوال المسلك، ثم انقل المدرسة B بشعاع الممر. في المستوى المبتدئ جسر للراجلين فوق وادي الرمال بقسنطينة."
          levels={{
            beginner: () => (
              <Manipulation type="bridge-path" level="beginner" {...LAB.beginner} title="جسر للراجلين فوق وادي الرمال بقسنطينة (مثال من المنصّة)" onTrial={keep} />
            ),
            advanced: () => (
              <Manipulation type="bridge-path" level="advanced" {...LAB.advanced} title="وضعية الكتاب: ممر الراجلين بين الحي والمدرسة" onTrial={keep} />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'قراءة الوضعية وفهمها', subtitle: 'المرحلة 1 من الكتاب: ما الثابت وما المتغيّر؟', done: !!q[1],
          content: (
            <div className="space-y-3">
              <Phase i={0} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">عندما نحرّك الممر على الطريق (المختبر أعلاه)، احكم على كل عنصر.</p>}
                rows={[
                  { id: 'A', label: 'النقطة A (الحي)', options: FIXED, correct: 0, correction: 'الحي لا يتحرّك.' },
                  { id: 'B', label: 'النقطة B (المدرسة)', options: FIXED, correct: 0, correction: 'المدرسة لا تتحرّك.' },
                  { id: 'M', label: 'النقطتان M و N', options: FIXED, correct: 1, correction: 'M و N طرفا الممر: تتحرّكان معه.' },
                  { id: 'MN', label: 'الطول MN', options: FIXED, correct: 0, correction: <MathText>{REMARKS.bud}</MathText> },
                  { id: 'AM', label: 'الطولان AM و NB', options: FIXED, correct: 1, correction: 'كلما اقترب الممر من A قصر AM وطال NB.' },
                ]}
                requires={['bud-mutawaziyayn']}
                feedback={({ allRight }) => <MathText>{allRight ? `أحسنت. ${REMARKS.thabit}` : REMARKS.thabit}</MathText>}
                onAnswered={mark(1)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : le retour de la question ci-dessus (REMARKS.thabit) et la correction de MN (REMARKS.bud, prérequis
                  `bud-mutawaziyayn`) viennent de dire ce qui est fixe et ce qui varie. */}
              {q[1] && <KnowledgeBrick id="thabit-mutaghayyir" variant="rappel" />}
            </div>
          ) },
        { num: 2, title: 'تحليل الوضعية: أقصر مسافة', subtitle: 'المرحلة 2 من الكتاب: ما الأداة؟', done: !!q[2],
          content: (
            <div className="space-y-3">
              <Phase i={1} />
              <TapQuestion
                prompt={<MathText>{"A و B′ نقطتان متمايزتان. ما هو الشرط الذي تحقّقه النقطة M حتى يكون $AM + MB'$ أقصر ما يمكن؟"}</MathText>}
                options={[
                  "M نقطة من القطعة $[AB']$",
                  "M منتصف القطعة $[AB']$ فقط",
                  "$AM = MB'$",
                  "M على محور القطعة $[AB']$",
                ].map(M)}
                correct={0} cols={2} requires={['mutabayina-muthallathiya']}
                explain={<MathText>{`${REMARKS.mutabayina} كل نقطة من $[AB']$ تعطي الطول نفسه $AB'$ ، لا المنتصف وحده؛ و $AM = MB'$ صحيحة لكل نقطة من المحور، وأغلبها خارج $[AB']$ .`}</MathText>}
                onAnswered={mark(2)} />
            </div>
          ) },
        { num: 3, title: 'تحليل الوضعية: مسلك له نفس الطول', subtitle: 'نستبدل المسلك المطلوب', done: !!q[3],
          content: (
            <div className="space-y-3">
              <Evidence id="mamar" trials={trials} title="محاولاتك في المختبر:"
                empty="لم تحرّك الممر بعد: في المختبر اسحبه على الطريق، ثم انقل المدرسة B بشعاع الممر." />
              <p className="text-sm text-slate-700">المسلك من A إلى M ثم N ثم B ينكسر مرتين. فكرة الكتاب: نستبدله بمسلك له نفس الطول.</p>
              <TapQuestion
                prompt={<MathText>{'B′ صورة B بالانسحاب الذي شعاعه $\\overrightarrow{NM}$ . المساواة الصحيحة هي:'}</MathText>}
                options={[
                  "$\\overrightarrow{BB'} = \\overrightarrow{NM}$",
                  "$\\overrightarrow{B'B} = \\overrightarrow{NM}$",
                  "$\\overrightarrow{BB'} = \\overrightarrow{MN}$",
                  "$\\overrightarrow{NB'} = \\overrightarrow{MB}$",
                ].map(M)}
                correct={0} cols={2} requires={['sura-insihab']}
                explain={<MathText>{`${REMARKS.istibdal} الشعاع يبدأ من النقطة B وينتهي عند صورتها B′، ولا يُكتب من الصورة إلى النقطة. ${REMARKS.ittijahWhy}`}</MathText>}
                onAnswered={mark(3)} />
              <BackLink lesson="insihab-shuaa" what="صورة نقطة بانسحاب وتساوي شعاعين" />
              {q[3] && <p className="text-xs text-slate-600" data-misconception-note="ittijah"><MathText>{`خطأ شائع: ${REMARKS.ittijahWrong} ${REMARKS.ittijahWhy}`}</MathText></p>}
            </div>
          ) },
        { num: 4, title: 'تنفيذ: دراسة الرباعي MB′BN', subtitle: 'المرحلة 3 من الكتاب', done: !!q[4],
          content: (
            <div className="space-y-3">
              <Phase i={2} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{"لدينا $\\overrightarrow{BB'} = \\overrightarrow{NM}$ . احكم على كل عبارة."}</MathText></p>}
                rows={[
                  { id: 'p1', label: 'الرباعي MB′BN متوازي أضلاع.', options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.mutawazi}</MathText> },
                  { id: 'p2', label: <MathText>{"$NB = MB'$"}</MathText>, options: TRUE_FALSE, correct: 0, correction: 'ضلعان متقابلان في متوازي أضلاع لهما نفس الطول.' },
                  { id: 'p3', label: 'الرباعي MB′BN مستطيل مهما كان موضع الممر.', options: TRUE_FALSE, correct: 1, correction: 'الضلع [MB′] مائل في أغلب المواضع: لا زاوية قائمة في M.' },
                  { id: 'p4', label: <MathText>{"$AM + MN + NB = AM + MB' + MN$"}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.masar}</MathText> },
                ]}
                requires={['mutawazi-tartib', 'sura-insihab']}
                feedback={({ allRight }) => <MathText>{allRight ? `أحسنت. ${REMARKS.masar}` : REMARKS.mutawazi}</MathText>}
                onAnswered={mark(4)} />
              <BackLink lesson="shuaayn-mutasawiyayn" what="الشعاعان المتساويان ومتوازي الأضلاع" />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : image par translation et égalité de vecteurs (`sura-insihab`), parallélogramme (`mutawazi-tartib`,
                  درس shuaayn-mutasawiyayn) ; l’étape 3 et les corrections p1–p4 (REMARKS.mutawazi / masar) viennent de le dire. */}
              {q[4] && <KnowledgeBrick id="insihab-mamar" variant="rappel" />}
            </div>
          ) },
        { num: 5, title: 'تنفيذ: موقع M', subtitle: 'متى يكون AM + MB′ أقصر ما يمكن؟', done: !!q[5],
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="ما هو موقع النقطة M حتى يكون المسلك أقصر ما يمكن؟"
                options={[
                  "نقطة تقاطع القطعة $[AB']$ مع الحافة العليا",
                  'نقطة تقاطع القطعة [AB] مع الحافة العليا',
                  'نقطة الحافة العليا الأقرب إلى A',
                  'نقطة الحافة العليا التي تبعد بنفس المسافة عن A و B',
                ].map(M)}
                correct={0} cols={1} requires={['insihab-mamar', 'mutabayina-muthallathiya']}
                explain={<MathText>{`${REMARKS.M} ${REMARKS.mubashirWhy} وأقرب نقطة إلى A تقصّر AM وتطيل NB كثيرا (جرّبها في المختبر).`}</MathText>}
                onAnswered={mark(5)} />
              {q[5] && <p className="text-xs text-slate-600" data-misconception-note="mubashir"><MathText>{`خطأ شائع: ${REMARKS.mubashirWrong} ${REMARKS.mubashirWhy}`}</MathText></p>}
            </div>
          ) },
        { num: 6, title: 'تنفيذ: موقع N', subtitle: 'آخر سؤال من الكتاب', done: !!q[6],
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="وما هو موقع النقطة N؟"
                options={[
                  'صورة M بالانسحاب الذي شعاعه $\\overrightarrow{MN}$ : المسقط العمودي لـ M على الحافة السفلى',
                  "نقطة تقاطع القطعة $[AB']$ مع الحافة السفلى",
                  'صورة B بالانسحاب الذي شعاعه $\\overrightarrow{NM}$',
                  'منتصف القطعة [MB]',
                ].map(M)}
                correct={0} cols={1} requires={['insihab-mamar']}
                explain={<MathText>{`${REMARKS.N} النقطة التي تقطع فيها $[AB']$ الحافة السفلى ليست تحت M، والممر [MN] عمودي على الحافتين؛ وصورة B هي B′ لا N.`}</MathText>}
                onAnswered={mark(6)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : l’inégalité triangulaire (`mutabayina-muthallathiya`, étape 2 : REMARKS.mutabayina) ; les explications
                  des étapes 5 et 6 (REMARKS.M / N) viennent de placer M et N. */}
              {q[6] && <KnowledgeBrick id="aqsar-masar" variant="rappel" />}
              <BackLink lesson="barahin-ashia" what="حل مشكلات بتوظيف الأشعة والانسحاب" />
            </div>
          ) },
        { num: 7, title: 'تنفيذ بالأعداد', subtitle: 'مثال المنصّة على ورقة مرصوفة', done: !!q[7],
          content: (
            <div className="space-y-3">
              <Evidence id="mamar-min" trials={trials} title="محاولاتك في المختبر:"
                empty="جرّب في المختبر: بعد نقل B إلى B′، حرّك الممر حتى يستقيم المسلك A ثم M ثم B′." />
              <p className="text-sm"><MathText>{REMARKS.Bp}</MathText></p>
              <TapQuestion
                prompt="طول أقصر مسلك (الوحدة: ضلع مربع) هو:"
                options={[
                  '$\\sqrt{85} + 2 \\approx 11{,}22$',
                  '$\\sqrt{113} \\approx 10{,}63$',
                  '$\\sqrt{85} \\approx 9{,}22$',
                  '$7 + 6 + 2 = 15$',
                ].map(M)}
                correct={0} cols={2} requires={['aqsar-masar', 'fithaghuris']}
                explain={<MathText>{`${REMARKS.ABp} ${REMARKS.Lmin} ${REMARKS.AB} و $\\sqrt{85}$ وحده ينسى عرض الطريق، و $7 + 6$ يجمع ضلعي الزاوية القائمة بدل الوتر.`}</MathText>}
                onAnswered={mark(7)} />
            </div>
          ) },
        { num: 8, title: 'التحقّق وتحرير الحل', subtitle: 'آخر المرحلة 3: هل النتيجة ملائمة؟', done: !!q[8],
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">قبل أن نكتب الجواب، احكم على كل عبارة.</p>}
                rows={[
                  { id: 'v1', label: <MathText>{'الطول $\\sqrt{113} \\approx 10{,}63$ أقصر من $11{,}22$ ، فالمسلك على [AB] أفضل.'}</MathText>, options: TRUE_FALSE, correct: 1, correction: <MathText>{REMARKS.AB}</MathText> },
                  { id: 'v2', label: 'في المثال، A و M و B′ على استقامة واحدة.', options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.M}</MathText> },
                  { id: 'v3', label: <MathText>{'في المثال، $AM = NB$ .'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{REMARKS.sym}</MathText> },
                  { id: 'v4', label: 'الممر في منتصف المسافة الأفقية بين A و B مهما كان بعد A و B عن الطريق.', options: TRUE_FALSE, correct: 1, correction: <MathText>{REMARKS.sym}</MathText> },
                ]}
                requires={['aqsar-masar']}
                feedback={({ allRight }) => <MathText>{allRight ? `أحسنت. ${REMARKS.Lmin}` : REMARKS.M}</MathText>}
                onAnswered={mark(8)} />
              {q[8] && (
                <>
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900"><MathText>{SITUATION.closing}</MathText></p>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche remet en ordre les trois étapes du « تحليل الوضعية » que l’élève vient de lire
                      (encadrés des étapes 1, 2 et 4). */}
                  <KnowledgeBrick id="tariqat-wadiya" variant="rappel" />
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
