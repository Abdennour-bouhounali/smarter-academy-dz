import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, NOW138, CONSTRUCT } from '../content/textbook';
import LabEvidence from '../components/LabEvidence';

/**
 * Module 3 — إنشاءات (stage `manipulation`) : دوري الآن p. 138 FAIT au laboratoire `vector-chain` en mode `construct`,
 * posé SEUL sur ces nombres (`levels={false}` : c'est l'exercice du manuel, pas une exploration à deux niveaux —
 * précédent : inshaat-talis M2). Le manuel ne donne ni figure ni position de A, B, C, E : la plateforme les place sur une
 * مرصوفة (content/textbook.js › NOW138.completion, dit dans le module).
 *   1. le centre de (Γ₁) : E₁ tel que EE₁ = AB + AC (pas E₁E)       → brique insha-majmu (P3)
 *   2. le rayon de (Γ₂) : 2, comme (Γ)                              → brique surat-daira (P3)
 *   3. l'ordre des représentants ne change pas l'arrivée              (P3)
 * Aucune étape n'attend le laboratoire : les gestes de l'élève sont listés au-dessus des questions.
 * « أتوقّع القاعدة » : l'explication des questions 1 et 2 ÉNONCE la règle de la brique qui suit ; chaque question est
 * enveloppée dans une PredictRule (même id que la brique) — l'élève écrit la règle après le laboratoire, avant la question.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Inshaat() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const keep = (e) => { if (e) setTrials((list) => [...list, { ...e, level: 'construct' }].slice(-30)); };

  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="إنشاءات — صور دائرة بانسحاب"
      moduleSubtitle="دوري الآن (ص 138) على المرصوفة" estimatedTime="8 دقائق"
      brief={{
        tag: 'دوري الآن — الكتاب ص 138', headline: 'القطار ينطلق من مركز الدائرة', emoji: '⭕',
        title: 'ننشئ ممثّل مجموع عدة أشعة، فنجد مركز صورة دائرة', tone: 'sky',
        body: (
          <div className="space-y-2" data-situation="now-138">
            <p><MathText>{NOW138.text}</MathText></p>
            <p className="text-xs text-slate-500" data-completion="now-138">{NOW138.completion}</p>
          </div>
        ),
        footer: <SourceTag source={NOW138.source} />,
      }}
      intro={
        <Manipulation type="vector-chain" levels={false} {...LAB.construct} theme="metro"
          title="دوري الآن: الدوائر (Γ) و (Γ₁) و (Γ₂)" onTrial={keep} />
      }
      steps={[
        { num: 1, title: 'مركز الدائرة الأولى', subtitle: 'الممثّلات متتابعة', done: !!q[1],
          content: (
            <div className="space-y-3">
              <LabEvidence id="construct-g1" trials={trials} level="construct" title="ما أنشأته في المختبر:"
                empty="في المختبر: اسحب $\\overrightarrow{AB}$ إلى المحطة E ، ثم $\\overrightarrow{AC}$ إلى نهاية الممثّل." />
              <PredictRule id="insha-majmu">
                <TapQuestion
                  prompt={<MathText>{'مركز $(\\Gamma_1)$ هو النقطة $E_1$ حيث:'}</MathText>}
                  options={[
                    '$\\overrightarrow{EE_1} = \\overrightarrow{AB} + \\overrightarrow{AC}$',
                    '$\\overrightarrow{E_1E} = \\overrightarrow{AB} + \\overrightarrow{AC}$',
                    '$\\overrightarrow{AE_1} = \\overrightarrow{AB} + \\overrightarrow{AC}$',
                  ].map(M)}
                  correct={0} cols={1} requires={['rabt-shal', 'qaidat-mutawazi']}
                  explain={<MathText>{`صورة E بالانسحاب الذي شعاعه $\\vec{u}$ هي النقطة $E_1$ حيث $\\overrightarrow{EE_1} = \\vec{u}$ . ${CONSTRUCT.startRight}`}</MathText>}
                  onAnswered={mark(1)} />
              </PredictRule>
              {q[1] && (
                <>
                  <KnowledgeBrick id="insha-majmu" lead="ما فعله القطار على المرصوفة:" />
                  <p className="text-xs text-slate-600" data-misconception-note="insha"><MathText>{`خطأ شائع: ${CONSTRUCT.startWrong} ${CONSTRUCT.startWhy}`}</MathText></p>
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'نصف قطر الصورة', subtitle: 'الانسحاب يحافظ على الأطوال', done: !!q[2],
          content: (
            <div className="space-y-3">
              <PredictRule id="surat-daira">
                <TapQuestion
                  prompt={<MathText>{'نصف قطر الدائرة $(\\Gamma_2)$ هو:'}</MathText>}
                  options={['2', '$2 + EE_2$', '1'].map(M)}
                  correct={0} cols={3} requires={['insha-majmu']}
                  explain={<MathText>{CONSTRUCT.circle}</MathText>}
                  onAnswered={mark(2)} />
              </PredictRule>
              {q[2] && <KnowledgeBrick id="surat-daira" />}
            </div>
          ) },
        { num: 3, title: 'هل يهمّ الترتيب؟', subtitle: 'الدائرة الثانية', done: !!q[3],
          content: (
            <div className="space-y-3">
              <LabEvidence id="construct-g2" trials={trials} level="construct" title="ما أنشأته في المختبر:"
                empty="في المختبر، الدائرة 2: ضع الممثّلين بترتيب، ثم جرّب الترتيب الآخر بعد «تراجع»." />
              <TapQuestion
                prompt={<MathText>{'لإنشاء مركز $(\\Gamma_2)$ رسمنا من E ممثّل $\\overrightarrow{BE}$ ثم من نهايته ممثّل $\\overrightarrow{CA}$ . لو رسمنا $\\overrightarrow{CA}$ أولا ثم $\\overrightarrow{BE}$ :'}</MathText>}
                options={['نصل إلى المركز نفسه $E_2$', 'نصل إلى نقطة أخرى', 'لا يمكن: الترتيب مفروض'].map(M)}
                correct={0} cols={1} requires={['insha-majmu', 'qaidat-mutawazi']}
                explain={<MathText>{'$\\overrightarrow{BE} + \\overrightarrow{CA} = \\overrightarrow{CA} + \\overrightarrow{BE}$ : الطريقان ضلعا متوازي أضلاع لهما القطر نفسه، فيصلان إلى $E_2$ (قاعدة متوازي الأضلاع).'}</MathText>}
                onAnswered={mark(3)} />
              {q[3] && <TextbookBox kind="method" title={CONSTRUCT.title} lines={CONSTRUCT.lines} source={CONSTRUCT.source} compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />} />
  );
}
