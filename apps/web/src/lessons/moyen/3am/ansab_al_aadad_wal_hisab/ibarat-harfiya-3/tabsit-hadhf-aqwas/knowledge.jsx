import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_BRACKETS } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « تبسيط عبارة جبرية وحذف الأقواس » (3AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme, tirés de
 * معارف 1–2 et de طرائق 1 du manuel ; rien n'est copié au mot).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'hudud-mutashabiha', type: 'concepts', title: 'الحدود المتشابهة',
        predictPrompt: 'رتّبتَ حزمة $x$ في صينية $x$ ورفضت الطاولة حزمة $x^2$ في تلك الصينية. متى تكون حزمتان من نوع واحد؟ اكتب ما لاحظته.',
        summary: 'حدّان متشابهان إذا كان لهما الجزء الحرفي نفسه: 3x و −5x متشابهان، والعددان متشابهان، أمّا x² و x فلا.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.like.text}</MathText></p></div>,
      },
      {
        id: 'jam-muamilat', type: 'regles', title: 'جمع المعاملات',
        predictPrompt: 'في صينية $x$ اجتمعت حزمتان فصارتا حزمة واحدة، ومرّةً بقيت قطع بعد أن تلاشت أخرى. كيف تعرف عدد القطع في الصينية؟ اكتب ما فعلتَه بالأعداد.',
        summary: 'نبسّط مجموعًا بجمع معاملات الحدود المتشابهة وإبقاء الجزء الحرفي؛ وحدّان متشابهان معاملاهما متعاكسان يتلاشيان.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.merge.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.noMix.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qima-thabita', type: 'regles', title: 'القيمة لا تتغيّر',
        predictPrompt: 'غيّرتَ $x$ فتحرّك العدّادان معًا وبقيا متساويين طوال الترتيب. ماذا بقي ثابتًا بعد تبسيط العبارة؟ اكتب ما لاحظته.',
        summary: 'التبسيط يغيّر كتابة العبارة لا قيمتها: للعبارة وصورتها المبسّطة القيمة نفسها مهما كان x.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.valueKept.text}</MathText></p></div>,
      },
    ],
    2: [
      {
        id: 'majmu-wa-jidaa', type: 'concepts', title: 'مجموع أم جداء؟', predict: false,
        summary: 'عبارة مجموع إذا كانت آخر عملية فيها جمعًا أو طرحًا، وجداء إذا كانت آخر عملية فيها ضربًا.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.sumOrProduct.text}</MathText></p></div>,
      },
      {
        id: 'jidaa-hududayn', type: 'regles', title: 'جداء حدود',
        predictPrompt: 'كتبتَ $3x\\times5x$ عوامل عاملًا عاملًا. كيف تحصل على العدد وكيف تحصل على الحرف؟ اكتب ما فعلتَه.',
        summary: 'نبسّط جداء حدود بضرب الأعداد معًا والحروف معًا: 3x × 5x = 15x².',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.product.text}</MathText></p></div>,
      },
    ],
    3: [
      {
        id: 'aqwas-jam', type: 'regles', title: 'قوسان مسبوقان بـ +',
        predictPrompt: 'أخرجتَ كل حزمة من صندوق مسبوق بالإشارة $+$ كما هي وقبلت الطاولة ذلك. ماذا يحدث لإشارة كل حدّ عند حذف القوسين؟ اكتب ما لاحظته.',
        summary: 'قوسان مسبوقان بـ + نحذفهما ونُبقي إشارة كل حدّ كما هي.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.plus.text}</MathText></p></div>,
      },
      {
        id: 'aqwas-tarh', type: 'regles', title: 'قوسان مسبوقان بـ −',
        predictPrompt: 'رفضت الطاولة إخراج الحزم كما هي من الصندوق المسبوق بالإشارة $-$ وقبلتها بعكس إشارتها. ماذا يحدث لإشارة كل حدّ عند حذف القوسين؟ اكتب ما لاحظته.',
        summary: 'قوسان مسبوقان بـ − نحذفهما ونغيّر إشارة كل حدّ كان بينهما.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.minus.text}</MathText></p></div>,
      },
      {
        id: 'tariqat-hadhf', type: 'methodes', title: 'أحذف الأقواس وأبسّط',
        predictPrompt: 'أخرجتَ الحزم من صناديقها ثم رتّبتها في الصواني. ما الخطوات التي اتّبعتَها بالترتيب؟ اكتبها بكلماتك.',
        summary: 'نحذف الأقواس بقاعدتها، ثم نجمع الحدود المتشابهة، ثم نكتب العبارة بأقل ما يمكن من الحدود.',
        body: (
          <div className="space-y-2">
            {METHOD_BRACKETS.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{METHOD_BRACKETS.rule}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
