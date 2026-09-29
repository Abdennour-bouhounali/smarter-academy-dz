/**
 * La carte PROGRESSIVE de « أدمج تعلّماتي » — la séance d'INTÉGRATION de l'unité.
 * Contrat : docs/architecture/KNOWLEDGE_MAP.md, Part A (A.15, cas particulier) ;
 * référence : qasim-adad-tabii/knowledgeGraph.js.
 *
 * Une leçon à part, traitée à part :
 *   — elle n'introduit AUCUNE connaissance (knowledge.jsx : deux rappels) ;
 *     la carte ne lui en invente pas : elle montre la DÉMARCHE du manuel
 *     (قراءة → تحليل واستراتيجية → تنفيذ) et ce qu'elle mobilise ;
 *   — la SOLUTION (2440) n'y figure pas. Tout nœud est gardé par un item du
 *     module 1, alors que le module 3 (« أحلّ الوضعية ») est l'évaluation ; et
 *     le module 1 le dit lui-même : « هنا فهمنا واختطّينا الاستراتيجية فقط ».
 *   — « أؤكّد تعلّماتي » (module 2) renvoie aux leçons 1 à 7 : leurs cartes
 *     portent ces connaissances, celle-ci ne les recopie pas.
 *
 * Sources : content/textbook.js (SITUATION : énoncé, aide, données, analyse),
 * la question 3 du module 1 et sa remarque, le distracteur E1 de l'évaluation.
 *
 *                     [كم قطعة خزفية؟]                     مفهوم
 *                         نفهمها │
 *                     [قراءة الوضعية]                      فكرة أساسية
 *              تذكّر ┌──────┴──────┐ نختار استراتيجية
 *   📌 [قابلية القسمة على 10]   [الترميز بالحروف]            طريقة
 *          خطأ شائع │                │ نطبّقه
 *       ⛔ [مضاعف أم قاسم؟]      [أرقام العدد]              مثال
 *                    └──────┬─────────┘ نستخلص
 *                    🎯 [ثلاث مراحل]
 */
import { SITUATION } from './content/textbook';

const useful = SITUATION.data.filter((d) => d.useful);
const [fahm, istratijiya, tanfidh] = SITUATION.analysis;
const divisible = SITUATION.data.find((d) => d.id === 'div');
// Module 1, remarque finale : la carte s'arrête là où le manuel s'arrête.
const NOT_SOLVED_HERE = 'الحلّ نفسه في «أحلّ الوضعية»: هنا فهمنا واختطّينا الاستراتيجية فقط.';

export const KNOWLEDGE_GRAPH = {
  root: 'wadiya',
  nodes: [
    {
      id: 'wadiya', kind: 'concept', lane: 'center', requires: 'qabiliyat-10',
      title: 'كم قطعة خزفية؟', subtitle: SITUATION.imageCaption,
      context: { text: SITUATION.text },
      reveals: ['fahm'],
    },
    {
      id: 'fahm', kind: 'idea', lane: 'center', requires: 'qabiliyat-10',
      title: 'قراءة الوضعية', subtitle: 'مضاعف لـ 4 و 8 و 10',
      context: { text: fahm.text, list: useful.map((d) => d.text) },
      reveals: ['qabiliyat', 'tarmiz'],
    },
    {
      // 📌 تذكّر — l'item « تذكير » du module 1 (et l'aide du manuel).
      id: 'qabiliyat', kind: 'prerequisite', lane: 'start', requires: 'qabiliyat-10', notebook: true,
      title: 'قابلية القسمة على 10', subtitle: 'رقم الآحاد 0',
      reveals: ['khata'],
    },
    {
      // ⛔ خطأ شائع — l'évaluation (E1) : le distracteur « قاسم مشترك للأعداد
      // 4 و 8 و 10 » et son explication (« مضاعف للأعداد الثلاثة، لا قاسم »).
      id: 'khata', kind: 'common_mistake', lane: 'start', requires: 'qabiliyat-10',
      title: 'مضاعف أم قاسم؟', subtitle: 'مضاعف لـ 4 و 8 و 10',
      context: {
        parts: [
          { role: 'wrong', text: 'نبحث عن قاسم مشترك للأعداد 4 و 8 و 10.' },
          { role: 'why', text: `${divisible.text}: العدد مضاعف للأعداد الثلاثة، لا قاسم لها.` },
          { role: 'right', text: fahm.text },
        ],
      },
      reveals: [],
    },
    {
      id: 'tarmiz', kind: 'method', lane: 'end', requires: 'tarmiz-bi-huruf', notebook: true,
      title: 'الترميز بالحروف', subtitle: 'أربعة أرقام: a و b و c و d',
      context: { text: istratijiya.text, note: tanfidh.text },
      reveals: ['arqam'],
    },
    {
      id: 'arqam', kind: 'example', lane: 'end', requires: 'tarmiz-bi-huruf',
      title: 'أرقام العدد', subtitle: '$d = 0$ و $b = c = 2a$',
      // La correction de la question 3 du module 1, puis sa remarque.
      context: {
        text: '«رقما العشرات والمئات متساويان ويساويان ضعف رقم الآلاف»: $b = c = 2a$؛ و«مضاعف لـ 10»: $d = 0$.',
        note: NOT_SOLVED_HERE,
      },
      reveals: ['khulasa'],
    },
    {
      // 🎯 خلاصة — les trois étapes de l'analyse du manuel, nommées par lui.
      id: 'khulasa', kind: 'takeaway', lane: 'center', requires: 'tarmiz-bi-huruf',
      title: 'ثلاث مراحل', subtitle: 'نقرأ · نحلّل · ننفّذ',
      context: { list: SITUATION.analysis.map((a) => a.label) },
      reveals: [],
    },
  ],
  edges: [
    { from: 'wadiya', to: 'fahm', label: 'نفهمها' },
    { from: 'fahm', to: 'qabiliyat', label: 'تذكّر' },
    { from: 'qabiliyat', to: 'khata', label: 'خطأ شائع' },
    { from: 'fahm', to: 'tarmiz', label: 'نختار استراتيجية' },
    { from: 'tarmiz', to: 'arqam', label: 'نطبّقه' },
    { from: 'khata', to: 'khulasa', label: 'نستخلص' },
    { from: 'arqam', to: 'khulasa', label: 'نستخلص' },
  ],
};
