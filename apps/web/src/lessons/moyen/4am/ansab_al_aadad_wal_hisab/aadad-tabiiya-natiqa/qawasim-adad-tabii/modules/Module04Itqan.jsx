import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';

const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const qcm = (n) => src('qcm', 16, 'أؤكّد تعلّماتي', n);

/** Module 4 — إختبار أولي : QCM 3, 4, 5 (p. 16), طريقة 105 (p. 11), exercices 11 et 7 (p. 14). */
export default function Module04Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX} navLinks={getNavLinks(4)} moduleNumber={4}
      moduleTitle="إختبار أولي" moduleSubtitle="ست أسئلة تُقيّم ما تعلّمته" estimatedTime="9 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={9 * 60} timerLabel="9 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الستة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ jidaa: { label: 'جداء عاملين', module: 1 }, istintaj: { label: 'استنتاج القواسم', module: 1 }, tariqa: { label: 'طريقة الاختبار حتى √a', module: 2 }, qawaid: { label: 'قواعد قابلية القسمة', module: 2 } }}
      epreuves={[
        { id: 'E1', skill: 'istintaj', requires: ['jidaa-aamilayn'], prompt: <Q source={qcm(3)}>قواسم العدد <MathText>{'$121$'}</MathText> هي ...</Q>,
          options: ['11 ؛ 121', '1 ؛ 11', '1 ؛ 11 ؛ 121'], correct: 2, cols: 1,
          explain: <span><MathText>{'$121 = 1 \\times 121 = 11 \\times 11$'}</MathText>: ثلاثة قواسم (11 مرة واحدة).</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qawasim-adad-tabii_P2'] } },
        { id: 'E2', skill: 'istintaj', requires: ['jidaa-aamilayn'], prompt: <Q source={qcm(4)}>قواسم العدد <MathText>{'$34$'}</MathText> هي ...</Q>,
          options: ['1 ؛ 2 ؛ 17 ؛ 34', '2 ؛ 17', '1 ؛ 2 ؛ 17'], correct: 0, cols: 1,
          explain: <span><MathText>{'$34 = 1 \\times 34 = 2 \\times 17$'}</MathText>: كل عامل قاسم، ولا ننسى 1 والعدد نفسه.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qawasim-adad-tabii_P2'] } },
        { id: 'E3', skill: 'jidaa', requires: ['jidaa-aamilayn'], prompt: <Q source={qcm(5)}>قواسم العدد <MathText>{'$7 \\times 2^3$'}</MathText> هي ...</Q>,
          options: ['2 ؛ 7', '1 ؛ 2 ؛ 4 ؛ 8 ؛ 7 ؛ 14 ؛ 28 ؛ 56', '8 ؛ 7'], correct: 1, cols: 1,
          explain: <span><MathText>{'$56 = 1 \\times 56 = 2 \\times 28 = 4 \\times 14 = 7 \\times 8$'}</MathText>: ثمانية قواسم.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qawasim-adad-tabii_P1'] } },
        { id: 'E4', skill: 'tariqa', requires: ['tariqa-qawasim'], prompt: <Q source={src('method-divisors', 11, 'طرائق')}>للبحث عن قواسم العدد <MathText>{'$105$'}</MathText>، نختبر قابلية قسمته على الأعداد ...</Q>,
          options: ['من 1 إلى 10، لأن 10² ≤ 105 < 11²', 'من 1 إلى 105', 'من 1 إلى 52', 'الأعداد الأولية فقط'], correct: 0, cols: 1,
          explain: <span>كل قاسم أكبر من 10 هو الناتج في قسمة ذات باقٍ معدوم على عدد أصغر من 10 أو يساويه.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qawasim-adad-tabii_P3'] } },
        { id: 'E5', skill: 'tariqa', requires: ['tariqa-qawasim'], prompt: <Q source={src('method-divisors', 11, 'طرائق')}>من المساواة <MathText>{'$105 = 7 \\times 15$'}</MathText> نستنتج أن قاسمَي 105 هما ...</Q>,
          options: ['7 و 15', '7 فقط', '15 فقط', '7 و 8'], correct: 0, cols: 2,
          explain: <span>في حالة الباقي المعدوم، كلا المقسوم عليه (7) والناتج (15) قاسمان للعدد.</span>,
          assessment: { enabled: true, type: 'assessment', learningPoints: [{ code: '4am_qawasim-adad-tabii_P1', role: 'primary' }, { code: '4am_qawasim-adad-tabii_P3', role: 'secondary' }] } },
        { id: 'E6', skill: 'qawaid', requires: ['qawaid-qisma'], prompt: <Q source={src('ex-11', 14, 'أوظّف تعلّماتي', 11)}>أي عدد من الأعداد التالية يقبل القسمة على 3 وعلى 5 في آن واحد؟</Q>,
          options: ['375', '275', '370', '175'], correct: 0, cols: 2,
          explain: <span>رقم الوحدات 0 أو 5، ومجموع الأرقام مضاعف لـ 3: <MathText>{'$3 + 7 + 5 = 15$'}</MathText>.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qawasim-adad-tabii_P4'] } },
      ]}
      badges={[{ id: 'jadwal', emoji: '🧮', label: 'أكتب كل الجداءات', test: (m) => (m.jidaa ?? 0) + (m.istintaj ?? 0) === 0 }, { id: 'jidhr', emoji: '√', label: 'أعرف أين أتوقف', test: (m) => (m.tariqa ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أتقنت تعيين قواسم عدد طبيعي', title: 'انتهى الدرس 2', message: 'تعرف الآن كيف تعيّن كل قواسم عدد دون أن تنسى واحدًا. الدرس 3 يدرس خواص هذه القواسم.', verbs: ['أكتب', 'أستنتج', 'أختبر', 'أُسرّع'], masterBadgeLabel: 'قواسم عدد طبيعي' }}
    />
  );
}
