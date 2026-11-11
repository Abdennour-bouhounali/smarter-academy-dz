import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';
import { M1_ROUNDS } from '../content/kits';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

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
 *
 * LECTEUR DE MISSION (rollout 2026-11-09) : le labo se joue en MANCHES (content/kits.js › M1_ROUNDS : 8 et 9 à la main avec ses questions →
 * 17 et 18 avec prédictions et « جرّب كل الإمكانيات » → défi ⭐ 21 et 28 → table libre) au lieu de مبتدئ / متقدم ; les deux étapes attendent
 * la manche 17 et 18 (`needsRound`). Hors lecteur : inchangé.
 */
export default function Module01SabaataAsharWaThamaniyataAshar() {
  const [c1, setC1] = useState(false);
  const [trials, setTrials] = useState([]);
  const [q2, setQ2] = useState(false);
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : l'étape 1 est faite quand la suite des trousses l'est
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  // Dans le lecteur : la manche gagnée (17 et 18, tout essayé) ouvre l'étape.
  const [won, setWon] = useState({});
  const q1 = answered('groups') || Boolean(won.r2);
  const round = { id: 'r2', label: 'الجولة 2', icon: '🎒', won: Boolean(won.r2) };
  return (
    <ContentModule objectives={["هل تنجح حقائب متماثلة بـ 17 قلمًا و 18 كراسًا؟ كم حقيبة ممكنة؟", "كيف أتأكّد أن عددين لا يتقاسمان إلا الواحد؟", "هل مريم على صواب في 27 و 36؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 7 — العددان الأوّليّان فيما بينهما" moduleSubtitle="جرّب الحقائب ثم فسّر ما وجدت" estimatedTime="12 دقيقة"
      intro={(
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m1-kits" rounds={M1_ROUNDS} icon="🎒" freeIcon="✏️"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
        <ManipulationWorkspace
          levels={{
            beginner: () => (
              <Manipulation type="coprime-explorer" a={17} b={18} startWith="groups" theme="school"
                title="17 قلمًا و 18 كراسًا: كم حقيبة متماثلة؟"
                onTrial={(e) => setTrials((list) => [...list, e])} onFinished={() => setC1(true)} />
            ),
            advanced: () => (
              <Manipulation type="coprime-explorer" a={22} b={35} />
            ),
          }}
        />
          )}
        />
      )}
      steps={[
        { needsRound: round, num: 1, title: 'لماذا لم تنجح إلا حقيبة واحدة؟', subtitle: 'السؤال أ)', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li data-evidence="bags" data-tried={q1 ? 'true' : 'false'} className={q1 ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {q1 ? 'أجبتَ في المختبر: جرّبتَ كل عدد من الحقائب مع 17 قلمًا و 18 كراسًا ولم تنجح إلا حقيبة واحدة، لأنّه لا قاسم مشترك لهما غير 1.' : 'لم تنهِ تجربة الحقائب بعد: أضف الحقائب واحدة بعد أخرى في المناولة أعلاه، ثم أجب عن الأسئلة التي تظهر فوقها.'}
                </li>
              </ul>
              {q1 && (
                <>
                  <KnowledgeBrick id="awwaliyan-taarif" lead="قارن بما وجدته بالحقائب: كم عددًا من الحقائب نجح مع 17 قلمًا و 18 كراسًا؟" />
                  <TextbookBox kind="remark" text={ACTIVITY.questions[1]} source={ACTIVITY.source} compact />
                </>
              )}
            </div>
          ) },
        { needsRound: round, num: 2, title: 'ب) 22 و 35 — جـ) مريم: «27 و 36 أوليان فيما بينهما»', subtitle: 'المستوى المتقدّم يحمل 22 و 35', done: q2,
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
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />} />
  );
}
