import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE : 17 stylos et 18 cahiers à ranger en trousses identiques (plateforme, thème `school`), puis 22 et 35 sur les
 * listes (niveau متقدم) et le cas de مريم (27 et 36). UNE PISTE (rétrofit 2026-10-15) : le labo en tête SANS carte ni titre de
 * workspace ; des questions sur ce que l'élève a fait ; la brique de chaque règle APRÈS la réponse.
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels) :
 *   مبتدئ  — 17 stylos et 18 cahiers (thème `school`) : l'élève essaie 2, 3, 4… trousses et RIEN ne marche sauf 1.
 *   متقدم  — 22 et 35 (question ب), directement sur les listes, sans aucun guidage : l'élève bâtit la preuve lui-même.
 * Étape 1 : POURQUOI seule 1 trousse marche (sa propre expérience), puis la définition (brique + remarque du manuel) ; étape 2 :
 * le cas de مريم (27 et 36) — qu'est-ce qui suffit à la contredire ? — puis la brique de la méthode de réfutation.
 */
export default function Module01SabaataAsharWaThamaniyataAshar() {
  const [c1, setC1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["هل تنجح حقائب متماثلة بـ 17 قلمًا و 18 كراسًا؟ كم حقيبة ممكنة؟", "كيف أتأكّد أن عددين لا يتقاسمان إلا الواحد؟", "هل مريم على صواب في 27 و 36؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 7 — العددان الأوّليّان فيما بينهما" moduleSubtitle="جرّب الحقائب ثم فسّر ما وجدت" estimatedTime="12 دقيقة"
      intro={(
        <ManipulationWorkspace
          levels={{
            beginner: () => (
              <Manipulation type="coprime-explorer" a={17} b={18} startWith="groups" theme="school"
                title="17 قلمًا و 18 كراسًا: كم حقيبة متماثلة؟"
                onFinished={() => setC1(true)} />
            ),
            advanced: () => (
              <Manipulation type="coprime-explorer" a={22} b={35} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'لماذا لم تنجح إلا حقيبة واحدة؟', subtitle: 'السؤال أ) من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li data-evidence="bags" data-tried={c1 ? 'true' : 'false'} className={c1 ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {c1 ? 'جرّبتَ كل عدد من الحقائب مع 17 قلمًا و 18 كراسًا.' : 'لم تنهِ تجربة الحقائب بعد: عُد إلى المناولة أعلاه وأضف الحقائب واحدة بعد أخرى.'}
                </li>
              </ul>
              <TapQuestion prompt={<span>جرّبتَ 2 ثم 3 ثم 4 حقائب … ولم ينجح إلا عدد واحد من الحقائب. لماذا القاسم المشترك الأكبر للعددين 17 و 18 هو 1؟</span>}
                options={['قواسم 17: 1 ، 17؛ قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ القاسم المشترك الوحيد هو 1', 'لأن 17 عدد أولي', 'لأن 18 عدد زوجي و 17 عدد فردي', 'لأن 17 لا يقسم 18']} correct={0} cols={1}
                explain={<span>نقول إن 17 و 18 أوليان فيما بينهما ونكتب <MathText>{'$\\mathrm{PGCD}(18\\ ;\\ 17) = 1$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              {q1 && (
                <>
                  <KnowledgeBrick id="awwaliyan-taarif" lead="قارن بما وجدته بالحقائب: كم عددًا من الحقائب نجح مع 17 قلمًا و 18 كراسًا؟" />
                  <TextbookBox kind="remark" text={ACTIVITY.questions[1]} source={ACTIVITY.source} compact />
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'ب) 22 و 35 — جـ) مريم: «27 و 36 أوليان فيما بينهما»', subtitle: 'المستوى المتقدّم يحمل 22 و 35', done: q2,
          content: (
            <div className="space-y-3">
              {/* 22 et 35 vivent au niveau متقدم du workspace ci-dessus ; ici
                  reste le SEUL cas où la réponse est « non », celui de مريم. */}
              <Manipulation type="coprime-explorer" a={27} b={36} title="تقول مريم: «27 و 36 أوليان فيما بينهما». اختبر قولها" />
              <TapQuestion prompt={<span>ما الذي يكفي لتبيّن أنّ مريم على خطأ؟</span>}
                options={['قاسم مشترك واحد يختلف عن 1، مثل 3 أو 9', 'أن نجرّب كل قواسم العددين دون استثناء', 'أن يكون أحد العددين زوجيًا', 'أن يقسم 27 العدد 36']} correct={0} cols={1}
                explain={<span>في لوحتك يكفي أن تضع 3 (أو 9) في الوسط: 9 يقسم 27 و 36، فـ PGCD(27 ; 36) = 9 ≠ 1 وليسا أوليين فيما بينهما.</span>} onAnswered={() => setQ2(true)} />
              {q2 && <KnowledgeBrick id="nafy-awwaliyan" compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
