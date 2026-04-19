import { countries } from '../data/countries';
import { seas } from '../data/seas';
import type { RegionFilter, StudyItem } from '../types';
import type { Language } from '../i18n';
import {
  getContinentLabel,
  getCountryDetail,
  getOceanLabel,
  getSeaDetail,
} from '../i18n';

export function getRegionKey(filter: RegionFilter) {
  if (filter.type === 'world') return 'world';
  return `${filter.type}:${filter.value}`;
}

export function getRegionLabel(filter: RegionFilter, language: Language = 'en') {
  if (filter.type === 'world') return language === 'sv' ? 'Världen' : 'World';
  if (filter.type === 'continent') return getContinentLabel(filter.value, language);
  return getOceanLabel(filter.value, language);
}

export function getStudyItems(filter: RegionFilter): StudyItem[] {
  const items: StudyItem[] = [];

  if (filter.type === 'continent') {
    countries
      .filter((country) => country.continent === filter.value)
      .forEach((country) => {
        items.push({
          id: country.id,
          name: country.name,
          type: 'country',
          detail: getCountryDetail(country, 'en'),
          flag: country.flag,
        });
      });
    return items;
  }

  if (filter.type === 'ocean') {
    seas
      .filter((sea) => sea.ocean === filter.value)
      .forEach((sea) => {
        items.push({
          id: sea.id,
          name: sea.name,
          type: 'sea',
          detail: getSeaDetail(sea, 'en'),
        });
      });
    return items;
  }

  countries.forEach((country) => {
    items.push({
      id: country.id,
      name: country.name,
      type: 'country',
      detail: getCountryDetail(country, 'en', true),
      flag: country.flag,
    });
  });

  return items;
}

export function getFilteredIds(filter: RegionFilter) {
  return getStudyItems(filter).map((item) => item.id);
}
