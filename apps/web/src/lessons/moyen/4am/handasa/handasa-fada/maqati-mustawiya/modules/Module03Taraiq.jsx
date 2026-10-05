import React, { useState } from 'react';
import { ContentModule, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { parseDec } from '@smarter-academy/core';
import MathText from '../../../../../../common/components/MathText';
import SpaceFigure from '../../../../../../common/components/SpaceFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { MethodSteps, SourceTag, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD_RADIUS, NOW_169 } from '../content/textbook';
import { FIG_METHOD, FIG_NOW169 } from '../content/figures';

/**
 * Module 3 — طرائق (p. 169) « حساب نصف قطر مقطع كرة بمستو » et دوري الآن.
 * TOUCH THE MATH : le تمرين (R = 2,5 ; OO′ = 1,5 → 2) révélé ligne à ligne (MethodSteps), la brique, puis un rayon à calculer
 * (13 et 5 → 12) ; le دوري الآن (cylindre h = 3, r = 2, plan à 1 de l'axe : ABCD rectangle, AB = 2√3, aire 6√3) et la méthode
 * de la plateforme qui le généralise (brique tariqat-ustuwana). « فيثاغورث » uniformisé (une ligne le dit). LP : P1, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const near = (v) => (n) => Number.isFinite(n) && Math.abs(n - v) < 1e-9;

export default function Module03Taraiq() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طرائق — نصف قطر مقطع كرة بمستو"
      moduleSubtitle="خاصية فيثاغورس في المثلث الذي رأسه مركز الكرة"
      estimatedTime="8 دقائق"
      brief={{
        tag: 'طرائق — الكتاب ص 169', title: 'حساب نصف قطر مقطع كُرة بمستو', tone: 'emerald',
        body: <p>اقرأ الحل سطرا بسطر: هو الحساب الذي كانت الطابعة تتحقّق منه عند كل طبقة.</p>,
        footer: <SourceTag source={METHOD_RADIUS.source} />,
      }}
      steps={[
        {
          num: 1, title: 'تمرين: كرة نصف قطرها 2,5', subtitle: 'المستوي على بعد 1,5 من مركزها', done: q1,
          content: (
            <div className="space-y-3">
              <SpaceFigure {...FIG_METHOD} />
              <MethodSteps method={METHOD_RADIUS} />
              <p className="text-xs text-slate-500" data-correction>{METHOD_RADIUS.spelling}</p>
              <KnowledgeBrick id="tariqat-nisf-qutr" lead="الطريقة، في سطر واحد:" />
              <NumericQuestion
                prompt={<MathText>{'كرة نصف قطرها $13\\,\\mathrm{cm}$ يقطعها مستو يبعد عن مركزها بـ $5\\,\\mathrm{cm}$ . نصف قطر المقطع (بـ $\\mathrm{cm}$):'}</MathText>}
                expected={near(12)}
                display="12"
                parse={parseDec}
                requires={['tariqat-nisf-qutr']}
                explain={<MathText>{'$O\'M^2 = 13^2 - 5^2 = 169 - 25 = 144$ ، إذن $O\'M = \\sqrt{144} = 12\\,\\mathrm{cm}$ .'}</MathText>}
                explainFor={(n) => (n === 8 ? <MathText>{'$13 - 5 = 8$ : طرحت الطولين، والمطلوب طرح مربعيهما ثم أخذ الجذر.'}</MathText> : null)}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'دوري الآن: مقطع أسطوانة', subtitle: 'القيمة المضبوطة للمساحة', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={NOW_169.text} source={NOW_169.source} compact />
              <SpaceFigure {...FIG_NOW169} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">اختر لكل سطر:</p>}
                rows={[
                  { id: 'nature', label: 'نوع الرباعي ABCD', options: ['مستطيل أحد بعديه $3\\,\\mathrm{cm}$', 'مربع', 'شبه منحرف'].map(M), correct: 0, correction: <MathText>{NOW_169.answer1}</MathText> },
                  // 2 = 2(2 − 1) (MISC-MAQTA-TARH) ; 4 = le diamètre
                  { id: 'ab', label: <MathText>{'$AB$'}</MathText>, options: ['$2\\sqrt{3}\\,\\mathrm{cm}$', '$2\\,\\mathrm{cm}$', '$4\\,\\mathrm{cm}$'].map(M), correct: 0, correction: <MathText>{NOW_169.answer2}</MathText> },
                  { id: 'area', label: 'القيمة المضبوطة لمساحة ABCD', options: ['$6\\sqrt{3}\\,\\mathrm{cm}^2$', '$6\\,\\mathrm{cm}^2$', '$10{,}39\\,\\mathrm{cm}^2$'].map(M), correct: 0, correction: <MathText>{'$10{,}39$ قيمة مقرّبة لـ $6\\sqrt{3}$ ، والمطلوب القيمة المضبوطة.'}</MathText> },
                ]}
                requires={['maqta-ustuwana', 'tariqat-nisf-qutr']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: نفس خاصية فيثاغورس، في القاعدة هذه المرة.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="tariqat-ustuwana" lead="ما فعلته في نشاط 4 وفي دوري الآن، طريقةً:" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
