import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, PairQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, CHALLENGE } from '../content/textbook';
import ChallengeVignette from '../components/ChallengeVignette';

/**
 * Module 1 — نشاط 1 (p. 56) : « جملة معادلتين من الدرجة الأولى بمجهولين », ouvert sur le TABLEAU
 * DES DEUX CONDITIONS (pair-scoreboard).
 *
 * Rétrofit 2026-10-15 (§4quater) : le labo OUVRE le module (plus de carte « تحدّ + نشاط » au-dessus, plus de titre / `lead`
 * de workspace, plus de `title` de labo qui répète sa mission). Le labo à deux niveaux, UN instrument, même objectif :
 *   متقدم (le نشاط 1) : 32 agents, x hommes et y femmes ; la jauge (2) lit l'APRÈS (5 hommes et 3 femmes partis) ;
 *   مبتدئ : la carte de saison d'un club (plateforme, défaut) — 10 matchs sans défaite, 22 points.
 * Puis, sur ce que l'élève a FAIT : س أ (pourquoi (24 ; 8) n'allume qu'une jauge, ses propres essais en preuve
 * `[data-activity-evidence]`), س ب la traduction, س جـ la simplification et les deux vérifications → brique jumla-nashat
 * APRÈS la réponse ; س د ne redemande plus la ثنائية (le labo l'a fait) : elle demande ce que (13 ; 19) DIT du service
 * (avant ou après la retraite) ; puis le تحدّ : le MÊME tableau, monde de la cagnotte (posé seul, un niveau), avec sa vignette.
 * AUCUNE étape n'attend `onFinished`. LP : P2, P3 (et P1 nommé par la brique).
 *
 * LABO À QUESTIONS (2026-10-28, `primitives/LabCheckpoint`) : le labo pose lui-même, par-dessus la manipulation, les questions sur ce que l'élève vient de
 * faire (étape « الحل » : la valeur commune de la jauge (2), pourquoi la ثنائية est acceptée, l'ordre ; étape « الشرط الواحد » : quelle jauge, pourquoi ce
 * n'est pas un حل, puis la règle). Le س أ du manuel ((24 ; 8)) n'est donc plus reposé : l'étape 1 en garde la TRACE (`answered('half')`, événement
 * `checkpoint-done`), les autres étapes (traduction, simplification, sens de la ثنائية, تحدّ) sont inchangées.
 * Les labs vivent dans l'`intro` (deux niveaux) : le rappel de « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire)
 * clôt donc la DERNIÈRE étape.
 */
const BEGINNER = 'x+y=10|3x+y=22';
const ADVANCED = ACTIVITY.system;

const Opt = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState({ [BEGINNER]: [], [ADVANCED]: [] });
  const [cps, setCps] = useState([]);
  const [q2, setQ2] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const onTrial = (sys) => (tr) => setTrials((t) => ({ ...t, [sys]: [...t[sys].filter((p) => p.pair !== tr.pair), tr] }));
  const onCheckpoint = (ev) => setCps((l) => [...l, ev]);
  // les questions posées PAR-DESSUS le labo : une étape est faite quand la suite de questions de son étape l'est (n'importe quel niveau)
  const answered = (id) => cps.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const q1 = answered('half');
  const mine = trials[ADVANCED];
  const first = trials[BEGINNER];

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={mine.length ? 'true' : 'false'}>
      {mine.length === 0 && first.length > 0 ? (
        <p className="text-slate-600">جرّبتَ {first.length} ثنائيات على بطاقة الموسم. افتح المستوى المتقدّم لتجرّب لوحة العمّال.</p>
      ) : mine.length === 0 ? (
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
      moduleSubtitle="نجرّب ثنائيات على لوحتين"
      objectives={['متى تقبل اللوحتان ثنائية من عددين؟', 'كيف نترجم نصّا بمعادلتين؟', 'كم قطعة من كل فئة جمعها التلاميذ؟']}
      estimatedTime="16 دقيقة"
      intro={
        // LE LABO OUVRE LE MODULE (§4quater) : ni carte du manuel, ni titre / `lead` de workspace ; le contexte est le `lead` du niveau
        // (le texte du نشاط), la question est celle du labo.
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="pair-scoreboard"
                level="beginner"
                system={BEGINNER}
                theme="football"
                onTrial={onTrial(BEGINNER)}
                onCheckpoint={onCheckpoint}
              />
            ),
            advanced: () => (
              <Manipulation
                type="pair-scoreboard"
                level="advanced"
                system={ADVANCED}
                theme="staff"
                lead="أُحيل 5 رجال و 3 نساء إلى التقاعد ولم يُعوَّضوا، فأصبح عدد النساء ضعف عدد الرجال."
                onTrial={onTrial(ADVANCED)}
                onCheckpoint={onCheckpoint}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ثنائية تضيء لوحة واحدة', subtitle: 'السؤال أ', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.questions[0]} source={ACTIVITY.source} compact />
              {evidence}
              <p className="rounded-xl border-2 px-3 py-2 text-sm border-slate-200 bg-white text-slate-600" data-activity-evidence="half" data-tried={q1 ? 'true' : 'false'}>
                {q1
                  ? <MathText>{`أجبتَ في المختبر عن ثنائيتك التي أضاءت لوحة واحدة: ثنائية مثل $(24 ; 8)$ تحقّق المعادلة (1) ولا تحقّق (2)، فليست حلًّا — ${ACTIVITY_LINES.a}`}</MathText>
                  : 'جرّب في المختبر ثنائية تضيء لوحة واحدة فقط، ثم أجب عن الأسئلة التي تظهر فوقه.'}
              </p>
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
          num: 4, title: 'ماذا تقول الثنائية عن المصلحة؟', subtitle: 'السؤال د', done: q4,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[3]}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'أضاءت اللوحتان معًا مع الثنائية $(13 ; 19)$ . ماذا تقول هذه الثنائية عن المصلحة؟'}</MathText>}
                options={[
                  'قبل الإحالة على التقاعد: 13 رجلا و 19 امرأة',
                  'بعد الإحالة على التقاعد: 13 رجلا و 19 امرأة',
                  'قبل الإحالة على التقاعد: 19 رجلا و 13 امرأة',
                ]}
                correct={0}
                cols={1}
                requires={['jumla-nashat']}
                explain={<MathText>{ACTIVITY_LINES.d}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'تحدّ القسم', subtitle: 'الشرطان نفساهما، بالقطع النقدية', done: q5,
          content: (
            <div className="space-y-3">
              <div className="flex justify-center"><ChallengeVignette /></div>
              <TextbookBox kind="situation" title="تحدّ" text={CHALLENGE.text} source={CHALLENGE.source} compact />
              <p className="text-sm text-slate-700"><MathText>{CHALLENGE.unknowns}</MathText></p>
              <Manipulation
                type="pair-scoreboard"
                system={CHALLENGE.system}
                theme="coins"
                levels={false}
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
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
