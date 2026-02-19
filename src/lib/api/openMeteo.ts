const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_mean: (number | null)[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
    et0_fao_evapotranspiration: (number | null)[];
  };
  daily_units: Record<string, string>;
}

export async function getClimateData(
  lat: number,
  lng: number,
  startDate?: string,
  endDate?: string
): Promise<OpenMeteoResponse> {
  const end = endDate || new Date().toISOString().split('T')[0];
  const start =
    startDate ||
    (() => {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 5);
      return d.toISOString().split('T')[0];
    })();

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    start_date: start,
    end_date: end,
    daily: [
      'temperature_2m_mean',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'et0_fao_evapotranspiration',
    ].join(','),
    timezone: 'auto',
  });

  const res = await fetch(`${BASE_URL}?${params}`, {
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export interface ProcessedClimateData {
  meanTemp: number;
  annualPrecip: number;
  droughtEvents: number;
  growingSeasonDays: number;
  precipTrend: number; // mm/yr change
  tempTrend: number; // °C/yr change
  monthlyData: {
    month: string;
    year: number;
    tempMean: number;
    tempMin: number;
    tempMax: number;
    precipitation: number;
  }[];
  annualPrecipTotals: { year: number; total: number }[];
  yearRange: { start: number; end: number };
}

export function processClimateData(raw: OpenMeteoResponse): ProcessedClimateData {
  const { daily } = raw;
  const n = daily.time.length;

  // Overall mean temp
  const temps = daily.temperature_2m_mean.filter((v): v is number => v !== null);
  const meanTemp = temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 0;

  // Annual precipitation totals
  const annualPrecip: Record<number, number> = {};
  for (let i = 0; i < n; i++) {
    const year = parseInt(daily.time[i].substring(0, 4));
    const p = daily.precipitation_sum[i] ?? 0;
    annualPrecip[year] = (annualPrecip[year] || 0) + p;
  }
  const annualPrecipTotals = Object.entries(annualPrecip)
    .map(([year, total]) => ({ year: parseInt(year), total: Math.round(total) }))
    .sort((a, b) => a.year - b.year);

  const avgPrecip =
    annualPrecipTotals.length > 0
      ? annualPrecipTotals.reduce((a, b) => a + b.total, 0) / annualPrecipTotals.length
      : 0;

  // Monthly aggregations
  const monthlyMap: Record<string, { temps: number[]; tempsMin: number[]; tempsMax: number[]; precip: number[] }> = {};
  for (let i = 0; i < n; i++) {
    const key = daily.time[i].substring(0, 7); // YYYY-MM
    if (!monthlyMap[key]) monthlyMap[key] = { temps: [], tempsMin: [], tempsMax: [], precip: [] };
    if (daily.temperature_2m_mean[i] !== null) monthlyMap[key].temps.push(daily.temperature_2m_mean[i]!);
    if (daily.temperature_2m_min[i] !== null) monthlyMap[key].tempsMin.push(daily.temperature_2m_min[i]!);
    if (daily.temperature_2m_max[i] !== null) monthlyMap[key].tempsMax.push(daily.temperature_2m_max[i]!);
    if (daily.precipitation_sum[i] !== null) monthlyMap[key].precip.push(daily.precipitation_sum[i]!);
  }

  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      month: key,
      year: parseInt(key.substring(0, 4)),
      tempMean: v.temps.length > 0 ? Math.round((v.temps.reduce((a, b) => a + b, 0) / v.temps.length) * 10) / 10 : 0,
      tempMin: v.tempsMin.length > 0 ? Math.round((v.tempsMin.reduce((a, b) => a + b, 0) / v.tempsMin.length) * 10) / 10 : 0,
      tempMax: v.tempsMax.length > 0 ? Math.round((v.tempsMax.reduce((a, b) => a + b, 0) / v.tempsMax.length) * 10) / 10 : 0,
      precipitation: Math.round(v.precip.reduce((a, b) => a + b, 0)),
    }));

  // Drought events: periods of 30+ consecutive days with < 50% normal daily precip
  const normalDailyPrecip = avgPrecip / 365;
  let droughtEvents = 0;
  let dryStreak = 0;
  for (let i = 0; i < n; i++) {
    const p = daily.precipitation_sum[i] ?? 0;
    if (p < normalDailyPrecip * 0.5) {
      dryStreak++;
      if (dryStreak === 30) droughtEvents++;
    } else {
      dryStreak = 0;
    }
  }

  // Growing season: avg consecutive days with mean temp > 5°C per year
  const growingByYear: Record<number, number> = {};
  let currentStreak = 0;
  let currentYear = parseInt(daily.time[0]?.substring(0, 4) || '2020');
  for (let i = 0; i < n; i++) {
    const year = parseInt(daily.time[i].substring(0, 4));
    if (year !== currentYear) {
      growingByYear[currentYear] = Math.max(growingByYear[currentYear] || 0, currentStreak);
      currentStreak = 0;
      currentYear = year;
    }
    if ((daily.temperature_2m_mean[i] ?? 0) > 5) {
      currentStreak++;
    } else {
      growingByYear[year] = Math.max(growingByYear[year] || 0, currentStreak);
      currentStreak = 0;
    }
  }
  growingByYear[currentYear] = Math.max(growingByYear[currentYear] || 0, currentStreak);
  const growingValues = Object.values(growingByYear);
  const growingSeasonDays =
    growingValues.length > 0
      ? Math.round(growingValues.reduce((a, b) => a + b, 0) / growingValues.length)
      : 0;

  // Simple linear regression for trends
  function linReg(xs: number[], ys: number[]) {
    const n = xs.length;
    if (n < 2) return 0;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) ** 2;
    }
    return den === 0 ? 0 : num / den;
  }

  const precipTrend = Math.round(
    linReg(
      annualPrecipTotals.map((d) => d.year),
      annualPrecipTotals.map((d) => d.total)
    ) * 10
  ) / 10;

  // Annual mean temp for trend
  const annualTemp: Record<number, number[]> = {};
  for (let i = 0; i < n; i++) {
    const year = parseInt(daily.time[i].substring(0, 4));
    if (daily.temperature_2m_mean[i] !== null) {
      if (!annualTemp[year]) annualTemp[year] = [];
      annualTemp[year].push(daily.temperature_2m_mean[i]!);
    }
  }
  const annualTempAvgs = Object.entries(annualTemp)
    .map(([y, vs]) => ({ year: parseInt(y), avg: vs.reduce((a, b) => a + b, 0) / vs.length }))
    .sort((a, b) => a.year - b.year);
  const tempTrend = Math.round(
    linReg(
      annualTempAvgs.map((d) => d.year),
      annualTempAvgs.map((d) => d.avg)
    ) * 100
  ) / 100;

  const years = annualPrecipTotals.map((d) => d.year);

  return {
    meanTemp: Math.round(meanTemp * 10) / 10,
    annualPrecip: Math.round(avgPrecip),
    droughtEvents,
    growingSeasonDays,
    precipTrend,
    tempTrend,
    monthlyData,
    annualPrecipTotals,
    yearRange: {
      start: Math.min(...years, new Date().getFullYear() - 5),
      end: Math.max(...years, new Date().getFullYear()),
    },
  };
}
