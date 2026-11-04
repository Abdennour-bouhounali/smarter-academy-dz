import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import InfoSorter from '../../../../../../common/components/InfoSorter';
import { TextbookBox, MethodSteps, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION } from '../content/textbook';

/**
 * Module 7 — تحليل الوضعية النهائية للاختبار (le « تحدّي » du manuel, p. 7 : les tabliers de la mairie).
 * Placé APRÈS les six وضعيات d'entraînement (modules 1 à 6) et juste avant le test : l'élève ne découvre
 * la situation sur laquelle il sera évalué qu'après s'être beaucoup entraîné. Lecture, tri des données, puis
 * les trois étapes d'analyse (قراءة ← استراتيجية ← تنفيذ) révélées une à une. Rien n'est résolu ici : la
 * résolution est le module 8 (évaluation). LP : P1.
 */
const analysisAsMethod = { exercise: SITUATION.text, source: SITUATION.analysisSource, solution: SITUATION.analysis.map((s) => `**${s.label}** : ${s.text}`) };
export default function Module07TahlilWadiya() {
  const [sorted, setSorted] = useState(false);
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} moduleTitle="تحليل الوضعية النهائية للاختبار" moduleSubtitle="المآزر المدرسية: كم مدرسة؟" estimatedTime="12 دقيقة"
      brief={{ tag: 'أدمج تعلّماتي — الكتاب ص 7 (تحدّ)', title: SITUATION.title, tone: 'amber', body: <p>{SITUATION.text}</p>, footer: <SourceTag source={SITUATION.source} /> }}
      steps={[
        { num: 1, title: 'ما المعطيات المفيدة؟', done: sorted,
          content: <div className="space-y-3"><p className="text-sm text-slate-700">اسحب كل معطى إلى «مفيد» أو «غير مفيد» للبحث عن العدد.</p><InfoSorter items={SITUATION.data} formative onSolved={() => setSorted(true)} /></div> },
        { num: 2, title: 'تحليل الوضعية — كما في الكتاب', done: read,
          content: <div className="space-y-3"><KnowledgeBrick id="pgcd-taarif" variant="rappel" compact /><MethodSteps method={analysisAsMethod} onAllRevealed={() => setRead(true)} /></div> },
        { num: 3, title: 'قبل الحلّ: كيف نقرأ شرط التوزيع؟', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khwarizmiyat-iqlidus" variant="rappel" compact />
              <TapQuestion prompt="«توزيع بالتساوي دون أن يبقى أيّ مئزر»: ماذا يعني هذا الشرط بالنسبة إلى عدد المدارس؟"
                options={['عدد المدارس يقسم عدد المآزر الورديّة ويقسم عدد المآزر الزرقاء', 'عدد المدارس مضاعف لعدد المآزر', 'عدد المدارس يساوي مجموع المآزر', 'عدد المدارس يساوي الفرق بين عدد المآزر']} correct={0} cols={1} requires={['pgcd-taarif', 'khwarizmiyat-iqlidus']}
                explain={<span>لا يبقى شيء ⇔ الباقي معدوم في كل قسمة: عدد المدارس <strong>قاسم</strong> للعددين معًا، أي قاسم مشترك لهما.</span>} onAnswered={() => setQ1(true)} />
              <TextbookBox kind="remark" text="الحلّ نفسه في «وضعية الاختبار النهائي»: هنا فهمنا واختطّينا الاستراتيجية فقط." compact />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={7} variant="memo" />} />
  );
}
