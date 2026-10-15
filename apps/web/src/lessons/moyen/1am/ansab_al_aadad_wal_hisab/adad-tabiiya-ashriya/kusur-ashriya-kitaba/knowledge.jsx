import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_CONVERT, METHOD_SHIFT, GUIDE } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الكسور العشرية والكتابة العشرية » (1AM) — SOURCE UNIQUE (content/textbook.js : les mots de la
 * plateforme, tirés de معارف 2, 3 et 4 (b), de طريقة 1 et 2 du manuel ; rien n'est copié au mot).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'fasila-hajm', type: 'concepts', title: 'الفاصلة تحدّد حجم القطعة',
        predictPrompt: 'في لوحتك: الأرقام 2 و 3 و 5 صنعت طلبيات مختلفة جدًا كلما حرّكت الفاصلة. ماذا يتغيّر في القطعة التي يعدّها كل رقم حين تتحرّك الفاصلة خطوة نحو اليمين؟ اكتب ملاحظتك.',
        summary: 'الفاصلة هي التي تقول أيّ قطعة يعدّها كل رقم: الرقم الذي قبلها يعدّ وحدات كاملة، وكل خطوة نحو اليمين تجعل القطعة أصغر بعشر مرّات.',
        body: (
          <div className="space-y-2">
            <p><MathText>{'2 ، 3 ، 5 : $235$ لوحة ، $23{,}5$ ، $2{,}35$ ، $0{,}235$ — الأرقام لم تتغيّر، والقطعة التي يعدّها كل رقم هي التي تغيّرت.'}</MathText></p>
          </div>
        ),
      },
      {
        id: 'kasr-ashri', type: 'concepts', title: 'الكسر العشري',
        predictPrompt: 'العمود الواحد من لوحة الزليج هو عشرة بلاطات متقايسة، والبلاطة قطعة من مائة. بأيّ كسر نكتب العمود الواحد من اللوحة؟ وبأيّ كسر نكتب البلاطة الواحدة؟ وكم بلاطة في ثلاثة أعمدة؟',
        summary: 'الكسر العشري كسر مقامه 10 أو 100 أو 1000 …: العُشر $\\frac{1}{10}$ والجزء من مائة $\\frac{1}{100}$ والجزء من ألف $\\frac{1}{1000}$ ؛ وكل عُشر يساوي عشرة أجزاء من مائة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.decimalFraction.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.decimalFraction.equal}</MathText></p>
          </div>
        ),
      },
      {
        id: 'kitaba-bifasila', type: 'regles', title: 'الأرقام بعد الفاصلة وأصفار المقام',
        predictPrompt: 'في الوصل 3125/1000 وضعتَ الفاصلة حتى طابق الطلب. كم رقمًا بعد الفاصلة؟ وكم صفرًا في المقام 1000؟ ما العلاقة بينهما؟ اكتب القاعدة بكلماتك.',
        summary: 'عدد الأرقام بعد الفاصلة هو عدد أصفار المقام: $2{,}35=\\frac{235}{100}$ (رقمان، صفران) ؛ والعدد المكتوب بلا فاصلة هو البسط.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.comma.rule}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'mafkuk-ashri', type: 'concepts', title: 'المفكوك النموذجي لعدد عشري',
        predictPrompt: 'العدد 2,35 هو لوحتان وثلاثة أعمدة وخمس بلاطات. اكتبه على شكل مجموع عدد طبيعي وكسور عشرية، حدٌّ لكل نوع من القطع.',
        summary: 'المفكوك النموذجي لعدد عشري مجموع لعدد طبيعي وكسور عشرية: $2{,}35=2+\\frac{3}{10}+\\frac{5}{100}=2+3\\times0{,}1+5\\times0{,}01$ ؛ ولا حدّ للرقم 0.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.expansion.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.expansion.order}</MathText></p>
          </div>
        ),
      },
      {
        id: 'asfar-ghayr-darurya', type: 'regles', title: 'الأصفار غير الضرورية',
        predictPrompt: 'في الورشة رأيتَ أنّ 2,50 و 2,5 يملآن الطاولة نفسها، وأنّ الصفر في 0,05 لا يمكن حذفه. متى يمكن حذف صفر من عدد عشري دون أن يتغيّر؟ ومتى لا يمكن؟ اكتب القاعدة.',
        summary: 'الصفر الأخير بعد الفاصلة لا يغيّر العدد ($3{,}40=3{,}4$) ؛ والصفر الذي يليه رقم يحفظ مرتبة فارغة ولا يُحذف ($0{,}05\\neq0{,}5$).',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.zeros.trailing}</MathText></p>
          </div>
        ),
      },
      {
        id: 'adad-al-aashar', type: 'concepts', title: 'رقم الأعشار وعدد الأعشار', predict: false,
        summary: 'رقم الأعشار هو الرقم الأول بعد الفاصلة، وعدد الأعشار هو عدد الأجزاء من عشرة في العدد كله: في $2{,}35$ الرقم 3 والعدد 23.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.count.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-intiqal', type: 'methodes', title: 'من الفاصلة إلى الكسر وبالعكس',
        predictPrompt: 'لتكتب 31,25 كسرًا عشريًا: ماذا تعدّ بعد الفاصلة؟ وماذا تكتب في البسط وماذا في المقام؟ ولتكتب 9345/1000 بالفاصلة: ماذا تعدّ في المقام؟ اكتب الطريقة.',
        summary: 'من الكتابة العشرية إلى الكسر: نعدّ الأرقام بعد الفاصلة فنكتب 1 متبوعًا بعددها من الأصفار في المقام، وبسطه العدد بلا فاصلة. ومن الكسر إلى الفاصلة: نعدّ أصفار المقام ونعدّ بقدرها أرقامًا من اليمين.',
        body: (
          <div className="space-y-2">
            {METHOD_CONVERT.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600">{METHOD_CONVERT.rule}</p>
          </div>
        ),
      },
    ],
    4: [
      {
        id: 'azaha-fasila', type: 'regles', title: 'إزاحة الفاصلة',
        predictPrompt: 'في الآلة: ×10 و ×100 و ×1000 تجعل الأرقام تعدّ قطعًا أكبر، و ÷10 و ÷100 و ÷1000 تجعلها أصغر. إلى أيّ جهة تتحرّك الفاصلة في كل حالة؟ وكم مرتبة؟ وماذا نكتب حين لا يبقى رقم؟',
        summary: 'الضرب في 10 أو 100 أو 1000 يزيح الفاصلة مرتبة أو مرتبتين أو ثلاثًا نحو اليمين، والقسمة عليها نحو اليسار، ونكتب أصفارًا في المراتب الجديدة الفارغة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.shift.rule}</MathText></p>
            <p className="text-sm text-slate-600">{METHOD_SHIFT.rule}</p>
          </div>
        ),
      },
      {
        id: 'darb-juz-ashar', type: 'regles', title: 'الضرب في 0,1 و 0,01 و 0,001',
        predictPrompt: 'نعلم أنّ 0,1 هو العُشر. ماذا يعطي ضرب عدد في 0,1؟ هل يكبر أم يصغر؟ إلى أيّ جهة تتحرّك الفاصلة؟ اكتب ما تتوقّعه.',
        summary: 'الضرب في 0,1 أو 0,01 أو 0,001 هو القسمة على 10 أو 100 أو 1000، أي إزاحة الفاصلة نحو اليسار.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.shift.byTenth}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.addZero.right}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
