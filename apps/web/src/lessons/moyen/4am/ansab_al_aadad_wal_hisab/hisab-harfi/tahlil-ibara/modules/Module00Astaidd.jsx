import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 9 et 10 du manuel (p. 31), puis six
 * affirmations de la plateforme dans la même forme pour les autres acquis
 * supposés : le نشر et la réduction des termes semblables (leçon 1), les
 * متطابقات (leçon 2), les diviseurs communs et le PGCD (unité 1).
 * Diagnostic JAMAIS bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 31', title: 'ثماني عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارتان من الكتاب، وست عبارات من المنصّة عن النشر والمتطابقات الشهيرة والقواسم المشتركة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        nashr: { label: 'النشر بالخاصية التوزيعية', emoji: '🧮' },
        tabsit: { label: 'تبسيط الحدود المتشابهة', emoji: '➕' },
        huwiyat: { label: 'المتطابقات الشهيرة', emoji: '²' },
        qasim: { label: 'القواسم المشتركة', emoji: '🔢' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بقطع عشب تفرشها بيدك.', advice: 'راجع درسي نشر وتبسيط عبارة جبرية والمتطابقات الشهيرة.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى الحد المضاعف 2ab وإلى إشارة العامل السالب عند النشر.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'النشر والمتطابقات والقواسم المشتركة متحكَّم فيها.', advice: 'في المستوى المتقدّم ابحث عن العامل المشترك كاملًا دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['nashr-tawzii'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['tabsit-mutashabiha'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['nashr-tawzii'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['tabsit-mutashabiha'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['pgcd'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['pgcd'] },
      ]}
    />
  );
}
