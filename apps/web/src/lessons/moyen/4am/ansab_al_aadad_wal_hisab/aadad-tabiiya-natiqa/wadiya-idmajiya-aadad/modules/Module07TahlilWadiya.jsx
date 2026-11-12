import React, { useState } from 'react';
import * as divisibility from '@smarter-academy/core/arithmetic/divisibility.js';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick, PeerSheet } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import InfoSorter from '../../../../../../common/components/InfoSorter';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';
import { useModulePlayer } from '../../../../../../common/mission/useModulePlayer';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION } from '../content/textbook';
import { M7_ROUNDS, SUPPLY, STORE, SCHOOL_WORDS, gcd } from '../content/rounds';
import { PEER_SHEET, PEER_KID } from '../content/peerSheet';

/**
 * Module 7 — « وضعية الوحدة » : la وضعية des tabliers (le défi 🏆 du module 8, jamais retouché), ANALYSÉE dans les trois phases (قراءة ·
 * تحليل واختيار استراتيجية · تنفيذ) — et jamais résolue : sa solution n'apparaît sur aucun écran avant le 🏆, ce module compris
 * (content/forbidden.js › ANSWER_TEXT, content/mission.test.js).
 *
 * LA PAGE (l'enseignant, le mode classe) : le workspace à deux niveaux — مبتدئ les GROUPES (`common-divisors`, 42 أقلام و 35 كرّاسًا, les mots
 * de l'école), متقدم EUCLIDE (816 و 697) ; aucune manche.
 *
 * LE LECTEUR DE MISSION (la synthèse de l'unité 1, 2026-11-12 — recette PROVISOIRE de la synthèse, point 5 ; l'élève ne voit JAMAIS l'ancienne
 * vue) : UN `LabRounds` (content/rounds.js) — r1 « لوازم المدارس » à la main (7 écoles, 6 + 5, la construction 42 = 7 × 6), r2 « المخزن الكبير »
 * avec prédictions (Euclide sur 816 et 697, puis la construction NUMÉRIQUE 816 = 17 × 48, chaîne `share` du labo) — puis les étapes. L'étape 2
 * attend r1, l'étape 3 attend r2 (`needsRound`, module-level : `useModulePlayer`). Les panneaux de trace sont REBÂTIS depuis les nombres des
 * manches gagnées (étoiles gardées : un rechargement ne vide rien).
 *
 * Étapes (les deux vues) : 1 lire et trier les données · 2 la condition (un diviseur COMMUN) · 3 la stratégie (Euclide, deux nombres grands) ·
 * 4 « بالقلم » (l'écran du cahier : « اكتب في 3 أسطر ») · 5 le MODÈLE « عدد المدارس = PGCD(▢ ; ▢) » (première étape au crayon ; les données
 * RAPPELÉES sur l'écran — aucun aller-retour) · 6 la part et la vérification, en lettres (g) · 7 « ورقة نسيبة » (un PLAN faux : le total au lieu
 * de chaque couleur). Le pied de page ajoute, dans le lecteur, une ligne de pause avant le 🏆. LP : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const TRUE_FALSE = ['صحيح', 'خاطئ'];
const sw = (player, page) => <PlayerSwitch player={player} page={page} />;

/* ── ce que les manches ont montré, REBÂTI depuis leurs nombres (une manche gagnée l'a vu ; rien n'est perdu au rechargement) ── */
const G1 = gcd(SUPPLY.a, SUPPLY.b);
const R1_LINES = [`${SUPPLY.a} = ${G1} \\times ${SUPPLY.a / G1}`, `${SUPPLY.b} = ${G1} \\times ${SUPPLY.b / G1}`];
const STORE_STEPS = divisibility.euclidSteps(STORE.a, STORE.b);
const G2 = STORE_STEPS.gcd;
const R2_LINES = [
  ...STORE_STEPS.steps.map((s) => `${s.a} = ${s.b} \\times ${s.q} + ${s.r}`),
  `${STORE.a} = ${G2} \\times ${STORE.a / G2}`,
];

/**
 * L'énoncé tel que le module 7 l'affiche : « و845 » (la conjonction collée au nombre) se lit « 845و » dans une phrase arabe (bidi) — une espace
 * l'en sépare. Le module 8 (jamais retouché) garde son texte.
 */
const SAID_TEXT = SITUATION.text.replace(/و(\d)/g, 'و $1');

/** Une ligne de trace dans le lecteur : ✓ caché aux lecteurs d'écran (un mot le dit), jamais dans une chaîne. */
function WonPanel({ id, won, lines, title, empty }) {
  return (
    <div className={`rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm ${won ? 'text-emerald-900' : 'text-slate-500'}`}
      data-activity-evidence data-evidence={id} data-tried={won ? 'true' : 'false'}>
      {won ? (
        <>
          <p className="font-bold">{title}</p>
          <ul className="ms-4 list-disc">
            {lines.map((s, i) => <li key={i}><MathText>{`$${s}$`}</MathText> <span aria-hidden="true">✓</span><span className="sr-only"> تمّ.</span></li>)}
          </ul>
        </>
      ) : <p>{empty}</p>}
    </div>
  );
}

/** Les données utiles de la وضعية, RAPPELÉES sur l'écran de la question qui s'en sert (aucun aller-retour). */
const Facts = () => (
  <ul aria-label="معطيات الوضعية" className="ms-4 list-disc space-y-1 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2 text-sm text-slate-800" data-situation-facts>
    {SITUATION.data.filter((d) => d.useful).map((d) => <li key={d.id}>{d.text}</li>)}
  </ul>
);

export default function Module07TahlilWadiya() {
  const inPlayer = useModulePlayer(MODULE_CTX);
  const [q, setQ] = useState({});
  // lecteur : les manches gagnées (étoiles gardées, annoncées par LabRounds au montage)
  const [won, setWon] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const round = (id, label) => (inPlayer ? { needsRound: { id, label, icon: '📦', won: Boolean(won[id]) } } : {});

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} moduleTitle="تحليل الوضعية النهائية للاختبار"
      moduleSubtitle="ثم التحدّي 🏆 — المآزر المدرسية: كم مدرسة؟" estimatedTime="≈ 28 دقيقة"
      objectives={['ماذا يعني «توزيع بالتساوي دون أن يبقى شيء» بالنسبة إلى عدد المدارس؟', 'أيّ حساب يعطي أكبر عدد من المدارس حين يكون العددان كبيرين؟', 'كيف نعرف ما تأخذه كل مدرسة من كل لون؟']}
      intro={(
        // LE LABO OUVRE LE MODULE. Lecteur : les MANCHES (content/rounds.js) ; la page garde un workspace à deux niveaux.
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m7-wadiya" rounds={M7_ROUNDS} icon="📦" freeIcon="🔁"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
            <ManipulationWorkspace
              defaultLevel="beginner"
              levels={{
                beginner: () => (
                  <Manipulation type="common-divisors" level="beginner" a={SUPPLY.a} b={SUPPLY.b} theme="school" context={SCHOOL_WORDS}
                    lead={M7_ROUNDS[0].props.lead} />
                ),
                advanced: () => (
                  <Manipulation type="euclidean-algorithm" level="advanced" a={STORE.a} b={STORE.b} lead={M7_ROUNDS[1].props.lead} />
                ),
              }}
            />
          )}
        />
      )}
      steps={[
        { num: 1, title: 'قراءة الوضعية وفهمها', subtitle: 'ما المعطيات المفيدة؟', done: !!q[1],
          content: (
            <div className="space-y-3" data-paging-keep>
              <div className="space-y-1 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2 text-sm text-slate-800" data-situation>
                <p>{SAID_TEXT}</p>
                <SourceTag source={SITUATION.source} />
              </div>
              <p className="text-sm font-semibold text-slate-700">اسحب كل معطى إلى «مفيد» أو «غير مفيد» للبحث عن عدد المدارس.</p>
              <InfoSorter items={SITUATION.data} formative onSolved={mark(1)} />
            </div>
          ) },
        { ...round('r1', 'لوازم المدارس'),
          num: 2, title: 'تحليل الوضعية: الشرط', subtitle: 'ماذا يقسم عدد المدارس؟', done: !!q[2],
          content: (
            <div className="space-y-3">
              {/* ce que la manche a montré, les données et la question sur UN écran (aucun aller-retour) */}
              <div className="space-y-3" data-paging-keep>
                {sw(
                  <WonPanel id="supply" won={won.r1} title="ما وجدته في لوازم المدارس:" lines={R1_LINES}
                    empty="جولة لوازم المدارس: لم تجد بعد أكبر عدد من المدارس." />,
                  null,
                )}
                <Facts />
                <TapQuestion prompt="«توزيع بالتساوي دون أن يبقى أيّ مئزر»: ماذا يعني هذا الشرط بالنسبة إلى عدد المدارس؟"
                  options={['عدد المدارس يقسم عدد المآزر الورديّة ويقسم عدد المآزر الزرقاء', 'عدد المدارس يقسم مجموع المآزر فقط', 'عدد المدارس مضاعف لعدد المآزر', 'عدد المدارس يساوي الفرق بين عددي المآزر']}
                  correct={0} cols={1} requires={['qawasim-mushtaraka', 'pgcd-taarif']}
                  explain={<span>لا يبقى شيء ⇔ الباقي معدوم في القسمتين: عدد المدارس <strong>قاسم</strong> لعدد الورديّة ولعدد الزرقاء معًا، أي قاسم مشترك لهما — كما في لوازم المدارس، حيث نجحت المدارس التي يقسم عددها العددين معًا. والأكبر هو PGCD.</span>}
                  onAnswered={mark(2)} />
              </div>
              {q[2] && <KnowledgeBrick id="pgcd-taarif" variant="rappel" compact />}
            </div>
          ) },
        { ...round('r2', 'المخزن الكبير'),
          num: 3, title: 'اختيار الاستراتيجية', subtitle: 'عددان كبيران', done: !!q[3],
          content: (
            <div className="space-y-3">
              {/* la chaîne de la manche et la question sur UN écran (aucun aller-retour) */}
              <div className="space-y-3" data-paging-keep>
              {sw(
                <WonPanel id="store" won={won.r2} title="سلسلتك في المخزن الكبير:" lines={R2_LINES}
                  empty="جولة المخزن الكبير: لم تضع بعد PGCD في خانته." />,
                null,
              )}
              <TapQuestion prompt="العددان في الوضعية كبيران. أيّ طريقة توصل إلى أكبر عدد من المدارس بأقلّ حساب؟"
                options={[
                  'خوارزمية إقليدس: قسمات متتابعة، وآخر باقٍ غير معدوم هو PGCD',
                  'نجرّب عدد المدارس 1 ، 2 ، 3 ، … واحدًا واحدًا',
                  'قسمة واحدة للأكبر على الأصغر: باقيها هو عدد المدارس',
                ]}
                correct={0} cols={1} requires={['khwarizmiyat-iqlidus', 'pgcd-baqi']}
                explain={<span>تجربة المدارس واحدة واحدة صحيحة لكنّها تطول مع عددين كبيرين؛ والباقي الأوّل خطوة من الخوارزمية لا نتيجتها. خوارزمية إقليدس تصل في بضع قسمات — كما في المخزن الكبير.</span>}
                onAnswered={mark(3)} />
              </div>
              {q[3] && <KnowledgeBrick id="khwarizmiyat-iqlidus" variant="rappel" compact />}
            </div>
          ) },
        // L'ÉCRAN DU CAHIER (recette de la synthèse, point 5) : un vrai essai au crayon AVANT la correction pas à pas ; les étapes 5 et 6 sont la comparaison.
        { num: 4, title: 'بالقلم: خطّتك أنت', subtitle: 'اكتب في كرّاسك ثم قارن', done: !!q[4],
          content: (
            <div className="space-y-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-5 py-4" data-notebook-screen>
              <p className="text-xl font-black text-indigo-950"><span aria-hidden="true">📓 </span>اكتب في كرّاسك ثم قارن.</p>
              <p className="text-lg font-bold text-slate-800">اكتب في 3 أسطر: ماذا يقسم عدد المدارس، أيّ حساب يعيّنه، وكيف نجد ما تأخذه كل مدرسة.</p>
              <ol className="ms-6 list-decimal space-y-1 text-base text-slate-700">
                <li>عدد المدارس يقسم أيّ عددين؟</li>
                <li>أيّ حساب يعطي أكبره، وأين نتوقّف؟</li>
                <li>بأيّ قسمة نجد نصيب كل مدرسة من كل لون؟</li>
              </ol>
              <p className="text-sm text-slate-600">الخطوات التالية تصحّح أسطرك سطرًا سطرًا. الحساب نفسه ينتظرك في التحدّي <span aria-hidden="true">🏆</span>.</p>
              {/* le bouton RESTE (aria-disabled après l'appui : le focus ne tombe pas sur la page) ; la région vivante est toujours montée */}
              <button type="button" onClick={() => { if (!q[4]) mark(4)(); }} aria-disabled={q[4] || undefined} data-notebook-done
                className={`min-h-[52px] rounded-2xl px-6 text-lg font-black focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${q[4] ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 'bg-indigo-700 text-white shadow-[0_3px_0_0_#3730A3] hover:bg-indigo-800'}`}>
                {q[4] ? <><span aria-hidden="true">✓ </span>كتبتُ أسطري</> : 'كتبتُ أسطري — أقارن الآن'}
              </button>
              <p className="font-bold text-emerald-800" role="status">{q[4] ? 'قارن الآن أسطرك بالخطوات التالية.' : ''}</p>
            </div>
          ) },
        // LE MODÈLE, première étape au crayon : « عدد المدارس = PGCD(▢ ; ▢) » — les données sur le même écran.
        { num: 5, title: 'ترييض الوضعية', subtitle: 'عدد المدارس بالرموز', done: !!q[5],
          content: (
            <div className="space-y-3" data-paging-keep>
              <Facts />
              <TapQuestion
                prompt="أكبر عدد ممكن من المدارس يساوي:"
                options={['$\\mathrm{PGCD}(936\\ ;\\ 845)$', '$936 - 845$', '$936 + 845$', '$936 \\div 845$'].map(M)}
                correct={0} cols={2} requires={['pgcd-taarif']}
                explain={<MathText>{'عدد المدارس قاسم مشترك للعددين $936$ و $845$ ، وأكبر قاسم مشترك لهما هو $\\mathrm{PGCD}(936\\ ;\\ 845)$ . أمّا الفرق فخطوة من خوارزمية الفروق، والمجموع لا يضمن أن يتوزّع كل لون وحده.'}</MathText>}
                onAnswered={mark(5)} />
            </div>
          ) },
        { num: 6, title: 'تنفيذ الاستراتيجية: نصيب كل مدرسة', subtitle: 'بالحرف g قبل الحساب', done: !!q[6],
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<MathText>{'نسمّي $g = \\mathrm{PGCD}(936\\ ;\\ 845)$ عدد المدارس. احكم على كل عبارة.'}</MathText>}
                rows={[
                  { id: 'p1', label: <MathText>{'كل مدرسة تأخذ $936 \\div g$ مئزرًا ورديًا و $845 \\div g$ مئزرًا أزرق.'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{'نقسم كل لون على عدد المدارس: $936 = g \\times (936 \\div g)$ ولا يبقى شيء.'}</MathText> },
                  { id: 'p2', label: <MathText>{'كل مدرسة تأخذ $g$ مئزرًا من كل لون.'}</MathText>, options: TRUE_FALSE, correct: 1, correction: <MathText>{'$g$ هو عدد المدارس، لا ما تأخذه المدرسة الواحدة: نصيبها هو ناتج القسمة على $g$ .'}</MathText> },
                  { id: 'p3', label: 'نتوقّف في خوارزمية إقليدس عند أوّل باقٍ نحصل عليه.', options: TRUE_FALSE, correct: 1, correction: 'نتوقّف حين يصير الباقي معدومًا؛ وعدد المدارس هو آخر باقٍ غير معدوم.' },
                  { id: 'p4', label: <MathText>{'قاسم مشترك أصغر من $g$ يعطي توزيعًا دون باقٍ، لكنّ عدد المدارس فيه ليس الأكبر.'}</MathText>, options: TRUE_FALSE, correct: 0, correction: <MathText>{'كل قاسم مشترك يقسم $g$ ويوزّع دون باقٍ، لكنّ المطلوب أكبر عدد ممكن من المدارس: $g$ نفسه.'}</MathText> },
                ]}
                requires={['pgcd-taarif', 'khwarizmiyat-iqlidus']}
                feedback={({ allRight }) => <span>{allRight ? 'أحسنت: عدد المدارس هو PGCD، ونصيب كل مدرسة من كل لون هو ناتج قسمة عدده على PGCD.' : 'عدد المدارس g هو آخر باقٍ غير معدوم، ونصيب كل مدرسة ناتج قسمة كل لون على g.'}</span>}
                onAnswered={mark(6)} />
              {q[6] && <TextbookBox kind="remark" text="الحساب نفسه — القسمات المتتابعة ونصيب كل مدرسة — هو التحدّي: هنا فهمنا واختطّينا الاستراتيجية فقط." compact />}
            </div>
          ) },
        // « ورقة نسيبة » (recette de la synthèse, point 5) : la DERNIÈRE étape — un PLAN faux d'une camarade, une erreur de JUSTIFICATION.
        { num: 7, title: 'ورقة نسيبة', subtitle: 'أين أخطأت نسيبة في خطّتها؟', done: !!q[7],
          content: <PeerSheet sheet={PEER_SHEET} kid={PEER_KID} onDone={mark(7)} /> },
      ]}
      footer={(
        <>
          <KnowledgeSnapshot moduleNumber={7} variant="memo" />
          {sw(
            <p className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-center text-base font-black text-amber-900" data-mission-pause>
              <span aria-hidden="true">⏸️ </span>استرح قليلًا: التحدّي هو المحطّة التالية <span aria-hidden="true">🏆</span>
            </p>,
            null,
          )}
        </>
      )} />
  );
}
