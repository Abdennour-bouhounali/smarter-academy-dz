/**
 * « الأهرامات » — EVERY word the world shows (it names no lesson: a lesson's story overrides or adds through
 * `story.text`). France adds `strings.fr.js` with the same keys (`TWO_PLATFORMS_PLAN.md`): nothing visible is written
 * anywhere else in this folder. Every sentence about what the world built is a FACT, never « wrong », and none writes
 * the size of a gap (gate P1). A point or a segment inside an Arabic sentence is a formula (`$AB$`, read by MathText)
 * or an isolated run (`iso`) in the 3D prompts, so that the bidi algorithm never scrambles it (defects B7, B16).
 */
export const DIR = 'rtl';

/** A Latin run (a point, a segment) isolated left-to-right inside an Arabic sentence that is not read by MathText. */
export const iso = (t) => `⁦${t}⁩`;

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
      ask: (seg) => `كم طول القناة $${seg}$؟`,
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
};

/** A lesson's story may change any sentence (an object is merged one level deep). */
export function withStory(base, over = {}) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over))
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && typeof base[k] === 'object' ? { ...base[k], ...v } : v;
  return out;
}
