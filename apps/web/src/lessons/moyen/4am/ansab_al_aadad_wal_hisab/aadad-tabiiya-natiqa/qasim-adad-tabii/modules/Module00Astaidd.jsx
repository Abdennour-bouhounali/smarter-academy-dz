import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ (p. 7, items 1–6). Diagnostic des acquis antérieurs,
 * JAMAIS bloquant : aucune `assessment`, la suite est toujours ouverte.
 * Les six affirmations sont celles du manuel ; l'élève dit vrai/faux et lit
 * la justification (le manuel demande « برّر إجابتك »).
 */
const yesNo = ['صحيح', 'خطأ'];

export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="6 دقائق"
      brief={{
        tag: 'أستعدّ — الكتاب ص 7', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>هذه العبارات من الكتاب المدرسي. ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        qisma: { label: 'القسمة الإقليدية', emoji: '➗' },
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط الأول يبدأ من وضعية ملموسة ولا يفترض شيئًا.', advice: 'راجع كتابة القسمة الإقليدية a = b × q + r مع r < b.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى شرط الباقي: أصغر من المقسوم عليه.', cta: 'أبدأ النشاط 1', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'القسمة الإقليدية وقواعد قابلية القسمة متحكَّم فيها.', advice: 'حاول حلّ النشاط 1 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={PREP_ITEMS.map((it) => ({
        id: `prep-${it.n}`,
        skill: it.skill,
        points: it.n <= 3 ? 2 : 1,
        requires: it.skill === 'qisma' ? ['qisma-iqlidiya'] : ['qawaid-qabiliyat-al-qisma'],
        prompt: (
          <span className="space-y-1 block">
            <MathText>{it.text}</MathText>
            <SourceTag source={it.source} className="ms-2" />
          </span>
        ),
        options: yesNo,
        correct: it.answer ? 0 : 1,
        cols: 2,
        explain: <MathText>{it.why}</MathText>,
      }))}
    />
  );
}
