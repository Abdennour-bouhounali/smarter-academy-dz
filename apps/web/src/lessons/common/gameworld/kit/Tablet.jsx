/**
 * The TABLET of a rule: its icon, its name, its sentences, its formulas — and, above them, the rule the student forged
 * himself when he has one. The rule comes from the lesson (`useLesson().rules`).
 */

import MathText from '../../components/MathText';
import { useLesson } from './LessonContext';
import { KT } from './text';
import { M, Card } from './parts';

function TabletBody({ id, mine = null }) {
  const { rules } = useLesson();
  const t = rules[id];
  return (
    <>
      <div className="di-tablet__icon">{t.icon}</div>
      <h2>{t.title}</h2>
      {mine && (
        <div className="di-tablet__mine" data-di-my-rule>
          <small>{KT.tablets.mine}</small>
          <p>{mine.text}</p>
          {mine.words && <p className="di-tablet__words">« {mine.words} »</p>}
          <small>{KT.tablets.theirs}</small>
        </div>
      )}
      {t.lines.map((l) => (
        <p key={l}>
          <MathText>{l}</MathText>
        </p>
      ))}
      {t.list && (
        <ul className="di-tablet__list">
          {t.list.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
      <div className="di-tablet__math">
        {t.math.map((m) => (
          <M key={m}>{m}</M>
        ))}
      </div>
      {t.notes.map((n) => (
        <p key={n} className="di-tablet__note">
          {n}
        </p>
      ))}
    </>
  );
}

export function Tablet({ id, onClose, fresh, closeLabel, mine = null }) {
  return (
    <Card tone="di-card--stone">
      {fresh && <p className="di-card__eyebrow">{mine ? KT.tablets.forged : KT.tablets.got}</p>}
      <TabletBody id={id} mine={mine} />
      <button type="button" className="di-btn di-btn--primary" onClick={onClose} data-di-tablet>
        {closeLabel ?? KT.tablets.close}
      </button>
    </Card>
  );
}
