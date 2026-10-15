import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_TILING } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مساحة سطح مستو ومحيطه » (1AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme, tirés de
 * أوظّف تعلّماتي 1 et de أكتسب طرائق 1 du manuel ; rien n'est copié au mot).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'masaha-adad', type: 'concepts', title: 'المساحة: عدد البلاطات',
        predictPrompt: 'في الحوش اثنتا عشرة بلاطة مهما غيّرتَ ترتيبها. ماذا يقيس هذا العدد؟ اكتب بكلماتك ما هي مساحة سطح.',
        summary: 'مساحة سطح هي عدد وحدات المساحة (البلاطات) التي تغطّيه تمامًا، بلا فراغ وبلا تراكب.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.area.text}</MathText></p></div>,
      },
      {
        id: 'mahit-hadd', type: 'concepts', title: 'المحيط: طول الحدّ',
        predictPrompt: 'كلّما التصقت البلاطات قصر السياج وكلّما تباعدت طال. ماذا يقيس طول السياج؟ اكتب بكلماتك ما هو محيط سطح.',
        summary: 'محيط سطح هو طول حدّه: عدد وحدات الطول (أضلاع البلاطات) على الحدّ كلّه، وهو طول السياج الذي يحيط به مرّة واحدة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.perimeter.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.different.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'wahdat-tul-masaha', type: 'concepts', title: 'وحدة الطول ووحدة المساحة', predict: false,
        summary: 'نعدّ المساحة بوحدة مساحة هي البلاطة، ونعدّ المحيط بوحدة طول هي ضلع البلاطة: لكل عدد وحدته.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.unitLength.text}</MathText></p></div>,
      },
      {
        id: 'naql-baqat-masaha', type: 'regles', title: 'نقل البلاطات',
        predictPrompt: 'نقلتَ بلاطة من مكان إلى مكان دون أن تضيف بلاطة أو تزيلها. ماذا بقي كما هو وماذا تغيّر؟ اكتب ما لاحظته.',
        summary: 'إذا نقلنا بلاطات دون إضافة ولا إزالة بقيت المساحة وتغيّر المحيط عادةً: كلّما التصقت البلاطات بأضلاع أكثر قصر الحدّ.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.moving.text}</MathText></p></div>,
      },
    ],
    2: [
      {
        id: 'thalath-hallat', type: 'regles', title: 'سطحان: المساحة والمحيط',
        predictPrompt: 'قارنتَ حوشين: بالبلاطات نفسها وسياجين مختلفين، وبالسياج نفسه وعددين مختلفين من البلاطات. ماذا يمكن أن يتساوى لسطحين وماذا يختلف؟ اكتب الحالات التي رأيتها.',
        summary: 'لسطحين مختلفين قد تتساوى المساحتان دون المحيطين، أو المحيطان دون المساحتين، أو المساحتان والمحيطان معًا مع اختلاف الشكلين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.sameAreaOnly.text}</MathText></p>
            <p><MathText>{KNOWLEDGE.samePerimeterOnly.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.sameBoth.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-rasf', type: 'methodes', title: 'أعيّن المساحة برصف',
        predictPrompt: 'رصصتَ الشرفة ببلاطات كاملة وأنصاف بلاطات. كيف عيّنتَ مساحتها بعدد واحد؟ اكتب ما فعلتَه بالأنصاف.',
        summary: 'نغطّي السطح بوحدة المساحة ثم نعدّ البلاطات الكاملة ونضمّ كل نصفين في بلاطة، ثم نجمع.',
        body: (
          <div className="space-y-2">
            {METHOD_TILING.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.halves.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'wahdatan-adad', type: 'regles', title: 'مساحة واحدة بوحدتين',
        predictPrompt: 'قرأتَ مساحة الأرضية نفسها بالبلاطة المفردة وبالبلاطة المزدوجة فجاء عددان مختلفان. لماذا اختلف العدد والمساحة واحدة؟ اكتب ما لاحظته.',
        summary: 'المساحة نفسها يتغيّر عددها بتغيّر الوحدة: إذا كانت وحدة ② ضعف وحدة ① فعدد وحدات ② نصف عدد وحدات ①.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.units.text}</MathText></p></div>,
      },
    ],
  },
};
