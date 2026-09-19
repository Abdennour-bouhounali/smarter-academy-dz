import React from 'react';
import MathText from '../../../../../common/components/MathText';
/** Rappels seulement : une synthèse n'introduit rien (LESSON_CONTRACT : le test final ne doit rien introduire de neuf). */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qabiliyat-10', type: 'regles', title: 'تذكير: القسمة على 10 و 4 و 8', summary: 'مضاعف 10 آحاده 0؛ القسمة على 4 و 8 تُقرأ من الرقمين والثلاثة الأخيرة.',
        body: <p>كل عدد مضاعف للعدد 10 رقم آحاده 0 (مساعدة الكتاب). ويقبل عدد القسمة على 4 إذا قبِل العدد المكوّن من رقميه الأخيرين ذلك، وعلى 8 إذا قبِل العدد المكوّن من أرقامه الثلاثة الأخيرة ذلك.</p> },
      { id: 'tarmiz-bi-huruf', type: 'methodes', title: 'تذكير: الترميز لأرقام عدد بحروف', summary: 'عدد من أربعة أرقام يُكتب 1000a + 100b + 10c + d.',
        body: <p>الكتاب يقترح كتابة العدد المطلوب على الشكل <MathText>{'$1000a + 100b + 10c + d$'}</MathText> ثم استغلال باقي المعطيات: <MathText>{'$b = c = 2a$'}</MathText> و <MathText>{'$d = 0$'}</MathText>.</p> },
    ],
  },
};
