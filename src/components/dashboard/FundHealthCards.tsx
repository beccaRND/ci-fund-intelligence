'use client';

import { MapPin, Users, Globe, Landmark, ArrowUp } from 'lucide-react';
import { fundSummary, projects } from '@/lib/seed/projects';
import { commodityColor, commodityLabel } from '@/lib/utils';

const commodityCounts = projects.reduce(
  (acc, p) => {
    acc[p.commodity] = (acc[p.commodity] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

const uniqueCountries = [...new Set(projects.map((p) => p.country))];

const countryFlags: Record<string, string> = {
  Mongolia: '🇲🇳',
  India: '🇮🇳',
  Argentina: '🇦🇷',
  Spain: '🇪🇸',
  France: '🇫🇷',
  'South Africa': '🇿🇦',
  Uganda: '🇺🇬',
  Pakistan: '🇵🇰',
  'Türkiye': '🇹🇷',
  Australia: '🇦🇺',
  'New Zealand': '🇳🇿',
};

export default function FundHealthCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Total Hectares */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Total Hectares
          </span>
          <Landmark size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          1.1M ha
        </div>
        <div className="text-xs text-ci-gray-500 mb-3">
          845K direct · 267K indirect
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-ci-green-light w-fit">
          <ArrowUp size={12} className="text-ci-green" />
          <span className="text-[10px] font-semibold text-ci-green-dark">
            Target exceeded
          </span>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Active Projects
          </span>
          <MapPin size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {fundSummary.totalProjects}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(commodityCounts).map(([commodity, count]) => (
            <div key={commodity} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: commodityColor(commodity) }}
              />
              <span className="text-[11px] text-ci-gray-500">
                {commodityLabel(commodity)} ({count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* People Reached */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            People Reached
          </span>
          <Users size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          105K
        </div>
        <div className="text-xs text-ci-gray-500">
          Beneficiaries across all projects
        </div>
      </div>

      {/* Countries */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Countries
          </span>
          <Globe size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {uniqueCountries.length}
        </div>
        <div className="flex flex-wrap gap-1">
          {uniqueCountries.map((c) => (
            <span key={c} className="text-base" title={c}>
              {countryFlags[c] || '🌍'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
