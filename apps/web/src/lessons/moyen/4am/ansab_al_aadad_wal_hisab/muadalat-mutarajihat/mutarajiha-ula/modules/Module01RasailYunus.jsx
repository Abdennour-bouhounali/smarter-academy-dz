import React, { useState } from 'react';
import { linear as Lin } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 3, première partie (p. 45) : « المتراجحة وحلولها », les messages d'يونس.
 *
 * LE LABORATOIRE (solution-ray, contexte `phone`, sans crochet) est posé UNE fois sur les
 * nombres du livre : 2,5x + 100 ≤ 150, x entier (un nombre de messages). L'élève étire x,
 * la kalfa et le رصيد se comparent sous son doigt, chaque essai laisse une trace rouge
 * (la kalfa ne dépasse pas le رصيد) ou grise. Les graduations 16, 20 et 21 du livre sont
 * soulignées (orientation, jamais des réponses). L'atelier à deux niveaux du type est au
 * module 2 : ici, la question est « quels x conviennent ? ».
 *
 * AUCUNE étape n'attend `onFinished` : `onTrial` liste, au-dessus des questions, les essais
 * de l'élève (`[data-activity-evidence]`, DNA §9). Le vocabulaire « متراجحة » et « حل »
 * n'arrive qu'avec l'encadré du livre, posé en briques (mutarajiha, hal-mutarajiha).
 *
 * Étapes : (1) س 1 : 21, 20, 16 rasā'il ; (2) س 2 أ et ب : quelle متباينة, et deux valeurs ;
 * (3) l'encadré « متراجحة » ; (4) l'encadré « حل » et س جـ : 2 et 21. LP : P1.
 *
 * La « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire) ferme la dernière étape : le même رصيد de téléphone
 * sur le même instrument, d'autres nombres (600 دج, 3 دج la رسالة, 200 دج au moins) et la
 * division par un négatif de l'atelier متقدم du module 2 — résolue au module 6.
 */
const COST = Lin.linear('2,5x+100');
const CREDIT = ACTIVITY.numbers.credit;
const cost = (n) => Lin.linAt(COST, Lin.frac(n));
const costText = (n) => (Lin.fracDecimal(cost(n), 2) ?? Lin.fracText(cost(n)));
const costTex = (n) => costText(n).replace(',', '{,}');
const fits = (n) => Lin.compareWith(cost(n), '<=', Lin.frac(CREDIT));
const CAN = ['يمكنه', 'لا يمكنه'];
const IS_SOL = ['حلّ', 'ليس حلًّا'];

export default function Module01RasailYunus() {
  const [tried, setTried] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2b, setQ2b] = useState(false);
  const [q2c, setQ2c] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  const onTrial = (e) => {
    if (e.kind !== 'trace') return;
    setTried((t) => [...t.filter((u) => u.k !== e.k), { k: e.k, ok: e.ok }].sort((a, b) => a.k - b.k));
  };

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {tried.length === 0
        ? <li className="text-slate-500" data-evidence="none" data-tried="false">لم تجرّب بعد: اسحب عدد الرسائل في المختبر أعلاه.</li>
        : tried.map(({ k, ok }) => (
          <li key={k} data-evidence={k} data-tried="true" className={ok ? 'text-red-900' : 'text-slate-600'}>
            <MathText>{`$x = ${k}$ : $2{,}5 \\times ${k} + 100 = ${costTex(k)}$ ، ${ok ? `ولا يتجاوز ${CREDIT}DA ●` : `أي أكثر من ${CREDIT}DA ○`}`}</MathText>
          </li>
        ))}
    </ul>
  );

  return (
    <ContentModule
      objectives={["هل يستطيع يونس أن يرسل 21 رسالة؟ و 20؟ و 16؟", "ماذا نسمّي كتابة فيها مجهول وإشارة ≤ ؟", "متى نقول إنّ عددًا حلّ لها؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — رسائل يونس"
      moduleSubtitle="المتراجحة وحلولها"
      estimatedTime="9 دقائق"
      brief={{
        tag: 'أنشطة — الكتاب ص 45',
        headline: 'رصيد العيد: 150 دينارًا فقط!',
        emoji: '📱',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: <p><MathText>{ACTIVITY.text}</MathText></p>,
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={(
        <Manipulation
          type="solution-ray"
          ineq={ACTIVITY.ineq}
          context="phone"
          bracket={false}
          levels={false}
          marks={ACTIVITY.numbers.asked}
          lead="كل رسالة تزيد الكلفة 2,5DA فوق الاقتطاع الجزافي: جرّب أعدادًا من الرسائل، منها 16 و 20 و 21."
          onTrial={onTrial}
        />
      )}
      steps={[
        {
          num: 1, title: 'هل يمكن ليونس أن يرسل…؟', subtitle: 'السؤال 1 — جرّب في المختبر، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[0]}</MathText></p>}
                rows={ACTIVITY.numbers.asked.map((n) => ({
                  id: `m${n}`, label: `${n} رسالة`, options: CAN, correct: fits(n) ? 0 : 1,
                  correction: <MathText>{`$2{,}5 \\times ${n} + 100 = ${costTex(n)}$ : ${fits(n) ? `لا يتجاوز ${CREDIT}DA` : `يتجاوز ${CREDIT}DA`}.`}</MathText>,
                }))}
                requires={['muqarana-adad']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'الكلفة هي $2{,}5$ مضروبًا في عدد الرسائل، زائد 100: نقارنها بـ 150.'
                      : 'احسب الكلفة: $2{,}5$ في عدد الرسائل ثم أضف 100، وقارن بالرصيد 150.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'أيّ متباينة توافق رغبة يونس؟', subtitle: 'السؤال 2', done: q2a && q2b && q2c,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{ACTIVITY.questions[1]}</MathText>}
                options={[
                  <MathText key="a">{'$150x + 100 \\leq 2{,}5$'}</MathText>,
                  <MathText key="b">{'$150x - 100 \\leq 2{,}5$'}</MathText>,
                  <MathText key="c">{'$2{,}5x + 100 \\leq 150$'}</MathText>,
                ]}
                correct={2}
                cols={1}
                requires={['muqarana-adad']}
                explain={<MathText>{'الكلفة $2{,}5x + 100$ يجب ألّا تتجاوز الرصيد 150: $2{,}5x + 100 \\leq 150$. في المتباينتين الأخريين بُدّل دور 150 و $2{,}5$.'}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <>
                  <p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[2]}</MathText></p>
                  {evidence}
                  <NumericQuestion
                    prompt="قيمة لـ x توافق رغبة يونس:"
                    expected={(n) => Number.isInteger(n) && n >= 0 && fits(n)}
                    display="عدد طبيعي من 0 إلى 20"
                    requires={['muqarana-adad']}
                    explainFor={(n) => (Number.isInteger(n) && n >= 0
                      ? <MathText>{`$2{,}5 \\times ${n} + 100 = ${costTex(n)}$ : ${fits(n) ? 'لا يتجاوز 150، القيمة توافق.' : 'يتجاوز 150، القيمة لا توافق.'}`}</MathText>
                      : <span>عدد الرسائل عدد طبيعي: 0، 1، 2، …</span>)}
                    onAnswered={() => setQ2b(true)}
                  />
                  <NumericQuestion
                    prompt="قيمة أخرى لـ x لا توافقها:"
                    expected={(n) => Number.isInteger(n) && n >= 0 && !fits(n)}
                    display="عدد طبيعي أكبر من 20"
                    requires={['muqarana-adad']}
                    explainFor={(n) => (Number.isInteger(n) && n >= 0
                      ? <MathText>{`$2{,}5 \\times ${n} + 100 = ${costTex(n)}$ : ${fits(n) ? 'لا يتجاوز 150، فهذه القيمة توافق رغبة يونس.' : 'يتجاوز 150، القيمة لا توافق.'}`}</MathText>
                      : <span>عدد الرسائل عدد طبيعي: 0، 1، 2، …</span>)}
                    onAnswered={() => setQ2c(true)}
                  />
                </>
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'متباينة بمجهول', subtitle: 'ما يسمّيه الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="mutarajiha" lead="المتباينات الثلاث في السؤال 2 فيها المجهول x — يسمّيها الكتاب:" />
              <TapQuestion
                prompt={<MathText>{'والكتابة $2{,}5 \\times 16 + 100 \\leq 150$ (حين عوّضت $x$ بالعدد 16)؟'}</MathText>}
                options={[
                  <MathText key="a">{'متراجحة ذات المجهول $x$'}</MathText>,
                  <MathText key="b">{'متباينة عددية صحيحة: لا مجهول فيها'}</MathText>,
                  <MathText key="c">{'متباينة عددية خاطئة'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['mutarajiha']}
                explain={<MathText>{'بعد التعويض لم يبقَ مجهول: $2{,}5 \\times 16 + 100 = 140$ و $140 \\leq 150$ متباينة صحيحة. المتراجحة $2{,}5x + 100 \\leq 150$ قد تكون صحيحة أو خاطئة حسب قيمة $x$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'هل العدد حلّ للمتراجحة؟', subtitle: 'السؤال جـ', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hal-mutarajiha" lead="ونقاطك الحمراء لها اسم أيضًا:" />
              <TextbookBox kind="definition" lines={ACTIVITY.box} source={ACTIVITY.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[3]}</MathText></p>}
                rows={ACTIVITY.numbers.tests.map((n) => ({
                  id: `s${n}`, label: <MathText>{`العدد ${n}`}</MathText>, options: IS_SOL, correct: fits(n) ? 0 : 1,
                  correction: <MathText>{`$2{,}5 \\times ${n} + 100 = ${costTex(n)}$ و $${costTex(n)} \\leq 150$ ${fits(n) ? 'متباينة صحيحة: العدد حلّ.' : 'متباينة خاطئة: العدد ليس حلًّا.'}`}</MathText>,
                }))}
                requires={['hal-mutarajiha']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'نعوّض $x$ بالعدد، فإن كانت المتباينة الناتجة صحيحة فالعدد حلّ للمتراجحة.'
                      : 'عوّض $x$ بالعدد واحسب: هل المتباينة العددية الناتجة صحيحة؟'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
