import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../common/kit';
import MathText from '../../../../../common/components/MathText';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 0 — مهمة الانطلاق.
 *
 * Diagnostic des trois prérequis déclarés au catalogue : الأعداد الطبيعية,
 * القسمة الإقليدية, قواسم عدد طبيعي.
 *
 * JAMAIS BLOQUANT (LESSON_CONTRACT.md) : aucune question ne porte
 * d'`assessment`, aucun résultat ne ferme l'accès au module 1, et le conseil
 * final propose toujours d'entrer dans la leçon.
 *
 * [À VÉRIFIER DANS LE PROGRAMME OFFICIEL] — que ces trois notions soient
 * effectivement acquises en fin de 3AM est une hypothèse : le programme des
 * années antérieures n'a pas été fourni au projet.
 */
export default function Module00Diagnostic() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 مهمة الانطلاق"
      moduleSubtitle="تشخيص قصير لمعرفة من أين نبدأ. لا يمنعك من متابعة الدرس."
      estimatedTime="6 دقائق"
      brief={{
        tag: 'قبل أن نبدأ',
        title: 'ثلاثة أسئلة، لا أكثر',
        tone: 'teal',
        body: (
          <p>
            هذا التشخيص ليس اختبارًا ولا يُحتسب في نتيجتك. إنه فقط ليعرف الدرس
            أين يبطئ من أجلك.
          </p>
        ),
      }}
      skills={{
        qisma: { label: 'القسمة الإقليدية', emoji: '➗' },
        qasim: { label: 'قواسم عدد طبيعي', emoji: '🔢' },
        hisab: { label: 'الحساب على الأعداد الطبيعية', emoji: '🧮' },
      }}
      levels={{
        fragile: {
          emoji: '🌱',
          title: 'مكتسباتك لا تزال هشّة.',
          body:
            'لا بأس بذلك إطلاقًا. بعض المفاهيم تحتاج إلى تدعيم، والدرس يبدأ من وضعية ملموسة ولا يفترض شيئًا.',
          advice: 'تقدّم بهدوء في الوحدة الأولى، واستعن بالمساعدات عند الحاجة.',
          cta: 'أبدأ الدرس على كل حال',
          tone: 'from-emerald-500 to-teal-500',
        },
        progres: {
          emoji: '👍',
          title: 'مكتسباتك في الطريق الصحيح.',
          body:
            'لديك جزء من المكتسبات الضرورية. بعض التردّدات الصغيرة يمكن تصحيحها أثناء الدرس نفسه.',
          advice: 'كن منتبهًا للأمثلة والأنشطة في بداية الدرس.',
          cta: 'أبدأ الوحدة 1',
          tone: 'from-teal-500 to-cyan-500',
        },
        pret: {
          emoji: '🚀',
          title: 'أنت جاهز!',
          body: 'مكتسباتك متينة. يمكنك الدخول مباشرة إلى المهمة.',
          advice: 'حاول حلّ الأنشطة الأولى دون استعمال المساعدات.',
          cta: 'أنا جاهز!',
          tone: 'from-cyan-500 to-blue-500',
        },
      }}
      questions={[
        {
          id: 'q1',
          skill: 'qisma',
          points: 4,
          // Les connaissances ANTÉRIEURES que cette question diagnostique
          // (lues par scripts/audit-knowledge-dependencies.mjs).
          requires: ['qisma-iqlidiya'],
          prompt: (
            <span>
              في القسمة الإقليدية{' '}
              <MathText>{'$47 = 6 \\times 7 + 5$'}</MathText>، ما هو{' '}
              <strong>الباقي</strong>؟
            </span>
          ),
          options: ['6', '7', '5', '47'],
          correct: 2,
          cols: 4,
          explain: (
            <span>
              الباقي هو ما يتبقّى بعد تكوين الحصص:{' '}
              <MathText>{'$5$'}</MathText>. ويكون دائمًا أصغر من القاسم.
            </span>
          ),
        },
        {
          id: 'q2',
          skill: 'qasim',
          points: 3,
          requires: ['qasim', 'qisma-iqlidiya'],
          prompt: (
            <span>
              أيّ عدد من هذه الأعداد <strong>يقسم</strong>{' '}
              <MathText>{'$24$'}</MathText> (أي أنّ الباقي معدوم)؟
            </span>
          ),
          options: ['5', '7', '8', '9'],
          correct: 2,
          cols: 4,
          explain: (
            <span>
              <MathText>{'$24 = 8 \\times 3 + 0$'}</MathText>: الباقي معدوم،
              إذن <MathText>{'$8$'}</MathText> قاسم للعدد{' '}
              <MathText>{'$24$'}</MathText>. أمّا{' '}
              <MathText>{'$5$'}</MathText> و<MathText>{'$7$'}</MathText> و
              <MathText>{'$9$'}</MathText> فتترك باقيًا.
            </span>
          ),
        },
        {
          id: 'q3',
          skill: 'hisab',
          points: 3,
          requires: ['aadad-tabiiya'],
          prompt: (
            <span>
              احسب: <MathText>{'$84 - 36$'}</MathText>
            </span>
          ),
          options: ['58', '48', '52', '42'],
          correct: 1,
          cols: 4,
          explain: (
            <span>
              <MathText>{'$84 - 36 = 48$'}</MathText>. الطرح سيكون الأداة
              الأساسية في طريقة الفروق المتتالية.
            </span>
          ),
        },
      ]}
    />
  );
}
