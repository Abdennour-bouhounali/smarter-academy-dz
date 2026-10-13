import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD_MODELLING, RACE } from '../content/textbook';
import { EX } from '../content/exercises';
import { SquareTriangleFigure } from '../components/Figures';

/**
 * Module 2 — طرائق p. 49 : « ترييض مشكلة ».
 *   1. la solution du manuel, ligne à ligne (أ ب جـ التحقق) ;
 *   2. la brique « tarrid-tariqa » : à quelle étape appartient chaque geste ;
 *   3. دوري الآن 2 — la même طريقة avec une MÉTRAJIHA (le carré et le triangle, figure
 *      redessinée), puis la brique « tarrid-mutarajiha » ;
 *   4. la même course sur une question dont la solution est NÉGATIVE (36 + x = 3(14 + x)
 *      ⇔ x = −3) : l'élève voit que les colonnes ne se rejoignent jamais sur la règle —
 *      le laboratoire en un seul niveau (`levels={false}`, un exemple travaillé) ;
 *   5. la brique « tahaqquq-waqi », puis une solution à refuser (longueur négative).
 * La leçon a `knowledgeMap: true` : pas de module de formalisation séparé. LP : P1, P2.
 */
const STEP_OPTIONS = ['أ) نسمّي', 'ب) نعبّر', 'جـ) نحلّ', 'التحقق'];

export default function Module02Tarayiq() {
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      objectives={["كيف نكتب ما فعلناه في السباق بأربع خطوات؟", "متى تترجم المشكلةَ متراجحةٌ لا معادلة؟", "هل يصلح كل حلّ جوابًا عن المشكلة؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="طرائق — ترييض مشكلة"
      moduleSubtitle="نسمّي، نعبّر، نحلّ، نتحقّق"
      estimatedTime="13 دقيقة"
      brief={{
        tag: 'طرائق — الكتاب ص 49', title: METHOD_MODELLING.title, tone: 'violet',
        body: <p>في المحور السابق بنيتَ المعادلة بيدك ووجدتَ الحل في السباق. الكتاب يكتب ذلك في أربع خطوات، ثم يطبّقها على متراجحة.</p>,
      }}
      steps={[
        {
          num: 1, title: 'حلّ الكتاب سطرًا سطرًا', subtitle: 'اقرأ السطر، وحاول توقّع التالي قبل أن تكشفه', done: read,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tarrid-namdhaja" variant="rappel" compact />
              <MethodSteps method={METHOD_MODELLING} onAllRevealed={() => setRead(true)} />
            </div>
          ),
        },
        {
          num: 2, title: 'الطريقة: أربع خطوات', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tarrid-tariqa" lead="الأسطر الأربعة هي خطوات كل ترييض:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">إلى أيّ خطوة ينتمي كل سطر؟</p>}
                rows={[
                  { id: 'eq', label: <MathText>{'$36 + x = (4 + x) + (6 + x) + (8 + x)$'}</MathText>, options: STEP_OPTIONS, correct: 1, correction: <MathText>{'نعبّر عن الوضعية بمعادلة بدلالة $x$ .'}</MathText> },
                  { id: 'sol', label: <MathText>{'$2x = 18$ أي $x = 9$'}</MathText>, options: STEP_OPTIONS, correct: 2, correction: 'نحلّ المعادلة التي وجدناها.' },
                  { id: 'chk', label: <MathText>{'$13 + 15 + 17 = 45$'}</MathText>, options: STEP_OPTIONS, correct: 3, correction: 'نعوّض الحل في نص المشكلة: الأعمار بعد 9 سنوات.' },
                  { id: 'nm', label: 'عدد السنوات التي يكون بعدها عمر الأب هو مجموع أعمار أبنائه', options: STEP_OPTIONS, correct: 0, correction: <MathText>{'نسمّي المجهول: نقول بالكلمات ماذا يمثّل $x$ .'}</MathText> },
                ]}
                requires={['tarrid-tariqa']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: نسمّي، نعبّر، نحلّ، ثم نتحقّق في النص نفسه.' : 'أعد قراءة الأسطر أ) ب) جـ) والتحقق في حلّ الكتاب.'}
                  </Feedback>
                )}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'دوري الآن 2 — مشكلة تترجمها متراجحة', done: q2,
          content: (
            <div className="space-y-3">
              <SquareTriangleFigure />
              <TextbookExercise exercise={EX['now-49-2']} requires={['tarrid-tariqa', 'hal-mutarajiha']} onAnswered={() => setQ2(true)} />
            </div>
          ),
        },
        {
          num: 4, title: 'سباق جديد: هل يلتقي الطرفان؟', subtitle: 'ابنِ النموذج، ثم مدّد x وراقب', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tarrid-mutarajiha" lead="ما فعلته في دوري الآن 2:" />
              <Manipulation
                type="growth-race"
                levels={false}
                theme="ages"
                left={RACE.past.left}
                right={RACE.past.right}
                goal="equal"
                title="أب عمره 36 سنة وابنه 14 سنة: بعد كم سنة يكون عمر الأب ثلاثة أضعاف عمر ابنه؟"
              />
              <TapQuestion
                prompt={<span>المعادلة <MathText>{'$36 + x = 3(14 + x)$'}</MathText> حلّها <MathText>{'$x = -3$'}</MathText>. ماذا نستنتج؟</span>}
                options={[
                  'يكون ذلك بعد 3 سنوات.',
                  'لن يحدث ذلك بعد اليوم: كان عمر الأب ثلاثة أضعاف عمر ابنه منذ 3 سنوات.',
                  'المعادلة خاطئة، لأن الحل لا يكون سالبًا أبدًا.',
                ]}
                correct={1}
                cols={1}
                requires={['tarrid-tariqa']}
                explain={<MathText>{'منذ 3 سنوات كان الأب 33 والابن 11: $33 = 3 \\times 11$ . أما «بعد $x$ سنة» فيتطلّب $x \\geq 0$ : ليس للسؤال حلّ في المستقبل. التحقق يقول لنا متى يجيب الحل عن السؤال.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'هل كل حلّ يصلح جوابًا؟', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tahaqquq-waqi" lead="قبل أن نكتب الجواب، نسأل: هل يلائم هذا الحل الوضعية؟" />
              <TapQuestion
                prompt={<span>مستطيل طوله <MathText>{'$x + 2$'}</MathText> وعرضه <MathText>{'$x$'}</MathText> (بالسنتيمتر) ومساحته <MathText>{'$15cm^2$'}</MathText>. المعادلة <MathText>{'$x(x + 2) = 15$'}</MathText> تُكتب <MathText>{'$(x + 5)(x - 3) = 0$'}</MathText>. ما عرض المستطيل؟</span>}
                options={[
                  <MathText key="a">{'$x = 3$ أو $x = -5$'}</MathText>,
                  <MathText key="b">{'$x = 3$ فقط'}</MathText>,
                  <MathText key="c">{'$x = -5$'}</MathText>,
                  <MathText key="d">{'$x = 5$'}</MathText>,
                ]}
                correct={1}
                cols={2}
                requires={['tahaqquq-waqi', 'jidaa-maadum']}
                explain={<MathText>{'الجداء معدوم: $x = -5$ أو $x = 3$ ، لكن $x$ عرض، فهو موجب: العرض 3cm والطول 5cm ، و $3 \\times 5 = 15$ .'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
