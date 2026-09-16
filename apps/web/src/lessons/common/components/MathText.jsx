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
// Math LTR isolation (ALGERIA_PLATFORM_MASTER_SPEC.md §14): the UI is RTL
// (ar-DZ — src/locale.js) but notation reads left-to-right regardless of the
// surrounding text direction. Every expression is wrapped in a `dir="ltr"`
// container carrying .sa-math-inline / .sa-math-block (index.css). Block math
// gets a <div>: react-katex's BlockMath renders a <div>, which is invalid
// inside a <span> and triggers a React DOM-nesting warning. Single chokepoint
// — 360+ call sites inherit this without individual changes.

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
        <div key={index} dir="ltr" className="sa-math-block">
          <BlockMath math={part.slice(2, -2)} />
        </div>
      );
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return (
        <span key={index} dir="ltr" className="sa-math-inline">
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

