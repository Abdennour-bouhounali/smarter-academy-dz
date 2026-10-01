import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookBox, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX13_NOTE, EX40_NOTE } from '../content/textbook';
import { partsOf } from '../content/exercises';
import { RectTriangleFigure, RectangleFigure, TiltedSquareFigure, ColouredRectFigure } from '../components/Figures';

/**
 * Module 3 — أوظّف تعلّماتي (pp. 50–51) et أتعمّق (p. 53) : exercices 10, 11, 12, 13,
 * 30, 33, 37, 38, 39, 40. Cinq étapes de deux exercices : des nombres, des âges et une
 * durée, des périmètres, un programme de calcul et l'inégalité triangulaire, deux aires
 * (équations produit nul, une solution refusée). L'exercice 13 est elliptique : la lecture
 * retenue est dite en une ligne ; la figure de l'exercice 40 est CORRIGÉE (m → cm).
 * Chaque étape est faite quand chaque exercice a reçu une réponse (juste ou fausse).
 * LP : P1, P2.
 */
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (...ns) => ns.every((n) => partsOf(n).every((ex) => done[ex.id]));

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="تمارين الكتاب 10 ← 13، 30، 33 و 37 ← 40"
      estimatedTime="15 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي وأتعمّق — الكتاب ص 50، 51 و 53', title: 'ترييض مشكلات الكتاب', tone: 'amber',
        body: <p>في كل تمرين: اختر المعادلة أو المتراجحة التي تترجم النص، ثم الحل، ثم تأكّد أنه يلائم الوضعية. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرينا 10 و 11 — أعداد مجهولة', done: all('10', '11'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tarrid-tariqa" variant="rappel" compact />
              {[...partsOf('10'), ...partsOf('11')].map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-tariqa']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 2, title: 'تمرينا 12 و 13 — أعمار ومدّة', done: all('12', '13'),
          content: (
            <div className="space-y-3">
              {partsOf('12').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-namdhaja', 'tarrid-tariqa']} onAnswered={mark(ex.id)} />)}
              <TextbookBox kind="remark" text={EX13_NOTE.text} source={EX13_NOTE.source} compact />
              {partsOf('13').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-tariqa', 'taklifa-nisba']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 3, title: 'تمرينا 30 و 33 — محيطات ومتراجحات', done: all('30', '33'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tarrid-mutarajiha" variant="rappel" compact />
              <RectTriangleFigure />
              {partsOf('30').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-mutarajiha', 'tahaqquq-waqi', 'muhit-misaha']} onAnswered={mark(ex.id)} />)}
              <RectangleFigure />
              {partsOf('33').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-mutarajiha', 'muhit-misaha']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 4, title: 'تمرينا 37 و 38 — برنامج حساب ومثلث', done: all('37', '38'),
          content: (
            <div className="space-y-3">
              {partsOf('37').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-tariqa', 'tahaqquq-waqi']} onAnswered={mark(ex.id)} />)}
              {partsOf('38').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tarrid-mutarajiha', 'tahaqquq-waqi']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 5, title: 'تمرينا 39 و 40 — مساحات وجداء معدوم', done: all('39', '40'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tahaqquq-waqi" variant="rappel" compact />
              <TiltedSquareFigure />
              {partsOf('39').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tahaqquq-waqi', 'jidaa-maadum', 'muhit-misaha']} onAnswered={mark(ex.id)} />)}
              <ColouredRectFigure />
              <TextbookBox kind="remark" text={EX40_NOTE.text} source={EX40_NOTE.source} compact />
              {partsOf('40').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['tahaqquq-waqi', 'jidaa-maadum']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
