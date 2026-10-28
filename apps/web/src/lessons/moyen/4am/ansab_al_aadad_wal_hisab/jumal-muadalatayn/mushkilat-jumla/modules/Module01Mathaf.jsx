import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, LAB, MISTAKE_TARJAMA, MISTAKE_HALF } from '../content/textbook';
import StepsTable from '../components/StepsTable';

/**
 * Module 1 — نشاط 3 (p. 57) : les CINQ étapes faites à la main, puis le TABLEAU du manuel.
 *
 * Rétrofit 2026-10-15 (§4quater) : le laboratoire OUVRE le module (ni carte du manuel, ni titre / `lead` de workspace). Le labo
 * `story-modeller` (deux niveaux) fait les cinq étapes — nommer, traduire, résoudre, REJOUER l'histoire, répondre :
 *   مبتدئ  — le derby (plateforme, ENTRÉE choisie) : 20 billets, 300 / 150 DA, 4800 DA ; inconnues déjà nommées ;
 *   متقدم  — le musée du manuel (140 visiteurs, 30300 DA) : l'élève nomme lui-même les inconnues ; ses réponses remplissent la
 *            colonne « حل » du tableau du manuel (`StepsTable`, `[data-activity-evidence]`).
 * Les DEUX niveaux rendent leurs essais (`onModel`, `onSolved`, `onTrial`) : chaque question parle des nombres du niveau que
 * l'élève vient de jouer (`WORLD`), jamais d'une réponse affichée d'office, et ne repose pas ce que le labo a déjà demandé.
 *
 * Étapes = POURQUOI, une par ligne du tableau : (1) pourquoi ces inconnues (et pas les prix) ; (2) pourquoi le labo refuse
 * « 300x + 150y = nombre de personnes », puis la brique « jumla-tarjama » ; (3) pourquoi x seul ne répond pas ; (4) pourquoi vérifier
 * les DEUX informations, puis la brique « khutuwat-hall » et le tableau du manuel rempli par l'élève. LP : P1, P2.
 *
 * LABO À QUESTIONS (2026-10-28, `primitives/LabCheckpoint`) : le labo pose lui-même, par-dessus chaque étape (المجاهيل, الترجمة, الحل, التحقق, الإجابة), les
 * questions sur ce que l'élève vient de faire. Les étapes ci-dessous en gardent la TRACE (`answered(<étape>)`, événements `checkpoint-done`) au lieu de reposer
 * la même question : (1) المجاهيل — au niveau متقدم seulement (le derby est déjà nommé) ; (2) الترجمة ; (3) الحل puis la phrase de réponse ; (4) التحقق.
 */
// Les nombres de chaque niveau — ceux que l'élève vient de manipuler (derby par défaut : le niveau d'ouverture).
const WORLD = {
  beginner: {
    unknowns: 'عدد تذاكر الكبار وعدد تذاكر الصغار', wrongUnknown: 'ثمن تذكرة الكبير وثمن تذكرة الصغير',
    total: 20, countNoun: 'تذكرة', money: 4800, bad: '300x + 150y = 20', x: 12, y: 8, swap: [8, 12], swapMoney: 4200,
    halfWrong: 'اشترت الرابطة 12 تذكرة.', priced: '300 و 150',
  },
  advanced: {
    unknowns: 'عدد البالغين وعدد الصغار', wrongUnknown: 'ثمن تذكرة البالغ وثمن تذكرة الصغير',
    total: 140, countNoun: 'زائرا', money: 30300, bad: '300x + 150y = 140', x: 62, y: 78, swap: [78, 62], swapMoney: 32700,
    halfWrong: 'زار المتحف 62 زائرا.', priced: '300 و 150',
  },
};

export default function Module01Mathaf() {
  const [evidence, setEvidence] = useState({});
  const [world, setWorld] = useState('beginner');
  const [seen, setSeen] = useState({ beginner: { refused: 0, model: false, pair: null }, advanced: { refused: 0, model: false, pair: null } });
  const [cps, setCps] = useState([]);
  const [q1, setQ1] = useState(false);
  const add = (patch) => setEvidence((e) => ({ ...e, ...patch }));
  const note = (lvl, patch) => { setWorld(lvl); setSeen((s) => ({ ...s, [lvl]: { ...s[lvl], ...(typeof patch === 'function' ? patch(s[lvl]) : patch) } })); };
  // les questions posées PAR-DESSUS le labo : une étape est faite quand la suite de questions de son étape l'est (n'importe quel niveau)
  const answered = (id) => cps.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const onCheckpoint = (lvl) => (ev) => { setWorld(lvl); setCps((l) => [...l, ev]); };
  const q2 = answered('model');
  const q3 = answered('answer');
  const q4 = answered('verify');
  const W = WORLD[world];
  const S = seen[world];
  const nb = (v) => <bdi dir="ltr">{v}</bdi>;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — من القصة إلى الجملة"
      moduleSubtitle="لماذا هذان المجهولان؟ ولماذا هاتان المعادلتان؟"
      objectives={['ما المجهولان في القصة؟ وكيف نختارهما؟', 'كيف نحوّل كل معلومة في النص إلى معادلة؟', 'كيف نتأكد من الجواب في القصة نفسها؟']}
      estimatedTime="15 دقيقة"
      intro={
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="story-modeller"
                level="beginner"
                {...LAB.beginner}
                onCheckpoint={onCheckpoint('beginner')}
                onModel={() => note('beginner', { model: true })}
                onSolved={({ x, y }) => note('beginner', { pair: `(${x} ; ${y})` })}
                onTrial={(tr) => { if (tr.stage === 'model' && !tr.ok) note('beginner', (p) => ({ refused: p.refused + 1 })); }}
              />
            ),
            advanced: () => (
              <Manipulation
                type="story-modeller"
                {...LAB.advanced}
                onCheckpoint={onCheckpoint('advanced')}
                onModel={({ tex, system, unknowns }) => { note('advanced', { model: true }); add({ unknowns, system: tex, equations: system.split('|').map((eq) => eq.replace(/([+=-])/g, ' $1 ')) }); }}
                onSolved={({ x, y }) => { note('advanced', { pair: `(${x} ; ${y})` }); add({ pair: `(${x} ; ${y})` }); }}
                onTrial={(tr) => {
                  if (tr.stage === 'model' && !tr.ok) note('advanced', (p) => ({ refused: p.refused + 1 }));
                  if (tr.stage === 'verify' && tr.ok) add({ checked: [`${tr.values.x} + ${tr.values.y} = 140`, `300 \\times ${tr.values.x} + 150 \\times ${tr.values.y} = 30300`] });
                }}
                onFinished={() => add({ answer: ACTIVITY.closing })}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: '1) لماذا هذان المجهولان؟', subtitle: 'ما يسأل عنه السؤال', done: q1 || answered('name'),
          content: (
            <div className="space-y-3">
              {answered('name') ? (
                <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900" data-activity-evidence="name" data-tried="true">
                  أجبتَ في المختبر: المجهولان «{WORLD.advanced.unknowns}» لأنّ السؤال يطلبهما والنص لا يعطيهما، أمّا الأثمان (<MathText>{'$300$ DA و $150$ DA'}</MathText>) فمعطاة في النص.
                </p>
              ) : (
              <TapQuestion
                prompt={<span>في قصتك أثمان التذاكر (<MathText>{'$300$ DA و $150$ DA'}</MathText>) مذكورة في النص. لماذا جعلنا المجهولين «{W.unknowns}» ولم نجعلهما «{W.wrongUnknown}»؟</span>}
                options={[
                  'لأنّ السؤال يطلب عددين لا نعرفهما، أمّا الأثمان فمعطاة في النص',
                  'لأنّ الأثمان أعداد كبيرة يصعب التعامل معها',
                  'لأنّ المجهول يجب أن يكون دائمًا العدد الأصغر',
                ]}
                correct={0}
                cols={1}
                requires={['tarjama-ibara']}
                explain="المجهولان ما يسأل عنه السؤال: «أوجد عدد البالغين وعدد الصغار». عدد الزوار والمداخيل وثمنا التذكرتين معطاة في النص."
                onAnswered={() => setQ1(true)}
              />
              )}
            </div>
          ),
        },
        {
          num: 2, title: '2) لماذا رفض المختبر هذه المعادلة؟', subtitle: 'كل معلومة معادلة، وحدة واحدة في كل معادلة', done: q2,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-600" data-activity-evidence data-tried={S.model ? 'true' : 'false'}>
                {S.refused > 0 ? `رفض المختبر ${S.refused === 1 ? 'محاولة واحدة' : `${S.refused} محاولات`} من محاولاتك قبل أن تقبل جملتك.` : S.model ? 'قبل المختبر جملتك من أول محاولة.' : 'لم تبنِ جملة بعدُ في المناولة أعلاه.'}
              </p>
              <p className={`rounded-xl border-2 px-3 py-2 text-sm ${q2 ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`} data-activity-evidence="model" data-tried={q2 ? 'true' : 'false'}>
                {q2
                  ? <span>أجبتَ في المختبر عمّا يجمعه طرف كل معادلة: لو كتب تلميذ <MathText>{`$${W.bad}$`}</MathText> لساوى مبلغًا بعدد أشخاص — <MathText>{MISTAKE_TARJAMA.why}</MathText></span>
                  : 'ابنِ جملتك في المختبر، ثم أجب عن الأسئلة التي تظهر فوقه بعد قبولها.'}
              </p>
              {q2 && <KnowledgeBrick id="jumla-tarjama" lead="ما رفضه المختبر وقبله هو المرحلة 2 من جدول الكتاب:" />}
            </div>
          ),
        },
        {
          num: 3, title: '3) لماذا لا يكفي أحد العددين؟', subtitle: 'الحل ثنائية', done: q3,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-600" data-activity-evidence data-tried={S.pair ? 'true' : 'false'}>
                {S.pair ? <span>الثنائية التي وجدتها: <bdi dir="ltr">{S.pair}</bdi></span> : 'لم تحلّ الجملة بعدُ في المناولة أعلاه.'}
              </p>
              <p className={`rounded-xl border-2 px-3 py-2 text-sm ${q3 ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`} data-activity-evidence="answer" data-tried={q3 ? 'true' : 'false'}>
                {q3
                  ? <span>أجبتَ في المختبر: لو توقف تلميذ عند <MathText>{`$x = ${W.x}$`}</MathText> وكتب «{W.halfWrong}» لنقصه الجواب — <MathText>{MISTAKE_HALF.why}</MathText></span>
                  : 'حلّ الجملة وتحقّق في المختبر ثم أجب عن الأسئلة التي تظهر فوقه عند الإجابة.'}
              </p>
            </div>
          ),
        },
        {
          num: 4, title: '4) لماذا نتحقق من المعلومتين معًا؟', subtitle: 'نتحقق في النص نفسه، ثم نجيب بجملة', done: q4,
          content: (
            <div className="space-y-3">
              <p className={`rounded-xl border-2 px-3 py-2 text-sm ${q4 ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`} data-activity-evidence="verify" data-tried={q4 ? 'true' : 'false'}>
                {q4
                  ? <MathText>{`أجبتَ في المختبر: تبديل القيمتين يُبقي ${W.total} ${W.countNoun} لكنه يعطي ${W.swapMoney} DA لا ${W.money} DA، فنتحقق من المعلومتين معًا.`}</MathText>
                  : 'أعد القصة بالحل في المختبر ثم أجب عن الأسئلة التي تظهر فوقه.'}
              </p>
              {q4 && (
                <>
                  <KnowledgeBrick id="khutuwat-hall" lead="الأسطر الخمسة لجدول الكتاب هي مراحل حل كل مشكلة:" />
                  <StepsTable evidence={evidence} emptyText="أكمل هذه المرحلة في المختبر (المستوى المتقدّم)." />
                </>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
