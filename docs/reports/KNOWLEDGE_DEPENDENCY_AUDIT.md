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

74 leçon(s) · critiques 3 · hautes 0 · moyennes 9 · basses 0

| Leçon | Carte | Bricks | requires | Contrat | C | H | M | L |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `4am:awwaliyan-fima-baynahuma` | ✅ | 10 | 14/14 | 0 | 0 | 0 | 0 | 0 |
| `4am:bahth-pgcd` | ✅ | 14 | 16/16 | 0 | 0 | 0 | 0 | 0 |
| `4am:ikhtizal-kasr` | ✅ | 15 | 15/15 | 0 | 0 | 0 | 0 | 0 |
| `4am:khawass-qawasim` | ✅ | 5 | 17/17 | 0 | 0 | 0 | 0 | 0 |
| `4am:qasim-adad-tabii` | ✅ | 5 | 16/16 | 0 | 0 | 0 | 0 | 0 |
| `4am:qasim-mushtarak-akbar` | ✅ | 6 | 13/13 | 0 | 0 | 0 | 1 | 0 |
| `4am:qawasim-adad-tabii` | ✅ | 4 | 15/15 | 0 | 0 | 0 | 1 | 0 |
| `4am:tayin-pgcd` | ✅ | 8 | 11/11 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-aadad` | ✅ | 2 | 11/11 | 0 | 0 | 0 | 1 | 0 |
| `4am:mutatabiqat-shahira` | ✅ | 10 | 33/33 | 0 | 0 | 0 | 0 | 0 |
| `4am:nashr-tabsit` | ✅ | 6 | 25/25 | 0 | 0 | 0 | 0 | 0 |
| `4am:tahlil-ibara` | ✅ | 10 | 29/29 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-harfi` | ✅ | 5 | 33/33 | 0 | 0 | 0 | 0 | 0 |
| `4am:amaliyat-judhur` | ✅ | 9 | 27/27 | 0 | 0 | 0 | 0 | 0 |
| `4am:jidhr-tarbii` | ✅ | 5 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:muadalat-x-murabba` | ✅ | 5 | 22/22 | 0 | 0 | 0 | 0 | 0 |
| `4am:natiqa-ghayr-natiqa` | ✅ | 4 | 15/15 | 0 | 0 | 0 | 0 | 0 |
| `4am:tawzif-khawass-judhur` | ✅ | 7 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-judhur` | ✅ | 3 | 25/25 | 0 | 0 | 0 | 6 | 0 |
| `4am:hall-jabri` | ✅ | 9 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:mafhum-jumla` | ✅ | 9 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:mushkilat-jumla` | ✅ | 7 | 17/17 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-jumal` | ✅ | 7 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:jidaa-maadum` | ✅ | 8 | 29/29 | 0 | 0 | 0 | 0 | 0 |
| `4am:muadala-ula` | ✅ | 7 | 18/18 | 0 | 0 | 0 | 0 | 0 |
| `4am:mutarajiha-ula` | ✅ | 13 | 30/30 | 0 | 0 | 0 | 0 | 0 |
| `4am:tarrid-mushkila` | ✅ | 8 | 20/20 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-muadalat` | ✅ | 7 | 28/28 | 0 | 0 | 0 | 0 | 0 |
| `4am:barahin-ashia` | ✅ | 10 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:insihab-shuaa` | ✅ | 9 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:majmu-shuaayn` | ✅ | 7 | 27/27 | 0 | 0 | 0 | 0 | 0 |
| `4am:shuaayn-mutasawiyayn` | ✅ | 9 | 25/25 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-ashia` | ✅ | 5 | 29/29 | 0 | 0 | 0 | 0 | 0 |
| `4am:hisab-murakkibatay` | ✅ | 9 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:ithbat-khawas-maalam` | ✅ | 10 | 25/25 | 0 | 0 | 0 | 0 | 0 |
| `4am:muntasaf-masafa` | ✅ | 6 | 18/18 | 0 | 0 | 0 | 0 | 0 |
| `4am:murakkibata-shuaa` | ✅ | 7 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-maalam` | ✅ | 6 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:khawas-dawaran` | ✅ | 9 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:mafhum-dawaran` | ✅ | 11 | 25/25 | 0 | 0 | 0 | 0 | 0 |
| `4am:mudalaat-muntazama` | ✅ | 12 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-dawaran` | ✅ | 5 | 27/27 | 0 | 0 | 0 | 0 | 0 |
| `4am:zawiya-muhitiya` | ✅ | 10 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:kura-julla` | ✅ | 11 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:maqati-mustawiya` | ✅ | 9 | 24/24 | 0 | 0 | 0 | 0 | 0 |
| `4am:misaha-hajm-kura` | ✅ | 9 | 20/20 | 0 | 0 | 0 | 0 | 0 |
| `4am:takbir-tasghir` | ✅ | 9 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-fada` | ✅ | 4 | 29/29 | 0 | 0 | 0 | 0 | 0 |
| `4am:alaqat-muthallathiya` | ✅ | 11 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:hasiba-muthallathiya` | ✅ | 8 | 20/20 | 0 | 0 | 0 | 0 | 0 |
| `4am:nisab-muthallathiya` | ✅ | 14 | 35/35 | 0 | 0 | 0 | 0 | 0 |
| `4am:tarrid-muthallathiya` | ✅ | 10 | 22/22 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-muthallathat` | ✅ | 5 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:aksiya-talis` | ✅ | 10 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:inshaat-talis` | ✅ | 9 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:talis-hisab-atwal` | ✅ | 9 | 28/29 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-talis` | ✅ | 6 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:mafhum-taalufiya` | ✅ | 13 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:tafsir-bayani-jumla` | ✅ | 10 | 24/24 | 0 | 0 | 0 | 0 | 0 |
| `4am:tamthil-bayani-taalufi` | ✅ | 8 | 34/34 | 0 | 0 | 0 | 0 | 0 |
| `4am:tanasub-taghayyurat` | ✅ | 11 | 28/28 | 0 | 0 | 0 | 0 | 0 |
| `4am:tarrid-taalufi` | ✅ | 10 | 25/25 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-taalufiya` | ✅ | 10 | 35/35 | 0 | 0 | 0 | 0 | 0 |
| `4am:mada-wasit-mutawassit` | ✅ | 11 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:majdulat-ihsaiya` | ✅ | 10 | 17/17 | 1 | 1 | 0 | 0 | 0 |
| `4am:qiraat-wadiyat-ihsaiya` | ✅ | 12 | 19/19 | 2 | 2 | 0 | 0 | 0 |
| `4am:takrar-mujamma` | ✅ | 11 | 26/26 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-ihsa` | ✅ | 7 | 29/29 | 0 | 0 | 0 | 0 | 0 |
| `4am:dala-khattiya` | ✅ | 9 | 25/25 | 0 | 0 | 0 | 0 | 0 |
| `4am:tamthil-bayani-khatti` | ✅ | 10 | 24/24 | 0 | 0 | 0 | 0 | 0 |
| `4am:tanasub-muamil` | ✅ | 12 | 23/23 | 0 | 0 | 0 | 0 | 0 |
| `4am:tarrid-khatti` | ✅ | 10 | 21/21 | 0 | 0 | 0 | 0 | 0 |
| `4am:tatbiqat-tanasub` | ✅ | 14 | 30/30 | 0 | 0 | 0 | 0 | 0 |
| `4am:wadiya-idmajiya-khattiya` | ✅ | 8 | 31/31 | 0 | 0 | 0 | 0 | 0 |

### `4am:qasim-mushtarak-akbar`

- **MEDIUM** `M_NAMED_IN_LOCKED_TITLE` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-mushtarak-akbar/modules/Module02Maarif.jsx:31 · terme « pgcd »  
  « PGCD » est nommé dans le titre de l'étape 2 (module 2), lisible avant que l'étape ne s'ouvre

### `4am:qawasim-adad-tabii`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qawasim-adad-tabii/modules/Module03Awazzif.jsx:0  
  module 3: could not resolve 'steps(imported data)' to a literal array — its content is invisible to the audit

### `4am:wadiya-idmajiya-aadad`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/lesson.config.js:0  
  priorKnowledge declares 'qawasim-al-pgcd' but no Module 0 question diagnoses it

### `4am:wadiya-idmajiya-judhur`

- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/lesson.config.js:0  
  priorKnowledge declares 'ghayr-natiq' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/lesson.config.js:0  
  priorKnowledge declares 'qima-muqarraba' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/lesson.config.js:0  
  priorKnowledge declares 'jidaa-jidhrayn' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/lesson.config.js:0  
  priorKnowledge declares 'qismat-jidhrayn' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/lesson.config.js:0  
  priorKnowledge declares 'tabsit-tawzii' but no Module 0 question diagnoses it
- **MEDIUM** `W_PRIOR_NOT_DIAGNOSED` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/lesson.config.js:0  
  priorKnowledge declares 'naqt-maqam' but no Module 0 question diagnoses it

### `4am:majdulat-ihsaiya`

- **CRITICAL** `E_REQUIRES_ESTABLISHED_LATER` — apps/web/src/lessons/moyen/4am/tanasubiya_duwal/ihsa/majdulat-ihsaiya/modules/Module01Majdul.jsx:151  
  question 'M01-S2-Q1' requires 'khaliya-majal', established only later by the brick at apps/web/src/lessons/moyen/4am/tanasubiya_duwal/ihsa/majdulat-ihsaiya/modules/Module01Majdul.jsx:160

### `4am:qiraat-wadiyat-ihsaiya`

- **CRITICAL** `E_REQUIRES_ESTABLISHED_LATER` — apps/web/src/lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/modules/Module01Tahaddi.jsx:89  
  question 'M01-S1-Q1' requires 'mutawassit-majmuat', established only later by the brick at apps/web/src/lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/modules/Module01Tahaddi.jsx:96
- **CRITICAL** `E_REQUIRES_ESTABLISHED_LATER` — apps/web/src/lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/modules/Module01Tahaddi.jsx:124  
  question 'M01-S3-Q3' requires 'silsila-kamila', established only later by the brick at apps/web/src/lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/modules/Module01Tahaddi.jsx:138


