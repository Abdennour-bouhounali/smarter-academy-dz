import React from 'react';
import MathText from '../../../../common/components/MathText';

/**
 * La carte des connaissances de « القاسم المشترك الأكبر » — SOURCE UNIQUE.
 *
 * Chaque item est posé dans un module par une <KnowledgeBrick id="...">, à
 * l'instant précis où l'élève en a besoin, et entre dans la carte à ce
 * moment-là. Le texte n'existe qu'ICI : la brique et la carte rendent le
 * même objet (docs/architecture/KNOWLEDGE_MAP.md).
 *
 * TERMINOLOGIE. Les mots arabes sont ceux du programme officiel et de son
 * registre terminologique (docs/ALGERIA_4AM_CURRICULUM.md §6) :
 * قاسم · القواسم المشتركة · القاسم المشترك الأكبر · خوارزمية أقليدس ·
 * الفروق المتتالية · القسمة الإقليدية. Rien n'est traduit depuis le
 * français, et rien n'est inventé.
 *
 * Les notations (PGCD, ×, =, les nombres) restent en écriture
 * mathématique latine, isolée en LTR par MathText (master spec §14).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qasim',
        type: 'vocabulaire',
        title: 'قاسم عدد طبيعي',
        summary: 'العدد الذي تكون القسمة عليه دون باقٍ.',
        body: (
          <div className="space-y-3">
            <p>
              نقول إنّ عددًا طبيعيًا <strong>يقسم</strong> عددًا آخر إذا كانت
              القسمة الإقليدية عليه تعطي <strong>باقيًا معدومًا</strong>.
            </p>
            <p>
              مثال: <MathText>{'$18 = 6 \\times 3 + 0$'}</MathText>، إذن
              <MathText>{' $6$'}</MathText> قاسم للعدد
              <MathText>{' $18$'}</MathText>.
            </p>
            <p className="text-xs text-slate-500">
              وبالمقابل <MathText>{'$18 = 5 \\times 3 + 3$'}</MathText>: الباقي
              ليس معدومًا، إذن <MathText>{'$5$'}</MathText> ليس قاسمًا
              للعدد <MathText>{'$18$'}</MathText>.
            </p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qawasim-mushtaraka',
        type: 'concepts',
        title: 'القواسم المشتركة لعددين',
        summary: 'الأعداد التي تقسم العددين معًا، في الوقت نفسه.',
        body: (
          <div className="space-y-3">
            <p>
              قاسم مشترك لعددين هو عدد <strong>يقسم كلًّا منهما</strong>.
            </p>
            <p>
              قواسم <MathText>{'$12$'}</MathText>:{' '}
              <MathText>{'$1,\\ 2,\\ 3,\\ 4,\\ 6,\\ 12$'}</MathText>
              <br />
              قواسم <MathText>{'$18$'}</MathText>:{' '}
              <MathText>{'$1,\\ 2,\\ 3,\\ 6,\\ 9,\\ 18$'}</MathText>
            </p>
            <p>
              القواسم المشتركة هي إذن:{' '}
              <MathText>{'$1,\\ 2,\\ 3,\\ 6$'}</MathText>.
            </p>
            <p className="text-xs text-slate-500">
              العدد <MathText>{'$1$'}</MathText> قاسم مشترك لأيّ عددين: قائمة
              القواسم المشتركة ليست فارغة أبدًا.
            </p>
          </div>
        ),
      },
      {
        id: 'pgcd',
        type: 'memoriser',
        title: 'القاسم المشترك الأكبر (PGCD)',
        summary: 'أكبر عدد يقسم العددين معًا.',
        body: (
          <div className="space-y-3">
            <p>
              <strong>القاسم المشترك الأكبر</strong> لعددين هو{' '}
              <strong>أكبر</strong> القواسم المشتركة لهما.
            </p>
            <MathText>{'$$\\mathrm{PGCD}(12\\ ;\\ 18) = 6$$'}</MathText>
            <p className="text-xs text-slate-500">
              انتبه إلى التمييز بين ثلاث كلمات: <strong>قاسم</strong> (لعدد
              واحد)، <strong>قاسم مشترك</strong> (لعددين)، و
              <strong>القاسم المشترك الأكبر</strong> (أكبرها). خلطها هو الخطأ
              الأكثر شيوعًا.
            </p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'furuq-mutatalia',
        type: 'methodes',
        title: 'طريقة الفروق المتتالية',
        summary: 'نطرح الأصغر من الأكبر ونعيد، إلى أن يتساوى العددان.',
        body: (
          <div className="space-y-3">
            <p>ما دام العددان مختلفين:</p>
            <ol className="list-decimal ps-5 space-y-1 text-sm">
              <li>نطرح العدد الأصغر من العدد الأكبر؛</li>
              <li>نحتفظ بالفرق وبالعدد الأصغر؛</li>
              <li>نعيد العملية.</li>
            </ol>
            <p>
              عندما <strong>يتساوى العددان</strong>، تكون هذه القيمة المشتركة
              هي القاسم المشترك الأكبر.
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
              <MathText>{'$18 - 12 = 6$'}</MathText> ← نحتفظ بـ{' '}
              <MathText>{'$(12\\ ;\\ 6)$'}</MathText>
              <br />
              <MathText>{'$12 - 6 = 6$'}</MathText> ← نحتفظ بـ{' '}
              <MathText>{'$(6\\ ;\\ 6)$'}</MathText>
              <br />
              العددان متساويان، إذن{' '}
              <MathText>{'$\\mathrm{PGCD}(18\\ ;\\ 12) = 6$'}</MathText>.
            </div>
          </div>
        ),
      },
      {
        id: 'limadha-la-yataghayyar',
        type: 'regles',
        title: 'لماذا لا يتغيّر القاسم المشترك الأكبر بالطرح؟',
        summary: 'كل قاسم مشترك للعددين يقسم أيضًا فرقهما.',
        body: (
          <div className="space-y-3">
            <p>
              إذا كان عدد يقسم <MathText>{'$a$'}</MathText> ويقسم{' '}
              <MathText>{'$b$'}</MathText>، فإنه يقسم كذلك{' '}
              <MathText>{'$a - b$'}</MathText>.
            </p>
            <p>
              لذلك فإنّ الزوج <MathText>{'$(a\\ ;\\ b)$'}</MathText> والزوج{' '}
              <MathText>{'$(b\\ ;\\ a-b)$'}</MathText> لهما{' '}
              <strong>نفس القواسم المشتركة</strong>، وبالتالي نفس القاسم
              المشترك الأكبر. هذا ما يجعل الطريقة صحيحة، لا مجرّد حيلة.
            </p>
          </div>
        ),
      },
    ],
    4: [
      {
        id: 'khwarizmiyat-aqlidus',
        type: 'methodes',
        title: 'خوارزمية أقليدس',
        summary: 'نقسم، ثم نعيد بالباقي، إلى أن يصبح الباقي معدومًا.',
        body: (
          <div className="space-y-3">
            <p>ما دام الباقي غير معدوم:</p>
            <ol className="list-decimal ps-5 space-y-1 text-sm">
              <li>ننجز القسمة الإقليدية للأكبر على الأصغر؛</li>
              <li>نستبدل الزوج بـ (القاسم ؛ الباقي)؛</li>
              <li>نعيد العملية.</li>
            </ol>
            <p>
              القاسم المشترك الأكبر هو <strong>آخر باقٍ غير معدوم</strong>، أي
              القاسم في السطر الأخير.
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm space-y-1">
              <MathText>{'$264 = 60 \\times 4 + 24$'}</MathText>
              <br />
              <MathText>{'$60 = 24 \\times 2 + 12$'}</MathText>
              <br />
              <MathText>{'$24 = 12 \\times 2 + 0$'}</MathText>
              <br />
              الباقي معدوم، إذن{' '}
              <MathText>{'$\\mathrm{PGCD}(264\\ ;\\ 60) = 12$'}</MathText>.
            </div>
            <p className="text-xs text-slate-500">
              قسمة واحدة تختصر عدّة طرحات متتالية: الخوارزمية هي اختصار لطريقة
              الفروق، وليست طريقة أخرى لا علاقة لها بها.
            </p>
          </div>
        ),
      },
    ],
    5: [
      {
        id: 'tahaqquq',
        type: 'regles',
        title: 'التحقق من صحة النتيجة',
        summary: 'يجب أن يقسم العدد الموجود كلا العددين، وألّا يوجد أكبر منه.',
        body: (
          <div className="space-y-3">
            <p>نتيجة صحيحة تستوفي الشرطين معًا:</p>
            <ol className="list-decimal ps-5 space-y-1 text-sm">
              <li>
                العدد الموجود <strong>يقسم العددين</strong> (الباقيان
                معدومان)؛
              </li>
              <li>
                <strong>لا يوجد قاسم مشترك أكبر منه</strong>.
              </li>
            </ol>
            <p className="text-xs text-slate-500">
              الشرط الأول وحده لا يكفي: <MathText>{'$2$'}</MathText> يقسم
              <MathText>{' $12$'}</MathText> و<MathText>{'$18$'}</MathText>،
              لكنه ليس القاسم المشترك الأكبر.
            </p>
          </div>
        ),
      },
      {
        id: 'awwaliyan-fima-baynahuma',
        type: 'vocabulaire',
        title: 'عددان أوّليان فيما بينهما',
        summary: 'قاسمهما المشترك الأكبر يساوي 1.',
        body: (
          <p>
            عندما يكون <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b) = 1$'}</MathText>،
            نقول إنّ العددين <strong>أوّليان فيما بينهما</strong>: ليس لهما أيّ
            قاسم مشترك سوى <MathText>{'$1$'}</MathText>. مثال:{' '}
            <MathText>{'$8$'}</MathText> و<MathText>{'$15$'}</MathText>.
          </p>
        ),
      },
    ],
    6: [
      {
        id: 'mata-nastamil-pgcd',
        type: 'methodes',
        title: 'متى تكون الوضعية وضعية قاسم مشترك أكبر؟',
        summary: 'عندما نبحث عن أكبر تجزئة متماثلة دون باقٍ.',
        body: (
          <div className="space-y-3">
            <p>
              كلما طُلب توزيع كميّتين في <strong>حصص متماثلة</strong>، دون أن
              يبقى شيء، و<strong>بأكبر حجم ممكن</strong> — فالسؤال هو سؤال
              قاسم مشترك أكبر، حتى وإن لم يُذكر اسمه.
            </p>
            <p className="text-xs text-slate-500">
              عبارات تدلّ عليه: «أكبر عدد من...»، «دون أن يبقى شيء»، «متماثلة».
              وعدد الحصص يُحسب بعد ذلك بالقسمة على القاسم المشترك الأكبر.
            </p>
          </div>
        ),
      },
    ],
  },
};
