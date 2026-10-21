import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : la machine aux trois bassins carrés d'un
 * معرض العلوم. UNE SEULE PISTE (§4quater) : le labo `pythagoras-tanks` en haut, sans carte au-dessus — il porte son contexte et SA question.
 *   مبتدئ — bras 3 et 4 : la main tient l'ANGLE en A ; plein juste à 90° seulement ; un angle plus petit déborde, un plus grand laisse un vide ;
 *   متقدم — 5 et 12 : la main tient la LONGUEUR BC ; il faut prévoir 13 ; puis 2 et 3 : la touche √ (√13).
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES versements : pourquoi le plein juste à 90° seulement (P1), ce que dit une égalité qui
 * ne tient pas (P4), comment prévoir 13 sans essayer (P2). Les noms (briques) viennent APRÈS la réponse. Le نشاط 1 du manuel (Perigal) est
 * posé en application au module 4 ; la touche √ est nommée au module 3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  // Les essais de « جرّب أعدادك » (free: true) ne comptent pas ici.
  const record = (e) => { if (!e.free) setTrials((list) => [...list, e]); };
  const pours = trials.filter((e) => e.kind === 'pour');
  const exact = pours.find((e) => e.mode === 'angle' && e.verdict === 'exact');
  const over = pours.find((e) => e.mode === 'angle' && e.verdict === 'over');
  const gap = pours.find((e) => e.mode === 'angle' && e.verdict === 'gap');
  const thirteen = pours.find((e) => e.mode === 'length' && e.task === 'thirteen' && e.verdict === 'exact');

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا لم يمتلئ الحوض الكبير تمامًا إلا عند زاوية واحدة؟', 'ماذا نقول عن مثلث لا تتحقّق فيه المساواة؟', 'كيف نتنبّأ بطول الضلع الثالث دون أن نجرّب؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — آلة الأحواض المربعة"
      moduleSubtitle="ماء ومربعات"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="pythagoras-tanks" level="beginner" mode={LAB.beginner.mode} b={LAB.beginner.b} c={LAB.beginner.c} onTrial={record} />,
            advanced: () => <Manipulation type="pythagoras-tanks" level="advanced" mode={LAB.advanced.mode} b={LAB.advanced.b} c={LAB.advanced.c} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا امتلأ الحوض الكبير تمامًا عند زاوية واحدة فقط؟', subtitle: 'سكبتَ الماء', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="exact" ok={!!exact && !!over}
                done={<span>عند <Ltr>{over?.angle}°</Ltr> فاض الماء، وعند <Ltr>{exact?.angle}°</Ltr> امتلأ الحوض الكبير تمامًا بـ <Ltr>{LAB.water} cm²</Ltr>.</span>}
                todo="في المستوى المبتدئ اسكب الماء مرّة يفيض فيها ومرّة يمتلئ فيها الحوض الكبير تمامًا، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>في الحوضين الصغيرين دائمًا <Ltr>{'9 + 16 = 25'}</Ltr> cm² من الماء. لماذا لم يمتلئ الحوض الكبير تمامًا إلا حين صارت الزاوية في A قائمة؟</span>}
                options={[
                  M('لأنّ مساحة المربع المنشأ على $[BC]$ لا تساوي 25 إلا حين تكون الزاوية في A قائمة'),
                  M('لأنّ كمية الماء تتغيّر حين نحرّك الذراع'),
                  M('لأنّ الحوض الكبير يكبر حين نغلق الزاوية'),
                ]}
                correct={0} cols={1} requires={['masahat-murabba-mustatil']}
                explain={<MathText>{'الماء لم يتغيّر: $9+16=25$. الذي يتغيّر هو المربع المنشأ على $[BC]$: يصغر حين نغلق الزاوية فيفيض الماء، ويكبر حين نفتحها فيبقى فراغ، ولا تبلغ مساحته 25 بالضبط إلا عند الزاوية القائمة.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="fitaghuras" lead="25 = 16 + 9 عند الزاوية القائمة فقط: ماذا يساوي مربع الضلع المقابل لها؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا يقول لنا ماء يفيض أو فراغ يبقى؟', subtitle: 'زاوية أصغر وزاوية أكبر', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="contrast" ok={!!over && !!gap}
                done={<span>عند <Ltr>{over?.angle}°</Ltr> فاض الماء، وعند <Ltr>{gap?.angle}°</Ltr> بقي فراغ.</span>}
                todo="في المهمّة الثانية من المستوى المبتدئ اسكب مرّة بزاوية أصغر ومرّة بزاوية أكبر، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>في مثلث ABC وجدتَ أنّ <Ltr>BC² ≠ AB² + AC²</Ltr>. ماذا تستنتج عن الزاوية في A؟</span>}
                options={[
                  M('ليست قائمة: المثلث غير قائم في A'),
                  M('قائمة دائمًا، فالمساواة لا تهمّ'),
                  M('لا يمكن أن نقول عنها شيئًا'),
                ]}
                correct={0} cols={1} requires={['murabba-adad']}
                explain={<MathText>{'لو كانت الزاوية في A قائمة لامتلأ الحوض تمامًا، أي $BC^2=AB^2+AC^2$. فإذا لم تتحقّق المساواة فالزاوية ليست قائمة.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="ghayr-qaim" lead="فيضان أو فراغ: المساواة لم تتحقّق. ماذا تقول عن المثلث؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'كيف كنتَ ستعرف 13 دون أن تجرّب؟', subtitle: 'الآلة 5 و 12', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="thirteen" ok={!!thirteen}
                done={<span>مع <Ltr>5</Ltr> و <Ltr>12</Ltr> امتلأ الحوض الكبير تمامًا عند <Ltr>BC = {thirteen?.bc} cm</Ltr>.</span>}
                todo="في المستوى المتقدّم اضبط طول [BC] حتى يمتلئ الحوض الكبير تمامًا، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>في الآلة الثانية <Ltr>AB = 12</Ltr> و <Ltr>AC = 5</Ltr>. كيف تجد الطول الذي يملأ الحوض الكبير دون أن تجرّب على الشريط؟</span>}
                options={[
                  M('$12^2+5^2=169$ ، والعدد الذي مربعه 169 هو 13'),
                  M('$12+5=17$'),
                  M('$12-5=7$'),
                ]}
                correct={0} cols={1} requires={['fitaghuras']}
                explain={<MathText>{'الحوض الكبير يمتلئ حين تكون مساحته مجموع المساحتين: $BC^2=144+25=169$ ، و $13\\times13=169$. أمّا 17 فأطول من أن يُغلق المثلث.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="hisab-watar" lead="من 5 و 12 إلى 13: كيف نحسب الضلع المقابل للزاوية القائمة؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
