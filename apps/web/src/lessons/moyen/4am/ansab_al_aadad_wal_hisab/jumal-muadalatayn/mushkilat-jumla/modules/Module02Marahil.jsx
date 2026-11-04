import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookBox, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ABU_KAMIL, ABU_KAMIL_READING } from '../content/textbook';
import { EX } from '../content/exercises';

/**
 * Module 2 — les CINQ ÉTAPES appliquées (le tableau du manuel devenu méthode) :
 *   1. le تحدّ de la page d'unité (p. 55) : 37 pièces de 20DA et 10DA, 610DA — les étapes 1–2
 *      (choisir, traduire), puis 3 (la ثنائية tapée), puis 4–5 (vérifier dans le texte, répondre) ;
 *   2. la brique « tahaqquq-nas », puis une histoire de la PLATEFORME dont la jumla a une solution
 *      qui ne répond pas à l'histoire (10/3 d'une personne) ;
 *   3. أبو كامل (p. 55) : le problème du أجير, une jumla écrite mille ans avant la notation — la
 *      lecture retenue (mois de 30 jours, au prorata) dite en une ligne.
 * Rétrofit 2026-10-15 (§4quater) : la brique « tahaqquq-nas » vient APRÈS la réponse de « not-natural » (elle disait déjà que la
 * vérification se fait dans l'histoire), et la lecture retenue du problème d'أبو كامل (qui écrit la jumla x + y = 30 ; 6x = 4y)
 * APRÈS l'exercice qui la fait choisir. Module sans labo : la carte du haut dit ce qu'est le module et n'énonce aucun fait.
 * La leçon a `knowledgeMap: true` : pas de module de formalisation séparé. LP : P1, P2.
 */
export default function Module02Marahil() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (...ids) => ids.every((id) => done[id]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="المراحل الخمس — التحدّي وأبو كامل"
      moduleSubtitle="نختار، نترجم، نحلّ، نتحقق في النص، نجيب"
      objectives={['كم قطعة من كل فئة جمعها التلاميذ؟', 'هل يجيب حلّ الجملة دائمًا عن القصة؟', 'كيف حلّ أبو كامل مسألة الأجير؟']}
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'تحدّ وأبو كامل — الكتاب ص 55', headline: 'المراحل نفسها لكل مشكلة', emoji: '🪙',
        title: 'نطبّق مراحل الحل الخمس', tone: 'violet',
        body: <p>في المحور السابق مررتَ بالمراحل الخمس في المتحف. نطبّقها هنا على تحدّي الوحدة، ثم على مسألة كتبها أبو كامل قبل أكثر من ألف سنة.</p>,
      }}
      steps={[
        {
          num: 1, title: 'تحدّ — القطع النقدية لتزيين القسم', subtitle: 'المراحل 1 ← 5', done: all('challenge', 'challenge-2', 'challenge-3'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khutuwat-hall" variant="rappel" compact />
              <TextbookExercise exercise={EX.challenge} requires={['khutuwat-hall', 'jumla-tarjama']} onAnswered={mark('challenge')} />
              <TextbookExercise exercise={EX['challenge-2']} requires={['khutuwat-hall', 'hall-jumla']} onAnswered={mark('challenge-2')} />
              <TextbookExercise exercise={EX['challenge-3']} requires={['khutuwat-hall']} onAnswered={mark('challenge-3')} />
            </div>
          ),
        },
        {
          num: 2, title: 'نتحقق في القصة نفسها', subtitle: 'هل يجيب حلّ الجملة عن القصة؟', done: all('not-natural'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={EX['not-natural']} requires={['khutuwat-hall']} onAnswered={mark('not-natural')} />
              {done['not-natural'] && <KnowledgeBrick id="tahaqquq-nas" lead="المرحلتان 4 و 5 لا تعودان إلى الجملة، بل إلى القصة:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'أبو كامل — أجير يعمل وينقطع', subtitle: 'جملة معادلتين قبل الرموز', done: all('abu-kamil', 'abu-kamil-2'),
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" text={ABU_KAMIL.intro} source={ABU_KAMIL.source} compact />
              <TextbookExercise exercise={EX['abu-kamil']} requires={['jumla-tarjama', 'tahaqquq-nas']} onAnswered={mark('abu-kamil')} />
              {done['abu-kamil'] && <TextbookBox kind="remark" text={ABU_KAMIL_READING.text} source={ABU_KAMIL_READING.source} compact />}
              <TextbookExercise exercise={EX['abu-kamil-2']} requires={['tahaqquq-nas', 'hall-jumla']} onAnswered={mark('abu-kamil-2')} />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
