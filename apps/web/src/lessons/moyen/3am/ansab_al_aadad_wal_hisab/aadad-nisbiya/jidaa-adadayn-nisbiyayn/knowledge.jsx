import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « جداء عددين نسبيين » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف et
 * طرائق réécrits). L'addition et la soustraction de relatifs, la distributivité et la distance à zéro ne sont PAS des items ici : ce
 * sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ », rappelés en معارف.
 */
const { repeated, signRule, justify, table, distance } = KNOWLEDGE;
const L = (s) => <p className="text-center" dir="ltr"><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jidaa-jamaa', type: 'vocabulaire', title: 'جداء عدد سالب في عدد موجب', predict: false,
        summary: 'ضرب عدد سالب في عدد طبيعي هو جمع متكرر: (−2) × 3 = (−2) + (−2) + (−2) = −6 ، فالجداء سالب.',
        body: <p><MathText>{repeated.text}</MathText></p>,
      },
      {
        id: 'ishara-jidaa', type: 'regles', title: 'قاعدة الإشارات',
        predictPrompt: 'في سجلّ الكاميرا لاحظتَ سطورًا يكون فيها الطابق موجبًا وأخرى سالبًا. متى يكون جداء عددين نسبيين موجبًا؟ ومتى يكون سالبًا؟ اكتب القاعدة بكلماتك.',
        summary: 'جداء عددين نسبيين لهما الإشارة نفسها موجب، وجداء عددين نسبيين لهما إشارتان مختلفتان سالب.',
        body: (
          <div className="space-y-2">
            {signRule.lines.map((t) => <p key={t}><MathText>{t}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{signRule.examples}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tabrir-tawzi', type: 'regles', title: 'لماذا جداء سالبين موجب؟',
        predictPrompt: 'أكملتَ $(-3) \\times 4 + (-3) \\times (-4) = (-3) \\times 0 = 0$ . ماذا تستنتج عن $(-3) \\times (-4)$ ؟ اشرح في جملة.',
        summary: 'لأنّ k × b + k × (−b) = k × 0 = 0 : العدد الذي يُضاف إلى k × b ليعطي 0 هو k × (−b) ، فإذا كان k × b = −12 كان k × (−b) = 12.',
        body: <p><MathText>{justify.text}</MathText></p>,
      },
      {
        id: 'jadwal-munakhafid', type: 'regles', title: 'جدول جداءات ينقص عاملها الثاني',
        predictPrompt: 'في الجدول $(-4) \\times 3 = -12$ ثم $-8$ ثم $-4$ ثم $0$ . ماذا تتوقع أن يكون $(-4) \\times (-1)$ ؟ ولماذا؟',
        summary: 'كلّما نقص العامل الثاني بـ 1 زاد الجداء بـ 4 : (−4) × (−1) = 4 ثم (−4) × (−2) = 8.',
        body: (
          <div className="space-y-1">
            {table.rows.map((r) => <React.Fragment key={r}>{L(`$${r}$`)}</React.Fragment>)}
            <p className="text-sm text-slate-600"><MathText>{table.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-jidaa', type: 'methodes', title: 'أحسب جداء عددين نسبيين',
        predictPrompt: 'حسبتَ $(-6) \\times 7$ و $(-1{,}5) \\times (-8)$ . ما الخطوتان اللتان اتبعتهما بالترتيب؟ اكتبهما.',
        summary: 'نعيّن إشارة الجداء أوّلًا بقاعدة الإشارات، ثم نضرب المسافتين إلى الصفر.',
        body: (
          <div className="space-y-2">
            <p><MathText>{distance.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.decimal}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jidaa-sifr', type: 'regles', title: 'جداء عدد في الصفر',
        predictPrompt: 'مصعد سرعته 0 لا يتحرك أبدًا. ماذا يساوي $a \\times 0$ لأيّ عدد $a$ ؟',
        summary: 'من أجل كل عدد نسبي a : a × 0 = 0 و 0 × a = 0.',
        body: (
          <div className="space-y-2">
            <p><MathText>{distance.zero}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.zero}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
