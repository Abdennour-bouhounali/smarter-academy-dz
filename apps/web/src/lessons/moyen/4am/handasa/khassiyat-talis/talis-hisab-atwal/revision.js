/**
 * « صفحة المراجعة » of the lesson (docs/architecture/REVISION_PAGE.md): plain data, drawn by features/revision.
 * Own wording and own numbers: nothing is copied from the exercise bank or the textbook. Every equality is checked by
 * revision.test.js. Reached only through the lesson's pack (`lesson.pack.js › revision`).
 * The figures (common/components/geoFigure.js) are computed, not drawn by eye: parallels are parallel, aligned points
 * are aligned, and each length is in proportion to its label.
 */
export const REVISION = {
  intro:
    'هذه الصفحة للمراجعة، اقرأها خطوة بخطوة. حُلّ كلّ تمرين على ورقتك قبل أن تفتح الحلّ. وحدة الطول هي cm ما لم تُذكر وحدة أخرى.',
  steps: [
    {
      id: 'recall',
      short: 'أتذكّر',
      title: 'أتذكّر: التناسب والجداء المتصالب',
      blocks: [
        {
          kind: 'text',
          text: 'كسران متساويان: جداء الطرفين يساوي جداء الوسطين. ومنه نحسب حدًّا مجهولًا.',
        },
        {
          kind: 'rule',
          tag: null,
          body: [{ formula: '$\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Leftrightarrow\\; a \\times d = b \\times c$' }],
        },
        {
          kind: 'example',
          tag: 'مثال',
          body: [
            {
              p: '$\\dfrac{3}{4} = \\dfrac{6}{8}$ لأنّ $3 \\times 8 = 4 \\times 6$. و $\\dfrac{2}{5} = \\dfrac{x}{15}$ يعطي $x = \\dfrac{2 \\times 15}{5} = 6$.',
            },
          ],
        },
        {
          kind: 'task',
          title: 'تحقّق',
          level: null,
          body: [{ p: 'عيّن $x$ حيث $\\dfrac{5}{8} = \\dfrac{x}{24}$.' }],
          solution: ['$x = \\dfrac{5 \\times 24}{8} = 15$.'],
        },
      ],
    },
    {
      id: 'lesson',
      short: 'الدرس',
      title: 'الدرس',
      blocks: [
        {
          kind: 'rule',
          tag: 'خاصية طالس: وضعية المثلث',
          body: [
            {
              p: '$ABC$ مثلث، $M$ نقطة من $[AB]$ و $N$ نقطة من $[AC]$. إذا كان $(MN) \\parallel (BC)$ فإنّ:',
            },
            {
              formula:
                '$\\dfrac{AM}{\\textcolor{#e11d48}{AB}} = \\dfrac{AN}{\\textcolor{#e11d48}{AC}} = \\dfrac{MN}{BC}$',
            },
            { p: 'كلّ طول من الرأس $A$ على الضلع كلّه، والضلع الموازي على الضلع الموازي.' },
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: { A: [6.875, 7.262], B: [0, 0], C: [20, 0], M: [2.75, 2.905], N: [14.75, 2.905] },
            segments: [['A', 'B'], ['A', 'C'], { from: 'B', to: 'C', arrows: 1 }, { from: 'M', to: 'N', arrows: 1 }],
            polygons: [{ points: ['A', 'M', 'N'], tone: 'indigo' }],
            ariaLabel: 'مثلث ABC، النقطة M من [AB] والنقطة N من [AC]، والمستقيم (MN) يوازي (BC)',
            maxWidth: 300,
          },
        },
        {
          kind: 'example',
          tag: 'مثال',
          body: [
            {
              p: '$AM = 6$ و $AB = 10$ و $AN = 9$ و $AC = 15$ و $MN = 12$ و $BC = 20$: $\\dfrac{6}{10} = \\dfrac{9}{15} = \\dfrac{12}{20} = \\dfrac{3}{5}$.',
            },
          ],
        },
        {
          kind: 'rule',
          tag: 'حساب طول مجهول',
          body: [
            {
              p: 'من النسب الثلاث آخذ نسبتين: واحدة فيها المجهول، وأخرى كلّها معلومة، ثمّ أحسب بالجداء المتصالب. إذا أُعطي الضلع قطعتين جمعتهما أوّلًا: $AB = AM + MB$.',
            },
            {
              formula:
                '$\\dfrac{AM}{AB} = \\dfrac{MN}{BC} \\;\\Rightarrow\\; MN = \\textcolor{#e11d48}{\\dfrac{AM \\times BC}{AB}}$',
            },
          ],
        },
        {
          kind: 'example',
          tag: 'مثال',
          body: [
            { p: '$AM = 6$ و $MB = 4$ و $BC = 20$: $AB = 6 + 4 = 10$، إذن $MN = \\dfrac{6 \\times 20}{10} = 12$.' },
          ],
        },
        {
          kind: 'rule',
          tag: 'خاصية طالس: وضعية الفراشة',
          body: [
            {
              p: 'المستقيمان $(AC)$ و $(BD)$ متقاطعان في $O$، والنقطتان $A$ و $C$ على جهتي $O$. إذا كان $(AB) \\parallel (CD)$ فإنّ:',
            },
            {
              formula:
                '$\\dfrac{OA}{\\textcolor{#e11d48}{OC}} = \\dfrac{OB}{\\textcolor{#e11d48}{OD}} = \\dfrac{AB}{CD}$',
            },
            { p: 'الأطوال تُقاس من نقطة التقاطع، وشريك كلّ طول على المستقيم نفسه.' },
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: { O: [0, 0], A: [-2.536, 5.438], B: [4.347, 6.716], C: [3.804, -8.157], D: [-6.52, -10.074] },
            segments: [['A', 'C'], ['B', 'D'], { from: 'A', to: 'B', arrows: 1 }, { from: 'C', to: 'D', arrows: 1 }],
            labels: { O: 'e' },
            ariaLabel: 'وضعية الفراشة: المستقيمان (AC) و (BD) متقاطعان في O، والمستقيم (AB) يوازي (CD)',
            maxWidth: 240,
          },
        },
        {
          kind: 'example',
          tag: 'مثال',
          body: [
            {
              p: '$OA = 6$ و $OC = 9$ و $OB = 8$ و $AB = 7$: $\\dfrac{6}{9} = \\dfrac{8}{OD} = \\dfrac{7}{CD}$، إذن $OD = \\dfrac{8 \\times 9}{6} = 12$ و $CD = \\dfrac{7 \\times 9}{6} = 10{,}5$.',
            },
          ],
        },
        {
          kind: 'rule',
          tag: 'معامل التناسبية $k$',
          body: [
            {
              p: 'في الوضعيتين، يُضرب كلّ طول من المثلث الأوّل في العدد نفسه $k$ فنحصل على موافقه في الثاني، والمحيط كذلك. إذا كان $k > 1$ فهو تكبير، وإذا كان $k < 1$ فهو تصغير، ومن الثاني إلى الأوّل نقلبه:',
            },
            { formula: "$MN = \\textcolor{#e11d48}{k} \\times BC \\qquad k' = \\textcolor{#e11d48}{\\dfrac{1}{k}}$" },
          ],
        },
        {
          kind: 'example',
          tag: 'مثال',
          body: [
            {
              p: "من $ABC$ إلى $AMN$: $k = \\dfrac{6}{10} = 0{,}6 < 1$، تصغير، و $MN = 0{,}6 \\times 20 = 12$. ومن $AMN$ إلى $ABC$: $k' = \\dfrac{5}{3} > 1$، تكبير.",
            },
          ],
        },
      ],
    },
    {
      id: 'examples',
      short: 'أمثلة محلولة',
      title: 'أمثلة محلولة',
      blocks: [
        {
          kind: 'figure',
          figure: {
            points: { A: [5.625, 8.268], B: [0, 0], C: [15, 0], E: [3.375, 4.961], F: [9.375, 4.961] },
            segments: [
              { from: 'A', to: 'E', label: '4' },
              { from: 'E', to: 'B', label: '6' },
              { from: 'A', to: 'F', label: '5' },
              ['F', 'C'],
              { from: 'B', to: 'C', label: '15', arrows: 1 },
              { from: 'E', to: 'F', arrows: 1 },
            ],
            ariaLabel:
              'مثلث ABC، النقطة E من [AB] والنقطة F من [AC]، و (EF) يوازي (BC)؛ AE = 4 و EB = 6 و AF = 5 و BC = 15',
            maxWidth: 280,
          },
        },
        {
          kind: 'example',
          tag: 'مثال 1: $(EF) \\parallel (BC)$، احسب $AC$ و $EF$',
          body: [
            {
              steps: [
                'الضلع من الرأس: $AB = AE + EB = 4 + 6 = 10$.',
                '$E \\in [AB]$ و $F \\in [AC]$ و $(EF) \\parallel (BC)$، إذن $\\dfrac{AE}{AB} = \\dfrac{AF}{AC} = \\dfrac{EF}{BC}$، أي $\\dfrac{4}{10} = \\dfrac{5}{AC} = \\dfrac{EF}{15}$.',
                '$AC = \\dfrac{5 \\times 10}{4} = 12{,}5$ و $EF = \\dfrac{4 \\times 15}{10} = 6$.',
              ],
            },
            { concl: '$AC = 12{,}5$ cm و $EF = 6$ cm.' },
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: { O: [0, 0], I: [-2.294, 3.277], J: [3.705, 3.357], K: [5.736, -8.192], L: [-9.263, -8.393] },
            segments: [
              { from: 'O', to: 'I', label: '4' },
              { from: 'O', to: 'K', label: '10' },
              { from: 'O', to: 'J', label: '5' },
              ['O', 'L'],
              { from: 'I', to: 'J', arrows: 1 },
              { from: 'K', to: 'L', label: '15', arrows: 1 },
            ],
            labels: { O: 'e' },
            ariaLabel:
              'وضعية الفراشة: (IK) و (JL) متقاطعان في O، و (IJ) يوازي (KL)؛ OI = 4 و OK = 10 و OJ = 5 و KL = 15',
            maxWidth: 240,
          },
        },
        {
          kind: 'example',
          tag: 'مثال 2: $(IJ) \\parallel (KL)$، احسب $OL$ و $IJ$',
          body: [
            {
              steps: [
                'النقط $I$ و $O$ و $K$ على استقامة، و $J$ و $O$ و $L$ على استقامة، و $(IJ) \\parallel (KL)$: وضعية الفراشة.',
                '$\\dfrac{OI}{OK} = \\dfrac{OJ}{OL} = \\dfrac{IJ}{KL}$، أي $\\dfrac{4}{10} = \\dfrac{5}{OL} = \\dfrac{IJ}{15}$.',
                '$OL = \\dfrac{5 \\times 10}{4} = 12{,}5$ و $IJ = \\dfrac{4 \\times 15}{10} = 6$.',
              ],
            },
            { concl: '$OL = 12{,}5$ cm و $IJ = 6$ cm.' },
          ],
        },
        {
          kind: 'example',
          tag: 'مثال 3: معامل التصغير في المثال 1',
          body: [
            {
              steps: [
                'من $ABC$ إلى $AEF$: $k = \\dfrac{AE}{AB} = \\dfrac{4}{10} = 0{,}4 < 1$، إذن $AEF$ تصغير للمثلث $ABC$.',
                'محيط $ABC$: $10 + 12{,}5 + 15 = 37{,}5$؛ ومحيط $AEF$: $0{,}4 \\times 37{,}5 = 15$.',
                'تحقّق: $4 + 5 + 6 = 15$.',
              ],
            },
            { concl: 'ومن $AEF$ إلى $ABC$ المعامل $\\dfrac{10}{4} = 2{,}5$: تكبير.' },
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: { A: [0, 0], M: [2, 0], N: [2, 1.5], B: [12, 0], C: [12, 9] },
            segments: [
              { from: 'A', to: 'M', label: '2 m' },
              { from: 'M', to: 'B', label: '10 m' },
              { from: 'M', to: 'N', label: '1,5 m' },
              ['B', 'C'],
              { from: 'A', to: 'C', dashed: true },
            ],
            rightAngles: [
              ['A', 'M', 'N'],
              ['A', 'B', 'C'],
            ],
            ariaLabel: 'عصا شاقولية [MN] طولها 1,5 m ونخلة [BC]؛ ظلّاهما ينتهيان في A حيث AM = 2 m و MB = 10 m',
            maxWidth: 300,
          },
        },
        {
          kind: 'example',
          tag: 'مثال 4: وضعية، ارتفاع نخلة',
          body: [
            {
              p: 'في وقت واحد، ينتهي ظلّ عصا شاقولية $[MN]$ طولها 1,5 m وظلّ نخلة $[BC]$ في النقطة نفسها $A$، حيث $AM = 2$ m و $MB = 10$ m. ما ارتفاع النخلة؟',
            },
            {
              steps: [
                'العصا والنخلة عموديتان على الأرض $(AB)$، إذن $(MN) \\parallel (BC)$.',
                '$M \\in [AB]$ و $N \\in [AC]$، و $AB = 2 + 10 = 12$: $\\dfrac{AM}{AB} = \\dfrac{MN}{BC}$، أي $\\dfrac{2}{12} = \\dfrac{1{,}5}{BC}$.',
                '$BC = \\dfrac{1{,}5 \\times 12}{2} = 9$.',
              ],
            },
            { concl: 'ارتفاع النخلة 9 m.' },
          ],
        },
      ],
    },
    {
      id: 'traps',
      short: 'أخطاء شائعة',
      title: 'أخطاء شائعة',
      blocks: [
        {
          kind: 'trap',
          tag: 'خطأ 1: القطعة بدل الضلع',
          body: [
            {
              p: 'في المثال 1، $\\dfrac{AE}{EB} = \\dfrac{4}{6}$ ليست من النسب الثلاث: المقام هو الضلع كلّه $AB = 10$. بالقطعة نجد $\\dfrac{4 \\times 15}{6} = 10$ بدل $EF = 6$.',
            },
          ],
        },
        {
          kind: 'trap',
          tag: 'خطأ 2: النسبة المقلوبة',
          body: [
            {
              p: '$\\dfrac{10 \\times 15}{4} = 37{,}5$ أطول من $BC = 15$، والنقطة $E$ بين $A$ و $B$: الطول $EF$ أقصر من $BC$. تحقّق دائمًا من معقولية النتيجة.',
            },
          ],
        },
        {
          kind: 'trap',
          tag: 'خطأ 3: الشريك الخطأ في الفراشة',
          body: [
            {
              p: 'شريك $OI$ هو $OK$ (على المستقيم نفسه $(IK)$)، لا $OL$. و $IK = OI + OK$ ليس ضلعًا في أيّ من المثلثين.',
            },
          ],
        },
        {
          kind: 'trap',
          tag: 'خطأ 4: نسيان التوازي',
          body: [
            {
              p: 'خاصية طالس لا تُطبّق إلّا إذا كان المستقيمان متوازيين: أذكر $(MN) \\parallel (BC)$ أوّلًا، ثمّ أكتب النسب.',
            },
          ],
        },
      ],
    },
    {
      id: 'exercises',
      short: 'تمارين',
      title: 'تمارين',
      blocks: [
        {
          kind: 'text',
          text: 'حُلّ على ورقتك ثمّ افتح الحلّ وقارن. التمارين مرتّبة من الأسهل إلى الأصعب.',
        },
        {
          kind: 'figure',
          figure: {
            points: { R: [1.2, -5.879], S: [0, 0], T: [5, 0], U: [0.48, -2.352], V: [3.48, -2.352] },
            segments: [['R', 'S'], ['R', 'T'], { from: 'S', to: 'T', arrows: 1 }, { from: 'U', to: 'V', arrows: 1 }],
            ariaLabel: 'مثلث RST، النقطة U من [RS] والنقطة V من [RT]، و (UV) يوازي (ST)',
            maxWidth: 180,
          },
        },
        {
          kind: 'task',
          title: 'تمرين 1',
          level: 'سهل',
          body: [{ p: 'في الشكل، $(UV) \\parallel (ST)$. اكتب النسب الثلاث المتساوية.' }],
          solution: ['$\\dfrac{RU}{RS} = \\dfrac{RV}{RT} = \\dfrac{UV}{ST}$: الأطوال من الرأس $R$.'],
        },
        {
          kind: 'task',
          title: 'تمرين 2',
          level: 'سهل',
          body: [{ p: 'عيّن $x$ حيث $\\dfrac{7}{x} = \\dfrac{21}{12}$.' }],
          solution: ['$21 \\times x = 7 \\times 12$، إذن $x = \\dfrac{7 \\times 12}{21} = 4$.'],
        },
        {
          kind: 'task',
          title: 'تمرين 3',
          level: 'متوسّط',
          body: [
            {
              p: '$ABC$ مثلث، $M \\in [AB]$ و $N \\in [AC]$ و $(MN) \\parallel (BC)$، مع $AM = 3$ و $AB = 9$ و $AN = 4$ و $BC = 12$. احسب $MN$ و $AC$.',
            },
          ],
          solution: [
            '$\\dfrac{3}{9} = \\dfrac{4}{AC} = \\dfrac{MN}{12}$.',
            '$MN = \\dfrac{3 \\times 12}{9} = 4$ و $AC = \\dfrac{4 \\times 9}{3} = 12$.',
          ],
        },
        {
          kind: 'task',
          title: 'تمرين 4',
          level: 'متوسّط',
          body: [
            {
              p: 'في الوضعية نفسها، $AM = 5$ و $MB = 3$ و $AN = 7{,}5$. احسب $AC$ ثمّ $NC$.',
            },
          ],
          solution: [
            '$AB = 5 + 3 = 8$، و $\\dfrac{5}{8} = \\dfrac{7{,}5}{AC}$، إذن $AC = \\dfrac{7{,}5 \\times 8}{5} = 12$.',
            '$NC = 12 - 7{,}5 = 4{,}5$.',
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: { O: [0, 0], E: [-5.196, 3.0], F: [4.526, 5.34], G: [7.794, -4.5], H: [-6.789, -8.01] },
            segments: [
              { from: 'O', to: 'E', label: '6' },
              { from: 'O', to: 'G', label: '9' },
              { from: 'O', to: 'F', label: '7' },
              ['O', 'H'],
              { from: 'E', to: 'F', arrows: 1 },
              { from: 'G', to: 'H', label: '15', arrows: 1 },
            ],
            labels: { O: 'n' },
            ariaLabel:
              'وضعية الفراشة: (EG) و (FH) متقاطعان في O، و (EF) يوازي (GH)؛ OE = 6 و OG = 9 و OF = 7 و GH = 15',
            maxWidth: 240,
          },
        },
        {
          kind: 'task',
          title: 'تمرين 5',
          level: 'متوسّط',
          body: [
            {
              p: 'في الشكل، $(EG)$ و $(FH)$ متقاطعان في $O$، و $(EF) \\parallel (GH)$، مع $OE = 6$ و $OG = 9$ و $OF = 7$ و $GH = 15$. احسب $OH$ و $EF$.',
            },
          ],
          solution: [
            '$\\dfrac{OE}{OG} = \\dfrac{OF}{OH} = \\dfrac{EF}{GH}$، أي $\\dfrac{6}{9} = \\dfrac{7}{OH} = \\dfrac{EF}{15}$.',
            '$OH = \\dfrac{7 \\times 9}{6} = 10{,}5$ و $EF = \\dfrac{6 \\times 15}{9} = 10$.',
          ],
        },
        {
          kind: 'task',
          title: 'تمرين 6',
          level: 'متوسّط',
          body: [
            {
              p: 'المثلثان $ABC$ و $AMN$ في وضعية طالس، والمعامل الذي يحوّل $ABC$ إلى $AMN$ هو $0{,}75$. 1) هل $AMN$ تكبير أم تصغير؟ 2) $BC = 16$ و $AB = 12$: احسب $MN$ و $AM$. 3) ما المعامل من $AMN$ إلى $ABC$؟',
            },
          ],
          solution: [
            '1) $0{,}75 < 1$: تصغير.',
            '2) $MN = 0{,}75 \\times 16 = 12$ و $AM = 0{,}75 \\times 12 = 9$.',
            '3) $\\dfrac{1}{0{,}75} = \\dfrac{4}{3}$.',
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: { A: [0, 0], M: [1.5, 0], N: [1.5, 0.45], B: [4, 0], C: [4, 1.2] },
            segments: [
              { from: 'A', to: 'M', label: '1,5 m' },
              { from: 'M', to: 'B', label: '2,5 m' },
              ['M', 'N'],
              { from: 'B', to: 'C', label: '1,2 m' },
              ['A', 'C'],
            ],
            rightAngles: [
              ['A', 'M', 'N'],
              ['A', 'B', 'C'],
            ],
            ariaLabel:
              'منحدر [AC] فوق أرض أفقية (AB)، وعمودان [MN] و [BC] عموديان على الأرض؛ AM = 1,5 m و MB = 2,5 m و BC = 1,2 m',
            maxWidth: 300,
          },
        },
        {
          kind: 'task',
          title: 'تمرين 7',
          level: 'وضعية',
          body: [
            {
              p: 'منحدر لتحميل البضائع $[AC]$ يرتكز على عمودين عموديين على الأرض: $[BC]$ طوله 1,2 m و $[MN]$ حيث $M \\in [AB]$ و $N \\in [AC]$، مع $AM = 1{,}5$ m و $MB = 2{,}5$ m. 1) برّر أنّ $(MN) \\parallel (BC)$. 2) احسب طول العمود $[MN]$.',
            },
          ],
          solution: [
            '1) المستقيمان $(MN)$ و $(BC)$ عموديان على المستقيم نفسه $(AB)$، إذن هما متوازيان.',
            '2) $AB = 1{,}5 + 2{,}5 = 4$، و $\\dfrac{AM}{AB} = \\dfrac{MN}{BC}$، إذن $MN = \\dfrac{1{,}5 \\times 1{,}2}{4} = 0{,}45$ m.',
          ],
        },
        {
          kind: 'figure',
          figure: {
            points: {
              A: [4.071, 6.299],
              B: [0, 0],
              C: [10.5, 0],
              M: [2.443, 3.779],
              N: [6.643, 3.779],
              E: [6.786, 10.498],
              F: [-0.214, 10.498],
            },
            segments: [
              ['E', 'B'],
              ['F', 'C'],
              { from: 'B', to: 'C', arrows: 1 },
              { from: 'M', to: 'N', arrows: 1 },
              { from: 'E', to: 'F', arrows: 1 },
            ],
            labels: { A: 'e' },
            ariaLabel:
              'مثلث ABC، (MN) يوازي (BC) حيث M من [AB] و N من [AC]؛ النقطة E على (AB) والنقطة F على (AC) من الجهة الأخرى للنقطة A، و (EF) يوازي (BC)',
            maxWidth: 220,
          },
        },
        {
          kind: 'task',
          title: 'تمرين 8',
          level: 'نحو الامتحان',
          body: [
            {
              p: '$ABC$ مثلث حيث $AB = 7{,}5$ و $AC = 9$ و $BC = 10{,}5$. $M \\in [AB]$ و $N \\in [AC]$ و $(MN) \\parallel (BC)$ مع $AM = 3$. النقطة $E$ من $(AB)$ والنقطة $F$ من $(AC)$ من الجهة الأخرى للنقطة $A$، و $(EF) \\parallel (BC)$ مع $AE = 5$.',
            },
            {
              p: '1) احسب $AN$ و $MN$.\n2) احسب معامل التصغير من $ABC$ إلى $AMN$، ثمّ استنتج محيط $AMN$.\n3) احسب $EF$.',
            },
          ],
          solution: [
            '1) $\\dfrac{3}{7{,}5} = \\dfrac{AN}{9} = \\dfrac{MN}{10{,}5}$، إذن $AN = \\dfrac{3 \\times 9}{7{,}5} = 3{,}6$ و $MN = \\dfrac{3 \\times 10{,}5}{7{,}5} = 4{,}2$.',
            '2) $k = \\dfrac{3}{7{,}5} = 0{,}4$. محيط $ABC$: $7{,}5 + 9 + 10{,}5 = 27$، ومحيط $AMN$: $0{,}4 \\times 27 = 10{,}8$ (و $3 + 3{,}6 + 4{,}2 = 10{,}8$).',
            '3) وضعية الفراشة حول $A$: $\\dfrac{AE}{AB} = \\dfrac{EF}{BC}$، إذن $EF = \\dfrac{5 \\times 10{,}5}{7{,}5} = 7$.',
          ],
        },
      ],
    },
    {
      id: 'summary',
      short: 'ملخّص القواعد',
      title: 'ملخّص القواعد',
      blocks: [
        {
          kind: 'table',
          head: ['القاعدة', 'بالرموز', 'مثال', 'انتبه'],
          rows: [
            [
              'وضعية المثلث: $M \\in [AB]$ و $N \\in [AC]$ و $(MN) \\parallel (BC)$',
              '$\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}$',
              '$\\dfrac{6}{10} = \\dfrac{9}{15} = \\dfrac{12}{20}$',
              'المقام هو الضلع كلّه لا القطعة',
            ],
            [
              'وضعية الفراشة: $(AC)$ و $(BD)$ متقاطعان في $O$ و $(AB) \\parallel (CD)$',
              '$\\dfrac{OA}{OC} = \\dfrac{OB}{OD} = \\dfrac{AB}{CD}$',
              '$\\dfrac{6}{9} = \\dfrac{8}{12} = \\dfrac{7}{10{,}5}$',
              'الشريكان على مستقيم واحد يمرّ بـ $O$',
            ],
            [
              'حساب طول: نسبتان والجداء المتصالب',
              '$MN = \\dfrac{AM \\times BC}{AB}$',
              '$\\dfrac{6 \\times 20}{10} = 12$',
              'اجمع القطعتين أوّلًا؛ وتحقّق من معقولية النتيجة',
            ],
            [
              'معامل التناسبية: أكبر من 1 تكبير، وأصغر من 1 تصغير',
              "$MN = k \\times BC$ ، $k' = \\dfrac{1}{k}$",
              "$k = 0{,}6$ و $k' = \\dfrac{5}{3}$",
              'يُضرب ولا يُضاف؛ ويُقلب في الاتّجاه الآخر',
            ],
          ],
        },
        {
          kind: 'note',
          text: 'في الامتحان: اكتب المعطيات (النقط على استقامة والمستقيمان متوازيان)، ثمّ «حسب خاصية طالس» والنسب الثلاث، ثمّ عوّض واحسب، واكتب الوحدة.',
        },
      ],
    },
    {
      id: 'quiz',
      short: 'اختبار سريع',
      title: 'اختبار سريع',
      blocks: [
        {
          kind: 'text',
          text: 'اختر الإجابة الصحيحة. تظهر النتيجة فورًا.',
        },
      ],
    },
  ],
  quiz: [
    {
      q: '$M \\in [AB]$ و $N \\in [AC]$ و $(MN) \\parallel (BC)$. النسبة التي تساوي $\\dfrac{AN}{AC}$ هي:',
      options: ['$\\dfrac{MN}{BC}$', '$\\dfrac{AN}{NC}$', '$\\dfrac{BC}{MN}$'],
      correct: 0,
      why: 'النسب الثلاث: $\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}$.',
    },
    {
      q: 'في الوضعية نفسها، $AM = 2$ و $AB = 8$ و $BC = 12$. الطول $MN$ يساوي:',
      options: ['$48$', '$3$', '$6$'],
      correct: 1,
      why: '$MN = \\dfrac{2 \\times 12}{8} = 3$.',
    },
    {
      q: '$AM = 4$ و $MB = 6$. النسبة $\\dfrac{AM}{AB}$ تساوي:',
      options: ['$\\dfrac{2}{3}$', '$\\dfrac{3}{2}$', '$\\dfrac{2}{5}$'],
      correct: 2,
      why: '$AB = 4 + 6 = 10$ و $\\dfrac{4}{10} = \\dfrac{2}{5}$.',
    },
    {
      q: '$(AC)$ و $(BD)$ متقاطعان في $O$، و $(AB) \\parallel (CD)$، مع $OA = 3$ و $OC = 6$ و $AB = 4$. الطول $CD$ يساوي:',
      options: ['$2$', '$8$', '$7$'],
      correct: 1,
      why: '$\\dfrac{OA}{OC} = \\dfrac{AB}{CD}$، إذن $CD = \\dfrac{4 \\times 6}{3} = 8$.',
    },
    {
      q: 'في وضعية الفراشة، الطول الذي يقابل $OB$ في النسب هو:',
      options: ['$OD$', '$OC$', '$BD$'],
      correct: 0,
      why: '$OB$ و $OD$ على المستقيم نفسه $(BD)$ الذي يمرّ بـ $O$.',
    },
    {
      q: 'المعامل الذي يحوّل المثلث $OAB$ إلى المثلث $OCD$ هو $\\dfrac{5}{4}$. المثلث $OCD$:',
      options: ['تصغير للمثلث $OAB$', 'تكبير للمثلث $OAB$', 'يطابق المثلث $OAB$'],
      correct: 1,
      why: '$\\dfrac{5}{4} > 1$: تكبير.',
    },
    {
      q: 'وفي الاتّجاه الآخر، المعامل من $OCD$ إلى $OAB$ هو:',
      options: ['$\\dfrac{5}{4}$', '$-\\dfrac{5}{4}$', '$\\dfrac{4}{5}$'],
      correct: 2,
      why: 'نقلب المعامل: $\\dfrac{5}{4} \\times \\dfrac{4}{5} = 1$.',
    },
  ],
  next: 'الدرس القادم: الخاصية العكسية لخاصية طالس، متى تثبت النسب المتساوية أنّ المستقيمين متوازيان؟',
};
