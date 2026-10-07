import { AUDIENCES as A, THEMES as T, CONTEXTS as C } from '../islamicThemes.js';

/**
 * آيات — le texte de chaque verset est copié À L'IDENTIQUE du texte
 * « simple » de Tanzil (tanzil.net, édition `quran-simple` servie par
 * api.alquran.cloud), jamais retapé ni paraphrasé. `islamic.test.js`
 * vérifie que chaque `verses[].text` est une sous-chaîne exacte du verset
 * référencé dans l'instantané `__fixtures__/tanzilSimple.json`
 * (régénéré par scripts/islamic/fetch-sources.mjs).
 *
 * `excerpt: true` : seule une partie du verset est citée — l'interface le
 * dit (« من الآية »). `reflection` est une ligne d'ACCOMPAGNEMENT rédigée
 * par la plateforme : elle n'est jamais rendue comme du Coran.
 */
const quran = (item) => ({ type: 'quran', source: 'tanzil:quran-simple', sourceVerified: true, ...item });

export const QURAN = [
  quran({
    id: 'q-taha-114', surah: 20, surahName: 'طه', ayah: 114, excerpt: true,
    verses: [{ ayah: 114, text: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا' }],
    audience: A.BOTH, themes: [T.KNOWLEDGE, T.LEARNING],
    contexts: [C.HOME, C.STUDY_START, C.LESSON_START, C.MODULE_START, C.TEACHER_START], priority: 3,
    reflection: 'دعاءٌ قصير يصلح بدايةً لكلّ درس.',
  }),
  quran({
    id: 'q-mujadila-11', surah: 58, surahName: 'المجادلة', ayah: 11, excerpt: true,
    verses: [{ ayah: 11, text: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ' }],
    audience: A.BOTH, themes: [T.KNOWLEDGE],
    contexts: [C.HOME, C.LESSON_START, C.LESSON_COMPLETION, C.TEACHER_HOME], priority: 2,
    reflection: 'كلّ ما تتعلّمه بإخلاص يرفعك درجة.',
  }),
  quran({
    id: 'q-zumar-9', surah: 39, surahName: 'الزمر', ayah: 9, excerpt: true,
    verses: [{ ayah: 9, text: 'قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ' }],
    audience: A.BOTH, themes: [T.KNOWLEDGE],
    contexts: [C.HOME, C.LESSON_START, C.GENERAL], priority: 2,
    reflection: 'العلم يغيّر صاحبه؛ فاحرص على أن تفهم، لا أن تحفظ فقط.',
  }),
  quran({
    id: 'q-alaq-1', surah: 96, surahName: 'العلق', ayah: 1,
    verses: [{ ayah: 1, text: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ' }],
    audience: A.BOTH, themes: [T.KNOWLEDGE, T.INTENTION],
    contexts: [C.STUDY_START, C.LESSON_START], priority: 2,
    reflection: 'أوّل ما نزل أمرٌ بالقراءة: ابدأ دراستك باسم الله.',
  }),
  quran({
    id: 'q-alaq-3-5', surah: 96, surahName: 'العلق', ayah: 3, ayahEnd: 5,
    verses: [
      { ayah: 3, text: 'اقْرَأْ وَرَبُّكَ الْأَكْرَمُ' },
      { ayah: 4, text: 'الَّذِي عَلَّمَ بِالْقَلَمِ' },
      { ayah: 5, text: 'عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ' },
    ],
    audience: A.TEACHER, themes: [T.TEACHING, T.KNOWLEDGE],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 2,
    reflection: 'التعليم بالقلم نعمةٌ ذكرها الله في أوّل ما نزل.',
  }),
  quran({
    id: 'q-sharh-5-6', surah: 94, surahName: 'الشرح', ayah: 5, ayahEnd: 6,
    verses: [
      { ayah: 5, text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا' },
      { ayah: 6, text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا' },
    ],
    audience: A.BOTH, themes: [T.DIFFICULTY, T.PATIENCE, T.PERSEVERANCE],
    contexts: [C.DIFFICULTY, C.MISTAKE, C.STUDY_PROGRESS], priority: 3,
    reflection: 'بعد الصعوبة فهمٌ ينتظرك؛ لا تتوقّف الآن.',
  }),
  quran({
    id: 'q-baqara-286', surah: 2, surahName: 'البقرة', ayah: 286, excerpt: true,
    verses: [{ ayah: 286, text: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا' }],
    audience: A.STUDENT, themes: [T.DIFFICULTY, T.PATIENCE],
    contexts: [C.DIFFICULTY, C.MISTAKE], priority: 2,
    reflection: 'ما يُطلب منك في وسعك؛ خطوةٌ صغيرة تكفي الآن.',
  }),
  quran({
    id: 'q-baqara-153', surah: 2, surahName: 'البقرة', ayah: 153,
    verses: [{ ayah: 153, text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ' }],
    audience: A.BOTH, themes: [T.PATIENCE],
    contexts: [C.DIFFICULTY, C.STUDY_BREAK, C.GENERAL], priority: 2,
    reflection: 'الصبر عونٌ على كلّ عمل، والدراسة منه.',
  }),
  quran({
    id: 'q-najm-39', surah: 53, surahName: 'النجم', ayah: 39,
    verses: [{ ayah: 39, text: 'وَأَنْ لَيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَىٰ' }],
    audience: A.STUDENT, themes: [T.EFFORT],
    contexts: [C.HOME, C.STUDY_PROGRESS, C.LESSON_START, C.EXERCISE_SUCCESS], priority: 2,
    reflection: 'نتيجتك ثمرة سعيك؛ وكلّ تمرين تحلّه سعيٌ محفوظ.',
  }),
  quran({
    id: 'q-raad-11', surah: 13, surahName: 'الرعد', ayah: 11, excerpt: true,
    verses: [{ ayah: 11, text: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنْفُسِهِمْ' }],
    audience: A.BOTH, themes: [T.EFFORT, T.RESPONSIBILITY],
    contexts: [C.HOME, C.STUDY_PROGRESS, C.GENERAL], priority: 1,
    reflection: 'التغيير يبدأ منك: عادةٌ صغيرة تثبت عليها.',
  }),
  quran({
    id: 'q-ibrahim-7', surah: 14, surahName: 'إبراهيم', ayah: 7, excerpt: true,
    verses: [{ ayah: 7, text: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ' }],
    audience: A.BOTH, themes: [T.GRATITUDE, T.SUCCESS],
    contexts: [C.EXERCISE_SUCCESS, C.LESSON_COMPLETION], priority: 2,
    reflection: 'نجحتَ؟ احمد الله، فالشكر يزيد النِّعم.',
  }),
  quran({
    id: 'q-ankabut-69', surah: 29, surahName: 'العنكبوت', ayah: 69,
    verses: [{ ayah: 69, text: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ' }],
    audience: A.BOTH, themes: [T.EFFORT, T.PERSEVERANCE, T.EXCELLENCE],
    contexts: [C.DIFFICULTY, C.STUDY_PROGRESS, C.TEACHER_HOME], priority: 1,
  }),
  quran({
    id: 'q-baqara-195', surah: 2, surahName: 'البقرة', ayah: 195, excerpt: true,
    verses: [{ ayah: 195, text: 'وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ' }],
    audience: A.BOTH, themes: [T.EXCELLENCE],
    contexts: [C.TEACHER_HOME, C.LESSON_START, C.GENERAL], priority: 2,
    reflection: 'الإحسان أن تُتقن عملك ولو لم يرَه أحد.',
  }),
  quran({
    id: 'q-isra-23', surah: 17, surahName: 'الإسراء', ayah: 23, excerpt: true,
    verses: [{ ayah: 23, text: 'وَبِالْوَالِدَيْنِ إِحْسَانًا' }],
    audience: A.STUDENT, themes: [T.PARENTS, T.RESPECT],
    contexts: [C.HOME, C.STUDY_BREAK], priority: 1,
    reflection: 'اجتهادك في دراستك من برّك بوالديك.',
  }),
  quran({
    id: 'q-imran-159', surah: 3, surahName: 'آل عمران', ayah: 159, excerpt: true,
    verses: [{ ayah: 159, text: 'فَبِمَا رَحْمَةٍ مِنَ اللَّهِ لِنْتَ لَهُمْ ۖ وَلَوْ كُنْتَ فَظًّا غَلِيظَ الْقَلْبِ لَانْفَضُّوا مِنْ حَوْلِكَ' }],
    audience: A.TEACHER, themes: [T.MERCY, T.TEACHING],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 3,
    reflection: 'اللين مع المتعلّم يقرّبه من الدرس.',
  }),
  quran({
    id: 'q-nisa-58', surah: 4, surahName: 'النساء', ayah: 58, excerpt: true,
    verses: [{ ayah: 58, text: 'إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُمْ بَيْنَ النَّاسِ أَنْ تَحْكُمُوا بِالْعَدْلِ' }],
    audience: A.TEACHER, themes: [T.TRUST, T.JUSTICE, T.RESPONSIBILITY],
    contexts: [C.TEACHER_HOME], priority: 2,
    reflection: 'تصحيح ورقةٍ بإنصاف أمانةٌ وعدل.',
  }),
  quran({
    id: 'q-nahl-90', surah: 16, surahName: 'النحل', ayah: 90, excerpt: true,
    verses: [{ ayah: 90, text: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ' }],
    audience: A.BOTH, themes: [T.JUSTICE, T.EXCELLENCE],
    contexts: [C.TEACHER_HOME, C.GENERAL], priority: 1,
  }),
  quran({
    id: 'q-fatir-28', surah: 35, surahName: 'فاطر', ayah: 28, excerpt: true,
    verses: [{ ayah: 28, text: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ' }],
    audience: A.BOTH, themes: [T.KNOWLEDGE, T.HUMILITY],
    contexts: [C.LESSON_COMPLETION, C.GENERAL], priority: 1,
  }),
  quran({
    id: 'q-asr-1-3', surah: 103, surahName: 'العصر', ayah: 1, ayahEnd: 3,
    verses: [
      { ayah: 1, text: 'وَالْعَصْرِ' },
      { ayah: 2, text: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ' },
      { ayah: 3, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ' },
    ],
    audience: A.BOTH, themes: [T.TIME, T.PATIENCE],
    contexts: [C.HOME, C.STUDY_START, C.STUDY_BREAK], priority: 2,
    reflection: 'أقسم الله بالوقت؛ فاجعل وقت دراستك نافعًا.',
  }),
  quran({
    id: 'q-tawba-105', surah: 9, surahName: 'التوبة', ayah: 105, excerpt: true,
    verses: [{ ayah: 105, text: 'وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ' }],
    audience: A.BOTH, themes: [T.EFFORT, T.SINCERITY, T.RESPONSIBILITY],
    contexts: [C.HOME, C.STUDY_START, C.TEACHER_HOME], priority: 2,
  }),
  quran({
    id: 'q-tawba-119', surah: 9, surahName: 'التوبة', ayah: 119,
    verses: [{ ayah: 119, text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ' }],
    audience: A.BOTH, themes: [T.HONESTY],
    contexts: [C.STUDY_START, C.GENERAL], priority: 1,
    reflection: 'إجابتك الصادقة، ولو أخطأت، تعلّمك أكثر من إجابةٍ منقولة.',
  }),
  quran({
    id: 'q-qalam-4', surah: 68, surahName: 'القلم', ayah: 4,
    verses: [{ ayah: 4, text: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ' }],
    audience: A.BOTH, themes: [T.GOOD_CHARACTER],
    contexts: [C.TEACHER_HOME, C.GENERAL], priority: 1,
    reflection: 'حسن الخلق يعلّم قبل الكلام.',
  }),
  quran({
    id: 'q-luqman-18', surah: 31, surahName: 'لقمان', ayah: 18, excerpt: true,
    verses: [{ ayah: 18, text: 'وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا' }],
    audience: A.BOTH, themes: [T.HUMILITY],
    contexts: [C.EXERCISE_SUCCESS, C.GENERAL], priority: 1,
    reflection: 'التفوّق يزيّنه التواضع.',
  }),
  quran({
    id: 'q-maida-2', surah: 5, surahName: 'المائدة', ayah: 2, excerpt: true,
    verses: [{ ayah: 2, text: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ' }],
    audience: A.BOTH, themes: [T.HELPING_OTHERS],
    contexts: [C.STUDY_BREAK, C.TEACHER_HOME, C.GENERAL], priority: 2,
    reflection: 'اشرح لزميلك ما فهمته: يثبت عندك وينفعه.',
  }),
  quran({
    id: 'q-baqara-152', surah: 2, surahName: 'البقرة', ayah: 152,
    verses: [{ ayah: 152, text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ' }],
    audience: A.BOTH, themes: [T.GRATITUDE],
    contexts: [C.LESSON_COMPLETION, C.EXERCISE_SUCCESS, C.STUDY_BREAK], priority: 1,
  }),
  quran({
    id: 'q-yusuf-87', surah: 12, surahName: 'يوسف', ayah: 87, excerpt: true,
    verses: [{ ayah: 87, text: 'وَلَا تَيْأَسُوا مِنْ رَوْحِ اللَّهِ' }],
    audience: A.STUDENT, themes: [T.FAILURE, T.PERSEVERANCE],
    contexts: [C.MISTAKE, C.DIFFICULTY], priority: 2,
    reflection: 'محاولةٌ أخرى قد تكون هي محاولة الفهم.',
  }),
  quran({
    id: 'q-hud-88', surah: 11, surahName: 'هود', ayah: 88, excerpt: true,
    verses: [{ ayah: 88, text: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ' }],
    audience: A.BOTH, themes: [T.SUCCESS, T.HUMILITY],
    contexts: [C.EXERCISE_SUCCESS, C.LESSON_COMPLETION, C.STUDY_START], priority: 2,
  }),
  quran({
    id: 'q-ahzab-21', surah: 33, surahName: 'الأحزاب', ayah: 21, excerpt: true,
    verses: [{ ayah: 21, text: 'لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ' }],
    audience: A.TEACHER, themes: [T.TEACHING, T.GOOD_CHARACTER],
    contexts: [C.TEACHER_HOME], priority: 1,
    reflection: 'المعلّم قدوة: تلاميذه يتعلّمون من سلوكه.',
  }),
  quran({
    id: 'q-baqara-32', surah: 2, surahName: 'البقرة', ayah: 32,
    verses: [{ ayah: 32, text: 'قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا ۖ إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ' }],
    audience: A.BOTH, themes: [T.HUMILITY, T.KNOWLEDGE],
    contexts: [C.EXERCISE_SUCCESS, C.LESSON_COMPLETION], priority: 2,
  }),
  quran({
    id: 'q-yusuf-76', surah: 12, surahName: 'يوسف', ayah: 76, excerpt: true,
    verses: [{ ayah: 76, text: 'وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ' }],
    audience: A.BOTH, themes: [T.HUMILITY, T.KNOWLEDGE],
    contexts: [C.EXERCISE_SUCCESS, C.TEACHER_HOME], priority: 1,
  }),
  quran({
    id: 'q-kahf-30', surah: 18, surahName: 'الكهف', ayah: 30, excerpt: true,
    verses: [{ ayah: 30, text: 'إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا' }],
    audience: A.BOTH, themes: [T.EXCELLENCE, T.EFFORT],
    contexts: [C.LESSON_COMPLETION, C.EXERCISE_SUCCESS, C.TEACHER_HOME], priority: 2,
    reflection: 'لا يضيع جهدٌ صادق، ظهرت نتيجته اليوم أو غدًا.',
  }),
  quran({
    id: 'q-zalzala-7', surah: 99, surahName: 'الزلزلة', ayah: 7,
    verses: [{ ayah: 7, text: 'فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ' }],
    audience: A.BOTH, themes: [T.EFFORT],
    contexts: [C.STUDY_PROGRESS, C.GENERAL], priority: 1,
    reflection: 'لا تحتقر خطوةً صغيرة في طريق التعلّم.',
  }),
  quran({
    id: 'q-imran-200', surah: 3, surahName: 'آل عمران', ayah: 200,
    verses: [{ ayah: 200, text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ' }],
    audience: A.BOTH, themes: [T.PATIENCE, T.PERSEVERANCE],
    contexts: [C.DIFFICULTY, C.STUDY_PROGRESS], priority: 1,
  }),
  quran({
    id: 'q-baqara-83', surah: 2, surahName: 'البقرة', ayah: 83, excerpt: true,
    verses: [{ ayah: 83, text: 'وَقُولُوا لِلنَّاسِ حُسْنًا' }],
    audience: A.BOTH, themes: [T.GOOD_CHARACTER, T.RESPECT],
    contexts: [C.TEACHER_HOME, C.GENERAL], priority: 1,
    reflection: 'كلمةٌ طيّبة لمتعلّمٍ متعثّر قد تغيّر يومه.',
  }),
  quran({
    id: 'q-naml-40', surah: 27, surahName: 'النمل', ayah: 40, excerpt: true,
    verses: [{ ayah: 40, text: 'هَٰذَا مِنْ فَضْلِ رَبِّي لِيَبْلُوَنِي أَأَشْكُرُ أَمْ أَكْفُرُ' }],
    audience: A.BOTH, themes: [T.GRATITUDE, T.HUMILITY, T.SUCCESS],
    contexts: [C.EXERCISE_SUCCESS, C.LESSON_COMPLETION], priority: 2,
  }),
  quran({
    id: 'q-zumar-10', surah: 39, surahName: 'الزمر', ayah: 10, excerpt: true,
    verses: [{ ayah: 10, text: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ بِغَيْرِ حِسَابٍ' }],
    audience: A.BOTH, themes: [T.PATIENCE],
    contexts: [C.DIFFICULTY, C.TEACHER_HOME], priority: 1,
  }),
];
