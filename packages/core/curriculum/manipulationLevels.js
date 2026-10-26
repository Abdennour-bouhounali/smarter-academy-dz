// Les DEUX NIVEAUX d'une manipulation — la partie sans React.
//
// PRINCIPE PRODUIT (2026-09-20). Le manuel dit CE QUE l'élève doit
// apprendre ; Smarter Academy décide COMMENT il le vit. La fidélité se
// sépare donc en deux :
//
//   • FIDÉLITÉ MATHÉMATIQUE — concept, définition, propriété, méthode,
//     notation, vocabulaire, progression, objectif : intouchables. Elles
//     viennent du manuel et de `packages/core/arithmetic/`.
//   • FIDÉLITÉ CONTEXTUELLE — l'habillage de la situation. Une situation du
//     manuel peut être REMPLACÉE par une situation plus engageante si la
//     STRUCTURE mathématique et l'objectif sont préservés.
//
// Un remplacement n'est jamais silencieux : il porte sa traçabilité
// (`source` = d'où vient la mathématique, `experience` = ce qui a été adapté
// et pourquoi). C'est ce que `manipulationExperience()` construit et ce que
// `validate-lessons.mjs` vérifie.
//
// Ici ne vivent que les FORMES (quels champs, quelles valeurs admises) et
// les vérificateurs. Les contenus vivent dans les leçons ; les composants
// dans apps/web/src/lessons/common/manipulations/.

/** Les deux niveaux, dans l'ordre. `beginner` est TOUJOURS le niveau par défaut. */
export const MANIPULATION_LEVEL_IDS = Object.freeze(['beginner', 'advanced']);

export const DEFAULT_MANIPULATION_LEVEL = 'beginner';

/**
 * Les natures d'expérience :
 *   textbook             la situation du manuel, gardée telle quelle
 *   platform_adaptation  la situation du manuel, réhabillée (même structure)
 *   platform_context     une situation nouvelle, choisie par la plateforme
 *
 * Les deux dernières EXIGENT une raison ; c'est ce qui rend l'adaptation
 * auditable, leçon par leçon.
 */
export const EXPERIENCE_TYPES = Object.freeze(['textbook', 'platform_adaptation', 'platform_context']);

/** Les raisons admises d'une adaptation — une énumération fermée, pas du texte libre. */
export const ADAPTATION_REASONS = Object.freeze([
  'improved_interactivity_and_age_appropriateness',
  'smaller_numbers_for_first_contact',
  'larger_numbers_for_autonomy',
  'multiple_representations',
  'reduced_scaffolding',
  // Le manuel fixe les الكفاءات, la plateforme CHOISIT l'entrée (LESSON_DEVELOPMENT_GUIDE §4ter, propriétaire 2026-10-14).
  'platform_designed_entry',
]);

/**
 * Les thèmes visuels disponibles. Le thème est une DONNÉE : il choisit le
 * vocabulaire et le dessin des objets, jamais la mathématique. Un thème ne
 * s'impose que lorsqu'il SERT la structure (§11 du brief : ne jamais forcer
 * un contexte qui rend la mathématique moins claire).
 */
export const VISUAL_THEMES = Object.freeze({
  library: { kind: 'objects', shows: 'كتب ورفوف' },
  football: { kind: 'people', shows: 'لاعبون وفرق' },
  garden: { kind: 'objects', shows: 'زهور وباقات' },
  // Les thèmes ajoutés le 2026-09-21 pour propager la qualité du terrain et
  // de la bibliothèque aux autres leçons de l'unité. Chacun DESSINE ses
  // objets (primitives/ItemFigure.jsx, BrickWall.jsx, RibbonStrip.jsx) et
  // n'est choisi que lorsqu'il rend la structure mathématique visible :
  //   school        des fournitures réparties en trousses identiques
  //                 (groupes identiques → قواسم مشتركة)
  //   kitchen       une recette : deux ingrédients répartis en parts égales
  //                 (diviser numérateur et dénominateur → اختزال)
  //   construction  des murs en briques de longueur n (n | a et n | b ⇒ …)
  //   workshop      des rubans qu'on coupe ou qu'on reporte (الفروق، إقليدس)
  school: { kind: 'objects', shows: 'أقلام وكراريس في حقائب' },
  kitchen: { kind: 'objects', shows: 'ملاعق وأكواب في حصص' },
  construction: { kind: 'lengths', shows: 'جدران من طوب بطول n' },
  workshop: { kind: 'lengths', shows: 'أشرطة تُقصّ وتُقاس' },
  abstract: { kind: 'tiles', shows: 'بلاطات ومناطق' },
  // Unité 4 « معادلات ومتراجحات » (2026-10-01), mondes du lab growth-race :
  //   family  des personnes dont l'âge grandit avec x (ترييض مشكلة : le père et ses enfants)
  //   pool    deux formules d'abonnement au مسبح : coût par séance et carte annuelle
  family: { kind: 'people', shows: 'أفراد عائلة تكبر أعمارهم' },
  pool: { kind: 'objects', shows: 'مسبح وتذاكر وصيغ اشتراك' },
  // Unité 5 « جمل معادلتين » (2026-10-01) :
  //   staff    les agents d'un service avant / après les départs à la retraite (نشاط 1)
  //   coins    les pièces de 20DA et 10DA de la cagnotte de la classe (تحدّ)
  //   snack    la كرنتيكة et la gazouz du kiosque : deux prix inconnus (cartes d'élimination)
  //   stadium  les tribunes d'un derby : billets adultes / enfants (modéliser une histoire)
  //   museum   l'entrée du musée : billets adultes / enfants (نشاط 3)
  //   party    le goûter de la fête : jus et gâteaux (أدمج تعلّماتي)
  staff: { kind: 'people', shows: 'عمّال مصلحة قبل وبعد الإحالة على التقاعد' },
  coins: { kind: 'objects', shows: 'قطع نقدية من فئتي 20DA و 10DA' },
  snack: { kind: 'objects', shows: 'كرنتيكة ومشروب: سعران مجهولان' },
  stadium: { kind: 'people', shows: 'مناصرون يدخلون الملعب بتذاكر الكبار والصغار' },
  museum: { kind: 'people', shows: 'زوّار متحف بتذاكر البالغين والصغار' },
  party: { kind: 'objects', shows: 'علب عصير وقطع حلوى حفل' },
  // Unité 6 « الدالة الخطية والتناسبية » (2026-10-02) :
  //   scooter   les trottinettes louées à la minute sur la promenade (compteur de trajet)
  //   souk      les étiquettes de la remise de l'Aïd (machine linéaire, نشاط 1)
  //   cablecar  le téléphérique : une cabine sur un câble droit (droite par O ; أدمج تعلّماتي)
  //   spring    le ressort et ses masses (طرائق : y = 0,3x)
  //   mall      les soldes du centre commercial (étiquette étirée)
  //   tank      le réservoir d'eau vidé puis rempli (changements successifs)
  scooter: { kind: 'objects', shows: 'تروتينات كهربائية تؤجَّر بالدقيقة' },
  souk: { kind: 'objects', shows: 'سلع بأسعار قبل وبعد تخفيض العيد' },
  cablecar: { kind: 'objects', shows: 'مصعد هوائي يسير على حبل مستقيم' },
  spring: { kind: 'objects', shows: 'نابض تعلّق به كتل' },
  mall: { kind: 'objects', shows: 'أحذية رياضية بأسعار التخفيضات' },
  tank: { kind: 'objects', shows: 'خزان ماء يُفرَغ ويُملأ' },
  // Unité 7 « الدالة التآلفية » (2026-10-02) :
  //   payroll  la fiche de paie : un salaire de base et des heures supplémentaires (نشاط 1)
  //   ride     la course en taxi-application : prise en charge + prix au km (compteur à partie fixe)
  //   ramp     la rampe du skatepark : une pente qui part d'une hauteur b (droite affine)
  //   thermo   le thermomètre °C / °F du تحدّ (deux couples lus, f(x) = 1,8x + 32)
  //   gaming   la salle de jeux vidéo : carte d'abonnement contre paiement à l'heure (deux tarifs)
  //   rental   la location de vélos / kayaks à la plage : forfait contre prix à l'heure (synthèse)
  payroll: { kind: 'objects', shows: 'أجرة قاعدية وساعات إضافية' },
  ride: { kind: 'objects', shows: 'رحلة سيارة أجرة بتطبيق: ثمن الانطلاق وثمن الكيلومتر' },
  ramp: { kind: 'objects', shows: 'منحدر حديقة التزلج يبدأ من ارتفاع b' },
  thermo: { kind: 'objects', shows: 'محرار بتدريجتي سلسيوس وفهرنهايت' },
  gaming: { kind: 'objects', shows: 'قاعة ألعاب إلكترونية: اشتراك أو دفع بالساعة' },
  rental: { kind: 'objects', shows: 'كراء دراجات وقوارب على الشاطئ: جزافي أو بالساعة' },
  //   laser    (line-crossing, مبتدئ) un spectacle de lumière : deux faisceaux laser droits qui se croisent
  laser: { kind: 'objects', shows: 'عرض ضوئي: شعاعا ليزر مستقيمان يتقاطعان' },
  // Unité 8 « الإحصاء » (2026-10-02) :
  //   funpark  la file d'un manège au parc d'attractions : « القامة t على الأقل » (barre de taille)
  //   heatwave le thermomètre d'El Oued : dix jours de canicule (balance des valeurs, نشاط 4)
  //   esport   un mini-tournoi de jeu vidéo entre amis : les scores des joueurs (balance, مبتدئ)
  //   sheet    l'écran d'ordinateur de la salle d'informatique : un majdoul (sheet-lab)
  //   beach    les déchets ramassés sur la plage (تمرين 15 : diagramme circulaire)
  //   quiz     le quiz de la classe : deux groupes et leurs moyennes réunis (réservoirs)
  //   medals   le tableau des médailles d'or olympiques (أدمج تعلّماتي)
  funpark: { kind: 'people', shows: 'طابور لعبة في حديقة التسلية بشرط على القامة' },
  heatwave: { kind: 'objects', shows: 'محرار مدينة الوادي في أيام الحر' },
  esport: { kind: 'people', shows: 'دورة ألعاب إلكترونية بين الأصدقاء: نقاط اللاعبين' },
  sheet: { kind: 'objects', shows: 'مجدول على حاسوب قاعة الإعلام الآلي' },
  beach: { kind: 'objects', shows: 'نفايات مجموعة على الشاطئ' },
  quiz: { kind: 'people', shows: 'مسابقة القسم: فوجان ومعدّلاهما' },
  medals: { kind: 'objects', shows: 'ميداليات ذهبية في الألعاب الأولمبية' },
  // Unité 9 « خاصية طالس » (2026-10-02) :
  //   cinema   la projection en plein air du quartier : un vidéoprojecteur, un écran qu'on recule (faisceau, نشاط 1)
  //   camera   la chambre noire (un trou d'épingle) : l'image renversée de l'autre côté de A (وضعية الفراشة)
  //   mural    l'échelle double des graffeurs du quartier : la barre doit être de niveau (الخاصية العكسية)
  //   minaret  l'ombre de la minaret et du bâton (تحدّ, أدمج تعلّماتي)
  //   cornet   le cornet de glace et le pot cylindrique (أدمج تعلّماتي, cône et cylindre)
  //   river    viser par-dessus l'oued pour en estimer la largeur (أتعمّق 22)
  cinema: { kind: 'objects', shows: 'عرض سينمائي في الحي: جهاز إسقاط وشاشة تُبعَد' },
  camera: { kind: 'objects', shows: 'غرفة مظلمة بثقب: صورة مقلوبة' },
  mural: { kind: 'objects', shows: 'سلّم مزدوج لرسّامي الجداريات وعارضة أفقية' },
  minaret: { kind: 'objects', shows: 'مئذنة وعصا وظلاهما' },
  cornet: { kind: 'objects', shows: 'مخروط مثلجات وعلبة أسطوانية داخله' },
  river: { kind: 'objects', shows: 'تقدير عرض وادٍ بالتسديد البصري' },
  //   tifo     la banderole géante des ultras du quartier, partagée en bandes égales (ou p : q) au compas (segment-divider)
  tifo: { kind: 'lengths', shows: 'لافتة تيفو للأنصار تُقسَّم إلى أشرطة بالمسطرة غير المدرّجة والمدور' },
  // Unité 10 « حساب المثلثات في المثلث القائم » (2026-10-04) :
  //   skatepark  les rampes du skatepark : la planche (hypoténuse), la hauteur, le sol ; trois rampes au même angle (نشاط 2)
  //   drone      la nacelle inclinée d'une caméra de drone : l'angle tapé sur la calculatrice (نشاط 4)
  //   kite       le cerf-volant sur la plage : le fil (compas, hypoténuse) et la hauteur (إنشاء زاوية)
  //   floodlight le projecteur du stade visé au clinomètre du téléphone depuis la ligne de touche
  //   maqam      مقام الشهيد visé par-dessus un poteau électrique (أدمج تعلّماتي) ; l'échelle du تحدّ réutilise `mural`
  skatepark: { kind: 'objects', shows: 'منحدرات حديقة التزلج: اللوح والارتفاع والأرض' },
  drone: { kind: 'objects', shows: 'كاميرا طائرة مسيّرة تميل بزاوية تُكتب على الحاسبة' },
  kite: { kind: 'objects', shows: 'طائرة ورقية على الشاطئ: الخيط والارتفاع' },
  floodlight: { kind: 'objects', shows: 'كشّاف إنارة الملعب يُسدَّد بمقياس الميل في الهاتف' },
  maqam: { kind: 'objects', shows: 'مقام الشهيد يُرى من فوق عمود كهربائي' },
  // Unités 11 « الأشعة والانسحاب » et 12 « الأشعة في معلم » (2026-10-04) :
  //   drone-show  une formation de drones lumineux au-dessus de la baie d'Alger qui glisse d'un bloc (انسحاب)
  //   scooter     (déjà déclaré plus haut) réutilisé : deux trajets de trottinette enchaînés dans Alger (علاقة شال)
  //   swim        un nageur traverse l'oued et le courant le déporte (قاعدة متوازي الأضلاع, تحدّ)
  //   metro       les tronçons et correspondances du métro d'Alger (sommes de plusieurs vecteurs)
  //   bridge      un pont jeté sur le Rhummel de Constantine (le plus court chemin par translation)
  //   delivery    l'appli de livraison : le livreur sur le quadrillage d'un quartier (مركبتا شعاع)
  //   game-map    deux portails d'une carte de jeu mobile (حساب المركبتين)
  //   gps-meet    deux amis partagent leur position GPS et se retrouvent à mi-chemin (المنتصف والمسافة)
  //   rally       deux itinéraires d'un rallye dans le Sahara (مقارنة مسارين)
  'drone-show': { kind: 'objects', shows: 'عرض طائرات مسيّرة مضيئة فوق خليج الجزائر' },
  swim: { kind: 'people', shows: 'سبّاح يعبر الوادي والتيار يجرفه' },
  metro: { kind: 'objects', shows: 'محطات وخطوط مترو الجزائر' },
  bridge: { kind: 'objects', shows: 'جسر فوق وادي الرمال بقسنطينة' },
  // crosswalk  la rue de l'école du manuel (أدمج تعلّماتي) : deux trottoirs, la cité, l'école, un passage piéton qu'on déplace
  crosswalk: { kind: 'objects', shows: 'شارع المدرسة: رصيفان وحيّ ومدرسة وممر للراجلين' },
  delivery: { kind: 'objects', shows: 'تطبيق توصيل: سائق على شبكة شوارع حيّ' },
  'game-map': { kind: 'objects', shows: 'بوابتا عبور في خريطة لعبة على الهاتف' },
  'gps-meet': { kind: 'people', shows: 'صديقان يتشاركان موقعيهما ويلتقيان في منتصف الطريق' },
  rally: { kind: 'objects', shows: 'مساران لرالي في الصحراء الجزائرية' },
  // cross       le cross-country des Sablettes (أدمج تعلّماتي, وضعية p. 148) : deux coureurs et leurs montres connectées, trois
  //             bassins ronds contournés par des demi-cercles, une ligne brisée de balises
  cross: { kind: 'people', shows: 'عدّاءان بساعتين ذكيتين في سباق الضاحية على واجهة الصابلات' },
  // Unité 13 « الدوران - الزوايا - المضلّعات المنتظمة » (2026-10-04) :
  //   ferris-wheel  la grande roue du parc d'attractions de Ben Aknoun : les nacelles tournent autour du moyeu (صورة نقطة بدوران)
  //   zellige       un motif de zellige de Tlemcen qu'on fait tourner autour d'un centre pour composer une rosace (خواص الدوران)
  //   football      (déjà déclaré) réutilisé : l'angle de tir vers le but depuis l'arc de cercle (الزاوية المحيطية)
  //   flag-star     l'étoile du drapeau algérien tracée sur un tifo (الخماسي المنتظم، تحدّ)
  //   honeycomb     les alvéoles d'une ruche de Kabylie (السداسي المنتظم)
  //   flower-bed    un massif de fleurs circulaire d'un jardin public et ses lampadaires (أدمج تعلّماتي)
  'ferris-wheel': { kind: 'objects', shows: 'عجلة دوّارة في حديقة التسلية ببن عكنون' },
  zellige: { kind: 'objects', shows: 'زخرفة زليج تلمساني تدور حول مركزها' },
  'flag-star': { kind: 'objects', shows: 'نجمة العلم الجزائري ترسم على لوحة مشجعين' },
  honeycomb: { kind: 'objects', shows: 'خلايا خلية نحل في القبائل' },
  'flower-bed': { kind: 'objects', shows: 'حوض أزهار دائري وأعمدة إنارة في حديقة عمومية' },
  // Unité 14 « الهندسة في الفضاء » (2026-10-05) :
  //   glass-globe      une boule lumineuse RGB de chambre de gamer : la كرة creuse (verre) face à la جلّة pleine
  //   shot-put         le lancer du poids (الجلّة) d'une athlète algérienne au stade : la boule PLEINE
  //   boufarik-orange  une orange de Boufarik épluchée : sa peau couvre quatre disques (مساحة الكرة)
  //   3d-printer       l'imprimante 3D du fablab du lycée : chaque couche imprimée est une SECTION plane du solide
  //   voxel-blocks     des blocs de construction d'un jeu sur téléphone : agrandir un pavé cube par cube (k, k², k³)
  //   beach-bucket     le seau de plage (tronc de cône) sur le sable de Tipaza : l'eau qu'il contient (أدمج تعلّماتي)
  'glass-globe': { kind: 'objects', shows: 'كرة زجاجية مضيئة في غرفة ألعاب' },
  'shot-put': { kind: 'people', shows: 'رمي الجلة في ملعب لألعاب القوى' },
  'boufarik-orange': { kind: 'objects', shows: 'برتقالة من بوفاريك تقشّر قشرتها' },
  '3d-printer': { kind: 'objects', shows: 'طابعة ثلاثية الأبعاد في نادي العلوم تطبع مجسما طبقة بعد طبقة' },
  'voxel-blocks': { kind: 'objects', shows: 'مكعبات بناء في لعبة على الهاتف' },
  'beach-bucket': { kind: 'objects', shows: 'دلو رمل على شاطئ تيبازة' },
  // 1AM, unité 2 « الجمع والطرح » (2026-10-14, cycle moyen phase 3) :
  //   checkup  la visite médicale scolaire : des élèves debout devant la toise ; la taille inconnue se TIRE jusqu'à ce
  //            que la phrase de l'histoire soit vraie (« أطول من … بـ 6 cm ») — يزيد / ينقص sous la main (story-bars)
  checkup: { kind: 'people', shows: 'تلاميذ أمام مقياس القامة في الفحص الطبي المدرسي' },
  // 1AM, unité 1 « الأعداد الطبيعية والأعداد العشرية » (2026-10-14) :
  //   packing  l'atelier d'emballage des crayons offerts par le club de l'école aux élèves d'une école de montagne :
  //            crayon, paquet de 10, boîte de 100, carton de 1000 — on lie dix pour un, on ouvre un pour dix (rank-exchange)
  packing: { kind: 'objects', shows: 'أقلام تُربط حزمًا من 10 وعلبًا من 100 وصناديق من 1000' },
  // 1AM, unité 4 « الكتابات الكسرية » (2026-10-14) :
  //   sweets-tray  le plateau de قلب اللوز de grand-mère le soir de l'Aïd : la part des voisins (3/5) est fixée, le couteau
  //                coupe le plateau en d morceaux égaux — la part s'écrit a/d seulement si son bord tombe sur une coupe (fraction-knife)
  'sweets-tray': { kind: 'objects', shows: 'صينية قلب اللوز تُقطّع إلى قطع متساوية وحصّة الجيران منها' },
  // 2AM, unité 2 « الكسور والعمليات عليها » (2026-10-14) :
  //   farm  le poulailler et la station d'emballage du manuel (نشاط 1) : les œufs du jour sur un tapis, des boîtes de 6
  //         (مبتدئ) ou des plateaux de 30 (متقدم) qui se ferment pleins, et la règle des plateaux sous le tapis (egg-trays)
  farm: { kind: 'objects', shows: 'بيض مزرعة دواجن يوضَّب في علب وصفائح' },
  //   bakery  les pains d'un partage équitable (1AM unité 4, `fair-share`, 2026-10-15) : des baguettes posées sur la table,
  //           des parts bout à bout, des enfants (KidFigure, filles en hijab) qui attendent leur part
  bakery: { kind: 'objects', shows: 'أرغفة خبز تُقتسم بالتساوي بين أطفال' },
  // 1AM, unité 1 (2026-10-15) :
  //   mosaic  l'atelier de zellige : un panneau de 10 × 10 carreaux est l'unité ; bande (1/10), carreau (1/100), éclat (1/1000) ;
  //           le bon de commande n'a que des chiffres, la main tient la virgule (decimal-comma)
  mosaic: { kind: 'objects', shows: 'لوحة فسيفساء من مئة بلاطة تُقسَّم إلى أعمدة وبلاطات وشظايا' },
  //   sandpit  la piste de saut en longueur d'une journée sportive : des sauts mesurés au mètre, au décimètre, au centimètre, au
  //            millimètre (1AM unité 1, `ruler-compare`, 2026-10-15) — la main tient la graduation de la règle
  sandpit: { kind: 'objects', shows: 'حفرة رمل لمسابقة القفز الطويل وقفزات تُقاس بمسطرة تُغيَّر تدريجها' },
  // 1AM, unité 11 (2026-10-15) :
  //   courtyard  le حوش d'une maison : des carreaux de zellige posés sur le sol et une clôture en bois autour (1AM `tile-yard`,
  //              2026-10-15) — la main tient un carreau : l'aire est le nombre de carreaux, le périmètre le nombre de piquets
  courtyard: { kind: 'objects', shows: 'حوش بيت مفروش ببلاط الزليج ومحاط بسياج خشبي' },
  // 3AM, unité 4 (2026-10-20) :
  //   workbench  l'établi du club de mathématiques : des pièces de bois à la forme de chaque terme (carré x², réglette x, petit
  //              carré 1 ; pièce « opposée » rouge pour le signe −), des plateaux par forme et des caisses à parenthèses (`like-terms`)
  workbench: { kind: 'objects', shows: 'طاولة نادي الرياضيات: قطع خشبية على شكل كل حدّ وصوانٍ لكل شكل وصناديق أقواس' },
  // 3AM, unité 11 (2026-10-20) :
  //   sciencefair  le stand d'un معرض العلوم de l'école : une machine à trois bassins carrés transparents posée sur une table,
  //                une élève (KidFigure, hijab) qui la présente (`pythagoras-tanks`)
  sciencefair: { kind: 'objects', shows: 'جناح في معرض العلوم: آلة من ثلاثة أحواض مربعة شفافة على أضلاع مثلث' },
  // 3AM, unité 3 (2026-10-21) :
  //   railway  la gare du « قطار القوى » : une locomotive qui part en portant 1, des wagons « × a » derrière elle et « ÷ a »
  //            devant, sur un rail gradué ; une cheffe de gare (KidFigure, hijab) sur le quai (`power-train`)
  railway: { kind: 'objects', shows: 'محطة قطار: قاطرة تنطلق حاملة العدد 1 وعربات تضرب حمولتها أو تقسمها على العدد نفسه' },
  // 2AM, unité 3 (2026-10-21) :
  //   researchBoat  un bateau de recherche sur la mer : la ligne du zéro est la surface, un capteur fixe et un capteur au bout d'un
  //                 câble qui descend ou monte, un drone au-dessus, un robot plongeur dessous, une chercheuse (KidFigure, hijab) sur le
  //                 pont (`zero-probe`)
  researchBoat: { kind: 'objects', shows: 'سفينة بحث في عرض البحر: مسبار ثابت وآخر معلّق بحبل يهبط تحت سطح الماء أو يرتفع فوقه' },
  // 3AM, unité 1 (2026-10-26) :
  //   mallElevator  un مصعد شحن de centre commercial en coupe : des étages au-dessus de la rue et un parking en dessous, et l'écran de
  //                 rediffusion de la caméra de surveillance avec sa ligne du temps (`elevator-reel`)
  mallElevator: { kind: 'objects', shows: 'مصعد مركز تجاري: طوابق فوق الشارع وطوابق مرآب تحته، وشاشة إعادة تسجيل كاميرا المراقبة' },
  // 3AM, unité 4, leçon 3 (2026-10-26) :
  //   marblerun  le mur à chevilles du نادي العلوم pour la journée portes ouvertes : des rails de bois et des tubes de verre, un réservoir par lettre, des
  //              stations (copieuse, presse, basculeur, jonction), une ligne écrite et un lecteur à laiton, une élève (KidFigure, hijab) devant le mur (`marble-run`)
  marblerun: { kind: 'objects', shows: 'مسار كريات على لوحة نادي العلوم: خزّان لكل حرف ومحطات للضرب والتربيع والجمع وسلّة للنتيجة وسطر مكتوب تحت المسار' },
  // 3AM, unité 1, 2e leçon (2026-10-26) :
  //   roboticsClub  le نادي الروبوتيك : un tapis gradué posé au sol (la droite des nombres), le poteau 0 au milieu comme un petit portique-miroir, un
  //                 robot à roues et ses cartes de programme (`robot-track`)
  roboticsClub: { kind: 'objects', shows: 'نادي الروبوتيك: مسار مدرّج على الأرض وعمود الصفر في وسطه وروبوت صغير يتبع بطاقات برنامجه' },
  // 3AM, unité 1, 3e leçon (2026-10-26) :
  //   libraryLockers  le hall de la bibliothèque municipale : un mur de casiers numérotés, étagères de livres, une lampe et l'affiche « الكتاب صديق » ; le casier actif au premier plan
  //                   avec sa plaque de laiton (la règle), son cadenas à molettes de code et un petit écran vert qui multiplie ; une élève (KidFigure, hijab) au comptoir (`code-lockers`)
  libraryLockers: { kind: 'objects', shows: 'خزائن الأمانات في المكتبة البلدية: لكل خزانة قفل بعجلات رمز وشاشة صغيرة تضرب الرمز في عدد القفل' },
  // 3AM, unité 5 (2026-10-21) :
  //   stadium  le مضمار de la cour de l'école : un mur de graduations et deux coureurs (KidFigure, une élève en hijab et un élève), chacun
  //            à la valeur d'un membre d'une égalité ; ils se tiennent sur la même graduation tant que l'égalité est vraie (`equality-lanes`)
  stadium: { kind: 'objects', shows: 'مضمار مدرسة: متسابقان يقفان على جدار مدرّج، كلّ عند قيمة أحد طرفي مساواة' },
  // 3AM, unité 5, leçon « المتباينات والعمليات » (2026-10-26) :
  //   loom  l'atelier de tissage de Ghardaïa vu de face : un métier à tisser aux deux poutres de bois gravées de graduations, des fils de chaîne entre elles, deux fils de laine
  //         (rouge et bleu) à pompons, un tapis à demi tissé derrière, une élève (KidFigure, hijab) au métier (`loom-threads`)
  loom: { kind: 'objects', shows: 'ورشة نسيج في غرداية: نول بعارضتين مدرّجتين وخيوط صوف حمراء وزرقاء تنزل من العارضة العليا إلى السفلى' },
  // 3AM, unité 5, leçon « حصر عدد عشري موجب » (2026-10-26) :
  //   attar  le دكّان العطّار d'un souk : des étagères de bocaux d'épices, un sac de cumin avec sa louche de laiton, une balance numérique dont le grand écran à sept segments ARRONDIT la masse,
  //          un plateau où un cône d'épice grandit avec la masse, une bande de précision en dessous, une élève (KidFigure, hijab) au comptoir (`scoop-scale`)
  attar: { kind: 'objects', shows: 'دكّان عطّار: ميزان رقمي يدوِّر الكتلة على شاشته وكيس كمّون ومغرفة نحاسية وشريط دقّة' },
  // 3AM, unité 4 (2026-10-21) :
  //   schoolgarden  le jardin de l'école vu d'en haut : un terrain rectangulaire (pelouse, massif de fleurs, allée dallée) que la
  //                 main coupe en parcelles, et une jardinière (KidFigure, hijab) à son bord (`area-split`)
  schoolgarden: { kind: 'objects', shows: 'حديقة المدرسة من الأعلى: قطعة أرض مستطيلة (عشب وأزهار وممرّ مبلّط) تُقسَّم إلى أجزاء' },
  //   river  le fleuve de la « عبّارة الحدود » : deux rives (les deux membres d'une équation), des caisses (les termes), une barque ; une élève
  //          (KidFigure, hijab) est la passeuse (`term-ferry`, 3AM unité 5, 2026-10-21)
  river: { kind: 'objects', shows: 'نهر بين ضفتين: الضفة اليسرى والضفة اليمنى لمعادلة، وصناديق هي حدودها، وعبّارة تنقلها من ضفة إلى أخرى' },
  // 2AM, unité 5 (2026-10-21) :
  //   souk  le سوق الخضر de la semaine : un auvent à rayures, des cagettes (tomates, oranges, pommes de terre, dattes), une planche de prix
  //         en bois (le tableau 2×2), une balance de marchand en laiton, trois petites balances d'égalité alignées dessous, une jeune
  //         cliente (KidFigure, hijab) et son panier (`fourth-gauges`)
  souk: { kind: 'objects', shows: 'سوق الخضر: لوحة أسعار من خشب فيها أربع بطاقات (بطاقة ناقصة) وثلاث موازين صغيرة من النحاس تحتها وصناديق فاكهة' },
  // 3AM, unité 6 (2026-10-21) :
  //   pantry  le مخزن d'une جمعيّة خيريّة : un plateau de 100 cases égales sur une table, des sacs de tamr, un panier, une gardienne de stock (KidFigure,
  //           hijab) qui prépare les dons (`hundred-grid`)
  pantry: { kind: 'objects', shows: 'مخزن جمعية خيرية: صينية من مئة خانة متساوية وسلّة وأكياس تمر تُحضَّر للتبرّع' },
  //   stall  l'étal d'une papeterie de quartier : un repère quadrillé sur une planche de liège, des boîtes de punaises, une règle de laiton, une
  //          vendeuse (KidFigure, hijab) à côté du tableau de prix (`pin-rails`)
  stall: { kind: 'objects', shows: 'دكّان أدوات مدرسية: لوحة فلّين فيها معلم مربّعات ودبابيس ومسطرة من نحاس وبائعة بجانب جدول الأسعار' },
  // 3AM, unité 2 (2026-10-25) :
  //   bikestand  la cour de l'école et la درّاجة du نادي : un plateau et un pignon dessinés avec leur VRAI nombre de dents, une chaîne dont les maillons
  //              avancent dent par dent, une roue à valve colorée, une manivelle qu'on tourne, un drapeau craie à la distance voulue (à l'échelle) et une
  //              élève (KidFigure, hijab) qui l'attend (`gear-crank`)
  bikestand: { kind: 'objects', shows: 'درّاجة جبلية: دوّاسة وصحن أمامي وترس خلفي وسلسلة وعجلة' },
  // 3AM, unité 2, leçon 2 (2026-10-26) :
  //   paintshop  la machine à teinter d'un magasin de peinture de quartier : un bec de laiton au-dessus du seau B et une manette, le seau de référence A
  //              scellé avec son étiquette et sa pastille, deux grandes pastilles de couleur côte à côte et un mesureur à aiguille « أفتح · أغمق »,
  //              un élève (KidFigure) au rouleau devant l'esquisse de la fresque (`shade-match`)
  paintshop: { kind: 'objects', shows: 'آلة مزج الألوان في محلّ الطلاء: دلوان وعلب أبيض ورافعة للأزرق' },
  // 3AM, unité 2, leçon 3 (2026-10-26) :
  //   seedbed  un حوض غرس d'un jardin d'école de 1 m : une règle en bois le long du bord (0 … 1 m), des zones de cultures peintes à partir de la gauche
  //            (tomates, piments, oignons) avec leur pancarte, un râteau de jardin dont l'espacement des dents est la variable, des plants dans des cases
  //            de terre, un second حوض qui glisse dessous quand le total dépasse 1 m, une élève (KidFigure, hijab) à l'arrosoir (`seed-rake`)
  seedbed: { kind: 'lengths', shows: 'حوض غرس في حديقة المدرسة: مشط زراعي وشتلات ومسطرة متر' },
  // 3AM, unité 2, leçon 4 (2026-10-26) :
  //   clothesline  un حبل tendu entre deux poteaux peints dans la cour de l'école pour « يوم الرياضيات » : des étiquettes en bois aux entiers (côté négatif bleu avec « − », côté positif orange avec « + »),
  //                des pinces qui glissent, un panier de cartes d'écritures a/b au sol, une élève (KidFigure, hijab) près du panier (`number-line-pegs`)
  clothesline: { kind: 'objects', shows: 'حبل مشدود في ساحة المدرسة بين عمودين، عليه ملاقط وبطاقات أعداد' },
  // 3AM, unité 2, leçon 5 (2026-10-26) :
  //   arcade  une borne d'arcade du club de l'école : un tableau lumineux où les NOMBRES sont de grosses tuiles arrondies (fraction + barre signée, bleue vers la droite pour +, rouge vers la gauche pour −),
  //           des jetons d'opération, un aimant dessiné qui tient un × ou ÷ à ses voisines, des bulles translucides pour les parenthèses, trois pavés de signe, un garçon (KidFigure, sweat) aux commandes (`merge-board`)
  arcade: { kind: 'objects', shows: 'لوحة ألغاز في خزانة ألعاب بنادي المتوسطة: بلاطات أعداد ومغناطيس وفقاعات' },
  // 3AM, unité 4, leçon 4 (2026-10-26) :
  //   physicslab  la paillasse du labo de physique : une rail de verre graduée (zéro doré) avec deux perles de verre, un galvanomètre en laiton (cadran à zéro central, moitié gauche rouge, moitié droite verte)
  //               et deux fils à sondes, une rouge et une noire ; une élève (KidFigure, hijab) tient les fils (`difference-meter`)
  physicslab: { kind: 'objects', shows: 'سكّة زجاجية مدرّجة عليها حبّتان ومقياس بإبرة بمجسّين أحمر وأسود في مختبر الفيزياء' },
  // 3AM, unité 3, leçon 1 (2026-10-26) :
  //   science-lens  la table du club de sciences de la متوسطة : une grande lentille de laiton au bord relevé, une BAGUE de zoom crantée (44 px de prise), un cadre carré lumineux et le décor à son échelle (virus … orbite de la Lune),
  //                 sous la lentille une plaque de laiton « ضلع الإطار » qui lit le côté en décimal ; une élève (KidFigure, hijab) du club à côté (`ten-zoom`)
  'science-lens': { kind: 'objects', shows: 'عدسة نادي العلوم بحلقة تكبير مسنّنة وإطار مربّع تقرأ لوحة نحاسية ضلعه بالمتر' },
  // 3AM, unité 3, leçon 2 (2026-10-26) :
  //   tech-bench  l'établi du club de technologie : une longue règle de laiton gravée de colonnes égales, des plaques d'unités émaillées (km … nm) suspendues au-dessus, un cadran de mode (طول / مساحة / حجم),
  //               un ruban de mesure rouge à deux poignées de 44 px ; un élève (KidFigure) à l'établi (`unit-ladder`)
  'tech-bench': { kind: 'objects', shows: 'مسطرة نحاسية مقسّمة إلى أعمدة تتدلّى فوقها لوحات الوحدات وشريط قياس بمقبضين' },
  // 3AM, unité 3, leçon 3 (2026-10-26) :
  //   fair-wall  le couloir de la foire des sciences de la متوسطة : un grand mur peint portant un SLIDE de barreaux de bois (un par décade 10ⁿ → 10ⁿ⁺¹, neuf cases logarithmiques), des cartes d'objets avec leur longueur
  //              sur une étiquette, un aimant ; une élève (KidFigure, hijab) exposante à côté (`size-ladder`)
  'fair-wall': { kind: 'objects', shows: 'جدار معرض العلوم عليه سلّم من درجات خشبية وبطاقات أطوال ومغناطيس' },
});

export const VISUAL_THEME_IDS = Object.freeze(Object.keys(VISUAL_THEMES));

/**
 * La traçabilité d'une expérience (§33 du brief) :
 *
 *   {
 *     source:     { type: 'textbook', elementId: 'act-1', page: 8 },
 *     experience: { type: 'platform_context', reason: '…', theme: 'football' },
 *   }
 *
 * `source` dit d'où vient la MATHÉMATIQUE — elle vient toujours du manuel.
 * `experience` dit ce que la plateforme a fait de la SITUATION.
 */
export function manipulationExperience({ sourceElementId, page, type, reason, theme }) {
  return Object.freeze({
    source: Object.freeze({ type: 'textbook', elementId: sourceElementId, ...(page != null ? { page } : {}) }),
    experience: Object.freeze({ type, ...(reason ? { reason } : {}), ...(theme ? { theme } : {}) }),
  });
}

/**
 * Vérifie une expérience. Retourne un tableau de problèmes (vide = conforme).
 * Appelé par `validate-lessons.mjs` et par les tests des leçons.
 */
export function checkExperience(exp, { where = 'experience' } = {}) {
  const problems = [];
  if (!exp || typeof exp !== 'object') return [`${where}: missing experience object`];
  const { source, experience } = exp;
  if (!source || source.type !== 'textbook' || typeof source.elementId !== 'string' || source.elementId === '') {
    problems.push(`${where}: source must cite a textbook elementId — the mathematics always comes from the textbook`);
  }
  if (!experience || !EXPERIENCE_TYPES.includes(experience.type)) {
    problems.push(`${where}: experience.type must be one of ${EXPERIENCE_TYPES.join('/')}`);
  } else if (experience.type !== 'textbook') {
    // Un contexte remplacé DOIT dire pourquoi : c'est la règle « jamais
    // silencieusement » (§33). Une adaptation sans raison est un défaut.
    if (!ADAPTATION_REASONS.includes(experience.reason)) {
      problems.push(`${where}: an adapted context must carry one of these reasons: ${ADAPTATION_REASONS.join('/')}`);
    }
    if (experience.theme !== undefined && !VISUAL_THEME_IDS.includes(experience.theme)) {
      problems.push(`${where}: unknown visual theme '${experience.theme}'`);
    }
  }
  return problems;
}

/**
 * Vérifie un couple de niveaux. Ce que la forme GARANTIT, et que les tests
 * verrouillent :
 *
 *   1. les deux niveaux existent — jamais un seul (§3 du brief) ;
 *   2. chacun cite sa source du manuel et déclare son expérience ;
 *   3. chacun porte son objectif mathématique, et les DEUX objectifs sont
 *      le même — c'est la définition de « même concept, deux expériences » ;
 *   4. `advanced` n'est pas « beginner avec de plus grands nombres » : il
 *      doit déclarer ce qu'il retire comme étayage ou ce qu'il ajoute comme
 *      exigence (`autonomy`), sans quoi ce n'est pas un second niveau.
 */
export function checkLevelPair(pair, { where = 'levels' } = {}) {
  const problems = [];
  if (!pair || typeof pair !== 'object') return [`${where}: missing level pair`];
  for (const id of MANIPULATION_LEVEL_IDS) {
    const lvl = pair[id];
    if (!lvl || typeof lvl !== 'object') { problems.push(`${where}: missing '${id}' level`); continue; }
    if (typeof lvl.objective !== 'string' || lvl.objective === '') {
      problems.push(`${where}.${id}: objective must be a non-empty string (the mathematical objective, identical at both levels)`);
    }
    if (!lvl.numbers || typeof lvl.numbers !== 'object') {
      problems.push(`${where}.${id}: numbers must be an object`);
    }
    problems.push(...checkExperience(lvl, { where: `${where}.${id}` }));
  }
  const b = pair.beginner; const a = pair.advanced;
  if (b?.objective && a?.objective && b.objective !== a.objective) {
    problems.push(`${where}: both levels must serve the SAME mathematical objective — the context may change, the objective may not`);
  }
  if (a && (typeof a.autonomy !== 'string' || a.autonomy === '')) {
    problems.push(`${where}.advanced: must declare its 'autonomy' — what scaffolding it removes or what it demands more of. 'Beginner with bigger numbers' is not an advanced level.`);
  }
  return problems;
}

/** Le niveau demandé, borné — un id inconnu retombe sur `beginner`, jamais sur rien. */
export function resolveLevelId(id) {
  return MANIPULATION_LEVEL_IDS.includes(id) ? id : DEFAULT_MANIPULATION_LEVEL;
}
