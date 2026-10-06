import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { addition } from '../../_unit/unitMeta';
import { QCM } from '../content/textbook';

/**
 * Module 8 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la leçon.
 * Cinq épreuves : les items 1 et 2 de « أؤكّد تعلّماتي » (p. 52, extraction › qcm ›
 * duplicatedIn › muadala-ula) et trois équations de la plateforme sur le modèle des
 * exercices 1, 4 et 6 (p. 50). Chaque épreuve évalue UN point d'apprentissage ; P1 et P2
 * sont couverts. Chaque distracteur est faux (b/a renversé, coefficient retranché, signe
 * oublié en transposant, distributivité incomplète).
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (s) => <MathText key={s}>{s}</MathText>;
const PLATFORM = addition('interaction_generation');

export default function Module08Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(8)}
      moduleNumber={8}
      moduleTitle="إختبار أولي"
      moduleSubtitle="خمسة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="6 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={6 * 60}
      timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        hal: { label: 'حل المعادلة ax = b', module: 2 },
        naql: { label: 'نقل المجاهيل والمعاليم وتجميع الحدود', module: 3 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'naql', requires: ['tariqat-hal'],
          prompt: <Q source={QCM[1].source}>حل المعادلة <MathText>{'$-2 + x = 5$'}</MathText> هو...</Q>,
          options: [M('$2$'), M('$7$'), M('$3$')],
          correct: 1, cols: 3,
          explain: <MathText>{QCM[1].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_muadala-ula_P2'] },
        },
        {
          id: 'E2', skill: 'hal', requires: ['hal-ax-b'],
          prompt: <Q source={QCM[2].source}>حل المعادلة <MathText>{'$4x = 5x$'}</MathText> هو ...</Q>,
          options: [M('$\\dfrac{5}{4}$'), M('$0$'), M('$\\dfrac{4}{5}$')],
          correct: 1, cols: 3,
          explain: <MathText>{QCM[2].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_muadala-ula_P1'] },
        },
        {
          id: 'E3', skill: 'hal', requires: ['hal-ax-b'],
          prompt: <Q source={PLATFORM}>حل المعادلة <MathText>{'$5x = -3$'}</MathText> هو</Q>,
          options: [M('$-\\dfrac{5}{3}$'), M('$-8$'), M('$-\\dfrac{3}{5}$'), M('$\\dfrac{3}{5}$')],
          correct: 2, cols: 4,
          explain: <MathText>{'$x = \\dfrac{-3}{5} = -\\dfrac{3}{5}$ ، وللتحقّق $5 \\times \\left(-\\dfrac{3}{5}\\right) = -3$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_muadala-ula_P1'] },
        },
        {
          id: 'E4', skill: 'naql', requires: ['tariqat-hal'],
          prompt: <Q source={PLATFORM}>بنقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر، تُكتب المعادلة <MathText>{'$6x - 4 = 2x + 8$'}</MathText> على الشكل</Q>,
          options: [M('$8x = 12$'), M('$4x = 4$'), M('$4x = 12$'), M('$4x = -12$')],
          correct: 2, cols: 2,
          explain: <MathText>{'نطرح $2x$ من الطرفين ونضيف 4: $6x - 2x = 8 + 4$ أي $4x = 12$ (ومنه $x = 3$).'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_muadala-ula_P2'] },
        },
        {
          id: 'E5', skill: 'naql', requires: ['tariqat-hal', 'nashr-tabsit'],
          prompt: <Q source={PLATFORM}>حل المعادلة <MathText>{'$3(x - 2) = x + 4$'}</MathText> هو</Q>,
          options: [M('$3$'), M('$-1$'), M('$\\dfrac{5}{2}$'), M('$5$')],
          correct: 3, cols: 4,
          explain: <MathText>{'$3x - 6 = x + 4$ ، أي $2x = 10$ ومنه $x = 5$ ؛ وللتحقّق $3 \\times (5 - 2) = 9 = 5 + 4$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_muadala-ula_P2'] },
        },
      ]}
      badges={[
        { id: 'hal', emoji: '⚖️', label: 'b على a', test: (m) => (m.hal ?? 0) === 0 },
        { id: 'naql', emoji: '↔️', label: 'العملية نفسها على الطرفين', test: (m) => (m.naql ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت حل معادلة من الدرجة الأولى',
        title: 'انتهى الدرس 1',
        message: 'تعرف الآن كيف تحلّ معادلة من الدرجة الأولى بمجهول واحد: العملية نفسها على الطرفين حتى الشكل ax = b، ثم الحل b/a.',
        verbs: ['أوازن', 'أنقل', 'أجمع', 'أقسم', 'أتحقّق'],
        masterBadgeLabel: 'حل معادلة من الدرجة الأولى',
      }}
    />
  );
}
