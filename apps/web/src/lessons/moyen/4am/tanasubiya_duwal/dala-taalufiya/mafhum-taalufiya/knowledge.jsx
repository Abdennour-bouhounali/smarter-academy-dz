import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_LINES, ACTIVITY2, KNOWLEDGE, IMAGE_METHOD, METHOD, CONSTANT_NOTE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 1 « مفهوم وتعيين دالة تآلفية » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  dala-ujra — la paie S(x) = 185x + 35000 et la phrase du manuel qui NOMME
 *                      (« كل دالة من الشكل x ⟼ ax + b … تسمى دالة تآلفية ») ;
 *   module 2 (نشاط 2)  muamilan (a et b quel que soit l'ordre d'écriture), khattiya-taalufiya (b = 0 :
 *                      « الدالة الخطيّة هي أيضا دالة تآلفية »), thabita (a = 0, plateforme) ;
 *   module 3 (معارف)   taarif-taalufiya, sura-taalufiya, sabiq-taalufiya — écrits par la plateforme.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'dala-ujra', type: 'concepts', title: 'أجرة العامل: دالة تآلفية',
        predictPrompt: 'على العدّاد: 10 ساعات إضافية أعطت 36850DA و 15 ساعة أعطت 37775DA، والأجرة لم تتضاعف. لو كان الجزء الذي يُدفع مرة واحدة عددًا $b$ وما يُضاف عن كل ساعة عددًا $a$ ، كيف تكتب الأجرة بدلالة عدد الساعات $x$ ؟ اكتب القاعدة بكلماتك.',
        summary: 'الأجرة S(x) = 185x + 35000: جزء ثابت 35000 يُدفع مرة واحدة و 185 عن كل ساعة إضافية؛ وكل دالة من الشكل x ⟼ ax + b حيث a و b عددان معلومان تسمى دالة تآلفية.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY_LINES.formula}</MathText></p>
            <p className="font-semibold"><MathText>{ACTIVITY.naming}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{`برنامج الحساب: ${ACTIVITY_LINES.program}`}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'muamilan', type: 'concepts', title: 'المعاملان a و b',
        predictPrompt: 'في النشاط: $-2x + 1$ و $2 + 3x$ و $\\dfrac{x}{2} - 1$ . كيف تعرف أيّ العددين هو $a$ وأيّهما $b$ ، مهما كان ترتيب كتابة الحدّين؟ اكتب القاعدة بكلماتك.',
        summary: 'في الدالة التآلفية x ⟼ ax + b، العدد a هو العدد المضروب في x والعدد b هو الحدّ الثابت، أينما كُتبا: في 2 + 3x لدينا a = 3 و b = 2.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY2.rows[4].correction}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY2.rows[3].correction}</MathText></p>
          </div>
        ),
      },
      {
        id: 'khattiya-taalufiya', type: 'regles', title: 'الدالة الخطية حالة خاصة',
        predictPrompt: 'في ج) $x \\longmapsto 5x$ لا يظهر حدّ ثابت. اكتب $5x$ على الشكل $ax + b$ : ما قيمة $b$ ؟ ثم ماذا تستنتج عن كل دالة خطية $x \\longmapsto ax$ ؟ اكتب ما تستنتجه بكلماتك.',
        summary: 'الدالة الخطية x ⟼ ax هي الدالة التآلفية x ⟼ ax + b في الحالة b = 0: الدالة الخطية هي أيضا دالة تآلفية.',
        body: <p><MathText>{ACTIVITY2.q2}</MathText></p>,
      },
      {
        id: 'thabita', type: 'regles', title: 'الدالة الثابتة حالة خاصة',
        predictPrompt: 'في مكتبة الحيّ يدفع التلميذ 300DA سواء استعار كتابًا واحدًا أو عشرة كتب. اكتب هذا المبلغ على الشكل $ax + b$ : ما قيمة $a$ ؟ وماذا تكون صورة كل عدد $x$ ؟ اكتب ما تستنتجه عن هذا النوع من الدوال.',
        summary: 'إذا كان a = 0 فإنّ f(x) = b لكل عدد x: صورة كل عدد هي b، والدالة ثابتة؛ وهي أيضا دالة تآلفية.',
        body: <p><MathText>{KNOWLEDGE.special.constant}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'taarif-taalufiya', type: 'concepts', title: 'الدالة التآلفية',
        // Pas de prédiction : le module 1 a déjà NOMMÉ la دالة تآلفية (brique dala-ujra, phrase du manuel) ;
        // cette brique n'ajoute que la notation f(x) = ax + b / f : x ⟼ ax + b et le mot « صورة » (convention).
        predict: false,
        summary: 'a و b عددان معلومان: الدالة التآلفية f ترفق بكل عدد x العدد ax + b، ونكتب f(x) = ax + b ونرمز لها بـ f : x ⟼ ax + b.',
        body: (
          <div className="space-y-1.5">
            {KNOWLEDGE.definition.lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
          </div>
        ),
      },
      {
        id: 'sura-taalufiya', type: 'methodes', title: 'صورة عدد',
        predictPrompt: 'في النشاط 1 حسبت أجرة 10 ساعات إضافية: 36850DA. لو أعطيناك دالة تآلفية أخرى $x \\longmapsto ax + b$ وعددًا $m$ ، بأيّ عمليتين وبأيّ ترتيب تحسب صورته؟ اكتب الطريقة.',
        summary: 'صورة العدد m بالدالة التآلفية x ⟼ ax + b هي a × m + b: نضرب في a ثم نضيف b.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{IMAGE_METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{IMAGE_METHOD.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'sabiq-taalufiya', type: 'methodes', title: 'العدد الذي صورته معلومة',
        predictPrompt: 'في النشاط 1 وجدت عدد الساعات الإضافية الذي يعطي أجرة 38330DA دون أن تجرّب كل الأعداد. لو أعطيناك دالة تآلفية $x \\longmapsto ax + b$ وعددًا $m$ ، بأيّ خطوات تجد العدد الذي صورته $m$ ؟ اكتب الطريقة وترتيب العمليتين.',
        summary: 'لتعيين العدد الذي صورته m بالدالة التآلفية x ⟼ ax + b حيث a غير معدوم، نحلّ المعادلة ax + b = m: نطرح b ثم نقسم على a.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.program}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{CONSTANT_NOTE.text}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
