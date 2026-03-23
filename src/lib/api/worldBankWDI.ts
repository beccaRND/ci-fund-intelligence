const BASE_URL = 'https://api.worldbank.org/v2';

export const COUNTRY_CODES: Record<string, string> = {
  'Mongolia': 'MNG',
  'India': 'IND',
  'Argentina': 'ARG',
  'Spain': 'ESP',
  'France': 'FRA',
  'South Africa': 'ZAF',
  'Uganda': 'UGA',
  'Pakistan': 'PAK',
  'T\u00fcrkiye': 'TUR',
  'Australia': 'AUS',
  'New Zealand': 'NZL',
};

export const WDI_INDICATORS: Record<string, { code: string; label: string; format: 'number' | 'percent' | 'currency' }> = {
  population: { code: 'SP.POP.TOTL', label: 'Population', format: 'number' },
  rural_population_pct: { code: 'SP.RUR.TOTL.ZS', label: 'Rural Pop', format: 'percent' },
  life_expectancy: { code: 'SP.DYN.LE00.IN', label: 'Life Expectancy', format: 'number' },
  gni_per_capita: { code: 'NY.GNP.PCAP.CD', label: 'GNI/Capita', format: 'currency' },
  agriculture_gdp_pct: { code: 'NV.AGR.TOTL.ZS', label: 'Ag % of GDP', format: 'percent' },
  poverty_headcount_190: { code: 'SI.POV.DDAY', label: 'Poverty Rate', format: 'percent' },
  female_labor_participation: { code: 'SL.TLF.CACT.FE.ZS', label: 'Female Labor', format: 'percent' },
  literacy_rate: { code: 'SE.ADT.LITR.ZS', label: 'Literacy', format: 'percent' },
  agriculture_employment_pct: { code: 'SL.AGR.EMPL.ZS', label: 'Ag Employment', format: 'percent' },
  arable_land_pct: { code: 'AG.LND.ARBL.ZS', label: 'Arable Land', format: 'percent' },
};

function formatValue(value: number, format: 'number' | 'percent' | 'currency'): string {
  if (format === 'percent') return `${Math.round(value * 10) / 10}%`;
  if (format === 'currency') return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.round(value * 10) / 10 + '';
}

export interface WDIMetric {
  label: string;
  value: string;
  year: number | null;
}

export async function getLivelihoodData(countryCode: string): Promise<WDIMetric[]> {
  const indicators = Object.values(WDI_INDICATORS);

  // Fetch all indicators in parallel (World Bank API handles one indicator per request)
  const results = await Promise.allSettled(
    indicators.map(async (indicator) => {
      const res = await fetch(
        `${BASE_URL}/country/${countryCode}/indicator/${indicator.code}?date=2018:2024&format=json&per_page=20`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) return null;
      const json = await res.json();
      const data = json[1];
      if (!data || !Array.isArray(data)) return null;

      // Find most recent non-null value
      const sorted = data
        .filter((d: { value?: number | null }) => d.value !== null && d.value !== undefined)
        .sort((a: { date: string }, b: { date: string }) => parseInt(b.date) - parseInt(a.date));

      if (sorted.length === 0) return null;

      return {
        label: indicator.label,
        value: formatValue(sorted[0].value, indicator.format),
        year: parseInt(sorted[0].date),
      } as WDIMetric;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<WDIMetric | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((m): m is WDIMetric => m !== null);
}
