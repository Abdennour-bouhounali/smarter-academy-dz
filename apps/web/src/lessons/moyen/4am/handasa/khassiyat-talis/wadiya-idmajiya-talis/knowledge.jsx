import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** Le rouge de la fiche de mémoire (MemoCard) : ce qui CHANGE dans la règle. */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du manuel
 * (قراءة → تحليل واختيار استراتيجية → تنفيذ) appliquée au تحدّ et à la وضعية, et la méthode du test final.
 *   tariqat-zill         module 7 — la hauteur de la minaret par l'ombre d'un bâton (le تحدّ)
 *   maqta-mihwari-talis  module 7 — du solide à la coupe axiale : deux triangles de sommet O en situation de Thalès
 *   muadala-bud          module 7 — la condition h = r transforme l'égalité de Thalès en équation du premier degré
 *   mulaamat-natija      module 7 — le volume (exact puis approché) et la vérification que les dimensions sont possibles
 *   tariqat-wadiya       module 7 — la démarche en trois phases (les mots du manuel)
 * Les réponses de « وضعية الاختبار النهائي » (un autre cornet, une autre minaret) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'tariqat-zill', type: 'methodes', title: 'طريقة الظل: ارتفاع لا نصل إليه',
        memo: {
          rule: `H=h\\times${R("\\dfrac{S}{s}")}`,
          hook: 'نسبة الظلّين تعطي الارتفاع',
          example: `H=1\\times\\dfrac{11{,}6}{1{,}6}=${R("7{,}25")}`,
          trap: 'نخلط بين ظلّ المئذنة وارتفاعها',
          exam: 'اذكر أن أشعة الشمس متوازية فالمثلثان في وضعية طالس، ثم احسب',
          chip: `H=h\\times\\tfrac{S}{s}`,
          quiz: [
            { q: "عصا طولها $1$ m ظلّها $1{,}6$ m ، وظلّ مئذنة $11{,}6$ m في اللحظة نفسها. ارتفاع المئذنة:", options: ["$7{,}25$ m", "$11{,}6$ m", "$12{,}6$ m"], correct: 0 },
            { q: "تصحّ الطريقة لأن:", options: ["أشعة الشمس متوازية فالمثلثان في وضعية طالس", "الظلّين متساويان", "المئذنة والعصا متساويتان"], correct: 0 },
          ],
        }, summary: 'نغرس عصا شاقولية حيث ينتهي ظلّها مع ظلّ المئذنة؛ المثلثان في وضعية طالس، فارتفاع المئذنة يساوي طول العصا مضروبا في نسبة الظلّين.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.zillMethod}</MathText></li>
            <li><MathText>{REMARKS.zillWhy}</MathText></li>
            <li><MathText>{'$\\dfrac{AM}{BE} = \\dfrac{OA}{OB}$'}</MathText></li>
          </ul>
        ) },
      { id: 'maqta-mihwari-talis', type: 'methodes', title: 'من المجسّم إلى المقطع المحوري',
        memo: {
          rule: `\\dfrac{r}{R}=${R("\\dfrac{H-h}{H}")}`,
          hook: 'المقطع المحوري: مستطيل في مثلث',
          example: `\\dfrac{r}{6}=${R("\\dfrac{18-h}{18}")}`,
          trap: 'نكتب h بدل H − h في الطرف الآخر',
          exam: 'ارسم المقطع المحوري ثم اكتب خاصية طالس في المثلث ذي الرأس O',
          chip: `\\tfrac{r}{R}=\\tfrac{H-h}{H}`,
          quiz: [
            { q: "في مخروط ($H=18$ ، $R=6$) وأسطوانة طولها $h$ : $\\frac{r}{6}=$", options: ["$\\frac{18-h}{18}$", "$\\frac{h}{18}$", "$\\frac{18-h}{6}$"], correct: 0 },
            { q: "المقطع المحوري لأسطوانة داخل مخروط:", options: ["مستطيل داخل مثلث", "دائرة داخل مثلث", "مثلث داخل دائرة"], correct: 0 },
          ],
        }, summary: 'نقطع المخروط والأسطوانة بالمستوي الذي يشمل محورهما: يظهر مثلث فيه مستطيل، وحافة الأسطوانة على المولّد؛ المثلثان اللذان رأسهما O في وضعية طالس.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.maqta}</MathText></li>
            <li><MathText>{REMARKS.tawazi}</MathText></li>
            <li><MathText>{REMARKS.talisSection}</MathText></li>
          </ul>
        ) },
      { id: 'muadala-bud', type: 'methodes', title: 'شرط إضافي يعطي معادلة',
        memo: {
          rule: `h=r\\Rightarrow\\dfrac{r}{R}=\\dfrac{H-${R("r")}}{H}`,
          hook: 'عوّض الشرط ثم حلّ',
          example: `\\dfrac{r}{6}=\\dfrac{18-r}{18}\\Rightarrow${R("24r=108")}`,
          trap: 'نجمع حدود r قبل أن نحذف المقام',
          exam: 'عوّض h بـ r، اضرب جداء متصالبا، اجمع حدود r ثم اقسم',
          chip: `\\tfrac{r}{R}=\\tfrac{H-r}{H}`,
          quiz: [
            { q: "$\\frac{r}{6}=\\frac{18-r}{18}$ تعطي:", options: ["$24r=108$", "$12r=108$", "$18r=108$"], correct: 0 },
            { q: "إذن $r=$", options: ["$4{,}5$", "$6$", "$9$"], correct: 0 },
          ],
        }, summary: 'نعوّض الشرط الإضافي (الارتفاع يساوي نصف القطر) في المساواة التي تعطيها خاصية طالس، فنحصل على معادلة من الدرجة الأولى في r نحلّها.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.muadala}</MathText></li>
            <li><MathText>{REMARKS.halR}</MathText></li>
          </ul>
        ) },
      { id: 'mulaamat-natija', type: 'regles', title: 'الحجم وملاءمة النتيجة',
        memo: {
          rule: `V=\\pi\\times${R("r^2")}\\times h`,
          hook: 'مضبوط ثم مقرّب ثم تحقّق',
          example: `V=\\pi\\times4{,}5^2\\times4{,}5=${R("91{,}125\\,\\pi")}`,
          trap: 'ننسى مربّع نصف القطر',
          exam: 'اكتب الحجم مضبوطا ثم مقرّبا، وتحقّق أن أبعاد الأسطوانة أصغر من أبعاد المخروط',
          chip: `V=\\pi r^2h`,
          quiz: [
            { q: "حجم أسطوانة نصف قطرها $2$ وطولها $3$ هو:", options: ["$12\\pi$", "$6\\pi$", "$18\\pi$"], correct: 0 },
            { q: "نتحقّق من ملاءمة النتيجة بأن:", options: ["نصف قطر الأسطوانة أصغر من نصف قطر المخروط وطولها أصغر من ارتفاعه", "الحجم أكبر من $100$", "نصف القطر يساوي الطول دائما"], correct: 0 },
          ],
        }, summary: 'نحسب الحجم بقيمته المضبوطة ثم المقرّبة، ونتحقّق أنّ الأبعاد ممكنة: نصف قطر الأسطوانة أصغر من نصف قطر المخروط، وطولها أصغر من ارتفاعه.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.hajm}</MathText></li>
            <li><MathText>{REMARKS.mulaama}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب',
        memo: {
          rule: `1\\to2\\to3\\to${R("4")}`,
          hook: 'اقرأ، ارسم، طبّق، تحقّق',
          example: `H=7{,}25\\ \\to\\ r=4{,}5\\ \\to\\ V=${R("91{,}125\\,\\pi")}`,
          trap: 'ننتقل إلى الحساب قبل رسم الشكل المستوي',
          exam: 'اكتب الخاصية المستعملة ثم احسب وأنهِ بجملة تحقّق',
          chip: `1\\to2\\to3\\to4`,
          quiz: [
            { q: "بعد قراءة الوضعية وتحديد المطلوب نختار:", options: ["الشكل المستوي والخاصية المناسبة", "الجواب مباشرة", "الحجم مقرّبا"], correct: 0 },
            { q: "نختم الحل بـ:", options: ["التحقق من ملاءمة النتيجة", "نسخ المعطيات", "رسم شكل جديد"], correct: 0 },
          ],
        }, summary: 'نقرأ الوضعية ونحدّد المطلوب، نختار الشكل المستوي والخاصية المناسبة، ثم ننفّذ ونتحقّق من ملاءمة النتيجة للواقع.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: {analysisText(a)}</li>)}
          </ol>
        ) },
    ],
  },
};
