import React, { useState } from 'react';
import { ContentModule, BatchChoiceQuestion, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { RESULTS } from '../content/textbook';

/** Module 2 — معارف 4 « نتائج مباشرة » (p. 12) avec les quatre exemples du manuel. LP : P2, P3. */
export default function Module02NataijMubashira() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="معارف — نتائج مباشرة" moduleSubtitle="أربع نتائج لا تحتاج إلى حصر" estimatedTime="10 دقائق"
      brief={{ tag: 'معارف — الكتاب ص 12', title: 'نتائج مباشرة', tone: 'violet', body: <p>في حالات خاصة نعرف PGCD دون كتابة أي قائمة. الكتاب يذكر أربعًا.</p> }}
      steps={[
        { num: 1, title: 'اقرأ النتائج، ثم طبّقها على أمثلة الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="nataij-mubashira" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">ما قيمة كل قاسم مشترك أكبر؟</p>}
                rows={[
                  { id: 'a', label: 'PGCD(28 ; 28)', options: ['28', '1', '56'], correct: 0 },
                  { id: 'b', label: 'PGCD(7 ; 0)', options: ['0', '7', '1'], correct: 1, correction: 'PGCD(a ; 0) = a.' },
                  { id: 'c', label: 'PGCD(8 ; 40)', options: ['8', '40', '4'], correct: 0, correction: 'PGCD(8 ; 40) = PGCD(40 ; 8) = 8.' },
                ]}
                requires={['nataij-mubashira']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{RESULTS.examples.map((e) => <span key={e} dir="ltr" className="font-mono me-3">{e}</span>)}</Feedback>}
                onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'إذا كان b قاسمًا للعدد a', done: q2,
          content: (
            <div className="space-y-3">
              {/* « rappel » : la règle est déjà posée à l'étape 1 (corps de « nataij-mubashira »,
                  3e résultat du manuel) et appliquée à PGCD(8 ; 40) — la redemander serait factice. */}
              <KnowledgeBrick id="pgcd-idha-qasim" variant="rappel" />
              <TextbookBox kind="example" text="PGCD(40 ; 8) = 8 لأن 8 قاسم للعدد 40." source={RESULTS.source} compact />
              <TapQuestion prompt={<span>21 قاسم للعدد 63. إذن <MathText>{'$\\mathrm{PGCD}(63\\ ;\\ 21)$'}</MathText> يساوي ...</span>}
                options={['21', '63', '3', '1']} correct={0} cols={2} requires={['pgcd-idha-qasim']}
                explain={<span>عندما يكون b قاسمًا لـ a، فكل قاسم لـ b قاسم مشترك، وأكبرها b نفسه.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
