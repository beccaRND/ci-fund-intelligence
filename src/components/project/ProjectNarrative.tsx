'use client';

import { useState } from 'react';
import { ProjectNarrative as NarrativeData } from '@/lib/types';
import { ChevronDown, ChevronUp, Target, AlertTriangle, Award, Clock, Pencil, Briefcase, Sparkles } from 'lucide-react';

interface Props {
  narrative: NarrativeData;
  projectName: string;
}

export default function ProjectNarrative({ narrative, projectName }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  const visibleChallenges = showAllChallenges ? narrative.challenges : narrative.challenges.slice(0, 2);

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-ci-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ci-green/10 flex items-center justify-center">
            <Sparkles size={15} className="text-ci-green" />
          </div>
          <h3
            className="text-base font-bold text-ci-charcoal"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Project Summary
          </h3>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-ci-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-ci-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {/* Overview — compact with left accent */}
          <div className="border-l-[3px] border-ci-green/40 pl-4 mb-6">
            <p
              className="text-[15px] text-ci-gray-700 leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {narrative.overview}
            </p>
          </div>

          {/* Current Phase + Brand Partner — inline banner row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 bg-ci-gray-100 rounded-[var(--radius-sm)] px-4 py-2.5 flex items-center gap-2.5">
              <Clock size={14} className="text-ci-gray-500 shrink-0" />
              <span className="text-[13px] text-ci-gray-700">{narrative.currentPhase}</span>
            </div>
            {narrative.brandPartnerContext && (
              <div className="flex-1 bg-ci-teal-light/20 rounded-[var(--radius-sm)] px-4 py-2.5 flex items-center gap-2.5">
                <Briefcase size={14} className="text-ci-teal shrink-0" />
                <span className="text-[13px] text-ci-teal">{narrative.brandPartnerContext}</span>
              </div>
            )}
          </div>

          {/* Three-column grid: Objectives | Key Results | Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            {/* Objectives */}
            <div className="bg-ci-green-light/20 rounded-[var(--radius-sm)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-ci-green" />
                <h4
                  className="text-[11px] font-bold text-ci-green uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Objectives
                </h4>
              </div>
              <ol className="space-y-2">
                {narrative.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="text-[10px] font-bold text-ci-green bg-ci-green/10 rounded-full w-[18px] h-[18px] flex items-center justify-center mt-0.5 shrink-0"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-ci-gray-700 leading-snug">{obj}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Results */}
            {narrative.keyResults.length > 0 && (
              <div className="bg-ci-green-light/20 rounded-[var(--radius-sm)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={14} className="text-ci-green" />
                  <h4
                    className="text-[11px] font-bold text-ci-green uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Key Results
                  </h4>
                </div>
                <ul className="space-y-2">
                  {narrative.keyResults.map((result, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-ci-green mt-1 shrink-0">•</span>
                      <span className="text-[13px] text-ci-gray-700 leading-snug">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges */}
            <div className="bg-ci-orange/5 rounded-[var(--radius-sm)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-ci-orange" />
                <h4
                  className="text-[11px] font-bold text-ci-orange uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Challenges
                </h4>
              </div>
              <ul className="space-y-2">
                {visibleChallenges.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-ci-orange mt-1 shrink-0">•</span>
                    <span className="text-[13px] text-ci-gray-700 leading-snug">{ch}</span>
                  </li>
                ))}
              </ul>
              {narrative.challenges.length > 2 && (
                <button
                  onClick={() => setShowAllChallenges(!showAllChallenges)}
                  className="text-[11px] text-ci-orange font-medium mt-2 hover:underline"
                >
                  {showAllChallenges ? 'Show less' : `+${narrative.challenges.length - 2} more`}
                </button>
              )}
            </div>
          </div>

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
