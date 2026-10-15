import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, CASES_LINES } from '../content/textbook';

/**
 * Module 2 — معارف (p. 58) : 1) جملة معادلتين من الدرجة الأولى بمجهولين, 2) حل جملة — ses deux
 * exemples, la ملاحظة sur l'ordre —, et les حالات خاصة.
 *   1. la définition (brique jumla-tarif) et les coefficients (a, b, c, a', b', c') ;
 *   2. la définition du حل (hall-jumla), puis la vérification d'une ثنائية (ikhtibar-thunaiya) sur
 *      les deux exemples du livre ;
 *   3. l'ordre dans la ثنائية (tartib-thunaiya) ;
 *   4. les deux cas particuliers : les calculs que le livre résume en « تبسّط إلى الشكل » écrits
 *      ligne à ligne (déclarés), la brique halat-khassa, puis trois jumla à classer.
 * Rétrofit 2026-10-15 (§4quater) : module sans labo, qui s'ouvre sur « أتوقّع القاعدة » (PredictRule, intact) ; à l'étape 2 la question (la ثنائية
 * (1 ; −1)) précède les deux exemples du livre et la brique ikhtibar-thunaiya, qui la nomment APRÈS la réponse.
 * Les questions utilisent d'AUTRES nombres que les encadrés (la réponse n'est jamais au-dessus).
 * LP : P1, P2, P3, P4.
 */
const Opt = (s) => <MathText key={s}>{s}</MathText>;
const CASES = ['لها حل وحيد', 'ليس لها حلول', 'لها عدد غير منته من الحلول'];

export default function Module02Maarif() {
  const [q1a, setQ1a] = useState(false);
  const [q1b, setQ1b] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — الجملة وحلّها"
      moduleSubtitle="جملة معادلتين، حلّها، الترتيب، والحالات الخاصة"
      objectives={['ما شكل جملة معادلتين؟ وما معنى حلّها؟', 'هل يهمّ ترتيب العددين في الثنائية؟', 'متى لا يكون للجملة حل وحيد؟']}
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'معارف — الكتاب ص 58', title: KNOWLEDGE.system.title, tone: 'violet',
        body: <p><MathText>{'في النشاط 1 كتبنا معادلتين بمجهولين، ووجدنا ثنائية تُضيء اللوحتين معًا. الكتاب يسمّي هذا الشكل، ويعرّف حلّه، وينبّه إلى حالتين خاصتين.'}</MathText></p>,
      }}
      steps={[
        {
          num: 1, title: 'جملة معادلتين', subtitle: 'معارف 1 — الشكل والمعاملات', done: q1a && q1b,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="jumla-nashat" variant="rappel" compact />
              {/* La définition ÉNONCE la règle juste avant sa brique : l'élève l'écrit d'abord
                  (predictPrompt de jumla-tarif), puis boîtes et brique — une seule « توقّعك ». */}
              <PredictRule id="jumla-tarif">
                <TextbookBox kind="definition" text={KNOWLEDGE.system.definition} source={KNOWLEDGE.system.source} compact />
                <TextbookBox kind="example" text={KNOWLEDGE.system.example} source={KNOWLEDGE.system.source} compact />
              </PredictRule>
              <KnowledgeBrick id="jumla-tarif" lead="جملة النشاط 1 من هذا الشكل:" />
              <TapQuestion
                prompt={<MathText>{'في الجملة $\\begin{cases} 3x + y = 5 \\\\ x - 4y = -2 \\end{cases}$ ، المعامل $b\'$ يساوي:'}</MathText>}
                options={['$-4$', '$4$', '$1$', '$-2$'].map(Opt)}
                correct={0}
                cols={4}
                requires={['jumla-tarif']}
                explain={<MathText>{'المعادلة الثانية $a\'x + b\'y = c\'$ هي $x - 4y = -2$ : $a\' = 1$ ، $b\' = -4$ (المعامل بإشارته) و $c\' = -2$.'}</MathText>}
                onAnswered={() => setQ1a(true)}
              />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">هل هي جملة معادلتين من الدرجة الأولى بمجهولين؟</p>}
                rows={[
                  { id: 'j1', label: <MathText>{'$\\begin{cases} 5x - y = 0 \\\\ x + 3y = 7 \\end{cases}$'}</MathText>, options: ['نعم', 'لا'], correct: 0, correction: <MathText>{'معادلتان من الشكل $ax + by = c$ : $a = 5$ ، $b = -1$ ، $c = 0$ و $a\' = 1$ ، $b\' = 3$ ، $c\' = 7$.'}</MathText> },
                  { id: 'j2', label: <MathText>{'$\\begin{cases} x + y = 3 \\\\ x^2 - y = 1 \\end{cases}$'}</MathText>, options: ['نعم', 'لا'], correct: 1, correction: <MathText>{'في المعادلة الثانية $x^2$ : المجهول $x$ من الدرجة الثانية، فهي ليست من الشكل $a\'x + b\'y = c\'$.'}</MathText> },
                ]}
                requires={['jumla-tarif']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ1b(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'حل الجملة', subtitle: 'معارف 2 — المعادلتان في آن واحد', done: q2,
          content: (
            <div className="space-y-3">
              <PredictRule id="hall-jumla" prompt={"ما الذي جعل الثنائية التي قبلتها اللوحتان في النشاط 1 حلًّا للجملة؟ متى نقول إنّ ثنائية $(x_0 ; y_0)$ حلّ لجملة معادلتين؟ وماذا يعني «حلّ الجملة»؟"}><TextbookBox kind="definition" title={KNOWLEDGE.solution.title} lines={[KNOWLEDGE.solution.definition, KNOWLEDGE.solution.rule]} source={KNOWLEDGE.solution.source} compact /></PredictRule>
              <KnowledgeBrick id="hall-jumla" lead="ما قبلته لوحتا النشاط 1، معرَّفًا:" />
              <TapQuestion
                prompt={<MathText>{'هل الثنائية $(1 ; -1)$ حل للجملة $\\begin{cases} x - y = 2 \\\\ 2x - 5y = 4 \\end{cases}$ ؟'}</MathText>}
                options={['نعم: $1 - (-1) = 2$', 'لا: $2 \\times 1 - 5 \\times (-1) = 7 \\neq 4$', 'لا: $1 - (-1) \\neq 2$'].map(Opt)}
                correct={1}
                cols={1}
                requires={['hall-jumla']}
                explain={<MathText>{'المعادلة الأولى محقّقة: $1 - (-1) = 2$ ، لكن الثانية لا: $2 + 5 = 7 \\neq 4$. معادلة واحدة لا تكفي: $(1 ; -1)$ ليست حلا للجملة.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <TextbookBox kind="example" lines={KNOWLEDGE.solution.examples} source={KNOWLEDGE.solution.source} compact />}
              {q2 && <KnowledgeBrick id="ikhtibar-thunaiya" lead="ما فعلتَه للتوّ، وما فعله الكتاب في المثالين، طريقةً:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'الترتيب في الثنائية', subtitle: 'ملاحظة الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <PredictRule id="tartib-thunaiya"><TextbookBox kind="remark" text={KNOWLEDGE.solution.note} source={KNOWLEDGE.solution.source} compact /></PredictRule>
              <KnowledgeBrick id="tartib-thunaiya" />
              <TapQuestion
                prompt={<MathText>{'الثنائية $(3 ; 2)$ حل للجملة $\\begin{cases} x + 2y = 7 \\\\ 3x - y = 7 \\end{cases}$. هل الثنائية $(2 ; 3)$ حل لها؟'}</MathText>}
                options={['نعم: فيها العددان نفسهما', 'لا: $2 + 2 \\times 3 = 8 \\neq 7$', 'لا يمكن أن نعرف دون حل الجملة'].map(Opt)}
                correct={1}
                cols={1}
                requires={['tartib-thunaiya', 'ikhtibar-thunaiya']}
                explain={<MathText>{'في $(2 ; 3)$ لدينا $x = 2$ و $y = 3$ : $2 + 2 \\times 3 = 8 \\neq 7$. أما $(3 ; 2)$ فتعطي $3 + 4 = 7$ و $9 - 2 = 7$. نعرف ذلك بالتعويض، دون حل الجملة.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'حالات خاصة', subtitle: 'جملتان تُبسَّطان', done: q4,
          content: (
            <div className="space-y-3">
              {/* L'encadré et les calculs écrits concluent déjà (« لا حلول » / « عدد غير منته ») :
                  enveloppés, l'élève simplifie et prédit d'abord (predictPrompt de halat-khassa). */}
              <PredictRule id="halat-khassa">
                <TextbookBox kind="remark" title={KNOWLEDGE.cases.title} lines={KNOWLEDGE.cases.items} source={KNOWLEDGE.cases.source} compact />
                <div className="grid gap-2 sm:grid-cols-2" data-cases-lines>
                  <div className="rounded-xl border-2 border-sky-200 bg-sky-50/60 p-3 text-sm" data-case="infinite">
                    <p className="mb-1 font-bold text-sky-900">1) معادلة واحدة مرّتين</p>
                    <ol className="space-y-1">{CASES_LINES.infinite.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ol>
                  </div>
                  <div className="rounded-xl border-2 border-rose-200 bg-rose-50/60 p-3 text-sm" data-case="none">
                    <p className="mb-1 font-bold text-rose-900">2) معادلتان متناقضتان</p>
                    <ol className="space-y-1">{CASES_LINES.none.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ol>
                  </div>
                </div>
                <p className="text-xs text-slate-500"><MathText>{CASES_LINES.unique}</MathText> <SourceTag source={CASES_LINES.source} /></p>
              </PredictRule>
              <KnowledgeBrick id="halat-khassa" lead="ما يقوله الكتاب عن هاتين الحالتين:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">صنّف كل جملة:</p>}
                rows={[
                  { id: 'c1', label: <MathText>{'$\\begin{cases} x + y = 4 \\\\ 2x + 2y = 8 \\end{cases}$'}</MathText>, options: CASES, correct: 2, correction: <MathText>{'نقسم طرفي $2x + 2y = 8$ على 2: $x + y = 4$ ، المعادلة نفسها. كل ثنائية مجموعها 4 حل، مثل $(0 ; 4)$ و $(1 ; 3)$.'}</MathText> },
                  { id: 'c2', label: <MathText>{'$\\begin{cases} x + y = 4 \\\\ x + y = 5 \\end{cases}$'}</MathText>, options: CASES, correct: 1, correction: <MathText>{'لا يمكن أن يساوي $x + y$ العدد 4 والعدد 5 في آن واحد، و $4 \\neq 5$.'}</MathText> },
                  { id: 'c3', label: <MathText>{'$\\begin{cases} x + y = 4 \\\\ x - y = 2 \\end{cases}$'}</MathText>, options: CASES, correct: 0, correction: <MathText>{'عددان مجموعهما 4 وفرقهما 2: 3 و 1 فقط. الثنائية $(3 ; 1)$ : $3 + 1 = 4$ و $3 - 1 = 2$.'}</MathText> },
                ]}
                requires={['halat-khassa', 'ikhtibar-thunaiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: ثلاث جمل، ثلاث حالات.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
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
