import type { DegradationAssessment } from '../types';

// Reference SOC values (t C/ha, 0-30cm) by soil texture + climate zone
// Based on published literature values
const REFERENCE_SOC: Record<string, Record<string, number>> = {
  Sand: { arid: 12, semi_arid: 20, sub_humid: 35, humid: 45 },
  'Loamy Sand': { arid: 15, semi_arid: 25, sub_humid: 40, humid: 50 },
  'Sandy Loam': { arid: 20, semi_arid: 35, sub_humid: 55, humid: 70 },
  Loam: { arid: 25, semi_arid: 45, sub_humid: 65, humid: 85 },
  'Silt Loam': { arid: 25, semi_arid: 45, sub_humid: 65, humid: 85 },
  Silt: { arid: 22, semi_arid: 40, sub_humid: 60, humid: 78 },
  'Sandy Clay Loam': { arid: 28, semi_arid: 42, sub_humid: 60, humid: 78 },
  'Clay Loam': { arid: 30, semi_arid: 50, sub_humid: 75, humid: 95 },
  'Silty Clay Loam': { arid: 30, semi_arid: 50, sub_humid: 75, humid: 95 },
  'Sandy Clay': { arid: 32, semi_arid: 48, sub_humid: 70, humid: 88 },
  'Silty Clay': { arid: 33, semi_arid: 52, sub_humid: 78, humid: 98 },
  Clay: { arid: 35, semi_arid: 55, sub_humid: 80, humid: 100 },
};

// SOC accumulation rates under regenerative practices (t C/ha/yr)
const REGEN_ACCUMULATION_RATES: Record<string, number> = {
  rotational_grazing: 0.5,
  cover_cropping: 0.4,
  no_till_organic: 0.3,
  agroforestry: 0.8,
  grassland_restoration: 0.6,
};

// Conservative voluntary carbon market price
const CARBON_PRICE_USD_PER_TCO2 = 15;

// Map commodity to likely regenerative practice
const COMMODITY_PRACTICE: Record<string, string> = {
  cashmere: 'rotational_grazing',
  wool: 'rotational_grazing',
  cotton: 'cover_cropping',
  leather: 'grassland_restoration',
  multi: 'grassland_restoration',
};

export function classifyClimate(annualPrecipMm: number): string {
  if (annualPrecipMm < 250) return 'arid';
  if (annualPrecipMm < 500) return 'semi_arid';
  if (annualPrecipMm < 1000) return 'sub_humid';
  return 'humid';
}

export function computeDegradation(
  projectId: string,
  currentSOC: number,
  soilTexture: string,
  annualPrecipMm: number,
  commodity: string,
  hectares: number
): DegradationAssessment {
  const climateZone = classifyClimate(annualPrecipMm);

  // Look up reference SOC
  const textureRef = REFERENCE_SOC[soilTexture] || REFERENCE_SOC['Loam'];
  const referenceSOC = textureRef[climateZone] || 45;

  const socDeficit = Math.max(0, referenceSOC - currentSOC);
  const socDeficitPercent = referenceSOC > 0 ? Math.round((socDeficit / referenceSOC) * 100) : 0;

  // Restoration potential
  const practice = COMMODITY_PRACTICE[commodity] || 'grassland_restoration';
  const accRate = REGEN_ACCUMULATION_RATES[practice] || 0.5;

  // Can't gain more than the deficit
  const potentialGain = Math.min(socDeficit, socDeficit * 0.8); // Conservative: 80% of deficit recoverable
  const potentialCO2e = Math.round(potentialGain * 3.67 * 10) / 10; // C to CO2 conversion
  const timeToRestore = accRate > 0 ? Math.ceil(potentialGain / accRate) : 20;

  // Economic value
  const carbonValue = Math.round(potentialCO2e * CARBON_PRICE_USD_PER_TCO2);
  const productivityGain = Math.min(30, Math.round(socDeficitPercent * 0.5)); // rough proxy

  // Priority score: composite of degradation severity, total area impact, restoration feasibility
  const degradationScore = Math.min(40, socDeficitPercent); // max 40 points
  const scaleScore = Math.min(30, Math.log10(Math.max(hectares, 1)) * 6); // max 30 points
  const feasibilityScore = Math.min(30, (accRate / 0.8) * 30); // max 30 points
  const priorityScore = Math.round(degradationScore + scaleScore + feasibilityScore);

  return {
    projectId,
    currentSOC_tPerHa: Math.round(currentSOC * 10) / 10,
    soilTexture,
    referenceSOC_tPerHa: referenceSOC,
    socDeficit_tPerHa: Math.round(socDeficit * 10) / 10,
    socDeficit_percent: socDeficitPercent,
    potentialSOC_gain_tPerHa: Math.round(potentialGain * 10) / 10,
    potentialCO2e_tPerHa: potentialCO2e,
    timeToRestore_years: timeToRestore,
    carbonValue_usdPerHa: carbonValue,
    productivityGain_percent: productivityGain,
    priorityScore: Math.min(100, priorityScore),
    priorityRank: 0, // will be set after ranking all projects
  };
}
