import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS, PREP_PLATFORM_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ (p. 31). Les items 3, 4, 7 et 8 du manuel (la
 * distributivité de la 3AM, dans les deux sens ; les autres items vont aux
 * leçons 2, 3 et à la synthèse : extraction → destinations.prep.items), plus
 * six affirmations de la plateforme, déclarées comme telles, pour les trois
 * autres acquis que la leçon suppose : l'ordre des opérations sur des
 * relatifs, x × x face à x + x, les parenthèses précédées de −.
 * Il n'enseigne jamais le نشر lui-même. Jamais bloquant ; `id` et `requires`
 * restent littéraux (audit).
 */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="6 دقائق"
      brief={{
        tag: 'أستعدّ — الكتاب ص 31', title: 'عشر عبارات قبل الانطلاق', tone: 'teal',
        body: <p>أربع عبارات من الكتاب المدرسي وست من المنصّة. ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        tawziiya: { label: 'الخاصية التوزيعية', emoji: '✖️' },
        awlawiyat: { label: 'أولويات العمليات', emoji: '🔢' },
        hudud: { label: 'جداء حدّين وجمع حدود متشابهة', emoji: '🧮' },
        aqwas: { label: 'حذف الأقواس', emoji: '➖' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط الأول يبدأ من ملعب تحسب مساحته منطقةً منطقة.', advice: 'راجع أن العدد الذي أمام القوسين يُضرب في كل حد بداخلهما، مع إشارته.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: إشارة ناقص أمام قوسين تغيّر إشارة كل حد بداخلهما.', cta: 'أبدأ النشاط 1', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الخاصية التوزيعية والحساب على الحدود متحكَّم فيهما.', advice: 'حاول حلّ النشاط 1 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['khassiya-tawziiya'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['khassiya-tawziiya'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['khassiya-tawziiya'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['khassiya-tawziiya'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[0]), id: 'prep-5', requires: ['awlawiyat-hisab'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[1]), id: 'prep-6', requires: ['awlawiyat-hisab'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[2]), id: 'prep-7', requires: ['jidaa-x-fi-x'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[3]), id: 'prep-8', requires: ['jidaa-x-fi-x'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[4]), id: 'prep-9', requires: ['hadhf-aqwas'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[5]), id: 'prep-10', requires: ['hadhf-aqwas'] },
      ]}
    />
  );
}
