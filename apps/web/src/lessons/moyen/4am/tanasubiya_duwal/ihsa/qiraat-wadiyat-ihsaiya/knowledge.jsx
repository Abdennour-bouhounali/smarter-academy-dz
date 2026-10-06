import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { GROUPS_RULE, WHOLE_RULE, READ_RULE, TABLE_RULE, COMPARE_RULE, OUTLIER_RULE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 4 « ترييض وقراءة وضعيات إحصائية وتفسير المؤشرات » — SOURCE UNIQUE.
 * Le manuel n'a ni معارف ni طرائق pour ce درس : chaque texte est une formulation de la PLATEFORME
 * (`addition('knowledge_formalization')`, content/textbook.js), dans le vocabulaire du manuel.
 *
 *   module 1  mutawassit-majmuat     moyenne de groupes réunis = Σ n·m ÷ N (le تحدّ)
 *             silsila-kamila         on compare la série entière, pas groupe par groupe
 *   module 2  qiraat-mukhattat       lire un مخطط بالأعمدة : axe, pas de graduation, hauteurs
 *             tarjama-jadwal         traduire en tableau : تكرار، تواتر، تواتر مجمع ; barre combinée (ex-19)
 *   module 3  mawqi-tashattut        comparer avec un indicateur de position ET de dispersion (ex-14)
 *             hadhf-qiyam            retirer des valeurs : Σ et N changent ; médiane et extrêmes (ex-22)
 *             tariqat-qarar          أقرأ · أحسب المؤشرات · أقارن · أقرّر
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'mutawassit-majmuat', type: 'regles', title: 'متوسط مجموعات مجتمعة',
        predictPrompt: 'في المختبر: خزان عرضه 15 وماؤه إلى 10، وخزان عرضه 18 وماؤه إلى 13. فتحت الصمام فاستقرّ الماء عند مستوى واحد. كيف تحسب معدّل قسم مكوّن من مجموعتين انطلاقًا من عدد أفراد كل مجموعة ومعدّلها؟ اكتب القاعدة بكلماتك.',
        summary: 'متوسط سلسلة مكوّنة من مجموعات هو المتوسط المتوازن: نضرب متوسط كل مجموعة في تكرارها، نجمع، ثم نقسم على التكرار الكلي؛ ولا يساوي متوسط المتوسطات إلا إذا تساوت التكرارات.',
        body: <p><MathText>{GROUPS_RULE.text}</MathText></p>,
      },
      {
        id: 'silsila-kamila', type: 'concepts', title: 'نقارن السلسلة كاملة',
        predictPrompt: 'في التحدّي ذكور القسم (ب) أفضل ($12{,}5$ مقابل 10) وإناث القسم (أ) أفضل (13 مقابل 11)، وفي المختبر استقرّ ماء القسمين عند المستوى نفسه. لكي نحكم أيّ القسمين نتائجه أفضل، ماذا نقارن؟ اكتب القاعدة بكلماتك.',
        summary: 'لمقارنة قسمين نقارن مؤشرات كل قسم كاملًا: مقارنة الذكور بالذكور والإناث بالإناث لا تحسم، ففي التحدّي للقسمين المعدّل نفسه.',
        body: <p><MathText>{WHOLE_RULE.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'qiraat-mukhattat', type: 'methodes', title: 'قراءة مخطط بالأعمدة',
        predictPrompt: 'أمامك مخطط بالأعمدة للسيارات التي مرّت أمام المدرسة، وأعمدته لا تحمل أعدادها. بأيّ خطوات تبدأ لتعرف عدد السيارات الذي يمثّله عمود، وكيف تتأكّد أنك لم تخطئ في القراءة؟ اكتب الطريقة.',
        summary: 'نقرأ عنوان المحور العمودي، ثم خطوة التدريج، ثم ارتفاع كل عمود، وننقل القيم إلى جدول ونتحقّق من التكرار الكلي.',
        body: <p><MathText>{READ_RULE.text}</MathText></p>,
      },
      {
        id: 'tarjama-jadwal', type: 'methodes', title: 'ترجمة المخطط إلى جدول',
        predictPrompt: 'حسبت تواتر الساعة الأولى من العددين 450 و 1800. في المخطط التالي عمودان يحمل كلّ منهما اسم قناتين معًا («القناتان B و D»). كيف تنقل مخططًا إلى جدول تكرارات وتواترات، وماذا تفعل بعمود يجمع قناتين؟ اكتب الطريقة.',
        summary: 'التكرار من ارتفاع العمود، التواتر هو التكرار مقسوما على التكرار الكلي، والتواتر المجمع الصاعد آخره 1؛ وعمود يجمع فئتين نستخرج منه كل فئة بالطرح.',
        body: <p><MathText>{TABLE_RULE.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'mawqi-tashattut', type: 'regles', title: 'مؤشر موقع ومؤشر تشتت',
        predictPrompt: 'المدينة «أ»: المتوسط $9{,}5$ والمدى 35؛ المدينة «ب»: المتوسط $13{,}25$ والمدى 17. ماذا يقول لك المتوسط عن حرارة مدينة، وماذا يقول المدى؟ وهل يكفي عدد واحد لمقارنة المدينتين؟ اكتب القاعدة بكلماتك.',
        summary: 'لمقارنة سلسلتين نستعمل مؤشر موقع (المتوسط أو الوسيط) ومؤشر تشتت (المدى): سلسلتان لهما المتوسط نفسه قد تختلفان في التشتت.',
        body: <p><MathText>{COMPARE_RULE.text}</MathText></p>,
      },
      {
        id: 'hadhf-qiyam', type: 'concepts', title: 'حذف قيم وقيمة متطرفة',
        predictPrompt: 'في التحدّي حسبت مجموع نقاط قسم بضرب معدّله في عدد تلاميذه. إذا حذفنا قيمة واحدة من سلسلة، ماذا يتغيّر في حساب متوسطها؟ وماذا يحدث للوسيط إذا حذفنا معًا أصغر قيمة وأكبر قيمة؟ اكتب ما تستنتجه.',
        summary: 'حذف قيمة يغيّر مجموع القيم والتكرار الكلي معًا؛ قيمة متطرفة تجذب المتوسط ولا تحرّك الوسيط، وحذف أصغر قيمة وأكبر قيمة لا يغيّر الوسيط.',
        body: <p><MathText>{OUTLIER_RULE.text}</MathText></p>,
      },
      {
        id: 'tariqat-qarar', type: 'methodes', title: 'أقرأ، أحسب، أقارن، أقرّر',
        predictPrompt: 'قارنت المدينتين «أ» و «ب» بالمتوسط والوسيط والمدى، ثم فسّرت النتائج. لو طُلب منك أن تختار بين فريقين انطلاقًا من نتائجهما في عدّة حصص، بأيّ خطوات تمرّ، بالترتيب، حتى تختار وتبرّر اختيارك؟ اكتب الطريقة.',
        summary: 'لقراءة وضعية إحصائية واتخاذ قرار: أقرأ المعطيات وأترجمها، أحسب مؤشر موقع ومؤشر تشتت، أقارن، ثم أقرّر وأبرّر بالمؤشرات.',
        body: <p className="font-bold"><MathText>{METHOD.rule[0]}</MathText></p>,
      },
    ],
  },
};
