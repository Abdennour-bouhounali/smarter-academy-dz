import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
/** Module 7 — إختبار أولي (module 4 avant les « مسائل ») : نشاط 7, معارف 5, exercices 25, 27, 39, QCM 8. */
export default function Module07Itqan() {
  return (
    <BossFinal ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} moduleTitle="إختبار أولي" moduleSubtitle="خمس أسئلة تُقيّم ما تعلّمته" estimatedTime="7 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={7 * 60} timerLabel="7 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ taarif: { label: 'التعريف', module: 2 }, ithbat: { label: 'الإثبات بحساب PGCD', module: 2 }, nafy: { label: 'النفي بقاسم مشترك', module: 1 } }}
      epreuves={[
        { id: 'E1', skill: 'taarif', requires: ['awwaliyan-taarif'], prompt: <Q source={src('know-5', 12, 'معارف', 5)}>«a و b أوليان فيما بينهما» يعني ...</Q>,
          options: ['PGCD(a ; b) = 1', 'a و b عددان أوليان', 'a − b = 1', 'a لا يقسم b'], correct: 0, cols: 2, explain: <span>قاسمهما المشترك الأكبر يساوي 1، لا أكثر ولا أقل.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1'] } },
        { id: 'E2', skill: 'taarif', requires: ['awwaliyan-taarif'], prompt: <Q source={src('qcm', 16, 'أؤكّد تعلّماتي', 8)}>القاسم المشترك الأكبر للعددين 29 و 39 هو ...</Q>,
          options: ['1', '10', '29'], correct: 0, cols: 1, explain: <span>قواسم 29: 1 ، 29؛ قواسم 39: 1 ، 3 ، 13 ، 39. القاسم المشترك الوحيد 1: العددان أوليان فيما بينهما.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1'] } },
        { id: 'E3', skill: 'ithbat', requires: ['ithbat-awwaliyan'], prompt: <Q source={src('ex-25', 15, 'أوظّف تعلّماتي', 25)}>65 = 56 × 1 + 9 ، 56 = 9 × 6 + 2 ، 9 = 2 × 4 + 1 ، 2 = 1 × 2 + 0. إذن ...</Q>,
          options: ['56 و 65 أوليان فيما بينهما', 'PGCD(56 ; 65) = 2', 'PGCD(56 ; 65) = 9', '56 و 65 ليسا أوليين فيما بينهما'], correct: 0, cols: 1, explain: <span>آخر باقٍ غير معدوم 1.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P2'] } },
        { id: 'E4', skill: 'nafy', requires: ['nafy-awwaliyan'], prompt: <Q source={src('ex-27', 15, 'أوظّف تعلّماتي', 27)}>بدون حساب: 152 و 250 ليسا أوليين فيما بينهما لأن ...</Q>,
          options: ['كلاهما زوجي: 2 قاسم مشترك يختلف عن 1', 'فرقهما 98', 'كلاهما أكبر من 100', 'مجموع أرقامهما 8 و 7'], correct: 0, cols: 1, explain: <span>قاسم مشترك واحد يختلف عن 1 يكفي.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P3'] } },
        { id: 'E5', skill: 'nafy', requires: ['nafy-awwaliyan', 'ithbat-awwaliyan'], prompt: <Q source={src('ex-39', 15, 'أوظّف تعلّماتي', 39)}>253 و 407 لا يقبلان القسمة على 2 ، 3 ، 4 ، 5 ، 9 ، 10. هل هما أوليان فيما بينهما؟</Q>,
          options: ['لا نعرف بعد: يجب حساب PGCD؛ وهو 11', 'نعم، حتمًا', 'لا، لأنهما فرديان', 'نعم، لأن قواعد قابلية القسمة كلها فشلت'], correct: 0, cols: 1, explain: <span><MathText>{'$253 = 11 \\times 23$'}</MathText> و <MathText>{'$407 = 11 \\times 37$'}</MathText>: قاسم مشترك 11 لا تكشفه القواعد الست.</span>, assessment: { enabled: true, type: 'assessment', learningPoints: [{ code: '4am_awwaliyan-fima-baynahuma_P3', role: 'primary' }, { code: '4am_awwaliyan-fima-baynahuma_P2', role: 'secondary' }] } },
      ]}
      badges={[{ id: 'wahid', emoji: '1️⃣', label: 'القاسم المشترك الوحيد هو 1', test: (m) => (m.taarif ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أتقنت العددين الأوليين فيما بينهما', title: 'انتهى الدرس 7', message: 'PGCD = 1 هو مفتاح الدرس 8: كسر بسطه ومقامه أوليان فيما بينهما لا يُختزل.', verbs: ['أتعرّف', 'أثبت', 'أنفي', 'أميّز'], masterBadgeLabel: 'أوليان فيما بينهما' }} />
  );
}
