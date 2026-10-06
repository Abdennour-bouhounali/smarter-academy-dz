import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import RayFigure from '../components/RayFigure';
import GraphChoice from '../components/GraphChoice';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE_3, KNOWLEDGE_4 } from '../content/textbook';

/**
 * Module 3 — معارف 3 et 4 (p. 48).
 *   1. l'متراجحة, ses حلول, « حل متراجحة » et la forme du premier degré (brique
 *      mutarajiha-ula), l'exemple 1 (4x > −3) ;
 *   2. les trois règles (brique qawaid-ittijah) et l'exemple 2 — CORRIGÉ : « قد تغيّر » ;
 *   3. le dessin du manuel (brique tamthil-bayani) : 5x ≤ 3 et x > 6, puis 2x ≥ 6 à dessiner.
 * LP : P1, P2, P3.
 *
 * « أتوقّع القاعدة » : l'encadré تعريف (1) et les deux ملاحظة du manuel (3) ÉNONCENT la règle
 * juste avant sa brique — ils sont enveloppés dans une PredictRule portant l'id de la brique
 * (mutarajiha-ula, tamthil-bayani) : l'élève écrit d'abord (predictPrompt de knowledge.jsx),
 * puis encadré et brique s'affichent, une seule « توقّعك ». L'exemple 1 de معارف 4 et son
 * dessin restent AVANT la prédiction : la prompt s'appuie sur eux.
 */
const KEEP = ['يبقى', 'يتغيّر'];

export default function Module03Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="معارف — المتراجحات وتمثيل حلولها"
      moduleSubtitle="ما فعلته في النشاط، بكلمات الكتاب"
      estimatedTime="8 دقائق"
      brief={{
        tag: 'معارف — الكتاب ص 48', title: KNOWLEDGE_3.title, tone: 'sky',
        body: <p>نقاطك الحمراء، الخطوات التي قبلتها والرمز الذي وجّهته: يقولها الكتاب في تعريفين وثلاث قواعد ورسم، مع أمثلة.</p>,
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={KNOWLEDGE_3.source} /><SourceTag source={KNOWLEDGE_4.source} /></div>,
      }}
      steps={[
        {
          num: 1, title: 'المتراجحة وحلولها', subtitle: 'معارف 3 — المثال 1', done: q1 && q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hal-mutarajiha" variant="rappel" compact />
              <PredictRule id="mutarajiha-ula">
                <TextbookBox kind="definition" lines={[...KNOWLEDGE_3.definition, KNOWLEDGE_3.firstDegree]} source={KNOWLEDGE_3.source} compact />
              </PredictRule>
              <KnowledgeBrick id="mutarajiha-ula" lead="تعريف الكتاب، كما جرّبته بمتراجحتي النشاط:" />
              <TextbookBox kind="example" text={KNOWLEDGE_3.example1} source={KNOWLEDGE_3.source} compact />
              <TapQuestion
                prompt={<MathText>{'وهل العدد 0 حلّ للمتراجحة $4x > -3$ ؟'}</MathText>}
                options={['نعم، 0 حلّ لها', 'لا، 0 ليس حلًّا لها']}
                correct={0}
                cols={2}
                requires={['mutarajiha-ula']}
                explain={<MathText>{'$4 \\times 0 = 0$ و $0 > -3$ متباينة صحيحة: 0 حلّ، أمّا $-2$ فليس حلًّا. للمتراجحة حلول كثيرة، لا حلّ واحد.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && (
                <TapQuestion
                  prompt="أيّ متراجحة من الدرجة الأولى بمجهول واحد؟"
                  options={[
                    <MathText key="a">{'$3x^2 - 1 < 2$'}</MathText>,
                    <MathText key="b">{'$4x - 1 \\leq x + 3$'}</MathText>,
                    <MathText key="c">{'$x(x + 1) > 0$'}</MathText>,
                  ]}
                  correct={1}
                  cols={3}
                  requires={['mutarajiha-ula']}
                  explain={<MathText>{'$4x - 1 \\leq x + 3$ من الشكل $ax + b \\leq cx + d$ (حيث $a = 4$ ، $b = -1$ ، $c = 1$ ، $d = 3$). في الأخريين يظهر $x^2$ : $x(x + 1) = x^2 + x$.'}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'القواعد الثلاث', subtitle: 'معارف 3 — المثال 2', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qawaid-ittijah" lead="خطواتك في المختبر — ما قبلته نقاطك وما رفضته — في ثلاث قواعد:" />
              <TextbookBox kind="example" lines={[KNOWLEDGE_3.example2a, KNOWLEDGE_3.example2b]} source={KNOWLEDGE_3.source} compact />
              <p className="text-xs text-slate-500" data-correction-note><MathText>{KNOWLEDGE_3.correctionNote}</MathText></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في خطوات المثال 2: هل يبقى اتجاه المتراجحة أم يتغيّر؟</p>}
                rows={[
                  { id: 'k1', label: <MathText>{'نطرح $x$ من طرفي $4x - 1 \\leq x + 3$'}</MathText>, options: KEEP, correct: 0, correction: <MathText>{'طرح نفس العدد من الطرفين: $3x - 1 \\leq 3$ ، الاتجاه يبقى.'}</MathText> },
                  { id: 'k2', label: <MathText>{'نقسم طرفي $3x \\leq 4$ على 3'}</MathText>, options: KEEP, correct: 0, correction: <MathText>{'3 موجب تمامًا: $x \\leq \\dfrac{4}{3}$.'}</MathText> },
                  { id: 'k3', label: <MathText>{'نقسم طرفي $-3x > 18$ على $-3$'}</MathText>, options: KEEP, correct: 1, correction: <MathText>{'$-3$ سالب تمامًا: $x < -6$ ، الاتجاه تغيّر.'}</MathText> },
                ]}
                requires={['qawaid-ittijah']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'الاتجاه لا يتغيّر إلّا عند الضرب أو القسمة على عدد سالب تمامًا.'
                      : 'انظر إلى العملية: إضافة أو طرح؟ ضرب أو قسمة على موجب أم على سالب؟'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'التمثيل البياني لحلول متراجحة', subtitle: 'معارف 4', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tamthil-jadwal" variant="rappel" compact />
              <TextbookBox kind="example" text={KNOWLEDGE_4.example1} source={KNOWLEDGE_4.source} compact />
              <RayFigure {...KNOWLEDGE_4.figure1} label="الجزء الملوّن بالأحمر على يسار ثلاثة أخماس، والرمز موجّه نحوه" />
              <PredictRule id="tamthil-bayani">
                <TextbookBox kind="remark" text={KNOWLEDGE_4.note1} source={KNOWLEDGE_4.source} compact />
                <TextbookBox kind="example" text={KNOWLEDGE_4.example2} source={KNOWLEDGE_4.source} compact />
                <RayFigure {...KNOWLEDGE_4.figure2} label="الجزء الملوّن بالأحمر على يمين 6، والرمز غير موجّه نحوه" />
                <TextbookBox kind="remark" text={KNOWLEDGE_4.note2} source={KNOWLEDGE_4.source} compact />
              </PredictRule>
              <KnowledgeBrick id="tamthil-bayani" lead="القاعدة التي وجدتها حين وجّهت الرمز:" />
              <GraphChoice
                prompt={<MathText>{'مثّل بيانيا حلول المتراجحة $2x \\geq 6$ .'}</MathText>}
                graph={{
                  options: [
                    { from: 0, to: 6, at: 3, side: 'right', closed: false },
                    { from: 0, to: 6, at: 3, side: 'left', closed: true },
                    { from: 0, to: 6, at: 3, side: 'right', closed: true },
                  ],
                  correct: 2,
                  explain: '$2x \\geq 6$ تعطي $x \\geq 3$ : الجزء الملوّن على يمين 3، و 3 حلّ ($2 \\times 3 = 6$ و $6 \\geq 6$) فالرمز موجّه نحوه.',
                }}
                requires={['tamthil-bayani']}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
