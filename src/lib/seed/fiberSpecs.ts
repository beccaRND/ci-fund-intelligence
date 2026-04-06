export interface FiberSpec {
  fiberType: string;
  volume: string;
  volumeNote: string | null;
  certifications: string[];
  certificationStatus: string;
  breeds: string | null;
  fiberLength: string | null;
  fiberThickness: string | null;
  fiberColor: string | null;
}

export interface ProjectFiberData {
  projectId: string;
  fibers: FiberSpec[];
  valueChainNotes: string | null;
  marketAccess: string | null;
}

export const fiberData: Record<string, ProjectFiberData> = {
  'south-africa-wool': {
    projectId: 'south-africa-wool',
    fibers: [
      {
        fiberType: 'Sheep wool',
        volume: '13,250 kgs',
        volumeNote: '2.5 kgs per sheep',
        certifications: ['RWS'],
        certificationStatus: 'Compliance in progress',
        breeds: 'Mix of Merino and Dorper',
        fiberLength: '80-90mm AA-PF',
        fiberThickness: '20-20.5 microns',
        fiberColor: 'White to light cream',
      },
    ],
    valueChainNotes:
      'BKB is the dominant regional broker marketing 62% of SA wool clip. Profit sharing from livestock auction sales and payments for carbon credits through Fleece Naturally Pty with BKB support.',
    marketAccess:
      'RWS certification in progress. Other stakeholders (WWF, H&M) working in the region — opportunity to collaborate and scale impact.',
  },
  'argentina-patagonia-wool': {
    projectId: 'argentina-patagonia-wool',
    fibers: [
      {
        fiberType: 'Merino wool',
        volume: '118,863 kgs',
        volumeNote: null,
        certifications: ['RWS', 'Wildlife Friendly'],
        certificationStatus: 'Certified',
        breeds: null,
        fiberLength: null,
        fiberThickness: null,
        fiberColor: null,
      },
      {
        fiberType: 'Mohair',
        volume: '13,412 kgs',
        volumeNote: null,
        certifications: ['Wildlife Friendly'],
        certificationStatus: 'Certified',
        breeds: null,
        fiberLength: null,
        fiberThickness: null,
        fiberColor: null,
      },
      {
        fiberType: 'Guanaco fiber',
        volume: '57 kgs',
        volumeNote: null,
        certifications: ['Wildlife Friendly'],
        certificationStatus: 'Certified',
        breeds: null,
        fiberLength: null,
        fiberThickness: null,
        fiberColor: null,
      },
    ],
    valueChainNotes:
      'Working with Kering (Yves Saint Laurent) and Fuhrmann company on certification and scaling certified vicuña fiber to Bolivia. Sourcing Merino wool from project site. Challenges: getting brand sourcing commitments, recognition of WFEN certification and creating a premium.',
    marketAccess:
      'Exploring Regen certifications. Expand Wildlife Friendly and RWS certifications for fibers, develop carbon credit incentives, and Wildlife Friendly tourism. Developing traceability database for fibers.',
  },
};
