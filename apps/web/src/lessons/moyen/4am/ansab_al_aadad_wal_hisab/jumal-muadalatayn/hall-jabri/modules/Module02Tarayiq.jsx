import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { MethodSteps, TextbookBox, TextbookExercise, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD, METHOD_BOX, CHOICE } from '../content/textbook';
import { NOW_59 } from '../content/exercises';

/**
 * Module 2 — طرائق p. 59 « حل جملة معادلتين من الدرجة الأولى بمجهولين » (FORMALIZE) :
 *   1. la jumla (1) résolue par التعويض, LIGNE À LIGNE (MethodSteps) → brique tariqat-tawid,
 *      et le contre-exemple « dans la même équation » (2 = 2) ;
 *   2. la jumla (2) par الجمع والتعويض, ligne à ligne → brique tariqat-jam, puis l'encadré
 *      « طريقة » du manuel ;
 *   3. CHOISIR la méthode d'après les coefficients (P3) → brique ikhtiyar-tariqa : chaque
 *      distracteur affirme un fait FAUX sur la jumla (un coefficient 1 qui n'existe pas, des
 *      coefficients « opposés » qui ne le sont pas) ;
 *   4. دوري الآن : les deux jumal du manuel, « مبيّنا طريقة الحل المستعملة ».
 * Rétrofit 2026-10-15 (§4quater) : module SANS labo — il ouvre sur la lecture ligne à ligne ; les briques (tariqat-tawid,
 * tariqat-jam, ikhtiyar-tariqa) et l'encadré « طريقة » viennent APRÈS la réponse (plus de `requires` sur ces questions).
 * LP : P1, P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const solutionOf = (m) => ({ source: m.source, exercise: m.exercise, solution: m.solution });

export default function Module02Tarayiq() {
  const [read1, setRead1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [read2, setRead2] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [now, setNow] = useState({});
  const mark = (id) => () => setNow((d) => ({ ...d, [id]: true }));

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="طرائق — التعويض أو الجمع"
      moduleSubtitle="حل جملة معادلتين من الدرجة الأولى بمجهولين"
      objectives={['كيف يُحَلّ تمرين الكتاب سطرًا سطرًا؟', 'متى يكون الجمع أسرع من التعويض؟', 'كيف نختار الطريقة بالنظر إلى المعاملات؟']}
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'طرائق — الكتاب ص 59', title: METHOD.title, tone: 'emerald',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.exercise}</MathText></p>
            <p className="text-sm text-slate-600">تمرين محلول من الكتاب: الجملة (1) بالتعويض، والجملة (2) بالجمع. اقرأ كل سطر، وحاول توقّع السطر التالي قبل أن تكشفه — هي الحركات نفسها التي قمت بها على البطاقتين.</p>
          </div>
        ),
        footer: <SourceTag source={METHOD.source} />,
      }}
      steps={[
        {
          num: 1, title: 'الجملة (1) بالتعويض', subtitle: 'الحلّ سطرًا سطرًا', done: read1 && q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="takhallus-majhul" variant="rappel" compact />
              <MethodSteps method={solutionOf(METHOD.one)} onAllRevealed={() => setRead1(true)} />
              {read1 && (
                <>
                  <TapQuestion
                    prompt={<MathText>{'لو عوّضنا $y$ بالعبارة $x - 2$ في المعادلة $x - y = 2$ نفسها التي أخذناها منها، لوجدنا:'}</MathText>}
                    options={[M('$x - (x - 2) = 2$ ، أي $2 = 2$ : مساواة صحيحة دائمًا لا تحدّد $x$'), M('$x = 2$'), M('$y = -2$')]}
                    correct={0}
                    cols={1}
                    explain={<MathText>{'$x - x + 2 = 2$ : يختفي $x$ ويبقى $2 = 2$ . لهذا نعوّض في المعادلة الأخرى $3x + y = -4$ .'}</MathText>}
                    onAnswered={() => setQ1(true)}
                  />
                  {q1 && <KnowledgeBrick id="tariqat-tawid" lead="ما فعله الكتاب في الجملة (1):" />}
                </>
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'الجملة (2) بالجمع', subtitle: 'الحلّ سطرًا سطرًا', done: read2 && q2,
          content: (
            <div className="space-y-3">
              <MethodSteps method={solutionOf(METHOD.two)} onAllRevealed={() => setRead2(true)} />
              {read2 && (
                <>
                  <TapQuestion
                    prompt={<MathText>{'في الجملة (2) جمعنا المعادلتين مباشرة دون ضرب في معامل، لأنّ:'}</MathText>}
                    options={[M('معاملي $x$ متعاكسان: $4x$ و $-4x$'), M('معاملي $y$ متعاكسان'), M('الطرفين الثانيين موجبان')]}
                    correct={0}
                    cols={1}
                    explain={<MathText>{'$4x + (-4x) = 0$ : يختفي $x$ ويبقى $2y + 3y = 9 + 6$ أي $5y = 15$ . أمّا $2y$ و $3y$ فليسا متعاكسين، وإشارة الطرفين الثانيين لا تُلغي شيئًا.'}</MathText>}
                    onAnswered={() => setQ2(true)}
                  />
                  {q2 && <KnowledgeBrick id="tariqat-jam" lead="ما فعله الكتاب في الجملة (2):" />}
                  {q2 && <TextbookBox kind="method" title={METHOD_BOX.title} lines={[METHOD_BOX.text, ...METHOD_BOX.items]} source={METHOD_BOX.source} />}
                </>
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'أيّ طريقة نختار؟', subtitle: 'ننظر إلى المعاملات', done: q3,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">لكل جملة، اختر الطريقة الأنسب مع سببها الصحيح:</p>}
                rows={[
                  { id: 'k1', label: M('$\\begin{cases} y = 3x - 1 \\\\ 2x + 5y = 12 \\end{cases}$'),
                    options: [M('التعويض، لأنّ $y$ معبّر عنه بدلالة $x$ في المعادلة الأولى'), M('الجمع، لأنّ معاملي $y$ متعاكسان'), M('الجمع، لأنّ معاملي $x$ متعاكسان')],
                    correct: 0, correction: M('العبارة $3x - 1$ جاهزة: $2x + 5(3x - 1) = 12$ أي $17x = 17$ ، ومنه $x = 1$ و $y = 2$ .') },
                  { id: 'k2', label: M('$\\begin{cases} 5x + 3y = 7 \\\\ 2x - 3y = 7 \\end{cases}$'),
                    options: [M('التعويض، لأنّ معامل $x$ يساوي 1'), M('الجمع، لأنّ معاملي $y$ متعاكسان'), M('الجمع، لأنّ معاملي $x$ متعاكسان')],
                    correct: 1, correction: M('$3y$ و $-3y$ متعاكسان: بالجمع $7x = 14$ ، ومنه $x = 2$ ثم $y = -1$ .') },
                  { id: 'k3', label: M('$\\begin{cases} 4x + 3y = 10 \\\\ 6x - 5y = 34 \\end{cases}$'),
                    options: [M('التعويض، لأنّ معامل $y$ يساوي 1'), M('الجمع مباشرة، لأنّ معاملي $x$ متعاكسان'), M('الجمع بعد الضرب في معاملين مناسبين، لأنه لا يوجد معامل يساوي 1 أو $-1$')],
                    correct: 2, correction: M('نضرب الأولى في 3 والثانية في $-2$ : $12x + 9y = 30$ و $-12x + 10y = -68$ ؛ بالجمع $19y = -38$ ، ومنه $y = -2$ ثم $x = 4$ .') },
                ]}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight ? CHOICE.rule : 'اقرأ المعاملات قبل أن تختار: هل يوجد معامل يساوي $1$ أو $-1$ ؟ هل يوجد معاملان متعاكسان؟'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="ikhtiyar-tariqa" lead="الطريقتان تصلان إلى الحل نفسه؛ الفرق في طول الطريق:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'دوري الآن (ص 59)', done: NOW_59.every((ex) => now[ex.id]),
          content: (
            <div className="space-y-3">
              {NOW_59.map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tariqat-tawid', 'tariqat-jam', 'ikhtiyar-tariqa']} onAnswered={mark(ex.id)} />)}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
