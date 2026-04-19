import { useMemo, useState } from 'react';
import { geoCentroid } from 'd3-geo';
import {
  Annotation,
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  Sphere,
} from 'react-simple-maps';
import { mountains } from '../../data/mountains';
import { seas } from '../../data/seas';
import { useAppStore } from '../../hooks/useAppStore';
import {
  getContinentLabel,
  getCountryDetail,
  getCountryName,
  getFocusZoneLabel,
  getOceanLabel,
  getMountainName,
  getMountainRangeLabel,
  getSeaName,
  ui,
} from '../../i18n';
import type {
  MapCalloutConfig,
  MapFocusZoneId,
  MapSelection,
  QuizMode,
  RegionFilter,
  Country,
} from '../../types';
import {
  COUNTRY_ATLAS_URL,
  getCountryByGeoId,
  getCountryMarkerCountries,
  isMarkerOnlyCountry,
} from '../../utils/countryCoverage';
import {
  getCalloutsForRegion,
  getDefaultFocusZone,
  getFocusZoneBreadcrumbs,
  getFocusZoneOptions,
  getHitAreaCountryIds,
  getViewportForFocusZone,
  resolvePreferredFocus,
} from '../../utils/mapFocus';

const GEO_URL = COUNTRY_ATLAS_URL;
const BASE_PROJECTION_SCALE = 160;

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
  preferredFocusId?: string | null;
  preferredFocusZone?: MapFocusZoneId | null;
  onCountryClick?: (id: string) => void;
  onSeaClick?: (id: string) => void;
  onSelectFeature?: (selection: MapSelection | null) => void;
  onFocusZoneChange?: (zone: MapFocusZoneId | null) => void;
  showLabels?: boolean;
  fillHeight?: boolean;
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
  if (geoId === correctAnswerId) return '#15803d';
  if (geoId === highlightedId && feedbackState === 'correct') return '#15803d';
  if (geoId === highlightedId && feedbackState === 'wrong') return '#dc2626';
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

    if (!inRegion) return 'rgba(255,255,255,0.14)';
    if (geoId === guidedHighlightId) return '#f7c948';
    if (knownIds?.has(geoId)) return '#4fa274';
    return '#5d84bf';
  }

  const country = getCountryByGeoId(geoId);
  if (filter.type === 'continent') {
    return country?.continent === filter.value ? '#6a8fc6' : 'rgba(255,255,255,0.12)';
  }

  return '#c8d3e0';
}

function isCountryInRegion(geoId: string, filter: RegionFilter) {
  const country = getCountryByGeoId(geoId);
  if (filter.type === 'continent') return country?.continent === filter.value;
  if (filter.type === 'world') return true;
  return false;
}

function getCalloutBoxLayout(callout: MapCalloutConfig) {
  const width = callout.width ?? 150;
  const height = callout.height ?? 54;
  return {
    width,
    height,
    x: callout.dx < 0 ? -width : 0,
    y: callout.dy < 0 ? -height : 0,
  };
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
  preferredFocusId,
  preferredFocusZone,
  onCountryClick,
  onSeaClick,
  onSelectFeature,
  onFocusZoneChange,
  showLabels = false,
  fillHeight = false,
}: WorldMapProps) {
  const { language } = useAppStore();
  const copy = ui[language];
  const rootFocusZoneId = useMemo(() => getDefaultFocusZone(filter), [filter]);
  const resolvedFocusZoneId = useMemo(
    () => resolvePreferredFocus(filter, preferredFocusId, preferredFocusZone),
    [filter, preferredFocusId, preferredFocusZone],
  );
  const [atlasView, setAtlasView] = useState(() => ({
    focusZoneId: resolvedFocusZoneId,
    viewport: getViewportForFocusZone(filter, resolvedFocusZoneId),
  }));
  const { focusZoneId, viewport } = atlasView;

  const focusBreadcrumbs = useMemo(() => getFocusZoneBreadcrumbs(focusZoneId), [focusZoneId]);
  const focusOptions = useMemo(
    () => getFocusZoneOptions(filter, focusZoneId),
    [filter, focusZoneId],
  );
  const activeCallouts = useMemo(
    () => getCalloutsForRegion(filter, focusZoneId),
    [filter, focusZoneId],
  );
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
  const hitAreaCountryIds = useMemo(() => getHitAreaCountryIds(focusZoneId), [focusZoneId]);
  const fallbackCountries = useMemo(
    () =>
      getCountryMarkerCountries().filter(
        (country) => isCountryInRegion(country.id, filter) && !hitAreaCountryIds.includes(country.id),
      ),
    [filter, hitAreaCountryIds],
  );
  const focusTargetCountries = useMemo(
    () =>
      hitAreaCountryIds
        .map((id) => getCountryByGeoId(id))
        .filter((country): country is Country => Boolean(country)),
    [hitAreaCountryIds],
  );

  const handleFocusZoneChange = (nextZoneId: MapFocusZoneId | null) => {
    setAtlasView({
      focusZoneId: nextZoneId,
      viewport: getViewportForFocusZone(filter, nextZoneId),
    });
    onFocusZoneChange?.(nextZoneId);
  };

  const resetMapView = () => {
    const nextZoneId = resolvedFocusZoneId ?? rootFocusZoneId;
    handleFocusZoneChange(nextZoneId);
    onSelectFeature?.(null);
  };

  const showFocusNavigation = focusOptions.length > 0 || focusBreadcrumbs.length > 1;

  return (
    <div className={fillHeight ? 'map-stage map-stage-fill atlas-stage atlas-stage-layout' : 'map-stage atlas-stage atlas-stage-layout'}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-[linear-gradient(180deg,rgba(255,252,245,0.9),transparent)]" />
      <div className="atlas-map-toolbar">
        <div className="atlas-map-toolbar-actions">
          <button
            type="button"
            onClick={() =>
              setAtlasView((current) => ({
                ...current,
                viewport: {
                  ...viewport,
                  zoom: Math.min(6.2, viewport.zoom + 0.26),
                },
              }))}
            className="map-control"
            aria-label={copy.zoomIn}
          >
            +
          </button>
          <button
            type="button"
            onClick={() =>
              setAtlasView((current) => ({
                ...current,
                viewport: {
                  ...viewport,
                  zoom: Math.max(1, viewport.zoom - 0.26),
                },
              }))}
            className="map-control"
            aria-label={copy.zoomOut}
          >
            −
          </button>
          <button
            type="button"
            onClick={resetMapView}
            className="map-control px-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
          >
            {copy.reset}
          </button>
        </div>

        <div className="atlas-map-toolbar-copy">
          {showFocusNavigation && (
            <div className="atlas-chip-row flex items-center gap-2">
              <span className="section-label">{copy.currentFocus}</span>
              {focusBreadcrumbs.map((zone, index) => {
                const isLast = index === focusBreadcrumbs.length - 1;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleFocusZoneChange(zone.id)}
                    className={isLast ? 'atlas-chip atlas-chip-active' : 'atlas-chip atlas-chip-muted'}
                  >
                    {getFocusZoneLabel(zone.id, language)}
                  </button>
                );
              })}
            </div>
          )}

          {focusOptions.length > 0 && (
            <div className="atlas-chip-row atlas-chip-scroll mt-2">
              {focusOptions.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleFocusZoneChange(zone.id)}
                  className={zone.id === focusZoneId ? 'atlas-chip atlas-chip-active' : 'atlas-chip atlas-chip-idle'}
                >
                  {getFocusZoneLabel(zone.id, language)}
                </button>
              ))}
            </div>
          )}

          <p className="mt-2 text-sm text-slate-600">{copy.atlasHint}</p>
          {mode === 'study' && focusTargetCountries.length > 0 && (
            <div className="atlas-chip-row atlas-chip-scroll mt-3">
              {focusTargetCountries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => onSelectFeature?.(buildCountrySelection(country.id, language))}
                  className="atlas-chip atlas-chip-idle"
                >
                  {getCountryName(country, language)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="atlas-map-canvas">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: viewport.center,
            scale: BASE_PROJECTION_SCALE * viewport.zoom,
          }}
          style={{ width: '100%', height: '100%' }}
          className="h-full w-full"
        >
          <Sphere id="atlas-sphere" fill="#d7e3f2" stroke="rgba(15,23,42,0.16)" strokeWidth={0.85} />
          <Graticule stroke="rgba(15,23,42,0.12)" strokeWidth={0.4} />
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              const centroids = new Map<string, [number, number]>();

              geographies.forEach((geo) => {
                try {
                  const [longitude, latitude] = geoCentroid(geo) as [number, number];
                  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
                    centroids.set(String(geo.id), [longitude, latitude]);
                  }
                } catch {
                  // Ignore centroid failures for degenerate shapes.
                }
              });

              return (
                <>
                  {geographies.map((geo) => {
                    const geoId = String(geo.id);
                    if (isMarkerOnlyCountry(geoId)) return null;
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
                        data-geo-id={geoId}
                        fill={fill}
                        stroke={
                          selectedFeatureId === geoId
                            ? '#0f172a'
                            : interactive
                              ? 'rgba(15,23,42,0.34)'
                              : 'rgba(255,255,255,0.06)'
                        }
                        strokeWidth={selectedFeatureId === geoId ? 1.1 : interactive ? 0.42 : 0.24}
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

                  {hitAreaCountryIds.map((countryId) => {
                    const coordinates =
                      centroids.get(countryId)
                      ?? getCountryByGeoId(countryId)?.mapMarkerCoordinates;

                    if (!coordinates) return null;

                    const fill = getCountryFill(
                      countryId,
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
                    const isSelected = selectedFeatureId === countryId;

                    return (
                      <Marker key={`hit:${countryId}`} coordinates={coordinates}>
                        <circle
                          r={15}
                          fill="transparent"
                          onClick={() => {
                            onSelectFeature?.(buildCountrySelection(countryId, language));
                            onCountryClick?.(countryId);
                          }}
                        />
                        <circle
                          r={isSelected ? 5.8 : 4.6}
                          fill={fill}
                          fillOpacity={mode === 'study' ? 0.96 : 0.88}
                          stroke="#0f172a"
                          strokeOpacity={mode === 'study' ? 0.24 : 0.12}
                          strokeWidth={isSelected ? 1.5 : 0.7}
                          style={{ pointerEvents: 'none' }}
                        />
                      </Marker>
                    );
                  })}
                </>
              );
            }}
          </Geographies>

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
                  r={16}
                  fill="transparent"
                  onClick={() => {
                    onSelectFeature?.(buildCountrySelection(country.id, language));
                    onCountryClick?.(country.id);
                  }}
                />
                <circle
                  r={isSelected ? 7 : 5.6}
                  fill={fill}
                  stroke={isSelected ? '#0f172a' : '#ffffff'}
                  strokeWidth={isSelected ? 1.4 : 1}
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

          {filteredSeas.map((sea) => {
            const isSelected = selectedFeatureId === sea.id;
            const isHighlighted = sea.id === highlightedId;
            const isCorrect = sea.id === correctAnswerId;
            const seaColor = isCorrect
              ? '#15803d'
              : isHighlighted && feedbackState === 'correct'
                ? '#15803d'
                : isHighlighted && feedbackState === 'wrong'
                  ? '#dc2626'
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
                      secondaryDetail: getContinentLabel(
                        mountain.continent as 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania' | 'Antarctica',
                        language,
                      ),
                    })}
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

          {activeCallouts.map((callout) => {
            const layout = getCalloutBoxLayout(callout);

            return (
              <Annotation
                key={callout.id}
                subject={callout.subject}
                dx={callout.dx}
                dy={callout.dy}
                connectorProps={{
                  stroke: 'rgba(15,23,42,0.22)',
                  strokeWidth: 1.4,
                  strokeDasharray: '4 6',
                }}
              >
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={getFocusZoneLabel(callout.targetZoneId, language)}
                  onClick={() => handleFocusZoneChange(callout.targetZoneId)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleFocusZoneChange(callout.targetZoneId);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={layout.x}
                    y={layout.y}
                    width={layout.width}
                    height={layout.height}
                    rx={18}
                    fill="rgba(255,255,255,0.96)"
                    stroke="rgba(148,163,184,0.58)"
                    strokeWidth={1}
                  />
                  <text
                    x={layout.x + 14}
                    y={layout.y + 20}
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: 10,
                      fontWeight: 700,
                      fill: '#0f172a',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {getFocusZoneLabel(callout.targetZoneId, language)}
                  </text>
                  <text
                    x={layout.x + 14}
                    y={layout.y + 37}
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 8.5,
                      fontWeight: 700,
                      fill: '#64748b',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {copy.focusJump}
                  </text>
                </g>
              </Annotation>
            );
          })}
        </ComposableMap>
      </div>
    </div>
  );
}

export default WorldMap;
