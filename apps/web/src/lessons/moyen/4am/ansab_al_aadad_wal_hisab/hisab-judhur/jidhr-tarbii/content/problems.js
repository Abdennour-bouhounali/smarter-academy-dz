/**
 * Les trois « مسائل » du درس 1 de l'unité 2 (modules 4, 5, 6) — des exercices
 * COMPLETS de type امتحان, résolus pas à pas (common/problems/GuidedProblem.jsx).
 *
 * AJOUTS DE LA PLATEFORME, déclarés comme tels (`addition('exam_style_problem')`) :
 * le manuel ne les contient pas. Ils restent dans le périmètre de la leçon :
 * la définition (le nombre POSITIF dont le carré est a), le symbole √a, la
 * valeur exacte face à l'affichage de la calculatrice, (√a)² = a et √(a²) = a —
 * avec la خاصية فيثاغورس des acquis. Jamais : ناطق / غير ناطق ni القيم المقربة
 * بالنقصان وبالزيادة (درس 2), l'équation x² = a (درس 3), produit / quotient /
 * somme de racines (درس 4), simplification (درس 5).
 *
 * La مسألة 1 est « مسألة الدرس » : son énoncé vit dans `LESSON_CONFIG.lessonProblem`
 * (montré dès le sommaire et rappelé au module 1) ; elle prolonge le niveau
 * متقدم du module 1 — le carré construit sur l'hypoténuse BC d'un triangle
 * rectangle, dont le côté ne tombe sur aucune graduation et que la calculatrice
 * n'affiche qu'approximativement — avec d'autres nombres (3 m et 5 m → 34).
 *
 * Chaque nombre est vérifié par calcul dans ./problems.test.js.
 */
import { addition } from '../../_unit/unitMeta.js';
import { LESSON_CONFIG } from '../lesson.config.js';

const SOURCE = addition('exam_style_problem');

export const PROBLEMS = [
  {
    id: 'masala-1',
    title: 'مسألة 1 — حوض الأزهار',
    context: LESSON_CONFIG.lessonProblem.title,
    headline: 'مسألة الدرس',
    emoji: '🌷',
    tone: 'indigo',
    source: SOURCE,
    illustration: LESSON_CONFIG.lessonProblem.illustration,
    statement: LESSON_CONFIG.lessonProblem.statement,
    data: [
      { id: 'triangle', text: 'الركن مثلث قائم ضلعاه القائمان 3 m و 5 m', useful: true },
      { id: 'square', text: 'الحوض مربّع مبني على الوتر', useful: true },
      { id: 'calc', text: 'الحاسبة تعرض 5,830951895 لطول الوتر', useful: true },
      { id: 'grass', text: 'العشب: 350 دج للمتر المربّع', useful: true },
      { id: 'frame', text: 'الإطار: 450 دج للمتر، يُباع بالمتر الكامل', useful: true },
      { id: 'path', text: 'عرض الممرّ 2 m', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'مساحة الحوض وضلعه',
        question: 'احسب مساحة الحوض $BCDE$، ثم عيّن القيمة المضبوطة لطول ضلعه $BC$.',
        asks: ['مساحة الحوض', 'القيمة المضبوطة لطول الضلع $BC$'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'translate',
            prompt: 'مساحة الحوض المربّع $BCDE$ هي:',
            options: ['$BC^2$', '$4 \\times BC$', '$AB \\times AC$', '$2 \\times BC$'],
            correct: 0, cols: 2,
            explain: 'مساحة مربّع هي مربّع طول ضلعه، وضلع الحوض هو $[BC]$: المساحة $BC^2$، ولا نحتاج إلى $BC$ نفسه لحسابها.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['khassiyat-fithaghuras'],
            prompt: 'مساحة الحوض (بخاصية فيثاغورس في المثلث $ABC$):', expected: 34, suffix: 'm²',
            explain: 'المثلث قائم في $A$: $BC^2 = AB^2 + AC^2 = 3^2 + 5^2 = 9 + 25 = 34$.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['jidhr-taarif', 'qima-mudbuta'],
            prompt: 'القيمة المضبوطة لطول الضلع $BC$ هي:',
            options: ['$\\sqrt{34}\\,m$', '$5{,}830951895\\,m$', '$17\\,m$', '$8\\,m$'],
            correct: 0, cols: 2,
            explain: '$BC$ طول، فهو عدد موجب مربّعه 34: $BC = \\sqrt{34}$. أمّا 17 فنصف 34، و $3 + 5 = 8$ يجمع الضلعين بدل مربّعيهما، و 5,830951895 هو ما تعرضه الحاسبة.' },
          { kind: 'solution', ask: 0, lines: [
            'المثلث $ABC$ قائم في $A$، إذن $BC^2 = AB^2 + AC^2 = 3^2 + 5^2 = 34$.',
            'مساحة الحوض المربّع هي $BC^2$، أي $34\\,m^2$.',
            '$BC$ عدد موجب مربّعه 34، إذن القيمة المضبوطة لطول ضلع الحوض هي $BC = \\sqrt{34}\\,m$.',
          ] },
        ],
      },
      {
        label: '2)', title: 'المساعد والحاسبة',
        question: 'يأخذ مساعد البستاني لطول الضلع القيمة 5,83 m. احسب $5{,}83^2$. هل 5,83 هو القيمة المضبوطة لطول الضلع؟ وهل العدد 5,830951895 الذي عرضته الحاسبة هو القيمة المضبوطة؟',
        asks: ['احسب $5{,}83^2$', 'هل 5,83 هو القيمة المضبوطة؟', 'هل 5,830951895 هو القيمة المضبوطة؟'],
        steps: [
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['murabba-adad'],
            prompt: 'احسب $5{,}83^2$:', expected: 33.9889,
            explain: '$5{,}83 \\times 5{,}83 = 33{,}9889$.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['jidhr-taarif'],
            prompt: 'هل 5,83 هو القيمة المضبوطة لطول الضلع $BC$؟',
            options: ['لا: $5{,}83^2 = 33{,}9889$ وهذا لا يساوي 34', 'نعم: الفرق بين $5{,}83^2$ و 34 صغير جدًّا', 'لا: لأنّ الجذر التربيعي لا يكون أبدًا عددًا عشريًّا'],
            correct: 0,
            explain: 'القيمة المضبوطة عدد مربّعه 34 بالضبط، و 33,9889 ليس 34 مهما كان الفرق صغيرًا. والجذر التربيعي قد يكون عشريًّا: $\\sqrt{0{,}49} = 0{,}7$.' },
          { kind: 'numeric', role: 'compute', requires: ['murabba-adad'],
            prompt: 'للعدد 5,830951895 تسعة أرقام بعد الفاصلة، آخرها 5. ما الرقم الأخير لمربّعه؟', expected: 5,
            explain: '$5 \\times 5 = 25$: مربّعه له 18 رقمًا بعد الفاصلة، آخرها الرقم 5.' },
          { kind: 'choice', role: 'conclude', ask: 2, requires: ['qima-mudbuta'],
            prompt: 'هل 5,830951895 هو القيمة المضبوطة لطول الضلع $BC$؟',
            options: ['لا: مربّعه عدد عشري آخر أرقامه 5 بعد الفاصلة، فهو لا يساوي 34', 'نعم: الحاسبة تعرض دائمًا القيمة المضبوطة', 'نعم: لأنّه أدقّ من 5,83'],
            correct: 0,
            explain: 'مربّع 5,830951895 له 18 رقمًا بعد الفاصلة آخرها 5، أمّا 34 فعدد طبيعي: هما مختلفان. الحاسبة لا تعرض إلا قيمة مقربة، والقيمة المضبوطة هي $\\sqrt{34}$.' },
          { kind: 'solution', ask: 1, lines: [
            '$5{,}83^2 = 33{,}9889$ و $33{,}9889 \\neq 34$: العدد 5,83 ليس القيمة المضبوطة لطول الضلع.',
            'مربّع 5,830951895 له 18 رقمًا بعد الفاصلة آخرها 5، فهو لا يساوي 34: هذا العدد ليس القيمة المضبوطة أيضًا.',
            'العددان 5,83 و 5,830951895 قيمتان مقربتان لطول الضلع، وقيمته المضبوطة هي $\\sqrt{34}\\,m$.',
          ] },
        ],
      },
      {
        label: '3)', title: 'العشب والإطار',
        question: 'احسب ثمن العشب اللازم لتغطية الحوض، ثم احسب ثمن الإطار الذي يحيط به، علمًا أنّ الإطار يُباع بالمتر الكامل.',
        asks: ['ثمن العشب', 'ثمن الإطار'],
        steps: [
          { kind: 'choice', role: 'translate', requires: ['murabba-jidhr'],
            prompt: 'مساحة العشب اللازمة بالضبط هي:',
            options: ['$(\\sqrt{34})^2 = 34\\,m^2$', '$5{,}83^2 = 33{,}9889\\,m^2$', '$4 \\times 5{,}83 = 23{,}32\\,m^2$', '$\\sqrt{34}\\,m^2$'],
            correct: 0, cols: 2,
            explain: 'مساحة الحوض هي مربّع ضلعه $\\sqrt{34}$، و $(\\sqrt{34})^2 = 34$ بالضبط. أمّا $5{,}83^2$ فمساحة مربّع آخر أصغر قليلًا، و $4 \\times 5{,}83$ محيط لا مساحة.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'ثمن العشب:', expected: 11900, suffix: 'دج',
            explain: '$34 \\times 350 = 11900$.' },
          { kind: 'numeric', role: 'compute', requires: ['qima-mudbuta'],
            prompt: 'محيط الحوض بقيمة الحاسبة، مدوّرًا إلى 0,01:', expected: 23.32, suffix: 'm',
            explain: 'المحيط أربعة أضلاع: $4 \\times 5{,}830951895 = 23{,}32380758$، أي 23,32 m تقريبًا.' },
          { kind: 'choice', role: 'conclude',
            prompt: 'كم مترًا من الإطار يجب شراؤه؟',
            options: ['24 مترًا: 23 مترًا أقصر من المحيط فلا تكفي', '23 مترًا: نحذف الجزء العشري من 23,32', '34 مترًا: بعدد الأمتار المربّعة'],
            correct: 0,
            explain: 'الإطار يُباع بالمتر الكامل، و 23 m أقلّ من 23,32 m فيبقى جزء من الحوض دون إطار: يلزم 24 m.' },
          { kind: 'numeric', role: 'answer', ask: 1, prompt: 'ثمن الإطار:', expected: 10800, suffix: 'دج',
            explain: '$24 \\times 450 = 10800$.' },
          { kind: 'solution', lines: [
            'مساحة الحوض: $(\\sqrt{34})^2 = 34$، أي $34\\,m^2$؛ ثمن العشب: $34 \\times 350 = 11900$، أي 11900 دج.',
            'محيط الحوض: $4 \\times 5{,}830951895 = 23{,}32380758$، أي حوالي 23,32 m، فيشتري البستاني 24 m من الإطار.',
            'ثمن الإطار: $24 \\times 450 = 10800$، أي 10800 دج.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-2',
    title: 'مسألة 2 — معرض الصور',
    context: 'لوحات مربّعة: ما طول الضلع؟',
    emoji: '🖼️',
    tone: 'emerald',
    source: SOURCE,
    illustration: { kind: 'tags', cards: [{ title: 'لوحة كبيرة 1', icon: 'house', lines: [{ label: 'المساحة', value: '1,96', unit: 'm²' }] }, { title: 'لوحة كبيرة 2', icon: 'house', lines: [{ label: 'المساحة', value: '1,44', unit: 'm²' }] }, { title: 'لوحة صغيرة', icon: 'house', lines: [{ label: 'المساحة', value: '0,9', unit: 'm²' }] }], ariaLabel: 'ثلاث لوحات مربّعة مساحاتها 1,96 m² و 1,44 m² و 0,9 m²' },
    statement: 'ينظّم المركز الثقافي للبلدية معرضًا لصور التراث، حفظًا لذاكرة الوطن، تُعرض فيه 40 صورة. يطبع المصوّر صورتين كبيرتين على لوحتين مربّعتين: الأولى مساحتها $1{,}96\\,m^2$ والثانية مساحتها $1{,}44\\,m^2$، ويريد أيضًا لوحة صغيرة مربّعة لمدخل المعرض مساحتها $0{,}9\\,m^2$. يحيط المصوّر كامل حواف اللوحتين الكبيرتين بإطار من الألمنيوم ثمن المتر منه 180 دج.',
    data: [
      { id: 'first', text: 'مساحة اللوحة الأولى 1,96 m²', useful: true },
      { id: 'second', text: 'مساحة اللوحة الثانية 1,44 m²', useful: true },
      { id: 'entry', text: 'مساحة لوحة المدخل 0,9 m²', useful: true },
      { id: 'shape', text: 'اللوحات الثلاث مربّعة', useful: true },
      { id: 'frame', text: 'إطار الألمنيوم على كامل حواف اللوحتين الكبيرتين: 180 دج للمتر', useful: true },
      { id: 'photos', text: 'في المعرض 40 صورة', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'ضلعا اللوحتين',
        question: 'ما طول ضلع اللوحة الأولى؟ وما طول ضلع اللوحة الثانية؟',
        asks: ['طول ضلع اللوحة الأولى', 'طول ضلع اللوحة الثانية'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'translate', requires: ['jidhr-taarif'],
            prompt: 'طول ضلع مربّع مساحته $1{,}96\\,m^2$ هو:',
            options: ['العدد الموجب الذي مربّعه 1,96', 'نصف العدد 1,96', 'ربع العدد 1,96', 'مربّع العدد 1,96'],
            correct: 0,
            explain: 'مساحة مربّع طول ضلعه $c$ هي $c^2$: الضلع عدد موجب مربّعه 1,96، أي $\\sqrt{1{,}96}$. الربع يخصّ المحيط لا المساحة.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['jidhr-taarif'],
            prompt: 'طول ضلع اللوحة الأولى:', expected: 1.4, suffix: 'm',
            explain: '1,4 عدد موجب و $1{,}4^2 = 1{,}96$: إذن $\\sqrt{1{,}96} = 1{,}4$.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['jidhr-taarif'],
            prompt: 'طول ضلع اللوحة الثانية:', expected: 1.2, suffix: 'm',
            explain: '1,2 عدد موجب و $1{,}2^2 = 1{,}44$: إذن $\\sqrt{1{,}44} = 1{,}2$.' },
          { kind: 'solution', ask: 0, lines: [
            'ضلع اللوحة الأولى عدد موجب مربّعه 1,96: $1{,}4^2 = 1{,}96$، إذن $\\sqrt{1{,}96} = 1{,}4$، أي $1{,}4\\,m$.',
            'ضلع اللوحة الثانية عدد موجب مربّعه 1,44: $1{,}2^2 = 1{,}44$، إذن $\\sqrt{1{,}44} = 1{,}2$، أي $1{,}2\\,m$.',
          ] },
        ],
      },
      {
        label: '2)', title: 'لوحة المدخل',
        question: 'يقول مساعد المصوّر: «ضلع لوحة المدخل هو $0{,}3\\,m$ لأنّ $3^2 = 9$». هل هو على صواب؟ ما القيمة المضبوطة لطول ضلع لوحة المدخل؟',
        asks: ['هل المساعد على صواب؟', 'القيمة المضبوطة لطول ضلع لوحة المدخل'],
        steps: [
          { kind: 'numeric', role: 'compute', requires: ['murabba-adad'],
            prompt: 'احسب $0{,}3^2$:', expected: 0.09,
            explain: '$0{,}3 \\times 0{,}3 = 0{,}09$: رقمان بعد الفاصلة.' },
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['jidhr-taarif'],
            prompt: 'هل المساعد على صواب؟',
            options: ['لا: $0{,}3^2 = 0{,}09$ وليس 0,9', 'نعم: لأنّ $3^2 = 9$', 'نعم: لأنّ $0{,}9 \\div 3 = 0{,}3$'],
            correct: 0,
            explain: 'مربّع ضلعه $0{,}3\\,m$ مساحته $0{,}09\\,m^2$ فقط، أي عُشر المساحة المطلوبة: 0,3 ليس العدد الذي مربّعه 0,9.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['jidhr-taarif', 'qima-mudbuta'],
            prompt: 'القيمة المضبوطة لطول ضلع لوحة المدخل هي:',
            options: ['$\\sqrt{0{,}9}\\,m$', '$0{,}3\\,m$', '$0{,}45\\,m$', '$0{,}81\\,m$'],
            correct: 0, cols: 2,
            explain: 'الضلع هو العدد الموجب الذي مربّعه 0,9، ونرمز له $\\sqrt{0{,}9}$. أمّا 0,45 فنصف 0,9، و 0,81 هو $0{,}9^2$.' },
          { kind: 'solution', ask: 0, lines: [
            '$0{,}3^2 = 0{,}09$ و $0{,}09 \\neq 0{,}9$: المساعد ليس على صواب.',
            'ضلع لوحة المدخل هو العدد الموجب الذي مربّعه 0,9، فقيمته المضبوطة $\\sqrt{0{,}9}\\,m$.',
          ] },
        ],
      },
      {
        label: '3)', title: 'إطار الألمنيوم',
        question: 'يُركَّب الإطار على كامل حواف اللوحتين الأولى والثانية. احسب طول الإطار اللازم، ثم احسب ثمنه.',
        asks: ['طول الإطار', 'ثمن الإطار'],
        steps: [
          { kind: 'choice', role: 'translate',
            prompt: 'طول الإطار اللازم هو مجموع:',
            options: ['محيطي اللوحتين: $4 \\times 1{,}4 + 4 \\times 1{,}2$', 'مساحتي اللوحتين: $1{,}96 + 1{,}44$', 'ضلعي اللوحتين: $1{,}4 + 1{,}2$'],
            correct: 0,
            explain: 'الإطار يدور على الأضلاع الأربعة لكل لوحة: نجمع المحيطين، لا المساحتين.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'طول الإطار:', expected: 10.4, suffix: 'm',
            explain: '$4 \\times 1{,}4 + 4 \\times 1{,}2 = 5{,}6 + 4{,}8 = 10{,}4$.' },
          { kind: 'numeric', role: 'answer', ask: 1, prompt: 'ثمن الإطار:', expected: 1872, suffix: 'دج',
            explain: '$10{,}4 \\times 180 = 1872$.' },
          { kind: 'solution', lines: [
            'محيط اللوحة الأولى: $4 \\times 1{,}4 = 5{,}6$، ومحيط الثانية: $4 \\times 1{,}2 = 4{,}8$.',
            'طول الإطار: $5{,}6 + 4{,}8 = 10{,}4$، أي $10{,}4\\,m$.',
            'ثمن الإطار: $10{,}4 \\times 180 = 1872$، أي 1872 دج.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-3',
    title: 'مسألة 3 — سلّم الحماية المدنية',
    context: 'إلى أيّ ارتفاع يصل السلّم؟',
    emoji: '🚒',
    tone: 'rose',
    source: SOURCE,
    illustration: { kind: 'ladder', object: 'ladder', base: 5, len: 13, unit: 'm', ariaLabel: 'سلّم طوله 13 m مسند إلى جدار عمارة وقاعدته تبعد 5 m عن الجدار' },
    statement: 'وصلت شاحنة الحماية المدنية في الوقت المناسب، وعلى متنها 6 أعوان يخدمون الناس بإخلاص، إلى عمارة لإنقاذ طفل عالق في شرفة على ارتفاع $9{,}6\\,m$ من الأرض. تحمل الشاحنة سلّمين: سلّم طوله $13\\,m$ وسلّم طوله $10\\,m$. يُسند السلّم إلى جدار العمارة العمودي، والأرض أفقية. وضع الأعوان أوّلًا السلّم الطويل بحيث تبعد قاعدته $5\\,m$ عن الجدار.',
    data: [
      { id: 'balcony', text: 'الشرفة على ارتفاع 9,6 m', useful: true },
      { id: 'ladders', text: 'سلّم طوله 13 m وسلّم طوله 10 m', useful: true },
      { id: 'right', text: 'الجدار عمودي والأرض أفقية', useful: true },
      { id: 'foot', text: 'قاعدة السلّم الطويل على بعد 5 m من الجدار', useful: true },
      { id: 'crew', text: 'على متن الشاحنة 6 أعوان', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'السلّم الطويل',
        question: 'على أيّ ارتفاع من الأرض يصل أعلى السلّم الطويل؟',
        asks: ['الارتفاع الذي يصل إليه أعلى السلّم الطويل'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'translate', requires: ['khassiyat-fithaghuras'],
            prompt: 'السلّم والجدار والأرض تشكّل:',
            options: ['مثلثًا قائمًا وتره السلّم', 'مثلثًا قائمًا وتره الجدار', 'مثلثًا قائمًا وتره الأرض', 'مربّعًا ضلعه السلّم'],
            correct: 0,
            explain: 'الجدار عمودي على الأرض: الزاوية القائمة عند أسفل الجدار، والسلّم يقابلها فهو الوتر.' },
          { kind: 'numeric', role: 'compute', requires: ['khassiyat-fithaghuras'],
            prompt: 'سمِّ $h$ الارتفاع الذي يصل إليه أعلى السلّم. احسب $h^2$:', expected: 144,
            explain: '$13^2 = 5^2 + h^2$، إذن $h^2 = 13^2 - 5^2 = 169 - 25 = 144$.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['jidhr-taarif', 'jidhr-murabba'],
            prompt: 'الارتفاع الذي يصل إليه أعلى السلّم الطويل:', expected: 12, suffix: 'm',
            explain: '$h$ موجب ومربّعه 144: $h = \\sqrt{144} = \\sqrt{12^2} = 12$.' },
          { kind: 'solution', ask: 0, lines: [
            'الجدار عمودي على الأرض، فبخاصية فيثاغورس: $13^2 = 5^2 + h^2$، إذن $h^2 = 169 - 25 = 144$.',
            '$h$ عدد موجب، إذن $h = \\sqrt{144} = \\sqrt{12^2} = 12$.',
            'يصل أعلى السلّم الطويل إلى ارتفاع $12\\,m$ من الأرض.',
          ] },
        ],
      },
      {
        label: '2)', title: 'السلّم القصير',
        question: 'احتاج الأعوان السلّم الطويل في تدخّل آخر، فوضعوا السلّم الذي طوله $10\\,m$ بحيث تبعد قاعدته $4\\,m$ عن الجدار. ما القيمة المضبوطة للارتفاع الذي يصل إليه أعلاه؟ هل يبلغ الشرفة؟',
        asks: ['القيمة المضبوطة للارتفاع', 'هل يبلغ الشرفة؟'],
        steps: [
          { kind: 'numeric', role: 'compute', requires: ['khassiyat-fithaghuras'],
            prompt: 'سمِّ $k$ هذا الارتفاع. احسب $k^2$:', expected: 84,
            explain: '$10^2 = 4^2 + k^2$، إذن $k^2 = 100 - 16 = 84$.' },
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['jidhr-taarif', 'qima-mudbuta'],
            prompt: 'القيمة المضبوطة للارتفاع $k$ هي:',
            options: ['$\\sqrt{84}\\,m$', '$6\\,m$', '$\\sqrt{116}\\,m$', '$42\\,m$'],
            correct: 0, cols: 2,
            explain: '$k$ عدد موجب مربّعه 84: $k = \\sqrt{84}$. أمّا $10 - 4 = 6$ فيطرح الطولين بدل مربّعيهما، و $100 + 16 = 116$ يجمع بدل أن يطرح، و 42 نصف 84.' },
          { kind: 'numeric', role: 'compute', requires: ['murabba-adad'],
            prompt: 'احسب $9{,}6^2$:', expected: 92.16,
            explain: '$9{,}6 \\times 9{,}6 = 92{,}16$.' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['murabba-jidhr'],
            prompt: 'هل يبلغ أعلى السلّم الشرفة؟',
            options: ['لا: $(\\sqrt{84})^2 = 84$ أصغر من $9{,}6^2 = 92{,}16$، فالارتفاع أقلّ من $9{,}6\\,m$', 'نعم: لأنّ 84 أكبر من 9,6', 'نعم: لأنّ طول السلّم $10\\,m$ أكبر من $9{,}6\\,m$'],
            correct: 0,
            explain: 'نقارن مربّعي العددين الموجبين: $(\\sqrt{84})^2 = 84$ و $9{,}6^2 = 92{,}16$. المربّع الأصغر للعدد الأصغر: $\\sqrt{84}$ أصغر من 9,6. أمّا 84 فمربّع الارتفاع لا الارتفاع نفسه، والسلّم مائل فلا يبلغ طوله كاملًا.' },
          { kind: 'solution', ask: 0, lines: [
            '$10^2 = 4^2 + k^2$، إذن $k^2 = 100 - 16 = 84$، و $k$ موجب: $k = \\sqrt{84}\\,m$.',
            '$(\\sqrt{84})^2 = 84$ و $9{,}6^2 = 92{,}16$، و 84 أصغر من 92,16: الارتفاع $\\sqrt{84}\\,m$ أقلّ من $9{,}6\\,m$.',
            'في هذا الوضع لا يبلغ أعلى السلّم الشرفة.',
          ] },
        ],
      },
      {
        label: '3)', title: 'تقريب القاعدة',
        question: 'على أيّ بعد من الجدار يجب أن توضع قاعدة السلّم القصير ليصل أعلاه إلى الشرفة بالضبط؟ وبكم سنتيمترًا يجب تقريبها من الجدار؟',
        asks: ['بعد القاعدة عن الجدار', 'بكم سنتيمترًا نقرّبها؟'],
        steps: [
          { kind: 'numeric', role: 'compute', requires: ['khassiyat-fithaghuras'],
            prompt: 'سمِّ $d$ بعد القاعدة عن الجدار. احسب $d^2$:', expected: 7.84,
            explain: '$10^2 = d^2 + 9{,}6^2$، إذن $d^2 = 100 - 92{,}16 = 7{,}84$.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['jidhr-taarif'],
            prompt: 'بعد القاعدة عن الجدار:', expected: 2.8, suffix: 'm',
            explain: '$d$ موجب و $2{,}8^2 = 7{,}84$: إذن $d = \\sqrt{7{,}84} = 2{,}8$.' },
          { kind: 'numeric', role: 'answer', ask: 1, prompt: 'المسافة التي تُقرَّب بها القاعدة:', expected: 120, suffix: 'cm',
            explain: '$4 - 2{,}8 = 1{,}2$، و $1{,}2\\,m$ هي 120 سنتيمترًا.' },
          { kind: 'solution', ask: 0, lines: [
            '$10^2 = d^2 + 9{,}6^2$، إذن $d^2 = 100 - 92{,}16 = 7{,}84$.',
            '$d$ موجب و $2{,}8^2 = 7{,}84$، إذن $d = \\sqrt{7{,}84} = 2{,}8$: توضع القاعدة على بعد $2{,}8\\,m$ من الجدار.',
            '$4 - 2{,}8 = 1{,}2$: يقرّب الأعوان القاعدة 120 سنتيمترًا من الجدار، فيبلغ أعلى السلّم الشرفة.',
          ] },
        ],
      },
    ],
  },
];

export const PROBLEM = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
