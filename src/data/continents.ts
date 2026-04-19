import type { ContinentConfig, OceanConfig } from '../types';

export const continents: ContinentConfig[] = [
  { name: 'Africa', center: [20, 0], scale: 350, label: 'Africa' },
  { name: 'Asia', center: [90, 30], scale: 280, label: 'Asia' },
  { name: 'Europe', center: [15, 54], scale: 600, label: 'Europe' },
  { name: 'North America', center: [-100, 45], scale: 300, label: 'N. America' },
  { name: 'South America', center: [-60, -15], scale: 350, label: 'S. America' },
  { name: 'Oceania', center: [145, -25], scale: 400, label: 'Oceania' },
  { name: 'Antarctica', center: [0, -85], scale: 250, label: 'Antarctica' },
];

export const oceans: OceanConfig[] = [
  { name: 'Atlantic', center: [-30, 10], scale: 180, label: 'Atlantic' },
  { name: 'Pacific', center: [-170, 0], scale: 180, label: 'Pacific' },
  { name: 'Indian', center: [75, -15], scale: 250, label: 'Indian' },
  { name: 'Arctic', center: [0, 80], scale: 350, label: 'Arctic' },
  { name: 'Southern', center: [0, -70], scale: 250, label: 'Southern' },
];

export const worldConfig = {
  center: [0, 20] as [number, number],
  scale: 150,
};
