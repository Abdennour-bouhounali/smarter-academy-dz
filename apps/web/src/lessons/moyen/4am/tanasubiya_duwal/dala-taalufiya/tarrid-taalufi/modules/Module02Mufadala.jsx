import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { TICKET, LAB, TAXI, MISTAKE_ALWAYS } from '../content/textbook';
import TaxiGraph from '../components/TaxiGraph';

/**
 * Module 2 — المفاضلة بين صيغتين (stage: discovery). Le manuel ne compare pas de tarifs : la comparaison
 * est un AJOUT de la plateforme, dans le monde de نشاط 4 (le stade propose aussi le billet seul, 400DA).
 *
 * Le laboratoire `plan-compare` en mode `compare` : x glisse (les barres et les droites bougent ensemble),
 * l'élève POSE une marque sur le croisement (refusée ailleurs avec les deux coûts), puis PEINT l'axe des x
 * de la formule la moins chère (refus avec un de ses essais comme témoin : MISC-TARRID-AFDAL-DAIMAN).
 *   مبتدئ (défaut) — le stade : l'abonnement contre le billet → égalité à 10 matchs (4000DA) ;
 *   متقدم — la salle de jeux, trois formules du mois (100x ; 40x + 600 ; 1800) → changements à 10 h et 30 h.
 *
 * AUCUNE étape n'attend `onFinished` ; ce que l'élève a marqué et peint est listé au-dessus des questions.
 * Étapes : (1) l'égalité trouvée ; (2) la brique « tasawi-taqatu », un autre couple de tarifs ;
 * (3) avant / après le croisement, puis la brique « sigha-afdal » ; (4) lire deux tarifs sur un graphique ;
 * (5) trois formules. LP : P2.
 *
 * « أتوقّع القاعدة » : ni la consigne de l'atelier ni le retour de l'étape 3 ne disent les règles avant leurs
 * briques (l'ancienne consigne énonçait « tasawi-taqatu », l'ancien retour « sigha-afdal » : MISTAKE_ALWAYS.right
 * reste dans la carte des erreurs).
 */
export default function Module02Mufadala() {
  const [marks, setMarks] = useState({});
  const [painted, setPainted] = useState({});
  const [q, setQ] = useState({});
  const mark = (id) => () => setQ((d) => ({ ...d, [id]: true }));
  const onTrial = (level) => (tr) => {
    if (tr.kind === 'mark' && tr.ok) setMarks((m) => ({ ...m, [level]: [...(m[level] ?? []).filter((p) => p !== `(${tr.x} ; ${tr.y})`), `(${tr.x} ; ${tr.y})`] }));
    if (tr.kind === 'paint' && tr.ok) setPainted((p) => ({ ...p, [level]: (p[level] ?? 0) + 1 }));
  };

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      <li className={marks.beginner ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="mark" data-tried={marks.beginner ? 'true' : 'false'}>
        {marks.beginner
          ? <span>علامتك على تقاطع الاشتراك والتذكرة: <span dir="ltr" className="font-mono">{marks.beginner.join(' ؛ ')}</span></span>
          : 'لم تضع بعد العلامة حيث تتساوى الصيغتان (المستوى المبتدئ).'}
      </li>
      <li className={painted.beginner ? 'text-slate-800' : 'text-slate-500'} data-evidence="paint" data-tried={painted.beginner ? 'true' : 'false'}>
        {painted.beginner ? 'لوّنت محور الفواصل بالصيغة الأرخص.' : 'لم تلوّن بعد محور الفواصل.'}
      </li>
    </ul>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="المفاضلة بين صيغتين"
      moduleSubtitle="معادلة، متراجحة، ونقطة تقاطع"
      estimatedTime="12 دقيقة"
      objectives={[
        'متى تتساوى الصيغتان؟',
        'أيّ صيغة أرخص قبل نقطة التقاطع وبعدها؟',
        'كيف نقرأ الجواب على التمثيل البياني؟',
        'ماذا يحدث مع ثلاث صيغ؟',
      ]}
      brief={{
        tag: 'امتداد لنشاط 4 — من المنصّة',
        headline: 'الاشتراك أم التذكرة؟',
        emoji: '⚖️',
        title: 'أيّ الصيغتين أرخص؟ الجواب يتعلّق بعدد المقابلات',
        tone: 'violet',
        body: (
          <div className="space-y-1">
            <p><MathText>{TICKET.text}</MathText></p>
            <p className="text-sm text-slate-600">في المختبر: حرّك x وقارن العمودين والمستقيمين، ضع العلامة حيث تتساوى التكلفتان، ثم لوّن محور الفواصل بلون الصيغة الأرخص.</p>
          </div>
        ),
        footer: <SourceTag source={TICKET.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="نفس السؤال في المستويين: متى تتساوى التكلفتان؟ وأيّ صيغة أرخص؟ حرّك x وراقب العمودين والمستقيمين."
          levels={{
            beginner: () => <Manipulation type="plan-compare" level="beginner" {...LAB.m2.beginner} onTrial={onTrial('beginner')} />,
            advanced: () => <Manipulation type="plan-compare" level="advanced" {...LAB.m2.advanced} onTrial={onTrial('advanced')} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'متى تتساوى الصيغتان؟', subtitle: 'من علامتك في المختبر', done: !!q.eq,
          content: (
            <div className="space-y-3">
              {evidence}
              <NumericQuestion
                prompt="من أجل كم مقابلة يدفع المناصر المبلغ نفسه بالصيغتين؟"
                expected={TICKET.numbers.cross}
                requires={['namdhaja-taalufiya', 'hall-muadala']}
                explain={<MathText>{'$200x + 2000 = 400x$ أي $2000 = 200x$ ومنه $x = 10$ : من أجل 10 مقابلات يدفع 4000DA بالصيغتين.'}</MathText>}
                onAnswered={mark('eq')}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'هل نجد التساوي دون علامة؟', done: !!q.gym,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tasawi-taqatu" lead="ما وجدته بالعلامة نجده أيضا بحلّ معادلة:" />
              <NumericQuestion
                prompt={<span>قاعة رياضة يقصدها الشباب للمحافظة على صحتهم: الصيغة الأولى <MathText>{'$f(x) = 150x + 1200$'}</MathText> والصيغة الثانية <MathText>{'$g(x) = 350x$'}</MathText> ، حيث <MathText>{'$x$'}</MathText> عدد الحصص. من أجل كم حصة تتساوى التكلفتان؟</span>}
                expected={6}
                requires={['tasawi-taqatu']}
                explain={<MathText>{'$150x + 1200 = 350x$ أي $1200 = 200x$ ومنه $x = 6$ ، و $f(6) = g(6) = 2100$ .'}</MathText>}
                onAnswered={mark('gym')}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'أيّ صيغة أرخص، ومتى؟', subtitle: 'قارن في ثلاث حالات', done: !!q.side,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في الملعب: الاشتراك <MathText>{'$f(x) = 200x + 2000$'}</MathText> ، والتذكرة وحدها <MathText>{'$g(x) = 400x$'}</MathText> .</p>}
                rows={[
                  { id: 'six', label: 'مناصر يتابع 6 مقابلات', options: ['الاشتراك أرخص', 'التذكرة أرخص', 'تتساويان'], correct: 1, correction: <MathText>{'$f(6) = 3200$ و $g(6) = 2400$ : التذكرة أرخص.'}</MathText> },
                  { id: 'fifteen', label: 'مناصر يتابع 15 مقابلة', options: ['الاشتراك أرخص', 'التذكرة أرخص', 'تتساويان'], correct: 0, correction: <MathText>{MISTAKE_ALWAYS.why}</MathText> },
                  { id: 'ineq', label: <MathText>{'حلول المتراجحة $200x + 2000 < 400x$'}</MathText>, options: [<MathText key="a">{'$x < 10$'}</MathText>, <MathText key="b">{'$x > 10$'}</MathText>, <MathText key="c">{'$x > 2000$'}</MathText>], correct: 1, correction: <MathText>{'$2000 < 400x - 200x$ أي $2000 < 200x$ ومنه $x > 10$ : الاشتراك أرخص بعد 10 مقابلات.'}</MathText> },
                ]}
                requires={['tasawi-taqatu', 'hall-mutarajiha']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight ? 'صحيح في الحالات الثلاث: قارنت المبلغين بالصيغتين من أجل عدد المقابلات نفسه.' : 'قارن المبلغين بالصيغتين من أجل عدد المقابلات نفسه، ولا تقارن 2000 بـ 400.'}</MathText>
                  </Feedback>
                )}
                onAnswered={mark('side')}
              />
              {q.side && <KnowledgeBrick id="sigha-afdal" lead="ما لوّنته على محور الفواصل له اسم:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'القراءة البيانية', subtitle: 'تطبيقان للنقل', done: !!q.taxi,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" text={TAXI.text} source={TAXI.source} />
              <TaxiGraph />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">اقرأ على التمثيل البياني:</p>}
                rows={[
                  { id: 'four', label: 'رحلة 4km', options: ['التطبيق A أرخص', 'التطبيق B أرخص'], correct: 1, correction: <MathText>{'مستقيم B تحت مستقيم A عند الفاصلة 4: $60 \\times 4 = 240$ و $40 \\times 4 + 120 = 280$ .'}</MathText> },
                  { id: 'equal', label: 'تتساوى التكلفتان من أجل', options: ['3km', '6km', '9km'], correct: 1, correction: <MathText>{'فاصلة نقطة التقاطع هي 6: $40 \\times 6 + 120 = 360 = 60 \\times 6$ .'}</MathText> },
                  { id: 'nine', label: 'رحلة 9km', options: ['التطبيق A أرخص', 'التطبيق B أرخص'], correct: 0, correction: <MathText>{'بعد الفاصلة 6 مستقيم A تحت مستقيم B: $40 \\times 9 + 120 = 480$ و $60 \\times 9 = 540$ .'}</MathText> },
                ]}
                requires={['sigha-afdal', 'tasawi-taqatu', 'qiraa-bayaniya-taalufiya']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: الأرخص هو المستقيم الذي تحت الآخر، ويتغيّر عند نقطة التقاطع.' : 'ابحث في كل فاصلة عن المستقيم الذي يقع تحت الآخر.'}
                  </Feedback>
                )}
                onAnswered={mark('taxi')}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'ثلاث صيغ', subtitle: 'قاعة الألعاب (المستوى المتقدّم)', done: !!q.three,
          content: (
            <TapQuestion
              prompt={<span>في قاعة الألعاب: <MathText>{'$100x$'}</MathText> (الدفع بالساعة)، <MathText>{'$40x + 600$'}</MathText> (بطاقة شهرية)، <MathText>{'$1800$'}</MathText> (دون حدّ). يلعب ياسين 20 ساعة في الشهر بعد إنجاز واجباته. أيّ صيغة أرخص له؟</span>}
              options={['الدفع بالساعة', 'البطاقة الشهرية', 'الصيغة دون حدّ']}
              correct={1}
              cols={1}
              requires={['sigha-afdal']}
              explain={<MathText>{'من أجل $x = 20$ : $100 \\times 20 = 2000$ ، و $40 \\times 20 + 600 = 1400$ ، و $1800$ . البطاقة الشهرية أرخص (بين 10 و 30 ساعة).'}</MathText>}
              onAnswered={mark('three')}
            />
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
