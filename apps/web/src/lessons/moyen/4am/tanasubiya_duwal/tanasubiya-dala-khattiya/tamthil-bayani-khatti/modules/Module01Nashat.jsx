import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { parseDec } from '@smarter-academy/core';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, HOOK, ICT, ICT_PLATFORM } from '../content/textbook';
import CableCarVignette from '../components/CableCarVignette';

/**
 * Module 1 — نشاط 3 (p. 66) « تمثيل دالة خطية بيانيا », ouvert sur LA DROITE ÉPINGLÉE À O (origin-line).
 *
 * REAL      la carte d'activité : le téléphérique de قسنطينة — un câble droit tendu depuis la station
 *           (O) — puis le نشاط 3, au mot près.
 * DISCOVER / MANIPULATE   le lab à deux niveaux, UN instrument, même objectif :
 *   مبتدئ (ouvert par défaut : c'est le نشاط 3) : f(x) = 0,5x — l'élève POSE A, B… (un point hors de la
 *          droite est refusé avec son écart), O résiste, la droite (OA) se trace au premier point
 *          accepté, puis la sonde lit l'ordonnée de C (abscisse −2) ;
 *   متقدم : le زالق de جيوجيبرا (p. 76) dans sa version plateforme — aucune fonction donnée, l'élève
 *          fait pivoter la droite et la découverte demande une droite qui monte ET une qui descend.
 * UNDERSTAND  س 1 أ) et ب) se décident sur les propres points de l'élève (`onTrial` →
 *           `[data-activity-evidence]`), س 2 أ) sur sa lecture de C, س 2 ب) nomme y = 0,5x.
 * TOUCH / FORMALIZE  la brique tamthil-nashat (« نقول أنّ … ») nomme ce que le lab a montré.
 * TRANSFER  le زالق : la question de la p. 76 se décide sur les droites que l'élève a fixées.
 * AUCUNE étape n'attend `onFinished`. LP : P1, P2 (lecture de C), P3 (le زالق).
 */
const Opt = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [points, setPoints] = useState([]);
  const [reads, setReads] = useState([]);
  const [lines, setLines] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  const onDraw = (tr) => {
    if (tr.kind === 'point') setPoints((p) => [...p.filter((x) => x.pointTex !== tr.pointTex), tr]);
    if (tr.kind === 'read-x') setReads((r) => [...r.filter((x) => x.x !== tr.x), tr]);
  };
  const onPivot = (tr) => { if (tr.kind === 'line') setLines((l) => [...l.filter((x) => x.a !== tr.a), tr]); };

  const pointsEvidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={points.length ? 'true' : 'false'}>
      {points.length === 0 ? (
        <p className="text-slate-500">لم تضع أي نقطة بعد على المعلم (المستوى المبتدئ).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">النقط التي وضعتها:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="points">
            {points.slice(-10).map((tr) => (
              <li key={tr.pointTex} data-evidence-point={tr.label ?? 'refused'} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${tr.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>
                <MathText>{`$${tr.label ?? ''}${tr.pointTex}$`}</MathText> {tr.ok ? '✓' : '✗'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const readEvidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={reads.length ? 'true' : 'false'}>
      {reads.length === 0 ? (
        <p className="text-slate-500"><MathText>{'بعد رسم المستقيم، حرّك المسبار تحت محور الفواصل إلى $-2$ واقرأ.'}</MathText></p>
      ) : (
        <ul className="flex flex-wrap gap-1.5" data-evidence="reads">
          {reads.slice(-6).map((tr) => (
            <li key={tr.x} className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-900"><MathText>{`$${tr.tex}$`}</MathText></li>
          ))}
        </ul>
      )}
    </div>
  );

  const linesEvidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={lines.length ? 'true' : 'false'}>
      {lines.length === 0 ? (
        <p className="text-slate-500">لم تثبّت أي مستقيم بعد على الزالق (المستوى المتقدّم).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">المستقيمات التي ثبّتّها:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="lines">
            {lines.slice(-8).map((tr) => (
              <li key={tr.a} data-evidence-line={tr.dir} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-800">
                <MathText>{`$${tr.tex}$`}</MathText> {tr.dir === 'rising' ? '↗ يصعد' : tr.dir === 'falling' ? '↘ ينزل' : '→ أفقي'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — حبل يشدّه المبدأ"
      moduleSubtitle="تمثيل دالة خطية بيانيا"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 66',
        headline: HOOK.headline,
        emoji: '🚡',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <CableCarVignette />,
        body: (
          <div className="space-y-2">
            <p className="text-sm text-slate-600"><MathText>{HOOK.text}</MathText></p>
            <p className="font-semibold text-slate-800"><MathText>{ACTIVITY.text}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={HOOK.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="في المستويين مستقيم مثبّت في المبدأ O. في المبتدئ تضع أنت نقط تمثيل الدالة، وفي المتقدّم تدير المستقيم بالزالق."
          levels={{
            beginner: () => (
              <Manipulation
                type="origin-line"
                level="beginner"
                a={ACTIVITY.a}
                mode="draw"
                theme="cablecar"
                title="نشاط 3: تمثيل دالة خطية بيانيا"
                lead="احسب صورة 1 وصورة 4، وضع النقطتين A و B. جرّب أيضًا نقطة لا تحقّق الحساب، وحاول أن تحرّك O."
                onTrial={onDraw}
              />
            ),
            advanced: () => (
              <Manipulation
                type="origin-line"
                level="advanced"
                mode="pivot"
                theme="cablecar"
                title="الزالق: كيف يتحرّك المستقيم عندما يتغيّر a؟"
                lead="أمسك المستقيم أو حرّك الزالق على يمين المعلم، وثبّت عدّة مستقيمات: بعضها يصعد وبعضها ينزل."
                onTrial={onPivot}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أكمل الجدول', subtitle: 'السؤال 1 أ', done: q1,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              {pointsEvidence}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'جدول الدالة $f : x \\longmapsto 0{,}5x$ :'}</MathText></p>}
                rows={[
                  { id: 'f0', label: <MathText>{'$f(0)$'}</MathText>, options: ['$0$', '$0{,}5$', '$1$'].map(Opt), correct: 0, correction: <MathText>{'$0{,}5 \\times 0 = 0$'}</MathText> },
                  { id: 'f1', label: <MathText>{'$f(1)$'}</MathText>, options: ['$1$', '$0{,}5$', '$1{,}5$'].map(Opt), correct: 1, correction: <MathText>{'$0{,}5 \\times 1 = 0{,}5$'}</MathText> },
                  { id: 'f4', label: <MathText>{'$f(4)$'}</MathText>, options: ['$4{,}5$', '$8$', '$2$'].map(Opt), correct: 2, correction: <MathText>{'$0{,}5 \\times 4 = 2$ (وليس $4 + 0{,}5$ ولا $4 \\div 0{,}5$)'}</MathText> },
                ]}
                requires={['notation-fx']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'هذه هي ترتيبات النقط التي يقبلها المعلم.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'O و A و B', subtitle: 'السؤال 1 ب', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[1]}</MathText></p>
              {pointsEvidence}
              <TapQuestion
                prompt={<MathText>{'ضع $A(1 ; 0{,}5)$ و $B(4 ; 2)$ على المعلم إن لم تفعل، ثم اختر:'}</MathText>}
                options={[
                  'نعم، على استقامة واحدة: المستقيم (OA) يشمل B لأنّ $2 = 0{,}5 \\times 4$.',
                  'لا: ثلاث نقط فواصلها مختلفة لا تكون على استقامة واحدة.',
                  'نعم: كل ثلاث نقط في معلم تكون على استقامة واحدة.',
                ].map(Opt)}
                correct={0}
                cols={1}
                requires={['notation-fx']}
                explain={<MathText>{ACTIVITY_LINES.aligned}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'النقطة C', subtitle: 'السؤال 2 أ', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              {readEvidence}
              <NumericQuestion
                prompt={<MathText>{'ترتيب النقطة C من المستقيم (OA) ذات الفاصلة $-2$ هو:'}</MathText>}
                expected={-1}
                parse={parseDec}
                display="-1"
                requires={['notation-fx', 'talim-nuqta']}
                explain={<MathText>{ACTIVITY_LINES.c}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'النقطة M(x ; y)', subtitle: 'السؤال 2 ب', done: q4,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[3]}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'إذا كانت $M(x ; y)$ نقطة من (OA) فإنّ:'}</MathText>}
                options={['$y = 0{,}5x$', '$y = x + 0{,}5$', '$x = 0{,}5y$', '$y = 0{,}5$'].map(Opt)}
                correct={0}
                cols={2}
                requires={['notation-fx']}
                explain={<MathText>{`${ACTIVITY_LINES.m} أمّا $y = x + 0{,}5$ فلا تشمل O، و $x = 0{,}5y$ تعطي لـ A الترتيب 2.`}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="tamthil-nashat" lead="ما رسمته، بكلمات الكتاب:" />}
            </div>
          ),
        },
        {
          num: 5, title: 'الزالق', subtitle: 'أوظّف تكنولوجيات الإعلام والاتصال — ص 76', done: q5,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" title="الزالق (جيوجيبرا)" text={ICT.question} source={ICT.source} compact />
              <p className="text-xs text-slate-600"><MathText>{ICT_PLATFORM.text}</MathText> <SourceTag source={ICT_PLATFORM.source} /></p>
              {linesEvidence}
              <TapQuestion
                prompt={<MathText>{'المستقيم الذي يمثّل دالة خطية معاملها $a$ يشمل دائمًا O، و:'}</MathText>}
                options={[
                  'إذا كان $a > 0$ يصعد من اليسار إلى اليمين، وإذا كان $a < 0$ ينزل.',
                  'إذا كان $a > 0$ ينزل من اليسار إلى اليمين، وإذا كان $a < 0$ يصعد.',
                  'منحاه لا يتعلّق بإشارة $a$ ، بل بقيمته فقط.',
                ].map(Opt)}
                correct={0}
                cols={1}
                requires={['tamthil-nashat']}
                explain={<MathText>{`${ICT.answer} المبدأ O لا يتحرّك أبدًا.`}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'رسمت مستقيمًا يشمل O بنقطة واحدة أخرى، وقرأت عليه ترتيب نقطة، ورأيته يصعد أو ينزل. المحور التالي يعطي هذا كلّه اسمه في الكتاب: التمثيل البياني لدالة خطية ومعامل توجيهه.'}</MathText>
                </p>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
