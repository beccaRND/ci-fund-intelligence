export type RelationshipStatus = 'active' | 'potential' | 'challenge';

export interface ValueChainStep {
  stage: string;
  actors: string[];
  status: RelationshipStatus;
  notes?: string;
}

export interface ProjectSupplyChain {
  projectId: string;
  summary: string;
  steps: ValueChainStep[];
  brandConnections: string[];
}

export const supplyChainData: ProjectSupplyChain[] = [
  {
    projectId: 'south-africa-wool',
    summary:
      'Eastern Cape Merino wool flows from communal farmers through the Cape Wools SA scouring and sorting system before reaching European luxury buyers.',
    steps: [
      {
        stage: 'Production',
        actors: ['Communal herders (Alfred Nzo & Joe Gqabi)', 'CSA field officers'],
        status: 'active',
        notes: '~376 direct beneficiary farmers. Herding for Health model improves flock management.',
      },
      {
        stage: 'Processing',
        actors: ['Cape Wools SA', 'Local shearing contractors'],
        status: 'active',
        notes: 'Wool scouring and grading at Port Elizabeth. RWS compliance documentation in progress.',
      },
      {
        stage: 'Certification',
        actors: ['RWS (in progress)', 'Control Union'],
        status: 'potential',
        notes: 'RWS certification application underway. Expected completion 2025.',
      },
      {
        stage: 'Trading',
        actors: ['Bizcommunity wool traders', 'European wool brokers'],
        status: 'active',
        notes: 'Traded through Cape Town auctions and direct buyer agreements.',
      },
      {
        stage: 'Brand',
        actors: ['Kering brands (primary)', 'Inditex (portfolio)'],
        status: 'active',
        notes: 'Target: Gucci knitwear sourcing. Inditex sustainable collection access.',
      },
    ],
    brandConnections: ['kering', 'inditex'],
  },
  {
    projectId: 'argentina-patagonia-wool',
    summary:
      'Patagonian Merino and specialty fibres (mohair, guanaco) from WCS/WFEN-supported estancias, certified under RWS and Wildlife Friendly standards, connecting to luxury brand sourcing.',
    steps: [
      {
        stage: 'Production',
        actors: ['Patagonian estancia owners', 'WCS field teams', 'WFEN network'],
        status: 'active',
        notes: 'Phase II landscape — 598,336 ha across 376 beneficiaries. Includes Merino (118,863 kg), Mohair (13,412 kg), Guanaco (57 kg).',
      },
      {
        stage: 'Processing',
        actors: ['Local shearing cooperatives', 'Buenos Aires processing mills'],
        status: 'active',
        notes: 'Fibre sorted by micron and staple length. Bales tracked by estancia for chain of custody.',
      },
      {
        stage: 'Certification',
        actors: ['Textile Exchange (RWS)', 'Wildlife Friendly Enterprise Network'],
        status: 'active',
        notes: 'RWS + WF certified for Merino and Mohair. Guanaco certified WF.',
      },
      {
        stage: 'Trading',
        actors: ['Responsible Wool network brokers', 'WFEN market access programme'],
        status: 'active',
        notes: 'Direct brand offtake agreements for certified fibre. Premium pricing unlocked via WF certification.',
      },
      {
        stage: 'Brand',
        actors: ['Kering brands (primary)', 'Inditex (portfolio)'],
        status: 'active',
        notes: 'Key supply chain for Gucci and Balenciaga. Inditex portfolio-level access for sustainable collections.',
      },
    ],
    brandConnections: ['kering', 'inditex'],
  },
  {
    projectId: 'mongolia-cashmere',
    summary:
      'Mongolian cashmere from Good Growth Company herder networks, incorporating satellite-informed herd management, targeting Kering luxury brand supply chains.',
    steps: [
      {
        stage: 'Production',
        actors: ['Nomadic herder cooperatives', 'The Good Growth Company'],
        status: 'active',
        notes: '357,817 ha under sustainable grazing management. Satellite data informs seasonal allocation.',
      },
      {
        stage: 'Processing',
        actors: ['Mongolian cashmere processing plants', 'Ulaanbaatar sorting facilities'],
        status: 'active',
        notes: 'Combing and dehairing at licensed facilities. Traceability maintained at herder group level.',
      },
      {
        stage: 'Certification',
        actors: ['Sustainable Fibre Alliance (SFA)', 'Third-party auditors'],
        status: 'potential',
        notes: 'SFA certification in scoping phase. Expected to be formalised by 2025.',
      },
      {
        stage: 'Trading',
        actors: ['International cashmere traders', 'Direct brand procurement'],
        status: 'active',
        notes: 'Volumes flow through established Mongolia-Europe cashmere trade routes.',
      },
      {
        stage: 'Brand',
        actors: ['Kering (primary — Gucci cashmere)'],
        status: 'active',
        notes: 'Gucci cashmere sourcing. Direct supply chain linkage confirmed.',
      },
    ],
    brandConnections: ['kering'],
  },
  {
    projectId: 'india-cotton-oca',
    summary:
      'OCA-managed organic cotton transition across four Indian states, supplying Inditex brands through verified Better Cotton and organic certification channels.',
    steps: [
      {
        stage: 'Production',
        actors: ['Smallholder cotton farmers (MP, Odisha, Rajasthan, Gujarat)', 'OCA field teams'],
        status: 'active',
        notes: '53,500 ha, 48,000+ beneficiary farmers. Transitioning from conventional to organic practices.',
      },
      {
        stage: 'Processing',
        actors: ['Local ginning mills', 'Spinning units (Gujarat hub)'],
        status: 'active',
        notes: 'Organic cotton ginned and spun at certified facilities. Transaction certificates issued per bale.',
      },
      {
        stage: 'Certification',
        actors: ['GOTS certification bodies', 'Better Cotton Initiative', 'OCA verification'],
        status: 'active',
        notes: 'GOTS and Better Cotton certifications active. OCA maintains farm-level data.',
      },
      {
        stage: 'Trading',
        actors: ['OCA trading partners', 'International cotton merchants'],
        status: 'active',
        notes: 'OCA facilitates market connections between certified producers and brand buyers.',
      },
      {
        stage: 'Brand',
        actors: ['Inditex (Zara, Massimo Dutti)', 'Additional OCA brand members'],
        status: 'active',
        notes: 'Primary Inditex cotton sourcing programme. Zara sustainable collection integration.',
      },
    ],
    brandConnections: ['inditex'],
  },
  {
    projectId: 'pakistan-cotton',
    summary:
      'OCA-managed cotton transition in Punjab and Sindh, linking smallholder farmers to Inditex sustainable sourcing commitments.',
    steps: [
      {
        stage: 'Production',
        actors: ['Smallholder farmers (Punjab, Sindh)', 'OCA Pakistan programme team'],
        status: 'active',
        notes: '8,642 ha, 16,027 beneficiaries. Mixed conventional-to-organic transition.',
      },
      {
        stage: 'Processing',
        actors: ['Punjab ginning mills', 'Karachi processing facilities'],
        status: 'active',
        notes: 'Cotton ginned locally. Chain of custody maintained through OCA programme.',
      },
      {
        stage: 'Certification',
        actors: ['Better Cotton Initiative', 'OCA verification programme'],
        status: 'active',
        notes: 'Better Cotton certification active. Working toward full organic certification.',
      },
      {
        stage: 'Trading',
        actors: ['Pakistan Cotton Standards Institute', 'OCA trading network'],
        status: 'active',
        notes: 'Integrated into OCA market access framework.',
      },
      {
        stage: 'Brand',
        actors: ['Inditex (Zara, Massimo Dutti)'],
        status: 'active',
        notes: 'Zara and Massimo Dutti sustainable sourcing.',
      },
    ],
    brandConnections: ['inditex'],
  },
];

export function getSupplyChainForProject(projectId: string): ProjectSupplyChain | undefined {
  return supplyChainData.find((s) => s.projectId === projectId);
}
