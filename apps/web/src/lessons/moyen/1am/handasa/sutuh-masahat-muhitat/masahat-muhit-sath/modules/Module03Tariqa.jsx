import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, METHOD_TILING } from '../content/textbook';

/**
 * Module 3 — طريقة « أعيّن المساحة برصف » (P2). UNE SEULE PISTE (guide §4quater) : le MÊME labo que le module 1, posé SEUL en haut
 * (`levels={false}`, monde `floor`) — une terrasse à paver avec des dalles entières et des demi-dalles le long d'un bord en biais, puis le même
 * sol avec une unité double ; puis l'élève répond sur ce qu'il a lu, lit la méthode ligne à ligne, puis la brique (gardée par « أتوقّع القاعدة »),
 * puis un transfert. Les nombres du labo (16 ; 21 et 10,5) sont ceux de `content/textbook.js › LAB.floor`.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;

export default function Module03Tariqa() {
  const [trials, setTrials] = useState([]);
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const readHalves = trials.find((e) => e.kind === 'read' && e.scene === 'terrace-halves');
  const readTwo = trials.find((e) => e.kind === 'read' && e.scene === 'terrace-double' && e.unit === 'two');

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['كيف نعدّ أنصاف البلاطات؟', 'ماذا يتغيّر في العدد حين تتغيّر الوحدة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة — أعيّن المساحة برصف"
      moduleSubtitle="بلاطات كاملة وأنصاف · وحدة مزدوجة"
      estimatedTime="12 دقيقة"
      intro={<Manipulation type="tile-yard" levels={false} world="floor" tasks={LAB.FLOOR} onTrial={record} />}
      steps={[
        {
          num: 1, title: 'جرّب قبل أن ترى الطريقة', subtitle: 'أنصاف البلاطات', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="halves" ok={!!readHalves}
                done={<span>قرأتَ مساحة الشرفة: <Ltr>{readHalves?.value}</Ltr> وحدة ①.</span>}
                todo="ارصف الشرفة الأولى (الأرضية ذات الحافة المائلة) واقرأ مساحتها، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>في الشرفة التي رصصتَها <Ltr>{LAB.floor.wholes}</Ltr> بلاطة كاملة و <Ltr>{LAB.floor.halves}</Ltr> أنصاف بلاطات. لماذا نعدّ كل نصفين بلاطة واحدة عند حساب المساحة؟</span>}
                options={[
                  M('لأنّ نصفين يكوّنان بلاطة كاملة تغطّي الأرض نفسها'),
                  M('لأنّ نصف البلاطة لا يغطّي شيئًا من الأرض'),
                  M('لأنّ الأنصاف لا تدخل في المساحة'),
                ]}
                correct={0} cols={1} requires={['masaha-adad']}
                explain={<MathText>{'ألصق نصفين على قطرهما فتحصل على بلاطة كاملة: الأرض المغطّاة بنصفين هي الأرض المغطّاة ببلاطة. لهذا ننضمّ الأنصاف مثنى مثنى ولا نهملها.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'الطريقة سطرًا سطرًا', subtitle: 'ثم مثال جديد', done: q2,
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD_TILING} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="tariqat-rasf" lead="الأنصاف في الشرفة: كيف عيّنتَ المساحة بعدد واحد؟" />}
              <TapQuestion
                prompt={<span>رُصّت أرضية بسبع بلاطات كاملة وأربعة أنصاف بلاطة. كم وحدة ① مساحتها؟</span>}
                options={[M('$9$'), M('$11$'), M('$7$')]}
                correct={0} cols={3} requires={['tariqat-rasf']}
                explain={<MathText>{'أربعة أنصاف هي بلاطتان: $4\\div2=2$ ، فالمساحة $7+2=9$ وحدات ①. ولو عددنا الأنصاف بلاطات لحصلنا على 11، ولو أهملناها لحصلنا على 7.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'الأرضية نفسها بوحدتين', subtitle: 'المفردة والمزدوجة', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="two-units" ok={!!readTwo}
                done={<span>الأرضية نفسها: <Ltr>{LAB.floor.ones}</Ltr> وحدة ① أو <Ltr>{readTwo?.value}</Ltr> وحدة ②.</span>}
                todo="في الشرفة الثانية ارصف الأرضية بالبلاطة المفردة ثم بالمزدوجة واقرأ المساحة بالوحدتين، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>الأرضية نفسها مساحتها <Ltr>{LAB.floor.ones}</Ltr> وحدة ① أو <Ltr>{LAB.floor.twos}</Ltr> وحدة ②. لماذا العدد الثاني أصغر مع أنّ الأرضية لم تتغيّر؟</span>}
                options={[
                  M('لأنّ الوحدة ② ضعف الوحدة ①، فنحتاج إلى عدد أقل منها لتغطية الأرض نفسها'),
                  M('لأنّ الأرضية صارت أصغر حين غيّرنا البلاطة'),
                  M('لأنّ الوحدة ② نصف الوحدة ① فنحتاج إلى عدد أقل منها'),
                ]}
                correct={0} cols={1} requires={['tariqat-rasf']}
                explain={<MathText>{'المساحة هي الأرض نفسها. وبلاطة مزدوجة تغطّي بلاطتين مفردتين، فنعدّ منها نصف ما نعدّه من المفردة: $21\\div2=10{,}5$ .'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="wahdatan-adad" lead="21 و 10,5 لأرضية واحدة: ما الذي غيّر العدد؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
