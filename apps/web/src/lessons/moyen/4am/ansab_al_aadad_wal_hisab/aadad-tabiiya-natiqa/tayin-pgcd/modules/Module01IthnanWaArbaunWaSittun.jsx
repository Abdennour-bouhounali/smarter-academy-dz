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
 * Module 1 — نشاط 5 (p. 8) : 42 et 60, la méthode par حصر.
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels).
 * La MÉTHODE est identique aux deux niveaux — lister, croiser, prendre le
 * plus grand — parce que c'est elle que la leçon enseigne :
 *
 *   مبتدئ  — 8 stylos et 12 cahiers à ranger en trousses identiques (thème
 *            `school`, un contexte de la plateforme) : l'élève VOIT que les
 *            nombres de trousses qui marchent sont 1, 2 et 4, puis retrouve
 *            ces nombres dans les listes. Les trois temps de la méthode
 *            (lister, croiser, prendre le plus grand) suivent, sans se perdre
 *            dans une longue énumération.
 *   متقدم  — 42 et 60, les nombres du manuel, directement sur les listes :
 *            douze diviseurs pour 60, on ne réussit plus par hasard, il faut
 *            être méthodique. Ici l'objet mathématique EST la liste de
 *            diviseurs ; l'habiller d'une histoire l'éloignerait.
 * LP : P1.
 */
export default function Module01IthnanWaArbaunWaSittun() {
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const { a, b } = ACTIVITY.numbers;
  return (
    <ContentModule objectives={["ما قواسم 42 وقواسم 60؟", "أيّها مشترك بينهما؟ وما أكبرها؟", "في كم خطوة نصل إلى PGCD؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 5 — 42 و 60" moduleSubtitle="قواسم، ثم قواسم مشتركة، ثم أكبرها" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo',
        headline: 'هيا نجهّز الحقائب!', emoji: '🎒', visual: <SchoolBagScene />,
        body: <div className="space-y-1">{ACTIVITY.questions.map((q) => <p key={q}>{q}</p>)}<SourceTag source={ACTIVITY.source} /></div> }}
      intro={(
        // Le niveau par défaut sert LA TÂCHE DU MODULE : ce module porte
        // l'activité du manuel dans son titre, et sa première étape attend
        // que CETTE manipulation soit finie (`onFinished`). Ouvrir sur le
        // petit nombre cachait l'activité derrière un onglet et laissait
        // l'élève devant une étape qu'il ne pouvait pas satisfaire.
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="نشاط الكتاب: 42 و 60. وللبدء بشيء ملموس، جرّب المستوى المبتدئ: أقلام وكراريس في حقائب متماثلة."
          levels={{
            beginner: () => (
              <Manipulation type="common-divisors" a={8} b={12} theme="school"
                title="تدرّب أولًا: 8 أقلام و 12 كراسًا في حقائب متماثلة"
                lead="أضف الحقائب واحدة بعد أخرى: أيّ الأعداد لا يترك شيئًا خارجها؟ وما أكبرها؟" />
            ),
            advanced: () => (
              // Les LISTES directement (`startWith="lists"`) : ici l'objet
              // mathématique EST la liste de diviseurs — c'est la méthode du
              // manuel. Jusqu'au 2026-09-30 ce niveau rouvrait les sacs de la
              // leçon 4, contre ce commentaire et le contrat (§7bis-levels).
              <Manipulation type="common-divisors" a={a} b={b} theme="school" startWith="lists"
                title="1) قواسم 42 و 60 — 2) القواسم المشتركة — 3) أكبرها"
                lead="انقل إلى الوسط كل عدد يقسم 42 و 60 معًا — العدد الذي لا يقسم إلا واحدًا منهما يُرفض مع السبب — ثم ضع أكبرها في خانة PGCD."
                onFinished={() => setLabDone(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: ACTIVITY.fill, subtitle: 'أكمل المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tayin-bil-hasr" lead="قارن بما فعلته في المناولة: هل مررت بالخطوات الثلاث نفسها؟" />
              {!labDone && <p className="text-sm text-slate-600">أنهِ الخطوات الثلاث في المناولة.</p>}
              <TapQuestion prompt={<span>انقل وأكمل: «العدد ... يسمى القاسم ... ... ... للعددين 42 و 60». ونكتب ...</span>}
                options={['العدد 6 يسمى القاسم المشترك الأكبر للعددين 42 و 60، ونكتب PGCD(42 ; 60) = 6', 'العدد 3 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 3', 'العدد 12 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 12', 'العدد 1 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 1']} correct={0} cols={1} requires={['tayin-bil-hasr']}
                explain={<span>القواسم المشتركة لـ 42 و 60 هي 1 ، 2 ، 3 ، 6؛ أكبرها 6: <MathText>{'$\\mathrm{PGCD}(42\\ ;\\ 60) = 6$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              {q1 && <TextbookBox kind="method" text="لتعيين القاسم المشترك الأكبر لعددين: نحصر قواسم كل عدد، ثم القواسم المشتركة، ثم نأخذ أكبرها." compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
