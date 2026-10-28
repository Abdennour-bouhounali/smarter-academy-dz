import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookExercise, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';
import { EX } from '../content/exercises';

/**
 * Module 4 — أوظّف تعلّماتي : la طريقة (p. 35) lue ligne à ligne, دوري الآن 1
 * (p. 36), les exercices 9–19 (pp. 37–38, « الجداءات الشهيرة »), 28 أ
 * (p. 39 — l'item ب est l'affaire de la leçon « تحليل عبارة جبرية »), puis
 * أتعمّق 35 et 36 (p. 41 ; 36 affiche l'énoncé CORRIGÉ et sa ligne
 * « صحّحت المنصّة … »). Laboratoire : les erreurs sont corrigées, jamais
 * comptées comme preuve. LP : P1, P2, P3, P4.
 *
 * `TextbookExercise` passe les options et corrections `$…$` des lignes
 * `batch` par MathText : les données restent du JS pur (content/exercises.js).
 */
const m = (tex) => <MathText key={tex}>{tex}</MathText>;
// La règle de la طريقة est posée par la brique `tariqat-nashr` (une seule fois).
const METHOD_LINES = { ...METHOD, rule: undefined };

export default function Module04Awazzif() {
  const [read, setRead] = useState(false);
  const [d, setD] = useState({});
  const done = (k) => () => setD((s) => ({ ...s, [k]: true }));

  return (
    <ContentModule
      ctx={MODULE_CTX}
      objectives={["بماذا نبدأ حين ننشر عبارة بمتطابقة شهيرة؟", "كيف نطبّق الطريقة على معاملات وجذور وأعداد؟", "كيف نحسب جداءات ومربعات ذهنيًا؟"]}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="الطريقة، دوري الآن، التمارين 9–19 و 28 أ، أتعمّق 35 و 36"
      estimatedTime="15 دقيقة"
      brief={{
        tag: 'طرائق ص 35 · دوري الآن ص 36 · أوظّف تعلّماتي ص 37–39 · أتعمّق ص 41', title: METHOD.title, tone: 'amber',
        body: <p>نقرأ طريقة الكتاب سطرًا سطرًا، ثم تمارينه بأعداده نفسها. في كل سطر اختر النتيجة ثم اقرأ التصحيح: الخطأ هنا يُصحَّح ولا يُحتسب.</p>,
      }}
      steps={[
        {
          num: 1, title: 'الطريقة: نشر عبارة باستعمال المتطابقات الشهيرة', subtitle: 'اكشف الحل سطرًا سطرًا', done: !!d.m,
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD_LINES} onAllRevealed={() => setRead(true)} />
              {read && (
                <div className="space-y-3">
                  <KnowledgeBrick id="tariqat-nashr" lead="الأسطر الثلاثة تتبع نفس الطريقة:" />
                  <TapQuestion
                    prompt={<span>ما أول ما نفعله لننشر <MathText>{'$(3 - 5x)^2$'}</MathText> بمتطابقة شهيرة؟</span>}
                    options={[
                      'نتعرّف على نوعها (مربع فرق) ونعيّن الحدين $a = 3$ و $b = 5x$',
                      'نكتب مباشرة $3^2 - (5x)^2$',
                      'نربّع كل حد ونجمع: $9 + 25x^2$',
                    ].map(m)}
                    correct={0}
                    cols={1}
                    requires={['tariqat-nashr']}
                    explain={<MathText>{'نوع المتطابقة يقرّر النشر: $(3 - 5x)^2 = 3^2 - 2 \\times 3 \\times 5x + (5x)^2 = 9 - 30x + 25x^2$.'}</MathText>}
                    onAnswered={done('m')}
                  />
                </div>
              )}
            </div>
          ),
        },
        { num: 2, title: 'دوري الآن 1', done: !!d.now,
          content: <TextbookExercise exercise={EX['now-36-1']} requires={['tariqat-nashr', 'nashr-qawsayn', 'tabsit-hudud']} onAnswered={done('now')} /> },
        { num: 3, title: 'تمرين 9 — مربع مجموع', done: !!d.e9,
          content: <TextbookExercise exercise={EX['ex-9']} requires={['tariqat-nashr', 'murabba-majmu']} onAnswered={done('e9')} /> },
        { num: 4, title: 'تمرين 10 — مربع مجموع بمعامل', done: !!d.e10,
          content: <TextbookExercise exercise={EX['ex-10']} requires={['tariqat-nashr', 'murabba-majmu', 'murabba-adad']} onAnswered={done('e10')} /> },
        { num: 5, title: 'تمرين 11 — حساب ذهني', done: !!d.e11,
          content: <TextbookExercise exercise={EX['ex-11']} requires={['hisab-mutamaan', 'murabba-majmu', 'quwa-ashara']} onAnswered={done('e11')} /> },
        { num: 6, title: 'تمرين 12 — أتمم المساواة', done: !!d.e12,
          content: <TextbookExercise exercise={EX['ex-12']} requires={['murabba-majmu']} onAnswered={done('e12')} /> },
        { num: 7, title: 'تمرين 13 — مربع فرق', done: !!d.e13,
          content: <TextbookExercise exercise={EX['ex-13']} requires={['tariqat-nashr', 'murabba-farq']} onAnswered={done('e13')} /> },
        { num: 8, title: 'تمرين 14 — مربع فرق بمعامل', done: !!d.e14,
          content: <TextbookExercise exercise={EX['ex-14']} requires={['tariqat-nashr', 'murabba-farq', 'murabba-adad']} onAnswered={done('e14')} /> },
        { num: 9, title: 'تمرين 15 — مجموع مربعين', done: !!d.e15,
          content: <TextbookExercise exercise={EX['ex-15']} requires={['tariqat-nashr', 'murabba-farq', 'tabsit-hudud']} onAnswered={done('e15')} /> },
        { num: 10, title: 'تمرين 16 — مربعان وعامل', done: !!d.e16,
          content: <TextbookExercise exercise={EX['ex-16']} requires={['tariqat-nashr', 'murabba-majmu', 'murabba-farq', 'tabsit-hudud']} onAnswered={done('e16')} /> },
        { num: 11, title: 'تمرين 17 — جداء مجموع وفرق', done: !!d.e17,
          content: <TextbookExercise exercise={EX['ex-17']} requires={['tariqat-nashr', 'jidaa-majmu-farq']} onAnswered={done('e17')} /> },
        { num: 12, title: 'تمرين 18 — جداء مجموع وفرق بمعامل', done: !!d.e18,
          content: <TextbookExercise exercise={EX['ex-18']} requires={['tariqat-nashr', 'jidaa-majmu-farq', 'murabba-adad']} onAnswered={done('e18')} /> },
        { num: 13, title: 'تمرين 19 — دون حساب', done: !!d.e19,
          content: <TextbookExercise exercise={EX['ex-19']} requires={['jidaa-majmu-farq', 'mutatabiqa']} onAnswered={done('e19')} /> },
        { num: 14, title: 'تمرين 28 أ — جداءات ذهنيا', done: !!d.e28,
          content: <TextbookExercise exercise={EX['ex-28']} requires={['jidaa-majmu-farq', 'hisab-mutamaan']} onAnswered={done('e28')} /> },
        { num: 15, title: 'تمرين 35 — أتعمّق', done: !!d.e35,
          content: <TextbookExercise exercise={EX['ex-35']} requires={['murabba-majmu', 'nashr-qawsayn', 'mutatabiqa']} onAnswered={done('e35')} /> },
        { num: 16, title: 'تمرين 36 — أتعمّق', subtitle: 'خمّن ثم برهن', done: !!d.e36,
          content: (
            <div className="space-y-2">
              <TextbookExercise exercise={EX['ex-36']} requires={['murabba-majmu', 'murabba-farq', 'jidaa-majmu-farq', 'mutatabiqa']} onAnswered={done('e36')} />
              <p className="text-xs text-slate-500"><MathText>{EX['ex-36'].correctionNote}</MathText></p>
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} variant="memo" />}
    />
  );
}
