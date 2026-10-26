# File de génération des leçons 1AM–3AM

> **Généré** par `scripts/learning-net-queue.mjs` depuis le réseau des الكفاءات — ne pas éditer à la main.
> Priorité (propriétaire, 2026-10-25) — **Phase 0** : les leçons restantes des unités 3AM 1–5, plans par leçon dans
> `docs/curriculum/PLAN_3AM_UNITS_1_5.md`.
> Règle (propriétaire, 2026-10-20) — **Phase A d’abord** : ce dont l’élève de 4AM a besoin MAINTENANT. Les unités 4AM dans
> l’ordre du manuel ; pour chaque leçon, ses prérequis DIRECTS des années antérieures, pris dans l’année la plus récente
> (3AM, sinon 2AM, sinon 1AM). Ensuite (règle du 2026-10-13) : les chaînes complètes des leçons 4AM, de la plus ancienne
> à la plus récente ; puis depuis les leçons 3AM restantes, 2AM, 1AM ; les leçons isolées en dernier ; chaque synthèse
> juste après la dernière leçon de son unité. Contrat : `docs/architecture/LEARNING_NET.md` §4bis.

**164** leçons à générer (37 synthèses).

## Phase 0 — priorité du propriétaire : unités 3AM 1–5 (2026-10-25) (8)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 1 | `quwa-adad-ashara` — قوى العدد 10 | السنة الثالثة متوسط | `quwa-nisbiya` | priorité propriétaire |
| 2 | `qawaid-quwa-ashara` — قواعد الحساب على قوى العدد 10 | السنة الثالثة متوسط | `quwa-nisbiya` | priorité propriétaire |
| 3 | `kitaba-ilmiya-rutba` — الكتابة العلمية ورتبة القدر | السنة الثالثة متوسط | `quwa-nisbiya` | priorité propriétaire |
| 4 | `wadiya-idmajiya-quwa-nisbiya` — أدمج تعلّماتي — القوى ذات أسس نسبية صحيحة _(synthèse)_ | السنة الثالثة متوسط | `quwa-nisbiya` | unité quwa-nisbiya complète |
| 5 | `wadiya-idmajiya-ibarat-harfiya-3` — أدمج تعلّماتي — الحساب الحرفي _(synthèse)_ | السنة الثالثة متوسط | `ibarat-harfiya-3` | unité ibarat-harfiya-3 complète |
| 6 | `mutabayinat-amaliyat` — المتباينات والعمليات | السنة الثالثة متوسط | `musawiyat-mutabayinat` | priorité propriétaire |
| 7 | `hasr-adad-ushri` — حصر عدد عشري موجب | السنة الثالثة متوسط | `musawiyat-mutabayinat` | priorité propriétaire |
| 8 | `wadiya-idmajiya-musawiyat-mutabayinat` — أدمج تعلّماتي — المساويات – المتباينات – المعادلات _(synthèse)_ | السنة الثالثة متوسط | `musawiyat-mutabayinat` | unité musawiyat-mutabayinat complète |

## Phase A — ce dont la 4AM a besoin maintenant, unité par unité (23)

### Unité 4AM 1 — الأعداد الطبيعيّة والأعداد النّاطقة (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 2 — الحساب على الجذور (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 3 — الحساب الحرفي (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 4 — معادلات ومتراجحات من الدرجة الأولى بمجهول واحد (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 5 — جمل معادلتين من الدرجة الأولى بمجهولين (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 6 — الدالة الخطية والتناسبية (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 9 | `haraka-muntazama-sura` — الحركة المنتظمة والسرعة المتوسطة | السنة الثالثة متوسط | `tanasubiya-sura` | `tatbiqat-tanasub` |
| 10 | `wadiya-idmajiya-tanasubiya-sura` — أدمج تعلّماتي — التناسبية _(synthèse)_ | السنة الثالثة متوسط | `tanasubiya-sura` | unité tanasubiya-sura complète |

### Unité 4AM 7 — الدالة التآلفية (0) — rien à générer : ses prérequis directs sont publiés ou déjà dans la file.

### Unité 4AM 8 — الإحصاء (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 11 | `fiat-takrarat` — تجميع المعطيات في فئات والتكرارات | السنة الثالثة متوسط | `tanzim-mutaayat` | `takrar-mujamma` |
| 12 | `mutawassit-mutawazin` — متوسط سلسلة إحصائية والمتوسط المتوازن | السنة الثالثة متوسط | `tanzim-mutaayat` | `mada-wasit-mutawassit` |

### Unité 4AM 9 — خاصية طالس (1)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 13 | `tanasub-atwal-muthallath` — تناسبية الأطوال في المثلث | السنة الثالثة متوسط | `muthallathat-3am` | `talis-hisab-atwal` |

### Unité 4AM 10 — حساب المثلثات في المثلث القائم (3)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 14 | `jayb-tamam-zawiya` — جيب تمام زاوية حادة | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | `nisab-muthallathiya` |
| 15 | `hisab-jayb-tamam` — حساب جيب التمام وتوظيفه | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | `hasiba-muthallathiya` |
| 16 | `mustaqimat-mutaamida-mutawazia` — إنشاء مستقيمات متعامدة ومتوازية | السنة الثانية متوسط | `inshaat-handasiya` | `alaqat-muthallathiya` |

### Unité 4AM 11 — الأشعة والانسحاب (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 17 | `suwar-ashkal-insihab` — صور الأشكال بانسحاب وخواصه | السنة الثالثة متوسط | `insihab-3am` | `insihab-shuaa` |
| 18 | `tarif-mutawazi-adla` — التعرّف على متوازي الأضلاع | السنة الثانية متوسط | `mutawazi-adla` | `shuaayn-mutasawiyayn` |

### Unité 4AM 12 — الأشعة في معلم (2)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 19 | `talim-nuqta-mustawi` — تعليم نقطة في المستوي | السنة الثانية متوسط | `adad-nisbiya-2` | `murakkibata-shuaa` |
| 20 | `masafa-nuqtatayn` — المسافة بين نقطتين على مستقيم مدرّج | السنة الثانية متوسط | `adad-nisbiya-2` | `hisab-murakkibatay` |

### Unité 4AM 13 — الدوران - الزوايا - المضلّعات المنتظمة (4)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 21 | `qays-zawiya-minqala` — قيس زاوية بالمنقلة ورسم زاوية علم قيسها | السنة الأولى متوسط | `zawaya-qiyas` | `mafhum-dawaran` |
| 22 | `daira-mustalahat` — الدائرة: تسميات وتعاريف | السنة الأولى متوسط | `ashkal-mustawiya` | `zawiya-muhitiya` |
| 23 | `mudallaat-zawiya` — المضلّعات والزاوية | السنة الأولى متوسط | `ashkal-mustawiya` | `zawiya-muhitiya` |
| 24 | `majmu-zawaya-muthallath` — مجموع أقياس زوايا مثلث | السنة الثانية متوسط | `muthallath-daira` | `zawiya-muhitiya` |

### Unité 4AM 14 — الهندسة في الفضاء (7)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 25 | `manzur-mutasawi-qiyas` — التمثيل بالمنظور متساوي القياس | السنة الأولى متوسط | `mutawazi-mustatilat` | `kura-julla` |
| 26 | `ustuwana-dawaran-wasf` — أسطوانة الدوران: الوصف والتصميم والمساحة الجانبية | السنة الثانية متوسط | `mawshur-ustuwana` | `kura-julla` |
| 27 | `masahat-qurs` — مساحة القرص | السنة الثانية متوسط | `muthallath-daira` | `misaha-hajm-kura` |
| 28 | `mawshur-qaim-wasf` — الموشور القائم: الوصف والتصميم والمساحة الجانبية | السنة الثانية متوسط | `mawshur-ustuwana` | `maqati-mustawiya` |
| 29 | `wasf-tamthil-haram` — وصف الهرم وتمثيله وتصميمه | السنة الثالثة متوسط | `haram-makhrut` | `maqati-mustawiya` |
| 30 | `miqyas-kharita-mukhattat` — المقياس: الخرائط والمخططات | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `takbir-tasghir` |
| 31 | `hajm-haram` — حجم الهرم | السنة الثالثة متوسط | `haram-makhrut` | `takbir-tasghir` |

## Phase B — les chaînes complètes des leçons 4AM (58)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 32 | `mustatil-murabba-masaha` — محيط ومساحة المستطيل والمربع | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `jidhr-tarbii` |
| 33 | `adad-ashri-mustaqim-mudarraj` — الأعداد العشرية ونصف المستقيم المدرّج | السنة الأولى متوسط | `adad-tabiiya-ashriya` | `jidhr-tarbii` |
| 34 | `talim-mustaqim-mudarraj` — التعليم على مستقيم مدرّج | السنة الأولى متوسط | `adad-nisbiya` | `jidhr-tarbii` |
| 35 | `adad-nisbiya-siyaqat` — الأعداد النسبية وسياقات استعمالها | السنة الأولى متوسط | `adad-nisbiya` | `jidhr-tarbii` |
| 36 | `talim-mustaqim-mudarraj-2` — التعليم على مستقيم مدرّج | السنة الثانية متوسط | `adad-nisbiya-2` | `jidhr-tarbii` |
| 37 | `jam-tarh-nisbiya` — جمع وطرح عددين نسبيين | السنة الثانية متوسط | `adad-nisbiya-2` | `jidhr-tarbii` |
| 38 | `silsila-bi-aqwas` — سلسلة عمليات تتضمّن أقواسا | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `amaliyat-judhur` |
| 39 | `silsila-bidun-aqwas` — سلسلة عمليات دون أقواس وأولوية العمليات | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `amaliyat-judhur` |
| 40 | `tawzi-darb-jam-tarh` — توزيع الضرب على الجمع والطرح | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `amaliyat-judhur` |
| 41 | `jida-kasrayn` — جداء كسرين | السنة الثانية متوسط | `kusur-amaliyat` | `amaliyat-judhur` |
| 42 | `muqarana-kasrayn` — مقارنة كسرين | السنة الثانية متوسط | `kusur-amaliyat` | `amaliyat-judhur` |
| 43 | `jam-tarh-kusur` — جمع وطرح كسرين | السنة الثانية متوسط | `kusur-amaliyat` | `amaliyat-judhur` |
| 44 | `tatbiq-qaida-harfiya` — تطبيق قاعدة حرفية | السنة الأولى متوسط | `ibarat-harfiya` | `muadala-ula` |
| 45 | `bahth-adad-naqisa` — البحث عن أعداد ناقصة | السنة الأولى متوسط | `ibarat-harfiya` | `muadala-ula` |
| 46 | `majmu-jabri` — حساب مجموع جبري | السنة الثانية متوسط | `adad-nisbiya-2` | `muadala-ula` |
| 47 | `wadiya-idmajiya-adad-nisbiya-2` — أدمج تعلّماتي — الأعداد النسبية _(synthèse)_ | السنة الثانية متوسط | `adad-nisbiya-2` | unité adad-nisbiya-2 complète |
| 48 | `hall-mushkil-muadala` — حلّ مشكل باستعمال معادلة | السنة الثانية متوسط | `mafhum-muadala` | `muadala-ula` |
| 49 | `ikhtibar-musawat-mutabayina` — اختبار صحة مساواة أو متباينة | السنة الثانية متوسط | `mafhum-muadala` | `muadala-ula` |
| 50 | `talim-fi-mustawi` — التعليم في المستوي | السنة الأولى متوسط | `adad-nisbiya` | `tanasub-muamil` |
| 51 | `wadiya-idmajiya-adad-nisbiya` — أدمج تعلّماتي — الأعداد النسبية _(synthèse)_ | السنة الأولى متوسط | `adad-nisbiya` | unité adad-nisbiya complète |
| 52 | `wadiyat-tanasubiya` — وضعيات تناسبية وجداول تناسبية | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `tanasub-muamil` |
| 53 | `itmam-jadwal-tanasubiya` — إتمام جدول تناسبية | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `tanasub-muamil` |
| 54 | `wadiya-tanasubiya-jadwal` — التعرّف على وضعية تناسبية من جدول | السنة الثانية متوسط | `tanasubiya-2am` | `tanasub-muamil` |
| 55 | `nisba-miawiya-tatbiq` — تطبيق نسبة مئوية | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `tatbiqat-tanasub` |
| 56 | `wahdat-tul-masaha` — وحدات الطول ووحدات المساحة | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `tatbiqat-tanasub` |
| 57 | `nisba-miawiya` — حساب نسبة مئوية وتوظيفها | السنة الثانية متوسط | `tanasubiya-2am` | `tatbiqat-tanasub` |
| 58 | `miqyas-kharita` — مقياس خريطة أو تصميم | السنة الثانية متوسط | `tanasubiya-2am` | `tatbiqat-tanasub` |
| 59 | `wadiya-idmajiya-tanasubiya-2am` — أدمج تعلّماتي — التناسبية _(synthèse)_ | السنة الثانية متوسط | `tanasubiya-2am` | unité tanasubiya-2am complète |
| 60 | `tanzim-muatayat-jadwal` — تنظيم معطيات في جدول | السنة الأولى متوسط | `tanzim-muatayat` | `takrar-mujamma` |
| 61 | `qiraat-jadwal-malumat` — قراءة جدول واستخراج معلومات | السنة الأولى متوسط | `tanzim-muatayat` | `takrar-mujamma` |
| 62 | `takrarat-nisbiya` — التكرارات والتكرارات النسبية | السنة الثانية متوسط | `tanzim-mutayat-2am` | `takrar-mujamma` |
| 63 | `mustaqim-qita-istiqamiya` — المستقيم ونصف المستقيم وقطعة المستقيم والاستقامية | السنة الأولى متوسط | `tawazi-taamud` | `majdulat-ihsaiya` |
| 64 | `tasnif-zawaya-munassif` — مقارنة الزوايا وتصنيفها ومنصّف زاوية | السنة الأولى متوسط | `zawaya-qiyas` | `majdulat-ihsaiya` |
| 65 | `tamthil-mukhattatat` — تمثيل معطيات إحصائية بمخطّطات | السنة الثانية متوسط | `tanzim-mutayat-2am` | `majdulat-ihsaiya` |
| 66 | `tanzim-fiat` — تلخيص سلسلة إحصائية في شكل فئات | السنة الثانية متوسط | `tanzim-mutayat-2am` | `majdulat-ihsaiya` |
| 67 | `tamthil-silsila-ihsaiya` — تمثيل سلسلة إحصائية بمخطط أو بيان | السنة الثالثة متوسط | `tanzim-mutaayat` | `majdulat-ihsaiya` |
| 68 | `wadiya-idmajiya-tanzim-mutaayat` — أدمج تعلّماتي — تنظيم معطيات _(synthèse)_ | السنة الثالثة متوسط | `tanzim-mutaayat` | unité tanzim-mutaayat complète |
| 69 | `mustaqimat-mutaamida` — المستقيمان المتقاطعان والمتعامدان | السنة الأولى متوسط | `tawazi-taamud` | `talis-hisab-atwal` |
| 70 | `ashkal-mutanazira` — الأشكال المتناظرة بالنسبة إلى مستقيم | السنة الأولى متوسط | `tanazur-mihwari` | `talis-hisab-atwal` |
| 71 | `nazir-shakl-khawas` — نظير شكل وخواص التناظر المحوري | السنة الأولى متوسط | `tanazur-mihwari` | `talis-hisab-atwal` |
| 72 | `markaz-tanazur-shakl` — مركز تناظر شكل | السنة الثانية متوسط | `tanazur-markazi` | `talis-hisab-atwal` |
| 73 | `nazir-shakl-khawas-2` — نظير شكل وخواص التناظر المركزي | السنة الثانية متوسط | `tanazur-markazi` | `talis-hisab-atwal` |
| 74 | `nazirat-nuqta` — التناظر المركزي ونظيرة نقطة | السنة الثانية متوسط | `tanazur-markazi` | `talis-hisab-atwal` |
| 75 | `wadiya-idmajiya-tanazur-markazi` — أدمج تعلّماتي — التناظر المركزي _(synthèse)_ | السنة الثانية متوسط | `tanazur-markazi` | unité tanazur-markazi complète |
| 76 | `zawaya-mutajawira-mutatamma` — زاويتان متجاورتان، متتامتان، متكاملتان | السنة الثانية متوسط | `zawaya-tawazi` | `talis-hisab-atwal` |
| 77 | `tawazi-zawaya` — التوازي والزوايا | السنة الثانية متوسط | `zawaya-tawazi` | `talis-hisab-atwal` |
| 78 | `mustaqim-muntasafayn` — مستقيم المنتصفين في مثلث | السنة الثالثة متوسط | `muthallathat-3am` | `talis-hisab-atwal` |
| 79 | `naql-tul-muntasaf` — نقل طول ومنتصف قطعة مستقيم | السنة الأولى متوسط | `tawazi-taamud` | `alaqat-muthallathiya` |
| 80 | `tarif-insihab` — الانسحاب ومتوازي الأضلاع | السنة الثالثة متوسط | `insihab-3am` | `insihab-shuaa` |
| 81 | `sura-nuqta-insihab` — إنشاء صورة نقطة بانسحاب | السنة الثالثة متوسط | `insihab-3am` | `insihab-shuaa` |
| 82 | `wadiya-idmajiya-insihab-3am` — أدمج تعلّماتي — الانسحاب _(synthèse)_ | السنة الثالثة متوسط | `insihab-3am` | unité insihab-3am complète |
| 83 | `wasf-mutawazi-mustatilat` — وصف متوازي المستطيلات والمكعب | السنة الأولى متوسط | `mutawazi-mustatilat` | `kura-julla` |
| 84 | `muhit-qurs` — محيط القرص والعدد π | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `misaha-hajm-kura` |
| 85 | `masahat-muthallath-qaim` — مساحة المثلث القائم | السنة الأولى متوسط | `sutuh-masahat-muhitat` | `takbir-tasghir` |
| 86 | `wadiya-idmajiya-sutuh-masahat-muhitat` — أدمج تعلّماتي — السطوح المستوية: الأطوال، المحيطات، المساحات _(synthèse)_ | السنة الأولى متوسط | `sutuh-masahat-muhitat` | unité sutuh-masahat-muhitat complète |
| 87 | `hajm-mutawazi-mustatilat` — حجم متوازي المستطيلات ووحدات الحجوم | السنة الأولى متوسط | `mutawazi-mustatilat` | `takbir-tasghir` |
| 88 | `masahat-muthallath` — مساحة المثلث | السنة الثانية متوسط | `muthallath-daira` | `takbir-tasghir` |
| 89 | `hajm-mawshur-qaim` — حجم الموشور القائم | السنة الثانية متوسط | `mawshur-ustuwana` | `takbir-tasghir` |

## Phase C — depuis les leçons 3AM restantes (22)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 90 | `rutbat-miqdar-jam` — رتبة مقدار مجموع وفرق | السنة الأولى متوسط | `jam-tarh-ashriya` | `kitaba-ilmiya-rutba` |
| 91 | `hasr-qiyam-muqarraba` — حصر عدد عشري وقيمه المقرّبة | السنة الأولى متوسط | `adad-tabiiya-ashriya` | `hasr-adad-ushri` |
| 92 | `wadiya-idmajiya-adad-tabiiya-ashriya` — أدمج تعلّماتي — الأعداد الطبيعية والأعداد العشرية _(synthèse)_ | السنة الأولى متوسط | `adad-tabiiya-ashriya` | unité adad-tabiiya-ashriya complète |
| 93 | `insha-muthallath-mutabayina` — المتباينة المثلثية وإنشاء مثلثات | السنة الثانية متوسط | `muthallath-daira` | `taqayus-muthallathat` |
| 94 | `taqayus-muthallathat` — المثلثات المتقايسة | السنة الثالثة متوسط | `muthallathat-3am` | `taqayus-muthallathat` |
| 95 | `daira-muhita-muthallath` — الدائرة المحيطة بمثلث | السنة الثانية متوسط | `muthallath-daira` | `mahawir-munassifat` |
| 96 | `wadiya-idmajiya-muthallath-daira` — أدمج تعلّماتي — المثلث والدائرة _(synthèse)_ | السنة الثانية متوسط | `muthallath-daira` | unité muthallath-daira complète |
| 97 | `mahawir-munassifat` — بعد نقطة عن مستقيم، المحاور والمنصفات | السنة الثالثة متوسط | `muthallathat-3am` | `mahawir-munassifat` |
| 98 | `mutawassitat-irtifaat` — المتوسطات والارتفاعات في المثلث | السنة الثالثة متوسط | `muthallathat-3am` | `mutawassitat-irtifaat` |
| 99 | `mahawir-tanazur-ashkal` — محاور تناظر الأشكال المألوفة | السنة الأولى متوسط | `tanazur-mihwari` | `daira-muhita-qaim` |
| 100 | `mutawaziyat-adla-khassa` — متوازيات الأضلاع الخاصة | السنة الثانية متوسط | `mutawazi-adla` | `daira-muhita-qaim` |
| 101 | `daira-muhita-qaim` — الدائرة المحيطة بالمثلث القائم | السنة الثالثة متوسط | `muthallath-qaim-daira` | `daira-muhita-qaim` |
| 102 | `awda-daira-mustaqim` — الأوضاع النسبية لدائرة ومستقيم | السنة الثالثة متوسط | `muthallath-qaim-daira` | `awda-daira-mustaqim` |
| 103 | `mumass-daira` — مماس دائرة في نقطة منها | السنة الثالثة متوسط | `muthallath-qaim-daira` | `mumass-daira` |
| 104 | `wadiya-idmajiya-muthallath-qaim-daira` — أدمج تعلّماتي — المثلث القائم والدائرة _(synthèse)_ | السنة الثالثة متوسط | `muthallath-qaim-daira` | unité muthallath-qaim-daira complète |
| 105 | `aksiya-fitaghuras` — الخاصية العكسية لفيثاغورس | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | `aksiya-fitaghuras` |
| 106 | `wadiya-idmajiya-fitaghuras-jayb-tamam` — أدمج تعلّماتي — خاصية فيثاغورس، جيب تمام زاوية _(synthèse)_ | السنة الثالثة متوسط | `fitaghuras-jayb-tamam` | unité fitaghuras-jayb-tamam complète |
| 107 | `tasmim-mutawazi-mustatilat` — تصميم متوازي المستطيلات وصنعه | السنة الأولى متوسط | `mutawazi-mustatilat` | `wasf-tamthil-haram` |
| 108 | `wadiya-idmajiya-mutawazi-mustatilat` — أدمج تعلّماتي — متوازي المستطيلات والمكعب _(synthèse)_ | السنة الأولى متوسط | `mutawazi-mustatilat` | unité mutawazi-mustatilat complète |
| 109 | `wasf-tamthil-makhrut` — وصف مخروط الدوران وتمثيله وتصميمه | السنة الثالثة متوسط | `haram-makhrut` | `wasf-tamthil-makhrut` |
| 110 | `hajm-makhrut` — حجم مخروط الدوران | السنة الثالثة متوسط | `haram-makhrut` | `hajm-makhrut` |
| 111 | `wadiya-idmajiya-haram-makhrut` — أدمج تعلّماتي — الهرم و مخروط الدوران _(synthèse)_ | السنة الثالثة متوسط | `haram-makhrut` | unité haram-makhrut complète |

## Phase D — depuis les leçons 2AM restantes (22)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 112 | `wasf-silsila-hisab` — وصف سلسلة حسابات | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | `wasf-silsila-hisab` |
| 113 | `wadiya-idmajiya-amaliyat-tabiiya-ushriya` — أدمج تعلّماتي — العمليات على الأعداد الطبيعية والأعداد العشرية _(synthèse)_ | السنة الثانية متوسط | `amaliyat-tabiiya-ushriya` | unité amaliyat-tabiiya-ushriya complète |
| 114 | `qisma-ashriya-taqrib` — القسمة العشرية والقيمة المقرّبة لحاصل قسمة | السنة الأولى متوسط | `darb-qisma-ashriya` | `qisma-iqlidiya-hasr` |
| 115 | `kasr-hasil-qisma` — الكسر: نسبة وحاصل قسمة وقيم مقرّبة | السنة الثانية متوسط | `kusur-amaliyat` | `kasr-hasil-qisma` |
| 116 | `wadiya-idmajiya-kusur-amaliyat` — أدمج تعلّماتي — الكسور والعمليات عليها _(synthèse)_ | السنة الثانية متوسط | `kusur-amaliyat` | unité kusur-amaliyat complète |
| 117 | `qiraat-mutayat-ihsaiya` — قراءة معطيات إحصائية وتفسيرها | السنة الثانية متوسط | `tanzim-mutayat-2am` | `qiraat-mutayat-ihsaiya` |
| 118 | `wadiya-idmajiya-tanzim-mutayat-2am` — أدمج تعلّماتي — تنظيم معطيات _(synthèse)_ | السنة الثانية متوسط | `tanzim-mutayat-2am` | unité tanzim-mutayat-2am complète |
| 119 | `mihwar-qita-insha` — إنشاء محور قطعة مستقيم | السنة الثانية متوسط | `inshaat-handasiya` | `mihwar-qita-insha` |
| 120 | `munassif-zawiya-insha` — إنشاء منصّف زاوية | السنة الثانية متوسط | `inshaat-handasiya` | `munassif-zawiya-insha` |
| 121 | `muthallathat-khassa-insha` — إنشاء مثلثات خاصة | السنة الثانية متوسط | `inshaat-handasiya` | `muthallathat-khassa-insha` |
| 122 | `rubaiyat-khassa-insha` — إنشاء مستطيل، مربع، معيّن | السنة الثانية متوسط | `inshaat-handasiya` | `rubaiyat-khassa-insha` |
| 123 | `daira-qaws-insha` — إنشاء دائرة وقوس دائرة | السنة الثانية متوسط | `inshaat-handasiya` | `daira-qaws-insha` |
| 124 | `wadiya-idmajiya-inshaat-handasiya` — أدمج تعلّماتي — إنشاء أشكال هندسية بسيطة _(synthèse)_ | السنة الثانية متوسط | `inshaat-handasiya` | unité inshaat-handasiya complète |
| 125 | `zawaya-mutaqabila-ras` — الزاويتان المتقابلتان بالرأس | السنة الثانية متوسط | `zawaya-tawazi` | `zawaya-mutaqabila-ras` |
| 126 | `zawaya-mutabadila-mutamathila` — الزاويتان المتبادلتان داخليا والمتماثلتان | السنة الثانية متوسط | `zawaya-tawazi` | `zawaya-mutabadila-mutamathila` |
| 127 | `wadiya-idmajiya-zawaya-tawazi` — أدمج تعلّماتي — الزوايا والتوازي _(synthèse)_ | السنة الثانية متوسط | `zawaya-tawazi` | unité zawaya-tawazi complète |
| 128 | `khawas-mutawazi-adla` — خواص متوازي الأضلاع | السنة الثانية متوسط | `mutawazi-adla` | `khawas-mutawazi-adla` |
| 129 | `masahat-mutawazi-adla` — مساحة متوازي الأضلاع | السنة الثانية متوسط | `mutawazi-adla` | `masahat-mutawazi-adla` |
| 130 | `wadiya-idmajiya-mutawazi-adla` — أدمج تعلّماتي — متوازي الأضلاع _(synthèse)_ | السنة الثانية متوسط | `mutawazi-adla` | unité mutawazi-adla complète |
| 131 | `mutawazi-mustatilat-hajm-saa` — متوازي المستطيلات: التمثيل والتصميم والحجم والسعة | السنة الثانية متوسط | `mawshur-ustuwana` | `mutawazi-mustatilat-hajm-saa` |
| 132 | `hajm-ustuwana-dawaran` — حجم أسطوانة الدوران | السنة الثانية متوسط | `mawshur-ustuwana` | `hajm-ustuwana-dawaran` |
| 133 | `wadiya-idmajiya-mawshur-ustuwana` — أدمج تعلّماتي — الموشور القائم وأسطوانة الدوران _(synthèse)_ | السنة الثانية متوسط | `mawshur-ustuwana` | unité mawshur-ustuwana complète |

## Phase E — leçons 1AM restantes (23)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 134 | `injaz-jam-tarh-mudad` — إنجاز عمليات الجمع والطرح والحساب على المدد | السنة الأولى متوسط | `jam-tarh-ashriya` | `injaz-jam-tarh-mudad` |
| 135 | `wadiya-idmajiya-jam-tarh-ashriya` — أدمج تعلّماتي — الحساب على الأعداد الطبيعية والأعداد العشرية: الجمع والطرح _(synthèse)_ | السنة الأولى متوسط | `jam-tarh-ashriya` | unité jam-tarh-ashriya complète |
| 136 | `darb-adad-ashriya` — ضرب الأعداد العشرية | السنة الأولى متوسط | `darb-qisma-ashriya` | `darb-adad-ashriya` |
| 137 | `wadiya-idmajiya-darb-qisma-ashriya` — أدمج تعلّماتي — الحساب على الأعداد الطبيعية والأعداد العشرية: الضرب والقسمة _(synthèse)_ | السنة الأولى متوسط | `darb-qisma-ashriya` | unité darb-qisma-ashriya complète |
| 138 | `hasil-qisma-mustaqim` — حاصل القسمة على نصف مستقيم مدرّج | السنة الأولى متوسط | `kitabat-kasriya` | `hasil-qisma-mustaqim` |
| 139 | `akhdh-kasr-min-adad` — أخذ كسر من عدد | السنة الأولى متوسط | `kitabat-kasriya` | `akhdh-kasr-min-adad` |
| 140 | `wadiya-idmajiya-kitabat-kasriya` — أدمج تعلّماتي — الكتابات الكسرية _(synthèse)_ | السنة الأولى متوسط | `kitabat-kasriya` | unité kitabat-kasriya complète |
| 141 | `intaj-ibara-harfiya` — إنتاج عبارات حرفية | السنة الأولى متوسط | `ibarat-harfiya` | `intaj-ibara-harfiya` |
| 142 | `wadiya-idmajiya-ibarat-harfiya` — أدمج تعلّماتي — الحساب الحرفي _(synthèse)_ | السنة الأولى متوسط | `ibarat-harfiya` | unité ibarat-harfiya complète |
| 143 | `muqaranat-hisas` — مقارنة حصص | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | `muqaranat-hisas` |
| 144 | `wadiya-idmajiya-tanasubiya-nisab-maqayis` — أدمج تعلّماتي — التناسبية _(synthèse)_ | السنة الأولى متوسط | `tanasubiya-nisab-maqayis` | unité tanasubiya-nisab-maqayis complète |
| 145 | `mukhattat-bil-amida` — تمثيل معطيات بمخطط بالأعمدة | السنة الأولى متوسط | `tanzim-muatayat` | `mukhattat-bil-amida` |
| 146 | `tamthil-bayani-dairi` — التمثيل البياني والمخطط الدائري | السنة الأولى متوسط | `tanzim-muatayat` | `tamthil-bayani-dairi` |
| 147 | `wadiya-idmajiya-tanzim-muatayat` — أدمج تعلّماتي — تنظيم معطيات _(synthèse)_ | السنة الأولى متوسط | `tanzim-muatayat` | unité tanzim-muatayat complète |
| 148 | `mustaqimat-mutawaziya` — المستقيمان المتوازيان | السنة الأولى متوسط | `tawazi-taamud` | `mustaqimat-mutawaziya` |
| 149 | `wadiya-idmajiya-tawazi-taamud` — أدمج تعلّماتي — التوازي والتعامد _(synthèse)_ | السنة الأولى متوسط | `tawazi-taamud` | unité tawazi-taamud complète |
| 150 | `muthallathat-khassa` — المثلثات الخاصة | السنة الأولى متوسط | `ashkal-mustawiya` | `muthallathat-khassa` |
| 151 | `rubaiyat-khassa` — الرباعيات الخاصة | السنة الأولى متوسط | `ashkal-mustawiya` | `rubaiyat-khassa` |
| 152 | `wadiya-idmajiya-ashkal-mustawiya` — أدمج تعلّماتي — الأشكال المستوية _(synthèse)_ | السنة الأولى متوسط | `ashkal-mustawiya` | unité ashkal-mustawiya complète |
| 153 | `mafhum-zawiya-tasmiya` — مفهوم الزاوية وتسميتها | السنة الأولى متوسط | `zawaya-qiyas` | `mafhum-zawiya-tasmiya` |
| 154 | `wadiya-idmajiya-zawaya-qiyas` — أدمج تعلّماتي — الزوايا _(synthèse)_ | السنة الأولى متوسط | `zawaya-qiyas` | unité zawaya-qiyas complète |
| 155 | `mihwar-qita-mustaqim` — محور قطعة مستقيم | السنة الأولى متوسط | `tanazur-mihwari` | `mihwar-qita-mustaqim` |
| 156 | `wadiya-idmajiya-tanazur-mihwari` — أدمج تعلّماتي — التناظر المحوري _(synthèse)_ | السنة الأولى متوسط | `tanazur-mihwari` | unité tanazur-mihwari complète |

## Phase F — leçons isolées (8)

| # | leçon | السنة | unité | déclenchée par |
|---:|---|---|---|---|
| 157 | `ibara-harfiya-intaj` — إنتاج عبارة حرفية واستعمالها | السنة الثانية متوسط | `mafhum-muadala` | isolée |
| 158 | `wadiya-idmajiya-mafhum-muadala` — أدمج تعلّماتي — مفهوم معادلة _(synthèse)_ | السنة الثانية متوسط | `mafhum-muadala` | unité mafhum-muadala complète |
| 159 | `qawaid-niqash-mithal-mudad` — قواعد النقاش الرياضي والمثال المضاد | السنة الثالثة متوسط | `burhan-riyadi` | isolée |
| 160 | `nusus-idha-fa-in` — النصوص «إذا … فإنّ …» والنص العكسي | السنة الثالثة متوسط | `burhan-riyadi` | isolée |
| 161 | `burhan-handasi` — البحث عن برهان في الهندسة وتحريره | السنة الثالثة متوسط | `burhan-riyadi` | isolée |
| 162 | `wadiya-idmajiya-burhan-riyadi` — أدمج تعلّماتي — البرهان في الرياضيات _(synthèse)_ | السنة الثالثة متوسط | `burhan-riyadi` | unité burhan-riyadi complète |
| 163 | `mutabayina-muthallathiya` — المتباينة المثلثية وإنشاء مثلث | السنة الثالثة متوسط | `muthallathat-3am` | isolée |
| 164 | `wadiya-idmajiya-muthallathat-3am` — أدمج تعلّماتي — المثلثات _(synthèse)_ | السنة الثالثة متوسط | `muthallathat-3am` | unité muthallathat-3am complète |

## Renvois en avant dans une même année (18)

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
| `quwa-adad-ashara` (3am.m3.r03) | 3am.m3.r02 — معرفة واستعمال قواعد الحساب على قوى العدد 10. | `qawaid-quwa-ashara` |
| `mahawir-munassifat` (3am.m4.r04) | 3am.m4.r03 — معرفة خاصية فيثاغورس واستعمالها. | `khassiyat-fitaghuras` |
| `mutawassit-mutawazin` (3am.m7.r11) | 3am.m7.r08 — حساب تكرارات. | `fiat-takrarat` |
| `mutawassit-mutawazin` (3am.m7.r12) | 3am.m7.r09 — تقديم سلسلة إحصائية في جدول وتمثيلها بمخطّط أو بيان (الأشرطة، المدرج التكراري). | `tamthil-silsila-ihsaiya` |

