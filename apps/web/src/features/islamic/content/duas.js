import { AUDIENCES as A, THEMES as T, CONTEXTS as C } from '../islamicThemes.js';

/**
 * أدعية — chaque دعاء a une ORIGINE vérifiable : un verset (`origin:
 * 'quran'`, mêmes champs et même vérification que quran.js — il se rend
 * entre ﴿ ﴾) ou un ḥadīth (`origin: 'hadith'`, mêmes champs que hadith.js).
 * Aucune formule rédigée par la plateforme n'est présentée comme دعاء
 * prophétique.
 */
export const DUAS = [
  {
    id: 'd-taha-25-28', type: 'dua', origin: 'quran', source: 'tanzil:quran-simple', sourceVerified: true,
    surah: 20, surahName: 'طه', ayah: 25, ayahEnd: 28, excerpt: true,
    verses: [
      { ayah: 25, text: 'رَبِّ اشْرَحْ لِي صَدْرِي' },
      { ayah: 26, text: 'وَيَسِّرْ لِي أَمْرِي' },
      { ayah: 27, text: 'وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي' },
      { ayah: 28, text: 'يَفْقَهُوا قَوْلِي' },
    ],
    audience: A.BOTH, themes: [T.LEARNING, T.KNOWLEDGE, T.DIFFICULTY],
    contexts: [C.STUDY_START, C.LESSON_START, C.DIFFICULTY, C.TEACHER_START], priority: 3,
    reflection: 'دعاء موسى عليه السلام قبل مهمّته؛ ادعُ به قبل درسك.',
  },
  {
    id: 'd-baqara-286', type: 'dua', origin: 'quran', source: 'tanzil:quran-simple', sourceVerified: true,
    surah: 2, surahName: 'البقرة', ayah: 286, excerpt: true,
    verses: [{ ayah: 286, text: 'رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا' }],
    audience: A.STUDENT, themes: [T.FAILURE, T.PATIENCE],
    contexts: [C.MISTAKE, C.DIFFICULTY], priority: 2,
  },
  {
    id: 'd-isra-24', type: 'dua', origin: 'quran', source: 'tanzil:quran-simple', sourceVerified: true,
    surah: 17, surahName: 'الإسراء', ayah: 24, excerpt: true,
    verses: [{ ayah: 24, text: 'وَقُلْ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا' }],
    audience: A.STUDENT, themes: [T.PARENTS, T.GRATITUDE],
    contexts: [C.STUDY_BREAK, C.LESSON_COMPLETION], priority: 1,
    reflection: 'تذكّر من سهر على تعليمك.',
  },
  {
    id: 'd-imran-8', type: 'dua', origin: 'quran', source: 'tanzil:quran-simple', sourceVerified: true,
    surah: 3, surahName: 'آل عمران', ayah: 8,
    verses: [{ ayah: 8, text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ' }],
    audience: A.BOTH, themes: [T.HUMILITY],
    contexts: [C.STUDY_BREAK, C.GENERAL], priority: 1,
  },
  {
    id: 'd-kahf-10', type: 'dua', origin: 'quran', source: 'tanzil:quran-simple', sourceVerified: true,
    surah: 18, surahName: 'الكهف', ayah: 10, excerpt: true,
    verses: [{ ayah: 10, text: 'رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا' }],
    audience: A.BOTH, themes: [T.DIFFICULTY, T.LEARNING],
    contexts: [C.STUDY_START, C.DIFFICULTY, C.TEACHER_START], priority: 2,
  },
  {
    id: 'd-bukhari-2823', type: 'dua', origin: 'hadith', intro: 'كان النبي ﷺ يقول', sourceVerified: true,
    collection: 'bukhari', collectionName: 'صحيح البخاري', number: '2823', excerpt: true,
    narrator: 'أنس بن مالك رضي الله عنه', authenticity: { grade: 'sahih', label: 'صحيح' },
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
    audience: A.BOTH, themes: [T.EFFORT],
    contexts: [C.STUDY_START, C.STUDY_PROGRESS], priority: 2,
    reflection: 'الكسل يُغلب بخطوة أولى صغيرة.',
  },
];
