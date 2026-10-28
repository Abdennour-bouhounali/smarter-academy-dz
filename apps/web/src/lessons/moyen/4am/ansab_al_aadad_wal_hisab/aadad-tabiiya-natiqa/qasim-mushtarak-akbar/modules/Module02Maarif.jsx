import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, IntegerSetQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE_3, KNOWLEDGE_4 } from '../content/textbook';

/**
 * Module 2 — معارف 3 (p. 10) et معارف 4 تعريف + ملاحظة (p. 12). LP : P1, P2, P4.
 * Rétrofit 2026-10-15 : il s'ouvre sur le labo (28 et 42, les listes) SANS carte ; chaque définition, brique et remarque vient APRÈS
 * la question qu'elle nomme, posée sur ce que l'élève a posé dans le labo (les communs, la case PGCD).
 * ORDRE : 1. les communs de 28 et 42 → la définition et l'exemple 12 / 18 ; 2. l'écriture du plus grand → briques « تعريف »
 * et « رمز » ; 3. les communs sont-ils les diviseurs du PGCD ? → brique de la remarque, puis la remarque du manuel.
 */
export default function Module02Maarif() {
  const [pgcd, setPgcd] = useState(null);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  return (
    <ContentModule objectives={["ما القاسم المشترك الأكبر لعددين؟", "كيف نكتبه برمز؟", "هل كل قاسم مشترك يقسم القاسم المشترك الأكبر؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="معارف — القواسم المشتركة والقاسم المشترك الأكبر" moduleSubtitle="التعريف، الرمز، وملاحظة الكتاب" estimatedTime="15 دقيقة"
      intro={<Manipulation type="common-divisors" a={28} b={42} startWith="lists" title="مثال الكتاب: 28 و 42" lead="اكشف قواسم 28 وقواسم 42، ثم ضع القواسم المشتركة في الوسط، وأكبرها في خانة PGCD." onFinished={(g) => setPgcd(g ?? true)} />}
      steps={[
        { num: 1, title: 'ما القواسم المشتركة لـ 28 و 42؟', subtitle: 'كما وضعتها في وسط لوحتك', done: q1,
          content: (
            <div className="space-y-3">
              <IntegerSetQuestion prompt={<span>اكتب القواسم المشتركة للعددين <MathText>{'$28$'}</MathText> و <MathText>{'$42$'}</MathText>.</span>} expected={[1, 2, 7, 14]} requires={['qawasim-mushtaraka']}
                explain="هي الأعداد الموجودة في القائمتين معًا." onAnswered={() => setQ1(true)} />
              {q1 && (
                <>
                  <TextbookBox kind="definition" text={KNOWLEDGE_3.definition} source={KNOWLEDGE_3.source} />
                  <TextbookBox kind="example" text={KNOWLEDGE_3.example} compact />
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'لماذا وضعتَ 14 وليس 7 في خانة الأكبر؟', subtitle: 'الخانة التي ملأتها في الوسط', done: q2,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li className={pgcd ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="pgcd" data-tried={pgcd ? 'true' : 'false'}>
                  {pgcd ? 'وضعتَ أكبر قاسم مشترك في خانته الخاصة.' : 'لم تملأ خانة الأكبر بعد — لا يمنعك شيء من الإجابة.'}
                </li>
              </ul>
              <TapQuestion prompt={<span>القواسم المشتركة لـ 28 و 42 هي 1 ، 2 ، 7 و 14. لماذا يحتل 14 الخانة الأخيرة وليس 7؟</span>}
                options={['لأنّ 14 أكبر القواسم التي تقسم العددين معًا', 'لأنّ 7 لا يقسم 42', 'لأنّ 14 مجموع 7 و 7 فقط', 'لأنّ 14 يقسم 28 دون 42']} correct={0} cols={1}
                explain={<span><MathText>{'$28 = 14 \\times 2$'}</MathText> و <MathText>{'$42 = 14 \\times 3$'}</MathText>: 14 يقسم العددين، و 7 يقسمهما أيضًا لكنه أصغر.</span>} onAnswered={() => setQ2(true)} />
              {q2 && (
                <>
                  <KnowledgeBrick id="pgcd-taarif" />
                  <KnowledgeBrick id="pgcd-ramz" compact />
                </>
              )}
            </div>
          ) },
        { num: 3, title: 'كيف نكتب أكبر قاسم مشترك لـ 28 و 42؟', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>القواسم المشتركة لـ 28 و 42 هي 1 ، 2 ، 7 و 14. كيف نكتب قاسمهما المشترك الأكبر؟</span>}
                options={['PGCD(28 ; 42) = 14', 'PGCD(28 ; 42) = 7', 'PGCD(28 ; 42) = 1', 'PGCD(14) = 28 ; 42'].map((o) => <bdi dir="ltr" key={o}>{o}</bdi>)} correct={0} cols={2} requires={['pgcd-taarif', 'pgcd-ramz']}
                explain={<span>أكبر القواسم المشتركة هو 14: <MathText>{'$\\mathrm{PGCD}(28\\ ;\\ 42) = 14$'}</MathText>.</span>} onAnswered={() => setQ3(true)} />
            </div>
          ) },
        { num: 4, title: 'ماذا تعرف عن القواسم المشتركة إذا عرفت أكبرها؟', done: q4,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>في لوحتك: القواسم المشتركة لـ 28 و 42 هي بالضبط قواسم العدد 14. إذا كان PGCD(a ; b) = 14 لعددين آخرين، فما هي كل القواسم المشتركة للعددين a و b؟</span>}
                options={['1 ، 2 ، 7 ، 14', '14 فقط', '1 و 14 فقط', 'لا يمكن معرفتها دون a و b']} correct={0} cols={2}
                explain={<span>القواسم المشتركة لعددين هي قواسم قاسمهما المشترك الأكبر: قواسم 14.</span>} onAnswered={() => setQ4(true)} />
              {q3 && (
                <>
                  <KnowledgeBrick id="qawasim-al-pgcd" lead="انظر القائمتين: القواسم المشتركة 1 ، 2 ، 7 ، 14 هي بالضبط قواسم 14." />
                  <TextbookBox kind="remark" text={KNOWLEDGE_4.remark} source={KNOWLEDGE_4.source} compact />
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
