import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, PairQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, HOOK } from '../content/textbook';
import KioskVignette from '../components/KioskVignette';

/**
 * Module 1 — نشاط 2 (p. 56) : « حل جملة معادلتين من الدرجة الأولى بمجهولين جبريا », ouvert sur
 * les CARTES DU KIOSQUE (elimination-cards).
 *
 * Rétrofit 2026-10-15 (§4quater) : le labo OUVRE le module (plus de carte « لغز الكشك » au-dessus, plus de
 * titre / `lead` de workspace). Le labo à deux niveaux, UN instrument, même objectif (faire disparaître une
 * inconnue, puis revenir chercher l'autre) : متقدم = la jumla du نشاط 2 (2x + y = 7 ; 3x − 2y = 4,2) ;
 * مبتدئ = x + y = 10 ; x − y = 2 (plateforme, kiosque). Puis, sur ce que l'élève a FAIT :
 *   1. pourquoi chaque élève du livre écrit sa ligne (جـ 1, avec ses propres essais en preuve) → brique takhallus-majhul ;
 *   2. pourquoi on ne s'arrête pas à x (la ثنائية se retrouve dans (2) comme dans (1)) → brique hall-thunaiya ;
 *   3–4. أ) et ب) : une ثنائية qui vérifie UNE équation n'est pas une solution, et essayer ne finit pas ;
 *   5. جـ 2 : les deux méthodes sur une autre jumla ; 6. l'énigme du kiosque (HOOK) en transfert.
 * AUCUNE étape n'attend `onFinished` ni `onTrial`. LP : P1, P2.
 */
const BEGINNER = 'x+y=10|x-y=2';
const ADVANCED = ACTIVITY.systems.main;
const M = (s) => <MathText key={s}>{s}</MathText>;
const YN = ['نعم', 'لا'];

export default function Module01Nashat() {
  const [trial, setTrial] = useState({ [BEGINNER]: null, [ADVANCED]: null });
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5a, setQ5a] = useState(false);
  const [q5, setQ5] = useState(false);
  const [q6a, setQ6a] = useState(false);
  const [q6, setQ6] = useState(false);
  const onTrial = (sys) => (summary) => setTrial((t) => ({ ...t, [sys]: summary }));
  const mine = trial[ADVANCED];
  const first = trial[BEGINNER];

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 — تلميذان وطريقتان"
      moduleSubtitle="نجعل مجهولًا يختفي"
      objectives={['كيف نجد ثمنين مجهولين من بطاقتين فقط؟', 'ماذا يفعل كل تلميذ ليصل إلى مجهول واحد؟', 'هل تكفي معادلة واحدة لمعرفة الثمنين؟']}
      estimatedTime="16 دقيقة"
      intro={
        // LE LABO OUVRE LE MODULE (§4quater) : ni carte du kiosque, ni titre / `lead` de workspace. Le contexte tient dans le `lead`
        // de chaque niveau ; la question est celle du labo. L'énigme du kiosque (HOOK) revient à l'étape 6, en transfert.
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="elimination-cards"
                level="beginner"
                system={BEGINNER}
                lead="على كشك عمّي الطاهر بطاقتان: مجموع ثمنين 10 وفرقهما 2."
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="elimination-cards"
                level="advanced"
                system={ADVANCED}
                lead="جملة نشاط الكتاب على البطاقتين: كل بطاقة وحدها تقبل أثمانًا كثيرة، والبطاقتان معًا تحدّدان الثمنين."
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا كتب كل تلميذ سطره؟', subtitle: 'السؤال جـ 1 — بعد أن جرّبت البطاقتين', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <div className="grid gap-2 grid-cols-2">
                <TextbookBox kind="example" title="التلميذ 1" lines={ACTIVITY.students[1]} source={ACTIVITY.source} compact />
                <TextbookBox kind="example" title="التلميذ 2" lines={ACTIVITY.students[2]} source={ACTIVITY.source} compact />
              </div>
              {/* CE QUE L'ÉLÈVE A ÉCRIT dans les cartes (niveau متقدم), et rien d'autre. */}
              <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={mine ? 'true' : 'false'}>
                {mine && mine.attempts.length > 0 ? (
                  <ul className="space-y-2" data-evidence="attempts">
                    {mine.attempts.map((a, i) => (
                      <li key={i} data-evidence-method={a.method}>
                        <p className="font-bold text-slate-700">{a.method === 'sub' ? 'بالتعويض (مثل التلميذ 1)' : 'بالجمع (مثل التلميذ 2)'}</p>
                      </li>
                    ))}
                    <li className="space-y-0.5 border-t border-slate-100 pt-1">
                      <p className="text-xs text-slate-500">آخر ما كتبته:</p>
                      {mine.lines.map((l, i) => <p key={i} dir="ltr" className="text-start"><MathText>{`$${l}$`}</MathText></p>)}
                    </li>
                  </ul>
                ) : first ? (
                  <p className="text-slate-600">حللتَ بطاقتَي المستوى المبتدئ{first.pairTex ? <> وبلغتَ <MathText>{`$${first.pairTex}$`}</MathText></> : null}. افتح المستوى المتقدّم لتجرّب الطريقتين على جملة الكتاب.</p>
                ) : (
                  <p className="text-slate-500">لم تحلّ البطاقتين بعد: جرّبهما في المناولة أعلاه.</p>
                )}
              </div>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[3]}</MathText></p>}
                rows={[
                  { id: 's1', label: M('التلميذ 1 كتب $3x - 2(7 - 2x) = 4{,}2$ لأنه'),
                    options: [M('عبّر عن $y$ بدلالة $x$ من المعادلة (1): $y = 7 - 2x$ ، ثم عوّض $y$ في المعادلة (2)'), M('ضرب طرفي المعادلة (2) في $-2$'), M('عوّض $y$ بالعبارة $7 - 2x$ في المعادلة (1) نفسها')],
                    correct: 0,
                    correction: M('من $2x + y = 7$ ينتج $y = 7 - 2x$ ، وكل $y$ في $3x - 2y = 4{,}2$ يصير $7 - 2x$ . في المعادلة (1) نفسها نجد $2x + 7 - 2x = 7$ أي $7 = 7$ : لا نتعلّم شيئًا.') },
                  { id: 's2', label: 'التلميذ 2 ضرب المعادلة (1) في العدد 2 لأنّ',
                    options: [M('معاملي $y$ يصيران $2y$ و $-2y$ ، متعاكسين، فيختفي $y$ بالجمع طرفًا لطرف'), M('معاملي $x$ يصيران متساويين'), M('يكفي أن نضرب الطرف الأول $2x + y$ وحده')],
                    correct: 0,
                    correction: M('$4x + 2y = 14$ و $3x - 2y = 4{,}2$ : بالجمع $2y - 2y = 0$ ويبقى $7x = 18{,}2$ . ويُضرب الطرفان معًا: $7 \\times 2 = 14$ .') },
                ]}
                requires={['naql-hudud', 'darb-tarafayn']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight ? 'صحيح: هذا ما كتبه كل من التلميذين.' : 'أعد قراءة سطري التلميذين: ماذا صار $y$ في كل منهما؟'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="takhallus-majhul" lead="ما فعله التلميذان، وما فعلته بالبطاقتين:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'لماذا لا نتوقّف عند x؟', subtitle: 'السؤال جـ 1 — ونستنتج حل الجملة', done: q4,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'وجد التلميذان $x = 2{,}6$ ، وعوّضا في المعادلة (1) فوجدا $y = 1{,}8$ . لو عوّضنا $x = 2{,}6$ في المعادلة (2) $3x - 2y = 4{,}2$ بدل (1) لوجدنا:'}</MathText>}
                options={[
                  M('$y = 1{,}8$ كذلك: الثنائية نفسها تحقق المعادلتين'),
                  M('قيمة أخرى لـ $y$ ، فنختار إحدى القيمتين'),
                  M('لا نستطيع إيجاد $y$ ، فالعدد $x$ وحده يكفي')]}
                correct={0}
                cols={1}
                explain={<MathText>{'$3 \\times 2{,}6 = 7{,}8$ ، و $7{,}8 - 2y = 4{,}2$ تعطي $2y = 3{,}6$ أي $y = 1{,}8$ . الثنائية $(2{,}6 ; 1{,}8)$ تحقق المعادلتين في آن واحد، وهذا ما يجعلها حل الجملة.'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="hall-thunaiya" lead="لا نتوقّف عند x:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'هل تكفي معادلة واحدة؟', subtitle: 'السؤال أ — ثنائية تحقق (1)', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.text} source={ACTIVITY.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[0]}</MathText></p>}
                rows={[
                  { id: 'a1', label: M('$(2 ; 3)$ حل للمعادلة (1) $2x + y = 7$ ؟'), options: YN, correct: 0, correction: M('$2 \\times 2 + 3 = 4 + 3 = 7$ : المعادلة (1) محققة.') },
                  { id: 'a2', label: 'هل هي حل لجملة المعادلتين؟', options: YN, correct: 1, correction: M('$3 \\times 2 - 2 \\times 3 = 6 - 6 = 0$ و $0 \\neq 4{,}2$ : المعادلة (2) غير محققة، فليست حلا للجملة.') },
                ]}
                requires={['taawid-qima']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{'حل الجملة ثنائية تحقق المعادلتين في آن واحد: $(2 ; 3)$ تحقق (1) وحدها.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'ثنائية أخرى للمعادلة (1)', subtitle: 'السؤال ب', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{`${ACTIVITY.questions[1]} — أيّ ثنائية مما يلي حل للمعادلة (1)؟`}</MathText>}
                options={[M('$(3 ; 1)$'), M('$(1 ; 3)$'), M('$(7 ; 0)$')]}
                correct={0}
                cols={3}
                requires={['taawid-qima']}
                explain={<MathText>{'$2 \\times 3 + 1 = 7$ : $(3 ; 1)$ حل للمعادلة (1). لكنّ $3 \\times 3 - 2 \\times 1 = 7 \\neq 4{,}2$ : ليست حلا للجملة. أمّا $(1 ; 3)$ فتعطي $2 + 3 = 5$ ، و $(7 ; 0)$ تعطي $14$ .'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && (
                <p className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                  <MathText>{'للمعادلة (1) وحدها ثنائيات كثيرة: $(0 ; 7)$ ، $(1 ; 5)$ ، $(3 ; 1)$ … وتجريبها واحدة واحدة لا ينتهي. لهذا لم تجرّب الأثمان في البطاقتين: جعلتَ أحد المجهولين يختفي.'}</MathText>
                </p>
              )}
            </div>
          ),
        },
        {
          num: 5, title: 'الطريقتان على جملة أخرى', subtitle: 'السؤال جـ 2', done: q5,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.questions[4]} source={ACTIVITY.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">السطر الأول في كل طريقة:</p>}
                rows={[
                  { id: 'c1', label: 'بطريقة التعويض، من المعادلة الأولى:', options: [M('$x = 7 - 4y$'), M('$x = 7 + 4y$'), M('$y = 7 - x$')], correct: 0,
                    correction: M('نطرح $4y$ من طرفي $x + 4y = 7$ : $x = 7 - 4y$ . ثم $5(7 - 4y) + 3y = 1$ أي $35 - 17y = 1$ .') },
                  { id: 'c2', label: M('بطريقة الجمع، لنتخلّص من $x$ نضرب المعادلة الأولى في'), options: [M('$-5$'), M('$5$'), M('$3$')], correct: 0,
                    correction: M('$-5x - 20y = -35$ ، وبالجمع مع $5x + 3y = 1$ : $-17y = -34$ . بالعدد 5 يصير المعاملان $5x$ و $5x$ : متساويان، لا متعاكسان.') },
                ]}
                requires={['takhallus-majhul']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight ? 'الطريقتان تعطيان $y = 2$ .' : 'في التعويض ننقل الحدّ بتغيير إشارته؛ وفي الجمع نريد معاملين متعاكسين.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ5a(true)}
              />
              {q5a && (
                <PairQuestion
                  prompt={<MathText>{'حل الجملة $\\begin{cases} x + 4y = 7 \\\\ 5x + 3y = 1 \\end{cases}$ :'}</MathText>}
                  expected={{ x: '-1', y: '2' }}
                  requires={['takhallus-majhul', 'hall-thunaiya']}
                  explain={'$y = 2$ ، ثم $x = 7 - 4 \\times 2 = -1$ . للتحقق: $-1 + 4 \\times 2 = 7$ و $5 \\times (-1) + 3 \\times 2 = 1$ . الحل $(-1 ; 2)$ .'}
                  onAnswered={() => setQ5(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 6, title: 'لغز الكشك', subtitle: 'نعود إلى البطاقتين', done: q6,
          content: (
            <div className="space-y-3">
              <div className="flex justify-center"><KioskVignette /></div>
              <TextbookBox kind="situation" title={HOOK.headline} lines={[HOOK.text, HOOK.unknowns]} source={HOOK.source} compact />
              <TapQuestion
                prompt="أيّ جملة تترجم بطاقتي البائع؟"
                options={[
                  M('$\\begin{cases} 2x + y = 70 \\\\ 3x - 2y = 42 \\end{cases}$'),
                  M('$\\begin{cases} x + 2y = 70 \\\\ 3x - 2y = 42 \\end{cases}$'),
                  M('$\\begin{cases} 2x + y = 70 \\\\ 2y - 3x = 42 \\end{cases}$'),
                ]}
                correct={0}
                cols={1}
                requires={['takhallus-majhul']}
                explain={<MathText>{'قطعتا كرنتيكة $2x$ وقارورة $y$ : $2x + y = 70$ ؛ ثمن 3 قطع $3x$ يزيد بـ 42 عن ثمن قارورتين $2y$ : $3x - 2y = 42$ .'}</MathText>}
                onAnswered={() => setQ6a(true)}
              />
              {q6a && (
              <PairQuestion
                prompt={<MathText>{`حلّ جملة الكشك $${HOOK.systemTex}$ :`}</MathText>}
                expected={HOOK.answer}
                requires={['takhallus-majhul', 'hall-thunaiya']}
                explain={HOOK.closing}
                onAnswered={() => setQ6(true)}
              />
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
