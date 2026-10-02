/**
 * La carte PROGRESSIVE du درس 1 « مفهوم جملة معادلتين من الدرجة الأولى بمجهولين » —
 * docs/architecture/KNOWLEDGE_MAP.md, Part A.
 *
 * Aucune mathématique n'est écrite ici : chaque texte vient de la leçon — le نشاط 1 et ses
 * calculs (content/textbook.js › ACTIVITY, ACTIVITY_LINES, ACT_A_OPTIONS), معارف 1, 2 et les
 * حالات خاصة (KNOWLEDGE, CASES_LINES, CHECK_METHOD), et le `commonError` / `method` / la
 * correction de l'exercice 4 (content/exercises.js). Chaque nœud est gardé par l'item de
 * knowledge.jsx qui l'établit (`requires`).
 *
 *   core   six items (notebook) + deux exemples (معارف 1, معارف 2 récrit avec « × ») ;
 *   guide  انتبه « l'ordre » (la ملاحظة, porte un item), خطأ شائع « la première équation
 *          seulement » (تمرين 4 — le piège (24 ; 8) du نشاط 1), خلاصة (معارف 2).
 * Rien de l'إختبار أولي (8x − 1 = y, (0 ; 0), (1/2 ; −1/2), le système en a et b, x + 2y = 3 et
 * 2x + 4y = 5, x + y = 5 et x − y = 1) n'est montré ici.
 *
 *                  [شرطان في آن واحد]                 m1
 *                          │ نعمّم
 *                   [جملة معادلتين]                   m2
 *              مثال ┌──────┴──────┐ حلّها
 *        [مثال الكتاب]          [حل الجملة]
 *                          ┌──────┘ نتحقق منه بـ
 *                    [نختبر ثنائية]
 *           خطأ شائع ┌──────┴──────┐ مثال
 *     ⛔ [معادلة واحدة]        [حل وليس حلا]
 *                 انتبه إلى ┌─────┤ حالتان خاصّتان
 *                   ⚠ [الترتيب]    │
 *                             [حالات خاصة]
 *                                  │ نستخلص
 *                              🎯 [خلاصة]
 */
import { ACTIVITY, ACTIVITY_LINES, KNOWLEDGE, CHECK_METHOD, EXAMPLE_LINES } from './content/textbook';
import { EX } from './content/exercises';

const ex4 = EX['ex-4-a'];

export const KNOWLEDGE_GRAPH = {
  root: 'nashat',
  nodes: [
    {
      id: 'nashat', kind: 'concept', lane: 'center', requires: 'jumla-nashat', notebook: true,
      title: 'شرطان في آن واحد', subtitle: '$(13 ; 19)$',
      context: { text: ACTIVITY.closing, note: ACTIVITY_LINES.check13 },
      reveals: ['tarif'],
    },
    {
      id: 'tarif', kind: 'definition', lane: 'center', requires: 'jumla-tarif', notebook: true,
      title: 'جملة معادلتين', subtitle: '$ax + by = c$',
      reveals: ['mithal-tarif', 'hall'],
    },
    {
      id: 'mithal-tarif', kind: 'example', lane: 'start', requires: 'jumla-tarif',
      title: 'مثال الكتاب', subtitle: "$b' = -5$",
      context: { text: KNOWLEDGE.system.example },
      reveals: [],
    },
    {
      id: 'hall', kind: 'definition', lane: 'end', requires: 'hall-jumla', notebook: true,
      title: 'حل الجملة', subtitle: 'في آن واحد',
      reveals: ['ikhtibar'],
    },
    {
      id: 'tartib', kind: 'warning', lane: 'start', requires: 'tartib-thunaiya', notebook: true,
      title: 'الترتيب مهم', subtitle: '$(2 ; 0)$ و $(0 ; 2)$',
      reveals: [],
    },
    {
      id: 'ikhtibar', kind: 'method', lane: 'center', requires: 'ikhtibar-thunaiya', notebook: true,
      title: 'نختبر ثنائية', subtitle: 'نعوّض في المعادلتين',
      reveals: ['khata-ex4', 'mithal-hall'],
    },
    {
      id: 'mithal-hall', kind: 'example', lane: 'end', requires: 'ikhtibar-thunaiya',
      title: 'حل وليس حلا', subtitle: '$(2 ; 0)$ و $(3 ; 1)$',
      context: { text: EXAMPLE_LINES.yes, note: EXAMPLE_LINES.no },
      reveals: ['tartib', 'halat'],
    },
    {
      // ⛔ خطأ شائع — le `commonError` de l'exercice 4 : la première équation seulement
      // (MISC-JUMLA-MUADALA-WAHIDA, le piège (24 ; 8) du نشاط 1).
      id: 'khata-ex4', kind: 'common_mistake', lane: 'start', requires: 'ikhtibar-thunaiya',
      title: 'معادلة واحدة لا تكفي', subtitle: '$(3 ; -2)$',
      context: {
        parts: [
          { role: 'wrong', text: ex4.commonError },
          { role: 'why', text: ex4.method },
          { role: 'right', text: ex4.question.explain },
        ],
      },
      reveals: [],
    },
    {
      id: 'halat', kind: 'relationship', lane: 'center', requires: 'halat-khassa', notebook: true,
      title: 'حالات خاصة', subtitle: 'لا حل أو حلول لا تنتهي',
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — la règle de معارف 2, puis la vérification.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'halat-khassa',
      title: 'خلاصة', subtitle: 'المعادلتان معًا',
      context: { text: KNOWLEDGE.solution.rule, note: CHECK_METHOD.rule },
      reveals: [],
    },
  ],
  edges: [
    { from: 'nashat', to: 'tarif', label: 'نعمّم' },
    { from: 'tarif', to: 'mithal-tarif', label: 'مثال' },
    { from: 'tarif', to: 'hall', label: 'حلّها' },
    { from: 'hall', to: 'ikhtibar', label: 'نتحقق منه بـ' },
    { from: 'ikhtibar', to: 'khata-ex4', label: 'خطأ شائع' },
    { from: 'ikhtibar', to: 'mithal-hall', label: 'مثال' },
    { from: 'mithal-hall', to: 'tartib', label: 'انتبه إلى' },
    { from: 'mithal-hall', to: 'halat', label: 'حالتان خاصّتان' },
    { from: 'halat', to: 'khulasa', label: 'نستخلص' },
  ],
};
