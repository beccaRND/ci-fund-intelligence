export interface AnnualMetrics {
  year: number;
  directHectares: number;
  indirectHectares: number;
  totalEnrolled: number;
  directBeneficiaries: number;
  indirectBeneficiaries: number;
  totalBeneficiaries: number;
}

export const annualMetrics: AnnualMetrics[] = [
  {
    year: 2022,
    directHectares: 259783, // 2022 "enrolled" — direct/indirect not yet distinguished
    indirectHectares: 0,
    totalEnrolled: 259783,
    directBeneficiaries: 12540,
    indirectBeneficiaries: 0,
    totalBeneficiaries: 12540,
  },
  {
    year: 2023,
    directHectares: 659220, // 2023 "enrolled" — direct/indirect not yet distinguished
    indirectHectares: 0,
    totalEnrolled: 659220,
    directBeneficiaries: 48652,
    indirectBeneficiaries: 0,
    totalBeneficiaries: 48652,
  },
  {
    year: 2024,
    directHectares: 844821,
    indirectHectares: 266583,
    totalEnrolled: 1111404,
    directBeneficiaries: 35677,
    indirectBeneficiaries: 69468,
    totalBeneficiaries: 105145,
  },
];

// Fund target: 1 million hectares by 2026
export const HECTARE_TARGET = 1000000;

// Note from CI's annual report:
// "Enrolled hectares and beneficiaries in 2022 and 2023 included both direct and indirect impacts"
// Only 2024 separates direct from indirect.
