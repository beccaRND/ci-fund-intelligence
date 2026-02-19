import type { ChecklistItem } from './types';

export interface UploadFormData {
  // Sampling Design
  numberOfStrata: number | null;
  stratificationFactors: string[];
  samplesPerStratum: number | null;
  maxDepthCm: number | null;
  depthIntervals: string[];

  // Laboratory
  labMethod: string;
  labName: string;
  bulkDensityApproach: string;
  qaqcMethods: string[];

  // Spatial
  gpsCoordinates: boolean;
  gpsFileUploaded: boolean;

  // Timing
  baselineDate: string;
  currentMeasurementDate: string;
  projectStartYear: number | null;
  verificationFrequencyYears: number | null;

  // Results
  meanSOC: number | null;
  socChangeFromBaseline: number | null;
  confidenceInterval: number | null;
  resultsFileUploaded: boolean;

  // Documentation
  samplingProtocolUploaded: boolean;
  labReportUploaded: boolean;
  additionalNotes: string;
}

export const defaultFormData: UploadFormData = {
  numberOfStrata: null,
  stratificationFactors: [],
  samplesPerStratum: null,
  maxDepthCm: 30,
  depthIntervals: [],
  labMethod: '',
  labName: '',
  bulkDensityApproach: '',
  qaqcMethods: [],
  gpsCoordinates: false,
  gpsFileUploaded: false,
  baselineDate: '',
  currentMeasurementDate: '',
  projectStartYear: null,
  verificationFrequencyYears: null,
  meanSOC: null,
  socChangeFromBaseline: null,
  confidenceInterval: null,
  resultsFileUploaded: false,
  samplingProtocolUploaded: false,
  labReportUploaded: false,
  additionalNotes: '',
};

// Adapt form data to the validator format
function formToValidatorData(form: UploadFormData): Record<string, unknown> {
  const baselineYear = form.baselineDate ? new Date(form.baselineDate).getFullYear() : null;
  return {
    maxDepthCm: form.maxDepthCm ?? 0,
    labMethod: form.labMethod || null,
    bulkDensityMeasured: form.bulkDensityApproach === 'measured' || form.bulkDensityApproach === 'esm',
    gpsCoordinates: form.gpsCoordinates,
    stratificationDocumented: form.stratificationFactors.length > 0 && form.numberOfStrata != null && form.numberOfStrata > 0,
    baselineDate: baselineYear,
    projectStartDate: form.projectStartYear,
    verificationFrequencyYears: form.verificationFrequencyYears ?? 99,
    qaqcDocumented: form.qaqcMethods.length >= 2,
    samplesPerStratum: form.samplesPerStratum ?? 0,
  };
}

export const soilCarbonChecklist: ChecklistItem[] = [
  {
    id: 'soc-depth',
    category: 'Sampling',
    requirement: 'Sampling depth ≥ 30cm',
    description: 'VM0042 minimum. Deeper recommended for practices affecting deeper soils.',
    standard: 'Verra VM0042 v2.2',
    severity: 'required',
    validator: (data) => {
      const depth = data.maxDepthCm as number;
      return depth >= 30 ? 'compliant' : 'off-spec';
    },
  },
  {
    id: 'soc-lab-method',
    category: 'Laboratory',
    requirement: 'Lab method documented',
    description: 'Dry combustion (Dumas — reference), wet oxidation (Walkley-Black with correction), or approved spectroscopic techniques (INS, LIBS, MIR, Vis-NIR) with documented uncertainty.',
    standard: 'Verra VM0042 v2.2',
    severity: 'required',
    validator: (data) => (data.labMethod ? 'compliant' : 'missing'),
  },
  {
    id: 'soc-bulk-density',
    category: 'Sampling',
    requirement: 'Bulk density measured or ESM approach',
    description: 'Bulk density must be directly measured or Equivalent Soil Mass (ESM) approach documented.',
    standard: 'Verra VM0042 v2.2 / Agricarbon',
    severity: 'required',
    validator: (data) => (data.bulkDensityMeasured ? 'compliant' : 'missing'),
  },
  {
    id: 'soc-georef',
    category: 'Spatial',
    requirement: 'Sample locations georeferenced',
    description: 'GPS coordinates for all sampling locations.',
    standard: 'VM0042',
    severity: 'required',
    validator: (data) => (data.gpsCoordinates ? 'compliant' : 'missing'),
  },
  {
    id: 'soc-stratification',
    category: 'Design',
    requirement: 'Stratification by soil type, practice, and cropping system',
    description: 'Sampling design must stratify by relevant factors.',
    standard: 'VM0042',
    severity: 'required',
    validator: (data) => (data.stratificationDocumented ? 'compliant' : 'missing'),
  },
  {
    id: 'soc-baseline-timing',
    category: 'Temporal',
    requirement: 'Baseline within ±5 years of project start',
    description: 'Timing documented relative to project start (baseline within ±5 years of t=0).',
    standard: 'VM0042',
    severity: 'required',
    validator: (data) => {
      if (!data.baselineDate || !data.projectStartDate) return 'missing';
      const diff = Math.abs((data.baselineDate as number) - (data.projectStartDate as number));
      return diff <= 5 ? 'compliant' : 'off-spec';
    },
  },
  {
    id: 'soc-frequency',
    category: 'Temporal',
    requirement: 'Verification frequency ≥ every 5 years',
    description: 'Minimum verification period per VM0042.',
    standard: 'VM0042',
    severity: 'required',
    validator: (data) => ((data.verificationFrequencyYears as number) <= 5 ? 'compliant' : 'off-spec'),
  },
  {
    id: 'soc-qaqc',
    category: 'Quality',
    requirement: 'QA/QC including lab duplicates and reference samples',
    description: 'Quality assurance protocols documented.',
    standard: 'VM0042 / FAO',
    severity: 'recommended',
    validator: (data) => (data.qaqcDocumented ? 'compliant' : 'missing'),
  },
  {
    id: 'soc-statistical',
    category: 'Design',
    requirement: 'Minimum 5 composite samples per stratum',
    description: 'Statistical adequacy per FAO guidelines.',
    standard: 'FAO Voluntary Guidelines',
    severity: 'required',
    validator: (data) => ((data.samplesPerStratum as number) >= 5 ? 'compliant' : 'off-spec'),
  },
];

export type ValidationResult = 'compliant' | 'missing' | 'off-spec' | 'not-applicable';

export interface ChecklistResult {
  item: ChecklistItem;
  result: ValidationResult;
}

export function runChecklist(form: UploadFormData): ChecklistResult[] {
  const data = formToValidatorData(form);
  return soilCarbonChecklist.map((item) => ({
    item,
    result: item.validator(data),
  }));
}

export function computeScore(results: ChecklistResult[]): number {
  const requiredItems = results.filter((r) => r.item.severity === 'required');
  const recommendedItems = results.filter((r) => r.item.severity === 'recommended');

  if (requiredItems.length === 0) return 0;

  // Required items: 90% of score weight
  const requiredCompliant = requiredItems.filter((r) => r.result === 'compliant').length;
  const requiredScore = (requiredCompliant / requiredItems.length) * 90;

  // Recommended items: 10% of score weight
  const recommendedCompliant = recommendedItems.filter((r) => r.result === 'compliant').length;
  const recommendedScore = recommendedItems.length > 0
    ? (recommendedCompliant / recommendedItems.length) * 10
    : 10;

  return Math.round(requiredScore + recommendedScore);
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#00A86B'; // ci-green
  if (score >= 50) return '#E8732A'; // ci-orange
  return '#C4392F'; // status-gap red
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Claims-ready';
  if (score >= 50) return 'Needs attention';
  return 'Significant gaps';
}

// Group results by category
export function groupByCategory(results: ChecklistResult[]): Record<string, ChecklistResult[]> {
  return results.reduce((acc, r) => {
    const cat = r.item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {} as Record<string, ChecklistResult[]>);
}
