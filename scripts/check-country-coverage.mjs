import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COUNTRY_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const countriesSource = fs.readFileSync(path.join(__dirname, '../src/data/countries.ts'), 'utf8');
const idMatches = [...countriesSource.matchAll(/id: '([^']+)'/g)];
const countries = idMatches.map((match, index) => {
  const id = match[1];
  const start = match.index ?? 0;
  const end = index + 1 < idMatches.length ? (idMatches[index + 1].index ?? countriesSource.length) : countriesSource.length;
  const block = countriesSource.slice(start, end);
  const name =
    block.match(/name: '([^']+)'/)?.[1] ??
    block.match(/name: "([^"]+)"/)?.[1] ??
    id;
  const coordinates = block.match(/mapMarkerCoordinates: \[([^\]]+)\]/)?.[1];

  return {
    id,
    name,
    mapMarkerCoordinates: coordinates
      ? coordinates.split(',').map((value) => Number(value.trim()))
      : null,
  };
});

function normalizeCountryGeoId(id) {
  return String(id).padStart(3, '0');
}

function getMissingAtlasCountries(geoIds) {
  const atlasIds = new Set(Array.from(geoIds, normalizeCountryGeoId));
  return countries.filter((country) => !atlasIds.has(country.id));
}

function getCountryMarkerCountries(geoIds) {
  return getMissingAtlasCountries(geoIds).filter((country) => country.mapMarkerCoordinates);
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          if (response.statusCode && response.statusCode >= 400) {
            reject(new Error(`Failed to fetch atlas: ${response.statusCode}`));
            return;
          }

          resolve(JSON.parse(data));
        });
      })
      .on('error', reject);
  });
}

const atlas = await fetchJson(COUNTRY_ATLAS_URL);
const atlasIds = atlas.objects.countries.geometries.map((geometry) => geometry.id);
const missingCountries = getMissingAtlasCountries(atlasIds);
const coveredMarkerIds = new Set(getCountryMarkerCountries(atlasIds).map((country) => country.id));
const uncoveredCountries = missingCountries.filter((country) => !coveredMarkerIds.has(country.id));

if (uncoveredCountries.length > 0) {
  console.error('Countries without atlas geometry or fallback marker:');
  for (const country of uncoveredCountries) {
    console.error(`- ${country.name} (${country.id})`);
  }
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      countryCount: countries.length,
      atlasCountryCount: atlasIds.length,
      markerFallbackCount: coveredMarkerIds.size,
      uncoveredCountryCount: 0,
    },
    null,
    2,
  ),
);
