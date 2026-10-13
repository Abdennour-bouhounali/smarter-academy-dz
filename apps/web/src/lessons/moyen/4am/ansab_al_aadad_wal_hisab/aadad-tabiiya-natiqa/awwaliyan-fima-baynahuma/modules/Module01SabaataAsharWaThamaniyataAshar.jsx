import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { SchoolBagScene } from '../../../../../../common/manipulations/primitives/ContextScenes';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 7 (p. 9) : 17/18, 22/35, et مريم (27/36). LP : P1, P3.
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels) :
 *   مبتدئ  — 17 stylos et 18 cahiers à ranger en trousses identiques (thème
 *            `school`, contexte de la plateforme) : l'élève essaie 2, 3, 4…
 *            trousses et RIEN ne marche sauf 1. Puis les listes confirment :
 *            le seul diviseur commun est 1. C'est la définition, vécue.
 *   متقدم  — 22 et 35 (question ب), directement sur les listes, sans aucun
 *            guidage : l'élève bâtit la preuve lui-même.
 */
export default function Module01SabaataAsharWaThamaniyataAshar() {
  const [c1, setC1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["هل تنجح حقائب متماثلة بـ 17 قلمًا و 18 كراسًا؟ كم حقيبة ممكنة؟", "كيف أتأكّد أن عددين لا يتقاسمان إلا الواحد؟", "هل مريم على صواب في 27 و 36؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 7 — العددان الأوّليّان فيما بينهما" moduleSubtitle="ماذا لو كان القاسم المشترك الوحيد هو 1؟" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 9', title: ACTIVITY.title, tone: 'indigo',
        headline: 'هيا نوزّع الأدوات!', emoji: '✏️', visual: <SchoolBagScene />,
        body: <div className="space-y-1"><p>{ACTIVITY.questions[0]}</p><SourceTag source={ACTIVITY.source} /></div> }}
      intro={(
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="المستوى المبتدئ: 17 قلمًا و 18 كراسًا في حقائب متماثلة — كم حقيبة يمكن تجهيزها؟ المستوى المتقدّم: 22 و 35 دون أي توجيه."
          levels={{
            beginner: () => (
              <Manipulation type="coprime-explorer" a={17} b={18} startWith="groups" theme="school"
                title="17 قلمًا و 18 كراسًا: كم حقيبة متماثلة؟"
                lead="أضف الحقائب واحدة بعد أخرى حتى 17: هل ينجح أيّ عدد غير 1؟"
                onFinished={() => setC1(true)} />
            ),
            advanced: () => (
              <Manipulation type="coprime-explorer" a={22} b={35}
                title="ب) 22 و 35: أثبت بنفسك"
                lead="لا أحد يخبرك بالجواب: جرّب في الوسط قواسم العدد الأصغر واحدًا واحدًا، ثم تحقّق." />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'أ) لماذا PGCD(17 ; 18) = 1؟', subtitle: 'أنهِ المناولة أولًا', done: c1 && q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="awwaliyan-taarif" lead="قارن بما وجدته بالحقائب: كم عددًا من الحقائب نجح مع 17 قلمًا و 18 كراسًا؟" />
              <TapQuestion prompt={<span>لماذا القاسم المشترك الأكبر للعددين 17 و 18 هو 1؟</span>}
                options={['قواسم 17: 1 ، 17؛ قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ القاسم المشترك الوحيد هو 1', 'لأن 17 عدد أولي', 'لأن 18 عدد زوجي و 17 عدد فردي', 'لأن 17 لا يقسم 18']} correct={0} cols={1} requires={['awwaliyan-taarif']}
                explain={<span>نقول إن 17 و 18 أوليان فيما بينهما ونكتب <MathText>{'$\\mathrm{PGCD}(18\\ ;\\ 17) = 1$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              <TextbookBox kind="remark" text={ACTIVITY.questions[1]} compact />
            </div>
          ) },
        { num: 2, title: 'ب) 22 و 35 — جـ) مريم: «27 و 36 أوليان فيما بينهما»', done: q2,
          content: (
            <div className="space-y-3">
              {/* 22 et 35 vivent au niveau متقدم du workspace ci-dessus ; ici
                  reste le SEUL cas où la réponse est « non », celui de مريم. */}
              <Manipulation type="coprime-explorer" a={27} b={36} title="جـ) 27 و 36: هل مريم على صواب؟" />
              <KnowledgeBrick id="nafy-awwaliyan" compact />
              <TapQuestion prompt={<span>هل مريم على صواب؟</span>}
                options={['لا: 9 قاسم مشترك لـ 27 و 36، فـ PGCD(27 ; 36) = 9 ≠ 1', 'نعم: 27 و 36 فرديان', 'نعم: 36 − 27 = 9 عدد فردي', 'لا: لأن 27 يقسم 36']} correct={0} cols={1} requires={['nafy-awwaliyan']}
                explain={<span>يكفي قاسم مشترك واحد يختلف عن 1 لنفي أن العددين أوليان فيما بينهما.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
