import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACT_4, LAB, MISTAKE_NOT_O } from '../content/textbook';
import { Act4Graphs } from '../components/Graphs';

/**
 * Module 1 — نشاط 4 (p. 67) : « ما هو التمثيل الذي يعبّر عن وضعية تناسبية؟ عيّن عندئذ معامل
 * التناسبية a . أعط تفسيرا هندسيا للعدد a ».
 *
 * Le laboratoire `origin-line` (écrit par la leçon 3, réutilisé par ses props — content/textbook.js
 * › LAB) en mode `fit` : les points de mesure sont posés, l'élève fait PIVOTER la droite autour de O
 * jusqu'à ce qu'elle passe par tous ; le laboratoire écrit alors y = a·x.
 *   مبتدئ (défaut) — le câble du téléphérique par trois pylônes → a = 0,5 (contexte plateforme, déclaré).
 *   متقدم — le ressort de la طريقة p. 71 : a = 0,3 hors des nœuds, puis les deux lectures.
 * Les pommes de terre de نشاط 4 (kg × DA) ne rentrent dans aucun monde du lab : l'activité elle-même est
 * travaillée sur ses trois graphiques redessinés (components/Graphs.jsx), juste sous le laboratoire.
 *
 * AUCUNE étape n'attend `onFinished` : les questions portent sur les trois graphiques du manuel
 * (redessinés), et `onFinished` / `onTrial` ne font que lister ce que l'élève a fait lui-même
 * (`[data-activity-evidence]`, MANIPULATION_DNA §9).
 *
 * Étapes : (1) quel graphique est proportionnel ; (2) la brique « tanasub-bayan », puis a = 50 ;
 * (3) ce que signifie a ; (4) la brique « laysat-tanasub » et le contraste (2) / (3). LP : P1, P2.
 * Les deux niveaux du lab vivent dans `intro` : le rappel de la « مسألة الدرس » (un autre ressort,
 * module 4) clôt donc la DERNIÈRE étape. Le `lead` du workspace ne dit pas la règle « tanasub-bayan »
 * (elle est prédite à l'étape 2 — « أتوقّع القاعدة ») : il ne donne que la consigne.
 */
export default function Module01Tamthilat() {
  const [fitted, setFitted] = useState({});
  const [trials, setTrials] = useState(0);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const fit = (level) => () => setFitted((f) => ({ ...f, [level]: true }));

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      <li className={fitted.beginner ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="beginner" data-tried={fitted.beginner ? 'true' : 'false'}>
        {fitted.beginner ? 'ضبطتَ حبل التلفريك على رؤوس الأعمدة (المستوى المبتدئ).' : 'لم تضبط بعد حبل التلفريك على رؤوس الأعمدة (المستوى المبتدئ).'}
      </li>
      <li className={fitted.advanced ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="advanced" data-tried={fitted.advanced ? 'true' : 'false'}>
        {fitted.advanced ? 'ضبطتَ المستقيم على نقط النابض (المستوى المتقدّم).' : 'لم تضبط بعد المستقيم على نقط النابض (المستوى المتقدّم).'}
      </li>
      {trials > 0 && <li className="text-slate-700" data-evidence="trials">عدد محاولاتك في المختبر: <span dir="ltr">{trials}</span></li>}
    </ul>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 4 — أيّ تمثيل يعبّر عن وضعية تناسبية؟"
      moduleSubtitle="أدِر المستقيم حول المبدأ حتى يمرّ بكل النقط"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'نشاط 4 — الكتاب ص 67',
        headline: 'حبل التلفريك، نابض، وسعر البطاطا',
        emoji: '🚡',
        title: ACT_4.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p><MathText>{ACT_4.text}</MathText></p>
            <p className="text-sm text-slate-600">في المختبر: المبدأ O مثبّت، أدِر المستقيم حتى يمرّ بكل نقط القياس، وراقب الدستور الذي يكتبه المختبر.</p>
          </div>
        ),
        footer: <SourceTag source={ACT_4.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="المهمّة نفسها في المستويين: أدِر المستقيم حول المبدأ حتى يمرّ بكل نقط القياس، وراقب الدستور الذي يكتبه المختبر."
          levels={{
            beginner: () => (
              <Manipulation type="origin-line" level="beginner" {...LAB.beginner}
                onFinished={fit('beginner')} onTrial={() => setTrials((n) => n + 1)} />
            ),
            advanced: () => (
              <Manipulation type="origin-line" {...LAB.advanced}
                onFinished={fit('advanced')} onTrial={() => setTrials((n) => n + 1)} />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أيّ تمثيل يعبّر عن وضعية تناسبية؟', subtitle: 'التمثيلات الثلاثة للكتاب', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <Act4Graphs />
              <TapQuestion
                prompt="من بين التمثيلات البيانية الثلاثة، ما هو التمثيل الذي يعبّر عن وضعية تناسبية؟"
                options={['التمثيل (1): السعر بدلالة كتلة البطاطا', 'التمثيل (2): محيط المستطيل بدلالة عرضه', 'التمثيل (3): مساحة المربع بدلالة طول ضلعه', 'التمثيلات الثلاثة']}
                correct={0}
                cols={1}
                requires={['qiraa-bayaniya', 'tayin-dala-khattiya']}
                explain={<MathText>{'نقط التمثيل (1) على مستقيم يشمل المبدأ $O$ . نقط (2) على مستقيم لا يشمل المبدأ، ونقط (3) على منحنى.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'عيّن معامل التناسبية a', subtitle: 'اقرأ نقطة من التمثيل (1)', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tanasub-bayan" lead={<MathText>{'ما فعلته في المختبر: مستقيم واحد يشمل المبدأ يمرّ بكل النقط، فنمذج الوضعية بالدالة الخطية $f(x) = ax$ .'}</MathText>} />
              <NumericQuestion
                prompt={<span>النقطة <MathText>{'$(3 ; 150)$'}</MathText> من التمثيل (1). ما هو معامل التناسبية <MathText>{'$a$'}</MathText> ؟</span>}
                expected={ACT_4.numbers.a}
                requires={['tanasub-bayan']}
                explain={<MathText>{'$a = \\dfrac{150}{3} = 50$ ، وكذلك $\\dfrac{25}{0{,}5} = 50$ : السعر $y = 50x$ .'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'تفسير العدد a', subtitle: 'في الوضعية وعلى التمثيل', done: q3,
          content: (
            <TapQuestion
              prompt={<span>ماذا يمثّل العدد <MathText>{'$a = 50$'}</MathText> في هذه الوضعية؟</span>}
              options={['سعر 1kg من البطاطا: 50DA', 'سعر 50kg من البطاطا', 'كتلة البطاطا التي ثمنها 1DA', 'عدد الكيلوغرامات المشتراة']}
              correct={0}
              cols={1}
              requires={['tanasub-bayan']}
              explain={<MathText>{ACT_4.meaning}</MathText>}
              onAnswered={() => setQ3(true)}
            />
          ),
        },
        {
          num: 4, title: 'لماذا ليس التمثيلان (2) و (3)؟', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="laysat-tanasub" lead="المقارنة التي يطلبها الكتاب:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">ماذا نرى في كل تمثيل؟</p>}
                rows={[
                  { id: 'perim', label: 'التمثيل (2): محيط المستطيل', options: ['مستقيم يشمل المبدأ', 'مستقيم لا يشمل المبدأ', 'منحنى'], correct: 1, correction: <MathText>{ACT_4.others.perimeter}</MathText> },
                  { id: 'area', label: 'التمثيل (3): مساحة المربع', options: ['مستقيم يشمل المبدأ', 'مستقيم لا يشمل المبدأ', 'منحنى'], correct: 2, correction: <MathText>{ACT_4.others.area}</MathText> },
                ]}
                requires={['laysat-tanasub']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight ? MISTAKE_NOT_O.right : MISTAKE_NOT_O.why}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ4(true)}
              />
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
