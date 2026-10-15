import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';
/**
 * Module 1 — l'ENTRÉE : la recette qu'on partage (fraction-reduction), puis le نشاط 8 (p. 9) de سمير posé APRÈS la réponse (rétrofit 2026-10-15 :
 * labo en tête sans carte ni titre, briques `ikhtizal` / `kasr-ghayr-qabil` après leur question, la 1re question demande POURQUOI). LP : P1, P2.
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
    <ContentModule objectives={["كيف اختزل سمير 84/48 خطوة بعد خطوة؟", "متى لا يمكن الاختزال أكثر؟", "كيف أتأكّد أن الكسر انتهى اختزاله؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 8 — كيف اختزل سمير 84/48؟" moduleSubtitle="÷4 ثم ÷3 … ثم لا شيء" estimatedTime="12 دقيقة"
      intro={(
        // Le labo EN TÊTE, sans carte ni titre (rétrofit 2026-10-15) : la recette (contexte) et la mission
        // (UNE question) sont ceux du labo. Le niveau par défaut sert la tâche du module :
        // la première étape attend que CETTE manipulation soit finie (`onFinished`), sans jamais bloquer.
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation type="fraction-reduction" n={12} d={18} />
            ),
            advanced: () => (
              <Manipulation type="fraction-reduction" n={n} d={d} path={path}
                onFinished={() => setLabDone(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'أ) لماذا تبقى الوصفة هي نفسها؟', subtitle: 'أنهِ الاختزال في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={labDone ? 'true' : 'false'}>
                {labDone
                  ? <span className="font-bold text-slate-800">أنهيتَ اختزال <bdi dir="ltr">84/48</bdi> في المناولة.</span>
                  : <span className="text-slate-500">لم تنهِ اختزال 84/48 بعد في المناولة (المستوى المتقدّم): وزّع الوصفة على حصص متماثلة حتى لا تستطيع المواصلة.</span>}
              </p>
              <TapQuestion prompt={<span>في كل مرة وزّعتَ فيها الوصفة على حصص متماثلة، كانت الحصة الواحدة تحمل الكسر الجديد. لماذا بقيت قيمة الكسر نفسها؟</span>}
                options={['لأن البسط والمقام قُسما على العدد نفسه، وهو قاسم لهما معًا', 'لأن العددين صغرا، فصار الكسر أصغر', 'لأننا قسمنا البسط فقط', 'لأننا طرحنا العدد نفسه من البسط والمقام']} correct={0} cols={1}
                explain={<span>القسمة على قاسم مشترك لا تغيّر قيمة الكسر: <MathText>{'$\\dfrac{84}{48} = \\dfrac{21}{12} = \\dfrac{7}{4}$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              {q1 && <KnowledgeBrick id="ikhtizal" />}
              {q1 && (
                <div className="space-y-1 text-center">
                  <p className="text-sm text-slate-600">وهكذا فعل سمير في نشاط الكتاب:</p>
                  <p className="text-lg"><MathText>{ACTIVITY.samirPath}</MathText></p>
                  <SourceTag source={ACTIVITY.source} />
                </div>
              )}
            </div>
          ) },
        { num: 2, title: 'هل يمكن مواصلة اختزال 7/4؟ لماذا؟', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>لماذا لا يمكن مواصلة اختزال <MathText>{'$\\dfrac{7}{4}$'}</MathText>؟</span>}
                options={['لأن 7 و 4 أوليان فيما بينهما: PGCD(7 ; 4) = 1', 'لأن 7 عدد أولي', 'لأن 4 أصغر من 7', 'لأن 7 − 4 = 3 عدد فردي']} correct={0} cols={1}
                explain={<MathText>{ACTIVITY.questions[2]}</MathText>} onAnswered={() => setQ2(true)} />
              {q2 && <KnowledgeBrick id="kasr-ghayr-qabil" lead="7 و 4 لا يقسمهما معًا إلا 1: أوليان فيما بينهما." />}
              {q2 && <TextbookBox kind="remark" text={ACTIVITY.questions[2]} compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
