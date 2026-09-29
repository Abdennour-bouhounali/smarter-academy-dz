import { describe, it, expect } from 'vitest';
import {
  columnWidthFor, sidebarCanOpenBesideColumn, priorFitsViewport,
  SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, MA_CARTE_MIN_WIDTH, MA_CARTE_MAX_WIDTH, MA_CARTE_MAX_WIDE, MIN_CONTENT_WIDTH,
} from './WorkspaceLayoutContext';

// Le mode colonne de « Ma carte » : largeur FIXE, la meilleure pour l'écran.
describe('column width (fixed, best for the screen)', () => {
  it('matches the documented table', () => {
    expect(columnWidthFor(1024, SIDEBAR_COLLAPSED_WIDTH)).toBe(378);
    expect(columnWidthFor(1280, SIDEBAR_COLLAPSED_WIDTH)).toBe(480);
    expect(columnWidthFor(1440, SIDEBAR_COLLAPSED_WIDTH)).toBe(480);
    expect(columnWidthFor(1920, SIDEBAR_COLLAPSED_WIDTH)).toBe(560);
  });

  it('never leaves the lesson under MIN_CONTENT_WIDTH, never exceeds its cap', () => {
    for (let vw = 1024; vw <= 2560; vw += 16) {
      for (const side of [SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH]) {
        if (side === SIDEBAR_WIDTH && !sidebarCanOpenBesideColumn(vw)) continue;
        const w = columnWidthFor(vw, side);
        expect(vw - side - w, `${vw}/${side}`).toBeGreaterThanOrEqual(MIN_CONTENT_WIDTH);
        expect(w).toBeLessThanOrEqual(vw >= 1600 ? MA_CARTE_MAX_WIDE : MA_CARTE_MAX_WIDTH);
      }
    }
  });

  it('keeps the map readable whenever the sidebar is allowed open beside it', () => {
    for (let vw = 1024; vw <= 2560; vw += 16) {
      if (sidebarCanOpenBesideColumn(vw)) expect(columnWidthFor(vw, SIDEBAR_WIDTH)).toBeGreaterThanOrEqual(MA_CARTE_MIN_WIDTH);
    }
  });

  it('locks the sidebar toggle only where opening it would squeeze the lesson', () => {
    expect(sidebarCanOpenBesideColumn(1024)).toBe(false);
    expect(sidebarCanOpenBesideColumn(1175)).toBe(false);
    expect(sidebarCanOpenBesideColumn(1176)).toBe(true);
    expect(sidebarCanOpenBesideColumn(1440)).toBe(true);
  });

  it('column mode exists from the lg breakpoint', () => {
    expect(priorFitsViewport(1023)).toBe(false);
    expect(priorFitsViewport(1024)).toBe(true);
  });
});
