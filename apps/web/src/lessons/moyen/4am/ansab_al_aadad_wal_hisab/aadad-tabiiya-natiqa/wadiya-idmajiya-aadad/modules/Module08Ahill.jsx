import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION } from '../content/textbook';

/**
 * Module 8 — وضعية الاختبار النهائي (stage: evaluation) : la résolution de la situation des tabliers
 * (le « تحدّي » du manuel, p. 7) en quatre épreuves qui suivent les trois étapes — la méthode n'est
 * jamais donnée d'un coup, et l'élève mobilise ce qu'il a entraîné dans les six وضعيات (modules 1 à 6).
 * LP : P1.
 */
const Q = ({ children }) => <span>{children} <SourceTag source={SITUATION.source} /></span>;
export default function Module08Ahill() {
  return (
    <BossFinal ctx={MODULE_CTX} navLinks={getNavLinks(8)} moduleNumber={8} moduleTitle="وضعية الاختبار النهائي" moduleSubtitle="أربع مراحل نحو عدد المدارس" estimatedTime="12 دقيقة" lessonConfig={LESSON_CONFIG} timerSeconds={12 * 60} timerLabel="12 دقيقة"
      brief={{ tag: 'أدمج تعلّماتي', title: 'كم مدرسة؟ وماذا تتحصّل عليه كل مدرسة؟', tone: 'amber', body: <p>{SITUATION.text}</p> }}
      skills={{ fahm: { label: 'قراءة الوضعية وفهمها', module: 7 }, istratijiya: { label: 'اختيار الاستراتيجية', module: 7 }, tanfidh: { label: 'تنفيذ الحل', module: 1 } }}
      epreuves={[
        { id: 'E1', skill: 'fahm', requires: ['pgcd-taarif'], prompt: <Q>المرحلة 1 — المطلوب هو البحث عن ...</Q>,
          options: ['أكبر عدد من المدارس يقسم عدد المآزر الورديّة ويقسم عدد المآزر الزرقاء دون باقٍ', 'عدد المآزر الذي تتحصل عليه المدرسة الواحدة من لون واحد فقط', 'مجموع عدد المآزر الورديّة والزرقاء', 'أصغر عدد من المدارس يمكن به التوزيع'], correct: 0, cols: 1,
          explain: <span>هذه هي «قراءة الوضعية وفهمها»: لا يبقى شيء، وعدد المدارس أكبر ما يمكن، فهو قاسم مشترك <strong>أكبر</strong> للعددين.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
        { id: 'E2', skill: 'istratijiya', requires: ['pgcd-taarif', 'khwarizmiyat-iqlidus'], prompt: <Q>المرحلة 2 — أيّ حساب يعيّن عدد المدارس؟</Q>,
          options: ['PGCD$(936 ; 845)$ بخوارزمية إقليدس', 'المجموع $936 + 845$', 'الفرق $936 - 845$ فقط', 'أصغر مضاعف مشترك للعددين 936 و 845'], correct: 0, cols: 1,
          explain: <span>عدد المدارس قاسم مشترك أكبر: نعيّنه بالقسمات المتتابعة. الفرق الأوّل <MathText>{'$936 - 845 = 91$'}</MathText> مجرّد خطوة من الخوارزمية، وليس نتيجتها.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
        { id: 'E3', skill: 'tanfidh', requires: ['pgcd-baqi'], prompt: <Q>المرحلة 3 — القسمات الإقليدية المتتابعة للعددين 936 و 845 تعطي البواقي ...</Q>,
          options: ['91 ثم 26 ثم 13 ثم 0', '91 ثم 13 ثم 0', '91 ثم 26 ثم 0', '845 ثم 91 ثم 26'], correct: 0, cols: 2,
          explain: <span><MathText>{'$936 = 845 \times 1 + 91$'}</MathText> ، <MathText>{'$845 = 91 \times 9 + 26$'}</MathText> ، <MathText>{'$91 = 26 \times 3 + 13$'}</MathText> ، <MathText>{'$26 = 13 \times 2 + 0$'}</MathText>.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
        { id: 'E4', skill: 'tanfidh', requires: ['pgcd-taarif'], prompt: <Q>المرحلة 4 — عدد المدارس وما تتحصّل عليه كل مدرسة هو ...</Q>,
          options: ['13 مدرسة: 72 مئزرًا ورديًا و 65 مئزرًا أزرق لكل مدرسة', '13 مدرسة: 65 مئزرًا ورديًا و 72 مئزرًا أزرق لكل مدرسة', '26 مدرسة: 36 مئزرًا ورديًا و 32 مئزرًا أزرق، ويبقى 13 مئزرًا', '91 مدرسة: 10 مآزر ورديّة و 9 مآزر زرقاء لكل مدرسة'], correct: 0, cols: 1,
          explain: <span>آخر باقٍ غير معدوم هو 13، إذن PGCD<MathText>{'$(936 ; 845) = 13$'}</MathText>. <MathText>{'$936 = 13 \times 72$'}</MathText> و <MathText>{'$845 = 13 \times 65$'}</MathText>: توزَّع المآزر على <strong>13 مدرسة</strong>، لكل مدرسة 72 مئزرًا ورديًا و 65 مئزرًا أزرق.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
      ]}
      badges={[{ id: 'idmaj', emoji: '🎽', label: 'أدمجت تعلّماتي', test: (m) => (m.fahm ?? 0) + (m.istratijiya ?? 0) + (m.tanfidh ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أنهيت الوحدة 1', title: 'الأعداد الطبيعيّة والأعداد النّاطقة', message: 'توزَّع المآزر على 13 مدرسة، لكل مدرسة 72 مئزرًا ورديًا و 65 مئزرًا أزرق. عبّأت القواسم المشتركة، والقاسم المشترك الأكبر، وخوارزمية إقليدس — ما تعلّمته في الدروس الثمانية.', verbs: ['أقرأ', 'أحلّل', 'أنفّذ', 'أتحقّق'], masterBadgeLabel: 'الوحدة 1' }} />
  );
}
