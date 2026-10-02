import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { addition } from '../../_unit/unitMeta';
import { QCM } from '../content/textbook';

/**
 * Module 4 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la leçon.
 * Six épreuves : les items 1 à 4 de « أؤكّد تعلّماتي » (p. 62, extraction › qcm › duplicatedIn ›
 * mafhum-jumla) et deux de la plateforme (P2 : la ثنائية solution parmi des ثنائيات qui ne vérifient
 * qu'UNE équation ou renversée ; P4 : une jumla sans solution). L'item 2 a deux bonnes réponses
 * dans le livre : il devient UN choix entre combinaisons, chacune des autres étant fausse.
 * Chaque épreuve évalue UN point d'apprentissage ; P1–P4 sont couverts.
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (s) => <MathText key={s}>{s}</MathText>;
const PLATFORM = addition('interaction_generation');

export default function Module04Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="إختبار أولي"
      moduleSubtitle="ستة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="7 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={7 * 60}
      timerLabel="7 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الستة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        shakl: { label: 'جملة معادلتين بمجهولين', module: 2 },
        hall: { label: 'حل الجملة واختبار ثنائية', module: 2 },
        halat: { label: 'الحالات الخاصة', module: 2 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'shakl', requires: ['jumla-tarif'],
          prompt: <Q source={QCM[1].source}><MathText>{QCM[1].text}</MathText></Q>,
          options: QCM[1].options.map(M),
          correct: 1, cols: 1, keepOrder: true,
          explain: <MathText>{QCM[1].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mafhum-jumla_P1'] },
        },
        {
          id: 'E2', skill: 'hall', requires: ['ikhtibar-thunaiya'],
          prompt: <Q source={QCM[2].source}><MathText>{QCM[2].text}</MathText></Q>,
          options: [M('$3x + y = 0$ فقط'), M('$3x + y = 0$ و $x - 3y = 0$'), M('$x - 3y = 0$ و $\\dfrac{1}{3}x - y = 3$'), M('المعادلات الثلاث')],
          correct: 1, cols: 1,
          explain: <MathText>{QCM[2].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mafhum-jumla_P3'] },
        },
        {
          id: 'E3', skill: 'hall', requires: ['ikhtibar-thunaiya'],
          prompt: <Q source={QCM[3].source}><MathText>{QCM[3].text}</MathText></Q>,
          options: QCM[3].options.map(M),
          correct: 0, cols: 1,
          explain: <MathText>{QCM[3].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mafhum-jumla_P3'] },
        },
        {
          id: 'E4', skill: 'shakl', requires: ['jumla-tarif'],
          prompt: <Q source={QCM[4].source}><MathText>{QCM[4].text}</MathText></Q>,
          options: QCM[4].options.map(M),
          correct: 2, cols: 1,
          explain: <MathText>{QCM[4].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mafhum-jumla_P1'] },
        },
        {
          id: 'E5', skill: 'hall', requires: ['hall-jumla', 'tartib-thunaiya'],
          prompt: <Q source={PLATFORM}><MathText>{'حل الجملة $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$ هو الثنائية'}</MathText></Q>,
          options: [M('$(2 ; 3)$'), M('$(3 ; 2)$'), M('$(5 ; 0)$'), M('$(1 ; 0)$')],
          correct: 1, cols: 4,
          explain: <MathText>{'$3 + 2 = 5$ و $3 - 2 = 1$ : المعادلتان معًا. أما $(2 ; 3)$ فتعطي $2 - 3 = -1 \\neq 1$ (الترتيب)، و $(5 ; 0)$ تحقّق الأولى وحدها: $5 - 0 = 5 \\neq 1$ ، و $(1 ; 0)$ الثانية وحدها: $1 + 0 = 1 \\neq 5$.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mafhum-jumla_P2'] },
        },
        {
          id: 'E6', skill: 'halat', requires: ['halat-khassa'], keepOrder: true,
          prompt: <Q source={PLATFORM}><MathText>{'الجملة $\\begin{cases} x + 2y = 3 \\\\ 2x + 4y = 5 \\end{cases}$ ...'}</MathText></Q>,
          options: [M('لها حل وحيد'), M('ليس لها حلول'), M('لها عدد غير منته من الحلول')],
          correct: 1, cols: 1,
          explain: <MathText>{'نقسم طرفي $2x + 4y = 5$ على 2: $x + 2y = \\dfrac{5}{2}$. لا يمكن أن يساوي $x + 2y$ العدد 3 والعدد $\\dfrac{5}{2}$ في آن واحد: الجملة ليس لها حلول.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mafhum-jumla_P4'] },
        },
      ]}
      badges={[
        { id: 'shakl', emoji: '🧩', label: 'جملة معادلتين', test: (m) => (m.shakl ?? 0) === 0 },
        { id: 'hall', emoji: '✌️', label: 'المعادلتان في آن واحد', test: (m) => (m.hall ?? 0) === 0 },
        { id: 'halat', emoji: '🔀', label: 'الحالات الخاصة', test: (m) => (m.halat ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت مفهوم جملة معادلتين',
        title: 'انتهى الدرس 1',
        message: 'تعرف الآن جملة معادلتين من الدرجة الأولى بمجهولين، وأنّ حلّها ثنائية تحقّق المعادلتين في آن واحد، وأنّ لبعض الجمل حلولًا لا تنتهي أو لا حل لها.',
        verbs: ['أعوّض', 'أتحقّق', 'أرتّب', 'أميّز'],
        masterBadgeLabel: 'مفهوم جملة معادلتين',
      }}
    />
  );
}
