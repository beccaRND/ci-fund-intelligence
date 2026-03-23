'use client';

import { useState } from 'react';
import { ProjectNarrative as NarrativeData } from '@/lib/types';
import { ChevronDown, ChevronUp, Target, AlertTriangle, Award, Clock, Pencil } from 'lucide-react';

interface Props {
  narrative: NarrativeData;
  projectName: string;
}

export default function ProjectNarrative({ narrative, projectName }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-ci-gray-100/50 transition-colors"
      >
        <h3
          className="text-base font-bold text-ci-charcoal"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Project Summary
        </h3>
        {expanded ? (
          <ChevronUp size={18} className="text-ci-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-ci-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {/* Overview paragraph */}
          <p
            className="text-[17px] text-ci-gray-700 leading-relaxed mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {narrative.overview}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Objectives */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={15} className="text-ci-green" />
                <h4
                  className="text-xs font-bold text-ci-charcoal uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Objectives
                </h4>
              </div>
              <ol className="space-y-2">
                {narrative.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="text-[11px] font-bold text-ci-green mt-0.5 shrink-0 w-4 text-right"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {i + 1}.
                    </span>
                    <span className="text-sm text-ci-gray-700">{obj}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Challenges */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={15} className="text-ci-orange" />
                <h4
                  className="text-xs font-bold text-ci-charcoal uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Challenges
                </h4>
              </div>
              <ul className="space-y-2">
                {narrative.challenges.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2.5 pl-2 border-l-2 border-ci-orange/30">
                    <span className="text-sm text-ci-gray-700">{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Results */}
          {narrative.keyResults.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Award size={15} className="text-ci-green" />
                <h4
                  className="text-xs font-bold text-ci-charcoal uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Key Results
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {narrative.keyResults.map((result, i) => (
                  <div
                    key={i}
                    className="bg-ci-green-light/50 border-l-3 border-ci-green rounded-r-[var(--radius-sm)] px-4 py-3"
                    style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--color-ci-green)' }}
                  >
                    <span className="text-sm text-ci-green-dark">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Phase */}
          <div className="bg-ci-gray-100 rounded-[var(--radius-sm)] px-4 py-3 mb-4 flex items-start gap-2.5">
            <Clock size={14} className="text-ci-gray-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-ci-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                Current Phase
              </span>
              <p className="text-sm text-ci-gray-700 mt-0.5">{narrative.currentPhase}</p>
            </div>
          </div>

          {/* Brand Partner Context */}
          {narrative.brandPartnerContext && (
            <div className="bg-ci-teal-light/30 rounded-[var(--radius-sm)] px-4 py-3 mb-4">
              <span className="text-[11px] font-bold text-ci-teal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                Brand Partner Context
              </span>
              <p className="text-sm text-ci-teal mt-0.5">{narrative.brandPartnerContext}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-ci-gray-300/30">
            <span className="text-[11px] text-ci-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
              Last updated {new Date(narrative.lastUpdated).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </span>
            <button
              disabled
              className="flex items-center gap-1.5 text-[11px] text-ci-gray-500 opacity-50 cursor-not-allowed"
              title="Editing available in production version"
            >
              <Pencil size={12} />
              Edit Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
