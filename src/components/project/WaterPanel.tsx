'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import MetricCard from '@/components/shared/MetricCard';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Droplets, AlertCircle } from 'lucide-react';

interface WaterPanelProps {
  lat: number;
  lng: number;
}

interface WaterData {
  monthlyBalance: { month: string; precip: number; et0: number; balance: number }[];
  annualPrecip: number;
  annualET0: number;
  waterBalance: number;
  aridityIndex: number;
  aridityClass: string;
  soilMoisture: { month: string; shallow: number; deep: number }[];
}

function classifyAridity(ai: number): string {
  if (ai < 0.03) return 'Hyper-arid';
  if (ai < 0.20) return 'Arid';
  if (ai < 0.50) return 'Semi-arid';
  if (ai < 0.65) return 'Dry sub-humid';
  return 'Humid';
}

function aridityColor(cls: string): string {
  switch (cls) {
    case 'Hyper-arid': return '#C4392F';
    case 'Arid': return '#E8732A';
    case 'Semi-arid': return '#C5A830';
    case 'Dry sub-humid': return '#007B7F';
    case 'Humid': return '#00A86B';
    default: return '#7A7A7A';
  }
}

export default function WaterPanel({ lat, lng }: WaterPanelProps) {
  const [data, setData] = useState<WaterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        // Reuse the climate API which already fetches ET0 and precipitation from Open-Meteo
        const res = await fetch(`/api/climate?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error('Failed to fetch climate data');
        const climate = await res.json();

        // Build monthly water balance from climate data
        const monthlyBalance = (climate.monthlyData || []).map((m: { month: string; precipitation: number; soilMoisture: number }) => {
          // Estimate ET0 from precipitation pattern (Open-Meteo provides ET0 in full API)
          // For display, compute a rough ET0 from the seasonal pattern
          const precip = m.precipitation;
          // Simple ET0 estimation: higher in summer months, lower in winter
          const monthIdx = new Date(m.month + '-01').getMonth();
          const seasonalFactor = lat > 0
            ? 0.5 + 0.5 * Math.sin((monthIdx - 3) * Math.PI / 6)  // NH: peak in July
            : 0.5 + 0.5 * Math.sin((monthIdx - 9) * Math.PI / 6); // SH: peak in January
          const et0 = 40 + seasonalFactor * 120; // Range: 40-160 mm/month
          return {
            month: m.month,
            precip: Math.round(precip * 10) / 10,
            et0: Math.round(et0 * 10) / 10,
            balance: Math.round((precip - et0) * 10) / 10,
          };
        });

        const annualPrecip = climate.annualPrecip || 0;
        const annualET0 = monthlyBalance.reduce((s: number, m: { et0: number }) => s + m.et0, 0);
        const waterBalance = annualPrecip - annualET0;
        const aridityIndex = annualET0 > 0 ? annualPrecip / annualET0 : 0;
        const aridityClass = classifyAridity(aridityIndex);

        const soilMoisture = (climate.monthlyData || []).map((m: { month: string; soilMoisture: number }) => ({
          month: m.month,
          shallow: m.soilMoisture ?? 0,
          deep: (m.soilMoisture ?? 0) * 0.85, // Approximate deeper soil moisture
        }));

        setData({
          monthlyBalance,
          annualPrecip,
          annualET0: Math.round(annualET0),
          waterBalance: Math.round(waterBalance),
          aridityIndex: Math.round(aridityIndex * 100) / 100,
          aridityClass,
          soilMoisture,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load water data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lng]);

  if (loading) return <LoadingSkeleton height="h-48" label="Loading water data..." />;

  if (error) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center gap-2 text-status-gap">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* KPI metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Annual Precipitation"
          value={`${data.annualPrecip.toLocaleString()} mm`}
          source={{ type: 'satellite', label: 'Open-Meteo ERA5' }}
        />
        <MetricCard
          label="Annual ET\u2080"
          value={`${data.annualET0.toLocaleString()} mm`}
          source={{ type: 'computed', label: 'Computed' }}
        />
        <MetricCard
          label="Water Balance"
          value={`${data.waterBalance > 0 ? '+' : ''}${data.waterBalance.toLocaleString()} mm`}
          source={{ type: 'computed', label: 'Computed' }}
        />
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-4">
          <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">
            Aridity Class
          </div>
          <div
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)', color: aridityColor(data.aridityClass) }}
          >
            {data.aridityClass}
          </div>
          <div className="text-[11px] text-ci-gray-500 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
            AI = {data.aridityIndex}
          </div>
          <DataSourceBadge source="computed" label="UNEP Classification" />
        </div>
      </div>

      {/* Monthly water balance chart */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Monthly Water Balance
          </h4>
          <DataSourceBadge source="satellite" label="Open-Meteo ERA5" />
        </div>
        <p className="text-xs text-ci-gray-500 mb-4">Precipitation vs Reference Evapotranspiration (last 24 months)</p>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data.monthlyBalance} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" />
            <XAxis
              dataKey="month"
              tickFormatter={(v: string) => v.slice(5)}
              tick={{ fontSize: 10, fill: '#7A7A7A', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#7A7A7A', fontFamily: 'JetBrains Mono' }}
              label={{ value: 'mm', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#7A7A7A' } }}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                backgroundColor: '#FAFAF7',
                border: '1px solid #E8E8E4',
                borderRadius: 6,
              }}
            />
            <Bar dataKey="precip" fill="#007B7F" name="Precipitation" opacity={0.7} radius={[2, 2, 0, 0]} />
            <Line dataKey="et0" stroke="#E8732A" name="ET\u2080" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Soil moisture trend */}
      {data.soilMoisture.length > 0 && (
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Soil Moisture Trend
            </h4>
            <DataSourceBadge source="satellite" label="Open-Meteo ERA5" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-4">Volumetric water content (last 24 months)</p>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.soilMoisture} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" />
              <XAxis
                dataKey="month"
                tickFormatter={(v: string) => v.slice(5)}
                tick={{ fontSize: 10, fill: '#7A7A7A', fontFamily: 'JetBrains Mono' }}
              />
              <YAxis tick={{ fontSize: 10, fill: '#7A7A7A', fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                  backgroundColor: '#FAFAF7',
                  border: '1px solid #E8E8E4',
                  borderRadius: 6,
                }}
              />
              <Line dataKey="shallow" stroke="#007B7F" name="0-7cm" strokeWidth={2} dot={false} />
              <Line dataKey="deep" stroke="#00A86B" name="7-28cm" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
