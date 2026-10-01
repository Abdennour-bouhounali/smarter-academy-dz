import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont
 * la DÉMARCHE du manuel (ترجمة → تجريب → متراجحة → تفسير) et deux moments de
 * choix des exercices « أتعمّق ».
 *   tarjama-sigha        module 1 — traduire une formule de prix : par séance × x, fixe une fois
 *   tajrib               module 1 — l'essai : coûter les deux formules pour plusieurs x
 *   mutarajiha-mufadala  module 1 — « meilleure » = « coûte moins » : l'inéquation qui départage
 *   tafsir-natija        module 1 — interpréter : x naturel, la valeur d'égalité n'est pas la réponse
 *   tariqat-wadiya       module 1 — la démarche complète en trois étapes
 *   shakl-munasib        module 3 — la forme utile : factorisée pour E = 0, développée pour une inéquation
 *   hall-maan            module 3 — deux inéquations à la fois : les solutions communes
 * La SOLUTION du مسبح (9 séances, égalité à 8) n'est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'tarjama-sigha', type: 'methodes', title: 'ترجمة صيغة تسعير بعبارة حرفية', summary: 'نسمّي x عدد الحصص: المبلغ الذي يُدفع في كل حصة يُضرب في x، والمبلغ الذي يُدفع مرّة واحدة يُضاف كما هو.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li>نسمّي المجهول: <MathText>{'$x$'}</MathText> عدد الحصص (عدد طبيعي).</li>
            <li>المبلغ الذي يُدفع <strong>في كل حصة</strong> يتكرّر: نضربه في <MathText>{'$x$'}</MathText>.</li>
            <li>المبلغ الذي يُدفع <strong>مرّة واحدة</strong> (اشتراك) لا يتغيّر مع <MathText>{'$x$'}</MathText> : نضيفه كما هو.</li>
            <li><MathText>{REMARKS.tarjamaRight}</MathText></li>
          </ol>
        ) },
      { id: 'tajrib', type: 'methodes', title: 'التجريب', summary: 'نحسب تكلفة كل صيغة من أجل عدة أعداد للحصص، فنرى متى تصبح إحداهما أقل تكلفة ومتى تتساويان.',
        body: <p><MathText>{REMARKS.tajrib}</MathText></p> },
      { id: 'mutarajiha-mufadala', type: 'regles', title: 'متراجحة للمفاضلة', summary: 'الخيار الأفضل هو الأقل تكلفة: نكتب «تكلفة الخيار المقصود < تكلفة الخيار الآخر» ثم نحلّها.',
        body: (
          <div className="space-y-1">
            <p>«الصيغة أفضل» تعني «تكلفتها أقل»: نترجمها بمتراجحة بين العبارتين، ثم نحلّها كما في الدرس 3.</p>
            <p><MathText>{REMARKS.mufadala}</MathText></p>
          </div>
        ) },
      { id: 'tafsir-natija', type: 'methodes', title: 'تفسير النتائج', summary: 'عدد الحصص عدد طبيعي: «ابتداءً من» يعني أصغر عدد طبيعي يحقّق المتراجحة؛ قيمة التساوي ليست الجواب.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li>حلول المتراجحة أعداد؛ لكن عدد الحصص عدد طبيعي: نحتفظ بالأعداد الطبيعية فقط.</li>
            <li>عند قيمة التساوي تكون التكلفتان متساويتين: لا تكون أيّ صيغة أفضل.</li>
            <li><MathText>{REMARKS.tasawiRight}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الخيار الأفضل', summary: 'نقرأ الوضعية ونترجم كل خيار بعبارة حرفية، نجرّب ثم نكتب متراجحة مناسبة، نحلّها ونفسّر النتيجة.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
          </ol>
        ) },
    ],
    3: [
      { id: 'shakl-munasib', type: 'methodes', title: 'أيّ شكل أستعمل؟', summary: 'لحل معادلة تنعدم فيها عبارة نستعمل شكلها المحلّل وخاصية الجداء المعدوم؛ ولحل متراجحة ننشر، فتختفي الحدود من الدرجة الثانية من الطرفين.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li>لحل معادلة <MathText>{'$E = 0$'}</MathText> نستعمل <strong>الشكل المحلّل</strong>: الجداء معدوم إذا كان أحد عوامله معدومًا.</li>
            <li>لحل متراجحة نستعمل <strong>الشكل المنشور</strong>: في تمارين الكتاب يختفي الحد <MathText>{'$x^2$'}</MathText> من الطرفين، فتبقى متراجحة من الدرجة الأولى.</li>
          </ul>
        ) },
      { id: 'hall-maan', type: 'methodes', title: 'متراجحتان معًا', summary: 'نحلّ كل متراجحة على حدة، ثم نأخذ الأعداد التي تحقّق الاثنتين: الجزء المشترك على المستقيم المدرّج.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li>نحلّ كل متراجحة وحدها.</li>
            <li>نأخذ الأعداد المشتركة بين الحلّين: على المستقيم المدرّج، الجزء الملوّن في التمثيلين معًا.</li>
            <li>عند كل حدّ ننظر: هل هو حلّ (المعقوف نحو الجزء الملوّن) أم لا.</li>
          </ol>
        ) },
    ],
  },
};
