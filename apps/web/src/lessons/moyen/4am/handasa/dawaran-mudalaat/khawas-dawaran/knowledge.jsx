import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOW3, PERP, METHOD, NOW155, CENTER } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « خواص الدوران وتوظيفها في الأشكال الهندسية » — SOURCE UNIQUE.
 *
 *   module 1 (le papier calque)   thabat-dawaran — ce que la feuille qui tourne garde et ce qu'elle change (la
 *                                 situation de la plateforme, nommée après le geste) ;
 *   module 2 (معارف 3 + ajout)    khawas-dawaran (la propriété du manuel, p. 154), zawiya-sura (une droite et son image :
 *                                 l'angle α ; 90° ⇒ ⊥, 180° ⇒ ∥ — معارف من المنصّة) ;
 *   module 3 (طرائق p. 155)       istimal-khawas (prouver AC = BD et (BD) ⊥ (AC) par un دوران), surat-zawiya (l'image
 *                                 d'un angle, دوري الآن), markaz-dawaran (le centre : deux médiatrices — معارف من المنصّة).
 *
 * « أتوقّع القاعدة » (2026-10-06) : chaque règle prédictible a son `predictPrompt` (ancré sur le geste du laboratoire),
 * sauf khawas-dawaran, RAPPEL au module 2 (thabat-dawaran l'a déjà fait écrire au module 1) ; istimal-khawas est
 * prédite par la <PredictRule> qui enveloppe la solution du manuel (Module03Taraiq).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'thabat-dawaran', type: 'concepts', title: 'ما يبقى وما يتغيّر',
        predictPrompt: 'طبعت نسخًا للبتلة $ABC$ وأنت تدير الورقة حول الدبوس، وقارنت كلّ نسخة بالبتلة سطرًا سطرًا على اللوحة. اكتب بكلماتك: ما الذي لا يتغيّر أبدًا مهما أدرت الورقة، وما الذي يتغيّر؟',
        summary: 'حين تدور الورقة الشفافة حول دبوسها لا يتغيّر طول ولا زاوية ولا مساحة ولا استقامية؛ يتغيّر موضع الشكل ومنحى مستقيماته فقط. والورقة الممطّطة تغيّر الأطوال، فليست دورانا.',
        body: (
          <div className="space-y-1.5">
            <p>{ACTIVITY.closing}</p>
            <p>الورقة الممطّطة تغيّر الطول والزاوية والمساحة: ما تعطيه ليس صورة بدوران.</p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'khawas-dawaran', type: 'regles', title: KNOW3.title,
        summary: 'الدوران يحافظ على الأطوال، وعلى استقامية النقط، وعلى أقياس الزوايا، وعلى المساحات.',
        body: (
          <div className="space-y-1.5">
            <p className="font-semibold">{KNOW3.property}</p>
            <ul className="list-disc space-y-0.5 ps-5">{KNOW3.items.map((l) => <li key={l}>{l}</li>)}</ul>
            <p className="text-sm"><MathText>{KNOW3.example}</MathText></p>
            <SourceTag source={KNOW3.source} />
          </div>
        ),
      },
      {
        id: 'zawiya-sura', type: 'regles', title: PERP.title,
        predictPrompt: 'على اللوحة قرأت «الزاوية بين المستقيمين» $(AB)$ و $(A\'B\')$ : $60^\\circ$ للنسخة الأولى من الوردة، ثم أدرت الورقة $90^\\circ$ و $180^\\circ$ . كيف ترتبط الزاوية بين مستقيم وصورته بزاوية الدوران؟ وما وضع المستقيمين في هاتين الحالتين؟',
        summary: 'المستقيم وصورته بدوران زاويته ألفا يصنعان زاوية ألفا: صورة مستقيم بدوران زاويته قائمة تعامده، وبدوران زاويته مستقيمة (نصف دورة) توازيه.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{PERP.text}</MathText></p>
            <ul className="list-disc space-y-0.5 ps-5">{PERP.cases.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
            <SourceTag source={PERP.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'istimal-khawas', type: 'methodes', title: METHOD.title,
        predictPrompt: 'في المستوى «متقدم» أدرت نسخة $[AC]$ حول $O$ حتى انطبقت على $[BD]$ ، ثم أثبتّ $AC = BD$ و $(BD) \\perp (AC)$ ببطاقات الخواص. لو أعطيناك قطعتين أخريين وطُلب منك أن تثبت أنهما متقايستان ومتعامدتان، بأيّ خطوات تبدأ؟ اكتب الطريقة.',
        summary: 'لإثبات تقايس قطعتين أو تعامد مستقيمين نبيّن أن إحدى القطعتين صورة الأخرى بدوران نعيّن مركزه وزاويته، ثم نطبّق خواص الدوران.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">{METHOD.solution.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ol>
            <p className="text-sm"><MathText>{METHOD.remark}</MathText></p>
            <SourceTag source={METHOD.source} />
          </div>
        ),
      },
      {
        id: 'surat-zawiya', type: 'methodes', title: 'صورة زاوية بدوران',
        predictPrompt: 'وجدت قيس صورة الزاوية $\\widehat{AOB}$ دون أن ترسمها. لو طُلب منك أن ترسمها فعلًا بالدوران الذي مركزه $K$ وزاويته $60^\\circ$ ، هل تدير كلّ نقط ضلعيها؟ أيّ النقط تكفي، وكيف تكمل الرسم؟ اكتب الطريقة.',
        summary: 'لإنشاء صورة زاوية بدوران ننشئ صور رأسها ونقطتين من ضلعيها؛ والصورة زاوية لها نفس القيس لأن الدوران يحافظ على الزوايا.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{NOW155.answer}</MathText></p>
            <SourceTag source={NOW155.source} />
          </div>
        ),
      },
      {
        id: 'markaz-dawaran', type: 'methodes', title: CENTER.title,
        predictPrompt: 'في آخر المستوى «متقدم» (التمرين 18) كان الدبوس مخفيًّا، ولم يكن أمامك إلا نقط وصورها. على أيّ خطّ يقع مركز دوران يحوّل $M$ إلى $M\'$ ، ولماذا؟ وكيف تعيّن المركز نفسه بالضبط؟',
        summary: 'مركز الدوران على نفس البعد من كل نقطة ومن صورتها: هو نقطة تقاطع محوري قطعتين تصل كل منهما نقطة بصورتها.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">{CENTER.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ol>
            <p className="text-sm text-orange-800"><MathText>{CENTER.warning}</MathText></p>
            <SourceTag source={CENTER.source} />
          </div>
        ),
      },
    ],
  },
};
