import { countries, countryByName } from '../data/countries';
import type {
  Continent,
  MapCalloutConfig,
  MapFocusZone,
  MapFocusZoneId,
  MapViewport,
  RegionFilter,
} from '../types';

const continentZoneId: Record<Exclude<Continent, 'Antarctica'>, MapFocusZoneId> = {
  Africa: 'africa-overview',
  Asia: 'asia-overview',
  Europe: 'europe-overview',
  'North America': 'north-america-overview',
  'South America': 'south-america-overview',
  Oceania: 'oceania-overview',
};

const continentZonesForWorld: MapFocusZoneId[] = [
  'north-america-overview',
  'south-america-overview',
  'europe-overview',
  'africa-overview',
  'asia-overview',
  'oceania-overview',
];

const oceanViewports: Record<string, MapViewport> = {
  Atlantic: { center: [-30, 10], zoom: 1.24 },
  Pacific: { center: [180, 0], zoom: 1.22 },
  Indian: { center: [75, -15], zoom: 1.72 },
  Arctic: { center: [0, 80], zoom: 2.32 },
  Southern: { center: [0, -70], zoom: 1.66 },
};

function getCountryIdsByContinent(continent: Continent) {
  return countries
    .filter((country) => country.continent === continent)
    .map((country) => country.id);
}

function getCountryIdsByNames(names: string[]) {
  return names.map((name) => {
    const country = countryByName.get(name.toLowerCase());
    if (!country) {
      throw new Error(`Unknown country in map focus configuration: ${name}`);
    }
    return country.id;
  });
}

const northAmericaCaribbeanIds = getCountryIdsByNames([
  'Antigua and Barbuda',
  'Bahamas',
  'Barbados',
  'Cuba',
  'Dominica',
  'Dominican Republic',
  'Grenada',
  'Haiti',
  'Jamaica',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Trinidad and Tobago',
]);

const africaAtlanticIslandIds = getCountryIdsByNames([
  'Cabo Verde',
  'São Tomé and Príncipe',
]);

const africaIndianOceanIslandIds = getCountryIdsByNames([
  'Comoros',
  'Madagascar',
  'Mauritius',
  'Seychelles',
]);

const asiaWestIds = getCountryIdsByNames([
  'Armenia',
  'Azerbaijan',
  'Bahrain',
  'Cyprus',
  'Georgia',
  'Iran',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Palestine',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'Turkey',
  'United Arab Emirates',
  'Yemen',
]);

const asiaCentralIds = getCountryIdsByNames([
  'Afghanistan',
  'Kazakhstan',
  'Kyrgyzstan',
  'Tajikistan',
  'Turkmenistan',
  'Uzbekistan',
]);

const asiaSouthIds = getCountryIdsByNames([
  'Bangladesh',
  'Bhutan',
  'India',
  'Maldives',
  'Nepal',
  'Pakistan',
  'Sri Lanka',
]);

const asiaEastIds = getCountryIdsByNames([
  'China',
  'Japan',
  'Mongolia',
  'North Korea',
  'South Korea',
  'Taiwan',
]);

const asiaSoutheastMainlandIds = getCountryIdsByNames([
  'Cambodia',
  'Laos',
  'Myanmar',
  'Thailand',
  'Vietnam',
]);

const asiaSoutheastMaritimeIds = getCountryIdsByNames([
  'Brunei',
  'Indonesia',
  'Malaysia',
  'Philippines',
  'Singapore',
  'Timor-Leste',
]);

export const mapFocusZones: Record<MapFocusZoneId, MapFocusZone> = {
  world: {
    id: 'world',
    parentId: null,
    labelKey: 'world',
    viewport: { center: [0, 20], zoom: 1 },
    countryIds: countries.map((country) => country.id),
  },
  'north-america-overview': {
    id: 'north-america-overview',
    parentId: 'world',
    labelKey: 'north-america-overview',
    viewport: { center: [-100, 38], zoom: 2.1 },
    countryIds: getCountryIdsByContinent('North America'),
  },
  'north-america-caribbean': {
    id: 'north-america-caribbean',
    parentId: 'north-america-overview',
    labelKey: 'north-america-caribbean',
    viewport: { center: [-72, 18], zoom: 4.5 },
    countryIds: northAmericaCaribbeanIds,
    hitAreaCountryIds: northAmericaCaribbeanIds,
  },
  'south-america-overview': {
    id: 'south-america-overview',
    parentId: 'world',
    labelKey: 'south-america-overview',
    viewport: { center: [-60, -15], zoom: 2.45 },
    countryIds: getCountryIdsByContinent('South America'),
  },
  'europe-overview': {
    id: 'europe-overview',
    parentId: 'world',
    labelKey: 'europe-overview',
    viewport: { center: [15, 54], zoom: 4.05 },
    countryIds: getCountryIdsByContinent('Europe'),
    hitAreaCountryIds: getCountryIdsByNames([
      'Andorra',
      'Liechtenstein',
      'Luxembourg',
      'Malta',
      'Monaco',
      'San Marino',
      'Vatican City',
      'Kosovo',
    ]),
  },
  'africa-overview': {
    id: 'africa-overview',
    parentId: 'world',
    labelKey: 'africa-overview',
    viewport: { center: [20, 3], zoom: 2.28 },
    countryIds: getCountryIdsByContinent('Africa'),
  },
  'africa-atlantic-islands': {
    id: 'africa-atlantic-islands',
    parentId: 'africa-overview',
    labelKey: 'africa-atlantic-islands',
    viewport: { center: [-23, 15], zoom: 5.3 },
    countryIds: africaAtlanticIslandIds,
    hitAreaCountryIds: africaAtlanticIslandIds,
  },
  'africa-indian-ocean-islands': {
    id: 'africa-indian-ocean-islands',
    parentId: 'africa-overview',
    labelKey: 'africa-indian-ocean-islands',
    viewport: { center: [52, -18], zoom: 4.4 },
    countryIds: africaIndianOceanIslandIds,
    hitAreaCountryIds: africaIndianOceanIslandIds,
  },
  'asia-overview': {
    id: 'asia-overview',
    parentId: 'world',
    labelKey: 'asia-overview',
    viewport: { center: [92, 30], zoom: 2.05 },
    countryIds: getCountryIdsByContinent('Asia'),
  },
  'asia-west': {
    id: 'asia-west',
    parentId: 'asia-overview',
    labelKey: 'asia-west',
    viewport: { center: [43, 31], zoom: 3.85 },
    countryIds: asiaWestIds,
    hitAreaCountryIds: getCountryIdsByNames([
      'Bahrain',
      'Cyprus',
      'Israel',
      'Jordan',
      'Kuwait',
      'Lebanon',
      'Palestine',
      'Qatar',
      'United Arab Emirates',
    ]),
  },
  'asia-central': {
    id: 'asia-central',
    parentId: 'asia-overview',
    labelKey: 'asia-central',
    viewport: { center: [68, 42], zoom: 3.45 },
    countryIds: asiaCentralIds,
    hitAreaCountryIds: getCountryIdsByNames([
      'Kyrgyzstan',
      'Tajikistan',
    ]),
  },
  'asia-south': {
    id: 'asia-south',
    parentId: 'asia-overview',
    labelKey: 'asia-south',
    viewport: { center: [80, 20], zoom: 4.12 },
    countryIds: asiaSouthIds,
    hitAreaCountryIds: getCountryIdsByNames([
      'Bhutan',
      'Maldives',
      'Nepal',
      'Sri Lanka',
    ]),
  },
  'asia-east': {
    id: 'asia-east',
    parentId: 'asia-overview',
    labelKey: 'asia-east',
    viewport: { center: [118, 36], zoom: 3.8 },
    countryIds: asiaEastIds,
    hitAreaCountryIds: getCountryIdsByNames([
      'Japan',
      'North Korea',
      'South Korea',
      'Taiwan',
    ]),
  },
  'asia-southeast-mainland': {
    id: 'asia-southeast-mainland',
    parentId: 'asia-overview',
    labelKey: 'asia-southeast-mainland',
    viewport: { center: [103, 15], zoom: 4.28 },
    countryIds: asiaSoutheastMainlandIds,
    hitAreaCountryIds: getCountryIdsByNames([
      'Cambodia',
      'Laos',
      'Vietnam',
    ]),
  },
  'asia-southeast-maritime': {
    id: 'asia-southeast-maritime',
    parentId: 'asia-overview',
    labelKey: 'asia-southeast-maritime',
    viewport: { center: [119, 3], zoom: 3.64 },
    countryIds: asiaSoutheastMaritimeIds,
    hitAreaCountryIds: getCountryIdsByNames([
      'Brunei',
      'Malaysia',
      'Philippines',
      'Singapore',
      'Timor-Leste',
    ]),
  },
  'oceania-overview': {
    id: 'oceania-overview',
    parentId: 'world',
    labelKey: 'oceania-overview',
    viewport: { center: [145, -25], zoom: 2.72 },
    countryIds: getCountryIdsByContinent('Oceania'),
    hitAreaCountryIds: getCountryIdsByNames([
      'Fiji',
      'Kiribati',
      'Marshall Islands',
      'Micronesia',
      'Nauru',
      'Palau',
      'Samoa',
      'Solomon Islands',
      'Tonga',
      'Tuvalu',
      'Vanuatu',
    ]),
  },
};

const lookupPriority: MapFocusZoneId[] = [
  'north-america-caribbean',
  'africa-atlantic-islands',
  'africa-indian-ocean-islands',
  'asia-west',
  'asia-central',
  'asia-south',
  'asia-east',
  'asia-southeast-mainland',
  'asia-southeast-maritime',
  'north-america-overview',
  'south-america-overview',
  'europe-overview',
  'africa-overview',
  'asia-overview',
  'oceania-overview',
];

const countryFocusLookup = new Map<string, MapFocusZoneId>();

for (const zoneId of lookupPriority) {
  for (const countryId of mapFocusZones[zoneId].countryIds) {
    if (!countryFocusLookup.has(countryId)) {
      countryFocusLookup.set(countryId, zoneId);
    }
  }
}

const mapCallouts: MapCalloutConfig[] = [
  {
    id: 'north-america-caribbean-callout',
    zoneId: 'north-america-overview',
    targetZoneId: 'north-america-caribbean',
    labelKey: 'north-america-caribbean',
    subject: [-74, 19],
    dx: 86,
    dy: 76,
    countryIds: northAmericaCaribbeanIds,
    width: 148,
    height: 52,
  },
  {
    id: 'africa-atlantic-callout',
    zoneId: 'africa-overview',
    targetZoneId: 'africa-atlantic-islands',
    labelKey: 'africa-atlantic-islands',
    subject: [-22, 15],
    dx: -128,
    dy: -36,
    countryIds: africaAtlanticIslandIds,
    width: 158,
    height: 52,
  },
  {
    id: 'africa-indian-callout',
    zoneId: 'africa-overview',
    targetZoneId: 'africa-indian-ocean-islands',
    labelKey: 'africa-indian-ocean-islands',
    subject: [50, -18],
    dx: 82,
    dy: 56,
    countryIds: africaIndianOceanIslandIds,
    width: 170,
    height: 52,
  },
];

function getRootZoneForFilter(filter: RegionFilter) {
  if (filter.type === 'world') return 'world';
  if (filter.type === 'continent' && filter.value in continentZoneId) {
    return continentZoneId[filter.value as Exclude<Continent, 'Antarctica'>];
  }
  return null;
}

export function getMapFocusZone(zoneId: MapFocusZoneId | null | undefined) {
  if (!zoneId) return null;
  return mapFocusZones[zoneId] ?? null;
}

export function getDefaultFocusZone(filter: RegionFilter) {
  return getRootZoneForFilter(filter);
}

export function getViewportForFocusZone(
  filter: RegionFilter,
  zoneId: MapFocusZoneId | null | undefined,
) {
  if (zoneId && mapFocusZones[zoneId]) {
    return mapFocusZones[zoneId].viewport;
  }

  const rootZoneId = getRootZoneForFilter(filter);
  if (rootZoneId) {
    return mapFocusZones[rootZoneId].viewport;
  }

  if (filter.type === 'ocean') {
    return oceanViewports[filter.value];
  }

  return mapFocusZones.world.viewport;
}

export function resolvePreferredFocus(
  filter: RegionFilter,
  preferredFocusId?: string | null,
  preferredFocusZone?: MapFocusZoneId | null,
) {
  if (preferredFocusZone) return preferredFocusZone;

  const rootZoneId = getRootZoneForFilter(filter);
  if (!preferredFocusId) return rootZoneId;

  const resolvedZoneId = countryFocusLookup.get(preferredFocusId);
  if (!resolvedZoneId) return rootZoneId;

  if (filter.type === 'world') return resolvedZoneId;
  if (filter.type !== 'continent' || !rootZoneId) return rootZoneId;

  const rootZone = mapFocusZones[rootZoneId];
  if (!rootZone.countryIds.includes(preferredFocusId)) return rootZoneId;

  return resolvedZoneId;
}

export function getCalloutsForRegion(
  filter: RegionFilter,
  zoneId: MapFocusZoneId | null | undefined,
) {
  if (filter.type === 'ocean' || !zoneId) return [];
  return mapCallouts.filter((callout) => callout.zoneId === zoneId);
}

export function getFocusZoneBreadcrumbs(zoneId: MapFocusZoneId | null | undefined) {
  if (!zoneId) return [];

  const trail: MapFocusZone[] = [];
  let currentZone: MapFocusZone | undefined = mapFocusZones[zoneId];

  while (currentZone) {
    trail.unshift(currentZone);
    currentZone = currentZone.parentId ? mapFocusZones[currentZone.parentId] : undefined;
  }

  return trail;
}

export function getFocusZoneOptions(
  filter: RegionFilter,
  activeZoneId: MapFocusZoneId | null | undefined,
) {
  if (filter.type === 'ocean') return [];

  const rootZoneId = getRootZoneForFilter(filter);
  if (!rootZoneId) return [];

  if (filter.type === 'world') {
    if (!activeZoneId || activeZoneId === 'world') {
      return continentZonesForWorld.map((zoneId) => mapFocusZones[zoneId]);
    }

    const activeZone = mapFocusZones[activeZoneId];
    if (!activeZone) return continentZonesForWorld.map((zoneId) => mapFocusZones[zoneId]);

    if (activeZone.parentId === 'world') {
      return continentZonesForWorld.map((zoneId) => mapFocusZones[zoneId]);
    }

    const parentZone = activeZone.parentId ? mapFocusZones[activeZone.parentId] : null;
    if (!parentZone) return continentZonesForWorld.map((zoneId) => mapFocusZones[zoneId]);

    return [
      parentZone,
      ...Object.values(mapFocusZones).filter((zone) => zone.parentId === parentZone.id),
    ];
  }

  const rootZone = mapFocusZones[rootZoneId];
  const childZones = Object.values(mapFocusZones).filter((zone) => zone.parentId === rootZoneId);

  if (!childZones.length) return [];

  return [rootZone, ...childZones];
}

export function getHitAreaCountryIds(zoneId: MapFocusZoneId | null | undefined) {
  if (!zoneId) return [];
  return mapFocusZones[zoneId]?.hitAreaCountryIds ?? [];
}

export function getFocusZoneCountryIds(zoneId: MapFocusZoneId | null | undefined) {
  if (!zoneId) return [];
  return mapFocusZones[zoneId]?.countryIds ?? [];
}
