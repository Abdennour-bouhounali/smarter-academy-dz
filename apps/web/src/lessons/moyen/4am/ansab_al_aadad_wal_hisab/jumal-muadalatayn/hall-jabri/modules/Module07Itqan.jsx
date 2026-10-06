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
 * Module 7 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la leçon.
 * Cinq épreuves : les items 5 et 6 de « أؤكّد تعلّماتي » (p. 62, extraction › qcm › duplicatedIn ›
 * hall-jabri) et trois jumal de la plateforme. L'item 6 a TROIS réponses justes dans le livre : il
 * devient un choix parmi des combinaisons (« (1) و (2) و (3) »), chaque autre combinaison étant
 * fausse — la convention du banc d'exercices (EXERCISE_CONTRACT, unité 4). Chaque épreuve évalue
 * UN point d'apprentissage ; P1 (E2, E3), P2 (E1, E4) et P3 (E5) sont couverts. Chaque distracteur
 * est faux (ثنائية qui ne vérifie qu'une équation, ordre inversé, signe perdu en isolant,
 * multiplicateur qui n'oppose rien, raison fausse sur les coefficients).
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (s) => <MathText key={s}>{s}</MathText>;
const PLATFORM = addition('interaction_generation');

export default function Module07Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(7)}
      moduleNumber={7}
      moduleTitle="إختبار أولي"
      moduleSubtitle="خمسة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="6 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={6 * 60}
      timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        tawid: { label: 'طريقة التعويض', module: 2 },
        jam: { label: 'طريقة الجمع', module: 2 },
        ikhtiyar: { label: 'اختيار الطريقة الأنسب', module: 2 },
      }}
      epreuves={[
        {
          id: 'E1', skill: 'jam', requires: ['tariqat-jam'],
          prompt: <Q source={QCM[5].source}><MathText>{QCM[5].text}</MathText></Q>,
          options: [M(QCM[5].options[0]), M(QCM[5].options[1]), M(QCM[5].options[2])],
          correct: 2, cols: 3,
          explain: <MathText>{QCM[5].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_hall-jabri_P2'] },
        },
        {
          id: 'E2', skill: 'tawid', requires: ['tariqat-tawid'],
          prompt: (
            <Q source={QCM[6].source}>
              <MathText>{QCM[6].text}</MathText>{' '}
              <MathText>{`(1) ${QCM[6].options[0]} ، (2) ${QCM[6].options[1]} ، (3) ${QCM[6].options[2]}`}</MathText>
            </Q>
          ),
          options: [M('(1) فقط'), M('(1) و (3) فقط'), M('(1) و (2) و (3)'), M('(2) و (3) فقط')],
          correct: 2, cols: 2, keepOrder: true,
          explain: <MathText>{QCM[6].explain}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_hall-jabri_P1'] },
        },
        {
          id: 'E3', skill: 'tawid', requires: ['tariqat-tawid'],
          prompt: <Q source={PLATFORM}><MathText>{'لحل الجملة $\\begin{cases} x - 2y = 1 \\\\ 3x + y = 10 \\end{cases}$ بالتعويض، نكتب من المعادلة الأولى $x = 1 + 2y$ ، ثم نعوّض في المعادلة الثانية فنجد:'}</MathText></Q>,
          options: [M('$3(1 + 2y) + y = 10$'), M('$(1 + 2y) - 2y = 1$'), M('$3(1 - 2y) + y = 10$'), M('$3 + 2y + y = 10$')],
          correct: 0, cols: 2,
          explain: <MathText>{'كل $x$ في $3x + y = 10$ يصير $(1 + 2y)$ : $3(1 + 2y) + y = 10$ أي $7y = 7$ ، ومنه $y = 1$ و $x = 3$ . التعويض في المعادلة الأولى نفسها يعطي $1 = 1$ ، و $3(1 + 2y) = 3 + 6y$ وليس $3 + 2y$ .'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_hall-jabri_P1'] },
        },
        {
          id: 'E4', skill: 'jam', requires: ['tariqat-jam'],
          prompt: <Q source={PLATFORM}><MathText>{'لنتخلّص من $y$ في الجملة $\\begin{cases} 2x + 3y = 5 \\\\ 4x - y = 3 \\end{cases}$ بطريقة الجمع، نضرب طرفي المعادلة الثانية في:'}</MathText></Q>,
          options: [M('$3$'), M('$-3$'), M('$2$'), M('$-2$')],
          correct: 0, cols: 4,
          explain: <MathText>{'$3(4x - y) = 3 \\times 3$ أي $12x - 3y = 9$ : معاملا $y$ صارا $3y$ و $-3y$ ، وبالجمع $14x = 14$ ومنه $x = 1$ ثم $y = 1$ . بالعدد $-3$ يصيران $3y$ و $3y$ ، وبالعددين 2 و $-2$ لا يتعاكسان.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_hall-jabri_P2'] },
        },
        {
          id: 'E5', skill: 'ikhtiyar', requires: ['ikhtiyar-tariqa'],
          prompt: <Q source={PLATFORM}><MathText>{'أنسب طريقة لحل الجملة $\\begin{cases} 7x + 2y = 3 \\\\ 5x - 2y = 9 \\end{cases}$ ، وحلّها:'}</MathText></Q>,
          options: [
            M('الجمع مباشرة، لأنّ معاملي $y$ متعاكسان؛ والحل $(1 ; -2)$'),
            M('التعويض، لأنّ معامل $x$ يساوي 1؛ والحل $(1 ; -2)$'),
            M('الجمع مباشرة، لأنّ معاملي $y$ متعاكسان؛ والحل $(-2 ; 1)$'),
            M('الجمع مباشرة، لأنّ معاملي $y$ متعاكسان؛ والحل $(1 ; 2)$'),
          ],
          correct: 0, cols: 1,
          explain: <MathText>{'$2y$ و $-2y$ متعاكسان: بالجمع $12x = 12$ ، ومنه $x = 1$ ثم $2y = 3 - 7 = -4$ أي $y = -2$ . للتحقق: $7 - 4 = 3$ و $5 + 4 = 9$ . لا يوجد معامل يساوي 1 هنا، والثنائية تُكتب $(x ; y)$ بهذا الترتيب.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_hall-jabri_P3'] },
        },
      ]}
      badges={[
        { id: 'tawid', emoji: '🔁', label: 'عبارة في المعادلة الأخرى', test: (m) => (m.tawid ?? 0) === 0 },
        { id: 'jam', emoji: '➕', label: 'معاملان متعاكسان', test: (m) => (m.jam ?? 0) === 0 },
        { id: 'ikhtiyar', emoji: '🧭', label: 'الطريقة الأنسب', test: (m) => (m.ikhtiyar ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت حل جملة معادلتين جبريًا',
        title: 'انتهى الدرس 2',
        message: 'تعرف الآن كيف تحلّ جملة معادلتين من الدرجة الأولى بمجهولين: تتخلّص من أحد المجهولين بالتعويض أو بالجمع، تحلّ المعادلة الناتجة، ثم تجد المجهول الآخر وتتحقّق من الثنائية.',
        verbs: ['أعزل', 'أعوّض', 'أضرب', 'أجمع', 'أتحقّق'],
        masterBadgeLabel: 'حل جملة معادلتين جبريًا',
      }}
    />
  );
}
