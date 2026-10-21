import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_SIDE, METHOD_NOT_RIGHT } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « خاصية فيثاغورس » (3AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme, tirés de معارف 1,
 * de la طريقة p. 171 et du نشاط 2 du manuel ; rien n'est copié au mot).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'fitaghuras', type: 'regles', title: 'خاصية فيثاغورس',
        predictPrompt: 'لم يمتلئ الحوض الكبير تمامًا إلا عند زاوية واحدة، وكان الماء 9 + 16 = 25. اكتب بكلماتك ما الذي يساويه مربع الضلع المقابل لتلك الزاوية.',
        summary: 'في مثلث ABC قائم في A: مربع طول الوتر يساوي مجموع مربعي طولي الضلعين الآخرين، BC² = AB² + AC².',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.property.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.machine.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ghayr-qaim', type: 'regles', title: 'مثلث غير قائم',
        predictPrompt: 'عند زاوية حادة فاض الماء وعند زاوية منفرجة بقي فراغ. إذا لم يتساوَ مربع الضلع الثالث مع مجموع المربعين الآخرين، ماذا تقول عن الزاوية؟ اكتب ما تستنتجه.',
        summary: 'إذا كان مربع طول أطول أضلاع مثلث لا يساوي مجموع مربعي طولي الضلعين الآخرين فالمثلث غير قائم.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.notRight.text}</MathText></p></div>,
      },
      {
        id: 'hisab-watar', type: 'methodes', title: 'حساب الوتر',
        predictPrompt: 'مع 5 و 12 امتلأ الحوض عند 13. كيف تجد طول الوتر دون أن تجرّب على الشريط؟ اكتب خطواتك.',
        summary: 'نجمع مربعي طولي الضلعين القائمين فنحصل على مربع الوتر، ثم نأخذ العدد الذي مربعه هذا المجموع: 5² + 12² = 169 = 13².',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.computeSide.text}</MathText></p></div>,
      },
    ],
    2: [
      {
        id: 'watar', type: 'concepts', title: 'الوتر', predict: false,
        summary: 'الوتر هو الضلع المقابل للزاوية القائمة في مثلث قائم، وهو أطول أضلاعه؛ والمساواة لا تُكتب إلا في مثلث قائم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.hypotenuse.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.onlyRight.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'hisab-dil', type: 'methodes', title: 'حساب ضلع قائم',
        predictPrompt: 'عرفتَ الوتر (السلّم) وأحد الضلعين القائمين، ووجدتَ الضلع الآخر. كيف حسبتَه؟ اكتب العملية التي استعملتها على المربعات.',
        summary: 'مربع ضلع قائم هو الفرق بين مربع الوتر ومربع الضلع القائم الآخر: AB² = BC² − AC².',
        body: (
          <div className="space-y-2">
            {METHOD_SIDE.solution.slice(2, 4).map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{METHOD_SIDE.rule}</MathText></p>
          </div>
        ),
      },
      {
        id: 'lamsa-jidhr', type: 'methodes', title: 'اللمسة √', predict: false,
        summary: 'إذا كان مربع طول هو 20 فالطول المضبوط √20، واللمسة √ تعطي قيمة مقرّبة: √20 ≈ 4,47.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.root.text}</MathText></p></div>,
      },
      {
        id: 'ithbat-ghayr-qaim', type: 'methodes', title: 'أُثبت أنّ مثلثا غير قائم',
        predictPrompt: 'في المثلث KLM قارنتَ مربعًا بمجموع مربعين. أيّ ضلع اخترتَ أوّلًا، ولماذا؟ اكتب الطريقة بكلماتك.',
        summary: 'نعيّن أطول الأضلاع ونقارن مربع طوله بمجموع مربعي الضلعين الآخرين؛ إذا لم يتساويا فالمثلث غير قائم.',
        body: (
          <div className="space-y-2">
            {METHOD_NOT_RIGHT.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{METHOD_NOT_RIGHT.rule}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
