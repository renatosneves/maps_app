import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { mountains } from '../../data/mountains';
import { seas } from '../../data/seas';
import { useAppStore } from '../../hooks/useAppStore';
import {
  getContinentLabel,
  getCountryDetail,
  getCountryName,
  getOceanLabel,
  getSeaName,
  getMountainName,
  getMountainRangeLabel,
  ui,
} from '../../i18n';
import type { MapSelection, QuizMode, RegionFilter } from '../../types';
import {
  COUNTRY_ATLAS_URL,
  getCountryByGeoId,
  getCountryMarkerCountries,
} from '../../utils/countryCoverage';

const GEO_URL = COUNTRY_ATLAS_URL;

interface WorldMapProps {
  filter: RegionFilter;
  mode: QuizMode;
  highlightedId: string | null;
  feedbackState: 'none' | 'correct' | 'wrong';
  correctAnswerId: string | null;
  currentItemId?: string;
  guidedHighlightId?: string | null;
  knownIds?: Set<string>;
  showMountains?: boolean;
  selectedFeatureId?: string | null;
  onCountryClick?: (id: string) => void;
  onSeaClick?: (id: string) => void;
  onSelectFeature?: (selection: MapSelection | null) => void;
  showLabels?: boolean;
  fillHeight?: boolean;
}

function getProjectionConfig(filter: RegionFilter) {
  if (filter.type === 'continent') {
    const configs: Record<string, { center: [number, number]; scale: number }> = {
      Africa: { center: [20, 0], scale: 350 },
      Asia: { center: [90, 30], scale: 280 },
      Europe: { center: [15, 54], scale: 600 },
      'North America': { center: [-100, 45], scale: 300 },
      'South America': { center: [-60, -15], scale: 350 },
      Oceania: { center: [145, -25], scale: 400 },
      Antarctica: { center: [0, -85], scale: 250 },
    };
    return configs[filter.value] ?? { center: [0, 20], scale: 150 };
  }

  if (filter.type === 'ocean') {
    const configs: Record<string, { center: [number, number]; scale: number }> = {
      Atlantic: { center: [-30, 10], scale: 180 },
      Pacific: { center: [180, 0], scale: 180 },
      Indian: { center: [75, -15], scale: 250 },
      Arctic: { center: [0, 80], scale: 350 },
      Southern: { center: [0, -70], scale: 250 },
    };
    return configs[filter.value] ?? { center: [0, 20], scale: 150 };
  }

  return { center: [0, 20] as [number, number], scale: 150 };
}

function buildCountrySelection(geoId: string, language: 'sv' | 'en'): MapSelection | null {
  const country = getCountryByGeoId(geoId);
  if (!country) return null;
  return {
    id: country.id,
    name: getCountryName(country, language),
    kind: 'country',
    flag: country.flag,
    detail: getCountryDetail(country, language),
    secondaryDetail: getContinentLabel(country.continent, language),
  };
}

function getCountryFill(
  geoId: string,
  filter: RegionFilter,
  highlightedId: string | null,
  feedbackState: 'none' | 'correct' | 'wrong',
  correctAnswerId: string | null,
  currentItemId: string | undefined,
  mode: QuizMode,
  knownIds?: Set<string>,
  guidedHighlightId?: string | null,
  selectedFeatureId?: string | null,
) {
  if (geoId === correctAnswerId) return '#16a34a';
  if (geoId === highlightedId && feedbackState === 'correct') return '#16a34a';
  if (geoId === highlightedId && feedbackState === 'wrong') return '#ef4444';
  if (selectedFeatureId === geoId) return '#f59e0b';

  if (mode === 'type' && geoId === currentItemId && feedbackState === 'none') {
    return '#2563eb';
  }

  if (mode === 'study') {
    const country = getCountryByGeoId(geoId);
    const inRegion =
      filter.type === 'continent'
        ? country?.continent === filter.value
        : filter.type === 'world';

    if (!inRegion) return '#d7dde8';
    if (geoId === guidedHighlightId) return '#facc15';
    if (knownIds?.has(geoId)) return '#86efac';
    return '#9fc4ff';
  }

  const country = getCountryByGeoId(geoId);
  if (filter.type === 'continent') {
    return country?.continent === filter.value ? '#bfdbfe' : '#d7dde8';
  }

  return '#cfd8e3';
}

function clampZoom(nextZoom: number) {
  return Math.min(2.2, Math.max(1, nextZoom));
}

function isCountryInRegion(geoId: string, filter: RegionFilter) {
  const country = getCountryByGeoId(geoId);
  if (filter.type === 'continent') return country?.continent === filter.value;
  if (filter.type === 'world') return true;
  return false;
}

function WorldMap({
  filter,
  mode,
  highlightedId,
  feedbackState,
  correctAnswerId,
  currentItemId,
  guidedHighlightId,
  knownIds,
  showMountains = false,
  selectedFeatureId,
  onCountryClick,
  onSeaClick,
  onSelectFeature,
  showLabels = false,
  fillHeight = false,
}: WorldMapProps) {
  const { language } = useAppStore();
  const [zoom, setZoom] = useState(1);
  const copy = ui[language];
  const projConfig = useMemo(() => getProjectionConfig(filter), [filter]);

  const filteredSeas = useMemo(() => {
    if (filter.type === 'ocean') return seas.filter((sea) => sea.ocean === filter.value);
    if (filter.type === 'world') return seas;
    return [];
  }, [filter]);

  const filteredMountains = useMemo(() => {
    if (!showMountains) return [];
    if (filter.type === 'continent') return mountains.filter((mountain) => mountain.continent === filter.value);
    return mountains;
  }, [filter, showMountains]);

  return (
    <div className={fillHeight ? 'map-stage map-stage-fill' : 'map-stage'}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.44),transparent)]" />
      <div className="pointer-events-none absolute inset-y-10 right-0 z-[1] w-28 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.14),transparent_72%)]" />

      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 sm:left-5 sm:top-5">
        <button
          type="button"
          onClick={() => setZoom((value) => clampZoom(value + 0.2))}
          className="map-control"
          aria-label={copy.zoomIn}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom((value) => clampZoom(value - 0.2))}
          className="map-control"
          aria-label={copy.zoomOut}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            onSelectFeature?.(null);
          }}
          className="map-control px-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
        >
          {copy.reset}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm backdrop-blur sm:bottom-5 sm:right-5">
        {copy.touchToInspect}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: projConfig.center,
          scale: projConfig.scale * zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        className="h-full w-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => {
            const fallbackCountries = getCountryMarkerCountries(geographies.map((geo) => geo.id)).filter((country) =>
              isCountryInRegion(country.id, filter),
            );

            return (
              <>
                {geographies.map((geo) => {
              const geoId = geo.id;
              const interactive = isCountryInRegion(geoId, filter);
              const fill = getCountryFill(
                geoId,
                filter,
                highlightedId,
                feedbackState,
                correctAnswerId,
                currentItemId,
                mode,
                knownIds,
                guidedHighlightId,
                selectedFeatureId,
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={selectedFeatureId === geoId ? '#0f172a' : '#fff'}
                  strokeWidth={selectedFeatureId === geoId ? 1.2 : 0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                  onClick={() => {
                    if (!interactive) return;
                    onSelectFeature?.(buildCountrySelection(geoId, language));
                    onCountryClick?.(geoId);
                  }}
                />
              );
                })}

                {fallbackCountries.map((country) => {
                  const fill = getCountryFill(
                    country.id,
                    filter,
                    highlightedId,
                    feedbackState,
                    correctAnswerId,
                    currentItemId,
                    mode,
                    knownIds,
                    guidedHighlightId,
                    selectedFeatureId,
                  );
                  const isSelected = selectedFeatureId === country.id;

                  return (
                    <Marker key={country.id} coordinates={country.mapMarkerCoordinates}>
                      <circle
                        r={18}
                        fill="transparent"
                        onClick={() => {
                          onSelectFeature?.(buildCountrySelection(country.id, language));
                          onCountryClick?.(country.id);
                        }}
                      />
                      <circle
                        r={isSelected ? 7 : 5.5}
                        fill={fill}
                        stroke={isSelected ? '#0f172a' : '#fff'}
                        strokeWidth={isSelected ? 1.5 : 1.1}
                        style={{ pointerEvents: 'none' }}
                      />
                      {(showLabels || mode === 'study') && (
                        <text
                          textAnchor="middle"
                          y={-10}
                          style={{
                            fontFamily: 'Manrope, sans-serif',
                            fontSize: 6.5,
                            fill: '#0f172a',
                            fontWeight: 800,
                            pointerEvents: 'none',
                          }}
                        >
                          {getCountryName(country, language)}
                        </text>
                      )}
                    </Marker>
                  );
                })}
              </>
            );
          }}
        </Geographies>

        {filteredSeas.map((sea) => {
          const isSelected = selectedFeatureId === sea.id;
          const isHighlighted = sea.id === highlightedId;
          const isCorrect = sea.id === correctAnswerId;
          const seaColor = isCorrect
            ? '#16a34a'
            : isHighlighted && feedbackState === 'correct'
              ? '#16a34a'
              : isHighlighted && feedbackState === 'wrong'
                ? '#ef4444'
                : isSelected
                  ? '#f59e0b'
                  : '#0ea5e9';

          return (
            <Marker key={sea.id} coordinates={sea.coordinates}>
              <circle
                r={18}
                fill="transparent"
                onClick={() => {
                  onSelectFeature?.({
                    id: sea.id,
                    name: getSeaName(sea, language),
                    kind: 'sea',
                    detail: getOceanLabel(sea.ocean, language),
                    secondaryDetail: copy.marineRegion,
                  });
                  onSeaClick?.(sea.id);
                }}
              />
              <circle
                r={isSelected ? 10 : 8}
                fill={seaColor}
                fillOpacity={0.74}
                stroke="#ffffff"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
              {(showLabels || mode === 'study') && (
                <text
                  textAnchor="middle"
                  y={-14}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 9,
                    fill: '#0f4c81',
                    fontWeight: 700,
                    pointerEvents: 'none',
                  }}
                >
                  {getSeaName(sea, language)}
                </text>
              )}
            </Marker>
          );
        })}

        {filteredMountains.map((mountain) => {
          const id = `mountain:${mountain.name}`;
          const isSelected = selectedFeatureId === id;

          return (
            <Marker key={mountain.name} coordinates={mountain.coordinates}>
              <circle
                r={18}
                fill="transparent"
                onClick={() =>
                  onSelectFeature?.({
                    id,
                    name: getMountainName(mountain.name, language),
                    kind: 'mountain',
                    detail: `${mountain.elevation} · ${getMountainRangeLabel(mountain.range, language)}`,
                    secondaryDetail: getContinentLabel(mountain.continent as 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania' | 'Antarctica', language),
                  })
                }
              />
              <polygon
                points="0,-9 5,2 -5,2"
                fill={isSelected ? '#f59e0b' : '#92400e'}
                stroke="#fff"
                strokeWidth={0.8}
                style={{ pointerEvents: 'none' }}
              />
              <text
                textAnchor="middle"
                y={12}
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 6.5,
                  fill: '#6b3410',
                  fontWeight: 800,
                  pointerEvents: 'none',
                }}
              >
                {getMountainName(mountain.name, language)}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}

export default WorldMap;
