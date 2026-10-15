import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, MethodSteps, FractionQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 46) : « المعادلة من الدرجة الأولى بمجهول واحد ».
 *   1. la propriété du livre posée en brique (hal-ax-b) : ax = b, a ≠ 0, solution unique b/a ;
 *   2. l'exemple du livre 4x − 3 = 2x + 6 en LABORATOIRE TRAVAILLÉ (equation-balance,
 *      `levels={false}`) — x = 9/2 se lit comme quatre ballons et demi — puis ses lignes
 *      révélées une à une (MethodSteps) ;
 *   3. un coefficient négatif (le signe dans b/a).
 * RÉTROFIT 2026-10-15 (guide §4quater) : la balance de l'exemple OUVRE le module (plus de carte `brief`), ses lignes révélées ensuite ;
 * la propriété passe après (déjà en « أتوقّع القاعدة » : la prédiction précède la boîte du livre). LP : P1, P2.
 */
export default function Module02Maarif() {
  const [tried, setTried] = useState(null);
  const [q1, setQ1] = useState(false);
  const [read, setRead] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      objectives={["ماذا يحدث في آخر خطوة من كل ميزان؟", "كيف نكتب حلّ المعادلة ax = b؟", "ماذا يتغيّر عندما يكون المعامل سالبًا؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — المعادلة ax = b"
      moduleSubtitle="الشكل الذي تؤول إليه كل معادلة من الدرجة الأولى"
      estimatedTime="8 دقائق"
      intro={(
        <Manipulation
          type="equation-balance"
          eq="4x-3=2x+6"
          levels={false}
          title={'ميزان: \u20664x − 3 = 2x + 6\u2069'}
          lead="أربعة أكياس وثلاثة بالونات في كفّة، وكيسان وست كرات في الكفّة الأخرى."
          onTrial={setTried}
        />
      )}
      steps={[
        {
          num: 1, title: 'قارن خطواتك بحلّ الكتاب', subtitle: 'المثال المحلول — سطرًا سطرًا', done: read && q2,
          content: (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={tried && tried.steps.length ? 'true' : 'false'}>
                {!tried || tried.steps.length === 0 ? (
                  <p className="text-slate-500">لم تكتب أي خطوة على الميزان بعد: حلّ المعادلة في الأعلى ثم قارن بحلّ الكتاب.</p>
                ) : (
                  <ol className="space-y-1" data-evidence="steps">
                    <li className="font-bold"><MathText>{`$${tried.equation}$`}</MathText></li>
                    {tried.steps.map((st, i) => (
                      <li key={i} data-evidence-step={i}><MathText>{`أي $${st.result}$`}</MathText></li>
                    ))}
                  </ol>
                )}
              </div>
              <MethodSteps method={{ source: KNOWLEDGE.source, ...KNOWLEDGE.exampleLines }} onAllRevealed={() => setRead(true)} />
              {read && (
                <TapQuestion
                  prompt={<MathText>{'كيف انتقل الكتاب من $2x - 3 = 6$ إلى $2x = 9$؟'}</MathText>}
                  options={[
                    <MathText key="a">{'طرح 3 من الطرفين'}</MathText>,
                    <MathText key="b">{'أضاف 3 إلى الطرفين'}</MathText>,
                    <MathText key="c">{'نقل 3 إلى الطرف الآخر كما هو: $2x = 6 - 3$'}</MathText>,
                  ]}
                  correct={1}
                  cols={1}
                  requires={['muadala-tarafayn']}
                  explain={<MathText>{'$2x - 3 + 3 = 6 + 3$ أي $2x = 9$ — على الميزان: ثلاث كرات في كل كفّة، تلغي الكرات الثلاث البالونات الثلاثة. ثم $x = \\dfrac{9}{2}$ : أربع كرات ونصف في كل كيس.'}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'الخاصية', subtitle: 'معارف 1', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="muadala-tarafayn" variant="rappel" compact />
              {/* La propriété du livre ÉNONCE la règle hal-ax-b : l'élève la prédit d'abord. */}
              <PredictRule id="hal-ax-b"><TextbookBox kind="property" text={KNOWLEDGE.property} source={KNOWLEDGE.source} compact /></PredictRule>
              <TapQuestion
                prompt={<MathText>{'ما الحل الوحيد للمعادلة $5x = 3$؟'}</MathText>}
                options={[
                  <MathText key="a">{'$\\dfrac{5}{3}$'}</MathText>,
                  <MathText key="b">{'$-2$'}</MathText>,
                  <MathText key="c">{'$\\dfrac{3}{5}$'}</MathText>,
                  <MathText key="d">{'$15$'}</MathText>,
                ]}
                correct={2}
                cols={4}
                requires={['muadala-tarafayn']}
                explain={<MathText>{'$a = 5$ و $b = 3$ : الحل $\\dfrac{b}{a} = \\dfrac{3}{5}$ ، وللتحقّق $5 \\times \\dfrac{3}{5} = 3$. أمّا $\\dfrac{5}{3}$ فهو $\\dfrac{a}{b}$ ، و $-2 = 3 - 5$ طرح لا قسمة.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="hal-ax-b" lead="آخر خطوة في كل ميزان: كيس واحد وحده، أي القسمة على عدد الأكياس." />}
            </div>
          ),
        },
        {
          num: 3, title: 'معامل سالب', subtitle: 'الإشارة في b/a', done: q3,
          content: (
            <FractionQuestion
              prompt={<MathText>{'حلّ المعادلة $-4x = 10$ : $x = $'}</MathText>}
              expected="-5/2"
              requireIrreducible={false}
              requires={['hal-ax-b']}
              explain={'$a = -4$ و $b = 10$ : $x = \\dfrac{10}{-4} = -\\dfrac{5}{2}$ ، وللتحقّق $-4 \\times \\left(-\\dfrac{5}{2}\\right) = 10$.'}
              onAnswered={() => setQ3(true)}
            />
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
