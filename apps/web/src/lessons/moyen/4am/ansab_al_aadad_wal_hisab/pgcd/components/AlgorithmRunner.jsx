import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MathText from '../../../../../common/components/MathText';
import { euclidSteps, differenceSteps } from './pgcdUtils';

/**
 * AlgorithmRunner — l'élève exécute LUI-MÊME l'une des deux méthodes que le
 * programme nomme, une étape à la fois.
 *
 * Ce n'est pas une animation qu'on regarde : à chaque étape, l'élève doit
 * poser le bon geste (choisir le résultat de la soustraction, ou celui de la
 * division euclidienne) parmi quelques propositions. La méthode s'apprend en
 * la FAISANT, et la ligne ne s'écrit que lorsque le geste est juste.
 *
 * NON BLOQUANT (LESSON_CONTRACT.md, invariant dur) : un mauvais choix
 * affiche un retour ciblé et laisse réessayer — la manipulation est
 * REJOUABLE, donc l'élève n'est jamais enfermé. Le module, lui, valide son
 * étape dès que l'algorithme est allé à son terme.
 *
 * Les deux modes partagent ce composant à dessein : c'est ainsi que l'élève
 * voit que la division euclidienne est un RACCOURCI des soustractions, et
 * non une seconde recette sans rapport.
 */
export default function AlgorithmRunner({
  a,
  b,
  mode,                // 'difference' | 'euclid'
  revealed = 0,        // nombre d'étapes déjà validées — POSSÉDÉ PAR LE MODULE
  onStepValidated,     // (nextRevealed, isFinished) => void
  onWrongChoice,       // (chosen) => void — le module décide quoi dire
  wrongHint = '',      // message affiché après un mauvais choix
  disabled = false,
}) {
  const reduce = useReducedMotion();
  const { steps, gcd } = mode === 'euclid' ? euclidSteps(a, b) : differenceSteps(a, b);

  const finished = revealed >= steps.length;
  const current = finished ? null : steps[revealed];

  // Les propositions : la bonne réponse et deux erreurs PLAUSIBLES, pas
  // aléatoires — ce sont les confusions réelles de cette méthode.
  const choices = current ? buildChoices(current, mode) : [];

  const pick = (value) => {
    if (disabled) return;
    const right = mode === 'euclid' ? current.r : current.diff;
    if (value === right) {
      const next = revealed + 1;
      onStepValidated?.(next, next >= steps.length);
    } else {
      onWrongChoice?.(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Le tableau des étapes déjà écrites. */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          {mode === 'euclid' ? 'القسمات المتتالية' : 'الطرحات المتتالية'}
        </div>

        {revealed === 0 && (
          <p className="text-sm text-slate-400">
            لم تُنجز أيّ خطوة بعد. اختر نتيجة الخطوة الأولى أدناه.
          </p>
        )}

        <ol className="space-y-1.5">
          {steps.slice(0, revealed).map((s, i) => (
            <motion.li
              key={i}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-sm text-slate-800 flex items-center gap-2"
            >
              <span className="text-[10px] text-slate-400 w-4 shrink-0">{i + 1}</span>
              <MathText>
                {mode === 'euclid'
                  ? `$${s.a} = ${s.b} \\times ${s.q} + ${s.r}$`
                  : `$${s.big} - ${s.small} = ${s.diff}$`}
              </MathText>
            </motion.li>
          ))}
        </ol>

        {finished && (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900"
            role="status"
          >
            <div className="text-sm font-bold">
              {mode === 'euclid'
                ? 'الباقي أصبح معدومًا: نتوقف.'
                : 'العددان تساويا: نتوقف.'}
            </div>
            <div className="mt-1">
              <MathText>{`$\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${gcd}$`}</MathText>
            </div>
          </motion.div>
        )}
      </div>

      {/* Le geste à poser maintenant. */}
      {!finished && (
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4 space-y-3">
          <div className="text-sm font-semibold text-slate-800">
            {mode === 'euclid' ? (
              <>
                القسمة الإقليدية:{' '}
                <MathText>{`$${current.a} \\div ${current.b}$`}</MathText> —
                ما هو <strong>الباقي</strong>؟
              </>
            ) : (
              <>
                اطرح:{' '}
                <MathText>{`$${current.big} - ${current.small}$`}</MathText> —
                ما هي النتيجة؟
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {choices.map((c) => (
              <button
                key={c}
                type="button"
                disabled={disabled}
                onClick={() => pick(c)}
                className="min-w-[64px] min-h-[48px] px-4 rounded-xl border-2 border-slate-300 bg-white font-mono text-base font-extrabold text-slate-800 hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
              >
                {c}
              </button>
            ))}
          </div>

          {wrongHint && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {wrongHint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Les propositions d'une étape : la bonne, et les erreurs que cette méthode
 * provoque réellement.
 *
 *  - Euclide : confondre le QUOTIENT avec le RESTE est l'erreur numéro un ;
 *    « reste + diviseur » vient d'une division mal posée.
 *  - Différences : soustraire dans le mauvais sens, ou additionner.
 */
function buildChoices(step, mode) {
  const set = new Set();
  if (mode === 'euclid') {
    set.add(step.r);
    set.add(step.q);
    set.add(step.r + step.b);
  } else {
    set.add(step.diff);
    set.add(step.big + step.small);
    set.add(Math.abs(step.small - step.diff));
  }
  // Les valeurs négatives ou dupliquées disparaissent ; on complète pour
  // garder au moins trois cases, sans jamais proposer deux fois la même.
  const out = [...set].filter((n) => Number.isFinite(n) && n >= 0);
  let pad = 1;
  while (out.length < 3) {
    const candidate = (mode === 'euclid' ? step.r : step.diff) + pad;
    if (!out.includes(candidate)) out.push(candidate);
    pad += 1;
  }
  return out.sort((x, y) => x - y);
}
