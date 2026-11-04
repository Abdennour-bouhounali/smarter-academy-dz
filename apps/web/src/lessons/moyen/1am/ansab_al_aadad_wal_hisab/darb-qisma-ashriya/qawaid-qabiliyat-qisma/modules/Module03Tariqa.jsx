import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { MethodSteps, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';
import { EX } from '../content/exercises';

/**
 * Module 3 — طريقة (p. 42) « قابلية القسمة على 4 » : les bonbons répartis dans 4 sacs, la solution du manuel révélée ligne
 * à ligne, puis la méthode (brique gardée par « أتوقّع القاعدة »), puis دوري الآن (108, 2020, 527, 4356748). LP : P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Tariqa() {
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [now, setNow] = useState(false);
  return (
    <ContentModule
      objectives={['لماذا يكفي أن ننظر إلى الرقمين الأخيرين؟', 'أختبر قابلية القسمة على 4']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة — قابلية القسمة على 4"
      moduleSubtitle="حبّات الحلوى في 4 أكياس"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أكتسب طرائق — الكتاب ص 42', title: METHOD.title, tone: 'emerald',
        body: <p>تمرين محلول من الكتاب: اكشف الحلّ سطرًا سطرًا، وحاول أن تتوقّع السطر التالي.</p> }}
      steps={[
        { num: 1, title: 'حلّ الكتاب سطرًا سطرًا', subtitle: '100 ، 116 ، 103 ، 224', done: q1,
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="qabiliya-4" lead="100 تتوزّع دائمًا على 4 أكياس: ما الجزء الذي يبقى أن ننظر إليه؟" />}
              <TapQuestion
                prompt={<span>هل يقبل العدد 2018 القسمة على 4؟</span>}
                options={[M('لا: $18 = 4 \\times 4 + 2$'), M('نعم: لأنه عدد زوجي'), M('نعم: لأنّ 20 يقبل القسمة على 4')]}
                correct={0} cols={1} requires={['qabiliya-4']}
                explain={<span>العدد 18 لا يقبل القسمة على 4، فالعدد 2018 لا يقبل القسمة على 4 (مثال الكتاب).</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ) },
        { num: 2, title: 'دوري الآن', subtitle: 'أربعة أعداد', done: now,
          content: <TextbookExercise exercise={EX['now-42']} requires={['qabiliya-4']} onAnswered={() => setNow(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} variant="memo" />}
    />
  );
}
