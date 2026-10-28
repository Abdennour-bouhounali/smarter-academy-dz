import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, NINE, GUIDE } from '../content/textbook';

/**
 * Module 2 — معارف 3 (p. 41) : les règles de 2, 5, 3 du manuel lues et appliquées, PUIS la règle de 9, découverte par
 * l'exercice 23 (150 et 174 se divisent par 3 et pas par 9) et formalisée par la plateforme (déclarée), puis le sens
 * « يقبل القسمة على » = reste nul (le lien avec la leçon précédente). LP : P1, P2, P4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  return (
    <ContentModule
      objectives={['نطبّق قواعد الكتاب على 2 و 5 و 3', 'متى يقبل عدد القسمة على 9؟', 'ماذا يعني «يقبل القسمة على»؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — قواعد قابلية القسمة"
      moduleSubtitle="2 و 5 · 3 و 9 · باقٍ معدوم"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'معارف — الكتاب ص 41', title: 'قواعد الكتاب، وقاعدة جديدة', tone: 'violet',
        body: <p>الكتاب يكتب القواعد التي خمّنتها. نطبّقها، ثم نبحث عن قاعدة القسمة على 9 التي يطرحها التمرين 23.</p>,
      }}
      steps={[
        {
          num: 1, title: 'هل تنجح قواعدك على هذه الأعداد؟', subtitle: 'على 2 ، 5 ، 3', done: q1,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">طبّق القواعد على أعداد الكتاب:</p>}
                rows={[
                  { id: 'a', label: '2014 يقبل القسمة على 2', options: ['صحيح', 'خطأ'], correct: 0, correction: 'رقم آحاده 4.' },
                  { id: 'b', label: '2325 يقبل القسمة على 5', options: ['صحيح', 'خطأ'], correct: 0, correction: 'رقم آحاده 5.' },
                  { id: 'c', label: '2019 يقبل القسمة على 3', options: ['صحيح', 'خطأ'], correct: 0, correction: <MathText>{'$2 + 0 + 1 + 9 = 12$ يقبل القسمة على 3.'}</MathText> },
                  { id: 'd', label: '2023 يقبل القسمة على 3', options: ['صحيح', 'خطأ'], correct: 1, correction: <MathText>{'$2 + 0 + 2 + 3 = 7$ لا يقبل القسمة على 3: رقم الآحاد 3 لا يكفي.'}</MathText> },
                ]}
                requires={['qabiliya-2-5', 'qabiliya-3']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{allRight ? 'تمامًا.' : GUIDE.units3.right}</MathText></Feedback>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <TextbookBox kind="property" lines={[KNOWLEDGE.rule2, KNOWLEDGE.rule5, KNOWLEDGE.rule3]} source={KNOWLEDGE.source} compact />}
            </div>
          ),
        },
        {
          num: 2, title: 'وعلى 9؟', subtitle: 'التمرين 23 يطرح السؤال', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>150 و 174 يقبلان القسمة على 3. هل يقبلانها على 9؟</span>}
                options={[M('لا: $150 = 9 \\times 16 + 6$ و $174 = 9 \\times 19 + 3$'), M('نعم: كل مضاعف لـ 3 مضاعف لـ 9'), M('نعم: لأنّ رقم آحادهما زوجي')]}
                correct={0} cols={1} requires={['qabiliya-3']}
                explain={<span>كل عدد يقبل القسمة على 9 يقبلها على 3 ، لكنّ العكس غير صحيح.</span>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="qabiliya-9" lead="مجموع أرقام 150 هو 6، و 174 هو 12، و 918 هو 18." />}
              <SourceTag source={NINE.source} />
            </div>
          ),
        },
        {
          num: 3, title: 'ماذا يعني «يقبل القسمة على»؟', subtitle: 'تذكّر القسمة الإقليدية', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>أيّ مساواة تبيّن أنّ 2019 يقبل القسمة على 3؟</span>}
                options={[M('$2019 = 3 \\times 673 + 0$'), M('$2019 = 3 \\times 672 + 3$'), M('$2019 = 3 \\times 670 + 9$')]}
                correct={0} cols={1} requires={['qisma-iqlidiya-baqi']}
                explain={<MathText>{'الباقي 0 : 2019 مضاعف للعدد 3. في المساواتين الأخريين الباقي (3 ، 9) ليس أصغر من 3: ليستا قسمة إقليدية.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="qabiliya-baqi" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
