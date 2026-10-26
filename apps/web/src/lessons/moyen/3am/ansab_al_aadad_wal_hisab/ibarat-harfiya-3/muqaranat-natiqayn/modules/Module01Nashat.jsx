import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { FractionQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le galvanomètre du labo de physique. UNE SEULE PISTE (§4quater) : le labo `difference-meter` en haut,
 * sans carte au-dessus — il porte son contexte et SA question ; la main branche la sonde rouge et la noire sur deux perles et lit une aiguille. La règle n'est jamais dite : elle se lit sur l'aiguille.
 *   مبتدئ — d1 5/4 et 3/4, d2 −3/2 et −1/2 (l'échange), d3 9/11 et 13/16 (0,85 px) ;  متقدم — volet d'écriture (d4, d5), rideau (d6 : a − b = −0,3).
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES essais : le côté de l'aiguille (P1), l'échange des sondes (P1), deux perles qui se recouvrent (P2), l'ordre lu sur la différence seule (P1, P2).
 * Les noms (briques) viennent APRÈS la réponse. Le نشاط 5 du manuel est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q3b, setQ3b] = useState(false);
  const [q4, setQ4] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const solved = (id) => trials.find((e) => e.kind === 'solved' && e.taskId === id);
  const swapped = trials.find((e) => e.kind === 'swap');

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['أكتشف أنّ إشارة الفرق a − b تحدّد ترتيب العددين a و b']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — مقياس الفرق"
      moduleSubtitle="أصل المجسّين وأقرأ الإبرة"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="difference-meter" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="difference-meter" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'متى مالت الإبرة إلى اليمين؟', subtitle: 'جهة الإبرة', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="solved12" ok={!!solved('d1') && !!solved('d2')}
                done="وصلتَ المجسّين في الزوجين الأولين وحكمتَ على كل منهما بعد قراءة الإبرة."
                todo="أنهِ الزوجين الأولين على السكّة (الزوج 5/4 و 3/4 ثم الزوج −3/2 و −1/2)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في الزوجين الأولين على السكّة، متى مالت الإبرة إلى اليمين؟`}</MathText>}
                options={[
                  M('عندما كان العدد تحت المجسّ الأحمر هو الأكبر'),
                  M('عندما كانت الحبّة الحمراء أبعد عن الصفر'),
                  M('دائمًا عند الكسر ذي المقام الأكبر'),
                ]}
                correct={0} cols={1}
                explain={<MathText>{'في الزوج الثاني كان $-\\frac32$ أبعد عن الصفر لكنّ الإبرة مالت إلى اليسار لأنّ $-\\frac32<-\\frac12$ ؛ والإبرة إلى اليمين حين يكون عدد المجسّ الأحمر هو الأكبر.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="ishara-farq" lead="الإبرة مالت يمينًا ثم يسارًا: ماذا كان تحت المجسّ الأحمر؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا حدث حين بدّلتَ المجسّين؟', subtitle: 'الجهة والترتيب', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="swap" ok={!!swapped}
                done="بدّلتَ المجسّين في الزوج الثاني فعبرت الإبرة إلى الجهة الأخرى والحبّتان في مكانهما."
                todo="في الزوج الثاني المس «بدّل المجسّين»، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في الزوج الثاني قرأتَ $-1$ ثم $1$ عند تبديل المجسّين. هل تغيّر الترتيب بين $-\frac32$ و $-\frac12$ ؟`}</MathText>}
                options={[
                  M('لا: $-\\frac32<-\\frac12$ في الحالتين؛ $a-b=-1$ و $b-a=1$'),
                  M('نعم: صار $-\\frac32$ أكبر'),
                ]}
                correct={0} cols={1} requires={['ishara-farq']}
                explain={<MathText>{'الحبّتان لم تتحرّكا: $-\\frac32$ على يسار $-\\frac12$ دائمًا. تبدّلت إشارة الفرق ($-1$ ثم $1$) ولم يتبدّل الترتيب.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="ibdal-mujassayn" lead="الإبرة عبرت الصفر والحبّتان ثابتتان: ماذا تغيّر وماذا لم يتغيّر؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'حبّتان لا تفصلهما العين', subtitle: 'الإبرة تحسم', done: q3 && q3b,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="solved3" ok={!!solved('d3')}
                done="الحبّتان 9/11 و 13/16 كانتا متراكبتين، ومع ذلك حسمتَ الترتيب بالإبرة."
                todo="أنهِ الزوج الثالث (9/11 و 13/16) ثم عُد إلى هذا السؤال." />
              <FractionQuestion
                prompt={<MathText>{String.raw`الحبّتان $\frac9{11}$ و $\frac{13}{16}$ متراكبتان على السكّة. ما الفرق $\frac9{11}-\frac{13}{16}$ ؟ (اكتب كسرًا)`}</MathText>}
                expected="1/176" requires={['ibdal-mujassayn']}
                explain={<MathText>{'$\\frac{9\\times16-13\\times11}{176}=\\frac{144-143}{176}=\\frac1{176}$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <TapQuestion
                  prompt={<MathText>{String.raw`فأيّهما أكبر؟`}</MathText>}
                  options={[M('$\\frac9{11}$ ، لأنّ الفرق موجب'), M('$\\frac{13}{16}$ ، لأنّ بسطه أكبر'), M('متساويان لأنّهما متراكبتان')]}
                  correct={0} cols={1} requires={['ibdal-mujassayn']}
                  explain={<MathText>{'الفرق $\\frac1{176}$ موجب: $\\frac9{11}>\\frac{13}{16}$ ؛ بسط $\\frac{13}{16}$ أكبر لكنّ ذلك لا يحسم.'}</MathText>}
                  onAnswered={() => setQ3b(true)}
                />
              )}
              {q3b && <KnowledgeBrick id="farq-wahdahu" lead="الحبّتان متراكبتان ومع ذلك حسمتِ الإبرة: ما الذي كفى؟" />}
            </div>
          ),
        },
        {
          num: 4, title: 'بلا حبّتين: الفرق وحده', subtitle: 'الستارة', done: q4,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="solved6" ok={!!solved('d6')}
                done="خلف الستارة لم ترَ الحبّتين، وحكمتَ بالقراءة المعلومة وحدها."
                todo="في المستوى المتقدّم أنهِ المهمة السادسة (الستارة) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في المهمة الأخيرة لم تَرَ الحبّتين، ورأيتَ فقط $a-b=-0{,}3$ . ماذا تستنتج؟`}</MathText>}
                options={[M('$a<b$'), M('$a>b$ لأنّ $0{,}3$ موجب'), M('لا نستطيع الحكم دون معرفة $a$ و $b$')]}
                correct={0} cols={1} requires={['farq-wahdahu']}
                explain={<MathText>{'الفرق $a-b$ سالب، إذن $a<b$ : إشارة الفرق وحدها تكفي.'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
