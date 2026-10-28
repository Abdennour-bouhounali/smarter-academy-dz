import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 3 — أوظّف تعلّماتي : دوري الآن 1 (p. 35), puis les exercices 1 à 8
 * de la p. 37 dans l'ordre du livre. Les exercices 6 et 8 restent ce qu'ils
 * sont dans le livre : on JUGE le travail d'élèves (la copie du premier élève
 * de l'exercice 6 est gardée telle quelle, fausse deux fois — c'est elle
 * qu'on corrige). Laboratoire : les erreurs sont corrigées, jamais comptées
 * comme preuve de maîtrise. LP : P2, P3, P4.
 */
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  const mark = (k) => () => setDone((d) => ({ ...d, [k]: true }));
  return (
    <ContentModule
      ctx={MODULE_CTX}
      objectives={["كيف أنشر عبارة وأبسّطها بخطوات مرتّبة؟", "كيف أتحقّق من النشر بقيمة للحرف؟", "أين أخطأ تلميذان في النشر؟"]}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="دوري الآن، ثم تمارين الكتاب 1 إلى 8"
      estimatedTime="14 دقيقة"
      brief={{ tag: 'دوري الآن ص 35 — أوظّف تعلّماتي ص 37', title: 'نشر عبارة جبرية وتبسيطها', tone: 'amber',
        body: <p>نفس التمارين، بنفس الأعداد. أجب، ثم اقرأ التصحيح: الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'دوري الآن', subtitle: 'انشر وبسّط', done: !!done.now,
          content: <div className="space-y-3"><KnowledgeBrick id="nashr-qawsayn" variant="rappel" compact /><TextbookExercise exercise={EX['now-35-1']} requires={['nashr-qawsayn', 'tabsit']} onAnswered={mark('now')} /></div> },
        { num: 2, title: 'تمرين 1 — عدد في مجموع أو فرق', done: !!done.e1,
          content: <TextbookExercise exercise={EX['ex-1']} requires={['tawziiya-nashr']} onAnswered={mark('e1')} /> },
        { num: 3, title: 'تمرين 2 — نشر وتحقّق بقيمة', done: !!done.e2,
          content: <TextbookExercise exercise={EX['ex-2']} requires={['nashr-qawsayn', 'tabsit']} onAnswered={mark('e2')} /> },
        { num: 4, title: 'تمرين 3 — جداء قوسين', done: !!done.e3,
          content: <TextbookExercise exercise={EX['ex-3']} requires={['nashr-qawsayn', 'tabsit']} onAnswered={mark('e3')} /> },
        { num: 5, title: 'تمرين 4 — بالكسور، وتحقّق', done: !!done.e4,
          content: <TextbookExercise exercise={EX['ex-4']} requires={['nashr-qawsayn', 'tabsit']} onAnswered={mark('e4')} /> },
        { num: 6, title: 'تمرين 5 — بالكسور', done: !!done.e5,
          content: <TextbookExercise exercise={EX['ex-5']} requires={['nashr-qawsayn', 'tabsit']} onAnswered={mark('e5')} /> },
        { num: 7, title: 'تمرين 6 — إجابتا تلميذين', done: !!done.e6,
          content: <TextbookExercise exercise={EX['ex-6']} requires={['tabsit', 'hadhf-aqwas']} onAnswered={mark('e6')} /> },
        { num: 8, title: 'تمرين 7 — أقواس مسبوقة بإشارة ناقص', done: !!done.e7,
          content: <TextbookExercise exercise={EX['ex-7']} requires={['tabsit', 'hadhf-aqwas']} onAnswered={mark('e7')} /> },
        { num: 9, title: 'تمرين 8 — عمل رياض وإيمان', done: !!done.e8,
          content: <TextbookExercise exercise={EX['ex-8']} requires={['tawziiya-nashr', 'nashr-qawsayn']} onAnswered={mark('e8')} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} variant="memo" />}
    />
  );
}
