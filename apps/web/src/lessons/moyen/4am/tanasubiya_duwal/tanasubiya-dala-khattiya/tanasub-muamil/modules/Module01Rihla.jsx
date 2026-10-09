import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { HOOK, ACTIVITY, ACTIVITY_LINES } from '../content/textbook';
import ScooterVignette from '../components/ScooterVignette';
import DataTable from '../components/DataTable';

/**
 * Module 1 — l'ENTRÉE de l'unité (« وضعية انطلاق ») : le COMPTEUR DE TRAJET (ratio-ride), puis la
 * question 1 du نشاط 1 (p. 66, doublon déclaré) comme TRANSFERT.
 *
 * REAL      la carte : des trottinettes louées à la minute sur le kornich des Sablettes (plateforme).
 * MANIPULATE le lab à deux niveaux, UN instrument, même objectif :
 *   مبتدئ (par défaut) : un tarif, 15DA la minute — l'élève fait rouler, enregistre SES colonnes, lit
 *          y ÷ x, juge son tableau, complète la colonne fantôme (12 min, hors de la règle) ;
 *   متقدم : deux tarifs (15x et 50 + 10x) — décider seul lequel est proportionnel, écrire y = 15 × x.
 * UNDERSTAND l'étape 1 se décide sur les colonnes de l'élève (`onTrial`, `[data-activity-evidence]`) ;
 *           la brique jadwal-tanasub NOMME ce qu'elles montrent.
 * TRANSFER  la remise de l'Aïd (2% CORRIGÉ en 20 %, une ligne) : compléter, montrer, coefficient 0,8.
 * « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire) clôt la dernière étape : les labs vivent dans l'intro (deux niveaux).
 * Aucune étape n'attend `onFinished` (le module ne porte pas d'activité du manuel dans son lab).
 * LP : P1 (P2 et P3 sont l'objet du متقدم, enseignés en معارف).
 */
const BEGINNER = '15x';
const ADVANCED = '15x|10x+50';
const Opt = (s) => <MathText key={s}>{s}</MathText>;
const near = (v) => (n) => Number.isFinite(n) && Math.abs(n - v) < 1e-9;

export default function Module01Rihla() {
  const [trials, setTrials] = useState({ [BEGINNER]: [], [ADVANCED]: [] });
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2b, setQ2b] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3b, setQ3b] = useState(false);
  const onTrial = (plans) => (tr) => setTrials((t) => ({ ...t, [plans]: [...t[plans].filter((c) => c.x !== tr.x), tr].sort((a, b) => a.x - b.x) }));
  const mine = trials[BEGINNER].length ? trials[BEGINNER] : trials[ADVANCED];

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={mine.length ? 'true' : 'false'}>
      {mine.length === 0 ? (
        <p className="text-slate-500">لم تسجّل أي رحلة بعد: اركب التروتينة في المخبر أعلاه وسجّل رحلتين أو ثلاثًا.</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">رحلاتك بصيغة 15DA للدقيقة:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="rides">
            {mine.slice(-6).map((tr) => {
              const r = tr.rows.find((row) => row.id === 'A');
              return (
                <li key={tr.x} data-evidence-ride={tr.x} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-800">
                  <MathText>{`$x = ${tr.x}$ ، $y = ${r.y}$${r.ratio ? ` ، $y \\div x = ${r.ratio.replace(',', '{,}')}$` : ''}`}</MathText>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="رحلة بالتروتينة — جدول التناسبية"
      moduleSubtitle="المدة والسعر: ما الذي يجمع أعمدة الجدول؟"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'مدخل الوحدة · أنشطة — الكتاب ص 66',
        headline: HOOK.headline,
        emoji: '🛴',
        title: 'جدول تناسبية ومعامله',
        tone: 'indigo',
        visual: <ScooterVignette />,
        body: <p><MathText>{HOOK.text}</MathText></p>,
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={HOOK.source} /><SourceTag source={ACTIVITY.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="في المستويين تحرّك التروتينة بيدك لتختار المدة، وتسجّل كل رحلة في جدولك. ثم تحكم على الجدول بأعمدته."
          levels={{
            beginner: () => (
              <Manipulation
                type="ratio-ride"
                level="beginner"
                plans={BEGINNER}
                theme="scooter"
                title="تروتينة 15DA للدقيقة"
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="ratio-ride"
                level="advanced"
                plans={ADVANCED}
                theme="scooter"
                title="صيغتان للكراء: 15DA للدقيقة أو 50DA + 10DA للدقيقة"
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'جدول رحلاتك', subtitle: 'السعر على المدة', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <TapQuestion
                prompt={<MathText>{'في جدول رحلاتك بصيغة 15DA للدقيقة، ماذا تلاحظ على حواصل القسمة $y \\div x$ (السعر على المدة)؟'}</MathText>}
                options={['هي العدد نفسه في كل الأعمدة', 'تزداد كلما ازدادت المدة', 'تنقص كلما ازدادت المدة'].map(Opt)}
                correct={0}
                cols={1}
                requires={['darb-qisma-nisbiya']}
                explain={<MathText>{'كل دقيقة بـ 15DA ، فسعر رحلة مدتها $x$ دقيقة هو $15 \\times x$ ، وحاصل القسمة $\\dfrac{15 \\times x}{x} = 15$ في كل عمود: مثلا $\\dfrac{30}{2} = \\dfrac{75}{5} = 15$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="jadwal-tanasub" lead="ما يجمع أعمدة جدولك، باسمه:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'تخفيض العيد', subtitle: 'نشاط 1 — السؤال 1', done: q2a && q2b,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" title={`نشاط 1 — ${ACTIVITY.title}`} lines={[ACTIVITY.text, ...ACTIVITY.questions]} source={ACTIVITY.source} compact>
                <p className="text-xs text-slate-500" data-correction><MathText>{ACTIVITY.correction}</MathText></p>
                <DataTable rows={[{ label: ACTIVITY.rows[0], values: ACTIVITY.table.before }, { label: ACTIVITY.rows[1], values: ['…', '…', '…', '…'] }]} />
              </TextbookBox>
              <NumericQuestion
                prompt="السعر بعد التخفيض لسلعة ثمنها 50DA (بالدينار):"
                expected={near(40)}
                display="40"
                parse={parseDec}
                requires={['nisba-miawiya']}
                explain={<MathText>{ACTIVITY_LINES.first}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <BatchChoiceQuestion
                  intro={<p className="text-sm font-semibold text-slate-700">أتمم السطر الثاني:</p>}
                  rows={[
                    { id: 'p100', label: 'قبل التخفيض 100DA', options: ['80DA', '98DA', '90DA'], correct: 0, correction: <MathText>{'$100 - 20 = 80$'}</MathText> },
                    { id: 'p150', label: 'قبل التخفيض 150DA', options: ['130DA', '120DA', '147DA'], correct: 1, correction: <MathText>{'$150 - 30 = 120$'}</MathText> },
                    { id: 'p200', label: 'قبل التخفيض 200DA', options: ['180DA', '196DA', '160DA'], correct: 2, correction: <MathText>{'$200 - 40 = 160$'}</MathText> },
                  ]}
                  requires={['nisba-miawiya']}
                  feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{allRight ? 'أحسنت: السطر الثاني $40 ، 80 ، 120 ، 160$.' : ACTIVITY_LINES.others}</MathText></Feedback>}
                  onAnswered={() => setQ2b(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'جدول تناسبية؟', subtitle: 'بيّن وعيّن المعامل', done: q3a && q3b,
          content: (
            <div className="space-y-3">
              <DataTable rows={[{ label: ACTIVITY.rows[0], values: ACTIVITY.table.before }, { label: ACTIVITY.rows[1], values: ACTIVITY.table.after }]} />
              <KnowledgeBrick id="jadwal-tanasub" variant="rappel" compact />
              <TapQuestion
                prompt="لماذا هذا الجدول جدول تناسبية؟"
                options={[
                  'لأنّ $\\dfrac{40}{50}$ ، $\\dfrac{80}{100}$ ، $\\dfrac{120}{150}$ ، $\\dfrac{160}{200}$ كلها تساوي العدد نفسه',
                  'لأنّ الفرق بين السعرين هو نفسه في كل الأعمدة',
                  'لأنّ معامل التناسبية هو $\\dfrac{50}{40} = 1{,}25$',
                ].map(Opt)}
                correct={0}
                cols={1}
                requires={['jadwal-tanasub']}
                explain={<MathText>{`${ACTIVITY_LINES.why} ${ACTIVITY_LINES.diff}`}</MathText>}
                onAnswered={() => setQ3a(true)}
              />
              {q3a && (
                <NumericQuestion
                  prompt="معامل التناسبية:"
                  expected={near(0.8)}
                  display="0,8"
                  parse={parseDec}
                  requires={['jadwal-tanasub']}
                  explain={<MathText>{ACTIVITY.closing}</MathText>}
                  explainFor={(n) => (near(1.25)(n) ? <MathText>{ACTIVITY_LINES.inverse}</MathText> : null)}
                  onAnswered={() => setQ3b(true)}
                />
              )}
              {q3b && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'في رحلاتك وفي تخفيض العيد: حاصل القسمة ثابت، والسعر الجديد يساوي $0{,}8 \\times$ السعر القديم. المحور التالي يعلّمك حساب المعامل وإكمال جدول، ويريك صيغة كراء يزداد فيها السعر دون أن تكون تناسبية.'}</MathText>
                </p>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
