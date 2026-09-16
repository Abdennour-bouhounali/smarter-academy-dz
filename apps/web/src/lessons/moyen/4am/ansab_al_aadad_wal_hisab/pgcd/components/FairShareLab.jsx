import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * FairShareLab — la manipulation SIGNATURE de la leçon
 * (INTERACTION_PEDAGOGY.md §6bis : « Module 1 est un laboratoire, pas une
 * introduction »).
 *
 * ── CE QUE L'ÉLÈVE FAIT ────────────────────────────────────────────────
 * Il choisit une taille de paquet et voit AUSSITÔT, des deux côtés à la
 * fois, combien de paquets se forment et combien d'unités restent. Aucun
 * bouton « valider » ne s'interpose : le geste EST le calcul.
 *
 * ── POURQUOI CE N'EST PAS `PacketSplitter` (son prédécesseur) ──────────
 * L'ancienne version montrait UNE taille à la fois : l'élève pouvait donc
 * trouver « une taille qui marche » sans jamais voir qu'il y en a
 * PLUSIEURS, ni que l'une d'elles est la plus grande. Or c'est exactement
 * là qu'est le PGCD. Cette version ajoute donc la PISTE DES TAILLES : un
 * rail de 1 à max(a,b)/… où chaque taille déjà essayée garde sa marque —
 *
 *     ✓ vert   la taille tombe juste des DEUX côtés  (diviseur commun)
 *     ~ ambre  elle tombe juste d'un seul côté       (diviseur simple)
 *     ·  gris  elle laisse un reste des deux côtés
 *
 * Les marques PERSISTENT. Au bout de quelques essais, l'élève a sous les
 * yeux le semis de ses propres découvertes — et la question « laquelle est
 * la plus grande ? » se pose d'elle-même, sans que le module l'ait écrite.
 * C'est la découverte que §6bis exige : le module ne l'énonce pas d'abord.
 *
 * ── CE QUE LE COMPOSANT NE FAIT PAS ────────────────────────────────────
 * Il ne dit JAMAIS « PGCD = 12 ». Il ne connaît pas le mot. Le plus grand
 * commun n'apparaît (`highlightBest`) que si le MODULE le demande, et le
 * module ne le demande qu'après que l'élève a lui-même désigné sa réponse.
 * §9 : « ne pas donner la réponse avant que l'élève ait pu voir pourquoi ».
 *
 * ── ÉTAT ───────────────────────────────────────────────────────────────
 * ENTIÈREMENT CONTRÔLÉ (§28, une seule source de vérité) : `size` et
 * `tried` appartiennent au module. Tout l'affichage — paquets, restes,
 * couleurs du rail, égalités — dérive de `a`, `b`, `size` à chaque rendu.
 * Aucune vérité mathématique n'est stockée puis re-lue.
 *
 * ── RTL ────────────────────────────────────────────────────────────────
 * Que du FLUX : aucun <svg> à coordonnées, donc la direction arabe de la
 * page s'applique naturellement. Le rail des tailles est un flex qui se
 * remplit de droite à gauche comme le reste de la page. Les NOMBRES
 * restent en chiffres latins, comme partout sur la plateforme, et les
 * égalités passent par `dir="ltr"` pour ne pas être réordonnées par le
 * bidi.
 *
 * ── DISPOSITION (§16bis) ───────────────────────────────────────────────
 * Le rail des tailles est AU-DESSUS des deux colonnes, et les colonnes ont
 * une hauteur minimale réservée : changer de taille fait varier le nombre
 * de paquets dessinés, donc la hauteur — si les boutons étaient dessous,
 * ils fuiraient sous le doigt à chaque essai.
 */
export default function FairShareLab({
  a,                    // première quantité
  b,                    // seconde quantité
  size,                 // taille essayée — POSSÉDÉE PAR LE MODULE
  onSizeChange,         // (n) => void
  tried,                // Set<number> — les tailles déjà essayées
  maxSize,              // plus grande taille proposée sur le rail
  labelA,
  labelB,
  emojiA = '🟦',
  emojiB = '🟧',
  highlightBest = false, // le module autorise-t-il à souligner le plus grand ?
  disabled = false,
  maxDots = 60,          // au-delà, on résume au lieu de dessiner 300 points
}) {
  const reduce = useReducedMotion();

  const packsA = Math.floor(a / size);
  const restA = a % size;
  const packsB = Math.floor(b / size);
  const restB = b % size;
  const fits = restA === 0 && restB === 0;

  // Le rail va de 1 à `maxSize`. Au-delà de min(a, b), aucune taille ne peut
  // tomber juste : la borne est mathématique, pas esthétique.
  const rail = Array.from({ length: maxSize }, (_, i) => i + 1);

  // Le plus grand commun PARMI CE QUE L'ÉLÈVE A DÉJÀ ESSAYÉ — jamais le
  // PGCD réel tant que l'élève n'a pas exploré. C'est sa trouvaille à lui
  // qu'on souligne, pas une vérité tombée du ciel.
  const triedCommons = [...tried].filter((n) => a % n === 0 && b % n === 0);
  const bestTried = triedCommons.length ? Math.max(...triedCommons) : null;

  return (
    <div className="space-y-4">
      {/* ── LE RAIL DES TAILLES ─────────────────────────────────────────
          Les contrôles EN HAUT (§16bis) : les colonnes en dessous changent
          de hauteur à chaque essai, le rail, lui, ne bouge jamais. */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <div className="text-sm font-bold text-slate-800">
            ما حجم الطرد الذي نجرّبه؟
          </div>
          <div className="text-xs text-slate-500">
            جرّبت {tried.size} من {maxSize}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="أحجام الطرود">
          {rail.map((n) => {
            const active = n === size;
            const seen = tried.has(n);
            const okA = a % n === 0;
            const okB = b % n === 0;
            const both = okA && okB;
            const isBest = highlightBest && bestTried === n;

            // La couleur ne dit la vérité QUE pour les tailles déjà
            // essayées : le rail n'est pas une antisèche, c'est la mémoire
            // des découvertes de l'élève.
            let tone;
            if (!seen) {
              tone = 'border-slate-200 bg-white text-slate-400 hover:border-indigo-400 hover:text-slate-700';
            } else if (both) {
              tone = isBest
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                : 'border-emerald-400 bg-emerald-100 text-emerald-800';
            } else if (okA || okB) {
              tone = 'border-amber-300 bg-amber-50 text-amber-800';
            } else {
              tone = 'border-slate-200 bg-slate-100 text-slate-400';
            }

            return (
              <button
                key={n}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                aria-label={`حجم ${n}${seen ? (both ? ' — يصلح في الجهتين' : okA || okB ? ' — يصلح في جهة واحدة' : ' — لا يصلح') : ''}`}
                onClick={() => onSizeChange?.(n)}
                className={`relative min-w-[44px] min-h-[44px] px-2 rounded-xl border-2 font-mono text-sm font-extrabold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${tone} ${
                  active ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {n}
                {seen && both && (
                  <span
                    className="absolute -top-1 -end-1 text-[10px] leading-none"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500">
          العدد الأخضر ✓ = لا يبقى شيء في الجهتين. البرتقالي = يصلح في جهة
          واحدة فقط.
        </p>
      </div>

      {/* ── LES DEUX QUANTITÉS ──────────────────────────────────────────
          Hauteur minimale réservée : la plus petite taille du rail dessine
          le plus de paquets, donc la colonne la plus haute. Sans ce plancher,
          passer de 1 à 12 ferait sauter la page de plusieurs centaines de
          pixels (§17bis). */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Side
          total={a} size={size} packs={packsA} rest={restA}
          label={labelA} emoji={emojiA} maxDots={maxDots} reduce={reduce}
        />
        <Side
          total={b} size={size} packs={packsB} rest={restB}
          label={labelB} emoji={emojiB} maxDots={maxDots} reduce={reduce}
        />
      </div>

      {/* ── LE VERDICT ──────────────────────────────────────────────────
          Factuel, jamais un jugement sur l'élève (§13). Il décrit ce qui est
          à l'écran ; il n'annonce aucun résultat que l'élève n'a pas produit. */}
      <div
        role="status"
        aria-live="polite"
        className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${
          fits
            ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
            : 'border-amber-300 bg-amber-50 text-amber-900'
        }`}
      >
        {fits ? (
          <>
            ✓ لا يبقى شيء في الجهتين مع الحجم{' '}
            <strong className="font-mono">{size}</strong>.
            {highlightBest && bestTried !== null && bestTried !== size && (
              <>
                {' '}لكنّك وجدت حجمًا أكبر يعمل أيضًا:{' '}
                <strong className="font-mono">{bestTried}</strong>.
              </>
            )}
          </>
        ) : (
          <>
            يبقى <strong className="font-mono">{restA}</strong> من{' '}
            {labelA} و <strong className="font-mono">{restB}</strong> من{' '}
            {labelB} — الحجم <strong className="font-mono">{size}</strong> لا
            يناسب.
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Une quantité : ses paquets complets, puis son reste, visiblement à part.
 *
 * Le reste est en pointillés rouges et détaché : c'est LUI l'information
 * pédagogique — « il reste quelque chose » est la raison pour laquelle une
 * taille est rejetée.
 */
function Side({ total, size, packs, rest, label, emoji, maxDots, reduce }) {
  const dense = total > maxDots || packs > 24;

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 space-y-3 min-h-[180px]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-sm font-bold text-slate-800">
          <span aria-hidden="true">{emoji}</span> {label}
        </div>
        <div className="font-mono text-sm font-extrabold text-slate-900">{total}</div>
      </div>

      {dense ? (
        // Au-delà du plafond de densité, dessiner chaque unité devient
        // illisible : on montre la STRUCTURE (nombre de paquets + reste),
        // qui est l'information pédagogique.
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="font-mono font-bold text-blue-700">
            {packs} × {size}
          </span>
          {rest > 0 && (
            <span className="font-mono font-bold text-rose-600">+ {rest}</span>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: packs }, (_, p) => (
            <div
              key={`p-${p}`}
              className="flex gap-0.5 rounded-lg border-2 border-blue-300 bg-blue-50 p-1"
            >
              {Array.from({ length: size }, (_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
              ))}
            </div>
          ))}
          {rest > 0 && (
            <motion.div
              key={`rest-${rest}-${size}`}
              initial={reduce ? false : { scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex gap-0.5 rounded-lg border-2 border-dashed border-rose-400 bg-rose-50 p-1"
            >
              {Array.from({ length: rest }, (_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-rose-500"
                  aria-hidden="true"
                />
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* L'ÉGALITÉ — le passage du visuel au numérique (§14) : la même
          situation, écrite. `dir="ltr"` parce qu'une égalité ne se réordonne
          pas dans une page arabe. */}
      <div dir="ltr" className="text-xs font-mono text-slate-500 text-left">
        {total} = {size} × {packs}
        {rest > 0 ? ` + ${rest}` : ''}
        {rest === 0 && <span className="text-emerald-600 font-bold"> · الباقي 0</span>}
      </div>
    </div>
  );
}
