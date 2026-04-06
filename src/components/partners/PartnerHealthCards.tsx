'use client';

import { Leaf, Users, FolderOpen, Star } from 'lucide-react';
import { BrandPartner } from '@/lib/seed/brandPartners';

interface Props {
  partner: BrandPartner;
  metrics: {
    totalHectares: number;
    totalBeneficiaries: number;
    totalProjects: number;
    directHectares: number;
    portfolioHectares: number;
    commodities: string[];
  };
}

const TIER_LABELS: Record<string, string> = {
  founding: 'Founding Partner',
  growth: 'Growth Partner',
  emerging: 'Emerging Partner',
};

export default function PartnerHealthCards({ partner, metrics }: Props) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Hectares */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-ci-green-light flex items-center justify-center">
            <Leaf size={18} className="text-ci-green" />
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ci-green-light text-ci-green-dark" style={{ fontFamily: 'var(--font-display)' }}>
            ↑ Growing
          </span>
        </div>
        <div className="text-2xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
          {metrics.totalHectares.toLocaleString()}
        </div>
        <div className="text-xs text-ci-gray-500 mt-0.5">hectares attributed</div>
        <div className="mt-2 text-[11px] text-ci-gray-400">
          {metrics.directHectares.toLocaleString()} direct · {metrics.portfolioHectares.toLocaleString()} portfolio
        </div>
      </div>

      {/* Beneficiaries */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-ci-teal-light flex items-center justify-center">
            <Users size={18} className="text-ci-teal" />
          </div>
        </div>
        <div className="text-2xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
          {metrics.totalBeneficiaries.toLocaleString()}
        </div>
        <div className="text-xs text-ci-gray-500 mt-0.5">farmer beneficiaries</div>
        <div className="mt-2 text-[11px] text-ci-gray-400">
          Across {metrics.totalProjects} active projects
        </div>
      </div>

      {/* Projects */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-orange-50 flex items-center justify-center">
            <FolderOpen size={18} className="text-ci-orange" />
          </div>
        </div>
        <div className="text-2xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
          {metrics.totalProjects}
        </div>
        <div className="text-xs text-ci-gray-500 mt-0.5">projects in portfolio</div>
        <div className="mt-2 text-[11px] text-ci-gray-400 capitalize">
          {metrics.commodities.join(' · ')}
        </div>
      </div>

      {/* Partnership status */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-ci-green-light flex items-center justify-center">
            <Star size={18} className="text-ci-green" />
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ci-green-light text-ci-green-dark" style={{ fontFamily: 'var(--font-display)' }}>
            Active
          </span>
        </div>
        <div className="text-2xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
          Year {new Date().getFullYear() - partner.since + 1}
        </div>
        <div className="text-xs text-ci-gray-500 mt-0.5">{TIER_LABELS[partner.tier]}</div>
        <div className="mt-2 text-[11px] text-ci-gray-400">
          Since {partner.since}
        </div>
      </div>
    </div>
  );
}
