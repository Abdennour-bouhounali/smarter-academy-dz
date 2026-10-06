import React from 'react';
import MathText from '../../../../../common/components/MathText';
import WordFraction from '../../../../../common/components/WordFraction';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, ACTIVITY_2, ACT3, KNOW1, KNOW2, METHOD_RULE, METHODS } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « النسب المثلثية لزاوية حادة في مثلث قائم » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 1 و 2)  cos-nashat — جيب التمام nommé par le نشاط 1 (AC/BC = cos C) ;
 *                          nisab-zawiya — le نشاط 2 : AC/BC et AC/AB ne dépendent que de l'angle, nommés sin et tan ;
 *   module 2 (معارف)       jayb (معارف 1 + le rappel du cosinus), thill (معارف 2, l'exemple corrigé),
 *                          qiyam-madbuta (valeur exacte / valeur approchée), hudud (نشاط 3 2) + les remarques) ;
 *   module 3 (طرائق)       hisab-tul (les trois طرائق, leurs gestes nommés — plateforme, déclaré).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'cos-nashat', type: 'concepts', title: 'جيب تمام زاوية حادة',
        summary: 'في المثلث ABC القائم في A، النسبة AC على BC (المجاور للزاوية C على الوتر) تسمى جيب تمام الزاوية C ويرمز إليها cos C.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <p><WordFraction lhs="$\cos\widehat{C}$" num="طول الضلع المجاور" den="طول الوتر" /></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
      {
        id: 'nisab-zawiya', type: 'regles', title: 'نسب لا تتعلق إلا بالزاوية',
        predictPrompt: 'بنيت منحدرات بالزاوية $\\widehat{B} = 40^{\\circ}$ وألواحها مختلفة الطول (4 ثم 6 ثم 8)، ثم أدرت الزاوية. ما الذي يغيّر النسبتين $\\dfrac{AC}{BC}$ و $\\dfrac{AC}{AB}$ ، وما الذي لا يغيّرهما؟ اكتب القاعدة بكلماتك.',
        summary: 'في كل المثلثات القائمة في A التي لها الزاوية B نفسها، النسبتان AC على BC و AC على AB هما نفسهما: الأولى جيب الزاوية B والثانية ظلها، ولا تتعلقان بطول الأضلاع.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY_2.conjecture}</MathText></p>
            <p><MathText>{ACTIVITY_2.naming}</MathText></p>
            <SourceTag source={ACTIVITY_2.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'jayb', type: 'concepts', title: 'جيب زاوية حادة',
        predictPrompt: 'أتممت $\\sin\\widehat{B}$ في المثلث $ABC$ بالعبارات: الضلع المقابل، الضلع المجاور، الوتر. لو أعطيناك أيّ مثلث قائم وزاوية حادة فيه، كيف تحسب جيبها؟ وكيف تحسب جيب تمامها؟ اكتب التعريفين بكلماتك.',
        summary: 'في مثلث قائم، جيب زاوية حادة يساوي طول الضلع المقابل لها مقسوما على طول الوتر؛ وجيب تمامها يساوي طول الضلع المجاور لها مقسوما على طول الوتر.',
        body: (
          <div className="space-y-1.5">
            <p>{KNOW1.definition}</p>
            <p><WordFraction lhs="$\sin\widehat{B}$" num={KNOW1.num} den={KNOW1.den} /></p>
            <p><MathText>{KNOW1.example}</MathText></p>
            <p><MathText>{KNOW1.reminder}</MathText></p>
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
      {
        id: 'thill', type: 'concepts', title: 'ظل زاوية حادة',
        predictPrompt: 'أتممت $\\tan\\widehat{B}$ في المثلث $ABC$ بعبارات الأضلاع. اكتب تعريف ظل زاوية حادة في أيّ مثلث قائم، ثم فكّر: هل يمكن أن يكون الظل أكبر من 1؟ متى؟',
        summary: 'في مثلث قائم، ظل زاوية حادة يساوي طول الضلع المقابل لها مقسوما على طول الضلع المجاور لها؛ وهو عدد موجب قد يكون أكبر من 1.',
        body: (
          <div className="space-y-1.5">
            <p>{KNOW2.definition}</p>
            <p><WordFraction lhs="$\tan\widehat{B}$" num={KNOW2.num} den={KNOW2.den} /></p>
            <p><MathText>{KNOW2.example}</MathText></p>
            <p>{KNOW2.remark}</p>
            <SourceTag source={KNOW2.source} />
          </div>
        ),
      },
      {
        id: 'qiyam-madbuta', type: 'concepts', title: 'القيمة المضبوطة والقيمة المقربة',
        // Deux NOMS (valeur exacte / approchée) que le manuel pose deux fois avant la brique (معارف 1 à l'étape 2, les
        // remarques de معارف 2 juste avant) : une convention de vocabulaire, rien à conclure.
        predict: false,
        summary: 'نسبة أطوال تُكتب بقيمتها المضبوطة (مثل 3 على جذر 13، أو جذر 3 على 3)، والحاسبة تعطي قيمة مقربة نُدوّرها بالدقة المطلوبة (0,83 و 0,58).',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1.exact}</MathText></p>
            {KNOW2.remarks.map((r) => <p key={r}><MathText>{r}</MathText></p>)}
            <SourceTag source={KNOW1.source} />
          </div>
        ),
      },
      {
        id: 'hudud', type: 'regles', title: 'الجيب وجيب التمام بين 0 و 1',
        predictPrompt: 'قرأت على المنحدر $\\cos 25^{\\circ} \\approx 0{,}91$ و $\\cos 75^{\\circ} \\approx 0{,}26$ ، ومع $40^{\\circ}$ نسبة $\\dfrac{AC}{BC} \\approx 0{,}64$ . بين أيّ عددين يقع دائما جيب زاوية حادة وجيب تمامها؟ اكتب القاعدة وعلّلها بمقارنة أطوال أضلاع المثلث القائم.',
        summary: 'الأطوال موجبة تماما والوتر أطول أضلاع المثلث القائم، فالجيب وجيب التمام لزاوية حادة عددان محصوران تماما بين 0 و 1، والظل عدد موجب.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{'$0 < \\sin\\widehat{B} < 1$ و $0 < \\cos\\widehat{B} < 1$'}</MathText></p>
            <p><MathText>{ACT3.bounds}</MathText></p>
            <p><MathText>{KNOW1.remark}</MathText></p>
            <SourceTag source={ACT3.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'hisab-tul', type: 'methodes', title: 'حساب طول ضلع بنسبة مثلثية',
        predictPrompt: 'رأيت $BC = \\dfrac{2{,}5}{\\sin 25^{\\circ}}$ ثم $RS = 3{,}5 \\times \\cos 37^{\\circ}$ ثم $FG = 4{,}5 \\times \\tan 53^{\\circ}$ . لو أعطيناك مثلثا قائما آخر فيه زاوية حادة وطول ضلع، بأيّ خطوات تحسب طول ضلع آخر؟ متى تضرب ومتى تقسم؟ اكتب الطريقة.',
        summary: 'نسمّي الضلع المعلوم والضلع المطلوب بالنسبة إلى الزاوية المعلومة، نختار النسبة التي تجمعهما، نعزل الطول المطلوب (نضرب إذا كان في البسط ونقسم إذا كان في المقام)، ثم نحسب ولا ندوّر إلا النتيجة.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">
              {METHOD_RULE.lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}
            </ol>
            <SourceTag source={METHODS.sin.source} />
          </div>
        ),
      },
    ],
  },
};
