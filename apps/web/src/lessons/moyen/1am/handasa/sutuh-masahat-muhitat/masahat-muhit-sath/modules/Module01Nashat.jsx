import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le حوش paré de zellige. UNE SEULE PISTE
 * (§4quater) : le labo `tile-yard` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient UNE DALLE.
 *   مبتدئ — douze dalles à déplacer : l'aire reste douze, la clôture change (la plus courte, puis exactement 20) ;
 *   متقدم — un rouleau de clôture de longueur fixe : des cours de 5 à 9 dalles avec le même périmètre.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES nombres : pourquoi les dalles restent douze quand la clôture change (P1), pourquoi la
 * clôture raccourcit quand les dalles se touchent par plus de côtés (P1), ce que dit un même rouleau pour deux cours (P3). Les noms (briques)
 * viennent APRÈS la réponse. Le نشاط 1 du manuel est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  // Aucune saisie libre dans ce labo : chaque geste validé est un essai.
  const record = (e) => setTrials((list) => [...list, e]);
  const changed = trials.find((e) => e.kind === 'move' && e.mode === 'fence' && e.fence !== e.prevFence);
  const keptFence = trials.filter((e) => e.kind === 'keep' && e.mode === 'fence');
  const keptRope = trials.filter((e) => e.kind === 'keep' && e.mode === 'rope');
  const fences = [...new Set(keptFence.map((e) => e.fence))].sort((a, b) => a - b);
  const areas = [...new Set(keptRope.map((e) => e.tiles))].sort((a, b) => a - b);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا لا يتغيّر عدد البلاطات حين ننقلها؟', 'لماذا يقصر السياج حين تتلاصق البلاطات؟', 'هل يحدّد السياج عدد البلاطات؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — حوش الزليج"
      moduleSubtitle="بلاطات وسياج"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="tile-yard" level="beginner" world={LAB.beginner.world} mode={LAB.beginner.mode} onTrial={record} />,
            advanced: () => <Manipulation type="tile-yard" level="advanced" world={LAB.advanced.world} mode={LAB.advanced.mode} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا بقيت البلاطات اثنتي عشرة؟', subtitle: 'نقلتَ بلاطة', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="moved" ok={!!changed}
                done={<span>نقلتَ بلاطة فتغيّر السياج من <Ltr>{changed?.prevFence}</Ltr> إلى <Ltr>{changed?.fence}</Ltr> عصا وبقيت البلاطات <Ltr>{changed?.tiles}</Ltr>.</span>}
                todo="انقل في المستوى المبتدئ بلاطة واحدة على الأقل فيتغيّر طول السياج، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>نقلتَ بلاطة دون أن تضيف أخرى أو تزيل أخرى. لماذا بقي عدد البلاطات ثابتًا مع أنّ طول السياج تغيّر؟</span>}
                options={[
                  M('لأنّ البلاطات نفسها ما زالت تغطّي الأرض، وإنما تغيّر الحدّ الذي يحيط بها'),
                  M('لأنّ طول السياج يُحسب من عدد البلاطات ولا شأن له بأماكنها'),
                  M('لأنّ البلاطة بعد نقلها صارت أصغر'),
                ]}
                correct={0} cols={1} requires={['qiyas-atwal-ibtidai']}
                explain={<MathText>{'لم نُضف ولم نُزل أيّ بلاطة: الأرض التي تغطّيها البلاطات لم تتغيّر. أمّا السياج فيمرّ على أضلاع البلاطات الواقعة على الحدّ، وهذه تتغيّر بتغيّر المكان.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="masaha-adad" lead="اثنتا عشرة بلاطة مهما غيّرتَ ترتيبها: ماذا يقيس هذا العدد؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'لماذا يقصر السياج حين تتلاصق البلاطات؟', subtitle: 'الحوش الأقصر سياجًا', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="kept" ok={fences.length >= 2}
                done={<span>في دفترك حوشان بالبلاطات نفسها وسياجان مختلفان: <Ltr>{fences[0]}</Ltr> و <Ltr>{fences.at(-1)}</Ltr> عصا.</span>}
                todo="احتفظ في المستوى المبتدئ بحوشين مختلفي السياج على الأقل في الدفتر، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>كلّما التصقت البلاطات بعضها ببعض قصر السياج. لماذا؟</span>}
                options={[
                  M('لأنّ كل ضلعين ملتصقين يختفيان من الحدّ فلا يحتاجان إلى سياج'),
                  M('لأنّ البلاطات الملتصقة تصير أصغر حجمًا'),
                  M('لأنّ السياج لا يمرّ إلا بين البلاطات المتباعدة'),
                ]}
                correct={0} cols={1} requires={['masaha-adad']}
                explain={<MathText>{'ضلع بلاطة ملتصق بضلع بلاطة أخرى لا يقع على الحدّ: يسقط من السياج. كلّما كثرت الأضلاع الملتصقة قلّت الأضلاع التي يمرّ عليها السياج.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="mahit-hadd" lead="السياج يمرّ على أضلاع البلاطات الواقعة على الحدّ: ماذا يقيس طوله؟" />}
              {q2 && <KnowledgeBrick id="wahdat-tul-masaha" compact />}
            </div>
          ),
        },
        {
          num: 3, title: 'هل يكفي السياج ليحدّد عدد البلاطات؟', subtitle: 'حبل واحد وأحواش مختلفة', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="rope" ok={areas.length >= 2}
                done={<span>بالحبل نفسه (<Ltr>{LAB.rope}</Ltr> عصا) صنعتَ حوشًا فيه <Ltr>{areas[0]}</Ltr> بلاطات وآخر فيه <Ltr>{areas.at(-1)}</Ltr> بلاطات.</span>}
                todo="جرّب المستوى المتقدّم: احتفظ بحوشين على الأقل يستعملان الحبل كله بعددين مختلفين من البلاطات، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>بحبل واحد طوله <Ltr>{LAB.rope}</Ltr> عصا بنيتَ أحواشًا تستعمله كله. ماذا تستنتج عن عدد البلاطات داخل السياج؟</span>}
                options={[
                  M('السياج نفسه لا يحدّد عدد البلاطات: نحصل على مساحات مختلفة'),
                  M('السياج نفسه يعطي دائمًا الحوش نفسه بعدد البلاطات نفسه'),
                  M('الحوش الأكثر بلاطات هو الأطول سياجًا'),
                ]}
                correct={0} cols={1} requires={['mahit-hadd']}
                explain={<MathText>{'بالحبل نفسه وضعتَ خمس بلاطات في خطّ واحد، وتسعًا في مربّع من ثلاثة صفوف: السياج 12 عصا في الحالتين لكنّ عدد البلاطات مختلف. فالمحيط وحده لا يعيّن المساحة.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="naql-baqat-masaha" lead="في المستويين: ماذا بقي كما هو حين نقلتَ البلاطات، وماذا تغيّر؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
