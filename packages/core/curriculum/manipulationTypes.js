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
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { a: [2, 9999], b: [1, 999] } },
  },
  'divisor-explorer-books': {
    // Le RAYON QU'ON ÉTIRE (Module 1 — المكتبة, quotition) : l'élève tire le
    // serre-livres, tous les rayons prennent la longueur b, les a livres se
    // rangent en q rayons pleins et r restent au sol. Chaque position est un
    // essai : MANUEL (§6bis), rien à compléter.
    shows: 'b عدد الكتب في كل رفّ: b قاسم لـ a ⇔ لا يبقى أي كتاب على الأرض ⇔ a = b × q + 0',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
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
    controls: { reset: true, nextStep: true, toggleExplanation: true, changeNumbers: { n: [2, 999] } },
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
    controls: { reset: true, nextStep: true, toggleExplanation: true, changeNumbers: { a: [2, 300], b: [2, 300] } },
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
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { a: [2, 300], b: [2, 300] } },
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
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { num: [1, 400], den: [1, 100] } },
  },
  'square-fold': {
    // L'élève DÉPLACE x sur la droite graduée ; une flèche porte x vers x²
    // sur la droite des carrés, dont la moitié négative est hachurée : aucun
    // carré n'y arrive (résistance). x et −x arrivent au même point.
    // Épingler un x comme solution est une RÉPONSE : MANUEL (§6bis).
    shows: 'المعادلة x² = a: حلّان متعاكسان √a و −√a إذا كان a > 0، حل واحد 0 إذا كان a = 0، ولا حل إذا كان a < 0',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'square-tiling': {
    // L'élève ÉTIRE k, le nombre de dalles par côté d'un carré d'aire n :
    // n = k² × b et le côté vaut k√b. Une dalle d'aire non entière est
    // refusée (k² ne divise pas n). Le plus grand k donne b le plus petit.
    // Chaque k est un essai : MANUEL (§6bis).
    shows: '√(k² × b) = √(k²) × √b = k√b: مربّع مساحته n مبلّط بـ k × k بلاطة مساحة كل منها b — وأكبر k يعطي أصغر b',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: { n: [2, 999] } },
  },

  // ── Unité 3 « الحساب الحرفي » (2026-10-01) ──────────────────────────────
  'pitch-expansion': {
    // Un terrain de football dont les côtés sont les deux facteurs : l'élève
    // ÉTIRE x, PORTE chaque zone (un produit partiel) dans la somme, RÉUNIT
    // les termes semblables et vérifie l'égalité pour plusieurs x. Chaque
    // zone portée et chaque fusion est une décision : MANUEL (§6bis).
    shows: 'النشر: مساحة الملعب (الجداء) تساوي مجموع مساحات مناطقه — k(a + b) = ka + kb و (a + b)(c + d) = ac + ad + bc + bd والمتطابقات الشهيرة — من أجل كل قيمة لـ x',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'turf-factoring': {
    // Le geste inverse : des plaques de gazon (x², x, 1) à assembler en UN
    // terrain rectangulaire, dont les côtés sont les facteurs. rows : l'élève
    // étire le nombre de rangées identiques (ka + kb = k(a + b)) ; square :
    // il porte les bandes à droite ou en bas du carré x², le coin décide
    // (a² + 2ab + b² = (a + b)²). Chaque essai est une réponse : MANUEL.
    shows: 'التحليل: كتابة مجموع على شكل جداء هي تكوين مستطيل واحد من قطعه — ka + kb = k(a + b) و a² + 2ab + b² = (a + b)²',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
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
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'solution-ray': {
    // Un mobile sur une droite graduée : chaque position validée laisse une trace —
    // rouge si l'inégalité est vraie (convention du manuel), grise sinon. L'élève pose
    // ensuite le CROCHET de la borne, et (متقدم) transforme l'inéquation : une étape
    // licite garde exactement ses traces, une division par un négatif sans inverser le
    // sens les contredit. Chaque essai est une réponse : MANUEL.
    shows: 'حلول المتراجحة نصف مستقيم: نحافظ على الاتجاه بإضافة عدد أو الضرب في موجب، ونغيّره بالضرب أو القسمة على سالب',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'growth-race': {
    // Deux grandeurs du premier degré qui « grandissent » avec x (âges, coûts) : l'élève
    // CONSTRUIT d'abord chaque expression en portant les jetons x là où l'histoire les
    // met (chaque enfant vieillit), puis étire x : les deux colonnes se rejoignent à
    // la solution de l'équation et se dépassent au-delà (l'inéquation). Chaque jeton
    // et chaque x validé est une décision : MANUEL.
    shows: 'ترييض مشكلة: نسمّي المجهول، نترجم النص إلى عبارتين، فتكون المعادلة لحظة تساويهما والمتراجحة لحظة تفوّق إحداهما',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
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
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'origin-line': {
    // LA DROITE ÉPINGLÉE À O : l'origine ne bouge pas (on essaie, elle résiste) ; l'élève tire la
    // poignée A(1 ; a) — la droite pivote, monte si a > 0, descend si a < 0 ; une sonde verticale
    // (ou horizontale) lit une image (ou un antécédent). Un point posé hors de la droite est refusé
    // avec son écart. Mondes : téléphérique, ressort (nuage de points du tableau), budget (plafond).
    shows: 'التمثيل البياني للدالة الخطية x ⟼ ax مستقيم يشمل المبدأ O ومعامل توجيهه a : يكفي تعيين نقطة ثانية، ونقرأ عليه صورة عدد والعدد الذي علمت صورته',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'percent-tag': {
    // L'ÉTIQUETTE QU'ON ÉTIRE : le prix est une barre ; l'élève choisit زيادة / تخفيض et tire t % —
    // la barre est multipliée par 1 ± t/100 (jamais « + t »). En متقدم, deux changements successifs :
    // le pari « −30 % puis +15 % = −15 % » est refusé par la barre elle-même (on multiplie les
    // multiplicateurs). Chaque réglage est une réponse : MANUEL.
    shows: 'النسب المئوية تناسبية: زيادة x بـ t% تعني ضربه في 1 + t/100 وتخفيضه يعني ضربه في 1 − t/100 ، والتغيرات المتتابعة تُضرب ولا تُجمع',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  // ── Unité 7 « الدالة التآلفية » (2026-10-02) — calcul exact : packages/core/arithmetic/affine.js.
  'affine-meter': {
    // LE COMPTEUR À PARTIE FIXE : un bloc b posé d'avance (la paie de base, la prise en charge) et x blocs
    // de a. L'élève règle x (image) ou cherche x pour un total m (antécédent : ax + b = m) ; en متقدم il
    // tient aussi les boutons a et b — b = 0 rend la fonction خطية, a = 0 la rend ثابتة.
    shows: 'الدالة التآلفية جزء ثابت b وجزء متغير ax : صورة x هي ax + b ، والعدد الذي صورته m حلّ المعادلة ax + b = m ؛ b = 0 دالة خطية و a = 0 دالة ثابتة',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'affine-line': {
    // LA DROITE QUI NE PASSE PLUS PAR O : la droite de x ⟼ ax (fantôme) et sa copie montée de b. L'élève
    // tire le point (0 ; b) sur l'axe des ordonnées (translation) et la marche « 1 à droite, a en haut »
    // (pente) ; il lit a et b sur une droite donnée, ou une image / un antécédent avec une sonde.
    shows: 'التمثيل البياني للدالة التآلفية x ⟼ ax + b مستقيم يقطع محور التراتيب في (0 ; b) ويوازي مستقيم الدالة الخطية x ⟼ ax : b الترتيب عند المبدأ و a معامل التوجيه',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'slope-stairs': {
    // L'ESCALIER DES ACCROISSEMENTS : deux marqueurs x1, x2 sur la droite ; la marche Δx, Δf se dessine ;
    // l'élève déplace les marqueurs où il veut — le quotient Δf ÷ Δx ne bouge pas (INVARIANT = a), puis il
    // descend jusqu'à x = 0 pour lire b. Deux nombres et leurs images suffisent à retrouver f.
    shows: 'تناسب التغيّرات: مهما كان العددان x1 و x2 فإنّ (f(x1) − f(x2)) ÷ (x1 − x2) يساوي a ، ومن عددين وصورتيهما نعيّن a ثم b',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'line-crossing': {
    // DEUX DROITES, UN POINT : chaque équation de la جملة est écrite y = ax + b et tracée ; l'élève promène
    // un point — chaque équation s'allume quand il est sur sa droite ; les deux ensemble : la ثنائية
    // solution. En متقدم il règle la seconde droite jusqu'aux cas parallèles / confondues.
    shows: 'حل جملة معادلتين بيانيا: كل معادلة مستقيم y = ax + b ، والثنائية حلّ الجملة إحداثيتا نقطة تقاطعهما ؛ متوازيان: لا حل ، منطبقان: عدد لا نهائي من الحلول',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'plan-compare': {
    // DEUX TARIFS FACE À FACE : chaque formule est une fonction affine (partie fixe + partie variable) ;
    // l'élève fait varier x (séances, heures, jours) — les deux coûts et leurs droites bougent ensemble —
    // trouve x où ils sont égaux et décide quelle formule choisir de chaque côté. Réutilisé par la synthèse.
    shows: 'المفاضلة بين صيغتين: كل تسعيرة دالة تآلفية (جزء ثابت وجزء متغير) ، يتقاطع المستقيمان حيث تتساوى التكلفتان ، وتتغير الصيغة الأفضل قبل نقطة التقاطع وبعدها',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
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
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'sheet-lab': {
    // LA MAQUETTE DU MAJDOUL : une feuille dessinée — l'élève saisit les valeurs, sélectionne une plage à la
    // main (A1:G1), compose le دستور (MAX − MIN, MEDIANE, MOYENNE, MODE) ; une plage fausse donne un nombre
    // qui contredit son calcul, une cellule modifiée recalcule tout ; puis il choisit le graphique qui
    // convient aux données (أعمدة / دائري / مدرّج).
    shows: 'المجدول يحسب مؤشرات سلسلة محجوزة في خلايا بدساتير: المدى ⁦=MAX()-MIN()⁩ ، الوسيط ⁦=MEDIANE()⁩ ، المتوسط ⁦=MOYENNE()⁩ ، المنوال ⁦=MODE()⁩ ، ويرسم التمثيل البياني المناسب',
    controls: { reset: true, nextStep: false, toggleExplanation: true, changeNumbers: false },
  },
  'group-tanks': {
    // LES RÉSERVOIRS DE GROUPES : chaque groupe est un réservoir de largeur n (son effectif) rempli au niveau
    // de sa moyenne ; l'élève PARIE le niveau du groupe réuni puis ouvre la vanne — le niveau commun est la
    // moyenne pondérée (Σ n·m ÷ N), jamais la moyenne des moyennes. En متقدم, deux classes face à face.
    shows: 'متوسط مجموعتين مجتمعتين هو المتوسط المتوازن: مجموع (التكرار × المتوسط) مقسوم على التكرار الكلي ، وليس متوسط المتوسطين',
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
  synthesis: ['trigger', 'practice_lab', 'evaluation'],
});
