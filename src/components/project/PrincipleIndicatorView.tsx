'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Circle, CircleDot } from 'lucide-react';
import { getIndicatorsByPrinciple, getCoreIndicators, type MEIndicator } from '@/lib/meFramework';

type Principle = 'livelihoods' | 'climate' | 'biodiversity' | 'water' | 'soil' | 'animal_welfare';

// Data availability status per indicator
// For the prototype, most indicators show ○ (no data) or ◐ (public baseline only).
// cli-04 gets ◐ because SoilGrids provides SOC baseline.
// sol-01/sol-02 get ◐ from SoilGrids/satellite data.
// cli-02/cli-03 get ◐ from Open-Meteo satellite.
const PUBLIC_DATA_INDICATORS = new Set([
  'cli-02', 'cli-03', 'cli-04', 'sol-01', 'sol-02', 'wat-01',
]);

type DataStatus = 'submitted' | 'baseline' | 'none';

function getDataStatus(indicatorId: string): DataStatus {
  if (PUBLIC_DATA_INDICATORS.has(indicatorId)) return 'baseline';
  return 'none';
}

function StatusDot({ status }: { status: DataStatus }) {
  if (status === 'submitted') {
    return <CircleDot size={12} className="text-ci-green shrink-0" />;
  }
  if (status === 'baseline') {
    return (
      <span className="inline-flex shrink-0" title="Public/satellite data provides a baseline">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="5" fill="none" stroke="#00A86B" strokeWidth="1.5" />
          <path d="M6 1 A5 5 0 0 1 11 6 L6 6 Z" fill="#00A86B" />
        </svg>
      </span>
    );
  }
  return <Circle size={12} className="text-ci-gray-300 shrink-0" />;
}

function StatusLabel({ status }: { status: DataStatus }) {
  if (status === 'submitted') return (
    <span className="text-[9px] font-semibold text-ci-green bg-ci-green-light px-1.5 py-0.5 rounded-full">
      Data submitted
    </span>
  );
  if (status === 'baseline') return (
    <span className="text-[9px] font-semibold text-ci-teal bg-ci-teal-light px-1.5 py-0.5 rounded-full">
      Satellite baseline
    </span>
  );
  return (
    <span className="text-[9px] font-semibold text-ci-gray-400 bg-ci-gray-100 px-1.5 py-0.5 rounded-full">
      No data
    </span>
  );
}

function IndicatorRow({ indicator }: { indicator: MEIndicator }) {
  const status = getDataStatus(indicator.id);

  return (
    <div className="py-3 border-b border-ci-gray-300/30 last:border-0">
      <div className="flex items-start gap-2.5 mb-1.5">
        <StatusDot status={status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[12px] font-semibold text-ci-charcoal leading-snug">
              {indicator.indicator}
            </span>
            <StatusLabel status={status} />
          </div>
          <p className="text-[11px] text-ci-gray-500 mt-0.5 leading-relaxed">
            {indicator.metric}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-[20px] text-[10px] text-ci-gray-400">
        <span><span className="text-ci-gray-500 font-medium">Method:</span> {indicator.measurementMethod}</span>
        <span><span className="text-ci-gray-500 font-medium">Freq:</span> {indicator.frequency}</span>
        {indicator.frameworkAlignment !== 'N/A' && (
          <span><span className="text-ci-gray-500 font-medium">Alignment:</span> {indicator.frameworkAlignment}</span>
        )}
      </div>
    </div>
  );
}

interface GroupedIndicators {
  outcome: string;
  indicators: MEIndicator[];
}

function groupByOutcome(indicators: MEIndicator[]): GroupedIndicators[] {
  const map = new Map<string, MEIndicator[]>();
  for (const ind of indicators) {
    const list = map.get(ind.outcome) ?? [];
    list.push(ind);
    map.set(ind.outcome, list);
  }
  return Array.from(map.entries()).map(([outcome, inds]) => ({ outcome, indicators: inds }));
}

interface Props {
  principle: Principle;
  commodity?: string;
}

const LIVESTOCK_COMMODITIES = new Set(['wool', 'cashmere', 'leather']);

export default function PrincipleIndicatorView({ principle, commodity }: Props) {
  const [showAdditional, setShowAdditional] = useState(false);

  const allIndicators = getIndicatorsByPrinciple(principle);

  // Animal welfare only applies to livestock commodities
  if (principle === 'animal_welfare' && commodity && !LIVESTOCK_COMMODITIES.has(commodity)) {
    return (
      <div className="mt-4 px-4 py-3 bg-ci-gray-100/50 rounded-[var(--radius-sm)] border border-ci-gray-300/30">
        <p className="text-[12px] text-ci-gray-500 italic">
          Animal welfare indicators apply to livestock commodities (wool, cashmere, leather) only. This project involves cotton — welfare indicators are not applicable.
        </p>
      </div>
    );
  }

  const coreIndicators = allIndicators.filter((i) => i.tier === 'core');
  const additionalIndicators = allIndicators.filter((i) => i.tier === 'additional');
  const coreGroups = groupByOutcome(coreIndicators);

  const coreWithData = coreIndicators.filter((i) => getDataStatus(i.id) !== 'none').length;
  const totalCore = coreIndicators.length;

  return (
    <div className="mt-4">
      {/* Framework header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            M&E Framework — {allIndicators.length} indicators
          </span>
          <span className="text-[11px] text-ci-gray-400 ml-2">
            ({totalCore} core, {additionalIndicators.length} additional)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-ci-gray-500">
          <span className="flex items-center gap-1">
            <CircleDot size={10} className="text-ci-green" /> Submitted
          </span>
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="none" stroke="#00A86B" strokeWidth="1.5" />
              <path d="M6 1 A5 5 0 0 1 11 6 L6 6 Z" fill="#00A86B" />
            </svg>
            Baseline
          </span>
          <span className="flex items-center gap-1">
            <Circle size={10} className="text-ci-gray-300" /> No data
          </span>
        </div>
      </div>

      {/* Data completeness mini bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-ci-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.round((coreWithData / totalCore) * 100)}%`,
              backgroundColor: coreWithData === 0 ? '#E5E5E0' : '#00A86B',
            }}
          />
        </div>
        <span className="text-[10px] text-ci-gray-500 shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>
          {coreWithData}/{totalCore} core indicators with data
        </span>
      </div>

      {/* Core indicators grouped by outcome */}
      <div className="border border-ci-gray-300/50 rounded-[var(--radius-sm)] overflow-hidden mb-3">
        <div className="px-4 py-2 bg-ci-gray-100/60 border-b border-ci-gray-300/40">
          <span className="text-[10px] font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            Core Indicators
          </span>
        </div>
        <div className="px-4">
          {coreGroups.map((group) => (
            <div key={group.outcome} className="mb-2">
              <div className="text-[10px] font-semibold text-ci-teal uppercase tracking-wider pt-3 pb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {group.outcome}
              </div>
              {group.indicators.map((ind) => (
                <IndicatorRow key={ind.id} indicator={ind} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Additional indicators — collapsed by default */}
      {additionalIndicators.length > 0 && (
        <div className="border border-ci-gray-300/40 rounded-[var(--radius-sm)] overflow-hidden">
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-ci-gray-100/40 hover:bg-ci-gray-100/70 transition-colors"
          >
            <span className="text-[10px] font-bold text-ci-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              Additional Indicators ({additionalIndicators.length})
            </span>
            {showAdditional ? (
              <ChevronUp size={14} className="text-ci-gray-400" />
            ) : (
              <ChevronDown size={14} className="text-ci-gray-400" />
            )}
          </button>
          {showAdditional && (
            <div className="px-4">
              {additionalIndicators.map((ind) => (
                <IndicatorRow key={ind.id} indicator={ind} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Framework source note */}
      <p className="text-[10px] text-ci-gray-400 italic mt-3">
        CI Regenerative Fund for Nature M&E Framework · {allIndicators.length} indicators across {new Set(allIndicators.map((i) => i.outcome)).size} outcomes
      </p>
    </div>
  );
}
