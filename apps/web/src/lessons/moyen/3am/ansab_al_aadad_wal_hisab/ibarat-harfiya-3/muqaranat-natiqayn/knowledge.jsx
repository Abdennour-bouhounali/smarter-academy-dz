import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_DIFF } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مقارنة عددين ناطقين » (3AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme, tirés de معارف 5 et de طريقة 5 du manuel ; rien n'est copié au mot).
 * La comparaison de deux fractions (`tasawi-muqaranat-kasrayn-3am`), la différence de deux fractions (`jam-tarh-kasrayn-3am`), l'ordre des relatifs (`muqarana-nisbiya-2am`) et la réduction d'une
 * expression (`tabsit-hadhf-aqwas-3am`) sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'ishara-farq', type: 'regles', title: 'جهة الإبرة تدلّ على الأكبر',
        predictPrompt: 'في الأزواج التي رأيتها على السكّة، أين وقفت الإبرة حين كان عدد المجسّ الأحمر هو الأكبر؟ اكتب ما لاحظته.',
        summary: 'الإبرة إلى اليمين حين يكون عدد المجسّ الأحمر الأكبر، وإلى اليسار حين يكون الأصغر، وعند الصفر حين يتساويان.',
        body: <p><MathText>{KNOWLEDGE.side.text}</MathText></p>,
      },
      {
        id: 'ibdal-mujassayn', type: 'regles', title: 'التبديل يغيّر الجهة لا الترتيب',
        predictPrompt: 'بدّلتَ المجسّين في الزوج الثاني فانتقلت الإبرة من اليسار إلى اليمين. هل تغيّر الترتيب بين الحبّتين؟ اكتب ما لاحظته.',
        summary: 'تبديل المجسّين يبدّل إشارة الفرق ولا يبدّل ترتيب العددين.',
        body: <p><MathText>{KNOWLEDGE.swap.text}</MathText></p>,
      },
      {
        id: 'farq-wahdahu', type: 'concepts', title: 'الفرق وحده يكفي',
        predictPrompt: 'الحبّتان 9/11 و 13/16 كانتا متراكبتين ومع ذلك حسمتِ الإبرة الترتيب. ماذا يعني ذلك لمعرفة الترتيب؟ اكتب ما لاحظته.',
        summary: 'لمعرفة ترتيب عددين تكفي إشارة فرقهما، ولو كانا قريبين جدًّا أو مجهولين.',
        body: <p><MathText>{KNOWLEDGE.alone.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'maana-farq', type: 'regles', title: 'معنى الترتيب بإشارة الفرق',
        predictPrompt: 'أجبتَ عن سؤالين حول فروق معطاة. اكتب بكلماتك العلاقة بين ترتيب عددين وإشارة فرقهما.',
        summary: '$a>b$ معناه $a-b>0$ ، و $a<b$ معناه $a-b<0$ ، و $a=b$ معناه $a-b=0$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.rule.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.example1.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-farq', type: 'methodes', title: 'احسب الفرق ثم اكتب الاستنتاج',
        predictPrompt: 'حسبتَ فرق عددين ثم حكمتَ على ترتيبهما. ما الخطوات التي اتّبعتَها؟ اكتب الطريقة بكلماتك.',
        summary: 'نحسب الفرق، نعيّن إشارته، ثم نكتب: بما أنّ $a-b>0$ فإنّ $a>b$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_DIFF.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.example2.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.pi.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'farq-ibaratayn', type: 'methodes', title: 'أبسّط A − B وأقرأ إشارته',
        predictPrompt: 'حرّكتَ x فعبرت الإبرة الصفر عند قيمة محدّدة. كيف تقارن عبارتين A و B لكل قيم x؟ اكتب طريقتك.',
        summary: 'نبسّط $A-B$ ثم نعيّن إشارته حسب قيم $x$ : موجب عند الجهة الأولى، ومعدوم عند القيمة الفاصلة، وسالب عند الجهة الأخرى.',
        body: <p><MathText>{KNOWLEDGE.expr.text}</MathText></p>,
      },
    ],
  },
};
