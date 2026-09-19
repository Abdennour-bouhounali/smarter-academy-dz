import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

/**
 * La carte des connaissances du درس 1 — SOURCE UNIQUE des connaissances,
 * construite à partir du contenu du manuel (content/textbook.js). Une
 * <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 */
const [defBaqi, defJidaa] = KNOWLEDGE.definitions;
const [remSiyagh, remWahid, remNafsuh] = KNOWLEDGE.remarks;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qasim-baqi', type: 'concepts', title: 'قاسم عدد طبيعي (بالباقي)',
        summary: 'b قاسم لـ a معناه أن باقي القسمة الإقليدية لـ a على b هو 0.',
        body: (
          <div className="space-y-2">
            <p><MathText>{defBaqi.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{defBaqi.example.text}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qasim-jidaa', type: 'concepts', title: 'قاسم عدد طبيعي (بالجداء)',
        summary: 'b قاسم لـ a معناه يوجد عدد طبيعي q حيث a = b × q.',
        body: (
          <div className="space-y-2">
            <p><MathText>{defJidaa.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{defJidaa.example.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'siyagh-mutakafia', type: 'vocabulaire', title: 'أربع جمل لها نفس المعنى',
        summary: 'b قاسم لـ a · b يقسم a · a يقبل القسمة على b · a مضاعف لـ b.',
        body: (
          <div className="space-y-2">
            <p><MathText>{remSiyagh.text}</MathText></p>
            <ul className="text-sm text-slate-600 list-disc ms-5">{remSiyagh.example.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>
        ),
      },
      {
        id: 'wahid-wa-nafsuh', type: 'memoriser', title: '1 والعدد نفسه قاسمان دائمًا',
        summary: '1 قاسم لكل عدد طبيعي، وكل عدد غير معدوم قاسم لنفسه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{remWahid.text}</MathText></p>
            <p><MathText>{remNafsuh.text}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
