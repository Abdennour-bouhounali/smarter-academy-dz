import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE : le chantier, puis le نشاط 3 (p. 8) (rétrofit 2026-10-15 : labo en tête sans carte ni titre, la 1re question
 * demande POURQUOI pas de demi-brique, le rappel APRÈS la réponse, les cas 2 et 3 du livre en application).
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels) :
 *
 *   مبتدئ  — le cas 1 du manuel (3 | 18 et 12), sur un CHANTIER : deux murs
 *            en briques de longueur 3 (thème `construction`). Accoler,
 *            enlever, mesurer — le résultat est toujours un mur de briques
 *            entières, et les briques se comptent des yeux.
 *   متقدم  — 9 | 900 et 90 : même chantier, briques trop petites pour être
 *            comptées ; il faut prédire AVEC la propriété avant de poser.
 *            C'est le passage de « je constate » à « je raisonne », et c'est
 *            ce que la leçon vise.
 *
 * Les cas 2 et 3 du manuel restent à l'étape 1 : c'est là que le manuel les
 * pose, et une manipulation ne se rend jamais deux fois sur une page.
 * LP : P1, P3.
 */
export default function Module01ThalathHalat() {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [trials, setTrials] = useState([]);
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : l'étape 1 en garde la TRACE (`checkpoint-done`), puis pose le nom (brique)
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const record = (e) => setTrials((list) => [...list, e]);
  const q1 = answered('sum') && answered('diff');
  const [conj, setConj] = useState(false);
  const [{ a, b, n }, c2v, c3v] = ACTIVITY.cases;
  return (
    <ContentModule objectives={["إذا كان n يقسم a و b، فماذا يقسم أيضًا؟", "هل تصحّ الملاحظة مع أعداد كبيرة لا نستطيع عدّها؟", "ماذا يحدث في الحالات الثلاث؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 3 — ثلاث حالات" moduleSubtitle="n يقسم a و b. ماذا يقسم أيضًا؟" estimatedTime="12 دقيقة"
      intro={(
        <ManipulationWorkspace
          levels={{
            beginner: () => (
              <Manipulation type="divisor-properties" n={n} a={a} b={b} onTrial={record} onFinished={() => setC1(true)} />
            ),
            advanced: () => (
              <Manipulation type="divisor-properties" n={9} a={900} b={90} onTrial={record} onFinished={() => setC1(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'لماذا لم يظهر نصف طوبة؟', subtitle: 'أنهِ الحالة في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={c1 ? 'true' : 'false'}>
                {q1
                  ? <span className="font-bold text-slate-800">أجبتَ في المختبر: عندما ألصقتَ الجدارين أو نزعتَ أحدهما من الآخر لم يظهر نصف طوبة، لأنّ كل جدار مبنيّ بعدد صحيح من الطوب.</span>
                  : <span className="text-slate-500">لم تُنهِ الجدارين الأولين في المناولة بعد: ألصق جدار b، ثم انزعه، وأجب عن الأسئلة التي تظهر فوق المختبر.</span>}
              </p>
              {q1 && <KnowledgeBrick id="qasim-mushtarak-rappel" variant="rappel" compact />}
            </div>
          ) },
        { num: 2, title: 'الحالتان 2 و 3 من الكتاب', subtitle: 'هل يصحّ ما لاحظته مع أعداد أخرى؟', done: c2,
          content: (
            <div className="space-y-3">
              <Manipulation type="divisor-properties" n={c2v.n} a={c2v.a} b={c2v.b} title="الحالة 2: n = 5، a = 35، b = 15" onFinished={() => setC2(true)} />
              <Manipulation type="divisor-properties" n={c3v.n} a={c3v.a} b={c3v.b} title="الحالة 3: n = 7، a = 56، b = 21" />
            </div>
          ) },
        { num: 3, title: 'انقل وأكمل التخمين', done: conj,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="conjecture" text={ACTIVITY.conjectures[0].blank} compact />
              <TapQuestion prompt={<span>أكمل التخمين الأول:</span>}
                options={['إذا كان n يقسم كلا من a و b فإن n يقسم a + b و n يقسم a − b', 'إذا كان n يقسم a فإن n يقسم b', 'إذا كان n يقسم a + b فإن n يقسم a و b', 'إذا كان n أصغر من a و b فإن n يقسم a + b']}
                correct={0} cols={1} requires={['qasim-mushtarak-rappel']}
                explain={<span>في الحالات الثلاث، قَسَم <MathText>{'$n$'}</MathText> المجموع والفرق. التخمين الثاني: <MathText>{ACTIVITY.conjectures[1].blank}</MathText> — يصبح خاصية في المحور الموالي.</span>}
                onAnswered={() => setConj(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
