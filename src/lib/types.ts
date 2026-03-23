export interface Project {
  id: string;
  name: string;
  grantee: string;
  country: string;
  region: string;
  commodity: 'cotton' | 'wool' | 'cashmere' | 'leather' | 'multi';
  hectares: number;
  hectaresType: 'direct' | 'indirect' | 'mixed';
  beneficiaries: number | null;
  lat: number;
  lng: number;
  yearJoined: number;
  grantCycle: '2021' | '2023' | '2024' | '2025';
  status: 'active' | 'completed' | 'new';
  description: string;
}

export interface FundSummary {
  totalHectares: number;
  directHectares: number;
  indirectHectares: number;
  totalProjects: number;
  totalCountries: number;
  totalBeneficiaries: number;
  launchYear: number;
  targetHectares: number;
  commodities: string[];
  activeCommodities2025: string[];
  brandPartners: string[];
  grantRange2024: { min: number; max: number };
  grantRange2025: { min: number; max: number };
}

export interface ClimateData {
  meanTemp: number;
  annualPrecip: number;
  droughtEvents: number;
  growingSeasonDays: number;
  precipTrend: number;
  tempTrend: number;
  monthlyData: {
    month: string;
    tempMean: number;
    tempMin: number;
    tempMax: number;
    precipitation: number;
    soilMoisture: number;
  }[];
  annualPrecipTotals: { year: number; total: number }[];
}

export interface SoilData {
  socStock_tPerHa: number;
  textureClass: string;
  pH: number;
  bulkDensity: number;
  sand: number;
  silt: number;
  clay: number;
  cec: number;
  depthProfile: {
    depth: string;
    soc: number;
    bulkDensity: number;
  }[];
}

export interface CommodityData {
  commodity: string;
  prices: { date: string; price: number }[];
  contextText?: string;
}

export interface DegradationAssessment {
  projectId: string;
  currentSOC_tPerHa: number;
  soilTexture: string;
  referenceSOC_tPerHa: number;
  socDeficit_tPerHa: number;
  socDeficit_percent: number;
  potentialSOC_gain_tPerHa: number;
  potentialCO2e_tPerHa: number;
  timeToRestore_years: number;
  carbonValue_usdPerHa: number;
  productivityGain_percent: number;
  priorityScore: number;
  priorityRank: number;
}

export interface DataCompleteness {
  climate: 'complete' | 'partial' | 'missing';
  soil: 'complete' | 'partial' | 'missing';
  water: 'complete' | 'partial' | 'missing';
  biodiversity: 'complete' | 'partial' | 'missing';
  livelihoods: 'complete' | 'partial' | 'missing';
  animalWelfare: 'complete' | 'partial' | 'missing';
  score: number;
  lastUpdated: string | null;
}

export interface ProjectNarrative {
  overview: string;
  objectives: string[];
  challenges: string[];
  keyResults: string[];
  currentPhase: string;
  brandPartnerContext: string | null;
  lastUpdated: string;
}

export interface ProjectBiodiversity {
  ecoregion: string;
  biome: string;
  nearestProtectedArea: string;
  distanceToProtectedAreaKm: number;
  keySpecies: string[];
  threatenedSpecies: string[];
  biodiversityNotes: string;
}

export interface ProjectAnimalWelfare {
  applicable: boolean;
  livestockType: string;
  estimatedHeadcount: number | null;
  stockingDensity: string | null;
  certifications: string[];
  welfareNotes: string;
  practicesDocumented: string[];
}

export interface ProjectLivelihoodContext {
  countryCode: string;
  subnationalRegion: string;
  estimatedBeneficiaries: number | null;
  beneficiaryBreakdown: string | null;
  averageFarmSize: string | null;
  primaryLivelihood: string;
  indigenousContext: string | null;
  incomeContext: string | null;
  livelihoodNotes: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  requirement: string;
  description: string;
  standard: string;
  severity: 'required' | 'recommended' | 'optional';
  validator: (data: Record<string, unknown>) => 'compliant' | 'missing' | 'off-spec' | 'not-applicable';
}
