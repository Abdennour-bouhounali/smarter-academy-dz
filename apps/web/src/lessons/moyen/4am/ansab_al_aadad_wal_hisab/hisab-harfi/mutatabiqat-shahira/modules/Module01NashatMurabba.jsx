import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import TrialEvidence, { upsertTrial } from '../components/TrialEvidence';
import { ACTIVITY, ACTIVITY_B, DESCARTES, HOOK, LABS } from '../content/textbook';
import DescartesTable from '../components/DescartesTable';

/**
 * Module 1 — نشاط 2 (p. 32) : 1) مربع مجموع، 2) مربع فرق — et ديكارت (p. 31).
 *
 * LE RÉEL : un ملعب جواري carré de 20 m que la commune agrandit de 2 m ; un
 * ouvrier croit qu'il suffit d'ajouter le petit carré 2 × 2 (404 m²). La
 * question revient au dernier pas, tranchée par l'identité (484 m²).
 *
 * LABORATOIRE À DEUX NIVEAUX, UN INSTRUMENT (`pitch-expansion`, terrain carré) :
 *   مبتدئ  — (x + 3)² : le carré MNPQ du manuel devenu terrain. L'élève étire x,
 *            porte les QUATRE zones dans « المجموع » (x², 3x, 3x, 9), réunit les
 *            deux bandes 3x et vérifie pour deux x au moins.
 *   متقدم  — (x − 2)² : le carré KLMN. Deux bandes sont RETRANCHÉES (hachurées)
 *            et le coin retranché deux fois est RESTAURÉ : l'élève décide seul
 *            du signe de chaque zone. Aucune des deux n'est le nombre du livre :
 *            le niveau par défaut reste مبتدئ (les questions commencent par 1)).
 * La grille sous le terrain EST le tableau de Descartes (p. 31) : le pas 5 le
 * nomme, sur le (2x + 1)² du manuel.
 *
 * LES ÉTAPES sont les questions du livre, dans son ordre (1 أ → هـ, 2 أ → هـ).
 * ب est répondu depuis LES ESSAIS DE L'ÉLÈVE (`onTrial`), listés au-dessus de
 * la question (`[data-activity-evidence]`) ; les identités ne sont NOMMÉES
 * (KnowledgeBrick) qu'après la chaîne « انقل وأكمل » que l'élève a complétée.
 * LP enseignés : P1, P2, P4.
 *
 * Rétrofit 2026-10-15 (§4quater) : le labo OUVRE le module — plus de carte `brief` (l'accroche de l'ouvrier est devenue
 * l'application finale, étape « عودة إلى الملعب »), plus de `title` / `lead` de workspace. Deux étapes POURQUOI ouvrent chaque
 * moitié (pourquoi deux carrés ne suffisent pas ; pourquoi le coin se rajoute), répondues depuis les essais de l'élève ; les
 * briques viennent après la réponse (déjà gatées par `d.*`).
 */
const m = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module01NashatMurabba() {
  const [sumTrials, setSumTrials] = useState([]);
  const [diffTrials, setDiffTrials] = useState([]);
  const [d, setD] = useState({});
  const done = (k) => () => setD((s) => ({ ...s, [k]: true }));
  const { side, extra, workersClaim } = HOOK.square;
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : une étape est faite quand la suite de questions de son terrain l'est
  const [cps, setCps] = useState([]);
  const answered = (id) => cps.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const mine = sumTrials.find((t) => t.ok);
  const Evidence = ({ ok, done: line, todo }) => (
    <p data-evidence="checkpoint" data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? line : todo}
    </p>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      objectives={["ماذا يحدث لمساحة ملعب مربّع حين نمدّد ضلعه أو نقتطع منه شريطين؟", "كم منطقة في الملعب، وما مساحة كل منها؟", "كيف نحسب $21^2$ و $19^2$ ذهنيًا دون وضع العملية؟"]}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 — مربّع مجموع ومربّع فرق"
      moduleSubtitle="ملعب مربّع يكبر، ثم ملعب تُقتطع منه أشرطة"
      estimatedTime="13 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation
                  type="pitch-expansion"
                  level="beginner"
                  expr={LABS.squareSum}
                  title="ملعب مربّع ضلعه x + 3"
                  lead="ملعب جواري مربّع تمدّد البلدية ضلعه كلما كبر x."
                  onTrial={(t) => setSumTrials((list) => upsertTrial(list, t))}
                  onCheckpoint={(e) => setCps((l) => [...l, e])}
                />
                <SourceTag source={LABS.source} />
              </div>
            ),
            advanced: () => (
              <div className="space-y-2">
                <Manipulation
                  type="pitch-expansion"
                  level="advanced"
                  expr={LABS.squareDiff}
                  title="ملعب مربّع ضلعه x − 2: شريطان مقتطعان"
                  lead="تُقتطع من الملعب أشرطة: المناطق المخطّطة مقتطعة."
                  onTrial={(t) => setDiffTrials((list) => upsertTrial(list, t))}
                  onCheckpoint={(e) => setCps((l) => [...l, e])}
                />
                <SourceTag source={LABS.source} />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا لا يكفي مربّعان؟', subtitle: 'من ملعبك في المستوى المبتدئ', done: answered(LABS.squareSum),
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">ملعبك <MathText>{'$(x + 3)^2$'}</MathText> — ما تحقّقت منه:</p>
              <TrialEvidence
                trials={sumTrials}
                line={(x) => `$x = ${x}$ : $(x + 3)^2 = ${(x + 3) ** 2}$ و $${x * x} + ${3 * x} + ${3 * x} + 9 = ${(x + 3) ** 2}$`}
                empty="لم تتحقّق بعد: اسحب مناطق الملعب في المستوى المبتدئ، ثم اضغط «تحقّق»."
              />
              <Evidence ok={answered(LABS.squareSum) && !!mine}
                done={<span>أجبتَ في المختبر: عند <MathText>{`$x = ${mine?.x}$`}</MathText> مساحة ملعبك <MathText>{`$${mine?.product}$`}</MathText> ، أمّا المربّعان وحدهما فمجموعهما <MathText>{`$${(mine?.x ?? 0) ** 2} + 9 = ${(mine?.x ?? 0) ** 2 + 9}$`}</MathText> فقط: يغيب الشريطان <MathText>{'$3x$'}</MathText> و <MathText>{'$3x$'}</MathText> .</span>}
                todo="أتمّ ملعب المستوى المبتدئ (احمل المناطق، اجمع، وتحقّق من قيمتين)، ثم أجب عن الأسئلة التي تظهر فوق المختبر." />
            </div>
          ),
        },
        {
          num: 2, title: 'مربع مجموع — أ) بطريقتين', done: !!d.a1,
          content: (
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[0]}</MathText></p>}
              rows={[
                { id: 'w1', label: m('$(8 + 2)^2 = 10^2 =$'), options: ['$100$', '$68$', '$20$'].map(m), correct: 0 },
                { id: 'w2', label: m('$(8 + 2)(8 + 2) = 8 \\times 8 + 8 \\times 2 + 2 \\times 8 + 2 \\times 2 =$'), options: ['$68$', '$84$', '$100$'].map(m), correct: 2, correction: m('$64 + 16 + 16 + 4 = 100$') },
                { id: 'w3', label: m('$(3 + 0{,}5)^2 = 3{,}5^2 =$'), options: ['$9{,}25$', '$12{,}25$', '$7$'].map(m), correct: 1 },
                { id: 'w4', label: m('$(3 + 0{,}5)(3 + 0{,}5) = 9 + 1{,}5 + 1{,}5 + 0{,}25 =$'), options: ['$12{,}25$', '$10{,}75$', '$9{,}25$'].map(m), correct: 0 },
              ]}
              requires={['nashr-qawsayn', 'murabba-adad']}
              feedback={({ allRight }) => (
                <Feedback tone={allRight ? 'ok' : 'ko'}>
                  <MathText>{'الطريقتان تعطيان العدد نفسه. لاحظ: $8^2 + 2^2 = 68$ لا يكفي، ينقص $16 + 16$.'}</MathText>
                </Feedback>
              )}
              onAnswered={done('a1')}
            />
          ),
        },
        {
          num: 3, title: 'مربع مجموع — ب) مساحة المربع بطريقتين', subtitle: 'أجب من ملعبك في المستوى المبتدئ', done: answered(LABS.squareSum),
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" title="الشكل" text={ACTIVITY.text} source={ACTIVITY.source} compact />
              <Evidence ok={answered(LABS.squareSum)}
                done={<span>استخلصتَ في المختبر من ملعبك <MathText>{'$(x + 3)^2$'}</MathText> : المربع أربع مناطق، مربّعان مساحتاهما <MathText>{'$a^2$'}</MathText> و <MathText>{'$b^2$'}</MathText> ومستطيلان مساحة كل منهما <MathText>{'$ab$'}</MathText> ، فيكون <MathText>{'$(a + b)^2 = a^2 + ab + ab + b^2$'}</MathText> .</span>}
                todo="أجب عن أسئلة المختبر في المستوى المبتدئ حتى القاعدة." />
            </div>
          ),
        },
        {
          num: 4, title: 'مربع مجموع — جـ) انقل وأكمل', subtitle: 'من أجل كل عددين', done: !!d.c1,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[2]}</MathText></p>}
                rows={[
                  { id: 'c1', label: m('$(a + b)^2 = (a + b) \\times (\\ldots)$'), options: ['$a \\times b$', '$a + b$', '$a^2 + b^2$'].map(m), correct: 1, correction: m('مربع عدد هو جداؤه في نفسه.') },
                  { id: 'c2', label: m('$= \\ldots + \\ldots + \\ldots + \\ldots$'), options: ['$a^2 + ab + ba + b^2$', '$a^2 + b^2 + a + b$', '$a^2 + ab + b^2 + 1$'].map(m), correct: 0, correction: m('كل حد من القوس الأول في كل حد من القوس الثاني.') },
                  { id: 'c3', label: m('$= \\ldots + \\ldots + \\ldots$'), options: ['$a^2 + ab + b^2$', '$2a + 2ab + 2b$', '$a^2 + 2ab + b^2$'].map(m), correct: 2, correction: m('$ab + ba = 2ab$ : حدّان متشابهان.') },
                ]}
                requires={['nashr-qawsayn', 'tabsit-hudud']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{'$(a + b)^2 = (a + b)(a + b) = a^2 + ab + ba + b^2 = a^2 + 2ab + b^2$'}</MathText>
                  </Feedback>
                )}
                onAnswered={done('c1')}
              />
              {d.c1 && <KnowledgeBrick id="murabba-majmu" lead="هذا ما رأيته على ملعبك وأكملته في السلسلة، من أجل كل عددين: مربع مجموع." />}
            </div>
          ),
        },
        {
          num: 5, title: 'مربع مجموع — د) انشر', done: !!d.d1,
          content: (
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[3]}</MathText></p>}
              rows={[
                { id: 'd1', label: m('$(x + 1)^2 =$'), options: ['$x^2 + 1$', '$x^2 + 2x + 1$', '$x^2 + x + 1$'].map(m), correct: 1, correction: m('$x^2 + 2 \\times x \\times 1 + 1^2 = x^2 + 2x + 1$') },
                { id: 'd2', label: m('$(2x + 3)^2 =$'), options: ['$2x^2 + 12x + 9$', '$4x^2 + 6x + 9$', '$4x^2 + 12x + 9$'].map(m), correct: 2, correction: m('$(2x)^2 + 2 \\times 2x \\times 3 + 3^2 = 4x^2 + 12x + 9$') },
              ]}
              requires={['murabba-majmu', 'murabba-adad']}
              feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{'الحد الأول في $(2x + 3)^2$ هو $2x$ ، ومربعه $(2x)^2 = 4x^2$.'}</MathText></Feedback>}
              onAnswered={done('d1')}
            />
          ),
        },
        {
          num: 6, title: 'جدول ديكارت', subtitle: 'الكتاب ص 31 — الجدول تحت ملعبك', done: !!d.dk,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700">
                الجدول الذي تحت ملعبك في المختبر له اسم: <strong>جدول ديكارت</strong>. في رأسه حدود الضلع، وفي كل خانة مساحة منطقة.
                {' '}هذا جدول ديكارت للعدد <MathText>{'$(2x + 1)^2$'}</MathText>: ضلع المربع <MathText>{'$x + x + 1$'}</MathText>.
              </p>
              <DescartesTable head={DESCARTES.head} cells={DESCARTES.cells} caption="جدول ديكارت — الكتاب ص 31" />
              <TapQuestion
                prompt={<span>اجمع الأعداد المسجلة في الخانات التسع: <MathText>{'$(2x + 1)^2 = \\ldots$'}</MathText></span>}
                options={['$2x^2 + 2x + 1$', '$4x^2 + 1$', '$4x^2 + 4x + 1$', '$4x^2 + 2x + 1$'].map(m)}
                correct={2}
                cols={2}
                requires={['murabba-majmu', 'tabsit-hudud']}
                explain={<MathText>{'أربع خانات $x^2$ وأربع خانات $x$ وخانة $1$ : $4x^2 + 4x + 1$ ، وهو أيضًا $(2x)^2 + 2 \\times 2x \\times 1 + 1^2$.'}</MathText>}
                onAnswered={done('dk')}
              />
              {d.dk && <TextbookBox kind="remark" title={DESCARTES.caption} text={DESCARTES.text} source={DESCARTES.source} compact />}
            </div>
          ),
        },
        {
          num: 7, title: 'مربع مجموع — هـ) احسب ذهنيا', subtitle: 'دون وضع العملية', done: !!d.e1,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[4]}</MathText></p>}
                rows={[
                  { id: 'e1', label: m('$21^2 =$'), options: ['$401$', '$441$', '$421$'].map(m), correct: 1, correction: m('$(20 + 1)^2 = 400 + 40 + 1 = 441$') },
                  { id: 'e2', label: m('$53^2 =$'), options: ['$2509$', '$2659$', '$2809$'].map(m), correct: 2, correction: m('$(50 + 3)^2 = 2500 + 300 + 9 = 2809$') },
                ]}
                requires={['murabba-majmu', 'quwa-ashara']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{'$21 = 20 + 1$ : مربع مجموع، والحد المضاعف $2 \\times 20 \\times 1 = 40$ لا يُنسى.'}</MathText></Feedback>}
                onAnswered={done('e1')}
              />
              {d.e1 && <KnowledgeBrick id="hisab-mutamaan" lead="ما فعلته الآن طريقة للحساب الذهني:" />}
            </div>
          ),
        },
        {
          num: 8, title: 'لماذا يُضاف الركن؟', subtitle: 'من ملعبك في المستوى المتقدم', done: !!d.w2,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">ملعبك <MathText>{'$(x - 2)^2$'}</MathText> — ما تحقّقت منه:</p>
              <TrialEvidence
                trials={diffTrials}
                line={(x) => `$x = ${x}$ : $(x - 2)^2 = ${(x - 2) ** 2}$ و $${x * x} - ${2 * x} - ${2 * x} + 4 = ${(x - 2) ** 2}$`}
                empty="لم تتحقّق بعد: افتح المستوى المتقدم، اسحب كل المناطق — المقتطعة أيضًا — ثم اضغط «تحقّق»."
              />
              <TapQuestion
                prompt={<span>في ملعبك <MathText>{'$(x - 2)^2$'}</MathText> طرحتَ الشريطين <MathText>{'$2x$'}</MathText> و <MathText>{'$2x$'}</MathText> من <MathText>{'$x^2$'}</MathText>، ثم أضفتَ الركن <MathText>{'$+4$'}</MathText>. لماذا يُضاف الركن؟</span>}
                options={[
                  'لأنّه اقتُطع مرّتين، مرّة داخل كل شريط، فنُعيده مرّة واحدة',
                  'لأنّ مساحة الركن موجبة، فتُضاف دائمًا',
                  'لأنّ الركن ليس جزءًا من الملعب',
                ]}
                correct={0}
                cols={1}
                requires={['nashr-qawsayn']}
                explain={<MathText>{'كل شريط عرضه $2$ يشمل الركن $2 \\times 2 = 4$، فاقتطعنا الركن مرّتين: نطرح $2x + 2x$ ثم نعيد $4$ مرّة واحدة.'}</MathText>}
                onAnswered={done('w2')}
              />
            </div>
          ),
        },
        {
          num: 9, title: 'مربع فرق — أ) بطريقتين', done: !!d.a2,
          content: (
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_B.questions[0]}</MathText></p>}
              rows={[
                { id: 'v1', label: m('$(9 - 3)^2 = 6^2 =$'), options: ['$72$', '$36$', '$90$'].map(m), correct: 1 },
                { id: 'v2', label: m('$(9 - 3)(9 - 3) = 81 - 27 - 27 + 9 =$'), options: ['$36$', '$63$', '$72$'].map(m), correct: 0 },
                { id: 'v3', label: m('$(2{,}4 - 3)^2 = (-0{,}6)^2 =$'), options: ['$-0{,}36$', '$3{,}6$', '$0{,}36$'].map(m), correct: 2, correction: m('مربع عدد سالب موجب: $(-0{,}6)^2 = 0{,}36$') },
                { id: 'v4', label: m('$(2{,}4 - 3)(2{,}4 - 3) = 5{,}76 - 7{,}2 - 7{,}2 + 9 =$'), options: ['$0{,}36$', '$-3{,}24$', '$23{,}16$'].map(m), correct: 0 },
              ]}
              requires={['nashr-qawsayn', 'murabba-adad']}
              feedback={({ allRight }) => (
                <Feedback tone={allRight ? 'ok' : 'ko'}>
                  <MathText>{'الطريقتان تعطيان العدد نفسه. لاحظ: $81 - 9 = 72$ ليس $(9 - 3)^2$ ، ينقص $-27 - 27$ و يبقى $+9$.'}</MathText>
                </Feedback>
              )}
              onAnswered={done('a2')}
            />
          ),
        },
        {
          num: 10, title: 'مربع فرق — ب) مربع تُقتطع منه أشرطة', subtitle: 'أجب من ملعبك في المستوى المتقدم', done: !!d.b2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" title="الشكل" text={ACTIVITY_B.text} source={ACTIVITY_B.source} compact />
              <p className="text-sm font-semibold text-slate-700">ملعبك <MathText>{'$(x - 2)^2$'}</MathText> — ما تحقّقت منه في المستوى المتقدم:</p>
              <TrialEvidence
                trials={diffTrials}
                line={(x) => `$x = ${x}$ : $(x - 2)^2 = ${(x - 2) ** 2}$ و $${x * x} - ${2 * x} - ${2 * x} + 4 = ${(x - 2) ** 2}$`}
                empty="لم تتحقّق بعد: افتح المستوى المتقدم، اسحب كل المناطق — المقتطعة أيضًا — ثم اضغط «تحقّق»."
              />
              <TapQuestion
                prompt={<MathText>{ACTIVITY_B.questions[1]}</MathText>}
                options={[
                  '$(a - b)^2 = a^2 - b^2$',
                  '$(a - b)^2 = a^2 - 2(a - b)b - b^2$',
                  '$(a - b)^2 = a^2 - 2ab - b^2$',
                ].map(m)}
                correct={1}
                cols={1}
                requires={['nashr-qawsayn']}
                explain={<span>نطرح من المربع KLMN المستطيلين (مساحة كل منهما <MathText>{'$(a - b)b$'}</MathText>) والمربع (2) (مساحته <MathText>{'$b^2$'}</MathText>). وبالنشر: <MathText>{'$a^2 - 2ab + 2b^2 - b^2 = a^2 - 2ab + b^2$'}</MathText> — في ملعبك الركن <MathText>{'$+4$'}</MathText> يُضاف.</span>}
                onAnswered={done('b2')}
              />
            </div>
          ),
        },
        {
          num: 11, title: 'مربع فرق — جـ) انقل وأكمل', subtitle: 'من أجل كل عددين', done: !!d.c2,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_B.questions[2]}</MathText></p>}
                rows={[
                  { id: 'f1', label: m('$(a - b)^2 = (a - b) \\times (\\ldots)$'), options: ['$a - b$', '$a + b$', '$b - a$'].map(m), correct: 0 },
                  { id: 'f2', label: m('$= \\ldots - \\ldots - \\ldots + \\ldots$'), options: ['$a^2 - ab - ba - b^2$', '$a^2 - ab - ba + b^2$', '$a^2 - b^2$'].map(m), correct: 1, correction: m('$(-b) \\times (-b) = +b^2$') },
                  { id: 'f3', label: m('$= \\ldots - \\ldots + \\ldots$'), options: ['$a^2 - 2ab - b^2$', '$a^2 + 2ab + b^2$', '$a^2 - 2ab + b^2$'].map(m), correct: 2, correction: m('$-ab - ba = -2ab$') },
                ]}
                requires={['nashr-qawsayn', 'tabsit-hudud']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{'$(a - b)^2 = (a - b)(a - b) = a^2 - ab - ba + b^2 = a^2 - 2ab + b^2$'}</MathText>
                  </Feedback>
                )}
                onAnswered={done('c2')}
              />
              {d.c2 && <KnowledgeBrick id="murabba-farq" lead="الشريطان المقتطعان والركن الذي يُضاف، من أجل كل عددين: مربع فرق." />}
            </div>
          ),
        },
        {
          num: 12, title: 'مربع فرق — د) انشر، هـ) احسب ذهنيا', done: !!d.d2,
          content: (
            <BatchChoiceQuestion
              intro={(
                <div className="space-y-1 text-sm font-semibold text-slate-700">
                  <p><MathText>{ACTIVITY_B.questions[3]}</MathText></p>
                  <p><MathText>{ACTIVITY_B.questions[4]}</MathText></p>
                </div>
              )}
              rows={[
                { id: 'g1', label: m('$(x - 1)^2 =$'), options: ['$x^2 - 1$', '$x^2 - 2x + 1$', '$x^2 - 2x - 1$'].map(m), correct: 1, correction: m('$x^2 - 2 \\times x \\times 1 + 1^2 = x^2 - 2x + 1$') },
                { id: 'g2', label: m('$(5 - 2x)^2 =$'), options: ['$25 - 20x + 4x^2$', '$25 - 4x^2$', '$25 - 10x + 4x^2$'].map(m), correct: 0, correction: m('$5^2 - 2 \\times 5 \\times 2x + (2x)^2 = 25 - 20x + 4x^2$') },
                { id: 'g3', label: m('$19^2 =$'), options: ['$399$', '$359$', '$361$'].map(m), correct: 2, correction: m('$(20 - 1)^2 = 400 - 40 + 1 = 361$') },
                { id: 'g4', label: m('$37^2 =$'), options: ['$1369$', '$1351$', '$1591$'].map(m), correct: 0, correction: m('$(40 - 3)^2 = 1600 - 240 + 9 = 1369$') },
              ]}
              requires={['murabba-farq', 'hisab-mutamaan']}
              feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{'في مربع فرق الحد الأخير يُضاف: $19^2 = 400 - 40 + 1$ ، لا $400 - 40 - 1$.'}</MathText></Feedback>}
              onAnswered={done('d2')}
            />
          ),
        },
        {
          num: 13, title: 'عودة إلى الملعب الجواري', subtitle: 'هل العامل على حق؟', done: !!d.h,
          content: (
            <div className="space-y-3">
            <p className="text-sm text-slate-700">
              ملعب جواري مربّع ضلعه <MathText>{`$${side}\\,m$`}</MathText>، وتزيد البلدية ضلعه <MathText>{`$${extra}\\,m$`}</MathText> في الطول وفي العرض.
              {' '}يقول أحد العمّال: «نضيف مربّعًا صغيرًا مساحته <MathText>{`$${extra} \\times ${extra}$`}</MathText>، فتصبح المساحة <MathText>{`$${workersClaim}\\,m^2$`}</MathText>». <SourceTag source={HOOK.source} />
            </p>
            <TapQuestion
              prompt={<span>ضلع الملعب صار <MathText>{`$${side} + ${extra} = ${side + extra}\\,m$`}</MathText>. هل العامل على حق؟ ما مساحته الجديدة؟</span>}
              options={[`$${workersClaim}\\,m^2$`, `$${(side + extra) ** 2}\\,m^2$`, `$${side * side + 2 * side * extra}\\,m^2$`, `$${side * side + side * extra + extra * extra}\\,m^2$`].map(m)}
              correct={1}
              cols={2}
              requires={['murabba-majmu', 'hisab-mutamaan']}
              explain={<MathText>{`$(${side} + ${extra})^2 = ${side * side} + ${2 * side * extra} + ${extra * extra} = ${(side + extra) ** 2}$ : العامل نسي الشريطين، مساحة كل منهما $${side} \\times ${extra} = ${side * extra}\\,m^2$.`}</MathText>}
              onAnswered={done('h')}
            />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
