import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, RECALL_ADD, GUIDE } from '../content/textbook';
import { getLessonPath } from '@smarter-academy/core';
import { Link } from 'react-router-dom';

/**
 * Module 2 — معارف : sans labo, le module s'ouvre sur sa PREMIÈRE question (§4quater). L'élève a VU que (−) × (−) est positif ; ici il
 * voit POURQUOI il le faut : si (−3) × (−4) était négatif, (−3) × 4 + (−3) × (−4) ne vaudrait pas (−3) × 0 = 0. Le raisonnement est le
 * نشاط 3 du manuel, redessiné (autres nombres) : la distributivité sert UNE fois, comme ARGUMENT (jamais enseignée ici comme technique), puis
 * le tableau (−4) × n dont le deuxième facteur baisse de 1, puis les décimaux. Les additions de 2AM sont RAPPELÉES (« تذكّر »), jamais
 * reconstruites. Les encadrés viennent APRÈS la réponse. LP : P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module02Maarif() {
  const [q, setQ] = useState({});
  const answered = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  const recallPath = getLessonPath(RECALL_ADD.lesson);
  return (
    <ContentModule
      objectives={['كيف أحسب $(-3) \\times 4$ ؟', 'لماذا يجب أن يكون جداء سالبين موجبًا؟', 'ماذا يحدث في جدول جداءات ينقص عاملها الثاني؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — لماذا جداء سالبين موجب؟"
      moduleSubtitle="الخاصية التوزيعية دليلًا، ثم جدول"
      estimatedTime="12 دقيقة"
      steps={[
        {
          num: 1, title: 'ما قيمة $(-3) \\times 4$ ؟', subtitle: 'جمع متكرر', done: !!q.a,
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'احسب: $(-3) \\times 4$'}</MathText>}
                expected={-12} display="−12" requires={['jidaa-jamaa']}
                explain={<MathText>{'$(-3) + (-3) + (-3) + (-3) = -12$ : أربعة حدود كلّها $-3$ .'}</MathText>}
                onAnswered={answered('a')}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا يساوي الجداء $(-3) \\times 0$ ؟', subtitle: 'توزيع الضرب مرّة واحدة', done: !!q.b,
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'أكمل: $(-3) \\times 4 + (-3) \\times (-4) = (-3) \\times \\big(4 + (-4)\\big) = (-3) \\times 0 = \;?$'}</MathText>}
                expected={0} requires={['jidaa-jamaa']}
                explain={<MathText>{'العددان $4$ و $-4$ معاكسان فمجموعهما $0$ ، وأيّ عدد في $0$ يعطي $0$ .'}</MathText>}
                onAnswered={answered('b')}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'ما قيمة $(-3) \\times (-4)$ ؟', subtitle: 'العدد الذي يُتمّ $-12$ إلى 0', done: !!q.c,
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'إذن $-12 + (-3) \\times (-4) = 0$ . ما العدد الذي إذا أُضيف إلى $-12$ أعطى $0$ ؟ وهو قيمة $(-3) \\times (-4)$ .'}</MathText>}
                expected={12} requires={['jidaa-jamaa']}
                explain={<MathText>{GUIDE.negneg.why + ' ' + GUIDE.negneg.right}</MathText>}
                onAnswered={answered('c')}
              />
              {q.c && <KnowledgeBrick id="tabrir-tawzi" lead="لو كان $(-3) \\times (-4)$ سالبًا، فهل يبقى المجموع صفرًا؟" />}
              {q.c && <TextbookBox kind="property" compact text={KNOWLEDGE.justify.text} source={KNOWLEDGE.justify.source} />}
            </div>
          ),
        },
        {
          num: 4, title: 'ماذا بعد الصفر في الجدول؟', subtitle: 'جدول ينقص عاملُه الثاني', done: !!q.d,
          content: (
            <div className="space-y-3">
              <div className="rounded-2xl border-2 border-indigo-100 bg-white p-3 text-center" dir="ltr">
                {KNOWLEDGE.table.rows.map((r) => <p key={r}><MathText>{`$${r}$`}</MathText></p>)}
              </div>
              <TapQuestion
                prompt={<MathText>{'كلّما نقص العامل الثاني بـ 1 زاد الجداء بـ 4. أكمل: $(-4) \\times (-1)$ و $(-4) \\times (-2)$ يساويان:'}</MathText>}
                options={[M('$4$ و $8$'), M('$-4$ و $-8$'), M('$-5$ و $-6$')]}
                correct={0} cols={3} requires={['tabrir-tawzi']}
                explain={<MathText>{'نتابع: $0 \\to 4 \\to 8$ . ($-4$ و $-8$ يتابعان نقصان الجداء، و $-5$ و $-6$ جمع.)'}</MathText>}
                onAnswered={answered('d')}
              />
              {q.d && <KnowledgeBrick id="jadwal-munakhafid" lead="جدول يُنقَص عامله الثاني بواحد: ماذا يحدث للجداء؟" />}
              {q.d && <TextbookBox kind="remark" compact text={KNOWLEDGE.table.text} source={KNOWLEDGE.table.source} />}
            </div>
          ),
        },
        {
          num: 5, title: 'وإذا كان العددان عشريين؟', subtitle: 'الطريقة نفسها', done: !!q.e,
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'$(-2{,}5) \\times 0{,}4 = -1$ . استعمل الطريقة نفسها لتجد $(-2{,}5) \\times (-0{,}4)$ .'}</MathText>}
                expected={1} requires={['tabrir-tawzi']}
                explain={<MathText>{'$(-2{,}5) \\times 0{,}4 + (-2{,}5) \\times (-0{,}4) = (-2{,}5) \\times 0 = 0$ ، وعدد يُتمّ $-1$ إلى $0$ هو $1$ .'}</MathText>}
                onAnswered={answered('e')}
              />
              {q.e && (
                <TextbookBox kind="remark" compact title={RECALL_ADD.title} text={RECALL_ADD.text} source={RECALL_ADD.source}>
                  {recallPath && <Link to={recallPath} className="inline-flex min-h-[44px] items-center text-sm font-bold text-teal-700 underline underline-offset-4" data-recall-link>درس « جمع وطرح الأعداد النسبية » — السنة الثانية متوسط</Link>}
                </TextbookBox>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
