import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : la « لوحة الأسعار ». UNE SEULE PISTE
 * (§4quater) : le labo `fourth-gauges` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient le nombre qui
 * MANQUE dans un tableau de prix, trois balances d'égalité penchent sous le doigt.
 *   مبتدئ — 4 kg → 520 DA / 6 kg → ? (780) ; une quantité à trouver ; 8 kg → 400 DA / 12 kg → ? où la balance « الفرق » ment (404) ;
 *   متقدم — balances voilées, décimaux, le trou en b, a, d.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES essais : pourquoi les balances s'équilibrent ensemble (P1), pourquoi on ne garde
 * pas le prix de la balance « الفرق » (P1), ce que disent les produits en croix à l'équilibre (P2). Les noms (briques) viennent APRÈS la
 * réponse. Le نشاط 2 du manuel (l'éprouvette graduée) est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children)}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const mine = trials.filter((e) => e.kind === 'release' && !e.free);
  // la tâche 1 (4 kg → 520 DA, 6 kg → ?) juste ; la balance « الفرق » allumée seule dans la tâche 3 (8 kg → 400 DA, 12 kg → ?)
  const fair = mine.findLast((e) => e.task === 0 && e.ok);
  const lie = mine.findLast((e) => e.task === 2 && e.decoyHit);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['متى تتوازن الموازين الثلاثة معًا؟', 'لماذا لا نقبل الثمن الذي يضيء له ميزان الفرق؟', 'ماذا يقول ميزان الجداءين عند الثمن العادل؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — لوحة الأسعار"
      moduleSubtitle="بطاقة ناقصة وموازين العدالة"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="fourth-gauges" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="fourth-gauges" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ماذا تؤكّد الموازين الثلاثة؟', subtitle: 'الثمن العادل', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="fair" ok={!!fair}
                done={<span>ضبطتَ ثمن <Ltr>6</Ltr> kg على <Ltr>{fair?.value}</Ltr> DA فتوازنت الموازين الثلاثة معًا.</span>}
                todo="أنجز في المستوى المبتدئ المهمّة الأولى (ثمن 6 kg)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>عند <Ltr>780</Ltr> DA ، ماذا يعني توازن ميزان «في الكيلو» (علمًا أنّ <Ltr>4</Ltr> kg بـ <Ltr>520</Ltr> DA)؟</span>}
                options={[
                  M('ثمن الكيلوغرام الواحد هو نفسه في العمودين: $130$ DA'),
                  M('الثمن الكلي هو نفسه في العمودين'),
                  M('الفرق بين الثمنين يساوي الفرق بين الكتلتين'),
                ]}
                correct={0} cols={1} requires={['jadwal-tanasubiya']}
                explain={<MathText>{'$520 \\div 4 = 130$ و $780 \\div 6 = 130$ : ثمن الكيلوغرام لم يتغيّر. أمّا الثمنان فمختلفان، والفرق بينهما $260$ لا $2$ .'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="rabi" lead="ثلاثة أعداد معلومة وعدد واحد يوازنها: ما اسمه؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'لماذا لا نقبل ثمن ميزان الفرق؟', subtitle: 'ميزان يكذب', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="lie" ok={!!lie}
                done={<span>وضعتَ الثمن <Ltr>{lie?.value}</Ltr> DA لـ <Ltr>12</Ltr> kg فأضاء ميزان الفرق وحده.</span>}
                todo="أنجز في المستوى المبتدئ المهمّة الثالثة: اضبط الثمن حتى يتوازن ميزان «الفرق» أوّلًا، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>أضاء ميزان الفرق عند <Ltr>404</Ltr> DA ولم يتوازن غيره. لماذا لا نقبل هذا الثمن لـ <Ltr>12</Ltr> kg ؟</span>}
                options={[
                  M('لأنّ ثمن الكيلوغرام يتغيّر: $50$ DA في العمود الأوّل وأقلّ من $34$ DA في الثاني'),
                  M('لأنّ $12$ kg لا يمكن أن يكون ثمنها عددًا عشريًا'),
                  M('لأنّ ميزان الفرق لم يضئ فعلًا'),
                ]}
                correct={0} cols={1} requires={['itmam-jadwal']}
                explain={<MathText>{'$400 \\div 8 = 50$ بينما $404 \\div 12$ أقلّ من $34$ . ' + GUIDE.addDiff.why}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="farq" lead="نزيد الكتلة بـ 4 فهل نزيد الثمن بـ 4 ؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'ماذا يقول ميزان الجداءين؟', subtitle: 'الجداءان المتصالبان', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="cross" ok={!!fair}
                done={<span>عند <Ltr>{fair?.value}</Ltr> DA توازن ميزان «الجداءان» أيضًا.</span>}
                todo="أنجز في المستوى المبتدئ المهمّة الأولى (ثمن 6 kg)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>الجدول <Ltr>4</Ltr> ؛ <Ltr>6</Ltr> في الأعلى و <Ltr>520</Ltr> ؛ <Ltr>780</Ltr> في الأسفل. ما العلاقة بين جداءي القطرين؟</span>}
                options={[
                  M('$4 \\times 780 = 520 \\times 6 = 3120$'),
                  M('$4 \\times 780 > 520 \\times 6$'),
                  M('$4 \\times 520 = 780 \\times 6$'),
                ]}
                correct={0} cols={1} requires={['rabi']}
                explain={<MathText>{'$4 \\times 780 = 3120$ و $520 \\times 6 = 3120$ . أمّا $4 \\times 520 = 2080$ و $780 \\times 6 = 4680$ فليسا متساويين.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="jidaan" lead="جداءا القطرين عند الثمن العادل: ماذا نقول عنهما؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
