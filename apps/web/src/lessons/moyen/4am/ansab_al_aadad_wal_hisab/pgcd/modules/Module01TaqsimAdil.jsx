import React, { useMemo, useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictionChips } from '../../../../../common/kit';
import { Feedback } from '../../../../../common/components/LessonUI';
import { KnowledgeSnapshot } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import FairShareLab from '../components/FairShareLab';
import { commonDivisors, gcdByDefinition } from '../components/pgcdUtils';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 1 — تقسيم عادل (stage: trigger).
 *
 * LE LABORATOIRE D'OUVERTURE (INTERACTION_PEDAGOGY.md §6bis).
 *
 * ── LA MANIPULATION EST À L'ÉCRAN DÈS L'ENTRÉE ─────────────────────────
 * `FairShareLab` est rendu dans le slot `intro` de `ContentModule`, PAS
 * dans une étape. `intro` est peint entre le brief et les étapes, sans
 * verrou et sans condition : l'élève qui arrive sur le module a déjà
 * l'instrument sous la main. Il n'a aucune question à répondre, aucun
 * bouton « découvrir » à presser — la règle est dure (§6bis.3 « le premier
 * tap est évident »), et la mettre dans une `step` la violerait, puisque
 * `StepCard` numérote, encadre et peut verrouiller.
 *
 * Les étapes ne portent donc plus la manipulation : elles portent
 * l'OBSERVATION GUIDÉE de ce que l'élève vient de faire avec elle. C'est
 * l'ordre que §6bis.1 demande — manipuler, puis observer, puis nommer.
 *
 * ── CE QUE L'ÉLÈVE DÉCOUVRE, ET QUE LE MODULE N'ÉCRIT PAS D'ABORD ──────
 * Qu'il existe PLUSIEURS tailles qui tombent juste des deux côtés, et
 * qu'il y en a une PLUS GRANDE. Le rail des tailles garde la trace de
 * chaque essai : au bout de quelques tentatives, le semis de ✓ verts est
 * sous ses yeux et la question « laquelle est la plus grande ? » se pose
 * toute seule. L'étape 2 ne fait que lui demander de la désigner.
 *
 * ── CE QUI RESTE AUX MODULES SUIVANTS ──────────────────────────────────
 * Le MOT « قاسم مشترك » et le mot « القاسم المشترك الأكبر » (module 2),
 * l'écriture de la liste complète des diviseurs (module 2), et les deux
 * méthodes du programme (modules 3 et 4). Ici on ne nomme que « قاسم »,
 * parce que l'élève en a besoin pour lire son propre rail — pas avant.
 *
 * LP enseigné : 4am_pgcd_P1 (تعيين قواسم عدد طبيعي) — tester des tailles et
 * lire les restes EST la recherche des diviseurs.
 *
 * Typographie arabe : Cairo est la police globale de la plateforme
 * (index.css, master spec §14) — ce module n'a plus besoin de classe
 * dédiée, il hérite de la règle globale comme le reste de l'application.
 */
const A = 24; // عدد الدفاتر
const B = 36; // عدد الأقلام

// Le rail s'arrête à min(A, B) : au-delà, aucune taille ne peut diviser le
// plus petit des deux nombres. La borne est mathématique, pas esthétique.
const MAX_SIZE = Math.min(A, B);
const COMMON = commonDivisors(A, B);
const GCD = gcdByDefinition(A, B);

// La taille d'ouverture est 5 : elle ne tombe juste NI d'un côté NI de
// l'autre. L'élève voit donc un reste des deux côtés dès la première
// seconde — il y a quelque chose à réparer, ce qui est le déclencheur.
const START_SIZE = 5;

export default function Module01TaqsimAdil() {
  const [size, setSize] = useState(START_SIZE);
  const [tried, setTried] = useState(() => new Set([START_SIZE]));
  const [prediction, setPrediction] = useState(null);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  const pickSize = (n) => {
    setSize(n);
    setTried((prev) => new Set(prev).add(n));
  };

  // Ce que l'élève a RÉELLEMENT trouvé, dérivé de ses essais (§28 : une
  // seule source de vérité, rien de mémorisé en double).
  const foundCommons = useMemo(
    () => [...tried].filter((n) => A % n === 0 && B % n === 0).sort((x, y) => x - y),
    [tried]
  );
  // L'étape 1 est franchie quand l'élève a trouvé DEUX tailles qui marchent :
  // une seule ne montre rien, deux ouvrent la question du plus grand.
  const exploredEnough = foundCommons.length >= 2;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="تقسيم عادل"
      moduleSubtitle="كميّتان، طرود متماثلة، ولا يبقى شيء"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'وضعية انطلاق',
        title: 'لا نريد أن يبقى شيء',
        tone: 'indigo',
        body: (
          <p>
            جمعت مدرسة <strong className="font-mono">{A}</strong> دفترًا و
            <strong className="font-mono">{B}</strong> قلمًا، وتريد توزيعها في{' '}
            <strong>طرود متماثلة تمامًا</strong>، و<strong>لا يبقى أيّ شيء</strong>{' '}
            خارج الطرود. جرّب بنفسك:
          </p>
        ),
      }}
      /* ── LE LABORATOIRE, AVANT TOUTE ÉTAPE ─────────────────────────────
         Rendu inconditionnellement par ContentModule entre le brief et les
         étapes. Aucun verrou, aucune question préalable, aucun bouton de
         révélation : c'est la première chose que l'élève voit et touche. */
      intro={
        <div className="space-y-4">
          <FairShareLab
            a={A}
            b={B}
            size={size}
            onSizeChange={pickSize}
            tried={tried}
            maxSize={MAX_SIZE}
            labelA="الدفاتر"
            labelB="الأقلام"
            emojiA="📓"
            emojiB="✏️"
            highlightBest={q2}
          />
          {/* La prédiction est posée À CÔTÉ de la manipulation, jamais
              devant elle (§6ter.3, PredictionChips.jsx) : elle invite sans
              barrer le passage, et rien n'attend qu'elle soit remplie. */}
          <PredictionChips
            prompt="قبل أن تكثر من التجريب — هل تظنّ أنّ هناك حجمًا واحدًا فقط يعمل في الجهتين، أم أكثر؟"
            options={[
              { id: 'un', label: 'حجم واحد فقط' },
              { id: 'plusieurs', label: 'عدّة أحجام' },
              { id: 'sais-pas', label: 'لا أدري بعد' },
            ]}
            value={prediction}
            onChange={setPrediction}
          />
        </div>
      }
      steps={[
        {
          num: 1,
          title: 'ابحث عن الأحجام التي لا تترك شيئًا',
          subtitle: 'في الجهتين معًا — استعمل المختبر أعلاه',
          done: exploredEnough,
          content: (
            <div className="space-y-4">
              {/* Le mot « قاسم » est posé ICI, à l'instant où l'élève en a
                  besoin pour LIRE son propre rail — et pas avant qu'il ait
                  manipulé (§6quinquies : la connaissance avant la demande,
                  mais après le geste qui lui donne son sens). */}
              <KnowledgeBrick id="qasim" />

              {foundCommons.length === 0 && (
                <Feedback tone="hint">
                  ابحث عن حجم لا يبقى معه شيء <strong>في الجهتين معًا</strong>.
                  حجم يناسب الدفاتر وحدها لا يكفي — سيظهر بالبرتقالي.
                </Feedback>
              )}
              {foundCommons.length === 1 && (
                <Feedback tone="ok">
                  وجدت الحجم{' '}
                  <strong className="font-mono">{foundCommons[0]}</strong>: لا
                  يبقى معه شيء في الجهتين. هل هو الوحيد؟ واصل البحث.
                </Feedback>
              )}
              {exploredEnough && (
                <Feedback tone="ok">
                  وجدت حتى الآن{' '}
                  <strong className="font-mono">{foundCommons.join('، ')}</strong>
                  . إذن ليس هناك حجم واحد فقط: عدّة أحجام تعمل في الجهتين.
                  والمدرسة تريد <strong>أكبر طرد ممكن</strong> — فأيّها هو؟
                </Feedback>
              )}
            </div>
          ),
        },
        {
          num: 2,
          title: 'ما أكبر حجم يعمل في الجهتين؟',
          subtitle: 'عيّنه بنفسك، بعد أن جرّبت',
          done: q2,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={
                  <span>
                    بالعودة إلى المختبر أعلاه: ما{' '}
                    <strong>أكبر</strong> حجم طرد لا يترك شيئًا في الجهتين؟
                  </span>
                }
                // Les options sont les diviseurs communs RÉELS : chaque
                // mauvaise réponse est un vrai diviseur commun, mais pas le
                // plus grand — l'erreur visée est exactement celle-là.
                options={COMMON.map(String)}
                correct={COMMON.indexOf(GCD)}
                cols={COMMON.length > 4 ? 3 : COMMON.length}
                requires={['qasim']}
                explain={
                  <span>
                    <strong className="font-mono">{GCD}</strong>. الأحجام{' '}
                    <span className="font-mono">{COMMON.join('، ')}</span> كلّها
                    تعمل في الجهتين، لكنّ{' '}
                    <MathText>{`$${GCD}$`}</MathText> أكبرها: بـ{' '}
                    <MathText>{`$${GCD}$`}</MathText> نحصل على{' '}
                    <MathText>{`$${A} \\div ${GCD} = ${A / GCD}$`}</MathText>{' '}
                    دفاتر و{' '}
                    <MathText>{`$${B} \\div ${GCD} = ${B / GCD}$`}</MathText>{' '}
                    أقلام في كل طرد.
                  </span>
                }
                onAnswered={() => setQ2(true)}
              />
              {q2 && (
                <Feedback tone="info">
                  ارجع إلى المختبر أعلاه: الحجم{' '}
                  <strong className="font-mono">{GCD}</strong> صار مميّزًا في
                  الشريط. لاحظ أنّ كل حجم أخضر آخر يقسمه أيضًا — سنعود إلى هذا.
                </Feedback>
              )}
            </div>
          ),
        },
        {
          num: 3,
          title: 'ما الذي يجعل حجمًا صالحًا؟',
          done: q3,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={<span>لكي يصلح حجم طرد في هذه الوضعية، يجب أن يكون:</span>}
                options={[
                  'قاسمًا للعدد 24 فقط',
                  'قاسمًا للعدد 36 فقط',
                  'قاسمًا للعددين 24 و36 معًا',
                  'أكبر من 24 و36',
                ]}
                correct={2}
                cols={1}
                requires={['qasim']}
                explain={
                  <span>
                    الحجم يجب أن يقسم <MathText>{`$${A}$`}</MathText>{' '}
                    <strong>و</strong> <MathText>{`$${B}$`}</MathText> في الوقت
                    نفسه: عندئذ فقط يكون الباقيان معدومين معًا. هذا بالضبط ما
                    يميّز الأخضر عن البرتقالي في الشريط.
                  </span>
                }
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <Feedback tone="info">
                  العدد الذي يقسم العددين معًا سنسمّيه في الوحدة الموالية{' '}
                  <strong>قاسمًا مشتركًا</strong>، وأكبرها سيأخذ اسمًا خاصًا.
                </Feedback>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
