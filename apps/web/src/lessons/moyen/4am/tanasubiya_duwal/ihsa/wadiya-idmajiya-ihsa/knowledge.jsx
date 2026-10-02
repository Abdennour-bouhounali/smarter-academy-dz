import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du manuel
 * (قراءة → تحليل واختيار استراتيجية → تنفيذ) appliquée aux médailles d'or, et les outils que « أتعمّق »
 * mobilise.
 *   qiraat-jadwal            module 1 — valeur / effectif / effectif total d'un tableau
 *   qima-makhfiya-wasit      module 1 — une valeur cachée qui contient les rangs de la médiane = la médiane
 *   qima-makhfiya-mutawassit module 1 — moyenne × N = Σ valeur × effectif : une équation en la valeur cachée
 *   kull-min-nisba           module 1 — le tout à partir d'un pourcentage (« أخذ نسبة من عدد » à l'envers)
 *   tariqat-wadiya           module 1 — la démarche en trois phases (les mots du manuel)
 *   takrar-majhul            module 3 — des effectifs inconnus : l'effectif total, puis la médiane (ex. 20)
 *   tajnid-mawarid           module 3 — quel indicateur pour quelle question
 * Les réponses de « إختبار أولي » (une autre compétition) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qiraat-jadwal', type: 'methodes', title: 'قراءة جدول التكرارات', summary: 'كل قيمة في السطر الأول عدد ميداليات، وتكرارها عدد الدول التي فازت به؛ والتكرار الكلي مجموع التكرارات.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.jadwal}</MathText></li>
            <li><MathText>{REMARKS.takrarKulli}</MathText></li>
          </ul>
        ) },
      { id: 'qima-makhfiya-wasit', type: 'methodes', title: 'قيمة مخفية يكشفها الوسيط', summary: 'نحدّد رتبتي الوسيط ونجمع التكرارات من البداية؛ إذا وقعت الرتبتان في عمود القيمة المخفية فهي تساوي الوسيط.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.rutab}</MathText></li>
            <li><MathText>{REMARKS.mujamma}</MathText></li>
            <li><MathText>{REMARKS.wasitX}</MathText></li>
          </ul>
        ) },
      { id: 'qima-makhfiya-mutawassit', type: 'methodes', title: 'قيمة مخفية يكشفها المتوسط', summary: 'المتوسط مضروبا في التكرار الكلي يساوي مجموع جداءات القيم في تكراراتها، فنكتب معادلة مجهولها القيمة المخفية ونحلّها.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.maloum}</MathText></li>
            <li><MathText>{REMARKS.muadala}</MathText></li>
            <li><MathText>{REMARKS.halY}</MathText></li>
            <li><MathText>{REMARKS.tahqiq}</MathText></li>
          </ul>
        ) },
      { id: 'kull-min-nisba', type: 'methodes', title: 'الكل من نسبة جزء', summary: 'إذا كانت نسبة مئوية من عدد مجهول تساوي عددا معلوما، نكتب المعادلة ونقسم المعلوم على النسبة، ثم ندوّر إلى الوحدة لأنّ الدول تُعدّ.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.nisbaEq}</MathText></li>
            <li><MathText>{REMARKS.nisbaT}</MathText></li>
            <li><MathText>{REMARKS.nisbaFaqat}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونرتّب المعطيات، نختار المؤشر المناسب لكل مطلوب، ثم ننفّذ ونحرّر الحل بجمل واضحة.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: {analysisText(a)}</li>)}
          </ol>
        ) },
    ],
    3: [
      { id: 'takrar-majhul', type: 'methodes', title: 'تكراران مجهولان', summary: 'التكرار الكلي يعطي مجموع التكرارين المجهولين، ثم تحدّد رتبتا الوسيط أيّ توزيع هو الصحيح.',
        body: <p><MathText>{REMARKS.majhul}</MathText></p> },
      { id: 'tajnid-mawarid', type: 'regles', title: 'أيّ مؤشر لأيّ سؤال؟', summary: 'على الأكثر وعلى الأقل تكرار مجمع، التشتت مدى، النصف وسيط، والمجموع متوسط.',
        body: <p><MathText>{REMARKS.tajnid}</MathText></p> },
    ],
  },
};
