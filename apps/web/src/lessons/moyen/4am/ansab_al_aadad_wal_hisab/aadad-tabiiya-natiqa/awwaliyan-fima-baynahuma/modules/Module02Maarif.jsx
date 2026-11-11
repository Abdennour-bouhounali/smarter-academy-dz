import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PeerSheet } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';
import { M2_ROUNDS } from '../content/kits';
import { PEER_SHEET, PEER_KID } from '../content/peerSheet';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';
/**
 * Module 2 — معارف 5 (p. 12) : définition et exemple 22/15. LP : P1, P2.
 * Rétrofit 2026-10-15 : le labo (15 et 22 sur les listes) en tête SANS carte ; la première question porte sur ce que l'élève vient
 * de voir (qu'est-ce qui reste au milieu ?) ; la définition du manuel, son exemple et la brique viennent APRÈS la réponse ; la
 * brique de la méthode (preuve par PGCD) après la question qui la précède dans la tête de l'élève.
 *
 * LECTEUR DE MISSION (rollout 2026-11-09) : le labo se joue en MANCHES (content/kits.js › M2_ROUNDS : 15 et 22 avec ses questions → 35 et 48
 * avec une prédiction → défi ⭐ 51 et 85 → listes libres), l'étape 1 attend la manche 1, l'étape 3 est « ورقة أنس » (`PeerSheet`). Hors lecteur :
 * inchangé.
 */
export default function Module02Maarif() {
  const [f, setF] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  // Dans le lecteur : la manche gagnée ouvre l'étape.
  const [won, setWon] = useState({});
  return (
    <ContentModule objectives={["متى نقول إن عددين أوّليان فيما بينهما؟", "كيف أطبّق ذلك على 22 و 15؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="معارف — العددان الأوّليّان فيما بينهما" moduleSubtitle="ما الذي بقي في الوسط؟" estimatedTime="8 دقائق"
      intro={(
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m2-lists" rounds={M2_ROUNDS} icon="📋" freeIcon="🔢"
              onRoundWon={(id) => { setWon((w) => ({ ...w, [id]: true })); if (id === 'r1') setF(true); }} />
          )}
          page={<Manipulation type="coprime-explorer" a={22} b={15} onFinished={() => setF(true)} />}
        />
      )}
      steps={[
        { needsRound: { id: 'r1', label: 'الجولة 1', icon: '📋', won: Boolean(won.r1) }, num: 1, title: 'هل 15 عدد أولي؟', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li data-evidence="lists" data-tried={f ? 'true' : 'false'} className={f ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {f ? 'لم يبقَ في الوسط إلا العدد 1 لقواسم 15 و 22.' : 'لم تنهِ المقارنة بعد: أنزل قواسم 15 إلى الوسط ثم اضغط «تحقّق» وأجب عن الأسئلة التي تظهر فوق المختبر.'}
                </li>
              </ul>
              <TapQuestion prompt={<span>15 و 22 أوليان فيما بينهما (لم يبقَ بينهما إلا القاسم 1). هل يعني هذا أن 15 عدد أولي؟</span>}
                options={['لا: «أوليان فيما بينهما» صفة للزوج؛ 15 = 3 × 5', 'نعم: كل عدد أولي فيما بينه وبين غيره عدد أولي', 'نعم لأن 15 فردي', 'لا يمكن الجواب']} correct={0} cols={1}
                explain={<span>الشرط الوحيد: <MathText>{'$\\mathrm{PGCD}(15\\ ;\\ 22) = 1$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              {q1 && (
                <>
                  <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />
                  <TextbookBox kind="example" text={KNOWLEDGE.example} compact />
                  <KnowledgeBrick id="laysa-awwali" compact />
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'كيف نثبت أن عددين أوليان فيما بينهما؟', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>لإثبات أن 143 و 153 أوليان فيما بينهما، أنسب طريقة هي:</span>}
                options={['خوارزمية إقليدس: آخر باقٍ غير معدوم يجب أن يكون 1', 'التحقّق من أن كل واحد منهما عدد أولي', 'التحقّق من أن فرقهما 10', 'قواعد قابلية القسمة على 2 و 3 و 5 و 9 فقط']} correct={0} cols={1}
                explain={<span>153 = 143 + 10 ، 143 = 10 × 14 + 3 ، 10 = 3 × 3 + 1: القاسم المشترك الأكبر 1.</span>} onAnswered={() => setQ2(true)} />
              {q2 && <KnowledgeBrick id="ithbat-awwaliyan" />}
            </div>
          ) },
        { num: 3, title: 'ورقة أنس: أين الخطأ؟', subtitle: 'جد السطر الخاطئ وصحّحه', done: q3,
          content: <PeerSheet sheet={PEER_SHEET} kid={PEER_KID} onDone={() => setQ3(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />} />
  );
}
