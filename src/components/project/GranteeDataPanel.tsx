'use client';

import Link from 'next/link';
import { Upload } from 'lucide-react';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import { dataCompleteness } from '@/lib/seed/projects';
import { dataStatusIcon, dataStatusColor } from '@/lib/utils';

interface GranteeDataPanelProps {
  projectId: string;
}

export default function GranteeDataPanel({ projectId }: GranteeDataPanelProps) {
  const dc = dataCompleteness[projectId];
  const hasData = dc && dc.score > 0;

  if (!hasData) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Grantee-Reported Data
          </h3>
          <DataSourceBadge source="field" label="Field Data" />
        </div>

        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-ci-green-light flex items-center justify-center">
            <Upload size={24} className="text-ci-green" />
          </div>
          <div>
            <p className="text-sm font-medium text-ci-charcoal mb-1">No field data yet</p>
            <p className="text-xs text-ci-gray-500 max-w-xs">
              Your satellite profile is ready. Upload monitoring data to enrich it and get a quality assessment.
            </p>
          </div>
          <Link
            href={`/projects/${projectId}/upload`}
            className="px-5 py-2.5 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors"
          >
            Upload Data
          </Link>
        </div>
      </div>
    );
  }

  const categories = [
    { key: 'soil' as const, label: 'Soil Data' },
    { key: 'biodiversity' as const, label: 'Biodiversity' },
    { key: 'water' as const, label: 'Water' },
    { key: 'livelihoods' as const, label: 'Livelihoods' },
  ];

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
          Grantee-Reported Data
        </h3>
        <DataSourceBadge source="field" label="Field Data" />
      </div>
      <p className="text-xs text-ci-gray-500 mb-4">
        Last updated: {dc.lastUpdated
          ? new Date(dc.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'Never'}
      </p>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {categories.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] bg-ci-cream"
          >
            <span className="text-lg" style={{ color: dataStatusColor(dc[key]) }}>
              {dataStatusIcon(dc[key])}
            </span>
            <div>
              <div className="text-sm font-medium text-ci-charcoal">{label}</div>
              <div className="text-[10px] text-ci-gray-500 capitalize">{dc[key]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quality score */}
      <div className="flex items-center justify-between px-4 py-3 bg-ci-cream rounded-[var(--radius-md)]">
        <div>
          <div className="text-xs text-ci-gray-500 font-semibold uppercase tracking-wider mb-0.5">
            Data Quality Score
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-ci-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${dc.score}%`,
                  backgroundColor: dc.score >= 70 ? '#00A86B' : dc.score >= 40 ? '#E8732A' : '#C4392F',
                }}
              />
            </div>
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: 'var(--font-mono)',
                color: dc.score >= 70 ? '#00A86B' : dc.score >= 40 ? '#E8732A' : '#C4392F',
              }}
            >
              {dc.score}%
            </span>
          </div>
        </div>
        <Link
          href={`/projects/${projectId}/upload`}
          className="text-xs font-semibold text-ci-green hover:text-ci-green-dark transition-colors"
        >
          View Checklist →
        </Link>
      </div>
    </div>
  );
}
