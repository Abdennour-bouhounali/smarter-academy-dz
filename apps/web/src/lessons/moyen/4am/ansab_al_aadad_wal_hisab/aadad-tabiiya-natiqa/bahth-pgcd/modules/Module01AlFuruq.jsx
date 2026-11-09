import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_A } from '../content/textbook';
import { M1_ROUNDS } from '../content/ribbons';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

/**
 * Module 1 — l'ENTRÉE : deux rubans dans l'atelier de couture (thème `workshop`), le petit coupé dans le grand, encore et encore.
 * UNE PISTE (rétrofit 2026-10-15) : le labo en tête SANS carte ni titre de workspace ; la question porte sur ce que l'élève a vu
 * (pourquoi le PGCD des deux rubans ne change pas à chaque coupe) ; la brique APRÈS la réponse.
 *   مبتدئ  — 21 cm et 14 cm : trois coupes, la chaîne tient dans un écran, l'invariant se voit d'un maillon à l'autre.
 *   متقدم  — 252 cm et 140 cm, les nombres du manuel : la chaîne est longue, et cette longueur rendra la division désirable (M3).
 * Étape 1 : POURQUOI le PGCD ne bouge pas (252 − 140 = 112 vient du manuel, dans l'explication) ; étape 2 : 378 et 315 « de la
 * même manière » (manuel, question 4), brique de la méthode APRÈS la chaîne finie. LP : P1, P2.
 *
 * LECTEUR DE MISSION (rollout 2026-11-08) : le labo se joue en MANCHES (content/ribbons.js › M1_ROUNDS : 21 et 14 à la main → 252 et 140 avec
 * prédictions → 378 et 315 → défi ⭐ → atelier libre) ; l'étape 1 attend la manche 1, l'étape 2 la manche 3 (`needsRound`). Hors lecteur : inchangé.
 */
export default function Module01AlFuruq() {
  const [d1, setD1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [d2, setD2] = useState(false);
  // Dans le lecteur : la manche gagnée ouvre l'étape.
  const [won, setWon] = useState({});
  const { a, b, second } = ACTIVITY_A.numbers;
  return (
    <ContentModule objectives={["ماذا يحدث للقواسم المشتركة عندما نطرح عددين؟", "هل نجد PGCD(252، 140) من الفرق وحده؟", "كيف أتابع الطرح خطوة بعد خطوة؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 6 أ — الفروق المتتابعة" moduleSubtitle={ACTIVITY_A.subtitle} estimatedTime="14 دقيقة"
      intro={(
        // Le niveau par défaut est le PETIT couple : premier contact court ; 252 et 140 (manuel) sont à un clic.
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m1-ribbons" rounds={M1_ROUNDS} icon="✂️" freeIcon="🧵"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation type="pgcd-differences" a={21} b={14}
                title="شريطان في ورشة الخياطة: 21 سم و 14 سم"
                onFinished={() => setD1(true)} />
            ),
            advanced: () => (
              <Manipulation type="pgcd-differences" a={a} b={b}
                title="شريطان في ورشة الخياطة: 252 سم و 140 سم"
                onFinished={() => setD1(true)} />
            ),
          }}
        />
          )}
        />
      )}
      steps={[
        { needsRound: { id: 'r1', label: 'الجولة 1', icon: '✂️', won: Boolean(won.r1) }, num: 1, title: 'لماذا لا يتغيّر القاسم المشترك الأكبر بعد كل قصّة؟', subtitle: 'السؤال 1) من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <PlayerSwitch
                player={won.r1 ? <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-900" data-activity-evidence data-tried="true">قصصتَ الشريط الأصغر من الأكبر مرّة بعد مرّة حتى صار الفرق 0، ووضعتَ PGCD في خانته.</p> : null}
                page={(
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li data-evidence="chain" data-tried={d1 ? 'true' : 'false'} className={d1 ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {d1 ? 'أنهيتَ القصّ حتى صار الفرق معدومًا.' : 'لم تنهِ القصّ بعد: عُد إلى المناولة أعلاه واسحب الشريط الأصغر على الأكبر مرّة بعد مرّة، وأجب عن الأسئلة التي تظهر فوق المختبر.'}
                </li>
              </ul>
                )}
              />
              <TapQuestion prompt={<span>قصصتَ الشريط الأصغر من الأكبر مرّة بعد مرّة، وبقي القاسم المشترك الأكبر للشريطين كما هو. لماذا مثلًا <MathText>{'$\\mathrm{PGCD}(252\\ ;\\ 140) = \\mathrm{PGCD}(140\\ ;\\ 112)$'}</MathText>؟</span>}
                options={['كل قاسم مشترك لـ 252 و 140 يقسم أيضًا 252 − 140 = 112، فللزوجين نفس القواسم المشتركة', 'لأن 112 أصغر من 140', 'لأن 252 = 2 × 140 − 28', 'لأن 140 قاسم للعدد 252']} correct={0} cols={1}
                explain={<span>خاصية 1 (الدرس 3): القاسم المشترك يقسم الفرق. والعكس صحيح: قاسم مشترك لـ 140 و 112 يقسم مجموعهما 252.</span>} onAnswered={() => setQ1(true)} />
              {q1 && (
                <>
                  <KnowledgeBrick id="pgcd-farq" lead="قارن بما رأيته في الورشة بعد كل قصّة: ماذا بقي ثابتًا؟" />
                  <TextbookBox kind="remark" text={ACTIVITY_A.misprint} compact />
                </>
              )}
            </div>
          ) },
        { needsRound: { id: 'r3', label: 'الجولة 3', icon: '✂️', won: Boolean(won.r3) }, num: 2, title: '4) عيّن بطريقة مماثلة PGCD(378 ; 315)', done: d2 || Boolean(won.r3),
          content: (
            <div className="space-y-3">
              {/* le lecteur joue 378 et 315 dans la manche 3 ; la page de l'enseignant garde son labo */}
              <PlayerSwitch
                player={won.r3 ? <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-900" data-activity-evidence data-tried="true">بالطريقة نفسها: آخر فرق غير معدوم للعددين 378 و 315 هو PGCD.</p> : null}
                page={<Manipulation type="pgcd-differences" a={second.a} b={second.b} title="378 و 315" onFinished={() => setD2(true)} />}
              />
              {(d2 || won.r3) && <KnowledgeBrick id="khwarizmiyat-al-furuq" />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
