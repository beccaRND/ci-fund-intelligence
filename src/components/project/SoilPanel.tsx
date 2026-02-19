'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import MetricCard from '@/components/shared/MetricCard';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import type { ProcessedSoilData } from '@/lib/api/soilGrids';

interface SoilPanelProps {
  lat: number;
  lng: number;
}

export default function SoilPanel({ lat, lng }: SoilPanelProps) {
  const [data, setData] = useState<ProcessedSoilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/soil?lat=${lat}&lng=${lng}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setIsFallback(json.isFallback || false);
      } else {
        setError(json.fallbackNote || json.error || 'Failed to load soil data');
      }
    } catch {
      setError('Network error — could not reach soil API');
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
            Soil Baseline
          </h3>
          <DataSourceBadge source="satellite" label="ISRIC SoilGrids 250m" />
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Soil Baseline
          </h3>
        </div>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertTriangle size={24} className="text-ci-orange" />
          <p className="text-sm text-ci-gray-500 max-w-sm">{error}</p>
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

  // Depth profile chart data
  const depthData = data.depthProfile.map((d) => ({
    depth: d.depth.replace('cm', ''),
    soc: d.soc,
    bd: d.bulkDensity,
  }));

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
          Soil Baseline
        </h3>
        <DataSourceBadge
          source={isFallback ? 'computed' : 'satellite'}
          label={isFallback ? 'Regional estimates' : 'ISRIC SoilGrids 250m'}
        />
      </div>

      {isFallback && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-ci-gold-light rounded-[var(--radius-sm)] border border-ci-gold/20">
          <AlertTriangle size={14} className="text-ci-gold shrink-0" />
          <p className="text-[11px] text-ci-gray-700">
            SoilGrids API is temporarily unavailable. Showing estimated values from regional literature.
          </p>
          <button
            onClick={fetchData}
            className="text-[11px] text-ci-green font-semibold hover:underline shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <p className="text-xs text-ci-gray-500 mb-5">
        Soil properties at project centroid · 0-30cm depth average
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6 pb-6 border-b border-ci-gray-300/50">
        <MetricCard
          label="SOC (0-30cm)"
          value={`${data.socStock_tPerHa}`}
          unit="t C/ha"
          mono
        />
        <MetricCard
          label="Texture Class"
          value={data.textureClass}
        />
        <MetricCard
          label="pH"
          value={`${data.pH}`}
          mono
        />
        <MetricCard
          label="Bulk Density"
          value={`${data.bulkDensity}`}
          unit="g/cm³"
          mono
        />
      </div>

      {/* SOC Depth Profile */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-ci-charcoal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          SOC Depth Profile
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={depthData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#7A7A7A' }}
              tickFormatter={(v) => `${v} g/kg`}
            />
            <YAxis
              dataKey="depth"
              type="category"
              tick={{ fontSize: 11, fill: '#7A7A7A', fontFamily: 'var(--font-mono)' }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #F0F0EC',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0} g/kg`, 'SOC']}
            />
            <Bar dataKey="soc" fill="#00A86B" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Soil Texture Triangle (simplified visual) */}
      <div>
        <div className="text-sm font-semibold text-ci-charcoal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Soil Texture Composition
        </div>
        <div className="flex items-center gap-6">
          {/* Stacked bar representation */}
          <div className="flex-1">
            <div className="flex h-6 rounded-full overflow-hidden">
              <div
                className="flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ width: `${data.sand}%`, backgroundColor: '#C5A830' }}
                title={`Sand: ${data.sand}%`}
              >
                {data.sand > 15 && `${data.sand}%`}
              </div>
              <div
                className="flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ width: `${data.silt}%`, backgroundColor: '#007B7F' }}
                title={`Silt: ${data.silt}%`}
              >
                {data.silt > 15 && `${data.silt}%`}
              </div>
              <div
                className="flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ width: `${data.clay}%`, backgroundColor: '#E8732A' }}
                title={`Clay: ${data.clay}%`}
              >
                {data.clay > 15 && `${data.clay}%`}
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C5A830' }} />
                <span className="text-[11px] text-ci-gray-500">Sand {data.sand}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#007B7F' }} />
                <span className="text-[11px] text-ci-gray-500">Silt {data.silt}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E8732A' }} />
                <span className="text-[11px] text-ci-gray-500">Clay {data.clay}%</span>
              </div>
            </div>
          </div>

          {/* Texture class label */}
          <div className="text-center px-4 py-3 bg-ci-gray-100 rounded-[var(--radius-md)]">
            <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider mb-0.5">Class</div>
            <div className="text-sm font-bold text-ci-charcoal">{data.textureClass}</div>
          </div>
        </div>

        {/* CEC */}
        <div className="mt-4 pt-4 border-t border-ci-gray-300/50 flex items-center gap-4">
          <div>
            <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold">CEC </span>
            <span className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
              {data.cec} cmol/kg
            </span>
          </div>
          <DataSourceBadge
            source={isFallback ? 'computed' : 'satellite'}
            label={isFallback ? 'Estimated' : 'SoilGrids'}
          />
        </div>
      </div>
    </div>
  );
}
