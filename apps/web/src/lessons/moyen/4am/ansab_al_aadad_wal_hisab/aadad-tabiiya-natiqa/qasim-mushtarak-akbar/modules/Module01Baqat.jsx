import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, STARTER } from '../content/textbook';
import { M1_ROUNDS } from '../content/bouquets';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

/**
 * Module 1 — l'ENTRÉE : 12 balles et 18 maillots en équipes, puis les 90 fleurs rouges et 54 blanches du manuel (rétrofit
 * 2026-10-15 : le labo en tête SANS carte, SANS titre ni lead d'atelier ; la brique APRÈS la réponse ; les étapes interrogent
 * ce que l'élève a FAIT).
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels), sur le MÊME type `common-divisors` :
 *   مبتدئ  — 12 ballons et 18 maillots, en équipes (thème `football`) : quatre diviseurs communs (1, 2, 3, 6), visibles d'un
 *            regard ; l'élève voit CE QUE veut dire « commun » (4 range les balles et laisse deux maillots dehors).
 *   متقدم  — 90 fleurs rouges et 54 blanches (thème `garden`), les nombres du manuel : les listes sont longues, la recherche demande
 *            une stratégie, et le PGCD vaut 18. Les bouquets d'abord, puis les listes — sur un bouton de l'élève.
 * Les groupes sont de vrais cadres contenant de vrais objets (`GroupingScene`) : « متماثلة » se voit.
 * ORDRE (étapes) : 1. pourquoi 4 équipes échouent (4 divise 12, pas 18) → brique « قواسم مشتركة » ; 2. 9 bouquets pour 90 et 54 :
 * ce que 9 est pour les deux nombres (question du manuel, appliquée) ; 3. les fleurs de chaque couleur quand le nombre de bouquets
 * est le plus grand → « أتوقّع القاعدة » du PGCD, puis la remarque du manuel. LP : P1, P3.
 *
 * LECTEUR DE MISSION (rollout 2026-11-08) : le labo se joue en MANCHES (content/bouquets.js › M1_ROUNDS : 12 balles et 18 maillots à la
 * main → 90 et 54 avec prédictions → les listes de 90 et 54 → défi ⭐ → محلّ حرّ) au lieu de مبتدئ / متقدم ; chaque étape attend sa
 * manche (`needsRound`, porte douce + retour à la question). Hors lecteur (enseignant, classe) : les deux niveaux, inchangés.
 */
export default function Module01Baqat() {
  const [done, setDone] = useState({ beginner: false, advanced: false });
  // Dans le lecteur : la manche gagnée ouvre l'étape (la porte disparaît dès qu'elle est gagnée, même si la question reste à faire).
  const [won, setWon] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const { red, white } = ACTIVITY.numbers;
  return (
    <ContentModule objectives={["كم باقة متماثلة تستوعب 90 زهرة حمراء و 54 بيضاء؟", "ما أكبر عدد ممكن من الباقات؟", "ما بين قواسم 90 وقواسم 54؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 4 — باقات متماثلة" moduleSubtitle="90 زهرة حمراء و 54 زهرة بيضاء" estimatedTime="12 دقيقة"
      intro={(
        // Le niveau par défaut est le terrain (مبتدئ) : l'entrée de la plateforme. Les nombres du manuel sont au niveau متقدم.
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m1-bouquets" rounds={M1_ROUNDS} icon="💐" freeIcon="🌷"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation type="common-divisors" a={STARTER.numbers.a} b={STARTER.numbers.b} context={STARTER.context} theme="football"
                  title="تمرّن أولًا: 12 كرة و 18 قميصًا"
                  lead="12 كرة و 18 قميصًا تُوزَّع كلّها على فرق متماثلة. أضف الفرق واحدًا بعد الآخر: ما أكبر عدد من الفرق لا يبقى معه شيء؟"
                  onFinished={() => setDone((d) => ({ ...d, beginner: true }))} />
                <SourceTag source={STARTER.source} />
              </div>
            ),
            advanced: () => (
              <div className="space-y-2">
                <TextbookBox kind="situation" text={ACTIVITY.situation} source={ACTIVITY.source} compact />
                <Manipulation type="common-divisors" a={red} b={white} context={ACTIVITY.context} theme="garden"
                  title="قواسم 90، قواسم 54، وما بينهما"
                  lead="أضف الباقات واحدة بعد أخرى حتى تجد أكبر عدد منها تدخل فيه كل الزهور، ثم قارن بين القائمتين."
                  onFinished={() => setDone((d) => ({ ...d, advanced: true }))} />
              </div>
            ),
          }}
        />
          )}
        />
      )}
      steps={[
        { needsRound: { id: 'r1', label: 'الجولة 1', icon: '💐', won: Boolean(won.r1) }, num: 1, title: 'لماذا لا تصلح 4 فرق لتوزيع 12 كرة و 18 قميصًا؟', subtitle: 'من تجربتك في المستوى المبتدئ', done: q1,
          content: (
            <div className="space-y-3">
              <PlayerSwitch
                player={won.r1 ? <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-900" data-activity-evidence data-tried="true">أضفتَ الفرق واحدًا بعد الآخر: 6 فرق هي الأكبر، ومع 7 فرق بقي شيء خارجها.</p> : null}
                page={(
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li className={done.beginner ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="beginner" data-tried={done.beginner ? 'true' : 'false'}>
                  {done.beginner ? 'وصلتَ في المستوى المبتدئ إلى أكبر عدد من الفرق المتماثلة.' : 'لم تصل بعد إلى أكبر عدد من الفرق في المستوى المبتدئ — جرّب ثم عُد.'}
                </li>
              </ul>
                )}
              />
              <TapQuestion prompt={<span>مع 4 فرق تتوزّع الكرات الـ <MathText>{'$12$'}</MathText> بالتساوي لكن يبقى قميصان. لماذا؟</span>}
                options={['لأنّ 4 يقسم 12 ولا يقسم 18', 'لأنّ 4 لا يقسم 12', 'لأنّ 4 أكبر من عدد الكرات في الفريق', 'لأنّ 12 و 18 عددان زوجيان']} correct={0} cols={1}
                explain={<span><MathText>{'$12 = 4 \\times 3 + 0$'}</MathText> أمّا <MathText>{'$18 = 4 \\times 4 + 2$'}</MathText>: يبقى قميصان. عدد الفرق المقبول يقسم 12 ويقسم 18 معًا.</span>}
                onAnswered={() => setQ1(true)} />
              {q1 && <KnowledgeBrick id="qawasim-mushtaraka" lead="طبّق التعريف على ما رأيته: لماذا نجحت 2 و 3 و 6 وفشلت 4؟" />}
            </div>
          ) },
        { needsRound: { id: 'r2', label: 'الجولة 2', icon: '💐', won: Boolean(won.r2) }, num: 2, title: ACTIVITY.questions[0], subtitle: 'يمكنك أن تتحقّق في المستوى المتقدّم', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>9 باقات: في كل باقة <MathText>{'$90 \\div 9 = 10$'}</MathText> زهرات حمراء و <MathText>{'$54 \\div 9 = 6$'}</MathText> بيضاء. ماذا يمثّل 9 بالنسبة إلى 90 و 54؟</span>}
                options={['9 قاسم مشترك للعددين 90 و 54', '9 مضاعف مشترك للعددين', '9 هو الفرق بين 90 و 54', '9 قاسم لـ 90 فقط']} correct={0} cols={2} requires={['qawasim-mushtaraka']}
                explain={<span>9 يقسم 90 ويقسم 54 في آن واحد؛ لذلك لا تبقى أية زهرة.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
        { needsRound: { id: 'r3', label: 'الجولة 3', icon: '💐', won: Boolean(won.r3) }, num: 3, title: 'كم زهرة من كل لون في الباقة الواحدة عند أكبر عدد من الباقات؟', subtitle: 'السؤال ب)', done: q3,
          content: (
            <div className="space-y-3">
              <PlayerSwitch
                player={won.r3 ? <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-900" data-activity-evidence data-tried="true">وضعتَ القواسم المشتركة للعددين 90 و 54 في الوسط، وأكبرها في خانة PGCD.</p> : null}
                page={(
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li className={done.advanced ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="advanced" data-tried={done.advanced ? 'true' : 'false'}>
                  {done.advanced ? 'أنهيتَ المستوى المتقدّم: عيّنتَ أكبر عدد من الباقات.' : 'لم تنهِ المستوى المتقدّم بعد — لا يمنعك شيء من الإجابة، لكنه يساعدك.'}
                </li>
              </ul>
                )}
              />
              <TapQuestion prompt={<span>عندما يكون عدد الباقات أكبر ما يمكن، كم زهرة حمراء وكم زهرة بيضاء في كل باقة؟</span>}
                options={['5 حمراء و 3 بيضاء', '10 حمراء و 6 بيضاء', '15 حمراء و 9 بيضاء', '45 حمراء و 27 بيضاء']} correct={0} cols={2} requires={['qawasim-mushtaraka']}
                explain={<span>القواسم المشتركة لـ 90 و 54 هي 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ أكبرها 18 باقة: <MathText>{'$90 \\div 18 = 5$'}</MathText> و <MathText>{'$54 \\div 18 = 3$'}</MathText>.</span>} onAnswered={() => setQ3(true)} />
              {q3 && (
                <PredictRule id="pgcd-taarif" prompt="جرّبت قواسم مشتركة كثيرة للعددين 90 و 54 (1 ، 2 ، 3 ، 6 ، 9 ، 18) وانتهيت إلى عدد واحد منها لعدد الباقات. لو أعطينا هذا العدد اسمًا خاصًّا بين القواسم المشتركة، فكيف تعرّف هذا الاسم بكلماتك؟">
                  <TextbookBox kind="remark" text={ACTIVITY.closing} compact />
                </PredictRule>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
