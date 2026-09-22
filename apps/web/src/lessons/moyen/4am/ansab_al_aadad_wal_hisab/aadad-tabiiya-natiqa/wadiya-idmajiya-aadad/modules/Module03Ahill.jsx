import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { SITUATION } from '../content/textbook';

/**
 * Module 3 — أحلّ الوضعية (stage: evaluation) : la résolution en quatre
 * épreuves qui suivent les trois étapes du manuel — la méthode n'est
 * jamais donnée d'un coup, et l'élève mobilise plusieurs leçons. LP : P1.
 */
const Q = ({ children }) => <span>{children} <SourceTag source={SITUATION.source} /></span>;
export default function Module03Ahill() {
  return (
    <BossFinal ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="أحلّ الوضعية" moduleSubtitle="أربع مراحل نحو عدد القطع" estimatedTime="12 دقيقة" lessonConfig={LESSON_CONFIG} timerSeconds={12 * 60} timerLabel="12 دقيقة"
      brief={{ tag: 'أدمج تعلّماتي', title: 'ما هو عدد القطع الخزفية؟', tone: 'amber', body: <p>{SITUATION.text}</p> }}
      skills={{ fahm: { label: 'قراءة الوضعية وفهمها', module: 1 }, istratijiya: { label: 'اختيار الاستراتيجية', module: 1 }, tanfidh: { label: 'تنفيذ الحل', module: 1 } }}
      epreuves={[
        { id: 'E1', skill: 'fahm', requires: ['qabiliyat-10'], prompt: <Q>المرحلة 1 — المطلوب هو البحث عن عدد ...</Q>,
          options: ['أصغر من 2443، مضاعف لـ 4 و 8 و 10، رقما عشراته ومئاته متساويان ويساويان ضعف رقم آلافه', 'أكبر من 2443 ويقبل القسمة على 22', 'من أربعة أرقام متساوية', 'قاسم مشترك للأعداد 4 و 8 و 10'], correct: 0, cols: 1,
          explain: <span>هذه هي «قراءة الوضعية وفهمها» في الكتاب: مضاعف للأعداد الثلاثة، لا قاسم.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
        { id: 'E2', skill: 'istratijiya', requires: ['qabiliyat-10', 'tarmiz-bi-huruf'], prompt: <Q>المرحلة 2 — العدد مكتوب <MathText>{'$1000a + 100b + 10c + d$'}</MathText>. ما الذي نعرفه يقينًا؟</Q>,
          options: ['d = 0 لأن العدد مضاعف لـ 10، و b = c = 2a', 'a = 2 و d = 3', 'b = c = a', 'd = 4 أو 8'], correct: 0, cols: 1,
          explain: <span>مساعدة الكتاب: كل عدد مضاعف للعدد 10 رقم آحاده 0. والمعطى الثاني يربط الأرقام الثلاثة الأخرى.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
        { id: 'E3', skill: 'tanfidh', requires: ['tarmiz-bi-huruf'], prompt: <Q>المرحلة 3 — مع b = c = 2a و d = 0 والعدد لا يفوق 2443، الأعداد المرشّحة هي ...</Q>,
          options: ['1220 و 2440', '1110 و 2220', '1220 فقط', '2440 و 3660'], correct: 0, cols: 2,
          explain: <span>a = 1 يعطي 1220، a = 2 يعطي 2440، و a = 3 يعطي <span dir="ltr">{'3660 > 2443'}</span>.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
        { id: 'E4', skill: 'tanfidh', requires: ['qabiliyat-10'], prompt: <Q>المرحلة 4 — بين 1220 و 2440، أيّهما يقبل القسمة على 4 و 8 و 10 معًا؟</Q>,
          options: ['2440 فقط: 1220 = 8 × 152 + 4 لا يقبل القسمة على 8', 'كلاهما', '1220 فقط', 'لا أحد منهما'], correct: 0, cols: 1,
          explain: <span>2440 = 8 × 305 = 4 × 610 = 10 × 244. عدد القطع الخزفية هو <strong>2440</strong>.</span>, assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'] } },
      ]}
      badges={[{ id: 'idmaj', emoji: '🏛️', label: 'أدمجت تعلّماتي', test: (m) => (m.fahm ?? 0) + (m.istratijiya ?? 0) + (m.tanfidh ?? 0) === 0 }]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{ masterTitle: 'أنهيت الوحدة 1', title: 'الأعداد الطبيعيّة والأعداد النّاطقة', message: 'عدد القطع الخزفية 2440. عبّأت قابلية القسمة، والقواسم، والترميز بالحروف — ما تعلّمته في الدروس الثمانية.', verbs: ['أقرأ', 'أحلّل', 'أنفّذ', 'أتحقّق'], masterBadgeLabel: 'الوحدة 1' }} />
  );
}
