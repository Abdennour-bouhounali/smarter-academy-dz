import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule, PeerSheet } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';
import { M2_ROUNDS } from '../content/books';
import { PEER_SHEET, PEER_KID } from '../content/peerSheet';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

/**
 * Module 2 — طريقة p. 11 : « تعيين قواسم عدد طبيعي » avec 105 (rétrofit 2026-10-15 : le labo ouvre le module, SANS carte ni titre).
 * Ordre : un diviseur reçu « gratuitement » comme partenaire (15 = 105 ÷ 7, sans l'avoir testé) → jusqu'où tester AVANT tout calcul
 * (« أتوقّع القاعدة ») → la méthode du manuel lue ligne à ligne (la brique et la boîte APRÈS la réponse) → les règles qui accélèrent
 * (brique après la réponse), puis « ورقة ريما » (rollout 2026-11-08) : trouver et corriger l'erreur d'une camarade inventée. LP : P3, P4.
 *
 * LECTEUR DE MISSION : le labo se joue en MANCHES (content/books.js › M2_ROUNDS : 105 → défi ⭐ 84 → rayon libre) ; hors lecteur
 * (enseignant, classe), le labo seul comme avant.
 */
export default function Module02Tariqa105() {
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : « le couple d'un rectangle couché » et « jusqu'où tester » y sont demandées ; ici, la TRACE
  const [trials, setTrials] = useState([]);
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  // Dans le lecteur : la manche 105 (le rectangle couché, puis la règle d'arrêt) ouvre les deux premières étapes
  const [won, setWon] = useState({});
  const q0 = Boolean(won.a) || answered('rule');
  const q1 = q0;
  const [q5, setQ5] = useState(false);
  const [read, setRead] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["هل أحتاج إلى اختبار كل قاسم؟", "إلى أي عدد نختبر القسمة؟", "كيف نرتّب القواسم المكتشفة؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="طريقة — قواسم العدد 105" moduleSubtitle="إلى أي عدد نختبر؟" estimatedTime="14 دقيقة"
      intro={(
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m2-books" rounds={M2_ROUNDS} icon="📚" freeIcon="🗂️"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={<Manipulation type="factor-pairs" n={105} lead="هذه المرّة 105 كتب، وعدد الصفوف الممكنة كبير." onTrial={(e) => setTrials((l) => [...l, e])} />}
        />
      )}
      steps={[
        { needsRound: { id: 'a', label: 'الجولة 1', icon: '📚' }, num: 1, title: 'هل تختبر كل قاسم بنفسك؟', done: q0,
          content: (
            // lecteur : avant la manche, la porte seule (pas de consigne qui renvoie « au-dessus ») ; après, le constat
            <PlayerSwitch
              player={q0 ? <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-900" data-activity-evidence data-tried="true">المستطيل المقلوب بعد المربّع لا يضيف قاسمًا جديدًا، لأنّ شريكه ظهر قبله في لوحة الأزواج.</p> : null}
              page={(
                <p className={`rounded-xl border-2 px-3 py-2 text-sm ${q0 ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`} data-activity-evidence data-tried={q0 ? 'true' : 'false'}>
                  {q0 ? 'أجبتَ في المختبر: المستطيل المقلوب بعد المربّع لا يضيف قاسمًا جديدًا، لأنّ شريكه ظهر قبله في لوحة الأزواج.' : 'اختبر الصفوف في المختبر حتى يظهر المستطيل المقلوب، وأجب عن الأسئلة التي تظهر فوقه.'}
                </p>
              )}
            />
          ) },
        { num: 2, title: 'إلى أيّ عدد نختبر؟', done: q1,
          content: (
            <PredictRule id="tariqa-qawasim">
              <PlayerSwitch player={null} page={(
              <p className={`rounded-xl border-2 px-3 py-2 text-sm ${q1 ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`} data-activity-evidence data-tried={q1 ? 'true' : 'false'}>
                {q1 ? 'أجبتَ في المختبر عن حدّ الاختبار: يكفي أن نصل إلى أن يصير المستطيل مربّعًا.' : 'أكمل أسئلة المختبر لتعرف إلى أيّ عدد يكفي أن نختبر.'}
              </p>
              )} />
            </PredictRule>
          ) },
        { num: 3, title: 'الطريقة، سطرًا سطرًا', done: read,
          content: q1 ? <div className="space-y-3"><KnowledgeBrick id="tariqa-qawasim" /><MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} /></div> : <p className="text-sm text-slate-500">تظهر الطريقة بعد أن تجيب عن السؤال السابق.</p> },
        { num: 4, title: 'هل تُسرّع قواعد قابلية القسمة الاختبار؟', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>هل يقبل 105 القسمة على 3؟ على 5؟ على 9؟ (بدون قسمة)</span>}
                options={['على 3 و 5 نعم، على 9 لا', 'على 3 و 9 نعم، على 5 لا', 'على 5 فقط', 'على 3 و 5 و 9']} correct={0} cols={1}
                explain={<span>مجموع الأرقام 6: يقبل القسمة على 3 لا على 9؛ رقم الوحدات 5: يقبل القسمة على 5.</span>}
                onAnswered={() => setQ2(true)} />
              {q2 && <KnowledgeBrick id="qawaid-qisma" compact />}
            </div>
          ) },
        // « ورقة زميل » (rollout 2026-11-08) : APRÈS le nom et les règles — l'élève juge un raisonnement au lieu d'en produire un ;
        // l'idée fausse visée : s'en tenir aux nombres TESTÉS et oublier le partenaire de chaque جداء.
        { num: 5, title: 'ورقة ريما: أين الخطأ؟', subtitle: 'جد السطر الخاطئ وصحّحه', done: q5,
          content: <PeerSheet sheet={PEER_SHEET} kid={PEER_KID} onDone={() => setQ5(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
