import { countryById } from './data/countries';
import { mountains } from './data/mountains';
import { seas } from './data/seas';
import type {
  Country,
  MapFeatureKind,
  MapSelection,
  OceanName,
  PlaygroundBadge,
  PlaygroundUnlock,
  QuizItem,
  RegionFilter,
  SeaRegion,
  StudyItem,
} from './types';

export type Language = 'sv' | 'en';

const continentLabels = {
  en: {
    Africa: 'Africa',
    Asia: 'Asia',
    Europe: 'Europe',
    'North America': 'North America',
    'South America': 'South America',
    Oceania: 'Oceania',
    Antarctica: 'Antarctica',
  },
  sv: {
    Africa: 'Afrika',
    Asia: 'Asien',
    Europe: 'Europa',
    'North America': 'Nordamerika',
    'South America': 'Sydamerika',
    Oceania: 'Oceanien',
    Antarctica: 'Antarktis',
  },
} as const;

const oceanLabels: Record<Language, Record<OceanName, string>> = {
  en: {
    Atlantic: 'Atlantic',
    Pacific: 'Pacific',
    Indian: 'Indian',
    Arctic: 'Arctic',
    Southern: 'Southern',
  },
  sv: {
    Atlantic: 'Atlanten',
    Pacific: 'Stilla havet',
    Indian: 'Indiska oceanen',
    Arctic: 'Norra ishavet',
    Southern: 'Södra oceanen',
  },
};

const seaNamesSv: Record<string, string> = {
  'north-atlantic': 'Nordatlanten',
  'south-atlantic': 'Sydatlanten',
  caribbean: 'Karibiska havet',
  'gulf-of-mexico': 'Mexikanska golfen',
  mediterranean: 'Medelhavet',
  'north-sea': 'Nordsjön',
  baltic: 'Östersjön',
  'black-sea': 'Svarta havet',
  norwegian: 'Norska havet',
  'gulf-of-guinea': 'Guineabukten',
  'north-pacific': 'Norra Stilla havet',
  'south-pacific': 'Södra Stilla havet',
  'south-china': 'Sydkinesiska havet',
  'east-china': 'Östkinesiska havet',
  'sea-of-japan': 'Japanska havet',
  philippine: 'Filippinska havet',
  coral: 'Korallhavet',
  tasman: 'Tasmanska havet',
  bering: 'Berings hav',
  'sea-of-okhotsk': 'Ochotska havet',
  'indian-ocean': 'Indiska oceanen',
  arabian: 'Arabiska havet',
  'bay-of-bengal': 'Bengaliska viken',
  'red-sea': 'Röda havet',
  'persian-gulf': 'Persiska viken',
  'mozambique-channel': 'Moçambiquekanalen',
  'arctic-ocean': 'Norra ishavet',
  barents: 'Barents hav',
  greenland: 'Grönlandshavet',
  beaufort: 'Beauforthavet',
  'southern-ocean': 'Södra oceanen',
  weddell: 'Weddellhavet',
  ross: 'Rosshavet',
};

const mountainNamesSv: Record<string, string> = {
  'Mt. Everest': 'Mount Everest',
  'Mt. Fuji': 'Fuji',
  'Mt. Elbrus': 'Elbrus',
  'Mt. Etna': 'Etna',
  'Mt. Olympus': 'Olympen',
  'Mt. Kilimanjaro': 'Kilimanjaro',
  'Mt. Kenya': 'Kenya',
  'Mt. Logan': 'Mount Logan',
  'Mt. Rainier': 'Mount Rainier',
  'Mt. Cook / Aoraki': 'Aoraki / Mount Cook',
  'Mt. Kosciuszko': 'Mount Kosciuszko',
};

const mountainRangeSv: Record<string, string> = {
  Himalayas: 'Himalaya',
  Karakoram: 'Karakoram',
  'Fuji volcanic zone': 'Fuji vulkaniska zon',
  Caucasus: 'Kaukasus',
  Alps: 'Alperna',
  Sicily: 'Sicilien',
  'Olympus range': 'Olympusmassivet',
  'Eastern Rift': 'Östafrikanska gravsänkan',
  Atlas: 'Atlasbergen',
  'Alaska Range': 'Alaskabergen',
  'St. Elias': 'Saint Elias-bergen',
  Cascades: 'Kaskadbergen',
  'Trans-Mexican': 'Transmexikanska vulkanbältet',
  Andes: 'Anderna',
  'Sudirman Range': 'Sudirmanbergen',
  'Southern Alps': 'Sydalperna',
  'Great Dividing Range': 'Great Dividing Range',
  'Sentinel Range': 'Sentinel Range',
};

const milestoneTier = {
  en: {
    '25': 'Explorer tier',
    '50': 'Navigator tier',
    '75': 'Cartographer tier',
    '100': 'Mastery tier',
  },
  sv: {
    '25': 'Utforskarnivå',
    '50': 'Navigatörsnivå',
    '75': 'Kartografnivå',
    '100': 'Mästar­nivå',
  },
} as const;

function decodeFlag(flag: string) {
  const chars = [...flag];
  if (chars.length !== 2) return null;
  return chars
    .map((char) => {
      const codePoint = char.codePointAt(0);
      if (!codePoint) return null;
      return String.fromCharCode(codePoint - 127397);
    })
    .join('');
}

const displayNameCache = new Map<Language, Intl.DisplayNames | null>();

function getRegionDisplayNames(language: Language) {
  if (!displayNameCache.has(language)) {
    try {
      displayNameCache.set(language, new Intl.DisplayNames([language], { type: 'region' }));
    } catch {
      displayNameCache.set(language, null);
    }
  }

  return displayNameCache.get(language) ?? null;
}

function dedupe(values: Array<string | undefined>) {
  return [...new Set(values.filter(Boolean))] as string[];
}

export const ui = {
  en: {
    language: 'Language',
    swedish: 'Swedish',
    english: 'English',
    back: 'Back',
    home: 'Back home',
    audio: 'Audio',
    music: 'Music',
    soundEffects: 'SFX',
    audioOn: 'Audio on',
    audioOff: 'Audio off',
    audioHintDisabled: 'Audio starts muted. Enable it when you want calm music and feedback cues.',
    audioHintPending: 'Audio is enabled and will resume after your next tap or key press.',
    audioHintActive: 'Calm music and focused feedback cues are active.',
    geoQuizPlayground: 'GeoQuiz',
    heroTitle: 'GeoQuiz',
    heroDescription: 'Learn countries, seas, and mountains on an interactive world map.',
    yourPlayground: 'Your Playground',
    stars: 'Stars',
    badges: 'Badges',
    pickRegion: 'Pick A Region',
    continents: 'Continents',
    oceans: 'Oceans',
    focusedRegionalPractice: 'Focused regional practice',
    seaFocusedGeography: 'Sea-focused geography',
    world: 'World',
    fullAtlasChallenge: 'Full atlas challenge across all countries',
    chooseMode: 'Choose A Mode',
    ready: 'Ready',
    launchSession: 'Launch a session',
    launchDescription: 'The app will open with a split-screen map layout optimized for iPad landscape and large touch targets.',
    openStudy: 'Open Study Playground',
    startSession: 'Start Session',
    studyPlayground: 'Study Playground',
    studyModeTitle: 'Study Playground',
    studyModeDescription: 'Touch-first exploration with stars, badges, and guided tours.',
    clickModeTitle: 'Tap Quiz',
    clickModeDescription: 'Name the place and answer directly on the map with larger touch targets.',
    typeModeTitle: 'Type Challenge',
    typeModeDescription: 'Use the map as context while you type the correct place names.',
    freeExplore: 'Free explore',
    guidedTour: 'Guided tour',
    resetRegionProgress: 'Reset region progress',
    showMountains: 'Show mountains',
    hideMountains: 'Hide mountains',
    progression: 'Progression',
    mastery: 'Mastery',
    known: 'Known',
    next: 'Next',
    left: 'left',
    completeHere: 'Complete here',
    badgeShelf: 'Badge Shelf',
    regionRewards: 'Region rewards',
    earned: 'earned',
    unlockBadgesHint: 'Unlock badges by finishing tours and mastery goals.',
    selectedOnMap: 'Selected On Map',
    quickDetail: 'Quick detail',
    markStillLearning: 'Mark as still learning',
    markKnown: 'Mark as known',
    tapToPinDetails: 'Tap any place on the map to pin its details here.',
    inspectAndMark: 'Tap a country, sea, or mountain to inspect it and mark progress.',
    newStars: 'New stars',
    badgeUnlocked: 'Badge unlocked',
    dismiss: 'Dismiss',
    prev: 'Prev',
    alreadyKnownNext: 'Already known · Next',
    knowThisNext: 'I know this · Next',
    finishTour: 'Finish tour',
    skipAhead: 'Skip ahead',
    quizFloor: 'Quiz Floor',
    tapChallenge: 'Tap Challenge',
    typeChallenge: 'Type Challenge',
    noReveal: 'No answer reveal before first move',
    selectionPinned: 'Touch selection stays pinned for review',
    mapArena: 'Map Arena',
    findByTouch: 'Find it by touch',
    nameByShape: 'Read the shape, then name it',
    noHintMode: 'No hint mode',
    guidedSilhouette: 'Guided silhouette',
    mapSelection: 'Map Selection',
    touchDetails: 'Touch details',
    tapMapToInspect: 'Tap the map to inspect a country or sea while you work. In tap challenge, the target stays hidden until you choose.',
    tapQuiz: 'Tap quiz',
    question: 'Question',
    of: 'of',
    correct: 'correct',
    momentumBuilding: 'Momentum is building.',
    calmAccuracy: 'Clean reads beat rushed guesses.',
    bestStreak: 'Best streak',
    inARow: 'in a row',
    steadyPace: 'Steady pace',
    through: 'through',
    typeTheName: 'Type the name...',
    submit: 'Submit',
    tapTheMap: 'Tap the map',
    typeTheAnswer: 'Type the answer',
    precisionRound: 'Precision round',
    recognitionRound: 'Recognition round',
    selectMatchingPlace: 'Select the matching place directly on the map. Your touch stays pinned so you can verify what you chose.',
    useShapeCue: 'Use the highlighted shape as a cue, then submit the name below.',
    nameHighlighted: 'Name the highlighted',
    correctFeedback: 'Correct. Keep the rhythm going.',
    wrongFeedbackPrefix: 'Not this one. The correct answer is',
    highlightedGreen: '(highlighted in green)',
    seeResults: 'See results',
    nextPrompt: 'Next prompt',
    sessionComplete: 'Session complete',
    perfectMapSense: 'Perfect map sense.',
    perfectTone: 'Everything landed exactly where it should.',
    strongNavigation: 'Strong navigation.',
    strongTone: 'A few places still need another lap.',
    goodProgress: 'Good progress.',
    goodTone: 'You are building solid recognition across the map.',
    keepExploring: 'Keep exploring.',
    keepExploringTone: 'Study Playground is the fastest route to sharper recall.',
    accuracy: 'Accuracy',
    playground: 'Playground',
    badgesEarned: 'badges earned',
    review: 'Review',
    correctAnswers: 'correct answers',
    placesToRevisit: 'places to revisit',
    noMisses: 'No misses this round.',
    touchToInspect: 'Touch to inspect',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset',
    marineRegion: 'Marine region',
    country: 'country',
    sea: 'sea',
    mountain: 'mountain',
    capital: 'Capital',
    partOf: 'Part of the',
    ocean: 'Ocean',
  },
  sv: {
    language: 'Språk',
    swedish: 'Svenska',
    english: 'Engelska',
    back: 'Tillbaka',
    home: 'Till start',
    audio: 'Ljud',
    music: 'Musik',
    soundEffects: 'Ljudeffekter',
    audioOn: 'Ljud på',
    audioOff: 'Ljud av',
    audioHintDisabled: 'Ljudet startar avstängt. Slå på det när du vill ha lugn musik och återkoppling.',
    audioHintPending: 'Ljudet är aktiverat och börjar efter nästa tryck eller tangenttryckning.',
    audioHintActive: 'Lugn musik och fokuserade ljudeffekter är aktiva.',
    geoQuizPlayground: 'GeoQuiz',
    heroTitle: 'GeoQuiz',
    heroDescription: 'Lär dig länder, hav och berg på en interaktiv världskarta.',
    yourPlayground: 'Din spelplan',
    stars: 'Stjärnor',
    badges: 'Märken',
    pickRegion: 'Välj region',
    continents: 'Kontinenter',
    oceans: 'Oceaner',
    focusedRegionalPractice: 'Fokuserad träning för regionen',
    seaFocusedGeography: 'Havsorienterad geografi',
    world: 'Världen',
    fullAtlasChallenge: 'Hela atlasutmaningen över alla länder',
    chooseMode: 'Välj läge',
    ready: 'Redo',
    launchSession: 'Starta en session',
    launchDescription: 'Appen öppnas med en delad kartlayout som är optimerad för iPad i liggande läge och stora touchytor.',
    openStudy: 'Öppna studieläget',
    startSession: 'Starta session',
    studyPlayground: 'Studieläge',
    studyModeTitle: 'Studieläge',
    studyModeDescription: 'Touch-först-utforskning med stjärnor, märken och guidade turer.',
    clickModeTitle: 'Tryckquiz',
    clickModeDescription: 'Se platsnamnet och svara direkt på kartan med större touchytor.',
    typeModeTitle: 'Skrivutmaning',
    typeModeDescription: 'Använd kartan som stöd medan du skriver rätt platsnamn.',
    freeExplore: 'Fri utforskning',
    guidedTour: 'Guidad tur',
    resetRegionProgress: 'Nollställ regionens framsteg',
    showMountains: 'Visa berg',
    hideMountains: 'Dölj berg',
    progression: 'Framsteg',
    mastery: 'Behärskning',
    known: 'Kända',
    next: 'Nästa',
    left: 'kvar',
    completeHere: 'Klar här',
    badgeShelf: 'Märkeshylla',
    regionRewards: 'Belöningar för regionen',
    earned: 'intjänade',
    unlockBadgesHint: 'Lås upp märken genom att slutföra turer och behärskningsmål.',
    selectedOnMap: 'Valt på kartan',
    quickDetail: 'Snabbinfo',
    markStillLearning: 'Markera som övar fortfarande',
    markKnown: 'Markera som känd',
    tapToPinDetails: 'Tryck på en plats på kartan för att fästa detaljerna här.',
    inspectAndMark: 'Tryck på ett land, hav eller berg för att granska det och markera framsteg.',
    newStars: 'Nya stjärnor',
    badgeUnlocked: 'Märke upplåst',
    dismiss: 'Stäng',
    prev: 'Föregående',
    alreadyKnownNext: 'Redan känd · Nästa',
    knowThisNext: 'Jag kan den här · Nästa',
    finishTour: 'Avsluta turen',
    skipAhead: 'Hoppa vidare',
    quizFloor: 'Quizläge',
    tapChallenge: 'Tryckutmaning',
    typeChallenge: 'Skrivutmaning',
    noReveal: 'Inget svar visas innan första valet',
    selectionPinned: 'Valet ligger kvar för granskning',
    mapArena: 'Kartyta',
    findByTouch: 'Hitta den med touch',
    nameByShape: 'Läs formen och namnge den',
    noHintMode: 'Utan ledtråd',
    guidedSilhouette: 'Markerad silhuett',
    mapSelection: 'Kartval',
    touchDetails: 'Detaljer vid tryck',
    tapMapToInspect: 'Tryck på kartan för att granska ett land eller hav medan du jobbar. I tryckutmaningen hålls målet dolt tills du väljer.',
    tapQuiz: 'Tryckquiz',
    question: 'Fråga',
    of: 'av',
    correct: 'rätt',
    momentumBuilding: 'Du bygger upp flyt.',
    calmAccuracy: 'Lugna avläsningar slår stressade gissningar.',
    bestStreak: 'Bästa svit',
    inARow: 'i rad',
    steadyPace: 'Jämn takt',
    through: 'klart',
    typeTheName: 'Skriv namnet...',
    submit: 'Skicka',
    tapTheMap: 'Tryck på kartan',
    typeTheAnswer: 'Skriv svaret',
    precisionRound: 'Precisionsrunda',
    recognitionRound: 'Igenkänningsrunda',
    selectMatchingPlace: 'Välj rätt plats direkt på kartan. Ditt tryck ligger kvar så att du kan kontrollera vad du valde.',
    useShapeCue: 'Använd den markerade formen som ledtråd och skriv sedan namnet nedan.',
    nameHighlighted: 'Namnge den markerade',
    correctFeedback: 'Rätt. Fortsätt i samma rytm.',
    wrongFeedbackPrefix: 'Inte den här. Rätt svar är',
    highlightedGreen: '(markerat i grönt)',
    seeResults: 'Se resultat',
    nextPrompt: 'Nästa fråga',
    sessionComplete: 'Session klar',
    perfectMapSense: 'Perfekt kartkänsla.',
    perfectTone: 'Allt satt exakt där det skulle.',
    strongNavigation: 'Stark navigering.',
    strongTone: 'Några platser behöver ett varv till.',
    goodProgress: 'Bra framsteg.',
    goodTone: 'Du bygger upp en stadig igenkänning över kartan.',
    keepExploring: 'Fortsätt utforska.',
    keepExploringTone: 'Studieläget är snabbaste vägen till skarpare minne.',
    accuracy: 'Träffsäkerhet',
    playground: 'Spelplan',
    badgesEarned: 'märken intjänade',
    review: 'Repetera',
    correctAnswers: 'rätta svar',
    placesToRevisit: 'platser att återvända till',
    noMisses: 'Inga missar den här rundan.',
    touchToInspect: 'Tryck för att granska',
    zoomIn: 'Zooma in',
    zoomOut: 'Zooma ut',
    reset: 'Återställ',
    marineRegion: 'Havsområde',
    country: 'land',
    sea: 'hav',
    mountain: 'berg',
    capital: 'Huvudstad',
    partOf: 'Del av',
    ocean: 'oceanen',
  },
} as const;

export function getContinentLabel(continent: keyof typeof continentLabels.en, language: Language) {
  return continentLabels[language][continent];
}

export function getOceanLabel(ocean: OceanName, language: Language) {
  return oceanLabels[language][ocean];
}

export function getRegionLabel(filter: RegionFilter, language: Language) {
  if (filter.type === 'world') return ui[language].world;
  if (filter.type === 'continent') return getContinentLabel(filter.value, language);
  return getOceanLabel(filter.value, language);
}

export function getRegionLabelFromKey(regionKey: string, language: Language) {
  if (regionKey === 'world') return ui[language].world;
  const [type, value] = regionKey.split(':');
  if (type === 'continent') return getContinentLabel(value as keyof typeof continentLabels.en, language);
  if (type === 'ocean') return getOceanLabel(value as OceanName, language);
  return regionKey;
}

export function getCountryName(country: Country, language: Language) {
  if (language === 'en') return country.name;

  const alpha2 = decodeFlag(country.flag);
  const displayNames = getRegionDisplayNames(language);
  return (alpha2 && displayNames?.of(alpha2)) ?? country.name;
}

export function getCountryAliases(country: Country, language: Language) {
  return dedupe([
    country.name,
    getCountryName(country, language),
    ...(country.aliases ?? []),
  ]);
}

export function getSeaName(sea: SeaRegion, language: Language) {
  if (language === 'en') return sea.name;
  return seaNamesSv[sea.id] ?? sea.name;
}

export function getMountainName(name: string, language: Language) {
  if (language === 'en') return name;
  return mountainNamesSv[name] ?? name;
}

export function getMountainRangeLabel(range: string, language: Language) {
  if (language === 'en') return range;
  return mountainRangeSv[range] ?? range;
}

export function getMapKindLabel(kind: MapFeatureKind, language: Language) {
  return ui[language][kind];
}

export function getCountryDetail(country: Country, language: Language, includeContinent = false) {
  const capitalPart = `${ui[language].capital}: ${country.capital}`;
  if (!includeContinent) return capitalPart;
  return `${capitalPart} · ${getContinentLabel(country.continent, language)}`;
}

export function getSeaDetail(sea: SeaRegion, language: Language) {
  if (language === 'sv') {
    return `${ui.sv.partOf} ${getOceanLabel(sea.ocean, 'sv')}`;
  }
  return `${ui.en.partOf} ${getOceanLabel(sea.ocean, 'en')} ${ui.en.ocean}`;
}

export function getLocalizedQuizItem(item: QuizItem, language: Language) {
  if (item.type === 'country') {
    const country = countryById.get(item.id);
    if (!country) return item;
    return {
      ...item,
      name: getCountryName(country, language),
      aliases: getCountryAliases(country, language),
    };
  }

  const sea = seas.find((entry) => entry.id === item.id);
  if (!sea) return item;

  return {
    ...item,
    name: getSeaName(sea, language),
    aliases: dedupe([sea.name, getSeaName(sea, language), ...(sea.aliases ?? [])]),
  };
}

export function getLocalizedStudyItem(item: StudyItem, language: Language) {
  if (item.type === 'country') {
    const country = countryById.get(item.id);
    if (!country) return item;
    return {
      ...item,
      name: getCountryName(country, language),
      detail: getCountryDetail(country, language),
    };
  }

  const sea = seas.find((entry) => entry.id === item.id);
  if (!sea) return item;
  return {
    ...item,
    name: getSeaName(sea, language),
    detail: getSeaDetail(sea, language),
  };
}

export function getLocalizedMapSelection(selection: MapSelection, language: Language) {
  if (selection.kind === 'country') {
    const country = countryById.get(selection.id);
    if (!country) return selection;
    return {
      ...selection,
      name: getCountryName(country, language),
      detail: getCountryDetail(country, language),
      secondaryDetail: getContinentLabel(country.continent, language),
    };
  }

  if (selection.kind === 'sea') {
    const sea = seas.find((entry) => entry.id === selection.id);
    if (!sea) return selection;
    return {
      ...selection,
      name: getSeaName(sea, language),
      detail: getOceanLabel(sea.ocean, language),
      secondaryDetail: ui[language].marineRegion,
    };
  }

  const mountain = mountains.find((entry) => `mountain:${entry.name}` === selection.id);
  if (!mountain) return selection;
  return {
    ...selection,
    name: getMountainName(mountain.name, language),
    detail: `${mountain.elevation} · ${getMountainRangeLabel(mountain.range, language)}`,
    secondaryDetail: getContinentLabel(mountain.continent as keyof typeof continentLabels.en, language),
  };
}

export function getLocalizedBadge(badge: PlaygroundBadge, language: Language) {
  const regionLabel = getRegionLabelFromKey(badge.regionKey, language);

  if (badge.id.startsWith('badge:mastery:')) {
    return language === 'sv'
      ? {
          title: `Mästare i ${regionLabel}`,
          description: `Du har lärt dig alla objekt i ${regionLabel}.`,
        }
      : {
          title: `${regionLabel} Master`,
          description: `Learned every item in ${regionLabel}.`,
        };
  }

  if (badge.id.startsWith('badge:guided:')) {
    return language === 'sv'
      ? {
          title: `${regionLabel} tur klar`,
          description: `Du avslutade den guidade turen för ${regionLabel}.`,
        }
      : {
          title: `${regionLabel} Tour Complete`,
          description: `Finished the guided tour for ${regionLabel}.`,
        };
  }

  return {
    title: badge.title,
    description: badge.description,
  };
}

export function getLocalizedUnlock(unlock: PlaygroundUnlock, language: Language) {
  if (unlock.id.startsWith('star:guided:')) {
    const regionKey = unlock.id.slice('star:guided:'.length);
    const regionLabel = getRegionLabelFromKey(regionKey, language);
    return language === 'sv'
      ? {
          title: `+${unlock.amount ?? 2} stjärnor`,
          description: `Du slutförde den guidade turen för ${regionLabel}.`,
        }
      : {
          title: `+${unlock.amount ?? 2} stars`,
          description: `Completed the guided tour for ${regionLabel}`,
        };
  }

  if (unlock.id.startsWith('star:')) {
    const payload = unlock.id.slice('star:'.length);
    const lastColon = payload.lastIndexOf(':');
    if (lastColon !== -1) {
      const regionKey = payload.slice(0, lastColon);
      const milestoneId = payload.slice(lastColon + 1) as keyof typeof milestoneTier.en;
      const regionLabel = getRegionLabelFromKey(regionKey, language);
      return language === 'sv'
        ? {
            title: `+${unlock.amount ?? 0} stjärnor`,
            description: `${milestoneTier.sv[milestoneId] ?? unlock.description} nådd i ${regionLabel}`,
          }
        : {
            title: `+${unlock.amount ?? 0} stars`,
            description: `${milestoneTier.en[milestoneId] ?? unlock.description} reached in ${regionLabel}`,
          };
    }
  }

  if (unlock.id.startsWith('unlock:badge:')) {
    const badgeId = unlock.id.slice('unlock:'.length);
    const parts = badgeId.split(':');
    const regionKey = parts.slice(2).join(':');
    const localizedBadge = getLocalizedBadge(
      {
        id: badgeId,
        regionKey,
        title: unlock.title,
        description: unlock.description,
        earnedAt: unlock.earnedAt,
      },
      language,
    );
    return localizedBadge;
  }

  return {
    title: unlock.title,
    description: unlock.description,
  };
}
