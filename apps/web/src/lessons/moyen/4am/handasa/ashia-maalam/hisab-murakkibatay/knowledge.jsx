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
