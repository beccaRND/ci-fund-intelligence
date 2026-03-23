'use client';

import { Upload, BarChart3, ClipboardList, Globe, ArrowRight } from 'lucide-react';

const connections = [
  {
    id: 'spreadsheet',
    icon: Upload,
    label: 'Spreadsheet Upload',
    description: 'Upload Excel (.xlsx) or CSV files with M&E data',
    status: 'active' as const,
  },
  {
    id: 'powerbi',
    icon: BarChart3,
    label: 'Microsoft Power BI',
    description: 'Connect to existing RFFN dashboards via REST API. Requires: Power BI Pro/Premium license, Azure AD service principal, workspace access grant.',
    status: 'coming_soon' as const,
  },
  {
    id: 'activityinfo',
    icon: ClipboardList,
    label: 'ActivityInfo',
    description: 'Sync with CI\'s MEAL system via REST API. Requires: ActivityInfo API token and database ID.',
    status: 'coming_soon' as const,
  },
  {
    id: 'gee',
    icon: Globe,
    label: 'Google Earth Engine',
    description: 'Pull satellite imagery and vegetation indices directly. Requires: GEE service account.',
    status: 'coming_soon' as const,
  },
];

interface Props {
  onUploadClick: () => void;
}

export default function DataConnections({ onUploadClick }: Props) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
          Data Connections
        </h3>
        <p className="text-xs text-ci-gray-500 mt-1">
          Import data from external systems or upload directly
        </p>
      </div>

      <div className="space-y-3">
        {connections.map((conn) => {
          const Icon = conn.icon;
          const isActive = conn.status === 'active';

          return (
            <div
              key={conn.id}
              className={`bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-4 border transition-colors ${
                isActive
                  ? 'border-ci-green/20 hover:border-ci-green/40'
                  : 'border-ci-gray-300/30 opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-ci-green-light' : 'bg-ci-gray-100'
                }`}>
                  <Icon size={18} className={isActive ? 'text-ci-green' : 'text-ci-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
                      {conn.label}
                    </h4>
                    {!isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ci-gray-100 text-ci-gray-500 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ci-gray-500 leading-relaxed">
                    {conn.description}
                  </p>
                </div>
                {isActive && (
                  <button
                    onClick={onUploadClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-ci-green text-white text-xs font-semibold hover:bg-ci-green-dark transition-colors shrink-0"
                  >
                    Upload <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ci-gray-500 mt-4 text-center">
        Need a different integration? Contact your Regen technical team.
      </p>
    </div>
  );
}
