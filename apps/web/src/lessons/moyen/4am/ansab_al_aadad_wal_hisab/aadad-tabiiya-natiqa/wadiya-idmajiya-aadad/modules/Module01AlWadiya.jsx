import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import InfoSorter from '../../../../../../common/components/InfoSorter';
import { TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION } from '../content/textbook';

/**
 * Module 1 — la وضعية (p. 16) : lecture, tri des données, puis les trois
 * étapes du « تحليل الوضعية » du manuel révélées une à une. Rien n'est
 * résolu ici : la résolution est le module 3 (évaluation). LP : P1.
 */
const analysisAsMethod = { exercise: SITUATION.text, source: SITUATION.source, solution: SITUATION.analysis.map((s) => `**${s.label}** : ${s.text}`) };
export default function Module01AlWadiya() {
  const [sorted, setSorted] = useState(false);
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="الوضعية وتحليلها" moduleSubtitle="قصر الرياس: كم قطعة خزفية؟" estimatedTime="12 دقيقة"
      brief={{ tag: 'أدمج تعلّماتي — الكتاب ص 16', title: SITUATION.title, tone: 'amber', body: <div className="space-y-1"><p>{SITUATION.text}</p><p className="text-rose-700 font-semibold">{SITUATION.hint}</p><p className="text-xs text-slate-500">صورة الكتاب: {SITUATION.imageCaption}</p></div> }}
      steps={[
        { num: 1, title: 'ما المعطيات المفيدة؟', done: sorted,
          content: <div className="space-y-3"><p className="text-sm text-slate-700">اسحب كل معطى إلى «مفيد» أو «غير مفيد» للبحث عن العدد.</p><InfoSorter items={SITUATION.data} formative onSolved={() => setSorted(true)} /></div> },
        { num: 2, title: 'تحليل الوضعية — كما في الكتاب', done: read,
          content: <div className="space-y-3"><KnowledgeBrick id="qabiliyat-10" variant="rappel" compact /><MethodSteps method={analysisAsMethod} onAllRevealed={() => setRead(true)} /></div> },
        { num: 3, title: 'قبل الحلّ: ما نوع العدد المطلوب؟', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tarmiz-bi-huruf" variant="rappel" compact />
              <TapQuestion prompt={<span>العدد المطلوب مكتوب <MathText>{'$1000a + 100b + 10c + d$'}</MathText>. ماذا تقول المعطيات عن أرقامه؟</span>}
                options={['d = 0 (مضاعف لـ 10)، و b = c = 2a', 'a = 0 و b = c', 'd = 5 و b = c', 'a = b = c = d']} correct={0} cols={1} requires={['tarmiz-bi-huruf', 'qabiliyat-10']}
                explain={<span>«رقما العشرات والمئات متساويان ويساويان ضعف رقم الآلاف»: b = c = 2a؛ و«مضاعف لـ 10»: d = 0.</span>} onAnswered={() => setQ1(true)} />
              <TextbookBox kind="remark" text="الحلّ نفسه في «أحلّ الوضعية»: هنا فهمنا واختطّينا الاستراتيجية فقط." compact />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
