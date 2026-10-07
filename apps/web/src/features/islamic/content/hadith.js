import { AUDIENCES as A, THEMES as T, CONTEXTS as C } from '../islamicThemes.js';

/**
 * أحاديث — seulement des textes RETROUVÉS dans leur recueil : le matn est
 * une sous-chaîne exacte du texte arabe du recueil (éditions
 * fawazahmed0/hadith-api, numérotation de Fu'ad ʿAbd al-Bāqī pour Muslim),
 * vérifiée par `islamic.test.js` contre `__fixtures__/hadithSources.json`.
 *
 * Règles de sélection (doc ISLAMIC_VALUES.md § Intégrité des sources) :
 *   - Bukhārī et Muslim ;
 *   - al-Tirmidhī seulement quand al-Albānī l'authentifie (صحيح ou حسن) —
 *     le jugement de chacun est écrit dans `authenticity.label` ;
 *   - un texte dont l'attribution n'a pas pu être retrouvée n'entre PAS.
 *     (« اللهم لا سهل… », Ibn Ḥibbān, écarté faute de source consultable ;
 *     deux douʿāʾ aux jugements divergents, écartés aussi.)
 *
 * `excerpt: true` : partie d'un ḥadīth plus long (« من حديث »).
 */
const SAHIH = { grade: 'sahih', label: 'صحيح' };
const hadith = (item) => ({ type: 'hadith', intro: 'قال رسول الله ﷺ', sourceVerified: true, ...item });

export const HADITH = [
  hadith({
    id: 'h-muslim-2699-ilm', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2699', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    audience: A.BOTH, themes: [T.KNOWLEDGE, T.LEARNING],
    contexts: [C.HOME, C.STUDY_START, C.LESSON_START, C.LESSON_COMPLETION], priority: 3,
    reflection: 'كلّ درسٍ تفتحه خطوةٌ في هذا الطريق.',
  }),
  hadith({
    id: 'h-muslim-2699-awn', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2699', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ',
    audience: A.BOTH, themes: [T.HELPING_OTHERS],
    contexts: [C.STUDY_BREAK, C.TEACHER_HOME, C.GENERAL], priority: 2,
    reflection: 'مساعدة زميلٍ على الفهم عونٌ تُؤجر عليه.',
  }),
  hadith({
    id: 'h-bukhari-1', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '1', excerpt: true,
    narrator: 'عمر بن الخطاب رضي الله عنه', authenticity: SAHIH,
    text: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    audience: A.BOTH, themes: [T.SINCERITY, T.INTENTION],
    contexts: [C.STUDY_START, C.LESSON_START, C.TEACHER_START, C.HOME], priority: 3,
    reflection: 'جدّد نيّتك: أتعلّم لأنفع نفسي وأهلي وبلدي.',
  }),
  hadith({
    id: 'h-muslim-1955', collection: 'muslim', collectionName: 'صحيح مسلم', number: '1955', excerpt: true,
    narrator: 'شداد بن أوس رضي الله عنه', authenticity: SAHIH,
    text: 'إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَىْءٍ',
    audience: A.BOTH, themes: [T.EXCELLENCE],
    contexts: [C.TEACHER_HOME, C.LESSON_START, C.GENERAL], priority: 2,
    reflection: 'الإتقان عبادة: في الشرح كما في الحلّ.',
  }),
  hadith({
    id: 'h-muslim-783', collection: 'muslim', collectionName: 'صحيح مسلم', number: '783',
    narrator: 'عائشة رضي الله عنها', authenticity: SAHIH,
    text: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ',
    audience: A.BOTH, themes: [T.PERSEVERANCE, T.EFFORT],
    contexts: [C.HOME, C.STUDY_PROGRESS, C.STUDY_BREAK], priority: 3,
    reflection: 'قليلٌ كلّ يوم خيرٌ من كثيرٍ ينقطع.',
  }),
  hadith({
    id: 'h-muslim-2664', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2664', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ وَفِي كُلٍّ خَيْرٌ احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلاَ تَعْجِزْ',
    audience: A.STUDENT, themes: [T.EFFORT, T.PERSEVERANCE],
    contexts: [C.DIFFICULTY, C.STUDY_PROGRESS], priority: 2,
    reflection: 'استعن بالله وحاول من جديد؛ لا تعجز.',
  }),
  hadith({
    id: 'h-bukhari-6412', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '6412',
    narrator: 'ابن عباس رضي الله عنهما', authenticity: SAHIH,
    text: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ، الصِّحَّةُ وَالْفَرَاغُ',
    audience: A.BOTH, themes: [T.TIME],
    contexts: [C.HOME, C.STUDY_START, C.STUDY_BREAK], priority: 2,
    reflection: 'وقت فراغك فرصة؛ ربع ساعة من التركيز تصنع فرقًا.',
  }),
  hadith({
    id: 'h-bukhari-2989', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '2989', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    audience: A.BOTH, themes: [T.GOOD_CHARACTER, T.MERCY],
    contexts: [C.TEACHER_HOME, C.STUDY_BREAK, C.GENERAL], priority: 2,
    reflection: 'كلمة تشجيع لمتعلّم صدقةٌ لا تكلّف شيئًا.',
  }),
  hadith({
    id: 'h-bukhari-6094', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '6094', excerpt: true,
    narrator: 'عبد الله بن مسعود رضي الله عنه', authenticity: SAHIH,
    text: 'إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ',
    audience: A.BOTH, themes: [T.HONESTY],
    contexts: [C.STUDY_START, C.HOME, C.GENERAL], priority: 2,
    reflection: 'أجب بما فهمته أنت؛ الصدق في التعلّم بداية الفهم.',
  }),
  hadith({
    id: 'h-bukhari-5997', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '5997', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'مَنْ لاَ يَرْحَمُ لاَ يُرْحَمُ',
    audience: A.TEACHER, themes: [T.MERCY],
    contexts: [C.TEACHER_HOME], priority: 1,
  }),
  hadith({
    id: 'h-muslim-1893', collection: 'muslim', collectionName: 'صحيح مسلم', number: '1893', excerpt: true,
    narrator: 'أبي مسعود الأنصاري رضي الله عنه', authenticity: SAHIH,
    text: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    audience: A.TEACHER, themes: [T.TEACHING, T.HELPING_OTHERS],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 3,
    reflection: 'كلّ ما يفهمه تلميذك بفضل شرحك يبقى لك أجره.',
  }),
  hadith({
    id: 'h-bukhari-6927', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '6927', excerpt: true,
    narrator: 'عائشة رضي الله عنها', authenticity: SAHIH,
    text: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ',
    audience: A.TEACHER, themes: [T.MERCY, T.TEACHING],
    contexts: [C.TEACHER_HOME], priority: 2,
  }),
  hadith({
    id: 'h-muslim-2594', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2594',
    narrator: 'عائشة رضي الله عنها', authenticity: SAHIH,
    text: 'إِنَّ الرِّفْقَ لاَ يَكُونُ فِي شَىْءٍ إِلاَّ زَانَهُ وَلاَ يُنْزَعُ مِنْ شَىْءٍ إِلاَّ شَانَهُ',
    audience: A.TEACHER, themes: [T.MERCY],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 2,
    reflection: 'الرفق في التصحيح يجعل الخطأ درسًا لا جرحًا.',
  }),
  hadith({
    id: 'h-bukhari-69', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '69',
    narrator: 'أنس بن مالك رضي الله عنه', authenticity: SAHIH,
    text: 'يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا',
    audience: A.TEACHER, themes: [T.TEACHING, T.MERCY],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 3,
    reflection: 'التيسير لا يعني التبسيط المخلّ، بل فتح الطريق إلى الفهم.',
  }),
  hadith({
    id: 'h-bukhari-893', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '893', excerpt: true,
    narrator: 'ابن عمر رضي الله عنهما', authenticity: SAHIH,
    text: 'كُلُّكُمْ رَاعٍ، وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ',
    audience: A.TEACHER, themes: [T.RESPONSIBILITY],
    contexts: [C.TEACHER_HOME], priority: 2,
    reflection: 'قسمك أمانة، وكلّ تلميذ فيه مسؤولية.',
  }),
  hadith({
    id: 'h-muslim-1631', collection: 'muslim', collectionName: 'صحيح مسلم', number: '1631',
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ',
    audience: A.TEACHER, themes: [T.TEACHING, T.KNOWLEDGE],
    contexts: [C.TEACHER_HOME], priority: 2,
    reflection: 'العلم الذي تتركه في تلاميذك عملٌ لا ينقطع.',
  }),
  hadith({
    id: 'h-muslim-2588', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2588', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلاَّ رَفَعَهُ اللَّهُ',
    audience: A.BOTH, themes: [T.HUMILITY],
    contexts: [C.EXERCISE_SUCCESS, C.LESSON_COMPLETION, C.TEACHER_HOME], priority: 2,
  }),
  hadith({
    id: 'h-bukhari-13', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '13',
    narrator: 'أنس بن مالك رضي الله عنه', authenticity: SAHIH,
    text: 'لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    audience: A.BOTH, themes: [T.HELPING_OTHERS, T.GOOD_CHARACTER],
    contexts: [C.STUDY_BREAK, C.GENERAL], priority: 1,
    reflection: 'تمنَّ لزملائك النجاح الذي تتمنّاه لنفسك.',
  }),
  hadith({
    id: 'h-tirmidhi-1954', collection: 'tirmidhi', collectionName: 'سنن الترمذي', number: '1954',
    narrator: 'أبي هريرة رضي الله عنه',
    authenticity: { grade: 'sahih', label: 'قال الترمذي: حسن صحيح، وصحّحه الألباني' },
    text: 'مَنْ لاَ يَشْكُرِ النَّاسَ لاَ يَشْكُرِ اللَّهَ',
    audience: A.BOTH, themes: [T.GRATITUDE, T.RESPECT],
    contexts: [C.LESSON_COMPLETION, C.STUDY_BREAK], priority: 2,
    reflection: 'اشكر من علّمك: والديك وأستاذك.',
  }),
  hadith({
    id: 'h-muslim-2999', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2999',
    narrator: 'صهيب رضي الله عنه', authenticity: SAHIH,
    text: 'عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
    audience: A.BOTH, themes: [T.PATIENCE, T.GRATITUDE],
    contexts: [C.DIFFICULTY, C.EXERCISE_SUCCESS, C.GENERAL], priority: 2,
    reflection: 'نجحتَ فاشكر، تعثّرتَ فاصبر: في الحالين خير.',
  }),
  hadith({
    id: 'h-bukhari-1469', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '1469', excerpt: true,
    narrator: 'أبي سعيد الخدري رضي الله عنه', authenticity: SAHIH,
    text: 'وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ',
    audience: A.BOTH, themes: [T.PATIENCE],
    contexts: [C.DIFFICULTY, C.MISTAKE], priority: 2,
  }),
  hadith({
    id: 'h-bukhari-3559', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '3559',
    narrator: 'عبد الله بن عمرو رضي الله عنهما', authenticity: SAHIH,
    text: 'إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلاَقًا',
    audience: A.BOTH, themes: [T.GOOD_CHARACTER],
    contexts: [C.HOME, C.TEACHER_HOME, C.GENERAL], priority: 2,
  }),
  hadith({
    id: 'h-bukhari-6114', collection: 'bukhari', collectionName: 'صحيح البخاري', number: '6114',
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    audience: A.BOTH, themes: [T.PATIENCE, T.GOOD_CHARACTER],
    contexts: [C.TEACHER_HOME, C.GENERAL], priority: 1,
  }),
  hadith({
    id: 'h-muslim-2564', collection: 'muslim', collectionName: 'صحيح مسلم', number: '2564', excerpt: true,
    narrator: 'أبي هريرة رضي الله عنه', authenticity: SAHIH,
    text: 'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    audience: A.BOTH, themes: [T.SINCERITY],
    contexts: [C.HOME, C.GENERAL], priority: 1,
  }),
  hadith({
    id: 'h-tirmidhi-1987', collection: 'tirmidhi', collectionName: 'سنن الترمذي', number: '1987',
    narrator: 'أبي ذر رضي الله عنه',
    authenticity: { grade: 'hasan', label: 'قال الترمذي: حسن صحيح، وحسّنه الألباني' },
    text: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
    audience: A.BOTH, themes: [T.GOOD_CHARACTER],
    contexts: [C.GENERAL, C.STUDY_BREAK], priority: 1,
  }),
  hadith({
    id: 'h-tirmidhi-1920', collection: 'tirmidhi', collectionName: 'سنن الترمذي', number: '1920',
    authenticity: { grade: 'sahih', label: 'صحّحه الألباني وأحمد شاكر' },
    text: 'لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيرَنَا وَيَعْرِفْ شَرَفَ كَبِيرِنَا',
    audience: A.BOTH, themes: [T.RESPECT, T.MERCY],
    contexts: [C.TEACHER_HOME, C.GENERAL], priority: 1,
  }),
  hadith({
    id: 'h-tirmidhi-2685', collection: 'tirmidhi', collectionName: 'سنن الترمذي', number: '2685', excerpt: true,
    narrator: 'أبي أمامة الباهلي رضي الله عنه',
    authenticity: { grade: 'sahih', label: 'قال الترمذي: حسن صحيح غريب، وصحّحه الألباني' },
    text: 'إِنَّ اللَّهَ وَمَلاَئِكَتَهُ وَأَهْلَ السَّمَوَاتِ وَالأَرْضِ حَتَّى النَّمْلَةَ فِي جُحْرِهَا وَحَتَّى الْحُوتَ لَيُصَلُّونَ عَلَى مُعَلِّمِ النَّاسِ الْخَيْرَ',
    audience: A.TEACHER, themes: [T.TEACHING],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 3,
    reflection: 'تعليم الناس الخير من أشرف الأعمال.',
  }),
  hadith({
    id: 'h-muslim-1478', collection: 'muslim', collectionName: 'صحيح مسلم', number: '1478', excerpt: true,
    narrator: 'جابر بن عبد الله رضي الله عنهما', authenticity: SAHIH,
    text: 'إِنَّ اللَّهَ لَمْ يَبْعَثْنِي مُعَنِّتًا وَلاَ مُتَعَنِّتًا وَلَكِنْ بَعَثَنِي مُعَلِّمًا مُيَسِّرًا',
    audience: A.TEACHER, themes: [T.TEACHING, T.MERCY],
    contexts: [C.TEACHER_HOME, C.TEACHER_START], priority: 3,
    reflection: 'المعلّم الميسِّر يفتح للتلميذ باب الفهم.',
  }),
  hadith({
    id: 'h-muslim-41', collection: 'muslim', collectionName: 'صحيح مسلم', number: '41',
    narrator: 'جابر بن عبد الله رضي الله عنهما', authenticity: SAHIH,
    text: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    audience: A.BOTH, themes: [T.GOOD_CHARACTER],
    contexts: [C.GENERAL, C.STUDY_BREAK], priority: 1,
  }),
  hadith({
    id: 'h-tirmidhi-1956', collection: 'tirmidhi', collectionName: 'سنن الترمذي', number: '1956', excerpt: true,
    narrator: 'أبي ذر رضي الله عنه',
    authenticity: { grade: 'sahih', label: 'قال الترمذي: حسن غريب، وصحّحه الألباني' },
    text: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    audience: A.BOTH, themes: [T.GOOD_CHARACTER, T.MERCY],
    contexts: [C.TEACHER_HOME, C.STUDY_BREAK, C.GENERAL], priority: 1,
  }),
];
