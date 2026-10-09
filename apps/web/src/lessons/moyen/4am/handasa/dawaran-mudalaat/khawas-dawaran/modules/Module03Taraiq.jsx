import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD, NOW155, CENTER, LAB } from '../content/textbook';
import { FIG_METHOD, FIG_METHOD_TURN, FIG_NOW155, FIG_NOW155_SOL } from '../content/figures';

/**
 * Module 3 — طرائق p. 155 « استعمال خواص الدّوران في الإنشاءات », دوري الآن, et le centre d'un دوران (ajout DÉCLARÉ).
 * TOUCH THE MATH : le même workspace qu'au module 1, ouvert sur متقدم (la طريقة elle-même) — la copie de [AC] tournée
 * jusqu'à [BD], les deux affirmations prouvées par cartes, puis l'exercice 18 ouvert par l'élève.
 * FORMALIZE : 1) la طريقة, énoncé COMPLÉTÉ (« قائم في O », le sens — la figure seule les donnait), solution révélée ligne à
 * ligne (MethodSteps) → brique istimal-khawas ; 2) دوري الآن : l'image d'un angle de 45° par (K, 60°) — figure REDESSINÉE
 * (avec le K du manuel, B′ tombait sur A) → brique surat-zawiya ; 3) le centre : deux médiatrices → brique markaz-dawaran.
 * LP : P2 (prouver), P3 (construire des images, trouver le centre).
 * « أتوقّع القاعدة » : la solution du manuel (MethodSteps) énonce la méthode avant sa brique → enveloppée dans
 * <PredictRule id="istimal-khawas"> ; ni la question ni l'explain de دوري الآن ne décrivent plus la construction (« ننشئ O′ و A′ و
 * B′ », NOW155.answer : la brique surat-zawiya la montre APRÈS la prédiction, la figure-solution la suit), seulement la
 * conservation de l'angle (déjà posée au module 2).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Taraiq() {
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طرائق — نثبت بدوران"
      moduleSubtitle="قطعة صورة أخرى بدوران: هما متقايستان، وبزاوية $90^\circ$ متعامدتان"
      estimatedTime="10 دقائق"
      brief={{
        tag: 'طرائق — الكتاب ص 155', title: METHOD.title, tone: 'emerald',
        body: <p>في المستوى «متقدم» من الورقة الشفافة: أدر نسخة [AC] حتى تنطبق على [BD]، ثم أثبت العبارتين ببطاقات الخواص. بعدها اقرأ حلّ الكتاب سطرا سطرا.</p>,
        footer: <SourceTag source={METHOD.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الورقة الشفافة"
          defaultLevel="beginner"
          lead="المستوى «متقدم» هو طريقة الكتاب: لا زاوية ولا اتجاه معطيان."
          levels={{
            beginner: () => (
              <Manipulation type="shape-turn" level="beginner" numbers={LAB.beginner.numbers} theme="zellige"
                title="وردة الزليج: ورقة شفافة تدور حول دبوس" />
            ),
            advanced: () => (
              <Manipulation type="shape-turn" level="advanced" numbers={LAB.advanced.numbers} theme="zellige"
                title="طريقة الكتاب (ص 155): [AC] و [BD]" />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'طريقة الكتاب', subtitle: '[BD] صورة [AC]', done: !!q[1],
          content: (
            <div className="space-y-3">
              <GeoFigure {...FIG_METHOD} />
              <p className="text-xs text-slate-500" data-correction><MathText>{METHOD.stated}</MathText></p>
              {/* La solution du manuel ÉNONCE la méthode avant sa brique : une seule prédiction (istimal-khawas), puis
                  la solution, la question et la brique — guide PREDICT §3.5. */}
              <PredictRule id="istimal-khawas"><MethodSteps method={METHOD} /></PredictRule>
              <TapQuestion
                prompt={<MathText>{'لماذا B صورة A بالدوران الذي مركزه O وزاويته $90^\\circ$ ؟'}</MathText>}
                options={[
                  'لأن $OA = OB$ و $\\widehat{AOB} = 90^\\circ$ (المثلث OAB قائم في O ومتساوي الساقين)',
                  'لأن $AC = BD$', // c'est la conclusion, pas la raison
                  'لأن القطعتين [AC] و [BD] متقاطعتان', // ne dit rien de OA, OB
                ].map(M)}
                correct={0}
                cols={1}
                requires={['surat-nuqta-dawaran']}
                explain={<MathText>{'صورة A بدوران مركزه O: نفس البعد عن O ($OB = OA$) والزاوية $\\widehat{AOB}$ هي زاوية الدوران؛ ومن A إلى B عكس عقارب الساعة.'}</MathText>}
                onAnswered={mark(1)}
              />
              {q[1] && (
                <>
                  <GeoFigure {...FIG_METHOD_TURN} />
                  <KnowledgeBrick id="istimal-khawas" lead="الطريقة، في سطر واحد:" />
                </>
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'دوري الآن', subtitle: 'صورة زاوية', done: !!q[2],
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={NOW155.text} source={NOW155.source} compact />
              <GeoFigure {...FIG_NOW155} />
              <NumericQuestion
                prompt={<MathText>{"ما قيس صورة الزاوية $\\widehat{AOB}$ بهذا الدوران، بالدرجات؟"}</MathText>}
                expected={45}
                requires={['khawas-dawaran']}
                explain={<MathText>{"الدوران يحافظ على الزوايا: قيس صورة $\\widehat{AOB}$ هو أيضا $45^\\circ$ ، مهما كانت زاوية الدوران."}</MathText>}
                explainFor={(n) => <MathText>{n === 105 ? 'لا نضيف زاوية الدوران: الدوران يحافظ على الزوايا.' : n === 60 ? 'هذه زاوية الدوران، لا قيس الصورة.' : 'الدوران يحافظ على الزوايا.'}</MathText>}
                onAnswered={mark(2)}
              />
              {q[2] && (
                <>
                  {/* la brique d'abord : tant que la prédiction est attendue, la figure-solution (qui MONTRE la
                      construction) reste masquée — elle la suit dans le même conteneur */}
                  <KnowledgeBrick id="surat-zawiya" />
                  <GeoFigure {...FIG_NOW155_SOL} />
                </>
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'مركز دوران', subtitle: 'معارف من المنصّة', done: !!q[3],
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="markaz-dawaran" lead="ما يفعله الدبوس في المستوى «متقدم» (تمرين 18):" />
              <TapQuestion
                prompt={<MathText>{"M′ و N′ صورتا M و N بدوران مركزه W، لكن محوري [MM′] و [NN′] منطبقان. كيف نجد W؟"}</MathText>}
                options={[
                  'نرسم محور قطعة أخرى تصل نقطة بصورتها، مثل [PP′]',
                  'نأخذ W منتصف [MM′]', // OM = OM′ mais pas ON = ON′ en général
                  'لا يوجد مركز لهذا الدوران', // le centre existe : W
                ].map(M)}
                correct={0}
                cols={1}
                requires={['markaz-dawaran']}
                explain={<MathText>{CENTER.warning}</MathText>}
                onAnswered={mark(3)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
