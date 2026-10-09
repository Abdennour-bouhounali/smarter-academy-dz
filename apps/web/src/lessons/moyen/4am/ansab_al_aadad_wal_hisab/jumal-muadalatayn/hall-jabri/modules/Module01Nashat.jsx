import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag, PairQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, HOOK } from '../content/textbook';
import KioskVignette from '../components/KioskVignette';

/**
 * Module 1 — نشاط 2 (p. 56) : « حل جملة معادلتين من الدرجة الأولى بمجهولين جبريا », ouvert sur
 * les CARTES DU KIOSQUE (elimination-cards).
 *
 * REAL → l'accroche : les deux cartes du vendeur (2x + y = 70 ; 3x − 2y = 42), que tester des
 * prix un à un ne résout pas. DISCOVER / MANIPULATE → le laboratoire à deux niveaux, UN instrument,
 * même objectif (faire disparaître une inconnue, puis revenir chercher l'autre) :
 *   متقدم (ouvert par défaut : c'est la jumla du نشاط 2) : 2x + y = 7 ; 3x − 2y = 4,2 — isoler
 *          y = 7 − 2x (التلميذ 1) ou multiplier (1) par 2 (التلميذ 2) : les deux sont à faire ;
 *   مبتدئ : x + y = 10 ; x − y = 2 (plateforme) — les y sont déjà opposés.
 * UNDERSTAND → أ) et ب) montrent qu'essayer des ثنائيات ne finit pas ; جـ 1) explique les deux
 * élèves avec, au-dessus de la question, ce que l'élève a LUI-MÊME écrit dans les cartes
 * (`[data-activity-evidence]`) ; TOUCH THE MATH → les briques takhallus-majhul et hall-thunaiya
 * nomment ce que la main a fait ; جـ 2) applique les deux méthodes ; TRANSFER → retour au kiosque.
 * AUCUNE étape n'attend `onFinished`. LP : P1, P2.
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

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 — تلميذان وطريقتان"
      moduleSubtitle="نجعل مجهولًا يختفي"
      estimatedTime="16 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 56',
        headline: HOOK.headline,
        emoji: '🥤',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <KioskVignette />,
        body: (
          <div className="space-y-2">
            <p><MathText>{HOOK.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'في الكتاب جملة من النوع نفسه: $\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 4{,}2 \\end{cases}$ . في البطاقتين أدناه، اجعل أحد المجهولين يختفي — مرّة بالتعويض ومرّة بالجمع.'}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={HOOK.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="نفس الفكرة في المستويين: لا نجرّب الثنائيات واحدة واحدة، بل نجعل أحد المجهولين يختفي، ثم نعود لنجد الآخر."
          levels={{
            beginner: () => (
              <Manipulation
                type="elimination-cards"
                level="beginner"
                system={BEGINNER}
                lead="مجموع عددين 10 وفرقهما 2: هل ترى حدّين يمكن أن يُلغي أحدهما الآخر؟"
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="elimination-cards"
                level="advanced"
                system={ADVANCED}
                title="جملة النشاط 2: 2x + y = 7 و 3x − 2y = 4,2"
                lead="افعل ما فعله التلميذ 1 (التعويض)، ثم ما فعله التلميذ 2 (الجمع): هل تجد الثنائية نفسها؟"
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ثنائية تحقق معادلة واحدة', subtitle: 'السؤال أ', done: q1,
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
          num: 2, title: 'ثنائية أخرى', subtitle: 'السؤال ب', done: q2,
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
                  <MathText>{'للمعادلة (1) وحدها ثنائيات كثيرة: $(0 ; 7)$ ، $(1 ; 5)$ ، $(3 ; 1)$ … وتجريبها واحدة واحدة لا ينتهي. التلميذان في السؤال جـ لم يجرّبا: جعلا أحد المجهولين يختفي — كما تفعل بالبطاقتين في الأعلى.'}</MathText>
                </p>
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'عمل التلميذين', subtitle: 'السؤال جـ 1 — جرّب الطريقتين في المستوى المتقدّم، ثم أجب', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <div className="grid gap-2 sm:grid-cols-2">
                <TextbookBox kind="example" title="التلميذ 1" lines={ACTIVITY.students[1]} source={ACTIVITY.source} compact />
                <TextbookBox kind="example" title="التلميذ 2" lines={ACTIVITY.students[2]} source={ACTIVITY.source} compact />
              </div>
              {/* CE QUE L'ÉLÈVE A ÉCRIT dans les cartes (niveau متقدم), et rien d'autre. */}
              <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={mine ? 'true' : 'false'}>
                {!mine || mine.attempts.length === 0 ? (
                  <p className="text-slate-500">لم تحلّ جملة النشاط بالبطاقتين بعد (المستوى المتقدّم).</p>
                ) : (
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
          num: 4, title: 'حل الجملة', subtitle: 'السؤال جـ 1 — واستنتج حل الجملة', done: q4,
          content: (
            <div className="space-y-3">
              <PairQuestion
                prompt={<MathText>{'استنتج حل الجملة $\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 4{,}2 \\end{cases}$ :'}</MathText>}
                expected={{ x: '2,6', y: '1,8' }}
                requires={['takhallus-majhul']}
                explain={'$7x = 18{,}2$ أي $x = 2{,}6$ ، و $y = 7 - 2 \\times 2{,}6 = 1{,}8$ .'}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="hall-thunaiya" lead="لا نتوقّف عند x:" />}
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
