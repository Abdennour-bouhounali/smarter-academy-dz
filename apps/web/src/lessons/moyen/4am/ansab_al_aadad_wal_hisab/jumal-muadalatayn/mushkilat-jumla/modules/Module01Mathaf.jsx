import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, PairQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_SOLUTION, LAB, MISTAKE_TARJAMA, MISTAKE_HALF } from '../content/textbook';
import StepsTable from '../components/StepsTable';

/**
 * Module 1 — نشاط 3 (p. 57) : le musée, 140 visiteurs et 30300 DA, et le TABLEAU des cinq étapes.
 *
 * Le laboratoire `story-modeller` (deux niveaux, défaut متقدم = l'activité du manuel) fait les cinq
 * étapes à la main : nommer les inconnues sur les mots de l'histoire, porter ses nombres dans les
 * cases (un prix compté comme un visiteur est refusé dans les mots de l'histoire), résoudre, REJOUER
 * l'histoire avec la ثنائية, choisir la phrase de réponse.
 *   مبتدئ  — le derby (plateforme, `platform_context`) : 20 billets, 300 / 150 DA, 4800 DA ;
 *            inconnues déjà nommées.
 *   متقدم  — le musée du manuel : l'élève choisit lui-même les inconnues.
 *
 * AUCUNE étape n'attend `onFinished` : les rappels du niveau متقدم remplissent la colonne « حل » du
 * tableau du manuel (`StepsTable`, `[data-activity-evidence]`), AU-DESSUS des questions — les
 * questions se répondent depuis le travail de l'élève, jamais depuis une réponse affichée d'office.
 *
 * Étapes = les lignes du tableau : (1) اختيار المجاهيل ; (2) la brique « jumla-tarjama », puis les
 * trois tâches de traduction ; (3) حل الجملة (la ثنائية tapée) ; (4) la brique « khutuwat-hall »,
 * التحقق et الإجابة. LP : P1, P2.
 */
export default function Module01Mathaf() {
  const [evidence, setEvidence] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const add = (patch) => setEvidence((e) => ({ ...e, ...patch }));

  const table = <StepsTable evidence={evidence} emptyText="أكمل هذه المرحلة في المختبر (المستوى المتقدّم)." />;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — زوار المتحف"
      moduleSubtitle="من القصة إلى جملة معادلتين، ثم إلى الجواب"
      objectives={['ما المجهولان في القصة؟ وكيف نختارهما؟', 'كيف نحوّل كل معلومة في النص إلى معادلة؟', 'كيف نتأكد من الجواب في القصة نفسها؟']}
      estimatedTime="15 دقيقة"
      brief={{
        tag: 'نشاط 3 — الكتاب ص 57',
        headline: 'كم بالغا وكم صغيرا؟',
        emoji: '🏛️',
        title: 'حل مشكلات بتوظيف جمل معادلتين من الدرجة الأولى بمجهولين',
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p><MathText>{ACTIVITY.text}</MathText></p>
            <p className="text-sm text-slate-600">في المختبر: اختر المجهولين، احمل أعداد القصة إلى المعادلتين، حلّ الجملة، ثم أعد القصة بالعددين وأجب. في المستوى المبتدئ: تذاكر ديربي العاصمة.</p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={LAB.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="في المستويين: من أين تبدأ لتحوّل القصة إلى معادلتين؟ وكيف تتأكد من جوابك في القصة نفسها؟"
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="story-modeller"
                level="beginner"
                {...LAB.beginner}
                title="تذاكر الديربي: 20 تذكرة و 4800 DA"
              />
            ),
            advanced: () => (
              <Manipulation
                type="story-modeller"
                {...LAB.advanced}
                title="نشاط 3: المتحف — 140 زائرا و 30300 DA"
                onModel={({ tex, system, unknowns }) => add({ unknowns, system: tex, equations: system.split('|').map((eq) => eq.replace(/([+=-])/g, ' $1 ')) })}
                onSolved={({ x, y }) => add({ pair: `(${x} ; ${y})` })}
                onTrial={(tr) => { if (tr.stage === 'verify' && tr.ok) add({ checked: [`${tr.values.x} + ${tr.values.y} = 140`, `300 \\times ${tr.values.x} + 150 \\times ${tr.values.y} = 30300`] }); }}
                onFinished={() => add({ answer: ACTIVITY.closing })}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: '1) اختيار المجاهيل', subtitle: 'جدول الكتاب: عمود «حل» يمتلئ بعملك في المختبر', done: q1,
          content: (
            <div className="space-y-3">
              {table}
              <TapQuestion
                prompt="ما هي المجاهيل في هذه المشكلة؟"
                options={[
                  'عدد الزوار ومداخيل المتحف',
                  'عدد البالغين وعدد الصغار',
                  'ثمن تذكرة البالغ وثمن تذكرة الصغير',
                ]}
                correct={1}
                cols={1}
                requires={['tarjama-ibara']}
                explain="المجهولان ما يسأل عنه السؤال: «أوجد عدد البالغين وعدد الصغار». عدد الزوار (140) والمداخيل (30300 DA) وثمنا التذكرتين معطاة في النص."
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: '2) ترجمة المشكلة بجملة معادلتين', subtitle: 'كل معلومة معادلة', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="jumla-tarjama" lead="ما فعلته بالأعداد في المختبر هو المرحلة 2 من جدول الكتاب:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_SOLUTION.unknowns}</MathText></p>}
                rows={[
                  { id: 'count', label: '«استقبل المتحف 140 زائرا»', options: [<MathText key="a">{'$300x + 150y = 140$'}</MathText>, <MathText key="b">{'$x + y = 140$'}</MathText>, <MathText key="c">{'$x + y = 30300$'}</MathText>], correct: 1, correction: <MathText>{MISTAKE_TARJAMA.why}</MathText> },
                  { id: 'money', label: '«بلغت مداخيل المتحف 30300DA»', options: [<MathText key="a">{'$300x + 150y = 30300$'}</MathText>, <MathText key="b">{'$150x + 300y = 30300$'}</MathText>, <MathText key="c">{'$450(x + y) = 30300$'}</MathText>], correct: 0, correction: <MathText>{'كل بالغ يدفع 300 وكل صغير 150: $300x + 150y = 30300$ .'}</MathText> },
                  { id: 'system', label: 'الجملة التي تترجم معطيات المشكلة', options: [<MathText key="a">{ACTIVITY_SOLUTION.system}</MathText>, <MathText key="b">{'$\\begin{cases} x + y = 30300 \\\\ 300x + 150y = 140 \\end{cases}$'}</MathText>, <MathText key="c">{'$\\begin{cases} x + y = 140 \\\\ 150x + 300y = 30300 \\end{cases}$'}</MathText>], correct: 0, correction: <MathText>{MISTAKE_TARJAMA.right}</MathText> },
                ]}
                requires={['jumla-tarjama']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: معلومة تعدّ الأشخاص، ومعلومة تجمع الدنانير — معادلتان، وحدة واحدة في كل واحدة.' : 'اقرأ كل معلومة وحدها: هل تعدّ أشخاصا، أم تجمع دنانير؟'}
                  </Feedback>
                )}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: '3) حل الجملة', subtitle: 'باختيار طريقة مناسبة', done: q3,
          content: (
            <div className="space-y-3">
              {table}
              <PairQuestion
                prompt={<MathText>{`حل الجملة ${ACTIVITY_SOLUTION.system} :`}</MathText>}
                expected={{ x: '62', y: '78' }}
                requires={['jumla-tarjama', 'hall-jumla']}
                explain={`${ACTIVITY_SOLUTION.solve} ${MISTAKE_HALF.why}`}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: '4) تحقق — 5) الإجابة', subtitle: 'نتحقق في النص نفسه، ثم نجيب بجملة', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khutuwat-hall" lead="الأسطر الخمسة لجدول الكتاب هي مراحل حل كل مشكلة:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">بالعددين 62 و 78:</p>}
                rows={[
                  { id: 'c1', label: '«استقبل المتحف 140 زائرا»', options: [<MathText key="a">{'$62 + 78 = 140$'}</MathText>, <MathText key="b">{'$62 + 78 = 130$'}</MathText>, <MathText key="c">{'$62 \\times 78 = 140$'}</MathText>], correct: 0, correction: <MathText>{'$62 + 78 = 140$ زائرا.'}</MathText> },
                  { id: 'c2', label: '«بلغت مداخيله 30300 DA»', options: [<MathText key="a">{'$300 \\times 78 + 150 \\times 62 = 30300$'}</MathText>, <MathText key="b">{'$300 \\times 62 + 150 \\times 78 = 30300$'}</MathText>, <MathText key="c">{'$300 \\times 62 + 150 \\times 78 = 30600$'}</MathText>], correct: 1, correction: <MathText>{ACTIVITY_SOLUTION.check}</MathText> },
                  { id: 'ans', label: '5) الإجابة', options: ['زار المتحف 62 زائرا.', 'زار المتحف 78 بالغا و 62 صغيرا.', 'زار المتحف 62 بالغا و 78 صغيرا.'], correct: 2, correction: ACTIVITY_SOLUTION.answer },
                ]}
                requires={['khutuwat-hall']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'تمامًا: القصة نفسها تتحقق بالعددين، والجواب جملة تذكر العددين كلّ بما يمثّله.'
                      : 'نتحقق في المعلومتين معًا: $(78 ; 62)$ تعطي 140 زائرا أيضا، لكن مداخيلها 32700 DA.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
