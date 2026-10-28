import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** Ce qui CHANGE dans une règle de la fiche `memo` (rouge). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

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
        memo: {
          rule: `b\\mid a\\iff a=b\\times q+${R('0')}`,
          hook: 'الباقي معدوم يعني قاسم',
          example: `420=28\\times15+${R('0')}`,
          trap: 'الباقي غير المعدوم ليس قاسمًا: 26 لا يقسم 420',
          exam: 'أقسم ثم أقرأ الباقي: إن كان معدومًا فالعدد قاسم',
          chip: `b\\mid a\\iff r=${R('0')}`,
          quiz: [
            { q: 'باقي قسمة $420$ على $28$ هو $0$. إذن:', options: ['$28$ ليس قاسمًا للعدد $420$', '$28$ قاسم للعدد $420$', '$420$ قاسم للعدد $28$'], correct: 1 },
            { q: '$420 = 26 \\times 16 + 4$. هل $26$ قاسم للعدد $420$؟', options: ['نعم، لأنّ $26$ عدد زوجي', 'نعم، لأنّ حاصل القسمة $16$', 'لا، لأنّ الباقي $4$ غير معدوم'], correct: 2 },
          ],
        },
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
        memo: {
          rule: `b\\mid a\\iff a=b\\times${R('q')}`,
          hook: 'جداء يعني قاسمان',
          example: `143=11\\times${R('13')}`,
          trap: 'خلط القاسم بالمضاعف: الجداء مضاعف لكل عامل فيه',
          exam: 'أكتب العدد جداءً لعددين طبيعيين فيظهر القاسمان',
          chip: `a=b\\times${R('q')}`,
          quiz: [
            { q: '$143 = 11 \\times 13$. القاسمان اللذان تظهرهما المساواة هما:', options: ['$11$ فقط', '$11$ و $13$', '$143$ و $11$'], correct: 1 },
            { q: '$120 = 6 \\times 20$. العدد $120$ هو:', options: ['قاسم للعدد $6$', 'قاسم للعدد $20$ فقط', 'مضاعف للعدد $6$'], correct: 2 },
          ],
        },
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
        memo: {
          rule: `b\\mid a\\iff a=${R('b\\times q')}`,
          hook: 'أربع جمل، معنى واحد',
          example: `6\\mid120\\iff120=6\\times${R('20')}`,
          trap: 'قلب الاتجاه: القاسم هو الأصغر والمضاعف هو الأكبر',
          exam: 'أكتب الجملة المطلوبة بصيغة القاسم أو بصيغة المضاعف دون تغيير معناها',
          chip: `b\\mid a`,
          quiz: [
            { q: 'أيّ جملة لا تفيد أنّ $6$ قاسم للعدد $120$؟', options: ['$6$ مضاعف للعدد $120$', '$120$ يقبل القسمة على $6$', '$6$ يقسم $120$'], correct: 0 },
            { q: '$120$ مضاعف للعدد:', options: ['$240$', '$1200$', '$6$'], correct: 2 },
          ],
        },
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
        memo: {
          rule: `${R('1')}\\mid a\\quad\\quad a\\mid ${R('a')}`,
          hook: 'واحد والعدد نفسه، دائمًا',
          example: `${R('1')}\\mid143\\quad143\\mid ${R('143')}`,
          trap: 'نسيان القاسمين الأوّلين عند سرد القواسم: 1 والعدد نفسه',
          exam: 'أبدأ سرد القواسم بالعدد 1 وأنتهي بالعدد نفسه',
          chip: `${R('1')}\\mid a,\\ a\\mid ${R('a')}`,
          quiz: [
            { q: 'قواسم العدد $7$ هي:', options: ['$7$ فقط', '$1$ فقط', '$1$ و $7$'], correct: 2 },
            { q: 'أيّ عدد قاسم لكل عدد طبيعي؟', options: ['$2$', '$1$', '$0$'], correct: 1 },
          ],
        },
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
