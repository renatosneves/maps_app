import assert from 'node:assert/strict';
import { getCalloutsForRegion, resolvePreferredFocus } from '../src/utils/mapFocus';

assert.equal(
  resolvePreferredFocus({ type: 'continent', value: 'North America' }, '028'),
  'north-america-caribbean',
  'Caribbean countries should resolve into the Caribbean focus zone',
);

assert.equal(
  resolvePreferredFocus({ type: 'continent', value: 'Africa' }, '480'),
  'africa-indian-ocean-islands',
  'Mauritius should resolve into the Indian Ocean islands focus zone',
);

assert.equal(
  resolvePreferredFocus({ type: 'continent', value: 'Asia' }, '702'),
  'asia-southeast-maritime',
  'Singapore should resolve into maritime Southeast Asia',
);

assert.equal(
  resolvePreferredFocus({ type: 'world' }, '826'),
  'europe-overview',
  'United Kingdom should resolve into the Europe overview in world mode',
);

assert.equal(
  resolvePreferredFocus({ type: 'continent', value: 'Asia' }, '356'),
  'asia-south',
  'India should resolve into South Asia',
);

const africaCallouts = getCalloutsForRegion({ type: 'continent', value: 'Africa' }, 'africa-overview');

assert.deepEqual(
  africaCallouts.map((callout) => callout.targetZoneId).sort(),
  ['africa-atlantic-islands', 'africa-indian-ocean-islands'],
  'Africa overview should expose both island callouts',
);

console.log('map focus checks passed');
