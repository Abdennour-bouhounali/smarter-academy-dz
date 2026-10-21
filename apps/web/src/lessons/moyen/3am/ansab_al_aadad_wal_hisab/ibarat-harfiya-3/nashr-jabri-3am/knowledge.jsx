import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_EXPAND, METHOD_DOUBLE } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « نشر عبارات جبرية » (3AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme, tirés de
 * معارف 3 et de طرائق 2–3 du manuel ; rien n'est copié au mot).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'masaha-tariqatayn', type: 'concepts', title: 'مساحة بطريقتين',
        predictPrompt: 'قطعتَ الأرض إلى أجزاء وحسبتَ مساحة كل جزء فتساوى العدّادان دائمًا مهما غيّرتَ $x$. ماذا تستنتج عن مساحة الأرض؟ اكتب ما لاحظته.',
        summary: 'مساحة المستطيل جداء بعديه، وهي أيضًا مجموع مساحات أجزائه: العبارتان متساويتان من أجل كل قيمة لـ x.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.areaTwoWays.text}</MathText></p></div>,
      },
      {
        id: 'hadd-matruh', type: 'regles', title: 'الممرّ يُطرح',
        predictPrompt: 'اقتطعتَ من الأرض ممرًّا مبلّطًا فقبلت الطاولة أن تُطرح مساحته. كيف تكتب مساحة ما بقي بدلالة مساحة الأرض كلها؟ اكتب ما فعلتَه.',
        summary: 'مساحة ما بقي بعد اقتطاع ممرّ هي مساحة الأرض كلها ناقص مساحة الممرّ: $k(x-3)=kx-3k$.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.bite.text}</MathText></p></div>,
      },
      {
        id: 'rukn-yuad', type: 'regles', title: 'ركن الممرّين يُردّ',
        predictPrompt: 'اقتطعتَ ممرّين متقاطعين فصارت قطعة الركن تُضاف. لماذا كانت إشارتها موجبة؟ اكتب ما لاحظته.',
        summary: 'ركن الممرّين المتقاطعين يُطرح مرّتين فنردّه مرّة: جداء عددين سالبين موجب.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.corner.text}</MathText></p></div>,
      },
    ],
    2: [
      {
        id: 'tawzi-darb', type: 'regles', title: 'نشر k(a + b)',
        predictPrompt: 'ضربتَ عددًا في مجموع حدّين وكتبتَ الناتج مجموعًا. ماذا فعلتَ بالعدد؟ اكتب ما فعلتَه.',
        summary: 'الضرب يتوزّع على الجمع والطرح: k(a + b) = ka + kb و k(a − b) = ka − kb.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.distribute1.text}</MathText></p></div>,
      },
      {
        id: 'jidaa-qawsayn', type: 'regles', title: 'نشر (a + b)(c + d)',
        predictPrompt: 'نشرتَ جداء مجموعين بأسهم من كل حدّ إلى كل حدّ. كم جداءً حصلتَ عليه ولماذا؟ اكتب ما لاحظته.',
        summary: 'كل حدّ من القوس الأول يضرب كل حدّ من الثاني ثم نجمع الجداءات: (a + b)(c + d) = ac + ad + bc + bd.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.distribute2.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.signs.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'aqwas-tawzi', type: 'concepts', title: 'حذف الأقواس هو النشر', predict: false,
        summary: 'قاعدة حذف الأقواس المسبوقة بـ + أو − هي توزيع العامل +1 أو −1 على كل حدّ.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.bridge.text}</MathText></p></div>,
      },
    ],
    3: [
      {
        id: 'ishara-jidaa', type: 'regles', title: 'إشارة كل جداء',
        predictPrompt: 'رسمتَ سهمًا إلى حدّ سالب فاختلفت إشارة الجداء. كيف تعرف إشارة كل جداء؟ اكتب ما لاحظته.',
        summary: 'نكتب كل جداء مع إشارته: موجب في موجب أو سالب في سالب موجب، ومختلفا الإشارة سالب.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.signs.text}</MathText></p></div>,
      },
      {
        id: 'tariqat-nashr', type: 'methodes', title: 'أنشر وأبسّط وأرتّب',
        predictPrompt: 'نشرتَ ثم جمعتَ المتشابهة ثم راقبتَ بقيمة. ما الخطوات التي اتّبعتَها بالترتيب؟ اكتبها بكلماتك.',
        summary: 'ننشر كل جداء، ثم نجمع الحدود المتشابهة، ثم نرتّب حسب قوى x تنازليًا، ونراقب بقيمة.',
        body: (
          <div className="space-y-2">
            {METHOD_EXPAND.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.order.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_DOUBLE.rule}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
