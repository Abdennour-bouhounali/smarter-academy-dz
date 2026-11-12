/**
 * « ورقة نسيبة » — la DERNIÈRE étape du module 7 « وضعية الوحدة » (la synthèse de l'unité 1 dans le lecteur de mission, 2026-11-12 ; recette de
 * la synthèse, point 5). La camarade est inventée (KidFigure, en tenue islamique) ; son prénom n'est porté par AUCUNE autre « ورقة زميل » de la
 * plateforme (content/mission.test.js).
 * Ce n'est PAS une solution : c'est un PLAN, en mots, SANS aucun nombre. Son erreur est une erreur de JUSTIFICATION — « chaque école reçoit le
 * même nombre de tabliers, donc le nombre d'écoles divise le TOTAL » : la condition est « le même nombre DE CHAQUE COULEUR », il divise chacun des
 * deux nombres (un diviseur du total peut laisser des tabliers d'une couleur). Les lignes d'après seraient justes sur une bonne base.
 */
export const PEER_KID = { name: 'نسيبة', figure: { hairStyle: 'hijab', scarf: 'rose', outfit: 'indigo' } };

export const PEER_SHEET = {
  id: 'm7-nasiba',
  task: 'خطّة نسيبة لتوزيع المآزر الورديّة والزرقاء على أكبر عدد من المدارس:',
  lines: [
    'أقرأ: المآزر توزَّع كلّها، ولا يبقى أيّ مئزر.',
    'كل مدرسة تأخذ العدد نفسه من المآزر، إذن عدد المدارس يقسم مجموع المآزر الورديّة والزرقاء.',
    'أبحث عن أكبر قاسم لهذا المجموع بخوارزمية إقليدس.',
    'أقسم عدد المآزر على النتيجة لأعرف ما تأخذه كل مدرسة.',
  ],
  errorLine: 1,
  fixes: [
    { text: 'كل مدرسة تأخذ العدد نفسه من كل لون: عدد المدارس يقسم عدد الورديّة ويقسم عدد الزرقاء، فهو قاسم مشترك لهما، وأكبرها PGCD.', ok: true },
    { text: 'عدد المدارس يقسم الفرق بين عدد الورديّة وعدد الزرقاء.', why: 'الفرق خطوة من خوارزمية الفروق، لا شرط التوزيع: الشرط أن يقسم عدد المدارس كلّ لون وحده.' },
    { text: 'يكفي أن يقسم عدد المدارس عدد المآزر الورديّة.', why: 'قد تبقى مآزر زرقاء: عدد المدارس يجب أن يقسم العددين معًا.' },
  ],
  why: 'قاسم المجموع قد لا يقسم كل لون وحده، فتبقى مآزر من لون وتنقص من الآخر. «العدد نفسه من كل لون» يعني أنّ عدد المدارس يقسم عدد الورديّة ويقسم عدد الزرقاء: قاسم مشترك، والأكبر هو PGCD.',
};
