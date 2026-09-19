import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { CompleteView } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;

/** Module 4 — إتقان : معارف 3 (12 و 18), معارف 4 (28 و 42), نشاط 4 (90 و 54), ملاحظة (قواسم 14). */
export default function Module04Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX} navLinks={getNavLinks(4)} moduleNumber={4}
      moduleTitle="إتقان" moduleSubtitle="خمس أسئلة تُقيّم ما تعلّمته" estimatedTime="8 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={8 * 60} timerLabel="8 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ mushtaraka: { label: 'القواسم المشتركة', module: 2 }, pgcd: { label: 'القاسم المشترك الأكبر والرمز', module: 2 }, wadiya: { label: 'وضعية الباقات', module: 1 }, mulahaza: { label: 'قواسم PGCD', module: 2 } }}
      epreuves={[
        { id: 'E1', skill: 'mushtaraka', requires: ['qawasim-mushtaraka'], prompt: <Q source={src('know-3', 10, 'معارف', 3)}>القواسم المشتركة للعددين <MathText>{'$12$'}</MathText> و <MathText>{'$18$'}</MathText> هي ...</Q>,
          options: ['1 ، 2 ، 3 ، 6', '1 ، 2 ، 3 ، 4 ، 6 ، 9', '6 فقط', '2 ، 3'], correct: 0, cols: 2,
          explain: <span>الأعداد الموجودة في قائمتَي القواسم معًا.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-mushtarak-akbar_P1'] } },
        { id: 'E2', skill: 'pgcd', requires: ['pgcd-taarif', 'pgcd-ramz'], prompt: <Q source={src('know-4-def', 12, 'معارف', 4)}>قواسم 28: 1 ، 2 ، 4 ، 7 ، 14 ، 28. قواسم 42: 1 ، 2 ، 3 ، 6 ، 7 ، 14 ، 21 ، 42. إذن ...</Q>,
          options: ['PGCD(28 ; 42) = 14', 'PGCD(28 ; 42) = 7', 'PGCD(28 ; 42) = 42', 'PGCD(28 ; 42) = 2'], correct: 0, cols: 2,
          explain: <span>القواسم المشتركة 1 ، 2 ، 7 ، 14؛ أكبرها 14.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-mushtarak-akbar_P2'] } },
        { id: 'E3', skill: 'pgcd', requires: ['pgcd-taarif'], prompt: <Q source={src('know-4-def', 12, 'معارف', 4)}>القاسم المشترك الأكبر لعددين هو ...</Q>,
          options: ['أكبر عدد يقسم العددين معًا', 'أصغر عدد يقسم العددين معًا', 'جداء العددين', 'أكبر العددين'], correct: 0, cols: 1,
          explain: <span>أكبر القواسم المشتركة. أصغرها هو 1 دائمًا.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-mushtarak-akbar_P2'] } },
        { id: 'E4', skill: 'wadiya', requires: ['qawasim-mushtaraka'], prompt: <Q source={src('act-4', 8, 'أنشطة', 4)}>90 زهرة حمراء و 54 زهرة بيضاء في باقات متماثلة، ولا تبقى أية زهرة. أكبر عدد ممكن من الباقات هو ...</Q>,
          options: ['18', '9', '6', '36'], correct: 0, cols: 2,
          explain: <span>عدد الباقات قاسم مشترك لـ 90 و 54؛ أكبره <MathText>{'$\\mathrm{PGCD}(90\\ ;\\ 54) = 18$'}</MathText>.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-mushtarak-akbar_P3'] } },
        { id: 'E5', skill: 'mulahaza', requires: ['qawasim-al-pgcd'], prompt: <Q source={src('know-4-def', 12, 'معارف', 4)}>PGCD(a ; b) = 14. القواسم المشتركة للعددين a و b هي ...</Q>,
          options: ['قواسم 14: 1 ، 2 ، 7 ، 14', '14 فقط', '1 و 14', 'كل الأعداد الأصغر من 14'], correct: 0, cols: 1,
          explain: <span>مجموعة القواسم المشتركة لعددين هي مجموعة قواسم قاسمهما المشترك الأكبر.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_qasim-mushtarak-akbar_P4'] } },
      ]}
      badges={[{ id: 'thalath', emoji: '💐', label: 'ثلاث كلمات لا أخلطها', test: (m) => (m.mushtaraka ?? 0) + (m.pgcd ?? 0) === 0 }]}
      synthese={<CompleteView />}
      completion={{ masterTitle: 'أتقنت مفهوم القاسم المشترك الأكبر', title: 'انتهى الدرس 4', message: 'عرفت ما هو PGCD (a ; b). الدرس 5 يعيّنه بحصر القواسم، والدرس 6 يبحث عنه بطريقتين أسرع.', verbs: ['أعيّن', 'أرمّز', 'أفسّر', 'أستنتج'], masterBadgeLabel: 'PGCD' }}
    />
  );
}
