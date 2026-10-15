import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 10) : les deux définitions, les quatre formulations, les remarques (rétrofit 2026-10-15 : le labo en tête
 * SANS carte, SANS titre d'atelier ; chaque définition / brique APRÈS la question qui la nomme). L'exemple 143/11 est MANIPULÉ dans
 * le même rayon qu'on étire qu'au module 1. C'est un EXEMPLE TRAVAILLÉ : un seul niveau (`levels={false}`) et une découverte à lui :
 * 11 PUIS 13 vident le sol, donc le quotient aussi est un قاسم (`discovery="symmetry"`).
 * ORDRE : 1. ce que l'élève a vu à 11 → la définition par le reste ; 2. 13 vide aussi le sol → la définition par le produit et
 * l'exemple 120 = 6 × 20 ; 3. l'application à 120 ; 4. les quatre phrases (question d'abord, briques ensuite). LP : P2, P3, P4.
 */
const [defBaqi, defJidaa] = KNOWLEDGE.definitions;
const [remSiyagh, remWahid, remNafsuh] = KNOWLEDGE.remarks;

export default function Module02Maarif() {
  const [tried, setTried] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule objectives={["كيف نعرّف القاسم بطريقتين مختلفتين؟", "كيف أطبّق ذلك على 143 كتابًا؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — قواسم عدد طبيعي"
      moduleSubtitle="تعريفان لنفس الفكرة"
      estimatedTime="12 دقيقة"
      intro={
        // L'exemple du manuel (143 et 11) dans le MÊME laboratoire que le
        // module 1 : le rayon qu'on étire. Réglette de 5 à 30, repères 11 et 13.
        <Manipulation
          type="divisor-explorer-books"
          total={143}
          min={5}
          max={30}
          marks={[11, 13]}
          levels={false}
          discovery="symmetry"
          title="مثال الكتاب: 143 كتابًا"
          lead="143 كتابًا في رفوف متساوية. ضع الرفّ على 11 كتابًا ثم على 13: ماذا يحدث للأرض في المرّتين؟"
          onVerdict={({ b, quotient, remainder }) => setTried((t) => ({ ...t, [b]: { quotient, remainder } }))}
        />
      }
      steps={[
        {
          num: 1, title: 'ما الذي يجعل 11 قاسمًا للعدد 143؟', subtitle: 'من تجربتك على الرفّ', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {[11, 13].map((c) => (
                  <li key={c} className={tried[c] ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={c} data-tried={tried[c] ? 'true' : 'false'}>
                    {tried[c]
                      ? <MathText>{`${c} كتابًا في كل رفّ: $143 = ${c} \\times ${tried[c].quotient} + ${tried[c].remainder}$`}</MathText>
                      : `${c} كتابًا في كل رفّ: لم تجرّبه بعد على الرفّ أعلاه.`}
                  </li>
                ))}
              </ul>
              <TapQuestion
                prompt={<span>عند وضع الرفّ على 11 لم يبقَ كتاب على الأرض. ما الذي يجعل 11 قاسمًا للعدد 143؟</span>}
                options={['حاصل القسمة 13 عدد فردي', 'باقي القسمة الإقليدية لـ 143 على 11 معدوم', '143 أكبر من 11', '11 عدد أولي']}
                correct={1} cols={1} requires={['qasim-baqi']}
                explain={<span>التعريف كله في الباقي: <MathText>{'$143 = 11 \\times 13 + 0$'}</MathText>.</span>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && (
                <>
                  <TextbookBox kind="definition" text={defBaqi.text} source={KNOWLEDGE.source} />
                  <TextbookBox kind="example" text={defBaqi.example.text} compact />
                </>
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'وماذا عن 13؟', subtitle: 'التعريف الثاني: بالجداء', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>على الرفّ نفسه فرغت الأرض مع 11 كتابًا في كل رفّ ومع 13 أيضًا: <MathText>{'$143 = 11 \\times 13 = 13 \\times 11$'}</MathText>. ماذا نستنتج بالنسبة إلى العدد 13؟</span>}
                options={['13 قاسم للعدد 143 أيضًا', '13 ليس قاسمًا لأنه أكبر من 11', '13 مضاعف للعدد 143', 'لا نستنتج شيئًا عن 13']}
                correct={0} cols={1} requires={['qasim-baqi']}
                explain={<span>باقي قسمة 143 على 13 معدوم أيضًا: <MathText>{'$143 = 13 \\times 11 + 0$'}</MathText>.</span>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && (
                <>
                  <KnowledgeBrick id="qasim-jidaa" lead="نفس الفكرة بكتابة أخرى: باقٍ معدوم يعني أن a هو جداء b في عدد طبيعي." />
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
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
