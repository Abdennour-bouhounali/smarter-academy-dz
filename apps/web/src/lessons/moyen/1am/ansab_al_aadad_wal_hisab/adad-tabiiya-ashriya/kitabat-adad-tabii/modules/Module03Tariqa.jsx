import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD, LAB } from '../content/textbook';

/**
 * Module 3 — طريقة de la plateforme (déclarée) « رقم المرتبة وعدد وحداتها », sur l'exercice 2 du manuel (p. 17) : 1345 DA
 * échangés en billets de 100 DA. Le MÊME instrument que le module 1, monde `money`, posé seul (levels={false}) ; puis la
 * solution ligne à ligne, puis la méthode (brique gardée par « أتوقّع القاعدة »). LP : P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Tariqa() {
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule
      objectives={['كم ورقة من 100 دج في 1345 دج؟', 'كيف نقرأ عدد المئات مباشرة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة — رقم المرتبة وعدد وحداتها"
      moduleSubtitle="حصّالة يونس"
      estimatedTime="8 دقائق"
      brief={{ tag: 'طريقة — على التمرين 2 ص 17', title: METHOD.title, tone: 'emerald',
        body: <p>رقم المئات في 1345 هو 3، فكم ورقة من 100 دج فيه؟ افتح الأوراق والقطع لتعرف.</p>, footer: <SourceTag source={METHOD.source} /> }}
      steps={[
        { num: 1, title: 'افتح الأوراق والقطع', subtitle: 'في الدكّان', done: q1,
          content: (
            <div className="space-y-3">
              <Manipulation type="rank-exchange" world="money" tasks={['unpack']} n={LAB.money.n} rank={LAB.money.rank} levels={false} />
              <TapQuestion
                prompt={<span>كم ورقة من فئة 100 دج يأخذ يونس مقابل <bdi dir="ltr">1345</bdi> دج؟</span>}
                options={[M('13 ورقة، ويبقى 45 دج'), M('3 أوراق، ويبقى 45 دج'), M('1 ورقة، ويبقى 345 دج')]}
                correct={0} cols={1} requires={['jadwal-maratib']}
                explain={<MathText>{'$1345 = 13 \\times 100 + 45$ : رقم المئات 3، لكنّ الألف فيه 10 مئات أيضًا.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ) },
        { num: 2, title: 'الحلّ سطرًا سطرًا، ثم الطريقة', subtitle: 'عدد المئات', done: q2,
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="raqm-adad" lead="13 ، و 1345: ماذا حذفنا من الكتابة لنقرأ 13؟" />}
              <TapQuestion
                prompt={<span>عدد المئات في العدد <bdi dir="ltr">2017</bdi> هو:</span>}
                options={[M('20'), M('0'), M('2')]}
                correct={0} cols={3} requires={['raqm-adad']}
                explain={<MathText>{'نحذف الرقمين 1 و 7 اللذين على يمين المئات: 20. $2017 = 20 \\times 100 + 17$.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
