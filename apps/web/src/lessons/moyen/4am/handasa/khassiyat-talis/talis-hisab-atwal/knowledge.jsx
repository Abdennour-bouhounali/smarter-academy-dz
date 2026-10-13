import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW1, KNOW2, METHOD_RULE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « خاصية طالس وحساب الأطوال » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 1)  talis-nashat — le texte complété du نشاط 1 (« يسمى هذا النص خاصية طالس ») ;
 *   module 2 (معارف)   khassiyat-talis (معارف 1 : la propriété, ses trois positions, le tableau de
 *                      proportionnalité), adam-tawazi (ملاحظة 1 et 2), muamil-tanasub (معارف 2 : k, تكبير / تصغير) ;
 *   module 3 (طرائق)   hisab-atwal (la طريقة « حساب أطوال », ses gestes nommés — plateforme, déclaré).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'talis-nashat', type: 'concepts', title: 'خاصية طالس (نص النشاط)',
        predictPrompt: "في الساحة وجدتَ أنّ ظلّ كل شيء شاقولي ÷ طوله عدد واحد، وفي الشكل حسبتَ طولين في حالتين: $B'$ و $C'$ على $[AB]$ و $[AC]$ ($AB' = 3{,}2$ و $AB = 6$)، ثم من الجهة الأخرى للنقطة $A$ ($AB' = 1{,}6$ و $AB = 3{,}2$). أكمل النص بكلماتك: إذا كان المستقيمان $(BC)$ و $(B'C')$ متوازيين، فماذا نستنتج عن أطوال المثلثين $AB'C'$ و $ABC$؟",
        summary: 'إذا كانت النقط A و B و B′ على استقامة والنقط A و C و C′ على استقامة، وكان المستقيمان (BC) و (B′C′) متوازيين، فإن النسب AB′/AB و AC′/AC و B′C′/BC متساوية.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY.statement}</MathText></p>
            <p className="text-sm text-slate-600">يسمى هذا النص «خاصية طالس».</p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'khassiyat-talis', type: 'regles', title: 'خاصية طالس',
        predictPrompt: "في النشاط رأيتَ $B'$ و $C'$ بين $A$ و $B$ و $C$، ثم من الجهة الأخرى للنقطة $A$. وماذا لو كانتا أبعد من $B$ و $C$؟ اكتب الخاصية بكلماتك لمستقيمين متقاطعين في $A$ يقطعهما مستقيمان متوازيان $(MN)$ و $(BC)$: أين يمكن أن تقع $M$ و $N$، وما العلاقة بين أطوال المثلثين $AMN$ و $ABC$؟",
        summary: 'مستقيمان متقاطعان في A يقطعهما مستقيمان متوازيان (MN) و (BC): AM/AB = AN/AC = MN/BC، سواء كانت M و N على الضلعين أو على امتدادهما أو من الجهة الأخرى للنقطة A؛ وأطوال المثلثين AMN و ABC متناسبة.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1.property}</MathText></p>
            <p><MathText>{`${KNOW1.results} ${KNOW1.resultsTable}`}</MathText></p>
            <p className="text-sm text-slate-600">{KNOW1.resultsEnd}</p>
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
      {
        id: 'adam-tawazi', type: 'regles', title: 'نسبتان غير متساويتين',
        predictPrompt: "في الشكل $AM = 2$ و $AB = 3$ و $AN = 1$ و $AC = 2$، وفي الساحة رأيت أنّ النسبة بين الظلّ والطول واحدة حين يتوازى الشيئان. قارن $\\dfrac{AM}{AB}$ و $\\dfrac{AN}{AC}$، ثم اكتب القاعدة بكلماتك: متى نستطيع أن نقول إنّ المستقيمين $(MN)$ و $(BC)$ ليسا متوازيين؟",
        summary: 'يكفي عدم تساوي نسبتين من النسب الثلاث للقول إن المستقيمين غير متوازيين؛ وتسمح خاصية طالس بحساب الأطوال والنسب وإثبات عدم توازي مستقيمين.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1.remark1}</MathText></p>
            <p><MathText>{KNOW1.remark2}</MathText></p>
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
      {
        id: 'muamil-tanasub', type: 'concepts', title: 'معامل التناسبية k',
        summary: 'في مثلثين في وضعية طالس تُضرب كل أطوال المثلث ABC في العدد نفسه k لنحصل على أطوال AB′C′؛ إذا كان k أصغر من 1 فهو معامل تصغير، وإذا كان أكبر من 1 فهو معامل تكبير.',
        body: (
          <div className="space-y-1.5">
            {KNOW2.lines.slice(2).map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <SourceTag source={KNOW2.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'hisab-atwal', type: 'methodes', title: 'حساب طول بخاصية طالس',
        predictPrompt: "كشفت حلّ الكتاب سطرًا سطرًا لحساب $DN$ في متوازي الأضلاع. لو أعطيناك شكلًا آخر فيه طول مجهول، فبأيّ خطوات تحسبه؟ اكتب الطريقة بالترتيب.",
        summary: 'نتأكد من وضعية طالس، نكتب النسب الثلاث بالترتيب نفسه، نحتفظ بالمساواة التي فيها الطول المطلوب وثلاثة أطوال معلومة، ثم نحسب بالجداء المتصالب.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">
              {METHOD_RULE.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}
            </ol>
            <SourceTag source={METHOD.source} />
          </div>
        ),
      },
    ],
  },
};
