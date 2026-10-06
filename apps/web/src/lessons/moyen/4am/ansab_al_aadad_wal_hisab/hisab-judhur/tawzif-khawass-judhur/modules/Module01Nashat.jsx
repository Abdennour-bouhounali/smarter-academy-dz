import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, TILING } from '../content/textbook';

/**
 * Module 1 — l'entrée dans la طريقة « نبحث عن أكبر مربع a² يقسم n » (p. 25).
 *
 * Le manuel n'a PAS d'activité pour cette leçon : c'est une page de طرائق.
 * Le laboratoire est donc une expérience de la PLATEFORME, déclarée
 * (`platform_adaptation`, lesson.config.js) — sa mathématique est la طريقة,
 * ses deux aires sont celles de l'exercice 18.
 *
 *   مبتدئ  — un carré d'aire 32 : k = 2 donne des dalles de 8, k = 4 des
 *            dalles de 2 ; la dalle de 8 se pave encore, celle de 2 non.
 *   متقدم  — le carré d'aire 288 (défaut) : six pavages justes, et k = 6
 *            donne une dalle de 8 qui « a l'air » petite sans l'être.
 *
 * Pourquoi 32 et non 18 : pour 18 le seul pavage non trivial est k = 3 ;
 * la découverte « le plus grand k donne la plus petite dalle » exige deux
 * pavages justes (logic/squareTiling.js `discoveryReady`), donc une aire
 * qui a deux carrés diviseurs > 1.
 *
 * AUCUNE étape n'attend `onFinished` : ce n'est pas une activité du manuel
 * (MANIPULATION_CONTRACT §7bis). `onFinished` sert seulement à lister, au-
 * dessus de la question, ce que l'élève a trouvé lui-même.
 *
 * Étapes : (1) pourquoi 6√8 ne suffit pas pour √288 — depuis ses pavages ;
 * (2) la brique « kitaba-a-jidhr-b », puis la question 1) du تمرين 1 du
 * manuel : √8, √18, √50. LP : P1.
 */
const largestSquare = (n) => { let a = 1; for (let k = 1; k * k <= n; k += 1) if (n % (k * k) === 0) a = k; return a; };
const simplestTex = (n) => { const a = largestSquare(n); const b = n / (a * a); return `\\sqrt{${n}} = \\sqrt{${a}^2 \\times ${b}} = ${a}\\sqrt{${b}}`; };

export default function Module01Nashat() {
  const [found, setFound] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { beginner, advanced } = TILING.numbers;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="مربّع مبلّط — أبسط كتابة لجذر"
      moduleSubtitle="أكبر مربّع يقسم العدد"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'طرائق — الكتاب ص 25',
        headline: 'بلّط المربّع!',
        emoji: '🧱',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p><MathText>{'مربّع مساحته 288. نريد تبليطه ببلاطات مربّعة متساوية مساحة كل منها عدد طبيعي. كلّ تبليط يعطي كتابة لطول ضلعه $\\sqrt{288}$؛ أيّها أبسط؟'}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY.questions[0]}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={TILING.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="نفس الفكرة في المستويين: كلما زاد عدد البلاطات على الضلع صغرت البلاطة — إلى أين؟"
          defaultLevel="advanced"
          levels={{
            beginner: () => (
              <Manipulation
                type="square-tiling"
                level="beginner"
                n={beginner}
                mode="simplest"
                lead="ابدأ ببلاطتين على الضلع، ثم جرّب أعدادًا أخرى: أيّ بلاطة لا يمكن تبليطها من جديد؟"
                onFinished={() => setFound((f) => ({ ...f, [beginner]: true }))}
              />
            ),
            advanced: () => (
              <Manipulation
                type="square-tiling"
                n={advanced}
                mode="simplest"
                lead="بلّط المربّع بكل الطرق التي تقبلها المساحة 288، وقارن البلاطات."
                onFinished={() => setFound((f) => ({ ...f, [advanced]: true }))}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أيّ تبليط يعطي أبسط كتابة؟', subtitle: 'بلّط المربّع في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {/* CE QUE L'ÉLÈVE A TROUVÉ, et rien d'autre : la réponse de chaque
                  niveau n'apparaît qu'après SA découverte dans le laboratoire. */}
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {[beginner, advanced].map((n) => (
                  <li key={n} className={found[n] ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={n} data-tried={found[n] ? 'true' : 'false'}>
                    {found[n]
                      ? <MathText>{`المربّع ${n}: وجدتَ أصغر بلاطة — $${simplestTex(n)}$`}</MathText>
                      : `المربّع ${n}: لم تصل بعد إلى أصغر بلاطة (${n === beginner ? 'المستوى المبتدئ' : 'المستوى المتقدّم'}).`}
                  </li>
                ))}
              </ul>
              <TapQuestion
                prompt={<span>مع <MathText>{'$k = 6$'}</MathText> مساحة كل بلاطة 8، فنكتب <MathText>{'$\\sqrt{288} = 6\\sqrt{8}$'}</MathText>. لماذا ليست هذه أبسط كتابة؟</span>}
                options={[
                  <MathText key="a">{'لأن $6\\sqrt{8}$ لا يساوي $\\sqrt{288}$'}</MathText>,
                  <MathText key="b">{'لأن البلاطة 8 نفسها تُبلَّط من جديد: $8 = 2^2 \\times 2$'}</MathText>,
                  <MathText key="c">{'لأن 6 ليس قاسمًا للعدد 288'}</MathText>,
                  <MathText key="d">{'لأن مساحة البلاطة 8 ليست عددًا طبيعيًا'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['jidhr-a2b']}
                explain={<MathText>{'$\\sqrt{288} = 6\\sqrt{8}$ صحيحة، لكن $\\sqrt{8} = 2\\sqrt{2}$، إذن $\\sqrt{288} = 6 \\times 2\\sqrt{2} = 12\\sqrt{2}$: أكبر مربّع يقسم 288 هو $144 = 12^2$، والبلاطة 2 لا تُبلَّط أكثر.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'تمرين 1 من الكتاب — السؤال 1', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="kitaba-a-jidhr-b" lead="ما فعلته بالبلاطات، يقوله الكتاب في طريقة:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[0]}</MathText></p>}
                rows={[
                  { id: 'r8', label: <MathText>{'$\\sqrt{8} = $'}</MathText>, options: [<MathText key="a">{'$4\\sqrt{2}$'}</MathText>, <MathText key="b">{'$2\\sqrt{2}$'}</MathText>, <MathText key="c">{'$2\\sqrt{4}$'}</MathText>], correct: 1, correction: <MathText>{'$\\sqrt{8} = \\sqrt{2^2 \\times 2} = 2\\sqrt{2}$'}</MathText> },
                  { id: 'r18', label: <MathText>{'$\\sqrt{18} = $'}</MathText>, options: [<MathText key="a">{'$3\\sqrt{2}$'}</MathText>, <MathText key="b">{'$9\\sqrt{2}$'}</MathText>, <MathText key="c">{'$2\\sqrt{3}$'}</MathText>], correct: 0, correction: <MathText>{'$\\sqrt{18} = \\sqrt{3^2 \\times 2} = 3\\sqrt{2}$'}</MathText> },
                  { id: 'r50', label: <MathText>{'$\\sqrt{50} = $'}</MathText>, options: [<MathText key="a">{'$25\\sqrt{2}$'}</MathText>, <MathText key="b">{'$2\\sqrt{5}$'}</MathText>, <MathText key="c">{'$5\\sqrt{2}$'}</MathText>], correct: 2, correction: <MathText>{'$\\sqrt{50} = \\sqrt{5^2 \\times 2} = 5\\sqrt{2}$'}</MathText> },
                ]}
                requires={['kitaba-a-jidhr-b']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'تمامًا: الأعداد الثلاثة تُكتب بدلالة $\\sqrt{2}$ — المحور التالي يستعمل ذلك لتبسيط A.'
                      : 'انتبه: $a$ هو جذر المربّع، لا المربّع نفسه ($\\sqrt{9} = 3$)، و $b$ هو ما يبقى بعد القسمة على أكبر مربّع.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ2(true)}
              />
              {/* « مسألة الدرس » : le même carré dallé, une autre aire (module 6). */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
