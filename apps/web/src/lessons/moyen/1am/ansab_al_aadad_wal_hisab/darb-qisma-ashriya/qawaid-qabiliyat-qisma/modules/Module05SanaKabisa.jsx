import React, { useState } from 'react';
import { ContentModule, TapQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { CHALLENGE, LEAP } from '../content/textbook';
import { EX } from '../content/exercises';

/**
 * Module 5 — le تحدّ de l'unité (p. 35, « السّنة الكبيسة », déclaré `duplicatedIn` cette leçon) et sa réponse : أتعمّق 8
 * (p. 48) — divisible par 4, sauf les siècles non divisibles par 400. Transfert de la règle de 4. LP : P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module05SanaKabisa() {
  const [q1, setQ1] = useState(false);
  const [d1, setD1] = useState(false);
  return (
    <ContentModule
      objectives={['كيف نعرف أنّ سنة كبيسة؟', 'لماذا ليست 1900 كبيسة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(5)}
      moduleNumber={5}
      moduleTitle="تحدّي الوحدة — السنة الكبيسة"
      moduleSubtitle="سرّ شهر فيفري"
      estimatedTime="6 دقائق"
      brief={{ tag: 'تحدّ — الكتاب ص 35 و 48', title: 'السّنة الكبيسة', tone: 'rose', body: <p>{CHALLENGE.text}</p> }}
      steps={[
        { num: 1, title: 'القاعدة والاستثناء', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" text={LEAP.text} source={LEAP.source} compact />
              <TapQuestion
                prompt={<span>لماذا ليست السنة 1900 كبيسة، مع أنّ 00 يقبل القسمة على 4؟</span>}
                options={[M('لأنّ 1900 يقبل القسمة على 100 ولا يقبلها على 400'), M('لأنّ 1900 عدد فردي'), M('لأنّ 19 لا يقبل القسمة على 4')]}
                correct={0} cols={1} requires={['qabiliya-4']}
                explain={<MathText>{'$1900 = 400 \\times 4 + 300$ : الباقي ليس معدومًا. أمّا 2000 فيقبل القسمة على 400 ($2000 = 400 \\times 5$) فهي كبيسة.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ) },
        { num: 2, title: 'أتعمّق 8 — أيّ السنوات كبيسة؟', done: d1,
          content: <TextbookExercise exercise={EX['deep-8']} requires={['qabiliya-4']} onAnswered={() => setD1(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={5} />}
    />
  );
}
