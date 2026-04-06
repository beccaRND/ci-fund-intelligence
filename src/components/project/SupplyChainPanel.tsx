'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { ProjectSupplyChain, RelationshipStatus } from '@/lib/seed/supplyChain';

interface Props {
  data: ProjectSupplyChain;
}

const STATUS_CONFIG: Record<RelationshipStatus, { label: string; dot: string; line: string; border: string }> = {
  active: {
    label: 'Active',
    dot: 'bg-ci-green',
    line: 'border-ci-green',
    border: 'border-ci-green/30 bg-ci-green-light/30',
  },
  potential: {
    label: 'Potential',
    dot: 'bg-ci-teal',
    line: 'border-ci-teal border-dashed',
    border: 'border-ci-teal/30 bg-ci-teal-light/20',
  },
  challenge: {
    label: 'Challenge',
    dot: 'bg-ci-orange',
    line: 'border-ci-orange',
    border: 'border-orange-200 bg-orange-50/40',
  },
};

const STATUS_BADGE: Record<RelationshipStatus, string> = {
  active: 'bg-ci-green-light text-ci-green-dark',
  potential: 'bg-ci-teal-light text-ci-teal',
  challenge: 'bg-orange-100 text-orange-700',
};

export default function SupplyChainPanel({ data }: Props) {
  const [open, setOpen] = useState(true);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-ci-gray-100/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-ci-teal-light flex items-center justify-center">
            <ArrowRight size={16} className="text-ci-teal" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Supply Chain Context
            </h3>
            <p className="text-[11px] text-ci-gray-400">Value chain from farm to brand</p>
          </div>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-ci-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-ci-gray-400" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* Summary */}
          <p className="text-[12px] text-ci-gray-500 leading-relaxed mb-4 border-t border-ci-gray-300/20 pt-4">
            {data.summary}
          </p>

          {/* Flow diagram */}
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {data.steps.map((step, i) => {
              const config = STATUS_CONFIG[step.status];
              const isLast = i === data.steps.length - 1;
              const isActive = activeStep === i;

              return (
                <div key={step.stage} className="flex items-start">
                  {/* Step card */}
                  <div className="flex flex-col items-center" style={{ minWidth: '120px' }}>
                    <button
                      onClick={() => setActiveStep(isActive ? null : i)}
                      className={`w-full border rounded-[var(--radius-sm)] px-3 py-2.5 text-center transition-all ${config.border} ${
                        isActive ? 'ring-1 ring-ci-green/40 shadow-sm' : ''
                      } hover:shadow-sm`}
                    >
                      <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${config.dot}`} />
                      <div
                        className="text-[11px] font-bold text-ci-charcoal leading-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {step.stage}
                      </div>
                      <span
                        className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_BADGE[step.status]}`}
                      >
                        {config.label}
                      </span>
                    </button>
                  </div>

                  {/* Arrow connector */}
                  {!isLast && (
                    <div className="flex items-center mt-6 mx-1 shrink-0">
                      <div className={`w-6 h-0 border-t-2 ${config.line}`} />
                      <ArrowRight size={10} className="text-ci-gray-300 -ml-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active step detail */}
          {activeStep !== null && (
            <div className="mt-4 p-3 bg-ci-gray-100/50 rounded-[var(--radius-sm)] border border-ci-gray-300/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
                  {data.steps[activeStep].stage}
                </span>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[data.steps[activeStep].status]}`}
                >
                  {STATUS_CONFIG[data.steps[activeStep].status].label}
                </span>
              </div>

              <div className="mb-2">
                <div className="text-[10px] font-semibold text-ci-gray-500 uppercase tracking-wider mb-1">Actors</div>
                <div className="flex flex-wrap gap-1">
                  {data.steps[activeStep].actors.map((actor) => (
                    <span
                      key={actor}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-ci-white border border-ci-gray-300/50 text-ci-gray-600"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {data.steps[activeStep].notes && (
                <p className="text-[11px] text-ci-gray-500 leading-relaxed">
                  {data.steps[activeStep].notes}
                </p>
              )}
            </div>
          )}

          {!activeStep && (
            <p className="text-[10px] text-ci-gray-400 italic mt-3">
              Click any stage to see detail on actors and notes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
