# MathText et MathInput

> **Statut (2026-09-21).** `MathText` est utilisé partout (360+ appels).
> **`MathInput` n'est importé par aucune page** : le seul consommateur de la
> dépendance `mathlive` est le grapheur du مختبر
> (`features/mathlab/tools/functionGrapher/ExpressionField.jsx`, chargé
> paresseusement, configuré dans `mathliveSetup.js`), qui n'utilise pas ce
> composant. `compareMathExpressions` (`@cortex-js/compute-engine`) reste
> inutilisé. Aucune leçon arabe ne saisit d'expression
> algébrique libre — les réponses sont des choix, des rationnels, des ensembles,
> des intervalles ou des points, tous exactement comparables. Ce document décrit
> donc `MathText` (vivant) puis `MathInput` (dormant), sans prescrire ce dernier.

## 1. Affichage de mathématiques — `MathText`

Le composant `<MathText>` sert **uniquement** à l'affichage (rendu KaTeX), et
c'est le **point de passage unique** de la notation mathématique.

```jsx
import MathText from 'path/to/common/components/MathText';

// En ligne :
<p>على العموم <MathText>{'$a = b \\times q + r$'}</MathText>.</p>

// En bloc centré :
<MathText>{'$$\\mathrm{PGCD}(420\\ ;\\ 28) = 28$$'}</MathText>
```

Ce qu'il fait, et pourquoi il faut passer par lui : il découpe la chaîne sur
`$…$` et `$$…$$` et enveloppe **chaque expression** dans un conteneur
`dir="ltr"` portant `.sa-math-inline` (un `<span>`) ou `.sa-math-block` (un
`<div>` — `BlockMath` rend un div, invalide dans un span). Le CSS global
(`index.css`) y ajoute `direction: ltr; unicode-bidi: isolate` : la notation se
lit de gauche à droite et sort du flux bidi arabe qui l'entoure. Sans les deux,
une expression dans une phrase arabe s'affiche à l'envers.

Il n'est **pas** responsable du gras (`**`), de l'italique (`*`) ni de la mise
en page : utilisez `<strong>`, `<em>`, `<p>`. Un enfant non-chaîne est refusé
(rend `null` et avertit en développement).

> **Les couples numériques aussi.** `{score} / {max}` s'inverse en RTL :
> 10/11 se lit « 11 / 10 ». Tout score, compteur ou rapport a besoin du même
> `dir="ltr"`. Voir `docs/architecture/ARABIC_RTL_CONTRACT.md` §4.

## 2. Saisie — `MathInput` (dormant)

`<MathInput>` enveloppe MathLive (`<math-field dir="ltr">`). Il n'a aucun
importateur aujourd'hui et n'est configuré ni pour la locale ni pour le clavier
virtuel. Ne l'introduisez pas dans une leçon sans décision explicite : le
contrat d'exercice actuel n'a pas de forme de réponse qui l'exige, et
`packages/core/practice/answerEvaluator.js` couvre tout ce qui est demandé.

Pour une saisie de nombre, de fraction ou d'ensemble, utilisez ce que le kit et
la couche manuel fournissent déjà : `NumericQuestion`, `FractionQuestion`,
`IntegerSetQuestion` — voir `docs/architecture/EXERCISE_CONTRACT.md` §0.

## 3. Comparaison

L'évaluation vivante est `practice.evaluateAnswer`
(`packages/core/practice/answerEvaluator.js`) : arithmétique rationnelle
**exacte** (pas d'epsilon), six issues plutôt qu'un booléen, chiffres
arabo-indiens acceptés à l'entrée. `compareMathExpressions`
(`packages/core/mathComparison.js`) existe mais n'est utilisé par aucune page.
