'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, Circle, ChevronDown, ChevronUp, Link2, ShieldCheck } from 'lucide-react';
import { projectProvenance, type ProvenanceStage } from '@/lib/seed/provenance';

interface Props {
  projectId: string;
}

const STAGE_COLORS = {
  T0: '#007B7F', // ci-teal
  T1: '#6B5CA5', // purple
  T2: '#00A86B', // ci-green
  T3: '#E8732A', // ci-orange (gold/achievement)
} as const;

function StatusIcon({ status, color }: { status: ProvenanceStage['status']; color: string }) {
  if (status === 'complete') return <CheckCircle2 size={18} style={{ color }} />;
  if (status === 'in-progress') return <Clock size={18} style={{ color }} className="animate-pulse" />;
  return <Circle size={18} className="text-ci-gray-300" />;
}

function AnchorHash({ hash }: { hash: string }) {
  const short = `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-ci-gray-100 text-ci-gray-500 select-all"
      style={{ fontFamily: 'var(--font-mono)' }}
      title={hash}
    >
      <Link2 size={9} />
      {short}
    </span>
  );
}

function StageRow({ stage, index, isLast }: { stage: ProvenanceStage; index: number; isLast: boolean }) {
  const stageKey = stage.stage as keyof typeof STAGE_COLORS;
  const color = STAGE_COLORS[stageKey];
  const isComplete = stage.status === 'complete';
  const isPending = stage.status === 'pending';

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 32 }}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
            isComplete ? 'bg-white' : isPending ? 'bg-ci-gray-100 border-ci-gray-200' : 'bg-white'
          }`}
          style={{ borderColor: isPending ? undefined : color }}
        >
          <StatusIcon status={stage.status} color={color} />
        </div>
        {!isLast && (
          <div
            className="w-0.5 flex-1 mt-1 mb-1 min-h-[32px]"
            style={{ backgroundColor: isComplete ? color : '#E5E5E0', opacity: isComplete ? 0.4 : 1 }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        {/* Stage badge + status */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: isPending ? '#F0F0EC' : `${color}15`,
              color: isPending ? '#B8B8B8' : color,
            }}
          >
            {stage.stage}
          </span>
          <span
            className="text-[13px] font-bold text-ci-charcoal"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {stage.label}
          </span>
          <span
            className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              stage.status === 'complete'
                ? 'bg-ci-green-light text-ci-green-dark'
                : stage.status === 'in-progress'
                  ? 'bg-ci-gold-light text-ci-gold'
                  : 'bg-ci-gray-100 text-ci-gray-500'
            }`}
          >
            {stage.status === 'complete' ? 'Complete' : stage.status === 'in-progress' ? 'In progress' : 'Pending'}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-ci-gray-500 leading-relaxed mb-2">{stage.description}</p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {stage.actor && (
            <span className="text-[11px] text-ci-gray-700">
              <span className="text-ci-gray-500">Actor: </span>{stage.actor}
            </span>
          )}
          {stage.timestamp && (
            <span className="text-[11px] text-ci-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
              {new Date(stage.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          {stage.anchorHash && <AnchorHash hash={stage.anchorHash} />}
        </div>

        {/* Note */}
        {stage.note && (
          <p className="text-[11px] text-ci-teal mt-2 italic">{stage.note}</p>
        )}
      </div>
    </div>
  );
}

export default function DataProvenance({ projectId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const provenance = projectProvenance[projectId];

  if (!provenance) return null;

  const completeCount = provenance.stages.filter(s => s.status === 'complete').length;
  const totalStages = provenance.stages.length;
  const allComplete = completeCount === totalStages;

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-ci-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ci-teal-light flex items-center justify-center">
            <ShieldCheck size={15} className="text-ci-teal" />
          </div>
          <div className="text-left">
            <h3
              className="text-base font-bold text-ci-charcoal leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Data Provenance
            </h3>
            <p className="text-[11px] text-ci-gray-500 mt-0.5">{provenance.cycle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {provenance.stages.map((s) => (
                <div
                  key={s.stage}
                  className="w-5 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      s.status === 'complete' ? STAGE_COLORS[s.stage as keyof typeof STAGE_COLORS]
                      : s.status === 'in-progress' ? '#FFC432'
                      : '#E5E5E0',
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] text-ci-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
              {completeCount}/{totalStages}
            </span>
          </div>

          {allComplete && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ci-green-light text-ci-green-dark">
              Tamper-evident ✓
            </span>
          )}

          {expanded ? (
            <ChevronUp size={18} className="text-ci-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-ci-gray-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-2">
          {/* Explainer */}
          <div className="flex items-start gap-2 mb-6 px-3 py-2.5 bg-ci-teal-light/30 rounded-[var(--radius-sm)] border border-ci-teal/10">
            <ShieldCheck size={13} className="text-ci-teal mt-0.5 shrink-0" />
            <p className="text-[12px] text-ci-gray-700 leading-relaxed">
              Every monitoring submission is anchored at four stages — from raw upload to certified claim. Each anchor hash is immutable and publicly queryable on Regen Ledger, proving the full chain of custody.
            </p>
          </div>

          {/* Timeline */}
          <div>
            {provenance.stages.map((stage, i) => (
              <StageRow
                key={stage.stage}
                stage={stage}
                index={i}
                isLast={i === provenance.stages.length - 1}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="pt-2 pb-4 border-t border-ci-gray-300/30 flex items-center justify-between">
            <span
              className="text-[10px] text-ci-gray-500"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Powered by Regen Ledger · ecocredit module v2.1
            </span>
            <span className="text-[10px] text-ci-gray-500">
              T0→T3 chain of custody anchoring
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
