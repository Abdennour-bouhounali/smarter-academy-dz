import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { RESULTS } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** Ce qui CHANGE dans une règle de la fiche `memo` (rouge). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'tayin-bil-hasr', type: 'methodes', title: 'تعيين PGCD بحصر القواسم',
        memo: {
          rule: `D_a\\ \\to\\ D_a\\cap D_b\\ \\to\\ ${R('\\max')}`,
          hook: 'قواسم، مشتركة، أكبرها',
          example: `\\mathrm{PGCD}(42\\ ;\\ 60)=${R('6')}`,
          trap: 'التوقف عند أوّل قاسم مشترك: 2 مشترك لكنه ليس الأكبر',
          exam: 'أكتب قواسم العددين، ثم القواسم المشتركة، ثم أحدّد أكبرها',
          chip: `D_a\\cap D_b\\to${R('\\max')}`,
          quiz: [
            { q: 'قواسم $8$ هي $1 , 2 , 4 , 8$ وقواسم $12$ هي $1 , 2 , 3 , 4 , 6 , 12$. إذن $\\mathrm{PGCD}(8\\ ;\\ 12)$ هو:', options: ['$2$', '$8$', '$4$'], correct: 2 },
            { q: 'القواسم المشتركة للعددين $42$ و $60$ هي $1 , 2 , 3 , 6$. فإنّ $\\mathrm{PGCD}(42\\ ;\\ 60)$ هو:', options: ['$6$', '$3$', '$60$'], correct: 0 },
          ],
        },
        predictPrompt: 'في المناولة وصلتَ إلى القاسم المشترك الأكبر للعددين 42 و 60. لو أعطيناك عددين آخرين (مثلًا 36 و 48)، بأيّ خطوة تبدأ؟ وماذا تفعل بعدها حتى تصل إليه؟ اكتب الطريقة خطوة بخطوة.',
        summary: 'قواسم كل عدد ← القواسم المشتركة ← أكبرها.',
        body: <div className="space-y-1"><p>1) أوجد قواسم كلٍّ من العددين. 2) أوجد القواسم المشتركة. 3) أكبرها هو القاسم المشترك الأكبر.</p><p className="text-sm text-slate-600">مثال الكتاب: 42 و 60 → القواسم المشتركة 1 ، 2 ، 3 ، 6 → <MathText>{'$\\mathrm{PGCD}(42\\ ;\\ 60) = 6$'}</MathText>.</p></div> },
    ],
    2: [
      { id: 'nataij-mubashira', type: 'regles', title: 'نتائج مباشرة',
        memo: {
          rule: `\\mathrm{PGCD}(a\\ ;\\ a)=${R('a')}\\quad\\mathrm{PGCD}(a\\ ;\\ 0)=${R('a')}`,
          hook: 'عدد مع نفسه أو مع الصفر',
          example: `\\mathrm{PGCD}(42\\ ;\\ 0)=${R('42')}`,
          trap: 'ظنّ أنّ القاسم المشترك الأكبر مع الصفر هو الصفر',
          exam: 'أعلّل: كل عدد يقسم الصفر، فالأكبر هو العدد نفسه',
          chip: `\\mathrm{PGCD}(a\\ ;\\ 0)=${R('a')}`,
          quiz: [
            { q: '$\\mathrm{PGCD}(17\\ ;\\ 17)$ يساوي:', options: ['$34$', '$17$', '$1$'], correct: 1 },
            { q: '$\\mathrm{PGCD}(25\\ ;\\ 0)$ يساوي:', options: ['$25$', '$0$', '$1$'], correct: 0 },
          ],
        },
        predictPrompt: 'في النشاط وجدتَ $\\mathrm{PGCD}(42\\ ;\\ 60) = 6$ بحصر القواسم. دون أيّ قائمة، ما القاسم المشترك الأكبر لكلّ من: 42 و 42؟ 42 و 0 (تذكّر أنّ $0 = 42 \\times 0$)؟ 42 و 6؟ وهل يتغيّر إذا بدّلنا ترتيب العددين؟ اكتب ما تستنتجه بالحرفين $a$ و $b$.',
        summary: 'PGCD(a ; a) = a · PGCD(a ; 0) = a · PGCD(a ; b) = PGCD(b ; a).',
        body: <div className="space-y-1"><p><MathText>{RESULTS.intro}</MathText></p><ul className="list-disc ms-5">{RESULTS.items.map((it) => <li key={it}><MathText>{it}</MathText></li>)}</ul></div> },
      { id: 'pgcd-idha-qasim', type: 'regles', title: 'إذا كان b قاسمًا لـ a', summary: 'PGCD(a ; b) = b — مثال: PGCD(40 ; 8) = 8.',
        memo: {
          rule: `b\\mid a\\ \\Rightarrow\\ \\mathrm{PGCD}(a\\ ;\\ b)=${R('b')}`,
          hook: 'القاسم نفسه هو الأكبر',
          example: `8\\mid40\\ \\Rightarrow\\ \\mathrm{PGCD}(40\\ ;\\ 8)=${R('8')}`,
          trap: 'أخذ العدد الكبير مع أنّه لا يقسم العدد الصغير',
          exam: 'أتحقّق أوّلًا هل يقسم أحد العددين الآخر، فأكتب الأصغر مباشرة',
          chip: `b\\mid a\\Rightarrow${R('b')}`,
          quiz: [
            { q: '$\\mathrm{PGCD}(40\\ ;\\ 8)$ يساوي:', options: ['$40$', '$5$', '$8$'], correct: 2 },
            { q: '$7$ يقسم $91$ و $91 = 7 \\times 13$. إذن $\\mathrm{PGCD}(91\\ ;\\ 7)$ هو:', options: ['$7$', '$13$', '$91$'], correct: 0 },
          ],
        },
        body: <p>إذا كان <MathText>{'$b$'}</MathText> قاسما للعدد <MathText>{'$a$'}</MathText> فإن <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b) = b$'}</MathText>: لا قاسم مشترك أكبر من b نفسه.</p> },
    ],
  },
};
