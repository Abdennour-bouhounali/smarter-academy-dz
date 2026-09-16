import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../common/kit';
import { Feedback } from '../../../../../common/components/LessonUI';
import { KnowledgeSnapshot } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import DivisorBoard from '../components/DivisorBoard';
import { commonDivisors, gcdByDefinition } from '../components/pgcdUtils';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 2 — من القاسم إلى القاسم المشترك الأكبر (stage: discovery).
 *
 * LA DISTINCTION QUE LE SUJET EXIGE. Trois mots que les élèves confondent
 * systématiquement — قاسم, قاسم مشترك, القاسم المشترك الأكبر — sont
 * construits l'un après l'autre, chacun ajoutant UNE contrainte à celui qui
 * précède :
 *
 *   قاسم                  → divise UN nombre
 *   قاسم مشترك            → divise LES DEUX
 *   القاسم المشترك الأكبر → divise les deux, ET c'est le plus grand
 *
 * Ici, aucun algorithme : on LIT les deux listes. C'est la définition, et
 * c'est elle qui rendra les deux méthodes du programme intelligibles ensuite
 * (elles ne servent qu'à éviter d'écrire ces listes).
 *
 * LP enseignés : 4am_pgcd_P1, 4am_pgcd_P2, 4am_pgcd_P3.
 */
const A = 24;
const B = 36;
const COMMON = commonDivisors(A, B);
const GCD = gcdByDefinition(A, B);

export default function Module02QawasimMushtaraka() {
  const [picked, setPicked] = useState([]);
  const [revealCommon, setRevealCommon] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  const toggle = (d) => {
    setPicked((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const allFound =
    picked.length === COMMON.length && COMMON.every((d) => picked.includes(d));

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="من القاسم إلى القاسم المشترك الأكبر"
      moduleSubtitle="ثلاث كلمات، وثلاث درجات من الدقّة"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'اكتشاف',
        title: 'ثلاث كلمات لا يجوز خلطها',
        tone: 'violet',
        body: (
          <p>
            في الوحدة السابقة بحثت عن حجم طرد يناسب{' '}
            <MathText>{`$${A}$`}</MathText> و<MathText>{`$${B}$`}</MathText>{' '}
            معًا. الآن سنكتب <strong>كل</strong> القواسم، ونرى بالضبط ما الذي
            يميّز أحدها عن الباقي.
          </p>
        ),
      }}
      steps={[
        {
          num: 1,
          title: 'عيّن القواسم المشتركة',
          subtitle: 'انقر على الأعداد التي تقسم العددين معًا',
          done: revealCommon,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="qawasim-mushtaraka" />
              <DivisorBoard
                a={A}
                b={B}
                selected={picked}
                onToggle={toggle}
                revealCommon={revealCommon}
                revealGcd={false}
              />
              {!revealCommon && (
                <>
                  <p className="text-xs text-slate-500">
                    اخترت {picked.length} من الأعداد. عدد يظهر في القائمتين
                    معًا هو قاسم مشترك.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevealCommon(true)}
                    className="w-full sm:w-auto px-5 py-3 min-h-[48px] rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    أتحقّق من اختياري
                  </button>
                </>
              )}
              {revealCommon && (
                <Feedback tone={allFound ? 'ok' : 'ko'}>
                  {allFound ? (
                    <>
                      أصبت تمامًا: القواسم المشتركة لـ{' '}
                      <MathText>{`$${A}$`}</MathText> و
                      <MathText>{`$${B}$`}</MathText> هي{' '}
                      <strong className="font-mono">{COMMON.join('، ')}</strong>.
                    </>
                  ) : (
                    <>
                      القواسم المشتركة هي{' '}
                      <strong className="font-mono">{COMMON.join('، ')}</strong>{' '}
                      — أي الأعداد الموجودة في <strong>القائمتين معًا</strong>.
                      عدد يقسم واحدًا فقط من العددين ليس قاسمًا مشتركًا.
                    </>
                  )}
                </Feedback>
              )}
            </div>
          ),
        },
        {
          num: 2,
          title: 'أيّها هو الأكبر؟',
          done: q2,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="pgcd" />
              <TapQuestion
                prompt={
                  <span>
                    من بين القواسم المشتركة{' '}
                    <strong className="font-mono">{COMMON.join('، ')}</strong>،
                    ما هو <strong>القاسم المشترك الأكبر</strong> للعددين{' '}
                    <MathText>{`$${A}$`}</MathText> و
                    <MathText>{`$${B}$`}</MathText>؟
                  </span>
                }
                options={COMMON.map(String)}
                correct={COMMON.indexOf(GCD)}
                cols={COMMON.length > 4 ? 3 : COMMON.length}
                requires={['qawasim-mushtaraka']}
                explain={
                  <span>
                    <MathText>{`$\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${GCD}$`}</MathText>
                    . إنه أكبر عدد يقسم العددين معًا — وهو أكبر حجم طرد ممكن في
                    وضعية الوحدة السابقة.
                  </span>
                }
                onAnswered={() => setQ2(true)}
              />
              {q2 && (
                <DivisorBoard
                  a={A}
                  b={B}
                  selected={picked}
                  revealCommon
                  revealGcd
                  disabled
                />
              )}
            </div>
          ),
        },
        {
          num: 3,
          title: 'هل فهمت الفرق بين الكلمات الثلاث؟',
          done: q3,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={
                  <span>
                    العدد <MathText>{'$4$'}</MathText> بالنسبة للعددين{' '}
                    <MathText>{`$${A}$`}</MathText> و
                    <MathText>{`$${B}$`}</MathText>، هو:
                  </span>
                }
                options={[
                  'قاسم للعدد 24 فقط',
                  'قاسم مشترك، لكنه ليس الأكبر',
                  'القاسم المشترك الأكبر',
                  'ليس قاسمًا لأيّ منهما',
                ]}
                correct={1}
                cols={1}
                requires={['pgcd']}
                explain={
                  <span>
                    <MathText>{'$4$'}</MathText> يقسم{' '}
                    <MathText>{`$${A}$`}</MathText> ويقسم{' '}
                    <MathText>{`$${B}$`}</MathText>، إذن فهو قاسم مشترك. لكنّ{' '}
                    <MathText>{`$${GCD}$`}</MathText> أكبر منه ويقسمهما أيضًا،
                    فلا يكون <MathText>{'$4$'}</MathText> هو الأكبر.
                  </span>
                }
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <Feedback tone="info">
                  كتابة كل القواسم ممكنة هنا لأنّ العددين صغيران. ولكن ماذا لو
                  كان العددان <MathText>{'$1\\,428$'}</MathText> و{' '}
                  <MathText>{'$1\\,015$'}</MathText>؟ الوحدتان التاليتان تقدّمان
                  طريقتين تُغنيان عن كتابة القوائم.
                </Feedback>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
