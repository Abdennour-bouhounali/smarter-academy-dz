import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مقارنة وترتيب أعداد نسبية » (2AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js :
 * les trois propriétés de معارف p. 42, طريقة p. 43, réécrites). La lecture d'une abscisse et la distance à zéro sont des prérequis
 * (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { negatives, positives, different, order, between } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'salibayn', type: 'regles', title: 'عددان سالبان',
        predictPrompt: 'في المسبار ، لمّا أطلتَ السلك تحت الصفر صار العدد أخفض. إذن من بين عددين سالبين، أيّهما الأصغر؟ اكتب القاعدة بكلماتك.',
        summary: 'من بين عددين نسبيين سالبين، الأصغر هو الأبعد عن الصفر : −5 < −3 .',
        body: <p><MathText>{negatives.text}</MathText></p>,
      },
      {
        id: 'mujabayn', type: 'regles', title: 'عددان موجبان',
        predictPrompt: 'فوق الصفر، كلما أطلتَ السلك ارتفع المسبار. من بين عددين موجبين، أيّهما الأصغر؟',
        summary: 'من بين عددين نسبيين موجبين، الأصغر هو الأقرب إلى الصفر : 2,5 < 4 .',
        body: <p><MathText>{positives.text}</MathText></p>,
      },
      {
        id: 'mukhtalifayn', type: 'regles', title: 'إشارتان مختلفتان',
        predictPrompt: 'وقف المسبار تحت الصفر ولم يستطع أن يعلو مسبارًا فوق الصفر مهما طال سلكه. ماذا تستنتج عن عدد سالب وعدد موجب؟ وماذا عن الصفر؟',
        summary: 'العدد السالب أصغر من الصفر ومن كل عدد موجب ؛ والصفر أصغر من كل عدد موجب.',
        body: (
          <div className="space-y-2">
            <p><MathText>{different.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.zero}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tartib', type: 'vocabulaire', title: 'الترتيب التصاعدي والتنازلي',
        predictPrompt: 'رتّبتَ أعدادًا من الأخفض إلى الأعلى. كيف نسمّي هذا الترتيب؟ وأيّ رمز نكتبه بين عددين متتاليين؟',
        summary: 'ترتيب تصاعدي : من الأصغر إلى الأكبر بالرمز < ؛ ترتيب تنازلي : من الأكبر إلى الأصغر بالرمز > .',
        body: (
          <div className="space-y-2">
            <p><MathText>{order.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{order.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hasr', type: 'regles', title: 'عدد بين عددين',
        predictPrompt: 'وضعتَ المسبار بين −7 و −5 . كيف تجد عددًا بين −4,5 و −4,3 ؟ وهل يمكن أن لا يوجد أيّ عدد بين عددين مختلفين؟',
        summary: 'بين أيّ عددين نسبيين مختلفين يوجد دائمًا عدد نسبي ثالث : −4,5 < −4,4 < −4,3 .',
        body: <p><MathText>{between.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'tariqa', type: 'methodes', title: 'أقارن وأرتّب',
        predictPrompt: 'رتّبتَ ست أعداد بعضها سالب وبعضها موجب. من أين بدأتَ؟ اكتب الخطوات التي اتّبعتَها.',
        summary: 'أنظر إلى الإشارتين أوّلًا ؛ بين سالبين الأبعد عن الصفر أصغر ؛ بين موجبين الأقرب إلى الصفر أصغر.',
        body: <ul className="list-disc ps-5 space-y-1 text-sm">{METHOD.order.rule.slice(1).map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>,
      },
    ],
  },
};
