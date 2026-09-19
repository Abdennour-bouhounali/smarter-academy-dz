import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { CompleteView } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';

const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
/** Module 5 — إتقان : exemples de معارف 2 (p. 10), exercices 12, 14 (p. 14), méthode p. 11. */
export default function Module05Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX} navLinks={getNavLinks(5)} moduleNumber={5}
      moduleTitle="إتقان" moduleSubtitle="خمس أسئلة تُقيّم ما تعلّمته" estimatedTime="7 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={7 * 60} timerLabel="7 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ jamaa: { label: 'المجموع والفرق', module: 2 }, mudaaf: { label: 'المضاعفات', module: 2 }, baqi: { label: 'باقي القسمة', module: 2 }, burhan: { label: 'البرهنة', module: 3 } }}
      epreuves={[
        { id: 'E1', skill: 'jamaa', requires: ['khassiya-1'], prompt: <Q source={src('know-2', 10, 'معارف', 2)}>9 يقسم 90 ويقسم 900. إذن 9 يقسم حتمًا ...</Q>,
          options: ['810 و 990', '900 + 9 فقط', '90 × 900 فقط', 'لا شيء آخر'], correct: 0, cols: 2,
          explain: <span>القاسم المشترك يقسم الفرق <MathText>{'$900 - 90 = 810$'}</MathText> والمجموع <MathText>{'$900 + 90 = 990$'}</MathText>.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_khawass-qawasim_P1'] } },
        { id: 'E2', skill: 'jamaa', requires: ['khassiya-1'], prompt: <Q source={src('ex-12', 14, 'أوظّف تعلّماتي', 12)}>3 يقسم كلا من 471 و 192. ماذا نستنتج بالنسبة إلى <MathText>{'$471 - 192$'}</MathText> و <MathText>{'$471 + 192$'}</MathText>؟</Q>,
          options: ['كلاهما يقبل القسمة على 3', 'الفرق فقط يقبل القسمة على 3', 'المجموع فقط يقبل القسمة على 3', 'لا يمكن الاستنتاج دون حساب'], correct: 0, cols: 1,
          explain: <span>خاصية 1، دون أي حساب: 279 و 663 يقبلان القسمة على 3.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_khawass-qawasim_P1'] } },
        { id: 'E3', skill: 'mudaaf', requires: ['khassiya-1'], prompt: <Q source={src('ex-14', 14, 'أوظّف تعلّماتي', 14)}><MathText>{'$217 = 7 \\times 31$'}</MathText>. إذن 7 من قواسم ...</Q>,
          options: ['21 700 000', '217 + 1', '218', '7 × 31 + 5'], correct: 0, cols: 2,
          explain: <span><MathText>{'$21\\,700\\,000 = 217 \\times 100\\,000$'}</MathText>: مضاعف لعدد يقسمه 7.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_khawass-qawasim_P2'] } },
        { id: 'E4', skill: 'baqi', requires: ['khassiya-2'], prompt: <Q source={src('know-2', 10, 'معارف', 2)}>5 يقسم كلا من 90 و 25. باقي القسمة الإقليدية للعدد 90 على 25 ...</Q>,
          options: ['هو 15 ويقبل القسمة على 5', 'هو 15 ولا يقبل القسمة على 5', 'هو 3', 'هو 0'], correct: 0, cols: 1,
          explain: <span><MathText>{'$90 = 25 \\times 3 + 15$'}</MathText>؛ خاصية 2: القاسم المشترك يقسم الباقي.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_khawass-qawasim_P3'] } },
        { id: 'E5', skill: 'burhan', requires: ['ithbat-qasim'], prompt: <Q source={src('method-proof', 11, 'طرائق')}>لإثبات أن عددًا طبيعيًا <MathText>{'$d$'}</MathText> يقسم عددًا <MathText>{'$m$'}</MathText> يكفي ...</Q>,
          options: ['إيجاد عدد طبيعي k حيث m = d × k', 'التحقّق من أن m أكبر من d', 'إيجاد عدد طبيعي k حيث d = m × k', 'التحقّق من أن m + d يقبل القسمة على d'], correct: 0, cols: 1,
          explain: <span>هذه هي جملة الطريقة في الكتاب: نفرض الشرط ونصل إلى <MathText>{'$m = d \\times k$'}</MathText>.</span>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_khawass-qawasim_P4'] } },
      ]}
      badges={[{ id: 'khawass', emoji: '🧩', label: 'أستعمل الخاصيتين', test: (m) => (m.jamaa ?? 0) + (m.baqi ?? 0) === 0 }, { id: 'burhan', emoji: '✍️', label: 'أعرف كيف أبرهن', test: (m) => (m.burhan ?? 0) === 0 }]}
      synthese={<CompleteView />}
      completion={{ masterTitle: 'أتقنت خواص قواسم عدد طبيعي', title: 'انتهى الدرس 3', message: 'الخاصيتان اللتان تعلّمتهما تبرّران، في الدرس 6، خوارزميتَي البحث عن القاسم المشترك الأكبر.', verbs: ['أتحقّق', 'أخمّن', 'أصوغ', 'أبرهن'], masterBadgeLabel: 'خواص القواسم' }}
    />
  );
}
