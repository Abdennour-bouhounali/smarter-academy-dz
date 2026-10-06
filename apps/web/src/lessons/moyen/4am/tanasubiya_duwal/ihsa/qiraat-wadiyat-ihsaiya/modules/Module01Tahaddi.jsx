import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import DataTable from '../components/DataTable';
import { CHALLENGE, LAB, MISTAKE_MM } from '../content/textbook';

/**
 * Module 1 — le تحدّ (p. 91, doublon déclaré de la page d'unité) : REAL → DISCOVER → MANIPULATE → UNDERSTAND.
 *
 * Le laboratoire `group-tanks` (écrit par cette leçon) : chaque groupe est un réservoir de largeur n rempli
 * jusqu'à sa moyenne m ; l'élève PARIE le niveau de la classe réunie, ouvre la vanne, l'eau s'arrête à
 * Σ n·m ÷ N (vases communicants = moyenne pondérée).
 *   متقدم (défaut) — le تحدّ : les classes (أ) et (ب), au MÊME niveau 384/33 ;
 *   مبتدئ — مسابقة القسم : 4 amis à 12 et 6 amis à 7 → 9, pas 9,5 (plateforme, plus petits nombres).
 *
 * AUCUNE étape n'attend `onFinished` : `onTrial` liste, au-dessus des questions, les paris de l'élève au
 * niveau متقدم (`[data-activity-evidence]`, MANIPULATION_DNA §9).
 *
 * Étapes : (1) la brique « mutawassit-majmuat » et les points du القسم (أ) ; (2) son معدّل (le piège
 * 11,5) ; (3) la brique « silsila-kamila » et la question du manuel ; (4) le cas des effectifs égaux.
 * LP : P3 (1, 2, 4), P2 (3). À la fin de l'étape 4 (les deux niveaux du labo sont dans l'intro) : « مسألة الدرس »
 * (LessonProblemCard), résolue au module 5.
 */
export default function Module01Tahaddi() {
  const [ev, setEv] = useState(null);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const cls = (ci) => (ci === 0 ? 'القسم (أ)' : 'القسم (ب)');

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {ev?.bets?.length ? ev.bets.map((b, i) => (
        <li key={i} className={b.ok ? 'text-emerald-800' : 'text-slate-800'} data-evidence="bet" data-tried="true">
          <MathText>{`${cls(b.ci)}: راهنت على $${b.bet.replace(',', '{,}')}$ ، واستقر الماء عند $${b.approx.replace(',', '{,}')}$ تقريبا.`}</MathText>
        </li>
      )) : (
        <li className="text-slate-500" data-evidence="bet" data-tried="false">لم تفتح بعد صمام أيّ قسم (المستوى المتقدّم).</li>
      )}
    </ul>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="تحدّ — قسمان ومعدّل واحد"
      moduleSubtitle="أيّ القسمين نتائجه أفضل؟"
      estimatedTime="13 دقيقة"
      brief={{
        tag: 'تحدّ — الكتاب ص 91',
        headline: 'إناث (أ) أفضل، وذكور (ب) أفضل… فمن يفوز؟',
        emoji: '🏆',
        title: 'متوسط مجموعات مجتمعة',
        tone: 'indigo',
        body: (
          <div className="space-y-2">
            <p><MathText>{CHALLENGE.text}</MathText></p>
            <DataTable head={CHALLENGE.head} rows={CHALLENGE.rows} />
            <p className="text-sm text-slate-600">في المختبر: كل مجموعة خزان عرضه عدد أفرادها وماؤه إلى ارتفاع معدّلها. راهن بـ 🎯 على مستوى الماء في خزان القسم، ثم افتح الصمام.</p>
          </div>
        ),
        footer: <SourceTag source={CHALLENGE.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="نفس الفكرة في المستويين: عندما تجتمع المجموعات يستقر الماء عند مستوى واحد. أين؟"
          defaultLevel="advanced"
          levels={{
            beginner: () => <Manipulation type="group-tanks" level="beginner" {...LAB.m1.beginner} />,
            advanced: () => <Manipulation type="group-tanks" {...LAB.m1.advanced} onTrial={setEv} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'مجموع نقاط القسم (أ)', subtitle: 'الماء في الخزانين', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <KnowledgeBrick id="mutawassit-majmuat" lead="ما رأيته في المختبر: ماء كل خزان هو العدد × المتوسط، والمستوى المشترك هو مجموع الماء مقسوما على العرض الكلي." />
              <NumericQuestion
                prompt={<MathText>{'في القسم (أ): 15 ذكرا بمعدّل 10 و 18 أنثى بمعدّل 13. ما مجموع نقاط تلاميذ القسم (أ)؟'}</MathText>}
                expected={384}
                requires={['mutawassit-majmuat']}
                explain={<MathText>{'$15 \\times 10 + 18 \\times 13 = 150 + 234 = 384$ نقطة، لـ $15 + 18 = 33$ تلميذا.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'معدّل القسم (أ)', subtitle: 'المتوسط المتوازن', done: q2,
          content: (
            <TapQuestion
              prompt="ما معدّل القسم (أ)؟"
              options={[
                <MathText key="a">{'$\\dfrac{384}{33} \\approx 11{,}64$'}</MathText>,
                <MathText key="b">{'$\\dfrac{10 + 13}{2} = 11{,}5$'}</MathText>,
                <MathText key="c">{'$\\dfrac{384}{2} = 192$'}</MathText>,
                <MathText key="d">{'$13$'}</MathText>,
              ]}
              correct={0}
              cols={2}
              requires={['mutawassit-majmuat']}
              explain={<MathText>{MISTAKE_MM.right}</MathText>}
              explainWrong={<MathText>{MISTAKE_MM.why}</MathText>}
              onAnswered={() => setQ2(true)}
            />
          ),
        },
        {
          num: 3, title: 'أيّ القسمين نتائجه أفضل؟', subtitle: 'سؤال الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="silsila-kamila" lead="احسب ماء القسم (ب) كما حسبت ماء القسم (أ)، ثم قارن القسمين كاملين." />
              <TapQuestion
                prompt={<MathText>{CHALLENGE.text}</MathText>}
                options={[
                  'القسم (أ)، لأن إناثه أفضل من إناث القسم (ب)',
                  'القسم (ب)، لأن ذكوره أفضل من ذكور القسم (أ)',
                  'للقسمين المعدّل نفسه: لا أحد منهما أفضل في المعدّل',
                  'القسم (ب)، لأن متوسط معدّلَيه 11,75 أكبر من 11,5',
                ]}
                correct={2}
                cols={1}
                requires={['silsila-kamila', 'mutawassit-majmuat']}
                explain={<MathText>{'في القسمين مجموع النقاط 384 والعدد 33: المعدّل نفسه $\\dfrac{384}{33} \\approx 11{,}64$ . المقارنة مجموعة بمجموعة تتعاكس ولا تحسم.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'متى يصحّ متوسط المتوسطين؟', subtitle: 'تكراران متساويان', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="mutawassit-majmuat" variant="rappel" compact />
              <NumericQuestion
                prompt={<MathText>{'في قسم آخر: 16 ذكرا بمعدّل 11 و 16 أنثى بمعدّل 13. ما معدّل القسم؟'}</MathText>}
                expected={12}
                requires={['mutawassit-majmuat']}
                explain={<MathText>{'$\\dfrac{16 \\times 11 + 16 \\times 13}{32} = \\dfrac{176 + 208}{32} = \\dfrac{384}{32} = 12$ : التكراران متساويان، فالمعدّل هو متوسط المعدّلين $\\dfrac{11 + 13}{2} = 12$ .'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
