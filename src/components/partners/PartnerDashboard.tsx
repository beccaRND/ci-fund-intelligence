'use client';

import Link from 'next/link';
import { ArrowUpRight, Leaf } from 'lucide-react';
import { ProjectAttribution } from '@/lib/seed/brandPartners';
import { projects } from '@/lib/seed/projects';
import { commodityColor } from '@/lib/utils';

interface Props {
  attributions: ProjectAttribution[];
}

const ATTRIBUTION_LABELS: Record<string, string> = {
  direct: 'Direct',
  portfolio: 'Portfolio',
};

const ATTRIBUTION_COLORS: Record<string, string> = {
  direct: 'bg-ci-green-light text-ci-green-dark',
  portfolio: 'bg-ci-teal-light text-ci-teal',
};

export default function PartnerDashboard({ attributions }: Props) {
  // Enrich attributions with full project data
  const enriched = attributions.map((attr) => {
    const project = projects.find((p) => p.id === attr.projectId);
    return { attr, project };
  });

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="px-5 py-4 border-b border-ci-gray-300/30">
        <h3 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
          Attributed Projects
        </h3>
        <p className="text-[12px] text-ci-gray-500 mt-0.5">
          Hectares and beneficiaries allocated to this partner across the portfolio
        </p>
      </div>

      <div className="divide-y divide-ci-gray-300/20">
        {enriched.map(({ attr, project }) => {
          if (!project) return null;
          const color = commodityColor(project.commodity);

          return (
            <div key={`${attr.brandId}-${attr.projectId}`} className="px-5 py-4 hover:bg-ci-gray-100/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Commodity dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
                        {project.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ATTRIBUTION_COLORS[attr.attributionType]}`}>
                        {ATTRIBUTION_LABELS[attr.attributionType]}
                      </span>
                    </div>
                    <div className="text-[12px] text-ci-gray-500 mt-0.5">
                      {project.country} · {project.region}
                    </div>
                    {attr.notes && (
                      <p className="text-[11px] text-ci-gray-400 mt-1 leading-relaxed">{attr.notes}</p>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="shrink-0 text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                        {attr.hectares.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-ci-gray-400">ha</div>
                    </div>
                    {attr.beneficiaries > 0 && (
                      <div>
                        <div className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                          {attr.beneficiaries.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-ci-gray-400">farmers</div>
                      </div>
                    )}
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1 text-[11px] text-ci-green font-semibold hover:text-ci-green-dark transition-colors"
                    >
                      View <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Commodity tags */}
              <div className="flex items-center gap-1.5 mt-2 pl-[22px]">
                {attr.commodityFocus.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] px-2 py-0.5 rounded-full capitalize font-medium"
                    style={{ backgroundColor: color + '20', color }}
                  >
                    {c}
                  </span>
                ))}
                <span className="text-[10px] text-ci-gray-400 ml-1">· Since {attr.startYear}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-5 py-3 bg-ci-gray-100/40 border-t border-ci-gray-300/20">
        <div className="flex items-center gap-1.5">
          <Leaf size={12} className="text-ci-green" />
          <p className="text-[11px] text-ci-gray-400 italic">
            Direct attribution = primary funder of that project. Portfolio attribution = shared access across multiple brand partners.
          </p>
        </div>
      </div>
    </div>
  );
}
