import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, CARDS } from '../content/textbook';

/**
 * Module 1 — نشاط 4 (pp. 37–38) « قواعد قابلية القسمة ». LABORATOIRE À DEUX NIVEAUX, un seul type `digit-cards`, le
 * MANUEL aux deux niveaux :
 *   مبتدئ  — la table 0–48 en 7 colonnes : colorier les multiples de 2, 5 puis 3 ; chaque case jugée par son reste ; les
 *            chiffres des unités / les sommes des chiffres s'accumulent à côté (jamais la règle).
 *   متقدم  — l'exercice 26 : les cartes 4, 5, 9, 3 ; former, permuter, juger cinq divisibilités ; l'impossible pour 4 et 9.
 * Les ÉTAPES sont les questions ب) du manuel (les chiffres des unités, la somme des chiffres), puis les deux règles (briques
 * gardées par « أتوقّع القاعدة »). LP : P1, P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const found = (d) => [...new Set(trials.filter((e) => e.mode === 'grid' && e.d === d && e.ok).map((e) => e.n))].sort((a, b) => a - b);
  const ledger = (d, label) => {
    const ns = found(d);
    return (
      <li data-evidence={`grid-${d}`} data-tried={ns.length ? 'true' : 'false'} className={ns.length ? 'font-bold text-slate-800' : 'text-slate-500'}>
        {ns.length ? <span>{label}: <bdi dir="ltr">{ns.join(' ، ')}</bdi></span> : `${label}: لم تلوّن أيّ خانة بعد في المستوى المبتدئ.`}
      </li>
    );
  };

  return (
    <ContentModule
      objectives={['ماذا تشترك فيه مضاعفات 2؟ ومضاعفات 5؟', 'وماذا عن مضاعفات 3؟', 'كيف نعرف دون أن نقسم؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 4 — جدول الأعداد"
      moduleSubtitle="نلوّن المضاعفات ونقرأ أرقامها"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'نشاط 4 — الكتاب ص 37',
        headline: 'هل يمكن أن نعرف دون أن نقسم؟',
        emoji: '🔎',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p>{ACTIVITY.text}</p>
            <ul className="list-disc ps-5 text-sm">{ACTIVITY.parts.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="ابدأ بالمستوى المبتدئ (جدول الكتاب)، ثم انتقل إلى المتقدّم: بطاقات التمرين 26."
          levels={{
            beginner: () => (
              <Manipulation type="digit-cards" level="beginner" mode="grid" from={ACTIVITY.numbers.from} to={ACTIVITY.numbers.to}
                columns={ACTIVITY.numbers.columns} divisors={ACTIVITY.numbers.divisors} onTrial={record} />
            ),
            advanced: () => (
              <div className="space-y-2">
                <TextbookBox kind="exercise" text={CARDS.text} source={CARDS.source} compact />
                <Manipulation type="digit-cards" level="advanced" mode="cards" digits={CARDS.digits} divisors={[2, 3, 5, 4, 9]} onTrial={record} />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'مضاعفات 2: ما أرقام آحادها؟', subtitle: 'السؤال 1 ب) من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>{ledger(2, 'خاناتك الحمراء')}</ul>
              <TapQuestion
                prompt={<span>ما القيم التي يأخذها رقم آحاد مضاعف للعدد 2؟</span>}
                options={[M('0 ، 2 ، 4 ، 6 ، 8'), M('كل الأرقام من 0 إلى 9'), M('0 و 5')]}
                correct={0} cols={1} requires={['mudaaf-ibtidai']}
                explain={<span>في الجدول: 0 ، 2 ، 4 ، … ، 48 : رقم الآحاد دائمًا 0 أو 2 أو 4 أو 6 أو 8.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'مضاعفات 5: ما أرقام آحادها؟', subtitle: 'السؤال 2 ب) من الكتاب', done: q2,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>{ledger(5, 'خاناتك الزرقاء')}</ul>
              <TapQuestion
                prompt={<span>ما القيم التي يأخذها رقم آحاد مضاعف للعدد 5؟</span>}
                options={[M('5 فقط'), M('0 و 5'), M('0 ، 2 ، 4 ، 6 ، 8')]}
                correct={1} cols={1} requires={['mudaaf-ibtidai']}
                explain={<span>0 ، 5 ، 10 ، 15 ، … ، 45 : رقم الآحاد 0 أو 5.</span>}
                onAnswered={() => setQ2(true)}
              />
              <KnowledgeBrick id="qabiliya-2-5" lead="أرقام آحاد خاناتك الحمراء والزرقاء: ماذا يكفي أن ننظر إليه؟" />
            </div>
          ),
        },
        {
          num: 3, title: 'مضاعفات 3: رقم الآحاد أم مجموع الأرقام؟', subtitle: 'السؤال 3 ب) من الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>{ledger(3, 'خاناتك الخضراء')}</ul>
              <TapQuestion
                prompt={<span>في الجدول، مجموع أرقام كل مضاعف للعدد 3:</span>}
                options={[M('يقبل القسمة على 3'), M('يساوي دائمًا 3'), M('عدد زوجي')]}
                correct={0} cols={1} requires={['mudaaf-ibtidai']}
                explain={<MathText>{'27 : $2 + 7 = 9$ ، 39 : $3 + 9 = 12$ ، 48 : $4 + 8 = 12$ — كلها تقبل القسمة على 3. أمّا رقم الآحاد فيأخذ كل القيم (3 ، 6 ، 9 ، 12 ، 15…).'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              <KnowledgeBrick id="qabiliya-3" lead="رقم الآحاد لم يكفِ هنا: ما الذي كان مشتركًا بين خاناتك الخضراء؟" />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
