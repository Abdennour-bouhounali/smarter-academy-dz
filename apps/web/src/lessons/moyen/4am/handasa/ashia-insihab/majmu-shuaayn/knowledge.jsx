import React from 'react';
import MathText from '../../../../../common/components/MathText';
import GeoFigure from '../../../../../common/components/GeoFigure';
import { ACT3, KNOW4, KNOW5, KNOW6, METHOD, REMARKS } from './content/textbook';
import { FIG_KNOW5, FIG_KNOW6 } from './content/figures';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Ce que le درس 3 établit, au mot près du manuel (content/textbook.js), posé au moment où les modules le font vivre :
 *   tarkib-insihabayn  module 1 — deux translations successives = une seule (نشاط 3, la phrase « after » du manuel)
 *   alaqat-shal        module 2 — معارف 4 : AB + BC = AC, la fin du premier est l'origine du second
 *   shuaa-maadum       module 2 — معارف 4 (حالة خاصة) : AA = BB = 0
 *   mutaakisan         module 2 — معارف 5 : AB et BA opposés, BA = −AB
 *   qaidat-mutawazi    module 2 — معارف 6 : AB + AC = AD ⇔ ABDC parallélogramme (D symétrique de A / milieu de [BC])
 *   insha-mumaththil   module 3 — طرائق p. 133 : Chasles OU la règle du parallélogramme pour construire la somme
 * Les réponses du « إختبار أولي » (EG, MP, AE, 5, l'opposé de TR) ne sont dans aucun item.
 */
const Lines = ({ lines }) => (
  <ul className="list-disc ms-5 space-y-1">{lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'tarkib-insihabayn', type: 'concepts', title: 'انسحابان متتابعان', summary: 'الانسحاب الذي شعاعه AB متبوعا بالانسحاب الذي شعاعه BC هو انسحاب واحد شعاعه AC: صورة نقطة بالأول ثم بالثاني هي صورتها بهذا الانسحاب.',
        body: <Lines lines={[ACT3.after]} /> },
    ],
    2: [
      { id: 'alaqat-shal', type: 'regles', title: 'علاقة شال', summary: 'مجموع الشعاعين AB و BC هو الشعاع AC، وتسمى هذه المساواة علاقة شال: نهاية الشعاع الأول هي مبدأ الشعاع الثاني.',
        body: <Lines lines={[KNOW4.sum, REMARKS.chainEnd]} /> },
      { id: 'shuaa-maadum', type: 'concepts', title: 'الشعاع المعدوم', summary: 'إذا انطبقت A على B فإن الشعاع AB هو الشعاع المعدوم، ويرمز إليه بصفر فوقه سهم؛ الشعاعان AA و BB معدومان.',
        body: <Lines lines={[KNOW4.zero, REMARKS.zeroNumber]} /> },
      { id: 'mutaakisan', type: 'concepts', title: 'الشعاعان المتعاكسان', summary: 'مجموع AB و BA هو الشعاع المعدوم: الشعاعان متعاكسان، لهما نفس الطول ونفس المنحى واتجاهان متعاكسان، ونكتب BA يساوي ناقص AB.',
        body: (
          <div className="space-y-2">
            <Lines lines={[KNOW5.text, KNOW5.example]} />
            <GeoFigure {...FIG_KNOW5} />
          </div>
        ) },
      { id: 'qaidat-mutawazi', type: 'regles', title: 'قاعدة متوازي الأضلاع', summary: 'إذا كانت A و B و C ليست على استقامة: مجموع AB و AC هو AD معناه ABDC متوازي أضلاع، أي القطر الصادر من المبدأ المشترك A.',
        body: (
          <div className="space-y-2">
            <Lines lines={[KNOW6.property, KNOW6.remark]} />
            <GeoFigure {...FIG_KNOW6} />
          </div>
        ) },
    ],
    3: [
      { id: 'insha-mumaththil', type: 'methodes', title: METHOD.title, summary: 'لإنشاء ممثل لمجموع شعاعين نستعمل علاقة شال (ننقل الثاني إلى نهاية الأول بشعاع يساويه) أو قاعدة متوازي الأضلاع (شعاعان لهما نفس المبدأ).',
        body: <Lines lines={[METHOD.rule, METHOD.solution[2], METHOD.solution[3]]} /> },
    ],
  },
};
