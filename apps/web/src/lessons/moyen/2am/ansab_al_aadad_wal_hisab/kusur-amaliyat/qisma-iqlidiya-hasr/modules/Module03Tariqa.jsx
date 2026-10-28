import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, NumericQuestion, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';

/**
 * Module 3 — طريقة (AJOUT DÉCLARÉ de la plateforme : la page « طرائق » p. 27 du manuel va à kasr-hasil-qisma). Ce que le
 * réseau ajoute à 1AM : « tout diviseur ». Le نشاط 1 encadre 2145 entre deux multiples de 30 sans calculatrice ; ici la
 * méthode générale, par les multiples de 100, 10 puis 1 du diviseur (4750 ÷ 37), puis l'élève l'applique (9000 ÷ 125).
 * LP : P1, P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Tariqa() {
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { practice } = METHOD;
  return (
    <ContentModule
      objectives={['كيف أحصر حاصل قسمة كبيرة دون آلة حاسبة؟', 'بأيّ مضاعفات للمقسوم عليه أبدأ؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة — أحصر حاصل قسمة كبيرة"
      moduleSubtitle="بالمضاعفات 100 و 10 و 1"
      estimatedTime="10 دقائق"
      brief={{ tag: 'طريقة من المنصّة', title: 'مقسوم عليه بعدّة أرقام؟ لا مشكلة', tone: 'sky',
        body: <p>في السنة الأولى كان المقسوم عليه برقم أو رقمين. الآن نقسم على أيّ عدد: نقترب من الحاصل بخطوات كبيرة ثم صغيرة.</p> }}
      steps={[
        { num: 1, title: 'مثال محلول: 4750 على 37', subtitle: 'اكشف سطرًا سطرًا', done: read,
          content: (
            <div className="space-y-3">
              <MethodSteps method={{ source: METHOD.source, exercise: METHOD.exercise, solution: METHOD.solution }} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="hasr-tariqa" />}
            </div>
          ) },
        { num: 2, title: 'دورك: 9000 على 125', subtitle: '$125 \\times 10 = 1250$', done: q1 && q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'بين أيّ مضاعفين للعدد 125 في 10 يقع 9000؟'}</MathText>}
                options={[M('$125 \\times 60 \\le 9000 < 125 \\times 70$'), M('$125 \\times 70 \\le 9000 < 125 \\times 80$'), M('$125 \\times 700 \\le 9000 < 125 \\times 800$')]}
                correct={1}
                cols={1}
                requires={['hasr-tariqa']}
                explain={<MathText>{'$125 \\times 70 = 8750$ و $125 \\times 80 = 10000$ : الحاصل بين 70 و 80.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              <NumericQuestion prompt={<MathText>{'حاصل القسمة الإقليدية للعدد 9000 على 125:'}</MathText>} expected={practice.q} parse={parseDec}
                requires={['hasr-tariqa']} explain={<MathText>{'$125 \\times 72 = 9000$ : الباقي معدوم، فـ $\\frac{9000}{125} = 72$ عدد طبيعي و 125 يقسم 9000.'}</MathText>}
                onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} variant="memo" />}
    />
  );
}
