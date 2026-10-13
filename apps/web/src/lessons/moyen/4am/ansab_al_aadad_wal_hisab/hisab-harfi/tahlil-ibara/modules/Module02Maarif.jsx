import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 3 (p. 34) : « التحليل ».
 *   1. la définition (rappel de la brique du module 1), la propriété
 *      distributive CORRIGÉE (ka − kb = k(a − b), une ligne discrète) posée en
 *      brique (khassiya-tawziiya), les deux premiers exemples du livre ;
 *   2. les متطابقات lues à l'envers (brique tahlil-mutatabiqat) et les trois
 *      autres exemples ;
 *   3. le CONTRASTE : x² + 25 sans bande ne ferme aucun terrain (turf-factoring,
 *      mode square, b = 0, c = 25), puis x² − 9 / x² + 9.
 * LP : P1, P2, P3.
 */
export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      objectives={["ماذا يعني «تحليل» عبارة جبرية؟", "كيف نتعرّف على العامل المشترك الكامل؟", "أيّ العبارات تُقرأ في الاتجاه المعاكس لمتطابقة شهيرة؟"]}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — التحليل"
      moduleSubtitle="من المجموع إلى الجداء"
      estimatedTime="8 دقائق"
      brief={{
        tag: 'معارف — الكتاب ص 34', title: KNOWLEDGE.title, tone: 'violet',
        body: <p>ما فعلته بقطع العشب وفي كرّاس إيمان يقوله الكتاب في تعريف وخاصيتين، مع خمسة أمثلة.</p>,
      }}
      steps={[
        {
          num: 1, title: 'التعريف والخاصية التوزيعية', subtitle: 'أمثلة الكتاب 1 و 2', done: q1 && q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tahlil-taarif" variant="rappel" compact />
              <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} compact />
              <KnowledgeBrick id="khassiya-tawziiya" lead="الصفوف المتماثلة للعشب، مكتوبة بالحروف:" />
              <p className="text-xs text-slate-500" data-correction-note><MathText>{KNOWLEDGE.correctionNote}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'في المثال الأول من الكتاب، لماذا نكتب $6x^2 + 4x = 2x(3x + 2)$ وليس $2(3x^2 + 2x)$؟'}</MathText>}
                options={[
                  <MathText key="a">{'لأن $2(3x^2 + 2x)$ لا تساوي $6x^2 + 4x$'}</MathText>,
                  <MathText key="b">{'لأن $2x$ هو العامل المشترك الكامل: الحدّان $3x^2$ و $2x$ ما زال بينهما العامل المشترك $x$'}</MathText>,
                  <MathText key="c">{'لأن العامل المشترك يجب أن يحتوي دائمًا على أكبر قوّة لـ $x$ ، أي $x^2$'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['khassiya-tawziiya']}
                explain={<MathText>{`${KNOWLEDGE.examples[0]} — $2(3x^2 + 2x)$ صحيحة، لكن $3x^2 + 2x = x(3x + 2)$ : العامل المشترك $2x$ كاملًا هو ما وجدته بالصفوف ذات الارتفاع $x$. و $x^2$ لا يقسم $4x$.`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && (
                <TapQuestion
                  prompt={<MathText>{'المثال الثاني: $5(x + 1) + 3x(x + 1) = $'}</MathText>}
                  options={[
                    <MathText key="a">{'$8x(x + 1)$'}</MathText>,
                    <MathText key="b">{'$(x + 1)(5 \\times 3x)$'}</MathText>,
                    <MathText key="c">{'$(x + 1)(5 + 3x)$'}</MathText>,
                  ]}
                  correct={2}
                  cols={3}
                  requires={['khassiya-tawziiya']}
                  explain={<MathText>{`العامل المشترك هو القوس $(x + 1)$ كلّه: ${KNOWLEDGE.examples[1]}. أمّا $5 + 3x$ فلا تساوي $8x$ (حدّان غير متشابهين).`}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'المتطابقات الشهيرة في الاتجاه المعاكس', subtitle: 'أمثلة الكتاب 3، 4 و 5', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tahlil-mutatabiqat" lead="والملعب المربّع الذي أغلقته في النشاط، مكتوبًا بالحروف:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">لكل عبارة من أمثلة الكتاب: أيّ متطابقة تحلّلها؟</p>}
                rows={[
                  { id: 'e3', label: <MathText>{'$9x^2 + 6x + 1$'}</MathText>, options: ['مربع مجموع', 'مربع فرق', 'جداء مجموع حدين وفرقهما'], correct: 0, correction: <MathText>{KNOWLEDGE.examples[2]}</MathText> },
                  { id: 'e4', label: <MathText>{'$4 - 4x + x^2$'}</MathText>, options: ['مربع مجموع', 'مربع فرق', 'جداء مجموع حدين وفرقهما'], correct: 1, correction: <MathText>{KNOWLEDGE.examples[3]}</MathText> },
                  { id: 'e5', label: <MathText>{'$64 - 16x^2$'}</MathText>, options: ['مربع مجموع', 'مربع فرق', 'جداء مجموع حدين وفرقهما'], correct: 2, correction: <MathText>{KNOWLEDGE.examples[4]}</MathText> },
                ]}
                requires={['tahlil-mutatabiqat']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'نعرف المتطابقة من شكل العبارة: حدّ مضاعف موجب، حدّ مضاعف سالب، أو فرق مربّعين بلا حدّ مضاعف.'
                      : 'انظر إلى الحدّ الأوسط: $+2ab$ لمربع مجموع، $-2ab$ لمربع فرق، ولا حدّ أوسط في $a^2 - b^2$.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'هل يُغلق هذا الملعب؟', subtitle: 'مربّع كبير ومربّعات صغيرة فقط', done: q4,
          content: (
            <div className="space-y-3">
              <Manipulation
                type="turf-factoring"
                mode="square"
                b={0}
                c={25}
                lead="مربّع كبير x² و 25 مربّعًا صغيرًا، ولا شريط: حاول أن تُغلق الملعب."
              />
              <TapQuestion
                prompt={<MathText>{'أيّ العبارتين تُحلَّل بمتطابقة شهيرة: $x^2 - 9$ أم $x^2 + 9$؟'}</MathText>}
                options={[
                  <MathText key="a">{'$x^2 + 9$ لأنّ $x^2 + 9 = (x + 3)^2$'}</MathText>,
                  <MathText key="b">{'الاثنتان، لأن 9 مربّع العدد 3'}</MathText>,
                  <MathText key="c">{'$x^2 - 9$ وحدها: $x^2 - 9 = (x - 3)(x + 3)$'}</MathText>,
                ]}
                correct={2}
                cols={1}
                requires={['tahlil-mutatabiqat']}
                explain={<MathText>{'$x^2 - 9 = x^2 - 3^2$ فرق مربّعين. أمّا $x^2 + 9$ فمجموع مربّعين، لا حدّ مضاعف فيه: $(x + 3)^2 = x^2 + 6x + 9$ — كما في الملعب الذي لا يُغلق دون شرائط.'}</MathText>}
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
