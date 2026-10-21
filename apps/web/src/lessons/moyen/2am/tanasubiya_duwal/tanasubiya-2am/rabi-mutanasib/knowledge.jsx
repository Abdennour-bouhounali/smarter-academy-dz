import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « حساب الرابع المتناسب » (2AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف
 * p. 74 et طريقة p. 75, réécrites). La reconnaissance d'un tableau et le coefficient sont des prérequis (`priorKnowledge`), mesurés par
 * « أستعدّ », jamais des items ici.
 */
const { fourth, routes, cross, remark, trap } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'rabi', type: 'vocabulaire', title: 'الرابع المتناسب',
        predictPrompt: 'في لوحة الأسعار، ضبطتَ البطاقة الناقصة حتى تتوازن الموازين الثلاثة معًا. كم عددًا جعل الجدول تناسبيًا؟ وبماذا نسمّي هذا العدد؟',
        summary: 'ثلاثة أعداد معلومة في جدول تناسبية تعيّن العدد الرابع الذي ينقص، ولا يوجد إلاّ عدد واحد يصلح: هو الرابع المتناسب.',
        body: <p><MathText>{fourth.text}</MathText></p>,
      },
      {
        id: 'farq', type: 'regles', title: 'لا نضيف الفرق',
        predictPrompt: 'ميزان الفرق أضاء عند 404 DA لكنّ الميزانين الآخرين لم يتوازنا. لماذا لا نقبل 404 DA ؟',
        summary: 'التناسبية تحافظ على ثمن الوحدة، لا على الفرق: إضافة الفرق نفسه إلى العددين تعطي جدولًا غير تناسبي.',
        body: (
          <div className="space-y-2">
            <p><MathText>{trap.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.addDiff.right}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jidaan', type: 'regles', title: 'الجداءان المتصالبان',
        predictPrompt: 'عند الثمن العادل، قارن جداء كتلة العمود الأوّل في ثمن العمود الثاني بجداء ثمن العمود الأوّل في كتلة العمود الثاني. ماذا تلاحظ؟',
        summary: 'في جدول تناسبية $a \\times d = b \\times c$ : الجداءان المتصالبان متساويان.',
        body: (
          <div className="space-y-2">
            <p><MathText>{cross.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{remark.text}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'turuq', type: 'methodes', title: 'طرق حساب الرابع المتناسب',
        predictPrompt: 'كيف تحسب ثمن 7 kg دون تحريك أيّ بطاقة، علمًا أنّ ثمن 5 kg معلوم؟ اكتب طريقتين مختلفتين.',
        summary: 'نصل إلى الرابع المتناسب نفسه بالمرور بالوحدة أو بمعامل التناسبية أو بالخاصية الجمعية أو الضربية.',
        body: <p><MathText>{routes.text}</MathText></p>,
      },
      {
        id: 'hisab-jidaan', type: 'regles', title: 'أحسب بالجداءين',
        predictPrompt: 'كتبتَ $4 \\times x = 300 \\times ...$ لتجد عدد الكيلوغرامات. كيف تحصل على $x$ من هذه المساواة؟',
        summary: 'نكتب مساواة الجداءين المتصالبين ثم نقسم الجداء المعلوم على العدد المقابل للمجهول.',
        body: <p><MathText>{'$a \\times x = b \\times c$ ، إذن $x = b \\times c \\div a$ : الجداء المعلوم هو جداء القطر الذي لا يحمل المجهول.'}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'ikhtiyar', type: 'methodes', title: 'أختار الطريق',
        predictPrompt: 'أجرة 3 ساعات وأجرة 9 ساعات وأجرة 7 ساعات: هل حسبتها كلّها بالطريق نفسه؟ لماذا؟',
        summary: 'أنظر إلى الأعداد أوّلًا: ضعف أو نصف ← الخاصية الضربية؛ مجموع ← الجمعية؛ وحدة بسيطة ← المرور بالوحدة؛ وإلاّ الجداءان المتصالبان.',
        body: <ul className="list-disc ps-5 space-y-1 text-sm">{METHOD.choose.rule.slice(1).map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>,
      },
    ],
  },
};
