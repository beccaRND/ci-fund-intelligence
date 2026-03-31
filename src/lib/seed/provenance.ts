// Provenance seed data — T0→T3 chain of custody for all 13 CI Fund projects.
// Generated as build-time seed; represents the monitored data pipeline from
// grantee submission through Regen Registry claim certification.

export type StageStatus = 'complete' | 'in-progress' | 'pending';

export interface ProvenanceStage {
  stage: 'T0' | 'T1' | 'T2' | 'T3';
  label: string;
  description: string;
  actor: string;
  timestamp: string | null; // ISO date string or null
  status: StageStatus;
  anchorHash: string | null; // mock hex hash or null
  note?: string;
}

export interface ProjectProvenance {
  projectId: string;
  cycle: string;
  stages: ProvenanceStage[];
}

// ── 2021 Grant Cycle — T0→T3 all complete ───────────────────────────────────

const mongolia: ProjectProvenance = {
  projectId: 'mongolia-cashmere',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'The Good Growth Company',
      timestamp: '2024-03-04T08:15:00Z',
      status: 'complete',
      anchorHash: '0x3a7f2d1e9c04b56a82f1d3e7c90b4a2f5e8d1c3b',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-03-11T14:22:00Z',
      status: 'complete',
      anchorHash: '0x9b4e2a7f1c3d0e8b56a9f2d4c7e1b3a0f5d8c2e6',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Dr. Amara Diallo, M&E Lead',
      timestamp: '2024-04-02T10:45:00Z',
      status: 'complete',
      anchorHash: '0xd1f4b7a2e9c3056b8a1f4d7e2c9b0a3f6d5e8c1b',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-05-06T09:00:00Z',
      status: 'complete',
      anchorHash: '0x5e2a9c1f3b7d04e8a6f2d1c5b9a3e7f0d4b8c2a1',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

const indiaOca: ProjectProvenance = {
  projectId: 'india-cotton-oca',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'Organic Cotton Accelerator (OCA)',
      timestamp: '2024-02-19T07:30:00Z',
      status: 'complete',
      anchorHash: '0x8c3f1a5d2e7b09c4a6f3d8e1b2c5a9f4d7e0b3c6',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-02-27T11:05:00Z',
      status: 'complete',
      anchorHash: '0x2d7e0b4f6a1c3e9d5b8f2a4c7d1e3b0f9a6c4d8e',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Sofia Reyes, Data Analyst',
      timestamp: '2024-03-19T15:20:00Z',
      status: 'complete',
      anchorHash: '0xf4a9c2e7d1b3056a8e4f2d9c1b7a0e3f5d8c6b4a',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-04-22T09:00:00Z',
      status: 'complete',
      anchorHash: '0xa1e3c7f0b2d5894c6a1e3f8d2b4c9a7e0f1d5b3c',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

const argentinaLeather: ProjectProvenance = {
  projectId: 'argentina-leather',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'Solidaridad',
      timestamp: '2024-03-12T09:00:00Z',
      status: 'complete',
      anchorHash: '0x6b1d3e8f2a4c7b0d5e9f1a3c6d8b2e4f7a9c1d3e',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-03-20T13:40:00Z',
      status: 'complete',
      anchorHash: '0xe9f2a5c8b1d4073e6a9f2d5c8b1e4a7f0d3c6b9a',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'James Ochieng, M&E Specialist',
      timestamp: '2024-04-10T11:15:00Z',
      status: 'complete',
      anchorHash: '0x3c6f9a1d4b7e2c5a8f3d6b9c2e5a8f1d4b7c0a3e',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-05-14T09:00:00Z',
      status: 'complete',
      anchorHash: '0x7d0e3f6a9c2b5d8a1f4c7b0e3f6a9d2c5b8e1a4f',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

const spainGoat: ProjectProvenance = {
  projectId: 'spain-goat-leather',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'Fundación Global Nature',
      timestamp: '2024-02-28T10:00:00Z',
      status: 'complete',
      anchorHash: '0xb5e8a2d1f4c7093b6e9a2d5f8c1b4e7a0d3f6c9b',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-03-07T16:10:00Z',
      status: 'complete',
      anchorHash: '0x4a7d0c3f6e9b2a5d8f1c4b7e0a3d6f9c2b5e8a1d',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Dr. Amara Diallo, M&E Lead',
      timestamp: '2024-03-28T09:30:00Z',
      status: 'complete',
      anchorHash: '0xc8f1b4d7a0e3c6f9b2d5a8c1f4b7d0e3a6f9c2b5',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-04-30T09:00:00Z',
      status: 'complete',
      anchorHash: '0x1e4a7c0f3b6d9a2e5f8b1c4d7a0e3f6c9b2d5a8f',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

const argentinaPatagonia: ProjectProvenance = {
  projectId: 'argentina-patagonia-wool',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'WCS & Wildlife-Friendly Enterprise Network',
      timestamp: '2024-03-18T08:45:00Z',
      status: 'complete',
      anchorHash: '0x9f2c5e8a1d4b7f0c3e6a9f2b5d8c1e4a7b0d3f6a',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-03-26T12:55:00Z',
      status: 'complete',
      anchorHash: '0x5d8b1e4a7c0f3d6b9e2a5c8f1d4b7e0a3c6f9b2d',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Sofia Reyes, Data Analyst',
      timestamp: '2024-04-18T14:00:00Z',
      status: 'complete',
      anchorHash: '0x0b3e6f9c2d5a8b1e4f7c0d3e6a9b2f5c8d1a4b7e',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-05-20T09:00:00Z',
      status: 'complete',
      anchorHash: '0x6e9a2d5f8c1b4e7a0d3f6c9b2e5a8d1f4c7b0e3a',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

const franceWool: ProjectProvenance = {
  projectId: 'france-wool',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'Epiterre',
      timestamp: '2024-02-14T09:15:00Z',
      status: 'complete',
      anchorHash: '0xd3a6c9f2b5e8a1d4c7f0b3d6a9c2f5b8e1a4d7c0',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-02-22T10:30:00Z',
      status: 'complete',
      anchorHash: '0xa7f0c3d6b9e2a5c8f1d4b7e0a3c6f9b2d5e8a1c4',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'James Ochieng, M&E Specialist',
      timestamp: '2024-03-14T11:45:00Z',
      status: 'complete',
      anchorHash: '0x2e5d8c1f4a7b0e3c6f9d2a5b8c1e4f7a0d3b6e9c',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-04-16T09:00:00Z',
      status: 'complete',
      anchorHash: '0x8f1b4d7a0c3e6f9b2d5c8a1e4b7f0d3c6a9e2b5d',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

const southAfricaWool: ProjectProvenance = {
  projectId: 'south-africa-wool',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'Conservation South Africa',
      timestamp: '2024-03-05T07:30:00Z',
      status: 'complete',
      anchorHash: '0x4c7a0d3f6e9b2c5a8f1d4c7b0e3a6f9d2b5c8a1e',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-03-13T09:50:00Z',
      status: 'complete',
      anchorHash: '0xb8e1a4d7c0f3b6e9a2d5f8c1b4e7a0d3f6c9b2e5',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Dr. Amara Diallo, M&E Lead',
      timestamp: '2024-04-04T13:20:00Z',
      status: 'complete',
      anchorHash: '0x3f6c9b2e5a8d1f4c7b0d3e6a9f2c5b8e1a4d7f0b',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: '2024-05-07T09:00:00Z',
      status: 'complete',
      anchorHash: '0x9c2e5a8f1d4b7e0a3c6f9d2b5e8a1c4d7f0b3e6a',
      note: 'Claim cert publicly queryable at regen.network/registry',
    },
  ],
};

// ── 2023 Grant Cycle — T0→T2 complete, T3 in-progress or pending ────────────

const ugandaCotton: ProjectProvenance = {
  projectId: 'uganda-cotton',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'African Wildlife Foundation',
      timestamp: '2024-08-05T08:00:00Z',
      status: 'complete',
      anchorHash: '0xe5a8b1d4f7c0e3a6f9b2d5c8a1e4b7d0f3c6a9e2',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-08-13T11:15:00Z',
      status: 'complete',
      anchorHash: '0x1d4f7a0e3b6c9d2f5a8c1d4f7b0e3a6c9f2d5b8a',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Sofia Reyes, Data Analyst',
      timestamp: '2024-09-04T14:30:00Z',
      status: 'complete',
      anchorHash: '0x7b0c3e6a9f2d5b8c1e4a7f0d3b6e9c2f5a8d1b4e',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: null,
      status: 'in-progress',
      anchorHash: null,
      note: 'Registry submission under final technical review — expected Q1 2025',
    },
  ],
};

const indiaCottonWfen: ProjectProvenance = {
  projectId: 'india-cotton-wfen',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'WFEN with WWF-India',
      timestamp: '2024-09-10T09:30:00Z',
      status: 'complete',
      anchorHash: '0xa3d6f9b2e5c8a1d4f7b0e3a6c9f2d5b8e1a4c7f0',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-09-18T12:40:00Z',
      status: 'complete',
      anchorHash: '0xf0d3c6b9a2e5f8d1c4b7a0d3f6c9b2e5a8d1f4c7',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'James Ochieng, M&E Specialist',
      timestamp: '2024-10-10T10:00:00Z',
      status: 'complete',
      anchorHash: '0x4b7e0a3d6c9f2b5e8a1d4f7b0e3c6a9f2d5b8e1a',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
      note: 'Awaiting registry submission following M&E approval sign-off',
    },
  ],
};

const pakistanCotton: ProjectProvenance = {
  projectId: 'pakistan-cotton',
  cycle: '2024 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'CI Fund Grantee Partner',
      timestamp: '2024-07-22T08:00:00Z',
      status: 'complete',
      anchorHash: '0xd7f0a3c6b9e2d5f8c1b4d7a0e3f6c9b2d5a8f1c4',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2024-07-30T10:25:00Z',
      status: 'complete',
      anchorHash: '0x8a1e4b7d0f3a6c9e2b5d8f1a4c7e0b3d6f9a2c5e',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Dr. Amara Diallo, M&E Lead',
      timestamp: '2024-08-22T13:00:00Z',
      status: 'complete',
      anchorHash: '0x2c5e8b1f4a7d0c3e6b9f2a5d8c1e4b7a0f3d6c9e',
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: null,
      status: 'in-progress',
      anchorHash: null,
      note: 'Registry submission in progress — data completeness requirements met',
    },
  ],
};

// ── 2025 New Projects — T0 complete, T1 in-progress, T2+T3 pending ──────────

const turkeyCotton: ProjectProvenance = {
  projectId: 'turkey-cotton',
  cycle: '2025 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'CI Fund Grantee Partner',
      timestamp: '2025-03-06T08:00:00Z',
      status: 'complete',
      anchorHash: '0x5f8c1e4b7a0d3f6c9e2b5a8d1f4c7b0e3a6f9d2e',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2025-03-14T11:00:00Z',
      status: 'in-progress',
      anchorHash: null,
      note: 'Baseline data completeness check underway — GPS boundary submission pending',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Sofia Reyes, Data Analyst',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
    },
  ],
};

const australiaWool: ProjectProvenance = {
  projectId: 'australia-wool',
  cycle: '2025 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'CI Fund Grantee Partner',
      timestamp: '2025-03-10T09:00:00Z',
      status: 'complete',
      anchorHash: '0xe1b4d7a0f3c6e9b2d5f8a1c4e7b0d3f6a9c2e5b8',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2025-03-18T10:30:00Z',
      status: 'in-progress',
      anchorHash: null,
      note: 'Wool certification documentation under review — RWS alignment being assessed',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'James Ochieng, M&E Specialist',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
    },
  ],
};

const nzWool: ProjectProvenance = {
  projectId: 'nz-wool',
  cycle: '2025 Monitoring Cycle',
  stages: [
    {
      stage: 'T0',
      label: 'Raw Submission',
      description: 'Grantee uploads monitoring data package — field measurements, GPS records, and methodology notes.',
      actor: 'CI Fund Grantee Partner',
      timestamp: '2025-03-19T08:30:00Z',
      status: 'complete',
      anchorHash: '0x6a9d2f5c8b1e4a7d0f3c6b9e2a5f8d1c4b7e0a3f',
    },
    {
      stage: 'T1',
      label: 'Checklist Review',
      description: 'Automated compliance check against CI 6-principles framework and data completeness requirements.',
      actor: 'CI Automated Compliance Engine',
      timestamp: '2025-03-27T09:45:00Z',
      status: 'in-progress',
      anchorHash: null,
      note: 'Canterbury / Otago boundary mapping in progress — soil sampling methodology under review',
    },
    {
      stage: 'T2',
      label: 'M&E Sign-off',
      description: 'CI M&E staff manually validates sampling methodology, data integrity, and contextual consistency.',
      actor: 'Dr. Amara Diallo, M&E Lead',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
    },
    {
      stage: 'T3',
      label: 'Claim Certificate',
      description: 'Verified outcome claim anchored to Regen Ledger — tamper-evident, publicly queryable record.',
      actor: 'Regen Registry Protocol v2.1',
      timestamp: null,
      status: 'pending',
      anchorHash: null,
    },
  ],
};

// ── Exported record ───────────────────────────────────────────────────────────

export const projectProvenance: Record<string, ProjectProvenance> = {
  'mongolia-cashmere': mongolia,
  'india-cotton-oca': indiaOca,
  'argentina-leather': argentinaLeather,
  'spain-goat-leather': spainGoat,
  'argentina-patagonia-wool': argentinaPatagonia,
  'france-wool': franceWool,
  'south-africa-wool': southAfricaWool,
  'uganda-cotton': ugandaCotton,
  'india-cotton-wfen': indiaCottonWfen,
  'pakistan-cotton': pakistanCotton,
  'turkey-cotton': turkeyCotton,
  'australia-wool': australiaWool,
  'nz-wool': nzWool,
};
