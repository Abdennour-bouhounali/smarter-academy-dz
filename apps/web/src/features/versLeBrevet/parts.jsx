import { useCallback, useRef } from 'react';
import MathText from '../../lessons/common/components/MathText';

/**
 * THE 2D GAME LOOK — the pieces its pages share: the robot's bar at the bottom, a chunky key, the short notes. Ported
 * from the French platform (2026-11-28) with only what the revision page uses; the pictures of the French « Vers le
 * brevet » (lots, timeline, confetti, marked statements) are not ported.
 */

/** The robot: its eyes and mouth follow `mood` — idle, oops, think, win. */
function Robot({ mood = 'idle' }) {
  return (
    <svg className="vb-robot" data-mood={mood} viewBox="0 0 80 80" aria-hidden="true">
      <path className="vb-robot__head" d="M40 12V4" />
      <circle className="vb-robot__eye" cx="40" cy="4" r="3" />
      <rect className="vb-robot__head" x="8" y="12" width="64" height="58" rx="18" />
      <circle className="vb-robot__eye vb-robot__eye--l" cx="28" cy="36" r="6" />
      <circle className="vb-robot__eye vb-robot__eye--r" cx="52" cy="36" r="6" />
      <path className="vb-robot__mouth" data-for="idle" d="M30 54h20" />
      <path className="vb-robot__mouth" data-for="oops" d="M35 55a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path className="vb-robot__mouth" data-for="think" d="M30 55q5 -5 10 0t10 0" />
      <path className="vb-robot__mouth" data-for="win" d="M27 50q13 16 26 0" />
    </svg>
  );
}

/** The bottom bar: the robot says ONE thing (`$…$` maths allowed); the action of the moment stands after it. */
export function Bar({ mood, say, children }) {
  return (
    <div className="vb-bar">
      <div className="vb-bot">
        <Robot mood={mood} />
        <div className="vb-bubble" aria-live="polite">
          <MathText>{String(say ?? '')}</MathText>
        </div>
      </div>
      <div className="vb-actions">{children}</div>
    </div>
  );
}

const NOTES = {
  tap: [[330, 0]],
  good: [
    [523, 0],
    [659, 0.09],
  ],
};

/** Short notes on the student's own gesture, only while the sound is on. */
export function useSound(on) {
  const ctx = useRef(null);
  return useCallback(
    (kind) => {
      if (!on || typeof window === 'undefined') return;
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      ctx.current = ctx.current || new Audio();
      const audio = ctx.current;
      if (audio.state === 'suspended') audio.resume(); // a browser keeps it asleep until a touch
      for (const [freq, at] of NOTES[kind] ?? []) {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        const t = audio.currentTime + at;
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      }
    },
    [on],
  );
}

/** A chunky key. */
export function Key({ children, kind = 'main', ...rest }) {
  return (
    <button type="button" className={`vb-key vb-key--${kind}`} {...rest}>
      {children}
    </button>
  );
}
