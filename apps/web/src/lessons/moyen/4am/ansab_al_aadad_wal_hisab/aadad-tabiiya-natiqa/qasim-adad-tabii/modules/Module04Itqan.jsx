import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { CompleteView } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';

/**
 * Module 4 — إتقان (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la
 * leçon. Cinq épreuves, chacune tirée d'un élément du manuel (QCM 1–2 de
 * « أؤكّد تعلّماتي » p. 16, exemples de معارف 1 p. 10, activité 2 p. 8) et
 * rattachée à ses points d'apprentissage. Les nombres sont ceux du livre.
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;

export default function Module04Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="إتقان"
      moduleSubtitle="خمس أسئلة تُقيّم ما تعلّمته"
      estimatedTime="7 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={7 * 60}
      timerLabel="7 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        baqi: { label: 'قاسم بالباقي المعدوم', module: 1 },
        jidaa: { label: 'قاسم بالمساواة a = b × q', module: 2 },
        siyagh: { label: 'الصيغ المتكافئة', module: 2 },
        wahid: { label: '1 والعدد نفسه', module: 2 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'baqi', requires: ['qasim-baqi'],
          prompt: <Q source={src('qcm', 16, 'أؤكّد تعلّماتي', 1)}>في القسمة الإقليدية للعدد <MathText>{'$72$'}</MathText> على <MathText>{'$5$'}</MathText> ...</Q>,
          options: ['حاصل القسمة يساوي 14 والباقي 2', 'حاصل القسمة هو 2 والباقي 14', 'حاصل القسمة هو 72 والباقي 5'],
          correct: 0, cols: 1,
          explain: <span><MathText>{'$72 = 5 \\times 14 + 2$'}</MathText>؛ الباقي 2 ليس معدومًا، إذن 5 ليس قاسمًا للعدد 72.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-adad-tabii_P1'] },
        },
        {
          id: 'E2', skill: 'baqi', requires: ['qasim-baqi'],
          prompt: <Q source={src('qcm', 16, 'أؤكّد تعلّماتي', 2)}>في القسمة الإقليدية للعدد <MathText>{'$84$'}</MathText> على <MathText>{'$12$'}</MathText> ...</Q>,
          options: ['حاصل القسمة هو 7 والباقي 12', 'حاصل القسمة هو 7 والباقي 0', 'حاصل القسمة هو 7 والباقي 10'],
          correct: 1, cols: 1,
          explain: <span><MathText>{'$84 = 12 \\times 7 + 0$'}</MathText>: الباقي معدوم، إذن 12 قاسم للعدد 84.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-adad-tabii_P1'] },
        },
        {
          id: 'E3', skill: 'jidaa', requires: ['qasim-jidaa'],
          prompt: <Q source={src('know-1', 10, 'معارف', 1)}>أي مساواة تبيّن أن <MathText>{'$6$'}</MathText> قاسم للعدد <MathText>{'$120$'}</MathText>؟</Q>,
          options: ['$120 = 6 \\times 20$', '$120 = 6 \\times 19 + 6$', '$6 = 120 \\times 0 + 6$', '$120 = 6 + 114$'].map((o) => <MathText key={o}>{`$${o.slice(1, -1)}$`}</MathText>),
          optionLabel: (i) => ['120 = 6 × 20', '120 = 6 × 19 + 6', '6 = 120 × 0 + 6', '120 = 6 + 114'][i],
          correct: 0, cols: 2,
          explain: <span>«b قاسم لـ a» معناه يوجد عدد طبيعي q حيث <MathText>{'$a = b \\times q$'}</MathText>: هنا <MathText>{'$q = 20$'}</MathText>.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-adad-tabii_P2'] },
        },
        {
          id: 'E4', skill: 'siyagh', requires: ['siyagh-mutakafia'],
          prompt: <Q source={src('know-1', 10, 'معارف', 1)}>أي جملة ليس لها نفس معنى «<MathText>{'$6$'}</MathText> قاسم للعدد <MathText>{'$120$'}</MathText>»؟</Q>,
          options: ['6 يقسم 120', '120 يقبل القسمة على 6', '6 مضاعف للعدد 120', '120 مضاعف للعدد 6'],
          correct: 2, cols: 2,
          explain: <span>المضاعف هو 120 (الأكبر): 120 مضاعف للعدد 6، وليس العكس.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-adad-tabii_P3'] },
        },
        {
          id: 'E5', skill: 'wahid', requires: ['wahid-wa-nafsuh'],
          prompt: <Q source={src('act-2', 8, 'أنشطة', 2)}>ما هي قواسم العدد <MathText>{'$17$'}</MathText>؟</Q>,
          options: ['1 و 17', '17 فقط', '1 فقط', 'لا قواسم له'],
          correct: 0, cols: 2,
          explain: <span>1 قاسم لكل عدد طبيعي (<MathText>{'$17 = 1 \\times 17$'}</MathText>)، وكل عدد غير معدوم قاسم لنفسه.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-adad-tabii_P4'] },
        },
      ]}
      badges={[
        { id: 'qasim', emoji: '🔢', label: 'أعرف ما هو القاسم', test: (m) => (m.baqi ?? 0) === 0 },
        { id: 'lugha', emoji: '🗣️', label: 'أربع جمل، معنى واحد', test: (m) => (m.siyagh ?? 0) === 0 },
      ]}
      synthese={<CompleteView />}
      completion={{
        masterTitle: 'أتقنت التعرّف على قاسم لعدد طبيعي',
        title: 'انتهى الدرس 1',
        message: 'تعرف الآن متى يكون عدد قاسمًا لعدد آخر، بالباقي أو بالجداء. الدرس 2 يبحث كل قواسم عدد.',
        verbs: ['أتعرّف', 'أكتب', 'أعبّر', 'أتذكّر'],
        masterBadgeLabel: 'قاسم عدد طبيعي',
      }}
    />
  );
}
