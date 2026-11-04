import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION, CHALLENGE, REMARKS } from '../content/textbook';
import { RightTriangle } from '../components/HarfiFigures';

/**
 * Module 7 — la وضعية (p. 40) : le bassin carré de côté 10 m et le ruban de
 * largeur x tout autour, lus dans les TROIS étapes du « تحليل الوضعية » du
 * manuel, avec le تحدّ de la page d'unité (p. 31) en accroche, résolu en
 * dernière étape.
 *
 * LE LABORATOIRE (pitch-expansion, un seul niveau — `levels={false}`) :
 * `expr="x+10+x"` est le carré de côté x + 10 + x, découpé en 9 zones : le
 * centre 10 × 10 est le bassin, les 8 autres sont le ruban (4 bandes 10 × x,
 * 4 coins x × x). L'élève ÉTIRE x et vérifie ; chacun de ses essais
 * (`onTrial` : x et l'aire du grand carré) est listé au-dessus des questions
 * (`[data-activity-evidence]`) avec l'aire du ruban = grand carré − 100 :
 * c'est là qu'il VOIT pour quel x le ruban vaut 44.
 *
 * Rétrofit 2026-10-15 (§4quater) : ni carte du manuel ni titre de labo au-dessus du labo (le contexte est son `lead`, la question sa `mission`) ;
 * l'étape 1 demande ce que l'élève a VU en tirant x (le labo posait déjà « quel x ? »), puis l'encadré du manuel.
 * Les étapes : ce qui est cherché (étape 1 du manuel), le côté du grand carré
 * (brique `namdhaja`), l'aire du ruban de deux façons (« هناك طرق متعددة »),
 * sa forme développée (brique `masaha-tariqatan` APRÈS la réponse), le x des
 * essais, l'égalité « = 44 » et l'« مساعدة » du manuel (briques
 * `musaada-jadaa`, `tariqat-wadiya`), puis le تحدّ. La résolution complète
 * (racines, rejet de −11) est le module 8 (évaluation). LP : P2, P1, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const EQUAL = ['يساويه', 'لا يساويه'];

export default function Module07AlWadiya() {
  // Les essais de l'élève dans le laboratoire : { [x]: aire du grand carré }.
  const [trials, setTrials] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const [q6, setQ6] = useState(false);
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const onTrial = ({ x, product }) => setTrials((t) => ({ ...t, [x]: product }));
  const tried = Object.keys(trials).map(Number).sort((a, b) => a - b);

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {tried.length === 0 ? (
        <li className="text-slate-500" data-tried="false">لم تتحقّق بعد من أي قيمة لـ <MathText>{'$x$'}</MathText> في الملعب: اسحب المقبض ثم اضغط «تحقّق».</li>
      ) : tried.map((x) => (
        <li key={x} data-evidence={x} data-tried="true" className={trials[x] - 100 === 44 ? 'font-bold text-emerald-800' : 'text-slate-800'}>
          <MathText>{`$x = ${x}$ : ضلع المربع الخارجي $${10 + 2 * x}$ ومساحته $${trials[x]}$ ، فمساحة الشريط $${trials[x]} - 100 = ${trials[x] - 100}$`}</MathText>
        </li>
      ))}
    </ul>
  );

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} objectives={["كيف نعبّر عن ضلع المربع الذي يضمّ الحوض والشريط؟", "بأيّ طرق نكتب مساحة الشريط؟", "ما عرض الشريط الذي تكون مساحته 44 مترًا مربّعًا؟", "متى يكون المثلث ABC قائمًا في A؟"]} moduleTitle="الوضعية وتحليلها" moduleSubtitle="الحوض والشريط: ما عرض الشريط؟" estimatedTime="14 دقيقة"
      intro={
        <Manipulation
          type="pitch-expansion"
          expr="x+10+x"
          levels={false}
          mission="المنطقة المركزية 10 × 10 هي الحوض، والمناطق الثماني حولها هي الشريط. اسحب عرض الشريط x، احسب المناطق، ثم تحقّق: من أجل أيّ قيمة لـ x تكون مساحة الشريط 44؟"
          lead="يهيّئ سكّان الحيّ حديقة عامة فيها حوض مربّع ضلعه 10 م، ويحيط به من كل الجهات شريط للراجلين عرضه x."
          onTrial={onTrial}
        />
      }
      steps={[
        { num: 1, title: 'قراءة الوضعية وفهمها', subtitle: 'المرحلة 1 من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="حين سحبت x في الملعب، ما الذي بقي ثابتًا وما الذي تغيّر؟"
                options={['الحوض 10 × 10 ثابت، أمّا الشريط وضلع المربع الخارجي فيتغيّران مع x', 'مساحة الحوض تكبر مع x', 'كل المناطق التسع تتغيّر مع x', 'محيط الحوض يتغيّر مع x']}
                correct={0} cols={1} requires={['masahat-ashkal']}
                explain="مساحة الحوض وضلعه معلومان (ضلعه 10m) ولا يتغيّران. المجهول هو عرض الشريط x، والمعلومة التي توظَّف هي مساحة الشريط."
                onAnswered={() => setQ1(true)} />
              {q1 && <TextbookBox kind="remark" title={SITUATION.analysis[0].label} text={SITUATION.analysis[0].text} source={SITUATION.source} compact />}
            </div>
          ) },
        { num: 2, title: 'ضلع المربع الخارجي', subtitle: 'نمذجة: كل طول بدلالة x', done: q2,
          content: (
            <div className="space-y-3">
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : nommer l’inconnue et exprimer une longueur en fonction d’elle est la
                  modélisation littérale déjà acquise (3AM, situations des leçons de l’unité) ; la brique guide la question qui suit. */}
              <KnowledgeBrick id="namdhaja" variant="rappel" lead="لنمذجة الوضعية نعبّر عن الأطوال بدلالة المجهول:" />
              <TapQuestion
                prompt={<span>الحوض مع الشريط يشكّلان مربعًا كبيرًا. طول ضلعه بدلالة <MathText>{'$x$'}</MathText> هو ...</span>}
                options={['$10 + 2x$', '$10 + x$', '$10x$', '$2(10 + 2x)$'].map(M)}
                correct={0} cols={2} requires={['namdhaja', 'masahat-ashkal']}
                explain={<span><MathText>{REMARKS.dilRight}</MathText> {REMARKS.dilWhy}</span>}
                onAnswered={() => setQ2(true)} />
            </div>
          ) },
        { num: 3, title: 'ما مساحة الشريط؟', subtitle: 'المرحلة 2 من الكتاب — تحقّق من أجل قيمتين لـ x في الملعب', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={SITUATION.analysis[1].label} text={SITUATION.analysis[1].text} source={SITUATION.source} compact />
              {evidence}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">قارن كل كتابة بمساحة الشريط (يمكنك التحقق بإحدى قيمك أعلاه):</p>}
                rows={[
                  { id: 'w1', label: <span>المربع الخارجي ناقص الحوض: <MathText>{'$(10 + 2x)^2 - 10^2$'}</MathText></span>, options: EQUAL, correct: 0, correction: <MathText>{'المناطق التسع ناقص المنطقة المركزية: تبقى المناطق الثماني.'}</MathText> },
                  { id: 'w2', label: <span>أربعة مستطيلات وأربعة أركان: <MathText>{'$4 \\times 10x + 4 \\times x^2$'}</MathText></span>, options: EQUAL, correct: 0, correction: <MathText>{'أربع مناطق بعداها 10 و $x$ ، وأربعة أركان مربعة ضلعها $x$.'}</MathText> },
                  { id: 'w3', label: <MathText>{'$(10 + x)^2 - 10^2$'}</MathText>, options: EQUAL, correct: 1, correction: <MathText>{REMARKS.dilWhy}</MathText> },
                  { id: 'w4', label: <MathText>{'$4 \\times 10x$'}</MathText>, options: EQUAL, correct: 1, correction: <MathText>{'نسينا الأركان الأربعة: مساحة كل منها $x^2$.'}</MathText> },
                ]}
                requires={['namdhaja', 'masahat-ashkal']}
                feedback={({ allRight }) => <MathText>{allRight ? REMARKS.twoWays : `الكتابتان الأوليان صحيحتان. ${REMARKS.twoWays}`}</MathText>}
                onAnswered={() => setQ3(true)} />
            </div>
          ) },
        { num: 4, title: 'النشر المبسّط لمساحة الشريط', done: q4,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>ننشر ونبسّط <MathText>{'$(10 + 2x)^2 - 10^2$'}</MathText> . مساحة الشريط هي ...</span>}
                options={['$4x^2 + 40x$', '$4x^2$', '$4x^2 + 20x$', '$40x$'].map(M)}
                correct={0} cols={2} requires={['mutatabiqat', 'nashr-jadaa']}
                explain={<span><MathText>{'$(10 + 2x)^2 - 10^2 = 100 + 40x + 4x^2 - 100 = 4x^2 + 40x$'}</MathText> ، ونجد النتيجة نفسها بالطريقة الثانية: <MathText>{'$40x + 4x^2$'}</MathText>. {REMARKS.murabbaWhy}</span>}
                onAnswered={() => setQ4(true)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : les deux façons viennent d’être dites par la correction de la question 3
                  (REMARKS.twoWays) et l’explication de la question 4. */}
              {q4 && <KnowledgeBrick id="masaha-tariqatan" variant="rappel" />}
            </div>
          ) },
        { num: 5, title: 'ماذا يقول الملعب؟', subtitle: 'من محاولاتك', done: q5,
          content: (
            <div className="space-y-3">
              {evidence}
              <NumericQuestion
                prompt={<span>جرّب قيمًا لـ <MathText>{'$x$'}</MathText> في الملعب. من أجل أيّ قيمة طبيعية لـ <MathText>{'$x$'}</MathText> تكون مساحة الشريط 44؟</span>}
                expected={1}
                requires={['masaha-tariqatan']}
                explain={<MathText>{'من أجل $x = 1$ : ضلع المربع الخارجي 12 ومساحته 144، فمساحة الشريط $144 - 100 = 44$. وبالعبارة: $4 \\times 1^2 + 40 \\times 1 = 44$.'}</MathText>}
                explainFor={(n) => (n > 0 && n < 50
                  ? <MathText>{`من أجل $x = ${n}$ مساحة الشريط $4 \\times ${n}^2 + 40 \\times ${n} = ${4 * n * n + 40 * n}$ ، لا 44. جرّب قيمة أصغر.`}</MathText>
                  : <MathText>{'عرض الشريط طول، فهو عدد موجب: جرّب $x = 1$ ، $x = 2$ ...'}</MathText>)}
                onAnswered={() => setQ5(true)} />
            </div>
          ) },
        { num: 6, title: 'المساواة ومساعدة الكتاب', subtitle: 'المرحلة 3 من الكتاب', done: q6,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={SITUATION.analysis[2].label} text={SITUATION.analysis[2].text} source={SITUATION.source} compact />
              <TapQuestion
                prompt="المعلومة «مساحة هذا الشريط 44 مترًا مربّعًا» تُكتب بالمساواة ..."
                options={['$4x^2 + 40x = 44$', '$(10 + 2x)^2 = 44$', '$4x^2 + 40x + 100 = 44$', '$4x^2 + 40x = 100$'].map(M)}
                correct={0} cols={2} requires={['masaha-tariqatan']}
                explain={<span><MathText>{'$(10 + 2x)^2$'}</MathText> مساحة المربع الخارجي كلّه (الحوض معه)، و 100 مساحة الحوض. <MathText>{REMARKS.equation}</MathText> <MathText>{'$4x^2 + 40x - 44 = 0$ ، وبالقسمة على 4: $x^2 + 10x - 11 = 0$.'}</MathText></span>}
                onAnswered={() => setQ6(true)} />
              {q6 && (
                <>
                  <KnowledgeBrick id="musaada-jadaa" />
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche ne fait que remettre en ordre les trois étapes du
                      « تحليل الوضعية » que l’élève vient de lire (encadrés des étapes 1, 3 et 6) et la vérification par substitution. */}
                  <KnowledgeBrick id="tariqat-wadiya" variant="rappel" />
                  <TextbookBox kind="remark" text={REMARKS.notSolvedHere} compact />
                </>
              )}
            </div>
          ) },
        { num: 7, title: 'التحدّي: متى يكون المثلث قائمًا في A؟', subtitle: 'تحدّ ص 31', done: c1 && c2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{CHALLENGE.text}</MathText> <SourceTag source={CHALLENGE.source} /></p>
              <RightTriangle right="A" top="B" side="C" legTop="x + 1" legSide="x + 2" hyp="x + 3" caption="الشكل المقابل في الكتاب (نرسمه قائمًا في A، وهو ما نبحث عنه)" label="مثلث ABC حيث AB = x + 1 و AC = x + 2 و BC = x + 3" />
              <TapQuestion
                prompt={<span>المثلث ABC قائم في A يعني (خاصية فيثاغورس، والوتر هو <MathText>{'$BC$'}</MathText>):</span>}
                options={['$(x + 3)^2 = (x + 1)^2 + (x + 2)^2$', '$(x + 1)^2 = (x + 2)^2 + (x + 3)^2$', '$x + 3 = (x + 1) + (x + 2)$', '$(x + 3)^2 = (2x + 3)^2$'].map(M)}
                correct={0} cols={1} requires={['khassiyat-fithaghuras', 'namdhaja']}
                explain={<MathText>{'الوتر يقابل الزاوية القائمة A، فهو $BC = x + 3$ : $BC^2 = AB^2 + AC^2$. نجمع المربعات، لا الأطوال.'}</MathText>}
                onAnswered={() => setC1(true)} />
              {c1 && (
                <TapQuestion
                  prompt={<span>ننشر بمتطابقة مربع مجموع: <MathText>{'$x^2 + 6x + 9 = 2x^2 + 6x + 5$'}</MathText> ، أي <MathText>{'$x^2 = 4$'}</MathText>. قيمة العدد <MathText>{'$x$'}</MathText> التي من أجلها يكون المثلث قائمًا في A هي ...</span>}
                  options={['$x = 2$', '$x = 2$ أو $x = -2$', '$x = 4$', '$x = 16$'].map(M)}
                  correct={0} cols={2} requires={['mutatabiqat', 'tariqat-wadiya']}
                  explain={<MathText>{'من أجل $x = 2$ : الأضلاع 3 و 4 و 5، و $3^2 + 4^2 = 9 + 16 = 25 = 5^2$. أما $x = -2$ فيعطي $AB = -1$ : الطول موجب، فنرفضه — كما نرفض القيمة السالبة لعرض الشريط.'}</MathText>}
                  onAnswered={() => setC2(true)} />
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={7} variant="memo" />} />
  );
}
