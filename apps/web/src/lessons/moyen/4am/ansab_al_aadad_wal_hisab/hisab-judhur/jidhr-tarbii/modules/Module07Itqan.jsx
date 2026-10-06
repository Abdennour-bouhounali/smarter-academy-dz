import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';

/**
 * Module 7 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la
 * leçon. Cinq épreuves : les QCM 1, 2 et 3 de « أؤكّد تعلّماتي » (p. 28 —
 * extraction → destinations.qcm.items « 1-3 »), et deux épreuves sur le
 * symbole, tirées de معارف 1 (p. 22) et de l'encadré de نشاط 1 (p. 20).
 * Chacune porte UN point d'apprentissage ; P1, P2 et P3 sont tous couverts.
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module07Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(7)}
      moduleNumber={7}
      moduleTitle="إختبار أولي"
      moduleSubtitle="خمسة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="6 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={6 * 60}
      timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        taarif: { label: 'تعريف الجذر التربيعي', module: 1 },
        ramz: { label: 'الرمز وقراءته', module: 1 },
        khawass: { label: 'مربع الجذر وجذر المربع', module: 2 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'taarif', requires: ['jidhr-taarif'],
          prompt: <Q source={src('qcm', 28, 'أؤكّد تعلّماتي', 1)}>الجذر التربيعي للعدد 0,25 هو .......</Q>,
          options: [M('$0{,}5$'), M('$-0{,}5$'), M('$0{,}05$')],
          optionLabel: (i) => ['0,5', '−0,5', '0,05'][i],
          correct: 0, cols: 3,
          explain: <MathText>{'0,5 عدد موجب و $0{,}5^2 = 0{,}25$. أمّا $-0{,}5$ فسالب، و $0{,}05^2 = 0{,}0025$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_jidhr-tarbii_P1'] },
        },
        {
          id: 'E2', skill: 'ramz', requires: ['jidhr-taarif'],
          prompt: <Q source={src('know-1', 22, 'معارف', 1)}>كيف نقرأ <MathText>{'$\\sqrt{7}$'}</MathText> ؟</Q>,
          options: ['مربع العدد 7', 'الجذر التربيعي للعدد 7', 'نصف العدد 7'],
          correct: 1, cols: 1,
          explain: <MathText>{'نرمز للجذر التربيعي للعدد $a$ بالرمز $\\sqrt{a}$ ونقرأ: «الجذر التربيعي لـ $a$». مربع العدد 7 يُكتب $7^2$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_jidhr-tarbii_P2'] },
        },
        {
          id: 'E3', skill: 'ramz', requires: ['qima-mudbuta'],
          prompt: <Q source={src('act-1', 20, 'أنشطة', 1)}>نرمز للقيمة المضبوطة للعدد الموجب الذي مربعه 5 بـ:</Q>,
          options: [M('$5^2$'), M('$2{,}236067978$'), M('$\\sqrt{5}$'), M('$-\\sqrt{5}$')],
          optionLabel: (i) => ['5²', '2,236067978', '√5', '−√5'][i],
          correct: 2, cols: 2,
          explain: <MathText>{'$\\sqrt{5}$ هو القيمة المضبوطة؛ 2,236067978 قيمة مقربة فقط لأن مربّعها ليس 5، و $-\\sqrt{5}$ سالب.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_jidhr-tarbii_P2'] },
        },
        {
          id: 'E4', skill: 'khawass', requires: ['jidhr-murabba'],
          prompt: <Q source={src('qcm', 28, 'أؤكّد تعلّماتي', 2)}><MathText>{'$\\sqrt{3^2}$'}</MathText> يساوي ........</Q>,
          options: [M('$\\sqrt{3}$'), M('$3$'), M('$2\\sqrt{3}$')],
          optionLabel: (i) => ['√3', '3', '2√3'][i],
          correct: 1, cols: 3,
          explain: <MathText>{'3 عدد موجب: $\\sqrt{3^2} = 3$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_jidhr-tarbii_P3'] },
        },
        {
          id: 'E5', skill: 'khawass', requires: ['jidhr-murabba'],
          prompt: <Q source={src('qcm', 28, 'أؤكّد تعلّماتي', 3)}><MathText>{'$\\sqrt{(-2)^2}$'}</MathText> يساوي ........</Q>,
          options: [M('$-2$'), M('$2$'), M('$4$')],
          optionLabel: (i) => ['−2', '2', '4'][i],
          correct: 1, cols: 3,
          explain: <MathText>{'$(-2)^2 = 4$ و $\\sqrt{4} = 2$: الجذر التربيعي عدد موجب دائمًا.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_jidhr-tarbii_P3'] },
        },
      ]}
      badges={[
        { id: 'taarif', emoji: '√', label: 'أعرف ما هو الجذر التربيعي', test: (m) => (m.taarif ?? 0) === 0 },
        { id: 'khawass', emoji: '🔁', label: 'مربع الجذر وجذر المربع', test: (m) => (m.khawass ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت الجذر التربيعي لعدد موجب',
        title: 'انتهى الدرس 1',
        message: 'تعرف الآن أن الجذر التربيعي لعدد موجب هو العدد الموجب الذي مربّعه هذا العدد. الدرس 2 يميّز الجذور الناطقة من غير الناطقة.',
        verbs: ['أعرّف', 'أرمز', 'أقرأ', 'أحسب'],
        masterBadgeLabel: 'الجذر التربيعي',
      }}
    />
  );
}
