import React from 'react';
import MathText from '../../../../../common/components/MathText';
import GeoFigure from '../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, KNOWLEDGE3, KNOW1_REMARK1, METHOD } from './content/textbook';
import { FIG_KNOW3_REMARK } from './content/figures';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الخاصية العكسية لخاصية طالس وإثبات التوازي » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 2)  aksiya-nashat — le texte complété de la question 2 et la ملاحظة sur l'ordre ;
 *   module 2 (معارف)   khassiya-aksiya (معارف 3), shart-tartib (sa ملاحظة : rapports égaux, ordre différent),
 *                      nisbatan-mukhtalifatan (ملاحظة 1 de معارف 1, déclarée en double) ;
 *   module 3 (طرائق)   tariqa-tawazi, tariqa-adam-tawazi (la marche de طرائق p. 109, formulée par la plateforme).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'aksiya-nashat', type: 'concepts', title: 'الخاصية العكسية في النشاط',
        predictPrompt: "في الأشكال الثلاثة كانت $\\dfrac{AB'}{AB} = \\dfrac{AC'}{AC} = \\dfrac{1}{3}$ ، لكن الفقاعة بقيت مائلة في الشكل 3 وحده. اكتب بكلماتك ما الذي يجعل $(B'C')$ موازيًا لـ $(BC)$ .",
        summary: 'إذا كانت النقط A، B، B′ والنقط A، C، C′ في استقامية ومرتبة بنفس الترتيب، وكانت النسبة AB′ على AB تساوي النسبة AC′ على AC، فإن المستقيمين (BC) و (B′C′) متوازيان.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY.statement}</MathText></p>
            <p className="text-sm text-slate-700"><MathText>{ACTIVITY.remark}</MathText></p>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {ACTIVITY.tables.map((row) => (
                <table key={row.join('')} className="border-collapse text-center font-mono text-sm">
                  <tbody>
                    <tr>{row.slice(0, 3).map((c, i) => <td key={i} className="border border-slate-400 px-2">{c}</td>)}</tr>
                    <tr>{row.slice(3).map((c, i) => <td key={i} className="border border-slate-400 px-2">{c}</td>)}</tr>
                  </tbody>
                </table>
              ))}
              <span className="self-center text-sm text-slate-600" dir="rtl">{ACTIVITY.tail}</span>
            </div>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'khassiya-aksiya', type: 'regles', title: 'الخاصية العكسية لخاصية طالس',
        summary: '(d) و (d′) متقاطعان في A، B و B′ من (d) و C و C′ من (d′) تختلف عن A. إذا كان AB′ على AB يساوي AC′ على AC وكانت النقط A، B، B′ و A، C، C′ مرتبة بنفس الترتيب فإن (BC) و (B′C′) متوازيان.',
        body: (
          <div className="space-y-1">
            {KNOWLEDGE3.property.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <SourceTag source={KNOWLEDGE3.source} />
          </div>
        ),
      },
      {
        id: 'shart-tartib', type: 'memoriser', title: 'شرط الترتيب',
        predictPrompt: "في الشكل 3 من النشاط كانت النسبتان متساويتين ( $\\dfrac{1}{3}$ ) ومع ذلك بقيت الفقاعة مائلة. ما الذي يختلف في الشكل 3 عن الشكلين الآخرين؟ هل يكفي تساوي النسبتين لنحكم بالتوازي؟ اكتب ما تستنتجه.",
        summary: 'تساوي النسبتين لا يكفي: إذا لم تكن النقط A، B، B′ و A، C، C′ مرتبة بنفس الترتيب فإن المستقيمين (BC) و (B′C′) غير متوازيين.',
        body: (
          <div className="space-y-1.5">
            <GeoFigure {...FIG_KNOW3_REMARK} />
            <p><MathText>{KNOWLEDGE3.remark}</MathText></p>
            <SourceTag source={KNOWLEDGE3.source} />
          </div>
        ),
      },
      {
        id: 'nisbatan-mukhtalifatan', type: 'regles', title: 'نسبتان مختلفتان',
        summary: 'يكفي عدم تساوي نسبتين من نسب طالس للقول إن المستقيمين غير متوازيين، لأنهما لو كانا متوازيين لتساوت النسب حسب خاصية طالس.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{KNOW1_REMARK1.text}</MathText></p>
            <p className="text-sm text-slate-700">{KNOW1_REMARK1.why}</p>
            <SourceTag source={KNOW1_REMARK1.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqa-tawazi', type: 'methodes', title: 'إثبات توازي مستقيمين',
        predictPrompt: 'اخترت للتوّ النسبتين $\\dfrac{DA}{DF}$ و $\\dfrac{DB}{DC}$ لتثبت أنّ $(CF)$ يوازي $(AB)$ . لو أعطيناك شكلًا آخر فيه مستقيمان متقاطعان، بأيّ خطوات تبرهن أنّ مستقيمين متوازيان، وبأيّ ترتيب؟ اكتب الطريقة.',
        summary: 'نتحقق أن النقط في استقامية وبنفس الترتيب، ثم نحسب النسبتين ونقارنهما بالجداء المتصالب، ثم نستنتج التوازي حسب الخاصية العكسية لخاصية طالس.',
        body: (
          <div className="space-y-1.5">
            {METHOD.ruleParallel.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-700"><MathText>{METHOD.part1[2]}</MathText></p>
            <SourceTag source={METHOD.source} /> <SourceTag source={METHOD.ruleSource} />
          </div>
        ),
      },
      {
        id: 'tariqa-adam-tawazi', type: 'methodes', title: 'إثبات عدم توازي مستقيمين',
        predictPrompt: 'وجدت $3{,}2 \\times 5 = 16$ و $4{,}6 \\times 3{,}5 = 16{,}1$ . كيف تكتب برهانًا كاملًا على أنّ $(BD)$ و $(EF)$ غير متوازيين؟ اكتب الخطوات، وبرّر استنتاجك.',
        summary: 'نجد نسبتين غير متساويتين، ثم نقول: لو كان المستقيمان متوازيين لتساوت النسبتان حسب خاصية طالس، لكن المساواة خاطئة، إذن المستقيمان غير متوازيين.',
        body: (
          <div className="space-y-1.5">
            {METHOD.ruleNotParallel.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-700"><MathText>{METHOD.part2[2]}</MathText></p>
            <SourceTag source={METHOD.source} /> <SourceTag source={METHOD.ruleSource} />
          </div>
        ),
      },
    ],
  },
};
