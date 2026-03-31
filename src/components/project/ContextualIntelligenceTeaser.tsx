'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Brain, AlertTriangle, TrendingUp, Minus,
  CloudRain, Thermometer, ChevronDown, ChevronUp, ArrowRight,
} from 'lucide-react';
import { generateInterpretation, computeAnomalies } from '@/lib/contextInterpretation';
import type { Interpretation, MonitoringContext } from '@/lib/contextInterpretation';

interface Props {
  lat: number;
  lng: number;
  projectId: string;
}

const DEMO_MONITORING = {
  period: { start: '2023-01', end: '2024-12' },
  socChange: -2.1,
  socChangePercent: -6.9,
};

export default function ContextualIntelligenceTeaser({ lat, lng, projectId }: Props) {
  const [interpretations, setInterpretations] = useState<Interpretation[]>([]);
  const [precipAnomaly, setPrecipAnomaly] = useState<number>(0);
  const [tempAnomaly, setTempAnomaly] = useState<number>(0);
  const [droughtEvents, setDroughtEvents] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/climate?lat=${lat}&lng=${lng}`);
      const json = await res.json();
      if (json.success) {
        const allMonths = json.data.monthlyData;
        const monitoringMonths = allMonths.filter((m: { month: string }) =>
          m.month >= DEMO_MONITORING.period.start && m.month <= DEMO_MONITORING.period.end
        );
        const { precipAnomaly: pa, tempAnomaly: ta } = computeAnomalies(monitoringMonths, allMonths);
        const ctx: MonitoringContext = {
          socChange: DEMO_MONITORING.socChange,
          socChangePercent: DEMO_MONITORING.socChangePercent,
          precipAnomaly: pa,
          tempAnomaly: ta,
          droughtOccurred: json.data.droughtEvents > 0,
          moistureDeficit: pa < -20,
        };
        setPrecipAnomaly(pa);
        setTempAnomaly(ta);
        setDroughtEvents(json.data.droughtEvents);
        setInterpretations(generateInterpretation(ctx));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const visibleInterpretations = expanded ? interpretations : interpretations.slice(0, 2);

  return (
    <div className="bg-ci-charcoal rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-6 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ci-teal/20 flex items-center justify-center shrink-0">
            <Brain size={15} className="text-ci-teal" />
          </div>
          <div>
            <h3
              className="text-[15px] font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contextual Intelligence
            </h3>
            <p className="text-[11px] text-white/50 mt-0.5">
              Climate context layered onto monitoring results
            </p>
          </div>
        </div>
        <Link
          href={`/projects/${projectId}/context`}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-ci-teal hover:text-white transition-colors shrink-0"
        >
          Full analysis
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {loading ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="h-4 w-4 rounded bg-white/10 animate-pulse shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-white/10 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-white/[0.06] animate-pulse rounded w-full" />
                <div className="h-3 bg-white/[0.06] animate-pulse rounded w-2/3" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-4 w-4 rounded bg-white/10 animate-pulse shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-white/10 animate-pulse rounded w-1/2" />
                <div className="h-3 bg-white/[0.06] animate-pulse rounded w-5/6" />
              </div>
            </div>
          </div>
        ) : error ? (
          <p className="text-[13px] text-white/40 italic">
            Climate data unavailable — <Link href={`/projects/${projectId}/context`} className="underline text-ci-teal/70">view full analysis</Link> to retry.
          </p>
        ) : (
          <>
            {/* Climate anomaly pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
                precipAnomaly < -15
                  ? 'bg-ci-orange/15 text-ci-orange border border-ci-orange/25'
                  : precipAnomaly > 15
                    ? 'bg-ci-teal/15 text-ci-teal border border-ci-teal/25'
                    : 'bg-white/10 text-white/60 border border-white/10'
              }`}>
                <CloudRain size={11} />
                Precip {precipAnomaly > 0 ? '+' : ''}{precipAnomaly}% vs 5yr avg
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
                tempAnomaly > 0.8
                  ? 'bg-ci-orange/15 text-ci-orange border border-ci-orange/25'
                  : tempAnomaly < -0.8
                    ? 'bg-ci-teal/15 text-ci-teal border border-ci-teal/25'
                    : 'bg-white/10 text-white/60 border border-white/10'
              }`}>
                <Thermometer size={11} />
                Temp {tempAnomaly > 0 ? '+' : ''}{tempAnomaly}°C vs 5yr avg
              </div>
              {droughtEvents > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-ci-orange/15 text-ci-orange border border-ci-orange/25">
                  <AlertTriangle size={11} />
                  {droughtEvents} drought event{droughtEvents > 1 ? 's' : ''} detected
                </div>
              )}
            </div>

            {/* Interpretations */}
            <div className="space-y-3">
              {visibleInterpretations.map((interp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {interp.severity === 'alert' && <AlertTriangle size={15} className="text-red-400" />}
                    {interp.severity === 'warning' && <AlertTriangle size={15} className="text-ci-orange" />}
                    {interp.severity === 'positive' && <TrendingUp size={15} className="text-ci-green" />}
                    {interp.severity === 'neutral' && <Minus size={15} className="text-white/40" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white leading-snug mb-0.5">{interp.headline}</p>
                    <p className="text-[12px] text-white/55 leading-relaxed">{interp.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Expand / collapse */}
            {interpretations.length > 2 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 mt-4 text-[11px] font-semibold text-white/40 hover:text-ci-teal transition-colors"
              >
                {expanded ? (
                  <><ChevronUp size={13} /> Show less</>
                ) : (
                  <><ChevronDown size={13} /> +{interpretations.length - 2} more insights</>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
