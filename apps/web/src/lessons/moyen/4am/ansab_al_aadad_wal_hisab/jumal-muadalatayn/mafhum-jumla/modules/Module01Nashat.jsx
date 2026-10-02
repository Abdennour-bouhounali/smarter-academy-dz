import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag, PairQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, ACT_A_OPTIONS, CHALLENGE, HOOK } from '../content/textbook';
import ChallengeVignette from '../components/ChallengeVignette';

/**
 * Module 1 — نشاط 1 (p. 56) : « جملة معادلتين من الدرجة الأولى بمجهولين », ouvert sur le TABLEAU
 * DES DEUX CONDITIONS (pair-scoreboard).
 *
 * REAL      la carte d'activité pose le تحدّ de la page d'ouverture (37 pièces, 610DA pour décorer
 *           la classe) : deux conditions à la fois — puis le نشاط 1, au mot près.
 * DISCOVER / MANIPULATE   le lab à deux niveaux, UN instrument, même objectif :
 *   متقدم (ouvert par défaut : c'est le نشاط 1) : 32 agents, x hommes et y femmes ; la jauge (2)
 *          lit l'APRÈS (5 hommes et 3 femmes partis) : 2(x − 5) = y − 3 ;
 *   مبتدئ : la carte de saison d'un club (plateforme) — 10 matchs sans défaite, 22 points.
 * UNDERSTAND  س أ se décide sur les jauges : la table des essais de l'élève (`onTrial`) est
 *           affichée au-dessus de la question (`[data-activity-evidence]`) ; س ب la traduction, س جـ
 *           la simplification et les deux vérifications du livre.
 * TOUCH / FORMALIZE  la brique jumla-nashat (« نقول أنّ … ») nomme ce que les jauges ont montré.
 * TRANSFER  س د puis le تحدّ : le MÊME tableau, monde de la cagnotte (posé seul, un niveau).
 * AUCUNE étape n'attend `onFinished`. LP : P2, P3 (et P1 nommé par la brique).
 */
const BEGINNER = 'x+y=10|3x+y=22';
const ADVANCED = ACTIVITY.system;

const Opt = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState({ [BEGINNER]: [], [ADVANCED]: [] });
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const onTrial = (sys) => (tr) => setTrials((t) => ({ ...t, [sys]: [...t[sys].filter((p) => p.pair !== tr.pair), tr] }));
  const mine = trials[ADVANCED];

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={mine.length ? 'true' : 'false'}>
      {mine.length === 0 ? (
        <p className="text-slate-500">لم تجرّب أي ثنائية بعد على لوحة الشرطين (المستوى المتقدّم).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">ثنائياتك على لوحة العمّال:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="trials">
            {mine.slice(-10).map((tr) => (
              <li key={tr.pair} data-evidence-trial={tr.pair} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-800">
                <bdi dir="ltr" className="font-mono">{tr.pair}</bdi>{' '}
                (1) <span className={tr.ok1 ? 'text-emerald-700' : 'text-rose-700'}>{tr.ok1 ? '✓' : '✗'}</span>{' '}
                (2) <span className={tr.ok2 ? 'text-emerald-700' : 'text-rose-700'}>{tr.ok2 ? '✓' : '✗'}</span>
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
      moduleTitle="نشاط 1 — 32 عاملا وشرطان"
      moduleSubtitle="ثنائية تحقّق شرطين في آن واحد"
      estimatedTime="16 دقيقة"
      brief={{
        tag: 'تحدّ ص 55 · أنشطة — الكتاب ص 56',
        headline: HOOK.headline,
        emoji: '🪙',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <ChallengeVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800"><MathText>{CHALLENGE.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{HOOK.text}</MathText></p>
            <p><MathText>{ACTIVITY.text}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={CHALLENGE.source} /><SourceTag source={ACTIVITY.source} /><SourceTag source={HOOK.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="في المستويين ثنائية من عددين تحرّكهما بيدك، ولوحتان تقرأ كل منهما شرطًا. متى تقبل اللوحة أنّ ثنائيتك حل؟"
          levels={{
            beginner: () => (
              <Manipulation
                type="pair-scoreboard"
                level="beginner"
                system={BEGINNER}
                theme="football"
                title="بطاقة الموسم: 10 مباريات و 22 نقطة"
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="pair-scoreboard"
                level="advanced"
                system={ADVANCED}
                theme="staff"
                title="نشاط 1: 32 عاملا قبل التقاعد وبعده"
                lead="جرّب عدة ثنائيات، منها ما يقترحه الكتاب: 24 رجلا و 8 نساء، واقرأ اللوحتين."
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: '24 رجلا و 8 نساء؟', subtitle: 'السؤال أ', done: q1,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              {evidence}
              <TapQuestion
                prompt={<MathText>{'جرّب الثنائية $(24 ; 8)$ على لوحة العمّال إن لم تفعل، ثم اختر:'}</MathText>}
                options={ACT_A_OPTIONS.map(Opt)}
                correct={1}
                cols={1}
                requires={['taawid-majhulayn']}
                explain={<MathText>{ACTIVITY_LINES.a}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'الترجمة بمعادلتين', subtitle: 'السؤال ب', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[1]}</MathText></p>
              <p className="text-sm text-slate-600"><MathText>{'عدد العمّال قبل التقاعد: $x + y = 32$ ، وهي المعادلة (1).'}</MathText></p>
              <TapQuestion
                prompt="«فأصبح عدد النساء بالمصلحة ضعف عدد الرجال»: أي معادلة تترجم هذه الجملة؟"
                options={['$2(x - 5) = y - 3$', '$2x - 5 = y - 3$', '$x - 5 = 2(y - 3)$', '$2(x - 3) = y - 5$'].map(Opt)}
                correct={0}
                cols={2}
                requires={['hal-muadala-ula']}
                explain={<MathText>{`${ACTIVITY_LINES.b} أمّا $2x - 5$ فتطرح 5 من ضعف عدد الرجال، و $x - 5 = 2(y - 3)$ تجعل الرجال ضعف النساء.`}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'بسّط ثم تحقّق', subtitle: 'السؤال جـ', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'المعادلة (2) $2(x - 5) = y - 3$ تُبسَّط إلى:'}</MathText>}
                options={['$2x - y = 7$', '$2x - y = 13$', '$2x + y = 7$', '$2x - y = -7$'].map(Opt)}
                correct={0}
                cols={2}
                requires={['hal-muadala-ula']}
                explain={<MathText>{ACTIVITY_LINES.c}</MathText>}
                onAnswered={() => setQ3a(true)}
              />
              {q3a && (
                <BatchChoiceQuestion
                  intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'المعادلتان $x + y = 32$ و $2x - y = 7$ من أجل الثنائيتين — قارن بما قرأته على اللوحتين:'}</MathText></p>}
                  rows={[
                    { id: 'p13', label: <MathText>{'$x = 13$ و $y = 19$'}</MathText>, options: ['محقّقتان معًا', 'غير محقّقتين معًا'], correct: 0, correction: <MathText>{ACTIVITY_LINES.check13}</MathText> },
                    { id: 'p24', label: <MathText>{'$x = 24$ و $y = 8$'}</MathText>, options: ['محقّقتان معًا', 'غير محقّقتين معًا'], correct: 1, correction: <MathText>{ACTIVITY_LINES.check24}</MathText> },
                  ]}
                  requires={['taawid-majhulayn']}
                  feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'هذا ما قرأته على اللوحتين.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                  onAnswered={() => setQ3(true)}
                />
              )}
              {q3 && <KnowledgeBrick id="jumla-nashat" lead="ما قبلته اللوحتان معًا، بكلمات الكتاب:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'عدد الرجال وعدد النساء', subtitle: 'السؤال د', done: q4,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[3]}</MathText></p>
              <PairQuestion
                prompt={<MathText>{'اكتب الثنائية $(x ; y)$ : عدد الرجال ثم عدد النساء قبل الإحالة على التقاعد.'}</MathText>}
                expected={ACTIVITY.answer}
                requires={['jumla-nashat']}
                explain={ACTIVITY_LINES.d}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'تحدّ القسم', subtitle: 'الشرطان نفساهما، بالقطع النقدية', done: q5,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" title="تحدّ" text={CHALLENGE.text} source={CHALLENGE.source} compact />
              <p className="text-sm text-slate-700"><MathText>{CHALLENGE.unknowns}</MathText></p>
              <Manipulation
                type="pair-scoreboard"
                system={CHALLENGE.system}
                theme="coins"
                levels={false}
                title="تحدّ القسم: 37 قطعة و 610DA"
              />
              <PairQuestion
                prompt={<MathText>{'عدد قطع 20DA ثم عدد قطع 10DA: الثنائية $(x ; y)$ ='}</MathText>}
                expected={CHALLENGE.answer}
                requires={['jumla-nashat']}
                explain="$24 + 13 = 37$ قطعة، و $20 \times 24 + 10 \times 13 = 480 + 130 = 610$ DA : الشرطان محقّقان في آن واحد."
                onAnswered={() => setQ5(true)}
              />
              {q5 && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'في النشاط وفي التحدّي معادلتان بمجهولين، وثنائية واحدة تحقّقهما معًا. المحور التالي يعطي هذا الشكل اسمه، ويقول متى تكون ثنائية حلا — ومتى لا يكون للجملة حل وحيد.'}</MathText>
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
