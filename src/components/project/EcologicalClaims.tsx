'use client';

import { useState } from 'react';
import { Sun, Sprout, Droplets, Bug, Users, Heart, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { projectClaims, type EcologicalClaim, type ClaimPrinciple } from '@/lib/seed/ecologicalClaims';

interface Props {
  projectId: string;
}

const PRINCIPLE_CONFIG: Record<ClaimPrinciple, {
  label: string;
  icon: typeof Sun;
  color: string;
  bgLight: string;
}> = {
  climate:       { label: 'Climate',        icon: Sun,      color: '#E8732A', bgLight: '#FEF3EC' },
  soil:          { label: 'Soil Health',    icon: Sprout,   color: '#7A5C2E', bgLight: '#F5F0EA' },
  water:         { label: 'Water',          icon: Droplets, color: '#007B7F', bgLight: '#E5F2F3' },
  biodiversity:  { label: 'Biodiversity',  icon: Bug,      color: '#4A7C59', bgLight: '#EBF4EF' },
  livelihoods:   { label: 'Livelihoods',   icon: Users,    color: '#6B5CA5', bgLight: '#F0EBF9' },
  animal_welfare:{ label: 'Animal Welfare', icon: Heart,    color: '#C4392F', bgLight: '#FCECEA' },
};

const STATUS_CONFIG = {
  active:  { label: 'Active',   bg: '#E8F5EF', color: '#007A4D' },
  draft:   { label: 'Draft',    bg: '#FEF3EC', color: '#C45E1A' },
  pending: { label: 'Pending',  bg: '#F0F0EC', color: '#7A7A7A' },
};

function ClaimCard({ claim }: { claim: EcologicalClaim }) {
  const principle = PRINCIPLE_CONFIG[claim.principle];
  const Icon = principle.icon;
  const status = STATUS_CONFIG[claim.status];

  return (
    <div
      className="bg-ci-white rounded-[var(--radius-sm)] border border-ci-gray-300/60 overflow-hidden flex flex-col transition-all hover:shadow-[var(--shadow-md)] hover:border-ci-gray-300"
      style={{ borderLeft: `3px solid ${principle.color}` }}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 flex-1">
        {/* Principle + status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: principle.bgLight }}
            >
              <Icon size={12} style={{ color: principle.color }} />
            </div>
            <span
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: principle.color, fontFamily: 'var(--font-display)' }}
            >
              {principle.label}
            </span>
          </div>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {/* Claim ID */}
        <div
          className="text-[10px] text-ci-gray-500 mb-2"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {claim.id}
        </div>

        {/* Statement */}
        <p className="text-[13px] font-semibold text-ci-charcoal leading-snug mb-2">
          {claim.statement}
        </p>

        {/* Evidence method */}
        <p className="text-[11px] text-ci-gray-500 italic leading-relaxed">
          {claim.evidenceMethod}
        </p>
      </div>

      {/* Card footer */}
      <div className="px-4 py-2.5 bg-ci-gray-100/40 border-t border-ci-gray-300/40 flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded"
          style={{
            backgroundColor: principle.bgLight,
            color: principle.color,
            fontFamily: 'var(--font-display)',
          }}
        >
          {claim.alignmentStandard}
        </span>
        {claim.issuedDate && (
          <span
            className="text-[10px] text-ci-gray-500"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Issued {new Date(claim.issuedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </span>
        )}
        {!claim.issuedDate && (
          <span className="text-[10px] text-ci-gray-400 italic">
            {claim.status === 'draft' ? 'Under review' : 'Not yet issued'}
          </span>
        )}
      </div>
    </div>
  );
}

export default function EcologicalClaims({ projectId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const data = projectClaims[projectId];

  if (!data) return null;

  const { claims } = data;
  const activeCount = claims.filter(c => c.status === 'active').length;
  const draftCount  = claims.filter(c => c.status === 'draft').length;

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-ci-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ci-green/10 flex items-center justify-center">
            <Layers size={15} className="text-ci-green" />
          </div>
          <div className="text-left">
            <h3
              className="text-base font-bold text-ci-charcoal leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ecological Claims Registry
            </h3>
            <p className="text-[11px] text-ci-gray-500 mt-0.5">
              Multi-outcome verifiable claims · Regen Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Claim status summary */}
          <div className="flex items-center gap-2 text-[11px]">
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-ci-green-light text-ci-green-dark font-semibold">
                {activeCount} active
              </span>
            )}
            {draftCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-ci-orange/10 text-ci-orange font-semibold">
                {draftCount} draft
              </span>
            )}
          </div>

          {expanded ? (
            <ChevronUp size={18} className="text-ci-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-ci-gray-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {/* Explainer */}
          <div className="flex items-start gap-2 mb-5 px-3 py-2.5 bg-ci-green-light/30 rounded-[var(--radius-sm)] border border-ci-green/10">
            <Layers size={13} className="text-ci-green mt-0.5 shrink-0" />
            <p className="text-[12px] text-ci-gray-700 leading-relaxed">
              CI's 6-principle monitoring data structured as verifiable ecological claims — each with a unique denom, evidence method, and alignment standard. These position CI ahead of TNFD disclosure requirements and Verra S3S (Q3 2026).
            </p>
          </div>

          {/* Principle legend */}
          <div className="flex flex-wrap gap-2 mb-5">
            {(Object.entries(PRINCIPLE_CONFIG) as [ClaimPrinciple, typeof PRINCIPLE_CONFIG[ClaimPrinciple]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div
                  key={key}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium"
                  style={{ backgroundColor: cfg.bgLight, color: cfg.color }}
                >
                  <Icon size={10} />
                  {cfg.label}
                </div>
              );
            })}
          </div>

          {/* Claims grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {claims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-ci-gray-300/30 mt-4 flex items-center justify-between">
            <span
              className="text-[10px] text-ci-gray-500"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Regen Registry · Multi-outcome claims architecture · v0.1-beta
            </span>
            <span className="text-[10px] text-ci-gray-400 italic">
              Ahead of Verra S3S launch Q3 2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
