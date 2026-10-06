import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

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
        // « أتوقّع القاعدة » : ce que l'élève conclut des rayons avant de lire la définition.
        predictPrompt: 'على الرفوف: مع 28 كتابًا في كل رفّ لم يبقَ أيّ كتاب على الأرض، ومع 26 بقيت 4 كتب. متى نقول إنّ عددًا $b$ «قاسم» لعدد $a$؟ اكتب القاعدة بكلماتك.',
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
        predictPrompt: 'على الرفّ: $143 = 11 \\times 13$ ولم يبقَ شيء. كيف تكتب «$b$ قاسم لـ $a$» بمساواة فيها جداء، دون أن تذكر الباقي؟',
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
        predictPrompt: 'هل العدد 1 قاسم لكل عدد طبيعي؟ وهل كل عدد قاسم لنفسه؟ جرّب بأعداد مختلفة (مثلًا 7 ، 20 ، 143) ثم اكتب ما تستنتجه.',
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
