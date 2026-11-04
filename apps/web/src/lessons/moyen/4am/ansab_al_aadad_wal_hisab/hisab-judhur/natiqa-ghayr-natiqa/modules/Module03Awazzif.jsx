import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 3 — أوظّف تعلّماتي (p. 26–29) : exercices 9, 10, 25, 35 et 31
 * (item 1), dans l'ordre du manuel. Les mots بالنقصان / بالزيادة / المدوّر
 * viennent des années antérieures : la brique `qima-muqarraba` les rappelle
 * AVANT le premier exercice qui les emploie (rappel de la plateforme,
 * déclaré). Les erreurs sont corrigées, jamais comptées. LP : P1, P3.
 */
export default function Module03Awazzif() {
  const [d1, setD1] = useState(false);
  const [d2, setD2] = useState(false);
  const [d3, setD3] = useState(false);
  const [d4, setD4] = useState(false);
  const [d5, setD5] = useState(false);
  const [d6, setD6] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="قيم مقرّبة ومدوّرات — تمارين الكتاب 9، 10، 25، 35 و 31"
      estimatedTime="11 دقيقة"
      objectives={['كيف أحصر جذرًا بين عددين عشريين متتاليين؟', 'متى أدوّر بالزيادة ومتى بالنقصان؟', 'هل يساوي عدد عشري جذرًا معيّنًا؟']}
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 26 إلى 29', title: 'لعدد غير ناطق: قيم مقرّبة', tone: 'amber',
        body: <p>تمارين الكتاب بأعدادها: قيم مقرّبة ومدوّرات لجذور تربيعية. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 9 — قيم مقرّبة إلى الجزء من 10', done: d1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qima-muqarraba" lead="تذكير من السنوات السابقة، قبل أول تمرين يستعمله:" />
              <TextbookExercise exercise={EX['ex-9']} requires={['qima-muqarraba', 'jidhr-taarif']} onAnswered={() => setD1(true)} />
            </div>
          ) },
        { num: 2, title: 'تمرين 10 — ضلع مربع مساحته 12', done: d2,
          content: <TextbookExercise exercise={EX['ex-10']} requires={['qima-muqarraba', 'jidhr-taarif']} onAnswered={() => setD2(true)} /> },
        { num: 3, title: 'تمرين 25 — مساحة مثلث متقايس الأضلاع', done: d3,
          content: <TextbookExercise exercise={EX['ex-25']} requires={['qima-muqarraba', 'jidhr-taarif']} onAnswered={() => setD3(true)} /> },
        { num: 4, title: 'تمرين 35 (1) — الحصر بين عددين طبيعيين متتاليين', done: d4,
          content: <TextbookExercise exercise={EX['ex-35-1']} requires={['jidhr-taarif', 'ghayr-natiq']} onAnswered={() => setD4(true)} /> },
        { num: 5, title: 'تمرين 35 (2) — المدوّر إلى الجزء من 100', done: d5,
          content: <TextbookExercise exercise={EX['ex-35-2']} requires={['qima-muqarraba']} onAnswered={() => setD5(true)} /> },
        { num: 6, title: 'تمرين 31 (1) — هل هذا العدد العشري يساوي الجذر؟', done: d6,
          content: <TextbookExercise exercise={EX['ex-31-1']} requires={['ghayr-natiq', 'qima-mudbuta']} onAnswered={() => setD6(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} variant="memo" />}
    />
  );
}
