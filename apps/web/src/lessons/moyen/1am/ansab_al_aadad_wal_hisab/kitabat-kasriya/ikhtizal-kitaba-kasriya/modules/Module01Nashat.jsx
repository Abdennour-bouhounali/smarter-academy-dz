import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, GUIDE } from '../content/textbook';

/**
 * Module 1 — نشاط 4 (p. 54) « تحويل الكتابة الكسرية لحاصل قسمة ». LABORATOIRE À DEUX NIVEAUX, un seul type
 * `fraction-knife` (la main tient le COUTEAU : d, le nombre de morceaux égaux du tout ; la part ne bouge jamais) :
 *   مبتدئ  — le plateau de قلب اللوز de grand-mère (plateforme, monde `sweets-tray`) : la part des voisins 3/5, d de 1 à 20,
 *            la proposition d'Amine « 4/6 » jugée par le plateau.
 *   متقدم  — le MANUEL : les trois rectangles (3/5, 6/10, 12/20), puis le cadeau du grand-père 27/45, prédit puis réduit.
 * Les ÉTAPES sont les questions ② et ③ du manuel, puis le grand-père (③ ب). LP : P1 (et P3, au niveau متقدم).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const { share, targets, gift } = ACTIVITY.numbers;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const writings = [...new Set(trials.filter((e) => e.kind === 'cut' && e.readable && e.writing).map((e) => e.writing))];

  return (
    <ContentModule
      objectives={['نفس الحصّة: كم كتابة كسرية لها؟', 'ماذا يحدث للبسط والمقام معًا؟', 'هديّة الجدّ: أيّ الكسرين أكبر؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 4 — نفس الحصّة"
      moduleSubtitle="نقطع أكثر أو أقل، والحصّة لا تتحرّك"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'نشاط 4 — الكتاب ص 54',
        headline: 'هل يتغيّر الكسر إذا قطعنا أكثر؟',
        emoji: '🍰',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p>{ACTIVITY.text}</p>
            <ul className="list-disc ps-5 text-sm">{ACTIVITY.parts.slice(0, 2).map((p) => <li key={p}><MathText>{p}</MathText></li>)}</ul>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="ابدأ بصينية الجدّة، ثم انتقل إلى مستطيلات الكتاب وهديّة الجدّ."
          levels={{
            beginner: () => (
              <Manipulation type="fraction-knife" level="beginner" world="tray" share={share} start={share[1]} max={20} claim={[4, 6]} onTrial={record} />
            ),
            advanced: () => (
              <Manipulation type="fraction-knife" level="advanced" world="paper" share={share} start={share[1]} max={20} targets={targets}
                then={{ share: gift, start: gift[1], max: gift[1], predict: true }}
                onTrial={record} />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'قارن بين السطوح الملوّنة', subtitle: 'السؤال ② من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={writings.length ? 'true' : 'false'}>
                {writings.length
                  ? <span className="font-bold text-slate-800">كتاباتك: <bdi dir="ltr">{writings.join(' = ')}</bdi></span>
                  : <span className="text-slate-500">لم تكتب أيّ كسر بعد في الصينية أو في المستطيلات.</span>}
              </p>
              <TapQuestion
                prompt={<MathText>{'السطوح الملوّنة بـ $\\frac{3}{5}$ ، $\\frac{6}{10}$ و $\\frac{12}{20}$ من ثلاثة مستطيلات متماثلة:'}</MathText>}
                options={[M('لها نفس المساحة: الكسور الثلاثة متساوية'), M('أكبرها $\\frac{12}{20}$ لأنّ بسطه أكبر'), M('أصغرها $\\frac{12}{20}$ لأنّ قطعه أصغر')]}
                correct={0} cols={1} requires={['kasr-juz-ibtidai']}
                explain={<MathText>{'قطع أكثر، لكنّ كل قطعة أصغر: نفس السطح. $\\frac{3}{5}=\\frac{6}{10}=\\frac{12}{20}$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              <KnowledgeBrick id="kitabat-mutasawiya" lead="قطعنا كل قطعة إلى قطعتين، ثم إلى أربع: ماذا حدث للبسط وللمقام؟" />
            </div>
          ),
        },
        {
          num: 2, title: 'أُنقل وأتمم', subtitle: 'السؤال ③ أ) من الكتاب', done: q2,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">أُنقل وأتمم بالعدد المناسب:</p>}
                rows={[
                  { id: 'a', label: M('$\\frac{3}{5}=\\frac{3\\times\\ldots}{5\\times\\ldots}=\\frac{6}{10}$'), options: ['2', '3', '5'], correct: 0, correction: M('$3\\times 2=6$ و $5\\times 2=10$') },
                  { id: 'b', label: M('$\\frac{12}{20}=\\frac{12\\div\\ldots}{20\\div\\ldots}=\\frac{3}{5}$'), options: ['4', '9', '15'], correct: 0, correction: M('$12\\div 4=3$ و $20\\div 4=5$') },
                ]}
                requires={['kitabat-mutasawiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{allRight ? 'نفس العدد للبسط وللمقام.' : GUIDE.addSame.right}</MathText></Feedback>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'هديّة الجدّ', subtitle: 'السؤال ③ ب) من الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.grandfather} source={ACTIVITY.source} compact />
              <TapQuestion
                prompt={<span>ماذا تختار فاطمة؟</span>}
                options={[M('لا فرق: $\\frac{27}{45}=\\frac{27\\div 9}{45\\div 9}=\\frac{3}{5}$'), M('$\\frac{27}{45}$ لأنّ 27 أكبر من 3'), M('$\\frac{3}{5}$ لأنّ 5 أصغر من 45')]}
                correct={0} cols={1} requires={['kitabat-mutasawiya']}
                explain={<MathText>{'نجمع كل 9 قطع في قطعة: 27 قطعة من 45 تصبح 3 قطع من 5. نفس الحصّة، دون حساب المبلغ.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
