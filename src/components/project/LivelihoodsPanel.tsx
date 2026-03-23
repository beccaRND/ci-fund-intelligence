'use client';

import { useEffect, useState } from 'react';
import { projectLivelihoodContext } from '@/lib/seed/projects';
import { Users, Globe, AlertCircle, Info } from 'lucide-react';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';

interface Props {
  projectId: string;
  country: string;
}

interface WDIMetric {
  label: string;
  value: string;
  year: number | null;
}

export default function LivelihoodsPanel({ projectId, country }: Props) {
  const ctx = projectLivelihoodContext[projectId];
  const [wdiData, setWdiData] = useState<WDIMetric[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ctx?.countryCode) return;

    async function fetchWDI() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/livelihoods?countryCode=${ctx.countryCode}`);
        if (!res.ok) throw new Error('Failed to fetch livelihood data');
        const data = await res.json();
        setWdiData(data.metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchWDI();
  }, [ctx?.countryCode]);

  if (!ctx) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 text-center">
        <p className="text-sm text-ci-gray-500">No livelihood data available for this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* World Bank WDI section */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-source-public" />
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Country-Level Indicators: {country}
            </h4>
          </div>
          <DataSourceBadge source="public" label="World Bank WDI" />
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <Info size={12} className="text-ci-gray-500 shrink-0" />
          <p className="text-[11px] text-ci-gray-500">
            Country-level indicators from World Bank WDI. Subnational data for {ctx.subnationalRegion} can be added by CI staff.
          </p>
        </div>

        {loading && <LoadingSkeleton height="h-32" label="Loading World Bank data..." />}

        {error && (
          <div className="flex items-center gap-2 text-ci-orange p-3 bg-ci-orange-light rounded-[var(--radius-sm)]">
            <AlertCircle size={14} />
            <span className="text-xs">{error}</span>
          </div>
        )}

        {wdiData && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {wdiData.map((m) => (
              <div key={m.label} className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
                <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1 truncate" title={m.label}>
                  {m.label}
                </div>
                <div className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                  {m.value}
                </div>
                {m.year && (
                  <div className="text-[10px] text-ci-gray-500 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                    {m.year}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && !wdiData && (
          <div className="text-center py-6 text-ci-gray-500 text-sm">
            API route not yet configured. Will display live World Bank data.
          </div>
        )}
      </div>

      {/* Subnational / project-level context */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-source-modeled" />
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Project-Level Context: {ctx.subnationalRegion}
            </h4>
          </div>
          <DataSourceBadge source="field" label="CI Reports" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {ctx.estimatedBeneficiaries && (
            <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
              <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Beneficiaries</div>
              <div className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                {ctx.estimatedBeneficiaries.toLocaleString()}
              </div>
              {ctx.beneficiaryBreakdown && (
                <div className="text-xs text-ci-gray-500 mt-0.5">{ctx.beneficiaryBreakdown}</div>
              )}
            </div>
          )}
          {ctx.averageFarmSize && (
            <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
              <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Farm Size</div>
              <div className="text-sm font-bold text-ci-charcoal">{ctx.averageFarmSize}</div>
            </div>
          )}
          <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
            <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Primary Livelihood</div>
            <div className="text-sm font-bold text-ci-charcoal">{ctx.primaryLivelihood}</div>
          </div>
          {ctx.indigenousContext && (
            <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3">
              <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Indigenous Context</div>
              <div className="text-xs text-ci-gray-700 leading-relaxed">{ctx.indigenousContext}</div>
            </div>
          )}
        </div>

        {ctx.incomeContext && (
          <div className="bg-ci-cream rounded-[var(--radius-sm)] p-3 mb-4">
            <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Income Context</div>
            <div className="text-xs text-ci-gray-700 leading-relaxed">{ctx.incomeContext}</div>
          </div>
        )}

        <p className="text-sm text-ci-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
          {ctx.livelihoodNotes}
        </p>
      </div>
    </div>
  );
}
