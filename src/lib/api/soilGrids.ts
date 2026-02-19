const BASE_URL = 'https://rest.isric.org/soilgrids/v2.0/properties/query';

interface SoilGridsLayer {
  name: string;
  depths: {
    label: string;
    range: { top_depth: number; bottom_depth: number; unit_depth: string };
    values: { mean: number | null; Q0_05: number | null; Q0_95: number | null };
  }[];
  unit_measure: { mapped_units: string; target_units: string; d_factor: number };
}

interface SoilGridsResponse {
  type: string;
  properties: {
    layers: SoilGridsLayer[];
  };
}

export interface ProcessedSoilData {
  socStock_tPerHa: number; // SOC stock 0-30cm in tonnes C per hectare
  textureClass: string;
  pH: number;
  bulkDensity: number; // g/cm³
  sand: number; // %
  silt: number; // %
  clay: number; // %
  cec: number; // cmol/kg
  depthProfile: {
    depth: string;
    soc: number; // g/kg
    bulkDensity: number; // g/cm³
  }[];
}

export async function getSoilData(lat: number, lng: number): Promise<ProcessedSoilData & { isFallback?: boolean }> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      property: ['soc', 'phh2o', 'sand', 'silt', 'clay', 'bdod', 'cec'].join(','),
      depth: ['0-5cm', '5-15cm', '15-30cm', '30-60cm', '60-100cm'].join(','),
      value: 'mean',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${BASE_URL}?${params}`, {
      signal: controller.signal,
      next: { revalidate: 86400 * 7 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`SoilGrids API returned ${res.status}, using fallback data`);
      return { ...getFallbackSoilData(lat, lng), isFallback: true };
    }

    const data: SoilGridsResponse = await res.json();
    return processSoilData(data);
  } catch (error) {
    console.warn('SoilGrids API unavailable, using fallback data:', error);
    return { ...getFallbackSoilData(lat, lng), isFallback: true };
  }
}

// Estimated soil data based on climate zone / region when API is unavailable
// Values derived from published literature for each project region
function getFallbackSoilData(lat: number, lng: number): ProcessedSoilData {
  // Rough climate zone from latitude
  const absLat = Math.abs(lat);
  let baseSOC: number, sand: number, silt: number, clay: number, pH: number, bd: number;

  if (absLat > 40) {
    // Temperate/cold steppe (Mongolia, Patagonia, France, NZ, Australia)
    baseSOC = 28; sand = 42; silt = 35; clay = 23; pH = 7.2; bd = 1.32;
  } else if (absLat > 25) {
    // Subtropical (India, Pakistan, Turkey, Spain, South Africa)
    baseSOC = 22; sand = 48; silt = 30; clay = 22; pH = 6.8; bd = 1.38;
  } else {
    // Tropical (Uganda)
    baseSOC = 18; sand = 38; silt = 32; clay = 30; pH = 5.9; bd = 1.25;
  }

  // Slight regional variations based on longitude
  const variation = ((Math.sin(lng * 0.1) + 1) / 2) * 0.2 - 0.1; // ±10%
  baseSOC = Math.round(baseSOC * (1 + variation) * 10) / 10;

  const depths = ['0-5cm', '5-15cm', '15-30cm', '30-60cm', '60-100cm'];
  const depthMultipliers = [1.3, 1.1, 1.0, 0.7, 0.4];

  return {
    socStock_tPerHa: Math.round(baseSOC * 10) / 10,
    textureClass: classifyTexture(sand, silt, clay),
    pH,
    bulkDensity: bd,
    sand,
    silt,
    clay,
    cec: Math.round((clay * 0.6 + baseSOC * 0.3) * 10) / 10,
    depthProfile: depths.map((d, i) => ({
      depth: d,
      soc: Math.round(baseSOC * depthMultipliers[i] * 10) / 10,
      bulkDensity: Math.round((bd + i * 0.03) * 100) / 100,
    })),
  };
}

function getLayerValue(layers: SoilGridsLayer[], property: string, depthLabel: string): number | null {
  const layer = layers.find((l) => l.name === property);
  if (!layer) return null;
  const depth = layer.depths.find((d) => d.label === depthLabel);
  return depth?.values.mean ?? null;
}

function processSoilData(raw: SoilGridsResponse): ProcessedSoilData {
  const layers = raw.properties.layers;

  // Extract values at each depth for SOC and bulk density
  const depths = ['0-5cm', '5-15cm', '15-30cm', '30-60cm', '60-100cm'];
  const depthProfile = depths.map((d) => {
    // SOC: mapped units are dg/kg (decigrams per kilogram), convert to g/kg by dividing by 10
    const socRaw = getLayerValue(layers, 'soc', d);
    const soc = socRaw !== null ? socRaw / 10 : 0;

    // Bulk density: mapped units are cg/cm³, convert to g/cm³ by dividing by 100
    const bdRaw = getLayerValue(layers, 'bdod', d);
    const bd = bdRaw !== null ? bdRaw / 100 : 1.3;

    return { depth: d, soc, bulkDensity: Math.round(bd * 100) / 100 };
  });

  // Calculate SOC stock for 0-30cm
  // SOC stock (t/ha) = sum over depths of: SOC_concentration(g/kg) * bulk_density(g/cm³) * thickness(cm) * 0.1
  const depthThickness: Record<string, number> = {
    '0-5cm': 5,
    '5-15cm': 10,
    '15-30cm': 15,
    '30-60cm': 30,
    '60-100cm': 40,
  };

  let socStock = 0;
  for (const dp of depthProfile.slice(0, 3)) { // 0-5, 5-15, 15-30 = 0-30cm
    const thickness = depthThickness[dp.depth] || 0;
    socStock += dp.soc * dp.bulkDensity * thickness * 0.1;
  }
  socStock = Math.round(socStock * 10) / 10;

  // Sand/silt/clay at 0-30cm average (mapped units: g/kg, convert to %)
  const sandValues = depths.slice(0, 3).map((d) => getLayerValue(layers, 'sand', d)).filter((v): v is number => v !== null);
  const siltValues = depths.slice(0, 3).map((d) => getLayerValue(layers, 'silt', d)).filter((v): v is number => v !== null);
  const clayValues = depths.slice(0, 3).map((d) => getLayerValue(layers, 'clay', d)).filter((v): v is number => v !== null);

  const sand = sandValues.length > 0 ? Math.round(sandValues.reduce((a, b) => a + b, 0) / sandValues.length / 10) : 0;
  const silt = siltValues.length > 0 ? Math.round(siltValues.reduce((a, b) => a + b, 0) / siltValues.length / 10) : 0;
  const clay = clayValues.length > 0 ? Math.round(clayValues.reduce((a, b) => a + b, 0) / clayValues.length / 10) : 0;

  // pH: mapped units are pH*10, divide by 10
  const phValues = depths.slice(0, 3).map((d) => getLayerValue(layers, 'phh2o', d)).filter((v): v is number => v !== null);
  const pH = phValues.length > 0 ? Math.round(phValues.reduce((a, b) => a + b, 0) / phValues.length / 10 * 10) / 10 : 0;

  // Bulk density average 0-30cm
  const bdAvg = depthProfile.slice(0, 3).reduce((a, b) => a + b.bulkDensity, 0) / 3;
  const bulkDensity = Math.round(bdAvg * 100) / 100;

  // CEC: mapped units are mmol(c)/kg, divide by 10 to get cmol/kg
  const cecValues = depths.slice(0, 3).map((d) => getLayerValue(layers, 'cec', d)).filter((v): v is number => v !== null);
  const cec = cecValues.length > 0 ? Math.round(cecValues.reduce((a, b) => a + b, 0) / cecValues.length / 10 * 10) / 10 : 0;

  // Texture class from sand/silt/clay percentages
  const textureClass = classifyTexture(sand, silt, clay);

  return {
    socStock_tPerHa: socStock,
    textureClass,
    pH,
    bulkDensity,
    sand,
    silt,
    clay,
    cec,
    depthProfile,
  };
}

function classifyTexture(sand: number, silt: number, clay: number): string {
  // Simplified USDA soil texture classification
  if (clay >= 40) {
    if (sand >= 45) return 'Sandy Clay';
    if (silt >= 40) return 'Silty Clay';
    return 'Clay';
  }
  if (clay >= 27) {
    if (sand >= 20 && sand <= 45) return 'Clay Loam';
    if (sand < 20) return 'Silty Clay Loam';
    return 'Sandy Clay Loam';
  }
  if (silt >= 50) {
    if (clay >= 12) return 'Silt Loam';
    return 'Silt';
  }
  if (sand >= 85) return 'Sand';
  if (sand >= 70) return 'Loamy Sand';
  if (clay >= 7 && clay < 27 && sand >= 43) return 'Sandy Loam';
  if (clay >= 7 && clay < 27 && sand < 43) return 'Loam';
  return 'Loam';
}
