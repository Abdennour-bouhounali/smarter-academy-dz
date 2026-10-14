import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, LAB } from '../content/textbook';

/**
 * Module 1 — نشاط 1 « أكوّن أعدادا » (p. 9). LABORATOIRE À DEUX NIVEAUX, un seul type `rank-exchange` (l'échange dix pour
 * un, brief docs/sources/1am/unit1/brief-authors.md) :
 *   مبتدئ  — l'atelier d'emballage des crayons (plateforme) : 1 carton, 13 boîtes, 24 paquets, 37 crayons à emballer avant
 *            de pouvoir ÉCRIRE le nombre ; puis 2017 crayons ouverts en paquets de 10 (201, alors que رقم العشرات = 1).
 *   متقدم  — les jetons de rang du manuel : 999 + 1 en cascade (نشاط 1 ③), 999 − 1, 1000 − 1, les dictées 7065, 4 908 732.
 * Les ÉTAPES sont les trois questions du manuel ; la brique « عشرة بواحدة » est gardée par « أتوقّع القاعدة ». LP : P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const did = (task) => trials.some((e) => e.task === task && e.ok);

  return (
    <ContentModule
      objectives={['متى نستطيع أن نكتب عدد الأقلام؟', 'هل للرقم نفس القيمة في كل موقع؟', 'ما العدد الذي يلي 999؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — أكوّن أعدادا"
      moduleSubtitle="نربط كل عشرة في واحدة"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'نشاط 1 — الكتاب ص 9',
        headline: 'ماذا يعني رقم في كتابة عدد؟',
        emoji: '🔢',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <ol className="list-decimal space-y-1 ps-5 text-sm">
            {ACTIVITY.questions.map((q) => <li key={q}>{q}</li>)}
          </ol>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="ابدأ بورشة الأقلام (مبتدئ)، ثم انتقل إلى أعداد الكتاب (متقدّم)."
          levels={{
            beginner: () => (
              <Manipulation type="rank-exchange" level="beginner" world="pencils" tasks={['pack', 'unpack']}
                start={LAB.pack} n={LAB.unpack.n} rank={LAB.unpack.rank} onTrial={record} />
            ),
            advanced: () => (
              <Manipulation type="rank-exchange" level="advanced" world="tokens" tasks={['next', 'previous', 'borrow', 'dictation']}
                next={LAB.next} borrow={LAB.borrow} dictation={LAB.dictation} onTrial={record} />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أكبر عدد وأصغر عدد بالأرقام 0 ، 1 ، 3 ، 8', subtitle: 'السؤال 1 من الكتاب', done: q1,
          content: (
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700">كل رقم مرّة واحدة:</p>}
              rows={[
                { id: 'big', label: 'أ) أكبر عدد طبيعي ممكن', options: ['8310', '8301', '1038'], correct: 0, correction: 'نضع الرقم الأكبر في المرتبة الأعلى: 8 آلاف، ثم 3 مئات، ثم 1 عشرة، ثم 0.' },
                { id: 'small', label: 'ب) أصغر عدد طبيعي ممكن', options: ['0138', '1038', '1083'], correct: 1, correction: 'لا نبدأ بالصفر: 0138 هو 138 بثلاثة أرقام فقط. أصغر رقم غير معدوم في المرتبة الأعلى: 1038.' },
              ]}
              requires={['maratib-ibtidai']}
              feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا: الرقم الأكبر في المرتبة الأعلى.' : 'الموقع يقرّر: المرتبة الأعلى على اليسار.'}</Feedback>}
              onAnswered={() => setQ1(true)}
            />
          ),
        },
        {
          num: 2, title: 'العددان 25 و 52', subtitle: 'السؤال 2 من الكتاب', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>هل للرقم 2 نفس الدلالة في 25 وفي 52؟</span>}
                options={[M('لا: في 25 يمثّل عشرتين (20)، وفي 52 يمثّل وحدتين (2)'), M('نعم: 2 هو 2 أينما كُتب'), M('لا: في 52 يمثّل 20')]}
                correct={0} cols={1} requires={['maratib-ibtidai']}
                explain={<MathText>{'$25 = 2 \\times 10 + 5$ و $52 = 5 \\times 10 + 2$ : نفس الرقمين، وقيمتان مختلفتان حسب الموقع.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              <KnowledgeBrick id="qima-mawdi" />
            </div>
          ),
        },
        {
          num: 3, title: 'العدد الذي يلي 999 والذي يسبقه', subtitle: 'السؤال 3 من الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li data-evidence="pack" data-tried={did('pack') ? 'true' : 'false'} className={did('pack') ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {did('pack') ? <span>ورشة الأقلام: ربطتَ حتى صار العدد مكتوبًا: <bdi dir="ltr">{LAB.packValue}</bdi>.</span> : 'ورشة الأقلام: لم تربط بعد (المستوى المبتدئ).'}
                </li>
                <li data-evidence="next" data-tried={did('next') ? 'true' : 'false'} className={did('next') ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {did('next') ? <span>أضفتَ 1 إلى <bdi dir="ltr">999</bdi> وربطتَ ثلاث مرّات.</span> : 'العدد الذي يلي 999: لم تجرّبه بعد (المستوى المتقدّم).'}
                </li>
              </ul>
              <BatchChoiceQuestion
                rows={[
                  { id: 'next', label: 'العدد الذي يلي تسعمائة وتسعة وتسعين', options: ['9910', '1000 — ألف', '99910'], correct: 1, correction: '10 آحاد = عشرة، 10 عشرات = مئة، 10 مئات = ألف: 1000.' },
                  { id: 'prev', label: 'العدد الذي يسبق تسعمائة وتسعة وتسعين', options: ['998 — تسعمائة وثمانية وتسعون', '989', '899'], correct: 0, correction: 'ننقص وحدة من الآحاد: 998.' },
                ]}
                requires={['maratib-ibtidai', 'kitabat-adad-ibtidai']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا.' : 'جرّب 999 + 1 في المستوى المتقدّم.'}</Feedback>}
                onAnswered={() => setQ3(true)}
              />
              <KnowledgeBrick id="tabadul" lead="عمود فيه 10: ماذا فعلتَ قبل أن تستطيع كتابة العدد؟" />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
