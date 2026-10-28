import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps, TextbookBox, TextbookExercise, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD, CHALLENGE, KHWARIZMI } from '../content/textbook';
import { NOW_47_2 } from '../content/exercises';
import ChallengeSquare from '../components/ChallengeSquare';

/**
 * Module 3 — طرائق p. 47 : « حل معادلة من الشكل (ax + b)(cx + d) = 0 ».
 *   1. la solution du livre LIGNE À LIGNE (MethodSteps) → brique tariqat-jidaa-maadum ;
 *   2. دوري الآن 2 : 4x(−x + 1), (2x + 1)², 4x² − 1, 9x² = 4x ;
 *   3. le terrain CARRÉ (2x + 1)² : ses deux côtés s'annulent ENSEMBLE, un seul zéro
 *      (vanishing-pitch, `levels={false}`), contre (2x − 1)(2x + 1) qui en a deux ;
 *   4. TRANSFERT — le تحدّ de la page d'ouverture (duplicatedIn) : x² + 12x = 85 sur le
 *      carré AEGF ; le coin 6 × 6 complète le carré, (x + 6)² = 121, puis le produit nul
 *      (x − 5)(x + 17) = 0 ; −17 est refusé parce que x est une longueur ;
 *   5. CLÔTURE — الخوارزمي (duplicatedIn) : x² + 21 = 10x, ses racines 3 et 7 sont
 *      celles de (x − 3)(x − 7) = 0.
 * LP : P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const solutionOf = (m) => ({ source: m.source, exercise: m.exercise, solution: m.solution });

export default function Module03Tarayiq() {
  const [read, setRead] = useState(false);
  const [now, setNow] = useState({});
  const [q3, setQ3] = useState(false);
  const [q4a, setQ4a] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const mark = (id) => () => setNow((d) => ({ ...d, [id]: true }));

  return (
    <ContentModule
      objectives={["كيف نحلّ معادلة لا يظهر فيها جداء عاملين؟", "كم حلًّا لمعادلة عاملاها متساويان؟", "كيف نستفيد من المربّع الكبير في تحدّي الوحدة؟", "ما الجذران اللذان استخرجهما الخوارزمي؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طرائق — نحلّل ثم نحلّ"
      moduleSubtitle="حل معادلة تؤول إلى معادلة جداء معدوم"
      estimatedTime="9 دقائق"
      brief={{
        tag: 'طرائق — الكتاب ص 47', title: 'كيف نحلّ معادلة تؤول إلى جداء معدوم؟', tone: 'emerald',
        body: <p>تمرين محلول من الكتاب: اقرأ كل سطر، وحاول توقّع السطر التالي قبل أن تكشفه. ثم تحدّي الوحدة ومعادلة الخوارزمي.</p>,
      }}
      steps={[
        {
          num: 1, title: 'حلّ الكتاب سطرًا سطرًا', subtitle: 'العبارة F', done: read,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hulul-muadala-jidaa" variant="rappel" compact />
              <MethodSteps method={solutionOf(METHOD)} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="tariqat-jidaa-maadum" lead="في الحلّ خطوتان، نعيدهما في كل مرّة:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'دوري الآن (ص 47)', done: NOW_47_2.every((ex) => now[ex.id]),
          content: (
            <div className="space-y-3">
              {NOW_47_2.map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tariqat-jidaa-maadum']} onAnswered={mark(ex.id)} />)}
            </div>
          ),
        },
        {
          num: 3, title: 'ملعب مربّع', subtitle: 'عاملان متساويان', done: q3,
          content: (
            <div className="space-y-3">
              <Manipulation
                type="vanishing-pitch"
                expr="2x+1"
                levels={false}
                title="ملعب مربّع ضلعه 2x + 1: كم حلًّا؟"
                lead="الضلعان متساويان دائمًا. حرّك x: كم مرّة يختفي الملعب؟"
              />
              <TapQuestion
                prompt={<MathText>{'لماذا للمعادلة $(2x + 1)^2 = 0$ حلّ واحد، بينما للمعادلة $(2x - 1)(2x + 1) = 0$ حلّان؟'}</MathText>}
                options={[
                  M('لأنّ مربّع عدد لا ينعدم أبدًا'),
                  M('لأنّ العاملين في $(2x + 1)^2$ متساويان فينعدمان معًا عند $x = -\\dfrac{1}{2}$ ، أمّا $2x - 1$ و $2x + 1$ فعاملان مختلفان'),
                  M('لأنّ المعادلة $(2x + 1)^2 = 0$ من الدرجة الأولى'),
                ]}
                correct={1}
                cols={1}
                requires={['hulul-muadala-jidaa']}
                explain={<MathText>{'$(2x + 1)^2 = (2x + 1)(2x + 1)$ : المعادلتان $2x + 1 = 0$ و $2x + 1 = 0$ هما المعادلة نفسها، وحلّها $-\\dfrac{1}{2}$. أمّا $(2x - 1)(2x + 1) = 0$ فتعطي $\\dfrac{1}{2}$ و $-\\dfrac{1}{2}$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'تحدّي الوحدة', subtitle: 'المربّع AEGF', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" title="تحدّ" text={CHALLENGE.text} source={CHALLENGE.source} compact />
              <ChallengeSquare label="مربّع ABCD مقسّم إلى مربّع AEGF ضلعه x، ومستطيلين بعدا كل منهما x و 6، ومربّع GHCK ضلعه 6" />
              <p className="text-xs text-slate-500"><MathText>{CHALLENGE.figure}</MathText></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">ماذا ينقص الشكل ليصير مربّعًا كبيرًا؟ وأيّ جداء معدوم نصل إليه؟</p>}
                rows={[
                  { id: 'c1', label: 'مساحة المربع ABCD بدلالة x', options: [M('$x^2 + 36$'), M('$(x + 6)^2$'), M('$x^2 + 12x$')], correct: 1,
                    correction: M('ABCD مربّع ضلعه $x + 6$ ، ومساحته مجموع القطع الأربع: $(x + 6)^2 = x^2 + 6x + 6x + 36 = x^2 + 12x + 36$ .') },
                  { id: 'c2', label: <MathText>{'بما أنّ $x^2 + 12x = 85$ :'}</MathText>, options: [M('$(x + 6)^2 = 85$'), M('$(x + 6)^2 = 91$'), M('$(x + 6)^2 = 121$')], correct: 2,
                    correction: M('$(x + 6)^2 = x^2 + 12x + 36 = 85 + 36 = 121$') },
                  { id: 'c3', label: <MathText>{'$(x + 6)^2 - 121 = 0$ تُكتب:'}</MathText>, options: [M('$(x - 5)(x + 17) = 0$'), M('$(x - 115)(x + 127) = 0$'), M('$(x - 5)^2 = 0$')], correct: 0,
                    correction: M('$121 = 11^2$ : $(x + 6)^2 - 11^2 = (x + 6 - 11)(x + 6 + 11) = (x - 5)(x + 17)$') },
                ]}
                requires={['tariqat-jidaa-maadum', 'tahlil-huwiya']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'الركن الناقص $6 \\times 6 = 36$ يكمل المربّع، ثم فرق مربّعين يعطي جداءً معدومًا.'
                      : 'ضلع المربّع الكبير $x + 6$ ، و $121 = 11^2$ : استعمل $a^2 - b^2 = (a - b)(a + b)$ .'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ4a(true)}
              />
              {q4a && (
                <TapQuestion
                  prompt={<MathText>{'ما قيمة $x$ ، طول ضلع المربّع AEGF؟'}</MathText>}
                  options={[M('$5$ و $-17$'), M('$5$'), M('$11$'), M('$-17$')]}
                  correct={1}
                  cols={2}
                  requires={['tariqat-jidaa-maadum']}
                  explain={<MathText>{'$(x - 5)(x + 17) = 0$ يعني $x = 5$ أو $x = -17$ ؛ لكنّ $x$ طول ضلع، فهو موجب: $x = 5$ . التحقّق: $5^2 + 12 \\times 5 = 25 + 60 = 85$ .'}</MathText>}
                  onAnswered={() => setQ4(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 5, title: 'معادلة الخوارزمي', subtitle: 'كتاب الجبر والمقابلة', done: q5,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={KHWARIZMI.caption} lines={[KHWARIZMI.kinds, KHWARIZMI.quote]} source={KHWARIZMI.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'كيف نجد بالتحليل جذري المعادلة $x^2 + 21 = 10x$ ؟'}</MathText> <SourceTag source={KHWARIZMI.source} /></p>}
                rows={[
                  { id: 'k1', label: <MathText>{'$(x - 3)(x - 7) = $'}</MathText>, options: [M('$x^2 + 10x + 21$'), M('$x^2 - 10x + 21$'), M('$x^2 - 21$')], correct: 1,
                    correction: M('$(x - 3)(x - 7) = x^2 - 7x - 3x + 21 = x^2 - 10x + 21$') },
                  { id: 'k2', label: <MathText>{'المعادلة $x^2 + 21 = 10x$ تكافئ'}</MathText>, options: [M('$(x - 3)(x - 7) = 0$'), M('$(x + 3)(x + 7) = 0$'), M('$x^2 + 11 = 0$')], correct: 0,
                    correction: M('نطرح $10x$ من الطرفين: $x^2 - 10x + 21 = 0$ ، أي $(x - 3)(x - 7) = 0$ .') },
                  { id: 'k3', label: 'جذراها', options: [M('$-3$ و $-7$'), M('$21$ و $10$'), M('$3$ و $7$')], correct: 2,
                    correction: M('$x - 3 = 0$ أو $x - 7 = 0$ : $x = 3$ أو $x = 7$ — الجذران اللذان استخرجهما الخوارزمي.') },
                ]}
                requires={['tariqat-jidaa-maadum']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'وجدت بالتحليل وخاصية الجداء المعدوم الجذرين $3$ و $7$ اللذين استخرجهما الخوارزمي في «كتاب الجبر والمقابلة».'
                      : 'اجعل الطرف الثاني $0$ أوّلًا، ثم تحقّق بالنشر أنّ $(x - 3)(x - 7)$ يساوي الطرف الأول.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ5(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} variant="memo" />}
    />
  );
}
