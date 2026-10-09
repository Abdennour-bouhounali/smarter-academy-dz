import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import TrialEvidence, { upsertTrial } from '../components/TrialEvidence';
import { ACTIVITY_C, HOOK, LABS } from '../content/textbook';

/**
 * Module 2 — نشاط 2 (p. 33) : 3) جداء مجموع حدين وفرقهما.
 *
 * LE RÉEL : un entraîneur transforme un terrain carré de 20 m en rectangle,
 * +5 m de long, −5 m de large, et croit l'aire inchangée. Tranché au dernier
 * pas : il perd 5² = 25 m².
 *
 * LABORATOIRE À DEUX NIVEAUX, UN INSTRUMENT (`pitch-expansion`, kind sum-diff) :
 *   مبتدئ  — (x + 3)(x − 3) : la bande +3x ajoutée en longueur et la bande −3x
 *            retranchée en largeur ont la même aire : posées l'une sur l'autre
 *            dans « المجموع », elles S'ANNULENT ; il reste x² − 9.
 *   متقدم  — (2x + 5)(2x − 5) (defaultLevel, les nombres de act-2c جـ) : le
 *            premier terme est 2x, son carré 4x² ; les zones ±10x à trouver seul.
 * L'activité est répondue depuis LES ESSAIS DE L'ÉLÈVE (`onTrial`), listés au
 * pas 1 (`[data-activity-evidence]`) ; l'identité n'est NOMMÉE qu'après la
 * preuve « انقل وأكمل » (ب). LP enseignés : P3, P4.
 */
const m = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module02NashatJidaa() {
  const [beginnerTrials, setBeginnerTrials] = useState([]);
  const [advancedTrials, setAdvancedTrials] = useState([]);
  const [d, setD] = useState({});
  const done = (k) => () => setD((s) => ({ ...s, [k]: true }));
  const { side, change } = HOOK.rectangle;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="نشاط 2 — جداء مجموع حدين وفرقهما"
      moduleSubtitle="ملعب يطول ويضيق بالقدر نفسه"
      estimatedTime="8 دقائق"
      brief={{
        tag: 'أنشطة — الكتاب ص 33',
        headline: 'أطول بـ 5 وأضيق بـ 5: هل تبقى المساحة نفسها؟',
        emoji: '🥅',
        title: ACTIVITY_C.subtitle,
        tone: 'rose',
        body: (
          <div className="space-y-2">
            <p>
              مدرّب يحوّل ملعبًا مربّعًا ضلعه <MathText>{`$${side}\\,m$`}</MathText> إلى ملعب مستطيل: يزيد طوله <MathText>{`$${change}\\,m$`}</MathText> ويُنقص عرضه <MathText>{`$${change}\\,m$`}</MathText>.
              {' '}يقول: «أضفت ما أنقصت، فالمساحة لم تتغيّر». هل هو على حق؟ <SourceTag source={HOOK.source} />
            </p>
            <p>في المختبر ملعب طوله مجموع حدّين وعرضه فرقهما: اسحب المناطق إلى «المجموع» وضع كل حدّ على الحدّ المشابه له. ماذا يبقى؟</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY_C.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="المستوى المتقدم بأعداد الكتاب: (2x + 5)(2x − 5). في المستوى المبتدئ (x + 3)(x − 3)."
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="pitch-expansion"
                level="beginner"
                expr={LABS.sumDiffBeginner}
                title="ملعب طوله x + 3 وعرضه x − 3"
                lead="الشريط المضاف في الطول والشريط المقتطع من العرض: قارن مساحتيهما."
                onTrial={(t) => setBeginnerTrials((list) => upsertTrial(list, t))}
              />
            ),
            advanced: () => (
              <Manipulation
                type="pitch-expansion"
                level="advanced"
                expr={LABS.sumDiffAdvanced}
                title="ملعب طوله 2x + 5 وعرضه 2x − 5"
                lead="اسحب كل المناطق، اجمع ما يتشابه منها، وتحقّق من أجل قيمتين لـ x. ماذا يبقى من الملعب؟"
                onTrial={(t) => setAdvancedTrials((list) => upsertTrial(list, t))}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أ) مساحة المستطيل (1) بطريقتين', subtitle: 'أجب من ملعبك', done: !!d.a,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" title="الشكل" text={ACTIVITY_C.text} source={ACTIVITY_C.source} compact />
              <p className="text-sm font-semibold text-slate-700">ما تحقّقت منه في المختبر:</p>
              <TrialEvidence
                trials={advancedTrials}
                line={(x) => `$x = ${x}$ : $(2x + 5)(2x - 5) = ${(2 * x + 5) * (2 * x - 5)}$ و $${4 * x * x} - ${10 * x} + ${10 * x} - 25 = ${4 * x * x - 25}$`}
                empty="المستوى المتقدم: لم تتحقّق بعد."
              />
              <TrialEvidence
                trials={beginnerTrials}
                line={(x) => `$x = ${x}$ : $(x + 3)(x - 3) = ${(x + 3) * (x - 3)}$ و $${x * x} - ${3 * x} + ${3 * x} - 9 = ${x * x - 9}$`}
                empty="المستوى المبتدئ: لم تتحقّق بعد."
              />
              <TapQuestion
                prompt={<MathText>{ACTIVITY_C.questions[0]}</MathText>}
                options={[
                  '$(a + b)(a - b) = (a + b)^2 - 2b(a + b) = a^2 - 2ab + b^2$',
                  '$(a + b)(a - b) = (a + b)^2 - 2b(a + b) = a^2 - b^2$',
                  '$(a + b)(a - b) = (a + b)^2 - b^2 = a^2 + 2ab$',
                ].map(m)}
                correct={1}
                cols={1}
                requires={['murabba-majmu', 'nashr-qawsayn']}
                explain={<span>المستطيل (1) هو المربع KLMN ناقص المستطيل (2): <MathText>{'$(a + b)^2 - 2b(a + b) = a^2 + 2ab + b^2 - 2ab - 2b^2 = a^2 - b^2$'}</MathText> — كما في ملعبك: الحدّان المتعاكسان تعادما.</span>}
                onAnswered={done('a')}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'ب) البرهان: انقل وأكمل', subtitle: 'من أجل كل عددين', done: !!d.b,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_C.questions[1]}</MathText></p>}
                rows={[
                  { id: 'p1', label: m('$(a + b)(a - b) = \\ldots - \\ldots + \\ldots - \\ldots$'), options: ['$a^2 - ab - ba + b^2$', '$a^2 - ab + ba - b^2$', '$a^2 + ab + ba - b^2$'].map(m), correct: 1, correction: m('$a \\times a - a \\times b + b \\times a - b \\times b$') },
                  { id: 'p2', label: m('$= \\ldots - \\ldots$'), options: ['$a^2 - b^2$', '$a^2 - 2b^2$', '$a^2 - 2ab$'].map(m), correct: 0, correction: m('$-ab + ba = 0$ : الحدّان يتعادمان.') },
                ]}
                requires={['nashr-qawsayn', 'tabsit-hudud']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{'$(a + b)(a - b) = a^2 - ab + ba - b^2 = a^2 - b^2$'}</MathText>
                  </Feedback>
                )}
                onAnswered={done('b')}
              />
              {d.b && <KnowledgeBrick id="jidaa-majmu-farq" lead="برهنت ما رأيته على الملعب، من أجل كل عددين: جداء مجموع حدين وفرقهما." />}
            </div>
          ),
        },
        {
          num: 3, title: 'جـ) انشر', done: !!d.c,
          content: (
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_C.questions[2]}</MathText></p>}
              rows={[
                { id: 'n1', label: m('$(x - 3)(x + 3) =$'), options: ['$x^2 + 9$', '$x^2 - 6x - 9$', '$x^2 - 9$'].map(m), correct: 2, correction: m('$x^2 - 3^2 = x^2 - 9$') },
                { id: 'n2', label: m('$(2x - 5)(2x + 5) =$'), options: ['$4x^2 - 25$', '$2x^2 - 25$', '$4x^2 - 10$'].map(m), correct: 0, correction: m('$(2x)^2 - 5^2 = 4x^2 - 25$') },
              ]}
              requires={['jidaa-majmu-farq', 'murabba-adad']}
              feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{'ترتيب العاملين لا يهمّ: $(x - 3)(x + 3) = (x + 3)(x - 3)$.'}</MathText></Feedback>}
              onAnswered={done('c')}
            />
          ),
        },
        {
          num: 4, title: 'د) احسب ذهنيا', subtitle: 'دون وضع العملية', done: !!d.dh,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hisab-mutamaan" variant="rappel" compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_C.questions[3]}</MathText></p>}
                rows={[
                  { id: 'h1', label: m('$105 \\times 95 =$'), options: ['$10\\,025$', '$9975$', '$9925$'].map(m), correct: 1, correction: m('$(100 + 5)(100 - 5) = 10\\,000 - 25 = 9975$') },
                  { id: 'h2', label: m('$97^2 - 3^2 =$'), options: ['$8836$', '$10\\,000$', '$9400$'].map(m), correct: 2, correction: m('$(97 + 3)(97 - 3) = 100 \\times 94 = 9400$') },
                ]}
                requires={['jidaa-majmu-farq', 'hisab-mutamaan']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{'نقرأ المتطابقة في الاتجاهين: $105 \\times 95$ جداء مجموع وفرق، و $97^2 - 3^2$ فرق مربعين.'}</MathText></Feedback>}
                onAnswered={done('dh')}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'عودة إلى الملعب', subtitle: 'هل المدرّب على حق؟', done: !!d.h,
          content: (
            <TapQuestion
              prompt={<span>الملعب صار طوله <MathText>{`$${side + change}\\,m$`}</MathText> وعرضه <MathText>{`$${side - change}\\,m$`}</MathText>. ماذا تقول للمدرّب؟</span>}
              options={[
                `المساحة لم تتغيّر: $${side * side}\\,m^2$`,
                `نقصت المساحة $${change * change}\\,m^2$ لأنّ $${side + change} \\times ${side - change} = ${side}^2 - ${change}^2 = ${(side + change) * (side - change)}$`,
                `زادت المساحة $${change * change}\\,m^2$`,
              ].map(m)}
              correct={1}
              cols={1}
              requires={['jidaa-majmu-farq']}
              explain={<MathText>{`$(${side} + ${change})(${side} - ${change}) = ${side}^2 - ${change}^2$ : المنطقتان المضافة والمقتطعة متساويتان، لكن الركن $${change}^2 = ${change * change}$ يضيع.`}</MathText>}
              onAnswered={done('h')}
            />
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
