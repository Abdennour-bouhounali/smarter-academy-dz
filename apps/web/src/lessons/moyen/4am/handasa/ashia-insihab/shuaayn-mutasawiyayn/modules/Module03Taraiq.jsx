import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD_IMAGE, CONSTRUCTION, METHOD_EQUAL, NOW, LAB } from '../content/textbook';
import { FIG_METHOD_IMAGE, FIG_METHOD_EQUAL } from '../content/figures';

/**
 * Module 3 — طرائق (p. 131) : « إنشاء صورة نقطة بانسحاب عُلم شعاعه » avec LA BANDEROLE (parallelogram-pin, متقدم ouvert
 * par défaut : c'est la طريقة du manuel, le niveau avancé du lab) ; la solution du manuel révélée ligne à ligne
 * (MethodSteps), puis la construction au compas ligne à ligne (plateforme, déclarée) ; « إثبات تساوي شعاعين » ; دوري الآن.
 * Les briques surat-nuqta et ithbat-tasawi NOMMENT ce que la main a fait. AUCUNE étape n'attend `onFinished`.
 * LP : P3 (1–2), P2 (3–4).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Taraiq() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طرائق — صورة نقطة بانسحاب، وإثبات تساوي شعاعين"
      moduleSubtitle="نكمل متوازي أضلاع لننشئ صورة نقطة، ونستند إلى متوازي أضلاع لنبرهن"
      estimatedTime="10 دقائق"
      brief={{
        tag: 'طرائق — الكتاب ص 131', title: METHOD_IMAGE.title, tone: 'emerald',
        body: <p>ضع أولا ركن الراية D صورة C بالانسحاب الذي شعاعه AB، ثم النقطة E. بعدها اقرأ حل الكتاب سطرا سطرا، وحاول أن تتوقّع السطر التالي قبل أن تكشفه.</p>,
      }}
      intro={
        <ManipulationWorkspace
          title="الطريقة بيدك"
          defaultLevel="beginner"
          lead="الشبكة شبكة المدرّج: عدّ المربعات من A إلى B، ثم أعِد الحركة نفسها."
          levels={{
            beginner: () => (
              <Manipulation type="parallelogram-pin" level="beginner" {...LAB.beginner.numbers} theme="tifo" title="الوشاح: أين يقف قائد المدرّج؟" />
            ),
            advanced: () => (
              <Manipulation type="parallelogram-pin" level="advanced" {...LAB.advanced.numbers} theme="tifo" title="طرائق: راية التيفو، D صورة C ثم النقطة E" />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'صورة نقطة بانسحاب', subtitle: 'الطريقة 1، السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <GeoFigure {...FIG_METHOD_IMAGE} />
              {/* La طريقة du manuel ÉNONCE la règle surat-nuqta : l'élève l'écrit d'abord (« أتوقّع القاعدة »), après le lab. */}
              <PredictRule id="surat-nuqta">
                <MethodSteps method={{ ...METHOD_IMAGE, solution: METHOD_IMAGE.solution.slice(0, 4) }} />
                <p className="text-xs text-slate-500">{METHOD_IMAGE.note}</p>
              </PredictRule>
              <TapQuestion
                prompt={<MathText>{'D صورة C بالانسحاب الذي شعاعه $\\overrightarrow{AB}$ يعني:'}</MathText>}
                options={[
                  '$\\overrightarrow{CD} = \\overrightarrow{AB}$ ، أي ABDC متوازي أضلاع',
                  '$\\overrightarrow{DC} = \\overrightarrow{AB}$ ، أي ABCD متوازي أضلاع', // la flèche part de C : la banderole se croise
                  '$\\overrightarrow{AD} = \\overrightarrow{BC}$', // ce sont les diagonales
                ].map(M)}
                correct={0}
                cols={1}
                requires={['tasawi-shuaayn', 'mutawazi-shuaa']}
                explain={<MathText>{`${METHOD_IMAGE.solution[1]} (${METHOD_IMAGE.note})`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="surat-nuqta" lead="ما فعلته بالراية، بكلمات الطريقة:" />}
              {q1 && <MethodSteps method={CONSTRUCTION} />}
            </div>
          ),
        },
        {
          num: 2, title: 'النقطة E', subtitle: 'الطريقة 1، السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="solution" lines={METHOD_IMAGE.solution.slice(4)} source={METHOD_IMAGE.source} compact />
              <TapQuestion
                prompt={<MathText>{'النقطة E حيث $\\overrightarrow{EB} = \\overrightarrow{AC}$ هي:'}</MathText>}
                options={[
                  'نظيرة D بالنسبة إلى B',
                  'صورة B بالانسحاب الذي شعاعه $\\overrightarrow{AC}$', // c'est D (BD = AC)
                  'نظيرة B بالنسبة إلى D', // B est le milieu, pas D
                ].map(M)}
                correct={0}
                cols={1}
                requires={['surat-nuqta', 'muntasaf-shuaa']}
                explain={<MathText>{'$\\overrightarrow{EB} = \\overrightarrow{AC} = \\overrightarrow{BD}$ : B منتصف [DE]. أما صورة B بالانسحاب الذي شعاعه $\\overrightarrow{AC}$ فهي D نفسها ($\\overrightarrow{BD} = \\overrightarrow{AC}$).'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'إثبات تساوي شعاعين', subtitle: 'الطريقة 2', done: q3,
          content: (
            <div className="space-y-3">
              <GeoFigure {...FIG_METHOD_EQUAL} />
              {/* Le cadre « طريقة » (METHOD_EQUAL.rule) est la règle ithbat-tasawi : il vient avec la brique, après la prédiction. */}
              <MethodSteps method={{ ...METHOD_EQUAL, rule: undefined }} />
              <TapQuestion
                prompt="لماذا A منتصف [BD]؟"
                options={[
                  '$\\overrightarrow{AD} = \\overrightarrow{BA}$ ، أي $\\overrightarrow{BA} = \\overrightarrow{AD}$',
                  'لأن C نظيرة O بالنسبة إلى A', // c'est le milieu de [OC]
                  'لأن AD = BA في الطول فقط', // la longueur seule ne situe pas A
                ].map(M)}
                correct={0}
                cols={1}
                requires={['muntasaf-shuaa']}
                explain={<MathText>{'$\\overrightarrow{BA} = \\overrightarrow{AD}$ : حسب معارف 3، A منتصف [BD]. ومع A منتصف [OC] يكون الرباعي OBCD متوازي أضلاع قطراه متناصفان، فـ $\\overrightarrow{OD} = \\overrightarrow{BC}$ .'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="ithbat-tasawi" lead="القاعدة التي يكتبها الكتاب بعد الحل:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'دوري الآن', subtitle: 'المستقيمان (EG) و (FK)', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={NOW.text} source={NOW.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">أتمم البرهان:</p>}
                rows={[
                  { id: 'fe', label: <MathText>{'من $\\overrightarrow{FH} = \\overrightarrow{HE}$'}</MathText>, options: ['H منتصف [FE]', 'F منتصف [HE]', 'E منتصف [FH]'], correct: 0, correction: 'H مشتركة في الوسط: H منتصف [FE].' },
                  { id: 'kg', label: <MathText>{'من $\\overrightarrow{KH} = \\overrightarrow{HG}$'}</MathText>, options: ['H منتصف [KG]', 'K منتصف [HG]', 'G منتصف [KH]'], correct: 0, correction: 'H منتصف [KG].' },
                  {
                    id: 'ccl', label: 'إذن',
                    // FEGK : [FE] y serait un côté ; « (EG) et (FK) sécantes en H » : H est sur [FE] et [KG]
                    options: ['FGEK متوازي أضلاع قطراه [FE] و [GK]، ومنه $\\overrightarrow{GE} = \\overrightarrow{FK}$ و (EG) // (FK)', 'FEGK متوازي أضلاع', '(EG) و (FK) متقاطعان في H'].map(M),
                    correct: 0, correction: <MathText>{NOW.answer}</MathText>,
                  },
                ]}
                requires={['muntasaf-shuaa', 'mutawazi-shuaa']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: منتصف مشترك، متوازي أضلاع، ثم شعاعان متساويان.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
