import React, { useState } from 'react';
import { linearSystem } from '@smarter-academy/core';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag, PairQuestion } from '../../../../../../common/textbook';
import { bidi } from '../../../../../../../utils/bidi';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION, WARMUP, REMARKS, LAB } from '../content/textbook';
import { PartyScene } from '../components/JumalFigures';

/**
 * Module 7 — la وضعية (p. 62) : le حفل البلدية, lu dans les TROIS étapes du
 * « تحليل الوضعية » du manuel (قراءة الوضعية وفهمها · تحليل الوضعية واختيار
 * استراتيجية حل مناسبة · تنفيذ استراتيجية الحل المختارة), comme les synthèses
 * des unités 2 à 4.
 *
 * LE LABORATOIRE (story-modeller, RÉUTILISÉ de « حل مشكلات بتوظيف جمل معادلتين »,
 * deux niveaux dans un ManipulationWorkspace, ouvert sur مبتدئ par défaut depuis 2026-10-09 : c'est la
 * situation du manuel), sur la table du goûter (`theme="party"`) :
 *   متقدم  le حفل : 150 علبة و 150 قطعة pour 11 250 DA, puis 24 et 30 qui restent
 *          pour 2 100 DA — DEUX informations d'argent, aucune n'est un « nombre de
 *          personnes » ; les inconnues ne sont pas nommées (`named={false}`).
 *   مبتدئ  la رحلة القسم de la plateforme (10 + 10 pour 800 DA ; 2 et 3 pour 210 DA,
 *          prix 30 et 50 DA), inconnues pré-placées ; elle sert les étapes 4 et 5
 *          (حل · تحقق), pour que la réponse du manuel (25 DA et 50 DA) reste celle
 *          de « أحلّ الوضعية ».
 * Le modèle vérifié (`onModel`) et la ثنائية trouvée (`onSolved`) par l'élève sont
 * montrés au-dessus des questions (`[data-activity-evidence]`).
 *
 * Les étapes : ce qui est cherché et les inconnues (brique `tahdid-majahil`), la
 * traduction de chaque information (`tarjamat-maalumat`), le choix de la méthode
 * (`ikhtiyar-tariqa`), puis la résolution et la vérification sur la رحلة القسم
 * (`tahaqquq-tafsir`, `tariqat-wadiya`). La résolution du حفل est le module 8
 * (évaluation). LP : P2, P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const FITS = ['يترجمها', 'لا يترجمها'];

/** La جملة rendue par le laboratoire (`onModel`), quelle que soit sa forme. */
function modelTex(sys) {
  if (!sys) return null;
  if (typeof sys === 'string') return sys;
  if (typeof sys.tex === 'string') return sys.tex;
  if (typeof sys.latex === 'string') return sys.latex;
  const eqs = Array.isArray(sys) ? sys : sys.system;
  if (Array.isArray(eqs) && eqs.length === 2 && eqs.every((e) => e && 'a' in e && 'b' in e && 'c' in e)) return linearSystem.systemLatex(eqs);
  return null;
}

/** Une valeur de la ثنائية (`onSolved`) : fraction { n, d }, nombre ou chaîne. */
const valueText = (v) => (v && typeof v === 'object' && 'n' in v && 'd' in v ? (Number(v.d) === 1 ? String(v.n) : `${v.n}/${v.d}`) : String(v));

function Evidence({ model, pair, level, empty }) {
  const tex = modelTex(model);
  return (
    <div className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence={level}>
      {!tex && !pair && <p className="text-slate-500" data-tried="false">{empty}</p>}
      {tex && <p data-tried="true">الجملة التي بنيتها: <MathText>{`$${tex}$`}</MathText></p>}
      {pair && <p data-tried="true" className="font-bold text-emerald-800">الثنائية التي وجدتها: <bdi dir="ltr">({valueText(pair.x)} ; {valueText(pair.y)})</bdi></p>}
    </div>
  );
}

export default function Module07AlWadiya() {
  const [big, setBig] = useState({ model: null, pair: null });
  const [small, setSmall] = useState({ model: null, pair: null });
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const keepModel = (set) => (sys) => set((s) => ({ ...s, model: sys }));
  const keepPair = (set) => (p) => { if (p) set((s) => ({ ...s, pair: { x: p.x, y: p.y } })); };
  const { bought, paid, juiceLeft, cakesLeft, leftCost } = SITUATION.numbers;

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} moduleTitle="الوضعية وتحليلها" moduleSubtitle="حفل البلدية: ما سعر علبة العصير وسعر قطعة الحلوى؟" estimatedTime="16 دقيقة"
      objectives={["ما المجهولان في وضعية حفل البلدية؟ وكيف نختارهما؟", "كيف نترجم كل معلومة عن مبلغ بمعادلة؟", "أيّ طريقة تحلّ الجملة بأقل حساب؟ وكيف نتحقق من الجواب؟"]}
      brief={{
        tag: 'أدمج تعلّماتي — الكتاب ص 62', headline: 'علب العصير وقطع الحلوى في حفل البلدية', emoji: '🎉', visual: <PartyScene />,
        title: 'ما هو سعر علبة عصير وسعر قطعة حلوى؟', tone: 'amber',
        body: (
          <div className="space-y-2">
            <p>{SITUATION.intro}</p>
            <ul className="ms-4 list-disc space-y-1">
              <li>{SITUATION.fact1}</li>
              <li>{SITUATION.fact2}</li>
            </ul>
            <p className="font-semibold">{SITUATION.question}</p>
          </div>
        ),
        footer: <SourceTag source={SITUATION.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="المستوى المتقدّم هو وضعية الكتاب: حفل البلدية بأعداده. في المستوى المبتدئ رحلة القسم بأعداد أصغر والمجهولان مسمّيان."
          levels={{
            beginner: () => (
              <Manipulation
                type="story-modeller"
                level="beginner"
                {...LAB.beginner}
                title={bidi('رحلة القسم: 10 علب و 10 قطع حلوى بـ 800 DA')}
                onModel={keepModel(setSmall)}
                onSolved={keepPair(setSmall)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="story-modeller"
                level="advanced"
                {...LAB.advanced}
                title={bidi('حفل البلدية: 150 علبة و 150 قطعة بـ 11 250 DA')}
                onModel={keepModel(setBig)}
                onSolved={keepPair(setBig)}
              />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'قراءة الوضعية وفهمها', subtitle: 'المرحلة 1 من الكتاب: المعطيات والمطلوب', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="ما المطلوب في الوضعية، وماذا نسمّي المجهولين؟"
                options={[
                  'سعر علبة عصير وسعر قطعة حلوى: نسمّيهما $x$ و $y$',
                  'عدد علب العصير وعدد قطع الحلوى: نسمّيهما $x$ و $y$',
                  'المبلغ الذي دفعته البلدية وثمن ما بقي: نسمّيهما $x$ و $y$',
                  'عدد العلب والقطع التي استُهلكت في الحفل: نسمّيهما $x$ و $y$',
                ].map(M)}
                correct={0} cols={1} requires={['tarjama-jumla']}
                explain={<span>السؤال «ما هو سعر علبة عصير وسعر قطعة حلوى؟» يطلب سعرين نجهلهما. أمّا الأعداد (<bdi dir="ltr">{bought}</bdi> و <bdi dir="ltr">{juiceLeft}</bdi> و <bdi dir="ltr">{cakesLeft}</bdi>) والمبلغان فمعطيات معلومة في النص.</span>}
                onAnswered={() => setQ1(true)} />
              {q1 && (
                <>
                  <TextbookBox kind="remark" title={SITUATION.analysis[0].label} text={SITUATION.analysis[0].text} source={SITUATION.source} compact />
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : choisir les inconnues est l’étape 1 de khutuwat-hall / jumla-tarjama (درس 3), et
                      l’explication de la question ci-dessus vient de nommer les deux prix. */}
                  <KnowledgeBrick id="tahdid-majahil" variant="rappel" />
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'ترييض الوضعية: كيف نترجم كل معلومة؟', subtitle: 'جرّب على طاولة الحفل', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">ما بنيته على طاولة الحفل (المستوى المتقدّم):</p>
              <Evidence model={big.model} level="advanced" empty="لم تتحقّق بعد من جملة على طاولة الحفل: سمِّ المجهولين، ضع الأعداد في خانات المعادلتين ثم اضغط «تحقّق»." />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">هل تترجم كل معادلة المعلومة المذكورة؟</p>}
                rows={[
                  { id: 'm1a', label: <span>المعلومة الأولى: <MathText>{'$150x + 150y = 11250$'}</MathText></span>, options: FITS, correct: 0, correction: <MathText>{`150 علبة ثمنها $150x$ و 150 قطعة ثمنها $150y$ ، والمجموع ${paid} DA.`}</MathText> },
                  { id: 'm1b', label: <span>المعلومة الأولى: <MathText>{'$x + y = 11250$'}</MathText></span>, options: FITS, correct: 1, correction: <MathText>{'المبلغ 11 250 DA ثمن 150 علبة و 150 قطعة، لا ثمن علبة واحدة وقطعة واحدة.'}</MathText> },
                  { id: 'm2a', label: <span>المعلومة الثانية: <MathText>{'$24x + 30y = 2100$'}</MathText></span>, options: FITS, correct: 0, correction: <MathText>{`${juiceLeft} علبة ثمنها $${juiceLeft}x$ و ${cakesLeft} قطعة ثمنها $${cakesLeft}y$ ، ومعا ${leftCost} DA.`}</MathText> },
                  { id: 'm2b', label: <span>المعلومة الثانية: <MathText>{'$30x + 24y = 2100$'}</MathText></span>, options: FITS, correct: 1, correction: <MathText>{'العدد 24 يعدّ علب العصير: يُضرب في سعر العلبة $x$ ، لا في سعر القطعة.'}</MathText> },
                  { id: 'm2c', label: <span>المعلومة الثانية: <MathText>{'$24x + 30y = 9150$'}</MathText></span>, options: FITS, correct: 1, correction: <MathText>{'$11250 - 2100 = 9150$ ثمن ما استُهلك؛ أمّا ما بقي (24 علبة و 30 قطعة) فثمنه 2 100 DA.'}</MathText> },
                ]}
                requires={['tahdid-majahil', 'tarjama-jumla']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: كل معلومة عن مبلغ تعطي معادلة، وكل عدد يُضرب في سعر الشيء الذي يعدّه.' : 'كل عدد يُضرب في سعر الشيء الذي يعدّه، والمبلغ هو المذكور في المعلومة نفسها.'}</MathText>}
                onAnswered={() => setQ2(true)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : une information → une équation est jumla-tarjama (درس 3), et le retour de la question
                  ci-dessus vient de le dire (« كل معلومة عن مبلغ تعطي معادلة … »). */}
              {q2 && <KnowledgeBrick id="tarjamat-maalumat" variant="rappel" />}
            </div>
          ) },
        { num: 3, title: 'اختيار استراتيجية حل مناسبة', subtitle: 'المرحلة 2 من الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={SITUATION.analysis[1].label} text={SITUATION.analysis[1].text} source={SITUATION.source} compact />
              <TapQuestion
                prompt={<span>لحل الجملة <MathText>{'$\\begin{cases} 150x + 150y = 11250 \\\\ 24x + 30y = 2100 \\end{cases}$'}</MathText> ، أيّ اقتراح يوصل إلى الحل بأقل حساب؟</span>}
                options={[
                  'نقسم طرفي المعادلة الأولى على 150 فنحصل على $x + y = 75$ ، ثم نعوّض $y = 75 - x$ في المعادلة الثانية',
                  'نجمع المعادلتين طرفا بطرف مباشرة فيختفي $y$',
                  'نعبّر عن $y$ بدلالة $x$ من المعادلة الأولى، ثم نعوّضه في المعادلة الأولى نفسها',
                  'نقسم المعادلة الأولى على 150 فنحصل على $x + y = 11250$',
                ].map(M)}
                correct={0} cols={1} requires={['tarjamat-maalumat', 'tawid', 'jam']}
                explain={<MathText>{'$11250 \\div 150 = 75$ : المعادلة الأولى تكافئ $x + y = 75$ ، ومعامل $y$ فيها 1 فالتعويض سهل. الجمع المباشر يعطي $174x + 180y = 13350$ ولا يختفي شيء؛ والتعويض في المعادلة نفسها يعطي مساواة صحيحة دائما؛ والقسمة تشمل الطرفين معا.'}</MathText>}
                onAnswered={() => setQ3(true)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : le choix de méthode est ikhtiyar-tariqa de الحل الجبري (درس 2), et l’explication de la
                  question ci-dessus vient de simplifier puis de choisir la substitution (التعويض). */}
              {q3 && <KnowledgeBrick id="ikhtiyar-tariqa" variant="rappel" />}
            </div>
          ) },
        { num: 4, title: 'تنفيذ استراتيجية الحل', subtitle: 'المرحلة 3 من الكتاب — على رحلة القسم', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={SITUATION.analysis[2].label} text={SITUATION.analysis[2].text} source={SITUATION.source} compact />
              <p className="rounded-lg bg-amber-50 px-2 py-1 text-sm">{WARMUP.text} <SourceTag source={WARMUP.source} /></p>
              <p className="text-sm font-semibold text-slate-700">ما وجدته في رحلة القسم (المستوى المبتدئ):</p>
              <Evidence model={small.model} pair={small.pair} level="beginner" empty="لم تحلّ بعد رحلة القسم: افتح المستوى المبتدئ، ضع الأعداد في الخانات ثم اختر طريقة الحل." />
              <PairQuestion
                prompt={<span>حل الجملة <MathText>{WARMUP.system}</MathText> <MathText>{'($x$ سعر علبة العصير و $y$ سعر قطعة الحلوى، بالدينار).'}</MathText></span>}
                expected={{ x: '30', y: '50' }}
                requires={['ikhtiyar-tariqa', 'tawid']}
                explain={<MathText>{'نقسم الأولى على 10: $x + y = 80$ ، فـ $y = 80 - x$. نعوّض في الثانية: $2x + 3(80 - x) = 210$ أي $240 - x = 210$ ، $x = 30$ ، ثم $y = 80 - 30 = 50$.'}</MathText>}
                onAnswered={() => setQ4(true)} />
            </div>
          ) },
        { num: 5, title: 'التحقق وتحرير الإجابة', subtitle: 'نعود إلى النص', done: q5,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="أيّ إجابة لرحلة القسم صحيحة ومتحقَّق منها؟"
                options={[
                  'نتحقق في النص: $10 \\times 30 + 10 \\times 50 = 800$ و $2 \\times 30 + 3 \\times 50 = 210$ ؛ سعر علبة العصير 30 DA وسعر قطعة الحلوى 50 DA',
                  REMARKS.nisfWrong,
                  'سعر علبة العصير 50 DA وسعر قطعة الحلوى 30 DA، لأنّ $50 + 30 = 80$',
                  'يكفي التحقق من المعادلة الأولى: $30 + 50 = 80$ ، فالجواب صحيح',
                ].map(M)}
                correct={0} cols={1} requires={['ikhtiyar-tariqa', 'tahaqquq-wadiya']}
                explain={<span><MathText>{REMARKS.nisfWhy}</MathText> <MathText>{'والثنائية $(50 ; 30)$ تعطي $2 \\times 50 + 3 \\times 30 = 190$ لا 210: الترتيب مهم، والتحقق يشمل المعلومتين معا.'}</MathText></span>}
                onAnswered={() => setQ5(true)} />
              {q5 && (
                <>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : vérifier dans le texte et répondre par une phrase est tahaqquq-nas (درس 3), redit par
                      l’explication de la question ci-dessus. */}
                  <KnowledgeBrick id="tahaqquq-tafsir" variant="rappel" />
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche remet en ordre les trois étapes du « تحليل الوضعية » que l’élève vient de
                      lire — et khutuwat-hall (درس 3). */}
                  <KnowledgeBrick id="tariqat-wadiya" variant="rappel" />
                  <TextbookBox kind="remark" text={REMARKS.notSolvedHere} compact />
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={7} />} />
  );
}
