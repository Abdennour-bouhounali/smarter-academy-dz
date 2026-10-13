import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le « أستعدّ » du manuel (p. 103) appartient à la leçon 1 ; la synthèse pose donc sept
 * affirmations de la plateforme (« عبارة إضافية من المنصّة ») sur ce que le تحدّ, la وضعية et le test final
 * mobilisent : Thalès et sa réciproque, le quatrième proportionnel, la coupe axiale d'un cône, le volume
 * d'un cylindre, une équation du premier degré, les médianes d'un triangle. Quatre vraies, trois fausses ;
 * aucune n'emploie les nombres de la minaret ou du cône. Diagnostic JAMAIS bloquant ; `id` et `requires`
 * littéraux (audit), une connaissance par affirmation.
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
        body: <p>تحدّي المئذنة ووضعية الأسطوانة داخل المخروط يعبّئان ما تعلّمته في دروس الوحدة وقبلها: خاصية طالس وعكسيتها، الرابع المتناسب، المقطع المحوري للمخروط، حجم الأسطوانة وحل معادلة. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        talis: { label: 'خاصية طالس', emoji: '📐' },
        aksiya: { label: 'الخاصية العكسية لخاصية طالس', emoji: '🪜' },
        tanasub: { label: 'الرابع المتناسب والجداء التصالبي', emoji: '✖️' },
        maqta: { label: 'المقطع المحوري لمخروط', emoji: '🔺' },
        hajm: { label: 'حجم الأسطوانة', emoji: '🥫' },
        muadala: { label: 'حل معادلة من الدرجة الأولى', emoji: '✏️' },
        mutawassitat: { label: 'متوسطات المثلث', emoji: '🎯' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: تحليل الوضعية يمرّ بثلاث مراحل كما في الكتاب.', advice: 'راجع الدرس 1 (خاصية طالس وحساب الأطوال) والدرس 2 (الخاصية العكسية).', cta: 'أبدأ الوضعية على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعية.', advice: 'انتبه: في وضعية طالس نقارن ضلعين رأسهما النقطة المشتركة، وحجم الأسطوانة بنصف القطر.', cta: 'أقرأ الوضعية', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعية متحكَّم فيها.', advice: 'حاول أن ترى المثلثين في وضعية طالس قبل أن تحسب.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['talis-mubashira'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['talis-aksiya'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['rabi-mutanasib'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['maqta-mihwari'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['hajm-ustuwana'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['muadala-ula'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['mutawassitat'] },
      ]}
    />
  );
}
