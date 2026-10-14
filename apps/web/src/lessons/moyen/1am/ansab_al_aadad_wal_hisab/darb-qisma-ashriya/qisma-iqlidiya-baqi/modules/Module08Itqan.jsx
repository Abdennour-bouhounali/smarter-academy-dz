import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';

/**
 * Module 8 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE. Cinq épreuves du manuel : « أقوّم تعلّماتي »
 * 7 et 8 (p. 47, jamais posés ailleurs dans la leçon), l'exercice 18 هـ) (4486 ÷ 7, non posé au module 3), l'exemple de
 * معارف 2 (les noms) et l'exercice 20 sous un autre angle (les plateaux PLEINS). Une الكفاءة principale par épreuve.
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (s) => <MathText key={s}>{s}</MathText>;

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
        injaz: { label: 'إنجاز القسمة الإقليدية', module: 2 },
        musawat: { label: 'المساواة والأسماء', module: 2 },
        tawzif: { label: 'توظيف القسمة في مشكلة', module: 1 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'injaz', requires: ['qisma-amudiya'],
          prompt: <Q source={src('self-8', 47, 'أقوّم تعلّماتي', 8)}>حاصل وباقي القسمة الإقليدية للعدد 143 على 5 هما:</Q>,
          options: ['الحاصل 28 والباقي 3', 'الحاصل 3 والباقي 28', 'الحاصل 27 والباقي 8'],
          correct: 0, cols: 1,
          explain: <MathText>{'$143 = 5 \\times 28 + 3$ مع $3 < 5$. (27 و 8 : الباقي 8 أكبر من 5.)'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qisma-iqlidiya-baqi_P1'] },
        },
        {
          id: 'E2', skill: 'musawat', requires: ['qisma-mufradat'],
          prompt: <Q source={src('self-7', 47, 'أقوّم تعلّماتي', 7)}>المساواة <MathText>{'$145 = 15 \\times 9 + 10$'}</MathText> صحيحة. باقي القسمة الإقليدية للعدد:</Q>,
          options: ['145 على 9 هو 10', '145 على 15 هو 10', '145 على 10 هو 9'],
          correct: 1, cols: 1,
          explain: <MathText>{'$10 < 15$ : المساواة قسمة إقليدية لـ 145 على 15. أمّا على 9 فالباقي 10 أكبر من 9 ($145 = 9 \\times 16 + 1$).'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qisma-iqlidiya-baqi_P2'] },
        },
        {
          id: 'E3', skill: 'musawat', requires: ['qisma-mufradat'],
          prompt: <Q source={src('know-2', 41, 'أوظّف تعلّماتي', 2)}>في المساواة <MathText>{'$253 = 17 \\times 14 + 15$'}</MathText> التي تعبّر عن قسمة 253 على 17 ، العدد 17 هو:</Q>,
          options: ['المقسوم عليه', 'الحاصل', 'الباقي', 'المقسوم'],
          correct: 0, cols: 2,
          explain: <span>المقسوم 253، المقسوم عليه 17، الحاصل 14، الباقي 15.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qisma-iqlidiya-baqi_P2'] },
        },
        {
          id: 'E4', skill: 'tawzif', requires: ['qisma-iqlidiya'],
          prompt: <Q source={src('ex-20', 46, 'أتمرّن', 20)}>وضع مربي دواجن 123 بيضة في أطباق من 30 خانة. كم طبقًا مملوءًا كلّه؟</Q>,
          options: ['4', '5', '3'],
          correct: 0, cols: 3,
          explain: <MathText>{'$123 = 30 \\times 4 + 3$ : 4 أطباق مملوءة، والطبق الخامس فيه 3 بيضات فقط.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qisma-iqlidiya-baqi_P3'] },
        },
        {
          id: 'E5', skill: 'injaz', requires: ['qisma-amudiya'],
          prompt: <Q source={src('ex-18', 46, 'أتمرّن', 18)}>أيّ مساواة تعبّر عن القسمة الإقليدية للعدد 4486 على 7؟</Q>,
          options: [M('$4486 = 7 \\times 640 + 6$'), M('$4486 = 7 \\times 64 + 6$'), M('$4486 = 7 \\times 639 + 13$')],
          correct: 0, cols: 1,
          explain: <MathText>{'$7 \\times 640 = 4480$ و $4486 - 4480 = 6 < 7$. ($7 \\times 64 + 6 = 454$ ، والصفر منسيّ في الحاصل؛ و 13 أكبر من 7.)'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qisma-iqlidiya-baqi_P1'] },
        },
      ]}
      badges={[
        { id: 'injaz', emoji: '➗', label: 'أنجز القسمة الإقليدية', test: (m) => (m.injaz ?? 0) === 0 },
        { id: 'tawzif', emoji: '💐', label: 'أفهم الحاصل والباقي في مشكلة', test: (m) => (m.tawzif ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت القسمة الإقليدية',
        title: 'انتهى درس القسمة الإقليدية',
        message: 'تعرف الآن كيف تجد الحاصل والباقي وتكتب a = b × q + r مع r < b. الدرس التالي يعلّمك كيف تعرف أنّ الباقي معدوم دون أن تقسم: قواعد قابلية القسمة.',
        verbs: ['أقسم', 'أحصر', 'أكتب', 'أفسّر'],
        masterBadgeLabel: 'القسمة الإقليدية',
      }}
    />
  );
}
