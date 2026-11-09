import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { M1_ROUNDS } from '../content/recipes';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';
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
 *
 * LECTEUR DE MISSION (rollout 2026-11-09) : le labo se joue en MANCHES (content/recipes.js › M1_ROUNDS : 12/18 à la main avec ses questions →
 * 84/48 avec prédictions → défi ⭐ → cuisine libre) au lieu de مبتدئ / متقدم ; les deux étapes attendent la manche 1 (`needsRound`). Hors lecteur :
 * inchangé.
 */
export default function Module01Samir() {
  const [labDone, setLabDone] = useState(false);
  const [trials, setTrials] = useState([]);
  // Dans le lecteur : la manche gagnée ouvre l'étape.
  const [won, setWon] = useState({});
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : les deux étapes en gardent la TRACE (`checkpoint-done`), puis posent les noms (briques)
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const q1 = answered('steps') || Boolean(won.r1);
  const q2 = q1;
  const { n, d, path } = ACTIVITY.numbers;
  return (
    <ContentModule objectives={["كيف اختزل سمير 84/48 خطوة بعد خطوة؟", "متى لا يمكن الاختزال أكثر؟", "كيف أتأكّد أن الكسر انتهى اختزاله؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 8 — كيف اختزل سمير 84/48؟" moduleSubtitle="÷4 ثم ÷3 … ثم لا شيء" estimatedTime="12 دقيقة"
      intro={(
        // Le labo EN TÊTE, sans carte ni titre (rétrofit 2026-10-15) : la recette (contexte) et la mission
        // (UNE question) sont ceux du labo. Le niveau par défaut sert la tâche du module :
        // la première étape attend que CETTE manipulation soit finie (`onFinished`), sans jamais bloquer.
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m1-recipes" rounds={M1_ROUNDS} icon="🥣" freeIcon="🍞"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation type="fraction-reduction" n={12} d={18} />
            ),
            advanced: () => (
              <Manipulation type="fraction-reduction" n={n} d={d} path={path}
                onTrial={(e) => setTrials((list) => [...list, e])} onFinished={() => setLabDone(true)} />
            ),
          }}
        />
          )}
        />
      )}
      steps={[
        { needsRound: { id: 'r1', label: 'الجولة 1', icon: '🥣', won: Boolean(won.r1) }, num: 1, title: 'أ) لماذا تبقى الوصفة هي نفسها؟', subtitle: 'أنهِ الاختزال في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={labDone ? 'true' : 'false'}>
                {q1
                  ? <span className="font-bold text-slate-800">أجبتَ في المختبر: بعد كل قسمة على قاسم مشترك بقيت قيمة <bdi dir="ltr">84/48</bdi> هي نفسها، لأنّ البسط والمقام قُسما على العدد نفسه.</span>
                  : <span className="text-slate-500">لم تنهِ اختزال 84/48 بعد في المناولة (المستوى المتقدّم): وزّع الوصفة على حصص متماثلة حتى لا تستطيع المواصلة، ثم أجب عن الأسئلة التي تظهر فوق المختبر.</span>}
              </p>
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
        { needsRound: { id: 'r1', label: 'الجولة 1', icon: '🥣', won: Boolean(won.r1) }, num: 2, title: 'هل يمكن مواصلة اختزال 7/4؟ لماذا؟', done: q2,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={q2 ? 'true' : 'false'}>
                {q2
                  ? <span className="font-bold text-slate-800">أجبتَ في المختبر: توقّفتَ عند <MathText>{'$\\dfrac{7}{4}$'}</MathText> لأنّ 7 و 4 أوليان فيما بينهما، فلا قاسم مشترك غير 1.</span>
                  : <span className="text-slate-500">أنهِ اختزال 84/48 في المناولة وأجب عن أسئلتها: ستعرف لماذا لا نواصل بعد الكسر الأخير.</span>}
              </p>
              {q2 && <KnowledgeBrick id="kasr-ghayr-qabil" lead="7 و 4 لا يقسمهما معًا إلا 1: أوليان فيما بينهما." />}
              {q2 && <TextbookBox kind="remark" text={ACTIVITY.questions[2]} compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />} />
  );
}
