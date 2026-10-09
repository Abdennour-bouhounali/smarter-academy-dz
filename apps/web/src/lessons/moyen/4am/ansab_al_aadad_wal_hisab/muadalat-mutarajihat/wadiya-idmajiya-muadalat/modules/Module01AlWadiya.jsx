import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { bidi } from '../../../../../../../utils/bidi';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION, WARMUP, REMARKS, LAB } from '../content/textbook';
import { PoolScene } from '../components/MuadalatFigures';

/**
 * Module 1 — la وضعية (p. 52) : le مسبح البلدي et ses deux formules
 * d'abonnement, lus dans les TROIS étapes du « تحليل الوضعية » du manuel
 * (قراءة الوضعية وفهمها · تحليل الوضعية واختيار استراتيجية حل مناسبة · تنفيذ
 * استراتيجية الحل), comme la synthèse de l'unité 3.
 *
 * LE LABORATOIRE (growth-race, RÉUTILISÉ de « ترييض مشكلة », deux niveaux dans
 * un ManipulationWorkspace, ouvert sur مبتدئ par défaut depuis 2026-10-09 : c'est la situation du manuel) :
 *   متقدم  75x contre 560 + 5x (`goal="greater"` : la formule 1 dépasse la 2) —
 *          l'élève porte « × x » sur ce qui se paie à chaque séance (le ticket),
 *          jamais sur l'abonnement (refusé : MISC-WADIYA-TARJAMA), puis étire
 *          le nombre de séances ; les coûts se rejoignent à 8 et se croisent.
 *   مبتدئ  la tarification de la plateforme 50x contre 200 + 10x (croisement à 5) ;
 *          elle sert l'étape « تفسير النتائج », pour que la réponse du manuel
 *          (9 séances) reste celle de « أحلّ الوضعية ».
 * Les essais de l'élève (`onTrial`) sont listés au-dessus des questions
 * (`[data-activity-evidence]`) ; le modèle qu'il a vérifié (`onModel`) aussi.
 *
 * Les étapes : ce qui est cherché (étape 1 du manuel), la traduction de chaque
 * formule (brique `tarjama-sigha` APRÈS la réponse), l'essai (étape 2 —
 * `tajrib`), l'inéquation qui départage (`mutarajiha-mufadala`), puis
 * l'interprétation sur le niveau مبتدئ (étape 3 — `tafsir-natija`,
 * `tariqat-wadiya`). La résolution du مسبح est le module 4 (évaluation). LP : P2, P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const FITS = ['يترجمها', 'لا يترجمها'];

/** Les essais de l'élève sur un niveau du laboratoire (le dernier x validé fait foi). */
function Evidence({ trials, level, titles, empty }) {
  const list = Object.values(trials).sort((u, v) => u.x - v.x);
  return (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence={level}>
      {list.length === 0 && <li className="text-slate-500" data-tried="false">{empty}</li>}
      {list.map((tr) => (
        <li key={tr.x} data-tried="true" data-rel={tr.rel} className={tr.rel === '>' ? 'font-bold text-emerald-800' : tr.rel === '=' ? 'font-bold text-amber-800' : 'text-slate-800'}>
          <MathText>{`$x = ${tr.x}$ : ${titles[0]} $${tr.leftText}$ دج ، ${titles[1]} $${tr.rightText}$ دج ($${tr.leftText} ${tr.rel} ${tr.rightText}$)`}</MathText>
        </li>
      ))}
    </ul>
  );
}

export default function Module01AlWadiya() {
  const [big, setBig] = useState({});
  const [small, setSmall] = useState({});
  const [model, setModel] = useState(null);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const keep = (set) => (trial) => { if (trial) set((t) => ({ ...t, [trial.x]: trial })); };
  const { perSession1: p1, yearly: fixed, perSession2: p2 } = SITUATION.numbers;

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="الوضعية وتحليلها" moduleSubtitle="المسبح البلدي: أيّ صيغة اشتراك أفضل؟" estimatedTime="16 دقيقة"
      brief={{
        tag: 'أدمج تعلّماتي — الكتاب ص 52', headline: 'صيغتان للاشتراك في المسبح البلدي', emoji: '🏊', visual: <PoolScene />,
        title: 'ابتداءً من أي عدد للحصص تكون التسعيرة الثانية أفضل؟', tone: 'amber',
        body: (
          <div className="space-y-2">
            <p>{SITUATION.intro}</p>
            <ul className="ms-4 list-disc space-y-1">
              <li>{SITUATION.formula1}</li>
              <li>{SITUATION.formula2}</li>
            </ul>
            <p className="font-semibold">{SITUATION.question}</p>
            <p className="text-xs text-slate-500">{SITUATION.figure}</p>
          </div>
        ),
        footer: <SourceTag source={SITUATION.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead={<MathText>{'المستوى المتقدّم هو وضعية الكتاب: 75 دينارًا للحصة، أو 560 دينارًا سنويًا و 5 دنانير للحصة. في المستوى المبتدئ مسبح الحيّ بأعداد أصغر.'}</MathText>}
          levels={{
            beginner: () => (
              <Manipulation
                type="growth-race"
                level="beginner"
                {...LAB.beginner}
                title={bidi('مسبح الحيّ: 50x أم 200 + 10x؟')}
                lead={WARMUP.text}
                onTrial={keep(setSmall)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="growth-race"
                level="advanced"
                {...LAB.advanced}
                title={bidi('المسبح البلدي: 75x أم 560 + 5x؟')}
                lead="ضع البطاقة «× x» على كل مبلغ يُدفع في كل حصة، ثم مدّد عدد الحصص: متى يصبح ثمن الصيغة الأولى أكبر من ثمن الثانية؟"
                onTrial={keep(setBig)}
                onModel={({ tex }) => setModel(tex)}
              />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'قراءة الوضعية وفهمها', subtitle: 'المرحلة 1 من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="ما المطلوب في الوضعية؟"
                options={['أصغر عدد من الحصص تكون ابتداءً منه الصيغة الثانية أقل تكلفة', 'عدد الحصص الذي تتساوى فيه تكلفتا الصيغتين', 'ثمن حصة واحدة في كل صيغة', 'الصيغة الأرخص إذا سبحنا حصة واحدة']}
                correct={0} cols={1} requires={['tarrid-tarjama']}
                explain="«أفضل» تعني «أقل تكلفة»، و«ابتداءً من أي عدد» تطلب أول عدد للحصص تصبح عنده الصيغة الثانية أرخص — وتبقى كذلك بعده. ثمن الحصة معلوم في النص."
                onAnswered={() => setQ1(true)} />
              {q1 && <TextbookBox kind="remark" title={SITUATION.analysis[0].label} text={SITUATION.analysis[0].text} source={SITUATION.source} compact />}
            </div>
          ) },
        { num: 2, title: 'ترجمة كل صيغة بعبارة حرفية', subtitle: 'نسمّي x عدد الحصص', done: q2,
          content: (
            <div className="space-y-3">
              <p className="rounded-lg bg-slate-50 px-2 py-1 text-sm text-slate-700" data-activity-evidence="model">
                {model
                  ? <>النموذج الذي بنيته في المسبح (المستوى المتقدّم): <MathText>{`$${model}$`}</MathText></>
                  : 'لم تتحقّق بعد من نموذج في المسبح: ضع البطاقة «× x» ثم اضغط «تحقّق من النموذج».'}
              </p>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">تكلفة <MathText>{'$x$'}</MathText> حصة: هل تترجم كل عبارة الصيغة المذكورة؟</p>}
                rows={[
                  { id: 'f1a', label: <span>الصيغة الأولى: <MathText>{'$75x$'}</MathText></span>, options: FITS, correct: 0, correction: <MathText>{`75 دينارًا في كل حصة، و $x$ حصة: $${p1} \\times x = ${p1}x$.`}</MathText> },
                  { id: 'f1b', label: <span>الصيغة الأولى: <MathText>{'$75 + x$'}</MathText></span>, options: FITS, correct: 1, correction: <MathText>{'المبلغ يتكرّر في كل حصة: نضرب في $x$ ولا نضيف $x$.'}</MathText> },
                  { id: 'f2a', label: <span>الصيغة الثانية: <MathText>{'$560 + 5x$'}</MathText></span>, options: FITS, correct: 0, correction: <MathText>{REMARKS.tarjamaRight}</MathText> },
                  { id: 'f2b', label: <span>الصيغة الثانية: <MathText>{'$(560 + 5)x$'}</MathText></span>, options: FITS, correct: 1, correction: <MathText>{REMARKS.tarjamaWhy}</MathText> },
                  { id: 'f2c', label: <span>الصيغة الثانية: <MathText>{'$560x + 5$'}</MathText></span>, options: FITS, correct: 1, correction: <MathText>{`العكس: الاشتراك ${fixed} دينار مرّة واحدة، و ${p2} دنانير في كل حصة.`}</MathText> },
                ]}
                requires={['tarrid-tarjama']}
                feedback={({ allRight }) => <MathText>{allRight ? REMARKS.tarjamaRight : `${REMARKS.tarjamaWhy} ${REMARKS.tarjamaRight}`}</MathText>}
                onAnswered={() => setQ2(true)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la traduction est celle de ترييض مشكلة (درس 4, tarrid-namdhaja) et la correction de la
                  question ci-dessus (REMARKS.tarjamaWhy / tarjamaRight) vient de la dire. */}
              {q2 && <KnowledgeBrick id="tarjama-sigha" variant="rappel" />}
            </div>
          ) },
        { num: 3, title: 'التجريب', subtitle: 'المرحلة 2 من الكتاب — جرّب في السباق', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={SITUATION.analysis[1].label} text={SITUATION.analysis[1].text} source={SITUATION.source} compact />
              <p className="text-sm font-semibold text-slate-700">محاولاتك في المسبح البلدي (المستوى المتقدّم):</p>
              <Evidence trials={big} level="advanced" titles={['الصيغة الأولى', 'الصيغة الثانية']} empty="لم تجرّب بعد أي عدد للحصص في السباق: ابنِ النموذج، افتح السباق ومدّد x." />
              <NumericQuestion
                prompt={<span>جرّب بالحساب: من أجل <MathText>{'$x = 10$'}</MathText> حصص، كم دينارًا ندفع بالصيغة الثانية؟</span>}
                expected={fixed + p2 * 10}
                requires={['tarjama-sigha']}
                explain={<MathText>{`$${fixed} + ${p2} \\times 10 = ${fixed + p2 * 10}$ دينارًا، وبالصيغة الأولى $${p1} \\times 10 = ${p1 * 10}$ دينارًا: من أجل 10 حصص الصيغة الثانية أرخص.`}</MathText>}
                explainFor={(n) => (n === (fixed + p2) * 10
                  ? <MathText>{`ضربت الاشتراك أيضًا في 10. ${REMARKS.tarjamaWhy}`}</MathText>
                  : n === p1 * 10 ? <MathText>{'هذا ثمن الصيغة الأولى: $75 \\times 10$.'}</MathText> : undefined)}
                onAnswered={() => setQ3(true)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : l’encadré du manuel de cette étape nomme l’essai, et l’explication de la question vient
                  de le faire (les deux coûts pour 10 séances) — une stratégie connue depuis le cycle moyen. */}
              {q3 && <KnowledgeBrick id="tajrib" variant="rappel" />}
            </div>
          ) },
        { num: 4, title: 'كتابة متراجحة مناسبة', subtitle: 'المقارنة بين الصيغتين', done: q4,
          content: (
            <div className="space-y-3">
              <Evidence trials={big} level="advanced" titles={['الصيغة الأولى', 'الصيغة الثانية']} empty="لم تجرّب بعد أي عدد للحصص في السباق." />
              <TapQuestion
                prompt="«الصيغة الثانية أفضل» تُترجم بالمتراجحة:"
                options={['$560 + 5x < 75x$', '$560 + 5x > 75x$', '$560 + 5x = 75x$', '$560x + 5 < 75x$'].map(M)}
                correct={0} cols={2} requires={['tarjama-sigha', 'tajrib', 'hall-mutarajiha']}
                explain={<span><MathText>{REMARKS.mufadala}</MathText> المساواة تصف لحظة تساوي التكلفتين فقط، و <MathText>{'$560x + 5$'}</MathText> يجعل الاشتراك يُدفع في كل حصة.</span>}
                onAnswered={() => setQ4(true)} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : traduire une comparaison par une inéquation est tarrid-mutarajiha (درس 4), et
                  l’explication de la question ci-dessus (REMARKS.mufadala) vient de l’énoncer. */}
              {q4 && <KnowledgeBrick id="mutarajiha-mufadala" variant="rappel" />}
            </div>
          ) },
        { num: 5, title: 'تفسير النتائج', subtitle: 'المرحلة 3 من الكتاب — على مسبح الحيّ', done: q5,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" title={SITUATION.analysis[2].label} text={SITUATION.analysis[2].text} source={SITUATION.source} compact />
              <p className="rounded-lg bg-amber-50 px-2 py-1 text-sm">{WARMUP.text} <SourceTag source={WARMUP.source} /></p>
              <p className="text-sm font-semibold text-slate-700">محاولاتك في مسبح الحيّ (المستوى المبتدئ):</p>
              <Evidence trials={small} level="beginner" titles={['الصيغة (أ)', 'الصيغة (ب)']} empty="لم تجرّب بعد مسبح الحيّ: افتح المستوى المبتدئ ومدّد x." />
              <TapQuestion
                prompt={<span>«الصيغة (ب) أفضل» تعني <MathText>{'$200 + 10x < 50x$'}</MathText> ، وحلّها <MathText>{'$x > 5$'}</MathText>. ابتداءً من أي عدد للحصص تكون الصيغة (ب) أفضل؟</span>}
                options={['6 حصص', '5 حصص', 'أقل من 5 حصص', '50 حصة']}
                correct={0} cols={2} requires={['mutarajiha-mufadala', 'hall-mutarajiha']}
                explain={<span><MathText>{REMARKS.tasawiWhy}</MathText> <MathText>{REMARKS.tasawiRight}</MathText></span>}
                onAnswered={() => setQ5(true)} />
              {q5 && (
                <>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : garder les solutions qui conviennent (nombre naturel) est tahaqquq-waqi (درس 4), et
                      l’explication de la question ci-dessus (REMARKS.tasawiWhy / tasawiRight) vient de le dire. */}
                  <KnowledgeBrick id="tafsir-natija" variant="rappel" />
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche ne fait que remettre en ordre les trois étapes du « تحليل الوضعية » que
                      l’élève vient de lire (encadrés des étapes 1, 3 et 5) — et tarrid-tariqa (درس 4). */}
                  <KnowledgeBrick id="tariqat-wadiya" variant="rappel" />
                  <TextbookBox kind="remark" text={REMARKS.notSolvedHere} compact />
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
