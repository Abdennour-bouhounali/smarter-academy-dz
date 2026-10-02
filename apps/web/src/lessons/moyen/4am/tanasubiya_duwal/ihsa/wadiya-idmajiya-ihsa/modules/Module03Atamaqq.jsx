import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookExercise, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf, EX20, SCREEN } from '../content/exercises';
import StatTable from '../components/StatTable';

/**
 * Module 3 — أتعمّق (p. 101) : l'exercice 20 (CORRIGÉ : médiane 6,5 → a = 2, b = 1, une ligne discrète),
 * puis deux situations de la plateforme qui croisent les دروس (TRANSFERT) : زمن الشاشة (effectif inconnu
 * par l'effectif total, médiane par le rang 13, « على الأكثر » en pourcentage) et مسابقة القسم (même
 * moyenne, étendues et médianes différentes). La brique `takrar-majhul` est posée entre la somme a + b et
 * le choix du couple ; `tajnid-mawarid` avant زمن الشاشة — chacune DIT la méthode, jamais la réponse.
 * LP : P1, P2, P3.
 */
export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (p) => partsOf(p).every((ex) => done[ex.id]);
  const part = (id) => partsOf(id.replace(/-\d+$/, '')).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="تكراران مجهولان، زمن الشاشة، ومسابقة بين مجموعتين"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أتعمّق — الكتاب ص 101 ووضعيتان من المنصّة', title: 'نختار المؤشر المناسب لكل سؤال، ثم نحسب ونفسّر', tone: 'rose',
        body: <p>في كل تمرين: ما المجهول؟ أيّ معطى يحدّده (التكرار الكلي، رتبة الوسيط، المتوسط، التكرار المجمع)؟ ثم نجيب بجملة في سياق الوضعية.</p> }}
      steps={[
        { num: 1, title: 'تمرين 20 — تكراران مجهولان', done: all('ex-20'),
          content: (
            <div className="space-y-3">
              <StatTable id="ex-20" values={EX20.table.values} counts={EX20.table.counts} />
              <p className="text-xs text-slate-500" data-correction="ex-20"><MathText>{EX20.correction}</MathText></p>
              <TextbookExercise exercise={part('ex-20-1')} requires={['takrar-kulli']} onAnswered={mark('ex-20-1')} />
              <TextbookExercise exercise={part('ex-20-2')} requires={['wasit-rutba']} onAnswered={mark('ex-20-2')} />
              <KnowledgeBrick id="takrar-majhul" lead="نعرف مجموع التكرارين؛ رتبتا الوسيط تحدّدان كيف يتوزّع." />
              <TextbookExercise exercise={part('ex-20-3')} requires={['takrar-majhul', 'takrar-mujamma']} onAnswered={mark('ex-20-3')} />
            </div>
          ) },
        { num: 2, title: 'زمن الشاشة في القسم', done: all('shasha'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tajnid-mawarid" lead="قبل الحساب: أيّ مؤشر يجيب عن كل سؤال؟" />
              <StatTable id="shasha" valueLabel="عدد الساعات" countLabel="عدد التلاميذ" values={SCREEN.table.values} counts={SCREEN.table.counts} />
              <p className="text-xs"><SourceTag source={SCREEN.source} /></p>
              <TextbookExercise exercise={part('shasha-1')} requires={['takrar-kulli']} onAnswered={mark('shasha-1')} />
              <TextbookExercise exercise={part('shasha-2')} requires={['wasit-rutba', 'takrar-mujamma']} onAnswered={mark('shasha-2')} />
              <TextbookExercise exercise={part('shasha-3')} requires={['takrar-mujamma', 'tajnid-mawarid']} onAnswered={mark('shasha-3')} />
            </div>
          ) },
        { num: 3, title: 'مسابقة القسم — مجموعتان', done: all('musabaqa'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('musabaqa-1')} requires={['mada', 'tajnid-mawarid']} onAnswered={mark('musabaqa-1')} />
              <TextbookExercise exercise={part('musabaqa-2')} requires={['wasit-rutba', 'mutawassit-murajjah']} onAnswered={mark('musabaqa-2')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
