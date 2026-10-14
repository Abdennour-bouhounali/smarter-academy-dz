import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SELF_12 } from '../content/exercises';

/**
 * Module 9 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE. Le tableau « أقوّم تعلّماتي » 12 (p. 47 :
 * 918, 4805, 120, 3216 sur 2, 3, 4, 5, 9), jamais posé ailleurs dans la leçon, découpé en quatre épreuves d'une règle
 * chacune, plus l'égalité 120 = 4 × 30 + 0 (sens de « يقبل القسمة »). Une الكفاءة principale par épreuve ; toutes les
 * clés sont relues dans le source et recalculées par n % d dans ../content/content.test.js.
 */
const Q = ({ children }) => <span>{children} <SourceTag source={SELF_12.source} /></span>;

export default function Module09Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(9)}
      moduleNumber={9}
      moduleTitle="إختبار أولي"
      moduleSubtitle="خمسة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="6 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={6 * 60}
      timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة دون إجراء القسمة، ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        ahad: { label: 'القسمة على 2 وعلى 5', module: 2 },
        majmu: { label: 'القسمة على 3 وعلى 9', module: 2 },
        rabaa: { label: 'القسمة على 4', module: 3 },
        maana: { label: 'معنى «يقبل القسمة على»', module: 2 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'ahad', requires: ['qabiliya-2-5'],
          prompt: <Q>العدد 4805 يقبل القسمة:</Q>,
          options: ['على 2 فقط', 'على 5 فقط', 'على 2 وعلى 5', 'لا على 2 ولا على 5'], correct: 1, cols: 2,
          explain: <span>رقم آحاده 5: يقبل القسمة على 5، ولا يقبلها على 2 لأنّه فردي.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P1'] },
        },
        {
          id: 'E2', skill: 'majmu', requires: ['qabiliya-9'],
          prompt: <Q>العدد 918 يقبل القسمة:</Q>,
          options: ['على 3 وعلى 9', 'على 3 فقط', 'لا على 3 ولا على 9'], correct: 0, cols: 1,
          explain: <MathText>{'$9 + 1 + 8 = 18$ ، و 18 يقبل القسمة على 9 (إذن على 3 أيضًا).'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P2'] },
        },
        {
          id: 'E3', skill: 'rabaa', requires: ['qabiliya-4'],
          prompt: <Q>العدد 3216 يقبل القسمة:</Q>,
          options: ['على 2 وعلى 4', 'على 2 فقط', 'لا على 2 ولا على 4'], correct: 0, cols: 1,
          explain: <MathText>{'العدد المشكّل من رقميه الأخيرين 16 ، و $16 = 4 \\times 4$ : يقبل القسمة على 4 (وعلى 2 لأنّه زوجي).'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P3'] },
        },
        {
          id: 'E4', skill: 'maana', requires: ['qabiliya-baqi'],
          prompt: <Q>المساواة <MathText>{'$120 = 4 \\times 30 + 0$'}</MathText> تعني أنّ:</Q>,
          options: ['120 يقبل القسمة على 4', '120 لا يقبل القسمة على 4', '4 يقبل القسمة على 120'],
          correct: 0, cols: 1,
          explain: <span>باقي القسمة الإقليدية لـ 120 على 4 معدوم: 120 يقبل القسمة على 4 (وعلى 30).</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P4'] },
        },
        {
          id: 'E5', skill: 'majmu', requires: ['qabiliya-3'],
          prompt: <Q>العدد 4805 يقبل القسمة:</Q>,
          options: ['على 3 وعلى 9', 'على 3 فقط', 'لا على 3 ولا على 9'], correct: 2, cols: 1,
          explain: <MathText>{'$4 + 8 + 0 + 5 = 17$ ، و 17 لا يقبل القسمة على 3 ولا على 9.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['1am_qawaid-qabiliyat-qisma_P2'] },
        },
      ]}
      badges={[
        { id: 'majmu', emoji: '➕', label: 'أقرأ مجموع الأرقام', test: (m) => (m.majmu ?? 0) === 0 },
        { id: 'rabaa', emoji: '🔎', label: 'أنظر إلى الرقمين الأخيرين', test: (m) => (m.rabaa ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت قواعد قابلية القسمة',
        title: 'انتهى درس قواعد قابلية القسمة',
        message: 'تعرف الآن هل يقبل عدد القسمة على 2 ، 3 ، 4 ، 5 أو 9 دون أن تُجري القسمة. الدرس التالي يعلّمك حاصل القسمة العشرية وقيمها المقرّبة.',
        verbs: ['أتعرّف', 'أبرّر', 'أختار'],
        masterBadgeLabel: 'قواعد قابلية القسمة',
      }}
    />
  );
}
