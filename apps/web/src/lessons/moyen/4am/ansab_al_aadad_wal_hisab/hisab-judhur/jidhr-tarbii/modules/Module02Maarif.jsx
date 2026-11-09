import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PeerSheet } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';
import { M2_ROUNDS } from '../content/squares';
import { PEER_SHEET, PEER_KID } from '../content/peerSheet';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

/**
 * Module 2 — معارف 1 (p. 22) : la définition, le symbole et sa lecture, les
 * exemples du livre, puis les DEUX propriétés, chacune NOMMÉE par sa brique
 * APRÈS l'essai qui la prépare (rétrofit 2026-10-15 : labo en tête sans carte ni titre, définition et briques après les réponses). L'exemple √0,04 = 0,2 est manipulé dans le
 * MÊME instrument qu'au module 1 (le carré qu'on étire) : un exemple
 * travaillé, un seul niveau (`levels={false}`). LP : P1, P2, P3.
 *
 * LECTEUR DE MISSION (rollout 2026-11-09) : le labo se joue en MANCHES (content/squares.js › M2_ROUNDS : 0,04 avec ses questions → défi ⭐ 1,69
 * avec prédictions → jardin libre), l'étape 1 attend la manche 1, l'étape 4 est « ورقة إلياس » (`PeerSheet`). Hors lecteur : inchangé.
 */
export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  // Dans le lecteur : la manche gagnée ouvre l'étape.
  const [won, setWon] = useState({});

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — الجذر التربيعي لعدد موجب"
      moduleSubtitle="تعريف، رمز، وخاصيتان"
      estimatedTime="10 دقائق"
      objectives={['كيف نعرّف الجذر التربيعي لعدد موجب، وكيف نتحقّق من نتيجته؟', 'ماذا نحصل عليه إذا ربّعنا جذرًا تربيعيًا؟ وإذا أخذنا جذر مربّع عدد؟']}
      intro={
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m2-squares" rounds={M2_ROUNDS} icon="🌷" freeIcon="🌻"
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
            <Manipulation
              type="square-root-side"
              mode="refine"
              num={4}
              den={100}
              scale={100}
              levels={false}
              lead="مربّع مساحته 0,04. هل طول ضلعه 0,2؟ تحقّق: احصر الضلع بين تدريجتين، ثم دقّق."
            />
          )}
        />
      }
      steps={[
        {
          needsRound: { id: 'r1', label: 'الجولة 1', icon: '🌷', won: Boolean(won.r1) }, num: 1, title: 'التعريف والرمز', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'لماذا $\\sqrt{\\dfrac{25}{9}} = \\dfrac{5}{3}$ ؟'}</MathText>}
                options={[
                  <MathText key="a">{'لأن $\\dfrac{25}{9} \\div 2 = \\dfrac{5}{3}$'}</MathText>,
                  <MathText key="b">{'لأن $\\dfrac{5}{3}$ عدد موجب و $\\left(\\dfrac{5}{3}\\right)^2 = \\dfrac{25}{9}$'}</MathText>,
                  <MathText key="c">{'لأن $-\\dfrac{5}{3}$ عدد موجب'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['jidhr-taarif']}
                explain={<MathText>{'نتحقق دائمًا بشرطين: العدد موجب، ومربّعه يساوي العدد الذي تحت الرمز — كما في $\\sqrt{4} = 2$ لأن 4 عدد موجب و $2^2 = 4$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && (
                <>
                  <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />
                  <TextbookBox kind="example" lines={KNOWLEDGE.examples} compact />
                </>
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'الخاصية 1: مربع الجذر التربيعي', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'$(\\sqrt{1{,}7})^2 = \\ldots$'}</MathText>}
                options={['2,89', '1,7', <MathText key="r">{'$\\sqrt{1{,}7}$'}</MathText>]}
                correct={1}
                cols={3}
                requires={['jidhr-taarif']}
                explain={<MathText>{'$\\sqrt{1{,}7}$ هو العدد الموجب الذي مربّعه 1,7: إذن $(\\sqrt{1{,}7})^2 = 1{,}7$. أمّا 2,89 فهو $1{,}7^2$.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="murabba-jidhr" lead={<MathText>{'في السؤال 4 من النشاط وجدت $(\\sqrt{5})^2 = 5$. هذا صحيح لكل عدد موجب:'}</MathText>} />}
            </div>
          ),
        },
        {
          num: 3, title: 'الخاصية 2: الجذر التربيعي لمربع', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'$\\sqrt{21{,}6^2} = \\ldots$'}</MathText>}
                options={['466,56', <MathText key="r">{'$\\sqrt{21{,}6}$'}</MathText>, '21,6']}
                correct={2}
                cols={3}
                requires={['jidhr-taarif']}
                explain={<MathText>{'21,6 عدد موجب ومربّعه $21{,}6^2$: إذن $\\sqrt{21{,}6^2} = 21{,}6$ — دون حساب $21{,}6^2 = 466{,}56$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="jidhr-murabba" lead={<MathText>{'ووجدت أيضًا $\\sqrt{2^2} = 2$ ، $\\sqrt{3^2} = 3$ ، $\\sqrt{5^2} = 5$:'}</MathText>} />}
            </div>
          ),
        },
        { num: 4, title: 'ورقة إلياس: أين الخطأ؟', subtitle: 'جد السطر الخاطئ وصحّحه', done: q4,
          content: <PeerSheet sheet={PEER_SHEET} kid={PEER_KID} onDone={() => setQ4(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
