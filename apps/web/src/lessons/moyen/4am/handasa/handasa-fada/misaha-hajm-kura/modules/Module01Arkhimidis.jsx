import React, { useState } from 'react';
import { ContentModule, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import SpaceFigure from '../../../../../../common/components/SpaceFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ARCHIMEDES, ARCH_LINES, LAB } from '../content/textbook';
import { FIG_ARCHIMEDES } from '../content/figures';

/**
 * Module 1 — l'entrée du درس : l'introduction d'Archimède (p. 163, doublon DÉCLARÉ de la page d'unité ; le livre n'a pas
 * d'activité pour ce درس), ouverte sur L'ORANGE DE BOUFARIK (orange-peel).
 *
 * REAL / DISCOVER / MANIPULATE  le lab à deux niveaux, même objectif :
 *   متقدم (ouvert par défaut : Archimède, la ressource du manuel qui ouvre ce درس) : R au dixième de 1 à 6, le verre sans
 *          graduation, la marque au douzième, puis — ouvert par l'élève après la règle — l'exemple de معارف 2 (R = 1,4) ;
 *   مبتدئ : R entier (défaut 3), le verre gradué au sixième.
 *   Dans les deux : PRÉDIRE les disques, éplucher (la peau déborde ou laisse un disque vide si la prédiction est fausse),
 *   écrire 𝒜 (πR², 2πR, 4/3·πR³ refusés) ; MARQUER le jus, presser (refus au-dessus / au-dessous des 2/3), écrire 𝒱.
 * UNDERSTAND  le texte d'Archimède et sa figure (le cylindre de hauteur 2R : volume 2πR³, aire latérale 4πR²), puis les
 *           questions sous les essais de l'élève (`onTrial`, `[data-activity-evidence]`) : 4 disques ; 2/3 du cylindre.
 * AUCUNE étape n'attend `onFinished`. LP : P1 (l'aire), P2 (le volume).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a || 1; };
const twelfth = (m) => { const g = gcd(m, 12); return `$\\frac{${m / g}}{${12 / g}}$`; };

export default function Module01Arkhimidis() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  const onTrial = (ev) => { if (ev && (ev.stage === 'peel' || ev.stage === 'pour')) setTrials((s) => [...s, ev].slice(-12)); };
  const peels = trials.filter((t) => t.stage === 'peel');
  const pours = trials.filter((t) => t.stage === 'pour');

  const evidence = (list, kind) => (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence={kind} data-tried={list.length ? 'true' : 'false'}>
      {list.length === 0 ? (
        <p className="text-slate-500">{kind === 'peel' ? 'لم تقشّر البرتقالة بعد (في المناولة أعلاه).' : 'لم تعصر البرتقالة بعد (في المناولة أعلاه، بعد القشرة).'}</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">{kind === 'peel' ? 'تجاربك مع القشرة:' : 'تجاربك مع العصير:'}</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence={kind}>
            {list.map((t) => (
              <li key={`${t.R}-${t.n}`} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${t.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`} data-evidence-trial={t.kind}>
                <MathText>{kind === 'peel'
                  ? `$R = ${t.R.replace(',', '{,}')}\\,\\mathrm{cm}$ : توقّعت ${t.k} ${t.k === 1 ? 'قرصا' : t.k === 2 ? 'قرصين' : 'أقراص'} ${t.ok ? '✓' : '✗'}`
                  : `$R = ${t.R.replace(',', '{,}')}\\,\\mathrm{cm}$ : العلامة ${twelfth(t.m)} ${t.ok ? '✓' : '✗'}`}</MathText>
              </li>
            ))}
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
      moduleTitle="أرخميدس والبرتقالة — كرة داخل أسطوانة"
      moduleSubtitle="قشرة برتقالة وعصيرها: ماذا اكتشف أرخميدس؟"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'مدخل الوحدة — الكتاب ص 163',
        headline: 'برتقالة من بوفاريك على طاولة المطبخ!',
        emoji: '🍊',
        title: ACTIVITY.title,
        tone: 'amber',
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation} <SourceTag source={ACTIVITY.situationSource} /></p>
            <p className="text-sm text-slate-600">في المستوى «متقدم» (أرخميدس): نصف قطر تختاره بين 1 و 6 سنتيمترات، كأس دون تدريج، ثم مثال الكتاب. في المستوى «مبتدئ»: برتقالة نصف قطرها عدد طبيعي، وكأس مدرّجة.</p>
          </div>
        ),
        footer: <SourceTag source={ARCHIMEDES.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="المناولة: القشرة والعصير"
          defaultLevel="advanced"
          lead="في المستويين: توقّع أولا، ثم قشّر واعصر. القشرة تُقاس بأقراص نصف قطر كل منها R، والعصير يُقاس بالكأس التي تدخل فيها البرتقالة تماما."
          levels={{
            beginner: () => (
              <Manipulation
                type="orange-peel"
                level="beginner"
                {...LAB.beginner.numbers}
                theme="boufarik-orange"
                title="برتقالة نصف قطرها 3 cm: كم قرصا تغطي قشرتها، وأين يتوقّف عصيرها؟"
                lead={<MathText>{'نصف القطر عدد طبيعي من $1$ إلى $5$ ؛ الكأس مدرّجة إلى أسداس ارتفاعها.'}</MathText>}
                onTrial={onTrial}
              />
            ),
            advanced: () => (
              <Manipulation
                type="orange-peel"
                level="advanced"
                {...LAB.advanced.numbers}
                theme="boufarik-orange"
                title="أرخميدس: نصف القطر من 1 إلى 6 cm، ثم مثال الكتاب R = 1,4 cm"
                lead={<MathText>{'كرة نصف قطرها $R$ داخل أسطوانة ارتفاعها $2R$ (أرخميدس): القشرة ثم العصير، ثم التدوير في مثال الكتاب.'}</MathText>}
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أرخميدس: كرة داخل أسطوانة', subtitle: 'الأسطوانة التي تحيط بالكرة', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={`${ARCHIMEDES.text} ${ARCHIMEDES.setup}`} source={ARCHIMEDES.source} compact />
              <p className="text-xs text-slate-500" data-correction>{ARCHIMEDES.reading}</p>
              <SpaceFigure {...FIG_ARCHIMEDES} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">الأسطوانة التي توجد داخلها الكرة (نصف قطر الكرة R):</p>}
                rows={[
                  // 2R : le diamètre ; R/2 : la moitié du rayon
                  { id: 'r', label: 'نصف قطر قاعدتها', options: ['$R$', '$2R$', '$\\frac{R}{2}$'].map(M), correct: 0, correction: <MathText>{ARCH_LINES.radius}</MathText> },
                  { id: 'h', label: 'ارتفاعها', options: ['$R$', '$2R$', '$4R$'].map(M), correct: 1, correction: <MathText>{ARCH_LINES.height}</MathText> },
                  // πR³ : la hauteur R ; 4πR² : l'aire latérale (MISC-WAHDA)
                  { id: 'v', label: 'حجمها', options: ['$\\pi R^2 \\times R = \\pi R^3$', '$2\\pi R \\times 2R = 4\\pi R^2$', '$\\pi R^2 \\times 2R = 2\\pi R^3$'].map(M), correct: 2, correction: <MathText>{ARCH_LINES.volume}</MathText> },
                  // 2πR³ : le volume ; 2πR² : la hauteur R
                  { id: 'l', label: 'مساحتها الجانبية', options: ['$2\\pi R \\times 2R = 4\\pi R^2$', '$\\pi R^2 \\times 2R = 2\\pi R^3$', '$2\\pi R \\times R = 2\\pi R^2$'].map(M), correct: 0, correction: <MathText>{ARCH_LINES.lateral}</MathText> },
                ]}
                requires={['hajm-ustuwana', 'misaha-janibiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: الأسطوانة على مقاس الكرة تماما — حجمها ومساحتها الجانبية معروفان.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'القشرة: كم قرصا؟', subtitle: 'مساحة الكرة', done: q2,
          content: (
            <div className="space-y-3">
              {evidence(peels, 'peel')}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">من تجاربك مع قشرة البرتقالة:</p>}
                rows={[
                  // 1 disque : MISC-MISAHA-DAIRA ; 2 disques : la moitié
                  { id: 'n', label: <MathText>{'قشرة كرة نصف قطرها $R$ تغطي تماما'}</MathText>, options: ['أربعة أقراص نصف قطر كل منها R', 'قرصا واحدا نصف قطره R', 'قرصين نصف قطر كل منهما R'], correct: 0, correction: <MathText>{ARCH_LINES.areaEqual}</MathText> },
                  { id: 'R', label: <MathText>{'إذا غيّرنا $R$'}</MathText>, options: ['يتغيّر عدد الأقراص مع R', 'تبقى القشرة أربعة أقراص، لكن كل قرص يتغيّر مع R', 'لا تتغيّر مساحة القشرة'], correct: 1, correction: <MathText>{'العدد 4 لا يتغيّر: القرص نفسه $\\pi R^2$ هو الذي يكبر أو يصغر مع $R$ .'}</MathText> },
                  // le volume du cylindre ; la base seule
                  { id: 'eq', label: 'مساحة الكرة تساوي', options: ['حجم الأسطوانة $2\\pi R^3$', 'مساحة قاعدة الأسطوانة $\\pi R^2$', 'المساحة الجانبية للأسطوانة $4\\pi R^2$'].map(M), correct: 2, correction: <MathText>{ARCH_LINES.areaEqual}</MathText> },
                ]}
                requires={['misaha-janibiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: أربعة أقراص كبرى، كما وجد أرخميدس.' : 'راجع التصحيح تحت كل سطر، وأعد تجربة القشرة.'}</Feedback>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="arkhimidis-misaha" lead="ما وجدته بالقشرة، وما وجده أرخميدس:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'العصير: إلى أين؟', subtitle: 'حجم الجلّة', done: q3,
          content: (
            <div className="space-y-3">
              {evidence(pours, 'pour')}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">من تجاربك مع العصير في الكأس التي نصف قطرها R وارتفاعها 2R:</p>}
                rows={[
                  // la moitié ; plein : MISC-HAJM (le cylindre entier)
                  { id: 'lvl', label: 'يتوقّف عصير البرتقالة عند', options: ['نصف ارتفاع الكأس', 'ثلثي ارتفاع الكأس', 'أعلى الكأس: يملؤها'], correct: 1, correction: <MathText>{'الجلّة تملأ ثلثي الأسطوانة: يصل العصير إلى الارتفاع $\\frac{2}{3} \\times 2R = \\frac{4}{3}R$ .'}</MathText> },
                  // le cylindre entier ; la moitié
                  { id: 'vol', label: 'حجم الجلّة', options: ['$\\frac{2}{3} \\times 2\\pi R^3 = \\frac{4}{3}\\pi R^3$', '$2\\pi R^3$', '$\\frac{1}{2} \\times 2\\pi R^3 = \\pi R^3$'].map(M), correct: 0, correction: <MathText>{ARCH_LINES.volumeTwoThirds}</MathText> },
                ]}
                requires={['hajm-ustuwana']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: ثلثا الأسطوانة — اكتشاف أرخميدس الثاني.' : 'راجع التصحيح تحت كل سطر، وأعد تجربة العصير.'}</Feedback>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="arkhimidis-hajm" lead="ما وجدته بالعصير، بكلمات أرخميدس:" />}
              {/* La « مسألة الدرس » prolonge le lab (dans l'intro, les deux niveaux) : une orange de 7 cm dans son verre — module 5. */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
