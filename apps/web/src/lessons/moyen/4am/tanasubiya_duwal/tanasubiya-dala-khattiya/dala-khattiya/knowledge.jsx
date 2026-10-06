import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_LINES, KNOWLEDGE, IMAGE_METHOD, METHOD, ZERO_NOTE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 2 « مفهوم وتعيين الدالة الخطية » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  dala-nashat — « نقول أنّنا عرّفنا دالة … » et « نسمي دالة f من الشكل f(x) = ax
 *                      … دالة خطية معاملها a » : la remise f(x) = 0,8x ;
 *   module 2 (معارف)   dala-khattiya (معارف 1), hisab-sura (la صورة, معارف 1 + un exemple),
 *                      jadwal-khattiya (معارف 2), tayin-dala (طرائق, et la condition m ≠ 0).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'dala-nashat', type: 'concepts', title: 'دالة التخفيض',
        predictPrompt: 'آلة التخفيض أخرجت 40 للسعر 50 و 96 للسعر 120، وعبارتها $f(x) = 0{,}8x$. لو غيّر التاجر نسبة التخفيض، ماذا يبقى من شكل هذه العبارة وماذا يتغيّر؟ اكتب بكلماتك ما يميّز هذا النوع من الدوال.',
        summary: 'الدالة f ترفق بكل سعر x قبل التخفيض السعر بعده f(x) = 0,8x؛ ونسمّي كل دالة من الشكل f(x) = ax، حيث a عدد معلوم، دالة خطية معاملها a.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.naming}</MathText></p>
            <p><MathText>{ACTIVITY_LINES.formula}</MathText></p>
            <p className="font-semibold"><MathText>{ACTIVITY.closing}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'dala-khattiya', type: 'concepts', title: 'الدالة الخطية',
        // « أتوقّع القاعدة » : non. La définition reprend dala-nashat (module 1, rappelée juste au-dessus
        // de la brique) et l'encadré معارف 1 la pose juste avant ; ce qu'elle ajoute est la NOTATION
        // (f : x ⟼ ax, le mot صورة) — une convention : une prédiction ne ferait que recopier.
        predict: false,
        summary: 'a عدد معطى: الدالة الخطية f التي معاملها a ترفق بكل عدد x الجداء ax، ونكتب f(x) = ax ونرمز لها بـ f : x ⟼ ax.',
        body: (
          <div className="space-y-1.5">
            {KNOWLEDGE.linear.definition.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            {KNOWLEDGE.linear.examples.map((l) => <p key={l} className="text-sm text-slate-600"><MathText>{l}</MathText></p>)}
          </div>
        ),
      },
      {
        id: 'hisab-sura', type: 'methodes', title: 'صورة عدد',
        // « أتوقّع القاعدة » : non. « العدد a × x يسمى صورة x » vient d'être lu dans l'encadré معارف 1
        // (étape 2 du module 2) et la brique le cite ; f(120) = 0,8 × 120 a été calculé au module 1.
        predict: false,
        summary: 'صورة العدد m بالدالة الخطية التي معاملها a هي الجداء a × m.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{IMAGE_METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{IMAGE_METHOD.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jadwal-khattiya', type: 'regles', title: 'الدالة الخطية والتناسبية',
        summary: 'جدول قيم دالة خطية جدول تناسبية، ومعامل الدالة الخطية هو معامل التناسبية لهذا الجدول.',
        body: (
          <div className="space-y-1.5">
            {KNOWLEDGE.table.definition.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
          </div>
        ),
      },
      {
        id: 'tayin-dala', type: 'methodes', title: 'تعيين دالة خطية من عدد وصورته',
        predictPrompt: 'في آلة التخفيض وجدت المعامل $0{,}8$ من سعر واحد وصورته (50 يصبح 40). لو علمت فقط أنّ دالة خطية $g$ تحقّق $g(-2) = 6$ ، كيف تجد معاملها؟ اكتب الطريقة: أيّ معادلة تحلّ وما مجهولها؟ وهل تكفي معرفة صورة العدد $0$ ؟',
        summary: 'لتعيين دالة خطية g علمًا أنّ g(m) = n، حيث m عدد غير معدوم، نحل المعادلة am = n ذات المجهول a.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ZERO_NOTE.text}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
