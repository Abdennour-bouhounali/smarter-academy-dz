import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, PROOF_STEPS, METHOD_PROOF, CONCLUSIONS, CONSTRUCT, MIDPOINT_OPPOSITE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Ce que le درس 4 établit. Le manuel n'a pas de معارف pour cette leçon : sa طريقة (p. 133) est citée telle quelle ;
 * le reste est une formalisation DÉCLARÉE de la plateforme (`knowledge_formalization`, content/textbook.js), posée au
 * moment où les modules la font vivre.
 *   rabt-shal           module 1 — on raccorde deux vecteurs CONSÉCUTIFS (fin = début) ; l'ordre de la somme est libre
 *   taawid-musawi       module 1 — on remplace un vecteur par un vecteur égal que les DONNÉES garantissent
 *   mutaakisan-sifr     module 1 — deux opposés : le vecteur nul
 *   shakl-la-yubarhin   module 1 — une égalité lue sur la figure n'est pas une preuve
 *   khatawat-burhan     module 2 — traduire · transformer · conclure
 *   tariqat-abdc        module 2 — la طريقة du manuel : AB = CD ⇔ ABDC متوازي أضلاع
 *   istintajat          module 2 — ce qu'une égalité vectorielle permet de conclure (parallélogramme, milieu, alignement, parallèles)
 *   insha-majmu         module 3 — construire le représentant d'une somme de plusieurs vecteurs
 *   surat-daira         module 3 — l'image d'un cercle par une translation
 *   muntasaf-mutaakisan module 4 — un milieu par deux vecteurs opposés (ex-23)
 * « أتوقّع القاعدة » (2026-10-06) : un predictPrompt par règle gatée ; mutaakisan-sifr, tariqat-abdc et muntasaf-mutaakisan
 * sont posées en RAPPEL par leur brique (leçons 2–3) ; les modules enveloppent dans <PredictRule> les questions / boîtes
 * qui énoncent la règle juste avant sa brique.
 * Les réponses du « إختبار أولي » (R, S, T ; EFGH ; UVWX ; N, P, Q ; le drone ; Ω) ne sont dans aucun item.
 */
const Lines = ({ lines }) => (
  <ul className="list-disc ms-5 space-y-1">{lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>
);

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'rabt-shal', type: 'regles', title: 'نربط شعاعين متتابعين', predictPrompt: 'في المترو قبل القطار أن يربط التذكرتين $\\overrightarrow{BC}$ و $\\overrightarrow{AB}$ في رحلة واحدة. متى يمكن أن نجمع تذكرتين في تذكرة واحدة؟ وهل يهمّ ترتيبهما في المجموع؟ اكتب القاعدة بكلماتك.', summary: 'نجمع شعاعين بعلاقة شال إذا كانت نهاية الأول هي مبدأ الثاني؛ ترتيب الحدود في المجموع لا يهم، فنرتّبها لتتتابع.',
        body: <Lines lines={[REMARKS.shalRule]} /> },
      { id: 'taawid-musawi', type: 'regles', title: 'نعوّض بشعاع يساويه', predictPrompt: 'في الرحلة 2 لم ترتبط $\\overrightarrow{AB}$ و $\\overrightarrow{AD}$ ، فنقلت إحدى التذكرتين إلى محطة أخرى. متى يحقّ لنا أن نضع شعاعًا مكان شعاع آخر في عبارة؟ ومن أين نأخذ هذا الحقّ؟ اكتب القاعدة.', summary: 'إذا لم يتتابع شعاعان نعوّض أحدهما بشعاع يساويه تضمنه المعطيات: متوازي أضلاع، منتصف، أو تعريف نقطة.',
        body: <Lines lines={[REMARKS.swapRule, REMARKS.rabtRight]} /> },
      { id: 'mutaakisan-sifr', type: 'regles', title: 'شعاعان متعاكسان', summary: 'مجموع شعاعين متعاكسين هو الشعاع المعدوم، فنحذفهما من العبارة؛ والشعاع المعدوم لا يغيّر المجموع.',
        body: <Lines lines={[REMARKS.zeroRule]} /> },
      { id: 'shakl-la-yubarhin', type: 'regles', title: 'الشكل لا يبرهن', predictPrompt: 'في المستوى المتقدّم بدا على الشكل أنّ $\\overrightarrow{OL} = \\overrightarrow{AC}$ ، لكنّ المختبر لم يقبل أن تستعمل ذلك. ما الذي يحقّ لنا أن نستعمله في برهان، وما الذي لا يكفي؟ اكتب القاعدة.', summary: 'ما نراه على الشكل يوحي ولا يثبت: لا نستعمل في البرهان إلا المعطيات والخواص المعروفة.',
        body: <Lines lines={[REMARKS.seeWhy, REMARKS.seeRight]} /> },
    ],
    2: [
      { id: 'khatawat-burhan', type: 'methodes', title: PROOF_STEPS.title, predictPrompt: 'في المترو وصلت من $\\overrightarrow{OL}$ إلى $\\overrightarrow{AC}$ خطوة خطوة. لو طُلب منك أن تبرهن أنّ نقطة منتصف قطعة أو أنّ رباعيًا متوازي أضلاع، بأيّ خطوات تبدأ ثم تتابع ثم تنتهي؟ اكتب الطريقة.', summary: 'نترجم المطلوب إلى مساواة شعاعية، نحوّل أحد طرفيها خطوة خطوة بعلاقة شال وبالمعطيات، ثم نستنتج الخاصية الهندسية.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">{PROOF_STEPS.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ol>
        ) },
      { id: 'tariqat-abdc', type: 'methodes', title: METHOD_PROOF.title, summary: 'لإثبات أن شعاعين AB و CD متساويان يكفي إثبات أن الرباعي ABDC متوازي أضلاع، مثلا لأن قطريه متناصفان.',
        body: <Lines lines={[METHOD_PROOF.rule]} /> },
      { id: 'istintajat', type: 'regles', title: CONCLUSIONS.title, predictPrompt: 'في طريقة الكتاب استنتجنا خاصية هندسية من $\\overrightarrow{AI} = \\overrightarrow{ID}$ . ماذا تستنتج من $\\overrightarrow{AB} = \\overrightarrow{DC}$ ؟ ومن $\\overrightarrow{AB} = \\overrightarrow{BC}$ ؟ وهل تكفي $\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}$ لنقول إنّ $B$ تقع على $[AC]$ ؟', summary: 'من مساواة شعاعية نستنتج متوازي أضلاع، أو منتصف قطعة، أو استقامية ثلاث نقط، أو توازي مستقيمين؛ أما علاقة شال وحدها فلا تثبت استقامية.',
        body: <Lines lines={[...CONCLUSIONS.lines, CONCLUSIONS.warning]} /> },
    ],
    3: [
      { id: 'insha-majmu', type: 'methodes', title: CONSTRUCT.title, predictPrompt: 'في المختبر أوصلت القطار من المحطة E بالتذكرتين $\\overrightarrow{AB}$ و $\\overrightarrow{AC}$ . لو أعطيناك ثلاثة أشعة ونقطة انطلاق M ، كيف تنشئ ممثّل مجموعها الذي يبدأ من M ؟ اكتب الطريقة.', summary: 'نرسم ممثّلات الأشعة متتابعة، كل واحد من نهاية السابق، فتكون النهاية الأخيرة نهاية ممثّل المجموع.',
        body: <Lines lines={CONSTRUCT.lines} /> },
      { id: 'surat-daira', type: 'regles', title: 'صورة دائرة بانسحاب', predictPrompt: 'في المختبر نقلت مركز الدائرة (Γ) من E إلى $E_1$ بانسحاب. ماذا يحدث لنصف قطرها؟ كيف تعيّن صورة دائرة بانسحاب؟ اكتب القاعدة.', summary: 'صورة دائرة بانسحاب دائرة لها نفس نصف القطر، ومركزها صورة المركز.',
        body: <Lines lines={[CONSTRUCT.circle]} /> },
    ],
    4: [
      { id: 'muntasaf-mutaakisan', type: 'regles', title: 'منتصف بشعاعين متعاكسين', summary: 'إذا كان الشعاعان من A نحو K ومن A نحو L متعاكسين فإن A منتصف القطعة [KL].',
        body: <Lines lines={[MIDPOINT_OPPOSITE]} /> },
    ],
  },
};
