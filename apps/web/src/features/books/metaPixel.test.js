import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackPurchase } from './metaPixel';

const book = { slug: 'smart-protocol', title: 'بروتوكول SMART', price: 1000 };

// Pas d'environnement DOM dans ce dépôt : `window` est simulé à la main.
function fakeWindow(url) {
  const { hostname, search } = new URL(url);
  globalThis.window = { location: { hostname, search }, fbq: vi.fn() };
  return globalThis.window;
}

describe('trackPurchase', () => {
  afterEach(() => { delete globalThis.window; });

  it('sends Purchase once with the amount to pay and the order number as eventID', () => {
    const w = fakeWindow('http://localhost/books/smart-protocol?pixel=1');
    trackPurchase(book, 1, { reference: 'BK-261125-DTXN', total: 1400 });
    expect(w.fbq).toHaveBeenCalledTimes(1);
    expect(w.fbq).toHaveBeenCalledWith('track', 'Purchase', {
      value: 1400, currency: 'DZD', content_ids: ['smart-protocol'], content_name: 'بروتوكول SMART', content_type: 'product', num_items: 1,
    }, { eventID: 'BK-261125-DTXN' });
  });

  it('falls back to the copies price when the delivery fee is not known yet', () => {
    const w = fakeWindow('http://localhost/books/smart-protocol?pixel=1');
    trackPurchase(book, 2, { reference: 'BK-1', total: null });
    expect(w.fbq.mock.calls[0][2]).toMatchObject({ value: 2000, num_items: 2 });
  });

  it('sends nothing on localhost without ?pixel=1', () => {
    const w = fakeWindow('http://localhost/books/smart-protocol');
    trackPurchase(book, 1, { reference: 'BK-1', total: 1400 });
    expect(w.fbq).not.toHaveBeenCalled();
  });
});
