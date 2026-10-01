import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag, FractionQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, HOOK, HISTORY, HISTORY_NOTE, BALANCE_LINES } from '../content/textbook';
import BalanceVignette from '../components/BalanceVignette';

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
 * AUCUNE étape n'attend `onFinished`. LP : P1, P2.
 */
const BEGINNER = '3x+2=11';
const ADVANCED = '9x+1=-26';
const { start, end, fatima } = ACTIVITY.numbers;

export default function Module01Nashat() {
  const [trial, setTrial] = useState({ [BEGINNER]: null, [ADVANCED]: null });
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4a, setQ4a] = useState(false);
  const [q4, setQ4] = useState(false);
  const onTrial = (eq) => (summary) => setTrial((t) => ({ ...t, [eq]: summary }));
  const fat = trial[ADVANCED];

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — برنامج حساب"
      moduleSubtitle="المعادلة ميزان متوازن"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 44',
        headline: HOOK.headline,
        emoji: '⚖️',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <BalanceVignette />,
        body: (
          <div className="space-y-2">
            <p><MathText>{HOOK.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'الكرة تزن $1$ ، والبالون المنفوخ يشدّ الكفّة إلى الأعلى: يزن $-1$ ، والكيس المغلق يزن ما فيه: $x$.'}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={HOOK.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="نفس الفكرة في المستويين: لا نفتح الكيس، بل نُبقي الميزان متوازنًا حتى يبقى كيس واحد وحده في كفّة."
          levels={{
            beginner: () => (
              <Manipulation
                type="equation-balance"
                level="beginner"
                eq={BEGINNER}
                lead="ثلاثة أكياس وكرتان مقابل 11 كرة: كم كرة في كل كيس؟"
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="equation-balance"
                level="advanced"
                eq={ADVANCED}
                title="ميزان فاطمة: 9x + 1 = −26"
                lead="تسعة أكياس وكرة مقابل 26 بالونًا: ماذا يوجد في كل كيس؟"
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'برنامج الحساب', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" title={ACTIVITY.text} lines={ACTIVITY.program} source={ACTIVITY.source} compact />
              <NumericQuestion
                prompt={<MathText>{ACTIVITY.questions[0]}</MathText>}
                expected={end}
                parse={parseDec}
                requires={['taawid-musawat']}
                explain={<MathText>{`$${start} \\times 3 + 2 = 8$ ، ثم $8 \\times 3 = 24$ ، ثم $24 - 5 = ${end}$.`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'البرنامج بالحرف x', subtitle: 'السؤال 2', done: q2,
          content: (
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
          ),
        },
        {
          num: 3, title: 'عدد فاطمة', subtitle: 'السؤال 3 — حُلّ على الميزان المتقدّم، ثم أجب', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <p className="text-sm text-slate-600"><MathText>{`النتيجة $9x + 1$ تساوي $${fatima}$ : هي المعادلة $9x + 1 = ${fatima}$ ، وهي الميزان الذي في المستوى المتقدّم.`}</MathText></p>
              {/* LES ÉTAPES DE L'ÉLÈVE sur la balance, et rien d'autre. */}
              <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={fat ? 'true' : 'false'}>
                {!fat || fat.steps.length === 0 ? (
                  <p className="text-slate-500">لم تكتب أي خطوة على ميزان فاطمة بعد (المستوى المتقدّم).</p>
                ) : (
                  <ol className="space-y-1" data-evidence="steps">
                    <li className="font-bold"><MathText>{`$${fat.equation}$`}</MathText></li>
                    {fat.steps.map((st, i) => (
                      <li key={i} data-evidence-step={i}><MathText>{`أي $${st.result}$`}</MathText></li>
                    ))}
                    {fat.solved && <li className="font-bold text-emerald-800"><MathText>{fat.verified ? 'تحقّقت بفتح الأكياس.' : 'بقي كيس واحد وحده في كفّة.'}</MathText></li>}
                  </ol>
                )}
              </div>
              <NumericQuestion
                prompt="• ما هو العدد الذي اختارته فاطمة في البداية؟"
                expected={-3}
                parse={parseDec}
                requires={['amaliyat-tarafayn']}
                explain={<MathText>{`${BALANCE_LINES.fatima} ${BALANCE_LINES.verify}`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <>
                  <KnowledgeBrick id="muadala-tarafayn" lead="ما فعلته بالميزان، مكتوبًا:" />
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
