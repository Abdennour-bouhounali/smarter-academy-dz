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

9 leçon(s) · critiques 0 · hautes 0 · moyennes 3 · basses 0

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

### `4am:qasim-mushtarak-akbar`

- **MEDIUM** `M_NAMED_IN_LOCKED_TITLE` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-mushtarak-akbar/modules/Module02Maarif.jsx:31 · terme « pgcd »  
  « PGCD » est nommé dans le titre de l'étape 2 (module 2), lisible avant que l'étape ne s'ouvre

### `4am:qawasim-adad-tabii`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qawasim-adad-tabii/modules/Module03Awazzif.jsx:0  
  module 3: could not resolve 'steps(imported data)' to a literal array — its content is invisible to the audit

### `4am:wadiya-idmajiya-aadad`

- **MEDIUM** `W_UNPARSEABLE_STEPS` — apps/web/src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/modules/Module02Uakkid.jsx:0  
  module 2: could not resolve 'steps' to a literal array — its content is invisible to the audit


