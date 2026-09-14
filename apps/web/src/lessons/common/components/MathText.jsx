import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * MathText — LaTeX renderer for Smarter Academy.
 *
 * Responsibility: render mathematical notation ($...$  and  $$...$$) via KaTeX.
 *
 * NOT responsible for:
 *  - Markdown bold (**text**)  → use <strong>text</strong> in JSX
 *  - Markdown italic (*text*)  → use <em>text</em> in JSX
 *  - Paragraph layout          → use <p> in JSX
 *
 * Usage — inline math mixed with text:
 *   <p>La fonction <MathText>$f(x)=ax+b$</MathText> est affine.</p>
 *
 * Usage — full sentence with multiple expressions:
 *   <MathText>{"Pour $x=3$, on obtient $f(3)=7$."}</MathText>
 *
 * Usage — display (block) formula:
 *   <MathText>{"$$a=\\frac{y_B-y_A}{x_B-x_A}$$"}</MathText>
 *
 * Usage — with className:
 *   <MathText className="font-mono text-blue-700">$f(x)=2x$</MathText>
 */
// Math LTR isolation (ALGERIA_PLATFORM_MASTER_SPEC.md §14): the platform's
// UI direction is RTL (ar-DZ — see src/locale.js), but mathematical notation
// is read left-to-right regardless of surrounding text direction — this is
// not a stylistic choice, it's how `2x + 3 = 7` or a fraction bar is
// mathematically structured. `dir="ltr"` fixes ordering AND the direction
// KaTeX's own internal layout assumes; `unicodeBidi: isolate` keeps the
// expression's bidi run from being reordered by surrounding Arabic text
// (critical for something like "احسب $x+5=12$", where an Arabic sentence
// wraps an LTR expression). This is the single chokepoint — 364+ call sites
// across the app get this for free without individual changes.
const MATH_LTR_STYLE = { direction: 'ltr', unicodeBidi: 'isolate' };

export default function MathText({ children, className }) {
  if (typeof children !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[MathText] Expected a string child. Received:', typeof children,
        '— Use <strong>/<em> for emphasis in JSX, not ** inside MathText.'
      );
    }
    return null;
  }

  // Split on $$...$$ first (block), then $...$ (inline).
  const parts = children.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);

  const rendered = parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      return (
        <span key={index} dir="ltr" style={MATH_LTR_STYLE}>
          <BlockMath math={part.slice(2, -2)} />
        </span>
      );
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return (
        <span key={index} dir="ltr" style={MATH_LTR_STYLE}>
          <InlineMath math={`\\displaystyle ${part.slice(1, -1)}`} />
        </span>
      );
    }
    return part ? <span key={index}>{part}</span> : null;
  });

  if (className) {
    return <span className={className}>{rendered}</span>;
  }
  return <>{rendered}</>;
}

