import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, CARDS } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE : la table 0–48 de نشاط 4 (pp. 37–38) coloriée à la main (rétrofit 2026-10-15 : le labo en tête SANS carte
 * ni titre, la brique de chaque règle APRÈS la réponse). LABORATOIRE À DEUX NIVEAUX, un seul type `digit-cards`, le
 * MANUEL aux deux niveaux :
 *   مبتدئ  — la table 0–48 en 7 colonnes : colorier les multiples de 2, 5 puis 3 ; chaque case jugée par son reste ; les
 *            chiffres des unités / les sommes des chiffres s'accumulent à côté (jamais la règle).
 *   متقدم  — l'exercice 26 : les cartes 4, 5, 9, 3 ; former, permuter, juger cinq divisibilités ; l'impossible pour 4 et 9.
 * Les ÉTAPES sont les questions ب) du manuel (les chiffres des unités, la somme des chiffres), puis les deux règles (briques
 * gardées par « أتوقّع القاعدة »). LP : P1, P2.
 * Déploiement du prototype (2026-10-28) : les questions ب) sont posées PAR-DESSUS le labo à chaque coloriage complet (`DigitCards ›
 * chainOf` : les chiffres des unités, la colonne, la somme ; la règle clôt le dernier) ; les étapes en gardent la TRACE (`checkpoint-done`)
 * puis posent les règles.
 */

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const record = (e) => setTrials((list) => [...list, e]);
  // les questions posées PAR-DESSUS le labo : une étape est faite quand la suite de SON coloriage l'est
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const q1 = answered('g2');
  const q2 = answered('g5');
  const q3 = answered('g3');
  const found = (d) => [...new Set(trials.filter((e) => e.mode === 'grid' && e.d === d && e.ok).map((e) => e.n))].sort((a, b) => a - b);
  const ledger = (d, label) => {
    const ns = found(d);
    return (
      <li data-evidence={`grid-${d}`} data-tried={ns.length ? 'true' : 'false'} className={ns.length ? 'font-bold text-slate-800' : 'text-slate-500'}>
        {ns.length ? <span>{label}: <bdi dir="ltr">{ns.join(' ، ')}</bdi></span> : `${label}: لم تلوّن أيّ خانة بعد في المستوى المبتدئ — لوّن، وأجب عن الأسئلة التي تظهر فوق المختبر.`}
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
      intro={
        <ManipulationWorkspace
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
            </div>
          ),
        },
        {
          num: 2, title: 'مضاعفات 5: ما أرقام آحادها؟', subtitle: 'السؤال 2 ب) من الكتاب', done: q2,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>{ledger(5, 'خاناتك الزرقاء')}</ul>
              {q2 && <KnowledgeBrick id="qabiliya-2-5" lead="أرقام آحاد خاناتك الحمراء والزرقاء: ماذا يكفي أن ننظر إليه؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'مضاعفات 3: رقم الآحاد أم مجموع الأرقام؟', subtitle: 'السؤال 3 ب) من الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>{ledger(3, 'خاناتك الخضراء')}</ul>
              {q3 && <KnowledgeBrick id="qabiliya-3" lead="رقم الآحاد لم يكفِ هنا: ما الذي كان مشتركًا بين خاناتك الخضراء؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
