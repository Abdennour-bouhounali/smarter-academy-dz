import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { IntegerSetQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 1 — نشاط 2 (p. 8) : les jداءات de 60 puis ses diviseurs.
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT
 * §7bis-levels) : `factor-pairs` dans un `ManipulationWorkspace`, l'élève
 * répond « يقسم / لا يقسم » pour d = 1, 2, … et voit chaque couple livrer
 * DEUX diviseurs.
 *
 *   مبتدئ  — 24 : six colonnes suffisent, le rectangle tient dans un regard,
 *            et la répétition des couples se voit sans compter.
 *   متقدم  — 60, le nombre du manuel : plus de tests, la règle d'arrêt
 *            (d² ≤ n) devient nécessaire au lieu d'être visible.
 *
 * Le CONTEXTE ne change pas d'un niveau à l'autre, et c'est délibéré : le
 * rectangle de points EST l'argument mathématique (n = d × e ⇔ rectangle
 * parfait). Lui plaquer un thème le rendrait moins lisible, pas plus
 * engageant — brief §11, « ne jamais forcer un contexte ».
 *
 * Rétrofit 2026-10-15 (§4quater) : le labo ouvre le module, SANS carte ni titre ni `lead` de workspace (le labo dit son contexte et
 * sa question) ; les étapes : ce qu'un rectangle parfait livre (la brique APRÈS la réponse), tous les diviseurs de 60, puis 48
 * et 17. LP : P1, P2.
 */
export default function Module01AlAdad60() {
  const [tested, setTested] = useState({});
  const [q1, setQ1] = useState(false);
  const [q60, setQ60] = useState(false);
  const [q17, setQ17] = useState(false);
  const finish = (n) => setTested((t) => ({ ...t, [n]: true }));
  return (
    <ContentModule objectives={["ماذا يعطيني كل مستطيل تامّ؟", "كم قاسمًا للعدد 60؟", "هل نجد القواسم بنفس الطريقة مع 48؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 2 — قواسم العدد 60" moduleSubtitle="جداء عاملين بكلّ الأشكال الممكنة" estimatedTime="12 دقيقة"
      intro={
        // LE LABO OUVRE LE MODULE (§4quater) : ni carte du manuel, ni titre / `lead` de workspace. Le workspace s'ouvre sur
        // مبتدئ (24, un regard suffit) puis متقدم = le 60 du manuel. Le CONTEXTE ne change pas d'un niveau à l'autre : le rectangle
        // de livres EST l'argument (n = d × e ⇔ rectangle parfait). `lead` ci-dessous = le contexte seul ; la question est celle du labo.
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation type="factor-pairs" n={24} onFinished={finish}
                lead="في المكتبة 24 كتابًا نريد ترتيبها على رفّ في صفوف متساوية، دون صفّ ناقص." />
            ),
            advanced: () => (
              <Manipulation type="factor-pairs" n={60} onFinished={finish}
                lead="هذه المرّة 60 كتابًا: كل مستطيل تامّ تجده يضيف سطرًا إلى لوح الأزواج." />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'ماذا يعطيك كل مستطيل تامّ؟', subtitle: 'سطر في لوح الأزواج', done: q1,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-600" data-activity-evidence data-tried={tested[24] || tested[60] ? 'true' : 'false'}>
                {tested[24] || tested[60] ? 'أكملت لوح الأزواج في المناولة.' : 'لم تُكمل بعدُ لوح الأزواج: جرّب الصفوف في المناولة أعلاه.'}
              </p>
              <TapQuestion prompt={<span>في لوح الأزواج سطر مثل <MathText>{'$60 = 4 \\times 15$'}</MathText> : في كل صفّ 4 كتب وهناك 15 صفًّا. ماذا يعطيك هذا السطر عن العدد 60؟</span>}
                options={['قاسمًا واحدًا: عدد الكتب في الصفّ', 'قاسمين: عدد الكتب في الصفّ وعدد الصفوف', 'مضاعفًا للعدد 60']} correct={1} cols={1}
                explain={<span>عدد الكتب في الصفّ (4) وعدد الصفوف (15) يقسمان 60 معًا: كل مستطيل تامّ يعطي قاسمين.</span>}
                onAnswered={() => setQ1(true)} />
              {q1 && <KnowledgeBrick id="jidaa-aamilayn" lead="كل سطر في لوح الأزواج أعطاك قاسمين: العاملين." />}
            </div>
          ) },
        { num: 2, title: 'استنتج كل قواسم العدد 60', subtitle: 'من أسطر اللوح', done: q60,
          content: (
            <div className="space-y-3">
              <IntegerSetQuestion prompt={<span>اكتب كل قواسم العدد <MathText>{'$60$'}</MathText>.</span>} expected={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
                explain="ستّ كتابات على شكل جداء عاملين، اثنا عشر قاسمًا." requires={['jidaa-aamilayn']} onAnswered={() => setQ60(true)} />
            </div>
          ) },
        { num: 3, title: 'ب) قواسم العدد 48، كذلك بالنسبة إلى العدد 17', done: q17,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qasim-rappel" variant="rappel" compact />
              <Manipulation type="factor-pairs" n={48} title="العدد 48" lead="نفس الطريقة: أطِل الصفّ كتابًا بعد كتاب واكتب كل قواسم العدد 48." />
              <TapQuestion prompt={<span>ما هي قواسم العدد <MathText>{'$17$'}</MathText>؟</span>}
                options={['1 و 17', '1 ، 7 و 17', '17 فقط', '1 ، 2 و 17']} correct={0} cols={2} requires={['qasim-rappel']}
                explain={<span>لا يقسم 17 أيّ عدد من 2 إلى 16، فقاسماه الوحيدان هما 1 و 17.</span>}
                onAnswered={() => setQ17(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
