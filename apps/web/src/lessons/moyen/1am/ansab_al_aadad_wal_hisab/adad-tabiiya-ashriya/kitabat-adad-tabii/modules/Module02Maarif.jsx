import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, RANKS, DECOMPOSITION } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 11) et 4 (a) (p. 13) : lire un grand nombre par classes de trois (brique gardée par « أتوقّع
 * القاعدة »), le tableau des rangs de 6 392,459 (les rangs décimaux comme NOMS de rangs), puis le مفكوك d'un ENTIER
 * (formalisation déclarée ; le مفكوك décimal est la leçon suivante). LP : P1, P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

/**
 * Le tableau des rangs du manuel (p. 13) — une île LTR : un nombre s'écrit de gauche à droite. Deux blocs (partie entière,
 * partie décimale) côte à côte dès `sm`, l'un sous l'autre sur un téléphone, pour que chaque en-tête tienne en mots entiers.
 */
function RankBlock({ title, headers, digits, tone }) {
  const cell = 'border border-violet-200 px-1 py-1 text-center leading-tight';
  return (
    <table dir="ltr" className="w-full table-fixed border-collapse text-xs sm:text-sm">
      <thead>
        <tr><th colSpan={headers.length} className={`${cell} ${tone.head} font-bold`} dir="rtl">{title}</th></tr>
        <tr>{headers.map((h) => <th key={h} className={`${cell} ${tone.sub} font-semibold`} dir="rtl">{h}</th>)}</tr>
      </thead>
      <tbody>
        <tr className={`text-lg font-extrabold ${tone.digit}`}>{digits.map((d, i) => <td key={i} className={cell}>{d}</td>)}</tr>
      </tbody>
    </table>
  );
}

function RanksTable() {
  return (
    <div dir="ltr" className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-0" data-ranks-table>
      <div className="sm:flex-[4]"><RankBlock title="الجزء الصحيح" headers={RANKS.integerHeaders} digits={RANKS.integerDigits} tone={{ head: 'bg-violet-100', sub: 'bg-violet-50', digit: 'text-slate-900' }} /></div>
      <div className="hidden self-end px-0.5 pb-1 text-2xl font-black text-sky-700 sm:block" aria-hidden="true">,</div>
      <div className="sm:flex-[3]"><RankBlock title="الجزء العشري" headers={RANKS.decimalHeaders} digits={RANKS.decimalDigits} tone={{ head: 'bg-sky-100', sub: 'bg-sky-50', digit: 'text-sky-700' }} /></div>
    </div>
  );
}

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  return (
    <ContentModule
      objectives={['كيف نقرأ عددًا كبيرًا دون أن نخطئ؟', 'ما رقم كل مرتبة في جدول المراتب؟', 'كيف نكتب عددًا مجموعًا يُظهر قيمة كل رقم؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — كتابة الأعداد الطبيعية"
      moduleSubtitle="فئات · مراتب · مفكوك"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'أحوصل تعلّماتي — الكتاب ص 11 و 13', title: 'من الورشة إلى الكتاب', tone: 'violet',
        body: <p>{KNOWLEDGE.digits}</p>,
      }}
      steps={[
        {
          num: 1, title: 'القراءة فئةً فئةً', subtitle: 'معارف 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" lines={[KNOWLEDGE.example2017, KNOWLEDGE.example5]} source={KNOWLEDGE.source} compact />
              <TapQuestion
                prompt={<span>كيف نجزّئ <bdi dir="ltr">45671</bdi> لنقرأه بسهولة؟</span>}
                options={[M('$45\\,671$ : من اليمين، ثلاثة أرقام ثلاثة أرقام'), M('$456\\,71$ : من اليسار، ثلاثة أرقام أوّلًا'), M('$4\\,5\\,6\\,7\\,1$ : رقمًا رقمًا')]}
                correct={0} cols={1} requires={['kitabat-adad-ibtidai']}
                explain={<MathText>{`$45\\,671$ : ${KNOWLEDGE.readingExamples[0].words}.`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              <KnowledgeBrick id="fiaat" lead="من أيّ جهة بدأتَ؟ وكم رقمًا في كل فئة؟" />
            </div>
          ),
        },
        {
          num: 2, title: 'جدول المراتب', subtitle: 'معارف 4', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="property" text={RANKS.box} source={RANKS.source} compact>
                <RanksTable />
              </TextbookBox>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{`في العدد $${RANKS.number}$ :`}</MathText></p>}
                rows={[
                  { id: 'h', label: 'رقم المئات', options: ['3', '6', '4'], correct: 0, correction: 'المرتبة الثالثة من يمين الجزء الصحيح.' },
                  { id: 't', label: 'الرقم 4 هو رقم', options: ['العشرات', 'الأعشار', 'الآلاف'], correct: 1, correction: 'أوّل رقم بعد الفاصلة: الأعشار (الأجزاء من عشرة). العشرات رقمها 9.' },
                  { id: 'c', label: 'رقم الأجزاء من مائة', options: ['5', '9', '2'], correct: 0, correction: 'الرقم الثاني بعد الفاصلة.' },
                ]}
                requires={['maratib-ibtidai']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا.' : 'العشرات قبل الفاصلة، والأعشار بعدها.'}</Feedback>}
                onAnswered={() => setQ2(true)}
              />
              <KnowledgeBrick id="jadwal-maratib" />
            </div>
          ),
        },
        {
          num: 3, title: 'المفكوك النموذجي', subtitle: 'قيمة كل رقم', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>أيّ مجموع يساوي <bdi dir="ltr">2017</bdi> ويُظهر قيمة كل رقم؟</span>}
                options={[M('$2 \\times 1000 + 1 \\times 10 + 7$'), M('$2 + 0 + 1 + 7$'), M('$2 \\times 100 + 1 \\times 10 + 7$')]}
                correct={0} cols={1} requires={['jadwal-maratib']}
                explain={<MathText>{DECOMPOSITION.zero}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              <KnowledgeBrick id="mafkuk" lead="اكتب 6392 بنفس الطريقة." />
              <SourceTag source={DECOMPOSITION.source} />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
