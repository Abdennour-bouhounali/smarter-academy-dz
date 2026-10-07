import { AUDIENCES as A, THEMES as T, CONTEXTS as C } from '../islamicThemes.js';

/**
 * قيم · حكم · تأمّلات — les phrases RÉDIGÉES par la plateforme.
 *
 * Elles ne citent personne : pas de « قال », pas de ﷺ, pas de guillemets de
 * citation, et `source` les déclare pour ce qu'elles sont (`platform`, ou
 * `proverb` pour un مثل عربي courant, sans auteur). Le rendu les affiche
 * comme une phrase de la plateforme — jamais sous l'habit d'un verset ou
 * d'un ḥadīth (`islamic.test.js` : une phrase rédigée ne porte ni
 * `collection` ni `surah`).
 *
 * Ton : encourager, jamais culpabiliser. « لا بأس، حاول مرة أخرى »,
 * jamais « أنت لا تجتهد بما يكفي ».
 */
const value = (item) => ({ type: 'value', source: 'platform', ...item });
const wisdom = (item) => ({ type: 'wisdom', source: 'proverb', ...item });
const reflection = (item) => ({ type: 'reflection', source: 'platform', ...item });

export const VALUES = [
  value({
    id: 'v-try-again', text: 'لا بأس، حاول مرة أخرى. كلّ محاولة تقرّبك من الفهم.',
    audience: A.STUDENT, themes: [T.PERSEVERANCE, T.FAILURE],
    contexts: [C.MISTAKE, C.DIFFICULTY], priority: 3,
  }),
  value({
    id: 'v-mistake-step', text: 'الخطأ خطوةٌ في طريق الفهم، لا نهايةُ الطريق.',
    audience: A.STUDENT, themes: [T.FAILURE, T.LEARNING],
    contexts: [C.MISTAKE, C.DIFFICULTY], priority: 2,
  }),
  value({
    id: 'v-ask', text: 'السؤال ليس ضعفًا: اسأل أستاذك أو زميلك عمّا لم تفهمه.',
    audience: A.STUDENT, themes: [T.LEARNING, T.HUMILITY],
    contexts: [C.DIFFICULTY, C.STUDY_PROGRESS], priority: 1,
  }),
  value({
    id: 'v-honest-work', text: 'إجابتك أنت، ولو كانت خاطئة، تعلّمك أكثر من إجابةٍ منقولة.',
    audience: A.STUDENT, themes: [T.HONESTY, T.LEARNING],
    contexts: [C.STUDY_START, C.GENERAL], priority: 1,
  }),
  value({
    id: 'v-respect-teacher', text: 'احترام الأستاذ وشكره من حسن الخلق.',
    audience: A.STUDENT, themes: [T.RESPECT, T.GOOD_CHARACTER],
    contexts: [C.LESSON_COMPLETION, C.GENERAL], priority: 1,
  }),
  value({
    id: 'v-explain-friend', text: 'فهمتَ الدرس؟ اشرحه لزميلك: يثبت عندك وينفعه.',
    audience: A.STUDENT, themes: [T.HELPING_OTHERS, T.KNOWLEDGE],
    contexts: [C.LESSON_COMPLETION, C.EXERCISE_SUCCESS], priority: 2,
  }),
  value({
    id: 'v-rest', text: 'استرح قليلًا، اشرب ماءً، ثمّ عُد بنشاط.',
    audience: A.STUDENT, themes: [T.TIME, T.PATIENCE],
    contexts: [C.STUDY_BREAK], priority: 1,
  }),
  value({
    id: 'v-teacher-encourage', text: 'تلميذٌ يتعثّر اليوم قد يتألّق غدًا بكلمة تشجيع منك.',
    audience: A.TEACHER, themes: [T.PATIENCE, T.TEACHING, T.MERCY],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 2,
  }),
  value({
    id: 'v-teacher-justice', text: 'العدل في التقييم وفي الاهتمام بين التلاميذ من أمانة التعليم.',
    audience: A.TEACHER, themes: [T.JUSTICE, T.TRUST, T.RESPONSIBILITY],
    contexts: [C.TEACHER_HOME], priority: 2,
  }),
  value({
    id: 'v-teacher-humility', text: 'المعلّم المتواضع يتعلّم من أسئلة تلاميذه.',
    audience: A.TEACHER, themes: [T.HUMILITY, T.TEACHING],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 1,
  }),
  value({
    id: 'v-teacher-model', text: 'يتعلّم التلاميذ من سلوك معلّمهم أكثر ممّا يتعلّمون من كلامه.',
    audience: A.TEACHER, themes: [T.GOOD_CHARACTER, T.TEACHING],
    contexts: [C.TEACHER_HOME], priority: 1,
  }),
  value({
    id: 'v-time-focus', text: 'ربع ساعة من التركيز خيرٌ من ساعةٍ شاردة.',
    audience: A.BOTH, themes: [T.TIME, T.EFFORT],
    contexts: [C.STUDY_START, C.STUDY_BREAK], priority: 1,
  }),
];

export const WISDOMS = [
  wisdom({
    id: 'w-jadda-wajada', text: 'مَن جدَّ وجد، ومَن زرع حصد.',
    audience: A.STUDENT, themes: [T.EFFORT, T.SUCCESS],
    contexts: [C.STUDY_PROGRESS, C.EXERCISE_SUCCESS, C.HOME], priority: 1,
  }),
  wisdom({
    id: 'w-naqsh', text: 'العلم في الصغر كالنقش على الحجر.',
    audience: A.STUDENT, themes: [T.KNOWLEDGE, T.TIME],
    contexts: [C.HOME, C.LESSON_START], priority: 1,
  }),
  wisdom({
    id: 'w-sabr-faraj', text: 'الصبر مفتاح الفرج.',
    audience: A.BOTH, themes: [T.PATIENCE, T.DIFFICULTY],
    contexts: [C.DIFFICULTY, C.MISTAKE], priority: 1,
  }),
];

export const REFLECTIONS = [
  reflection({
    id: 'r-niyya', text: 'قبل أن تبدأ: جدّد نيّتك؛ أتعلّم لأنفع نفسي وأهلي وبلدي.',
    audience: A.STUDENT, themes: [T.INTENTION, T.SINCERITY],
    contexts: [C.STUDY_START, C.LESSON_START], priority: 2,
  }),
  reflection({
    id: 'r-halfway', text: 'قطعت جزءًا من الطريق؛ ما بقي أقرب ممّا مضى.',
    audience: A.STUDENT, themes: [T.PERSEVERANCE, T.EFFORT],
    contexts: [C.STUDY_PROGRESS, C.STUDY_BREAK], priority: 2,
  }),
  reflection({
    id: 'r-alhamdulillah', text: 'أتممت درسًا: الحمد لله على نعمة الفهم.',
    audience: A.STUDENT, themes: [T.GRATITUDE, T.SUCCESS],
    contexts: [C.LESSON_COMPLETION, C.EXERCISE_SUCCESS], priority: 2,
  }),
  reflection({
    id: 'r-teacher-start', text: 'قبل أن تبدأ حصّتك: نيّةٌ صادقة تجعل التعليم عبادة.',
    audience: A.TEACHER, themes: [T.SINCERITY, T.TEACHING],
    contexts: [C.TEACHER_START, C.TEACHER_HOME], priority: 2,
  }),
  reflection({
    id: 'r-both-community', text: 'أستاذٌ يشرح وتلميذٌ يجتهد: كلاهما في طريق العلم.',
    audience: A.BOTH, themes: [T.KNOWLEDGE, T.LEARNING, T.TEACHING],
    contexts: [C.GENERAL, C.HOME, C.TEACHER_HOME], priority: 1,
  }),
];
