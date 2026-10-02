import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf, EX31_CORRECTION } from '../content/exercises';

/**
 * Module 3 — أتعمّق (p. 63) : les exercices 29 (le miel : 7kg dans 18 bocaux de
 * 500g et 250g), 30 (le distributeur : 356 billets, 454 000 DA) et 31 (lait et jus,
 * réduction de 20 %), au mot près, découpés question par question. Chacun refait la
 * démarche de la situation : choisir les inconnues, traduire chaque information,
 * résoudre, répondre. La brique `wihda-wahida` est posée quand l'ex. 29 mélange
 * kg et g ; `takhfid` quand l'ex. 31 demande « لماذا نضرب في 0,8 ». L'ex. 31 est
 * montré CORRIGÉ (x + y = 270 au lieu de 216), avec une ligne discrète. LP : P1, P2.
 */
export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (n) => partsOf(n).every((ex) => done[ex.id]);
  const part = (id) => partsOf(id.split('-')[1]).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="العسل، الموزّع الآلي، ومشتريات المتجر"
      estimatedTime="12 دقيقة"
      brief={{ tag: 'أتعمّق — الكتاب ص 63', title: 'ثلاث وضعيات أخرى بالطريقة نفسها', tone: 'rose',
        body: <p>في كل تمرين: نسمّي المجهولين، نترجم كل معلومة بمعادلة، نحل الجملة ثم نجيب عن السؤال. انتبه إلى الوحدات (التمرين 29) وإلى التخفيض (التمرين 31).</p> }}
      steps={[
        { num: 1, title: 'تمرين 29 — العسل', done: all('29'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-29-1')} requires={['tarjamat-maalumat']} onAnswered={mark('ex-29-1')} />
              <KnowledgeBrick id="wihda-wahida" lead="الكتلة الكلية بالكيلوغرام، وكتلة العلبة بالغرام: نوحّد الوحدة قبل كتابة المعادلة." />
              <TextbookExercise exercise={part('ex-29-2')} requires={['ikhtiyar-tariqa', 'wihda-wahida']} onAnswered={mark('ex-29-2')} />
            </div>
          ) },
        { num: 2, title: 'تمرين 30 — الموزّع الآلي للأوراق النقدية', done: all('30'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-30-1')} requires={['tarjamat-maalumat']} onAnswered={mark('ex-30-1')} />
              <TextbookExercise exercise={part('ex-30-2')} requires={['ikhtiyar-tariqa', 'tahaqquq-tafsir']} onAnswered={mark('ex-30-2')} />
            </div>
          ) },
        { num: 3, title: 'تمرين 31 — الحليب والعصير وبطاقة الإخلاص', done: all('31'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-31-1')} requires={['tahdid-majahil']} onAnswered={mark('ex-31-1')} />
              <p className="text-xs text-slate-500" data-correction="ex-31"><MathText>{EX31_CORRECTION}</MathText></p>
              <TextbookExercise exercise={part('ex-31-2a')} requires={['nisba-mia']} onAnswered={mark('ex-31-2a')} />
              <KnowledgeBrick id="takhfid" />
              <TextbookExercise exercise={part('ex-31-2b')} requires={['takhfid', 'tarjamat-maalumat']} onAnswered={mark('ex-31-2b')} />
              <TextbookExercise exercise={part('ex-31-2c')} requires={['takhfid']} onAnswered={mark('ex-31-2c')} />
              <TextbookExercise exercise={part('ex-31-3')} requires={['ikhtiyar-tariqa', 'jam']} onAnswered={mark('ex-31-3')} />
              <TextbookExercise exercise={part('ex-31-4')} requires={['tahaqquq-tafsir']} onAnswered={mark('ex-31-4')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
