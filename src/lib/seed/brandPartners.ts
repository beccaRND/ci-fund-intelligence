export interface BrandPartner {
  id: string;
  name: string;
  tier: 'founding' | 'growth' | 'emerging';
  since: number;
  logo?: string;
  primaryCategory: string;
  commitmentTCO2e?: number;
  commitmentHectares?: number;
  contactName?: string;
  contactTitle?: string;
  website?: string;
  description: string;
}

export interface ProjectAttribution {
  projectId: string;
  brandId: string;
  attributionType: 'direct' | 'portfolio';
  hectares: number;
  beneficiaries: number;
  commodityFocus: string[];
  startYear: number;
  notes?: string;
}

export const brandPartners: BrandPartner[] = [
  {
    id: 'kering',
    name: 'Kering',
    tier: 'founding',
    since: 2021,
    primaryCategory: 'Luxury Fashion',
    commitmentTCO2e: 0,
    commitmentHectares: 500000,
    contactName: 'Marie-Claire Daveu',
    contactTitle: 'Chief Sustainability & Institutional Affairs Officer',
    website: 'https://www.kering.com',
    description:
      'Kering is a founding partner of the CI Regenerative Fund for Nature. As a global luxury group, Kering has committed to transforming its supply chain through nature-positive sourcing — funding regenerative transitions across wool, cashmere, and leather supply chains that directly supply Gucci, Balenciaga, Saint Laurent, and other Kering brands.',
  },
  {
    id: 'inditex',
    name: 'Inditex',
    tier: 'founding',
    since: 2021,
    primaryCategory: 'Fast Fashion / Retail',
    commitmentTCO2e: 0,
    commitmentHectares: 300000,
    contactName: 'Óscar García Maceiras',
    contactTitle: 'CEO, Inditex',
    website: 'https://www.inditex.com',
    description:
      'Inditex, parent company of Zara and eight other global fashion brands, joined the fund as a founding partner in 2021. Their focus within the portfolio centres on cotton and wool supply chains — supporting OCA-managed cotton transitions in India and Pakistan, and wool landscape programmes in South Africa.',
  },
];

export const projectAttributions: ProjectAttribution[] = [
  // Kering attributions
  {
    projectId: 'argentina-patagonia-wool',
    brandId: 'kering',
    attributionType: 'direct',
    hectares: 299142,
    beneficiaries: 188,
    commodityFocus: ['wool', 'mohair', 'guanaco'],
    startYear: 2021,
    notes: 'Patagonia Phase II — primary funder of landscape-scale wool transition. Key supply chain for Gucci and Balenciaga.',
  },
  {
    projectId: 'south-africa-wool',
    brandId: 'kering',
    attributionType: 'direct',
    hectares: 7895,
    beneficiaries: 188,
    commodityFocus: ['wool'],
    startYear: 2022,
    notes: 'Eastern Cape Merino wool programme. Herding for Health partnership.',
  },
  {
    projectId: 'mongolia-cashmere',
    brandId: 'kering',
    attributionType: 'direct',
    hectares: 178909,
    beneficiaries: 0,
    commodityFocus: ['cashmere'],
    startYear: 2022,
    notes: 'Mongolia cashmere landscape — direct supply for Gucci cashmere sourcing.',
  },
  {
    projectId: 'france-wool',
    brandId: 'kering',
    attributionType: 'direct',
    hectares: 1200,
    beneficiaries: 45,
    commodityFocus: ['wool'],
    startYear: 2023,
    notes: 'Quercy wool programme. Small-scale regional sourcing pilot for Bottega Veneta.',
  },
  {
    projectId: 'argentina-caldenal-leather',
    brandId: 'kering',
    attributionType: 'direct',
    hectares: 1600,
    beneficiaries: 0,
    commodityFocus: ['leather'],
    startYear: 2024,
    notes: '2024 cycle — Caldenal leather pilot. Potential Gucci leather supply chain.',
  },
  {
    projectId: 'spain-goat-leather',
    brandId: 'kering',
    attributionType: 'portfolio',
    hectares: 800,
    beneficiaries: 12,
    commodityFocus: ['leather'],
    startYear: 2023,
    notes: 'Extremadura goat leather. Portfolio-level attribution — also accessed by other luxury brands.',
  },
  // Inditex attributions
  {
    projectId: 'india-cotton-oca',
    brandId: 'inditex',
    attributionType: 'direct',
    hectares: 22000,
    beneficiaries: 15000,
    commodityFocus: ['cotton'],
    startYear: 2021,
    notes: 'OCA-managed cotton across MP, Odisha, Rajasthan, Gujarat. Primary Zara cotton sourcing programme.',
  },
  {
    projectId: 'pakistan-cotton',
    brandId: 'inditex',
    attributionType: 'direct',
    hectares: 4321,
    beneficiaries: 8013,
    commodityFocus: ['cotton'],
    startYear: 2022,
    notes: 'Punjab and Sindh cotton transition. OCA-managed. Zara and Massimo Dutti sourcing.',
  },
  {
    projectId: 'south-africa-wool',
    brandId: 'inditex',
    attributionType: 'portfolio',
    hectares: 3948,
    beneficiaries: 94,
    commodityFocus: ['wool'],
    startYear: 2022,
    notes: 'Portfolio-level participation in South Africa wool programme.',
  },
  {
    projectId: 'argentina-patagonia-wool',
    brandId: 'inditex',
    attributionType: 'portfolio',
    hectares: 149571,
    beneficiaries: 94,
    commodityFocus: ['wool'],
    startYear: 2022,
    notes: 'Portfolio-level Patagonia wool access. Supporting Zara sustainable collection lines.',
  },
];

export function getPartnerById(id: string): BrandPartner | undefined {
  return brandPartners.find((p) => p.id === id);
}

export function getAttributionsForPartner(brandId: string): ProjectAttribution[] {
  return projectAttributions.filter((a) => a.brandId === brandId);
}

export function aggregatePartnerMetrics(brandId: string): {
  totalHectares: number;
  totalBeneficiaries: number;
  totalProjects: number;
  directHectares: number;
  portfolioHectares: number;
  commodities: string[];
} {
  const attributions = getAttributionsForPartner(brandId);
  const commoditySet = new Set<string>();
  let totalHectares = 0;
  let totalBeneficiaries = 0;
  let directHectares = 0;
  let portfolioHectares = 0;

  for (const a of attributions) {
    totalHectares += a.hectares;
    totalBeneficiaries += a.beneficiaries;
    if (a.attributionType === 'direct') directHectares += a.hectares;
    else portfolioHectares += a.hectares;
    a.commodityFocus.forEach((c) => commoditySet.add(c));
  }

  return {
    totalHectares,
    totalBeneficiaries,
    totalProjects: attributions.length,
    directHectares,
    portfolioHectares,
    commodities: Array.from(commoditySet),
  };
}
