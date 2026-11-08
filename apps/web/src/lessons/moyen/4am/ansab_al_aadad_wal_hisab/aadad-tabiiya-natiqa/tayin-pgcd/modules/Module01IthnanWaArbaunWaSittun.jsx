import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';
import { M1_ROUNDS } from '../content/bags';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

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
 * Rétrofit 2026-10-15 (§4quater) : le labo en tête, sans carte ni titre ; la brique et la boîte de la méthode APRÈS la réponse. LP : P1.
 *
 * LECTEUR DE MISSION (rollout 2026-11-08) : le labo se joue en MANCHES (content/bags.js › M1_ROUNDS : 8 stylos et 12 cahiers à la main →
 * 20 et 30 avec prédictions → les listes de 42 et 60 → défi ⭐ 48 et 72 → listes libres) au lieu de مبتدئ / متقدم ; l'étape 1 attend la
 * manche 1, l'étape 2 la manche 3 (`needsRound`). Hors lecteur (enseignant, classe) : les deux niveaux, inchangés.
 */
export default function Module01IthnanWaArbaunWaSittun() {
  const [labDone, setLabDone] = useState(false);
  // Dans le lecteur : la manche gagnée ouvre l'étape (la porte disparaît dès qu'elle est gagnée, même si la question reste à faire).
  const [won, setWon] = useState({});
  const [q0, setQ0] = useState(false);
  const [q1, setQ1] = useState(false);
  const { a, b } = ACTIVITY.numbers;
  return (
    <ContentModule objectives={["أيّ عدد من الحقائب يصلح للأقلام والكراريس معًا؟", "أيّها مشترك بين 42 و 60؟ وما أكبرها؟", "في كم خطوة نصل إلى PGCD؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 5 — 42 و 60" moduleSubtitle="قواسم، ثم قواسم مشتركة، ثم أكبرها" estimatedTime="12 دقيقة"
      intro={(
        // LE LABO OUVRE LE MODULE (§4quater) : pas de carte du manuel, pas de titre / `lead` de workspace. Le niveau par défaut est
        // مبتدئ (les trousses), le manuel (42 et 60 sur les listes) est le niveau متقدم : c'est lui qui déclenche `onFinished`
        // pour la phrase de l'étape 2. `lead` des labos = le contexte seul ; la question est celle du labo.
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m1-bags" rounds={M1_ROUNDS} icon="🎒" freeIcon="📋"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation type="common-divisors" a={8} b={12} theme="school"
                lead="عندنا 8 أقلام و 12 كراسًا، نريد وضعها كلها في حقائب متماثلة." />
            ),
            advanced: () => (
              // Les LISTES directement (`startWith="lists"`) : ici l'objet mathématique EST la liste de diviseurs (§7bis-levels).
              <Manipulation type="common-divisors" a={a} b={b} theme="school" startWith="lists"
                lead="نشاط الكتاب: العددان 42 و 60 مباشرةً على قائمتَي قواسمهما."
                onFinished={() => setLabDone(true)} />
            ),
          }}
        />
          )}
        />
      )}
      steps={[
        { needsRound: { id: 'r1', label: 'الجولة 1', icon: '🎒', won: Boolean(won.r1) }, num: 1, title: 'لماذا لا تصلح 3 حقائب؟', subtitle: 'عن 8 أقلام و 12 كراسًا', done: q0,
          content: (
            <TapQuestion prompt={<span>3 تقسم 12 دون باقٍ، ومع ذلك لا تصلح 3 حقائب لـ 8 أقلام و 12 كراسًا. لماذا؟</span>}
              options={['لأنّ 3 لا تقسم 8: يبقى قلمان خارج الحقائب', 'لأنّ 3 أصغر من 4', 'لأنّ 3 تقسم 12 فقط، وهذا يكفي']} correct={0} cols={1}
              explain={<span>يلزم أن يقسم عدد الحقائب الأقلام والكراريس معًا: <MathText>{'$8 = 3 \\times 2 + 2$'}</MathText> فيبقى قلمان.</span>}
              onAnswered={() => setQ0(true)} />
          ) },
        { needsRound: { id: 'r3', label: 'الجولة 3', icon: '🎒', won: Boolean(won.r3) }, num: 2, title: 'ماذا نسمّي أكبر قاسم مشترك لـ 42 و 60؟', subtitle: 'جملة الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <PlayerSwitch
                player={won.r3 ? <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-900" data-activity-evidence data-tried="true">حصرتَ قواسم 42 وقواسم 60، ثم وضعتَ المشتركة في الوسط وأكبرها في خانة PGCD.</p> : null}
                page={(
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-600" data-activity-evidence data-tried={labDone ? 'true' : 'false'}>
                {labDone ? 'أنهيت الخطوات الثلاث على قائمتَي 42 و 60 في المستوى المتقدّم.' : 'لم تُنهِ بعدُ قائمتَي 42 و 60: افتح المستوى المتقدّم في المناولة أعلاه.'}
              </p>
                )}
              />
              <TapQuestion prompt={<span>انقل وأكمل: «العدد ... يسمى القاسم ... ... ... للعددين 42 و 60». ونكتب ...</span>}
                options={['العدد 6 يسمى القاسم المشترك الأكبر للعددين 42 و 60، ونكتب PGCD(42 ; 60) = 6', 'العدد 3 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 3', 'العدد 12 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 12', 'العدد 1 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 1']} correct={0} cols={1}
                explain={<span>القواسم المشتركة لـ 42 و 60 هي 1 ، 2 ، 3 ، 6؛ أكبرها 6: <MathText>{'$\\mathrm{PGCD}(42\\ ;\\ 60) = 6$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              {q1 && <TextbookBox kind="method" text="لتعيين القاسم المشترك الأكبر لعددين: نحصر قواسم كل عدد، ثم القواسم المشتركة، ثم نأخذ أكبرها." compact />}
              {q1 && <KnowledgeBrick id="tayin-bil-hasr" lead="قارن بما فعلته في المناولة: هل مررت بالخطوات الثلاث نفسها؟" />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
