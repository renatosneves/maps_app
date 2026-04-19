import { countries, countryById } from '../data/countries';
import type { Country } from '../types';

export const COUNTRY_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json';

export function normalizeCountryGeoId(id: string | number) {
  return String(id).padStart(3, '0');
}

export function getMissingAtlasCountries(geoIds: Iterable<string | number>) {
  const atlasIds = new Set(Array.from(geoIds, normalizeCountryGeoId));
  return countries.filter((country) => !atlasIds.has(country.id));
}

export function getCountryMarkerCountries(geoIds: Iterable<string | number>) {
  return getMissingAtlasCountries(geoIds).filter(
    (country): country is Country & { mapMarkerCoordinates: [number, number] } =>
      Boolean(country.mapMarkerCoordinates),
  );
}

export function getCountryByGeoId(geoId: string | number) {
  return countryById.get(normalizeCountryGeoId(geoId));
}
