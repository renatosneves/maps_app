export interface Mountain {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  elevation: string;
  range: string;
  continent: string;
}

export const mountains: Mountain[] = [
  // ─── Asia ─────────────────────────────────────────────
  { name: 'Mt. Everest', coordinates: [86.925, 27.988], elevation: '8,849m', range: 'Himalayas', continent: 'Asia' },
  { name: 'K2', coordinates: [76.513, 35.881], elevation: '8,611m', range: 'Karakoram', continent: 'Asia' },
  { name: 'Kangchenjunga', coordinates: [88.148, 27.703], elevation: '8,586m', range: 'Himalayas', continent: 'Asia' },
  { name: 'Mt. Fuji', coordinates: [138.727, 35.361], elevation: '3,776m', range: 'Fuji volcanic zone', continent: 'Asia' },
  { name: 'Mt. Elbrus', coordinates: [42.439, 43.355], elevation: '5,642m', range: 'Caucasus', continent: 'Europe' },

  // ─── Europe ───────────────────────────────────────────
  { name: 'Mont Blanc', coordinates: [6.865, 45.833], elevation: '4,808m', range: 'Alps', continent: 'Europe' },
  { name: 'Matterhorn', coordinates: [7.659, 45.977], elevation: '4,478m', range: 'Alps', continent: 'Europe' },
  { name: 'Mt. Etna', coordinates: [14.993, 37.751], elevation: '3,357m', range: 'Sicily', continent: 'Europe' },
  { name: 'Mt. Olympus', coordinates: [22.350, 40.086], elevation: '2,917m', range: 'Olympus range', continent: 'Europe' },

  // ─── Africa ───────────────────────────────────────────
  { name: 'Mt. Kilimanjaro', coordinates: [37.354, -3.076], elevation: '5,895m', range: 'Eastern Rift', continent: 'Africa' },
  { name: 'Mt. Kenya', coordinates: [37.306, -0.152], elevation: '5,199m', range: 'Eastern Rift', continent: 'Africa' },
  { name: 'Atlas Mountains', coordinates: [-5.0, 32.0], elevation: '4,167m', range: 'Atlas', continent: 'Africa' },

  // ─── North America ────────────────────────────────────
  { name: 'Denali', coordinates: [-151.007, 63.069], elevation: '6,190m', range: 'Alaska Range', continent: 'North America' },
  { name: 'Mt. Logan', coordinates: [-140.406, 60.567], elevation: '5,959m', range: 'St. Elias', continent: 'North America' },
  { name: 'Mt. Rainier', coordinates: [-121.760, 46.853], elevation: '4,392m', range: 'Cascades', continent: 'North America' },
  { name: 'Pico de Orizaba', coordinates: [-97.268, 19.030], elevation: '5,636m', range: 'Trans-Mexican', continent: 'North America' },

  // ─── South America ────────────────────────────────────
  { name: 'Aconcagua', coordinates: [-70.011, -32.653], elevation: '6,961m', range: 'Andes', continent: 'South America' },
  { name: 'Ojos del Salado', coordinates: [-68.542, -27.109], elevation: '6,893m', range: 'Andes', continent: 'South America' },
  { name: 'Chimborazo', coordinates: [-78.815, -1.469], elevation: '6,263m', range: 'Andes', continent: 'South America' },
  { name: 'Cotopaxi', coordinates: [-78.437, -0.684], elevation: '5,897m', range: 'Andes', continent: 'South America' },

  // ─── Oceania ──────────────────────────────────────────
  { name: 'Puncak Jaya', coordinates: [137.158, -4.078], elevation: '4,884m', range: 'Sudirman Range', continent: 'Oceania' },
  { name: 'Mt. Cook / Aoraki', coordinates: [170.141, -43.595], elevation: '3,724m', range: 'Southern Alps', continent: 'Oceania' },
  { name: 'Mt. Kosciuszko', coordinates: [148.263, -36.456], elevation: '2,228m', range: 'Great Dividing Range', continent: 'Oceania' },

  // ─── Antarctica ───────────────────────────────────────
  { name: 'Vinson Massif', coordinates: [-85.617, -78.526], elevation: '4,892m', range: 'Sentinel Range', continent: 'Antarctica' },
];

export const mountainsByContinent = (continent: string) =>
  mountains.filter((m) => m.continent === continent);
