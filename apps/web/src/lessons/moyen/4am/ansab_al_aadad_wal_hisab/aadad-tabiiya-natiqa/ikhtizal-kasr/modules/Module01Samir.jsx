import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { KitchenScene } from '../../../../../../common/manipulations/primitives/ContextScenes';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';
/**
 * Module 1 — نشاط 8 (p. 9) : la réduction de سمير, manipulée (fraction-reduction). LP : P1, P2.
 *
 * Le kasr est une RECETTE (thème `kitchen`) : 84 cuillères de sucre pour 48
 * tasses de farine. Diviser les deux termes par 4, c'est répartir les deux
 * ingrédients en 4 parts identiques — et la fraction réduite est ce que
 * contient UNE part. Le chemin de سمير (÷4 puis ÷3) se voit en parts de
 * parts ; la division par le PGCD, en 12 parts d'un coup.
 */
export default function Module01Samir() {
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { n, d, path } = ACTIVITY.numbers;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 8 — كيف اختزل سمير 84/48؟" moduleSubtitle="÷4 ثم ÷3 … ثم لا شيء" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 9', title: ACTIVITY.title, tone: 'indigo',
        headline: 'هيا نحضّر الوصفة!', emoji: '🥣', visual: <KitchenScene />,
        body: <div className="space-y-1"><p><MathText>{ACTIVITY.questions[0]}</MathText></p><p className="text-center text-lg"><MathText>{ACTIVITY.samirPath}</MathText></p><SourceTag source={ACTIVITY.source} /></div> }}
      intro={(
        // Le niveau par défaut sert LA TÂCHE DU MODULE : ce module porte
        // l'activité du manuel dans son titre, et sa première étape attend
        // que CETTE manipulation soit finie (`onFinished`). Ouvrir sur le
        // petit nombre cachait l'activité derrière un onglet et laissait
        // l'élève devant une étape qu'il ne pouvait pas satisfaire.
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="كسر سمير 84/48 كوصفة: 84 ملعقة سكّر لـ 48 كوب دقيق. القسمة على قاسم مشترك = التوزيع على حصص متماثلة. وللتمرّن أولًا، جرّب المستوى المبتدئ بوصفة أصغر."
          levels={{
            beginner: () => (
              <Manipulation type="fraction-reduction" n={12} d={18}
                title="تمرّن أولًا: 12/18"
                lead="12 ملعقة سكّر لـ 18 كوبًا من الدقيق. اسحب عددًا من الحصص على الوصفة: إن كانت الحصص متماثلة، فالحصة الواحدة هي الوصفة المختزلة. وعندما لا تستطيع المواصلة، قل ذلك." />
            ),
            advanced: () => (
              <Manipulation type="fraction-reduction" n={n} d={d} path={path}
                title="اختزل 84/48 بنفسك"
                lead="اسحب عددًا من الحصص على الوصفة، اقرأ الحصة الواحدة، وأعد. أنت من يقرّر متى لا يمكن الاختزال أكثر."
                onFinished={() => setLabDone(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'أ) اشرح طريقة سمير', subtitle: 'أنهِ الاختزال في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ikhtizal" />
              {!labDone && <p className="text-sm text-slate-600">في المناولة: اقسم على قاسم مشترك، ثم على آخر، حتى لا يبقى إلا 1.</p>}
              <TapQuestion prompt={<span>ما الذي فعله سمير في كل خطوة؟</span>}
                options={['قسم البسط والمقام على قاسم مشترك لهما (4 ثم 3)', 'طرح 4 ثم 3 من البسط والمقام', 'قسم البسط فقط', 'ضرب البسط والمقام في 4 ثم 3']} correct={0} cols={1} requires={['ikhtizal']}
                explain={<span>القسمة على قاسم مشترك لا تغيّر قيمة الكسر: <MathText>{'$\\dfrac{84}{48} = \\dfrac{21}{12} = \\dfrac{7}{4}$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'هل يمكن مواصلة اختزال 7/4؟ لماذا؟', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="kasr-ghayr-qabil" lead="7 و 4 لا يقسمهما معًا إلا 1: أوليان فيما بينهما." />
              <TapQuestion prompt={<span>لماذا لا يمكن مواصلة اختزال <MathText>{'$\\dfrac{7}{4}$'}</MathText>؟</span>}
                options={['لأن 7 و 4 أوليان فيما بينهما: PGCD(7 ; 4) = 1', 'لأن 7 عدد أولي', 'لأن 4 أصغر من 7', 'لأن 7 − 4 = 3 عدد فردي']} correct={0} cols={1} requires={['kasr-ghayr-qabil']}
                explain={<MathText>{ACTIVITY.questions[2]}</MathText>} onAnswered={() => setQ2(true)} />
              {q2 && <TextbookBox kind="remark" text={ACTIVITY.questions[2]} compact />}
              {/* La « مسألة الدرس » prolonge la recette du niveau متقدم : mêmes
                  حصص متماثلة, 105 ملاعق سكّر و 147 كوبًا — résolue au module 5. */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
