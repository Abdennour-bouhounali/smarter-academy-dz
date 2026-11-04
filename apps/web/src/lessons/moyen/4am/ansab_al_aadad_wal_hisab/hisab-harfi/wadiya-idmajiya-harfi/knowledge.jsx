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
/** `memo` — la FICHE DE MÉMOIRE (MemoCard) : ce qui CHANGE est en rouge (`R`). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'namdhaja', type: 'methodes', title: 'نمذجة وضعية بدلالة x', summary: 'نسمّي المجهول x، ونعبّر عن كل طول بدلالته انطلاقًا من الشكل، ثم عن المساحة.',
      memo: {
        rule: `\\ell=a+${R('2x')}`,
        hook: 'سمِّ المجهول ثم عبّر بدلالته',
        example: `\\ell=10+${R('2x')}`,
        trap: 'نسيان أنّ الشريط على جهتين فيُضاف مرّتين',
        exam: 'أكتب ليكن المجهول ثم أعبّر عن كل طول بدلالته',
        chip: `x\\to 10+2x`,
        quiz: [
          { q: 'حوض ضلعه $10$ يحيط به شريط عرضه $x$. ضلع المربع الخارجي:', options: ['$10+x$', '$10+2x$', '$10x$'], correct: 1 },
          { q: 'عند $x=3$ ضلع المربع الخارجي يساوي:', options: ['$13$', '$30$', '$16$'], correct: 2 },
        ],
      },
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li>نسمّي المجهول <MathText>{'$x$'}</MathText> (هنا عرض الشريط).</li>
            <li>نقرأ الشكل: كل طول نعبّر عنه بدلالة <MathText>{'$x$'}</MathText> (ضلع المربع الخارجي مثلًا).</li>
            <li>نطبّق قاعدة المساحة على هذه الأطوال، ثم ننشر ونبسّط.</li>
          </ol>
        ) },
      { id: 'masaha-tariqatan', type: 'regles', title: 'مساحة الشريط: طرق متعددة', summary: 'مساحة الشريط هي مساحة المربع الخارجي ناقص مساحة الحوض، أو مجموع أربعة مستطيلات وأربعة أركان مربعة.',
      memo: {
        rule: `S=(a+2x)^2-${R('a^2')}`,
        hook: 'المربع الكبير ناقص الحوض',
        example: `S=(10+2x)^2-${R('100')}=40x+4x^2`,
        trap: 'نسيان طرح مساحة الحوض',
        exam: 'أحسب المساحة بطريقتين وأتأكد أنّهما تعطيان النشر نفسه',
        chip: `(10+2x)^2-10^2`,
        quiz: [
          { q: 'عند $x=1$ مساحة الشريط:', options: ['$144$', '$44$', '$4$'], correct: 1 },
          { q: 'عند $x=2$ مساحة الشريط:', options: ['$80$', '$196$', '$96$'], correct: 2 },
        ],
      },
        body: (
          <div className="space-y-1">
            <p><MathText>{REMARKS.twoWays}</MathText></p>
            <p><MathText>{'$(10 + 2x)^2 - 10^2$ أو $4 \\times 10x + 4 \\times x^2$'}</MathText> — والكتابتان لهما النشر المبسّط نفسه.</p>
          </div>
        ) },
      { id: 'musaada-jadaa', type: 'regles', title: 'مساعدة الكتاب: الشكل المحلّل',
      memo: {
        rule: `\\begin{array}{c}AB=0\\iff\\\\A=${R('0')}\\lor B=${R('0')}\\end{array}`,
        hook: 'جداء معدوم: عامل معدوم',
        example: `(x-1)(x+11)=0\\Rightarrow x=${R('1')}`,
        trap: 'إهمال التحقّق من كل قيمة في الوضعية',
        exam: 'أحلّ كلًّا من العاملين ثم أتحقّق من كل قيمة بالتعويض',
        chip: `A\\times B=0`,
        quiz: [
          { q: 'حلّ $(x-1)(x+11)=0$:', options: ['$x=1$ أو $x=11$', '$x=1$ أو $x=-11$', '$x=-1$ أو $x=11$'], correct: 1 },
          { q: 'إذا كان $A\\times B=0$ فإنّ:', options: ['$A+B=0$', '$A=0$ و $B=0$ معًا', '$A=0$ أو $B=0$'], correct: 2 },
        ],
      },
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
      memo: {
        rule: `\\begin{aligned}4x^2+40x&=44\\\\x^2+10x-11&=${R('0')}\\end{aligned}`,
        hook: 'عبّر، ساوِ، حلّل، تحقّق',
        example: `(x-1)(x+11)=0\\to x=${R('1')}`,
        trap: 'قبول قيمة سالبة لعرض الشريط',
        exam: 'أعبّر عن المقدار ثم أكتب المساواة وأحلّلها وأحتفظ بالقيمة المقبولة',
        chip: `S(x)=44`,
        quiz: [
          { q: 'نقسم $4x^2+40x=44$ على $4$ فنحصل على:', options: ['$x^2+10x=44$', '$x^2+10x=11$', '$x^2+40x=11$'], correct: 1 },
          { q: 'بعد حلّ $(x-1)(x+11)=0$ القيمة المقبولة لعرض الشريط:', options: ['$x=-11$', '$x=0$', '$x=1$'], correct: 2 },
        ],
      },
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
            <li><MathText>{REMARKS.check}</MathText></li>
          </ol>
        ) },
    ],
  },
};
