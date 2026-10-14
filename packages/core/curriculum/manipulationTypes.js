// Le REGISTRE des types de manipulation — la partie sans React.
//
// Une manipulation est une donnée de leçon (`LESSON_CONFIG.resources[]`,
// kind: 'manipulation') qui nomme son TYPE. Le composant qui le rend vit dans
// apps/web/src/lessons/common/manipulations/ ; ici ne vivent que les types,
// pour que l'outillage (scripts/validate-lessons.mjs) et l'API puissent
// vérifier un `type` sans charger React. Le registre est FERMÉ : un contenu
// nomme un type, il ne fournit jamais de code.
//
// Chaque type dit quelle idée mathématique il rend VISIBLE (§24 du brief :
// « What mathematical idea does this help the student SEE? ») et quels
// contrôles il offre en mode classe. `changeNumbers` est `false` ou un objet
// de contraintes : un enseignant ne peut jamais saisir des valeurs qui
// cassent la séquence pédagogique (voir docs/architecture/LESSON_CONTRACT.md).
//
// `autoComplete` est la DÉCISION PÉDAGOGIQUE « compléter automatiquement »
// (MANIPULATION_CONTRACT §6bis) : `false`, ou `{ unlock }`. Il n'est déclaré
// que là où le geste se RÉPÈTE à l'identique une fois compris (porter le
// 15e joueur, couper le 6e ruban) — jamais là où chaque geste est une
// expérience ou une réponse (choisir un diviseur, un nombre de colonnes).
//   unlock: 'config'        dès qu'une configuration valide est posée
//   unlock: 'first-gesture' seulement après un premier exemple fait À LA MAIN
// Le composant fournit la mécanique (`controller.autoComplete`) ; sans cette
// déclaration, le bouton n'est jamais rendu.
export const AUTO_COMPLETE_UNLOCKS = Object.freeze(['config', 'first-gesture']);

export const MANIPULATION_TYPES = Object.freeze({
  'divisor-explorer': {
    shows: 'b قاسم لـ a ⇔ باقي القسمة الإقليدية معدوم ⇔ a = b × q',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { a: [2, 9999], b: [1, 999] }, autoComplete: { unlock: 'config' } },
  },
  'divisor-explorer-books': {
    // Le RAYON QU'ON ÉTIRE (Module 1 — المكتبة, quotition) : l'élève tire le
    // serre-livres, tous les rayons prennent la longueur b, les a livres se
    // rangent en q rayons pleins et r restent au sol. Chaque position est un
    // essai : MANUEL (§6bis), rien à compléter.
    shows: 'b عدد الكتب في كل رفّ: b قاسم لـ a ⇔ لا يبقى أي كتاب على الأرض ⇔ a = b × q + 0',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'team-builder': {
    // Le partage équitable DEBOUT : n joueurs, k équipes égales, et celui qui
    // reste dehors EST le reste. Même mathématique que l'activité 1 (les 420
    // livres) ; contexte de la plateforme, déclaré dans la leçon
    // (`experience: platform_context`) — voir manipulationLevels.js.
    shows: 'قسمة عدد على عدد من المجموعات المتساوية: a = b × q + r، والباقي هو من بقي خارج الفرق',
    controls: { reset: true, nextStep: true, toggleExplanation: true, hideConclusion: true, changeNumbers: { total: [2, 60], groups: [2, 12] }, autoComplete: { unlock: 'first-gesture' } },
  },
  'factor-pairs': {
    // La clé est `n`, celle du champ du type (FactorPairs `numberFields`).
    // Elle était `a` : le laboratoire libre ne trouvait pas ses bornes et
    // acceptait 0 ou 100 000 (audit 2026-09-29).
    shows: 'قواسم عدد تأتي أزواجًا d × (a ÷ d) ولا حاجة للاختبار بعد √a',
    controls: { reset: true, nextStep: true, toggleExplanation: true, changeNumbers: { n: [2, 999] }, autoComplete: { unlock: 'config' } },
  },
  'divisor-properties': {
    // Le chantier : deux murs en briques de longueur n (thème `construction`) ;
    // accoler, enlever, mesurer — toujours des briques entières.
    shows: 'n يقسم a و b ⇒ n يقسم a + b و a − b وباقي قسمة a على b',
    controls: { reset: true, nextStep: true, toggleExplanation: true, changeNumbers: { n: [2, 99], a: [2, 999], b: [1, 999], requireCommonDivisor: true } },
  },
  'common-divisors': {
    // Deux temps : des objets DESSINÉS répartis en groupes identiques (le
    // thème choisit fleurs, ballons et maillots, ou fournitures), puis les
    // listes de diviseurs et la case PGCD.
    shows: 'قواسم → قواسم مشتركة → القاسم المشترك الأكبر (تقاطع مجموعتين وأكبر عنصر فيه)',
    controls: { reset: true, nextStep: true, toggleExplanation: true, changeNumbers: { a: [2, 300], b: [2, 300] }, autoComplete: { unlock: 'config' } },
  },
  'pgcd-differences': {
    // L'atelier de couture (thème `workshop`) : le petit ruban coupé dans le
    // grand, encore et encore.
    shows: 'PGCD(a ; b) = PGCD(b ; a − b) والقاسم المشترك الأكبر هو آخر فرق غير معدوم',
    controls: { reset: true, nextStep: true, prevStep: true, toggleExplanation: true, hideConclusion: true, changeNumbers: { a: [2, 9999], b: [1, 9999], maxSteps: 30 }, autoComplete: { unlock: 'first-gesture' } },
  },
  'euclidean-algorithm': {
    // Le même atelier : le petit ruban REPORTÉ le long du grand ; le bout qui
    // dépasse est le reste.
    shows: 'PGCD(a ; b) = PGCD(b ; r) والقاسم المشترك الأكبر هو آخر باقٍ غير معدوم',
    controls: { reset: true, nextStep: true, prevStep: true, toggleExplanation: true, hideConclusion: true, changeNumbers: { a: [2, 99999], b: [1, 99999], maxSteps: 12 }, autoComplete: { unlock: 'first-gesture' } },
  },
  'coprime-explorer': {
    // Au niveau débutant, des trousses identiques (thème `school`) : rien ne
    // marche sauf 1 ; puis les listes.
    shows: 'عددان أوليان فيما بينهما ⇔ قاسمهما المشترك الوحيد هو 1',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { a: [2, 300], b: [2, 300] }, autoComplete: { unlock: 'config' } },
  },
  'fraction-reduction': {
    // La recette (thème `kitchen`) : diviser les deux termes par k, c'est
    // répartir deux ingrédients en k parts identiques et lire UNE part.
    shows: 'اختزال كسر = القسمة على قاسم مشترك؛ القسمة على PGCD تعطي الشكل غير القابل للاختزال في خطوة واحدة',
    // Bornes du مختبر حر : jusqu'à 600 (595/560 du manuel y tient). À 9999,
    // 9240/7560 dessinait 16 800 objets et un dépôt prenait 4 s (audit 2026-09-29).
    controls: { reset: true, nextStep: true, toggleExplanation: true, changeNumbers: { n: [1, 600], d: [2, 600] } },
  },

  // ── Unité 2 « الحساب على الجذور » (2026-09-30) ──────────────────────────
  'square-root-side': {
    // L'élève ÉTIRE le côté d'un carré sur une règle graduée : le carré se
    // dessine, son aire se lit exactement, et se compare à l'aire visée.
    // Mode `refine` (leçon 1) : on resserre l'encadrement (1 → 0,1 → 0,01 →
    // 0,001) — pour 36 le côté tombe juste, pour 5 JAMAIS : √5 existe (c'est
    // BC) mais aucun décimal n'en est l'écriture. Mode `graduation` (leçon 2) :
    // l'élève choisit la graduation 1/g — le côté tombe sur une graduation
    // exactement quand l'aire est le carré d'un rationnel. Chaque position
    // est un essai : MANUEL (§6bis).
    shows: '√a هو العدد الموجب الذي مربّعه a: ضلع المربّع الذي مساحته a — ناطق إذا وقع على تدريجة، وغير ناطق إذا لم يقع على أي تدريجة',
    controls: { autoComplete: { unlock: 'config' }, reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { num: [1, 400], den: [1, 100] } },
  },
  'square-fold': {
    // L'élève DÉPLACE x sur la droite graduée ; une flèche porte x vers x²
    // sur la droite des carrés, dont la moitié négative est hachurée : aucun
    // carré n'y arrive (résistance). x et −x arrivent au même point.
    // Épingler un x comme solution est une RÉPONSE : MANUEL (§6bis).
    shows: 'المعادلة x² = a: حلّان متعاكسان √a و −√a إذا كان a > 0، حل واحد 0 إذا كان a = 0، ولا حل إذا كان a < 0',
    controls: { autoComplete: { unlock: 'config' }, reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'square-tiling': {
    // L'élève ÉTIRE k, le nombre de dalles par côté d'un carré d'aire n :
    // n = k² × b et le côté vaut k√b. Une dalle d'aire non entière est
    // refusée (k² ne divise pas n). Le plus grand k donne b le plus petit.
    // Chaque k est un essai : MANUEL (§6bis).
    shows: '√(k² × b) = √(k²) × √b = k√b: مربّع مساحته n مبلّط بـ k × k بلاطة مساحة كل منها b — وأكبر k يعطي أصغر b',
    controls: { autoComplete: { unlock: 'config' }, reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { n: [2, 999] } },
  },

  // ── Unité 3 « الحساب الحرفي » (2026-10-01) ──────────────────────────────
  'pitch-expansion': {
    // Un terrain de football dont les côtés sont les deux facteurs : l'élève
    // ÉTIRE x, PORTE chaque zone (un produit partiel) dans la somme, RÉUNIT
    // les termes semblables et vérifie l'égalité pour plusieurs x. Chaque
    // zone portée et chaque fusion est une décision : MANUEL (§6bis).
    shows: 'النشر: مساحة الملعب (الجداء) تساوي مجموع مساحات مناطقه — k(a + b) = ka + kb و (a + b)(c + d) = ac + ad + bc + bd والمتطابقات الشهيرة — من أجل كل قيمة لـ x',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'turf-factoring': {
    // Le geste inverse : des plaques de gazon (x², x, 1) à assembler en UN
    // terrain rectangulaire, dont les côtés sont les facteurs. rows : l'élève
    // étire le nombre de rangées identiques (ka + kb = k(a + b)) ; square :
    // il porte les bandes à droite ou en bas du carré x², le coin décide
    // (a² + 2ab + b² = (a + b)²). Chaque essai est une réponse : MANUEL.
    shows: 'التحليل: كتابة مجموع على شكل جداء هي تكوين مستطيل واحد من قطعه — ka + kb = k(a + b) و a² + 2ab + b² = (a + b)²',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },

  // ── Unité 4 « معادلات ومتراجحات من الدرجة الأولى بمجهول واحد » (2026-10-01) ──
  // Calcul exact commun : packages/core/arithmetic/linear.js.
  'equation-balance': {
    // Une BALANCE à deux plateaux : des sacs fermés de x ballons, des ballons seuls,
    // des baudruches (le négatif, qui tire vers le haut). Ôter ou ajouter d'un SEUL
    // côté fait pencher le fléau (la règle résiste) ; le même geste sur l'autre
    // plateau le rétablit. Partager chaque plateau en k groupes égaux isole un sac.
    // Chaque geste est une décision : MANUEL (§6bis).
    shows: 'المعادلة ميزان متوازن: ما نفعله بأحد الطرفين نفعله بالآخر — حتى الشكل ax = b ثم x = b/a',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'vanishing-pitch': {
    // Le terrain dont les côtés sont les deux FACTEURS (côtés signés) : l'élève étire
    // x, le terrain se déforme, et s'ÉCRASE en une ligne (aire nulle) exactement quand
    // un côté devient nul. Il épingle chaque x où le terrain disparaît ; un x où l'aire
    // ne l'est pas est refusé avec l'aire lue. Chaque épingle est une réponse : MANUEL.
    shows: 'خاصية الجداء المعدوم: مساحة الملعب A × B تنعدم إذا وفقط إذا انعدم أحد ضلعيه — A = 0 أو B = 0',
    controls: { autoComplete: { unlock: 'config' }, reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'solution-ray': {
    // Un mobile sur une droite graduée : chaque position validée laisse une trace —
    // rouge si l'inégalité est vraie (convention du manuel), grise sinon. L'élève pose
    // ensuite le CROCHET de la borne, et (متقدم) transforme l'inéquation : une étape
    // licite garde exactement ses traces, une division par un négatif sans inverser le
    // sens les contredit. Chaque essai est une réponse : MANUEL.
    shows: 'حلول المتراجحة نصف مستقيم: نحافظ على الاتجاه بإضافة عدد أو الضرب في موجب، ونغيّره بالضرب أو القسمة على سالب',
    controls: { autoComplete: { unlock: 'config' }, reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'growth-race': {
    // Deux grandeurs du premier degré qui « grandissent » avec x (âges, coûts) : l'élève
    // CONSTRUIT d'abord chaque expression en portant les jetons x là où l'histoire les
    // met (chaque enfant vieillit), puis étire x : les deux colonnes se rejoignent à
    // la solution de l'équation et se dépassent au-delà (l'inéquation). Chaque jeton
    // et chaque x validé est une décision : MANUEL.
    shows: 'ترييض مشكلة: نسمّي المجهول، نترجم النص إلى عبارتين، فتكون المعادلة لحظة تساويهما والمتراجحة لحظة تفوّق إحداهما',
    controls: { autoComplete: { unlock: 'config' }, reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },

  // ── Unité 5 « جمل معادلتين من الدرجة الأولى بمجهولين » (2026-10-01) ──
  // Calcul exact commun : packages/core/arithmetic/linearSystem.js (sur les fractions de linear.js).
  'pair-scoreboard': {
    // Le TABLEAU DES DEUX CONDITIONS : l'élève fixe lui-même les DEUX nombres x et y (des
    // victoires et des nuls d'une saison, des hommes et des femmes d'un service…) ; deux jauges
    // lisent chacune son équation sur SA ثنائية. Une ثنائية qui allume une seule jauge est
    // refusée comme حل de la jumla : il faut les deux « في آن واحد ». Chaque essai est une
    // réponse : MANUEL (§6bis).
    shows: 'حل جملة معادلتين ثنائية (x ; y) تحقق المعادلتين في آن واحد: ثنائية تحقق معادلة واحدة ليست حلا للجملة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'elimination-cards': {
    // Deux CARTES-ÉQUATIONS en tuiles x, y et unités : l'élève fait disparaître une inconnue —
    // en portant l'expression isolée (y = 7 − 2x) sur chaque tuile y de l'autre carte
    // (التعويض), ou en multipliant une carte (× k, étirement) puis en posant une carte sur
    // l'autre : les tuiles opposées s'annulent par paires (الجمع). Une carte posée sans que
    // rien ne s'annule est refusée en le montrant. Chaque geste est une décision : MANUEL.
    shows: 'حل جملة جبريا: نتخلص من أحد المجهولين بالتعويض أو بالجمع بعد الضرب في معامل مناسب، فنحصل على معادلة بمجهول واحد',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'story-modeller': {
    // L'HISTOIRE QU'ON TRADUIT : l'élève nomme les deux inconnues sur les mots de l'histoire,
    // puis porte les données de l'énoncé dans les cases de deux équations ; « تحقّق » rejoue
    // l'histoire avec SA jumla et refuse un modèle qui la contredit, dans les mots de
    // l'histoire (un prix compté comme un nombre de personnes). Puis la jumla résolue est
    // rejouée (التحقق) et la réponse écrite. Chaque case remplie est une réponse : MANUEL.
    shows: 'ترييض مشكلة بجملة معادلتين: نختار المجهولين، نترجم كل معلومة من النص إلى معادلة، نحل الجملة ثم نتحقق من النتيجة في الوضعية',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },

  // ── Unité 6 « الدالة الخطية والتناسبية » (2026-10-02) ──
  // Calcul exact commun : packages/core/arithmetic/proportional.js (sur les fractions de linear.js).
  'ratio-ride': {
    // LE COMPTEUR QU'ON FAIT TOURNER : l'élève fixe la durée d'un trajet (trottinette louée sur la
    // promenade) et ENREGISTRE ses propres colonnes (x ; y) ; la ligne des quotients y ÷ x se lit sous
    // son tableau. « جدول تناسبية » est refusé tant que deux quotients diffèrent (le forfait de
    // déverrouillage le casse) ; le رابع متناسب se calcule par × a. Chaque colonne est une décision : MANUEL.
    shows: 'جدول تناسبية: حاصل قسمة y على x ثابت يساوي معامل التناسبية a ، أي y = a × x — وجدول فيه مبلغ ثابت ليس جدول تناسبية',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'linear-machine': {
    // LA MACHINE À RÈGLE CACHÉE : l'élève y fait entrer ses propres nombres (cartes), lit les sorties,
    // puis règle le cadran a de SA machine-témoin ; une affirmation « f(x) = ax » est refusée avec un
    // témoin (f(0) ≠ 0, ou f(2x) ≠ 2f(x)). Un seul couple (m ; f(m)), m ≠ 0, suffit à fixer a ;
    // le nombre 0 ne fixe rien. Chaque carte est un choix : MANUEL.
    shows: 'الدالة الخطية x ⟼ ax : صورة x هي ax ، ويكفي عدد غير معدوم m وصورته n لتعيين a = n ÷ m ؛ x² و 2x − 1 ليستا دالتين خطيتين',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'origin-line': {
    // LA DROITE ÉPINGLÉE À O : l'origine ne bouge pas (on essaie, elle résiste) ; l'élève tire la
    // poignée A(1 ; a) — la droite pivote, monte si a > 0, descend si a < 0 ; une sonde verticale
    // (ou horizontale) lit une image (ou un antécédent). Un point posé hors de la droite est refusé
    // avec son écart. Mondes : téléphérique, ressort (nuage de points du tableau), budget (plafond).
    shows: 'التمثيل البياني للدالة الخطية x ⟼ ax مستقيم يشمل المبدأ O ومعامل توجيهه a : يكفي تعيين نقطة ثانية، ونقرأ عليه صورة عدد والعدد الذي علمت صورته',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'percent-tag': {
    // L'ÉTIQUETTE QU'ON ÉTIRE : le prix est une barre ; l'élève choisit زيادة / تخفيض et tire t % —
    // la barre est multipliée par 1 ± t/100 (jamais « + t »). En متقدم, deux changements successifs :
    // le pari « −30 % puis +15 % = −15 % » est refusé par la barre elle-même (on multiplie les
    // multiplicateurs). Chaque réglage est une réponse : MANUEL.
    shows: 'النسب المئوية تناسبية: زيادة x بـ t% تعني ضربه في 1 + t/100 وتخفيضه يعني ضربه في 1 − t/100 ، والتغيرات المتتابعة تُضرب ولا تُجمع',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  // ── Unité 7 « الدالة التآلفية » (2026-10-02) — calcul exact : packages/core/arithmetic/affine.js.
  'affine-meter': {
    // LE COMPTEUR À PARTIE FIXE : un bloc b posé d'avance (la paie de base, la prise en charge) et x blocs
    // de a. L'élève règle x (image) ou cherche x pour un total m (antécédent : ax + b = m) ; en متقدم il
    // tient aussi les boutons a et b — b = 0 rend la fonction خطية, a = 0 la rend ثابتة.
    shows: 'الدالة التآلفية جزء ثابت b وجزء متغير ax : صورة x هي ax + b ، والعدد الذي صورته m حلّ المعادلة ax + b = m ؛ b = 0 دالة خطية و a = 0 دالة ثابتة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'affine-line': {
    // LA DROITE QUI NE PASSE PLUS PAR O : la droite de x ⟼ ax (fantôme) et sa copie montée de b. L'élève
    // tire le point (0 ; b) sur l'axe des ordonnées (translation) et la marche « 1 à droite, a en haut »
    // (pente) ; il lit a et b sur une droite donnée, ou une image / un antécédent avec une sonde.
    shows: 'التمثيل البياني للدالة التآلفية x ⟼ ax + b مستقيم يقطع محور التراتيب في (0 ; b) ويوازي مستقيم الدالة الخطية x ⟼ ax : b الترتيب عند المبدأ و a معامل التوجيه',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'slope-stairs': {
    // L'ESCALIER DES ACCROISSEMENTS : deux marqueurs x1, x2 sur la droite ; la marche Δx, Δf se dessine ;
    // l'élève déplace les marqueurs où il veut — le quotient Δf ÷ Δx ne bouge pas (INVARIANT = a), puis il
    // descend jusqu'à x = 0 pour lire b. Deux nombres et leurs images suffisent à retrouver f.
    shows: 'تناسب التغيّرات: مهما كان العددان x1 و x2 فإنّ (f(x1) − f(x2)) ÷ (x1 − x2) يساوي a ، ومن عددين وصورتيهما نعيّن a ثم b',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'line-crossing': {
    // DEUX DROITES, UN POINT : chaque équation de la جملة est écrite y = ax + b et tracée ; l'élève promène
    // un point — chaque équation s'allume quand il est sur sa droite ; les deux ensemble : la ثنائية
    // solution. En متقدم il règle la seconde droite jusqu'aux cas parallèles / confondues.
    shows: 'حل جملة معادلتين بيانيا: كل معادلة مستقيم y = ax + b ، والثنائية حلّ الجملة إحداثيتا نقطة تقاطعهما ؛ متوازيان: لا حل ، منطبقان: عدد لا نهائي من الحلول',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'plan-compare': {
    // DEUX TARIFS FACE À FACE : chaque formule est une fonction affine (partie fixe + partie variable) ;
    // l'élève fait varier x (séances, heures, jours) — les deux coûts et leurs droites bougent ensemble —
    // trouve x où ils sont égaux et décide quelle formule choisir de chaque côté. Réutilisé par la synthèse.
    shows: 'المفاضلة بين صيغتين: كل تسعيرة دالة تآلفية (جزء ثابت وجزء متغير) ، يتقاطع المستقيمان حيث تتساوى التكلفتان ، وتتغير الصيغة الأفضل قبل نقطة التقاطع وبعدها',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  // ── Unité 8 « الإحصاء » (2026-10-02) — docs/sources/4am/unit8/extraction.json ─────────────────────────
  'cumul-gate': {
    // LA BARRE DE TAILLE : la série rangée (des élèves, des notes) ; l'élève fait glisser un seuil t — ceux
    // qui ont « t على الأكثر » s'allument d'un côté (التكرار المجمع الصاعد), ceux qui ont « t على الأقل » de
    // l'autre (النازل) ; la valeur t elle-même est comptée des DEUX côtés. Les colonnes du tableau se
    // remplissent par ses propres seuils, puis en fractions de N (التواتر المجمع).
    shows: 'التكرار المجمع الصاعد لقيمة t عدد القيم الأصغر من أو تساوي t ، والنازل عدد القيم الأكبر من أو تساوي t ؛ مقسومين على التكرار الكلي يصبحان تواترين مجمعين',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'stat-balance': {
    // LA BALANCE DES VALEURS : chaque valeur est un jeton posé à sa place sur une poutre graduée ; l'élève
    // déplace l'appui jusqu'à l'équilibre (le المتوسط), le rideau jusqu'à couper la série en deux effectifs
    // égaux (le الوسيط), la pince entre les extrêmes (المدى) ; il tire une valeur extrême et voit la moyenne
    // partir, la médiane rester. Réutilisé par la synthèse (valeurs cachées retrouvées par la main).
    shows: 'المتوسط نقطة توازن القيم (مجموع القيم مقسوم على عددها) ، الوسيط يقسم السلسلة المرتبة إلى قسمين لهما نفس التكرار ، والمدى الفرق بين أكبر قيمة وأصغر قيمة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'sheet-lab': {
    // LA MAQUETTE DU MAJDOUL : une feuille dessinée — l'élève saisit les valeurs, sélectionne une plage à la
    // main (A1:G1), compose le دستور (MAX − MIN, MEDIANE, MOYENNE, MODE) ; une plage fausse donne un nombre
    // qui contredit son calcul, une cellule modifiée recalcule tout ; puis il choisit le graphique qui
    // convient aux données (أعمدة / دائري / مدرّج).
    shows: 'المجدول يحسب مؤشرات سلسلة محجوزة في خلايا بدساتير: المدى ⁦=MAX()-MIN()⁩ ، الوسيط ⁦=MEDIANE()⁩ ، المتوسط ⁦=MOYENNE()⁩ ، المنوال ⁦=MODE()⁩ ، ويرسم التمثيل البياني المناسب',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // Unité 9 « خاصية طالس » (2026-10-02) — la géométrie : une longueur, une position, un rapport se TIENNENT à la main.
  'thales-beam': {
    // LE FAISCEAU : deux rayons issus de A (l'objectif d'un projecteur, le trou d'une chambre noire) ; l'élève fait
    // glisser l'écran (B′C′) le long des rayons — parallèle à (BC) — et les trois rapports AB′/AB, AC′/AC, B′C′/BC
    // restent ÉGAUX (k) ; incliner l'écran les sépare. Passer l'écran de l'autre côté de A retourne l'image (وضعية الفراشة).
    // Réutilisé par la synthèse (theme « ombre » : la minaret et le bâton).
    shows: 'إذا قطع مستقيمان متوازيان مستقيمين متقاطعين في A فإن أطوال المثلثين متناسبة: AB′/AB = AC′/AC = B′C′/BC = k ، والمثلث الصغير تصغير للكبير بمعامل k',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'parallel-level': {
    // LE NIVEAU À BULLE : deux points posés par l'élève sur deux droites sécantes graduées (les montants d'une échelle
    // double, puis les droites de نشاط 2) ; la barre (B′C′) n'est « de niveau » — parallèle à (BC) — que si
    // AB′/AB = AC′/AC ET si les points sont dans le même ordre ; des rapports égaux de part et d'autre de A la refusent.
    shows: 'إذا كان AB′/AB = AC′/AC وكانت النقط A، B، B′ و A، C، C′ مرتبة بنفس الترتيب فإن (B′C′) يوازي (BC) ؛ نسبتان مختلفتان تثبتان عدم التوازي',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'segment-divider': {
    // L'ÉVENTAIL DES PARALLÈLES : l'élève trace une demi-droite depuis A, y reporte au compas n ouvertures égales,
    // relie la dernière marque à B puis fait glisser l'équerre le long de la règle : les parallèles découpent [AB] en
    // parts égales (ou dans le rapport p/q). Une ouverture changée en route ou une « parallèle » inclinée donne des
    // parts inégales que la règle mesure.
    shows: 'لتقسيم [AB] إلى n قطع متقايسة (أو بنسبة p/q) نعيّن على نصف مستقيم مبدؤه A قطعا متقايسة بالمدور ونرسم موازيات للمستقيم الواصل بين آخر علامة و B',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'shadow-stick': {
    // LE BÂTON ET L'OMBRE (تحدّ) : la minaret et son ombre ; l'élève fait glisser un bâton de 1 m sur le sol jusqu'à ce
    // que l'extrémité de SON ombre tombe sur celle de la minaret — alors un seul rayon de soleil passe par les deux
    // sommets, les deux verticales sont parallèles et h / 1 = (ombre de la minaret) / (ombre du bâton).
    shows: 'العصا والمئذنة شاقوليتان فهما متوازيتان ؛ إذا انطبقت نهاية ظل العصا على نهاية ظل المئذنة فإن المثلثين في وضعية طالس: h ÷ (طول العصا) = (ظل المئذنة) ÷ (ظل العصا)',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'shadow-world': {
    // SAHAT AL-HAYY (2026-10-13) : un MONDE — l'élève tient le soleil (le vrai soleil d'Alger le 13 octobre, 12:30 → 16:00),
    // mesure les ombres au ruban, parie sur l'ombre d'un objet que la commune va installer (le pari révèle son modèle :
    // additif, copie, inversé…), ÉCRIT sa propre loi (ombre = hauteur + n ou × n) que le monde teste sur tous les objets,
    // la voit se décoller quand le soleil bouge, la répare ; le compagnon مقران ne fait que questionner. Puis la hauteur
    // de la minaret, inaccessible (le ruban refuse de grimper), et la méthode du manuel (les ombres qui finissent ensemble).
    shows: 'في لحظة معيّنة أشعّة الشمس متوازية: الظلّ ÷ الطول هو العدد نفسه لكل الأشياء الشاقولية (وضعية طالس)، ويتغيّر هذا العدد مع الساعة ؛ ومنه طول المئذنة من ظلّها',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'cone-cylinder': {
    // LA COUPE AXIALE : un cône (hauteur H, rayon R) et le cylindre posé sur sa base ; l'élève tire le coin du
    // rectangle le long de la génératrice — le coin ne quitte pas le cône (sinon le cylindre le perce) — et lit r, h,
    // h = H − (H/R)·r (Thalès au sommet O) et le volume πr²h ; il cherche le cylindre où h = r.
    shows: 'في المقطع المحوري للمخروط: r/R = (H − h)/H حسب خاصية طالس ، فيُعيَّن بعد الأسطوانة المحاطة بحل معادلة ثم حجمها πr²h',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'group-tanks': {
    // LES RÉSERVOIRS DE GROUPES : chaque groupe est un réservoir de largeur n (son effectif) rempli au niveau
    // de sa moyenne ; l'élève PARIE le niveau du groupe réuni puis ouvre la vanne — le niveau commun est la
    // moyenne pondérée (Σ n·m ÷ N), jamais la moyenne des moyennes. En متقدم, deux classes face à face.
    shows: 'متوسط مجموعتين مجتمعتين هو المتوسط المتوازن: مجموع (التكرار × المتوسط) مقسوم على التكرار الكلي ، وليس متوسط المتوسطين',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  // Unité 10 « حساب المثلثات في المثلث القائم » (2026-10-04) — l'angle aigu se TIENT, les rapports se LISENT.
  'ramp-ratios': {
    // LA RAMPE DU SKATEPARK : un triangle rectangle (la planche = l'hypoténuse, la hauteur, le sol) ; l'élève tourne
    // l'angle et allonge la rampe. Il désigne lui-même, pour l'angle CHOISI, le côté opposé, adjacent et l'hypoténuse
    // (désigner l'hypoténuse comme opposé est refusé), puis compose cos / sin / tan ; agrandir la rampe à angle fixe ne
    // change aucun rapport (نشاط 2), tourner l'angle les change ; la hauteur ne dépasse jamais la planche (0 < sin, cos < 1).
    shows: 'في مثلث قائم: جيب التمام = المجاور ÷ الوتر ، الجيب = المقابل ÷ الوتر ، الظل = المقابل ÷ المجاور ؛ هذه النسب لا تتعلق إلا بقيس الزاوية ، والجيب وجيب التمام محصوران بين 0 و 1',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'trig-calculator': {
    // LA CALCULATRICE DU DRONE : la nacelle d'une caméra de drone s'incline d'un angle ; l'élève tape lui-même les
    // touches (sin / cos / tan, puis 2nd + sin⁻¹ …) sur une calculatrice dessinée réglée en DEG — un réglage RAD ou
    // l'oubli de 2nd donne un nombre absurde que la nacelle CONTREDIT — et arrondit l'écran à la précision demandée.
    shows: 'الحاسبة المبرمجة بالدرجة تعطي قيمة مقربة لنسبة زاوية معلومة (sin ، cos ، tan) ، واللمسات العكسية (2nd ثم sin⁻¹ ، cos⁻¹ ، tan⁻¹) تعطي قيس الزاوية من نسبتها ، ثم ندوّر حسب الدقة المطلوبة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'angle-compass': {
    // LA FICELLE DU CERF-VOLANT : construire, sans rapporteur, l'angle dont on connaît un rapport — l'élève pose
    // l'équerre (angle droit), reporte une longueur sur un côté, ouvre le compas (le fil = l'hypoténuse) et coupe
    // l'autre côté ; le troisième côté se lit par Pythagore, et cos² + sin² = 1 se voit sur les carrés des côtés.
    shows: 'لإنشاء زاوية علمت إحدى نسبها نرسم مثلثا قائما أطوال أضلاعه تحقق النسبة ؛ وفي كل مثلث قائم: مربع جيب التمام + مربع الجيب = 1 ، والظل = الجيب ÷ جيب التمام',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'clinometer': {
    // LE CLINOMÈTRE DU TÉLÉPHONE : l'élève vise le sommet d'un objet inaccessible (projecteur du stade, échelle des
    // graffeurs, مقام الشهيد) avec un téléphone, recule ou avance (la distance est tenue), lit l'angle d'élévation,
    // CHOISIT le rapport qui lie le connu et l'inconnu (un mauvais choix est refusé et dit pourquoi) et calcule ;
    // la hauteur trouvée reste la même à toute distance (l'invariant). Réutilisé par la synthèse (mode « align »).
    shows: 'نترجم الوضعية إلى مثلث قائم ، ونختار النسبة التي تربط الطول المعلوم بالطول المجهول (أو بالزاوية) ثم نحسب ونقرّب النتيجة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  // Unités 11 « الأشعة والانسحاب » et 12 « الأشعة في معلم » (2026-10-04) — la flèche se TIENT, ses مركبتان se LISENT.
  'translation-glide': {
    // LE SPECTACLE DE DRONES : une formation de drones au-dessus de la baie d'Alger glisse d'un bloc ; l'élève fixe la flèche AA′ d'un drone puis place
    // l'image de chaque autre drone — une image dont la flèche diffère par le منحى, le اتجاه ou le طول est refusée et le lab dit lequel ; ABB′A′ se révèle متوازي أضلاع.
    shows: 'الانسحاب ينقل كل نقاط الشكل بنفس الحركة: شعاع واحد له منحى واتجاه وطول ، وكل نقطة وصورتها تعطيان شعاعا مساويا له ، فيتكوّن متوازي أضلاع',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'parallelogram-pin': {
    // LA BANDEROLE DU TIFO : quatre supporters tiennent une banderole ; l'élève déplace le quatrième coin D (ou le point I sur [AB]) ; la banderole
    // ne se tend en متوازي أضلاع que si AB = DC — les milieux des deux diagonales se confondent alors ; AI = IB n'arrive qu'au milieu.
    shows: 'تساوي شعاعين يترجم متوازي الأضلاع: AB = DC يعني أن ABCD متوازي أضلاع (قطراه متناصفان) ، و I منتصف [AB] يعني AI = IB',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'vector-sum': {
    // DEUX MOUVEMENTS, UN SEUL : l'élève enchaîne deux flèches bout à bout (علاقة شال, la trottinette qui fait deux trajets) ou les pose sur la même
    // origine (قاعدة متوازي الأضلاع, le nageur et le courant de l'oued) ; la somme se lit, un enchaînement mal raccordé est refusé ; AB + BA = 0.
    shows: 'مجموع شعاعين هو شعاع الانسحاب الناتج عن انسحابين متتابعين: AB + BC = AC (علاقة شال) ، و AB + AD = AC إذا كان ABCD متوازي أضلاع ، و AB + BA = 0',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'vector-chain': {
    // LES CORRESPONDANCES DU MÉTRO : l'élève assemble une somme de plusieurs vecteurs nommés (des tronçons du métro d'Alger) et la réduit en
    // raccordant les tronçons (Chasles), en remplaçant un vecteur par un égal (متوازي أضلاع) ou en annulant deux opposés ; la figure suit chaque étape.
    shows: 'نبسّط عبارة شعاعية بعلاقة شال وبتعويض شعاع بشعاع يساويه وبحذف شعاعين متعاكسين ، ثم نستنتج منها استقامية نقط أو طبيعة رباعي',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'bridge-path': {
    // LE PLUS COURT PASSAGE (وضعية « ممر الراجلين » ; passerelle du Rhummel à مبتدئ) : le passage [MN], perpendiculaire aux deux bords, se
    // déplace le long de la route (la position est tenue) ; la longueur A → M → N → B se lit ; B′, image de B par le انسحاب de vecteur NM,
    // est posée par l'élève (jugée par `vectors.relation`) : MB′BN متوازي أضلاع, NB = MB′, et le trajet le plus court a M sur [AB′].
    shows: 'لإيجاد أقصر مسلك يعبر ممرا عرضه ثابت ننقل نقطة الوصول B بالانسحاب الذي شعاعه NM ، فيصبح المسلك من A إلى B′ مرورا بالنقطة M خطا مستقيما',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'component-steps': {
    // L'APPLI DE LIVRAISON : le livreur va de A à B sur le quadrillage d'un quartier en pas horizontaux puis verticaux ; les pas comptés (avec leur
    // signe) SONT les deux composantes ; depuis l'origine O, les composantes de OM sont les coordonnées de M ; dessiner un vecteur de composantes données.
    shows: 'مركبتا شعاع في معلم متعامد ومتجانس هما الإزاحة الأفقية والإزاحة العمودية (بإشارتيهما) من مبدئه إلى نهايته ، ومركبتا OM هما إحداثيتا M',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'component-calc': {
    // LE PORTAIL DU JEU : deux portails A et B d'une carte de jeu mobile ; l'élève calcule x_B − x_A et y_B − y_A (le signe compte) et le portail
    // ne s'ouvre que sur les bonnes composantes ; puis il place D pour que AB = DC (deux coordonnées inconnues).
    shows: 'مركبتا AB هما (xB − xA ; yB − yA) ، ويتساوى شعاعان إذا تساوت مركباتهما ، ومنه نحسب إحداثيتي نقطة مجهولة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'midpoint-distance': {
    // LE RENDEZ-VOUS GPS : deux amis partagent leur position ; l'élève place le point de rencontre à mi-chemin (moyenne des abscisses et des
    // ordonnées) puis mesure la distance en dessinant l'escalier Δx, Δy (le triangle rectangle) — Pythagore donne AB.
    shows: 'منتصف [AB] إحداثيتاه متوسطا إحداثيتي الطرفين ، والمسافة AB هي وتر مثلث قائم ضلعاه |xB − xA| و |yB − yA|',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'shape-prover': {
    // LE TERRAIN DE FOOT : des plots posés sur le terrain quadrillé forment un triangle ou un quadrilatère ; l'élève déplace les plots et choisit
    // les preuves (carrés des distances, composantes égales, milieux des diagonales) qui établissent la nature — une conclusion sans preuve suffisante est refusée.
    shows: 'نثبت طبيعة مثلث بحساب المسافات (وعكس فيثاغورس) وطبيعة رباعي بتساوي مركبات شعاعين وتناصف القطرين وتقايسها أو تقايس ضلعين متتاليين ، وانتماء نقطة لدائرة بمقارنة بعدها عن المركز بنصف القطر',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'route-compare': {
    // DEUX PARCOURS (wadiya-idmajiya-maalam, وضعية « عدّاءان » p. 148 ; rallye au Sahara à مبتدئ) : l'élève parie, puis construit
    // chaque parcours morceau par morceau — la balise suivante d'une ligne brisée (composantes et √(Δx² + Δy²) sous la main),
    // le CENTRE d'un demi-cercle (l'arc ne se referme sur le parcours qu'au milieu du diamètre) — ; deux montres additionnent
    // exactement (3π ; √13 + √5 + √17) puis en valeur approchée, et le pari est confronté au calcul. Manuel : chaque pose est un essai.
    shows: 'نقارن مسارين في معلم: نبني كل مسار قطعة بقطعة — طول قطعة مستقيمة هو المسافة بين طرفيها، ونصف الدائرة مركزه منتصف قطرها وطوله πr — ثم نجمع الأطوال ونقارن',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // Unité 13 « الدوران - الزوايا - المضلّعات المنتظمة » (2026-10-04) — calcul exact : packages/core/arithmetic/rotation.js.
  'rotation-dial': {
    // LA GRANDE ROUE : l'élève fait tourner une nacelle M autour du moyeu O ; l'image M′ n'est acceptée que si OM′ = OM, \widehat{MOM′} = α ET le
    // sens est le bon (`rotation.imageCheck` dit lequel manque) ; puis les images d'un segment, d'une droite, d'un cercle.
    shows: 'صورة النقطة M بالدوران الذي مركزه O وزاويته α هي النقطة M′ بحيث OM′ = OM و الزاوية MOM′ = α في الاتجاه المعطى ، ومنها صور القطعة والمستقيم والدائرة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'shape-turn': {
    // LE ZELLIGE : l'élève fait tourner un motif (triangle, quadrilatère) autour d'un centre ; les jauges montrent ce qui RESTE (longueurs, angles,
    // alignement, aire) et ce qui change (position, direction) ; une « fausse rotation » qui déforme est refusée.
    shows: 'الدوران يحافظ على الأطوال وأقياس الزوايا واستقامية النقط والمساحات ، ونوظّف ذلك لإثبات تقايس قطع أو زوايا وتعامد أو توازي مستقيمات',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'inscribed-angle': {
    // L'ANGLE DE TIR : les poteaux A et B sur un cercle ; l'élève déplace le tireur M sur le cercle — l'angle \widehat{AMB} ne change pas tant
    // que M reste sur le même arc, et vaut la moitié de l'angle au centre \widehat{AOB} ; hors du cercle, il change.
    shows: 'الزاوية المحيطية قيسها نصف قيس الزاوية المركزية التي تحصر معها نفس القوس ، وكل الزوايا المحيطية التي تحصر نفس القوس متقايسة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'polygon-forge': {
    // LA FORGE DE POLYGONES : l'élève choisit l'angle du دوران (ou n) et fait tourner un sommet autour du centre, image après image ; la figure ne
    // se REFERME en polygone régulier que si l'angle vaut 360°/n ; l'étoile du drapeau en est le cas à 72°.
    shows: 'رؤوس مضلع منتظم ذي n ضلعا على دائرة مركزها مركزه ، وكل رأس صورة الذي قبله بالدوران الذي زاويته 360°/n ، ومنه زاوية المضلع وطول ضلعه',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false, autoComplete: { unlock: 'config' } },
  },
  'lamp-ring': {
    // LES LAMPADAIRES DU ROND-POINT (أدمج تعلّماتي) : n lampadaires régulièrement espacés autour d'un massif circulaire ; l'élève règle n et le
    // rayon, l'angle au centre et l'écart entre deux lampadaires se calculent (triangle rectangle, sin) ; un espacement inégal est refusé.
    shows: 'نوزّع n نقطة بانتظام على دائرة: الزاوية المركزية 360°/n ، والمسافة بين نقطتين متتاليتين 2r·sin(180°/n) بالمثلث القائم',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // Unité 14 « الهندسة في الفضاء » (2026-10-05) — calcul exact : packages/core/arithmetic/space.js ; scène 3D commune :
  // lessons/common/manipulations/space/stage3d/ (three.js, repli SpaceFigure).
  'sphere-probe': {
    // LA SONDE : l'élève déplace un point M dans l'espace autour du centre O ; la كرة (surface creuse) ne l'accepte que si
    // OM = R, la جلّة (boule pleine) dès que OM ≤ R (comparaison exacte de OM² et R²) ; puis un plan par O découpe un grand cercle.
    shows: 'الكرة التي مركزها O ونصف قطرها R هي مجموعة النقط M من الفضاء حيث OM = R ، والجلة هي مجموعة النقط M حيث OM ≤ R ، والدائرة الكبرى مركزها O ونصف قطرها R',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'orange-peel': {
    // ARCHIMÈDE ET L'ORANGE : l'élève règle R ; la peau de la sphère couvre exactement QUATRE disques de rayon R (4πR²) et l'eau
    // de la boule remplit les DEUX TIERS du cylindre de hauteur 2R qui l'enveloppe (4/3·πR³).
    shows: 'مساحة الكرة 4πR² تساوي المساحة الجانبية للأسطوانة التي تحيط بها ، وحجم الجلة 4/3·πR³ يساوي ثلثي حجم هذه الأسطوانة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'section-slicer': {
    // LA TRANCHEUSE : l'élève monte un plan (ou le fait glisser parallèlement à une face, à une arête, à l'axe) à travers un
    // solide ; la section se dessine et se mesure en direct — cercle de rayon √(R² − h²), rectangle, réduction de la base.
    shows: 'مقطع كرة بمستو دائرة نصف قطرها √(R² − h²) ، ومقطع بلاطة قائمة أو أسطوانة دوران مستطيل أو دائرة ، ومقطع هرم أو مخروط بمستو موازٍ للقاعدة تصغير لها',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'scale-blocks': {
    // LES BLOCS : l'élève règle le rapport k d'un pavé construit en cubes unités ; on COMPTE les arêtes (× k), les carrés d'une
    // face (× k²), les cubes (× k³) — le piège « le volume est multiplié par k » est refusé par le décompte.
    shows: 'في تكبير أو تصغير نسبته k تضرب الأطوال في k والمساحات في k² والحجوم في k³',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'bucket-fill': {
    // LE SEAU (أدمج تعلّماتي, le تحدّ) : un tronc de cône rempli jusqu'à un niveau ; l'élève prolonge les génératrices jusqu'au
    // sommet du cône (Thalès), lit le rapport k du petit cône et calcule le volume d'eau V = V_grand·(1 − k³).
    shows: 'حجم مخروط مبتور = حجم المخروط الكبير − حجم المخروط الصغير ، والمخروط الصغير تصغير للكبير نسبته k فحجمه k³ مرة حجم الكبير',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // 1AM, unité 2 « الجمع والطرح » (2026-10-14, cycle moyen phase 3) — le SENS des deux opérations.
  'story-bars': {
    // LE MODÈLE EN BARRES D'UNE HISTOIRE (« مخطط بأقواس », manuel p. 26 et 29) : l'élève tient l'INCONNUE — il tire la
    // taille d'un élève devant la toise jusqu'à ce que la phrase de l'histoire soit vraie, puis choisit le calcul qui
    // donne cette taille (مبتدئ) ; ou il pose chaque carte de calcul du manuel sur son texte (نشاط 1, متقدم). La bande
    // ne se FERME que si les parties font le tout : l'inconnue est le tout ⇒ on additionne, une partie ⇒ on soustrait —
    // quels que soient les mots « يزيد / ينقص » de l'histoire.
    shows: 'المجهول هو الكلّ (المجموع) ⇐ نجمع الجزأين ؛ المجهول جزء (حدّ) ⇐ نطرح الجزء الآخر من الكلّ — الكلمة « يزيد » أو « ينقص » وحدها لا تقرّر العملية',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // 1AM, unité 3 « الضرب والقسمة » (2026-10-14) — la division euclidienne.
  'division-jumps': {
    // LE RUBAN DES BOUQUETS / LES SAUTS SUR LA DROITE : b est DONNÉ (la taille d'un bouquet, d'un saut) ; l'élève tire le
    // ruban (ou la suite de sauts) : q groupes. Un groupe de trop demande des fleurs qui n'existent pas (b(q+1) > a), un
    // groupe de moins laisse de quoi en faire un autre (r ≥ b) : le quotient est le plus grand q tel que bq ≤ a, et r < b.
    shows: 'القسمة الإقليدية: الحاصل هو أكبر عدد من المجموعات الكاملة، ونتوقف عندما يصبح الباقي أصغر من المقسوم عليه ؛ a = b × q + r مع r < b',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // 1AM, unité 3 — les critères de divisibilité.
  'digit-cards': {
    // LA TABLE ET LES CARTES DE CHIFFRES : (مبتدئ, نشاط 4) l'élève colorie dans la table 0–48 à 7 colonnes les multiples de 2,
    // 5 puis 3 — chaque case jugée par son reste — et voit apparaître les chiffres des unités / les sommes des chiffres ;
    // (متقدم, تمرين 26) il FORME des nombres avec les cartes 4, 5, 9, 3 : permuter les chiffres ne change jamais la
    // divisibilité par 3 ou 9, déplacer le chiffre des unités la change pour 2 et 5, seuls les deux derniers chiffres
    // décident pour 4 — et aucun arrangement ne se divise par 4.
    shows: 'يقبل العدد القسمة على 2 أو 5 حسب رقم آحاده، وعلى 3 أو 9 حسب مجموع أرقامه، وعلى 4 حسب العدد المشكّل من رقميه الأخيرين ؛ ويقبل a القسمة على b إذا كان باقي القسمة الإقليدية معدومًا',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
});

export const MANIPULATION_TYPE_IDS = Object.freeze(Object.keys(MANIPULATION_TYPES));

export function isManipulationType(type) {
  return Object.prototype.hasOwnProperty.call(MANIPULATION_TYPES, type);
}

/** Les natures de ressource qu'une leçon peut déclarer dans `resources[]`. */
export const RESOURCE_KINDS = Object.freeze(['manipulation', 'method', 'situation', 'example']);

/** Les natures de leçon. `synthesis` = « أدمج تعلّماتي », la synthèse d'unité. */
export const LESSON_KINDS = Object.freeze(['lesson', 'synthesis']);

/**
 * Les étapes exigées selon la nature. Une synthèse n'a ni découverte ni
 * formalisation : elle mobilise ce que les leçons ont enseigné.
 */
export const REQUIRED_STAGES_BY_KIND = Object.freeze({
  lesson: ['trigger', 'discovery', 'formalization', 'practice_lab', 'evaluation'],
  // « أدمج تعلّماتي » de l'unité 1 s'ouvre sur ses entraînements (2026-10-13) : pas de `trigger`.
  synthesis: ['practice_lab', 'evaluation'],
});
