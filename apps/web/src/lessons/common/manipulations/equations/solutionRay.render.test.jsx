import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import SolutionRay from './SolutionRay';

it('solution-ray se rend dans ses trois modes et pour des bornes entières ou fractionnaires', () => {
  const phone = renderToString(<SolutionRay ineq="2,5x+100<=150" context="phone" bracket={false} levels={false} marks={[16, 20, 21]} />);
  expect(phone).toContain('data-solution-ray');
  expect(phone).toContain('data-mode="region"');
  expect(phone).toContain('data-decor-phone');
  expect(phone).not.toContain('manipulation.solutionRay');
  for (const ineq of ['x<3', '-3x+5<=20', '5x<=3', '4x-1<=x+3', '-7x+1<x-3']) {
    const html = renderToString(<SolutionRay ineq={ineq} />);
    expect(html).toContain('data-ray-line');
    expect(html).toContain('data-ray-bracket');
    expect(html).not.toContain('manipulation.solutionRay');
  }
  expect(renderToString(<SolutionRay ineq="-3x+5<=20" transform />)).toContain('data-mode="flip"');
  expect(renderToString(<SolutionRay ineq="x<3" level="beginner" />)).toContain('data-mode="bracket"');
});
