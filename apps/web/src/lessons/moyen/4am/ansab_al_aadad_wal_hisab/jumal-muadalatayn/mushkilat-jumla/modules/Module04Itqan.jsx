import React from 'react';
import { BossFinal } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { addition } from '../../_unit/unitMeta';
import { QCM7 } from '../content/textbook';

/**
 * Module 4 — إختبار أولي (stage: evaluation) : LA SEULE SOURCE DE PREUVE de la leçon.
 * E1 est l'item 7 de « أؤكّد تعلّماتي » (p. 62 — destinations → qcm items [7]) ; E2–E5 sont des
 * épreuves de la PLATEFORME, chacune sur le modèle de نشاط 3 avec d'autres nombres et des contextes
 * de jeunes Algériens (forfaits Internet, karting, sortie scolaire, eSports). Chaque épreuve évalue
 * UN point d'apprentissage : P1 (traduire : E1, E2), P2 (résoudre, vérifier dans le texte, répondre :
 * E3–E5). Chaque distracteur est faux (recalculé en commentaire).
 */
const Q = ({ children, source }) => <span>{children} <SourceTag source={source} /></span>;
const M = (s) => <MathText key={s}>{s}</MathText>;
const SRC = addition('interaction_generation');

export default function Module04Itqan() {
  return (
    <BossFinal
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="إختبار أولي"
      moduleSubtitle="خمسة أسئلة تُقيّم ما تعلّمته"
      estimatedTime="6 دقائق"
      lessonConfig={LESSON_CONFIG}
      timerSeconds={6 * 60}
      timerLabel="6 دقائق"
      brief={{ tag: 'التقويم', title: 'أظهر ما تعرفه', tone: 'slate', body: <p>أجب عن الأسئلة الخمسة ثم أرسِلها دفعة واحدة. لا يُصحَّح شيء قبل الإرسال.</p> }}
      skills={{
        tarjama: { label: 'ترجمة مشكلة بجملة معادلتين', module: 1 },
        marahil: { label: 'الحل والتحقق في النص والإجابة', module: 2 },
      }}
      epreuves={[
        {
          // متكاملتان : x + y = 180 ; (B) 90 = متتامتان ; (C) « y + x = 15 » contredit x + y = 180
          id: 'E1', skill: 'tarjama', requires: ['jumla-tarjama'],
          prompt: <Q source={QCM7.source}><MathText>{QCM7.text}</MathText></Q>,
          options: [
            M('$\\begin{cases} x + y = 180 \\\\ x = y + 15 \\end{cases}$'),
            M('$\\begin{cases} y + x = 90 \\\\ y + 15 = x \\end{cases}$'),
            M('$\\begin{cases} y = 180 - x \\\\ y + x = 15 \\end{cases}$'),
          ],
          correct: 0, cols: 1,
          explain: <MathText>{'زاويتان متكاملتان مجموع قيسيهما $180°$ : $x + y = 180$ ، و«يزيد $x$ عن $y$ بـ $15°$» تعني $x = y + 15$ (ومنه $x = 97{,}5°$ و $y = 82{,}5°$). أما 90 فمجموع زاويتين متتامتين.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mushkilat-jumla_P1'] },
        },
        {
          // 3x + 2y = 1100 ; x + 4y = 1200 → (200 ; 250). (B) 4x + y : les quantités de Yacine retournées ; (C) les deux totaux échangés
          id: 'E2', skill: 'tarjama', requires: ['jumla-tarjama'],
          prompt: <Q source={SRC}>في محل للهواتف، دفع سامي 1100 DA ثمن 3 باقات إنترنت و 2 بطاقتي تعبئة، ودفع ياسين 1200 DA ثمن باقة إنترنت واحدة و 4 بطاقات تعبئة. نسمّي <MathText>{'$x$'}</MathText> ثمن الباقة و <MathText>{'$y$'}</MathText> ثمن البطاقة. الجملة التي تترجم المشكلة هي:</Q>,
          options: [
            M('$\\begin{cases} 3x + 2y = 1100 \\\\ 4x + y = 1200 \\end{cases}$'),
            M('$\\begin{cases} 3x + 2y = 1100 \\\\ x + 4y = 1200 \\end{cases}$'),
            M('$\\begin{cases} 3x + 2y = 1200 \\\\ x + 4y = 1100 \\end{cases}$'),
          ],
          correct: 1, cols: 1,
          explain: <MathText>{'سامي: $3x + 2y = 1100$ ، وياسين: باقة واحدة و 4 بطاقات، $x + 4y = 1200$ . (الحل: الباقة 200 DA والبطاقة 250 DA.)'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mushkilat-jumla_P1'] },
        },
        {
          // x + y = 15 ; 350x + 200y = 3900 → 150x = 900 → (6 ; 9). 9 → 3150 + 1200 = 4350 ; 4 → 1400 + 2200 = 3600 ; 7 → 2450 + 1600 = 4050
          id: 'E3', skill: 'marahil', requires: ['khutuwat-hall', 'hall-jumla'],
          prompt: <Q source={SRC}>في حلبة كارتينغ، الدورة بـ 350 DA للكبار و 200 DA للصغار. ركبت مجموعة 15 دورة ودفعت 3900 DA. كم دورة ركب الكبار؟</Q>,
          options: [M('$9$'), M('$4$'), M('$6$'), M('$7$')],
          correct: 2, cols: 2,
          explain: <MathText>{'$x + y = 15$ و $350x + 200y = 3900$ : $350x + 200(15 - x) = 3900$ أي $150x = 900$ ومنه $x = 6$ و $y = 9$ . تحقق: $2100 + 1800 = 3900$ .'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mushkilat-jumla_P2'] },
        },
        {
          // x + y = 45 ; 400x + 600y = 19600 → (37 ; 8) ; 38 et 7 : 15200 + 4200 = 19400 ≠ 19600
          id: 'E4', skill: 'marahil', requires: ['tahaqquq-nas'],
          prompt: <Q source={SRC}>رحلة مدرسية: 45 مشاركا بين تلاميذ (تذكرة 400 DA) ومرافقين (تذكرة 600 DA)، والمبلغ 19600 DA. وجد أنس «38 تلميذا و 7 مرافقين». ماذا يقول التحقق في النص؟</Q>,
          options: [
            M('جواب أنس صحيح لأنّ $38 + 7 = 45$ .'),
            M('جواب أنس خاطئ: $400 \\times 38 + 600 \\times 7 = 19400$ وليس 19600 DA.'),
            M('جواب أنس صحيح لأنّ 38 و 7 عددان طبيعيان.'),
          ],
          correct: 1, cols: 1,
          explain: <MathText>{'نتحقق في المعلومتين معًا: عدد المشاركين صحيح، لكن المبلغ $15200 + 4200 = 19400$ . الحل الصحيح 37 تلميذا و 8 مرافقين: $14800 + 4800 = 19600$ .'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mushkilat-jumla_P2'] },
        },
        {
          // x + y = 12 ; 3x + y = 28 → (8 ; 4). (4 ; 8) → 20 points ; (9 ; 3) → 30 points
          id: 'E5', skill: 'marahil', requires: ['khutuwat-hall', 'tahaqquq-nas'],
          prompt: <Q source={SRC}>في بطولة ألعاب إلكترونية، يحصل الفريق على 3 نقاط عن كل فوز ونقطة عن كل تعادل. لعب فريق «النسور» 12 مباراة دون خسارة وجمع 28 نقطة. ما الجملة التي تجيب عن السؤال «كم مباراة فاز وكم مباراة تعادل؟»</Q>,
          options: [
            'فاز الفريق في 4 مباريات وتعادل في 8.',
            'فاز الفريق في 9 مباريات وتعادل في 3.',
            'فاز الفريق في 8 مباريات وتعادل في 4.',
          ],
          correct: 2, cols: 1,
          explain: <MathText>{'$x + y = 12$ و $3x + y = 28$ : بالطرح $2x = 16$ أي $x = 8$ و $y = 4$ . تحقق: $24 + 4 = 28$ نقطة و $8 + 4 = 12$ مباراة.'}</MathText>,
          assessment: { enabled: true, type: 'assessment', learningPointIds: ['4am_mushkilat-jumla_P2'] },
        },
      ]}
      badges={[
        { id: 'tarjama', emoji: '🧩', label: 'من القصة إلى الجملة', test: (m) => (m.tarjama ?? 0) === 0 },
        { id: 'marahil', emoji: '🔍', label: 'تحقّقت في النص', test: (m) => (m.marahil ?? 0) === 0 },
      ]}
      synthese={<KnowledgeSnapshot complete variant="complete" />}
      completion={{
        masterTitle: 'أتقنت حل المشكلات بجملة معادلتين',
        title: 'انتهى الدرس 3',
        message: 'تعرف الآن كيف تختار المجهولين، وتترجم قصة إلى جملة معادلتين، وتحلّها، ثم تتحقق في القصة نفسها وتجيب بجملة.',
        verbs: ['أختار', 'أترجم', 'أحلّ', 'أتحقّق', 'أجيب'],
        masterBadgeLabel: 'حل مشكلات بجملة',
      }}
    />
  );
}
