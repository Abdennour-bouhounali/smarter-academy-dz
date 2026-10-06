import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
/** Module 8 (ex-5, renuméroté après les trois مسائل) — إختبار أولي : QCM 9 (p. 16), معارف 4 (21/14, 45/18), طريقة 117/91, نشاط 6 ب (765/135), exercice 20. */
export default function Module08Itqan() {
  return (
    <BossFinal ctx={MODULE_CTX} navLinks={getNavLinks(8)} moduleNumber={8} moduleTitle="إختبار أولي" moduleSubtitle="ست أسئلة تُقيّم ما تعلّمته" estimatedTime="8 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={8 * 60} timerLabel="8 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الستة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ farq: { label: 'الخاصية PGCD(b ; a − b)', module: 2 }, furuq: { label: 'الفروق المتتابعة', module: 1 }, baqi: { label: 'الخاصية PGCD(b ; r)', module: 2 }, iqlidus: { label: 'خوارزمية إقليدس', module: 3 }, ikhtiyar: { label: 'اختيار الطريقة', module: 3 } }}
      epreuves={[
        { id: 'E1', skill: 'farq', requires: ['pgcd-farq'], prompt: <Q source={src('know-4-props', 12, 'معارف', 4)}>PGCD(21 ; 14) يساوي ...</Q>,
          options: ['PGCD(14 ; 7)', 'PGCD(21 ; 3)', 'PGCD(14 ; 21 × 14)', '21 + 14'], correct: 0, cols: 2, explain: <span><MathText>{'$21 - 14 = 7$'}</MathText>: PGCD(a ; b) = PGCD(b ; a − b).</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_bahth-pgcd_P1'] } },
        { id: 'E2', skill: 'furuq', requires: ['khwarizmiyat-al-furuq'], prompt: <Q source={src('method-differences', 13, 'طرائق')}>الفروق المتتابعة لـ 117 و 91: 26 ، 65 ، 39 ، 13 ، 13 ، 0. إذن PGCD(117 ; 91) = ...</Q>,
          options: ['13', '0', '26', '1'], correct: 0, cols: 2, explain: <span>القاسم المشترك الأكبر هو آخر فرق غير معدوم.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_bahth-pgcd_P2'] } },
        { id: 'E3', skill: 'baqi', requires: ['pgcd-baqi'], prompt: <Q source={src('qcm', 16, 'أؤكّد تعلّماتي', 9)}>من المساواة <MathText>{'$125 = 75 \\times 1 + 50$'}</MathText> ينتج أن ...</Q>,
          options: ['PGCD(125 ; 75) = 1', 'PGCD(125 ; 75) = PGCD(75 ; 50)', 'PGCD(125 ; 75) = 50'], correct: 1, cols: 1, explain: <span>50 هو باقي قسمة 125 على 75: PGCD(a ; b) = PGCD(b ; r).</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_bahth-pgcd_P3'] } },
        { id: 'E4', skill: 'iqlidus', requires: ['khwarizmiyat-iqlidus'], prompt: <Q source={src('know-4-props', 12, 'معارف', 4)}><MathText>{'$45 = 18 \\times 2 + 9$'}</MathText> و <MathText>{'$18 = 9 \\times 2 + 0$'}</MathText>. إذن PGCD(45 ; 18) = ...</Q>,
          options: ['9', '2', '18', '0'], correct: 0, cols: 2, explain: <span>آخر باقٍ غير معدوم هو 9.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_bahth-pgcd_P4'] } },
        { id: 'E5', skill: 'iqlidus', requires: ['khwarizmiyat-iqlidus'], prompt: <Q source={src('ex-20', 14, 'أوظّف تعلّماتي', 20)}>6767 = 5858 × 1 + 909 ، 5858 = 909 × 6 + 404 ، 909 = 404 × 2 + 101 ، 404 = 101 × 4 + 0. إذن PGCD(5858 ; 6767) = ...</Q>,
          options: ['101', '404', '4', '909'], correct: 0, cols: 2, explain: <span>آخر باقٍ غير معدوم: 101.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_bahth-pgcd_P4'] } },
        { id: 'E6', skill: 'ikhtiyar', requires: ['ikhtiyar-al-tariqa'], prompt: <Q source={src('act-6b', 9, 'أنشطة', 6)}>لتعيين PGCD(765 ; 135): الفروق المتتابعة تلزمها ثمان خطوات. وخوارزمية إقليدس؟</Q>,
          options: ['ثلاث قسمات، ونفس النتيجة 45', 'ثمان قسمات أيضًا', 'قسمة واحدة', 'نتيجة مختلفة'], correct: 0, cols: 2, explain: <span>765 = 135 × 5 + 90 ، 135 = 90 × 1 + 45 ، 90 = 45 × 2 + 0. القسمة تختصر الطرحات المتكررة.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_bahth-pgcd_P5'] } },
      ]}
      badges={[{ id: 'furuq', emoji: '➖', label: 'أطرح وأعيد', test: (m) => (m.furuq ?? 0) + (m.farq ?? 0) === 0 }, { id: 'iqlidus', emoji: '➗', label: 'خوارزمية إقليدس', test: (m) => (m.iqlidus ?? 0) + (m.baqi ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أتقنت البحث عن القاسم المشترك الأكبر', title: 'انتهى الدرس 6', message: 'خوارزميتان، خاصيتان تبرّرانهما، ونتيجة واحدة. الدرس 7 يسأل: ماذا لو كان PGCD = 1؟', verbs: ['أطرح', 'أقسم', 'أبرّر', 'أختار'], masterBadgeLabel: 'خوارزمية إقليدس' }} />
  );
}
