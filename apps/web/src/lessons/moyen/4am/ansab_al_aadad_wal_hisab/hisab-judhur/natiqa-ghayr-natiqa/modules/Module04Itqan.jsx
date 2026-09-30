import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';

/**
 * Module 4 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la
 * leçon. Aucun item du QCM « أؤكّد تعلّماتي » (p. 28) n'est attribué à ce درس :
 * cinq épreuves construites sur les nombres du manuel — نشاط 2, معارف 2,
 * « √2 » (p. 30) et l'exercice 10 — chacune rattachée à UN point d'apprentissage.
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module04Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="إختبار أولي"
      moduleSubtitle="خمسة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="6 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={6 * 60}
      timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        tamyiz: { label: 'التمييز بين ناطق وغير ناطق', module: 2 },
        murabba: { label: 'جذور مربعات الأعداد الناطقة', module: 1 },
        ghayr: { label: 'جذور غير ناطقة وقيمها المقرّبة', module: 3 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'tamyiz', requires: ['murabba-natiq', 'ghayr-natiq'],
          prompt: <Q source={src('know-2', 22, 'معارف', 2)}>أيّ العددين <MathText>{'$\\sqrt{\\dfrac{25}{9}}$'}</MathText> و <MathText>{'$\\sqrt{6}$'}</MathText> عدد ناطق؟</Q>,
          options: [
            <span key="a"><MathText>{'$\\sqrt{\\dfrac{25}{9}}$'}</MathText> فقط</span>,
            <span key="b"><MathText>{'$\\sqrt{6}$'}</MathText> فقط</span>,
            <span key="c">كلاهما عدد ناطق</span>,
            <span key="d">لا أحد منهما عدد ناطق</span>,
          ],
          correct: 0, cols: 2,
          explain: <span><MathText>{'$\\dfrac{25}{9} = \\left(\\dfrac{5}{3}\\right)^2$'}</MathText> إذن <MathText>{'$\\sqrt{\\dfrac{25}{9}} = \\dfrac{5}{3}$'}</MathText> عدد ناطق؛ ولا يوجد عدد ناطق مربعه 6، إذن <MathText>{'$\\sqrt{6}$'}</MathText> عدد غير ناطق.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_natiqa-ghayr-natiqa_P1'] },
        },
        {
          id: 'E2', skill: 'murabba', requires: ['murabba-natiq'],
          prompt: <Q source={src('act-2', 20, 'أنشطة', 2)}>أيّ عدد من الأعداد الآتية مربع لعدد ناطق، فجذره عدد ناطق؟</Q>,
          options: ['100', '13', '7', '6'],
          correct: 0, cols: 2,
          explain: <span><MathText>{'$10^2 = 100$'}</MathText> إذن <MathText>{'$\\sqrt{100} = 10$'}</MathText>؛ أما 13 و 7 و 6 فليست مربعات لأعداد ناطقة.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_natiqa-ghayr-natiqa_P2'] },
        },
        {
          id: 'E3', skill: 'murabba', requires: ['murabba-natiq'],
          prompt: <Q source={src('act-2', 20, 'أنشطة', 2)}>ما قيمة <MathText>{'$\\sqrt{169}$'}</MathText>؟</Q>,
          options: [M('$13$'), M('$84{,}5$'), M('$\\sqrt{169}$ ليس عددًا ناطقًا'), M('$28561$')],
          correct: 0, cols: 2,
          explain: <span><MathText>{'$13^2 = 169$'}</MathText> و 13 عدد موجب، إذن <MathText>{'$\\sqrt{169} = 13$'}</MathText>: 169 مربع لعدد ناطق.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_natiqa-ghayr-natiqa_P2'] },
        },
        {
          id: 'E4', skill: 'ghayr', requires: ['ghayr-natiq'],
          prompt: <Q source={src('ict-sqrt2', 30, 'أوظّف تكنولوجيات الإعلام والاتصال')}>تعرض الحاسبة للعدد <MathText>{'$\\sqrt{2}$'}</MathText> القيمة 1,414213562. إذن:</Q>,
          options: [
            <span key="a">1,414213562 قيمة مقرّبة للعدد <MathText>{'$\\sqrt{2}$'}</MathText>، لأن <MathText>{'$\\sqrt{2}$'}</MathText> ليس عددًا ناطقًا</span>,
            <span key="b"><MathText>{'$\\sqrt{2} = 1{,}414213562$'}</MathText> بالضبط</span>,
            <span key="c"><MathText>{'$\\sqrt{2}$'}</MathText> عدد ناطق لأنه يساوي عددًا عشريًا</span>,
          ],
          correct: 0, cols: 1,
          explain: <span>2 ليس مربعًا لعدد ناطق، إذن <MathText>{'$\\sqrt{2}$'}</MathText> ليس عددًا ناطقًا ولا يساوي أيّ عدد عشري؛ و <MathText>{'$1{,}414213562^2 = 1{,}999999998944727844$'}</MathText>.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_natiqa-ghayr-natiqa_P3'] },
        },
        {
          id: 'E5', skill: 'ghayr', requires: ['ghayr-natiq', 'qima-muqarraba'],
          prompt: <Q source={src('ex-10', 26, 'أوظّف تعلّماتي', 10)}>القيمتان المقرّبتان إلى الجزء من 10 للعدد <MathText>{'$\\sqrt{12}$'}</MathText>، بالنقصان ثم بالزيادة، هما:</Q>,
          options: ['3,4 و 3,5', '3,5 و 3,6', '6 و 6,1', '3,3 و 3,4'],
          correct: 0, cols: 2,
          explain: <span><MathText>{'$3{,}4^2 = 11{,}56 < 12 < 12{,}25 = 3{,}5^2$'}</MathText> إذن <MathText>{'$3{,}4 < \\sqrt{12} < 3{,}5$'}</MathText>؛ و 6 هو نصف 12 لا جذره.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_natiqa-ghayr-natiqa_P3'] },
        },
      ]}
      badges={[
        { id: 'natiq', emoji: '🔍', label: 'أميّز الجذر الناطق', test: (m) => (m.tamyiz ?? 0) === 0 && (m.murabba ?? 0) === 0 },
        { id: 'muqarraba', emoji: '📏', label: 'أحصر جذرًا غير ناطق', test: (m) => (m.ghayr ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت التمييز بين الأعداد الناطقة والأعداد غير الناطقة',
        title: 'انتهى الدرس 2',
        message: 'تعرف الآن متى يكون الجذر التربيعي عددًا ناطقًا، وكيف تحصر جذرًا غير ناطق بقيم مقرّبة. الدرس 3 يحلّ المعادلات من الشكل x² = a.',
        verbs: ['أصنّف', 'أحسب', 'أميّز', 'أحصر'],
        masterBadgeLabel: 'ناطق أم غير ناطق',
      }}
    />
  );
}
