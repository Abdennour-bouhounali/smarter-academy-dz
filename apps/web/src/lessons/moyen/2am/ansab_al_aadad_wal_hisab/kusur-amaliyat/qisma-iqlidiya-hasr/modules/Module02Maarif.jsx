import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, GUIDE } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 26) « القسمة الإقليدية » et « حصر حاصل القسمة » :
 *   1. l'exemple des 180 crayons (8 par élève), les quatre noms DEMANDÉS puis la définition (0 ≤ r < b) ;
 *   2. l'encadrement 22 < 180/8 < 23 : les deux bouts nommés « بالنقصان / بالزيادة » (vocabulaire de la leçon suivante,
 *      kasr-hasil-qisma, rappelé ici sans être construit — renvoi en avant de la file) ;
 *   3. le reste nul : يقبل القسمة، مضاعف (manuel) et يقسم (1AM, ajout déclaré) — le quotient est alors un entier.
 * LP : P1, P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const { example, hasr } = KNOWLEDGE;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q2b, setQ2b] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q3b, setQ3b] = useState(false);

  return (
    <ContentModule
      objectives={['ما تعريف القسمة الإقليدية لأيّ عددين؟', 'ماذا نسمّي طرفي حصر حاصل القسمة؟', 'ماذا نقول عندما يكون الباقي معدومًا؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — القسمة الإقليدية وحصر الحاصل"
      moduleSubtitle="تعريف، وقيمتان مقرّبتان، وباقٍ معدوم"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'معارف — الكتاب ص 26', title: 'ما يقوله الكتاب عن القسمة الإقليدية وحصر حاصلها', tone: 'violet',
        body: <p><MathText>{'في النشاط وجدنا $71 < \\frac{2145}{30} < 72$ . الكتاب يعرّف القسمة الإقليدية لأيّ عددين، ويسمّي طرفي هذا الحصر.'}</MathText></p>,
      }}
      steps={[
        {
          num: 1, title: 'المعلّم و 180 قلمًا', subtitle: '$180 = 8 \\times 22 + 4$', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" lines={[example.text, ...example.lines]} source={KNOWLEDGE.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'في المساواة $180 = 8 \\times 22 + 4$ ، ماذا يمثّل كل عدد في قصّة الأقلام؟'}</MathText></p>}
                rows={[
                  { id: 'a', label: '180', options: ['عدد الأقلام كلّها', 'عدد التلاميذ', 'عدد الأقلام الباقية'], correct: 0 },
                  { id: 'b', label: '8', options: ['عدد التلاميذ', 'نصيب كل تلميذ', 'عدد الأقلام الباقية'], correct: 1 },
                  { id: 'q', label: '22', options: ['نصيب كل تلميذ', 'عدد الأقلام الباقية', 'عدد التلاميذ المستفيدين'], correct: 2 },
                  { id: 'r', label: '4', options: ['عدد التلاميذ', 'عدد الأقلام الباقية', 'نصيب كل تلميذ'], correct: 1 },
                ]}
                requires={['qisma-iqlidiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا. والكتاب يعرّف القسمة الإقليدية لأيّ عددين:' : 'اقرأ القصّة مرّة أخرى، ثم التعريف أسفله:'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="qisma-taarif" />}
            </div>
          ),
        },
        {
          num: 2, title: 'حصر حاصل القسمة', subtitle: '$22 < \\frac{180}{8} < 23$', done: q2 && q2b,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={hasr.title} text={hasr.text} source={hasr.source} compact />
              <TapQuestion
                prompt={<MathText>{'بين أيّ عددين طبيعيين متتاليين يقع $\\frac{180}{8}$ ؟'}</MathText>}
                options={[M('بين 4 و 5'), M('بين 22 و 23'), M('بين 8 و 9')]}
                correct={1}
                cols={3}
                requires={['hasr-hasil']}
                explain={<MathText>{'$8 \\times 22 = 176 < 180 < 184 = 8 \\times 23$ : الحاصل بين 22 و 23 ، لا بين الباقي 4 والعدد 5.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="qiyam-muqarraba" />}
              {q2 && (
                <BatchChoiceQuestion
                  intro={<p className="text-sm font-semibold text-slate-700">في قصّة الأقلام:</p>}
                  rows={[
                    { id: 'n', label: 'القيمة المقرّبة بالنقصان 22 هي', options: ['عدد التلاميذ الذين يأخذون 8 أقلام كاملة', 'عدد الأقلام الباقية', 'عدد التلاميذ الذين يلزمهم 8 أقلام لتوزيع كل الأقلام'], correct: 0 },
                    { id: 'z', label: 'القيمة المقرّبة بالزيادة 23 هي', options: ['عدد التلاميذ الذين أخذوا 8 أقلام', 'نصيب كل تلميذ', 'عدد الحصص اللازمة لتوزيع كل الأقلام'], correct: 2, correction: '22 حصّة كاملة، والأقلام الأربعة الباقية تحتاج حصّة ثالثة وعشرين غير كاملة.' },
                  ]}
                  requires={['qiyam-muqarraba']}
                  feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{allRight ? GUIDE.ends : 'الطرف الأصغر يعدّ الحصص الكاملة، والأكبر يعدّ الحصص اللازمة لكل الأقلام.'}</MathText></Feedback>}
                  onAnswered={() => setQ2b(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'عندما يكون الباقي 0', subtitle: '$2160 = 30 \\times 72$', done: q3 && q3b,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="definition" text={KNOWLEDGE.divisibility} source={KNOWLEDGE.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'في النشاط وصل البيض إلى 2160 : $2160 = 30 \\times 72$ . أيّ الجمل صحيحة؟'}</MathText></p>}
                rows={[
                  { id: 'y', label: '2160 يقبل القسمة على 30', options: ['صحيحة', 'خاطئة'], correct: 0 },
                  { id: 'm', label: '2160 مضاعف للعدد 30', options: ['صحيحة', 'خاطئة'], correct: 0 },
                  { id: 'k', label: '2160 يقسم 30', options: ['صحيحة', 'خاطئة'], correct: 1, correction: 'العكس: 30 يقسم 2160.' },
                ]}
                requires={['qisma-taarif']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا:' : 'انتبه إلى الاتجاه:'}</Feedback>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="qabiliya" />}
              {q3 && (
                <TapQuestion
                  prompt={<MathText>{'أيّ حاصل قسمة هو عدد طبيعي؟'}</MathText>}
                  options={[M('$\\frac{2145}{30}$'), M('$\\frac{180}{8}$'), M('$\\frac{2160}{30}$')]}
                  correct={2}
                  cols={3}
                  requires={['qabiliya']}
                  explain={<MathText>{`${GUIDE.exact} أمّا $\\frac{2145}{30}$ و $\\frac{180}{8}$ فباقياهما 15 و 4 .`}</MathText>}
                  onAnswered={() => setQ3b(true)}
                />
              )}
              <SourceTag source={KNOWLEDGE.source} />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
