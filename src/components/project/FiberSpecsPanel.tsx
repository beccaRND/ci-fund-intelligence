'use client';

import { Package, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { fiberData, type FiberSpec } from '@/lib/seed/fiberSpecs';

interface Props {
  projectId: string;
}

const CERT_COLORS: Record<string, { bg: string; text: string }> = {
  'RWS': { bg: '#E5F0FF', text: '#1A56DB' },
  'Wildlife Friendly': { bg: '#EBF4EF', text: '#4A7C59' },
  'Organic': { bg: '#FEF3EC', text: '#C45E1A' },
};

function FiberCard({ fiber }: { fiber: FiberSpec }) {
  const hasSpecs = fiber.fiberThickness || fiber.fiberLength || fiber.fiberColor || fiber.breeds;

  return (
    <div className="border border-ci-gray-300/60 rounded-[var(--radius-sm)] overflow-hidden">
      {/* Fiber type header */}
      <div className="px-4 py-2.5 bg-ci-gray-100/40 border-b border-ci-gray-300/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={13} className="text-ci-teal" />
          <span
            className="text-[13px] font-bold text-ci-charcoal"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {fiber.fiberType}
          </span>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            fiber.certificationStatus === 'Certified'
              ? 'bg-ci-green-light text-ci-green-dark'
              : fiber.certificationStatus === 'Compliance in progress'
              ? 'bg-ci-orange/10 text-ci-orange'
              : 'bg-ci-gray-100 text-ci-gray-500'
          }`}
        >
          {fiber.certificationStatus}
        </span>
      </div>

      {/* Specs */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
        {/* Volume */}
        <div>
          <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
            Volume
          </div>
          <div className="text-[13px] font-semibold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
            {fiber.volume}
          </div>
          {fiber.volumeNote && (
            <div className="text-[10px] text-ci-gray-400 italic">{fiber.volumeNote}</div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
            Certifications
          </div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {fiber.certifications.map((cert) => {
              const style = CERT_COLORS[cert] || { bg: '#F0F0EC', text: '#7A7A7A' };
              return (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  <Award size={8} />
                  {cert}
                </span>
              );
            })}
          </div>
        </div>

        {/* Optional quality specs */}
        {hasSpecs && (
          <>
            {fiber.breeds && (
              <div>
                <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                  Breeds
                </div>
                <div className="text-[12px] text-ci-charcoal">{fiber.breeds}</div>
              </div>
            )}
            {fiber.fiberThickness && (
              <div>
                <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                  Thickness
                </div>
                <div className="text-[12px] font-medium text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                  {fiber.fiberThickness}
                </div>
              </div>
            )}
            {fiber.fiberLength && (
              <div>
                <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                  Staple Length
                </div>
                <div className="text-[12px] font-medium text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                  {fiber.fiberLength}
                </div>
              </div>
            )}
            {fiber.fiberColor && (
              <div>
                <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                  Color
                </div>
                <div className="text-[12px] text-ci-charcoal">{fiber.fiberColor}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FiberSpecsPanel({ projectId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const data = fiberData[projectId];

  if (!data) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-ci-gray-100/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ci-teal-light flex items-center justify-center">
              <Package size={15} className="text-ci-teal" />
            </div>
            <div className="text-left">
              <h3
                className="text-base font-bold text-ci-charcoal leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Commodity & Fiber Specifications
              </h3>
              <p className="text-[11px] text-ci-gray-500 mt-0.5">
                Volume, quality specs, and certifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-ci-gray-400 italic">Not yet documented</span>
            {expanded ? <ChevronUp size={18} className="text-ci-gray-500" /> : <ChevronDown size={18} className="text-ci-gray-500" />}
          </div>
        </button>

        {expanded && (
          <div className="px-6 pb-6">
            <div className="flex items-start gap-3 px-4 py-3 bg-ci-gray-100/50 rounded-[var(--radius-sm)] border border-ci-gray-300/40">
              <Package size={14} className="text-ci-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[13px] text-ci-gray-600 leading-relaxed">
                  Commodity specifications have not yet been documented for this project.
                </p>
                <p className="text-[11px] text-ci-gray-400 mt-1 italic">
                  Contact your project lead to add fiber volume, quality specs, and certification data. This panel supports micron count, staple length, color, breed, and certification status for all commodities.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-ci-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ci-teal-light flex items-center justify-center">
            <Package size={15} className="text-ci-teal" />
          </div>
          <div className="text-left">
            <h3
              className="text-base font-bold text-ci-charcoal leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Commodity & Fiber Specifications
            </h3>
            <p className="text-[11px] text-ci-gray-500 mt-0.5">
              Volume, quality specs, and certifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-ci-teal-light text-ci-teal">
            {data.fibers.length} fiber{data.fibers.length !== 1 ? 's' : ''}
          </span>
          {expanded ? <ChevronUp size={18} className="text-ci-gray-500" /> : <ChevronDown size={18} className="text-ci-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {/* Fiber cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
            {data.fibers.map((fiber) => (
              <FiberCard key={fiber.fiberType} fiber={fiber} />
            ))}
          </div>

          {/* Value chain notes */}
          {data.valueChainNotes && (
            <div className="mb-3 p-3 bg-ci-cream/30 rounded-[var(--radius-sm)] border border-ci-green/10">
              <div className="text-[10px] font-semibold text-ci-gray-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                Value Chain Context
              </div>
              <p className="text-[12px] text-ci-gray-700 leading-relaxed">{data.valueChainNotes}</p>
            </div>
          )}

          {/* Market access notes */}
          {data.marketAccess && (
            <div className="p-3 bg-ci-green-light/30 rounded-[var(--radius-sm)] border border-ci-green/10">
              <div className="text-[10px] font-semibold text-ci-gray-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                Market Access & Next Steps
              </div>
              <p className="text-[12px] text-ci-gray-700 leading-relaxed">{data.marketAccess}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
