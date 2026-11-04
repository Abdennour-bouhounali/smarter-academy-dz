import React from 'react';
import MathText from '../../../../../common/components/MathText';
import RayFigure from './components/RayFigure';
import { ACTIVITY, ACTIVITY_B, KNOWLEDGE_3, KNOWLEDGE_4, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « المتراجحات من الدرجة الأولى بمجهول واحد » — SOURCE UNIQUE,
 * construite à partir du manuel (content/textbook.js). Une <KnowledgeBrick id="…"> dans un
 * module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 3, يونس)   mutarajiha, hal-mutarajiha — les deux lignes de l'encadré p. 45 ;
 *   module 2 (نشاط 3, حل)      tamthil-jadwal — le tableau du نشاط (x < 3, x ≥ 2) ;
 *   module 3 (معارف 3 و 4)     mutarajiha-ula, qawaid-ittijah, tamthil-bayani ;
 *   module 4 (طرائق p. 49)     tariqat-hal.
 */
const Lines = ({ lines }) => <ul className="list-disc space-y-1 ps-5">{lines.map((l) => <li key={l}><MathText>{l}</MathText></li>)}</ul>;

/** `memo` — la FICHE DE MÉMOIRE (MemoCard) : ce qui CHANGE est en rouge (`R`). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'mutarajiha', type: 'concepts', title: 'المتراجحة',
        memo: {
          rule: `ax+b\\ ${R('\\leq')}\\ c`,
          hook: 'متباينة فيها مجهول',
          example: `2{,}5x+100\\leq150`,
          trap: 'اعتبار المتراجحة صحيحة دائمًا',
          exam: 'أبيّن أنها تصحّ من أجل قيم دون أخرى',
          chip: `ax+b\\leq c`,
          quiz: [
            { q: 'المتراجحة متباينة فيها:', options: ['عددان فقط', 'مجهول', 'إشارة $=$ فقط'], correct: 1 },
            { q: 'من أجل $x = 16$ المتراجحة $2{,}5x+100\\leq150$:', options: ['خاطئة لأنّ $140 > 150$', 'صحيحة لأنّ $140 \\leq 150$', 'لا يمكن الحكم'], correct: 1 },
          ],
        },
        predictPrompt: 'في المختبر جرّبت 16 و 20 و 21 رسالة في الكتابة $2{,}5x + 100 \\leq 150$. بماذا تختلف هذه الكتابة عن متباينة عددية مثل $140 \\leq 150$؟ وهل هي صحيحة أم خاطئة؟ اكتب ما تلاحظه بكلماتك.',
        summary: 'متباينة فيها مجهول تُسمّى متراجحة ذات هذا المجهول: قد تكون صحيحة وقد تكون خاطئة حسب قيمه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.box[0]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$2{,}5x + 100 \\leq 150$ ، $150x + 100 \\leq 2{,}5$ ، $150x - 100 \\leq 2{,}5$'}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hal-mutarajiha', type: 'concepts', title: 'حلّ متراجحة',
        memo: {
          rule: `x_0:\\ ax_0+b\\leq c\\ ${R('\\checkmark')}`,
          hook: 'عدد يحقّق المتباينة فهو حلّ',
          example: `2{,}5\\times20+100\\leq150`,
          trap: 'عدّ العدد حلًّا دون تعويضه',
          exam: 'أعوّض العدد ثم أقارن الطرفين',
          chip: `x_0\\ \\checkmark`,
          quiz: [
            { q: 'هل $21$ حلّ للمتراجحة $2{,}5x+100\\leq150$؟', options: ['نعم لأنّ $152{,}5 \\leq 150$', 'لا لأنّ $152{,}5 > 150$', 'نعم لأنّ $21$ صحيح'], correct: 1 },
            { q: 'هل $20$ حلّ للمتراجحة نفسها؟', options: ['نعم لأنّ $150 \\leq 150$', 'لا لأنّ $150 = 150$', 'لا لأنّ $20$ زوجي'], correct: 0 },
          ],
        },
        predictPrompt: 'في المختبر تركت بعض أعداد الرسائل نقطة حمراء، وتركت أعداد أخرى نقطة رمادية. متى نقول إنّ عددًا «حلّ» للمتراجحة $2{,}5x + 100 \\leq 150$؟ اكتب القاعدة بكلماتك.',
        summary: 'كل قيمة للمجهول تجعل المتراجحة متباينة صحيحة تُسمّى حلًّا لهذه المتراجحة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.box[1]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$2{,}5 \\times 2 + 100 = 105$ و $105 \\leq 150$ : العدد 2 حلّ للمتراجحة $2{,}5x + 100 \\leq 150$.'}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tamthil-jadwal', type: 'regles', title: 'الحلول على مستقيم مدرّج',
        memo: {
          rule: `\\begin{aligned}x<b&:\\ b\\ ${R('\\times')}\\\\x\\leq b&:\\ b\\ ${R('\\checkmark')}\\end{aligned}`,
          hook: 'الحدّ حلّ أم لا',
          example: `x<3:\\ 3\\ \\times`,
          trap: 'تلوين الجهة وإهمال الحدّ',
          exam: 'أبيّن موضع الحدّ واتجاه الرمز',
          chip: `x<b\\ \\times\\ ,\\ x\\leq b\\ \\checkmark`,
          quiz: [
            { q: 'في المتراجحة $x<3$ العدد $3$:', options: ['حلّ', 'ليس حلًّا', 'لا يمكن الحكم'], correct: 1 },
            { q: 'في المتراجحة $x\\geq2$ الرمز عند $2$:', options: ['موجّه نحو الجزء الملوّن', 'غير موجّه نحوه', 'غير موجود'], correct: 0 },
          ],
        },
        // Le tableau du نشاط 3 est la donnée de la question qui précède la brique (déjà à l'écran,
        // complété par l'élève) : une prédiction ne ferait que le recopier. La règle prédictible
        // (sens du رمز ⇔ la borne est solution) est tamthil-bayani, au module 3.
        predict: false,
        summary: 'نمثّل حلول متراجحة على مستقيم مدرّج بجزء ملوّن يحدّه رمز عند الحدّ، كما في جدول النشاط 3.',
        body: (
          <div className="space-y-2">
            {ACTIVITY_B.table.map((row) => (
              <div key={row.inequality} className="space-y-1">
                <p className="text-sm"><MathText>{`${row.inequality} : ${row.words}`}</MathText></p>
                <RayFigure {...row.figure} label={row.graph.replace(/\$/g, '')} />
              </div>
            ))}
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'mutarajiha-ula', type: 'concepts', title: 'متراجحة من الدرجة الأولى',
        memo: {
          rule: `ax+b\\ ${R('\\leq')}\\ cx+d`,
          hook: 'نبحث عن كل الحلول',
          example: `-3x+5\\leq20`,
          trap: 'الاكتفاء بحلّ واحد بدل كل الحلول',
          exam: 'أبحث عن كل الحلول لا عن حلّ واحد',
          chip: `ax+b\\leq c`,
          quiz: [
            { q: 'حلّ متراجحة يعني إيجاد:', options: ['حلّ واحد', 'كل حلولها', 'الحدّ فقط'], correct: 1 },
            { q: 'أيّ كتابة متراجحة من الدرجة الأولى بمجهول واحد؟', options: ['$2x-3\\leq5$', '$x^2\\leq4$', '$3\\leq5$'], correct: 0 },
          ],
        },
        predictPrompt: 'عرفت في الدرس 1 المعادلة من الدرجة الأولى بمجهول واحد. متى نقول إنّ متراجحة مثل $-3x + 5 \\leq 20$ «من الدرجة الأولى بمجهول واحد»؟ وماذا يُطلب منك حين يُقال لك «حلّ هذه المتراجحة»؟ اكتب الجوابين بكلماتك.',
        summary: 'حل متراجحة هو إيجاد كل حلولها؛ وتكون من الدرجة الأولى بمجهول واحد إذا أمكن كتابتها على أحد الأشكال الأربعة للكتاب.',
        body: (
          <div className="space-y-2">
            <Lines lines={KNOWLEDGE_3.definition} />
            <p><MathText>{KNOWLEDGE_3.firstDegree}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qawaid-ittijah', type: 'regles', title: 'قواعد اتجاه المتراجحة',
        memo: {
          rule: `\\begin{aligned}a\\leq b&\\Rightarrow ac\\leq bc\\ (c>0)\\\\a\\leq b&\\Rightarrow ac${R('\\geq')}bc\\ (c<0)\\end{aligned}`,
          hook: 'السالب يقلب الاتجاه',
          example: `-3x\\leq15\\to x${R('\\geq')}-5`,
          trap: 'نسيان قلب الاتجاه عند القسمة على سالب',
          exam: 'أنتبه إلى إشارة العدد عند الضرب أو القسمة',
          chip: `\\div(-3):\\ \\leq\\to\\geq`,
          quiz: [
            { q: 'من $-2x\\leq6$ نحصل بالقسمة على $-2$ على:', options: ['$x\\leq-3$', '$x\\geq-3$', '$x\\geq3$'], correct: 1 },
            { q: 'إضافة $5$ إلى طرفي متراجحة:', options: ['تقلب الاتجاه', 'تُبقي الاتجاه', 'تلغي المتراجحة'], correct: 1 },
          ],
        },
        predictPrompt: 'في المختبر حوّلت $-3x + 5 \\leq 20$ خطوة خطوة: بعد طرح 5 قبلت نقاطك الحمراء الاتجاه نفسه، وبعد القسمة على $-3$ رفضته. متى يبقى اتجاه المتراجحة كما هو، ومتى يتغيّر؟ اكتب قاعدة لكل عملية: الإضافة والطرح، ثم الضرب والقسمة.',
        summary: 'نحافظ على الاتجاه بإضافة عدد أو طرحه أو بالضرب أو القسمة على عدد موجب تمامًا، ونغيّره بالضرب أو القسمة على عدد سالب تمامًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE_3.rulesIntro}</MathText></p>
            <Lines lines={KNOWLEDGE_3.rules} />
          </div>
        ),
      },
      {
        id: 'tamthil-bayani', type: 'regles', title: 'التمثيل البياني للحلول',
        memo: {
          rule: `x\\leq b\\to${R(']')}\\qquad x<b\\to${R('[')}`,
          hook: 'الحدّ حلّ فالرمز نحو الأحمر',
          example: `x\\leq\\tfrac{3}{5}\\to${R(']')}`,
          trap: 'توجيه الرمز بحسب الجهة وحدها',
          exam: 'أحدّد الحدّ ثم أبرّر اتجاه الرمز',
          chip: `x\\leq b\\to\\ ]`,
          quiz: [
            { q: 'في $x>6$ الرمز عند $6$:', options: ['موجّه نحو الجزء الملوّن', 'غير موجّه نحوه', 'لا رمز'], correct: 1 },
            { q: 'في $x\\leq\\frac{3}{5}$ الحدّ حلّ لأنّ:', options: ['$\\frac{3}{5}\\leq\\frac{3}{5}$ صحيحة', '$\\frac{3}{5}<\\frac{3}{5}$ صحيحة', 'الجزء الملوّن على اليسار فقط'], correct: 0 },
          ],
        },
        predictPrompt: 'في الرسم أعلاه ($x \\leq \\frac{3}{5}$) الرمز عند $\\frac{3}{5}$ موجّه نحو الجزء الملوّن، وفي جدول النشاط كان الرمز عند 3 ($x < 3$) غير موجّه نحوه. متى نوجّه الرمز عند الحدّ نحو الجزء الملوّن، ومتى لا نوجّهه؟ اكتب القاعدة.',
        summary: 'نلوّن الحلول بالأحمر على المستقيم المدرّج؛ والرمز عند الحدّ موجّه نحو الجزء الملوّن إذا كان الحدّ حلًّا، وغير موجّه نحوه إذا لم يكن.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE_4.definition}</MathText></p>
            <RayFigure {...KNOWLEDGE_4.figure1} label="الجزء الملوّن بالأحمر على يسار ثلاثة أخماس، والرمز موجّه نحوه" />
            <p className="text-sm"><MathText>{KNOWLEDGE_4.note1}</MathText></p>
            <RayFigure {...KNOWLEDGE_4.figure2} label="الجزء الملوّن بالأحمر على يمين 6، والرمز غير موجّه نحوه" />
            <p className="text-sm"><MathText>{KNOWLEDGE_4.note2}</MathText></p>
          </div>
        ),
      },
    ],
    4: [
      {
        id: 'tariqat-hal', type: 'methodes', title: 'طريقة: حل متراجحة',
        memo: {
          rule: `\\begin{aligned}(a-c)x&\\leq d-b\\\\a-c>0&:\\ x\\leq\\dfrac{d-b}{a-c}\\\\a-c<0&:\\ x${R('\\geq')}\\dfrac{d-b}{a-c}\\end{aligned}`,
          hook: 'اجمع ثم اقسم وانتبه للإشارة',
          example: `-8x<-4\\to x>\\tfrac{1}{2}`,
          trap: 'القسمة على معامل سالب دون قلب الاتجاه',
          exam: 'أبيّن إشارة المعامل ثم أحدّد الاتجاه',
          chip: `-8x<-4\\to x>\\tfrac{1}{2}`,
          quiz: [
            { q: 'أول خطوة في حلّ $-7x+1<x-3$:', options: ['نقل حدود $x$ إلى طرف والأعداد إلى الآخر', 'القسمة على $-7$ فقط', 'رسم المستقيم'], correct: 0 },
            { q: 'من $-8x<-4$ نكتب بعد القسمة على $-8$:', options: ['$x<\\frac{1}{2}$', '$x>\\frac{1}{2}$', '$x=\\frac{1}{2}$'], correct: 1 },
          ],
        },
        predictPrompt: 'قرأت حلّي المتراجحتين $-7x + 1 < x - 3$ و $\\frac{3x + 2}{6} \\geq \\frac{2x - 3}{5}$ سطرًا سطرًا. لو أعطيناك متراجحة أخرى من الدرجة الأولى، بأيّ خطوات تحلّها، وكيف تنهي عملك؟ اكتب الطريقة.',
        summary: 'ننقل حدود المجهول إلى طرف والأعداد إلى الطرف الآخر، نقسم على المعامل منتبهين إلى إشارته، ثم نلوّن الحلول بالأحمر على المستقيم المدرّج.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.solutionA[2]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
