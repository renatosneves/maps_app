import type { SeaRegion } from '../types';

export const seas: SeaRegion[] = [
  // ─── Atlantic Ocean ───────────────────────────────────
  { id: 'north-atlantic', name: 'North Atlantic Ocean', ocean: 'Atlantic', coordinates: [-40, 35] },
  { id: 'south-atlantic', name: 'South Atlantic Ocean', ocean: 'Atlantic', coordinates: [-20, -20] },
  { id: 'caribbean', name: 'Caribbean Sea', ocean: 'Atlantic', coordinates: [-75, 15] },
  { id: 'gulf-of-mexico', name: 'Gulf of Mexico', ocean: 'Atlantic', coordinates: [-90, 25] },
  { id: 'mediterranean', name: 'Mediterranean Sea', ocean: 'Atlantic', coordinates: [18, 35] },
  { id: 'north-sea', name: 'North Sea', ocean: 'Atlantic', coordinates: [3, 57] },
  { id: 'baltic', name: 'Baltic Sea', ocean: 'Atlantic', coordinates: [20, 58] },
  { id: 'black-sea', name: 'Black Sea', ocean: 'Atlantic', coordinates: [35, 43] },
  { id: 'norwegian', name: 'Norwegian Sea', ocean: 'Atlantic', coordinates: [2, 67] },
  { id: 'gulf-of-guinea', name: 'Gulf of Guinea', ocean: 'Atlantic', coordinates: [2, 2] },

  // ─── Pacific Ocean ────────────────────────────────────
  { id: 'north-pacific', name: 'North Pacific Ocean', ocean: 'Pacific', coordinates: [-170, 30] },
  { id: 'south-pacific', name: 'South Pacific Ocean', ocean: 'Pacific', coordinates: [-150, -25] },
  { id: 'south-china', name: 'South China Sea', ocean: 'Pacific', coordinates: [115, 12] },
  { id: 'east-china', name: 'East China Sea', ocean: 'Pacific', coordinates: [125, 28] },
  { id: 'sea-of-japan', name: 'Sea of Japan', ocean: 'Pacific', coordinates: [135, 40] },
  { id: 'philippine', name: 'Philippine Sea', ocean: 'Pacific', coordinates: [135, 18] },
  { id: 'coral', name: 'Coral Sea', ocean: 'Pacific', coordinates: [155, -18] },
  { id: 'tasman', name: 'Tasman Sea', ocean: 'Pacific', coordinates: [162, -35] },
  { id: 'bering', name: 'Bering Sea', ocean: 'Pacific', coordinates: [-175, 58] },
  { id: 'sea-of-okhotsk', name: 'Sea of Okhotsk', ocean: 'Pacific', coordinates: [150, 55] },

  // ─── Indian Ocean ─────────────────────────────────────
  { id: 'indian-ocean', name: 'Indian Ocean', ocean: 'Indian', coordinates: [75, -15] },
  { id: 'arabian', name: 'Arabian Sea', ocean: 'Indian', coordinates: [65, 15] },
  { id: 'bay-of-bengal', name: 'Bay of Bengal', ocean: 'Indian', coordinates: [88, 13] },
  { id: 'red-sea', name: 'Red Sea', ocean: 'Indian', coordinates: [38, 20] },
  { id: 'persian-gulf', name: 'Persian Gulf', ocean: 'Indian', coordinates: [51, 27], aliases: ['Arabian Gulf'] },
  { id: 'mozambique-channel', name: 'Mozambique Channel', ocean: 'Indian', coordinates: [42, -18] },

  // ─── Arctic Ocean ─────────────────────────────────────
  { id: 'arctic-ocean', name: 'Arctic Ocean', ocean: 'Arctic', coordinates: [0, 85] },
  { id: 'barents', name: 'Barents Sea', ocean: 'Arctic', coordinates: [40, 75] },
  { id: 'greenland', name: 'Greenland Sea', ocean: 'Arctic', coordinates: [-10, 75] },
  { id: 'beaufort', name: 'Beaufort Sea', ocean: 'Arctic', coordinates: [-140, 72] },

  // ─── Southern Ocean ───────────────────────────────────
  { id: 'southern-ocean', name: 'Southern Ocean', ocean: 'Southern', coordinates: [0, -65] },
  { id: 'weddell', name: 'Weddell Sea', ocean: 'Southern', coordinates: [-45, -72] },
  { id: 'ross', name: 'Ross Sea', ocean: 'Southern', coordinates: [175, -75] },
];

export const seasByOcean = (ocean: string) =>
  seas.filter((s) => s.ocean === ocean);
