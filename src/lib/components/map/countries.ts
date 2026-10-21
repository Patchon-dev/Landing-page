import { countries, type TCountryCode } from 'countries-list';

export function getMapCountry(code: unknown) {
  if (typeof code !== 'string') return null;
  const normalized = code.toUpperCase();
  if (!Object.hasOwn(countries, normalized)) return null;
  const { capital, name } = countries[normalized as TCountryCode];
  return { capital, name, code: normalized };
}

export async function getCountryAtPosition(lat: number, lng: number, signal: AbortSignal) {
  signal.throwIfAborted();
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90) return null;
  // Load the boundary dataset only when needed. Unlike a nearby-place search,
  // polygon lookup also works in rural areas without indexed addresses.
  const { iso1A2Code } = await import('@rapideditor/country-coder');
  signal.throwIfAborted();
  const longitude = ((lng + 180) % 360 + 360) % 360 - 180;
  return getMapCountry(iso1A2Code([longitude, lat], { level: 'territory' }));
}
