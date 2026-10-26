import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le râteau du jardin. UNE SEULE PISTE (§4quater) : le labo `seed-rake` en haut, sans carte
 * au-dessus — il porte son contexte et SA question ; la main ÉTIRE le râteau, l'espacement 1/N m est la variable. Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES essais : pourquoi
 * l'espacement qu'il a essayé a été refusé (combien de plants entrent dans la zone), combien de plants et quelle longueur pour l'espacement qui a convenu, ce qui se passe pour un
 * second espacement qui convient (la MÊME longueur), puis l'espacement le plus large. Les noms (briques) viennent APRÈS la réponse. Le نشاط 4 du manuel (des disques déjà découpés) est posé en application (أتمرّن).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children)}</bdi>;
const ZONES = [{ p: [1, 4], name: 'الطماطم' }, { p: [1, 6], name: 'الفلفل' }];
const WIDEST = 12;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const answered = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  const record = (e) => setTrials((list) => [...list, e]);
  const mine = trials.filter((e) => !e.free && e.mission === 'g1');
  const bad = mine.findLast((e) => e.kind === 'refused');
  const oks = mine.filter((e) => e.kind === 'plant' && e.ok);
  const first = oks[0];
  const second = first ? oks.find((e) => e.N !== first.N) : undefined;
  const widest = oks.find((e) => e.N === WIDEST);

  // la zone refusée : ses cases (a/b × N), ses deux entiers voisins
  const zone = bad ? ZONES[bad.zone] ?? ZONES[0] : ZONES[0];
  const [za, zb] = zone.p;
  const lo = bad ? Math.floor((bad.N * za) / zb) : 0;

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا لا نجمع كسرين كما هما؟', 'متى تمتلئ الأجزاء بشتلات كاملة؟', 'هل يتغيّر الطول إن تغيّرت المسافة؟', 'أيّ مسافة أفضل؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — مشط الشتلات"
      moduleSubtitle="املأ كلّ جزء بشتلات كاملة"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="seed-rake" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="seed-rake" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا رُفضت المسافة؟', subtitle: 'شتلة على الحدّ', done: !!q.a && !!q.a2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="g1-refused" ok={!!bad}
                done={<span>في المهمة 1 رفض الحوض المسافة <Ltr>{`1/${bad?.N}`}</Ltr> م.</span>}
                todo="جرّب في المهمة 1 مسافة لا تنجح (لتريَ الحوض شتلة على الحدّ)، ثم عُد إلى هذا السؤال." />
              {bad && (
              <>
              <TapQuestion
                prompt={<MathText>{`بالمسافة $\\frac{1}{${bad?.N ?? ''}}$ م : جزء ${zone.name} طوله $\\frac{${za}}{${zb}}$ م . كم شتلة يتّسع له؟`}</MathText>}
                options={[M(`بين $${lo}$ و $${lo + 1}$ شتلات`), M(`$${lo}$ شتلات بالضبط`), M(`$${lo + 1}$ شتلات بالضبط`)]}
                correct={0} cols={1} requires={['mudaaf-1am']}
                explain={<MathText>{`جزء ${zone.name} يتّسع لـ $${bad?.N}\\times\\frac{${za}}{${zb}}$ شتلة، وهذا ليس عددًا صحيحًا: آخر شتلة تقع على الحدّ بين جزأين.`}</MathText>}
                onAnswered={answered('a')}
              />
              {q.a && (
                <TapQuestion
                  prompt={<MathText>{`لماذا رُفضت المسافة $\\frac{1}{${bad?.N ?? ''}}$ ؟`}</MathText>}
                  options={[M(`لأنّ $${bad?.N}$ ليس مضاعفًا للعدد $${zb}$`), M('لأنّ المسافة صغيرة جدًّا'), M('لأنّ جزء الفلفل أقصر من جزء الطماطم')]}
                  correct={0} cols={1} requires={['mudaaf-1am']}
                  explain={<MathText>{`جزء ${zone.name} هو $\\frac{${za}}{${zb}}$ م : يمتلئ بشتلات كاملة إذا كان عدد الخانات في المتر $N$ مضاعفًا للعدد $${zb}$ ، و $${bad?.N}$ ليس كذلك.`}</MathText>}
                  onAnswered={answered('a2')}
                />
              )}
              </>
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'وإذا نجحت المسافة؟', subtitle: 'شتلات وطول', done: !!q.b && !!q.b2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="g1-plant" ok={!!first}
                done={<span>نجحت المسافة <Ltr>{`1/${first?.N}`}</Ltr> م في المهمة 1 وزرعتَ <Ltr>{first?.signed}</Ltr> شتلة في المجموع.</span>}
                todo="أنجز في المهمة 1 مسافة تنجح (يمتلئ فيها الجزءان بشتلات كاملة)، ثم عُد إلى هذا السؤال." />
              {first && (
              <>
              <NumericQuestion
                prompt={<MathText>{`بالمسافة $\\frac{1}{${first?.N ?? ''}}$ م : كم شتلة زرعتَ في الجزأين معًا؟`}</MathText>}
                expected={first?.signed ?? 0} display={String(first?.signed ?? '')} parse={parseDec} requires={['mudaaf-1am']}
                explain={<MathText>{`${first?.counts?.[0]} شتلات في الطماطم و ${first?.counts?.[1]} في الفلفل : ${first?.signed}.`}</MathText>}
                onAnswered={answered('b')}
              />
              {q.b && (
                <TapQuestion
                  prompt={<MathText>{'وما طول الجزء المزروع؟ (كلّ شتلة تأخذ مسافة واحدة)'}</MathText>}
                  options={[M(`$\\frac{${first?.total?.split('/')[0]}}{${first?.total?.split('/')[1]}}$ م`), M('$\\frac{2}{10}$ م'), M(`$\\frac{${first?.signed}}{${(first?.N ?? 0) + 6}}$ م`)]}
                  correct={0} cols={3} requires={['mudaaf-1am']}
                  explain={<MathText>{`${first?.signed} شتلة، وكلّ شتلة $\\frac{1}{${first?.N}}$ م : الطول $\\frac{${first?.signed}}{${first?.N}}=\\frac{${first?.total?.split('/')[0]}}{${first?.total?.split('/')[1]}}$ م . ($\\frac{2}{10}$ أقصر من جزء الطماطم وحده.)`}</MathText>}
                  onAnswered={answered('b2')}
                />
              )}
              {q.b2 && <KnowledgeBrick id="tawhid-qabl-jam" lead="لماذا كتبنا الكسرين بالمقام نفسه قبل أن نجمع؟" />}
              </>
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'مسافة أخرى تنجح', subtitle: 'الطول نفسه', done: !!q.c,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="g1-second" ok={!!second}
                done={<span>نجحت أيضًا المسافة <Ltr>{`1/${second?.N}`}</Ltr> م وزرعتَ <Ltr>{second?.signed}</Ltr> شتلة.</span>}
                todo="جرّب في المهمة 1 مسافة ثانية تنجح (تختلف عن الأولى)، ثم عُد إلى هذا السؤال." />
              {second && (
              <>
              <TapQuestion
                prompt={<MathText>{`بالمسافة $\\frac{1}{${second?.N ?? ''}}$ م زرعتَ $${second?.signed ?? ''}$ شتلة : هل تغيّر طول الجزء المزروع؟`}</MathText>}
                options={[M(`لا: الطول نفسه $\\frac{${second?.total?.split('/')[0]}}{${second?.total?.split('/')[1]}}$ م`), M('نعم، صار أطول لأنّ الشتلات أكثر'), M('نعم، صار أقصر لأنّ المسافة أضيق')]}
                correct={0} cols={1} requires={['mudaaf-1am']}
                explain={<MathText>{`$\\frac{${second?.signed}}{${second?.N}}$ و $\\frac{${first?.signed}}{${first?.N}}$ هما الكسر نفسه: كلّ مضاعف مشترك للمقامين يعطي الطول نفسه.`}</MathText>}
                onAnswered={answered('c')}
              />
              {q.c && <KnowledgeBrick id="mudaaf-mushtarak" lead="أيّ عدد يصلح مقامًا مشتركًا للكسرين؟" />}
              </>
              )}
            </div>
          ),
        },
        {
          num: 4, title: 'أوسع مسافة', subtitle: 'مكان للشتلات', done: !!q.d,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="g1-widest" ok={!!widest}
                done={<span>وجدتَ المسافة <Ltr>{`1/${WIDEST}`}</Ltr> م.</span>}
                todo="جرّب في المهمة 1 أوسع مسافة تنجح (تظهر النجمة بعد نجاحين)، ثم عُد إلى هذا السؤال." />
              {widest && (
              <>
              <TapQuestion
                prompt={<MathText>{'الشتلات تحتاج مكانًا. أيّ مسافة يفضّلها البستاني لتبقى الشتلات متباعدة ما أمكن؟'}</MathText>}
                options={[M(`$\\frac{1}{${WIDEST}}$ م`), M('$\\frac{1}{24}$ م'), M('$\\frac{1}{36}$ م')]}
                correct={0} cols={3} requires={['mudaaf-1am']}
                explain={<MathText>{`كلّها تنجح، لكنّ $\\frac{1}{${WIDEST}}$ هي الأوسع: $${WIDEST}$ هو أصغر مضاعف مشترك للعددين $4$ و $6$ .`}</MathText>}
                onAnswered={answered('d')}
              />
              {q.d && <KnowledgeBrick id="asghar-mudaaf" lead="ما أوسع مسافة تنجح، وكيف نصل إليها بسرعة؟" />}
              </>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
