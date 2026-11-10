import React, { useCallback, useEffect, useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';
import { M1_ROUNDS } from '../content/rulers';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';
import { useSavedAnswer } from '../../../../../../common/answers/useSavedAnswer';

/**
 * Module 1 — نشاط 2 (p. 20) : « هل يقع الجذر على تدريجة ؟ » (rétrofit 2026-10-15 : le labo en tête SANS carte, SANS titre ni lead
 * d'atelier ; le classement du manuel ne vient qu'APRÈS la première réponse ; la question أ (√169) devient une application).
 *
 * LABORATOIRE À DEUX NIVEAUX, un seul instrument (`square-root-side`, mode `graduation`) : l'élève choisit une aire, choisit la
 * graduation de la règle (1/1, 1/2, 1/3 …) et TIRE le côté du carré. Une racine « tombe » sur une graduation — √(16/9) sur les
 * tiers, √0,25 sur les demis — ou n'y tombe sur aucune (√6, √7, √13, √(25/13)) : c'est le critère du classement, vécu avant d'être lu.
 *
 *   مبتدئ  — 9, 0,25 et 7 (trois nombres du classement), graduations jusqu'à 1/10 : l'ENTRÉE retenue.
 *   متقدم  — les six autres aires du classement, graduations jusqu'à 1/12 ; l'activité complète du manuel.
 *
 * ENTRÉE (§4ter) — candidats : (A) le classement imprimé du manuel (huit racines déjà rangées en deux صنفين) puis « à quel صنف
 * appartient √169 ? » — rejeté : la liste donne la réponse et √169 se tranche de mémoire (13² = 169), sans rien faire de la main ;
 * (B) la règle graduée sur trois aires seulement, dont une qui ne tombe nulle part — RETENU : pour savoir si un côté « tombe », il
 * faut le TIRER ; 7 refuse toute graduation, sans jamais dire pourquoi. Même instrument que le manuel, trois de ses nombres.
 * ORDRE DES IDÉES (étapes) : 1. pourquoi √0,25 tombe sur les demis (sa propre trace) → 2. le classement du manuel (encadré, APRÈS la
 * 1re réponse) et son critère, écrit d'abord avec les mots de l'élève (« أتوقّع القاعدة »), PUIS la brique `murabba-natiq` →
 * 3. l'application : le صنف de √169 (question أ du manuel). Les essais de l'élève sont listés au-dessus (`data-activity-evidence`).
 *
 * Le laboratoire RÉDUIT chaque aire (logic/squareRootSide `init`) : la carte de 0,25 s'affiche √(1/4). La leçon le dit dans le
 * `lead` ; la liste des essais garde l'écriture du manuel (√0,25).
 * LP : P1, P2.
 *
 * LECTEUR DE MISSION (rollout 2026-11-09, unité 2 leçon 2) : le labo se joue en MANCHES (content/rulers.js › M1_ROUNDS : 16 et 2 à la main avec
 * ses questions → 7 et 0,25 avec deux prédictions → 16/9 et 13 → défi ⭐ 25/13 et 49/36 → atelier libre des six aires) au lieu de مبتدئ / متقدم ;
 * les étapes 1 et 2 attendent la manche 2 (`needsRound` : 0,25 y tombe, 7 y résiste), et ses essais remplissent les preuves (`onTrial`). Hors lecteur :
 * inchangé.
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

/** Deux mémoires d'essais réunies (racine par racine : le côté exact trouvé, l'union des graduations essayées). */
function mergeTrials(a = {}, b = {}) {
  const out = { ...a };
  Object.entries(b).forEach(([key, t]) => {
    const p = out[key] ?? { exact: null, grads: [] };
    out[key] = { exact: p.exact ?? t.exact ?? null, grads: [...new Set([...p.grads, ...(t.grads ?? [])])] };
  });
  return out;
}

export default function Module01Nashat() {
  // Les essais VALIDÉS sur la règle (onTrial), aux deux niveaux — et, dans le lecteur, GARDÉS (answers/useSavedAnswer) : après un
  // rechargement la liste des essais et la règle trouvée reviennent (revue ECC 2026-11-09 : sinon l'étape 2 attendait des questions
  // invisibles et la liste disait « لم تجرّبه بعد » pour des manches gagnées).
  const memory = useSavedAnswer([], { key: 'lab-rulers', lessonId: MODULE_CTX.lessonId, moduleNumber: 1 });
  const [live, setTrials] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [cpDone, setCpDone] = useState({});
  // Dans le lecteur : la manche 2 gagnée (0,25 tombé juste, 7 qui résiste) ouvre les étapes 1 et 2 ; la manche 1 gagnée = sa suite
  // de questions finie (son but est { checkpoint: 'rule' }) — ses étoiles sont gardées, la règle l'est donc aussi.
  const [won, setWon] = useState({});
  const kept = memory.saved?.v ?? {};
  const trials = mergeTrials(kept.trials, live);
  const ruleDone = !!cpDone.rule || !!won.r1 || !!kept.rule || q2;
  const { save } = memory;
  useEffect(() => {
    if (!memory.on || (!Object.keys(live).length && !cpDone.rule)) return;
    save({ trials: mergeTrials(kept.trials, live), rule: !!(kept.rule || cpDone.rule) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, cpDone.rule]);
  const record = useCallback(({ tk, id, area, side, scale, cmp }) => {
    if (tk === 'checkpoint-done') setCpDone((d) => ({ ...d, [id]: true }));
    if (tk || !area) return;   // les événements des questions du labo (LabCheckpoint) ne sont pas des essais
    const key = keyOf(area);
    setTrials((all) => {
      const prev = all[key] ?? { exact: null, grads: [] };
      const exact = prev.exact ?? (cmp === 0 ? { v: side, scale } : null);
      const grads = prev.grads.includes(scale) ? prev.grads : [...prev.grads, scale];
      return { ...all, [key]: { exact, grads } };
    });
  }, []);
  const { question } = ACTIVITY.numbers;
  const round = { id: 'r2', label: 'الجولة 2', icon: '🧶', won: Boolean(won.r2) };

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 — صنفان من الجذور"
      moduleSubtitle="هل يقع الجذر على تدريجة؟"
      estimatedTime="12 دقيقة"
      objectives={['هل يقع الجذر التربيعي دائمًا على تدريجة المسطرة؟', 'ما الذي يميّز الأعداد تحت الجذر في الصنفين؟', 'كيف نصنّف جذرًا جديدًا دون مسطرة؟']}
      intro={
        <PlayerSwitch
          player={(
            <LabRounds lessonId={MODULE_CTX.lessonId} labId="m1-rulers" rounds={M1_ROUNDS} icon="🧶" freeIcon="🪡"
              onTrial={record} onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))} />
          )}
          page={(
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="square-root-side"
                mode="graduation"
                level="beginner"
                areas={BEGINNER}
                scale={10}
                lead="الجذر التربيعي للعدد a هو طول ضلع المربّع الذي مساحته a. ابدأ بالمساحة 9، ثم 0,25 (تظهر على بطاقتها كسرًا يساوي الربع)، ثم 7: مسطرة بوحدات، ثم بأنصاف، ثم بأعشار…"
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
                lead="ست مساحات أخرى: أنت من يختار التدريجة لكل مساحة، وأنت من يقرّر متى تتوقّف عن البحث."
                onTrial={record}
              />
            ),
          }}
        />
          )}
        />
      }
      steps={[
        {
          needsRound: round, num: 1, title: <MathText>{'لماذا وقع ضلع المربّع الذي مساحته $0{,}25$ على تدريجة؟'}</MathText>, subtitle: 'جرّب مساحات على المسطرة، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              <Evidence trials={trials} entries={ENTRIES} />
              <TapQuestion
                prompt={<span>في لوحتك وقع ضلع المربّع الذي مساحته <MathText>{'$0{,}25$'}</MathText> على تدريجة الأنصاف. لماذا؟</span>}
                options={[
                  <span key="a">لأن <MathText>{'$\\dfrac{1}{2} \\times \\dfrac{1}{2} = 0{,}25$'}</MathText>: ضلع المربّع هو <MathText>{'$\\dfrac{1}{2}$'}</MathText>، وهو عدد ناطق</span>,
                  <span key="b">لأن 0,25 أصغر من 1</span>,
                  <span key="c">لأن 0,25 عدد عشري والمسطرة عشرية</span>,
                  <span key="d">لأن المسطرة المقسّمة إلى أنصاف تصلح لكل المساحات</span>,
                ]}
                correct={0}
                cols={1}
                requires={['jidhr-taarif', 'adad-natiq']}
                explain={<span><MathText>{'$\\left(\\dfrac{1}{2}\\right)^2 = \\dfrac{1}{4} = 0{,}25$'}</MathText> و <MathText>{'$\\dfrac{1}{2}$'}</MathText> عدد موجب، إذن <MathText>{'$\\sqrt{0{,}25} = \\dfrac{1}{2}$'}</MathText>: يقع على تدريجة الأنصاف، مثلما يقع <MathText>{'$\\sqrt{9} = 3$'}</MathText> على تدريجة الوحدات.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          needsRound: round, num: 2, title: ACTIVITY.questions[1], subtitle: 'ما الذي يميّز ما وقع على تدريجة عمّا لم يقع؟', done: ruleDone,
          content: (
            <div className="space-y-3">
              <Evidence trials={trials} entries={ENTRIES} />
              {q1 && (
                <>
                  <TextbookBox
                    kind="situation"
                    lines={[
                      ACTIVITY.text,
                      `${ACTIVITY.classes.first.label} ${ACTIVITY.classes.first.items.join(' ، ')}`,
                      `${ACTIVITY.classes.second.label} ${ACTIVITY.classes.second.items.join(' ، ')}`,
                    ]}
                    source={ACTIVITY.source}
                    compact
                  />
                  <p className={`rounded-xl border-2 px-3 py-2 text-sm ${ruleDone ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`} data-activity-evidence data-tried={ruleDone ? 'true' : 'false'}>
                    {ruleDone
                      ? 'أجبتَ في المختبر: يقع الجذر على تدريجة حين تكون المساحة مربّع عدد ناطق، ولا يقع على أي تدريجة حين لا تكون كذلك.'
                      : 'جرّب بطاقة تقع على تدريجة وبطاقة لا تقع على أي تدريجة في المختبر، وأجب عن الأسئلة التي تظهر فوقه.'}
                  </p>
                  {ruleDone && <KnowledgeBrick id="murabba-natiq" lead="ما رأيته على المسطرة نصوغه هكذا:" />}
                </>
              )}
            </div>
          ),
        },
        {
          num: 3, title: ACTIVITY.questions[0], subtitle: 'نطبّق المعيار على جذر جديد', done: q3,
          content: (
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
              requires={['murabba-natiq']}
              explain={<span><MathText>{'$13^2 = 169$'}</MathText> و 13 عدد موجب، إذن <MathText>{'$\\sqrt{169} = 13$'}</MathText>: يقع على تدريجة الوحدات، مثل <MathText>{'$\\sqrt{100} = 10$'}</MathText> و <MathText>{'$\\sqrt{9} = 3$'}</MathText>.</span>}
              onAnswered={() => setQ3(true)}
            />
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
