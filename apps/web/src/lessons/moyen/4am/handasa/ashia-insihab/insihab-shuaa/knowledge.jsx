import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW1, KNOW2 } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مفهوم الانسحاب والشعاع وتساوي شعاعين » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 1)        insihab-shuaa — la translation définie par un point et son image ; les couples (point ;
 *                            image) définissent UN vecteur, chacun en est un représentant (le texte du نشاط 1) ;
 *   module 2 (معارف 1)       manha-ittijah (المنحى والاتجاه), shuaa (le vecteur : منحى، اتجاه، طول ; notation, مُمثّل),
 *                            tasawi-shuaayn (deux vecteurs égaux) ;
 *   module 3 (نشاط 2 أ ومعارف 2)  mutawazi-adlaa (AB = DC ⇔ ABCD متوازي أضلاع), mulahazat (les milieux, AD = BC, le cas
 *                            aligné).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'insihab-shuaa', type: 'concepts', title: 'الانسحاب يعرّف شعاعا',
        summary: 'الانسحاب يتعيّن بنقطة وصورتها؛ وكل ثنائية من نقطة وصورتها بهذا الانسحاب تعرّف نفس الشعاع u، وكل منها ممثّل لهذا الشعاع.',
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
        id: 'manha-ittijah', type: 'concepts', title: 'المنحى والاتجاه',
        summary: 'مستقيمان متوازيان لهما نفس المنحى؛ والنقطتان المتمايزتان A و B تعيّنان على المستقيم (AB) اتجاهين: من A نحو B، ومن B نحو A.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1.manha}</MathText></p>
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
      {
        id: 'shuaa', type: 'concepts', title: 'الشعاع: منحى واتجاه وطول',
        summary: 'الشعاع AB الذي يعرّفه الانسحاب الذي يحوّل A إلى B منحاه منحى المستقيم (AB)، واتجاهه من A نحو B، وطويلته طول القطعة [AB]؛ مبدؤه A ونهايته B، وكل ثنائية أخرى من نقطة وصورتها ممثّل له.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1.shuaa}</MathText></p>
            <ul className="list-disc space-y-0.5 ps-5">{KNOW1.shuaaItems.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
            <p><MathText>{KNOW1.shuaaNotation}</MathText></p>
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
      {
        id: 'tasawi-shuaayn', type: 'concepts', title: 'تساوي شعاعين',
        summary: 'شعاعان متساويان يعني أن لهما نفس المنحى ونفس الاتجاه ونفس الطول؛ و AB = CD يعني أن الانسحاب الذي يحوّل A إلى B يحوّل أيضا C إلى D.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1.tasawi}</MathText></p>
            <p><MathText>{KNOW1.tasawiExample}</MathText></p>
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'mutawazi-adlaa', type: 'regles', title: 'شعاعان متساويان ومتوازي أضلاع',
        summary: 'إذا كانت A و B و C و D أربع نقط كل ثلاث منها ليست في استقامية، فإن الشعاع AB يساوي الشعاع DC يعني أن الرباعي ABCD متوازي أضلاع (انتبه إلى ترتيب الحروف).',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW2.property}</MathText></p>
            <SourceTag source={KNOW2.source} />
          </div>
        ),
      },
      {
        id: 'mulahazat', type: 'regles', title: 'المنتصف والحالة الخاصة',
        summary: 'من أجل كل أربع نقط: الشعاع AB يساوي الشعاع DC يعني أن للقطعتين [AC] و [BD] نفس المنتصف، وعندها الشعاع AD يساوي الشعاع BC؛ وإذا كانت النقط في استقامية فلا يتكوّن رباعي.',
        body: (
          <div className="space-y-1.5">
            <p>{KNOW2.remarksIntro}</p>
            <ul className="list-disc space-y-0.5 ps-5">{KNOW2.remarks.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
            <p><MathText>{KNOW2.special}</MathText> <MathText>{KNOW2.specialLine}</MathText></p>
            <SourceTag source={KNOW2.source} />
          </div>
        ),
      },
    ],
  },
};
