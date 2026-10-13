import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le « أستعدّ » du manuel (p. 55) appartient aux leçons 1
 * et 2 ; la synthèse pose donc sept affirmations de la plateforme (« عبارة
 * إضافية من المنصّة ») sur ce que la situation mobilise : une
 * équation à deux inconnues et la solution d'une جملة (درس 1), la substitution
 * et l'addition (درس 2), la traduction d'un texte et la vérification dans le
 * texte (درس 3), le pourcentage (ex. 31). Aucune n'emploie les nombres du حفل.
 * Diagnostic JAMAIS bloquant ; `id` et `requires` littéraux (audit).
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
        tag: 'أستعدّ — عبارات من المنصّة', title: 'سبع عبارات قبل الوضعية الإدماجية', tone: 'teal',
        body: <p>الوضعية تعبّئ ما تعلّمته في دروس الوحدة الثلاثة: مفهوم الجملة وحلها، طريقتا التعويض والجمع، وترجمة مشكلة بجملة معادلتين ثم التحقق، مع النسبة المئوية. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        mafhum: { label: 'معادلة من الدرجة الأولى بمجهولين', emoji: '✏️' },
        hall: { label: 'حل جملة: المعادلتان في آن واحد', emoji: '🎯' },
        tawid: { label: 'التعبير عن مجهول بدلالة الآخر', emoji: '🔁' },
        jam: { label: 'الجمع طرفا بطرف', emoji: '➕' },
        tarjama: { label: 'ترجمة معلومة بمعادلة', emoji: '📝' },
        tahaqquq: { label: 'التحقق في نص المشكلة', emoji: '🔍' },
        nisba: { label: 'النسبة المئوية والتخفيض', emoji: '🏷️' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: تحليل الوضعية يمرّ بثلاث مراحل كما في الكتاب.', advice: 'راجع الدرس 2 (طريقتا التعويض والجمع) والدرس 3 (حل مشكلات بتوظيف جمل معادلتين).', cta: 'أبدأ الوضعية على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعية.', advice: 'انتبه: حل الجملة يحقق المعادلتين معا، وكل عدد في المعلومة يُضرب في سعر الشيء الذي يعدّه.', cta: 'أقرأ الوضعية', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعية متحكَّم فيها.', advice: 'حاول ترجمة المعلومتين دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['mafhum-jumla'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['hall-jumla'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['tawid'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['jam'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['tarjama-jumla'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['tahaqquq-wadiya'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['nisba-mia'] },
      ]}
    />
  );
}
