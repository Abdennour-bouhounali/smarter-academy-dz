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
 *
 * Rétrofit 2026-10-15 (§4quater) : le labo ouvre le module SANS carte `brief` et son `lead` n'écrit plus le résultat du livre
 * (2x² + 7x − 4) avant l'essai ; l'encadré « définition », l'exemple du livre et les briques `tawziiya-nashr` / `nashr-qawsayn` /
 * `tabsit` viennent APRÈS la réponse à la question qui les aurait donnés (les `requires` de ces questions sont retirés).
 */
const M = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : l'étape 2 est faite quand leur suite l'est
  const [cps, setCps] = useState([]);
  const answered = (id) => cps.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      objectives={["ماذا يعني «نشر» عبارة؟", "كيف نضرب قوسين حدًّا حدًّا؟", "ماذا يحدث حين يسبق القوسَين إشارة ناقص؟"]}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — النشر"
      moduleSubtitle="مثال الملعب، ثم التبسيط"
      estimatedTime="10 دقائق"
      intro={
        <Manipulation
          type="pitch-expansion"
          expr={KNOWLEDGE.pitch}
          levels={false}
          title={bidi('مثال الكتاب: ملعب بعداه 2x − 1 و x + 4')}
          lead={<MathText>{'مثال الكتاب نفسه: أربع مناطق، منها اثنتان مقتطعتان.'}</MathText>}
          onCheckpoint={(e) => setCps((l) => [...l, e])}
        />
      }
      steps={[
        {
          num: 1, title: 'التعريف والخاصية التوزيعية', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'$-4(2y - 3) = \\ldots$'}</MathText>}
                options={['$-8y - 12$', '$-8y + 12$', '$-8y - 3$'].map(M)}
                correct={1}
                cols={3}
                requires={['khassiya-tawziiya']}
                explain={<MathText>{'$-4 \\times 2y - (-4) \\times 3 = -8y + 12$: العدد $-4$ يُضرب في الحدّين، و $(-4) \\times (-3) = 12$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />}
              {q1 && <KnowledgeBrick id="tawziiya-nashr" variant="rappel" lead={<MathText>{'في النشاط ضربت $x$ في $3x + 1$ و $5x$ في $1 - x$. الكتاب يكتب القاعدة لكل الأعداد:'}</MathText>} />}
            </div>
          ),
        },
        {
          num: 2, title: 'جداء قوسين: مثال الكتاب', subtitle: 'الملعب أعلاه', done: answered(KNOWLEDGE.pitch),
          content: (
            <div className="space-y-3">
              <p data-evidence="checkpoint" data-tried={answered(KNOWLEDGE.pitch) ? 'true' : 'false'}
                className={`rounded-xl border-2 px-3 py-2 text-sm ${answered(KNOWLEDGE.pitch) ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
                {answered(KNOWLEDGE.pitch)
                  ? <MathText>{'أجبتَ في المختبر: مناطق الملعب الأربع $2x \\times x = 2x^2$ ، $2x \\times 4 = 8x$ ، $(-1) \\times x = -x$ و $(-1) \\times 4 = -4$ ، فجاء الحدّ $-x$ من $(-1) \\times x$.'}</MathText>
                  : 'احمل مناطق الملعب أعلاه كلّها، وتحقّق من قيمتين، ثم أجب عن الأسئلة التي تظهر فوق المختبر.'}
              </p>
              {answered(KNOWLEDGE.pitch) && <KnowledgeBrick id="nashr-qawsayn" variant="rappel" compact />}
              {answered(KNOWLEDGE.pitch) && <TextbookBox kind="example" lines={KNOWLEDGE.examples} compact />}
            </div>
          ),
        },
        {
          num: 3, title: 'التبسيط: ماذا نفعل بالحدود؟', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'بسّط: $3y^2 + 5y - 2y^2 - 9y + 1 = \\ldots$'}</MathText>}
                options={['$5y^2 - 4y + 1$', '$-3y^3 + 1$', '$y^2 - 4y + 1$'].map(M)}
                correct={2}
                cols={3}
                explain={<MathText>{'$3y^2 - 2y^2 = y^2$ و $5y - 9y = -4y$، والحد 1 يبقى: لا نجمع $y^2$ مع $y$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="tabsit" lead={<MathText>{'في مثال الكتاب جمعنا $8x - x = 7x$، وتركنا $2x^2$ و $-4$ كما هما:'}</MathText>} />}
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
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
