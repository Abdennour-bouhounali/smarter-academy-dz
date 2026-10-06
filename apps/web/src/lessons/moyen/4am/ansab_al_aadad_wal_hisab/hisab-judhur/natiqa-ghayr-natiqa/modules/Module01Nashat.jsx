import React, { useCallback, useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 2 (p. 20) : le classement de huit racines en deux صنفين.
 *
 * LABORATOIRE À DEUX NIVEAUX, un seul instrument (`square-root-side`, mode
 * `graduation`) : l'élève choisit une aire, choisit la graduation de la règle
 * (1/1, 1/2, 1/3 …) et TIRE le côté du carré. Une racine « tombe » sur une
 * graduation — √(16/9) sur les tiers, √0,25 sur les demis — ou n'y tombe sur
 * aucune (√6, √7, √13, √(25/13)) : c'est le critère du classement, vécu avant
 * d'être lu.
 *
 *   مبتدئ  — 9, 0,25 et 7 (trois nombres du classement), graduations jusqu'à 1/10.
 *   متقدم  — les six autres aires du classement, graduations jusqu'à 1/12 ;
 *            ouvert par défaut : c'est l'activité du manuel.
 *
 * Les ÉTAPES sont les deux questions du manuel (أ : √169, ب : le critère). La
 * réponse se lit dans les ESSAIS DE L'ÉLÈVE, listés au-dessus de la question
 * (`data-activity-evidence`) — les options ne portent pas la preuve. La
 * brique `murabba-natiq` nomme ensuite ce que l'élève a vu (6bis.1).
 *
 * « أتوقّع القاعدة » : la question ب) a pour bonne option la règle elle-même ;
 * elle est donc enveloppée dans <PredictRule id="murabba-natiq"> — l'élève
 * écrit le critère avec ses mots (predictPrompt de knowledge.jsx) AVANT de
 * voir les options, puis la question et la brique s'affichent.
 * La « مسألة الدرس » (LessonProblemCard) ferme la dernière étape : même règle
 * graduée, d'autres aires (les زرابي), résolue au module 4.
 *
 * Le laboratoire RÉDUIT chaque aire (logic/squareRootSide `init`) : la carte
 * de 0,25 s'affiche √(1/4). La leçon le dit dans le `lead` ; la liste des
 * essais garde l'écriture du manuel (√0,25).
 * LP : P1, P2.
 */
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const keyOf = ({ num, den }) => { const g = gcd(num, den); return `${num / g}/${den / g}`; };
const sideTex = (v, g) => { const d = gcd(v, g); return g / d === 1 ? String(v / d) : `\\dfrac{${v / d}}{${g / d}}`; };

// Les huit racines du classement imprimé, avec l'écriture du manuel.
const ENTRIES = [
  ...ACTIVITY.numbers.first.map((a, i) => ({ key: keyOf(a), tex: ACTIVITY.classes.first.items[i] })),
  ...ACTIVITY.numbers.second.map((a, i) => ({ key: keyOf(a), tex: ACTIVITY.classes.second.items[i] })),
];
const BEGINNER = [ACTIVITY.numbers.first[1], ACTIVITY.numbers.first[3], ACTIVITY.numbers.second[0]]; // 9, 0,25, 7
const ADVANCED = [ACTIVITY.numbers.first[0], ACTIVITY.numbers.first[2], ACTIVITY.numbers.first[3],
  ACTIVITY.numbers.second[3], ACTIVITY.numbers.second[1], ACTIVITY.numbers.second[2]]; // 100, 16/9, 0,25, 6, 13, 25/13

/** Les essais de l'élève, racine par racine — rien de ce qu'il n'a pas essayé. */
function Evidence({ trials, entries }) {
  return (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {entries.map(({ key, tex }) => {
        const t = trials[key];
        return (
          <li key={key} className={t ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={key} data-tried={t ? 'true' : 'false'}>
            {t?.exact ? (
              <span>
                <MathText>{`$${tex.slice(1, -1)} = ${sideTex(t.exact.v, t.exact.scale)}$`}</MathText>
                {' — وقع على التدريجة '}<bdi dir="ltr">1/{t.exact.scale}</bdi>
              </span>
            ) : t ? (
              <span>
                <MathText>{tex}</MathText>
                {' — لم يقع على أيّ تدريجة جرّبتها. عدد التدريجات المجرّبة: '}{t.grads.length}
              </span>
            ) : (
              <span><MathText>{tex}</MathText>{' — لم تجرّبه بعد على المسطرة.'}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Module01Nashat() {
  // Les essais VALIDÉS sur la règle (onTrial), aux deux niveaux.
  const [trials, setTrials] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const record = useCallback(({ area, side, scale, cmp }) => {
    const key = keyOf(area);
    setTrials((all) => {
      const prev = all[key] ?? { exact: null, grads: [] };
      const exact = prev.exact ?? (cmp === 0 ? { v: side, scale } : null);
      const grads = prev.grads.includes(scale) ? prev.grads : [...prev.grads, scale];
      return { ...all, [key]: { exact, grads } };
    });
  }, []);
  const { question } = ACTIVITY.numbers;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 — صنفان من الجذور"
      moduleSubtitle="هل يقع الجذر على تدريجة؟"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 20',
        headline: 'هل يقع الجذر على تدريجة؟',
        emoji: '📏',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p><MathText>{ACTIVITY.text}</MathText></p>
            <p><strong>{ACTIVITY.classes.first.label}</strong>{' '}<MathText>{ACTIVITY.classes.first.items.join(' ، ')}</MathText></p>
            <p><strong>{ACTIVITY.classes.second.label}</strong>{' '}<MathText>{ACTIVITY.classes.second.items.join(' ، ')}</MathText></p>
            <p className="text-xs text-slate-500">{ACTIVITY.correctionNote}</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="الجذر التربيعي للعدد a هو طول ضلع المربّع الذي مساحته a. اختر مساحة من التصنيف، ثم تدريجة للمسطرة، واسحب طرف الضلع: هل يقع الضلع على تدريجة بالضبط؟ المساحة 0,25 تظهر على بطاقتها كسرًا يساوي الربع."
          levels={{
            beginner: () => (
              <Manipulation
                type="square-root-side"
                mode="graduation"
                level="beginner"
                areas={BEGINNER}
                scale={10}
                title="ثلاث مساحات من التصنيف: 9 ، 0,25 ، 7"
                lead="ابدأ بمسطرة مقسّمة إلى وحدات، ثم إلى أنصاف، ثم إلى أعشار…"
                onTrial={record}
              />
            ),
            advanced: () => (
              <Manipulation
                type="square-root-side"
                mode="graduation"
                level="advanced"
                areas={ADVANCED}
                scale={12}
                title="تصنيف الكتاب: ست مساحات، وتدريجات حتى الجزء من 12"
                lead="أنت من يختار التدريجة لكل مساحة، وأنت من يقرّر متى تتوقّف عن البحث."
                onTrial={record}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: <MathText>{ACTIVITY.questions[0]}</MathText>, subtitle: 'جرّب مساحات الصنفين على المسطرة، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              <Evidence trials={trials} entries={ENTRIES} />
              <TapQuestion
                prompt={<span>إلى أي الصنفين ينتمي العدد <MathText>{`$\\sqrt{${question}}$`}</MathText>؟</span>}
                options={[
                  <span key="a">الصنف الأول، لأن <MathText>{'$13^2 = 169$'}</MathText> فـ <MathText>{'$\\sqrt{169} = 13$'}</MathText></span>,
                  <span key="b">الصنف الثاني، لأنه لا يوجد عدد ناطق مربعه 169</span>,
                  <span key="c">الصنف الثاني، لأن <MathText>{'$\\sqrt{169} = 84{,}5$'}</MathText></span>,
                  <span key="d">لا ينتمي إلى أيّ من الصنفين</span>,
                ]}
                correct={0}
                cols={1}
                requires={['jidhr-taarif', 'adad-natiq']}
                explain={<span><MathText>{'$13^2 = 169$'}</MathText> و 13 عدد موجب، إذن <MathText>{'$\\sqrt{169} = 13$'}</MathText>: يقع على تدريجة الوحدات، مثل <MathText>{'$\\sqrt{100} = 10$'}</MathText> و <MathText>{'$\\sqrt{9} = 3$'}</MathText>.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: ACTIVITY.questions[1], done: q2,
          content: (
            <div className="space-y-3">
              <Evidence trials={trials} entries={ENTRIES} />
              <PredictRule id="murabba-natiq">
                <TapQuestion
                  prompt={<span>ما هو معيار التصنيف؟</span>}
                  options={[
                    'الأعداد تحت الجذر في الصنف الأول أعداد طبيعية، وفي الصنف الثاني ليست أعدادًا طبيعية',
                    'في الصنف الأول العدد تحت الجذر مربع لعدد ناطق، فجذره عدد ناطق؛ وفي الصنف الثاني ليس مربعًا لعدد ناطق، فجذره ليس عددًا ناطقًا',
                    'الأعداد تحت الجذر في الصنف الأول أصغر من الأعداد تحت الجذر في الصنف الثاني',
                    'الأعداد تحت الجذر في الصنف الثاني أعداد أولية',
                  ]}
                  correct={1}
                  cols={1}
                  requires={['jidhr-taarif', 'adad-natiq']}
                  explain={<span>جذور الصنف الأول وقعت على تدريجة: <MathText>{'$\\sqrt{100} = 10$ ، $\\sqrt{9} = 3$ ، $\\sqrt{\\dfrac{16}{9}} = \\dfrac{4}{3}$ ، $\\sqrt{0{,}25} = \\dfrac{1}{2}$'}</MathText>. أما جذور الصنف الثاني فلم تقع على أيّ تدريجة. (الصنف الأول فيه <MathText>{'$\\dfrac{16}{9}$'}</MathText> وليس عددًا طبيعيًا، وفيه 100 وهو أكبر من 7، و 6 في الصنف الثاني ليس عددًا أوليًا.)</span>}
                  onAnswered={() => setQ2(true)}
                />
              </PredictRule>
              {q2 && <KnowledgeBrick id="murabba-natiq" lead="ما رأيته على المسطرة يقوله الكتاب في «معارف»:" />}
              {/* La « مسألة الدرس » prolonge la règle graduée : des carrés d'aire
                  connue, un côté qui tombe ou non sur une graduation — module 4. */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
