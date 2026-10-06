import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
/** Module 7 — إختبار أولي : نشاط 5, نتائج مباشرة, exercice 17. */
export default function Module07Itqan() {
  return (
    <BossFinal ctx={MODULE_CTX} navLinks={getNavLinks(7)} moduleNumber={7} moduleTitle="إختبار أولي" moduleSubtitle="أربع أسئلة تُقيّم ما تعلّمته" estimatedTime="6 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={6 * 60} timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الأربعة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ hasr: { label: 'التعيين بالحصر', module: 1 }, nataij: { label: 'النتائج المباشرة', module: 2 }, qasim: { label: 'b قاسم لـ a', module: 2 } }}
      epreuves={[
        { id: 'E1', skill: 'hasr', requires: ['tayin-bil-hasr'], prompt: <Q source={src('act-5', 8, 'أنشطة', 5)}>قواسم 42: 1 ، 2 ، 3 ، 6 ، 7 ، 14 ، 21 ، 42. قواسم 60: 1 ، 2 ، 3 ، 4 ، 5 ، 6 ، 10 ، 12 ، 15 ، 20 ، 30 ، 60. إذن PGCD(42 ; 60) = ...</Q>,
          options: ['6', '3', '12', '2'], correct: 0, cols: 2, explain: <span>القواسم المشتركة 1 ، 2 ، 3 ، 6؛ أكبرها 6.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_tayin-pgcd_P1'] } },
        { id: 'E2', skill: 'hasr', requires: ['tayin-bil-hasr'], prompt: <Q source={src('ex-17', 14, 'أوظّف تعلّماتي', 17)}>القواسم المشتركة للعددين 27 و 30 هي 1 و 3. إذن ...</Q>,
          options: ['PGCD(27 ; 30) = 3', 'PGCD(27 ; 30) = 1', 'PGCD(27 ; 30) = 27', 'PGCD(27 ; 30) = 30'], correct: 0, cols: 2, explain: <span>القاسم المشترك الأكبر هو أكبر القواسم المشتركة.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_tayin-pgcd_P1'] } },
        { id: 'E3', skill: 'nataij', requires: ['nataij-mubashira'], prompt: <Q source={src('know-4-results', 12, 'معارف', 4)}>أي كتابة صحيحة؟</Q>,
          options: ['PGCD(7 ; 0) = 7', 'PGCD(7 ; 0) = 0', 'PGCD(28 ; 28) = 1', 'PGCD(8 ; 40) ≠ PGCD(40 ; 8)'], correct: 0, cols: 2, explain: <span>PGCD(a ; 0) = a، PGCD(a ; a) = a، والترتيب لا يهم.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_tayin-pgcd_P2'] } },
        { id: 'E4', skill: 'qasim', requires: ['pgcd-idha-qasim'], prompt: <Q source={src('know-4-results', 12, 'معارف', 4)}>8 قاسم للعدد 40. إذن <MathText>{'$\\mathrm{PGCD}(40\\ ;\\ 8)$'}</MathText> = ...</Q>,
          options: ['8', '40', '4', '1'], correct: 0, cols: 2, explain: <span>إذا كان b قاسما للعدد a فإن PGCD(a ; b) = b.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_tayin-pgcd_P3'] } },
      ]}
      badges={[{ id: 'hasr', emoji: '🎯', label: 'أعيّن PGCD بالحصر', test: (m) => (m.hasr ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أتقنت تعيين القاسم المشترك الأكبر', title: 'انتهى الدرس 5', message: 'حصر القواسم يطول مع الأعداد الكبيرة. الدرس 6 يقدّم طريقتين أسرع.', verbs: ['أحصر', 'أقاطع', 'أختار', 'أستنتج'], masterBadgeLabel: 'تعيين PGCD' }} />
  );
}
