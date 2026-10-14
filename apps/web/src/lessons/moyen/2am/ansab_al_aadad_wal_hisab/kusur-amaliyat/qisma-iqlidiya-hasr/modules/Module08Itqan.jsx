import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { addition } from '../../_unit/unitMeta';

/**
 * Module 8 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE. Le manuel n'a pas d'autre épreuve sur la division
 * euclidienne que celles déjà posées dans la leçon : cinq épreuves de la plateforme « على منوال » les examens du 1er
 * trimestre, avec des nombres jamais vus dans la leçon (déclarées). Une الكفاءة principale par épreuve, chacune couverte.
 */
const Q = ({ children }) => <span>{children} <SourceTag source={addition('exam_style_problem')} /></span>;
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
        qisma: { label: 'القسمة الإقليدية على أيّ عدد', module: 2 },
        hasr: { label: 'حصر حاصل القسمة', module: 1 },
        qabiliya: { label: 'الباقي المعدوم', module: 2 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'qisma', requires: ['qisma-taarif'],
          prompt: <Q>أيّ مساواة تعبّر عن القسمة الإقليدية للعدد 2500 على 60؟</Q>,
          options: [M('$2500 = 60 \\times 41 + 40$'), M('$2500 = 60 \\times 40 + 100$'), M('$2500 = 60 \\times 42 - 20$')],
          correct: 0, cols: 1,
          explain: <MathText>{'$60 \\times 41 = 2460$ و $2500 - 2460 = 40 < 60$. (الباقي 100 أكبر من 60 ؛ والطرح لا يكتب قسمة إقليدية.)'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['2am_qisma-iqlidiya-hasr_P1'] },
        },
        {
          id: 'E2', skill: 'qisma', requires: ['hasr-tariqa'],
          prompt: <Q>حاصل وباقي القسمة الإقليدية للعدد 1000 على 23 هما:</Q>,
          options: ['الحاصل 11 والباقي 43', 'الحاصل 42 والباقي 34', 'الحاصل 43 والباقي 11'],
          correct: 2, cols: 1,
          explain: <MathText>{'$23 \\times 43 = 989$ و $1000 - 989 = 11 < 23$. (مع 42 يبقى 34 ، و 34 أكبر من 23.)'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['2am_qisma-iqlidiya-hasr_P1'] },
        },
        {
          id: 'E3', skill: 'hasr', requires: ['hasr-hasil'],
          prompt: <Q>أيّ حصر صحيح لحاصل القسمة <MathText>{'$\\frac{500}{14}$'}</MathText> ؟</Q>,
          options: [M('$10 < \\frac{500}{14} < 11$'), M('$35 < \\frac{500}{14} < 36$'), M('$34 < \\frac{500}{14} < 35$')],
          correct: 1, cols: 1,
          explain: <MathText>{'$500 = 14 \\times 35 + 10$ : $14 \\times 35 < 500 < 14 \\times 36$ ، أي $35 < \\frac{500}{14} < 36$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['2am_qisma-iqlidiya-hasr_P2'] },
        },
        {
          id: 'E4', skill: 'hasr', requires: ['qiyam-muqarraba'],
          prompt: <Q>يحضر 230 تلميذًا عرضًا مسرحيًا في قاعة صفوفها من 24 مقعدًا، ويجلسون صفًّا بعد صفّ. كم صفًّا يشغلون؟</Q>,
          options: ['9', '14', '10'],
          correct: 2, cols: 3,
          explain: <MathText>{'$230 = 24 \\times 9 + 14$ : 9 صفوف مملوءة، والتلاميذ الـ 14 الباقون يشغلون صفًّا عاشرًا — القيمة المقرّبة بالزيادة.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['2am_qisma-iqlidiya-hasr_P2'] },
        },
        {
          id: 'E5', skill: 'qabiliya', requires: ['qabiliya'],
          prompt: <Q>نعلم أنّ <MathText>{'$1176 = 24 \\times 49$'}</MathText> . أيّ جملة صحيحة؟</Q>,
          options: [M('1176 يقسم 24'), M('24 يقسم 1176 ، و $\\frac{1176}{24} = 49$'), M('$49 < \\frac{1176}{24} < 50$')],
          correct: 1, cols: 1,
          explain: <MathText>{'الباقي معدوم: 1176 مضاعف لـ 24 ، و 24 يقسم 1176 ، والحاصل عدد طبيعي، فلا يُحصر بين 49 و 50 بل يساوي 49.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['2am_qisma-iqlidiya-hasr_P3'] },
        },
      ]}
      badges={[
        { id: 'qisma', emoji: '➗', label: 'أقسم على أيّ عدد', test: (m) => (m.qisma ?? 0) === 0 },
        { id: 'hasr', emoji: '🥚', label: 'أحصر حاصل القسمة', test: (m) => (m.hasr ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت القسمة الإقليدية وحصر الحاصل',
        title: 'انتهى درس القسمة الإقليدية وحصر حاصل القسمة',
        message: 'تعرف الآن أنّ a ÷ b يقع بين عددين طبيعيين متتاليين، إلّا إذا كان الباقي معدومًا. الدرس التالي يحصره بدقّة أكبر: إلى 0,1 وإلى 0,01.',
        verbs: ['أقسم', 'أحصر', 'أقرّب', 'أعلّل'],
        masterBadgeLabel: 'حصر حاصل القسمة',
      }}
    />
  );
}
