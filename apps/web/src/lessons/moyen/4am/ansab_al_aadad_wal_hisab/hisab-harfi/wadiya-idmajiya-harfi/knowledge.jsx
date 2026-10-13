import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont
 * la DÉMARCHE de modélisation et les moments de choix d'une forme.
 *   namdhaja          module 7 — nommer l'inconnue, exprimer chaque longueur en fonction de x
 *   masaha-tariqatan  module 7 — l'aire du ruban de deux façons (« هناك طرق متعددة »)
 *   musaada-jadaa     module 7 — l'« مساعدة » du manuel : un produit dont un facteur est nul est nul
 *   tariqat-wadiya    module 7 — la démarche complète, posée APRÈS l'équation
 * La SOLUTION de la situation (x = 1) n'est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'namdhaja', type: 'methodes', title: 'نمذجة وضعية بدلالة x', summary: 'نسمّي المجهول x، ونعبّر عن كل طول بدلالته انطلاقًا من الشكل، ثم عن المساحة.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li>نسمّي المجهول <MathText>{'$x$'}</MathText> (هنا عرض الشريط).</li>
            <li>نقرأ الشكل: كل طول نعبّر عنه بدلالة <MathText>{'$x$'}</MathText> (ضلع المربع الخارجي مثلًا).</li>
            <li>نطبّق قاعدة المساحة على هذه الأطوال، ثم ننشر ونبسّط.</li>
          </ol>
        ) },
      { id: 'masaha-tariqatan', type: 'regles', title: 'مساحة الشريط: طرق متعددة', summary: 'مساحة الشريط هي مساحة المربع الخارجي ناقص مساحة الحوض، أو مجموع أربعة مستطيلات وأربعة أركان مربعة.',
        body: (
          <div className="space-y-1">
            <p><MathText>{REMARKS.twoWays}</MathText></p>
            <p><MathText>{'$(10 + 2x)^2 - 10^2$ أو $4 \\times 10x + 4 \\times x^2$'}</MathText> — والكتابتان لهما النشر المبسّط نفسه.</p>
          </div>
        ) },
      { id: 'musaada-jadaa', type: 'regles', title: 'مساعدة الكتاب: الشكل المحلّل',
        predictPrompt: 'وصلت إلى $x^2 + 10x - 11 = 0$ ، والكتاب يساعدك: $x^2 + 10x - 11 = (x - 1)(x + 11)$. كيف يساعدك هذا الشكل على إيجاد قيمة لـ $x$ تجعل العبارة تساوي 0؟ اكتب القاعدة التي تستعملها، وماذا تفعل بكل قيمة تجدها.',
        summary: 'إذا كان أحد عاملي جداء معدومًا فإنّ الجداء معدوم؛ نتحقق من كل قيمة بالتعويض.',
        body: (
          <div className="space-y-1">
            <p><MathText>{SITUATION.help}</MathText></p>
            <p><MathText>{REMARKS.help}</MathText></p>
            <p><MathText>{REMARKS.check}</MathText></p>
          </div>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من الشكل إلى المعادلة', summary: 'نقرأ الوضعية، نعبّر عن المقدار المطلوب بدلالة x، نكتب المساواة، نستعمل الشكل المحلّل، ثم نحتفظ بالقيمة المقبولة ونتحقق منها.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
            <li><MathText>{REMARKS.check}</MathText></li>
          </ol>
        ) },
    ],
  },
};
