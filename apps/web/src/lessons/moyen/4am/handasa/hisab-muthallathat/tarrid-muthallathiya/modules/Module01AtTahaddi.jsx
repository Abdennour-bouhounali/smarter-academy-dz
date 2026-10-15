import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { CHALLENGE, LAB, STADIUM, REMARKS } from '../content/textbook';
import LadderFigure from '../components/LadderFigure';
import LabEvidence from '../components/LabEvidence';

/**
 * Module 1 — le تحدّ de la page d'unité (p. 115, DOUBLON DÉCLARÉ, l'entrée de la leçon) sur le clinomètre du téléphone.
 *
 * LE WORKSPACE (`clinometer`, un objectif, props dans content/textbook.js › LAB) :
 *   مبتدئ  `height`, le projecteur du stade (plateforme) : viser le sommet depuis le bord du terrain, choisir tan et ×,
 *          mesurer depuis deux distances — la même hauteur ;
 *   متقدم  `ladder`, le تحدّ : l'échelle télescopique posée à 59° allongée jusqu'à la marque de 1,60 m (encadrée à la main
 *          entre 1,8 et 1,9), puis sin et ÷ : L ≈ 1,9 m. OUVERT PAR DÉFAUT (de nouveau depuis le rétrofit du 2026-10-15 : les étapes 1–3 portent sur lui) : c'est le تحدّ que
 *          le module porte, et son `lead` nomme ses nombres.
 * Aucune étape n'attend le laboratoire (`onFinished`) : les questions portent sur la figure du manuel (LadderFigure) et
 * les essais de l'élève (`onTrial`) sont listés au-dessus d'elles ([data-activity-evidence]).
 *   1. lire la figure : 1,60 m est OPPOSÉ à 59°, l'échelle est le وتر → brique tarid-muthallath   (LP P1)
 *   2. choisir le rapport : sin (cos demande le pied, tan oublie l'échelle) → brique ikhtiyar-nisba (LP P2)
 *   3. calculer L au dixième : 1,9 (× donne 1,4 ; 1,8 est une troncature) → brique majhul-maqam       (LP P2)
 *   4. le projecteur : pourquoi les hauteurs diffèrent un peu ; le sinus refusé → brique zawiyat-nazar (LP P1)
 * « أتوقّع القاعدة » : ikhtiyar-nisba et majhul-maqam sont des RAPPELS (la méthode `hisab-tul` du درس 1 les pose déjà :
 * nommer, choisir le rapport qui les contient, multiplier ou diviser) ; la question 4 écrit h = d × tan α et sa bonne
 * option dit la règle zawiyat-nazar : elle est enveloppée dans <PredictRule id="zawiyat-nazar"> (une seule prédiction,
 * puis question et brique). La « مسألة الدرس » (même échelle, autres nombres — module 4) clôt la dernière étape : le
 * laboratoire vit dans l'`intro`, aux deux niveaux.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const close = (v) => (n) => Number.isFinite(n) && Math.abs(n - v) < 1e-9;
const isLadder = (e) => e?.mode === 'ladder';
const isHeight = (e) => e?.mode === 'height';

export default function Module01AtTahaddi() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const keep = (e) => setTrials((list) => [...list, e].slice(-30));

  return (
    <ContentModule objectives={['كيف نترجم الوضعية إلى مثلث قائم؟', 'أيّ نسبة تربط المعلوم بالمجهول؟', 'كيف نحسب ارتفاعًا لا نستطيع الوصول إليه؟']} ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="التحدّ — سلّم الجدارية"
      moduleSubtitle="من السلّم الذي حصرته إلى الحساب" estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          defaultLevel="advanced"
          levels={{
            beginner: () => (
              <Manipulation type="clinometer" level="beginner" {...LAB.beginner} lead={STADIUM.text} onTrial={keep} />
            ),
            advanced: () => (
              <Manipulation type="clinometer" level="advanced" {...LAB.advanced} lead={<MathText>{'رسّامو جدارية الحي يسندون سلّمهم إلى جدار شاقولي، وتطبيق «مقياس الميل» في الهاتف يقرأ ميله: $59^{\\circ}$ . رأس السلّم يجب أن يصل إلى العلامة على ارتفاع $1{,}60\\,\\mathrm{m}$ .'}</MathText>} onTrial={keep} />
            ),
          }}
        />
      }
      steps={[
        { num: 1, title: 'أين الارتفاع 1,60 من الزاوية 59°؟', subtitle: 'ما المقابل؟ ما الوتر؟', done: !!q[1],
          content: (
            <div className="space-y-3">
              <LabEvidence id="advanced-read" trials={trials} filter={isLadder} title="محاولاتك بالسلّم (المستوى المتقدّم):"
                empty="لم تحرّك السلّم بعد: في المستوى المتقدّم اسحب رأسه (⇕) على الجدار." />
              <TextbookBox kind="exercise" title="تحدّ" text={CHALLENGE.text} source={CHALLENGE.source} compact>
                <LadderFigure height={CHALLENGE.numbers.height} angle={CHALLENGE.numbers.angle} label={CHALLENGE.ariaLabel} />
              </TextbookBox>
              <TapQuestion
                prompt={<MathText>{'الجدار شاقولي والأرض أفقية. بالنسبة إلى الزاوية التي قيسها $59^{\\circ}$ ، الارتفاع $1{,}60\\,\\mathrm{m}$ هو:'}</MathText>}
                options={['الضلع المقابل، والسلّم هو الوتر', 'الضلع المجاور، والسلّم هو الوتر', 'الوتر، والسلّم هو الضلع المقابل'].map(M)}
                correct={0} cols={1} requires={['shaquli-ufuqi', 'tarif-nisab']}
                explain={<MathText>{`${REMARKS.muqabilWatar} المجاور هو بعد قاعدة السلّم عن الجدار، والوتر يقابل الزاوية القائمة (عند قاعدة الجدار): إنه السلّم.`}</MathText>}
                onAnswered={mark(1)} />
              {q[1] && <KnowledgeBrick id="tarid-muthallath" lead="أول خطوة في كل وضعية:" />}
            </div>
          ) },
        { num: 2, title: 'لماذا الجيب لحساب طول السلّم؟', subtitle: 'ماذا نعرف؟ وماذا نريد؟', done: !!q[2],
          content: (
            <div className="space-y-3">
              <LabEvidence id="advanced" trials={trials} filter={isLadder} title="محاولاتك بالسلّم (المستوى المتقدّم):"
                empty="لم تحرّك السلّم بعد: في المستوى المتقدّم اسحب رأسه (⇕) على الجدار وراقب هل يصل إلى العلامة." />
              <TapQuestion
                prompt={<MathText>{'اخترت أنت نسبة وقسمة لتحسب طول السلّم L. المساواة $\\sin 59^{\\circ} = \\dfrac{1{,}6}{L}$ هي التي تصلح. لماذا الجيب وليس جيب التمام أو الظل؟'}</MathText>}
                options={[
                  'لأن الارتفاع 1,6 مقابل للزاوية والسلّم هو الوتر، والجيب هو النسبة التي تجمع المقابل والوتر',
                  'لأن قيس الزاوية $59^{\\circ}$ أكبر من $45^{\\circ}$',
                  'لأن الجيب أكبر من جيب التمام دائما',
                ].map(M)}
                correct={0} cols={1} requires={['tarid-muthallath', 'tarif-nisab']}
                explain={<MathText>{REMARKS.sinChoice}</MathText>}
                onAnswered={mark(2)} />
              {q[2] && <KnowledgeBrick id="ikhtiyar-nisba" variant="rappel" lead="النسبة التي تجمع المعلوم والمطلوب:" />}
            </div>
          ) },
        { num: 3, title: 'هل يوافق الحساب ما حصرته بيدك؟', subtitle: 'قيمة مقربة إلى الجزء من 10', done: !!q[3],
          content: (
            <div className="space-y-3">
              <LabEvidence id="advanced-result" trials={trials} filter={isLadder} title="محاولاتك بالسلّم (المستوى المتقدّم):"
                empty="جرّب في المستوى المتقدّم: طولان متتاليان، واحد تحت العلامة وواحد فوقها، يحصران طول السلّم." />
              <NumericQuestion
                prompt={<MathText>{'حصرت السلّم بين طولين بالتجريب. من $\\sin 59^{\\circ} = \\dfrac{1{,}6}{L}$ ، ما قيمة L المقربة إلى الجزء من 10 (بالمتر)؟'}</MathText>}
                expected={close(1.9)} display="1,9" parse={parseDec}
                requires={['ikhtiyar-nisba', 'muadala-majhul-maqam', 'hasiba']}
                explain={<MathText>{REMARKS.ladderCalc}</MathText>}
                explainFor={(n) => <MathText>{close(1.4)(n) ? `${REMARKS.darbWrong} ${REMARKS.darbWhy}`
                  : close(1.6)(n) ? 'السلّم ليس بطول الارتفاع: سلّم طوله $1{,}6\\,\\mathrm{m}$ مائل بـ $59^{\\circ}$ لا يصل إلا إلى $1{,}37\\,\\mathrm{m}$ .'
                    : close(1.8)(n) ? 'بترت $1{,}866$ : المدوّر إلى الجزء من 10 هو $1{,}9$ لأن الرقم الموالي 6 أكبر من 5.'
                      : close(3.1)(n) ? 'قسمت على $\\cos 59^{\\circ}$ : جيب التمام يربط المجاور بالوتر، و $1{,}6$ مقابل للزاوية.'
                        : REMARKS.ladderCalc}</MathText>}
                onAnswered={mark(3)} />
              {q[3] && (
                <>
                  <KnowledgeBrick id="majhul-maqam" variant="rappel" lead="المجهول في المقام:" />
                  <p className="text-xs text-slate-600" data-misconception-note="darb"><MathText>{`خطأ شائع: ${REMARKS.darbWrong} ${REMARKS.darbWhy}`}</MathText></p>
                </>
              )}
            </div>
          ) },
        { num: 4, title: 'لماذا اختلف قياسا الكشّاف؟', subtitle: 'ارتفاع من مسافتين', done: !!q[4],
          content: (
            <div className="space-y-3">
              <LabEvidence id="beginner" trials={trials} filter={isHeight} title="قياساتك للكشّاف (المستوى المبتدئ):"
                empty="افتح المستوى المبتدئ: ضع الهاتف على خط التماس، سدّد إلى رأس الكشّاف واضغط زرّ القياس، ثم قِس من مسافة أخرى." />
              {/* La question écrit h = d × tan α et sa bonne option dit la règle : l'élève la prédit d'abord. */}
              <PredictRule id="zawiyat-nazar">
                <TapQuestion
                  prompt={<MathText>{'قاس عمر الكشّاف من $10\\,\\mathrm{m}$ فقرأ الهاتف $67^{\\circ}$ ، ثم من $30\\,\\mathrm{m}$ فقرأ $39^{\\circ}$ . بـ $h = d \\times \\tan\\alpha$ وجد $23{,}6\\,\\mathrm{m}$ ثم $24{,}3\\,\\mathrm{m}$ . لماذا يختلف الناتجان قليلا؟'}</MathText>}
                  options={[
                    'لأن الهاتف يقرأ الزاوية مدوّرة إلى الدرجة',
                    'لأن ارتفاع الكشّاف يتغيّر حسب مكان الهاتف',
                    'لأن $h = d \\times \\tan\\alpha$ لا تصلح إلا من مسافة $10\\,\\mathrm{m}$',
                    'لأن الجيب كان يجب أن يُستعمل بدل الظل',
                  ].map(M)}
                  correct={0} cols={1} requires={['ikhtiyar-nisba', 'majhul-maqam']}
                  explain={<MathText>{`${REMARKS.wobble} ${REMARKS.nisbaRight}`}</MathText>}
                  onAnswered={mark(4)} />
              </PredictRule>
              {q[4] && (
                <>
                  <KnowledgeBrick id="zawiyat-nazar" />
                  <p className="text-xs text-slate-600" data-misconception-note="nisba"><MathText>{`خطأ شائع: ${REMARKS.nisbaWrong} ${REMARKS.nisbaWhy}`}</MathText></p>
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
