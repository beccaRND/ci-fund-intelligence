'use client';

import { MapPin, Users, Globe, Landmark, ArrowUp, CalendarDays } from 'lucide-react';
import { projects } from '@/lib/seed/projects';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-tour="dashboard-cards">
      {/* Total Hectares */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Total Hectares
          </span>
          <Landmark size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          1,111,404 ha
        </div>
        <div className="text-xs text-ci-gray-500 mb-3">
          844,821 direct · 266,583 indirect
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-ci-green-light">
            <ArrowUp size={10} className="text-ci-green" />
            <span className="text-[10px] font-semibold text-ci-green-dark">
              Target exceeded
            </span>
          </div>
          <span className="text-[10px] text-ci-gray-400" style={{ fontFamily: 'var(--font-mono)' }}>
            ↑69% YOY
          </span>
        </div>
      </div>

      {/* Beneficiaries */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Beneficiaries
          </span>
          <Users size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          105,145
        </div>
        <div className="text-xs text-ci-gray-500 mb-3">
          35,677 direct · 69,468 indirect
        </div>
        <span className="text-[10px] text-ci-gray-400" style={{ fontFamily: 'var(--font-mono)' }}>
          ↑116% YOY
        </span>
      </div>

      {/* Active Grantees */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Active Grantees
          </span>
          <MapPin size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          11
        </div>
        <div className="text-xs text-ci-gray-500 mb-2">
          4 commodities · {uniqueCountries.length} countries
        </div>
        <div className="flex flex-wrap gap-1">
          {uniqueCountries.map((c) => (
            <span key={c} className="text-sm" title={c}>
              {countryFlags[c] || '🌍'}
            </span>
          ))}
        </div>
      </div>

      {/* Fund Health */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5 border-t-2 border-ci-green hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Fund Health
          </span>
          <CalendarDays size={16} className="text-ci-gray-300" />
        </div>
        <div className="text-[32px] font-bold text-ci-charcoal leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Year 4
        </div>
        <div className="text-xs text-ci-gray-500 mb-2">
          Launched 2021 · Kering + Inditex
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-ci-green-light text-ci-green-dark font-semibold">
          Active · New partners incoming
        </span>
      </div>
    </div>
  );
}
