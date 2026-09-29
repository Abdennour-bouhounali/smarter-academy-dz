/**
 * La carte PROGRESSIVE du درس 7 — العددان الأوّليّان فيما بينهما.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A ; référence :
 * qasim-adad-tabii/knowledgeGraph.js.
 *
 * Sources : le manuel (content/textbook.js : نشاط 7 p. 9, معارف 5 p. 12), les
 * exercices 23, 27, 39 et le `commonError` de 39 (content/exercises.js), la
 * question 2 du module 1 (مريم). Les diviseurs de 17 et 18 sont CALCULÉS.
 *
 * L'item « أوليان فيما بينهما ≠ عددان أوليان » est un انتبه : une distinction
 * fine, que trois distracteurs de la leçon visent (« لأن 17 عدد أولي », « نعم:
 * كل عدد أولي فيما بينه وبين غيره عدد أولي », « a و b عددان أوليان »). Il ne
 * devient pas AUSSI un خطأ شائع : un seul nœud pour une seule idée.
 * « نصيحة » : l'exercice 27 — les règles de divisibilité DONNENT un diviseur
 * commun sans calcul (ce que l'item « لنفي … » annonce entre parenthèses).
 *
 *                   [أوليان فيما بينهما]                  مفهوم
 *                        معناه │
 *                        [التعريف]                        تعريف
 *        مثال ┌──────┬──────────┴───┬──────┐ انتبه إلى
 *        [17 و 18]    │               │   ⚠️ [ليسا بالضرورة أوليين]
 *           ننفيه بـ ┌┘               └┐ نثبته بـ
 *        [نفي أنهما أوليان]       [إثبات أنهما أوليان]      طريقتان
 *          نستعين بـ │                 │ مثال
 *      💡 [قابلية القسمة]            [143 و 153]
 *                    │                 │ خطأ شائع
 *                    │         ⛔ [القواعد لا تكفي]
 *                    └───────┬─────────┘ نستخلص
 *                    🎯 [نثبت أو ننفي]
 */
import { ACTIVITY, KNOWLEDGE } from './content/textbook';
import { EX } from './content/exercises';

const divisorsOf = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const stripLabel = (s) => s.replace(/^(أ|ب|جـ)\)\s*/, '');

const ex23 = EX['ex-23'];
const ex27 = EX['ex-27'];
const ex39 = EX['ex-39'];
// « الاعتقاد أن … تكفي: القواسم المشتركة ليست بالضرورة … » — l'erreur, puis sa raison.
const [ex39Wrong, ex39Why] = ex39.commonError.split(': ');
const row27 = (r) => `${r.label}: ${r.options[r.correct]} — ${r.correction}`;

export const KNOWLEDGE_GRAPH = {
  root: 'awwaliyan',
  nodes: [
    {
      id: 'awwaliyan', kind: 'concept', lane: 'center', requires: 'awwaliyan-taarif',
      title: 'أوليان فيما بينهما', subtitle: 'قاسمهما المشترك الوحيد 1',
      context: { text: stripLabel(ACTIVITY.questions[0]) },
      reveals: ['taarif'],
    },
    {
      id: 'taarif', kind: 'definition', lane: 'center', requires: 'awwaliyan-taarif', notebook: true,
      title: 'التعريف', subtitle: 'PGCD$(a ; b) = 1$',
      context: { text: KNOWLEDGE.definition },
      // L'ordre de la leçon : 17 et 18, la réfutation de مريم (module 1),
      // puis la mise en garde et la preuve (module 2).
      reveals: ['ex1718', 'nafy', 'laysa', 'ithbat'],
    },
    {
      id: 'ex1718', kind: 'example', lane: 'start', requires: 'awwaliyan-taarif',
      title: '17 و 18', subtitle: 'PGCD$(18 ; 17) = 1$',
      context: { list: [17, 18].map((n) => `قواسم ${n}: ${divisorsOf(n).join(' ، ')}`), note: ACTIVITY.questions[1] },
      reveals: [],
    },
    {
      id: 'nafy', kind: 'method', lane: 'start', requires: 'nafy-awwaliyan', notebook: true,
      title: 'نفي أنهما أوليان', subtitle: 'قاسم مشترك غير 1',
      reveals: ['tip'],
    },
    {
      // 💡 نصيحة — l'exercice 27 (et la réfutation de مريم, module 1, question 2).
      id: 'tip', kind: 'tip', lane: 'start', requires: 'nafy-awwaliyan',
      title: 'قابلية القسمة', subtitle: 'دون حساب',
      context: {
        text: ex27.question.explain,
        list: ex27.question.rows.slice(0, 2).map(row27),
        note: `${stripLabel(ACTIVITY.questions[3])} لا: 9 قاسم مشترك لـ 27 و 36، فـ PGCD(27 ; 36) = 9 ≠ 1.`,
      },
      reveals: [],
    },
    {
      // ⚠️ انتبه — l'item du module 2 ; son résumé suffit (pas de context).
      id: 'laysa', kind: 'warning', lane: 'end', requires: 'laysa-awwali', notebook: true,
      title: 'ليسا بالضرورة أوليين', subtitle: '15 و 22',
      reveals: [],
    },
    {
      id: 'ithbat', kind: 'method', lane: 'end', requires: 'ithbat-awwaliyan', notebook: true,
      title: 'إثبات أنهما أوليان', subtitle: 'PGCD $= 1$',
      reveals: ['ex143'],
    },
    {
      id: 'ex143', kind: 'example', lane: 'end', requires: 'ithbat-awwaliyan',
      title: '143 و 153', subtitle: 'آخر باقٍ غير معدوم: 1',
      context: { text: ex23.statement, list: [ex23.question.explain] },
      reveals: ['khata-qawaid'],
    },
    {
      // ⛔ خطأ شائع — l'exercice 39 (ليلى) : son `commonError` et sa réponse.
      id: 'khata-qawaid', kind: 'common_mistake', lane: 'end', requires: 'ithbat-awwaliyan',
      title: 'القواعد لا تكفي', subtitle: '253 و 407',
      context: {
        parts: [
          { role: 'wrong', text: `${ex39Wrong}.` },
          { role: 'why', text: ex39Why },
          // La réponse suffit ; l'explication de l'exercice finit sur une
          // égalité hors formule (« 11 = 253 ÷ 23 … ») que RTL renverserait.
          { role: 'right', text: ex39.question.options[ex39.question.correct] },
        ],
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — la définition et les deux méthodes, réunies.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'ithbat-awwaliyan',
      title: 'نثبت أو ننفي', subtitle: 'PGCD$(a ; b) = 1$',
      context: {
        text: 'العددان أوليان فيما بينهما معناه PGCD$(a ; b) = 1$. لنفي ذلك يكفي قاسم مشترك واحد يختلف عن 1؛ ولإثباته نحسب PGCD، بالحصر أو بخوارزمية إقليدس، ونجده 1.',
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'awwaliyan', to: 'taarif', label: 'معناه' },
    { from: 'taarif', to: 'ex1718', label: 'مثال' },
    { from: 'taarif', to: 'nafy', label: 'ننفيه بـ' },
    { from: 'nafy', to: 'tip', label: 'نستعين بـ' },
    { from: 'taarif', to: 'laysa', label: 'انتبه إلى' },
    { from: 'taarif', to: 'ithbat', label: 'نثبته بـ' },
    { from: 'ithbat', to: 'ex143', label: 'مثال' },
    { from: 'ex143', to: 'khata-qawaid', label: 'خطأ شائع' },
    { from: 'tip', to: 'khulasa', label: 'نستخلص' },
    { from: 'khata-qawaid', to: 'khulasa', label: 'نستخلص' },
  ],
};
