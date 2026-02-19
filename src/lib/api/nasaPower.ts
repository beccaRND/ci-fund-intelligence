const BASE_URL = 'https://power.larc.nasa.gov/api/temporal/monthly/point';

export interface NASAPowerData {
  solarRadiation: number; // kWh/m²/day annual average
  clearSkyDays: number; // average annual
  windSpeed: number; // m/s annual average
}

export async function getNASAPowerData(lat: number, lng: number): Promise<NASAPowerData> {
  const endYear = new Date().getFullYear() - 1;
  const startYear = endYear - 4;

  const params = new URLSearchParams({
    parameters: 'ALLSKY_SFC_SW_DWN,CLRSKY_DAYS,WS2M',
    community: 'AG',
    longitude: lng.toString(),
    latitude: lat.toString(),
    start: startYear.toString(),
    end: endYear.toString(),
    format: 'JSON',
  });

  const res = await fetch(`${BASE_URL}?${params}`, {
    next: { revalidate: 86400 * 7 },
  });

  if (!res.ok) {
    throw new Error(`NASA POWER API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const properties = data.properties?.parameter;

  if (!properties) {
    throw new Error('NASA POWER: no parameter data returned');
  }

  // Extract annual averages
  function avgMonthly(param: Record<string, number>): number {
    const values = Object.values(param).filter((v) => v !== -999);
    return values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;
  }

  return {
    solarRadiation: avgMonthly(properties.ALLSKY_SFC_SW_DWN || {}),
    clearSkyDays: avgMonthly(properties.CLRSKY_DAYS || {}),
    windSpeed: avgMonthly(properties.WS2M || {}),
  };
}
