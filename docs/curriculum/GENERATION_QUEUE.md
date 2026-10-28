# File de génération des leçons 1AM–3AM

> **Généré** par `scripts/learning-net-queue.mjs` depuis le réseau des الكفاءات — ne pas éditer à la main.
> Priorité (propriétaire, 2026-10-25) — **Phase 0** : les leçons restantes des unités 3AM 1–5, plans par leçon dans
> `docs/curriculum/PLAN_3AM_UNITS_1_5.md`.
> Règle (propriétaire, 2026-10-20) — **Phase A d’abord** : ce dont l’élève de 4AM a besoin MAINTENANT. Les unités 4AM dans
> l’ordre du manuel ; pour chaque leçon, ses prérequis DIRECTS des années antérieures, pris dans l’année la plus récente
> (3AM, sinon 2AM, sinon 1AM). Ensuite (règle du 2026-10-13) : les chaînes complètes des leçons 4AM, de la plus ancienne
> à la plus récente ; puis depuis les leçons 3AM restantes, 2AM, 1AM ; les leçons isolées en dernier ; chaque synthèse
> juste après la dernière leçon de son unité. Contrat : `docs/architecture/LEARNING_NET.md` §4bis.

**156** leçons à générer (34 synthèses).

## Phase A — ce dont la 4AM a besoin maintenant, unité par unité (23)

### Unité 4AM 1 — الأعداد الطبيعيّة والأعداد النّاطقة (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 2 — الحساب على الجذور (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 3 — الحساب الحرفي (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 4 — معادلات ومتراجحات من الدرجة الأولى بمجهول واحد (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 5 — جمل معادلتين من الدرجة الأولى بمجهولين (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 6 — الدالة الخطية والتناسبية (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 1 | `haraka-muntazama-sura` — الحركة المنتظمة والسرعة المتوسطة | السنة الثالثة متوسط | `tanasubiya-sura` | `tatbiqat-tanasub` |
| 2 | `wadiya-idmajiya-tanasubiya-sura` — أدمج تعلّماتي — التناسبية _(synthèse)_ | السنة الثالثة متوسط | `tanasubiya-sura` | unité tanasubiya-sura complète |

### Unité 4AM 7 — الدالة التآلفية (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 8 — الإحصاء (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 3 | `fiat-takrarat` — تجميع المعطيات في فئات والتكرارات | السنة الثالثة متوسط | `tanzim-mutaayat` | `takrar-mujamma` |
| 4 | `mutawassit-mutawazin` — متوسط سلسلة إحصائية والمتوسط المتوازن | السنة الثالثة متوسط | `tanzim-mutaayat` | `mada-wasit-mutawassit` |

### Unité 4AM 9 — خاصية طالس (1)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 5 | `tanasub-atwal-muthallath` — تناسبية الأطوال في المثلث | السنة الثالثة متوسط | `muthallathat-3am` | `talis-hisab-atwal` |

### Unité 4AM 10 — حساب المثلثات في المثلث القائم (3)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 6 | `jayb-tamam-zawiya` — جيب تمام زاوية حادة | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | `nisab-muthallathiya` |
| 7 | `hisab-jayb-tamam` — حساب جيب التمام وتوظيفه | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | `hasiba-muthallathiya` |
| 8 | `mustaqimat-mutaamida-mutawazia` — إنشاء مستقيمات متعامدة ومتوازية | السنة الثانية متوسط | `inshaat-handasiya` | `alaqat-muthallathiya` |

### Unité 4AM 11 — الأشعة والانسحاب (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 9 | `suwar-ashkal-insihab` — صور الأشكال بانسحاب وخواصه | السنة الثالثة متوسط | `insihab-3am` | `insihab-shuaa` |
| 10 | `tarif-mutawazi-adla` — التعرّف على متوازي الأضلاع | السنة الثانية متوسط | `mutawazi-adla` | `shuaayn-mutasawiyayn` |

### Unité 4AM 12 — الأشعة في معلم (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 11 | `talim-nuqta-mustawi` — تعليم نقطة في المستوي | السنة الثانية متوسط | `adad-nisbiya-2` | `murakkibata-shuaa` |
| 12 | `masafa-nuqtatayn` — المسافة بين نقطتين على مستقيم مدرّج | السنة الثانية متوسط | `adad-nisbiya-2` | `hisab-murakkibatay` |

### Unité 4AM 13 — الدوران - الزوايا - المضلّعات المنتظمة (4)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 13 | `qays-zawiya-minqala` — قيس زاوية بالمنقلة ورسم زاوية علم قيسها | السنة الأولى متوسط | `zawaya-qiyas` | `mafhum-dawaran` |
| 14 | `daira-mustalahat` — الدائرة: تسميات وتعاريف | السنة الأولى متوسط | `ashkal-mustawiya` | `zawiya-muhitiya` |
| 15 | `mudallaat-zawiya` — المضلّعات والزاوية | السنة الأولى متوسط | `ashkal-mustawiya` | `zawiya-muhitiya` |
| 16 | `majmu-zawaya-muthallath` — مجموع أقياس زوايا مثلث | السنة الثانية متوسط | `muthallath-daira` | `zawiya-muhitiya` |

### Unité 4AM 14 — الهندسة في الفضاء (7)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 17 | `manzur-mutasawi-qiyas` — التمثيل بالمنظور متساوي القياس | السنة الأولى متوسط | `mutawazi-mustatilat` | `kura-julla` |
| 18 | `ustuwana-dawaran-wasf` — أسطوانة الدوران: الوصف والتصميم والمساحة الجانبية | السنة الثانية متوسط | `mawshur-ustuwana` | `kura-julla` |
| 19 | `masahat-qurs` — مساحة القرص | السنة الثانية متوسط | `muthallath-daira` | `misaha-hajm-kura` |
| 20 | `mawshur-qaim-wasf` — الموشور القائم: الوصف والتصميم والمساحة الجانبية | السنة الثانية متوسط | `mawshur-ustuwana` | `maqati-mustawiya` |
| 21 | `wasf-tamthil-haram` — وصف الهرم وتمثيله وتصميمه | السنة الثالثة متوسط | `haram-makhrut` | `maqati-mustawiya` |
| 22 | `miqyas-kharita-mukhattat` — المقياس: الخرائط والمخططات | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `takbir-tasghir` |
| 23 | `hajm-haram` — حجم الهرم | السنة الثالثة متوسط | `haram-makhrut` | `takbir-tasghir` |

## Phase B — les chaînes complètes des leçons 4AM (58)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 24 | `mustatil-murabba-masaha` — محيط ومساحة المستطيل والمربع | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `jidhr-tarbii` |
| 25 | `adad-ashri-mustaqim-mudarraj` — الأعداد العشرية ونصف المستقيم المدرّج | السنة الأولى متوسط | `adad-tabiiya-ashriya` | `jidhr-tarbii` |
| 26 | `talim-mustaqim-mudarraj` — التعليم على مستقيم مدرّج | السنة الأولى متوسط | `adad-nisbiya` | `jidhr-tarbii` |
| 27 | `adad-nisbiya-siyaqat` — الأعداد النسبية وسياقات استعمالها | السنة الأولى متوسط | `adad-nisbiya` | `jidhr-tarbii` |
| 28 | `talim-mustaqim-mudarraj-2` — التعليم على مستقيم مدرّج | السنة الثانية متوسط | `adad-nisbiya-2` | `jidhr-tarbii` |
| 29 | `jam-tarh-nisbiya` — جمع وطرح عددين نسبيين | السنة الثانية متوسط | `adad-nisbiya-2` | `jidhr-tarbii` |
| 30 | `silsila-bi-aqwas` — سلسلة عمليات تتضمّن أقواسا | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `amaliyat-judhur` |
| 31 | `silsila-bidun-aqwas` — سلسلة عمليات دون أقواس وأولوية العمليات | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `amaliyat-judhur` |
| 32 | `tawzi-darb-jam-tarh` — توزيع الضرب على الجمع والطرح | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `amaliyat-judhur` |
| 33 | `jida-kasrayn` — جداء كسرين | السنة الثانية متوسط | `kusur-amaliyat` | `amaliyat-judhur` |
| 34 | `muqarana-kasrayn` — مقارنة كسرين | السنة الثانية متوسط | `kusur-amaliyat` | `amaliyat-judhur` |
| 35 | `jam-tarh-kusur` — جمع وطرح كسرين | السنة الثانية متوسط | `kusur-amaliyat` | `amaliyat-judhur` |
| 36 | `tatbiq-qaida-harfiya` — تطبيق قاعدة حرفية | السنة الأولى متوسط | `ibarat-harfiya` | `muadala-ula` |
| 37 | `bahth-adad-naqisa` — البحث عن أعداد ناقصة | السنة الأولى متوسط | `ibarat-harfiya` | `muadala-ula` |
| 38 | `majmu-jabri` — حساب مجموع جبري | السنة الثانية متوسط | `adad-nisbiya-2` | `muadala-ula` |
| 39 | `wadiya-idmajiya-adad-nisbiya-2` — أدمج تعلّماتي — الأعداد النسبية _(synthèse)_ | السنة الثانية متوسط | `adad-nisbiya-2` | unité adad-nisbiya-2 complète |
| 40 | `hall-mushkil-muadala` — حلّ مشكل باستعمال معادلة | السنة الثانية متوسط | `mafhum-muadala` | `muadala-ula` |
| 41 | `ikhtibar-musawat-mutabayina` — اختبار صحة مساواة أو متباينة | السنة الثانية متوسط | `mafhum-muadala` | `muadala-ula` |
| 42 | `talim-fi-mustawi` — التعليم في المستوي | السنة الأولى متوسط | `adad-nisbiya` | `tanasub-muamil` |
| 43 | `wadiya-idmajiya-adad-nisbiya` — أدمج تعلّماتي — الأعداد النسبية _(synthèse)_ | السنة الأولى متوسط | `adad-nisbiya` | unité adad-nisbiya complète |
| 44 | `wadiyat-tanasubiya` — وضعيات تناسبية وجداول تناسبية | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `tanasub-muamil` |
| 45 | `itmam-jadwal-tanasubiya` — إتمام جدول تناسبية | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `tanasub-muamil` |
| 46 | `wadiya-tanasubiya-jadwal` — التعرّف على وضعية تناسبية من جدول | السنة الثانية متوسط | `tanasubiya-2am` | `tanasub-muamil` |
| 47 | `nisba-miawiya-tatbiq` — تطبيق نسبة مئوية | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `tatbiqat-tanasub` |
| 48 | `wahdat-tul-masaha` — وحدات الطول ووحدات المساحة | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `tatbiqat-tanasub` |
| 49 | `nisba-miawiya` — حساب نسبة مئوية وتوظيفها | السنة الثانية متوسط | `tanasubiya-2am` | `tatbiqat-tanasub` |
| 50 | `miqyas-kharita` — مقياس خريطة أو تصميم | السنة الثانية متوسط | `tanasubiya-2am` | `tatbiqat-tanasub` |
| 51 | `wadiya-idmajiya-tanasubiya-2am` — أدمج تعلّماتي — التناسبية _(synthèse)_ | السنة الثانية متوسط | `tanasubiya-2am` | unité tanasubiya-2am complète |
| 52 | `tanzim-muatayat-jadwal` — تنظيم معطيات في جدول | السنة الأولى متوسط | `tanzim-muatayat` | `takrar-mujamma` |
| 53 | `qiraat-jadwal-malumat` — قراءة جدول واستخراج معلومات | السنة الأولى متوسط | `tanzim-muatayat` | `takrar-mujamma` |
| 54 | `takrarat-nisbiya` — التكرارات والتكرارات النسبية | السنة الثانية متوسط | `tanzim-mutayat-2am` | `takrar-mujamma` |
| 55 | `mustaqim-qita-istiqamiya` — المستقيم ونصف المستقيم وقطعة المستقيم والاستقامية | السنة الأولى متوسط | `tawazi-taamud` | `majdulat-ihsaiya` |
| 56 | `tasnif-zawaya-munassif` — مقارنة الزوايا وتصنيفها ومنصّف زاوية | السنة الأولى متوسط | `zawaya-qiyas` | `majdulat-ihsaiya` |
| 57 | `tamthil-mukhattatat` — تمثيل معطيات إحصائية بمخطّطات | السنة الثانية متوسط | `tanzim-mutayat-2am` | `majdulat-ihsaiya` |
| 58 | `tanzim-fiat` — تلخيص سلسلة إحصائية في شكل فئات | السنة الثانية متوسط | `tanzim-mutayat-2am` | `majdulat-ihsaiya` |
| 59 | `tamthil-silsila-ihsaiya` — تمثيل سلسلة إحصائية بمخطط أو بيان | السنة الثالثة متوسط | `tanzim-mutaayat` | `majdulat-ihsaiya` |
| 60 | `wadiya-idmajiya-tanzim-mutaayat` — أدمج تعلّماتي — تنظيم معطيات _(synthèse)_ | السنة الثالثة متوسط | `tanzim-mutaayat` | unité tanzim-mutaayat complète |
| 61 | `mustaqimat-mutaamida` — المستقيمان المتقاطعان والمتعامدان | السنة الأولى متوسط | `tawazi-taamud` | `talis-hisab-atwal` |
| 62 | `ashkal-mutanazira` — الأشكال المتناظرة بالنسبة إلى مستقيم | السنة الأولى متوسط | `tanazur-mihwari` | `talis-hisab-atwal` |
| 63 | `nazir-shakl-khawas` — نظير شكل وخواص التناظر المحوري | السنة الأولى متوسط | `tanazur-mihwari` | `talis-hisab-atwal` |
| 64 | `markaz-tanazur-shakl` — مركز تناظر شكل | السنة الثانية متوسط | `tanazur-markazi` | `talis-hisab-atwal` |
| 65 | `nazir-shakl-khawas-2` — نظير شكل وخواص التناظر المركزي | السنة الثانية متوسط | `tanazur-markazi` | `talis-hisab-atwal` |
| 66 | `nazirat-nuqta` — التناظر المركزي ونظيرة نقطة | السنة الثانية متوسط | `tanazur-markazi` | `talis-hisab-atwal` |
| 67 | `wadiya-idmajiya-tanazur-markazi` — أدمج تعلّماتي — التناظر المركزي _(synthèse)_ | السنة الثانية متوسط | `tanazur-markazi` | unité tanazur-markazi complète |
| 68 | `zawaya-mutajawira-mutatamma` — زاويتان متجاورتان، متتامتان، متكاملتان | السنة الثانية متوسط | `zawaya-tawazi` | `talis-hisab-atwal` |
| 69 | `tawazi-zawaya` — التوازي والزوايا | السنة الثانية متوسط | `zawaya-tawazi` | `talis-hisab-atwal` |
| 70 | `mustaqim-muntasafayn` — مستقيم المنتصفين في مثلث | السنة الثالثة متوسط | `muthallathat-3am` | `talis-hisab-atwal` |
| 71 | `naql-tul-muntasaf` — نقل طول ومنتصف قطعة مستقيم | السنة الأولى متوسط | `tawazi-taamud` | `alaqat-muthallathiya` |
| 72 | `tarif-insihab` — الانسحاب ومتوازي الأضلاع | السنة الثالثة متوسط | `insihab-3am` | `insihab-shuaa` |
| 73 | `sura-nuqta-insihab` — إنشاء صورة نقطة بانسحاب | السنة الثالثة متوسط | `insihab-3am` | `insihab-shuaa` |
| 74 | `wadiya-idmajiya-insihab-3am` — أدمج تعلّماتي — الانسحاب _(synthèse)_ | السنة الثالثة متوسط | `insihab-3am` | unité insihab-3am complète |
| 75 | `wasf-mutawazi-mustatilat` — وصف متوازي المستطيلات والمكعب | السنة الأولى متوسط | `mutawazi-mustatilat` | `kura-julla` |
| 76 | `muhit-qurs` — محيط القرص والعدد π | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `misaha-hajm-kura` |
| 77 | `masahat-muthallath-qaim` — مساحة المثلث القائم | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `takbir-tasghir` |
| 78 | `wadiya-idmajiya-sutuh-masahat-muhitat` — أدمج تعلّماتي — السطوح المستوية: الأطوال، المحيطات، المساحات _(synthèse)_ | السنة الأولى متوسط | `sutuh-masahat-muhitat` | unité sutuh-masahat-muhitat complète |
| 79 | `hajm-mutawazi-mustatilat` — حجم متوازي المستطيلات ووحدات الحجوم | السنة الأولى متوسط | `mutawazi-mustatilat` | `takbir-tasghir` |
| 80 | `masahat-muthallath` — مساحة المثلث | السنة الثانية متوسط | `muthallath-daira` | `takbir-tasghir` |
| 81 | `hajm-mawshur-qaim` — حجم الموشور القائم | السنة الثانية متوسط | `mawshur-ustuwana` | `takbir-tasghir` |

## Phase C — depuis les leçons 3AM restantes (22)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 82 | `rutbat-miqdar-jam` — رتبة مقدار مجموع وفرق | السنة الأولى متوسط | `jam-tarh-ashriya` | `kitaba-ilmiya-rutba` |
| 83 | `hasr-qiyam-muqarraba` — حصر عدد عشري وقيمه المقرّبة | السنة الأولى متوسط | `adad-tabiiya-ashriya` | `hasr-adad-ushri` |
| 84 | `wadiya-idmajiya-adad-tabiiya-ashriya` — أدمج تعلّماتي — الأعداد الطبيعية والأعداد العشرية _(synthèse)_ | السنة الأولى متوسط | `adad-tabiiya-ashriya` | unité adad-tabiiya-ashriya complète |
| 85 | `insha-muthallath-mutabayina` — المتباينة المثلثية وإنشاء مثلثات | السنة الثانية متوسط | `muthallath-daira` | `taqayus-muthallathat` |
| 86 | `taqayus-muthallathat` — المثلثات المتقايسة | السنة الثالثة متوسط | `muthallathat-3am` | `taqayus-muthallathat` |
| 87 | `daira-muhita-muthallath` — الدائرة المحيطة بمثلث | السنة الثانية متوسط | `muthallath-daira` | `mahawir-munassifat` |
| 88 | `wadiya-idmajiya-muthallath-daira` — أدمج تعلّماتي — المثلث والدائرة _(synthèse)_ | السنة الثانية متوسط | `muthallath-daira` | unité muthallath-daira complète |
| 89 | `mahawir-munassifat` — بعد نقطة عن مستقيم، المحاور والمنصفات | السنة الثالثة متوسط | `muthallathat-3am` | `mahawir-munassifat` |
| 90 | `mutawassitat-irtifaat` — المتوسطات والارتفاعات في المثلث | السنة الثالثة متوسط | `muthallathat-3am` | `mutawassitat-irtifaat` |
| 91 | `mahawir-tanazur-ashkal` — محاور تناظر الأشكال المألوفة | السنة الأولى متوسط | `tanazur-mihwari` | `daira-muhita-qaim` |
| 92 | `mutawaziyat-adla-khassa` — متوازيات الأضلاع الخاصة | السنة الثانية متوسط | `mutawazi-adla` | `daira-muhita-qaim` |
| 93 | `daira-muhita-qaim` — الدائرة المحيطة بالمثلث القائم | السنة الثالثة متوسط | `muthallath-qaim-daira` | `daira-muhita-qaim` |
| 94 | `awda-daira-mustaqim` — الأوضاع النسبية لدائرة ومستقيم | السنة الثالثة متوسط | `muthallath-qaim-daira` | `awda-daira-mustaqim` |
| 95 | `mumass-daira` — مماس دائرة في نقطة منها | السنة الثالثة متوسط | `muthallath-qaim-daira` | `mumass-daira` |
| 96 | `wadiya-idmajiya-muthallath-qaim-daira` — أدمج تعلّماتي — المثلث القائم والدائرة _(synthèse)_ | السنة الثالثة متوسط | `muthallath-qaim-daira` | unité muthallath-qaim-daira complète |
| 97 | `aksiya-fitaghuras` — الخاصية العكسية لفيثاغورس | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | `aksiya-fitaghuras` |
| 98 | `wadiya-idmajiya-fitaghuras-jayb-tamam` — أدمج تعلّماتي — خاصية فيثاغورس، جيب تمام زاوية _(synthèse)_ | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | unité fitaghuras-jayb-tamam complète |
| 99 | `tasmim-mutawazi-mustatilat` — تصميم متوازي المستطيلات وصنعه | السنة الأولى متوسط | `mutawazi-mustatilat` | `wasf-tamthil-haram` |
| 100 | `wadiya-idmajiya-mutawazi-mustatilat` — أدمج تعلّماتي — متوازي المستطيلات والمكعب _(synthèse)_ | السنة الأولى متوسط | `mutawazi-mustatilat` | unité mutawazi-mustatilat complète |
| 101 | `wasf-tamthil-makhrut` — وصف مخروط الدوران وتمثيله وتصميمه | السنة الثالثة متوسط | `haram-makhrut` | `wasf-tamthil-makhrut` |
| 102 | `hajm-makhrut` — حجم مخروط الدوران | السنة الثالثة متوسط | `haram-makhrut` | `hajm-makhrut` |
| 103 | `wadiya-idmajiya-haram-makhrut` — أدمج تعلّماتي — الهرم و مخروط الدوران _(synthèse)_ | السنة الثالثة متوسط | `haram-makhrut` | unité haram-makhrut complète |

## Phase D — depuis les leçons 2AM restantes (22)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 104 | `wasf-silsila-hisab` — وصف سلسلة حسابات | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `wasf-silsila-hisab` |
| 105 | `wadiya-idmajiya-amaliyat-tabiiya-ushriya` — أدمج تعلّماتي — العمليات على الأعداد الطبيعية والأعداد العشرية _(synthèse)_ | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | unité amaliyat-tabiiya-ushriya complète |
| 106 | `qisma-ashriya-taqrib` — القسمة العشرية والقيمة المقرّبة لحاصل قسمة | السنة الأولى متوسط | `darb-qisma-ashriya` | `qisma-iqlidiya-hasr` |
| 107 | `kasr-hasil-qisma` — الكسر: نسبة وحاصل قسمة وقيم مقرّبة | السنة الثانية متوسط | `kusur-amaliyat` | `kasr-hasil-qisma` |
| 108 | `wadiya-idmajiya-kusur-amaliyat` — أدمج تعلّماتي — الكسور والعمليات عليها _(synthèse)_ | السنة الثانية متوسط | `kusur-amaliyat` | unité kusur-amaliyat complète |
| 109 | `qiraat-mutayat-ihsaiya` — قراءة معطيات إحصائية وتفسيرها | السنة الثانية متوسط | `tanzim-mutayat-2am` | `qiraat-mutayat-ihsaiya` |
| 110 | `wadiya-idmajiya-tanzim-mutayat-2am` — أدمج تعلّماتي — تنظيم معطيات _(synthèse)_ | السنة الثانية متوسط | `tanzim-mutayat-2am` | unité tanzim-mutayat-2am complète |
| 111 | `mihwar-qita-insha` — إنشاء محور قطعة مستقيم | السنة الثانية متوسط | `inshaat-handasiya` | `mihwar-qita-insha` |
| 112 | `munassif-zawiya-insha` — إنشاء منصّف زاوية | السنة الثانية متوسط | `inshaat-handasiya` | `munassif-zawiya-insha` |
| 113 | `muthallathat-khassa-insha` — إنشاء مثلثات خاصة | السنة الثانية متوسط | `inshaat-handasiya` | `muthallathat-khassa-insha` |
| 114 | `rubaiyat-khassa-insha` — إنشاء مستطيل، مربع، معيّن | السنة الثانية متوسط | `inshaat-handasiya` | `rubaiyat-khassa-insha` |
| 115 | `daira-qaws-insha` — إنشاء دائرة وقوس دائرة | السنة الثانية متوسط | `inshaat-handasiya` | `daira-qaws-insha` |
| 116 | `wadiya-idmajiya-inshaat-handasiya` — أدمج تعلّماتي — إنشاء أشكال هندسية بسيطة _(synthèse)_ | السنة الثانية متوسط | `inshaat-handasiya` | unité inshaat-handasiya complète |
| 117 | `zawaya-mutaqabila-ras` — الزاويتان المتقابلتان بالرأس | السنة الثانية متوسط | `zawaya-tawazi` | `zawaya-mutaqabila-ras` |
| 118 | `zawaya-mutabadila-mutamathila` — الزاويتان المتبادلتان داخليا والمتماثلتان | السنة الثانية متوسط | `zawaya-tawazi` | `zawaya-mutabadila-mutamathila` |
| 119 | `wadiya-idmajiya-zawaya-tawazi` — أدمج تعلّماتي — الزوايا والتوازي _(synthèse)_ | السنة الثانية متوسط | `zawaya-tawazi` | unité zawaya-tawazi complète |
| 120 | `khawas-mutawazi-adla` — خواص متوازي الأضلاع | السنة الثانية متوسط | `mutawazi-adla` | `khawas-mutawazi-adla` |
| 121 | `masahat-mutawazi-adla` — مساحة متوازي الأضلاع | السنة الثانية متوسط | `mutawazi-adla` | `masahat-mutawazi-adla` |
| 122 | `wadiya-idmajiya-mutawazi-adla` — أدمج تعلّماتي — متوازي الأضلاع _(synthèse)_ | السنة الثانية متوسط | `mutawazi-adla` | unité mutawazi-adla complète |
| 123 | `mutawazi-mustatilat-hajm-saa` — متوازي المستطيلات: التمثيل والتصميم والحجم والسعة | السنة الثانية متوسط | `mawshur-ustuwana` | `mutawazi-mustatilat-hajm-saa` |
| 124 | `hajm-ustuwana-dawaran` — حجم أسطوانة الدوران | السنة الثانية متوسط | `mawshur-ustuwana` | `hajm-ustuwana-dawaran` |
| 125 | `wadiya-idmajiya-mawshur-ustuwana` — أدمج تعلّماتي — الموشور القائم وأسطوانة الدوران _(synthèse)_ | السنة الثانية متوسط | `mawshur-ustuwana` | unité mawshur-ustuwana complète |

## Phase E — leçons 1AM restantes (23)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 126 | `injaz-jam-tarh-mudad` — إنجاز عمليات الجمع والطرح والحساب على المدد | السنة الأولى متوسط | `jam-tarh-ashriya` | `injaz-jam-tarh-mudad` |
| 127 | `wadiya-idmajiya-jam-tarh-ashriya` — أدمج تعلّماتي — الحساب على الأعداد الطبيعية والأعداد العشرية: الجمع والطرح _(synthèse)_ | السنة الأولى متوسط | `jam-tarh-ashriya` | unité jam-tarh-ashriya complète |
| 128 | `darb-adad-ashriya` — ضرب الأعداد العشرية | السنة الأولى متوسط | `darb-qisma-ashriya` | `darb-adad-ashriya` |
| 129 | `wadiya-idmajiya-darb-qisma-ashriya` — أدمج تعلّماتي — الحساب على الأعداد الطبيعية والأعداد العشرية: الضرب والقسمة _(synthèse)_ | السنة الأولى متوسط | `darb-qisma-ashriya` | unité darb-qisma-ashriya complète |
| 130 | `hasil-qisma-mustaqim` — حاصل القسمة على نصف مستقيم مدرّج | السنة الأولى متوسط | `kitabat-kasriya` | `hasil-qisma-mustaqim` |
| 131 | `akhdh-kasr-min-adad` — أخذ كسر من عدد | السنة الأولى متوسط | `kitabat-kasriya` | `akhdh-kasr-min-adad` |
| 132 | `wadiya-idmajiya-kitabat-kasriya` — أدمج تعلّماتي — الكتابات الكسرية _(synthèse)_ | السنة الأولى متوسط | `kitabat-kasriya` | unité kitabat-kasriya complète |
| 133 | `intaj-ibara-harfiya` — إنتاج عبارات حرفية | السنة الأولى متوسط | `ibarat-harfiya` | `intaj-ibara-harfiya` |
| 134 | `wadiya-idmajiya-ibarat-harfiya` — أدمج تعلّماتي — الحساب الحرفي _(synthèse)_ | السنة الأولى متوسط | `ibarat-harfiya` | unité ibarat-harfiya complète |
| 135 | `muqaranat-hisas` — مقارنة حصص | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `muqaranat-hisas` |
| 136 | `wadiya-idmajiya-tanasubiya-nisab-maqayis` — أدمج تعلّماتي — التناسبية _(synthèse)_ | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | unité tanasubiya-nisab-maqayis complète |
| 137 | `mukhattat-bil-amida` — تمثيل معطيات بمخطط بالأعمدة | السنة الأولى متوسط | `tanzim-muatayat` | `mukhattat-bil-amida` |
| 138 | `tamthil-bayani-dairi` — التمثيل البياني والمخطط الدائري | السنة الأولى متوسط | `tanzim-muatayat` | `tamthil-bayani-dairi` |
| 139 | `wadiya-idmajiya-tanzim-muatayat` — أدمج تعلّماتي — تنظيم معطيات _(synthèse)_ | السنة الأولى متوسط | `tanzim-muatayat` | unité tanzim-muatayat complète |
| 140 | `mustaqimat-mutawaziya` — المستقيمان المتوازيان | السنة الأولى متوسط | `tawazi-taamud` | `mustaqimat-mutawaziya` |
| 141 | `wadiya-idmajiya-tawazi-taamud` — أدمج تعلّماتي — التوازي والتعامد _(synthèse)_ | السنة الأولى متوسط | `tawazi-taamud` | unité tawazi-taamud complète |
| 142 | `muthallathat-khassa` — المثلثات الخاصة | السنة الأولى متوسط | `ashkal-mustawiya` | `muthallathat-khassa` |
| 143 | `rubaiyat-khassa` — الرباعيات الخاصة | السنة الأولى متوسط | `ashkal-mustawiya` | `rubaiyat-khassa` |
| 144 | `wadiya-idmajiya-ashkal-mustawiya` — أدمج تعلّماتي — الأشكال المستوية _(synthèse)_ | السنة الأولى متوسط | `ashkal-mustawiya` | unité ashkal-mustawiya complète |
| 145 | `mafhum-zawiya-tasmiya` — مفهوم الزاوية وتسميتها | السنة الأولى متوسط | `zawaya-qiyas` | `mafhum-zawiya-tasmiya` |
| 146 | `wadiya-idmajiya-zawaya-qiyas` — أدمج تعلّماتي — الزوايا _(synthèse)_ | السنة الأولى متوسط | `zawaya-qiyas` | unité zawaya-qiyas complète |
| 147 | `mihwar-qita-mustaqim` — محور قطعة مستقيم | السنة الأولى متوسط | `tanazur-mihwari` | `mihwar-qita-mustaqim` |
| 148 | `wadiya-idmajiya-tanazur-mihwari` — أدمج تعلّماتي — التناظر المحوري _(synthèse)_ | السنة الأولى متوسط | `tanazur-mihwari` | unité tanazur-mihwari complète |

## Phase F — leçons isolées (8)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 149 | `ibara-harfiya-intaj` — إنتاج عبارة حرفية واستعمالها | السنة الثانية متوسط | `mafhum-muadala` | isolée |
| 150 | `wadiya-idmajiya-mafhum-muadala` — أدمج تعلّماتي — مفهوم معادلة _(synthèse)_ | السنة الثانية متوسط | `mafhum-muadala` | unité mafhum-muadala complète |
| 151 | `qawaid-niqash-mithal-mudad` — قواعد النقاش الرياضي والمثال المضاد | السنة الثالثة متوسط | `burhan-riyadi` | isolée |
| 152 | `nusus-idha-fa-in` — النصوص «إذا … فإنّ …» والنص العكسي | السنة الثالثة متوسط | `burhan-riyadi` | isolée |
| 153 | `burhan-handasi` — البحث عن برهان في الهندسة وتحريره | السنة الثالثة متوسط | `burhan-riyadi` | isolée |
| 154 | `wadiya-idmajiya-burhan-riyadi` — أدمج تعلّماتي — البرهان في الرياضيات _(synthèse)_ | السنة الثالثة متوسط | `burhan-riyadi` | unité burhan-riyadi complète |
| 155 | `mutabayina-muthallathiya` — المتباينة المثلثية وإنشاء مثلث | السنة الثالثة متوسط | `muthallathat-3am` | isolée |
| 156 | `wadiya-idmajiya-muthallathat-3am` — أدمج تعلّماتي — المثلثات _(synthèse)_ | السنة الثالثة متوسط | `muthallathat-3am` | unité muthallathat-3am complète |

## Renvois en avant dans une même année (17)

La leçon de droite suppose un item que le manuel n’enseigne que PLUS LOIN : elle le rappelle elle-même (encadré « تذكّر »), sans le construire.

| leçon | suppose | enseigné plus loin dans |
|---|---|---|
| `hasr-qiyam-muqarraba` (1am.m3.r04) | 1am.m3.r03 — إجراء القسمة العشرية لعدد طبيعي أو عشري على عدد طبيعي. | `qisma-ashriya-taqrib` |
| `qays-zawiya-minqala` (1am.m4.r04) | 1am.m4.r03 — الاستعمال السليم في وضعية معطاة للمصطلحات: زاوية حادة، زاوية منفرجة، زاوية قائمة، زاوية مستقيمة. | `tasnif-zawaya-munassif` |
| `naql-tul-muntasaf` (1am.m4.r10) | 1am.m4.r08 — التعرّف على خواص التناظر المحوري (حفظ المسافات، الزوايا والأشكال، ...). | `nazir-shakl-khawas` |
| `tasnif-zawaya-munassif` (1am.m4.r11) | 1am.m4.r08 — التعرّف على خواص التناظر المحوري (حفظ المسافات، الزوايا والأشكال، ...). | `nazir-shakl-khawas` |
| `kusur-ashriya-kitaba` (1am.m5.r03) | 1am.m5.r01 — التعرّف في حالات بسيطة على الكتابات الكسرية لعدد. | `hasil-qisma-kasr` |
| `kusur-ashriya-kitaba` (1am.m5.r03) | 1am.m1.r05 — جمع، طرح وضرب أعداد عشرية في وضعية معيّنة. | `mana-jam-tarh` |
| `adad-ashri-mustaqim-mudarraj` (1am.m5.r04) | 1am.m1.r04 — ترتيب أعداد عشرية. | `muqaranat-adad-ashriya` |
| `tatbiq-qaida-harfiya` (1am.m5.r08) | 1am.m2.r08 — حساب محيط ومساحة مستطيل. | `mustatil-murabba-masaha` |
| `kusur-ashriya-kitaba` (1am.m5.x1) | 1am.m5.r01 — التعرّف في حالات بسيطة على الكتابات الكسرية لعدد. | `hasil-qisma-kasr` |
| `qisma-iqlidiya-hasr` (2am.m1.r06) | 2am.m1.r05 — تعيين قيمة مقرّبة بالزيادة (أو بالنقصان) لحاصل قسمة عشري. | `kasr-hasil-qisma` |
| `jam-tarh-kusur` (2am.m1.r09) | 2am.m1.r08 — مقارنة كسرين لهما نفس المقام أو مقام أحدهما مضاعف لمقام الآخر. | `muqarana-kasrayn` |
| `nazirat-nuqta` (2am.m2.r03) | 2am.m2.r02 — التعرّف على شكل يقبل مركز تناظر. | `markaz-tanazur-shakl` |
| `mawshur-qaim-wasf` (2am.m7.r07) | 2am.m7.r05 — تمثيل تصميم أسطوانة دوران أبعادها معلومة. | `ustuwana-dawaran-wasf` |
| `hajm-mawshur-qaim` (2am.m7.r08) | 2am.m7.r04 — وصف أسطوانة دوران. | `ustuwana-dawaran-wasf` |
| `mahawir-munassifat` (3am.m4.r04) | 3am.m4.r03 — معرفة خاصية فيثاغورس واستعمالها. | `khassiyat-fitaghuras` |
| `mutawassit-mutawazin` (3am.m7.r11) | 3am.m7.r08 — حساب تكرارات. | `fiat-takrarat` |
| `mutawassit-mutawazin` (3am.m7.r12) | 3am.m7.r09 — تقديم سلسلة إحصائية في جدول وتمثيلها بمخطّط أو بيان (الأشرطة، المدرج التكراري). | `tamthil-silsila-ihsaiya` |

