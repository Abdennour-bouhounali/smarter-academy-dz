import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { bidi } from '../../../../../../../utils/bidi';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 34) « النشر » : la définition (déjà posée au module 1,
 * relue ici dans l'encadré du livre), les trois propriétés et les deux
 * exemples du livre. k(a ± b) est posée par sa brique avant l'essai qui
 * l'exige ; l'exemple (2x − 1)(x + 4) = 2x² + 7x − 4 est manipulé dans le
 * MÊME instrument qu'au module 1 (le terrain découpé) — un exemple travaillé,
 * un seul niveau (`levels={false}`) ; la réduction (tabsit) est posée après
 * lui, avec les parenthèses précédées de −. LP : P1–P4.
 */
const M = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — النشر"
      moduleSubtitle="تعريف، ثلاث خاصيات، ثم التبسيط"
      estimatedTime="10 دقائق"
      brief={{
        tag: 'معارف — الكتاب ص 34', title: KNOWLEDGE.title, tone: 'violet',
        body: <p>في النشاط كتبت مساحة الملعب، وهي جداء، على شكل مجموع مساحات مناطقه. الكتاب يسمّي ذلك نشرًا، ويعطي ثلاث خاصيات ومثالين.</p>,
      }}
      intro={
        <Manipulation
          type="pitch-expansion"
          expr={KNOWLEDGE.pitch}
          levels={false}
          title={bidi('مثال الكتاب: ملعب بعداه 2x − 1 و x + 4')}
          lead={<MathText>{'الكتاب يكتب $(2x - 1)(x + 4) = 2x^2 + 8x - x - 4 = 2x^2 + 7x - 4$. تحقّق في الملعب: احسب المناطق الأربع، اجمع المتشابهة، ثم تحقّق من أجل قيمتين لـ $x$.'}</MathText>}
        />
      }
      steps={[
        {
          num: 1, title: 'التعريف والخاصية التوزيعية', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />
              <KnowledgeBrick id="tawziiya-nashr" lead={<MathText>{'في النشاط ضربت $x$ في $3x + 1$ و $5x$ في $1 - x$. الكتاب يكتب القاعدة لكل الأعداد:'}</MathText>} />
              <TapQuestion
                prompt={<MathText>{'$-4(2y - 3) = \\ldots$'}</MathText>}
                options={['$-8y - 12$', '$-8y + 12$', '$-8y - 3$'].map(M)}
                correct={1}
                cols={3}
                requires={['tawziiya-nashr']}
                explain={<MathText>{'$-4 \\times 2y - (-4) \\times 3 = -8y + 12$: العدد $-4$ يُضرب في الحدّين، و $(-4) \\times (-3) = 12$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'جداء قوسين: مثال الكتاب', subtitle: 'الملعب أعلاه', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="nashr-qawsayn" variant="rappel" compact />
              <TextbookBox kind="example" lines={KNOWLEDGE.examples} compact />
              <TapQuestion
                prompt={<MathText>{'في السطر $2x^2 + 8x - x - 4$ ، من أين جاء الحد $-x$ ؟'}</MathText>}
                options={['$2x \\times 4$', '$(-1) \\times x$', '$(-1) \\times 4$'].map(M)}
                correct={1}
                cols={3}
                requires={['nashr-qawsayn']}
                explain={<MathText>{'الجداءات الأربعة: $2x \\times x = 2x^2$ ، $2x \\times 4 = 8x$ ، $(-1) \\times x = -x$ و $(-1) \\times 4 = -4$ — المناطق الأربع في الملعب.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'التبسيط: نجمع الحدود المتشابهة', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tabsit" lead={<MathText>{'في مثال الكتاب جمعنا $8x - x = 7x$، وتركنا $2x^2$ و $-4$ كما هما:'}</MathText>} />
              <TapQuestion
                prompt={<MathText>{'بسّط: $3y^2 + 5y - 2y^2 - 9y + 1 = \\ldots$'}</MathText>}
                options={['$5y^2 - 4y + 1$', '$-3y^3 + 1$', '$y^2 - 4y + 1$'].map(M)}
                correct={2}
                cols={3}
                requires={['tabsit']}
                explain={<MathText>{'$3y^2 - 2y^2 = y^2$ و $5y - 9y = -4y$، والحد 1 يبقى: لا نجمع $y^2$ مع $y$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'التبسيط: قوسان مسبوقان بإشارة ناقص', done: q4,
          content: (
            <TapQuestion
              prompt={<MathText>{'بسّط: $2x - (x^2 - 3x + 2) = \\ldots$'}</MathText>}
              options={['$-x^2 - x + 2$', '$-x^2 + 5x - 2$', '$x^2 + 5x - 2$'].map(M)}
              correct={1}
              cols={3}
              requires={['tabsit', 'hadhf-aqwas']}
              explain={<MathText>{'$2x - x^2 + 3x - 2 = -x^2 + 5x - 2$: كل حد داخل القوسين تتغيّر إشارته.'}</MathText>}
              onAnswered={() => setQ4(true)}
            />
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
