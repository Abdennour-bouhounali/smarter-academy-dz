import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import InfoSorter from '../../../../../../common/components/InfoSorter';
import { TextbookBox, MethodSteps, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION, REMARKS } from '../content/textbook';
import CarpetScene from '../components/CarpetScene';

/**
 * Module 1 — la وضعية (p. 28) : lecture, tri des données (utiles / parasites),
 * les trois étapes du « تحليل الوضعية » du manuel révélées une à une (la
 * deuxième CORRIGÉE : la donnée parasite est le prix), puis trois décisions
 * de l'élève — l'aire en fonction de ℓ, la solution à garder, le moment
 * d'arrondir. Rien n'est calculé ici : la résolution est le module 3
 * (évaluation). LP : P1.
 */
const analysisAsMethod = { exercise: SITUATION.text, source: SITUATION.source, solution: SITUATION.analysis.map((s) => `**${s.label}** : ${s.text}`) };
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01AlWadiya() {
  const [sorted, setSorted] = useState(false);
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="الوضعية وتحليلها" moduleSubtitle="زربية وادي سوف: ما طولها وما عرضها؟" estimatedTime="12 دقيقة"
      brief={{
        tag: 'أدمج تعلّماتي — الكتاب ص 28', headline: 'هيا نساعد الأم!', emoji: '🧶', visual: <CarpetScene />,
        title: 'ما طول الزربية وما عرضها؟', tone: 'amber',
        body: <div className="space-y-1"><p><MathText>{SITUATION.text}</MathText></p><p className="text-xs text-slate-500">صورة الكتاب: {SITUATION.caption}</p></div>,
        footer: <SourceTag source={SITUATION.source} />,
      }}
      steps={[
        { num: 1, title: 'ما المعطيات المفيدة؟', done: sorted,
          content: <div className="space-y-3"><p className="text-sm text-slate-700">اسحب كل معطى إلى «مفيد» أو «غير مفيد» لإيجاد بُعدي الزربية.</p><InfoSorter items={SITUATION.data} formative onSolved={() => setSorted(true)} /></div> },
        { num: 2, title: 'تحليل الوضعية — كما في الكتاب', done: read,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="masahat-mustatil" variant="rappel" compact />
              <MethodSteps method={analysisAsMethod} onAllRevealed={() => setRead(true)} />
              <p className="text-xs text-slate-500">{SITUATION.correctionNote}</p>
            </div>
          ) },
        { num: 3, title: 'المساحة بدلالة العرض', done: q1,
          content: (
            <TapQuestion
              prompt={<span>ليكن <MathText>{'$\\ell$'}</MathText> عرض الزربية و <MathText>{'$L = 2\\ell$'}</MathText> طولها. أيّ معادلة تترجم مساحة الزربية؟</span>}
              options={['$2\\ell^2 = 24$', '$3\\ell = 24$', '$4\\ell^2 = 24$', '$2\\ell^2 = 12000$'].map(M)}
              correct={0} cols={2} requires={['masahat-mustatil']}
              explain={<span><MathText>{REMARKS.masaha}</MathText> <MathText>{'$3\\ell = L + \\ell$'}</MathText> مجموع لا جداء، و <MathText>{'$4\\ell^2 = 2\\ell \\times 2\\ell$'}</MathText> مساحة مربع ضلعه الطول. {REMARKS.sirWhy}</span>}
              onAnswered={() => setQ1(true)} />
          ) },
        { num: 4, title: 'أيّ حل نختار؟', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tadhkir-x2-a" variant="rappel" compact />
              <TapQuestion
                prompt={<span>بعد القسمة على 2، تصبح المعادلة من الشكل <MathText>{'$\\ell^2 = a$'}</MathText> حيث <MathText>{'$a > 0$'}</MathText>. أيّ قيمة نأخذ للعرض <MathText>{'$\\ell$'}</MathText>؟</span>}
                options={['الحل الموجب وحده، لأنّ العرض طول', 'الحلّين معًا: للزربية عرضان', 'الحل السالب، لأنّه الأصغر', 'لا شيء: المعادلة لا تقبل أي حل لأنّ العدد ليس مربعًا تامًا']}
                correct={0} cols={1} requires={['tadhkir-x2-a', 'jidhr-taarif']}
                explain={<span>{REMARKS.mujab} وعدد موجب ليس مربعًا تامًا له جذر تربيعي أيضًا، لكنه عدد غير ناطق (الدرس 2).</span>}
                onAnswered={() => setQ2(true)} />
            </div>
          ) },
        { num: 5, title: 'متى ندوّر إلى 1cm؟', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="الوضعية تطلب تدوير النتائج إلى 1cm. متى ندوّر؟"
                options={[REMARKS.tadwirRight, REMARKS.tadwirWrong, 'لا ندوّر: ما تعرضه الحاسبة هو القيمة المضبوطة للعرض.', 'ندوّر المساحة إلى أقرب مربع تام قبل حلّ المعادلة.']}
                correct={0} cols={1} requires={['jidhr-taarif']}
                explain={<span>{REMARKS.tadwirWhy} والحاسبة تعرض قيمة مقرّبة فقط، وتغيير المساحة يغيّر الزربية نفسها.</span>}
                onAnswered={() => setQ3(true)} />
              {q3 && (
                <>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la démarche ne fait que remettre en ordre ce que les
                      trois questions ci-dessus viennent d’établir (leurs explications) et la طريقة a√b du درس 5. */}
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
