import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick, PeerSheet } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { MoreToggle } from '../../../../../../common/components/StudentFocus';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';
import { TEAMS_EXAMPLE, M2_ROUNDS, eqTex } from '../content/teams';
import { PEER_SHEET, PEER_KID } from '../content/peerSheet';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

/**
 * Module 2 — معارف 1 (p. 10) : les deux définitions, les quatre formulations, les remarques (rétrofit 2026-10-15 : le labo en tête
 * SANS carte, SANS titre d'atelier ; chaque définition / brique APRÈS la question qui la nomme). L'exemple est MANIPULÉ sur le
 * MÊME terrain qu'au module 1 (propriétaire, 2026-11-04 : le labo du football pour toute la leçon ; le rayon de la bibliothèque —
 * 143 livres, 11 puis 13 — a été retiré). EXEMPLE TRAVAILLÉ, un seul niveau (`levels={false}`) : 48 joueurs, 6 équipes PUIS 8
 * vident le banc, donc le quotient aussi est un قاسم (48 = 6 × 8 = 8 × 6, content/teams.js).
 * ORDRE : 1. ce que l'élève a vu à 6 équipes → la définition par le reste ; 2. 8 équipes vident aussi le banc → la définition par le produit et
 * l'exemple 120 = 6 × 20 ; 3. l'application à 120 ; 4. les quatre phrases (question d'abord, briques ensuite). LP : P2, P3, P4.
 */
const [defBaqi, defJidaa] = KNOWLEDGE.definitions;
const [remSiyagh, remWahid, remNafsuh] = KNOWLEDGE.remarks;

export default function Module02Maarif() {
  const [tried, setTried] = useState({});
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : la trace des réponses de l'élève
  const [trials, setTrials] = useState([]);
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const { total, groups: [first, second], choices } = TEAMS_EXAMPLE;
  // Dans le lecteur de mission : deux MANCHES (48 en 6, puis en 8 équipes) — LabRounds.
  const [won, setWon] = useState({});
  const q1 = Boolean(won.a) || answered('first');
  // la symétrie VUE : les deux répartitions justes (6 puis 8 équipes) — elle ne dépend pas d'un essai avec reste
  const q2 = Boolean(won.b) || Boolean(tried[first]?.exact && tried[second]?.exact);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  return (
    <ContentModule objectives={["كيف نعرّف القاسم بطريقتين مختلفتين؟", "كيف أطبّق ذلك على 48 لاعبًا؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — قواسم عدد طبيعي"
      moduleSubtitle="تعريفان لنفس الفكرة"
      estimatedTime="12 دقيقة"
      intro={
        // L'exemple sur le MÊME terrain que le module 1 : 48 joueurs, 6 équipes puis 8.
        <PlayerSwitch
          player={(
            <LabRounds
              lessonId={MODULE_CTX.lessonId}
              labId="m2-teams"
              rounds={M2_ROUNDS}
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))}
              onVerdict={({ total: n, groups: k, perGroup, leftOver, exact }) => { if (n === total) setTried((t) => ({ ...t, [k]: { exact, quotient: perGroup, remainder: leftOver } })); }}
            />
          )}
          page={(
        <Manipulation
          type="team-builder"
          total={total}
          groups={first}
          teamChoices={choices}
          squadChoices={[total]}
          levels={false}
          title={`مثال: ${total} لاعبًا`}
          lead={`في دورة الحيّ ${total} لاعبًا. وزّعهم في ${first} فرق متساوية، ثم في ${second} فرق: هل يبقى أحد خارج الفرق في المرّتين؟`}
          onVerdict={({ total: n, groups: k, perGroup, leftOver, exact }) => { if (n === total) setTried((t) => ({ ...t, [k]: { exact, quotient: perGroup, remainder: leftOver } })); }}
          onTrial={(e) => setTrials((l) => [...l, e])}
        />
          )}
        />
      }
      steps={[
        {
          needsRound: { id: 'a', label: 'الجولة 1' }, num: 1, title: `ما الذي يجعل ${first} قاسمًا للعدد ${total}؟`, subtitle: 'من تجربتك في الملعب', done: q1,
          content: (
            <div className="space-y-3">
              <PlayerSwitch
                player={null}
                page={(
                  <>
              <MoreToggle force={[first, second].some((c) => tried[c]) ? false : undefined} label="تجاربي">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {[first, second].map((c) => (
                  <li key={c} className={tried[c] ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={c} data-tried={tried[c] ? 'true' : 'false'}>
                    {tried[c]
                      ? <MathText>{`${total} لاعبًا في ${c} فرق: $${total} = ${c} \\times ${tried[c].quotient} + ${tried[c].remainder}$`}</MathText>
                      : `${total} لاعبًا في ${c} فرق: لم تجرّبه بعد في الملعب أعلاه.`}
                  </li>
                ))}
              </ul>
              </MoreToggle>
              {!q1 && <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-500" data-evidence="first-todo">{`وزّع ${total} لاعبًا في ${first} فرق، ثم أجب عن الأسئلة التي تظهر فوق المختبر. التعريف كله في الباقي: باقي القسمة الإقليدية يحسم الأمر.`}</p>}
                  </>
                )}
              />
              {q1 && (
                <>
                  <TextbookBox kind="definition" text={defBaqi.text} source={KNOWLEDGE.source} />
                  <TextbookBox kind="example" text={`${first} قاسم للعدد ${total} لأنّ $${eqTex(total, first)}$: الباقي معدوم.`} compact />
                </>
              )}
            </div>
          ),
        },
        {
          needsRound: { id: 'b', label: 'الجولة 2' }, num: 2, title: `وماذا عن ${second} فرق؟`, subtitle: 'التعريف الثاني: بالجداء', done: q2,
          content: (
            <div className="space-y-3">
              <PlayerSwitch
                player={null}
                page={(
                  <>
              {!q2 && <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-500" data-evidence="second-todo">{`وزّع الـ ${total} لاعبًا في ${second} فرق أيضًا.`}</p>}
                  </>
                )}
              />
              {q2 && (
                <>
                  <KnowledgeBrick id="qasim-jidaa" lead={`في المرّتين لم يبقَ أحد: ${total} = ${first} × ${second} = ${second} × ${first}. نفس الفكرة بكتابة أخرى: باقٍ معدوم يعني أن a هو جداء b في عدد طبيعي.`} />
                  <TextbookBox kind="example" text={defJidaa.example.text} compact />
                </>
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'من جداء إلى قاسمين', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>من المساواة <MathText>{'$120 = 6 \\times 20$'}</MathText> نستنتج أن:</span>}
                options={['6 قاسم للعدد 120 فقط', '20 قاسم للعدد 120 فقط', '6 و 20 قاسمان للعدد 120', 'لا 6 ولا 20 قاسم للعدد 120']}
                correct={2} cols={2} requires={['qasim-jidaa']}
                explain={<span>المساواة تُقرأ في الاتجاهين: <MathText>{'$120 = 6 \\times 20 = 20 \\times 6$'}</MathText>، فكل عامل قاسم للعدد 120.</span>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'أربع جمل، معنى واحد — وملاحظتان', done: q4,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">بالنسبة إلى «6 قاسم للعدد 120»، هل لكل جملة نفس المعنى؟</p>}
                rows={[
                  { id: 'a', label: '6 يقسم 120', options: ['نفس المعنى', 'معنى مختلف'], correct: 0 },
                  { id: 'b', label: '120 يقبل القسمة على 6', options: ['نفس المعنى', 'معنى مختلف'], correct: 0 },
                  { id: 'c', label: '6 مضاعف للعدد 120', options: ['نفس المعنى', 'معنى مختلف'], correct: 1, correction: 'العكس: 120 مضاعف للعدد 6.' },
                  { id: 'd', label: '120 مضاعف للعدد 6', options: ['نفس المعنى', 'معنى مختلف'], correct: 0 },
                ]}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: ' : 'انتبه إلى الاتجاه: '}<MathText>{remSiyagh.text}</MathText>{' '}<MathText>{remWahid.text}</MathText>{' '}<MathText>{remNafsuh.text}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ4(true)}
              />
              {q4 && (
                <>
                  <KnowledgeBrick id="siyagh-mutakafia" />
                  <KnowledgeBrick id="wahid-wa-nafsuh" compact />
                </>
              )}
            </div>
          ),
        },
        {
          // « ورقة زميل » (conseil + propriétaire, 2026-11-08, PILOTE) : APRÈS le nom — l'élève juge un raisonnement au lieu
          // d'en produire un ; l'idée fausse visée : « le quotient est un entier, donc la division est exacte ».
          num: 5, title: 'ورقة سلمى: أين الخطأ؟', subtitle: 'جد السطر الخاطئ وصحّحه', done: q5,
          content: <PeerSheet sheet={PEER_SHEET} kid={PEER_KID} onDone={() => setQ5(true)} />,
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
