import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag, FractionQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, HISTORY, HISTORY_NOTE, BALANCE_LINES } from '../content/textbook';

/**
 * Module 1 — نشاط 1 (p. 44) : « المعادلات من الدرجة الأولى بمجهول واحد », ouvert sur la
 * BALANCE du vestiaire (equation-balance).
 *
 * LABORATOIRE À DEUX NIVEAUX, UN INSTRUMENT — même objectif : la même opération sur les
 * deux membres, jusqu'à ax = b, puis x = b/a.
 *   متقدم (ouvert par défaut : c'est le س 3 du نشاط 1, فاطمة) : 9x + 1 = −26 — pas de
 *          ballon à ôter à droite : poser une baudruche EST « retrancher 1 » ; le sac
 *          contient des baudruches (x = −3).
 *   مبتدئ : 3x + 2 = 11 (plateforme), des ballons seulement.
 *
 * Ordre (consigne de l'auteur) : le programme (س 1–2) donne l'expression 9x + 1, puis le
 * س 3 se résout SUR la balance — la liste des étapes de l'élève (`onTrial`) est affichée
 * au-dessus de la question (`[data-activity-evidence]`), puis la brique muadala-tarafayn
 * nomme ce que la main a fait (TOUCH THE MATH) ; le خوارزمي en aparté. Le س 4 (مصطفى,
 * 9x + 1 = 2x → −1/7) est le CONTRASTE : la balance demanderait des septièmes de baudruche,
 * l'algèbre le fait en une ligne — ce qui mène à معارف (ax = b → b/a).
 * La « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire) ferme la dernière étape (les deux niveaux du
 * laboratoire vivent dans l'intro) : la même balance, des sacs dans les DEUX plateaux,
 * résolue au module 5.
 * RÉTROFIT 2026-10-15 (guide §4quater) : UNE PISTE. Plus de carte `brief` ni de titre/lead de workspace ; la balance est en tête avec son
 * contexte et sa question. Étape 1 = POURQUOI la même opération sur les DEUX plateaux (sur ce que l'élève vient de faire), la brique
 * `muadala-tarafayn` APRÈS la réponse ; étape 2 = le programme de calcul du livre (س 1–2), qui explique d'où vient 9x + 1 ; étape 3 =
 * la balance de فاطمة : POURQUOI poser une baudruche revient à retrancher 1, puis la vérification par le programme ; étape 4 = مصطفى.
 * AUCUNE étape n'attend `onFinished`. LP : P1, P2.
 */
const BEGINNER = '3x+2=11';
const ADVANCED = '9x+1=-26';
const { start, end, fatima } = ACTIVITY.numbers;
const M = (t) => <MathText key={t}>{t}</MathText>;

export default function Module01Nashat() {
  const [trial, setTrial] = useState({ [BEGINNER]: null, [ADVANCED]: null });
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4a, setQ4a] = useState(false);
  const [q4, setQ4] = useState(false);
  const onTrial = (eq) => (summary) => setTrial((t) => ({ ...t, [eq]: summary }));

  /** Les étapes écrites par l'élève sur la balance (les deux niveaux), et rien d'autre. */
  const evidence = (eqs) => (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {eqs.map((eq) => {
        const tr = trial[eq];
        return (
          <li key={eq} data-evidence={eq} data-tried={tr && tr.steps.length ? 'true' : 'false'} className={tr && tr.steps.length ? 'text-slate-800' : 'text-slate-500'}>
            {!tr || tr.steps.length === 0 ? (
              <span>{`لم تكتب أي خطوة على ميزان ${eq === BEGINNER ? 'المستوى المبتدئ' : 'المستوى المتقدّم'} بعد.`}</span>
            ) : (
              <ol className="space-y-1" data-evidence="steps">
                <li className="font-bold"><MathText>{`$${tr.equation}$`}</MathText></li>
                {tr.steps.map((st, i) => (
                  <li key={i} data-evidence-step={i}><MathText>{`أي $${st.result}$`}</MathText></li>
                ))}
                {tr.solved && <li className="font-bold text-emerald-800"><MathText>{tr.verified ? 'تحقّقت بفتح الأكياس.' : 'بقي كيس واحد وحده في كفّة.'}</MathText></li>}
              </ol>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <ContentModule
      objectives={["ماذا نفعل بكفّتي الميزان لنعرف ما في كيس واحد؟", "ما العدد الذي اختارته فاطمة؟ وما العدد الذي اختاره مصطفى؟", "متى يصعب علينا حلّ المعادلة على الميزان؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — برنامج حساب"
      moduleSubtitle="المعادلة ميزان متوازن"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="equation-balance"
                level="beginner"
                eq={BEGINNER}
                lead="ميزان غرفة ملابس الفريق: ثلاثة أكياس وكرتان في كفّة، و11 كرة في الكفّة الأخرى."
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="equation-balance"
                level="advanced"
                eq={ADVANCED}
                title={'ميزان فاطمة: \u20669x + 1 = −26\u2069'}
                lead="الكرة تزن 1، والبالون المنفوخ يشدّ الكفّة إلى الأعلى فيزن −1: تسعة أكياس وكرة في كفّة، و26 بالونًا في الكفّة الأخرى."
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا نفعل الشيء نفسه بالكفّتين؟', subtitle: 'من خطواتك على الميزان', done: q1,
          content: (
            <div className="space-y-3">
              {evidence([BEGINNER, ADVANCED])}
              <TapQuestion
                prompt={<MathText>{'في كل خطوة أخذتَ العدد نفسه من الكفّتين معًا. لو أخذتَ كرتين من الكفّة اليسرى فقط، فماذا يحدث؟'}</MathText>}
                options={[
                  'يبقى الميزان متوازنًا ولا يتغيّر ما في الكيس',
                  'يميل الميزان: لم تعد الكفّتان متساويتين، فلا نستنتج شيئًا عمّا في الكيس',
                  'يميل الميزان لكنّ ما في الكيس يبقى كما هو في المعادلة الجديدة',
                ]}
                correct={1}
                cols={1}
                requires={['amaliyat-tarafayn']}
                explain={<MathText>{'الميزان المتوازن يعني تساوي الطرفين. أخذ كرتين من كفّة واحدة يكسر هذا التساوي، فتصير للمعادلة الجديدة حلّ آخر. أمّا الفعل نفسه في الكفّتين فيُبقي التساوي ويُبقي الحل.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="muadala-tarafayn" lead="ما فعلته بالميزان، مكتوبًا:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'من أين جاءت المعادلة؟', subtitle: 'برنامج الحساب — السؤالان 1 و 2', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" title={ACTIVITY.text} lines={ACTIVITY.program} source={ACTIVITY.source} compact />
              <NumericQuestion
                prompt={<MathText>{ACTIVITY.questions[0]}</MathText>}
                expected={end}
                parse={parseDec}
                requires={['taawid-musawat']}
                explain={<MathText>{`$${start} \\times 3 + 2 = 8$ ، ثم $8 \\times 3 = 24$ ، ثم $24 - 5 = ${end}$.`}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <TapQuestion
                  prompt={<MathText>{'2) عند اختيار العدد $x$ في البداية، ما العبارة التي نتحصّل عليها في نهاية البرنامج؟'}</MathText>}
                  options={[
                    <MathText key="a">{'$9x - 3$'}</MathText>,
                    <MathText key="b">{'$9x + 1$'}</MathText>,
                    <MathText key="c">{'$3x + 1$'}</MathText>,
                    <MathText key="d">{'$9x + 6$'}</MathText>,
                  ]}
                  correct={1}
                  cols={2}
                  requires={['nashr-tabsit']}
                  explain={<MathText>{'$(3x + 2) \\times 3 - 5 = 9x + 6 - 5 = 9x + 1$ : العدد 3 يُضرب في الحدّين معًا. ومن أجل $x = 2$ نجد $9 \\times 2 + 1 = 19$ ، كما في السؤال 1.'}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'عدد فاطمة', subtitle: 'السؤال 3 — على الميزان المتقدّم', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <p className="text-sm text-slate-600"><MathText>{`النتيجة $9x + 1$ تساوي $${fatima}$ : هي المعادلة $9x + 1 = ${fatima}$ ، وهي الميزان الذي في المستوى المتقدّم.`}</MathText></p>
              {evidence([ADVANCED])}
              <TapQuestion
                prompt={<MathText>{'لا توجد كرة في الكفّة اليمنى لتأخذها. ما الذي يعادل «طرح 1 من الطرفين» على ميزان فاطمة؟'}</MathText>}
                options={[
                  M('وضع بالون في كل كفّة: الكرة تزن $1$ والبالون يزن $-1$ ، فوضعه يطرح $1$'),
                  M('أخذ كيس من كل كفّة'),
                  M('وضع كرة في كل كفّة: الكرة تزن $1$ فتضيف $1$'),
                ]}
                correct={0}
                cols={1}
                requires={['amaliyat-tarafayn']}
                explain={<MathText>{'طرح 1 يعني إضافة $-1$ ، أي بالون واحد في كل كفّة: $9x + 1 + (-1) = -26 + (-1)$ أي $9x = -27$. أمّا وضع كرة فيضيف 1 إلى الطرفين.'}</MathText>}
                onAnswered={() => setQ3a(true)}
              />
              {q3a && (
                <NumericQuestion
                  prompt={<MathText>{`وجدتَ على الميزان أنّ فاطمة اختارت $-3$ . طبّق عليها برنامج الحساب: ما النتيجة؟`}</MathText>}
                  expected={fatima}
                  parse={parseDec}
                  requires={['muadala-tarafayn']}
                  explain={<MathText>{'$(-3) \\times 3 + 2 = -7$ ، ثم $-7 \\times 3 = -21$ ، ثم $-21 - 5 = -26$ : هي النتيجة التي حصلت عليها فاطمة.'}</MathText>}
                  onAnswered={() => setQ3(true)}
                />
              )}
              {q3 && (
                <>
                  <TextbookBox kind="remark" title={HISTORY.caption} text={HISTORY.text} source={HISTORY.source} compact />
                  <p className="text-xs text-slate-600"><MathText>{HISTORY_NOTE.text}</MathText> <SourceTag source={HISTORY_NOTE.source} /></p>
                </>
              )}
            </div>
          ),
        },
        {
          num: 4, title: 'عدد مصطفى', subtitle: 'السؤال 4', done: q4,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{`${ACTIVITY.questions[3]} — إذا سمّينا $x$ العدد الذي اختاره، فأيّ معادلة يحقّقها؟`}</MathText>}
                options={[
                  <MathText key="a">{'$9x + 1 = 2$'}</MathText>,
                  <MathText key="b">{'$9x + 1 = x + 2$'}</MathText>,
                  <MathText key="c">{'$9x + 1 = 2x$'}</MathText>,
                  <MathText key="d">{'$2(9x + 1) = x$'}</MathText>,
                ]}
                correct={2}
                cols={2}
                requires={['muadala-tarafayn']}
                explain={<MathText>{'نتيجة البرنامج $9x + 1$ ، وضعف العدد المختار $2x$ : المعادلة $9x + 1 = 2x$. هنا المجهول في الطرفين.'}</MathText>}
                onAnswered={() => setQ4a(true)}
              />
              {q4a && (
                <>
                  <p className="text-sm text-slate-700">على الميزان: كيسان في الكفّة اليمنى… وفي النهاية يلزم سُبع بالون! بالحساب يكفي سطر لكل خطوة.</p>
                  <FractionQuestion
                    prompt={<MathText>{'حلّ المعادلة $9x + 1 = 2x$ بإجراء العملية نفسها على الطرفين: $x = $'}</MathText>}
                    expected="-1/7"
                    requireIrreducible={false}
                    requires={['muadala-tarafayn']}
                    explain={`${BALANCE_LINES.mustafa} للتحقّق: $9 \\times \\left(-\\dfrac{1}{7}\\right) + 1 = \\dfrac{-9 + 7}{7} = -\\dfrac{2}{7} = 2 \\times \\left(-\\dfrac{1}{7}\\right)$.`}
                    onAnswered={() => setQ4(true)}
                  />
                </>
              )}
              {q4 && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'في الحالتين وصلنا إلى معادلة يكون فيها المجهول في طرف واحد مضروبًا في عدد: $9x = -27$ ثم $7x = -1$. المحور التالي يعطي هذا الشكل اسمه وحلّه.'}</MathText>
                </p>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
