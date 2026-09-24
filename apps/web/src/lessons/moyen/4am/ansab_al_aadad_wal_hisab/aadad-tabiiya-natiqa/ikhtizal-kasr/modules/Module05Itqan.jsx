import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { src } from '../../_unit/unitMeta';
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
/** Module 5 — إختبار أولي : نشاط 8, معارف 6, طريقة 595/560, exercice 32. */
export default function Module05Itqan() {
  return (
    <BossFinal ctx={MODULE_CTX} navLinks={getNavLinks(5)} moduleNumber={5} moduleTitle="إختبار أولي" moduleSubtitle="خمس أسئلة تُقيّم ما تعلّمته" estimatedTime="6 دقائق" lessonConfig={LESSON_CONFIG} timerSeconds={6 * 60} timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة.</p> }}
      skills={{ khatwa: { label: 'الاختزال خطوة بخطوة', module: 1 }, taarif: { label: 'الكسر غير القابل للاختزال', module: 2 }, pgcd: { label: 'الاختزال بـ PGCD', module: 2 }, hisab: { label: 'نتيجة حساب مختزلة', module: 4 } }}
      epreuves={[
        { id: 'E1', skill: 'khatwa', requires: ['ikhtizal'], prompt: <Q source={src('act-8', 9, 'أنشطة', 8)}>بعد <MathText>{'$\\dfrac{84}{48} = \\dfrac{21}{12}$'}</MathText>، الخطوة التالية عند سمير هي ...</Q>,
          options: ['القسمة على 3: 7/4', 'القسمة على 2: 10/6', 'الطرح: 9/0', 'القسمة على 7: 3/12'], correct: 0, cols: 2, explain: <span>3 قاسم مشترك لـ 21 و 12؛ <MathText>{'$\\dfrac{21 \\div 3}{12 \\div 3} = \\dfrac{7}{4}$'}</MathText>.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_ikhtizal-kasr_P1'] } },
        { id: 'E2', skill: 'taarif', requires: ['kasr-ghayr-qabil'], prompt: <Q source={src('know-6', 12, 'معارف', 6)}>الكسر <MathText>{'$\\dfrac{a}{b}$'}</MathText> غير قابل للاختزال يعني ...</Q>,
          options: ['a و b أوليان فيما بينهما', 'a و b عددان أوليان', 'a أصغر من b', 'b لا يقسم a'], correct: 0, cols: 2, explain: <span>PGCD(a ; b) = 1.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_ikhtizal-kasr_P2'] } },
        { id: 'E3', skill: 'pgcd', requires: ['ikhtizal-bil-pgcd'], prompt: <Q source={src('method-reduce', 13, 'طرائق')}>PGCD(595 ; 560) = 35. الشكل غير القابل للاختزال للكسر <MathText>{'$\\dfrac{595}{560}$'}</MathText> هو ...</Q>,
          options: ['17/16', '119/112', '35/32', '16/17'], correct: 0, cols: 2, explain: <span><MathText>{'$\\dfrac{595 \\div 35}{560 \\div 35} = \\dfrac{17}{16}$'}</MathText>.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_ikhtizal-kasr_P3'] } },
        { id: 'E4', skill: 'pgcd', requires: ['ikhtizal-bil-pgcd'], prompt: <Q source={src('know-6', 12, 'معارف', 6)}>لكتابة كسر على الشكل غير القابل للاختزال في خطوة واحدة ...</Q>,
          options: ['نقسم البسط والمقام على قاسمهما المشترك الأكبر', 'نقسم البسط والمقام على 2 مرات عديدة', 'نطرح المقام من البسط', 'نضرب البسط والمقام في PGCD'], correct: 0, cols: 1, explain: <span>هذه ملاحظة الكتاب وطريقته.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_ikhtizal-kasr_P3'] } },
        { id: 'E5', skill: 'hisab', requires: ['ikhtizal-bil-pgcd'], prompt: <Q source={src('ex-32', 15, 'أوظّف تعلّماتي', 32)}><MathText>{'$B = \\left(\\dfrac{7}{6} - \\dfrac{3}{4}\\right) \\times \\dfrac{4}{5}$'}</MathText> على شكل كسر غير قابل للاختزال يساوي ...</Q>,
          options: ['1/3', '20/60', '5/15', '4/12'], correct: 0, cols: 2, explain: <span><MathText>{'$\\dfrac{5}{12} \\times \\dfrac{4}{5} = \\dfrac{20}{60} = \\dfrac{1}{3}$'}</MathText>: الأشكال الأخرى قابلة للاختزال.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_ikhtizal-kasr_P4'] } },
      ]}
      badges={[{ id: 'ikhtizal', emoji: '➗', label: 'أختزل حتى النهاية', test: (m) => (m.khatwa ?? 0) + (m.pgcd ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أتقنت اختزال الكسور', title: 'انتهى الدرس 8', message: 'أنهيت الدروس الثمانية للوحدة. بقي «أؤكّد تعلّماتي» ووضعية «أدمج تعلّماتي».', verbs: ['أختزل', 'أتحقّق', 'أستعمل PGCD', 'أحسب'], masterBadgeLabel: 'اختزال كسر' }} />
  );
}
