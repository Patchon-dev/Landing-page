import test from 'node:test';
import assert from 'node:assert/strict';
import { getMapCountry, getCountryAtPosition } from '../src/lib/components/map/countries.ts';

test('resolves capitals for different countries and handles missing country codes', () => {
  assert.equal(getMapCountry('pt').capital, 'Lisbon');
  assert.equal(getMapCountry('ES').capital, 'Madrid');
  assert.equal(getMapCountry('FR').capital, 'Paris');
  assert.equal(getMapCountry('BR').capital, 'Brasília');
  for (const code of [undefined, null, 12, '', 'ZZ', '__proto__']) assert.equal(getMapCountry(code), null);
});

test('identifies Brazil and Brasília in cities and remote inland locations without a geocoding request', async (t) => {
  const signal = new AbortController().signal;
  const fetchMock = t.mock.method(globalThis, 'fetch', () => {
    throw new Error('Country detection must work without a remote geocoder');
  });
  for (const [lat, lng] of [[-8, -60], [-15.793889, -47.882778], [-23.5505, -46.6333], [-3.119, -60.0217]]) {
    const country = await getCountryAtPosition(lat, lng, signal);
    assert.equal(country.code, 'BR');
    assert.equal(country.capital, 'Brasília');
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('distinguishes Brazil from other South American countries and handles wrapped longitudes', async () => {
  const signal = new AbortController().signal;
  for (const [lat, lng, code] of [[-34.6, -58.38, 'AR'], [-16.5, -68.15, 'BO'], [-12.046, -77.042, 'PE'], [-8, 300, 'BR']]) {
    assert.equal((await getCountryAtPosition(lat, lng, signal)).code, code);
  }
  assert.equal((await getCountryAtPosition(40.4168, -3.7038, signal)).capital, 'Madrid');
});

test('returns no country for unassigned or invalid coordinates and respects cancellation', async () => {
  const signal = new AbortController().signal;
  assert.equal(await getCountryAtPosition(0, 0, signal), null);
  assert.equal(await getCountryAtPosition(91, 0, signal), null);
  assert.equal(await getCountryAtPosition(NaN, 0, signal), null);
  assert.equal(await getCountryAtPosition(0, Infinity, signal), null);
  const controller = new AbortController();
  const pending = getCountryAtPosition(-8, -60, controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  await assert.rejects(getCountryAtPosition(-8, -60, controller.signal), { name: 'AbortError' });
});
