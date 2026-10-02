import React, { useState } from 'react';
import { ContentModule, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { parseDec } from '@smarter-academy/core';
import { MethodSteps, TextbookBox, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD_SPRING, CHALLENGE, CHALLENGE_NOTE } from '../content/textbook';
import { EX } from '../content/exercises';
import { SpringTable, ChallengeGraph } from '../components/Graphs';

/**
 * Module 2 — طرائق p. 71 « تمثيل وقراءة وترجمة وضعية يتدخل فيها مقدار يعطى بدلالة مقدار آخر » :
 *   1. le tableau du ressort, à COMPLÉTER avant de lire la solution ;
 *   2. la solution du manuel ligne à ligne (MethodSteps), puis la brique « tariqat-jadwal » et la
 *      méthode appliquée à une autre masse (8 g) ;
 *   3. le pont des trois représentations (brique « tamthilat-thalath ») ;
 *   4. interpréter (brique « tafsir-siyaq ») : la phrase et l'unité, un résultat qui n'a pas de sens ;
 *   5. le تحدّ de la page d'unité (p. 65, doublon déclaré) comme transfert : B proportionnel, A non.
 * La leçon a `knowledgeMap: true` : pas de module de formalisation séparé. LP : P1, P2, P3.
 */
export default function Module02Tarayiq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (...ids) => ids.every((id) => done[id]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="طرائق — النابض والتحدّي"
      moduleSubtitle="جدول، دستور، تمثيل بياني، ثم تفسير"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'طرائق — الكتاب ص 71', headline: 'نابض يستطيل', emoji: '🪝',
        title: METHOD_SPRING.title, tone: 'violet',
        body: <p>في المحور السابق ضبطتَ مستقيمًا يشمل المبدأ على نقط قياس. الكتاب يحلّ وضعية النابض بالخطوات نفسها: جدول تناسبية، ثم دستور، ثم قراءة، ثم جواب بجملة.</p>,
      }}
      steps={[
        {
          num: 1, title: 'أتمم جدول النابض', subtitle: 'قبل أن تقرأ حلّ الكتاب', done: all('spring-table'),
          content: (
            <div className="space-y-3">
              <SpringTable />
              <TextbookExercise exercise={EX['spring-table']} requires={['tayin-dala-khattiya']} onAnswered={mark('spring-table')} />
              {done['spring-table'] && <SpringTable filled />}
            </div>
          ),
        },
        {
          num: 2, title: 'حلّ الكتاب سطرًا سطرًا', subtitle: 'اقرأ السطر، وحاول توقّع التالي قبل أن تكشفه', done: all('read', 'apply'),
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD_SPRING} onAllRevealed={mark('read')} />
              <KnowledgeBrick id="tariqat-jadwal" lead="هذه هي طريقة الكتاب، وتصلح لكل مقدار يُعطى بدلالة مقدار آخر:" />
              <NumericQuestion
                prompt="بالطريقة نفسها: ما استطالة النابض (بالسنتيمتر) عندما نعلّق كتلة قدرها 8g؟"
                expected={2.4}
                display="2,4"
                parse={parseDec}
                requires={['tariqat-jadwal']}
                explain={<MathText>{'$y = 0{,}3 \\times 8 = 2{,}4$ : كتلة 8g تعطي استطالة 2,4cm.'}</MathText>}
                onAnswered={mark('apply')}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'ثلاثة أشكال لعلاقة واحدة', subtitle: 'جدول ↔ دستور ↔ تمثيل بياني', done: all('bridge'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tamthilat-thalath" lead="العدد 0,3 الذي وجدته في الجدول هو نفسه في الدستور وفي التمثيل البياني:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في وضعية النابض:</p>}
                rows={[
                  { id: 'tab', label: 'من السطر الأول إلى السطر الثاني في الجدول', options: [<MathText key="a">{'نضرب في $0{,}3$'}</MathText>, <MathText key="b">{'نضيف $0{,}3$'}</MathText>, <MathText key="c">{'نقسم على $0{,}3$'}</MathText>], correct: 0, correction: <MathText>{'$\\dfrac{0{,}6}{2} = \\dfrac{1{,}5}{5} = 0{,}3$ : حاصل القسمة ثابت.'}</MathText> },
                  { id: 'dus', label: 'الدستور', options: [<MathText key="a">{'$y = x + 0{,}3$'}</MathText>, <MathText key="b">{'$y = 0{,}3x$'}</MathText>, <MathText key="c">{'$x = 0{,}3y$'}</MathText>], correct: 1, correction: <MathText>{'$y = 0{,}3x$ : الاستطالة بدلالة الكتلة.'}</MathText> },
                  { id: 'bay', label: 'التمثيل البياني مستقيم يشمل', options: [<MathText key="a">{'$O$ و $(3 ; 10)$'}</MathText>, <MathText key="b">{'$(0 ; 0{,}3)$ و $(1 ; 0{,}6)$'}</MathText>, <MathText key="c">{'$O$ و $(10 ; 3)$'}</MathText>], correct: 2, correction: <MathText>{'$0{,}3 \\times 10 = 3$ : النقطة $(10 ; 3)$ على المستقيم، و $O$ لأن $0{,}3 \\times 0 = 0$ .'}</MathText> },
                ]}
                requires={['tamthilat-thalath']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: معامل واحد، ثلاثة أشكال.' : 'ابحث عن 0,3 في كل شكل: مضروب في الجدول، معامل في الدستور، ترتيب النقطة التي فاصلتها 1.'}
                  </Feedback>
                )}
                onAnswered={mark('bridge')}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'نفسّر النتيجة في سياق الوضعية', done: all('tafsir'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tafsir-siyaq" lead="الكتاب لا يكتب «x = 7» فقط، بل يكتب جملة:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">ما الجواب الذي يفسّر النتيجة في الوضعية؟</p>}
                rows={[
                  { id: 'seven', label: <MathText>{'من $2{,}1 = 0{,}3x$ وجدنا $x = 7$'}</MathText>, options: ['نعلّق كتلة قدرها 7g', 'الاستطالة 7cm', 'نعلّق 7 أجسام'], correct: 0, correction: <MathText>{METHOD_SPRING.solution[3]}</MathText> },
                  { id: 'neg', label: <MathText>{'حلّ معادلة أعطى كتلة $x = -2$'}</MathText>, options: ['نعلّق كتلة قدرها 2g', 'لا يلائم الوضعية: الكتلة لا تكون سالبة', 'الاستطالة 2cm'], correct: 1, correction: 'الكتلة مقدار موجب: نراجع النموذج أو الحساب.' },
                ]}
                requires={['tafsir-siyaq']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: جملة، وحدة، ونتيجة معقولة.' : 'نعود إلى معنى x في الوضعية: كتلة بالغرام.'}
                  </Feedback>
                )}
                onAnswered={mark('tafsir')}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'تحدّ — مركبتان على الطريق', subtitle: 'أيّهما تسير بسرعة ثابتة؟', done: all('challenge', 'challenge-2', 'challenge-3'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tanasub-bayan" variant="rappel" compact />
              <TextbookBox kind="exercise" text={CHALLENGE.text} source={CHALLENGE.source} />
              <ChallengeGraph />
              <TextbookBox kind="remark" text={CHALLENGE_NOTE.text} source={CHALLENGE_NOTE.source} compact />
              <TextbookExercise exercise={EX.challenge} requires={['tanasub-bayan']} onAnswered={mark('challenge')} />
              <TextbookExercise exercise={EX['challenge-2']} requires={['tanasub-bayan', 'sura-mutawassita']} onAnswered={mark('challenge-2')} />
              <TextbookExercise exercise={EX['challenge-3']} requires={['laysat-tanasub', 'sura-mutawassita', 'tafsir-siyaq']} onAnswered={mark('challenge-3')} />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
