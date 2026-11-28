/**
 * « الأهرامات » — EVERY word the world shows, in ARABIC (it names no lesson: a lesson's story overrides or adds through
 * `story.text`). The world is ONE code for two countries: `strings.js` re-exports the country's file — this one in
 * Algeria, `strings.fr.js` (same keys) in France — and nothing visible, no screen-reader label and no text direction is
 * written anywhere else in the folder. Every sentence about what the world built is a FACT, never « wrong », and none
 * writes the size of a gap (gate P1). A point or a segment inside an Arabic sentence is a formula (`$AB$`, read by
 * MathText) or an isolated run (`iso`) in the 3D prompts, so that the bidi algorithm never scrambles it (defects B7, B16).
 */

/** The direction of the world's sentences (read by every screen that sets `dir`; a formula stays `ltr`). */
export const DIR = 'rtl';

/** A Latin run (a point, a segment) isolated left-to-right inside an Arabic sentence that is not read by MathText. */
const iso = (t) => `⁦${t}⁩`;

export const WORLD_TEXT = {
  title: 'الأهرامات',
  subtitle: 'على ضفّة النيل خمسة مراسٍ. ما يبلغه الحبل المعقود تقيسه، وما لا يبلغه تحسبه، فيبني العالم عددك.',
  turn: { body: 'أدِر هاتفك لتلعب.' },
  end: {
    title: 'وصلتَ إلى آخر مرسى',
    text: 'هذه نسخة أولى من العالم: مراحله تُبنى تباعًا.',
    stay: 'أتجوّل على الضفّة',
  },
  /** The five docks, in the order of play (§1.1). No name says a rule (`review.md` §A.4). */
  docks: ['حقل النيل', 'ورشة البنّائين', 'عرض النيل', 'حجر القمّة', 'ظلّ الهرم الأكبر'],
  unit: 'م',
  hud: {
    rope: 'الحبل المعقود',
    knots: (n) => `${n} م`,
    drop: 'اترك الحبل',
    register: 'سجلّ الحقل',
    record: 'سجلّ مدّادي الحبال',
    plan: 'مخطّط البنّائين',
    reads: 'الحبل يقرأ',
    typed: 'كتبتَ',
    back: 'عُد إلى زيرو',
    top: 'منظر من الأعلى',
    topBack: 'عُد إلى زيرو',
  },
  held: (n) => `الحبل ${n} م`,
  prompt: {
    take: (p) => `خذ طرف الحبل عند الوتد ${iso(p)}`,
    drop: 'اترك الحبل',
    predict: 'اكتب طول القناة',
    order: 'اطلب مدماكًا من المقلع',
    board: (name) => `اركب الفلوكة إلى « ${name} »`,
    look: 'انظر إلى المرحلة كلّها',
  },
  objective: {
    slide: (from, line, stake) =>
      `قِس بالحبل من الوتد $${from}$ على $${line}$ حتّى الوتد $${stake}$: اضغط E عند $${from}$، ثمّ اضغط السهمين حتّى يبلغ الحبل $${stake}$، واتركه هناك.`,
    canal: (from, to) =>
      `مُدّ الحبل على ضفّة القناة من الوتد $${from}$ إلى الوتد $${to}$: اضغط E عند $${from}$، والحبل يقرأ طولها.`,
    predict: (seg) =>
      `البنّاؤون يطلبون حجارة تبطين القناة قبل أن يعود الماء. اكتب طول $${seg}$ قبل أن يقرأه الحبل: اضغط E عند الوتد $${seg[0]}$.`,
    edge: (from, stake) =>
      `قِس بالحبل على حافّة الهرم من الركن $${from}$ صعودًا حتّى آخر مدماك مبنيّ، العلامة $${stake}$: الحبل لا يمشي إلّا على ما بُني.`,
    course: (seg) =>
      `المدماك عند العلامة $${seg[0]}$ لم يُبنَ بعد، فلا يقيسه حبل: احسب طوله $${seg}$ واطلبه من المقلع، عند الركن $B$.`,
    look: 'من المرسى ترى المرحلة كلّها: اضغط E عند المرسى.',
    board: (name) => `انتهت هذه المرحلة. اركب الفلوكة عند المرسى إلى « ${name} ».`,
    later: 'هذه المرحلة تُبنى لاحقًا. اركب الفلوكة عند المرسى إلى المرحلة التالية.',
    end: 'وصلتَ إلى آخر مرسى في هذه النسخة من العالم.',
  },
  order: {
    canal: {
      title: 'قبل أن يقرأ الحبل',
      ask: (seg) =>
        `كم تتوقّع طول القناة $${seg}$؟ اكتب تخمينك ممّا قِستَه، فلا يُحسب عليك: الحبل يقرأ بعده طولها الحقيقي.`,
      send: 'اكتب للبنّائين',
    },
    course: {
      title: 'طلبيّة المقلع',
      ask: (seg) => `كم طول المدماك $${seg}$؟ يقطعه المقلع ويضعه البنّاؤون في مستواه.`,
      send: 'اقطع وارفع',
    },
    later: 'لاحقًا',
    refused: {
      empty: 'اكتب طولًا: أرقام، وفاصلة واحدة على الأكثر.',
      out: 'هذه العلامة خارج الحافّة.',
    },
  },
  /** The three facts of each order (`orders.js › FACTS`): what the world did, with no size. */
  fact: {
    as: 'الحبل يقرأ ما كتبتَ.',
    longer: 'القناة أطول ممّا كتبتَ.',
    shorter: 'القناة أقصر ممّا كتبتَ.',
    fits: 'المدماك يطابق الحافّتين.',
    gap: 'بقي فراغ عند الركنين.',
    overhang: 'المدماك يتجاوز الحافّتين.',
    ties: 'الحبل يُربط بالعمود المقابل.',
    short: 'الحبل يسقط في الماء قبل العمود.',
    slack: 'الحبل يرتخي على الماء.',
    apex: 'زيرو عند القمّة.',
    below: 'زيرو تحت القمّة.',
    above: 'زيرو فوق القمّة.',
  },
  say: {
    tied: (seg, n) => `$${seg} = ${n}$ م. سجّلته في سجلّ الحقل.`,
    built: 'البنّاؤون يضعون المدماك.',
    star: 'توقّعك أصاب من المرّة الأولى.',
    water: 'الماء هنا: لا يقطعه الحبل ولا تمشي فيه.',
    sail: 'الفلوكة تُبحر إلى المرسى التالي.',
  },
  recall: { title: 'من المرسى السابق' },
  /**
   * A level of « فضاء التدريب », sailed on the river (`practice.js`): the run's cards (`kit/GateRunHud.jsx ›
   * content.text`); the level's name is its title. Never a rule, never « wrong »: a buoy that was not the one shows a fact.
   */
  practice: {
    title: 'رحلة تدريب على النيل',
    say: 'على كلّ عوّامة عدد: مرّ بالعوّامة التي تحمل الجواب.',
    rule: 'اختر عوّامتك بالسهمين ← →، واحذر التمساح. لك ثلاثة قلوب.',
    start: 'أبحر',
    again: 'أعيد الرحلة',
    leave: 'الرجوع إلى الخريطة',
    order: 'مرّ بالعوّامة التي تحمل الجواب',
    gate: 'العوّامة',
    of: 'من',
    pause: 'توقّف',
    resume: 'متابعة',
    quit: 'خروج',
    pausedTitle: 'الفلوكة متوقّفة',
    pausedText: 'العوّامات تنتظرك حيث تركتها. اضغط « متابعة » أو مفتاح المسافة.',
    left: 'يسار',
    right: 'يمين',
    bump: 'التمساح! خسرت قلبًا.',
    won: { title: 'انتهت الرحلة', text: 'عُد إلى الخريطة لترى نجومك.' },
    lost: { title: 'انتهت القلوب', text: 'أعد الرحلة من أوّلها.' },
  },
  /** Stages 2–5 (phase 3): their instructions, prompts, orders and facts. */
  stage: {
    objective: {
      mark: (row) =>
        `صفّ طوله ${row} م قطعه المقلع من قبل. أين مكانه على الحافّة؟ اكتب العلامة $BM$ التي يوضع عندها: البنّاؤون يبنون حتّى علامتك. اضغط E عند الركن $B$.`,
      bankStart: 'قِس بالحبل على الضفّة من الوتد $A$ حتّى الوتد القديم $S$: اضغط E عند $A$، ثمّ اضغط السهمين.',
      sight:
        'من الوتد $E$ امشِ بالحبل عموديًّا على الضفّة حتّى يحجب الوتدُ $S$ العمودَ $F$ في عين زيرو، واترك الحبل هناك.',
      ferry: 'حبل العبّارة يُقطع قبل العبور. اكتب طول $AF$ عند الوتد $A$: يُرمى الحبل إلى العمود $F$.',
      climb: 'حجر القمّة ينتظر. اصعد إلى القمّة: اضغط E عند المنحدر.',
      capstone: 'حجر القمّة هرم صغير بالشكل نفسه. اكتب للنحّات عددًا واحدًا: كلّ طول × [ ]. اضغط E على القمّة.',
      stick: 'قِس ظلّ العصا بالحبل من قدمها $M$ حتّى طرفه: اضغط E عند العصا.',
      shadow: 'قِس ظلّ الهرم من منتصف حافّة القاعدة $H$ حتّى طرفه $A$: اضغط E عند $H$.',
      base: 'قِس ضلع القاعدة من الركن $D$ إلى الركن $G$: اضغط E عند $D$.',
      slideStick:
        'خذ مثلّث العصا المرسوم على محور الظلّ وحرّكه حتّى يقع طرف ظلّ العصا على $A$: اضغط E عند المثلّث، ثمّ اضغط السهمين.',
      mission: 'المثلّثان متداخلان الآن. افتح بطاقة المهمّة عند $A$: كم ارتفاع الهرم؟',
      noon: 'عند الظهر لا يخرج الظلّ من القاعدة. تحقّق من الارتفاع بصندوق ابن الهيثم: اضغط E عند الصندوق.',
      forge: 'اصنع مفتاحك: اضغط E عند لوح البنّائين.',
      end: 'قِست الهرم الأكبر دون أن تتسلّقه، بطريقتين.',
    },
    prompt: {
      mark: 'اكتب علامة الصفّ',
      ferry: 'اقطع حبل العبّارة',
      climb: 'اصعد إلى القمّة',
      capstone: 'اكتب طلبيّة حجر القمّة',
      stick: 'خذ مثلّث العصا',
      mission: 'افتح بطاقة المهمّة',
      box: 'افتح صندوق ابن الهيثم',
      forge: 'افتح لوح البنّائين',
      rope: 'خذ طرف الحبل',
    },
    order: {
      mark: {
        title: 'صفّ جاهز',
        ask: (row) => `صفّ طوله ${row} م. عند أيّ علامة يوضع؟`,
        seg: 'BM',
        send: 'ابنوا حتّى علامتي',
      },
      ferry: { title: 'حبل العبّارة', ask: () => 'كم طول الحبل من $A$ إلى العمود $F$؟', seg: 'AF', send: 'اقطع وارمِ' },
      capstone: {
        title: 'طلبيّة النحّات',
        ask: () => 'كلّ طول من أطوال الهرم الكبير × العدد الذي تكتبه = طول في حجر القمّة.',
        seg: 'k',
        send: 'انحت وارفع',
      },
    },
    fact: {
      sits: 'الحجر يستقرّ على القمّة.',
      small: 'الحجر أصغر من القمّة: تبقى درجة حوله.',
      big: 'الحجر أكبر من القمّة: يتجاوز حوافّها.',
      quarry: (b) => `طلبيّة المقلع: قاعدة طولها ${b} م — لا يتّسع لها الفناء.`,
      markFits: 'الصفّ يطابق الحافّتين عند علامتك.',
      markGap: 'عند علامتك بقي فراغ عند الركنين حول الصفّ.',
      markOver: 'عند علامتك يتجاوز الصفّ الحافّتين.',
      meet: 'طرفا الظلّين يلتقيان في $A$.',
    },
    card: {
      check: 'تحقّق',
      later: 'لاحقًا',
      notToScale: 'الشكل تخطيطيّ: ليس بمقياس حقيقيّ.',
    },
    hud: { triangle: 'مثلّث العصا المرسوم' },
    say: {
      built: 'البنّاؤون يبنون حتّى العلامة.',
      thrown: 'الحبل يُرمى فوق الماء.',
      carved: 'النحّات يرفع الحجر إلى القمّة.',
      rise: 'زيرو يصعد على محور الهرم إلى الارتفاع الذي كتبتَه.',
      noon: 'الشمس الآن في كبد السماء.',
      climbed: 'وصلتَ إلى القمّة.',
    },
  },
};

/**
 * The words of the three experiments (« استكشف ») — facts only: no sentence names the rule, and a miss is answered
 * « توقّعك لم يصب هذه المرّة » followed by a fact. A lesson's `inquiry.text` overrides any of them.
 */
export const KIND_TEXT = {
  plan: {
    lead: 'طول واحد مجهول في الشكل. اختر بطاقتين، وصِل الحبلين أو اقطع قطعة إن احتجت، ثمّ اكتب الطول.',
    cards: 'بطاقات النسب',
    twoUnknown: 'نسبة فيها طولان مجهولان.',
    tools: 'الحبل',
    typeIt: (seg) => `اكتب $${seg}$`,
    lay: 'ضع المدماك',
    next: 'التالي',
    again: 'اطلب مدماكًا آخر',
    unit: 'م',
    fact: {
      fits: 'المدماك يطابق الحافّتين.',
      gap: (d) => `بقي فراغ عند الركنين: ينقص المدماك $${d}$ م.`,
      overhang: (d) => `المدماك يتجاوز الحافّتين بـ $${d}$ م.`,
    },
    /**
     * A length on a line THROUGH the vertex of a butterfly (`plan.js › laidOn`): his number is a rope stretched from the
     * vertex along its line — it reaches the point, stops short of it, or passes it; the size written.
     */
    line: {
      fits: 'الحبل الممدود من الرأس يبلغ النقطة تمامًا.',
      gap: (d) => `الحبل الممدود من الرأس يقف قبل النقطة: ينقصه $${d}$ م.`,
      overhang: (d) => `الحبل الممدود من الرأس يتجاوز النقطة بـ $${d}$ م.`,
    },
  },
  halfturn: {
    lead: 'المثلّث الصغير على الجهة الأخرى من الرأس. أدِره نصف دورة حول الرأس.',
    ask: (m) => `قبل أن تديره: على أيّ مستقيم تقع النقطة $${m}$ بعد نصف دورة؟`,
    line: (v, x) => `المستقيم $(${v}${x})$`,
    turn: 'أدِر بالسهمين ← →',
    landed: (m, v, b) => `وقعت $${m}$ على المستقيم $(${v}${b})$.`,
    miss: 'توقّعك لم يصب هذه المرّة.',
    hit: 'كما قلتَ.',
    next: 'التالي',
    /** Before the chain rewritten in the butterfly's own letters (shown only when the inquiry says `chainOwn: true`). */
    chainOwn: 'بحروف الشكل الأوّل:',
  },
  scale: {
    lead: 'آلة النسخ مثبّتة عند الرأس: تنسخ المثلّث وتضرب كلّ ضلع في العدد المكتوب على قرصها.',
    dial: 'القرص',
    ask: (t) => `قبل النسخ: كيف ستكون النسخة أمام المثلّث ${t}؟`,
    say: { larger: 'أكبر منه', exact: 'تطابقه', smaller: 'أصغر منه' },
    setK: (t) => `اكتب على القرص العدد الذي يعطي المثلّث ${t} بالضبط.`,
    perimeterAsk: 'ما محيط النسخة؟',
    perimeter: { times: 'المحيط × k', plus: 'المحيط + k', times3: 'المحيط × 3k' },
    image: {
      outside: 'النسخة تتجاوز المثلّث الآخر.',
      exact: 'النسخة تغطّي المثلّث الآخر بالضبط.',
      inside: 'النسخة تقع داخل المثلّث الآخر.',
    },
    copySides: 'أضلاع النسخة',
    copyPerimeter: 'محيط النسخة',
    miss: 'توقّعك لم يصب هذه المرّة.',
    hit: 'كما قلتَ.',
    copy: 'انسخ',
    next: 'التالي',
    again: 'جرّب عددًا آخر',
    fact: 'حجر القمّة: هذا ما صنعته آلة النسخ.',
  },
};

/** The wording the world gives the forges by default (`ruleForge.js`) — a lesson's forge overrides what its rule changes. */
export const THALES_TEXT = {
  title: 'لوح البنّائين',
  sub: 'اصنع مفتاحك: قاعدة تصمد أمام المرآة.',
  log: 'ما قِسته وما بُني',
  next: 'حالة أخرى',
  testing: 'المرآة تمرّ على حالاتك واحدةً واحدة…',
  agreed: 'قاعدتك توافق كلّ الحالات التي رأيتَها. الآن المرآة تتحدّاها بحالة جديدة.',
  fire: 'ابنِ الحالة',
  survived: 'صمدت قاعدتك أمام هذه الحالة.',
  wordsHint: 'قل قاعدتك بكلماتك…',
  aligned: 'العلامات الثلاث على خطّ واحد.',
  apart: 'العلامات الثلاث ليست على خطّ واحد.',
  /** The gauge of the half-turn (`Gauge.jsx › TurningGauge`): its lead, the word between two sides, while he turns. */
  gauge: 'الأضلاع مثنى مثنى: ضلع من المثلّث الصغير على ضلع من المثلّث الكبير.',
  gaugeOn: 'على',
  gaugeTurn: 'أضلاع المثلّث الكبير الثلاثة ممدودة إلى طول واحد.',
  mirrored: 'بنته المرآة',
};

/** What a screen reader says of a drawn figure (`figure.js`, `InquiryHalfturn.jsx`, `InquiryScale.jsx`). */
export const FIGURE_TEXT = {
  butterfly: (V) => `فراشة رأسها ${V}`,
  nested: (V, B, C, M, N) => `مثلث ${V}${B}${C} والقطعة [${M}${N}]`,
  pair: (V) => `مثلّثان رأسهما ${V}`,
};
