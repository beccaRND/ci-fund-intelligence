'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, Cell,
} from 'recharts';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import { RefreshCw, AlertTriangle, CloudRain, Thermometer, Droplets, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ProcessedClimateData } from '@/lib/api/openMeteo';
import { generateInterpretation, computeAnomalies } from '@/lib/contextInterpretation';
import type { Interpretation, MonitoringContext } from '@/lib/contextInterpretation';

interface ContextualIntelligenceProps {
  lat: number;
  lng: number;
  projectName: string;
}

// Simulated grantee-reported data for demo — in production this comes from uploaded data
const DEMO_MONITORING = {
  period: { start: '2023-01', end: '2024-12' },
  socBaseline: 30.6,
  socCurrent: 28.5,
  socChange: -2.1,
  socChangePercent: -6.9,
  samplingDepth: '0-30cm',
  method: 'Dry combustion (Dumas)',
  strata: 4,
  samplesPerStratum: 8,
};

export default function ContextualIntelligence({ lat, lng, projectName }: ContextualIntelligenceProps) {
  const [data, setData] = useState<ProcessedClimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interpretations, setInterpretations] = useState<Interpretation[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/climate?lat=${lat}&lng=${lng}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);

        // Compute anomalies for monitoring period
        const allMonths = json.data.monthlyData;
        const monitoringMonths = allMonths.filter((m: { month: string }) =>
          m.month >= DEMO_MONITORING.period.start && m.month <= DEMO_MONITORING.period.end
        );

        const { precipAnomaly, tempAnomaly } = computeAnomalies(monitoringMonths, allMonths);

        // Check for drought in monitoring period
        const droughtOccurred = json.data.droughtEvents > 0;

        const ctx: MonitoringContext = {
          socChange: DEMO_MONITORING.socChange,
          socChangePercent: DEMO_MONITORING.socChangePercent,
          precipAnomaly,
          tempAnomaly,
          droughtOccurred,
          moistureDeficit: precipAnomaly < -20,
        };

        setInterpretations(generateInterpretation(ctx));
      } else {
        setError(json.error || 'Failed to load climate data');
      }
    } catch {
      setError('Network error — could not reach climate API');
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="h-6 w-48 skeleton mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 skeleton rounded-[var(--radius-sm)]" />
            ))}
          </div>
        </div>
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="h-6 w-48 skeleton mb-4" />
          <div className="h-48 skeleton rounded-[var(--radius-sm)] mb-4" />
          <div className="h-48 skeleton rounded-[var(--radius-sm)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertTriangle size={24} className="text-ci-orange" />
          <p className="text-sm text-ci-gray-500">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Filter monitoring period months for charts
  const monitoringMonths = data.monthlyData.filter(
    (m) => m.month >= DEMO_MONITORING.period.start && m.month <= DEMO_MONITORING.period.end
  );

  // Compute 5-year average by calendar month for anomaly reference lines
  const baselineByCalMonth: Record<string, { temps: number[]; precips: number[] }> = {};
  for (const m of data.monthlyData) {
    const calMonth = m.month.substring(5);
    if (!baselineByCalMonth[calMonth]) baselineByCalMonth[calMonth] = { temps: [], precips: [] };
    baselineByCalMonth[calMonth].temps.push(m.tempMean);
    baselineByCalMonth[calMonth].precips.push(m.precipitation);
  }

  // Build anomaly chart data
  const anomalyData = monitoringMonths.map((m) => {
    const calMonth = m.month.substring(5);
    const baseline = baselineByCalMonth[calMonth];
    const avgPrecip = baseline ? baseline.precips.reduce((a, b) => a + b, 0) / baseline.precips.length : 0;
    const avgTemp = baseline ? baseline.temps.reduce((a, b) => a + b, 0) / baseline.temps.length : 0;
    return {
      label: m.month.substring(2), // "23-01"
      precipitation: m.precipitation,
      avgPrecip: Math.round(avgPrecip),
      precipDiff: Math.round(m.precipitation - avgPrecip),
      tempMean: m.tempMean,
      avgTemp: Math.round(avgTemp * 10) / 10,
      tempDiff: Math.round((m.tempMean - avgTemp) * 10) / 10,
    };
  });

  // Overall anomalies
  const { precipAnomaly, tempAnomaly } = computeAnomalies(monitoringMonths, data.monthlyData);
  const totalPrecipMonitoring = monitoringMonths.reduce((sum, m) => sum + m.precipitation, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* LEFT PANEL — Reported Monitoring Data */}
      <div className="space-y-6">
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Reported Monitoring Data
            </h3>
            <DataSourceBadge source="field" label="Grantee Reported" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-5">
            Soil Carbon Monitoring · {DEMO_MONITORING.period.start} to {DEMO_MONITORING.period.end}
          </p>

          {/* SOC Summary */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="px-4 py-3 bg-ci-cream rounded-[var(--radius-md)]">
                <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider mb-0.5">Baseline SOC</div>
                <div className="text-xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                  {DEMO_MONITORING.socBaseline} <span className="text-xs font-normal text-ci-gray-500">t C/ha</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-ci-cream rounded-[var(--radius-md)]">
                <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider mb-0.5">Current SOC</div>
                <div className="text-xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                  {DEMO_MONITORING.socCurrent} <span className="text-xs font-normal text-ci-gray-500">t C/ha</span>
                </div>
              </div>
            </div>

            {/* Change indicator */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] ${
              DEMO_MONITORING.socChange < 0
                ? 'bg-ci-orange-light border border-ci-orange/20'
                : 'bg-ci-green-light border border-ci-green/20'
            }`}>
              {DEMO_MONITORING.socChange < 0 ? (
                <TrendingDown size={20} className="text-ci-orange shrink-0" />
              ) : DEMO_MONITORING.socChange > 0 ? (
                <TrendingUp size={20} className="text-ci-green shrink-0" />
              ) : (
                <Minus size={20} className="text-ci-gray-500 shrink-0" />
              )}
              <div>
                <div className="text-sm font-bold" style={{
                  color: DEMO_MONITORING.socChange < 0 ? '#E8732A' : '#00A86B',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {DEMO_MONITORING.socChange > 0 ? '+' : ''}{DEMO_MONITORING.socChange} t C/ha ({DEMO_MONITORING.socChangePercent > 0 ? '+' : ''}{DEMO_MONITORING.socChangePercent}%)
                </div>
                <div className="text-xs text-ci-gray-500">Change from baseline</div>
              </div>
            </div>

            {/* Methodology details */}
            <div className="border-t border-ci-gray-300/50 pt-4">
              <div className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-2">
                Sampling Details
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs text-ci-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-ci-green shrink-0" />
                  Depth: {DEMO_MONITORING.samplingDepth}
                </div>
                <div className="flex items-center gap-2 text-xs text-ci-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-ci-green shrink-0" />
                  Method: {DEMO_MONITORING.method}
                </div>
                <div className="flex items-center gap-2 text-xs text-ci-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-ci-green shrink-0" />
                  {DEMO_MONITORING.strata} strata
                </div>
                <div className="flex items-center gap-2 text-xs text-ci-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-ci-green shrink-0" />
                  {DEMO_MONITORING.samplesPerStratum} samples/stratum
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Interpretation */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Contextual Interpretation
            </h3>
            <DataSourceBadge source="computed" label="Computed interpretation" />
          </div>

          <div className="space-y-3">
            {interpretations.map((interp, idx) => (
              <div
                key={idx}
                className={`px-4 py-3 rounded-[var(--radius-md)] border ${
                  interp.severity === 'positive'
                    ? 'bg-ci-green-light border-ci-green/20'
                    : interp.severity === 'alert'
                      ? 'bg-red-50 border-red-200'
                      : interp.severity === 'warning'
                        ? 'bg-ci-orange-light border-ci-orange/20'
                        : 'bg-ci-gray-100 border-ci-gray-300/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  {interp.severity === 'alert' && <AlertTriangle size={16} className="text-status-gap shrink-0 mt-0.5" />}
                  {interp.severity === 'warning' && <AlertTriangle size={16} className="text-ci-orange shrink-0 mt-0.5" />}
                  {interp.severity === 'positive' && <TrendingUp size={16} className="text-ci-green shrink-0 mt-0.5" />}
                  <div>
                    <div className="text-sm font-semibold text-ci-charcoal mb-1">{interp.headline}</div>
                    <p className="text-xs text-ci-gray-700 leading-relaxed">{interp.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Environmental Context */}
      <div className="space-y-6">
        {/* Climate Summary Badges */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Climate During Monitoring Period
            </h3>
            <DataSourceBadge source="satellite" label="Open-Meteo ERA5" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-5">
            {DEMO_MONITORING.period.start} to {DEMO_MONITORING.period.end} vs 5-year baseline
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="px-3 py-3 bg-ci-cream rounded-[var(--radius-md)] text-center">
              <CloudRain size={18} className="mx-auto text-ci-teal mb-1" />
              <div className="text-xs text-ci-gray-500 mb-0.5">Precip Anomaly</div>
              <div
                className="text-base font-bold"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: precipAnomaly < -15 ? '#E8732A' : precipAnomaly > 15 ? '#007B7F' : '#2D2D2D',
                }}
              >
                {precipAnomaly > 0 ? '+' : ''}{precipAnomaly}%
              </div>
            </div>
            <div className="px-3 py-3 bg-ci-cream rounded-[var(--radius-md)] text-center">
              <Thermometer size={18} className="mx-auto text-ci-orange mb-1" />
              <div className="text-xs text-ci-gray-500 mb-0.5">Temp Anomaly</div>
              <div
                className="text-base font-bold"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: tempAnomaly > 0.8 ? '#E8732A' : tempAnomaly < -0.8 ? '#007B7F' : '#2D2D2D',
                }}
              >
                {tempAnomaly > 0 ? '+' : ''}{tempAnomaly}°C
              </div>
            </div>
            <div className="px-3 py-3 bg-ci-cream rounded-[var(--radius-md)] text-center">
              <Droplets size={18} className="mx-auto text-ci-teal mb-1" />
              <div className="text-xs text-ci-gray-500 mb-0.5">Total Precip</div>
              <div className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                {Math.round(totalPrecipMonitoring)}mm
              </div>
            </div>
          </div>

          {/* Drought alert banner */}
          {data.droughtEvents > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-ci-orange-light rounded-[var(--radius-sm)] border border-ci-orange/20 mb-5">
              <AlertTriangle size={14} className="text-ci-orange shrink-0" />
              <p className="text-xs text-ci-gray-700">
                <strong className="text-ci-orange">Drought Alert:</strong> {data.droughtEvents} drought event{data.droughtEvents > 1 ? 's' : ''} detected during the 5-year baseline period (30+ consecutive days below 50% normal precipitation).
              </p>
            </div>
          )}
        </div>

        {/* Precipitation Anomaly Chart */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Precipitation: Actual vs 5yr Average
            </h4>
            <DataSourceBadge source="satellite" label="ERA5" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-3">
            Deficit: {precipAnomaly < 0 ? `${Math.abs(precipAnomaly)}% below` : `${precipAnomaly}% above`} 5yr average
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={anomalyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#7A7A7A' }} />
              <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} tickFormatter={(v) => `${v}mm`} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #F0F0EC',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  `${value ?? 0} mm`,
                  name === 'precipitation' ? 'Actual' : '5yr Avg',
                ]}
              />
              <Legend
                iconType="rect"
                wrapperStyle={{ fontSize: '10px', color: '#7A7A7A' }}
                formatter={(value) => (value === 'precipitation' ? 'Actual' : '5yr Average')}
              />
              <Bar dataKey="precipitation" fill="#007B7F" radius={[2, 2, 0, 0]} barSize={10} name="precipitation" />
              <Bar dataKey="avgPrecip" fill="#B8B8B8" radius={[2, 2, 0, 0]} barSize={10} opacity={0.5} name="avgPrecip" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Anomaly Chart */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Temperature: Actual vs 5yr Average
            </h4>
            <DataSourceBadge source="satellite" label="ERA5" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-3">
            {tempAnomaly > 0 ? '+' : ''}{tempAnomaly}°C {tempAnomaly > 0 ? 'above' : 'below'} 5yr average
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={anomalyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="tempActualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8732A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E8732A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#7A7A7A' }} />
              <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} tickFormatter={(v) => `${v}°`} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #F0F0EC',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  `${value ?? 0}°C`,
                  name === 'tempMean' ? 'Actual' : '5yr Avg',
                ]}
              />
              <Legend
                iconType="line"
                wrapperStyle={{ fontSize: '10px', color: '#7A7A7A' }}
                formatter={(value) => (value === 'tempMean' ? 'Actual' : '5yr Average')}
              />
              <Area
                type="monotone"
                dataKey="avgTemp"
                stroke="#B8B8B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                name="avgTemp"
              />
              <Area
                type="monotone"
                dataKey="tempMean"
                stroke="#E8732A"
                strokeWidth={2}
                fill="url(#tempActualGrad)"
                name="tempMean"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Temperature Differential */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Precipitation Anomaly by Month
            </h4>
            <DataSourceBadge source="computed" label="Computed" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-3">
            Difference from 5yr monthly average (mm)
          </p>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={anomalyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#7A7A7A' }} />
              <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} tickFormatter={(v) => `${v}mm`} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #F0F0EC',
                }}
                formatter={(value: number | undefined) => [`${value ?? 0} mm`, 'Anomaly']}
              />
              <ReferenceLine y={0} stroke="#7A7A7A" strokeWidth={1} />
              <Bar dataKey="precipDiff" radius={[2, 2, 0, 0]} barSize={12}>
                {anomalyData.map((entry, index) => (
                  <Cell key={index} fill={entry.precipDiff < 0 ? '#E8732A' : '#007B7F'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
