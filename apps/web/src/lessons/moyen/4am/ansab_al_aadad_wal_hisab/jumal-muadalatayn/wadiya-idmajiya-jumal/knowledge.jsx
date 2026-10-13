import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, WARMUP } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont
 * la DÉMARCHE du manuel (قراءة → ترييض → حل → تحقق).
 *   tahdid-majahil     module 7 — choisir les inconnues : les quantités DEMANDÉES (les deux prix)
 *   tarjamat-maalumat  module 7 — une information (une somme d'argent) → une équation
 *   ikhtiyar-tariqa    module 7 — simplifier, puis la méthode la plus efficace (التعويض / الجمع)
 *   tahaqquq-tafsir    module 7 — vérifier dans le TEXTE et rédiger la réponse avec son unité
 *   tariqat-wadiya     module 7 — la démarche complète en trois étapes (les mots du manuel)
 * Les exemples chiffrés sont ceux de la رحلة القسم (niveau مبتدئ) ; la SOLUTION du حفل
 * (25 DA et 50 DA) n'est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'tahdid-majahil', type: 'methodes', title: 'اختيار المجهولين', summary: 'نسمّي x و y الكميتين المطلوبتين في السؤال، هنا السعرين، لا الأعداد المعلومة في النص.',
        body: (
          <div className="space-y-1">
            <p>نقرأ السؤال أولا: ما الذي نجهله ونبحث عنه؟ تلك هي المجاهيل.</p>
            <p><MathText>{REMARKS.majahil}</MathText></p>
          </div>
        ) },
      { id: 'tarjamat-maalumat', type: 'methodes', title: 'من معلومة إلى معادلة', summary: 'كل معلومة عن مبلغ تعطي معادلة: عدد كل شيء في سعره، والمجموع يساوي المبلغ المذكور.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li>نأخذ كل معلومة من النص على حدة: هنا معلومتان، كلتاهما عن مبلغ مدفوع.</li>
            <li>كل عدد يُضرب في سعر الشيء الذي يعدّه، ثم نجمع ونساوي بالمبلغ.</li>
            <li><MathText>{REMARKS.tarjamaRight}</MathText></li>
            <li>المعلومتان معا تعطيان جملة معادلتين: <MathText>{WARMUP.system}</MathText></li>
          </ol>
        ) },
      { id: 'ikhtiyar-tariqa', type: 'methodes', title: 'اختيار طريقة الحل الأنجع', summary: 'نبسّط المعادلة إن أمكن، ثم نعوّض إذا كان معامل أحد المجهولين 1، ونجمع إذا كان المعاملان متعاكسين أو يصيران كذلك.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.tabsit}</MathText></li>
            <li><MathText>{REMARKS.tariqa}</MathText></li>
          </ul>
        ) },
      { id: 'tahaqquq-tafsir', type: 'methodes', title: 'التحقق وتحرير الجواب', summary: 'نجد المجهولين معا، نتحقق من الثنائية في نص الوضعية نفسه، ثم نكتب الجواب بجملة وبوحدته.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.nisfRight}</MathText></li>
            <li><MathText>{REMARKS.tahaqquq}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدد المعطيات والمطلوب، نختار المجهولين ونكتب الجملة، نحلها بطريقة مناسبة ثم نتحقق ونجيب.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: {a.text}</li>)}
          </ol>
        ) },
    ],
  },
};
