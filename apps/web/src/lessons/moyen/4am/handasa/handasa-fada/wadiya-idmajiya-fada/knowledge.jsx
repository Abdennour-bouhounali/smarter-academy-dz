import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE (قراءة → تحليل واختيار استراتيجية →
 * تنفيذ) appliquée à la وضعية du seau, et l'outil que « أتعمّق » mobilise.
 *   mukhrut-mukammal  module 1 — compléter le cône : Thalès dans la coupe axiale donne le sommet S et le rayon de la surface
 *   hajm-mabtur       module 1 — le petit cône est une réduction (k) du grand : V = V₁ − V₂ = V₁(1 − k³)
 *   tariqat-wadiya-fada module 1 — la démarche en trois phases, puis l'arrondi et le litre
 *   adawat-wahda-fada module 3 — les outils de l'unité combinés (boule, cône, réduction : k³ ⇒ k)
 * Les réponses de « إختبار أولي » (le verre de frappé d'Oran) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'mukhrut-mukammal', type: 'methodes', title: 'نكمل المخروط', summary: 'الدلو مخروط مبتور: نمدّد جداريه حتى يلتقيا على المحور في رأس المخروط، ثم نطبّق خاصية طالس في المقطع المحوري لنجد بعد الرأس عن القاع ونصف قطر سطح الماء.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.shakl}</MathText></li>
            <li><MathText>{REMARKS.takmil}</MathText></li>
            <li><MathText>{REMARKS.talisRho}</MathText></li>
          </ul>
        ) },
      { id: 'hajm-mabtur', type: 'regles', title: 'حجم المخروط المبتور', summary: 'حجم مخروط مبتور هو حجم المخروط الكبير ناقص حجم المخروط الصغير؛ والصغير تصغير للكبير نسبته k، فحجمه k مكعّب مرة حجم الكبير.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.k}</MathText></li>
            <li><MathText>{REMARKS.k3}</MathText></li>
            <li><MathText>{REMARKS.hajm}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya-fada', type: 'methodes', title: 'طريقة: من النص إلى الحجم', summary: 'نقرأ الشكل (الأبعاد ومستوى الماء)، نحلّل (شكل الماء، المخروط المكتمل، نسبة التصغير)، ثم ننفّذ الحساب وندوّر في آخره ونحوّل إلى اللتر ونتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{analysisText(a)}</MathText></li>)}
            <li><MathText>{REMARKS.tadwir}</MathText></li>
          </ol>
        ) },
    ],
    3: [
      { id: 'adawat-wahda-fada', type: 'methodes', title: 'أدوات الوحدة في وضعية مركبة', summary: 'نجمع حجم الجلة وحجم المخروط، ومخروطا له نفس رأس مخروط آخر ونفس محوره هو تصغير له: من نسبة الحجمين k مكعّب نجد نسبة الأطوال k.',
        body: <p><MathText>{REMARKS.adawat}</MathText></p> },
    ],
  },
};
