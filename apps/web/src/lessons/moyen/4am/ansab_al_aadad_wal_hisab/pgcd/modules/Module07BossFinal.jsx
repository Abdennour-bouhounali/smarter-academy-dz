import React from 'react';
import { BossFinal } from '../../../../../common/kit';
import { CompleteView } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 7 — التحدي النهائي (stage: evaluation).
 *
 * LA SEULE SOURCE DE PREUVE D'APPRENTISSAGE de la leçon : chaque épreuve
 * porte `assessment: { enabled: true, type: 'assessment', learningPointIds }`
 * et alimente la maîtrise côté serveur (useEvidenceSubmission).
 *
 * COUVERTURE. Les 7 LP du catalogue sont évalués, chacun par au moins une
 * épreuve — c'est ce que `validate-lessons.mjs --strict` exige d'une leçon
 * `available`. Onze épreuves pour sept LP : les deux méthodes nommées par le
 * programme (P4, P5) et la reconnaissance de situation (P7) en reçoivent
 * deux, parce qu'une seule question ne distingue pas un élève qui sait
 * appliquer d'un élève qui a deviné.
 *
 * NIVEAUX. Les épreuves ne rejouent pas les exemples des modules : mêmes
 * gestes, autres nombres, et deux épreuves demandent un raisonnement inverse
 * (retrouver l'énoncé à partir du résultat, repérer l'erreur d'un calcul).
 */
export default function Module07BossFinal() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(7)}
      moduleNumber={7}
      moduleTitle="التحدي النهائي"
      moduleSubtitle="إحدى عشرة إجابة تُقيّم كل ما تعلّمته"
      estimatedTime="8 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={10 * 60}
      timerLabel="10 دقائق"
      brief={{
        tag: 'التقويم',
        title: 'أظهر ما تعرفه',
        tone: 'slate',
        body: (
          <p>
            أجب عن الأسئلة الأحد عشر ثم أرسِلها دفعة واحدة. لن تُصحّح إجابة قبل
            الإرسال، ويمكنك العودة إلى أيّ سؤال قبل ذلك.
          </p>
        ),
      }}
      skills={{
        qawasim: { label: 'تعيين القواسم', module: 2 },
        mafhum: { label: 'مفهوم القاسم المشترك الأكبر', module: 2 },
        furuq: { label: 'طريقة الفروق المتتالية', module: 3 },
        aqlidus: { label: 'خوارزمية أقليدس', module: 4 },
        tahaqquq: { label: 'التحقق من النتيجة', module: 5 },
        tawzif: { label: 'توظيف في وضعية', module: 6 },
      }}
      epreuves={[
        /* ── P1 — تعيين قواسم عدد طبيعي ─────────────────────────────── */
        {
          id: 'E1',
          requires: ['qasim'],
          skill: 'qawasim',
          prompt: (
            <span>
              ما هي قواسم العدد <MathText>{'$28$'}</MathText>؟
            </span>
          ),
          options: [
            '1 ؛ 2 ؛ 4 ؛ 7 ؛ 14 ؛ 28',
            '1 ؛ 2 ؛ 4 ؛ 6 ؛ 14 ؛ 28',
            '2 ؛ 4 ؛ 7 ؛ 14',
            '1 ؛ 3 ؛ 7 ؛ 28',
          ],
          correct: 0,
          cols: 1,
          explain: (
            <span>
              <MathText>{'$28 = 1\\times28 = 2\\times14 = 4\\times7$'}</MathText>
              . لا ننسى <MathText>{'$1$'}</MathText> ولا العدد نفسه.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P1'] },
        },
        /* ── P2 — تعيين القواسم المشتركة لعددين ─────────────────────── */
        {
          id: 'E2',
          requires: ['qasim', 'qawasim-mushtaraka'],
          skill: 'qawasim',
          prompt: (
            <span>
              ما هي القواسم المشتركة للعددين <MathText>{'$16$'}</MathText> و{' '}
              <MathText>{'$24$'}</MathText>؟
            </span>
          ),
          options: ['1 ؛ 2 ؛ 4 ؛ 8', '1 ؛ 2 ؛ 4 ؛ 6 ؛ 8', '2 ؛ 4 ؛ 8 ؛ 16', '8 فقط'],
          correct: 0,
          cols: 1,
          explain: (
            <span>
              قواسم <MathText>{'$16$'}</MathText>:{' '}
              <MathText>{'$1,2,4,8,16$'}</MathText>؛ قواسم{' '}
              <MathText>{'$24$'}</MathText>:{' '}
              <MathText>{'$1,2,3,4,6,8,12,24$'}</MathText>. المشتركة:{' '}
              <MathText>{'$1,2,4,8$'}</MathText>.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P2'] },
        },
        /* ── P3 — فهم معنى القاسم المشترك الأكبر ────────────────────── */
        {
          id: 'E3',
          requires: ['pgcd'],
          skill: 'mafhum',
          prompt: <span>القاسم المشترك الأكبر لعددين هو:</span>,
          options: [
            'أكبر عدد يقسم العددين معًا',
            'أصغر عدد يقسم العددين معًا',
            'جداء العددين',
            'أكبر عدد من العددين',
          ],
          correct: 0,
          cols: 1,
          explain: (
            <span>
              هو <strong>أكبر</strong> القواسم المشتركة. أصغرها هو دائمًا{' '}
              <MathText>{'$1$'}</MathText>، وهو بلا فائدة.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P3'] },
        },
        {
          id: 'E4',
          requires: ['pgcd', 'qasim'],
          skill: 'mafhum',
          prompt: (
            <span>
              إذا كان <MathText>{'$a$'}</MathText> يقسم{' '}
              <MathText>{'$b$'}</MathText>، فما هو{' '}
              <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b)$'}</MathText>؟
            </span>
          ),
          options: ['a', 'b', '1', 'a × b'],
          correct: 0,
          cols: 4,
          explain: (
            <span>
              أكبر قاسم للعدد <MathText>{'$a$'}</MathText> هو{' '}
              <MathText>{'$a$'}</MathText> نفسه، وبما أنّه يقسم{' '}
              <MathText>{'$b$'}</MathText> أيضًا فهو القاسم المشترك الأكبر.
              مثال: <MathText>{'$\\mathrm{PGCD}(7\\ ;\\ 21) = 7$'}</MathText>.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P3'] },
        },
        /* ── P4 — الفروق المتتالية ──────────────────────────────────── */
        {
          id: 'E5',
          requires: ['furuq-mutatalia'],
          skill: 'furuq',
          prompt: (
            <span>
              بطريقة الفروق المتتالية على{' '}
              <MathText>{'$(30\\ ;\\ 18)$'}</MathText>، ما هو الزوج الذي نحصل
              عليه بعد الخطوة الأولى؟
            </span>
          ),
          options: ['(18 ؛ 12)', '(30 ؛ 12)', '(18 ؛ 48)', '(12 ؛ 6)'],
          correct: 0,
          cols: 2,
          explain: (
            <span>
              <MathText>{'$30 - 18 = 12$'}</MathText>؛ نحتفظ بالأصغر{' '}
              <MathText>{'$18$'}</MathText> وبالفرق{' '}
              <MathText>{'$12$'}</MathText>، أي{' '}
              <MathText>{'$(18\\ ;\\ 12)$'}</MathText>.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P4'] },
        },
        {
          id: 'E6',
          requires: ['furuq-mutatalia'],
          skill: 'furuq',
          prompt: (
            <span>
              أكمل بطريقة الفروق المتتالية:{' '}
              <MathText>{'$\\mathrm{PGCD}(30\\ ;\\ 18) = \\ ?$'}</MathText>
            </span>
          ),
          options: ['6', '12', '2', '90'],
          correct: 0,
          cols: 4,
          explain: (
            <span>
              <MathText>{'$30-18=12$'}</MathText> ←{' '}
              <MathText>{'$18-12=6$'}</MathText> ←{' '}
              <MathText>{'$12-6=6$'}</MathText> ← تساوى العددان عند{' '}
              <MathText>{'$6$'}</MathText>.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P4'] },
        },
        /* ── P5 — خوارزمية أقليدس ───────────────────────────────────── */
        {
          id: 'E7',
          requires: ['khwarizmiyat-aqlidus'],
          skill: 'aqlidus',
          prompt: (
            <span>
              بخوارزمية أقليدس:{' '}
              <MathText>{'$92 = 24 \\times 3 + 20$'}</MathText>. ما هي العملية
              الموالية؟
            </span>
          ),
          options: [
            '24 ÷ 20',
            '92 ÷ 20',
            '20 ÷ 24',
            'نتوقّف: وجدنا النتيجة',
          ],
          correct: 0,
          cols: 2,
          explain: (
            <span>
              نستبدل الزوج بـ (القاسم ؛ الباقي) أي{' '}
              <MathText>{'$(24\\ ;\\ 20)$'}</MathText>، فنقسم{' '}
              <MathText>{'$24$'}</MathText> على <MathText>{'$20$'}</MathText>.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P5'] },
        },
        {
          id: 'E8',
          requires: ['khwarizmiyat-aqlidus'],
          skill: 'aqlidus',
          prompt: (
            <span>
              أتمّ:{' '}
              <MathText>{'$92 = 24\\times3+20$'}</MathText>،{' '}
              <MathText>{'$24 = 20\\times1+4$'}</MathText>،{' '}
              <MathText>{'$20 = 4\\times5+0$'}</MathText>. إذن{' '}
              <MathText>{'$\\mathrm{PGCD}(92\\ ;\\ 24)$'}</MathText> يساوي:
            </span>
          ),
          options: ['4', '0', '20', '24'],
          correct: 0,
          cols: 4,
          explain: (
            <span>
              هو آخر باقٍ غير معدوم، أي <MathText>{'$4$'}</MathText>. الباقي{' '}
              <MathText>{'$0$'}</MathText> إشارة توقّف لا جواب.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P5'] },
        },
        /* ── P6 — التحقق من صحة الحساب ──────────────────────────────── */
        {
          id: 'E9',
          requires: ['tahaqquq', 'pgcd'],
          skill: 'tahaqquq',
          prompt: (
            <span>
              تلميذ يجد{' '}
              <MathText>{'$\\mathrm{PGCD}(36\\ ;\\ 48) = 6$'}</MathText>. ما
              الحكم؟
            </span>
          ),
          options: [
            'خطأ: 6 قاسم مشترك لكنّ 12 أكبر منه ويقسمهما أيضًا',
            'صحيح: 6 يقسم 36 و48',
            'خطأ: 6 لا يقسم 48',
            'خطأ: النتيجة يجب أن تكون 84',
          ],
          correct: 0,
          cols: 1,
          explain: (
            <span>
              <MathText>{'$6$'}</MathText> يقسم العددين فعلًا، لكن{' '}
              <MathText>{'$12$'}</MathText> يقسمهما أيضًا وهو أكبر. إذن{' '}
              <MathText>{'$\\mathrm{PGCD}(36\\ ;\\ 48) = 12$'}</MathText>.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P6'] },
        },
        /* ── P7 — توظيف في وضعية مشكلة ──────────────────────────────── */
        {
          id: 'E10',
          requires: ['mata-nastamil-pgcd', 'khwarizmiyat-aqlidus'],
          skill: 'tawzif',
          prompt: (
            <span>
              عند بستاني <MathText>{'$42$'}</MathText> وردة بيضاء و{' '}
              <MathText>{'$56$'}</MathText> وردة حمراء. يريد أكبر عدد من الباقات
              المتماثلة دون أن تبقى وردة. كم باقة؟
            </span>
          ),
          options: ['14', '7', '2', '98'],
          correct: 0,
          cols: 4,
          explain: (
            <span>
              <MathText>{'$56 = 42\\times1+14$'}</MathText> ثم{' '}
              <MathText>{'$42 = 14\\times3+0$'}</MathText>، إذن{' '}
              <MathText>{'$\\mathrm{PGCD}(42\\ ;\\ 56) = 14$'}</MathText> باقة.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P7'] },
        },
        {
          id: 'E11',
          requires: ['mata-nastamil-pgcd'],
          skill: 'tawzif',
          prompt: (
            <span>
              في الوضعية السابقة، كم وردة بيضاء في كل باقة؟
            </span>
          ),
          options: ['3', '14', '4', '6'],
          correct: 0,
          cols: 4,
          explain: (
            <span>
              <MathText>{'$42 \\div 14 = 3$'}</MathText> وردة بيضاء (و{' '}
              <MathText>{'$56 \\div 14 = 4$'}</MathText> حمراء). القاسم المشترك
              الأكبر يعطي عدد الباقات، ومحتوى الباقة يُحسب بالقسمة عليه.
            </span>
          ),
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_pgcd_P7'] },
        },
      ]}
      badges={[
        { id: 'b1', emoji: '🔢', label: 'سيّد القواسم', test: (m) => !m.qawasim },
        { id: 'b2', emoji: '🧠', label: 'فهم المعنى', test: (m) => !m.mafhum },
        { id: 'b3', emoji: '➖', label: 'الفروق المتتالية', test: (m) => !m.furuq },
        { id: 'b4', emoji: '➗', label: 'خوارزمية أقليدس', test: (m) => !m.aqlidus },
        { id: 'b5', emoji: '🔍', label: 'دقّة التحقق', test: (m) => !m.tahaqquq },
        { id: 'b6', emoji: '🎯', label: 'حلّ الوضعيات', test: (m) => !m.tawzif },
      ]}
      completion={{
        masterTitle: 'إتقان تامّ!',
        title: 'أنهيت الدرس',
        message:
          'أصبحت تعرف ما هو القاسم المشترك الأكبر، وتحسبه بطريقتين، وتتحقّق من نتيجتك، وتتعرّف عليه داخل وضعية.',
        verbs: ['تعيّن', 'تحسب', 'تتحقّق', 'توظّف'],
        masterBadgeLabel: 'خبير القاسم المشترك الأكبر',
      }}
      synthese={<CompleteView />}
    />
  );
}
