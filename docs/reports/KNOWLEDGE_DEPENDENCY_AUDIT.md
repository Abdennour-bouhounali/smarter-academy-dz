# Audit des dépendances de connaissances

> Généré par `npm run audit:knowledge` (lexique v1). Ne pas éditer à la main.
>
> La loi : **avant toute demande, tout ce qui est nécessaire pour la comprendre doit déjà être
> disponible pour l'élève** (docs/architecture/KNOWLEDGE_DEPENDENCY.md). Les positions
> `explain`, `explainWrong`, `correction`, `feedback` et `footer` renforcent une notion ;
> elles ne l'établissent jamais.
>
> Le lexique est un **détecteur**, pas le juge : il signale les candidats à l'audit manuel.

## Périmètre courant — classes actives (4am, terminale_dz)

9 leçon(s) · critiques 0 · hautes 0 · moyennes 29 · basses 0

| Leçon | Carte | Bricks | requires | Contrat | C | H | M | L |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `4am:awwaliyan-fima-baynahuma` | ✅ | 10 | 9/9 | 0 | 0 | 0 | 4 | 0 |
| `4am:bahth-pgcd` | ✅ | 14 | 10/10 | 0 | 0 | 0 | 5 | 0 |
| `4am:ikhtizal-kasr` | ✅ | 15 | 9/9 | 0 | 0 | 0 | 4 | 0 |
| `4am:khawass-qawasim` | ✅ | 5 | 11/11 | 0 | 0 | 0 | 2 | 0 |
| `4am:qasim-adad-tabii` | ✅ | 5 | 10/10 | 0 | 0 | 0 | 3 | 0 |
| `4am:qasim-mushtarak-akbar` | ✅ | 6 | 9/9 | 0 | 0 | 0 | 2 | 0 |
| `4am:qawasim-adad-tabii` | ✅ | 4 | 9/9 | 0 | 0 | 0 | 3 | 0 |
| `4am:tayin-pgcd` | ✅ | 8 | 7/7 | 0 | 0 | 0 | 2 | 0 |
| `4am:wadiya-idmajiya-aadad` | ✅ | 2 | 5/5 | 0 | 0 | 0 | 4 | 0 |

### `4am:awwaliyan-fima-baynahuma`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/awwaliyan-fima-baynahuma/lesson.config.js:0  
  priorKnowledge declares 'pgcd-taarif' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/awwaliyan-fima-baynahuma/lesson.config.js:0  
  priorKnowledge declares 'khwarizmiyat-iqlidus' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/awwaliyan-fima-baynahuma/lesson.config.js:0  
  priorKnowledge declares 'qawaid-qisma' but no Module 0 question diagnoses it
- **MEDIUM** `M_NAMED_IN_LOCKED_TITLE` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/awwaliyan-fima-baynahuma/modules/Module01SabaataAsharWaThamaniyataAshar.jsx:51 · terme « pgcd »  
  « PGCD » est nommé dans le titre de l'étape 1 (module 1), lisible avant que l'étape ne s'ouvre

### `4am:bahth-pgcd`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/bahth-pgcd/lesson.config.js:0  
  priorKnowledge declares 'khassiya-1' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/bahth-pgcd/lesson.config.js:0  
  priorKnowledge declares 'khassiya-2' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/bahth-pgcd/lesson.config.js:0  
  priorKnowledge declares 'pgcd-taarif' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/bahth-pgcd/lesson.config.js:0  
  priorKnowledge declares 'nataij-mubashira' but no Module 0 question diagnoses it
- **MEDIUM** `M_NAMED_IN_LOCKED_TITLE` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/bahth-pgcd/modules/Module01AlFuruq.jsx:63 · terme « pgcd »  
  « PGCD » est nommé dans le titre de l'étape 1 (module 1), lisible avant que l'étape ne s'ouvre

### `4am:ikhtizal-kasr`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/ikhtizal-kasr/modules/Module00Astaidd.jsx:0  
  module 0: could not resolve 'questions' to a literal array — its content is invisible to the audit
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/ikhtizal-kasr/lesson.config.js:0  
  priorKnowledge declares 'al-aadad-al-natiqa' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/ikhtizal-kasr/lesson.config.js:0  
  priorKnowledge declares 'awwaliyan-taarif' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/ikhtizal-kasr/lesson.config.js:0  
  priorKnowledge declares 'khwarizmiyat-iqlidus' but no Module 0 question diagnoses it

### `4am:khawass-qawasim`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/khawass-qawasim/lesson.config.js:0  
  priorKnowledge declares 'qasim-jidaa' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/khawass-qawasim/lesson.config.js:0  
  priorKnowledge declares 'qisma-iqlidiya' but no Module 0 question diagnoses it

### `4am:qasim-adad-tabii`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/modules/Module00Astaidd.jsx:0  
  module 0: could not resolve 'questions' to a literal array — its content is invisible to the audit
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/lesson.config.js:0  
  priorKnowledge declares 'qisma-iqlidiya' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/lesson.config.js:0  
  priorKnowledge declares 'qawaid-qabiliyat-al-qisma' but no Module 0 question diagnoses it

### `4am:qasim-mushtarak-akbar`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-mushtarak-akbar/lesson.config.js:0  
  priorKnowledge declares 'tariqa-qawasim' but no Module 0 question diagnoses it
- **MEDIUM** `M_NAMED_IN_LOCKED_TITLE` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-mushtarak-akbar/modules/Module02Maarif.jsx:31 · terme « pgcd »  
  « PGCD » est nommé dans le titre de l'étape 2 (module 2), lisible avant que l'étape ne s'ouvre

### `4am:qawasim-adad-tabii`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qawasim-adad-tabii/modules/Module03Awazzif.jsx:0  
  module 3: could not resolve 'steps(imported data)' to a literal array — its content is invisible to the audit
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qawasim-adad-tabii/lesson.config.js:0  
  priorKnowledge declares 'qasim-jidaa' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qawasim-adad-tabii/lesson.config.js:0  
  priorKnowledge declares 'qawaid-qabiliyat-al-qisma' but no Module 0 question diagnoses it

### `4am:tayin-pgcd`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/tayin-pgcd/lesson.config.js:0  
  priorKnowledge declares 'pgcd-taarif' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/tayin-pgcd/lesson.config.js:0  
  priorKnowledge declares 'tariqa-qawasim' but no Module 0 question diagnoses it

### `4am:wadiya-idmajiya-aadad`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/modules/Module02Uakkid.jsx:0  
  module 2: could not resolve 'steps' to a literal array — its content is invisible to the audit
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/lesson.config.js:0  
  priorKnowledge declares 'qawaid-qisma' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/lesson.config.js:0  
  priorKnowledge declares 'khassiya-1' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/lesson.config.js:0  
  priorKnowledge declares 'qawasim-mushtaraka' but no Module 0 question diagnoses it


