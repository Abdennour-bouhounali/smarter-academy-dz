import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';

/**
 * Module 3 — أتعمّق (p. 75) : les exercices 32 (g est-elle linéaire ? — non, −8x² + 17√2x − 24),
 * 37 (nitrates : 61,54 mg/L > 45, eau non potable), 38 (un sixième n'a pas voté : 83,33 % ≥ 80 %,
 * l'affirmation tient) et 39 (0,4 g de sucre dans 540 mL : ≈ 0,74 g/L), au mot près, découpés
 * étape par étape. La brique `ikhtibar-khattiya` est posée entre le développement et le verdict
 * de l'ex. 32 ; `tarkiz` avant l'ex. 37 ; `nisba-juz` avant l'ex. 38 — chacune DIT la méthode,
 * jamais la réponse qui suit. LP : P1, P2, P3.
 */
export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (n) => partsOf(n).every((ex) => done[ex.id]);
  const part = (id) => partsOf(id.split('-')[1]).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="دالة خطية أم لا؟ نترات الماء، الناخبون، وعصير البرتقال"
      estimatedTime="11 دقيقة"
      brief={{ tag: 'أتعمّق — الكتاب ص 75', title: 'أربع وضعيات أخرى: نبسّط، نحوّل الوحدات، نقارن ونفسّر', tone: 'rose',
        body: <p>في كل تمرين: نحدّد المقادير ووحداتها، نحسب، ثم نجيب عن السؤال المطروح بجملة في سياقه (صالح للشرب؟ القول صحيح؟).</p> }}
      steps={[
        { num: 1, title: 'تمرين 32 — هل g دالة خطية؟', done: all('32'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-32-1')} requires={['shakl-khatti']} onAnswered={mark('ex-32-1')} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : le critère « de la forme $ax$ » est shakl-khatti (درس 2), et la question 32-1 juste
                  au-dessus vient de faire développer et simplifier (« ننشر ونبسّط العبارة أولا »). */}
              <KnowledgeBrick id="ikhtibar-khattiya" variant="rappel" lead="لا نحكم على الدستور كما كُتب: ننشر ونبسّط ثم ننظر إلى شكله." />
              <TextbookExercise exercise={part('ex-32-2')} requires={['ikhtibar-khattiya']} onAnswered={mark('ex-32-2')} />
            </div>
          ) },
        { num: 2, title: 'تمرين 37 — نترات مياه الشرب', done: all('37'),
          content: (
            <div className="space-y-3">
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : الكتلة الحجمية = كتلة ÷ حجم est posée par « تطبيقات التناسبية » (المقادير المركّبة, درس 4)
                  et le changement d’unité par tahwil-murakkab. */}
              <KnowledgeBrick id="tarkiz" variant="rappel" lead="الحد المسموح كتلة في كل لتر: نحسب كتلة النترات في لتر من هذا الماء." />
              <TextbookExercise exercise={part('ex-37-1')} requires={['tarkiz', 'maqadir-murakkaba']} onAnswered={mark('ex-37-1')} />
              <TextbookExercise exercise={part('ex-37-2')} requires={['tarkiz']} onAnswered={mark('ex-37-2')} />
            </div>
          ) },
        { num: 3, title: 'تمرين 38 — الناخبون', done: all('38'),
          content: (
            <div className="space-y-3">
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : le pourcentage d’une partie d’un tout est nisba-akhdh de « تطبيقات التناسبية » (درس 4). */}
              <KnowledgeBrick id="nisba-juz" variant="rappel" />
              <TextbookExercise exercise={part('ex-38-1')} requires={['nisba-juz', 'nisba-mia']} onAnswered={mark('ex-38-1')} />
              <TextbookExercise exercise={part('ex-38-2')} requires={['nisba-juz']} onAnswered={mark('ex-38-2')} />
            </div>
          ) },
        { num: 4, title: 'تمرين 39 — عصير البرتقال', done: all('39'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-39-1')} requires={['maqadir-murakkaba']} onAnswered={mark('ex-39-1')} />
              <TextbookExercise exercise={part('ex-39-2')} requires={['tarkiz']} onAnswered={mark('ex-39-2')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
