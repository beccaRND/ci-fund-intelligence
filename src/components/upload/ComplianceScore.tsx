'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { ChecklistResult, ValidationResult } from '@/lib/checklist';
import { scoreColor, scoreLabel, groupByCategory } from '@/lib/checklist';

interface ComplianceScoreProps {
  score: number;
  results: ChecklistResult[];
}

function StatusIcon({ result }: { result: ValidationResult }) {
  switch (result) {
    case 'compliant':
      return <CheckCircle size={16} className="text-ci-green shrink-0" />;
    case 'missing':
      return <AlertTriangle size={16} className="text-ci-orange shrink-0" />;
    case 'off-spec':
      return <XCircle size={16} className="text-status-gap shrink-0" />;
    default:
      return <span className="w-4 h-4 rounded-full bg-ci-gray-300 shrink-0" />;
  }
}

function statusLabel(result: ValidationResult): string {
  switch (result) {
    case 'compliant': return 'Compliant';
    case 'missing': return 'Missing';
    case 'off-spec': return 'Off-spec';
    default: return 'N/A';
  }
}

function statusBg(result: ValidationResult): string {
  switch (result) {
    case 'compliant': return 'bg-ci-green-light text-ci-green-dark';
    case 'missing': return 'bg-ci-orange-light text-ci-orange';
    case 'off-spec': return 'bg-red-50 text-status-gap';
    default: return 'bg-ci-gray-100 text-ci-gray-500';
  }
}

function FixHint({ item, result }: { item: ChecklistResult['item']; result: ValidationResult }) {
  if (result === 'compliant') return null;

  const hints: Record<string, string> = {
    'soc-depth': 'Increase sampling depth to at least 30cm. VM0042 requires ≥30cm minimum.',
    'soc-lab-method': 'Select the lab analysis method used. Dry combustion (Dumas) is the reference standard.',
    'soc-bulk-density': 'Measure bulk density directly using core method, or document ESM approach.',
    'soc-georef': 'Enable GPS coordinates for sample locations. Upload a GPX/CSV file.',
    'soc-stratification': 'Document stratification factors and define at least one stratum.',
    'soc-baseline-timing': 'Ensure baseline measurement is within 5 years of project start date.',
    'soc-frequency': 'Set verification frequency to 5 years or less.',
    'soc-qaqc': 'Include at least two QA/QC methods: lab duplicates, reference samples, or replicate analysis.',
    'soc-statistical': 'Increase to at least 5 composite samples per stratum.',
  };

  return (
    <div className="mt-2 px-3 py-2 bg-ci-cream rounded-[var(--radius-sm)] text-xs text-ci-gray-700">
      <span className="font-semibold">How to fix: </span>
      {hints[item.id] || item.description}
    </div>
  );
}

export default function ComplianceScore({ score, results }: ComplianceScoreProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const color = scoreColor(score);
  const label = scoreLabel(score);
  const grouped = groupByCategory(results);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // SVG circle parameters
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6">
      <h3
        className="text-lg font-bold text-ci-charcoal mb-5"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Compliance Score
      </h3>

      {/* Score Ring */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F0F0EC"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold"
              style={{ color, fontFamily: 'var(--font-mono)' }}
            >
              {score}%
            </span>
          </div>
        </div>
        <span
          className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {label}
        </span>
      </div>

      {/* Summary badges */}
      <div className="flex justify-center gap-4 mb-6 pb-6 border-b border-ci-gray-300/50">
        <div className="flex items-center gap-1.5 text-xs">
          <CheckCircle size={14} className="text-ci-green" />
          <span className="text-ci-gray-700">
            {results.filter((r) => r.result === 'compliant').length} Compliant
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <AlertTriangle size={14} className="text-ci-orange" />
          <span className="text-ci-gray-700">
            {results.filter((r) => r.result === 'missing').length} Missing
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <XCircle size={14} className="text-status-gap" />
          <span className="text-ci-gray-700">
            {results.filter((r) => r.result === 'off-spec').length} Off-spec
          </span>
        </div>
      </div>

      {/* Grouped checklist */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-2">
              {category}
            </div>
            <div className="space-y-1">
              {items.map((r) => {
                const isExpanded = expandedItems.has(r.item.id);
                return (
                  <div
                    key={r.item.id}
                    className="rounded-[var(--radius-sm)] border border-ci-gray-300/50 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(r.item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-ci-gray-100/50 transition-colors text-left"
                    >
                      <StatusIcon result={r.result} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-ci-charcoal font-medium">{r.item.requirement}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBg(r.result)}`}>
                        {statusLabel(r.result)}
                      </span>
                      {r.item.severity === 'required' && (
                        <span className="text-[9px] text-status-gap font-bold uppercase">REQ</span>
                      )}
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-ci-gray-500 shrink-0" />
                      ) : (
                        <ChevronRight size={14} className="text-ci-gray-500 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-ci-gray-300/50">
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-ci-gray-700">{r.item.description}</p>
                          <p className="text-[11px] text-ci-gray-500">
                            Standard: <span className="font-semibold">{r.item.standard}</span>
                          </p>
                        </div>
                        <FixHint item={r.item} result={r.result} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-ci-gray-300/50">
        <button className="px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors">
          Submit to CI
        </button>
        <button className="px-4 py-2 rounded-[var(--radius-md)] border border-ci-gray-300 text-ci-gray-700 text-sm font-semibold hover:bg-ci-gray-100 transition-colors">
          Save Draft
        </button>
        <button className="px-4 py-2 rounded-[var(--radius-md)] border border-ci-gray-300 text-ci-gray-700 text-sm font-semibold hover:bg-ci-gray-100 transition-colors">
          Download Report
        </button>
      </div>
    </div>
  );
}
