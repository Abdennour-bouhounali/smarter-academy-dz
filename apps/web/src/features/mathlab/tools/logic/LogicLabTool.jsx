import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, NotebookPen } from 'lucide-react';
import { useNotebook } from '../../../practice/notebook/NotebookProvider';
import { escapeHtml } from '../../../practice/notebook/noteContent';
import {
  AREAS, normalizeLogicData, clearLogicData, setArea,
  togglePractice, setPracticeLevel, recordSolved, recordSeen, recordHint,
  setStatement, setImplication, setImplicationForm, setEquivalence,
  setCounterexampleChallenge, setCondition, setQuantifier, setNegationQuantifier, setProof, setFallacy,
} from './logicState.js';
import { generateChallenge, kindsForLevel } from './practice.js';
import StatementsArea from './StatementsArea.jsx';
import ConnectorsArea from './ConnectorsArea.jsx';
import ImplicationArea from './ImplicationArea.jsx';
import EquivalenceArea from './EquivalenceArea.jsx';
import CounterexampleArea from './CounterexampleArea.jsx';
import ConditionsArea from './ConditionsArea.jsx';
import QuantifiersArea from './QuantifiersArea.jsx';
import NegationArea from './NegationArea.jsx';
import ProofArea from './ProofArea.jsx';
import InductionArea from './InductionArea.jsx';
import FallacyArea from './FallacyArea.jsx';
import PracticePanel from './PracticePanel.jsx';
import DictionaryPanel from './DictionaryPanel.jsx';
import './logic.css';

/**
 * مختبر المنطق والبرهان — le composant de l'instrument.
 *
 * Il ne fait presque rien lui-même, et c'est voulu : il tient l'état du
 * document, choisit l'aire à montrer, et laisse chaque aire parler à
 * `logicMath.js` / `proofMath.js`. Aucune vérité logique n'est décidée ici.
 *
 * ── Ce qui est persisté, et ce qui ne l'est pas ──────────────────────────
 * Le document (`data`) garde les RÉGLAGES : l'aire, les préréglages choisis,
 * les valeurs essayées, les étapes posées, le niveau et les compteurs. La
 * QUESTION d'entraînement courante n'y est pas : elle se régénère de la
 * graine, et la garder serait garder ce qu'on sait refaire (MATH_LAB.md §4).
 *
 * ── Les hooks sont TOUS appelés inconditionnellement ─────────────────────
 * Aucun hook dans une branche : le défaut « Rendered more hooks than during
 * the previous render » a déjà fait tomber un instrument entier
 * (MATH_LAB.md §4.1, 2026-09-22).
 */
export default function LogicLabTool({ initialData, onChange, onReady }) {
  const { t } = useTranslation('mathlab');
  const [data, setData] = useState(() => normalizeLogicData(initialData));
  const [panelOpen, setPanelOpen] = useState(true);
  const [challengeSeed, setChallengeSeed] = useState(() => Math.floor(Math.random() * 100000) + 1);
  const [announcement, setAnnouncement] = useState('');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /** Une transition : on applique, on remonte l'état sérialisé à la coquille. */
  const commit = useCallback((updater) => {
    setData((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      if (next !== current) onChangeRef.current?.(next);

      return next;
    });
  }, []);

  const announce = useCallback((message) => setAnnouncement(message ?? ''), []);

  /* ── La coquille : « مسح الكل » ─────────────────────────────────────── */
  useEffect(() => {
    onReady?.({
      clear: () => commit(() => {
        const fresh = clearLogicData();
        onChangeRef.current?.(fresh);

        return fresh;
      }),
    });

    return () => onReady?.(null);
  }, [onReady, commit]);

  /* ── L'entraînement (§38) : une question tirée de la graine ─────────── */
  const challenge = useMemo(
    () => (data.practice.open ? generateChallenge(challengeSeed, kindsForLevel(data.practice.level)) : null),
    [data.practice.open, data.practice.level, challengeSeed],
  );

  // Une question VUE est comptée une fois, quand elle apparaît.
  const seenRef = useRef(null);
  useEffect(() => {
    if (!challenge) return;
    const key = `${challengeSeed}:${data.practice.level}`;
    if (seenRef.current === key) return;
    seenRef.current = key;
    commit(recordSeen);
  }, [challenge, challengeSeed, data.practice.level, commit]);

  /** §37 — « اعرضه في المختبر » : ouvrir l'aire qui MONTRE la réponse. */
  const showInLab = useCallback((target) => {
    if (!target) return;
    commit((current) => {
      let next = setArea(current, target.area);
      switch (target.area) {
        case 'statements': next = setStatement(next, target.id); break;
        case 'implication':
          next = setImplication(next, target.id);
          if (target.form) next = setImplicationForm(next, target.form);
          break;
        case 'equivalence': next = setEquivalence(next, target.id); break;
        case 'counterexample': next = setCounterexampleChallenge(next, target.id); break;
        case 'conditions': next = setCondition(next, target.id); break;
        case 'quantifiers': next = setQuantifier(next, target.id); break;
        case 'negation': next = setNegationQuantifier(next, target.id); break;
        case 'proof': next = setProof(next, target.id); break;
        case 'fallacy': next = setFallacy(next, target.id); break;
        default: break;
      }

      return next;
    });
    announce(t('tools.logic.announce.areaChanged', { area: t(`tools.logic.areas.${target.area}`) }));
  }, [commit, announce, t]);

  /* ── Le cahier de l'élève (§41) : celui de la plateforme, pas un second ── */
  const notebook = useNotebook();
  const sendToNotebook = useCallback(() => {
    if (!notebook?.openNotebook) return;
    const label = [t('tools.logic.name'), t(`tools.logic.areas.${data.area}`)].filter(Boolean).join(' · ');
    notebook.openNotebook({
      context: { sourceType: 'knowledge_item', sourceId: `mathlab:logic:${data.area}` },
      starterHtml: [
        '<section data-nb="mathlab">',
        `<p data-nb="label">${escapeHtml(label)}</p>`,
        '<p></p>',
        '</section>',
      ].join(''),
    });
    announce(t('tools.logic.common.sentToNotebook'));
  }, [notebook, t, data.area, announce]);

  const Area = AREA_COMPONENTS[data.area] ?? CounterexampleArea;

  return (
    <div className="sa-ml-lg" data-ml-lg-root data-ml-lg-current-area={data.area}>
      {/* ── Les dix aires ─────────────────────────────────────────────── */}
      <nav className="sa-ml-lg__areas" aria-label={t('tools.logic.areasLabel')}>
        {AREAS.map((area) => (
          <button
            key={area}
            type="button"
            className="sa-ml-lg__area"
            aria-pressed={data.area === area}
            onClick={() => {
              commit((current) => setArea(current, area));
              announce(t('tools.logic.announce.areaChanged', { area: t(`tools.logic.areas.${area}`) }));
            }}
            data-ml-lg-area-tab={area}
          >
            {t(`tools.logic.areas.${area}`)}
          </button>
        ))}
      </nav>

      <div className="sa-ml-lg__body">
        <main className="sa-ml-lg__stage" data-ml-lg-stage>
          <Area
            data={data}
            onChange={commit}
            announce={announce}
            onGoToProof={() => commit((current) => setArea(current, 'proof'))}
          />
        </main>

        <button
          type="button"
          className="sa-ml-lg__panel-toggle"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          data-ml-lg-panel-toggle
        >
          {panelOpen ? t('tools.logic.panelHide') : t('tools.logic.panelShow')}
        </button>

        <aside className="sa-ml-lg__panel" hidden={!panelOpen} aria-label={t('tools.logic.panelHeading')}>
          <p className="sa-ml-lg__lead" dir="auto">{t('tools.logic.cycle')}</p>

          <div className="sa-ml-lg__actions">
            <button
              type="button"
              className="sa-ml-lg__btn sa-ml-lg__btn--primary"
              onClick={() => commit(togglePractice)}
              aria-pressed={data.practice.open}
              data-ml-lg-practice-toggle
            >
              <GraduationCap size={16} aria-hidden="true" />
              {data.practice.open ? t('tools.logic.common.closePractice') : t('tools.logic.common.openPractice')}
            </button>

            {notebook?.openNotebook && (
              <button type="button" className="sa-ml-lg__btn" onClick={sendToNotebook} data-ml-lg-notebook>
                <NotebookPen size={16} aria-hidden="true" />
                {t('tools.logic.common.sendToNotebook')}
              </button>
            )}
          </div>

          {/* « قاموس الرموز » : comment se lit ce qui n'est pas en arabe. */}
          <DictionaryPanel />

          {data.practice.open && (
            <PracticePanel
              challenge={challenge}
              level={data.practice.level}
              solved={data.practice.solved}
              seen={data.practice.seen}
              onLevel={(level) => { commit((c) => setPracticeLevel(c, level)); setChallengeSeed((s) => s + 1); }}
              onCheck={(correct) => { if (correct) commit(recordSolved); }}
              onHint={() => commit(recordHint)}
              onNext={() => setChallengeSeed((s) => s + 1)}
              onClose={() => commit(togglePractice)}
              onShowInLab={showInLab}
            />
          )}
        </aside>
      </div>

      <span className="sa-ml-lg__sr" role="status" aria-live="polite" data-ml-lg-announce>{announcement}</span>
    </div>
  );
}

const AREA_COMPONENTS = {
  statements: StatementsArea,
  connectors: ConnectorsArea,
  implication: ImplicationArea,
  equivalence: EquivalenceArea,
  counterexample: CounterexampleArea,
  conditions: ConditionsArea,
  quantifiers: QuantifiersArea,
  negation: NegationArea,
  proof: ProofArea,
  induction: InductionArea,
  fallacy: FallacyArea,
};
