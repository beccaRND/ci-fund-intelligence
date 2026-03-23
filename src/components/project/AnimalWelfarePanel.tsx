'use client';

import { projectAnimalWelfare } from '@/lib/seed/projects';
import { Heart, ShieldCheck, BookOpen, Bug } from 'lucide-react';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import Link from 'next/link';

interface Props {
  projectId: string;
}

export default function AnimalWelfarePanel({ projectId }: Props) {
  const aw = projectAnimalWelfare[projectId];

  if (!aw) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 text-center">
        <p className="text-sm text-ci-gray-500">No animal welfare data available for this project.</p>
      </div>
    );
  }

  // Not applicable (cotton projects)
  if (!aw.applicable) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={18} className="text-ci-gray-300" />
          <h4 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Animal Welfare
          </h4>
        </div>
        <div className="bg-ci-cream rounded-[var(--radius-md)] p-5 text-center">
          <p className="text-sm text-ci-gray-700 font-medium mb-2">
            This principle is not directly applicable to cotton production projects.
          </p>
          <p className="text-xs text-ci-gray-500 leading-relaxed max-w-md mx-auto">
            Cotton projects may still have indirect animal welfare considerations
            through habitat preservation and reduced pesticide impacts on wildlife.
            See the Biodiversity tab for wildlife context.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-status-gap" />
            <h4 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Livestock Overview
            </h4>
          </div>
          <DataSourceBadge source="field" label="CI Reports" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
            <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Type</div>
            <div className="text-sm font-bold text-ci-charcoal">{aw.livestockType}</div>
          </div>
          <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
            <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Headcount</div>
            <div className="text-sm font-bold text-ci-charcoal">
              {aw.estimatedHeadcount ? aw.estimatedHeadcount.toLocaleString() : 'Not reported'}
            </div>
          </div>
          <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
            <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Stocking Density</div>
            <div className="text-sm font-bold text-ci-charcoal">{aw.stockingDensity ?? 'Not reported'}</div>
          </div>
        </div>

        {/* Welfare notes */}
        <p className="text-sm text-ci-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
          {aw.welfareNotes}
        </p>
      </div>

      {/* Certifications */}
      {aw.certifications.length > 0 && (
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-ci-green" />
            <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              Certifications
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {aw.certifications.map((cert) => (
              <span
                key={cert}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-ci-green-light text-ci-green-dark"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Practices documented */}
      {aw.practicesDocumented.length > 0 && (
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-ci-teal" />
            <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              Documented Practices
            </h4>
          </div>
          <ul className="space-y-2">
            {aw.practicesDocumented.map((practice) => (
              <li key={practice} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ci-teal mt-1.5 shrink-0" />
                <span className="text-sm text-ci-gray-700">{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
