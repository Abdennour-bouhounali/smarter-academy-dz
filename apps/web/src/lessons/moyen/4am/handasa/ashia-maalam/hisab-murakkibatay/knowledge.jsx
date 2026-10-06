import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW3B, KNOW_EQUAL, METHOD_EQUAL, METHOD_UNKNOWN, MISTAKES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « حساب مركبتي شعاع وتساوي شعاعين في معلم » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 2)  farq-ihdathiyat — le code du portail = fin moins début (la découverte du نشاط 2) ;
 *   module 2 (معارف)   qanun-murakkibatayn (معارف 3 ب : AB(x_B − x_A ; y_B − y_A)) ; tasawi-murakkibat (معارف جـ :
 *                      AB = CD ⇔ mêmes composantes) ;
 *   module 3 (طرائق)   tahaqquq-tasawi (la طريقة p. 143, conclusion corrigée AB = DC) ; nuqta-majhula (calculer les
 *                      coordonnées d'un point inconnu — formalisation de la plateforme, déclarée).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'farq-ihdathiyat', type: 'regles', title: 'رمز القفزة: النهاية ناقص المبدأ',
        // « أتوقّع القاعدة » : posée par PredictRule autour de la question نشاط 2 ب 1 (module 1, étape 4), dont la bonne option EST la règle.
        predictPrompt: 'على الخريطة فتحتَ البوابة CD بالرمز $\\begin{pmatrix} -1 \\\\ -6 \\end{pmatrix}$ مع $C(3\\,;\\,1)$ و $D(2\\,;\\,-5)$ ، ثم وجدتَ E من رمز $\\overrightarrow{DE}$. كيف تحسب رمز بوابة تنقل البطل من $A(x_A\\,;\\,y_A)$ إلى $B(x_B\\,;\\,y_B)$ دون أن تعدّ المربعات؟ اكتب القاعدة بكلماتك، لكل مركبة.',
        summary: 'مركبتا الشعاع AB نحصل عليهما دون عدّ: فاصلة B ناقص فاصلة A، وترتيب B ناقص ترتيب A. وشعاعان لهما نفس المركبتين متساويان.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qanun-murakkibatayn', type: 'regles', title: 'حساب مركبتي شعاع',
        // « أتوقّع القاعدة » : non — معارف 3 ب re-pose farq-ihdathiyat (module 1) : brique variant="rappel" (Module02Maarif).
        summary: 'إذا كانت إحداثيتا A هما xA و yA وإحداثيتا B هما xB و yB فإن مركبتي الشعاع AB هما xB − xA و yB − yA.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW3B.property}</MathText></p>
            <p className="text-center text-lg"><MathText>{KNOW3B.formula}</MathText></p>
            <p><MathText>{KNOW3B.example}</MathText></p>
            <SourceTag source={KNOW3B.source} />
          </div>
        ),
      },
      {
        id: 'tasawi-murakkibat', type: 'regles', title: 'الشعاعان المتساويان في معلم',
        // « أتوقّع القاعدة » : non — « شعاعان لهما نفس المركبتين متساويان » est déjà posé par farq-ihdathiyat (module 1, DE = CF) :
        // brique variant="rappel" (Module02Maarif).
        summary: 'يتساوى شعاعان إذا وفقط إذا تساوت مركبتاهما: المركبة الأولى مع الأولى والثانية مع الثانية.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW_EQUAL.property}</MathText></p>
            <SourceTag source={KNOW_EQUAL.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tahaqquq-tasawi', type: 'methodes', title: 'التحقق من تساوي شعاعين',
        predictPrompt: 'في حلّ الكتاب، مع $A(1\\,;\\,0)$ و $B(0\\,;\\,3)$ و $C(-3\\,;\\,0)$ و $D(-2\\,;\\,-3)$ ، وصلنا إلى $\\overrightarrow{AB} = \\overrightarrow{DC}$. لو أعطيناك شعاعين آخرين في معلم، بأيّ خطوات تتحقّق من تساويهما؟ وإلامَ تنتبه حين تكتب كل شعاع؟ اكتب الطريقة.',
        summary: 'للتحقق من تساوي شعاعين نحسب مركبتي كل منهما ونقارنهما، مع احترام ترتيب الحروف (المبدأ ثم النهاية).',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_EQUAL.rule}</MathText></p>
            <p><MathText>{METHOD_EQUAL.solution[4]}</MathText></p>
            <SourceTag source={METHOD_EQUAL.source} />
          </div>
        ),
      },
      {
        id: 'nuqta-majhula', type: 'methodes', title: 'حساب إحداثيتي نقطة مجهولة',
        // « أتوقّع القاعدة » : posée par PredictRule autour de la طريقة de la plateforme (module 3, étape 2), qui l'écrit ligne à ligne.
        predictPrompt: 'في المختبر وضعتَ البوابة D حتى يكون ABCD متوازي أضلاع، مع $A(1\\,;\\,2)$ و $B(4\\,;\\,3)$ و $C(5\\,;\\,5)$. لو لم يكن معك المختبر ولا الشبكة، بأيّ خطوات تحسب إحداثيتي D؟ اكتب الطريقة.',
        summary: 'لحساب إحداثيتي نقطة مجهولة نكتب تساوي شعاعين بترتيب الحروف الصحيح، ثم نساوي المركبتين فنحصل على معادلتين نحلّهما.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">
              {METHOD_UNKNOWN.solution.slice(0, 4).map((l) => <li key={l}><MathText>{l}</MathText></li>)}
            </ol>
            <p><MathText>{MISTAKES.order.text}</MathText></p>
            <SourceTag source={METHOD_UNKNOWN.source} />
          </div>
        ),
      },
    ],
  },
};
