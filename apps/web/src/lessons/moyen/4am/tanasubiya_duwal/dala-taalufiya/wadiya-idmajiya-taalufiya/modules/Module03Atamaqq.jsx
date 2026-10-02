import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf, part } from '../content/exercises';

/**
 * Module 3 — أتعمّق : trois problèmes de la PLATEFORME (content/exercises.js), chacun sur un cas que
 * la sortie à la plage ne montre pas : deux droites PARALLÈLES (باقتا الإنترنت — la جملة n'a pas de
 * solution, un forfait toujours moins cher), une fonction DÉCROISSANTE connue par deux relevés (بطارية
 * الهاتف — quand s'annule-t-elle ? 6 h 40 min), « moins cher » comme INÉGALITÉ lue en nombre entier
 * (قاعة الرياضة — égalité à 10, carte moins chère dès 11). La brique `tanaqus` est posée entre la formule et la
 * question qui l'exige (elle dit la méthode, pas la réponse) ; `tawazi` et `mutarajiha-ikhtiyar`, qui
 * énoncent la conclusion, viennent APRÈS la question qu'elles corrigent.
 * LP : P1, P2.
 */
export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (prefix) => partsOf(prefix).every((ex) => done[ex.id]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="باقتا الإنترنت، بطارية الهاتف، وقاعة الرياضة"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أتعمّق — تمارين من المنصّة', title: 'ثلاث حالات لم تظهر في الرحلة: متوازيان، متناقصة، ومتراجحة', tone: 'rose',
        body: <p>في كل تمرين: نكتب الدالة التآلفية أو نقارن معاملاتها، نختار طريقة جبرية أو بيانية، ثم نجيب بجملة في سياق الوضعية (بالدينار، بالساعات والدقائق، بعدد طبيعي من الحصص).</p> }}
      steps={[
        { num: 1, title: 'باقتا الإنترنت', subtitle: 'المعامل نفسه', done: all('internet'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('internet-1')} requires={['muamil-tawjih', 'taqatu-jumla']} onAnswered={mark('internet-1')} />
              <TextbookExercise exercise={part('internet-2')} requires={['taqatu-jumla', 'mufadala']} onAnswered={mark('internet-2')} />
              {done['internet-2'] && <KnowledgeBrick id="tawazi" />}
            </div>
          ) },
        { num: 2, title: 'بطارية الهاتف', subtitle: 'من قراءتين إلى لحظة الانطفاء', done: all('batterie'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('batterie-1')} requires={['tanasub-taghayyurat', 'min-thunaiyatayn']} onAnswered={mark('batterie-1')} />
              <KnowledgeBrick id="tanaqus" lead="المعامل سالب: نسبة الشحن تنقص كل ساعة." />
              <TextbookExercise exercise={part('batterie-2')} requires={['tanaqus', 'adad-sura']} onAnswered={mark('batterie-2')} />
            </div>
          ) },
        { num: 3, title: 'قاعة الرياضة', subtitle: 'متى تصبح البطاقة أرخص؟', done: all('salle'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('salle-1')} requires={['ikhtiyar-sigha']} onAnswered={mark('salle-1')} />
              <TextbookExercise exercise={part('salle-2')} requires={['ikhtiyar-sigha', 'tafsir-natija']} onAnswered={mark('salle-2')} />
              {done['salle-2'] && <KnowledgeBrick id="mutarajiha-ikhtiyar" />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
