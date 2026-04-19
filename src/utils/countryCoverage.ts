import { countries, countryById } from '../data/countries';
import type { Country } from '../types';

export const COUNTRY_ATLAS_URL = '/maps/countries-10m.json';
const markerOnlyCountryIds = new Set(['462']);

export function normalizeCountryGeoId(id: string | number) {
  return String(id).padStart(3, '0');
}

export function isMarkerOnlyCountry(id: string | number) {
  return markerOnlyCountryIds.has(normalizeCountryGeoId(id));
}

export function getMissingAtlasCountries(geoIds: Iterable<string | number>) {
  const atlasIds = new Set(Array.from(geoIds, normalizeCountryGeoId));
  return countries.filter((country) => !atlasIds.has(country.id));
}

export function getCountryMarkerCountries() {
  return countries.filter(
    (country): country is Country & { mapMarkerCoordinates: [number, number] } =>
      Boolean(country.mapMarkerCoordinates),
  );
}

export function getCountryByGeoId(geoId: string | number) {
  return countryById.get(normalizeCountryGeoId(geoId));
}
