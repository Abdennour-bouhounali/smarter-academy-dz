import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW3, KNOW2_REMINDER, PROOF_STEPS, METHOD_IMAGE, METHOD_EQUAL, MISTAKES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الشعاعان المتساويان ومتوازي الأضلاع ومنتصف قطعة » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 2 ب)  muntasaf-mushtarak — deux segments de même milieu : AB = CD, même sur une droite ;
 *   module 2 (معارف)     muntasaf-shuaa (معارف 3 : I milieu ⇔ AI = IB) ; mutawazi-shuaa (AB = DC ⇔ ABCD متوازي أضلاع
 *                        ⇔ diagonales de même milieu — rappel du درس 1 — et les étapes de la preuve, plateforme) ;
 *   module 3 (طرائق)     surat-nuqta (l'image d'un point par un انسحاب : compléter le متوازي أضلاع) ; ithbat-tasawi
 *                        (prouver l'égalité de deux vecteurs : un متوازي أضلاع ou un انسحاب).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'muntasaf-mushtarak', type: 'regles', title: 'منتصف مشترك وشعاعان متساويان',
        predictPrompt: 'في النشاط كان للقطعتين $[AD]$ و $[BC]$ نفس المنتصف $O$، ووجدت $\\overrightarrow{AB} = \\overrightarrow{CD}$ رغم أنّ النقط على مستقيم واحد. ماذا تستنتج دائمًا إذا كان لقطعتين نفس المنتصف؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كان للقطعتين [AD] و [BC] نفس المنتصف فإن الشعاعين AB و CD متساويان، حتى لو كانت النقط الأربع على استقامة واحدة (متوازي أضلاع مسطّح).',
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
        id: 'muntasaf-shuaa', type: 'regles', title: 'المنتصف وتساوي شعاعين',
        predictPrompt: 'على الوشاح المقسّم إلى 8 أقسام لم يتساوَ الشعاعان $\\overrightarrow{AI}$ و $\\overrightarrow{IB}$ إلا عندما وقف القائد $I$ عند القسم 4. اكتب القاعدة في الاتجاهين: متى يكون $\\overrightarrow{AI} = \\overrightarrow{IB}$؟ وماذا تكتب بالأشعة إذا علمت أنّ $I$ في هذا الموضع من $[AB]$؟',
        summary: 'I منتصف القطعة [AB] يعني أن الشعاعين AI و IB متساويان، وتساوي الشعاعين AI و IB يعني أن I منتصف [AB].',
        body: (
          <div className="space-y-1.5">
            {KNOW3.property.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p><MathText>{KNOW3.example}</MathText></p>
            <SourceTag source={KNOW3.source} />
          </div>
        ),
      },
      {
        id: 'mutawazi-shuaa', type: 'regles', title: 'متوازي الأضلاع بتساوي شعاعين',
        summary: 'تساوي الشعاعين AB و DC يعني أن الرباعي ABCD متوازي أضلاع وأن قطريه [AC] و [BD] لهما نفس المنتصف؛ لإثبات أن رباعيا متوازي أضلاع نثبت تساوي شعاعين على ضلعين متقابلين مقروءين في الاتجاه نفسه.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW2_REMINDER.property}</MathText></p>
            <p><MathText>{KNOW2_REMINDER.remark}</MathText></p>
            <p><MathText>{MISTAKES.order.text}</MathText></p>
            <ol className="list-decimal space-y-0.5 ps-5">
              {PROOF_STEPS.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}
            </ol>
            <SourceTag source={KNOW2_REMINDER.source} /> <SourceTag source={PROOF_STEPS.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'surat-nuqta', type: 'methodes', title: 'صورة نقطة بانسحاب علم شعاعه',
        predictPrompt: 'على شبكة المدرّج وضعت الركن $D$ بنفسك: عددت المربعات من $A$ إلى $B$ ثم أعدت الحركة من $C$. لو أعطيناك ثلاث نقط $A$ و $B$ و $C$ على ورقة بيضاء دون شبكة، كيف تنشئ صورة $C$ بالانسحاب الذي شعاعه $\\overrightarrow{AB}$؟ اكتب الطريقة: أيّ شكل تكمله، وأيّ نقطة تستعملها؟',
        summary: 'D صورة C بالانسحاب الذي شعاعه AB يعني أن الشعاعين CD و AB متساويان: نكمل متوازي الأضلاع ABDC، أي D نظيرة A بالنسبة إلى منتصف [BC].',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_IMAGE.solution[1]}</MathText></p>
            <p><MathText>{METHOD_IMAGE.solution[3]}</MathText></p>
            <SourceTag source={METHOD_IMAGE.source} />
          </div>
        ),
      },
      {
        id: 'ithbat-tasawi', type: 'methodes', title: 'إثبات تساوي شعاعين',
        predictPrompt: 'في التمرين برهنّا $\\overrightarrow{OD} = \\overrightarrow{BC}$ دون أن نقيس أيّ طول ولا أيّ منحى، انطلاقًا من منتصفين فقط. لو طُلب منك أن تبرهن تساوي شعاعين آخرين، على ماذا تعتمد؟ اكتب الطريقة بكلماتك.',
        summary: 'لإثبات تساوي شعاعين نعتمد على متوازي أضلاع (قطراه متناصفان، أو ضلعان متقابلان) أو على الانسحاب الذي يحوّل مبدأ كل منهما إلى نهايته.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD_EQUAL.rule}</MathText></p>
            {METHOD_EQUAL.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <SourceTag source={METHOD_EQUAL.source} />
          </div>
        ),
      },
    ],
  },
};
