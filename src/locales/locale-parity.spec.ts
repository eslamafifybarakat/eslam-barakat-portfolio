import en from './en.json';
import ar from './ar.json';

describe('locale catalogs', () => {
  it('have the exact same set of keys (no drift between en.json and ar.json)', () => {
    const enKeys = Object.keys(en).sort();
    const arKeys = Object.keys(ar).sort();

    expect(arKeys).toEqual(enKeys);
    expect(enKeys.length).toBeGreaterThan(0);
  });

  it('has no empty values in either catalog', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(value, `en.json["${key}"] should not be empty`).not.toBe('');
    }
    for (const [key, value] of Object.entries(ar)) {
      expect(value, `ar.json["${key}"] should not be empty`).not.toBe('');
    }
  });
});
