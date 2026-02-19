'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import MetricCard from '@/components/shared/MetricCard';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import type { ProcessedClimateData } from '@/lib/api/openMeteo';

interface ClimatePanelProps {
  lat: number;
  lng: number;
}

export default function ClimatePanel({ lat, lng }: ClimatePanelProps) {
  const [data, setData] = useState<ProcessedClimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/climate?lat=${lat}&lng=${lng}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load climate data');
      }
    } catch {
      setError('Network error — could not reach climate API');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Climate Summary
          </h3>
          <DataSourceBadge source="satellite" label="Open-Meteo ERA5" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 skeleton" />
                <div className="h-7 w-20 skeleton" />
              </div>
            ))}
          </div>
          <div className="h-48 skeleton rounded-[var(--radius-sm)]" />
          <div className="h-48 skeleton rounded-[var(--radius-sm)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Climate Summary
          </h3>
        </div>
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

  // Prepare monthly chart data — last 24 months for readability
  const recentMonthly = data.monthlyData.slice(-24).map((m) => ({
    ...m,
    label: m.month.substring(2), // "21-03" format
  }));

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
          Climate Summary
        </h3>
        <DataSourceBadge source="satellite" label="Open-Meteo ERA5" />
      </div>
      <p className="text-xs text-ci-gray-500 mb-5">
        {data.yearRange.start}–{data.yearRange.end} · 5-year climate profile
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6 pb-6 border-b border-ci-gray-300/50">
        <MetricCard
          label="Mean Temp"
          value={`${data.meanTemp}`}
          unit="°C"
          trend={
            data.tempTrend !== 0
              ? {
                  direction: data.tempTrend > 0 ? 'up' : 'down',
                  label: `${data.tempTrend > 0 ? '+' : ''}${data.tempTrend}°C/yr`,
                }
              : undefined
          }
          mono
        />
        <MetricCard
          label="Annual Precip"
          value={`${data.annualPrecip}`}
          unit="mm/yr"
          trend={
            data.precipTrend !== 0
              ? {
                  direction: data.precipTrend > 0 ? 'up' : 'down',
                  label: `${data.precipTrend > 0 ? '+' : ''}${data.precipTrend} mm/yr`,
                }
              : undefined
          }
          mono
        />
        <MetricCard
          label="Drought Events"
          value={`${data.droughtEvents}`}
          unit="in 5yr"
          mono
        />
        <MetricCard
          label="Growing Season"
          value={`${data.growingSeasonDays}`}
          unit="days"
          mono
        />
      </div>

      {/* Temperature Chart */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-ci-charcoal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Monthly Temperature
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={recentMonthly} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8732A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#E8732A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#7A7A7A' }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#7A7A7A' }}
              tickFormatter={(v) => `${v}°`}
            />
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
                name === 'tempMax' ? 'Max' : name === 'tempMin' ? 'Min' : 'Mean',
              ]}
            />
            <Area
              type="monotone"
              dataKey="tempMax"
              stroke="#E8732A"
              strokeWidth={1}
              fill="url(#tempGradient)"
              strokeOpacity={0.5}
              name="tempMax"
            />
            <Area
              type="monotone"
              dataKey="tempMean"
              stroke="#E8732A"
              strokeWidth={2}
              fill="none"
              name="tempMean"
            />
            <Area
              type="monotone"
              dataKey="tempMin"
              stroke="#007B7F"
              strokeWidth={1}
              fill="none"
              strokeOpacity={0.5}
              name="tempMin"
            />
            <Legend
              iconType="line"
              wrapperStyle={{ fontSize: '10px', color: '#7A7A7A' }}
              formatter={(value) => (value === 'tempMax' ? 'Max' : value === 'tempMin' ? 'Min' : 'Mean')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Precipitation Chart */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-ci-charcoal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Monthly Precipitation
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={recentMonthly} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#7A7A7A' }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#7A7A7A' }}
              tickFormatter={(v) => `${v}mm`}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #F0F0EC',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0} mm`, 'Precipitation']}
            />
            <Bar dataKey="precipitation" fill="#007B7F" radius={[2, 2, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Annual precipitation totals */}
      <div>
        <div className="text-sm font-semibold text-ci-charcoal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Annual Precipitation Totals
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.annualPrecipTotals} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#7A7A7A' }} />
            <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} tickFormatter={(v) => `${v}mm`} />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #F0F0EC',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0} mm`, 'Total']}
            />
            <Bar dataKey="total" fill="#00A86B" radius={[3, 3, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
        {data.precipTrend !== 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-ci-gray-500">
            <span>Trend: {data.precipTrend > 0 ? '+' : ''}{data.precipTrend} mm/year</span>
            <DataSourceBadge source="computed" label="Linear regression" />
          </div>
        )}
      </div>
    </div>
  );
}
